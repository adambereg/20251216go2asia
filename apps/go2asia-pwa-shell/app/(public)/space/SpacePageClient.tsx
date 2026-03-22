'use client';

import { useEffect, useMemo, useState } from 'react';
import { customInstance, generated } from '@go2asia/sdk';
import { SpaceLayout } from '@/components/space/Shared';

type SpaceShellMode = 'home' | 'public-profile' | 'deferred';

const HOME_FEED_URL = '/v1/space/feed/home?limit=20';
const PUBLIC_PROFILE_ID = (process.env.NEXT_PUBLIC_SPACE_PHASE1_PROFILE_ID ?? '').trim();

function getErrorStatus(error: unknown): number | null {
  if (!error || typeof error !== 'object') return null;
  const status = (error as { status?: unknown }).status;
  return typeof status === 'number' ? status : null;
}

function formatDate(value: string): string {
  try {
    return new Date(value).toLocaleString('ru-RU');
  } catch {
    return value;
  }
}

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
              `/v1/space/feed/profile/${encodeURIComponent(PUBLIC_PROFILE_ID)}?limit=20`
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
            Phase 1a: runtime-backed integration shell activation.
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
              <article
                key={item.id}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-medium text-slate-700">
                    {item.post.author.displayName}
                  </span>
                  <span>•</span>
                  <span>{item.reason}</span>
                  <span>•</span>
                  <span>{formatDate(item.createdAt)}</span>
                </div>

                {item.post.text && (
                  <p className="mb-3 whitespace-pre-wrap text-sm text-slate-800">
                    {item.post.text}
                  </p>
                )}

                {item.post.repost && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
                    <div className="font-medium">
                      Repost: {item.post.repost.targetType}
                    </div>
                    <div className="mt-1">
                      Target ID: {item.post.repost.targetId}
                    </div>
                    {item.post.repost.resolvedPreview?.title && (
                      <div className="mt-1 text-slate-900">
                        Preview: {item.post.repost.resolvedPreview.title}
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-3 text-xs text-slate-500">
                  Media: {item.post.media.length} • Visibility: {item.post.visibility}
                </div>
              </article>
            ))}
          </div>
        )}

        <footer className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h2 className="text-sm font-semibold text-amber-900">
            Deferred in phase 1a
          </h2>
          <p className="mt-1 text-xs text-amber-800">
            These sections remain intentionally deferred until next Space phases.
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
          </div>
        </footer>
      </section>
    </SpaceLayout>
  );
}


