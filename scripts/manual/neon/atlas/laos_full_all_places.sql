-- Laos full import (all places + overview/ru)
-- Р—Р°РїСѓСЃРєР°С‚СЊ РІ Neon SQL Editor С†РµР»РёРєРѕРј.
-- РСЃС‚РѕС‡РЅРёРє РґР°РЅРЅС‹С…: exports/neon/laos/places.sql + exports/neon/laos/content_blocks.sql

BEGIN;
-- Places UPSERT (idempotent)
-- Generated from Atlas Content Canon v1 markdown files

-- Place: рџ›• Pha That Luang (Vientiane)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'vte-pha-that-luang',
  'la',
  'vte',
  'рџ›• Pha That Luang',
  'vte-pha-that-luang',
  'stupa',
  'showplace',
  'stupa',
  '["stupa","national-symbol","buddhism"]'::jsonb,
  'Р“Р»Р°РІРЅС‹Р№ РЅР°С†РёРѕРЅР°Р»СЊРЅС‹Р№ СЃРёРјРІРѕР» Р›Р°РѕСЃР° вЂ” Р·РѕР»РѕС‚Р°СЏ СЃС‚СѓРїР°, РѕР»РёС†РµС‚РІРѕСЂСЏСЋС‰Р°СЏ Р±СѓРґРґРёР·Рј, РЅРµР·Р°РІРёСЃРёРјРѕСЃС‚СЊ Рё РєСѓР»СЊС‚СѓСЂРЅСѓСЋ РёРґРµРЅС‚РёС‡РЅРѕСЃС‚СЊ СЃС‚СЂР°РЅС‹.',
  17.9757,
  102.6331,
  'That Luang, Vientiane',
  'вЂ”',
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


-- Content Blocks UPSERT (idempotent)
-- Generated from Atlas Content Canon v1 markdown files

-- Content block for: рџ›• Pha That Luang
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vte-pha-that-luang',
  'overview',
  'ru',
  NULL,
  '## РџРѕС‡РµРјСѓ СЌС‚Рѕ РІР°Р¶РЅРѕ?

- рџЊџ РЎР°РјР°СЏ РІР°Р¶РЅР°СЏ СЃРІСЏС‚С‹РЅСЏ Р›Р°РѕСЃР°  
- рџЊЌ РЎРёРјРІРѕР» РіРѕСЃСѓРґР°СЂСЃС‚РІРµРЅРЅРѕСЃС‚Рё Рё Р±СѓРґРґРёР·РјР°  
- рџ“ё Р—РѕР»РѕС‚Р°СЏ СЃС‚СѓРїР° РЅР° С„РѕРЅРµ РЅРµР±Р°

## РЎС‚СЂСѓРєС‚СѓСЂР° РєРѕРјРїР»РµРєСЃР°

- рџ›• Р“Р»Р°РІРЅСѓСЋ СЃС‚СѓРїСѓ  
- рџљ¶ РџСЂРѕРіСѓР»РєСѓ РїРѕ С…СЂР°РјРѕРІРѕРјСѓ РєРѕРјРїР»РµРєСЃСѓ  
- рџ“· РћСЃРјРѕС‚СЂ РІРЅСѓС‚СЂРµРЅРЅРёС… РґРІРѕСЂРѕРІ

## Р‘РёР»РµС‚С‹ Рё РїРѕСЃРµС‰РµРЅРёРµ

- рџ’° ~30 000 LAK  
- рџЋџпёЏ Р‘РёР»РµС‚ РЅР° РІС…РѕРґРµ  
- рџ†“ Р’РЅРµС€РЅСЏСЏ С‚РµСЂСЂРёС‚РѕСЂРёСЏ Р±РµСЃРїР»Р°С‚РЅР°

## Р›СѓС‡С€РёРµ С‚РѕС‡РєРё РґР»СЏ С„РѕС‚Рѕ

- рџ“· Р—РѕР»РѕС‚СѓСЋ СЃС‚СѓРїСѓ  
- рџ“· РЎРёРјРјРµС‚СЂРёСЋ РєРѕРјРїР»РµРєСЃР°  
- рџЊ… РЎРІРµС‚ РЅР° Р·Р°РєР°С‚Рµ

## РџСЂР°РєС‚РёС‡РµСЃРєР°СЏ РёРЅС„РѕСЂРјР°С†РёСЏ

- **РђРґСЂРµСЃ:** That Luang, Vientiane  
- **РЎР°Р№С‚:** вЂ”  
- **РўРµР»РµС„РѕРЅ:** вЂ”

## РљР°Рє РґРѕР±СЂР°С‚СЊСЃСЏ

- рџљ• РўР°РєСЃРё / С‚СѓРє-С‚СѓРє  
- рџ›µ Р‘Р°Р№Рє  
- рџ—єпёЏ РЎРµРІРµСЂРѕ-РІРѕСЃС‚РѕРє С†РµРЅС‚СЂР° Р’СЊРµРЅС‚СЊСЏРЅР°

## рџ”· РљРѕРјРјСѓРЅРёРєР°С†РёСЏ Рё СЃРµСЂРІРёСЃ

- рџ•’ 08:00вЂ“16:00  
- рџЊђ Р›Р°РѕСЃСЃРєРёР№, Р°РЅРіР»РёР№СЃРєРёР№  
- рџ“¶ РРЅС‚РµСЂРЅРµС‚ РѕС‚СЃСѓС‚СЃС‚РІСѓРµС‚  
- рџ’і РќР°Р»РёС‡РЅС‹Рµ

## РџРѕР»РµР·РЅС‹Рµ РЅСЋР°РЅСЃС‹

- вљ пёЏ РЎС‚СЂРѕРіРёР№ РґСЂРµСЃСЃ-РєРѕРґ  
- рџЊћ Р›СѓС‡С€Рµ РїРѕСЃРµС‰Р°С‚СЊ СѓС‚СЂРѕРј  
- рџ‘• Р—Р°РєСЂС‹С‚С‹Рµ РїР»РµС‡Рё Рё РєРѕР»РµРЅРё  
- рџђѕ вЂ”

## Р›РѕРєР°Р»СЊРЅР°СЏ С†РµРЅРЅРѕСЃС‚СЊ

Pha That Luang вЂ” РґСѓС…РѕРІРЅРѕРµ СЃРµСЂРґС†Рµ СЃС‚СЂР°РЅС‹ Рё РјРµСЃС‚Рѕ РїСЂРѕРІРµРґРµРЅРёСЏ РЅР°С†РёРѕРЅР°Р»СЊРЅС‹С… РїСЂР°Р·РґРЅРёРєРѕРІ.
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

-- 1) РЎРєРѕР»СЊРєРѕ places РїРѕ Р›Р°РѕСЃСѓ
SELECT count(*) AS laos_places_total
FROM places
WHERE country_id='la';

-- 2) РџРѕРєСЂС‹С‚РёРµ overview/ru РїРѕ places Р›Р°РѕСЃР°
SELECT
  count(*) AS places_total,
  count(cb.entity_id) AS places_with_overview
FROM places p
LEFT JOIN (
  SELECT DISTINCT entity_id
  FROM content_blocks
  WHERE entity_type = 'place' AND tab_key = 'overview' AND lang = 'ru'
) cb ON cb.entity_id = p.id
WHERE p.country_id = 'la';

-- 3) РўРѕРї-10 СЃР°РјС‹С… РєРѕСЂРѕС‚РєРёС… overview
SELECT entity_id, length(body_markdown) AS len
FROM content_blocks
WHERE entity_type='place' AND tab_key='overview' AND lang='ru'
  AND entity_id IN (SELECT id FROM places WHERE country_id='la')
ORDER BY len ASC
LIMIT 10;

-- 4) Orphan content_blocks (global + Laos)
SELECT count(*) AS orphan_blocks_global
FROM content_blocks cb
LEFT JOIN places p ON p.id = cb.entity_id
WHERE cb.entity_type='place' AND p.id IS NULL;

SELECT count(*) AS orphan_blocks_laos
FROM content_blocks cb
LEFT JOIN places p ON p.id = cb.entity_id
WHERE cb.entity_type='place'
  AND p.id IS NULL
  AND (
    cb.entity_id LIKE 'lpq-%'
    OR cb.entity_id LIKE 'vte-%'
    OR cb.entity_id LIKE 'vvg-%'
    OR cb.entity_id LIKE 'pkz-%'
    OR cb.entity_id LIKE 'svk-%'
  );
