/**
 * @go2asia/logger
 * 
 * Unified logger with requestId support for Go2Asia services.
 * 
 * Compatible with Cloudflare Workers runtime.
 */

export interface LogContext {
  requestId?: string;
  userId?: string;
  service?: string;
  env?: string;
  version?: string;
  [key: string]: unknown;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface Logger {
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, error?: Error | unknown, context?: LogContext): void;
}

export interface LoggerRuntimeContext {
  env?: string;
  version?: string;
}

export interface RequestCompletionContext extends LogContext {
  method: string;
  path: string;
  status: number;
  durationMs: number;
}

function isPlainObject(value: unknown): value is LogContext {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Creates a logger instance with requestId support
 */
export function createLogger(
  requestId?: string,
  service?: string,
  runtime?: LoggerRuntimeContext
): Logger {
  const baseContext: LogContext = {
    requestId,
    service,
    env: runtime?.env,
    version: runtime?.version,
  };

  const formatMessage = (
    level: LogLevel,
    message: string,
    context?: LogContext
  ): string => {
    const timestamp = new Date().toISOString();
    const contextStr = JSON.stringify({ ...baseContext, ...context });
    return `[${timestamp}] [${level.toUpperCase()}] ${message} ${contextStr}`;
  };

  return {
    debug: (message: string, context?: LogContext) => {
      console.log(formatMessage('debug', message, context));
    },
    info: (message: string, context?: LogContext) => {
      console.log(formatMessage('info', message, context));
    },
    warn: (message: string, context?: LogContext) => {
      console.warn(formatMessage('warn', message, context));
    },
    error: (message: string, error?: Error | unknown, context?: LogContext) => {
      let errorContext: LogContext = { ...(context ?? {}) };
      if (error instanceof Error) {
        errorContext = {
          ...errorContext,
          error: error.message,
          stack: error.stack,
        };
      } else if (typeof context !== 'undefined') {
        errorContext = {
          ...errorContext,
          error: String(error),
        };
      } else if (isPlainObject(error)) {
        errorContext = {
          ...error,
        };
      } else if (typeof error !== 'undefined') {
        errorContext = {
          ...errorContext,
          error: String(error),
        };
      }
      console.error(formatMessage('error', message, errorContext));
    },
  };
}

/**
 * Extracts requestId from Cloudflare Workers request headers
 */
export function getRequestId(request: Request): string | undefined {
  return request.headers.get('X-Request-ID') || request.headers.get('X-Request-Id') || undefined;
}

/**
 * Generates a new requestId
 */
export function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function logRequestCompleted(logger: Logger, context: RequestCompletionContext): void {
  const outcome =
    context.status >= 500 ? 'error' : context.status >= 400 ? 'client_error' : 'success';
  logger.info('Request completed', {
    ...context,
    outcome,
  });
}







