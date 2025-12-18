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
  [key: string]: unknown;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface Logger {
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, error?: Error | unknown, context?: LogContext): void;
}

/**
 * Creates a logger instance with requestId support
 */
export function createLogger(requestId?: string, service?: string): Logger {
  const baseContext: LogContext = {
    requestId,
    service,
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
      const errorContext: LogContext = {
        ...context,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      };
      console.error(formatMessage('error', message, errorContext));
    },
  };
}

/**
 * Extracts requestId from Cloudflare Workers request headers
 */
export function getRequestId(request: Request): string | undefined {
  return request.headers.get('X-Request-ID') || undefined;
}

/**
 * Generates a new requestId
 */
export function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}





