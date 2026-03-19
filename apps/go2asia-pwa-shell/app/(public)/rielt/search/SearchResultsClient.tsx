'use client';

/**
 * Rielt.Market Asia - Search Results Client Component
 * Страница результатов поиска с реальным API
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchResultsView } from '@/components/rielt/SearchResults/SearchResultsView';
import { useListListings, type RieltListParams } from '@go2asia/sdk/rielt';
import { rieltDtoToListing } from '@/components/rielt/adapters/rieltDtoToListing';
import type { SearchFilters, ListingWithDistance } from '@/components/rielt/types';

function mapUrlToApiParams(searchParams: URLSearchParams) {
  const city = searchParams.get('city');
  const rentalType = searchParams.get('rentalType');
  const sortBy = searchParams.get('sortBy');
  const bedrooms = searchParams.get('bedrooms');

  const listing_type =
    rentalType === 'long-term' ? 'rent_long' : rentalType === 'short-term' ? 'rent_short' : undefined;
  const sort: 'newest' | 'price_asc' | 'price_desc' =
    sortBy === 'price-asc'
      ? 'price_asc'
      : sortBy === 'price-desc'
        ? 'price_desc'
        : 'newest';

  return {
    city_id: city || undefined,
    listing_type,
    sort,
    bedrooms_min: bedrooms ? parseInt(bedrooms, 10) : undefined,
    page: 1,
    page_size: 50,
  };
}

export function SearchResultsClient() {
  const searchParams = useSearchParams();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const apiParams = mapUrlToApiParams(searchParams);
  const { data, isLoading, isError, error } = useListListings(apiParams);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          setUserLocation({ lat: 13.7563, lng: 100.5018 });
        }
      );
    } else {
      setUserLocation({ lat: 13.7563, lng: 100.5018 });
    }
  }, []);

  const filtersFromURL: Partial<SearchFilters> = {};
  const city = searchParams.get('city');
  if (city) filtersFromURL.location = { city };
  const rentalType = searchParams.get('rentalType') as 'short-term' | 'long-term' | null;
  if (rentalType) filtersFromURL.rentalType = rentalType;
  const sortBy = searchParams.get('sortBy') as SearchFilters['sortBy'];
  if (sortBy) filtersFromURL.sortBy = sortBy;

  let listings: ListingWithDistance[] = [];
  if (data?.items) {
    listings = data.items.map((dto) => rieltDtoToListing(dto)) as ListingWithDistance[];
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3" />
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-48 bg-slate-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-amber-900 mb-2">Ошибка загрузки</h2>
          <p className="text-amber-800 mb-4">
            {error?.message ?? 'Не удалось загрузить объявления. Попробуйте позже.'}
          </p>
          <a
            href="/rielt/search"
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Вернуться к поиску
          </a>
        </div>
      </div>
    );
  }

  return (
    <SearchResultsView
      listings={listings}
      filters={filtersFromURL}
      userLocation={userLocation}
    />
  );
}
