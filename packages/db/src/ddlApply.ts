/**
 * Node-only DDL applicator (SSOT = SQL migrations).
 *
 * Motivation:
 * - We do NOT rely on drizzle-kit for applying DDL in staging/prod.
 * - SSOT for schema is packages/db/migrations/*.sql committed in repo.
 * - This script applies those SQL files sequentially and stores state in
 *   a simple `schema_migrations` table.
 *
 * Safety:
 * - Refuses to run on production unless DDL_ALLOW_PROD=1.
 * - Never logs DATABASE_URL or secrets.
 * - Each migration runs in its own transaction for granularity.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { Client } from 'pg';

type Env = 'dev' | 'staging' | 'production';

function getEnv(): Env {
  const v = (process.env.ENVIRONMENT ?? 'dev').toLowerCase();
  if (v === 'staging') return 'staging';
  if (v === 'production') return 'production';
  return 'dev';
}

function getDatabaseUrl(): string {
  const url = process.env.STAGING_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) throw new Error('Missing STAGING_DATABASE_URL or DATABASE_URL');
  return url;
}

function sha256(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}

function migrationsDir(): string {
  // packages/db/src/ddlApply.ts -> packages/db/migrations
  return path.resolve(__dirname, '..', 'migrations');
}

function listMigrationFiles(dir: string): string[] {
  const files = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith('.sql'))
    .map((d) => d.name)
    .sort();
  if (files.length === 0) {
    throw new Error(`No .sql migrations found in: ${dir}`);
  }
  return files;
}

function splitStatements(sql: string): string[] {
  // Drizzle migrations are split with this marker; keep it simple and safe.
  // Anything between markers is executed as-is.
  const parts = sql
    .split('--> statement-breakpoint')
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [sql.trim()].filter(Boolean);
}

function truncateForLog(text: string, maxLen = 300): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen) + '...';
}

async function ensureMigrationsTable(client: Client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id bigserial PRIMARY KEY,
      filename text NOT NULL UNIQUE,
      checksum text NOT NULL,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `);
}

async function getApplied(client: Client): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  // Table might not exist yet on first run - handle gracefully
  try {
    const res = await client.query<{ filename: string; checksum: string }>(
      `SELECT filename, checksum FROM schema_migrations ORDER BY filename`
    );
    for (const row of res.rows) map.set(row.filename, row.checksum);
  } catch {
    // Table doesn't exist yet - return empty map
  }
  return map;
}

/**
 * Apply all statements from a single migration file within one transaction.
 * Logs the failing statement on error for easier debugging.
 */
async function applyMigration(
  client: Client,
  filename: string,
  contents: string,
  checksum: string
): Promise<void> {
  const statements = splitStatements(contents);

  await client.query('BEGIN');
  try {
    // Ensure migrations table exists (idempotent)
    await ensureMigrationsTable(client);

    let stmtIndex = 0;
    for (const stmt of statements) {
      // Skip empty fragments defensively
      if (!stmt.trim()) continue;
      stmtIndex++;
      try {
        await client.query(stmt);
      } catch (e) {
        // Log the failing statement for debugging
        // eslint-disable-next-line no-console
        console.error(`\n💥 Statement ${stmtIndex}/${statements.length} in ${filename} failed:`);
        // eslint-disable-next-line no-console
        console.error(`   ${truncateForLog(stmt)}`);
        throw e;
      }
    }

    // Record successful migration
    await client.query(`INSERT INTO schema_migrations (filename, checksum) VALUES ($1, $2)`, [
      filename,
      checksum,
    ]);

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  }
}

async function main() {
  const env = getEnv();
  if (env === 'production' && process.env.DDL_ALLOW_PROD !== '1') {
    throw new Error('Refusing to apply DDL to production. Set DDL_ALLOW_PROD=1 to override.');
  }

  const url = getDatabaseUrl();
  const u = new URL(url);

  // eslint-disable-next-line no-console
  console.log(`🔧 Applying DDL migrations (env=${env}) to host=${u.host}, db=${u.pathname}`);

  const dir = migrationsDir();
  const files = listMigrationFiles(dir);

  const client = new Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  try {
    // Get already applied migrations (outside any tx to read latest state)
    const applied = await getApplied(client);

    for (const f of files) {
      const full = path.join(dir, f);
      const contents = fs.readFileSync(full, 'utf8');
      const checksum = sha256(contents);

      const prev = applied.get(f);
      if (prev) {
        if (prev !== checksum) {
          throw new Error(`Checksum mismatch for already-applied migration: ${f}`);
        }
        // eslint-disable-next-line no-console
        console.log(`- skip ${f} (already applied)`);
        continue;
      }

      // eslint-disable-next-line no-console
      console.log(`- apply ${f}`);
      await applyMigration(client, f, contents, checksum);
      // Update local map so subsequent checks work correctly
      applied.set(f, checksum);
    }
  } finally {
    await client.end();
  }

  // eslint-disable-next-line no-console
  console.log('✅ DDL apply complete.');
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('❌ DDL apply failed:', err instanceof Error ? err.message : String(err));
  process.exit(1);
});
