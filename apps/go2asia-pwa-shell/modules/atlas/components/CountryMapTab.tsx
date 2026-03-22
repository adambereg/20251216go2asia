'use client';

import { useParams } from 'next/navigation';
import { Skeleton } from '@go2asia/ui';
import { useGetCountryById } from '@go2asia/sdk/atlas';
import { getDataSource } from '@/mocks/dto';
import { mockRepo } from '@/mocks/repo';
import { CountryGeoMapView } from '@/modules/geo/CountryGeoMapView';
import { useCountryGeoMap } from '@/modules/geo/useCountryGeoMap';
import { AtlasTabContent } from './AtlasTabContent';

export function CountryMapTab() {
  const params = useParams();
  const countryId = params?.id as string | undefined;
  const dataSource = getDataSource();

  const { data: countryData, isLoading: isCountryLoading } = useGetCountryById(
    dataSource === 'api' ? (countryId || '') : ''
  );

  const mockCountry = dataSource === 'mock' && countryId ? mockRepo.atlas.getCountryById(countryId) : null;
  const resolvedCountry: any =
    dataSource === 'mock' ? mockCountry : countryData ?? null;

  const { geo, isLoading, error, stats } = useCountryGeoMap(countryId);

  if (isCountryLoading || isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[520px] w-full rounded-2xl" />
      </div>
    );
  }

  const cities = geo.layers.cities ?? [];
  const places = geo.layers.places ?? [];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Карта</h2>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-3">
            <span>
              Источник: <span className="font-medium">{stats.dataSource}</span>
            </span>
            <span>
              Geo Contract: <span className="font-medium">{geo.meta?.contractVersion ?? 'v1'}</span>
            </span>
            <span>
              Слои: <span className="font-medium">cities + places</span>
            </span>
          </div>

          {resolvedCountry?.placesCount !== undefined && (
            <div className="text-slate-500">
              Показано мест: <span className="font-medium text-slate-700">{stats.placesWithCoords}</span>
              {' '}из{' '}
              <span className="font-medium text-slate-700">{resolvedCountry.placesCount}</span>
              {' '} (ограничение выдачи раннего этапа)
            </div>
          )}
        </div>

        {error && (
          <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Не удалось загрузить слои карты: {error}
          </div>
        )}

        <div className="mt-4">
          <CountryGeoMapView countryId={countryId || 'unknown'} cities={cities} places={places} />
        </div>
      </section>

      {/* Текст вкладки (контент-таб) — остаётся совместимым с контентным контуром */}
      <AtlasTabContent
        entityType="country"
        tabKey="map"
        title="Описание"
        emptyMessage="Описание карты в разработке."
      />
    </div>
  );
}

