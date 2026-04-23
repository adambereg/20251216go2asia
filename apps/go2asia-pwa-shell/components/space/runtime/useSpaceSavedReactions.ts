'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { customInstance } from '@go2asia/sdk';
import { getErrorStatus, isServiceUnavailableStatus, SAVED_POSTS_MINE_URL } from './utils';

type SavedReactionRecord = {
  id: string;
  targetType: 'space_post';
  targetId: string;
  reactionType: 'bookmark';
  createdAt?: string;
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

type SavedState = 'loading' | 'ready' | 'auth-required' | 'unavailable' | 'error';

export function useSpaceSavedReactions(enabled = true) {
  const [savedByPostId, setSavedByPostId] = useState<Record<string, string>>({});
  const [savedReactions, setSavedReactions] = useState<SavedReactionRecord[]>([]);
  const [state, setState] = useState<SavedState>('loading');
  const [error, setError] = useState<string | null>(null);
  const [pendingIds, setPendingIds] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    if (!enabled) return;
    setState('loading');
    setError(null);
    try {
      const response = await customInstance<ListMyReactionsResponse>({ method: 'GET' }, SAVED_POSTS_MINE_URL);
      const next: Record<string, string> = {};
      const reactions: SavedReactionRecord[] = [];
      for (const item of response.items) {
        next[item.reaction.targetId] = item.reaction.id;
        reactions.push(item.reaction);
      }
      setSavedByPostId(next);
      setSavedReactions(reactions);
      setState('ready');
    } catch (loadError) {
      const status = getErrorStatus(loadError);
      if (status === 401 || status === 403) {
        setSavedByPostId({});
        setSavedReactions([]);
        setState('auth-required');
        return;
      }
      if (isServiceUnavailableStatus(status)) {
        setSavedByPostId({});
        setSavedReactions([]);
        setState('unavailable');
        setError('Сохранённые временно недоступны.');
        return;
      }
      setSavedByPostId({});
      setSavedReactions([]);
      setState('error');
      setError('Сейчас не удаётся загрузить сохранённые публикации.');
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
        setSavedReactions((prev) => prev.filter((item) => item.targetId !== postId));
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
        setSavedReactions((prev) => [
          {
            ...response.reaction,
            createdAt: new Date().toISOString(),
          },
          ...prev.filter((item) => item.targetId !== postId),
        ]);
      }
      setError(null);
      if (state !== 'ready') setState('ready');
    } catch (toggleError) {
      const status = getErrorStatus(toggleError);
      if (status === 401 || status === 403) {
        setState('auth-required');
        setError('Нужна авторизация, чтобы сохранять публикации.');
      } else if (isServiceUnavailableStatus(status)) {
        setState('unavailable');
        setError('Сохранение временно недоступно.');
      } else {
        setError('Не удалось обновить сохранение. Попробуйте ещё раз.');
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
      savedReactions,
      savedCount: savedReactions.length,
      isSaved,
      isPending,
      toggleSaved,
      reload: load,
    }),
    [state, error, savedReactions, isSaved, isPending, toggleSaved, load]
  );
}

