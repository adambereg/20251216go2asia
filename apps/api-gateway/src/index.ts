/**
 * API Gateway for Go2Asia MVP
 * 
 * Cloudflare Worker that routes requests to backend microservices.
 * Handles JWT validation, requestId propagation, and basic routing.
 */

import { createLogger, getRequestId, generateRequestId } from '@go2asia/logger';

export interface Env {
  // Service URLs (internal)
  AUTH_SERVICE_URL?: string;
  CONTENT_SERVICE_URL?: string;
  POINTS_SERVICE_URL?: string;
  REFERRAL_SERVICE_URL?: string;
  
  // Secrets (Cloudflare Secrets)
  CLERK_JWT_SECRET?: string;
  SERVICE_JWT_SECRET?: string;

  // Runtime vars (Cloudflare Vars)
  ENVIRONMENT?: string;
  VERSION?: string;
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

function getBearerToken(request: Request): string | null {
  const auth = request.headers.get('Authorization') ?? '';
  const match = auth.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
}

function getJwtSubWithoutVerification(token: string): string | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const payload = parseJsonObject(new TextDecoder().decode(base64UrlToBytes(parts[1])));
  const sub = payload?.sub;
  return typeof sub === 'string' && sub.length > 0 ? sub : null;
}

async function verifyHs256Jwt(token: string, secret: string): Promise<
  | { ok: true; payload: Record<string, unknown> }
  | { ok: false; error: string }
> {
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

/**
 * Health check endpoint
 */
async function handleHealth(env: Env): Promise<Response> {
  return new Response(
    JSON.stringify({
      service: 'api-gateway',
      env: env.ENVIRONMENT ?? 'staging',
      status: 'ok',
      version: env.VERSION ?? 'unknown',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Ready check endpoint
 */
async function handleReady(): Promise<Response> {
  return new Response(
    JSON.stringify({
      status: 'ready',
      service: 'api-gateway',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Route request to appropriate service
 */
async function routeRequest(
  request: Request,
  env: Env,
  logger: ReturnType<typeof createLogger>
): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const requestId = getRequestId(request) || generateRequestId();

  // Health checks
  if (path === '/health') {
    return handleHealth(env);
  }
  if (path === '/ready') {
    return handleReady();
  }

  // Route to services based on path prefix
  let serviceUrl: string | undefined;
  
  if (path.startsWith('/v1/auth/')) {
    serviceUrl = env.AUTH_SERVICE_URL;
  } else if (path.startsWith('/v1/content/')) {
    serviceUrl = env.CONTENT_SERVICE_URL;
  } else if (path.startsWith('/v1/points/')) {
    serviceUrl = env.POINTS_SERVICE_URL;
  } else if (path.startsWith('/v1/referral/')) {
    serviceUrl = env.REFERRAL_SERVICE_URL;
  }

  if (!serviceUrl) {
    logger.warn('No service found for path', { path });
    return new Response(
      JSON.stringify({
        error: {
          code: 'NOT_FOUND',
          message: `No service found for path: ${path}`,
        },
      }),
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  // Prepare headers for downstream
  const headers = new Headers(request.headers);
  headers.set('X-Request-Id', requestId);

  // M3 trust model: downstream accepts user-context only if request is authenticated as gateway-origin.
  if (env.SERVICE_JWT_SECRET) {
    const now = Math.floor(Date.now() / 1000);
    const gatewayToken = await signHs256Jwt(
      {
        iss: 'api-gateway',
        aud: 'downstream',
        iat: now,
        exp: now + 60,
        rid: requestId,
      },
      env.SERVICE_JWT_SECRET
    );
    headers.set('X-Gateway-Auth', gatewayToken);
  } else {
    logger.warn('SERVICE_JWT_SECRET not set; downstream gateway-origin auth will fail');
  }

  // For Points/Referral user-facing routes, assert user context.
  if (path.startsWith('/v1/points/') || path.startsWith('/v1/referral/')) {
    const token = getBearerToken(request);
    let userId: string | null = null;

    if (token && env.CLERK_JWT_SECRET) {
      const verified = await verifyHs256Jwt(token, env.CLERK_JWT_SECRET);
      if (!verified.ok) {
        logger.warn('Invalid user token', { reason: verified.error });
        userId = null;
      } else {
        const sub = verified.payload.sub;
        userId = typeof sub === 'string' && sub.length > 0 ? sub : null;
      }
    } else if (token) {
      // Fallback (M3): no signature verification if CLERK_JWT_SECRET is not configured
      logger.warn('CLERK_JWT_SECRET not set; user token is not verified (temporary M3 behavior)');
      userId = getJwtSubWithoutVerification(token);
    }

    if (!userId) {
      return new Response(
        JSON.stringify({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Missing or invalid user token',
          },
          requestId,
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'X-Request-ID': requestId,
          },
        }
      );
    }

    // Prevent spoofing: overwrite any inbound X-User-ID
    headers.set('X-User-ID', userId);
  }

  // Forward request to service
  const serviceRequest = new Request(`${serviceUrl}${path}${url.search}`, {
    method: request.method,
    headers,
    body: request.body,
  });

  try {
    const response = await fetch(serviceRequest);
    return response;
  } catch (error) {
    logger.error('Error forwarding request to service', error, {
      serviceUrl,
      path,
    });
    return new Response(
      JSON.stringify({
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Backend service is temporarily unavailable',
        },
      }),
      {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

/**
 * Main handler for Cloudflare Worker
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Extract or generate requestId
    const requestId = getRequestId(request) || generateRequestId();
    const logger = createLogger(requestId, 'api-gateway');

    logger.info('Incoming request', {
      method: request.method,
      path: new URL(request.url).pathname,
    });

    try {
      const response = await routeRequest(request, env, logger);
      
      // Add requestId to response headers
      response.headers.set('X-Request-ID', requestId);
      
      return response;
    } catch (error) {
      logger.error('Unhandled error in API Gateway', error);
      return new Response(
        JSON.stringify({
          error: {
            code: 'INTERNAL_ERROR',
            message: 'An internal error occurred',
          },
          requestId,
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'X-Request-ID': requestId,
          },
        }
      );
    }
  },
};







