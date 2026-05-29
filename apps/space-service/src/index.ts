import { createLogger, generateRequestId, getRequestId, logRequestCompleted } from '@go2asia/logger';

import { createNoopSpaceEventPublisher } from './events/publisher';
import { getOptionalGatewayPrincipal, requireGatewayOrigin } from './middleware/auth';
import { getSecretCheck, handleNotFound, json, withRequestId } from './middleware/http';
import { handleFeedRoute } from './routes/feed';
import { handleGroupsRoute } from './routes/groups';
import { handlePostsRoute } from './routes/posts';
import { handleProfilesRoute } from './routes/profiles';

export interface Env {
  ENVIRONMENT?: string;
  VERSION?: string;
  SERVICE_JWT_SECRET?: string;
  DATABASE_URL?: string;
  SPACE_MAX_MEDIA_ATTACHMENTS?: string;
  SPACE_MAX_TEXT_LENGTH?: string;
}

function handleHealth(env: Env): Response {
  return json({
    service: 'space-service',
    env: env.ENVIRONMENT ?? 'staging',
    status: 'ok',
    version: env.VERSION ?? 'unknown',
  });
}

function handleReady(env: Env): Response {
  const checks = {
    databaseUrl: getSecretCheck(env.DATABASE_URL),
    serviceJwtSecret: getSecretCheck(env.SERVICE_JWT_SECRET),
  };
  const missing = Object.entries(checks)
    .filter(([, status]) => status !== 'ok')
    .map(([name]) => name);
  const status = missing.length === 0 ? 200 : 503;

  return json(
    {
      service: 'space-service',
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
  if (method === 'POST' && path === '/v1/space/posts') return true;
  if (method === 'PATCH' && /^\/v1\/space\/posts\/[^/]+$/.test(path)) return true;
  if (method === 'DELETE' && /^\/v1\/space\/posts\/[^/]+$/.test(path)) return true;
  if (method === 'POST' && /^\/v1\/space\/posts\/[^/]+\/repost$/.test(path)) return true;
  if (method === 'POST' && /^\/v1\/space\/posts\/[^/]+\/media$/.test(path)) return true;
  if (method === 'DELETE' && /^\/v1\/space\/posts\/[^/]+\/media\/[^/]+$/.test(path)) return true;
  if (method === 'POST' && path === '/v1/space/groups') return true;
  if (method === 'POST' && /^\/v1\/space\/groups\/[^/]+\/join$/.test(path)) return true;
  if (method === 'POST' && /^\/v1\/space\/groups\/[^/]+\/leave$/.test(path)) return true;
  if (method === 'GET' && path === '/v1/space/feed/home') return true;
  if (method === 'GET' && path === '/v1/space/feed/activity') return true;
  return false;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const requestId = getRequestId(request) || generateRequestId();
    const logger = createLogger(requestId, 'space-service', {
      env: env.ENVIRONMENT,
      version: env.VERSION,
    });
    const publisher = createNoopSpaceEventPublisher(logger);
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

      let principal = null;
      if (path.startsWith('/v1/space/')) {
        if (isProtectedRoute(request.method, path)) {
          const auth = await requireGatewayOrigin(request, env, requestId, logger);
          if (!auth.ok) {
            response = withRequestId(auth.res, requestId);
            return response;
          }
          principal = auth.principal;
        } else {
          const auth = await getOptionalGatewayPrincipal(request, env, requestId, logger);
          if (!auth.ok) {
            response = withRequestId(auth.res, requestId);
            return response;
          }
          principal = auth.principal;
        }
      }

      response =
        (await handlePostsRoute(request, env, requestId, publisher, principal)) ??
        (await handleGroupsRoute(request, env, requestId, publisher, principal)) ??
        (await handleFeedRoute(request, env, requestId, principal)) ??
        (await handleProfilesRoute(request, env, requestId)) ??
        handleNotFound(path, requestId);

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
