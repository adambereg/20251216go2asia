# Atlas Asia — Neon schema audit (Этап A)

Цель: определить, где и как в **Neon (Postgres)** хранить контент вкладок Atlas (overview/history/geography/culture/visas/etc), чтобы UI получал его **только** через content-service API и SDK.

## Источник схемы (в репозитории)

В репозитории **нет prisma schema**. Схема БД обнаружена в SQL‑миграциях:
- `packages/db/migrations/0000_dapper_hercules.sql`
- `packages/db/migrations/0001_third_lionheart.sql`
- `packages/db/migrations/0002_cynical_hedge_knight.sql`

Также полезен слой запросов content‑service:
- `packages/db/src/queries/content.ts` (какие поля реально читает API).

## Текущие таблицы content‑service / Atlas

### `countries`
Источник: `0000_dapper_hercules.sql`
Поля:
- `id` (PK), `slug`, `name`, `code`, `flag_emoji`
- `description_short` (text) — **единственное текстовое поле для контента**
- `hero_media_id` → `media_files.id`
- `created_at`, `updated_at`

Связи:
- `countries.id` → `cities.country_id`
- `countries.id` → `places.country_id`

### `cities`
Источник: `0000_dapper_hercules.sql` + `0001_third_lionheart.sql`
Поля:
- `id` (PK), `country_id`, `name`, `slug`
- `description_short` (text) — **единственное текстовое поле для контента**
- координаты: `latitude/longitude` + SSOT `lat/lng` (см. миграцию 0001)
- `hero_media_id` → `media_files.id`
- `created_at`, `updated_at`

### `places`
Источник: `0000_dapper_hercules.sql` + `0001_third_lionheart.sql`
Поля:
- `id` (PK), `country_id`, `city_id`, `name`, `slug`, `type`
- `description_short` (text) — **единственное текстовое поле для контента**
- `address`
- координаты: `latitude/longitude` + SSOT `lat/lng`
- `hero_media_id` → `media_files.id`
- `images` (jsonb) — массив URL/объектов
- `created_at`, `updated_at`

### `articles`
Источник: `0000_dapper_hercules.sql`
Поля:
- `id` (PK), `title`, `slug`, `excerpt`, `content`
- `category`, `tags` (jsonb)
- `cover_media_id` → `media_files.id`
- `image_url`
- `published_at`, `status`, `is_published`
- `created_at`, `updated_at`

Примечание: `articles` покрывает **guides/blog**, но не “вкладки” стран/городов.

### `media_files`
Источник: `0000_dapper_hercules.sql`
Поля:
- `id` (PK), `provider`, `bucket`, `key`, `public_url`
- `mime_type`, `size`, `width`, `height`
- `created_at`

### Views
Источник: `0002_cynical_hedge_knight.sql`
- `atlas_cities_v`, `atlas_places_v` — read‑only представления с SSOT `lat/lng`

## Что реально доступно в content-service API сейчас

По `packages/db/src/queries/content.ts`:
- **Countries**: `description_short`, `hero_url`, counts
- **Cities**: `description_short`, `hero_url`, counts
- **Places**: `description_short`, `hero_url`, `images`
- **Articles**: `content` + `excerpt` + `tags`

**Нет таблиц/полей**, куда можно положить **контент вкладок**:
- history / geography / culture / visas / living / phrasebook / reviews / calculator и т.д.
- аналогично для городских вкладок: districts / accommodation / food / transport / shopping / nightlife / tips / budget и т.д.

## Сопоставление требований UI Atlas vs текущей схемы

### Что UI требует по вкладкам (примеры)
- **Страна**: overview, gallery, map, cities, weather, history, geography, culture, living, visas, business, places, phrasebook, reviews, calculator
- **Город**: overview, districts, accommodation, food, places, transport, weather, shopping, nightlife, guides, tips, reviews, budget

### Что схема даёт сейчас
- **overview** можно примерно закрыть `description_short` (country/city/place)
- **guides/articles** можно закрыть таблицей `articles`
- **media** через `media_files` + `hero_media_id` + `images`
- **остальные вкладки** — **негде хранить** без изменений схемы

## Вывод (A или B)

**A) Хранить вкладки в существующих таблицах без изменения схемы?**  
❌ **Нельзя.** В `countries/cities/places` нет полей под многовкладочный контент.  
`description_short` — одно поле, не покрывающее отдельные вкладки и локали.

**B) Нужна минимальная новая таблица + миграция?**  
✅ **Да.** Требуется минимальный слой контента вкладок.

Рекомендуемая минимальная модель (MVP‑совместима):

```
content_blocks (
  id              uuid pk,
  entity_type     text    -- 'country' | 'city' | 'place'
  entity_id       text    -- id/slug
  tab_key         text    -- 'history' | 'culture' | 'visas' | ...
  lang            text    -- 'ru' | 'en' | ...
  title           text    -- заголовок секции (опционально)
  body_markdown   text    -- основной текст
  source          text    -- 'seed' | 'editorial' | 'ugc'
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),
  unique(entity_type, entity_id, tab_key, lang)
)
```

Минимальная альтернатива (если нужен JSON):
```
content_blocks(body_json jsonb)
```
но для MVP предпочтительнее `body_markdown` как стандартный формат хранения.

## Рекомендации на следующий этап (B)

1) Добавить `content_blocks` через миграцию в `packages/db/migrations/*`.
2) Расширить content-service API:
   - `GET /v1/content/countries/{idOrSlug}/tabs`
   - `GET /v1/content/cities/{idOrSlug}/tabs`
   - (опционально) `GET /v1/content/places/{idOrSlug}/tabs`
3) В SDK добавить методы:
   - `useGetCountryTabs`, `useGetCityTabs`, `useGetPlaceTabs`
4) В UI Atlas: показывать вкладки только из API (без markdown‑файлов).
