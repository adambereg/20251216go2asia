/**
 * Points Service (Milestone 3) — Cloudflare Worker.
 *
 * Contract: docs/openapi/points.yaml
 * Key decisions:
 * - Downstream does NOT validate user JWT in M3.
 * - User-context is accepted only when request is authenticated as gateway-origin via X-Gateway-Auth (service JWT).
 * - Internal service-to-service auth uses Authorization: Bearer <service JWT>.
 * - Idempotency SSOT: externalId. If existing externalId has different payload => 409 Conflict + integration error log.
 */

import { createDb, sql } from '@go2asia/db';
import { createLogger, generateRequestId, getRequestId } from '@go2asia/logger';

export interface Env {
  ENVIRONMENT?: string;
  VERSION?: string;

  // DB
  DATABASE_URL?: string;

  // Shared secret for service JWT (gateway-origin + internal)
  SERVICE_JWT_SECRET?: string;

  // Limits (M3): simple configurable per-user cap
  POINTS_VELOCITY_CAP?: string; // integer points
  POINTS_VELOCITY_WINDOW_SECONDS?: string; // integer seconds
}

type JsonPrimitive = string | number | boolean | null;

type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

type JwtVerifyResult =
  | { ok: true; payload: Record<string, unknown> }
  | { ok: false; error: string };

type Db = ReturnType<typeof createDb>;

type DbExecResult<T> = { rows: T[] };

const SERVICE_NAME = 'points-service';

const ACTIONS_M3_MIN = new Set([
  'registration',
  'first_login',
  'referral_bonus_referee',
  'referral_bonus_referrer',
  'event_registration',
]);

function json(data: unknown, status = 200, headers?: Record<string, string>): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}

function errorResponse(error: string, message: string, requestId?: string, status = 500): Response {
  return json(
    {
      error,
      message,
      requestId,
    },
    status
  );
}

function getEnvName(env: Env): string {
  return env.ENVIRONMENT ?? 'staging';
}

function getVersion(env: Env): string {
  return env.VERSION ?? 'unknown';
}

function handleHealth(env: Env): Response {
  return json(
    {
      service: SERVICE_NAME,
      env: getEnvName(env),
      status: 'ok',
      version: getVersion(env),
    },
    200,
    {
      'Cache-Control': 'no-store',
    }
  );
}

function base64UrlToBytes(input: string): Uint8Array {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  const b64 = normalized + pad;

  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  const b64 = btoa(bin);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function utf8ToBytes(input: string): Uint8Array {
  return new TextEncoder().encode(input);
}

function parseJsonObject(input: string): Record<string, unknown> | null {
  try {
    const v: unknown = JSON.parse(input);
    if (!v || typeof v !== 'object' || Array.isArray(v)) return null;
    return v as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function verifyHs256Jwt(token: string, secret: string): Promise<JwtVerifyResult> {
  const parts = token.split('.');
  if (parts.length !== 3) return { ok: false, error: 'JWT must have 3 parts' };

  const [headerB64, payloadB64, signatureB64] = parts;

  const headerJson = parseJsonObject(new TextDecoder().decode(base64UrlToBytes(headerB64)));
  const payloadJson = parseJsonObject(new TextDecoder().decode(base64UrlToBytes(payloadB64)));
  if (!headerJson || !payloadJson) return { ok: false, error: 'JWT header/payload is not valid JSON object' };

  if (headerJson.alg !== 'HS256') return { ok: false, error: 'Only HS256 is supported' };

  const key = await crypto.subtle.importKey(
    'raw',
    utf8ToBytes(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const data = utf8ToBytes(`${headerB64}.${payloadB64}`);
  const signature = base64UrlToBytes(signatureB64);

  const ok = await crypto.subtle.verify('HMAC', key, signature, data);
  if (!ok) return { ok: false, error: 'Invalid signature' };

  // Optional exp validation
  const exp = payloadJson.exp;
  if (typeof exp === 'number') {
    const now = Math.floor(Date.now() / 1000);
    if (now >= exp) return { ok: false, error: 'Token expired' };
  }

  return { ok: true, payload: payloadJson };
}

async function requireGatewayOrigin(
  request: Request,
  env: Env,
  requestId: string,
  logger: ReturnType<typeof createLogger>
): Promise<{ ok: true } | { ok: false; res: Response }> {
  const secret = env.SERVICE_JWT_SECRET;
  if (!secret) {
    logger.error('Missing SERVICE_JWT_SECRET (misconfiguration)');
    return { ok: false, res: errorResponse('Unauthorized', 'Service auth is not configured', requestId, 401) };
  }

  const token = request.headers.get('X-Gateway-Auth');
  if (!token) return { ok: false, res: errorResponse('Unauthorized', 'Missing X-Gateway-Auth header', requestId, 401) };

  const verified = await verifyHs256Jwt(token, secret);
  if (!verified.ok) {
    logger.warn('Invalid gateway-origin token', { reason: verified.error });
    return { ok: false, res: errorResponse('Unauthorized', 'Invalid X-Gateway-Auth token', requestId, 401) };
  }

  return { ok: true };
}

async function requireServiceAuth(
  request: Request,
  env: Env,
  requestId: string,
  logger: ReturnType<typeof createLogger>
): Promise<{ ok: true } | { ok: false; res: Response }> {
  const secret = env.SERVICE_JWT_SECRET;
  if (!secret) {
    logger.error('Missing SERVICE_JWT_SECRET (misconfiguration)');
    return { ok: false, res: errorResponse('Unauthorized', 'Service auth is not configured', requestId, 401) };
  }

  const auth = request.headers.get('Authorization') ?? '';
  const match = auth.match(/^Bearer\s+(.+)$/i);
  if (!match) return { ok: false, res: errorResponse('Unauthorized', 'Missing Authorization: Bearer token', requestId, 401) };

  const verified = await verifyHs256Jwt(match[1], secret);
  if (!verified.ok) {
    logger.warn('Invalid service token', { reason: verified.error });
    return { ok: false, res: errorResponse('Unauthorized', 'Invalid service token', requestId, 401) };
  }

  return { ok: true };
}

function requireDatabase(env: Env): string {
  if (!env.DATABASE_URL) throw new Error('Missing DATABASE_URL');
  return env.DATABASE_URL;
}

function parseIntOrDefault(value: string | undefined, defaultValue: number): number {
  if (!value) return defaultValue;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : defaultValue;
}

function parseCursor(cursor: string): { createdAt: Date; id: string } | null {
  try {
    const raw = new TextDecoder().decode(base64UrlToBytes(cursor));
    const parsed = parseJsonObject(raw);
    if (!parsed) return null;
    const createdAtRaw = parsed.createdAt;
    const idRaw = parsed.id;
    if (typeof createdAtRaw !== 'string' || typeof idRaw !== 'string') return null;
    const createdAt = new Date(createdAtRaw);
    if (Number.isNaN(createdAt.getTime())) return null;
    return { createdAt, id: idRaw };
  } catch {
    return null;
  }
}

function makeCursor(input: { createdAt: Date; id: string }): string {
  const payload = JSON.stringify({ createdAt: input.createdAt.toISOString(), id: input.id });
  return bytesToBase64Url(utf8ToBytes(payload));
}

function actionIsOneTimePerUser(action: string): boolean {
  return action === 'registration' || action === 'first_login';
}

function getRows<T>(result: unknown): T[] {
  const rows = (result as Partial<DbExecResult<T>>).rows;
  return Array.isArray(rows) ? rows : [];
}

async function getUserBalance(db: Db, userId: string): Promise<{ balance: number; updatedAt: Date }> {
  const result = await db.execute(
    sql`SELECT balance, updated_at FROM user_balances WHERE user_id = ${userId} LIMIT 1`
  );

  const row = getRows<{ balance: number; updated_at: Date }>(result)[0];
  if (!row) return { balance: 0, updatedAt: new Date() };

  return {
    balance: Number(row.balance ?? 0),
    updatedAt: row.updated_at instanceof Date ? row.updated_at : new Date(row.updated_at),
  };
}

async function getTransactionByExternalId(db: Db, externalId: string): Promise<null | {
  id: string;
  user_id: string;
  amount: number;
  reason: string;
  external_id: string;
}> {
  const result = await db.execute(
    sql`
      SELECT id, user_id, amount, reason, external_id
      FROM points_transactions
      WHERE external_id = ${externalId}
      LIMIT 1
    `
  );

  return getRows<{ id: string; user_id: string; amount: number; reason: string; external_id: string }>(result)[0] ?? null;
}

async function enforceVelocityCap(
  db: Db,
  userId: string,
  amountToAdd: number,
  cap: number,
  windowSeconds: number
): Promise<{ ok: true } | { ok: false; error: string }> {
  const windowStart = new Date(Date.now() - windowSeconds * 1000);

  const result = await db.execute(
    sql`
      SELECT coalesce(sum(amount), 0)::int AS total
      FROM points_transactions
      WHERE user_id = ${userId}
        AND created_at >= ${windowStart}
    `
  );

  const row = getRows<{ total: number }>(result)[0];
  const current = Number(row?.total ?? 0);
  if (current + amountToAdd > cap) return { ok: false, error: 'Velocity cap exceeded' };
  return { ok: true };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const requestId = getRequestId(request) || generateRequestId();
    const logger = createLogger(requestId, SERVICE_NAME);

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      if (path === '/health' || path === '/version') {
        const res = handleHealth(env);
        res.headers.set('X-Request-Id', requestId);
        return res;
      }

      // User-facing (gateway-origin) endpoints
      if (request.method === 'GET' && path === '/v1/points/balance') {
        const auth = await requireGatewayOrigin(request, env, requestId, logger);
        if (!auth.ok) {
          auth.res.headers.set('X-Request-Id', requestId);
          return auth.res;
        }

        const userId = request.headers.get('X-User-ID');
        if (!userId) {
          const res = errorResponse('Unauthorized', 'Missing X-User-ID header', requestId, 401);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        const db = createDb(requireDatabase(env));
        const { balance, updatedAt } = await getUserBalance(db, userId);

        const res = json({ userId, balance, updatedAt: updatedAt.toISOString() }, 200);
        res.headers.set('X-Request-Id', requestId);
        return res;
      }

      if (request.method === 'GET' && path === '/v1/points/transactions') {
        const auth = await requireGatewayOrigin(request, env, requestId, logger);
        if (!auth.ok) {
          auth.res.headers.set('X-Request-Id', requestId);
          return auth.res;
        }

        const userId = request.headers.get('X-User-ID');
        if (!userId) {
          const res = errorResponse('Unauthorized', 'Missing X-User-ID header', requestId, 401);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        const limit = Math.min(
          100,
          Math.max(1, parseIntOrDefault(url.searchParams.get('limit') ?? undefined, 20))
        );

        const cursorRaw = url.searchParams.get('cursor') ?? undefined;
        const cursorParsed = cursorRaw ? parseCursor(cursorRaw) : null;

        const db = createDb(requireDatabase(env));

        const cursorClause = cursorParsed
          ? sql`AND (created_at < ${cursorParsed.createdAt} OR (created_at = ${cursorParsed.createdAt} AND id < ${cursorParsed.id}))`
          : sql``;

        const result = await db.execute(
          sql`
            SELECT id, user_id, amount, reason, external_id, metadata, created_at
            FROM points_transactions
            WHERE user_id = ${userId}
            ${cursorClause}
            ORDER BY created_at DESC, id DESC
            LIMIT ${limit + 1}
          `
        );

        const rows = getRows<{
          id: string;
          user_id: string;
          amount: number;
          reason: string;
          external_id: string;
          metadata: unknown;
          created_at: Date;
        }>(result);

        const page = rows.slice(0, limit);
        const hasNext = rows.length > limit;
        const last = page[page.length - 1];

        const items = page.map((t) => ({
          id: t.id,
          userId: t.user_id,
          amount: Number(t.amount),
          action: t.reason,
          externalId: t.external_id,
          createdAt: (t.created_at instanceof Date ? t.created_at : new Date(t.created_at)).toISOString(),
          metadata: (t.metadata ?? {}) as JsonValue,
        }));

        const res = json(
          {
            items,
            nextCursor:
              hasNext && last
                ? makeCursor({
                    createdAt: last.created_at instanceof Date ? last.created_at : new Date(last.created_at),
                    id: last.id,
                  })
                : null,
          },
          200
        );
        res.headers.set('X-Request-Id', requestId);
        return res;
      }

      // Internal endpoint
      if (request.method === 'POST' && path === '/internal/points/add') {
        const auth = await requireServiceAuth(request, env, requestId, logger);
        if (!auth.ok) {
          auth.res.headers.set('X-Request-Id', requestId);
          return auth.res;
        }

        const bodyUnknown: unknown = await request.json().catch(() => null);
        const body =
          bodyUnknown && typeof bodyUnknown === 'object' && !Array.isArray(bodyUnknown)
            ? (bodyUnknown as Record<string, unknown>)
            : null;

        const userId = body?.userId;
        const amount = body?.amount;
        const action = body?.action;
        const externalId = body?.externalId;
        const metadata = body?.metadata;

        if (typeof userId !== 'string' || userId.length === 0) {
          const res = errorResponse('BadRequest', 'Missing userId', requestId, 400);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        if (typeof amount !== 'number' || !Number.isFinite(amount) || amount < 1) {
          const res = errorResponse('BadRequest', 'Invalid amount', requestId, 400);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        if (typeof action !== 'string' || !ACTIONS_M3_MIN.has(action)) {
          const res = errorResponse('BadRequest', 'Invalid action', requestId, 400);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        if (typeof externalId !== 'string' || externalId.length === 0) {
          const res = errorResponse('BadRequest', 'Missing externalId', requestId, 400);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        const db = createDb(requireDatabase(env));

        // Idempotency lookup
        const existing = await getTransactionByExternalId(db, externalId);
        if (existing) {
          const conflict = existing.amount !== amount || existing.reason !== action;
          if (conflict) {
            logger.error('Idempotency conflict (integration error)', {
              externalId,
              existing: { amount: existing.amount, action: existing.reason },
              incoming: { amount, action },
            });
            const res = errorResponse('Conflict', 'externalId already exists with different payload', requestId, 409);
            res.headers.set('X-Request-Id', requestId);
            return res;
          }

          const { balance } = await getUserBalance(db, userId);
          const res = json({ transactionId: existing.id, applied: false, balance }, 200);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        // Per-user velocity cap (M3)
        const cap = parseIntOrDefault(env.POINTS_VELOCITY_CAP, 1000);
        const windowSeconds = parseIntOrDefault(env.POINTS_VELOCITY_WINDOW_SECONDS, 3600);

        const velocity = await enforceVelocityCap(db, userId, amount, cap, windowSeconds);
        if (!velocity.ok) {
          const res = errorResponse('RateLimited', velocity.error, requestId, 429);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        // Simple per-action limit (M3): one-time actions only
        if (actionIsOneTimePerUser(action)) {
          const priorRes = await db.execute(
            sql`
              SELECT id
              FROM points_transactions
              WHERE user_id = ${userId}
                AND reason = ${action}
              LIMIT 1
            `
          );

          const prior = getRows<{ id: string }>(priorRes)[0];
          if (prior) {
            const { balance } = await getUserBalance(db, userId);
            const res = json({ transactionId: prior.id, applied: false, balance }, 200);
            res.headers.set('X-Request-Id', requestId);
            return res;
          }
        }

        const txId = crypto.randomUUID();

        // Atomic insert + balance update via SQL (avoid relying on driver-level transactions)
        const applyRes = await db.execute(sql`
          WITH ins AS (
            INSERT INTO points_transactions (
              id,
              user_id,
              amount,
              reason,
              external_id,
              metadata
            )
            VALUES (
              ${txId},
              ${userId},
              ${amount},
              ${action},
              ${externalId},
              ${JSON.stringify(metadata ?? {})}::jsonb
            )
            ON CONFLICT (external_id) DO NOTHING
            RETURNING id, user_id, amount, reason, external_id
          ),
          up AS (
            INSERT INTO user_balances (user_id, balance, updated_at)
            SELECT user_id, amount, now() FROM ins
            ON CONFLICT (user_id) DO UPDATE
              SET balance = user_balances.balance + EXCLUDED.balance,
                  updated_at = now()
            RETURNING user_id, balance
          )
          SELECT
            (SELECT id FROM ins) AS transaction_id,
            (SELECT balance FROM up) AS balance;
        `);

        const row = getRows<{ transaction_id: string | null; balance: number | null }>(applyRes)[0];

        // If concurrent insert happened, ins is empty => transaction_id null
        if (!row?.transaction_id) {
          const existing2 = await getTransactionByExternalId(db, externalId);
          if (!existing2) {
            logger.error('Insert returned no rows but externalId not found (unexpected)', { externalId });
            const res = errorResponse('InternalError', 'Failed to apply points', requestId, 500);
            res.headers.set('X-Request-Id', requestId);
            return res;
          }

          const conflict = existing2.amount !== amount || existing2.reason !== action;
          if (conflict) {
            logger.error('Idempotency conflict after concurrent insert (integration error)', {
              externalId,
              existing: { amount: existing2.amount, action: existing2.reason },
              incoming: { amount, action },
            });
            const res = errorResponse('Conflict', 'externalId already exists with different payload', requestId, 409);
            res.headers.set('X-Request-Id', requestId);
            return res;
          }

          const { balance } = await getUserBalance(db, userId);
          const res = json({ transactionId: existing2.id, applied: false, balance }, 200);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        const res = json(
          {
            transactionId: row.transaction_id,
            applied: true,
            balance: Number(row.balance ?? 0),
          },
          200
        );
        res.headers.set('X-Request-Id', requestId);
        return res;
      }

      logger.warn('Unhandled route', { method: request.method, path });
      const res = errorResponse('NotFound', `No route for path: ${path}`, requestId, 404);
      res.headers.set('X-Request-Id', requestId);
      return res;
    } catch (err) {
      logger.error('Unhandled error', { err: String(err) });
      const res = errorResponse('InternalError', 'Unexpected error', requestId, 500);
      res.headers.set('X-Request-Id', requestId);
      return res;
    }
  },
};
