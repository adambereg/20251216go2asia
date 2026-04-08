/**
 * Rielt.Market Asia - Geo
 * Функции работы с геолокацией
 */

import type { Coordinates, GeoPrecision, Listing, ListingWithDistance } from '../types';

/**
 * Вычислить расстояние между двумя точками (Haversine formula)
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // Радиус Земли в метрах
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Преобразовать градусы в радианы
 */
function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Вычислить время ходьбы (примерно 80 м/мин)
 */
export function calculateWalkingTime(distanceMeters: number): number {
  return Math.round(distanceMeters / 80); // минуты
}

/**
 * Добавить расстояние к объявлениям относительно точки
 */
export function addDistancesToListings(
  listings: Listing[],
  center: Coordinates
): ListingWithDistance[] {
  return listings.map((listing) => {
    const coordinates = listing.address.coordinates;
    if (!coordinates) {
      return {
        ...listing,
        distance: undefined,
        walkingTime: undefined,
      };
    }

    const distance = calculateDistance(
      center.lat,
      center.lng,
      coordinates.lat,
      coordinates.lng
    );
    return {
      ...listing,
      distance,
      walkingTime: calculateWalkingTime(distance),
    };
  });
}

/**
 * Форматировать расстояние для отображения
 */
export function formatDistance(distanceMeters: number): string {
  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)} м`;
  }
  return `${(distanceMeters / 1000).toFixed(1)} км`;
}

const CITY_CENTERS: Record<string, Coordinates> = {
  bangkok: { lat: 13.7563, lng: 100.5018 },
  phuket: { lat: 7.8804, lng: 98.3923 },
  da_nang: { lat: 16.0544, lng: 108.2022 },
  'da-nang': { lat: 16.0544, lng: 108.2022 },
  danang: { lat: 16.0544, lng: 108.2022 },
  ho_chi_minh_city: { lat: 10.8231, lng: 106.6297 },
  'ho-chi-minh-city': { lat: 10.8231, lng: 106.6297 },
  hcmc: { lat: 10.8231, lng: 106.6297 },
};

function normalizeCity(cityId: string | undefined): string {
  return (cityId ?? '').trim().toLowerCase();
}

export function resolveCityCenter(cityId: string | undefined): Coordinates | null {
  const normalized = normalizeCity(cityId);
  if (!normalized) return null;
  return CITY_CENTERS[normalized] ?? null;
}

export function resolveGeoPrecision(listing: Listing): GeoPrecision {
  if (listing.address.geoPrecision) return listing.address.geoPrecision;
  if (listing.address.coordinates) return 'exact';
  if (listing.address.district) return 'area';
  if (listing.address.city) return 'city';
  return 'none';
}

export function getGeoPrecisionLabel(precision: GeoPrecision): string {
  if (precision === 'exact') return 'Точное расположение';
  if (precision === 'approximate') return 'Ориентировочное расположение';
  if (precision === 'area') return 'Район размещения';
  if (precision === 'city') return 'Расположение в городе';
  return 'Локация уточняется';
}

export function getGeoPrecisionHint(precision: GeoPrecision): string {
  if (precision === 'exact') return 'Точка на карте показывает местоположение объекта.';
  if (precision === 'approximate') return 'Для приватности точка на карте показана ориентировочно.';
  if (precision === 'area') return 'Показан район. Точный адрес уточняется после запроса.';
  if (precision === 'city') return 'Показан город. Точное расположение уточняйте у владельца.';
  return 'Точная локация для этого объявления пока не отображается.';
}

export function getMapRadiusByPrecision(precision: GeoPrecision): number | null {
  if (precision === 'approximate') return 500;
  if (precision === 'area') return 1200;
  if (precision === 'city') return 3000;
  return null;
}

export function resolveMapPoint(listing: Listing): {
  coordinates: Coordinates | null;
  precision: GeoPrecision;
  radiusM: number | null;
  source: 'listing_public' | 'legacy_city_fallback' | 'none';
} {
  const precision = resolveGeoPrecision(listing);
  const radiusM = listing.address.geoAccuracyRadiusM ?? getMapRadiusByPrecision(precision);
  if (listing.address.coordinates) {
    return {
      coordinates: listing.address.coordinates,
      precision,
      radiusM,
      source: 'listing_public',
    };
  }

  // Legacy fallback for old payloads without public geo point.
  const cityCenter = resolveCityCenter(listing.address.cityId ?? listing.address.city);
  if (cityCenter) {
    return {
      coordinates: cityCenter,
      precision: listing.address.district ? 'area' : 'city',
      radiusM: getMapRadiusByPrecision(listing.address.district ? 'area' : 'city'),
      source: 'legacy_city_fallback',
    };
  }

  return {
    coordinates: null,
    precision: 'none',
    radiusM: null,
    source: 'none',
  };
}

