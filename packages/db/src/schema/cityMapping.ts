/**
 * City Mapping Layer V1 (minimal schema prep)
 *
 * Notes:
 * - This file defines minimal persistence models for mapping registry and mapping runs.
 * - No runtime/public API assumptions.
 * - No broad review workflow implementation in this slice.
 */

import { pgTable, text, timestamp, integer, index } from 'drizzle-orm/pg-core';

/**
 * Mapping registry (active/pending rules), batch-first usage.
 */
export const cityMappingRules = pgTable(
  'city_mapping_rules',
  {
    ruleId: text('rule_id').primaryKey(), // e.g. v1:pulse:sg:singapore
    ruleVersion: text('rule_version').notNull(), // e.g. v1
    sourceDomain: text('source_domain').notNull(), // pulse | future domains
    sourceScope: text('source_scope').notNull(), // e.g. events.city_slug
    countryId: text('country_id').notNull(),
    sourceCitySlug: text('source_city_slug').notNull(),
    targetCityId: text('target_city_id').notNull(),
    ruleType: text('rule_type').notNull(), // direct_slug | alias | manual
    status: text('status').notNull().default('active'), // active | pending_review | blocked | deprecated
    evidenceType: text('evidence_type'), // tier1_proven | review_promoted
    evidenceCount: integer('evidence_count'),
    approvedBy: text('approved_by'),
    approvedAt: timestamp('approved_at', { withTimezone: true }),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    idxRulesSourceDomain: index('idx_city_mapping_rules_source_domain').on(table.sourceDomain),
    idxRulesCountrySlug: index('idx_city_mapping_rules_country_slug').on(table.countryId, table.sourceCitySlug),
    idxRulesTargetCity: index('idx_city_mapping_rules_target_city').on(table.targetCityId),
    idxRulesStatus: index('idx_city_mapping_rules_status').on(table.status),
  })
);

/**
 * Mapping run journal (controlled execution evidence).
 */
export const cityMappingRuns = pgTable(
  'city_mapping_runs',
  {
    runId: text('run_id').primaryKey(), // e.g. pulse-city-tier1-2026-03-18T11:36:03Z
    sourceDomain: text('source_domain').notNull(),
    sourceScope: text('source_scope').notNull(),
    mappingVersion: text('mapping_version').notNull(),
    runType: text('run_type').notNull(), // preview | backfill | dry_run
    runScope: text('run_scope').notNull(), // e.g. tier1_only / bucket:bangkok
    status: text('status').notNull(), // completed | stopped | failed | planned
    plannedRows: integer('planned_rows'),
    changedRows: integer('changed_rows'),
    unresolvedRows: integer('unresolved_rows'),
    fkBrokenCount: integer('fk_broken_count'),
    startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
    finishedAt: timestamp('finished_at', { withTimezone: true }),
    executedBy: text('executed_by'),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    idxRunsDomainScope: index('idx_city_mapping_runs_domain_scope').on(table.sourceDomain, table.sourceScope),
    idxRunsVersion: index('idx_city_mapping_runs_version').on(table.mappingVersion),
    idxRunsStatus: index('idx_city_mapping_runs_status').on(table.status),
  })
);
