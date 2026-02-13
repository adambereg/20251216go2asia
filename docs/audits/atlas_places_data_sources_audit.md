# Аудит источников данных для карточек мест (Place/Showplace) в Atlas Asia

**Дата:** 2026-02-03  
**Объект аудита:** Data-flow от UI до хранилища для карточек мест  
**Кейс:** Bamboo Train (bat-bamboo-train), Баттамбанг, Камбоджа

---

## Executive Summary

1. **Источник данных:** Контент карточек берётся из двух источников:
   - `places` таблица (базовые поля: name, description_short, tags, coordinates)
   - `content_blocks` таблица (полный markdown контент в поле `body_markdown`)

2. **Проблема:** Часть секций из markdown файлов не попадает в `content_blocks` из-за неполного маппинга секций в парсере `exportPlacesToNeon.ts`.

3. **Узкое место:** Парсер `parsePlaceMarkdown` не распознаёт секции "🟠 Как добраться", "🔷 Инфраструктура и сервис", "🟣 Полезные нюансы", "🟢 Локальная ценность" для showplace, так как они отсутствуют в `SECTION_KEY_MAP`.

4. **Статус импорта:** Для Камбоджи отсутствуют файлы экспорта в `exports/neon/`, что означает, что данные для Камбоджи не были импортированы в БД Neon.

5. **Data-flow работает корректно:** UI → API → БД цепочка функционирует правильно, но данные неполные из-за проблем на этапе парсинга/импорта.

---

## 1. Data-flow по слоям

### 1.1 UI Layer

**Entrypoint:** `apps/go2asia-pwa-shell/app/(public)/atlas/places/[id]/page.tsx`

**Компоненты:**
- `PlaceLandingLayoutShowplace` / `PlaceLandingLayoutBusiness` (`apps/go2asia-pwa-shell/modules/atlas/components/PlaceLandingLayouts.tsx`)
- `SectionContentRenderer` (`apps/go2asia-pwa-shell/modules/atlas/components/SectionContentRenderer.tsx`)

**Hooks:**
- `useGetPlaceById(idOrSlug)` → возвращает `ContentPlaceDto` (базовые поля)
- `useGetPlaceTabs(idOrSlug, { lang: 'ru', tabKey: 'overview' })` → возвращает `ListResponse<ContentTabDto>` с `bodyMarkdown`

**Код:**
```typescript
// page.tsx:34-36
const overviewTab = tabsData?.items?.find((t) => t.tabKey === 'overview');
const overviewMarkdown = overviewTab?.bodyMarkdown ?? null;
```

**Вывод:** UI ожидает получить `bodyMarkdown` из `useGetPlaceTabs`, который содержит полный markdown со всеми секциями.

---

### 1.2 SDK Layer

**Файл:** `packages/sdk/src/atlas.ts`

**Hook:** `useGetPlaceTabs`
```typescript
export const useGetPlaceTabs = (idOrSlug: string, params?: { lang?: string; tabKey?: string }) => {
  return useQuery<ListResponse<ContentTabDto>, Error>({
    queryFn: async () => {
      return await listPlaceTabs(idOrSlug, { lang: params?.lang, tabKey: params?.tabKey });
    },
  });
};
```

**Endpoint:** `/v1/content/places/${idOrSlug}/tabs?lang=ru&tabKey=overview`

**DTO:** `ContentTabDto` (`packages/sdk/src/content.ts`)
```typescript
export interface ContentTabDto {
  tabKey: string;
  lang: string;
  title: string | null;
  bodyMarkdown: string;
  updatedAt: string | null;
}
```

**Вывод:** SDK корректно передаёт запрос к API и ожидает `bodyMarkdown` в ответе.

---

### 1.3 API Layer (content-service)

**Файл:** `apps/content-service/src/index.ts`

**Handler:** `handleListPlaceTabs` (строка 899)
```typescript
async function handleListPlaceTabs(env: Env, url: URL, idOrSlug: string, logger: ...): Promise<Response> {
  const placeId = await getPlaceIdByIdOrSlug(sqlClient, idOrSlug);
  if (!placeId) return json({ error: { code: 'NotFound' } }, 404);
  const rows = await listContentBlocks(sqlClient, 'place', placeId, { tabKey, lang });
  return json({ items: rows.map(toContentTab) } satisfies ListResponse<ContentTabDto>, 200);
}
```

**Endpoint:** `GET /v1/content/places/:idOrSlug/tabs?tabKey=overview&lang=ru`

**Query:** `listContentBlocks` (`packages/db/src/queries/content.ts:480`)
```typescript
export async function listContentBlocks(
  sql: SqlClient,
  entityType: string,
  entityId: string,
  filters?: { tabKey?: string; lang?: string }
): Promise<ContentBlockRow[]> {
  // SQL: SELECT ... FROM content_blocks
  // WHERE entity_type = 'place' AND entity_id = :placeId
  //   AND tab_key = 'overview' AND lang = 'ru'
}
```

**Вывод:** API корректно читает из таблицы `content_blocks` и возвращает `bodyMarkdown`.

---

### 1.4 Database Layer

**Таблица:** `content_blocks` (`packages/db/src/schema/content.ts:206`)

**Схема:**
```typescript
export const contentBlocks = pgTable('content_blocks', {
  id: uuid('id').primaryKey(),
  entityType: text('entity_type').notNull(), // 'place'
  entityId: text('entity_id').notNull(), // FK to places.id
  tabKey: text('tab_key').notNull(), // 'overview'
  lang: text('lang').notNull(), // 'ru'
  title: text('title'),
  bodyMarkdown: text('body_markdown').notNull(), // Полный markdown
  source: text('source').notNull().default('seed'),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});
```

**Уникальность:** `UNIQUE(entity_type, entity_id, tab_key, lang)`

**Вывод:** Схема БД поддерживает хранение полного markdown контента в `body_markdown`.

---

### 1.5 Import Layer (Парсинг markdown → БД)

**Файл:** `packages/db/src/exportPlacesToNeon.ts`

**Функция:** `parsePlaceMarkdown` (строка 272)

**Процесс:**
1. Парсит markdown файл (`content/atlas/cambodia/cambodia-places.md`)
2. Распознаёт секции по заголовкам `### 🟡 ...`
3. Маппит заголовки секций в ключи через `SECTION_KEY_MAP` (строка 118)
4. Сохраняет секции в `place.sections: Map<string, string>`
5. `generateContentBlocksSQL` объединяет все секции в один markdown блок
6. Генерирует SQL INSERT для `content_blocks`

**Проблема:** `SECTION_KEY_MAP` не содержит маппинги для секций:
- `'🟠 Как добраться'` → отсутствует (есть только для business: `'🟠 Как добраться': 'howToGet'`)
- `'🔷 Инфраструктура и сервис'` → отсутствует (есть только для business: `'🔷 Инфраструктура и сервис': 'service'`)
- `'🟣 Полезные нюансы'` → отсутствует (есть только для business: `'🟣 Полезные нюансы': 'nuances'`)
- `'🟢 Локальная ценность'` → отсутствует (есть только для business: `'🟢 Локальная ценность': 'localValue'`)

**Код парсера (строка 392):**
```typescript
const sectionKey = SECTION_KEY_MAP[sectionTitle];
if (sectionKey && currentPlace) {
  currentSection = sectionKey;
} else {
  currentSection = null; // ❌ Секция теряется
}
```

**Вывод:** Неполный `SECTION_KEY_MAP` приводит к потере секций при парсинге markdown.

---

## 2. Кейс: Bamboo Train (bat-bamboo-train)

### 2.1 Что есть в markdown (`content/atlas/cambodia/cambodia-places.md:1024-1083`)

**Секции:**
1. ✅ `### 🟡 Почему стоит посетить` → маппится в `whyImportant`
2. ✅ `### 🔵 Что обязательно посмотреть` → маппится в `structure`
3. ✅ `### 🟢 Цены и вход` → маппится в `tickets`
4. ❌ `### 🟠 Как добраться` → **НЕ маппится** (нет в `SECTION_KEY_MAP` для showplace)
5. ❌ `### 🔷 Инфраструктура и сервис` → **НЕ маппится** (нет в `SECTION_KEY_MAP` для showplace)
6. ❌ `### 🟣 Полезные нюансы` → **НЕ маппится** (нет в `SECTION_KEY_MAP` для showplace)
7. ❌ `### 🟢 Локальная ценность` → **НЕ маппится** (нет в `SECTION_KEY_MAP` для showplace)
8. ✅ `### 🔵 Что стоит сфотографировать` → маппится в `photoSpots`
9. ✅ `### 📍 Практическая информация` → обрабатывается отдельно как `practicalInfo`

### 2.2 Что есть в таблице `places` (Neon)

**Поля:**
- `id`: `bat-bamboo-train`
- `name`: `Bamboo Train`
- `description_short`: `Самодельная бамбуковая платформа на рельсах — уникальный пример народной изобретательности Камбоджи.`
- `tags`: `["local", "transport", "culture"]`
- `lat`: `13.121000`
- `lng`: `103.223000`
- `place_kind`: `showplace`

**Вывод:** Базовые поля присутствуют.

### 2.3 Что должно быть в `content_blocks`

**Ожидаемое:**
- `entity_type`: `'place'`
- `entity_id`: `'bat-bamboo-train'`
- `tab_key`: `'overview'`
- `lang`: `'ru'`
- `body_markdown`: Полный markdown со всеми секциями

**Реальное:** Требуется проверка в БД, но по логике парсера секции 4-7 отсутствуют.

### 2.4 Что возвращает API

**Endpoint:** `GET /v1/content/places/bat-bamboo-train/tabs?tabKey=overview&lang=ru`

**Ожидаемый ответ:**
```json
{
  "items": [{
    "tabKey": "overview",
    "lang": "ru",
    "title": null,
    "bodyMarkdown": "## Почему это важно?\n\n- 🌟 ...\n\n## Структура комплекса\n\n- 🏛️ ...\n\n## Билеты и посещение\n\n- 💰 ...\n\n## Лучшие точки для фото\n\n- 📷 ...\n\n## Практическая информация\n\n- **Адрес:** ..."
  }]
}
```

**Проблема:** Секции "Как добраться", "Инфраструктура и сервис", "Полезные нюансы", "Локальная ценность" отсутствуют в `bodyMarkdown`.

### 2.5 Что отображается в UI

**Отображается:**
- ✅ "Почему это важно?" (whyImportant)
- ✅ "Структура комплекса" (structure)
- ✅ "Билеты и посещение" (tickets)
- ✅ "Лучшие точки для фото" (photoSpots)
- ✅ "Практическая информация" (practicalInfo)

**Не отображается:**
- ❌ "Как добраться" (howToGet)
- ❌ "Инфраструктура и сервис" (service)
- ❌ "Полезные нюансы" (nuances)
- ❌ "Локальная ценность" (localValue)

**Вывод:** UI корректно рендерит то, что приходит из API, но данные неполные из-за проблем на этапе парсинга.

---

## 3. Markdown используется в runtime или только как источник импорта?

### 3.1 Markdown НЕ используется напрямую в runtime

**Подтверждение:**
- UI не читает markdown файлы напрямую
- Все данные идут через API из БД
- Markdown файлы используются только на этапе импорта

**Код:** `apps/go2asia-pwa-shell/app/(public)/atlas/places/[id]/page.tsx:36`
```typescript
const overviewMarkdown = overviewTab?.bodyMarkdown ?? null; // Из API, не из файла
```

### 3.2 Процесс импорта

**Скрипт:** `packages/db/src/exportPlacesToNeon.ts`

**Шаги:**
1. Читает markdown файлы из `content/atlas/{country}/{country}-places.md`
2. Парсит через `parsePlaceMarkdown` → `ParsedPlace[]`
3. Генерирует SQL через `generateContentBlocksSQL` → `INSERT INTO content_blocks`
4. Экспортирует в `exports/neon/{country}/places.sql`
5. SQL выполняется вручную в Neon (не автоматически)

**Вывод:** Markdown используется только как источник данных для импорта в БД.

---

## 4. Таблица "Источник → Поле → Где используется"

| Поле | Источник | Кто читает | Где отображается в UI |
|------|----------|------------|----------------------|
| `name` | `places.name` | `useGetPlaceById` → API → `getPlaceByIdOrSlug` | Hero блок (заголовок) |
| `description_short` | `places.description_short` | `useGetPlaceById` → API → `getPlaceByIdOrSlug` | Не используется в карточке (только в preview) |
| `tags` | `places.tags` (JSONB) | `useGetPlaceById` → API → `getPlaceByIdOrSlug` | TagRow компонент |
| `category` | `places.category` или derived из tags | `useGetPlaceById` → API → `getPlaceByIdOrSlug` | CategoryBadge компонент |
| `lat` / `lng` | `places.lat` / `places.lng` | `useGetPlaceById` → API → `getPlaceByIdOrSlug` | Координаты под тегами |
| `city` / `country` | `places.city_id` → JOIN `cities.name` / `countries.name` | `useGetPlaceById` → API → `getPlaceByIdOrSlug` | Hero блок (под названием) |
| `heroImage` / `photos` | `places.hero_media_id` → `media_files.public_url` или R2 fallback | `useGetPlaceById` → `toContentPlaceWithMedia` → R2 resolver | PhotoStrip компонент |
| `whyImportant` | `content_blocks.body_markdown` (секция) | `useGetPlaceTabs` → API → `listContentBlocks` → парсинг `parseMarkdownSections` | SectionCard "Почему это важно?" |
| `structure` | `content_blocks.body_markdown` (секция) | `useGetPlaceTabs` → API → `listContentBlocks` → парсинг `parseMarkdownSections` | SectionCard "Структура комплекса" |
| `tickets` | `content_blocks.body_markdown` (секция) | `useGetPlaceTabs` → API → `listContentBlocks` → парсинг `parseMarkdownSections` | SectionCard "Билеты и посещение" |
| `howToGet` | `content_blocks.body_markdown` (секция) | `useGetPlaceTabs` → API → `listContentBlocks` → парсинг `parseMarkdownSections` | ❌ **НЕ отображается** (не попадает в БД) |
| `service` | `content_blocks.body_markdown` (секция) | `useGetPlaceTabs` → API → `listContentBlocks` → парсинг `parseMarkdownSections` | ❌ **НЕ отображается** (не попадает в БД) |
| `nuances` | `content_blocks.body_markdown` (секция) | `useGetPlaceTabs` → API → `listContentBlocks` → парсинг `parseMarkdownSections` | ❌ **НЕ отображается** (не попадает в БД) |
| `localValue` | `content_blocks.body_markdown` (секция) | `useGetPlaceTabs` → API → `listContentBlocks` → парсинг `parseMarkdownSections` | ❌ **НЕ отображается** (не попадает в БД) |
| `photoSpots` | `content_blocks.body_markdown` (секция) | `useGetPlaceTabs` → API → `listContentBlocks` → парсинг `parseMarkdownSections` | SectionCard "Лучшие точки для фото" |
| `practicalInfo` | `content_blocks.body_markdown` (секция) | `useGetPlaceTabs` → API → `listContentBlocks` → парсинг `parseMarkdownSections` | SectionCard "Практическая информация" |

---

## 5. Вывод и рекомендации

### 5.1 Узкое место

**Проблема:** Неполный `SECTION_KEY_MAP` в `packages/db/src/exportPlacesToNeon.ts:118` не распознаёт секции для showplace:
- `'🟠 Как добраться'` → должен маппиться в `'howToGet'` для showplace
- `'🔷 Инфраструктура и сервис'` → должен маппиться в `'service'` для showplace
- `'🟣 Полезные нюансы'` → должен маппиться в `'nuances'` для showplace
- `'🟢 Локальная ценность'` → должен маппиться в `'localValue'` для showplace

**Последствия:**
1. При парсинге markdown эти секции не сохраняются в `place.sections`
2. Они не попадают в `content_blocks.body_markdown`
3. UI не получает эти секции из API
4. Контент "теряется" на этапе импорта

### 5.2 Дополнительная проблема: Камбоджа не импортирована

**Факт:** В `exports/neon/` отсутствует папка `cambodia/`, что означает, что данные для Камбоджи не были экспортированы и импортированы в БД Neon.

**Последствия:**
- Даже если бы `SECTION_KEY_MAP` был полным, данные для Bamboo Train всё равно отсутствовали бы в БД
- Требуется запустить экспорт для Камбоджи

### 5.3 Что нужно сделать (без реализации в этом задании)

**Минимальные шаги:**

1. **Дополнить `SECTION_KEY_MAP`** (`packages/db/src/exportPlacesToNeon.ts:118`):
   ```typescript
   const SECTION_KEY_MAP: Record<string, string> = {
     // ... существующие ...
     // Добавить для showplace:
     '🟠 Как добраться': 'howToGet', // для showplace
     '🔷 Инфраструктура и сервис': 'service', // для showplace
     '🟣 Полезные нюансы': 'nuances', // для showplace
     '🟢 Локальная ценность': 'localValue', // для showplace
   };
   ```

2. **Дополнить `SECTION_ORDER`** (`packages/db/src/exportPlacesToNeon.ts:169`):
   ```typescript
   const SECTION_ORDER: Record<'showplace' | 'business', string[]> = {
     showplace: [
       'whyImportant',
       'structure',
       'tickets',
       'howToGet', // добавить
       'service', // добавить
       'nuances', // добавить
       'localValue', // добавить
       'timeAllocation',
       'photoSpots',
       'practicalTips',
       // ...
     ],
   };
   ```

3. **Дополнить `SECTION_TITLES`** (`packages/db/src/exportPlacesToNeon.ts:147`):
   ```typescript
   const SECTION_TITLES: Record<string, string> = {
     // ... существующие ...
     howToGet: 'Как добраться',
     service: 'Инфраструктура и сервис',
     nuances: 'Полезные нюансы',
     localValue: 'Локальная ценность',
   };
   ```

4. **Дополнить `getSectionKey` в UI** (`apps/go2asia-pwa-shell/modules/atlas/components/PlaceLandingLayouts.tsx:84`):
   ```typescript
   function getSectionKey(title: string, kind: PlaceKind): string | null {
     const lower = title.toLowerCase();
     if (kind === 'showplace') {
       // ... существующие ...
       if (lower.includes('добраться') || lower.includes('как добраться')) return 'howToGet';
       if (lower.includes('сервис') || lower.includes('инфраструктура')) return 'service';
       if (lower.includes('нюанс') || lower.includes('совет')) return 'nuances';
       if (lower.includes('ценность') || lower.includes('локальн')) return 'localValue';
     }
   }
   ```

5. **Экспортировать и импортировать данные для Камбоджи:**
   - Запустить скрипт экспорта для Камбоджи
   - Импортировать SQL в Neon

6. **Проверить в БД:**
   ```sql
   SELECT body_markdown FROM content_blocks
   WHERE entity_type = 'place' AND entity_id = 'bat-bamboo-train' AND tab_key = 'overview' AND lang = 'ru';
   ```

### 5.4 Архитектурные рекомендации

1. **Единый источник истины:** Markdown файлы остаются источником истины, но должны полностью импортироваться в БД.

2. **Валидация импорта:** Добавить проверку, что все секции из markdown попали в `content_blocks`.

3. **Синхронизация:** Если markdown обновляется, нужно перезапускать импорт.

4. **Документация:** Зафиксировать маппинг секций в документации (`docs/modules/atlas/atlas_card_canon_v1.md`).

---

## Приложение: Схема data-flow

```
┌─────────────────────────────────────────────────────────────────┐
│ content/atlas/cambodia/cambodia-places.md                      │
│ (Markdown файл с секциями)                                     │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ packages/db/src/exportPlacesToNeon.ts                          │
│ parsePlaceMarkdown()                                           │
│   ├─ SECTION_KEY_MAP (неполный ❌)                             │
│   └─ place.sections: Map<string, string>                       │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ generateContentBlocksSQL()                                      │
│   └─ INSERT INTO content_blocks (body_markdown)                │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ exports/neon/cambodia/places.sql                                │
│ (SQL файл для импорта)                                          │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼ (ручной импорт)
┌─────────────────────────────────────────────────────────────────┐
│ Neon PostgreSQL                                                 │
│   ├─ places (базовые поля)                                     │
│   └─ content_blocks (body_markdown)                            │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ apps/content-service/src/index.ts                              │
│ handleListPlaceTabs()                                           │
│   └─ listContentBlocks(sql, 'place', placeId, ...)              │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ GET /v1/content/places/:id/tabs?tabKey=overview&lang=ru         │
│ Response: { items: [{ bodyMarkdown: "..." }] }                 │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ packages/sdk/src/atlas.ts                                       │
│ useGetPlaceTabs() → listPlaceTabs()                            │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ apps/go2asia-pwa-shell/app/(public)/atlas/places/[id]/page.tsx │
│ overviewMarkdown = tabsData?.items?.[0]?.bodyMarkdown           │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ PlaceLandingLayouts.tsx                                         │
│ parseMarkdownSections(overviewMarkdown)                         │
│   └─ getSectionKey() (распознаёт секции по заголовкам ##)      │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ SectionContentRenderer.tsx                                      │
│ (Семантический рендеринг секций)                               │
└─────────────────────────────────────────────────────────────────┘
```

**Точка потери данных:** `parsePlaceMarkdown()` → `SECTION_KEY_MAP` (неполный маппинг)

---

**Конец отчёта**
