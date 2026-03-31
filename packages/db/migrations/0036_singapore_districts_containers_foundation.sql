-- ============================================================================
-- 0036_singapore_districts_containers_foundation.sql
-- Singapore batch foundation pass (country-level, bounded)
-- Scope: add curated districts/containers and place linkage for existing SG places
-- Source input:
-- - content/atlas/singapore/singapore-places-districts.md
-- - content/atlas/singapore/Singapore-Districts-Containers.md
-- ============================================================================

WITH target_cities AS (
  SELECT DISTINCT ON (cfg.city_code)
    cfg.city_code,
    cfg.city_slug,
    cfg.city_alias,
    co.id AS country_id,
    ci.id AS city_id
  FROM (
    VALUES
      ('sgp', 'singapore', 'sin')
  ) AS cfg(city_code, city_slug, city_alias)
  JOIN countries co
    ON (co.id = 'sg' OR co.slug IN ('sg', 'singapore'))
  JOIN cities ci
    ON ci.country_id = co.id
   AND (
     ci.id = cfg.city_code
     OR ci.id = COALESCE(cfg.city_alias, '')
     OR ci.slug IN (
       cfg.city_code,
       cfg.city_slug,
       replace(cfg.city_slug, '-', ''),
       COALESCE(cfg.city_alias, '')
     )
   )
  ORDER BY
    cfg.city_code,
    CASE WHEN co.id = 'sg' THEN 0 WHEN co.slug = 'singapore' THEN 1 ELSE 2 END,
    CASE
      WHEN ci.id = cfg.city_code THEN 0
      WHEN ci.slug = cfg.city_slug THEN 1
      WHEN cfg.city_alias IS NOT NULL AND (ci.id = cfg.city_alias OR ci.slug = cfg.city_alias) THEN 2
      WHEN ci.slug = replace(cfg.city_slug, '-', '') THEN 3
      ELSE 4
    END
),
district_values AS (
  SELECT *
  FROM (
    VALUES
      ('sgp','sgp-district-marina-bay-civic-core','marina-bay-civic-core','Marina Bay / Civic Core','滨海湾 / 市政区',
       'Главный postcard и civic contour вокруг Marina Bay, Merlion, MBS, National Gallery и waterfront promenade.',
       E'Главный postcard и civic contour вокруг Marina Bay, Merlion, MBS, National Gallery и waterfront promenade.\n\nПодходит для:\n- первого знакомства с Сингапуром;\n- skyline views, waterfront и civic landmarks;\n- классических city highlights у Marina Bay.',
       10),
      ('sgp','sgp-district-bugis-bras-basah','bugis-bras-basah','Bugis / Bras Basah','武吉士 / 勿拉士巴沙',
       'Central heritage-and-lifestyle contour Bugis / Bras Basah / Beach Road с историческими отелями, барами и культурными институциями.',
       E'Central heritage-and-lifestyle contour Bugis / Bras Basah / Beach Road с историческими отелями, барами и культурными институциями.\n\nПодходит для:\n- исторических отелей и коктейльных баров;\n- вечерней городской атмосферы;\n- city walks между heritage и modern Singapore.',
       20),
      ('sgp','sgp-district-telok-ayer-chinatown-food-core','telok-ayer-chinatown-food-core','Telok Ayer / Chinatown Food Core','直落亚逸 / 牛车水',
       'Плотный hawker-and-food contour в старом торговом ядре между Telok Ayer, Boon Tat Street и Chinatown.',
       E'Плотный hawker-and-food contour в старом торговом ядре между Telok Ayer, Boon Tat Street и Chinatown.\n\nПодходит для:\n- hawker centres и food walks;\n- Chinatown/Telok Ayer atmosphere;\n- локальной городской гастрономии.',
       30),
      ('sgp','sgp-district-singapore-river-clarke-quay','singapore-river-clarke-quay','Singapore River / Clarke Quay','新加坡河 / 克拉码头',
       'Riverside entertainment contour вдоль Singapore River вокруг Clarke Quay, Boat Quay и Riverside Point.',
       E'Riverside entertainment contour вдоль Singapore River вокруг Clarke Quay, Boat Quay и Riverside Point.\n\nПодходит для:\n- riverside dining;\n- вечерних прогулок у воды;\n- nightlife и городской leisure-среды.',
       40),
      ('sgp','sgp-district-changi-airport-east','changi-airport-east','Changi Airport / East','樟宜机场',
       'Восточный airport-and-transit contour вокруг Changi Airport и Jewel как отдельный lifestyle-and-transit cluster.',
       E'Восточный airport-and-transit contour вокруг Changi Airport и Jewel как отдельный lifestyle-and-transit cluster.\n\nПодходит для:\n- transit stopovers;\n- airport-side leisure и shopping;\n- icon-level indoor attractions.',
       50),
      ('sgp','sgp-district-sentosa-island-resort-zone','sentosa-island-resort-zone','Sentosa Island Resort Zone','圣淘沙',
       'Островной resort contour к югу от main island с beaches, attractions и leisure-driven city escapes.',
       E'Островной resort contour к югу от main island с beaches, attractions и leisure-driven city escapes.\n\nПодходит для:\n- resort-style отдыха;\n- beaches и family attractions;\n- short leisure escapes из city core.',
       60),
      ('sgp','sgp-district-tanglin-botanic-gardens','tanglin-botanic-gardens','Tanglin / Botanic Gardens','东陵 / 植物园',
       'Зелёный garden-and-embassy contour Orchard/Tanglin вокруг Singapore Botanic Gardens с более спокойным city rhythm.',
       E'Зелёный garden-and-embassy contour Orchard/Tanglin вокруг Singapore Botanic Gardens с более спокойным city rhythm.\n\nПодходит для:\n- gardens и outdoor walks;\n- более спокойного Singapore experience;\n- heritage greenery и park time.',
       70)
  ) AS t(city_code, id, slug, name, name_local, description_short, body_markdown, sort_order)
)
INSERT INTO city_districts (
  id,
  country_id,
  city_id,
  slug,
  name,
  name_local,
  description_short,
  body_markdown,
  sort_order,
  is_published
)
SELECT
  d.id,
  tc.country_id,
  tc.city_id,
  d.slug,
  d.name,
  d.name_local,
  d.description_short,
  d.body_markdown,
  d.sort_order,
  true
FROM district_values d
JOIN target_cities tc ON tc.city_code = d.city_code
ON CONFLICT (id) DO UPDATE
SET
  country_id = EXCLUDED.country_id,
  city_id = EXCLUDED.city_id,
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  name_local = EXCLUDED.name_local,
  description_short = EXCLUDED.description_short,
  body_markdown = EXCLUDED.body_markdown,
  sort_order = EXCLUDED.sort_order,
  is_published = EXCLUDED.is_published,
  updated_at = now();
--> statement-breakpoint

WITH target_cities AS (
  SELECT DISTINCT ON (cfg.city_code)
    cfg.city_code,
    cfg.city_slug,
    cfg.city_alias,
    co.id AS country_id,
    ci.id AS city_id
  FROM (
    VALUES
      ('sgp', 'singapore', 'sin')
  ) AS cfg(city_code, city_slug, city_alias)
  JOIN countries co
    ON (co.id = 'sg' OR co.slug IN ('sg', 'singapore'))
  JOIN cities ci
    ON ci.country_id = co.id
   AND (
     ci.id = cfg.city_code
     OR ci.id = COALESCE(cfg.city_alias, '')
     OR ci.slug IN (
       cfg.city_code,
       cfg.city_slug,
       replace(cfg.city_slug, '-', ''),
       COALESCE(cfg.city_alias, '')
     )
   )
  ORDER BY
    cfg.city_code,
    CASE WHEN co.id = 'sg' THEN 0 WHEN co.slug = 'singapore' THEN 1 ELSE 2 END,
    CASE
      WHEN ci.id = cfg.city_code THEN 0
      WHEN ci.slug = cfg.city_slug THEN 1
      WHEN cfg.city_alias IS NOT NULL AND (ci.id = cfg.city_alias OR ci.slug = cfg.city_alias) THEN 2
      WHEN ci.slug = replace(cfg.city_slug, '-', '') THEN 3
      ELSE 4
    END
),
district_map AS (
  SELECT tc.city_code, d.id, d.slug
  FROM city_districts d
  JOIN target_cities tc ON tc.city_id = d.city_id
),
container_values AS (
  SELECT *
  FROM (
    VALUES
      ('sgp','sgp-container-marina-bay-waterfront','marina-bay-waterfront','Marina Bay Waterfront','urban-waterfront-cluster','marina-bay-civic-core',
       'Главный waterfront cluster: Bay promenade, skyline, Merlion и bay-facing landmarks.'),
      ('sgp','sgp-container-gardens-by-the-bay','gardens-by-the-bay','Gardens by the Bay','urban-garden-cluster','marina-bay-civic-core',
       'Самостоятельный garden-destination у Marina Bay: Supertrees, conservatories и park-scale attractions.'),
      ('sgp','sgp-container-lau-pa-sat','lau-pa-sat','Lau Pa Sat','hawker-market-cluster','telok-ayer-chinatown-food-core',
       'Historic hawker-market cluster на Boon Tat Street как отдельная food destination downtown Singapore.'),
      ('sgp','sgp-container-jewel-changi','jewel-changi','Jewel Changi','airport-lifestyle-cluster','changi-airport-east',
       'Airport-lifestyle cluster у Changi: indoor waterfall, retail и entertainment.'),
      ('sgp','sgp-container-sentosa-island','sentosa-island','Sentosa Island','island-resort-cluster','sentosa-island-resort-zone',
       'Самостоятельный island-resort cluster, а не единичная точка.'),
      ('sgp','sgp-container-singapore-botanic-gardens','singapore-botanic-gardens','Singapore Botanic Gardens','botanic-garden-cluster','tanglin-botanic-gardens',
       'Крупный garden cluster и UNESCO-linked green destination.')
  ) AS t(city_code, id, slug, name, container_type, district_slug, description_short)
)
INSERT INTO place_containers (
  id,
  country_id,
  city_id,
  district_id,
  slug,
  name,
  container_type,
  description_short,
  is_published
)
SELECT
  c.id,
  tc.country_id,
  tc.city_id,
  d.id,
  c.slug,
  c.name,
  c.container_type,
  c.description_short,
  true
FROM container_values c
JOIN target_cities tc ON tc.city_code = c.city_code
JOIN district_map d ON d.city_code = c.city_code AND d.slug = c.district_slug
ON CONFLICT (id) DO UPDATE
SET
  country_id = EXCLUDED.country_id,
  city_id = EXCLUDED.city_id,
  district_id = EXCLUDED.district_id,
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  container_type = EXCLUDED.container_type,
  description_short = EXCLUDED.description_short,
  is_published = EXCLUDED.is_published,
  updated_at = now();
--> statement-breakpoint

WITH target_cities AS (
  SELECT DISTINCT ON (cfg.city_code)
    cfg.city_code,
    cfg.city_slug,
    cfg.city_alias,
    co.id AS country_id,
    ci.id AS city_id
  FROM (
    VALUES
      ('sgp', 'singapore', 'sin')
  ) AS cfg(city_code, city_slug, city_alias)
  JOIN countries co
    ON (co.id = 'sg' OR co.slug IN ('sg', 'singapore'))
  JOIN cities ci
    ON ci.country_id = co.id
   AND (
     ci.id = cfg.city_code
     OR ci.id = COALESCE(cfg.city_alias, '')
     OR ci.slug IN (
       cfg.city_code,
       cfg.city_slug,
       replace(cfg.city_slug, '-', ''),
       COALESCE(cfg.city_alias, '')
     )
   )
  ORDER BY
    cfg.city_code,
    CASE WHEN co.id = 'sg' THEN 0 WHEN co.slug = 'singapore' THEN 1 ELSE 2 END,
    CASE
      WHEN ci.id = cfg.city_code THEN 0
      WHEN ci.slug = cfg.city_slug THEN 1
      WHEN cfg.city_alias IS NOT NULL AND (ci.id = cfg.city_alias OR ci.slug = cfg.city_alias) THEN 2
      WHEN ci.slug = replace(cfg.city_slug, '-', '') THEN 3
      ELSE 4
    END
),
district_map AS (
  SELECT tc.city_code, d.id, d.slug
  FROM city_districts d
  JOIN target_cities tc ON tc.city_id = d.city_id
),
container_map AS (
  SELECT tc.city_code, c.id, c.slug
  FROM place_containers c
  JOIN target_cities tc ON tc.city_id = c.city_id
),
place_mapping AS (
  SELECT *
  FROM (
    VALUES
      ('sgp','sgp-atlas-rooftop-bar','bugis-bras-basah',NULL),
      ('sgp','sgp-gardens-by-the-bay','marina-bay-civic-core','gardens-by-the-bay'),
      ('sgp','sgp-jewel-changi-airport','changi-airport-east','jewel-changi'),
      ('sgp','sgp-jumbo-seafood','singapore-river-clarke-quay',NULL),
      ('sgp','sgp-lau-pa-sat-hawker-centre','telok-ayer-chinatown-food-core','lau-pa-sat'),
      ('sgp','sgp-long-bar','bugis-bras-basah',NULL),
      ('sgp','sgp-marina-bay-sands-skypark','marina-bay-civic-core','marina-bay-waterfront'),
      ('sgp','sgp-maxwell-food-centre','telok-ayer-chinatown-food-core',NULL),
      ('sgp','sgp-merlion-park','marina-bay-civic-core','marina-bay-waterfront'),
      ('sgp','sgp-odette','marina-bay-civic-core',NULL),
      ('sgp','sgp-sentosa-island','sentosa-island-resort-zone','sentosa-island'),
      ('sgp','sgp-singapore-botanic-gardens','tanglin-botanic-gardens','singapore-botanic-gardens')
  ) AS t(city_code, place_slug, district_slug, container_slug)
)
UPDATE places p
SET
  country_id = tc.country_id,
  city_id = tc.city_id,
  district_id = d.id,
  container_id = c.id,
  updated_at = now()
FROM place_mapping pm
JOIN target_cities tc ON tc.city_code = pm.city_code
JOIN district_map d ON d.city_code = pm.city_code AND d.slug = pm.district_slug
LEFT JOIN container_map c ON c.city_code = pm.city_code AND c.slug = pm.container_slug
WHERE p.slug = pm.place_slug
  AND (
    p.country_id = tc.country_id
    OR p.country_id IN ('sg', 'singapore')
    OR p.country_id IS NULL
    OR p.country_id = ''
  )
  AND (
    p.city_id = tc.city_id
    OR p.city_id IN (tc.city_code, tc.city_slug, replace(tc.city_slug, '-', ''), COALESCE(tc.city_alias, ''))
    OR p.city_id IS NULL
    OR p.city_id = ''
  );
