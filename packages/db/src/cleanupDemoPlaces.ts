/**
 * Cleanup demo/test places from Neon database.
 *
 * Rules:
 * - Safe: only removes places matching specific demo patterns
 * - NEVER deletes country_id='ph' (Philippines anchor country)
 * - For generic patterns (Test/Demo/Sample): country_id != 'ph'
 * - Idempotent: can be run multiple times
 * - Logs all deletions and target DB info
 * - Refuses to run in production
 */

import { sql } from 'drizzle-orm';
import { createDb } from './client';

function getDatabaseUrl(): string {
  const url = process.env.STAGING_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) {
    throw new Error('Missing STAGING_DATABASE_URL or DATABASE_URL');
  }
  const env = (process.env.ENVIRONMENT ?? 'dev').toLowerCase();
  if (env === 'production') {
    throw new Error('Refusing to run cleanup with ENVIRONMENT=production');
  }
  return url;
}

function safeDbInfoFromUrl(databaseUrl: string): { host: string; db: string } {
  try {
    const u = new URL(databaseUrl);
    const db = u.pathname?.replace(/^\//, '') || '';
    return { host: u.host, db };
  } catch {
    return { host: 'unknown', db: 'unknown' };
  }
}

/**
 * Demo place patterns to remove (safe patterns only).
 * These are known demo/test entries that should not be in production.
 * 
 * CRITICAL: Never delete country_id='ph' (Philippines anchor country).
 */
const DEMO_PATTERNS = [
  // Thailand demo places (safe sweep): remove "* Place *" only within TH.
  // Covers Bangkok/Chiang Mai/Phuket demo places generated from UI mocks.
  // NOTE: Intentionally scoped to country_id='th' to avoid accidental deletions in other countries.
  { pattern: "% Place %", country: 'th', excludeCountry: 'ph' },
  // Bangkok demo places (TH only) - kept for explicitness / historical patterns
  { pattern: "Bangkok Place%", country: 'th', excludeCountry: 'ph' },
  { pattern: "Bangkok Test%", country: 'th', excludeCountry: 'ph' },
  // Chiang Mai demo places (TH only) - kept for explicitness / historical patterns
  { pattern: "Chiang Mai Place%", country: 'th', excludeCountry: 'ph' },
  { pattern: "Chiang Mai Test%", country: 'th', excludeCountry: 'ph' },
  // Phuket demo places (TH only) - explicit
  { pattern: "Phuket Place%", country: 'th', excludeCountry: 'ph' },
  // Generic test patterns (exclude PH)
  { pattern: "Test Place%", country: null, excludeCountry: 'ph' },
  { pattern: "Demo Place%", country: null, excludeCountry: 'ph' },
  { pattern: "Sample Place%", country: null, excludeCountry: 'ph' },
];

async function main() {
  const dbUrl = getDatabaseUrl();
  const db = createDb(dbUrl);
  const dbInfo = safeDbInfoFromUrl(dbUrl);
  
  // eslint-disable-next-line no-console
  console.log('Starting cleanup of demo places...');
  // eslint-disable-next-line no-console
  console.log(`Target database: ${dbInfo.host} / ${dbInfo.db}`);

  let totalDeleted = 0;

  for (const { pattern, country, excludeCountry } of DEMO_PATTERNS) {
    // Build query to find candidates
    let query = sql`
      SELECT p.id, p.slug, p.name, p.country_id, c.name AS country_name
      FROM places p
      LEFT JOIN countries c ON p.country_id = c.id
      WHERE p.name ILIKE ${pattern}
    `;

    // Add country filter if specified
    if (country) {
      query = sql`
        SELECT p.id, p.slug, p.name, p.country_id, c.name AS country_name
        FROM places p
        JOIN countries c ON p.country_id = c.id
        WHERE p.name ILIKE ${pattern}
          AND (c.id = ${country} OR c.slug = ${country})
      `;
    }

    // Always exclude PH (anchor country)
    if (excludeCountry) {
      query = sql`
        SELECT p.id, p.slug, p.name, p.country_id, c.name AS country_name
        FROM places p
        LEFT JOIN countries c ON p.country_id = c.id
        WHERE p.name ILIKE ${pattern}
          AND (p.country_id != ${excludeCountry} AND (c.id IS NULL OR c.id != ${excludeCountry}))
      `;
      
      if (country) {
        query = sql`
          SELECT p.id, p.slug, p.name, p.country_id, c.name AS country_name
          FROM places p
          JOIN countries c ON p.country_id = c.id
          WHERE p.name ILIKE ${pattern}
            AND (c.id = ${country} OR c.slug = ${country})
            AND c.id != ${excludeCountry}
        `;
      }
    }

    const candidates = await db.execute(query);
    const rows = (candidates as { rows?: Array<{ id?: string; slug?: string; name?: string; country_id?: string; country_name?: string }> })?.rows ?? [];

    if (rows.length === 0) {
      // eslint-disable-next-line no-console
      console.log(`  Pattern "${pattern}" (country: ${country ?? 'any'}, exclude: ${excludeCountry ?? 'none'}): no matches`);
      continue;
    }

    // eslint-disable-next-line no-console
    console.log(`  Pattern "${pattern}" (country: ${country ?? 'any'}, exclude: ${excludeCountry ?? 'none'}): found ${rows.length} place(s)`);
    for (const row of rows) {
      // eslint-disable-next-line no-console
      console.log(`    - ${row.name} (${row.slug}, id: ${row.id}, country: ${row.country_id}/${row.country_name})`);
      
      // Safety check: never delete PH places
      if (row.country_id === 'ph') {
        // eslint-disable-next-line no-console
        console.warn(`      ⚠️ SKIPPED: country_id='ph' (anchor country protection)`);
        continue;
      }
    }

    // Build delete query
    let deleteQuery = sql`
      DELETE FROM places
      WHERE name ILIKE ${pattern}
        AND country_id != 'ph'
    `;

    if (country) {
      deleteQuery = sql`
        DELETE FROM places
        WHERE name ILIKE ${pattern}
          AND country_id IN (SELECT id FROM countries WHERE (id = ${country} OR slug = ${country}) AND id != 'ph')
      `;
    } else if (excludeCountry) {
      deleteQuery = sql`
        DELETE FROM places
        WHERE name ILIKE ${pattern}
          AND country_id != ${excludeCountry}
      `;
    }

    const result = await db.execute(deleteQuery);
    const deleted = (result as { rowCount?: number })?.rowCount ?? 0;
    totalDeleted += deleted;

    // eslint-disable-next-line no-console
    console.log(`    Deleted ${deleted} place(s)`);
  }

  // eslint-disable-next-line no-console
  console.log(`\nCleanup completed: deleted ${totalDeleted} demo place(s) total`);
  
  if (totalDeleted === 0) {
    // eslint-disable-next-line no-console
    console.log('No demo places found to clean up.');
  }
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Cleanup failed:', error);
  process.exit(1);
});
