/**
 * Export Places from Atlas Content Canon v1 markdown files to Neon Postgres
 * 
 * Generates:
 * - SQL UPSERT statements (places.sql)
 * - CSV files (places.csv, content_blocks.csv)
 * 
 * Usage:
 *   pnpm -C packages/db tsx src/exportPlacesToNeon.ts
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

// ============================================================================
// Types
// ============================================================================

interface ParsedPlace {
  name: string;
  slug: string;
  placeKind: 'showplace' | 'business';
  cityName: string;
  countryId: string; // ph | vn | ...
  countryCode: string; // PH | VN | ...
  coords: { lat: number; lng: number } | null;
  descriptionShort: string;
  address: string | null;
  website: string | null;
  phone: string | null;
  instagram: string | null;
  googleMapsUrl: string | null;
  priceLevel: string | null;
  category: string | null;
  tags: string[];
  sections: Map<string, string>; // sectionKey -> markdown content
  metadata: {
    source?: string;
    status?: string;
  };
}

type ParseIssueCode =
  | 'PARSE_SKIP_MISSING_TYPE'
  | 'PARSE_MISSING_COORDS'
  | 'PARSE_MISSING_TAGS'
  | 'PARSE_MISSING_DESCRIPTION'
  | 'PARSE_UNKNOWN_SECTION_TITLE'
  | 'PARSE_EMPTY_OVERVIEW';

type ParseIssue = {
  code: ParseIssueCode;
  placeName?: string;
  slug?: string;
  cityName?: string;
  details?: string;
};

type ParsePlaceResult = {
  places: ParsedPlace[];
  issues: ParseIssue[];
};

type CountryConfig = {
  countryId: string;
  countryCode: string;
  cityIdMap: Record<string, string>;
  normalizeCityName?: (cityName: string) => string;
};

// ============================================================================
// City ID Mapping
// ============================================================================

const CITY_ID_MAP_PH: Record<string, string> = {
  Manila: 'mnl',
  Cebu: 'ceb',
  Palawan: 'pps',
  Bohol: 'tag',
  Siargao: 'srg',
  Dumaguete: 'dumaguete',
  Boracay: 'boracay',
};

// Vietnam (aligned with existing project conventions / mocks)
const CITY_ID_MAP_VN: Record<string, string> = {
  Hue: 'hue',
  'Hoi An': 'hoi',
  'Da Nang': 'dad',
  Dalat: 'dla',
  'Nha Trang': 'ntr',
  'Phu Quoc': 'phu',
  Hanoi: 'han',
  'Ho Chi Minh City': 'sgn',
};

// Thailand (MVP city_id mapping)
const CITY_ID_MAP_TH: Record<string, string> = {
  Bangkok: 'bkk',
  'Chiang Mai': 'cnx',
  Phuket: 'phk',
  Pattaya: 'pty',
  Krabi: 'kbi',
  'Koh Samui': 'usm',
  'Hua Hin': 'hhn',
  Ayutthaya: 'aya',
};

// Laos (city_id mapping)
const CITY_ID_MAP_LA: Record<string, string> = {
  'Luang Prabang': 'lpq',
  Vientiane: 'vte',
  'Vang Vieng': 'vvg',
  Pakse: 'pkz',
  Savannakhet: 'svk',
};

// Malaysia (city_id mapping)
const CITY_ID_MAP_MY: Record<string, string> = {
  'Kuala Lumpur': 'kll',
  'Penang': 'png',
  'George Town': 'png', // Penang and George Town share the same city_id
  Langkawi: 'lgk',
  Melaka: 'mkz',
  'Kota Kinabalu': 'bki',
};

// Indonesia (city_id mapping)
const CITY_ID_MAP_ID: Record<string, string> = {
  Bali: 'bali',
  Jakarta: 'jkt',
  Yogyakarta: 'yog',
  'Labuan Bajo': 'lbj',
  Lombok: 'lom',
};

// Singapore (city_id mapping)
const CITY_ID_MAP_SG: Record<string, string> = {
  Singapore: 'sgp',
};

// Japan (city_id mapping)
const CITY_ID_MAP_JP: Record<string, string> = {
  Tokyo: 'tok',
  Osaka: 'osa',
  Fukuoka: 'fuk',
};

// South Korea (city_id mapping)
const CITY_ID_MAP_KR: Record<string, string> = {
  Seoul: 'seo',
  Busan: 'pus',
  Jeju: 'cju',
};

// ============================================================================
// Section Key Mapping (Atlas Content Canon v1)
// ============================================================================

const SECTION_KEY_MAP: Record<string, string> = {
  // showplace
  '🟡 Почему стоит посетить': 'whyImportant',
  '🟡 Почему это важно': 'whyImportant',
  '🔵 Что обязательно посмотреть': 'structure',
  '🟢 Билеты и посещение': 'tickets',
  '🟢 Цены и вход': 'tickets',
  '⏱️ Сколько времени заложить': 'timeAllocation',
  '⏱️ Сколько времени заложить?': 'timeAllocation',
  '🟣 Практические советы': 'practicalTips',
  '🟢 Историческая справка': 'history',
  '🟢 Что посмотреть рядом': 'nearby',
  '🟡 Интересный факт': 'interestingFact',
  '🔵 Лучшие точки для фото': 'photoSpots',
  '🔵 Что стоит сфотографировать': 'photoSpots',

  // business
  '🟡 Почему стоит зайти': 'whyVisit',
  '🔵 Что обязательно попробовать': 'mustTry',
  '🟢 Цены и чек': 'prices',
  '🟠 Как добраться': 'howToGet',
  '🟣 Коммуникация & сервис': 'service',
  '🔷 Инфраструктура и сервис': 'service',
  '🔷 Сервис и комфорт': 'service',
  '🟣 Полезные нюансы': 'nuances',
  '🟢 Локальная ценность': 'localValue',
  '📍 Практическая информация': 'practicalInfo',
};

const SECTION_TITLES: Record<string, string> = {
  // showplace
  whyImportant: 'Почему это важно?',
  structure: 'Структура комплекса',
  tickets: 'Билеты и посещение',
  timeAllocation: 'Сколько времени заложить?',
  photoSpots: 'Лучшие точки для фото',
  practicalTips: 'Практические советы',
  history: 'Историческая справка',
  nearby: 'Что посмотреть рядом',
  interestingFact: 'Интересный факт',
  practicalInfo: 'Практическая информация',
  // business
  whyVisit: 'Почему стоит зайти?',
  mustTry: 'Что попробовать обязательно',
  prices: 'Цены',
  howToGet: 'Как добраться',
  service: 'Коммуникация & сервис',
  nuances: 'Полезные нюансы',
  localValue: 'Локальная ценность',
};

const SECTION_ORDER: Record<'showplace' | 'business', string[]> = {
  showplace: [
    'whyImportant',
    'structure',
    'tickets',
    'timeAllocation',
    'photoSpots',
    'practicalTips',
    'history',
    'nearby',
    'interestingFact',
    'practicalInfo',
  ],
  business: ['whyVisit', 'mustTry', 'prices', 'howToGet', 'service', 'nuances', 'localValue', 'photoSpots', 'practicalInfo'],
};

// ============================================================================
// Parsing Functions
// ============================================================================

function translitCyrillic(input: string): string {
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

function slugify(text: string): string {
  // Normalize accents (Vietnamese, etc) + transliterate Cyrillic to ASCII
  const ascii = translitCyrillic(text)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '');

  return ascii
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ') // drop leftovers to spaces
    .replace(/\s+/g, '-') // Replace spaces with dash
    .replace(/-+/g, '-') // Collapse multiple dashes
    .replace(/^-+|-+$/g, '') // Remove leading/trailing dashes
    .trim();
}

function parseCoords(text: string): { lat: number; lng: number } | null {
  const match = text.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
  if (!match) return null;
  return {
    lat: parseFloat(match[1]),
    lng: parseFloat(match[2]),
  };
}

function extractMetadata(line: string): Record<string, string> {
  const metadata: Record<string, string> = {};
  const typeMatch = line.match(/\*\*type:\*\*\s*(\w+)/i);
  const categoryMatch = line.match(/\*\*category:\*\*\s*([^\s].+?)\s*$/i);
  const sourceMatch = line.match(/\*\*source:\*\*\s*(\w+)/i);
  const statusMatch = line.match(/\*\*status:\*\*\s*(\w+)/i);
  if (typeMatch) metadata.type = typeMatch[1];
  if (categoryMatch) metadata.category = categoryMatch[1];
  if (sourceMatch) metadata.source = sourceMatch[1];
  if (statusMatch) metadata.status = statusMatch[1];
  return metadata;
}

function parsePlaceMarkdown(
  content: string,
  opts: { cityName: string; countryId: string; countryCode: string; cityIdMap: Record<string, string> },
): ParsePlaceResult {
  const places: ParsedPlace[] = [];
  const issues: ParseIssue[] = [];
  const lines = content.split('\n');
  
  let currentPlace: Partial<ParsedPlace> | null = null;
  let currentSection: string | null = null;
  let currentRawSectionTitle: string | null = null;
  let descriptionBuffer: string[] = [];
  let sectionBuffer: string[] = [];
  let inMetadata = false;
  let inPracticalInfo = false;
  const cityName = opts.cityName;
  const cityIdMap = opts.cityIdMap;
  const countryId = opts.countryId;
  const countryCode = opts.countryCode;
  
  const finalizePlace = () => {
    if (!currentPlace) return;

    // finalize description
    const fullDescription = descriptionBuffer.join(' ').trim();
    if (fullDescription.length > 0) {
      if (fullDescription.length > 500) {
        console.warn(`Description for "${currentPlace.name}" exceeds 500 chars (${fullDescription.length}), truncating`);
      }
      currentPlace.descriptionShort = fullDescription.substring(0, 500);
    } else {
      issues.push({
        code: 'PARSE_MISSING_DESCRIPTION',
        placeName: currentPlace.name,
        slug: currentPlace.slug,
        cityName: currentPlace.cityName,
      });
    }

    // finalize last open section
    if (currentSection && sectionBuffer.length > 0) {
      const body = sectionBuffer.join('\n').trimEnd();
      if (body.trim().length > 0) {
        if (currentSection === '__raw__' && currentRawSectionTitle) {
          currentPlace.sections?.set(`raw:${currentRawSectionTitle}`, `## ${currentRawSectionTitle}\n\n${body}`);
        } else {
          currentPlace.sections?.set(currentSection, body);
        }
      }
    }

    // base field checks (non-fatal here; export will still proceed)
    if (!currentPlace.coords) {
      issues.push({
        code: 'PARSE_MISSING_COORDS',
        placeName: currentPlace.name,
        slug: currentPlace.slug,
        cityName: currentPlace.cityName,
      });
    }
    if (!currentPlace.tags || currentPlace.tags.length === 0) {
      issues.push({
        code: 'PARSE_MISSING_TAGS',
        placeName: currentPlace.name,
        slug: currentPlace.slug,
        cityName: currentPlace.cityName,
      });
    }

    if (currentPlace.name && currentPlace.placeKind) {
      // Set default category if missing
      if (!currentPlace.category && currentPlace.tags && currentPlace.tags.length > 0) {
        currentPlace.category = currentPlace.tags[0];
      }
      places.push(currentPlace as ParsedPlace);
    } else {
      issues.push({
        code: 'PARSE_SKIP_MISSING_TYPE',
        placeName: currentPlace.name,
        slug: currentPlace.slug,
        cityName: currentPlace.cityName,
        details: `Missing placeKind for parsed place; place skipped from export.`,
      });
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i]; // Keep original for markdown formatting
    const line = rawLine.trim();
    
    // Place header: ## Name
    if (line.startsWith('## ') && !line.startsWith('###')) {
      // Skip table of contents header inside a city file
      if (line.toLowerCase().includes('оглавление') || line.includes('📚')) {
        continue;
      }
      // Finalize previous place (strictly: no silent skip; issues collected)
      finalizePlace();
      
      // Start new place
      const nameMatch = line.match(/^##\s+(.+?)(?:\s*\(|$)/);
      if (nameMatch) {
        const name = nameMatch[1].trim();
        const cityId = cityIdMap[cityName];
        // Generate globally unique slug: {city_id}-{name-slug}
        // This ensures no conflicts when scaling to other countries
        const nameSlug = slugify(name);
        const uniqueSlug = cityId ? `${cityId}-${nameSlug}` : nameSlug;
        currentPlace = {
          name,
          slug: uniqueSlug,
          cityName,
          countryId,
          countryCode,
          descriptionShort: '',
          tags: [],
          sections: new Map(),
          metadata: {},
          coords: null,
          address: null,
          website: null,
          phone: null,
          instagram: null,
          googleMapsUrl: null,
          priceLevel: null,
          category: null,
        };
        descriptionBuffer = [];
        sectionBuffer = [];
        currentSection = null;
        currentRawSectionTitle = null;
        inMetadata = false;
        inPracticalInfo = false;
      }
      continue;
    }
    
    // Coordinates: **Координаты:** lat, lng (with markdown formatting)
    // Check both trimmed and raw line for coordinates
    if ((line.includes('Координаты') || rawLine.includes('Координаты')) && currentPlace) {
      // Match coordinates: look for pattern "число, число" after "Координаты"
      // Handle both "**Координаты:** 14.5915, 120.9736" and "Координаты: 14.5915, 120.9736"
      const coordsPattern = /(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/;
      const coordsMatch = rawLine.match(coordsPattern) || line.match(coordsPattern);
      if (coordsMatch && coordsMatch.length >= 3) {
        currentPlace.coords = parseCoords(`${coordsMatch[1]}, ${coordsMatch[2]}`);
      }
      continue;
    }
    
    // Section header: ### 🟡 Почему стоит посетить
    if (line.startsWith('### ')) {
      const sectionTitle = line.replace(/^###\s+/, '').trim();
      
      // Save previous section
      if (currentSection && currentPlace && sectionBuffer.length > 0) {
        if (!currentPlace.sections) currentPlace.sections = new Map();
        const body = sectionBuffer.join('\n').trimEnd();
        if (body.trim().length > 0) {
          if (currentSection === '__raw__' && currentRawSectionTitle) {
            currentPlace.sections.set(`raw:${currentRawSectionTitle}`, `## ${currentRawSectionTitle}\n\n${body}`);
          } else {
            currentPlace.sections.set(currentSection, body);
          }
        }
      }
      sectionBuffer = [];
      
      // Check for practical info section
      if (sectionTitle.includes('Практическая информация')) {
        inPracticalInfo = true;
        currentSection = 'practicalInfo';
        currentRawSectionTitle = null;
        continue;
      }
      
      // Check for metadata section
      if (sectionTitle.includes('Метаданные')) {
        inMetadata = true;
        inPracticalInfo = false;
        currentSection = null;
        currentRawSectionTitle = null;
        continue;
      }
      
      // Regular section
      const sectionKey = SECTION_KEY_MAP[sectionTitle];
      if (sectionKey && currentPlace) {
        currentSection = sectionKey;
        inPracticalInfo = false;
        currentRawSectionTitle = null;
      } else {
        // Preserve unknown sections to avoid data loss (A3)
        if (currentPlace) {
          issues.push({
            code: 'PARSE_UNKNOWN_SECTION_TITLE',
            placeName: currentPlace.name,
            slug: currentPlace.slug,
            cityName: currentPlace.cityName,
            details: sectionTitle,
          });
        }
        currentSection = '__raw__';
        currentRawSectionTitle = sectionTitle;
        inPracticalInfo = false;
      }
      continue;
    }
    
    // Practical info parsing (extract address, website, etc.)
    if (inPracticalInfo && currentPlace && line) {
      const addressMatch = line.match(/\*\*Адрес:\*\*\s*(.+)/i);
      if (addressMatch) {
        currentPlace.address = addressMatch[1].trim();
        sectionBuffer.push(rawLine);
        continue;
      }
      
      const websiteMatch = line.match(/\*\*Сайт:\*\*\s*\[([^\]]+)\]\(([^)]+)\)/i);
      if (websiteMatch) {
        currentPlace.website = websiteMatch[2].trim();
        sectionBuffer.push(rawLine);
        continue;
      }
      
      const websiteMatch2 = line.match(/\*\*Сайт:\*\*\s*([^\s]+)/i);
      if (websiteMatch2 && !currentPlace.website) {
        currentPlace.website = websiteMatch2[1].trim();
        sectionBuffer.push(rawLine);
        continue;
      }
      
      const phoneMatch = line.match(/\*\*Контакты:\*\*\s*(.+)/i);
      if (phoneMatch) {
        currentPlace.phone = phoneMatch[1].trim();
        sectionBuffer.push(rawLine);
        continue;
      }
      
      // Store practical info content
      if (line && !line.startsWith('---')) {
        sectionBuffer.push(rawLine);
      }
      continue;
    }
    
    // Metadata parsing
    if (inMetadata && currentPlace && line) {
      if (!currentPlace.metadata) currentPlace.metadata = {};
      const metadata = extractMetadata(line);
      Object.assign(currentPlace.metadata, metadata);
      
      // Extract type
      const typeMatch = line.match(/\*\*type:\*\*\s*(\w+)/i);
      if (typeMatch) {
        currentPlace.placeKind = typeMatch[1] === 'showplace' ? 'showplace' : 'business';
      }

      // Extract category
      const categoryMatch = line.match(/\*\*category:\*\*\s*(.+)/i);
      if (categoryMatch) {
        currentPlace.category = categoryMatch[1].trim();
      }
      
      // Extract tags
      const tagsMatch = line.match(/\*\*tags:\*\*\s*(.+)/i);
      if (tagsMatch) {
        const tagsStr = tagsMatch[1].trim();
        currentPlace.tags = tagsStr.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
      }
      
      // Extract category from type or tags
      if (!currentPlace.tags) currentPlace.tags = [];
      if (!currentPlace.category && currentPlace.tags.length > 0) {
        // Use first tag as category fallback
        currentPlace.category = currentPlace.tags[0];
      }
      
      // End metadata section
      if (line.startsWith('---')) {
        inMetadata = false;
      }
      continue;
    }
    
    // Section content
    if (currentSection && currentPlace && line && !line.startsWith('---')) {
      sectionBuffer.push(rawLine);
      continue;
    }
    
    // Description (before first section, after coordinates)
    if (currentPlace && !currentSection && !inMetadata && !inPracticalInfo && line && !line.startsWith('---') && !line.startsWith('#')) {
      descriptionBuffer.push(line);
      continue;
    }
    
    // Reset flags on separator
    if (line.startsWith('---')) {
      if (inMetadata) inMetadata = false;
      if (inPracticalInfo) inPracticalInfo = false;
    }
  }
  
  // Finalize last place
  finalizePlace();

  // A3 guardrail: overview must not be empty if we have any sections at all
  for (const p of places) {
    if (!p.sections || p.sections.size === 0) {
      issues.push({
        code: 'PARSE_EMPTY_OVERVIEW',
        placeName: p.name,
        slug: p.slug,
        cityName: p.cityName,
      });
    }
  }

  return { places, issues };
}

// ============================================================================
// SQL Generation
// ============================================================================

function escapeSqlString(str: string | null | undefined): string {
  if (!str) return 'NULL';
  return `'${str.replace(/'/g, "''")}'`;
}

function escapeSqlJsonb(arr: string[] | null | undefined): string {
  if (!arr || arr.length === 0) return 'NULL';
  // JSON.stringify produces valid JSON, but we need to escape single quotes for SQL
  const jsonStr = JSON.stringify(arr);
  // Escape single quotes: ' -> ''
  const escaped = jsonStr.replace(/'/g, "''");
  return `'${escaped}'::jsonb`;
}

function generatePlaceId(_cityId: string, slug: string): string {
  // slug already contains city_id prefix (e.g., "mnl-intramuros")
  // so placeId = slug (they are the same for global uniqueness)
  return slug;
}

function generatePlacesSQL(
  places: ParsedPlace[],
  cityIdMap: Record<string, string>,
  countryId: string,
): { sql: string; issues: string[] } {
  const lines: string[] = [
    '-- Places UPSERT (idempotent)',
    '-- Generated from Atlas Content Canon v1 markdown files',
    '',
  ];
  const issues: string[] = [];
  
  for (const place of places) {
    const cityId = cityIdMap[place.cityName];
    if (!cityId) {
      issues.push(`SKIP_UNKNOWN_CITY: name="${place.name}" city="${place.cityName}" slug="${place.slug}"`);
      continue;
    }
    if (!place.placeKind) {
      issues.push(`SKIP_MISSING_TYPE: name="${place.name}" city="${place.cityName}" slug="${place.slug}"`);
      continue;
    }
    
    const placeId = generatePlaceId(cityId, place.slug);
    
    lines.push(`-- Place: ${place.name} (${place.cityName})`);
    lines.push(`INSERT INTO places (`);
    lines.push(`  id, country_id, city_id, name, slug, type, place_kind, category,`);
    lines.push(`  tags, description_short, lat, lng, address, website, phone,`);
    lines.push(`  instagram, google_maps_url, price_level, created_at, updated_at`);
    lines.push(`) VALUES (`);
    lines.push(`  ${escapeSqlString(placeId)},`);
    lines.push(`  ${escapeSqlString(countryId)},`);
    lines.push(`  ${escapeSqlString(cityId)},`);
    lines.push(`  ${escapeSqlString(place.name)},`);
    lines.push(`  ${escapeSqlString(place.slug)},`);
    lines.push(`  ${escapeSqlString(place.category || 'attraction')},`);
    lines.push(`  ${escapeSqlString(place.placeKind)},`);
    lines.push(`  ${escapeSqlString(place.category)},`);
    lines.push(`  ${escapeSqlJsonb(place.tags)},`);
    lines.push(`  ${escapeSqlString(place.descriptionShort)},`);
    lines.push(`  ${place.coords ? place.coords.lat : 'NULL'},`);
    lines.push(`  ${place.coords ? place.coords.lng : 'NULL'},`);
    lines.push(`  ${escapeSqlString(place.address)},`);
    lines.push(`  ${escapeSqlString(place.website)},`);
    lines.push(`  ${escapeSqlString(place.phone)},`);
    lines.push(`  ${escapeSqlString(place.instagram)},`);
    lines.push(`  ${escapeSqlString(place.googleMapsUrl)},`);
    lines.push(`  ${escapeSqlString(place.priceLevel)},`);
    lines.push(`  NOW(),`);
    lines.push(`  NOW()`);
    lines.push(`)`);
    lines.push(`ON CONFLICT (id) DO UPDATE SET`);
    lines.push(`  name = EXCLUDED.name,`);
    lines.push(`  slug = EXCLUDED.slug,`);
    lines.push(`  type = EXCLUDED.type,`);
    lines.push(`  place_kind = EXCLUDED.place_kind,`);
    lines.push(`  category = EXCLUDED.category,`);
    lines.push(`  tags = EXCLUDED.tags,`);
    lines.push(`  description_short = EXCLUDED.description_short,`);
    lines.push(`  lat = EXCLUDED.lat,`);
    lines.push(`  lng = EXCLUDED.lng,`);
    lines.push(`  address = EXCLUDED.address,`);
    lines.push(`  website = EXCLUDED.website,`);
    lines.push(`  phone = EXCLUDED.phone,`);
    lines.push(`  instagram = EXCLUDED.instagram,`);
    lines.push(`  google_maps_url = EXCLUDED.google_maps_url,`);
    lines.push(`  price_level = EXCLUDED.price_level,`);
    lines.push(`  updated_at = NOW();`);
    lines.push('');
  }
  
  return { sql: lines.join('\n'), issues };
}

function generateContentBlocksSQL(
  places: ParsedPlace[],
  cityIdMap: Record<string, string>,
): { sql: string; issues: string[] } {
  const lines: string[] = [
    '-- Content Blocks UPSERT (idempotent)',
    '-- Generated from Atlas Content Canon v1 markdown files',
    '',
  ];
  const issues: string[] = [];
  
  for (const place of places) {
    const cityId = cityIdMap[place.cityName];
    if (!cityId) {
      issues.push(`SKIP_CONTENT_UNKNOWN_CITY: name="${place.name}" city="${place.cityName}" slug="${place.slug}"`);
      continue;
    }
    if (!place.placeKind) {
      issues.push(`SKIP_CONTENT_MISSING_TYPE: name="${place.name}" city="${place.cityName}" slug="${place.slug}"`);
      continue;
    }
    
    const placeId = generatePlaceId(cityId, place.slug);
    
    // Build overview markdown from all sections
    const overviewParts: string[] = [];
    const order = SECTION_ORDER[place.placeKind] ?? [];
    const used = new Set<string>();
    for (const key of order) {
      const content = place.sections.get(key);
      if (content && content.trim().length > 0) {
        const sectionTitle = getSectionTitle(key);
        if (sectionTitle) {
          overviewParts.push(`## ${sectionTitle}`, '', content.trim(), '');
          used.add(key);
        }
      }
    }
    // Append remaining sections (in insertion order) to avoid data loss
    for (const [key, content] of place.sections.entries()) {
      if (used.has(key)) continue;
      if (!content || content.trim().length === 0) continue;
      const sectionTitle = getSectionTitle(key);
      if (sectionTitle) {
        overviewParts.push(`## ${sectionTitle}`, '', content.trim(), '');
      } else {
        overviewParts.push(content.trim(), '');
      }
    }
    
    if (overviewParts.length > 0) {
      const overviewMarkdown = overviewParts.join('\n');
      
      lines.push(`-- Content block for: ${place.name}`);
      lines.push(`INSERT INTO content_blocks (`);
      lines.push(`  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at`);
      lines.push(`) VALUES (`);
      lines.push(`  'place',`);
      lines.push(`  ${escapeSqlString(placeId)},`);
      lines.push(`  'overview',`);
      lines.push(`  'ru',`);
      lines.push(`  NULL,`);
      lines.push(`  ${escapeSqlString(overviewMarkdown)},`);
      lines.push(`  ${escapeSqlString(place.metadata.source ?? 'editorial')},`);
      lines.push(`  NOW(),`);
      lines.push(`  NOW()`);
      lines.push(`)`);
      lines.push(`ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET`);
      lines.push(`  body_markdown = EXCLUDED.body_markdown,`);
      lines.push(`  source = EXCLUDED.source,`);
      lines.push(`  updated_at = NOW();`);
      lines.push('');
    } else {
      issues.push(`EMPTY_OVERVIEW: name="${place.name}" slug="${place.slug}" kind="${place.placeKind}"`);
    }
  }
  
  return { sql: lines.join('\n'), issues };
}

function getSectionTitle(key: string): string | null {
  return SECTION_TITLES[key] ?? null;
}

// ============================================================================
// CSV Generation
// ============================================================================

function escapeCsvValue(value: string | null | undefined): string {
  if (!value) return '';
  // Escape quotes and wrap in quotes if contains comma, newline, or quote
  const escaped = value.replace(/"/g, '""');
  if (escaped.includes(',') || escaped.includes('\n') || escaped.includes('"')) {
    return `"${escaped}"`;
  }
  return escaped;
}

function generatePlacesCSV(
  places: ParsedPlace[],
  cityIdMap: Record<string, string>,
  countryId: string,
): { csv: string; issues: string[] } {
  const rows: string[] = [
    'id,country_id,city_id,name,slug,type,place_kind,category,tags,description_short,lat,lng,address,website,phone,instagram,google_maps_url,price_level',
  ];
  const issues: string[] = [];
  
  for (const place of places) {
    const cityId = cityIdMap[place.cityName];
    if (!cityId) {
      issues.push(`CSV_SKIP_UNKNOWN_CITY: name="${place.name}" city="${place.cityName}" slug="${place.slug}"`);
      continue;
    }
    if (!place.placeKind) {
      issues.push(`CSV_SKIP_MISSING_TYPE: name="${place.name}" city="${place.cityName}" slug="${place.slug}"`);
      continue;
    }
    
    const placeId = generatePlaceId(cityId, place.slug);
    const tagsJson = place.tags.length > 0 ? JSON.stringify(place.tags) : '';
    
    const row = [
      placeId,
      countryId,
      cityId,
      escapeCsvValue(place.name),
      escapeCsvValue(place.slug),
      escapeCsvValue(place.category || 'attraction'),
      escapeCsvValue(place.placeKind),
      escapeCsvValue(place.category),
      escapeCsvValue(tagsJson),
      escapeCsvValue(place.descriptionShort),
      place.coords ? place.coords.lat.toString() : '',
      place.coords ? place.coords.lng.toString() : '',
      escapeCsvValue(place.address),
      escapeCsvValue(place.website),
      escapeCsvValue(place.phone),
      escapeCsvValue(place.instagram),
      escapeCsvValue(place.googleMapsUrl),
      escapeCsvValue(place.priceLevel),
    ];
    
    rows.push(row.join(','));
  }
  
  return { csv: rows.join('\n'), issues };
}

function generateContentBlocksCSV(
  places: ParsedPlace[],
  cityIdMap: Record<string, string>,
): { csv: string; issues: string[] } {
  const rows: string[] = [
    'entity_type,entity_id,tab_key,lang,title,body_markdown,source',
  ];
  const issues: string[] = [];
  
  for (const place of places) {
    const cityId = cityIdMap[place.cityName];
    if (!cityId) {
      issues.push(`CSV_CB_SKIP_UNKNOWN_CITY: name="${place.name}" city="${place.cityName}" slug="${place.slug}"`);
      continue;
    }
    if (!place.placeKind) {
      issues.push(`CSV_CB_SKIP_MISSING_TYPE: name="${place.name}" city="${place.cityName}" slug="${place.slug}"`);
      continue;
    }
    
    const placeId = generatePlaceId(cityId, place.slug);
    
    // Build overview markdown
    const overviewParts: string[] = [];
    const order = SECTION_ORDER[place.placeKind] ?? [];
    const used = new Set<string>();
    for (const key of order) {
      const content = place.sections.get(key);
      if (content && content.trim().length > 0) {
        const sectionTitle = getSectionTitle(key);
        if (sectionTitle) {
          overviewParts.push(`## ${sectionTitle}`, '', content.trim(), '');
          used.add(key);
        }
      }
    }
    for (const [key, content] of place.sections.entries()) {
      if (used.has(key)) continue;
      if (!content || content.trim().length === 0) continue;
      const sectionTitle = getSectionTitle(key);
      if (sectionTitle) overviewParts.push(`## ${sectionTitle}`, '', content.trim(), '');
      else overviewParts.push(content.trim(), '');
    }
    
    if (overviewParts.length > 0) {
      const overviewMarkdown = overviewParts.join('\n');
      
      const row = [
        'place',
        escapeCsvValue(placeId),
        'overview',
        'ru',
        '',
        escapeCsvValue(overviewMarkdown),
        escapeCsvValue(place.metadata.source ?? 'editorial'),
      ];
      
      rows.push(row.join(','));
    } else {
      issues.push(`CSV_EMPTY_OVERVIEW: name="${place.name}" slug="${place.slug}" kind="${place.placeKind}"`);
    }
  }
  
  return { csv: rows.join('\n'), issues };
}

function formatIssues(title: string, issues: string[]): string {
  if (issues.length === 0) return `## ${title}\n\n- (нет)\n`;
  return `## ${title}\n\n${issues.map((x) => `- ${x}`).join('\n')}\n`;
}

function formatParseIssues(title: string, issues: ParseIssue[]): string {
  if (issues.length === 0) return `## ${title}\n\n- (нет)\n`;
  const lines = issues.map((i) => {
    const who = [i.slug, i.placeName, i.cityName].filter(Boolean).join(' | ');
    const tail = i.details ? ` — ${i.details}` : '';
    return `- ${i.code}${who ? ` — ${who}` : ''}${tail}`;
  });
  return `## ${title}\n\n${lines.join('\n')}\n`;
}

function stripLeadingFlagEmoji(raw: string): string {
  // Typical country flags are 2 "regional indicator symbol" codepoints.
  return raw.replace(/^[\u{1F1E6}-\u{1F1FF}]{2}\s+/u, '').trim();
}

function walkFiles(dir: string): string[] {
  const out: string[] = [];
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walkFiles(p));
    else out.push(p);
  }
  return out;
}

function isPlacesMarkdownFile(filePath: string): boolean {
  const lower = filePath.toLowerCase();
  return lower.endsWith('.md') && lower.includes('places');
}

function isExportablePlace(place: ParsedPlace): boolean {
  const hasDescription = typeof place.descriptionShort === 'string' && place.descriptionShort.trim().length > 0;
  return Boolean(place.placeKind) && Boolean(place.coords) && place.tags.length > 0 && hasDescription;
}

function parsePlacesFileByCityHeaders(filePath: string, cfg: CountryConfig): { places: ParsedPlace[]; cities: string[]; unknownCities: string[]; issues: ParseIssue[] } {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const cityStarts: number[] = [];
  const cityNames: string[] = [];
  const unknownCities: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = (lines[i] ?? '').trim();
    if (!line.startsWith('# ')) continue;
    // City header in canonical files: "# 🇱🇦 Vang Vieng (Ванг Виенг)"
    const raw = line.replace(/^#\s+/, '').trim();
    const withoutFlag = stripLeadingFlagEmoji(raw);
    let cityName = withoutFlag.split('(')[0]?.trim() ?? '';
    if (!cityName) continue;
    if (cfg.normalizeCityName) cityName = cfg.normalizeCityName(cityName);
    if (!cityName) continue;
    cityStarts.push(i);
    cityNames.push(cityName);
    if (!cfg.cityIdMap[cityName]) unknownCities.push(cityName);
  }

  const places: ParsedPlace[] = [];
  const issues: ParseIssue[] = [];
  for (let idx = 0; idx < cityStarts.length; idx++) {
    const start = cityStarts[idx]!;
    const end = idx + 1 < cityStarts.length ? cityStarts[idx + 1]! : lines.length;
    const cityName = cityNames[idx]!;
    const cityId = cfg.cityIdMap[cityName];
    if (!cityId) {
      // Keep behavior consistent with existing exports: skip unknown cities, but visible in report.
      continue;
    }
    const cityBlock = lines.slice(start + 1, end).join('\n'); // drop the "# ..." line
    const parsed = parsePlaceMarkdown(cityBlock, {
      cityName,
      countryId: cfg.countryId,
      countryCode: cfg.countryCode,
      cityIdMap: cfg.cityIdMap,
    });
    places.push(...parsed.places);
    issues.push(...parsed.issues);
  }

  return { places, cities: cityNames, unknownCities, issues };
}

function main() {
  const repoRoot = join(process.cwd(), '..', '..');
  const contentRoot = join(repoRoot, 'content', 'atlas');
  const exportRoot = join(repoRoot, 'exports', 'neon');
  mkdirSync(exportRoot, { recursive: true });

  // --------------------------------------------------------------------------
  // v1: Scan content/atlas/** for *places*.md (no "by memory" list)
  // --------------------------------------------------------------------------
  const onlyCountry = (process.env.ATLAS_EXPORT_ONLY_COUNTRY ?? '').trim().toLowerCase();
  const onlySlug = (process.env.ATLAS_EXPORT_ONLY_SLUG ?? '').trim().toLowerCase();

  const countryConfigs: Record<string, CountryConfig> = {
    vietnam: { countryId: 'vn', countryCode: 'VN', cityIdMap: CITY_ID_MAP_VN },
    thailand: { countryId: 'th', countryCode: 'TH', cityIdMap: CITY_ID_MAP_TH },
    laos: { countryId: 'la', countryCode: 'LA', cityIdMap: CITY_ID_MAP_LA },
    malaysia: {
      countryId: 'my',
      countryCode: 'MY',
      cityIdMap: CITY_ID_MAP_MY,
      normalizeCityName: (name) => (name.includes('Penang') ? 'Penang' : name),
    },
    indonesia: { countryId: 'id', countryCode: 'ID', cityIdMap: CITY_ID_MAP_ID },
    japan: { countryId: 'jp', countryCode: 'JP', cityIdMap: CITY_ID_MAP_JP },
    'south-korea': { countryId: 'kr', countryCode: 'KR', cityIdMap: CITY_ID_MAP_KR },
    singapore: { countryId: 'sg', countryCode: 'SG', cityIdMap: CITY_ID_MAP_SG },
    philippines: { countryId: 'ph', countryCode: 'PH', cityIdMap: CITY_ID_MAP_PH },
    cambodia: {
      countryId: 'kh',
      countryCode: 'KH',
      cityIdMap: {
        'Siem Reap': 'rep',
        'Phnom Penh': 'pnh',
        Battambang: 'bat',
        'Kampong Thom': 'kch',
        'Koh Kong': 'kra',
        Sihanoukville: 'kps',
        Kampot: 'kmp',
        Kep: 'kep',
      },
      normalizeCityName: (name) => {
        if (name === 'Cambodia Guide' || name.toLowerCase().includes('оглавление')) return '';
        if (name.includes('/')) return name.split('/')[0]?.trim() ?? name;
        return name;
      },
    },
  };

  const allFiles = walkFiles(contentRoot).filter(isPlacesMarkdownFile).sort();
  const inputFiles = allFiles.filter((p) => {
    if (!onlyCountry) return true;
    const folder = p.split(/[/\\]/).slice(-2)[0]?.toLowerCase() ?? '';
    const cfg = countryConfigs[folder];
    return folder === onlyCountry || cfg?.countryId === onlyCountry;
  });

  const summaryByCountry: Array<{ country: string; parsed: number; exported: number; skipped: number; issues: number }> = [];

  for (const filePath of inputFiles) {
    const parts = filePath.split(/[/\\]/);
    const countryFolder = (parts[parts.length - 2] ?? '').toLowerCase();
    const cfg = countryConfigs[countryFolder];
    if (!cfg) {
      console.warn(`SKIP_UNKNOWN_COUNTRY_FOLDER: ${countryFolder} (${filePath})`);
      continue;
    }

    const parsed = parsePlacesFileByCityHeaders(filePath, cfg);
    let places = parsed.places;
    let parseIssues = parsed.issues;

    if (onlySlug) {
      places = places.filter((p) => p.slug.toLowerCase() === onlySlug);
      // Pilot mode: keep only issues relevant to selected place(s)
      parseIssues = parseIssues.filter((i) => (i.slug ?? '').toLowerCase() === onlySlug);
    }

    const exportable = places.filter(isExportablePlace);
    const skipped = places.filter((p) => !isExportablePlace(p));

    const parseIssueCounts = parseIssues.reduce((acc, i) => {
      acc[i.code] = (acc[i.code] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const parseIssueCountsLines =
      Object.keys(parseIssueCounts).length > 0
        ? Object.entries(parseIssueCounts)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([code, count]) => `- ${code}: ${count}`)
            .join('\n')
        : '- (нет)';

    const exportDir = join(exportRoot, countryFolder);
    mkdirSync(exportDir, { recursive: true });

    const placesSql = generatePlacesSQL(exportable, cfg.cityIdMap, cfg.countryId);
    const blocksSql = generateContentBlocksSQL(exportable, cfg.cityIdMap);
    writeFileSync(join(exportDir, 'places.sql'), placesSql.sql, 'utf-8');
    writeFileSync(join(exportDir, 'content_blocks.sql'), blocksSql.sql, 'utf-8');

    const placesCsv = generatePlacesCSV(exportable, cfg.cityIdMap, cfg.countryId);
    const blocksCsv = generateContentBlocksCSV(exportable, cfg.cityIdMap);
    writeFileSync(join(exportDir, 'places.csv'), placesCsv.csv, 'utf-8');
    writeFileSync(join(exportDir, 'content_blocks.csv'), blocksCsv.csv, 'utf-8');

    const missingCoords = places.filter((p) => !p.coords).map((p) => `${p.slug} (${p.name})`);
    const skippedPlaces = skipped.map((p) => `${p.slug} (${p.name})`);

    const report = [
      `# ${countryFolder.toUpperCase()} Export Report`,
      ``,
      `**Generated:** ${new Date().toISOString()}`,
      `**Input file:** ${filePath}`,
      `**Cities in file:** ${parsed.cities.length}`,
      `**Places parsed:** ${places.length}`,
      `**Places exported:** ${exportable.length}`,
      `**Places skipped:** ${skipped.length}`,
      ``,
      `## Issue counts by type`,
      ``,
      parseIssueCountsLines,
      ``,
      formatParseIssues('Parse issues (A2/A3 guardrails)', parseIssues),
      formatIssues('Skipped places (missing kind/coords/tags/description)', skippedPlaces),
      formatIssues('SQL issues', placesSql.issues.concat(blocksSql.issues)),
      formatIssues('CSV issues', placesCsv.issues.concat(blocksCsv.issues)),
      formatIssues('Missing coords (blocked from export)', missingCoords),
      parsed.unknownCities.length > 0 ? formatIssues('Unknown cities (skipped)', parsed.unknownCities) : `## Unknown cities\n\n- (нет)\n`,
      ``,
      `## City ID mapping used`,
      ``,
      Object.entries(cfg.cityIdMap)
        .map(([name, id]) => `- ${name} -> \`${id}\``)
        .join('\n'),
      ``,
    ].join('\n');

    writeFileSync(join(exportDir, 'PARSE_REPORT.md'), report, 'utf-8');

    const readme = generateREADME({
      places: exportable,
      countryId: cfg.countryId,
      cityIdMap: cfg.cityIdMap,
      label: countryFolder[0]?.toUpperCase() + countryFolder.slice(1),
    });
    writeFileSync(join(exportDir, 'README.md'), readme, 'utf-8');

    console.log(`${countryFolder.toUpperCase()}: Generated: ${exportDir}/places.sql`);
    console.log(`${countryFolder.toUpperCase()}: Generated: ${exportDir}/content_blocks.sql`);
    console.log(`${countryFolder.toUpperCase()}: Generated: ${exportDir}/PARSE_REPORT.md`);

    summaryByCountry.push({
      country: countryFolder,
      parsed: places.length,
      exported: exportable.length,
      skipped: skipped.length,
      issues: parseIssues.length + placesSql.issues.length + blocksSql.issues.length,
    });
  }

  if (summaryByCountry.length > 0) {
    console.log('\n=== Atlas Export Summary (by country) ===');
    for (const s of summaryByCountry) {
      console.log(`${s.country}: parsed=${s.parsed} exported=${s.exported} skipped=${s.skipped} issues=${s.issues}`);
    }
  } else {
    console.warn('No input files found for export (check content/atlas/** and filters).');
  }
}

function generateREADME(params: {
  places: ParsedPlace[];
  countryId: string;
  cityIdMap: Record<string, string>;
  label: string;
}): string {
  const { places, countryId, cityIdMap, label } = params;
  const mappingLines = Object.entries(cityIdMap)
    .map(([name, id]) => `- ${name} → \`${id}\``)
    .join('\n');

  return `# Neon Postgres Export - Atlas Places (Content Canon v1)

## Overview

This directory contains exported data from Atlas Content Canon v1 markdown files for import into Neon Postgres.

**Generated:** ${new Date().toISOString()}  
**Country:** ${label} (\`${countryId}\`)  
**Total places:** ${places.length}

## Files

- \`places.sql\` - SQL UPSERT statements for places and content_blocks tables
- \`places.csv\` - CSV export for places table
- \`content_blocks.csv\` - CSV export for content_blocks table

## Import Instructions

### Option 1: SQL Import (Recommended)

Using Neon Console SQL Editor or psql:

\`\`\`bash
psql $DATABASE_URL < places.sql
\`\`\`

Or via Neon Console:
1. Open SQL Editor
2. Copy contents of \`places.sql\`
3. Execute

### Option 2: CSV Import

Using psql \\copy:

\`\`\`bash
psql $DATABASE_URL <<EOF
\\copy places FROM 'places.csv' WITH (FORMAT csv, HEADER true);
\\copy content_blocks FROM 'content_blocks.csv' WITH (FORMAT csv, HEADER true);
EOF
\`\`\`

**Note:** CSV import requires files to be accessible from the database server. For Neon, use SQL import or upload via Neon Console.

## Schema Notes

- \`places.slug\` is globally unique (conflict resolution via ON CONFLICT)
- \`places.id\` format: \`{city_id}-{slug}\`
- \`content_blocks.entity_id\` references \`places.id\`
- Coordinates stored in \`lat\`/\`lng\` columns (numeric precision 9,6)
- Tags stored as JSONB array

## City ID Mapping

${mappingLines}

## Validation

Before import, verify:
1. Country \`${countryId}\` exists in \`countries\` table
2. All city IDs exist in \`cities\` table
3. No duplicate slugs (SQL handles this via ON CONFLICT)

## Rollback

To remove imported data:

\`\`\`sql
DELETE FROM content_blocks
WHERE entity_type = 'place'
  AND entity_id IN (SELECT id FROM places WHERE country_id = '${countryId}');

DELETE FROM places
WHERE country_id = '${countryId}';
\`\`\`
`;
}

if (require.main === module) {
  main();
}
