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

  // Integrations
  POINTS_SERVICE_URL?: string;

  // Economy config (MVP)
  // e.g. "100"
  REFERRAL_FIRST_LOGIN_BONUS?: string;
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

async function signHs256Jwt(payload: Record<string, unknown>, secret: string): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const headerB64 = bytesToBase64Url(utf8ToBytes(JSON.stringify(header)));
  const payloadB64 = bytesToBase64Url(utf8ToBytes(JSON.stringify(payload)));
  const data = utf8ToBytes(`${headerB64}.${payloadB64}`);

  const key = await crypto.subtle.importKey(
    'raw',
    utf8ToBytes(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, data));
  const sigB64 = bytesToBase64Url(sig);
  return `${headerB64}.${payloadB64}.${sigB64}`;
}

async function createServiceJwt(env: Env, targetService: string, requestId: string): Promise<string | null> {
  if (!env.SERVICE_JWT_SECRET) return null;
  const now = Math.floor(Date.now() / 1000);
  return signHs256Jwt(
    {
      iss: 'go2asia-service-auth',
      aud: targetService,
      sub: SERVICE_NAME,
      iat: now,
      exp: now + 300, // 5 minutes
      rid: requestId,
    },
    env.SERVICE_JWT_SECRET
  );
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

function parseNonNegativeIntOrDefault(value: string | undefined, defaultValue: number): number {
  if (!value) return defaultValue;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n >= 0 ? n : defaultValue;
}

function getRows<T>(result: unknown): T[] {
  const rows = (result as Partial<DbExecResult<T>>).rows;
  return Array.isArray(rows) ? rows : [];
}

function requireUserId(request: Request, requestId: string): { ok: true; userId: string } | { ok: false; res: Response } {
  const userId = request.headers.get('X-User-ID');
  if (!userId) {
    return { ok: false, res: errorResponse('Unauthorized', 'Missing X-User-ID header', requestId, 401) };
  }
  return { ok: true, userId };
}

function isDevTestEnabled(env: Env): boolean {
  const environment = String(getEnvName(env) ?? '')
    .trim()
    .toLowerCase();
  const nodeEnv = String((env as unknown as { NODE_ENV?: string }).NODE_ENV ?? '')
    .trim()
    .toLowerCase();
  // DEV TEST ONLY: explicitly allow only in non-production envs.
  // - Cloudflare Workers usually won't have NODE_ENV, but local Node dev will.
  return (
    nodeEnv === 'development' ||
    environment === 'staging' ||
    environment === 'development' ||
    environment === 'dev'
  );
}

function parseDepth(depthRaw: string | null): 1 | 2 {
  const n = depthRaw ? Number.parseInt(depthRaw, 10) : 2;
  return n === 1 ? 1 : 2;
}

async function callPointsAdd(
  env: Env,
  requestId: string,
  logger: ReturnType<typeof createLogger>,
  input: { userId: string; amount: number; action: string; externalId: string; metadata?: Record<string, unknown> }
): Promise<{ ok: true; applied: boolean | null } | { ok: false; error: string; status?: number }> {
  if (!env.POINTS_SERVICE_URL || !env.SERVICE_JWT_SECRET) {
    logger.warn('Points Service integration not configured', { userId: input.userId, action: input.action });
    return { ok: false, error: 'Points Service not configured' };
  }

  const token = await createServiceJwt(env, 'points-service', requestId);
  if (!token) {
    logger.error('Failed to create service JWT for Points Service');
    return { ok: false, error: 'Service auth failed' };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000);

  try {
    const response = await fetch(`${env.POINTS_SERVICE_URL}/internal/points/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-Request-Id': requestId,
      },
      body: JSON.stringify({
        userId: input.userId,
        amount: input.amount,
        action: input.action,
        externalId: input.externalId,
        metadata: input.metadata ?? undefined,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      logger.warn('Points Service call failed', {
        userId: input.userId,
        action: input.action,
        status: response.status,
        body: text.slice(0, 200),
      });
      return { ok: false, error: `Points Service returned ${response.status}`, status: response.status };
    }

    const data = (await response.json().catch(() => null)) as { applied?: boolean } | null;
    return { ok: true, applied: typeof data?.applied === 'boolean' ? data.applied : null };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      logger.warn('Points Service call timed out', { userId: input.userId, action: input.action });
      return { ok: false, error: 'Timeout' };
    }
    logger.error('Points Service call error', error, { userId: input.userId, action: input.action });
    return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

function toIso(input: unknown): string {
  if (input instanceof Date) return input.toISOString();
  const d = new Date(String(input));
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
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

      // DEV TEST ONLY:
      // Temporary endpoint to seed L1 referrals for UI verification without Clerk/external auth.
      // How to remove after testing:
      // - delete this route block
      // - (optional) delete any devtest_* referee rows from referral_relations
      //   WHERE referee_id LIKE 'devtest_%' AND referrer_id = '<your referrerUserId>';
      //
      // Usage (staging):
      //   curl -k --ssl-no-revoke -X POST ^
      //     -H "Content-Type: application/json" ^
      //     -d "{\"referrerUserId\":\"<clerkUserId>\"}" ^
      //     https://go2asia-referral-service-staging.fred89059599296.workers.dev/_dev/seed-referrals
      //
      // This will create 3 test referees:
      // - #1 pending (first_login_at = null)
      // - #2 active  (first_login_at = now)
      // - #3 active  (first_login_at = now)
      if (request.method === 'POST' && path === '/_dev/seed-referrals') {
        const host = url.hostname;
        const isStagingHost = host.includes('-staging.');
        if (!isDevTestEnabled(env) && !isStagingHost) {
          const res = errorResponse('NotFound', 'No route for path: /_dev/seed-referrals', requestId, 404);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        const bodyUnknown: unknown = await request.json().catch(() => null);
        const body =
          bodyUnknown && typeof bodyUnknown === 'object' && !Array.isArray(bodyUnknown)
            ? (bodyUnknown as Record<string, unknown>)
            : null;

        const referrerUserId = body?.referrerUserId;
        if (typeof referrerUserId !== 'string' || referrerUserId.length === 0) {
          const res = errorResponse('BadRequest', 'Missing referrerUserId', requestId, 400);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        const db = createDb(requireDatabase(env));

        // Create stable deterministic referee ids so repeated runs don't create duplicates.
        const safeRef = referrerUserId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32) || 'ref';
        const now = new Date();
        const refereeIds = [1, 2, 3].map((i) => `devtest_${safeRef}_l1_${i}`);

        // Ensure referral code exists for referrer (nice for UX; also validates DB access)
        await ensureReferralCode(db, referrerUserId);

        const rows = [
          { refereeId: refereeIds[0], firstLoginAt: null as Date | null }, // pending
          { refereeId: refereeIds[1], firstLoginAt: now }, // active
          { refereeId: refereeIds[2], firstLoginAt: now }, // active
        ];

        // Insert relations idempotently:
        // - if referee already linked to this referrer => update first_login_at to match desired (only set if null->now)
        // - if referee linked to different referrer => leave as-is (avoid corrupting real data)
        for (const row of rows) {
          const existingRes = await db.execute(sql`
            SELECT referrer_id, first_login_at
            FROM referral_relations
            WHERE referee_id = ${row.refereeId}
            LIMIT 1
          `);

          const existing = getRows<{ referrer_id: string; first_login_at: Date | null }>(existingRes)[0] ?? null;
          if (existing) {
            if (existing.referrer_id === referrerUserId) {
              // pending -> active: set first_login_at if we want active and it is not set yet
              if (row.firstLoginAt && !existing.first_login_at) {
                await db.execute(sql`
                  UPDATE referral_relations
                  SET first_login_at = now()
                  WHERE referee_id = ${row.refereeId}
                `);
              }
            }
            continue;
          }

          const relId = crypto.randomUUID();
          await db.execute(sql`
            INSERT INTO referral_relations (id, referrer_id, referee_id, registered_at, first_login_at)
            VALUES (${relId}, ${referrerUserId}, ${row.refereeId}, now(), ${
            row.firstLoginAt ? sql`now()` : sql`NULL`
          })
          `);
        }

        const res = json(
          {
            ok: true,
            env: getEnvName(env),
            referrerUserId,
            createdReferees: [
              { userId: refereeIds[0], status: 'pending' },
              { userId: refereeIds[1], status: 'active' },
              { userId: refereeIds[2], status: 'active' },
            ],
            note: 'DEV TEST ONLY',
          },
          200,
          { 'Cache-Control': 'no-store' }
        );
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

        const uid = requireUserId(request, requestId);
        if (!uid.ok) {
          uid.res.headers.set('X-Request-Id', requestId);
          return uid.res;
        }
        const userId = uid.userId;

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

        const uid = requireUserId(request, requestId);
        if (!uid.ok) {
          uid.res.headers.set('X-Request-Id', requestId);
          return uid.res;
        }
        const userId = uid.userId;

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

      if (request.method === 'GET' && path === '/v1/referral/tree') {
        const auth = await requireGatewayOrigin(request, env, requestId, logger);
        if (!auth.ok) {
          auth.res.headers.set('X-Request-Id', requestId);
          return auth.res;
        }

        const uid = requireUserId(request, requestId);
        if (!uid.ok) {
          uid.res.headers.set('X-Request-Id', requestId);
          return uid.res;
        }
        const userId = uid.userId;

        const depth = parseDepth(url.searchParams.get('depth'));
        const db = createDb(requireDatabase(env));

        const directRes = await db.execute(sql`
          SELECT referee_id, registered_at, first_login_at
          FROM referral_relations
          WHERE referrer_id = ${userId}
          ORDER BY registered_at DESC
        `);

        const direct = getRows<{ referee_id: string; registered_at: Date; first_login_at: Date | null }>(directRes);

        // Second-level relations for all direct referrals (used for both depth=1 (counts) and depth=2 (list))
        const subRes = await db.execute(sql`
          SELECT d.referee_id AS parent_id, r.referee_id, r.registered_at, r.first_login_at
          FROM referral_relations d
          JOIN referral_relations r
            ON r.referrer_id = d.referee_id
          WHERE d.referrer_id = ${userId}
          ORDER BY r.registered_at DESC
        `);

        const subs = getRows<{
          parent_id: string;
          referee_id: string;
          registered_at: Date;
          first_login_at: Date | null;
        }>(subRes);

        const subsByParent = new Map<
          string,
          { userId: string; registeredAt: string; firstLoginAt: string | null; isActive: boolean }[]
        >();

        for (const row of subs) {
          const list = subsByParent.get(row.parent_id) ?? [];
          list.push({
            userId: row.referee_id,
            registeredAt: toIso(row.registered_at),
            firstLoginAt: row.first_login_at ? toIso(row.first_login_at) : null,
            isActive: Boolean(row.first_login_at),
          });
          subsByParent.set(row.parent_id, list);
        }

        const referrals = direct.map((r) => {
          const children = subsByParent.get(r.referee_id) ?? [];

          const node: Record<string, unknown> = {
            userId: r.referee_id,
            registeredAt: toIso(r.registered_at),
            firstLoginAt: r.first_login_at ? toIso(r.first_login_at) : null,
            isActive: Boolean(r.first_login_at),
            subReferralsCount: children.length,
          };

          if (depth === 2) {
            node.subReferrals = children.map((c) => ({
              ...c,
              subReferralsCount: 0,
            }));
          }

          return node;
        });

        const res = json(
          {
            userId,
            depth,
            referrals,
          },
          200,
          { 'Cache-Control': 'no-store' }
        );
        res.headers.set('X-Request-Id', requestId);
        return res;
      }

      // User-facing: claim referral code for current user (idempotent).
      if (request.method === 'POST' && path === '/v1/referral/claim') {
        const auth = await requireGatewayOrigin(request, env, requestId, logger);
        if (!auth.ok) {
          auth.res.headers.set('X-Request-Id', requestId);
          return auth.res;
        }

        const uid = requireUserId(request, requestId);
        if (!uid.ok) {
          uid.res.headers.set('X-Request-Id', requestId);
          return uid.res;
        }
        const refereeId = uid.userId;

        const bodyUnknown: unknown = await request.json().catch(() => null);
        const body =
          bodyUnknown && typeof bodyUnknown === 'object' && !Array.isArray(bodyUnknown)
            ? (bodyUnknown as Record<string, unknown>)
            : null;
        const codeRaw = body?.code;
        const code = typeof codeRaw === 'string' ? codeRaw.trim() : '';
        if (!code) {
          const res = errorResponse('BadRequest', 'Missing code', requestId, 400);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        const db = createDb(requireDatabase(env));

        const refRes = await db.execute(sql`
          SELECT user_id
          FROM referral_links
          WHERE referral_code = ${code}
          LIMIT 1
        `);
        const referrerId = getRows<{ user_id: string }>(refRes)[0]?.user_id ?? null;
        if (!referrerId) {
          const res = errorResponse('NotFound', 'Referral code not found', requestId, 404);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }
        if (referrerId === refereeId) {
          const res = errorResponse('Conflict', 'Cannot claim own referral code', requestId, 409);
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        const existingRes = await db.execute(sql`
          SELECT referrer_id
          FROM referral_relations
          WHERE referee_id = ${refereeId}
          LIMIT 1
        `);
        const existing = getRows<{ referrer_id: string }>(existingRes)[0]?.referrer_id ?? null;
        if (existing) {
          if (existing !== referrerId) {
            const res = errorResponse('Conflict', 'Referral already claimed with different referrer', requestId, 409);
            res.headers.set('X-Request-Id', requestId);
            return res;
          }
          const res = json(
            { ok: true, claimed: false, referrerId, refereeId, code, reason: 'already_claimed' },
            200,
            { 'Cache-Control': 'no-store' }
          );
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        const relId = crypto.randomUUID();
        await db.execute(sql`
          INSERT INTO referral_relations (id, referrer_id, referee_id, registered_at, first_login_at)
          VALUES (${relId}, ${referrerId}, ${refereeId}, now(), NULL)
          ON CONFLICT (referee_id) DO NOTHING
        `);

        const res = json({ ok: true, claimed: true, referrerId, refereeId, code }, 200, { 'Cache-Control': 'no-store' });
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

      // Internal: mark first login for referee (idempotent)
      if (request.method === 'POST' && path === '/internal/referral/mark-first-login') {
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

        // 1) Ensure first_login_at is set (idempotent). We still want to be able to retry the bonus call,
        // so we will attempt to call Points even if first_login_at was already set; points-service dedupes by externalId.
        const relRes = await db.execute(sql`
          SELECT referrer_id, first_login_at
          FROM referral_relations
          WHERE referee_id = ${userId}
          LIMIT 1
        `);
        const rel = getRows<{ referrer_id: string; first_login_at: Date | null }>(relRes)[0] ?? null;
        if (!rel) {
          const res = json(
            { ok: true, userId, relationFound: false, activated: false, updatedRows: 0 },
            200,
            { 'Cache-Control': 'no-store' }
          );
          res.headers.set('X-Request-Id', requestId);
          return res;
        }

        const wasActive = Boolean(rel.first_login_at);
        let activated = false;

        if (!wasActive) {
          const upd = await db.execute(sql`
            UPDATE referral_relations
            SET first_login_at = now()
            WHERE referee_id = ${userId} AND first_login_at IS NULL
          `);
          const rowCount = (upd as unknown as { rowCount?: number }).rowCount ?? 0;
          activated = rowCount > 0;
        }

        // 2) Award bonus to referrer (MVP): +N Points for referrer on referee first login.
        const bonus = parseNonNegativeIntOrDefault(env.REFERRAL_FIRST_LOGIN_BONUS, 100);
        const externalId = `referral:first_login:${rel.referrer_id}:${userId}`;

        let points: { ok: boolean; applied?: boolean | null; error?: string } = { ok: false };
        if (bonus > 0) {
          const result = await callPointsAdd(env, requestId, logger, {
            userId: rel.referrer_id,
            amount: bonus,
            action: 'referral_bonus_referrer',
            externalId,
            metadata: { refereeUserId: userId },
          });
          points = result.ok ? { ok: true, applied: result.applied } : { ok: false, error: result.error };
          if (!result.ok) {
            logger.warn('Referral bonus points failed (non-blocking)', { referrerId: rel.referrer_id, refereeId: userId });
          }
        } else {
          // Explicitly disabled by config
          points = { ok: true, applied: null };
        }

        const res = json(
          {
            ok: true,
            userId,
            relationFound: true,
            activated,
            updatedRows: activated ? 1 : 0,
            referrerId: rel.referrer_id,
            bonus: { amount: bonus, currency: 'POINTS' },
            externalId,
            points,
          },
          200,
          { 'Cache-Control': 'no-store' }
        );
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
