-- ============================================================================
-- 0029_pattaya_districts_containers_foundation.sql
-- Pattaya city-level foundation pass (Thailand only)
-- Scope: add curated districts/containers and place linkage for existing PTY places
-- Source input:
-- - content/atlas/thailand/Pattaya-Districts-Containers.md
-- - content/atlas/thailand/pattaya-places-districts.md
-- ============================================================================

WITH target_city AS (
  SELECT co.id AS country_id, ci.id AS city_id
  FROM countries co
  JOIN cities ci ON ci.country_id = co.id
  WHERE
    (co.id = 'th' OR co.slug IN ('th', 'thailand'))
    AND (ci.id = 'pty' OR ci.slug IN ('pty', 'pattaya'))
  ORDER BY
    CASE WHEN co.id = 'th' THEN 0 WHEN co.slug = 'thailand' THEN 1 ELSE 2 END,
    CASE
      WHEN ci.id = 'pty' THEN 0
      WHEN ci.slug = 'pattaya' THEN 1
      WHEN ci.slug = 'pty' THEN 2
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
      'pty-district-central-pattaya-beach-road',
      'central-pattaya-beach-road',
      'Central Pattaya / Beach Road',
      'พัทยากลาง / ถนนเลียบหาดพัทยา',
      'Главное курортное ядро Паттайи вдоль Pattaya Beach и Beach Road с отелями, торговыми центрами, rooftop-барами и плотной городской resort-атмосферой. Это базовый район для первого знакомства с Паттайей и самым узнаваемым городским beachfront-контуром.',
      E'Главное курортное ядро Паттайи вдоль Pattaya Beach и Beach Road с отелями, торговыми центрами, rooftop-барами и плотной городской resort-атмосферой. Это базовый район для первого знакомства с Паттайей и самым узнаваемым городским beachfront-контуром.\n\nПодходит для:\n- первого знакомства с Паттайей;\n- прогулок вдоль моря и beachfront life;\n- rooftop-баров, шопинга и классической resort-среды.',
      10
    ),
    (
      'pty-district-south-pattaya-pratumnak',
      'south-pattaya-pratumnak',
      'South Pattaya / Pratumnak',
      'พัทยาใต้ / พระตำหนัก',
      'Южный городской контур Паттайи, где nightlife-ядро Walking Street встречается с холмом Pratumnak и его храмово-обзорной зоной. Это район для тех, кто хочет совместить знаковые панорамы, городской драйв и доступ к Bali Hai / south bay edge.',
      E'Южный городской контур Паттайи, где nightlife-ядро Walking Street встречается с холмом Pratumnak и его храмово-обзорной зоной. Это район для тех, кто хочет совместить знаковые панорамы, городской драйв и доступ к Bali Hai / south bay edge.\n\nПодходит для:\n- Walking Street и вечерней городской энергии;\n- обзорных точек и Big Buddha Hill;\n- южного gateway между Pattaya Beach и Jomtien.',
      20
    ),
    (
      'pty-district-naklua-wong-amat',
      'naklua-wong-amat',
      'Naklua / Wong Amat',
      'นาเกลือ / วงศ์อมาตย์',
      'Северная coastal-зона Большой Паттайи с более спокойной атмосферой, морскими ресторанами и одной из самых известных культурных landmark-локаций города. Это район, где Pattaya становится менее хаотичной и более scenic.',
      E'Северная coastal-зона Большой Паттайи с более спокойной атмосферой, морскими ресторанами и одной из самых известных культурных landmark-локаций города. Это район, где Pattaya становится менее хаотичной и более scenic.\n\nПодходит для:\n- seafood-ресторанов у воды;\n- более спокойной северной coastal-среды;\n- культурных landmark-объектов и sunset dining.',
      30
    ),
    (
      'pty-district-jomtien',
      'jomtien',
      'Jomtien',
      'จอมเทียน',
      'Южный пляжный район Паттайи с более расслабленным и семейным ритмом, длинной береговой линией и длинными остановками у моря. Это альтернатива более шумному центру и классический район для спокойного beach stay.',
      E'Южный пляжный район Паттайи с более расслабленным и семейным ритмом, длинной береговой линией и длинными остановками у моря. Это альтернатива более шумному центру и классический район для спокойного beach stay.\n\nПодходит для:\n- более спокойного beach-отдыха;\n- семейных и длительных остановок;\n- прогулок вдоль длинной береговой линии.',
      40
    ),
    (
      'pty-district-na-jomtien-excursion-zone',
      'na-jomtien-excursion-zone',
      'Na Jomtien Excursion Zone',
      'นาจอมเทียน',
      'Внешняя resort/excursion-зона к югу от Паттайи, связанная с beachfront-ресторанами, крупными садами и family attractions вдоль Na Jomtien / Na Chom Thian. Это уже не городское ядро Паттайи, а важный внешний cluster для day trips и курортных выездов.',
      E'Внешняя resort/excursion-зона к югу от Паттайи, связанная с beachfront-ресторанами, крупными садами и family attractions вдоль Na Jomtien / Na Chom Thian. Это уже не городское ядро Паттайи, а важный внешний cluster для day trips и курортных выездов.\n\nПодходит для:\n- beach dining за пределами шумного центра;\n- садов, family attractions и тематических парков;\n- более спокойного coastal day trip опыта.',
      50
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
    AND (ci.id = 'pty' OR ci.slug IN ('pty', 'pattaya'))
  ORDER BY
    CASE WHEN co.id = 'th' THEN 0 WHEN co.slug = 'thailand' THEN 1 ELSE 2 END,
    CASE
      WHEN ci.id = 'pty' THEN 0
      WHEN ci.slug = 'pattaya' THEN 1
      WHEN ci.slug = 'pty' THEN 2
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
      'pty-container-pattaya-beach',
      'pattaya-beach',
      'Pattaya Beach',
      'urban-beachfront',
      'central-pattaya-beach-road',
      'Главный beachfront-кластер города с набережной, гостиницами, urban resort life и самой узнаваемой полосой пляжа в Паттайе.'
    ),
    (
      'pty-container-walking-street',
      'walking-street',
      'Walking Street',
      'nightlife-route',
      'south-pattaya-pratumnak',
      'Главный nightlife-route Паттайи между Beach Road и Bali Hai с клубами, барами, ресторанами и яркой вечерней атмосферой.'
    ),
    (
      'pty-container-jomtien-beach',
      'jomtien-beach',
      'Jomtien Beach',
      'urban-beachfront',
      'jomtien',
      'Длинный beachfront-кластер южнее центра Паттайи с более спокойной атмосферой и длинной полосой пляжа для семейного и более размеренного отдыха.'
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
    AND (ci.id = 'pty' OR ci.slug IN ('pty', 'pattaya'))
  ORDER BY
    CASE WHEN co.id = 'th' THEN 0 WHEN co.slug = 'thailand' THEN 1 ELSE 2 END,
    CASE
      WHEN ci.id = 'pty' THEN 0
      WHEN ci.slug = 'pattaya' THEN 1
      WHEN ci.slug = 'pty' THEN 2
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
      ('pty-big-buddha-hill', 'south-pattaya-pratumnak', NULL),
      ('pty-horizon-rooftop-bar', 'central-pattaya-beach-road', NULL),
      ('pty-jomtien-beach', 'jomtien', 'jomtien-beach'),
      ('pty-mum-aroi', 'naklua-wong-amat', NULL),
      ('pty-nong-nooch-tropical-garden', 'na-jomtien-excursion-zone', NULL),
      ('pty-pattaya-beach', 'central-pattaya-beach-road', 'pattaya-beach'),
      ('pty-sanctuary-of-truth', 'naklua-wong-amat', NULL),
      ('pty-the-glass-house', 'na-jomtien-excursion-zone', NULL),
      ('pty-walking-street', 'south-pattaya-pratumnak', 'walking-street')
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
  AND (p.city_id = tc.city_id OR p.city_id IN ('pty', 'pattaya') OR p.city_id IS NULL OR p.city_id = '');

