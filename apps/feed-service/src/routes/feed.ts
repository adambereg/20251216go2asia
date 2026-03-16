import type { GatewayPrincipal } from '../middleware/auth';
import { parsePositiveInt } from '../middleware/http';
import { getActivityFeed, getGroupFeed, getHomeFeed, getProfileFeed } from '../services/feedService';

type Env = {
  SPACE_SERVICE_URL?: string;
  REACTIONS_SERVICE_URL?: string;
  FEED_CACHE_TTL_SECONDS?: string;
};

type FeedPrincipal = GatewayPrincipal & { gatewayToken: string };

export async function handleFeedRoute(
  request: Request,
  env: Env,
  requestId: string,
  principal: FeedPrincipal | null
): Promise<Response | null> {
  const url = new URL(request.url);
  const path = url.pathname;
  const limit = parsePositiveInt(url.searchParams.get('limit'), 20, 100);
  const cursor = url.searchParams.get('cursor');

  if (!principal) return null;

  if (path === '/v1/feed/home' && request.method === 'GET') {
    return getHomeFeed(env, principal, limit, cursor, requestId);
  }

  const groupFeedMatch = path.match(/^\/v1\/feed\/group\/([^/]+)$/);
  if (groupFeedMatch && request.method === 'GET') {
    return getGroupFeed(env, decodeURIComponent(groupFeedMatch[1]), principal, limit, cursor, requestId);
  }

  const profileFeedMatch = path.match(/^\/v1\/feed\/profile\/([^/]+)$/);
  if (profileFeedMatch && request.method === 'GET') {
    return getProfileFeed(env, decodeURIComponent(profileFeedMatch[1]), principal, limit, cursor, requestId);
  }

  if (path === '/v1/feed/activity' && request.method === 'GET') {
    return getActivityFeed(env, principal, limit, cursor, requestId);
  }

  return null;
}
