/**
 * Apply Atlas exports/neon/<country>/*.sql into Neon Postgres.
 *
 * Goals:
 * - No psql dependency (works on Windows)
 * - Load DATABASE_URL / STAGING_DATABASE_URL from env or repo root `.env.local`
 * - Apply SQL in order: places.sql -> content_blocks.sql (and optionally content_blocks.csv is ignored)
 * - Provide minimal verification queries (DB + optional API smoke)
 *
 * Usage:
 *   pnpm -C packages/db tsx src/applyAtlasExportsToNeon.ts laos
 *   pnpm -C packages/db tsx src/applyAtlasExportsToNeon.ts laos --slug vte-pha-that-luang
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { Client } from 'pg';

type Args = {
  country: string;
  slug?: string;
};

function parseArgs(argv: string[]): Args {
  const country = (argv[2] ?? '').trim();
  if (!country) {
    throw new Error('Missing <country> argument. Example: laos');
  }
  const slugIdx = argv.indexOf('--slug');
  const slug = slugIdx !== -1 ? (argv[slugIdx + 1] ?? '').trim() : undefined;
  return { country: country.toLowerCase(), slug: slug?.toLowerCase() };
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
    // Strip optional quotes
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

async function verifyDb(client: Client, countryId: string, slug?: string) {
  const res = await client.query<{ count: string }>('SELECT COUNT(*)::text as count FROM places WHERE country_id = $1', [countryId]);
  const totalPlaces = Number(res.rows[0]?.count ?? 0);

  const cb = await client.query<{ count: string }>(
    "SELECT COUNT(*)::text as count FROM content_blocks WHERE entity_type='place' AND tab_key='overview' AND lang='ru' AND entity_id IN (SELECT id FROM places WHERE country_id=$1)",
    [countryId],
  );
  const totalBlocks = Number(cb.rows[0]?.count ?? 0);

  if (slug) {
    const place = await client.query<{ id: string; name: string; updated_at: string | null }>(
      'SELECT id, name, updated_at::text as updated_at FROM places WHERE id = $1 LIMIT 1',
      [slug],
    );
    const hasPlace = place.rowCount === 1;

    const tab = await client.query<{ body_markdown: string }>(
      "SELECT body_markdown FROM content_blocks WHERE entity_type='place' AND entity_id=$1 AND tab_key='overview' AND lang='ru' LIMIT 1",
      [slug],
    );
    const hasOverview = tab.rowCount === 1;
    const hasRawServiceHeader = (tab.rows[0]?.body_markdown ?? '').includes('## 🔷 Коммуникация и сервис');

    return {
      totalPlaces,
      totalBlocks,
      slug: {
        hasPlace,
        placeName: place.rows[0]?.name ?? null,
        updatedAt: place.rows[0]?.updated_at ?? null,
        hasOverview,
        hasRawServiceHeader,
      },
    };
  }

  return { totalPlaces, totalBlocks };
}

async function main() {
  const args = parseArgs(process.argv);
  const repoRoot = join(process.cwd(), '..', '..');
  maybeLoadEnvLocal(repoRoot);

  const dbUrl = getDatabaseUrl();
  const masked = maskDbUrl(dbUrl);

  const exportDir = join(repoRoot, 'exports', 'neon', args.country);
  const placesSql = join(exportDir, 'places.sql');
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
  console.log(`Applying Atlas exports: country=${args.country} (country_id=${countryId}) slug=${args.slug ?? '(all)'}`);
  // eslint-disable-next-line no-console
  console.log(`Database: ${masked}`);

  const client = new Client({ connectionString: dbUrl });
  await client.connect();
  try {
    await client.query('BEGIN');
    await applySqlFile(client, placesSql);
    await applySqlFile(client, blocksSql);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    await client.end();
  }

  // Reconnect for verification (keeps it simple & avoids "ended client" mistakes)
  const verifyClient = new Client({ connectionString: dbUrl });
  await verifyClient.connect();
  try {
    const v = await verifyDb(verifyClient, countryId, args.slug);
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

