'use client';

import { useMemo, useState, useCallback } from 'react';
import { Chip, Skeleton, SkeletonCard, Button } from '@go2asia/ui';
import { ModuleHero } from '@/components/modules';
import { Globe, Loader2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { AtlasMainNav } from '@/modules/atlas';
import { AtlasSearchBar } from '@/modules/atlas';
import { useGetPlaces, useGetCountries, useGetCities } from '@go2asia/sdk/atlas';
import { getDataSource } from '@/mocks/dto';
import { PlacePreviewCard, type PlacePreviewData } from '@/modules/atlas/components/PlacePreviewCard';
import { getPlaceHeroImage } from '@/modules/atlas/utils/placeMedia';

const INITIAL_LIMIT = 50;
const LOAD_MORE_STEP = 50;
const MAX_LIMIT = 500; // API max limit

type KindFilter = 'all' | 'showplace' | 'business';
type SortOption = 'default' | 'name_asc' | 'name_desc' | 'photo_first';

export function PlacesClient() {
  const dataSource = getDataSource();
  const badgeText = dataSource === 'mock' ? 'MOCK DATA' : undefined;
  const [kind, setKind] = useState<KindFilter>('all');
  const [displayLimit, setDisplayLimit] = useState(INITIAL_LIMIT);
  
  // Фильтры
  const [selectedCountryId, setSelectedCountryId] = useState<string>('');
  const [selectedCityId, setSelectedCityId] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [isTagsExpanded, setIsTagsExpanded] = useState<boolean>(false);
  const [onlyWithPhotos, setOnlyWithPhotos] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  
  // Загружаем страны и города для фильтров
  const { data: countriesData } = useGetCountries({ enabled: dataSource === 'api' });
  const { data: citiesData } = useGetCities({ 
    countryId: selectedCountryId || undefined, // Если страна не выбрана, загружаем все города
    enabled: dataSource === 'api',
  });
  
  // Загружаем места из API с текущим лимитом и фильтрами
  const { 
    data: placesData, 
    isLoading,
    isFetching
  } = useGetPlaces({
    countryId: selectedCountryId || undefined,
    cityId: selectedCityId || undefined,
    kind: dataSource === 'api' && kind !== 'all' ? kind : undefined,
    limit: displayLimit,
    enabled: dataSource === 'api',
  });

  // Сброс лимита при смене kind или фильтров
  const handleKindChange = useCallback((newKind: KindFilter) => {
    setKind(newKind);
    setDisplayLimit(INITIAL_LIMIT);
  }, []);

  // Обработчики фильтров
  const handleCountryChange = useCallback((countryId: string) => {
    setSelectedCountryId(countryId);
    setSelectedCityId(''); // Сбрасываем город при смене страны
    setDisplayLimit(INITIAL_LIMIT);
  }, []);

  const handleCityChange = useCallback((cityId: string) => {
    setSelectedCityId(cityId);
    setDisplayLimit(INITIAL_LIMIT);
  }, []);

  const handleTagToggle = useCallback((tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
    setDisplayLimit(INITIAL_LIMIT);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedCountryId('');
    setSelectedCityId('');
    setSelectedTags(new Set());
    setOnlyWithPhotos(false);
    setSortBy('default');
    setDisplayLimit(INITIAL_LIMIT);
  }, []);

  const handleOnlyWithPhotosToggle = useCallback(() => {
    setOnlyWithPhotos((prev) => !prev);
    setDisplayLimit(INITIAL_LIMIT);
  }, []);

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

  // Фильтр "С фото" (клиентский)
  const placesWithPhotoFilter = useMemo<PlacePreviewData[]>(() => {
    if (!onlyWithPhotos) return allPlaces;
    return allPlaces.filter((p) => Boolean(p.hasPhoto));
  }, [allPlaces, onlyWithPhotos]);

  // Извлекаем уникальные теги из мест после фильтра "С фото" (и после API-фильтров страны/города/типа)
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    placesWithPhotoFilter.forEach((place) => {
      place.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [placesWithPhotoFilter]);

  // Применяем фильтр по тегам (клиентская фильтрация, т.к. API не поддерживает tags параметр)
  const placesAfterTags = useMemo<PlacePreviewData[]>(() => {
    if (selectedTags.size === 0) return placesWithPhotoFilter;
    return placesWithPhotoFilter.filter((place) => {
      if (!place.tags || place.tags.length === 0) return false;
      return Array.from(selectedTags).some((selectedTag) => place.tags?.includes(selectedTag));
    });
  }, [placesWithPhotoFilter, selectedTags]);

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
              {countriesData?.items?.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
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
              {citiesData?.items?.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
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
          {(kind !== 'all' || selectedCountryId || selectedCityId || selectedTags.size > 0 || onlyWithPhotos || sortBy !== 'default') && (
            <Button
              variant="outline"
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
        {availableTags.length > 0 && (
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
                {availableTags.map((tag) => (
                  <Chip
                    key={tag}
                    selected={selectedTags.has(tag)}
                    onClick={() => handleTagToggle(tag)}
                    className="cursor-pointer hover:bg-sky-50 transition-colors"
                  >
                    {tag}
                  </Chip>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Places Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-h2 md:text-3xl font-bold text-slate-900">
            {kind === 'showplace'
              ? 'Достопримечательности'
              : kind === 'business'
                ? 'Заведения'
                : 'Места'}
          </h2>
          {places.length > 0 && (
            <span className="text-sm text-slate-600">
              Показано: {filteredItemsCount}
              {selectedTags.size > 0 && ` (отфильтровано из ${allItemsCount})`}
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
                  variant="outline"
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

