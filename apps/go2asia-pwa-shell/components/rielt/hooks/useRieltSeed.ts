'use client';

import { useQuery } from '@tanstack/react-query';
import type { Listing, ListingWithDistance } from '../types';

type SeedListResponse = {
  source: 'seed';
  mode: 'list';
  items: Listing[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
};

type SeedNearbyResponse = {
  source: 'seed';
  mode: 'nearby';
  items: ListingWithDistance[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
};

type SeedDetailResponse = {
  source: 'seed';
  listing: Listing;
};

type SeedParams = {
  city_id?: string;
  listing_type?: string;
  bedrooms_min?: number;
  bedrooms_max?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc';
  page?: number;
  page_size?: number;
  only_rf?: boolean;
  only_pro_verified?: boolean;
};

function buildParams(params?: SeedParams): string {
  const sp = new URLSearchParams();
  if (params?.city_id) sp.set('city_id', params.city_id);
  if (params?.listing_type) sp.set('listing_type', params.listing_type);
  if (params?.bedrooms_min != null) sp.set('bedrooms_min', String(params.bedrooms_min));
  if (params?.bedrooms_max != null) sp.set('bedrooms_max', String(params.bedrooms_max));
  if (params?.sort) sp.set('sort', params.sort);
  if (params?.page != null) sp.set('page', String(params.page));
  if (params?.page_size != null) sp.set('page_size', String(params.page_size));
  if (params?.only_rf) sp.set('only_rf', '1');
  if (params?.only_pro_verified) sp.set('only_pro_verified', '1');
  const query = sp.toString();
  return query ? `?${query}` : '';
}

export function useRieltSeedListings(params?: SeedParams, enabled = true) {
  const query = buildParams(params);
  return useQuery<SeedListResponse, Error>({
    queryKey: ['rielt-seed', 'listings', params ?? {}],
    enabled,
    staleTime: 60_000,
    queryFn: async () => {
      const response = await fetch(`/api/rielt-seed/listings${query}`, { method: 'GET' });
      if (!response.ok) throw new Error(`Seed listings request failed (${response.status})`);
      return response.json();
    },
  });
}

export function useRieltSeedNearbyListings(
  params: (SeedParams & { lat: number; lng: number; radius_km: number }) | null
) {
  const enabled =
    Boolean(params) &&
    params!.lat != null &&
    params!.lng != null &&
    params!.radius_km != null &&
    params!.radius_km > 0;

  return useQuery<SeedNearbyResponse, Error>({
    queryKey: ['rielt-seed', 'nearby', params ?? {}],
    enabled,
    staleTime: 60_000,
    queryFn: async () => {
      const sp = new URLSearchParams();
      sp.set('lat', String(params!.lat));
      sp.set('lng', String(params!.lng));
      sp.set('radius_km', String(params!.radius_km));
      if (params?.city_id) sp.set('city_id', params.city_id);
      if (params?.listing_type) sp.set('listing_type', params.listing_type);
      if (params?.bedrooms_min != null) sp.set('bedrooms_min', String(params.bedrooms_min));
      if (params?.bedrooms_max != null) sp.set('bedrooms_max', String(params.bedrooms_max));
      if (params?.sort) sp.set('sort', params.sort);
      if (params?.page != null) sp.set('page', String(params.page));
      if (params?.page_size != null) sp.set('page_size', String(params.page_size));
      if (params?.only_rf) sp.set('only_rf', '1');
      if (params?.only_pro_verified) sp.set('only_pro_verified', '1');
      const response = await fetch(`/api/rielt-seed/listings?${sp.toString()}`, { method: 'GET' });
      if (!response.ok) throw new Error(`Seed nearby request failed (${response.status})`);
      return response.json();
    },
  });
}

export async function fetchRieltSeedListing(idOrSlug: string): Promise<SeedDetailResponse | null> {
  const response = await fetch(`/api/rielt-seed/listings/${encodeURIComponent(idOrSlug)}`, { method: 'GET' });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Seed detail request failed (${response.status})`);
  return response.json();
}
