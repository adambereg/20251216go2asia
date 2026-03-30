-- ============================================================================
-- 0025_chiang_mai_districts_containers_foundation.sql
-- Chiang Mai city-level foundation pass (Thailand only)
-- Scope: add curated districts/containers and place linkage for existing CNX places
-- Source input:
-- - content/atlas/thailand/Chiang-Mai-Districts-Containers.md
-- - content/atlas/thailand/chiang-mai-places-districts.md
-- ============================================================================

WITH target_city AS (
  SELECT co.id AS country_id, ci.id AS city_id
  FROM countries co
  JOIN cities ci ON ci.country_id = co.id
  WHERE
    (co.id = 'th' OR co.slug IN ('th', 'thailand'))
    AND (ci.id = 'cnx' OR ci.slug IN ('cnx', 'chiang-mai', 'chiangmai'))
  ORDER BY
    CASE WHEN co.id = 'th' THEN 0 WHEN co.slug = 'thailand' THEN 1 ELSE 2 END,
    CASE
      WHEN ci.id = 'cnx' THEN 0
      WHEN ci.slug = 'chiang-mai' THEN 1
      WHEN ci.slug = 'chiangmai' THEN 2
      WHEN ci.slug = 'cnx' THEN 3
      ELSE 4
    END
  LIMIT 1
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
FROM target_city tc
JOIN (
  VALUES
    (
      'cnx-district-old-city',
      'old-city',
      'Old City',
      'เมืองเก่าเชียงใหม่',
      'Историческое ядро Чиангмая внутри старых стен и рвов. Это главный район для первого знакомства с городом: здесь сосредоточены храмы, пешие маршруты, рынки, старые улицы и значительная часть атмосферных кафе и ресторанов.',
      E'Историческое ядро Чиангмая внутри старых стен и рвов. Это главный район для первого знакомства с городом: здесь сосредоточены храмы, пешие маршруты, рынки, старые улицы и значительная часть атмосферных кафе и ресторанов.\n\nПодходит для:\n- храмов и исторических прогулок;\n- первого знакомства с Чиангмаем;\n- рынков, пеших маршрутов и кафе в центре города.',
      10
    ),
    (
      'cnx-district-nimman',
      'nimman',
      'Nimman',
      'นิมมานเหมินทร์',
      'Современный креативный район Чиангмая, связанный с digital nomad сценой, кофейнями, бутиками, галереями и городской жизнью нового типа. Это одна из самых узнаваемых lifestyle-зон города.',
      E'Современный креативный район Чиангмая, связанный с digital nomad сценой, кофейнями, бутиками, галереями и городской жизнью нового типа. Это одна из самых узнаваемых lifestyle-зон города.\n\nПодходит для:\n- specialty coffee и cafés;\n- digital nomad среды;\n- шопинга, галерей и современной городской атмосферы.',
      20
    ),
    (
      'cnx-district-riverside-wat-ket',
      'riverside-wat-ket',
      'Riverside / Wat Ket',
      'วัดเกต',
      'Riverside-зона вдоль Ping River с более расслабленной атмосферой, историческими особняками, арт-пространствами и ресторанами у воды. Район удобен для неспешных прогулок, ужинов и вечернего отдыха.',
      E'Riverside-зона вдоль Ping River с более расслабленной атмосферой, историческими особняками, арт-пространствами и ресторанами у воды. Район удобен для неспешных прогулок, ужинов и вечернего отдыха.\n\nПодходит для:\n- ресторанов у реки;\n- более спокойной городской атмосферы;\n- кафе, искусства и прогулок у воды.',
      30
    ),
    (
      'cnx-district-suthep-doi-suthep',
      'suthep-doi-suthep',
      'Suthep / Doi Suthep',
      'สุเทพ',
      'Западная зона Чиангмая, которая связывает город с горой Doi Suthep и её важнейшими духовными и природными локациями. Это район, где городской ритм переходит в более возвышенную, обзорную и паломническую атмосферу.',
      E'Западная зона Чиангмая, которая связывает город с горой Doi Suthep и её важнейшими духовными и природными локациями. Это район, где городской ритм переходит в более возвышенную, обзорную и паломническую атмосферу.\n\nПодходит для:\n- храмов и панорамных видов;\n- поездок в горную часть над городом;\n- духовных и природных локаций.',
      40
    ),
    (
      'cnx-district-mae-taeng-excursion-zone',
      'mae-taeng-excursion-zone',
      'Mae Taeng Excursion Zone',
      'แม่แตง',
      'Северная excursion-зона провинции Чиангмай, куда едут ради природных ландшафтов, слоновьих sanctuary и более спокойного rural experience. Это не центральный городской район, а важный внешний travel cluster для Atlas Chiang Mai.',
      E'Северная excursion-зона провинции Чиангмай, куда едут ради природных ландшафтов, слоновьих sanctuary и более спокойного rural experience. Это не центральный городской район, а важный внешний travel cluster для Atlas Chiang Mai.\n\nПодходит для:\n- ethical elephant experiences;\n- природных поездок за пределы центра;\n- спокойных однодневных выездов.',
      50
    ),
    (
      'cnx-district-chom-thong-excursion-zone',
      'chom-thong-excursion-zone',
      'Chom Thong Excursion Zone',
      'จอมทอง',
      'Юго-западная excursion-зона провинции Чиангмай, связанная с Doi Inthanon, водопадами, лесами и high-altitude природными маршрутами. Это ключевое направление для тех, кто хочет увидеть самую высокую точку Таиланда и выйти за пределы городского опыта.',
      E'Юго-западная excursion-зона провинции Чиангмай, связанная с Doi Inthanon, водопадами, лесами и high-altitude природными маршрутами. Это ключевое направление для тех, кто хочет увидеть самую высокую точку Таиланда и выйти за пределы городского опыта.\n\nПодходит для:\n- национального парка Doi Inthanon;\n- водопадов и природных троп;\n- mountain day trips из Чиангмая.',
      60
    )
) AS d(id, slug, name, name_local, description_short, body_markdown, sort_order) ON TRUE
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

WITH target_city AS (
  SELECT co.id AS country_id, ci.id AS city_id
  FROM countries co
  JOIN cities ci ON ci.country_id = co.id
  WHERE
    (co.id = 'th' OR co.slug IN ('th', 'thailand'))
    AND (ci.id = 'cnx' OR ci.slug IN ('cnx', 'chiang-mai', 'chiangmai'))
  ORDER BY
    CASE WHEN co.id = 'th' THEN 0 WHEN co.slug = 'thailand' THEN 1 ELSE 2 END,
    CASE
      WHEN ci.id = 'cnx' THEN 0
      WHEN ci.slug = 'chiang-mai' THEN 1
      WHEN ci.slug = 'chiangmai' THEN 2
      WHEN ci.slug = 'cnx' THEN 3
      ELSE 4
    END
  LIMIT 1
),
district_map AS (
  SELECT id, slug
  FROM city_districts
  WHERE city_id = (SELECT city_id FROM target_city)
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
FROM target_city tc
JOIN (
  VALUES
    (
      'cnx-container-chiang-mai-old-city',
      'chiang-mai-old-city',
      'Chiang Mai Old City',
      'urban-area-cluster',
      'old-city',
      'Исторический городской кластер внутри стен Чиангмая, который воспринимается как самостоятельная destination-zone со множеством храмов, улиц, кафе и рынков.'
    ),
    (
      'cnx-container-nimmanhaemin-road',
      'nimmanhaemin-road',
      'Nimmanhaemin Road',
      'urban-street-cluster',
      'nimman',
      'Центральная улица и lifestyle-кластер района Nimman с кафе, бутиками, современными пространствами и digital nomad атмосферой.'
    ),
    (
      'cnx-container-sunday-walking-street-market',
      'sunday-walking-street-market',
      'Sunday Walking Street Market',
      'market-route',
      'old-city',
      'Большой воскресный market-route внутри Старого города с уличной едой, ремёслами, музыкой и вечерней прогулочной атмосферой.'
    )
) AS c(id, slug, name, container_type, district_slug, description_short) ON TRUE
JOIN district_map d ON d.slug = c.district_slug
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

WITH target_city AS (
  SELECT co.id AS country_id, ci.id AS city_id
  FROM countries co
  JOIN cities ci ON ci.country_id = co.id
  WHERE
    (co.id = 'th' OR co.slug IN ('th', 'thailand'))
    AND (ci.id = 'cnx' OR ci.slug IN ('cnx', 'chiang-mai', 'chiangmai'))
  ORDER BY
    CASE WHEN co.id = 'th' THEN 0 WHEN co.slug = 'thailand' THEN 1 ELSE 2 END,
    CASE
      WHEN ci.id = 'cnx' THEN 0
      WHEN ci.slug = 'chiang-mai' THEN 1
      WHEN ci.slug = 'chiangmai' THEN 2
      WHEN ci.slug = 'cnx' THEN 3
      ELSE 4
    END
  LIMIT 1
),
district_map AS (
  SELECT id, slug
  FROM city_districts
  WHERE city_id = (SELECT city_id FROM target_city)
),
container_map AS (
  SELECT id, slug
  FROM place_containers
  WHERE city_id = (SELECT city_id FROM target_city)
),
place_mapping AS (
  SELECT *
  FROM (
    VALUES
      ('cnx-dash-restaurant', 'old-city', NULL),
      ('cnx-doi-inthanon-national-park', 'chom-thong-excursion-zone', NULL),
      ('cnx-elephant-nature-park', 'mae-taeng-excursion-zone', NULL),
      ('cnx-fern-forest-cafe', 'old-city', NULL),
      ('cnx-graph-cafe', 'old-city', NULL),
      ('cnx-khao-soi-khun-yai', 'old-city', NULL),
      ('cnx-nimmanhaemin-road', 'nimman', 'nimmanhaemin-road'),
      ('cnx-old-city', 'old-city', 'chiang-mai-old-city'),
      ('cnx-sunday-walking-street-market', 'old-city', 'sunday-walking-street-market'),
      ('cnx-the-riverside-bar-restaurant', 'riverside-wat-ket', NULL),
      ('cnx-wat-chedi-luang', 'old-city', NULL),
      ('cnx-wat-phra-that-doi-suthep', 'suthep-doi-suthep', NULL),
      ('cnx-woo-cafe-art-gallery', 'riverside-wat-ket', NULL)
  ) AS x(place_slug, district_slug, container_slug)
)
UPDATE places p
SET
  country_id = tc.country_id,
  city_id = tc.city_id,
  district_id = d.id,
  container_id = c.id,
  updated_at = now()
FROM target_city tc
JOIN place_mapping pm ON TRUE
JOIN district_map d ON d.slug = pm.district_slug
LEFT JOIN container_map c ON c.slug = pm.container_slug
WHERE p.slug = pm.place_slug
  AND (p.country_id = tc.country_id OR p.country_id IN ('th', 'thailand') OR p.country_id IS NULL OR p.country_id = '')
  AND (p.city_id = tc.city_id OR p.city_id IN ('cnx', 'chiang-mai', 'chiangmai') OR p.city_id IS NULL OR p.city_id = '');

