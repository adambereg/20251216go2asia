import { createLogger, generateRequestId, getRequestId, logRequestCompleted } from '@go2asia/logger';
import { createDb, sql } from '@go2asia/db';

import { getSecretCheck, handleNotFound, json, withRequestId } from './middleware/http';
import { handleQuestRoute } from './routes/quests';

export interface Env {
  ENVIRONMENT?: string;
  VERSION?: string;
  SERVICE_JWT_SECRET?: string;
  DATABASE_URL?: string;
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

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const requestId = getRequestId(request) || generateRequestId();
    const logger = createLogger(requestId, 'quest-service', {
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
        response = withRequestId(await handleReady(env), requestId);
        return response;
      }
      response = (await handleQuestRoute(request, env, requestId)) ?? handleNotFound(path, requestId);
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
