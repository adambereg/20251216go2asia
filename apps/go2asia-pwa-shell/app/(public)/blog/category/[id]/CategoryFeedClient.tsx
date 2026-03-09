'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { listBlogPosts, type ContentBlogPostCardDto } from '@go2asia/sdk/blog';
import { PostCard } from '@/components/blog/PostCard';

type Props = {
  category: string;
  initialItems: ContentBlogPostCardDto[];
  initialCursor: string | null;
};

const PAGE_SIZE = 12;

function mapPost(post: ContentBlogPostCardDto) {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    heroUrl: post.heroUrl,
    postType: post.postType,
    countrySlug: post.countrySlug,
    publishedAt: post.publishedAt,
    readingTimeMinutes: post.readingTimeMinutes,
    author: post.author,
    isEditorPick: post.isEditorPick,
    isFeatured: post.isFeatured,
    isPromoted: post.isPromoted,
  };
}

export function CategoryFeedClient({ category, initialItems, initialCursor }: Props) {
  const [items, setItems] = useState(initialItems);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [hasMore, setHasMore] = useState(Boolean(initialCursor));
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setItems(initialItems);
    setCursor(initialCursor);
    setHasMore(Boolean(initialCursor));
    setLoadingMore(false);
  }, [initialCursor, initialItems, category]);

  const loadMore = useCallback(async () => {
    if (!hasMore || !cursor || loadingMore) return;

    setLoadingMore(true);
    try {
      const nextPage = await listBlogPosts({
        sort: 'newest',
        limit: PAGE_SIZE,
        category,
        cursor,
      });

      setItems((prev) => {
        const seen = new Set(prev.map((item) => item.id));
        const merged = [...prev];
        for (const item of nextPage.items) {
          if (!seen.has(item.id)) {
            merged.push(item);
            seen.add(item.id);
          }
        }
        return merged;
      });
      setCursor(nextPage.nextCursor ?? null);
      setHasMore(Boolean(nextPage.nextCursor));
    } finally {
      setLoadingMore(false);
    }
  }, [category, cursor, hasMore, loadingMore]);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !hasMore || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void loadMore();
      },
      { rootMargin: '300px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadMore, loadingMore, items.length]);

  const counterLabel = useMemo(() => `${items.length} материалов`, [items.length]);

  return (
    <section className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <nav className="text-sm text-slate-500 mb-2">
            <Link href="/blog" className="hover:text-sky-700">
              Blog Asia
            </Link>{' '}
            / <span className="text-slate-900">{category}</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900">{category}</h1>
        </div>
        <div className="text-sm text-slate-500 whitespace-nowrap">{counterLabel}</div>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {items.map((post) => (
            <PostCard key={post.id} post={mapPost(post)} />
          ))}
        </div>
      ) : (
        <div className="text-center text-slate-500 py-8">В рубрике пока нет публикаций.</div>
      )}

      <div ref={loadMoreRef} className="py-6 text-center text-sm text-slate-500">
        {loadingMore ? 'Загружаем ещё публикации…' : hasMore ? 'Прокрутите вниз, чтобы загрузить ещё' : 'Больше публикаций нет'}
      </div>

      <div className="mt-2">
        <Link href="/blog" className="text-sm font-medium text-sky-700 hover:text-sky-800">
          ← Вернуться ко всем рубрикам
        </Link>
      </div>
    </section>
  );
}
