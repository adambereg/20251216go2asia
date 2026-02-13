# Atlas Country/City Tabs → Neon `content_blocks` (Exporter/Importer)

Дата: 2026-02-08  
Роль: Lead Engineer / Data Pipeline

## Что сделано

- Добавлен exporter Markdown‑канона `content/atlas/**/{country-*.md,city-*.md}` → **UPSERT SQL в `content_blocks`** (только для country/city tabs, которые UI читает через `/tabs`).
- Экспорт **встраивается** в существующие `exports/neon/<country>/content_blocks.sql` **через маркеры** и **не перетирает** place‑блоки.
- Добавлен importer для STAGING Neon, который применяет **только `content_blocks.sql`** (не трогает таблицы `places`/`cities`).
- Добавлен PowerShell-скрипт массового импорта табов в STAGING.

## Где код

- Exporter: `packages/db/src/exportAtlasCountryCityTabsToNeon.ts`  
  Скрипт обновляет:
  - `exports/neon/<country>/content_blocks.sql` (секция `-- BEGIN ATLAS_COUNTRY_CITY_TABS`)
  - `exports/neon/<country>/PARSE_REPORT.md` (секция `<!-- BEGIN ATLAS_COUNTRY_CITY_TABS_REPORT -->`)

- Importer (tabs only): `packages/db/src/applyAtlasTabExportsToNeon.ts`

- Массовый STAGING импорт: `scripts/manual/neon/atlas/run_staging_import_tabs.ps1`

## Как запускать

### 1) Экспорт

Из корня репозитория:

```bash
pnpm -C packages/db exec -- tsx src/exportAtlasCountryCityTabsToNeon.ts
```

### 2) Импорт в STAGING Neon (tabs only)

В PowerShell:

```powershell
$env:STAGING_DATABASE_URL = "postgresql://..."
powershell -ExecutionPolicy Bypass -File scripts/manual/neon/atlas/run_staging_import_tabs.ps1
```

Локально для одной страны:

```bash
pnpm -C packages/db exec -- tsx src/applyAtlasTabExportsToNeon.ts thailand
pnpm -C packages/db exec -- tsx src/applyAtlasTabExportsToNeon.ts vietnam --city sgn
```

## Smoke-набор для UI (ручная проверка)

Открыть в PWA (staging), примеры:

- Country:
  - `/atlas/countries/th/weather`
  - `/atlas/countries/vn/history`
- City (важно: это **Neon cities.id**, часто коды):
  - `/atlas/cities/bkk/transport`
  - `/atlas/cities/sgn/food`

Ожидание: вместо “Контент в разработке.” показывается markdown из `content_blocks.body_markdown`.

## Smoke-набор для API `/tabs` (ручная проверка)

Примеры запросов (подставьте base URL вашего staging API gateway/content-service):

- `GET /v1/content/countries/th/tabs?lang=ru&tabKey=weather`
- `GET /v1/content/cities/bkk/tabs?lang=ru&tabKey=transport`

Ожидание: `items[0].bodyMarkdown` непустой.

## Важные замечания по `entity_id` городов

UI и API ожидают, что `content_blocks.entity_id` для города совпадает с **реальным `cities.id` в Neon**.
Во многих странах `cities.id` = короткий код (например `bkk`, `sgn`, `han`, `sgp`, `rep` и т.д.).

### Новый механизм (предпочтительный): авто-резолв через STAGING Neon

Exporter пытается подключиться к Neon и резолвить `cities.id` для каждого `city-*.md`:

- env: `STAGING_DATABASE_URL` (preferred) или `DATABASE_URL` (fallback)  
  также поддерживается загрузка из `.env.local` в корне репозитория.

Resolve strategy (по убыванию приоритета):
- (1) `cities.country_id = $countryId AND cities.id = $mdId`
- (2) `... AND cities.slug = $slug`
- (3) `... AND lower(cities.name) = lower($title)`
- (4) осторожный fuzzy: `... AND name ILIKE %title%` (принимается только если найден ровно 1 матч; иначе считается ambiguous)

Результат (если найден) используется как **`content_blocks.entity_id`**.
В `exports/neon/<country>/PARSE_REPORT.md` в секции отчёта появляются строки вида:
- `OK RESOLVE city: <country>/<mdId>/<slug> -> <resolvedCityId> (strategy=...)`

### Аварийный fallback: overrides

Если Neon недоступен или город не найден, exporter применяет `CITY_ID_OVERRIDES_BY_COUNTRY` **только как fallback**.
Если и override нет — пишет блоки по `meta.id` и логирует `WARN UNRESOLVED ...` в `PARSE_REPORT`.

Текущие предупреждения (см. `exports/neon/*/PARSE_REPORT.md`):
- **Indonesia**: для `medan`, `surabaya` может не быть соответствующих `cities.id` в Neon (зависит от наполнения `cities`).
- **Malaysia**: аналогично для `johor-bahru`, если `cities.id` в Neon отличается от md.id.

## Связанный аудит

Основной аудит источников контента для вкладок: `docs/audits/atlas_country_city_content_audit.md`.

