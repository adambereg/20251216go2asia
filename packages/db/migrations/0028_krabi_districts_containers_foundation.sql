-- ============================================================================
-- 0028_krabi_districts_containers_foundation.sql
-- Krabi city-level foundation pass (Thailand only)
-- Scope: add curated districts/containers and place linkage for existing KBI places
-- Source input:
-- - content/atlas/thailand/Krabi-Districts-Containers.md
-- - content/atlas/thailand/krabi-places-districts.md
-- ============================================================================

WITH target_city AS (
  SELECT co.id AS country_id, ci.id AS city_id
  FROM countries co
  JOIN cities ci ON ci.country_id = co.id
  WHERE
    (co.id = 'th' OR co.slug IN ('th', 'thailand'))
    AND (ci.id = 'kbi' OR ci.slug IN ('kbi', 'krabi'))
  ORDER BY
    CASE WHEN co.id = 'th' THEN 0 WHEN co.slug = 'thailand' THEN 1 ELSE 2 END,
    CASE
      WHEN ci.id = 'kbi' THEN 0
      WHEN ci.slug = 'krabi' THEN 1
      WHEN ci.slug = 'kbi' THEN 2
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
      'kbi-district-krabi-town-riverfront',
      'krabi-town-riverfront',
      'Krabi Town / Riverfront',
      'ตัวเมืองกระบี่',
      'Городское ядро Краби у реки Krabi River с набережной, пирсами, рынками и главными символическими landmark-объектами. Это район для первого знакомства именно с Krabi Town, а не с пляжным курортным контуром Ao Nang.',
      E'Городское ядро Краби у реки Krabi River с набережной, пирсами, рынками и главными символическими landmark-объектами. Это район для первого знакомства именно с Krabi Town, а не с пляжным курортным контуром Ao Nang.\n\nПодходит для:\n- прогулок по Krabi Town и riverfront;\n- городских landmark-объектов;\n- более локального городского опыта вне beach resort зоны.',
      10
    ),
    (
      'kbi-district-ao-nang',
      'ao-nang',
      'Ao Nang',
      'อ่าวนาง',
      'Главный beach resort hub материкового Краби, откуда стартуют лодки и экскурсии к островам и полуострову Railay. Это самая узнаваемая курортная зона для пляжного отдыха, прогулок у моря и первого базирования в Krabi area.',
      E'Главный beach resort hub материкового Краби, откуда стартуют лодки и экскурсии к островам и полуострову Railay. Это самая узнаваемая курортная зона для пляжного отдыха, прогулок у моря и первого базирования в Krabi area.\n\nПодходит для:\n- пляжа и resort-атмосферы;\n- boat departures и island hopping;\n- первого курортного опыта в Краби.',
      20
    ),
    (
      'kbi-district-railay-phra-nang',
      'railay-phra-nang',
      'Railay / Phra Nang',
      'ไร่เล / พระนาง',
      'Изолированный limestone peninsula-cluster между Krabi Town и Ao Nang, куда попадают только по воде. Это одна из самых iconic destination-зон региона: пляжи Railay, скалы, скалолазание, Phra Nang Cave Beach и рестораны с видом на известняковые утёсы.',
      E'Изолированный limestone peninsula-cluster между Krabi Town и Ao Nang, куда попадают только по воде. Это одна из самых iconic destination-зон региона: пляжи Railay, скалы, скалолазание, Phra Nang Cave Beach и рестораны с видом на известняковые утёсы.\n\nПодходит для:\n- beach day trips и scenic shoreline;\n- rock climbing и limestone landscape;\n- красивых sunset-локаций и пляжных ресторанов.',
      30
    ),
    (
      'kbi-district-tiger-cave-foothills',
      'tiger-cave-foothills',
      'Tiger Cave Foothills',
      'วัดถ้ำเสือ',
      'Северо-восточная temple-and-foothills зона у подножия известняковых холмов рядом с Krabi Town, связанная с Wat Tham Suea. Это духовная и обзорная локация, отличающаяся от beach-контуров Краби.',
      E'Северо-восточная temple-and-foothills зона у подножия известняковых холмов рядом с Krabi Town, связанная с Wat Tham Suea. Это духовная и обзорная локация, отличающаяся от beach-контуров Краби.\n\nПодходит для:\n- храмовой и паломнической локации;\n- обзорных подъёмов и панорам;\n- коротких выездов из Krabi Town.',
      40
    ),
    (
      'kbi-district-khlong-thom-excursion-zone',
      'khlong-thom-excursion-zone',
      'Khlong Thom Excursion Zone',
      'คลองท่อม',
      'Юго-восточная excursion-зона провинции Краби, связанная с лесами, природными тропами, горячими источниками и Emerald Pool. Это не городской район, а важный day-trip cluster для природных поездок из Krabi base.',
      E'Юго-восточная excursion-зона провинции Краби, связанная с лесами, природными тропами, горячими источниками и Emerald Pool. Это не городской район, а важный day-trip cluster для природных поездок из Krabi base.\n\nПодходит для:\n- Emerald Pool и природных маршрутов;\n- лесного и термального опыта;\n- day trips за пределы coastal ядра.',
      50
    ),
    (
      'kbi-district-hong-islands-excursion-zone',
      'hong-islands-excursion-zone',
      'Hong Islands Excursion Zone',
      'เกาะห้อง',
      'Внешний island-cluster в акватории Krabi / Ao Luk, связанный с Hong Island, lagoon scenery и морскими day trips. Это не городской район в строгом смысле, а отдельная excursion-zone для одной из самых красивых островных локаций у Краби.',
      E'Внешний island-cluster в акватории Krabi / Ao Luk, связанный с Hong Island, lagoon scenery и морскими day trips. Это не городской район в строгом смысле, а отдельная excursion-zone для одной из самых красивых островных локаций у Краби.\n\nПодходит для:\n- island hopping и морских экскурсий;\n- lagoon и limestone-sea scenery;\n- снорклинга и пляжного day trip опыта.',
      60
    ),
    (
      'kbi-district-phi-phi-excursion-zone',
      'phi-phi-excursion-zone',
      'Phi Phi Excursion Zone',
      'เกาะพีพี',
      'Внешний island-archipelago cluster провинции Краби, связанный с Phi Phi Don, Phi Phi Le и морскими поездками по Andaman Sea. Для Atlas Krabi это отдельная excursion-zone, а не часть материкового urban/coastal контура.',
      E'Внешний island-archipelago cluster провинции Краби, связанный с Phi Phi Don, Phi Phi Le и морскими поездками по Andaman Sea. Для Atlas Krabi это отдельная excursion-zone, а не часть материкового urban/coastal контура.\n\nПодходит для:\n- island hopping и boating;\n- iconic Andaman scenery;\n- day trips и коротких island escapes из Краби.',
      70
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
    AND (ci.id = 'kbi' OR ci.slug IN ('kbi', 'krabi'))
  ORDER BY
    CASE WHEN co.id = 'th' THEN 0 WHEN co.slug = 'thailand' THEN 1 ELSE 2 END,
    CASE
      WHEN ci.id = 'kbi' THEN 0
      WHEN ci.slug = 'krabi' THEN 1
      WHEN ci.slug = 'kbi' THEN 2
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
      'kbi-container-ao-nang-beach',
      'ao-nang-beach',
      'Ao Nang Beach',
      'urban-beachfront',
      'ao-nang',
      'Главный beachfront-кластер материкового Краби, который воспринимается как самостоятельная destination-zone для пляжа, прогулок и отправления на морские экскурсии.'
    ),
    (
      'kbi-container-railay-beach',
      'railay-beach',
      'Railay Beach',
      'peninsula-beach-cluster',
      'railay-phra-nang',
      'Beach-and-cliffs cluster на полуострове Railay с West Railay, East Railay и близостью к Phra Nang. Это не одна точка, а самостоятельная destination-zone.'
    ),
    (
      'kbi-container-hong-islands',
      'hong-islands',
      'Hong Islands',
      'island-archipelago-cluster',
      'hong-islands-excursion-zone',
      'Island-cluster в составе морской excursion-зоны у Краби с lagoon, пляжами и лодочными маршрутами.'
    ),
    (
      'kbi-container-phi-phi-islands',
      'phi-phi-islands',
      'Phi Phi Islands',
      'island-archipelago-cluster',
      'phi-phi-excursion-zone',
      'Знаменитый архипелаг как самостоятельная destination-zone, а не одиночная точка.'
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
    AND (ci.id = 'kbi' OR ci.slug IN ('kbi', 'krabi'))
  ORDER BY
    CASE WHEN co.id = 'th' THEN 0 WHEN co.slug = 'thailand' THEN 1 ELSE 2 END,
    CASE
      WHEN ci.id = 'kbi' THEN 0
      WHEN ci.slug = 'krabi' THEN 1
      WHEN ci.slug = 'kbi' THEN 2
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
      ('kbi-ao-nang-beach', 'ao-nang', 'ao-nang-beach'),
      ('kbi-emerald-pool', 'khlong-thom-excursion-zone', NULL),
      ('kbi-hong-islands', 'hong-islands-excursion-zone', 'hong-islands'),
      ('kbi-khao-khanab-nam', 'krabi-town-riverfront', NULL),
      ('kbi-phi-phi-islands', 'phi-phi-excursion-zone', 'phi-phi-islands'),
      ('kbi-railay-beach', 'railay-phra-nang', 'railay-beach'),
      ('kbi-the-grotto-restaurant', 'railay-phra-nang', NULL),
      ('kbi-tiger-cave-temple', 'tiger-cave-foothills', NULL)
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
  AND (p.city_id = tc.city_id OR p.city_id IN ('kbi', 'krabi') OR p.city_id IS NULL OR p.city_id = '');

