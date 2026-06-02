'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { SpaceLayout } from '@/components/space/Shared';
import { SpaceFeedCard } from '@/components/space/runtime/SpaceFeedCard';
import { useSpaceHomeFeed } from '@/components/space/runtime/useSpaceHomeFeed';
import { useSpaceSavedReactions } from '@/components/space/runtime/useSpaceSavedReactions';
import { isPrivateRepostIntentPost } from '@/modules/space/retentionIntent';
import { WS2_COPY } from '@/modules/space/ws2Copy';

type FeedFilter = 'all' | 'groups' | 'reposts' | 'my';

type FilterOption = {
  key: FeedFilter;
  label: string;
  isDisabled?: boolean;
};

type EmptyState = {
  title: string;
  description?: string;
  actionLabel?: string;
};

function getFilterEmptyState(filter: FeedFilter, hasAnyItems: boolean): EmptyState {
  switch (filter) {
    case 'groups':
      return hasAnyItems
        ? {
            title: 'В этой подборке пока нет публикаций из групп.',
            description: 'Попробуйте вернуться ко всей ленте или заглянуть в сообщества.',
            actionLabel: 'Показать всё',
          }
        : {
            title: 'Пока нет публикаций из групп.',
            description: 'Когда они появятся, этот раздел наполнится сам.',
            actionLabel: 'Открыть сообщества',
          };
    case 'reposts':
      return hasAnyItems
        ? {
            title: WS2_COPY.legacy.filterEmptyTitle,
            description: 'Откройте весь поток, чтобы посмотреть остальные публикации.',
            actionLabel: 'Показать всё',
          }
        : {
            title: WS2_COPY.legacy.filterEmptyAll,
            description: WS2_COPY.legacy.filterEmptyHint,
            actionLabel: 'Показать всё',
          };
    case 'my':
      return {
        title: 'Пока здесь нет ваших публикаций и исторических записей.',
        description: 'Когда вы будете заметнее в потоке, этот раздел соберёт ваши публикации в одном месте.',
        actionLabel: 'Показать всё',
      };
    case 'all':
    default:
      return {
        title: 'Пока в ленте тихо.',
        description: WS2_COPY.surfaces.homeFeedAllEmpty,
        actionLabel: 'Открыть сообщества',
      };
  }
}

export function SpaceFeedSurface() {
  const { user, isSignedIn } = useUser();
  const { mode, feed, isLoading, error } = useSpaceHomeFeed();
  const saved = useSpaceSavedReactions(true);
  const [activeFilter, setActiveFilter] = useState<FeedFilter>('all');

  const currentUserId = isSignedIn && user?.id ? user.id : null;
  const items = feed?.items ?? [];
  const hasAnyItems = items.length > 0;

  const filterOptions = useMemo<FilterOption[]>(
    () => [
      { key: 'all', label: 'Все' },
      { key: 'groups', label: 'Группы' },
      { key: 'reposts', label: WS2_COPY.legacy.filterTab },
      {
        key: 'my',
        label: 'Моё',
        isDisabled: !currentUserId,
      },
    ],
    [currentUserId]
  );

  const counts = useMemo(() => {
    const groups = items.filter((item) => item.post.groupId !== null).length;
    const reposts = items.filter(
      (item) => !isPrivateRepostIntentPost(item.post) && (item.post.postType === 'repost' || item.post.repost !== null)
    ).length;
    const mine = currentUserId ? items.filter((item) => item.post.author.userId === currentUserId).length : 0;

    return {
      all: items.length,
      groups,
      reposts,
      my: mine,
    };
  }, [currentUserId, items]);

  const visibleItems = useMemo(() => {
    switch (activeFilter) {
      case 'groups':
        return items.filter((item) => item.post.groupId !== null);
      case 'reposts':
        return items.filter(
          (item) => !isPrivateRepostIntentPost(item.post) && (item.post.postType === 'repost' || item.post.repost !== null)
        );
      case 'my':
        return currentUserId ? items.filter((item) => item.post.author.userId === currentUserId) : [];
      case 'all':
      default:
        return items;
    }
  }, [activeFilter, currentUserId, items]);

  const emptyState = useMemo(
    () => getFilterEmptyState(activeFilter, hasAnyItems),
    [activeFilter, hasAnyItems]
  );

  const summaryParts = useMemo(() => {
    const parts: string[] = [];

    if (counts.all > 0) {
      parts.push(`${counts.all} в ленте`);
    }
    if (counts.groups > 0) {
      parts.push(`${counts.groups} из групп`);
    }
    if (counts.reposts > 0) {
      parts.push(`${counts.reposts} ${WS2_COPY.legacy.countLabel}`);
    }
    if (currentUserId && counts.my > 0) {
      parts.push(`${counts.my} ваших`);
    }

    return parts;
  }, [counts, currentUserId]);

  return (
    <SpaceLayout>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Лента</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            {WS2_COPY.surfaces.homeFeedIntro}
          </p>

          {mode === 'public-profile' && (
            <p className="mt-3 text-xs text-slate-500">Сейчас показан открытый обзор публикаций.</p>
          )}
        </header>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => {
              const isActive = option.key === activeFilter;
              const count = counts[option.key];
              return (
                <button
                  key={option.key}
                  type="button"
                  disabled={option.isDisabled}
                  onClick={() => setActiveFilter(option.key)}
                  title={option.isDisabled ? 'Войдите, чтобы открыть этот раздел.' : undefined}
                  className={[
                    'inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                    isActive
                      ? 'border-sky-200 bg-sky-50 text-sky-800'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100',
                    option.isDisabled ? 'cursor-not-allowed opacity-60 hover:bg-white' : '',
                  ].join(' ')}
                >
                  <span>{option.label}</span>
                  {!option.isDisabled && count > 0 && (
                    <span className="rounded-full bg-white/80 px-1.5 py-0.5 text-[11px] text-slate-500">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {summaryParts.length > 0 && (
            <p className="mt-3 text-xs text-slate-500">Сейчас в подборке: {summaryParts.join(' · ')}.</p>
          )}
        </div>

        {isLoading && (
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
            <div className="h-16 animate-pulse rounded-lg bg-white" />
            <div className="h-16 animate-pulse rounded-lg bg-white" />
            <div className="text-sm text-slate-600">Собираем ленту...</div>
          </div>
        )}

        {!isLoading && error && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {!isLoading && !error && feed && visibleItems.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-sm font-semibold text-slate-900">{emptyState.title}</h2>
            {emptyState.description && (
              <p className="mt-2 text-sm text-slate-600">{emptyState.description}</p>
            )}
            <div className="mt-4">
              {activeFilter === 'all' || (!hasAnyItems && activeFilter === 'groups') ? (
                <Link
                  href="/space/community"
                  className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                  {emptyState.actionLabel ?? 'Открыть сообщества'}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveFilter('all')}
                  className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                  {emptyState.actionLabel ?? 'Показать всё'}
                </button>
              )}
            </div>
          </div>
        )}

        {!isLoading && visibleItems.length > 0 && (
          <div className="space-y-4">
            {visibleItems.map((item) => (
              <div key={item.id} className="space-y-2">
                <SpaceFeedCard item={item} showReason showGroupSignal currentUserId={currentUserId} />
                {saved.state === 'ready' && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => void saved.toggleSaved(item.post.id)}
                      disabled={saved.isPending(item.post.id)}
                      className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saved.isPending(item.post.id)
                        ? 'Обновляем...'
                        : saved.isSaved(item.post.id)
                          ? 'Убрать из сохранённых'
                          : 'Сохранить пост'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!isLoading && saved.state === 'auth-required' && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Войдите в аккаунт, чтобы сохранять публикации.
          </div>
        )}

        {!isLoading && saved.state === 'unavailable' && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Сохранённые временно недоступны, но сама лента продолжает работать.
          </div>
        )}

        {!isLoading && saved.state === 'error' && saved.error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {saved.error}
          </div>
        )}
      </section>
    </SpaceLayout>
  );
}
