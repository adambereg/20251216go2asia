'use client';

import { useMemo, useState, useCallback } from 'react';
import { Chip, Skeleton, SkeletonCard, Button } from '@go2asia/ui';
import { ModuleHero } from '@/components/modules';
import { Globe, Loader2 } from 'lucide-react';
import { AtlasMainNav } from '@/modules/atlas';
import { AtlasSearchBar } from '@/modules/atlas';
import { useGetPlaces } from '@go2asia/sdk/atlas';
import { getDataSource } from '@/mocks/dto';
import { PlacePreviewCard, type PlacePreviewData } from '@/modules/atlas/components/PlacePreviewCard';
import { getPlaceHeroImage } from '@/modules/atlas/utils/placeMedia';

const INITIAL_LIMIT = 50;
const LOAD_MORE_STEP = 50;
const MAX_LIMIT = 500; // API max limit

export function PlacesClient() {
  const dataSource = getDataSource();
  const badgeText = dataSource === 'mock' ? 'MOCK DATA' : undefined;
  const [kind, setKind] = useState<'showplace' | 'business'>('showplace');
  const [displayLimit, setDisplayLimit] = useState(INITIAL_LIMIT);
  
  // Загружаем места из API с текущим лимитом
  const { 
    data: placesData, 
    isLoading,
    isFetching
  } = useGetPlaces({
    // Do not hardcode country: list all places (PH + KH + VN + TH + LA + MY + ID + SG + ...)
    countryId: undefined,
    kind: dataSource === 'api' ? kind : undefined,
    limit: displayLimit,
    enabled: dataSource === 'api',
  });

  // Сброс лимита при смене kind
  const handleKindChange = useCallback((newKind: 'showplace' | 'business') => {
    setKind(newKind);
    setDisplayLimit(INITIAL_LIMIT);
  }, []);

  // Загрузить ещё
  const handleLoadMore = useCallback(() => {
    setDisplayLimit((prev) => Math.min(prev + LOAD_MORE_STEP, MAX_LIMIT));
  }, []);

  // Преобразуем данные из API
  const places = useMemo<PlacePreviewData[]>(() => {
    if (dataSource !== 'api') return [];
    if (!placesData?.items) return [];
    return placesData.items.map((place) => ({
      id: place.id,
      slug: place.slug,
      name: place.name,
      description: place.description || null,
      heroImage: getPlaceHeroImage(place.id, place.heroImage || place.photos?.[0]),
      cityName: place.city ?? null,
      kind: place.kind as 'showplace' | 'business',
      category: place.category ?? null,
      tags: place.tags ?? [],
    }));
  }, [placesData, dataSource]);

  // Проверяем, есть ли ещё места для загрузки
  // Если API вернул меньше записей, чем запрошено, значит больше нет
  const itemsCount = placesData?.items?.length ?? 0;
  const hasMore = itemsCount >= displayLimit && displayLimit < MAX_LIMIT;
  const isLoadingMore = isFetching && !isLoading && places.length > 0;
  
  // Показываем сообщение, если загружены все доступные места
  const showAllLoadedMessage = !hasMore && itemsCount > 0 && itemsCount < displayLimit;

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
        <div className="flex flex-wrap gap-2 mb-6">
          <Chip
            className={kind === 'showplace' ? 'bg-sky-100 text-sky-700' : ''}
            onClick={() => handleKindChange('showplace')}
          >
            Достопримечательности
          </Chip>
          <Chip
            className={kind === 'business' ? 'bg-amber-100 text-amber-700' : ''}
            onClick={() => handleKindChange('business')}
          >
            Заведения
          </Chip>
        </div>
      </section>

      {/* Places Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-h2 md:text-3xl font-bold text-slate-900">
            {kind === 'showplace' ? 'Достопримечательности' : 'Заведения'}
          </h2>
          {places.length > 0 && (
            <span className="text-sm text-slate-600">
              Показано: {places.length}
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
                Показаны все доступные места ({itemsCount})
              </div>
            )}
            {!hasMore && displayLimit >= MAX_LIMIT && itemsCount >= MAX_LIMIT && (
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

