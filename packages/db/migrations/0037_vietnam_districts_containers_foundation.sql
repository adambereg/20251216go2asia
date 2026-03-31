-- ============================================================================
-- 0037_vietnam_districts_containers_foundation.sql
-- Vietnam batch foundation pass (country-level, bounded)
-- Scope: add curated districts/containers and place linkage for existing VN places
-- Source input:
-- - content/atlas/vietnam/*-places-districts.md
-- - content/atlas/vietnam/*-Districts-Containers.md
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
      ('han', 'hanoi', NULL),
      ('dad', 'da-nang', 'danang'),
      ('dla', 'dalat', 'da-lat'),
      ('hoi', 'hoi-an', 'hoian'),
      ('hue', 'hue', NULL),
      ('ntr', 'nha-trang', 'nhatrang'),
      ('phu', 'phu-quoc', 'phuquoc'),
      ('sgn', 'ho-chi-minh-city', 'hochiminhcity')
  ) AS cfg(city_code, city_slug, city_alias)
  JOIN countries co
    ON (co.id = 'vn' OR co.slug IN ('vn', 'vietnam'))
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
    CASE WHEN co.id = 'vn' THEN 0 WHEN co.slug = 'vietnam' THEN 1 ELSE 2 END,
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
      ('han','han-district-old-quarter-hoan-kiem','old-quarter-hoan-kiem','Old Quarter / Hoan Kiem','Phố Cổ / Hồ Hoàn Kiếm',
       'Историко-туристическое ядро вокруг Old Quarter и озера Хоанкьем; главный район для первого знакомства с Ханоем.',
       E'Историко-туристическое ядро вокруг Old Quarter и озера Хоанкьем; главный район для первого знакомства с Ханоем.\n\nПодходит для:\n- первого знакомства с Ханоем;\n- street food, cafes и walkable old-city;\n- озера Хоанкьем, соборного слоя и исторических прогулок.',
       10),
      ('han','han-district-ba-dinh-political-core','ba-dinh-political-core','Ba Dinh Political Core','Ba Đình',
       'Монументально-политическое civic core с площадью Бадинь, мавзолеем Хо Ши Мина и знаковыми государственными лендмарками.',
       E'Монументально-политическое civic core с площадью Бадинь, мавзолеем Хо Ши Мина и знаковыми государственными лендмарками.\n\nПодходит для:\n- национальных лендмарков и civic center;\n- храмов, монументов и официального исторического слоя;\n- обзорного маршрута по символическому Ханою.',
       20),
      ('han','han-district-french-quarter-tran-hung-dao','french-quarter-tran-hung-dao','French Quarter / Tran Hung Dao','Khu Phố Pháp / Trần Hưng Đạo',
       'Просторный колониальный контур к юго-востоку от Old Quarter с бульварами, музеями и refined dining.',
       E'Просторный колониальный контур к юго-востоку от Old Quarter с бульварами, музеями и refined dining.\n\nПодходит для:\n- колониальных бульваров и спокойных city walks;\n- музеев и refined dining;\n- перехода от Old Quarter к более широкому central Hanoi.',
       30),
      ('han','han-district-west-lake-truc-bach','west-lake-truc-bach','West Lake / Truc Bach','Hồ Tây / Trúc Bạch',
       'Северо-западный lake-oriented контур с храмами, видами на озеро и более расслабленной атмосферой вне плотного центра.',
       E'Северо-западный lake-oriented контур с храмами, видами на озеро и более расслабленной атмосферой вне плотного центра.\n\nПодходит для:\n- прогулок у озера;\n- scenic detours и храмов;\n- cafe-time вне Old Quarter.',
       40),

      ('dad','dad-district-han-river-hai-chau-core','han-river-hai-chau-core','Han River / Hai Chau Core','Hải Châu / Sông Hàn',
       'Центральный контур Дананга вокруг реки Хан, мостов, рынков и набережной; главный городской urban core.',
       E'Центральный контур Дананга вокруг реки Хан, мостов, рынков и набережной; главный городской urban core.\n\nПодходит для:\n- первого знакомства с городским Данангом;\n- набережной, мостов и evening lights;\n- рынков, rooftop и центральной гастрономии.',
       10),
      ('dad','dad-district-my-khe-phuoc-my-coast','my-khe-phuoc-my-coast','My Khe / Phuoc My Coast','Mỹ Khê / Phước Mỹ',
       'Восточный beach/coast контур вдоль My Khe и Phuoc My с beachfront-жизнью и seafood.',
       E'Восточный beach/coast контур вдоль My Khe и Phuoc My с beachfront-жизнью и seafood.\n\nПодходит для:\n- городского пляжа;\n- seafood и casual dining у моря;\n- sunset и более курортного ритма внутри города.',
       20),
      ('dad','dad-district-son-tra-peninsula-east','son-tra-peninsula-east','Son Tra Peninsula East','Bán đảo Sơn Trà',
       'Сценический полуостровной контур с viewpoints, Linh Ung Pagoda и coastal roads.',
       E'Сценический полуостровной контур с viewpoints, Linh Ung Pagoda и coastal roads.\n\nПодходит для:\n- панорамных поездок и viewpoints;\n- храмов и scenic coast;\n- luxury dining и resort experience.',
       30),
      ('dad','dad-district-ngu-hanh-son-non-nuoc','ngu-hanh-son-non-nuoc','Ngu Hanh Son / Non Nuoc','Ngũ Hành Sơn / Non Nước',
       'Юго-восточный coastal/heritage контур вокруг Marble Mountains и Non Nuoc Beach.',
       E'Юго-восточный coastal/heritage контур вокруг Marble Mountains и Non Nuoc Beach.\n\nПодходит для:\n- cave temples и heritage nature;\n- более спокойного пляжа вне My Khe;\n- коротких scenic выездов к югу от центра.',
       40),
      ('dad','dad-district-ba-na-hills-excursion-zone','ba-na-hills-excursion-zone','Ba Na Hills Excursion Zone','Bà Nà Hills',
       'Вынесенная mountain/theme-park excursion-зона с Golden Bridge и highland leisure.',
       E'Вынесенная mountain/theme-park excursion-зона с Golden Bridge и highland leisure.\n\nПодходит для:\n- Golden Bridge и фото-стопов;\n- канатной дороги и family day trips;\n- прохладного mountain leisure за городом.',
       50),

      ('dla','dla-district-xuan-huong-market-core','xuan-huong-market-core','Xuan Huong / Market Core','Hồ Xuân Hương / Chợ Đà Lạt',
       'Центральный contour вокруг озера Xuân Hương, рынков и walkable центра; базовый район для first-touch Da Lat.',
       E'Центральный contour вокруг озера Xuân Hương, рынков и walkable центра; базовый район для first-touch Da Lat.\n\nПодходит для:\n- первого знакомства с Далатом;\n- прогулок у озера и по вечернему центру;\n- рынков, cafes и городской атмосферы.',
       10),
      ('dla','dla-district-palaces-cathedral-hills','palaces-cathedral-hills','Palaces / Cathedral Hills','Nhà thờ Con Gà / Dinh Bảo Đại',
       'Central-hills contour с heritage архитектурой, собором, дворцом и тихими подъёмами над центром.',
       E'Central-hills contour с heritage архитектурой, собором, дворцом и тихими подъёмами над центром.\n\nПодходит для:\n- французского и имперского heritage-слоя;\n- cathedral, palace и unusual architecture stops;\n- спокойных прогулок по hill-station кварталам.',
       20),
      ('dla','dla-district-station-trai-mat-east','station-trai-mat-east','Station / Trai Mat East','Ga Đà Lạt / Trại Mát',
       'Восточный contour от исторической станции к Trại Mát с railway heritage и temple-destination.',
       E'Восточный contour от исторической станции к Trại Mát с railway heritage и temple-destination.\n\nПодходит для:\n- railway heritage и поездок на старом поезде;\n- eastern city detours и temple visits;\n- более тихого культурного слоя.',
       30),
      ('dla','dla-district-north-lake-gardens','north-lake-gardens','North Lake Gardens','Vườn hoa / Đồi thông',
       'Северный scenic contour с садами, pine viewpoints и Valley of Love.',
       E'Северный scenic contour с садами, pine viewpoints и Valley of Love.\n\nПодходит для:\n- садов, цветов и pine-view experience;\n- прогулок у северной части озера;\n- фотогеничных landscape-локаций.',
       40),
      ('dla','dla-district-tuyen-lam-south-excursion-zone','tuyen-lam-south-excursion-zone','Tuyen Lam South Excursion Zone','Hồ Tuyền Lâm / Thiền Viện Trúc Lâm',
       'Южная lake-and-monastery excursion-зона с Datanla и pine nature day-trips.',
       E'Южная lake-and-monastery excursion-зона с Datanla и pine nature day-trips.\n\nПодходит для:\n- озера, монастыря и природных day trips;\n- спокойного pine-and-lake experience;\n- коротких выездов из центра.',
       50),
      ('dla','dla-district-cam-ly-west-hills','cam-ly-west-hills','Cam Ly West Hills','Cam Ly',
       'Западный ближний contour с Cam Ly Waterfall и более локальным городским слоем.',
       E'Западный ближний contour с Cam Ly Waterfall и более локальным городским слоем.\n\nПодходит для:\n- коротких западных detours;\n- small waterfall stopovers;\n- более локального и менее туристического experience.',
       60),

      ('hoi','hoi-district-ancient-town-tran-phu-core','ancient-town-tran-phu-core','Ancient Town / Tran Phu Core','Phố cổ Hội An',
       'Историческое UNESCO-ядро Hoi An вокруг Tran Phu, Japanese Bridge и старого riverfront.',
       E'Историческое UNESCO-ядро Hoi An вокруг Tran Phu, Japanese Bridge и старого riverfront.\n\nПодходит для:\n- first-touch Хойана;\n- heritage прогулок по старому городу;\n- cafes, tailoring и street-food.',
       10),
      ('hoi','hoi-district-an-hoi-riverside-market','an-hoi-riverside-market','An Hoi Riverside / Market','Cù lao An Hội',
       'Вечерний riverside contour острова An Hoi с night market, фонарями и набережной.',
       E'Вечерний riverside contour острова An Hoi с night market, фонарями и набережной.\n\nПодходит для:\n- night market и lantern-атмосферы;\n- вечерних прогулок у реки;\n- street-food и сувенирного evening-layer.',
       20),
      ('hoi','hoi-district-cam-an-an-bang-coast','cam-an-an-bang-coast','Cam An / An Bang Coast','Cẩm An / An Bàng',
       'Coastal contour у An Bang Beach с relaxed rhythm, beach bars и seaside dining.',
       E'Coastal contour у An Bang Beach с relaxed rhythm, beach bars и seaside dining.\n\nПодходит для:\n- пляжного отдыха и beach bars;\n- seaside dining и sunset stops;\n- более расслабленного coastal experience.',
       30),
      ('hoi','hoi-district-tra-que-cam-ha-countryside','tra-que-cam-ha-countryside','Tra Que / Cam Ha Countryside','Trà Quế / Cẩm Hà',
       'Countryside contour с Tra Que Vegetable Village и slow-life rural layer рядом со старым городом.',
       E'Countryside contour с Tra Que Vegetable Village и slow-life rural layer рядом со старым городом.\n\nПодходит для:\n- агротуризма и cooking experiences;\n- countryside rides;\n- спокойного village-layer.',
       40),
      ('hoi','hoi-district-thanh-ha-river-pottery-village','thanh-ha-river-pottery-village','Thanh Ha River / Pottery Village','Thanh Hà',
       'Северный riverside/craft contour с Thanh Ha Pottery Village и короткими cultural detours.',
       E'Северный riverside/craft contour с Thanh Ha Pottery Village и короткими cultural detours.\n\nПодходит для:\n- craft village visits;\n- pottery workshops и cultural detours;\n- коротких riverside выездов.',
       50),
      ('hoi','hoi-district-cham-islands-excursion-zone','cham-islands-excursion-zone','Cham Islands Excursion Zone','Cù Lao Chàm',
       'Островной excursion cluster у побережья Hoi An для marine day trips и snorkeling.',
       E'Островной excursion cluster у побережья Hoi An для marine day trips и snorkeling.\n\nПодходит для:\n- island day trips и speedboat;\n- snorkeling и морских выездов;\n- выхода за пределы urban/coastal Hoi An.',
       60),

      ('hue','hue-district-imperial-citadel-dong-ba','imperial-citadel-dong-ba','Imperial Citadel / Dong Ba','Kinh thành Huế / Đông Ba',
       'Северный исторический контур вокруг Imperial City и Dong Ba Market с наследием бывшей столицы.',
       E'Северный исторический контур вокруг Imperial City и Dong Ba Market с наследием бывшей столицы.\n\nПодходит для:\n- имперской цитадели и исторических прогулок;\n- рынков и старого городского слоя;\n- first-touch с наследием Хюэ.',
       10),
      ('hue','hue-district-south-bank-truong-tien-core','south-bank-truong-tien-core','South Bank / Truong Tien Core','Bờ nam / Cầu Trường Tiền',
       'Южный берег Perfume River с walking streets, food scene и evening city life.',
       E'Южный берег Perfume River с walking streets, food scene и evening city life.\n\nПодходит для:\n- city walks вдоль реки;\n- cafes, local food и evening atmosphere;\n- urban-life вне имперского ядра.',
       20),
      ('hue','hue-district-kim-long-thien-mu-west-bank','kim-long-thien-mu-west-bank','Kim Long / Thien Mu West Bank','Kim Long / Chùa Thiên Mụ',
       'Спокойный западный берег с Thiên Mụ, river-view маршрутом и quieter heritage layer.',
       E'Спокойный западный берег с Thiên Mụ, river-view маршрутом и quieter heritage layer.\n\nПодходит для:\n- пагод и river-view sightseeing;\n- спокойного исторического Хюэ;\n- коротких прогулок вдоль западного берега.',
       30),
      ('hue','hue-district-southern-hills-ritual-zone','southern-hills-ritual-zone','Southern Hills / Ritual Zone','Đồi phía nam / Nam Giao',
       'Южный green-and-ritual contour: Nam Giao, холмы, храмы и viewpoints вне riverfront core.',
       E'Южный green-and-ritual contour: Nam Giao, холмы, храмы и viewpoints вне riverfront core.\n\nПодходит для:\n- ritual heritage и pine-hill atmosphere;\n- scenic viewpoints;\n- half-day detours вне центра.',
       40),
      ('hue','hue-district-tam-giang-lagoon-excursion-zone','tam-giang-lagoon-excursion-zone','Tam Giang Lagoon Excursion Zone','Đầm phá Tam Giang',
       'Внешняя lagoon-зона Tam Giang с sunset boat trips и рыбацким coastal life.',
       E'Внешняя lagoon-зона Tam Giang с sunset boat trips и рыбацким coastal life.\n\nПодходит для:\n- sunset lagoon trips;\n- seafood detours и village views;\n- природы за пределами центра.',
       50),
      ('hue','hue-district-bach-ma-excursion-zone','bach-ma-excursion-zone','Bach Ma Excursion Zone','Vườn quốc gia Bạch Mã',
       'Внешняя mountain-and-forest excursion-зона с Bạch Mã National Park и водопадами.',
       E'Внешняя mountain-and-forest excursion-зона с Bạch Mã National Park и водопадами.\n\nПодходит для:\n- mountain nature и trekking;\n- waterfalls и forest roads;\n- cooler highland day trips из Хюэ.',
       60),

      ('ntr','ntr-district-tran-phu-beachfront-core','tran-phu-beachfront-core','Tran Phu Beachfront Core','Trần Phú',
       'Главный seaside contour Нячанга вдоль Trần Phú: пляж, promenade, beach bars и resort rhythm.',
       E'Главный seaside contour Нячанга вдоль Trần Phú: пляж, promenade, beach bars и resort rhythm.\n\nПодходит для:\n- пляжа и набережной;\n- beach clubs, rooftop и seaside dining;\n- первого знакомства с курортным Нячангом.',
       10),
      ('ntr','ntr-district-old-town-cathedral-cho-dam','old-town-cathedral-cho-dam','Old Town / Cathedral / Cho Dam','Chợ Đầm / Nhà thờ Núi',
       'Старый городской contour с Chợ Đầm и cathedral-layer; более локальный city experience вне promenade.',
       E'Старый городской contour с Chợ Đầm и cathedral-layer; более локальный city experience вне promenade.\n\nПодходит для:\n- рынков и local food;\n- cathedral и everyday city walks;\n- менее туристического Нячанга.',
       20),
      ('ntr','ntr-district-cau-da-south-port','cau-da-south-port','Cau Da / South Port','Cầu Đá',
       'Южный port/coastal contour с Institute of Oceanography и gateway к island trips.',
       E'Южный port/coastal contour с Institute of Oceanography и gateway к island trips.\n\nПодходит для:\n- музеев и marine-education;\n- южного coastal promenade;\n- отправки к южным бухтам и островам.',
       30),
      ('ntr','ntr-district-hon-chong-vinh-phuoc-north-coast','hon-chong-vinh-phuoc-north-coast','Hon Chong / Vinh Phuoc North Coast','Hòn Chồng / Vĩnh Phước',
       'Северный scenic coast с Hon Chong, Po Nagar и landmark temples вне центрального пляжного ядра.',
       E'Северный scenic coast с Hon Chong, Po Nagar и landmark temples вне центрального пляжного ядра.\n\nПодходит для:\n- coastal viewpoints;\n- historical temple landmarks;\n- sightseeing вне Tran Phu core.',
       40),
      ('ntr','ntr-district-long-son-west-urban-hills','long-son-west-urban-hills','Long Son / West Urban Hills','Long Sơn',
       'Западный inland contour у холмов с Long Sơn Pagoda и wellness short trips.',
       E'Западный inland contour у холмов с Long Sơn Pagoda и wellness short trips.\n\nПодходит для:\n- храмов и панорам;\n- mud-bath/wellness stopovers;\n- выездов вне central coastal core.',
       50),
      ('ntr','ntr-district-hon-mun-vinpearl-excursion-zone','hon-mun-vinpearl-excursion-zone','Hon Mun / Vinpearl Excursion Zone','Hòn Mun / Hòn Tre',
       'Внешняя island/marine excursion-зона с Hon Mun и VinWonders на Hòn Tre.',
       E'Внешняя island/marine excursion-зона с Hon Mun и VinWonders на Hòn Tre.\n\nПодходит для:\n- island hopping и marine excursions;\n- cable car и theme-park leisure;\n- snorkeling и day trips вне city core.',
       60),

      ('phu','phu-district-duong-dong-dinh-cau-core','duong-dong-dinh-cau-core','Duong Dong / Dinh Cau Core','Dương Đông / Dinh Cậu',
       'Главный городской контур Фукуока вокруг Dương Đông, Dinh Cậu и central night-market zone.',
       E'Главный городской контур Фукуока вокруг Dương Đông, Dinh Cậu и central night-market zone.\n\nПодходит для:\n- первого знакомства с urban Фукуоком;\n- seafood и evening walks;\n- night market и central city atmosphere.',
       10),
      ('phu','phu-district-long-beach-tran-hung-dao','long-beach-tran-hung-dao','Long Beach / Tran Hung Dao','Bãi Trường / Trần Hưng Đạo',
       'Длинный западный beachfront contour Long Beach и Trần Hưng Đạo с resort life и sunset dining.',
       E'Длинный западный beachfront contour Long Beach и Trần Hưng Đạo с resort life и sunset dining.\n\nПодходит для:\n- beach stay и sunset atmosphere;\n- beachfront dining и cocktail bars;\n- классического west-coast resort experience.',
       20),
      ('phu','phu-district-ong-lang-cua-duong','ong-lang-cua-duong','Ong Lang / Cua Duong','Ông Lang / Cửa Dương',
       'Более спокойный северо-западный coastal contour вокруг Ong Lang Beach и Cửa Dương roads.',
       E'Более спокойный северо-западный coastal contour вокруг Ong Lang Beach и Cửa Dương roads.\n\nПодходит для:\n- quieter beach experience;\n- sunset coast и laid-back dining;\n- отдыха вне плотного Dương Đông / Long Beach ядра.',
       30),
      ('phu','phu-district-an-thoi-hon-thom-south','an-thoi-hon-thom-south','An Thoi / Hon Thom South','An Thới / Hòn Thơm',
       'Южный coastal-and-island gateway contour с Hon Thom cable car, Sao Beach и marine day trips.',
       E'Южный coastal-and-island gateway contour с Hon Thom cable car, Sao Beach и marine day trips.\n\nПодходит для:\n- cable car и island-hopping;\n- южных beaches и marine leisure;\n- day trips через An Thoi corridor.',
       40),
      ('phu','phu-district-ganh-dau-bai-dai-northwest','ganh-dau-bai-dai-northwest','Ganh Dau / Bai Dai Northwest','Gành Dầu / Bãi Dài',
       'Северо-западный leisure contour Gành Dầu / Bãi Dài с Vinpearl/Grand World и coastal villages.',
       E'Северо-западный leisure contour Gành Dầu / Bãi Dài с Vinpearl/Grand World и coastal villages.\n\nПодходит для:\n- seafood villages и northern coast views;\n- entertainment/theme-park stops;\n- resort day trips на северо-запад острова.',
       50),
      ('phu','phu-district-phu-quoc-national-park-interior','phu-quoc-national-park-interior','Phu Quoc National Park Interior','Vườn quốc gia Phú Quốc',
       'Внутренний природный contour острова с jungle roads, biodiversity и nature exploration beyond coast.',
       E'Внутренний природный contour острова с jungle roads, biodiversity и nature exploration beyond coast.\n\nПодходит для:\n- jungle и national park experience;\n- nature drives и interior exploration;\n- более дикого природного слоя Фукуока.',
       60),

      ('sgn','sgn-district-ben-thanh-old-market-core','ben-thanh-old-market-core','Ben Thanh / Old Market Core','Bến Thành',
       'Плотный food-and-market contour вокруг Ben Thanh и старого центра District 1.',
       E'Плотный food-and-market contour вокруг Ben Thanh и старого центра District 1.\n\nПодходит для:\n- рынков, street food и casual local dining;\n- первого знакомства с центральным Сайгоном;\n- walkable urban experience в сердце District 1.',
       10),
      ('sgn','sgn-district-dong-khoi-civic-core','dong-khoi-civic-core','Dong Khoi / Civic Core','Đồng Khởi / Công xã Paris',
       'Историко-гражданское ядро Đồng Khởi и Paris Commune Square с Notre-Dame, Post Office и Independence Palace.',
       E'Историко-гражданское ядро Đồng Khởi и Paris Commune Square с Notre-Dame, Post Office и Independence Palace.\n\nПодходит для:\n- colonial heritage и city landmarks;\n- civic sightseeing и архитектурных прогулок;\n- первого знакомства с историческим центром Хошимина.',
       20),
      ('sgn','sgn-district-ben-nghe-nguyen-hue-riverfront','ben-nghe-nguyen-hue-riverfront','Ben Nghe / Nguyen Hue Riverfront','Bến Nghé / Nguyễn Huệ',
       'Polished riverfront/skyline contour District 1 вокруг Nguyen Hue, Bitexco и центрального waterfront.',
       E'Polished riverfront/skyline contour District 1 вокруг Nguyen Hue, Bitexco и центрального waterfront.\n\nПодходит для:\n- skyline views и rooftop bars;\n- specialty coffee и business-district atmosphere;\n- river walks и evening city life.',
       30),
      ('sgn','sgn-district-dakao-pasteur-district-3','dakao-pasteur-district-3','Da Kao / Pasteur / District 3','Đa Kao / Pasteur / Quận 3',
       'Расширенный central-urban contour District 3/Da Kao с музеями, пагодами и park-side улицами.',
       E'Расширенный central-urban contour District 3/Da Kao с музеями, пагодами и park-side улицами.\n\nПодходит для:\n- музеев, пагод и исторических stopovers;\n- local food и более живого городского опыта;\n- прогулок вне главного tourist core.',
       40),
      ('sgn','sgn-district-cho-lon-binh-tay','cho-lon-binh-tay','Cho Lon / Binh Tay','Chợ Lớn / Bình Tây',
       'Chinese-Saigon trade contour западной части города вокруг Chợ Lớn и Binh Tay Market.',
       E'Chinese-Saigon trade contour западной части города вокруг Chợ Lớn и Binh Tay Market.\n\nПодходит для:\n- Chinatown experience и торговых кварталов;\n- рынков и local urban food culture;\n- аутентичного western Saigon outside District 1.',
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
      ('han', 'hanoi', NULL),
      ('dad', 'da-nang', 'danang'),
      ('dla', 'dalat', 'da-lat'),
      ('hoi', 'hoi-an', 'hoian'),
      ('hue', 'hue', NULL),
      ('ntr', 'nha-trang', 'nhatrang'),
      ('phu', 'phu-quoc', 'phuquoc'),
      ('sgn', 'ho-chi-minh-city', 'hochiminhcity')
  ) AS cfg(city_code, city_slug, city_alias)
  JOIN countries co
    ON (co.id = 'vn' OR co.slug IN ('vn', 'vietnam'))
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
    CASE WHEN co.id = 'vn' THEN 0 WHEN co.slug = 'vietnam' THEN 1 ELSE 2 END,
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
      ('han','han-container-hanoi-old-quarter','hanoi-old-quarter','Hanoi Old Quarter','historic-urban-quarter','old-quarter-hoan-kiem',
       'Плотный исторический квартал с food lanes, узкими улицами и пешеходной энергией.'),
      ('han','han-container-hoan-kiem-lake','hoan-kiem-lake','Hoan Kiem Lake','urban-lake-landmark-cluster','old-quarter-hoan-kiem',
       'Центральный lake-and-landmark cluster вокруг Hoan Kiem и Ngoc Son temple.'),
      ('han','han-container-hanoi-night-market','hanoi-night-market','Hanoi Night Market','night-market-corridor','old-quarter-hoan-kiem',
       'Вечерний market-corridor Old Quarter как отдельная nightlife destination.'),

      ('dad','dad-container-han-river-waterfront','han-river-waterfront','Han River Waterfront','urban-riverfront-cluster','han-river-hai-chau-core',
       'Riverfront-кластер вдоль Bach Dang и Han River: мосты, rooftop, рестораны и вечерняя жизнь.'),
      ('dad','dad-container-my-khe-beach','my-khe-beach','My Khe Beach','urban-beachfront','my-khe-phuoc-my-coast',
       'Главный городской beachfront как самостоятельная destination-zone.'),
      ('dad','dad-container-son-tra-peninsula','son-tra-peninsula','Son Tra Peninsula','scenic-peninsula-cluster','son-tra-peninsula-east',
       'Полуостровной scenic cluster с viewpoints и coastal roads.'),
      ('dad','dad-container-marble-mountains','marble-mountains','Marble Mountains','heritage-nature-cluster','ngu-hanh-son-non-nuoc',
       'Кластер limestone hills, cave temples и heritage viewpoints.'),
      ('dad','dad-container-ba-na-hills','ba-na-hills','Ba Na Hills','mountain-theme-park-cluster','ba-na-hills-excursion-zone',
       'Mountain leisure cluster с Golden Bridge, канаткой и парком.'),

      ('dla','dla-container-xuan-huong-lake','xuan-huong-lake','Xuan Huong Lake','urban-lakefront-cluster','xuan-huong-market-core',
       'Главный lakefront-cluster в центре Далата для прогулок и вечерней атмосферы.'),
      ('dla','dla-container-dalat-market','dalat-market','Dalat Market','urban-market-cluster','xuan-huong-market-core',
       'Центральный market-cluster Далата: shopping, local food и daily city life.'),
      ('dla','dla-container-dalat-night-market','dalat-night-market','Dalat Night Market','night-market-corridor','xuan-huong-market-core',
       'Вечерний food-and-shopping corridor как отдельная nightlife destination.'),
      ('dla','dla-container-dalat-railway-station','dalat-railway-station','Dalat Railway Station','railway-heritage-cluster','station-trai-mat-east',
       'Исторический railway cluster и ретро-станция с маршрутом в Trại Mát.'),
      ('dla','dla-container-linh-phuoc-pagoda','linh-phuoc-pagoda','Linh Phuoc Pagoda','temple-complex','station-trai-mat-east',
       'Крупный temple-complex Trại Mát как отдельная spiritual destination.'),
      ('dla','dla-container-tuyen-lam-lake','tuyen-lam-lake','Tuyen Lam Lake','lake-monastery-nature-cluster','tuyen-lam-south-excursion-zone',
       'Южный lake-and-pine cluster с monastery-layer и excursion логикой.'),
      ('dla','dla-container-valley-of-love','valley-of-love','Valley of Love','scenic-park-cluster','north-lake-gardens',
       'Крупный scenic-park cluster северного Далата, не одиночная точка.'),

      ('hoi','hoi-container-hoi-an-ancient-town','hoi-an-ancient-town','Hoi An Ancient Town','historic-old-town-cluster','ancient-town-tran-phu-core',
       'UNESCO old-town cluster: shophouses, temples, assembly halls и heritage маршруты.'),
      ('hoi','hoi-container-hoi-an-central-market','hoi-an-central-market','Hoi An Central Market','historic-market-cluster','ancient-town-tran-phu-core',
       'Рыночный cluster у реки между Tran Phu и Bach Dang.'),
      ('hoi','hoi-container-hoi-an-night-market','hoi-an-night-market','Hoi An Night Market','night-market-corridor','an-hoi-riverside-market',
       'Вечерний market-corridor An Hoi с фонарями, едой и riverfront ambience.'),

      ('hue','hue-container-imperial-city-hue','imperial-city-hue','Imperial City Hue','historic-citadel-cluster','imperial-citadel-dong-ba',
       'Главный citadel-cluster Хюэ: ворота, стены, дворцовые пространства и imperial heritage.'),
      ('hue','hue-container-perfume-river-hue','perfume-river-hue','Perfume River Hue','urban-riverfront-cluster','south-bank-truong-tien-core',
       'Центральный riverfront cluster с boat views, мостами и evening city atmosphere.'),
      ('hue','hue-container-hue-night-market','hue-night-market','Hue Night Market','night-market-corridor','south-bank-truong-tien-core',
       'Вечерний market-corridor с street food и tourist-night ambience.'),

      ('ntr','ntr-container-nha-trang-beach-promenade','nha-trang-beach-promenade','Nha Trang Beach Promenade','urban-beachfront','tran-phu-beachfront-core',
       'Главный beachfront-кластер вдоль Trần Phú: promenade, бары, рестораны и resort life.'),
      ('ntr','ntr-container-nha-trang-night-market','nha-trang-night-market','Nha Trang Night Market','night-market-corridor','tran-phu-beachfront-core',
       'Вечерний market/food corridor у beachfront как отдельная nightlife destination.'),
      ('ntr','ntr-container-hon-chong-promontory','hon-chong-promontory','Hon Chong Promontory','scenic-rock-coast-cluster','hon-chong-vinh-phuoc-north-coast',
       'Северный rocky-coast cluster вокруг Hon Chong и coastal viewpoints.'),
      ('ntr','ntr-container-po-nagar-cham-towers','po-nagar-cham-towers','Po Nagar Cham Towers','temple-heritage-cluster','hon-chong-vinh-phuoc-north-coast',
       'Исторический temple/heritage cluster периода Cham на северной стороне реки.'),
      ('ntr','ntr-container-vinwonders-nha-trang','vinwonders-nha-trang','VinWonders Nha Trang','island-theme-park-cluster','hon-mun-vinpearl-excursion-zone',
       'Island leisure cluster Hòn Tre: cable car, theme park, resort и day-trip logic.'),

      ('phu','phu-container-phu-quoc-night-market','phu-quoc-night-market','Phu Quoc Night Market','night-market-food-cluster','duong-dong-dinh-cau-core',
       'Главный evening food-and-shopping cluster в центре Dương Đông.'),
      ('phu','phu-container-long-beach-phu-quoc','long-beach-phu-quoc','Long Beach Phu Quoc','urban-beachfront','long-beach-tran-hung-dao',
       'Длинный west-coast beachfront cluster южнее Dương Đông.'),
      ('phu','phu-container-ong-lang-beach','ong-lang-beach','Ong Lang Beach','coastal-beach-cluster','ong-lang-cua-duong',
       'Спокойный beach cluster северо-западного побережья.'),
      ('phu','phu-container-sao-beach','sao-beach','Sao Beach','scenic-beach-cluster','an-thoi-hon-thom-south',
       'Iconic south-coast beach cluster как отдельная destination-zone.'),

      ('sgn','sgn-container-ben-thanh-market','ben-thanh-market','Ben Thanh Market','historic-market-cluster','ben-thanh-old-market-core',
       'Исторический market-cluster в центре Сайгона.'),
      ('sgn','sgn-container-saigon-notre-dame-post-office','saigon-notre-dame-post-office','Saigon Notre-Dame & Post Office','colonial-landmark-cluster','dong-khoi-civic-core',
       'Связанный colonial-civic cluster вокруг Notre-Dame и Central Post Office.'),
      ('sgn','sgn-container-saigon-river-walk','saigon-river-walk','Saigon River Walk','urban-riverfront-cluster','ben-nghe-nguyen-hue-riverfront',
       'Riverfront cluster вдоль центральной набережной Сайгона.'),
      ('sgn','sgn-container-binh-tay-market','binh-tay-market','Binh Tay Market','chinatown-market-cluster','cho-lon-binh-tay',
       'Крупный Chinatown market-cluster западного Сайгона.')
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
      ('han', 'hanoi', NULL),
      ('dad', 'da-nang', 'danang'),
      ('dla', 'dalat', 'da-lat'),
      ('hoi', 'hoi-an', 'hoian'),
      ('hue', 'hue', NULL),
      ('ntr', 'nha-trang', 'nhatrang'),
      ('phu', 'phu-quoc', 'phuquoc'),
      ('sgn', 'ho-chi-minh-city', 'hochiminhcity')
  ) AS cfg(city_code, city_slug, city_alias)
  JOIN countries co
    ON (co.id = 'vn' OR co.slug IN ('vn', 'vietnam'))
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
    CASE WHEN co.id = 'vn' THEN 0 WHEN co.slug = 'vietnam' THEN 1 ELSE 2 END,
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
      ('han','han-ba-dinh-square-ho-chi-minh-mausoleum','ba-dinh-political-core',NULL),
      ('han','han-banh-mi-25','old-quarter-hoan-kiem',NULL),
      ('han','han-bun-cha-huong-lien','old-quarter-hoan-kiem',NULL),
      ('han','han-ca-phe-giang','old-quarter-hoan-kiem',NULL),
      ('han','han-cho-ong-xuan','old-quarter-hoan-kiem',NULL),
      ('han','han-cong-caphe','old-quarter-hoan-kiem',NULL),
      ('han','han-flag-tower-of-hanoi','ba-dinh-political-core',NULL),
      ('han','han-hidden-gem-cafe','west-lake-truc-bach',NULL),
      ('han','han-hoa-lo-prison','french-quarter-tran-hung-dao',NULL),
      ('han','han-hoan-kiem-lake-ngoc-son-temple','old-quarter-hoan-kiem','hoan-kiem-lake'),
      ('han','han-nha-hang-ngon','french-quarter-tran-hung-dao',NULL),
      ('han','han-night-market','old-quarter-hoan-kiem','hanoi-night-market'),
      ('han','han-old-quarter','old-quarter-hoan-kiem','hanoi-old-quarter'),
      ('han','han-one-pillar-pagoda','ba-dinh-political-core',NULL),
      ('han','han-pho-gia-truyen-bat-an','old-quarter-hoan-kiem',NULL),
      ('han','han-quan-an-ngon','french-quarter-tran-hung-dao',NULL),
      ('han','han-quan-thanh-temple','west-lake-truc-bach',NULL),
      ('han','han-st-joseph-s-cathedral','old-quarter-hoan-kiem',NULL),
      ('han','han-west-lake','west-lake-truc-bach',NULL),

      ('dad','dad-43-factory-coffee-roaster','my-khe-phuoc-my-coast',NULL),
      ('dad','dad-be-man-seafood','my-khe-phuoc-my-coast',NULL),
      ('dad','dad-cham-sculpture-museum','han-river-hai-chau-core',NULL),
      ('dad','dad-con-market','han-river-hai-chau-core',NULL),
      ('dad','dad-cong-ca-phe','han-river-hai-chau-core',NULL),
      ('dad','dad-dragon-bridge','han-river-hai-chau-core',NULL),
      ('dad','dad-golden-bridge','ba-na-hills-excursion-zone','ba-na-hills'),
      ('dad','dad-han-market','han-river-hai-chau-core',NULL),
      ('dad','dad-han-river-bridge','han-river-hai-chau-core',NULL),
      ('dad','dad-la-maison-1888','son-tra-peninsula-east',NULL),
      ('dad','dad-linh-ung-pagoda','son-tra-peninsula-east',NULL),
      ('dad','dad-madame-lan','han-river-hai-chau-core',NULL),
      ('dad','dad-marble-mountains','ngu-hanh-son-non-nuoc','marble-mountains'),
      ('dad','dad-my-khe-beach','my-khe-phuoc-my-coast','my-khe-beach'),
      ('dad','dad-non-nuoc-beach','ngu-hanh-son-non-nuoc',NULL),
      ('dad','dad-sky36','han-river-hai-chau-core',NULL),
      ('dad','dad-son-tra-night-market','my-khe-phuoc-my-coast',NULL),
      ('dad','dad-son-tra-peninsula','son-tra-peninsula-east','son-tra-peninsula'),
      ('dad','dad-sun-world-ba-na-hills','ba-na-hills-excursion-zone','ba-na-hills'),
      ('dad','dad-waterfront-danang','han-river-hai-chau-core','han-river-waterfront'),

      ('dla','dla-an-cafe','xuan-huong-market-core',NULL),
      ('dla','dla-bao-dai-palace-iii','palaces-cathedral-hills',NULL),
      ('dla','dla-cam-ly-waterfall','cam-ly-west-hills',NULL),
      ('dla','dla-crazy-house','palaces-cathedral-hills',NULL),
      ('dla','dla-dalat-cathedral','palaces-cathedral-hills',NULL),
      ('dla','dla-dalat-flower-garden','north-lake-gardens',NULL),
      ('dla','dla-dalat-market','xuan-huong-market-core','dalat-market'),
      ('dla','dla-dalat-night-market','xuan-huong-market-core','dalat-night-market'),
      ('dla','dla-dalat-pine-viewpoints','north-lake-gardens',NULL),
      ('dla','dla-dalat-railway-station','station-trai-mat-east','dalat-railway-station'),
      ('dla','dla-datanla-waterfall','tuyen-lam-south-excursion-zone',NULL),
      ('dla','dla-domaine-de-marie','palaces-cathedral-hills',NULL),
      ('dla','dla-ho-xuan-huong','xuan-huong-market-core','xuan-huong-lake'),
      ('dla','dla-l-angfarm','xuan-huong-market-core',NULL),
      ('dla','dla-la-viet-coffee','station-trai-mat-east',NULL),
      ('dla','dla-lam-dong-museum','station-trai-mat-east',NULL),
      ('dla','dla-lien-hoa-bakery-restaurant','xuan-huong-market-core',NULL),
      ('dla','dla-linh-phuoc-pagoda','station-trai-mat-east','linh-phuoc-pagoda'),
      ('dla','dla-maze-bar','xuan-huong-market-core',NULL),
      ('dla','dla-nem-nuong-ba-hung','xuan-huong-market-core',NULL),
      ('dla','dla-truc-lam-zen-monastery','tuyen-lam-south-excursion-zone',NULL),
      ('dla','dla-tuyen-lam-lake','tuyen-lam-south-excursion-zone','tuyen-lam-lake'),
      ('dla','dla-valley-of-love','north-lake-gardens','valley-of-love'),

      ('hoi','hoi-an-bang-beach','cam-an-an-bang-coast',NULL),
      ('hoi','hoi-assembly-halls-of-hoi-an','ancient-town-tran-phu-core',NULL),
      ('hoi','hoi-ba-le-well','ancient-town-tran-phu-core',NULL),
      ('hoi','hoi-banh-mi-phuong','ancient-town-tran-phu-core',NULL),
      ('hoi','hoi-cham-islands','cham-islands-excursion-zone',NULL),
      ('hoi','hoi-com-ga-ba-buoi','ancient-town-tran-phu-core',NULL),
      ('hoi','hoi-faifo-coffee','ancient-town-tran-phu-core',NULL),
      ('hoi','hoi-hoi-an-ancient-town','ancient-town-tran-phu-core','hoi-an-ancient-town'),
      ('hoi','hoi-hoi-an-central-market','ancient-town-tran-phu-core','hoi-an-central-market'),
      ('hoi','hoi-hoi-an-night-market','an-hoi-riverside-market','hoi-an-night-market'),
      ('hoi','hoi-japanese-covered-bridge','ancient-town-tran-phu-core',NULL),
      ('hoi','hoi-madam-khanh-the-banh-mi-queen','ancient-town-tran-phu-core',NULL),
      ('hoi','hoi-morning-glory-restaurant','ancient-town-tran-phu-core',NULL),
      ('hoi','hoi-mot-hoi-an','ancient-town-tran-phu-core',NULL),
      ('hoi','hoi-old-merchant-houses','ancient-town-tran-phu-core',NULL),
      ('hoi','hoi-reaching-out-tea-house','ancient-town-tran-phu-core',NULL),
      ('hoi','hoi-soul-kitchen','cam-an-an-bang-coast',NULL),
      ('hoi','hoi-thanh-ha-pottery-village','thanh-ha-river-pottery-village',NULL),
      ('hoi','hoi-tra-que-vegetable-village','tra-que-cam-ha-countryside',NULL),
      ('hoi','hoi-yaly-couture','ancient-town-tran-phu-core',NULL),

      ('hue','hue-bach-ma-national-park','bach-ma-excursion-zone',NULL),
      ('hue','hue-brown-eyes-bar','south-bank-truong-tien-core',NULL),
      ('hue','hue-ca-phe-muoi-142','south-bank-truong-tien-core',NULL),
      ('hue','hue-dong-ba-market','imperial-citadel-dong-ba',NULL),
      ('hue','hue-hue-night-market','south-bank-truong-tien-core','hue-night-market'),
      ('hue','hue-imperial-city-hue','imperial-citadel-dong-ba','imperial-city-hue'),
      ('hue','hue-imperial-craft-bia-brewpub','south-bank-truong-tien-core',NULL),
      ('hue','hue-lien-hoa-vegetarian','south-bank-truong-tien-core',NULL),
      ('hue','hue-madam-thu-restaurant','south-bank-truong-tien-core',NULL),
      ('hue','hue-nam-giao-altar','southern-hills-ritual-zone',NULL),
      ('hue','hue-ngu-binh-viewpoint','southern-hills-ritual-zone',NULL),
      ('hue','hue-perfume-river','south-bank-truong-tien-core','perfume-river-hue'),
      ('hue','hue-quan-hanh','south-bank-truong-tien-core',NULL),
      ('hue','hue-tam-giang-lagoon','tam-giang-lagoon-excursion-zone',NULL),
      ('hue','hue-the-lab-coffee','south-bank-truong-tien-core',NULL),
      ('hue','hue-thien-mu-pagoda','kim-long-thien-mu-west-bank',NULL),
      ('hue','hue-truong-tien-bridge','south-bank-truong-tien-core','perfume-river-hue'),
      ('hue','hue-tu-hieu-pagoda','southern-hills-ritual-zone',NULL),
      ('hue','hue-vong-canh-hill','southern-hills-ritual-zone',NULL),

      ('ntr','ntr-alpaca-homestyle-cafe','tran-phu-beachfront-core',NULL),
      ('ntr','ntr-cho-am','old-town-cathedral-cho-dam',NULL),
      ('ntr','ntr-ganesh-indian-restaurant','old-town-cathedral-cho-dam',NULL),
      ('ntr','ntr-hon-chong-rocks','hon-chong-vinh-phuoc-north-coast','hon-chong-promontory'),
      ('ntr','ntr-hon-mun-island','hon-mun-vinpearl-excursion-zone',NULL),
      ('ntr','ntr-i-resort-mud-bath','long-son-west-urban-hills',NULL),
      ('ntr','ntr-kiwami-sushi','old-town-cathedral-cho-dam',NULL),
      ('ntr','ntr-lac-canh-bbq','old-town-cathedral-cho-dam',NULL),
      ('ntr','ntr-long-son-pagoda','long-son-west-urban-hills',NULL),
      ('ntr','ntr-louisiane-brewhouse','tran-phu-beachfront-core',NULL),
      ('ntr','ntr-national-oceanographic-museum-of-vietnam','cau-da-south-port',NULL),
      ('ntr','ntr-nha-trang-beach-promenade','tran-phu-beachfront-core','nha-trang-beach-promenade'),
      ('ntr','ntr-nha-trang-cathedral','old-town-cathedral-cho-dam',NULL),
      ('ntr','ntr-nha-trang-night-market','tran-phu-beachfront-core','nha-trang-night-market'),
      ('ntr','ntr-po-nagar-cham-towers','hon-chong-vinh-phuoc-north-coast','po-nagar-cham-towers'),
      ('ntr','ntr-sailing-club','tran-phu-beachfront-core',NULL),
      ('ntr','ntr-skylight-rooftop-skydeck','tran-phu-beachfront-core',NULL),
      ('ntr','ntr-thap-ba-hot-springs','hon-chong-vinh-phuoc-north-coast',NULL),
      ('ntr','ntr-vinwonders-nha-trang-cable-car','hon-mun-vinpearl-excursion-zone','vinwonders-nha-trang'),

      ('phu','phu-banh-canh-cha-ca-ong-hai','duong-dong-dinh-cau-core',NULL),
      ('phu','phu-dinh-cau-temple','duong-dong-dinh-cau-core',NULL),
      ('phu','phu-fish-sauce-factory','duong-dong-dinh-cau-core',NULL),
      ('phu','phu-ganh-dau-crab-market','ganh-dau-bai-dai-northwest',NULL),
      ('phu','phu-hon-thom-cable-car','an-thoi-hon-thom-south',NULL),
      ('phu','phu-long-beach','long-beach-tran-hung-dao','long-beach-phu-quoc'),
      ('phu','phu-luna-rossa','long-beach-tran-hung-dao',NULL),
      ('phu','phu-oc-343','duong-dong-dinh-cau-core',NULL),
      ('phu','phu-ong-lang-beach','ong-lang-cua-duong','ong-lang-beach'),
      ('phu','phu-phu-quoc-national-park','phu-quoc-national-park-interior',NULL),
      ('phu','phu-phu-quoc-night-market','duong-dong-dinh-cau-core','phu-quoc-night-market'),
      ('phu','phu-phu-quoc-prison','an-thoi-hon-thom-south',NULL),
      ('phu','phu-phuongbinh-restaurant','long-beach-tran-hung-dao',NULL),
      ('phu','phu-rory-s-beach-bar','long-beach-tran-hung-dao',NULL),
      ('phu','phu-sao-beach','an-thoi-hon-thom-south','sao-beach'),
      ('phu','phu-shimmer-restaurant','ong-lang-cua-duong',NULL),
      ('phu','phu-the-pepper-tree','long-beach-tran-hung-dao',NULL),
      ('phu','phu-uong-bang-night-market','duong-dong-dinh-cau-core','phu-quoc-night-market'),
      ('phu','phu-vinpearl-safari-grand-world','ganh-dau-bai-dai-northwest',NULL),

      ('sgn','sgn-banh-mi-huynh-hoa','ben-thanh-old-market-core',NULL),
      ('sgn','sgn-ben-thanh-market','ben-thanh-old-market-core','ben-thanh-market'),
      ('sgn','sgn-binh-tay-market','cho-lon-binh-tay','binh-tay-market'),
      ('sgn','sgn-bitexco-financial-tower-skydeck','ben-nghe-nguyen-hue-riverfront',NULL),
      ('sgn','sgn-bun-thit-nuong-nguyen-trung-truc','ben-thanh-old-market-core',NULL),
      ('sgn','sgn-central-post-office','dong-khoi-civic-core','saigon-notre-dame-post-office'),
      ('sgn','sgn-chill-skybar','ben-nghe-nguyen-hue-riverfront',NULL),
      ('sgn','sgn-com-tam-cali','ben-thanh-old-market-core',NULL),
      ('sgn','sgn-independence-palace','dong-khoi-civic-core',NULL),
      ('sgn','sgn-jade-emperor-pagoda','dakao-pasteur-district-3',NULL),
      ('sgn','sgn-l-usine','dong-khoi-civic-core',NULL),
      ('sgn','sgn-nha-hang-ngon-sai-gon','dakao-pasteur-district-3',NULL),
      ('sgn','sgn-notre-dame-cathedral-basilica-of-saigon','dong-khoi-civic-core','saigon-notre-dame-post-office'),
      ('sgn','sgn-pho-hoa-pasteur','dakao-pasteur-district-3',NULL),
      ('sgn','sgn-quan-an-ngon-sai-gon','dakao-pasteur-district-3',NULL),
      ('sgn','sgn-quan-oc-45','cho-lon-binh-tay',NULL),
      ('sgn','sgn-saigon-river-promenade','ben-nghe-nguyen-hue-riverfront','saigon-river-walk'),
      ('sgn','sgn-tao-dan-park','dakao-pasteur-district-3',NULL),
      ('sgn','sgn-the-workshop-coffee','ben-nghe-nguyen-hue-riverfront',NULL),
      ('sgn','sgn-war-remnants-museum','dakao-pasteur-district-3',NULL)
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
    OR p.country_id IN ('vn', 'vietnam')
    OR p.country_id IS NULL
    OR p.country_id = ''
  )
  AND (
    p.city_id = tc.city_id
    OR p.city_id IN (tc.city_code, tc.city_slug, replace(tc.city_slug, '-', ''), COALESCE(tc.city_alias, ''))
    OR p.city_id IS NULL
    OR p.city_id = ''
  );
