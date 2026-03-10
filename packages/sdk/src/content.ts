/**
 * @go2asia/sdk/content
 *
 * Content Service (via API Gateway)
 * - Server-safe helpers (no React Query)
 */

import { customInstance } from './mutator';

export interface ContentEventDto {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  bodyMarkdown: string;
  category: string | null;
  startDate: string; // ISO string
  endDate: string | null; // ISO string
  location: string | null;
  latitude: string | null;
  longitude: string | null;
  countrySlug: string | null;
  citySlug: string | null;
  countryName: string | null;
  cityName: string | null;
  year: number | null;
  heroMediaKey: string | null;
  galleryMediaKeys: string[];
  isActive: boolean;
  isFree: boolean;
  priceAmount: string | null;
  priceCurrency: string | null;
  isVerified: boolean;
  officialUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
}

export interface ListResponse<T> {
  items: T[];
  total?: number;
  limit?: number;
  offset?: number;
}

export interface ContentCountryDto {
  id: string;
  slug: string;
  name: string;
  code: string;
  flag: string | null;
  description: string | null;
  heroImage: string | null;
  citiesCount: number;
  placesCount: number;
}

export interface ContentGalleryItemDto {
  key: string;
  url: string;
  isCover: boolean;
}

export interface ContentCountryGalleryDto {
  countryId: string;
  prefix: string;
  items: ContentGalleryItemDto[];
}

export interface ContentCityDto {
  id: string;
  slug: string;
  name: string;
  countryId: string;
  countryName: string | null;
  description: string | null;
  placesCount: number;
  latitude: string | null;
  longitude: string | null;
  heroImage: string | null;
}

export interface ContentPlaceDto {
  id: string;
  slug: string;
  name: string;
  type: string;
  kind: string;
  category: string | null;
  tags: string[] | null;
  website: string | null;
  phone: string | null;
  instagram: string | null;
  googleMapsUrl: string | null;
  priceLevel: string | null;
  countryId: string | null;
  cityId: string | null;
  description: string | null;
  country: string | null;
  city: string | null;
  address: string | null;
  latitude: string | null;
  longitude: string | null;
  heroImage: string | null;
  photos: string[];
}

export interface ContentArticleDto {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  tags: string[] | null;
  coverImage: string | null;
  publishedAt: string | null;
  status: string;
}

export interface ContentTabDto {
  tabKey: string;
  lang: string;
  title: string | null;
  bodyMarkdown: string;
  updatedAt: string | null;
}

export const COUNTRY_TAB_KEYS = [
  'overview',
  'gallery',
  'map',
  'cities',
  'weather',
  'history',
  'geography',
  'culture',
  'living',
  'visas',
  'business',
  'places',
  'phrasebook',
  'reviews',
  'calculator',
] as const;

export const CITY_TAB_KEYS = [
  'overview',
  'districts',
  'accommodation',
  'food',
  'places',
  'transport',
  'weather',
  'shopping',
  'nightlife',
  'guides',
  'tips',
  'reviews',
  'budget',
] as const;

export type CountryTabKey = typeof COUNTRY_TAB_KEYS[number];
export type CityTabKey = typeof CITY_TAB_KEYS[number];

/**
 * Fetch single event by ID.
 * Public endpoint.
 */
export async function getEventById(eventId: string): Promise<ContentEventDto> {
  return customInstance<ContentEventDto>({ method: 'GET' }, `/v1/content/events/${eventId}`);
}

/**
 * List events (public)
 */
export type ListEventsParams = {
  limit?: number;
  offset?: number;
  page?: number;
  country?: string;
  city?: string;
  category?: string;
  dateFrom?: string; // ISO date/datetime
  dateTo?: string; // ISO date/datetime
  price?: 'free' | 'paid' | 'any';
  verified?: 'true' | 'false' | 'any';
  q?: string;
};

export async function listEvents(params?: ListEventsParams): Promise<ListResponse<ContentEventDto>> {
  const sp = new URLSearchParams();
  if (params?.limit) sp.set('limit', String(params.limit));
  if (params?.offset !== undefined) sp.set('offset', String(params.offset));
  if (params?.page) sp.set('page', String(params.page));
  if (params?.country) sp.set('country', params.country);
  if (params?.city) sp.set('city', params.city);
  if (params?.category) sp.set('category', params.category);
  if (params?.dateFrom) sp.set('date_from', params.dateFrom);
  if (params?.dateTo) sp.set('date_to', params.dateTo);
  if (params?.price) sp.set('price', params.price);
  if (params?.verified) sp.set('verified', params.verified);
  if (params?.q) sp.set('q', params.q);

  const qs = sp.toString() ? `?${sp.toString()}` : '';
  return customInstance<ListResponse<ContentEventDto>>({ method: 'GET' }, `/v1/content/events${qs}`);
}

/**
 * Atlas: list countries (public)
 */
export async function listCountries(): Promise<ListResponse<ContentCountryDto>> {
  return customInstance<ListResponse<ContentCountryDto>>({ method: 'GET' }, `/v1/content/countries`);
}

/**
 * Atlas: country gallery from R2 (public)
 */
export async function getCountryGallery(
  idOrSlug: string,
  params?: { limit?: number }
): Promise<ContentCountryGalleryDto> {
  const qs = params?.limit ? `?limit=${encodeURIComponent(String(params.limit))}` : '';
  return customInstance<ContentCountryGalleryDto>({ method: 'GET' }, `/v1/content/countries/${idOrSlug}/gallery${qs}`);
}

/**
 * Atlas: list cities (public)
 */
export async function listCities(params?: { countryId?: string }): Promise<ListResponse<ContentCityDto>> {
  const qs = params?.countryId ? `?countryId=${encodeURIComponent(params.countryId)}` : '';
  return customInstance<ListResponse<ContentCityDto>>({ method: 'GET' }, `/v1/content/cities${qs}`);
}

/**
 * Atlas: list places (public)
 */
export async function listPlaces(params?: {
  cityId?: string;
  countryId?: string;
  kind?: 'showplace' | 'business';
  limit?: number;
}): Promise<ListResponse<ContentPlaceDto>> {
  const sp = new URLSearchParams();
  if (params?.cityId) sp.set('cityId', params.cityId);
  if (params?.countryId) sp.set('countryId', params.countryId);
  if (params?.kind) sp.set('kind', params.kind);
  if (params?.limit) sp.set('limit', String(params.limit));
  const qs = sp.toString() ? `?${sp.toString()}` : '';
  return customInstance<ListResponse<ContentPlaceDto>>({ method: 'GET' }, `/v1/content/places${qs}`);
}

/**
 * Atlas: get place by id or slug (public)
 */
export async function getPlaceByIdOrSlug(idOrSlug: string): Promise<ContentPlaceDto> {
  return customInstance<ContentPlaceDto>({ method: 'GET' }, `/v1/content/places/${idOrSlug}`);
}

/**
 * Atlas: list country tabs (public)
 */
export async function listCountryTabs(
  idOrSlug: string,
  params?: { lang?: string; tabKey?: CountryTabKey }
): Promise<ListResponse<ContentTabDto>> {
  const sp = new URLSearchParams();
  if (params?.lang) sp.set('lang', params.lang);
  if (params?.tabKey) sp.set('tabKey', params.tabKey);
  const qs = sp.toString() ? `?${sp.toString()}` : '';
  return customInstance<ListResponse<ContentTabDto>>({ method: 'GET' }, `/v1/content/countries/${idOrSlug}/tabs${qs}`);
}

/**
 * Atlas: list city tabs (public)
 */
export async function listCityTabs(
  idOrSlug: string,
  params?: { lang?: string; tabKey?: CityTabKey }
): Promise<ListResponse<ContentTabDto>> {
  const sp = new URLSearchParams();
  if (params?.lang) sp.set('lang', params.lang);
  if (params?.tabKey) sp.set('tabKey', params.tabKey);
  const qs = sp.toString() ? `?${sp.toString()}` : '';
  return customInstance<ListResponse<ContentTabDto>>({ method: 'GET' }, `/v1/content/cities/${idOrSlug}/tabs${qs}`);
}

/**
 * Atlas: list place tabs (public)
 */
export async function listPlaceTabs(
  idOrSlug: string,
  params?: { lang?: string; tabKey?: string }
): Promise<ListResponse<ContentTabDto>> {
  const sp = new URLSearchParams();
  if (params?.lang) sp.set('lang', params.lang);
  if (params?.tabKey) sp.set('tabKey', params.tabKey);
  const qs = sp.toString() ? `?${sp.toString()}` : '';
  return customInstance<ListResponse<ContentTabDto>>({ method: 'GET' }, `/v1/content/places/${idOrSlug}/tabs${qs}`);
}

/**
 * Blog: list articles (public)
 */
export async function listArticles(params?: { limit?: number }): Promise<ListResponse<ContentArticleDto>> {
  const qs = params?.limit ? `?limit=${encodeURIComponent(String(params.limit))}` : '';
  return customInstance<ListResponse<ContentArticleDto>>({ method: 'GET' }, `/v1/content/articles${qs}`);
}

/**
 * Blog: get article by slug (public)
 */
export async function getArticleBySlug(slug: string): Promise<ContentArticleDto> {
  return customInstance<ContentArticleDto>({ method: 'GET' }, `/v1/content/articles/${slug}`);
}
