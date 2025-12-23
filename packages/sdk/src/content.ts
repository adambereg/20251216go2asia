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
  description: string | null;
  category: string | null;
  startDate: string; // ISO string
  endDate: string | null; // ISO string
  location: string | null;
  latitude: string | null;
  longitude: string | null;
  imageUrl: string | null;
  isActive: boolean;
}

export interface ListResponse<T> {
  items: T[];
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
export async function listEvents(params?: { limit?: number }): Promise<ListResponse<ContentEventDto>> {
  const qs = params?.limit ? `?limit=${encodeURIComponent(String(params.limit))}` : '';
  return customInstance<ListResponse<ContentEventDto>>({ method: 'GET' }, `/v1/content/events${qs}`);
}

/**
 * Atlas: list countries (public)
 */
export async function listCountries(): Promise<ListResponse<ContentCountryDto>> {
  return customInstance<ListResponse<ContentCountryDto>>({ method: 'GET' }, `/v1/content/countries`);
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
export async function listPlaces(params?: { cityId?: string; limit?: number }): Promise<ListResponse<ContentPlaceDto>> {
  const sp = new URLSearchParams();
  if (params?.cityId) sp.set('cityId', params.cityId);
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
