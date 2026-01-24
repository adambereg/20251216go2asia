'use client';

import { useMemo, useState } from 'react';
import { Chip, Skeleton, SkeletonCard } from '@go2asia/ui';
import { ModuleHero } from '@/components/modules';
import { Globe } from 'lucide-react';
import { AtlasMainNav } from '@/modules/atlas';
import { AtlasSearchBar } from '@/modules/atlas';
import { useGetPlaces } from '@go2asia/sdk/atlas';
import { getDataSource } from '@/mocks/dto';
import { PlacePreviewCard, type PlacePreviewData } from '@/modules/atlas/components/PlacePreviewCard';
import { getPlaceHeroImage } from '@/modules/atlas/utils/placeMedia';

export function PlacesClient() {
  const dataSource = getDataSource();
  const badgeText = dataSource === 'mock' ? 'MOCK DATA' : undefined;
  const [kind, setKind] = useState<'showplace' | 'business'>('showplace');
  
  // Загружаем места из API
  const { 
    data: placesData, 
    isLoading
  } = useGetPlaces({
    countryId: dataSource === 'api' ? 'ph' : undefined,
    kind: dataSource === 'api' ? kind : undefined,
    limit: 50,
    enabled: dataSource === 'api',
  });

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
            onClick={() => setKind('showplace')}
          >
            Достопримечательности
          </Chip>
          <Chip
            className={kind === 'business' ? 'bg-amber-100 text-amber-700' : ''}
            onClick={() => setKind('business')}
          >
            Заведения
          </Chip>
        </div>
      </section>

      {/* Places Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h2 className="text-h2 md:text-3xl font-bold text-slate-900 mb-6">
          {kind === 'showplace' ? 'Достопримечательности' : 'Заведения'}
        </h2>
        {places.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place) => (
            <PlacePreviewCard key={place.id} data={place} />
          ))}
            </div>
            
            {/* Cursor pagination not supported in current ListResponse контракте */}
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

