import { createLogger, generateRequestId, getRequestId, logRequestCompleted } from '@go2asia/logger';

import { requireGatewayOrigin, type GatewayPrincipal } from './middleware/auth';
import { errorResponse, getSecretCheck, handleNotFound, json, withRequestId } from './middleware/http';
import { handleRfRoute } from './routes/rf';

export interface Env {
  ENVIRONMENT?: string;
  VERSION?: string;
  SERVICE_JWT_SECRET?: string;
  DATABASE_URL?: string;
  POINTS_SERVICE_URL?: string;
  RF_ENABLE_PAID_VOUCHER_SPEND?: string;
}

function handleHealth(env: Env): Response {
  return json({
    service: 'rf-service',
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
      service: 'rf-service',
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
  if (path.startsWith('/v1/rf/business/')) return true;
  if (path.startsWith('/v1/rf/pro/')) return true;
  if (path.startsWith('/v1/rf/me/')) return true;
  if (method === 'POST' && /^\/v1\/rf\/offers\/[^/]+\/claim$/.test(path)) return true;
  if (method === 'POST' && /^\/v1\/rf\/rielt\/listings\/[^/]+\/offers\/[^/]+\/claim$/.test(path)) return true;
  if (path.startsWith('/v1/rf/internal/')) return true;
  return false;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const requestId = getRequestId(request) || generateRequestId();
    const logger = createLogger(requestId, 'rf-service', {
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

      let principal: GatewayPrincipal | null = null;
      if (path.startsWith('/v1/rf/')) {
        if (isProtectedRoute(request.method, path)) {
          const auth = await requireGatewayOrigin(request, env, requestId, logger);
          if (!auth.ok) {
            response = withRequestId(auth.res, requestId);
            return response;
          }
          principal = auth.principal;
        }
      }

      const rfResponse = await handleRfRoute(request, env, requestId, principal);
      if (rfResponse) {
        response = rfResponse;
      } else if (path.startsWith('/v1/rf/')) {
        // Keep RF route misses machine-readable for downstream consumers.
        response = errorResponse('RF_ROUTE_NOT_FOUND', 'RF route not found', requestId, 404);
      } else {
        response = handleNotFound(path, requestId);
      }
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
