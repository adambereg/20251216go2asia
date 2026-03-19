import type { GatewayPrincipal } from '../middleware/auth';
import type { RequestContext } from '../middleware/context';
import { errorResponse } from '../middleware/http';
import { getPublicListing, listNearbyPublicListings, listPublicListings } from '../services/rieltService';
import { parseListingPathParams } from '../validation/rielt';

type Env = {
  DATABASE_URL?: string;
};

export async function handlePublicRoute(
  request: Request,
  env: Env,
  context: RequestContext,
  _principal: GatewayPrincipal | null
): Promise<Response | null> {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/v1/rielt/listings' && request.method === 'GET') {
    return listPublicListings(env, url, context.requestId);
  }
  if (path === '/v1/rielt/listings/nearby' && request.method === 'GET') {
    return listNearbyPublicListings(env, url, context.requestId);
  }

  const listingMatch = path.match(/^\/v1\/rielt\/listings\/([^/]+)$/);
  if (listingMatch && request.method === 'GET') {
    const params = parseListingPathParams(decodeURIComponent(listingMatch[1] ?? ''));
    if (!params) {
      return errorResponse('VALIDATION_ERROR', 'Invalid listing idOrSlug', context.requestId, 400);
    }
    return getPublicListing(env, params.idOrSlug, context.requestId);
  }

  return null;
}
