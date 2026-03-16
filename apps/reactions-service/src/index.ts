import { createLogger, generateRequestId, getRequestId, logRequestCompleted } from '@go2asia/logger';

import { createNoopReactionsEventPublisher } from './events/publisher';
import { getOptionalGatewayPrincipal, requireGatewayOrigin } from './middleware/auth';
import { getSecretCheck, handleNotFound, json, withRequestId } from './middleware/http';
import { handleReactionsRoute } from './routes/reactions';

export interface Env {
  ENVIRONMENT?: string;
  VERSION?: string;
  SERVICE_JWT_SECRET?: string;
  DATABASE_URL?: string;
}

function handleHealth(env: Env): Response {
  return json({
    service: 'reactions-service',
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
      service: 'reactions-service',
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
  if (method === 'POST' && path === '/v1/reactions') return true;
  if (method === 'DELETE' && /^\/v1\/reactions\/[^/]+$/.test(path)) return true;
  return false;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const requestId = getRequestId(request) || generateRequestId();
    const logger = createLogger(requestId, 'reactions-service', {
      env: env.ENVIRONMENT,
      version: env.VERSION,
    });
    const publisher = createNoopReactionsEventPublisher(logger);
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
      if (path === '/v1/reactions' || path.startsWith('/v1/reactions/')) {
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

      response = (await handleReactionsRoute(request, env, requestId, publisher, principal)) ?? handleNotFound(path, requestId);
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
