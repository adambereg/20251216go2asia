'use client';

import { Search, SlidersHorizontal, BookOpen, TrendingUp, Sparkles } from 'lucide-react';
import { Chip } from '@go2asia/ui';
import { useEffect, useMemo, useState } from 'react';
import { useListBlogPosts } from '@go2asia/sdk/blog';
import { PostCard } from '@/components/blog/PostCard';

function formatDate(dateString: string) {
  const d = new Date(dateString);
  if (!Number.isFinite(d.getTime())) return dateString;
  const now = new Date();
  const startOfDay = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDays = Math.round((startOfDay(now) - startOfDay(d)) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Сегодня';
  if (diffDays === 1) return 'Вчера';
  if (diffDays > 1 && diffDays < 7) return `${diffDays} дня назад`;

  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}

export function BlogClientWrapper() {
  const [qInput, setQInput] = useState('');
  const [q, setQ] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setQ(qInput.trim()), 250);
    return () => clearTimeout(t);
  }, [qInput]);

  const newest = useListBlogPosts({ sort: 'newest', limit: 24, q });
  const popular = useListBlogPosts({ sort: 'popular', limit: 12, q });

  const isLoading = newest.isLoading || popular.isLoading;
  const hasError = Boolean(newest.error || popular.error);

  const editorialPicks = useMemo(() => {
    const items = newest.data?.items ?? [];
    return items.filter((x) => x.isEditorPick).slice(0, 4);
  }, [newest.data?.items]);

  const fresh = useMemo(() => {
    const items = newest.data?.items ?? [];
    return items.slice(0, 12);
  }, [newest.data?.items]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="pt-6 pb-4">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
          <div
            className="rounded-2xl overflow-hidden shadow-[0_14px_40px_rgba(15,23,42,0.14)] ring-1 ring-slate-900/10"
            style={{
              background:
                'radial-gradient(700px 220px at 70% 0%, rgba(56,189,248,0.18), transparent 60%), radial-gradient(500px 220px at 20% 20%, rgba(167,139,250,0.18), transparent 60%), #0b1220',
            }}
          >
            <div className="px-6 sm:px-8 py-7 sm:py-8 text-center">
              <div className="inline-flex items-center gap-2 text-white/95 font-semibold tracking-tight">
                <BookOpen size={18} />
                <span className="text-lg">Blog Asia</span>
              </div>
              <div className="mt-1 text-xs text-white/60">
                Живой опыт и медиа о жизни в Юго-Восточной Азии
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search + tags */}
      <section>
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={qInput}
                onChange={(e) => setQInput(e.target.value)}
                placeholder="Поиск по названию, автору, тегам..."
                className="w-full h-11 pl-9 pr-3 rounded-xl border border-slate-200 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-200/60 focus:border-sky-200"
              />
            </div>
          </div>
          <button
            type="button"
            className="w-full h-11 rounded-xl border border-slate-200 bg-white shadow-sm px-3 flex items-center justify-between text-sm text-slate-600 hover:border-slate-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-slate-400" />
              Фильтры
            </span>
            <span className="text-slate-400">▾</span>
          </button>
        </div>
      </section>

      {hasError && (
        <section className="max-w-[1100px] mx-auto px-4 sm:px-6 py-10">
          <div className="bg-white border border-red-200 rounded-xl p-5 text-sm text-red-700">
            Не удалось загрузить публикации. Проверьте доступность API Gateway / Content Service.
          </div>
        </section>
      )}

      {/* Fresh */}
      {fresh.length > 0 && (
        <section className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900 inline-flex items-center gap-2">
              <Sparkles size={16} className="text-sky-600" />
              Свежие публикации
            </h2>
            <div className="text-xs text-slate-400">{fresh.length} материалов</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {fresh.map((p) => (
              <PostCard
                key={p.id}
                post={{
                  id: p.id,
                  slug: p.slug,
                  title: p.title,
                  excerpt: p.excerpt,
                  heroUrl: p.heroUrl,
                  postType: p.postType,
                  countrySlug: p.countrySlug,
                  publishedAt: p.publishedAt,
                  readingTimeMinutes: p.readingTimeMinutes,
                  author: p.author,
                  isEditorPick: p.isEditorPick,
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Popular */}
      {(popular.data?.items?.length ?? 0) > 0 && (
        <section className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8">
          <h2 className="text-base font-semibold text-slate-900 mb-4 inline-flex items-center gap-2">
            <TrendingUp size={16} className="text-amber-500" />
            Популярное
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
            {(popular.data?.items ?? []).slice(0, 12).map((p) => (
              <PostCard
                key={p.id}
                variant="small"
                className="min-w-[220px] sm:min-w-[240px] lg:min-w-[260px] snap-start"
                hideMeta
                post={{
                  id: p.id,
                  slug: p.slug,
                  title: p.title,
                  excerpt: p.excerpt,
                  heroUrl: p.heroUrl,
                  postType: p.postType,
                  countrySlug: p.countrySlug,
                  publishedAt: p.publishedAt,
                  readingTimeMinutes: p.readingTimeMinutes,
                  author: p.author,
                  isEditorPick: p.isEditorPick,
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Recommended */}
      {editorialPicks.length > 0 && (
        <section className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8">
          <h2 className="text-base font-semibold text-slate-900 mb-4 inline-flex items-center gap-2">
            <Sparkles size={16} className="text-emerald-500" />
            Рекомендуем к прочтению
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
            {editorialPicks.slice(0, 6).map((p) => (
              <PostCard
                key={p.id}
                variant="mini"
                post={{
                  id: p.id,
                  slug: p.slug,
                  title: p.title,
                  excerpt: p.excerpt,
                  heroUrl: p.heroUrl,
                  postType: p.postType,
                  countrySlug: p.countrySlug,
                  publishedAt: p.publishedAt,
                  readingTimeMinutes: p.readingTimeMinutes,
                  author: p.author,
                  isEditorPick: p.isEditorPick,
                }}
              />
            ))}
          </div>
        </section>
      )}

      {isLoading && (
        <section className="max-w-[1100px] mx-auto px-4 sm:px-6 py-10">
          <div className="text-sm text-slate-500">Загрузка…</div>
        </section>
      )}
    </div>
  );
}

