'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { customInstance } from '@go2asia/sdk';
import { getErrorStatus } from './utils';

type SavedReactionRecord = {
  id: string;
  targetType: 'space_post';
  targetId: string;
  reactionType: 'bookmark';
};

type SavedReactionItem = {
  reaction: SavedReactionRecord;
};

type ListMyReactionsResponse = {
  items: SavedReactionItem[];
  nextCursor: string | null;
};

type ReactionWriteResponse = {
  reaction: SavedReactionRecord;
  applied: boolean;
};

type SavedState = 'loading' | 'ready' | 'auth-required' | 'error';

const SAVED_MINE_URL = '/v1/reactions/mine?targetType=space_post&reactionType=bookmark&limit=50';

export function useSpaceSavedReactions(enabled = true) {
  const [savedByPostId, setSavedByPostId] = useState<Record<string, string>>({});
  const [state, setState] = useState<SavedState>('loading');
  const [error, setError] = useState<string | null>(null);
  const [pendingIds, setPendingIds] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    if (!enabled) return;
    setState('loading');
    setError(null);
    try {
      const response = await customInstance<ListMyReactionsResponse>({ method: 'GET' }, SAVED_MINE_URL);
      const next: Record<string, string> = {};
      for (const item of response.items) {
        next[item.reaction.targetId] = item.reaction.id;
      }
      setSavedByPostId(next);
      setState('ready');
    } catch (loadError) {
      const status = getErrorStatus(loadError);
      if (status === 401 || status === 403) {
        setSavedByPostId({});
        setState('auth-required');
        return;
      }
      setSavedByPostId({});
      setState('error');
      setError(`Saved reactions request failed (${status ?? 'unknown'}).`);
    }
  }, [enabled]);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleSaved = useCallback(async (postId: string) => {
    const existingReactionId = savedByPostId[postId];
    setPendingIds((prev) => ({ ...prev, [postId]: true }));
    try {
      if (existingReactionId) {
        await customInstance<{ removed: boolean }>({ method: 'DELETE' }, `/v1/reactions/${encodeURIComponent(existingReactionId)}`);
        setSavedByPostId((prev) => {
          const next = { ...prev };
          delete next[postId];
          return next;
        });
      } else {
        const response = await customInstance<ReactionWriteResponse>(
          {
            method: 'POST',
            body: JSON.stringify({
              targetType: 'space_post',
              targetId: postId,
              reactionType: 'bookmark',
            }),
          },
          '/v1/reactions'
        );
        setSavedByPostId((prev) => ({ ...prev, [postId]: response.reaction.id }));
      }
      setError(null);
      if (state !== 'ready') setState('ready');
    } catch (toggleError) {
      const status = getErrorStatus(toggleError);
      if (status === 401 || status === 403) {
        setState('auth-required');
        setError('Нужна авторизация, чтобы сохранять публикации.');
      } else {
        setError(`Saved toggle failed (${status ?? 'unknown'}).`);
      }
    } finally {
      setPendingIds((prev) => {
        const next = { ...prev };
        delete next[postId];
        return next;
      });
    }
  }, [savedByPostId, state]);

  const isSaved = useCallback((postId: string) => Boolean(savedByPostId[postId]), [savedByPostId]);
  const isPending = useCallback((postId: string) => Boolean(pendingIds[postId]), [pendingIds]);

  return useMemo(
    () => ({
      state,
      error,
      isSaved,
      isPending,
      toggleSaved,
      reload: load,
    }),
    [state, error, isSaved, isPending, toggleSaved, load]
  );
}

