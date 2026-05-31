'use client';

import Link from 'next/link';
import { Card, CardContent, Skeleton, SkeletonCard, Button } from '@go2asia/ui';
import { ModuleHero } from '@/components/modules';
import { Globe, MapPin, Building2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { AtlasMainNav } from '@/modules/atlas';
import { AtlasSearchBar } from '@/modules/atlas';
import { useGetCities, useGetCountries } from '@go2asia/sdk/atlas';
import { useMemo, useCallback, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getDataSource } from '@/mocks/dto';
import { mockRepo } from '@/mocks/repo';

type SortOption = 'size_desc' | 'name_asc' | 'name_desc';
type SeaFilter = 'all' | 'true' | 'false';
type CityTypeFilter =
  | ''
  | 'resort'
  | 'cultural'
  | 'business'
  | 'nature'
  | 'island'
  | 'mountain'
  | 'historic'
  | 'mixed'
  | 'other';
type CitySizeFilter = '' | 'small' | 'medium' | 'large' | 'capital';
type PriceFilter = '' | 'budget' | 'mid' | 'expensive';
type NightlifeFilter = '' | 'active' | 'moderate' | 'calm';

export function CitiesClient() {
  const dataSource = getDataSource();
  const badgeText = dataSource === 'mock' ? 'MOCK DATA' : undefined;
  const searchParams = useSearchParams();
  const router = useRouter();

  const parseFiltersFromURL = useCallback(() => {
    const countryId = searchParams.get('countryId') || '';
    const q = searchParams.get('q') || '';
    const type = (searchParams.get('type') || '') as CityTypeFilter;
    const size = (searchParams.get('size') || '') as CitySizeFilter;
    const sea = (searchParams.get('sea') || 'all') as SeaFilter;
    const price = (searchParams.get('price') || '') as PriceFilter;
    const nightlife = (searchParams.get('nightlife') || '') as NightlifeFilter;
    const sortRaw = (searchParams.get('sort') || 'size_desc') as SortOption;
    const sort: SortOption =
      sortRaw === 'name_asc' || sortRaw === 'name_desc' || sortRaw === 'size_desc' ? sortRaw : 'size_desc';
    const seaNormalized: SeaFilter = sea === 'true' || sea === 'false' ? sea : 'all';
    return { countryId, q, type, size, sea: seaNormalized, price, nightlife, sort };
  }, [searchParams]);

  const urlFilters = parseFiltersFromURL();

  const [selectedCountryId, setSelectedCountryId] = useState<string>(urlFilters.countryId);
  const [searchQuery, setSearchQuery] = useState<string>(urlFilters.q);
  const [selectedType, setSelectedType] = useState<CityTypeFilter>(urlFilters.type);
  const [selectedSize, setSelectedSize] = useState<CitySizeFilter>(urlFilters.size);
  const [seaFilter, setSeaFilter] = useState<SeaFilter>(urlFilters.sea);
  const [priceFilter, setPriceFilter] = useState<PriceFilter>(urlFilters.price);
  const [nightlifeFilter, setNightlifeFilter] = useState<NightlifeFilter>(urlFilters.nightlife);
  const [sortBy, setSortBy] = useState<SortOption>(urlFilters.sort);
  const [isAdvancedExpanded, setIsAdvancedExpanded] = useState<boolean>(false);

  // Sync state <-> URL (back/forward, shared links)
  useEffect(() => {
    const f = parseFiltersFromURL();
    setSelectedCountryId(f.countryId);
    setSearchQuery(f.q);
    setSelectedType(f.type);
    setSelectedSize(f.size);
    setSeaFilter(f.sea);
    setPriceFilter(f.price);
    setNightlifeFilter(f.nightlife);
    setSortBy(f.sort);
  }, [searchParams, parseFiltersFromURL]);

  const updateURLWithFilters = useCallback(
    (filters: {
      countryId?: string;
      q?: string;
      type?: CityTypeFilter;
      size?: CitySizeFilter;
      sea?: SeaFilter;
      price?: PriceFilter;
      nightlife?: NightlifeFilter;
      sort?: SortOption;
    }) => {
      const params = new URLSearchParams();
      if (filters.countryId) params.set('countryId', filters.countryId);
      if (filters.q && filters.q.trim().length > 0) params.set('q', filters.q.trim());
      if (filters.type) params.set('type', filters.type);
      if (filters.size) params.set('size', filters.size);
      if (filters.sea && filters.sea !== 'all') params.set('sea', filters.sea);
      if (filters.price) params.set('price', filters.price);
      if (filters.nightlife) params.set('nightlife', filters.nightlife);
      if (filters.sort && filters.sort !== 'size_desc') params.set('sort', filters.sort);

      const qs = params.toString();
      const newUrl = qs ? `/atlas/cities?${qs}` : '/atlas/cities';
      router.replace(newUrl, { scroll: false });
    },
    [router]
  );

  const handleClearFilters = useCallback(() => {
    setSelectedCountryId('');
    setSearchQuery('');
    setSelectedType('');
    setSelectedSize('');
    setSeaFilter('all');
    setPriceFilter('');
    setNightlifeFilter('');
    setSortBy('size_desc');
    router.replace('/atlas/cities', { scroll: false });
  }, [router]);

  const handleCountryChange = useCallback(
    (countryId: string) => {
      setSelectedCountryId(countryId);
      updateURLWithFilters({
        countryId,
        q: searchQuery,
        type: selectedType,
        size: selectedSize,
        sea: seaFilter,
        price: priceFilter,
        nightlife: nightlifeFilter,
        sort: sortBy,
      });
    },
    [searchQuery, selectedType, selectedSize, seaFilter, priceFilter, nightlifeFilter, sortBy, updateURLWithFilters]
  );

  const handleTypeChange = useCallback(
    (type: CityTypeFilter) => {
      setSelectedType(type);
      updateURLWithFilters({
        countryId: selectedCountryId,
        q: searchQuery,
        type,
        size: selectedSize,
        sea: seaFilter,
        price: priceFilter,
        nightlife: nightlifeFilter,
        sort: sortBy,
      });
    },
    [selectedCountryId, searchQuery, selectedSize, seaFilter, priceFilter, nightlifeFilter, sortBy, updateURLWithFilters]
  );

  const handleSizeChange = useCallback(
    (size: CitySizeFilter) => {
      setSelectedSize(size);
      updateURLWithFilters({
        countryId: selectedCountryId,
        q: searchQuery,
        type: selectedType,
        size,
        sea: seaFilter,
        price: priceFilter,
        nightlife: nightlifeFilter,
        sort: sortBy,
      });
    },
    [selectedCountryId, searchQuery, selectedType, seaFilter, priceFilter, nightlifeFilter, sortBy, updateURLWithFilters]
  );

  const handleSeaChange = useCallback(
    (sea: SeaFilter) => {
      setSeaFilter(sea);
      updateURLWithFilters({
        countryId: selectedCountryId,
        q: searchQuery,
        type: selectedType,
        size: selectedSize,
        sea,
        price: priceFilter,
        nightlife: nightlifeFilter,
        sort: sortBy,
      });
    },
    [selectedCountryId, searchQuery, selectedType, selectedSize, priceFilter, nightlifeFilter, sortBy, updateURLWithFilters]
  );

  const handleSortChange = useCallback(
    (sort: SortOption) => {
      setSortBy(sort);
      updateURLWithFilters({
        countryId: selectedCountryId,
        q: searchQuery,
        type: selectedType,
        size: selectedSize,
        sea: seaFilter,
        price: priceFilter,
        nightlife: nightlifeFilter,
        sort,
      });
    },
    [selectedCountryId, searchQuery, selectedType, selectedSize, seaFilter, priceFilter, nightlifeFilter, updateURLWithFilters]
  );

  const handlePriceChange = useCallback(
    (price: PriceFilter) => {
      setPriceFilter(price);
      updateURLWithFilters({
        countryId: selectedCountryId,
        q: searchQuery,
        type: selectedType,
        size: selectedSize,
        sea: seaFilter,
        price,
        nightlife: nightlifeFilter,
        sort: sortBy,
      });
    },
    [selectedCountryId, searchQuery, selectedType, selectedSize, seaFilter, nightlifeFilter, sortBy, updateURLWithFilters]
  );

  const handleNightlifeChange = useCallback(
    (nightlife: NightlifeFilter) => {
      setNightlifeFilter(nightlife);
      updateURLWithFilters({
        countryId: selectedCountryId,
        q: searchQuery,
        type: selectedType,
        size: selectedSize,
        sea: seaFilter,
        price: priceFilter,
        nightlife,
        sort: sortBy,
      });
    },
    [selectedCountryId, searchQuery, selectedType, selectedSize, seaFilter, priceFilter, sortBy, updateURLWithFilters]
  );

  const handleSearchChange = useCallback(
    (q: string) => {
      setSearchQuery(q);
      updateURLWithFilters({
        countryId: selectedCountryId,
        q,
        type: selectedType,
        size: selectedSize,
        sea: seaFilter,
        price: priceFilter,
        nightlife: nightlifeFilter,
        sort: sortBy,
      });
    },
    [selectedCountryId, selectedType, selectedSize, seaFilter, priceFilter, nightlifeFilter, sortBy, updateURLWithFilters]
  );
  
  // Загружаем города из API
  const { 
    data: citiesData, 
    isLoading
  } = useGetCities({
    countryId: selectedCountryId || undefined,
    q: searchQuery || undefined,
    type: selectedType || undefined,
    size: selectedSize || undefined,
    sea: seaFilter === 'true' ? true : seaFilter === 'false' ? false : undefined,
    price: priceFilter || undefined,
    nightlife: nightlifeFilter || undefined,
    sort: sortBy,
    limit: 500,
    enabled: dataSource === 'api',
  });

  const { data: countriesData } = useGetCountries({ enabled: dataSource === 'api' });

  const apiCities = useMemo(() => {
    // API mode — используем данные из API
    if (citiesData?.items?.length) {
      return citiesData.items.map((city) => ({
        id: city.id,
        name: city.name,
        countryId: city.countryId,
        description: city.description || '',
        placesCount: city.placesCount || 0,
        heroImage: city.heroImage || undefined,
      }));
    }

    // Без fallback на моки в API-режиме: пустой ответ должен быть видимым сигналом
    // (чтобы не маскировать проблемы Neon/content-service и не тянуть demo Pexels).
    return [];
  }, [citiesData, dataSource, isLoading]);

  const mockCountriesById = useMemo(() => {
    if (dataSource !== 'mock') return {};
    return Object.fromEntries(mockRepo.atlas.listCountries().map((c) => [c.id, c]));
  }, [dataSource]);

  const mockAllCities = useMemo(() => {
    if (dataSource !== 'mock') return [];
    return mockRepo.atlas.listCities();
  }, [dataSource]);

  const mockCapitalCityIds = ['bkk', 'han', 'vte', 'pnh', 'kul', 'mnl', 'jkt', 'tok', 'seo', 'sin'] as const;
  const mockCountryOrder = ['th', 'vn', 'la', 'kh', 'my', 'ph', 'id', 'jp', 'kr', 'sg'] as const;

  const mockCapitals = useMemo(() => {
    if (dataSource !== 'mock') return [];
    const byId = new Map(mockAllCities.map((c) => [c.id, c] as const));
    return mockCapitalCityIds
      .map((id) => byId.get(id))
      .filter((c): c is NonNullable<typeof c> => Boolean(c));
  }, [dataSource, mockAllCities]);

  const mockOtherCitiesByCountry = useMemo(() => {
    if (dataSource !== 'mock') return [];
    const capitalSet = new Set<string>(mockCapitalCityIds);
    const grouped = new Map<string, typeof mockAllCities>();

    for (const city of mockAllCities) {
      if (capitalSet.has(city.id)) continue;
      const bucket = grouped.get(city.countryId) ?? [];
      bucket.push(city);
      grouped.set(city.countryId, bucket);
    }

    return mockCountryOrder.map((countryId) => ({
      countryId,
      country: mockCountriesById[countryId],
      cities: grouped.get(countryId) ?? [],
    }));
  }, [dataSource, mockAllCities, mockCountriesById]);

  // Показываем состояние загрузки
  if (dataSource === 'api' && isLoading && !citiesData) {
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

      {/* Cities Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-3 mb-6">
          <Building2 className="w-6 h-6 text-slate-600" />
          <h2 className="text-h2 md:text-3xl font-bold text-slate-900">
            Города
          </h2>
        </div>
        
        {dataSource === 'mock' ? (
          <>
            {/* 8 столиц карточками */}
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Столицы</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockCapitals.map((city) => (
                  <Link key={city.id} href={`/atlas/cities/${city.id}`}>
                    <Card hover className="h-full overflow-hidden p-0 !border-0">
                      <div className="relative w-full h-48 overflow-hidden bg-slate-200">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-xl font-bold text-white mb-1">{city.name}</h3>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        {city.description && (
                          <p className="text-small text-slate-600 mb-3 line-clamp-2">
                            {city.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <MapPin size={16} className="flex-shrink-0" />
                          <span>{city.placesCount || 0} мест</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Остальные города списком по странам */}
            <div className="space-y-8">
              <h3 className="text-lg font-semibold text-slate-900">Другие города</h3>

              {mockOtherCitiesByCountry.map((group) => {
                const title = group.country ? `${group.country.flag ?? ''} ${group.country.name}`.trim() : group.countryId;
                if (group.cities.length === 0) return null;
                return (
                  <div key={group.countryId} className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <h4 className="text-base font-semibold text-slate-900">{title}</h4>
                      <span className="text-xs text-slate-500">{group.cities.length} городов</span>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                      {group.cities.map((city) => (
                        <li key={city.id}>
                          <Link
                            href={`/atlas/cities/${city.id}`}
                            className="text-sky-700 hover:text-sky-800 hover:underline underline-offset-2"
                          >
                            {city.name}
                          </Link>
                          {city.description ? (
                            <div className="text-xs text-slate-500 line-clamp-1">{city.description}</div>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            
          </>
        ) : (
          <>
            {/* Filters (API only) — show even when list is empty */}
            <div className="sticky top-0 z-10 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 bg-slate-50/95 backdrop-blur border-b border-slate-200 mb-6">
              {/* Top row: search + main filters + sort */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <label htmlFor="city-q" className="text-sm font-medium text-slate-700">
                    Поиск:
                  </label>
                  <input
                    id="city-q"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Название города"
                    className="w-[220px] max-w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="city-country" className="text-sm font-medium text-slate-700">
                    Страна:
                  </label>
                  <select
                    id="city-country"
                    value={selectedCountryId}
                    onChange={(e) => handleCountryChange(e.target.value)}
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
                  <label htmlFor="city-type" className="text-sm font-medium text-slate-700">
                    Тип:
                  </label>
                  <select
                    id="city-type"
                    value={selectedType}
                    onChange={(e) => handleTypeChange(e.target.value as CityTypeFilter)}
                    className="px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="">Все типы</option>
                    <option value="resort">Курортный</option>
                    <option value="cultural">Культурный</option>
                    <option value="business">Деловой</option>
                    <option value="nature">Природный</option>
                    <option value="island">Островной</option>
                    <option value="mountain">Горный</option>
                    <option value="historic">Исторический</option>
                    <option value="mixed">Смешанный</option>
                    <option value="other">Другое</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="city-size" className="text-sm font-medium text-slate-700">
                    Размер:
                  </label>
                  <select
                    id="city-size"
                    value={selectedSize}
                    onChange={(e) => handleSizeChange(e.target.value as CitySizeFilter)}
                    className="px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="">Все</option>
                    <option value="small">Малый</option>
                    <option value="medium">Средний</option>
                    <option value="large">Крупный</option>
                    <option value="capital">Столица</option>
                  </select>
                </div>

                {/* Sea: tri-state segmented control (Все/Есть/Нет) */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700">Море:</span>
                  <div className="inline-flex rounded-md border border-slate-300 bg-white overflow-hidden">
                    <button
                      type="button"
                      onClick={() => handleSeaChange('all')}
                      className={[
                        'px-3 py-1.5 text-sm',
                        seaFilter === 'all' ? 'bg-sky-600 text-white' : 'text-slate-700 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      Все
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSeaChange('true')}
                      className={[
                        'px-3 py-1.5 text-sm border-l border-slate-300',
                        seaFilter === 'true' ? 'bg-sky-600 text-white' : 'text-slate-700 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      Есть
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSeaChange('false')}
                      className={[
                        'px-3 py-1.5 text-sm border-l border-slate-300',
                        seaFilter === 'false' ? 'bg-sky-600 text-white' : 'text-slate-700 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      Нет
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="city-sort" className="text-sm font-medium text-slate-700">
                    Сортировка:
                  </label>
                  <select
                    id="city-sort"
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value as SortOption)}
                    className="px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="size_desc">Сначала крупные</option>
                    <option value="name_asc">А → Я</option>
                    <option value="name_desc">Я → А</option>
                  </select>
                </div>

                {/* Advanced toggle */}
                <button
                  type="button"
                  onClick={() => setIsAdvancedExpanded((v) => !v)}
                  className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
                >
                  {isAdvancedExpanded ? 'Скрыть расширенные' : 'Расширенные фильтры'}
                  {isAdvancedExpanded ? (
                    <ChevronUp className="h-4 w-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  )}
                </button>

                {/* Reset */}
                {(selectedCountryId ||
                  searchQuery.trim().length > 0 ||
                  selectedType ||
                  selectedSize ||
                  seaFilter !== 'all' ||
                  priceFilter ||
                  nightlifeFilter ||
                  sortBy !== 'size_desc') && (
                  <Button
                    variant={'outline' as unknown as 'primary'}
                    size="sm"
                    onClick={handleClearFilters}
                    className="text-sm"
                  >
                    <X className="mr-1 h-3 w-3" />
                    Сбросить
                  </Button>
                )}
              </div>

              {/* Advanced filters (collapsed by default) */}
              {isAdvancedExpanded && (
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <label htmlFor="city-price" className="text-sm font-medium text-slate-700">
                      Уровень цен:
                    </label>
                    <select
                      id="city-price"
                      value={priceFilter}
                      onChange={(e) => handlePriceChange(e.target.value as PriceFilter)}
                      className="px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    >
                      <option value="">Все</option>
                      <option value="budget">Бюджетный</option>
                      <option value="mid">Средний</option>
                      <option value="expensive">Дорогой</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label htmlFor="city-nightlife" className="text-sm font-medium text-slate-700">
                      Ночная жизнь:
                    </label>
                    <select
                      id="city-nightlife"
                      value={nightlifeFilter}
                      onChange={(e) => handleNightlifeChange(e.target.value as NightlifeFilter)}
                      className="px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    >
                      <option value="">Все</option>
                      <option value="active">Активная</option>
                      <option value="moderate">Умеренная</option>
                      <option value="calm">Спокойная</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {apiCities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {apiCities.map((city) => (
                  <Link key={city.id} href={`/atlas/cities/${city.id}`}>
                    <Card hover className="h-full overflow-hidden p-0 !border-0">
                      {city.heroImage ? (
                        <div className="relative w-full h-48 overflow-hidden">
                          <img
                            src={city.heroImage}
                            alt={city.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-xl font-bold text-white mb-1">{city.name}</h3>
                          </div>
                        </div>
                      ) : (
                        <div className="relative w-full h-48 overflow-hidden bg-slate-200">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-xl font-bold text-white mb-1">{city.name}</h3>
                          </div>
                        </div>
                      )}
                      <CardContent className="p-6">
                        {city.description && (
                          <p className="text-small text-slate-600 mb-3 line-clamp-2">
                            {city.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <MapPin size={16} className="flex-shrink-0" />
                          <span>{city.placesCount || 0} мест</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-600">Города не найдены</p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

