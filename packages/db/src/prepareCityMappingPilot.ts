/**
 * City Mapping V1 minimal prep script (read-only).
 *
 * What it does:
 * - Reads active rules seed CSV.
 * - Validates seed shape for active-rule ingestion.
 * - Builds a preview manifest for one pilot bucket (default: th + bangkok).
 *
 * What it does NOT do:
 * - No writes to DB.
 * - No schema changes.
 * - No unresolved broad rollout.
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Client } from 'pg';

type ActiveRuleSeedRow = {
  ruleVersion: string;
  sourceDomain: string;
  sourceScope: string;
  countryId: string;
  sourceCitySlug: string;
  targetCityId: string;
  ruleType: string;
  status: string;
  evidenceType: string;
  evidenceCount: number;
  approvedBy: string;
  approvedAt: string;
  notes: string;
};

function getDatabaseUrl(): string {
  const direct = process.env.STAGING_DATABASE_URL || process.env.DATABASE_URL;
  const repoRoot = resolve(__dirname, '..', '..', '..');
  const envPath = resolve(repoRoot, '.env.local');
  let fromFile: string | null = null;
  if (existsSync(envPath)) {
    const env = readFileSync(envPath, 'utf8');
    const m = env.match(/^STAGING_DATABASE_URL=(.+)$/m) || env.match(/^DATABASE_URL=(.+)$/m);
    fromFile = m?.[1]?.trim() ?? null;
  }
  const url = direct || fromFile;
  if (!url) throw new Error('Missing STAGING_DATABASE_URL or DATABASE_URL (env/.env.local)');
  const env = (process.env.ENVIRONMENT ?? 'dev').toLowerCase();
  if (env === 'production') throw new Error('Refusing to run with ENVIRONMENT=production');
  return url;
}

function parseCsvLine(line: string): string[] {
  // Seed uses simple CSV values without escaped commas.
  return line.split(',').map((v) => v.trim());
}

function loadActiveRulesSeed(csvPath: string): ActiveRuleSeedRow[] {
  const raw = readFileSync(csvPath, 'utf8');
  const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return [];

  const header = parseCsvLine(lines[0] ?? '');
  const required = [
    'rule_version',
    'source_domain',
    'source_scope',
    'country_id',
    'source_city_slug',
    'target_city_id',
    'rule_type',
    'status',
    'evidence_type',
    'evidence_count',
    'approved_by',
    'approved_at',
    'notes',
  ];
  for (const col of required) {
    if (!header.includes(col)) {
      throw new Error(`Seed CSV missing required column: ${col}`);
    }
  }

  const ix = (name: string) => header.indexOf(name);
  const rows: ActiveRuleSeedRow[] = [];
  for (const line of lines.slice(1)) {
    const cols = parseCsvLine(line);
    const row: ActiveRuleSeedRow = {
      ruleVersion: cols[ix('rule_version')] ?? '',
      sourceDomain: cols[ix('source_domain')] ?? '',
      sourceScope: cols[ix('source_scope')] ?? '',
      countryId: cols[ix('country_id')] ?? '',
      sourceCitySlug: cols[ix('source_city_slug')] ?? '',
      targetCityId: cols[ix('target_city_id')] ?? '',
      ruleType: cols[ix('rule_type')] ?? '',
      status: cols[ix('status')] ?? '',
      evidenceType: cols[ix('evidence_type')] ?? '',
      evidenceCount: Number(cols[ix('evidence_count')] ?? '0') || 0,
      approvedBy: cols[ix('approved_by')] ?? '',
      approvedAt: cols[ix('approved_at')] ?? '',
      notes: cols[ix('notes')] ?? '',
    };
    rows.push(row);
  }
  return rows;
}

function parseArgs(argv: string[]): { countryId: string; citySlug: string } {
  const get = (flag: string, fallback: string): string => {
    const i = argv.findIndex((v) => v === flag);
    return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
  };
  return {
    countryId: get('--country-id', 'th'),
    citySlug: get('--city-slug', 'bangkok'),
  };
}

async function main() {
  const { countryId, citySlug } = parseArgs(process.argv.slice(2));
  const repoRoot = resolve(__dirname, '..', '..', '..');
  const rulesPath = resolve(repoRoot, 'packages', 'db', 'seeds', 'city-mapping', 'city_mapping_rules_seed_v1.csv');
  const rules = loadActiveRulesSeed(rulesPath);

  const activeRules = rules.filter((r) => r.status === 'active');
  const inactive = rules.filter((r) => r.status !== 'active');
  if (inactive.length > 0) {
    throw new Error(`Active-rules seed contains non-active rows: ${inactive.length}`);
  }

  const matchingRule = activeRules.find(
    (r) => r.sourceDomain === 'pulse' && r.sourceScope === 'events.city_slug' && r.countryId === countryId && r.sourceCitySlug === citySlug
  );

  const url = getDatabaseUrl();
  const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    const unresolvedRows = await client.query<{ id: string; slug: string; country_id: string; city_slug: string }>(
      `
        SELECT id, slug, country_id, city_slug
        FROM events
        WHERE country_id = $1
          AND city_slug = $2
          AND city_id IS NULL
        ORDER BY id ASC
      `,
      [countryId, citySlug]
    );

    const total = unresolvedRows.rowCount ?? unresolvedRows.rows.length;
    const batches: Array<{ batchNo: number; size: number; eventIds: string[] }> = [];
    const batchSize = 5;
    for (let i = 0; i < unresolvedRows.rows.length; i += batchSize) {
      const slice = unresolvedRows.rows.slice(i, i + batchSize);
      batches.push({
        batchNo: Math.floor(i / batchSize) + 1,
        size: slice.length,
        eventIds: slice.map((r) => r.id),
      });
    }

    const manifest = {
      pilot: { countryId, citySlug },
      reviewDecisionRequired: !matchingRule,
      activeRulePresent: !!matchingRule,
      proposedTargetCityId: matchingRule?.targetCityId ?? null,
      unresolvedRows: total,
      batchSize,
      batchCount: batches.length,
      batches,
      note: 'Read-only preview. No DB writes executed.',
    };

    // eslint-disable-next-line no-console
    console.log(JSON.stringify(manifest, null, 2));
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('[city-mapping-pilot-prep] FATAL', error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

