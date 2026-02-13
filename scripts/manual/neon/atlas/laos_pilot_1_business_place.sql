-- Laos pilot import (1 business place)
-- Запускать в Neon SQL Editor целиком.
-- Цель: импортировать только 1 business place + его overview/ru content_block:
-- - place.id = vte-kualao-restaurant
-- - content_blocks(entity_type='place', tab_key='overview', lang='ru')
--
-- Почему выбрано это место (эталон business):
-- - place_kind = business
-- - есть coords/tags/description_short (не будет skipped)
-- - в overview присутствуют секции, характерные для business:
--   "Что попробовать обязательно", "Коммуникация и сервис", "Полезные нюансы", "Практическая информация"
--   (и доп. секции/сырьевые секции также не должны теряться)

BEGIN;

-- ---------------------------------------------------------------------------
-- UPSERT places (1 row)
-- Source: exports/neon/laos/places.sql (filtered)
-- ---------------------------------------------------------------------------

-- Place: 🍽️ Kualao Restaurant (Vientiane)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'vte-kualao-restaurant',
  'la',
  'vte',
  '🍽️ Kualao Restaurant',
  'vte-kualao-restaurant',
  'lao-food',
  'business',
  'lao-food',
  '["lao-food","heritage","restaurant"]'::jsonb,
  'Классический ресторан лаосской кухни в центре Вьентьяна, популярный среди дипломатов и гостей города.',
  17.9688,
  102.6063,
  'Vientiane Centre',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- ---------------------------------------------------------------------------
-- UPSERT content_blocks (overview/ru) (1 row)
-- Source: exports/neon/laos/content_blocks.sql (filtered)
-- ---------------------------------------------------------------------------

-- Content block for: 🍽️ Kualao Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vte-kualao-restaurant',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽 Традиционные блюда  
- 🍚 Липкий рис  
- 🍲 Сеты лаосской кухни

## Как добраться

- 🚕 Такси  
- 🚶 Пешком из центра  
- 🗺️ Центральный Вьентьян

## Полезные нюансы

- ⚠️ Спокойная атмосфера  
- 🌞 Подходит для вечера  
- 👕 Smart casual  
- 🐾 —

## Локальная ценность

Ресторан сохраняет и продвигает гастрономическое наследие Лаоса.

## Лучшие точки для фото

- 📷 Интерьер  
- 📷 Подачу блюд  
- 🌅 Вечерний свет

## Практическая информация

- **Адрес:** Vientiane Centre  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Эталон лаосской кухни  
- 🌍 Культурное заведение столицы  
- 📸 Элегантный интерьер

## Билеты и посещение

- 💰 Средний–высокий чек  
- 🎟️ Бронирование желательно  
- 🆓 —

## 🔷 Коммуникация и сервис

- 🕒 11:00–22:00  
- 🌐 Лаосский, английский  
- 📶 Wi-Fi  
- 💳 Карты, наличные
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

COMMIT;

-- ---------------------------------------------------------------------------
-- Post-checks (Neon SQL Editor output)
-- ---------------------------------------------------------------------------

-- 1) Place row (by id)
SELECT
  id,
  country_id,
  city_id,
  slug,
  name,
  place_kind,
  tags,
  lat,
  lng,
  updated_at
FROM places
WHERE id = 'vte-kualao-restaurant';

-- 2) content_blocks overview/ru (by entity_id)
SELECT
  entity_type,
  entity_id,
  tab_key,
  lang,
  source,
  updated_at,
  length(body_markdown) AS body_len
FROM content_blocks
WHERE entity_type = 'place'
  AND entity_id = 'vte-kualao-restaurant'
  AND tab_key = 'overview'
  AND lang = 'ru';

-- 3) Key business section presence checks (boolean flags)
SELECT
  entity_id,
  (body_markdown LIKE '%Что попробовать обязательно%') AS has_must_try,
  (body_markdown LIKE '%Цены%') AS has_prices_heading,
  (body_markdown LIKE '%Средний%чек%') AS has_price_signal,
  (body_markdown LIKE '%Коммуникация%') AS has_service_raw,
  (body_markdown LIKE '%Полезные нюансы%') AS has_nuances,
  (body_markdown LIKE '%Практическая информация%') AS has_practical_info,
  (body_markdown LIKE '%Как добраться%') AS has_how_to_get,
  (body_markdown LIKE '%Почему%') AS has_why
FROM content_blocks
WHERE entity_type = 'place'
  AND entity_id = 'vte-kualao-restaurant'
  AND tab_key = 'overview'
  AND lang = 'ru';

