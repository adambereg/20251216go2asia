import type { GatewayPrincipal } from '../middleware/auth';
import type { RequestContext } from '../middleware/context';
import { errorResponse, readJsonObject } from '../middleware/http';
import {
  archiveOwnedListing,
  createOwnedListing,
  listMyOwnedListings,
  patchOwnedListing,
} from '../services/rieltService';

type Env = {
  DATABASE_URL?: string;
};

export async function handleOwnerRoute(
  request: Request,
  env: Env,
  context: RequestContext,
  principal: GatewayPrincipal | null
): Promise<Response | null> {
  const path = new URL(request.url).pathname;

  if (path === '/v1/rielt/listings' && request.method === 'POST') {
    if (!principal) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', context.requestId, 401);
    }
    const body = await readJsonObject(request);
    return createOwnedListing(env, principal, body, context.requestId);
  }
  if (path === '/v1/rielt/my/listings' && request.method === 'GET') {
    if (!principal) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', context.requestId, 401);
    }
    return listMyOwnedListings(env, principal, new URL(request.url), context.requestId);
  }

  const isOwnerListingPath = /^\/v1\/rielt\/listings\/[^/]+$/.test(path) && path !== '/v1/rielt/listings/nearby';
  const listingMatch = isOwnerListingPath ? path.match(/^\/v1\/rielt\/listings\/([^/]+)$/) : null;
  if (listingMatch && request.method === 'PATCH') {
    if (!principal) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', context.requestId, 401);
    }
    const body = await readJsonObject(request);
    return patchOwnedListing(env, listingMatch[1], principal, body, context.requestId);
  }
  if (listingMatch && request.method === 'DELETE') {
    if (!principal) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', context.requestId, 401);
    }
    return archiveOwnedListing(env, listingMatch[1], principal, context.requestId);
  }

  return null;
}
