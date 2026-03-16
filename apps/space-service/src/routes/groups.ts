import type { SpaceEventPublisher } from '../events/publisher';
import { type GatewayPrincipal } from '../middleware/auth';
import { readJsonObject } from '../middleware/http';
import { createGroup, getGroup, joinGroup, leaveGroup } from '../services/spaceService';

type Env = {
  DATABASE_URL?: string;
};

export async function handleGroupsRoute(
  request: Request,
  env: Env,
  requestId: string,
  publisher: SpaceEventPublisher,
  principal: GatewayPrincipal | null
): Promise<Response | null> {
  const path = new URL(request.url).pathname;

  if (path === '/v1/space/groups' && request.method === 'POST' && principal) {
    const body = await readJsonObject(request);
    return createGroup(env, body, principal, requestId, publisher);
  }

  const groupMatch = path.match(/^\/v1\/space\/groups\/([^/]+)$/);
  if (groupMatch && request.method === 'GET') {
    return getGroup(env, decodeURIComponent(groupMatch[1]), principal, requestId);
  }

  const joinMatch = path.match(/^\/v1\/space\/groups\/([^/]+)\/join$/);
  if (joinMatch && request.method === 'POST' && principal) {
    return joinGroup(env, decodeURIComponent(joinMatch[1]), principal, requestId, publisher);
  }

  const leaveMatch = path.match(/^\/v1\/space\/groups\/([^/]+)\/leave$/);
  if (leaveMatch && request.method === 'POST' && principal) {
    return leaveGroup(env, decodeURIComponent(leaveMatch[1]), principal, requestId, publisher);
  }

  return null;
}
