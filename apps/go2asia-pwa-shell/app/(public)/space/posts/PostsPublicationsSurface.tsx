'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { customInstance, generated } from '@go2asia/sdk';
import { formatRepostTargetLabel, formatVisibilityLabel, resolveReferenceHref } from '@/components/space/runtime/utils';
import { getRepostCtaLabel, hydratePilotRepostPreview, isPilotRepostTargetType } from '@/components/space/runtime/repostPreview';
import { getPrivateNoteText, isPrivateRepostIntentPost } from '@/modules/space/retentionIntent';
import { WS2_COPY } from '@/modules/space/ws2Copy';
import { PostsPublicationCard } from './PostsPublicationCard';

type PostsPublicationsSurfaceProps = {
  userId: string;
  isOwnerView: boolean;
  retentionPostId?: string | null;
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

function toFeedItem(post: generated.SpacePostResponse): generated.SpaceFeedItem {
  return {
    id: post.id,
    reason: post.postType === 'repost' ? 'repost' : post.groupId ? 'group_post' : 'author_post',
    post,
    createdAt: post.publishedAt,
  };
}

function OwnerRetentionFocusCard({ post }: { post: generated.SpacePostResponse }) {
  const [preview, setPreview] = useState<generated.SpaceResolvedRepostPreview | null>(post.repost?.resolvedPreview ?? null);
  const [noteText, setNoteText] = useState(getPrivateNoteText(post) ?? '');
  const [draftNoteText, setDraftNoteText] = useState(getPrivateNoteText(post) ?? '');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [noteFeedback, setNoteFeedback] = useState<{ tone: 'error' | 'success'; message: string } | null>(null);
  const reference = post.repost ? resolveReferenceHref(post.repost.targetType, post.repost.targetId) : null;

  useEffect(() => {
    let cancelled = false;
    const repost = post.repost;
    setPreview(repost?.resolvedPreview ?? null);

    if (!repost || repost.resolvedPreview?.title || !isPilotRepostTargetType(repost.targetType)) {
      return () => {
        cancelled = true;
      };
    }

    void hydratePilotRepostPreview(repost).then((value) => {
      if (!cancelled) setPreview(value);
    });

    return () => {
      cancelled = true;
    };
  }, [post.repost]);

  useEffect(() => {
    const nextNoteText = getPrivateNoteText(post) ?? '';
    setNoteText(nextNoteText);
    setDraftNoteText(nextNoteText);
    setIsEditorOpen(false);
    setNoteFeedback(null);
  }, [post.id, post.text, post.visibility, post.postType]);

  async function savePrivateNote(): Promise<void> {
    setIsSavingNote(true);
    setNoteFeedback(null);
    const normalizedDraft = draftNoteText.trim();

    try {
      const response = await customInstance<generated.SpacePostResponse>(
        {
          method: 'PATCH',
          body: JSON.stringify({
            text: normalizedDraft.length > 0 ? normalizedDraft : null,
          } as { text: string | null }),
        },
        `/v1/space/posts/${encodeURIComponent(post.id)}`
      );
      const nextNoteText = getPrivateNoteText(response) ?? '';
      setNoteText(nextNoteText);
      setDraftNoteText(nextNoteText);
      setIsEditorOpen(false);
      setNoteFeedback({
        tone: 'success',
        message: nextNoteText.length > 0 ? 'Личная заметка сохранена.' : 'Личная заметка очищена.',
      });
    } catch {
      setNoteFeedback({
        tone: 'error',
        message: 'Не удалось сохранить личную заметку. Попробуйте ещё раз.',
      });
    } finally {
      setIsSavingNote(false);
    }
  }

  if (!post.repost) return null;

  return (
    <article className="mb-6 rounded-xl border border-sky-200 bg-sky-50 p-5">
      <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium">
        <span className="rounded-full border border-sky-200 bg-white px-2.5 py-1 text-sky-800">
          Личный контекст
        </span>
        <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-600">
          {formatVisibilityLabel(post.visibility)}
        </span>
        <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-600">
          {formatRepostTargetLabel(post.repost.targetType)}
        </span>
      </div>

      <h2 className="mt-3 text-base font-semibold text-slate-900">
        {preview?.title ?? `Сохранённый контекст: ${post.repost.targetId}`}
      </h2>
      {preview?.subtitle ? <p className="mt-2 text-sm leading-6 text-slate-600">{preview.subtitle}</p> : null}

      <div className="mt-4 rounded-lg border border-sky-100 bg-white p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-sky-800">Личная заметка</div>
            <p className="mt-1 text-xs text-slate-500">
              Видна только вам и остаётся вторичной к сохранённому контексту.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setNoteFeedback(null);
              setIsEditorOpen((current) => !current);
              setDraftNoteText(noteText);
            }}
            className="rounded-md border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-800 hover:bg-sky-100"
          >
            {noteText.length > 0 ? 'Редактировать' : 'Добавить'}
          </button>
        </div>

        {noteText.length > 0 && !isEditorOpen ? (
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-800">{noteText}</p>
        ) : null}

        {noteText.length === 0 && !isEditorOpen ? (
          <p className="mt-3 text-sm text-slate-500">Личная заметка пока не добавлена.</p>
        ) : null}

        {isEditorOpen ? (
          <div className="mt-3 space-y-2">
            <textarea
              value={draftNoteText}
              onChange={(event) => setDraftNoteText(event.target.value)}
              maxLength={5000}
              rows={3}
              disabled={isSavingNote}
              placeholder="Добавьте личную заметку к сохранённому контексту"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-sky-300 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
            <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
              <span>{draftNoteText.length}/5000</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditorOpen(false);
                    setDraftNoteText(noteText);
                  }}
                  disabled={isSavingNote}
                  className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={() => void savePrivateNote()}
                  disabled={isSavingNote}
                  className="rounded-md border border-sky-200 bg-sky-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSavingNote ? 'Сохраняем...' : 'Сохранить'}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {noteFeedback ? (
          <div
            className={`mt-3 rounded-md px-2.5 py-1.5 text-xs ${
              noteFeedback.tone === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
            }`}
          >
            {noteFeedback.message}
          </div>
        ) : null}
      </div>
      <p className="mt-2 text-xs text-slate-500">ID личного контекста: {post.id}</p>

      {reference?.href ? (
        <div className="mt-4">
          <Link
            href={reference.href}
            className="inline-flex items-center rounded-md border border-sky-200 bg-white px-3 py-1.5 text-xs font-medium text-sky-800 hover:bg-sky-100"
          >
            {getRepostCtaLabel(post.repost.targetType)}
          </Link>
        </div>
      ) : null}
    </article>
  );
}

function getSurfaceCopy(
  isOwnerView: boolean,
  profile: generated.SpaceProfileResponse | null
) {
  if (isOwnerView) {
    return {
      title: 'Авторские публикации',
      subtitle: WS2_COPY.surfaces.publicationsSubtitle,
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
  retentionPostId = null,
}: PostsPublicationsSurfaceProps) {
  const [profile, setProfile] = useState<generated.SpaceProfileResponse | null>(null);
  const [feed, setFeed] = useState<generated.SpaceFeedResponse | null>(null);
  const [focusedRetentionPost, setFocusedRetentionPost] = useState<generated.SpacePostResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const shouldLoadFocusedRetention = Boolean(isOwnerView && retentionPostId);
        const [profileResponse, feedResponse, retentionResponse] = await Promise.all([
          customInstance<generated.SpaceProfileResponse>(
            { method: 'GET' },
            `/v1/space/profiles/${encodeURIComponent(userId)}`
          ),
          customInstance<generated.SpaceFeedResponse>(
            { method: 'GET' },
            getProfileFeedUrl(userId)
          ),
          shouldLoadFocusedRetention
            ? customInstance<generated.SpacePostResponse>(
                { method: 'GET' },
                `/v1/space/posts/${encodeURIComponent(retentionPostId!)}`
              ).catch(() => null)
            : Promise.resolve(null),
        ]);

        if (cancelled) return;
        setProfile(profileResponse);
        setFeed(feedResponse);
        setFocusedRetentionPost(
          retentionResponse && isPrivateRepostIntentPost(retentionResponse) ? retentionResponse : null
        );
      } catch (loadError) {
        if (cancelled) return;
        setProfile(null);
        setFeed(null);
        setFocusedRetentionPost(null);
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
  }, [isOwnerView, retentionPostId, userId]);

  const items = feed?.items ?? [];
  const publicationItems = useMemo(
    () => items.filter((item) => !isPrivateRepostIntentPost(item.post)),
    [items]
  );
  const focusedRetentionItem = focusedRetentionPost ? toFeedItem(focusedRetentionPost) : null;
  const summary = useMemo(() => {
    const authored = publicationItems.filter((item) => item.post.postType === 'post').length;
    const reposts = publicationItems.filter((item) => item.post.postType === 'repost').length;
    const grouped = publicationItems.filter((item) => Boolean(item.post.groupId)).length;

    return {
      total: publicationItems.length,
      authored,
      reposts,
      grouped,
    };
  }, [publicationItems]);

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
                {WS2_COPY.legacy.summaryChip}: {summary.reposts}
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
        {!isLoading && !error && focusedRetentionItem && (
          <OwnerRetentionFocusCard post={focusedRetentionItem.post} />
        )}

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

        {!isLoading && !error && publicationItems.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-base font-semibold text-slate-900">Пока здесь нет публикаций</h2>
            <p className="mt-2 text-sm text-slate-600">
              {WS2_COPY.surfaces.publicationsEmpty}
            </p>
          </div>
        )}

        {!isLoading && !error && publicationItems.length > 0 && (
          <div className="space-y-4">
            {publicationItems.map((item) => (
              <PostsPublicationCard key={item.id} item={item} isOwnerView={isOwnerView} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
