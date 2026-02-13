-- Laos pilot import (1 place)
-- Запускать в Neon SQL Editor целиком.
-- Цель: импортировать только 1 place + его overview/ru content_block:
-- - place.id = vte-pha-that-luang
-- - content_blocks(entity_type='place', tab_key='overview', lang='ru')

BEGIN;

-- ---------------------------------------------------------------------------
-- UPSERT places (1 row)
-- Source: exports/neon/laos/places.sql (filtered)
-- ---------------------------------------------------------------------------

-- Place: 🛕 Pha That Luang (Vientiane)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'vte-pha-that-luang',
  'la',
  'vte',
  '🛕 Pha That Luang',
  'vte-pha-that-luang',
  'stupa',
  'showplace',
  'stupa',
  '["stupa","national-symbol","buddhism"]'::jsonb,
  'Главный национальный символ Лаоса — золотая ступа, олицетворяющая буддизм, независимость и культурную идентичность страны.',
  17.9757,
  102.6331,
  'That Luang, Vientiane',
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

-- Content block for: 🛕 Pha That Luang
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vte-pha-that-luang',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самая важная святыня Лаоса  
- 🌍 Символ государственности и буддизма  
- 📸 Золотая ступа на фоне неба

## Структура комплекса

- 🛕 Главную ступу  
- 🚶 Прогулку по храмовому комплексу  
- 📷 Осмотр внутренних дворов

## Билеты и посещение

- 💰 ~30 000 LAK  
- 🎟️ Билет на входе  
- 🆓 Внешняя территория бесплатна

## Лучшие точки для фото

- 📷 Золотую ступу  
- 📷 Симметрию комплекса  
- 🌅 Свет на закате

## Практическая информация

- **Адрес:** That Luang, Vientiane  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси / тук-тук  
- 🛵 Байк  
- 🗺️ Северо-восток центра Вьентьяна

## 🔷 Коммуникация и сервис

- 🕒 08:00–16:00  
- 🌐 Лаосский, английский  
- 📶 Интернет отсутствует  
- 💳 Наличные

## Полезные нюансы

- ⚠️ Строгий дресс-код  
- 🌞 Лучше посещать утром  
- 👕 Закрытые плечи и колени  
- 🐾 —

## Локальная ценность

Pha That Luang — духовное сердце страны и место проведения национальных праздников.
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
WHERE id = 'vte-pha-that-luang';

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
  AND entity_id = 'vte-pha-that-luang'
  AND tab_key = 'overview'
  AND lang = 'ru';

-- 3) Key section presence checks (boolean flags)
SELECT
  entity_id,
  (body_markdown LIKE '%Почему это важно%') AS has_why,
  (body_markdown LIKE '%Структура комплекса%') AS has_structure,
  (body_markdown LIKE '%Билеты и посещение%') AS has_tickets,
  (body_markdown LIKE '%Как добраться%') AS has_how_to_get,
  (body_markdown LIKE '%Коммуникация%') AS has_service_raw,
  (body_markdown LIKE '%Полезные нюансы%') AS has_nuances,
  (body_markdown LIKE '%Локальная ценность%') AS has_local_value,
  (body_markdown LIKE '%Практическая информация%') AS has_practical_info
FROM content_blocks
WHERE entity_type = 'place'
  AND entity_id = 'vte-pha-that-luang'
  AND tab_key = 'overview'
  AND lang = 'ru';

