# Atlas Asia — фильтры и сортировка в разделе «Города» (2026‑02)

## Цель
Добавить систему фильтров/сортировки на странице ` /atlas/cities ` с сохранением состояния в URL query params и **серверной** фильтрацией (без client-side фильтрации 100–500+ записей).

## Изменения в БД (Neon, таблица `cities`)
Добавлены редакторские признаки (nullable = означает «Все»):

- `city_type atlas_city_type` — тип города (enum)
- `city_size atlas_city_size` — размер города (enum)
- `has_sea boolean` — есть море
- `price_level atlas_city_price_level` — уровень цен (enum)
- `nightlife_level atlas_city_nightlife_level` — ночная жизнь (enum)

### Enum значения
- `atlas_city_type`: `resort | cultural | business | nature | island | mountain | historic | mixed | other`
- `atlas_city_size`: `small | medium | large | capital`
- `atlas_city_price_level`: `budget | mid | expensive`
- `atlas_city_nightlife_level`: `active | moderate | calm`

### Индексы (минимум)
Добавлены btree индексы:
- `idx_cities_city_type` (`city_type`)
- `idx_cities_city_size` (`city_size`)
- `idx_cities_has_sea` (`has_sea`)
- `idx_cities_price_level` (`price_level`)
- `idx_cities_nightlife_level` (`nightlife_level`)

Миграция: `packages/db/migrations/0005_atlas_city_filters.sql`.

## API (content-service)
Endpoint списка городов поддерживает query params и возвращает **уже отфильтрованный** список:

`GET /v1/content/cities?countryId=&q=&type=&size=&sea=&price=&nightlife=&sort=&limit=`

Параметры:
- `countryId` (optional)
- `q` (optional) — поиск по `names.ru` и `names.en` (ILIKE)
- `type` (optional) — значение `atlas_city_type`
- `size` (optional) — значение `atlas_city_size`
- `sea` (optional) — `true|false`
- `price` (optional) — значение `atlas_city_price_level`
- `nightlife` (optional) — значение `atlas_city_nightlife_level`
- `sort` (optional):
  - `size_desc` (default) — «сначала крупные» (`capital > large > medium > small > null`)
  - `name_asc`
  - `name_desc`
- `limit` (optional, default `200`, max `500`) — задел под будущую пагинацию

## UI
Страница ` /atlas/cities `:
- строка поиска по названию города
- основные фильтры: страна / тип / размер / море
- сортировка: «сначала крупные» (default), А→Я, Я→А
- «Расширенные фильтры» (свернуты по умолчанию): уровень цен, ночная жизнь
- «Сбросить» очищает все фильтры
- состояние фильтров хранится в URL query params

