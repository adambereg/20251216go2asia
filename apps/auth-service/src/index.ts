/**
 * Auth Service (staging) — Milestone 3 integration.
 *
 * Handles:
 * - Clerk webhooks (user.created, user.updated)
 * - Integration with Points Service (registration, first_login)
 * - Integration with Referral Service (generate code)
 */

import { createDb, sql } from '@go2asia/db';
import { createLogger, generateRequestId, getRequestId } from '@go2asia/logger';

export interface Env {
  ENVIRONMENT?: string;
  VERSION?: string;
  // Service URLs
  POINTS_SERVICE_URL?: string;
  REFERRAL_SERVICE_URL?: string;
  // Secrets
  SERVICE_JWT_SECRET?: string;
  CLERK_WEBHOOK_SECRET?: string;
  // Database (optional for M3, may be needed for user tracking)
  DATABASE_URL?: string;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function handleHealth(env: Env): Response {
  return json({
    service: 'auth-service',
    env: env.ENVIRONMENT ?? 'staging',
    status: 'ok',
    version: env.VERSION ?? 'unknown',
  });
}

function handleNotFound(path: string): Response {
  return json(
    {
      error: {
        code: 'NOT_FOUND',
        message: `No route for path: ${path}`,
      },
    },
    404
  );
}

// JWT utilities (copied from api-gateway for service-to-service auth)

type JwtVerifyResult = { ok: true; payload: Record<string, unknown> } | { ok: false; error: string };

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

  const header = parseJsonObject(new TextDecoder().decode(base64UrlToBytes(headerB64)));
  const payload = parseJsonObject(new TextDecoder().decode(base64UrlToBytes(payloadB64)));
  if (!header || !payload) return { ok: false, error: 'JWT header/payload is not valid JSON object' };

  if (header.alg !== 'HS256') return { ok: false, error: 'Only HS256 is supported' };

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

  const exp = payload.exp;
  if (typeof exp === 'number') {
    const now = Math.floor(Date.now() / 1000);
    if (now >= exp) return { ok: false, error: 'Token expired' };
  }

  return { ok: true, payload };
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
      sub: 'auth-service',
      iat: now,
      exp: now + 300, // 5 minutes
      rid: requestId,
    },
    env.SERVICE_JWT_SECRET
  );
}

function requireDatabase(env: Env): string {
  if (!env.DATABASE_URL) throw new Error('Missing DATABASE_URL');
  return env.DATABASE_URL;
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
    return {
      ok: false,
      res: json(
        { error: { code: 'SERVICE_AUTH_NOT_CONFIGURED', message: 'Service auth is not configured' }, requestId },
        503
      ),
    };
  }

  const token = request.headers.get('X-Gateway-Auth');
  if (!token) {
    return { ok: false, res: json({ error: { code: 'UNAUTHORIZED', message: 'Missing X-Gateway-Auth' }, requestId }, 401) };
  }

  const verified = await verifyHs256Jwt(token, secret);
  if (!verified.ok) {
    logger.warn('Invalid gateway-origin token', { reason: verified.error });
    return { ok: false, res: json({ error: { code: 'UNAUTHORIZED', message: 'Invalid X-Gateway-Auth' }, requestId }, 401) };
  }

  return { ok: true };
}

async function handleEnsureUser(
  request: Request,
  env: Env,
  requestId: string,
  logger: ReturnType<typeof createLogger>
): Promise<Response> {
  const auth = await requireGatewayOrigin(request, env, requestId, logger);
  if (!auth.ok) return auth.res;

  const clerkId = request.headers.get('X-User-ID');
  if (!clerkId) return json({ error: { code: 'UNAUTHORIZED', message: 'Missing X-User-ID' }, requestId }, 401);

  const bodyUnknown: unknown = await request.json().catch(() => null);
  const body =
    bodyUnknown && typeof bodyUnknown === 'object' && !Array.isArray(bodyUnknown)
      ? (bodyUnknown as Record<string, unknown>)
      : null;

  const emailRaw = body?.email;
  const email =
    (typeof emailRaw === 'string' && emailRaw.trim().length > 0 ? emailRaw.trim() : null) ||
    request.headers.get('X-User-Email')?.trim() ||
    null;

  if (!email) {
    return json(
      { error: { code: 'BAD_REQUEST', message: 'Missing email (send body.email)' }, requestId },
      400
    );
  }

  const db = createDb(requireDatabase(env));

  // MVP mapping: use Clerk userId as both users.id and users.clerk_id (SSOT in other tables already).
  const userId = clerkId;

  const result = await db.execute(sql`
    INSERT INTO users (id, clerk_id, email, role, created_at, updated_at)
    VALUES (${userId}, ${clerkId}, ${email}, 'spacer', now(), now())
    ON CONFLICT (clerk_id) DO UPDATE
      SET email = EXCLUDED.email,
          updated_at = now()
    RETURNING id, clerk_id, email, role, created_at, updated_at
  `);

  const row = (result as unknown as { rows?: any[] }).rows?.[0] ?? null;

  // Also mark "first login" for referral relation (so pending -> active after real sign-in).
  // Non-blocking: if referral-service isn't configured, users/ensure should still succeed.
  const referralLogin = await callReferralFirstLogin(env, userId, requestId, logger);
  if (!referralLogin.ok) {
    logger.warn('Referral first login mark failed (non-blocking)', { userId, error: referralLogin.error });
  }

  return json({ ok: true, user: row, requestId }, 200);
}

async function callPointsService(
  env: Env,
  userId: string,
  amount: number,
  action: string,
  externalId: string,
  requestId: string,
  logger: ReturnType<typeof createLogger>
): Promise<{ ok: boolean; error?: string }> {
  if (!env.POINTS_SERVICE_URL || !env.SERVICE_JWT_SECRET) {
    logger.warn('Points Service integration not configured', { userId, action });
    return { ok: false, error: 'Points Service not configured' };
  }

  const token = await createServiceJwt(env, 'points-service', requestId);
  if (!token) {
    logger.error('Failed to create service JWT for Points Service');
    return { ok: false, error: 'Service auth failed' };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout

  try {
    const response = await fetch(`${env.POINTS_SERVICE_URL}/internal/points/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-Request-Id': requestId,
      },
      body: JSON.stringify({
        userId,
        amount,
        action,
        externalId,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      logger.warn('Points Service call failed', {
        userId,
        action,
        status: response.status,
        body: text,
      });
      return { ok: false, error: `Points Service returned ${response.status}` };
    }

    logger.info('Points Service call succeeded', { userId, action, amount });
    return { ok: true };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      logger.warn('Points Service call timed out', { userId, action });
      return { ok: false, error: 'Timeout' };
    }
    logger.error('Points Service call error', error, { userId, action });
    return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function callReferralService(
  env: Env,
  userId: string,
  requestId: string,
  logger: ReturnType<typeof createLogger>
): Promise<{ ok: boolean; code?: string; error?: string }> {
  if (!env.REFERRAL_SERVICE_URL || !env.SERVICE_JWT_SECRET) {
    logger.warn('Referral Service integration not configured', { userId });
    return { ok: false, error: 'Referral Service not configured' };
  }

  const token = await createServiceJwt(env, 'referral-service', requestId);
  if (!token) {
    logger.error('Failed to create service JWT for Referral Service');
    return { ok: false, error: 'Service auth failed' };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout

  try {
    const response = await fetch(`${env.REFERRAL_SERVICE_URL}/internal/referral/generate-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-Request-Id': requestId,
      },
      body: JSON.stringify({ userId }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      logger.warn('Referral Service call failed', {
        userId,
        status: response.status,
        body: text,
      });
      return { ok: false, error: `Referral Service returned ${response.status}` };
    }

    const data = (await response.json().catch(() => null)) as { code?: string } | null;
    logger.info('Referral Service call succeeded', { userId, code: data?.code });
    return { ok: true, code: data?.code };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      logger.warn('Referral Service call timed out', { userId });
      return { ok: false, error: 'Timeout' };
    }
    logger.error('Referral Service call error', error, { userId });
    return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function callReferralFirstLogin(
  env: Env,
  userId: string,
  requestId: string,
  logger: ReturnType<typeof createLogger>
): Promise<{ ok: boolean; error?: string }> {
  if (!env.REFERRAL_SERVICE_URL || !env.SERVICE_JWT_SECRET) {
    return { ok: false, error: 'Referral Service not configured' };
  }

  const token = await createServiceJwt(env, 'referral-service', requestId);
  if (!token) return { ok: false, error: 'Service auth failed' };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000);

  try {
    const response = await fetch(`${env.REFERRAL_SERVICE_URL}/internal/referral/mark-first-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-Request-Id': requestId,
      },
      body: JSON.stringify({ userId }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      logger.warn('Referral first-login call failed', { userId, status: response.status, body: text });
      return { ok: false, error: `Referral Service returned ${response.status}` };
    }

    return { ok: true };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') return { ok: false, error: 'Timeout' };
    logger.error('Referral first-login call error', error, { userId });
    return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function handleClerkWebhook(
  request: Request,
  env: Env,
  requestId: string,
  logger: ReturnType<typeof createLogger>
): Promise<Response> {
  // M3: Basic webhook handling (full Clerk signature verification is post-M3)
  const bodyUnknown: unknown = await request.json().catch(() => null);
  const body = bodyUnknown && typeof bodyUnknown === 'object' && !Array.isArray(bodyUnknown) ? (bodyUnknown as Record<string, unknown>) : null;

  if (!body || typeof body.type !== 'string') {
    logger.warn('Invalid webhook payload', { body });
    return json({ error: { code: 'BadRequest', message: 'Invalid webhook payload' } }, 400);
  }

  const eventType = body.type;
  const data = body.data && typeof body.data === 'object' && !Array.isArray(body.data) ? (body.data as Record<string, unknown>) : null;
  const userId = data?.id && typeof data.id === 'string' ? data.id : null;

  if (!userId) {
    logger.warn('Missing user ID in webhook', { eventType });
    return json({ error: { code: 'BadRequest', message: 'Missing user ID' } }, 400);
  }

  // Handle user.created
  if (eventType === 'user.created') {
    logger.info('Processing user.created webhook', { userId });

    // Generate referral code (non-blocking, graceful degradation)
    const referralResult = await callReferralService(env, userId, requestId, logger);
    if (!referralResult.ok) {
      logger.warn('Referral code generation failed (non-blocking)', {
        userId,
        error: referralResult.error,
      });
    }

    // Award registration points (non-blocking, graceful degradation)
    const pointsResult = await callPointsService(
      env,
      userId,
      100,
      'registration',
      `auth:user.created:${userId}`,
      requestId,
      logger
    );
    if (!pointsResult.ok) {
      logger.warn('Registration points failed (non-blocking)', {
        userId,
        error: pointsResult.error,
      });
    }

    return json({ ok: true, userId, referralCode: referralResult.code }, 200);
  }

  // Handle user.updated (check for first login)
  if (eventType === 'user.updated') {
    // M3: Simple heuristic - if last_sign_in_at changed from null to non-null, it's first login
    // In production, we'd track this in DB
    const lastSignInAt = data?.last_sign_in_at;
    if (lastSignInAt) {
      logger.info('Processing user.updated (potential first login)', { userId });

      // Award first login points (non-blocking)
      const pointsResult = await callPointsService(
        env,
        userId,
        50,
        'first_login',
        `auth:user.updated:first_login:${userId}:${Date.now()}`,
        requestId,
        logger
      );
      if (!pointsResult.ok) {
        logger.warn('First login points failed (non-blocking)', {
          userId,
          error: pointsResult.error,
        });
      }

      // Mark referral relation as active (non-blocking)
      const referralLogin = await callReferralFirstLogin(env, userId, requestId, logger);
      if (!referralLogin.ok) {
        logger.warn('Referral first login mark failed (non-blocking)', { userId, error: referralLogin.error });
      }
    }

    return json({ ok: true, userId }, 200);
  }

  logger.info('Unhandled webhook event type', { eventType, userId });
  return json({ ok: true, eventType, note: 'Event acknowledged but not processed' }, 200);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const requestId = getRequestId(request) || generateRequestId();
    const logger = createLogger(requestId, 'auth-service');

    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/health' || path === '/version') {
      const res = handleHealth(env);
      res.headers.set('X-Request-ID', requestId);
      return res;
    }

    // Clerk webhook handler
    if (path === '/v1/auth/webhook/clerk' && request.method === 'POST') {
      const res = await handleClerkWebhook(request, env, requestId, logger);
      res.headers.set('X-Request-ID', requestId);
      return res;
    }

    // Users (MVP): ensure current user exists in Neon.
    // Called via API Gateway after successful sign-in/sign-up.
    if (path === '/v1/users/ensure' && request.method === 'POST') {
      const res = await handleEnsureUser(request, env, requestId, logger);
      res.headers.set('X-Request-ID', requestId);
      return res;
    }

    logger.warn('Unhandled route', { method: request.method, path });
    const res = handleNotFound(path);
    res.headers.set('X-Request-ID', requestId);
    return res;
  },
};



