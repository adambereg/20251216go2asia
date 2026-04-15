'use client';

import { useEffect, useMemo, useState } from 'react';
import { customInstance, generated } from '@go2asia/sdk';
import { getErrorStatus, isServiceUnavailableStatus } from '@/components/space/runtime/utils';

type CommunityDiscoveryState = 'loading' | 'ready' | 'error' | 'unavailable';

export function useSpaceCommunityDiscovery(groupIds: string[]) {
  const [groupsById, setGroupsById] = useState<Record<string, generated.SpaceGroupResponse>>({});
  const [state, setState] = useState<CommunityDiscoveryState>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadGroups() {
      if (groupIds.length === 0) {
        setGroupsById({});
        setState('ready');
        setError(null);
        return;
      }

      setState('loading');
      setError(null);

      try {
        const responses = await Promise.all(
          groupIds.map(async (groupId) => {
            const group = await customInstance<generated.SpaceGroupResponse>(
              { method: 'GET' },
              `/v1/space/groups/${encodeURIComponent(groupId)}`
            );
            return [groupId, group] as const;
          })
        );

        if (cancelled) return;

        setGroupsById(Object.fromEntries(responses));
        setState('ready');
      } catch (loadError) {
        if (cancelled) return;

        const status = getErrorStatus(loadError);
        setGroupsById({});

        if (isServiceUnavailableStatus(status)) {
          setState('unavailable');
          setError('Community runtime summary временно недоступен. Карточки остаются как curated entry layer.');
          return;
        }

        setState('error');
        setError(`Community discovery runtime request failed (${status ?? 'unknown'}).`);
      }
    }

    void loadGroups();

    return () => {
      cancelled = true;
    };
  }, [groupIds]);

  return useMemo(
    () => ({
      groupsById,
      state,
      error,
    }),
    [groupsById, state, error]
  );
}
