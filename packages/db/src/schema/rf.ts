import { sql } from 'drizzle-orm';
import { check, index, integer, jsonb, numeric, pgEnum, pgTable, text, timestamp, unique, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

import { places } from './content';

export const rfPartnerStatusEnum = pgEnum('rf_partner_status', ['active', 'archived']);
export const rfPartnerItemStatusEnum = pgEnum('rf_partner_item_status', ['active', 'archived']);
export const rfOfferStatusEnum = pgEnum('rf_offer_status', ['draft', 'active', 'archived']);
export const rfOfferTypeEnum = pgEnum('rf_offer_type', ['discount', 'bundle', 'gift', 'access', 'campaign', 'event_related']);
export const rfOfferVisibilityEnum = pgEnum('rf_offer_visibility', ['public', 'pro_only', 'invite_only']);
export const rfRepeatPolicyEnum = pgEnum('rf_repeat_policy', ['once_per_scope', 'repeat_after_redeem']);
export const rfVoucherEconomyStatusEnum = pgEnum('rf_voucher_economy_status', ['not_required', 'pending', 'debited', 'debit_failed']);
export const rfVoucherStatusEnum = pgEnum('rf_voucher_status', ['claimed', 'redeemed', 'cancelled']);
export const rfVoucherCanonicalStatusEnum = pgEnum('rf_voucher_canonical_status', [
  'available',
  'locked',
  'unlocked',
  'redeemed',
  'expired',
  'cancelled',
]);
export const rfVoucherClaimScopeEnum = pgEnum('rf_voucher_claim_scope', ['partner', 'listing']);
export const rfAttributionStatusEnum = pgEnum('rf_attribution_status', ['none', 'confirmed', 'rejected']);
export const rfAttributionSourceEnum = pgEnum('rf_attribution_source', ['pro_link', 'direct_offer', 'internal_navigation', 'unknown']);
export const rfClaimSourceEnum = pgEnum('rf_claim_source', [
  'public_rf_catalog',
  'public_offer_detail',
  'rielt_offer_detail',
  'pro_shared_link',
  'unknown',
]);
export const rfProLinkStatusEnum = pgEnum('rf_pro_link_status', ['pending', 'active', 'ended']);
export const rfProLinkRoleScopeEnum = pgEnum('rf_pro_link_role_scope', [
  'onboarding',
  'curation',
  'promotion',
  'moderation_support',
  'account_support',
]);
export const rfIdempotencyOperationEnum = pgEnum('rf_idempotency_operation', ['voucher_claim']);
export const rfRieltListingOfferStatusEnum = pgEnum('rf_rielt_listing_offer_status', ['active', 'hidden']);
export const rfRieltListingOfferKindEnum = pgEnum('rf_rielt_listing_offer_kind', ['basic', 'premium']);
export const rfVoucherRedemptionResultStatusEnum = pgEnum('rf_voucher_redemption_result_status', [
  'succeeded',
  'failed',
  'duplicate',
]);

export const rfPartners = pgTable(
  'rf_partner',
  {
    id: varchar('id', { length: 80 }).primaryKey(),
    slug: varchar('slug', { length: 180 }).notNull(),
    displayName: varchar('display_name', { length: 160 }).notNull(),
    countryId: varchar('country_id', { length: 128 }).notNull(),
    cityId: varchar('city_id', { length: 128 }).notNull(),
    atlasPlaceId: text('atlas_place_id').references(() => places.id),
    hostAtlasPlaceId: text('host_atlas_place_id').references(() => places.id),
    status: rfPartnerStatusEnum('status').notNull().default('active'),
    ownerUserId: varchar('owner_user_id', { length: 128 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    displayNameNotBlank: check('rf_partner_display_name_not_blank_check', sql`(length(trim(${table.displayName})) > 0)`),
    countryIdNotBlank: check('rf_partner_country_id_not_blank_check', sql`(length(trim(${table.countryId})) > 0)`),
    cityIdNotBlank: check('rf_partner_city_id_not_blank_check', sql`(length(trim(${table.cityId})) > 0)`),
    hostPlaceDiffersFromPlace: check(
      'rf_partner_host_place_differs_check',
      sql`(${table.atlasPlaceId} IS NULL OR ${table.hostAtlasPlaceId} IS NULL OR ${table.atlasPlaceId} <> ${table.hostAtlasPlaceId})`
    ),
    ownerUserIdNotBlank: check('rf_partner_owner_user_id_not_blank_check', sql`(length(trim(${table.ownerUserId})) > 0)`),
    idxStatusUpdatedAt: index('idx_rf_partner_status_updated_at').on(table.status, table.updatedAt),
    idxOwnerStatusUpdatedAt: index('idx_rf_partner_owner_status_updated_at').on(table.ownerUserId, table.status, table.updatedAt),
    idxAtlasPlaceStatusUpdatedAt: index('idx_rf_partner_atlas_place_status_updated_at').on(
      table.atlasPlaceId,
      table.status,
      table.updatedAt
    ),
    idxHostAtlasPlaceStatusUpdatedAt: index('idx_rf_partner_host_atlas_place_status_updated_at').on(
      table.hostAtlasPlaceId,
      table.status,
      table.updatedAt
    ),
  })
);

export const rfPartnerItems = pgTable(
  'rf_partner_item',
  {
    id: varchar('id', { length: 80 }).primaryKey(),
    partnerId: varchar('partner_id', { length: 80 })
      .notNull()
      .references(() => rfPartners.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 240 }).notNull(),
    description: text('description'),
    category: varchar('category', { length: 80 }),
    priceFrom: numeric('price_from', { precision: 12, scale: 2 }),
    currency: varchar('currency', { length: 3 }),
    status: rfPartnerItemStatusEnum('status').notNull().default('active'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    titleNotBlank: check('rf_partner_item_title_not_blank_check', sql`(length(trim(${table.title})) > 0)`),
    priceNonNegative: check('rf_partner_item_price_from_non_negative_check', sql`(${table.priceFrom} IS NULL OR ${table.priceFrom} >= 0)`),
    currencyRequiredWithPrice: check(
      'rf_partner_item_currency_required_with_price_check',
      sql`(${table.priceFrom} IS NULL OR (${table.currency} IS NOT NULL AND length(trim(${table.currency})) = 3))`
    ),
    idxPartnerStatusUpdatedAt: index('idx_rf_partner_item_partner_status_updated_at').on(table.partnerId, table.status, table.updatedAt),
    idxPartnerTitle: index('idx_rf_partner_item_partner_title').on(table.partnerId, table.title),
  })
);

export const rfOffers = pgTable(
  'rf_offer',
  {
    id: varchar('id', { length: 80 }).primaryKey(),
    partnerId: varchar('partner_id', { length: 80 })
      .notNull()
      .references(() => rfPartners.id, { onDelete: 'cascade' }),
    itemId: varchar('item_id', { length: 80 }).references(() => rfPartnerItems.id, { onDelete: 'set null' }),
    title: varchar('title', { length: 240 }).notNull(),
    offerType: rfOfferTypeEnum('offer_type').notNull(),
    visibility: rfOfferVisibilityEnum('visibility').notNull(),
    status: rfOfferStatusEnum('status').notNull().default('draft'),
    repeatPolicy: rfRepeatPolicyEnum('repeat_policy').notNull().default('once_per_scope'),
    pointsCost: integer('points_cost').notNull().default(0),
    createdByUserId: varchar('created_by_user_id', { length: 128 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    titleNotBlank: check('rf_offer_title_not_blank_check', sql`(length(trim(${table.title})) > 0)`),
    createdByNotBlank: check('rf_offer_created_by_user_id_not_blank_check', sql`(length(trim(${table.createdByUserId})) > 0)`),
    pointsCostNonNegative: check('rf_offer_points_cost_non_negative_check', sql`${table.pointsCost} >= 0`),
    idxPartnerStatusVisibilityUpdatedAt: index('idx_rf_offer_partner_status_visibility_updated_at').on(
      table.partnerId,
      table.status,
      table.visibility,
      table.updatedAt
    ),
    idxItemId: index('idx_rf_offer_item_id').on(table.itemId),
    idxStatusVisibilityUpdatedAt: index('idx_rf_offer_status_visibility_updated_at').on(table.status, table.visibility, table.updatedAt),
  })
);

export const rfRieltListingOffers = pgTable(
  'rielt_listing_rf_offer',
  {
    listingId: text('listing_id').notNull(),
    partnerId: varchar('rf_partner_id', { length: 80 })
      .notNull()
      .references(() => rfPartners.id, { onDelete: 'cascade' }),
    offerId: varchar('rf_offer_id', { length: 80 })
      .notNull()
      .references(() => rfOffers.id, { onDelete: 'cascade' }),
    status: rfRieltListingOfferStatusEnum('status').notNull().default('active'),
    offerKind: rfRieltListingOfferKindEnum('offer_kind').notNull().default('basic'),
    priority: integer('priority').notNull().default(100),
    applicabilityNote: text('applicability_note'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    listingIdNotBlank: check('rielt_listing_rf_offer_listing_id_not_blank_check', sql`(length(trim(${table.listingId})) > 0)`),
    priorityNonNegative: check('rielt_listing_rf_offer_priority_non_negative_check', sql`(${table.priority} >= 0)`),
    uniqueListingOffer: uniqueIndex('rielt_listing_rf_offer_listing_offer_unique').on(table.listingId, table.offerId),
    idxListingStatusPriority: index('idx_rielt_listing_rf_offer_listing_status_priority').on(
      table.listingId,
      table.status,
      table.priority
    ),
    idxPartnerStatusPriority: index('idx_rielt_listing_rf_offer_partner_status_priority').on(
      table.partnerId,
      table.status,
      table.priority
    ),
    idxOfferId: index('idx_rielt_listing_rf_offer_offer_id').on(table.offerId),
  })
);

export const rfProLinks = pgTable(
  'rf_pro_link',
  {
    id: varchar('id', { length: 80 }).primaryKey(),
    partnerId: varchar('partner_id', { length: 80 })
      .notNull()
      .references(() => rfPartners.id, { onDelete: 'cascade' }),
    proUserId: varchar('pro_user_id', { length: 128 }).notNull(),
    shareCode: varchar('share_code', { length: 80 }),
    status: rfProLinkStatusEnum('status').notNull().default('pending'),
    roleScope: rfProLinkRoleScopeEnum('role_scope').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    proUserNotBlank: check('rf_pro_link_pro_user_id_not_blank_check', sql`(length(trim(${table.proUserId})) > 0)`),
    shareCodeNotBlank: check('rf_pro_link_share_code_not_blank_check', sql`${table.shareCode} IS NULL OR length(trim(${table.shareCode})) > 0`),
    uniqueShareCode: uniqueIndex('rf_pro_link_share_code_unique')
      .on(table.shareCode)
      .where(sql`${table.shareCode} IS NOT NULL`),
    uniqueLiveLink: uniqueIndex('rf_pro_link_partner_pro_live_unique')
      .on(table.partnerId, table.proUserId)
      .where(sql`${table.status} <> 'ended'`),
    idxProUserStatusUpdatedAt: index('idx_rf_pro_link_pro_user_status_updated_at').on(table.proUserId, table.status, table.updatedAt),
    idxPartnerStatusUpdatedAt: index('idx_rf_pro_link_partner_status_updated_at').on(table.partnerId, table.status, table.updatedAt),
  })
);

export const rfVouchers = pgTable(
  'rf_voucher',
  {
    id: varchar('id', { length: 80 }).primaryKey(),
    offerId: varchar('offer_id', { length: 80 })
      .notNull()
      .references(() => rfOffers.id, { onDelete: 'cascade' }),
    partnerId: varchar('partner_id', { length: 80 })
      .notNull()
      .references(() => rfPartners.id, { onDelete: 'cascade' }),
    issuedToUserId: varchar('issued_to_user_id', { length: 128 }).notNull(),
    status: rfVoucherStatusEnum('status').notNull().default('claimed'),
    canonicalStatus: rfVoucherCanonicalStatusEnum('canonical_status').notNull(),
    contractVersion: integer('contract_version').notNull().default(1),
    repeatPolicySnapshot: rfRepeatPolicyEnum('repeat_policy_snapshot').notNull().default('once_per_scope'),
    issueSequence: integer('issue_sequence').notNull().default(1),
    pointsCostSnapshot: integer('points_cost_snapshot').notNull().default(0),
    pointsDebitExternalId: text('points_debit_external_id'),
    economyStatus: rfVoucherEconomyStatusEnum('economy_status').notNull().default('not_required'),
    claimScope: rfVoucherClaimScopeEnum('claim_scope').notNull().default('partner'),
    rieltListingId: text('rielt_listing_id'),
    rieltListingTitleSnapshot: text('rielt_listing_title_snapshot'),
    code: varchar('code', { length: 32 }).notNull(),
    claimedAt: timestamp('claimed_at').notNull().defaultNow(),
    redeemedAt: timestamp('redeemed_at'),
    expiresAt: timestamp('expires_at'),
    cancelledAt: timestamp('cancelled_at'),
    statusChangedAt: timestamp('status_changed_at').defaultNow(),
    statusReason: text('status_reason'),
    statusActorUserId: varchar('status_actor_user_id', { length: 128 }),
    attributionVersion: integer('attribution_version').notNull().default(1),
    attributionStrategy: varchar('attribution_strategy', { length: 80 }).notNull().default('rf_pro_last_touch_before_claim'),
    attributionStatus: rfAttributionStatusEnum('attribution_status').notNull().default('none'),
    attributionSource: rfAttributionSourceEnum('attribution_source').notNull().default('unknown'),
    claimSource: rfClaimSourceEnum('claim_source').notNull().default('unknown'),
    attributionShareCode: varchar('attribution_share_code', { length: 80 }),
    proAttributedUserId: varchar('pro_attributed_user_id', { length: 128 }),
    proLinkId: varchar('pro_link_id', { length: 80 }).references(() => rfProLinks.id, { onDelete: 'set null' }),
    attributionCapturedAt: timestamp('attribution_captured_at'),
    attributionConfirmedAt: timestamp('attribution_confirmed_at'),
    attributionMetadata: jsonb('attribution_metadata').notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    issuedToNotBlank: check('rf_voucher_issued_to_user_id_not_blank_check', sql`(length(trim(${table.issuedToUserId})) > 0)`),
    codeNotBlank: check('rf_voucher_code_not_blank_check', sql`(length(trim(${table.code})) > 0)`),
    attributionVersionPositive: check('rf_voucher_attribution_version_positive_check', sql`${table.attributionVersion} >= 1`),
    issueSequencePositive: check('rf_voucher_issue_sequence_positive_check', sql`${table.issueSequence} >= 1`),
    pointsCostSnapshotNonNegative: check('rf_voucher_points_cost_snapshot_non_negative_check', sql`${table.pointsCostSnapshot} >= 0`),
    uniqueCode: unique('rf_voucher_code_unique').on(table.code),
    uniquePointsDebitExternalId: uniqueIndex('rf_voucher_points_debit_external_id_unique')
      .on(table.pointsDebitExternalId)
      .where(sql`${table.pointsDebitExternalId} IS NOT NULL`),
    uniquePartnerOfferUserActiveVoucher: uniqueIndex('rf_voucher_offer_user_partner_unique')
      .on(table.offerId, table.issuedToUserId)
      .where(
        sql`${table.claimScope} = 'partner' AND (${table.status} = 'claimed' OR (${table.status} = 'redeemed' AND ${table.repeatPolicySnapshot} = 'once_per_scope'))`
      ),
    uniqueListingOfferUserActiveVoucher: uniqueIndex('rf_voucher_listing_offer_user_active_unique')
      .on(table.rieltListingId, table.offerId, table.issuedToUserId)
      .where(
        sql`${table.claimScope} = 'listing' AND (${table.status} = 'claimed' OR (${table.status} = 'redeemed' AND ${table.repeatPolicySnapshot} = 'once_per_scope'))`
      ),
    uniquePartnerOfferUserCanonicalVoucher: uniqueIndex('rf_voucher_offer_user_partner_canonical_unique')
      .on(table.offerId, table.issuedToUserId)
      .where(
        sql`${table.claimScope} = 'partner' AND (${table.canonicalStatus} IN ('available', 'locked', 'unlocked') OR (${table.canonicalStatus} = 'redeemed' AND ${table.repeatPolicySnapshot} = 'once_per_scope'))`
      ),
    uniqueListingOfferUserCanonicalVoucher: uniqueIndex('rf_voucher_listing_offer_user_canonical_unique')
      .on(table.rieltListingId, table.offerId, table.issuedToUserId)
      .where(
        sql`${table.claimScope} = 'listing' AND (${table.canonicalStatus} IN ('available', 'locked', 'unlocked') OR (${table.canonicalStatus} = 'redeemed' AND ${table.repeatPolicySnapshot} = 'once_per_scope'))`
      ),
    uniquePartnerOfferUserActiveCanonicalVoucher: uniqueIndex('rf_voucher_offer_user_partner_active_canonical_unique')
      .on(table.offerId, table.issuedToUserId)
      .where(sql`${table.claimScope} = 'partner' AND ${table.canonicalStatus} IN ('available', 'locked', 'unlocked')`),
    uniqueListingOfferUserActiveCanonicalVoucher: uniqueIndex('rf_voucher_listing_offer_user_active_canonical_unique')
      .on(table.rieltListingId, table.offerId, table.issuedToUserId)
      .where(sql`${table.claimScope} = 'listing' AND ${table.canonicalStatus} IN ('available', 'locked', 'unlocked')`),
    idxPartnerStatusClaimedAt: index('idx_rf_voucher_partner_status_claimed_at').on(table.partnerId, table.status, table.claimedAt),
    idxIssuedToStatusClaimedAt: index('idx_rf_voucher_issued_to_status_claimed_at').on(table.issuedToUserId, table.status, table.claimedAt),
    idxIssuedToCanonicalClaimedAt: index('idx_rf_voucher_issued_to_canonical_claimed_at').on(
      table.issuedToUserId,
      table.canonicalStatus,
      table.claimedAt
    ),
    idxPartnerCanonicalClaimedAt: index('idx_rf_voucher_partner_canonical_claimed_at').on(
      table.partnerId,
      table.canonicalStatus,
      table.claimedAt
    ),
    idxProAttributionClaimedAt: index('idx_rf_voucher_pro_attribution_claimed_at')
      .on(table.proAttributedUserId, table.claimedAt)
      .where(sql`${table.proAttributedUserId} IS NOT NULL AND ${table.attributionStatus} = 'confirmed'`),
  })
);

export const rfVoucherScopeConsumptionGuards = pgTable(
  'rf_voucher_scope_consumption_guard',
  {
    id: text('id').primaryKey(),
    offerId: varchar('offer_id', { length: 80 })
      .notNull()
      .references(() => rfOffers.id, { onDelete: 'cascade' }),
    issuedToUserId: varchar('issued_to_user_id', { length: 128 }).notNull(),
    claimScope: rfVoucherClaimScopeEnum('claim_scope').notNull(),
    scopeRef: text('scope_ref').notNull(),
    consumedVoucherId: varchar('consumed_voucher_id', { length: 80 })
      .notNull()
      .references(() => rfVouchers.id, { onDelete: 'cascade' }),
    repeatPolicySnapshot: rfRepeatPolicyEnum('repeat_policy_snapshot').notNull().default('once_per_scope'),
    consumedAt: timestamp('consumed_at').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    issuedToNotBlank: check(
      'rf_voucher_scope_consumption_guard_issued_to_not_blank_check',
      sql`(length(trim(${table.issuedToUserId})) > 0)`
    ),
    scopeRefNotBlank: check('rf_voucher_scope_consumption_guard_scope_ref_not_blank_check', sql`(length(trim(${table.scopeRef})) > 0)`),
    uniqueScopeConsumption: uniqueIndex('rf_voucher_scope_consumption_guard_scope_unique').on(
      table.offerId,
      table.issuedToUserId,
      table.claimScope,
      table.scopeRef
    ),
    idxConsumedVoucherId: index('idx_rf_voucher_scope_consumption_guard_voucher_id').on(table.consumedVoucherId),
  })
);

export const rfClaimIdempotency = pgTable(
  'rf_claim_idempotency',
  {
    operation: rfIdempotencyOperationEnum('operation').notNull().default('voucher_claim'),
    actorUserId: varchar('actor_user_id', { length: 128 }).notNull(),
    idempotencyKey: varchar('idempotency_key', { length: 160 }).notNull(),
    voucherId: varchar('voucher_id', { length: 80 })
      .notNull()
      .references(() => rfVouchers.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    actorUserNotBlank: check('rf_claim_idempotency_actor_user_id_not_blank_check', sql`(length(trim(${table.actorUserId})) > 0)`),
    keyNotBlank: check('rf_claim_idempotency_key_not_blank_check', sql`(length(trim(${table.idempotencyKey})) > 0)`),
    uniqueOperationActorKey: unique('rf_claim_idempotency_operation_actor_key_unique').on(
      table.operation,
      table.actorUserId,
      table.idempotencyKey
    ),
    idxVoucherId: index('idx_rf_claim_idempotency_voucher_id').on(table.voucherId),
  })
);

export const rfVoucherRedemptions = pgTable(
  'rf_voucher_redemption',
  {
    id: text('id').primaryKey(),
    voucherId: varchar('voucher_id', { length: 80 })
      .notNull()
      .references(() => rfVouchers.id, { onDelete: 'cascade' }),
    userId: varchar('user_id', { length: 128 }).notNull(),
    partnerId: varchar('partner_id', { length: 80 })
      .notNull()
      .references(() => rfPartners.id, { onDelete: 'restrict' }),
    contextType: text('context_type').notNull().default('manual'),
    contextRef: text('context_ref'),
    resultStatus: rfVoucherRedemptionResultStatusEnum('result_status').notNull(),
    idempotencyKey: text('idempotency_key'),
    actorUserId: varchar('actor_user_id', { length: 128 }),
    redeemedAt: timestamp('redeemed_at'),
    metadata: jsonb('metadata').notNull().default(sql`'{}'::jsonb`),
    correlationId: text('correlation_id'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    idxVoucherCreatedAt: index('idx_rf_voucher_redemption_voucher_created_at').on(table.voucherId, table.createdAt),
    idxPartnerCreatedAt: index('idx_rf_voucher_redemption_partner_created_at').on(table.partnerId, table.createdAt),
    uniqueSucceededVoucher: uniqueIndex('rf_voucher_redemption_success_unique')
      .on(table.voucherId)
      .where(sql`${table.resultStatus} = 'succeeded'`),
    uniqueIdempotencyKey: uniqueIndex('rf_voucher_redemption_idempotency_unique')
      .on(table.actorUserId, table.idempotencyKey)
      .where(sql`${table.idempotencyKey} IS NOT NULL`),
  })
);
