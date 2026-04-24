import { createDb, sql } from '@go2asia/db';
import { createLogger, generateRequestId, getRequestId, logRequestCompleted } from '@go2asia/logger';

import { createNoopQuestEventPublisher } from './events/publisher';
import { requireGatewayOrigin, requireServiceAuth } from './middleware/auth';
import { getSecretCheck, handleNotFound, json, withRequestId } from './middleware/http';
import { handleQuestRoute } from './routes/quests';
import { runScheduledQuestRewardReplay } from './services/questService';

const SERVICE_NAME = 'quest-service';

export interface Env {
  ENVIRONMENT?: string;
  VERSION?: string;
  SERVICE_JWT_SECRET?: string;
  DATABASE_URL?: string;
  POINTS_SERVICE_URL?: string;
}

function handleHealth(env: Env): Response {
  return json({
    service: 'quest-service',
    env: env.ENVIRONMENT ?? 'staging',
    status: 'ok',
    version: env.VERSION ?? 'unknown',
  });
}

async function handleReady(env: Env): Promise<Response> {
  const checks = {
    databaseUrl: getSecretCheck(env.DATABASE_URL),
    pointsServiceUrl: getSecretCheck(env.POINTS_SERVICE_URL),
    serviceJwtSecret: getSecretCheck(env.SERVICE_JWT_SECRET),
    databaseConnection: 'missing' as 'ok' | 'missing',
  };

  if (checks.databaseUrl === 'ok') {
    try {
      const db = createDb(env.DATABASE_URL!);
      await db.execute(sql`SELECT 1`);
      checks.databaseConnection = 'ok';
    } catch {
      checks.databaseConnection = 'missing';
    }
  }

  const missing = Object.entries(checks)
    .filter(([, status]) => status !== 'ok')
    .map(([name]) => name);
  const status = missing.length === 0 ? 200 : 503;

  return json(
    {
      service: 'quest-service',
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
  if (method === 'POST' && path === '/v1/quests') return true;
  if (method === 'GET' && path === '/v1/quests/mine') return true;
  if (method === 'GET' && /^\/v1\/quests\/mine\/[^/]+$/.test(path)) return true;
  if (method === 'GET' && /^\/v1\/quests\/mine\/[^/]+\/stats$/.test(path)) return true;
  if (method === 'PATCH' && /^\/v1\/quests\/mine\/[^/]+$/.test(path)) return true;
  if (method === 'PATCH' && /^\/v1\/quests\/mine\/[^/]+\/steps\/[^/]+$/.test(path)) return true;
  if (method === 'DELETE' && /^\/v1\/quests\/mine\/[^/]+\/steps\/[^/]+$/.test(path)) return true;
  if (method === 'POST' && /^\/v1\/quests\/[^/]+\/start$/.test(path)) return true;
  if (method === 'GET' && /^\/v1\/quests\/[^/]+\/progress$/.test(path)) return true;
  if (method === 'POST' && /^\/v1\/quests\/[^/]+\/steps$/.test(path)) return true;
  if (method === 'POST' && /^\/v1\/quests\/[^/]+\/publish$/.test(path)) return true;
  if (method === 'POST' && /^\/v1\/quests\/[^/]+\/archive$/.test(path)) return true;
  if (method === 'POST' && /^\/v1\/quests\/[^/]+\/steps\/[^/]+\/submit$/.test(path)) return true;
  if (method === 'GET' && /^\/v1\/quests\/[^/]+\/submissions$/.test(path)) return true;
  if (method === 'POST' && /^\/v1\/submissions\/[^/]+\/review$/.test(path)) return true;
  return false;
}

function isServiceRoute(method: string, path: string): boolean {
  return (
    (method === 'POST' && path === '/internal/quests/rewards/replay-pending') ||
    (method === 'GET' && path === '/internal/quests/rewards/outbox/stats') ||
    (method === 'GET' && path === '/internal/quests/rewards/outbox/failed') ||
    (method === 'POST' && path === '/internal/quests/rewards/outbox/requeue-failed')
  );
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const requestId = getRequestId(request) || generateRequestId();
    const logger = createLogger(requestId, 'quest-service', {
      env: env.ENVIRONMENT,
      version: env.VERSION,
    });
    const publisher = createNoopQuestEventPublisher(logger);
    const path = new URL(request.url).pathname;
    const startedAt = Date.now();
    let response: Response | null = null;

    try {
      if (path === '/health' || path === '/version') {
        response = withRequestId(handleHealth(env), requestId);
        return response;
      }

      if (path === '/ready') {
        response = withRequestId(await handleReady(env), requestId);
        return response;
      }

      let principal = null;
      let servicePrincipal = null;
      if (isServiceRoute(request.method, path)) {
        const auth = await requireServiceAuth(request, env, requestId, logger, SERVICE_NAME);
        if (!auth.ok) {
          response = withRequestId(auth.res, requestId);
          return response;
        }
        servicePrincipal = auth.principal;
      } else if (isProtectedRoute(request.method, path)) {
        const auth = await requireGatewayOrigin(request, env, requestId, logger);
        if (!auth.ok) {
          response = withRequestId(auth.res, requestId);
          return response;
        }
        principal = auth.principal;
      }

      response =
        (await handleQuestRoute(request, env, requestId, publisher, principal, servicePrincipal)) ??
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
  async scheduled(controller: ScheduledController, env: Env, _ctx: ExecutionContext): Promise<void> {
    const requestId = generateRequestId();
    const logger = createLogger(requestId, SERVICE_NAME, {
      env: env.ENVIRONMENT,
      version: env.VERSION,
    });

    const summary = await runScheduledQuestRewardReplay(env, requestId);
    if (summary instanceof Response) {
      logger.warn('Scheduled quest reward replay did not complete', {
        cron: controller.cron,
        scheduledTime: controller.scheduledTime,
        status: summary.status,
      });
      return;
    }

    logger.info('Scheduled quest reward replay completed', {
      cron: controller.cron,
      scheduledTime: controller.scheduledTime,
      ...summary,
    });
  },
};
