import { getCached, setCached } from '../cache/responseCache';
import { fetchReactionBatchSummary } from '../clients/reactionsClient';
import { fetchActivityFeed, fetchGroupFeed, fetchHomeFeed, fetchProfileFeed } from '../clients/spaceClient';
import { errorResponse, json } from '../middleware/http';

type FeedEnv = {
  SPACE_SERVICE_URL?: string;
  REACTIONS_SERVICE_URL?: string;
  FEED_CACHE_TTL_SECONDS?: string;
};

type FeedPageResponse = {
  items?: Array<Record<string, unknown>>;
  nextCursor?: string | null;
};

type NormalizedFeedPage = {
  items: Array<Record<string, unknown>>;
  nextCursor: string | null;
};

function parseCacheTtlSeconds(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? '', 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return 15;
  return Math.min(parsed, 120);
}

function buildCacheKey(input: {
  surface: 'home' | 'group' | 'profile' | 'activity';
  viewerUserId: string;
  groupId?: string;
  profileUserId?: string;
  limit: number;
  cursor: string | null;
}): string {
  return [
    'feed',
    input.surface,
    input.viewerUserId,
    input.groupId ?? '',
    input.profileUserId ?? '',
    String(input.limit),
    input.cursor ?? '',
  ].join(':');
}

function extractSpacePostIds(items: Array<Record<string, unknown>>): string[] {
  const postIds = new Set<string>();
  for (const item of items) {
    const post = item.post;
    if (!post || typeof post !== 'object' || Array.isArray(post)) continue;
    const postRecord = post as Record<string, unknown>;
    if (typeof postRecord.id === 'string' && postRecord.id.trim().length > 0) {
      postIds.add(postRecord.id);
    }
  }
  return [...postIds];
}

function toEpochMillis(value: unknown): number | null {
  if (typeof value !== 'string' || value.trim().length === 0) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeAndSortItems(items: unknown): Array<Record<string, unknown>> | null {
  if (!Array.isArray(items)) return null;
  const normalized: Array<{ item: Record<string, unknown>; index: number; id: string; createdAtMs: number | null }> = [];
  for (let index = 0; index < items.length; index++) {
    const raw = items[index];
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
    const item = raw as Record<string, unknown>;
    if (typeof item.id !== 'string' || item.id.trim().length === 0) return null;
    normalized.push({
      item,
      index,
      id: item.id,
      createdAtMs: toEpochMillis(item.createdAt),
    });
  }

  normalized.sort((a, b) => {
    if (a.createdAtMs !== null && b.createdAtMs !== null) {
      if (a.createdAtMs !== b.createdAtMs) return b.createdAtMs - a.createdAtMs;
      return a.id.localeCompare(b.id);
    }
    if (a.createdAtMs !== null) return -1;
    if (b.createdAtMs !== null) return 1;
    return a.index - b.index;
  });

  return normalized.map((entry) => entry.item);
}

function normalizeFeedPageResponse(upstream: FeedPageResponse): NormalizedFeedPage | null {
  const items = normalizeAndSortItems(upstream.items);
  if (!items) return null;
  if (
    upstream.nextCursor !== null &&
    upstream.nextCursor !== undefined &&
    typeof upstream.nextCursor !== 'string'
  ) {
    return null;
  }
  return {
    items,
    nextCursor: upstream.nextCursor ?? null,
  };
}

function applyReactionSummaryToItems(
  items: Array<Record<string, unknown>>,
  summaries: Array<{ targetType: string; targetId: string; counts: { like: number }; viewer: { liked: boolean } }>
): Array<Record<string, unknown>> {
  const summaryMap = new Map<string, { counts: { like: number }; viewer: { liked: boolean } }>();
  for (const summary of summaries) {
    summaryMap.set(`${summary.targetType}:${summary.targetId}`, {
      counts: { like: summary.counts.like },
      viewer: { liked: summary.viewer.liked },
    });
  }

  return items.map((item) => {
    const post = item.post;
    if (!post || typeof post !== 'object' || Array.isArray(post)) {
      return item;
    }
    const postRecord = post as Record<string, unknown>;
    const postId = typeof postRecord.id === 'string' ? postRecord.id : null;
    if (!postId) return item;

    const summary = summaryMap.get(`space_post:${postId}`) ?? {
      counts: { like: 0 },
      viewer: { liked: false },
    };
    return {
      ...item,
      reactions: summary,
    };
  });
}

function withReactionDefaults(items: Array<Record<string, unknown>>): Array<Record<string, unknown>> {
  return items.map((item) => {
    const post = item.post;
    if (!post || typeof post !== 'object' || Array.isArray(post)) return item;
    const postRecord = post as Record<string, unknown>;
    if (typeof postRecord.id !== 'string' || postRecord.id.trim().length === 0) return item;
    return {
      ...item,
      reactions: {
        counts: { like: 0 },
        viewer: { liked: false },
      },
    };
  });
}

async function composeWithReactions(
  env: FeedEnv,
  principal: FeedPrincipal,
  requestId: string,
  upstream: NormalizedFeedPage
): Promise<Record<string, unknown>> {
  const items = upstream.items;
  const postIds = extractSpacePostIds(items);

  if (!env.REACTIONS_SERVICE_URL) {
    return {
      items: withReactionDefaults(items),
      nextCursor: upstream.nextCursor ?? null,
      degraded: { reactions: true },
    };
  }

  if (postIds.length === 0) {
    return {
      items,
      nextCursor: upstream.nextCursor ?? null,
    };
  }

  const reactions = await fetchReactionBatchSummary(
    {
      baseUrl: env.REACTIONS_SERVICE_URL,
      gatewayAuth: principal.gatewayToken,
      requestId,
    },
    postIds.map((postId) => ({
      targetType: 'space_post',
      targetId: postId,
    }))
  );

  if (!reactions.ok) {
    return {
      items: withReactionDefaults(items),
      nextCursor: upstream.nextCursor ?? null,
      degraded: { reactions: true },
    };
  }

  return {
    items: applyReactionSummaryToItems(items, reactions.data.items),
    nextCursor: upstream.nextCursor ?? null,
  };
}

type FeedPrincipal = {
  userId: string;
  roles: string[];
  gatewayToken: string;
};

async function fromCacheOrCompute(
  cacheKey: string,
  ttlSeconds: number,
  loader: () => Promise<Record<string, unknown>>
): Promise<Record<string, unknown>> {
  const cached = getCached<Record<string, unknown>>(cacheKey);
  if (cached) return cached;
  const fresh = await loader();
  setCached(cacheKey, fresh, ttlSeconds);
  return fresh;
}

export async function getHomeFeed(
  env: FeedEnv,
  principal: FeedPrincipal,
  limit: number,
  cursor: string | null,
  requestId: string
): Promise<Response> {
  if (!env.SPACE_SERVICE_URL) {
    return errorResponse('SERVICE_NOT_CONFIGURED', 'SPACE_SERVICE_URL is missing', requestId, 503);
  }

  const ttlSeconds = parseCacheTtlSeconds(env.FEED_CACHE_TTL_SECONDS);
  const cacheKey = buildCacheKey({
    surface: 'home',
    viewerUserId: principal.userId,
    limit,
    cursor,
  });

  const data = await fromCacheOrCompute(cacheKey, ttlSeconds, async () => {
    const space = await fetchHomeFeed<FeedPageResponse>(
      {
        baseUrl: env.SPACE_SERVICE_URL!,
        gatewayAuth: principal.gatewayToken,
        requestId,
      },
      limit,
      cursor
    );
    if (!space.ok) {
      throw {
        kind: 'space_error',
        status: space.status,
        body: space.body,
      };
    }
    const normalized = normalizeFeedPageResponse(space.data);
    if (!normalized) {
      throw {
        kind: 'space_invalid_response',
        status: 502,
        body: {
          error: {
            code: 'UPSTREAM_INVALID_RESPONSE',
            message: 'space-service returned invalid feed payload',
          },
          requestId,
        },
      };
    }
    return composeWithReactions(env, principal, requestId, normalized);
  }).catch((error: { kind?: string; status?: number; body?: Record<string, unknown> }) => {
    if (error?.kind === 'space_error' || error?.kind === 'space_invalid_response') {
      return {
        __error: true,
        status: error.status ?? 503,
        body: error.body,
      };
    }
    throw error;
  });

  if ((data as { __error?: boolean }).__error) {
    const status = (data as { status?: number }).status ?? 503;
    const body = (data as { body?: Record<string, unknown> }).body;
    if (body) return json(body, status);
    return errorResponse('UPSTREAM_UNAVAILABLE', 'space-service is unavailable', requestId, status);
  }

  return json(data, 200);
}

export async function getGroupFeed(
  env: FeedEnv,
  groupId: string,
  principal: FeedPrincipal,
  limit: number,
  cursor: string | null,
  requestId: string
): Promise<Response> {
  if (!env.SPACE_SERVICE_URL) {
    return errorResponse('SERVICE_NOT_CONFIGURED', 'SPACE_SERVICE_URL is missing', requestId, 503);
  }

  const ttlSeconds = parseCacheTtlSeconds(env.FEED_CACHE_TTL_SECONDS);
  const cacheKey = buildCacheKey({
    surface: 'group',
    viewerUserId: principal.userId,
    groupId,
    limit,
    cursor,
  });

  const data = await fromCacheOrCompute(cacheKey, ttlSeconds, async () => {
    const space = await fetchGroupFeed<FeedPageResponse>(
      {
        baseUrl: env.SPACE_SERVICE_URL!,
        gatewayAuth: principal.gatewayToken,
        requestId,
      },
      groupId,
      limit,
      cursor
    );
    if (!space.ok) {
      throw {
        kind: 'space_error',
        status: space.status,
        body: space.body,
      };
    }
    const normalized = normalizeFeedPageResponse(space.data);
    if (!normalized) {
      throw {
        kind: 'space_invalid_response',
        status: 502,
        body: {
          error: {
            code: 'UPSTREAM_INVALID_RESPONSE',
            message: 'space-service returned invalid feed payload',
          },
          requestId,
        },
      };
    }
    return composeWithReactions(env, principal, requestId, normalized);
  }).catch((error: { kind?: string; status?: number; body?: Record<string, unknown> }) => {
    if (error?.kind === 'space_error' || error?.kind === 'space_invalid_response') {
      return {
        __error: true,
        status: error.status ?? 503,
        body: error.body,
      };
    }
    throw error;
  });

  if ((data as { __error?: boolean }).__error) {
    const status = (data as { status?: number }).status ?? 503;
    const body = (data as { body?: Record<string, unknown> }).body;
    if (body) return json(body, status);
    return errorResponse('UPSTREAM_UNAVAILABLE', 'space-service is unavailable', requestId, status);
  }

  return json(data, 200);
}

export async function getProfileFeed(
  env: FeedEnv,
  userId: string,
  principal: FeedPrincipal,
  limit: number,
  cursor: string | null,
  requestId: string
): Promise<Response> {
  if (!env.SPACE_SERVICE_URL) {
    return errorResponse('SERVICE_NOT_CONFIGURED', 'SPACE_SERVICE_URL is missing', requestId, 503);
  }

  const ttlSeconds = parseCacheTtlSeconds(env.FEED_CACHE_TTL_SECONDS);
  const cacheKey = buildCacheKey({
    surface: 'profile',
    viewerUserId: principal.userId,
    profileUserId: userId,
    limit,
    cursor,
  });

  const data = await fromCacheOrCompute(cacheKey, ttlSeconds, async () => {
    const space = await fetchProfileFeed<FeedPageResponse>(
      {
        baseUrl: env.SPACE_SERVICE_URL!,
        gatewayAuth: principal.gatewayToken,
        requestId,
      },
      userId,
      limit,
      cursor
    );
    if (!space.ok) {
      throw {
        kind: 'space_error',
        status: space.status,
        body: space.body,
      };
    }
    const normalized = normalizeFeedPageResponse(space.data);
    if (!normalized) {
      throw {
        kind: 'space_invalid_response',
        status: 502,
        body: {
          error: {
            code: 'UPSTREAM_INVALID_RESPONSE',
            message: 'space-service returned invalid feed payload',
          },
          requestId,
        },
      };
    }
    return composeWithReactions(env, principal, requestId, normalized);
  }).catch((error: { kind?: string; status?: number; body?: Record<string, unknown> }) => {
    if (error?.kind === 'space_error' || error?.kind === 'space_invalid_response') {
      return {
        __error: true,
        status: error.status ?? 503,
        body: error.body,
      };
    }
    throw error;
  });

  if ((data as { __error?: boolean }).__error) {
    const status = (data as { status?: number }).status ?? 503;
    const body = (data as { body?: Record<string, unknown> }).body;
    if (body) return json(body, status);
    return errorResponse('UPSTREAM_UNAVAILABLE', 'space-service is unavailable', requestId, status);
  }

  return json(data, 200);
}

export async function getActivityFeed(
  env: FeedEnv,
  principal: FeedPrincipal,
  limit: number,
  cursor: string | null,
  requestId: string
): Promise<Response> {
  if (!env.SPACE_SERVICE_URL) {
    return errorResponse('SERVICE_NOT_CONFIGURED', 'SPACE_SERVICE_URL is missing', requestId, 503);
  }

  const ttlSeconds = parseCacheTtlSeconds(env.FEED_CACHE_TTL_SECONDS);
  const cacheKey = buildCacheKey({
    surface: 'activity',
    viewerUserId: principal.userId,
    limit,
    cursor,
  });

  const data = await fromCacheOrCompute(cacheKey, ttlSeconds, async () => {
    const space = await fetchActivityFeed<FeedPageResponse>(
      {
        baseUrl: env.SPACE_SERVICE_URL!,
        gatewayAuth: principal.gatewayToken,
        requestId,
      },
      limit,
      cursor
    );
    if (!space.ok) {
      throw {
        kind: 'space_error',
        status: space.status,
        body: space.body,
      };
    }
    const normalized = normalizeFeedPageResponse(space.data);
    if (!normalized) {
      throw {
        kind: 'space_invalid_response',
        status: 502,
        body: {
          error: {
            code: 'UPSTREAM_INVALID_RESPONSE',
            message: 'space-service returned invalid feed payload',
          },
          requestId,
        },
      };
    }
    return {
      items: normalized.items,
      nextCursor: normalized.nextCursor,
    };
  }).catch((error: { kind?: string; status?: number; body?: Record<string, unknown> }) => {
    if (error?.kind === 'space_error' || error?.kind === 'space_invalid_response') {
      return {
        __error: true,
        status: error.status ?? 503,
        body: error.body,
      };
    }
    throw error;
  });

  if ((data as { __error?: boolean }).__error) {
    const status = (data as { status?: number }).status ?? 503;
    const body = (data as { body?: Record<string, unknown> }).body;
    if (body) return json(body, status);
    return errorResponse('UPSTREAM_UNAVAILABLE', 'space-service is unavailable', requestId, status);
  }

  return json(data, 200);
}
