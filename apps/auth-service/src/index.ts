/**
 * Auth Service (staging) — Milestone 3 integration.
 *
 * Handles:
 * - Clerk webhooks (user.created, user.updated)
 * - Integration with Points Service (registration, first_login)
 * - Integration with Referral Service (generate code)
 */

import { createDb, sql } from '@go2asia/db';
import { createLogger, generateRequestId, getRequestId, logRequestCompleted } from '@go2asia/logger';
import { Webhook } from 'svix';

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

function getSecretCheck(value?: string): 'ok' | 'missing' {
  return typeof value === 'string' && value.trim().length > 0 ? 'ok' : 'missing';
}

function handleReady(env: Env): Response {
  const checks = {
    databaseUrl: getSecretCheck(env.DATABASE_URL),
    serviceJwtSecret: getSecretCheck(env.SERVICE_JWT_SECRET),
    clerkWebhookSecret: getSecretCheck(env.CLERK_WEBHOOK_SECRET),
  };
  const missing = Object.entries(checks)
    .filter(([, status]) => status !== 'ok')
    .map(([name]) => name);
  const status = missing.length === 0 ? 200 : 503;
  return json(
    {
      service: 'auth-service',
      env: env.ENVIRONMENT ?? 'staging',
      status: status === 200 ? 'ready' : 'not_ready',
      version: env.VERSION ?? 'unknown',
      checks,
      missing,
    },
    status
  );
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

type GatewayPrincipal = {
  userId: string;
  platformRole: CanonicalPlatformRole;
  roles: string[];
};

type CanonicalPlatformRole = 'spacer' | 'vip_spacer' | 'pro' | 'admin';

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

  const nbf = payload.nbf;
  if (typeof nbf === 'number') {
    const now = Math.floor(Date.now() / 1000);
    if (now < nbf) return { ok: false, error: 'Token is not active yet' };
  }

  return { ok: true, payload };
}

function getStringClaim(payload: Record<string, unknown>, key: string): string | null {
  const value = payload[key];
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function getStringArrayClaim(payload: Record<string, unknown>, key: string): string[] {
  const value = payload[key];
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    return [value.trim()];
  }
  return [];
}

function normalizeCanonicalPlatformRole(value: string | null): CanonicalPlatformRole | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;
  if (normalized === 'admin') return 'admin';
  if (normalized === 'pro') return 'pro';
  if (normalized === 'vip_spacer' || normalized === 'vip-spacer' || normalized === 'vip') return 'vip_spacer';
  if (normalized === 'spacer' || normalized === 'member' || normalized === 'user') return 'spacer';
  return null;
}

function derivePlatformRole(payload: Record<string, unknown>, roles: string[]): CanonicalPlatformRole {
  const fromRoleClaim = normalizeCanonicalPlatformRole(getStringClaim(payload, 'role'));
  if (fromRoleClaim) return fromRoleClaim;
  for (const role of roles) {
    const normalizedRole = normalizeCanonicalPlatformRole(role);
    if (normalizedRole) return normalizedRole;
  }
  return 'spacer';
}

function validateServiceJwtClaims(
  payload: Record<string, unknown>,
  expected: {
    iss?: string;
    aud?: string;
    sub?: string;
  }
): { ok: true } | { ok: false; error: string } {
  if (expected.iss) {
    const iss = getStringClaim(payload, 'iss');
    if (iss !== expected.iss) return { ok: false, error: 'Invalid issuer' };
  }

  if (expected.aud) {
    const aud = getStringClaim(payload, 'aud');
    if (aud !== expected.aud) return { ok: false, error: 'Invalid audience' };
  }

  if (expected.sub) {
    const sub = getStringClaim(payload, 'sub');
    if (sub !== expected.sub) return { ok: false, error: 'Invalid subject' };
  }

  return { ok: true };
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
): Promise<{ ok: true; principal: GatewayPrincipal } | { ok: false; res: Response }> {
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
    return {
      ok: false,
      res: json({ error: { code: 'UNAUTHORIZED', message: 'Missing X-Gateway-Auth header' }, requestId }, 401),
    };
  }

  const verified = await verifyHs256Jwt(token, secret);
  if (!verified.ok) {
    logger.warn('Invalid gateway-origin token', { reason: verified.error });
    return {
      ok: false,
      res: json({ error: { code: 'UNAUTHORIZED', message: 'Invalid X-Gateway-Auth token' }, requestId }, 401),
    };
  }

  const claims = validateServiceJwtClaims(verified.payload, {
    iss: 'api-gateway',
    aud: 'internal',
  });
  if (!claims.ok) {
    logger.warn('Gateway-origin token claims rejected', { reason: claims.error });
    return {
      ok: false,
      res: json({ error: { code: 'UNAUTHORIZED', message: 'Invalid X-Gateway-Auth token claims' }, requestId }, 401),
    };
  }

  const userId = getStringClaim(verified.payload, 'sub');
  if (!userId) {
    logger.warn('Gateway-origin token missing subject claim');
    return { ok: false, res: json({ error: { code: 'UNAUTHORIZED', message: 'Missing user subject in X-Gateway-Auth' }, requestId }, 401) };
  }

  return {
    ok: true,
    principal: {
      userId,
      roles: getStringArrayClaim(verified.payload, 'roles'),
      platformRole: derivePlatformRole(verified.payload, getStringArrayClaim(verified.payload, 'roles')),
    },
  };
}

async function handleEnsureUser(
  request: Request,
  env: Env,
  requestId: string,
  logger: ReturnType<typeof createLogger>
): Promise<Response> {
  const auth = await requireGatewayOrigin(request, env, requestId, logger);
  if (!auth.ok) return auth.res;

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

  const db = createDb(requireDatabase(env));

  // Gateway token subject is the single trust source for the current user identity.
  const userId = auth.principal.userId;
  const clerkId = userId;
  const resolvedEmail = email ?? `${userId}@clerk.local`;

  const result = await db.execute(sql`
    INSERT INTO users (id, clerk_id, email, role, created_at, updated_at)
    VALUES (${userId}, ${clerkId}, ${resolvedEmail}, ${auth.principal.platformRole}, now(), now())
    ON CONFLICT (clerk_id) DO UPDATE
      SET email = EXCLUDED.email,
          role = EXCLUDED.role,
          updated_at = now()
    RETURNING id, clerk_id, email, role, created_at, updated_at
  `);

  type UserRow = {
    id: string;
    clerk_id: string;
    email: string;
    role: string;
    created_at: Date;
    updated_at: Date;
  };
  const row = (result as unknown as { rows?: UserRow[] }).rows?.[0] ?? null;

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
  const webhookSecret = (env.CLERK_WEBHOOK_SECRET ?? '').trim();
  if (!webhookSecret) {
    logger.error('Missing CLERK_WEBHOOK_SECRET (misconfiguration)');
    return json({ error: { code: 'SERVICE_NOT_CONFIGURED', message: 'CLERK_WEBHOOK_SECRET is missing' }, requestId }, 503);
  }

  const rawBody = await request.text().catch(() => null);
  if (!rawBody) {
    logger.warn('Missing webhook body');
    return json({ error: { code: 'BadRequest', message: 'Missing webhook body' }, requestId }, 400);
  }

  const svixId = request.headers.get('svix-id');
  const svixTimestamp = request.headers.get('svix-timestamp');
  const svixSignature = request.headers.get('svix-signature');
  if (!svixId || !svixTimestamp || !svixSignature) {
    logger.warn('Missing Clerk webhook signature headers');
    return json({ error: { code: 'Unauthorized', message: 'Missing webhook signature headers' }, requestId }, 401);
  }

  try {
    const webhook = new Webhook(webhookSecret);
    webhook.verify(rawBody, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    });
  } catch (error) {
    logger.warn('Invalid Clerk webhook signature', {
      error: error instanceof Error ? error.message : String(error),
    });
    return json({ error: { code: 'Unauthorized', message: 'Invalid webhook signature' }, requestId }, 401);
  }

  let bodyUnknown: unknown;
  try {
    bodyUnknown = JSON.parse(rawBody);
  } catch {
    logger.warn('Webhook body is not valid JSON');
    return json({ error: { code: 'BadRequest', message: 'Invalid webhook JSON' }, requestId }, 400);
  }
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
    const logger = createLogger(requestId, 'auth-service', {
      env: env.ENVIRONMENT,
      version: env.VERSION,
    });

    const url = new URL(request.url);
    const path = url.pathname;
    const startedAt = Date.now();
    let response: Response | null = null;

    try {
      if (path === '/health' || path === '/version') {
        response = handleHealth(env);
        response.headers.set('X-Request-ID', requestId);
        return response;
      }

      if (path === '/ready') {
        response = handleReady(env);
        response.headers.set('X-Request-ID', requestId);
        return response;
      }

      // Clerk webhook handler
      if (path === '/v1/auth/webhook/clerk' && request.method === 'POST') {
        response = await handleClerkWebhook(request, env, requestId, logger);
        response.headers.set('X-Request-ID', requestId);
        return response;
      }

      // Users (MVP): ensure current user exists in Neon.
      // Called via API Gateway after successful sign-in/sign-up.
      if (path === '/v1/users/ensure' && request.method === 'POST') {
        response = await handleEnsureUser(request, env, requestId, logger);
        response.headers.set('X-Request-ID', requestId);
        return response;
      }

      logger.warn('Unhandled route', { method: request.method, path });
      response = handleNotFound(path);
      response.headers.set('X-Request-ID', requestId);
      return response;
    } catch (error) {
      logger.error('Unhandled error', error, { method: request.method, path });
      response = json(
        {
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Unexpected error',
          },
          requestId,
        },
        500
      );
      response.headers.set('X-Request-ID', requestId);
      return response;
    } finally {
      logRequestCompleted(logger, {
        method: request.method,
        path,
        status: response?.status ?? 500,
        durationMs: Date.now() - startedAt,
      });
    }
  },
};



