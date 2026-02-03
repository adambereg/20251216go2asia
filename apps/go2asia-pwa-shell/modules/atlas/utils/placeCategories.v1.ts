export type PlaceCategoryKey =
  | 'food_drink'
  | 'nightlife'
  | 'nature_outdoors'
  | 'culture_history'
  | 'architecture_landmarks'
  | 'museums_art'
  | 'shopping_markets'
  | 'family_kids'
  | 'transport_infra';

export const PLACE_CATEGORIES_V1: Array<{ key: PlaceCategoryKey; label: string }> = [
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

// Фиксированный приоритет на случай равного score: как в списке (v1).
export const PLACE_CATEGORY_PRIORITY_V1: PlaceCategoryKey[] = PLACE_CATEGORIES_V1.map((c) => c.key);

// v1: tag -> category (один тег принадлежит одной категории).
// Примечание: это "живой" маппинг — можно расширять без изменений БД.
export const TAG_CATEGORY_MAP_V1: Record<string, PlaceCategoryKey> = {
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

export function normalizeTag(tag: string): string {
  return (tag ?? '').trim().toLowerCase();
}

export function getCategoryTags(categoryKey: PlaceCategoryKey): string[] {
  return Object.entries(TAG_CATEGORY_MAP_V1)
    .filter(([, cat]) => cat === categoryKey)
    .map(([tag]) => tag)
    .sort();
}

export function computePlaceCategoryV1(tags: string[]): PlaceCategoryKey | null {
  if (!Array.isArray(tags) || tags.length === 0) return null;

  const scores = new Map<PlaceCategoryKey, number>();
  for (const raw of tags) {
    const tag = normalizeTag(raw);
    const cat = TAG_CATEGORY_MAP_V1[tag];
    if (!cat) continue;
    scores.set(cat, (scores.get(cat) ?? 0) + 1);
  }

  if (scores.size === 0) return null;

  // max score
  let bestCats: PlaceCategoryKey[] = [];
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
  for (const key of PLACE_CATEGORY_PRIORITY_V1) {
    if (bestCats.includes(key)) return key;
  }
  return bestCats[0] ?? null;
}

