/**
 * Go2Asia Worker service template (Phase 2 / Milestone 2.0).
 *
 * Copy this folder into apps/<service-name> when starting a new service milestone.
 */

import { createLogger, generateRequestId, getRequestId, logRequestCompleted } from '@go2asia/logger';

const SERVICE_NAME = '__SERVICE__';

type JwtVerifyResult = { ok: true; payload: Record<string, unknown> } | { ok: false; error: string };

type GatewayPrincipal = {
  userId: string;
  roles: string[];
};

export interface Env {
  ENVIRONMENT?: string;
  VERSION?: string;
  SERVICE_JWT_SECRET?: string;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function errorResponse(code: string, message: string, requestId: string, status: number): Response {
  return json(
    {
      error: { code, message },
      requestId,
    },
    status
  );
}

function getSecretCheck(value?: string): 'ok' | 'missing' {
  return typeof value === 'string' && value.trim().length > 0 ? 'ok' : 'missing';
}

function handleHealth(env: Env): Response {
  return json({
    service: SERVICE_NAME,
    env: env.ENVIRONMENT ?? 'staging',
    status: 'ok',
    version: env.VERSION ?? 'unknown',
  });
}

function handleReady(env: Env): Response {
  const checks = {
    serviceJwtSecret: getSecretCheck(env.SERVICE_JWT_SECRET),
  };
  const missing = Object.entries(checks)
    .filter(([, status]) => status !== 'ok')
    .map(([name]) => name);
  const status = missing.length === 0 ? 200 : 503;

  return json(
    {
      service: SERVICE_NAME,
      env: env.ENVIRONMENT ?? 'staging',
      status: status === 200 ? 'ready' : 'not_ready',
      version: env.VERSION ?? 'unknown',
      checks,
      missing,
    },
    status
  );
}

function handleNotFound(path: string, requestId: string): Response {
  return errorResponse('NOT_FOUND', `No route for path: ${path}`, requestId, 404);
}

function utf8ToBytes(input: string): Uint8Array {
  return new TextEncoder().encode(input);
}

function base64UrlToBytes(input: string): Uint8Array {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  const bin = atob(`${normalized}${pad}`);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function parseJsonObject(input: string): Record<string, unknown> | null {
  try {
    const value: unknown = JSON.parse(input);
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    return value as Record<string, unknown>;
  } catch {
    return null;
  }
}

function getStringClaim(payload: Record<string, unknown>, key: string): string | null {
  const value = payload[key];
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
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

  const signature = base64UrlToBytes(signatureB64);
  const data = utf8ToBytes(`${headerB64}.${payloadB64}`);
  const ok = await crypto.subtle.verify('HMAC', key, signature, data);
  if (!ok) return { ok: false, error: 'Invalid signature' };

  const now = Math.floor(Date.now() / 1000);
  const exp = payload.exp;
  if (typeof exp === 'number' && now >= exp) return { ok: false, error: 'Token expired' };

  const nbf = payload.nbf;
  if (typeof nbf === 'number' && now < nbf) return { ok: false, error: 'Token is not active yet' };

  return { ok: true, payload };
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
    return { ok: false, res: errorResponse('SERVICE_AUTH_NOT_CONFIGURED', 'Service auth is not configured', requestId, 503) };
  }

  const token = request.headers.get('X-Gateway-Auth');
  if (!token) return { ok: false, res: errorResponse('UNAUTHORIZED', 'Missing X-Gateway-Auth header', requestId, 401) };

  const verified = await verifyHs256Jwt(token, secret);
  if (!verified.ok) {
    logger.warn('Invalid gateway-origin token', { reason: verified.error });
    return { ok: false, res: errorResponse('UNAUTHORIZED', 'Invalid X-Gateway-Auth token', requestId, 401) };
  }

  const claims = validateServiceJwtClaims(verified.payload, {
    iss: 'api-gateway',
    aud: 'internal',
  });
  if (!claims.ok) {
    logger.warn('Gateway-origin token claims rejected', { reason: claims.error });
    return { ok: false, res: errorResponse('UNAUTHORIZED', 'Invalid X-Gateway-Auth token claims', requestId, 401) };
  }

  const userId = getStringClaim(verified.payload, 'sub');
  if (!userId) {
    logger.warn('Gateway-origin token missing subject claim');
    return { ok: false, res: errorResponse('UNAUTHORIZED', 'Missing user subject in X-Gateway-Auth', requestId, 401) };
  }

  return {
    ok: true,
    principal: {
      userId,
      roles: getStringArrayClaim(verified.payload, 'roles'),
    },
  };
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
    return { ok: false, res: errorResponse('SERVICE_AUTH_NOT_CONFIGURED', 'Service auth is not configured', requestId, 503) };
  }

  const auth = request.headers.get('Authorization') ?? '';
  const match = auth.match(/^Bearer\s+(.+)$/i);
  if (!match) return { ok: false, res: errorResponse('UNAUTHORIZED', 'Missing Authorization: Bearer token', requestId, 401) };

  const verified = await verifyHs256Jwt(match[1], secret);
  if (!verified.ok) {
    logger.warn('Invalid service token', { reason: verified.error });
    return { ok: false, res: errorResponse('UNAUTHORIZED', 'Invalid service token', requestId, 401) };
  }

  const claims = validateServiceJwtClaims(verified.payload, {
    iss: 'go2asia-service-auth',
    aud: SERVICE_NAME,
  });
  if (!claims.ok) {
    logger.warn('Service token claims rejected', { reason: claims.error });
    return { ok: false, res: errorResponse('UNAUTHORIZED', 'Invalid service token claims', requestId, 401) };
  }

  return { ok: true };
}

export { requireGatewayOrigin, requireServiceAuth };

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const requestId = getRequestId(request) || generateRequestId();
    const logger = createLogger(requestId, SERVICE_NAME, {
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

      // Implement /v1/* and /internal/* routes here for real services.
      // Example:
      // - User-facing routes -> requireGatewayOrigin(...)
      // - Internal routes -> requireServiceAuth(...)
      logger.warn('Unhandled route', { method: request.method, path });
      response = handleNotFound(path, requestId);
      response.headers.set('X-Request-ID', requestId);
      return response;
    } catch (error) {
      logger.error('Unhandled error', error, { method: request.method, path });
      response = errorResponse('INTERNAL_ERROR', 'Unexpected error', requestId, 500);
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


