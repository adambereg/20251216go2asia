/**
 * Import Pulse events from Markdown canon into Neon (events table).
 *
 * Source:
 * - content/pulse/<country>/<year>/<slug>.md
 *
 * Rules (MVP):
 * - Idempotent: UPSERT by events.id (from frontmatter).
 * - SSOT for Pulse media is R2 keys: store hero_media_key (optional) + gallery_media_keys (default 01..03).
 * - No runtime existence checks for hero.jpg / gallery files.
 *
 * Usage:
 *   pnpm -C packages/db db:import:pulse-md -- --dry-run
 *   pnpm -C packages/db db:import:pulse-md -- --apply
 *   pnpm -C packages/db db:import:pulse-md -- --apply --only-slug songkran-festival
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import { Client } from 'pg';

type ImportMode = 'dry-run' | 'apply';

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
  if (first === -1) return { yaml: null, body: markdown };
  for (let i = first + 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      second = i;
      break;
    }
  }
  if (second === -1) return { yaml: null, body: markdown };
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

type PulseMeta = {
  id?: string;
  title?: string;
  country?: string;
  city?: string;
  year?: string;
  primary_type?: string;
  secondary_type?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  geo_scope?: string;
  official_url?: string;
  seo_title?: string;
  seo_description?: string;
  coordinates_lat?: string;
  coordinates_lng?: string;
};

function parseYamlPulseMeta(yaml: string): PulseMeta {
  const out: PulseMeta = {};
  const lines = yaml.split(/\r?\n/).map((l) => l.replace(/\t/g, '  '));

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i] ?? '';
    const line = raw.trimEnd();
    if (!line.trim() || line.trim().startsWith('#')) continue;

    const m = line.match(/^([A-Za-z0-9_]+)\s*:\s*(.*)\s*$/);
    if (!m) continue;
    const key = m[1]!;
    const tail = (m[2] ?? '').trim();

    // coordinates:
    if (key === 'coordinates' && !tail) {
      for (let j = i + 1; j < lines.length; j++) {
        const l = (lines[j] ?? '').trimEnd();
        if (!l.trim() || l.trim().startsWith('#')) continue;
        if (/^[A-Za-z0-9_]+\s*:/.test(l.trim())) {
          i = j - 1;
          break;
        }
        const mm = l.match(/^\s*([A-Za-z0-9_]+)\s*:\s*(.+?)\s*$/);
        if (!mm) continue;
        const k = mm[1]!;
        const v = unquoteYamlScalar(mm[2] ?? '');
        if (k === 'lat') out.coordinates_lat = v;
        if (k === 'lng') out.coordinates_lng = v;
      }
      continue;
    }

    const val = unquoteYamlScalar(tail);
    (out as any)[key] = val;
  }

  return out;
}

function titleCaseFromSlug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function buildDefaultGalleryKeys(countrySlug: string, year: number, slug: string): string[] {
  const base = `events/${countrySlug}/${year}/${slug}`;
  return ['01.jpg', '02.jpg', '03.jpg'].map((f) => `${base}/${f}`);
}

function buildMediaPrefix(countrySlug: string, year: number, slug: string): string {
  return `events/${countrySlug}/${year}/${slug}`;
}

function extractShortDescription(bodyMarkdown: string): string | null {
  const lines = bodyMarkdown.split(/\r?\n/).map((l) => l.trim());
  const candidates = lines.filter((l) => l && !l.startsWith('#') && !l.startsWith('>') && !l.startsWith('---'));
  const first = candidates[0];
  if (!first) return null;
  // Very lightweight markdown cleanup for cards
  return first
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\[(.+?)\]\((.+?)\)/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .trim()
    .slice(0, 320);
}

function parseArgs(argv: string[]): { mode: ImportMode; onlySlug?: string } {
  const mode: ImportMode = argv.includes('--apply') ? 'apply' : 'dry-run';
  const onlySlugIdx = argv.findIndex((a) => a === '--only-slug');
  const onlySlug = onlySlugIdx >= 0 ? argv[onlySlugIdx + 1] : undefined;
  return { mode, onlySlug };
}

function listMarkdownFiles(root: string): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    const entries = readdirSync(dir);
    for (const name of entries) {
      const full = join(dir, name);
      const st = statSync(full);
      if (st.isDirectory()) walk(full);
      else if (st.isFile() && name.endsWith('.md')) out.push(full);
    }
  };
  walk(root);
  return out.sort();
}

async function main() {
  const { mode, onlySlug } = parseArgs(process.argv.slice(2));
  // eslint-disable-next-line no-console
  console.log(`🔁 Pulse import: mode=${mode}${onlySlug ? ` onlySlug=${onlySlug}` : ''}`);

  const repoRoot = resolve(__dirname, '..', '..', '..');
  const canonRoot = resolve(repoRoot, 'content', 'pulse');
  const files = listMarkdownFiles(canonRoot).filter((p) => (onlySlug ? p.endsWith(`${onlySlug}.md`) : true));

  if (files.length === 0) {
    throw new Error(`No pulse markdown files found under: ${canonRoot}`);
  }

  const url = getDatabaseUrl();
  const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
  await client.connect();

  let imported = 0;
  let skipped = 0;

  try {
    for (const filePath of files) {
      const rel = relative(repoRoot, filePath).replace(/\\/g, '/');
      const m = rel.match(/^content\/pulse\/([^/]+)\/(\d{4})\/([^/]+)\.md$/);
      if (!m) {
        skipped++;
        continue;
      }

      const countrySlug = m[1]!;
      const year = Number(m[2]!);
      const slug = m[3]!;

      const raw = readFileSync(filePath, 'utf8');
      const { yaml, body } = extractFrontmatter(raw);
      const meta = yaml ? parseYamlPulseMeta(yaml) : {};

      const id = meta.id?.trim() || `${countrySlug}-${year}-${slug}`;
      const title = meta.title?.trim() || titleCaseFromSlug(slug);

      const startDate = (meta.start_date ?? `${year}-01-01`).trim();
      const endDate = (meta.end_date ?? startDate).trim();
      const startAtIso = new Date(`${startDate}T00:00:00.000Z`).toISOString();
      const endAtIso = new Date(`${endDate}T23:59:59.999Z`).toISOString();

      const citySlug = meta.city?.trim() || null;
      const countryName = titleCaseFromSlug(countrySlug);
      const cityName = citySlug ? titleCaseFromSlug(citySlug) : null;

      const category = meta.primary_type?.trim() || null;
      const secondaryType = meta.secondary_type?.trim() || null;

      const officialUrl = meta.official_url?.trim() || null;
      const seoTitle = meta.seo_title?.trim() || null;
      const seoDescription = meta.seo_description?.trim() || null;
      const geoScope = meta.geo_scope?.trim() || null;
      const primaryType = meta.primary_type?.trim() || null;

      const lat = meta.coordinates_lat?.trim() || null;
      const lng = meta.coordinates_lng?.trim() || null;

      const shortDescription = extractShortDescription(body);

      const galleryKeys = buildDefaultGalleryKeys(countrySlug, year, slug);
      const galleryJson = JSON.stringify(galleryKeys);
      const mediaPrefix = buildMediaPrefix(countrySlug, year, slug);

      const isVerified = (meta.status ?? '').trim().toLowerCase() === 'confirmed';

      if (mode === 'dry-run') {
        imported++;
        continue;
      }

      await client.query(
        `
        INSERT INTO events (
          id,
          title,
          slug,
          description,
          short_description,
          category,
          country_slug,
          city_slug,
          country_name,
          city_name,
          year,
          start_date,
          end_date,
          start_at,
          end_at,
          lat,
          lng,
          is_free,
          price_amount,
          price_currency,
          status,
          is_active,
          media_prefix,
          hero_media_key,
          gallery_media_keys,
          is_verified,
          official_url,
          seo_title,
          seo_description,
          geo_scope,
          primary_type,
          secondary_type,
          source_md_path,
          created_at,
          updated_at
        )
        VALUES (
          $1,$2,$3,$4,$5,$6,
          $7,$8,$9,$10,$11,
          $12,$13,$14,$15,
          $16,$17,
          $18,$19,$20,$21,$22,
          $23,$24,
          $25,$26::jsonb,$27,
          $28,$29,$30,$31,$32,$33,
          $34,
          now(), now()
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          slug = EXCLUDED.slug,
          description = EXCLUDED.description,
          short_description = EXCLUDED.short_description,
          category = EXCLUDED.category,
          country_slug = EXCLUDED.country_slug,
          city_slug = EXCLUDED.city_slug,
          country_name = EXCLUDED.country_name,
          city_name = EXCLUDED.city_name,
          year = EXCLUDED.year,
          start_date = EXCLUDED.start_date,
          end_date = EXCLUDED.end_date,
          start_at = EXCLUDED.start_at,
          end_at = EXCLUDED.end_at,
          lat = EXCLUDED.lat,
          lng = EXCLUDED.lng,
          is_free = EXCLUDED.is_free,
          price_amount = EXCLUDED.price_amount,
          price_currency = EXCLUDED.price_currency,
          status = EXCLUDED.status,
          is_active = EXCLUDED.is_active,
          media_prefix = EXCLUDED.media_prefix,
          hero_media_key = EXCLUDED.hero_media_key,
          gallery_media_keys = EXCLUDED.gallery_media_keys,
          is_verified = EXCLUDED.is_verified,
          official_url = EXCLUDED.official_url,
          seo_title = EXCLUDED.seo_title,
          seo_description = EXCLUDED.seo_description,
          geo_scope = EXCLUDED.geo_scope,
          primary_type = EXCLUDED.primary_type,
          secondary_type = EXCLUDED.secondary_type,
          source_md_path = EXCLUDED.source_md_path,
          updated_at = now()
        `,
        [
          id,
          title,
          slug,
          body || null,
          shortDescription,
          category,
          countrySlug,
          citySlug,
          countryName,
          cityName,
          year,
          startAtIso,
          endAtIso,
          startAtIso,
          endAtIso,
          lat,
          lng,
          true,
          0,
          null,
          'active',
          true,
          mediaPrefix,
          null, // hero_media_key: optional, keep null to force client/server default 01.jpg
          galleryJson,
          isVerified,
          officialUrl,
          seoTitle,
          seoDescription,
          geoScope,
          primaryType,
          secondaryType,
          rel,
        ]
      );

      imported++;
    }
  } finally {
    await client.end();
  }

  // eslint-disable-next-line no-console
  console.log(`✅ Pulse import done. files=${files.length} imported=${imported} skipped=${skipped}`);
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});

