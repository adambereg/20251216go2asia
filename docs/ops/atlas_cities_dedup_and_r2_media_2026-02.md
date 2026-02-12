## Atlas / Города — дедупликация + R2-only медиа (2026-02)

### Цели
- Канон города: `cities.id` остаётся коротким, `cities.slug` становится SEO (`kuala-lumpur`, `singapore`, …)
- Старые/альтернативные slugs не ломаются: резолвинг через `city_aliases`
- Мультиязычность: `cities.names` (`ru`, `en`)
- Медиа городов: **только R2** `city/<seo-slug>/hero.jpg` (если есть) иначе `city/<seo-slug>/01.jpg`, иначе `null`
- Никаких pexels fallback в API/UI

---

## 1) Список изменений (файлы)

### БД / миграции
- `packages/db/src/schema/content.ts`
  - добавлено поле `cities.names jsonb`
  - добавлена таблица `city_aliases`
- `packages/db/migrations/0003_foamy_bullseye.sql`
  - DDL: `city_aliases` + `cities.names` (и сопутствующие missing-DDL изменения, если окружение отставало)
- `packages/db/migrations/0004_atlas_city_dedup_and_names.sql`
  - DML: merge 6 пар дублей, заполнение `names.en`, перенос slug, создание алиасов, перенос связей, удаление дублей

### Резолвинг / API
- `packages/db/src/queries/content.ts`
  - `getCityIdByIdOrSlug` теперь резолвит `cities.id|cities.slug|city_aliases.alias_slug`
- `apps/content-service/src/index.ts`
  - новый endpoint `GET /v1/content/cities/:idOrSlug`
  - `toContentCityWithMedia` теперь R2-only (hero.jpg > 01.jpg), без pexels

### UI
- `apps/go2asia-pwa-shell/app/(public)/atlas/cities/CitiesClient.tsx`
  - убран API→mock fallback (чтобы не маскировать проблемы и не тащить demo pexels)
- `apps/go2asia-pwa-shell/app/(public)/atlas/cities/[id]/layout.tsx`
  - убран runtime fallback на pexels, hero берётся из API (`cityData.heroImage`) или `null`

---

## 2) SQL (DDL)

DDL создаётся в миграции:
- `packages/db/migrations/0003_foamy_bullseye.sql`

Ключевые части:
- `ALTER TABLE cities ADD COLUMN names jsonb;`
- `CREATE TABLE city_aliases (...)` + уникальность `(country_id, alias_slug)`

---

## 3) SQL (merge 6 пар дублей)

SQL находится в:
- `packages/db/migrations/0004_atlas_city_dedup_and_names.sql`

Пары:
- Singapore: `sin` (канон) ← `sgp` (дубль), slug `singapore`
- Kuala Lumpur: `kul` ← `kll`, slug `kuala-lumpur`
- Phuket: `hkt` ← `phk`, slug `phuket`
- Yogyakarta: `jog` ← `yog`, slug `yogyakarta`
- Savannakhet: `svn` ← `svk`, slug `savannakhet`
- Melaka: `mlk` ← `mkz`, slug `melaka`

Алгоритм (для каждой пары):
- временно меняем slug дубля, чтобы не конфликтовать с `cities.slug UNIQUE`
- на каноне выставляем SEO slug
- переносим `names.en` из дубля
- создаём алиасы: `{canonicalShortSlug, duplicateId, seoSlug}`
- переносим связи: `places.city_id`, `events.city_id`, `content_blocks(entity_type='city').entity_id`
- удаляем дубль из `cities`

---

## 4) Проверки (SQL)

### 4.1 Дубли удалены
```sql
SELECT id, country_id, slug, name
FROM cities
WHERE id IN ('sgp','kll','phk','yog','svk','mkz');
```

Ожидаемо: 0 строк.

### 4.2 Каноны имеют SEO slug и names.en
```sql
SELECT
  id,
  country_id,
  slug,
  name,
  names->>'ru' AS name_ru,
  names->>'en' AS name_en
FROM cities
WHERE id IN ('sin','kul','hkt','jog','svn','mlk')
ORDER BY id;
```

### 4.3 Алиасы на месте
```sql
SELECT country_id, alias_slug, city_id
FROM city_aliases
WHERE alias_slug IN (
  'sin','sgp','singapore',
  'kul','kll','kuala-lumpur',
  'hkt','phk','phuket',
  'jog','yog','yogyakarta',
  'svn','svk','savannakhet',
  'mlk','mkz','melaka'
)
ORDER BY country_id, alias_slug;
```

---

## 5) Проверки (HTTP)

После применения миграций + деплоя `content-service`:
- `GET /v1/content/cities/singapore` → возвращает DTO с `id=sin`, `slug=singapore`
- `GET /v1/content/cities/sin` → возвращает DTO с `id=sin`, `slug=singapore`

---

## 6) Подтверждение R2-only и “без Pexels”

Города:
- `content-service` выбирает hero строго из R2 (`city/<slug>/hero.jpg` > `city/<slug>/01.jpg`)
- `media_files.public_url` (pexels) для городов больше **не используется** для `heroImage`

UI:
- в API-режиме нет fallback на mock/pexels, при `heroImage=null` показывается плейсхолдер.

