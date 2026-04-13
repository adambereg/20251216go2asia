import { check, index, integer, pgEnum, pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const reactionTypeEnum = pgEnum('reaction_type', ['like', 'bookmark']);
export const reactionTargetTypeEnum = pgEnum('reaction_target_type', [
  'space_post',
  'blog_post',
  'place',
  'event',
  'partner',
  'listing',
  'quest',
]);
export const reactionStatusEnum = pgEnum('reaction_status', ['active', 'deleted']);

export const reactions = pgTable(
  'reactions',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    targetType: reactionTargetTypeEnum('target_type').notNull(),
    targetId: text('target_id').notNull(),
    reactionType: reactionTypeEnum('reaction_type').notNull().default('like'),
    status: reactionStatusEnum('status').notNull().default('active'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    uniqueReactionPerTarget: unique('reactions_user_target_reaction_unique').on(
      table.userId,
      table.targetType,
      table.targetId,
      table.reactionType
    ),
    targetIdNotBlank: check('reactions_target_id_not_blank_check', sql`(length(trim(${table.targetId})) > 0)`),
    idxTargetReactionStatus: index('idx_reactions_target_reaction_status').on(
      table.targetType,
      table.targetId,
      table.reactionType,
      table.status
    ),
    idxUserTarget: index('idx_reactions_user_target').on(
      table.userId,
      table.targetType,
      table.targetId,
      table.reactionType
    ),
  })
);

export const reactionAggregates = pgTable(
  'reaction_aggregates',
  {
    targetType: reactionTargetTypeEnum('target_type').notNull(),
    targetId: text('target_id').notNull(),
    likeCount: integer('like_count').notNull().default(0),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    uniqueTarget: unique('reaction_aggregates_target_unique').on(table.targetType, table.targetId),
    likeCountNonNegative: check('reaction_aggregates_like_count_non_negative_check', sql`(${table.likeCount} >= 0)`),
    targetIdNotBlank: check(
      'reaction_aggregates_target_id_not_blank_check',
      sql`(length(trim(${table.targetId})) > 0)`
    ),
    idxTargetType: index('idx_reaction_aggregates_target_type').on(table.targetType),
  })
);

export const reactionIdempotencyKeys = pgTable(
  'reaction_idempotency_keys',
  {
    userId: text('user_id').notNull(),
    idempotencyKey: text('idempotency_key').notNull(),
    payloadHash: text('payload_hash').notNull(),
    reactionId: text('reaction_id').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    uniqueUserKey: unique('reaction_idempotency_user_key_unique').on(table.userId, table.idempotencyKey),
    userIdNotBlank: check('reaction_idempotency_user_id_not_blank_check', sql`(length(trim(${table.userId})) > 0)`),
    idempotencyKeyNotBlank: check(
      'reaction_idempotency_key_not_blank_check',
      sql`(length(trim(${table.idempotencyKey})) > 0)`
    ),
    payloadHashNotBlank: check(
      'reaction_idempotency_payload_hash_not_blank_check',
      sql`(length(trim(${table.payloadHash})) > 0)`
    ),
    reactionIdNotBlank: check(
      'reaction_idempotency_reaction_id_not_blank_check',
      sql`(length(trim(${table.reactionId})) > 0)`
    ),
    idxReactionIdempotencyReactionId: index('idx_reaction_idempotency_reaction_id').on(table.reactionId),
  })
);
