export interface ListingPathParams {
  idOrSlug: string;
}

export interface ListListingsQuery {
  countryId: string | null;
  cityId: string | null;
  listingType: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  bedroomsMin: number | null;
  bedroomsMax: number | null;
  sort: 'newest' | 'price_asc' | 'price_desc';
  page: number;
  pageSize: number;
  offset: number;
}

export interface NearbyListingsQuery {
  lat: number;
  lng: number;
  radiusKm: number;
  countryId: string | null;
  cityId: string | null;
  listingType: string | null;
  page: number;
  pageSize: number;
  offset: number;
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function parseListingPathParams(idOrSlug: string): ListingPathParams | null {
  if (!isNonEmptyString(idOrSlug)) return null;
  return { idOrSlug: idOrSlug.trim() };
}

function parseOptionalNonNegativeNumber(value: string | null): number | null | undefined {
  if (value === null || value.trim().length === 0) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return undefined;
  return parsed;
}

function parseRequiredNumber(value: string | null): number | undefined {
  if (value === null || value.trim().length === 0) return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return undefined;
  return parsed;
}

function parseOptionalNonNegativeInt(value: string | null): number | null | undefined {
  if (value === null || value.trim().length === 0) return null;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) return undefined;
  return parsed;
}

function parseOptionalFilterString(value: string | null): string | null {
  if (value === null) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseSort(value: string | null): ListListingsQuery['sort'] | undefined {
  if (value === null || value.trim().length === 0) return 'newest';
  if (value === 'newest' || value === 'price_asc' || value === 'price_desc') return value;
  return undefined;
}

export function parseListListingsQuery(searchParams: URLSearchParams): ListListingsQuery | null {
  const countryId = parseOptionalFilterString(searchParams.get('country_id'));
  const cityId = parseOptionalFilterString(searchParams.get('city_id'));
  const listingType = parseOptionalFilterString(searchParams.get('listing_type'));
  const minPrice = parseOptionalNonNegativeNumber(searchParams.get('min_price'));
  const maxPrice = parseOptionalNonNegativeNumber(searchParams.get('max_price'));
  const bedroomsMin = parseOptionalNonNegativeInt(searchParams.get('bedrooms_min'));
  const bedroomsMax = parseOptionalNonNegativeInt(searchParams.get('bedrooms_max'));
  const sort = parseSort(searchParams.get('sort'));

  const rawPage = searchParams.get('page');
  const rawPageSize = searchParams.get('page_size');
  const page = rawPage ? Number(rawPage) : 1;
  const pageSize = rawPageSize ? Number(rawPageSize) : 20;

  if (!Number.isInteger(page) || page < 1) return null;
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) return null;
  if (sort === undefined) return null;
  if (
    minPrice === undefined ||
    maxPrice === undefined ||
    bedroomsMin === undefined ||
    bedroomsMax === undefined
  ) {
    return null;
  }
  if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) return null;
  if (bedroomsMin !== null && bedroomsMax !== null && bedroomsMin > bedroomsMax) return null;

  return {
    countryId,
    cityId,
    listingType,
    minPrice,
    maxPrice,
    bedroomsMin,
    bedroomsMax,
    sort,
    page,
    pageSize,
    offset: (page - 1) * pageSize,
  };
}

export function parseNearbyListingsQuery(searchParams: URLSearchParams): NearbyListingsQuery | null {
  const lat = parseRequiredNumber(searchParams.get('lat'));
  const lng = parseRequiredNumber(searchParams.get('lng'));
  const radiusKm = parseRequiredNumber(searchParams.get('radius_km'));

  if (lat === undefined || lng === undefined || radiusKm === undefined) return null;
  if (lat < -90 || lat > 90) return null;
  if (lng < -180 || lng > 180) return null;
  if (radiusKm <= 0) return null;

  const countryId = parseOptionalFilterString(searchParams.get('country_id'));
  const cityId = parseOptionalFilterString(searchParams.get('city_id'));
  const listingType = parseOptionalFilterString(searchParams.get('listing_type'));

  const rawPage = searchParams.get('page');
  const rawPageSize = searchParams.get('page_size');
  const page = rawPage ? Number(rawPage) : 1;
  const pageSize = rawPageSize ? Number(rawPageSize) : 20;
  if (!Number.isInteger(page) || page < 1) return null;
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) return null;

  return {
    lat,
    lng,
    radiusKm,
    countryId,
    cityId,
    listingType,
    page,
    pageSize,
    offset: (page - 1) * pageSize,
  };
}
