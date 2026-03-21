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

export type ListingStatus = 'draft' | 'published' | 'archived';

export interface ListingMediaInput {
  mediaId: string;
  sortOrder: number;
  isCover: boolean;
}

export interface CreateListingInput {
  slug: string;
  title: string;
  description: string;
  listingType: string;
  priceAmount: number;
  priceCurrency: string;
  pricePeriod: string;
  countryId: string;
  cityId: string | null;
  atlasPlaceId: string | null;
  atlasContainerPlaceId: string | null;
  areaText: string | null;
  lat: number | null;
  lng: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  areaSqm: number | null;
  amenities: string[];
  media: ListingMediaInput[];
}

export interface PatchListingInput {
  slug?: string;
  title?: string;
  description?: string;
  listingType?: string;
  priceAmount?: number;
  priceCurrency?: string;
  pricePeriod?: string;
  countryId?: string;
  cityId?: string | null;
  atlasPlaceId?: string | null;
  atlasContainerPlaceId?: string | null;
  areaText?: string | null;
  lat?: number | null;
  lng?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  areaSqm?: number | null;
  amenities?: string[];
  status?: 'draft' | 'published';
}

export interface MyListingsQuery {
  status: ListingStatus | null;
  sort: 'newest' | 'price_asc' | 'price_desc';
  page: number;
  pageSize: number;
  offset: number;
}

export interface CreateInquiryInput {
  message: string;
  contactName: string | null;
  contactPhone: string | null;
  contactTelegram: string | null;
}

export interface MyInquiriesQuery {
  status: 'new' | 'viewed' | 'closed' | null;
  sort: 'newest' | 'oldest';
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

function parseOptionalNumber(value: unknown): number | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
  return value;
}

function parseOptionalNonNegativeInt(value: string | null): number | null | undefined {
  if (value === null || value.trim().length === 0) return null;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) return undefined;
  return parsed;
}

function parseOptionalNonNegativeIntFromUnknown(value: unknown): number | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) return undefined;
  return value;
}

function parseOptionalFilterString(value: string | null): string | null {
  if (value === null) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseOptionalTrimmedString(value: unknown, maxLength: number): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;
  return trimmed.slice(0, maxLength);
}

function parseRequiredTrimmedString(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (trimmed.length === 0) return undefined;
  return trimmed.slice(0, maxLength);
}

function parseSlug(value: unknown): string | undefined {
  const normalized = parseRequiredTrimmedString(value, 180);
  if (!normalized) return undefined;
  const slug = normalized.toLowerCase();
  if (!/^[a-z0-9-]+$/.test(slug)) return undefined;
  return slug;
}

function parseOptionalSlug(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  const required = parseSlug(value);
  return required;
}

function parseListingType(value: unknown): string | undefined {
  if (value !== 'rent_long' && value !== 'rent_short' && value !== 'sale') return undefined;
  return value;
}

function parsePricePeriod(value: unknown): string | undefined {
  if (value !== 'month' && value !== 'day' && value !== 'total') return undefined;
  return value;
}

function parseCurrency(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(normalized)) return undefined;
  return normalized;
}

function parseAmenities(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const normalized = value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, 100);
  return normalized;
}

function parseMediaArray(value: unknown): ListingMediaInput[] | undefined {
  if (value === undefined) return [];
  if (!Array.isArray(value)) return undefined;
  const parsed: ListingMediaInput[] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return undefined;
    const record = item as Record<string, unknown>;
    const mediaId = parseRequiredTrimmedString(record.media_id, 256);
    const sortOrderRaw = record.sort_order;
    const isCoverRaw = record.is_cover;
    const sortOrder =
      sortOrderRaw === undefined ? 0 : typeof sortOrderRaw === 'number' && Number.isInteger(sortOrderRaw) ? sortOrderRaw : NaN;
    const isCover = isCoverRaw === undefined ? false : isCoverRaw === true || isCoverRaw === false ? isCoverRaw : null;
    if (!mediaId || !Number.isFinite(sortOrder) || sortOrder < 0 || isCover === null) return undefined;
    parsed.push({
      mediaId,
      sortOrder,
      isCover,
    });
  }
  return parsed;
}

function hasValidLatLngPair(lat: number | null, lng: number | null): boolean {
  if (lat === null && lng === null) return true;
  if (lat === null || lng === null) return false;
  if (lat < -90 || lat > 90) return false;
  if (lng < -180 || lng > 180) return false;
  return true;
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

export function parseCreateListingInput(body: Record<string, unknown> | null): CreateListingInput | null {
  if (!body) return null;

  const slug = parseSlug(body.slug);
  const title = parseRequiredTrimmedString(body.title, 200);
  const description = parseRequiredTrimmedString(body.description, 4000);
  const listingType = parseListingType(body.listing_type);
  const priceAmount = parseOptionalNumber(body.price_amount);
  const priceCurrency = parseCurrency(body.price_currency);
  const pricePeriod = parsePricePeriod(body.price_period);
  const countryId = parseRequiredTrimmedString(body.country_id, 64);
  const cityId = body.city_id === undefined ? null : parseOptionalTrimmedString(body.city_id, 128);
  const atlasPlaceId = body.atlas_place_id === undefined ? null : parseOptionalTrimmedString(body.atlas_place_id, 128);
  const atlasContainerPlaceId =
    body.atlas_container_place_id === undefined ? null : parseOptionalTrimmedString(body.atlas_container_place_id, 128);
  const areaText = body.area_text === undefined ? null : parseOptionalTrimmedString(body.area_text, 160);
  const lat = body.lat === undefined ? null : parseOptionalNumber(body.lat);
  const lng = body.lng === undefined ? null : parseOptionalNumber(body.lng);
  const bedrooms = body.bedrooms === undefined ? null : parseOptionalNonNegativeIntFromUnknown(body.bedrooms);
  const bathrooms = body.bathrooms === undefined ? null : parseOptionalNonNegativeIntFromUnknown(body.bathrooms);
  const areaSqm = body.area_sqm === undefined ? null : parseOptionalNumber(body.area_sqm);
  const amenities = body.amenities === undefined ? [] : parseAmenities(body.amenities);
  const media = parseMediaArray(body.media);

  if (
    !slug ||
    !title ||
    !description ||
    !listingType ||
    priceAmount === undefined ||
    priceAmount === null ||
    priceAmount < 0 ||
    !priceCurrency ||
    !pricePeriod ||
    !countryId ||
    cityId === undefined ||
    atlasPlaceId === undefined ||
    atlasContainerPlaceId === undefined ||
    areaText === undefined ||
    lat === undefined ||
    lng === undefined ||
    bedrooms === undefined ||
    bathrooms === undefined ||
    areaSqm === undefined ||
    (areaSqm !== null && areaSqm < 0) ||
    amenities === undefined ||
    media === undefined
  ) {
    return null;
  }

  if (!hasValidLatLngPair(lat, lng)) return null;
  if (atlasPlaceId !== null && atlasContainerPlaceId !== null && atlasPlaceId === atlasContainerPlaceId) return null;

  return {
    slug,
    title,
    description,
    listingType,
    priceAmount,
    priceCurrency,
    pricePeriod,
    countryId,
    cityId,
    atlasPlaceId,
    atlasContainerPlaceId,
    areaText,
    lat,
    lng,
    bedrooms,
    bathrooms,
    areaSqm,
    amenities,
    media,
  };
}

export function parsePatchListingInput(body: Record<string, unknown> | null): PatchListingInput | null {
  if (!body) return null;
  if (body.media !== undefined) return null;

  const updates: PatchListingInput = {};
  let touched = false;

  if (body.slug !== undefined) {
    const slug = parseOptionalSlug(body.slug);
    if (!slug) return null;
    updates.slug = slug;
    touched = true;
  }
  if (body.title !== undefined) {
    const title = parseRequiredTrimmedString(body.title, 200);
    if (!title) return null;
    updates.title = title;
    touched = true;
  }
  if (body.description !== undefined) {
    const description = parseRequiredTrimmedString(body.description, 4000);
    if (!description) return null;
    updates.description = description;
    touched = true;
  }
  if (body.listing_type !== undefined) {
    const listingType = parseListingType(body.listing_type);
    if (!listingType) return null;
    updates.listingType = listingType;
    touched = true;
  }
  if (body.price_amount !== undefined) {
    const priceAmount = parseOptionalNumber(body.price_amount);
    if (priceAmount === undefined || priceAmount === null || priceAmount < 0) return null;
    updates.priceAmount = priceAmount;
    touched = true;
  }
  if (body.price_currency !== undefined) {
    const priceCurrency = parseCurrency(body.price_currency);
    if (!priceCurrency) return null;
    updates.priceCurrency = priceCurrency;
    touched = true;
  }
  if (body.price_period !== undefined) {
    const pricePeriod = parsePricePeriod(body.price_period);
    if (!pricePeriod) return null;
    updates.pricePeriod = pricePeriod;
    touched = true;
  }
  if (body.country_id !== undefined) {
    const countryId = parseRequiredTrimmedString(body.country_id, 64);
    if (!countryId) return null;
    updates.countryId = countryId;
    touched = true;
  }
  if (body.city_id !== undefined) {
    const cityId = parseOptionalTrimmedString(body.city_id, 128);
    if (cityId === undefined) return null;
    updates.cityId = cityId;
    touched = true;
  }
  if (body.atlas_place_id !== undefined) {
    const atlasPlaceId = parseOptionalTrimmedString(body.atlas_place_id, 128);
    if (atlasPlaceId === undefined) return null;
    updates.atlasPlaceId = atlasPlaceId;
    touched = true;
  }
  if (body.atlas_container_place_id !== undefined) {
    const atlasContainerPlaceId = parseOptionalTrimmedString(body.atlas_container_place_id, 128);
    if (atlasContainerPlaceId === undefined) return null;
    updates.atlasContainerPlaceId = atlasContainerPlaceId;
    touched = true;
  }
  if (body.area_text !== undefined) {
    const areaText = parseOptionalTrimmedString(body.area_text, 160);
    if (areaText === undefined) return null;
    updates.areaText = areaText;
    touched = true;
  }
  if (body.lat !== undefined) {
    const lat = parseOptionalNumber(body.lat);
    if (lat === undefined) return null;
    updates.lat = lat;
    touched = true;
  }
  if (body.lng !== undefined) {
    const lng = parseOptionalNumber(body.lng);
    if (lng === undefined) return null;
    updates.lng = lng;
    touched = true;
  }
  if (body.bedrooms !== undefined) {
    const bedrooms = parseOptionalNonNegativeIntFromUnknown(body.bedrooms);
    if (bedrooms === undefined) return null;
    updates.bedrooms = bedrooms;
    touched = true;
  }
  if (body.bathrooms !== undefined) {
    const bathrooms = parseOptionalNonNegativeIntFromUnknown(body.bathrooms);
    if (bathrooms === undefined) return null;
    updates.bathrooms = bathrooms;
    touched = true;
  }
  if (body.area_sqm !== undefined) {
    const areaSqm = parseOptionalNumber(body.area_sqm);
    if (areaSqm === undefined || (areaSqm !== null && areaSqm < 0)) return null;
    updates.areaSqm = areaSqm;
    touched = true;
  }
  if (body.amenities !== undefined) {
    const amenities = parseAmenities(body.amenities);
    if (amenities === undefined) return null;
    updates.amenities = amenities;
    touched = true;
  }
  if (body.status !== undefined) {
    const status = parseLifecycleStatus(body.status);
    if (!status) return null;
    updates.status = status;
    touched = true;
  }

  if (!touched) return null;

  const nextLat = updates.lat !== undefined ? updates.lat : null;
  const nextLng = updates.lng !== undefined ? updates.lng : null;
  if ((updates.lat !== undefined || updates.lng !== undefined) && !hasValidLatLngPair(nextLat, nextLng)) return null;
  if (
    updates.atlasPlaceId !== undefined &&
    updates.atlasContainerPlaceId !== undefined &&
    updates.atlasPlaceId !== null &&
    updates.atlasPlaceId === updates.atlasContainerPlaceId
  ) {
    return null;
  }

  return updates;
}

function parseStatus(value: string | null): ListingStatus | null | undefined {
  if (value === null || value.trim().length === 0) return null;
  if (value === 'draft' || value === 'published' || value === 'archived') return value;
  return undefined;
}

function parseLifecycleStatus(value: unknown): 'draft' | 'published' | undefined {
  if (value !== 'draft' && value !== 'published') return undefined;
  return value;
}

function parseInquiryStatus(value: string | null): MyInquiriesQuery['status'] | undefined {
  if (value === null || value.trim().length === 0) return null;
  if (value === 'new' || value === 'viewed' || value === 'closed') return value;
  return undefined;
}

function parseInquirySort(value: string | null): MyInquiriesQuery['sort'] | undefined {
  if (value === null || value.trim().length === 0) return 'newest';
  if (value === 'newest' || value === 'oldest') return value;
  return undefined;
}

export function parseMyListingsQuery(searchParams: URLSearchParams): MyListingsQuery | null {
  const status = parseStatus(searchParams.get('status'));
  const sort = parseSort(searchParams.get('sort'));
  const rawPage = searchParams.get('page');
  const rawPageSize = searchParams.get('page_size');
  const page = rawPage ? Number(rawPage) : 1;
  const pageSize = rawPageSize ? Number(rawPageSize) : 20;

  if (status === undefined || sort === undefined) return null;
  if (!Number.isInteger(page) || page < 1) return null;
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) return null;

  return {
    status,
    sort,
    page,
    pageSize,
    offset: (page - 1) * pageSize,
  };
}

export function parseCreateInquiryInput(body: Record<string, unknown> | null): CreateInquiryInput | null {
  if (!body) return null;
  const message = parseRequiredTrimmedString(body.message, 4000);
  const contactName = body.contact_name === undefined ? null : parseOptionalTrimmedString(body.contact_name, 120);
  const contactPhone = body.contact_phone === undefined ? null : parseOptionalTrimmedString(body.contact_phone, 40);
  const contactTelegram =
    body.contact_telegram === undefined ? null : parseOptionalTrimmedString(body.contact_telegram, 80);
  if (!message || contactName === undefined || contactPhone === undefined || contactTelegram === undefined) {
    return null;
  }
  return { message, contactName, contactPhone, contactTelegram };
}

export function parseMyInquiriesQuery(searchParams: URLSearchParams): MyInquiriesQuery | null {
  const status = parseInquiryStatus(searchParams.get('status'));
  const sort = parseInquirySort(searchParams.get('sort'));
  const rawPage = searchParams.get('page');
  const rawPageSize = searchParams.get('page_size');
  const page = rawPage ? Number(rawPage) : 1;
  const pageSize = rawPageSize ? Number(rawPageSize) : 20;

  if (status === undefined || sort === undefined) return null;
  if (!Number.isInteger(page) || page < 1) return null;
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) return null;

  return {
    status,
    sort,
    page,
    pageSize,
    offset: (page - 1) * pageSize,
  };
}
