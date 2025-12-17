/**
 * Points Service schema
 * 
 * Tables: points_transactions, user_balances, user_badges
 */

import { pgTable, text, timestamp, integer, varchar, jsonb } from 'drizzle-orm/pg-core';

export const pointsTransactions = pgTable('points_transactions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(), // No FK - user_id from Clerk, deletion not supported in MVP
  amount: integer('amount').notNull(), // Can be positive (earned) or negative (spent)
  reason: varchar('reason', { length: 100 }).notNull(), // registration, first_login, event_registration, referral_bonus, etc.
  sourceService: varchar('source_service', { length: 100 }), // auth-service, content-service, referral-service
  sourceEventId: text('source_event_id'), // ID of the event that triggered this transaction
  externalId: text('external_id').unique(), // For idempotency
  metadata: jsonb('metadata'), // Additional data (user_role, etc.)
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const userBalances = pgTable('user_balances', {
  userId: text('user_id').primaryKey(), // No FK - user_id from Clerk, deletion not supported in MVP
  balance: integer('balance').notNull().default(0),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const userBadges = pgTable('user_badges', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(), // No FK - user_id from Clerk, deletion not supported in MVP
  badgeId: varchar('badge_id', { length: 100 }).notNull(),
  badgeName: varchar('badge_name', { length: 255 }).notNull(),
  earnedAt: timestamp('earned_at').notNull().defaultNow(),
});

