'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { Chip, SkeletonCard } from '@go2asia/ui';
import { useGetPlaces } from '@go2asia/sdk/atlas';
import { getDataSource } from '@/mocks/dto';
import { PlacePreviewCard, type PlacePreviewData } from '@/modules/atlas/components/PlacePreviewCard';

export default function CityPlacesPage() {
  const params = useParams();
  const cityId = params?.id as string;
  const dataSource = getDataSource();
  const [kind, setKind] = useState<'showplace' | 'business'>('showplace');

  const { data: placesData, isLoading } = useGetPlaces({
    cityId: dataSource === 'api' ? cityId : undefined,
    kind: dataSource === 'api' ? kind : undefined,
    limit: 50,
    enabled: dataSource === 'api',
  });

  const places = useMemo<PlacePreviewData[]>(() => {
    if (dataSource !== 'api') return [];
    if (!placesData?.items) return [];
    return placesData.items.map((place) => ({
      id: place.id,
      slug: place.slug,
      name: place.name,
      description: place.description || null,
      heroImage: place.heroImage || (place.photos?.[0] ?? null),
      cityName: place.city ?? null,
      kind: place.kind as 'showplace' | 'business',
      category: place.category ?? null,
      tags: place.tags ?? [],
    }));
  }, [placesData, dataSource]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Места</h2>
      <div className="flex flex-wrap gap-2">
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

      {isLoading && places.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : places.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place) => (
            <PlacePreviewCard key={place.id} data={place} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-600">Места не найдены</div>
      )}
    </div>
  );
}

