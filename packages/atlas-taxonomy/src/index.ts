export type CategoryKey =
  | 'food_drink'
  | 'nightlife'
  | 'nature_outdoors'
  | 'culture_history'
  | 'architecture_landmarks'
  | 'museums_art'
  | 'shopping_markets'
  | 'family_kids'
  | 'transport_infra';

export type CategoryDef = { key: CategoryKey; label: string };
export type CategoryFacet = CategoryDef & { count: number };
export type TagFacet = { key: string; count: number };

/**
 * v1 categories: fixed list, used for UI facets and tie-break priority.
 * IMPORTANT: Keep this list stable (mechanical refactor from Atlas Places).
 */
export const categoriesV1: CategoryDef[] = [
  { key: 'food_drink', label: 'Еда и напитки' },
  { key: 'nightlife', label: 'Ночная жизнь' },
  { key: 'nature_outdoors', label: 'Природа и активный отдых' },
  { key: 'culture_history', label: 'Культура и история' },
  { key: 'architecture_landmarks', label: 'Архитектура и достопримечательности' },
  { key: 'museums_art', label: 'Музеи и искусство' },
  { key: 'shopping_markets', label: 'Шопинг и рынки' },
  { key: 'family_kids', label: 'Семьям и детям' },
  { key: 'transport_infra', label: 'Транспорт и инфраструктура' },
];

/**
 * v1 fixed priority list (tie-break): same order as categoriesV1.
 */
export const categoryPriorityV1: CategoryKey[] = categoriesV1.map((c) => c.key);

/**
 * v1: tag -> category (one tag belongs to one category).
 * IMPORTANT: Keep mapping stable (mechanical refactor from Atlas Places).
 */
export const tagCategoryMapV1: Record<string, CategoryKey> = {
  // Еда и напитки
  cafe: 'food_drink',
  restaurant: 'food_drink',
  streetfood: 'food_drink',
  food: 'food_drink',
  coffee: 'food_drink',
  tea: 'food_drink',
  dessert: 'food_drink',
  bakery: 'food_drink',

  // Ночная жизнь
  nightlife: 'nightlife',
  bars: 'nightlife',
  bar: 'nightlife',
  clubs: 'nightlife',
  club: 'nightlife',
  night: 'nightlife',
  'night-lights': 'nightlife',

  // Природа и активный отдых
  nature: 'nature_outdoors',
  beach: 'nature_outdoors',
  island: 'nature_outdoors',
  islands: 'nature_outdoors',
  waterfall: 'nature_outdoors',
  mountains: 'nature_outdoors',
  jungle: 'nature_outdoors',
  lagoon: 'nature_outdoors',
  hiking: 'nature_outdoors',
  trekking: 'nature_outdoors',
  diving: 'nature_outdoors',
  snorkeling: 'nature_outdoors',
  sunrise: 'nature_outdoors',
  sunset: 'nature_outdoors',
  panorama: 'nature_outdoors',
  viewpoint: 'nature_outdoors',

  // Культура и история
  culture: 'culture_history',
  history: 'culture_history',
  heritage: 'culture_history',
  colonial: 'culture_history',
  memorial: 'culture_history',
  ruins: 'culture_history',
  war: 'culture_history',
  genocide: 'culture_history',
  unesco: 'culture_history',
  religion: 'culture_history',
  sacred: 'culture_history',

  // Архитектура и достопримечательности
  landmark: 'architecture_landmarks',
  architecture: 'architecture_landmarks',
  cathedral: 'architecture_landmarks',
  church: 'architecture_landmarks',
  temple: 'architecture_landmarks',
  bridge: 'architecture_landmarks',
  sculpture: 'architecture_landmarks',
  monument: 'architecture_landmarks',
  skyscraper: 'architecture_landmarks',
  skyline: 'architecture_landmarks',
  iconic: 'architecture_landmarks',
  'city-symbol': 'architecture_landmarks',

  // Музеи и искусство
  museum: 'museums_art',
  art: 'museums_art',
  gallery: 'museums_art',
  education: 'museums_art',
  exhibition: 'museums_art',

  // Шопинг и рынки
  shopping: 'shopping_markets',
  market: 'shopping_markets',
  streetmarket: 'shopping_markets',
  bazaar: 'shopping_markets',

  // Семьям и детям
  family: 'family_kids',
  kids: 'family_kids',
  park: 'family_kids',
  zoo: 'family_kids',
  aquarium: 'family_kids',
  playground: 'family_kids',

  // Транспорт и инфраструктура
  transport: 'transport_infra',
  airport: 'transport_infra',
  station: 'transport_infra',
  port: 'transport_infra',
  harbor: 'transport_infra',
  road: 'transport_infra',
};

/**
 * v1 tag normalization: lowercase + trim.
 * No linguistic logic (by design).
 */
export function normalizeTag(tag: string): string {
  return (tag ?? '').trim().toLowerCase();
}

export function getCategoryTags(categoryKey: CategoryKey): string[] {
  return Object.entries(tagCategoryMapV1)
    .filter(([, cat]) => cat === categoryKey)
    .map(([tag]) => tag)
    .sort();
}

/**
 * v1 category derived from tags:
 * - score = number of mapped tags for that category
 * - tie-break = fixed priority list (categoryPriorityV1)
 *
 * IMPORTANT: Mechanical port of Atlas Places logic (no behavior change).
 */
export function getCategoryKeyFromTags(tags: string[]): CategoryKey | null {
  if (!Array.isArray(tags) || tags.length === 0) return null;

  const scores = new Map<CategoryKey, number>();
  for (const raw of tags) {
    const tag = normalizeTag(raw);
    const cat = tagCategoryMapV1[tag];
    if (!cat) continue;
    scores.set(cat, (scores.get(cat) ?? 0) + 1);
  }

  if (scores.size === 0) return null;

  // max score
  let bestCats: CategoryKey[] = [];
  let bestScore = -1;
  for (const [cat, score] of scores.entries()) {
    if (score > bestScore) {
      bestScore = score;
      bestCats = [cat];
    } else if (score === bestScore) {
      bestCats.push(cat);
    }
  }

  if (bestCats.length === 1) return bestCats[0];

  // tie-break by fixed priority list
  for (const key of categoryPriorityV1) {
    if (bestCats.includes(key)) return key;
  }
  return bestCats[0] ?? null;
}

export function computeCategoryFacetsFromItems(items: Array<{ tags?: string[] }>): CategoryFacet[] {
  const counts: Record<string, number> = Object.fromEntries(categoriesV1.map((c) => [c.key, 0]));

  for (const item of items) {
    const cat = getCategoryKeyFromTags(item.tags ?? []);
    if (!cat) continue;
    counts[cat] = (counts[cat] ?? 0) + 1;
  }

  return categoriesV1.map((c) => ({
    ...c,
    count: counts[c.key] ?? 0,
  }));
}

export function computeTagFacetsFromItems(
  items: Array<{ tags?: string[] }>,
  opts: { topN: number; categoryKey?: CategoryKey | null; selectedTags?: string[] }
): TagFacet[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    for (const raw of item.tags ?? []) {
      const t = normalizeTag(raw);
      if (!t) continue;
      counts.set(t, (counts.get(t) ?? 0) + 1);
    }
  }

  let keys = Array.from(counts.keys());

  const categoryKey = opts.categoryKey ?? null;
  if (categoryKey) {
    const categoryTagSet = new Set(getCategoryTags(categoryKey).map(normalizeTag));
    keys = keys.filter((t) => categoryTagSet.has(t));
  }

  // sort by popularity, then alphabet
  keys.sort((a, b) => {
    const da = counts.get(a) ?? 0;
    const db = counts.get(b) ?? 0;
    if (db !== da) return db - da;
    return a.localeCompare(b);
  });

  // before category selection show topN (mechanical port: TOP_N=12 in Places UI)
  if (!categoryKey) keys = keys.slice(0, opts.topN);

  // Add selected tags (even if out-of-category / not popular)
  for (const raw of opts.selectedTags ?? []) {
    const t = normalizeTag(raw);
    if (!t) continue;
    if (!keys.includes(t)) keys.unshift(t);
  }

  // unique preserving order
  const seen = new Set<string>();
  const finalKeys: string[] = [];
  for (const k of keys) {
    if (seen.has(k)) continue;
    seen.add(k);
    finalKeys.push(k);
  }

  return finalKeys.map((k) => ({ key: k, count: counts.get(k) ?? 0 }));
}

// ---------------------------------------------------------------------------
// Types for future unification (v1 scaffolding, no behavior changes required)
// ---------------------------------------------------------------------------

export type CategoryScope = { countryId?: string; cityId?: string };

export type CategoryQuery = {
  kind?: 'places' | 'guides' | 'themes';
  categoryKey?: CategoryKey;
  q?: string;
  tags?: string[];
} & CategoryScope;

export type AtlasEntityWithTags = { id: string; tags?: string[] };

