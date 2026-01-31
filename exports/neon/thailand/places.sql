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
  'Главный исторический и культурный символ Таиланда — королевский дворцовый комплекс с храмом Изумрудного Будды и роскошной архитектурой эпохи Раттанакосин. - 🕒 08:30–15:30 - 🌐 Тайский, английский - 📶 Интернет отсутствует - 💳 Наличные, карты',
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
  'Один из самых узнаваемых храмов Бангкока, расположенный на западном берегу реки Чао Прайя и знаменитый своим силуэтом на закате. - 🕒 Часы работы: уточняются - 🌐 Тайский, английский (в туристических местах) - 📶 Связь/интернет: как правило, стабильные - 💳 Оплата: наличные/карты (зависит от места)',
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
  'Один из старейших храмов Таиланда, известный гигантской статуей Лежащего Будды и школой традиционного тайского массажа. - 🕒 Часы работы: уточняются - 🌐 Тайский, английский (в туристических местах) - 📶 Связь/интернет: как правило, стабильные - 💳 Оплата: наличные/карты (зависит от места)',
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
  'Крупнейший рынок Юго-Восточной Азии с тысячами лавок, уличной едой и атмосферой настоящего Бангкока. - 🕒 Часы работы: уточняются - 🌐 Тайский, английский (в туристических местах) - 📶 Связь/интернет: как правило, стабильные - 💳 Оплата: наличные/карты (зависит от места)',
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
  'Один из самых колоритных районов города, известный уличной едой, храмами и неоновыми вывесками. - 🕒 Часы работы: уточняются - 🌐 Тайский, английский (в туристических местах) - 📶 Связь/интернет: как правило, стабильные - 💳 Оплата: наличные/карты (зависит от места)',
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
  'Легендарное уличное заведение с Michelin Star, известное своим крабовым омлетом. - 🕒 Часы работы: уточняются - 🌐 Тайский, английский (в туристических местах) - 📶 Связь/интернет: как правило, стабильные - 💳 Оплата: наличные/карты (зависит от места)',
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
  'Ресторан высокой тайской кухни в историческом особняке, сочетающий традиции и современную подачу. - 🕒 Часы работы: уточняются - 🌐 Тайский, английский (в туристических местах) - 📶 Связь/интернет: как правило, стабильные - 💳 Оплата: наличные/карты (зависит от места)',
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
  'Ресторан и бар на крыше с панорамным видом на Бангкок. - 🕒 Часы работы: уточняются - 🌐 Тайский, английский (в туристических местах) - 📶 Связь/интернет: как правило, стабильные - 💳 Оплата: наличные/карты (зависит от места)',
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
  'Современный торгово-культурный комплекс на берегу реки с музеями, магазинами и ресторанами. - 🕒 Часы работы: уточняются - 🌐 Тайский, английский (в туристических местах) - 📶 Связь/интернет: как правило, стабильные - 💳 Оплата: наличные/карты (зависит от места)',
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
  'Ночной рынок и развлекательная зона у реки с колесом обозрения и ресторанами. - 🕒 Часы работы: уточняются - 🌐 Тайский, английский (в туристических местах) - 📶 Связь/интернет: как правило, стабильные - 💳 Оплата: наличные/карты (зависит от места)',
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
  'Один из самых известных ресторанов пад-тай в мире. - 🕒 Часы работы: уточняются - 🌐 Тайский, английский (в туристических местах) - 📶 Связь/интернет: как правило, стабильные - 💳 Оплата: наличные/карты (зависит от места)',
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
  'Знаменитый бар на крыше, известный по фильму «Мальчишник 2». - 🕒 Часы работы: уточняются - 🌐 Тайский, английский (в туристических местах) - 📶 Связь/интернет: как правило, стабильные - 💳 Оплата: наличные/карты (зависит от места)',
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
  'Священный буддийский храм на вершине горы Дойсутхеп с панорамным видом на Чиангмай — главный духовный символ северного Таиланда. - 🕒 06:00–18:00 - 🌐 Тайский, английский - 📶 Связь ограниченная - 💳 Наличные',
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
  'Древний храм в Старом городе с массивной разрушенной чеди — сердце исторического Чиангмая. - 🕒 Часы работы: уточняются - 🌐 Тайский, английский (в туристических местах) - 📶 Связь/интернет: как правило, стабильные - 💳 Оплата: наличные/карты (зависит от места)',
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
  'Исторический центр Чиангмая, окружённый древними стенами и рвами, с десятками храмов и уютных улиц. - 🕒 Часы работы: уточняются - 🌐 Тайский, английский (в туристических местах) - 📶 Связь/интернет: как правило, стабильные - 💳 Оплата: наличные/карты (зависит от места)',
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
  'Национальный парк с самой высокой точкой Таиланда, водопадами и тропическими лесами. - 🕒 Часы работы: уточняются - 🌐 Тайский, английский (в туристических местах) - 📶 Связь/интернет: как правило, стабильные - 💳 Оплата: наличные/карты (зависит от места)',
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
  'Этичный приют для спасённых слонов, ориентированный на наблюдение и защиту животных без катания. - 🕒 Часы работы: уточняются - 🌐 Тайский, английский (в туристических местах) - 📶 Связь/интернет: как правило, стабильные - 💳 Оплата: наличные/карты (зависит от места)',
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
  'Вечерний рынок по воскресеньям с уличной едой, ремёслами и живой музыкой. - 🕒 Часы работы: уточняются - 🌐 Тайский, английский (в туристических местах) - 📶 Связь/интернет: как правило, стабильные - 💳 Оплата: наличные/карты (зависит от места)',
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
  'Современный район с кафе, галереями и коворкингами — центр digital-nomad сцены. - 🕒 Часы работы: уточняются - 🌐 Тайский, английский (в туристических местах) - 📶 Связь/интернет: как правило, стабильные - 💳 Оплата: наличные/карты (зависит от места)',
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
  'Легендарное заведение, специализирующееся на северном карри-супе кхао сои. - 🕒 Часы работы: уточняются - 🌐 Тайский, английский (в туристических местах) - 📶 Связь/интернет: как правило, стабильные - 💳 Оплата: наличные/карты (зависит от места)',
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
  'Минималистичное кафе с экспериментальным подходом к спешелти-кофе. - 🕒 Часы работы: уточняются - 🌐 Тайский, английский (в туристических местах) - 📶 Связь/интернет: как правило, стабильные - 💳 Оплата: наличные/карты (зависит от места)',
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
  'Кафе-галерея в колониальном особняке с искусством и северной кухней. - 🕒 Часы работы: уточняются - 🌐 Тайский, английский (в туристических местах) - 📶 Связь/интернет: как правило, стабильные - 💳 Оплата: наличные/карты (зависит от места)',
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
  'Ресторан и бар у реки Пинг с живой музыкой. - 🕒 Часы работы: уточняются - 🌐 Тайский, английский (в туристических местах) - 📶 Связь/интернет: как правило, стабильные - 💳 Оплата: наличные/карты (зависит от места)',
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
  'Ресторан северной тайской кухни в деревянном доме Старого города. - 🕒 Часы работы: уточняются - 🌐 Тайский, английский (в туристических местах) - 📶 Связь/интернет: как правило, стабильные - 💳 Оплата: наличные/карты (зависит от места)',
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
  'Уютное кафе с завтраками и выпечкой в тени деревьев Старого города. - 🕒 Часы работы: уточняются - 🌐 Тайский, английский (в туристических местах) - 📶 Связь/интернет: как правило, стабильные - 💳 Оплата: наличные/карты (зависит от места)',
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
  'Главный пляж Хуахина — протяжённая песчаная полоса с спокойной атмосферой, популярная для прогулок, купания и отдыха. - 🏖 Купание и пляжный отдых - 🚶 Длинную прогулку вдоль берега - 🌅 Закат над Сиамским заливом - 🕒 Круглосуточно - 🌐 Тайский, английский - 📶 Интернет стабильный - 💳 Наличные, карты',
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
  'Одна из самых красивых и узнаваемых железнодорожных станций Таиланда с королевским павильоном. - 🚉 Королевский павильон - 🚶 Прогулку по станции - 📷 Фотосъёмку поездов - 🕒 Круглосуточно - 🌐 Тайский, английский - 📶 Интернет ограничен - 💳 Наличные',
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
  'Творческий вечерний рынок с арт-лавками, уличной едой и живой музыкой. - 🛍 Арт-изделия - 🍽 Уличную еду - 🎶 Живые выступления - 🕒 Пт–Вс, вечер - 🌐 Тайский, английский - 📶 Интернет в зоне кафе - 💳 Наличные',
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
  'Холм с храмом и смотровыми площадками, известный обезьянами и видом на побережье. - 🛕 Храм - 🐒 Обезьян - 🔭 Смотровые площадки - 🕒 07:00–18:00 - 🌐 Тайский, английский - 📶 Связь стабильная - 💳 Наличные',
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
  'Уникальная пещера с королевским павильоном, освещаемым солнечным лучом. - 🏛 Королевский павильон - 🚶 Пеший маршрут к пещере - 🌿 Природу национального парка - 🕒 Днём - 🌐 Тайский, базовый английский - 📶 Связь слабая - 💳 Наличные',
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
  'Современный аквапарк с горками, бассейнами и зонами отдыха. - 💦 Водные горки - 🏊 Бассейны - 🎢 Аттракционы - 🕒 10:00–18:00 - 🌐 Тайский, английский - 📶 Интернет - 💳 Карты, наличные',
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
  'Пляжный бар с коктейлями и расслабленной атмосферой у моря. - 🍹 Коктейли - 🍽 Лёгкие закуски - 🌅 Закат - 🕒 16:00–23:00 - 🌐 Тайский, английский - 📶 Wi-Fi - 💳 Карты, наличные',
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
  'Исторический ресторан тайской кухни в деревянном доме у моря. - 🍽 Тайские блюда - 🍤 Морепродукты - 🍚 Рис и соусы - 🕒 10:00–22:00 - 🌐 Тайский, английский - 📶 Wi-Fi - 💳 Наличные',
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
  'Живописный полуостров с белоснежными пляжами и известняковыми скалами, доступный только по воде — визитная карточка Краби. - 🏖 Купание на Railay West - 🧗 Скалолазание - 🌅 Закат на пляже - 🕒 Круглосуточно - 🌐 Тайский, английский - 📶 Интернет в кафе - 💳 Наличные',
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
  'Главный курортный пляж Краби с развитой инфраструктурой, отелями и лодочными экскурсиями. - 🏖 Купание - 🚤 Экскурсии по островам - 🌅 Закат у набережной - 🕒 Доступ: обычно с утра до вечера (пляжи — 24/7) - 🌐 Языки: тайский, базовый английский - 📶 Связь: на пляжах/в городе стабильнее, на островах и в джунглях может быть слабее - 💳 Оплата: наличные чаще всего, карты — в крупных точках/турагентствах',
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
  'Архипелаг островов с белыми пляжами и бирюзовой водой — популярная морская экскурсия из Краби. - 🏝️ Пляжи Maya Bay и Loh Dalum - 🤿 Сноркелинг в бухтах - 🚤 Прогулку по островам - 🕒 Доступ: обычно с утра до вечера (пляжи — 24/7) - 🌐 Языки: тайский, базовый английский - 📶 Связь: на пляжах/в городе стабильнее, на островах и в джунглях может быть слабее - 💳 Оплата: наличные чаще всего, карты — в крупных точках/турагентствах',
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
  'Природный изумрудный бассейн в тропическом лесу, популярное место для купания. - 💦 Купание в основном бассейне - 🚶 Прогулку по экотропе - 📷 Фото в мягком утреннем свете - 🕒 Доступ: 08:30–16:30 - 🌐 Языки: тайский, базовый английский - 📶 Связь: слабая - 💳 Оплата: наличные',
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
  'Буддийский храм на вершине холма, известный подъёмом из более чем 1200 ступеней. - 🗿 Гигантскую золотую статую Будды - 🌄 Панораму на 360° - 🛕 Храмовые залы у подножия - 🕒 Доступ: 06:00–18:00 - 🌐 Языки: тайский, базовый английский - 📶 Связь: стабильная у подножия - 💳 Оплата: наличные',
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
  'Группа островов с лагунами и пляжами, популярная для однодневных туров. - 🏝️ Лагуну Koh Hong - 🤿 Сноркелинг у коралловых рифов - 🚤 Островной хоппер-тур - 🕒 Туры: 08:00–16:00 - 🌐 Языки: тайский, английский - 📶 Связь: отсутствует на островах - 💳 Оплата: наличные / онлайн при бронировании',
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
  'Две известняковые скалы у реки — символ города Краби. - 📷 Фото на фоне скал - 🚶 Прогулку по набережной - 🌅 Закат у реки Краби - 🕒 Доступ: круглосуточно - 🌐 Языки: тайский - 📶 Связь: стабильная - 💳 Оплата: не требуется',
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
  'Ресторан в пещере на пляже Railay с романтической атмосферой и видом на море. - 🍽️ Морепродукты на гриле - 🍽️ Тайские сеты - 🍹 Коктейли с тропическими фруктами - 🕒 17:00–22:30 - 🌐 Английский - 📶 Wi-Fi - 💳 Карты принимаются',
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
  'Самый известный пляж Пхукета и центр курортной жизни острова с развитой инфраструктурой, водными развлечениями и активной ночной жизнью. - 🏖 Купание и пляжный отдых - 🚶 Прогулку по Bangla Road вечером - 🌅 Закат у южной части пляжа - 🕒 Круглосуточно - 🌐 Тайский, английский - 📶 Интернет стабильный - 💳 Наличные, карты',
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
  'Огромная статуя Будды на вершине холма с панорамным видом на южный Пхукет. - 🛕 Статую Будды - 🔭 Смотровые площадки - 🚶 Территорию храмового комплекса - 🕒 08:00–19:00 - 🌐 Тайский, английский - 📶 Связь ограниченная - 💳 Наличные',
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
  'Самая популярная смотровая площадка Пхукета, известная своими закатами над Андаманским морем. - 🔭 Смотровую площадку - 🌊 Вид на океан - 🌅 Закат - 🕒 Круглосуточно - 🌐 Тайский, английский - 📶 Связь стабильная - 💳 Наличные',
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
  'Исторический центр Пхукета с китайско-португальской архитектурой, музеями и атмосферными улицами. - 🏘 Архитектуру Sino-Portuguese - 🚶 Прогулку по Thalang Road - ☕ Кафе и галереи - 🕒 Круглосуточно - 🌐 Тайский, английский - 📶 Интернет в кафе - 💳 Наличные, карты',
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
  'Архипелаг островов с белыми пляжами и бирюзовой водой — одна из самых популярных экскурсий с Пхукета. - 🏝 Maya Bay - 🚤 Лодочную экскурсию - 🤿 Сноркелинг - 🕒 По расписанию туров - 🌐 Тайский, английский - 📶 Связь ограниченная - 💳 Наличные',
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
  'Ресторан высокой тайской кухни в историческом особняке Старого города. - 🍽 Карри и морепродукты - 🍷 Дегустационное меню - 🍰 Тайские десерты - 🕒 11:30–22:00 - 🌐 Тайский, английский - 📶 Wi-Fi - 💳 Карты, наличные',
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
  'Один из лучших ресторанов аутентичной пхукетской кухни с семейными рецептами. - 🍽 Moo Hong - 🍤 Морепродукты - 🍚 Традиционные блюда - 🕒 10:00–22:00 - 🌐 Тайский, английский - 📶 Wi-Fi - 💳 Наличные',
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
  'Ресторан морепродуктов у пирса с видом на залив Чалонг. - 🍤 Морепродукты - 🦞 Лобстеры - 🍷 Ужин на закате - 🕒 11:00–22:00 - 🌐 Тайский, английский - 📶 Wi-Fi - 💳 Карты, наличные',
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
  'Ресторан в тропическом лесу Пхукета с эффектной архитектурой, террасами среди деревьев и панорамным видом на город. - 🍽 Тайские блюда и морепродукты - 🍹 Авторские коктейли - 🌿 Прогулку по террасам ресторана - 🕒 11:00–22:00 - 🌐 Тайский, английский - 📶 Wi-Fi - 💳 Наличные, карты',
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
  'Кафе на смотровой площадке с панорамным видом на пляжи Карон и Ката — популярное место для фото и кофе с видом. - ☕ Кофе и десерты - 🍰 Лёгкие закуски - 🔭 Вид на побережье - 🕒 09:00–19:00 - 🌐 Тайский, английский - 📶 Wi-Fi - 💳 Наличные, карты',
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
  'Ресторан премиум-класса над заливом Патонг с тайской и интернациональной кухней, романтической атмосферой и живым джазом. - 🍽 Тайская и интернациональная кухня - 🍷 Винную карту - 🎷 Живую джазовую музыку - 🕒 18:00–23:00 - 🌐 Тайский, английский - 📶 Wi-Fi - 💳 Карты, наличные',
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
  'Небольшой уютный ресторан тайской кухни с доступными ценами, скрытый во дворе Старого города Пхукета. - 🍽 Тайские блюда и морепродукты - 🍚 Рис с соусами - 🍤 Классические карри - 🕒 11:00–21:00 - 🌐 Тайский, базовый английский - 📶 Интернет ограниченный - 💳 Наличные',
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
  'Центральный городской пляж Паттайи с набережной, отелями, кафе и активной курортной жизнью. - 🏖 Купание и отдых - 🚶 Прогулку по Beach Road - 🌅 Закат над Сиамским заливом - 🕒 Круглосуточно - 🌐 Тайский, английский - 📶 Интернет стабильный - 💳 Наличные, карты',
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
  'Знаменитая улица ночной жизни Паттайи с клубами, барами и шоу. - 🎶 Клубы и бары - 🍹 Коктейли - 🌃 Вечернюю прогулку - 🕒 18:00–02:00 - 🌐 Тайский, английский - 📶 Связь стабильная - 💳 Наличные',
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
  'Грандиозный деревянный храм-музей, построенный без единого гвоздя. - 🏛 Резные залы - 🚶 Экскурсию с гидом - 🌊 Вид на море - 🕒 08:00–18:00 - 🌐 Тайский, английский - 📶 Интернет ограничен - 💳 Наличные, карты',
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
  'Огромный тропический парк с садами, шоу и культурными представлениями. - 🌸 Тематические сады - 🎭 Тайские шоу - 🐘 Мини-зоопарк - 🕒 08:00–18:00 - 🌐 Тайский, английский - 📶 Интернет ограничен - 💳 Наличные, карты',
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
  'Более спокойный пляж к югу от Паттайи, популярный среди семей и длительных остановок. - 🏖 Купание - 🚶 Прогулку вдоль берега - 🌅 Закат - 🕒 Круглосуточно - 🌐 Тайский, английский - 📶 Интернет стабильный - 💳 Наличные',
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
  'Холм с большой статуей Будды и панорамным видом на Паттайю. - 🛕 Статую Будды - 🔭 Смотровую площадку - 🚶 Прогулку по холму - 🕒 07:00–18:00 - 🌐 Тайский, английский - 📶 Связь стабильная - 💳 Наличные',
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
  'Руфтоп-бар с видом на Паттайю и Сиамский залив. - 🍹 Коктейли - 🌅 Закат - 🎶 Лёгкая музыка - 🕒 17:00–00:00 - 🌐 Тайский, английский - 📶 Wi-Fi - 💳 Карты, наличные',
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
  'Ресторан у моря с тайской и интернациональной кухней и романтической атмосферой. - 🍽 Морепродукты - 🍷 Вино - 🌅 Закат - 🕒 11:00–23:00 - 🌐 Тайский, английский - 📶 Wi-Fi - 💳 Карты',
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
  'Известный ресторан морепродуктов, популярный среди местных жителей. - 🍤 Морепродукты - 🍚 Тайские блюда - 🍺 Пиво - 🕒 10:00–22:00 - 🌐 Тайский, базовый английский - 📶 Wi-Fi - 💳 Наличные',
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
  'Самый популярный и развитый пляж Самуи с белым песком, прозрачной водой и насыщенной курортной жизнью. - 🏖 Купание и пляжный отдых - 🚶 Прогулку по Chaweng Walking Street - 🌅 Рассвет над Сиамским заливом - 🕒 Круглосуточно - 🌐 Тайский, английский - 📶 Интернет стабильный - 💳 Наличные, карты',
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
  'Второй по популярности пляж Самуи с более спокойной атмосферой и живописными видами. - 🏖 Купание - 🚶 Прогулку вдоль пляжа - 🌅 Закат - 🕒 Круглосуточно - 🌐 Тайский, английский - 📶 Интернет стабильный - 💳 Наличные',
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
  'Одна из главных святынь Самуи — 12-метровая статуя Будды на небольшом острове у северного побережья. - 🛕 Статую Будды - 🔭 Смотровые площадки - 🚶 Территорию храма - 🕒 08:00–18:00 - 🌐 Тайский, английский - 📶 Связь стабильная - 💳 Наличные',
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
  'Два живописных водопада в центре острова, популярные для купания и прогулок. - 💦 Купание в природных бассейнах - 🚶 Прогулку по тропам - 🌿 Осмотр окрестностей - 🕒 08:00–17:00 - 🌐 Тайский, базовый английский - 📶 Связь слабая - 💳 Наличные',
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
  'Исторический район Бопхута с набережной, ресторанами и вечерним рынком. - 🚶 Прогулку по набережной - 🍽 Ужин у моря - 🛍 Friday Night Market - 🕒 Круглосуточно - 🌐 Тайский, английский - 📶 Интернет стабильный - 💳 Наличные, карты',
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
  'Морской национальный парк из десятков островов с лагунами и смотровыми площадками. - 🚤 Лодочную экскурсию - 🤿 Сноркелинг - 🔭 Смотровые площадки - 🕒 По расписанию туров - 🌐 Тайский, английский - 📶 Связь ограниченная - 💳 Наличные',
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
  'Популярный пляжный бар с коктейлями, огненными шоу и видом на море в районе Бопхут. - 🍹 Коктейли - 🔥 Огненное шоу - 🌅 Закат - 🕒 16:00–00:00 - 🌐 Тайский, английский - 📶 Wi-Fi - 💳 Наличные, карты',
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
  'Ресторан высокой кухни на скале с панорамным видом на Сиамский залив. - 🍽 Дегустационные сеты - 🍷 Винную карту - 🌅 Закат - 🕒 18:00–22:00 - 🌐 Тайский, английский - 📶 Wi-Fi - 💳 Карты',
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


-- Content Blocks UPSERT (idempotent)
-- Generated from Atlas Content Canon v1 markdown files

-- Content block for: 🏛️ Grand Palace
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'bkk-grand-palace',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Главная достопримечательность страны и визитная карточка Бангкока  
- 🌍 Резиденция тайских королей и центр государственной истории  
- 📸 Богатая отделка, золотые шпили и мозаики

## Структура комплекса

- 🏛 Храм Изумрудного Будды (Wat Phra Kaew)  
- 🏛 Королевские залы и внутренние дворики  
- 🚶‍♂️ Прогулку по внешним и внутренним стенам комплекса

## Билеты и посещение

- 💰 ~500 THB  
- 🎟️ Билет приобретается на входе  
- 🆓 Бесплатно для детей до определённого роста

## Лучшие точки для фото

- 📷 Храм Изумрудного Будды  
- 📷 Детали мозаик и шпилей  
- 🌅 Внутренние дворики при утреннем свете

## Практическая информация

- **Адрес:** Na Phra Lan Rd, Phra Nakhon  
- **Сайт:** [https://www.royalgrandpalace.th](https://www.royalgrandpalace.th)  
- **Телефон:** —

## Как добраться

- 🚶 Пешком от района Rattanakosin  
- 🚕 Такси / Grab  
- 🚌 Автобусы к Sanam Luang  
- 🗺️ Ориентир: Wat Pho, река Чао Прайя

## Полезные нюансы

- ⚠️ Строгий дресс-код (закрытые плечи и колени)  
- 🌞 Лучше приходить утром  
- 👕 Лёгкая, но закрытая одежда  
- 🐾 Фото внутри некоторых зон запрещены

## Локальная ценность

Комплекс остаётся сакральным центром монархии и символом тайской идентичности, используемым для государственных церемоний.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛕 Wat Arun
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'bkk-wat-arun',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самый фотогеничный храм на реке  
- 🌍 Важный религиозный символ эпохи Тонбури  
- 📸 Идеальные виды на закат и город

## Структура комплекса

- 🛕 Центральную пагоду  
- 🚶 Подъём на террасы  
- 🚤 Вид с противоположного берега реки

## Билеты и посещение

- 💰 ~200 THB  
- 🎟️ Билет на входе  
- 🆓 Территория вокруг — бесплатно

## Лучшие точки для фото

- 📷 Главную точку/фасад  
- 📷 Детали (архитектура/интерьер/подача)  
- 🌅 Свет в золотой час (закат/рассвет)

## Практическая информация

- **Адрес:** по координатам (уточняется)  
- **Сайт / соцсети:** —  
- **Контакты:** —

## Как добраться

- 🚶 Пешком — если вы уже в центре/рядом  
- 🚕 Такси / Grab (самый удобный вариант)  
- 🚌 Общественный транспорт: уточняется  
- 🗺️ Ориентир: по координатам

## Полезные нюансы

- ⚠️ Проверьте актуальные правила/цены перед визитом  
- 🌞 Лучшее время: утро или ближе к закату  
- 👕 Удобная обувь; для храмов — закрытая одежда  
- 🐾 Соблюдайте правила поведения и чистоту

## Локальная ценность

Место заметно в городской жизни: сюда приходят за впечатлениями и локальным контекстом. Оно поддерживает туристическую экономику и помогает сохранять культурный/природный ландшафт района.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛕 Wat Pho
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'bkk-wat-pho',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Огромная статуя Будды длиной 46 метров  
- 🌍 Центр традиционной медицины и массажа  
- 📸 Детализированные интерьеры

## Структура комплекса

- 🏛️ Главный объект/зона места  
- 🏞️ Второй ключевой участок/маршрут  
- 🚶 Короткая прогулка по территории с лучшими видами

## Билеты и посещение

- 💰 Уточняется (цены могут меняться)  
- 🎟️ Если есть туры/экскурсии — уточняйте на месте  
- 🆓 Бесплатные зоны/часы: уточняется

## Лучшие точки для фото

- 📷 Главную точку/фасад  
- 📷 Детали (архитектура/интерьер/подача)  
- 🌅 Свет в золотой час (закат/рассвет)

## Практическая информация

- **Адрес:** по координатам (уточняется)  
- **Сайт / соцсети:** —  
- **Контакты:** —

## Как добраться

- 🚶 Пешком — если вы уже в центре/рядом  
- 🚕 Такси / Grab (самый удобный вариант)  
- 🚌 Общественный транспорт: уточняется  
- 🗺️ Ориентир: по координатам

## Полезные нюансы

- ⚠️ Проверьте актуальные правила/цены перед визитом  
- 🌞 Лучшее время: утро или ближе к закату  
- 👕 Удобная обувь; для храмов — закрытая одежда  
- 🐾 Соблюдайте правила поведения и чистоту

## Локальная ценность

Место заметно в городской жизни: сюда приходят за впечатлениями и локальным контекстом. Оно поддерживает туристическую экономику и помогает сохранять культурный/природный ландшафт района.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛍️ Chatuchak Weekend Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'bkk-chatuchak-weekend-market',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самый большой рынок Таиланда  
- 🌍 Центр локальной торговли и культуры  
- 📸 Яркий хаос и уличная жизнь

## Структура комплекса

- 🏛️ Главный объект/зона места  
- 🏞️ Второй ключевой участок/маршрут  
- 🚶 Короткая прогулка по территории с лучшими видами

## Билеты и посещение

- 💰 Уточняется (цены могут меняться)  
- 🎟️ Если есть туры/экскурсии — уточняйте на месте  
- 🆓 Бесплатные зоны/часы: уточняется

## Лучшие точки для фото

- 📷 Главную точку/фасад  
- 📷 Детали (архитектура/интерьер/подача)  
- 🌅 Свет в золотой час (закат/рассвет)

## Практическая информация

- **Адрес:** по координатам (уточняется)  
- **Сайт / соцсети:** —  
- **Контакты:** —

## Как добраться

- 🚶 Пешком — если вы уже в центре/рядом  
- 🚕 Такси / Grab (самый удобный вариант)  
- 🚌 Общественный транспорт: уточняется  
- 🗺️ Ориентир: по координатам

## Полезные нюансы

- ⚠️ Проверьте актуальные правила/цены перед визитом  
- 🌞 Лучшее время: утро или ближе к закату  
- 👕 Удобная обувь; для храмов — закрытая одежда  
- 🐾 Соблюдайте правила поведения и чистоту

## Локальная ценность

Место заметно в городской жизни: сюда приходят за впечатлениями и локальным контекстом. Оно поддерживает туристическую экономику и помогает сохранять культурный/природный ландшафт района.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏮 Chinatown
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'bkk-chinatown',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучшая street food-сцена Бангкока  
- 🌍 Исторический китайский квартал  
- 📸 Ночная атмосфера и неон

## Структура комплекса

- 🏛️ Главный объект/зона места  
- 🏞️ Второй ключевой участок/маршрут  
- 🚶 Короткая прогулка по территории с лучшими видами

## Билеты и посещение

- 💰 Уточняется (цены могут меняться)  
- 🎟️ Если есть туры/экскурсии — уточняйте на месте  
- 🆓 Бесплатные зоны/часы: уточняется

## Лучшие точки для фото

- 📷 Главную точку/фасад  
- 📷 Детали (архитектура/интерьер/подача)  
- 🌅 Свет в золотой час (закат/рассвет)

## Практическая информация

- **Адрес:** по координатам (уточняется)  
- **Сайт / соцсети:** —  
- **Контакты:** —

## Как добраться

- 🚶 Пешком — если вы уже в центре/рядом  
- 🚕 Такси / Grab (самый удобный вариант)  
- 🚌 Общественный транспорт: уточняется  
- 🗺️ Ориентир: по координатам

## Полезные нюансы

- ⚠️ Проверьте актуальные правила/цены перед визитом  
- 🌞 Лучшее время: утро или ближе к закату  
- 👕 Удобная обувь; для храмов — закрытая одежда  
- 🐾 Соблюдайте правила поведения и чистоту

## Локальная ценность

Место заметно в городской жизни: сюда приходят за впечатлениями и локальным контекстом. Оно поддерживает туристическую экономику и помогает сохранять культурный/природный ландшафт района.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍜 Jay Fai
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'bkk-jay-fai',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком — если вы уже в центре/рядом  
- 🚕 Такси / Grab (самый удобный вариант)  
- 🚌 Общественный транспорт: уточняется  
- 🗺️ Ориентир: по координатам

## Полезные нюансы

- ⚠️ Проверьте актуальные правила/цены перед визитом  
- 🌞 Лучшее время: утро или ближе к закату  
- 👕 Удобная обувь; для храмов — закрытая одежда  
- 🐾 Соблюдайте правила поведения и чистоту

## Локальная ценность

Место заметно в городской жизни: сюда приходят за впечатлениями и локальным контекстом. Оно поддерживает туристическую экономику и помогает сохранять культурный/природный ландшафт района.

## Лучшие точки для фото

- 📷 Главную точку/фасад  
- 📷 Детали (архитектура/интерьер/подача)  
- 🌅 Свет в золотой час (закат/рассвет)

## Практическая информация

- **Адрес:** по координатам (уточняется)  
- **Сайт / соцсети:** —  
- **Контакты:** —

## Почему это важно?

- 🌟 Единственный street food с Michelin Star  
- 🌍 Культовое место для гурманов  
- 📸 Готовка на открытом огне

## Структура комплекса

- 🍽️ Фирменное блюдо/напиток заведения  
- 🍽️ Ещё одна популярная позиция из меню  
- 🍽️ Попробовать сезонный/локальный специалитет (если есть)

## Билеты и посещение

- 💰 Уточняется (цены могут меняться)  
- 🎟️ Если есть туры/экскурсии — уточняйте на месте  
- 🆓 Бесплатные зоны/часы: уточняется
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍽️ Blue Elephant Bangkok
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'bkk-blue-elephant-bangkok',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком — если вы уже в центре/рядом  
- 🚕 Такси / Grab (самый удобный вариант)  
- 🚌 Общественный транспорт: уточняется  
- 🗺️ Ориентир: по координатам

## Полезные нюансы

- ⚠️ Проверьте актуальные правила/цены перед визитом  
- 🌞 Лучшее время: утро или ближе к закату  
- 👕 Удобная обувь; для храмов — закрытая одежда  
- 🐾 Соблюдайте правила поведения и чистоту

## Локальная ценность

Место заметно в городской жизни: сюда приходят за впечатлениями и локальным контекстом. Оно поддерживает туристическую экономику и помогает сохранять культурный/природный ландшафт района.

## Лучшие точки для фото

- 📷 Главную точку/фасад  
- 📷 Детали (архитектура/интерьер/подача)  
- 🌅 Свет в золотой час (закат/рассвет)

## Практическая информация

- **Адрес:** по координатам (уточняется)  
- **Сайт / соцсети:** —  
- **Контакты:** —

## Почему это важно?

- 🌟 Икона королевской тайской кухни  
- 🌍 Историческое здание  
- 📸 Элегантные интерьеры

## Структура комплекса

- 🍽️ Фирменное блюдо/напиток заведения  
- 🍽️ Ещё одна популярная позиция из меню  
- 🍽️ Попробовать сезонный/локальный специалитет (если есть)

## Билеты и посещение

- 💰 Уточняется (цены могут меняться)  
- 🎟️ Если есть туры/экскурсии — уточняйте на месте  
- 🆓 Бесплатные зоны/часы: уточняется
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌃 Vertigo & Moon Bar
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'bkk-vertigo-moon-bar',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком — если вы уже в центре/рядом  
- 🚕 Такси / Grab (самый удобный вариант)  
- 🚌 Общественный транспорт: уточняется  
- 🗺️ Ориентир: по координатам

## Полезные нюансы

- ⚠️ Проверьте актуальные правила/цены перед визитом  
- 🌞 Лучшее время: утро или ближе к закату  
- 👕 Удобная обувь; для храмов — закрытая одежда  
- 🐾 Соблюдайте правила поведения и чистоту

## Локальная ценность

Место заметно в городской жизни: сюда приходят за впечатлениями и локальным контекстом. Оно поддерживает туристическую экономику и помогает сохранять культурный/природный ландшафт района.

## Лучшие точки для фото

- 📷 Главную точку/фасад  
- 📷 Детали (архитектура/интерьер/подача)  
- 🌅 Свет в золотой час (закат/рассвет)

## Практическая информация

- **Адрес:** по координатам (уточняется)  
- **Сайт / соцсети:** —  
- **Контакты:** —

## Почему это важно?

- 🌟 Один из лучших rooftop-баров Азии  
- 🌍 Вид на мегаполис с высоты  
- 📸 Ночные панорамы

## Структура комплекса

- 🍽️ Фирменное блюдо/напиток заведения  
- 🍽️ Ещё одна популярная позиция из меню  
- 🍽️ Попробовать сезонный/локальный специалитет (если есть)

## Билеты и посещение

- 💰 Уточняется (цены могут меняться)  
- 🎟️ Если есть туры/экскурсии — уточняйте на месте  
- 🆓 Бесплатные зоны/часы: уточняется
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛍️ ICONSIAM
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'bkk-iconsiam',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самый современный молл Бангкока  
- 🌍 Сочетание традиций и люкса  
- 📸 Архитектура и вечерняя подсветка

## Структура комплекса

- 🏛️ Главный объект/зона места  
- 🏞️ Второй ключевой участок/маршрут  
- 🚶 Короткая прогулка по территории с лучшими видами

## Билеты и посещение

- 💰 Уточняется (цены могут меняться)  
- 🎟️ Если есть туры/экскурсии — уточняйте на месте  
- 🆓 Бесплатные зоны/часы: уточняется

## Лучшие точки для фото

- 📷 Главную точку/фасад  
- 📷 Детали (архитектура/интерьер/подача)  
- 🌅 Свет в золотой час (закат/рассвет)

## Практическая информация

- **Адрес:** по координатам (уточняется)  
- **Сайт / соцсети:** —  
- **Контакты:** —

## Как добраться

- 🚶 Пешком — если вы уже в центре/рядом  
- 🚕 Такси / Grab (самый удобный вариант)  
- 🚌 Общественный транспорт: уточняется  
- 🗺️ Ориентир: по координатам

## Полезные нюансы

- ⚠️ Проверьте актуальные правила/цены перед визитом  
- 🌞 Лучшее время: утро или ближе к закату  
- 👕 Удобная обувь; для храмов — закрытая одежда  
- 🐾 Соблюдайте правила поведения и чистоту

## Локальная ценность

Место заметно в городской жизни: сюда приходят за впечатлениями и локальным контекстом. Оно поддерживает туристическую экономику и помогает сохранять культурный/природный ландшафт района.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌃 Asiatique The Riverfront
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'bkk-asiatique-the-riverfront',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Атмосферный вечерний маршрут  
- 🌍 Реконструированный портовый район  
- 📸 Ночные огни и колесо обозрения

## Структура комплекса

- 🏛️ Главный объект/зона места  
- 🏞️ Второй ключевой участок/маршрут  
- 🚶 Короткая прогулка по территории с лучшими видами

## Билеты и посещение

- 💰 Уточняется (цены могут меняться)  
- 🎟️ Если есть туры/экскурсии — уточняйте на месте  
- 🆓 Бесплатные зоны/часы: уточняется

## Лучшие точки для фото

- 📷 Главную точку/фасад  
- 📷 Детали (архитектура/интерьер/подача)  
- 🌅 Свет в золотой час (закат/рассвет)

## Практическая информация

- **Адрес:** по координатам (уточняется)  
- **Сайт / соцсети:** —  
- **Контакты:** —

## Как добраться

- 🚶 Пешком — если вы уже в центре/рядом  
- 🚕 Такси / Grab (самый удобный вариант)  
- 🚌 Общественный транспорт: уточняется  
- 🗺️ Ориентир: по координатам

## Полезные нюансы

- ⚠️ Проверьте актуальные правила/цены перед визитом  
- 🌞 Лучшее время: утро или ближе к закату  
- 👕 Удобная обувь; для храмов — закрытая одежда  
- 🐾 Соблюдайте правила поведения и чистоту

## Локальная ценность

Место заметно в городской жизни: сюда приходят за впечатлениями и локальным контекстом. Оно поддерживает туристическую экономику и помогает сохранять культурный/природный ландшафт района.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍜 Thipsamai Pad Thai
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'bkk-thipsamai-pad-thai',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком — если вы уже в центре/рядом  
- 🚕 Такси / Grab (самый удобный вариант)  
- 🚌 Общественный транспорт: уточняется  
- 🗺️ Ориентир: по координатам

## Полезные нюансы

- ⚠️ Проверьте актуальные правила/цены перед визитом  
- 🌞 Лучшее время: утро или ближе к закату  
- 👕 Удобная обувь; для храмов — закрытая одежда  
- 🐾 Соблюдайте правила поведения и чистоту

## Локальная ценность

Место заметно в городской жизни: сюда приходят за впечатлениями и локальным контекстом. Оно поддерживает туристическую экономику и помогает сохранять культурный/природный ландшафт района.

## Лучшие точки для фото

- 📷 Главную точку/фасад  
- 📷 Детали (архитектура/интерьер/подача)  
- 🌅 Свет в золотой час (закат/рассвет)

## Практическая информация

- **Адрес:** по координатам (уточняется)  
- **Сайт / соцсети:** —  
- **Контакты:** —

## Почему это важно?

- 🌟 Легендарный пад-тай  
- 🌍 Икона тайской кухни  
- 📸 Кулинарное шоу

## Структура комплекса

- 🍽️ Фирменное блюдо/напиток заведения  
- 🍽️ Ещё одна популярная позиция из меню  
- 🍽️ Попробовать сезонный/локальный специалитет (если есть)

## Билеты и посещение

- 💰 Уточняется (цены могут меняться)  
- 🎟️ Если есть туры/экскурсии — уточняйте на месте  
- 🆓 Бесплатные зоны/часы: уточняется
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌃 Sirocco Sky Bar
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'bkk-sirocco-sky-bar',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком — если вы уже в центре/рядом  
- 🚕 Такси / Grab (самый удобный вариант)  
- 🚌 Общественный транспорт: уточняется  
- 🗺️ Ориентир: по координатам

## Полезные нюансы

- ⚠️ Проверьте актуальные правила/цены перед визитом  
- 🌞 Лучшее время: утро или ближе к закату  
- 👕 Удобная обувь; для храмов — закрытая одежда  
- 🐾 Соблюдайте правила поведения и чистоту

## Локальная ценность

Место заметно в городской жизни: сюда приходят за впечатлениями и локальным контекстом. Оно поддерживает туристическую экономику и помогает сохранять культурный/природный ландшафт района.

## Лучшие точки для фото

- 📷 Главную точку/фасад  
- 📷 Детали (архитектура/интерьер/подача)  
- 🌅 Свет в золотой час (закат/рассвет)

## Практическая информация

- **Адрес:** по координатам (уточняется)  
- **Сайт / соцсети:** —  
- **Контакты:** —

## Почему это важно?

- 🌟 Кино-икона и skyline  
- 🌍 Один из самых высоких баров города  
- 📸 Закат над рекой

## Структура комплекса

- 🍽️ Фирменное блюдо/напиток заведения  
- 🍽️ Ещё одна популярная позиция из меню  
- 🍽️ Попробовать сезонный/локальный специалитет (если есть)

## Билеты и посещение

- 💰 Уточняется (цены могут меняться)  
- 🎟️ Если есть туры/экскурсии — уточняйте на месте  
- 🆓 Бесплатные зоны/часы: уточняется
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛕 Wat Phra That Doi Suthep
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'cnx-wat-phra-that-doi-suthep',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самый почитаемый храм Чиангмая  
- 🌍 Центр буддийского паломничества региона  
- 📸 Панорамы города и гор на рассвете и закате

## Структура комплекса

- 🛕 Золотую чеди храма  
- 🚶‍♂️ Лестницу из 306 ступеней с нагами  
- 🔭 Смотровые площадки

## Билеты и посещение

- 💰 ~30 THB  
- 🎟️ Билет на входе  
- 🆓 Территория вокруг — бесплатно

## Лучшие точки для фото

- 📷 Золотую чеди  
- 📷 Вид на город  
- 🌅 Закат над горами

## Практическая информация

- **Адрес:** Suthep, Chiang Mai  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси / сонгтэо  
- 🛵 Байк  
- 🗺️ Гора Дойсутхеп, 15 км от центра

## Полезные нюансы

- ⚠️ Строгий дресс-код  
- 🌞 Лучше приходить утром  
- 👕 Закрытая одежда  
- 🐾 Фото внутри некоторых зон запрещены

## Локальная ценность

Храм считается хранителем города и местом силы для местных жителей, связанных с историей королевства Ланна.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏯 Wat Chedi Luang
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'cnx-wat-chedi-luang',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Один из старейших храмов города  
- 🌍 Исторический центр королевства Ланна  
- 📸 Монументальная архитектура

## Структура комплекса

- 🏛️ Главный объект/зона места  
- 🏞️ Второй ключевой участок/маршрут  
- 🚶 Короткая прогулка по территории с лучшими видами

## Билеты и посещение

- 💰 Уточняется (цены могут меняться)  
- 🎟️ Если есть туры/экскурсии — уточняйте на месте  
- 🆓 Бесплатные зоны/часы: уточняется

## Лучшие точки для фото

- 📷 Главную точку/фасад  
- 📷 Детали (архитектура/интерьер/подача)  
- 🌅 Свет в золотой час (закат/рассвет)

## Практическая информация

- **Адрес:** по координатам (уточняется)  
- **Сайт / соцсети:** —  
- **Контакты:** —

## Как добраться

- 🚶 Пешком — если вы уже в центре/рядом  
- 🚕 Такси / Grab (самый удобный вариант)  
- 🚌 Общественный транспорт: уточняется  
- 🗺️ Ориентир: по координатам

## Полезные нюансы

- ⚠️ Проверьте актуальные правила/цены перед визитом  
- 🌞 Лучшее время: утро или ближе к закату  
- 👕 Удобная обувь; для храмов — закрытая одежда  
- 🐾 Соблюдайте правила поведения и чистоту

## Локальная ценность

Место заметно в городской жизни: сюда приходят за впечатлениями и локальным контекстом. Оно поддерживает туристическую экономику и помогает сохранять культурный/природный ландшафт района.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏘️ Old City
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'cnx-old-city',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Атмосфера древнего Ланна  
- 🌍 Историческое ядро города  
- 📸 Храмы и городские ворота

## Структура комплекса

- 🏛️ Главный объект/зона места  
- 🏞️ Второй ключевой участок/маршрут  
- 🚶 Короткая прогулка по территории с лучшими видами

## Билеты и посещение

- 💰 Уточняется (цены могут меняться)  
- 🎟️ Если есть туры/экскурсии — уточняйте на месте  
- 🆓 Бесплатные зоны/часы: уточняется

## Лучшие точки для фото

- 📷 Главную точку/фасад  
- 📷 Детали (архитектура/интерьер/подача)  
- 🌅 Свет в золотой час (закат/рассвет)

## Практическая информация

- **Адрес:** по координатам (уточняется)  
- **Сайт / соцсети:** —  
- **Контакты:** —

## Как добраться

- 🚶 Пешком — если вы уже в центре/рядом  
- 🚕 Такси / Grab (самый удобный вариант)  
- 🚌 Общественный транспорт: уточняется  
- 🗺️ Ориентир: по координатам

## Полезные нюансы

- ⚠️ Проверьте актуальные правила/цены перед визитом  
- 🌞 Лучшее время: утро или ближе к закату  
- 👕 Удобная обувь; для храмов — закрытая одежда  
- 🐾 Соблюдайте правила поведения и чистоту

## Локальная ценность

Место заметно в городской жизни: сюда приходят за впечатлениями и локальным контекстом. Оно поддерживает туристическую экономику и помогает сохранять культурный/природный ландшафт района.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌲 Doi Inthanon National Park
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'cnx-doi-inthanon-national-park',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самая высокая гора страны  
- 🌍 Природное богатство северного Таиланда  
- 📸 Водопады и туманные леса

## Структура комплекса

- 🏛️ Главный объект/зона места  
- 🏞️ Второй ключевой участок/маршрут  
- 🚶 Короткая прогулка по территории с лучшими видами

## Билеты и посещение

- 💰 Уточняется (цены могут меняться)  
- 🎟️ Если есть туры/экскурсии — уточняйте на месте  
- 🆓 Бесплатные зоны/часы: уточняется

## Лучшие точки для фото

- 📷 Главную точку/фасад  
- 📷 Детали (архитектура/интерьер/подача)  
- 🌅 Свет в золотой час (закат/рассвет)

## Практическая информация

- **Адрес:** по координатам (уточняется)  
- **Сайт / соцсети:** —  
- **Контакты:** —

## Как добраться

- 🚶 Пешком — если вы уже в центре/рядом  
- 🚕 Такси / Grab (самый удобный вариант)  
- 🚌 Общественный тransport: уточняется  
- 🗺️ Ориентир: по координатам

## Полезные нюансы

- ⚠️ Проверьте актуальные правила/цены перед визитом  
- 🌞 Лучшее время: утро или ближе к закату  
- 👕 Удобная обувь; для храмов — закрытая одежда  
- 🐾 Соблюдайте правила поведения и чистоту

## Локальная ценность

Место заметно в городской жизни: сюда приходят за впечатлениями и локальным контекстом. Оно поддерживает туристическую экономику и помогает сохранять культурный/природный ландшафт района.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🐘 Elephant Nature Park
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'cnx-elephant-nature-park',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Этичный туризм  
- 🌍 Защита животных  
- 📸 Наблюдение за слонами в природе

## Структура комплекса

- 🏛️ Главный объект/зона места  
- 🏞️ Второй ключевой участок/маршрут  
- 🚶 Короткая прогулка по территории с лучшими видами

## Билеты и посещение

- 💰 Уточняется (цены могут меняться)  
- 🎟️ Если есть туры/экскурсии — уточняйте на месте  
- 🆓 Бесплатные зоны/часы: уточняется

## Лучшие точки для фото

- 📷 Главную точку/фасад  
- 📷 Детали (архитектура/интерьер/подача)  
- 🌅 Свет в золотой час (закат/рассвет)

## Практическая информация

- **Адрес:** по координатам (уточняется)  
- **Сайт / соцсети:** —  
- **Контакты:** —

## Как добраться

- 🚶 Пешком — если вы уже в центре/рядом  
- 🚕 Такси / Grab (самый удобный вариант)  
- 🚌 Общественный транспорт: уточняется  
- 🗺️ Ориентир: по координатам

## Полезные нюансы

- ⚠️ Проверьте актуальные правила/цены перед визитом  
- 🌞 Лучшее время: утро или ближе к закату  
- 👕 Удобная обувь; для храмов — закрытая одежда  
- 🐾 Соблюдайте правила поведения и чистоту

## Локальная ценность

Место заметно в городской жизни: сюда приходят за впечатлениями и локальным контекстом. Оно поддерживает туристическую экономику и помогает сохранять культурный/природный ландшафт района.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌃 Sunday Walking Street Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'cnx-sunday-walking-street-market',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучший рынок города  
- 🌍 Локальная культура  
- 📸 Атмосфера вечера

## Структура комплекса

- 🏛️ Главный объект/зона места  
- 🏞️ Второй ключевой участок/маршрут  
- 🚶 Короткая прогулка по территории с лучшими видами

## Билеты и посещение

- 💰 Уточняется (цены могут меняться)  
- 🎟️ Если есть туры/экскурсии — уточняйте на месте  
- 🆓 Бесплатные зоны/часы: уточняется

## Лучшие точки для фото

- 📷 Главную точку/фасад  
- 📷 Детали (архитектура/интерьер/подача)  
- 🌅 Свет в золотой час (закат/рассвет)

## Практическая информация

- **Адрес:** по координатам (уточняется)  
- **Сайт / соцсети:** —  
- **Контакты:** —

## Как добраться

- 🚶 Пешком — если вы уже в центре/рядом  
- 🚕 Такси / Grab (самый удобный вариант)  
- 🚌 Общественный транспорт: уточняется  
- 🗺️ Ориентир: по координатам

## Полезные нюансы

- ⚠️ Проверьте актуальные правила/цены перед визитом  
- 🌞 Лучшее время: утро или ближе к закату  
- 👕 Удобная обувь; для храмов — закрытая одежда  
- 🐾 Соблюдайте правила поведения и чистоту

## Локальная ценность

Место заметно в городской жизни: сюда приходят за впечатлениями и локальным контекстом. Оно поддерживает туристическую экономику и помогает сохранять культурный/природный ландшафт района.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛍️ Nimmanhaemin Road
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'cnx-nimmanhaemin-road',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Креативный район  
- 🌍 Современный Чиангмай  
- 📸 Кафе и стрит-арт

## Структура комплекса

- 🏛️ Главный объект/зона места  
- 🏞️ Второй ключевой участок/маршрут  
- 🚶 Короткая прогулка по территории с лучшими видами

## Билеты и посещение

- 💰 Уточняется (цены могут меняться)  
- 🎟️ Если есть туры/экскурсии — уточняйте на месте  
- 🆓 Бесплатные зоны/часы: уточняется

## Лучшие точки для фото

- 📷 Главную точку/фасад  
- 📷 Детали (архитектура/интерьер/подача)  
- 🌅 Свет в золотой час (закат/рассвет)

## Практическая информация

- **Адрес:** по координатам (уточняется)  
- **Сайт / соцсети:** —  
- **Контакты:** —

## Как добраться

- 🚶 Пешком — если вы уже в центре/рядом  
- 🚕 Такси / Grab (самый удобный вариант)  
- 🚌 Общественный транспорт: уточняется  
- 🗺️ Ориентир: по координатам

## Полезные нюансы

- ⚠️ Проверьте актуальные правила/цены перед визитом  
- 🌞 Лучшее время: утро или ближе к закату  
- 👕 Удобная обувь; для храмов — закрытая одежда  
- 🐾 Соблюдайте правила поведения и чистоту

## Локальная ценность

Место заметно в городской жизни: сюда приходят за впечатлениями и локальным контекстом. Оно поддерживает туристическую экономику и помогает сохранять культурный/природный ландшафт района.
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍜 Khao Soi Khun Yai
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'cnx-khao-soi-khun-yai',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Фирменное блюдо/напиток заведения  
- 🍽️ Ещё одна популярная позиция из меню  
- 🍽️ Попробовать сезонный/локальный специалитет (если есть)

## Как добраться

- 🚶 Пешком — если вы уже в центре/рядом  
- 🚕 Такси / Grab (самый удобный вариант)  
- 🚌 Общественный транспорт: уточняется  
- 🗺️ Ориентир: по координатам

## Полезные нюансы

- ⚠️ Проверьте актуальные правила/цены перед визитом  
- 🌞 Лучшее время: утро или ближе к закату  
- 👕 Удобная обувь; для храмов — закрытая одежда  
- 🐾 Соблюдайте правила поведения и чистоту

## Локальная ценность

Место заметно в городской жизни: сюда приходят за впечатлениями и локальным контекстом. Оно поддерживает туристическую экономику и помогает сохранять культурный/природный ландшафт района.

## Лучшие точки для фото

- 📷 Главную точку/фасад  
- 📷 Детали (архитектура/интерьер/подача)  
- 🌅 Свет в золотой час (закат/рассвет)

## Практическая информация

- **Адрес:** по координатам (уточняется)  
- **Сайт / соцсети:** —  
- **Контакты:** —

## Почему это важно?

- 🌟 Лучший кхао сои в городе  
- 🌍 Аутентичная кухня Ланна  
- 📸 Простая локальная атмосфера

## Билеты и посещение

- 💰 Уточняется (цены могут меняться)  
- 🎟️ Если есть туры/экскурсии — уточняйте на месте  
- 🆓 Бесплатные зоны/часы: уточняется
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ☕ Graph Café
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'cnx-graph-cafe',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Фирменное блюдо/напиток заведения  
- 🍽️ Ещё одна популярная позиция из меню  
- 🍽️ Попробовать сезонный/локальный специалитет (если есть)

## Как добраться

- 🚶 Пешком — если вы уже в центре/рядом  
- 🚕 Такси / Grab (самый удобный вариант)  
- 🚌 Общественный транспорт: уточняется  
- 🗺️ Ориентир: по координатам

## Полезные нюансы

- ⚠️ Проверьте актуальные правила/цены перед визитом  
- 🌞 Лучшее время: утро или ближе к закату  
- 👕 Удобная обувь; для храмов — закрытая одежда  
- 🐾 Соблюдайте правила поведения и чистоту

## Локальная ценность

Место заметно в городской жизни: сюда приходят за впечатлениями и локальным контекстом. Оно поддерживает туристическую экономику и помогает сохранять культурный/природный ландшафт района.

## Лучшие точки для фото

- 📷 Главную точку/фасад  
- 📷 Детали (архитектура/интерьер/подача)  
- 🌅 Свет в золотой час (закат/рассвет)

## Практическая информация

- **Адрес:** по координатам (уточняется)  
- **Сайт / соцсети:** —  
- **Контакты:** —

## Почему это важно?

- 🌟 Икона кофейной сцены  
- 🌍 Современная культура кофе  
- 📸 Минималистичный интерьер

## Билеты и посещение

- 💰 Уточняется (цены могут меняться)  
- 🎟️ Если есть туры/экскурсии — уточняйте на месте  
- 🆓 Бесплатные зоны/часы: уточняется
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🖼️ Woo Café & Art Gallery
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'cnx-woo-cafe-art-gallery',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Фирменное блюдо/напиток заведения  
- 🍽️ Ещё одна популярная позиция из меню  
- 🍽️ Попробовать сезонный/локальный специалитет (если есть)

## Как добраться

- 🚶 Пешком — если вы уже в центре/рядом  
- 🚕 Такси / Grab (самый удобный вариант)  
- 🚌 Общественный транспорт: уточняется  
- 🗺️ Ориентир: по координатам

## Полезные нюансы

- ⚠️ Проверьте актуальные правила/цены перед визитом  
- 🌞 Лучшее время: утро или ближе к закату  
- 👕 Удобная обувь; для храмов — закрытая одежда  
- 🐾 Соблюдайте правила поведения и чистоту

## Локальная ценность

Место заметно в городской жизни: сюда приходят за впечатлениями и локальным контекстом. Оно поддерживает туристическую экономику и помогает сохранять культурный/природный ландшафт района.

## Лучшие точки для фото

- 📷 Главную точку/фасад  
- 📷 Детали (архитектура/интерьер/подача)  
- 🌅 Свет в золотой час (закат/рассвет)

## Практическая информация

- **Адрес:** по координатам (уточняется)  
- **Сайт / соцсети:** —  
- **Контакты:** —

## Почему это важно?

- 🌟 Сочетание искусства и кухни  
- 🌍 Культурное пространство  
- 📸 Атмосферные интерьеры

## Билеты и посещение

- 💰 Уточняется (цены могут меняться)  
- 🎟️ Если есть туры/экскурсии — уточняйте на месте  
- 🆓 Бесплатные зоны/часы: уточняется
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍷 The Riverside Bar & Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'cnx-the-riverside-bar-restaurant',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Фирменное блюдо/напиток заведения  
- 🍽️ Ещё одна популярная позиция из меню  
- 🍽️ Попробовать сезонный/локальный специалитет (если есть)

## Как добраться

- 🚶 Пешком — если вы уже в центре/рядом  
- 🚕 Такси / Grab (самый удобный вариант)  
- 🚌 Общественный транспорт: уточняется  
- 🗺️ Ориентир: по координатам

## Полезные нюансы

- ⚠️ Проверьте актуальные правила/цены перед визитом  
- 🌞 Лучшее время: утро или ближе к закату  
- 👕 Удобная обувь; для храмов — закрытая одежда  
- 🐾 Соблюдайте правила поведения и чистоту

## Локальная ценность

Место заметно в городской жизни: сюда приходят за впечатлениями и локальным контекстом. Оно поддерживает туристическую экономику и помогает сохранять культурный/природный ландшафт района.

## Лучшие точки для фото

- 📷 Главную точку/фасад  
- 📷 Детали (архитектура/интерьер/подача)  
- 🌅 Свет в золотой час (закат/рассвет)

## Практическая информация

- **Адрес:** по координатам (уточняется)  
- **Сайт / соцсети:** —  
- **Контакты:** —

## Почему это важно?

- 🌟 Музыка и атмосфера  
- 🌍 Вечерний отдых у воды  
- 📸 Ночная жизнь Чиангмая

## Билеты и посещение

- 💰 Уточняется (цены могут меняться)  
- 🎟️ Если есть туры/экскурсии — уточняйте на месте  
- 🆓 Бесплатные зоны/часы: уточняется
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍲 Dash! Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'cnx-dash-restaurant',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Фирменное блюдо/напиток заведения  
- 🍽️ Ещё одна популярная позиция из меню  
- 🍽️ Попробовать сезонный/локальный специалитет (если есть)

## Как добраться

- 🚶 Пешком — если вы уже в центре/рядом  
- 🚕 Такси / Grab (самый удобный вариант)  
- 🚌 Общественный транспорт: уточняется  
- 🗺️ Ориентир: по координатам

## Полезные нюансы

- ⚠️ Проверьте актуальные правила/цены перед визитом  
- 🌞 Лучшее время: утро или ближе к закату  
- 👕 Удобная обувь; для храмов — закрытая одежда  
- 🐾 Соблюдайте правила поведения и чистоту

## Локальная ценность

Место заметно в городской жизни: сюда приходят за впечатлениями и локальным контекстом. Оно поддерживает туристическую экономику и помогает сохранять культурный/природный ландшафт района.

## Лучшие точки для фото

- 📷 Главную точку/фасад  
- 📷 Детали (архитектура/интерьер/подача)  
- 🌅 Свет в золотой час (закат/рассвет)

## Практическая информация

- **Адрес:** по координатам (уточняется)  
- **Сайт / соцсети:** —  
- **Контакты:** —

## Почему это важно?

- 🌟 Северная кухня  
- 🌍 Традиционный интерьер  
- 📸 Аутентичная подача

## Билеты и посещение

- 💰 Уточняется (цены могут меняться)  
- 🎟️ Если есть туры/экскурсии — уточняйте на месте  
- 🆓 Бесплатные зоны/часы: уточняется
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🥐 Fern Forest Café
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'cnx-fern-forest-cafe',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽️ Фирменное блюдо/напиток заведения  
- 🍽️ Ещё одна популярная позиция из меню  
- 🍽️ Попробовать сезонный/локальный специалитет (если есть)

## Как добраться

- 🚶 Пешком — если вы уже в центре/рядом  
- 🚕 Такси / Grab (самый удобный вариант)  
- 🚌 Общественный транспорт: уточняется  
- 🗺️ Ориентир: по координатам

## Полезные нюансы

- ⚠️ Проверьте актуальные правила/цены перед визитом  
- 🌞 Лучшее время: утро или ближе к закату  
- 👕 Удобная обувь; для храмов — закрытая одежда  
- 🐾 Соблюдайте правила поведения и чистоту

## Локальная ценность

Место заметно в городской жизни: сюда приходят за впечатлениями и локальным контекстом. Оно поддерживает туристическую экономику и помогает сохранять культурный/природный ландшафт района.

## Лучшие точки для фото

- 📷 Главную точку/фасад  
- 📷 Детали (архитектура/интерьер/подача)  
- 🌅 Свет в золотой час (закат/рассвет)

## Практическая информация

- **Адрес:** по координатам (уточняется)  
- **Сайт / соцсети:** —  
- **Контакты:** —

## Почему это важно?

- 🌟 Лучшие завтраки  
- 🌍 Уютная атмосфера  
- 📸 Зелёный дворик

## Билеты и посещение

- 💰 Уточняется (цены могут меняться)  
- 🎟️ Если есть туры/экскурсии — уточняйте на месте  
- 🆓 Бесплатные зоны/часы: уточняется
',
  'mixed',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏖️ Hua Hin Beach
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hhn-hua-hin-beach',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Один из самых спокойных курортных пляжей Таиланда  
- 🌍 Исторический королевский курорт  
- 📸 Белый песок, лошади на пляже и мягкие закаты

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Аренда лежаков — платно  
- 🆓 Общественный пляж

## Лучшие точки для фото

- 📷 Береговую линию  
- 📷 Лошадей на фоне моря  
- 🌅 Закат

## Практическая информация

- **Адрес:** Hua Hin, Prachuap Khiri Khan

## Как добраться

- 🚶 Пешком из центра Хуахина  
- 🚕 Такси  
- 🚌 Поезда и автобусы до Hua Hin  
- 🗺️ Побережье города

## Полезные нюансы

- ⚠️ Возможны сильные ветра  
- 🌞 Лучшее время — утро и вечер  
- 👕 Пляжная одежда  
- 🐾 Лошади на пляже — соблюдайте дистанцию

## Локальная ценность

Пляж формирует основу туристического имиджа Хуахина и поддерживает локальный сервис и семейный бизнес.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🚉 Hua Hin Railway Station
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hhn-hua-hin-railway-station',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Архитектурный символ Хуахина  
- 🌍 Историческая станция королевского курорта  
- 📸 Яркие павильоны и поезда

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободный вход

## Лучшие точки для фото

- 📷 Королевский павильон  
- 📷 Поезда  
- 🌅 Детали архитектуры

## Практическая информация

- **Адрес:** Hua Hin Railway Station

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Такси  
- 🚌 Поезд из Бангкока  
- 🗺️ Центральный Хуахин

## Полезные нюансы

- ⚠️ Рабочая станция — соблюдайте безопасность  
- 🌞 Лучше днём  
- 👕 Повседневная одежда  
- 🐾 —

## Локальная ценность

Станция — символ эпохи, когда Хуахин стал королевским курортом Таиланда.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🎨 Cicada Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hhn-cicada-market',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самый атмосферный рынок Хуахина  
- 🌍 Центр местного искусства  
- 📸 Свет, арт и музыка

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Покупки — платно  
- 🆓 Вход свободный

## Лучшие точки для фото

- 📷 Арт-лавки  
- 📷 Сцену  
- 🌅 Вечерний свет

## Практическая информация

- **Адрес:** Cicada Market, Hua Hin

## Как добраться

- 🚕 Такси  
- 🛵 Байк  
- 🗺️ Юг Хуахина

## Полезные нюансы

- ⚠️ Работает не каждый день  
- 🌞 Лучшее время — вечер  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Рынок поддерживает местных художников и ремесленников Хуахина.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🐒 Khao Takiab
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hhn-khao-takiab',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Панорамный вид на Хуахин  
- 🌍 Буддийский храм  
- 📸 Город и море с высоты

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободный вход

## Лучшие точки для фото

- 📷 Вид на город  
- 📷 Храм  
- 🌅 Побережье

## Практическая информация

- **Адрес:** Khao Takiab, Hua Hin

## Как добраться

- 🚕 Такси  
- 🛵 Байк  
- 🗺️ Южный Хуахин

## Полезные нюансы

- ⚠️ Берегите вещи от обезьян  
- 🌞 Лучше утром  
- 👕 Удобная обувь  
- 🐾 Не кормить животных

## Локальная ценность

Место сочетает духовную и природную ценность и является популярным у местных жителей.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🕳️ Phraya Nakhon Cave
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hhn-phraya-nakhon-cave',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Одна из самых необычных достопримечательностей Таиланда  
- 🌍 Королевское наследие  
- 📸 Павильон в луче солнца

## Билеты и посещение

- 💰 Вход в парк — платно  
- 🎟️ Экосбор  
- 🆓 —

## Лучшие точки для фото

- 📷 Павильон  
- 📷 Луч света  
- 🌅 Контраст света и тени

## Практическая информация

- **Адрес:** Sam Roi Yot NP

## Как добраться

- 🚕 Такси  
- 🚤 Лодка + пешком  
- 🗺️ Национальный парк Sam Roi Yot

## Полезные нюансы

- ⚠️ Жаркий подъём  
- 🌞 Лучшее время — утро  
- 👕 Удобная обувь  
- 🐾 Вода обязательна

## Локальная ценность

Пещера — часть национального парка и важный объект сохранения природного наследия региона.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 💦 Vana Nava Water Jungle
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hhn-vana-nava-water-jungle',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучший аквапарк региона  
- 🌍 Семейный отдых  
- 📸 Яркие зоны и горки

## Билеты и посещение

- 💰 ~1200 THB  
- 🎟️ Билеты дневные  
- 🆓 —

## Лучшие точки для фото

- 📷 Горки  
- 📷 Зоны отдыха  
- 🌅 Панораму парка

## Практическая информация

- **Адрес:** Hua Hin

## Как добраться

- 🚕 Такси  
- 🚌 Трансфер от отелей  
- 🗺️ Юг Хуахина

## Полезные нюансы

- ⚠️ Очереди в высокий сезон  
- 🌞 Приходить утром  
- 👕 Купальная одежда  
- 🐾 —

## Локальная ценность

Парк поддерживает семейный туризм и индустрию развлечений Хуахина.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍹 Let’s Sea Bar
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hhn-let-s-sea-bar',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси  
- 🗺️ Khao Takiab

## Полезные нюансы

- ⚠️ Лучше вечером  
- 🌞 Закат — лучшее время  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Бар поддерживает атмосферу курортного Хуахина и местный сервис.

## Лучшие точки для фото

- 📷 Бар у моря  
- 📷 Коктейли  
- 🌅 Закат

## Практическая информация

- **Адрес:** Khao Takiab, Hua Hin

## Почему это важно?

- 🌟 Коктейли у моря  
- 🌍 Романтическая атмосфера  
- 📸 Закаты

## Билеты и посещение

- 💰 Средний чек — 💵💵  
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

-- Content block for: 🍽️ Baan Itsara Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hhn-baan-itsara-restaurant',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Пешком из центра  
- 🗺️ Пляж Hua Hin

## Полезные нюансы

- ⚠️ Популярно среди туристов  
- 🌞 Лучше днём  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Ресторан сохраняет кулинарные традиции Хуахина и поддерживает локальных поставщиков.

## Лучшие точки для фото

- 📷 Дом и интерьер  
- 📷 Блюда  
- 🌅 Вид на море

## Практическая информация

- **Адрес:** Hua Hin Beach

## Почему это важно?

- 🌟 Аутентичная тайская кухня  
- 🌍 Историческое здание  
- 📸 Вид на море

## Билеты и посещение

- 💰 Средний чек — 💵💵  
- 🎟️ Очереди в часы пик  
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

-- Content block for: 🏖️ Railay Beach
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kbi-railay-beach',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самый фотогеничный пляж региона  
- 🌍 Уникальное сочетание моря и скал  
- 📸 Лагуны, утёсы и лодки long-tail

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Лодка — платно  
- 🆓 Пляж общественный

## Лучшие точки для фото

- 📷 Известняковые скалы  
- 📷 Пляж с лодками  
- 🌅 Закат

## Практическая информация

- **Адрес:** Railay, Krabi  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚤 Лодка long-tail из Ao Nang  
- 🗺️ Западное побережье Краби

## Полезные нюансы

- ⚠️ Многолюдно днём  
- 🌞 Лучшее время — утро  
- 👕 Пляжная одежда  
- 🐾 Осторожно на скалах

## Локальная ценность

Railay поддерживает местные лодочные сообщества и туризм Краби.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏖️ Ao Nang Beach
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kbi-ao-nang-beach',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Туристический центр Краби  
- 🌍 Удобная база для экскурсий  
- 📸 Закаты и побережье

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Лодки — платно  
- 🆓 Общественный пляж

## Лучшие точки для фото

- 📷 Главный вид/панораму (самый узнаваемый ракурс)  
- 📷 Детали: скалы, лагуна, храмовые элементы или природные текстуры  
- 🌅 Свет: на рассвете/закате кадры получаются максимально объёмными

## Практическая информация

- **Адрес:** Ao Nang, Krabi  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси / трансфер  
- 🛵 Байк  
- 🚌 Сонгтэо / лодка (если применимо)  
- 🗺️ Ориентир: туристическая зона Ao Nang

## Полезные нюансы

- ⚠️ В высокий сезон бывает многолюдно — планируйте ранний выезд  
- 🌞 Лучшее время: утро или закат  
- 👕 Одежда: лёгкая; для храмов — закрытые плечи и колени  
- 🐾 Безопасность: солнцезащита, вода; на камнях/скалах осторожно

## Локальная ценность

Эта локация — важная часть туристической экономики Краби: она поддерживает местные лодочные сервисы, гидов, кафе и семейные бизнесы, а также помогает сохранять природные территории через сборы и правила посещения.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏝️ Phi Phi Islands
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kbi-phi-phi-islands',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Открыточные пейзажи  
- 🌍 Национальный парк  
- 📸 Лагуны и скалы

## Билеты и посещение

- 💰 Вход: зависит от локации (часто бесплатно; в парках/экозонах бывает сбор)  
- 🎟️ Туры/трансфер: оплачиваются отдельно, если едете с экскурсией  
- 🆓 Бесплатно: обзор/прогулка и фото в общественных зонах (если доступны)

## Лучшие точки для фото

- 📷 Главный вид/панораму (самый узнаваемый ракурс)  
- 📷 Детали: скалы, лагуна, храмовые элементы или природные текстуры  
- 🌅 Свет: на рассвете/закате кадры получаются максимально объёмными

## Практическая информация

- **Адрес:** Phi Phi Islands, Krabi  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси / трансфер  
- 🛵 Байк  
- 🚌 Сонгтэо / лодка (если применимо)  
- 🗺️ Ориентир: туристическая зона Ao Nang

## Полезные нюансы

- ⚠️ В высокий сезон бывает многолюдно — планируйте ранний выезд  
- 🌞 Лучшее время: утро или закат  
- 👕 Одежда: лёгкая; для храмов — закрытые плечи и колени  
- 🐾 Безоп safety: солнцезащита, вода; на камнях/скалах осторожно

## Локальная ценность

Эта локация — важная часть туристической экономики Краби: она поддерживает местные лодочные сервисы, гидов, кафе и семейные бизнесы, а также помогает сохранять природные территории через сборы и правила посещения.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 💚 Emerald Pool
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kbi-emerald-pool',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Купание в природном бассейне  
- 🌍 Экологическая тропа  
- 📸 Изумрудная вода

## Билеты и посещение

- 💰 Вход: ~200 THB (входит в билет Khao Phra Bang Khram NP)  
- 🎟️ Туры/трансфер: оплачиваются отдельно  
- 🆓 Бесплатно: нет

## Лучшие точки для фото

- 📷 Изумрудную воду  
- 📷 Тропическую растительность  
- 🌅 Свет в кроне деревьев

## Практическая информация

- **Адрес:** Khao Phra Bang Khram Nature Reserve, Krabi  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси / трансфер из Ao Nang (~1 час)  
- 🛵 Байк (только опытным)  
- 🗺️ Национальный парк Khao Phra Bang Khram

## Полезные нюансы

- ⚠️ В высокий сезон — очереди  
- 🌞 Лучшее время: утро  
- 👕 Удобная обувь, купальник  
- 🐾 Не оставляйте мусор

## Локальная ценность

Emerald Pool — часть охраняемого национального парка и пример устойчивого экотуризма в регионе.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🐯 Tiger Cave Temple
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kbi-tiger-cave-temple',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучший вид на Краби  
- 🌍 Духовное место  
- 📸 Панорамы и статуи

## Билеты и посещение

- 💰 Вход: бесплатно  
- 🎟️ Пожертвования приветствуются  
- 🆓 Бесплатно

## Лучшие точки для фото

- 📷 Панораму с вершины  
- 📷 Ступени и лестницы  
- 🌅 Рассвет над джунглями

## Практическая информация

- **Адрес:** Wat Tham Suea, Krabi  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси / трансфер из Ao Nang (~20 мин)  
- 🛵 Байк  
- 🗺️ Север Краби

## Полезные нюансы

- ⚠️ Подъём очень крутой — не для всех  
- 🌞 Лучшее время: утро (меньше жара)  
- 👕 Удобная обувь, вода обязательна  
- 🐾 Уважайте религиозное место

## Локальная ценность

Храм — важный духовный центр южного Таиланда и место паломничества буддистов.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏝️ Hong Islands
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kbi-hong-islands',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Бирюзовые лагуны  
- 🌍 Морской национальный парк  
- 📸 Пляжи и скалы

## Билеты и посещение

- 💰 Тур: ~1200–1800 THB  
- 🎟️ Включает лодку, обед, снаряжение  
- 🆓 Бесплатно: нет

## Лучшие точки для фото

- 📷 Лагуну с воздуха (с лодки)  
- 📷 Коралловые рифы под водой  
- 🌅 Закат на пляже Koh Pak Bia

## Практическая информация

- **Адрес:** Hong Islands, Krabi  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚤 Только на организованной лодке из Ao Nang  
- 🗺️ Морской национальный парк

## Полезные нюансы

- ⚠️ Бронируйте тур заранее  
- 🌞 Лучший сезон: ноябрь–апрель  
- 👕 Купальник, акваобувь, солнцезащита  
- 🐾 Не трогайте кораллы

## Локальная ценность

Туры поддерживают местные лодочные кооперативы и систему охраны морского парка.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏔️ Khao Khanab Nam
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kbi-khao-khanab-nam',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Символ Краби  
- 🌍 Природная достопримечательность  
- 📸 Скалы у реки

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Бесплатно

## Лучшие точки для фото

- 📷 Скалы с отражением в воде  
- 📷 Вид с моста  
- 🌅 Закат над рекой

## Практическая информация

- **Адрес:** Krabi Town, Krabi  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси из центра Краби (~10 мин)  
- 🚶 Пешком из старого города  
- 🗺️ Устье реки Краби

## Полезные нюансы

- ⚠️ Нет тени — берите зонт  
- 🌞 Лучшее время: утро или вечер  
- 👕 Лёгкая одежда  
- 🐾 —

## Локальная ценность

Скалы — официальный символ провинции Краби и часто изображаются на сувенирах и логотипах.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍽️ The Grotto Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'kbi-the-grotto-restaurant',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚤 Лодка long-tail до Railay West  
- 🗺️ Пляж Railay

## Полезные нюансы

- ⚠️ Бронируйте заранее — мало мест  
- 🌞 Лучшее время: закат  
- 👕 Smart casual  
- 🐾 —

## Локальная ценность

The Grotto — один из самых романтичных ресторанов Таиланда, поддерживающий премиум-туризм Краби.

## Лучшие точки для фото

- 📷 Интерьер пещеры  
- 📷 Подачу блюд при свечах  
- 🌅 Вид на море на закате

## Практическая информация

- **Адрес:** Railay Beach, Krabi  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Ужин в пещере  
- 🌍 Уникальная локация  
- 📸 Вид на море

## Билеты и посещение

- 💰 Средний чек: 800–1500 THB  
- 🎟️ Бронирование рекомендуется  
- 🆓 Бесплатно: вода
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏖️ Patong Beach
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phk-patong-beach',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Главный курортный пляж Пхукета  
- 🌍 Центр туристической и ночной жизни острова  
- 📸 Закаты, длинная береговая линия, огни Bangla Road

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Аренда лежаков и зонтов — платно  
- 🆓 Пляж общественный

## Лучшие точки для фото

- 📷 Береговую линию  
- 📷 Закат над Андаманским морем  
- 🌅 Ночную Bangla Road

## Практическая информация

- **Адрес:** Patong, Kathu District  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси / Grab  
- 🛵 Байк  
- 🚌 Сонгтэо из Пхукет-тауна  
- 🗺️ Западное побережье острова

## Полезные нюансы

- ⚠️ Многолюдно в высокий сезон  
- 🌞 Лучшее время — утро и закат  
- 👕 Пляжная одежда  
- 🐾 Следите за личными вещами

## Локальная ценность

Patong Beach является ключевым источником дохода для местного населения и основой туристической экономики Пхукета.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🗿 Big Buddha Phuket
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phk-big-buddha-phuket',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Один из главных символов острова  
- 🌍 Религиозное и смотровое место  
- 📸 Панорамы побережья и холмов

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Пожертвования приветствуются  
- 🆓 Свободный вход

## Лучшие точки для фото

- 📷 Статую на фоне неба  
- 📷 Вид на южный Пхукет  
- 🌅 Закат с обзорной площадки

## Практическая информация

- **Адрес:** Chalong, Phuket  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси  
- 🛵 Байк  
- 🗺️ Район Chalong

## Полезные нюансы

- ⚠️ Обязательна закрытая одежда  
- 🌞 Лучше приезжать утром  
- 👕 Закрытые плечи и колени  
- 🐾 Тихое поведение

## Локальная ценность

Место служит духовным ориентиром для жителей острова и центром благотворительных инициатив.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌅 Promthep Cape
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phk-promthep-cape',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучший закат острова  
- 🌍 Природная достопримечательность  
- 📸 Скалы и океан

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Не требуется  
- 🆓 Свободный доступ

## Лучшие точки для фото

- 📷 Мыс с высоты  
- 📷 Солнце над океаном  
- 🌅 Силуэты людей на фоне заката

## Практическая информация

- **Адрес:** Rawai, Phuket  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси  
- 🛵 Байк  
- 🗺️ Южная часть острова

## Полезные нюансы

- ⚠️ Много туристов на закате  
- 🌞 Приходить заранее  
- 👕 Удобная обувь  
- 🐾 Осторожно на скалах

## Локальная ценность

Promthep Cape остаётся культовым местом встреч и символом Пхукета для местных жителей.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏘️ Old Phuket Town
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phk-old-phuket-town',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самый колоритный район острова  
- 🌍 Историческое наследие Пхукета  
- 📸 Фасады и уличная жизнь

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Музеи — платно  
- 🆓 Прогулка свободная

## Лучшие точки для фото

- 📷 Цветные фасады  
- 📷 Уличные сцены  
- 🌅 Вечернюю подсветку

## Практическая информация

- **Адрес:** Phuket Town  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси  
- 🛵 Байк  
- 🚌 Сонгтэо из Патонга  
- 🗺️ Центр Пхукет-тауна

## Полезные нюансы

- ⚠️ Жарко днём  
- 🌞 Лучшее время — утро и вечер  
- 👕 Лёгкая одежда  
- 🐾 Воскресный рынок вечером

## Локальная ценность

Old Town сохраняет историческую идентичность острова и поддерживает локальный бизнес и культуру.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏝️ Phi Phi Islands
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phk-phi-phi-islands',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Открыточные виды  
- 🌍 Национальный парк  
- 📸 Лагуны и скалы

## Билеты и посещение

- 💰 Экскурсии от 1500 THB  
- 🎟️ Тур пакетами  
- 🆓 Купание включено

## Лучшие точки для фото

- 📷 Лагуны  
- 📷 Известняковые скалы  
- 🌅 Виды с лодки

## Практическая информация

- **Адрес:** Pier Phuket  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚤 Катер с Пхукета  
- 🗺️ Восточное направление

## Полезные нюансы

- ⚠️ Ограничения на посещение Maya Bay  
- 🌞 Лучше утренние туры  
- 👕 Купальная одежда  
- 🐾 Экологические правила

## Локальная ценность

Экскурсии поддерживают морские сообщества и экотуризм региона.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍽️ Blue Elephant Phuket
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phk-blue-elephant-phuket',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌟 Икона тайской кухни  
- 🌍 Историческое здание  
- 📸 Элегантная подача

## Как добраться

- 🚕 Такси  
- 🛵 Байк  
- 🗺️ Phuket Town

## Полезные нюансы

- ⚠️ Smart casual  
- 🌞 Подходит для вечера  
- 👕 Элегантная одежда  
- 🐾 Не допускаются животные

## Локальная ценность

Ресторан сохраняет традиции тайской кухни и привлекает гастрономический туризм.

## Лучшие точки для фото

- 📷 Интерьеры  
- 📷 Подачу блюд  
- 🌅 Вечернюю атмосферу

## Практическая информация

- **Адрес:** Phuket Town  
- **Сайт:** —  
- **Телефон:** —

## Билеты и посещение

- 💰 Высокий чек  
- 🎟️ Бронирование рекомендуется  
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

-- Content block for: 🍜 Raya Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phk-raya-restaurant',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌟 Аутентичная кухня  
- 🌍 Семейные традиции  
- 📸 Исторический интерьер

## Как добраться

- 🚕 Такси  
- 🛵 Байк  
- 🗺️ Phuket Town

## Полезные нюансы

- ⚠️ Популярно среди туристов  
- 🌞 Лучше днём  
- 👕 Повседневная одежда  
- 🐾 —

## Локальная ценность

Raya Restaurant поддерживает традиционную гастрономию Пхукета и локальных поставщиков.

## Лучшие точки для фото

- 📷 Интерьер  
- 📷 Блюда  
- 🌅 Атмосферу зала

## Практическая информация

- **Адрес:** Phuket Town  
- **Сайт:** —  
- **Телефон:** —

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ Очереди в пиковые часы  
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

-- Content block for: 🦞 Kan Eang@Pier
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phk-kan-eang-pier',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌟 Свежие морепродукты  
- 🌍 Ужин у воды  
- 📸 Закаты над заливом

## Как добраться

- 🚕 Такси  
- 🛵 Байк  
- 🗺️ Chalong Pier

## Полезные нюансы

- ⚠️ Лучше бронировать вечером  
- 🌞 Закат — лучшее время  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Заведение поддерживает местных рыбаков и гастрономическую культуру острова.

## Лучшие точки для фото

- 📷 Террасу у воды  
- 📷 Морепродукты  
- 🌅 Закат над пирсом

## Практическая информация

- **Адрес:** Chalong, Phuket  
- **Сайт:** —  
- **Телефон:** —

## Билеты и посещение

- 💰 Средний и высокий чек  
- 🎟️ Бронирование рекомендуется  
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

-- Content block for: 🌿 Three Monkeys Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phk-three-monkeys-restaurant',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌟 Один из самых атмосферных ресторанов острова  
- 🌍 Сочетание природы, дизайна и кухни  
- 📸 Джунгли, деревянные террасы и панорамы

## Как добраться

- 🚕 Такси / Grab  
- 🛵 Байк  
- 🗺️ Холмы рядом с Phuket Town

## Полезные нюансы

- ⚠️ Популярно на закате  
- 🌞 Лучшее время — вечер  
- 👕 Casual chic  
- 🐾 Животные не допускаются

## Локальная ценность

Ресторан стал примером экологичного дизайна и точкой притяжения для гастрономического туризма Пхукета.

## Лучшие точки для фото

- 📷 Террасы среди деревьев  
- 📷 Вид на город  
- 🌅 Закат в джунглях

## Практическая информация

- **Адрес:** Ratsada, Phuket  
- **Сайт:** —  
- **Телефон:** —

## Билеты и посещение

- 💰 Средний чек — 💵💵 – 💎  
- 🎟️ Бронирование рекомендуется вечером  
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

-- Content block for: ☕ Café Phuket Viewpoint
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phk-cafe-phuket-viewpoint',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌟 Лучшие панорамные виды на побережье  
- 🌍 Кофе с видом на Андаманское море  
- 📸 Открыточные кадры

## Как добраться

- 🚕 Такси  
- 🛵 Байк  
- 🗺️ Смотровая дорога между Karon и Kata

## Полезные нюансы

- ⚠️ Многолюдно днём  
- 🌞 Лучшее время — утро и закат  
- 👕 Лёгкая одежда  
- 🐾 —

## Локальная ценность

Кафе стало популярной точкой для локального туризма и фотографов.

## Лучшие точки для фото

- 📷 Панораму побережья  
- 📷 Террасу  
- 🌅 Закат над морем

## Практическая информация

- **Адрес:** Viewpoint Karon – Kata  
- **Сайт:** —  
- **Телефон:** —

## Билеты и посещение

- 💰 Средний чек — 💵💵  
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

-- Content block for: 🍷 Baan Rim Pa
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phk-baan-rim-pa',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌟 Один из самых романтичных ресторанов Пхукета  
- 🌍 Классическая гастрономия острова  
- 📸 Вид на закат над заливом Патонг

## Как добраться

- 🚕 Такси / Grab  
- 🛵 Байк  
- 🗺️ Северная часть Patong Beach

## Полезные нюансы

- ⚠️ Элегантный дресс-код  
- 🌞 Лучшее время — закат  
- 👕 Smart casual  
- 🐾 —

## Локальная ценность

Ресторан давно считается гастрономической визитной карточкой Пхукета и местом особых событий.

## Лучшие точки для фото

- 📷 Террасу над морем  
- 📷 Закат  
- 🌅 Вечернюю подсветку

## Практическая информация

- **Адрес:** Kalim Bay, Patong  
- **Сайт:** —  
- **Телефон:** —

## Билеты и посещение

- 💰 Ценовой сегмент — 💎 Premium  
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

-- Content block for: 🍲 No.6 Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phk-no-6-restaurant',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌟 Вкусно и недорого  
- 🌍 Популярное место среди местных  
- 📸 Атмосфера скрытого дворика

## Как добраться

- 🚕 Пешком по Старому городу  
- 🛵 Байк  
- 🗺️ Phuket Town

## Полезные нюансы

- ⚠️ Мало мест  
- 🌞 Лучше приходить рано  
- 👕 Повседневная одежда  
- 🐾 —

## Локальная ценность

Заведение отражает демократичную гастрономическую культуру Пхукета и ориентировано на местных жителей.

## Лучшие точки для фото

- 📷 Дворик  
- 📷 Блюда  
- 🌅 Уютную атмосферу

## Практическая информация

- **Адрес:** Phuket Town  
- **Сайт:** —  
- **Телефон:** —

## Билеты и посещение

- 💰 Ценовой сегмент — 💰 Budget – Mid  
- 🎟️ Очереди в часы пик  
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

-- Content block for: 🏖️ Pattaya Beach
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pty-pattaya-beach',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Главный городской пляж Паттайи  
- 🌍 Центр курортной инфраструктуры  
- 📸 Набережная, лодки и городские виды

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Лежаки и зонты — платно  
- 🆓 Общественный пляж

## Лучшие точки для фото

- 📷 Набережную  
- 📷 Пляж с высоты  
- 🌅 Закат

## Практическая информация

- **Адрес:** Beach Rd, Pattaya  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Такси / Grab  
- 🚌 Сонгтэо вдоль Beach Road  
- 🗺️ Центральная Паттайя

## Полезные нюансы

- ⚠️ Многолюдно днём  
- 🌞 Лучшее время — утро и вечер  
- 👕 Пляжная одежда  
- 🐾 Следите за вещами

## Локальная ценность

Пляж является основой туристической экономики города и рабочим местом для тысяч жителей.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌃 Walking Street
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pty-walking-street',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Сердце ночной жизни города  
- 🌍 Знаковая туристическая улица  
- 📸 Неон, огни и атмосфера

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Вход в клубы — по условиям заведений  
- 🆓 Прогулка свободная

## Лучшие точки для фото

- 📷 Неоновые вывески  
- 📷 Толпы туристов  
- 🌅 Ночные огни

## Практическая информация

- **Адрес:** Walking St, Pattaya  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси  
- 🚌 Сонгтэо  
- 🗺️ Южная Паттайя

## Полезные нюансы

- ⚠️ Только для взрослых  
- 🌞 Лучшее время — вечер  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Walking Street формирует ночной образ Паттайи и привлекает международный турпоток.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛕 Sanctuary of Truth
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pty-sanctuary-of-truth',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Уникальная деревянная архитектура  
- 🌍 Философский и культурный комплекс  
- 📸 Детализированная резьба

## Билеты и посещение

- 💰 ~500 THB  
- 🎟️ Экскурсия включена  
- 🆓 —

## Лучшие точки для фото

- 📷 Фасад храма  
- 📷 Детали резьбы  
- 🌅 Вид на залив

## Практическая информация

- **Адрес:** Naklua, Pattaya  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси  
- 🛵 Байк  
- 🗺️ Северная Паттайя

## Полезные нюансы

- ⚠️ Каска выдаётся на входе  
- 🌞 Лучше утром  
- 👕 Закрытая обувь  
- 🐾 —

## Локальная ценность

Храм поддерживает традиции тайской резьбы по дереву и ремесленные школы.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌸 Nong Nooch Tropical Garden
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pty-nong-nooch-tropical-garden',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучший ботанический сад региона  
- 🌍 Культурные шоу  
- 📸 Ландшафтные сады

## Билеты и посещение

- 💰 ~600 THB  
- 🎟️ Билеты с шоу  
- 🆓 —

## Лучшие точки для фото

- 📷 Сады  
- 📷 Скульптуры  
- 🌅 Панорамы

## Практическая информация

- **Адрес:** Na Jomtien  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси  
- 🚌 Экскурсия  
- 🗺️ Восток от Паттайи

## Полезные нюансы

- ⚠️ Большая территория  
- 🌞 Закладывайте 3–4 часа  
- 👕 Удобная обувь  
- 🐾 —

## Локальная ценность

Парк поддерживает экотуризм и культурные традиции Таиланда.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏖️ Jomtien Beach
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pty-jomtien-beach',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Спокойнее, чем центр  
- 🌍 Подходит для семей  
- 📸 Просторный пляж

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Лежаки — платно  
- 🆓 Пляж общественный

## Лучшие точки для фото

- 📷 Пляж  
- 📷 Парасейлинг  
- 🌅 Закат

## Практическая информация

- **Адрес:** Jomtien, Pattaya  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси  
- 🚌 Сонгтэо  
- 🗺️ Южная Паттайя

## Полезные нюансы

- ⚠️ Ветрено в сезон  
- 🌞 Лучшее время — утро  
- 👕 Пляжная одежда  
- 🐾 —

## Локальная ценность

Jomtien Beach поддерживает семейный туризм и долгосрочное проживание.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🗿 Big Buddha Hill
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pty-big-buddha-hill',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Панорама города  
- 🌍 Духовное место  
- 📸 Вид на залив

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Пожертвования приветствуются  
- 🆓 Свободный вход

## Лучшие точки для фото

- 📷 Панораму Паттайи  
- 📷 Статую  
- 🌅 Закат

## Практическая информация

- **Адрес:** Pratumnak Hill, Pattaya  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси  
- 🛵 Байк  
- 🗺️ Pratumnak Hill

## Полезные нюансы

- ⚠️ Закрытая одежда  
- 🌞 Утро лучше всего  
- 👕 Закрытые плечи и колени  
- 🐾 —

## Локальная ценность

Место служит духовным ориентиром и смотровой точкой города.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍹 Horizon Rooftop Bar
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pty-horizon-rooftop-bar',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси  
- 🗺️ Северная Паттайя

## Полезные нюансы

- ⚠️ Smart casual  
- 🌞 Лучшее время — закат  
- 👕 Опрятная одежда  
- 🐾 —

## Локальная ценность

Бар формирует современный гастрономический образ Паттайи.

## Лучшие точки для фото

- 📷 Вид на город  
- 📷 Коктейли  
- 🌅 Закат

## Практическая информация

- **Адрес:** Pattaya  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Панорама города  
- 🌍 Коктейли и закаты  
- 📸 Ночные виды

## Билеты и посещение

- 💰 Средний чек — 💵💵  
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

-- Content block for: 🥂 The Glass House
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pty-the-glass-house',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси  
- 🗺️ Южная Паттайя

## Полезные нюансы

- ⚠️ Популярно вечером  
- 🌞 Лучшее время — закат  
- 👕 Casual chic  
- 🐾 —

## Локальная ценность

Ресторан поддерживает локальных рыбаков и гастрономическую культуру региона.

## Лучшие точки для фото

- 📷 Террасу  
- 📷 Блюда  
- 🌅 Вечерний свет

## Практическая информация

- **Адрес:** Jomtien / South Pattaya  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Ужин у моря  
- 🌍 Романтическая обстановка  
- 📸 Вид на залив

## Билеты и посещение

- 💰 Средний чек — 💵💵  
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

-- Content block for: 🦐 Mum Aroi
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pty-mum-aroi',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси  
- 🗺️ Северная Паттайя

## Полезные нюансы

- ⚠️ Шумно  
- 🌞 Лучше днём  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Ресторан отражает гастрономическую культуру Паттайи и ориентирован на местных жителей.

## Лучшие точки для фото

- 📷 Блюда  
- 📷 Зал  
- 🌅 Атмосферу

## Практическая информация

- **Адрес:** Pattaya  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Свежие морепродукты  
- 🌍 Популярен у местных  
- 📸 Аутентичная атмосфера

## Билеты и посещение

- 💰 Средний чек  
- 🎟️ Очереди в часы пик  
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

-- Content block for: 🏖️ Chaweng Beach
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'usm-chaweng-beach',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Главный пляж Самуи с лучшей инфраструктурой  
- 🌍 Центр курортной жизни и ночных развлечений  
- 📸 Длинная береговая линия, пальмы и рассветы

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Лежаки и зонты — платно  
- 🆓 Пляж общественный

## Лучшие точки для фото

- 📷 Береговую линию  
- 📷 Пальмы у воды  
- 🌅 Рассвет

## Практическая информация

- **Адрес:** Chaweng, Koh Samui  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси  
- 🛵 Байк  
- 🚌 Сонгтэо вдоль восточного побережья  
- 🗺️ Восточная часть острова

## Полезные нюансы

- ⚠️ Многолюдно в высокий сезон  
- 🌞 Лучшее время — утро  
- 👕 Пляжная одежда  
- 🐾 Следите за личными вещами

## Локальная ценность

Chaweng Beach — основной туристический и экономический центр Самуи, обеспечивающий занятость местного населения.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏖️ Lamai Beach
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'usm-lamai-beach',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Баланс отдыха и инфраструктуры  
- 🌍 Менее шумно, чем Чавенг  
- 📸 Камни, пальмы и море

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Лежаки — платно  
- 🆓 Общественный пляж

## Лучшие точки для фото

- 📷 Каменистые участки  
- 📷 Пляж с пальмами  
- 🌅 Закат

## Практическая информация

- **Адрес:** Lamai, Koh Samui  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси  
- 🛵 Байк  
- 🚌 Сонгтэо  
- 🗺️ Юго-восток острова

## Полезные нюансы

- ⚠️ Волны в ветреный сезон  
- 🌞 Лучшее время — утро и вечер  
- 👕 Пляжная одежда  
- 🐾 —

## Локальная ценность

Lamai Beach поддерживает устойчивый туризм и семейный бизнес острова.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛕 Big Buddha Temple
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'usm-big-buddha-temple',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Главный духовный символ Самуи  
- 🌍 Религиозный центр острова  
- 📸 Вид на залив и храм

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Пожертвования приветствуются  
- 🆓 Свободный вход

## Лучшие точки для фото

- 📷 Статую на фоне неба  
- 📷 Храмовый комплекс  
- 🌅 Вид на море

## Практическая информация

- **Адрес:** Big Buddha, Koh Samui  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси  
- 🛵 Байк  
- 🗺️ Север острова, Big Buddha Beach

## Полезные нюансы

- ⚠️ Закрытая одежда обязательна  
- 🌞 Лучше утром  
- 👕 Закрытые плечи и колени  
- 🐾 Тихое поведение

## Локальная ценность

Храм является важным местом поклонения и символом духовной жизни Самуи.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 💦 Na Muang Waterfalls
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'usm-na-muang-waterfalls',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучшие водопады Самуи  
- 🌍 Природная зона отдыха  
- 📸 Тропический лес

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Парковка — платно  
- 🆓 Вход свободный

## Лучшие точки для фото

- 📷 Каскады воды  
- 📷 Купание  
- 🌅 Свет в лесу

## Практическая информация

- **Адрес:** Na Muang, Koh Samui  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси  
- 🛵 Байк  
- 🗺️ Центральная часть острова

## Полезные нюансы

- ⚠️ Скользкие камни  
- 🌞 Лучше после дождей  
- 👕 Удобная обувь  
- 🐾 Осторожно при купании

## Локальная ценность

Водопады поддерживают экотуризм и сохраняют природное наследие Самуи.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌊 Fisherman’s Village
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'usm-fisherman-s-village',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самая атмосферная набережная Самуи  
- 🌍 Историческое поселение рыбаков  
- 📸 Огни, деревянные дома и море

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Еда и покупки — платно  
- 🆓 Прогулка свободная

## Лучшие точки для фото

- 📷 Набережную  
- 📷 Рестораны у воды  
- 🌅 Закат

## Практическая информация

- **Адрес:** Bophut, Koh Samui  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси  
- 🛵 Байк  
- 🗺️ Север острова, Bophut

## Полезные нюансы

- ⚠️ Многолюдно по вечерам  
- 🌞 Лучшее время — закат  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Район поддерживает локальный бизнес и сохраняет историческую идентичность Самуи.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏝️ Ang Thong National Marine Park
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'usm-ang-thong-national-marine-park',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучший однодневный тур с Самуи  
- 🌍 Национальный парк  
- 📸 Лагуны и острова

## Билеты и посещение

- 💰 Экскурсии от 2000 THB  
- 🎟️ Вход в парк включён  
- 🆓 Купание включено

## Лучшие точки для фото

- 📷 Лагуны  
- 📷 Острова  
- 🌅 Виды с высоты

## Практическая информация

- **Адрес:** Ang Thong Marine Park  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚤 Катер с Самуи  
- 🗺️ Запад от острова

## Полезные нюансы

- ⚠️ Ограничения по погоде  
- 🌞 Лучшее время — сухой сезон  
- 👕 Купальная одежда  
- 🐾 Экологические правила

## Локальная ценность

Парк защищает морскую экосистему и поддерживает устойчивый туризм региона.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍹 Coco Tam’s
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'usm-coco-tam-s',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси  
- 🛵 Байк  
- 🗺️ Fisherman’s Village, Bophut

## Полезные нюансы

- ⚠️ Многолюдно вечером  
- 🌞 Лучшее время — закат  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Заведение стало визитной карточкой вечерней жизни Самуи и поддерживает локальную индустрию развлечений.

## Лучшие точки для фото

- 📷 Бар у моря  
- 📷 Огненное шоу  
- 🌅 Закат

## Практическая информация

- **Адрес:** Bophut, Koh Samui  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучший beach bar Самуи  
- 🌍 Вечерняя атмосфера у моря  
- 📸 Огненные шоу

## Билеты и посещение

- 💰 Средний чек — 💵💵  
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

-- Content block for: 🍽️ Dining on the Rocks
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'usm-dining-on-the-rocks',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси  
- 🗺️ Северо-восток острова

## Полезные нюансы

- ⚠️ Элегантный дресс-код  
- 🌞 Лучшее время — закат  
- 👕 Smart casual  
- 🐾 —

## Локальная ценность

Ресторан формирует гастрономический имидж Самуи на международном уровне.

## Лучшие точки для фото

- 📷 Террасы  
- 📷 Подачу блюд  
- 🌅 Вид на море

## Практическая информация

- **Адрес:** Koh Samui  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Один из лучших fine dining Самуи  
- 🌍 Уникальная архитектура  
- 📸 Вид на море с высоты

## Билеты и посещение

- 💰 Ценовой сегмент — 💎 Premium  
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
