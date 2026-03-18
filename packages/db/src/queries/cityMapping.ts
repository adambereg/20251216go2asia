/**
 * City Mapping Layer V1 queries (batch-first, read-oriented).
 *
 * Notes:
 * - No public/runtime dependency intended.
 * - Used by controlled execution scripts to prepare narrow batches.
 */

import type { SqlClient } from './content';

export interface CityMappingRuleRow {
  rule_id: string;
  rule_version: string;
  source_domain: string;
  source_scope: string;
  country_id: string;
  source_city_slug: string;
  target_city_id: string;
  rule_type: string;
  status: string;
}

export interface PulseCityBatchCandidateRow {
  event_id: string;
  event_slug: string;
  country_id: string;
  city_slug: string;
  target_city_id: string;
  rule_version: string;
}

/**
 * Active city mapping rules by source.
 */
export async function listActiveCityMappingRules(
  sql: SqlClient,
  params?: { sourceDomain?: string; sourceScope?: string; ruleVersion?: string; limit?: number }
): Promise<CityMappingRuleRow[]> {
  const sourceDomain = params?.sourceDomain ?? 'pulse';
  const sourceScope = params?.sourceScope ?? 'events.city_slug';
  const ruleVersion = params?.ruleVersion ?? null;
  const limit = Math.min(5000, Math.max(1, params?.limit ?? 2000));

  if (ruleVersion) {
    const rows = await sql`
      SELECT
        rule_id,
        rule_version,
        source_domain,
        source_scope,
        country_id,
        source_city_slug,
        target_city_id,
        rule_type,
        status
      FROM city_mapping_rules
      WHERE source_domain = ${sourceDomain}
        AND source_scope = ${sourceScope}
        AND rule_version = ${ruleVersion}
        AND status = 'active'
      ORDER BY country_id, source_city_slug
      LIMIT ${limit}
    `;
    return rows as CityMappingRuleRow[];
  }

  const rows = await sql`
    SELECT
      rule_id,
      rule_version,
      source_domain,
      source_scope,
      country_id,
      source_city_slug,
      target_city_id,
      rule_type,
      status
    FROM city_mapping_rules
    WHERE source_domain = ${sourceDomain}
      AND source_scope = ${sourceScope}
      AND status = 'active'
    ORDER BY country_id, source_city_slug
    LIMIT ${limit}
  `;
  return rows as CityMappingRuleRow[];
}

/**
 * Preview Pulse event candidates that can be resolved by active rules.
 */
export async function listPulseCityTierCandidatesByRules(
  sql: SqlClient,
  params?: { ruleVersion?: string; limit?: number; offset?: number }
): Promise<PulseCityBatchCandidateRow[]> {
  const ruleVersion = params?.ruleVersion ?? null;
  const limit = Math.min(5000, Math.max(1, params?.limit ?? 500));
  const offset = Math.max(0, params?.offset ?? 0);

  if (ruleVersion) {
    const rows = await sql`
      SELECT
        e.id AS event_id,
        e.slug AS event_slug,
        e.country_id,
        e.city_slug,
        r.target_city_id,
        r.rule_version
      FROM events e
      JOIN city_mapping_rules r
        ON r.source_domain = 'pulse'
       AND r.source_scope = 'events.city_slug'
       AND r.status = 'active'
       AND r.rule_version = ${ruleVersion}
       AND r.country_id = e.country_id
       AND r.source_city_slug = e.city_slug
      WHERE e.city_id IS NULL
      ORDER BY e.country_id, e.city_slug, e.id
      LIMIT ${limit}
      OFFSET ${offset}
    `;
    return rows as PulseCityBatchCandidateRow[];
  }

  const rows = await sql`
    SELECT
      e.id AS event_id,
      e.slug AS event_slug,
      e.country_id,
      e.city_slug,
      r.target_city_id,
      r.rule_version
    FROM events e
    JOIN city_mapping_rules r
      ON r.source_domain = 'pulse'
     AND r.source_scope = 'events.city_slug'
     AND r.status = 'active'
     AND r.country_id = e.country_id
     AND r.source_city_slug = e.city_slug
    WHERE e.city_id IS NULL
    ORDER BY e.country_id, e.city_slug, e.id
    LIMIT ${limit}
    OFFSET ${offset}
  `;
  return rows as PulseCityBatchCandidateRow[];
}

