import 'server-only';

import fs from 'fs';
import path from 'path';

type Section = {
  title: string;
  content: string;
};

type SectionMap = Record<string, Section>;

const ROOT_DIR = path.join(process.cwd(), 'content', 'atlas', 'philippines');

const COUNTRY_FILES: Record<string, string> = {
  ph: 'Филиппины.md',
  philippines: 'Филиппины.md',
};

const CITY_FILES: Record<string, string> = {
  mnl: 'Philippines-Manila-City.md',
  manila: 'Philippines-Manila-City.md',
  'manila-city': 'Philippines-Manila-City.md',
  ceb: 'Philippines-Cebu-City.md',
  cebu: 'Philippines-Cebu-City.md',
  'cebu-city': 'Philippines-Cebu-City.md',
  tag: 'Philippines-Bohol.md',
  tagbilaran: 'Philippines-Bohol.md',
  bohol: 'Philippines-Bohol.md',
  pps: 'Philippines-Palawan.md',
  'puerto-princesa': 'Philippines-Palawan.md',
  palawan: 'Philippines-Palawan.md',
  srg: 'Philippines-Siargao.md',
  siargao: 'Philippines-Siargao.md',
  dum: 'Philippines-Dumaguete.md',
  dumaguete: 'Philippines-Dumaguete.md',
};

const COUNTRY_SECTION_KEY_MAP: Record<string, string> = {
  'обзор': 'overview',
  'фотогалерея': 'gallery',
  'карта': 'map',
  'города': 'cities',
  'погода и климат': 'weather',
  'история': 'history',
  'география': 'geography',
  'культура': 'culture',
  'проживание': 'living',
  'визы': 'visas',
  'бизнес': 'business',
  'достопримечательности': 'places',
  'разговорник': 'phrasebook',
  'отзывы экспатов': 'reviews',
  'калькулятор стоимости': 'calculator',
};

const CITY_SECTION_KEY_MAP: Record<string, string> = {
  'обзор': 'overview',
  'районы': 'districts',
  'проживание': 'accommodation',
  'еда и кафе': 'food',
  'достопримечательности': 'places',
  'транспорт': 'transport',
  'погода и сезонность': 'weather',
  'погода и климат': 'weather',
  'шопинг': 'shopping',
  'ночная жизнь': 'nightlife',
  'гайды': 'guides',
  'практическая информация': 'tips',
  'отзывы': 'reviews',
  'цены и бюджет': 'budget',
};

const cache = new Map<string, SectionMap>();

function normalizeHeading(value: string): string {
  return value.trim().toLowerCase();
}

function parseSections(markdown: string, headingToKey: Record<string, string>): SectionMap {
  const sections: SectionMap = {};
  const matches = Array.from(markdown.matchAll(/^##\s+(.+)$/gm));
  for (let i = 0; i < matches.length; i += 1) {
    const match = matches[i];
    const title = match[1]?.trim() ?? '';
    const start = (match.index ?? 0) + match[0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index ?? markdown.length : markdown.length;
    const content = markdown.slice(start, end).trim();
    const key = headingToKey[normalizeHeading(title)];
    if (key && content) {
      sections[key] = { title, content };
    }
  }
  return sections;
}

function loadSections(filename: string, headingToKey: Record<string, string>): SectionMap {
  const filePath = path.join(ROOT_DIR, filename);
  const cacheKey = `${filePath}:${Object.keys(headingToKey).length}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;
  const markdown = fs.readFileSync(filePath, 'utf8');
  const sections = parseSections(markdown, headingToKey);
  cache.set(cacheKey, sections);
  return sections;
}

export function getPhilippinesCountrySection(
  countryIdOrSlug: string | undefined,
  sectionKey: string
): Section | null {
  const normalized = (countryIdOrSlug ?? '').toLowerCase();
  const filename = COUNTRY_FILES[normalized];
  if (!filename) return null;
  const sections = loadSections(filename, COUNTRY_SECTION_KEY_MAP);
  return sections[sectionKey] ?? null;
}

export function getPhilippinesCitySection(
  cityIdOrSlug: string | undefined,
  sectionKey: string
): Section | null {
  const normalized = (cityIdOrSlug ?? '').toLowerCase();
  const filename = CITY_FILES[normalized];
  if (!filename) return null;
  const sections = loadSections(filename, CITY_SECTION_KEY_MAP);
  return sections[sectionKey] ?? null;
}
