'use client';

import { useMemo, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { SpaceLayout } from '@/components/space/Shared';
import { SpaceFeedCard } from '@/components/space/runtime/SpaceFeedCard';
import { useSpaceHomeFeed } from '@/components/space/runtime/useSpaceHomeFeed';
import { useSpaceSavedReactions } from '@/components/space/runtime/useSpaceSavedReactions';

type FeedFilter = 'all' | 'groups' | 'reposts' | 'my';

type FilterOption = {
  key: FeedFilter;
  label: string;
  isDisabled?: boolean;
};

function getFilterEmptyState(filter: FeedFilter): string {
  switch (filter) {
    case 'groups':
      return 'Пока нет публикаций из групп.';
    case 'reposts':
      return 'Пока нет репостов.';
    case 'my':
      return 'Пока здесь нет ваших публикаций и репостов.';
    case 'all':
    default:
      return 'Пока в ленте тихо. Загляните чуть позже.';
  }
}

export function SpaceFeedSurface() {
  const { user, isSignedIn } = useUser();
  const { mode, feed, isLoading, error } = useSpaceHomeFeed();
  const saved = useSpaceSavedReactions(true);
  const [activeFilter, setActiveFilter] = useState<FeedFilter>('all');

  const currentUserId = isSignedIn && user?.id ? user.id : null;
  const items = feed?.items ?? [];

  const filterOptions = useMemo<FilterOption[]>(
    () => [
      { key: 'all', label: 'Все' },
      { key: 'groups', label: 'Группы' },
      { key: 'reposts', label: 'Репосты' },
      {
        key: 'my',
        label: 'Моё',
        isDisabled: !currentUserId,
      },
    ],
    [currentUserId]
  );

  const visibleItems = useMemo(() => {
    switch (activeFilter) {
      case 'groups':
        return items.filter((item) => item.post.groupId !== null);
      case 'reposts':
        return items.filter((item) => item.post.postType === 'repost' || item.post.repost !== null);
      case 'my':
        return currentUserId ? items.filter((item) => item.post.author.userId === currentUserId) : [];
      case 'all':
      default:
        return items;
    }
  }, [activeFilter, currentUserId, items]);

  return (
    <SpaceLayout>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Лента</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Личный поток Space Asia: полезные публикации, группы и заметные репосты в одном месте.
          </p>

          {mode === 'public-profile' && (
            <p className="mt-3 text-xs text-slate-500">Сейчас показан открытый обзор публикаций.</p>
          )}
        </header>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => {
              const isActive = option.key === activeFilter;
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
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {isLoading && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Собираем ленту...
          </div>
        )}

        {!isLoading && error && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {!isLoading && !error && feed && visibleItems.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            {getFilterEmptyState(activeFilter)}
          </div>
        )}

        {!isLoading && visibleItems.length > 0 && (
          <div className="space-y-4">
            {visibleItems.map((item) => (
              <div key={item.id} className="space-y-2">
                <SpaceFeedCard item={item} showReason showGroupSignal />
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
