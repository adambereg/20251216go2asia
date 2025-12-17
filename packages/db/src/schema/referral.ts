/**
 * Referral Service schema
 * 
 * Tables: referral_links, referral_relations
 */

import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const referralLinks = pgTable('referral_links', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().unique(), // No FK - user_id from Clerk, deletion not supported in MVP
  referralCode: varchar('referral_code', { length: 50 }).notNull().unique(), // SSOT: Referral Service owns this
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const referralRelations = pgTable('referral_relations', {
  id: text('id').primaryKey(),
  referrerId: text('referrer_id').notNull(), // No FK - user_id from Clerk, deletion not supported in MVP
  refereeId: text('referee_id').notNull().unique(), // No FK - user_id from Clerk, deletion not supported in MVP
  registeredAt: timestamp('registered_at').notNull().defaultNow(),
  firstLoginAt: timestamp('first_login_at'), // When referee first logged in
});

