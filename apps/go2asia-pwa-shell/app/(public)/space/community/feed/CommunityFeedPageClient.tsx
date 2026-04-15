'use client';

import { useEffect, useMemo, useState } from 'react';
import { customInstance, generated } from '@go2asia/sdk';
import { SpaceLayout } from '@/components/space/Shared';
import { SpaceFeedCard } from '@/components/space/runtime/SpaceFeedCard';
import { useSpaceSavedReactions } from '@/components/space/runtime/useSpaceSavedReactions';
import {
  getErrorStatus,
  getProfileFeedUrl,
  HOME_FEED_URL,
  PUBLIC_PROFILE_ID,
} from '@/components/space/runtime/utils';

type CommunityFeedMode = 'home' | 'public-profile' | 'deferred';

export function CommunityFeedPageClient() {
  const [mode, setMode] = useState<CommunityFeedMode>('deferred');
  const [feed, setFeed] = useState<generated.SpaceFeedResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const deferredReferences = useMemo(
    () => ['partner', 'quest', 'blog_post', 'space_post'],
    []
  );
  const saved = useSpaceSavedReactions(true);

  useEffect(() => {
    let cancelled = false;

    async function loadRuntimeFeed() {
      setIsLoading(true);
      setError(null);

      try {
        const home = await customInstance<generated.SpaceFeedResponse>(
          { method: 'GET' },
          HOME_FEED_URL
        );
        if (cancelled) return;
        setFeed(home);
        setMode('home');
      } catch (homeError) {
        if (cancelled) return;
        const status = getErrorStatus(homeError);
        const canFallbackToPublic = status === 401 || status === 403;

        if (canFallbackToPublic && PUBLIC_PROFILE_ID.length > 0) {
          try {
            const profileFeed = await customInstance<generated.SpaceFeedResponse>(
              { method: 'GET' },
              getProfileFeedUrl(PUBLIC_PROFILE_ID)
            );
            if (cancelled) return;
            setFeed(profileFeed);
            setMode('public-profile');
            return;
          } catch (fallbackError) {
            if (cancelled) return;
            const fallbackStatus = getErrorStatus(fallbackError);
            setMode('deferred');
            setFeed(null);
            setError(`Community feed fallback failed (${fallbackStatus ?? 'unknown'}).`);
            return;
          }
        }

        setMode('deferred');
        setFeed(null);
        if (status === 401 || status === 403) {
          setError(
            'Требуется авторизация для community feed. Публичный fallback-профиль не настроен.'
          );
        } else {
          setError(`Community feed runtime request failed (${status ?? 'unknown'}).`);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadRuntimeFeed();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SpaceLayout>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Лента сообщества</h1>
          <p className="mt-2 text-sm text-slate-600">
            Live-adoption pass v1: runtime-backed feed on existing Space contract.
          </p>
          <div className="mt-3 inline-flex rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
            {mode === 'home' && 'Live mode: home feed'}
            {mode === 'public-profile' && 'Live mode: public profile fallback'}
            {mode === 'deferred' && 'Deferred mode: feed is not available'}
          </div>
        </header>

        {isLoading && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Загружаем runtime community feed...
          </div>
        )}

        {!isLoading && error && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {!isLoading && !error && feed && feed.items.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Сейчас в ленте сообщества нет видимых публикаций для выбранного режима.
          </div>
        )}

        {!isLoading && feed && feed.items.length > 0 && (
          <div className="space-y-4">
            {feed.items.map((item) => (
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
            Войдите в аккаунт, чтобы использовать сохранение публикаций.
          </div>
        )}

        {!isLoading && saved.state === 'error' && saved.error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {saved.error}
          </div>
        )}

        <footer className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h2 className="text-sm font-semibold text-amber-900">Boundedness guard</h2>
          <p className="mt-1 text-xs text-amber-800">
            Этот pass включает только live-adoption feed read path. Все broad Space surfaces
            остаются вне scope.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {deferredReferences.map((ref) => (
              <span
                key={ref}
                className="rounded-full border border-amber-300 bg-white px-2.5 py-1 text-xs text-amber-800"
              >
                {ref}
              </span>
            ))}
          </div>
        </footer>
      </section>
    </SpaceLayout>
  );
}


