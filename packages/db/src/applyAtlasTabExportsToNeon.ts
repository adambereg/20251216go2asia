/**
 * Apply Atlas exports/neon/<country>/content_blocks.sql into Neon Postgres (tabs only).
 *
 * Differences vs applyAtlasExportsToNeon.ts:
 * - Does NOT apply places.sql (so it won't touch table `places`).
 * - Applies only content_blocks.sql (which may contain place blocks too, but table is only content_blocks).
 * - Includes verification focused on entity_type in ('country','city').
 *
 * Usage:
 *   pnpm -C packages/db exec -- tsx src/applyAtlasTabExportsToNeon.ts thailand
 *   pnpm -C packages/db exec -- tsx src/applyAtlasTabExportsToNeon.ts vietnam --city sgn
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { Client } from 'pg';

type Args = {
  country: string;
  city?: string;
};

function parseArgs(argv: string[]): Args {
  const country = (argv[2] ?? '').trim();
  if (!country) throw new Error('Missing <country> argument. Example: thailand');
  const cityIdx = argv.indexOf('--city');
  const city = cityIdx !== -1 ? (argv[cityIdx + 1] ?? '').trim() : undefined;
  return { country: country.toLowerCase(), city: city?.toLowerCase() };
}

function parseDotEnvLike(content: string): Record<string, string> {
  const out: Record<string, string> = {};
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (key) out[key] = val;
  }
  return out;
}

function maybeLoadEnvLocal(repoRoot: string) {
  const envLocal = join(repoRoot, '.env.local');
  if (!existsSync(envLocal)) return;
  const content = readFileSync(envLocal, 'utf-8');
  const vars = parseDotEnvLike(content);
  for (const [k, v] of Object.entries(vars)) {
    if (!process.env[k] && v) process.env[k] = v;
  }
}

function getDatabaseUrl(): string {
  const url = process.env.STAGING_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) throw new Error('Missing STAGING_DATABASE_URL or DATABASE_URL (env or .env.local)');
  return url;
}

function maskDbUrl(url: string): string {
  try {
    const u = new URL(url);
    const user = u.username ? `${u.username}:***@` : '';
    return `${u.protocol}//${user}${u.host}${u.pathname}`;
  } catch {
    return 'postgresql://***';
  }
}

async function applySqlFile(client: Client, filePath: string) {
  if (!existsSync(filePath)) throw new Error(`SQL file not found: ${filePath}`);
  const sql = readFileSync(filePath, 'utf-8');
  await client.query(sql);
}

async function cleanupCountryListTabBlocks(client: Client, countryId: string): Promise<number> {
  const res = await client.query<{ count: string }>(
    `
    WITH deleted AS (
      DELETE FROM content_blocks
      WHERE entity_type = 'country'
        AND entity_id = $1
        AND lang = 'ru'
        AND tab_key IN ('cities','places')
      RETURNING 1
    )
    SELECT COUNT(*)::text as count FROM deleted
    `,
    [countryId]
  );
  return Number(res.rows[0]?.count ?? 0);
}

async function verifyDb(client: Client, countryId: string, cityId?: string) {
  const total = await client.query<{ count: string }>(
    "SELECT COUNT(*)::text as count FROM content_blocks WHERE entity_type IN ('country','city')",
    []
  );
  const totalBlocks = Number(total.rows[0]?.count ?? 0);

  const byType = await client.query<{ entity_type: string; count: string }>(
    "SELECT entity_type, COUNT(*)::text as count FROM content_blocks WHERE entity_type IN ('country','city') GROUP BY entity_type ORDER BY entity_type",
    []
  );

  const countryTabs = await client.query<{ tab_key: string; lang: string; body_len: string }>(
    "SELECT tab_key, lang, LENGTH(body_markdown)::text as body_len FROM content_blocks WHERE entity_type='country' AND entity_id=$1 AND lang='ru' ORDER BY tab_key",
    [countryId]
  );

  const expectedCountry = [
    'overview',
    'gallery',
    'map',
    'weather',
    'history',
    'geography',
    'culture',
    'living',
    'visas',
    'business',
    'phrasebook',
    'reviews',
    'calculator',
  ];
  const presentCountry = new Set(countryTabs.rows.map((r) => r.tab_key));
  const missingCountry = expectedCountry.filter((k) => !presentCountry.has(k));

  let city: unknown = null;
  if (cityId) {
    const cityTabs = await client.query<{ tab_key: string; lang: string; body_len: string }>(
      "SELECT tab_key, lang, LENGTH(body_markdown)::text as body_len FROM content_blocks WHERE entity_type='city' AND entity_id=$1 AND lang='ru' ORDER BY tab_key",
      [cityId]
    );
    const expectedCity = [
      'overview',
      'districts',
      'accommodation',
      'food',
      'transport',
      'weather',
      'shopping',
      'nightlife',
      'guides',
      'tips',
      'reviews',
      'budget',
    ];
    const presentCity = new Set(cityTabs.rows.map((r) => r.tab_key));
    const missingCity = expectedCity.filter((k) => !presentCity.has(k));
    city = { cityId, rows: cityTabs.rows, missing: missingCity };
  }

  return {
    totalBlocks,
    byType: byType.rows.map((r) => ({ entity_type: r.entity_type, count: Number(r.count) })),
    country: { countryId, rows: countryTabs.rows, missing: missingCountry },
    city,
  };
}

async function main() {
  const args = parseArgs(process.argv);
  const repoRoot = join(process.cwd(), '..', '..');
  maybeLoadEnvLocal(repoRoot);

  const dbUrl = getDatabaseUrl();
  const masked = maskDbUrl(dbUrl);

  const exportDir = join(repoRoot, 'exports', 'neon', args.country);
  const blocksSql = join(exportDir, 'content_blocks.sql');
  if (!existsSync(exportDir)) throw new Error(`Export directory not found: ${exportDir}`);

  const countryIdByFolder: Record<string, string> = {
    vietnam: 'vn',
    thailand: 'th',
    laos: 'la',
    malaysia: 'my',
    indonesia: 'id',
    singapore: 'sg',
    philippines: 'ph',
    cambodia: 'kh',
  };
  const countryId = countryIdByFolder[args.country] ?? args.country;

  // eslint-disable-next-line no-console
  console.log(`Applying Atlas TAB exports: country=${args.country} (country_id=${countryId})`);
  // eslint-disable-next-line no-console
  console.log(`Database: ${masked}`);

  const client = new Client({ connectionString: dbUrl });
  await client.connect();
  try {
    await client.query('BEGIN');
    const deleted = await cleanupCountryListTabBlocks(client, countryId);
    // eslint-disable-next-line no-console
    console.log(`Cleanup: deleted ${deleted} country list-tab blocks (cities/places) for country_id=${countryId}`);
    await applySqlFile(client, blocksSql);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    await client.end();
  }

  const verifyClient = new Client({ connectionString: dbUrl });
  await verifyClient.connect();
  try {
    const v = await verifyDb(verifyClient, countryId, args.city);
    // eslint-disable-next-line no-console
    console.log('DB verification:', JSON.stringify(v, null, 2));
  } finally {
    await verifyClient.end();
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('ERROR:', err instanceof Error ? err.message : err);
  process.exitCode = 1;
});

