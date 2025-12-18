/**
 * Referral Service (Milestone 3) — Cloudflare Worker.
 *
 * Contract: docs/openapi/referral.yaml
 * Key decisions:
 * - Downstream does NOT validate user JWT in M3.
 * - User-context is accepted only when request is authenticated as gateway-origin via X-Gateway-Auth (service JWT).
 * - Internal service-to-service auth uses Authorization: Bearer <service JWT>.
 * - Failure mode (M3): referral codes are lazily created on first GET /v1/referral/code if missing.
 */

import { createDb, sql } from '@go2asia/db';
import { createLogger, generateRequestId, getRequestId } from '@go2asia/logger';

export interface Env {
  ENVIRONMENT?: string;
  VERSION?: string;

  DATABASE_URL?: string;
  SERVICE_JWT_SECRET?: string;
}

type JwtVerifyResult =
  | { ok: true; payload: Record<string, unknown> }
  | { ok: false; error: string };

type Db = ReturnType<typeof createDb>;

type DbExecResult<T> = { rows: T[] };

const SERVICE_NAME = 'referral-service';

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

function getRows<T>(result: unknown): T[] {
  const rows = (result as Partial<DbExecResult<T>>).rows;
  return Array.isArray(rows) ? rows : [];
}

function generateReferralCode(): string {
  // Random alphanumeric code (M3). Uniqueness is enforced by DB unique constraint.
  // Use crypto for better randomness than Math.random.
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  let out = '';
  for (let i = 0; i < 8; i++) {
    out += alphabet[bytes[i] % alphabet.length];
  }
  return out;
}

async function getReferralCodeByUserId(db: Db, userId: string): Promise<string | null> {
  const result = await db.execute(
    sql`SELECT referral_code FROM referral_links WHERE user_id = ${userId} LIMIT 1`
  );
  const row = getRows<{ referral_code: string }>(result)[0];
  return row?.referral_code ?? null;
}

async function ensureReferralCode(db: Db, userId: string): Promise<{ code: string; created: boolean }> {
  const existing = await getReferralCodeByUserId(db, userId);
  if (existing) return { code: existing, created: false };

  // Retry on code collision
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateReferralCode();
    const id = crypto.randomUUID();

    try {
      const insert = await db.execute(sql`
        INSERT INTO referral_links (id, user_id, referral_code)
        VALUES (${id}, ${userId}, ${code})
        ON CONFLICT (user_id) DO NOTHING
        RETURNING referral_code
      `);

      const inserted = getRows<{ referral_code: string }>(insert)[0];
      if (inserted?.referral_code) return { code: inserted.referral_code, created: true };

      // Concurrent insert for the same user_id
      const after = await getReferralCodeByUserId(db, userId);
      if (after) return { code: after, created: false };
    } catch (err) {
      // Likely referral_code unique collision — retry
      void err;
    }
  }

  // Fallback
  const after = await getReferralCodeByUserId(db, userId);
  if (after) return { code: after, created: false };

  throw new Error('Failed to generate referral code');
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

      // User-facing
      if (request.method === 'GET' && path === '/v1/referral/code') {
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
        const ensured = await ensureReferralCode(db, userId);

        const res = json({ userId, code: ensured.code }, 200);
        res.headers.set('X-Request-Id', requestId);
        return res;
      }

      if (request.method === 'GET' && path === '/v1/referral/stats') {
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
        const ensured = await ensureReferralCode(db, userId);

        const countRes = await db.execute(
          sql`
            SELECT count(*)::int AS cnt
            FROM referral_relations
            WHERE referrer_id = ${userId}
          `
        );

        const cnt = Number(getRows<{ cnt: number }>(countRes)[0]?.cnt ?? 0);

        const res = json({ userId, code: ensured.code, directReferralsCount: cnt }, 200);
        res.headers.set('X-Request-Id', requestId);
        return res;
      }

      // Internal
      if (request.method === 'POST' && path === '/internal/referral/generate-code') {
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
        if (typeof userId !== 'string' || userId.length === 0) {
          const res = errorResponse('BadRequest', 'Missing userId', requestId, 400);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        const db = createDb(requireDatabase(env));
        const ensured = await ensureReferralCode(db, userId);

        const res = json({ userId, code: ensured.code, created: ensured.created }, 200);
        res.headers.set('X-Request-Id', requestId);
        return res;
      }

      if (request.method === 'POST' && path === '/internal/referral/link') {
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

        const refereeUserId = body?.refereeUserId;
        const referralCode = body?.referralCode;

        if (typeof refereeUserId !== 'string' || refereeUserId.length === 0) {
          const res = errorResponse('BadRequest', 'Missing refereeUserId', requestId, 400);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        if (typeof referralCode !== 'string' || referralCode.length === 0) {
          const res = errorResponse('BadRequest', 'Missing referralCode', requestId, 400);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        const db = createDb(requireDatabase(env));

        const linkRes = await db.execute(
          sql`
            SELECT user_id AS referrer_id
            FROM referral_links
            WHERE referral_code = ${referralCode}
            LIMIT 1
          `
        );

        const linkRow = getRows<{ referrer_id: string }>(linkRes)[0];
        if (!linkRow) {
          const res = errorResponse('NotFound', 'Referral code not found', requestId, 404);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        const referrerUserId = linkRow.referrer_id;
        if (referrerUserId === refereeUserId) {
          const res = errorResponse('Conflict', 'Referrer and referee cannot be the same user', requestId, 409);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        const existingRelRes = await db.execute(
          sql`
            SELECT referrer_id
            FROM referral_relations
            WHERE referee_id = ${refereeUserId}
            LIMIT 1
          `
        );

        const existingRel = getRows<{ referrer_id: string }>(existingRelRes)[0];
        if (existingRel) {
          if (existingRel.referrer_id !== referrerUserId) {
            const res = errorResponse('Conflict', 'Referee already has a referrer', requestId, 409);
            res.headers.set('X-Request-Id', requestId);
            return res;
          }

          const res = json({ refereeUserId, referrerUserId, linked: false }, 200);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        const relId = crypto.randomUUID();
        await db.execute(sql`
          INSERT INTO referral_relations (id, referrer_id, referee_id)
          VALUES (${relId}, ${referrerUserId}, ${refereeUserId})
        `);

        const res = json({ refereeUserId, referrerUserId, linked: true }, 200);
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
