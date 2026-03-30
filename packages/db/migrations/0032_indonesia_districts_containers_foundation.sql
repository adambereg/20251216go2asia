-- ============================================================================
-- 0032_indonesia_districts_containers_foundation.sql
-- Indonesia batch foundation pass (country-level, bounded)
-- Scope: add curated districts/containers and place linkage for existing ID places
-- Source input:
-- - content/atlas/indonesia/*-places-districts.md
-- - content/atlas/indonesia/*-Districts-Containers.md
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
      ('jkt', 'jakarta', NULL),
      ('bali', 'bali', 'denpasar'),
      ('jog', 'yogyakarta', 'yog'),
      ('lbj', 'labuan-bajo', 'labuanbajo'),
      ('lom', 'lombok', NULL)
  ) AS cfg(city_code, city_slug, city_alias)
  JOIN countries co
    ON (co.id = 'id' OR co.slug IN ('id', 'indonesia'))
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
    CASE WHEN co.id = 'id' THEN 0 WHEN co.slug = 'indonesia' THEN 1 ELSE 2 END,
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
      ('jkt','jkt-district-kota-tua-glodok','kota-tua-glodok','Kota Tua / Glodok','Kota Tua / Glodok',
       'Историческое северо-западное ядро Джакарты вокруг Fatahillah Square, колониальных зданий и старой Batavia. Главный район для old-town experience, heritage-walks и атмосферных кафе.',
       E'Историческое северо-западное ядро Джакарты вокруг Fatahillah Square, колониальных зданий и старой Batavia. Главный район для old-town experience, heritage-walks и атмосферных кафе.\n\nПодходит для:\n- исторических прогулок и colonial heritage;\n- музеев, площадей и old-town атмосферы;\n- cafe stops и более медленного urban exploration.',10),
      ('jkt','jkt-district-merdeka-gambir-istiqlal','merdeka-gambir-istiqlal','Merdeka / Gambir / Istiqlal','Merdeka / Gambir / Istiqlal',
       'Государственно-монументальное сердце центральной Джакарты вокруг Merdeka Square, Monas, Istiqlal Mosque и Jakarta Cathedral.',
       E'Государственно-монументальное сердце центральной Джакарты вокруг Merdeka Square, Monas, Istiqlal Mosque и Jakarta Cathedral.\n\nПодходит для:\n- главных национальных landmark-объектов;\n- монументов, больших площадей и civic center;\n- религиозной архитектуры и city highlights.',20),
      ('jkt','jkt-district-menteng-thamrin','menteng-thamrin','Menteng / Thamrin','Menteng / Thamrin',
       'Центральный urban contour Menteng и M.H. Thamrin с skyline dining и современным ритмом города.',
       E'Центральный urban contour Menteng и M.H. Thamrin с skyline dining и современным ритмом города.\n\nПодходит для:\n- rooftop bars и skyline views;\n- heritage dining и центральных ресторанов;\n- городского ритма и modern Jakarta.',30),
      ('jkt','jkt-district-senayan-scbd','senayan-scbd','Senayan / SCBD','Senayan / SCBD',
       'Южно-центральный business-and-lifestyle контур вокруг Senayan и SCBD с shopping и modern cafes.',
       E'Южно-центральный business-and-lifestyle контур вокруг Senayan и SCBD с shopping и modern cafes.\n\nПодходит для:\n- shopping и cafe culture;\n- business-district атмосферы;\n- modern dining и city lifestyle.',40),
      ('jkt','jkt-district-ancol-north-coast','ancol-north-coast','Ancol / North Coast','Ancol',
       'Северный leisure-контур у моря: Ancol Dreamland, recreation parks, beachfront activity и family entertainment.',
       E'Северный leisure-контур у моря: Ancol Dreamland, recreation parks, beachfront activity и family entertainment.\n\nПодходит для:\n- семейных развлечений и leisure;\n- theme parks и beachside отдыха;\n- курортного urban outing на побережье.',50),
      ('jkt','jkt-district-tmii-east-jakarta-excursion-zone','tmii-east-jakarta-excursion-zone','TMII / East Jakarta Excursion Zone','TMII',
       'Восточный cultural-and-recreation cluster вокруг Taman Mini Indonesia Indah, вынесенный day-trip контур.',
       E'Восточный cultural-and-recreation cluster вокруг Taman Mini Indonesia Indah, вынесенный day-trip контур.\n\nПодходит для:\n- культурных павильонов и family day trips;\n- park-scale leisure и outdoor activity;\n- более спокойного east Jakarta experience.',60),

      ('bali','bali-district-ubud-central','ubud-central','Ubud Central','Ubud',
       'Культурное и wellness-ядро центрального Бали вокруг Ubud: cafes, fine dining, ремесленные улицы и inland lifestyle.',
       E'Культурное и wellness-ядро центрального Бали вокруг Ubud: cafes, fine dining, ремесленные улицы и inland lifestyle.\n\nПодходит для:\n- wellness и healthy cafes;\n- культурной и гастрономической атмосферы Ubud;\n- первого знакомства с inland Bali.',10),
      ('bali','bali-district-tegallalang-tampaksiring','tegallalang-tampaksiring','Tegallalang / Tampaksiring','Tegallalang / Tampaksiring',
       'Temple-and-rice-terrace зона к северу от Ubud с day trips к террасам и водным храмам.',
       E'Temple-and-rice-terrace зона к северу от Ubud с day trips к террасам и водным храмам.\n\nПодходит для:\n- rice terrace и scenic valley views;\n- храмовых и ritual-локаций;\n- коротких выездов из Ubud.',20),
      ('bali','bali-district-kintamani-batur','kintamani-batur','Kintamani / Batur','Kintamani',
       'Высокогорный volcanic-кластер вокруг Mount Batur и Lake Batur, sunrise/hiking destination.',
       E'Высокогорный volcanic-кластер вокруг Mount Batur и Lake Batur, sunrise/hiking destination.\n\nПодходит для:\n- sunrise hikes и volcano experience;\n- панорамных видов на кальдеру;\n- mountain day trips.',30),
      ('bali','bali-district-seminyak-petitenget','seminyak-petitenget','Seminyak / Petitenget','Seminyak / Petitenget',
       'Upscale beach-and-lifestyle ядро юго-запада: beach clubs, designer venues и sunset culture.',
       E'Upscale beach-and-lifestyle ядро юго-запада: beach clubs, designer venues и sunset culture.\n\nПодходит для:\n- sunset beach clubs;\n- lifestyle и dining у моря;\n- polished resort-опыта.',40),
      ('bali','bali-district-canggu-berawa','canggu-berawa','Canggu / Berawa','Canggu / Berawa',
       'Coastal-lifestyle контур с surf, beach clubs, cafes и digital-nomad атмосферой.',
       E'Coastal-lifestyle контур с surf, beach clubs, cafes и digital-nomad атмосферой.\n\nПодходит для:\n- beach clubs и активной атмосферы;\n- surf и coastal lifestyle;\n- молодого и динамичного Bali experience.',50),
      ('bali','bali-district-tanah-lot-tabanan-coast','tanah-lot-tabanan-coast','Tanah Lot / Tabanan Coast','Tanah Lot',
       'Ocean-temple и sunset-контур западного побережья Tabanan, отдельно от Seminyak/Canggu ядра.',
       E'Ocean-temple и sunset-контур западного побережья Tabanan, отдельно от Seminyak/Canggu ядра.\n\nПодходит для:\n- sunset temple experience;\n- ocean cliffs и iconic Bali imagery;\n- coastal day trips.',60),
      ('bali','bali-district-uluwatu-pecatu-cliffs','uluwatu-pecatu-cliffs','Uluwatu / Pecatu Cliffs','Uluwatu / Pecatu',
       'Юго-западный cliff-and-surf contour Bukit Peninsula: sea temples, surf breaks и cliff bars.',
       E'Юго-западный cliff-and-surf contour Bukit Peninsula: sea temples, surf breaks и cliff bars.\n\nПодходит для:\n- cliff sunsets и ocean views;\n- surf culture и clifftop bars;\n- scenic south Bali day trips.',70),

      ('jog','jog-district-central-kraton-malioboro','central-kraton-malioboro','Central Kraton / Malioboro','Kraton / Malioboro',
       'Историческое и туристическое ядро вокруг Kraton, Taman Sari и Malioboro; главный район первого знакомства с городом.',
       E'Историческое и туристическое ядро вокруг Kraton, Taman Sari и Malioboro; главный район первого знакомства с городом.\n\nПодходит для:\n- первого знакомства с Джокьякартой;\n- прогулок по историческому центру;\n- street food, рынков и городской атмосферы.',10),
      ('jog','jog-district-prawirotaman-mantrijeron','prawirotaman-mantrijeron','Prawirotaman / Mantrijeron','Prawirotaman / Mantrijeron',
       'Южный urban-lifestyle район с cafe contour и расслабленной международной атмосферой.',
       E'Южный urban-lifestyle район с cafe contour и расслабленной международной атмосферой.\n\nПодходит для:\n- cafes и brunch-локаций;\n- спокойной городской атмосферы;\n- backpacker и creative-travel среды.',20),
      ('jog','jog-district-prambanan-ratu-boko-excursion-zone','prambanan-ratu-boko-excursion-zone','Prambanan / Ratu Boko Excursion Zone','Prambanan',
       'Восточная temple-and-hills excursion-zone с Prambanan, Sambirejo и обзорными точками.',
       E'Восточная temple-and-hills excursion-zone с Prambanan, Sambirejo и обзорными точками.\n\nПодходит для:\n- храмовых выездов;\n- sunset views и hill dining;\n- историко-пейзажных поездок.',30),
      ('jog','jog-district-borobudur-kedu-plain-excursion-zone','borobudur-kedu-plain-excursion-zone','Borobudur / Kedu Plain Excursion Zone','Borobudur',
       'Внешняя историко-ландшафтная excursion-zone к северо-западу с главным heritage day trip.',
       E'Внешняя историко-ландшафтная excursion-zone к северо-западу с главным heritage day trip.\n\nПодходит для:\n- monument-site Borobudur;\n- sunrise day trips;\n- heritage-слоя Центральной Явы.',40),
      ('jog','jog-district-kaliurang-merapi-excursion-zone','kaliurang-merapi-excursion-zone','Kaliurang / Merapi Excursion Zone','Kaliurang / Merapi',
       'Северная volcanic excursion-zone у склонов Merapi, природный и adventure-oriented выезд.',
       E'Северная volcanic excursion-zone у склонов Merapi, природный и adventure-oriented выезд.\n\nПодходит для:\n- Merapi views и volcano experience;\n- jeep tours и природных маршрутов;\n- mountain day trips.',50),

      ('lbj','lbj-district-central-harbor-waterfront','central-harbor-waterfront','Central Harbor / Waterfront','Pelabuhan Labuan Bajo',
       'Центральный портовый и waterfront-контур вокруг гавани, seafood и вечерних прогулок.',
       E'Центральный портовый и waterfront-контур вокруг гавани, seafood и вечерних прогулок.\n\nПодходит для:\n- вечерних прогулок по набережной;\n- seafood и casual dining;\n- дайв-центров и отправления морских туров.',10),
      ('lbj','lbj-district-waecicu-north-bay','waecicu-north-bay','Waecicu / North Bay','Pantai Waecicu',
       'Северо-западный scenic bay contour с luxury resorts, cliffside dining и sunset views.',
       E'Северо-западный scenic bay contour с luxury resorts, cliffside dining и sunset views.\n\nПодходит для:\n- sunset dining и sea-view restaurants;\n- resort stay и более приватной атмосферы;\n- панорамных видов на бухту.',20),
      ('lbj','lbj-district-batu-cermin-wae-sambi','batu-cermin-wae-sambi','Batu Cermin / Wae Sambi','Gua Batu Cermin',
       'Inland-зона к востоку от центра: Batu Cermin Cave, известняковые холмы и short city-side nature trips.',
       E'Inland-зона к востоку от центра: Batu Cermin Cave, известняковые холмы и short city-side nature trips.\n\nПодходит для:\n- коротких выездов из города;\n- cave и geology experience;\n- природных stopover-локаций рядом с Labuan Bajo.',30),
      ('lbj','lbj-district-komodo-marine-excursion-zone','komodo-marine-excursion-zone','Komodo Marine Excursion Zone','Taman Nasional Komodo',
       'Внешняя marine excursion-zone Komodo National Park с island-hopping, viewpoints и snorkel/diving точками.',
       E'Внешняя marine excursion-zone Komodo National Park с island-hopping, viewpoints и snorkel/diving точками.\n\nПодходит для:\n- island hopping и boat tours;\n- snorkeling, diving и manta encounters;\n- iconic viewpoints и UNESCO-маршрутов.',40),

      ('lom','lom-district-kuta-south-coast','kuta-south-coast','Kuta South Coast','Kuta Mandalika',
       'Южный coastal-контур Ломбока вокруг Kuta с пляжами, surf и beach-side lifestyle.',
       E'Южный coastal-контур Ломбока вокруг Kuta с пляжами, surf и beach-side lifestyle.\n\nПодходит для:\n- beach days и surf spots;\n- coastal cafes и sunset views;\n- первого знакомства с south Lombok.',10),
      ('lom','lom-district-selong-belanak-southwest','selong-belanak-southwest','Selong Belanak Southwest','Selong Belanak',
       'Юго-западная beach-зона с широким побережьем и более спокойным ритмом.',
       E'Юго-западная beach-зона с широким побережьем и более спокойным ритмом.\n\nПодходит для:\n- спокойного beach-отдыха;\n- beach walks и surf для начинающих;\n- коротких выездов из Kuta.',20),
      ('lom','lom-district-senggigi-west-coast','senggigi-west-coast','Senggigi West Coast','Senggigi',
       'Западный coastal-контур Senggigi с resort infrastructure и sunset shoreline.',
       E'Западный coastal-контур Senggigi с resort infrastructure и sunset shoreline.\n\nПодходит для:\n- west-coast beach stay;\n- sunset dining;\n- resort-базирования на западном побережье.',30),
      ('lom','lom-district-senaru-rinjani-north','senaru-rinjani-north','Senaru / Rinjani North','Senaru',
       'Северный highland-контур у подножия Rinjani: треккинг, водопады и mountain gateways.',
       E'Северный highland-контур у подножия Rinjani: треккинг, водопады и mountain gateways.\n\nПодходит для:\n- треккинга и Rinjani routes;\n- водопадов и highland scenery;\n- adventure day trips.',40),
      ('lom','lom-district-gili-islands-excursion-zone','gili-islands-excursion-zone','Gili Islands Excursion Zone','Gili',
       'Внешняя island excursion-zone с Gili Trawangan/Meno/Air, boat transfers и marine leisure.',
       E'Внешняя island excursion-zone с Gili Trawangan/Meno/Air, boat transfers и marine leisure.\n\nПодходит для:\n- island escapes и beach leisure;\n- snorkeling и boat transfers;\n- коротких морских выездов.',50)
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
      ('jkt', 'jakarta', NULL),
      ('bali', 'bali', 'denpasar'),
      ('jog', 'yogyakarta', 'yog'),
      ('lbj', 'labuan-bajo', 'labuanbajo'),
      ('lom', 'lombok', NULL)
  ) AS cfg(city_code, city_slug, city_alias)
  JOIN countries co
    ON (co.id = 'id' OR co.slug IN ('id', 'indonesia'))
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
    CASE WHEN co.id = 'id' THEN 0 WHEN co.slug = 'indonesia' THEN 1 ELSE 2 END,
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
      ('jkt','jkt-container-kota-tua-jakarta','kota-tua-jakarta','Kota Tua Jakarta','urban-old-town-cluster','kota-tua-glodok',
       'Исторический городской кластер старой Batavia вокруг Fatahillah Square, музеев и колониальных фасадов.'),
      ('jkt','jkt-container-ancol-dreamland','ancol-dreamland','Ancol Dreamland','recreation-park-cluster','ancol-north-coast',
       'Крупный recreation-and-amusement cluster на северном побережье с family entertainment.'),
      ('jkt','jkt-container-taman-mini-indonesia-indah','taman-mini-indonesia-indah','Taman Mini Indonesia Indah','cultural-park-cluster','tmii-east-jakarta-excursion-zone',
       'Крупный cultural-and-park cluster с павильонами регионов Индонезии и family attractions.'),

      ('bali','bali-container-ubud-monkey-forest','ubud-monkey-forest','Ubud Monkey Forest','urban-forest-cultural-cluster','ubud-central',
       'Лесной и храмовый культурный кластер в Ubud как самостоятельная destination-zone.'),
      ('bali','bali-container-potato-head-seminyak','potato-head-seminyak','Potato Head Seminyak','beach-club-cluster','seminyak-petitenget',
       'Beachfront lifestyle-кластер Desa Potato Head в Seminyak / Petitenget.'),
      ('bali','bali-container-finns-berawa','finns-berawa','Finns Berawa','beach-club-cluster','canggu-berawa',
       'Beachfront leisure-кластер на Berawa Beach для beach-club опыта.'),
      ('bali','bali-container-uluwatu-temple-cliffs','uluwatu-temple-cliffs','Uluwatu Temple Cliffs','cliff-temple-scenic-cluster','uluwatu-pecatu-cliffs',
       'Scenic-cliff cluster вокруг Uluwatu Temple и южных утесов Bukit Peninsula.'),

      ('jog','jog-container-malioboro-street','malioboro-street','Malioboro Street','urban-street-cluster','central-kraton-malioboro',
       'Главный городской street-corridor с магазинами, уличной едой и вечерними прогулками.'),

      ('lbj','lbj-container-labuan-bajo-harbor','labuan-bajo-harbor','Labuan Bajo Harbor','urban-harbor-cluster','central-harbor-waterfront',
       'Главный harbor-front cluster с набережной, лодками и отправлением морских туров.'),
      ('lbj','lbj-container-komodo-national-park','komodo-national-park','Komodo National Park','marine-park-cluster','komodo-marine-excursion-zone',
       'Большой marine/island cluster: парк, острова, viewpoints и snorkeling spots.'),

      ('lom','lom-container-kuta-lombok','kuta-lombok','Kuta Lombok','coastal-town-cluster','kuta-south-coast',
       'Главный coastal-town cluster южного Ломбока для beach и surf base.'),
      ('lom','lom-container-mount-rinjani-national-park','mount-rinjani-national-park','Mount Rinjani National Park','mountain-national-park-cluster','senaru-rinjani-north',
       'Горный природный cluster вокруг Rinjani с trekking routes и highland landscapes.'),
      ('lom','lom-container-gili-islands','gili-islands','Gili Islands','island-archipelago-cluster','gili-islands-excursion-zone',
       'Островной cluster Gili как самостоятельная marine destination-zone.')
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
      ('jkt', 'jakarta', NULL),
      ('bali', 'bali', 'denpasar'),
      ('jog', 'yogyakarta', 'yog'),
      ('lbj', 'labuan-bajo', 'labuanbajo'),
      ('lom', 'lombok', NULL)
  ) AS cfg(city_code, city_slug, city_alias)
  JOIN countries co
    ON (co.id = 'id' OR co.slug IN ('id', 'indonesia'))
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
    CASE WHEN co.id = 'id' THEN 0 WHEN co.slug = 'indonesia' THEN 1 ELSE 2 END,
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
      ('jkt','jkt-ancol-dreamland','ancol-north-coast','ancol-dreamland'),
      ('jkt','jkt-cafe-batavia','kota-tua-glodok',NULL),
      ('jkt','jkt-istiqlal-mosque','merdeka-gambir-istiqlal',NULL),
      ('jkt','jkt-jakarta-cathedral','merdeka-gambir-istiqlal',NULL),
      ('jkt','jkt-kota-tua-jakarta','kota-tua-glodok','kota-tua-jakarta'),
      ('jkt','jkt-nasi-goreng-kambing-kebon-sirih','menteng-thamrin',NULL),
      ('jkt','jkt-national-monument','merdeka-gambir-istiqlal',NULL),
      ('jkt','jkt-plataran-menteng','menteng-thamrin',NULL),
      ('jkt','jkt-skye-bar-restaurant','menteng-thamrin',NULL),
      ('jkt','jkt-social-house','menteng-thamrin',NULL),
      ('jkt','jkt-taman-mini-indonesia-indah','tmii-east-jakarta-excursion-zone','taman-mini-indonesia-indah'),
      ('jkt','jkt-union-cafe','senayan-scbd',NULL),

      ('bali','bali-clear-cafe-ubud','ubud-central',NULL),
      ('bali','bali-finns-beach-club','canggu-berawa','finns-berawa'),
      ('bali','bali-locavore-restaurant','ubud-central',NULL),
      ('bali','bali-mount-batur','kintamani-batur',NULL),
      ('bali','bali-potato-head-beach-club','seminyak-petitenget','potato-head-seminyak'),
      ('bali','bali-single-fin-bali','uluwatu-pecatu-cliffs',NULL),
      ('bali','bali-tanah-lot-temple','tanah-lot-tabanan-coast',NULL),
      ('bali','bali-tegallalang-rice-terraces','tegallalang-tampaksiring',NULL),
      ('bali','bali-the-rock-bar-bali','uluwatu-pecatu-cliffs',NULL),
      ('bali','bali-tirta-empul-temple','tegallalang-tampaksiring',NULL),
      ('bali','bali-ubud-monkey-forest','ubud-central','ubud-monkey-forest'),
      ('bali','bali-uluwatu-temple','uluwatu-pecatu-cliffs','uluwatu-temple-cliffs'),

      ('jog','yog-abhayagiri-restaurant','prambanan-ratu-boko-excursion-zone',NULL),
      ('jog','yog-borobudur-temple','borobudur-kedu-plain-excursion-zone',NULL),
      ('jog','yog-gudeg-yu-djum','central-kraton-malioboro',NULL),
      ('jog','yog-kraton-yogyakarta','central-kraton-malioboro',NULL),
      ('jog','yog-malioboro-street','central-kraton-malioboro','malioboro-street'),
      ('jog','yog-milas-restaurant','prawirotaman-mantrijeron',NULL),
      ('jog','yog-mount-merapi','kaliurang-merapi-excursion-zone',NULL),
      ('jog','yog-nasi-kucing-angkringan-lik-man','central-kraton-malioboro',NULL),
      ('jog','yog-prambanan-temple','prambanan-ratu-boko-excursion-zone',NULL),
      ('jog','yog-sosro-coffee','central-kraton-malioboro',NULL),
      ('jog','yog-taman-sari-water-castle','central-kraton-malioboro',NULL),
      ('jog','yog-via-via-cafe','prawirotaman-mantrijeron',NULL),

      ('lbj','lbj-atlantis-on-the-rock','waecicu-north-bay',NULL),
      ('lbj','lbj-bajo-taco','central-harbor-waterfront',NULL),
      ('lbj','lbj-batu-cermin-cave','batu-cermin-wae-sambi',NULL),
      ('lbj','lbj-happy-banana-komodo','central-harbor-waterfront',NULL),
      ('lbj','lbj-komodo-national-park','komodo-marine-excursion-zone','komodo-national-park'),
      ('lbj','lbj-la-cucina','waecicu-north-bay',NULL),
      ('lbj','lbj-labuan-bajo-sunset-harbor','central-harbor-waterfront','labuan-bajo-harbor'),
      ('lbj','lbj-manta-point','komodo-marine-excursion-zone','komodo-national-park'),
      ('lbj','lbj-padar-island-viewpoint','komodo-marine-excursion-zone','komodo-national-park'),
      ('lbj','lbj-pink-beach','komodo-marine-excursion-zone','komodo-national-park'),
      ('lbj','lbj-scuba-junkie-komodo','central-harbor-waterfront',NULL),
      ('lbj','lbj-taman-laut-handayani-seafood','central-harbor-waterfront',NULL),

      ('lom','lom-ashtari-lounge-kitchen','kuta-south-coast',NULL),
      ('lom','lom-el-bazar-cafe-restaurant','kuta-south-coast',NULL),
      ('lom','lom-gili-islands','gili-islands-excursion-zone','gili-islands'),
      ('lom','lom-kuta-lombok','kuta-south-coast','kuta-lombok'),
      ('lom','lom-lombok-coffee-house','kuta-south-coast',NULL),
      ('lom','lom-mount-rinjani-national-park','senaru-rinjani-north','mount-rinjani-national-park'),
      ('lom','lom-selong-belanak-beach','selong-belanak-southwest',NULL),
      ('lom','lom-sendang-gile-waterfall','senaru-rinjani-north',NULL),
      ('lom','lom-senggigi-seafood-market-bbq','senggigi-west-coast',NULL),
      ('lom','lom-surf-shack-lombok','kuta-south-coast',NULL),
      ('lom','lom-tanjung-aan-beach','kuta-south-coast',NULL),
      ('lom','lom-the-mexican-in-lombok','kuta-south-coast',NULL)
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
    OR p.country_id IN ('id', 'indonesia')
    OR p.country_id IS NULL
    OR p.country_id = ''
  )
  AND (
    p.city_id = tc.city_id
    OR p.city_id IN (tc.city_code, tc.city_slug, replace(tc.city_slug, '-', ''), COALESCE(tc.city_alias, ''))
    OR p.city_id IS NULL
    OR p.city_id = ''
  );

