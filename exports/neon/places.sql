-- Places UPSERT (idempotent)
-- Generated from Atlas Content Canon v1 markdown files

-- Place: 🏛️ Intramuros (Manila)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'mnl-intramuros',
  'ph',
  'mnl',
  '🏛️ Intramuros',
  'mnl-intramuros',
  'heritage',
  'showplace',
  'heritage',
  '["heritage","unesco","history","fort"]'::jsonb,
  'Исторический центр Манилы — укреплённый испанский город XVI века с бастионами, церквями и музеями, отражающий колониальное прошлое Филиппин.',
  14.5915,
  120.9736,
  'Intramuros, Manila',
  'https://intramuros.gov.ph',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🌳 Rizal Park (Manila)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'mnl-rizal-park',
  'ph',
  'mnl',
  '🌳 Rizal Park',
  'mnl-rizal-park',
  'park',
  'showplace',
  'park',
  '["park","monument","history"]'::jsonb,
  'Главный национальный парк Филиппин и символ независимости страны, расположенный в центре Манилы.',
  14.5825,
  120.9783,
  'Roxas Blvd, Manila',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🏮 Binondo (Manila)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'mnl-binondo',
  'ph',
  'mnl',
  '🏮 Binondo',
  'mnl-binondo',
  'chinatown',
  'showplace',
  'chinatown',
  '["chinatown","food","heritage"]'::jsonb,
  'Старейший Чайнатаун в мире — торговый и гастрономический центр Манилы с богатой историей.',
  14.6,
  120.974,
  'Binondo, Manila',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🍗 The Aristocrat Restaurant (Manila)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'mnl-the-aristocrat-restaurant',
  'ph',
  'mnl',
  '🍗 The Aristocrat Restaurant',
  'mnl-the-aristocrat-restaurant',
  'restaurant',
  'business',
  'restaurant',
  '["restaurant","filipino","heritage"]'::jsonb,
  'Легендарный семейный ресторан филиппинской кухни, работающий с 1936 года на бульваре Рохас.',
  14.5681,
  120.9839,
  'Roxas Blvd, Manila',
  'https://aristocrat.com.ph',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🍽️ Barbara’s Heritage Restaurant (Manila)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'mnl-barbara-s-heritage-restaurant',
  'ph',
  'mnl',
  '🍽️ Barbara’s Heritage Restaurant',
  'mnl-barbara-s-heritage-restaurant',
  'restaurant',
  'business',
  'restaurant',
  '["restaurant","culture","buffet"]'::jsonb,
  'Ресторан-музей в Интрамуросе с филиппинской кухней и вечерними культурными шоу.',
  14.5893,
  120.9752,
  'Intramuros, Manila',
  'https://barbaras.com.ph',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🏛️ Basilica Minore del Santo Niño & Magellan’s Cross (Cebu)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'ceb-basilica-minore-del-santo-nino-magellan-s-cross',
  'ph',
  'ceb',
  '🏛️ Basilica Minore del Santo Niño & Magellan’s Cross',
  'ceb-basilica-minore-del-santo-nino-magellan-s-cross',
  'heritage',
  'showplace',
  'heritage',
  '["heritage","religion","christianity","history"]'::jsonb,
  '*(Базилика дель Санто-Ниньо и Крест Магеллана)* Духовное сердце Себу и всей страны — старейший христианский комплекс Филиппин, связанный с прибытием Магеллана и началом христианства в регионе.',
  10.2939,
  123.9014,
  'Santo Niño Basilica Complex, Cebu City',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🏰 Fort San Pedro * (Cebu)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'ceb-fort-san-pedro',
  'ph',
  'ceb',
  '🏰 Fort San Pedro *',
  'ceb-fort-san-pedro',
  'fort',
  'showplace',
  'fort',
  '["fort","history","spanish"]'::jsonb,
  'Самый старый испанский форт Филиппин — компактная крепость XVIII века на берегу моря, охранявшая Себу от пиратов и вторжений.',
  10.2922,
  123.9058,
  'Fort San Pedro, Cebu City',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🏯 Cebu Taoist Temple * (Cebu)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'ceb-cebu-taoist-temple',
  'ph',
  'ceb',
  '🏯 Cebu Taoist Temple *',
  'ceb-cebu-taoist-temple',
  'temple',
  'showplace',
  'temple',
  '["temple","taoism","viewpoint"]'::jsonb,
  'Яркий даосский храм на холмах Beverly Hills с панорамными видами на город и море, построенный китайской общиной Себу.',
  10.334,
  123.8877,
  'Beverly Hills Subdivision, Cebu City',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🌿 Kawasan Falls * (Cebu)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'ceb-kawasan-falls',
  'ph',
  'ceb',
  '🌿 Kawasan Falls *',
  'ceb-kawasan-falls',
  'waterfall',
  'showplace',
  'waterfall',
  '["waterfall","nature","adventure"]'::jsonb,
  'Знаменитые бирюзовые водопады юга Себу — одно из лучших природных мест Филиппин для купания и каньонинга.',
  9.802,
  123.374,
  'Badian, Cebu',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🍖 House of Lechon (Cebu)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'ceb-house-of-lechon',
  'ph',
  'ceb',
  '🍖 House of Lechon',
  'ceb-house-of-lechon',
  'food',
  'business',
  'food',
  '["food","lechon","restaurant"]'::jsonb,
  'Лучшее место в Себу, чтобы попробовать знаменитый себуанский лечон — сочного поросёнка с хрустящей корочкой.',
  10.3178,
  123.9017,
  'Cebu City',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🍢 Larsian BBQ (Cebu)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'ceb-larsian-bbq',
  'ph',
  'ceb',
  '🍢 Larsian BBQ',
  'ceb-larsian-bbq',
  'streetfood',
  'business',
  'streetfood',
  '["streetfood","bbq","local"]'::jsonb,
  'Легендарный ночной BBQ-маркет Себу — уличная еда, дым углей и настоящий городской вайб.',
  10.3044,
  123.9001,
  'Fuente Osmeña, Cebu City',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🏞️ Puerto Princesa Subterranean River National Park (Palawan)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'pps-puerto-princesa-subterranean-river-national-park',
  'ph',
  'pps',
  '🏞️ Puerto Princesa Subterranean River National Park',
  'pps-puerto-princesa-subterranean-river-national-park',
  'nature',
  'showplace',
  'nature',
  '["nature","unesco","cave","river"]'::jsonb,
  '*(Подземная река Пуэрто-Принсеса)* Уникальная подземная река длиной более 8 км, протекающая через карстовую пещеру и впадающая прямо в море; объект ЮНЕСКО и одно из «Новых семи чудес природы».',
  10.167,
  118.917,
  'Sabang, Puerto Princesa, Palawan',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🏝️ El Nido & Bacuit Archipelago (Palawan)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'pps-el-nido-bacuit-archipelago',
  'ph',
  'pps',
  '🏝️ El Nido & Bacuit Archipelago',
  'pps-el-nido-bacuit-archipelago',
  'islands',
  'showplace',
  'islands',
  '["islands","lagoon","sea","adventure"]'::jsonb,
  '*(Эль-Нидо и архипелаг Бакуит)* Архипелаг известняковых островов и лагун на севере Палавана — визитная карточка Филиппин с бирюзовыми водами и отвесными скалами.',
  11.18,
  119.39,
  'El Nido, Northern Palawan',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🏞️ Kayangan Lake, Coron (Palawan)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'pps-kayangan-lake-coron',
  'ph',
  'pps',
  '🏞️ Kayangan Lake, Coron',
  'pps-kayangan-lake-coron',
  'lake',
  'showplace',
  'lake',
  '["lake","nature","sacred"]'::jsonb,
  '*(Озеро Кайянган, Корон)* Кристально чистое пресноводное озеро среди известняковых скал, считающееся самым чистым в Азии.',
  11.9541,
  120.2243,
  'Coron Island, Palawan',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🐠 Tubbataha Reefs Natural Park (Palawan)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'pps-tubbataha-reefs-natural-park',
  'ph',
  'pps',
  '🐠 Tubbataha Reefs Natural Park',
  'pps-tubbataha-reefs-natural-park',
  'diving',
  'showplace',
  'diving',
  '["diving","reef","unesco"]'::jsonb,
  'Один из лучших дайвинг-резерватов мира — два удалённых коралловых атолла в море Сулу, объект ЮНЕСКО.',
  8.9533,
  119.8675,
  'Sulu Sea, Palawan',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🍽️ KaLui Restaurant (Palawan)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'pps-kalui-restaurant',
  'ph',
  'pps',
  '🍽️ KaLui Restaurant',
  'pps-kalui-restaurant',
  'restaurant',
  'business',
  'restaurant',
  '["restaurant","local","seafood"]'::jsonb,
  'Самый известный ресторан Пуэрто-Принсесы с художественным интерьером и авторской интерпретацией филиппинской кухни.',
  9.74,
  118.7478,
  'Puerto Princesa',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🍻 Kinabuch’s Grill & Bar (Palawan)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'pps-kinabuch-s-grill-bar',
  'ph',
  'pps',
  '🍻 Kinabuch’s Grill & Bar',
  'pps-kinabuch-s-grill-bar',
  'grill',
  'business',
  'grill',
  '["grill","bar","local"]'::jsonb,
  'Неформальный open-air ресторан с грилем, пивом и экзотическими блюдами — любимое место местных и дайверов.',
  9.7395,
  118.7461,
  'Puerto Princesa',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🏞️ Chocolate Hills (Bohol)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'tag-chocolate-hills',
  'ph',
  'tag',
  '🏞️ Chocolate Hills',
  'tag-chocolate-hills',
  'nature',
  'showplace',
  'nature',
  '["nature","hills","landscape"]'::jsonb,
  'Уникальный карстовый ландшафт из более чем 1200 конусовидных холмов, меняющих цвет от зелёного к шоколадному в сухой сезон — главный природный символ Бохоля.',
  9.917,
  124.167,
  'Carmen, Bohol',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🐒 Philippine Tarsier Sanctuary (Bohol)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'tag-philippine-tarsier-sanctuary',
  'ph',
  'tag',
  '🐒 Philippine Tarsier Sanctuary',
  'tag-philippine-tarsier-sanctuary',
  'wildlife',
  'showplace',
  'wildlife',
  '["wildlife","sanctuary","nature"]'::jsonb,
  'Природный заповедник, посвящённый сохранению филиппинских долгопятов — одних из самых маленьких приматов в мире.',
  9.6908,
  123.9527,
  'Corella, Bohol',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🚤 Loboc River Cruise (Bohol)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'tag-loboc-river-cruise',
  'ph',
  'tag',
  '🚤 Loboc River Cruise',
  'tag-loboc-river-cruise',
  'river',
  'showplace',
  'river',
  '["river","culture","cruise"]'::jsonb,
  'Живописный речной круиз по тропической реке Лобок с обедом и живой фольклорной музыкой на борту.',
  9.6383,
  124.0348,
  'Loboc River, Bohol',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🏖️ Panglao Island – Alona Beach (Bohol)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'tag-panglao-island-alona-beach',
  'ph',
  'tag',
  '🏖️ Panglao Island – Alona Beach',
  'tag-panglao-island-alona-beach',
  'beach',
  'showplace',
  'beach',
  '["beach","diving","resort"]'::jsonb,
  'Главный курортный район Бохоля с белым песком, дайвингом и активной вечерней жизнью.',
  9.5481,
  123.7723,
  'Alona Beach, Panglao Island',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🍯 Bohol Bee Farm (Bohol)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'tag-bohol-bee-farm',
  'ph',
  'tag',
  '🍯 Bohol Bee Farm',
  'tag-bohol-bee-farm',
  'eco',
  'business',
  'eco',
  '["eco","restaurant","farm"]'::jsonb,
  'Эко-ферма и ресторан, продвигающие органическую кухню, локальные продукты и устойчивый туризм.',
  9.61,
  123.828,
  'Dauis, Panglao Island',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🍽️ Gerarda’s Family Restaurant (Bohol)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'tag-gerarda-s-family-restaurant',
  'ph',
  'tag',
  '🍽️ Gerarda’s Family Restaurant',
  'tag-gerarda-s-family-restaurant',
  'local',
  'business',
  'local',
  '["local","restaurant","family"]'::jsonb,
  'Семейный ресторан традиционной кухни Бохоля в историческом доме в Тагбиларане.',
  9.6556,
  123.8558,
  'Tagbilaran City, Bohol',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🏖️ White Beach (Boracay)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'boracay-white-beach',
  'ph',
  'boracay',
  '🏖️ White Beach',
  'boracay-white-beach',
  'beach',
  'showplace',
  'beach',
  '["beach","sea","sunset","resort"]'::jsonb,
  'Главный пляж Боракая — почти 4 километра ослепительно белого песка и бирюзовой воды, считающийся одним из лучших пляжей мира.',
  11.9616,
  121.9242,
  'White Beach, Boracay Island',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🏖️ Puka Shell Beach (Boracay)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'boracay-puka-shell-beach',
  'ph',
  'boracay',
  '🏖️ Puka Shell Beach',
  'boracay-puka-shell-beach',
  'beach',
  'showplace',
  'beach',
  '["beach","nature","quiet"]'::jsonb,
  'Уединённый пляж на севере Боракая, известный ракушечным песком и отсутствием массовой застройки.',
  11.9949,
  121.9124,
  'Yapak, Boracay Island',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: ⛰️ Mount Luho Viewpoint (Boracay)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'boracay-mount-luho-viewpoint',
  'ph',
  'boracay',
  '⛰️ Mount Luho Viewpoint',
  'boracay-mount-luho-viewpoint',
  'viewpoint',
  'showplace',
  'viewpoint',
  '["viewpoint","panorama","nature"]'::jsonb,
  'Самая высокая точка Боракая с панорамным обзором всего острова и окружающих морей.',
  11.9733,
  121.9263,
  'Mount Luho, Boracay',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🤿 Ariel’s Point (Boracay)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'boracay-ariel-s-point',
  'ph',
  'boracay',
  '🤿 Ariel’s Point',
  'boracay-ariel-s-point',
  'adventure',
  'showplace',
  'adventure',
  '["adventure","cliffdiving","sea"]'::jsonb,
  'Экстремальная локация для клифф-дайвинга с оборудованными платформами для прыжков в кристально чистое море.',
  11.865,
  121.8774,
  'Off-shore Boracay',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🥤 Jonah’s Fruit Shake (Boracay)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'boracay-jonah-s-fruit-shake',
  'ph',
  'boracay',
  '🥤 Jonah’s Fruit Shake',
  'boracay-jonah-s-fruit-shake',
  'cafe',
  'business',
  'cafe',
  '["cafe","smoothie","beach"]'::jsonb,
  'Культовое кафе Боракая, прославившееся густыми фруктовыми шейками из свежих тропических фруктов.',
  11.9682,
  121.9187,
  'Station 1, White Beach',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: ☕ Real Coffee & Tea Café (Boracay)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'boracay-real-coffee-tea-cafe',
  'ph',
  'boracay',
  '☕ Real Coffee & Tea Café',
  'boracay-real-coffee-tea-cafe',
  'cafe',
  'business',
  'cafe',
  '["cafe","bakery","breakfast"]'::jsonb,
  'Уютная пекарня-кафе, знаменитая каламанси-маффинами и домашней атмосферой.',
  11.961,
  121.924,
  'Station 2, Boracay',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🌊 Rizal Boulevard (Dumaguete)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dumaguete-rizal-boulevard',
  'ph',
  'dumaguete',
  '🌊 Rizal Boulevard',
  'dumaguete-rizal-boulevard',
  'promenade',
  'showplace',
  'promenade',
  '["promenade","sea","citylife"]'::jsonb,
  'Главная набережная Думагете — спокойная морская аллея с видом на пролив и остров Сикихор, центр городской жизни и общения.',
  9.3072,
  123.3053,
  'Rizal Boulevard, Dumaguete',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🎓 Silliman University (Dumaguete)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dumaguete-silliman-university',
  'ph',
  'dumaguete',
  '🎓 Silliman University',
  'dumaguete-silliman-university',
  'university',
  'showplace',
  'university',
  '["university","heritage","culture"]'::jsonb,
  'Старейший американский университет в Азии с зелёным кампусом и колониальной архитектурой.',
  9.3114,
  123.3075,
  'Silliman Ave, Dumaguete',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🐢 Apo Island (Dumaguete)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dumaguete-apo-island',
  'ph',
  'dumaguete',
  '🐢 Apo Island',
  'dumaguete-apo-island',
  'island',
  'showplace',
  'island',
  '["island","snorkeling","wildlife"]'::jsonb,
  'Морской заповедник мирового уровня, известный сноркелингом с морскими черепахами и дайвингом.',
  9.0797,
  123.2706,
  'Apo Island, Negros Oriental',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 💦 Casaroro Falls (Dumaguete)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dumaguete-casaroro-falls',
  'ph',
  'dumaguete',
  '💦 Casaroro Falls',
  'dumaguete-casaroro-falls',
  'waterfall',
  'showplace',
  'waterfall',
  '["waterfall","nature","trekking"]'::jsonb,
  'Высокий и узкий водопад в тропическом ущелье, популярный маршрут для трекинга.',
  9.2785,
  123.2052,
  'Valencia, Negros Oriental',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🍰 Sans Rival Cakes & Pastries (Dumaguete)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dumaguete-sans-rival-cakes-pastries',
  'ph',
  'dumaguete',
  '🍰 Sans Rival Cakes & Pastries',
  'dumaguete-sans-rival-cakes-pastries',
  'dessert',
  'business',
  'dessert',
  '["dessert","cafe","bakery"]'::jsonb,
  'Легендарная кондитерская Думагете, прославившая город десертами *silvanas* и *Sans Rival*.',
  9.308,
  123.3096,
  'Rizal Blvd, Dumaguete',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🦐 Lab-as Seafood Restaurant (Dumaguete)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dumaguete-lab-as-seafood-restaurant',
  'ph',
  'dumaguete',
  '🦐 Lab-as Seafood Restaurant',
  'dumaguete-lab-as-seafood-restaurant',
  'seafood',
  'business',
  'seafood',
  '["seafood","restaurant","local"]'::jsonb,
  'Популярный ресторан морепродуктов у моря с выбором свежего улова.',
  9.323,
  123.311,
  'Dumaguete North Rd',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();


-- Content Blocks UPSERT (idempotent)
-- Generated from Atlas Content Canon v1 markdown files

-- Content block for: 🏛️ Intramuros
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mnl-intramuros',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Колыбель Манилы и центр испанской колониальной власти  
- 🌍 Ключевой исторический и культурный район страны  
- 📸 Каменные стены, булыжные улицы, старинная архитектура

## Структура комплекса

- 🏛️ Форт Сантьяго — бывшая военная крепость и тюрьма Хосе Рисаля  
- 🏛️ Церковь Сан-Агустин (1607) — объект ЮНЕСКО  
- 🚶 Прогулка по бастионам и площади Plaza de Roma

## Билеты и посещение

- 💰 Большинство зон — бесплатно  
- 🎟️ Отдельные музеи и форт: ₱75–₱150  
- 🆓 Уличные пространства доступны всегда

## Лучшие точки для фото

- 📷 Каменные ворота и стены  
- 📷 Интерьеры Сан-Агустина  
- 🌅 Подсветку бастионов вечером

## Практическая информация

- **Адрес:** Intramuros, Manila  
- **Сайт:** [https://intramuros.gov.ph](https://intramuros.gov.ph)

## Как добраться

- 🚕 Такси / Grab из любого района Манилы  
- 🚌 Джипни и автобусы до района Intramuros  
- 🗺️ Ориентир: Manila Cathedral / Fort Santiago

## Коммуникация & сервис

- 🕒 Доступ круглосуточный (музеи по расписанию)  
- 🌐 Английский и филиппинский  
- 🚻 Туалеты и кафе внутри комплекса  
- 📶 Мобильная связь стабильная

## Полезные нюансы

- ⚠️ Жарко днём — минимум тени  
- 🌞 Лучшее время: утро или закат  
- 👕 Лёгкая одежда, удобная обувь  
- 🐾 Соблюдайте правила в храмах

## Локальная ценность

Интрамурос — символ исторической памяти Манилы. Для местных это место национального самосознания, школьных экскурсий и культурных мероприятий.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌳 Rizal Park
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mnl-rizal-park',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Национальный мемориал Хосе Рисаля  
- 🌍 Политический и культурный символ страны  
- 📸 Просторные аллеи, монументы и фонтаны

## Структура комплекса

- 🏛️ Монумент Хосе Рисаля  
- 🏞️ Японский и Китайский сады  
- 🚶 Вечернее шоу фонтанов

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Музеи рядом — по отдельным билетам  
- 🆓 Парк открыт ежедневно

## Лучшие точки для фото

- 📷 Монумент Рисаля  
- 📷 Аллеи и фонтаны  
- 🌅 Закат над парком

## Практическая информация

- **Адрес:** Roxas Blvd, Manila

## Как добраться

- 🚶 Пешком из Intramuros  
- 🚕 Такси / Grab  
- 🚌 Остановка Rizal Park

## Коммуникация & сервис

- 🕒 5:00–21:00  
- 🌐 Английский  
- 🚻 Туалеты и охрана  
- 📶 Связь стабильная

## Полезные нюансы

- 🌞 Лучше утром или вечером  
- 👕 Защита от солнца обязательна  
- ⚠️ В выходные многолюдно

## Локальная ценность

Парк — место государственных церемоний, прогулок и встреч. Здесь формируется национальная идентичность Филиппин.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏮 Binondo
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mnl-binondo',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Старейший китайский квартал планеты  
- 🌍 Центр торговли и китайско-филиппинской культуры  
- 📸 Колоритные улицы и храмы

## Структура комплекса

- 🏛️ Binondo Church  
- 🏮 Улицы Ongpin и Carvajal  
- 🚶 Гастрономический маршрут по рынкам

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Плата только в музеях и храмах  
- 🆓 Доступ свободный

## Лучшие точки для фото

- 📷 Храмы и арки  
- 📷 Уличную еду  
- 🌅 Ночную подсветку улиц

## Практическая информация

- **Адрес:** Binondo, Manila

## Как добраться

- 🚶 Пешком из Intramuros  
- 🚕 Такси / Grab  
- 🚌 Остановка Binondo

## Коммуникация & сервис

- 🕒 Активен весь день  
- 🌐 Английский, китайский  
- 🚻 Кафе и магазины повсюду  
- 📶 Связь стабильная

## Полезные нюансы

- ⚠️ Очень людно днём  
- 🌞 Лучшее время — утро  
- 👕 Удобная обувь

## Локальная ценность

Binondo — экономическое сердце китайской диаспоры и основа предпринимательской культуры Манилы.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍗 The Aristocrat Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mnl-the-aristocrat-restaurant',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Курица BBQ с фирменным соусом  
- 🍽️ Adobo  
- 🍹 Halo-halo

## Цены

- 💰 ₱300–₱500  
- 🧾 À la carte  
- 🆓 Большие порции

## Как добраться

- 🚕 Grab / такси  
- 🗺️ Roxas Boulevard

## Коммуникация & сервис

- 🕒 24/7  
- 🌐 Английский  
- 📶 Wi-Fi  
- 💳 Наличные, карты

## Полезные нюансы

- ⚠️ Очереди вечером  
- 🌞 Подходит в любое время  
- 👕 Casual

## Локальная ценность

The Aristocrat — часть гастрономической истории Манилы и семейная традиция для нескольких поколений.

## Лучшие точки для фото

- 📷 Интерьер  
- 📷 BBQ курицу  
- 🌅 Ночной зал

## Практическая информация

- **Адрес:** Roxas Blvd, Manila  
- **Сайт:** [https://aristocrat.com.ph](https://aristocrat.com.ph)

## Почему это важно?

- 🌟 Икона национальной кухни  
- 🌍 Историческое место для манильцев  
- 📸 Ретро-интерьер и атмосфера
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍽️ Barbara’s Heritage Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mnl-barbara-s-heritage-restaurant',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Paella Filipino  
- 🍽️ Kinilaw  
- 🍹 Turon

## Цены

- 💰 ₱800–₱1200  
- 🧾 Buffet  
- 🆓 Шоу включено

## Как добраться

- 🚶 Пешком по Intramuros  
- 🚕 Такси

## Коммуникация & сервис

- 🕒 11:00–14:00 / 18:00–21:00  
- 🌐 Английский  
- 📶 Wi-Fi  
- 💳 Наличные, карты

## Полезные нюансы

- ⚠️ Бронировать вечером  
- 🌞 Лучшее время — ужин  
- 👕 Smart casual

## Локальная ценность

Barbara’s сохраняет традиции филиппинской кухни и танца, объединяя гастрономию и культуру.

## Лучшие точки для фото

- 📷 Танцы  
- 📷 Интерьер  
- 🌅 Вечерний зал

## Практическая информация

- **Адрес:** Intramuros, Manila  
- **Сайт:** [https://barbaras.com.ph](https://barbaras.com.ph)

## Почему это важно?

- 🌟 Ужин с культурной программой  
- 🌍 Погружение в колониальную эпоху  
- 📸 Исторический интерьер
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏛️ Basilica Minore del Santo Niño & Magellan’s Cross
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ceb-basilica-minore-del-santo-nino-magellan-s-cross',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Старейшая церковь Филиппин (1565)  
- 🌍 Место начала христианской истории страны  
- 📸 Колониальная архитектура и религиозная атмосфера

## Структура комплекса

- 🏛️ Базилика Santo Niño с реликвариями  
- 🏛️ Крест Магеллана (1521) в восьмиугольной часовне  
- 🚶 Площадь и внутренний двор монастыря

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Пожертвования приветствуются  
- 🆓 Доступ свободный ежедневно

## Лучшие точки для фото

- 📷 Интерьер базилики  
- 📷 Купол часовни Креста  
- 🌅 Утренний свет во дворе

## Практическая информация

- **Адрес:** Santo Niño Basilica Complex, Cebu City

## Как добраться

- 🚕 Такси / Grab из любого района Cebu City  
- 🚌 Джипни до Basilica Complex  
- 🗺️ Ориентир: Colon Street

## Коммуникация & сервис

- 🕒 6:00–19:00  
- 🌐 Английский, себуано  
- 🚻 Туалеты на территории  
- 📶 Связь стабильная

## Полезные нюансы

- ⚠️ Многолюдно по воскресеньям  
- 🌞 Лучше посещать утром  
- 👕 Одежда должна закрывать плечи и колени  
- 🐾 Фотосъёмка без вспышки

## Локальная ценность

Это главное паломническое место страны. Для филиппинцев Santo Niño — не туристический объект, а живая вера и часть национальной идентичности.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏰 Fort San Pedro *
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ceb-fort-san-pedro',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Старейший форт страны  
- 🌍 Испанское военное наследие  
- 📸 Каменные бастионы и вид на порт

## Структура комплекса

- 🏛️ Внутренний двор-музей  
- 🏞️ Бастионы с пушками  
- 🚶 Прогулку по стенам

## Билеты и посещение

- 💰 ₱30  
- 🎟️ Билет на входе  
- 🆓 Детям часто бесплатно

## Лучшие точки для фото

- 📷 Бастионы  
- 📷 Старые пушки  
- 🌅 Вид на море

## Практическая информация

- **Адрес:** Fort San Pedro, Cebu City

## Как добраться

- 🚕 Такси / Grab  
- 🚶 Пешком от порта  
- 🗺️ Ориентир: Plaza Independencia

## Коммуникация & сервис

- 🕒 8:00–19:00  
- 🌐 Английский  
- 🚻 Туалеты  
- 📶 Связь нормальная

## Полезные нюансы

- 🌞 Очень жарко днём  
- 👕 Головной убор обязателен  
- ⚠️ Мало тени

## Локальная ценность

Форт — символ раннего Себу как стратегического центра испанской колонии и морской торговли.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏯 Cebu Taoist Temple *
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ceb-cebu-taoist-temple',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Один из самых красивых храмов города  
- 🌍 Символ китайской диаспоры  
- 📸 Пагоды, драконы, панорамы

## Структура комплекса

- 🏛️ Главный молитвенный зал  
- 🏞️ Смотровые площадки  
- 🚶 81 ступень даосского пути

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Нет билетов  
- 🆓 Открыт для всех

## Лучшие точки для фото

- 📷 Ворота и пагоды  
- 📷 Вид на город  
- 🌅 Закатные панорамы

## Практическая информация

- **Адрес:** Beverly Hills Subdivision, Cebu City

## Как добраться

- 🚕 Такси / Grab (рекомендуется)  
- 🗺️ Район Beverly Hills

## Коммуникация & сервис

- 🕒 6:00–17:00  
- 🌐 Английский  
- 🚻 Минимальные удобства  
- 📶 Связь ограниченная

## Полезные нюансы

- ⚠️ Нельзя шуметь  
- 📷 Запрещена съёмка алтарей  
- 🌞 Лучшее время — утро

## Локальная ценность

Храм — важный духовный центр китайской общины и пример мирного сосуществования культур Себу.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌿 Kawasan Falls *
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ceb-kawasan-falls',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Один из самых красивых водопадов страны  
- 🌍 Символ природного Себу  
- 📸 Ярко-бирюзовая вода

## Структура комплекса

- 🏞️ Первый каскад  
- 🏞️ Верхние уровни  
- 🚶 Тропу через джунгли

## Билеты и посещение

- 💰 ₱50  
- 🎟️ Оплата на входе  
- 🆓 Купание включено

## Лучшие точки для фото

- 📷 Первый каскад  
- 📷 Купающихся  
- 🌅 Свет в воде

## Практическая информация

- **Адрес:** Badian, Cebu

## Как добраться

- 🚕 Экскурсия / авто  
- 🚌 Автобус до Badian + пешком  
- 🗺️ Южный Себу

## Коммуникация & сервис

- 🕒 7:00–17:00  
- 🌐 Английский  
- 🚻 Раздевалки  
- 📶 Связь слабая

## Полезные нюансы

- ⚠️ Скользко  
- 👕 Акваобувь обязательна  
- 🌞 Лучше утром

## Локальная ценность

Кавасан — ключевой драйвер экотуризма южного Себу и источник дохода для местных общин.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍖 House of Lechon
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ceb-house-of-lechon',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Lechon Cebu  
- 🍽️ Dinuguan  
- 🍹 Каламанси-сок

## Цены

- 💰 ₱350–₱600  
- 🧾 À la carte  
- 🆓 Соусы бесплатно

## Как добраться

- 🚕 Grab / такси  
- 🗺️ Cebu City

## Коммуникация & сервис

- 🕒 10:00–22:00  
- 🌐 Английский  
- 📶 Wi-Fi  
- 💳 Cash / card

## Полезные нюансы

- ⚠️ Лучше приходить днём  
- 👕 Casual  
- 🍽️ Порции большие

## Локальная ценность

Лечон — гастрономическая гордость Себу, обязательный элемент праздников и семейных торжеств.

## Лучшие точки для фото

- 📷 Поросёнка  
- 📷 Разделку  
- 🌅 Интерьер

## Практическая информация

- **Адрес:** Cebu City  
- **Instagram:** [@houseoflechon](https://www.instagram.com/houseoflechon)

## Почему это важно?

- 🌟 Самый известный лечон в городе  
- 🌍 Гастрономический символ Себу  
- 📸 Эффектная подача
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍢 Larsian BBQ
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ceb-larsian-bbq',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Pork BBQ  
- 🍽️ Isaw  
- 🍚 Puso (рис)

## Цены

- 💰 ₱150–₱250  
- 🧾 Street food  
- 🆓 Соусы

## Как добраться

- 🚕 Такси  
- 🗺️ Fuente Osmeña

## Коммуникация & сервис

- 🕒 17:00–02:00  
- 🌐 Английский  
- 📶 Нет Wi-Fi  
- 💳 Только наличные

## Полезные нюансы

- ⚠️ Шумно  
- 👕 Запах дыма  
- 🌙 Лучше вечером

## Локальная ценность

Larsian — место общения, еды и городской культуры, где встречаются все слои общества Себу.

## Лучшие точки для фото

- 📷 Грили  
- 📷 Шашлыки  
- 🌅 Ночную толпу

## Практическая информация

- **Адрес:** Fuente Osmeña, Cebu City

## Почему это важно?

- 🌟 Культовое ночное место  
- 🌍 Настоящая уличная кухня  
- 📸 Атмосфера ночного Себу
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏞️ Puerto Princesa Subterranean River National Park
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pps-puerto-princesa-subterranean-river-national-park',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Одна из самых впечатляющих пещерных рек в мире  
- 🌍 Объект Всемирного наследия ЮНЕСКО  
- 📸 Гигантские сталактиты и подземные залы

## Структура комплекса

- 🏞️ Пещерные галереи с подсветкой  
- 🏞️ Колонии летучих мышей  
- 🚶 Лодочный маршрут внутри пещеры (~1,5 км)

## Билеты и посещение

- 💰 ~₱1500–₱2000 (тур)  
- 🎟️ Посещение только с лицензированным гидом  
- 🆓 Самостоятельный вход запрещён

## Лучшие точки для фото

- 📷 Пещерные своды  
- 📷 Лодку в полумраке  
- 🌅 Побережье у входа

## Практическая информация

- **Адрес:** Sabang, Puerto Princesa, Palawan

## Как добраться

- 🚕 Трансфер из Пуэрто-Принсесы (~2 часа)  
- 🚤 Короткий морской переход к входу  
- 🗺️ Запад Палавана

## Коммуникация & сервис

- 🕒 По слотам, дневной лимит  
- 🌐 Английский  
- 🚻 Туалеты и визит-центр  
- 📶 Связь ограниченная

## Полезные нюансы

- ⚠️ Требуется предварительное бронирование  
- 🌞 Лучше посещать в сухой сезон  
- 👕 Удобная обувь, защита от воды  
- 🐾 Кормить животных запрещено

## Локальная ценность

Подземная река — главный природный символ Палавана и основа устойчивого экотуризма региона.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏝️ El Nido & Bacuit Archipelago
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pps-el-nido-bacuit-archipelago',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Один из самых фотогеничных регионов Азии  
- 🌍 Эталон островного туризма  
- 📸 Лагуны, скалы, пляжи без застройки

## Структура комплекса

- 🏞️ Big Lagoon  
- 🏞️ Small Lagoon  
- 🚶 Island hopping (туры A и C)

## Билеты и посещение

- 💰 ₱1200–₱1800 за тур  
- 🎟️ Экосбор оплачивается отдельно  
- 🆓 Пляжи вне туров бесплатны

## Лучшие точки для фото

- 📷 Вид сверху на лагуны  
- 📷 Каяки у скал  
- 🌅 Свет в полдень

## Практическая информация

- **Адрес:** El Nido, Northern Palawan

## Как добраться

- ✈️ Самолёт в El Nido или Пуэрто-Принсесу  
- 🚕 Трансфер по суше  
- 🚤 Лодочные туры из El Nido

## Коммуникация & сервис

- 🕒 Туристический режим с утра  
- 🌐 Английский  
- 🚻 Кафе и сервисы в El Nido  
- 📶 Связь нестабильная на островах

## Полезные нюансы

- ⚠️ Лодки брызгают — защита для техники  
- 🌞 Лучшее время — март–май  
- 👕 Купальная обувь  
- 🐾 Экосбор обязателен

## Локальная ценность

Эль-Нидо — ключевой туристический бренд Палавана и источник дохода для сотен островных сообществ.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏞️ Kayangan Lake, Coron
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pps-kayangan-lake-coron',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Уникальная прозрачность воды  
- 🌍 Священное место народа тагбануа  
- 📸 Классический вид Палавана

## Структура комплекса

- 🏞️ Смотровую площадку  
- 🏞️ Само озеро  
- 🚶 Подъём по ступеням

## Билеты и посещение

- 💰 ~₱200  
- 🎟️ В составе лодочного тура  
- 🆓 Купание разрешено

## Лучшие точки для фото

- 📷 Панораму сверху  
- 📷 Купающихся в озере  
- 🌅 Свет над водой

## Практическая информация

- **Адрес:** Coron Island, Palawan

## Как добраться

- 🚤 Лодка из города Корон  
- 🗺️ Остров Корон

## Коммуникация & сервис

- 🕒 Дневные туры  
- 🌐 Английский  
- 🚻 Минимальные удобства  
- 📶 Связь отсутствует

## Полезные нюансы

- ⚠️ 300+ ступеней подъёма  
- 🌞 Лучше утром  
- 👕 Акваобувь  
- 🐾 Запрет на мусор

## Локальная ценность

Озеро охраняется местными общинами и является примером баланса туризма и традиций.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🐠 Tubbataha Reefs Natural Park
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pps-tubbataha-reefs-natural-park',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Топ-5 дайв-сайтов планеты  
- 🌍 Эталон морской экосистемы  
- 📸 Подводные стены и акулы

## Структура комплекса

- 🏞️ Коралловые стены  
- 🏞️ Стаи акул и мант  
- 🚶 Ночные погружения

## Билеты и посещение

- 💰 Только liveaboard ($3000+)  
- 🎟️ Лицензированный дайвинг  
- 🆓 Недоступно для обычных туристов

## Лучшие точки для фото

- 📷 Подводные стены  
- 📷 Акул  
- 🌅 Рассветы в океане

## Практическая информация

- **Адрес:** Sulu Sea, Palawan

## Как добраться

- 🚢 Дайв-сафари из Пуэрто-Принсесы  
- 🗺️ Центр моря Сулу

## Коммуникация & сервис

- 🕒 Сезон: март–июнь  
- 🌐 Английский  
- 🚻 Только на борту  
- 📶 Нет связи

## Полезные нюансы

- ⚠️ Для опытных дайверов  
- 👕 Полный комплект снаряжения  
- 🐾 Строгие экоправила

## Локальная ценность

Туббатаха — национальное достояние Филиппин и пример глобального морского заповедника.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍽️ KaLui Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pps-kalui-restaurant',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Морепродукты дня  
- 🍽️ Суп sinigang  
- 🍹 Фруктовый десерт в кокосе

## Цены

- 💰 ₱600–₱800  
- 🧾 Set menu  
- 🆓 Комплименты от шефа

## Как добраться

- 🚕 Такси  
- 🗺️ Puerto Princesa City

## Коммуникация & сервис

- 🕒 11:00–14:00 / 18:00–22:30  
- 🌐 Английский  
- 📶 Нет Wi-Fi  
- 💳 Cash only

## Полезные нюансы

- ⚠️ Нужна бронь  
- 🌞 Лучше ужин  
- 👕 Casual (босиком внутри)

## Локальная ценность

KaLui поддерживает местных рыбаков и художников, формируя гастро-идентичность Палавана.

## Лучшие точки для фото

- 📷 Интерьер  
- 📷 Подачу блюд  
- 🌅 Вечерний зал

## Практическая информация

- **Адрес:** Puerto Princesa  
- **Соцсети:** [KaLui Restaurant](https://www.instagram.com/kaluirestaurant/)

## Почему это важно?

- 🌟 Культовое гастроместо Палавана  
- 🌍 Локальная кухня из свежего улова  
- 📸 Атмосферный интерьер
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍻 Kinabuch’s Grill & Bar
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pps-kinabuch-s-grill-bar',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Crocodile Sisig  
- 🍽️ Tamilok  
- 🍹 Местное пиво

## Цены

- 💰 ₱300–₱500  
- 🧾 À la carte  
- 🆓 Бильярд

## Как добраться

- 🚕 Такси  
- 🗺️ Центр Пуэрто-Принсесы

## Коммуникация & сервис

- 🕒 16:00–23:00  
- 🌐 Английский  
- 📶 Нет Wi-Fi  
- 💳 Cash

## Полезные нюансы

- ⚠️ Шумно  
- 🌞 Лучше вечером  
- 👕 Casual

## Локальная ценность

Kinabuch’s — часть современной городской культуры Палавана, где встречаются туристы и местные.

## Лучшие точки для фото

- 📷 Гриль  
- 📷 Экзотические блюда  
- 🌅 Вечернюю толпу

## Практическая информация

- **Адрес:** Puerto Princesa

## Почему это важно?

- 🌟 Самая живая атмосфера города  
- 🌍 Место общения и экспериментов  
- 📸 Уличный вайб
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏞️ Chocolate Hills
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'tag-chocolate-hills',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Один из самых узнаваемых пейзажей Филиппин  
- 🌍 Геологический объект национального значения  
- 📸 Панорамные виды «как на открытках»

## Структура комплекса

- 🏞️ Главную смотровую площадку в Кармене  
- 🏞️ Холмы в сухой сезон (февраль–май)  
- 🚶 Подъём по ступеням к панораме

## Билеты и посещение

- 💰 ~₱100  
- 🎟️ Билет на входе  
- 🆓 Прилегающие зоны без ограничений

## Лучшие точки для фото

- 📷 Панораму холмов  
- 📷 Вид с высоты  
- 🌅 Закатный свет

## Практическая информация

- **Адрес:** Carmen, Bohol

## Как добраться

- 🚕 Такси / аренда авто  
- 🚌 Экскурсионный автобус  
- 🗺️ Район Carmen, центральный Бохоль

## Коммуникация & сервис

- 🕒 8:00–17:00  
- 🌐 Английский  
- 🚻 Туалеты, лавки  
- 📶 Связь стабильная

## Полезные нюансы

- 🌞 Лучшее время — утро или закат  
- 👕 Головной убор обязателен  
- ⚠️ Жарко днём

## Локальная ценность

Шоколадные холмы — главный туристический бренд Бохоля и источник дохода для сельских районов острова.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🐒 Philippine Tarsier Sanctuary
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'tag-philippine-tarsier-sanctuary',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Уникальные эндемики Филиппин  
- 🌍 Проект по сохранению биоразнообразия  
- 📸 Редкий шанс увидеть долгопятов в природе

## Структура комплекса

- 🏞️ Лесную тропу  
- 🏞️ Долгопятов в естественной среде  
- 🚶 Информационный центр

## Билеты и посещение

- 💰 ~₱100  
- 🎟️ Билет на входе  
- 🆓 Дети часто бесплатно

## Лучшие точки для фото

- 📷 Лесную тропу  
- 📷 Долгопята (без вспышки)  
- 🌅 Мягкий свет под кронами

## Практическая информация

- **Адрес:** Corella, Bohol

## Как добраться

- 🚕 Такси / экскурсия  
- 🗺️ Corella, Bohol

## Коммуникация & сервис

- 🕒 9:00–16:00  
- 🌐 Английский  
- 🚻 Туалеты  
- 📶 Связь слабая

## Полезные нюансы

- ⚠️ Запрещены вспышка и шум  
- 👕 Удобная обувь  
- 🐾 Трогать животных нельзя

## Локальная ценность

Заповедник — пример экологически ответственного туризма и гордость острова.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🚤 Loboc River Cruise
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'tag-loboc-river-cruise',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самый расслабляющий опыт Бохоля  
- 🌍 Знакомство с сельской культурой  
- 📸 Изумрудная река и пальмы

## Структура комплекса

- 🏞️ Речные пейзажи  
- 🏞️ Фольклорное выступление  
- 🚶 Остановку у деревенской сцены

## Билеты и посещение

- 💰 ~₱550  
- 🎟️ Билет включает обед  
- 🆓 Дети — со скидкой

## Лучшие точки для фото

- 📷 Реку с борта  
- 📷 Музыкантов  
- 🌅 Отражения пальм

## Практическая информация

- **Адрес:** Loboc River, Bohol

## Как добраться

- 🚕 Такси  
- 🗺️ Город Loboc

## Коммуникация & сервис

- 🕒 10:00–15:00  
- 🌐 Английский  
- 🚻 На борту  
- 📶 Связь ограниченная

## Полезные нюансы

- 🌞 Лучше дневные рейсы  
- 👕 Лёгкая одежда  
- ⚠️ Наличные для чаевых

## Локальная ценность

Круиз поддерживает местные общины и сохраняет традиционную музыку и танцы.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏖️ Panglao Island – Alona Beach
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'tag-panglao-island-alona-beach',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучший пляжный отдых на Бохоле  
- 🌍 Центр дайвинга и сноркелинга  
- 📸 Бирюзовая вода и закаты

## Структура комплекса

- 🏞️ Пляж Алона  
- 🏞️ Лодочные туры к Balicasag  
- 🚶 Вечернюю набережную

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Туры оплачиваются отдельно  
- 🆓 Общественный пляж

## Лучшие точки для фото

- 📷 Пляж  
- 📷 Лодки  
- 🌅 Закат

## Практическая информация

- **Адрес:** Alona Beach, Panglao Island

## Как добраться

- 🚕 Такси / трансфер  
- 🗺️ Остров Panglao

## Коммуникация & сервис

- 🕒 Круглосуточно  
- 🌐 Английский  
- 🚻 Кафе и сервисы  
- 📶 Отличная связь

## Полезные нюансы

- ⚠️ Цены выше среднего  
- 🌞 Лучшее купание утром  
- 👕 Beach casual

## Локальная ценность

Панглао — туристическое сердце Бохоля и ключевая точка международного турпотока.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍯 Bohol Bee Farm
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'tag-bohol-bee-farm',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Garden Salad  
- 🍽️ Домашний хлеб  
- 🍹 Мёд и мороженое из моринги

## Цены

- 💰 ₱400–₱700  
- 🧾 À la carte  
- 🆓 Дегустации в магазине

## Как добраться

- 🚕 Такси  
- 🗺️ Panglao Island

## Коммуникация & сервис

- 🕒 7:30–21:00  
- 🌐 Английский  
- 📶 Wi-Fi  
- 💳 Cash / card

## Полезные нюансы

- ⚠️ Популярно — бронируйте  
- 🌞 Лучшее время — днём  
- 👕 Casual

## Локальная ценность

Bohol Bee Farm поддерживает местных фермеров и формирует экологичную гастрокультуру острова.

## Лучшие точки для фото

- 📷 Сады  
- 📷 Подачу блюд  
- 🌅 Террасу у моря

## Практическая информация

- **Адрес:** Dauis, Panglao Island

## Почему это важно?

- 🌟 Икона эко-гастрономии  
- 🌍 Локальные продукты и мёд  
- 📸 Вид на море и сады
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍽️ Gerarda’s Family Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'tag-gerarda-s-family-restaurant',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Pochero  
- 🍽️ Adobong Kangkong  
- 🍹 Кокосовые десерты

## Цены

- 💰 ₱300–₱600  
- 🧾 À la carte  
- 🆓 Большие порции

## Как добраться

- 🚕 Такси  
- 🗺️ Tagbilaran City

## Коммуникация & сервис

- 🕒 10:00–21:00  
- 🌐 Английский  
- 📶 Wi-Fi  
- 💳 Cash

## Полезные нюансы

- ⚠️ Популярен вечером  
- 🌞 Лучше к ужину  
- 👕 Casual

## Локальная ценность

Gerarda’s — хранитель семейных гастрономических традиций Бохоля.

## Лучшие точки для фото

- 📷 Интерьер  
- 📷 Блюда  
- 🌅 Вечерний зал

## Практическая информация

- **Адрес:** Tagbilaran City, Bohol

## Почему это важно?

- 🌟 Аутентичная локальная кухня  
- 🌍 Семейные рецепты  
- 📸 Домашняя атмосфера
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏖️ White Beach
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'boracay-white-beach',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Один из самых известных пляжей планеты  
- 🌍 Туристическое и социальное сердце острова  
- 📸 Идеальные закаты и открытки «тропический рай»

## Структура комплекса

- 🏖️ Station 1 — самый просторный и спокойный участок  
- 🏖️ Station 2 — центр жизни, магазины и рестораны  
- 🚶 Вечерняя прогулка вдоль всего пляжа

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Нет билетов  
- 🆓 Доступ открыт круглосуточно

## Лучшие точки для фото

- 📷 Белый песок крупным планом  
- 📷 Парусные лодки paraw  
- 🌅 Закаты над морем

## Практическая информация

- **Адрес:** White Beach, Boracay Island

## Как добраться

- 🚶 Пешком из любого района острова  
- 🚕 Трицикл из любой точки Боракая  
- 🗺️ Западное побережье острова

## Коммуникация & сервис

- 🕒 Круглосуточно  
- 🌐 Английский  
- 🚻 Души, туалеты, кафе  
- 📶 Отличная мобильная связь

## Полезные нюансы

- ⚠️ Многолюдно в высокий сезон  
- 🌞 Лучшее купание — утром  
- 👕 Купальник + защита от солнца  
- 🐾 Вечером возможны фаер-шоу

## Локальная ценность

White Beach — экономическая основа Боракая: именно он обеспечивает рабочие места, туристический поток и международную известность острова.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏖️ Puka Shell Beach
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'boracay-puka-shell-beach',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Более дикий и спокойный Боракай  
- 🌍 Контраст с туристическим White Beach  
- 📸 Натуральные пейзажи и ракушки

## Структура комплекса

- 🏖️ Берег с ракушками пука  
- 🏞️ Тропическую рощу  
- 🚶 Прогулку вдоль пляжа

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Нет билетов  
- 🆓 Доступ свободный

## Лучшие точки для фото

- 📷 Берег с ракушками  
- 📷 Волны и горизонт  
- 🌅 Утренний свет

## Практическая информация

- **Адрес:** Yapak, Boracay Island

## Как добраться

- 🚕 Трицикл (~15 мин от Station 2)  
- 🗺️ Север острова

## Коммуникация & сервис

- 🕒 Круглосуточно  
- 🌐 Английский  
- 🚻 Минимальная инфраструктура  
- 📶 Связь стабильная

## Полезные нюансы

- 🌞 Мало тени  
- 👕 Возьмите воду и головной убор  
- ⚠️ Волны сильнее, чем на White Beach

## Локальная ценность

Puka Beach — напоминание о «старом Боракае» до массового туризма и символ природного баланса острова.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ⛰️ Mount Luho Viewpoint
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'boracay-mount-luho-viewpoint',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучший обзор острова  
- 🌍 Географическая доминанта Боракая  
- 📸 Панорамные фотографии

## Структура комплекса

- 🏞️ Панораму White Beach  
- 🏞️ Вид на Bulabog Beach  
- 🚶 Прогулку по вершине

## Билеты и посещение

- 💰 ₱120–₱150  
- 🎟️ Билет на входе  
- 🆓 Детям часто бесплатно

## Лучшие точки для фото

- 📷 Панораму острова  
- 📷 Лагуны и пляжи  
- 🌅 Закатный свет

## Практическая информация

- **Адрес:** Mount Luho, Boracay

## Как добраться

- 🚕 Трицикл или байк  
- 🚶 Последний участок пешком  
- 🗺️ Центр острова

## Коммуникация & сервис

- 🕒 6:00–18:00  
- 🌐 Английский  
- 🚻 Минимальные удобства  
- 📶 Связь хорошая

## Полезные нюансы

- 🌞 Лучше утром или на закате  
- 👕 Лёгкая одежда  
- ⚠️ Жарко днём

## Локальная ценность

Mount Luho — ориентир и символ острова, позволяющий понять его компактность и географию.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🤿 Ariel’s Point
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'boracay-ariel-s-point',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Легендарный клифф-дайвинг  
- 🌍 Одно из самых адреналиновых мест Боракая  
- 📸 Прыжки над лазурной водой

## Структура комплекса

- 🏞️ Прыжковые платформы (3–15 м)  
- 🏞️ Скалы и лагуны  
- 🚶 Купание и сноркелинг

## Билеты и посещение

- 💰 ~₱2500  
- 🎟️ Только в составе тура  
- 🆓 Включены еда и напитки

## Лучшие точки для фото

- 📷 Прыжки со скал  
- 📷 Вид сверху  
- 🌅 Море и лодки

## Практическая информация

- **Адрес:** Off-shore Boracay

## Как добраться

- 🚤 Тур на лодке (~1 час)  
- 🗺️ Отправление с White Beach

## Коммуникация & сервис

- 🕒 Дневные туры  
- 🌐 Английский  
- 🚻 На лодке  
- 📶 Связь отсутствует

## Полезные нюансы

- ⚠️ Не для людей с боязнью высоты  
- 👕 Купальная обувь  
- 🌞 Лучше в хорошую погоду

## Локальная ценность

Ariel’s Point — визитная карточка приключенческого туризма Боракая и важный элемент его диверсификации.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🥤 Jonah’s Fruit Shake
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'boracay-jonah-s-fruit-shake',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Mango Shake  
- 🍽️ Banana Peanut Shake  
- 🍹 Exotic Mix

## Цены

- 💰 ~₱150–₱200  
- 🧾 Напитки / лёгкие завтраки  
- 🆓 Большие порции

## Как добраться

- 🚶 Пешком по White Beach  
- 🗺️ Station 1

## Коммуникация & сервис

- 🕒 8:00–23:00  
- 🌐 Английский  
- 📶 Wi-Fi  
- 💳 Cash / card

## Полезные нюансы

- ⚠️ Очереди днём  
- 🌞 Лучшее время — утро  
- 👕 Beach casual

## Локальная ценность

Jonah’s — один из старейших брендов Боракая и обязательная гастрономическая точка для гостей острова.

## Лучшие точки для фото

- 📷 Шейк крупным планом  
- 📷 Пляж на фоне  
- 🌅 Утренний свет

## Практическая информация

- **Адрес:** Station 1, White Beach  
- **Instagram / Facebook:** [Jonah’s Fruit Shake](https://www.instagram.com/jonahsfruitshake/)

## Почему это важно?

- 🌟 Самые известные шейки острова  
- 🌍 Гастрономический символ пляжа  
- 📸 Яркая подача
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ☕ Real Coffee & Tea Café
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'boracay-real-coffee-tea-cafe',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Calamansi Muffin  
- 🍽️ Манговый тост  
- 🍹 Имбирный чай

## Цены

- 💰 ₱200–₱350  
- 🧾 Завтраки и выпечка  
- 🆓 Нет

## Как добраться

- 🚶 Пешком  
- 🗺️ Station 2

## Коммуникация & сервис

- 🕒 7:00–19:00  
- 🌐 Английский  
- 📶 Wi-Fi  
- 💳 Cash

## Полезные нюансы

- ⚠️ Маффины быстро заканчиваются  
- 🌞 Лучше приходить утром  
- 👕 Casual

## Локальная ценность

Real Coffee — культовое место завтраков, связанное с историей туризма Боракая с 1990-х годов.

## Лучшие точки для фото

- 📷 Маффины  
- 📷 Интерьер  
- 🌅 Утренний пляж

## Практическая информация

- **Адрес:** Station 2, Boracay

## Почему это важно?

- 🌟 Легендарная выпечка  
- 🌍 Утренний ритуал Боракая  
- 📸 Терраса с видом на пляж
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌊 Rizal Boulevard
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dumaguete-rizal-boulevard',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самое атмосферное место города  
- 🌍 Социальное и культурное сердце Думагете  
- 📸 Море, закаты и уличная жизнь

## Структура комплекса

- 🏞️ Прогулку вдоль берега  
- 🏞️ Вечерние фуд-корты *painitan*  
- 🚶 Закат над проливом

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Без билетов  
- 🆓 Доступ круглосуточный

## Лучшие точки для фото

- 📷 Аллею с морем  
- 📷 Уличную еду  
- 🌅 Закат

## Практическая информация

- **Адрес:** Rizal Boulevard, Dumaguete

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Такси  
- 🗺️ Центр города Dumaguete

## Коммуникация & сервис

- 🕒 24/7  
- 🌐 Английский  
- 🚻 Общественные туалеты поблизости  
- 📶 Отличная мобильная связь

## Полезные нюансы

- 🌞 Утром — спорт и прогулки  
- 🌙 Вечером — еда и общение  
- 👕 Casual

## Локальная ценность

Rizal Boulevard — «гостиная» города, место встреч студентов, семей и путешественников.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🎓 Silliman University
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dumaguete-silliman-university',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Исторический университет (1901)  
- 🌍 Интеллектуальный центр региона  
- 📸 Колониальные здания и парки

## Структура комплекса

- 🏛️ Silliman Hall  
- 🏛️ Антропологический музей  
- 🚶 Прогулку по кампусу

## Билеты и посещение

- 💰 ~₱50 (музей)  
- 🎟️ Вход свободный  
- 🆓 Кампус открыт

## Лучшие точки для фото

- 📷 Silliman Hall  
- 📷 Газоны кампуса  
- 🌅 Свет сквозь деревья

## Практическая информация

- **Адрес:** Silliman Ave, Dumaguete

## Как добраться

- 🚶 Пешком от набережной  
- 🚕 Такси  
- 🗺️ Центральный Dumaguete

## Коммуникация & сервис

- 🕒 Днём  
- 🌐 Английский  
- 🚻 Туалеты  
- 📶 Wi-Fi в отдельных зонах

## Полезные нюансы

- ⚠️ Фото в музее запрещены  
- 🌞 Лучше в будни  
- 👕 Casual

## Локальная ценность

Университет формирует культурную и академическую идентичность Думагете.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🐢 Apo Island
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dumaguete-apo-island',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучшее место для сноркелинга с черепахами  
- 🌍 Старейший морской заповедник региона  
- 📸 Подводная жизнь и прозрачная вода

## Структура комплекса

- 🏞️ Turtle Beach  
- 🏞️ Коралловые рифы  
- 🚶 Деревню острова

## Билеты и посещение

- 💰 ~₱300–₱500 (тур)  
- 🎟️ Экосбор включён  
- 🆓 Купание разрешено

## Лучшие точки для фото

- 📷 Черепах под водой  
- 📷 Рифы  
- 🌅 Берег острова

## Практическая информация

- **Адрес:** Apo Island, Negros Oriental

## Как добраться

- 🚕 До Malatapay Port  
- 🚤 Лодка (~30 мин)  
- 🗺️ Юг от Dumaguete

## Коммуникация & сервис

- 🕒 Дневные туры  
- 🌐 Английский  
- 🚻 Минимальные удобства  
- 📶 Связь отсутствует

## Полезные нюансы

- ⚠️ Черепах нельзя трогать  
- 👕 Акваобувь  
- 🐾 Строгие экоправила

## Локальная ценность

Apo Island — пример успешного экотуризма, управляемого местным сообществом.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 💦 Casaroro Falls
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dumaguete-casaroro-falls',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Один из самых красивых водопадов региона  
- 🌍 Нетронутая природа  
- 📸 Драматический ландшафт

## Структура комплекса

- 🏞️ Основной каскад  
- 🏞️ Горную тропу  
- 🚶 Каменные переправы

## Билеты и посещение

- 💰 ~₱100  
- 🎟️ Билет на входе  
- 🆓 Купание разрешено

## Лучшие точки для фото

- 📷 Водопад  
- 📷 Ущелье  
- 🌅 Свет сквозь листву

## Практическая информация

- **Адрес:** Valencia, Negros Oriental

## Как добраться

- 🚕 Такси / мотобайк  
- 🗺️ Valencia, Negros Oriental

## Коммуникация & сервис

- 🕒 Днём  
- 🌐 Английский  
- 🚻 Минимальные удобства  
- 📶 Связь слабая

## Полезные нюансы

- ⚠️ Скользко после дождя  
- 👕 Трекинговая обувь  
- 🌞 Лучше утром

## Локальная ценность

Касароро — символ горной природы Негроса и любимое место местных.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍰 Sans Rival Cakes & Pastries
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dumaguete-sans-rival-cakes-pastries',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Silvanas  
- 🍽️ Sans Rival cake  
- 🍹 Кофе или горячий шоколад

## Цены

- 💰 ₱200–₱400  
- 🧾 Десерты и кафе  
- 🆓 Упаковка для сувениров

## Как добраться

- 🚶 Пешком от Rizal Blvd  
- 🚕 Такси  
- 🗺️ Центр Dumaguete

## Коммуникация & сервис

- 🕒 7:00–22:00  
- 🌐 Английский  
- 📶 Wi-Fi  
- 💳 Cash / card

## Полезные нюансы

- ⚠️ Популярно — очереди  
- 🌞 Лучше днём  
- 👕 Casual

## Локальная ценность

Sans Rival — гастрономическая визитка Думагете, известная по всей стране.

## Лучшие точки для фото

- 📷 Silvanas  
- 📷 Витрину  
- 🌅 Кафе вечером

## Практическая информация

- **Адрес:** Rizal Blvd, Dumaguete

## Почему это важно?

- 🌟 Кулинарный символ города  
- 🌍 Семейные рецепты  
- 📸 Витрина десертов
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🦐 Lab-as Seafood Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dumaguete-lab-as-seafood-restaurant',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Kinilaw  
- 🍽️ Grilled fish  
- 🍹 Местное пиво

## Цены

- 💰 ₱400–₱700  
- 🧾 À la carte  
- 🆓 Большие порции

## Как добраться

- 🚕 Такси  
- 🗺️ Север Dumaguete

## Коммуникация & сервис

- 🕒 16:00–22:00  
- 🌐 Английский  
- 📶 Нет Wi-Fi  
- 💳 Cash

## Полезные нюансы

- ⚠️ Лучше приходить вечером  
- 🌞 Закатный вид  
- 👕 Casual

## Локальная ценность

Lab-as — место встреч местных и путешественников, отражающее гастрономическую культуру города.

## Лучшие точки для фото

- 📷 Морепродукты  
- 📷 Террасу  
- 🌅 Закат над морем

## Практическая информация

- **Адрес:** Dumaguete North Rd

## Почему это важно?

- 🌟 Свежайшие морепродукты  
- 🌍 Ужин у моря  
- 📸 Живая атмосфера
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();
