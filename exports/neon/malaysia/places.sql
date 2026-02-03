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
  'Знаменитые башни-близнецы — главный символ Куала-Лумпура и современной Малайзии, соединённые небесным мостом. - 🏙️ Skybridge - 🔭 Смотровую площадку - 🌃 Вечернюю подсветку башен - 🕒 09:00–21:00 - 🌐 Английский, малайский - 📶 Интернет в комплексе - 💳 Карты, наличные',
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
  'Храмовый комплекс в известняковых пещерах с гигантской статуей Муругана — одна из главных религиозных святынь страны. - 🛕 Пещерный храм - 🧗 Подъём по 272 ступеням - 📷 Смотровые площадки - 🕒 06:00–21:00 - 🌐 Английский, малайский - 📶 Интернет ограничен - 💳 Наличные',
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
  'Городской парк у подножия башен Petronas — зелёный оазис в центре мегаполиса. - 🚶 Прогулку - 💦 Музыкальный фонтан - 🌅 Вечернюю подсветку - 🕒 06:00–22:00 - 🌐 Английский - 📶 Интернет - 💳 —',
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
  'Историческая площадь, где была провозглашена независимость Малайзии. - 🏛️ Здание султана Абдул-Самада - 🚶 Прогулку по площади - 📷 Архитектуру - 🕒 Круглосуточно - 🌐 Английский - 📶 Интернет ограничен - 💳 —',
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
  'Главный торгово-развлекательный район Куала-Лумпура с моллами, улицами еды и ночной жизнью. - 🛍️ Торговые центры - 🍜 Уличную еду - 🌃 Вечернюю атмосферу - 🕒 Круглосуточно - 🌐 Английский - 📶 Интернет - 💳 Карты, наличные',
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
  'Красивый китайский храм на холме с панорамными видами и атмосферой традиционной китайской культуры в сердце Куала-Лумпура. - 🛕 Главный зал храма - 🏮 Двор с фонарями и арками - 🔭 Панораму города с территории - 🕒 08:00–20:00 - 🌐 Английский, малайский, китайский - 📶 Связь стабильная - 💳 Наличные',
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
  'Легендарная улица уличной еды с малайской, китайской и тайской кухней. - 🍢 Сатэй - 🍜 Лапшу - 🍤 Морепродукты - 🕒 18:00–01:00 - 🌐 Английский, малайский - 📶 Интернет ограничен - 💳 Наличные',
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
  'Вращающийся ресторан в телебашне KL Tower с панорамным видом на город. - 🍽️ Буфет - 🔭 Вид на город - 🌅 Закат - 🕒 12:00–22:00 - 🌐 Английский - 📶 Wi-Fi - 💳 Карты',
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
  'Руфтоп-бар на бывшей вертолётной площадке с открытым видом на город. - 🍹 Коктейли - 🌃 Вид на город - 🌅 Закат - 🕒 17:00–00:00 - 🌐 Английский - 📶 Wi-Fi - 💳 Карты, наличные',
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
  'Известный ресторан малайской кухни с классическими блюдами. - 🍽️ Nasi Lemak - 🍗 Rendang - 🍚 Рисовые блюда - 🕒 11:00–22:00 - 🌐 Английский - 📶 Wi-Fi - 💳 Карты, наличные',
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
  'Современный ресторан малайской кухни, где традиционные блюда подают в изящной авторской интерпретации. - 🍽️ Nasi Kerabu / блюда с травами и рисом - 🍗 Rendang в авторской подаче - 🍹 Фирменные коктейли/напитки - 🕒 12:00–15:00, 18:00–22:30 - 🌐 Английский, малайский - 📶 Wi-Fi - 💳 Карты, наличные',
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
  'Крытый рынок-центр ремёсел и еды рядом с Pasar Seni: сувениры, локальные сладости и удобная точка перекуса в старом центре. - 🍽️ Локальные закуски и сладости - 🛍️ Сувениры и ремесленные лавки - 🥤 Напитки и фрукты - 🕒 10:00–21:00 - 🌐 Английский, малайский - 📶 Интернет в части зон - 💳 Наличные, иногда карты',
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
  'Знаменитый изогнутый мост на высоте более 600 метров над уровнем моря с панорамными видами на джунгли и Андаманское море. - 🌉 Прогулку по мосту - 🔭 Смотровые площадки - 📷 Фото над пропастью - 🕒 09:30–18:00 - 🌐 Английский, малайский - 📶 Интернет ограничен - 💳 Карты, наличные',
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
  'Одна из самых крутых канатных дорог в мире, ведущая на вершину горы Мат Чинчанг. - 🚠 Подъём на вершину - 🔭 Смотровые площадки - 📷 Фото из кабины - 🕒 09:30–18:00 - 🌐 Английский - 📶 Интернет - 💳 Карты, наличные',
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
  'Геопарк UNESCO с мангровыми лесами, известняковыми скалами и речными маршрутами. - 🚤 Лодочный тур - 🦅 Наблюдение за орлами - 🌿 Мангровые каналы - 🕒 Днём - 🌐 Английский - 📶 Связь слабая - 💳 Наличные',
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
  'Самый популярный пляж Лангкави с кафе, барами и водными развлечениями. - 🏖 Купание - 🍹 Пляжные бары - 🌅 Закат - 🕒 Круглосуточно - 🌐 Английский - 📶 Интернет - 💳 Наличные, карты',
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
  'Площадь с гигантской статуей орла — символа Лангкави. - 🦅 Статую орла - 🚶 Прогулку по набережной - 📷 Фото на фоне моря - 🕒 Круглосуточно - 🌐 Английский - 📶 Связь стабильная - 💳 —',
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
  '«Семь колодцев» — каскад водопадов и природных бассейнов на склоне горы Мат Чинчанг. - 💦 Купание - 🥾 Подъём по тропам - 📷 Фото каскадов - 🕒 Днём - 🌐 Английский - 📶 Связь слабая - 💳 —',
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
  'Ресторан и бар на скале с видом на Pantai Cenang и закаты над морем. - 🍽 Морепродукты - 🍹 Коктейли - 🌅 Закат - 🕒 17:00–23:00 - 🌐 Английский - 📶 Wi-Fi - 💳 Карты, наличные',
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
  'Неформальное пляжное кафе с коктейлями и живой атмосферой. - 🍹 Коктейли - 🍔 Лёгкую еду - 🌅 Закат - 🕒 16:00–00:00 - 🌐 Английский - 📶 Wi-Fi - 💳 Наличные',
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
  'Известный ресторан морепродуктов в городе Куах. - 🍤 Лобстеры - 🦀 Крабы - 🍽 Морские блюда - 🕒 11:00–22:00 - 🌐 Английский - 📶 Wi-Fi - 💳 Наличные',
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
  'Вечерний морской круиз вокруг островов Лангкави с ужином, музыкой и закатом над Андаманским морем. - 🍽 Ужин на борту - 🍹 Напитки - 🌅 Закат с палубы - 🕒 Вечером (по расписанию) - 🌐 Английский - 📶 Связь ограниченная - 💳 Карты, наличные',
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
  'Популярный локальный ресторан морепродуктов рядом с Kuah Jetty, известный демократичными ценами и свежей рыбой. - 🍤 Крабы и креветки - 🍽 Рыба на гриле - 🍚 Простые гарниры - 🕒 17:00–23:00 - 🌐 Английский - 📶 Wi-Fi - 💳 Наличные',
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
  'Историческая площадь с красными зданиями голландской эпохи — визитная карточка Малакки и символ её колониального прошлого. - 🕒 Круглосуточно - 🌐 Английский, малайский - 📶 Интернет ограничен - 💳 Наличные',
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
  'Холм с руинами старейшей протестантской церкви Юго-Восточной Азии и панорамным видом на реку и город. - 🕒 Днём - 🌐 Английский, малайский - 📶 Связь слабая - 💳 Наличные',
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
  'Остатки самой старой европейской крепости в Юго-Восточной Азии, построенной португальцами в XVI веке. - 🕒 Круглосуточно - 🌐 Английский, малайский - 📶 Связь стабильная - 💳 Наличные',
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
  'Главная улица старого города с антикварными лавками, кафе и ночным рынком. - 🕒 Круглосуточно - 🌐 Английский, малайский, китайский - 📶 Интернет в кафе - 💳 Наличные, карты',
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
  'Музей, посвящённый великому китайскому адмиралу Чжэн Хэ и его влиянию на историю Малакки. - 🕒 09:30–17:30 - 🌐 Английский, китайский - 📶 Интернет ограничен - 💳 Наличные',
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
  'Одна из старейших действующих мечетей Малайзии с уникальной смесью индийской, китайской и малайской архитектуры. - 🕒 Вне времени молитв - 🌐 Малайский, английский - 📶 Связь стабильная - 💳 Наличные',
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
  'Самое старое действующее протестантское здание в Юго-Восточной Азии, построенное голландцами в 1753 году. - 🕒 Вне служб - 🌐 Английский, малайский - 📶 Интернет ограничен - 💳 Наличные',
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
  'Уютный ресторан перанаканской кухни в старом доме с садом. - 🕒 11:00–21:00 - 🌐 Английский - 📶 Wi-Fi - 💳 Наличные, карты',
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
  'Стильное кафе с качественным кофе и завтраками в колониальном здании. - 🕒 08:00–18:00 - 🌐 Английский - 📶 Wi-Fi - 💳 Наличные, карты',
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
  'Легендарное кафе на берегу реки с видом на мечеть и историческим центром. - 🕒 12:00–00:00 - 🌐 Английский - 📶 Wi-Fi - 💳 Наличные, карты',
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
  'Кофейня с панорамным видом на реку и исторический интерьер. - 🕒 08:00–18:00 - 🌐 Английский - 📶 Wi-Fi - 💳 Наличные',
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
  'Легендарная точка с самым вкусным сатэй в Малакке. - 🕒 18:00–00:00 - 🌐 Малайский, базовый английский - 📶 Связь ограниченная - 💳 Наличные',
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
  'Вечерний рынок по выходным с уличной едой, сувенирами и живой музыкой. - 🕒 Пт–Вс, 18:00–00:00 - 🌐 Английский, малайский - 📶 Связь стабильная - 💳 Наличные',
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
  'Исторический центр Джорджтауна — объект UNESCO с колониальной архитектурой, храмами и уличным искусством. - 🕒 Круглосуточно - 🌐 Английский, малайский - 📶 Интернет стабилен - 💳 Наличные, карты',
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
  'Горная зона с фуникулёром и панорамными видами на остров и материк. - 🕒 06:30–23:00 - 🌐 Английский - 📶 Интернет - 💳 Карты, наличные',
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
  'Крупнейший буддийский храм Малайзии с пагодами и статуей богини Гуань Инь. - 🕒 08:00–17:30 - 🌐 Английский, китайский - 📶 Интернет ограничен - 💳 Наличные',
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
  'Знаменитый «Синий особняк» — музей и бутик-отель в китайско-колониальном стиле. - 🕒 Экскурсии днём - 🌐 Английский - 📶 Интернет - 💳 Карты',
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
  'Знаменитая улица с интерактивным стрит-артом, ставшая визитной карточкой Пенанга. - 🕒 Круглосуточно - 🌐 Английский - 📶 Интернет - 💳 —',
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
  'Деревянные поселения на сваях — уникальное наследие китайских кланов Пенанга. - 🕒 Днём - 🌐 Английский - 📶 Интернет ограничен - 💳 Наличные',
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
  'Знаменитый фудкорт под открытым небом — сердце уличной кухни Пенанга. - 🕒 18:00–00:00 - 🌐 Английский - 📶 Интернет ограничен - 💳 Наличные',
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
  'Огромное арт-пространство с кафе, галереями и одной из самых больших коллекций тортов в городе. - 🕒 09:00–01:00 - 🌐 Английский - 📶 Wi-Fi - 💳 Карты, наличные',
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
  'Знаменитый семейный ресторан перанаканской кухни, известный традиционными рецептами. - 🕒 17:30–22:00 - 🌐 Английский - 📶 Интернет ограничен - 💳 Наличные',
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
  'Ресторан и смотровая зона на вершине Komtar Tower с панорамным видом на Джорджтаун и весь остров Пенанг. - 🕒 12:00–22:00 - 🌐 Английский, малайский - 📶 Wi-Fi - 💳 Карты, наличные',
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
  'Атмосферное кафе и ресторан с кухней в стиле “Jawi Peranakan” — смесь малайских и перанаканских традиций, в историческом здании George Town. - 🕒 11:00–22:00 - 🌐 Английский, малайский - 📶 Wi-Fi - 💳 Карты, наличные',
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


-- Content Blocks UPSERT (idempotent)
-- Generated from Atlas Content Canon v1 markdown files

-- Content block for: 🏙️ Petronas Twin Towers
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kll-petronas-twin-towers',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самый узнаваемый символ страны  
- 🌍 Икона современной архитектуры Азии  
- 📸 Башни, мост Skybridge и вечерняя подсветка

## Билеты и посещение

- 💰 ~98 MYR  
- 🎟️ Билеты по времени  
- 🆓 Парк KLCC — бесплатно

## Лучшие точки для фото

- 📷 Башни снизу  
- 📷 Skybridge  
- 🌅 Подсветку вечером

## Практическая информация

- **Адрес:** KLCC, Kuala Lumpur  
- **Сайт:** [https://www.petronastwintowers.com.my](https://www.petronastwintowers.com.my)  
- **Телефон:** —

## Как добраться

- 🚇 LRT KLCC  
- 🚕 Такси / Grab  
- 🗺️ Центр города

## Полезные нюансы

- ⚠️ Билеты лучше бронировать заранее  
- 🌞 Лучше днём для вида, вечером для фото  
- 👕 Повседневная одежда  
- 🐾 —

## Локальная ценность

Башни стали символом экономического роста и национальной идентичности Малайзии.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🕳️ Batu Caves
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kll-batu-caves',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самая известная индуистская святыня Малайзии  
- 🌍 Уникальный природно-религиозный объект  
- 📸 Цветная лестница и статуя Муругана

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Отдельные пещеры — платно  
- 🆓 Основной комплекс бесплатный

## Лучшие точки для фото

- 📷 Статую Муругана  
- 📷 Лестницу  
- 🌅 Вид сверху

## Практическая информация

- **Адрес:** Batu Caves, Selangor  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚆 KTM Batu Caves  
- 🚕 Такси / Grab  
- 🗺️ Север Куала-Лумпура

## Полезные нюансы

- ⚠️ Осторожно с обезьянами  
- 🌞 Лучше утром  
- 👕 Закрытая одежда  
- 🐾 Не кормить животных

## Локальная ценность

Batu Caves — центр индуистской общины и место крупных религиозных фестивалей.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌳 KLCC Park
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kll-klcc-park',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучший парк в центре города  
- 🌍 Контраст природы и небоскрёбов  
- 📸 Башни на фоне зелени

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободный вход

## Лучшие точки для фото

- 📷 Башни из парка  
- 📷 Фонтан  
- 🌅 Вечерний свет

## Практическая информация

- **Адрес:** KLCC Park  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚇 LRT KLCC  
- 🚶 Пешком  
- 🗺️ Центр города

## Полезные нюансы

- ⚠️ Жарко днём  
- 🌞 Лучшее время — утро и вечер  
- 👕 Лёгкая одежда  
- 🐾 —

## Локальная ценность

Парк улучшает качество городской среды и доступен всем жителям.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏛️ Merdeka Square
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kll-merdeka-square',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Историческое сердце страны  
- 🌍 Колониальное наследие  
- 📸 Площадь и здания

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободный доступ

## Лучшие точки для фото

- 📷 Здание султана  
- 📷 Флагшток  
- 🌅 Вечерний свет

## Практическая информация

- **Адрес:** Merdeka Square  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚇 LRT Masjid Jamek  
- 🚶 Пешком  
- 🗺️ Старый центр

## Полезные нюансы

- ⚠️ Жарко днём  
- 🌞 Лучше утром  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Площадь — символ независимости и национальной истории Малайзии.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛍️ Bukit Bintang
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kll-bukit-bintang',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Центр шопинга и развлечений  
- 🌍 Современный городской ритм  
- 📸 Улицы, неон и толпы

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Шопинг — по желанию  
- 🆓 Прогулка свободная

## Лучшие точки для фото

- 📷 Улицы  
- 📷 Торговые центры  
- 🌅 Ночной свет

## Практическая информация

- **Адрес:** Bukit Bintang  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚇 MRT Bukit Bintang  
- 🚕 Такси  
- 🗺️ Центр города

## Полезные нюансы

- ⚠️ Многолюдно вечером  
- 🌞 Лучше вечером  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Район формирует современный образ Куала-Лумпура.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛕 Thean Hou Temple
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kll-thean-hou-temple',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Один из самых красивых храмов города  
- 🌍 Центр китайского культурного наследия в Малайзии  
- 📸 Красные пагоды, фонари и панорамный вид

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Пожертвования приветствуются  
- 🆓 Свободный вход

## Лучшие точки для фото

- 📷 Красные пагоды и фонари  
- 📷 Центральные ворота  
- 🌅 Вид на город на закате

## Практическая информация

- **Адрес:** Thean Hou Temple, Kuala Lumpur  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси / Grab  
- 🚆 LRT к району Brickfields + короткий подъём  
- 🗺️ Район Robson Heights / Brickfields

## Полезные нюансы

- ⚠️ Уважайте религиозное пространство  
- 🌞 Лучше утром или к закату  
- 👕 Скромная одежда  
- 🐾 —

## Локальная ценность

Храм служит культурным центром китайской общины и важной точкой религиозных и семейных традиций.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍢 Jalan Alor Food Street
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kll-jalan-alor-food-street',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком из Bukit Bintang  
- 🚇 MRT Bukit Bintang  
- 🗺️ Jalan Alor

## Полезные нюансы

- ⚠️ Лучше вечером  
- 🌞 Приходить голодным  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Улица поддерживает малый бизнес и гастрономическую культуру города.

## Лучшие точки для фото

- 📷 Гриль  
- 📷 Еду  
- 🌅 Ночную улицу

## Практическая информация

- **Адрес:** Jalan Alor  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучшая street food улица города  
- 🌍 Кулинарное разнообразие  
- 📸 Гриль, огни и атмосфера

## Билеты и посещение

- 💰 Бюджет–средний  
- 🎟️ —  
- 🆓 Свободный вход
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍽️ Atmosphere 360
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kll-atmosphere-360',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси  
- 🗺️ KL Tower

## Полезные нюансы

- ⚠️ Дресс-код smart casual  
- 🌞 Лучше вечером  
- 👕 Элегантная одежда  
- 🐾 —

## Локальная ценность

Ресторан — знаковая часть туристической инфраструктуры столицы.

## Лучшие точки для фото

- 📷 Город сверху  
- 📷 Интерьер  
- 🌅 Закат

## Практическая информация

- **Адрес:** KL Tower  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучший вид на город  
- 🌍 Уникальный формат ресторана  
- 📸 Панорама 360°

## Билеты и посещение

- 💰 💎 Premium  
- 🎟️ Бронирование обязательно  
- 🆓 —
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍹 Heli Lounge Bar
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kll-heli-lounge-bar',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси  
- 🗺️ Bukit Bintang

## Полезные нюансы

- ⚠️ Без ограждений — осторожно  
- 🌞 Лучше на закат  
- 👕 Smart casual  
- 🐾 —

## Локальная ценность

Бар формирует современный и креативный образ ночного Куала-Лумпура.

## Лучшие точки для фото

- 📷 Skyline  
- 📷 Бар  
- 🌅 Закат

## Практическая информация

- **Адрес:** Bukit Bintang  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Один из самых необычных баров Азии  
- 🌍 Открытая площадка без ограждений  
- 📸 Городской skyline

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ Вход свободный  
- 🆓 —
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍛 Madam Kwan’s
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kll-madam-kwan-s',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком в KLCC  
- 🚇 LRT KLCC  
- 🗺️ Торговые центры

## Полезные нюансы

- ⚠️ Популярно в обед  
- 🌞 Лучше днём  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Ресторан сохраняет и популяризирует национальную кухню Малайзии.

## Лучшие точки для фото

- 📷 Подачу блюд  
- 📷 Интерьер  
- 🌅 Атмосферу зала

## Практическая информация

- **Адрес:** KLCC  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Эталон малайской кухни  
- 🌍 Национальные рецепты  
- 📸 Аутентичная подача

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ —  
- 🆓 —
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍽️ Bijan Bar & Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kll-bijan-bar-restaurant',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси / Grab  
- 🚇 MRT/LRT до центра + короткая поездка  
- 🗺️ Район Bukit Bintang / центр

## Полезные нюансы

- ⚠️ Лучше бронировать заранее  
- 🌞 Лучшее время — ужин  
- 👕 Smart casual  
- 🐾 —

## Локальная ценность

Ресторан продвигает малайскую гастрономию как часть культурной идентичности страны.

## Лучшие точки для фото

- 📷 Подачу блюд  
- 📷 Интерьер  
- 🌅 Вечернюю атмосферу

## Практическая информация

- **Адрес:** Kuala Lumpur (центр)  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Один из лучших ресторанов малайской кухни в городе  
- 🌍 Идеально для знакомства с национальными вкусами  
- 📸 Стильный интерьер и красивая подача

## Билеты и посещение

- 💰 Средний–высокий чек (💵💵 – 💎)  
- 🎟️ Бронирование желательно вечером  
- 🆓 —
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛍️ Central Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kll-central-market',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚇 MRT/LRT Pasar Seni  
- 🚶 Пешком из Merdeka Square/Chinatown  
- 🗺️ Старый центр

## Полезные нюансы

- ⚠️ Днём многолюдно  
- 🌞 Лучше в первой половине дня  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Рынок поддерживает местных мастеров, ремесленников и микро-бизнесы, сохраняя культурную ткань старого города.

## Лучшие точки для фото

- 📷 Ряды лавок  
- 📷 Сувениры и ремёсла  
- 🌅 Вечерние огни в старом центре

## Практическая информация

- **Адрес:** Central Market (Pasar Seni), Kuala Lumpur  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Удобное место для сувениров и локальных продуктов  
- 🌍 Культурный центр ремёсел Куала-Лумпура  
- 📸 Колоритные лавки и атмосфера рынка

## Билеты и посещение

- 💰 Бюджет–средний  
- 🎟️ Вход свободный  
- 🆓 —
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌉 Langkawi Sky Bridge
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lgk-langkawi-sky-bridge',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самая узнаваемая достопримечательность Лангкави  
- 🌍 Инженерное чудо в тропических горах  
- 📸 Захватывающие панорамы островов

## Билеты и посещение

- 💰 ~30–40 MYR  
- 🎟️ Билет приобретается на канатной дороге  
- 🆓 —

## Лучшие точки для фото

- 📷 Мост целиком  
- 📷 Вид на море  
- 🌅 Туман над горами

## Практическая информация

- **Адрес:** Oriental Village, Langkawi  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚠 Канатная дорога Langkawi Cable Car  
- 🚕 Такси  
- 🗺️ Mount Mat Cincang

## Полезные нюансы

- ⚠️ Может закрываться из-за погоды  
- 🌞 Лучше в ясную погоду  
- 👕 Удобная обувь  
- 🐾 —

## Локальная ценность

Sky Bridge стал визитной карточкой острова и драйвером туристической экономики.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🚠 Langkawi Cable Car
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lgk-langkawi-cable-car',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Экстремальные углы подъёма  
- 🌍 Лучшие виды острова  
- 📸 Джунгли и море с высоты

## Билеты и посещение

- 💰 ~35 MYR  
- 🎟️ Билет включает несколько зон  
- 🆓 —

## Лучшие точки для фото

- 📷 Кабины  
- 📷 Склоны гор  
- 🌅 Вид на острова

## Практическая информация

- **Адрес:** Pantai Kok, Langkawi  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси  
- 🗺️ Oriental Village

## Полезные нюансы

- ⚠️ Очереди в высокий сезон  
- 🌞 Лучше утром  
- 👕 Удобная одежда  
- 🐾 —

## Локальная ценность

Канатная дорога — ключевой туристический объект и работодатель для местных жителей.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌿 Kilim Karst Geoforest Park
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lgk-kilim-karst-geoforest-park',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Природное наследие UNESCO  
- 🌍 Мангровые экосистемы  
- 📸 Скалы, орлы и реки

## Билеты и посещение

- 💰 Тур от ~200 MYR  
- 🎟️ Экскурсии  
- 🆓 —

## Лучшие точки для фото

- 📷 Скалы  
- 📷 Мангровые каналы  
- 🌅 Отражения в воде

## Практическая информация

- **Адрес:** Kilim, Langkawi  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси  
- 🚤 Тур из Kilim  
- 🗺️ Северо-восток острова

## Полезные нюансы

- ⚠️ Экскурсия лучше с гидом  
- 🌞 Лучше утром  
- 👕 Лёгкая одежда  
- 🐾 —

## Локальная ценность

Геопарк поддерживает экотуризм и охрану уникальных ландшафтов Лангкави.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏖️ Pantai Cenang Beach
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lgk-pantai-cenang-beach',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Главный курортный пляж  
- 🌍 Инфраструктура и развлечения  
- 📸 Закаты над Андаманским морем

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Лежаки — платно  
- 🆓 Общественный пляж

## Лучшие точки для фото

- 📷 Пляж  
- 📷 Закат  
- 🌅 Лодки у берега

## Практическая информация

- **Адрес:** Pantai Cenang, Langkawi  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси  
- 🛵 Байк  
- 🗺️ Запад острова

## Полезные нюансы

- ⚠️ Многолюдно вечером  
- 🌞 Лучшее время — утро  
- 👕 Пляжная одежда  
- 🐾 —

## Локальная ценность

Pantai Cenang — центр туристической жизни и малого бизнеса острова.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🦅 Eagle Square
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lgk-eagle-square',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Главный символ острова  
- 🌍 Фото-точка для туристов  
- 📸 Статуя орла и море

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободный вход

## Лучшие точки для фото

- 📷 Орла  
- 📷 Площадь  
- 🌅 Свет у моря

## Практическая информация

- **Адрес:** Kuah, Langkawi  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси  
- 🗺️ Kuah Jetty

## Полезные нюансы

- ⚠️ Жарко днём  
- 🌞 Лучше утром или вечером  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Статуя подчёркивает природную идентичность острова и его название.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 💦 Telaga Tujuh Waterfalls
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lgk-telaga-tujuh-waterfalls',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Природные бассейны  
- 🌍 Легендарное место  
- 📸 Джунгли и вода

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободный вход

## Лучшие точки для фото

- 📷 Бассейны  
- 📷 Потоки воды  
- 🌅 Свет в джунглях

## Практическая информация

- **Адрес:** Telaga Tujuh, Langkawi  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси  
- 🗺️ Mount Mat Cincang

## Полезные нюансы

- ⚠️ Скользкие камни  
- 🌞 Лучше утром  
- 👕 Удобная обувь  
- 🐾 —

## Локальная ценность

Водопады — популярное место отдыха местных жителей.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍽️ The Cliff Restaurant & Bar
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lgk-the-cliff-restaurant-bar',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси  
- 🗺️ Pantai Cenang

## Полезные нюансы

- ⚠️ Популярно вечером  
- 🌞 Лучше к закату  
- 👕 Smart casual  
- 🐾 —

## Локальная ценность

Ресторан поддерживает туристическую привлекательность пляжной зоны.

## Лучшие точки для фото

- 📷 Террасу  
- 📷 Закат  
- 🌅 Вечерний свет

## Практическая информация

- **Адрес:** Pantai Cenang, Langkawi  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучший закат на острове  
- 🌍 Романтическая атмосфера  
- 📸 Вид на океан

## Билеты и посещение

- 💰 Средний–высокий чек  
- 🎟️ Бронирование желательно  
- 🆓 —
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ☕ Yellow Café
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lgk-yellow-cafe',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком  
- 🗺️ Pantai Cenang

## Полезные нюансы

- ⚠️ Многолюдно вечером  
- 🌞 Лучше к закату  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Кафе — часть пляжной культуры и неформальной жизни острова.

## Лучшие точки для фото

- 📷 Столы на песке  
- 📷 Коктейли  
- 🌅 Закат

## Практическая информация

- **Адрес:** Pantai Cenang  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Культовое место Pantai Cenang  
- 🌍 Расслабленный beach-вайб  
- 📸 Столы прямо на песке

## Билеты и посещение

- 💰 Бюджет–средний  
- 🎟️ —  
- 🆓 —
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🦞 Orkid Ria Seafood Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lgk-orkid-ria-seafood-restaurant',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси  
- 🗺️ Kuah Town

## Полезные нюансы

- ⚠️ Лучше бронировать  
- 🌞 Подходит для ужина  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Ресторан поддерживает местных рыбаков и гастрономию Лангкави.

## Лучшие точки для фото

- 📷 Блюда  
- 📷 Аквариумы  
- 🌅 Атмосферу

## Практическая информация

- **Адрес:** Kuah, Langkawi  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучшие морепродукты острова  
- 🌍 Популярен у местных  
- 📸 Свежие морепродукты

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ —  
- 🆓 —
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛥️ Sunset Dinner Cruise Langkawi
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lgk-sunset-dinner-cruise-langkawi',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси до Kuah Jetty  
- 🛥 Отправление с причала  
- 🗺️ Kuah Harbour

## Полезные нюансы

- ⚠️ Зависит от погоды  
- 🌞 Лучше бронировать заранее  
- 👕 Лёгкая курортная одежда  
- 🐾 —

## Локальная ценность

Круизы поддерживают морской туризм и локальные судоходные компании.

## Лучшие точки для фото

- 📷 Яхту на закате  
- 📷 Острова  
- 🌅 Закат над морем

## Практическая информация

- **Адрес:** Kuah Jetty, Langkawi  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Один из самых романтичных форматов отдыха на острове  
- 🌍 Вид на Лангкави с моря  
- 📸 Закаты, яхта и открытая палуба

## Билеты и посещение

- 💰 ~200–300 MYR  
- 🎟️ По предварительному бронированию  
- 🆓 —
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🦐 Wonderland Food Store
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lgk-wonderland-food-store',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси  
- 🚶 Пешком от Kuah Jetty  
- 🗺️ Kuah Town

## Полезные нюансы

- ⚠️ Очереди вечером  
- 🌞 Лучше приходить пораньше  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Ресторан поддерживает локальных рыбаков и доступную гастрономию острова.

## Лучшие точки для фото

- 📷 Блюда  
- 📷 Аквариумы  
- 🌅 Атмосферу вечера

## Практическая информация

- **Адрес:** Kuah, Langkawi  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Любимое место местных жителей  
- 🌍 Аутентичная кухня без туристических цен  
- 📸 Морепродукты и живая атмосфера

## Билеты и посещение

- 💰 Бюджет–средний  
- 🎟️ —  
- 🆓 —
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🟥 Red Square
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mkz-red-square',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Главный исторический центр города  
- 🌍 Яркий пример голландской архитектуры в Юго-Восточной Азии  
- 📸 Иконичные красные фасады и фонтан

## Структура комплекса

- 🏛️ Christ Church  
- 🏛️ Stadthuys (бывшая ратуша)  
- 🎨 Фотографирование на фоне площади

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Отдельные музеи — платно  
- 🆓 Свободный доступ к площади

## Лучшие точки для фото

- 📷 Красные здания  
- 📷 Фонтан  
- 🌅 Вечернее освещение

## Практическая информация

- **Адрес:** Dutch Square, Melaka  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком из Jonker Street  
- 🚕 Такси / Grab  
- 🗺️ Центр старого города

## Полезные нюансы

- ⚠️ Жарко днём  
- 🌞 Лучше утром или вечером  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Площадь — сердце туристического и культурного наследия Малакки, объект Всемирного наследия ЮНЕСКО.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ⛰️ St. Paul’s Hill & Church Ruins
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mkz-st-paul-s-hill-church-ruins',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Одна из самых атмосферных исторических точек Малакки  
- 🌍 Связь с португальским и голландским периодами  
- 📸 Руины на фоне тропической зелени

## Структура комплекса

- 🏛️ Руины церкви Святого Павла  
- 🗿 Надгробия XVII века  
- 🔭 Панораму с вершины холма

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободный вход

## Лучшие точки для фото

- 📷 Руины церкви  
- 📷 Вид на реку  
- 🌅 Свет сквозь арки

## Практическая информация

- **Адрес:** St. Paul’s Hill, Melaka  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком от Red Square  
- 🗺️ Старый город

## Полезные нюансы

- ⚠️ Удобная обувь  
- 🌞 Лучше утром  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Холм — важная часть духовной и колониальной истории Малакки.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏰 A Famosa Fortress
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mkz-a-famosa-fortress',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Единственное сохранившееся свидетельство португальской эпохи  
- 🌍 Военная история региона  
- 📸 Ворота Порта-де-Сантьяго

## Структура комплекса

- 🏯 Ворота крепости  
- 🧱 Фрагменты стен  
- 🚶 Прогулку по территории

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободный доступ

## Лучшие точки для фото

- 📷 Ворота  
- 📷 Исторические таблички  
- 🌅 Контраст старого и нового города

## Практическая информация

- **Адрес:** Jalan Gereja, Melaka  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком от St. Paul’s Hill  
- 🗺️ Старый город

## Полезные нюансы

- ⚠️ Сохранились только фрагменты  
- 🌞 Подходит для короткой остановки  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Крепость — символ начала европейского присутствия в регионе.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛍️ Jonker Street
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mkz-jonker-street',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Сердце культурной жизни Малакки  
- 🌍 Смешение китайской, малайской и европейской культур  
- 📸 Колоритные фасады и вывески

## Структура комплекса

- 🛍️ Антикварные магазины  
- 🍜 Уличную еду  
- 🚶 Прогулку по брусчатке

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Покупки — по желанию  
- 🆓 Свободный доступ

## Лучшие точки для фото

- 📷 Выцветшие фасады  
- 📷 Уличные лавки  
- 🌅 Вечерние огни

## Практическая информация

- **Адрес:** Jalan Hang Jebat, Melaka  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Такси  
- 🗺️ Старый город

## Полезные нюансы

- ⚠️ Очень многолюдно вечером  
- 🌞 Лучше днём и на закате  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Улица сохраняет ремесленные традиции и поддерживает малый бизнес.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏛️ Cheng Ho Cultural Museum
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mkz-cheng-ho-cultural-museum',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Уникальный музей, посвящённый китайско-малайским связям  
- 🌍 История морских экспедиций XV века  
- 📸 Реконструкция дома адмирала

## Структура комплекса

- 🖼️ Экспозиции о путешествиях Чжэн Хэ  
- 🏠 Реконструированный особняк  
- 🗺️ Карта маршрутов флота

## Билеты и посещение

- 💰 ~15 MYR  
- 🎟️ Билет на входе  
- 🆓 —

## Лучшие точки для фото

- 📷 Фасад музея  
- 📷 Интерьеры  
- 🌅 Дворик

## Практическая информация

- **Адрес:** 51 Lorong Hang Jebat, Melaka  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком от Jonker Street  
- 🗺️ Старый город

## Полезные нюансы

- ⚠️ Небольшой музей  
- 🌞 Подходит для дневного визита  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Музей подчёркивает роль Малакки как центра древних морских торговых путей.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🕌 Kampung Kling Mosque
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mkz-kampung-kling-mosque',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Архитектурный гибрид трёх культур  
- 🌍 Духовный центр индийской общины Малакки  
- 📸 Яркие детали и внутренний двор

## Структура комплекса

- 🕌 Главный молитвенный зал  
- 🏮 Двор с фонтаном  
- 🧱 Декоративные элементы

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Для туристов — только внешний осмотр  
- 🆓 —

## Лучшие точки для фото

- 📷 Фасад  
- 📷 Двор  
- 🌅 Архитектурные детали

## Практическая информация

- **Адрес:** Jalan Tukang Emas, Melaka  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком от Jonker Street  
- 🗺️ Старый город

## Полезные нюансы

- ⚠️ Уважайте религиозное пространство  
- 🌞 Лучше днём  
- 👕 Закрытая одежда  
- 🐾 —

## Локальная ценность

Мечеть — живое свидетельство многонационального наследия Малакки.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ✝️ Christ Church Melaka
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mkz-christ-church-melaka',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Архитектурная жемчужина голландской эпохи  
- 🌍 История христианства в регионе  
- 📸 Красный кирпич и белые рамы

## Структура комплекса

- ✝️ Интерьер церкви  
- 🪑 Деревянные скамьи и орган  
- 🪟 Витражи

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Пожертвования приветствуются  
- 🆓 —

## Лучшие точки для фото

- 📷 Фасад  
- 📷 Интерьер  
- 🌅 Свет через окна

## Практическая информация

- **Адрес:** Dutch Square, Melaka  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком от Red Square  
- 🗺️ Центр старого города

## Полезные нюансы

- ⚠️ Уважайте тишину  
- 🌞 Лучше днём  
- 👕 Скромная одежда  
- 🐾 —

## Локальная ценность

Церковь — символ религиозного и колониального наследия Малакки.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍽️ Nancy’s Kitchen
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mkz-nancy-s-kitchen',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍛 Laksa Nyonya  
- 🍗 Ayam Pongteh  
- 🍰 Kueh Bengka

## Как добраться

- 🚶 Пешком от Jonker Street  
- 🗺️ Старый город

## Полезные нюансы

- ⚠️ Мало мест  
- 🌞 Подходит для обеда и ужина  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Ресторан сохраняет кулинарное наследие перанакан и поддерживает семейные рецепты.

## Лучшие точки для фото

- 📷 Подачу блюд  
- 📷 Сад  
- 🌅 Атмосферу зала

## Практическая информация

- **Адрес:** 128 Jalan Tun Tan Cheng Lock, Melaka  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Аутентичная кухня перанакан  
- 🌍 Исторический интерьер  
- 📸 Садовая терраса

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ Бронирование желательно  
- 🆓 —
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ☕ The Daily Fix Cafe
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mkz-the-daily-fix-cafe',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- ☕ V60 фильтр-кофе  
- 🥐 Австралийские тосты  
- 🍰 Домашнюю выпечку

## Как добраться

- 🚶 Пешком от Jonker Street  
- 🗺️ Старый город

## Полезные нюансы

- ⚠️ Популярно утром  
- 🌞 Лучше приходить рано  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Кафе формирует современную кофейную культуру Малакки.

## Лучшие точки для фото

- 📷 Кофе  
- 📷 Интерьер  
- 🌅 Утренний свет

## Практическая информация

- **Адрес:** 8 Jalan Hang Lekir, Melaka  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучший specialty coffee в Малакке  
- 🌍 Уютный интерьер в старом доме  
- 📸 Фотогеничная подача

## Билеты и посещение

- 💰 Бюджет–средний  
- 🎟️ —  
- 🆓 —
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍹 Geographer Cafe
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mkz-geographer-cafe',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍹 Коктейли  
- ☕ Кофе  
- 🍰 Десерты

## Как добраться

- 🚶 Пешком от Jonker Street  
- 🗺️ Набережная реки

## Полезные нюансы

- ⚠️ Многолюдно вечером  
- 🌞 Лучшее время — закат  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Кафе стало символом романтической Малакки и любимым местом фотографов.

## Лучшие точки для фото

- 📷 Вид на реку  
- 📷 Мечеть в отражении  
- 🌅 Закат

## Практическая информация

- **Адрес:** 128 Jalan Kampung Pantai, Melaka  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Самое фотогеничное место в Малакке  
- 🌍 Вид на реку и мечеть  
- 📸 Закаты и атмосфера

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ —  
- 🆓 —
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ☕ Riverine Coffee
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mkz-riverine-coffee',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- ☕ Эспрессо  
- 🧋 Локальные напитки  
- 🍰 Выпечку

## Как добраться

- 🚶 Пешком от Red Square  
- 🗺️ Набережная

## Полезные нюансы

- ⚠️ Мало мест  
- 🌞 Подходит для утра  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Кофейня сочетает историческую атмосферу и современные стандарты.

## Лучшие точки для фото

- 📷 Вид на реку  
- 📷 Интерьер  
- 🌅 Утренний свет

## Практическая информация

- **Адрес:** Jalan Merdeka, Melaka  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Кофе с видом на воду  
- 🌍 Современный формат в старом здании  
- 📸 Минималистичный дизайн

## Билеты и посещение

- 💰 Бюджет–средний  
- 🎟️ —  
- 🆓 —
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍢 Capitol Satay
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mkz-capitol-satay',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍢 Сатэй из курицы и говядины  
- 🥜 Арахисовый соус  
- 🍚 Рис

## Как добраться

- 🚕 Такси  
- 🗺️ Capitol Theatre area

## Полезные нюансы

- ⚠️ Очереди вечером  
- 🌞 Только вечером  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Точка — часть гастрономической идентичности Малакки.

## Лучшие точки для фото

- 📷 Гриль  
- 📷 Порции  
- 🌅 Атмосферу улицы

## Практическая информация

- **Адрес:** Jalan Bendahara, Melaka  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучший сатэй в городе  
- 🌍 Аутентичный стрит-фуд  
- 📸 Процесс готовки на гриле

## Билеты и посещение

- 💰 Бюджетный  
- 🎟️ —  
- 🆓 —
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌙 Jonker Walk Night Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'mkz-jonker-walk-night-market',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍢 Сатэй и лапшу  
- 🥤 Дуриановые десерты  
- 🍡 Локальные сладости

## Как добраться

- 🚶 Пешком  
- 🗺️ Jonker Street

## Полезные нюансы

- ⚠️ Очень многолюдно  
- 🌞 Только по выходным  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Рынок — сердце туристической и социальной жизни Малакки.

## Лучшие точки для фото

- 📷 Ряды еды  
- 📷 Сувениры  
- 🌅 Ночную атмосферу

## Практическая информация

- **Адрес:** Jonker Street, Melaka  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Главное событие уикенда в Малакке  
- 🌍 Атмосфера праздника  
- 📸 Огни, еда и толпы

## Билеты и посещение

- 💰 Бюджетный  
- 🎟️ —  
- 🆓 Свободный вход
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏙️ George Town UNESCO World Heritage Area
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'png-george-town-unesco-world-heritage-area',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Один из самых атмосферных городов Юго-Восточной Азии  
- 🌍 Наследие британского колониального периода  
- 📸 Колониальные фасады и стрит-арт

## Структура комплекса

- 🚶 Прогулку по старым кварталам  
- 🏛 Колониальные здания  
- 🎨 Уличное искусство

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Музеи — платно  
- 🆓 Прогулка свободная

## Лучшие точки для фото

- 📷 Колониальные улицы  
- 📷 Стрит-арт  
- 🌅 Вечерний свет

## Практическая информация

- **Адрес:** George Town, Penang  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси / Grab  
- 🚌 Городские автобусы  
- 🗺️ Центр острова Пенанг

## Полезные нюансы

- ⚠️ Жарко днём  
- 🌞 Лучшее время — утро и вечер  
- 👕 Лёгкая одежда  
- 🐾 —

## Локальная ценность

Исторический центр сохраняет культурное разнообразие и поддерживает локальный туризм.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏔️ Penang Hill
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'png-penang-hill',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучший вид на Пенанг  
- 🌍 Прохладный климат  
- 📸 Панорамы острова

## Структура комплекса

- 🚞 Фуникулёр  
- 🔭 Смотровые площадки  
- 🚶 Прогулки по тропам

## Билеты и посещение

- 💰 ~30 MYR  
- 🎟️ Билеты на фуникулёр  
- 🆓 —

## Лучшие точки для фото

- 📷 Вид на остров  
- 📷 Фуникулёр  
- 🌅 Закат

## Практическая информация

- **Адрес:** Penang Hill  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси  
- 🚌 Автобус до нижней станции  
- 🗺️ Запад Джорджтауна

## Полезные нюансы

- ⚠️ Очереди в выходные  
- 🌞 Лучше утром  
- 👕 Лёгкая куртка  
- 🐾 —

## Локальная ценность

Penang Hill — важная природная зона и популярное место отдыха горожан.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛕 Kek Lok Si Temple
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'png-kek-lok-si-temple',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самый большой храм страны  
- 🌍 Центр буддийской культуры  
- 📸 Пагоды и скульптуры

## Структура комплекса

- 🛕 Пагоды  
- 🗿 Статую Гуань Инь  
- 🚶 Территорию комплекса

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Подъём к статуе — платно  
- 🆓 Основная территория

## Лучшие точки для фото

- 📷 Пагоды  
- 📷 Статую  
- 🌅 Вид сверху

## Практическая информация

- **Адрес:** Air Itam, Penang  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси  
- 🚌 Автобус  
- 🗺️ Район Air Itam

## Полезные нюансы

- ⚠️ Много ступеней  
- 🌞 Лучше утром  
- 👕 Скромная одежда  
- 🐾 —

## Локальная ценность

Храм — духовный центр китайской общины Пенанга.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏛️ Cheong Fatt Tze – Blue Mansion
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'png-cheong-fatt-tze-blue-mansion',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Икона архитектуры Пенанга  
- 🌍 История китайской диаспоры  
- 📸 Голубые фасады

## Структура комплекса

- 🏛 Интерьеры  
- 🎥 Экскурсию  
- 📷 Детали архитектуры

## Билеты и посещение

- 💰 ~25 MYR  
- 🎟️ Экскурсия обязательна  
- 🆓 —

## Лучшие точки для фото

- 📷 Фасад  
- 📷 Двор  
- 🌅 Свет в окнах

## Практическая информация

- **Адрес:** Leith St, George Town  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком по Джорджтауну  
- 🚕 Такси  
- 🗺️ Старый город

## Полезные нюансы

- ⚠️ Вход только с туром  
- 🌞 Лучше днём  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Особняк сохраняет культурное наследие и историю многонационального Пенанга.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🎨 Penang Street Art
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'png-penang-street-art',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самый известный стрит-арт в Малайзии  
- 🌍 Современная городская культура  
- 📸 Интерактивные картины

## Структура комплекса

- 🎨 Рисунки  
- 🚶 Прогулку по Armenian Street  
- 📷 Фото с арт-объектами

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободный доступ

## Лучшие точки для фото

- 📷 Интерактивные сцены  
- 📷 Улицу  
- 🌅 Утренний свет

## Практическая информация

- **Адрес:** Armenian Street, Penang  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком  
- 🚕 Такси  
- 🗺️ George Town

## Полезные нюансы

- ⚠️ Много туристов  
- 🌞 Лучше утром  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Стрит-арт стал драйвером нового туристического интереса к историческому центру.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏘 Clan Jetties of Penang
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'png-clan-jetties-of-penang',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Уникальный тип поселений  
- 🌍 Живое культурное наследие  
- 📸 Дома над водой

## Структура комплекса

- 🏘 Chew Jetty  
- 🚶 Прогулку по настилам  
- 📷 Фото над морем

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободный доступ

## Лучшие точки для фото

- 📷 Дома на сваях  
- 📷 Настилы  
- 🌅 Вид на залив

## Практическая информация

- **Адрес:** Weld Quay, Penang  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком  
- 🚕 Такси  
- 🗺️ Восток George Town

## Полезные нюансы

- ⚠️ Уважайте жителей  
- 🌞 Лучше днём  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Джетти сохраняют уникальный образ жизни китайских общин Пенанга.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍜 Gurney Drive Hawker Centre
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'png-gurney-drive-hawker-centre',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍜 Char Kway Teow  
- 🍲 Assam Laksa  
- 🍤 Морепродукты

## Как добраться

- 🚕 Такси / Grab  
- 🚌 Автобус  
- 🗺️ Gurney Drive

## Полезные нюансы

- ⚠️ Многолюдно вечером  
- 🌞 Приходить голодным  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Фудкорт поддерживает малый бизнес и гастрономическую идентичность Пенанга.

## Лучшие точки для фото

- 📷 Гриль  
- 📷 Еду  
- 🌅 Ночной рынок

## Практическая информация

- **Адрес:** Gurney Drive  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучшая street food сцена Малайзии  
- 🌍 Кулинарный символ Пенанга  
- 📸 Гриль, дым и ночная жизнь

## Билеты и посещение

- 💰 Бюджет–средний  
- 🎟️ —  
- 🆓 Вход свободный
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏯 China House
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'png-china-house',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍰 Торты  
- ☕ Кофе  
- 🎨 Галереи

## Как добраться

- 🚶 Пешком по George Town  
- 🚕 Такси  
- 🗺️ Старый город

## Полезные нюансы

- ⚠️ Многолюдно вечером  
- 🌞 Подходит днём и вечером  
- 👕 Casual chic  
- 🐾 —

## Локальная ценность

China House поддерживает креативную сцену и арт-сообщество Пенанга.

## Лучшие точки для фото

- 📷 Витрину тортов  
- 📷 Интерьеры  
- 🌅 Атмосферу вечером

## Практическая информация

- **Адрес:** Beach St, George Town  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Самое необычное кафе Пенанга  
- 🌍 Искусство + еда  
- 📸 Интерьеры и витрина тортов

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ —  
- 🆓 —
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍽️ Tek Sen Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'png-tek-sen-restaurant',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽 Curry Kapitan  
- 🍲 Braised pork  
- 🍚 Домашние блюда

## Как добраться

- 🚶 Пешком  
- 🚕 Такси  
- 🗺️ Старый город

## Полезные нюансы

- ⚠️ Нет бронирования  
- 🌞 Лучше приходить рано  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Ресторан сохраняет перанаканское кулинарное наследие Пенанга.

## Лучшие точки для фото

- 📷 Блюда  
- 📷 Интерьер  
- 🌅 Атмосферу

## Практическая информация

- **Адрес:** Carnarvon St, George Town  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Легенда перанаканской кухни  
- 🌍 Исторические рецепты  
- 📸 Аутентичная подача

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ Очереди вечером  
- 🆓 —
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌃 The Top Komtar Sky Dining
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'png-the-top-komtar-sky-dining',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽 Ужин с лучшим видом на город  
- 🍹 Коктейль на закате  
- 🔭 Панораму George Town с высоты

## Как добраться

- 🚶 Пешком из центра George Town  
- 🚕 Такси / Grab  
- 🚌 Автобусы до Komtar  
- 🗺️ Ориентир: Komtar Tower (центр города)

## Полезные нюансы

- ⚠️ На закате бывает очередь/полная посадка  
- 🌞 Лучшее время — закат и вечер  
- 👕 Smart casual (желательно)  
- 🐾 —

## Локальная ценность

Komtar и его смотровые пространства — важный городской якорь, поддерживающий туризм и городские сервисы.

## Лучшие точки для фото

- 📷 Панораму George Town  
- 📷 Ночной город сверху  
- 🌅 Закат над проливом

## Практическая информация

- **Адрес:** Komtar Tower, George Town, Penang  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Ужин с лучшим видом на город  
- 🌍 Современный символ Пенанга и Komtar Tower  
- 📸 Панорамы, особенно на закате и ночью

## Билеты и посещение

- 💰 Средний–высокий чек (💵💵 – 💎)  
- 🎟️ Бронирование желательно, особенно на закат  
- 🆓 Вход свободный при заказе (условия зависят от формата зоны)
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏮 Jawi House Café Gallery
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'png-jawi-house-cafe-gallery',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽 Блюда Jawi Peranakan (мягкие специи, насыщенные соусы)  
- 🍛 Карри/тушёные блюда по местным рецептам  
- 🍹 Чай/напитки к десертам

## Как добраться

- 🚶 Пешком по George Town  
- 🚕 Такси / Grab  
- 🗺️ Старый город, рядом с основными улицами UNESCO-квартала

## Полезные нюансы

- ⚠️ Популярно в обед и вечером  
- 🌞 Лучше днём (спокойнее) или на ужин (атмосфернее)  
- 👕 Casual / casual chic  
- 🐾 —

## Локальная ценность

Такие места сохраняют уникальную гибридную культуру Пенанга — смешение малайских, китайских и перанаканских традиций.

## Лучшие точки для фото

- 📷 Интерьер исторического дома  
- 📷 Подачу блюд  
- 🌅 Вечерний свет в зале

## Практическая информация

- **Адрес:** George Town, Penang  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Яркий местный гастро-стиль (Jawi Peranakan)  
- 🌍 История и культура в одном месте  
- 📸 Интерьеры и подача блюд в колониальной атмосфере

## Билеты и посещение

- 💰 Средний чек (💵💵)  
- 🎟️ Бронирование желательно вечером  
- 🆓 —
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();
