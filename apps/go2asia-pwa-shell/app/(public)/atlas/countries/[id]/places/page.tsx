'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useGetPlaces } from '@go2asia/sdk/atlas';
import { useGetCountryById } from '@go2asia/sdk/atlas';
import { Skeleton } from '@go2asia/ui';
import { MapPin } from 'lucide-react';
import { getDataSource } from '@/mocks/dto';
import { mockRepo } from '@/mocks/repo';

export default function CountryPlacesPage() {
  const params = useParams();
  const countryId = params?.id as string;
  const dataSource = getDataSource();

  // Загружаем данные страны для получения названия
  const { data: countryData } =
    dataSource === 'api' ? useGetCountryById(countryId || '') : ({ data: null } as any);
  const mockCountry = dataSource === 'mock' ? mockRepo.atlas.getCountryById(countryId || '') : null;

  // Загружаем места страны из API
  // Примечание: API может не поддерживать фильтрацию по countryId напрямую,
  // поэтому используем фильтрацию через cityId или получаем все места
  const { 
    data: placesData, 
    isLoading 
  } = dataSource === 'api'
    ? useGetPlaces({
        limit: 50,
        // countryId: countryId, // TODO: Add when API supports countryId filter
      })
    : ({ data: null, isLoading: false } as any);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
          <Skeleton className="h-4 w-full mb-4" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  const countryIdToCountryName: Record<string, string> = {
    th: 'Thailand',
    vn: 'Vietnam',
    id: 'Indonesia',
    my: 'Malaysia',
    sg: 'Singapore',
    ph: 'Philippines',
  };

  const places =
    dataSource === 'mock'
      ? mockRepo.atlas
          .listPlaces()
          .filter((p) => (p.country || '').toLowerCase() === (countryIdToCountryName[countryId] || '').toLowerCase())
      : placesData?.items || [];

  // В мок-режиме, если совпадений по стране нет (или страна не задана), показываем демо-выборку.
  const effectivePlaces = dataSource === 'mock' ? (places.length > 0 ? places : mockRepo.atlas.listPlaces().slice(0, 12)) : places;

  // Фильтруем места по стране (если API не поддерживает фильтрацию)
  // TODO: Убрать фильтрацию на клиенте, когда API будет поддерживать countryId
  // const filteredPlaces = places.filter(place => {
  //   // Здесь нужна логика определения страны места через cityId
  //   return true;
  // });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Достопримечательности</h2>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="px-4 py-4 space-y-4">
          {effectivePlaces.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-900">
                {(dataSource === 'mock' ? mockCountry?.name : countryData?.name)
                  ? `Места в ${(dataSource === 'mock' ? mockCountry?.name : countryData?.name)}`
                  : 'Популярные места'}
              </h3>
              <div className="space-y-3">
                {effectivePlaces.map((place: any) => (
                  <Link
                    key={place.id}
                    href={`/atlas/places/${place.id}`}
                    className="block rounded-lg border border-slate-200 p-3 hover:border-sky-300 hover:bg-sky-50 transition-colors"
                  >
                    <div className="font-semibold text-slate-900 mb-1">{place.name}</div>
                    {place.description && (
                      <div className="text-sm text-slate-600 mb-2">
                        {place.description}
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      {place.type && (
                        <span>{place.type}</span>
                      )}
                      {place.categories && place.categories.length > 0 && (
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />
                          {place.categories.join(', ')}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-600">
              Места не найдены
            </div>
          )}
        </div>
      </section>
    </div>
  );
}


