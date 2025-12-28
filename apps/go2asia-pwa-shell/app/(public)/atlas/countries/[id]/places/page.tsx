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
  // Всегда вызываем хук (правило React Hooks), но отключаем запрос в mock-режиме
  const { data: countryData } = useGetCountryById(dataSource === 'api' ? (countryId || '') : '');
  const mockCountry = dataSource === 'mock' ? mockRepo.atlas.getCountryById(countryId || '') : null;

  // Загружаем места страны из API
  // Примечание: API может не поддерживать фильтрацию по countryId напрямую,
  // поэтому используем фильтрацию через cityId или получаем все места
  const { 
    data: placesData, 
    isLoading 
  } = useGetPlaces({
    limit: 50,
    enabled: dataSource === 'api',
    // countryId: countryId, // TODO: Add when API supports countryId filter
  });

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

  const apiPlaces = placesData?.items && placesData.items.length > 0 ? placesData.items : [];
  const effectivePlaces =
    dataSource === 'mock'
      ? (() => {
          const places = mockRepo.atlas.listPlaces().filter((p) => (p.country || '').toLowerCase() === (countryId || '').toLowerCase());
          return places.length > 0 ? places : mockRepo.atlas.listPlaces().slice(0, 12);
        })()
      : apiPlaces;

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
          {dataSource === 'api' ? (
            <>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                Фильтрация мест по стране в API пока недоступна. Показаны общие популярные места из API.
              </div>
              {effectivePlaces.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-slate-900">Популярные места</h3>
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
                          {place.type && <span>{place.type}</span>}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-600">Места не найдены</div>
              )}
            </>
          ) : effectivePlaces.length > 0 ? (
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


