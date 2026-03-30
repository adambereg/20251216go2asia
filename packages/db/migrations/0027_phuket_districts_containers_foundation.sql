-- ============================================================================
-- 0027_phuket_districts_containers_foundation.sql
-- Phuket city-level foundation pass (Thailand only)
-- Scope: add curated districts/containers and place linkage for existing PHK places
-- Source input:
-- - content/atlas/thailand/Phuket-Districts-Containers.md
-- - content/atlas/thailand/phuket-places-districts.md
-- ============================================================================

WITH target_city AS (
  SELECT co.id AS country_id, ci.id AS city_id
  FROM countries co
  JOIN cities ci ON ci.country_id = co.id
  WHERE
    (co.id = 'th' OR co.slug IN ('th', 'thailand'))
    AND (ci.id = 'hkt' OR ci.slug IN ('hkt', 'phuket'))
  ORDER BY
    CASE WHEN co.id = 'th' THEN 0 WHEN co.slug = 'thailand' THEN 1 ELSE 2 END,
    CASE
      WHEN ci.id = 'hkt' THEN 0
      WHEN ci.slug = 'phuket' THEN 1
      WHEN ci.slug = 'hkt' THEN 2
      ELSE 3
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
      'hkt-district-phuket-old-town',
      'phuket-old-town',
      'Phuket Old Town',
      'เมืองเก่าภูเก็ต',
      'Историческое ядро Phuket Town: Sino-Portuguese, особняки, музеи, рестораны, атмосфера старого торгового города; главная urban-зона и вход в культурный/гастрономический/архитектурный Пхукет.',
      E'Историческое ядро Phuket Town: Sino-Portuguese, особняки, музеи, рестораны, атмосфера старого торгового города; главная urban-зона и вход в культурный/гастрономический/архитектурный Пхукет.\n\nПодходит для:\n- исторических прогулок и стрит-фото;\n- локальной гастрономии и известных ресторанов;\n- архитектурного и культурного слоя Пхукета.',
      10
    ),
    (
      'hkt-district-patong-kalim',
      'patong-kalim',
      'Patong / Kalim',
      'ป่าตอง / กะหลิม',
      'Главный beach-and-nightlife западного Пхукета: Patong Beach, рестораны, кафе с видами, отели, насыщенная туристическая жизнь; Kalim — спокойнее, северный край Patong bay.',
      E'Главный beach-and-nightlife западного Пхукета: Patong Beach, рестораны, кафе с видами, отели, насыщенная туристическая жизнь; Kalim — спокойнее, северный край Patong bay.\n\nПодходит для:\n- пляжа и sunset views;\n- ресторанов и кафе с видом на море;\n- активной туристической среды, nightlife и первого курортного опыта на Пхукете.',
      20
    ),
    (
      'hkt-district-chalong-big-buddha',
      'chalong-big-buddha',
      'Chalong / Big Buddha',
      'ฉลอง',
      'Юго-восток: Chalong Bay, пирс, морские выезды, подъём к Big Buddha на Nakkerd Hill; landmark, seafood у воды, маршруты Phuket Town ↔ юг.',
      E'Юго-восток: Chalong Bay, пирс, морские выезды, подъём к Big Buddha на Nakkerd Hill; landmark, seafood у воды, маршруты Phuket Town ↔ юг.\n\nПодходит для:\n- поездок к Big Buddha;\n- seafood и waterfront;\n- выездов через Chalong и южный Пхукет.',
      30
    ),
    (
      'hkt-district-rawai-promthep',
      'rawai-promthep',
      'Rawai / Promthep',
      'ราไวย์',
      'Южная coastal-зона: Rawai, мыс Promthep, известные sunset viewpoints; виды, прогулки у моря, «южный край» острова.',
      E'Южная coastal-зона: Rawai, мыс Promthep, известные sunset viewpoints; виды, прогулки у моря, «южный край» острова.\n\nПодходит для:\n- sunset viewpoints и scenic drives;\n- морских панорам и прогулок;\n- южного coastal experience вне суеты Patong.',
      40
    ),
    (
      'hkt-district-wichit-kathu-hills',
      'wichit-kathu-hills',
      'Wichit / Kathu Hills',
      'วิชิต / กะทู้',
      'Зелёный hill/jungle corridor между Phuket Town, Kathu и дорогой к Chalong; urban → обзорная природная среда.',
      E'Зелёный hill/jungle corridor между Phuket Town, Kathu и дорогой к Chalong; urban → обзорная природная среда.\n\nПодходит для:\n- jungle dining и видовых ресторанов;\n- коротких scenic выездов из Phuket Town;\n- зелёной обзорной атмосферы рядом с городом.',
      50
    ),
    (
      'hkt-district-phi-phi-excursion-zone',
      'phi-phi-excursion-zone',
      'Phi Phi Excursion Zone',
      'เกาะพีพี',
      'Внешняя excursion-зона Koh Phi Phi и морских day trips как часть Phuket travel experience; не строго городской район, а внешний island cluster для Atlas Phuket.',
      E'Внешняя excursion-зона Koh Phi Phi и морских day trips как часть Phuket travel experience; не строго городской район, а внешний island cluster для Atlas Phuket.\n\nПодходит для:\n- island hopping и морских экскурсий;\n- day trips с Пхукета;\n- postcard-пейзажей, пляжей и boating.',
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
    AND (ci.id = 'hkt' OR ci.slug IN ('hkt', 'phuket'))
  ORDER BY
    CASE WHEN co.id = 'th' THEN 0 WHEN co.slug = 'thailand' THEN 1 ELSE 2 END,
    CASE
      WHEN ci.id = 'hkt' THEN 0
      WHEN ci.slug = 'phuket' THEN 1
      WHEN ci.slug = 'hkt' THEN 2
      ELSE 3
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
      'hkt-container-phuket-old-town',
      'phuket-old-town',
      'Phuket Old Town',
      'urban-old-town-cluster',
      'phuket-old-town',
      'Исторический городской кластер в центре Phuket Town как отдельная destination-zone: улицы, кафе, особняки, музеи, локальная гастрономия.'
    ),
    (
      'hkt-container-patong-beach',
      'patong-beach',
      'Patong Beach',
      'urban-beachfront',
      'patong-kalim',
      'Главный beachfront-кластер запада: длинная полоса пляжа, набережная, отели, рестораны, узнаваемая resort-атмосфера.'
    ),
    (
      'hkt-container-promthep-cape',
      'promthep-cape',
      'Promthep Cape',
      'scenic-cape-cluster',
      'rawai-promthep',
      'Scenic coastal cluster на южной оконечности: обзорные точки, мыс, sunset-панорамы.'
    ),
    (
      'hkt-container-phi-phi-islands',
      'phi-phi-islands',
      'Phi Phi Islands',
      'island-archipelago-cluster',
      'phi-phi-excursion-zone',
      'Island-cluster как самостоятельная destination-zone, а не одна точка.'
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
    AND (ci.id = 'hkt' OR ci.slug IN ('hkt', 'phuket'))
  ORDER BY
    CASE WHEN co.id = 'th' THEN 0 WHEN co.slug = 'thailand' THEN 1 ELSE 2 END,
    CASE
      WHEN ci.id = 'hkt' THEN 0
      WHEN ci.slug = 'phuket' THEN 1
      WHEN ci.slug = 'hkt' THEN 2
      ELSE 3
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
      ('phk-baan-rim-pa', 'patong-kalim', NULL),
      ('phk-big-buddha-phuket', 'chalong-big-buddha', NULL),
      ('phk-blue-elephant-phuket', 'phuket-old-town', NULL),
      ('phk-cafe-phuket-viewpoint', 'patong-kalim', NULL),
      ('phk-kan-eang-pier', 'chalong-big-buddha', NULL),
      ('phk-no-6-restaurant', 'patong-kalim', NULL),
      ('phk-old-phuket-town', 'phuket-old-town', 'phuket-old-town'),
      ('phk-patong-beach', 'patong-kalim', 'patong-beach'),
      ('phk-phi-phi-islands', 'phi-phi-excursion-zone', 'phi-phi-islands'),
      ('phk-promthep-cape', 'rawai-promthep', 'promthep-cape'),
      ('phk-raya-restaurant', 'phuket-old-town', NULL),
      ('phk-three-monkeys-restaurant', 'wichit-kathu-hills', NULL)
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
  AND (p.city_id = tc.city_id OR p.city_id IN ('hkt', 'phuket') OR p.city_id IS NULL OR p.city_id = '');

