'use client';

import { AtlasHomeView } from '@/modules/atlas';
import { useGetCountries, useGetPlaces } from '@go2asia/sdk/atlas';
import { useMemo } from 'react';
import { Skeleton, SkeletonCard } from '@go2asia/ui';
import { getDataSource } from '@/mocks/dto';
import { mockRepo } from '@/mocks/repo';

export function AtlasHomeClient() {
  const dataSource = getDataSource();

  // Загружаем страны из API
  const { 
    data: countriesData, 
    isLoading: countriesLoading
  } = useGetCountries({
    limit: 20,
    enabled: dataSource === 'api',
  });

  // Загружаем популярные места из API
  const { 
    data: placesData, 
    isLoading: placesLoading
  } = useGetPlaces({
    limit: 3,
    enabled: dataSource === 'api',
  });

  // Преобразуем данные из API в формат компонента с fallback на моки
  const countries = useMemo(() => {
    if (dataSource === 'mock') {
      return mockRepo.atlas.listCountries().map((country) => ({
        id: country.id,
        name: country.name,
        flag: country.flag || '🌏',
        placesCount: country.placesCount || 0,
        description: country.description || '',
        heroImage: country.heroImage || 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg',
      }));
    }
    
    // API mode — используем данные из API
    if (countriesData?.items?.length) {
      return countriesData.items.map((country) => ({
        id: country.id,
        name: country.name,
        flag: country.flag || '🌏',
        placesCount: country.placesCount || 0,
        description: country.description || '',
        // Берём реальное медиа из API (R2 public URL), без подмены моковыми URL
        heroImage: country.heroImage || undefined,
      }));
    }
    // Важно: в API-режиме НЕ подмешиваем моки при пустом ответе,
    // чтобы не маскировать проблемы контента/БД и не показывать demo Pexels.
    return [];
  }, [countriesData, dataSource, countriesLoading]);

  const popularPlaces = useMemo(() => {
    if (dataSource === 'mock') {
      return mockRepo.atlas
        .listPlaces()
        .slice(0, 3)
        .map((place) => ({
          id: place.id,
          title: place.name,
          city: place.city,
          country: place.country,
          rating: place.rating || 0,
          reviewsCount: 0,
        }));
    }
    
    // API mode — используем данные из API
    if (placesData?.items?.length) {
      return placesData.items.map((place) => ({
        id: place.id,
        title: place.name,
        city: '',
        country: '',
        rating: 0,
        reviewsCount: 0,
      }));
    }
    // Важно: в API-режиме НЕ подмешиваем моки при пустом ответе.
    return [];
  }, [placesData, dataSource, placesLoading]);

  const isLoading = dataSource === 'api' ? countriesLoading || placesLoading : false;

  // Показываем состояние загрузки с Skeleton компонентами (только при первой загрузке)
  if (isLoading && !countriesData && !placesData) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Показываем данные (как в Pulse и Blog - без проверки ошибок)
  // Если данных нет из-за ошибок, показываем пустые списки
  return (
    <AtlasHomeView
      countries={countries}
      popularPlaces={popularPlaces}
      dataSourceBadgeText={dataSource === 'mock' ? 'MOCK DATA' : undefined}
    />
  );
}
