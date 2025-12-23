'use client';

import Link from 'next/link';
import { Card, CardContent, Skeleton, SkeletonCard } from '@go2asia/ui';
import { ModuleHero } from '@/components/modules';
import { Globe, MapPin, Building2 } from 'lucide-react';
import { AtlasMainNav } from '@/modules/atlas';
import { AtlasSearchBar } from '@/modules/atlas';
import { useGetCities } from '@go2asia/sdk/atlas';
import { useMemo } from 'react';
import { getDataSource } from '@/mocks/dto';
import { mockRepo } from '@/mocks/repo';

export function CitiesClient() {
  const dataSource = getDataSource();
  const badgeText = dataSource === 'mock' ? 'MOCK DATA' : undefined;
  
  // Загружаем города из API
  const { 
    data: citiesData, 
    isLoading
  } = useGetCities({
    limit: 50,
  });

  const apiCities = useMemo(() => {
    if (!citiesData?.items) return [];
    return citiesData.items.map((city) => ({
      id: city.id,
      name: city.name,
      countryId: city.countryId,
      description: city.description || '',
      placesCount: city.placesCount || 0,
    }));
  }, [citiesData]);

  const mockCountriesById = useMemo(() => {
    if (dataSource !== 'mock') return {};
    return Object.fromEntries(mockRepo.atlas.listCountries().map((c) => [c.id, c]));
  }, [dataSource]);

  const mockAllCities = useMemo(() => {
    if (dataSource !== 'mock') return [];
    return mockRepo.atlas.listCities();
  }, [dataSource]);

  const mockCapitalCityIds = ['bkk', 'han', 'vte', 'pnh', 'kul', 'mnl', 'jkt', 'sin'] as const;
  const mockCountryOrder = ['th', 'vn', 'la', 'kh', 'my', 'ph', 'id', 'sg'] as const;

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

      {/* Cities Grid */}
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
        ) : apiCities.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apiCities.map((city) => (
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

          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600">Города не найдены</p>
          </div>
        )}
      </section>
    </div>
  );
}

