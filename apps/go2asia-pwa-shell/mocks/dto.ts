export type ID = string;

/**
 * Data source switch.
 * Default is `api` (mocks are UI-only fallback).
 */
export type DataSource = 'mock' | 'api';

export function getDataSource(): DataSource {
  const v = process.env.NEXT_PUBLIC_DATA_SOURCE;
  return v === 'mock' ? 'mock' : 'api';
}

/**
 * Pulse
 * DTO shape intentionally близок к будущему контракту.
 */
export interface EventDTO {
  id: ID;
  title: string;
  description?: string;
  category?: string;
  startTime: string; // ISO
  endTime?: string; // ISO
  timezone?: string;
  location?: {
    name: string;
    address?: string;
    city?: string;
    country?: string;
    placeId?: ID;
  };
  coverImage?: string;
  tags?: string[];
  price?: {
    type: 'free' | 'paid';
    amount?: number;
    currency?: string;
  };
  badges?: Array<'verified' | 'russian-friendly' | 'free' | 'paid' | 'featured' | 'repeating' | 'virtual-event'>;
}

/**
 * Atlas
 */
export interface PlaceDTO {
  id: ID;
  name: string;
  slug?: string;
  type: string;
  description?: string;
  country?: string;
  city?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  categories?: string[];
  photos?: string[];
  rating?: number;
  updatedAt?: string; // ISO
}

export interface CountryDTO {
  id: ID;
  name: string;
  code?: string;
  flag?: string;
  description?: string;
  citiesCount?: number;
  placesCount?: number;
  heroImage?: string;
  updatedAt?: string; // ISO
}

export interface CityDTO {
  id: ID;
  name: string;
  countryId: ID;
  description?: string;
  placesCount?: number;
  latitude?: number;
  longitude?: number;
  heroImage?: string;
  updatedAt?: string; // ISO
}

export interface GuideDTO {
  id: ID;
  slug: string;
  title: string;
  excerpt?: string;
  contentMarkdown: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
  countryId?: ID;
  cityId?: ID;
  publishedAt?: string; // ISO
  updatedAt?: string; // ISO
}

export interface ThemeDTO {
  id: ID;
  title: string;
  description?: string;
  heroImage?: string;
  tags?: string[];
  updatedAt?: string; // ISO
}

export interface HubDTO {
  slug: string;
  title: string;
  description?: string;
  heroImage?: string;
  tags?: string[];
}

/**
 * Blog
 */
export interface PostDTO {
  id: ID;
  slug: string;
  title: string;
  excerpt?: string;
  contentMarkdown: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
  author?: {
    name: string;
    role?: string;
    city?: string;
  };
  publishedAt?: string; // ISO
  readingTimeMin?: number;
  badges?: string[];
}
