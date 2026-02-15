'use client';

import Link from 'next/link';
import { Card, CardContent, Chip, Skeleton, SkeletonCard, Button } from '@go2asia/ui';
import { ModuleHero } from '@/components/modules';
import { Globe, Clock, X, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { AtlasMainNav } from '@/modules/atlas';
import { AtlasSearchBar } from '@/modules/atlas';
import { useGetGuides } from '@go2asia/sdk/guides';
import { useGetCities, useGetCountries } from '@go2asia/sdk/atlas';
import { useMemo, useCallback, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getDataSource } from '@/mocks/dto';
import { mockRepo } from '@/mocks/repo';

const INITIAL_LIMIT = 24;
const LOAD_MORE_STEP = 24;
const MAX_LIMIT = 500; // API max limit

type GuideChipKey =
  | 'all'
  | 'routes'
  | 'practice_docs'
  | 'living'
  | 'food_culture'
  | 'place_collections'
  | 'seasonality'
  | 'safety';

type SortOption = 'new' | 'updated' | 'popular';

const GUIDE_CHIPS: Array<{ key: GuideChipKey; label: string }> = [
  { key: 'all', label: 'Все' },
  { key: 'routes', label: 'Маршруты и планы' },
  { key: 'practice_docs', label: 'Практика и документы' },
  { key: 'living', label: 'Жизнь на месте' },
  { key: 'food_culture', label: 'Еда / культура' },
  { key: 'place_collections', label: 'Подборки мест' },
  { key: 'seasonality', label: 'Сезонность' },
  { key: 'safety', label: 'Безопасность' },
];

function chipToApi(chip: GuideChipKey): { guideTypes?: string[]; tagsPreset?: string[] } {
  switch (chip) {
    case 'routes':
      return { guideTypes: ['route'] };
    case 'practice_docs':
      return { guideTypes: ['visa', 'housing'] };
    case 'living':
      return { guideTypes: ['strategic', 'niche', 'work_infra'] };
    case 'food_culture':
      return { guideTypes: ['event'] };
    case 'place_collections':
      return { guideTypes: ['work_infra', 'strategic'] };
    case 'seasonality':
      return { guideTypes: ['climate'] };
    case 'safety':
      // v1: safety is a tag facet (not a separate guide_type in current corpus)
      return { tagsPreset: ['safety'] };
    case 'all':
    default:
      return {};
  }
}

function normalizeChipKey(raw: string | null): GuideChipKey {
  const v = (raw ?? '').trim();
  if (
    v === 'all' ||
    v === 'routes' ||
    v === 'practice_docs' ||
    v === 'living' ||
    v === 'food_culture' ||
    v === 'place_collections' ||
    v === 'seasonality' ||
    v === 'safety'
  ) {
    return v;
  }
  return 'all';
}

function normalizeSort(raw: string | null): SortOption {
  const v = (raw ?? '').trim();
  if (v === 'updated' || v === 'popular' || v === 'new') return v;
  return 'new';
}

function formatGuideType(raw: string): string {
  switch ((raw ?? '').trim()) {
    case 'route':
      return 'Маршрут';
    case 'visa':
      return 'Визы';
    case 'housing':
      return 'Жильё';
    case 'work_infra':
      return 'Инфраструктура';
    case 'climate':
      return 'Сезонность';
    case 'event':
      return 'События';
    case 'comparative':
      return 'Сравнение';
    case 'strategic':
      return 'Стратегия';
    case 'niche':
      return 'Ниша';
    default:
      return raw || '';
  }
}

export function GuidesClient() {
  const dataSource = getDataSource();
  const badgeText = dataSource === 'mock' ? 'MOCK DATA' : undefined;
  const searchParams = useSearchParams();
  const router = useRouter();

  const parseFiltersFromURL = useCallback(() => {
    const chip = normalizeChipKey(searchParams.get('type'));
    const countryId = searchParams.get('countryId') || '';
    const cityId = searchParams.get('cityId') || '';
    const tagsParam = searchParams.get('tags') || '';
    const editorialOnly = searchParams.get('editorialOnly') === '1';
    const sort = normalizeSort(searchParams.get('sort'));

    const tags = tagsParam
      ? new Set(tagsParam.split(',').map((t) => t.trim()).filter(Boolean))
      : new Set<string>();

    return { chip, countryId, cityId, tags, editorialOnly, sort };
  }, [searchParams]);

  const urlFilters = parseFiltersFromURL();

  const [chipKey, setChipKey] = useState<GuideChipKey>(urlFilters.chip);
  const [displayLimit, setDisplayLimit] = useState(INITIAL_LIMIT);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState<boolean>(false);

  // Applied filters (used for data fetching)
  const [selectedCountryId, setSelectedCountryId] = useState<string>(urlFilters.countryId);
  const [selectedCityId, setSelectedCityId] = useState<string>(urlFilters.cityId);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(urlFilters.tags);
  const [editorialOnly, setEditorialOnly] = useState<boolean>(urlFilters.editorialOnly);
  const [sortBy, setSortBy] = useState<SortOption>(urlFilters.sort);

  // Draft filters (edited inside the "Фильтры" panel)
  const [draftCountryId, setDraftCountryId] = useState<string>(urlFilters.countryId);
  const [draftCityId, setDraftCityId] = useState<string>(urlFilters.cityId);
  const [draftTags, setDraftTags] = useState<Set<string>>(urlFilters.tags);
  const [draftEditorialOnly, setDraftEditorialOnly] = useState<boolean>(urlFilters.editorialOnly);
  const [draftSortBy, setDraftSortBy] = useState<SortOption>(urlFilters.sort);
  const [tagInput, setTagInput] = useState<string>('');

  // Sync state <-> URL (back/forward, shared links)
  useEffect(() => {
    const f = parseFiltersFromURL();
    setChipKey(f.chip);
    setSelectedCountryId(f.countryId);
    setSelectedCityId(f.cityId);
    setSelectedTags(f.tags);
    setEditorialOnly(f.editorialOnly);
    setSortBy(f.sort);

    setDraftCountryId(f.countryId);
    setDraftCityId(f.cityId);
    setDraftTags(f.tags);
    setDraftEditorialOnly(f.editorialOnly);
    setDraftSortBy(f.sort);

    setDisplayLimit(INITIAL_LIMIT);
  }, [searchParams, parseFiltersFromURL]);

  const updateURLWithFilters = useCallback(
    (filters: {
      type?: GuideChipKey;
      countryId?: string;
      cityId?: string;
      tags?: Set<string>;
      editorialOnly?: boolean;
      sort?: SortOption;
    }) => {
      const params = new URLSearchParams();
      if (filters.type && filters.type !== 'all') params.set('type', filters.type);
      if (filters.countryId) params.set('countryId', filters.countryId);
      if (filters.cityId) params.set('cityId', filters.cityId);
      if (filters.tags && filters.tags.size > 0) params.set('tags', Array.from(filters.tags).join(','));
      if (filters.editorialOnly) params.set('editorialOnly', '1');
      if (filters.sort && filters.sort !== 'new') params.set('sort', filters.sort);

      const qs = params.toString();
      const newUrl = qs ? `/atlas/guides?${qs}` : '/atlas/guides';
      router.replace(newUrl, { scroll: false });
    },
    [router]
  );

  const handleChipChange = useCallback(
    (next: GuideChipKey) => {
      setChipKey(next);
      setDisplayLimit(INITIAL_LIMIT);
      updateURLWithFilters({
        type: next,
        countryId: selectedCountryId,
        cityId: selectedCityId,
        tags: selectedTags,
        editorialOnly,
        sort: sortBy,
      });
    },
    [selectedCountryId, selectedCityId, selectedTags, editorialOnly, sortBy, updateURLWithFilters]
  );

  const handleApplyFilters = useCallback(() => {
    setSelectedCountryId(draftCountryId);
    setSelectedCityId(draftCityId);
    setSelectedTags(draftTags);
    setEditorialOnly(draftEditorialOnly);
    setSortBy(draftSortBy);
    setDisplayLimit(INITIAL_LIMIT);
    updateURLWithFilters({
      type: chipKey,
      countryId: draftCountryId,
      cityId: draftCityId,
      tags: draftTags,
      editorialOnly: draftEditorialOnly,
      sort: draftSortBy,
    });
    setIsFiltersExpanded(false);
  }, [chipKey, draftCityId, draftCountryId, draftEditorialOnly, draftSortBy, draftTags, updateURLWithFilters]);

  const handleResetFilters = useCallback(() => {
    setChipKey('all');
    setSelectedCountryId('');
    setSelectedCityId('');
    setSelectedTags(new Set());
    setEditorialOnly(false);
    setSortBy('new');

    setDraftCountryId('');
    setDraftCityId('');
    setDraftTags(new Set());
    setDraftEditorialOnly(false);
    setDraftSortBy('new');
    setTagInput('');

    setDisplayLimit(INITIAL_LIMIT);
    router.replace('/atlas/guides', { scroll: false });
  }, [router]);

  // Data for selects
  const { data: countriesData } = useGetCountries({ enabled: dataSource === 'api' });
  const { data: citiesData } = useGetCities({ countryId: draftCountryId || undefined, enabled: dataSource === 'api' });

  const chipApi = chipToApi(chipKey);
  const effectiveTags = useMemo(() => {
    const out = new Set<string>();
    for (const t of selectedTags) out.add(t);
    for (const t of chipApi.tagsPreset ?? []) out.add(t);
    return Array.from(out);
  }, [selectedTags, chipApi.tagsPreset]);

  // Main guides query
  const { data: guidesData, isLoading, isFetching } = useGetGuides({
    limit: displayLimit,
    countryId: selectedCountryId || undefined,
    cityId: selectedCityId || undefined,
    guideTypes: chipApi.guideTypes,
    tags: effectiveTags.length > 0 ? effectiveTags : undefined,
    editorialOnly,
    sort: sortBy,
    enabled: dataSource === 'api',
  });

  // Facets: tag autocomplete options (self-exclusion: without selected tags, but with chip preset)
  const { data: guidesDataForFacets } = useGetGuides({
    limit: MAX_LIMIT,
    countryId: selectedCountryId || undefined,
    cityId: selectedCityId || undefined,
    guideTypes: chipApi.guideTypes,
    tags: (chipApi.tagsPreset ?? []).length > 0 ? chipApi.tagsPreset : undefined,
    editorialOnly,
    sort: sortBy,
    enabled: dataSource === 'api',
  });

  // Преобразуем данные из API
  const guides = useMemo(() => {
    if (dataSource === 'mock') {
      return mockRepo.atlas.listGuides().map((g) => ({
        id: g.id,
        slug: g.slug,
        title: g.title,
        excerpt: g.excerpt || '',
        coverImage: g.coverImage,
        category: g.category,
        tags: g.tags || [],
        publishedAt: g.publishedAt || g.updatedAt || '',
        updatedAt: g.updatedAt || g.publishedAt || '',
      }));
    }
    if (!guidesData?.items) return [];
    return guidesData.items.map((g) => ({
      id: g.id,
      slug: g.slug,
      title: g.title,
      excerpt: g.summary || '',
      coverImage: g.heroUrl,
      category: formatGuideType(g.guideType),
      tags: g.tags ?? [],
      publishedAt: g.publishedAt || g.updatedAt || '',
      updatedAt: g.updatedAt,
    }));
  }, [guidesData, dataSource, isLoading]);

  const total = guidesData?.total ?? guidesData?.items?.length ?? 0;
  const hasMore = guides.length > 0 && displayLimit < MAX_LIMIT && guides.length < total;

  const availableTagCounts = useMemo(() => {
    const map = new Map<string, number>();
    const items = guidesDataForFacets?.items ?? [];
    for (const g of items) {
      for (const t of g.tags ?? []) {
        map.set(t, (map.get(t) ?? 0) + 1);
      }
    }
    return map;
  }, [guidesDataForFacets]);

  const availableTags = useMemo(() => {
    const items = Array.from(availableTagCounts.entries()).map(([tag, count]) => ({ tag, count }));
    items.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'ru'));
    return items.map((x) => x.tag);
  }, [availableTagCounts]);

  const handleAddTagFromInput = useCallback(() => {
    const v = tagInput.trim();
    if (!v) return;
    setDraftTags((prev) => new Set(prev).add(v));
    setTagInput('');
  }, [tagInput]);

  const handleRemoveDraftTag = useCallback((tag: string) => {
    setDraftTags((prev) => {
      const next = new Set(prev);
      next.delete(tag);
      return next;
    });
  }, []);

  // Показываем состояние загрузки
  if (dataSource === 'api' && isLoading && !guidesData) {
    return (
      <div className="min-h-screen bg-slate-50">
        <ModuleHero
          icon={Globe}
          title="Atlas Asia"
          description="«Живой» вики-справочник по странам Юго-Восточной Азии с UGC и редакционной поддержкой"
          gradientFrom="from-sky-500"
          gradientTo="to-sky-600"
          badgeText={badgeText}
        />
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <AtlasMainNav />
          <AtlasSearchBar />
        </section>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Skeleton className="h-12 w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </section>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-50">
      <ModuleHero
        icon={Globe}
        title="Atlas Asia"
        description="«Живой» вики-справочник по странам Юго-Восточной Азии с UGC и редакционной поддержкой"
        gradientFrom="from-sky-500"
        gradientTo="to-sky-600"
        badgeText={badgeText}
      />

      {/* Top controls: internal nav + search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <AtlasMainNav />
        <AtlasSearchBar />
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Type chips (horizontal scroll) */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-4 px-4">
          {GUIDE_CHIPS.map((c) => (
            <Chip
              key={c.key}
              selected={chipKey === c.key}
              onClick={() => handleChipChange(c.key)}
              className="cursor-pointer whitespace-nowrap"
            >
              {c.label}
            </Chip>
          ))}
        </div>

        {/* Collapsible filters panel */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <button
            type="button"
            onClick={() => setIsFiltersExpanded((v) => !v)}
            className="flex items-center justify-between w-full text-left focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 rounded-md p-1 -ml-1"
          >
            <div className="text-sm font-semibold text-slate-900">Фильтры</div>
            {isFiltersExpanded ? (
              <ChevronUp className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-500" />
            )}
          </button>

          {isFiltersExpanded && (
            <div className="mt-4 space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <label htmlFor="guide-country" className="text-sm font-medium text-slate-700">
                    Страна:
                  </label>
                  <select
                    id="guide-country"
                    value={draftCountryId}
                    onChange={(e) => {
                      const next = e.target.value;
                      setDraftCountryId(next);
                      setDraftCityId(''); // reset city on country change
                    }}
                    className="px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="">Все страны</option>
                    {(countriesData?.items ?? []).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="guide-city" className="text-sm font-medium text-slate-700">
                    Город:
                  </label>
                  <select
                    id="guide-city"
                    value={draftCityId}
                    onChange={(e) => setDraftCityId(e.target.value)}
                    disabled={!draftCountryId}
                    className="px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:opacity-50"
                  >
                    <option value="">{draftCountryId ? 'Все города' : 'Сначала выберите страну'}</option>
                    {(citiesData?.items ?? []).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="guide-sort" className="text-sm font-medium text-slate-700">
                    Сортировка:
                  </label>
                  <select
                    id="guide-sort"
                    value={draftSortBy}
                    onChange={(e) => setDraftSortBy(e.target.value as SortOption)}
                    className="px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="new">Сначала новые</option>
                    <option value="updated">Обновлялись недавно</option>
                    <option value="popular">Популярные</option>
                  </select>
                </div>

                {/* Toggle "Только от редакции" */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700">Только от редакции</span>
                  <button
                    type="button"
                    onClick={() => setDraftEditorialOnly((v) => !v)}
                    aria-pressed={draftEditorialOnly}
                    className={[
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      draftEditorialOnly ? 'bg-sky-600' : 'bg-slate-300',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'inline-block h-5 w-5 transform rounded-full bg-white transition-transform',
                        draftEditorialOnly ? 'translate-x-5' : 'translate-x-1',
                      ].join(' ')}
                    />
                  </button>
                </div>
              </div>

              {/* Tags: multi-select with autocomplete */}
              <div>
                <label htmlFor="guide-tags" className="text-sm font-medium text-slate-700">
                  Теги:
                </label>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <input
                    id="guide-tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTagFromInput();
                      }
                    }}
                    list="guide-tag-suggestions"
                    placeholder="Начните вводить тег…"
                    className="w-full sm:w-[320px] px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                  <datalist id="guide-tag-suggestions">
                    {availableTags
                      .filter((t) => !draftTags.has(t))
                      .slice(0, 50)
                      .map((t) => (
                        <option key={t} value={t} />
                      ))}
                  </datalist>
                  <Button variant={'outline' as unknown as 'primary'} size="sm" onClick={handleAddTagFromInput}>
                    Добавить
                  </Button>
                </div>

                {draftTags.size > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Array.from(draftTags)
                      .slice()
                      .sort((a, b) => a.localeCompare(b, 'ru'))
                      .map((t) => (
                        <Chip key={t} selected onClick={() => handleRemoveDraftTag(t)} className="cursor-pointer">
                          {t}
                        </Chip>
                      ))}
                  </div>
                )}
              </div>

              {/* Apply / Reset */}
              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={handleApplyFilters}>Применить</Button>
                <Button variant={'outline' as unknown as 'primary'} onClick={handleResetFilters}>
                  <X className="mr-1 h-4 w-4" />
                  Сбросить
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Guides Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-baseline gap-3">
            <h2 className="text-h2 md:text-3xl font-bold text-slate-900">Все гайды</h2>
            {total > 0 && <span className="text-base md:text-lg text-slate-500 font-normal">— {total}</span>}
          </div>
          {guides.length > 0 && <span className="text-sm text-slate-600">Показано: {guides.length}</span>}
        </div>

        {guides.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((guide) => (
                <Link key={guide.id} href={`/atlas/guides/${guide.slug || guide.id}`}>
                  <Card hover className="h-full overflow-hidden p-0 !border-0">
                    {guide.coverImage ? (
                      <div className="relative w-full h-48 overflow-hidden">
                        <img
                          src={guide.coverImage}
                          alt={guide.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute top-2 right-2 flex flex-col gap-2">
                          {/* TODO: Add editor badge when API supports it */}
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">{guide.title}</h3>
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full h-48 overflow-hidden bg-slate-200">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">{guide.title}</h3>
                        </div>
                      </div>
                    )}
                    <CardContent className="p-6">
                      {guide.excerpt && (
                        <p className="text-small text-slate-600 mb-3 line-clamp-2">
                          {guide.excerpt}
                        </p>
                      )}
                      {guide.category && (
                        <div className="mb-3">
                          <Chip size="sm" className="bg-slate-100 text-slate-700">
                            {guide.category}
                          </Chip>
                        </div>
                      )}
                      {guide.tags && guide.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {guide.tags.slice(0, 3).map((tag) => (
                            <Chip key={tag} size="sm" className="bg-slate-100 text-slate-700">
                              {tag}
                            </Chip>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        {guide.updatedAt && (
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>
                              {new Date(guide.updatedAt).toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </span>
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            
            {/* Пагинация */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => setDisplayLimit((prev) => Math.min(prev + LOAD_MORE_STEP, MAX_LIMIT))}
                  disabled={isFetching}
                  className="min-w-[200px]"
                >
                  {isFetching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Загрузка…
                    </>
                  ) : (
                    'Показать ещё'
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600">Гайды не найдены</p>
          </div>
        )}
      </section>
    </div>
  );
}

