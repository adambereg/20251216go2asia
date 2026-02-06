-- Places UPSERT (idempotent)
-- Generated from Atlas Content Canon v1 markdown files

-- Place: 🏙️ Petronas Twin Towers (Kuala Lumpur)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'kll-petronas-twin-towers',
  'my',
  'kll',
  '🏙️ Petronas Twin Towers',
  'kll-petronas-twin-towers',
  'landmark',
  'showplace',
  'landmark',
  '["landmark","skyscraper","modern"]'::jsonb,
  'Знаменитые башни-близнецы — главный символ Куала-Лумпура и современной Малайзии, соединённые небесным мостом.',
  3.1579,
  101.712,
  'KLCC, Kuala Lumpur',
  'https://www.petronastwintowers.com.my',
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

-- Place: 🕳️ Batu Caves (Kuala Lumpur)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'kll-batu-caves',
  'my',
  'kll',
  '🕳️ Batu Caves',
  'kll-batu-caves',
  'temple',
  'showplace',
  'temple',
  '["temple","cave","religion"]'::jsonb,
  'Храмовый комплекс в известняковых пещерах с гигантской статуей Муругана — одна из главных религиозных святынь страны.',
  3.2379,
  101.6831,
  'Batu Caves, Selangor',
  '—',
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

-- Place: 🌳 KLCC Park (Kuala Lumpur)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'kll-klcc-park',
  'my',
  'kll',
  '🌳 KLCC Park',
  'kll-klcc-park',
  'park',
  'showplace',
  'park',
  '["park","city","skyline"]'::jsonb,
  'Городской парк у подножия башен Petronas — зелёный оазис в центре мегаполиса.',
  3.1569,
  101.7132,
  'KLCC Park',
  '—',
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

-- Place: 🏛️ Merdeka Square (Kuala Lumpur)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'kll-merdeka-square',
  'my',
  'kll',
  '🏛️ Merdeka Square',
  'kll-merdeka-square',
  'history',
  'showplace',
  'history',
  '["history","square","colonial"]'::jsonb,
  'Историческая площадь, где была провозглашена независимость Малайзии.',
  3.1478,
  101.6937,
  'Merdeka Square',
  '—',
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

-- Place: 🛍️ Bukit Bintang (Kuala Lumpur)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'kll-bukit-bintang',
  'my',
  'kll',
  '🛍️ Bukit Bintang',
  'kll-bukit-bintang',
  'shopping',
  'showplace',
  'shopping',
  '["shopping","nightlife","city"]'::jsonb,
  'Главный торгово-развлекательный район Куала-Лумпура с моллами, улицами еды и ночной жизнью.',
  3.1456,
  101.709,
  'Bukit Bintang',
  '—',
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

-- Place: 🛕 Thean Hou Temple (Kuala Lumpur)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'kll-thean-hou-temple',
  'my',
  'kll',
  '🛕 Thean Hou Temple',
  'kll-thean-hou-temple',
  'temple',
  'showplace',
  'temple',
  '["temple","culture","viewpoint","chinese"]'::jsonb,
  'Красивый китайский храм на холме с панорамными видами и атмосферой традиционной китайской культуры в сердце Куала-Лумпура.',
  3.1219,
  101.6872,
  'Thean Hou Temple, Kuala Lumpur',
  '—',
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

-- Place: 🍢 Jalan Alor Food Street (Kuala Lumpur)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'kll-jalan-alor-food-street',
  'my',
  'kll',
  '🍢 Jalan Alor Food Street',
  'kll-jalan-alor-food-street',
  'street-food',
  'business',
  'street-food',
  '["street-food","local","night"]'::jsonb,
  'Легендарная улица уличной еды с малайской, китайской и тайской кухней.',
  3.1459,
  101.7073,
  'Jalan Alor',
  '—',
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

-- Place: 🍽️ Atmosphere 360 (Kuala Lumpur)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'kll-atmosphere-360',
  'my',
  'kll',
  '🍽️ Atmosphere 360',
  'kll-atmosphere-360',
  'restaurant',
  'business',
  'restaurant',
  '["restaurant","view","premium"]'::jsonb,
  'Вращающийся ресторан в телебашне KL Tower с панорамным видом на город.',
  3.1528,
  101.7038,
  'KL Tower',
  '—',
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

-- Place: 🍹 Heli Lounge Bar (Kuala Lumpur)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'kll-heli-lounge-bar',
  'my',
  'kll',
  '🍹 Heli Lounge Bar',
  'kll-heli-lounge-bar',
  'rooftop',
  'business',
  'rooftop',
  '["rooftop","bar","skyline"]'::jsonb,
  'Руфтоп-бар на бывшей вертолётной площадке с открытым видом на город.',
  3.1457,
  101.7104,
  'Bukit Bintang',
  '—',
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

-- Place: 🍛 Madam Kwan’s (Kuala Lumpur)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'kll-madam-kwan-s',
  'my',
  'kll',
  '🍛 Madam Kwan’s',
  'kll-madam-kwan-s',
  'malaysian-food',
  'business',
  'malaysian-food',
  '["malaysian-food","local","restaurant"]'::jsonb,
  'Известный ресторан малайской кухни с классическими блюдами.',
  3.156,
  101.7136,
  'KLCC',
  '—',
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

-- Place: 🍽️ Bijan Bar & Restaurant (Kuala Lumpur)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'kll-bijan-bar-restaurant',
  'my',
  'kll',
  '🍽️ Bijan Bar & Restaurant',
  'kll-bijan-bar-restaurant',
  'malaysian-food',
  'business',
  'malaysian-food',
  '["malaysian-food","restaurant","modern","dinner"]'::jsonb,
  'Современный ресторан малайской кухни, где традиционные блюда подают в изящной авторской интерпретации.',
  3.1497,
  101.7092,
  'Kuala Lumpur (центр)',
  '—',
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

-- Place: 🛍️ Central Market (Kuala Lumpur)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'kll-central-market',
  'my',
  'kll',
  '🛍️ Central Market',
  'kll-central-market',
  'market',
  'business',
  'market',
  '["market","food","shopping","culture"]'::jsonb,
  'Крытый рынок-центр ремёсел и еды рядом с Pasar Seni: сувениры, локальные сладости и удобная точка перекуса в старом центре.',
  3.1466,
  101.6956,
  'Central Market (Pasar Seni), Kuala Lumpur',
  '—',
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

-- Place: 🌉 Langkawi Sky Bridge (Langkawi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lgk-langkawi-sky-bridge',
  'my',
  'lgk',
  '🌉 Langkawi Sky Bridge',
  'lgk-langkawi-sky-bridge',
  'bridge',
  'showplace',
  'bridge',
  '["bridge","viewpoint","landmark"]'::jsonb,
  'Знаменитый изогнутый мост на высоте более 600 метров над уровнем моря с панорамными видами на джунгли и Андаманское море.',
  6.3854,
  99.6708,
  'Oriental Village, Langkawi',
  '—',
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

-- Place: 🚠 Langkawi Cable Car (Langkawi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lgk-langkawi-cable-car',
  'my',
  'lgk',
  '🚠 Langkawi Cable Car',
  'lgk-langkawi-cable-car',
  'cable-car',
  'showplace',
  'cable-car',
  '["cable-car","mountain","view"]'::jsonb,
  'Одна из самых крутых канатных дорог в мире, ведущая на вершину горы Мат Чинчанг.',
  6.3859,
  99.6704,
  'Pantai Kok, Langkawi',
  '—',
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

-- Place: 🌿 Kilim Karst Geoforest Park (Langkawi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lgk-kilim-karst-geoforest-park',
  'my',
  'lgk',
  '🌿 Kilim Karst Geoforest Park',
  'lgk-kilim-karst-geoforest-park',
  'geopark',
  'showplace',
  'geopark',
  '["geopark","mangrove","nature"]'::jsonb,
  'Геопарк UNESCO с мангровыми лесами, известняковыми скалами и речными маршрутами.',
  6.4332,
  99.8066,
  'Kilim, Langkawi',
  '—',
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

-- Place: 🏖️ Pantai Cenang Beach (Langkawi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lgk-pantai-cenang-beach',
  'my',
  'lgk',
  '🏖️ Pantai Cenang Beach',
  'lgk-pantai-cenang-beach',
  'beach',
  'showplace',
  'beach',
  '["beach","resort","sunset"]'::jsonb,
  'Самый популярный пляж Лангкави с кафе, барами и водными развлечениями.',
  6.2939,
  99.727,
  'Pantai Cenang, Langkawi',
  '—',
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

-- Place: 🦅 Eagle Square (Langkawi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lgk-eagle-square',
  'my',
  'lgk',
  '🦅 Eagle Square',
  'lgk-eagle-square',
  'landmark',
  'showplace',
  'landmark',
  '["landmark","square","symbol"]'::jsonb,
  'Площадь с гигантской статуей орла — символа Лангкави.',
  6.3126,
  99.8519,
  'Kuah, Langkawi',
  '—',
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

-- Place: 💦 Telaga Tujuh Waterfalls (Langkawi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lgk-telaga-tujuh-waterfalls',
  'my',
  'lgk',
  '💦 Telaga Tujuh Waterfalls',
  'lgk-telaga-tujuh-waterfalls',
  'waterfall',
  'showplace',
  'waterfall',
  '["waterfall","nature","hiking"]'::jsonb,
  '«Семь колодцев» — каскад водопадов и природных бассейнов на склоне горы Мат Чинчанг.',
  6.3814,
  99.6719,
  'Telaga Tujuh, Langkawi',
  '—',
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

-- Place: 🍽️ The Cliff Restaurant & Bar (Langkawi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lgk-the-cliff-restaurant-bar',
  'my',
  'lgk',
  '🍽️ The Cliff Restaurant & Bar',
  'lgk-the-cliff-restaurant-bar',
  'restaurant',
  'business',
  'restaurant',
  '["restaurant","sunset","view"]'::jsonb,
  'Ресторан и бар на скале с видом на Pantai Cenang и закаты над морем.',
  6.2956,
  99.7263,
  'Pantai Cenang, Langkawi',
  '—',
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

-- Place: ☕ Yellow Café (Langkawi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lgk-yellow-cafe',
  'my',
  'lgk',
  '☕ Yellow Café',
  'lgk-yellow-cafe',
  'cafe',
  'business',
  'cafe',
  '["cafe","beach","cocktails"]'::jsonb,
  'Неформальное пляжное кафе с коктейлями и живой атмосферой.',
  6.2932,
  99.7268,
  'Pantai Cenang',
  '—',
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

-- Place: 🦞 Orkid Ria Seafood Restaurant (Langkawi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lgk-orkid-ria-seafood-restaurant',
  'my',
  'lgk',
  '🦞 Orkid Ria Seafood Restaurant',
  'lgk-orkid-ria-seafood-restaurant',
  'seafood',
  'business',
  'seafood',
  '["seafood","restaurant","local"]'::jsonb,
  'Известный ресторан морепродуктов в городе Куах.',
  6.3102,
  99.8509,
  'Kuah, Langkawi',
  '—',
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

-- Place: 🛥️ Sunset Dinner Cruise Langkawi (Langkawi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lgk-sunset-dinner-cruise-langkawi',
  'my',
  'lgk',
  '🛥️ Sunset Dinner Cruise Langkawi',
  'lgk-sunset-dinner-cruise-langkawi',
  'cruise',
  'business',
  'cruise',
  '["cruise","sunset","romantic"]'::jsonb,
  'Вечерний морской круиз вокруг островов Лангкави с ужином, музыкой и закатом над Андаманским морем.',
  6.315,
  99.842,
  'Kuah Jetty, Langkawi',
  '—',
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

-- Place: 🦐 Wonderland Food Store (Langkawi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lgk-wonderland-food-store',
  'my',
  'lgk',
  '🦐 Wonderland Food Store',
  'lgk-wonderland-food-store',
  'seafood',
  'business',
  'seafood',
  '["seafood","local","budget"]'::jsonb,
  'Популярный локальный ресторан морепродуктов рядом с Kuah Jetty, известный демократичными ценами и свежей рыбой.',
  6.3139,
  99.847,
  'Kuah, Langkawi',
  '—',
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

-- Place: 🟥 Red Square (Melaka)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'mkz-red-square',
  'my',
  'mkz',
  '🟥 Red Square',
  'mkz-red-square',
  'unesco',
  'showplace',
  'unesco',
  '["unesco","colonial","landmark","heritage"]'::jsonb,
  'Историческая площадь с красными зданиями голландской эпохи — визитная карточка Малакки и символ её колониального прошлого.',
  2.192,
  102.2485,
  'Dutch Square, Melaka',
  '—',
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

-- Place: ⛰️ St. Paul’s Hill & Church Ruins (Melaka)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'mkz-st-paul-s-hill-church-ruins',
  'my',
  'mkz',
  '⛰️ St. Paul’s Hill & Church Ruins',
  'mkz-st-paul-s-hill-church-ruins',
  'church',
  'showplace',
  'church',
  '["church","ruins","history","viewpoint"]'::jsonb,
  'Холм с руинами старейшей протестантской церкви Юго-Восточной Азии и панорамным видом на реку и город.',
  2.193,
  102.2487,
  'St. Paul’s Hill, Melaka',
  '—',
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

-- Place: 🏰 A Famosa Fortress (Melaka)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'mkz-a-famosa-fortress',
  'my',
  'mkz',
  '🏰 A Famosa Fortress',
  'mkz-a-famosa-fortress',
  'fortress',
  'showplace',
  'fortress',
  '["fortress","portuguese","history","unesco"]'::jsonb,
  'Остатки самой старой европейской крепости в Юго-Восточной Азии, построенной португальцами в XVI веке.',
  2.1933,
  102.249,
  'Jalan Gereja, Melaka',
  '—',
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

-- Place: 🛍️ Jonker Street (Melaka)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'mkz-jonker-street',
  'my',
  'mkz',
  '🛍️ Jonker Street',
  'mkz-jonker-street',
  'street',
  'showplace',
  'street',
  '["street","heritage","shopping","walking"]'::jsonb,
  'Главная улица старого города с антикварными лавками, кафе и ночным рынком.',
  2.194,
  102.2475,
  'Jalan Hang Jebat, Melaka',
  '—',
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

-- Place: 🏛️ Cheng Ho Cultural Museum (Melaka)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'mkz-cheng-ho-cultural-museum',
  'my',
  'mkz',
  '🏛️ Cheng Ho Cultural Museum',
  'mkz-cheng-ho-cultural-museum',
  'museum',
  'showplace',
  'museum',
  '["museum","chinese","history","culture"]'::jsonb,
  'Музей, посвящённый великому китайскому адмиралу Чжэн Хэ и его влиянию на историю Малакки.',
  2.1945,
  102.247,
  '51 Lorong Hang Jebat, Melaka',
  '—',
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

-- Place: 🕌 Kampung Kling Mosque (Melaka)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'mkz-kampung-kling-mosque',
  'my',
  'mkz',
  '🕌 Kampung Kling Mosque',
  'mkz-kampung-kling-mosque',
  'mosque',
  'showplace',
  'mosque',
  '["mosque","heritage","architecture","culture"]'::jsonb,
  'Одна из старейших действующих мечетей Малайзии с уникальной смесью индийской, китайской и малайской архитектуры.',
  2.1928,
  102.2468,
  'Jalan Tukang Emas, Melaka',
  '—',
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

-- Place: ✝️ Christ Church Melaka (Melaka)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'mkz-christ-church-melaka',
  'my',
  'mkz',
  '✝️ Christ Church Melaka',
  'mkz-christ-church-melaka',
  'church',
  'showplace',
  'church',
  '["church","colonial","heritage","unesco"]'::jsonb,
  'Самое старое действующее протестантское здание в Юго-Восточной Азии, построенное голландцами в 1753 году.',
  2.1922,
  102.2486,
  'Dutch Square, Melaka',
  '—',
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

-- Place: 🍽️ Nancy’s Kitchen (Melaka)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'mkz-nancy-s-kitchen',
  'my',
  'mkz',
  '🍽️ Nancy’s Kitchen',
  'mkz-nancy-s-kitchen',
  'peranakan',
  'business',
  'peranakan',
  '["peranakan","local-food","heritage","restaurant"]'::jsonb,
  'Уютный ресторан перанаканской кухни в старом доме с садом.',
  2.1942,
  102.2472,
  '128 Jalan Tun Tan Cheng Lock, Melaka',
  '—',
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

-- Place: ☕ The Daily Fix Cafe (Melaka)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'mkz-the-daily-fix-cafe',
  'my',
  'mkz',
  '☕ The Daily Fix Cafe',
  'mkz-the-daily-fix-cafe',
  'cafe',
  'business',
  'cafe',
  '["cafe","coffee","breakfast","specialty"]'::jsonb,
  'Стильное кафе с качественным кофе и завтраками в колониальном здании.',
  2.1938,
  102.2478,
  '8 Jalan Hang Lekir, Melaka',
  '—',
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

-- Place: 🍹 Geographer Cafe (Melaka)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'mkz-geographer-cafe',
  'my',
  'mkz',
  '🍹 Geographer Cafe',
  'mkz-geographer-cafe',
  'cafe',
  'business',
  'cafe',
  '["cafe","river-view","sunset","photo"]'::jsonb,
  'Легендарное кафе на берегу реки с видом на мечеть и историческим центром.',
  2.1941,
  102.2474,
  '128 Jalan Kampung Pantai, Melaka',
  '—',
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

-- Place: ☕ Riverine Coffee (Melaka)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'mkz-riverine-coffee',
  'my',
  'mkz',
  '☕ Riverine Coffee',
  'mkz-riverine-coffee',
  'cafe',
  'business',
  'cafe',
  '["cafe","coffee","river-view","modern"]'::jsonb,
  'Кофейня с панорамным видом на реку и исторический интерьер.',
  2.1935,
  102.248,
  'Jalan Merdeka, Melaka',
  '—',
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

-- Place: 🍢 Capitol Satay (Melaka)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'mkz-capitol-satay',
  'my',
  'mkz',
  '🍢 Capitol Satay',
  'mkz-capitol-satay',
  'street-food',
  'business',
  'street-food',
  '["street-food","satay","local","budget"]'::jsonb,
  'Легендарная точка с самым вкусным сатэй в Малакке.',
  2.195,
  102.249,
  'Jalan Bendahara, Melaka',
  '—',
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

-- Place: 🌙 Jonker Walk Night Market (Melaka)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'mkz-jonker-walk-night-market',
  'my',
  'mkz',
  '🌙 Jonker Walk Night Market',
  'mkz-jonker-walk-night-market',
  'night-market',
  'business',
  'night-market',
  '["night-market","street-food","weekend","vibe"]'::jsonb,
  'Вечерний рынок по выходным с уличной едой, сувенирами и живой музыкой.',
  2.194,
  102.2475,
  'Jonker Street, Melaka',
  '—',
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

-- Place: 🏙️ George Town UNESCO World Heritage Area (Penang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'png-george-town-unesco-world-heritage-area',
  'my',
  'png',
  '🏙️ George Town UNESCO World Heritage Area',
  'png-george-town-unesco-world-heritage-area',
  'unesco',
  'showplace',
  'unesco',
  '["unesco","old-town","heritage"]'::jsonb,
  'Исторический центр Джорджтауна — объект UNESCO с колониальной архитектурой, храмами и уличным искусством.',
  5.4141,
  100.3288,
  'George Town, Penang',
  '—',
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

-- Place: 🏔️ Penang Hill (Penang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'png-penang-hill',
  'my',
  'png',
  '🏔️ Penang Hill',
  'png-penang-hill',
  'viewpoint',
  'showplace',
  'viewpoint',
  '["viewpoint","hill","nature"]'::jsonb,
  'Горная зона с фуникулёром и панорамными видами на остров и материк.',
  5.4119,
  100.2773,
  'Penang Hill',
  '—',
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

-- Place: 🛕 Kek Lok Si Temple (Penang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'png-kek-lok-si-temple',
  'my',
  'png',
  '🛕 Kek Lok Si Temple',
  'png-kek-lok-si-temple',
  'temple',
  'showplace',
  'temple',
  '["temple","buddhism","landmark"]'::jsonb,
  'Крупнейший буддийский храм Малайзии с пагодами и статуей богини Гуань Инь.',
  5.3961,
  100.2734,
  'Air Itam, Penang',
  '—',
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

-- Place: 🏛️ Cheong Fatt Tze – Blue Mansion (Penang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'png-cheong-fatt-tze-blue-mansion',
  'my',
  'png',
  '🏛️ Cheong Fatt Tze – Blue Mansion',
  'png-cheong-fatt-tze-blue-mansion',
  'mansion',
  'showplace',
  'mansion',
  '["mansion","museum","heritage"]'::jsonb,
  'Знаменитый «Синий особняк» — музей и бутик-отель в китайско-колониальном стиле.',
  5.4172,
  100.3356,
  'Leith St, George Town',
  '—',
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

-- Place: 🎨 Penang Street Art (Penang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'png-penang-street-art',
  'my',
  'png',
  '🎨 Penang Street Art',
  'png-penang-street-art',
  'street-art',
  'showplace',
  'street-art',
  '["street-art","culture","city"]'::jsonb,
  'Знаменитая улица с интерактивным стрит-артом, ставшая визитной карточкой Пенанга.',
  5.4176,
  100.3365,
  'Armenian Street, Penang',
  '—',
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

-- Place: 🏘 Clan Jetties of Penang (Penang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'png-clan-jetties-of-penang',
  'my',
  'png',
  '🏘 Clan Jetties of Penang',
  'png-clan-jetties-of-penang',
  'heritage',
  'showplace',
  'heritage',
  '["heritage","waterfront","culture"]'::jsonb,
  'Деревянные поселения на сваях — уникальное наследие китайских кланов Пенанга.',
  5.4166,
  100.3391,
  'Weld Quay, Penang',
  '—',
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

-- Place: 🍜 Gurney Drive Hawker Centre (Penang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'png-gurney-drive-hawker-centre',
  'my',
  'png',
  '🍜 Gurney Drive Hawker Centre',
  'png-gurney-drive-hawker-centre',
  'street-food',
  'business',
  'street-food',
  '["street-food","hawker","local"]'::jsonb,
  'Знаменитый фудкорт под открытым небом — сердце уличной кухни Пенанга.',
  5.4386,
  100.308,
  'Gurney Drive',
  '—',
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

-- Place: 🏯 China House (Penang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'png-china-house',
  'my',
  'png',
  '🏯 China House',
  'png-china-house',
  'cafe',
  'business',
  'cafe',
  '["cafe","art","dessert"]'::jsonb,
  'Огромное арт-пространство с кафе, галереями и одной из самых больших коллекций тортов в городе.',
  5.4185,
  100.3382,
  'Beach St, George Town',
  '—',
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

-- Place: 🍽️ Tek Sen Restaurant (Penang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'png-tek-sen-restaurant',
  'my',
  'png',
  '🍽️ Tek Sen Restaurant',
  'png-tek-sen-restaurant',
  'peranakan',
  'business',
  'peranakan',
  '["peranakan","restaurant","heritage"]'::jsonb,
  'Знаменитый семейный ресторан перанаканской кухни, известный традиционными рецептами.',
  5.417,
  100.336,
  'Carnarvon St, George Town',
  '—',
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

-- Place: 🌃 The Top Komtar Sky Dining (Penang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'png-the-top-komtar-sky-dining',
  'my',
  'png',
  '🌃 The Top Komtar Sky Dining',
  'png-the-top-komtar-sky-dining',
  'rooftop',
  'business',
  'rooftop',
  '["rooftop","view","dining","komtar"]'::jsonb,
  'Ресторан и смотровая зона на вершине Komtar Tower с панорамным видом на Джорджтаун и весь остров Пенанг.',
  5.4169,
  100.3315,
  'Komtar Tower, George Town, Penang',
  '—',
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

-- Place: 🏮 Jawi House Café Gallery (Penang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'png-jawi-house-cafe-gallery',
  'my',
  'png',
  '🏮 Jawi House Café Gallery',
  'png-jawi-house-cafe-gallery',
  'peranakan',
  'business',
  'peranakan',
  '["peranakan","malaysian-food","cafe","heritage"]'::jsonb,
  'Атмосферное кафе и ресторан с кухней в стиле “Jawi Peranakan” — смесь малайских и перанаканских традиций, в историческом здании George Town.',
  5.4179,
  100.3339,
  'George Town, Penang',
  '—',
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
