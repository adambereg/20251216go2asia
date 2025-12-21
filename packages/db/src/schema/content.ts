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
} from 'drizzle-orm/pg-core';

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

export const cities = pgTable('cities', {
  id: text('id').primaryKey(),
  countryId: text('country_id').notNull().references(() => countries.id),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  descriptionShort: text('description_short'),
  latitude: numeric('latitude', { precision: 9, scale: 6 }),
  longitude: numeric('longitude', { precision: 9, scale: 6 }),
  heroMediaId: text('hero_media_id').references(() => mediaFiles.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const places = pgTable('places', {
  id: text('id').primaryKey(),
  countryId: text('country_id').references(() => countries.id),
  cityId: text('city_id').references(() => cities.id),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  type: varchar('type', { length: 100 }).notNull(), // attraction, restaurant, cafe, beach, etc.
  descriptionShort: text('description_short'),
  latitude: numeric('latitude', { precision: 9, scale: 6 }),
  longitude: numeric('longitude', { precision: 9, scale: 6 }),
  address: text('address'),
  heroMediaId: text('hero_media_id').references(() => mediaFiles.id),
  // Temporary compatibility for UI-first stage: keep optional list of public URLs.
  // In API integration (PR#3+), UI should read via media_files.
  images: jsonb('images'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const events = pgTable('events', {
  id: text('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }),
  startDate: timestamp('start_date').notNull(), // start_at (MVP)
  endDate: timestamp('end_date'), // end_at (MVP)
  location: text('location'),
  countryId: text('country_id').references(() => countries.id),
  cityId: text('city_id').references(() => cities.id),
  latitude: numeric('latitude', { precision: 9, scale: 6 }),
  longitude: numeric('longitude', { precision: 9, scale: 6 }),
  // Keep existing column for current content-service compatibility.
  imageUrl: text('image_url'),
  imageMediaId: text('image_media_id').references(() => mediaFiles.id),
  isFree: boolean('is_free').notNull().default(true),
  priceAmount: integer('price_amount'), // minor units or integer amount for MVP
  priceCurrency: varchar('price_currency', { length: 10 }),
  status: varchar('status', { length: 30 }).notNull().default('active'), // active/cancelled/draft
  isActive: boolean('is_active').notNull().default(true), // legacy flag used by current code
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

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
  status: varchar('status', { length: 30 }).notNull().default('draft'), // draft/published/archived
  isPublished: boolean('is_published').notNull().default(false), // legacy flag (MVP)
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const eventRegistrations = pgTable('event_registrations', {
  id: text('id').primaryKey(),
  eventId: text('event_id').notNull().references(() => events.id),
  userId: text('user_id').notNull(), // No FK - user_id from Clerk, deletion not supported in MVP
  status: varchar('status', { length: 30 }).notNull().default('registered'),
  registeredAt: timestamp('registered_at').notNull().defaultNow(),
}, (table) => ({
  uniqueUserEvent: unique().on(table.userId, table.eventId),
}));

