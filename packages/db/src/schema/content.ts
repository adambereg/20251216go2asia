/**
 * Content Service schema
 * 
 * Tables: countries, cities, places, events, articles, event_registrations
 */

import { pgTable, text, timestamp, varchar, boolean, jsonb, unique } from 'drizzle-orm/pg-core';

export const countries = pgTable('countries', {
  id: text('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 2 }).notNull().unique(), // ISO 3166-1 alpha-2
  flagEmoji: varchar('flag_emoji', { length: 10 }),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const cities = pgTable('cities', {
  id: text('id').primaryKey(),
  countryId: text('country_id').notNull().references(() => countries.id),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  latitude: varchar('latitude', { length: 50 }),
  longitude: varchar('longitude', { length: 50 }),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const places = pgTable('places', {
  id: text('id').primaryKey(),
  cityId: text('city_id').references(() => cities.id),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  type: varchar('type', { length: 100 }).notNull(), // attraction, restaurant, cafe, beach, etc.
  description: text('description'),
  latitude: varchar('latitude', { length: 50 }),
  longitude: varchar('longitude', { length: 50 }),
  address: text('address'),
  images: jsonb('images'), // Array of image URLs
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const events = pgTable('events', {
  id: text('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  location: text('location'),
  latitude: varchar('latitude', { length: 50 }),
  longitude: varchar('longitude', { length: 50 }),
  imageUrl: text('image_url'),
  isActive: boolean('is_active').notNull().default(true),
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
  imageUrl: text('image_url'),
  publishedAt: timestamp('published_at'),
  isPublished: boolean('is_published').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const eventRegistrations = pgTable('event_registrations', {
  id: text('id').primaryKey(),
  eventId: text('event_id').notNull().references(() => events.id),
  userId: text('user_id').notNull(), // No FK - user_id from Clerk, deletion not supported in MVP
  registeredAt: timestamp('registered_at').notNull().defaultNow(),
}, (table) => ({
  uniqueUserEvent: unique().on(table.userId, table.eventId),
}));

