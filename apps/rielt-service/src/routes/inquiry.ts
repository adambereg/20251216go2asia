import type { GatewayPrincipal } from '../middleware/auth';
import type { RequestContext } from '../middleware/context';

type Env = {
  DATABASE_URL?: string;
};

export async function handleInquiryRoute(
  request: Request,
  _env: Env,
  _context: RequestContext,
  _principal: GatewayPrincipal | null
): Promise<Response | null> {
  const path = new URL(request.url).pathname;

  if (path === '/v1/rielt/my/inquiries' && request.method === 'GET') return null;

  const inquiryMatch = path.match(/^\/v1\/rielt\/listings\/([^/]+)\/inquiries$/);
  if (inquiryMatch && request.method === 'POST') return null;

  return null;
}
