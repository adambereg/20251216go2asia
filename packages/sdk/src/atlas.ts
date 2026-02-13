/**
 * @go2asia/sdk/atlas
 * 
 * Atlas API hooks and functions.
 * This file re-exports atlas-related functionality from the generated SDK.
 */

import { useQuery } from '@tanstack/react-query';
import { customInstance } from './mutator';
import { listPlaceTabs } from './content';
import type { ContentCityDto, ContentCountryDto, ContentPlaceDto, ContentTabDto, ListResponse } from './content';

export const useGetCountries = (_params?: { limit?: number; cursor?: string; enabled?: boolean }) => {
  const enabled = typeof _params?.enabled === 'boolean' ? _params.enabled : true;
  return useQuery<ListResponse<ContentCountryDto>, Error>({
    queryKey: ['content', 'countries'],
    enabled,
    queryFn: async () => {
      const endpoint = `/v1/content/countries`;
      try {
        const data = await customInstance<ListResponse<ContentCountryDto>>({ method: 'GET' }, endpoint);
        if (!data?.items || data.items.length === 0) {
          // eslint-disable-next-line no-console
          console.warn(`FALLBACK_TO_MOCKS: reason=EMPTY endpoint=${endpoint}`);
        }
        return data;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(
          `FALLBACK_TO_MOCKS: reason=ERROR endpoint=${endpoint}`,
          err instanceof Error ? err.message : err
        );
        throw err as Error;
      }
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

export const useGetCities = (_params?: {
  countryId?: string;
  q?: string;
  type?: string;
  size?: string;
  sea?: boolean;
  price?: string;
  nightlife?: string;
  sort?: 'size_desc' | 'name_asc' | 'name_desc';
  limit?: number;
  cursor?: string; // reserved for future pagination
  enabled?: boolean;
}) => {
  const enabled = typeof _params?.enabled === 'boolean' ? _params.enabled : true;

  const sp = new URLSearchParams();
  if (_params?.countryId) sp.set('countryId', _params.countryId);
  if (_params?.q) sp.set('q', _params.q);
  if (_params?.type) sp.set('type', _params.type);
  if (_params?.size) sp.set('size', _params.size);
  if (typeof _params?.sea === 'boolean') sp.set('sea', String(_params.sea));
  if (_params?.price) sp.set('price', _params.price);
  if (_params?.nightlife) sp.set('nightlife', _params.nightlife);
  if (_params?.sort) sp.set('sort', _params.sort);
  if (_params?.limit) sp.set('limit', String(_params.limit));
  // cursor is reserved; accepted but not used by API yet
  if (_params?.cursor) sp.set('cursor', _params.cursor);

  const qs = sp.toString() ? `?${sp.toString()}` : '';

  return useQuery<ListResponse<ContentCityDto>, Error>({
    queryKey: [
      'content',
      'cities',
      {
        countryId: _params?.countryId ?? null,
        q: _params?.q ?? null,
        type: _params?.type ?? null,
        size: _params?.size ?? null,
        sea: typeof _params?.sea === 'boolean' ? _params.sea : null,
        price: _params?.price ?? null,
        nightlife: _params?.nightlife ?? null,
        sort: _params?.sort ?? 'size_desc',
        limit: _params?.limit ?? null,
      },
    ],
    enabled,
    queryFn: async () => {
      const endpoint = `/v1/content/cities`;
      try {
        const data = await customInstance<ListResponse<ContentCityDto>>({ method: 'GET' }, `${endpoint}${qs}`);
        if (!data?.items || data.items.length === 0) {
          // eslint-disable-next-line no-console
          console.warn(`FALLBACK_TO_MOCKS: reason=EMPTY endpoint=${endpoint}`);
        }
        return data;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(
          `FALLBACK_TO_MOCKS: reason=ERROR endpoint=${endpoint}`,
          err instanceof Error ? err.message : err
        );
        throw err as Error;
      }
    },
    staleTime: 60_000,
  });
};

export const useGetCityById = (idOrSlug: string) => {
  return useQuery<ContentCityDto | null, Error>({
    queryKey: ['content', 'city', { idOrSlug }],
    enabled: Boolean(idOrSlug),
    queryFn: async () => {
      // Use dedicated endpoint to support alias/redirect resolution via city_aliases.
      try {
        return await customInstance<ContentCityDto>({ method: 'GET' }, `/v1/content/cities/${encodeURIComponent(idOrSlug)}`);
      } catch (err) {
        // Preserve previous behavior: return null on 404-like failures
        // eslint-disable-next-line no-console
        console.warn(`useGetCityById: failed for ${idOrSlug}`, err instanceof Error ? err.message : err);
        return null;
      }
    },
    staleTime: 60_000,
  });
};

export const useGetPlaces = (_params?: {
  cityId?: string;
  countryId?: string;
  kind?: 'showplace' | 'business';
  limit?: number;
  cursor?: string;
  enabled?: boolean;
}) => {
  const sp = new URLSearchParams();
  if (_params?.cityId) sp.set('cityId', _params.cityId);
  if (_params?.countryId) sp.set('countryId', _params.countryId);
  if (_params?.kind) sp.set('kind', _params.kind);
  if (_params?.limit) sp.set('limit', String(_params.limit));
  const enabled = typeof _params?.enabled === 'boolean' ? _params.enabled : true;
  const qs = sp.toString() ? `?${sp.toString()}` : '';
  return useQuery<ListResponse<ContentPlaceDto>, Error>({
    queryKey: [
      'content',
      'places',
      {
        cityId: _params?.cityId ?? null,
        countryId: _params?.countryId ?? null,
        kind: _params?.kind ?? null,
        limit: _params?.limit ?? null,
      },
    ],
    enabled,
    queryFn: async () => {
      const endpoint = `/v1/content/places`;
      try {
        const data = await customInstance<ListResponse<ContentPlaceDto>>({ method: 'GET' }, `${endpoint}${qs}`);
        if (!data?.items || data.items.length === 0) {
          // eslint-disable-next-line no-console
          console.warn(`FALLBACK_TO_MOCKS: reason=EMPTY endpoint=${endpoint}`);
        }
        return data;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(
          `FALLBACK_TO_MOCKS: reason=ERROR endpoint=${endpoint}`,
          err instanceof Error ? err.message : err
        );
        throw err as Error;
      }
    },
    staleTime: 60_000,
  });
};

export const useGetPlaceById = (idOrSlug: string) => {
  return useQuery<ContentPlaceDto, Error>({
    queryKey: ['content', 'place', { idOrSlug }],
    enabled: Boolean(idOrSlug),
    queryFn: async () => {
      const endpoint = `/v1/content/places/${idOrSlug}`;
      try {
        return await customInstance<ContentPlaceDto>({ method: 'GET' }, endpoint);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(
          `FALLBACK_TO_MOCKS: reason=ERROR endpoint=/v1/content/places/{idOrSlug}`,
          err instanceof Error ? err.message : err
        );
        throw err as Error;
      }
    },
    staleTime: 60_000,
  });
};

export const useGetPlaceTabs = (
  idOrSlug: string,
  params?: { lang?: string; tabKey?: string; enabled?: boolean }
) => {
  const enabled = typeof params?.enabled === 'boolean' ? params.enabled : Boolean(idOrSlug);
  return useQuery<ListResponse<ContentTabDto>, Error>({
    queryKey: ['content', 'place', 'tabs', { idOrSlug, lang: params?.lang, tabKey: params?.tabKey }],
    enabled,
    queryFn: async () => {
      return await listPlaceTabs(idOrSlug, { lang: params?.lang, tabKey: params?.tabKey });
    },
    staleTime: 60_000,
  });
};



