-- Guide Engine v1 fixtures (staging/dev)
-- Safe to run multiple times (uses ON CONFLICT / fixed IDs).
--
-- Guides:
-- 1) strategic: digital-nomads-sea-2026
-- 2) route: first-week-in-bangkok

BEGIN;

-- -------------------------------------------------------------------
-- Upsert guides
-- -------------------------------------------------------------------

INSERT INTO guides (
  id, slug, title, summary, guide_type, status,
  tags, country_ids, city_ids,
  hero_r2_key, hero_url,
  published_at, created_at, updated_at
) VALUES (
  'guide_digital_nomads_sea_2026',
  'digital-nomads-sea-2026',
  'Digital nomads в ЮВА: сезон 2026',
  'Объективный справочник по жизни и работе в странах ЮВА: сезонность, инфраструктура, риски.',
  'strategic',
  'published',
  ARRAY['nomad','remote','sea'],
  ARRAY['th','vn','id','my','ph','sg','kh','la'],
  ARRAY[]::text[],
  'guides/digital-nomads-sea-2026/hero.jpg',
  NULL,
  now(),
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  guide_type = EXCLUDED.guide_type,
  status = EXCLUDED.status,
  tags = EXCLUDED.tags,
  country_ids = EXCLUDED.country_ids,
  city_ids = EXCLUDED.city_ids,
  hero_r2_key = EXCLUDED.hero_r2_key,
  hero_url = EXCLUDED.hero_url,
  published_at = EXCLUDED.published_at,
  updated_at = now();

INSERT INTO guides (
  id, slug, title, summary, guide_type, status,
  tags, country_ids, city_ids,
  hero_r2_key, hero_url,
  published_at, created_at, updated_at
) VALUES (
  'guide_first_week_in_bangkok',
  'first-week-in-bangkok',
  'Бангкок: первая неделя — что успеть',
  'Маршрут на 7 дней: районы, транспорт, связь, базовые дела.',
  'route',
  'verified',
  ARRAY['bangkok','route','transport'],
  ARRAY['th'],
  ARRAY['bkk'],
  'guides/first-week-in-bangkok/hero.jpg',
  NULL,
  now(),
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  guide_type = EXCLUDED.guide_type,
  status = EXCLUDED.status,
  tags = EXCLUDED.tags,
  country_ids = EXCLUDED.country_ids,
  city_ids = EXCLUDED.city_ids,
  hero_r2_key = EXCLUDED.hero_r2_key,
  hero_url = EXCLUDED.hero_url,
  published_at = EXCLUDED.published_at,
  updated_at = now();

-- -------------------------------------------------------------------
-- Sections (fixed UUIDs for deterministic references)
-- -------------------------------------------------------------------

-- guide_digital_nomads_sea_2026
INSERT INTO guide_sections (id, guide_id, tab_key, title, order_index, is_enabled)
VALUES
  ('11111111-1111-1111-1111-111111111111','guide_digital_nomads_sea_2026','overview','Обзор',0,true),
  ('11111111-1111-1111-1111-111111111112','guide_digital_nomads_sea_2026','practice','Практика',10,true),
  ('11111111-1111-1111-1111-111111111113','guide_digital_nomads_sea_2026','places','Места',20,true),
  ('11111111-1111-1111-1111-111111111114','guide_digital_nomads_sea_2026','experience','Опыт',30,true)
ON CONFLICT (guide_id, tab_key) DO UPDATE SET
  title = EXCLUDED.title,
  order_index = EXCLUDED.order_index,
  is_enabled = EXCLUDED.is_enabled,
  updated_at = now();

-- guide_first_week_in_bangkok
INSERT INTO guide_sections (id, guide_id, tab_key, title, order_index, is_enabled)
VALUES
  ('22222222-2222-2222-2222-222222222221','guide_first_week_in_bangkok','overview','Обзор',0,true),
  ('22222222-2222-2222-2222-222222222222','guide_first_week_in_bangkok','route','Маршрут / План',10,true),
  ('22222222-2222-2222-2222-222222222223','guide_first_week_in_bangkok','map','Карта',20,true),
  ('22222222-2222-2222-2222-222222222224','guide_first_week_in_bangkok','events','События',30,true)
ON CONFLICT (guide_id, tab_key) DO UPDATE SET
  title = EXCLUDED.title,
  order_index = EXCLUDED.order_index,
  is_enabled = EXCLUDED.is_enabled,
  updated_at = now();

-- -------------------------------------------------------------------
-- Blocks
-- -------------------------------------------------------------------

-- overview: rich_text (non-empty)
INSERT INTO guide_blocks (id, section_id, block_type, order_index, payload, is_empty)
VALUES
  ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1','11111111-1111-1111-1111-111111111111','rich_text',0,
   jsonb_build_object('markdown', 'Это обзорный блок (fixtures). Длина текста > 20 символов, значит вкладка непустая.'), false)
ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload, is_empty = EXCLUDED.is_empty, updated_at = now();

-- practice: bullets (non-empty)
INSERT INTO guide_blocks (id, section_id, block_type, order_index, payload, is_empty)
VALUES
  ('aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2','11111111-1111-1111-1111-111111111112','bullets',0,
   jsonb_build_object('items', jsonb_build_array('SIM и связь', 'Банки и карты', 'Медстраховка')), false)
ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload, is_empty = EXCLUDED.is_empty, updated_at = now();

-- places: divider only (empty), but section will still be visible via feed
INSERT INTO guide_blocks (id, section_id, block_type, order_index, payload, is_empty)
VALUES
  ('aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaa3','11111111-1111-1111-1111-111111111113','divider',0,
   '{}'::jsonb, true)
ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload, is_empty = EXCLUDED.is_empty, updated_at = now();

-- bangkok route: day_plan (non-empty)
INSERT INTO guide_blocks (id, section_id, block_type, order_index, payload, is_empty)
VALUES
  ('bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbb1','22222222-2222-2222-2222-222222222222','day_plan',0,
   jsonb_build_object('days', jsonb_build_array(
     jsonb_build_object('day', 1, 'title', 'Прилёт и связь', 'items', jsonb_build_array('SIM', 'Транспорт')),
     jsonb_build_object('day', 2, 'title', 'Районы', 'items', jsonb_build_array('Прогулка', 'Кафе'))
   )), false)
ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload, is_empty = EXCLUDED.is_empty, updated_at = now();

-- map: map_config (non-empty minimal)
INSERT INTO guide_blocks (id, section_id, block_type, order_index, payload, is_empty)
VALUES
  ('bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbb2','22222222-2222-2222-2222-222222222223','map_config',0,
   jsonb_build_object('center', jsonb_build_object('lat', 13.7563, 'lng', 100.5018), 'zoom', 11), false)
ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload, is_empty = EXCLUDED.is_empty, updated_at = now();

-- -------------------------------------------------------------------
-- Feeds
-- -------------------------------------------------------------------

-- strategic: places + experience feeds
INSERT INTO guide_feeds (id, guide_id, tab_key, source, filter, limit_count, sort, order_index, is_enabled)
VALUES
  ('ccccccc1-cccc-cccc-cccc-ccccccccccc1','guide_digital_nomads_sea_2026','places','atlas_places',
   jsonb_build_object('country_ids', jsonb_build_array('th','vn','id'), 'tags', jsonb_build_array('coworking','wifi')),
   12, 'relevance', 0, true),
  ('ccccccc2-cccc-cccc-cccc-ccccccccccc2','guide_digital_nomads_sea_2026','experience','blog',
   jsonb_build_object('tags', jsonb_build_array('nomad','sea')),
   10, 'newest', 0, true)
ON CONFLICT (guide_id, tab_key, source) DO UPDATE SET
  filter = EXCLUDED.filter,
  limit_count = EXCLUDED.limit_count,
  sort = EXCLUDED.sort,
  order_index = EXCLUDED.order_index,
  is_enabled = EXCLUDED.is_enabled,
  updated_at = now();

-- bangkok: events feed
INSERT INTO guide_feeds (id, guide_id, tab_key, source, filter, limit_count, sort, order_index, is_enabled)
VALUES
  ('ddddddd1-dddd-dddd-dddd-ddddddddddd1','guide_first_week_in_bangkok','events','pulse',
   jsonb_build_object('city_id', 'bkk', 'start_after', to_char(now(), 'YYYY-MM-DD')),
   20, 'date_asc', 0, true)
ON CONFLICT (guide_id, tab_key, source) DO UPDATE SET
  filter = EXCLUDED.filter,
  limit_count = EXCLUDED.limit_count,
  sort = EXCLUDED.sort,
  order_index = EXCLUDED.order_index,
  is_enabled = EXCLUDED.is_enabled,
  updated_at = now();

COMMIT;

