/**
 * Media Service schema (Phase 2, minimal v1).
 *
 * Scope:
 * - media_assets: ownership + lifecycle for uploaded objects
 * - media_variants: original/derived representations per asset
 */

import { index, integer, pgEnum, pgTable, text, timestamp, unique, varchar } from 'drizzle-orm/pg-core';

export const mediaAssetStatusEnum = pgEnum('media_asset_status', [
  'draft',
  'published',
  'archived',
  'uploading',
  'uploaded',
  'attached',
  'deleted',
]);
export const mediaVariantKindEnum = pgEnum('media_variant_kind', ['original', 'thumbnail', 'webp', 'avif']);
export const mediaVariantStatusEnum = pgEnum('media_variant_status', ['pending', 'ready', 'failed']);
export const mediaUsageOwnerTypeEnum = pgEnum('media_usage_owner_type', [
  'user',
  'space_post',
  'rielt_listing',
  'rf_partner',
  'quest_submission',
  'blog_post',
  'atlas_entity',
]);

export const mediaAssets = pgTable(
  'media_assets',
  {
    id: text('id').primaryKey(),
    ownerUserId: text('owner_user_id').notNull(),
    scope: varchar('scope', { length: 32 }).notNull(),
    provider: varchar('provider', { length: 20 }).notNull().default('r2'),
    bucket: text('bucket').notNull(),
    key: text('key').notNull(),
    mimeType: varchar('mime_type', { length: 100 }).notNull(),
    size: integer('size').notNull(),
    width: integer('width'),
    height: integer('height'),
    status: mediaAssetStatusEnum('status').notNull().default('draft'),
    attachedEntityType: text('attached_entity_type'),
    attachedEntityId: text('attached_entity_id'),
    attachedSlot: text('attached_slot'),
    attachedAt: timestamp('attached_at'),
    publishedAt: timestamp('published_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    uniqueProviderBucketKey: unique('media_assets_provider_bucket_key_unique').on(
      table.provider,
      table.bucket,
      table.key
    ),
    idxOwnerStatusCreatedAt: index('idx_media_assets_owner_status_created_at').on(
      table.ownerUserId,
      table.status,
      table.createdAt
    ),
  })
);

export const mediaUsage = pgTable(
  'media_usage',
  {
    id: text('id').primaryKey(),
    mediaId: text('media_id')
      .notNull()
      .references(() => mediaAssets.id, { onDelete: 'cascade' }),
    ownerType: mediaUsageOwnerTypeEnum('owner_type').notNull(),
    ownerId: text('owner_id').notNull(),
    usageType: varchar('usage_type', { length: 64 }).notNull(),
    slot: varchar('slot', { length: 64 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => ({
    uniqueUsage: unique('media_usage_unique').on(
      table.mediaId,
      table.ownerType,
      table.ownerId,
      table.usageType,
      table.slot
    ),
    idxMediaId: index('idx_media_usage_media_id').on(table.mediaId),
    idxOwner: index('idx_media_usage_owner').on(table.ownerType, table.ownerId),
  })
);

export const mediaVariants = pgTable(
  'media_variants',
  {
    id: text('id').primaryKey(),
    assetId: text('asset_id')
      .notNull()
      .references(() => mediaAssets.id, { onDelete: 'cascade' }),
    kind: mediaVariantKindEnum('kind').notNull(),
    status: mediaVariantStatusEnum('status').notNull().default('ready'),
    provider: varchar('provider', { length: 20 }).notNull().default('r2'),
    bucket: text('bucket').notNull(),
    key: text('key').notNull(),
    mimeType: varchar('mime_type', { length: 100 }).notNull(),
    size: integer('size').notNull(),
    width: integer('width'),
    height: integer('height'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    uniqueAssetKind: unique('media_variants_asset_kind_unique').on(table.assetId, table.kind),
    idxAssetId: index('idx_media_variants_asset_id').on(table.assetId),
  })
);
