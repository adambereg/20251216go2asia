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

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
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
  // business
  whyVisit: 'Почему стоит зайти?',
  mustTry: 'Что попробовать обязательно',
  prices: 'Цены',
  howToGet: 'Как добраться',
  service: 'Коммуникация & сервис',
  nuances: 'Полезные нюансы',
  localValue: 'Локальная ценность',
  practicalInfo: 'Практическая информация',
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
): ParsedPlace[] {
  const places: ParsedPlace[] = [];
  const lines = content.split('\n');
  
  let currentPlace: Partial<ParsedPlace> | null = null;
  let currentSection: string | null = null;
  let descriptionBuffer: string[] = [];
  let sectionBuffer: string[] = [];
  let inMetadata = false;
  let inPracticalInfo = false;
  const cityName = opts.cityName;
  const cityIdMap = opts.cityIdMap;
  const countryId = opts.countryId;
  const countryCode = opts.countryCode;
  
  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i]; // Keep original for markdown formatting
    const line = rawLine.trim();
    
    // Place header: ## Name
    if (line.startsWith('## ') && !line.startsWith('###')) {
      // Skip table of contents header inside a city file
      if (line.toLowerCase().includes('оглавление') || line.includes('📚')) {
        continue;
      }
      // Finalize previous place
      if (currentPlace) {
        if (descriptionBuffer.length > 0) {
          currentPlace.descriptionShort = descriptionBuffer.join(' ').substring(0, 500);
        }
        if (currentSection && sectionBuffer.length > 0) {
          currentPlace.sections.set(currentSection, sectionBuffer.join('\n'));
        }
        if (currentPlace.name && currentPlace.placeKind) {
          places.push(currentPlace as ParsedPlace);
        }
      }
      
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
        currentPlace.coords = {
          lat: parseFloat(coordsMatch[1]),
          lng: parseFloat(coordsMatch[2]),
        };
      }
      continue;
    }
    
    // Section header: ### 🟡 Почему стоит посетить
    if (line.startsWith('### ')) {
      const sectionTitle = line.replace(/^###\s+/, '').trim();
      
      // Save previous section
      if (currentSection && currentPlace && sectionBuffer.length > 0) {
        currentPlace.sections.set(currentSection, sectionBuffer.join('\n'));
      }
      sectionBuffer = [];
      
      // Check for practical info section
      if (sectionTitle.includes('Практическая информация')) {
        inPracticalInfo = true;
        currentSection = 'practicalInfo';
        continue;
      }
      
      // Check for metadata section
      if (sectionTitle.includes('Метаданные')) {
        inMetadata = true;
        inPracticalInfo = false;
        currentSection = null;
        continue;
      }
      
      // Regular section
      const sectionKey = SECTION_KEY_MAP[sectionTitle];
      if (sectionKey && currentPlace) {
        currentSection = sectionKey;
        inPracticalInfo = false;
      } else {
        currentSection = null;
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
        currentPlace.tags = tagsStr.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
      }
      
      // Extract category from type or tags
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
  if (currentPlace) {
    if (descriptionBuffer.length > 0) {
      const fullDescription = descriptionBuffer.join(' ').trim();
      if (fullDescription.length > 500) {
        console.warn(`Description for "${currentPlace.name}" exceeds 500 chars (${fullDescription.length}), truncating`);
      }
      currentPlace.descriptionShort = fullDescription.substring(0, 500);
    }
    if (currentSection && sectionBuffer.length > 0) {
      currentPlace.sections.set(currentSection, sectionBuffer.join('\n'));
    }
    if (currentPlace.name && currentPlace.placeKind) {
      // Set default category if missing
      if (!currentPlace.category && currentPlace.tags.length > 0) {
        currentPlace.category = currentPlace.tags[0];
      }
      places.push(currentPlace as ParsedPlace);
    }
  }
  
  return places;
}

function parseGuideFile(filePath: string): ParsedPlace[] {
  const content = readFileSync(filePath, 'utf-8');
  const fileName = filePath.split(/[/\\]/).pop() || '';
  
  // Extract city name from filename: 01-philippines-manila-guide.md -> Manila
  const cityMatch = fileName.match(/01-philippines-(\w+)-guide\.md/);
  if (!cityMatch) {
    throw new Error(`Cannot extract city name from filename: ${fileName}`);
  }
  
  const citySlug = cityMatch[1];
  const cityNameMap: Record<string, string> = {
    manila: 'Manila',
    cebu: 'Cebu',
    palawan: 'Palawan',
    bohol: 'Bohol',
    boracay: 'Boracay',
    dumaguete: 'Dumaguete',
    siargao: 'Siargao',
  };
  
  const cityName = cityNameMap[citySlug] || citySlug.charAt(0).toUpperCase() + citySlug.slice(1);
  
  return parsePlaceMarkdown(content, { cityName, countryId: 'ph', countryCode: 'PH', cityIdMap: CITY_ID_MAP_PH });
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

function generatePlaceId(cityId: string, slug: string): string {
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
    lines.push(`ON CONFLICT (slug) DO UPDATE SET`);
    lines.push(`  name = EXCLUDED.name,`);
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

// ============================================================================
// Main
// ============================================================================

function parseVietnamFile(filePath: string): { places: ParsedPlace[]; cities: string[] } {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const cityStarts: number[] = [];
  const cityNames: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line.startsWith('# ')) continue;
    // Example: "# 🇻🇳 Hue (Хюэ)" or "# 🇻🇳 Ho Chi Minh City (Сайгон)"
    const raw = line.replace(/^#\s+/, '').trim();
    const withoutFlag = raw.replace(/^🇻🇳\s+/, '').trim();
    const cityName = withoutFlag.split('(')[0].trim();
    if (!cityName) continue;
    cityStarts.push(i);
    cityNames.push(cityName);
  }

  const places: ParsedPlace[] = [];
  for (let idx = 0; idx < cityStarts.length; idx++) {
    const start = cityStarts[idx];
    const end = idx + 1 < cityStarts.length ? cityStarts[idx + 1] : lines.length;
    const cityName = cityNames[idx];
    const cityBlock = lines.slice(start + 1, end).join('\n'); // drop the "# ..." line
    const parsed = parsePlaceMarkdown(cityBlock, { cityName, countryId: 'vn', countryCode: 'VN', cityIdMap: CITY_ID_MAP_VN });
    places.push(...parsed);
  }

  return { places, cities: cityNames };
}

function formatIssues(title: string, issues: string[]): string {
  if (issues.length === 0) return `## ${title}\n\n- (нет)\n`;
  return `## ${title}\n\n${issues.map((x) => `- ${x}`).join('\n')}\n`;
}

function main() {
  const repoRoot = join(process.cwd(), '..', '..');
  const contentDirPh = join(repoRoot, 'content', 'atlas', 'philippines');
  const contentDirVn = join(repoRoot, 'content', 'atlas', 'vietnam');
  const exportRoot = join(repoRoot, 'exports', 'neon');
  mkdirSync(exportRoot, { recursive: true });
  
  // Find all guide files
  const allGuideFiles = [
    '01-philippines-manila-guide.md',
    '01-philippines-cebu-guide.md',
    '01-philippines-palawan-guide.md',
    '01-philippines-bohol-guide.md',
    '01-philippines-boracay-guide.md',
    '01-philippines-dumaguete-guide.md',
  ];
  
  // --------------------------------------------------------------------------
  // PH export (keep legacy output in exports/neon/*)
  // --------------------------------------------------------------------------
  const guidePaths = allGuideFiles
    .map((fileName) => join(contentDirPh, fileName))
    .filter((p) => existsSync(p));

  const phPlaces: ParsedPlace[] = [];
  for (const filePath of guidePaths) {
    const fileName = filePath.split(/[/\\]/).pop() || filePath;
    try {
      const places = parseGuideFile(filePath);
      phPlaces.push(...places);
      console.log(`PH: Parsed ${places.length} places from ${fileName}`);
    } catch (error) {
      console.error(`PH: Error parsing ${fileName}:`, error);
    }
  }

  const phPlacesSql = generatePlacesSQL(phPlaces, CITY_ID_MAP_PH, 'ph');
  const phBlocksSql = generateContentBlocksSQL(phPlaces, CITY_ID_MAP_PH);
  writeFileSync(join(exportRoot, 'places.sql'), `${phPlacesSql.sql}\n\n${phBlocksSql.sql}`, 'utf-8');

  const phPlacesCsv = generatePlacesCSV(phPlaces, CITY_ID_MAP_PH, 'ph');
  const phBlocksCsv = generateContentBlocksCSV(phPlaces, CITY_ID_MAP_PH);
  writeFileSync(join(exportRoot, 'places.csv'), phPlacesCsv.csv, 'utf-8');
  writeFileSync(join(exportRoot, 'content_blocks.csv'), phBlocksCsv.csv, 'utf-8');

  const phReadme = generateREADME({
    places: phPlaces,
    countryId: 'ph',
    cityIdMap: CITY_ID_MAP_PH,
    label: 'Philippines',
  });
  writeFileSync(join(exportRoot, 'README.md'), phReadme, 'utf-8');

  // --------------------------------------------------------------------------
  // VN export (new output in exports/neon/vietnam/*)
  // --------------------------------------------------------------------------
  const vietnamPath = join(contentDirVn, 'vietnam-places.md');
  if (!existsSync(vietnamPath)) {
    console.warn(`VN: Missing file ${vietnamPath} (skipping VN export)`);
    return;
  }

  const exportDirVn = join(exportRoot, 'vietnam');
  mkdirSync(exportDirVn, { recursive: true });

  const vnParsed = parseVietnamFile(vietnamPath);
  const vnPlaces = vnParsed.places;

  const vnPlacesSql = generatePlacesSQL(vnPlaces, CITY_ID_MAP_VN, 'vn');
  const vnBlocksSql = generateContentBlocksSQL(vnPlaces, CITY_ID_MAP_VN);
  writeFileSync(join(exportDirVn, 'places.sql'), `${vnPlacesSql.sql}\n\n${vnBlocksSql.sql}`, 'utf-8');

  const vnPlacesCsv = generatePlacesCSV(vnPlaces, CITY_ID_MAP_VN, 'vn');
  const vnBlocksCsv = generateContentBlocksCSV(vnPlaces, CITY_ID_MAP_VN);
  writeFileSync(join(exportDirVn, 'places.csv'), vnPlacesCsv.csv, 'utf-8');
  writeFileSync(join(exportDirVn, 'content_blocks.csv'), vnBlocksCsv.csv, 'utf-8');

  // Parsing report (no silent skips)
  const vnMissingCoords = vnPlaces.filter((p) => !p.coords).map((p) => `${p.slug} (${p.name})`);
  const report = [
    `# VN Export Report`,
    ``,
    `**Generated:** ${new Date().toISOString()}`,
    `**Cities in file:** ${vnParsed.cities.length}`,
    `**Places parsed:** ${vnPlaces.length}`,
    ``,
    formatIssues('SQL issues', vnPlacesSql.issues.concat(vnBlocksSql.issues)),
    formatIssues('CSV issues', vnPlacesCsv.issues.concat(vnBlocksCsv.issues)),
    formatIssues('Missing coords (allowed, but needs review)', vnMissingCoords),
    ``,
    `## City ID mapping used`,
    ``,
    Object.entries(CITY_ID_MAP_VN)
      .map(([name, id]) => `- ${name} -> \`${id}\``)
      .join('\n'),
    ``,
  ].join('\n');
  writeFileSync(join(exportDirVn, 'PARSE_REPORT.md'), report, 'utf-8');

  const vnReadme = generateREADME({
    places: vnPlaces,
    countryId: 'vn',
    cityIdMap: CITY_ID_MAP_VN,
    label: 'Vietnam',
  });
  writeFileSync(join(exportDirVn, 'README.md'), vnReadme, 'utf-8');

  console.log(`VN: Generated: ${exportDirVn}/places.sql`);
  console.log(`VN: Generated: ${exportDirVn}/places.csv`);
  console.log(`VN: Generated: ${exportDirVn}/content_blocks.csv`);
  console.log(`VN: Generated: ${exportDirVn}/PARSE_REPORT.md`);
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
