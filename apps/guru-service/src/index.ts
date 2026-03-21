import { logRequestCompleted } from '@go2asia/logger';

import { getOptionalGatewayPrincipal } from './middleware/auth';
import { createRequestContext } from './middleware/context';
import { getSecretCheck, handleNotFound, json, withRequestId } from './middleware/http';
import { handleGuruRoute } from './routes';

export interface Env {
  ENVIRONMENT?: string;
  VERSION?: string;
  SERVICE_JWT_SECRET?: string;
  RIELT_SERVICE_URL?: string;
  RF_SERVICE_URL?: string;
  QUEST_SERVICE_URL?: string;
}

function handleHealth(env: Env): Response {
  return json({
    service: 'guru-service',
    env: env.ENVIRONMENT ?? 'staging',
    status: 'ok',
    version: env.VERSION ?? 'unknown',
  });
}

function handleReady(env: Env): Response {
  const checks = {
    serviceJwtSecret: getSecretCheck(env.SERVICE_JWT_SECRET),
    rieltServiceUrl: getSecretCheck(env.RIELT_SERVICE_URL),
    rfServiceUrl: getSecretCheck(env.RF_SERVICE_URL),
    questServiceUrl: getSecretCheck(env.QUEST_SERVICE_URL),
  };

  const missing = Object.entries(checks)
    .filter(([, status]) => status !== 'ok')
    .map(([name]) => name);
  const status = missing.length === 0 ? 200 : 503;

  return json(
    {
      service: 'guru-service',
      env: env.ENVIRONMENT ?? 'staging',
      status: status === 200 ? 'ready' : 'not_ready',
      version: env.VERSION ?? 'unknown',
      checks,
      missing,
    },
    status
  );
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

      if (context.path.startsWith('/v1/guru/')) {
        const auth = await getOptionalGatewayPrincipal(request, env, context.requestId, context.logger);
        if (!auth.ok) {
          response = withRequestId(auth.res, context.requestId);
          return response;
        }
      }

      response = (await handleGuruRoute(request, env, context)) ?? handleNotFound(context.path, context.requestId);
      return withRequestId(response, context.requestId);
    } catch (error) {
      context.logger.error('Unhandled error', error, {
        method: context.method,
        path: context.path,
      });
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
