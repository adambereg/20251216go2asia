'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Bookmark, Heart, Share2 } from 'lucide-react';
import { customInstance, generated } from '@go2asia/sdk';
import { buildPrivateRepostIntentRequest, getOwnerRetentionUrl } from '@/modules/space/retentionIntent';
import { WS2_COPY } from '@/modules/space/ws2Copy';
import { ShareToSpaceComposer } from './ShareToSpaceComposer';

type PilotTargetType = Extract<generated.ReactionTargetType, 'place' | 'event' | 'blog_post' | 'space_post'>;

type ContentActionRowProps = {
  targetType: PilotTargetType;
  targetId: string;
  title: string;
  className?: string;
};

type Feedback = {
  tone: 'success' | 'error' | 'info';
  message: string;
  href?: string;
};

function getErrorStatus(error: unknown): number | null {
  if (!error || typeof error !== 'object') return null;
  const status = (error as { status?: unknown }).status;
  return typeof status === 'number' ? status : null;
}

function getErrorCode(error: unknown): string | null {
  if (!error || typeof error !== 'object') return null;
  const code = (error as { error?: { code?: unknown } }).error?.code;
  return typeof code === 'string' ? code : null;
}

function getExistingPostId(error: unknown): string | null {
  if (!error || typeof error !== 'object') return null;
  const existingPostId = (error as { existingPostId?: unknown }).existingPostId;
  return typeof existingPostId === 'string' ? existingPostId : null;
}

function createIdempotencyKey(prefix: string, targetType: PilotTargetType, targetId: string) {
  const suffix =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}:${targetType}:${targetId}:${suffix}`.slice(0, 128);
}

function buildMineUrl(targetType: PilotTargetType, targetId: string) {
  const params = new URLSearchParams({
    targetType,
    reactionType: 'bookmark',
    targetId,
    limit: '1',
  });
  return `/v1/reactions/mine?${params.toString()}`;
}

function ActionButton({
  children,
  disabled,
  tone,
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  tone: 'like' | 'save' | 'share';
  onClick: () => void;
}) {
  const toneClass =
    tone === 'like'
      ? 'hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700'
      : tone === 'save'
        ? 'hover:border-sky-200 hover:bg-sky-50 hover:text-sky-800'
        : 'hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800';

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${toneClass}`}
    >
      {children}
    </button>
  );
}

export function ContentActionRow({ targetType, targetId, title, className }: ContentActionRowProps) {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const [isLoading, setIsLoading] = useState(true);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeReactionId, setLikeReactionId] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkReactionId, setBookmarkReactionId] = useState<string | null>(null);
  const [sharedPostId, setSharedPostId] = useState<string | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'like' | 'bookmark' | 'share' | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const signInHref = useMemo(
    () => `/sign-in?redirect_url=${encodeURIComponent(pathname || '/')}`,
    [pathname]
  );

  const requireAuth = useCallback(() => {
    if (isLoaded && !isSignedIn) {
      router.push(signInHref);
      return false;
    }
    return Boolean(isSignedIn);
  }, [isLoaded, isSignedIn, router, signInHref]);

  const loadState = useCallback(async () => {
    if (!targetId) return;
    setIsLoading(true);
    try {
      const summary = await customInstance<generated.ReactionSummaryResponse>(
        { method: 'GET' },
        `/v1/reactions/summary/${targetType}/${encodeURIComponent(targetId)}`
      );
      setLikeCount(summary.item.counts.like);
      setLiked(summary.item.viewer.liked);
      setLikeReactionId(summary.item.viewer.likeReactionId ?? null);

      if (isLoaded && isSignedIn) {
        const mine = await customInstance<generated.ListMyReactionsResponse>({ method: 'GET' }, buildMineUrl(targetType, targetId));
        const reaction = mine.items[0]?.reaction ?? null;
        setBookmarked(Boolean(reaction));
        setBookmarkReactionId(reaction?.id ?? null);

        if (user?.id) {
          const profileFeed = await customInstance<generated.SpaceFeedResponse>(
            { method: 'GET' },
            `/v1/space/feed/profile/${encodeURIComponent(user.id)}?limit=50`
          );
          const existingRepost = profileFeed.items.find(
            (feedItem) =>
              feedItem.post.postType === 'repost' &&
              feedItem.post.repost?.targetType === targetType &&
              feedItem.post.repost?.targetId === targetId
          );
          setSharedPostId(existingRepost?.post.id ?? null);
        } else {
          setSharedPostId(null);
        }
      } else {
        setBookmarked(false);
        setBookmarkReactionId(null);
        setSharedPostId(null);
      }
    } catch (error) {
      setFeedback({
        tone: 'error',
        message: `Не удалось загрузить действия (${getErrorStatus(error) ?? 'unknown'}).`,
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, isSignedIn, targetId, targetType, user?.id]);

  useEffect(() => {
    void loadState();
  }, [loadState]);

  const toggleLike = useCallback(async () => {
    if (!requireAuth()) return;
    setPendingAction('like');
    setFeedback(null);

    const previous = { liked, likeCount, likeReactionId };
    try {
      if (liked) {
        if (!likeReactionId) {
          await loadState();
          setFeedback({ tone: 'error', message: 'Не удалось найти runtime-id лайка. Попробуйте ещё раз.' });
          return;
        }
        setLiked(false);
        setLikeCount((value) => Math.max(0, value - 1));
        setLikeReactionId(null);
        await customInstance<generated.ReactionDeleteResponse>(
          { method: 'DELETE' },
          `/v1/reactions/${encodeURIComponent(likeReactionId)}`
        );
        return;
      }

      setLiked(true);
      setLikeCount((value) => value + 1);
      const response = await customInstance<generated.ReactionWriteResponse>(
        {
          method: 'POST',
          headers: {
            'Idempotency-Key': createIdempotencyKey('like', targetType, targetId),
          },
          body: JSON.stringify({
            targetType,
            targetId,
            reactionType: 'like',
          } satisfies generated.UpsertReactionRequest),
        },
        '/v1/reactions'
      );
      setLikeReactionId(response.reaction.id);
    } catch (error) {
      setLiked(previous.liked);
      setLikeCount(previous.likeCount);
      setLikeReactionId(previous.likeReactionId);
      setFeedback({
        tone: 'error',
        message: `Не удалось обновить лайк (${getErrorStatus(error) ?? 'unknown'}).`,
      });
    } finally {
      setPendingAction(null);
    }
  }, [liked, likeCount, likeReactionId, loadState, requireAuth, targetId, targetType]);

  const toggleBookmark = useCallback(async () => {
    if (!requireAuth()) return;
    setPendingAction('bookmark');
    setFeedback(null);

    const previous = { bookmarked, bookmarkReactionId };
    try {
      if (bookmarked) {
        if (!bookmarkReactionId) {
          await loadState();
          setFeedback({ tone: 'error', message: 'Не удалось найти runtime-id сохранения. Попробуйте ещё раз.' });
          return;
        }
        setBookmarked(false);
        setBookmarkReactionId(null);
        await customInstance<generated.ReactionDeleteResponse>(
          { method: 'DELETE' },
          `/v1/reactions/${encodeURIComponent(bookmarkReactionId)}`
        );
        return;
      }

      setBookmarked(true);
      const response = await customInstance<generated.ReactionWriteResponse>(
        {
          method: 'POST',
          headers: {
            'Idempotency-Key': createIdempotencyKey('bookmark', targetType, targetId),
          },
          body: JSON.stringify({
            targetType,
            targetId,
            reactionType: 'bookmark',
          } satisfies generated.UpsertReactionRequest),
        },
        '/v1/reactions'
      );
      setBookmarkReactionId(response.reaction.id);
    } catch (error) {
      setBookmarked(previous.bookmarked);
      setBookmarkReactionId(previous.bookmarkReactionId);
      setFeedback({
        tone: 'error',
        message: `Не удалось обновить сохранение (${getErrorStatus(error) ?? 'unknown'}).`,
      });
    } finally {
      setPendingAction(null);
    }
  }, [bookmarkReactionId, bookmarked, loadState, requireAuth, targetId, targetType]);

  const shareToSpace = useCallback(() => {
    if (!requireAuth()) return false;
    if (sharedPostId) {
      setFeedback({
        tone: 'info',
        message: `Материал «${title}» уже сохранён для себя в Space.`,
        href: getOwnerRetentionUrl(sharedPostId),
      });
      return false;
    }
    return true;
  }, [requireAuth, sharedPostId, title]);

  const createRepostWithCommentary = useCallback(async (text: string | null) => {
    setPendingAction('share');
    setFeedback(null);
    try {
      const response = await customInstance<generated.SpacePostResponse>(
        {
          method: 'POST',
          body: JSON.stringify(buildPrivateRepostIntentRequest({ targetType, targetId, text })),
        },
        '/v1/space/posts'
      );
      setSharedPostId(response.id);
      setIsComposerOpen(false);
      setFeedback({
        tone: 'success',
        message: text ? WS2_COPY.saveForMyself.successWithNote(title) : WS2_COPY.saveForMyself.success(title),
        href: getOwnerRetentionUrl(response.id),
      });
    } catch (error) {
      const status = getErrorStatus(error);
      const code = getErrorCode(error);
      if (status === 409 || code === 'REPOST_ALREADY_EXISTS') {
        const existingPostId = getExistingPostId(error);
        setSharedPostId(existingPostId);
        setIsComposerOpen(false);
        setFeedback({
          tone: 'info',
          message: WS2_COPY.saveForMyself.alreadyExists,
          href: existingPostId ? getOwnerRetentionUrl(existingPostId) : '/space/posts',
        });
        return;
      }
      setFeedback({
        tone: 'error',
        message: WS2_COPY.saveForMyself.error(status ?? 'unknown'),
      });
    } finally {
      setPendingAction(null);
    }
  }, [targetId, targetType, title]);

  const openShareComposer = useCallback(() => {
    const canOpenComposer = shareToSpace();
    if (!canOpenComposer) return;
    setFeedback(null);
    setIsComposerOpen(true);
  }, [shareToSpace]);

  return (
    <>
      <section className={className}>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">
          Runtime actions · pilot
        </div>
        <div className="flex flex-wrap gap-2">
          <ActionButton tone="like" disabled={isLoading || pendingAction !== null} onClick={toggleLike}>
            <Heart className={`h-4 w-4 ${liked ? 'fill-current text-rose-600' : ''}`} />
            <span>{liked ? 'Нравится' : 'Нравится'}</span>
            <span className="text-xs text-slate-500">{likeCount}</span>
          </ActionButton>
          <ActionButton tone="save" disabled={isLoading || pendingAction !== null} onClick={toggleBookmark}>
            <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current text-sky-700' : ''}`} />
            <span>{bookmarked ? 'Сохранено' : 'Сохранить'}</span>
          </ActionButton>
          <ActionButton tone="share" disabled={isLoading || pendingAction !== null} onClick={openShareComposer}>
            <Share2 className="h-4 w-4" />
            <span>
              {pendingAction === 'share'
                ? WS2_COPY.saveForMyself.actionPending
                : sharedPostId
                  ? WS2_COPY.saveForMyself.alreadyInSpace
                  : WS2_COPY.saveForMyself.actionInSpace}
            </span>
          </ActionButton>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          {WS2_COPY.saveForMyself.helper}
        </p>
        {feedback ? (
          <div
            className={`mt-3 rounded-lg px-3 py-2 text-sm ${
              feedback.tone === 'success'
                ? 'bg-emerald-50 text-emerald-800'
                : feedback.tone === 'error'
                  ? 'bg-rose-50 text-rose-800'
                  : 'bg-sky-50 text-sky-800'
            }`}
          >
            <span>{feedback.message}</span>
            {feedback.href ? (
              <Link href={feedback.href} className="ml-2 font-medium underline underline-offset-2">
                Открыть ленту
              </Link>
            ) : null}
          </div>
        ) : null}
        </div>
      </section>
      <ShareToSpaceComposer
        isOpen={isComposerOpen}
        isSubmitting={pendingAction === 'share'}
        targetType={targetType}
        targetId={targetId}
        title={title}
        onClose={() => setIsComposerOpen(false)}
        onSubmit={(text) => createRepostWithCommentary(text)}
      />
    </>
  );
}
