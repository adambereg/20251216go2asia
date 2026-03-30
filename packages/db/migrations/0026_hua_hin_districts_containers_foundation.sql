-- ============================================================================
-- 0026_hua_hin_districts_containers_foundation.sql
-- Hua Hin city-level foundation pass (Thailand only)
-- Scope: add curated districts/containers and place linkage for existing HHN places
-- Source input:
-- - content/atlas/thailand/Hua-Hin-Districts-Containers.md
-- - content/atlas/thailand/hua-hin-places-districts.md
-- ============================================================================

WITH target_city AS (
  SELECT co.id AS country_id, ci.id AS city_id
  FROM countries co
  JOIN cities ci ON ci.country_id = co.id
  WHERE
    (co.id = 'th' OR co.slug IN ('th', 'thailand'))
    AND (ci.id = 'hhn' OR ci.slug IN ('hhn', 'hua-hin', 'huahin'))
  ORDER BY
    CASE WHEN co.id = 'th' THEN 0 WHEN co.slug = 'thailand' THEN 1 ELSE 2 END,
    CASE
      WHEN ci.id = 'hhn' THEN 0
      WHEN ci.slug = 'hua-hin' THEN 1
      WHEN ci.slug = 'huahin' THEN 2
      WHEN ci.slug = 'hhn' THEN 3
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
      'hhn-district-central-hua-hin',
      'central-hua-hin',
      'Central Hua Hin',
      'หัวหิน',
      'Центральная курортная часть Хуа Хина, где сходятся главный городской пляж, историческая железнодорожная станция, старые улицы у моря и классические seafood spots. Это лучший район для первого знакомства с городом и его «старым» seaside character.',
      E'Центральная курортная часть Хуа Хина, где сходятся главный городской пляж, историческая железнодорожная станция, старые улицы у моря и классические seafood spots. Это лучший район для первого знакомства с городом и его «старым» seaside character.\n\nПодходит для:\n- первого знакомства с Хуа Хином;\n- прогулок вдоль пляжа и у моря;\n- исторических landmark-объектов и классических ресторанов.',
      10
    ),
    (
      'hhn-district-nong-kae',
      'nong-kae',
      'Nong Kae',
      'หนองแก',
      'Южная resort-зона Хуа Хина с крупными lifestyle и family attractions, beachside hotels, weekend markets и более современным курортным ритмом. Это логичный район для night-market опыта, развлечений и отдыха чуть южнее центра.',
      E'Южная resort-зона Хуа Хина с крупными lifestyle и family attractions, beachside hotels, weekend markets и более современным курортным ритмом. Это логичный район для night-market опыта, развлечений и отдыха чуть южнее центра.\n\nПодходит для:\n- evening markets и lifestyle-атмосферы;\n- семейных развлечений;\n- resort-формата отдыха в южной части города.',
      20
    ),
    (
      'hhn-district-khao-takiab',
      'khao-takiab',
      'Khao Takiab',
      'เขาตะเกียบ',
      'Южный coastal cluster Хуа Хина вокруг Monkey Mountain / Chopsticks Hill, пляжа, храмовой зоны и обзорных точек. Это одна из самых узнаваемых destination-зон города, где seaside atmosphere соединяется со смотровыми площадками, храмом и beach dining.',
      E'Южный coastal cluster Хуа Хина вокруг Monkey Mountain / Chopsticks Hill, пляжа, храмовой зоны и обзорных точек. Это одна из самых узнаваемых destination-зон города, где seaside atmosphere соединяется со смотровыми площадками, храмом и beach dining.\n\nПодходит для:\n- панорамных видов и храмовой локации;\n- более курортной и scenic beach-зоны;\n- sunset drinks и прогулок у моря.',
      30
    ),
    (
      'hhn-district-sam-roi-yot-excursion-zone',
      'sam-roi-yot-excursion-zone',
      'Sam Roi Yot Excursion Zone',
      'สามร้อยยอด',
      'Внешняя excursion-зона к югу от Хуа Хина, связанная с известняковыми холмами, морским национальным парком, пляжами и одной из самых узнаваемых cave-локаций региона. Это не городской район в строгом смысле, а важный day-trip cluster для Atlas Hua Hin.',
      E'Внешняя excursion-зона к югу от Хуа Хина, связанная с известняковыми холмами, морским национальным парком, пляжами и одной из самых узнаваемых cave-локаций региона. Это не городской район в строгом смысле, а важный day-trip cluster для Atlas Hua Hin.\n\nПодходит для:\n- природных day trips из Хуа Хина;\n- cave и national park experience;\n- более удалённых scenic локаций за пределами курортного ядра.',
      40
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
    AND (ci.id = 'hhn' OR ci.slug IN ('hhn', 'hua-hin', 'huahin'))
  ORDER BY
    CASE WHEN co.id = 'th' THEN 0 WHEN co.slug = 'thailand' THEN 1 ELSE 2 END,
    CASE
      WHEN ci.id = 'hhn' THEN 0
      WHEN ci.slug = 'hua-hin' THEN 1
      WHEN ci.slug = 'huahin' THEN 2
      WHEN ci.slug = 'hhn' THEN 3
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
      'hhn-container-hua-hin-beach',
      'hua-hin-beach',
      'Hua Hin Beach',
      'urban-beachfront',
      'central-hua-hin',
      'Главный beachfront-кластер города, который воспринимается не как точка, а как длинная и самостоятельная destination-zone для прогулок, купания и classic resort experience.'
    ),
    (
      'hhn-container-cicada-market',
      'cicada-market',
      'Cicada Market',
      'market-cluster',
      'nong-kae',
      'Weekend market-кластер в Nong Kae с арт-лавками, уличной едой, выступлениями и вечерней прогулочной атмосферой. В Atlas это логично трактовать как самостоятельный container, а не как одиночную точку.'
    ),
    (
      'hhn-container-khao-takiab-hill',
      'khao-takiab-hill',
      'Khao Takiab Hill',
      'scenic-hill-cluster',
      'khao-takiab',
      'Scenic coastal cluster вокруг холма Khao Takiab с храмом, смотровыми площадками, обезьянами и выходом к пляжной зоне.'
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
    AND (ci.id = 'hhn' OR ci.slug IN ('hhn', 'hua-hin', 'huahin'))
  ORDER BY
    CASE WHEN co.id = 'th' THEN 0 WHEN co.slug = 'thailand' THEN 1 ELSE 2 END,
    CASE
      WHEN ci.id = 'hhn' THEN 0
      WHEN ci.slug = 'hua-hin' THEN 1
      WHEN ci.slug = 'huahin' THEN 2
      WHEN ci.slug = 'hhn' THEN 3
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
      ('hhn-baan-itsara-restaurant', 'central-hua-hin', NULL),
      ('hhn-cicada-market', 'nong-kae', 'cicada-market'),
      ('hhn-hua-hin-beach', 'central-hua-hin', 'hua-hin-beach'),
      ('hhn-hua-hin-railway-station', 'central-hua-hin', NULL),
      ('hhn-khao-takiab', 'khao-takiab', 'khao-takiab-hill'),
      ('hhn-let-s-sea-bar', 'khao-takiab', NULL),
      ('hhn-phraya-nakhon-cave', 'sam-roi-yot-excursion-zone', NULL),
      ('hhn-vana-nava-water-jungle', 'nong-kae', NULL)
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
  AND (p.city_id = tc.city_id OR p.city_id IN ('hhn', 'hua-hin', 'huahin') OR p.city_id IS NULL OR p.city_id = '');

