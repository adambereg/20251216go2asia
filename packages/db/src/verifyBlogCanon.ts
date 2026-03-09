import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { Client } from 'pg';

function getDatabaseUrl(): string {
  const url = process.env.STAGING_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) throw new Error('Missing STAGING_DATABASE_URL or DATABASE_URL');
  const env = (process.env.ENVIRONMENT ?? 'dev').toLowerCase();
  if (env === 'production') throw new Error('Refusing to run verification with ENVIRONMENT=production');
  return url;
}

function listCanonSlugs(): string[] {
  const repoRoot = resolve(__dirname, '..', '..', '..');
  const canonDir = resolve(repoRoot, 'content', 'blog', '2026');
  return readdirSync(canonDir)
    .filter((name) => name.toLowerCase().endsWith('.md'))
    .map((name) => name.replace(/\.md$/i, ''))
    .sort();
}

async function main() {
  const canonSlugs = listCanonSlugs();
  const url = getDatabaseUrl();
  const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
  await client.connect();

  try {
    const rows = await client.query<{ slug: string }>(`
      SELECT slug
      FROM blog_posts
      ORDER BY slug ASC
    `);

    const dbSlugs = rows.rows.map((row) => row.slug).sort();
    const canonSet = new Set(canonSlugs);
    const dbSet = new Set(dbSlugs);

    const missingInDb = canonSlugs.filter((slug) => !dbSet.has(slug));
    const extraInDb = dbSlugs.filter((slug) => !canonSet.has(slug));

    console.log(`[blog-verify] canon_files=${canonSlugs.length}`);
    console.log(`[blog-verify] blog_posts=${dbSlugs.length}`);
    console.log(`[blog-verify] missing_in_db=${missingInDb.length}`);
    for (const slug of missingInDb) console.log(`[blog-verify] missing: ${slug}`);
    console.log(`[blog-verify] extra_in_db=${extraInDb.length}`);
    for (const slug of extraInDb) console.log(`[blog-verify] extra: ${slug}`);

    if (missingInDb.length > 0 || extraInDb.length > 0) {
      throw new Error('Blog canon verification failed: DB slug list does not match markdown canon');
    }
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('[blog-verify] FATAL', error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
