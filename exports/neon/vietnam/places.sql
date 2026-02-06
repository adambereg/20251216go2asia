-- Places UPSERT (idempotent)
-- Generated from Atlas Content Canon v1 markdown files

-- Place: 🏛️ Imperial City Hue (Hue)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hue-imperial-city-hue',
  'vn',
  'hue',
  '🏛️ Imperial City Hue',
  'hue-imperial-city-hue',
  'heritage',
  'showplace',
  'heritage',
  '["unesco","citadel","history","must-see"]'::jsonb,
  'Бывшая резиденция императоров династии Нгуен и главный исторический символ Хюэ, объект Всемирного наследия ЮНЕСКО.',
  16.4637,
  107.5909,
  NULL,
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

-- Place: 🌸 Perfume River (Hue)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hue-perfume-river',
  'vn',
  'hue',
  '🌸 Perfume River',
  'hue-perfume-river',
  'landmark',
  'showplace',
  'landmark',
  '["river","cruises","sunset","city-symbol"]'::jsonb,
  'Живописная река, проходящая через центр Хюэ и формирующая его панораму и поэтический образ.',
  16.4692,
  107.5846,
  NULL,
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

-- Place: 🛕 Thien Mu Pagoda (Hue)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hue-thien-mu-pagoda',
  'vn',
  'hue',
  '🛕 Thien Mu Pagoda',
  'hue-thien-mu-pagoda',
  'temple',
  'showplace',
  'temple',
  '["temple","iconic","river-view","heritage"]'::jsonb,
  'Самая известная пагода Хюэ, расположенная на холме над Парфюмной рекой.',
  16.4864,
  107.5788,
  NULL,
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

-- Place: 🌉 Truong Tien Bridge (Hue)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hue-truong-tien-bridge',
  'vn',
  'hue',
  '🌉 Truong Tien Bridge',
  'hue-truong-tien-bridge',
  'landmark',
  'showplace',
  'landmark',
  '["bridge","night-lights","photo","city-symbol"]'::jsonb,
  'Исторический стальной мост через Парфюмную реку, соединяющий старый и новый Хюэ.',
  16.468,
  107.5877,
  NULL,
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

-- Place: 🏞️ Ngu Binh Viewpoint (Hue)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hue-ngu-binh-viewpoint',
  'vn',
  'hue',
  '🏞️ Ngu Binh Viewpoint',
  'hue-ngu-binh-viewpoint',
  'viewpoint',
  'showplace',
  'viewpoint',
  '["viewpoint","hike","sunrise","panorama"]'::jsonb,
  'Невысокая гора и смотровая точка, считающаяся «императорским экраном» Хюэ.',
  16.4449,
  107.6031,
  NULL,
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

-- Place: 🧘 Tu Hieu Pagoda (Hue)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hue-tu-hieu-pagoda',
  'vn',
  'hue',
  '🧘 Tu Hieu Pagoda',
  'hue-tu-hieu-pagoda',
  'temple',
  'showplace',
  'temple',
  '["temple","pine-forest","calm","meditation"]'::jsonb,
  'Тихий буддийский монастырь в сосновом лесу на окраине Хюэ, известный атмосферой созерцания и связью с дзен-мастером Тхить Нят Ханем.',
  16.4889,
  107.5657,
  NULL,
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

-- Place: 🏯 Nam Giao Altar (Hue)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hue-nam-giao-altar',
  'vn',
  'hue',
  '🏯 Nam Giao Altar',
  'hue-nam-giao-altar',
  'heritage',
  'showplace',
  'heritage',
  '["ritual","history","architecture","unique"]'::jsonb,
  'Церемониальный комплекс под открытым небом, где императоры династии Нгуен совершали ритуалы жертвоприношения Небу и Земле.',
  16.4446,
  107.5926,
  NULL,
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

-- Place: 🌄 Vong Canh Hill (Hue)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hue-vong-canh-hill',
  'vn',
  'hue',
  '🌄 Vong Canh Hill',
  'hue-vong-canh-hill',
  'viewpoint',
  'showplace',
  'viewpoint',
  '["viewpoint","sunset","pine","calm"]'::jsonb,
  'Сосновый холм на юге Хюэ, известный панорамными видами на Парфюмную реку и императорские гробницы.',
  16.444,
  107.5529,
  NULL,
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

-- Place: 🌅 Tam Giang Lagoon (Hue)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hue-tam-giang-lagoon',
  'vn',
  'hue',
  '🌅 Tam Giang Lagoon',
  'hue-tam-giang-lagoon',
  'nature',
  'showplace',
  'nature',
  '["lagoon","fishing","sunset","photo"]'::jsonb,
  'Крупнейшая лагунная система Юго-Восточной Азии, расположенная к востоку от Хюэ и известная рыбацкими пейзажами и закатами.',
  16.562,
  107.682,
  NULL,
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

-- Place: 🌳 Bach Ma National Park (Hue)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hue-bach-ma-national-park',
  'vn',
  'hue',
  '🌳 Bach Ma National Park',
  'hue-bach-ma-national-park',
  'nature',
  'showplace',
  'nature',
  '["hiking","waterfalls","cool-climate","day-trip"]'::jsonb,
  'Горный национальный парк между Хюэ и Данангом, известный прохладным климатом, водопадами и треккинговыми маршрутами.',
  16.195,
  107.858,
  NULL,
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

-- Place: ☕ The Lab Coffee (Hue)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hue-the-lab-coffee',
  'vn',
  'hue',
  '☕ The Lab Coffee',
  'hue-the-lab-coffee',
  'cafe',
  'business',
  'cafe',
  '["specialty-coffee","work-friendly","expat","quiet"]'::jsonb,
  'Спешелти-кофейня в центре Хюэ, ориентированная на качество зёрен, аккуратную экстракцию и спокойную рабочую атмосферу.',
  16.4703,
  107.5947,
  NULL,
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

-- Place: 🧂 Cà Phê Muối 142 (Hue)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hue-ca-phe-muoi-142',
  'vn',
  'hue',
  '🧂 Cà Phê Muối 142',
  'hue-ca-phe-muoi-142',
  'cafe',
  'business',
  'cafe',
  '["salt-coffee","local-specialty","authentic","budget"]'::jsonb,
  'Легендарное семейное кафе — родина солёного кофе, одного из гастрономических символов Хюэ.',
  16.4712,
  107.5729,
  NULL,
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

-- Place: 🍽️ Quán Hanh (Hue)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hue-quan-hanh',
  'vn',
  'hue',
  '🍽️ Quán Hanh',
  'hue-quan-hanh',
  'restaurant',
  'business',
  'restaurant',
  '["hue-cuisine","set-menu","popular","must-try"]'::jsonb,
  'Популярный семейный ресторан, где под одной крышей собраны основные блюда императорской кухни Хюэ.',
  16.4665,
  107.5955,
  NULL,
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

-- Place: 🍜 Madam Thu Restaurant (Hue)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hue-madam-thu-restaurant',
  'vn',
  'hue',
  '🍜 Madam Thu Restaurant',
  'hue-madam-thu-restaurant',
  'restaurant',
  'business',
  'restaurant',
  '["hue-cuisine","tourist-friendly","cozy","popular"]'::jsonb,
  'Уютный ресторан традиционной кухни Хюэ с туристически комфортным сервисом и сохранением аутентичных рецептов.',
  16.47,
  107.5963,
  NULL,
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

-- Place: 🥬 Lien Hoa Vegetarian (Hue)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hue-lien-hoa-vegetarian',
  'vn',
  'hue',
  '🥬 Lien Hoa Vegetarian',
  'hue-lien-hoa-vegetarian',
  'restaurant',
  'business',
  'restaurant',
  '["vegetarian","vegan-friendly","garden-house","budget"]'::jsonb,
  'Знаковый вегетарианский ресторан буддийской кухни в традиционном садовом доме.',
  16.4651,
  107.5977,
  NULL,
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

-- Place: 🍺 Imperial Craft Bia Brewpub (Hue)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hue-imperial-craft-bia-brewpub',
  'vn',
  'hue',
  '🍺 Imperial Craft Bia Brewpub',
  'hue-imperial-craft-bia-brewpub',
  'bar',
  'business',
  'bar',
  '["craft-beer","expat-friendly","western-food","nightlife"]'::jsonb,
  'Первая крафтовая пивоварня Хюэ и главное место встречи экспатов, путешественников и местной креативной сцены.',
  16.4608,
  107.591,
  NULL,
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

-- Place: 🎉 Brown Eyes Bar (Hue)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hue-brown-eyes-bar',
  'vn',
  'hue',
  '🎉 Brown Eyes Bar',
  'hue-brown-eyes-bar',
  'bar',
  'business',
  'bar',
  '["nightlife","party","late-night","backpacker"]'::jsonb,
  'Самый известный ночной бар Хюэ с интернациональной тусовкой, танцами и вечеринками до глубокой ночи.',
  16.4688,
  107.5968,
  NULL,
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

-- Place: 🛍️ Dong Ba Market (Hue)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hue-dong-ba-market',
  'vn',
  'hue',
  '🛍️ Dong Ba Market',
  'hue-dong-ba-market',
  'market',
  'business',
  'market',
  '["shopping","street-food","local-life","must-visit"]'::jsonb,
  'Главный рынок Хюэ и ключевая торговая площадка города с уличной едой, продуктами и сувенирами.',
  16.4729,
  107.5894,
  NULL,
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

-- Place: 🌙 Hue Night Market (Hue)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hue-hue-night-market',
  'vn',
  'hue',
  '🌙 Hue Night Market',
  'hue-hue-night-market',
  'night-market',
  'business',
  'night-market',
  '["street-food","shopping","evening","vibe"]'::jsonb,
  'Вечерний рынок и пешеходная зона вдоль Парфюмной реки с едой, сувенирами и уличными выступлениями.',
  16.4685,
  107.5869,
  NULL,
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

-- Place: 🏮 Hoi An Ancient Town (Hoi An)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hoi-hoi-an-ancient-town',
  'vn',
  'hoi',
  '🏮 Hoi An Ancient Town',
  'hoi-hoi-an-ancient-town',
  'heritage',
  'showplace',
  'heritage',
  '["unesco","lanterns","walking","must-see"]'::jsonb,
  'Исторический центр Хойана — хорошо сохранившийся торговый город XV–XIX веков, объект Всемирного наследия ЮНЕСКО.',
  15.8801,
  108.338,
  NULL,
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

-- Place: 🌉 Japanese Covered Bridge (Hoi An)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hoi-japanese-covered-bridge',
  'vn',
  'hoi',
  '🌉 Japanese Covered Bridge',
  'hoi-japanese-covered-bridge',
  'landmark',
  'showplace',
  'landmark',
  '["bridge","iconic","photo","heritage"]'::jsonb,
  'Символ Хойана — крытый мост XVII века, построенный японской общиной города.',
  15.877,
  108.3278,
  NULL,
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

-- Place: 🏯 Assembly Halls of Hoi An (Hoi An)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hoi-assembly-halls-of-hoi-an',
  'vn',
  'hoi',
  '🏯 Assembly Halls of Hoi An',
  'hoi-assembly-halls-of-hoi-an',
  'heritage',
  'showplace',
  'heritage',
  '["chinese","temples","architecture","history"]'::jsonb,
  'Храмовые комплексы китайских торговых общин Хойана, посвящённые богам-покровителям и предкам.',
  15.8766,
  108.3287,
  NULL,
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

-- Place: 🏠 Old Merchant Houses (Hoi An)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hoi-old-merchant-houses',
  'vn',
  'hoi',
  '🏠 Old Merchant Houses',
  'hoi-old-merchant-houses',
  'heritage',
  'showplace',
  'heritage',
  '["houses","museum","history","flood-marks"]'::jsonb,
  'Исторические дома купцов XVII–XIX веков, сохранившие интерьеры и следы наводнений.',
  15.8779,
  108.3289,
  NULL,
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

-- Place: 🍜 Hoi An Central Market (Hoi An)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hoi-hoi-an-central-market',
  'vn',
  'hoi',
  '🍜 Hoi An Central Market',
  'hoi-hoi-an-central-market',
  'market',
  'showplace',
  'market',
  '["food","local-life","daytime","busy"]'::jsonb,
  'Оживлённый рынок в старом городе — центр торговли, еды и повседневной жизни.',
  15.8763,
  108.3313,
  NULL,
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

-- Place: 🏮 Hoi An Night Market (Hoi An)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hoi-hoi-an-night-market',
  'vn',
  'hoi',
  '🏮 Hoi An Night Market',
  'hoi-hoi-an-night-market',
  'night-market',
  'showplace',
  'night-market',
  '["lanterns","shopping","evening","photo"]'::jsonb,
  'Вечерний рынок на острове Анхой — центр фонарной атмосферы, уличной еды и вечерних прогулок в Хойане.',
  15.8796,
  108.3305,
  NULL,
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

-- Place: 🌱 Tra Que Vegetable Village (Hoi An)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hoi-tra-que-vegetable-village',
  'vn',
  'hoi',
  '🌱 Tra Que Vegetable Village',
  'hoi-tra-que-vegetable-village',
  'village',
  'showplace',
  'village',
  '["farming","eco","bicycle","local"]'::jsonb,
  'Традиционная сельскохозяйственная деревня, известная органическими травами и экскурсиями по фермерскому быту.',
  15.8985,
  108.3262,
  NULL,
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

-- Place: 🏺 Thanh Ha Pottery Village (Hoi An)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hoi-thanh-ha-pottery-village',
  'vn',
  'hoi',
  '🏺 Thanh Ha Pottery Village',
  'hoi-thanh-ha-pottery-village',
  'village',
  'showplace',
  'village',
  '["crafts","pottery","workshop","family"]'::jsonb,
  'Ремесленная деревня с более чем 500-летней историей, специализирующаяся на традиционной керамике.',
  15.8849,
  108.3453,
  NULL,
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

-- Place: 🐠 Cham Islands (Hoi An)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hoi-cham-islands',
  'vn',
  'hoi',
  '🐠 Cham Islands',
  'hoi-cham-islands',
  'island',
  'showplace',
  'island',
  '["snorkeling","biosphere","day-trip","sea"]'::jsonb,
  'Архипелаг из восьми островов у побережья Хойана, биосферный заповедник ЮНЕСКО.',
  15.999,
  108.515,
  NULL,
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

-- Place: 🏖️ An Bang Beach (Hoi An)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hoi-an-bang-beach',
  'vn',
  'hoi',
  '🏖️ An Bang Beach',
  'hoi-an-bang-beach',
  'beach',
  'showplace',
  'beach',
  '["beach","chill","bars","sunset"]'::jsonb,
  'Популярный пляж Хойана с расслабленной атмосферой и пляжными кафе.',
  15.9153,
  108.3426,
  NULL,
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

-- Place: 🥖 Bánh Mì Phượng (Hoi An)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hoi-banh-mi-phuong',
  'vn',
  'hoi',
  '🥖 Bánh Mì Phượng',
  'hoi-banh-mi-phuong',
  'restaurant',
  'business',
  'restaurant',
  '["banh-mi","famous","queue","budget"]'::jsonb,
  'Самая известная баньми-лавка Хойана, прославившаяся после визита Энтони Бурдена и ставшая гастрономической легендой города.',
  15.8769,
  108.3276,
  NULL,
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

-- Place: 🍗 Cơm Gà Bà Buội (Hoi An)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hoi-com-ga-ba-buoi',
  'vn',
  'hoi',
  '🍗 Cơm Gà Bà Buội',
  'hoi-com-ga-ba-buoi',
  'restaurant',
  'business',
  'restaurant',
  '["chicken-rice","local-legend","must-try","budget"]'::jsonb,
  'Культовый семейный ресторан куриного риса — одно из самых уважаемых заведений Хойана.',
  15.8793,
  108.329,
  NULL,
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

-- Place: 👑 Madam Khanh – The Banh Mi Queen (Hoi An)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hoi-madam-khanh-the-banh-mi-queen',
  'vn',
  'hoi',
  '👑 Madam Khanh – The Banh Mi Queen',
  'hoi-madam-khanh-the-banh-mi-queen',
  'restaurant',
  'business',
  'restaurant',
  '["banh-mi","local","friendly","budget"]'::jsonb,
  'Знаменитая лавка баньми, известная дружелюбным сервисом и индивидуальным подходом к каждому заказу.',
  15.8785,
  108.3295,
  NULL,
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

-- Place: 🍜 Morning Glory Restaurant (Hoi An)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hoi-morning-glory-restaurant',
  'vn',
  'hoi',
  '🍜 Morning Glory Restaurant',
  'hoi-morning-glory-restaurant',
  'restaurant',
  'business',
  'restaurant',
  '["vietnamese","central-cuisine","popular","nice-interior"]'::jsonb,
  'Один из самых популярных ресторанов центральной вьетнамской кухни в старом городе Хойана.',
  15.8758,
  108.3264,
  NULL,
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

-- Place: 🥙 Bà Lê Well (Hoi An)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hoi-ba-le-well',
  'vn',
  'hoi',
  '🥙 Bà Lê Well',
  'hoi-ba-le-well',
  'restaurant',
  'business',
  'restaurant',
  '["banh-xeo","nem-lui","set-menu","fun"]'::jsonb,
  'Весёлый ресторан-колодец с сет-меню, где гости сами собирают блюда и делятся за общим столом.',
  15.878,
  108.3271,
  NULL,
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

-- Place: 🍵 Reaching Out Tea House (Hoi An)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hoi-reaching-out-tea-house',
  'vn',
  'hoi',
  '🍵 Reaching Out Tea House',
  'hoi-reaching-out-tea-house',
  'cafe',
  'business',
  'cafe',
  '["tea","social-enterprise","quiet","unique"]'::jsonb,
  'Уникальный чайный дом в старом городе Хойана, где обслуживание ведут люди с нарушениями слуха, а общение происходит через записки и жесты.',
  15.8774,
  108.3284,
  NULL,
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

-- Place: 📸 Faifo Coffee (Hoi An)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hoi-faifo-coffee',
  'vn',
  'hoi',
  '📸 Faifo Coffee',
  'hoi-faifo-coffee',
  'cafe',
  'business',
  'cafe',
  '["rooftop","photo","coffee","sunset"]'::jsonb,
  'Кофейня с одной из самых известных крыш Хойана и панорамным видом на старый город и его черепичные крыши.',
  15.8771,
  108.328,
  NULL,
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

-- Place: 🌿 Mót Hội An (Hoi An)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hoi-mot-hoi-an',
  'vn',
  'hoi',
  '🌿 Mót Hội An',
  'hoi-mot-hoi-an',
  'cafe',
  'business',
  'cafe',
  '["signature-drink","street","photo","cheap"]'::jsonb,
  'Небольшая уличная стойка с фирменным травяным напитком, ставшим гастрономическим символом Хойана.',
  15.8756,
  108.3281,
  NULL,
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

-- Place: 👗 Yaly Couture (Hoi An)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hoi-yaly-couture',
  'vn',
  'hoi',
  '👗 Yaly Couture',
  'hoi-yaly-couture',
  'shop',
  'business',
  'shop',
  '["tailor","custom","premium","fast"]'::jsonb,
  'Один из самых известных ателье Хойана, специализирующийся на индивидуальном пошиве одежды.',
  15.8762,
  108.3289,
  NULL,
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

-- Place: 🏖️ Soul Kitchen (Hoi An)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'hoi-soul-kitchen',
  'vn',
  'hoi',
  '🏖️ Soul Kitchen',
  'hoi-soul-kitchen',
  'bar',
  'business',
  'bar',
  '["beach-bar","live-music","expat","sunset"]'::jsonb,
  'Пляжный бар-ресторан на Ан Банге с живой музыкой, интернациональной кухней и расслабленной атмосферой.',
  15.9235,
  108.3493,
  NULL,
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

-- Place: 🏖️ My Khe Beach (Da Nang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dad-my-khe-beach',
  'vn',
  'dad',
  '🏖️ My Khe Beach',
  'dad-my-khe-beach',
  'beach',
  'showplace',
  'beach',
  '["beach","sunrise","city","swim"]'::jsonb,
  'Главный городской пляж Дананга с широкой береговой линией, мягким песком и удобной инфраструктурой.',
  16.0544,
  108.2498,
  NULL,
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

-- Place: 🌳 Son Tra Peninsula (Da Nang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dad-son-tra-peninsula',
  'vn',
  'dad',
  '🌳 Son Tra Peninsula',
  'dad-son-tra-peninsula',
  'nature',
  'showplace',
  'nature',
  '["nature","viewpoint","wildlife","motorbike"]'::jsonb,
  'Горный полуостров с джунглями и смотровыми площадками, известный дикой природой и видами на Дананг.',
  16.1133,
  108.2736,
  NULL,
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

-- Place: 🛕 Linh Ứng Pagoda (Da Nang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dad-linh-ung-pagoda',
  'vn',
  'dad',
  '🛕 Linh Ứng Pagoda',
  'dad-linh-ung-pagoda',
  'temple',
  'showplace',
  'temple',
  '["temple","statue","viewpoint","must-see"]'::jsonb,
  'Крупнейшая пагода Дананга с 67-метровой статуей Богини Милосердия, расположенная на полуострове Сон Тра.',
  16.1127,
  108.2707,
  NULL,
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

-- Place: 🗻 Marble Mountains (Da Nang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dad-marble-mountains',
  'vn',
  'dad',
  '🗻 Marble Mountains',
  'dad-marble-mountains',
  'nature',
  'showplace',
  'nature',
  '["caves","temple","hiking","heritage"]'::jsonb,
  'Группа из пяти мраморных холмов с пещерами, пагодами и смотровыми площадками между Данангом и Хойаном.',
  16.0036,
  108.2634,
  NULL,
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

-- Place: 🐉 Dragon Bridge (Da Nang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dad-dragon-bridge',
  'vn',
  'dad',
  '🐉 Dragon Bridge',
  'dad-dragon-bridge',
  'landmark',
  'showplace',
  'landmark',
  '["bridge","night","show","city"]'::jsonb,
  'Современный мост в форме дракона — символ нового Дананга и центр вечерних шоу.',
  16.0611,
  108.2275,
  NULL,
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

-- Place: 🏖️ Non Nuoc Beach (Da Nang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dad-non-nuoc-beach',
  'vn',
  'dad',
  '🏖️ Non Nuoc Beach',
  'dad-non-nuoc-beach',
  'beach',
  'showplace',
  'beach',
  '["beach","quiet","dunes","photo"]'::jsonb,
  'Протяжённый и более спокойный пляж к югу от Дананга, популярный у серферов и гостей курортных отелей.',
  15.9958,
  108.2654,
  NULL,
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

-- Place: 🌉 Golden Bridge (Da Nang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dad-golden-bridge',
  'vn',
  'dad',
  '🌉 Golden Bridge',
  'dad-golden-bridge',
  'viewpoint',
  'showplace',
  'viewpoint',
  '["iconic","photo","mountains","bridge"]'::jsonb,
  'Знаменитый мост, поддерживаемый гигантскими каменными руками, расположенный в горах Ба На.',
  15.996,
  107.9965,
  NULL,
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

-- Place: 🎢 Sun World Ba Na Hills (Da Nang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dad-sun-world-ba-na-hills',
  'vn',
  'dad',
  '🎢 Sun World Ba Na Hills',
  'dad-sun-world-ba-na-hills',
  'theme-park',
  'showplace',
  'theme-park',
  '["cable-car","park","day-trip","family"]'::jsonb,
  'Горный развлекательный комплекс с канатной дорогой, парком аттракционов и «французской деревней».',
  15.9967,
  107.9971,
  NULL,
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

-- Place: 🌉 Han River Bridge (Da Nang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dad-han-river-bridge',
  'vn',
  'dad',
  '🌉 Han River Bridge',
  'dad-han-river-bridge',
  'landmark',
  'showplace',
  'landmark',
  '["bridge","night","engineering"]'::jsonb,
  'Первый разводной мост Вьетнама и один из символов инженерного развития Дананга.',
  16.0645,
  108.2256,
  NULL,
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

-- Place: 🗿 Cham Sculpture Museum (Da Nang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dad-cham-sculpture-museum',
  'vn',
  'dad',
  '🗿 Cham Sculpture Museum',
  'dad-cham-sculpture-museum',
  'museum',
  'showplace',
  'museum',
  '["museum","cham","history","culture"]'::jsonb,
  'Крупнейшее в мире собрание чамской скульптуры и артефактов древнего королевства Чампа.',
  16.0608,
  108.2233,
  NULL,
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

-- Place: 🍲 Madame Lân (Da Nang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dad-madame-lan',
  'vn',
  'dad',
  '🍲 Madame Lân',
  'dad-madame-lan',
  'restaurant',
  'business',
  'restaurant',
  '["vietnamese","central-cuisine","family","popular"]'::jsonb,
  'Популярный ресторан традиционной вьетнамской кухни в Дананге с большим меню и удобным форматом для семей и компаний.',
  16.0602,
  108.2237,
  NULL,
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

-- Place: ⭐ La Maison 1888 (Da Nang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dad-la-maison-1888',
  'vn',
  'dad',
  '⭐ La Maison 1888',
  'dad-la-maison-1888',
  'restaurant',
  'business',
  'restaurant',
  '["fine-dining","luxury","michelin-level","view"]'::jsonb,
  'Ресторан высокой кухни в курорте InterContinental Danang, отмеченный звёздным уровнем сервиса и панорамными видами.',
  16.1296,
  108.2651,
  NULL,
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

-- Place: 🦞 Bé Mặn Seafood (Da Nang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dad-be-man-seafood',
  'vn',
  'dad',
  '🦞 Bé Mặn Seafood',
  'dad-be-man-seafood',
  'restaurant',
  'business',
  'restaurant',
  '["seafood","choose-live","local","loud"]'::jsonb,
  'Шумный и аутентичный рыбный ресторан, где гости выбирают свежие морепродукты прямо у аквариумов.',
  16.0493,
  108.2459,
  NULL,
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

-- Place: ☕ 43 Factory Coffee Roaster (Da Nang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dad-43-factory-coffee-roaster',
  'vn',
  'dad',
  '☕ 43 Factory Coffee Roaster',
  'dad-43-factory-coffee-roaster',
  'cafe',
  'business',
  'cafe',
  '["specialty-coffee","design","work-friendly"]'::jsonb,
  'Современная спешелти-кофейня и обжарочная, известная дизайнерским пространством и качеством кофе.',
  16.0665,
  108.2287,
  NULL,
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

-- Place: 🧱 Cộng Cà Phê (Da Nang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dad-cong-ca-phe',
  'vn',
  'dad',
  '🧱 Cộng Cà Phê',
  'dad-cong-ca-phe',
  'cafe',
  'business',
  'cafe',
  '["coffee","retro","coconut-coffee","chain"]'::jsonb,
  'Известная вьетнамская сеть кофеен в ретро-стиле, популярная среди местных и туристов.',
  16.0609,
  108.2215,
  NULL,
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

-- Place: 🌃 Sky36 (Da Nang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dad-sky36',
  'vn',
  'dad',
  '🌃 Sky36',
  'dad-sky36',
  'bar',
  'business',
  'bar',
  '["rooftop","nightlife","view","dj"]'::jsonb,
  'Самый высокий rooftop-бар Дананга, расположенный на крыше отеля Novotel с панорамным видом на город и реку Хан.',
  16.0616,
  108.2263,
  NULL,
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

-- Place: 🌊 Waterfront Danang (Da Nang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dad-waterfront-danang',
  'vn',
  'dad',
  '🌊 Waterfront Danang',
  'dad-waterfront-danang',
  'bar',
  'business',
  'bar',
  '["riverside","live-music","expat","dinner"]'::jsonb,
  'Ресторан и бар на набережной реки Хан, популярный у экспатов и гостей города.',
  16.064,
  108.223,
  NULL,
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

-- Place: 🛍️ Han Market (Da Nang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dad-han-market',
  'vn',
  'dad',
  '🛍️ Han Market',
  'dad-han-market',
  'market',
  'business',
  'market',
  '["shopping","souvenirs","food","bargain"]'::jsonb,
  'Центральный крытый рынок Дананга с продуктами, сувенирами и локальной едой.',
  16.0674,
  108.2216,
  NULL,
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

-- Place: 🍢 Con Market (Da Nang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dad-con-market',
  'vn',
  'dad',
  '🍢 Con Market',
  'dad-con-market',
  'market',
  'business',
  'market',
  '["local-food","street-food","authentic","cheap"]'::jsonb,
  'Крупный рынок для местных жителей, известный аутентичным стрит-фудом и низкими ценами.',
  16.0679,
  108.2098,
  NULL,
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

-- Place: 🌙 Son Tra Night Market (Da Nang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dad-son-tra-night-market',
  'vn',
  'dad',
  '🌙 Son Tra Night Market',
  'dad-son-tra-night-market',
  'night-market',
  'business',
  'night-market',
  '["street-food","shopping","evening","vibe"]'::jsonb,
  'Ночной рынок у моста Дракона с уличной едой, сувенирами и вечерней атмосферой.',
  16.0603,
  108.2309,
  NULL,
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

-- Place: 🌸 Hồ Xuân Hương (Dalat)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dla-ho-xuan-huong',
  'vn',
  'dla',
  '🌸 Hồ Xuân Hương',
  'dla-ho-xuan-huong',
  'lake',
  'showplace',
  'lake',
  '["lake","promenade","city-center","photo"]'::jsonb,
  'Живописное искусственное озеро в самом центре Далата — популярное место прогулок, утренних пробежек и вечернего отдыха.',
  11.9419,
  108.4467,
  NULL,
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

-- Place: 🌷 Dalat Flower Garden (Dalat)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dla-dalat-flower-garden',
  'vn',
  'dla',
  '🌷 Dalat Flower Garden',
  'dla-dalat-flower-garden',
  'park',
  'showplace',
  'park',
  '["flowers","park","family","photo"]'::jsonb,
  'Знаменитый парк-дендрарий у северного берега озера Суан Хыонг с сотнями видов цветов и декоративных композиций.',
  11.9503,
  108.4499,
  NULL,
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

-- Place: 💕 Valley of Love (Dalat)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dla-valley-of-love',
  'vn',
  'dla',
  '💕 Valley of Love',
  'dla-valley-of-love',
  'park',
  'showplace',
  'park',
  '["romantic","park","attractions","family"]'::jsonb,
  'Романтический парк развлечений и природных ландшафтов к северу от центра Далата.',
  11.9779,
  108.4492,
  NULL,
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

-- Place: 💦 Datanla Waterfall (Dalat)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dla-datanla-waterfall',
  'vn',
  'dla',
  '💦 Datanla Waterfall',
  'dla-datanla-waterfall',
  'waterfall',
  'showplace',
  'waterfall',
  '["waterfall","adventure","zipline","nature"]'::jsonb,
  'Самый доступный водопад Далата, превращённый в приключенческий парк с аттракционами.',
  11.9037,
  108.4501,
  NULL,
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

-- Place: 🌿 Cam Ly Waterfall (Dalat)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dla-cam-ly-waterfall',
  'vn',
  'dla',
  '🌿 Cam Ly Waterfall',
  'dla-cam-ly-waterfall',
  'waterfall',
  'showplace',
  'waterfall',
  '["waterfall","city","nature"]'::jsonb,
  'Небольшой водопад в черте города — один из старейших туристических символов Далата.',
  11.9419,
  108.421,
  NULL,
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

-- Place: 🌲 Tuyền Lâm Lake (Dalat)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dla-tuyen-lam-lake',
  'vn',
  'dla',
  '🌲 Tuyền Lâm Lake',
  'dla-tuyen-lam-lake',
  'lake',
  'showplace',
  'lake',
  '["lake","pine","sunset","nature"]'::jsonb,
  'Крупнейшее и одно из самых живописных озёр в окрестностях Далата, окружённое сосновыми лесами и холмами.',
  11.8986,
  108.4523,
  NULL,
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

-- Place: 🧘 Trúc Lâm Zen Monastery (Dalat)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dla-truc-lam-zen-monastery',
  'vn',
  'dla',
  '🧘 Trúc Lâm Zen Monastery',
  'dla-truc-lam-zen-monastery',
  'temple',
  'showplace',
  'temple',
  '["temple","viewpoint","nature","calm"]'::jsonb,
  'Крупнейший дзен-буддийский монастырь Вьетнама, расположенный над озером Туен Лам.',
  11.8897,
  108.4426,
  NULL,
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

-- Place: 🌀 Crazy House (Dalat)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dla-crazy-house',
  'vn',
  'dla',
  '🌀 Crazy House',
  'dla-crazy-house',
  'architecture',
  'showplace',
  'architecture',
  '["architecture","surreal","photo","unique"]'::jsonb,
  'Экстравагантный архитектурный комплекс в стиле сюрреализма, один из самых необычных домов в мире.',
  11.9405,
  108.4427,
  NULL,
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

-- Place: 🐉 Linh Phước Pagoda (Dalat)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dla-linh-phuoc-pagoda',
  'vn',
  'dla',
  '🐉 Linh Phước Pagoda',
  'dla-linh-phuoc-pagoda',
  'temple',
  'showplace',
  'temple',
  '["temple","mosaic","dragon","must-see"]'::jsonb,
  'Буддийская пагода, украшенная мозаиками из керамики и стекла, одна из самых впечатляющих во Вьетнаме.',
  11.9683,
  108.4586,
  NULL,
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

-- Place: ⛪ Domaine de Marie (Dalat)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dla-domaine-de-marie',
  'vn',
  'dla',
  '⛪ Domaine de Marie',
  'dla-domaine-de-marie',
  'church',
  'showplace',
  'church',
  '["church","colonial","gardens","photo"]'::jsonb,
  'Католическая церковь во французском стиле, окружённая садами и известная розовым фасадом.',
  11.9527,
  108.438,
  NULL,
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

-- Place: 🚂 Dalat Railway Station (Dalat)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dla-dalat-railway-station',
  'vn',
  'dla',
  '🚂 Dalat Railway Station',
  'dla-dalat-railway-station',
  'museum',
  'showplace',
  'museum',
  '["colonial","railway","vintage","photo"]'::jsonb,
  'Старинный вокзал в стиле арт-деко — один из самых красивых и хорошо сохранившихся во Вьетнаме.',
  11.9412,
  108.4601,
  NULL,
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

-- Place: ⛪ Dalat Cathedral (Dalat)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dla-dalat-cathedral',
  'vn',
  'dla',
  '⛪ Dalat Cathedral',
  'dla-dalat-cathedral',
  'church',
  'showplace',
  'church',
  '["cathedral","colonial","landmark","photo"]'::jsonb,
  'Главный католический собор Далата, известный витражами и фигурой петуха на шпиле.',
  11.9496,
  108.4429,
  NULL,
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

-- Place: 👑 Bao Dai Palace III (Dalat)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dla-bao-dai-palace-iii',
  'vn',
  'dla',
  '👑 Bao Dai Palace III',
  'dla-bao-dai-palace-iii',
  'heritage',
  'showplace',
  'heritage',
  '["palace","history","interiors","colonial"]'::jsonb,
  'Летняя резиденция последнего императора Вьетнама Бао Дая с интерьерами середины XX века.',
  11.9289,
  108.4551,
  NULL,
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

-- Place: 🏺 Lam Dong Museum (Dalat)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dla-lam-dong-museum',
  'vn',
  'dla',
  '🏺 Lam Dong Museum',
  'dla-lam-dong-museum',
  'museum',
  'showplace',
  'museum',
  '["museum","history","culture","quiet"]'::jsonb,
  'Региональный музей истории и культуры провинции Ламдонг с экспозициями о народах Центрального нагорья.',
  11.9535,
  108.4356,
  NULL,
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

-- Place: 🌲 Dalat Pine Viewpoints (Dalat)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dla-dalat-pine-viewpoints',
  'vn',
  'dla',
  '🌲 Dalat Pine Viewpoints',
  'dla-dalat-pine-viewpoints',
  'viewpoint',
  'showplace',
  'viewpoint',
  '["viewpoint","pine","sunrise","panorama"]'::jsonb,
  'Несколько природных смотровых площадок в сосновых лесах вокруг Далата с видами на холмы и долины.',
  11.958,
  108.47,
  NULL,
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

-- Place: 🛍️ Dalat Market (Dalat)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dla-dalat-market',
  'vn',
  'dla',
  '🛍️ Dalat Market',
  'dla-dalat-market',
  'market',
  'business',
  'market',
  '["market","local-food","shopping","souvenirs"]'::jsonb,
  'Центральный рынок Далата — главный торговый и гастрономический узел города с продуктами, уличной едой и сувенирами.',
  11.9416,
  108.4383,
  NULL,
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

-- Place: 🌙 Dalat Night Market (Dalat)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dla-dalat-night-market',
  'vn',
  'dla',
  '🌙 Dalat Night Market',
  'dla-dalat-night-market',
  'night-market',
  'business',
  'night-market',
  '["street-food","shopping","evening","vibe"]'::jsonb,
  'Вечерний рынок вокруг центральной площади, превращающийся в гастрономический и прогулочный центр города.',
  11.9424,
  108.4388,
  NULL,
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

-- Place: 🍬 L’angfarm (Dalat)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dla-l-angfarm',
  'vn',
  'dla',
  '🍬 L’angfarm',
  'dla-l-angfarm',
  'shop',
  'business',
  'shop',
  '["sweets","tea","gifts","tasting"]'::jsonb,
  'Известный бренд локальных сладостей и чаёв с дегустациями и фирменными магазинами в центре Далата.',
  11.9429,
  108.4372,
  NULL,
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

-- Place: 🥐 Lien Hoa Bakery & Restaurant (Dalat)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dla-lien-hoa-bakery-restaurant',
  'vn',
  'dla',
  '🥐 Lien Hoa Bakery & Restaurant',
  'dla-lien-hoa-bakery-restaurant',
  'bakery',
  'business',
  'bakery',
  '["bakery","breakfast","budget","local"]'::jsonb,
  'Популярная пекарня и недорогой ресторан с европейскими и вьетнамскими блюдами, известный выпечкой.',
  11.9448,
  108.4381,
  NULL,
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

-- Place: 🍢 Nem nướng Bà Hùng (Dalat)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dla-nem-nuong-ba-hung',
  'vn',
  'dla',
  '🍢 Nem nướng Bà Hùng',
  'dla-nem-nuong-ba-hung',
  'restaurant',
  'business',
  'restaurant',
  '["local-specialty","nem-nuong","must-try","budget"]'::jsonb,
  'Легендарное заведение, специализирующееся на nem nướng — жареных рулетах из свинины, подаваемых с травами и соусами.',
  11.9402,
  108.4386,
  NULL,
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

-- Place: ☕ La Viet Coffee (Dalat)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dla-la-viet-coffee',
  'vn',
  'dla',
  '☕ La Viet Coffee',
  'dla-la-viet-coffee',
  'cafe',
  'business',
  'cafe',
  '["specialty-coffee","roastery","work-friendly","expat"]'::jsonb,
  'Известная specialty-кофейня и обжарочная, работающая с локальными фермами Центрального нагорья и формирующая кофейную репутацию Далата.',
  11.9579,
  108.4486,
  NULL,
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

-- Place: 🌿 An Cafe (Dalat)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dla-an-cafe',
  'vn',
  'dla',
  '🌿 An Cafe',
  'dla-an-cafe',
  'cafe',
  'business',
  'cafe',
  '["garden","cozy","photo","chill"]'::jsonb,
  'Уютное кафе в садовом стиле, известное атмосферой, домашней кухней и расслабленным ритмом.',
  11.9427,
  108.4389,
  NULL,
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

-- Place: 🌀 Maze Bar (Dalat)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'dla-maze-bar',
  'vn',
  'dla',
  '🌀 Maze Bar',
  'dla-maze-bar',
  'bar',
  'business',
  'bar',
  '["nightlife","labyrinth","unique","photo"]'::jsonb,
  'Лабиринтообразный бар и арт-пространство, известное необычной архитектурой и атмосферой приключения.',
  11.9396,
  108.441,
  NULL,
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

-- Place: 🏖️ Nha Trang Beach & Promenade (Nha Trang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'ntr-nha-trang-beach-promenade',
  'vn',
  'ntr',
  '🏖️ Nha Trang Beach & Promenade',
  'ntr-nha-trang-beach-promenade',
  'beach',
  'showplace',
  'beach',
  '["beach","promenade","city","evening"]'::jsonb,
  'Главный городской пляж Нячанга с длинной набережной, пальмами и курортной атмосферой.',
  12.2388,
  109.1967,
  NULL,
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

-- Place: 🗿 Po Nagar Cham Towers (Nha Trang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'ntr-po-nagar-cham-towers',
  'vn',
  'ntr',
  '🗿 Po Nagar Cham Towers',
  'ntr-po-nagar-cham-towers',
  'temple',
  'showplace',
  'temple',
  '["cham","heritage","viewpoint","must-see"]'::jsonb,
  'Храмовый комплекс цивилизации Чампа VII–XII веков, расположенный на холме у реки Кай.',
  12.2656,
  109.1902,
  NULL,
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

-- Place: 🛕 Long Son Pagoda (Nha Trang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'ntr-long-son-pagoda',
  'vn',
  'ntr',
  '🛕 Long Son Pagoda',
  'ntr-long-son-pagoda',
  'temple',
  'showplace',
  'temple',
  '["temple","buddha","viewpoint","city"]'::jsonb,
  'Буддийский комплекс с большой статуей Белого Будды на холме к западу от центра города.',
  12.2505,
  109.1926,
  NULL,
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

-- Place: ⛪ Nha Trang Cathedral (Nha Trang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'ntr-nha-trang-cathedral',
  'vn',
  'ntr',
  '⛪ Nha Trang Cathedral',
  'ntr-nha-trang-cathedral',
  'church',
  'showplace',
  'church',
  '["cathedral","colonial","landmark","photo"]'::jsonb,
  'Католический собор в готическом стиле, построенный французами на холме в центре Нячанга.',
  12.2499,
  109.1908,
  NULL,
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

-- Place: 🪨 Hon Chong Rocks (Nha Trang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'ntr-hon-chong-rocks',
  'vn',
  'ntr',
  '🪨 Hon Chong Rocks',
  'ntr-hon-chong-rocks',
  'nature',
  'showplace',
  'nature',
  '["rocks","sea-view","sunset","photo"]'::jsonb,
  'Природное образование из крупных гранитных валунов у моря, популярное место для прогулок и закатов.',
  12.2742,
  109.2041,
  NULL,
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

-- Place: 🐠 National Oceanographic Museum of Vietnam (Nha Trang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'ntr-national-oceanographic-museum-of-vietnam',
  'vn',
  'ntr',
  '🐠 National Oceanographic Museum of Vietnam',
  'ntr-national-oceanographic-museum-of-vietnam',
  'museum',
  'showplace',
  'museum',
  '["aquarium","marine","family","science"]'::jsonb,
  'Крупнейший морской музей Вьетнама с аквариумами, научными экспозициями и коллекциями морской фауны Южно-Китайского моря.',
  12.2089,
  109.2147,
  NULL,
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

-- Place: 🎢 VinWonders Nha Trang & Cable Car (Nha Trang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'ntr-vinwonders-nha-trang-cable-car',
  'vn',
  'ntr',
  '🎢 VinWonders Nha Trang & Cable Car',
  'ntr-vinwonders-nha-trang-cable-car',
  'theme-park',
  'showplace',
  'theme-park',
  '["cable-car","park","day-trip","family"]'::jsonb,
  'Крупнейший парк развлечений региона на острове Хон Че с канатной дорогой над морем.',
  12.2006,
  109.2477,
  NULL,
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

-- Place: 🛁 Tháp Bà Hot Springs (Nha Trang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'ntr-thap-ba-hot-springs',
  'vn',
  'ntr',
  '🛁 Tháp Bà Hot Springs',
  'ntr-thap-ba-hot-springs',
  'spa',
  'showplace',
  'spa',
  '["mud-bath","hot-springs","relax","popular"]'::jsonb,
  'Популярный комплекс грязевых и минеральных ванн у подножия холмов к северу от центра Нячанга.',
  12.2721,
  109.1895,
  NULL,
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

-- Place: 🛁 i-Resort Mud Bath (Nha Trang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'ntr-i-resort-mud-bath',
  'vn',
  'ntr',
  '🛁 i-Resort Mud Bath',
  'ntr-i-resort-mud-bath',
  'spa',
  'showplace',
  'spa',
  '["mud-bath","family","modern","relax"]'::jsonb,
  'Современный спа-комплекс с грязевыми ваннами, бассейнами и зонами отдыха более курортного формата.',
  12.2739,
  109.1881,
  NULL,
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

-- Place: 🤿 Hon Mun Island (Nha Trang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'ntr-hon-mun-island',
  'vn',
  'ntr',
  '🤿 Hon Mun Island',
  'ntr-hon-mun-island',
  'island',
  'showplace',
  'island',
  '["snorkeling","diving","marine","tour"]'::jsonb,
  'Остров и морской заповедник — главное место для снорклинга и дайвинга в заливе Нячанга.',
  12.2359,
  109.2867,
  NULL,
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

-- Place: 🍺 Louisiane Brewhouse (Nha Trang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'ntr-louisiane-brewhouse',
  'vn',
  'ntr',
  '🍺 Louisiane Brewhouse',
  'ntr-louisiane-brewhouse',
  'restaurant',
  'business',
  'restaurant',
  '["brewpub","beach","expat","live-music"]'::jsonb,
  'Пивоварня и ресторан на первой линии пляжа, сочетающий собственное крафтовое пиво, кухню и курортную атмосферу.',
  12.2383,
  109.1963,
  NULL,
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

-- Place: 🌴 Sailing Club (Nha Trang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'ntr-sailing-club',
  'vn',
  'ntr',
  '🌴 Sailing Club',
  'ntr-sailing-club',
  'bar',
  'business',
  'bar',
  '["beach-club","nightlife","fire-show","popular"]'::jsonb,
  'Культовый пляжный клуб Нячанга, объединяющий ресторан, бар и ночные вечеринки у моря.',
  12.2376,
  109.1956,
  NULL,
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

-- Place: 🍛 Ganesh Indian Restaurant (Nha Trang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'ntr-ganesh-indian-restaurant',
  'vn',
  'ntr',
  '🍛 Ganesh Indian Restaurant',
  'ntr-ganesh-indian-restaurant',
  'restaurant',
  'business',
  'restaurant',
  '["indian","vegetarian","curry","popular"]'::jsonb,
  'Известный индийский ресторан в центре Нячанга, популярный среди вегетарианцев и путешественников.',
  12.2399,
  109.1982,
  NULL,
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

-- Place: 🏡 Alpaca Homestyle Café (Nha Trang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'ntr-alpaca-homestyle-cafe',
  'vn',
  'ntr',
  '🏡 Alpaca Homestyle Café',
  'ntr-alpaca-homestyle-cafe',
  'cafe',
  'business',
  'cafe',
  '["brunch","cozy","european","small"]'::jsonb,
  'Небольшое уютное кафе с домашней атмосферой, европейскими завтраками и спокойной обстановкой.',
  12.2456,
  109.1919,
  NULL,
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

-- Place: 🔥 Lac Canh BBQ (Nha Trang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'ntr-lac-canh-bbq',
  'vn',
  'ntr',
  '🔥 Lac Canh BBQ',
  'ntr-lac-canh-bbq',
  'restaurant',
  'business',
  'restaurant',
  '["grill","local-legend","smoky","budget"]'::jsonb,
  'Легендарный ресторан-гриль, работающий с 1977 года и известный маринованным мясом, которое гости жарят сами.',
  12.2391,
  109.1937,
  NULL,
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

-- Place: 🍣 Kiwami Sushi (Nha Trang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'ntr-kiwami-sushi',
  'vn',
  'ntr',
  '🍣 Kiwami Sushi',
  'ntr-kiwami-sushi',
  'restaurant',
  'business',
  'restaurant',
  '["sushi","omakase","japanese","small"]'::jsonb,
  'Небольшой японский ресторан с форматом omakase, ориентированный на свежесть рыбы и аккуратную подачу.',
  12.2379,
  109.196,
  NULL,
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

-- Place: 🌃 Skylight Rooftop / Skydeck (Nha Trang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'ntr-skylight-rooftop-skydeck',
  'vn',
  'ntr',
  '🌃 Skylight Rooftop / Skydeck',
  'ntr-skylight-rooftop-skydeck',
  'bar',
  'business',
  'bar',
  '["rooftop","nightlife","view","club"]'::jsonb,
  'Rooftop-бар и ночной клуб на крыше отеля Havana с панорамным видом на город и море.',
  12.2386,
  109.1961,
  NULL,
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

-- Place: 🛍️ Chợ Đầm (Nha Trang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'ntr-cho-am',
  'vn',
  'ntr',
  '🛍️ Chợ Đầm',
  'ntr-cho-am',
  'market',
  'business',
  'market',
  '["shopping","local-life","food","bargain"]'::jsonb,
  'Главный крытый рынок Нячанга с продуктами, стрит-фудом и сувенирами.',
  12.2483,
  109.1904,
  NULL,
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

-- Place: 🌙 Nha Trang Night Market (Nha Trang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'ntr-nha-trang-night-market',
  'vn',
  'ntr',
  '🌙 Nha Trang Night Market',
  'ntr-nha-trang-night-market',
  'night-market',
  'business',
  'night-market',
  '["street-food","shopping","evening","tourist"]'::jsonb,
  'Вечерний туристический рынок у набережной с сувенирами, уличной едой и прогулочной атмосферой.',
  12.2373,
  109.1979,
  NULL,
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

-- Place: 🏖️ Long Beach (Phu Quoc)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'phu-long-beach',
  'vn',
  'phu',
  '🏖️ Long Beach',
  'phu-long-beach',
  'beach',
  'showplace',
  'beach',
  '["beach","sunset","resort","must-see"]'::jsonb,
  'Самый известный и протяжённый пляж Фукуока, расположенный вдоль западного побережья острова.',
  10.2579,
  103.9681,
  NULL,
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

-- Place: 🏝️ Sao Beach (Phu Quoc)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'phu-sao-beach',
  'vn',
  'phu',
  '🏝️ Sao Beach',
  'phu-sao-beach',
  'beach',
  'showplace',
  'beach',
  '["beach","white-sand","photo","paradise"]'::jsonb,
  'Белоснежный пляж на юго-востоке острова с бирюзовой водой и пальмами — один из самых фотогеничных во Вьетнаме.',
  9.9885,
  104.0903,
  NULL,
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

-- Place: 🌿 Ong Lang Beach (Phu Quoc)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'phu-ong-lang-beach',
  'vn',
  'phu',
  '🌿 Ong Lang Beach',
  'phu-ong-lang-beach',
  'beach',
  'showplace',
  'beach',
  '["beach","quiet","family","local"]'::jsonb,
  'Спокойный и менее туристический пляж на северо-западе Фукуока, популярный среди семей и любителей тишины.',
  10.3203,
  103.9564,
  NULL,
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

-- Place: 🌳 Phu Quoc National Park (Phu Quoc)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'phu-phu-quoc-national-park',
  'vn',
  'phu',
  '🌳 Phu Quoc National Park',
  'phu-phu-quoc-national-park',
  'nature',
  'showplace',
  'nature',
  '["national-park","hiking","wildlife","eco"]'::jsonb,
  'Один из крупнейших национальных парков Вьетнама, занимающий более половины острова и охраняющий тропические леса и дикую природу.',
  10.3,
  104,
  NULL,
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

-- Place: 🛕 Dinh Cậu Temple (Phu Quoc)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'phu-dinh-cau-temple',
  'vn',
  'phu',
  '🛕 Dinh Cậu Temple',
  'phu-dinh-cau-temple',
  'temple',
  'showplace',
  'temple',
  '["temple","sea-view","local","spiritual"]'::jsonb,
  'Буддийско-даосский храм на скале у моря, покровительствующий рыбакам и мореплавателям.',
  10.2315,
  103.9658,
  NULL,
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

-- Place: 🌙 Phu Quoc Night Market (Phu Quoc)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'phu-phu-quoc-night-market',
  'vn',
  'phu',
  '🌙 Phu Quoc Night Market',
  'phu-phu-quoc-night-market',
  'night-market',
  'business',
  'night-market',
  '["street-food","shopping","evening","vibe"]'::jsonb,
  'Главный ночной рынок острова в центре Дыонг Донга с уличной едой, сувенирами и живой атмосферой.',
  10.228,
  103.966,
  NULL,
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

-- Place: 🐟 Fish Sauce Factory (Phu Quoc)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'phu-fish-sauce-factory',
  'vn',
  'phu',
  '🐟 Fish Sauce Factory',
  'phu-fish-sauce-factory',
  'factory',
  'showplace',
  'factory',
  '["fish-sauce","local-product","tour","tasting"]'::jsonb,
  'Традиционная фабрика рыбного соуса, где можно увидеть процесс производства знаменитого фукуокского ныок мам.',
  10.235,
  103.967,
  NULL,
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

-- Place: ⚰️ Phu Quoc Prison (Phu Quoc)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'phu-phu-quoc-prison',
  'vn',
  'phu',
  '⚰️ Phu Quoc Prison',
  'phu-phu-quoc-prison',
  'memorial',
  'showplace',
  'memorial',
  '["history","war","education","memorial"]'::jsonb,
  'Мемориал бывшей тюрьмы, где содержались тысячи военнопленных во время войны во Вьетнаме.',
  10.24,
  103.98,
  NULL,
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

-- Place: 🦁 Vinpearl Safari & Grand World (Phu Quoc)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'phu-vinpearl-safari-grand-world',
  'vn',
  'phu',
  '🦁 Vinpearl Safari & Grand World',
  'phu-vinpearl-safari-grand-world',
  'theme-park',
  'showplace',
  'theme-park',
  '["safari","park","family","day-trip"]'::jsonb,
  'Крупнейший сафари-парк Вьетнама и тематический комплекс Grand World на севере острова.',
  10.35,
  103.97,
  NULL,
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

-- Place: 🚠 Hon Thom Cable Car (Phu Quoc)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'phu-hon-thom-cable-car',
  'vn',
  'phu',
  '🚠 Hon Thom Cable Car',
  'phu-hon-thom-cable-car',
  'attraction',
  'showplace',
  'attraction',
  '["cable-car","island","record","view"]'::jsonb,
  'Самая длинная морская канатная дорога в мире, соединяющая материковую часть Фукуока с островом Хон Том.',
  10.34,
  103.96,
  NULL,
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

-- Place: 🍜 Bánh Canh Chả Cá Ông Hai (Phu Quoc)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'phu-banh-canh-cha-ca-ong-hai',
  'vn',
  'phu',
  '🍜 Bánh Canh Chả Cá Ông Hai',
  'phu-banh-canh-cha-ca-ong-hai',
  'restaurant',
  'business',
  'restaurant',
  '["local-specialty","soup","budget","famous"]'::jsonb,
  'Легендарная лавка супа bánh canh с рыбными котлетами — одно из самых известных мест на Фукуоке.',
  10.229,
  103.9665,
  NULL,
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

-- Place: 🐚 Ốc 343 (Phu Quoc)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'phu-oc-343',
  'vn',
  'phu',
  '🐚 Ốc 343',
  'phu-oc-343',
  'restaurant',
  'business',
  'restaurant',
  '["seafood","snails","spicy","local"]'::jsonb,
  'Популярный ресторан морепродуктов, специализирующийся на блюдах из улиток и моллюсков.',
  10.23,
  103.967,
  NULL,
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

-- Place: 🦀 Gành Dầu Crab Market (Phu Quoc)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'phu-ganh-dau-crab-market',
  'vn',
  'phu',
  '🦀 Gành Dầu Crab Market',
  'phu-ganh-dau-crab-market',
  'market',
  'business',
  'market',
  '["crab","seafood","choose-live","local"]'::jsonb,
  'Рыбный рынок на северо-западе острова, где можно выбрать свежих крабов и приготовить их на месте.',
  10.41,
  103.92,
  NULL,
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

-- Place: 🌴 Rory’s Beach Bar (Phu Quoc)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'phu-rory-s-beach-bar',
  'vn',
  'phu',
  '🌴 Rory’s Beach Bar',
  'phu-rory-s-beach-bar',
  'bar',
  'business',
  'bar',
  '["beach-bar","sunset","cocktails","chill"]'::jsonb,
  'Популярный пляжный бар на Long Beach с закатами, коктейлями и расслабленной атмосферой.',
  10.257,
  103.968,
  NULL,
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

-- Place: 🌿 The Pepper Tree (Phu Quoc)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'phu-the-pepper-tree',
  'vn',
  'phu',
  '🌿 The Pepper Tree',
  'phu-the-pepper-tree',
  'restaurant',
  'business',
  'restaurant',
  '["european","garden","romantic","upscale"]'::jsonb,
  'Уютный ресторан с европейской кухней и тропическим садом, ориентированный на гостей бутик-отелей.',
  10.25,
  103.97,
  NULL,
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

-- Place: 🍝 Luna Rossa (Phu Quoc)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'phu-luna-rossa',
  'vn',
  'phu',
  '🍝 Luna Rossa',
  'phu-luna-rossa',
  'restaurant',
  'business',
  'restaurant',
  '["italian","pizza","sunset","romantic"]'::jsonb,
  'Итальянский ресторан на Long Beach с пиццей из дровяной печи и видом на море.',
  10.255,
  103.969,
  NULL,
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

-- Place: 🍲 PhuongBinh Restaurant (Phu Quoc)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'phu-phuongbinh-restaurant',
  'vn',
  'phu',
  '🍲 PhuongBinh Restaurant',
  'phu-phuongbinh-restaurant',
  'restaurant',
  'business',
  'restaurant',
  '["vietnamese","family","popular","budget"]'::jsonb,
  'Семейный ресторан с вьетнамской кухней, известный большим выбором блюд и уютной атмосферой.',
  10.2305,
  103.9668,
  NULL,
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

-- Place: 🌊 Shimmer Restaurant (Phu Quoc)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'phu-shimmer-restaurant',
  'vn',
  'phu',
  '🌊 Shimmer Restaurant',
  'phu-shimmer-restaurant',
  'restaurant',
  'business',
  'restaurant',
  '["fine-dining","sea-view","romantic","upscale"]'::jsonb,
  'Ресторан высокой кухни в бутик-отеле Salinda с панорамным видом на море и авторской интерпретацией вьетнамской кухни.',
  10.225,
  103.965,
  NULL,
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

-- Place: 🌙 Đường Bàng Night Market (Phu Quoc)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'phu-uong-bang-night-market',
  'vn',
  'phu',
  '🌙 Đường Bàng Night Market',
  'phu-uong-bang-night-market',
  'night-market',
  'business',
  'night-market',
  '["local","street-food","quiet","evening"]'::jsonb,
  'Маленький ночной рынок в районе Duong Ba Lam, ориентированный на местных жителей и гостей близлежащих отелей.',
  10.25,
  103.975,
  NULL,
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

-- Place: 🌊 Hoan Kiem Lake & Ngoc Son Temple (Hanoi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'han-hoan-kiem-lake-ngoc-son-temple',
  'vn',
  'han',
  '🌊 Hoan Kiem Lake & Ngoc Son Temple',
  'han-hoan-kiem-lake-ngoc-son-temple',
  'landmark',
  'showplace',
  'landmark',
  '["lake","temple","city-center","must-see"]'::jsonb,
  'Сердце Ханоя — живописное озеро с легендарным храмом на острове, символ города и место встреч горожан.',
  21.0298,
  105.8517,
  NULL,
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

-- Place: 🏮 Old Quarter (Hanoi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'han-old-quarter',
  'vn',
  'han',
  '🏮 Old Quarter',
  'han-old-quarter',
  'heritage',
  'showplace',
  'heritage',
  '["unesco","confucian","history","education"]'::jsonb,
  'Исторический центр Ханоя с лабиринтом узких улиц, каждая из которых когда-то специализировалась на определённом ремесле. Первый университет Вьетнама, посвящённый Конфуцию и учёным, объект национального значения.',
  21.028,
  105.819,
  NULL,
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

-- Place: ⚰️ Hoa Lo Prison (Hanoi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'han-hoa-lo-prison',
  'vn',
  'han',
  '⚰️ Hoa Lo Prison',
  'han-hoa-lo-prison',
  'memorial',
  'showplace',
  'memorial',
  '["history","war","colonial","education"]'::jsonb,
  'Бывшая тюрьма французской колониальной эпохи, позже использовавшаяся во Вьетнамской войне.',
  21.027,
  105.842,
  NULL,
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

-- Place: ⛪ St. Joseph’s Cathedral (Hanoi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'han-st-joseph-s-cathedral',
  'vn',
  'han',
  '⛪ St. Joseph’s Cathedral',
  'han-st-joseph-s-cathedral',
  'church',
  'showplace',
  'church',
  '["cathedral","gothic","landmark","photo"]'::jsonb,
  'Неоготический католический собор в центре Ханоя, напоминающий парижский Нотр-Дам.',
  21.0278,
  105.853,
  NULL,
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

-- Place: 🏯 One Pillar Pagoda (Hanoi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'han-one-pillar-pagoda',
  'vn',
  'han',
  '🏯 One Pillar Pagoda',
  'han-one-pillar-pagoda',
  'temple',
  'showplace',
  'temple',
  '["temple","iconic","lotus","heritage"]'::jsonb,
  'Уникальная буддийская пагода в форме цветка лотоса, стоящая на одной каменной колонне.',
  21.031,
  105.819,
  NULL,
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

-- Place: 🌊 West Lake (Hanoi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'han-west-lake',
  'vn',
  'han',
  '🌊 West Lake',
  'han-west-lake',
  'lake',
  'showplace',
  'lake',
  '["lake","temple","sunset","local-life"]'::jsonb,
  'Крупнейшее озеро Ханоя с буддийской пагодой на берегу и множеством кафе и ресторанов.',
  21.04,
  105.81,
  NULL,
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

-- Place: 🛕 Quan Thanh Temple (Hanoi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'han-quan-thanh-temple',
  'vn',
  'han',
  '🛕 Quan Thanh Temple',
  'han-quan-thanh-temple',
  'temple',
  'showplace',
  'temple',
  '["daoist","ancient","bronze","heritage"]'::jsonb,
  'Один из старейших даосских храмов Ханоя, посвящённый богу войны и покровителю северных ворот города.',
  21.045,
  105.812,
  NULL,
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

-- Place: 🏳️ Flag Tower of Hanoi (Hanoi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'han-flag-tower-of-hanoi',
  'vn',
  'han',
  '🏳️ Flag Tower of Hanoi',
  'han-flag-tower-of-hanoi',
  'landmark',
  'showplace',
  'landmark',
  '["tower","history","viewpoint","heritage"]'::jsonb,
  'Историческая башня, построенная в начале XIX века и сохранившаяся как символ независимости Вьетнама.',
  21.025,
  105.822,
  NULL,
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

-- Place: 🏛️ Ba Dinh Square & Ho Chi Minh Mausoleum (Hanoi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'han-ba-dinh-square-ho-chi-minh-mausoleum',
  'vn',
  'han',
  '🏛️ Ba Dinh Square & Ho Chi Minh Mausoleum',
  'han-ba-dinh-square-ho-chi-minh-mausoleum',
  'memorial',
  'showplace',
  'memorial',
  '["mausoleum","politics","history","must-see"]'::jsonb,
  'Главная площадь Вьетнама, где находится мавзолей Хо Ши Мина и правительственные здания.',
  21.034,
  105.82,
  NULL,
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

-- Place: 🛍️ Ben Thanh Market (Ho Chi Minh City)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'sgn-ben-thanh-market',
  'vn',
  'sgn',
  '🛍️ Ben Thanh Market',
  'sgn-ben-thanh-market',
  'market',
  'business',
  'market',
  '["shopping","street-food","iconic","tourist"]'::jsonb,
  'Самый известный рынок Сайгона и символ города, расположенный в самом центре.',
  10.772,
  106.698,
  NULL,
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

-- Place: ⛪ Notre-Dame Cathedral Basilica of Saigon (Ho Chi Minh City)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'sgn-notre-dame-cathedral-basilica-of-saigon',
  'vn',
  'sgn',
  '⛪ Notre-Dame Cathedral Basilica of Saigon',
  'sgn-notre-dame-cathedral-basilica-of-saigon',
  'church',
  'showplace',
  'church',
  '["cathedral","colonial","landmark","photo"]'::jsonb,
  'Неоготический собор из красного кирпича, построенный французами в XIX веке.',
  10.78,
  106.7,
  NULL,
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

-- Place: 📮 Central Post Office (Ho Chi Minh City)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'sgn-central-post-office',
  'vn',
  'sgn',
  '📮 Central Post Office',
  'sgn-central-post-office',
  'heritage',
  'showplace',
  'heritage',
  '["colonial","architecture","history","working"]'::jsonb,
  'Историческое здание почты, спроектированное Гюставом Эйфелем, с великолепным интерьером.',
  10.7793,
  106.7008,
  NULL,
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

-- Place: 🏛️ Independence Palace (Ho Chi Minh City)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'sgn-independence-palace',
  'vn',
  'sgn',
  '🏛️ Independence Palace',
  'sgn-independence-palace',
  'heritage',
  'showplace',
  'heritage',
  '["history","war","palace","must-see"]'::jsonb,
  'Бывшая резиденция президента Южного Вьетнама, где завершилась война 30 апреля 1975 года.',
  10.7795,
  106.699,
  NULL,
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

-- Place: ⚔️ War Remnants Museum (Ho Chi Minh City)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'sgn-war-remnants-museum',
  'vn',
  'sgn',
  '⚔️ War Remnants Museum',
  'sgn-war-remnants-museum',
  'museum',
  'showplace',
  'museum',
  '["war","history","education","emotional"]'::jsonb,
  'Один из самых посещаемых музеев Вьетнама, посвящённый войне во Вьетнаме.',
  10.78,
  106.693,
  NULL,
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

-- Place: 🛕 Jade Emperor Pagoda (Ho Chi Minh City)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'sgn-jade-emperor-pagoda',
  'vn',
  'sgn',
  '🛕 Jade Emperor Pagoda',
  'sgn-jade-emperor-pagoda',
  'temple',
  'showplace',
  'temple',
  '["temple","daoist","spiritual","photo"]'::jsonb,
  'Буддийско-даосский храм с богатым декором и атмосферой духовности.',
  10.775,
  106.697,
  NULL,
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

-- Place: 🛍️ Binh Tay Market (Ho Chi Minh City)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'sgn-binh-tay-market',
  'vn',
  'sgn',
  '🛍️ Binh Tay Market',
  'sgn-binh-tay-market',
  'market',
  'business',
  'market',
  '["local","wholesale","authentic","chinese"]'::jsonb,
  'Крупнейший оптовый рынок Чolon (китайского квартала), ориентированный на местных.',
  10.747,
  106.638,
  NULL,
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

-- Place: 🌳 Tao Dan Park (Ho Chi Minh City)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'sgn-tao-dan-park',
  'vn',
  'sgn',
  '🌳 Tao Dan Park',
  'sgn-tao-dan-park',
  'park',
  'showplace',
  'park',
  '["park","local-life","morning","green"]'::jsonb,
  'Главный городской парк Сайгона с озерами, аллеями и местной жизнью.',
  10.768,
  106.685,
  NULL,
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

-- Place: 🌃 Bitexco Financial Tower & Skydeck (Ho Chi Minh City)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'sgn-bitexco-financial-tower-skydeck',
  'vn',
  'sgn',
  '🌃 Bitexco Financial Tower & Skydeck',
  'sgn-bitexco-financial-tower-skydeck',
  'viewpoint',
  'showplace',
  'viewpoint',
  '["skyscraper","view","night","city"]'::jsonb,
  'Самое высокое здание центра Сайгона с смотровой площадкой на 49 этаже.',
  10.771,
  106.703,
  NULL,
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

-- Place: 🌊 Saigon River Promenade (Ho Chi Minh City)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'sgn-saigon-river-promenade',
  'vn',
  'sgn',
  '🌊 Saigon River Promenade',
  'sgn-saigon-river-promenade',
  'promenade',
  'showplace',
  'promenade',
  '["river","evening","walk","photo"]'::jsonb,
  'Набережная реки Сайгон с парком, кафе и видами на мосты и корабли.',
  10.775,
  106.705,
  NULL,
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
