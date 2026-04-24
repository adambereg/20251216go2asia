import { sql } from 'drizzle-orm';
import { check, index, integer, jsonb, pgEnum, pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core';

export const questStatusEnum = pgEnum('quest_status', ['draft', 'published', 'archived']);
export const questVisibilityEnum = pgEnum('quest_visibility', ['public', 'private']);
export const questDifficultyEnum = pgEnum('quest_difficulty', ['easy', 'medium', 'hard']);
export const questStepTypeEnum = pgEnum('quest_step_type', [
  'visit_place',
  'attend_event',
  'visit_partner',
  'challenge',
  'photo_proof',
  'geo_checkin',
  'qr_code',
  'space_action',
]);
export const questVerificationTypeEnum = pgEnum('quest_verification_type', ['auto', 'geo', 'qr', 'manual', 'space_post']);
export const questProgressStatusEnum = pgEnum('quest_progress_status', [
  'not_started',
  'in_progress',
  'pending_review',
  'completed',
  'failed',
  'expired',
]);
export const questSubmissionStatusEnum = pgEnum('quest_submission_status', ['pending', 'approved', 'rejected']);
export const questProofTypeEnum = pgEnum('quest_proof_type', ['photo', 'geo', 'qr', 'space_post', 'text']);
export const questTargetTypeEnum = pgEnum('quest_target_type', ['place', 'event', 'partner', 'space_post']);
export const questRewardOutboxStatusEnum = pgEnum('quest_reward_outbox_status', ['pending', 'delivered', 'failed']);

export const quests = pgTable(
  'quest',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    creatorProId: text('creator_pro_id').notNull(),
    cityId: text('city_id'),
    geoScope: jsonb('geo_scope'),
    type: text('type'),
    theme: text('theme'),
    difficulty: questDifficultyEnum('difficulty'),
    status: questStatusEnum('status').notNull().default('draft'),
    visibility: questVisibilityEnum('visibility').notNull().default('public'),
    rewardPoints: integer('reward_points'),
    stepsCount: integer('steps_count').notNull().default(0),
    publishedAt: timestamp('published_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    titleNotBlank: check('quest_title_not_blank_check', sql`(length(trim(${table.title})) > 0)`),
    creatorProIdNotBlank: check('quest_creator_pro_id_not_blank_check', sql`(length(trim(${table.creatorProId})) > 0)`),
    rewardPointsNonNegative: check(
      'quest_reward_points_non_negative_check',
      sql`(${table.rewardPoints} IS NULL OR ${table.rewardPoints} >= 0)`
    ),
    geoScopeObject: check(
      'quest_geo_scope_object_check',
      sql`(${table.geoScope} IS NULL OR jsonb_typeof(${table.geoScope}) = 'object')`
    ),
    idxStatusVisibilityUpdatedAt: index('idx_quest_status_visibility_updated_at').on(
      table.status,
      table.visibility,
      table.updatedAt
    ),
    idxCityStatusUpdatedAt: index('idx_quest_city_status_updated_at').on(table.cityId, table.status, table.updatedAt),
  })
);

export const questSteps = pgTable(
  'quest_step',
  {
    id: text('id').primaryKey(),
    questId: text('quest_id')
      .notNull()
      .references(() => quests.id, { onDelete: 'cascade' }),
    order: integer('"order"').notNull(),
    type: questStepTypeEnum('type').notNull(),
    targetType: questTargetTypeEnum('target_type'),
    targetId: text('target_id'),
    verificationType: questVerificationTypeEnum('verification_type').notNull(),
    requirementsJson: jsonb('requirements_json').notNull().default(sql`'{}'::jsonb`),
    rewardPoints: integer('reward_points'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    uniqueQuestOrder: unique('quest_step_quest_id_order_unique').on(table.questId, table.order),
    orderPositive: check('quest_step_order_positive_check', sql`(${table.order} > 0)`),
    targetPairConsistency: check(
      'quest_step_target_pair_consistency_check',
      sql`(
        (${table.targetType} IS NULL AND ${table.targetId} IS NULL)
        OR
        (${table.targetType} IS NOT NULL AND ${table.targetId} IS NOT NULL)
      )`
    ),
    requirementsObject: check(
      'quest_step_requirements_object_check',
      sql`jsonb_typeof(${table.requirementsJson}) = 'object'`
    ),
    rewardPointsNonNegative: check(
      'quest_step_reward_points_non_negative_check',
      sql`(${table.rewardPoints} IS NULL OR ${table.rewardPoints} >= 0)`
    ),
    idxQuestOrder: index('idx_quest_step_quest_order').on(table.questId, table.order),
  })
);

export const questProgress = pgTable(
  'quest_progress',
  {
    id: text('id').primaryKey(),
    questId: text('quest_id')
      .notNull()
      .references(() => quests.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull(),
    status: questProgressStatusEnum('status').notNull().default('not_started'),
    currentStep: integer('current_step'),
    startedAt: timestamp('started_at').notNull().defaultNow(),
    completedAt: timestamp('completed_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    uniqueQuestUser: unique('quest_progress_quest_id_user_id_unique').on(table.questId, table.userId),
    userIdNotBlank: check('quest_progress_user_id_not_blank_check', sql`(length(trim(${table.userId})) > 0)`),
    currentStepPositive: check(
      'quest_progress_current_step_positive_check',
      sql`(${table.currentStep} IS NULL OR ${table.currentStep} > 0)`
    ),
    idxUserStatusUpdatedAt: index('idx_quest_progress_user_status_updated_at').on(
      table.userId,
      table.status,
      table.updatedAt
    ),
    idxQuestStatusUpdatedAt: index('idx_quest_progress_quest_status_updated_at').on(
      table.questId,
      table.status,
      table.updatedAt
    ),
  })
);

export const questSubmissions = pgTable(
  'quest_submission',
  {
    id: text('id').primaryKey(),
    progressId: text('progress_id')
      .notNull()
      .references(() => questProgress.id, { onDelete: 'cascade' }),
    stepId: text('step_id')
      .notNull()
      .references(() => questSteps.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull(),
    proofType: questProofTypeEnum('proof_type').notNull(),
    proofData: jsonb('proof_data').notNull().default(sql`'{}'::jsonb`),
    status: questSubmissionStatusEnum('status').notNull().default('pending'),
    reviewedBy: text('reviewed_by'),
    reviewedAt: timestamp('reviewed_at'),
    rejectionReason: text('rejection_reason'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    userIdNotBlank: check('quest_submission_user_id_not_blank_check', sql`(length(trim(${table.userId})) > 0)`),
    proofDataObject: check('quest_submission_proof_data_object_check', sql`jsonb_typeof(${table.proofData}) = 'object'`),
    idxProgressCreatedAt: index('idx_quest_submission_progress_created_at').on(table.progressId, table.createdAt),
    idxStepStatusCreatedAt: index('idx_quest_submission_step_status_created_at').on(
      table.stepId,
      table.status,
      table.createdAt
    ),
    idxUserCreatedAt: index('idx_quest_submission_user_created_at').on(table.userId, table.createdAt),
  })
);

export const questRewardOutbox = pgTable(
  'quest_reward_outbox',
  {
    id: text('id').primaryKey(),
    questProgressId: text('quest_progress_id')
      .notNull()
      .references(() => questProgress.id, { onDelete: 'cascade' }),
    questId: text('quest_id')
      .notNull()
      .references(() => quests.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull(),
    pointsAmount: integer('points_amount').notNull(),
    action: text('action').notNull(),
    externalId: text('external_id').notNull(),
    sourceEventId: text('source_event_id'),
    metadata: jsonb('metadata').notNull().default(sql`'{}'::jsonb`),
    status: questRewardOutboxStatusEnum('status').notNull().default('pending'),
    attemptCount: integer('attempt_count').notNull().default(0),
    lastAttemptAt: timestamp('last_attempt_at'),
    deliveredAt: timestamp('delivered_at'),
    lastError: text('last_error'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    uniqueExternalId: unique('quest_reward_outbox_external_id_unique').on(table.externalId),
    userIdNotBlank: check('quest_reward_outbox_user_id_not_blank_check', sql`(length(trim(${table.userId})) > 0)`),
    actionNotBlank: check('quest_reward_outbox_action_not_blank_check', sql`(length(trim(${table.action})) > 0)`),
    externalIdNotBlank: check(
      'quest_reward_outbox_external_id_not_blank_check',
      sql`(length(trim(${table.externalId})) > 0)`
    ),
    pointsAmountPositive: check('quest_reward_outbox_points_amount_positive_check', sql`(${table.pointsAmount} > 0)`),
    metadataObject: check(
      'quest_reward_outbox_metadata_object_check',
      sql`jsonb_typeof(${table.metadata}) = 'object'`
    ),
    attemptCountNonNegative: check(
      'quest_reward_outbox_attempt_count_non_negative_check',
      sql`(${table.attemptCount} >= 0)`
    ),
    idxStatusCreatedAt: index('idx_quest_reward_outbox_status_created_at').on(table.status, table.createdAt),
    idxProgressId: index('idx_quest_reward_outbox_progress_id').on(table.questProgressId),
  })
);
