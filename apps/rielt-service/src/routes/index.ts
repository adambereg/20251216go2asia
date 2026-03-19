import type { GatewayPrincipal } from '../middleware/auth';
import type { RequestContext } from '../middleware/context';

import { handleInquiryRoute } from './inquiry';
import { handleOwnerRoute } from './owner';
import { handlePublicRoute } from './public';

type Env = {
  DATABASE_URL?: string;
};

export async function handleRieltRoute(
  request: Request,
  env: Env,
  context: RequestContext,
  principal: GatewayPrincipal | null
): Promise<Response | null> {
  return (
    (await handlePublicRoute(request, env, context, principal)) ??
    (await handleOwnerRoute(request, env, context, principal)) ??
    (await handleInquiryRoute(request, env, context, principal))
  );
}
