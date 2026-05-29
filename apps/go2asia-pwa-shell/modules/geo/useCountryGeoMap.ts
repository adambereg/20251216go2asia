'use client';

import { useMemo } from 'react';
import type { ContentCityDto, ContentPlaceDto } from '@go2asia/sdk/content';
import { useGetCities, useGetPlaces } from '@go2asia/sdk/atlas';
import { getDataSource } from '@/mocks/dto';
import { mockRepo } from '@/mocks/repo';
import type { GeoItem, GeoMapResponse } from './geoContract';

function parseCoord(raw: string | null): number | null {
  if (raw == null) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function toGeoCityItem(city: ContentCityDto): GeoItem | null {
  const lat = parseCoord(city.latitude);
  const lng = parseCoord(city.longitude);
  if (lat == null || lng == null) return null;
  return {
    id: city.id,
    type: 'city',
    subtype: 'city',
    title: city.name,
    lat,
    lng,
    priority: 50,
    meta: {
      slug: city.slug,
      countryId: city.countryId,
    },
  };
}

function toGeoPlaceItem(place: ContentPlaceDto): GeoItem | null {
  const lat = parseCoord(place.latitude);
  const lng = parseCoord(place.longitude);
  if (lat == null || lng == null) return null;
  const subtype = place.category || place.type || place.kind || undefined;
  return {
    id: place.id,
    type: 'place',
    subtype,
    title: place.name,
    lat,
    lng,
    priority: 10,
    meta: {
      slug: place.slug,
      kind: place.kind,
      type: place.type,
      category: place.category,
      countryId: place.countryId,
      cityId: place.cityId,
    },
  };
}

export interface UseCountryGeoMapResult {
  geo: GeoMapResponse;
  isLoading: boolean;
  error: string | null;
  stats: {
    citiesTotal: number;
    placesTotal: number;
    citiesWithCoords: number;
    placesWithCoords: number;
    dataSource: 'mock' | 'api';
  };
}

/**
 * Country map Geo Layer adapter.
 *
 * Important:
 * - UI consumes Geo Contract v1 (`GeoMapResponse`)
 * - Data source today: content-service endpoints (via SDK) OR mockRepo
 * - Future: replace implementation with geo-service without changing UI
 */
export function useCountryGeoMap(countryId: string | undefined): UseCountryGeoMapResult {
  const dataSource = getDataSource();

  const apiCities = useGetCities({
    countryId: dataSource === 'api' ? countryId : undefined,
    enabled: dataSource === 'api' && Boolean(countryId),
  });

  const apiPlaces = useGetPlaces({
    countryId: dataSource === 'api' ? countryId : undefined,
    // content-service supports up to 500; country-level map must be clustered anyway.
    limit: 500,
    enabled: dataSource === 'api' && Boolean(countryId),
  });

  const mock = useMemo(() => {
    if (dataSource !== 'mock' || !countryId) return null;
    const cities = mockRepo.atlas.listCities().filter((c) => c.countryId === countryId);

    // mock places dataset uses human-readable country names (e.g. "Thailand")
    const countryNameToMockKey: Record<string, string> = {
      th: 'Thailand',
      vn: 'Vietnam',
      la: 'Laos',
      kh: 'Cambodia',
      my: 'Malaysia',
      sg: 'Singapore',
      ph: 'Philippines',
      id: 'Indonesia',
      jp: 'Japan',
      kr: 'South Korea',
    };
    const mockCountryKey = countryNameToMockKey[countryId] ?? null;
    const places = mockRepo.atlas
      .listPlaces()
      .filter((p) => (mockCountryKey ? p.country === mockCountryKey : false));
    return { cities, places };
  }, [countryId, dataSource]);

  const geo = useMemo<GeoMapResponse>(() => {
    const generatedAt = new Date().toISOString();

    if (dataSource === 'mock') {
      const citiesWithCoords =
        mock?.cities
          .map((c): GeoItem | null => {
            if (typeof c.latitude !== 'number' || typeof c.longitude !== 'number') return null;
            return {
              id: c.id,
              type: 'city',
              subtype: 'city',
              title: c.name,
              lat: c.latitude,
              lng: c.longitude,
              priority: 50,
              meta: { countryId: c.countryId },
            };
          })
          .filter((x): x is GeoItem => Boolean(x)) ?? [];

      const placesWithCoords =
        mock?.places
          .map((p): GeoItem | null => {
            if (typeof p.latitude !== 'number' || typeof p.longitude !== 'number') return null;
            return {
              id: p.id,
              type: 'place',
              subtype: p.categories?.[0] ?? p.type ?? 'place',
              title: p.name,
              lat: p.latitude,
              lng: p.longitude,
              priority: 10,
              meta: { country: p.country, city: p.city, slug: p.slug },
            };
          })
          .filter((x): x is GeoItem => Boolean(x)) ?? [];

      return {
        layers: { cities: citiesWithCoords, places: placesWithCoords },
        meta: { contractVersion: 'v1', generatedAt, source: 'mock' },
      };
    }

    const cities = (apiCities.data?.items ?? []).map(toGeoCityItem).filter((x): x is GeoItem => Boolean(x));
    const places = (apiPlaces.data?.items ?? []).map(toGeoPlaceItem).filter((x): x is GeoItem => Boolean(x));

    return {
      layers: { cities, places },
      meta: { contractVersion: 'v1', generatedAt, source: 'content-service' },
    };
  }, [apiCities.data?.items, apiPlaces.data?.items, dataSource, mock]);

  const isLoading = dataSource === 'api' ? apiCities.isLoading || apiPlaces.isLoading : false;
  const error =
    dataSource === 'api'
      ? (apiCities.error?.message ?? apiPlaces.error?.message ?? null)
      : null;

  const stats = useMemo(() => {
    const citiesTotal = dataSource === 'api' ? (apiCities.data?.items?.length ?? 0) : (mock?.cities.length ?? 0);
    const placesTotal = dataSource === 'api' ? (apiPlaces.data?.items?.length ?? 0) : (mock?.places.length ?? 0);
    const citiesWithCoords = geo.layers.cities?.length ?? 0;
    const placesWithCoords = geo.layers.places?.length ?? 0;
    return {
      citiesTotal,
      placesTotal,
      citiesWithCoords,
      placesWithCoords,
      dataSource,
    };
  }, [apiCities.data?.items?.length, apiPlaces.data?.items?.length, dataSource, geo.layers, mock?.cities.length, mock?.places.length]);

  return { geo, isLoading, error, stats };
}

