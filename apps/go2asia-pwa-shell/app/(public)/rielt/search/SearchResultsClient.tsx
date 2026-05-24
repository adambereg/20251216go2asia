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
  const countryId = searchParams.get('country_id');
  const cityId = searchParams.get('city_id');
  const rentalType = searchParams.get('rentalType');
  const sortBy = searchParams.get('sortBy');
  const bedrooms = searchParams.get('bedrooms') || searchParams.get('bedroomsMin');
  const bedroomsMax = searchParams.get('bedroomsMax');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const listing_type =
    rentalType === 'long-term' ? 'rent_long' : rentalType === 'short-term' ? 'rent_short' : undefined;
  const sort: 'newest' | 'price_asc' | 'price_desc' =
    sortBy === 'price-asc'
      ? 'price_asc'
      : sortBy === 'price-desc'
        ? 'price_desc'
        : 'newest';

  const parsedBedrooms = bedrooms ? parseInt(bedrooms, 10) : NaN;
  const bedroomsMin = Number.isFinite(parsedBedrooms) ? parsedBedrooms : undefined;
  const parsedBedroomsMax = bedroomsMax ? parseInt(bedroomsMax, 10) : NaN;
  const bedroomsMaxValue = Number.isFinite(parsedBedroomsMax) ? parsedBedroomsMax : undefined;
  const parsedMinPrice = minPrice ? parseInt(minPrice, 10) : NaN;
  const minPriceValue = Number.isFinite(parsedMinPrice) ? parsedMinPrice : undefined;
  const parsedMaxPrice = maxPrice ? parseInt(maxPrice, 10) : NaN;
  const maxPriceValue = Number.isFinite(parsedMaxPrice) ? parsedMaxPrice : undefined;

  return {
    country_id: countryId || undefined,
    city_id: cityId || undefined,
    listing_type,
    sort,
    min_price: minPriceValue,
    max_price: maxPriceValue,
    bedrooms_min: bedroomsMin,
    bedrooms_max: bedroomsMaxValue,
    page: 1,
    page_size: 50,
  };
}

function toOptionalInt(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toOptionalBool(value: string | null): boolean | undefined {
  if (!value) return undefined;
  return value === '1' || value === 'true';
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
  const countryId = searchParams.get('country_id');
  const cityId = searchParams.get('city_id');
  const district = searchParams.get('district');
  if (countryId || cityId || district) {
    filtersFromURL.location = {
      country: countryId || undefined,
      city: cityId || undefined,
      district: district || undefined,
    };
  }
  const rentalType = searchParams.get('rentalType') as 'short-term' | 'long-term' | null;
  if (rentalType) filtersFromURL.rentalType = rentalType;
  const sortBy = searchParams.get('sortBy') as SearchFilters['sortBy'];
  if (sortBy) filtersFromURL.sortBy = sortBy;
  if (searchParams.get('onlyRF') === '1') filtersFromURL.onlyRF = true;
  if (searchParams.get('onlyPROVerified') === '1') filtersFromURL.onlyPROVerified = true;
  const guests = toOptionalInt(searchParams.get('guests'));
  if (guests != null) filtersFromURL.guests = guests;
  const minPrice = toOptionalInt(searchParams.get('minPrice'));
  const maxPrice = toOptionalInt(searchParams.get('maxPrice'));
  if (minPrice != null || maxPrice != null) {
    filtersFromURL.priceRange = { min: minPrice, max: maxPrice };
  }
  const bedroomsMin = toOptionalInt(searchParams.get('bedroomsMin'));
  if (bedroomsMin != null) filtersFromURL.bedroomsMin = bedroomsMin;
  const bedroomsMax = toOptionalInt(searchParams.get('bedroomsMax'));
  if (bedroomsMax != null) filtersFromURL.bedroomsMax = bedroomsMax;
  const moveInMonth = searchParams.get('moveInMonth');
  if (moveInMonth) filtersFromURL.moveInMonth = moveInMonth;
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  if (checkIn) filtersFromURL.checkIn = checkIn;
  if (checkOut) filtersFromURL.checkOut = checkOut;
  filtersFromURL.concierge = toOptionalBool(searchParams.get('concierge'));
  filtersFromURL.furnished = toOptionalBool(searchParams.get('furnished'));
  filtersFromURL.serviced = toOptionalBool(searchParams.get('serviced'));
  filtersFromURL.familyFriendly = toOptionalBool(searchParams.get('familyFriendly'));
  filtersFromURL.nomadFriendly = toOptionalBool(searchParams.get('nomadFriendly'));
  filtersFromURL.nearSea = toOptionalBool(searchParams.get('nearSea'));
  filtersFromURL.nearCenter = toOptionalBool(searchParams.get('nearCenter'));
  filtersFromURL.quietArea = toOptionalBool(searchParams.get('quietArea'));
  filtersFromURL.expatArea = toOptionalBool(searchParams.get('expatArea'));
  filtersFromURL.readyToMove = toOptionalBool(searchParams.get('readyToMove'));

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

  if (filtersFromURL.onlyRF) {
    listings = listings.filter((listing) => Boolean(listing.isRF));
  }
  if (filtersFromURL.onlyPROVerified) {
    listings = listings.filter((listing) => Boolean(listing.proVerification?.verified));
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
    const errorPayload = error as { error?: { code?: string; message?: string }; status?: number; message?: string };
    const errorMessage =
      errorPayload?.error?.message ??
      errorPayload?.message ??
      'Не удалось загрузить объявления. Попробуйте чуть позже.';

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-amber-900 mb-2">Ошибка загрузки</h2>
          <p className="text-amber-800 mb-4">{errorMessage}</p>
          {errorPayload?.error?.code === 'ROUTE_RESERVED_NOT_ENABLED' ? (
            <p className="text-xs text-amber-700 mb-4">
              Сервис объявлений временно недоступен.
            </p>
          ) : null}
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
