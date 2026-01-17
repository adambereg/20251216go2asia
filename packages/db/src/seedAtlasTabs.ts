/**
 * Seed Atlas tabs from markdown (Philippines).
 *
 * Rules:
 * - Idempotent: UPSERT by (entity_type, entity_id, tab_key, lang)
 * - Refuse to run in production
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createDb } from './client';
import { contentBlocks } from './schema/content';
import { sql } from 'drizzle-orm';

type TabSection = { title: string; body: string };

const COUNTRY_TAB_KEYS = new Map<string, string>([
  ['обзор', 'overview'],
  ['фотогалерея', 'gallery'],
  ['карта', 'map'],
  ['города', 'cities'],
  ['погода', 'weather'],
  ['история', 'history'],
  ['география', 'geography'],
  ['культура', 'culture'],
  ['проживание', 'living'],
  ['визы', 'visas'],
  ['бизнес', 'business'],
  ['места', 'places'],
  ['разговорник', 'phrasebook'],
  ['отзывы', 'reviews'],
  ['калькулятор', 'calculator'],
]);

const CITY_TAB_KEYS = new Map<string, string>([
  ['обзор', 'overview'],
  ['районы', 'districts'],
  ['проживание', 'accommodation'],
  ['еда и кафе', 'food'],
  ['достопримечательности', 'places'],
  ['места', 'places'],
  ['транспорт', 'transport'],
  ['погода', 'weather'],
  ['шопинг', 'shopping'],
  ['ночная жизнь', 'nightlife'],
  ['гиды', 'guides'],
  ['советы', 'tips'],
  ['отзывы', 'reviews'],
  ['бюджет', 'budget'],
]);

function getDatabaseUrl(): string {
  const url = process.env.STAGING_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) {
    throw new Error('Missing STAGING_DATABASE_URL or DATABASE_URL');
  }
  const env = (process.env.ENVIRONMENT ?? 'dev').toLowerCase();
  if (env === 'production') {
    throw new Error('Refusing to run seed with ENVIRONMENT=production');
  }
  return url;
}

function parseSections(markdown: string): TabSection[] {
  const lines = markdown.split(/\r?\n/);
  const sections: TabSection[] = [];
  let currentTitle: string | null = null;
  let buffer: string[] = [];

  const pushSection = () => {
    if (!currentTitle) return;
    const body = buffer.join('\n').trim();
    sections.push({ title: currentTitle.trim(), body });
  };

  for (const line of lines) {
    const match = line.match(/^##\s+(.+)$/);
    if (match) {
      pushSection();
      currentTitle = match[1].trim();
      buffer = [];
      continue;
    }
    if (currentTitle) buffer.push(line);
  }
  pushSection();
  return sections;
}

function normalizeTitle(title: string): string {
  return title.toLowerCase().trim();
}

async function resolveCountryId(db: ReturnType<typeof createDb>, options: { slug?: string; code?: string; name?: string }) {
  const slug = options.slug ?? null;
  const code = options.code ?? null;
  const name = options.name ?? null;
  const rows = await db.execute(sql`
    SELECT id::text AS id
    FROM countries
    WHERE (${slug}::text IS NOT NULL AND (slug = ${slug} OR id::text = ${slug}))
       OR (${code}::text IS NOT NULL AND code = ${code})
       OR (${name}::text IS NOT NULL AND lower(name) = lower(${name}))
    LIMIT 1
  `);
  const id = (rows[0] as { id?: string } | undefined)?.id;
  if (!id) throw new Error('Country not found for seed');
  return id;
}

async function resolveCityId(db: ReturnType<typeof createDb>, options: { slug?: string; name?: string }) {
  const slug = options.slug ?? null;
  const name = options.name ?? null;
  const rows = await db.execute(sql`
    SELECT id::text AS id
    FROM cities
    WHERE (${slug}::text IS NOT NULL AND (slug = ${slug} OR id::text = ${slug}))
       OR (${name}::text IS NOT NULL AND lower(name) = lower(${name}))
    LIMIT 1
  `);
  const id = (rows[0] as { id?: string } | undefined)?.id;
  if (!id) throw new Error('City not found for seed');
  return id;
}

async function upsertBlocks(
  db: ReturnType<typeof createDb>,
  entityType: 'country' | 'city',
  entityId: string,
  lang: string,
  sections: TabSection[],
  tabMap: Map<string, string>
) {
  const rows = sections
    .map((s) => {
      const key = tabMap.get(normalizeTitle(s.title));
      if (!key) return null;
      const body = s.body.trim();
      if (!body) return null;
      return {
        entityType,
        entityId,
        tabKey: key,
        lang,
        title: s.title,
        bodyMarkdown: body,
        source: 'seed',
      };
    })
    .filter(Boolean) as Array<typeof contentBlocks.$inferInsert>;

  if (rows.length === 0) return;

  await db
    .insert(contentBlocks)
    .values(rows)
    .onConflictDoUpdate({
      target: [contentBlocks.entityType, contentBlocks.entityId, contentBlocks.tabKey, contentBlocks.lang],
      set: {
        title: sql`excluded.title`,
        bodyMarkdown: sql`excluded.body_markdown`,
        source: sql`excluded.source`,
        updatedAt: sql`now()`,
      },
    });
}

async function main() {
  const db = createDb(getDatabaseUrl());
  const repoRoot = join(process.cwd(), '..', '..');
  const baseDir = join(repoRoot, 'content', 'atlas', 'philippines');

  const countryId = await resolveCountryId(db, { slug: 'ph', code: 'PH', name: 'Филиппины' });
  const countryMd = readFileSync(join(baseDir, 'Филиппины.md'), 'utf-8');
  await upsertBlocks(db, 'country', countryId, 'ru', parseSections(countryMd), COUNTRY_TAB_KEYS);

  const manilaId = await resolveCityId(db, { slug: 'mnl', name: 'Манила' });
  const manilaMd = readFileSync(join(baseDir, 'Philippines-Manila-City.md'), 'utf-8');
  await upsertBlocks(db, 'city', manilaId, 'ru', parseSections(manilaMd), CITY_TAB_KEYS);

  const cebuId = await resolveCityId(db, { slug: 'ceb', name: 'Себу' });
  const cebuMd = readFileSync(join(baseDir, 'Philippines-Cebu-City.md'), 'utf-8');
  await upsertBlocks(db, 'city', cebuId, 'ru', parseSections(cebuMd), CITY_TAB_KEYS);

  const palawanId = await resolveCityId(db, { slug: 'pal', name: 'Палаван' });
  const palawanMd = readFileSync(join(baseDir, 'Philippines-Palawan.md'), 'utf-8');
  await upsertBlocks(db, 'city', palawanId, 'ru', parseSections(palawanMd), CITY_TAB_KEYS);
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Seed atlas tabs failed:', error);
  process.exit(1);
});

