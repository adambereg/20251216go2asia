import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

import { places } from './content';

export const listingStatusEnum = pgEnum('listing_status', ['draft', 'published', 'archived']);
export const listingActorRoleEnum = pgEnum('listing_actor_role', ['owner', 'agent']);
export const listingInquiryStatusEnum = pgEnum('listing_inquiry_status', ['new', 'viewed', 'closed']);

export const rieltListings = pgTable(
  'rielt_listing',
  {
    id: text('id').primaryKey(),
    slug: varchar('slug', { length: 180 }).notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    listingType: varchar('listing_type', { length: 24 }).notNull(),
    status: listingStatusEnum('status').notNull().default('draft'),
    priceAmount: numeric('price_amount', { precision: 12, scale: 2 }).notNull().default('0'),
    priceCurrency: varchar('price_currency', { length: 3 }).notNull(),
    pricePeriod: varchar('price_period', { length: 16 }).notNull(),
    countryId: text('country_id').notNull(),
    cityId: text('city_id'),
    atlasPlaceId: text('atlas_place_id').references(() => places.id),
    atlasContainerPlaceId: text('atlas_container_place_id').references(() => places.id),
    rfPartnerId: varchar('rf_partner_id', { length: 80 }),
    rfOfferId: varchar('rf_offer_id', { length: 80 }),
    areaText: text('area_text'),
    lat: numeric('lat', { precision: 9, scale: 6 }),
    lng: numeric('lng', { precision: 9, scale: 6 }),
    bedrooms: integer('bedrooms'),
    bathrooms: integer('bathrooms'),
    areaSqm: numeric('area_sqm', { precision: 8, scale: 2 }),
    amenities: text('amenities').array().notNull().default(sql`ARRAY[]::text[]`),
    createdByUserId: text('created_by_user_id').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    publishedAt: timestamp('published_at'),
    archivedAt: timestamp('archived_at'),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => ({
    uniqueSlug: unique('rielt_listing_slug_unique').on(table.slug),
    titleNotBlank: check('rielt_listing_title_not_blank_check', sql`(length(trim(${table.title})) > 0)`),
    descriptionNotBlank: check(
      'rielt_listing_description_not_blank_check',
      sql`(length(trim(${table.description})) > 0)`
    ),
    listingTypeNotBlank: check(
      'rielt_listing_listing_type_not_blank_check',
      sql`(length(trim(${table.listingType})) > 0)`
    ),
    listingTypeAllowedValuesCheck: check(
      'rielt_listing_listing_type_allowed_values_check',
      sql`(${table.listingType} IN ('rent_long', 'rent_short', 'sale'))`
    ),
    priceCurrencyLengthCheck: check(
      'rielt_listing_price_currency_length_check',
      sql`(length(trim(${table.priceCurrency})) = 3)`
    ),
    pricePeriodAllowedValuesCheck: check(
      'rielt_listing_price_period_allowed_values_check',
      sql`(${table.pricePeriod} IN ('month', 'day', 'total'))`
    ),
    priceAmountNonNegative: check(
      'rielt_listing_price_amount_non_negative_check',
      sql`(${table.priceAmount} >= 0)`
    ),
    bedroomsNonNegative: check('rielt_listing_bedrooms_non_negative_check', sql`(${table.bedrooms} IS NULL OR ${table.bedrooms} >= 0)`),
    bathroomsNonNegative: check(
      'rielt_listing_bathrooms_non_negative_check',
      sql`(${table.bathrooms} IS NULL OR ${table.bathrooms} >= 0)`
    ),
    latLngPairCheck: check(
      'rielt_listing_lat_lng_pair_check',
      sql`((${table.lat} IS NULL AND ${table.lng} IS NULL) OR (${table.lat} IS NOT NULL AND ${table.lng} IS NOT NULL))`
    ),
    latRangeCheck: check(
      'rielt_listing_lat_range_check',
      sql`(${table.lat} IS NULL OR (${table.lat} >= -90 AND ${table.lat} <= 90))`
    ),
    lngRangeCheck: check(
      'rielt_listing_lng_range_check',
      sql`(${table.lng} IS NULL OR (${table.lng} >= -180 AND ${table.lng} <= 180))`
    ),
    atlasContainerDiffersFromPlaceCheck: check(
      'rielt_listing_atlas_container_differs_check',
      sql`(${table.atlasPlaceId} IS NULL OR ${table.atlasContainerPlaceId} IS NULL OR ${table.atlasPlaceId} <> ${table.atlasContainerPlaceId})`
    ),
    rfPartnerIdFormatCheck: check(
      'rielt_listing_rf_partner_id_format_check',
      sql`(${table.rfPartnerId} IS NULL OR (length(trim(${table.rfPartnerId})) > 0 AND position(' ' in ${table.rfPartnerId}) = 0))`
    ),
    rfOfferIdFormatCheck: check(
      'rielt_listing_rf_offer_id_format_check',
      sql`(${table.rfOfferId} IS NULL OR (length(trim(${table.rfOfferId})) > 0 AND position(' ' in ${table.rfOfferId}) = 0))`
    ),
    rfOfferRequiresPartnerCheck: check(
      'rielt_listing_rf_offer_requires_partner_check',
      sql`(${table.rfOfferId} IS NULL OR ${table.rfPartnerId} IS NOT NULL)`
    ),
    idxStatusCountryCityUpdatedAt: index('idx_rielt_listing_status_country_city_updated_at').on(
      table.status,
      table.countryId,
      table.cityId,
      table.updatedAt
    ),
    idxCountryCityListingTypePrice: index('idx_rielt_listing_country_city_type_price').on(
      table.countryId,
      table.cityId,
      table.listingType,
      table.priceAmount
    ),
    idxCreatedByStatusUpdatedAt: index('idx_rielt_listing_created_by_status_updated_at').on(
      table.createdByUserId,
      table.status,
      table.updatedAt
    ),
    idxAtlasPlaceStatusUpdatedAt: index('idx_rielt_listing_atlas_place_status_updated_at').on(
      table.atlasPlaceId,
      table.status,
      table.updatedAt
    ),
    idxAtlasContainerStatusUpdatedAt: index('idx_rielt_listing_atlas_container_status_updated_at').on(
      table.atlasContainerPlaceId,
      table.status,
      table.updatedAt
    ),
    idxGeoPublishedAt: index('idx_rielt_listing_geo_published_at').on(table.lat, table.lng, table.publishedAt),
  })
);

export const rieltListingMedia = pgTable(
  'rielt_listing_media',
  {
    id: text('id').primaryKey(),
    listingId: text('listing_id')
      .notNull()
      .references(() => rieltListings.id, { onDelete: 'cascade' }),
    mediaId: text('media_id').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    isCover: boolean('is_cover').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => ({
    uniqueListingMediaActive: uniqueIndex('rielt_listing_media_listing_id_media_id_unique')
      .on(table.listingId, table.mediaId)
      .where(sql`${table.deletedAt} IS NULL`),
    uniqueListingSortOrderActive: uniqueIndex('rielt_listing_media_listing_id_sort_order_unique')
      .on(table.listingId, table.sortOrder)
      .where(sql`${table.deletedAt} IS NULL`),
    sortOrderNonNegative: check(
      'rielt_listing_media_sort_order_non_negative_check',
      sql`(${table.sortOrder} >= 0)`
    ),
    idxListingSortOrder: index('idx_rielt_listing_media_listing_sort_order').on(table.listingId, table.sortOrder),
    idxMediaId: index('idx_rielt_listing_media_media_id').on(table.mediaId),
  })
);

export const rieltListingActorLinks = pgTable(
  'rielt_listing_actor_link',
  {
    id: text('id').primaryKey(),
    listingId: text('listing_id')
      .notNull()
      .references(() => rieltListings.id, { onDelete: 'cascade' }),
    actorUserId: text('actor_user_id').notNull(),
    actorRole: listingActorRoleEnum('actor_role').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    revokedAt: timestamp('revoked_at'),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => ({
    uniqueListingActorRoleActive: uniqueIndex('rielt_listing_actor_link_listing_user_role_unique')
      .on(table.listingId, table.actorUserId, table.actorRole)
      .where(sql`${table.revokedAt} IS NULL AND ${table.deletedAt} IS NULL`),
    uniqueActiveOwnerPerListing: uniqueIndex('rielt_listing_actor_link_active_owner_unique')
      .on(table.listingId)
      .where(sql`${table.actorRole} = 'owner' AND ${table.revokedAt} IS NULL AND ${table.deletedAt} IS NULL`),
    idxActorUserRoleListing: index('idx_rielt_listing_actor_link_user_role_listing').on(
      table.actorUserId,
      table.actorRole,
      table.listingId
    ),
    idxListingRoleUser: index('idx_rielt_listing_actor_link_listing_role_user').on(
      table.listingId,
      table.actorRole,
      table.actorUserId
    ),
  })
);

export const rieltListingInquiries = pgTable(
  'rielt_listing_inquiry',
  {
    id: text('id').primaryKey(),
    listingId: text('listing_id')
      .notNull()
      .references(() => rieltListings.id, { onDelete: 'cascade' }),
    requesterUserId: text('requester_user_id').notNull(),
    message: text('message').notNull(),
    contactName: varchar('contact_name', { length: 120 }),
    contactPhone: varchar('contact_phone', { length: 40 }),
    contactTelegram: varchar('contact_telegram', { length: 80 }),
    status: listingInquiryStatusEnum('status').notNull().default('new'),
    idempotencyKey: varchar('idempotency_key', { length: 80 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    closedAt: timestamp('closed_at'),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => ({
    messageNotBlank: check('rielt_listing_inquiry_message_not_blank_check', sql`(length(trim(${table.message})) > 0)`),
    idempotencyKeyNotBlank: check(
      'rielt_listing_inquiry_idempotency_key_not_blank_check',
      sql`(length(trim(${table.idempotencyKey})) > 0)`
    ),
    uniqueInquiryIdempotency: unique('rielt_listing_inquiry_user_listing_idempotency_unique').on(
      table.requesterUserId,
      table.listingId,
      table.idempotencyKey
    ),
    idxListingStatusCreatedAt: index('idx_rielt_listing_inquiry_listing_status_created_at').on(
      table.listingId,
      table.status,
      table.createdAt
    ),
    idxRequesterCreatedAt: index('idx_rielt_listing_inquiry_requester_created_at').on(
      table.requesterUserId,
      table.createdAt
    ),
  })
);
