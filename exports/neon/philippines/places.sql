-- Places UPSERT (idempotent)
-- Generated from Atlas Content Canon v1 markdown files

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
