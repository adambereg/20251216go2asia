/**
 * @go2asia/sdk/rielt
 *
 * Rielt API hooks and functions.
 * Public endpoints: listings list, listing detail.
 */

import { useQuery } from '@tanstack/react-query';
import { customInstance } from './mutator';

// ---------------------------------------------------------------------------
// DTO types (match rielt-service public response shapes)
// ---------------------------------------------------------------------------

export interface RieltPriceDto {
  amount: number;
  currency: string;
  period: string;
}

export interface RieltGeoDto {
  countryId: string;
  cityId: string | null;
}

export interface RieltMediaDto {
  coverUrl: string | null;
  photos: string[];
}

export interface RieltListingDto {
  id: string;
  slug: string;
  title: string;
  listingType: string;
  price: RieltPriceDto;
  bedrooms: number | null;
  bathrooms: number | null;
  areaSqm: number | null;
  geo: RieltGeoDto;
  media: RieltMediaDto;
  createdAt: string | null;
  updatedAt: string | null;
  publishedAt: string | null;
}

export interface RieltNearbyListingDto extends RieltListingDto {
  distanceMeters?: number;
}

export interface RieltListResponse {
  items: RieltListingDto[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export interface RieltDetailResponse {
  listing: RieltListingDto;
}

export interface RieltNearbyListResponse {
  anchor: {
    lat: number;
    lng: number;
    radiusKm: number;
  };
  items: RieltNearbyListingDto[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

// ---------------------------------------------------------------------------
// Query params (strictly aligned with backend)
// ---------------------------------------------------------------------------

export interface RieltListParams {
  country_id?: string;
  city_id?: string;
  listing_type?: string; // rent_short | rent_long | sale
  min_price?: number;
  max_price?: number;
  bedrooms_min?: number;
  bedrooms_max?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc';
  page?: number;
  page_size?: number;
}

export interface RieltNearbyParams {
  lat: number;
  lng: number;
  radius_km: number;
  country_id?: string;
  city_id?: string;
  listing_type?: string;
  page?: number;
  page_size?: number;
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

export function useListListings(params?: RieltListParams) {
  const sp = new URLSearchParams();
  if (params?.country_id) sp.set('country_id', params.country_id);
  if (params?.city_id) sp.set('city_id', params.city_id);
  if (params?.listing_type) sp.set('listing_type', params.listing_type);
  if (params?.min_price != null) sp.set('min_price', String(params.min_price));
  if (params?.max_price != null) sp.set('max_price', String(params.max_price));
  if (params?.bedrooms_min != null) sp.set('bedrooms_min', String(params.bedrooms_min));
  if (params?.bedrooms_max != null) sp.set('bedrooms_max', String(params.bedrooms_max));
  if (params?.sort) sp.set('sort', params.sort);
  if (params?.page != null) sp.set('page', String(params.page));
  if (params?.page_size != null) sp.set('page_size', String(params.page_size));

  const qs = sp.toString() ? `?${sp.toString()}` : '';

  return useQuery<RieltListResponse, Error>({
    queryKey: ['rielt', 'listings', params ?? {}],
    queryFn: async () => {
      return customInstance<RieltListResponse>({ method: 'GET' }, `/v1/rielt/listings${qs}`);
    },
    staleTime: 30_000,
  });
}

export function useGetListing(idOrSlug: string) {
  return useQuery<RieltDetailResponse, Error>({
    queryKey: ['rielt', 'listing', idOrSlug],
    enabled: Boolean(idOrSlug),
    queryFn: async () => {
      return customInstance<RieltDetailResponse>(
        { method: 'GET' },
        `/v1/rielt/listings/${encodeURIComponent(idOrSlug)}`
      );
    },
    staleTime: 60_000,
  });
}

export function useListNearbyListings(params?: RieltNearbyParams | null) {
  const enabled = Boolean(
    params &&
      params.lat != null &&
      params.lng != null &&
      params.radius_km != null &&
      params.radius_km > 0
  );

  const sp = new URLSearchParams();
  if (params?.lat != null) sp.set('lat', String(params.lat));
  if (params?.lng != null) sp.set('lng', String(params.lng));
  if (params?.radius_km != null) sp.set('radius_km', String(params.radius_km));
  if (params?.country_id) sp.set('country_id', params.country_id);
  if (params?.city_id) sp.set('city_id', params.city_id);
  if (params?.listing_type) sp.set('listing_type', params.listing_type);
  if (params?.page != null) sp.set('page', String(params.page));
  if (params?.page_size != null) sp.set('page_size', String(params.page_size));

  const qs = sp.toString() ? `?${sp.toString()}` : '';

  return useQuery<RieltNearbyListResponse, Error>({
    queryKey: ['rielt', 'listings', 'nearby', params ?? {}],
    enabled,
    queryFn: async () => {
      return customInstance<RieltNearbyListResponse>(
        { method: 'GET' },
        `/v1/rielt/listings/nearby${qs}`
      );
    },
    staleTime: 30_000,
  });
}

// ---------------------------------------------------------------------------
// Raw fetch (for server components)
// ---------------------------------------------------------------------------

export async function fetchListing(idOrSlug: string): Promise<RieltDetailResponse | null> {
  try {
    return await customInstance<RieltDetailResponse>(
      { method: 'GET' },
      `/v1/rielt/listings/${encodeURIComponent(idOrSlug)}`
    );
  } catch {
    return null;
  }
}

export async function fetchListings(params?: RieltListParams): Promise<RieltListResponse | null> {
  try {
    const sp = new URLSearchParams();
    if (params?.country_id) sp.set('country_id', params.country_id);
    if (params?.city_id) sp.set('city_id', params.city_id);
    if (params?.listing_type) sp.set('listing_type', params.listing_type);
    if (params?.min_price != null) sp.set('min_price', String(params.min_price));
    if (params?.max_price != null) sp.set('max_price', String(params.max_price));
    if (params?.bedrooms_min != null) sp.set('bedrooms_min', String(params.bedrooms_min));
    if (params?.bedrooms_max != null) sp.set('bedrooms_max', String(params.bedrooms_max));
    if (params?.sort) sp.set('sort', params.sort);
    if (params?.page != null) sp.set('page', String(params.page));
    if (params?.page_size != null) sp.set('page_size', String(params.page_size));
    const qs = sp.toString() ? `?${sp.toString()}` : '';
    return await customInstance<RieltListResponse>({ method: 'GET' }, `/v1/rielt/listings${qs}`);
  } catch {
    return null;
  }
}
