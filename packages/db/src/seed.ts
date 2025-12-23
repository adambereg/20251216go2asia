/**
 * Seed data for Go2Asia MVP (dev/staging).
 *
 * PR#2: Seed content (Atlas + Pulse + Blog + Media) from UI mocks.
 *
 * Rules:
 * - Idempotent: re-run does not create duplicates (upserts by stable keys).
 * - No secrets in logs.
 * - R2: metadata only (no uploads).
 * - Connect: do NOT seed points/referral tables (M3 logic must remain authoritative).
 */

import { createHash } from 'node:crypto';
import { createDb } from './client';
import { sql } from 'drizzle-orm';
import {
  articles,
  cities,
  countries,
  events,
  mediaFiles,
  places,
} from './schema/content';

type ID = string;

type EventDTO = {
  id: ID;
  title: string;
  description?: string;
  category?: string;
  startTime: string;
  endTime?: string;
  location?: { name: string; city?: string; country?: string; placeId?: ID };
  coverImage?: string;
  price?: { type: 'free' | 'paid'; amount?: number; currency?: string };
};

type PlaceDTO = {
  id: ID;
  name: string;
  slug?: string;
  type: string;
  description?: string;
  country?: string;
  city?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  photos?: string[];
};

type CountryDTO = {
  id: ID;
  name: string;
  code?: string;
  flag?: string;
  description?: string;
  heroImage?: string;
};

type CityDTO = {
  id: ID;
  name: string;
  countryId: ID;
  description?: string;
  latitude?: number;
  longitude?: number;
  heroImage?: string;
};

type PostDTO = {
  id: ID;
  slug: string;
  title: string;
  excerpt?: string;
  contentMarkdown: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
  publishedAt?: string;
};

type GuideDTO = {
  id: ID;
  slug: string;
  title: string;
  excerpt?: string;
  contentMarkdown: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
  publishedAt?: string;
};

type MockRepo = {
  pulse: { listEvents(): EventDTO[] };
  atlas: {
    listCountries(): CountryDTO[];
    listCities(): CityDTO[];
    listPlaces(): PlaceDTO[];
    listGuides(): GuideDTO[];
  };
  blog: { listPosts(): PostDTO[] };
};

const DEFAULT_MEDIA_PROVIDER = 'r2';
const DEFAULT_MEDIA_BUCKET = 'go2asia-media';

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

function shaId(input: string): string {
  return `mf_${createHash('sha256').update(input).digest('hex')}`;
}

function extFromUrl(url: string): string {
  try {
    const u = new URL(url);
    const p = u.pathname;
    const last = p.split('/').filter(Boolean).pop() ?? '';
    const dot = last.lastIndexOf('.');
    if (dot > -1 && dot < last.length - 1) return last.slice(dot).toLowerCase();
  } catch {
    // ignore
  }
  return '.jpg';
}

function basenameFromUrl(url: string): string {
  try {
    const u = new URL(url);
    const last = u.pathname.split('/').filter(Boolean).pop();
    if (last) return last;
  } catch {
    // ignore
  }
  return `image${extFromUrl(url)}`;
}

function guessMimeType(url: string): string {
  const ext = extFromUrl(url);
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.gif') return 'image/gif';
  return 'image/jpeg';
}

function toMoneyAmount(value: number | undefined): string {
  const n = typeof value === 'number' && Number.isFinite(value) ? value : 0;
  return n.toFixed(2);
}

function toNumeric6(value: number | undefined): string | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  return value.toFixed(6);
}

function normalizeCurrency(value: string | undefined): string | null {
  if (!value) return null;
  const v = value.trim().toUpperCase();
  return v.length === 3 ? v : v.slice(0, 3);
}

function slugify(input: string): string {
  const s = input
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, '-')
    .replace(/^-+|-+$/g, '');
  return s.length > 0 ? s : 'item';
}

const cityNameToId: Record<string, string> = {
  Bangkok: 'bkk',
  Phuket: 'hkt',
  'Chiang Mai': 'cnx',
};

const countryNameToId: Record<string, string> = {
  Thailand: 'th',
};

async function maybeResetContent(db: ReturnType<typeof createDb>) {
  const reset = process.env.SEED_RESET === '1';
  if (!reset) return;

  // Only content tables; do NOT touch points/referral/auth.
  await db.execute(
    sql`
      TRUNCATE TABLE
        event_registrations,
        events,
        places,
        cities,
        countries,
        articles,
        media_files
    `
  );
}

async function seedMedia(db: ReturnType<typeof createDb>) {
  const media: Array<typeof mediaFiles.$inferInsert> = [];

  const pushMedia = (kind: string, ownerId: string, url: string) => {
    const bucket = DEFAULT_MEDIA_BUCKET;
    const provider = DEFAULT_MEDIA_PROVIDER;
    const key = `${kind}/${ownerId}/${basenameFromUrl(url)}`;
    const id = shaId(`${provider}|${bucket}|${key}`);
    media.push({
      id,
      provider,
      bucket,
      key,
      publicUrl: url,
      mimeType: guessMimeType(url),
      size: 0,
      width: null,
      height: null,
    });
    return id;
  };

  const repo = await loadMockRepo();

  // Atlas
  for (const c of repo.atlas.listCountries()) {
    if (c.heroImage) pushMedia('country', c.id, c.heroImage);
  }
  for (const c of repo.atlas.listCities()) {
    if (c.heroImage) pushMedia('city', c.id, c.heroImage);
  }
  for (const p of repo.atlas.listPlaces()) {
    const first = p.photos?.[0];
    if (first) pushMedia('place', p.id, first);
    for (const u of p.photos?.slice(1, 6) ?? []) {
      pushMedia('place', p.id, u);
    }
  }

  // Pulse
  for (const e of repo.pulse.listEvents()) {
    if (e.coverImage) pushMedia('event', e.id, e.coverImage);
  }

  // Blog
  for (const p of repo.blog.listPosts()) {
    if (p.coverImage) pushMedia('article', p.slug, p.coverImage);
  }
  // Atlas guides are stored in articles table for MVP read-only feed (same schema)
  for (const g of repo.atlas.listGuides()) {
    if (g.coverImage) pushMedia('article', g.slug, g.coverImage);
  }

  if (media.length === 0) return new Map<string, string>();

  // De-dupe by provider|bucket|key (unique constraint)
  const unique = new Map<string, typeof mediaFiles.$inferInsert>();
  for (const m of media) {
    unique.set(`${m.provider}|${m.bucket}|${m.key}`, m);
  }
  const values = Array.from(unique.values());

  await db
    .insert(mediaFiles)
    .values(values)
    .onConflictDoUpdate({
      target: [mediaFiles.provider, mediaFiles.bucket, mediaFiles.key],
      set: {
        publicUrl: sql`excluded.public_url`,
        mimeType: sql`excluded.mime_type`,
        size: sql`excluded.size`,
        width: sql`excluded.width`,
        height: sql`excluded.height`,
      },
    });

  const keyToId = new Map<string, string>();
  for (const m of values) {
    keyToId.set(`${m.provider}|${m.bucket}|${m.key}`, m.id);
  }
  return keyToId;
}

async function seedAtlas(
  db: ReturnType<typeof createDb>,
  mediaKeyToId: Map<string, string>,
  repo: MockRepo
) {
  const getMediaId = (kind: string, ownerId: string, url: string | undefined) => {
    if (!url) return null;
    const bucket = DEFAULT_MEDIA_BUCKET;
    const provider = DEFAULT_MEDIA_PROVIDER;
    const key = `${kind}/${ownerId}/${basenameFromUrl(url)}`;
    return mediaKeyToId.get(`${provider}|${bucket}|${key}`) ?? null;
  };

  // Countries
  const countriesRows: Array<typeof countries.$inferInsert> = repo.atlas.listCountries().map((c) => ({
    id: c.id,
    slug: c.id,
    name: c.name,
    code: (c.code ?? c.id).toUpperCase().slice(0, 3),
    flagEmoji: c.flag ?? null,
    descriptionShort: c.description ?? null,
    heroMediaId: getMediaId('country', c.id, c.heroImage),
  }));

  await db
    .insert(countries)
    .values(countriesRows)
    .onConflictDoUpdate({
      target: [countries.slug],
      set: {
        name: sql`excluded.name`,
        code: sql`excluded.code`,
        flagEmoji: sql`excluded.flag_emoji`,
        descriptionShort: sql`excluded.description_short`,
        heroMediaId: sql`excluded.hero_media_id`,
        updatedAt: sql`now()`,
      },
    });

  // Cities
  const citiesRows: Array<typeof cities.$inferInsert> = repo.atlas.listCities().map((c) => ({
    id: c.id,
    countryId: c.countryId,
    name: c.name,
    slug: c.id,
    descriptionShort: c.description ?? null,
    lat: toNumeric6(c.latitude),
    lng: toNumeric6(c.longitude),
    heroMediaId: getMediaId('city', c.id, c.heroImage),
  }));

  await db
    .insert(cities)
    .values(citiesRows)
    .onConflictDoUpdate({
      target: [cities.slug],
      set: {
        countryId: sql`excluded.country_id`,
        name: sql`excluded.name`,
        descriptionShort: sql`excluded.description_short`,
        lat: sql`excluded.lat`,
        lng: sql`excluded.lng`,
        heroMediaId: sql`excluded.hero_media_id`,
        updatedAt: sql`now()`,
      },
    });

  // Places (from generic 20 demo places)
  const placesRows: Array<typeof places.$inferInsert> = repo.atlas.listPlaces().map((p) => {
    const countryId = p.country ? countryNameToId[p.country] ?? null : null;
    const cityId = p.city ? cityNameToId[p.city] ?? null : null;
    const heroUrl = p.photos?.[0];
    return {
      id: p.id,
      countryId,
      cityId,
      name: p.name,
      slug: p.slug ?? p.id,
      type: p.type,
      descriptionShort: p.description ?? null,
      lat: toNumeric6(p.latitude),
      lng: toNumeric6(p.longitude),
      address: p.address ?? null,
      heroMediaId: heroUrl ? getMediaId('place', p.id, heroUrl) : null,
      images: p.photos ?? null,
    };
  });

  await db
    .insert(places)
    .values(placesRows)
    .onConflictDoUpdate({
      target: [places.slug],
      set: {
        countryId: sql`excluded.country_id`,
        cityId: sql`excluded.city_id`,
        name: sql`excluded.name`,
        type: sql`excluded.type`,
        descriptionShort: sql`excluded.description_short`,
        lat: sql`excluded.lat`,
        lng: sql`excluded.lng`,
        address: sql`excluded.address`,
        heroMediaId: sql`excluded.hero_media_id`,
        images: sql`excluded.images`,
        updatedAt: sql`now()`,
      },
    });
}

function mapEventStatus(_raw: unknown): 'draft' | 'active' | 'cancelled' | 'archived' {
  // EventDTO does not include status; keep MVP stable.
  return 'active';
}

async function seedPulse(db: ReturnType<typeof createDb>, mediaKeyToId: Map<string, string>) {
  const getMediaId = (kind: string, ownerId: string, url: string | undefined) => {
    if (!url) return null;
    const bucket = DEFAULT_MEDIA_BUCKET;
    const provider = DEFAULT_MEDIA_PROVIDER;
    const key = `${kind}/${ownerId}/${basenameFromUrl(url)}`;
    return mediaKeyToId.get(`${provider}|${bucket}|${key}`) ?? null;
  };

  const repo = await loadMockRepo();
  const eventsRows: Array<typeof events.$inferInsert> = repo.pulse.listEvents().map((e) => {
    const startAt = new Date(e.startTime);
    const endAt = e.endTime ? new Date(e.endTime) : null;

    const cityId = e.location?.city ? cityNameToId[e.location.city] ?? null : null;
    const countryId = e.location?.country ? countryNameToId[e.location.country] ?? null : null;

    const isFree = e.price?.type !== 'paid';
    const amount = isFree ? '0.00' : toMoneyAmount(e.price?.amount);
    const currency = isFree ? null : normalizeCurrency(e.price?.currency) ?? 'THB';

    const cover = e.coverImage;
    const slug = `${slugify(e.title)}-${e.id}`.slice(0, 255);

    return {
      id: e.id,
      title: e.title,
      slug,
      description: e.description ?? null,
      category: e.category ?? null,
      // Legacy required columns
      startDate: startAt,
      endDate: endAt,
      // SSOT columns
      startAt,
      endAt,
      location: e.location?.name ?? null,
      countryId,
      cityId,
      lat: null,
      lng: null,
      imageUrl: cover ?? null,
      imageMediaId: cover ? getMediaId('event', e.id, cover) : null,
      isFree,
      priceAmount: amount,
      priceCurrency: currency,
      status: mapEventStatus(undefined),
      isActive: true,
    };
  });

  await db
    .insert(events)
    .values(eventsRows)
    .onConflictDoUpdate({
      target: [events.id],
      set: {
        title: sql`excluded.title`,
        slug: sql`excluded.slug`,
        description: sql`excluded.description`,
        category: sql`excluded.category`,
        startAt: sql`excluded.start_at`,
        endAt: sql`excluded.end_at`,
        startDate: sql`excluded.start_date`,
        endDate: sql`excluded.end_date`,
        location: sql`excluded.location`,
        countryId: sql`excluded.country_id`,
        cityId: sql`excluded.city_id`,
        imageUrl: sql`excluded.image_url`,
        imageMediaId: sql`excluded.image_media_id`,
        isFree: sql`excluded.is_free`,
        priceAmount: sql`excluded.price_amount`,
        priceCurrency: sql`excluded.price_currency`,
        status: sql`excluded.status`,
        isActive: sql`excluded.is_active`,
        updatedAt: sql`now()`,
      },
    });
}

async function seedBlog(db: ReturnType<typeof createDb>, mediaKeyToId: Map<string, string>) {
  const getMediaId = (kind: string, ownerId: string, url: string | undefined) => {
    if (!url) return null;
    const bucket = DEFAULT_MEDIA_BUCKET;
    const provider = DEFAULT_MEDIA_PROVIDER;
    const key = `${kind}/${ownerId}/${basenameFromUrl(url)}`;
    return mediaKeyToId.get(`${provider}|${bucket}|${key}`) ?? null;
  };

  const repo = await loadMockRepo();
  const posts = repo.blog.listPosts();
  const guides = repo.atlas.listGuides();

  const rows: Array<typeof articles.$inferInsert> = [
    ...posts.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt ?? null,
      content: p.contentMarkdown,
      category: p.category ?? null,
      tags: p.tags ?? null,
      coverMediaId: getMediaId('article', p.slug, p.coverImage),
      imageUrl: p.coverImage ?? null,
      publishedAt: p.publishedAt ? new Date(p.publishedAt) : null,
      status: 'published' as const,
      isPublished: true,
    })),
    ...guides.map((g) => ({
      id: g.id,
      slug: g.slug,
      title: g.title,
      excerpt: g.excerpt ?? null,
      content: g.contentMarkdown,
      category: g.category ?? null,
      tags: g.tags ?? null,
      coverMediaId: getMediaId('article', g.slug, g.coverImage),
      imageUrl: g.coverImage ?? null,
      publishedAt: g.publishedAt ? new Date(g.publishedAt) : null,
      status: 'published' as const,
      isPublished: true,
    })),
  ];

  await db
    .insert(articles)
    .values(rows)
    .onConflictDoUpdate({
      target: [articles.slug],
      set: {
        title: sql`excluded.title`,
        excerpt: sql`excluded.excerpt`,
        content: sql`excluded.content`,
        category: sql`excluded.category`,
        tags: sql`excluded.tags`,
        coverMediaId: sql`excluded.cover_media_id`,
        imageUrl: sql`excluded.image_url`,
        publishedAt: sql`excluded.published_at`,
        status: sql`excluded.status`,
        isPublished: sql`excluded.is_published`,
        updatedAt: sql`now()`,
      },
    });
}

async function sanityReport(db: ReturnType<typeof createDb>) {
  const counts = await db.execute(sql`
    SELECT
      (SELECT count(*)::int FROM countries) AS countries,
      (SELECT count(*)::int FROM cities) AS cities,
      (SELECT count(*)::int FROM places) AS places,
      (SELECT count(*)::int FROM events) AS events,
      (SELECT count(*)::int FROM articles) AS articles,
      (SELECT count(*)::int FROM media_files) AS media_files
  `);

  const row = (counts as any)?.rows?.[0] ?? {};

  // eslint-disable-next-line no-console
  console.log('✅ Seed completed (content only). Counts:');
  // eslint-disable-next-line no-console
  console.log(
    `- countries: ${row.countries ?? 0}, cities: ${row.cities ?? 0}, places: ${row.places ?? 0}, events: ${row.events ?? 0}, articles: ${row.articles ?? 0}, media_files: ${row.media_files ?? 0}`
  );

  const repo = await loadMockRepo();
  const demoEventIds = repo.pulse.listEvents().slice(0, 3).map((e) => e.id);
  const demoArticleSlugs = repo.blog.listPosts().slice(0, 3).map((p) => p.slug);
  const demoPlaceIds = repo.atlas.listPlaces().slice(0, 3).map((p) => p.id);

  // eslint-disable-next-line no-console
  console.log('🔎 Demo URLs to verify in UI (NEXT_PUBLIC_DATA_SOURCE=api):');
  for (const id of demoEventIds) console.log(`- /pulse/${id}`);
  for (const slug of demoArticleSlugs) console.log(`- /blog/${slug}`);
  for (const id of demoPlaceIds) console.log(`- /atlas/places/${id}`);
  console.log(`- /atlas (countries)`);
  console.log(`- /atlas/cities`);
}

async function main() {
  const databaseUrl = getDatabaseUrl();
  const db = createDb(databaseUrl);

  const repo = await loadMockRepo();

  await maybeResetContent(db);
  const mediaKeyToId = await seedMedia(db);
  await seedAtlas(db, mediaKeyToId, repo);
  await seedPulse(db, mediaKeyToId);
  await seedBlog(db, mediaKeyToId);
  await sanityReport(db);
}

let _cachedRepo: MockRepo | null = null;
async function loadMockRepo(): Promise<MockRepo> {
  if (_cachedRepo) return _cachedRepo;

  // Dynamic import to avoid pulling frontend mocks into packages/db TypeScript compilation output.
  const modulePath = '../../../apps/go2asia-pwa-shell/mocks/repo';
  const mod = (await import(modulePath as string)) as any;
  _cachedRepo = mod.mockRepo as MockRepo;
  return _cachedRepo;
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('❌ Seed failed:', err instanceof Error ? err.message : String(err));
  process.exit(1);
});
