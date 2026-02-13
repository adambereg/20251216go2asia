/**
 * Go2Asia Worker service template (Phase 2 / Milestone 2.0).
 *
 * Copy this folder into apps/<service-name> when starting a new service milestone.
 */

import { createLogger, generateRequestId, getRequestId } from '@go2asia/logger';

const SERVICE_NAME = '__SERVICE__';

export interface Env {
  ENVIRONMENT?: string;
  VERSION?: string;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function handleHealth(env: Env): Response {
  return json({
    service: SERVICE_NAME,
    env: env.ENVIRONMENT ?? 'staging',
    status: 'ok',
    version: env.VERSION ?? 'unknown',
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
    const logger = createLogger(requestId, SERVICE_NAME);

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      if (path === '/health' || path === '/version') {
        const res = handleHealth(env);
        res.headers.set('X-Request-ID', requestId);
        return res;
      }

      // Implement /v1/* and /internal/* routes here for real services.
      logger.warn('Unhandled route', { method: request.method, path });
      const res = handleNotFound(path);
      res.headers.set('X-Request-ID', requestId);
      return res;
    } catch (error) {
      logger.error('Unhandled error', error);
      const res = json(
        {
          error: { code: 'INTERNAL_ERROR', message: 'An internal error occurred' },
          requestId,
        },
        500
      );
      res.headers.set('X-Request-ID', requestId);
      return res;
    }
  },
};


