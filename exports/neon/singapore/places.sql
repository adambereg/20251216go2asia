-- Places UPSERT (idempotent)
-- Generated from Atlas Content Canon v1 markdown files

-- Place: 🌆 Marina Bay Sands SkyPark (Singapore)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'sgp-marina-bay-sands-skypark',
  'sg',
  'sgp',
  '🌆 Marina Bay Sands SkyPark',
  'sgp-marina-bay-sands-skypark',
  'skyline',
  'showplace',
  'skyline',
  '["skyline","landmark","observation"]'::jsonb,
  'Знаменитая смотровая площадка и бассейн на крыше Marina Bay Sands с панорамным видом на город. - 🔭 Смотровую площадку - 🌃 Вечерний вид на город - 📷 Фото skyline - 🕒 11:00–21:00 - 🌐 Английский - 📶 Интернет - 💳 Карты',
  1.2834,
  103.8607,
  'Marina Bay Sands',
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

-- Place: 🌿 Gardens by the Bay (Singapore)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'sgp-gardens-by-the-bay',
  'sg',
  'sgp',
  '🌿 Gardens by the Bay',
  'sgp-gardens-by-the-bay',
  'park',
  'showplace',
  'park',
  '["park","futurism","nature"]'::jsonb,
  'Футуристический парк с гигантскими «деревьями» Supertree и оранжереями. - 🌳 Supertree Grove - 🌺 Flower Dome - 🌃 Вечернее световое шоу - 🕒 09:00–21:00 - 🌐 Английский - 📶 Интернет - 💳 Карты',
  1.2816,
  103.8636,
  'Gardens by the Bay',
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

-- Place: 🦁 Merlion Park (Singapore)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'sgp-merlion-park',
  'sg',
  'sgp',
  '🦁 Merlion Park',
  'sgp-merlion-park',
  'symbol',
  'showplace',
  'symbol',
  '["symbol","waterfront","city"]'::jsonb,
  'Парк со статуей Мерлиона — мифического символа Сингапура. - 🦁 Статую Мерлиона - 🚶 Прогулку по набережной - 📷 Фото на фоне skyline - 🕒 Круглосуточно - 🌐 Английский - 📶 Интернет - 💳 —',
  1.2868,
  103.8545,
  'Merlion Park',
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

-- Place: 🌸 Singapore Botanic Gardens (Singapore)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'sgp-singapore-botanic-gardens',
  'sg',
  'sgp',
  '🌸 Singapore Botanic Gardens',
  'sgp-singapore-botanic-gardens',
  'unesco',
  'showplace',
  'unesco',
  '["unesco","garden","nature"]'::jsonb,
  'Тропический ботанический сад — объект UNESCO и зелёное сердце города. - 🌸 Orchid Garden - 🚶 Прогулки - 📷 Фото растений - 🕒 05:00–00:00 - 🌐 Английский - 📶 Интернет - 💳 —',
  1.3138,
  103.8159,
  'Botanic Gardens',
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

-- Place: 🏝 Sentosa Island (Singapore)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'sgp-sentosa-island',
  'sg',
  'sgp',
  '🏝 Sentosa Island',
  'sgp-sentosa-island',
  'island',
  'showplace',
  'island',
  '["island","resort","beach"]'::jsonb,
  'Остров развлечений с пляжами, парками и курортами. - 🏖 Пляжи - 🎢 Аттракционы - 🌅 Закат у моря - 🕒 Круглосуточно - 🌐 Английский - 📶 Интернет - 💳 Карты',
  1.2494,
  103.8303,
  'Sentosa Island',
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

-- Place: 💧 Jewel Changi Airport (Singapore)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'sgp-jewel-changi-airport',
  'sg',
  'sgp',
  '💧 Jewel Changi Airport',
  'sgp-jewel-changi-airport',
  'airport',
  'showplace',
  'airport',
  '["airport","architecture","landmark"]'::jsonb,
  'Архитектурный комплекс аэропорта Чанги с водопадом Rain Vortex и садами. - 💦 Rain Vortex - 🛍 Шопинг - 📷 Фото купола - 🕒 Круглосуточно - 🌐 Английский - 📶 Интернет - 💳 Карты',
  1.36,
  103.9894,
  'Changi Airport',
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

-- Place: 🍢 Lau Pa Sat Hawker Centre (Singapore)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'sgp-lau-pa-sat-hawker-centre',
  'sg',
  'sgp',
  '🍢 Lau Pa Sat Hawker Centre',
  'sgp-lau-pa-sat-hawker-centre',
  'hawker',
  'business',
  'hawker',
  '["hawker","street-food","local"]'::jsonb,
  'Один из самых известных фудкортов Сингапура с уличной едой и сатэ. - 🍢 Satay - 🍜 Локальные блюда - 🌃 Ночная атмосфера - 🕒 24/7 - 🌐 Английский - 📶 Интернет - 💳 Наличные, карты',
  1.2806,
  103.8505,
  'Lau Pa Sat',
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

-- Place: 🍸 Atlas Rooftop Bar (Singapore)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'sgp-atlas-rooftop-bar',
  'sg',
  'sgp',
  '🍸 Atlas Rooftop Bar',
  'sgp-atlas-rooftop-bar',
  'bar',
  'business',
  'bar',
  '["bar","luxury","design"]'::jsonb,
  'Люксовый бар в арт-деко интерьере с одной из лучших коллекций джина в мире. - 🍸 Коктейли - 🏛 Интерьер - 🌅 Атмосферу вечера - 🕒 17:00–01:00 - 🌐 Английский - 📶 Wi-Fi - 💳 Карты',
  1.292,
  103.857,
  'Bugis, Singapore',
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

-- Place: 🦀 Jumbo Seafood (Singapore)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'sgp-jumbo-seafood',
  'sg',
  'sgp',
  '🦀 Jumbo Seafood',
  'sgp-jumbo-seafood',
  'seafood',
  'business',
  'seafood',
  '["seafood","restaurant","chili-crab"]'::jsonb,
  'Легендарный ресторан морепродуктов, известный чили-крабом. - 🦀 Chili Crab - 🍤 Морепродукты - 🍚 Рис и соусы - 🕒 12:00–23:00 - 🌐 Английский - 📶 Wi-Fi - 💳 Карты',
  1.2897,
  103.8463,
  'Clarke Quay',
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

-- Place: 🍜 Maxwell Food Centre (Singapore)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'sgp-maxwell-food-centre',
  'sg',
  'sgp',
  '🍜 Maxwell Food Centre',
  'sgp-maxwell-food-centre',
  'hawker',
  'business',
  'hawker',
  '["hawker","local-food","budget"]'::jsonb,
  'Один из самых известных hawker-центров Сингапура, где можно попробовать классические локальные блюда в бюджетном формате. - 🍗 Chicken Rice - 🍜 Локальную лапшу/супы - 🥤 Холодные напитки и десерты - 🕒 08:00–22:00 - 🌐 Английский - 📶 Интернет ограничен - 💳 Наличные (часто), иногда карты/QR',
  1.2801,
  103.8443,
  'Maxwell Food Centre, Singapore',
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

-- Place: 🍽 Odette (Singapore)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'sgp-odette',
  'sg',
  'sgp',
  '🍽 Odette',
  'sgp-odette',
  'fine-dining',
  'business',
  'fine-dining',
  '["fine-dining","premium","restaurant"]'::jsonb,
  'Один из самых известных fine dining ресторанов Сингапура, символ гастрономического уровня города. - 🍽 Дегустационный сет - 🍷 Wine pairing - 🍰 Десерты шефа - 🕒 12:00–14:30, 18:30–22:30 - 🌐 Английский - 📶 Wi-Fi - 💳 Карты',
  1.2906,
  103.8517,
  'National Gallery Singapore',
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

-- Place: 🍹 Long Bar (Singapore)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'sgp-long-bar',
  'sg',
  'sgp',
  '🍹 Long Bar',
  'sgp-long-bar',
  'bar',
  'business',
  'bar',
  '["bar","heritage","cocktail"]'::jsonb,
  'Легендарный бар в Raffles Hotel — родина коктейля Singapore Sling и культовое место колониальной эпохи. - 🍹 Singapore Sling - 🥜 Классические снеки - 🏛 Интерьер Long Bar - 🕒 12:00–23:00 - 🌐 Английский - 📶 Wi-Fi - 💳 Карты',
  1.2949,
  103.8546,
  'Raffles Hotel, Singapore',
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

-- Content block for: 🌆 Marina Bay Sands SkyPark
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgp-marina-bay-sands-skypark',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Главный визуальный символ Сингапура  
- 🌍 Современная архитектура мирового уровня  
- 📸 Skyline Marina Bay

## Билеты и посещение

- 💰 ~30–35 SGD  
- 🎟️ Билет по времени  
- 🆓 —

## Лучшие точки для фото

- 📷 Панораму Marina Bay  
- 📷 Небоскрёбы  
- 🌅 Закат

## Практическая информация

- **Адрес:** Marina Bay Sands  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚇 MRT Bayfront  
- 🚶 Пешком  
- 🗺️ Marina Bay

## Полезные нюансы

- ⚠️ Очереди вечером  
- 🌞 Лучше на закат  
- 👕 Smart casual  
- 🐾 —

## Локальная ценность

SkyPark стал иконой бренда Сингапура как глобального города будущего.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌿 Gardens by the Bay
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgp-gardens-by-the-bay',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самый необычный парк Азии  
- 🌍 Экология и технологии  
- 📸 Supertrees и световые шоу

## Билеты и посещение

- 💰 Парк бесплатно  
- 🎟️ Оранжереи — платно  
- 🆓 Supertrees (с земли)

## Лучшие точки для фото

- 📷 Supertrees  
- 📷 Купола  
- 🌅 Вечернюю подсветку

## Практическая информация

- **Адрес:** Gardens by the Bay  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚇 MRT Bayfront  
- 🚶 Пешком  
- 🗺️ Marina Bay

## Полезные нюансы

- ⚠️ Жарко днём  
- 🌞 Лучше вечером  
- 👕 Лёгкая одежда  
- 🐾 —

## Локальная ценность

Проект символизирует экологический подход Сингапура к урбанистике.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🦁 Merlion Park
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgp-merlion-park',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Национальный символ  
- 🌍 История города-государства  
- 📸 Фото с Marina Bay

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободный доступ

## Лучшие точки для фото

- 📷 Статую  
- 📷 Залив  
- 🌅 Закат

## Практическая информация

- **Адрес:** Merlion Park  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚇 MRT Raffles Place  
- 🚶 Пешком  
- 🗺️ Marina Bay

## Полезные нюансы

- ⚠️ Многолюдно днём  
- 🌞 Лучше утром/вечером  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Мерлион отражает морскую историю и идентичность Сингапура.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌸 Singapore Botanic Gardens
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgp-singapore-botanic-gardens',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Единственный тропический ботсад UNESCO  
- 🌍 Природа в мегаполисе  
- 📸 Орхидеи и тропики

## Билеты и посещение

- 💰 Парк бесплатно  
- 🎟️ Orchid Garden — платно  
- 🆓 Основная территория

## Лучшие точки для фото

- 📷 Орхидеи  
- 📷 Аллеи  
- 🌅 Утренний свет

## Практическая информация

- **Адрес:** Botanic Gardens  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚇 MRT Botanic Gardens  
- 🚶 Пешком  
- 🗺️ Central Singapore

## Полезные нюансы

- ⚠️ Жарко днём  
- 🌞 Лучше утром  
- 👕 Удобная обувь  
- 🐾 —

## Локальная ценность

Сад отражает баланс урбанизма и природы в Сингапуре.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏝 Sentosa Island
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgp-sentosa-island',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Главная зона отдыха  
- 🌍 Пляжи и развлечения  
- 📸 Курортная атмосфера

## Билеты и посещение

- 💰 Въезд платный  
- 🎟️ Парки — отдельно  
- 🆓 Пляжи

## Лучшие точки для фото

- 📷 Пляжи  
- 📷 Resorts  
- 🌅 Закат

## Практическая информация

- **Адрес:** Sentosa Island  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚠 Канатная дорога  
- 🚕 Такси  
- 🗺️ South Singapore

## Полезные нюансы

- ⚠️ Многолюдно  
- 🌞 Лучше в будни  
- 👕 Пляжная одежда  
- 🐾 —

## Локальная ценность

Sentosa развивает индустрию развлечений и туризма.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 💧 Jewel Changi Airport
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgp-jewel-changi-airport',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самый красивый аэропорт мира  
- 🌍 Архитектура и природа  
- 📸 Водопад Rain Vortex

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Аттракционы — платно  
- 🆓 Основная зона

## Лучшие точки для фото

- 📷 Водопад  
- 📷 Купол  
- 🌅 Вечернюю подсветку

## Практическая информация

- **Адрес:** Changi Airport  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚇 MRT Changi  
- 🚶 Пешком  
- 🗺️ Changi

## Полезные нюансы

- ⚠️ Многолюдно  
- 🌞 Лучше вечером  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Jewel стал визитной карточкой инновационного подхода Сингапура к инфраструктуре.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍢 Lau Pa Sat Hawker Centre
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgp-lau-pa-sat-hawker-centre',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚇 MRT Raffles Place  
- 🚶 Пешком  
- 🗺️ CBD

## Полезные нюансы

- ⚠️ Очереди вечером  
- 🌞 Лучше ночью  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Hawker-центры — основа гастрономической культуры Сингапура (UNESCO).

## Лучшие точки для фото

- 📷 Satay  
- 📷 Фудкорты  
- 🌅 Ночной рынок

## Практическая информация

- **Адрес:** Lau Pa Sat  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучший hawker-опыт  
- 🌍 Национальная кухня  
- 📸 Сатэ-стрит вечером

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

-- Content block for: 🍸 Atlas Rooftop Bar
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgp-atlas-rooftop-bar',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Такси  
- 🗺️ Bugis

## Полезные нюансы

- ⚠️ Строгий дресс-код  
- 🌞 Лучше вечером  
- 👕 Smart elegant  
- 🐾 —

## Локальная ценность

Atlas формирует имидж Сингапура как столицы luxury-лайфстайла.

## Лучшие точки для фото

- 📷 Интерьер  
- 📷 Коктейли  
- 🌅 Зал вечером

## Практическая информация

- **Адрес:** Bugis, Singapore  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Один из самых красивых баров Азии  
- 🌍 Архитектура и дизайн  
- 📸 Интерьер и коктейли

## Билеты и посещение

- 💰 💎 Premium  
- 🎟️ Дресс-код  
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

-- Content block for: 🦀 Jumbo Seafood
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgp-jumbo-seafood',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚇 MRT Clarke Quay  
- 🚶 Пешком  
- 🗺️ Riverside

## Полезные нюансы

- ⚠️ Туристическое место  
- 🌞 Лучше бронировать  
- 👕 Casual chic  
- 🐾 —

## Локальная ценность

Ресторан поддерживает гастрономическую репутацию Сингапура.

## Лучшие точки для фото

- 📷 Краба  
- 📷 Подачу  
- 🌅 Вечерний берег

## Практическая информация

- **Адрес:** Clarke Quay  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучший чили-краб в городе  
- 🌍 Кулинарная визитка Сингапура  
- 📸 Подача морепродуктов

## Билеты и посещение

- 💰 Средний–высокий чек  
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

-- Content block for: 🍜 Maxwell Food Centre
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgp-maxwell-food-centre',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚇 MRT Tanjong Pagar  
- 🚶 Пешком  
- 🗺️ Chinatown / Maxwell Road

## Полезные нюансы

- ⚠️ Очереди в обед  
- 🌞 Лучше приходить рано  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Hawker-центры — ядро повседневной гастрономии Сингапура и часть культурного наследия (в том числе UNESCO).

## Лучшие точки для фото

- 📷 Ряды киосков  
- 📷 Блюда  
- 🌅 Вечернюю атмосферу

## Практическая информация

- **Адрес:** Maxwell Food Centre, Singapore  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Подлинный hawker-опыт Сингапура  
- 🌍 Легендарные блюда “как едят местные”  
- 📸 Атмосфера рынка и фудкорта

## Билеты и посещение

- 💰 Бюджетно  
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

-- Content block for: 🍽 Odette
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgp-odette',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚇 MRT City Hall  
- 🚶 Пешком  
- 🗺️ National Gallery Singapore

## Полезные нюансы

- ⚠️ Smart elegant  
- 🌞 Лучше бронировать заранее  
- 👕 Дресс-код (опрятно/элегантно)  
- 🐾 —

## Локальная ценность

Fine dining формирует международный престиж Сингапура и развивает индустрию высокой гастрономии.

## Лучшие точки для фото

- 📷 Подачу блюд  
- 📷 Интерьер  
- 🌅 Атмосферу вечера

## Практическая информация

- **Адрес:** National Gallery Singapore  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Ресторан мирового класса  
- 🌍 Гастрономический must-try для любителей fine dining  
- 📸 Авторская подача и интерьер

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

-- Content block for: 🍹 Long Bar
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgp-long-bar',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚇 MRT City Hall / Esplanade  
- 🚶 Пешком  
- 🗺️ Raffles Hotel

## Полезные нюансы

- ⚠️ Туристическое место, цены выше  
- 🌞 Лучше вечером  
- 👕 Smart casual  
- 🐾 —

## Локальная ценность

Long Bar — часть культурной истории и туристического бренда Сингапура.

## Лучшие точки для фото

- 📷 Интерьер  
- 📷 Коктейль  
- 🌅 Атмосферу вечера

## Практическая информация

- **Адрес:** Raffles Hotel, Singapore  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Исторический бар №1 в стране  
- 🌍 Колониальное наследие Сингапура  
- 📸 Атмосфера “старого Сингапура”

## Билеты и посещение

- 💰 Высокий чек  
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
