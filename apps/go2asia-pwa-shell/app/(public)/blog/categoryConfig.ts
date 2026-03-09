export const CATEGORY_ORDER = ['Путешествия', 'Впечатления', 'Финансы', 'Советы', 'Релокация', 'Размышления'] as const;

export function getCategoryOrderIndex(category: string): number {
  const idx = CATEGORY_ORDER.indexOf(category as (typeof CATEGORY_ORDER)[number]);
  return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
}

export function slugifyCategory(category: string): string {
  const normalized = category
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^a-z0-9а-я]+/gi, '-')
    .replace(/^-+|-+$/g, '');

  const translitMap: Record<string, string> = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
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
    ы: 'y',
    э: 'e',
    ю: 'yu',
    я: 'ya',
    ь: '',
    ъ: '',
  };

  return normalized
    .split('')
    .map((ch) => translitMap[ch] ?? ch)
    .join('');
}

export function getCategoryBySlug(slug: string): string | null {
  const normalized = slug.trim().toLowerCase();
  for (const category of CATEGORY_ORDER) {
    if (slugifyCategory(category) === normalized) return category;
  }
  return null;
}
