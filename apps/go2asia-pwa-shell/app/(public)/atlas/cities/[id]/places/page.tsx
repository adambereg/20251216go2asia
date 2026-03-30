'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Chip, SkeletonCard } from '@go2asia/ui';
import { useGetPlaces } from '@go2asia/sdk/atlas';
import { listCityDistricts, type ContentCityDistrictDto } from '@go2asia/sdk/content';
import { getDataSource } from '@/mocks/dto';
import { MarkdownRenderer } from '@/modules/atlas/components/MarkdownRenderer';
import { PlacePreviewCard, type PlacePreviewData } from '@/modules/atlas/components/PlacePreviewCard';
import { getPlaceHeroImage } from '@/modules/atlas/utils/placeMedia';

const DISTRICT_PILOT_CITY_KEYS = new Set(['bkk', 'bangkok', 'cnx', 'chiang-mai', 'chiangmai']);

export default function CityPlacesPage() {
  const params = useParams();
  const cityId = params?.id as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  const dataSource = getDataSource();
  const [kind, setKind] = useState<'showplace' | 'business'>('showplace');
  const [districts, setDistricts] = useState<ContentCityDistrictDto[]>([]);
  const [isDistrictsLoading, setIsDistrictsLoading] = useState(false);

  const districtFromUrl = (searchParams.get('district') ?? '').trim();
  const isDistrictPilotCity = DISTRICT_PILOT_CITY_KEYS.has((cityId ?? '').toLowerCase());

  useEffect(() => {
    if (dataSource !== 'api' || !isDistrictPilotCity || !cityId) {
      setDistricts([]);
      setIsDistrictsLoading(false);
      return;
    }

    let active = true;
    setIsDistrictsLoading(true);
    const loadDistricts = async () => {
      try {
        const response = await listCityDistricts(cityId, { limit: 100 });
        if (!active) return;
        setDistricts(response.items ?? []);
      } catch {
        if (!active) return;
        setDistricts([]);
      } finally {
        if (active) setIsDistrictsLoading(false);
      }
    };
    loadDistricts();
    return () => {
      active = false;
    };
  }, [cityId, dataSource, isDistrictPilotCity]);

  const selectedDistrict = useMemo(
    () => districts.find((district) => district.slug === districtFromUrl || district.id === districtFromUrl) ?? null,
    [districts, districtFromUrl]
  );

  const handleDistrictChange = useCallback(
    (value: string) => {
      const next = new URLSearchParams(searchParams.toString());
      if (value) {
        next.set('district', value);
      } else {
        next.delete('district');
      }
      const qs = next.toString();
      const basePath = `/atlas/cities/${encodeURIComponent(cityId)}/places`;
      router.replace(qs ? `${basePath}?${qs}` : basePath, { scroll: false });
    },
    [cityId, router, searchParams]
  );

  const { data: placesData, isLoading } = useGetPlaces({
    cityId: dataSource === 'api' ? cityId : undefined,
    district: dataSource === 'api' && isDistrictPilotCity ? selectedDistrict?.id ?? undefined : undefined,
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
      heroImage: getPlaceHeroImage(place.id, place.heroImage || place.photos?.[0]),
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
      {dataSource === 'api' && isDistrictPilotCity ? (
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="city-district-filter" className="text-sm font-medium text-slate-700">
            Район:
          </label>
          <select
            id="city-district-filter"
            value={selectedDistrict?.slug ?? ''}
            onChange={(event) => handleDistrictChange(event.target.value)}
            disabled={isDistrictsLoading}
            className="min-w-[220px] rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-70"
          >
            <option value="">{isDistrictsLoading ? 'Загрузка районов...' : 'Все районы'}</option>
            {districts.map((district) => (
              <option key={district.id} value={district.slug}>
                {district.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {selectedDistrict ? (
        <section className="rounded-2xl border border-sky-200 bg-sky-50/60 p-4">
          <div className="flex flex-wrap items-baseline gap-2">
            <h3 className="text-base font-semibold text-slate-900">{selectedDistrict.name}</h3>
            {selectedDistrict.nameLocal ? (
              <span className="text-sm text-slate-600">({selectedDistrict.nameLocal})</span>
            ) : null}
          </div>
          {selectedDistrict.bodyMarkdown?.trim() ? (
            <MarkdownRenderer
              markdown={selectedDistrict.bodyMarkdown}
              className="mt-2 space-y-2 text-sm leading-6 text-slate-700 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5"
            />
          ) : selectedDistrict.descriptionShort ? (
            <p className="mt-2 text-sm leading-6 text-slate-700">{selectedDistrict.descriptionShort}</p>
          ) : null}
        </section>
      ) : null}

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

