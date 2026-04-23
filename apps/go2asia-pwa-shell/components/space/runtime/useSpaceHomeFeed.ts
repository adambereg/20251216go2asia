'use client';

import { useEffect, useState } from 'react';
import { customInstance, generated } from '@go2asia/sdk';
import { getErrorStatus, getProfileFeedUrl, HOME_FEED_URL, PUBLIC_PROFILE_ID } from './utils';

export type SpaceHomeFeedMode = 'home' | 'public-profile' | 'deferred';

export function useSpaceHomeFeed() {
  const [mode, setMode] = useState<SpaceHomeFeedMode>('deferred');
  const [feed, setFeed] = useState<generated.SpaceFeedResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadRuntimeFeed() {
      setIsLoading(true);
      setError(null);

      try {
        const home = await customInstance<generated.SpaceFeedResponse>({ method: 'GET' }, HOME_FEED_URL);
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
            setMode('deferred');
            setFeed(null);
            setError('Сейчас не удаётся открыть ленту. Попробуйте позже.');
            return;
          }
        }

        setMode('deferred');
        setFeed(null);
        if (status === 401 || status === 403) {
          setError('Войдите в аккаунт, чтобы увидеть персональную ленту.');
        } else {
          setError('Сейчас не удаётся загрузить ленту. Попробуйте позже.');
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

  return {
    mode,
    feed,
    isLoading,
    error,
  };
}

