-- ============================================================================
-- 0030_samui_districts_containers_foundation.sql
-- Samui city-level foundation pass (Thailand only)
-- Scope: add curated districts/containers and place linkage for existing USM places
-- Source input:
-- - content/atlas/thailand/Samui-Districts-Containers.md
-- - content/atlas/thailand/samui-places-districts.md
-- ============================================================================

WITH target_city AS (
  SELECT co.id AS country_id, ci.id AS city_id
  FROM countries co
  JOIN cities ci ON ci.country_id = co.id
  WHERE
    (co.id = 'th' OR co.slug IN ('th', 'thailand'))
    AND (ci.id = 'usm' OR ci.slug IN ('usm', 'samui'))
  ORDER BY
    CASE WHEN co.id = 'th' THEN 0 WHEN co.slug = 'thailand' THEN 1 ELSE 2 END,
    CASE
      WHEN ci.id = 'usm' THEN 0
      WHEN ci.slug = 'samui' THEN 1
      WHEN ci.slug = 'usm' THEN 2
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
      'usm-district-bophut-fishermans-village',
      'bophut-fishermans-village',
      'Bophut / Fisherman''s Village',
      'บ่อผุด',
      'Северное coastal-ядро Самуи с историческим Fisherman''s Village, beach dining, барами и более атмосферной village/resort средой. Это один из самых узнаваемых lifestyle-кластеров острова для вечерних прогулок, ужинов у моря и мягкого курортного ритма.',
      E'Северное coastal-ядро Самуи с историческим Fisherman''s Village, beach dining, барами и более атмосферной village/resort средой. Это один из самых узнаваемых lifestyle-кластеров острова для вечерних прогулок, ужинов у моря и мягкого курортного ритма.\n\nПодходит для:\n- beach dining и sunset-атмосферы;\n- вечерних прогулок и night market среды;\n- более стильного и спокойного coastal experience.',
      10
    ),
    (
      'usm-district-choeng-mon-big-buddha',
      'choeng-mon-big-buddha',
      'Choeng Mon / Big Buddha',
      'เชิงมน / พระใหญ่',
      'Северо-восточный scenic и temple-oriented кластер Самуи, где находятся Big Buddha Temple, прибрежные обзорные точки и upscale resorts северо-восточного мыса. Это район для храмовых локаций, видов на море и более приватного resort experience.',
      E'Северо-восточный scenic и temple-oriented кластер Самуи, где находятся Big Buddha Temple, прибрежные обзорные точки и upscale resorts северо-восточного мыса. Это район для храмовых локаций, видов на море и более приватного resort experience.\n\nПодходит для:\n- храмов и знаковых landmark-объектов;\n- смотровых точек и северо-восточного побережья;\n- более приватного resort-отдыха у моря.',
      20
    ),
    (
      'usm-district-chaweng',
      'chaweng',
      'Chaweng',
      'เฉวง',
      'Главное beach-and-nightlife ядро Самуи с длинной полосой пляжа, активной туристической средой, торговлей, ресторанами и отелями. Это самый узнаваемый курортный район острова для первого знакомства с Samui beach life.',
      E'Главное beach-and-nightlife ядро Самуи с длинной полосой пляжа, активной туристической средой, торговлей, ресторанами и отелями. Это самый узнаваемый курортный район острова для первого знакомства с Samui beach life.\n\nПодходит для:\n- пляжного отдыха и resort-инфраструктуры;\n- активной туристической среды;\n- первого знакомства с Самуи.',
      30
    ),
    (
      'usm-district-lamai',
      'lamai',
      'Lamai',
      'ละไม',
      'Юго-восточный пляжный район Самуи с более расслабленным ритмом, чем Chaweng, но с полноценной resort-жизнью, кафе, барами и длинной береговой линией. Это классический район для тех, кто хочет beach stay с более спокойной атмосферой.',
      E'Юго-восточный пляжный район Самуи с более расслабленным ритмом, чем Chaweng, но с полноценной resort-жизнью, кафе, барами и длинной береговой линией. Это классический район для тех, кто хочет beach stay с более спокойной атмосферой.\n\nПодходит для:\n- более спокойного beach stay;\n- длительных остановок у моря;\n- сочетания пляжа и удобной resort-среды.',
      40
    ),
    (
      'usm-district-na-muang-interior',
      'na-muang-interior',
      'Na Muang Interior',
      'หน้าเมือง',
      'Зелёная внутренняя зона юга Самуи, связанная с водопадами, холмами, jungle roads и природными выездами с побережья в глубь острова. Это не beach district, а природный inland-кластер для short excursions и scenic island driving.',
      E'Зелёная внутренняя зона юга Самуи, связанная с водопадами, холмами, jungle roads и природными выездами с побережья в глубь острова. Это не beach district, а природный inland-кластер для short excursions и scenic island driving.\n\nПодходит для:\n- водопадов и природных выездов;\n- inland scenery и jungle roads;\n- коротких экскурсий из beach-зон.',
      50
    ),
    (
      'usm-district-ang-thong-excursion-zone',
      'ang-thong-excursion-zone',
      'Ang Thong Excursion Zone',
      'อ่างทอง',
      'Внешняя marine excursion-zone к северо-западу от Самуи, связанная с архипелагом Mu Ko Ang Thong, лодочными выездами, смотровыми площадками, лагунами и морскими day trips. Это не городской район острова, а важный внешний island-hopping кластер для Atlas Samui.',
      E'Внешняя marine excursion-zone к северо-западу от Самуи, связанная с архипелагом Mu Ko Ang Thong, лодочными выездами, смотровыми площадками, лагунами и морскими day trips. Это не городской район острова, а важный внешний island-hopping кластер для Atlas Samui.\n\nПодходит для:\n- морских day trips;\n- kayaking, snorkeling и boating;\n- postcard-пейзажей и архипелага за пределами Самуи.',
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
    AND (ci.id = 'usm' OR ci.slug IN ('usm', 'samui'))
  ORDER BY
    CASE WHEN co.id = 'th' THEN 0 WHEN co.slug = 'thailand' THEN 1 ELSE 2 END,
    CASE
      WHEN ci.id = 'usm' THEN 0
      WHEN ci.slug = 'samui' THEN 1
      WHEN ci.slug = 'usm' THEN 2
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
      'usm-container-fishermans-village',
      'fishermans-village',
      'Fisherman''s Village',
      'beach-village-cluster',
      'bophut-fishermans-village',
      'Исторический beachfront-кластер в Bophut с walking street, ресторанами, барами и night-market атмосферой.'
    ),
    (
      'usm-container-chaweng-beach',
      'chaweng-beach',
      'Chaweng Beach',
      'urban-beachfront',
      'chaweng',
      'Главный beachfront-кластер Самуи с длинной полосой пляжа и самой насыщенной resort-инфраструктурой острова.'
    ),
    (
      'usm-container-lamai-beach',
      'lamai-beach',
      'Lamai Beach',
      'urban-beachfront',
      'lamai',
      'Длинный beach-cluster юго-востока Самуи с более спокойным курортным ритмом, чем Chaweng.'
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
    AND (ci.id = 'usm' OR ci.slug IN ('usm', 'samui'))
  ORDER BY
    CASE WHEN co.id = 'th' THEN 0 WHEN co.slug = 'thailand' THEN 1 ELSE 2 END,
    CASE
      WHEN ci.id = 'usm' THEN 0
      WHEN ci.slug = 'samui' THEN 1
      WHEN ci.slug = 'usm' THEN 2
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
      ('usm-ang-thong-national-marine-park', 'ang-thong-excursion-zone', NULL),
      ('usm-big-buddha-temple', 'choeng-mon-big-buddha', NULL),
      ('usm-chaweng-beach', 'chaweng', 'chaweng-beach'),
      ('usm-coco-tam-s', 'bophut-fishermans-village', NULL),
      ('usm-dining-on-the-rocks', 'choeng-mon-big-buddha', NULL),
      ('usm-fisherman-s-village', 'bophut-fishermans-village', 'fishermans-village'),
      ('usm-lamai-beach', 'lamai', 'lamai-beach'),
      ('usm-na-muang-waterfalls', 'na-muang-interior', NULL)
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
  AND (p.city_id = tc.city_id OR p.city_id IN ('usm', 'samui') OR p.city_id IS NULL OR p.city_id = '');

