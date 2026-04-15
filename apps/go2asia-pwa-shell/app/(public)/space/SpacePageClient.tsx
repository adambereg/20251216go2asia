'use client';

import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { useEffect, useMemo, useState } from 'react';
import { customInstance, generated } from '@go2asia/sdk';
import { SpaceLayout } from '@/components/space/Shared';
import { SpaceFeedCard } from '@/components/space/runtime/SpaceFeedCard';
import { useSpaceHomeFeed } from '@/components/space/runtime/useSpaceHomeFeed';
import { useSpaceSavedReactions } from '@/components/space/runtime/useSpaceSavedReactions';
import { PUBLIC_PROFILE_ID } from '@/components/space/runtime/utils';

type HeaderSurfaceState = 'loading' | 'ready' | 'error' | 'generic';

type SavedPreviewItem = {
  reactionId: string;
  createdAt: string;
  post: generated.SpacePostResponse;
};

const quickEntries = [
  {
    href: '/space/community/feed',
    title: 'Лента сообщества',
    description: 'Полный social stream остаётся отдельной live-surface.',
  },
  {
    href: '/space/posts',
    title: 'Публикации',
    description: 'Авторские публикации и public profile feed baseline.',
  },
  {
    href: '/space/activity',
    title: 'Активность',
    description: 'Узкий activity path как отдельный timeline.',
  },
  {
    href: '/space/saved',
    title: 'Сохранённые',
    description: 'Bookmark runtime через reactions contour.',
  },
] as const;

const referenceBlocks = [
  {
    title: 'Today',
    status: 'reference-only',
    description: 'Что важно именно сегодня. Пока только direction block без live organizer/planner semantics.',
  },
  {
    title: 'Next Actions',
    status: 'reference-only',
    description: 'Следующие шаги остаются action framing, а не fully-live assistant workflow.',
  },
  {
    title: 'Organizer Preview',
    status: 'reference-only',
    description: 'Preview остаётся thin by design до отдельного organizer runtime slice.',
  },
  {
    title: 'Ecosystem Signals',
    status: 'summary-only',
    description: 'Adjacent domains будут здесь только как summaries, без переноса ownership в Space.',
  },
  {
    title: 'AI Assistant Suggestions',
    status: 'reference-only',
    description: 'AI слой пока не открывается как operational loop и остаётся calm reference section.',
  },
  {
    title: 'PRO Widget',
    status: 'reference-only',
    description: 'Bridge life -> work остаётся marker block, не заменяя PRO Workspace.',
  },
] as const;

export function SpacePageClient() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { mode, feed, isLoading: isFeedLoading, error: feedError } = useSpaceHomeFeed();
  const saved = useSpaceSavedReactions(true);
  const [headerProfile, setHeaderProfile] = useState<generated.SpaceProfileResponse | null>(null);
  const [headerState, setHeaderState] = useState<HeaderSurfaceState>('loading');
  const [savedPreview, setSavedPreview] = useState<SavedPreviewItem[]>([]);
  const [savedPreviewLoading, setSavedPreviewLoading] = useState(false);

  const headerUserId = useMemo(() => {
    if (isSignedIn && user?.id) return user.id;
    if (PUBLIC_PROFILE_ID) return PUBLIC_PROFILE_ID;
    return null;
  }, [isSignedIn, user?.id]);

  const pulsePreviewItems = useMemo(() => feed?.items.slice(0, 2) ?? [], [feed]);

  useEffect(() => {
    let cancelled = false;

    async function loadHeaderProfile() {
      if (!isLoaded) return;
      if (!headerUserId) {
        setHeaderProfile(null);
        setHeaderState('generic');
        return;
      }

      setHeaderState('loading');
      try {
        const profile = await customInstance<generated.SpaceProfileResponse>(
          { method: 'GET' },
          `/v1/space/profiles/${encodeURIComponent(headerUserId)}`
        );
        if (cancelled) return;
        setHeaderProfile(profile);
        setHeaderState('ready');
      } catch {
        if (cancelled) return;
        setHeaderProfile(null);
        setHeaderState('generic');
      }
    }

    void loadHeaderProfile();
    return () => {
      cancelled = true;
    };
  }, [headerUserId, isLoaded]);

  useEffect(() => {
    let cancelled = false;

    async function loadSavedPreview() {
      if (saved.state !== 'ready' || saved.savedReactions.length === 0) {
        setSavedPreview([]);
        return;
      }

      const previewTargets = saved.savedReactions.slice(0, 2);
      setSavedPreviewLoading(true);

      try {
        const hydrated = await Promise.all(
          previewTargets.map(async (reaction) => {
            try {
              const post = await customInstance<generated.SpacePostResponse>(
                { method: 'GET' },
                `/v1/space/posts/${encodeURIComponent(reaction.targetId)}`
              );
              return {
                reactionId: reaction.id,
                createdAt: reaction.createdAt ?? post.createdAt,
                post,
              } satisfies SavedPreviewItem;
            } catch {
              return null;
            }
          })
        );

        if (cancelled) return;
        setSavedPreview(hydrated.filter((item): item is SavedPreviewItem => item !== null));
      } finally {
        if (!cancelled) setSavedPreviewLoading(false);
      }
    }

    void loadSavedPreview();
    return () => {
      cancelled = true;
    };
  }, [saved.savedReactions, saved.state]);

  const headerTitle =
    headerProfile?.displayName ??
    user?.fullName ??
    user?.firstName ??
    'Space Dashboard';

  const headerDescription = headerProfile?.bioShort
    ? headerProfile.bioShort
    : mode === 'home'
      ? 'Персональный operating cockpit с narrow social baseline и dashboard-first semantics.'
      : mode === 'public-profile'
        ? 'Публичный representative preview для dashboard-shell baseline.'
        : 'Dashboard-shell baseline пока доступен в thin mode.';

  return (
    <SpaceLayout>
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Space Asia</h1>
              <p className="mt-2 text-sm text-slate-600">
                Dashboard-shell baseline v1: `/space` = orient → act → return, а полный social stream вынесен в отдельную поверхность.
              </p>
            </div>
            <div className="inline-flex rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
              {mode === 'home' && 'Live mode: personal dashboard baseline'}
              {mode === 'public-profile' && 'Live mode: public representative preview'}
              {mode === 'deferred' && 'Thin mode: runtime shell degraded'}
            </div>
          </header>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">User Header</h2>
              <p className="mt-1 text-sm text-slate-600">Honest narrow identity/context layer на существующем profile/runtime baseline.</p>
            </div>
            <span className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-800">
              summary-backed now
            </span>
          </div>

          {headerState === 'loading' && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Загружаем профиль для dashboard header...
            </div>
          )}

          {headerState !== 'loading' && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-semibold text-slate-900">{headerTitle}</h3>
                {headerProfile?.roleLabel && (
                  <span className="rounded-full border border-sky-200 bg-white px-2.5 py-1 text-xs font-medium text-sky-800">
                    {headerProfile.roleLabel}
                  </span>
                )}
                {!isSignedIn && (
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">
                    public preview
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm text-slate-700">{headerDescription}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {headerProfile?.cityId && (
                  <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-700">
                    City: {headerProfile.cityId}
                  </span>
                )}
                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-700">
                  Social preview: {pulsePreviewItems.length}
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-700">
                  Saved: {saved.state === 'ready' ? saved.savedCount : isSignedIn ? 'loading' : 'auth required'}
                </span>
              </div>
            </div>
          )}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Quick Entry</h2>
                <p className="mt-1 text-sm text-slate-600">Переходы в уже живые Space surfaces без broad dashboard expansion.</p>
              </div>
              <span className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-800">
                runtime-backed now
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {quickEntries.map((entry) => (
                <Link
                  key={entry.href}
                  href={entry.href}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100"
                >
                  <div className="text-sm font-semibold text-slate-900">{entry.title}</div>
                  <p className="mt-2 text-xs text-slate-600">{entry.description}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Saved Preview</h2>
                <p className="mt-1 text-sm text-slate-600">Минимальный preview поверх уже живого reactions bookmark contour.</p>
              </div>
              <span className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-800">
                runtime-backed now
              </span>
            </div>

            {saved.state === 'loading' && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Загружаем сохранённые публикации...
              </div>
            )}

            {saved.state === 'auth-required' && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                Войдите, чтобы увидеть персональный saved preview и полный список в `/space/saved`.
              </div>
            )}

            {saved.state === 'error' && saved.error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                {saved.error}
              </div>
            )}

            {saved.state === 'ready' && saved.savedCount === 0 && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Пока нет сохранённых публикаций. Начните с community feed или полного списка публикаций.
              </div>
            )}

            {saved.state === 'ready' && saved.savedCount > 0 && (
              <div className="space-y-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                  Всего сохранённых постов: <span className="font-semibold">{saved.savedCount}</span>
                </div>
                {savedPreviewLoading && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    Готовим preview сохранённых постов...
                  </div>
                )}
                {!savedPreviewLoading && savedPreview.length === 0 && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    Preview пока недоступен, но полный список уже открыт через `/space/saved`.
                  </div>
                )}
                {savedPreview.map((item) => {
                  const feedItem: generated.SpaceFeedItem = {
                    id: `saved_preview_${item.reactionId}`,
                    createdAt: item.createdAt,
                    reason: 'author_post',
                    post: item.post,
                  };
                  return <SpaceFeedCard key={item.reactionId} item={feedItem} showReason={false} showGroupSignal />;
                })}
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Social Pulse</h2>
              <p className="mt-1 text-sm text-slate-600">Preview-only social block. Full feed semantics остаются на `/space/community/feed`.</p>
            </div>
            <Link
              href="/space/community/feed"
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Открыть full feed
            </Link>
          </div>

          {isFeedLoading && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Загружаем social pulse preview...
            </div>
          )}

          {!isFeedLoading && feedError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {feedError}
            </div>
          )}

          {!isFeedLoading && !feedError && pulsePreviewItems.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Пока здесь мало сигналов. Полная лента сообщества остаётся доступной как отдельная surface.
            </div>
          )}

          {!isFeedLoading && pulsePreviewItems.length > 0 && (
            <div className="space-y-4">
              {pulsePreviewItems.map((item) => (
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
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-amber-900">Reference / summary layers</h2>
              <p className="mt-1 text-sm text-amber-800">These dashboard blocks are intentionally thin by design in this pass.</p>
            </div>
            <span className="rounded-full border border-amber-300 bg-white px-2.5 py-1 text-xs font-medium text-amber-800">
              not full live surfaces
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {referenceBlocks.map((block) => (
              <article key={block.title} className="rounded-xl border border-amber-300 bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">{block.title}</h3>
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                    {block.status}
                  </span>
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-600">{block.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </SpaceLayout>
  );
}


