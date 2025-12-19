/**
 * Content Service (staging) — Milestone 3 integration.
 *
 * Handles:
 * - Event registration (POST /v1/content/events/{id}/register)
 * - Integration with Points Service (event_registration)
 */

import { createLogger, generateRequestId, getRequestId } from '@go2asia/logger';
import { createDb } from '@go2asia/db';
import { sql } from '@go2asia/db';

export interface Env {
  ENVIRONMENT?: string;
  VERSION?: string;
  // Service URLs
  POINTS_SERVICE_URL?: string;
  // Secrets
  SERVICE_JWT_SECRET?: string;
  // Database
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
    service: 'content-service',
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

// JWT utilities (for service-to-service auth)

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
      sub: 'content-service',
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

async function handleEventRegistration(
  request: Request,
  env: Env,
  eventId: string,
  requestId: string,
  logger: ReturnType<typeof createLogger>
): Promise<Response> {
  // Extract user ID from gateway header
  const userId = request.headers.get('X-User-ID');
  if (!userId) {
    return json({ error: { code: 'Unauthorized', message: 'Missing X-User-ID header' } }, 401);
  }

  // M3: Basic validation - check if event exists (simplified, assumes event_registrations table exists)
  if (!env.DATABASE_URL) {
    logger.warn('Database not configured, skipping registration persistence');
    // Still try to award points (graceful degradation)
  } else {
    try {
      const db = createDb(env.DATABASE_URL);
      const registrationId = crypto.randomUUID();

      // Insert registration (idempotent by user_id + event_id unique constraint)
      // Note: unique constraint name is auto-generated by Drizzle as "event_registrations_user_id_event_id_unique"
      await db.execute(
        sql`
          INSERT INTO event_registrations (id, user_id, event_id, registered_at)
          VALUES (${registrationId}, ${userId}, ${eventId}, NOW())
          ON CONFLICT (user_id, event_id) DO NOTHING
        `
      );

      logger.info('Event registration created', { userId, eventId, registrationId });

      // Award points (non-blocking, graceful degradation)
      const pointsResult = await callPointsService(
        env,
        userId,
        20,
        'event_registration',
        `content:event_registration:${registrationId}`,
        requestId,
        logger
      );
      if (!pointsResult.ok) {
        logger.warn('Event registration points failed (non-blocking)', {
          userId,
          eventId,
          error: pointsResult.error,
        });
      }

      return json({ ok: true, registrationId, eventId, userId }, 201);
    } catch (error) {
      logger.error('Event registration error', error, { userId, eventId });
      // Check if it's a unique constraint violation (already registered)
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('unique') || errorMessage.includes('duplicate')) {
        return json({ error: { code: 'Conflict', message: 'Already registered' } }, 409);
      }
      return json({ error: { code: 'InternalError', message: 'Registration failed' } }, 500);
    }
  }

  // Fallback: award points even if DB is not configured
  const pointsResult = await callPointsService(
    env,
    userId,
    20,
    'event_registration',
    `content:event_registration:${eventId}:${userId}:${Date.now()}`,
    requestId,
    logger
  );
  if (!pointsResult.ok) {
    logger.warn('Event registration points failed', {
      userId,
      eventId,
      error: pointsResult.error,
    });
  }

  return json({ ok: true, eventId, userId, note: 'Points awarded, registration not persisted (DB not configured)' }, 201);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const requestId = getRequestId(request) || generateRequestId();
    const logger = createLogger(requestId, 'content-service');

    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/health' || path === '/version') {
      const res = handleHealth(env);
      res.headers.set('X-Request-ID', requestId);
      return res;
    }

    // Event registration endpoint
    const eventRegMatch = path.match(/^\/v1\/content\/events\/([^/]+)\/register$/);
    if (eventRegMatch && request.method === 'POST') {
      const eventId = eventRegMatch[1];
      const res = await handleEventRegistration(request, env, eventId, requestId, logger);
      res.headers.set('X-Request-ID', requestId);
      return res;
    }

    logger.warn('Unhandled route', { method: request.method, path });
    const res = handleNotFound(path);
    res.headers.set('X-Request-ID', requestId);
    return res;
  },
};



