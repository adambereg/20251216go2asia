import type { GatewayPrincipal } from '../middleware/auth';
import type { RequestContext } from '../middleware/context';

type Env = {
  DATABASE_URL?: string;
};

export async function handleOwnerRoute(
  request: Request,
  _env: Env,
  _context: RequestContext,
  _principal: GatewayPrincipal | null
): Promise<Response | null> {
  const path = new URL(request.url).pathname;

  if (path === '/v1/rielt/listings' && request.method === 'POST') return null;
  if (path === '/v1/rielt/my/listings' && request.method === 'GET') return null;

  const listingMatch = path.match(/^\/v1\/rielt\/listings\/([^/]+)$/);
  if (listingMatch && (request.method === 'PATCH' || request.method === 'DELETE')) return null;

  return null;
}
