import { createLogger, generateRequestId, getRequestId, logRequestCompleted } from '@go2asia/logger';

import { requireGatewayOrigin } from './middleware/auth';
import { getSecretCheck, getUrlCheck, handleNotFound, json, withRequestId } from './middleware/http';
import { handleFeedRoute } from './routes/feed';

export interface Env {
  ENVIRONMENT?: string;
  VERSION?: string;
  SERVICE_JWT_SECRET?: string;
  SPACE_SERVICE_URL?: string;
  REACTIONS_SERVICE_URL?: string;
  FEED_CACHE_TTL_SECONDS?: string;
}

function handleHealth(env: Env): Response {
  return json({
    service: 'feed-service',
    env: env.ENVIRONMENT ?? 'staging',
    status: 'ok',
    version: env.VERSION ?? 'unknown',
  });
}

function handleReady(env: Env): Response {
  const checks = {
    serviceJwtSecret: getSecretCheck(env.SERVICE_JWT_SECRET),
    spaceServiceUrl: getUrlCheck(env.SPACE_SERVICE_URL),
    reactionsServiceUrl: getUrlCheck(env.REACTIONS_SERVICE_URL),
  };
  const requiredChecks: Array<keyof typeof checks> = ['serviceJwtSecret', 'spaceServiceUrl'];
  const missing = requiredChecks.filter((name) => checks[name] !== 'ok');
  const status = missing.length === 0 ? 200 : 503;

  return json(
    {
      service: 'feed-service',
      env: env.ENVIRONMENT ?? 'staging',
      status: status === 200 ? 'ready' : 'not_ready',
      version: env.VERSION ?? 'unknown',
      checks,
      missing,
    },
    status
  );
}

function isProtectedRoute(method: string, path: string): boolean {
  if (method === 'GET' && path === '/v1/feed/home') return true;
  if (method === 'GET' && path === '/v1/feed/activity') return true;
  if (method === 'GET' && /^\/v1\/feed\/group\/[^/]+$/.test(path)) return true;
  if (method === 'GET' && /^\/v1\/feed\/profile\/[^/]+$/.test(path)) return true;
  return false;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const requestId = getRequestId(request) || generateRequestId();
    const logger = createLogger(requestId, 'feed-service', {
      env: env.ENVIRONMENT,
      version: env.VERSION,
    });
    const path = new URL(request.url).pathname;
    const startedAt = Date.now();
    let response: Response | null = null;

    try {
      if (path === '/health' || path === '/version') {
        response = withRequestId(handleHealth(env), requestId);
        return response;
      }

      if (path === '/ready') {
        response = withRequestId(handleReady(env), requestId);
        return response;
      }

      let principal: { userId: string; roles: string[]; gatewayToken: string } | null = null;
      if (path.startsWith('/v1/feed/') && isProtectedRoute(request.method, path)) {
        const auth = await requireGatewayOrigin(request, env, requestId, logger);
        if (!auth.ok) {
          response = withRequestId(auth.res, requestId);
          return response;
        }
        principal = {
          ...auth.principal,
          gatewayToken: request.headers.get('X-Gateway-Auth') ?? '',
        };
      }

      response = (await handleFeedRoute(request, env, requestId, principal)) ?? handleNotFound(path, requestId);
      return withRequestId(response, requestId);
    } catch (error) {
      logger.error('Unhandled error', error, { method: request.method, path });
      response = json(
        {
          error: { code: 'INTERNAL_ERROR', message: 'Unexpected error' },
          requestId,
        },
        500
      );
      return withRequestId(response, requestId);
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
