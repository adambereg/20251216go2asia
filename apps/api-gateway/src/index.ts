/**
 * API Gateway for Go2Asia MVP
 *
 * Cloudflare Worker that routes requests to backend microservices.
 * Handles JWT validation, requestId propagation, and basic routing.
 */

import { verifyToken } from '@clerk/backend';
import { createLogger, generateRequestId, getRequestId, logRequestCompleted } from '@go2asia/logger';

export interface Env {
  // Service URLs (internal)
  AUTH_SERVICE_URL?: string;
  CONTENT_SERVICE_URL?: string;
  POINTS_SERVICE_URL?: string;
  REFERRAL_SERVICE_URL?: string;
  // Phase 2 services (not all exist yet; keep optional and only route when configured)
  SPACE_SERVICE_URL?: string;
  QUEST_SERVICE_URL?: string;
  RIELT_SERVICE_URL?: string;
  GURU_SERVICE_URL?: string;
  RF_SERVICE_URL?: string;
  
  // Secrets (Cloudflare Secrets)
  CLERK_SECRET_KEY?: string;
  SERVICE_JWT_SECRET?: string;

  // Runtime vars (Cloudflare Vars)
  ENVIRONMENT?: string;
  VERSION?: string;

  /**
   * Security: debug routes must be explicitly enabled.
   * - Default: disabled (including in production).
   * - Enable by setting DEBUG_ROUTES_ENABLED="true".
   */
  DEBUG_ROUTES_ENABLED?: string;
}

type GatewayUserContext = {
  userId: string;
  roles: string[];
};

function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  const b64 = btoa(bin);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function utf8ToBytes(input: string): Uint8Array {
  return new TextEncoder().encode(input);
}

function getBearerToken(request: Request): string | null {
  const auth = request.headers.get('Authorization') ?? '';
  const match = auth.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
}

function safeHostFromUrl(input?: string): string | null {
  if (!input) return null;
  try {
    return new URL(input).host;
  } catch {
    return null;
  }
}

function applyCors(res: Response, origin: string | null): Response {
  if (!origin) return res;
  // Clone to ensure headers are mutable (Cloudflare may return immutable headers).
  const out = new Response(res.body, res);
  out.headers.set('Access-Control-Allow-Origin', origin);
  out.headers.set('Vary', 'Origin');
  out.headers.set('Access-Control-Expose-Headers', 'X-Request-ID');
  return out;
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

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
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

function getAuthorizedParties(origin: string | null): string[] | undefined {
  if (!origin) return undefined;
  try {
    const parsed = new URL(origin);
    return [`${parsed.protocol}//${parsed.host}`];
  } catch {
    return undefined;
  }
}

function getClerkVerificationCheck(env: Env): 'ok' | 'missing' {
  return getSecretCheck(env.CLERK_SECRET_KEY);
}

async function verifyClerkJwt(token: string, env: Env, origin: string | null): Promise<
  | { ok: true; payload: Record<string, unknown> }
  | { ok: false; error: string }
> {
  const secretKey = env.CLERK_SECRET_KEY?.trim();
  if (!secretKey) return { ok: false, error: 'CLERK_SECRET_KEY is missing' };

  try {
    const payload = (await verifyToken(token, {
      secretKey,
      authorizedParties: getAuthorizedParties(origin),
    })) as Record<string, unknown>;
    return { ok: true, payload };
  } catch (error) {
    return { ok: false, error: toErrorMessage(error) };
  }
}

function extractGatewayUserContext(payload: Record<string, unknown>): GatewayUserContext | null {
  const userId = getStringClaim(payload, 'sub');
  if (!userId) return null;
  const roles = getStringArrayClaim(payload, 'roles');
  return { userId, roles };
}

async function mintInternalGatewayToken(
  env: Env,
  requestId: string,
  user: GatewayUserContext
): Promise<string | null> {
  if (!env.SERVICE_JWT_SECRET) return null;
  const now = Math.floor(Date.now() / 1000);
  const payload: Record<string, unknown> = {
    iss: 'api-gateway',
    aud: 'internal',
    sub: user.userId,
    iat: now,
    exp: now + 300,
    rid: requestId,
  };
  if (user.roles.length > 0) {
    payload.roles = user.roles;
  }
  return signHs256Jwt(payload, env.SERVICE_JWT_SECRET);
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

function getSecretCheck(value?: string): 'ok' | 'missing' {
  return typeof value === 'string' && value.trim().length > 0 ? 'ok' : 'missing';
}

function getUrlCheck(value?: string): 'ok' | 'missing' | 'invalid' {
  if (typeof value !== 'string' || value.trim().length === 0) return 'missing';
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? 'ok' : 'invalid';
  } catch {
    return 'invalid';
  }
}

/**
 * Ready check endpoint
 */
async function handleReady(env: Env): Promise<Response> {
  const checks = {
    authServiceUrl: getUrlCheck(env.AUTH_SERVICE_URL),
    contentServiceUrl: getUrlCheck(env.CONTENT_SERVICE_URL),
    pointsServiceUrl: getUrlCheck(env.POINTS_SERVICE_URL),
    referralServiceUrl: getUrlCheck(env.REFERRAL_SERVICE_URL),
    clerkSecretKey: getClerkVerificationCheck(env),
    serviceJwtSecret: getSecretCheck(env.SERVICE_JWT_SECRET),
  };
  const missing = Object.entries(checks)
    .filter(([, status]) => status !== 'ok')
    .map(([name]) => name);
  const status = missing.length === 0 ? 200 : 503;
  return new Response(
    JSON.stringify({
      service: 'api-gateway',
      env: env.ENVIRONMENT ?? 'staging',
      status: status === 200 ? 'ready' : 'not_ready',
      version: env.VERSION ?? 'unknown',
      checks,
      missing,
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
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
  // Support legacy alias /v1/api/content/* by rewriting to /v1/content/*
  const downstreamPath = path.startsWith('/v1/api/content/')
    ? path.replace('/v1/api/content/', '/v1/content/')
    : path;
  const requestId = getRequestId(request) || generateRequestId();
  const origin = request.headers.get('Origin');

  // Minimal CORS support for browser clients (PWA / localhost).
  // - Echo Origin (no wildcard) to support Authorization headers.
  // - Do not set Access-Control-Allow-Credentials.
  if (origin && request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin,
        Vary: 'Origin',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
        'Access-Control-Allow-Headers':
          'Authorization,Content-Type,X-Request-Id,X-Request-ID,X-Gateway-Auth,X-User-ID',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // Health checks
  if (path === '/health') {
    return handleHealth(env);
  }
  if (path === '/ready') {
    return handleReady(env);
  }

  // Debug (safe): show which service URLs are configured (host only)
  if (path === '/v1/_debug/routes' && request.method === 'GET') {
    // SECURITY: do not expose debug surfaces unless explicitly enabled.
    // This endpoint reveals routing structure and configured upstream hosts.
    const debugEnabled = (env.DEBUG_ROUTES_ENABLED ?? '').toLowerCase() === 'true';
    if (!debugEnabled) {
      return new Response(
        JSON.stringify({
          error: {
            code: 'NOT_FOUND',
            message: 'No route for path: /v1/_debug/routes',
          },
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        env: env.ENVIRONMENT ?? 'staging',
        version: env.VERSION ?? 'unknown',
        routes: [
          { prefix: '/v1/auth/', var: 'AUTH_SERVICE_URL', host: safeHostFromUrl(env.AUTH_SERVICE_URL) },
          { prefix: '/v1/users/', var: 'AUTH_SERVICE_URL', host: safeHostFromUrl(env.AUTH_SERVICE_URL) },
          { prefix: '/v1/content/', var: 'CONTENT_SERVICE_URL', host: safeHostFromUrl(env.CONTENT_SERVICE_URL) },
          { prefix: '/v1/points/', var: 'POINTS_SERVICE_URL', host: safeHostFromUrl(env.POINTS_SERVICE_URL) },
          { prefix: '/v1/referral/', var: 'REFERRAL_SERVICE_URL', host: safeHostFromUrl(env.REFERRAL_SERVICE_URL) },
          // Phase 2 (planned): routes become active only when the corresponding *_SERVICE_URL var is configured
          { prefix: '/v1/space/', var: 'SPACE_SERVICE_URL', host: safeHostFromUrl(env.SPACE_SERVICE_URL) },
          { prefix: '/v1/quest/', var: 'QUEST_SERVICE_URL', host: safeHostFromUrl(env.QUEST_SERVICE_URL) },
          { prefix: '/v1/rielt/', var: 'RIELT_SERVICE_URL', host: safeHostFromUrl(env.RIELT_SERVICE_URL) },
          { prefix: '/v1/guru/', var: 'GURU_SERVICE_URL', host: safeHostFromUrl(env.GURU_SERVICE_URL) },
          { prefix: '/v1/rf/', var: 'RF_SERVICE_URL', host: safeHostFromUrl(env.RF_SERVICE_URL) },
        ],
        rewrites: [{ from: '/v1/api/content/*', to: '/v1/content/*' }],
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Route to services based on path prefix
  let serviceUrl: string | undefined;
  let missingVar: string | null = null;
  
  if (path.startsWith('/v1/auth/')) {
    serviceUrl = env.AUTH_SERVICE_URL;
    if (!serviceUrl) missingVar = 'AUTH_SERVICE_URL';
  } else if (path.startsWith('/v1/users/')) {
    // Users endpoints are served by auth-service in MVP (no separate user-service yet).
    serviceUrl = env.AUTH_SERVICE_URL;
    if (!serviceUrl) missingVar = 'AUTH_SERVICE_URL';
  } else if (path.startsWith('/v1/content/') || path.startsWith('/v1/api/content/')) {
    serviceUrl = env.CONTENT_SERVICE_URL;
    if (!serviceUrl) missingVar = 'CONTENT_SERVICE_URL';
  } else if (path.startsWith('/v1/points/')) {
    serviceUrl = env.POINTS_SERVICE_URL;
    if (!serviceUrl) missingVar = 'POINTS_SERVICE_URL';
  } else if (path.startsWith('/v1/referral/')) {
    serviceUrl = env.REFERRAL_SERVICE_URL;
    if (!serviceUrl) missingVar = 'REFERRAL_SERVICE_URL';
  } else if (path.startsWith('/v1/space/')) {
    // Phase 2 (planned): do not fail with 502 if the service is not configured yet.
    // Keep behavior consistent with "unknown route" until SPACE_SERVICE_URL is provided.
    if (env.SPACE_SERVICE_URL) serviceUrl = env.SPACE_SERVICE_URL;
  } else if (path.startsWith('/v1/quest/')) {
    if (env.QUEST_SERVICE_URL) serviceUrl = env.QUEST_SERVICE_URL;
  } else if (path.startsWith('/v1/rielt/')) {
    if (env.RIELT_SERVICE_URL) serviceUrl = env.RIELT_SERVICE_URL;
  } else if (path.startsWith('/v1/guru/')) {
    if (env.GURU_SERVICE_URL) serviceUrl = env.GURU_SERVICE_URL;
  } else if (path.startsWith('/v1/rf/')) {
    if (env.RF_SERVICE_URL) serviceUrl = env.RF_SERVICE_URL;
  }

  if (!serviceUrl) {
    if (missingVar) {
      logger.error('Service not configured', { path, missingVar });
      const res = new Response(
        JSON.stringify({
          error: {
            code: 'SERVICE_NOT_CONFIGURED',
            message: `${missingVar} is missing`,
          },
          requestId,
        }),
        { status: 503, headers: { 'Content-Type': 'application/json', 'X-Request-ID': requestId } }
      );
      return applyCors(res, origin);
    }

    logger.warn('No service found for path', { path });
    const res = new Response(
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
    return applyCors(res, origin);
  }

  // Prepare headers for downstream.
  // IMPORTANT: Do NOT forward the entire inbound header set.
  // Some headers (Host/Forwarded/CF-*) can cause Cloudflare to return its default HTML 404
  // even when the target Worker is healthy. Build a minimal, explicit header set instead.
  const headers = new Headers();
  const accept = request.headers.get('Accept');
  const acceptLang = request.headers.get('Accept-Language');
  const contentType = request.headers.get('Content-Type');
  if (accept) headers.set('Accept', accept);
  if (acceptLang) headers.set('Accept-Language', acceptLang);
  if (contentType) headers.set('Content-Type', contentType);
  headers.set('X-Request-Id', requestId);

  // For user-facing routes that require user context, verify Clerk once at the gateway
  // and propagate only the derived internal token downstream.
  // - Points/Referral: all user-facing routes require auth
  // - Content register: POST /v1/content/events/{id}/register requires auth (content-service expects X-User-ID)
  const isContentRegister =
    request.method === 'POST' && /^\/v1\/content\/events\/[^/]+\/register$/.test(downstreamPath);
  // Media (Phase 2.2): token issuance requires auth, upload itself is authorized by a signed token.
  const isMediaUploadToken =
    request.method === 'POST' && downstreamPath === '/v1/content/media/upload-token';

  if (
    path.startsWith('/v1/points/') ||
    path.startsWith('/v1/referral/') ||
    path.startsWith('/v1/users/') ||
    isContentRegister ||
    isMediaUploadToken
  ) {
    const token = getBearerToken(request);
    let user: GatewayUserContext | null = null;
    let authMisconfigured = false;

    if (token && env.CLERK_SECRET_KEY) {
      const verified = await verifyClerkJwt(token, env, origin);
      if (!verified.ok) {
        logger.warn('Invalid user token', { reason: verified.error });
        user = null;
      } else {
        user = extractGatewayUserContext(verified.payload);
      }
    } else if (token) {
      logger.error('CLERK_SECRET_KEY not set; refusing to trust user token');
      authMisconfigured = true;
    }

    if (!user && token && !authMisconfigured) {
      logger.warn('Verified user token is missing usable subject claim');
    }

    if (!user) {
      const status = authMisconfigured ? 503 : 401;
      const code = authMisconfigured ? 'SERVICE_AUTH_NOT_CONFIGURED' : 'UNAUTHORIZED';
      const message = authMisconfigured
        ? 'User auth verification is not configured'
        : 'Missing or invalid user token';
      const res = new Response(
        JSON.stringify({
          error: {
            code,
            message,
          },
          requestId,
        }),
        {
          status,
          headers: {
            'Content-Type': 'application/json',
            'X-Request-ID': requestId,
          },
        }
      );
      // IMPORTANT: also add CORS headers on auth errors,
      // otherwise browsers will surface this as a network/CORS failure (status=0).
      return applyCors(res, origin);
    }

    const gatewayToken = await mintInternalGatewayToken(env, requestId, user);
    if (!gatewayToken) {
      logger.error('SERVICE_JWT_SECRET not set; cannot mint internal gateway token');
      const res = new Response(
        JSON.stringify({
          error: {
            code: 'SERVICE_AUTH_NOT_CONFIGURED',
            message: 'Gateway-to-service auth is not configured',
          },
          requestId,
        }),
        {
          status: 503,
          headers: {
            'Content-Type': 'application/json',
            'X-Request-ID': requestId,
          },
        }
      );
      return applyCors(res, origin);
    }

    headers.set('X-Gateway-Auth', gatewayToken);
    // Temporary derived/debug header for compatibility during migration.
    headers.set('X-User-ID', user.userId);
  }

  // Forward request to service
  const baseUrl = serviceUrl.endsWith('/') ? serviceUrl.slice(0, -1) : serviceUrl;
  const targetUrl = `${baseUrl}${downstreamPath}${url.search}`;
  logger.info('Proxy request', {
    path,
    downstreamPath,
    targetHost: safeHostFromUrl(serviceUrl),
  });

  // Only pass a body for methods that can have one.
  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';
  const serviceRequest = new Request(targetUrl, {
    method: request.method,
    headers,
    body: hasBody ? request.body : undefined,
  });

  try {
    const response = await fetch(serviceRequest);

    // Cloudflare may return a Response with immutable headers.
    // Always clone before adding/overriding headers.
    const out = new Response(response.body, response);
    // Diagnostic headers (no secrets). Helps debug proxy-chain issues.
    out.headers.set('X-Proxy-Target-Host', safeHostFromUrl(baseUrl) ?? '');
    out.headers.set('X-Proxy-Target-Path', downstreamPath);
    out.headers.set('X-Proxy-Downstream-Status', String(response.status));
    out.headers.set('X-Proxy-Downstream-Content-Type', response.headers.get('Content-Type') ?? '');
    return applyCors(out, origin);
  } catch (error) {
    logger.error('Error forwarding request to service', error, {
      serviceUrl,
      path,
    });
    const res = new Response(
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
    return applyCors(res, origin);
  }
}

/**
 * Main handler for Cloudflare Worker
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Extract or generate requestId
    const requestId = getRequestId(request) || generateRequestId();
    const logger = createLogger(requestId, 'api-gateway', {
      env: env.ENVIRONMENT,
      version: env.VERSION,
    });
    const path = new URL(request.url).pathname;
    const startedAt = Date.now();
    let response: Response | null = null;

    logger.info('Incoming request', {
      method: request.method,
      path,
    });

    try {
      response = await routeRequest(request, env, logger);

      // Ensure headers are mutable before setting X-Request-ID
      const out = new Response(response.body, response);
      out.headers.set('X-Request-ID', requestId);
      response = out;
      return out;
    } catch (error) {
      logger.error('Unhandled error in API Gateway', error, { method: request.method, path });
      response = new Response(
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
      return response;
    } finally {
      logRequestCompleted(logger, {
        method: request.method,
        path,
        status: response?.status ?? 500,
        durationMs: Date.now() - startedAt,
        targetHost: response?.headers.get('X-Proxy-Target-Host') ?? undefined,
        downstreamStatus: response?.headers.get('X-Proxy-Downstream-Status') ?? undefined,
      });
    }
  },
};







