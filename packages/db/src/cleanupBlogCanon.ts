import { Client } from 'pg';

function getDatabaseUrl(): string {
  const url = process.env.STAGING_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) throw new Error('Missing STAGING_DATABASE_URL or DATABASE_URL');
  const env = (process.env.ENVIRONMENT ?? 'dev').toLowerCase();
  if (env === 'production') throw new Error('Refusing to run cleanup with ENVIRONMENT=production');
  return url;
}

async function main() {
  const url = getDatabaseUrl();
  const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
  await client.connect();

  try {
    await client.query('BEGIN');

    const before = await client.query<{
      blog_posts: string;
      blog_authors: string;
      blog_tags: string;
      blog_post_tags: string;
      blog_media: string;
    }>(`
      SELECT
        (SELECT COUNT(*)::text FROM blog_posts) AS blog_posts,
        (SELECT COUNT(*)::text FROM blog_authors) AS blog_authors,
        (SELECT COUNT(*)::text FROM blog_tags) AS blog_tags,
        (SELECT COUNT(*)::text FROM blog_post_tags) AS blog_post_tags,
        (SELECT COUNT(*)::text FROM media_files WHERE key LIKE 'blog/2026/%') AS blog_media
    `);

    console.log('[blog-cleanup] before=', before.rows[0]);

    await client.query(`DELETE FROM blog_post_tags`);
    await client.query(`DELETE FROM blog_posts`);
    await client.query(`DELETE FROM blog_tags`);
    await client.query(`DELETE FROM blog_authors`);
    await client.query(`DELETE FROM media_files WHERE key LIKE 'blog/2026/%'`);

    const after = await client.query<{
      blog_posts: string;
      blog_authors: string;
      blog_tags: string;
      blog_post_tags: string;
      blog_media: string;
    }>(`
      SELECT
        (SELECT COUNT(*)::text FROM blog_posts) AS blog_posts,
        (SELECT COUNT(*)::text FROM blog_authors) AS blog_authors,
        (SELECT COUNT(*)::text FROM blog_tags) AS blog_tags,
        (SELECT COUNT(*)::text FROM blog_post_tags) AS blog_post_tags,
        (SELECT COUNT(*)::text FROM media_files WHERE key LIKE 'blog/2026/%') AS blog_media
    `);

    console.log('[blog-cleanup] after=', after.rows[0]);

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('[blog-cleanup] FATAL', error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
