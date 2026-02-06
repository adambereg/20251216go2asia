/**
 * Seed Atlas places for Philippines from markdown.
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
 * - Parse structured bullet sections and save to content_blocks
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
  slug: string;
  descriptionShort: string | null; // 2-3 sentences teaser
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
  // Structured content sections for content_blocks
  sections: Map<string, string>; // section_key -> markdown content
};

// Emoji to section key mapping
const EMOJI_TO_SECTION: Record<string, { showplace?: string; business?: string }> = {
  '🌟': { showplace: 'whyImportant', business: 'whyVisit' },
  '🗺': { showplace: 'structure' },
  '🎫': { showplace: 'tickets' },
  '⏱': { showplace: 'timeAllocation', business: 'service' },
  '📸': { showplace: 'photoSpots', business: 'photoTips' },
  '💡': { showplace: 'practicalTips', business: 'nuances' },
  '🏛': { showplace: 'history' },
  '🎯': { showplace: 'nearby', business: 'whyVisit' },
  '🍽': { business: 'mustTry' },
  '💰': { business: 'prices' },
  '🚶': { business: 'howToGet' },
  '🌐': { business: 'service' },
  '📌': { business: 'nuances' },
  '🌱': { business: 'localValue' },
  '📷': { business: 'photoTips' },
  '🙏': { showplace: 'practicalTips' },
  '🚣': { showplace: 'practicalTips' },
  '🎠': { showplace: 'structure' },
  '🏖': { showplace: 'structure' },
  '🤿': { showplace: 'practicalTips' },
  '🍜': { business: 'mustTry' },
  '🎭': { business: 'service' },
  '🍤': { business: 'mustTry' },
  '🍖': { business: 'mustTry' },
  '🍯': { business: 'mustTry' },
  '🍲': { business: 'mustTry' },
  '🍰': { business: 'mustTry' },
  '🦀': { business: 'mustTry' },
  '🥤': { business: 'mustTry' },
  '🍋': { business: 'mustTry' },
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

function normalizeCityName(raw: string): string {
  return raw.split('(')[0]?.trim() ?? raw.trim();
}

function detectKind(title: string | null): PlaceKind | null {
  if (!title) return null;
  const t = title.toLowerCase();
  if (t.includes('достопримечатель')) return 'showplace';
  if (t.includes('коммерчес')) return 'business';
  return null;
}

function extractShortDescription(fullText: string | null): string | null {
  if (!fullText) return null;
  // Take first 2-3 sentences (up to 500 chars per UI/DTO requirement)
  const sentences = fullText.match(/[^.!?]+[.!?]+/g) ?? [];
  if (sentences.length === 0) {
    // Fallback: take first 500 chars
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

// Parse place from new format:
// ### Name
// lat, lng
// description...
// • bullets...
function createPlaceFromHeader(name: string, cityName: string, kind: PlaceKind, cityRefMap: Record<string, string>): PlaceSeed {
  const defaultCategory = kind === 'showplace' ? 'Достопримечательность' : kind === 'business' ? 'Заведение' : null;
  const nameSlug = slugify(name.trim());
  // Generate globally unique slug: {city_id}-{name-slug}
  // This ensures no conflicts when scaling to other countries
  const cityId = cityRefMap[cityName];
  const uniqueSlug = cityId ? `${cityId}-${nameSlug}` : nameSlug;
  return {
    cityName,
    kind,
    name: name.trim(),
    slug: uniqueSlug,
    descriptionShort: null,
    lat: null,
    lng: null,
    address: null,
    tags: [],
    category: defaultCategory,
    website: null,
    phone: null,
    instagram: null,
    googleMapsUrl: null,
    priceLevel: null,
    workingHours: null,
    sections: new Map(),
  };
}

function detectSectionKey(bullet: string, kind: PlaceKind): string | null {
  // Check emoji at start
  const emojiMatch = bullet.match(/^([\p{Extended_Pictographic}])/u);
  if (emojiMatch) {
    const emoji = emojiMatch[1];
    const mapping = EMOJI_TO_SECTION[emoji];
    if (mapping) {
      const key = kind === 'showplace' ? mapping.showplace : mapping.business;
      if (key) return key;
    }
  }

  // Check text patterns
  const lower = bullet.toLowerCase();
  if (kind === 'showplace') {
    if (lower.includes('почему это важно') || lower.includes('почему важно')) return 'whyImportant';
    if (lower.includes('структура') || lower.includes('что внутри') || lower.includes('что посмотреть')) return 'structure';
    if (lower.includes('билет') || lower.includes('посещение')) return 'tickets';
    if (lower.includes('сколько времени') || lower.includes('время заложить')) return 'timeAllocation';
    if (lower.includes('фото') || lower.includes('сфотографировать')) return 'photoSpots';
    if (lower.includes('совет') || lower.includes('практическ')) return 'practicalTips';
    if (lower.includes('истори') || lower.includes('справка')) return 'history';
    if (lower.includes('рядом') || lower.includes('посмотреть рядом')) return 'nearby';
    if (lower.includes('интересный факт') || lower.includes('факт')) return 'interestingFact';
  } else {
    if (lower.includes('почему') || lower.includes('зайти')) return 'whyVisit';
    if (lower.includes('попробовать') || lower.includes('что попробовать') || lower.includes('что заказать')) return 'mustTry';
    if (lower.includes('цена') || lower.includes('стоимость')) return 'prices';
    if (lower.includes('добраться') || lower.includes('как добраться')) return 'howToGet';
    if (lower.includes('сервис') || lower.includes('коммуникация') || lower.includes('язык') || lower.includes('wi-fi')) return 'service';
    if (lower.includes('нюанс') || lower.includes('совет') || lower.includes('важно')) return 'nuances';
    if (lower.includes('ценность') || lower.includes('локальн') || lower.includes('контекст')) return 'localValue';
    if (lower.includes('фото') || lower.includes('сфотографировать')) return 'photoTips';
  }

  return null;
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
  let currentKind: PlaceKind | null = null;
  let currentItem: PlaceSeed | null = null;
  let currentSection: string | null = null;
  let descriptionBuffer: string[] = [];
  let expectingCoords = false;
  let expectingDescription = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';
    const trimmed = line.trim();

    // City header: # City Name
    if (trimmed.startsWith('# ') && !trimmed.startsWith('##') && !trimmed.startsWith('###')) {
      // Finalize previous place if exists
      if (currentItem) {
        if (descriptionBuffer.length > 0) {
          const fullDescription = descriptionBuffer.join(' ').trim();
          currentItem.descriptionShort = extractShortDescription(fullDescription);
          descriptionBuffer = [];
        }
        if (expectingCoords && !currentItem.lat && !currentItem.lng) {
          summary.missingCoords.push(currentItem.slug);
          // eslint-disable-next-line no-console
          console.warn(`  Coords missing for ${currentItem.slug} (${currentItem.name})`);
        }
        if (!currentItem.descriptionShort || currentItem.descriptionShort.length === 0) {
          summary.missingDescription.push(currentItem.slug);
        }
        summary.totalPlaces++;
      }
      currentCity = normalizeCityName(trimmed.replace(/^#\s+/, ''));
      currentKind = null;
      currentItem = null;
      currentSection = null;
      expectingCoords = false;
      expectingDescription = false;
      continue;
    }

    // Section header: ## Достопримечательности / Коммерческие заведения
    if (trimmed.startsWith('## ') && !trimmed.startsWith('###')) {
      // Finalize previous place if exists
      if (currentItem) {
        if (descriptionBuffer.length > 0) {
          const fullDescription = descriptionBuffer.join(' ').trim();
          currentItem.descriptionShort = extractShortDescription(fullDescription);
          descriptionBuffer = [];
        }
        if (expectingCoords && !currentItem.lat && !currentItem.lng) {
          summary.missingCoords.push(currentItem.slug);
          // eslint-disable-next-line no-console
          console.warn(`  Coords missing for ${currentItem.slug} (${currentItem.name})`);
        }
        if (!currentItem.descriptionShort || currentItem.descriptionShort.length === 0) {
          summary.missingDescription.push(currentItem.slug);
        }
        summary.totalPlaces++;
      }
      currentKind = detectKind(trimmed.replace(/^##\s+/, '').trim());
      currentItem = null;
      currentSection = null;
      expectingCoords = false;
      expectingDescription = false;
      continue;
    }

    if (!currentCity || !currentKind) continue;

    // Place header: ### Name
    if (trimmed.startsWith('### ')) {
      // Finalize previous place if exists
      if (currentItem) {
        // Save description if we were collecting it
        if (descriptionBuffer.length > 0) {
          const fullDescription = descriptionBuffer.join(' ').trim();
          currentItem.descriptionShort = extractShortDescription(fullDescription);
          descriptionBuffer = [];
        }
        // Check if coords missing
        if (expectingCoords && !currentItem.lat && !currentItem.lng) {
          summary.missingCoords.push(currentItem.slug);
          // eslint-disable-next-line no-console
          console.warn(`  Coords missing for ${currentItem.slug} (${currentItem.name})`);
        }
        // Check if description missing
        if (!currentItem.descriptionShort || currentItem.descriptionShort.length === 0) {
          summary.missingDescription.push(currentItem.slug);
        }
        summary.totalPlaces++;
      }
      // Start new place
      const placeName = trimmed.replace(/^###\s+/, '').trim();
      currentItem = createPlaceFromHeader(placeName, currentCity, currentKind, cityRefMap);
      places.push(currentItem);
      currentSection = null;
      expectingCoords = true;
      expectingDescription = false;
      descriptionBuffer = [];
      continue;
    }

    if (!currentItem) continue;

    // Coordinates line: lat, lng (supports integers, negatives, spaces)
    if (expectingCoords) {
      const coordsMatch = trimmed.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
      if (coordsMatch) {
        currentItem.lat = coordsMatch[1] ?? null;
        currentItem.lng = coordsMatch[2] ?? null;
        expectingCoords = false;
        expectingDescription = true;
        continue;
      } else if (trimmed.length > 0 && !trimmed.startsWith('•')) {
        // No coordinates found, treat as description start
        expectingCoords = false;
        expectingDescription = true;
        descriptionBuffer.push(trimmed);
        continue;
      }
    }

    // Description lines (until first bullet point)
    if (expectingDescription && !trimmed.startsWith('•')) {
      if (trimmed.length > 0) {
        descriptionBuffer.push(trimmed);
      }
      continue;
    }

    // Bullet points (metadata extraction + section content)
    if (trimmed.startsWith('•')) {
      // Save description if we were collecting it
      if (expectingDescription && descriptionBuffer.length > 0) {
        const fullDescription = descriptionBuffer.join(' ').trim();
        currentItem.descriptionShort = extractShortDescription(fullDescription);
        descriptionBuffer = [];
        expectingDescription = false;
      }

      const bullet = trimmed.replace(/^•\s*/, '').trim();
      const lower = bullet.toLowerCase();

      // Extract metadata fields
      if (lower.includes('инстаграм') || lower.includes('instagram')) {
        const handle = bullet.match(/@[\w._-]+/)?.[0] ?? null;
        if (handle) currentItem.instagram = handle;
        continue;
      }

      if (lower.includes('сайт') || lower.includes('website') || (lower.includes('🌐') && !lower.includes('google'))) {
        const urlMatch = bullet.match(/https?:\/\/[^\s]+/);
        if (urlMatch) {
          currentItem.website = urlMatch[0] ?? null;
        }
        continue;
      }

      if (lower.includes('телефон') || lower.includes('phone') || (lower.includes('📱') && !lower.includes('инстаграм'))) {
        const phoneMatch = bullet.match(/[\d+()\-–\s]{6,}/);
        if (phoneMatch) {
          currentItem.phone = phoneMatch[0]?.trim() ?? null;
        }
        continue;
      }

      if (lower.includes('карта') || (lower.includes('maps') && lower.includes('google'))) {
        const urlMatch = bullet.match(/https?:\/\/[^\s]+/);
        if (urlMatch) {
          currentItem.googleMapsUrl = urlMatch[0] ?? null;
        }
        continue;
      }

      if (lower.includes('уровень цен') || lower.includes('цены') || lower.includes('💰')) {
        const priceMatch = bullet.split(':').slice(1).join(':').trim();
        if (priceMatch && priceMatch.length < 200) {
          currentItem.priceLevel = priceMatch;
        }
        // Also add to sections if it's a business
        if (currentItem.kind === 'business') {
          const existing = currentItem.sections.get('prices') ?? '';
          currentItem.sections.set('prices', existing ? `${existing}\n\n${bullet}` : bullet);
        }
        continue;
      }

      if (lower.includes('часы работы') || (lower.includes('⏰') && lower.includes('часы'))) {
        const hoursMatch = bullet.split(':').slice(1).join(':').trim();
        if (hoursMatch && hoursMatch.length < 200) {
          currentItem.workingHours = hoursMatch;
        }
        continue;
      }

      // Detect section key
      const sectionKey = detectSectionKey(bullet, currentItem.kind);
      if (sectionKey) {
        currentSection = sectionKey;
        const existing = currentItem.sections.get(sectionKey) ?? '';
        currentItem.sections.set(sectionKey, existing ? `${existing}\n\n${bullet}` : bullet);
      } else if (currentSection) {
        // Continue current section
        const existing = currentItem.sections.get(currentSection) ?? '';
        currentItem.sections.set(currentSection, existing ? `${existing}\n\n${bullet}` : bullet);
      } else {
        // Generic tag (if no colon, treat as tag)
        if (!lower.includes(':')) {
          const label = bullet.replace(/[•\u2022\p{Extended_Pictographic}]/gu, '').trim();
          if (label && label.length < 50) {
            currentItem.tags.push(label);
          }
        }
      }
      continue;
    }
  }

  // Finalize last place if exists
  if (currentItem) {
    if (descriptionBuffer.length > 0) {
      const fullDescription = descriptionBuffer.join(' ').trim();
      currentItem.descriptionShort = extractShortDescription(fullDescription);
    }
    // Check if coords missing
    if (expectingCoords && !currentItem.lat && !currentItem.lng) {
      summary.missingCoords.push(currentItem.slug);
      // eslint-disable-next-line no-console
      console.warn(`  Coords missing for ${currentItem.slug} (${currentItem.name})`);
    }
    // Check if description missing
    if (!currentItem.descriptionShort || currentItem.descriptionShort.length === 0) {
      summary.missingDescription.push(currentItem.slug);
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

async function upsertPlaceContentBlocks(
  db: ReturnType<typeof createDb>,
  placeId: string,
  sections: Map<string, string>
): Promise<number> {
  if (sections.size === 0) return 0;

  // Build markdown from all sections
  const markdownParts: string[] = [];
  for (const [key, content] of sections.entries()) {
    // Add section header based on key
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

async function main() {
  // eslint-disable-next-line no-console
  console.warn(
    '[LEGACY] seedAtlasPlacesPhilippines.ts: для Atlas import pipeline v1 используйте `pnpm -C packages/db db:export:places-neon` (exportPlacesToNeon.ts).'
  );
  const db = createDb(getDatabaseUrl());
  const repoRoot = join(process.cwd(), '..', '..');
  const baseDir = join(repoRoot, 'content', 'atlas', 'philippines');
  const markdown = readFileSync(join(baseDir, 'Philippines-places.md'), 'utf-8');

  const countryId = await resolveCountryId(db, 'ph');
  if (!countryId) throw new Error('Country not found for seed: ph');

  const cityRefMap: Record<string, string> = {
    Манила: 'mnl',
    Себу: 'ceb',
    Палаван: 'pps',
    Бохоль: 'tag',
    Сиаргао: 'srg',
    Думагете: 'dumaguete',
    Боракай: 'boracay',
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
      // slug already contains city_id prefix (e.g., "mnl-intramuros")
      // so placeId = slug (they are the same for global uniqueness)
      const placeId = p.slug;
      rows.push({
        id: placeId,
        countryId,
        cityId,
        name: p.name,
        slug: p.slug,
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

    // Upsert content blocks
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
