/**
 * Content Service schema
 * 
 * Tables:
 * - media_files (R2 метаданные; байты хранятся в Cloudflare R2)
 * - countries, cities, places (Atlas)
 * - events, event_registrations (Pulse)
 * - articles (Blog)
 */

import {
  pgTable,
  text,
  timestamp,
  varchar,
  boolean,
  jsonb,
  unique,
  integer,
  numeric,
  char,
  index,
  check,
  pgEnum,
  uuid,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

/**
 * Media files (Cloudflare R2 metadata only).
 * SSOT: R2 хранит байты, Neon хранит только ссылки и метаданные.
 */
export const mediaFiles = pgTable(
  'media_files',
  {
    id: text('id').primaryKey(),
    provider: varchar('provider', { length: 20 }).notNull().default('r2'), // r2
    bucket: text('bucket').notNull(),
    key: text('key').notNull(), // e.g. country/th/hero.jpg
    publicUrl: text('public_url').notNull(),
    mimeType: varchar('mime_type', { length: 100 }).notNull(),
    size: integer('size').notNull(), // bytes
    width: integer('width'),
    height: integer('height'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    uniqueProviderBucketKey: unique().on(table.provider, table.bucket, table.key),
  })
);

/**
 * Enum-like status constraints (Postgres enums) — MVP scope.
 */
export const eventStatusEnum = pgEnum('event_status', ['draft', 'active', 'cancelled', 'archived']);
export const articleStatusEnum = pgEnum('article_status', ['draft', 'published', 'archived']);
export const eventRegistrationStatusEnum = pgEnum('event_registration_status', [
  'registered',
  'cancelled',
]);

/**
 * Atlas City editorial filters (Phase: Cities filters/sort)
 *
 * Notes:
 * - Keep values stable & editor-friendly (dropdowns).
 * - Columns are nullable: NULL means "Все".
 */
export const atlasCityTypeEnum = pgEnum('atlas_city_type', [
  'resort',
  'cultural',
  'business',
  'nature',
  'island',
  'mountain',
  'historic',
  'mixed',
  'other',
]);

export const atlasCitySizeEnum = pgEnum('atlas_city_size', ['small', 'medium', 'large', 'capital']);
export const atlasCityPriceLevelEnum = pgEnum('atlas_city_price_level', ['budget', 'mid', 'expensive']);
export const atlasCityNightlifeLevelEnum = pgEnum('atlas_city_nightlife_level', ['active', 'moderate', 'calm']);

export const countries = pgTable('countries', {
  id: text('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 3 }).notNull().unique(), // ISO (min: alpha-2, can be 3)
  flagEmoji: varchar('flag_emoji', { length: 10 }),
  descriptionShort: text('description_short'),
  heroMediaId: text('hero_media_id').references(() => mediaFiles.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const cities = pgTable(
  'cities',
  {
    id: text('id').primaryKey(),
    countryId: text('country_id').notNull().references(() => countries.id),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    /**
     * Multilingual names (Phase 2.2 hardening).
     * Expected shape:
     * - names.ru: display name in Russian (SSOT for current UI)
     * - names.en: English name (for future UI, search/aliases)
     */
    names: jsonb('names'),
    descriptionShort: text('description_short'),
    // Editorial filters (nullable => "Все")
    cityType: atlasCityTypeEnum('city_type'),
    citySize: atlasCitySizeEnum('city_size'),
    hasSea: boolean('has_sea'),
    priceLevel: atlasCityPriceLevelEnum('price_level'),
    nightlifeLevel: atlasCityNightlifeLevelEnum('nightlife_level'),
    // Legacy geo columns (created in 0000 migration).
    // Deprecated/read-only: SSOT is lat/lng. Legacy will be removed after seed+API migration (post PR#2/PR#3) / Milestone 5.
    latitude: numeric('latitude', { precision: 9, scale: 6 }),
    longitude: numeric('longitude', { precision: 9, scale: 6 }),
    // MVP geo (preferred): no PostGIS, split coords
    lat: numeric('lat', { precision: 9, scale: 6 }),
    lng: numeric('lng', { precision: 9, scale: 6 }),
    heroMediaId: text('hero_media_id').references(() => mediaFiles.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    idxCitiesCountryId: index('idx_cities_country_id').on(table.countryId),
    idxCitiesType: index('idx_cities_city_type').on(table.cityType),
    idxCitiesSize: index('idx_cities_city_size').on(table.citySize),
    idxCitiesHasSea: index('idx_cities_has_sea').on(table.hasSea),
    idxCitiesPriceLevel: index('idx_cities_price_level').on(table.priceLevel),
    idxCitiesNightlifeLevel: index('idx_cities_nightlife_level').on(table.nightlifeLevel),
  })
);

/**
 * City aliases for backward-compatible routing.
 * Allows resolving /atlas/cities/:idOrSlug where :idOrSlug may be:
 * - old short slugs (e.g. "sin")
 * - previously used SEO slugs (e.g. "singapore")
 * - alternative spellings/transliterations (future)
 *
 * Uniqueness: (country_id, alias_slug).
 */
export const cityAliases = pgTable(
  'city_aliases',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    countryId: text('country_id').notNull().references(() => countries.id),
    aliasSlug: varchar('alias_slug', { length: 255 }).notNull(),
    cityId: text('city_id').notNull().references(() => cities.id),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    uniqueCountryAlias: unique('city_aliases_country_alias_unique').on(table.countryId, table.aliasSlug),
    idxAliasSlug: index('idx_city_aliases_alias_slug').on(table.aliasSlug),
    idxCityId: index('idx_city_aliases_city_id').on(table.cityId),
  })
);

export const places = pgTable(
  'places',
  {
    id: text('id').primaryKey(),
    countryId: text('country_id').references(() => countries.id),
    cityId: text('city_id').references(() => cities.id),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    type: varchar('type', { length: 100 }).notNull(), // attraction, restaurant, cafe, beach, etc.
    placeKind: text('place_kind').notNull().default('showplace'), // showplace | business
    category: text('category'),
    tags: jsonb('tags'),
    descriptionShort: text('description_short'),
    // Legacy geo columns (created in 0000 migration).
    // Deprecated/read-only: SSOT is lat/lng. Legacy will be removed after seed+API migration (post PR#2/PR#3) / Milestone 5.
    latitude: numeric('latitude', { precision: 9, scale: 6 }),
    longitude: numeric('longitude', { precision: 9, scale: 6 }),
    // MVP geo (preferred): no PostGIS, split coords
    lat: numeric('lat', { precision: 9, scale: 6 }),
    lng: numeric('lng', { precision: 9, scale: 6 }),
    address: text('address'),
    website: text('website'),
    phone: text('phone'),
    instagram: text('instagram'),
    googleMapsUrl: text('google_maps_url'),
    priceLevel: text('price_level'),
    heroMediaId: text('hero_media_id').references(() => mediaFiles.id),
    // Temporary compatibility for UI-first stage: keep optional list of public URLs.
    // In API integration (PR#3+), UI should read via media_files.
    images: jsonb('images'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    idxPlacesCountryId: index('idx_places_country_id').on(table.countryId),
    idxPlacesCityId: index('idx_places_city_id').on(table.cityId),
  })
);

export const events = pgTable(
  'events',
  {
    id: text('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    description: text('description'),
    category: varchar('category', { length: 100 }),
    // Legacy columns (created in 0000 migration).
    // Deprecated/read-only: SSOT is start_at/end_at (timestamptz). Legacy will be removed after seed+API migration (post PR#2/PR#3) / Milestone 5.
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date'),
    // MVP (preferred): timestamptz + start_at/end_at
    startAt: timestamp('start_at', { withTimezone: true }),
    endAt: timestamp('end_at', { withTimezone: true }),
    location: text('location'),
    countryId: text('country_id').references(() => countries.id),
    cityId: text('city_id').references(() => cities.id),
    // Legacy geo columns (created in 0000 migration).
    // Deprecated/read-only: SSOT is lat/lng. Legacy will be removed after seed+API migration (post PR#2/PR#3) / Milestone 5.
    latitude: numeric('latitude', { precision: 9, scale: 6 }),
    longitude: numeric('longitude', { precision: 9, scale: 6 }),
    // MVP geo (preferred): no PostGIS, split coords
    lat: numeric('lat', { precision: 9, scale: 6 }),
    lng: numeric('lng', { precision: 9, scale: 6 }),
    // Keep existing column for current content-service compatibility.
    imageUrl: text('image_url'),
    imageMediaId: text('image_media_id').references(() => mediaFiles.id),
    isFree: boolean('is_free').notNull().default(true),
    // MVP money: numeric(12,2) + ISO currency (char(3))
    priceAmount: numeric('price_amount', { precision: 12, scale: 2 }).notNull().default('0'),
    priceCurrency: char('price_currency', { length: 3 }),
    status: eventStatusEnum('status').notNull().default('active'),
    isActive: boolean('is_active').notNull().default(true), // legacy flag used by current code
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    idxEventsCountryId: index('idx_events_country_id').on(table.countryId),
    idxEventsCityId: index('idx_events_city_id').on(table.cityId),
    idxEventsStartAt: index('idx_events_start_at').on(table.startAt),
    // Price consistency (MVP):
    // - free => price_amount = 0
    // - paid => price_amount >= 0 and currency is set
    chkEventsPriceConsistency: check(
      'events_price_consistency',
      sql`((is_free AND price_amount = 0) OR ((NOT is_free) AND price_amount >= 0 AND price_currency IS NOT NULL))`
    ),
  })
);

export const articles = pgTable('articles', {
  id: text('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  category: varchar('category', { length: 100 }),
  tags: jsonb('tags'), // Array of tag strings
  coverMediaId: text('cover_media_id').references(() => mediaFiles.id),
  // Temporary compatibility: keep optional public URL
  imageUrl: text('image_url'),
  publishedAt: timestamp('published_at'),
  status: articleStatusEnum('status').notNull().default('draft'),
  isPublished: boolean('is_published').notNull().default(false), // legacy flag (MVP)
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const contentBlocks = pgTable(
  'content_blocks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    entityType: text('entity_type').notNull(), // country | city | place
    entityId: text('entity_id').notNull(), // FK to countries/cities/places.id (text)
    tabKey: text('tab_key').notNull(),
    lang: text('lang').notNull(),
    title: text('title'),
    bodyMarkdown: text('body_markdown').notNull(),
    source: text('source').notNull().default('seed'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    uniqueEntityTabLang: unique('content_blocks_unique').on(
      table.entityType,
      table.entityId,
      table.tabKey,
      table.lang
    ),
    idxEntity: index('idx_content_blocks_entity').on(table.entityType, table.entityId),
    idxTabLang: index('idx_content_blocks_tab_lang').on(table.tabKey, table.lang),
  })
);

export const eventRegistrations = pgTable('event_registrations', {
  id: text('id').primaryKey(),
  eventId: text('event_id').notNull().references(() => events.id),
  userId: text('user_id').notNull(), // No FK - user_id from Clerk, deletion not supported in MVP
  status: eventRegistrationStatusEnum('status').notNull().default('registered'),
  registeredAt: timestamp('registered_at').notNull().defaultNow(),
}, (table) => ({
  uniqueUserEvent: unique().on(table.userId, table.eventId),
}));

