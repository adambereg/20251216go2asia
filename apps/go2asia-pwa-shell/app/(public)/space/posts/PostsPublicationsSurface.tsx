'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { customInstance, generated } from '@go2asia/sdk';
import { PostsPublicationCard } from './PostsPublicationCard';

type PostsPublicationsSurfaceProps = {
  userId: string;
  isOwnerView: boolean;
};

function getErrorStatus(error: unknown): number | null {
  if (!error || typeof error !== 'object') return null;
  const status = (error as { status?: unknown }).status;
  return typeof status === 'number' ? status : null;
}

function getProfileFeedUrl(userId: string, limit = 20): string {
  return `/v1/space/feed/profile/${encodeURIComponent(userId)}?limit=${limit}`;
}

function formatLocation(value: string | null | undefined): string | null {
  if (!value) return null;
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(' ');
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((index) => (
        <div key={index} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <div className="h-6 w-20 rounded-full bg-slate-100" />
            <div className="h-6 w-28 rounded-full bg-slate-100" />
          </div>
          <div className="mt-4 h-5 w-64 rounded bg-slate-100" />
          <div className="mt-3 h-4 w-full rounded bg-slate-100" />
          <div className="mt-2 h-4 w-5/6 rounded bg-slate-100" />
          <div className="mt-4 flex gap-2">
            <div className="h-8 w-28 rounded-md bg-slate-100" />
            <div className="h-8 w-24 rounded-md bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function getSurfaceCopy(
  isOwnerView: boolean,
  profile: generated.SpaceProfileResponse | null
) {
  if (isOwnerView) {
    return {
      title: 'Авторские публикации',
      subtitle: 'Здесь собраны ваши материалы и репосты, которые уже видны в Space Asia.',
      note: 'Здесь собраны только те публикации, которые уже доступны в этой версии Space Asia.',
    };
  }

  return {
    title: profile?.displayName ? `Публикации ${profile.displayName}` : 'Авторские публикации',
    subtitle: 'Здесь собраны публикации автора, которые сейчас можно увидеть в Space Asia.',
    note: 'После входа в аккаунт здесь откроется ваш собственный список публикаций.',
  };
}

export function PostsPublicationsSurface({
  userId,
  isOwnerView,
}: PostsPublicationsSurfaceProps) {
  const [profile, setProfile] = useState<generated.SpaceProfileResponse | null>(null);
  const [feed, setFeed] = useState<generated.SpaceFeedResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const [profileResponse, feedResponse] = await Promise.all([
          customInstance<generated.SpaceProfileResponse>(
            { method: 'GET' },
            `/v1/space/profiles/${encodeURIComponent(userId)}`
          ),
          customInstance<generated.SpaceFeedResponse>(
            { method: 'GET' },
            getProfileFeedUrl(userId)
          ),
        ]);

        if (cancelled) return;
        setProfile(profileResponse);
        setFeed(feedResponse);
      } catch (loadError) {
        if (cancelled) return;
        setProfile(null);
        setFeed(null);
        const status = getErrorStatus(loadError);
        if (status === 401 || status === 403) {
          setError('Эта подборка публикаций доступна после входа в аккаунт.');
        } else if (status === 500 || status === 501 || status === 502 || status === 503) {
          setError('Публикации временно недоступны. Попробуйте открыть раздел немного позже.');
        } else {
          setError('Не удалось загрузить публикации. Обновите страницу и попробуйте ещё раз.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const items = feed?.items ?? [];
  const summary = useMemo(() => {
    const authored = items.filter((item) => item.post.postType === 'post').length;
    const reposts = items.filter((item) => item.post.postType === 'repost').length;
    const grouped = items.filter((item) => Boolean(item.post.groupId)).length;

    return {
      total: items.length,
      authored,
      reposts,
      grouped,
    };
  }, [items]);

  const copy = getSurfaceCopy(isOwnerView, profile);
  const location = profile
    ? [formatLocation(profile.cityId), formatLocation(profile.countryId)].filter(Boolean).join(', ')
    : '';

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="border-b border-slate-100 pb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{copy.title}</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">{copy.subtitle}</p>
          </div>

          {!isLoading && !error && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
              <div className="text-xs uppercase tracking-wide text-slate-500">Публикаций</div>
              <div className="mt-1 text-xl font-semibold text-slate-900">{summary.total}</div>
            </div>
          )}
        </div>

        {!isLoading && !error && profile && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span className="font-medium text-slate-800">{profile.displayName}</span>
            {profile.roleLabel && (
              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600">
                {profile.roleLabel}
              </span>
            )}
            {location && <span>{location}</span>}
          </div>
        )}

        {!isLoading && !error && (
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {summary.authored > 0 && (
              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-600">
                Записи: {summary.authored}
              </span>
            )}
            {summary.reposts > 0 && (
              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-600">
                Репосты: {summary.reposts}
              </span>
            )}
            {summary.grouped > 0 && (
              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-600">
                В группах: {summary.grouped}
              </span>
            )}
          </div>
        )}

        {!isLoading && !error && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {copy.note}
          </div>
        )}
      </header>

      <div className="mt-6">
        {isLoading && <LoadingSkeleton />}

        {!isLoading && error && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
            <p>{error}</p>
            <div className="mt-3">
              <Link href="/space/feed" className="font-medium text-sky-700 hover:text-sky-800">
                Открыть ленту Space Asia
              </Link>
            </div>
          </div>
        )}

        {!isLoading && !error && items.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-base font-semibold text-slate-900">Пока здесь нет публикаций</h2>
            <p className="mt-2 text-sm text-slate-600">
              Когда появятся новые видимые публикации или репосты, они соберутся в этом разделе.
            </p>
          </div>
        )}

        {!isLoading && !error && items.length > 0 && (
          <div className="space-y-4">
            {items.map((item) => (
              <PostsPublicationCard key={item.id} item={item} isOwnerView={isOwnerView} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
