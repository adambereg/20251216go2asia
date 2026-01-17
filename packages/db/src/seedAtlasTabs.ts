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

type QueryResult<T> = { rows?: T[] };

function getFirstRow<T>(result: unknown): T | undefined {
  return (result as QueryResult<T>)?.rows?.[0];
}

function getRows<T>(result: unknown): T[] {
  return (result as QueryResult<T>)?.rows ?? [];
}

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

async function logCountryCandidates(db: ReturnType<typeof createDb>) {
  const result = await db.execute(sql`
    SELECT id::text AS id, slug, name
    FROM countries
    ORDER BY name
    LIMIT 10
  `);
  const rows = getRows<{ id: string; slug: string | null; name: string | null }>(result);
  // eslint-disable-next-line no-console
  console.error('Country candidates (top 10):', rows);
}

async function resolveCountryId(
  db: ReturnType<typeof createDb>,
  options: { id?: string; slug?: string; code?: string; name?: string }
) {
  const id = options.id ?? null;
  const slug = options.slug ?? null;
  const code = options.code ?? null;
  const name = options.name ?? null;
  const strategies: string[] = [];

  if (id) {
    strategies.push('id=exact');
    const rows = await db.execute(sql`
      SELECT id::text AS id
      FROM countries
      WHERE id::text = ${id}
      LIMIT 1
    `);
    const found = getFirstRow<{ id?: string }>(rows)?.id;
    if (found) return found;
  }

  if (slug) {
    strategies.push('slug=exact');
    const rows = await db.execute(sql`
      SELECT id::text AS id
      FROM countries
      WHERE slug = ${slug}
      LIMIT 1
    `);
    const found = getFirstRow<{ id?: string }>(rows)?.id;
    if (found) return found;
  }

  if (code) {
    strategies.push('code=exact');
    const rows = await db.execute(sql`
      SELECT id::text AS id
      FROM countries
      WHERE code = ${code}
      LIMIT 1
    `);
    const found = getFirstRow<{ id?: string }>(rows)?.id;
    if (found) return found;
  }

  if (name) {
    strategies.push('name=ilike');
    const rows = await db.execute(sql`
      SELECT id::text AS id
      FROM countries
      WHERE name ILIKE ${'%' + name + '%'}
      LIMIT 1
    `);
    const found = getFirstRow<{ id?: string }>(rows)?.id;
    if (found) return found;
  }

  // eslint-disable-next-line no-console
  console.error('Country not found for seed', { id, slug, code, name, strategies });
  await logCountryCandidates(db);
  throw new Error('Country not found for seed');
}

async function logCityCandidates(db: ReturnType<typeof createDb>, countryId: string) {
  const result = await db.execute(sql`
    SELECT id::text AS id, slug, name
    FROM cities
    WHERE country_id = ${countryId}
    ORDER BY name
    LIMIT 10
  `);
  const rows = getRows<{ id: string; slug: string | null; name: string | null }>(result);
  // eslint-disable-next-line no-console
  console.error('City candidates (top 10):', rows);
}

async function resolveCityId(
  db: ReturnType<typeof createDb>,
  options: { countryId: string; idOrSlug?: string; name?: string }
) {
  const countryId = options.countryId;
  const idOrSlug = options.idOrSlug ?? null;
  const name = options.name ?? null;
  const strategies: string[] = [];

  if (idOrSlug) {
    strategies.push('idOrSlug=exact');
    const rows = await db.execute(sql`
      SELECT id::text AS id
      FROM cities
      WHERE country_id = ${countryId} AND (id::text = ${idOrSlug} OR slug = ${idOrSlug})
      LIMIT 1
    `);
    const found = getFirstRow<{ id?: string }>(rows)?.id;
    if (found) return found;
  }

  if (name) {
    strategies.push('name=ilike');
    const rows = await db.execute(sql`
      SELECT id::text AS id
      FROM cities
      WHERE country_id = ${countryId} AND name ILIKE ${'%' + name + '%'}
      LIMIT 1
    `);
    const found = getFirstRow<{ id?: string }>(rows)?.id;
    if (found) return found;
  }

  // eslint-disable-next-line no-console
  console.error('City not found for seed', { countryId, idOrSlug, name, strategies });
  await logCityCandidates(db, countryId);
  throw new Error('City not found for seed');
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

  const countryId = await resolveCountryId(db, { id: 'ph', slug: 'ph', code: 'PH', name: 'Филиппины' });
  const countryMd = readFileSync(join(baseDir, 'Филиппины.md'), 'utf-8');
  await upsertBlocks(db, 'country', countryId, 'ru', parseSections(countryMd), COUNTRY_TAB_KEYS);

  const manilaId = await resolveCityId(db, { countryId, idOrSlug: 'mnl', name: 'Манила' });
  const manilaMd = readFileSync(join(baseDir, 'Philippines-Manila-City.md'), 'utf-8');
  await upsertBlocks(db, 'city', manilaId, 'ru', parseSections(manilaMd), CITY_TAB_KEYS);

  const cebuId = await resolveCityId(db, { countryId, idOrSlug: 'ceb', name: 'Себу' });
  const cebuMd = readFileSync(join(baseDir, 'Philippines-Cebu-City.md'), 'utf-8');
  await upsertBlocks(db, 'city', cebuId, 'ru', parseSections(cebuMd), CITY_TAB_KEYS);

  const palawanId = await resolveCityId(db, { countryId, idOrSlug: 'palawan', name: 'Палаван' });
  const palawanMd = readFileSync(join(baseDir, 'Philippines-Palawan.md'), 'utf-8');
  await upsertBlocks(db, 'city', palawanId, 'ru', parseSections(palawanMd), CITY_TAB_KEYS);
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Seed atlas tabs failed:', error);
  process.exit(1);
});

