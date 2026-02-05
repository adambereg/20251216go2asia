# Neon PostgreSQL Schema & Data Health Audit

**Дата:** 2026-02-03  
**Объект аудита:** Полная схема Neon PostgreSQL и качество данных по всем модулям Go2Asia  
**Цель:** Зафиксировать факты о схеме и данных перед исправлением пайплайна импорта/парсинга

---

## Executive Summary

**⚠️ ВАЖНО:** Этот документ заполняется по результатам запуска SQL-скриптов из `scripts/audit/neon/`.  
Секция 1 (schema inventory) ниже уже заполнена фактами из выполнения `01_schema_inventory.sql` в Neon.

### Ключевые находки

1. **Схема БД:**
   - [x] Всего объектов (public): **16 таблиц + 7 view = 23**
   - [x] Индексы/связи/типы: **40 indexes**, **12 foreign keys**, **3 enum types**
   - [x] Модули/домены, которые реально присутствуют в схеме: **Atlas (content)** ✅ / **Pulse** ✅ / **Blog** ✅ / **Points** ✅ / **Referral** ✅ / **Auth/Users** ✅ / **Rielt** ❌
   - [x] Отсутствующие таблицы: **Rielt** (таблицы не обнаружены)

2. **Качество данных:**
   - [x] Places без content_blocks (overview/ru): **0** (466/466 покрыты; при этом есть **4** orphan content_blocks)
   - [x] Places без координат: **20**
   - [x] Places без тегов: **2**
   - [x] Broken references (core): **0** битых `cities.country_id`

3. **Главные риски:**
   - [x] Риск 1: **content_blocks покрывает все places по overview/ru (466/466)**, но есть **orphan content_blocks (4)** → консистентность пайплайна импорта
   - [x] Риск 2: **UI готов показывать богатый контент**, но данные в Neon частично “UI-first”: для places нет медиа-связок (`hero_media_id/images` пусты 466/466), для Pulse нет coords/media (10/10)
   - [x] Риск 3: **`media_files.size` не заполнен (sum=0, avg=0 при total=167)** — метаданные медиа частично/некорректно импортированы

4. **Степень заполненности:**
   - Atlas: **100% places имеют overview content_blocks (466/466)**; но **0% имеют hero_media_id/images в БД** (466/466 пусто)
   - Pulse: **10 events** существуют, но **0% имеют coords** и **0% имеют media** (missing_coords=10, missing_media_both=10)
   - Blog: **100% articles опубликованы (16/16)**; критичные поля и медиа заполнены
   - Core контент-блоки: **526 блоков**, пустых `body_markdown` = **0**, сверхкоротких (<50) = **0**

---

## How to Run Audit Scripts

### Вариант 1: Neon Console SQL Editor

1. Откройте Neon Console → SQL Editor
2. Скопируйте содержимое каждого скрипта по очереди
3. Выполните скрипт
4. Сохраните результаты в отдельный файл или скриншот

**Порядок выполнения:**
1. `01_schema_inventory.sql` — инвентаризация схемы
2. `02_data_health_core.sql` — базовые проверки
3. `03_data_health_atlas.sql` — Atlas модуль
4. `04_data_health_pulse.sql` — Pulse модуль
5. `05_data_health_blog.sql` — Blog модуль
6. `06_data_health_rielt.sql` — Rielt модуль (может быть пустым)

### Вариант 2: psql Command Line

```bash
# Установите DATABASE_URL из Neon Console
export DATABASE_URL="postgresql://user:password@host/database"

# Запустите все скрипты последовательно
psql "$DATABASE_URL" -f scripts/audit/neon/01_schema_inventory.sql > audit_results/01_schema.txt
psql "$DATABASE_URL" -f scripts/audit/neon/02_data_health_core.sql > audit_results/02_core.txt
psql "$DATABASE_URL" -f scripts/audit/neon/03_data_health_atlas.sql > audit_results/03_atlas.txt
psql "$DATABASE_URL" -f scripts/audit/neon/04_data_health_pulse.sql > audit_results/04_pulse.txt
psql "$DATABASE_URL" -f scripts/audit/neon/05_data_health_blog.sql > audit_results/05_blog.txt
psql "$DATABASE_URL" -f scripts/audit/neon/06_data_health_rielt.sql > audit_results/06_rielt.txt
```

### Вариант 3: Batch Script (PowerShell)

```powershell
$DATABASE_URL = "postgresql://user:password@host/database"
$scripts = @(
    "01_schema_inventory.sql",
    "02_data_health_core.sql",
    "03_data_health_atlas.sql",
    "04_data_health_pulse.sql",
    "05_data_health_blog.sql",
    "06_data_health_rielt.sql"
)

foreach ($script in $scripts) {
    $output = "audit_results/$($script -replace '\.sql$', '.txt')"
    psql "$DATABASE_URL" -f "scripts/audit/neon/$script" | Out-File -FilePath $output -Encoding UTF8
    Write-Host "Completed: $script"
}
```

---

## 1. Inventory схемы

### 1.1 Схемы и таблицы

**Результаты из `01_schema_inventory.sql`:**

| Schema | Table Name | Type | Size |
|--------|------------|------|------|
| public | articles | BASE TABLE | 80 kB |
| public | atlas_cities_v | VIEW | 0 bytes |
| public | atlas_places_v | VIEW | 0 bytes |
| public | balances | VIEW | 0 bytes |
| public | cities | BASE TABLE | 112 kB |
| public | content_blocks | BASE TABLE | **1096 kB** ⚠️ |
| public | countries | BASE TABLE | 64 kB |
| public | event_registrations | BASE TABLE | 24 kB |
| public | events | BASE TABLE | 80 kB |
| public | media_files | BASE TABLE | 160 kB |
| public | places | BASE TABLE | **472 kB** ⚠️ |
| public | points_transactions | BASE TABLE | 24 kB |
| public | pulse_events_v | VIEW | 0 bytes |
| public | referral_codes | VIEW | 0 bytes |
| public | referral_links | BASE TABLE | 64 kB |
| public | referral_relations | BASE TABLE | 48 kB |
| public | referrals | VIEW | 0 bytes |
| public | schema_migrations | BASE TABLE | 48 kB |
| public | transactions | VIEW | 0 bytes |
| public | user_badges | BASE TABLE | 16 kB |
| public | user_balances | BASE TABLE | 16 kB |
| public | user_profiles | BASE TABLE | 16 kB |
| public | users | BASE TABLE | 48 kB |

**Всего таблиц:** 16  
**Всего views:** 7  
**Всего индексов:** 40  
**Всего foreign keys:** 12  
**Всего enum types:** 3

### 1.2 Ключевые сущности и связи

**Core Tables:**
- `countries` → `cities` (1:N)
- `cities` → `places` (1:N)
- `countries` → `places` (1:N, optional)

**Content Tables:**
- `content_blocks` → `places` / `cities` / `countries` (polymorphic via `entity_type` + `entity_id`)

**Media:**
- `media_files` → referenced by `places.hero_media_id`, `events.image_media_id`, `articles.cover_media_id`

**Module Tables:**
- **Atlas:** `places`, `countries`, `cities`, `content_blocks` (entity_type='place')
- **Pulse:** `events`, `event_registrations`
- **Blog:** `articles`
- **Points:** `points_transactions` (+ view `transactions`)
- **Referral:** `referral_links`, `referral_relations` (+ view `referral_codes`, `referrals`)
- **Auth/Users:** `users`, `user_profiles`, `user_balances`, `user_badges` (+ view `balances`)
- **Rielt:** (таблиц не найдено в схеме)

### 1.3 Constraints и индексы

**Primary Keys:**
- Найдено **16 PK** (по 1 на каждую BASE TABLE): `articles.id`, `cities.id`, `content_blocks.id`, `countries.id`, `event_registrations.id`, `events.id`, `media_files.id`, `places.id`, `points_transactions.id`, `referral_links.id`, `referral_relations.id`, `schema_migrations.id`, `user_badges.id`, `user_balances.user_id`, `user_profiles.id`, `users.id`

**Unique Constraints:**
- Найдено **14 UNIQUE**:
  - `articles_slug_unique` (articles.slug)
  - `cities_slug_unique` (cities.slug)
  - `content_blocks_unique` (content_blocks.entity_type, entity_id, tab_key, lang)
  - `countries_code_unique` (countries.code)
  - `countries_slug_unique` (countries.slug)
  - `event_registrations_user_id_event_id_unique` (event_registrations.user_id, event_id)
  - `media_files_provider_bucket_key_unique` (media_files.provider, bucket, key)
  - `places_slug_unique` (places.slug)
  - `points_transactions_external_id_unique` (points_transactions.external_id)
  - `referral_links_referral_code_unique` (referral_links.referral_code)
  - `referral_links_user_id_unique` (referral_links.user_id)
  - `referral_relations_referee_id_unique` (referral_relations.referee_id)
  - `schema_migrations_filename_key` (schema_migrations.filename)
  - `users_clerk_id_unique` (users.clerk_id)

**Foreign Keys:**
- Найдено **12 FK**:
  - `articles.cover_media_id` → `media_files.id`
  - `cities.country_id` → `countries.id`
  - `cities.hero_media_id` → `media_files.id`
  - `countries.hero_media_id` → `media_files.id`
  - `event_registrations.event_id` → `events.id`
  - `events.city_id` → `cities.id`
  - `events.country_id` → `countries.id`
  - `events.image_media_id` → `media_files.id`
  - `places.hero_media_id` → `media_files.id`
  - `places.country_id` → `countries.id`
  - `places.city_id` → `cities.id`
  - `user_profiles.user_id` → `users.id`

**Индексы:**
- Всего **40** (включая pkey/unique-индексы). Ключевые для фильтров/джойнов:
  - `idx_cities_country_id` (cities.country_id)
  - `idx_places_city_id` (places.city_id)
  - `idx_places_country_id` (places.country_id)
  - `idx_places_city_kind` (places.city_id, place_kind)
  - `idx_places_country_kind` (places.country_id, place_kind)
  - `idx_events_city_id` (events.city_id)
  - `idx_events_country_id` (events.country_id)
  - `idx_events_start_at` (events.start_at)
  - `idx_content_blocks_entity` (content_blocks.entity_type, entity_id)
  - `idx_content_blocks_tab_lang` (content_blocks.tab_key, lang)

### 1.4 Enum Types

- `article_status`: `draft`, `published`, `archived`
- `event_registration_status`: `registered`, `cancelled`
- `event_status`: `draft`, `active`, `cancelled`, `archived`

### 1.5 Table sizes (Top)

**Результаты (Top 16):**

| Table | Total | Table | Indexes |
|------|------:|------:|--------:|
| content_blocks | 1096 kB | 664 kB | 432 kB |
| places | 472 kB | 272 kB | 200 kB |
| media_files | 160 kB | 48 kB | 112 kB |
| cities | 112 kB | 32 kB | 80 kB |
| events | 80 kB | 8 kB | 72 kB |
| articles | 80 kB | 16 kB | 64 kB |
| countries | 64 kB | 8 kB | 56 kB |
| referral_links | 64 kB | 8 kB | 56 kB |
| schema_migrations | 48 kB | 8 kB | 40 kB |
| referral_relations | 48 kB | 8 kB | 40 kB |
| users | 48 kB | 8 kB | 40 kB |
| event_registrations | 24 kB | 0 B | 24 kB |
| points_transactions | 24 kB | 0 B | 24 kB |
| user_profiles | 16 kB | 0 B | 16 kB |
| user_balances | 16 kB | 0 B | 16 kB |
| user_badges | 16 kB | 0 B | 16 kB |

---

## 2. Data Health by Module

### 2.0 Core / Shared (результаты `02_data_health_core.sql`)

#### Countries

- **Total countries**: 8
- **Missing critical fields**: 0 (name/slug/code заполнены)
- **Duplicate slug groups**: 0
- **created_at**: 2025-12-23 09:36:27.523801 → 2025-12-23 09:36:27.523801

#### Cities

- **Total cities**: 116
- **Missing critical fields**: 0 (name/slug/country_id заполнены)
- **Broken references**: 0 (cities.country_id → countries.id)
- **Duplicate slug groups**: 0
- **created_at**: 2025-12-23 09:36:27.730085 → 2026-02-03 05:31:08.001127

#### Content blocks

- **Total content_blocks**: 526
- **Missing body_markdown**: 0
- **body_markdown < 50 chars**: 0
- **created_at**: 2026-01-17 11:06:34.299055+00 → 2026-02-03 05:31:30.381709+00
- **По entity_type**:
  - place: 470
  - city: 45
  - country: 11
- **Языки**:
  - ru: 526 (мультиязычности сейчас нет)
- **По source**:
  - editorial: 416
  - seed: 85
  - mixed: 25
- **По tab_key (top)**:
  - overview: 476
  - accommodation: 5
  - districts: 5
  - food: 5
  - nightlife: 5
  - places: 5
  - reviews: 5
  - shopping: 5
  - transport: 5
  - (прочие одиночные: business/cities/culture/gallery/geography/history/living/map/phrasebook/visas)

#### Media files

- **Total media_files**: 167
- **Missing key/public_url**: 0
- **provider**: r2 = 167
- **size_sum_bytes / size_avg_bytes**: 0 / 0  ⚠️ (похоже, `size` заполнялся нулями при импорте)
- **created_at**: 2025-12-23 09:36:26.942422 → 2025-12-23 09:36:26.942422

### 2.1 Atlas Module

**Результаты из `03_data_health_atlas.sql`:**

#### Places Overview
- **Total places:** 466
- **By place_kind:**
  - showplace: 258
  - business: 208
- **By country (top):**
  - Вьетнам: 159
  - Таиланд: 70
  - Индонезия: 59
  - Лаос: 57
  - Малайзия: 47
  - Филиппины: 35
  - Камбоджа: 27
  - Сингапур: 12
- **By city (top 10):**
  - Далат: 23
  - Дананг: 20
  - Хошимин: 20
  - Хойан: 20
  - Нячанг: 19
  - Ханой: 19
  - Хюэ: 19
  - Дуонг Донг: 19
  - Ванг Виенг: 13
  - Луанг Прабанг: 13

#### Missing Critical Fields
- Places without name: 0
- Places without slug: 0
- Places without coordinates (COALESCE(lat,latitude) / COALESCE(lng,longitude)): 20
- Places without country_id: 0
- Places without city_id: 0
- Places without tags: 2
- Places without description_short: 0
- Places without hero_media_id: 466 ⚠️
- Places without images: 466 ⚠️

#### Broken References
- Places with broken country_id: 0
- Places with broken city_id: 0

#### Content Blocks Coverage
- **Places with content_blocks (overview/ru):**
  - all content_blocks(entity_type=place, overview/ru): **470**
  - existing places covered (places_with_overview_ru_existing): **466**
- **Places without content_blocks (overview/ru):** 0
- **Coverage rate:** **100.00%** (по существующим places)

**Важно (диагностика):** `places_with_overview_ru_all=470` при `places.total=466` и `places_with_overview_ru_existing=466` означает, что в БД есть **4 orphan content_blocks** для places (entity_id без соответствующей строки в `places`). Это и давало >100% в старой формуле.

**Coverage by country:**
| Country | Missing Content Blocks |
|---------|------------------------|
| (нет данных) | 0 missing (по результату: `places_missing_overview_ru = 0`) |

**Coverage by place_kind:**
| Kind | Missing Content Blocks |
|------|------------------------|
| showplace | 0 |
| business | 0 |

#### Content Quality
- **Content blocks body_markdown length:**
  - Min: 266 chars
  - Avg: 664 chars
  - Max: 1529 chars
- **Content blocks < 100 chars:** 0

#### Countries & Cities Coverage
- **Total countries:** 8
- **Countries with places:** 8
- **Countries without places:** 0
- **Countries with content_blocks:** 1 ⚠️

- **Total cities:** 116
- **Cities with places:** 43
- **Cities without places:** 73 ⚠️
- **Cities with content_blocks:** 5 ⚠️

**Выводы по Atlas:**
- [x] **content_blocks coverage для places (overview/ru) = 100%**: проблема “контент не доходит до UI” **не** в отсутствии `content_blocks`, а в **качествах импорта/структурировании markdown** (какие секции попадают в body_markdown) и/или в логике UI-рендера секций.
- [x] **Медиа в БД для places отсутствует** (`hero_media_id/images` пусты для 466/466): UI должен полагаться на R2 fallback (как сейчас в content-service).
- [x] **Есть orphan content_blocks для places (4)**: требуется чистка/консистентность пайплайна импорта (без фикса в рамках этого аудита).
- [x] **Atlas country/city tabs почти не заполнены**: `countries with content_blocks = 1`, `cities with content_blocks = 5` при `content_blocks entity_type.city=45` и `entity_type.country=11` (много tab_key на малом числе сущностей).

---

### 2.2 Pulse Module

**Результаты из `04_data_health_pulse.sql`:**

#### Events Overview
- **Total events:** 10
- **By status:**
  - active: 10

#### Missing Critical Fields
- Events without title: 0
- Events without slug: 0
- Events without start_at: 0
- Events without coordinates: 10 ⚠️
- Events without country_id: 1
- Events without city_id: 1
- Events without image_media_id: 10 ⚠️
- Events without image_url: 10 ⚠️
- Events without any media (both): 10 ⚠️

#### Date Consistency
- Events where end_at < start_at: 0
- Future events: 0
- Past events: 10

#### Event Registrations
- **Total registrations:** 0
- **Events with registrations:** 0
- **Registrations with broken event_id:** 0

**Выводы по Pulse:**
- [x] **События существуют, но отсутствуют координаты и медиа** (10/10): это ограничит UI (карты/обложки) и указывает на неполный импорт/сидинг Pulse.
- [x] **Геосвязи частично заполнены**: 1 event без `country_id`, 1 без `city_id`, при этом broken ссылок = 0.
- [x] **Регистрации отсутствуют** (0) — ожидаемо, если модуль ещё не использовался в проде.

---

### 2.3 Blog Module

**Результаты из `05_data_health_blog.sql`:**

#### Articles Overview
- **Total articles:** 16
- **Published articles:** 16
- **Draft articles:** 0

#### Missing Critical Fields
- Articles without title: 0
- Articles without slug: 0
- Articles without content: 0
- Articles without excerpt: 0
- Articles without cover_media_id: 0
- Articles without image_url: 0
- Published articles without published_at: 0

#### Content Quality
- **Content length:**
  - Min: 143 chars
  - Avg: 149 chars
  - Max: 164 chars
- **Articles with content < 100 chars:** 0

#### Publishing Status Consistency
- Articles with status=published but is_published=false: 0
- Articles with status=draft but is_published=true: 0

**Выводы по Blog:**
- [x] **Blog данные консистентны**: 16/16 опубликованы, критичные поля заполнены, дубликатов slug нет.
- [x] Контент по длине сейчас короткий (143–164 chars) — похоже на демо/заглушки, но технически “здоров”.

---

### 2.4 Rielt Module

**Результаты из `06_data_health_rielt.sql`:**

- **Status:** tables_present=false (No listings/properties tables found — expected for MVP)

**Выводы по Rielt:**
- [x] Таблицы отсутствуют (ожидаемо для MVP)

---

## 3. Cross-cutting Findings (общие проблемы)

### 3.1 Несогласованность именований

- [ ] Legacy поля (`latitude`/`longitude`) сосуществуют с новыми (`lat`/`lng`)
- [ ] Legacy поля (`start_date`/`end_date`) сосуществуют с новыми (`start_at`/`end_at`)
- [ ] Legacy флаги (`is_published`, `is_active`) сосуществуют с enum (`status`)

### 3.2 Отсутствие FK там, где нужно

- [ ] `content_blocks.entity_id` не имеет FK (полиморфная связь)
- [ ] `event_registrations.user_id` не имеет FK (Clerk user_id)

### 3.3 Индексы для фильтров

**Существующие индексы:**
- ✅ `idx_places_country_id`
- ✅ `idx_places_city_id`
- ✅ `idx_events_start_at`

**Отсутствующие индексы (рекомендуемые):**
- [ ] `idx_places_place_kind` (для фильтрации по kind)
- [ ] `idx_places_tags` (GIN индекс для JSONB tags, если нужен поиск по тегам)
- [ ] `idx_events_status` (для фильтрации по статусу)
- [ ] `idx_articles_status` (для фильтрации по статусу)
- [ ] `idx_articles_published_at` (для сортировки опубликованных)

### 3.4 Где данные не импортированы/не полные

**Atlas:**
- [x] Places имеют `content_blocks` (overview/ru) на 100% (466/466), но есть **orphan content_blocks (4)** → проблема консистентности импорта.
- [x] **Медиа-связки не импортированы в БД**: `places.hero_media_id` и `places.images` пусты для 466/466 (UI живёт на R2 fallback).
- [x] **Координаты не полные**: 20/466 places без координат (учитывая COALESCE(lat,latitude)).
- [x] **Теги почти полные**, но есть 2/466 places без tags.
- [x] **City/Country tabs заполнены слабо**: `countries with content_blocks=1`, `cities with content_blocks=5`.

**Pulse:**
- [x] **0/10 events имеют координаты** (missing_coords=10).
- [x] **0/10 events имеют медиа** (missing_media_both=10: нет ни `image_media_id`, ни `image_url`).
- [x] Есть 1 event без `country_id` и 1 без `city_id` (broken ссылок нет).
- [x] Регистрации отсутствуют (0) — ожидаемо на стадии MVP.

**Blog:**
- [x] Blog заполнен и консистентен: 16/16 published, missing критичных полей = 0, дубликатов slug = 0.

---

## 4. Recommendations (без реализации)

### Приоритет 1: Исправить импорт/парсер

1. **Дополнить `SECTION_KEY_MAP`** в `packages/db/src/exportPlacesToNeon.ts`:
   - Добавить маппинги для showplace секций: `howToGet`, `service`, `nuances`, `localValue`
   - Обновить `SECTION_ORDER` и `SECTION_TITLES`

2. **Запустить экспорт для всех стран:**
   - Проверить, какие страны не экспортированы
   - Запустить `exportPlacesToNeon.ts` для всех стран
   - Импортировать SQL в Neon

3. **Валидация импорта:**
   - Добавить проверку, что все секции из markdown попали в content_blocks
   - Добавить проверку coverage (places → content_blocks)
   - Добавить проверку на **orphan content_blocks** (content_blocks.entity_id без записи в places/cities/countries)

4. **Медиа-метаданные и связи (сквозная проблема):**
   - Починить заполнение `media_files.size` (сейчас sum/avg = 0 при total=167)
   - Определить SSOT для places-галерей: если UI использует R2 listing — зафиксировать это как норму; если хотим хранить в Neon — нужно сидить/импортировать `hero_media_id` и/или `images`
   - Для Pulse: сидить/импортировать coords (`lat/lng`) и медиа (`image_media_id` или `image_url`), иначе UI неизбежно “пустой”

### Приоритет 2: Заполнить content_blocks

1. **Реимпорт существующих places:**
   - Перезапустить парсинг markdown для всех существующих places
   - Обновить content_blocks через UPSERT

2. **Проверка качества контента:**
   - Убедиться, что body_markdown не пустой и не слишком короткий
   - Проверить, что все секции присутствуют

### Приоритет 3: Добавить недостающие индексы

1. **Индексы для фильтров:**
   - `CREATE INDEX idx_places_place_kind ON places(place_kind);`
   - `CREATE INDEX idx_events_status ON events(status);`
   - `CREATE INDEX idx_articles_status ON articles(status);`
   - `CREATE INDEX idx_articles_published_at ON articles(published_at) WHERE status = 'published';`

2. **GIN индекс для tags (если нужен поиск):**
   - `CREATE INDEX idx_places_tags_gin ON places USING GIN(tags);`
   - `CREATE INDEX idx_articles_tags_gin ON articles USING GIN(tags);`

### Приоритет 4: Привести справочники к консистентности

1. **Убедиться, что все страны имеют:**
   - name, slug, code
   - content_blocks (если нужны)

2. **Убедиться, что все города имеют:**
   - name, slug, country_id
   - content_blocks (если нужны)

3. **Убедиться, что все places имеют:**
   - name, slug, place_kind, type
   - country_id или city_id (хотя бы одно)
   - coordinates (lat/lng)
   - tags
   - content_blocks (overview tab)

### Приоритет 5: Миграция legacy полей (долгосрочно)

1. **Удалить legacy поля после миграции:**
   - `places.latitude` / `places.longitude` → использовать только `lat`/`lng`
   - `events.start_date` / `events.end_date` → использовать только `start_at`/`end_at`
   - `articles.is_published` → использовать только `status`

---

## 5. Appendix

### 5.1 Ссылки на SQL-скрипты

- `scripts/audit/neon/01_schema_inventory.sql` — инвентаризация схемы
- `scripts/audit/neon/02_data_health_core.sql` — базовые проверки
- `scripts/audit/neon/03_data_health_atlas.sql` — Atlas модуль
- `scripts/audit/neon/04_data_health_pulse.sql` — Pulse модуль
- `scripts/audit/neon/05_data_health_blog.sql` — Blog модуль
- `scripts/audit/neon/06_data_health_rielt.sql` — Rielt модуль

### 5.2 Связанные документы

- `docs/audits/atlas_places_data_sources_audit.md` — аудит источников данных для карточек мест
- `docs/modules/atlas/atlas_card_canon_v1.md` — канон карточек Atlas
- `packages/db/src/exportPlacesToNeon.ts` — скрипт экспорта/парсинга

### 5.3 Инструкции "как запускать аудит"

См. раздел "How to Run Audit Scripts" выше.

---

**Конец документа**

**⚠️ ВАЖНО:** Заполните все поля `___` после запуска SQL-скриптов и обновите этот документ с реальными данными.
