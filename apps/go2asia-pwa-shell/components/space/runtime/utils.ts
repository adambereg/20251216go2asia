import { clerk, generated, getBaseUrl } from '@go2asia/sdk';

export const DEFAULT_FEED_LIMIT = 20;
export const HOME_FEED_URL = `/v1/space/feed/home?limit=${DEFAULT_FEED_LIMIT}`;
export const PUBLIC_PROFILE_ID = (process.env.NEXT_PUBLIC_SPACE_PHASE1_PROFILE_ID ?? '').trim();

export function getErrorStatus(error: unknown): number | null {
  if (!error || typeof error !== 'object') return null;
  const status = (error as { status?: unknown }).status;
  return typeof status === 'number' ? status : null;
}

export function formatDate(value: string): string {
  try {
    return new Date(value).toLocaleString('ru-RU');
  } catch {
    return value;
  }
}

export function getProfileHref(userId: string): string {
  return `/space/profiles/${encodeURIComponent(userId)}`;
}

export function getGroupHref(groupId: string): string {
  return `/space/community/groups/${encodeURIComponent(groupId)}`;
}

export function getProfileFeedUrl(userId: string, limit = DEFAULT_FEED_LIMIT): string {
  return `/v1/space/feed/profile/${encodeURIComponent(userId)}?limit=${limit}`;
}

export function getGroupFeedUrl(groupId: string, limit = DEFAULT_FEED_LIMIT): string {
  return `/v1/space/feed/group/${encodeURIComponent(groupId)}?limit=${limit}`;
}

export function formatFeedReason(reason: generated.SpaceFeedReason): string {
  switch (reason) {
    case 'group_post':
      return 'Пост из группы';
    case 'author_post':
      return 'Авторский пост';
    case 'repost':
      return 'Репост';
    case 'system':
      return 'Системный сигнал';
    default:
      return reason;
  }
}

export function resolveReferenceHref(
  targetType: generated.SpaceRepostTargetType,
  targetId: string
): { href: string | null; isDeferred: boolean } {
  switch (targetType) {
    case 'event':
      return { href: `/pulse/${encodeURIComponent(targetId)}`, isDeferred: false };
    case 'place':
      return { href: `/atlas/places/${encodeURIComponent(targetId)}`, isDeferred: false };
    case 'listing':
      return { href: `/rielt/listings/${encodeURIComponent(targetId)}`, isDeferred: false };
    default:
      return { href: null, isDeferred: true };
  }
}

export async function spaceNoContentRequest(
  url: string,
  method: 'POST' | 'DELETE' = 'POST'
): Promise<void> {
  const token = await clerk.getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Request-Id': `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${getBaseUrl()}${url}`, {
    method,
    headers,
  });

  if (response.ok) return;

  let errorData: unknown = null;
  try {
    errorData = await response.json();
  } catch {
    errorData = {
      error: {
        code: 'UNKNOWN_ERROR',
        message: response.statusText,
      },
    };
  }

  throw {
    ...(typeof errorData === 'object' && errorData ? errorData : {}),
    status: response.status,
    message:
      (errorData as { error?: { message?: string }; message?: string } | null)?.error?.message ??
      (errorData as { message?: string } | null)?.message ??
      response.statusText,
  };
}
