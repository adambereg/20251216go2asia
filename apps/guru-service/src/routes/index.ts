import type { RequestContext } from '../middleware/context';

import { handleNearbyRoute } from './nearby';

type Env = {
  RIELT_SERVICE_URL?: string;
  RF_SERVICE_URL?: string;
  QUEST_SERVICE_URL?: string;
};

export async function handleGuruRoute(request: Request, env: Env, context: RequestContext): Promise<Response | null> {
  return (await handleNearbyRoute(request, env, context)) ?? null;
}
