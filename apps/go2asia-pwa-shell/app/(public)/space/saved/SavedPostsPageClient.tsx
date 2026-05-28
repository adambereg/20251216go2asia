'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Bookmark, ExternalLink, Trash2 } from 'lucide-react';
import { customInstance, generated } from '@go2asia/sdk';
import { getBlogPostBySlug, type ContentBlogPostDetailDto } from '@go2asia/sdk/blog';
import { getEventById, getPlaceByIdOrSlug, type ContentEventDto, type ContentPlaceDto } from '@go2asia/sdk/content';
import { resolveMediaUrl } from '@go2asia/sdk/media';
import { SpaceLayout } from '@/components/space/Shared';
import { SpaceFeedCard } from '@/components/space/runtime/SpaceFeedCard';
import { getErrorStatus, isServiceUnavailableStatus } from '@/components/space/runtime/utils';

type SavedTargetType = 'space_post' | 'place' | 'event' | 'blog_post';
type SavedFilter = 'all' | SavedTargetType;

type SavedReactionRecord = {
  id: string;
  targetId: string;
  targetType: SavedTargetType;
  reactionType: 'bookmark';
  createdAt: string;
};

type ListMyReactionsResponse = {
  items: Array<{ reaction: SavedReactionRecord }>;
  nextCursor: string | null;
};

type SavedHydrationStatus = 'hydrated' | 'missing';

type SavedBaseItem = {
  reactionId: string;
  reactionCreatedAt: string;
  targetId: string;
  targetType: SavedTargetType;
  status: SavedHydrationStatus;
};

type SavedSpacePostItem = SavedBaseItem & {
  targetType: 'space_post';
  post: generated.SpacePostResponse | null;
};

type SavedPlaceItem = SavedBaseItem & {
  targetType: 'place';
  place: ContentPlaceDto | null;
};

type SavedEventItem = SavedBaseItem & {
  targetType: 'event';
  event: ContentEventDto | null;
};

type SavedBlogPostItem = SavedBaseItem & {
  targetType: 'blog_post';
  post: ContentBlogPostDetailDto | null;
};

type SavedItem = SavedSpacePostItem | SavedPlaceItem | SavedEventItem | SavedBlogPostItem;

const SAVED_TARGETS: Array<{ targetType: SavedTargetType; label: string; emptyLabel: string }> = [
  { targetType: 'space_post', label: 'Посты', emptyLabel: 'сохранённых постов Space' },
  { targetType: 'place', label: 'Места', emptyLabel: 'сохранённых мест' },
  { targetType: 'event', label: 'События', emptyLabel: 'сохранённых событий' },
  { targetType: 'blog_post', label: 'Блог', emptyLabel: 'сохранённых статей' },
];

const FILTERS: Array<{ value: SavedFilter; label: string }> = [
  { value: 'all', label: 'Все' },
  ...SAVED_TARGETS.map(({ targetType, label }) => ({ value: targetType, label })),
];

const TARGET_LABEL: Record<SavedTargetType, string> = {
  space_post: 'Пост Space',
  place: 'Место',
  event: 'Событие',
  blog_post: 'Блог',
};

function buildSavedMineUrl(targetType: SavedTargetType) {
  const params = new URLSearchParams({
    targetType,
    reactionType: 'bookmark',
    limit: '50',
  });
  return `/v1/reactions/mine?${params.toString()}`;
}

function formatDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function truncate(value: string | null | undefined, max = 180): string | null {
  const text = value?.replace(/\s+/g, ' ').trim();
  if (!text) return null;
  return text.length > max ? `${text.slice(0, max).trim()}...` : text;
}

function blogSlugFromTargetId(targetId: string): string {
  return targetId.replace(/^blog_/, '');
}

async function fetchSavedReactions(targetType: SavedTargetType): Promise<SavedReactionRecord[]> {
  const response = await customInstance<ListMyReactionsResponse>({ method: 'GET' }, buildSavedMineUrl(targetType));
  return response.items.map(({ reaction }) => reaction);
}

async function hydrateSavedReaction(reaction: SavedReactionRecord): Promise<SavedItem> {
  const base = {
    reactionId: reaction.id,
    reactionCreatedAt: reaction.createdAt,
    targetId: reaction.targetId,
    targetType: reaction.targetType,
  };

  try {
    if (reaction.targetType === 'space_post') {
      const post = await customInstance<generated.SpacePostResponse>(
        { method: 'GET' },
        `/v1/space/posts/${encodeURIComponent(reaction.targetId)}`
      );
      return { ...base, targetType: 'space_post', status: 'hydrated', post };
    }
    if (reaction.targetType === 'place') {
      const place = await getPlaceByIdOrSlug(reaction.targetId);
      return { ...base, targetType: 'place', status: 'hydrated', place };
    }
    if (reaction.targetType === 'event') {
      const event = await getEventById(reaction.targetId);
      return { ...base, targetType: 'event', status: 'hydrated', event };
    }
    const post = await getBlogPostBySlug(blogSlugFromTargetId(reaction.targetId));
    return { ...base, targetType: 'blog_post', status: 'hydrated', post };
  } catch {
    if (reaction.targetType === 'space_post') return { ...base, targetType: 'space_post', status: 'missing', post: null };
    if (reaction.targetType === 'place') return { ...base, targetType: 'place', status: 'missing', place: null };
    if (reaction.targetType === 'event') return { ...base, targetType: 'event', status: 'missing', event: null };
    return { ...base, targetType: 'blog_post', status: 'missing', post: null };
  }
}

function getSavedHref(item: SavedItem): string {
  if (item.targetType === 'space_post') return `/space/feed?highlight=${encodeURIComponent(item.targetId)}`;
  if (item.targetType === 'place') return `/atlas/places/${encodeURIComponent(item.place?.slug ?? item.targetId)}`;
  if (item.targetType === 'event') return `/pulse/events/${encodeURIComponent(item.event?.slug ?? item.targetId)}`;
  return `/blog/${encodeURIComponent(item.post?.slug ?? blogSlugFromTargetId(item.targetId))}`;
}

function getSavedTitle(item: SavedItem): string {
  if (item.status === 'missing') return `Сохранённый объект недоступен (${item.targetId})`;
  if (item.targetType === 'space_post') {
    const text = truncate(item.post?.text, 90);
    return text ?? `Пост ${item.post?.author.displayName ?? 'Space'}`;
  }
  if (item.targetType === 'place') return item.place?.name ?? item.targetId;
  if (item.targetType === 'event') return item.event?.title ?? item.targetId;
  return item.post?.title ?? item.targetId;
}

function getSavedDescription(item: SavedItem): string | null {
  if (item.status === 'missing') {
    return 'Bookmark fact сохранён в Reactions, но source object сейчас не удалось гидрировать. Это не удаляет сохранение.';
  }
  if (item.targetType === 'space_post') return truncate(item.post?.text, 180) ?? 'Сохранённый Space post.';
  if (item.targetType === 'place') {
    const location = [item.place?.city, item.place?.country].filter(Boolean).join(', ');
    return truncate(item.place?.description) ?? (location || null);
  }
  if (item.targetType === 'event') return truncate(item.event?.shortDescription) ?? item.event?.location ?? null;
  return truncate(item.post?.excerpt ?? item.post?.subtitle);
}

function getSavedMeta(item: SavedItem): string[] {
  if (item.status === 'missing') return [`targetId: ${item.targetId}`];
  if (item.targetType === 'space_post') return [item.post?.author.displayName ? `Автор: ${item.post.author.displayName}` : 'Space feed'];
  if (item.targetType === 'place') {
    return [item.place?.category, [item.place?.city, item.place?.country].filter(Boolean).join(', '), item.place?.priceLevel].filter(
      (value): value is string => Boolean(value)
    );
  }
  if (item.targetType === 'event') {
    return [
      formatDate(item.event?.startDate),
      [item.event?.cityName, item.event?.countryName].filter(Boolean).join(', '),
      item.event?.category,
      item.event?.isFree ? 'Бесплатно' : null,
    ].filter((value): value is string => Boolean(value));
  }
  return [
    item.post?.author?.displayName ? `Автор: ${item.post.author.displayName}` : null,
    formatDate(item.post?.publishedAt),
    item.post?.readingTimeMinutes ? `${item.post.readingTimeMinutes} мин` : null,
  ].filter((value): value is string => Boolean(value));
}

function getSavedImage(item: SavedItem): string | null {
  if (item.status === 'missing') return null;
  if (item.targetType === 'space_post') return null;
  if (item.targetType === 'place') return item.place?.heroImage ?? item.place?.photos?.[0] ?? null;
  if (item.targetType === 'event') return resolveMediaUrl(item.event?.heroMediaKey);
  return item.post?.heroUrl ?? null;
}

function countByTarget(items: SavedItem[]): Record<SavedTargetType, number> {
  return items.reduce(
    (acc, item) => {
      acc[item.targetType] += 1;
      return acc;
    },
    { space_post: 0, place: 0, event: 0, blog_post: 0 } as Record<SavedTargetType, number>
  );
}

function SavedObjectCard({
  item,
  pending,
  onRemove,
}: {
  item: SavedItem;
  pending: boolean;
  onRemove: (item: SavedItem) => void;
}) {
  const image = getSavedImage(item);
  const meta = getSavedMeta(item);
  const href = getSavedHref(item);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row">
        {image ? (
          <Link
            href={href}
            aria-label={getSavedTitle(item)}
            className="block h-32 w-full flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 bg-cover bg-center md:w-44"
            style={{ backgroundImage: `url(${image})` }}
          >
            <span className="sr-only">{getSavedTitle(item)}</span>
          </Link>
        ) : (
          <div className="flex h-32 w-full flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-400 md:w-44">
            {TARGET_LABEL[item.targetType]}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-800">
              {TARGET_LABEL[item.targetType]}
            </span>
            {item.status === 'missing' ? (
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">
                source недоступен
              </span>
            ) : null}
            <span className="text-xs text-slate-500">Сохранено {formatDate(item.reactionCreatedAt) ?? 'недавно'}</span>
          </div>
          <Link href={href} className="mt-2 block text-base font-semibold text-slate-900 hover:text-sky-700">
            {getSavedTitle(item)}
          </Link>
          {getSavedDescription(item) ? <p className="mt-2 text-sm leading-6 text-slate-600">{getSavedDescription(item)}</p> : null}
          {meta.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
              {meta.map((value) => (
                <span key={value} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">
                  {value}
                </span>
              ))}
            </div>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={href}
              className="inline-flex items-center gap-1.5 rounded-md border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-800 hover:bg-sky-100"
            >
              Открыть <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              disabled={pending}
              onClick={() => onRemove(item)}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {pending ? 'Удаляем...' : 'Убрать из сохранённых'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function SavedSpacePostCard({
  item,
  pending,
  onRemove,
}: {
  item: SavedSpacePostItem;
  pending: boolean;
  onRemove: (item: SavedItem) => void;
}) {
  if (!item.post) {
    return <SavedObjectCard item={item} pending={pending} onRemove={onRemove} />;
  }

  const feedItem: generated.SpaceFeedItem = {
    id: `saved_${item.reactionId}`,
    createdAt: item.reactionCreatedAt,
    reason: 'author_post',
    post: item.post,
  };

  return (
    <div className="space-y-2">
      <SpaceFeedCard item={feedItem} showReason={false} showGroupSignal />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">Сохранено в Space</span>
          <span>Сохранено {formatDate(item.reactionCreatedAt) ?? 'недавно'}</span>
        </div>
        <button
          type="button"
          disabled={pending}
          onClick={() => onRemove(item)}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Trash2 className="h-3.5 w-3.5" />
          {pending ? 'Удаляем...' : 'Убрать из сохранённых'}
        </button>
      </div>
    </div>
  );
}

function SavedCard({
  item,
  pending,
  onRemove,
}: {
  item: SavedItem;
  pending: boolean;
  onRemove: (item: SavedItem) => void;
}) {
  if (item.targetType === 'space_post') {
    return <SavedSpacePostCard item={item} pending={pending} onRemove={onRemove} />;
  }
  return <SavedObjectCard item={item} pending={pending} onRemove={onRemove} />;
}

export function SavedPostsPageClient() {
  const { isLoaded, isSignedIn } = useUser();
  const [items, setItems] = useState<SavedItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<SavedFilter>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authRequired, setAuthRequired] = useState(false);
  const [runtimeUnavailable, setRuntimeUnavailable] = useState(false);
  const [pendingReactionIds, setPendingReactionIds] = useState<Record<string, boolean>>({});

  const loadSavedItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAuthRequired(false);
    setRuntimeUnavailable(false);

    try {
      const reactionGroups = await Promise.all(SAVED_TARGETS.map(({ targetType }) => fetchSavedReactions(targetType)));
      const reactions = reactionGroups
        .flat()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const hydrated = await Promise.all(reactions.map((reaction) => hydrateSavedReaction(reaction)));
      setItems(hydrated);
    } catch (loadError) {
      const status = getErrorStatus(loadError);
      if (status === 401 || status === 403) {
        setAuthRequired(true);
      } else if (isServiceUnavailableStatus(status)) {
        setRuntimeUnavailable(true);
      } else {
        setError(`Не удалось загрузить сохранённые материалы (${status ?? 'unknown'}).`);
      }
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      setIsLoading(true);
      setAuthRequired(false);
      return;
    }
    if (!isSignedIn) {
      setIsLoading(false);
      setAuthRequired(true);
      setRuntimeUnavailable(false);
      setError(null);
      setItems([]);
      return;
    }
    void loadSavedItems();
  }, [isLoaded, isSignedIn, loadSavedItems]);

  const counts = useMemo(() => countByTarget(items), [items]);
  const visibleItems = useMemo(
    () => (activeFilter === 'all' ? items : items.filter((item) => item.targetType === activeFilter)),
    [activeFilter, items]
  );
  const missingCount = items.filter((item) => item.status === 'missing').length;

  const removeSaved = useCallback(async (item: SavedItem) => {
    setPendingReactionIds((prev) => ({ ...prev, [item.reactionId]: true }));
    try {
      await customInstance<{ removed: boolean }>({ method: 'DELETE' }, `/v1/reactions/${encodeURIComponent(item.reactionId)}`);
      setItems((prev) => prev.filter((candidate) => candidate.reactionId !== item.reactionId));
      setError(null);
    } catch (removeError) {
      setError(`Не удалось убрать материал из сохранённых (${getErrorStatus(removeError) ?? 'unknown'}).`);
    } finally {
      setPendingReactionIds((prev) => {
        const next = { ...prev };
        delete next[item.reactionId];
        return next;
      });
    }
  }, []);

  return (
    <SpaceLayout>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="mb-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Сохранённое</h1>
              <p className="mt-2 text-sm text-slate-600">
                Пилотная поддержка сохранённых материалов: Space posts, места, события и статьи. Bookmark facts остаются
                в Reactions; эта вкладка только отображает и гидрирует их.
              </p>
            </div>
            {items.length > 0 ? (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                {items.length} сохранено
              </span>
            ) : null}
          </div>
        </header>

        {!isLoading && !authRequired && !runtimeUnavailable ? (
          <div className="mb-6 rounded-xl border border-sky-100 bg-sky-50 p-4 text-sm text-sky-900">
            <div className="font-medium">Bounded saved-items pilot</div>
            <p className="mt-2 text-xs text-sky-800">
              Здесь нет RF/Rielt/Quest/local saves и нет economy/Connect сигналов. Save не создаёт propagation и не
              заменяет Share-to-Space.
            </p>
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Загружаем сохранённые материалы...
          </div>
        ) : null}

        {!isLoading && authRequired ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Для раздела сохранённых нужна авторизация.
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <Link href="/sign-in?redirect_url=%2Fspace%2Fsaved" className="font-medium underline underline-offset-2">
                Войти
              </Link>
              <Link href="/space/feed" className="font-medium underline underline-offset-2">
                Открыть ленту
              </Link>
            </div>
          </div>
        ) : null}

        {!isLoading && !authRequired && runtimeUnavailable ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Сохранённые материалы временно недоступны в этом окружении. Как только сервис вернётся, список снова
            появится здесь.
          </div>
        ) : null}

        {!isLoading && !authRequired && !runtimeUnavailable && error ? (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
            <div className="mt-3">
              <button
                type="button"
                onClick={() => void loadSavedItems()}
                className="rounded-md border border-rose-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-800 hover:bg-rose-100"
              >
                Повторить
              </button>
            </div>
          </div>
        ) : null}

        {!isLoading && !authRequired && !runtimeUnavailable && items.length > 0 ? (
          <>
            <div className="mb-5 flex flex-wrap gap-2">
              {FILTERS.map((filter) => {
                const count = filter.value === 'all' ? items.length : counts[filter.value];
                const active = activeFilter === filter.value;
                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setActiveFilter(filter.value)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      active
                        ? 'bg-sky-700 text-white'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {filter.label} · {count}
                  </button>
                );
              })}
            </div>

            {missingCount > 0 ? (
              <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                {missingCount} сохранённых объектов сейчас не удалось гидрировать. Bookmark facts остаются в Reactions.
              </div>
            ) : null}

            {visibleItems.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                В этом фильтре пока нет сохранённых материалов.
              </div>
            ) : (
              <div className="space-y-4">
                {visibleItems.map((item) => (
                  <SavedCard
                    key={item.reactionId}
                    item={item}
                    pending={Boolean(pendingReactionIds[item.reactionId])}
                    onRemove={removeSaved}
                  />
                ))}
              </div>
            )}
          </>
        ) : null}

        {!isLoading && !authRequired && !runtimeUnavailable && !error && items.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
            <div className="flex items-center gap-2 font-medium text-slate-900">
              <Bookmark className="h-4 w-4" />
              Пока нет сохранённых материалов
            </div>
            <p className="mt-2">
              Сохраните место, событие, статью или Space post. RF favorites, Rielt listing saves и Quest saves остаются
              отдельными deferred surfaces.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <Link href="/atlas" className="rounded-md border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50">
                Открыть Atlas
              </Link>
              <Link href="/pulse" className="rounded-md border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50">
                Открыть Pulse
              </Link>
              <Link href="/blog" className="rounded-md border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50">
                Открыть Blog
              </Link>
              <Link href="/space/feed" className="rounded-md border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50">
                Открыть Space feed
              </Link>
            </div>
          </div>
        ) : null}

        {!isLoading && !authRequired && !runtimeUnavailable && items.length > 0 ? (
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
            <div className="font-medium text-slate-800">Что намеренно не входит в F</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <span>RF favorites</span>
              <span>Rielt listings</span>
              <span>Quest saves</span>
              <span>city/country/guide</span>
              <span>Connect writes</span>
              <span>economy hooks</span>
            </div>
          </div>
        ) : null}
      </section>
    </SpaceLayout>
  );
}
