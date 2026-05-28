'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { customInstance, generated } from '@go2asia/sdk';
import { SpaceLayout } from '@/components/space/Shared';
import {
  formatRepostTargetLabel,
  getGroupHref,
  getProfileHref,
  resolveReferenceHref,
} from '@/components/space/runtime/utils';
import {
  getRepostCtaLabel,
  hydratePilotRepostPreview,
  isPilotRepostTargetType,
} from '@/components/space/runtime/repostPreview';

const ACTIVITY_FILTERS = [
  {
    value: 'all',
    label: 'Все',
    hint: 'Входящие события и ваши недавние действия.',
  },
  {
    value: 'incoming',
    label: 'Входящие',
    hint: 'Только реакции и репосты вокруг ваших публикаций.',
  },
  {
    value: 'my_actions',
    label: 'Мои действия',
    hint: 'Только ваши публикации, репосты и вступления в группы.',
  },
] as const;

type ActivityFilter = (typeof ACTIVITY_FILTERS)[number]['value'];
type ActivityTypeFilter = 'all' | 'reposts' | 'likes' | 'posts' | 'groups';

const ACTIVITY_TYPE_FILTERS: Array<{ value: ActivityTypeFilter; label: string }> = [
  { value: 'all', label: 'Все типы' },
  { value: 'reposts', label: 'Репосты' },
  { value: 'likes', label: 'Реакции' },
  { value: 'posts', label: 'Публикации' },
  { value: 'groups', label: 'Группы' },
];

function normalizeActivityFilter(value: string | null | undefined): ActivityFilter {
  return value === 'incoming' || value === 'my_actions' ? value : 'all';
}

function buildActivityPath(filter: ActivityFilter): string {
  return `/v1/space/feed/activity?limit=20&filter=${filter}`;
}

function getErrorStatus(error: unknown): number | null {
  if (!error || typeof error !== 'object') return null;
  const status = (error as { status?: unknown }).status;
  return typeof status === 'number' ? status : null;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
  }
  return (parts[0] ?? 'SA').slice(0, 2).toUpperCase();
}

function formatActivityTime(value: string): { relative: string; exact: string } {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { relative: value, exact: value };

  const diffMs = Date.now() - date.getTime();
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return { relative: 'только что', exact: date.toLocaleString('ru-RU') };
  if (diffMs < hour) return { relative: `${Math.max(1, Math.floor(diffMs / minute))} мин назад`, exact: date.toLocaleString('ru-RU') };
  if (diffMs < day) return { relative: `${Math.max(1, Math.floor(diffMs / hour))} ч назад`, exact: date.toLocaleString('ru-RU') };
  if (diffMs < 2 * day) return { relative: 'вчера', exact: date.toLocaleString('ru-RU') };

  return {
    relative: date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
    exact: date.toLocaleString('ru-RU'),
  };
}

function isTechnicalText(value: string | null | undefined): boolean {
  if (!value) return false;
  return /(post_created|repost_created|group_joined|baseline|contract|runtime|Entity|feed-post-|\/v1\/space\/feed\/activity|^You joined\b)/i.test(
    value
  );
}

function formatEntityChip(value: string | null | undefined): string | null {
  if (!value) return null;

  switch (value) {
    case 'space_post':
      return 'Публикация';
    case 'blog_post':
      return 'Статья';
    case 'event':
      return 'Событие';
    case 'place':
      return 'Место';
    case 'listing':
      return 'Объявление';
    case 'partner':
      return 'Партнёр';
    case 'quest':
      return 'Квест';
    case 'space_group':
      return 'Группа';
    default:
      return null;
  }
}

function toActivityTypeFilter(item: generated.SpaceActivityFeedItem): ActivityTypeFilter {
  if (item.type === 'repost_created' || item.type === 'post_reposted_by_other') return 'reposts';
  if (item.type === 'post_liked_by_other') return 'likes';
  if (item.type === 'post_created') return 'posts';
  if (item.type === 'group_joined') return 'groups';
  return 'all';
}

function matchesTypeFilter(item: generated.SpaceActivityFeedItem, filter: ActivityTypeFilter): boolean {
  if (filter === 'all') return true;
  return toActivityTypeFilter(item) === filter;
}

function getDirectionChip(direction: generated.SpaceActivityFeedItemDirection): string {
  return direction === 'incoming' ? 'Входящее' : 'Моё действие';
}

function getActivityTitle(item: generated.SpaceActivityFeedItem, actorName: string, isSelfAction: boolean): string {
  switch (item.type) {
    case 'post_created':
      return 'Вы опубликовали запись';
    case 'repost_created':
      return 'Вы сделали репост';
    case 'group_joined':
      return isSelfAction ? 'Вы вступили в группу' : `${actorName} вступил(а) в группу`;
    case 'post_liked_by_other':
      return `${actorName} лайкнул(а) вашу публикацию`;
    case 'post_reposted_by_other':
      return `${actorName} сделал(а) репост вашей публикации`;
    default:
      if (item.title && !isTechnicalText(item.title)) return item.title;
      return 'Новое действие в Space Asia';
  }
}

function getActivityDescription(item: generated.SpaceActivityFeedItem): string | null {
  if (item.description && !isTechnicalText(item.description)) {
    return item.description;
  }

  return null;
}

function getActivityMeta(item: generated.SpaceActivityFeedItem): string[] {
  const parts: string[] = [];

  if (item.type === 'post_created') {
    parts.push('Запись');
  } else if (item.type === 'repost_created') {
    parts.push('Репост');
  } else if (item.type === 'group_joined') {
    parts.push('Группа');
  } else if (item.type === 'post_liked_by_other') {
    parts.push('Реакция');
  } else if (item.type === 'post_reposted_by_other') {
    parts.push('Репост');
  }

  const entityChip = formatEntityChip(item.relatedEntityType);
  if (entityChip && !(item.type === 'group_joined' && entityChip === 'Группа')) {
    parts.push(entityChip);
  }

  return parts;
}

function getActivityHref(item: generated.SpaceActivityFeedItem): string | null {
  if (item.relatedEntityType === 'space_group' && item.relatedEntityId) {
    return getGroupHref(item.relatedEntityId);
  }
  if (item.relatedEntityType === 'space_post') {
    const postId = item.relatedPostId ?? item.relatedEntityId;
    return postId ? `/space/feed?highlight=${encodeURIComponent(postId)}` : '/space/feed';
  }
  if (item.relatedEntityType && item.relatedEntityId) {
    const resolved = resolveReferenceHref(item.relatedEntityType as generated.SpaceRepostTargetType, item.relatedEntityId);
    if (resolved.href) return resolved.href;
  }
  if (item.type === 'group_joined') return '/space/community';
  return item.relatedPostId ? `/space/feed?highlight=${encodeURIComponent(item.relatedPostId)}` : '/space/feed';
}

function getActivityCtaLabel(item: generated.SpaceActivityFeedItem): string {
  if (item.relatedEntityType === 'space_group') return 'Открыть группу';
  if (item.relatedEntityType === 'space_post') return 'Открыть пост';
  if (item.type === 'post_liked_by_other') return 'Открыть публикацию';
  if (item.type === 'post_reposted_by_other') return 'Открыть репост';
  if (item.type === 'repost_created' && item.relatedEntityType) {
    return getRepostCtaLabel(item.relatedEntityType as generated.SpaceRepostTargetType);
  }
  if (item.relatedEntityType) {
    return getRepostCtaLabel(item.relatedEntityType as generated.SpaceRepostTargetType);
  }
  return 'Открыть раздел';
}

type ActivityCardProps = {
  item: generated.SpaceActivityFeedItem;
  viewerUserId: string | null;
};

function ActivityCard({ item, viewerUserId }: ActivityCardProps) {
  const actorName = item.actor.displayName?.trim() || item.actor.userId;
  const isSelfAction = Boolean(viewerUserId && item.actor.userId === viewerUserId);
  const meta = getActivityMeta(item);
  const entityChip = formatEntityChip(item.relatedEntityType);
  const activityTime = formatActivityTime(item.createdAt);
  const description = getActivityDescription(item);
  const href = getActivityHref(item);
  const ctaLabel = getActivityCtaLabel(item);
  const [preview, setPreview] = useState<generated.SpaceResolvedRepostPreview | null>(null);

  useEffect(() => {
    let cancelled = false;
    setPreview(null);

    if (
      item.type !== 'repost_created' ||
      !item.relatedEntityType ||
      !item.relatedEntityId ||
      !isPilotRepostTargetType(item.relatedEntityType as generated.SpaceRepostTargetType)
    ) {
      return () => {
        cancelled = true;
      };
    }

    const repostRef: generated.SpacePostRepostRef = {
      targetType: item.relatedEntityType as generated.SpaceRepostTargetType,
      targetId: item.relatedEntityId,
    };
    void hydratePilotRepostPreview(repostRef).then((result) => {
      if (!cancelled && result?.title) {
        setPreview(result);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [item.relatedEntityId, item.relatedEntityType, item.type]);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start gap-3">
        {item.actor.avatarUrl ? (
          <img
            src={item.actor.avatarUrl}
            alt={actorName}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-800">
            {getInitials(actorName)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            {isSelfAction ? (
              <span className="font-medium text-slate-700">Вы</span>
            ) : (
              <Link href={getProfileHref(item.actor.userId)} className="font-medium text-slate-700 hover:text-sky-700">
                {actorName}
              </Link>
            )}
            {item.actor.roleLabel ? (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600">
                {item.actor.roleLabel}
              </span>
            ) : null}
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600">
              {getDirectionChip(item.direction)}
            </span>
            <span title={activityTime.exact}>{activityTime.relative}</span>
          </div>
          <h2 className="mt-2 text-base font-semibold text-slate-900">{getActivityTitle(item, actorName, isSelfAction)}</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {meta.map((value) => (
              <span
                key={`${item.id}-${value}`}
                className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600"
              >
                {value}
              </span>
            ))}
            {entityChip ? (
              <span className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs text-sky-800">
                {entityChip}
              </span>
            ) : null}
          </div>
          {description ? <p className="mt-2 text-sm text-slate-700">{description}</p> : null}

          {preview?.title ? (
            <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3">
              <div className="flex gap-3">
                {preview.imageUrl ? (
                  <div
                    className="h-14 w-20 flex-shrink-0 rounded-md bg-cover bg-center"
                    style={{ backgroundImage: `url(${preview.imageUrl})` }}
                    aria-label={preview.title}
                  />
                ) : null}
                <div className="min-w-0">
                  <div className="line-clamp-2 text-sm font-medium text-slate-800">{preview.title}</div>
                  {preview.subtitle ? (
                    <div className="mt-1 line-clamp-2 text-xs text-slate-600">{preview.subtitle}</div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}

          {href ? (
            <Link
              href={preview?.href ?? href}
              className="mt-3 inline-flex rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              {ctaLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function getEmptyStateMessage(filter: ActivityFilter): string {
  if (filter === 'incoming') {
    return 'Пока здесь нет входящих событий. Когда кто-то отреагирует на вашу публикацию или сделает репост, это появится здесь.';
  }

  if (filter === 'my_actions') {
    return 'Здесь появляются ваши собственные действия в Space Asia. Как только вы опубликуете запись, сделаете репост или вступите в группу, они отобразятся тут.';
  }

  return 'Пока здесь нет новых действий. Когда в Space Asia появится активность, она отобразится в этом разделе.';
}

interface ActivityPageClientProps {
  initialFilter?: ActivityFilter;
}

export function ActivityPageClient({ initialFilter = 'all' }: ActivityPageClientProps) {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [feed, setFeed] = useState<generated.SpaceActivityFeedResponse | null>(null);
  const [typeFilter, setTypeFilter] = useState<ActivityTypeFilter>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const rawFilter = searchParams.get('filter');
  const activeFilter = normalizeActivityFilter(rawFilter ?? initialFilter);
  const visibleItems = useMemo(
    () => (feed?.items ?? []).filter((item) => matchesTypeFilter(item, typeFilter)),
    [feed?.items, typeFilter]
  );

  useEffect(() => {
    if (rawFilter === null || rawFilter === activeFilter) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('filter', activeFilter);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [activeFilter, pathname, rawFilter, router, searchParams]);

  useEffect(() => {
    let cancelled = false;

    async function loadActivity() {
      if (!isLoaded) {
        setIsLoading(true);
        setError(null);
        return;
      }

      if (!isSignedIn) {
        setFeed(null);
        setIsLoading(false);
        setError('Войдите в аккаунт, чтобы увидеть свою недавнюю активность.');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await customInstance<generated.SpaceActivityFeedResponse>(
          { method: 'GET' },
          buildActivityPath(activeFilter)
        );
        if (cancelled) return;
        setFeed(response);
      } catch (loadError) {
        if (cancelled) return;
        setFeed(null);
        const status = getErrorStatus(loadError);
        if (status === 401 || status === 403) {
          setError('Войдите в аккаунт, чтобы увидеть свою недавнюю активность.');
        } else {
          setError('Не удалось загрузить активность. Обновите страницу и попробуйте ещё раз.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadActivity();
    return () => {
      cancelled = true;
    };
  }, [activeFilter, isLoaded, isSignedIn]);

  function handleFilterChange(nextFilter: ActivityFilter) {
    if (nextFilter === activeFilter) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('filter', nextFilter);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <SpaceLayout>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Активность</h1>
          <p className="mt-2 text-sm text-slate-600">
            Здесь собраны недавние действия, которые уже появились в Space Asia.
          </p>
          <div className="mt-4 inline-flex flex-wrap items-center rounded-xl border border-slate-200 bg-white p-1">
            {ACTIVITY_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => handleFilterChange(filter.value)}
                className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs transition ${
                  activeFilter === filter.value ? 'bg-slate-900 font-medium text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            {ACTIVITY_FILTERS.find((filter) => filter.value === activeFilter)?.hint}
          </p>
          <div className="mt-3 inline-flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-white p-1">
            {ACTIVITY_TYPE_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setTypeFilter(filter.value)}
                className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs transition ${
                  typeFilter === filter.value ? 'bg-slate-900 font-medium text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </header>

        {isLoading && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Загружаем недавнюю активность...
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <Link href="/sign-in?redirect_url=%2Fspace%2Factivity" className="font-medium text-rose-800 underline underline-offset-2">
                Войти
              </Link>
              <Link href="/space" className="font-medium text-rose-800 underline underline-offset-2">
                В Space
              </Link>
            </div>
          </div>
        )}

        {!isLoading && !error && feed && visibleItems.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            {typeFilter === 'all'
              ? getEmptyStateMessage(activeFilter)
              : `По фильтру «${ACTIVITY_TYPE_FILTERS.find((item) => item.value === typeFilter)?.label}» пока нет событий.`}
          </div>
        )}

        {!isLoading && feed && visibleItems.length > 0 && (
          <div className="space-y-4">
            {visibleItems.map((item) => (
              <ActivityCard key={item.id} item={item} viewerUserId={user?.id ?? null} />
            ))}
          </div>
        )}

        <footer className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h2 className="text-sm font-semibold text-amber-900">Что здесь показывается</h2>
          <p className="mt-1 text-xs text-amber-800">
            Здесь показывается только часть недавних действий. Раздел не заменяет уведомления и не дублирует
            ленту.
          </p>
        </footer>
      </section>
    </SpaceLayout>
  );
}
