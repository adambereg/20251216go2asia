import { logRequestCompleted } from '@go2asia/logger';

import { getOptionalGatewayPrincipal, requireGatewayOrigin } from './middleware/auth';
import { createRequestContext } from './middleware/context';
import { getSecretCheck, handleNotFound, json, withRequestId } from './middleware/http';
import { handleRieltRoute } from './routes';

export interface Env {
  ENVIRONMENT?: string;
  VERSION?: string;
  SERVICE_JWT_SECRET?: string;
  DATABASE_URL?: string;
}

function handleHealth(env: Env): Response {
  return json({
    service: 'rielt-service',
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
      service: 'rielt-service',
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
  const isOwnerListingPath = /^\/v1\/rielt\/listings\/[^/]+$/.test(path) && path !== '/v1/rielt/listings/nearby';
  if (method === 'POST' && path === '/v1/rielt/listings') return true;
  if (method === 'GET' && path === '/v1/rielt/my/listings') return true;
  if (method === 'GET' && path === '/v1/rielt/my/inquiries') return true;
  if (method === 'POST' && /^\/v1\/rielt\/listings\/[^/]+\/inquiries$/.test(path)) return true;
  if (method === 'PATCH' && isOwnerListingPath) return true;
  if (method === 'DELETE' && isOwnerListingPath) return true;
  return false;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const context = createRequestContext(request, env);
    let response: Response | null = null;

    try {
      if (context.path === '/health' || context.path === '/version') {
        response = withRequestId(handleHealth(env), context.requestId);
        return response;
      }

      if (context.path === '/ready') {
        response = withRequestId(handleReady(env), context.requestId);
        return response;
      }

      let principal = null;
      if (context.path.startsWith('/v1/rielt/')) {
        if (isProtectedRoute(context.method, context.path)) {
          const auth = await requireGatewayOrigin(request, env, context.requestId, context.logger);
          if (!auth.ok) {
            response = withRequestId(auth.res, context.requestId);
            return response;
          }
          principal = auth.principal;
        } else {
          const auth = await getOptionalGatewayPrincipal(request, env, context.requestId, context.logger);
          if (!auth.ok) {
            response = withRequestId(auth.res, context.requestId);
            return response;
          }
          principal = auth.principal;
        }
      }

      response = (await handleRieltRoute(request, env, context, principal)) ?? handleNotFound(context.path, context.requestId);
      return withRequestId(response, context.requestId);
    } catch (error) {
      context.logger.error('Unhandled error', error, { method: context.method, path: context.path });
      response = json(
        {
          error: { code: 'INTERNAL_ERROR', message: 'Unexpected error' },
          requestId: context.requestId,
        },
        500
      );
      return withRequestId(response, context.requestId);
    } finally {
      logRequestCompleted(context.logger, {
        method: context.method,
        path: context.path,
        status: response?.status ?? 500,
        durationMs: Date.now() - context.startedAt,
      });
    }
  },
};
