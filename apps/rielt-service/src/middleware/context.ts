import { createLogger, generateRequestId, getRequestId } from '@go2asia/logger';

export interface ServiceContextEnv {
  ENVIRONMENT?: string;
  VERSION?: string;
}

export interface RequestContext {
  requestId: string;
  path: string;
  method: string;
  startedAt: number;
  logger: ReturnType<typeof createLogger>;
}

export function createRequestContext(request: Request, env: ServiceContextEnv): RequestContext {
  const requestId = getRequestId(request) || generateRequestId();
  const path = new URL(request.url).pathname;
  const method = request.method;
  const startedAt = Date.now();
  const logger = createLogger(requestId, 'rielt-service', {
    env: env.ENVIRONMENT,
    version: env.VERSION,
  });

  return {
    requestId,
    path,
    method,
    startedAt,
    logger,
  };
}
