/**
 * Token Service (staging) — skeleton Worker.
 *
 * Goal for Milestone 2:
 * - reproducible deploy from repo
 * - stable unauthenticated /health endpoint (no DB)
 */

import { createLogger, generateRequestId, getRequestId, logRequestCompleted } from '@go2asia/logger';

export interface Env {
  ENVIRONMENT?: string;
  VERSION?: string;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function handleHealth(env: Env): Response {
  return json({
    service: 'token-service',
    env: env.ENVIRONMENT ?? 'staging',
    status: 'ok',
    version: env.VERSION ?? 'unknown',
  });
}

function handleReady(env: Env): Response {
  return json({
    service: 'token-service',
    env: env.ENVIRONMENT ?? 'staging',
    status: 'ready',
    version: env.VERSION ?? 'unknown',
    checks: {},
    missing: [],
  });
}

function handleNotFound(path: string): Response {
  return json(
    {
      error: {
        code: 'NOT_FOUND',
        message: `No route for path: ${path}`,
      },
    },
    404
  );
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const requestId = getRequestId(request) || generateRequestId();
    const logger = createLogger(requestId, 'token-service', {
      env: env.ENVIRONMENT,
      version: env.VERSION,
    });

    const url = new URL(request.url);
    const path = url.pathname;
    const startedAt = Date.now();
    let response: Response | null = null;

    try {
      if (path === '/health' || path === '/version') {
        response = handleHealth(env);
        response.headers.set('X-Request-ID', requestId);
        return response;
      }

      if (path === '/ready') {
        response = handleReady(env);
        response.headers.set('X-Request-ID', requestId);
        return response;
      }

      logger.warn('Unhandled route', { method: request.method, path });
      response = handleNotFound(path);
      response.headers.set('X-Request-ID', requestId);
      return response;
    } catch (error) {
      logger.error('Unhandled error', error, { method: request.method, path });
      response = json(
        {
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Unexpected error',
          },
          requestId,
        },
        500
      );
      response.headers.set('X-Request-ID', requestId);
      return response;
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



