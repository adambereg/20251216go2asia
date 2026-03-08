/**
 * Import Blog Asia posts from Markdown canon into Neon (blog_* tables).
 *
 * Source:
 * - content/blog/2026/<slug>.md
 *
 * Rules:
 * - Idempotent: UPSERT by blog_posts.slug
 * - Dry-run supported (default)
 * - No runtime existence checks for hero.jpg
 *
 * Usage:
 *   pnpm -C packages/db db:import:blog-md -- --dry-run
 *   pnpm -C packages/db db:import:blog-md -- --apply
 *   pnpm -C packages/db db:import:blog-md -- --apply --only-slug filippiny-dlya-pervogo-raza-marshrut-10-dney
 */

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import { Client } from 'pg';

type ImportMode = 'dry-run' | 'apply';

type BlogPostStatus = 'draft' | 'in_review' | 'scheduled' | 'published' | 'archived';

type BlogMeta = {
  id?: string;
  slug?: string;
  lang?: string;
  status?: string;
  post_type?: string;
  published_at?: string;
  reading_time?: string;
  title?: string;
  subtitle?: string;
  lead?: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  targets?: Array<{ type: string; slug: string }>;
  hero_image_media_key?: string;
  blog_promoted?: string;
  blog_featured?: string;
  blog_editor_pick?: string;
  author_user_id?: string;
  author_display_name?: string;
};

function getDatabaseUrl(): string {
  const url = process.env.STAGING_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) throw new Error('Missing STAGING_DATABASE_URL or DATABASE_URL');
  const env = (process.env.ENVIRONMENT ?? 'dev').toLowerCase();
  if (env === 'production') throw new Error('Refusing to run import with ENVIRONMENT=production');
  return url;
}

function extractFrontmatter(markdown: string): { yaml: string | null; body: string } {
  const lines = markdown.split(/\r?\n/);
  let first = -1;
  let second = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      first = i;
      break;
    }
  }
  if (first === -1) return { yaml: null, body: markdown.trim() };
  for (let i = first + 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      second = i;
      break;
    }
  }
  if (second === -1) return { yaml: null, body: markdown.trim() };
  return {
    yaml: lines.slice(first + 1, second).join('\n'),
    body: lines.slice(second + 1).join('\n').trim(),
  };
}

function stripInlineYamlComment(raw: string): string {
  const v = raw.trim();
  if (!v) return v;
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) return v;
  return v.replace(/\s+#.*$/, '').trim();
}

function unquoteYamlScalar(raw: string): string {
  let v = stripInlineYamlComment(raw);
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
  return v.trim();
}

function parseYamlList(lines: string[], startIdx: number): { items: string[]; endIdx: number } {
  const out: string[] = [];
  let i = startIdx;
  for (; i < lines.length; i++) {
    const l = (lines[i] ?? '').trimEnd();
    if (!l.trim() || l.trim().startsWith('#')) continue;
    // Stop on next top-level key
    if (/^[A-Za-z0-9_]+\s*:/.test(l.trim())) break;
    const m = l.match(/^\s*-\s*(.+?)\s*$/);
    if (m) out.push(unquoteYamlScalar(m[1] ?? ''));
  }
  return { items: out.filter(Boolean), endIdx: i - 1 };
}

function countIndent(line: string): number {
  let n = 0;
  for (const ch of line) {
    if (ch === ' ') n++;
    else break;
  }
  return n;
}

function getNestedYamlScalar(yaml: string, path: string[]): string | null {
  const lines = yaml.split(/\r?\n/).map((l) => l.replace(/\t/g, '  '));
  const stack: Array<{ key: string; indent: number }> = [];

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (line.trim().startsWith('- ')) continue; // list items handled elsewhere

    const indent = countIndent(rawLine);

    // Pop when indentation decreases or stays same (new sibling)
    while (stack.length > 0 && indent <= stack[stack.length - 1]!.indent) stack.pop();

    const m = line.match(/^\s*([A-Za-z0-9_-]+)\s*:\s*(.*)\s*$/);
    if (!m) continue;
    const key = m[1]!;
    const tail = (m[2] ?? '').trim();

    if (!tail) {
      stack.push({ key, indent });
      continue;
    }

    const full = [...stack.map((s) => s.key), key];
    if (full.length === path.length && full.every((k, idx) => k === path[idx])) {
      return unquoteYamlScalar(tail);
    }
  }

  return null;
}

function parseYamlBlogMeta(yaml: string): BlogMeta {
  const out: BlogMeta = {};
  const lines = yaml.split(/\r?\n/).map((l) => l.replace(/\t/g, '  '));

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i] ?? '';
    const line = raw.trimEnd();
    if (!line.trim() || line.trim().startsWith('#')) continue;

    const m = line.match(/^\s*([A-Za-z0-9_-]+)\s*:\s*(.*)\s*$/);
    if (!m) continue;
    const key = m[1]!;
    const tail = (m[2] ?? '').trim();

    // tags:
    if (key === 'tags' && !tail) {
      const parsed = parseYamlList(lines, i + 1);
      out.tags = parsed.items;
      i = parsed.endIdx;
      continue;
    }

    // targets: - type: ... \n   slug: ...
    if (key === 'targets' && !tail) {
      const targets: Array<{ type: string; slug: string }> = [];
      let curType: string | null = null;
      let curSlug: string | null = null;

      for (let j = i + 1; j < lines.length; j++) {
        const raw2 = (lines[j] ?? '').trimEnd();
        const t = raw2.trim();
        if (!t || t.startsWith('#')) continue;
        if (/^[A-Za-z0-9_-]+\s*:/.test(t)) {
          i = j - 1;
          break;
        }

        const item = t.match(/^\-\s*type\s*:\s*(.+?)\s*$/);
        if (item) {
          if (curType && curSlug) targets.push({ type: curType, slug: curSlug });
          curType = unquoteYamlScalar(item[1] ?? '') || null;
          curSlug = null;
          continue;
        }

        const slugLine = t.match(/^slug\s*:\s*(.+?)\s*$/);
        if (slugLine && curType) {
          curSlug = unquoteYamlScalar(slugLine[1] ?? '') || null;
          continue;
        }
      }

      if (curType && curSlug) targets.push({ type: curType, slug: curSlug });
      out.targets = targets;
      continue;
    }

    const val = unquoteYamlScalar(tail);
    (out as any)[key] = val;
  }

  // Nested keys we care about
  out.hero_image_media_key = getNestedYamlScalar(yaml, ['hero', 'image', 'media_key']) ?? undefined;
  out.blog_promoted = getNestedYamlScalar(yaml, ['blog', 'promoted']) ?? undefined;
  out.blog_featured = getNestedYamlScalar(yaml, ['blog', 'featured']) ?? undefined;
  out.blog_editor_pick = getNestedYamlScalar(yaml, ['blog', 'editor_pick']) ?? undefined;
  out.author_user_id = getNestedYamlScalar(yaml, ['author', 'user_id']) ?? undefined;
  out.author_display_name = getNestedYamlScalar(yaml, ['author', 'display_name']) ?? undefined;

  return out;
}

function parseArgs(argv: string[]): { mode: ImportMode; onlySlug?: string } {
  const mode: ImportMode = argv.includes('--apply') ? 'apply' : 'dry-run';
  const onlySlugIdx = argv.findIndex((a) => a === '--only-slug');
  const onlySlug = onlySlugIdx >= 0 ? argv[onlySlugIdx + 1] : undefined;
  return { mode, onlySlug };
}

function parseBool(raw: string | undefined): boolean | null {
  const v = (raw ?? '').trim().toLowerCase();
  if (v === 'true' || v === '1' || v === 'yes') return true;
  if (v === 'false' || v === '0' || v === 'no') return false;
  return null;
}

function asStatus(raw: string | undefined): BlogPostStatus {
  const v = (raw ?? '').trim().toLowerCase();
  const ok: BlogPostStatus[] = ['draft', 'in_review', 'scheduled', 'published', 'archived'];
  return (ok.includes(v as BlogPostStatus) ? (v as BlogPostStatus) : 'published');
}

function parseDateToIso(raw: string | undefined): string | null {
  const v = (raw ?? '').trim();
  if (!v) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return `${v}T00:00:00.000Z`;
  const d = new Date(v);
  return Number.isFinite(d.getTime()) ? d.toISOString() : null;
}

function markdownToPlainText(md: string): string {
  let s = md ?? '';
  s = s.replace(/<!--[\s\S]*?-->/g, ' ');
  s = s.replace(/```[\s\S]*?```/g, ' ');
  s = s.replace(/`([^`]+)`/g, '$1');
  s = s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  s = s.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1');
  s = s.replace(/[#>*_~=-]+/g, ' ');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

function computeExcerpt(meta: BlogMeta, body: string): string | null {
  const fromMeta = (meta.excerpt ?? meta.lead ?? '').trim();
  if (fromMeta.length > 0) return fromMeta;
  const text = markdownToPlainText(body);
  if (!text) return null;
  const max = 220;
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const safe = cut.replace(/\s+\S*$/, '').trim();
  return safe.length >= 120 ? safe : cut.trim();
}

function stableId(prefix: string, input: string): string {
  const h = createHash('sha256').update(`${prefix}:${input}`).digest('hex');
  return `${prefix}_${h.slice(0, 24)}`;
}

function slugifyTag(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

function computeReadingTimeMinutes(meta: BlogMeta, body: string): number | null {
  const raw = (meta.reading_time ?? '').trim();
  const direct = raw ? Number.parseInt(raw, 10) : NaN;
  if (Number.isFinite(direct) && direct > 0) return Math.min(180, Math.max(1, direct));
  const text = markdownToPlainText(body);
  if (!text) return null;
  const words = text.split(/\s+/).filter(Boolean).length;
  const wpm = 220;
  return Math.min(180, Math.max(1, Math.round(words / wpm)));
}

function getMediaBaseUrl(): string {
  const base = (process.env.MEDIA_PUBLIC_BASE_URL ?? 'https://media.go2asia.space').trim();
  return base.endsWith('/') ? base.slice(0, -1) : base;
}

function buildPublicUrl(key: string): string {
  return `${getMediaBaseUrl()}/${key}`;
}

function guessMimeTypeFromKey(key: string): string {
  if (key.toLowerCase().endsWith('.png')) return 'image/png';
  if (key.toLowerCase().endsWith('.webp')) return 'image/webp';
  return 'image/jpeg';
}

function listMarkdownFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.toLowerCase().endsWith('.md'))
    .map((name) => join(dir, name))
    .sort();
}

async function main() {
  const { mode, onlySlug } = parseArgs(process.argv.slice(2));
  // eslint-disable-next-line no-console
  console.log(`🔁 Blog import: mode=${mode}${onlySlug ? ` onlySlug=${onlySlug}` : ''}`);

  const repoRoot = resolve(__dirname, '..', '..', '..');
  const canonDir = resolve(repoRoot, 'content', 'blog', '2026');
  const files = listMarkdownFiles(canonDir).filter((p) => (onlySlug ? p.endsWith(`${onlySlug}.md`) : true));

  if (files.length === 0) throw new Error(`No blog markdown files found under: ${canonDir}`);

  const url = getDatabaseUrl();
  const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
  await client.connect();

  let created = 0;
  let updated = 0;
  let errors = 0;

  const errorList: Array<{ file: string; slug?: string; error: string }> = [];

  try {
    for (const filePath of files) {
      const rel = relative(repoRoot, filePath).replace(/\\/g, '/');
      const fileSlug = filePath.split(/[\\/]/).pop()?.replace(/\.md$/i, '') ?? '';
      const raw = readFileSync(filePath, 'utf8');
      const { yaml, body } = extractFrontmatter(raw);
      const meta = yaml ? parseYamlBlogMeta(yaml) : {};

      const frontmatterSlug = (meta.slug ?? '').trim();
      const slug = fileSlug.trim();
      const title = (meta.title ?? '').trim();
      const status = asStatus(meta.status);
      const lang = (meta.lang ?? 'ru').trim() || 'ru';
      const postType = (meta.post_type ?? '').trim() || null;
      const category = (meta.category ?? '').trim() || null;
      const subtitle = (meta.subtitle ?? '').trim() || null;
      const excerpt = computeExcerpt(meta, body);
      const readingTimeMinutes = computeReadingTimeMinutes(meta, body);
      const targets = Array.isArray(meta.targets) ? meta.targets : [];
      const countrySlug =
        targets.find((t) => t.type === 'country')?.slug?.trim() ||
        targets.find((t) => t.type === 'country' || t.type === 'country_id')?.slug?.trim() ||
        null;
      const citySlug =
        targets.find((t) => t.type === 'city')?.slug?.trim() ||
        targets.find((t) => t.type === 'city' || t.type === 'city_id')?.slug?.trim() ||
        null;

      const publishedAtIso = parseDateToIso(meta.published_at);
      const publishedAt =
        status === 'published'
          ? (publishedAtIso ?? new Date().toISOString())
          : (publishedAtIso ?? null);

      if (frontmatterSlug && frontmatterSlug !== slug) {
        // eslint-disable-next-line no-console
        console.warn(
          `[md-import:blog] WARN slug mismatch; using file slug. file=${rel} frontmatter=${frontmatterSlug} fileSlug=${slug}`
        );
      }

      const canonHeroKey = `blog/2026/${slug}/hero.jpg`;
      const fmHeroKey = (meta.hero_image_media_key ?? '').trim();
      if (fmHeroKey && fmHeroKey !== canonHeroKey) {
        // eslint-disable-next-line no-console
        console.warn(
          `[md-import:blog] WARN hero media_key mismatch; using canon. slug=${slug} frontmatter=${fmHeroKey} canon=${canonHeroKey}`
        );
      }
      const heroKey = canonHeroKey;

      const promoted = parseBool(meta.blog_promoted) ?? false;
      const featured = parseBool(meta.blog_featured) ?? false;
      const editorPick = parseBool(meta.blog_editor_pick) ?? false;

      const authorName = (meta.author_display_name ?? '').trim() || 'Редакция Go2Asia';
      const authorSlug = slugifyTag(authorName) || 'go2asia';
      const authorUserId = (meta.author_user_id ?? '').trim() || null;

      // Validation
      const problems: string[] = [];
      if (!slug) problems.push('missing slug');
      if (!title || title.length < 6) problems.push('missing/short title');
      if (!body || body.length < 50) problems.push('missing/short body');
      if (!excerpt || excerpt.length < 30) problems.push('missing/short excerpt/lead');
      if (!heroKey) problems.push('missing hero media key');
      if (problems.length > 0) {
        errors++;
        errorList.push({ file: rel, slug: slug || fileSlug, error: problems.join(', ') });
        // eslint-disable-next-line no-console
        console.warn(`[md-import:blog] SKIP invalid: ${rel} (${problems.join(', ')})`);
        continue;
      }

      if (mode === 'dry-run') {
        // eslint-disable-next-line no-console
        console.log(
          `[md-import:blog] DRY ${slug} status=${status} published_at=${publishedAt ?? 'null'} hero=${heroKey}`
        );
        continue;
      }

      // Apply per-file transaction (post + media + tags)
      await client.query('BEGIN');
      try {
        // Upsert media_files for hero
        const provider = 'r2';
        const bucket = 'go2asia-media';
        const mfId = `mf_${createHash('sha256').update(`${provider}|${bucket}|${heroKey}`).digest('hex')}`;
        const publicUrl = buildPublicUrl(heroKey);
        const mimeType = guessMimeTypeFromKey(heroKey);

        await client.query(
          `
          INSERT INTO media_files (id, provider, bucket, key, public_url, mime_type, size, width, height, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, 0, NULL, NULL, now())
          ON CONFLICT (provider, bucket, key) DO UPDATE SET
            public_url = EXCLUDED.public_url,
            mime_type = EXCLUDED.mime_type
          `,
          [mfId, provider, bucket, heroKey, publicUrl, mimeType]
        );

        // Upsert author (by slug)
        const authorId = `blog_author_${authorSlug}`;
        await client.query(
          `
          INSERT INTO blog_authors (id, slug, display_name, bio, user_id, avatar_media_id, created_at, updated_at)
          VALUES ($1, $2, $3, NULL, $4, NULL, now(), now())
          ON CONFLICT (slug) DO UPDATE SET
            display_name = EXCLUDED.display_name,
            user_id = COALESCE(EXCLUDED.user_id, blog_authors.user_id),
            updated_at = now()
          `,
          [authorId, authorSlug, authorName, authorUserId]
        );

        // Upsert post (by slug)
        const postId = `blog_${slug}`;
        const upsertRes = await client.query<{ inserted: boolean }>(
          `
          INSERT INTO blog_posts (
            id, slug, lang, title, subtitle, excerpt, content_markdown,
            post_type, category, status, published_at,
            country_slug, city_slug,
            author_id, hero_media_id, reading_time_minutes,
            is_promoted, is_featured, is_editor_pick,
            created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7,
            $8, $9, $10::blog_post_status, $11::timestamptz,
            $12, $13,
            $14, $15, $16,
            $17, $18, $19,
            now(), now()
          )
          ON CONFLICT (slug) DO UPDATE SET
            lang = EXCLUDED.lang,
            title = EXCLUDED.title,
            subtitle = EXCLUDED.subtitle,
            excerpt = EXCLUDED.excerpt,
            content_markdown = EXCLUDED.content_markdown,
            post_type = EXCLUDED.post_type,
            category = EXCLUDED.category,
            country_slug = EXCLUDED.country_slug,
            city_slug = EXCLUDED.city_slug,
            status = EXCLUDED.status,
            published_at = COALESCE(EXCLUDED.published_at, blog_posts.published_at),
            author_id = EXCLUDED.author_id,
            hero_media_id = EXCLUDED.hero_media_id,
            reading_time_minutes = EXCLUDED.reading_time_minutes,
            is_promoted = EXCLUDED.is_promoted,
            is_featured = EXCLUDED.is_featured,
            is_editor_pick = EXCLUDED.is_editor_pick,
            updated_at = now()
          RETURNING (xmax = 0) AS inserted
          `,
          [
            postId,
            slug,
            lang,
            title,
            subtitle,
            excerpt,
            body,
            postType,
            category,
            status,
            publishedAt,
            countrySlug,
            citySlug,
            authorId,
            mfId,
            readingTimeMinutes,
            promoted,
            featured,
            editorPick,
          ]
        );

        const inserted = Boolean(upsertRes.rows[0]?.inserted);
        if (inserted) created++;
        else updated++;

        // Tags: upsert + sync m2m
        const rawTags = Array.isArray(meta.tags) ? meta.tags : [];
        const tags = rawTags
          .map((t) => (t ?? '').trim())
          .filter(Boolean)
          .slice(0, 50);

        await client.query(`DELETE FROM blog_post_tags WHERE post_id = $1`, [postId]);

        for (const tagName of tags) {
          const tagSlug = slugifyTag(tagName);
          if (!tagSlug) continue;
          const tagId = stableId('tag', tagSlug);
          await client.query(
            `
            INSERT INTO blog_tags (id, slug, name, created_at, updated_at)
            VALUES ($1, $2, $3, now(), now())
            ON CONFLICT (slug) DO UPDATE SET
              name = EXCLUDED.name,
              updated_at = now()
            `,
            [tagId, tagSlug, tagName]
          );
          await client.query(
            `
            INSERT INTO blog_post_tags (post_id, tag_id, created_at)
            VALUES ($1, $2, now())
            ON CONFLICT DO NOTHING
            `,
            [postId, tagId]
          );
        }

        await client.query('COMMIT');
        // eslint-disable-next-line no-console
        console.log(`[md-import:blog] OK ${slug} (${inserted ? 'created' : 'updated'})`);
      } catch (e) {
        await client.query('ROLLBACK');
        errors++;
        errorList.push({ file: rel, slug, error: e instanceof Error ? e.message : String(e) });
        // eslint-disable-next-line no-console
        console.error(`[md-import:blog] FAIL ${slug}:`, e instanceof Error ? e.message : String(e));
      }
    }
  } finally {
    await client.end();
  }

  // eslint-disable-next-line no-console
  console.log(`[md-import:blog] DONE created=${created} updated=${updated} errors=${errors}`);
  if (errorList.length > 0) {
    // eslint-disable-next-line no-console
    console.log('[md-import:blog] Errors (first 30):');
    // eslint-disable-next-line no-console
    for (const it of errorList.slice(0, 30)) console.log(`- ${it.file} slug=${it.slug ?? '?'} err=${it.error}`);
  }
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error('[md-import:blog] FATAL', e instanceof Error ? e.message : String(e));
  process.exitCode = 1;
});

