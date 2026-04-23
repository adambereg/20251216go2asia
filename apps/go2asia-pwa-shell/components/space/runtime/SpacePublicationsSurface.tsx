'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { customInstance, generated } from '@go2asia/sdk';
import { SpacePublicationCard } from './SpacePublicationCard';
import { getErrorStatus, getProfileFeedUrl, isServiceUnavailableStatus } from './utils';

type SpacePublicationsSurfaceProps = {
  userId: string;
  isOwnerView: boolean;
};

function formatLocation(value: string | null | undefined): string | null {
  if (!value) return null;
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(' ');
}

function getSurfaceCopy(isOwnerView: boolean, profile: generated.SpaceProfileResponse | null) {
  if (isOwnerView) {
    return {
      title: 'Мои публикации',
      subtitle: 'Здесь собраны ваши материалы и репосты, которые уже видны в Space Asia.',
      note: null,
    };
  }

  return {
    title: profile?.displayName ? `Публикации ${profile.displayName}` : 'Публикации автора',
    subtitle: 'Подборка материалов автора, которые сейчас видны в Space Asia.',
    note: 'Сейчас открыт авторский публичный срез. После входа здесь появятся ваши собственные публикации.',
  };
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((index) => (
        <div key={index} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <div className="h-6 w-20 rounded-full bg-slate-100" />
            <div className="h-6 w-24 rounded-full bg-slate-100" />
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

export function SpacePublicationsSurface({
  userId,
  isOwnerView,
}: SpacePublicationsSurfaceProps) {
  const [profile, setProfile] = useState<generated.SpaceProfileResponse | null>(null);
  const [feed, setFeed] = useState<generated.SpaceFeedResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPublicationsSurface() {
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
        const status = getErrorStatus(loadError);
        setProfile(null);
        setFeed(null);
        if (status === 401 || status === 403) {
          setError('Эта подборка публикаций доступна только после входа в аккаунт.');
        } else if (isServiceUnavailableStatus(status)) {
          setError('Публикации временно недоступны. Попробуйте открыть раздел чуть позже.');
        } else {
          setError('Не удалось загрузить публикации. Обновите страницу и попробуйте ещё раз.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadPublicationsSurface();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const items = feed?.items ?? [];
  const summary = useMemo(() => {
    const reposts = items.filter((item) => item.post.postType === 'repost').length;
    const groupItems = items.filter((item) => Boolean(item.post.groupId)).length;
    const directPosts = items.filter((item) => item.post.postType === 'post').length;

    return {
      total: items.length,
      reposts,
      groupItems,
      directPosts,
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
              <div className="text-xs uppercase tracking-wide text-slate-500">В списке</div>
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
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700">
              Показано: {summary.total}
            </span>
            {summary.directPosts > 0 && (
              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-600">
                Посты: {summary.directPosts}
              </span>
            )}
            {summary.reposts > 0 && (
              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-600">
                Репосты: {summary.reposts}
              </span>
            )}
            {summary.groupItems > 0 && (
              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-600">
                В группах: {summary.groupItems}
              </span>
            )}
          </div>
        )}

        {copy.note && !isLoading && !error && (
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
              <Link href="/space" className="font-medium text-sky-700 hover:text-sky-800">
                Вернуться в Space
              </Link>
            </div>
          </div>
        )}

        {!isLoading && !error && items.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-base font-semibold text-slate-900">Пока здесь нет публикаций</h2>
            <p className="mt-2 text-sm text-slate-600">
              Когда в Space Asia появятся ваши видимые материалы или репосты, они соберутся в этом разделе.
            </p>
          </div>
        )}

        {!isLoading && !error && items.length > 0 && (
          <div className="space-y-4">
            {items.map((item) => (
              <SpacePublicationCard key={item.id} item={item} isOwnerView={isOwnerView} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
