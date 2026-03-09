'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, LayoutGrid, Rows3, Search, SlidersHorizontal, X } from 'lucide-react';
import { Chip } from '@go2asia/ui';
import { useListBlogPosts, type ContentBlogPostCardDto } from '@go2asia/sdk/blog';
import { PostCard } from '@/components/blog/PostCard';
import { getCategoryOrderIndex, slugifyCategory } from './categoryConfig';

type BlogViewMode = 'sections' | 'feed';

const ALL_FILTER = '__all__';

function humanizeSlug(raw: string | null | undefined): string {
  const value = (raw ?? '').trim();
  if (!value) return '';
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function humanizePostType(raw: string | null | undefined): string {
  switch ((raw ?? '').trim().toLowerCase()) {
    case 'longread':
      return 'Лонгрид';
    case 'note':
      return 'Заметка';
    case 'essay':
      return 'Эссе';
    case 'live':
      return 'Live';
    default:
      return raw?.trim() || 'Без формата';
  }
}

function mapPost(post: ContentBlogPostCardDto) {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    heroUrl: post.heroUrl,
    postType: post.postType ? humanizePostType(post.postType) : null,
    countrySlug: post.countrySlug,
    publishedAt: post.publishedAt,
    readingTimeMinutes: post.readingTimeMinutes,
    author: post.author,
    isEditorPick: post.isEditorPick,
    isFeatured: post.isFeatured,
    isPromoted: post.isPromoted,
  };
}

export function BlogClientWrapper() {
  const [qInput, setQInput] = useState('');
  const [q, setQ] = useState('');
  const [viewMode, setViewMode] = useState<BlogViewMode>('sections');
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_FILTER);
  const [selectedPostType, setSelectedPostType] = useState<string>(ALL_FILTER);
  const [selectedCountry, setSelectedCountry] = useState<string>(ALL_FILTER);

  useEffect(() => {
    const t = setTimeout(() => setQ(qInput.trim()), 250);
    return () => clearTimeout(t);
  }, [qInput]);

  const newest = useListBlogPosts({ sort: 'newest', limit: 96, q });
  const popular = useListBlogPosts({ sort: 'popular', limit: 16, q });

  const isLoading = newest.isLoading || popular.isLoading;
  const hasError = Boolean(newest.error || popular.error);

  const newestItems = newest.data?.items ?? [];

  const availableCategories = useMemo(() => {
    const map = new Map<string, number>();
    for (const post of newestItems) {
      const key = (post.category ?? '').trim();
      if (!key) continue;
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return [...map.entries()]
      .sort((a, b) => {
        const rankDiff = getCategoryOrderIndex(a[0]) - getCategoryOrderIndex(b[0]);
        if (rankDiff !== 0) return rankDiff;
        return b[1] - a[1] || a[0].localeCompare(b[0], 'ru');
      })
      .map(([value]) => value);
  }, [newestItems]);

  const availablePostTypes = useMemo(() => {
    const map = new Map<string, number>();
    for (const post of newestItems) {
      const key = (post.postType ?? '').trim();
      if (!key) continue;
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ru'))
      .map(([value]) => value);
  }, [newestItems]);

  const availableCountries = useMemo(() => {
    const map = new Map<string, number>();
    for (const post of newestItems) {
      const key = (post.countrySlug ?? '').trim();
      if (!key) continue;
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ru'))
      .map(([value]) => value);
  }, [newestItems]);

  const filteredNewest = useMemo(() => {
    return newestItems.filter((post) => {
      const matchesCategory = selectedCategory === ALL_FILTER || (post.category ?? '').trim() === selectedCategory;
      const matchesPostType = selectedPostType === ALL_FILTER || (post.postType ?? '').trim() === selectedPostType;
      const matchesCountry = selectedCountry === ALL_FILTER || (post.countrySlug ?? '').trim() === selectedCountry;
      return matchesCategory && matchesPostType && matchesCountry;
    });
  }, [newestItems, selectedCategory, selectedCountry, selectedPostType]);

  const sectionEntries = useMemo(() => {
    const groups = new Map<string, ContentBlogPostCardDto[]>();
    for (const post of filteredNewest) {
      const section = (post.category ?? '').trim();
      if (!section) continue;
      const items = groups.get(section) ?? [];
      items.push(post);
      groups.set(section, items);
    }
    return [...groups.entries()]
      .map(([title, items]) => ({ title, items }))
      .sort((a, b) => {
        const rankDiff = getCategoryOrderIndex(a.title) - getCategoryOrderIndex(b.title);
        if (rankDiff !== 0) return rankDiff;
        const aDate = new Date(a.items[0]?.publishedAt ?? 0).getTime();
        const bDate = new Date(b.items[0]?.publishedAt ?? 0).getTime();
        return bDate - aDate || b.items.length - a.items.length || a.title.localeCompare(b.title, 'ru');
      });
  }, [filteredNewest]);

  const activeFilterCount = [selectedCategory, selectedPostType, selectedCountry].filter((x) => x !== ALL_FILTER).length;

  const resetFilters = () => {
    setSelectedCategory(ALL_FILTER);
    setSelectedPostType(ALL_FILTER);
    setSelectedCountry(ALL_FILTER);
  };

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
              <div className="mt-1 text-xs text-white/60">Живой опыт и медиа о жизни в Юго-Восточной Азии</div>
            </div>
          </div>
        </div>
      </header>

      <section>
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={qInput}
                onChange={(e) => setQInput(e.target.value)}
                placeholder="Поиск по названию, содержанию, тегам..."
                className="w-full h-11 pl-9 pr-3 rounded-xl border border-slate-200 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-200/60 focus:border-sky-200"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Chip selected={viewMode === 'sections'} onClick={() => setViewMode('sections')} className="cursor-pointer">
              <span className="inline-flex items-center gap-2">
                <LayoutGrid size={14} />
                Рубрики
              </span>
            </Chip>
            <Chip selected={viewMode === 'feed'} onClick={() => setViewMode('feed')} className="cursor-pointer">
              <span className="inline-flex items-center gap-2">
                <Rows3 size={14} />
                Лента
              </span>
            </Chip>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setFiltersExpanded((value) => !value)}
              className="w-full px-4 py-3 flex items-center justify-between text-sm text-slate-700"
            >
              <span className="inline-flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-slate-400" />
                Фильтры
                {activeFilterCount > 0 ? (
                  <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-sky-100 text-sky-700 text-[11px] font-medium">
                    {activeFilterCount}
                  </span>
                ) : null}
              </span>
              {filtersExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
            </button>

            {filtersExpanded ? (
              <div className="px-4 pb-4 pt-1 space-y-4 border-t border-slate-100">
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-2">Рубрика</div>
                  <div className="flex flex-wrap gap-2">
                    <Chip selected={selectedCategory === ALL_FILTER} onClick={() => setSelectedCategory(ALL_FILTER)} className="cursor-pointer">
                      Все
                    </Chip>
                    {availableCategories.map((category) => (
                      <Chip
                        key={category}
                        selected={selectedCategory === category}
                        onClick={() => setSelectedCategory(category)}
                        className="cursor-pointer"
                      >
                        {category}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-500 mb-2">Формат</div>
                  <div className="flex flex-wrap gap-2">
                    <Chip selected={selectedPostType === ALL_FILTER} onClick={() => setSelectedPostType(ALL_FILTER)} className="cursor-pointer">
                      Все форматы
                    </Chip>
                    {availablePostTypes.map((postType) => (
                      <Chip
                        key={postType}
                        selected={selectedPostType === postType}
                        onClick={() => setSelectedPostType(postType)}
                        className="cursor-pointer"
                      >
                        {humanizePostType(postType)}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-500 mb-2">География</div>
                  <div className="flex flex-wrap gap-2">
                    <Chip selected={selectedCountry === ALL_FILTER} onClick={() => setSelectedCountry(ALL_FILTER)} className="cursor-pointer">
                      Все страны
                    </Chip>
                    {availableCountries.map((country) => (
                      <Chip
                        key={country}
                        selected={selectedCountry === country}
                        onClick={() => setSelectedCountry(country)}
                        className="cursor-pointer"
                      >
                        {humanizeSlug(country)}
                      </Chip>
                    ))}
                  </div>
                </div>

                {activeFilterCount > 0 ? (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
                  >
                    <X size={14} />
                    Сбросить фильтры
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {hasError ? (
        <section className="max-w-[1100px] mx-auto px-4 sm:px-6 py-10">
          <div className="bg-white border border-red-200 rounded-xl p-5 text-sm text-red-700">
            Не удалось загрузить публикации. Проверьте доступность API Gateway / Content Service.
          </div>
        </section>
      ) : null}

      {!hasError && viewMode === 'sections' && sectionEntries.length > 0 ? (
        <section className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 space-y-8">
          {sectionEntries.map((section) => (
            <div key={section.title}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-slate-900">{section.title}</h2>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-slate-400">{section.items.length} материалов</div>
                  <Link
                    href={`/blog/category/${slugifyCategory(section.title)}`}
                    className="text-xs font-medium text-sky-700 hover:text-sky-800"
                  >
                    Читать все
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                {section.items.slice(0, 6).map((post) => (
                  <PostCard key={post.id} post={mapPost(post)} />
                ))}
              </div>
            </div>
          ))}
        </section>
      ) : null}

      {!hasError && viewMode === 'feed' && filteredNewest.length > 0 ? (
        <section className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6">
          <div className="space-y-4">
            {filteredNewest.map((post) => (
              <div key={post.id}>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  {post.category ? (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                      {post.category}
                    </span>
                  ) : null}
                  {post.countrySlug ? (
                    <span className="inline-flex items-center rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-medium text-sky-700">
                      {humanizeSlug(post.countrySlug)}
                    </span>
                  ) : null}
                </div>
                <PostCard variant="horizontal" post={mapPost(post)} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {!hasError && !isLoading && filteredNewest.length === 0 ? (
        <section className="max-w-[1100px] mx-auto px-4 sm:px-6 py-10">
          <div className="bg-white border border-slate-200 rounded-xl p-5 text-sm text-slate-600">
            По выбранным фильтрам публикации не найдены.
          </div>
        </section>
      ) : null}

      {isLoading ? (
        <section className="max-w-[1100px] mx-auto px-4 sm:px-6 py-10">
          <div className="text-sm text-slate-500">Загрузка…</div>
        </section>
      ) : null}
    </div>
  );
}

