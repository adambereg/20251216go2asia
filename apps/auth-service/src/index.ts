/**
 * Auth Service (staging) — Milestone 3 integration.
 *
 * Handles:
 * - Clerk webhooks (user.created, user.updated)
 * - Integration with Points Service (registration, first_login)
 * - Integration with Referral Service (generate code)
 */

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

function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  const b64 = btoa(bin);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function utf8ToBytes(input: string): Uint8Array {
  return new TextEncoder().encode(input);
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

    logger.warn('Unhandled route', { method: request.method, path });
    const res = handleNotFound(path);
    res.headers.set('X-Request-ID', requestId);
    return res;
  },
};



