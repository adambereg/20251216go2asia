'use client';

import Link from 'next/link';
import { Card, CardContent, Skeleton, SkeletonCard } from '@go2asia/ui';
import { ModuleHero } from '@/components/modules';
import { Globe, MapPin } from 'lucide-react';
import { AtlasMainNav } from '@/modules/atlas';
import { AtlasSearchBar } from '@/modules/atlas';
import { useGetCountries } from '@go2asia/sdk/atlas';
import { useMemo } from 'react';
import { getDataSource } from '@/mocks/dto';
import { mockRepo } from '@/mocks/repo';
import { buildSrcSet, toCdnImageUrl } from '@/lib/imageCdn';

export function CountriesClient() {
  const dataSource = getDataSource();
  const badgeText = dataSource === 'mock' ? 'MOCK DATA' : undefined;
  
  // Загружаем страны из API
  const { 
    data: countriesData, 
    isLoading
  } = useGetCountries({
    limit: 20,
    enabled: dataSource === 'api',
  });

  // Преобразуем данные из API с fallback на моки
  const countries = useMemo(() => {
    // Mock mode — всегда используем моки
    if (dataSource === 'mock') {
      return mockRepo.atlas.listCountries().map((country) => ({
        id: country.id,
        name: country.name,
        flag: country.flag || '🌏',
        placesCount: country.placesCount || 0,
        citiesCount: country.citiesCount || 0,
        description: country.description || '',
        heroImage: country.heroImage || 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg',
      }));
    }
    
    // API mode — используем данные из API, fallback на моки при пустом ответе
    if (countriesData?.items?.length) {
      return countriesData.items.map((country) => ({
        id: country.id,
        name: country.name,
        flag: country.flag || '🌏',
        placesCount: country.placesCount || 0,
        citiesCount: country.citiesCount || 0,
        description: country.description || '',
        // Берём реальное медиа из API (R2 public URL), моки только как fallback если поля нет
        heroImage: country.heroImage || undefined,
      }));
    }
    
    // Fallback на моки при пустом API ответе (но не во время загрузки)
    if (!isLoading) {
      console.warn('[CountriesClient] API returned empty, falling back to mocks');
      return mockRepo.atlas.listCountries().map((country) => ({
        id: country.id,
        name: country.name,
        flag: country.flag || '🌏',
        placesCount: country.placesCount || 0,
        citiesCount: country.citiesCount || 0,
        description: country.description || '',
        heroImage: country.heroImage || 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg',
      }));
    }
    
    return [];
  }, [countriesData, dataSource, isLoading]);

  // Показываем состояние загрузки
  if (dataSource === 'api' && isLoading && !countriesData) {
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

      {/* Countries Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h2 className="text-h2 md:text-3xl font-bold text-slate-900 mb-6">
          Страны
        </h2>
        {countries.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {countries.map((country) => (
                <Link key={country.id} href={`/atlas/countries/${country.id}`}>
                  <Card hover className="h-full overflow-hidden p-0 !border-0">
                    {country.heroImage && (
                      <div
                        className="relative w-full h-48 overflow-hidden"
                        style={{ aspectRatio: '16 / 9' }}
                      >
                        <img
                          src={toCdnImageUrl(country.heroImage, {
                            width: 640,
                            quality: 75,
                            format: 'auto',
                          })}
                          srcSet={buildSrcSet(country.heroImage, [320, 480, 640], 75)}
                          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 360px"
                          alt={country.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                          fetchPriority="low"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        {country.flag && (
                          <div className="absolute top-4 left-4 text-4xl">{country.flag}</div>
                        )}
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-xl font-bold text-white mb-1">{country.name}</h3>
                        </div>
                      </div>
                    )}
                    <CardContent className="p-6">
                      {!country.heroImage && (
                        <div className="flex items-start gap-4 mb-4">
                          {country.flag && (
                            <div className="text-4xl flex-shrink-0">{country.flag}</div>
                          )}
                          <h3 className="text-h3 md:text-2xl font-bold text-slate-900">
                            {country.name}
                          </h3>
                        </div>
                      )}
                      {country.description && (
                        <p className="text-small text-slate-600 mb-3 line-clamp-2">
                          {country.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <MapPin size={16} className="flex-shrink-0" />
                        <span>
                          {country.citiesCount || 0} городов
                          {country.placesCount ? ` • ${country.placesCount} мест` : ''}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600">Страны не найдены</p>
          </div>
        )}
      </section>
    </div>
  );
}

