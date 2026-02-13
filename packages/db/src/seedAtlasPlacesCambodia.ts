/**
 * Seed Atlas places for Cambodia from markdown.
 *
 * ⚠️ Legacy / dev-only note (Atlas import pipeline v1):
 * - Канонический путь импорта Atlas Places v1 — экспорт артефактов через
 *   `packages/db/src/exportPlacesToNeon.ts` (см. `docs/architecture/atlas_import_pipeline_fix_v1.md`).
 * - Этот seed-скрипт не является источником истины для v1 и не должен использоваться
 *   для production-данных Atlas (во избежание расхождения правил парсинга/ID/секций).
 *
 * Rules:
 * - Idempotent: UPSERT by slug (places) and (entity_type, entity_id, tab_key, lang) (content_blocks)
 * - Refuse to run in production
 * - Skip unknown cities, log and continue
 * - Parse structured sections with emoji headers and save to content_blocks
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { sql } from 'drizzle-orm';
import { createDb } from './client';
import { places, contentBlocks } from './schema/content';

type PlaceKind = 'showplace' | 'business';

type PlaceSeed = {
  cityName: string;
  cityRef?: string;
  kind: PlaceKind;
  name: string;
  slug: string; // base slug (without city prefix); final slug becomes `${cityId}-${slug}` during upsert
  descriptionShort: string | null;
  lat: string | null;
  lng: string | null;
  address: string | null;
  tags: string[];
  category: string | null;
  website: string | null;
  phone: string | null;
  instagram: string | null;
  googleMapsUrl: string | null;
  priceLevel: string | null;
  workingHours: string | null;
  sections: Map<string, string>; // section_key -> markdown content
};

// Map emoji section headers to section keys
const SECTION_HEADER_TO_KEY: Record<string, { showplace?: string; business?: string }> = {
  '🟡 Почему стоит посетить': { showplace: 'whyImportant', business: 'whyVisit' },
  '🟡 Почему это важно': { showplace: 'whyImportant' },
  '🔵 Что обязательно посмотреть': { showplace: 'structure' },
  '🔵 Что обязательно попробовать': { business: 'mustTry' },
  '🟢 Цены и вход': { showplace: 'tickets' },
  '🟢 Цены и чек': { business: 'prices' },
  '🟠 Как добраться': { showplace: 'howToGet', business: 'howToGet' },
  '🔷 Инфраструктура и сервис': { showplace: 'service', business: 'service' },
  '🔷 Сервис и комфорт': { business: 'service' },
  '🟣 Полезные нюансы': { showplace: 'practicalTips', business: 'nuances' },
  '🟢 Локальная ценность': { showplace: 'localValue', business: 'localValue' },
  '🔵 Что стоит сфотографировать': { showplace: 'photoSpots', business: 'photoTips' },
  '📍 Практическая информация': { showplace: 'practicalTips', business: 'nuances' },
};

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

function slugify(input: string): string {
  const s = translit(input)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return s.length > 0 ? s : 'item';
}

function translit(input: string): string {
  const map: Record<string, string> = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'e',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'h',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'sch',
    ъ: '',
    ы: 'y',
    ь: '',
    э: 'e',
    ю: 'yu',
    я: 'ya',
  };
  return input
    .split('')
    .map((ch) => {
      const lower = ch.toLowerCase();
      if (map[lower]) return ch === lower ? map[lower] : map[lower].toUpperCase();
      return ch;
    })
    .join('');
}

function extractShortDescription(fullText: string | null): string | null {
  if (!fullText) return null;
  const sentences = fullText.match(/[^.!?]+[.!?]+/g) ?? [];
  if (sentences.length === 0) {
    const trimmed = fullText.trim();
    if (trimmed.length > 500) {
      // eslint-disable-next-line no-console
      console.warn(`Description exceeds 500 chars (${trimmed.length}), truncating`);
      return trimmed.substring(0, 500);
    }
    return trimmed;
  }
  const short = sentences.slice(0, 3).join(' ').trim();
  if (short.length > 500) {
    // eslint-disable-next-line no-console
    console.warn(`Description exceeds 500 chars (${short.length}), truncating`);
    return short.substring(0, 500);
  }
  return short;
}

type ParseSummary = {
  totalPlaces: number;
  missingCoords: string[];
  missingDescription: string[];
};

function parsePlaces(markdown: string, cityRefMap: Record<string, string>): { places: PlaceSeed[]; summary: ParseSummary } {
  const lines = markdown.split(/\r?\n/);
  const places: PlaceSeed[] = [];
  const summary: ParseSummary = {
    totalPlaces: 0,
    missingCoords: [],
    missingDescription: [],
  };

  let currentCity: string | null = null;
  let currentPlace: PlaceSeed | null = null;
  let currentSection: string | null = null;
  let descriptionBuffer: string[] = [];
  let inMetadata = false;
  let expectingCoords = false;
  let expectingDescription = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';
    const trimmed = line.trim();

    // City header: # City Name
    if (trimmed.match(/^#\s+[^#]/) && !trimmed.startsWith('##') && !trimmed.startsWith('###')) {
      // Finalize previous place
      if (currentPlace) {
        if (descriptionBuffer.length > 0) {
          const fullDescription = descriptionBuffer.join(' ').trim();
          currentPlace.descriptionShort = extractShortDescription(fullDescription);
          descriptionBuffer = [];
        }
        if (expectingCoords && !currentPlace.lat && !currentPlace.lng) {
          summary.missingCoords.push(currentPlace.slug);
        }
        if (!currentPlace.descriptionShort || currentPlace.descriptionShort.length === 0) {
          summary.missingDescription.push(currentPlace.slug);
        }
        summary.totalPlaces++;
      }
      const cityMatch = trimmed.match(/^#\s+(.+)$/);
      let cityName = cityMatch?.[1]?.trim() ?? null;
      
      // Skip table of contents section
      if (cityName === 'Cambodia Guide' || cityName?.includes('Оглавление')) {
        currentCity = null;
        currentPlace = null;
        continue;
      }
      
      // Handle "Kampot / Kep" - use first city name
      if (cityName?.includes('/')) {
        cityName = cityName.split('/')[0]?.trim() ?? cityName;
      }
      currentCity = cityName;
      currentPlace = null;
      currentSection = null;
      inMetadata = false;
      expectingCoords = false;
      expectingDescription = false;
      continue;
    }
    
    // Skip table of contents section (## 📚 Оглавление)
    if (trimmed.includes('Оглавление') || trimmed.includes('📚')) {
      currentCity = null;
      currentPlace = null;
      continue;
    }

    if (!currentCity) continue;

    // Place header: ## Emoji Name
    if (trimmed.startsWith('## ')) {
      // Skip table of contents
      if (trimmed.includes('Оглавление') || trimmed.includes('📚')) {
        continue;
      }
      
      // Finalize previous place
      if (currentPlace) {
        if (descriptionBuffer.length > 0) {
          const fullDescription = descriptionBuffer.join(' ').trim();
          currentPlace.descriptionShort = extractShortDescription(fullDescription);
          descriptionBuffer = [];
        }
        if (expectingCoords && !currentPlace.lat && !currentPlace.lng) {
          summary.missingCoords.push(currentPlace.slug);
        }
        if (!currentPlace.descriptionShort || currentPlace.descriptionShort.length === 0) {
          summary.missingDescription.push(currentPlace.slug);
        }
        summary.totalPlaces++;
      }

      // Extract place name (remove emoji and parentheses)
      const nameMatch = trimmed.match(/^##\s+(.+)$/);
      const rawName = nameMatch?.[1]?.trim() ?? '';
      const name = rawName
        .replace(/^[\p{Extended_Pictographic}\p{Emoji_Presentation}\p{Emoji}\s]+/gu, '')
        .replace(/\s*\([^)]*\)\s*$/g, '')
        .trim();

      // Skip if name is empty or looks like table of contents
      if (!name || name.toLowerCase().includes('оглавление') || name.toLowerCase().includes('table of contents')) {
        continue;
      }

      // Create new place (kind will be determined from metadata)
      const nameSlug = slugify(name);
      
      currentPlace = {
        cityName: currentCity,
        kind: 'showplace', // Default, will be overridden from metadata
        name,
        slug: nameSlug,
        descriptionShort: null,
        lat: null,
        lng: null,
        address: null,
        tags: [],
        category: null,
        website: null,
        phone: null,
        instagram: null,
        googleMapsUrl: null,
        priceLevel: null,
        workingHours: null,
        sections: new Map(),
      };
      places.push(currentPlace);
      currentSection = null;
      inMetadata = false;
      expectingCoords = true;
      expectingDescription = false;
      descriptionBuffer = [];
      continue;
    }

    if (!currentPlace) continue;

    // Coordinates: **Координаты:** lat, lng (can be on same line or next line)
    if (expectingCoords) {
      if (trimmed.includes('**Координаты:**')) {
        // Try to extract from same line
        const coordsMatch = trimmed.match(/\*\*Координаты:\*\*\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
        if (coordsMatch) {
          currentPlace.lat = coordsMatch[1] ?? null;
          currentPlace.lng = coordsMatch[2] ?? null;
          expectingCoords = false;
          expectingDescription = true;
          continue;
        }
        // Coordinates might be on next line
        const nextLine = lines[i + 1]?.trim() ?? '';
        const nextCoordsMatch = nextLine.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
        if (nextCoordsMatch) {
          currentPlace.lat = nextCoordsMatch[1] ?? null;
          currentPlace.lng = nextCoordsMatch[2] ?? null;
          expectingCoords = false;
          expectingDescription = true;
          i++; // Skip next line
          continue;
        }
        // No coordinates found, stop expecting
        expectingCoords = false;
        expectingDescription = true;
        continue;
      }
    }

    // Description (until first section header, metadata, or separator)
    if (expectingDescription) {
      if (trimmed === '---' || trimmed.startsWith('###')) {
        expectingDescription = false;
        // Don't continue here - let section header be processed
        if (trimmed.startsWith('###')) {
          // Fall through to section header processing
        } else {
          continue;
        }
      } else if (trimmed.length > 0 && !trimmed.startsWith('**')) {
        descriptionBuffer.push(trimmed);
        continue;
      } else if (trimmed.startsWith('**') && !trimmed.includes('Координаты:')) {
        // Might be part of description
        descriptionBuffer.push(trimmed);
        continue;
      }
    }

    // Section header: ### Emoji Title
    if (trimmed.startsWith('### ')) {
      const sectionMatch = trimmed.match(/^###\s+(.+)$/);
      const sectionTitle = sectionMatch?.[1]?.trim() ?? '';

      // Metadata header must be handled BEFORE generic section parsing
      if (sectionTitle.includes('Метаданные')) {
        inMetadata = true;
        currentSection = null;
        continue;
      }
      
      // Check if it's a known section
      const mapping = SECTION_HEADER_TO_KEY[sectionTitle];
      if (mapping) {
        // IMPORTANT: don't rely on kind here — metadata comes later in file.
        // Prefer showplace key when available (works for both layouts via UI title mapping),
        // but fall back to business-only keys (mustTry/prices/etc).
        const key = mapping.showplace ?? mapping.business ?? null;
        if (key) {
          currentSection = key;
          currentPlace.sections.set(key, '');
        } else {
          currentSection = null;
        }
      } else {
        currentSection = null;
      }
      continue;
    }

    // Section content
    if (currentSection && trimmed.length > 0 && !trimmed.startsWith('**') && !trimmed.startsWith('###') && trimmed !== '---') {
      const existing = currentPlace.sections.get(currentSection) ?? '';
      currentPlace.sections.set(currentSection, existing ? `${existing}\n${trimmed}` : trimmed);
      continue;
    }

    if (inMetadata) {
      // Parse metadata fields
      const typeMatch = trimmed.match(/\*\*type:\*\*\s*(\w+)/);
      if (typeMatch) {
        const type = typeMatch[1]?.toLowerCase().trim();
        if (type === 'showplace' || type === 'business') {
          currentPlace.kind = type as PlaceKind;
        }
      }

      const cityMatch = trimmed.match(/\*\*city:\*\*\s*(.+)/);
      if (cityMatch) {
        const cityFromMeta = cityMatch[1]?.trim() ?? '';
        // Override city name from metadata if different (e.g., "Kep" in metadata but section is "Kampot / Kep")
        if (cityFromMeta && cityRefMap[cityFromMeta]) {
          currentPlace.cityName = cityFromMeta;
        }
      }

      const tagsMatch = trimmed.match(/\*\*tags:\*\*\s*(.+)/);
      if (tagsMatch) {
        const tagsStr = tagsMatch[1]?.trim() ?? '';
        currentPlace.tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
      }

      // Check for end of metadata
      if (trimmed === '---' || trimmed.startsWith('##')) {
        inMetadata = false;
      }
      continue;
    }

    // Extract website/address from "Практическая информация"
    if (trimmed.includes('**Адрес:**')) {
      const addressMatch = trimmed.match(/\*\*Адрес:\*\*\s*(.+)/);
      if (addressMatch) {
        currentPlace.address = addressMatch[1]?.trim() ?? null;
      }
    }

    if (trimmed.includes('**Сайт:**')) {
      const websiteMatch = trimmed.match(/\*\*Сайт:\*\*\s*\[([^\]]+)\]\(([^)]+)\)/);
      if (websiteMatch) {
        currentPlace.website = websiteMatch[2]?.trim() ?? null;
      }
    }

    if (trimmed.includes('**Instagram:**')) {
      const instagramMatch = trimmed.match(/\*\*Instagram:\*\*\s*\[([^\]]+)\]\(([^)]+)\)/);
      if (instagramMatch) {
        currentPlace.instagram = instagramMatch[1]?.trim() ?? null;
      }
    }
  }

  // Finalize last place
  if (currentPlace) {
    if (descriptionBuffer.length > 0) {
      const fullDescription = descriptionBuffer.join(' ').trim();
      currentPlace.descriptionShort = extractShortDescription(fullDescription);
    }
    if (expectingCoords && !currentPlace.lat && !currentPlace.lng) {
      summary.missingCoords.push(currentPlace.slug);
    }
    if (!currentPlace.descriptionShort || currentPlace.descriptionShort.length === 0) {
      summary.missingDescription.push(currentPlace.slug);
    }
    summary.totalPlaces++;
  }

  return { places, summary };
}

async function resolveCountryId(db: ReturnType<typeof createDb>, idOrSlug: string): Promise<string | null> {
  const rows = await db.execute(sql`
    SELECT id::text AS id
    FROM countries
    WHERE id::text = ${idOrSlug} OR slug = ${idOrSlug}
    LIMIT 1
  `);
  const row = (rows as { rows?: Array<{ id?: string }> })?.rows?.[0];
  return row?.id ?? null;
}

async function resolveCityId(
  db: ReturnType<typeof createDb>,
  countryId: string,
  idOrSlug: string
): Promise<string | null> {
  const rows = await db.execute(sql`
    SELECT id::text AS id
    FROM cities
    WHERE country_id = ${countryId}
      AND (id::text = ${idOrSlug} OR slug = ${idOrSlug} OR name ILIKE ${'%' + idOrSlug + '%'})
    LIMIT 1
  `);
  const row = (rows as { rows?: Array<{ id?: string }> })?.rows?.[0];
  return row?.id ?? null;
}

async function upsertPlaces(db: ReturnType<typeof createDb>, rows: Array<typeof places.$inferInsert>) {
  if (rows.length === 0) return 0;
  await db
    .insert(places)
    .values(rows)
    .onConflictDoUpdate({
      target: [places.slug],
      set: {
        name: sql`excluded.name`,
        type: sql`excluded.type`,
        placeKind: sql`excluded.place_kind`,
        category: sql`excluded.category`,
        tags: sql`excluded.tags`,
        descriptionShort: sql`excluded.description_short`,
        address: sql`excluded.address`,
        lat: sql`excluded.lat`,
        lng: sql`excluded.lng`,
        website: sql`excluded.website`,
        phone: sql`excluded.phone`,
        instagram: sql`excluded.instagram`,
        googleMapsUrl: sql`excluded.google_maps_url`,
        priceLevel: sql`excluded.price_level`,
        updatedAt: sql`now()`,
      },
    });
  return rows.length;
}

function getSectionHeader(key: string): string | null {
  const headers: Record<string, string> = {
    whyImportant: 'Почему это важно?',
    structure: 'Структура комплекса',
    tickets: 'Билеты и посещение',
    timeAllocation: 'Сколько времени заложить?',
    photoSpots: 'Лучшие точки для фото',
    practicalTips: 'Практические советы',
    history: 'Историческая справка',
    nearby: 'Что посмотреть рядом',
    interestingFact: 'Интересный факт',
    whyVisit: 'Почему стоит зайти?',
    mustTry: 'Что попробовать обязательно',
    prices: 'Цены',
    howToGet: 'Как добраться',
    service: 'Коммуникация & сервис',
    nuances: 'Полезные нюансы',
    localValue: 'Локальная ценность',
    photoTips: 'Что стоит сфотографировать',
  };
  return headers[key] ?? null;
}

async function upsertPlaceContentBlocks(
  db: ReturnType<typeof createDb>,
  placeId: string,
  sections: Map<string, string>
): Promise<number> {
  if (sections.size === 0) return 0;

  const markdownParts: string[] = [];
  for (const [key, content] of sections.entries()) {
    const header = getSectionHeader(key);
    if (header) {
      markdownParts.push(`## ${header}\n\n${content}`);
    } else {
      markdownParts.push(content);
    }
  }

  const bodyMarkdown = markdownParts.join('\n\n');

  await db
    .insert(contentBlocks)
    .values({
      entityType: 'place',
      entityId: placeId,
      tabKey: 'overview',
      lang: 'ru',
      title: null,
      bodyMarkdown,
      source: 'seed',
    })
    .onConflictDoUpdate({
      target: [contentBlocks.entityType, contentBlocks.entityId, contentBlocks.tabKey, contentBlocks.lang],
      set: {
        bodyMarkdown: sql`excluded.body_markdown`,
        updatedAt: sql`now()`,
      },
    });

  return 1;
}

async function main() {
  // eslint-disable-next-line no-console
  console.warn(
    '[LEGACY] seedAtlasPlacesCambodia.ts: для Atlas import pipeline v1 используйте `pnpm -C packages/db db:export:places-neon` (exportPlacesToNeon.ts).'
  );
  const db = createDb(getDatabaseUrl());
  const repoRoot = join(process.cwd(), '..', '..');
  const baseDir = join(repoRoot, 'content', 'atlas', 'cambodia');
  const markdown = readFileSync(join(baseDir, 'cambodia-places.md'), 'utf-8');

  const countryId = await resolveCountryId(db, 'kh');
  if (!countryId) throw new Error('Country not found for seed: kh');

  // City ID mapping for Cambodia
  // Based on actual DB IDs from staging database
  // Note: Kampong Thom and Koh Kong may need to be created in DB if they don't exist
  const cityRefMap: Record<string, string> = {
    'Siem Reap': 'rep',        // Сием Рип
    'Phnom Penh': 'pnh',       // Пномпень
    'Battambang': 'bat',       // Баттамбанг
    'Kampong Thom': 'kch',     // Кампонг Чам (temporary mapping - verify if Kampong Thom exists)
    'Koh Kong': 'kra',         // Кратье (temporary mapping - verify if Koh Kong exists)
    'Sihanoukville': 'kps',    // Сиануквиль
    'Kampot': 'kmp',           // Кампот (ID corrected: was kpt, now kmp)
    'Kep': 'kep',              // Кеп
  };

  const { places: parsedPlaces, summary: parseSummary } = parsePlaces(markdown, cityRefMap);
  
  // eslint-disable-next-line no-console
  console.log('\n=== Parse Summary ===');
  // eslint-disable-next-line no-console
  console.log(`Total places parsed: ${parseSummary.totalPlaces}`);
  if (parseSummary.missingCoords.length > 0) {
    // eslint-disable-next-line no-console
    console.log(`Places missing coords: ${parseSummary.missingCoords.length} (${parseSummary.missingCoords.join(', ')})`);
  }
  if (parseSummary.missingDescription.length > 0) {
    // eslint-disable-next-line no-console
    console.log(`Places missing description: ${parseSummary.missingDescription.length} (${parseSummary.missingDescription.join(', ')})`);
  }

  const grouped = new Map<string, PlaceSeed[]>();
  for (const item of parsedPlaces) {
    const key = item.cityName;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)?.push(item);
  }

  let totalPlaces = 0;
  let totalBusiness = 0;
  let totalShowplace = 0;
  let totalContentBlocks = 0;
  let skippedCities = 0;
  let skippedPlaces = 0;
  let resolvedCities = 0;

  for (const [cityName, list] of grouped.entries()) {
    const ref = cityRefMap[cityName] ?? cityName;
    const cityId = await resolveCityId(db, countryId, ref);
    if (!cityId) {
      // eslint-disable-next-line no-console
      console.warn(`Skipping city block: cannot resolve city ${cityName} (${ref})`);
      skippedCities++;
      skippedPlaces += list.length;
      continue;
    }
    resolvedCities++;

    const rows: Array<typeof places.$inferInsert> = [];
    const contentBlocksData: Array<{ placeId: string; sections: Map<string, string> }> = [];

    for (const p of list) {
      const placeSlug = p.slug.startsWith(`${cityId}-`) ? p.slug : `${cityId}-${p.slug}`;
      const placeId = placeSlug; // convention: id == slug (globally unique, prefixed)
      rows.push({
        id: placeId,
        countryId,
        cityId,
        name: p.name,
        slug: placeSlug,
        type: p.kind,
        placeKind: p.kind,
        category: p.category,
        tags: p.tags.length > 0 ? p.tags : null,
        descriptionShort: p.descriptionShort,
        lat: p.lat,
        lng: p.lng,
        address: p.address,
        website: p.website,
        phone: p.phone,
        instagram: p.instagram,
        googleMapsUrl: p.googleMapsUrl,
        priceLevel: p.priceLevel,
      });

      if (p.sections.size > 0) {
        contentBlocksData.push({ placeId, sections: p.sections });
      }

      if (p.kind === 'business') totalBusiness++;
      else totalShowplace++;
    }

    totalPlaces += await upsertPlaces(db, rows);

    for (const { placeId, sections } of contentBlocksData) {
      await upsertPlaceContentBlocks(db, placeId, sections);
      totalContentBlocks++;
    }
  }

  // eslint-disable-next-line no-console
  console.log(`\n=== Seed Summary ===`);
  // eslint-disable-next-line no-console
  console.log(`  inserted/updated places: ${totalPlaces} (business: ${totalBusiness} / showplace: ${totalShowplace})`);
  // eslint-disable-next-line no-console
  console.log(`  inserted/updated place content_blocks: ${totalContentBlocks}`);
  // eslint-disable-next-line no-console
  console.log(`  cities resolved: ${resolvedCities} / skipped: ${skippedCities}`);
  if (skippedPlaces > 0) {
    // eslint-disable-next-line no-console
    console.log(`  skipped places: ${skippedPlaces}`);
  }
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Seed atlas places failed:', error);
  process.exit(1);
});
