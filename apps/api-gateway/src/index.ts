/**
 * API Gateway for Go2Asia MVP
 * 
 * Cloudflare Worker that routes requests to backend microservices.
 * Handles JWT validation, requestId propagation, and basic routing.
 */

import { createLogger, getRequestId, generateRequestId } from '@go2asia/logger';

export interface Env {
  // Service URLs (internal)
  AUTH_SERVICE_URL?: string;
  CONTENT_SERVICE_URL?: string;
  POINTS_SERVICE_URL?: string;
  REFERRAL_SERVICE_URL?: string;
  
  // Secrets (Cloudflare Secrets)
  CLERK_JWT_SECRET?: string;
  SERVICE_JWT_SECRET?: string;

  // Runtime vars (Cloudflare Vars)
  ENVIRONMENT?: string;
  VERSION?: string;
}

/**
 * Health check endpoint
 */
async function handleHealth(env: Env): Promise<Response> {
  return new Response(
    JSON.stringify({
      service: 'api-gateway',
      env: env.ENVIRONMENT ?? 'staging',
      status: 'ok',
      version: env.VERSION ?? 'unknown',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Ready check endpoint
 */
async function handleReady(): Promise<Response> {
  return new Response(
    JSON.stringify({
      status: 'ready',
      service: 'api-gateway',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Route request to appropriate service
 */
async function routeRequest(
  request: Request,
  env: Env,
  logger: ReturnType<typeof createLogger>
): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  // Health checks
  if (path === '/health') {
    return handleHealth(env);
  }
  if (path === '/ready') {
    return handleReady();
  }

  // Route to services based on path prefix
  let serviceUrl: string | undefined;
  
  if (path.startsWith('/v1/auth/')) {
    serviceUrl = env.AUTH_SERVICE_URL;
  } else if (path.startsWith('/v1/content/')) {
    serviceUrl = env.CONTENT_SERVICE_URL;
  } else if (path.startsWith('/v1/points/')) {
    serviceUrl = env.POINTS_SERVICE_URL;
  } else if (path.startsWith('/v1/referral/')) {
    serviceUrl = env.REFERRAL_SERVICE_URL;
  }

  if (!serviceUrl) {
    logger.warn('No service found for path', { path });
    return new Response(
      JSON.stringify({
        error: {
          code: 'NOT_FOUND',
          message: `No service found for path: ${path}`,
        },
      }),
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  // Forward request to service
  const serviceRequest = new Request(`${serviceUrl}${path}${url.search}`, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });

  try {
    const response = await fetch(serviceRequest);
    return response;
  } catch (error) {
    logger.error('Error forwarding request to service', error, {
      serviceUrl,
      path,
    });
    return new Response(
      JSON.stringify({
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Backend service is temporarily unavailable',
        },
      }),
      {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

/**
 * Main handler for Cloudflare Worker
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Extract or generate requestId
    const requestId = getRequestId(request) || generateRequestId();
    const logger = createLogger(requestId, 'api-gateway');

    logger.info('Incoming request', {
      method: request.method,
      path: new URL(request.url).pathname,
    });

    try {
      const response = await routeRequest(request, env, logger);
      
      // Add requestId to response headers
      response.headers.set('X-Request-ID', requestId);
      
      return response;
    } catch (error) {
      logger.error('Unhandled error in API Gateway', error);
      return new Response(
        JSON.stringify({
          error: {
            code: 'INTERNAL_ERROR',
            message: 'An internal error occurred',
          },
          requestId,
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'X-Request-ID': requestId,
          },
        }
      );
    }
  },
};





