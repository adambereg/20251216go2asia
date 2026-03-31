-- ============================================================================
-- 0031_cambodia_districts_containers_foundation.sql
-- Cambodia batch foundation pass (country-level, bounded)
-- Scope: add curated districts/containers and place linkage for existing KH places
-- Source input:
-- - content/atlas/cambodia/*-places-districts.md
-- - content/atlas/cambodia/*-Districts-Containers.md
-- ============================================================================

WITH target_cities AS (
  SELECT DISTINCT ON (cfg.city_code)
    cfg.city_code,
    cfg.city_slug,
    co.id AS country_id,
    ci.id AS city_id
  FROM (
    VALUES
      ('pnh', 'phnom-penh'),
      ('bat', 'battambang'),
      ('kch', 'kampong-cham'),
      ('kmp', 'kampot'),
      ('kps', 'sihanoukville'),
      ('kra', 'kratie'),
      ('rep', 'siem-reap')
  ) AS cfg(city_code, city_slug)
  JOIN countries co
    ON (co.id = 'kh' OR co.slug IN ('kh', 'cambodia'))
  JOIN cities ci
    ON ci.country_id = co.id
   AND (
     ci.id = cfg.city_code
     OR ci.slug IN (cfg.city_code, cfg.city_slug, replace(cfg.city_slug, '-', ''))
   )
  ORDER BY
    cfg.city_code,
    CASE WHEN co.id = 'kh' THEN 0 WHEN co.slug = 'cambodia' THEN 1 ELSE 2 END,
    CASE
      WHEN ci.id = cfg.city_code THEN 0
      WHEN ci.slug = cfg.city_slug THEN 1
      WHEN ci.slug = cfg.city_code THEN 2
      WHEN ci.slug = replace(cfg.city_slug, '-', '') THEN 3
      ELSE 4
    END
),
district_values AS (
  SELECT *
  FROM (
    VALUES
      (
        'pnh',
        'pnh-district-riverside-daun-penh',
        'riverside-daun-penh',
        'Riverside / Daun Penh',
        'ដូនពេញ',
        'Историческое и туристическое ядро Пномпеня вдоль Sisowath Quay и вокруг старого центра Daun Penh; riverfront, колониальные здания, кафе, рестораны, landmark''ы, «центральная» атмосфера столицы.',
        E'Историческое и туристическое ядро Пномпеня вдоль Sisowath Quay и вокруг старого центра Daun Penh; riverfront, колониальные здания, кафе, рестораны, landmark''ы, «центральная» атмосфера столицы.\n\nПодходит для:\n- первого знакомства с Пномпенем;\n- прогулок по riverfront и старому центру;\n- кафе, ресторанов и исторических городских точек.',
        10
      ),
      (
        'pnh',
        'pnh-district-norodom-independence-bassac',
        'norodom-independence-bassac',
        'Norodom / Independence / Bassac',
        'ចំការមន',
        'Центрально-южный контур вокруг Norodom Boulevard, Independence Monument и Bassac-side embassy / dining zone; монументы, upscale dining, бульвары, более «элегантный» urban Phnom Penh.',
        E'Центрально-южный контур вокруг Norodom Boulevard, Independence Monument и Bassac-side embassy / dining zone; монументы, upscale dining, бульвары, более «элегантный» urban Phnom Penh.\n\nПодходит для:\n- монументального и представительского центра;\n- fine dining и известных ресторанов;\n- прогулок по бульварам и более элегантного urban Phnom Penh.',
        20
      ),
      (
        'pnh',
        'pnh-district-dangkao-excursion-zone',
        'dangkao-excursion-zone',
        'Dangkao Excursion Zone',
        'ដង្កោ',
        'Внешняя excursion-зона на южной периферии, связанная с Choeung Ek / Cheung Ek; не городской центр, а вынесенная историко-мемориальная локация.',
        E'Внешняя excursion-зона на южной периферии, связанная с Choeung Ek / Cheung Ek; не городской центр, а вынесенная историко-мемориальная локация.\n\nПодходит для:\n- мемориальных и образовательных поездок;\n- более глубокого знакомства с историей Камбоджи;\n- вынесенных day-trip маршрутов вне центрального ядра.',
        30
      ),
      (
        'bat',
        'bat-district-historic-center-psar-nath-riverside',
        'historic-center-psar-nath-riverside',
        'Historic Center / Psar Nath / Riverside',
        'ក្រុងបាត់ដំបង',
        'Историческое ядро вокруг Psar Nath, колониальных улиц, реки Sangker и центральных кафе; главный район первого знакомства с городом.',
        E'Историческое ядро вокруг Psar Nath, колониальных улиц, реки Sangker и центральных кафе; главный район первого знакомства с городом.\n\nПодходит для:\n- прогулок по историческому центру;\n- кафе, локальной гастрономии и riverfront;\n- первого знакомства с Баттамбангом как с городом, не только excursion-base.',
        10
      ),
      (
        'bat',
        'bat-district-bamboo-train-excursion-zone',
        'bamboo-train-excursion-zone',
        'Bamboo Train Excursion Zone',
        'នូរី',
        'Внешняя excursion-зона к юго-западу от города; short-trip cluster, сельский ландшафт, железнодорожная история, norry experience.',
        E'Внешняя excursion-зона к юго-западу от города; short-trip cluster, сельский ландшафт, железнодорожная история, norry experience.\n\nПодходит для:\n- коротких выездов за пределы центра;\n- bamboo train / norry;\n- более сельского Battambang countryside feel.',
        20
      ),
      (
        'bat',
        'bat-district-phnom-sampeau-excursion-zone',
        'phnom-sampeau-excursion-zone',
        'Phnom Sampeau Excursion Zone',
        'ភ្នំសំពៅ',
        'Hill-and-caves excursion-зона к западу: Phnom Sampeau, Bat Cave, храмы на холме, панорамы; ключевой day-trip кластер, не центральный городской контур.',
        E'Hill-and-caves excursion-зона к западу: Phnom Sampeau, Bat Cave, храмы на холме, панорамы; ключевой day-trip кластер, не центральный городской контур.\n\nПодходит для:\n- bat cave и sunset выездов;\n- hill-temple и cave experience;\n- природно-исторических day trips из Баттамбанга.',
        30
      ),
      (
        'kch',
        'kch-district-sambor-prei-kuk-excursion-zone',
        'sambor-prei-kuk-excursion-zone',
        'Sambor Prei Kuk Excursion Zone',
        'សំបូរព្រៃគុក',
        'Внешняя историко-археологическая excursion-zone у Sambor Prei Kuk; для текущего набора не городской район, а одиночный day-trip cluster как operational district.',
        E'Внешняя историко-археологическая excursion-zone у Sambor Prei Kuk; для текущего набора не городской район, а одиночный day-trip cluster как operational district.\n\nПодходит для:\n- археологического и исторического интереса;\n- day trip формата;\n- храмового комплекса доангкорского периода.',
        10
      ),
      (
        'kmp',
        'kmp-district-kampot-riverside-old-town',
        'kampot-riverside-old-town',
        'Kampot Riverside / Old Town',
        'កំពត',
        'Историческое riverfront-ядро Кампота вдоль Kampot River с колониальной архитектурой, набережной, кафе и неспешной провинциальной атмосферой. Главный городской кластер для прогулок, гастрономии и первого знакомства с городом Kampot.',
        E'Историческое riverfront-ядро Кампота вдоль Kampot River с колониальной архитектурой, набережной, кафе и неспешной провинциальной атмосферой. Главный городской кластер для прогулок, гастрономии и первого знакомства с городом Kampot.\n\nПодходит для:\n- прогулок по набережной и старому центру;\n- кафе и неспешной городской атмосферы;\n- первого знакомства с Кампотом как river town.',
        10
      ),
      (
        'kmp',
        'kmp-district-kep-coastal-excursion-zone',
        'kep-coastal-excursion-zone',
        'Kep Coastal Excursion Zone',
        'កែប',
        'Внешняя coastal excursion-зона к востоку от Кампота (Kep: crab market, пляж, нацпарк). Не строгий городской район Кампота, а day-trip / side-trip cluster в текущем Atlas Kampot set.',
        E'Внешняя coastal excursion-зона к востоку от Кампота (Kep: crab market, пляж, нацпарк). Не строгий городской район Кампота, а day-trip / side-trip cluster в текущем Atlas Kampot set.\n\nПодходит для:\n- seafood и crab market experience;\n- coastal day trips из Кампота;\n- коротких природных прогулок и seaside atmosphere.',
        20
      ),
      (
        'kmp',
        'kmp-district-kampot-pepper-countryside',
        'kampot-pepper-countryside',
        'Kampot Pepper Countryside',
        'កំពត',
        'Сельская inland-зона Kampot Province: pepper plantations, известняковые холмы, rural roads, агротуризм. Не городской район, а природно-аграрный excursion cluster.',
        E'Сельская inland-зона Kampot Province: pepper plantations, известняковые холмы, rural roads, агротуризм. Не городской район, а природно-аграрный excursion cluster.\n\nПодходит для:\n- pepper farm visits и дегустаций;\n- rural scenery и countryside drives;\n- гастрономического агротуризма за пределами города.',
        30
      ),
      (
        'kps',
        'kps-district-otres-beach',
        'otres-beach',
        'Otres Beach',
        'ឆ្នេរអូរត្រេះ',
        'Юго-восточная beach-зона Сиануквиля, более расслабленная альтернатива центральному побережью; beach cafes, бары, sunset.',
        E'Юго-восточная beach-зона Сиануквиля, более расслабленная альтернатива центральному побережью; beach cafes, бары, sunset.\n\nПодходит для:\n- beach cafes и баров у моря;\n- более расслабленной beach-среды;\n- sunset-прогулок и отдыха вне городского ядра.',
        10
      ),
      (
        'kps',
        'kps-district-prey-nob-waterfall-excursion-zone',
        'prey-nob-waterfall-excursion-zone',
        'Prey Nob Waterfall Excursion Zone',
        'ព្រៃនប់',
        'Внешняя природная excursion-зона к северу от побережья (Kbal Chhay и зелёный inland). Не beach-район, а короткий природный выезд.',
        E'Внешняя природная excursion-зона к северу от побережья (Kbal Chhay и зелёный inland). Не beach-район, а короткий природный выезд.\n\nПодходит для:\n- природных short trips из Сиануквиля;\n- водопада и пикниковой атмосферы;\n- более зелёного inland experience.',
        20
      ),
      (
        'kps',
        'kps-district-koh-rong-excursion-zone',
        'koh-rong-excursion-zone',
        'Koh Rong Excursion Zone',
        'កោះរុង',
        'Внешний island-cluster к западу от побережья (Koh Rong, морские поездки в заливе). Для Atlas — отдельная excursion-zone, не материковое ядро.',
        E'Внешний island-cluster к западу от побережья (Koh Rong, морские поездки в заливе). Для Atlas — отдельная excursion-zone, не материковое ядро.\n\nПодходит для:\n- island escapes и beach day trips;\n- морских поездок и boating;\n- postcard-пейзажей и островного отдыха.',
        30
      ),
      (
        'kra',
        'kra-district-cardamom-mountains-excursion-zone',
        'cardamom-mountains-excursion-zone',
        'Cardamom Mountains Excursion Zone',
        'ជួរភ្នំក្រវាញ',
        'Внешняя rainforest и eco-adventure зона на юго-западе Камбоджи, связанная с Chi Phat, треккингом, каякингом и community-based ecotourism в Cardamom Mountains. Это не городской район Кратье в строгом смысле, а внешний excursion-cluster, который сейчас привязан к Kratie только из-за текущего Atlas dataset.',
        E'Внешняя rainforest и eco-adventure зона на юго-западе Камбоджи, связанная с Chi Phat, треккингом, каякингом и community-based ecotourism в Cardamom Mountains. Это не городской район Кратье в строгом смысле, а внешний excursion-cluster, который сейчас привязан к Kratie только из-за текущего Atlas dataset.\n\nПодходит для:\n- rainforest и eco-adventure поездок;\n- треккинга, каякинга и community-based tourism;\n- удалённых природных маршрутов вне городского контура.',
        10
      ),
      (
        'rep',
        'rep-district-central-siem-reap-urban-core',
        'central-siem-reap-urban-core',
        'Central Siem Reap Urban Core',
        'ក្រុងសៀមរាប',
        'Городской центр Сием Рипа вокруг riverfront, Old Market / Pub Street зоны, Sok San Road и основных вечерних и туристических маршрутов. Это базовый городской контур для nightlife, ресторанов, культурных шоу и первого знакомства с городом вне храмового комплекса Angkor.',
        E'Городской центр Сием Рипа вокруг riverfront, Old Market / Pub Street зоны, Sok San Road и основных вечерних и туристических маршрутов. Это базовый городской контур для nightlife, ресторанов, культурных шоу и первого знакомства с городом вне храмового комплекса Angkor.\n\nПодходит для:\n- вечерних прогулок и городской атмосферы;\n- ресторанов, баров и nightlife;\n- культурных шоу и базирования в центре Сием Рипа.',
        10
      ),
      (
        'rep',
        'rep-district-angkor-archaeological-park-core',
        'angkor-archaeological-park-core',
        'Angkor Archaeological Park Core',
        'អង្គរ',
        'Главный храмовый и археологический контур Angkor у северного края Сием Рипа. Здесь сосредоточены самые знаковые monument-temples и классические маршруты Angkor Small Circuit / Grand Circuit, включая Angkor Wat, Bayon, Ta Prohm и Preah Khan.',
        E'Главный храмовый и археологический контур Angkor у северного края Сием Рипа. Здесь сосредоточены самые знаковые monument-temples и классические маршруты Angkor Small Circuit / Grand Circuit, включая Angkor Wat, Bayon, Ta Prohm и Preah Khan.\n\nПодходит для:\n- храмов и археологического наследия;\n- первого знакомства с Angkor;\n- дневных маршрутных поездок по monument-core.',
        20
      ),
      (
        'rep',
        'rep-district-banteay-srei-excursion-zone',
        'banteay-srei-excursion-zone',
        'Banteay Srei Excursion Zone',
        'បន្ទាយស្រី',
        'Внешняя excursion-зона к северо-востоку от основного храмового контура Angkor, связанная с Banteay Srei и более удалёнными историческими выездами из Сием Рипа. Это не городской район в строгом смысле, а важный day-trip cluster для тех, кто выходит за пределы базового temple core.',
        E'Внешняя excursion-зона к северо-востоку от основного храмового контура Angkor, связанная с Banteay Srei и более удалёнными историческими выездами из Сием Рипа. Это не городской район в строгом смысле, а важный day-trip cluster для тех, кто выходит за пределы базового temple core.\n\nПодходит для:\n- удалённых храмовых day trips;\n- более спокойного temple experience вне main circuit;\n- расширенного знакомства с Angkor region.',
        30
      ),
      (
        'rep',
        'rep-district-phnom-kulen-excursion-zone',
        'phnom-kulen-excursion-zone',
        'Phnom Kulen Excursion Zone',
        'ភ្នំគូលែន',
        'Внешняя природная excursion-зона в Siem Reap Province, связанная с Phnom Kulen National Park, водопадами, river carvings и sacred mountain landscape. Это уже не городской и не храмовый core, а отдельный природный day-trip кластер.',
        E'Внешняя природная excursion-зона в Siem Reap Province, связанная с Phnom Kulen National Park, водопадами, river carvings и sacred mountain landscape. Это уже не городской и не храмовый core, а отдельный природный day-trip кластер.\n\nПодходит для:\n- природных выездов из Сием Рипа;\n- водопадов и sacred mountain landscapes;\n- сочетания природы и историко-религиозного контекста.',
        40
      )
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
    co.id AS country_id,
    ci.id AS city_id
  FROM (
    VALUES
      ('pnh', 'phnom-penh'),
      ('bat', 'battambang'),
      ('kch', 'kampong-cham'),
      ('kmp', 'kampot'),
      ('kps', 'sihanoukville'),
      ('kra', 'kratie'),
      ('rep', 'siem-reap')
  ) AS cfg(city_code, city_slug)
  JOIN countries co
    ON (co.id = 'kh' OR co.slug IN ('kh', 'cambodia'))
  JOIN cities ci
    ON ci.country_id = co.id
   AND (
     ci.id = cfg.city_code
     OR ci.slug IN (cfg.city_code, cfg.city_slug, replace(cfg.city_slug, '-', ''))
   )
  ORDER BY
    cfg.city_code,
    CASE WHEN co.id = 'kh' THEN 0 WHEN co.slug = 'cambodia' THEN 1 ELSE 2 END,
    CASE
      WHEN ci.id = cfg.city_code THEN 0
      WHEN ci.slug = cfg.city_slug THEN 1
      WHEN ci.slug = cfg.city_code THEN 2
      WHEN ci.slug = replace(cfg.city_slug, '-', '') THEN 3
      ELSE 4
    END
),
district_map AS (
  SELECT
    tc.city_code,
    d.id,
    d.slug
  FROM city_districts d
  JOIN target_cities tc ON tc.city_id = d.city_id
),
container_values AS (
  SELECT *
  FROM (
    VALUES
      (
        'pnh',
        'pnh-container-sisowath-quay-riverside',
        'sisowath-quay-riverside',
        'Sisowath Quay Riverside',
        'urban-riverfront-cluster',
        'riverside-daun-penh',
        'Длинный riverfront-кластер вдоль Sisowath Quay: кафе, рестораны, колониальные фасады, отели, прогулочная туристическая жизнь у воды.'
      ),
      (
        'rep',
        'rep-container-pub-street',
        'pub-street',
        'Pub Street',
        'nightlife-street-cluster',
        'central-siem-reap-urban-core',
        'Главный nightlife- и dining-коридор Сием Рипа в центре города, воспринимаемый как самостоятельная destination-zone, а не одна точка.'
      )
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
    co.id AS country_id,
    ci.id AS city_id
  FROM (
    VALUES
      ('pnh', 'phnom-penh'),
      ('bat', 'battambang'),
      ('kch', 'kampong-cham'),
      ('kmp', 'kampot'),
      ('kps', 'sihanoukville'),
      ('kra', 'kratie'),
      ('rep', 'siem-reap')
  ) AS cfg(city_code, city_slug)
  JOIN countries co
    ON (co.id = 'kh' OR co.slug IN ('kh', 'cambodia'))
  JOIN cities ci
    ON ci.country_id = co.id
   AND (
     ci.id = cfg.city_code
     OR ci.slug IN (cfg.city_code, cfg.city_slug, replace(cfg.city_slug, '-', ''))
   )
  ORDER BY
    cfg.city_code,
    CASE WHEN co.id = 'kh' THEN 0 WHEN co.slug = 'cambodia' THEN 1 ELSE 2 END,
    CASE
      WHEN ci.id = cfg.city_code THEN 0
      WHEN ci.slug = cfg.city_slug THEN 1
      WHEN ci.slug = cfg.city_code THEN 2
      WHEN ci.slug = replace(cfg.city_slug, '-', '') THEN 3
      ELSE 4
    END
),
district_map AS (
  SELECT
    tc.city_code,
    d.id,
    d.slug
  FROM city_districts d
  JOIN target_cities tc ON tc.city_id = d.city_id
),
container_map AS (
  SELECT
    tc.city_code,
    c.id,
    c.slug
  FROM place_containers c
  JOIN target_cities tc ON tc.city_id = c.city_id
),
place_mapping AS (
  SELECT *
  FROM (
    VALUES
      ('pnh', 'pnh-brown-coffee', 'riverside-daun-penh', NULL),
      ('pnh', 'pnh-cheung-ek-killing-fields', 'dangkao-excursion-zone', NULL),
      ('pnh', 'pnh-fcc-phnom-penh', 'riverside-daun-penh', 'sisowath-quay-riverside'),
      ('pnh', 'pnh-independence-monument', 'norodom-independence-bassac', NULL),
      ('pnh', 'pnh-malis-restaurant', 'norodom-independence-bassac', NULL),
      ('pnh', 'pnh-romdeng-restaurant', 'riverside-daun-penh', NULL),
      ('pnh', 'pnh-topaz-restaurant', 'norodom-independence-bassac', NULL),
      ('pnh', 'pnh-wat-phnom', 'riverside-daun-penh', NULL),

      ('bat', 'bat-bamboo-train', 'bamboo-train-excursion-zone', NULL),
      ('bat', 'bat-kinyei-caf', 'historic-center-psar-nath-riverside', NULL),
      ('bat', 'bat-kinyei-cafe', 'historic-center-psar-nath-riverside', NULL),
      ('bat', 'bat-phnom-sampeau-bat-cave', 'phnom-sampeau-excursion-zone', NULL),

      ('kch', 'kch-samor-prei-kuk', 'sambor-prei-kuk-excursion-zone', NULL),

      ('kmp', 'kmp-crab-market', 'kep-coastal-excursion-zone', NULL),
      ('kmp', 'kmp-kep-national-park-kep-beach', 'kep-coastal-excursion-zone', NULL),
      ('kmp', 'kmp-la-plantation-pepper-farm', 'kampot-pepper-countryside', NULL),

      ('kps', 'kps-kbal-chhay-waterfall', 'prey-nob-waterfall-excursion-zone', NULL),
      ('kps', 'kps-koh-rong-island', 'koh-rong-excursion-zone', NULL),
      ('kps', 'kps-otres-beach-caf-s-bars', 'otres-beach', NULL),
      ('kps', 'kps-otres-beach-cafes-bars', 'otres-beach', NULL),

      ('kra', 'kra-cardamom-mountains', 'cardamom-mountains-excursion-zone', NULL),

      ('rep', 'rep-angkor-wat', 'angkor-archaeological-park-core', NULL),
      ('rep', 'rep-banteay-srei', 'banteay-srei-excursion-zone', NULL),
      ('rep', 'rep-bayon', 'angkor-archaeological-park-core', NULL),
      ('rep', 'rep-phare-circus', 'central-siem-reap-urban-core', NULL),
      ('rep', 'rep-phnom-kulen-national-park', 'phnom-kulen-excursion-zone', NULL),
      ('rep', 'rep-preah-khan', 'angkor-archaeological-park-core', NULL),
      ('rep', 'rep-pub-street', 'central-siem-reap-urban-core', 'pub-street'),
      ('rep', 'rep-ta-prohm', 'angkor-archaeological-park-core', NULL)
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
    OR p.country_id IN ('kh', 'cambodia')
    OR p.country_id IS NULL
    OR p.country_id = ''
  )
  AND (
    p.city_id = tc.city_id
    OR p.city_id IN (tc.city_code, tc.city_slug, replace(tc.city_slug, '-', ''))
    OR p.city_id IS NULL
    OR p.city_id = ''
  );

