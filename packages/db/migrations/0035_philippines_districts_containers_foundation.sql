-- ============================================================================
-- 0035_philippines_districts_containers_foundation.sql
-- Philippines batch foundation pass (country-level, bounded)
-- Scope: add curated districts/containers and place linkage for existing PH places
-- Source input:
-- - content/atlas/philippines/*-places-districts.md
-- - content/atlas/philippines/*-Districts-Containers.md
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
      ('mnl', 'manila', NULL),
      ('boracay', 'boracay', NULL),
      ('ceb', 'cebu', NULL),
      ('dumaguete', 'dumaguete', NULL),
      ('pps', 'palawan', 'puerto-princesa'),
      ('tag', 'bohol', 'tagbilaran')
  ) AS cfg(city_code, city_slug, city_alias)
  JOIN countries co
    ON (co.id = 'ph' OR co.slug IN ('ph', 'philippines'))
  JOIN cities ci
    ON ci.country_id = co.id
   AND (
     ci.id = cfg.city_code
     OR ci.id = COALESCE(cfg.city_alias, '')
     OR ci.slug IN (
       cfg.city_code,
       cfg.city_slug,
       replace(cfg.city_slug, '-', ''),
       COALESCE(cfg.city_alias, ''),
       replace(COALESCE(cfg.city_alias, ''), '-', '')
     )
   )
  ORDER BY
    cfg.city_code,
    CASE WHEN co.id = 'ph' THEN 0 WHEN co.slug = 'philippines' THEN 1 ELSE 2 END,
    CASE
      WHEN ci.id = cfg.city_code THEN 0
      WHEN ci.slug = cfg.city_slug THEN 1
      WHEN cfg.city_alias IS NOT NULL AND (ci.id = cfg.city_alias OR ci.slug = cfg.city_alias) THEN 2
      WHEN ci.slug = replace(cfg.city_slug, '-', '') THEN 3
      WHEN cfg.city_alias IS NOT NULL AND ci.slug = replace(cfg.city_alias, '-', '') THEN 4
      ELSE 5
    END
),
district_values AS (
  SELECT *
  FROM (
    VALUES
      ('mnl','mnl-district-intramuros-walled-city','intramuros-walled-city','Intramuros / Walled City','Intramuros',
       'Историческое испанское ядро Манилы внутри старых стен: колониальная архитектура, площади и ключевые landmark-объекты.',
       E'Историческое испанское ядро Манилы внутри старых стен: колониальная архитектура, площади и ключевые landmark-объекты.\n\nПодходит для:\n- исторических прогулок и colonial heritage;\n- первого знакомства со старой Манилой;\n- музеев, площадей и ресторанов в исторической среде.',
       10),
      ('mnl','mnl-district-binondo-chinatown','binondo-chinatown','Binondo / Chinatown','Binondo',
       'Старейший Chinatown в мире и плотный urban food-and-trade контур Манилы с ярким китайско-филиппинским наследием.',
       E'Старейший Chinatown в мире и плотный urban food-and-trade контур Манилы с ярким китайско-филиппинским наследием.\n\nПодходит для:\n- Chinatown experience и food walks;\n- уличной еды, старых лавок и рынков;\n- более плотного и живого городского ритма.',
       20),
      ('mnl','mnl-district-rizal-park-ermita','rizal-park-ermita','Rizal Park / Ermita','Ermita',
       'Центральный civic-and-park контур вдоль Roxas Boulevard и Luneta с национальными символами и монументальным городским слоем.',
       E'Центральный civic-and-park контур вдоль Roxas Boulevard и Luneta с национальными символами и монументальным городским слоем.\n\nПодходит для:\n- городских landmark-объектов и больших civic spaces;\n- прогулок по парку и boulevard edge;\n- первого знакомства с национальным символическим центром Манилы.',
       30),
      ('mnl','mnl-district-malate-roxas-boulevard','malate-roxas-boulevard','Malate / Roxas Boulevard','Malate',
       'Южный coastal-urban контур вдоль Roxas Boulevard с классическими ресторанами и более повседневным городским опытом вне heritage core.',
       E'Южный coastal-urban контур вдоль Roxas Boulevard с классическими ресторанами и более повседневным городским опытом вне heritage core.\n\nПодходит для:\n- классических филиппинских ресторанов;\n- bayfront boulevard experience;\n- более локального urban Manila вне исторического ядра.',
       40),

      ('boracay','boracay-district-white-beach-station-1-2','white-beach-station-1-2','White Beach / Station 1-2','Balabag / White Beach',
       'Главный beachfront-контур Боракая вдоль White Beach в зоне Station 1-2: курортное ядро острова с пляжной и гастрономической жизнью.',
       E'Главный beachfront-контур Боракая вдоль White Beach в зоне Station 1-2: курортное ядро острова с пляжной и гастрономической жизнью.\n\nПодходит для:\n- пляжного отдыха и sunset walks;\n- beachfront cafes и casual dining;\n- первого знакомства с классическим Boracay beach life.',
       10),
      ('boracay','boracay-district-yapak-north-boracay','yapak-north-boracay','Yapak / North Boracay','Yapak',
       'Северный более спокойный контур острова вокруг Yapak и Puka Beach с менее плотной застройкой и scenic coastal feel.',
       E'Северный более спокойный контур острова вокруг Yapak и Puka Beach с менее плотной застройкой и scenic coastal feel.\n\nПодходит для:\n- quieter beaches и северного побережья;\n- scenic coastal stops;\n- более спокойного island experience вне main resort strip.',
       20),
      ('boracay','boracay-district-bulabog-mount-luho','bulabog-mount-luho','Bulabog / Mount Luho','Bulabog / Mount Luho',
       'Elevated contour вокруг Mount Luho между White Beach и Bulabog: operational district для панорам и обзорных detour-маршрутов.',
       E'Elevated contour вокруг Mount Luho между White Beach и Bulabog: operational district для панорам и обзорных detour-маршрутов.\n\nПодходит для:\n- панорамных точек и обзорных остановок;\n- island-overlook experience;\n- коротких scenic detours от beach core.',
       30),
      ('boracay','boracay-district-ariels-point-excursion-zone','ariels-point-excursion-zone','Ariel''s Point Excursion Zone','Buruanga',
       'Внешняя marine-and-cliff excursion-zone у Buruanga на Панае; day-trip cluster, не район самого острова Боракай.',
       E'Внешняя marine-and-cliff excursion-zone у Buruanga на Панае; day-trip cluster, не район самого острова Боракай.\n\nПодходит для:\n- cliff jumping и adventure day trips;\n- boat excursions вне островного ядра;\n- активного marine experience рядом с Боракаем.',
       40),

      ('ceb','ceb-district-colonial-port-core','colonial-port-core','Colonial Port Core','Santo Nino / Plaza Independencia',
       'Историческое ядро Cebu City вокруг Basilica del Santo Nino, Magellan''s Cross, Fort San Pedro и Plaza Independencia.',
       E'Историческое ядро Cebu City вокруг Basilica del Santo Nino, Magellan''s Cross, Fort San Pedro и Plaza Independencia.\n\nПодходит для:\n- первого знакомства с историческим Cebu City;\n- храмов, фортов и испанского heritage-слоя;\n- коротких пеших маршрутов по old-core у waterfront edge.',
       10),
      ('ceb','ceb-district-fuente-capitol-urban-core','fuente-capitol-urban-core','Fuente / Capitol Urban Core','Fuente Osmena / Capitol',
       'Центральный современный urban contour вокруг Fuente Osmena и Capitol Site с local dining и повседневной городской жизнью.',
       E'Центральный современный urban contour вокруг Fuente Osmena и Capitol Site с local dining и повседневной городской жизнью.\n\nПодходит для:\n- local food и casual dining;\n- повседневного городского опыта в центре Себу;\n- базирования между heritage layer и upland районами.',
       20),
      ('ceb','ceb-district-lahug-beverly-hills','lahug-beverly-hills','Lahug / Beverly Hills','Lahug / Beverly Hills',
       'Upland-контур к северу от downtown Cebu: hillside views, храмы и локальные рестораны в более спокойной городской среде.',
       E'Upland-контур к северу от downtown Cebu: hillside views, храмы и локальные рестораны в более спокойной городской среде.\n\nПодходит для:\n- hillside views и более спокойной городской атмосферы;\n- local restaurants вне tourist-heavy old core;\n- храмов и scenic detours по северной части Cebu City.',
       30),
      ('ceb','ceb-district-badian-kawasan-excursion-zone','badian-kawasan-excursion-zone','Badian / Kawasan Excursion Zone','Badian / Kawasan',
       'Внешняя природная excursion-zone на юго-западе острова Cebu, связанная с Kawasan Falls и каньонирингом.',
       E'Внешняя природная excursion-zone на юго-западе острова Cebu, связанная с Kawasan Falls и каньонирингом.\n\nПодходит для:\n- waterfalls и canyoning trips;\n- природных day trips за пределы Cebu City;\n- adventure-oriented поездок по острову Себу.',
       40),

      ('dumaguete','dumaguete-district-rizal-boulevard-seafront','rizal-boulevard-seafront','Rizal Boulevard Seafront','Rizal Boulevard',
       'Главная seaside-полоса Думагете вдоль Rizal Boulevard с promenade, waterfront dining и классическим видом на море.',
       E'Главная seaside-полоса Думагете вдоль Rizal Boulevard с promenade, waterfront dining и классическим видом на море.\n\nПодходит для:\n- прогулок вдоль моря и sunset atmosphere;\n- seafood и casual dining у воды;\n- первого знакомства с городом как с seaside university town.',
       10),
      ('dumaguete','dumaguete-district-silliman-university-campus','silliman-university-campus','Silliman University Campus','Silliman University',
       'Зелёный academic и heritage-contour вокруг кампуса Silliman University: спокойный walkable слой рядом с морем.',
       E'Зелёный academic и heritage-contour вокруг кампуса Silliman University: спокойный walkable слой рядом с морем.\n\nПодходит для:\n- campus walks и old-academia atmosphere;\n- спокойного urban sightseeing;\n- знакомства с культурным и образовательным слоем Думагете.',
       20),
      ('dumaguete','dumaguete-district-valencia-casaroro-excursion-zone','valencia-casaroro-excursion-zone','Valencia / Casaroro Excursion Zone','Valencia',
       'Внешняя inland excursion-зона в uplands west of Dumaguete, связанная с Valencia и Casaroro Falls.',
       E'Внешняя inland excursion-зона в uplands west of Dumaguete, связанная с Valencia и Casaroro Falls.\n\nПодходит для:\n- waterfalls и short nature trips;\n- более прохладного upland experience;\n- half-day выездов из Думагете за пределы города.',
       30),
      ('dumaguete','dumaguete-district-apo-island-excursion-zone','apo-island-excursion-zone','Apo Island Excursion Zone','Apo Island',
       'Внешняя marine excursion-zone к югу от Думагете, связанная с Apo Island, reef snorkeling и diving trips.',
       E'Внешняя marine excursion-zone к югу от Думагете, связанная с Apo Island, reef snorkeling и diving trips.\n\nПодходит для:\n- snorkeling и diving excursions;\n- island day trips из Dumaguete / Dauin;\n- marine life и reef experience.',
       40),

      ('pps','pps-district-puerto-princesa-city-centre','puerto-princesa-city-centre','Puerto Princesa City Centre','Puerto Princesa City',
       'Основной городской контур Пуэрто-Принцесы вокруг Rizal Avenue и центральных кварталов; базовый городской слой и gateway по Палавану.',
       E'Основной городской контур Пуэрто-Принцесы вокруг Rizal Avenue и центральных кварталов; базовый городской слой и gateway по Палавану.\n\nПодходит для:\n- городских ресторанов и casual dining;\n- коротких прогулок и базирования перед поездками по Палавану;\n- первого знакомства с Puerto Princesa как транспортным и сервисным центром.',
       10),
      ('pps','pps-district-sabang-underground-river-excursion-zone','sabang-underground-river-excursion-zone','Sabang / Underground River Excursion Zone','Sabang',
       'Внешняя nature excursion-zone на северо-западе Palawan, связанная с Subterranean River National Park и поездками в Sabang.',
       E'Внешняя nature excursion-zone на северо-западе Palawan, связанная с Subterranean River National Park и поездками в Sabang.\n\nПодходит для:\n- underground river tours;\n- day trips из Puerto Princesa;\n- природных и karst-landscape маршрутов вне городского ядра.',
       20),
      ('pps','pps-district-el-nido-bacuit-excursion-zone','el-nido-bacuit-excursion-zone','El Nido / Bacuit Excursion Zone','El Nido',
       'Внешний northern Palawan island-hopping cluster, связанный с El Nido и Bacuit Archipelago.',
       E'Внешний northern Palawan island-hopping cluster, связанный с El Nido и Bacuit Archipelago.\n\nПодходит для:\n- island hopping и архипелага Bacuit;\n- lagoon и limestone-seascape experience;\n- extended trips по северному Палавану.',
       30),
      ('pps','pps-district-coron-kayangan-excursion-zone','coron-kayangan-excursion-zone','Coron / Kayangan Excursion Zone','Coron',
       'Внешний excursion-zone cluster в Coron / Calamian Islands, сохранённый в текущем dataset без глобальной перепривязки.',
       E'Внешний excursion-zone cluster в Coron / Calamian Islands, сохранённый в текущем dataset без глобальной перепривязки.\n\nПодходит для:\n- island day trips и Coron highlights;\n- озёр, limestone cliffs и boat-based excursions;\n- remote Palawan destination layer.',
       40),
      ('pps','pps-district-tubbataha-liveaboard-excursion-zone','tubbataha-liveaboard-excursion-zone','Tubbataha Liveaboard Excursion Zone','Tubbataha',
       'Внешний marine expedition cluster в Sulu Sea, operationally привязанный к Puerto Princesa как liveaboard departure gateway.',
       E'Внешний marine expedition cluster в Sulu Sea, operationally привязанный к Puerto Princesa как liveaboard departure gateway.\n\nПодходит для:\n- liveaboard dive expeditions;\n- marine protected area experience;\n- advanced remote nature travel из Puerto Princesa.',
       50),

      ('tag','tag-district-tagbilaran-civic-old-airport','tagbilaran-civic-old-airport','Tagbilaran Civic / Old Airport','Tagbilaran City',
       'Городской контур Тагбиларана вокруг старого центра и бывшего аэропортового ядра; operational район для urban-life части Бохоля.',
       E'Городской контур Тагбиларана вокруг старого центра и бывшего аэропортового ядра; operational район для urban-life части Бохоля.\n\nПодходит для:\n- локальной городской еды;\n- базирования в Tagbilaran City;\n- первого знакомства с городским слоем Бохоля.',
       10),
      ('tag','tag-district-panglao-dauis-coast','panglao-dauis-coast','Panglao / Dauis Coast','Panglao / Dauis',
       'Юго-западный coastal и resort contour Панглао / Dauis с seaside dining и курортной логикой day trips из Tagbilaran.',
       E'Юго-западный coastal и resort contour Панглао / Dauis с seaside dining и курортной логикой day trips из Tagbilaran.\n\nПодходит для:\n- coastal dining и resort-остановок;\n- поездок на Panglao Island;\n- более расслабленного seaside experience.',
       20),
      ('tag','tag-district-loboc-river-countryside','loboc-river-countryside','Loboc River Countryside','Loboc',
       'River-and-countryside cluster в восточной части Бохоля вокруг Loboc River и зелёных речных ландшафтов.',
       E'River-and-countryside cluster в восточной части Бохоля вокруг Loboc River и зелёных речных ландшафтов.\n\nПодходит для:\n- речных круизов и countryside day trips;\n- более зелёного inland experience;\n- обзорных поездок по центральному Бохолю.',
       30),
      ('tag','tag-district-corella-tarsier-countryside','corella-tarsier-countryside','Corella Tarsier Countryside','Corella',
       'Тихий inland contour вокруг Corella, связанный с природоохранным опытом и tarsier sanctuary.',
       E'Тихий inland contour вокруг Corella, связанный с природоохранным опытом и tarsier sanctuary.\n\nПодходит для:\n- eco-образовательных визитов;\n- природоохранного wildlife experience;\n- коротких выездов из Tagbilaran.',
       40),
      ('tag','tag-district-carmen-chocolate-hills-excursion-zone','carmen-chocolate-hills-excursion-zone','Carmen / Chocolate Hills Excursion Zone','Carmen',
       'Внешний scenic-geological cluster в глубине острова вокруг Chocolate Hills; ключевой природный day-trip слой Бохоля.',
       E'Внешний scenic-geological cluster в глубине острова вокруг Chocolate Hills; ключевой природный day-trip слой Бохоля.\n\nПодходит для:\n- iconic landscape day trips;\n- обзорных площадок и road trips по Bohol interior;\n- знакомства с главным природным символом острова.',
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
      ('mnl', 'manila', NULL),
      ('boracay', 'boracay', NULL),
      ('ceb', 'cebu', NULL),
      ('dumaguete', 'dumaguete', NULL),
      ('pps', 'palawan', 'puerto-princesa'),
      ('tag', 'bohol', 'tagbilaran')
  ) AS cfg(city_code, city_slug, city_alias)
  JOIN countries co
    ON (co.id = 'ph' OR co.slug IN ('ph', 'philippines'))
  JOIN cities ci
    ON ci.country_id = co.id
   AND (
     ci.id = cfg.city_code
     OR ci.id = COALESCE(cfg.city_alias, '')
     OR ci.slug IN (
       cfg.city_code,
       cfg.city_slug,
       replace(cfg.city_slug, '-', ''),
       COALESCE(cfg.city_alias, ''),
       replace(COALESCE(cfg.city_alias, ''), '-', '')
     )
   )
  ORDER BY
    cfg.city_code,
    CASE WHEN co.id = 'ph' THEN 0 WHEN co.slug = 'philippines' THEN 1 ELSE 2 END,
    CASE
      WHEN ci.id = cfg.city_code THEN 0
      WHEN ci.slug = cfg.city_slug THEN 1
      WHEN cfg.city_alias IS NOT NULL AND (ci.id = cfg.city_alias OR ci.slug = cfg.city_alias) THEN 2
      WHEN ci.slug = replace(cfg.city_slug, '-', '') THEN 3
      WHEN cfg.city_alias IS NOT NULL AND ci.slug = replace(cfg.city_alias, '-', '') THEN 4
      ELSE 5
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
      ('mnl','mnl-container-intramuros-manila','intramuros-manila','Intramuros Manila','historic-walled-city-cluster','intramuros-walled-city',
       'Исторический walled-city cluster как отдельная destination-zone, а не одна точка.'),
      ('mnl','mnl-container-binondo-chinatown','binondo-chinatown','Binondo Chinatown','historic-chinatown-cluster','binondo-chinatown',
       'Chinatown cluster с food streets, торговыми кварталами и китайско-филиппинским наследием.'),
      ('mnl','mnl-container-rizal-park-luneta','rizal-park-luneta','Rizal Park Luneta','urban-park-monument-cluster','rizal-park-ermita',
       'Большой civic-park cluster Luneta / Rizal Park как самостоятельная destination-zone.'),
      ('boracay','boracay-container-white-beach-boracay','white-beach-boracay','White Beach Boracay','urban-beachfront','white-beach-station-1-2',
       'Главный beachfront-кластер White Beach как отдельная destination-zone, а не одна точка.'),
      ('ceb','ceb-container-santo-nino-magellans-cross','santo-nino-magellans-cross','Santo Nino & Magellan''s Cross','historic-religious-cluster','colonial-port-core',
       'Историко-религиозный cluster вокруг Basilica del Santo Nino и Magellan''s Cross как единая destination-zone.'),
      ('dumaguete','dumaguete-container-rizal-boulevard','rizal-boulevard','Rizal Boulevard','urban-seafront-promenade','rizal-boulevard-seafront',
       'Главный seafront-promenade cluster Думагете с прогулками, кафе и видом на море.'),
      ('tag','tag-container-alona-beach','alona-beach','Alona Beach','urban-beachfront','panglao-dauis-coast',
       'Главный beachfront-cluster Panglao с resort life, dive shops, restaurants и вечерней пляжной атмосферой.')
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
      ('mnl', 'manila', NULL),
      ('boracay', 'boracay', NULL),
      ('ceb', 'cebu', NULL),
      ('dumaguete', 'dumaguete', NULL),
      ('pps', 'palawan', 'puerto-princesa'),
      ('tag', 'bohol', 'tagbilaran')
  ) AS cfg(city_code, city_slug, city_alias)
  JOIN countries co
    ON (co.id = 'ph' OR co.slug IN ('ph', 'philippines'))
  JOIN cities ci
    ON ci.country_id = co.id
   AND (
     ci.id = cfg.city_code
     OR ci.id = COALESCE(cfg.city_alias, '')
     OR ci.slug IN (
       cfg.city_code,
       cfg.city_slug,
       replace(cfg.city_slug, '-', ''),
       COALESCE(cfg.city_alias, ''),
       replace(COALESCE(cfg.city_alias, ''), '-', '')
     )
   )
  ORDER BY
    cfg.city_code,
    CASE WHEN co.id = 'ph' THEN 0 WHEN co.slug = 'philippines' THEN 1 ELSE 2 END,
    CASE
      WHEN ci.id = cfg.city_code THEN 0
      WHEN ci.slug = cfg.city_slug THEN 1
      WHEN cfg.city_alias IS NOT NULL AND (ci.id = cfg.city_alias OR ci.slug = cfg.city_alias) THEN 2
      WHEN ci.slug = replace(cfg.city_slug, '-', '') THEN 3
      WHEN cfg.city_alias IS NOT NULL AND ci.slug = replace(cfg.city_alias, '-', '') THEN 4
      ELSE 5
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
      ('mnl','mnl-barbara-s-heritage-restaurant','intramuros-walled-city',NULL),
      ('mnl','mnl-barbaras-heritage-restaurant','intramuros-walled-city',NULL),
      ('mnl','mnl-binondo','binondo-chinatown','binondo-chinatown'),
      ('mnl','mnl-intramuros','intramuros-walled-city','intramuros-manila'),
      ('mnl','mnl-rizal-park','rizal-park-ermita','rizal-park-luneta'),
      ('mnl','mnl-the-aristocrat-restaurant','malate-roxas-boulevard',NULL),

      ('boracay','boracay-ariel-s-point','ariels-point-excursion-zone',NULL),
      ('boracay','boracay-ariels-point','ariels-point-excursion-zone',NULL),
      ('boracay','boracay-jonah-s-fruit-shake','white-beach-station-1-2',NULL),
      ('boracay','boracay-jonahs-fruit-shake','white-beach-station-1-2',NULL),
      ('boracay','boracay-mount-luho-viewpoint','bulabog-mount-luho',NULL),
      ('boracay','boracay-puka-shell-beach','yapak-north-boracay',NULL),
      ('boracay','boracay-real-coffee-tea-caf','white-beach-station-1-2',NULL),
      ('boracay','boracay-real-coffee-tea-cafe','white-beach-station-1-2',NULL),
      ('boracay','boracay-white-beach','white-beach-station-1-2','white-beach-boracay'),

      ('ceb','ceb-basilica-minore-del-santo-nino-magellan-s-cross','colonial-port-core','santo-nino-magellans-cross'),
      ('ceb','ceb-basilica-minore-del-santo-nio-magellans-cross','colonial-port-core','santo-nino-magellans-cross'),
      ('ceb','ceb-cebu-taoist-temple','lahug-beverly-hills',NULL),
      ('ceb','ceb-fort-san-pedro','colonial-port-core',NULL),
      ('ceb','ceb-house-of-lechon','lahug-beverly-hills',NULL),
      ('ceb','ceb-kawasan-falls','badian-kawasan-excursion-zone',NULL),
      ('ceb','ceb-larsian-bbq','fuente-capitol-urban-core',NULL),

      ('dumaguete','dumaguete-apo-island','apo-island-excursion-zone',NULL),
      ('dumaguete','dumaguete-casaroro-falls','valencia-casaroro-excursion-zone',NULL),
      ('dumaguete','dumaguete-lab-as-seafood-restaurant','rizal-boulevard-seafront',NULL),
      ('dumaguete','dumaguete-rizal-boulevard','rizal-boulevard-seafront','rizal-boulevard'),
      ('dumaguete','dumaguete-sans-rival-cakes-pastries','rizal-boulevard-seafront',NULL),
      ('dumaguete','dumaguete-silliman-university','silliman-university-campus',NULL),

      ('pps','pps-el-nido-bacuit-archipelago','el-nido-bacuit-excursion-zone',NULL),
      ('pps','pps-kalui-restaurant','puerto-princesa-city-centre',NULL),
      ('pps','pps-kayangan-lake-coron','coron-kayangan-excursion-zone',NULL),
      ('pps','pps-kinabuch-s-grill-bar','puerto-princesa-city-centre',NULL),
      ('pps','pps-kinabuchs-grill-bar','puerto-princesa-city-centre',NULL),
      ('pps','pps-puerto-princesa-subterranean-river-national-park','sabang-underground-river-excursion-zone',NULL),
      ('pps','pps-tubbataha-reefs-natural-park','tubbataha-liveaboard-excursion-zone',NULL),

      ('tag','tag-bohol-bee-farm','panglao-dauis-coast',NULL),
      ('tag','tag-chocolate-hills','carmen-chocolate-hills-excursion-zone',NULL),
      ('tag','tag-gerarda-s-family-restaurant','tagbilaran-civic-old-airport',NULL),
      ('tag','tag-gerardas-family-restaurant','tagbilaran-civic-old-airport',NULL),
      ('tag','tag-loboc-river-cruise','loboc-river-countryside',NULL),
      ('tag','tag-panglao-island-alona-beach','panglao-dauis-coast','alona-beach'),
      ('tag','tag-philippine-tarsier-sanctuary','corella-tarsier-countryside',NULL)
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
    OR p.country_id IN ('ph', 'philippines')
    OR p.country_id IS NULL
    OR p.country_id = ''
  )
  AND (
    p.city_id = tc.city_id
    OR p.city_id IN (tc.city_code, tc.city_slug, replace(tc.city_slug, '-', ''), COALESCE(tc.city_alias, ''), replace(COALESCE(tc.city_alias, ''), '-', ''))
    OR p.city_id IS NULL
    OR p.city_id = ''
  );
