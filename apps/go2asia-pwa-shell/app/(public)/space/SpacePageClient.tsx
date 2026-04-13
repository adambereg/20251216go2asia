'use client';

import { useEffect, useMemo, useState } from 'react';
import { customInstance, generated } from '@go2asia/sdk';
import { SpaceLayout } from '@/components/space/Shared';
import { SpaceFeedCard } from '@/components/space/runtime/SpaceFeedCard';
import {
  getErrorStatus,
  getProfileFeedUrl,
  HOME_FEED_URL,
  PUBLIC_PROFILE_ID,
} from '@/components/space/runtime/utils';

type SpaceShellMode = 'home' | 'public-profile' | 'deferred';

export function SpacePageClient() {
  const [mode, setMode] = useState<SpaceShellMode>('deferred');
  const [feed, setFeed] = useState<generated.SpaceFeedResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const deferredBlocks = useMemo(
    () => ['Квесты', 'Ваучеры', 'NFT', 'Рефералы', 'Баланс', 'Настройки'],
    []
  );

  useEffect(() => {
    let cancelled = false;

    async function activateRuntimeShell() {
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
          } catch (profileError) {
            if (cancelled) return;
            const fallbackStatus = getErrorStatus(profileError);
            setMode('deferred');
            setError(
              `Space runtime fallback failed (${fallbackStatus ?? 'unknown'}).`
            );
            return;
          }
        }

        setMode('deferred');
        if (status === 401 || status === 403) {
          setError(
            'Требуется авторизация для персональной ленты. Публичный профиль для fallback не настроен.'
          );
        } else {
          setError(`Space runtime request failed (${status ?? 'unknown'}).`);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void activateRuntimeShell();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SpaceLayout>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Space Asia
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Phase 1 freeze baseline: runtime shell with narrow reference previews.
          </p>
          <div className="mt-3 inline-flex rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
            {mode === 'home' && 'Live mode: personal home feed'}
            {mode === 'public-profile' && 'Live mode: public profile feed fallback'}
            {mode === 'deferred' && 'Deferred mode: runtime shell unavailable'}
          </div>
        </header>

        {isLoading && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Загрузка runtime shell...
          </div>
        )}

        {!isLoading && error && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {!isLoading && feed && feed.items.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Runtime feed currently has no visible posts for this mode.
          </div>
        )}

        {!isLoading && feed && feed.items.length > 0 && (
          <div className="space-y-4">
            {feed.items.map((item) => (
              <SpaceFeedCard
                key={item.id}
                item={item}
                showReason
                showGroupSignal
              />
            ))}
          </div>
        )}

        <section className="mt-8 rounded-xl border border-sky-200 bg-sky-50 p-4">
          <h2 className="text-sm font-semibold text-sky-900">
            Integrated references in phase 1b
          </h2>
          <p className="mt-1 text-xs text-sky-800">
            Runtime shell now provides lightweight cross-module links for safe reference types only.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-sky-300 bg-white px-2.5 py-1 text-xs text-sky-800">
              Pulse event
            </span>
            <span className="rounded-full border border-sky-300 bg-white px-2.5 py-1 text-xs text-sky-800">
              Atlas place
            </span>
            <span className="rounded-full border border-sky-300 bg-white px-2.5 py-1 text-xs text-sky-800">
              Rielt listing
            </span>
          </div>
        </section>

        <footer className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h2 className="text-sm font-semibold text-amber-900">
            Deferred in phase 1b
          </h2>
          <p className="mt-1 text-xs text-amber-800">
            RF partner, Quest, Blog and Space-post deep previews stay deferred to avoid unsafe routing assumptions.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {deferredBlocks.map((item) => (
              <span
                key={item}
                className="rounded-full border border-amber-300 bg-white px-2.5 py-1 text-xs text-amber-800"
              >
                {item}
              </span>
            ))}
            <span className="rounded-full border border-amber-300 bg-white px-2.5 py-1 text-xs text-amber-800">
              RF partner preview
            </span>
            <span className="rounded-full border border-amber-300 bg-white px-2.5 py-1 text-xs text-amber-800">
              Quest preview
            </span>
            <span className="rounded-full border border-amber-300 bg-white px-2.5 py-1 text-xs text-amber-800">
              Blog preview
            </span>
            <span className="rounded-full border border-amber-300 bg-white px-2.5 py-1 text-xs text-amber-800">
              Space-post deep preview
            </span>
          </div>
        </footer>
      </section>
    </SpaceLayout>
  );
}


