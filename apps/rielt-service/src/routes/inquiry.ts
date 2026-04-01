import type { GatewayPrincipal } from '../middleware/auth';
import type { RequestContext } from '../middleware/context';
import { errorResponse, readJsonObject } from '../middleware/http';
import { createListingInquiryByIdOrSlug, listMyListingInquiries } from '../services/rieltService';

type Env = {
  DATABASE_URL?: string;
};

export async function handleInquiryRoute(
  request: Request,
  env: Env,
  context: RequestContext,
  principal: GatewayPrincipal | null
): Promise<Response | null> {
  const path = new URL(request.url).pathname;

  if (path === '/v1/rielt/my/inquiries' && request.method === 'GET') {
    if (!principal) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', context.requestId, 401);
    }
    return listMyListingInquiries(env, principal, new URL(request.url), context.requestId);
  }

  const inquiryMatch = path.match(/^\/v1\/rielt\/listings\/([^/]+)\/inquiries$/);
  if (inquiryMatch && request.method === 'POST') {
    if (!principal) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', context.requestId, 401);
    }
    const listingIdOrSlug = decodeURIComponent(inquiryMatch[1] ?? '');
    const body = await readJsonObject(request);
    return createListingInquiryByIdOrSlug(
      env,
      principal,
      listingIdOrSlug,
      request.headers.get('Idempotency-Key'),
      body,
      context.requestId
    );
  }

  return null;
}
