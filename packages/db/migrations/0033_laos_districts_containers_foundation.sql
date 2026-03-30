-- ============================================================================
-- 0033_laos_districts_containers_foundation.sql
-- Laos batch foundation pass (country-level, bounded)
-- Scope: add curated districts/containers and place linkage for existing LA places
-- Source input:
-- - content/atlas/laos/*-places-districts.md
-- - content/atlas/laos/*-Districts-Containers.md
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
      ('vte', 'vientiane', NULL),
      ('lpq', 'luang-prabang', 'luangprabang'),
      ('pkz', 'pakse', NULL),
      ('svn', 'savannakhet', 'svk'),
      ('vvg', 'vang-vieng', 'vangvieng')
  ) AS cfg(city_code, city_slug, city_alias)
  JOIN countries co
    ON (co.id = 'la' OR co.slug IN ('la', 'laos'))
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
    CASE WHEN co.id = 'la' THEN 0 WHEN co.slug = 'laos' THEN 1 ELSE 2 END,
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
      ('vte', 'vte-district-mekong-riverside-ban-anou', 'mekong-riverside-ban-anou', 'Mekong Riverside / Ban Anou', 'ແມ່ນ້ຳຂອງ / ບ້ານອານຸ',
       'Riverfront-ядро туристического Вьентьяна вдоль Mekong и квартала Ban Anou: вечерние прогулки, rooftop-бары, food courts и casual dining у воды.',
       E'Riverfront-ядро туристического Вьентьяна вдоль Mekong и квартала Ban Anou: вечерние прогулки, rooftop-бары, food courts и casual dining у воды.\n\nПодходит для:\n- прогулок вдоль Mekong riverfront;\n- rooftop-баров, evening dining и night-market среды;\n- первого знакомства с более расслабленным riverside Вьентьяна.',
       10),
      ('vte', 'vte-district-central-civic-that-dam', 'central-civic-that-dam', 'Central Civic / That Dam', 'ທາດດຳ / ນ້ຳພຸ',
       'Центральный контур между Lane Xang, Nam Phu и That Dam: храмы, civic landmarks, исторические улицы и городские рестораны.',
       E'Центральный контур между Lane Xang, Nam Phu и That Dam: храмы, civic landmarks, исторические улицы и городские рестораны.\n\nПодходит для:\n- городских landmark-объектов и центральных храмов;\n- cafe и restaurant stops в walkable city core;\n- знакомства с civic и историческим слоем Вьентьяна.',
       20),
      ('vte', 'vte-district-that-luang-nongbone', 'that-luang-nongbone', 'That Luang / Nongbone', 'ທາດຫຼວງ / ໜອງບອນ',
       'Восточный monumental-spiritual контур вокруг Pha That Luang / Nongbone: национально-религиозный символ и ceremonial часть столицы.',
       E'Восточный monumental-spiritual контур вокруг Pha That Luang / Nongbone: национально-религиозный символ и ceremonial часть столицы.\n\nПодходит для:\n- главного буддийского landmark-объекта Лаоса;\n- спокойного monumental city experience;\n- коротких выездов к sacred architecture.',
       30),
      ('vte', 'vte-district-xieng-khuan-buddha-park-excursion-zone', 'xieng-khuan-buddha-park-excursion-zone', 'Xieng Khuan / Buddha Park Excursion Zone', 'ຊຽງຄວນ',
       'Внешняя excursion-зона к юго-востоку от Вьентьяна (Xieng Khuan / Buddha Park): day-trip cluster, не центральный район.',
       E'Внешняя excursion-зона к юго-востоку от Вьентьяна (Xieng Khuan / Buddha Park): day-trip cluster, не центральный район.\n\nПодходит для:\n- day trips за пределы центра;\n- sculpture park и фотогеничных локаций;\n- необычного духовно-художественного опыта рядом со столицей.',
       40),

      ('lpq', 'lpq-district-old-town-peninsula', 'old-town-peninsula', 'Old Town Peninsula', 'ຫລວງພະບາງເກົ່າ',
       'Историческое ядро на полуострове между Mekong и Nam Khan: храмы, королевское наследие, рынок и old-town опыт.',
       E'Историческое ядро на полуострове между Mekong и Nam Khan: храмы, королевское наследие, рынок и old-town опыт.\n\nПодходит для:\n- первого знакомства с Луанг Прабангом;\n- храмов, heritage-walks и королевского слоя;\n- рынков, cafe и прогулок по старому центру.',
       10),
      ('lpq', 'lpq-district-mekong-riverside-ban-vat-sene', 'mekong-riverside-ban-vat-sene', 'Mekong Riverside / Ban Vat Sene', 'ແຄມແມ່ນ້ຳຂອງ',
       'Riverside вдоль Mekong у старого города: рестораны, бары, sunset terraces и waterfront на краю heritage-core.',
       E'Riverside вдоль Mekong у старого города: рестораны, бары, sunset terraces и waterfront на краю heritage-core.\n\nПодходит для:\n- sunset drinks и ужинов у реки;\n- спокойного riverside experience;\n- прогулок вдоль Mekong.',
       20),
      ('lpq', 'lpq-district-nam-khan-opposite-bank', 'nam-khan-opposite-bank', 'Nam Khan Opposite Bank', 'ແຄມນ້ຳຄານ',
       'Тихий cluster на противоположном берегу Nam Khan: terraced dining и более камерная вечерняя атмосфера.',
       E'Тихий cluster на противоположном берегу Nam Khan: terraced dining и более камерная вечерняя атмосфера.\n\nПодходит для:\n- ресторанов у Nam Khan;\n- тихого evening experience вне главных улиц;\n- views back toward the old peninsula.',
       30),
      ('lpq', 'lpq-district-kuang-si-excursion-zone', 'kuang-si-excursion-zone', 'Kuang Si Excursion Zone', 'ນ້ຳຕົກກວາງຊີ',
       'Внешняя природная zone к юго-западу: Kuang Si Falls и turquoise pools, day trips вне городского ядра.',
       E'Внешняя природная zone к юго-западу: Kuang Si Falls и turquoise pools, day trips вне городского ядра.\n\nПодходит для:\n- waterfalls и природных day trips;\n- купания в turquoise pools;\n- коротких выездов за пределы heritage-core.',
       40),
      ('lpq', 'lpq-district-pak-ou-excursion-zone', 'pak-ou-excursion-zone', 'Pak Ou Excursion Zone', 'ຖ້ຳປາກອູ',
       'River-and-caves excursion вверх по Mekong: Pak Ou Caves и boat trips, классический day-trip cluster.',
       E'River-and-caves excursion вверх по Mekong: Pak Ou Caves и boat trips, классический day-trip cluster.\n\nПодходит для:\n- river cruises по Mekong;\n- cave и pilgrimage experience;\n- классических excursions из Луанг Прабанга.',
       50),

      ('pkz', 'pkz-district-mekong-xe-don-riverside-core', 'mekong-xe-don-riverside-core', 'Mekong / Xe Don Riverside Core', 'ປາກເຊ',
       'Центральное городское ядро Паксе вокруг Mekong/Xe Don riverside: rooftop restaurants, cafe и прогулочные маршруты.',
       E'Центральное городское ядро Паксе вокруг Mekong/Xe Don riverside: rooftop restaurants, cafe и прогулочные маршруты.\n\nПодходит для:\n- прогулок по riverside и городскому центру;\n- rooftop dining, coffee stops и casual restaurants;\n- базирования перед поездками по южному Лаосу.',
       10),
      ('pkz', 'pkz-district-bolaven-plateau-excursion-zone', 'bolaven-plateau-excursion-zone', 'Bolaven Plateau Excursion Zone', 'ໂບລະເວນ',
       'Внешняя highland excursion-zone к востоку от Паксе: кофейные плантации, водопады и scenic day trips.',
       E'Внешняя highland excursion-zone к востоку от Паксе: кофейные плантации, водопады и scenic day trips.\n\nПодходит для:\n- водопадов и природных поездок;\n- coffee plantation experience;\n- scenic highland day trips.',
       20),
      ('pkz', 'pkz-district-champasak-wat-phou-excursion-zone', 'champasak-wat-phou-excursion-zone', 'Champasak / Wat Phou Excursion Zone', 'ຈຳປາສັກ',
       'Внешняя excursion-zone к югу от Паксе вдоль Mekong: Champasak Town и Wat Phou, heritage day-trip cluster.',
       E'Внешняя excursion-zone к югу от Паксе вдоль Mekong: Champasak Town и Wat Phou, heritage day-trip cluster.\n\nПодходит для:\n- heritage day trips и Wat Phou;\n- river-road поездок из Паксе;\n- исторического и провинциального южного Лаоса.',
       30),

      ('svn', 'svn-district-historic-old-town-riverside', 'historic-old-town-riverside', 'Historic Old Town / Riverside', 'ເມືອງເກົ່າສະຫວັນນະເຂດ',
       'Историческое ядро вдоль Меконга: колониальные фасады, старые улицы, собор и riverfront ритм.',
       E'Историческое ядро вдоль Меконга: колониальные фасады, старые улицы, собор и riverfront ритм.\n\nПодходит для:\n- прогулок по старому городу и колониальной архитектуре;\n- набережной Меконга и закатов;\n- cafe и спокойного городского ритма.',
       10),
      ('svn', 'svn-district-civic-center-dinosaur-quarter', 'civic-center-dinosaur-quarter', 'Civic Center / Dinosaur Quarter', 'ໃຈກາງເມືອງສະຫວັນນະເຂດ',
       'Центральный контур к востоку от riverfront: музей динозавров, локальные рестораны и повседневная городская среда.',
       E'Центральный контур к востоку от riverfront: музей динозавров, локальные рестораны и повседневная городская среда.\n\nПодходит для:\n- локальных ресторанов и everyday experience;\n- небольших музеев и city stopovers;\n- практичного знакомства с городом вне riverfront-романтики.',
       20),
      ('svn', 'svn-district-that-ing-hang-excursion-zone', 'that-ing-hang-excursion-zone', 'That Ing Hang Excursion Zone', 'ທາດອິງຮັງ',
       'Внешняя храмово-паломническая excursion-zone к северо-востоку от Саваннакхета, short day-trip cluster.',
       E'Внешняя храмово-паломническая excursion-zone к северо-востоку от Саваннакхета, short day-trip cluster.\n\nПодходит для:\n- храмового и паломнического опыта;\n- коротких выездов за пределы центра;\n- знакомства с религиозным наследием южного Лаоса.',
       30),

      ('vvg', 'vvg-district-central-town-riverside', 'central-town-riverside', 'Central Town / Riverside', 'ວັງວຽງ',
       'Центральное river-town ядро Ванг Вьенга вдоль Nam Song: cafe, guesthouses, city services и базовые прогулочные маршруты.',
       E'Центральное river-town ядро Ванг Вьенга вдоль Nam Song: cafe, guesthouses, city services и базовые прогулочные маршруты.\n\nПодходит для:\n- первого знакомства с Ванг Вьенгом;\n- cafe и town-base around Nam Song;\n- short urban walks и логистики для day trips.',
       10),
      ('vvg', 'vvg-district-west-bank-river-bars', 'west-bank-river-bars', 'West Bank River Bars', 'ແມ່ນ້ຳຊອງ',
       'Западный берег Nam Song с river bars, viewpoints и activity-oriented riverside leisure.',
       E'Западный берег Nam Song с river bars, viewpoints и activity-oriented riverside leisure.\n\nПодходит для:\n- river bars и sunset viewpoints;\n- tubing access и river activities;\n- более активного evening riverside experience.',
       20),
      ('vvg', 'vvg-district-tham-chang-southwest', 'tham-chang-southwest', 'Tham Chang Southwest', 'ຖ້ຳຈັງ',
       'Юго-западный cave-oriented контур вокруг Tham Chang и карстовых холмов у города.',
       E'Юго-западный cave-oriented контур вокруг Tham Chang и карстовых холмов у города.\n\nПодходит для:\n- cave stops и карстовых ландшафтов;\n- коротких выездов от town core;\n- nature-scenic experience рядом с городом.',
       30),
      ('vvg', 'vvg-district-pha-ngern-organic-farm-countryside', 'pha-ngern-organic-farm-countryside', 'Pha Ngern / Organic Farm Countryside', 'ຜາເງິນ',
       'Countryside contour к западу/юго-западу: viewpoints, farm visits и rural activity рядом с Ванг Вьенгом.',
       E'Countryside contour к западу/юго-западу: viewpoints, farm visits и rural activity рядом с Ванг Вьенгом.\n\nПодходит для:\n- countryside day trips;\n- organic farm и rural scenery;\n- viewpoints и спокойного out-of-town ритма.',
       40),
      ('vvg', 'vvg-district-blue-lagoon-phu-kham-excursion-zone', 'blue-lagoon-phu-kham-excursion-zone', 'Blue Lagoon / Phu Kham Excursion Zone', 'ຖ້ຳພູຄຳ',
       'Внешняя excursion-zone к северо-западу: Blue Lagoon и Phu Kham Cave, ключевой day-trip cluster Ванг Вьенга.',
       E'Внешняя excursion-zone к северо-западу: Blue Lagoon и Phu Kham Cave, ключевой day-trip cluster Ванг Вьенга.\n\nПодходит для:\n- Blue Lagoon и cave trips;\n- day-trip активности вне центра;\n- adventure-leisure маршрутов вокруг Ванг Вьенга.',
       50)
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
      ('vte', 'vientiane', NULL),
      ('lpq', 'luang-prabang', 'luangprabang'),
      ('pkz', 'pakse', NULL),
      ('svn', 'savannakhet', 'svk'),
      ('vvg', 'vang-vieng', 'vangvieng')
  ) AS cfg(city_code, city_slug, city_alias)
  JOIN countries co
    ON (co.id = 'la' OR co.slug IN ('la', 'laos'))
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
    CASE WHEN co.id = 'la' THEN 0 WHEN co.slug = 'laos' THEN 1 ELSE 2 END,
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
      ('vte','vte-container-mekong-riverside-promenade','mekong-riverside-promenade','Mekong Riverside Promenade','urban-riverfront-cluster','mekong-riverside-ban-anou',
       'Длинный riverfront-кластер вдоль Mekong: вечерние прогулки, cafe, бары, night-market и sunset-facing public edge.'),
      ('vte','vte-container-ban-anou-night-market','ban-anou-night-market','Ban Anou Night Market','night-market-food-cluster','mekong-riverside-ban-anou',
       'Компактный food-market cluster в Ban Anou: street-food и вечерняя food scene у riverside.'),

      ('lpq','lpq-container-luang-prabang-old-town','luang-prabang-old-town','Luang Prabang Old Town','historic-peninsula-cluster','old-town-peninsula',
       'Исторический кластер на полуострове: храмы, рынки, heritage streets и royal landmarks.'),
      ('lpq','lpq-container-luang-prabang-night-market','luang-prabang-night-market','Luang Prabang Night Market','night-market-corridor','old-town-peninsula',
       'Вечерний market-corridor на Sisavangvong Road: сувениры, текстиль, еда и прогулочная атмосфера.'),

      ('pkz','pkz-container-mekong-riverside-pakse','mekong-riverside-pakse','Mekong Riverside Pakse','urban-riverfront-cluster','mekong-xe-don-riverside-core',
       'Главный riverfront-кластер Паксе вдоль Mekong с набережной, ресторанами и rooftop views.'),

      ('svn','svn-container-mekong-riverside-promenade','mekong-riverside-promenade','Mekong Riverside Promenade','urban-riverfront-cluster','historic-old-town-riverside',
       'Длинный riverfront-кластер вдоль Меконга: прогулочная зона, уличная еда, закат и вечерний городской ритм.'),
      ('svn','svn-container-savannakhet-old-town','savannakhet-old-town','Savannakhet Old Town','urban-old-town-cluster','historic-old-town-riverside',
       'Исторический городской кластер: колониальные фасады, широкие улицы и ключевые heritage-точки старого Саваннакхета.'),

      ('vvg','vvg-container-nam-song-river-tubing-route','nam-song-river-tubing-route','Nam Song River Tubing Route','river-activity-route','west-bank-river-bars',
       'River activity route вдоль Nam Song как самостоятельная destination-zone для tubing опыта.')
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
      ('vte', 'vientiane', NULL),
      ('lpq', 'luang-prabang', 'luangprabang'),
      ('pkz', 'pakse', NULL),
      ('svn', 'savannakhet', 'svk'),
      ('vvg', 'vang-vieng', 'vangvieng')
  ) AS cfg(city_code, city_slug, city_alias)
  JOIN countries co
    ON (co.id = 'la' OR co.slug IN ('la', 'laos'))
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
    CASE WHEN co.id = 'la' THEN 0 WHEN co.slug = 'laos' THEN 1 ELSE 2 END,
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
      ('vte','vte-ban-anou-night-market-food-court','mekong-riverside-ban-anou','ban-anou-night-market'),
      ('vte','vte-bor-pen-nyang-rooftop','mekong-riverside-ban-anou',NULL),
      ('vte','vte-buddha-park','xieng-khuan-buddha-park-excursion-zone',NULL),
      ('vte','vte-cope-visitor-centre','central-civic-that-dam',NULL),
      ('vte','vte-kualao-restaurant','central-civic-that-dam',NULL),
      ('vte','vte-makphet-restaurant','mekong-riverside-ban-anou',NULL),
      ('vte','vte-mekong-riverside-promenade','mekong-riverside-ban-anou','mekong-riverside-promenade'),
      ('vte','vte-patuxai','central-civic-that-dam',NULL),
      ('vte','vte-pha-that-luang','that-luang-nongbone',NULL),
      ('vte','vte-scandinavian-bakery','central-civic-that-dam',NULL),
      ('vte','vte-taj-mahal-restaurant','mekong-riverside-ban-anou',NULL),
      ('vte','vte-wat-si-saket','central-civic-that-dam',NULL),

      ('lpq','lpq-alms-giving-ceremony','old-town-peninsula',NULL),
      ('lpq','lpq-bouang-asian-eatery','mekong-riverside-ban-vat-sene',NULL),
      ('lpq','lpq-dyen-sabai-restaurant','nam-khan-opposite-bank',NULL),
      ('lpq','lpq-joma-bakery-cafe','old-town-peninsula',NULL),
      ('lpq','lpq-kuang-si-falls','kuang-si-excursion-zone',NULL),
      ('lpq','lpq-manda-de-laos','old-town-peninsula',NULL),
      ('lpq','lpq-mount-phousi','old-town-peninsula','luang-prabang-old-town'),
      ('lpq','lpq-night-market','old-town-peninsula','luang-prabang-night-market'),
      ('lpq','lpq-pak-ou-caves','pak-ou-excursion-zone',NULL),
      ('lpq','lpq-royal-palace-museum','old-town-peninsula','luang-prabang-old-town'),
      ('lpq','lpq-tamarind-restaurant','old-town-peninsula',NULL),
      ('lpq','lpq-utopia-bar','mekong-riverside-ban-vat-sene',NULL),
      ('lpq','lpq-wat-xieng-thong','old-town-peninsula','luang-prabang-old-town'),

      ('pkz','pkz-bolaven-plateau','bolaven-plateau-excursion-zone',NULL),
      ('pkz','pkz-champasak-town','champasak-wat-phou-excursion-zone',NULL),
      ('pkz','pkz-daolin-restaurant-cafe','mekong-xe-don-riverside-core',NULL),
      ('pkz','pkz-le-panorama-restaurant','mekong-xe-don-riverside-core',NULL),
      ('pkz','pkz-mekong-riverside-pakse','mekong-xe-don-riverside-core','mekong-riverside-pakse'),
      ('pkz','pkz-sinouk-coffee-pakse','mekong-xe-don-riverside-core',NULL),
      ('pkz','pkz-tad-fane-waterfall','bolaven-plateau-excursion-zone',NULL),
      ('pkz','pkz-tad-yuang-waterfall','bolaven-plateau-excursion-zone',NULL),
      ('pkz','pkz-wat-phou','champasak-wat-phou-excursion-zone',NULL),

      ('svn','svk-cafe-inn','historic-old-town-riverside',NULL),
      ('svn','svk-daosavanh-restaurant','civic-center-dinosaur-quarter',NULL),
      ('svn','svk-dinosaur-museum','civic-center-dinosaur-quarter',NULL),
      ('svn','svk-lin-s-cafe','historic-old-town-riverside',NULL),
      ('svn','svk-mekong-riverside-food-stalls','historic-old-town-riverside',NULL),
      ('svn','svk-mekong-riverside-promenade','historic-old-town-riverside','mekong-riverside-promenade'),
      ('svn','svk-savannakhet-city-museum','historic-old-town-riverside',NULL),
      ('svn','svk-savannakhet-old-town','historic-old-town-riverside','savannakhet-old-town'),
      ('svn','svk-sinouk-coffee-savannakhet','historic-old-town-riverside',NULL),
      ('svn','svk-st-teresa-s-catholic-church','historic-old-town-riverside',NULL),
      ('svn','svk-that-ing-hang-stupa','that-ing-hang-excursion-zone',NULL),

      ('vvg','vvg-blue-lagoon-1','blue-lagoon-phu-kham-excursion-zone',NULL),
      ('vvg','vvg-cafe-de-vang-vieng','central-town-riverside',NULL),
      ('vvg','vvg-gary-s-irish-bar','central-town-riverside',NULL),
      ('vvg','vvg-kangaroo-sunset-bar','west-bank-river-bars',NULL),
      ('vvg','vvg-organic-mulberry-farm-cafe','pha-ngern-organic-farm-countryside',NULL),
      ('vvg','vvg-peeping-som-s-bar-restaurant','west-bank-river-bars',NULL),
      ('vvg','vvg-pha-ngern-viewpoint','pha-ngern-organic-farm-countryside',NULL),
      ('vvg','vvg-sakura-bar','central-town-riverside',NULL),
      ('vvg','vvg-smile-beach-bar','west-bank-river-bars',NULL),
      ('vvg','vvg-sunset-point-nam-song','west-bank-river-bars',NULL),
      ('vvg','vvg-tham-chang-cave','tham-chang-southwest',NULL),
      ('vvg','vvg-tham-phu-kham-cave','blue-lagoon-phu-kham-excursion-zone',NULL),
      ('vvg','vvg-nam-song-river-tubing','west-bank-river-bars','nam-song-river-tubing-route')
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
    OR p.country_id IN ('la', 'laos')
    OR p.country_id IS NULL
    OR p.country_id = ''
  )
  AND (
    p.city_id = tc.city_id
    OR p.city_id IN (tc.city_code, tc.city_slug, replace(tc.city_slug, '-', ''), COALESCE(tc.city_alias, ''))
    OR p.city_id IS NULL
    OR p.city_id = ''
  );

