import { sql } from 'drizzle-orm';
import { check, index, pgEnum, pgTable, timestamp, unique, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

export const rfPartnerStatusEnum = pgEnum('rf_partner_status', ['active', 'archived']);
export const rfOfferStatusEnum = pgEnum('rf_offer_status', ['draft', 'active', 'archived']);
export const rfOfferTypeEnum = pgEnum('rf_offer_type', ['discount', 'bundle', 'gift', 'access', 'campaign', 'event_related']);
export const rfOfferVisibilityEnum = pgEnum('rf_offer_visibility', ['public', 'pro_only', 'invite_only']);
export const rfVoucherStatusEnum = pgEnum('rf_voucher_status', ['claimed', 'redeemed', 'cancelled']);
export const rfProLinkStatusEnum = pgEnum('rf_pro_link_status', ['pending', 'active', 'ended']);
export const rfProLinkRoleScopeEnum = pgEnum('rf_pro_link_role_scope', [
  'onboarding',
  'curation',
  'promotion',
  'moderation_support',
  'account_support',
]);
export const rfIdempotencyOperationEnum = pgEnum('rf_idempotency_operation', ['voucher_claim']);

export const rfPartners = pgTable(
  'rf_partner',
  {
    id: varchar('id', { length: 80 }).primaryKey(),
    slug: varchar('slug', { length: 180 }).notNull(),
    displayName: varchar('display_name', { length: 160 }).notNull(),
    countryId: varchar('country_id', { length: 128 }).notNull(),
    cityId: varchar('city_id', { length: 128 }).notNull(),
    status: rfPartnerStatusEnum('status').notNull().default('active'),
    ownerUserId: varchar('owner_user_id', { length: 128 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    displayNameNotBlank: check('rf_partner_display_name_not_blank_check', sql`(length(trim(${table.displayName})) > 0)`),
    countryIdNotBlank: check('rf_partner_country_id_not_blank_check', sql`(length(trim(${table.countryId})) > 0)`),
    cityIdNotBlank: check('rf_partner_city_id_not_blank_check', sql`(length(trim(${table.cityId})) > 0)`),
    ownerUserIdNotBlank: check('rf_partner_owner_user_id_not_blank_check', sql`(length(trim(${table.ownerUserId})) > 0)`),
    idxStatusUpdatedAt: index('idx_rf_partner_status_updated_at').on(table.status, table.updatedAt),
    idxOwnerStatusUpdatedAt: index('idx_rf_partner_owner_status_updated_at').on(table.ownerUserId, table.status, table.updatedAt),
  })
);

export const rfOffers = pgTable(
  'rf_offer',
  {
    id: varchar('id', { length: 80 }).primaryKey(),
    partnerId: varchar('partner_id', { length: 80 })
      .notNull()
      .references(() => rfPartners.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 240 }).notNull(),
    offerType: rfOfferTypeEnum('offer_type').notNull(),
    visibility: rfOfferVisibilityEnum('visibility').notNull(),
    status: rfOfferStatusEnum('status').notNull().default('draft'),
    createdByUserId: varchar('created_by_user_id', { length: 128 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    titleNotBlank: check('rf_offer_title_not_blank_check', sql`(length(trim(${table.title})) > 0)`),
    createdByNotBlank: check('rf_offer_created_by_user_id_not_blank_check', sql`(length(trim(${table.createdByUserId})) > 0)`),
    idxPartnerStatusVisibilityUpdatedAt: index('idx_rf_offer_partner_status_visibility_updated_at').on(
      table.partnerId,
      table.status,
      table.visibility,
      table.updatedAt
    ),
    idxStatusVisibilityUpdatedAt: index('idx_rf_offer_status_visibility_updated_at').on(table.status, table.visibility, table.updatedAt),
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
    code: varchar('code', { length: 32 }).notNull(),
    claimedAt: timestamp('claimed_at').notNull().defaultNow(),
    redeemedAt: timestamp('redeemed_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    issuedToNotBlank: check('rf_voucher_issued_to_user_id_not_blank_check', sql`(length(trim(${table.issuedToUserId})) > 0)`),
    codeNotBlank: check('rf_voucher_code_not_blank_check', sql`(length(trim(${table.code})) > 0)`),
    uniqueCode: unique('rf_voucher_code_unique').on(table.code),
    uniqueOfferUserActiveVoucher: uniqueIndex('rf_voucher_offer_user_active_unique')
      .on(table.offerId, table.issuedToUserId)
      .where(sql`${table.status} IN ('claimed', 'redeemed')`),
    idxPartnerStatusClaimedAt: index('idx_rf_voucher_partner_status_claimed_at').on(table.partnerId, table.status, table.claimedAt),
    idxIssuedToStatusClaimedAt: index('idx_rf_voucher_issued_to_status_claimed_at').on(table.issuedToUserId, table.status, table.claimedAt),
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
    status: rfProLinkStatusEnum('status').notNull().default('pending'),
    roleScope: rfProLinkRoleScopeEnum('role_scope').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    proUserNotBlank: check('rf_pro_link_pro_user_id_not_blank_check', sql`(length(trim(${table.proUserId})) > 0)`),
    uniqueLiveLink: uniqueIndex('rf_pro_link_partner_pro_live_unique')
      .on(table.partnerId, table.proUserId)
      .where(sql`${table.status} <> 'ended'`),
    idxProUserStatusUpdatedAt: index('idx_rf_pro_link_pro_user_status_updated_at').on(table.proUserId, table.status, table.updatedAt),
    idxPartnerStatusUpdatedAt: index('idx_rf_pro_link_partner_status_updated_at').on(table.partnerId, table.status, table.updatedAt),
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
