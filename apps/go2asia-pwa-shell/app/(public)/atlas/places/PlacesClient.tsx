'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Chip, Skeleton, SkeletonCard, Button } from '@go2asia/ui';
import { ModuleHero } from '@/components/modules';
import { Globe, Loader2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { AtlasMainNav } from '@/modules/atlas';
import { AtlasSearchBar } from '@/modules/atlas';
import { useGetPlaces, useGetCountries, useGetCities } from '@go2asia/sdk/atlas';
import { listCityDistricts, type ContentCityDistrictDto } from '@go2asia/sdk/content';
import { getDataSource } from '@/mocks/dto';
import { PlacePreviewCard, type PlacePreviewData } from '@/modules/atlas/components/PlacePreviewCard';
import { getPlaceHeroImage } from '@/modules/atlas/utils/placeMedia';
import {
  type CategoryKey,
  getCategoryTags,
  normalizeTag,
  computeCategoryFacetsFromItems,
  computeTagFacetsFromItems,
} from '@go2asia/atlas-taxonomy';

const INITIAL_LIMIT = 50;
const LOAD_MORE_STEP = 50;
const MAX_LIMIT = 500; // API max limit

type KindFilter = 'all' | 'showplace' | 'business';
type SortOption = 'default' | 'name_asc' | 'name_desc' | 'photo_first';
type CategoryFilter = '' | CategoryKey;
const BANGKOK_CITY_KEYS = new Set(['bkk', 'bangkok']);

export function PlacesClient() {
  const dataSource = getDataSource();
  const badgeText = dataSource === 'mock' ? 'MOCK DATA' : undefined;
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Парсим параметры из URL при инициализации
  const parseFiltersFromURL = useCallback(() => {
    const categoryKey = searchParams.get('categoryKey') || '';
    const tagsParam = searchParams.get('tags') || '';
    const kindParam = searchParams.get('kind') || 'all';
    const countryId = searchParams.get('countryId') || '';
    const cityId = searchParams.get('cityId') || '';
    const district = searchParams.get('district') || '';
    const withPhotos = searchParams.get('withPhotos') === '1';
    
    // Парсим tags из CSV формата
    const tags = tagsParam 
      ? new Set(tagsParam.split(',').map(t => t.trim()).filter(Boolean))
      : new Set<string>();
    
    return {
      categoryKey: categoryKey as CategoryFilter,
      tags,
      kind: (kindParam === 'showplace' || kindParam === 'business' ? kindParam : 'all') as KindFilter,
      countryId,
      cityId,
      district,
      withPhotos,
    };
  }, [searchParams]);
  
  const urlFilters = parseFiltersFromURL();
  
  const [kind, setKind] = useState<KindFilter>(urlFilters.kind);
  const [displayLimit, setDisplayLimit] = useState(INITIAL_LIMIT);
  
  // Фильтры - инициализируем из URL
  const [selectedCountryId, setSelectedCountryId] = useState<string>(urlFilters.countryId);
  const [selectedCityId, setSelectedCityId] = useState<string>(urlFilters.cityId);
  const [selectedDistrict, setSelectedDistrict] = useState<string>(urlFilters.district);
  const [cityDistricts, setCityDistricts] = useState<ContentCityDistrictDto[]>([]);
  const [isCityDistrictsLoading, setIsCityDistrictsLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(urlFilters.tags);
  const [isTagsExpanded, setIsTagsExpanded] = useState<boolean>(false);
  const [onlyWithPhotos, setOnlyWithPhotos] = useState<boolean>(urlFilters.withPhotos);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>(urlFilters.categoryKey);
  
  // Синхронизируем state с URL при изменении searchParams (например, при переходе по ссылке)
  useEffect(() => {
    const urlFilters = parseFiltersFromURL();
    setKind(urlFilters.kind);
    setSelectedCountryId(urlFilters.countryId);
    setSelectedCityId(urlFilters.cityId);
    setSelectedDistrict(urlFilters.district);
    setSelectedTags(urlFilters.tags);
    setOnlyWithPhotos(urlFilters.withPhotos);
    setSelectedCategory(urlFilters.categoryKey);
  }, [searchParams, parseFiltersFromURL]);
  
  // Загружаем страны и города для фильтров
  const { data: countriesData } = useGetCountries({ enabled: dataSource === 'api' });
  const { data: citiesData } = useGetCities({ 
    countryId: selectedCountryId || undefined, // Если страна не выбрана, загружаем все города
    enabled: dataSource === 'api',
  });
  const isBangkokCitySelected = BANGKOK_CITY_KEYS.has((selectedCityId || '').toLowerCase());

  useEffect(() => {
    if (dataSource !== 'api' || !selectedCityId || !isBangkokCitySelected) {
      setCityDistricts([]);
      setIsCityDistrictsLoading(false);
      return;
    }
    let active = true;
    setIsCityDistrictsLoading(true);
    const loadDistricts = async () => {
      try {
        const response = await listCityDistricts(selectedCityId, { limit: 100 });
        if (!active) return;
        setCityDistricts(response.items ?? []);
      } catch {
        if (!active) return;
        setCityDistricts([]);
      } finally {
        if (active) setIsCityDistrictsLoading(false);
      }
    };
    loadDistricts();
    return () => {
      active = false;
    };
  }, [dataSource, selectedCityId, isBangkokCitySelected]);
  
  // Загружаем места из API с текущим лимитом и фильтрами
  const { 
    data: placesData, 
    isLoading,
    isFetching
  } = useGetPlaces({
    countryId: selectedCountryId || undefined,
    cityId: selectedCityId || undefined,
    district: selectedCityId && isBangkokCitySelected && selectedDistrict ? selectedDistrict : undefined,
    kind: dataSource === 'api' && kind !== 'all' ? kind : undefined,
    limit: displayLimit,
    enabled: dataSource === 'api',
  });

  // Загружаем места для facets (self-exclusion: БЕЗ фильтров по стране/городу, но с фильтром kind и увеличенным limit)
  // Это нужно для корректного подсчёта filtered counts в dropdown'ах
  // Загружаем всегда, чтобы facets были точными даже когда нет фильтров по стране/городу
  const { data: placesDataForFacets } = useGetPlaces({
    // БЕЗ countryId и cityId (self-exclusion)
    kind: dataSource === 'api' && kind !== 'all' ? kind : undefined,
    limit: MAX_LIMIT, // Увеличенный limit для более точных facets
    enabled: dataSource === 'api', // Загружаем всегда для facets
  });

  // Функция для синхронизации фильтров с URL
  const updateURLWithFilters = useCallback((filters: {
    kind?: KindFilter;
    categoryKey?: CategoryFilter;
    tags?: Set<string>;
    countryId?: string;
    cityId?: string;
    district?: string;
    withPhotos?: boolean;
  }) => {
    const params = new URLSearchParams();
    
    if (filters.kind && filters.kind !== 'all') {
      params.set('kind', filters.kind);
    }
    if (filters.categoryKey) {
      params.set('categoryKey', filters.categoryKey);
    }
    if (filters.tags && filters.tags.size > 0) {
      params.set('tags', Array.from(filters.tags).join(','));
    }
    if (filters.countryId) {
      params.set('countryId', filters.countryId);
    }
    if (filters.cityId) {
      params.set('cityId', filters.cityId);
    }
    if (filters.district) {
      params.set('district', filters.district);
    }
    if (filters.withPhotos) {
      params.set('withPhotos', '1');
    }
    
    const queryString = params.toString();
    const newUrl = queryString ? `/atlas/places?${queryString}` : '/atlas/places';
    
    router.replace(newUrl, { scroll: false });
  }, [router]);

  // Сброс лимита при смене kind или фильтров
  const handleKindChange = useCallback((newKind: KindFilter) => {
    setKind(newKind);
    setDisplayLimit(INITIAL_LIMIT);
    updateURLWithFilters({ 
      kind: newKind,
      categoryKey: selectedCategory,
      tags: selectedTags,
      countryId: selectedCountryId,
      cityId: selectedCityId,
      district: selectedDistrict,
      withPhotos: onlyWithPhotos,
    });
  }, [selectedCategory, selectedTags, selectedCountryId, selectedCityId, selectedDistrict, onlyWithPhotos, updateURLWithFilters]);

  // Обработчики фильтров
  const handleCountryChange = useCallback((countryId: string) => {
    setSelectedCountryId(countryId);
    setSelectedCityId(''); // Сбрасываем город при смене страны
    setSelectedDistrict('');
    setDisplayLimit(INITIAL_LIMIT);
    updateURLWithFilters({ 
      kind,
      categoryKey: selectedCategory,
      tags: selectedTags,
      countryId,
      cityId: '', // Сбрасываем город
      district: '',
      withPhotos: onlyWithPhotos,
    });
  }, [kind, selectedCategory, selectedTags, onlyWithPhotos, updateURLWithFilters]);

  const handleCityChange = useCallback((cityId: string) => {
    setSelectedCityId(cityId);
    setSelectedDistrict('');
    setDisplayLimit(INITIAL_LIMIT);
    updateURLWithFilters({ 
      kind,
      categoryKey: selectedCategory,
      tags: selectedTags,
      countryId: selectedCountryId,
      cityId,
      district: '',
      withPhotos: onlyWithPhotos,
    });
  }, [kind, selectedCategory, selectedTags, selectedCountryId, onlyWithPhotos, updateURLWithFilters]);

  const handleDistrictChange = useCallback((district: string) => {
    setSelectedDistrict(district);
    setDisplayLimit(INITIAL_LIMIT);
    updateURLWithFilters({
      kind,
      categoryKey: selectedCategory,
      tags: selectedTags,
      countryId: selectedCountryId,
      cityId: selectedCityId,
      district,
      withPhotos: onlyWithPhotos,
    });
  }, [kind, selectedCategory, selectedTags, selectedCountryId, selectedCityId, onlyWithPhotos, updateURLWithFilters]);

  const handleTagToggle = useCallback((tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      setDisplayLimit(INITIAL_LIMIT);
      updateURLWithFilters({ 
        kind,
        categoryKey: selectedCategory,
        tags: next,
        countryId: selectedCountryId,
        cityId: selectedCityId,
        district: selectedDistrict,
        withPhotos: onlyWithPhotos,
      });
      return next;
    });
  }, [kind, selectedCategory, selectedCountryId, selectedCityId, selectedDistrict, onlyWithPhotos, updateURLWithFilters]);

  const handleCategoryChange = useCallback((category: CategoryFilter) => {
    setSelectedCategory(category);
    setDisplayLimit(INITIAL_LIMIT);
    updateURLWithFilters({ 
      kind,
      categoryKey: category,
      tags: selectedTags,
      countryId: selectedCountryId,
      cityId: selectedCityId,
      district: selectedDistrict,
      withPhotos: onlyWithPhotos,
    });
  }, [kind, selectedTags, selectedCountryId, selectedCityId, selectedDistrict, onlyWithPhotos, updateURLWithFilters]);

  const handleClearFilters = useCallback(() => {
    setSelectedCountryId('');
    setSelectedCityId('');
    setSelectedDistrict('');
    setSelectedTags(new Set());
    setOnlyWithPhotos(false);
    setSortBy('default');
    setSelectedCategory('');
    setDisplayLimit(INITIAL_LIMIT);
    router.replace('/atlas/places', { scroll: false });
  }, [router]);

  const handleOnlyWithPhotosToggle = useCallback(() => {
    const newValue = !onlyWithPhotos;
    setOnlyWithPhotos(newValue);
    setDisplayLimit(INITIAL_LIMIT);
    updateURLWithFilters({ 
      kind,
      categoryKey: selectedCategory,
      tags: selectedTags,
      countryId: selectedCountryId,
      cityId: selectedCityId,
      district: selectedDistrict,
      withPhotos: newValue,
    });
  }, [kind, selectedCategory, selectedTags, selectedCountryId, selectedCityId, selectedDistrict, onlyWithPhotos, updateURLWithFilters]);

  const handleSortChange = useCallback((next: SortOption) => {
    setSortBy(next);
  }, []);

  // Загрузить ещё
  const handleLoadMore = useCallback(() => {
    setDisplayLimit((prev) => Math.min(prev + LOAD_MORE_STEP, MAX_LIMIT));
  }, []);

  // Преобразуем данные из API
  const allPlaces = useMemo<PlacePreviewData[]>(() => {
    if (dataSource !== 'api') return [];
    if (!placesData?.items) return [];
    return placesData.items.map((place) => ({
      id: place.id,
      slug: place.slug,
      name: place.name,
      description: place.description || null,
      // Важно: не используем fallback-URL как критерий "есть фото".
      // Для "С фото" смотрим только на реальные поля из API: heroImage/photos.
      heroImage: getPlaceHeroImage(place.id, place.heroImage || place.photos?.[0]),
      cityName: place.city ?? null,
      kind: place.kind as 'showplace' | 'business',
      category: place.category ?? null,
      tags: place.tags ?? [],
      countryId: place.countryId ?? null,
      cityId: place.cityId ?? null,
      hasPhoto: Boolean(place.heroImage) || (Array.isArray(place.photos) && place.photos.length > 0),
    }));
  }, [placesData, dataSource]);

  // Преобразуем данные для facets (БЕЗ фильтров по стране/городу)
  const allPlacesForFacets = useMemo<PlacePreviewData[]>(() => {
    if (dataSource !== 'api') return [];
    // Используем placesDataForFacets (БЕЗ фильтров по стране/городу) для более точных facets
    const sourceData = placesDataForFacets || placesData;
    if (!sourceData?.items) return [];
    return sourceData.items.map((place) => ({
      id: place.id,
      slug: place.slug,
      name: place.name,
      description: place.description || null,
      heroImage: getPlaceHeroImage(place.id, place.heroImage || place.photos?.[0]),
      cityName: place.city ?? null,
      kind: place.kind as 'showplace' | 'business',
      category: place.category ?? null,
      tags: place.tags ?? [],
      countryId: place.countryId ?? null,
      cityId: place.cityId ?? null,
      hasPhoto: Boolean(place.heroImage) || (Array.isArray(place.photos) && place.photos.length > 0),
    }));
  }, [placesDataForFacets, placesData, dataSource]);

  // Фильтр "С фото" (клиентский)
  const placesWithPhotoFilter = useMemo<PlacePreviewData[]>(() => {
    if (!onlyWithPhotos) return allPlaces;
    return allPlaces.filter((p) => Boolean(p.hasPhoto));
  }, [allPlaces, onlyWithPhotos]);

  // Базовая выборка для facets: после фильтров kind и "С фото", но БЕЗ фильтров по стране/городу/категории/тегам
  // (self-exclusion: facets считаются так, как будто соответствующий фильтр не применён)
  const placesForFacets = useMemo<PlacePreviewData[]>(() => {
    // Используем allPlacesForFacets (БЕЗ фильтров по стране/городу) для более точных facets
    const basePlaces = allPlacesForFacets.length > 0 ? allPlacesForFacets : allPlaces;
    if (!onlyWithPhotos) return basePlaces;
    return basePlaces.filter((p) => Boolean(p.hasPhoto));
  }, [allPlacesForFacets, allPlaces, onlyWithPhotos]);

  // Facet: страны (filtered counts с self-exclusion: считаем БЕЗ фильтра countryId)
  const countryFacets = useMemo(() => {
    if (!countriesData?.items) return [];
    const counts = new Map<string, number>();
    // Считаем по выборке БЕЗ фильтра countryId (self-exclusion)
    for (const place of placesForFacets) {
      if (place.countryId) {
        counts.set(place.countryId, (counts.get(place.countryId) ?? 0) + 1);
      }
    }
    return countriesData.items.map((country) => ({
      ...country,
      count: counts.get(country.id) ?? 0,
    }));
  }, [placesForFacets, countriesData]);

  // Facet: города (filtered counts с self-exclusion: считаем БЕЗ фильтра cityId, но с учётом выбранной страны)
  const cityFacets = useMemo(() => {
    if (!citiesData?.items) return [];
    const counts = new Map<string, number>();
    // Считаем по выборке БЕЗ фильтра cityId (self-exclusion)
    // Но если выбрана страна, показываем только города этой страны (UX: меньше "нулей")
    const filteredForCityFacets = selectedCountryId
      ? placesForFacets.filter((p) => p.countryId === selectedCountryId)
      : placesForFacets;
    for (const place of filteredForCityFacets) {
      if (place.cityId) {
        counts.set(place.cityId, (counts.get(place.cityId) ?? 0) + 1);
      }
    }
    // Фильтруем города: если выбрана страна, показываем только города этой страны
    const citiesToShow = selectedCountryId
      ? citiesData.items.filter((city) => city.countryId === selectedCountryId)
      : citiesData.items;
    return citiesToShow.map((city) => ({
      ...city,
      count: counts.get(city.id) ?? 0,
    }));
  }, [placesForFacets, citiesData, selectedCountryId]);

  // Facet: виртуальные категории (filtered counts с self-exclusion: считаем БЕЗ фильтра categoryKey)
  const categoryFacets = useMemo(() => {
    return computeCategoryFacetsFromItems(placesForFacets);
  }, [placesForFacets]);

  // Фильтр по категории (виртуальный): category = alias набора тегов
  const placesAfterCategory = useMemo<PlacePreviewData[]>(() => {
    if (!selectedCategory) return placesWithPhotoFilter;
    const categoryTags = new Set(getCategoryTags(selectedCategory));
    return placesWithPhotoFilter.filter((p) => (p.tags ?? []).some((t) => categoryTags.has(normalizeTag(t))));
  }, [placesWithPhotoFilter, selectedCategory]);

  // Facet: динамические теги.
  // До выбора категории: показываем TOP-N популярных тегов (8–12).
  // После выбора категории: только теги выбранной категории, которые реально есть в текущей выборке (страна/город/тип/с фото/категория).
  // Важно: выбранные теги не исчезают "магически" — добавляем их в список отдельно.
  const tagsFacet = useMemo(() => {
    const TOP_N = 12;
    const facets = computeTagFacetsFromItems(placesAfterCategory, {
      topN: TOP_N,
      categoryKey: selectedCategory || null,
      selectedTags: Array.from(selectedTags),
    });
    const categoryTagSet = selectedCategory ? new Set(getCategoryTags(selectedCategory).map(normalizeTag)) : null;
    return { facets, categoryTagSet };
  }, [placesAfterCategory, selectedCategory, selectedTags]);

  // Применяем фильтр по тегам (клиентская фильтрация, т.к. API не поддерживает tags параметр)
  const placesAfterTags = useMemo<PlacePreviewData[]>(() => {
    if (selectedTags.size === 0) return placesAfterCategory;
    return placesAfterCategory.filter((place) => {
      if (!place.tags || place.tags.length === 0) return false;
      return Array.from(selectedTags).some((selectedTag) => place.tags?.includes(selectedTag));
    });
  }, [placesAfterCategory, selectedTags]);

  // Сортировка (клиентская)
  const places = useMemo<PlacePreviewData[]>(() => {
    const items = [...placesAfterTags];
    switch (sortBy) {
      case 'name_asc':
        items.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
        return items;
      case 'name_desc':
        items.sort((a, b) => b.name.localeCompare(a.name, 'ru'));
        return items;
      case 'photo_first':
        items.sort((a, b) => Number(Boolean(b.hasPhoto)) - Number(Boolean(a.hasPhoto)));
        return items;
      case 'default':
      default:
        return items; // порядок API
    }
  }, [placesAfterTags, sortBy]);

  // Проверяем, есть ли ещё места для загрузки
  // Если API вернул меньше записей, чем запрошено, значит больше нет
  const allItemsCount = placesData?.items?.length ?? 0;
  const filteredItemsCount = places.length;
  const hasMore = allItemsCount >= displayLimit && displayLimit < MAX_LIMIT;
  const isLoadingMore = isFetching && !isLoading && places.length > 0;
  
  // Показываем сообщение, если загружены все доступные места
  const showAllLoadedMessage = !hasMore && allItemsCount > 0 && allItemsCount < displayLimit;

  // Total count для текущего scope (для отображения в заголовке)
  // Используем placesCount из данных страны/города, если доступно, иначе allItemsCount
  const totalCount = useMemo(() => {
    if (selectedCityId && citiesData?.items) {
      const city = citiesData.items.find((c) => c.id === selectedCityId);
      if (city?.placesCount !== undefined) return city.placesCount;
    }
    if (selectedCountryId && countriesData?.items) {
      const country = countriesData.items.find((c) => c.id === selectedCountryId);
      if (country?.placesCount !== undefined) {
        // Если выбран kind, нужно приблизительно оценить (или использовать allItemsCount)
        return country.placesCount;
      }
    }
    // Fallback: используем количество загруженных мест
    return allItemsCount;
  }, [selectedCityId, selectedCountryId, citiesData, countriesData, allItemsCount]);

  // Формируем заголовок с total count
  const placesTitle = useMemo(() => {
    const kindLabel =
      kind === 'showplace'
        ? 'Достопримечательности'
        : kind === 'business'
          ? 'Заведения'
          : 'Места';
    
    let scopeLabel = '';
    if (selectedCityId && citiesData?.items) {
      const city = citiesData.items.find((c) => c.id === selectedCityId);
      if (city) scopeLabel = ` в ${city.name}`;
    } else if (selectedCountryId && countriesData?.items) {
      const country = countriesData.items.find((c) => c.id === selectedCountryId);
      if (country) scopeLabel = ` в ${country.name}`;
    }
    
    return `${kindLabel}${scopeLabel}`;
  }, [kind, selectedCityId, selectedCountryId, citiesData, countriesData]);

  // Показываем состояние загрузки
  if (dataSource === 'api' && isLoading && !placesData) {
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
        {/* Компактные фильтры: тип/страна/город/сортировка/с фото */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label htmlFor="kind-filter" className="text-sm font-medium text-slate-700">
              Тип:
            </label>
            <select
              id="kind-filter"
              value={kind}
              onChange={(e) => handleKindChange(e.target.value as KindFilter)}
              className="px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              <option value="all">Все</option>
              <option value="showplace">Достопримечательности</option>
              <option value="business">Заведения</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="country-filter" className="text-sm font-medium text-slate-700">
              Страна:
            </label>
            <select
              id="country-filter"
              value={selectedCountryId}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              <option value="">Все страны</option>
              {countryFacets.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}{typeof country.count === 'number' ? ` (${country.count})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="city-filter" className="text-sm font-medium text-slate-700">
              Город:
            </label>
            <select
              id="city-filter"
              value={selectedCityId}
              onChange={(e) => handleCityChange(e.target.value)}
              className="px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              <option value="">Все города</option>
              {cityFacets.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}{typeof city.count === 'number' ? ` (${city.count})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="district-filter" className="text-sm font-medium text-slate-700">
              Район:
            </label>
            <select
              id="district-filter"
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              disabled={!selectedCityId || !isBangkokCitySelected || isCityDistrictsLoading}
              className="px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-70"
            >
              {!selectedCityId ? (
                <option value="">Сначала выберите город</option>
              ) : !isBangkokCitySelected ? (
                <option value="">Доступно только для Bangkok pilot</option>
              ) : (
                <option value="">{isCityDistrictsLoading ? 'Загрузка районов...' : 'Все районы'}</option>
              )}
              {isBangkokCitySelected &&
                cityDistricts.map((district) => (
                  <option key={district.id} value={district.slug}>
                    {district.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="category-filter" className="text-sm font-medium text-slate-700">
              Категория:
            </label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value as CategoryFilter)}
              className="px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              <option value="">Все категории</option>
              {categoryFacets.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}{typeof c.count === 'number' ? ` (${c.count})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="sort-filter" className="text-sm font-medium text-slate-700">
              Сортировка:
            </label>
            <select
              id="sort-filter"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              <option value="default">По умолчанию</option>
              <option value="name_asc">А—Я</option>
              <option value="name_desc">Я—А</option>
              <option value="photo_first">Сначала с фото</option>
            </select>
          </div>

          {/* Тумблер "С фото" */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">С фото</span>
            <button
              type="button"
              onClick={handleOnlyWithPhotosToggle}
              aria-pressed={onlyWithPhotos}
              className={[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                onlyWithPhotos ? 'bg-sky-600' : 'bg-slate-300',
              ].join(' ')}
            >
              <span
                className={[
                  'inline-block h-5 w-5 transform rounded-full bg-white transition-transform',
                  onlyWithPhotos ? 'translate-x-5' : 'translate-x-1',
                ].join(' ')}
              />
            </button>
          </div>

          {/* Кнопка очистки фильтров */}
          {(kind !== 'all' ||
            selectedCountryId ||
            selectedCityId ||
            selectedDistrict ||
            selectedCategory ||
            selectedTags.size > 0 ||
            onlyWithPhotos ||
            sortBy !== 'default') && (
            <Button
              variant={'outline' as unknown as 'primary'}
              size="sm"
              onClick={handleClearFilters}
              className="text-sm"
            >
              <X className="mr-1 h-3 w-3" />
              Очистить фильтры
            </Button>
          )}
        </div>

        {/* Фильтр по тегам */}
        {tagsFacet.facets.length > 0 && (
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setIsTagsExpanded(!isTagsExpanded)}
              className="flex items-center justify-between w-full text-left mb-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 rounded-md p-1 -ml-1"
            >
              <label className="text-sm font-medium text-slate-700 cursor-pointer">
                Теги:
                {selectedTags.size > 0 && (
                  <span className="ml-2 text-xs text-sky-600 font-normal">
                    ({selectedTags.size} выбрано)
                  </span>
                )}
              </label>
              {isTagsExpanded ? (
                <ChevronUp className="h-4 w-4 text-slate-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-500" />
              )}
            </button>
            {isTagsExpanded && (
              <div className="flex flex-wrap gap-2">
                {tagsFacet.facets.map(({ key: tag }) => {
                  const isSelected = selectedTags.has(tag);
                  const isOutOfCategory =
                    Boolean(tagsFacet.categoryTagSet) && !tagsFacet.categoryTagSet?.has(normalizeTag(tag));
                  const isDisabled = !isSelected && Boolean(tagsFacet.categoryTagSet) && isOutOfCategory;

                  return (
                    <Chip
                      key={tag}
                      selected={isSelected}
                      onClick={() => {
                        // запрещаем выбирать новые теги вне категории, но разрешаем снять уже выбранные
                        if (isDisabled) return;
                        handleTagToggle(tag);
                      }}
                      className={[
                        'transition-colors',
                        isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-sky-50',
                      ].join(' ')}
                    >
                      {tag}
                    </Chip>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Places Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-baseline gap-3">
            <h2 className="text-h2 md:text-3xl font-bold text-slate-900">
              {placesTitle}
            </h2>
            {totalCount > 0 && (
              <span className="text-base md:text-lg text-slate-500 font-normal">
                — {totalCount}
              </span>
            )}
          </div>
          {places.length > 0 && (
            <span className="text-sm text-slate-600">
              Показано: {filteredItemsCount}
            </span>
          )}
        </div>
        {places.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map((place) => (
                <PlacePreviewCard key={place.id} data={place} />
              ))}
            </div>
            
            {/* Load More button */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  variant={'outline' as unknown as 'primary'}
                  className="min-w-[200px]"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Загрузка...
                    </>
                  ) : (
                    'Загрузить ещё'
                  )}
                </Button>
              </div>
            )}
            
            {showAllLoadedMessage && (
              <div className="text-center mt-6 text-sm text-slate-500">
                Показаны все доступные места ({filteredItemsCount})
              </div>
            )}
            {!hasMore && displayLimit >= MAX_LIMIT && allItemsCount >= MAX_LIMIT && (
              <div className="text-center mt-6 text-sm text-slate-500">
                Показаны все доступные места (максимум {MAX_LIMIT})
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600">Места не найдены</p>
          </div>
        )}
      </section>
    </div>
  );
}

