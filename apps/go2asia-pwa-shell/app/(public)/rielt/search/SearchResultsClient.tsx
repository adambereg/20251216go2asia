'use client';

/**
 * Rielt.Market Asia - Search Results Client Component
 * Страница результатов поиска с реальным API
 */

import { useMemo, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchResultsView } from '@/components/rielt/SearchResults/SearchResultsView';
import { useListListings, useListNearbyListings, type RieltListParams } from '@go2asia/sdk/rielt';
import {
  rieltDtoToListing,
  rieltNearbyDtoToListingWithDistance,
  mergeSeedPresentationOverlay,
} from '@/components/rielt/adapters/rieltDtoToListing';
import type { SearchFilters, ListingWithDistance } from '@/components/rielt/types';
import { useRieltSeedListings } from '@/components/rielt/hooks/useRieltSeed';

function mapUrlToApiParams(searchParams: URLSearchParams): RieltListParams {
  const cityId = searchParams.get('city_id');
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
    city_id: cityId || undefined,
    listing_type,
    sort,
    bedrooms_min: bedrooms ? parseInt(bedrooms, 10) : undefined,
    page: 1,
    page_size: 50,
  };
}

function toOptionalInt(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function SearchResultsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [usingFallbackLocation, setUsingFallbackLocation] = useState(false);

  const apiParams = useMemo(() => mapUrlToApiParams(searchParams), [searchParams]);
  const nearbyMode = searchParams.get('nearby') === '1';

  const listingsQuery = useListListings(apiParams, !nearbyMode);
  const seedListingsQuery = useRieltSeedListings({ page: 1, page_size: 200 }, true);
  const nearbyQuery = useListNearbyListings(
    nearbyMode && userLocation
      ? {
          lat: userLocation.lat,
          lng: userLocation.lng,
          radius_km: 10,
          city_id: apiParams.city_id,
          country_id: apiParams.country_id,
          listing_type: apiParams.listing_type,
          page: apiParams.page,
          page_size: apiParams.page_size,
        }
      : null
  );
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUsingFallbackLocation(false);
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          setUsingFallbackLocation(true);
          setUserLocation({ lat: 13.7563, lng: 100.5018 });
        }
      );
    } else {
      setUsingFallbackLocation(true);
      setUserLocation({ lat: 13.7563, lng: 100.5018 });
    }
  }, []);

  const filtersFromURL: Partial<SearchFilters> = {};
  const cityId = searchParams.get('city_id');
  if (cityId) filtersFromURL.location = { city: cityId };
  const rentalType = searchParams.get('rentalType') as 'short-term' | 'long-term' | null;
  if (rentalType) filtersFromURL.rentalType = rentalType;
  const sortBy = searchParams.get('sortBy') as SearchFilters['sortBy'];
  if (sortBy) filtersFromURL.sortBy = sortBy;
  if (searchParams.get('onlyRF') === '1') filtersFromURL.onlyRF = true;
  if (searchParams.get('onlyPROVerified') === '1') filtersFromURL.onlyPROVerified = true;
  const guests = toOptionalInt(searchParams.get('guests'));
  if (guests != null) filtersFromURL.guests = guests;

  let listings: ListingWithDistance[] = [];
  const seedById = new Map((seedListingsQuery.data?.items ?? []).map((item) => [item.id, item]));

  if (nearbyMode) {
    if (nearbyQuery.data?.items) {
      listings = nearbyQuery.data.items.map((dto) => {
        const runtimeListing = rieltNearbyDtoToListingWithDistance(dto);
        const overlay = seedById.get(runtimeListing.id);
        return mergeSeedPresentationOverlay(runtimeListing, overlay) as ListingWithDistance;
      });
    }
  } else {
    if (listingsQuery.data?.items) {
      listings = listingsQuery.data.items.map((dto) => {
        const runtimeListing = rieltDtoToListing(dto);
        const overlay = seedById.get(runtimeListing.id);
        return mergeSeedPresentationOverlay(runtimeListing, overlay) as ListingWithDistance;
      });
    }
  }

  const isLoading = nearbyMode ? nearbyQuery.isLoading : listingsQuery.isLoading;
  const isError = nearbyMode ? nearbyQuery.isError : listingsQuery.isError;
  const error = nearbyMode ? nearbyQuery.error : listingsQuery.error;

  const handleSortChange = (sortBy: SearchFilters['sortBy']) => {
    const next = new URLSearchParams(searchParams.toString());
    if (sortBy) {
      next.set('sortBy', sortBy);
    } else {
      next.delete('sortBy');
    }
    router.replace(`/rielt/search?${next.toString()}`);
  };

  const toggleNearbyMode = () => {
    const next = new URLSearchParams(searchParams.toString());
    if (next.get('nearby') === '1') {
      next.delete('nearby');
    } else {
      next.set('nearby', '1');
    }
    router.replace(`/rielt/search?${next.toString()}`);
  };

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
      onSortChange={handleSortChange}
      nearbyMode={nearbyMode}
      onToggleNearbyMode={toggleNearbyMode}
      usingFallbackLocation={usingFallbackLocation}
    />
  );
}
