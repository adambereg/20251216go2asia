-- ============================================================================
-- 0034_malaysia_districts_containers_foundation.sql
-- Malaysia batch foundation pass (country-level, bounded)
-- Scope: add curated districts/containers and place linkage for existing MY places
-- Source input:
-- - content/atlas/malaysia/*-places-districts.md
-- - content/atlas/malaysia/*-Districts-Containers.md
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
      ('kll', 'kuala-lumpur', 'kul'),
      ('lgk', 'langkawi', NULL),
      ('mkz', 'melaka', 'mlk'),
      ('png', 'penang', NULL)
  ) AS cfg(city_code, city_slug, city_alias)
  JOIN countries co
    ON (co.id = 'my' OR co.slug IN ('my', 'malaysia'))
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
    CASE WHEN co.id = 'my' THEN 0 WHEN co.slug = 'malaysia' THEN 1 ELSE 2 END,
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
      ('kll','kll-district-klcc-city-centre','klcc-city-centre','KLCC / City Centre','KLCC / Pusat Bandar',
       'Современное skyline-ядро вокруг KLCC, Petronas Twin Towers и Suria KLCC; polished city-centre contour для iconic metropolitan Kuala Lumpur.',
       E'Современное skyline-ядро вокруг KLCC, Petronas Twin Towers и Suria KLCC; polished city-centre contour для iconic metropolitan Kuala Lumpur.\n\nПодходит для:\n- skyline views и главных city landmarks;\n- shopping, parks и polished city-centre atmosphere;\n- первого знакомства с современным Куала-Лумпуром.',
       10),
      ('kll','kll-district-bukit-bintang-jalan-alor','bukit-bintang-jalan-alor','Bukit Bintang / Jalan Alor','Bukit Bintang',
       'Entertainment, shopping и food contour вокруг Bukit Bintang и Jalan Alor с плотной вечерней туристической активностью.',
       E'Entertainment, shopping и food contour вокруг Bukit Bintang и Jalan Alor с плотной вечерней туристической активностью.\n\nПодходит для:\n- street food и night market atmosphere;\n- shopping и nightlife;\n- rooftop bars и активного вечернего города.',
       20),
      ('kll','kll-district-merdeka-pasar-seni','merdeka-pasar-seni','Merdeka / Pasar Seni','Dataran Merdeka / Pasar Seni',
       'Историко-гражданское ядро вокруг Merdeka Square и Central Market с колониальной архитектурой и old-KL heritage layer.',
       E'Историко-гражданское ядро вокруг Merdeka Square и Central Market с колониальной архитектурой и old-KL heritage layer.\n\nПодходит для:\n- исторических прогулок и colonial heritage;\n- рынков, площадей и старого городского слоя;\n- first-touch historical Kuala Lumpur.',
       30),
      ('kll','kll-district-bukit-nanas-ceylon','bukit-nanas-ceylon','Bukit Nanas / Ceylon','Bukit Nanas / Bukit Ceylon',
       'Центральный hillside contour между KL Tower / Bukit Nanas и Jalan Ceylon: observation landmarks и refined dining рядом с core centre.',
       E'Центральный hillside contour между KL Tower / Bukit Nanas и Jalan Ceylon: observation landmarks и refined dining рядом с core centre.\n\nПодходит для:\n- observation landmarks и city views;\n- refined dining и evening stops;\n- short central detours рядом с Bukit Bintang и KLCC.',
       40),
      ('kll','kll-district-seputeh-brickfields','seputeh-brickfields','Seputeh / Brickfields','Seputeh / Brickfields',
       'Южный urban contour вокруг Seputeh heights и Brickfields approach: храмы, hilltop views и более локальный city experience.',
       E'Южный urban contour вокруг Seputeh heights и Brickfields approach: храмы, hilltop views и более локальный city experience.\n\nПодходит для:\n- храмов и культурных stopovers;\n- hilltop viewpoints и city detours;\n- более локального urban experience вне core centre.',
       50),
      ('kll','kll-district-batu-caves-excursion-zone','batu-caves-excursion-zone','Batu Caves Excursion Zone','Batu Caves',
       'Внешняя excursion-зона к северу от KL вокруг Batu Caves; half-day trip cluster за пределами city core.',
       E'Внешняя excursion-зона к северу от KL вокруг Batu Caves; half-day trip cluster за пределами city core.\n\nПодходит для:\n- храмовой и пещерной landmark-локации;\n- half-day trips за пределы центра;\n- религиозного и фотогеничного опыта рядом с KL.',
       60),

      ('lgk','lgk-district-kuah-waterfront','kuah-waterfront','Kuah Waterfront','Kuah',
       'Городской waterfront-контур вокруг Kuah Jetty и Eagle Square; главный gateway-town cluster острова.',
       E'Городской waterfront-контур вокруг Kuah Jetty и Eagle Square; главный gateway-town cluster острова.\n\nПодходит для:\n- promenade и marina atmosphere;\n- seafood restaurants и casual dining;\n- первого знакомства с Kuah как с gateway-town.',
       10),
      ('lgk','lgk-district-pantai-cenang','pantai-cenang','Pantai Cenang','Pantai Cenang',
       'Главный beach-and-lifestyle контур с длинным пляжем, cafes, bars и вечерней курортной жизнью.',
       E'Главный beach-and-lifestyle контур с длинным пляжем, cafes, bars и вечерней курортной жизнью.\n\nПодходит для:\n- beach stay и seaside walking;\n- cafes, bars и sunset restaurants;\n- классического resort experience на Лангкави.',
       20),
      ('lgk','lgk-district-pantai-kok-machinchang','pantai-kok-machinchang','Pantai Kok / Machinchang','Pantai Kok',
       'Западный scenic cluster вокруг Pantai Kok и Machinchang range: cable car, Sky Bridge, waterfalls и nature spots.',
       E'Западный scenic cluster вокруг Pantai Kok и Machinchang range: cable car, Sky Bridge, waterfalls и nature spots.\n\nПодходит для:\n- cable car и panoramic viewpoints;\n- waterfalls и short nature trips;\n- scenic west-coast day trips.',
       30),
      ('lgk','lgk-district-kilim-karst-geoforest-zone','kilim-karst-geoforest-zone','Kilim Karst Geoforest Zone','Kilim',
       'Северо-восточная geoforest и mangrove zone: Kilim River, limestone karst и boat-based eco tours.',
       E'Северо-восточная geoforest и mangrove zone: Kilim River, limestone karst и boat-based eco tours.\n\nПодходит для:\n- mangrove tours и boat trips;\n- karst scenery и geopark experience;\n- nature-focused excursions вне beach core.',
       40),

      ('mkz','mkz-district-dutch-square-st-pauls-hill','dutch-square-st-pauls-hill','Dutch Square / St. Paul''s Hill','Dataran Belanda / Bukit St. Paul',
       'Историческое ядро Малакки вокруг Dutch Square, Christ Church, Stadthuys, A Famosa и St. Paul''s Hill.',
       E'Историческое ядро Малакки вокруг Dutch Square, Christ Church, Stadthuys, A Famosa и St. Paul''s Hill.\n\nПодходит для:\n- первого знакомства с исторической Малаккой;\n- колониального наследия, музеев и landmark-объектов;\n- прогулок между Dutch Square, A Famosa и St. Paul''s Hill.',
       10),
      ('mkz','mkz-district-jonker-heeren-kampung-pantai','jonker-heeren-kampung-pantai','Jonker / Heeren / Kampung Pantai','Jalan Hang Jebat / Heeren Street',
       'Плотный old-town contour вокруг Jonker Street и Heeren Street с shophouses, cafes и Peranakan dining.',
       E'Плотный old-town contour вокруг Jonker Street и Heeren Street с shophouses, cafes и Peranakan dining.\n\nПодходит для:\n- Jonker Street и weekend night market;\n- cafes, restaurants и shophouse heritage;\n- гастрономического и живого исторического центра.',
       20),
      ('mkz','mkz-district-harmony-street-old-quarter','harmony-street-old-quarter','Harmony Street / Old Quarter','Jalan Tukang Emas',
       'Компактный multi-faith heritage-контур вдоль Harmony Street с mosque, temple и китайским наследием.',
       E'Компактный multi-faith heritage-контур вдоль Harmony Street с mosque, temple и китайским наследием.\n\nПодходит для:\n- межрелигиозного и культурного наследия;\n- неспешных прогулок по старому кварталу;\n- изучения менее туристического historical слоя Melaka.',
       30),
      ('mkz','mkz-district-bendahara-merdeka-river-edge','bendahara-merdeka-river-edge','Bendahara / Merdeka River Edge','Jalan Bendahara / Jalan Merdeka',
       'Переходный contour к югу/юго-востоку от heritage core: old town + современные улицы, roadside dining, river-edge corridor.',
       E'Переходный contour к югу/юго-востоку от heritage core: old town + современные улицы, roadside dining, river-edge corridor.\n\nПодходит для:\n- локальной еды и менее туристических stopovers;\n- городских маршрутов за пределами Jonker core;\n- более повседневного urban Melaka.',
       40),

      ('png','png-district-heritage-core-armenian-beach-street','heritage-core-armenian-beach-street','Heritage Core / Armenian Street / Beach Street','乔治市世遗核心区',
       'Историческое сердце George Town внутри UNESCO core: shophouse-улицы, mural culture, heritage cafes и museums.',
       E'Историческое сердце George Town внутри UNESCO core: shophouse-улицы, mural culture, heritage cafes и museums.\n\nПодходит для:\n- исторических прогулок по старому George Town;\n- street art, cafes и heritage shophouses;\n- museums, old streets и первого знакомства с городом.',
       10),
      ('png','png-district-weld-quay-clan-jetties','weld-quay-clan-jetties','Weld Quay / Clan Jetties','姓氏桥 / 海墘',
       'Waterfront contour у Weld Quay и старого порта: деревянные jetty-settlements и морская торговая память.',
       E'Waterfront contour у Weld Quay и старого порта: деревянные jetty-settlements и морская торговая память.\n\nПодходит для:\n- waterfront heritage и old port atmosphere;\n- clan jetty walks и wooden settlements;\n- понимания торгового и морского прошлого Penang.',
       20),
      ('png','png-district-komtar-prangin-city-centre','komtar-prangin-city-centre','Komtar / Prangin City Centre','光大 / 市中心',
       'Современный central George Town вокруг Komtar и Prangin: malls, observation venues, transport hub.',
       E'Современный central George Town вокруг Komtar и Prangin: malls, observation venues, transport hub.\n\nПодходит для:\n- city views и modern urban Penang;\n- transport hub и центральной логистики;\n- шопинга и перехода между heritage core и новыми кварталами.',
       30),
      ('png','png-district-gurney-pulau-tikus','gurney-pulau-tikus','Gurney / Pulau Tikus','葛尼 / 浮罗池滑',
       'Северный seafront lifestyle contour вдоль Gurney Drive и Pulau Tikus: hawker culture, malls и evening promenade.',
       E'Северный seafront lifestyle contour вдоль Gurney Drive и Pulau Tikus: hawker culture, malls и evening promenade.\n\nПодходит для:\n- hawker food и evening promenade;\n- seafront lifestyle и более современного George Town;\n- coastal dining и прогулок вдоль Gurney Drive.',
       40),
      ('png','png-district-ayer-itam-penang-hill','ayer-itam-penang-hill','Ayer Itam / Penang Hill','亚依淡 / 升旗山',
       'Hill-and-temple contour вокруг Ayer Itam, Kek Lok Si и Penang Hill: зелёная обзорная и духовная зона.',
       E'Hill-and-temple contour вокруг Ayer Itam, Kek Lok Si и Penang Hill: зелёная обзорная и духовная зона.\n\nПодходит для:\n- hill views и upland experience;\n- temple visits и pilgrimage landmarks;\n- short scenic trips из George Town.',
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
      ('kll', 'kuala-lumpur', 'kul'),
      ('lgk', 'langkawi', NULL),
      ('mkz', 'melaka', 'mlk'),
      ('png', 'penang', NULL)
  ) AS cfg(city_code, city_slug, city_alias)
  JOIN countries co
    ON (co.id = 'my' OR co.slug IN ('my', 'malaysia'))
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
    CASE WHEN co.id = 'my' THEN 0 WHEN co.slug = 'malaysia' THEN 1 ELSE 2 END,
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
      ('kll','kll-container-petronas-twin-towers','petronas-twin-towers','Petronas Twin Towers','landmark-complex','klcc-city-centre',
       'Iconic landmark-complex KLCC с башнями, podium, Suria KLCC и окружающим city-centre experience.'),
      ('kll','kll-container-bukit-bintang','bukit-bintang','Bukit Bintang','urban-lifestyle-cluster','bukit-bintang-jalan-alor',
       'Главный shopping, lifestyle и nightlife cluster центрального Куала-Лумпура.'),
      ('kll','kll-container-jalan-alor-food-street','jalan-alor-food-street','Jalan Alor Food Street','food-street-corridor','bukit-bintang-jalan-alor',
       'Знаменитый food-street corridor с hawker-style dining и вечерней уличной атмосферой.'),
      ('kll','kll-container-central-market','central-market','Central Market','heritage-market-cluster','merdeka-pasar-seni',
       'Heritage market cluster Pasar Seni как самостоятельная cultural-shopping destination-zone.'),

      ('lgk','lgk-container-kuah-waterfront-promenade','kuah-waterfront-promenade','Kuah Waterfront Promenade','urban-waterfront-cluster','kuah-waterfront',
       'Главный waterfront-кластер Kuah с jetty, eagle landmark, marina-edge и вечерней прогулочной атмосферой.'),
      ('lgk','lgk-container-pantai-cenang-beach','pantai-cenang-beach','Pantai Cenang Beach','urban-beachfront','pantai-cenang',
       'Длинный beachfront-кластер Pantai Cenang как destination-zone для пляжа и resort life.'),
      ('lgk','lgk-container-oriental-village-skycab','oriental-village-skycab','Oriental Village / SkyCab','mountain-gateway-cluster','pantai-kok-machinchang',
       'Gateway-cluster у подножия Machinchang range: Cable Car и доступ к Sky Bridge.'),

      ('mkz','mkz-container-dutch-square-melaka','dutch-square-melaka','Dutch Square Melaka','historic-civic-cluster','dutch-square-st-pauls-hill',
       'Главный исторический civic-кластер вокруг красных колониальных зданий и Dutch Square.'),
      ('mkz','mkz-container-jonker-street','jonker-street','Jonker Street','heritage-street-cluster','jonker-heeren-kampung-pantai',
       'Исторический street-corridor с shophouses, cafes, museums и weekend market life в сердце старой Малакки.'),

      ('png','png-container-george-town-unesco-core','george-town-unesco-core','George Town UNESCO Core','historic-city-core-cluster','heritage-core-armenian-beach-street',
       'Исторический urban-core cluster George Town: улицы наследия, shophouses, museums и уличная культура.'),
      ('png','png-container-clan-jetties','clan-jetties','Clan Jetties','waterfront-heritage-cluster','weld-quay-clan-jetties',
       'Waterfront heritage cluster на сваях у старого порта как отдельная destination-zone.'),
      ('png','png-container-penang-street-art-route','penang-street-art-route','Penang Street Art Route','street-art-route','heritage-core-armenian-beach-street',
       'Маршрут street art по старым улицам вокруг Armenian Street как прогулочная destination-zone.'),
      ('png','png-container-gurney-drive-promenade','gurney-drive-promenade','Gurney Drive Promenade','urban-seafront-cluster','gurney-pulau-tikus',
       'Seafront lifestyle-cluster вдоль Gurney Drive: hawker food, evening walks и coastal city atmosphere.')
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
      ('kll', 'kuala-lumpur', 'kul'),
      ('lgk', 'langkawi', NULL),
      ('mkz', 'melaka', 'mlk'),
      ('png', 'penang', NULL)
  ) AS cfg(city_code, city_slug, city_alias)
  JOIN countries co
    ON (co.id = 'my' OR co.slug IN ('my', 'malaysia'))
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
    CASE WHEN co.id = 'my' THEN 0 WHEN co.slug = 'malaysia' THEN 1 ELSE 2 END,
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
      ('kll','kll-atmosphere-360','bukit-nanas-ceylon',NULL),
      ('kll','kll-batu-caves','batu-caves-excursion-zone',NULL),
      ('kll','kll-bijan-bar-restaurant','bukit-nanas-ceylon',NULL),
      ('kll','kll-bukit-bintang','bukit-bintang-jalan-alor','bukit-bintang'),
      ('kll','kll-central-market','merdeka-pasar-seni','central-market'),
      ('kll','kll-heli-lounge-bar','bukit-bintang-jalan-alor',NULL),
      ('kll','kll-jalan-alor-food-street','bukit-bintang-jalan-alor','jalan-alor-food-street'),
      ('kll','kll-klcc-park','klcc-city-centre',NULL),
      ('kll','kll-madam-kwan-s','klcc-city-centre',NULL),
      ('kll','kll-merdeka-square','merdeka-pasar-seni',NULL),
      ('kll','kll-petronas-twin-towers','klcc-city-centre','petronas-twin-towers'),
      ('kll','kll-thean-hou-temple','seputeh-brickfields',NULL),

      ('lgk','lgk-eagle-square','kuah-waterfront','kuah-waterfront-promenade'),
      ('lgk','lgk-kilim-karst-geoforest-park','kilim-karst-geoforest-zone',NULL),
      ('lgk','lgk-langkawi-cable-car','pantai-kok-machinchang','oriental-village-skycab'),
      ('lgk','lgk-langkawi-sky-bridge','pantai-kok-machinchang','oriental-village-skycab'),
      ('lgk','lgk-orkid-ria-seafood-restaurant','kuah-waterfront',NULL),
      ('lgk','lgk-pantai-cenang-beach','pantai-cenang','pantai-cenang-beach'),
      ('lgk','lgk-sunset-dinner-cruise-langkawi','kuah-waterfront','kuah-waterfront-promenade'),
      ('lgk','lgk-telaga-tujuh-waterfalls','pantai-kok-machinchang',NULL),
      ('lgk','lgk-the-cliff-restaurant-bar','pantai-cenang',NULL),
      ('lgk','lgk-wonderland-food-store','kuah-waterfront',NULL),
      ('lgk','lgk-yellow-cafe','pantai-cenang',NULL),

      ('mkz','mkz-a-famosa-fortress','dutch-square-st-pauls-hill',NULL),
      ('mkz','mkz-capitol-satay','bendahara-merdeka-river-edge',NULL),
      ('mkz','mkz-cheng-ho-cultural-museum','jonker-heeren-kampung-pantai',NULL),
      ('mkz','mkz-christ-church-melaka','dutch-square-st-pauls-hill','dutch-square-melaka'),
      ('mkz','mkz-geographer-cafe','jonker-heeren-kampung-pantai',NULL),
      ('mkz','mkz-jonker-street','jonker-heeren-kampung-pantai','jonker-street'),
      ('mkz','mkz-jonker-walk-night-market','jonker-heeren-kampung-pantai','jonker-street'),
      ('mkz','mkz-kampung-kling-mosque','harmony-street-old-quarter',NULL),
      ('mkz','mkz-nancy-s-kitchen','jonker-heeren-kampung-pantai',NULL),
      ('mkz','mkz-red-square','dutch-square-st-pauls-hill','dutch-square-melaka'),
      ('mkz','mkz-riverine-coffee','bendahara-merdeka-river-edge',NULL),
      ('mkz','mkz-st-paul-s-hill-church-ruins','dutch-square-st-pauls-hill',NULL),
      ('mkz','mkz-the-daily-fix-cafe','jonker-heeren-kampung-pantai',NULL),

      ('png','png-cheong-fatt-tze-blue-mansion','heritage-core-armenian-beach-street',NULL),
      ('png','png-china-house','heritage-core-armenian-beach-street',NULL),
      ('png','png-clan-jetties-of-penang','weld-quay-clan-jetties','clan-jetties'),
      ('png','png-george-town-unesco-world-heritage-area','heritage-core-armenian-beach-street','george-town-unesco-core'),
      ('png','png-gurney-drive-hawker-centre','gurney-pulau-tikus','gurney-drive-promenade'),
      ('png','png-jawi-house-cafe-gallery','heritage-core-armenian-beach-street',NULL),
      ('png','png-kek-lok-si-temple','ayer-itam-penang-hill',NULL),
      ('png','png-penang-hill','ayer-itam-penang-hill',NULL),
      ('png','png-penang-street-art','heritage-core-armenian-beach-street','penang-street-art-route'),
      ('png','png-tek-sen-restaurant','heritage-core-armenian-beach-street',NULL),
      ('png','png-the-top-komtar-sky-dining','komtar-prangin-city-centre',NULL)
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
    OR p.country_id IN ('my', 'malaysia')
    OR p.country_id IS NULL
    OR p.country_id = ''
  )
  AND (
    p.city_id = tc.city_id
    OR p.city_id IN (tc.city_code, tc.city_slug, replace(tc.city_slug, '-', ''), COALESCE(tc.city_alias, ''))
    OR p.city_id IS NULL
    OR p.city_id = ''
  );

