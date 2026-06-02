import { type GatewayPrincipal } from '../middleware/auth';
import { errorResponse, parsePositiveInt } from '../middleware/http';
import {
  getActivityFeed,
  getGroupFeed,
  getHomeFeed,
  getProfileFeed,
  getPublicationsFeed,
} from '../services/spaceService';

const ACTIVITY_FILTERS = new Set(['all', 'incoming', 'my_actions']);

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

  const publicationsFeedMatch = path.match(/^\/v1\/space\/feed\/publications\/([^/]+)$/);
  if (publicationsFeedMatch && request.method === 'GET') {
    return getPublicationsFeed(
      env,
      decodeURIComponent(publicationsFeedMatch[1]),
      principal,
      limit,
      cursor,
      requestId
    );
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
    const filter = url.searchParams.get('filter') ?? 'all';
    if (!ACTIVITY_FILTERS.has(filter)) {
      return errorResponse(
        'VALIDATION_ERROR',
        'filter must be one of: all, incoming, my_actions',
        requestId,
        400
      );
    }
    return getActivityFeed(env, principal, filter as 'all' | 'incoming' | 'my_actions', limit, cursor, requestId);
  }

  return null;
}
