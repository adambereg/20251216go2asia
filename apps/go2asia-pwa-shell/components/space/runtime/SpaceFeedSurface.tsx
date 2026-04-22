'use client';

import { useMemo, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { SpaceLayout } from '@/components/space/Shared';
import { SpaceFeedCard } from '@/components/space/runtime/SpaceFeedCard';
import { useSpaceHomeFeed } from '@/components/space/runtime/useSpaceHomeFeed';
import { useSpaceSavedReactions } from '@/components/space/runtime/useSpaceSavedReactions';

type FeedFilter = 'all' | 'groups' | 'reposts' | 'my' | 'reactions';

type FilterOption = {
  key: FeedFilter;
  label: string;
  isDisabled?: boolean;
  helper?: string;
};

function getModeLabel(mode: 'home' | 'public-profile' | 'deferred'): string {
  switch (mode) {
    case 'home':
      return 'Режим: персональная лента';
    case 'public-profile':
      return 'Режим: публичный preview';
    case 'deferred':
    default:
      return 'Режим: лента недоступна';
  }
}

function getFilterEmptyState(filter: FeedFilter): string {
  switch (filter) {
    case 'groups':
      return 'В текущей загруженной части ленты пока нет публикаций с групповым контекстом.';
    case 'reposts':
      return 'В текущей загруженной части ленты пока нет репостов.';
    case 'my':
      return 'В текущей загруженной части ленты пока нет ваших stream-visible публикаций.';
    case 'reactions':
      return 'Реакции как отдельные feed-элементы ещё не поддержаны в этом slice.';
    case 'all':
    default:
      return 'Сейчас в ленте нет видимых публикаций для текущего режима.';
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
      {
        key: 'groups',
        label: 'Группы',
        helper: 'По уже загруженным карточкам',
      },
      {
        key: 'reposts',
        label: 'Репосты',
        helper: 'По уже загруженным карточкам',
      },
      {
        key: 'my',
        label: 'Моё',
        isDisabled: !currentUserId,
        helper: currentUserId ? 'По уже загруженным карточкам' : 'Нужен вход',
      },
      {
        key: 'reactions',
        label: 'Реакции',
        isDisabled: true,
        helper: 'Не в этом slice',
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
      case 'reactions':
        return [];
      case 'all':
      default:
        return items;
    }
  }, [activeFilter, currentUserId, items]);

  return (
    <SpaceLayout>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="mb-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="max-w-3xl">
              <h1 className="text-2xl font-semibold text-slate-900">Лента</h1>
              <p className="mt-2 text-sm text-slate-600">
                Центральная лента Space Asia: здесь собран ваш персональный social stream. `Сообщества` на
                `/space/community` остаются картой входа в группы, а поток конкретной группы живёт на странице самой
                группы.
              </p>
            </div>
            <div className="inline-flex rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
              {getModeLabel(mode)}
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            {mode === 'home' &&
              'Основной режим уже работает на текущем источнике ленты и не притворяется потоком групп или журналом событий.'}
            {mode === 'public-profile' &&
              'Сейчас показан публичный fallback-preview. Это не поток групп и не кабинет публикаций.'}
            {mode === 'deferred' &&
              'Лента сейчас недоступна, поэтому страница не притворяется полной социальной поверхностью.'}
          </p>
        </header>

        <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => {
              const isActive = option.key === activeFilter;
              return (
                <button
                  key={option.key}
                  type="button"
                  disabled={option.isDisabled}
                  onClick={() => setActiveFilter(option.key)}
                  className={[
                    'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                    isActive
                      ? 'border-sky-200 bg-sky-50 text-sky-800'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100',
                    option.isDisabled ? 'cursor-not-allowed opacity-60 hover:bg-white' : '',
                  ].join(' ')}
                >
                  <span>{option.label}</span>
                  {option.helper && <span className="text-[11px] text-slate-500">{option.helper}</span>}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            `Все` показывает весь поток, который уже отдал текущий runtime. `Группы`, `Репосты` и `Моё` в этом slice
            фильтруют только уже загруженные карточки и не обещают отдельную серверную пагинацию. `Реакции`
            намеренно не включены, потому что текущий runtime ещё не отдаёт отдельные reaction-driven feed items.
          </p>
        </div>

        {isLoading && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Загружаем ленту Space Asia...
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
            Войдите в аккаунт, чтобы использовать сохранение публикаций и фильтр `Моё`.
          </div>
        )}

        {!isLoading && saved.state === 'unavailable' && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Сохранение постов временно недоступно в этом окружении, но сама лента продолжает работать в штатном
            режиме.
          </div>
        )}

        {!isLoading && saved.state === 'error' && saved.error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {saved.error}
          </div>
        )}

        <footer className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h2 className="text-sm font-semibold text-amber-900">Границы этого slice</h2>
          <p className="mt-1 text-xs text-amber-800">
            Здесь реализована честная центральная лента на текущем источнике `/v1/space/feed/home`. Этот slice не превращает
            ленту в каталог групп, не подменяет её activity log и не симулирует `Reactions` без отдельной
            runtime-поддержки.
          </p>
        </footer>
      </section>
    </SpaceLayout>
  );
}
