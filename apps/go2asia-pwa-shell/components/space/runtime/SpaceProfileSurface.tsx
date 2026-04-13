'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { customInstance, generated } from '@go2asia/sdk';
import { SpaceFeedCard } from './SpaceFeedCard';
import { getErrorStatus, getProfileFeedUrl } from './utils';

type SpaceProfileSurfaceProps = {
  userId: string;
  heading: string;
  subtitle: string;
};

export function SpaceProfileSurface({
  userId,
  heading,
  subtitle,
}: SpaceProfileSurfaceProps) {
  const [profile, setProfile] = useState<generated.SpaceProfileResponse | null>(null);
  const [feed, setFeed] = useState<generated.SpaceFeedResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProfileSurface() {
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
        setError(`Profile runtime request failed (${getErrorStatus(loadError) ?? 'unknown'}).`);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadProfileSurface();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">{heading}</h1>
        <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
      </header>

      {isLoading && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          Загружаем профиль и авторские публикации...
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {!isLoading && !error && profile && (
        <section className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
            <span className="text-lg font-semibold text-slate-900">{profile.displayName}</span>
            {profile.roleLabel && (
              <span className="rounded-full border border-sky-200 bg-white px-2.5 py-1 text-xs font-medium text-sky-800">
                {profile.roleLabel}
              </span>
            )}
          </div>
          {profile.bioShort && (
            <p className="mt-3 text-sm text-slate-700">{profile.bioShort}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
            {profile.countryId && <span>Country: {profile.countryId}</span>}
            {profile.cityId && <span>City: {profile.cityId}</span>}
            <span>User ID: {profile.userId}</span>
          </div>
        </section>
      )}

      {!isLoading && !error && feed && feed.items.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          У этого профиля пока нет видимых публикаций.
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

      {!isLoading && !error && profile && (
        <footer className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h2 className="text-sm font-semibold text-amber-900">Boundedness guard</h2>
          <p className="mt-1 text-xs text-amber-800">
            Этот surface остаётся в пределах public profile baseline: только профиль и его существующий
            runtime feed path.
          </p>
          <div className="mt-3 text-xs text-amber-800">
            <Link
              href="/space"
              className="font-medium text-amber-900 underline underline-offset-2"
            >
              Вернуться в Space
            </Link>
          </div>
        </footer>
      )}
    </section>
  );
}
