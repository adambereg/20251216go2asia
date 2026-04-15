'use client';

import { useCallback, useEffect, useState } from 'react';
import { customInstance, generated } from '@go2asia/sdk';
import { SpaceLayout } from '@/components/space/Shared';
import { SpaceFeedCard } from '@/components/space/runtime/SpaceFeedCard';
import { getErrorStatus, isServiceUnavailableStatus } from '@/components/space/runtime/utils';

type SavedReactionRecord = {
  id: string;
  targetId: string;
  targetType: 'space_post';
  reactionType: 'bookmark';
  createdAt: string;
};

type ListMyReactionsResponse = {
  items: Array<{ reaction: SavedReactionRecord }>;
  nextCursor: string | null;
};

type SavedHydratedItem = {
  reactionId: string;
  reactionCreatedAt: string;
  post: generated.SpacePostResponse;
};

const SAVED_MINE_URL = '/v1/reactions/mine?targetType=space_post&reactionType=bookmark&limit=50';

export function SavedPostsPageClient() {
  const [items, setItems] = useState<SavedHydratedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authRequired, setAuthRequired] = useState(false);
  const [runtimeUnavailable, setRuntimeUnavailable] = useState(false);
  const [pendingReactionIds, setPendingReactionIds] = useState<Record<string, boolean>>({});

  const loadSavedPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAuthRequired(false);
    setRuntimeUnavailable(false);

    try {
      const saved = await customInstance<ListMyReactionsResponse>({ method: 'GET' }, SAVED_MINE_URL);
      if (saved.items.length === 0) {
        setItems([]);
        return;
      }

      const hydrated = await Promise.all(
        saved.items.map(async ({ reaction }) => {
          try {
            const post = await customInstance<generated.SpacePostResponse>(
              { method: 'GET' },
              `/v1/space/posts/${encodeURIComponent(reaction.targetId)}`
            );
            return {
              reactionId: reaction.id,
              reactionCreatedAt: reaction.createdAt,
              post,
            } satisfies SavedHydratedItem;
          } catch {
            return null;
          }
        })
      );

      setItems(hydrated.filter((item): item is SavedHydratedItem => item !== null));
    } catch (loadError) {
      const status = getErrorStatus(loadError);
      if (status === 401 || status === 403) {
        setAuthRequired(true);
      } else if (isServiceUnavailableStatus(status)) {
        setRuntimeUnavailable(true);
      } else {
        setError(`Saved posts runtime request failed (${status ?? 'unknown'}).`);
      }
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSavedPosts();
  }, [loadSavedPosts]);

  const removeSaved = useCallback(async (reactionId: string) => {
    setPendingReactionIds((prev) => ({ ...prev, [reactionId]: true }));
    try {
      await customInstance<{ removed: boolean }>({ method: 'DELETE' }, `/v1/reactions/${encodeURIComponent(reactionId)}`);
      setItems((prev) => prev.filter((item) => item.reactionId !== reactionId));
      setError(null);
    } catch (removeError) {
      setError(`Saved remove failed (${getErrorStatus(removeError) ?? 'unknown'}).`);
    } finally {
      setPendingReactionIds((prev) => {
        const next = { ...prev };
        delete next[reactionId];
        return next;
      });
    }
  }, []);

  return (
    <SpaceLayout>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Сохранённые посты</h1>
          <p className="mt-2 text-sm text-slate-600">
            Подборка ваших сохранённых публикаций на базе reactions bookmark runtime.
          </p>
        </header>

        {isLoading && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Загружаем сохранённые публикации...
          </div>
        )}

        {!isLoading && authRequired && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Для раздела сохранённых нужна авторизация.
          </div>
        )}

        {!isLoading && !authRequired && runtimeUnavailable && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Сохранённые публикации временно недоступны в этом окружении. Как только reactions runtime станет доступен,
            здесь снова появится ваш shortlist.
          </div>
        )}

        {!isLoading && !authRequired && !runtimeUnavailable && error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {!isLoading && !authRequired && !runtimeUnavailable && !error && items.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Пока нет сохранённых публикаций. Сохраните пост в `/space` или `/space/community/feed`.
          </div>
        )}

        {!isLoading && !authRequired && !runtimeUnavailable && items.length > 0 && (
          <div className="space-y-4">
            {items.map((item) => {
              const feedItem: generated.SpaceFeedItem = {
                id: `saved_${item.reactionId}`,
                createdAt: item.reactionCreatedAt,
                reason: 'author_post',
                post: item.post,
              };
              return (
                <div key={item.reactionId} className="space-y-2">
                  <SpaceFeedCard item={feedItem} showReason={false} showGroupSignal />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => void removeSaved(item.reactionId)}
                      disabled={pendingReactionIds[item.reactionId]}
                      className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {pendingReactionIds[item.reactionId] ? 'Удаляем...' : 'Убрать из сохранённых'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </SpaceLayout>
  );
}

