-- Places UPSERT (idempotent)
-- Generated from Atlas Content Canon v1 markdown files

-- Place: 🏛️ Grand Palace (Bangkok)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'bkk-grand-palace',
  'th',
  'bkk',
  '🏛️ Grand Palace',
  'bkk-grand-palace',
  'attraction',
  'showplace',
  'attraction',
  '["attraction","bangkok","heritage","must-see"]'::jsonb,
  'Главный исторический и культурный символ Таиланда — королевский дворцовый комплекс с храмом Изумрудного Будды и роскошной архитектурой эпохи Раттанакосин.',
  13.75,
  100.4913,
  'Na Phra Lan Rd, Phra Nakhon',
  'https://www.royalgrandpalace.th',
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

-- Place: 🛕 Wat Arun (Bangkok)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'bkk-wat-arun',
  'th',
  'bkk',
  '🛕 Wat Arun',
  'bkk-wat-arun',
  'attraction',
  'showplace',
  'attraction',
  '["attraction","bangkok","must-see","temple"]'::jsonb,
  'Один из самых узнаваемых храмов Бангкока, расположенный на западном берегу реки Чао Прайя и знаменитый своим силуэтом на закате.',
  13.7437,
  100.4889,
  'по координатам (уточняется)',
  NULL,
  '—',
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

-- Place: 🛕 Wat Pho (Bangkok)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'bkk-wat-pho',
  'th',
  'bkk',
  '🛕 Wat Pho',
  'bkk-wat-pho',
  'attraction',
  'showplace',
  'attraction',
  '["attraction","bangkok","must-see","temple"]'::jsonb,
  'Один из старейших храмов Таиланда, известный гигантской статуей Лежащего Будды и школой традиционного тайского массажа.',
  13.7467,
  100.493,
  'по координатам (уточняется)',
  NULL,
  '—',
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

-- Place: 🛍️ Chatuchak Weekend Market (Bangkok)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'bkk-chatuchak-weekend-market',
  'th',
  'bkk',
  '🛍️ Chatuchak Weekend Market',
  'bkk-chatuchak-weekend-market',
  'attraction',
  'showplace',
  'attraction',
  '["attraction","bangkok","market","must-see"]'::jsonb,
  'Крупнейший рынок Юго-Восточной Азии с тысячами лавок, уличной едой и атмосферой настоящего Бангкока.',
  13.7999,
  100.55,
  'по координатам (уточняется)',
  NULL,
  '—',
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

-- Place: 🏮 Chinatown (Bangkok)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'bkk-chinatown',
  'th',
  'bkk',
  '🏮 Chinatown',
  'bkk-chinatown',
  'attraction',
  'showplace',
  'attraction',
  '["attraction","bangkok","food","must-see"]'::jsonb,
  'Один из самых колоритных районов города, известный уличной едой, храмами и неоновыми вывесками.',
  13.7392,
  100.5126,
  'по координатам (уточняется)',
  NULL,
  '—',
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

-- Place: 🍜 Jay Fai (Bangkok)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'bkk-jay-fai',
  'th',
  'bkk',
  '🍜 Jay Fai',
  'bkk-jay-fai',
  'bangkok',
  'business',
  'bangkok',
  '["bangkok","food","local"]'::jsonb,
  'Легендарное уличное заведение с Michelin Star, известное своим крабовым омлетом.',
  13.7536,
  100.5055,
  'по координатам (уточняется)',
  NULL,
  '—',
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

-- Place: 🍽️ Blue Elephant Bangkok (Bangkok)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'bkk-blue-elephant-bangkok',
  'th',
  'bkk',
  '🍽️ Blue Elephant Bangkok',
  'bkk-blue-elephant-bangkok',
  'bangkok',
  'business',
  'bangkok',
  '["bangkok","food","local"]'::jsonb,
  'Ресторан высокой тайской кухни в историческом особняке, сочетающий традиции и современную подачу.',
  13.7265,
  100.5347,
  'по координатам (уточняется)',
  NULL,
  '—',
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

-- Place: 🌃 Vertigo & Moon Bar (Bangkok)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'bkk-vertigo-moon-bar',
  'th',
  'bkk',
  '🌃 Vertigo & Moon Bar',
  'bkk-vertigo-moon-bar',
  'bangkok',
  'business',
  'bangkok',
  '["bangkok","bar","food","local"]'::jsonb,
  'Ресторан и бар на крыше с панорамным видом на Бангкок.',
  13.7244,
  100.537,
  'по координатам (уточняется)',
  NULL,
  '—',
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

-- Place: 🛍️ ICONSIAM (Bangkok)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'bkk-iconsiam',
  'th',
  'bkk',
  '🛍️ ICONSIAM',
  'bkk-iconsiam',
  'attraction',
  'showplace',
  'attraction',
  '["attraction","bangkok","must-see"]'::jsonb,
  'Современный торгово-культурный комплекс на берегу реки с музеями, магазинами и ресторанами.',
  13.726,
  100.5105,
  'по координатам (уточняется)',
  NULL,
  '—',
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

-- Place: 🌃 Asiatique The Riverfront (Bangkok)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'bkk-asiatique-the-riverfront',
  'th',
  'bkk',
  '🌃 Asiatique The Riverfront',
  'bkk-asiatique-the-riverfront',
  'attraction',
  'showplace',
  'attraction',
  '["attraction","bangkok","must-see"]'::jsonb,
  'Ночной рынок и развлекательная зона у реки с колесом обозрения и ресторанами.',
  13.7056,
  100.5038,
  'по координатам (уточняется)',
  NULL,
  '—',
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

-- Place: 🍜 Thipsamai Pad Thai (Bangkok)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'bkk-thipsamai-pad-thai',
  'th',
  'bkk',
  '🍜 Thipsamai Pad Thai',
  'bkk-thipsamai-pad-thai',
  'bangkok',
  'business',
  'bangkok',
  '["bangkok","food","local"]'::jsonb,
  'Один из самых известных ресторанов пад-тай в мире.',
  13.746,
  100.5015,
  'по координатам (уточняется)',
  NULL,
  '—',
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

-- Place: 🌃 Sirocco Sky Bar (Bangkok)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'bkk-sirocco-sky-bar',
  'th',
  'bkk',
  '🌃 Sirocco Sky Bar',
  'bkk-sirocco-sky-bar',
  'bangkok',
  'business',
  'bangkok',
  '["bangkok","bar","food","local"]'::jsonb,
  'Знаменитый бар на крыше, известный по фильму «Мальчишник 2».',
  13.7216,
  100.5149,
  'по координатам (уточняется)',
  NULL,
  '—',
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

-- Place: 🛕 Wat Phra That Doi Suthep (Chiang Mai)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'cnx-wat-phra-that-doi-suthep',
  'th',
  'cnx',
  '🛕 Wat Phra That Doi Suthep',
  'cnx-wat-phra-that-doi-suthep',
  'attraction',
  'showplace',
  'attraction',
  '["attraction","chiang-mai","must-see","temple"]'::jsonb,
  'Священный буддийский храм на вершине горы Дойсутхеп с панорамным видом на Чиангмай — главный духовный символ северного Таиланда.',
  18.8048,
  98.9217,
  'Suthep, Chiang Mai',
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

-- Place: 🏯 Wat Chedi Luang (Chiang Mai)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'cnx-wat-chedi-luang',
  'th',
  'cnx',
  '🏯 Wat Chedi Luang',
  'cnx-wat-chedi-luang',
  'attraction',
  'showplace',
  'attraction',
  '["attraction","chiang-mai","must-see","temple"]'::jsonb,
  'Древний храм в Старом городе с массивной разрушенной чеди — сердце исторического Чиангмая.',
  18.7877,
  98.9869,
  'по координатам (уточняется)',
  NULL,
  '—',
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

-- Place: 🏘️ Old City (Chiang Mai)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'cnx-old-city',
  'th',
  'cnx',
  '🏘️ Old City',
  'cnx-old-city',
  'attraction',
  'showplace',
  'attraction',
  '["attraction","chiang-mai","heritage","must-see"]'::jsonb,
  'Исторический центр Чиангмая, окружённый древними стенами и рвами, с десятками храмов и уютных улиц.',
  18.787,
  98.985,
  'по координатам (уточняется)',
  NULL,
  '—',
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

-- Place: 🌲 Doi Inthanon National Park (Chiang Mai)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'cnx-doi-inthanon-national-park',
  'th',
  'cnx',
  '🌲 Doi Inthanon National Park',
  'cnx-doi-inthanon-national-park',
  'attraction',
  'showplace',
  'attraction',
  '["attraction","chiang-mai","must-see","nature"]'::jsonb,
  'Национальный парк с самой высокой точкой Таиланда, водопадами и тропическими лесами.',
  18.5886,
  98.4867,
  'по координатам (уточняется)',
  NULL,
  '—',
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

-- Place: 🐘 Elephant Nature Park (Chiang Mai)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'cnx-elephant-nature-park',
  'th',
  'cnx',
  '🐘 Elephant Nature Park',
  'cnx-elephant-nature-park',
  'attraction',
  'showplace',
  'attraction',
  '["attraction","chiang-mai","must-see","nature"]'::jsonb,
  'Этичный приют для спасённых слонов, ориентированный на наблюдение и защиту животных без катания.',
  18.8647,
  98.8611,
  'по координатам (уточняется)',
  NULL,
  '—',
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

-- Place: 🌃 Sunday Walking Street Market (Chiang Mai)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'cnx-sunday-walking-street-market',
  'th',
  'cnx',
  '🌃 Sunday Walking Street Market',
  'cnx-sunday-walking-street-market',
  'attraction',
  'showplace',
  'attraction',
  '["attraction","chiang-mai","market","must-see"]'::jsonb,
  'Вечерний рынок по воскресеньям с уличной едой, ремёслами и живой музыкой.',
  18.7879,
  98.987,
  'по координатам (уточняется)',
  NULL,
  '—',
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

-- Place: 🛍️ Nimmanhaemin Road (Chiang Mai)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'cnx-nimmanhaemin-road',
  'th',
  'cnx',
  '🛍️ Nimmanhaemin Road',
  'cnx-nimmanhaemin-road',
  'attraction',
  'showplace',
  'attraction',
  '["attraction","chiang-mai","must-see"]'::jsonb,
  'Современный район с кафе, галереями и коворкингами — центр digital-nomad сцены.',
  18.7985,
  98.9687,
  'по координатам (уточняется)',
  NULL,
  '—',
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

-- Place: 🍜 Khao Soi Khun Yai (Chiang Mai)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'cnx-khao-soi-khun-yai',
  'th',
  'cnx',
  '🍜 Khao Soi Khun Yai',
  'cnx-khao-soi-khun-yai',
  'chiang-mai',
  'business',
  'chiang-mai',
  '["chiang-mai","food","local"]'::jsonb,
  'Легендарное заведение, специализирующееся на северном карри-супе кхао сои.',
  18.7897,
  98.9812,
  'по координатам (уточняется)',
  NULL,
  '—',
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

-- Place: ☕ Graph Café (Chiang Mai)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'cnx-graph-cafe',
  'th',
  'cnx',
  '☕ Graph Café',
  'cnx-graph-cafe',
  'chiang-mai',
  'business',
  'chiang-mai',
  '["chiang-mai","cafe","food","local"]'::jsonb,
  'Минималистичное кафе с экспериментальным подходом к спешелти-кофе.',
  18.7883,
  98.9867,
  'по координатам (уточняется)',
  NULL,
  '—',
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

-- Place: 🖼️ Woo Café & Art Gallery (Chiang Mai)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'cnx-woo-cafe-art-gallery',
  'th',
  'cnx',
  '🖼️ Woo Café & Art Gallery',
  'cnx-woo-cafe-art-gallery',
  'chiang-mai',
  'business',
  'chiang-mai',
  '["chiang-mai","cafe","food","local"]'::jsonb,
  'Кафе-галерея в колониальном особняке с искусством и северной кухней.',
  18.7944,
  98.9926,
  'по координатам (уточняется)',
  NULL,
  '—',
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

-- Place: 🍷 The Riverside Bar & Restaurant (Chiang Mai)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'cnx-the-riverside-bar-restaurant',
  'th',
  'cnx',
  '🍷 The Riverside Bar & Restaurant',
  'cnx-the-riverside-bar-restaurant',
  'chiang-mai',
  'business',
  'chiang-mai',
  '["chiang-mai","bar","food","local","restaurant"]'::jsonb,
  'Ресторан и бар у реки Пинг с живой музыкой.',
  18.8012,
  98.9977,
  'по координатам (уточняется)',
  NULL,
  '—',
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

-- Place: 🍲 Dash! Restaurant (Chiang Mai)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'cnx-dash-restaurant',
  'th',
  'cnx',
  '🍲 Dash! Restaurant',
  'cnx-dash-restaurant',
  'chiang-mai',
  'business',
  'chiang-mai',
  '["chiang-mai","bar","food","local","restaurant"]'::jsonb,
  'Ресторан северной тайской кухни в деревянном доме Старого города.',
  18.7874,
  98.9878,
  'по координатам (уточняется)',
  NULL,
  '—',
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

-- Place: 🥐 Fern Forest Café (Chiang Mai)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'cnx-fern-forest-cafe',
  'th',
  'cnx',
  '🥐 Fern Forest Café',
  'cnx-fern-forest-cafe',
  'chiang-mai',
  'business',
  'chiang-mai',
  '["chiang-mai","cafe","food","local"]'::jsonb,
  'Уютное кафе с завтраками и выпечкой в тени деревьев Старого города.',
  18.7871,
  98.9862,
  'по координатам (уточняется)',
  NULL,
  '—',
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

-- Place: 🏖️ Hua Hin Beach (Hua Hin)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hhn-hua-hin-beach',
  'th',
  'hhn',
  '🏖️ Hua Hin Beach',
  'hhn-hua-hin-beach',
  'beach',
  'showplace',
  'beach',
  '["beach","royal-resort","relaxed"]'::jsonb,
  'Главный пляж Хуахина — протяжённая песчаная полоса с спокойной атмосферой, популярная для прогулок, купания и отдыха.',
  12.5684,
  99.9577,
  'Hua Hin, Prachuap Khiri Khan',
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

-- Place: 🚉 Hua Hin Railway Station (Hua Hin)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hhn-hua-hin-railway-station',
  'th',
  'hhn',
  '🚉 Hua Hin Railway Station',
  'hhn-hua-hin-railway-station',
  'railway',
  'showplace',
  'railway',
  '["railway","heritage","landmark"]'::jsonb,
  'Одна из самых красивых и узнаваемых железнодорожных станций Таиланда с королевским павильоном.',
  12.5703,
  99.9571,
  'Hua Hin Railway Station',
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

-- Place: 🎨 Cicada Market (Hua Hin)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hhn-cicada-market',
  'th',
  'hhn',
  '🎨 Cicada Market',
  'hhn-cicada-market',
  'market',
  'showplace',
  'market',
  '["market","art","evening"]'::jsonb,
  'Творческий вечерний рынок с арт-лавками, уличной едой и живой музыкой.',
  12.5386,
  99.9603,
  'Cicada Market, Hua Hin',
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

-- Place: 🐒 Khao Takiab (Hua Hin)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hhn-khao-takiab',
  'th',
  'hhn',
  '🐒 Khao Takiab',
  'hhn-khao-takiab',
  'temple',
  'showplace',
  'temple',
  '["temple","viewpoint","monkeys"]'::jsonb,
  'Холм с храмом и смотровыми площадками, известный обезьянами и видом на побережье.',
  12.5288,
  99.9723,
  'Khao Takiab, Hua Hin',
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

-- Place: 🕳️ Phraya Nakhon Cave (Hua Hin)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hhn-phraya-nakhon-cave',
  'th',
  'hhn',
  '🕳️ Phraya Nakhon Cave',
  'hhn-phraya-nakhon-cave',
  'cave',
  'showplace',
  'cave',
  '["cave","heritage","nature"]'::jsonb,
  'Уникальная пещера с королевским павильоном, освещаемым солнечным лучом.',
  12.3773,
  99.9497,
  'Sam Roi Yot NP',
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

-- Place: 💦 Vana Nava Water Jungle (Hua Hin)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hhn-vana-nava-water-jungle',
  'th',
  'hhn',
  '💦 Vana Nava Water Jungle',
  'hhn-vana-nava-water-jungle',
  'waterpark',
  'showplace',
  'waterpark',
  '["waterpark","family","entertainment"]'::jsonb,
  'Современный аквапарк с горками, бассейнами и зонами отдыха.',
  12.5419,
  99.9606,
  'Hua Hin',
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

-- Place: 🍹 Let’s Sea Bar (Hua Hin)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hhn-let-s-sea-bar',
  'th',
  'hhn',
  '🍹 Let’s Sea Bar',
  'hhn-let-s-sea-bar',
  'bar',
  'business',
  'bar',
  '["bar","beach","sunset"]'::jsonb,
  'Пляжный бар с коктейлями и расслабленной атмосферой у моря.',
  12.5281,
  99.9734,
  'Khao Takiab, Hua Hin',
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

-- Place: 🍽️ Baan Itsara Restaurant (Hua Hin)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hhn-baan-itsara-restaurant',
  'th',
  'hhn',
  '🍽️ Baan Itsara Restaurant',
  'hhn-baan-itsara-restaurant',
  'thai-food',
  'business',
  'thai-food',
  '["thai-food","heritage","sea"]'::jsonb,
  'Исторический ресторан тайской кухни в деревянном доме у моря.',
  12.5687,
  99.9584,
  'Hua Hin Beach',
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

-- Place: 🏖️ Railay Beach (Krabi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'kbi-railay-beach',
  'th',
  'kbi',
  '🏖️ Railay Beach',
  'kbi-railay-beach',
  'beach',
  'showplace',
  'beach',
  '["beach","cliffs","sea"]'::jsonb,
  'Живописный полуостров с белоснежными пляжами и известняковыми скалами, доступный только по воде — визитная карточка Краби.',
  8.005,
  98.8389,
  'Railay, Krabi',
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

-- Place: 🏖️ Ao Nang Beach (Krabi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'kbi-ao-nang-beach',
  'th',
  'kbi',
  '🏖️ Ao Nang Beach',
  'kbi-ao-nang-beach',
  'beach',
  'showplace',
  'beach',
  '["beach","resort","tours"]'::jsonb,
  'Главный курортный пляж Краби с развитой инфраструктурой, отелями и лодочными экскурсиями.',
  8.034,
  98.8228,
  'Ao Nang, Krabi',
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

-- Place: 🏝️ Phi Phi Islands (Krabi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'kbi-phi-phi-islands',
  'th',
  'kbi',
  '🏝️ Phi Phi Islands',
  'kbi-phi-phi-islands',
  'islands',
  'showplace',
  'islands',
  '["islands","sea","excursion"]'::jsonb,
  'Архипелаг островов с белыми пляжами и бирюзовой водой — популярная морская экскурсия из Краби.',
  7.7407,
  98.7784,
  'Phi Phi Islands, Krabi',
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

-- Place: 💚 Emerald Pool (Krabi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'kbi-emerald-pool',
  'th',
  'kbi',
  '💚 Emerald Pool',
  'kbi-emerald-pool',
  'nature',
  'showplace',
  'nature',
  '["nature","pool","jungle"]'::jsonb,
  'Природный изумрудный бассейн в тропическом лесу, популярное место для купания.',
  7.921,
  99.2364,
  'Khao Phra Bang Khram Nature Reserve, Krabi',
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

-- Place: 🐯 Tiger Cave Temple (Krabi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'kbi-tiger-cave-temple',
  'th',
  'kbi',
  '🐯 Tiger Cave Temple',
  'kbi-tiger-cave-temple',
  'temple',
  'showplace',
  'temple',
  '["temple","viewpoint","stairs"]'::jsonb,
  'Буддийский храм на вершине холма, известный подъёмом из более чем 1200 ступеней.',
  8.129,
  98.918,
  'Wat Tham Suea, Krabi',
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

-- Place: 🏝️ Hong Islands (Krabi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'kbi-hong-islands',
  'th',
  'kbi',
  '🏝️ Hong Islands',
  'kbi-hong-islands',
  'islands',
  'showplace',
  'islands',
  '["islands","lagoon","snorkeling"]'::jsonb,
  'Группа островов с лагунами и пляжами, популярная для однодневных туров.',
  8.0694,
  98.6796,
  'Hong Islands, Krabi',
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

-- Place: 🏔️ Khao Khanab Nam (Krabi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'kbi-khao-khanab-nam',
  'th',
  'kbi',
  '🏔️ Khao Khanab Nam',
  'kbi-khao-khanab-nam',
  'landmark',
  'showplace',
  'landmark',
  '["landmark","cliffs","river"]'::jsonb,
  'Две известняковые скалы у реки — символ города Краби.',
  8.07,
  98.911,
  'Krabi Town, Krabi',
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

-- Place: 🍽️ The Grotto Restaurant (Krabi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'kbi-the-grotto-restaurant',
  'th',
  'kbi',
  '🍽️ The Grotto Restaurant',
  'kbi-the-grotto-restaurant',
  'restaurant',
  'business',
  'restaurant',
  '["restaurant","cave","romantic"]'::jsonb,
  'Ресторан в пещере на пляже Railay с романтической атмосферой и видом на море.',
  8.007,
  98.8375,
  'Railay Beach, Krabi',
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

-- Place: 🏖️ Patong Beach (Phuket)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'phk-patong-beach',
  'th',
  'phk',
  '🏖️ Patong Beach',
  'phk-patong-beach',
  'beach',
  'showplace',
  'beach',
  '["beach","nightlife","resort"]'::jsonb,
  'Самый известный пляж Пхукета и центр курортной жизни острова с развитой инфраструктурой, водными развлечениями и активной ночной жизнью.',
  7.8965,
  98.2967,
  'Patong, Kathu District',
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

-- Place: 🗿 Big Buddha Phuket (Phuket)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'phk-big-buddha-phuket',
  'th',
  'phk',
  '🗿 Big Buddha Phuket',
  'phk-big-buddha-phuket',
  'temple',
  'showplace',
  'temple',
  '["temple","viewpoint","landmark"]'::jsonb,
  'Огромная статуя Будды на вершине холма с панорамным видом на южный Пхукет.',
  7.8276,
  98.3122,
  'Chalong, Phuket',
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

-- Place: 🌅 Promthep Cape (Phuket)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'phk-promthep-cape',
  'th',
  'phk',
  '🌅 Promthep Cape',
  'phk-promthep-cape',
  'viewpoint',
  'showplace',
  'viewpoint',
  '["viewpoint","sunset","nature"]'::jsonb,
  'Самая популярная смотровая площадка Пхукета, известная своими закатами над Андаманским морем.',
  7.758,
  98.303,
  'Rawai, Phuket',
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

-- Place: 🏘️ Old Phuket Town (Phuket)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'phk-old-phuket-town',
  'th',
  'phk',
  '🏘️ Old Phuket Town',
  'phk-old-phuket-town',
  'old-town',
  'showplace',
  'old-town',
  '["old-town","heritage","walking"]'::jsonb,
  'Исторический центр Пхукета с китайско-португальской архитектурой, музеями и атмосферными улицами.',
  7.884,
  98.3923,
  'Phuket Town',
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

-- Place: 🏝️ Phi Phi Islands (Phuket)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'phk-phi-phi-islands',
  'th',
  'phk',
  '🏝️ Phi Phi Islands',
  'phk-phi-phi-islands',
  'islands',
  'showplace',
  'islands',
  '["islands","sea","excursion"]'::jsonb,
  'Архипелаг островов с белыми пляжами и бирюзовой водой — одна из самых популярных экскурсий с Пхукета.',
  7.7407,
  98.7784,
  'Pier Phuket',
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

-- Place: 🍽️ Blue Elephant Phuket (Phuket)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'phk-blue-elephant-phuket',
  'th',
  'phk',
  '🍽️ Blue Elephant Phuket',
  'phk-blue-elephant-phuket',
  'thai-food',
  'business',
  'thai-food',
  '["thai-food","fine-dining","heritage"]'::jsonb,
  'Ресторан высокой тайской кухни в историческом особняке Старого города.',
  7.884,
  98.3923,
  'Phuket Town',
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

-- Place: 🍜 Raya Restaurant (Phuket)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'phk-raya-restaurant',
  'th',
  'phk',
  '🍜 Raya Restaurant',
  'phk-raya-restaurant',
  'local-food',
  'business',
  'local-food',
  '["local-food","thai","heritage"]'::jsonb,
  'Один из лучших ресторанов аутентичной пхукетской кухни с семейными рецептами.',
  7.8827,
  98.3929,
  'Phuket Town',
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

-- Place: 🦞 Kan Eang@Pier (Phuket)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'phk-kan-eang-pier',
  'th',
  'phk',
  '🦞 Kan Eang@Pier',
  'phk-kan-eang-pier',
  'seafood',
  'business',
  'seafood',
  '["seafood","pier","view"]'::jsonb,
  'Ресторан морепродуктов у пирса с видом на залив Чалонг.',
  7.8286,
  98.3303,
  'Chalong, Phuket',
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

-- Place: 🌿 Three Monkeys Restaurant (Phuket)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'phk-three-monkeys-restaurant',
  'th',
  'phk',
  '🌿 Three Monkeys Restaurant',
  'phk-three-monkeys-restaurant',
  'restaurant',
  'business',
  'restaurant',
  '["restaurant","jungle","view","design"]'::jsonb,
  'Ресторан в тропическом лесу Пхукета с эффектной архитектурой, террасами среди деревьев и панорамным видом на город.',
  7.8913,
  98.3517,
  'Ratsada, Phuket',
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

-- Place: ☕ Café Phuket Viewpoint (Phuket)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'phk-cafe-phuket-viewpoint',
  'th',
  'phk',
  '☕ Café Phuket Viewpoint',
  'phk-cafe-phuket-viewpoint',
  'cafe',
  'business',
  'cafe',
  '["cafe","viewpoint","ocean"]'::jsonb,
  'Кафе на смотровой площадке с панорамным видом на пляжи Карон и Ката — популярное место для фото и кофе с видом.',
  7.7924,
  98.3059,
  'Viewpoint Karon – Kata',
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

-- Place: 🍷 Baan Rim Pa (Phuket)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'phk-baan-rim-pa',
  'th',
  'phk',
  '🍷 Baan Rim Pa',
  'phk-baan-rim-pa',
  'fine-dining',
  'business',
  'fine-dining',
  '["fine-dining","sunset","jazz","premium"]'::jsonb,
  'Ресторан премиум-класса над заливом Патонг с тайской и интернациональной кухней, романтической атмосферой и живым джазом.',
  7.8969,
  98.2926,
  'Kalim Bay, Patong',
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

-- Place: 🍲 No.6 Restaurant (Phuket)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'phk-no-6-restaurant',
  'th',
  'phk',
  '🍲 No.6 Restaurant',
  'phk-no-6-restaurant',
  'budget',
  'business',
  'budget',
  '["budget","thai-food","local"]'::jsonb,
  'Небольшой уютный ресторан тайской кухни с доступными ценами, скрытый во дворе Старого города Пхукета.',
  7.8839,
  98.3895,
  'Phuket Town',
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

-- Place: 🏖️ Pattaya Beach (Pattaya)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'pty-pattaya-beach',
  'th',
  'pty',
  '🏖️ Pattaya Beach',
  'pty-pattaya-beach',
  'beach',
  'showplace',
  'beach',
  '["beach","city","resort"]'::jsonb,
  'Центральный городской пляж Паттайи с набережной, отелями, кафе и активной курортной жизнью.',
  12.9334,
  100.883,
  'Beach Rd, Pattaya',
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

-- Place: 🌃 Walking Street (Pattaya)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'pty-walking-street',
  'th',
  'pty',
  '🌃 Walking Street',
  'pty-walking-street',
  'nightlife',
  'showplace',
  'nightlife',
  '["nightlife","bars","clubs"]'::jsonb,
  'Знаменитая улица ночной жизни Паттайи с клубами, барами и шоу.',
  12.9279,
  100.8745,
  'Walking St, Pattaya',
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

-- Place: 🛕 Sanctuary of Truth (Pattaya)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'pty-sanctuary-of-truth',
  'th',
  'pty',
  '🛕 Sanctuary of Truth',
  'pty-sanctuary-of-truth',
  'temple',
  'showplace',
  'temple',
  '["temple","wood","culture"]'::jsonb,
  'Грандиозный деревянный храм-музей, построенный без единого гвоздя.',
  12.9597,
  100.8851,
  'Naklua, Pattaya',
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

-- Place: 🌸 Nong Nooch Tropical Garden (Pattaya)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'pty-nong-nooch-tropical-garden',
  'th',
  'pty',
  '🌸 Nong Nooch Tropical Garden',
  'pty-nong-nooch-tropical-garden',
  'garden',
  'showplace',
  'garden',
  '["garden","culture","nature"]'::jsonb,
  'Огромный тропический парк с садами, шоу и культурными представлениями.',
  12.7723,
  100.9286,
  'Na Jomtien',
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

-- Place: 🏖️ Jomtien Beach (Pattaya)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'pty-jomtien-beach',
  'th',
  'pty',
  '🏖️ Jomtien Beach',
  'pty-jomtien-beach',
  'beach',
  'showplace',
  'beach',
  '["beach","family","relaxed"]'::jsonb,
  'Более спокойный пляж к югу от Паттайи, популярный среди семей и длительных остановок.',
  12.882,
  100.8739,
  'Jomtien, Pattaya',
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

-- Place: 🗿 Big Buddha Hill (Pattaya)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'pty-big-buddha-hill',
  'th',
  'pty',
  '🗿 Big Buddha Hill',
  'pty-big-buddha-hill',
  'temple',
  'showplace',
  'temple',
  '["temple","viewpoint","landmark"]'::jsonb,
  'Холм с большой статуей Будды и панорамным видом на Паттайю.',
  12.9245,
  100.8715,
  'Pratumnak Hill, Pattaya',
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

-- Place: 🍹 Horizon Rooftop Bar (Pattaya)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'pty-horizon-rooftop-bar',
  'th',
  'pty',
  '🍹 Horizon Rooftop Bar',
  'pty-horizon-rooftop-bar',
  'rooftop',
  'business',
  'rooftop',
  '["rooftop","bar","view"]'::jsonb,
  'Руфтоп-бар с видом на Паттайю и Сиамский залив.',
  12.943,
  100.8857,
  'Pattaya',
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

-- Place: 🥂 The Glass House (Pattaya)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'pty-the-glass-house',
  'th',
  'pty',
  '🥂 The Glass House',
  'pty-the-glass-house',
  'restaurant',
  'business',
  'restaurant',
  '["restaurant","sea","romantic"]'::jsonb,
  'Ресторан у моря с тайской и интернациональной кухней и романтической атмосферой.',
  12.9007,
  100.8709,
  'Jomtien / South Pattaya',
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

-- Place: 🦐 Mum Aroi (Pattaya)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'pty-mum-aroi',
  'th',
  'pty',
  '🦐 Mum Aroi',
  'pty-mum-aroi',
  'seafood',
  'business',
  'seafood',
  '["seafood","local","thai-food"]'::jsonb,
  'Известный ресторан морепродуктов, популярный среди местных жителей.',
  12.9496,
  100.8843,
  'Pattaya',
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

-- Place: 🏖️ Chaweng Beach (Koh Samui)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'usm-chaweng-beach',
  'th',
  'usm',
  '🏖️ Chaweng Beach',
  'usm-chaweng-beach',
  'beach',
  'showplace',
  'beach',
  '["beach","resort","nightlife"]'::jsonb,
  'Самый популярный и развитый пляж Самуи с белым песком, прозрачной водой и насыщенной курортной жизнью.',
  9.531,
  100.0635,
  'Chaweng, Koh Samui',
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

-- Place: 🏖️ Lamai Beach (Koh Samui)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'usm-lamai-beach',
  'th',
  'usm',
  '🏖️ Lamai Beach',
  'usm-lamai-beach',
  'beach',
  'showplace',
  'beach',
  '["beach","relaxed","sea"]'::jsonb,
  'Второй по популярности пляж Самуи с более спокойной атмосферой и живописными видами.',
  9.4696,
  100.0455,
  'Lamai, Koh Samui',
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

-- Place: 🛕 Big Buddha Temple (Koh Samui)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'usm-big-buddha-temple',
  'th',
  'usm',
  '🛕 Big Buddha Temple',
  'usm-big-buddha-temple',
  'temple',
  'showplace',
  'temple',
  '["temple","landmark","culture"]'::jsonb,
  'Одна из главных святынь Самуи — 12-метровая статуя Будды на небольшом острове у северного побережья.',
  9.5724,
  100.0616,
  'Big Buddha, Koh Samui',
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

-- Place: 💦 Na Muang Waterfalls (Koh Samui)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'usm-na-muang-waterfalls',
  'th',
  'usm',
  '💦 Na Muang Waterfalls',
  'usm-na-muang-waterfalls',
  'waterfall',
  'showplace',
  'waterfall',
  '["waterfall","nature","jungle"]'::jsonb,
  'Два живописных водопада в центре острова, популярные для купания и прогулок.',
  9.4549,
  100.0096,
  'Na Muang, Koh Samui',
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

-- Place: 🌊 Fisherman’s Village (Koh Samui)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'usm-fisherman-s-village',
  'th',
  'usm',
  '🌊 Fisherman’s Village',
  'usm-fisherman-s-village',
  'village',
  'showplace',
  'village',
  '["village","walking","food"]'::jsonb,
  'Исторический район Бопхута с набережной, ресторанами и вечерним рынком.',
  9.5666,
  100.0307,
  'Bophut, Koh Samui',
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

-- Place: 🏝️ Ang Thong National Marine Park (Koh Samui)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'usm-ang-thong-national-marine-park',
  'th',
  'usm',
  '🏝️ Ang Thong National Marine Park',
  'usm-ang-thong-national-marine-park',
  'islands',
  'showplace',
  'islands',
  '["islands","marine-park","snorkeling"]'::jsonb,
  'Морской национальный парк из десятков островов с лагунами и смотровыми площадками.',
  9.74,
  99.68,
  'Ang Thong Marine Park',
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

-- Place: 🍹 Coco Tam’s (Koh Samui)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'usm-coco-tam-s',
  'th',
  'usm',
  '🍹 Coco Tam’s',
  'usm-coco-tam-s',
  'bar',
  'business',
  'bar',
  '["bar","beach","nightlife"]'::jsonb,
  'Популярный пляжный бар с коктейлями, огненными шоу и видом на море в районе Бопхут.',
  9.5669,
  100.0302,
  'Bophut, Koh Samui',
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

-- Place: 🍽️ Dining on the Rocks (Koh Samui)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'usm-dining-on-the-rocks',
  'th',
  'usm',
  '🍽️ Dining on the Rocks',
  'usm-dining-on-the-rocks',
  'fine-dining',
  'business',
  'fine-dining',
  '["fine-dining","view","premium"]'::jsonb,
  'Ресторан высокой кухни на скале с панорамным видом на Сиамский залив.',
  9.5721,
  100.0402,
  'Koh Samui',
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
