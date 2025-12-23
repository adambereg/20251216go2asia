/**
 * @go2asia/sdk/atlas
 * 
 * Atlas API hooks and functions.
 * This file re-exports atlas-related functionality from the generated SDK.
 */

import { useQuery } from '@tanstack/react-query';
import { customInstance } from './mutator';
import type { ContentCityDto, ContentCountryDto, ContentPlaceDto, ListResponse } from './content';

export const useGetCountries = (_params?: { limit?: number; cursor?: string }) => {
  return useQuery<ListResponse<ContentCountryDto>, Error>({
    queryKey: ['content', 'countries'],
    queryFn: async () => {
      return customInstance<ListResponse<ContentCountryDto>>({ method: 'GET' }, `/v1/content/countries`);
    },
    staleTime: 60_000,
  });
};

export const useGetCountryById = (idOrSlug: string) => {
  return useQuery<ContentCountryDto | null, Error>({
    queryKey: ['content', 'country', { idOrSlug }],
    enabled: Boolean(idOrSlug),
    queryFn: async () => {
      const res = await customInstance<ListResponse<ContentCountryDto>>({ method: 'GET' }, `/v1/content/countries`);
      return res.items.find((c) => c.id === idOrSlug || c.slug === idOrSlug) ?? null;
    },
    staleTime: 60_000,
  });
};

export const useGetCities = (_params?: { countryId?: string; limit?: number; cursor?: string }) => {
  const countryId = _params?.countryId;
  const qs = countryId ? `?countryId=${encodeURIComponent(countryId)}` : '';
  return useQuery<ListResponse<ContentCityDto>, Error>({
    queryKey: ['content', 'cities', { countryId: countryId ?? null }],
    queryFn: async () => {
      return customInstance<ListResponse<ContentCityDto>>({ method: 'GET' }, `/v1/content/cities${qs}`);
    },
    staleTime: 60_000,
  });
};

export const useGetCityById = (idOrSlug: string) => {
  return useQuery<ContentCityDto | null, Error>({
    queryKey: ['content', 'city', { idOrSlug }],
    enabled: Boolean(idOrSlug),
    queryFn: async () => {
      const res = await customInstance<ListResponse<ContentCityDto>>({ method: 'GET' }, `/v1/content/cities`);
      return res.items.find((c) => c.id === idOrSlug || c.slug === idOrSlug) ?? null;
    },
    staleTime: 60_000,
  });
};

export const useGetPlaces = (_params?: { cityId?: string; limit?: number; cursor?: string }) => {
  const sp = new URLSearchParams();
  if (_params?.cityId) sp.set('cityId', _params.cityId);
  if (_params?.limit) sp.set('limit', String(_params.limit));
  const qs = sp.toString() ? `?${sp.toString()}` : '';
  return useQuery<ListResponse<ContentPlaceDto>, Error>({
    queryKey: ['content', 'places', { cityId: _params?.cityId ?? null, limit: _params?.limit ?? null }],
    queryFn: async () => {
      return customInstance<ListResponse<ContentPlaceDto>>({ method: 'GET' }, `/v1/content/places${qs}`);
    },
    staleTime: 60_000,
  });
};

export const useGetPlaceById = (idOrSlug: string) => {
  return useQuery<ContentPlaceDto, Error>({
    queryKey: ['content', 'place', { idOrSlug }],
    enabled: Boolean(idOrSlug),
    queryFn: async () => {
      return customInstance<ContentPlaceDto>({ method: 'GET' }, `/v1/content/places/${idOrSlug}`);
    },
    staleTime: 60_000,
  });
};



