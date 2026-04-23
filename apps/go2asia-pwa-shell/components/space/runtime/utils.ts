import { generated } from '@go2asia/sdk';

export function getErrorStatus(error: unknown): number | null {
  if (!error || typeof error !== 'object') return null;
  const status = (error as { status?: unknown }).status;
  return typeof status === 'number' ? status : null;
}

export function isServiceUnavailableStatus(status: number | null): boolean {
  return status === 500 || status === 501 || status === 502 || status === 503;
}

export function getProfileHref(userId: string): string {
  return `/space/profiles/${encodeURIComponent(userId)}`;
}

export function getGroupHref(groupId: string): string {
  return `/space/community/groups/${encodeURIComponent(groupId)}`;
}

export function getProfileFeedUrl(userId: string, limit = 20): string {
  return `/v1/space/feed/profile/${encodeURIComponent(userId)}?limit=${limit}`;
}

export function formatVisibilityLabel(visibility: generated.SpaceVisibility): string {
  switch (visibility) {
    case 'public':
      return 'Публично';
    case 'followers':
      return 'Подписчики';
    case 'group':
      return 'Только группа';
    case 'private':
      return 'Личное';
    default:
      return visibility;
  }
}

export function formatRepostTargetLabel(targetType: generated.SpaceRepostTargetType): string {
  switch (targetType) {
    case 'space_post':
      return 'пост Space';
    case 'blog_post':
      return 'публикация блога';
    case 'place':
      return 'место';
    case 'event':
      return 'событие';
    case 'partner':
      return 'партнёрский объект';
    case 'listing':
      return 'объявление';
    case 'quest':
      return 'квест';
    default:
      return targetType;
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
