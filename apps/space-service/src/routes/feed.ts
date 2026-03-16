import { type GatewayPrincipal } from '../middleware/auth';
import { parsePositiveInt } from '../middleware/http';
import { getActivityFeed, getGroupFeed, getHomeFeed, getProfileFeed } from '../services/spaceService';

type Env = {
  DATABASE_URL?: string;
};

export async function handleFeedRoute(
  request: Request,
  env: Env,
  requestId: string,
  principal: GatewayPrincipal | null
): Promise<Response | null> {
  const url = new URL(request.url);
  const path = url.pathname;
  const limit = parsePositiveInt(url.searchParams.get('limit'), 20, 100);
  const cursor = url.searchParams.get('cursor');

  if (path === '/v1/space/feed/home' && request.method === 'GET' && principal) {
    return getHomeFeed(env, principal, limit, cursor, requestId);
  }

  const profileFeedMatch = path.match(/^\/v1\/space\/feed\/profile\/([^/]+)$/);
  if (profileFeedMatch && request.method === 'GET') {
    return getProfileFeed(env, decodeURIComponent(profileFeedMatch[1]), principal, limit, cursor, requestId);
  }

  const groupFeedMatch = path.match(/^\/v1\/space\/feed\/group\/([^/]+)$/);
  if (groupFeedMatch && request.method === 'GET') {
    return getGroupFeed(env, decodeURIComponent(groupFeedMatch[1]), principal, limit, cursor, requestId);
  }

  if (path === '/v1/space/feed/activity' && request.method === 'GET' && principal) {
    return getActivityFeed(env, principal, limit, cursor, requestId);
  }

  return null;
}
