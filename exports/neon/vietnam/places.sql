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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Спешелти-кофейня в центре Хюэ, ориентированная на качество зёрен, аккуратную экстракцию и спокойную рабочую атмосферу. - V60 / Filter Coffee с локальным зерном - Cold Brew (18 часов) - Эспрессо без горечи и перекрывающих вкусов - 💰 30 000–80 000 VND за напиток - ☕ Средний чек: ~60 000 VND',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Легендарное семейное кафе — родина солёного кофе, одного из гастрономических символов Хюэ. - Cà phê muối — кофе с солёно-сливочной пенкой - Cà phê sữa đá — классика по-хюэцки - 💰 15 000–30 000 VND - ☕ Средний чек: ~25 000 VND',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Популярный семейный ресторан, где под одной крышей собраны основные блюда императорской кухни Хюэ. - Nem lụi (свинина на лимоннике) - Bánh bèo / bánh nậm / bánh lọc (ассорти) - Сет «Taste of Hue» - 💰 100 000–150 000 VND на человека - 🍽️ Сеты — лучший выбор',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Уютный ресторан традиционной кухни Хюэ с туристически комфортным сервисом и сохранением аутентичных рецептов. - Bún bò Huế - Ассорти хюэцких закусок - Nem lụi - 💰 150 000–250 000 VND - 🍽️ Средний чек с напитком',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Знаковый вегетарианский ресторан буддийской кухни в традиционном садовом доме. - Cơm sen Huế (рис в листе лотоса) - Вегетарианские версии блюд Хюэ - Ассорти для компании - 💰 50 000–100 000 VND - 🥗 Отличное соотношение цена/качество',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Первая крафтовая пивоварня Хюэ и главное место встречи экспатов, путешественников и местной креативной сцены. - Дегустационный сет из 4–5 сортов - IPA и сезонные экспериментальные сорта - Пицца на закваске или бургеры - 🍺 Пиво: 60 000–90 000 VND - 🍕 Основные блюда: 150 000–220 000 VND - 💰 Средний чек: 250 000–400 000 VND',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Самый известный ночной бар Хюэ с интернациональной тусовкой, танцами и вечеринками до глубокой ночи. - Коктейли “Bucket” на компанию - Шоты по акциям бара - Местное пиво Huda - 🍺 Пиво: ~25 000 VND - 🍹 Коктейли: 70 000–100 000 VND - 🪣 Bucket: 150 000–180 000 VND',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Главный рынок Хюэ и ключевая торговая площадка города с уличной едой, продуктами и сувенирами. - Bún bò Huế на фуд-корте - Bánh bèo и bánh lọc - Chè Huế (сладкие десерты) - 🍽️ Уличная еда: 15 000–40 000 VND - 🛒 Покупки и сувениры — по договорённости',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Вечерний рынок и пешеходная зона вдоль Парфюмной реки с едой, сувенирами и уличными выступлениями. - Закуски из рисовой муки - Морепродукты на гриле - Местные сладости и напитки - 🍽️ Еда: 20 000–50 000 VND - 🛍️ Сувениры — по ситуации',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Самая известная баньми-лавка Хойана, прославившаяся после визита Энтони Бурдена и ставшая гастрономической легендой города. - Bánh mì đặc biệt (фирменный сэндвич) - Версия с жареной свининой или курицей - Добавка с домашним соусом - 💰 25 000–40 000 VND - 🥪 Средний чек: ~30 000 VND',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Культовый семейный ресторан куриного риса — одно из самых уважаемых заведений Хойана. - Cơm gà truyền thống (курица с жёлтым рисом) - Куриный салат с травами - Домашний соус - 💰 40 000–60 000 VND - 🍽️ Средний чек: ~50 000 VND',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Знаменитая лавка баньми, известная дружелюбным сервисом и индивидуальным подходом к каждому заказу. - Bánh mì с комбинированной начинкой - Версия с острым соусом - Домашний паштет - 💰 20 000–35 000 VND - 🥪 Средний чек: ~30 000 VND',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Один из самых популярных ресторанов центральной вьетнамской кухни в старом городе Хойана. - Cao lầu - White rose dumplings - Сеты региональной кухни - 💰 150 000–300 000 VND - 🍽️ Средний чек: ~200 000 VND',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Весёлый ресторан-колодец с сет-меню, где гости сами собирают блюда и делятся за общим столом. - Bánh xèo - Nem lụi - Ассорти для заворачивания - 💰 Сет: ~120 000–150 000 VND - 🍽️ Цена за сет',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Уникальный чайный дом в старом городе Хойана, где обслуживание ведут люди с нарушениями слуха, а общение происходит через записки и жесты. - Традиционные вьетнамские чаи - Травяные и цветочные сборы - Лёгкие сладости к чаю - 💰 60 000–120 000 VND - 🍵 Средний чек: ~80 000 VND',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Кофейня с одной из самых известных крыш Хойана и панорамным видом на старый город и его черепичные крыши. - Кофе со льдом по-вьетнамски - Десерты и выпечка - Напитки на крыше - 💰 40 000–80 000 VND - ☕ Средний чек: ~60 000 VND',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Небольшая уличная стойка с фирменным травяным напитком, ставшим гастрономическим символом Хойана. - Травяной напиток Mót (лимонник, лайм, мёд) - 💰 ~15 000 VND - 🥤 Формат take-away',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Один из самых известных ателье Хойана, специализирующийся на индивидуальном пошиве одежды. - Индивидуальный пошив костюмов - Платья и рубашки по меркам - Консультации дизайнеров - 💰 От 80–150 USD за изделие - 👔 Цена зависит от ткани и сложности',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Пляжный бар-ресторан на Ан Банге с живой музыкой, интернациональной кухней и расслабленной атмосферой. - Бургеры и западные блюда - Коктейли и пиво - Барбекю по вечерам - 💰 120 000–300 000 VND - 🍹 Средний чек: ~200 000 VND',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Популярный ресторан традиционной вьетнамской кухни в Дананге с большим меню и удобным форматом для семей и компаний. - 🍽️ Bánh xèo - 🍽️ Nem lụi - 🍽️ Cao lầu и региональные супы - 💰 120 000–250 000 VND - 🍽️ Средний чек: ~180 000 VND',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Ресторан высокой кухни в курорте InterContinental Danang, отмеченный звёздным уровнем сервиса и панорамными видами. - Дегустационные сеты - Французская высокая кухня - Винное сопровождение - 💰 3 000 000–6 000 000 VND - 🍽️ Формат: дегустационные меню',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Шумный и аутентичный рыбный ресторан, где гости выбирают свежие морепродукты прямо у аквариумов. - Краб и лобстер на гриле - Креветки с солью и перцем - Мидии с лимонником - 💰 200 000–400 000 VND (в зависимости от выбора) - 🍽️ Цена за вес',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Современная спешелти-кофейня и обжарочная, известная дизайнерским пространством и качеством кофе. - Фильтр-кофе и single origin - Cold brew - Авторские напитки - 💰 45 000–90 000 VND - ☕ Средний чек: ~70 000 VND',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Известная вьетнамская сеть кофеен в ретро-стиле, популярная среди местных и туристов. - Coconut coffee - Cà phê sữa đá - Традиционные снеки - 💰 40 000–70 000 VND - ☕ Средний чек: ~55 000 VND',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Самый высокий rooftop-бар Дананга, расположенный на крыше отеля Novotel с панорамным видом на город и реку Хан. - Авторские коктейли - Классические highball - Лёгкие закуски к напиткам - 💰 Коктейли: 180 000–300 000 VND - 🍸 Средний чек: ~250 000–350 000 VND',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Ресторан и бар на набережной реки Хан, популярный у экспатов и гостей города. - Бургеры и стейки - Местное и импортное пиво - Коктейли - 💰 120 000–300 000 VND - 🍽️ Средний чек: ~200 000 VND',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Центральный крытый рынок Дананга с продуктами, сувенирами и локальной едой. - Лапша и супы на фуд-корте - Сухофрукты и кофе - Местные сладости - 🍽️ Еда: 20 000–50 000 VND - 🛒 Сувениры — торг уместен',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Крупный рынок для местных жителей, известный аутентичным стрит-фудом и низкими ценами. - Mi Quang - Bánh xèo - Разнообразные закуски - 🍽️ 15 000–40 000 VND - 🥢 Средний чек: минимальный',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Ночной рынок у моста Дракона с уличной едой, сувенирами и вечерней атмосферой. - Морепродукты на гриле - Снэки и десерты - Напитки с собой - 🍽️ 30 000–70 000 VND - 🛍️ Сувениры — по ситуации',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Центральный рынок Далата — главный торговый и гастрономический узел города с продуктами, уличной едой и сувенирами. - Bánh tráng nướng (далатская «пицца») - Авокадо с мороженым - Клубника и сухофрукты - 🍽️ Стрит-фуд: 15 000–40 000 VND - 🛒 Продукты и сувениры — торг уместен',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Вечерний рынок вокруг центральной площади, превращающийся в гастрономический и прогулочный центр города. - Горячие соевые напитки - Гриль-закуски - Bánh tráng nướng - 🍽️ 20 000–50 000 VND - 🛍️ Сувениры — по ситуации',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Известный бренд локальных сладостей и чаёв с дегустациями и фирменными магазинами в центре Далата. - Артишоковый чай - Фруктовые снеки - Шоколад и конфеты - 💰 40 000–150 000 VND (в зависимости от продукта)',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Популярная пекарня и недорогой ресторан с европейскими и вьетнамскими блюдами, известный выпечкой. - Французские булочки и пирожные - Завтраки и супы - Кофе и десерты - 💰 20 000–70 000 VND - 🍽️ Средний чек: ~50 000 VND',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Легендарное заведение, специализирующееся на nem nướng — жареных рулетах из свинины, подаваемых с травами и соусами. - Nem nướng (фирменное блюдо) - Ассорти для заворачивания - Соусы домашнего приготовления - 💰 40 000–70 000 VND - 🍽️ Средний чек: ~60 000 VND',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Известная specialty-кофейня и обжарочная, работающая с локальными фермами Центрального нагорья и формирующая кофейную репутацию Далата. - Фильтр-кофе single origin - Cold brew - Авторские кофейные напитки - 💰 45 000–90 000 VND - ☕ Средний чек: ~70 000 VND',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Уютное кафе в садовом стиле, известное атмосферой, домашней кухней и расслабленным ритмом. - Домашние завтраки - Вьетнамский кофе - Лёгкие обеды - 💰 40 000–90 000 VND - 🍽️ Средний чек: ~70 000 VND',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Лабиринтообразный бар и арт-пространство, известное необычной архитектурой и атмосферой приключения. - Коктейли и пиво - Лёгкие закуски - Прогулку по лабиринтам - 🍺 Напитки: 50 000–120 000 VND - 🍸 Средний чек: ~100 000 VND',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Пивоварня и ресторан на первой линии пляжа, сочетающий собственное крафтовое пиво, кухню и курортную атмосферу. - Фирменные сорта крафтового пива - Немецкие и европейские блюда - Морепродукты на гриле - 💰 Пиво: 70 000–120 000 VND - 🍽️ Средний чек: ~250 000 VND',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Культовый пляжный клуб Нячанга, объединяющий ресторан, бар и ночные вечеринки у моря. - Коктейли - Морепродукты и лёгкие блюда - Напитки на закате - 💰 Коктейли: 120 000–200 000 VND - 🍽️ Средний чек: ~300 000 VND',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Известный индийский ресторан в центре Нячанга, популярный среди вегетарианцев и путешественников. - Butter chicken - Palak paneer - Garlic naan - 💰 120 000–250 000 VND - 🍽️ Средний чек: ~200 000 VND',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Небольшое уютное кафе с домашней атмосферой, европейскими завтраками и спокойной обстановкой. - Завтраки и бранчи - Домашние десерты - Кофе и смузи - 💰 60 000–150 000 VND - 🍽️ Средний чек: ~120 000 VND',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Легендарный ресторан-гриль, работающий с 1977 года и известный маринованным мясом, которое гости жарят сами. - Маринованную говядину - Свинину и морепродукты - Домашние соусы - 💰 150 000–300 000 VND - 🍽️ Средний чек: ~220 000 VND',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Небольшой японский ресторан с форматом omakase, ориентированный на свежесть рыбы и аккуратную подачу. - Omakase-сет - Nigiri из свежей рыбы - Японские закуски - 💰 500 000–1 000 000 VND - 🍽️ Формат: дегустационный сет',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Rooftop-бар и ночной клуб на крыше отеля Havana с панорамным видом на город и море. - Авторские коктейли - Классические миксы - Лёгкие закуски - 💰 Коктейли: 150 000–300 000 VND - 🎟️ Вход: иногда платный вечером',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Главный крытый рынок Нячанга с продуктами, стрит-фудом и сувенирами. - Морепродукты и лапшу - Сухофрукты и кофе - Местные сладости - 🍽️ 20 000–50 000 VND - 🛒 Торг уместен',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Вечерний туристический рынок у набережной с сувенирами, уличной едой и прогулочной атмосферой. - Гриль-закуски - Фрукты и десерты - Напитки с собой - 🍽️ 30 000–70 000 VND - 🛍️ Сувениры — по ситуации',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Легендарная лавка супа bánh canh с рыбными котлетами — одно из самых известных мест на Фукуоке. - Bánh canh chả cá (суп с рыбными котлетами) - Добавка с перцем и лаймом - 💰 ~30 000–40 000 VND - 🍜 Средний чек: минимальный',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Популярный ресторан морепродуктов, специализирующийся на блюдах из улиток и моллюсков. - Ốc nướng tiêu (улитки с перцем) - Ốc hấp sả (на пару с лемонграссом) - Разнообразные соусы - 💰 150 000–300 000 VND - 🍽️ Средний чек: ~200 000 VND',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Рыбный рынок на северо-западе острова, где можно выбрать свежих крабов и приготовить их на месте. - Краба с перцем - Креветки на гриле - Мидии - 💰 Зависит от веса (обычно 200 000–400 000 VND)',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Популярный пляжный бар на Long Beach с закатами, коктейлями и расслабленной атмосферой. - Мохито и джин-тоник - Кокосы - Лёгкие закуски - 💰 80 000–150 000 VND - 🍹 Средний чек: ~120 000 VND',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Уютный ресторан с европейской кухней и тропическим садом, ориентированный на гостей бутик-отелей. - Стейки и паста - Авторские десерты - Винная карта - 💰 300 000–600 000 VND - 🍽️ Средний чек: ~450 000 VND',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Итальянский ресторан на Long Beach с пиццей из дровяной печи и видом на море. - Pizza Margherita - Паста с морепродуктами - Тирамису - 💰 250 000–500 000 VND - 🍽️ Средний чек: ~350 000 VND',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Семейный ресторан с вьетнамской кухней, известный большим выбором блюд и уютной атмосферой. - Phở - Cao lầu - Морепродукты - 💰 100 000–200 000 VND - 🍽️ Средний чек: ~150 000 VND',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Ресторан высокой кухни в бутик-отеле Salinda с панорамным видом на море и авторской интерпретацией вьетнамской кухни. - Дегустационные сеты - Морепродукты с местными травами - Коктейли с перцем Фукуока - 💰 500 000–1 000 000 VND - 🍽️ Формат: à la carte / сеты',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
  'Маленький ночной рынок в районе Duong Ba Lam, ориентированный на местных жителей и гостей близлежащих отелей. - Морепродукты на гриле - Лапшу и супы - Фрукты - 💰 30 000–70 000 VND - 🛍️ Сувениры — по ситуации',
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🍜 Bún Chả Hương Liên (Hanoi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'han-bun-cha-huong-lien',
  'vn',
  'han',
  '🍜 Bún Chả Hương Liên',
  'han-bun-cha-huong-lien',
  'restaurant',
  'business',
  'restaurant',
  '["bun-cha","famous","obama","local"]'::jsonb,
  'Ресторан, прославившийся после визита Барака Обамы и Энтони Бурдена, подающий классический бун ча. - Bún chả (жареная свинина с лапшой и травами) - Nem cua bể (крабовые роллы) - 💰 100 000–150 000 VND - 🍽️ Средний чек: ~120 000 VND',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🍜 Phở Gia Truyền Bát Đàn (Hanoi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'han-pho-gia-truyen-bat-an',
  'vn',
  'han',
  '🍜 Phở Gia Truyền Bát Đàn',
  'han-pho-gia-truyen-bat-an',
  'restaurant',
  'business',
  'restaurant',
  '["pho","local-legend","budget","authentic"]'::jsonb,
  'Легендарная лавка фо, работающая с 1954 года и считающаяся одной из лучших в Ханое. - Phở bò tái (фо с сырой говядиной) - Добавка с чили и лаймом - 💰 ~40 000–50 000 VND - 🍜 Средний чек: минимальный',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🥖 Bánh Mì 25 (Hanoi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'han-banh-mi-25',
  'vn',
  'han',
  '🥖 Bánh Mì 25',
  'han-banh-mi-25',
  'restaurant',
  'business',
  'restaurant',
  '["banh-mi","street-food","budget","quick"]'::jsonb,
  'Популярная лавка баньми в Старом квартале с большим выбором начинок и быстрым сервисом. - Bánh mì đặc biệt (ассорти) - Версия с паштетом и овощами - 💰 25 000–40 000 VND - 🥪 Средний чек: ~30 000 VND',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: ☕ Cà Phê Giảng (Hanoi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'han-ca-phe-giang',
  'vn',
  'han',
  '☕ Cà Phê Giảng',
  'han-ca-phe-giang',
  'cafe',
  'business',
  'cafe',
  '["egg-coffee","historic","local","must-try"]'::jsonb,
  'Легендарное кафе, изобретшее яичный кофе — уникальный напиток Ханоя. - Cà phê trứng (яичный кофе) - Горячую или холодную версию - 💰 30 000–50 000 VND - ☕ Средний чек: ~40 000 VND',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🧱 Cong Caphe (Hanoi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'han-cong-caphe',
  'vn',
  'han',
  '🧱 Cong Caphe',
  'han-cong-caphe',
  'cafe',
  'business',
  'cafe',
  '["coffee","retro","coconut-coffee","chain"]'::jsonb,
  'Популярная вьетнамская сеть кофеен в ретро-стиле с фирменным кокосовым кофе. - Coconut coffee - Cà phê sữa đá - 💰 40 000–70 000 VND - ☕ Средний чек: ~55 000 VND',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 💎 Hidden Gem Café (Hanoi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'han-hidden-gem-cafe',
  'vn',
  'han',
  '💎 Hidden Gem Café',
  'han-hidden-gem-cafe',
  'cafe',
  'business',
  'cafe',
  '["view","cathedral","cozy","photo"]'::jsonb,
  'Уютное кафе с видом на Собор Святого Иосифа, популярное среди фотографов и путешественников. - Кофе со льдом - Домашние десерты - 💰 50 000–90 000 VND - ☕ Средний чек: ~70 000 VND',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🍽️ Nhà Hàng Ngon (Hanoi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'han-nha-hang-ngon',
  'vn',
  'han',
  '🍽️ Nhà Hàng Ngon',
  'han-nha-hang-ngon',
  'restaurant',
  'business',
  'restaurant',
  '["vietnamese","garden","family","popular"]'::jsonb,
  'Популярный ресторан с широким выбором вьетнамской кухни в садовом оформлении. - Phở - Bún chả - Cao lầu и другие региональные блюда - 💰 150 000–300 000 VND - 🍽️ Средний чек: ~200 000 VND',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🍜 Quán Ăn Ngon (Hanoi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'han-quan-an-ngon',
  'vn',
  'han',
  '🍜 Quán Ăn Ngon',
  'han-quan-an-ngon',
  'restaurant',
  'business',
  'restaurant',
  '["street-food","vietnamese","budget","tourist-friendly"]'::jsonb,
  'Аналог Nhà Hàng Ngon с более неформальной атмосферой и акцентом на уличные блюда. - Bánh xèo - Nem cuốn - Разнообразные закуски - 💰 100 000–200 000 VND - 🍽️ Средний чек: ~150 000 VND',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🛍️ Chợ Đồng Xuân (Hanoi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'han-cho-ong-xuan',
  'vn',
  'han',
  '🛍️ Chợ Đồng Xuân',
  'han-cho-ong-xuan',
  'market',
  'business',
  'market',
  '["shopping","local-life","food","bargain"]'::jsonb,
  'Крупнейший крытый рынок Ханоя с товарами, одеждой и уличной едой. - Лапшу и супы на фуд-корте - Сухофрукты и специи - 🍽️ 20 000–50 000 VND - 🛒 Торг уместен',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🌙 Night Market (Hanoi)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'han-night-market',
  'vn',
  'han',
  '🌙 Night Market',
  'han-night-market',
  'night-market',
  'business',
  'night-market',
  '["street-food","shopping","evening","vibe"]'::jsonb,
  'Вечерний рынок в Старом квартале, превращающий улицы в пешеходную зону с едой и сувенирами. - Жареные закуски - Фрукты и напитки - 🍽️ 30 000–70 000 VND - 🛍️ Сувениры — по ситуации',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🥖 Bánh Mì Huỳnh Hoa (Ho Chi Minh City)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'sgn-banh-mi-huynh-hoa',
  'vn',
  'sgn',
  '🥖 Bánh Mì Huỳnh Hoa',
  'sgn-banh-mi-huynh-hoa',
  'restaurant',
  'business',
  'restaurant',
  '["banh-mi","famous","queue","budget"]'::jsonb,
  'Самая знаменитая лавка баньми в Сайгоне с огромными порциями и очередями. - Bánh mì đặc biệt (ассорти из мяса и паштета) - 💰 ~45 000–60 000 VND - 🥪 Средний чек: ~50 000 VND',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🍚 Cơm Tấm Cali (Ho Chi Minh City)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'sgn-com-tam-cali',
  'vn',
  'sgn',
  '🍚 Cơm Tấm Cali',
  'sgn-com-tam-cali',
  'restaurant',
  'business',
  'restaurant',
  '["com-tam","local","chain","budget"]'::jsonb,
  'Сеть ресторанов, специализирующихся на cơm tấm — рисе из ломаного зерна с грилем. - Cơm tấm sườn nướng (рис с жарёной свининой) - Trứng ốp la (яйцо-глазунья) - 💰 40 000–70 000 VND - 🍽️ Средний чек: ~60 000 VND',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🐚 Quán Ốc 45 (Ho Chi Minh City)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'sgn-quan-oc-45',
  'vn',
  'sgn',
  '🐚 Quán Ốc 45',
  'sgn-quan-oc-45',
  'restaurant',
  'business',
  'restaurant',
  '["seafood","snails","spicy","local"]'::jsonb,
  'Популярный ресторан моллюсков и морепродуктов в районе Tân Бинь. - Ốc xào me (улитки с тамариндом) - Ốc hấp sả (на пару с лемонграссом) - 💰 150 000–300 000 VND - 🍽️ Средний чек: ~200 000 VND',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: ☕ The Workshop Coffee (Ho Chi Minh City)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'sgn-the-workshop-coffee',
  'vn',
  'sgn',
  '☕ The Workshop Coffee',
  'sgn-the-workshop-coffee',
  'cafe',
  'business',
  'cafe',
  '["specialty-coffee","design","work-friendly","expat"]'::jsonb,
  'Спешелти-кофейня с минималистичным дизайном и акцентом на качество. - Фильтр-кофе single origin - Cold brew - 💰 60 000–100 000 VND - ☕ Средний чек: ~80 000 VND',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 👗 L’Usine (Ho Chi Minh City)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'sgn-l-usine',
  'vn',
  'sgn',
  '👗 L’Usine',
  'sgn-l-usine',
  'cafe',
  'business',
  'cafe',
  '["fashion","design","trendy","cafe"]'::jsonb,
  'Модный концепт-стор с кофейней, магазином одежды и галереей. - Кофе со льдом - Сендвичи и салаты - 💰 70 000–120 000 VND - ☕ Средний чек: ~100 000 VND',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🌃 Chill Skybar (Ho Chi Minh City)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'sgn-chill-skybar',
  'vn',
  'sgn',
  '🌃 Chill Skybar',
  'sgn-chill-skybar',
  'bar',
  'business',
  'bar',
  '["rooftop","nightlife","view","upscale"]'::jsonb,
  'Один из самых высоких rooftop-баров Сайгона с панорамой города. - Авторские коктейли - Классические миксы - 💰 200 000–400 000 VND - 🍸 Средний чек: ~300 000 VND',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🍽️ Nhà Hàng Ngon Sài Gòn (Ho Chi Minh City)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'sgn-nha-hang-ngon-sai-gon',
  'vn',
  'sgn',
  '🍽️ Nhà Hàng Ngon Sài Gòn',
  'sgn-nha-hang-ngon-sai-gon',
  'restaurant',
  'business',
  'restaurant',
  '["vietnamese","garden","family","popular"]'::jsonb,
  'Филиал ханойского ресторана с широким выбором вьетнамской кухни. - Phở - Bún chả - Cao lầu - 💰 150 000–300 000 VND - 🍽️ Средний чек: ~200 000 VND',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🍜 Quán Ăn Ngon Sài Gòn (Ho Chi Minh City)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'sgn-quan-an-ngon-sai-gon',
  'vn',
  'sgn',
  '🍜 Quán Ăn Ngon Sài Gòn',
  'sgn-quan-an-ngon-sai-gon',
  'restaurant',
  'business',
  'restaurant',
  '["street-food","vietnamese","budget","tourist-friendly"]'::jsonb,
  'Неформальный аналог Nhà Hàng Ngon с акцентом на уличные блюда. - Bánh xèo - Nem cuốn - Разнообразные закуски - 💰 100 000–200 000 VND - 🍽️ Средний чек: ~150 000 VND',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🍜 Bún Thịt Nướng Nguyễn Trung Trực (Ho Chi Minh City)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'sgn-bun-thit-nuong-nguyen-trung-truc',
  'vn',
  'sgn',
  '🍜 Bún Thịt Nướng Nguyễn Trung Trực',
  'sgn-bun-thit-nuong-nguyen-trung-truc',
  'restaurant',
  'business',
  'restaurant',
  '["bun-thit-nuong","local","budget","authentic"]'::jsonb,
  'Легендарная лавка лапши с жареным мясом — одно из культовых мест Сайгона. - Bún thịt nướng с nem nướng - Добавка с чили и лаймом - 💰 ~40 000–50 000 VND - 🍜 Средний чек: минимальный',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🍜 Phở Hòa Pasteur (Ho Chi Minh City)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'sgn-pho-hoa-pasteur',
  'vn',
  'sgn',
  '🍜 Phở Hòa Pasteur',
  'sgn-pho-hoa-pasteur',
  'restaurant',
  'business',
  'restaurant',
  '["pho","local-legend","budget","authentic"]'::jsonb,
  'Известная лавка фо с 1960-х годов, любимая местными и туристами. - Phở bò tái - Phở gà - 💰 ~50 000–70 000 VND - 🍜 Средний чек: ~60 000 VND',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
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

-- Content block for: 🏛️ Imperial City Hue
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-imperial-city-hue',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Единственный вьетнамский императорский город, сохранившийся в таком масштабе  
- 🏯 Сердце политической и духовной жизни Вьетнама XIX–начала XX века  
- 📸 Впечатляющее сочетание дворцов, ворот, рвов и садов

## Структура комплекса

- 🏛️ Ворота Ngo Mon и площадь церемоний  
- 👑 Тронный зал Thai Hoa  
- 🧱 Запретный Пурпурный город (Forbidden Purple City)  
- 🌿 Императорские сады и павильоны

## Билеты и посещение

- 💰 Входной билет: ~150 000 VND  
- 🎟️ Доступен комбинированный билет с мавзолеями  
- ⏱️ Осмотр: минимум 2–3 часа

## Практические советы

- 🌞 Лучшее время — утро или поздний день  
- 👟 Территория большая — удобная обувь обязательна  
- ☂️ Летом берите воду и головной убор

## Историческая справка

Цитадель строилась с 1804 года при императоре Зя Лонге по принципам фэншуй и с ориентацией на Запретный город Пекина. Во время войны 1968 года комплекс сильно пострадал, и восстановление продолжается до сих пор.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌸 Perfume River
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-perfume-river',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌸 Символ романтического и спокойного Хюэ  
- 🚤 Основной маршрут лодочных прогулок  
- 🌅 Лучшие закаты города

## Структура комплекса

- 🌉 Вид на мост Truong Tien  
- 🚣 Прогулку на «драконьей лодке»  
- 🎶 Вечерние концерты традиционной музыки на воде

## Билеты и посещение

- 💰 Прогулка на лодке: ~100 000–150 000 VND  
- 🆓 Пешие прогулки по набережной — бесплатно

## Практические советы

- 🌇 Особенно красиво вечером  
- 📷 Отличное место для фото без толп  
- 🧘 Подходит для спокойных прогулок

## Историческая справка

Название реки связано с ароматами трав и цветов, которые раньше смывались в воду с горных склонов. Река веками служила транспортной и ритуальной артерией императорской столицы.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛕 Thien Mu Pagoda
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-thien-mu-pagoda',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🛕 Один из духовных символов Центрального Вьетнама  
- 🌊 Красивое расположение у реки  
- 📸 Иконическая семиярусная башня

## Структура комплекса

- 🗼 Башню Phuoc Duyen  
- 🔔 Огромный бронзовый колокол  
- 🚗 Автомобиль монаха Тхить Куанг Дыка

## Билеты и посещение

- 🆓 Вход бесплатный  
- ⏱️ Осмотр: 30–60 минут

## Практические советы

- 👕 Скромная одежда обязательна  
- 🧘 Тихое и действующее религиозное место  
- 🚤 Можно совместить с лодочной прогулкой

## Историческая справка

Пагода основана в 1601 году и связана с буддийским движением протеста 1960-х годов. Отсюда происходил монах Тхить Куанг Дык, совершивший самосожжение в Сайгоне.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌉 Truong Tien Bridge
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-truong-tien-bridge',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌉 Архитектурный символ города  
- 🌈 Эффектная ночная подсветка  
- 📸 Классический вид Хюэ

## Структура комплекса

- 🌃 Мост вечером с подсветкой  
- 🚶 Пешую прогулку по мосту  
- 📷 Панораму реки и набережных

## Билеты и посещение

- 🆓 Бесплатно, круглосуточно

## Практические советы

- 🌇 Лучшее время — после заката  
- 🚴 Удобен для пеших и велопрогулок

## Историческая справка

Построен в конце XIX века французами, мост пережил тайфуны, войны и реконструкции и стал неотъемлемой частью городского пейзажа.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏞️ Ngu Binh Viewpoint
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-ngu-binh-viewpoint',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏞️ Панорамный вид на город и реку  
- 🌄 Популярное место рассветов и закатов  
- 🧘 Тихая природная атмосфера

## Структура комплекса

- 🌅 Панораму Хюэ с вершины  
- 🌲 Сосновые тропы  
- 📷 Вид на цитадель и равнины

## Билеты и посещение

- 🆓 Бесплатно  
- ⏱️ Подъём: 15–20 минут пешком

## Практические советы

- 🌞 Лучше приходить рано утром или вечером  
- 💧 Возьмите воду  
- 👟 Удобная обувь

## Историческая справка

Гора играла ключевую роль в фэншуй-планировке императорского Хюэ и вместе с Парфюмной рекой формировала «идеальный» ландшафт столицы.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🧘 Tu Hieu Pagoda
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-tu-hieu-pagoda',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🧘 Одно из самых спокойных и медитативных мест региона  
- 🌲 Расположена в сосновом лесу вдали от туристической суеты  
- 🕊️ Важный духовный центр современного буддизма

## Структура комплекса

- 🛕 Главный храмовый зал  
- 🌿 Лотосовый пруд и сосновые аллеи  
- 🪦 Кладбище евнухов династии Нгуен

## Билеты и посещение

- 🆓 Вход бесплатный  
- ⏱️ Осмотр: 45–90 минут

## Практические советы

- 👕 Скромная одежда обязательна  
- 🤫 Соблюдайте тишину — действующий монастырь  
- 🚕 Удобнее добираться на байке или такси

## Историческая справка

Пагода возникла в XIX веке как келья монаха, ухаживавшего за матерью. Позднее стала значимым центром буддийского образования и практики; здесь провёл последние годы жизни Тхить Нят Хань.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏯 Nam Giao Altar
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-nam-giao-altar',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏯 Уникальный государственный культовый объект  
- 🧭 Редкий пример императорской ритуальной архитектуры  
- 🌳 Просторный комплекс в сосновом лесу

## Структура комплекса

- 🟦 Трёхъярусный алтарь Nam Giao  
- 🌲 Императорский лес вокруг комплекса  
- 🏛️ Остатки ритуальных павильонов

## Билеты и посещение

- 💰 Входной билет: ~50 000 VND  
- ⏱️ Осмотр: 45–60 минут

## Практические советы

- 🌞 Лучше посещать утром или ближе к вечеру  
- 👟 Территория большая — удобная обувь  
- 📷 Хорошо подходит для спокойных прогулок

## Историческая справка

Алтарь построен в 1806 году и использовался для важнейших императорских церемоний вплоть до 1945 года. Сегодня входит в комплекс памятников Хюэ под охраной ЮНЕСКО.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌄 Vong Canh Hill
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-vong-canh-hill',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌄 Одно из лучших мест для заката в Хюэ  
- 🌲 Тихая природная атмосфера  
- 📸 Отличная точка для фотосъёмки

## Структура комплекса

- 🌅 Вид на излучину реки Хыонг  
- 🌳 Сосновые склоны и тропы  
- 🪦 Гробницы императоров в окрестностях

## Билеты и посещение

- 🆓 Вход свободный  
- ⏱️ Осмотр: 30–45 минут

## Практические советы

- 🌞 Лучшее время — рассвет или закат  
- 🧺 Подходит для пикника  
- 🚕 Удобнее ехать на байке

## Историческая справка

Холм служил излюбленным местом отдыха императоров династии Нгуен, а в XX веке использовался как наблюдательный пункт.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌅 Tam Giang Lagoon
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-tam-giang-lagoon',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌅 Одни из самых красивых закатов региона  
- 🎣 Аутентичная жизнь рыбацких деревень  
- 📸 Широкие открытые пейзажи

## Структура комплекса

- 🚤 Лодочные прогулки по лагуне  
- 🛶 Рыбацкие ловушки и дома на воде  
- 🌄 Закат над водой

## Билеты и посещение

- 💰 Лодочная прогулка: ~100 000–200 000 VND  
- 🆓 Свободный доступ к берегам

## Практические советы

- 🌞 Лучше приезжать ближе к вечеру  
- 📷 Отлично для фототуров  
- 🚗 Удобнее добираться на машине или байке

## Историческая справка

Лагуна образована в месте слияния рек Хыонг, Бо и О-Лау и на протяжении веков была важным источником рыбы и соли для региона.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌳 Bach Ma National Park
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-bach-ma-national-park',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌳 Прохлада и зелень в жарком климате  
- 💦 Впечатляющие водопады и леса  
- 🥾 Отличные маршруты для треккинга

## Структура комплекса

- 🌄 Смотровую площадку Hai Vong Dai  
- 💦 Водопад Do Quyen  
- 🏞️ Озёра Ngu Ho

## Билеты и посещение

- 💰 Входной билет: ~60 000 VND  
- ⏱️ Осмотр: полдня или полный день

## Практические советы

- 🌦️ Погода меняется быстро — берите куртку  
- 🥾 Обувь для треккинга обязательна  
- 🚙 Часть маршрутов доступна только с транспортом

## Историческая справка

В начале XX века французские колонисты использовали плато Бах Ма как горный курорт. Сегодня это одна из самых биологически разнообразных зон Центрального Вьетнама.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ☕ The Lab Coffee
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-the-lab-coffee',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- ☕ Одна из лучших specialty-кофеен города  
- 💻 Удобно для работы и встреч  
- 🌱 Фокус на локальные зёрна Центрального Вьетнама

## Коммуникация & сервис

- 🌐 Английский — базовый  
- 📶 Быстрый Wi-Fi, розетки у стен  
- 🪑 Тихие столики для работы

## Локальная ценность

The Lab Coffee представляет «новую волну» кофейной культуры Хюэ — без туристического шума, с уважением к вкусу и ремеслу.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🧂 Cà Phê Muối 142
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-ca-phe-muoi-142',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🧂 Уникальный напиток, придуманный именно здесь  
- 🏠 Аутентичная атмосфера без туристического глянца  
- 📍 Историческое место гастрокультуры города

## Коммуникация & сервис

- 🗣 Персонал говорит только по-вьетнамски  
- 💵 Только наличные  
- 🪑 Простые пластиковые столики

## Локальная ценность

Salt Coffee — пример того, как локальная идея из Хюэ стала национальным трендом, сохранив оригинал именно здесь.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍽️ Quán Hanh
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-quan-hanh',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍽️ Лучший способ попробовать кухню Хюэ за один приём  
- 👨‍👩‍👧 Любим местными и туристами  
- ⚡ Быстрое обслуживание и живой ритм

## Коммуникация & сервис

- 🌐 Базовый английский, меню с фото  
- 💵 В основном наличные  
- 🪑 Простая, но удобная посадка

## Локальная ценность

Quán Hanh демократизирует императорскую кухню Хюэ, делая её доступной и понятной для всех.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍜 Madam Thu Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-madam-thu-restaurant',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍜 Отличный баланс аутентичности и комфорта  
- 🌟 Подходит для первого знакомства с кухней Хюэ  
- 🪔 Приятный интерьер в традиционном стиле

## Коммуникация & сервис

- 🌐 Хороший английский  
- 💳 Принимают карты (иногда комиссия)  
- ❄️ Кондиционированные залы

## Локальная ценность

Madam Thu показывает, как традиционная кухня Хюэ адаптируется под путешественников, не теряя характера.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🥬 Lien Hoa Vegetarian
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-lien-hoa-vegetarian',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🥬 Легендарное место буддийской кухни Хюэ  
- 🌿 Спокойная атмосфера садового дома  
- 🌱 Полностью вегетарианское меню

## Коммуникация & сервис

- 🗣 В основном вьетнамский  
- 💵 Только наличные  
- 🪑 Залы и столики в саду

## Локальная ценность

Lien Hoa отражает буддийскую философию Хюэ и показывает, что местная кухня может быть глубокой и разнообразной без мяса.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍺 Imperial Craft Bia Brewpub
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-imperial-craft-bia-brewpub',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍺 Единственный brewpub в городе с собственным производством  
- 🌍 Интернациональная публика и дружелюбная атмосфера  
- 🍕 Хорошая западная кухня к пиву

## Коммуникация & сервис

- 🌐 Свободный английский  
- 📶 Быстрый Wi-Fi, розетки у стен  
- 🅿️ Небольшая парковка для байков

## Локальная ценность

Imperial Craft Bia показывает современное лицо Хюэ — город традиций, который открывается новым форматам и культуре крафта.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🎉 Brown Eyes Bar
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-brown-eyes-bar',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🎉 Легенда ночной жизни Хюэ  
- 🌍 Место знакомств путешественников  
- 🕺 Танцы, игры и свободная атмосфера

## Коммуникация & сервис

- 🌐 Английский без проблем  
- 📶 Wi-Fi есть, но вторичен  
- 🔊 Громкая музыка, активный движ

## Локальная ценность

Brown Eyes Bar — редкий пример того, как тихий исторический город по ночам превращается в точку международной тусовки.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛍️ Dong Ba Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-dong-ba-market',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🛍️ Самый аутентичный рынок города  
- 🍜 Лучшее место попробовать локальный стрит-фуд  
- 👀 Наблюдение за повседневной жизнью Хюэ

## Коммуникация & сервис

- 🗣 В основном вьетнамский  
- 💵 Только наличные  
- 🎒 Будьте внимательны к вещам

## Локальная ценность

Dong Ba — не туристический аттракцион, а живое сердце торговли Хюэ, работающее без перерыва уже более века.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌙 Hue Night Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hue-hue-night-market',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌙 Атмосферное место для вечерней прогулки  
- 🍢 Уличная еда и недорогие сувениры  
- 🎶 Живая музыка и городская активность

## Коммуникация & сервис

- 🌐 Базовый английский  
- 💵 Наличные  
- 🚶 Удобно для неспешных прогулок

## Локальная ценность

Ночной рынок показывает Хюэ как живой современный город, где культурное наследие соседствует с повседневной жизнью.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏮 Hoi An Ancient Town
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-hoi-an-ancient-town',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏮 Один из самых атмосферных городов Юго-Восточной Азии  
- 🌍 Уникальное сочетание вьетнамской, китайской и японской архитектуры  
- 🌙 Вечерняя иллюминация фонарей — визитная карточка Хойана

## Структура комплекса

- 🏘️ Старые торговые дома и узкие улочки  
- 🏮 Фонарные улицы у реки Thu Bồn  
- 🎨 Мастерские и галереи ремёсел

## Билеты и посещение

- 💰 Билет в старый город: ~120 000 VND (включает посещение 5 объектов)  
- 🕒 Днём свободный проход по улицам, билеты нужны для музеев и домов

## Практические советы

- 🌞 Днём жарко — лучше гулять утром и вечером  
- 👟 Удобная обувь для брусчатки  
- 📷 Лучшее время для фото — после заката

## Историческая справка

Хойан был крупнейшим портом Центрального Вьетнама, связывавшим Китай, Японию и Европу. После заиливания реки город сохранился практически без перестроек.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌉 Japanese Covered Bridge
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-japanese-covered-bridge',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌉 Самый узнаваемый объект Хойана  
- 🇯🇵 Редкий пример японского влияния во Вьетнаме  
- 📸 Отличная точка для фото

## Структура комплекса

- 🏯 Храм на мосту  
- 🐒 Каменные статуи обезьяны и собаки  
- 🏘️ Вид на старый квартал

## Билеты и посещение

- 🎟️ Входит в билет старого города  
- 🕒 Доступен круглосуточно (осмотр внутри — днём)

## Практические советы

- 🌅 Лучше приходить рано утром  
- 🌙 Вечером многолюдно  
- 📷 Снимайте с боковых ракурсов

## Историческая справка

Мост был построен для защиты города от злых духов и служил местом молитвы для японских торговцев.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏯 Assembly Halls of Hoi An
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-assembly-halls-of-hoi-an',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏯 Богатый декор и символика  
- 🇨🇳 Следы китайской диаспоры  
- 📷 Красочные интерьеры

## Структура комплекса

- 🐉 Ассамблею Фуцзянь (Phuc Kien)  
- 🏮 Ассамблею Кантон  
- 🌺 Внутренние дворы и алтари

## Билеты и посещение

- 🎟️ Вход включён в билет старого города  
- ⏱️ Осмотр: 20–40 минут

## Практические советы

- 👕 Скромная одежда  
- 📷 Обратите внимание на детали декора  
- 🌞 Хорошо заходить днём

## Историческая справка

Ассамблеи служили религиозными и социальными центрами китайских общин, игравших ключевую роль в торговле Хойана.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏠 Old Merchant Houses
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-old-merchant-houses',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏠 Возможность увидеть быт старого Хойана  
- 📜 Истории торговых семей  
- 🌊 Метки прошлых наводнений

## Структура комплекса

- 🏡 Дом Тан Ки (Tan Ky)  
- 🏡 Дом Дык Ан (Duc An)  
- 🛋️ Мебель и алтари

## Билеты и посещение

- 🎟️ Вход включён в билет старого города  
- ⏱️ Осмотр: 15–30 минут

## Практические советы

- 🤫 В домах тихо — уважайте жильцов  
- 📷 Не используйте вспышку  
- 🌞 Лучше заходить вне пика

## Историческая справка

Дома строились с учётом наводнений и сочетали вьетнамские, китайские и японские элементы архитектуры.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍜 Hoi An Central Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-hoi-an-central-market',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🍜 Лучшее место для знакомства с местной кухней  
- 🛍️ Атмосфера настоящего рынка  
- 📸 Яркие сцены повседневности

## Структура комплекса

- 🍽️ Зоны стрит-фуда  
- 🧺 Лавки с пряностями и фруктами  
- 🐟 Рыбные ряды у реки

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Лучше утром или до обеда

## Практические советы

- 💵 Наличные и мелкие купюры  
- 🎒 Следите за вещами  
- 🍴 Выбирайте точки с очередями

## Историческая справка

Рынок всегда был экономическим ядром Хойана, обслуживая порт и торговые кварталы.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏮 Hoi An Night Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-hoi-an-night-market',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏮 Самое атмосферное место Хойана вечером  
- 🌙 Фонари, уличная еда и прогулки у реки  
- 📸 Отличная локация для ночных фото

## Структура комплекса

- 🏮 Ряды фонарей и сувениров  
- 🍢 Стрит-фуд с локальными закусками  
- 🚶 Прогулку по мостам и набережной

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Работает ежедневно с ~17:00 до позднего вечера

## Практические советы

- 💵 Наличные для покупок  
- 🌙 Лучше приходить после заката  
- 🎒 Следите за вещами в толпе

## Историческая справка

Ночной рынок возник как продолжение торговых традиций Хойана и стал современной формой вечерней городской жизни.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌱 Tra Que Vegetable Village
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-tra-que-vegetable-village',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌱 Знакомство с сельской жизнью Вьетнама  
- 🚲 Популярный маршрут для велопрогулок  
- 👨‍🌾 Интерактивные фермерские активности

## Структура комплекса

- 🌿 Огородные поля и грядки  
- 🧑‍🌾 Мастер-классы по посадке  
- 🍽️ Домашние обеды у фермеров

## Билеты и посещение

- 💰 Экскурсии: ~30 000–50 000 VND  
- 🚲 Часто посещают в составе велотуров

## Практические советы

- 🌞 Лучше приезжать утром  
- 👟 Закрытая обувь  
- 🚲 Отлично комбинируется со старым городом

## Историческая справка

Тра Куэ снабжала Хойан свежими травами на протяжении веков и сохранила традиционные методы земледелия.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏺 Thanh Ha Pottery Village
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-thanh-ha-pottery-village',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏺 Аутентичные ремесленные традиции  
- 👐 Возможность поработать с глиной  
- 📷 Интересные фото и мастерские

## Структура комплекса

- 🏺 Гончарные мастерские  
- 🎨 Музей керамики  
- 🛍️ Магазины изделий ручной работы

## Билеты и посещение

- 💰 Вход: ~35 000 VND  
- ⏱️ Осмотр: 1–1,5 часа

## Практические советы

- 🧑‍🎨 Подходит для семей  
- 🎁 Отличное место для сувениров  
- 🚲 Удобно добираться на велосипеде

## Историческая справка

Деревня возникла для снабжения портового Хойана керамикой и строительными материалами.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🐠 Cham Islands
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-cham-islands',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🐠 Лучшее место для снорклинга рядом с Хойаном  
- 🌊 Чистая вода и кораллы  
- 🏝️ День на природе вдали от города

## Структура комплекса

- 🐟 Коралловые рифы  
- 🚤 Рыбацкие деревни  
- 🏖️ Пляжи островов

## Билеты и посещение

- 💰 Тур на день: ~500 000–800 000 VND  
- ⏱️ Экскурсия: полный день

## Практические советы

- 🌊 Лучший сезон: март–сентябрь  
- 🧴 Берите солнцезащиту  
- 🚤 Возможна качка

## Историческая справка

Острова были важной остановкой морских путей и сегодня охраняются как биосферный резерват.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏖️ An Bang Beach
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-an-bang-beach',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏖️ Лучший пляж рядом со старым городом  
- 🌅 Красивые закаты  
- 🍹 Пляжные бары и кафе

## Структура комплекса

- 🌊 Береговую линию  
- 🍹 Кафе у воды  
- 🌇 Закат над морем

## Билеты и посещение

- 🆓 Бесплатно  
- 🚲 Легко добраться на байке или велосипеде

## Практические советы

- 🌞 Лучше приезжать после обеда  
- 🏄 Подходит для купания и отдыха  
- 🧴 Солнцезащита обязательна

## Историческая справка

Ан Бан стал альтернативой более туристическому Куа Дай и сохранил более спокойный пляжный формат.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🥖 Bánh Mì Phượng
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-banh-mi-phuong',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🥖 Один из самых известных баньми во Вьетнаме  
- 🌍 Международная гастрономическая репутация  
- ⚡ Быстро, вкусно и недорого

## Коммуникация & сервис

- 🌐 Базовый английский  
- 🥡 Формат takeaway  
- ⏱️ Очереди в часы пик

## Локальная ценность

Bánh Mì Phượng превратил уличный сэндвич в гастрономический символ Хойана и обязательный пункт маршрута туристов.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍗 Cơm Gà Bà Buội
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-com-ga-ba-buoi',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍗 Легендарный куриный рис по-хойански  
- 👵 Семейные рецепты нескольких поколений  
- 🏠 Аутентичная атмосфера

## Коммуникация & сервис

- 🗣 В основном вьетнамский  
- 💵 Наличные  
- 🪑 Простая посадка

## Локальная ценность

Cơm Gà Bà Buội считается эталоном блюда, ради которого многие приезжают в Хойан.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 👑 Madam Khanh – The Banh Mi Queen
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-madam-khanh-the-banh-mi-queen',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 👑 Вторая легенда баньми Хойана  
- 😊 Персональный подход  
- 🌮 Стабильное качество

## Коммуникация & сервис

- 🌐 Английский без проблем  
- 🥡 Формат takeaway  
- 😊 Дружелюбный персонал

## Локальная ценность

Madam Khanh показывает человеческое лицо хойанской уличной кухни — здесь важны вкус и улыбка.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍜 Morning Glory Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-morning-glory-restaurant',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍜 Отличная витрина кухни Центрального Вьетнама  
- 🏮 Красивый интерьер в старом доме  
- 👨‍👩‍👧 Подходит для компаний

## Коммуникация & сервис

- 🌐 Хороший английский  
- 💳 Принимают карты  
- 🪑 Комфортная посадка

## Локальная ценность

Morning Glory сделал локальные блюда доступными и понятными для международной аудитории.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🥙 Bà Lê Well
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-ba-le-well',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🥙 Интерактивный формат еды  
- 🎉 Живая и дружелюбная атмосфера  
- 🍽️ Отлично для компаний

## Коммуникация & сервис

- 🌐 Английский  
- 🪑 Общие столы  
- 🎊 Шумно и весело

## Локальная ценность

Bà Lê Well превращает ужин в социальный опыт, где еда объединяет незнакомых людей.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍵 Reaching Out Tea House
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-reaching-out-tea-house',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍵 Редкий формат осознанного и тихого отдыха  
- 🤍 Социальное предприятие с сильной миссией  
- 🏮 Уютный интерьер старого дома

## Коммуникация & сервис

- ✍️ Общение через записки  
- 🤫 Полная тишина  
- 🪑 Камерная посадка

## Локальная ценность

Reaching Out Tea House показывает, как бизнес может быть одновременно эстетичным, устойчивым и социально значимым.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 📸 Faifo Coffee
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-faifo-coffee',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 📸 Одна из лучших фототочек Хойана  
- ☕ Приятный кофе и десерты  
- 🌇 Панорама старого города

## Коммуникация & сервис

- 🌐 Базовый английский  
- 📷 Ограниченное время на крыше в пиковые часы  
- 🪑 Небольшие столики

## Локальная ценность

Faifo Coffee стал визуальным символом Хойана в соцсетях и точкой притяжения для фотографов.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌿 Mót Hội An
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-mot-hoi-an',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌿 Уникальный напиток, который есть только здесь  
- 🥤 Быстро и освежающе  
- 📷 Атмосферная подача

## Коммуникация & сервис

- 🗣 Минимальный английский  
- 🥡 Только на вынос  
- ⏱️ Быстрое обслуживание

## Локальная ценность

Mót Hội An — пример того, как простой локальный рецепт стал городской легендой.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 👗 Yaly Couture
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-yaly-couture',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 👗 Высокое качество пошива  
- ⏱️ Быстрое выполнение заказов  
- 🌍 Международная репутация

## Коммуникация & сервис

- 🌐 Свободный английский  
- 🧵 Примерки и корректировки  
- 🛍️ Доставка в отель

## Локальная ценность

Yaly Couture сформировал репутацию Хойана как мировой столицы быстрого индивидуального пошива.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏖️ Soul Kitchen
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'hoi-soul-kitchen',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🏖️ Отличное место для отдыха у моря  
- 🎶 Живая музыка и вечеринки  
- 🌍 Популярен у экспатов

## Коммуникация & сервис

- 🌐 Английский без проблем  
- 🎶 Музыкальные вечера  
- 🪑 Посадка у пляжа

## Локальная ценность

Soul Kitchen отражает пляжную и интернациональную сторону Хойана — свободную и открытую миру.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏖️ My Khe Beach
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-my-khe-beach',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏖️ Один из лучших городских пляжей Азии  
- 🌅 Красивые рассветы над морем  
- 🏙️ Сочетание пляжа и городской жизни

## Структура комплекса

- 🌊 Прогулку вдоль береговой линии  
- 🏄 Зоны для купания и серфинга  
- 🌴 Пляжные кафе и отели

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Доступен круглосуточно

## Практические советы

- 🌞 Лучшее время — раннее утро  
- 🧴 Солнцезащита обязательна  
- 🌊 Следите за флагами безопасности

## Историческая справка

My Khe получил мировую известность после включения в рейтинги лучших пляжей мира и стал символом курортного Дананга.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌳 Son Tra Peninsula
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-son-tra-peninsula',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌳 Заповедная природа в черте города  
- 🐒 Среда обитания красноногих дуков  
- 📸 Лучшие панорамы Дананга

## Структура комплекса

- 🌄 Смотровые площадки над городом  
- 🐒 Наблюдение за дикой природой  
- 🛵 Мотопоездку по серпантину

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Доступ днём

## Практические советы

- 🛵 Удобнее на байке  
- 🌦️ Погода меняется быстро  
- 📷 Возьмите зум-камеру

## Историческая справка

Полуостров долгое время был военной зоной и сохранил нетронутые леса, став природным щитом города.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛕 Linh Ứng Pagoda
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-linh-ung-pagoda',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🛕 Самая высокая статуя Будды во Вьетнаме  
- 🌊 Вид на море и город  
- 📸 Иконическая достопримечательность

## Структура комплекса

- 🗿 Статую Lady Buddha  
- 🌺 Территорию пагоды  
- 🌄 Видовые точки на побережье

## Билеты и посещение

- 🆓 Бесплатно  
- ⏱️ Осмотр: 30–60 минут

## Практические советы

- 👕 Соблюдайте дресс-код  
- 🌞 Лучше посещать утром  
- 📷 Отлично для панорам

## Историческая справка

Пагода была построена в XXI веке как духовный символ защиты Дананга и его жителей.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🗻 Marble Mountains
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-marble-mountains',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🗻 Уникальный природно-религиозный комплекс  
- 🛕 Пещеры и древние храмы  
- 📸 Впечатляющие виды с высоты

## Структура комплекса

- 🕳️ Пещеру Am Phu  
- 🛕 Пагоды в скалах  
- 🌄 Панорамы побережья

## Билеты и посещение

- 💰 Вход: ~40 000 VND  
- 🚠 Лифт оплачивается отдельно

## Практические советы

- 👟 Удобная обувь  
- 🌞 Жарко днём — берите воду  
- 📷 Хороший объектив

## Историческая справка

Горы почитались с древних времён как священное место и использовались чамами и буддистами.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🐉 Dragon Bridge
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-dragon-bridge',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🐉 Икона современной архитектуры  
- 🔥 Огненно-водное шоу по выходным  
- 🌃 Отличная ночная атмосфера

## Структура комплекса

- 🔥 Шоу огня и воды (выходные)  
- 🌉 Прогулку по мосту  
- 📷 Ночные фото

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Шоу: сб–вс ~21:00

## Практические советы

- ⏰ Приходите заранее  
- 📷 Используйте штатив  
- 🌃 Лучшее время — вечер

## Историческая справка

Мост был открыт в 2013 году и стал символом экономического роста и модернизации Дананга.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏖️ Non Nuoc Beach
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-non-nuoc-beach',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌊 Менее людный, чем My Khe  
- 🏄 Подходит для серфинга и длинных прогулок  
- 🌅 Красивые рассветы и закаты

## Структура комплекса

- 🏖️ Широкую береговую линию  
- 🏄 Серф-зоны в сезон волн  
- 🌴 Территории курортов у пляжа

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Доступен круглосуточно

## Практические советы

- 🌞 Меньше кафе — берите воду  
- 🏄 Лучшие волны осенью и зимой  
- 🚲 Удобно для утренних пробежек

## Историческая справка

Пляж долгое время оставался в тени центра Дананга и развивался как курортная зона высокого уровня.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌉 Golden Bridge
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-golden-bridge',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌉 Одна из самых узнаваемых достопримечательностей Вьетнама  
- 📸 Идеальное место для фото  
- 🌄 Захватывающие виды на горы

## Структура комплекса

- ✋ Сам мост с «руками»  
- 🌄 Панорамы гор Ба На  
- 🚠 Канатную дорогу

## Билеты и посещение

- 🎟️ Входит в билет Ba Na Hills (~900 000 VND)  
- ⏱️ Осмотр: 30–60 минут

## Практические советы

- 🌥️ Погода в горах меняется быстро  
- 📷 Лучшее время — утро  
- 🧥 Возьмите лёгкую куртку

## Историческая справка

Мост открыт в 2018 году и мгновенно стал мировой туристической иконой.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🎢 Sun World Ba Na Hills
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-sun-world-ba-na-hills',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🚠 Одна из самых длинных канатных дорог в мире  
- 🎢 Развлечения для всей семьи  
- 🌬️ Прохлада в горах

## Структура комплекса

- 🚠 Канатную дорогу  
- 🏰 Французскую деревню  
- 🎡 Fantasy Park

## Билеты и посещение

- 💰 Билет: ~900 000 VND  
- ⏱️ Полный день

## Практические советы

- 🌦️ Следите за погодой  
- 🎒 Берите тёплую одежду  
- 🎟️ Покупайте билеты заранее

## Историческая справка

Курорт был создан на месте французской горной станции начала XX века.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌉 Han River Bridge
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-han-river-bridge',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌉 Инженерная достопримечательность  
- 🌃 Красивые виды ночью  
- 🚦 Исторический символ города

## Структура комплекса

- 🌉 Сам мост  
- 🌃 Набережные реки Хан  
- 🚧 Процесс разведения моста

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Разводят поздно ночью (редко)

## Практические советы

- 🌙 Лучше осматривать вечером  
- 📷 Отличен для ночных фото

## Историческая справка

Мост открыт в 2000 году и стал первым крупным инфраструктурным проектом современного Дананга.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🗿 Cham Sculpture Museum
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-cham-sculpture-museum',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🗿 Уникальная коллекция чамского искусства  
- 📚 Глубокий исторический контекст региона  
- 🧘 Спокойная музейная атмосфера

## Структура комплекса

- 🗿 Каменные статуи и барельефы  
- 🏛️ Галереи разных эпох Чампы  
- 🌿 Внутренний двор музея

## Билеты и посещение

- 💰 Вход: ~60 000 VND  
- ⏱️ Осмотр: 1–1,5 часа

## Практические советы

- 📷 Съёмка без вспышки  
- 🌞 Отличен для дневного визита

## Историческая справка

Музей основан в 1915 году французами и хранит наследие цивилизации, существовавшей в Центральном Вьетнаме более тысячи лет.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍲 Madame Lân
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-madame-lan',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍲 Широкая витрина кухни Центрального Вьетнама  
- 👨‍👩‍👧 Подходит для компаний и семей  
- 🌿 Просторный интерьер и зелёная территория

## Коммуникация & сервис

- 🌐 Английский на уровне меню  
- 💳 Принимают карты  
- 🪑 Просторные залы

## Локальная ценность

Madame Lân делает традиционную кухню Дананга доступной и понятной для гостей без потери аутентичности.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ⭐ La Maison 1888
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-la-maison-1888',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- ⭐ Один из самых известных fine-dining ресторанов Вьетнама  
- 🌊 Захватывающий вид на море  
- 🍷 Высокий уровень гастрономии и сервиса

## Коммуникация & сервис

- 🌐 Свободный английский  
- 👔 Дресс-код smart casual / formal  
- 🍾 Бронирование обязательно

## Локальная ценность

La Maison 1888 демонстрирует гастрономический потенциал Дананга на мировом уровне.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🦞 Bé Mặn Seafood
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-be-man-seafood',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🦞 Свежайшие морепродукты  
- 🔊 Настоящая локальная атмосфера  
- 🍽️ Большие порции

## Коммуникация & сервис

- 🗣 В основном вьетнамский  
- 💵 Наличные предпочтительны  
- 🪑 Простые столы

## Локальная ценность

Bé Mặn — эталон «как едят местные», без туристического глянца и с максимальной свежестью продуктов.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ☕ 43 Factory Coffee Roaster
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-43-factory-coffee-roaster',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- ☕ Лучшее место для specialty coffee в Дананге  
- 🏗️ Архитектурный и дизайнерский объект  
- 💻 Удобно для работы

## Коммуникация & сервис

- 🌐 Английский  
- 📶 Быстрый Wi-Fi  
- 🔌 Розетки

## Локальная ценность

43 Factory сформировал репутацию Дананга как города с развитой кофейной культурой.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🧱 Cộng Cà Phê
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-cong-ca-phe',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🧱 Атмосфера вьетнамского ретро  
- 🥥 Фирменный кокосовый кофе  
- 🏙️ Удобные локации

## Коммуникация & сервис

- 🌐 Английский на базовом уровне  
- 📶 Wi-Fi  
- 🪑 Неформальная посадка

## Локальная ценность

Cộng Cà Phê популяризирует вьетнамский кофейный стиль и культуру «сидеть и наблюдать».
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌃 Sky36
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-sky36',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌃 Лучший панорамный вид на Дананг  
- 🎧 DJ-сеты и вечеринки  
- 🍸 Коктейльная карта и атмосфера большого города

## Коммуникация & сервис

- 🌐 Свободный английский  
- 👔 Дресс-код вечером  
- 📷 Отлично подходит для ночных фото

## Локальная ценность

Sky36 символизирует современный и космополитичный Дананг — город небоскрёбов, ночной жизни и динамики.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌊 Waterfront Danang
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-waterfront-danang',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌊 Приятное расположение у воды  
- 🍺 Западная и азиатская кухня  
- 🎶 Живая музыка и трансляции спорта

## Коммуникация & сервис

- 🌐 Английский без проблем  
- 📶 Wi-Fi  
- 🪑 Терраса с видом на реку

## Локальная ценность

Waterfront Danang — центр экспатской социальной жизни и неформального общения.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛍️ Han Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-han-market',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🛍️ Удобное место для покупок  
- 🍜 Локальные продукты и специи  
- 🎁 Сувениры и подарки

## Коммуникация & сервис

- 🗣 Базовый английский  
- 💵 Наличные  
- 🛍️ Компактный формат

## Локальная ценность

Han Market — туристически удобная точка знакомства с гастрономией Дананга.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍢 Con Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-con-market',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍢 Лучший стрит-фуд Дананга  
- 👀 Повседневная жизнь местных  
- 💸 Очень демократичные цены

## Коммуникация & сервис

- 🗣 Только вьетнамский  
- 💵 Наличные  
- 🎒 Следите за вещами

## Локальная ценность

Con Market — эталонный рынок «для своих», где можно попробовать настоящую кухню Дананга.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌙 Son Tra Night Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dad-son-tra-night-market',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌙 Удобно совместить с посещением Dragon Bridge  
- 🍢 Уличная еда и прогулки  
- 🎶 Вечерний вайб

## Коммуникация & сервис

- 🌐 Базовый английский  
- 💵 Наличные  
- 🚶 Удобно для прогулок

## Локальная ценность

Son Tra Night Market стал вечерним продолжением туристической жизни Дананга.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌸 Hồ Xuân Hương
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-ho-xuan-huong',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌸 Символ города и его спокойного ритма  
- 🚶 Удобная набережная для прогулок  
- 📸 Красивые виды на город и закаты

## Структура комплекса

- 🚶 Кольцевую прогулочную дорожку вокруг озера  
- 🌺 Цветочные клумбы и парковые зоны  
- ☕ Кафе с видом на воду

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Доступно в любое время суток

## Практические советы

- 🌞 Лучшее время — утро или ближе к вечеру  
- 🧥 Вечером прохладно — возьмите куртку  
- 📷 Хорошо подходит для неспешной фотосъёмки

## Историческая справка

Озеро было создано во французский колониальный период и с тех пор стало центральной точкой общественной жизни Далата.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌷 Dalat Flower Garden
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-dalat-flower-garden',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌷 Цветочная визитная карточка Далата  
- 🌼 Большие ухоженные территории  
- 👨‍👩‍👧 Подходит для семей

## Структура комплекса

- 🌸 Тематические цветочные экспозиции  
- ⛲ Фонтаны и фотозоны  
- 🌿 Оранжереи и павильоны

## Билеты и посещение

- 💰 Вход: ~60 000 VND (взрослые)  
- 🕒 Время работы: 7:00–18:00 (пт–сб до 22:00)

## Практические советы

- 📷 Лучшее время для фото — утро  
- 🌼 Вечером включается подсветка  
- 🎟️ В выходные бывает многолюдно

## Историческая справка

Парк был создан как часть курортной концепции французского Далата и неоднократно реконструировался.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 💕 Valley of Love
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-valley-of-love',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 💕 Самое известное романтическое место Далата  
- 🚣 Развлечения и прогулки на целый день  
- 📸 Озёра, холмы и панорамы

## Структура комплекса

- 🚣 Озеро с катамаранами  
- 🌲 Холмы и смотровые площадки  
- 🎡 Аттракционы и парковые зоны

## Билеты и посещение

- 💰 Вход: ~250 000 VND  
- 🕒 Время работы: 7:00–17:00

## Практические советы

- ⏱️ Закладывайте минимум полдня  
- 👟 Удобная обувь  
- 🌞 В солнечную погоду берите воду

## Историческая справка

Парк был основан в 1930-х годах французами как Vallée d’Amour и стал знаковым курортным местом.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 💦 Datanla Waterfall
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-datanla-waterfall',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 💦 Красивый водопад рядом с городом  
- 🎢 Аттракционы и активный отдых  
- 🌲 Природа и лес

## Структура комплекса

- 💦 Основной каскад водопада  
- 🎢 Альпийский тобогган  
- 🧗 Каньонинг и верёвочные маршруты

## Билеты и посещение

- 💰 Вход: ~50 000 VND  
- 🎟️ Аттракционы оплачиваются отдельно

## Практические советы

- 👟 Обувь с хорошим сцеплением  
- 🌧️ В сезон дождей водопад полноводнее  
- 🎢 Тобогган лучше бронировать заранее

## Историческая справка

Название водопада связано с легендами народов Центрального нагорья и издавна привлекало путешественников.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌿 Cam Ly Waterfall
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-cam-ly-waterfall',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌿 Лёгкая природная прогулка  
- 📍 Удобно совместить с осмотром города  
- 📸 Красив в сезон дождей

## Структура комплекса

- 💦 Каскад водопада  
- 🌲 Сосновый бор вокруг  
- 🐎 Прогулки на лошадях (по сезону)

## Билеты и посещение

- 💰 Вход: ~40 000 VND  
- 🕒 Время работы: 7:00–17:00

## Практические советы

- 🌧️ Лучшее время — после дождей  
- 📷 Подходит для короткой остановки  
- 👟 Удобная обувь

## Историческая справка

Водопад был одним из первых мест, куда водили туристов во французском Далате.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌲 Tuyền Lâm Lake
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-tuyen-lam-lake',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌲 Тихая природная атмосфера вдали от центра  
- 🌅 Красивые рассветы и отражения в воде  
- 🚣 Подходит для прогулок и отдыха на природе

## Структура комплекса

- 🚣 Прогулку на лодке по озеру  
- 🌲 Сосновые берега и смотровые точки  
- 📷 Панорамы с возвышенностей

## Билеты и посещение

- 🆓 Свободный доступ к берегам  
- 💰 Лодочные прогулки — по желанию

## Практические советы

- 🌞 Лучше приезжать утром  
- 🚗 Удобнее на байке или такси  
- 🧥 Вечером прохладно

## Историческая справка

Озеро сформировалось после строительства плотины в XX веке и стало важной рекреационной зоной Далата.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🧘 Trúc Lâm Zen Monastery
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-truc-lam-zen-monastery',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🧘 Спокойствие и медитативная атмосфера  
- 🌿 Прекрасное расположение над озером  
- 📸 Панорамные виды

## Структура комплекса

- 🛕 Главный храмовый комплекс  
- 🌺 Сады и дорожки монастыря  
- 🌄 Вид на озеро Туен Лам

## Билеты и посещение

- 🆓 Вход бесплатный  
- ⏱️ Осмотр: 45–60 минут

## Практические советы

- 👕 Скромная одежда обязательна  
- 🤫 Соблюдайте тишину  
- 🚠 Можно спуститься к озеру по канатной дороге

## Историческая справка

Монастырь основан в 1994 году и является центром школы дзен Трук Лам, возрождённой во Вьетнаме.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌀 Crazy House
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-crazy-house',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌀 Самая необычная архитектура Далата  
- 🎨 Похожа на сказочный лабиринт  
- 📸 Идеальное место для фото

## Структура комплекса

- 🏠 Лабиринты и лестницы  
- 🐉 Скульптуры и переходы  
- 🌳 Панорамные террасы

## Билеты и посещение

- 💰 Вход: ~60 000 VND  
- ⏱️ Осмотр: 30–60 минут

## Практические советы

- 👟 Обувь с хорошим сцеплением  
- 📷 Будьте осторожны на узких лестницах  
- ⏰ Приходите пораньше — меньше людей

## Историческая справка

Проект создан архитектором Данг Вьет Нга и вдохновлён природными формами и сказками.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🐉 Linh Phước Pagoda
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-linh-phuoc-pagoda',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🐉 Уникальная мозаичная архитектура  
- 🛕 Дракон из бутылочного стекла  
- 📸 Очень фотогеничное место

## Структура комплекса

- 🐉 Мозаичного дракона  
- 🛕 Многоярусные залы пагоды  
- 🧱 Детали из фарфора

## Билеты и посещение

- 🆓 Вход бесплатный  
- ⏱️ Осмотр: 30–45 минут

## Практические советы

- 👕 Соблюдайте дресс-код  
- 📷 Отлично для детальной съёмки  
- 🚆 Удобно совместить с поездкой на поезде

## Историческая справка

Пагода построена в 1949 году и стала известна благодаря уникальной технике декора из битой керамики.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ⛪ Domaine de Marie
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-domaine-de-marie',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- ⛪ Яркий пример колониальной архитектуры  
- 🌸 Уютные сады и спокойная атмосфера  
- 📸 Отличная фотолокация

## Структура комплекса

- ⛪ Интерьер церкви  
- 🌺 Территорию и сад  
- 🛍️ Небольшие лавки при монастыре

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Доступно днём

## Практические советы

- 🌞 Хорошо посещать утром  
- 👕 Уважайте религиозный характер места  
- 📷 Красиво при мягком свете

## Историческая справка

Церковь была построена французскими монахинями в 1940-х годах и сохранила оригинальный стиль.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🚂 Dalat Railway Station
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-dalat-railway-station',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🚂 Архитектурная икона французского Далата  
- 📸 Один из самых фотогеничных вокзалов страны  
- 🏛️ Исторический объект колониальной эпохи

## Структура комплекса

- 🚉 Здание вокзала и интерьеры  
- 🚃 Старинные вагоны  
- 🛤️ Короткую поездку на ретро-поезде

## Билеты и посещение

- 💰 Вход на территорию: ~10 000 VND  
- 🚃 Поездка на поезде: оплачивается отдельно

## Практические советы

- 📷 Лучшее время для фото — утро  
- ⏰ Поездки ходят по расписанию  
- 🧥 Вокзал расположен в прохладной зоне

## Историческая справка

Вокзал открыт в 1932 году и был частью железной дороги Далат–Тхапчам, соединявшей горный курорт с побережьем.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ⛪ Dalat Cathedral
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-dalat-cathedral',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- ⛪ Самый известный храм Далата  
- 🐓 Необычный символ на башне  
- 📸 Красивые виды с холма

## Структура комплекса

- ⛪ Интерьер собора  
- 🎨 Витражи  
- 🌄 Вид на город

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Лучше посещать вне служб

## Практические советы

- 👕 Скромная одежда  
- 🤫 Соблюдайте тишину  
- 📷 Снимайте без вспышки

## Историческая справка

Собор построен в 1931–1942 годах и стал центром католической общины Центрального нагорья.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 👑 Bao Dai Palace III
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-bao-dai-palace-iii',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 👑 Возможность увидеть быт императорской семьи  
- 🏠 Хорошо сохранившиеся интерьеры  
- 🌲 Уютная территория с садами

## Структура комплекса

- 🛋️ Жилые комнаты дворца  
- 📜 Личные вещи императора  
- 🌳 Сад и террасы

## Билеты и посещение

- 💰 Вход: ~40 000 VND  
- ⏱️ Осмотр: 30–45 минут

## Практические советы

- 📷 Фотографировать внутри ограничено  
- 👟 Удобная обувь  
- 🌞 Хорошо посещать днём

## Историческая справка

Бао Дай использовал Далат как летнюю резиденцию благодаря прохладному климату и спокойной атмосфере.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏺 Lam Dong Museum
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-lam-dong-museum',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏺 Глубокий контекст региона  
- 🧬 Культура народов Центрального нагорья  
- 🏛️ Тихая музейная атмосфера

## Структура комплекса

- 🏺 Этнографические экспозиции  
- 🌾 Артефакты местных племён  
- 🏡 Традиционные дома

## Билеты и посещение

- 💰 Вход: ~20 000 VND  
- ⏱️ Осмотр: 1–1,5 часа

## Практические советы

- 🌞 Отлично для дневного визита  
- 📷 Фотосъёмка ограничена  
- 🧥 В залах прохладно

## Историческая справка

Музей расположен в бывшей французской резиденции и рассказывает об истории освоения нагорья.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌲 Dalat Pine Viewpoints
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-dalat-pine-viewpoints',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌲 Фирменные пейзажи Далата  
- 🌄 Отличные рассветы и туманы  
- 📸 Атмосферные фото

## Структура комплекса

- 🌄 Панорамы холмов  
- 🌫️ Утренние туманы  
- 🚶 Лесные тропы

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Лучше утром

## Практические советы

- 🌅 Приходите на рассвете  
- 🧥 Тёплая одежда  
- 📷 Объектив с хорошей светосилой

## Историческая справка

Сосновые леса и холмы сформировали уникальный микроклимат Далата, благодаря которому город стал курортом.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛍️ Dalat Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-dalat-market',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🛍️ Лучшее место для знакомства с повседневной жизнью города  
- 🍓 Свежие ягоды, фрукты и локальные продукты  
- 🍜 Большой выбор уличной еды

## Коммуникация & сервис

- 🗣 В основном вьетнамский  
- 💵 Только наличные  
- 🎒 Следите за вещами

## Локальная ценность

Dalat Market — сердце городской жизни и главный источник свежих продуктов для жителей Далата.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌙 Dalat Night Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-dalat-night-market',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌙 Атмосфера вечернего Далата  
- 🍢 Большой выбор уличной еды  
- 🛍️ Недорогие сувениры

## Коммуникация & сервис

- 🌐 Базовый английский  
- 💵 Наличные  
- 🚶 Удобно для прогулок

## Локальная ценность

Ночной рынок подчёркивает прохладный климат Далата и культуру вечерних прогулок.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍬 L’angfarm
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-l-angfarm',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍬 Лучшие подарки из Далата  
- 🌿 Чаи, сладости и снеки местного производства  
- 🎁 Удобно купить сувениры

## Коммуникация & сервис

- 🌐 Английский на уровне магазина  
- 💳 Принимают карты  
- 🛍️ Упаковывают для перевозки

## Локальная ценность

L’angfarm сформировал современный образ «сладкого Далата» и стал национальным брендом.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🥐 Lien Hoa Bakery & Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-lien-hoa-bakery-restaurant',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🥐 Одна из самых популярных пекарен города  
- 🍽️ Большие порции и низкие цены  
- 🏙️ Удобно в центре

## Коммуникация & сервис

- 🗣 Минимальный английский  
- 💵 Наличные  
- 🪑 Большой зал

## Локальная ценность

Lien Hoa — демократичное место, где завтракают и студенты, и семьи, и туристы.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍢 Nem nướng Bà Hùng
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-nem-nuong-ba-hung',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍢 Одно из культовых блюд Далата  
- 🔥 Свежая подача с гриля  
- 👨‍👩‍👧 Подходит для компаний

## Коммуникация & сервис

- 🗣 В основном вьетнамский  
- 💵 Наличные  
- 🪑 Простая посадка

## Локальная ценность

Nem nướng Bà Hùng — гастрономический символ Далата и обязательный пункт для знакомства с местной кухней.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ☕ La Viet Coffee
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-la-viet-coffee',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- ☕ Один из лучших specialty coffee в городе  
- 🌱 Прямое сотрудничество с локальными фермерами  
- 💻 Подходит для работы и встреч

## Коммуникация & сервис

- 🌐 Английский  
- 📶 Быстрый Wi-Fi  
- 🔌 Розетки

## Локальная ценность

La Viet Coffee — один из драйверов кофейной культуры Далата и пример устойчивого локального бизнеса.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌿 An Cafe
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-an-cafe',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌿 Тихая и зелёная атмосфера  
- 📸 Фотогеничный интерьер  
- 🍽️ Простая и понятная еда

## Коммуникация & сервис

- 🌐 Базовый английский  
- 📶 Wi-Fi  
- 🪑 Садовая посадка

## Локальная ценность

An Cafe отражает неспешный, «европейский» ритм Далата и его курортный характер.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌀 Maze Bar
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'dla-maze-bar',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌀 Самый необычный бар Далата  
- 🎨 Архитектурный аттракцион  
- 🍸 Вечерняя атмосфера

## Коммуникация & сервис

- 🌐 Английский  
- 📷 Подходит для фото  
- 🧭 Навигация внутри — часть опыта

## Локальная ценность

Maze Bar подчёркивает творческую и слегка сюрреалистичную сторону Далата, дополняя образ города.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏖️ Nha Trang Beach & Promenade
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-nha-trang-beach-promenade',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏖️ Один из самых удобных городских пляжей Вьетнама  
- 🚶 Прогулочная набережная с кафе и парками  
- 🌅 Красивые рассветы над Южно-Китайским морем

## Структура комплекса

- 🌊 Прогулку вдоль береговой линии  
- 🌴 Пальмовые аллеи и парки  
- 📷 Панорамы города и моря

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Доступен круглосуточно

## Практические советы

- 🌞 Лучшее время — раннее утро  
- 🏊 Купание комфортно в первой половине дня  
- 🌊 Следите за волнами и флагами безопасности

## Историческая справка

Пляж сформировал курортную идентичность Нячанга и стал главным общественным пространством города.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🗿 Po Nagar Cham Towers
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-po-nagar-cham-towers',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🗿 Главный памятник чамской культуры в регионе  
- 🛕 Действующий религиозный комплекс  
- 📸 Панорамные виды на город

## Структура комплекса

- 🗿 Главные кирпичные башни  
- 🔥 Алтари и ритуальные зоны  
- 🌄 Вид на реку и Нячанг

## Билеты и посещение

- 💰 Вход: ~30 000 VND  
- ⏱️ Осмотр: 30–60 минут

## Практические советы

- 👕 Скромная одежда  
- 📷 Хорошо посещать утром  
- 🌞 В полдень жарко

## Историческая справка

Башни посвящены богине По Нагар — покровительнице земли и плодородия, почитаемой чамами и вьетнамцами.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛕 Long Son Pagoda
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-long-son-pagoda',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🛕 Одна из главных буддийских святынь Нячанга  
- 🗿 Большая статуя Будды  
- 🌄 Панорамы города

## Структура комплекса

- 🗿 Статую Белого Будды  
- 🛕 Главный храм  
- 🌄 Вид на город

## Билеты и посещение

- 🆓 Бесплатно  
- ⏱️ Осмотр: 30–45 минут

## Практические советы

- 👟 Удобная обувь — подъём по ступеням  
- 👕 Скромная одежда  
- 🌞 Лучше утром

## Историческая справка

Пагода основана в конце XIX века и стала символом буддийской общины города.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ⛪ Nha Trang Cathedral
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-nha-trang-cathedral',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- ⛪ Колониальная архитектура  
- 🏛️ Исторический ориентир города  
- 📸 Фотогеничное место

## Структура комплекса

- ⛪ Интерьер собора  
- 🪟 Витражи  
- 🌄 Вид на город

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Посещение вне служб

## Практические советы

- 🤫 Соблюдайте тишину  
- 📷 Без вспышки  
- 👕 Скромная одежда

## Историческая справка

Собор был построен в 1933 году и получил название «Каменная церковь» из-за серого камня.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🪨 Hon Chong Rocks
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-hon-chong-rocks',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌊 Контраст моря и скал  
- 🌅 Красивые закаты  
- 📸 Спокойная атмосфера

## Структура комплекса

- 🪨 Скальные образования  
- 🌊 Вид на море  
- 🌅 Закат

## Билеты и посещение

- 💰 Вход: ~22 000 VND  
- ⏱️ Осмотр: 20–40 минут

## Практические советы

- 🌞 Хорошо посещать вечером  
- 👟 Удобная обувь  
- 📷 Отлично для пейзажной съёмки

## Историческая справка

Скалы издавна служили местом отдыха и вдохновения для художников и поэтов региона.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🐠 National Oceanographic Museum of Vietnam
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-national-oceanographic-museum-of-vietnam',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🐠 Лучшее место, чтобы понять морскую экосистему региона  
- 🧪 Научный и образовательный контекст  
- 👨‍👩‍👧 Подходит для семей с детьми

## Структура комплекса

- 🐟 Аквариумы с тропическими рыбами  
- 🦈 Коллекцию морских скелетов  
- 🧭 Экспозиции о морских исследованиях

## Билеты и посещение

- 💰 Вход: ~40 000 VND  
- ⏱️ Осмотр: 1–1,5 часа

## Практические советы

- 🌞 Хорош для дневного визита  
- 📷 Съёмка ограничена в отдельных залах  
- 🌊 Можно совместить с портовой прогулкой

## Историческая справка

Музей основан в 1922 году и является важным научным центром морских исследований Вьетнама.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🎢 VinWonders Nha Trang & Cable Car
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-vinwonders-nha-trang-cable-car',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🚠 Канатная дорога над заливом  
- 🎢 Аттракционы и аквапарк  
- 👨‍👩‍👧 Развлечения для всей семьи

## Структура комплекса

- 🚠 Канатную дорогу  
- 🎡 Аттракционы и шоу  
- 🌊 Панорамы залива

## Билеты и посещение

- 💰 Билет: ~800 000–900 000 VND  
- ⏱️ Полный день

## Практические советы

- 🎟️ Приходите с утра  
- 🌦️ Следите за погодой  
- 🎒 Возьмите воду и защиту от солнца

## Историческая справка

Парк стал частью стратегии развития островных курортов VinGroup и символом туристического роста Нячанга.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛁 Tháp Bà Hot Springs
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-thap-ba-hot-springs',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🛁 Одна из самых известных грязелечебниц Вьетнама  
- 💆 Расслабление после пляжа  
- 🌿 Зелёная территория

## Структура комплекса

- 🛁 Грязевые ванны  
- ♨️ Минеральные бассейны  
- 🌴 Зоны отдыха

## Билеты и посещение

- 💰 Пакеты: ~150 000–400 000 VND  
- ⏱️ Осмотр: 2–3 часа

## Практические советы

- 👙 Купальник обязателен  
- 📅 Лучше бронировать в сезон  
- 🚿 Душ обязателен после процедур

## Историческая справка

Традиции грязелечения в районе Нячанга использовались местными жителями задолго до туристического освоения.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛁 i-Resort Mud Bath
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-i-resort-mud-bath',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏨 Современный и комфортный формат  
- 🛁 Большой выбор процедур  
- 👨‍👩‍👧 Подходит для семей

## Структура комплекса

- 🛁 Индивидуальные грязевые ванны  
- ♨️ Бассейны с минеральной водой  
- 🌺 Ландшафтные зоны

## Билеты и посещение

- 💰 Пакеты: ~200 000–500 000 VND  
- ⏱️ 2–4 часа

## Практические советы

- 📅 Лучше приезжать утром  
- 👙 Купальник и полотенце  
- 🚗 Удобнее на такси

## Историческая справка

i-Resort был создан как современная альтернатива классическим грязелечебницам Нячанга.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🤿 Hon Mun Island
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-hon-mun-island',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🤿 Лучшие кораллы региона  
- 🐟 Богатая морская жизнь  
- 🚤 Популярные морские туры

## Структура комплекса

- 🐠 Коралловые рифы  
- 🚤 Островные бухты  
- 🤿 Подводный мир

## Билеты и посещение

- 💰 Тур: ~400 000–700 000 VND  
- ⏱️ Полдня или день

## Практические советы

- 🌊 Лучший сезон: март–сентябрь  
- 🧴 Солнцезащита обязательна  
- 🤿 Маска и трубка обычно включены

## Историческая справка

Hon Mun стал первым морским охраняемым районом Вьетнама и остаётся ключевой зоной сохранения кораллов.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍺 Louisiane Brewhouse
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-louisiane-brewhouse',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍺 Собственная мини-пивоварня  
- 🏖️ Терраса прямо у моря  
- 🌍 Популярно у экспатов и туристов

## Коммуникация & сервис

- 🌐 Английский без проблем  
- 📶 Wi-Fi  
- 🪑 Терраса и бассейн

## Локальная ценность

Louisiane Brewhouse стал одним из первых мест, где в Нячанге появилась культура крафтового пива.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌴 Sailing Club
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-sailing-club',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌴 Самый известный beach club города  
- 🔥 Вечеринки и fire-show  
- 🍹 Курортная атмосфера

## Коммуникация & сервис

- 🌐 Английский  
- 🎶 DJ и шоу  
- 🪑 Пляжная посадка

## Локальная ценность

Sailing Club сформировал ночную жизнь Нячанга ещё до массового курортного бума.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍛 Ganesh Indian Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-ganesh-indian-restaurant',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍛 Лучший индийский ресторан города  
- 🌱 Большой выбор вегетарианских блюд  
- 🌍 Стабильное качество

## Коммуникация & сервис

- 🌐 Хороший английский  
- 🌱 Вегетарианские опции  
- ❄️ Кондиционированный зал

## Локальная ценность

Ganesh стал гастрономической альтернативой в морском городе, ориентированном на морепродукты.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏡 Alpaca Homestyle Café
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-alpaca-homestyle-cafe',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🏡 Атмосфера «как дома»  
- 🥐 Европейские завтраки  
- ☕ Хороший кофе

## Коммуникация & сервис

- 🌐 Английский  
- 📶 Wi-Fi  
- 🪑 Небольшой зал

## Локальная ценность

Alpaca Café — пример камерного заведения, ориентированного на долгих гостей и экспатов.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🔥 Lac Canh BBQ
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-lac-canh-bbq',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🔥 Культовое место Нячанга  
- 🥩 Уникальный формат «жарь сам»  
- 🕰️ История и традиция

## Коммуникация & сервис

- 🗣 В основном вьетнамский  
- 💵 Наличные  
- 🔥 Активный гриль за столом

## Локальная ценность

Lac Canh BBQ — гастрономический символ старого Нячанга, обязательный пункт для любителей мяса.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍣 Kiwami Sushi
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-kiwami-sushi',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍣 Лучший суши-ресторан Нячанга  
- 🎌 Аутентичный японский подход  
- 🪑 Камерная атмосфера

## Коммуникация & сервис

- 🌐 Английский  
- 📅 Бронирование желательно  
- 🪑 Небольшое количество мест

## Локальная ценность

Kiwami Sushi показывает, что в курортном городе возможна высокая гастрономия нишевого формата.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌃 Skylight Rooftop / Skydeck
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-skylight-rooftop-skydeck',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌃 Один из самых высоких rooftop-баров Вьетнама  
- 🎧 Клубная атмосфера  
- 📸 Панорамы ночного Нячанга

## Коммуникация & сервис

- 🌐 Английский  
- 👔 Дресс-код вечером  
- 🎶 DJ и танцпол

## Локальная ценность

Skylight закрепил образ Нячанга как города с активной ночной жизнью и панорамными барами.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛍️ Chợ Đầm
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-cho-am',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🛍️ Центральный рынок города  
- 🍜 Большой выбор локальной еды  
- 🎁 Сувениры и повседневные товары

## Коммуникация & сервис

- 🗣 В основном вьетнамский  
- 💵 Наличные  
- 🎒 Будьте внимательны к вещам

## Локальная ценность

Chợ Đầm — торговое и гастрономическое сердце Нячанга, ориентированное прежде всего на местных.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌙 Nha Trang Night Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'ntr-nha-trang-night-market',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌙 Удобно совместить с прогулкой по набережной  
- 🍢 Уличная еда и перекусы  
- 🛍️ Сувениры и подарки

## Коммуникация & сервис

- 🌐 Базовый английский  
- 💵 Наличные  
- 🚶 Удобно для вечерних прогулок

## Локальная ценность

Ночной рынок подчёркивает курортный характер Нячанга и ориентирован на гостей города.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏖️ Long Beach
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-long-beach',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏖️ Главный туристический пляж острова  
- 🌅 Одни из лучших закатов во Вьетнаме  
- 🏨 Широкий выбор отелей и ресторанов

## Структура комплекса

- 🌊 Прогулку вдоль береговой линии  
- 🌴 Закат над морем  
- 🍹 Пляжные бары и кафе

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Доступен круглосуточно

## Практические советы

- 🌞 Лучшее время — после обеда  
- 🧴 Солнцезащита обязательна  
- 🌊 Купание комфортно в первой половине дня

## Историческая справка

Long Beach стал основой туристического развития Фукуока и символом его курортной индустрии.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏝️ Sao Beach
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-sao-beach',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏝️ Самый красивый пляж Фукуока  
- 💎 Белый песок и прозрачная вода  
- 📸 Открытка «тропического рая»

## Структура комплекса

- 🌊 Береговую линию  
- 🌴 Тень пальм  
- 🍹 Уличные точки с кокосами

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Доступен круглосуточно

## Практические советы

- 🚗 Удобнее добираться на машине или байке  
- 🌞 Приходите утром — меньше людей  
- 🧴 Берите воду и защиту от солнца

## Историческая справка

Название «Sao» означает «звёздчатый», что связано с формой морских звёзд, ранее обитавших здесь.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌿 Ong Lang Beach
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-ong-lang-beach',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌿 Альтернатива шумному Long Beach  
- 🏖️ Чистая вода и широкая береговая линия  
- 🌅 Спокойные закаты

## Структура комплекса

- 🌊 Прогулку по пляжу  
- 🏝️ Вид на остров Хон Мо  
- 🍹 Кафе у воды

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Доступен круглосуточно

## Практические советы

- 🚗 Удобнее на байке  
- 🌞 Подходит для целого дня  
- 🧴 Возьмите всё необходимое с собой

## Историческая справка

Ong Lang долгое время оставался в тени крупных курортов и сохранил более аутентичную атмосферу.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌳 Phu Quoc National Park
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-phu-quoc-national-park',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌳 Нетронутая природа и биоразнообразие  
- 🥾 Треккинг и наблюдение за дикой природой  
- 🌄 Смотровые площадки

## Структура комплекса

- 🏞️ Водопад Da Ban  
- 🌄 Смотровую площадку Mount Chúa  
- 🐒 Обезьян и редких птиц

## Билеты и посещение

- 💰 Вход: ~60 000 VND  
- ⏱️ Осмотр: полдня или день

## Практические советы

- 👟 Удобная обувь  
- 🧴 Защита от насекомых  
- 🚗 Удобнее на машине

## Историческая справка

Парк был создан для защиты уникальной экосистемы острова и является домом для многих эндемиков.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛕 Dinh Cậu Temple
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-dinh-cau-temple',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🛕 Духовный центр местных жителей  
- 🌊 Уникальное расположение на мысе  
- 🌅 Красивые закаты

## Структура комплекса

- 🏯 Главный храм на скале  
- 🕯️ Алтари и святилища  
- 🌊 Вид на море

## Билеты и посещение

- 🆓 Бесплатно  
- ⏱️ Осмотр: 20–30 минут

## Практические советы

- 👕 Скромная одежда  
- 📷 Без вспышки  
- 🌞 Лучше вечером

## Историческая справка

Храм построен в XVIII веке и почитается как место, где духи моря защищают остров.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌙 Phu Quoc Night Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-phu-quoc-night-market',
  'overview',
  'ru',
  NULL,
  '## Локальная ценность

Рынок — главная торговая и гастрономическая точка для гостей и местных жителей.

## Почему это важно?

- 🌙 Сердце ночной жизни Фукуока  
- 🍢 Уличная еда и морепродукты  
- 🛍️ Сувениры и подарки

## Структура комплекса

- 🦞 Живые морепродукты  
- 🍢 Гриль-зоны  
- 🛍️ Ряды сувениров

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Работает ежедневно с ~17:00 до 23:00

## Практические советы

- 💵 Наличные  
- 🎒 Следите за вещами  
- 🍽️ Выбирайте точки с очередями
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🐟 Fish Sauce Factory
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-fish-sauce-factory',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🐟 Уникальный продукт острова  
- 🏺 Традиционная технология  
- 🎁 Возможность купить оригинал

## Структура комплекса

- 🪣 Деревянные бочки ферментации  
- 🧪 Процесс производства  
- 🛍️ Магазин продукции

## Билеты и посещение

- 🆓 Бесплатно (чаевые приветствуются)  
- ⏱️ Осмотр: 20–30 минут

## Практические советы

- 📷 Фотографировать разрешено  
- 🛍️ Покупайте только на фабрике  
- 🚗 Удобно совместить с другими объектами

## Историческая справка

Фукуок славится ныок мам уже более 200 лет благодаря чистой рыбе и идеальному климату для ферментации.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ⚰️ Phu Quoc Prison
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-phu-quoc-prison',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- ⚰️ Важный исторический и образовательный объект  
- 🕯️ Место памяти и скорби  
- 📸 Архитектура и экспозиции

## Структура комплекса

- 🏛️ Воссозданные камеры  
- 🗿 Скульптуры и мемориалы  
- 📜 Экспозиции о жизни заключённых

## Билеты и посещение

- 💰 Вход: ~30 000 VND  
- ⏱️ Осмотр: 1–1,5 часа

## Практические советы

- 🤫 Уважительное поведение  
- 👕 Скромная одежда  
- 📷 Без вспышки

## Историческая справка

Тюрьма была построена французами, но стала печально известной во времена войны во Вьетнаме.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🦁 Vinpearl Safari & Grand World
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-vinpearl-safari-grand-world',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🦁 Один из лучших сафари-парков ЮВА  
- 🎢 Grand World — иммерсивный культурный парк  
- 👨‍👩‍👧 Подходит для семей

## Структура комплекса

- 🦒 Зоны свободного выгула животных  
- 🏮 Тематические кварталы Grand World  
- 🎭 Шоу и представления

## Билеты и посещение

- 💰 Комбинированный билет: ~800 000–1 200 000 VND  
- ⏱️ Полный день

## Практические советы

- 🎟️ Приходите с утра  
- 🌦️ Следите за погодой  
- 🚠 Можно совместить с канатной дорогой

## Историческая справка

Проект стал частью стратегии VinGroup по созданию всестороннего туристического направления на Фукуоке.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🚠 Hon Thom Cable Car
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-hon-thom-cable-car',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🚠 Рекордная канатная дорога  
- 🏝️ Доступ к острову Хон Том  
- 🌊 Панорамы залива

## Структура комплекса

- 🚠 Поездку на канатке  
- 🏖️ Пляжи Хон Том  
- 🎢 Аттракционы Sun World

## Билеты и посещение

- 💰 Билет: ~500 000–700 000 VND  
- ⏱️ Полдня

## Практические советы

- 📷 Возьмите объектив с зумом  
- 🌦️ Избегайте туманной погоды  
- 🎟️ Бронируйте онлайн

## Историческая справка

Канатная дорога открыта в 2018 году и занесена в Книгу рекордов Гиннесса.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍜 Bánh Canh Chả Cá Ông Hai
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-banh-canh-cha-ca-ong-hai',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍜 Культовое блюдо острова  
- 🔥 Готовят прямо у входа  
- 💸 Очень бюджетно

## Коммуникация & сервис

- 🗣 Только вьетнамский  
- 💵 Наличные  
- 🪑 Простые столики

## Локальная ценность

Это место — гастрономическая легенда Фукуока, где едят и местные, и туристы.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🐚 Ốc 343
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-oc-343',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🐚 Уникальное меню из морских моллюсков  
- 🔥 Живая подача с гриля  
- 🌶️ Острые соусы

## Коммуникация & сервис

- 🗣 Минимальный английский  
- 💵 Наличные  
- 🪑 Неформальная посадка

## Локальная ценность

Ốc 343 показывает, как местные используют богатства моря в повседневной кухне.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🦀 Gành Dầu Crab Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-ganh-dau-crab-market',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🦀 Свежайшие крабы Фукуока  
- 🔥 Приготовление на месте  
- 🌊 Аутентичная атмосфера

## Коммуникация & сервис

- 🗣 В основном вьетнамский  
- 💵 Наличные  
- 🪑 Простые столы

## Локальная ценность

Рынок — живое отражение рыболовной культуры северного Фукуока.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌴 Rory’s Beach Bar
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-rory-s-beach-bar',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌴 Идеальное место для заката  
- 🍹 Коктейли у моря  
- 🎶 Спокойная музыка

## Коммуникация & сервис

- 🌐 Английский  
- 🪑 Пляжная посадка  
- 📷 Отлично для фото

## Локальная ценность

Rory’s — неформальный символ пляжной культуры Фукуока.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌿 The Pepper Tree
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-the-pepper-tree',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌿 Садовая атмосфера  
- 🍽️ Европейская кухня высокого качества  
- 🕯️ Романтическая обстановка

## Коммуникация & сервис

- 🌐 Английский  
- 💳 Карты  
- 🪑 Садовая посадка

## Локальная ценность

The Pepper Tree представляет гастрономическую эволюцию Фукуока — от рыбы к международной кухне.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍝 Luna Rossa
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-luna-rossa',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍕 Аутентичная итальянская пицца  
- 🌊 Вид на закат  
- 🍷 Винная карта

## Коммуникация & сервис

- 🌐 Английский  
- 💳 Карты  
- 🪑 Терраса у моря

## Локальная ценность

Luna Rossa демонстрирует, что на Фукуоке возможна качественная международная кухня.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍲 PhuongBinh Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-phuongbinh-restaurant',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍲 Широкая витрина вьетнамской кухни  
- 👨‍👩‍👧 Подходит для семей  
- 💸 Демократичные цены

## Коммуникация & сервис

- 🌐 Базовый английский  
- 💵 Наличные  
- 🪑 Удобная посадка

## Локальная ценность

PhuongBinh — надёжный выбор для знакомства с кухней Вьетнама без туристического глянца.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌊 Shimmer Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-shimmer-restaurant',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌊 Панорамный вид на закат  
- 🍽️ Авторская кухня  
- 🕯️ Романтическая атмосфера

## Коммуникация & сервис

- 🌐 Английский  
- 💳 Карты  
- 👔 Smart casual

## Локальная ценность

Shimmer представляет современную гастрономическую идентичность Фукуока.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌙 Đường Bàng Night Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'phu-uong-bang-night-market',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌙 Менее туристический, чем Duong Dong  
- 🍢 Аутентичная уличная еда  
- 🛍️ Спокойная атмосфера

## Коммуникация & сервис

- 🗣 В основном вьетнамский  
- 💵 Наличные  
- 🚶 Удобно для прогулок

## Локальная ценность

Đường Bàng — пример того, как ночные рынки работают «для своих».
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌊 Hoan Kiem Lake & Ngoc Son Temple
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'han-hoan-kiem-lake-ngoc-son-temple',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌊 Главный символ Ханоя  
- 🛕 Духовное и культурное сердце столицы  
- 📸 Идеальное место для прогулок и фото

## Структура комплекса

- 🏯 Храм Нгок Шон на острове  
- 🌉 Мост Те Хук (Мост восходящего солнца)  
- 🐢 Памятник черепахе

## Билеты и посещение

- 💰 Вход в храм: ~30 000 VND  
- 🕒 Осмотр: 30–60 минут

## Практические советы

- 🌅 Лучшее время — утро или вечер  
- 👟 Удобная обувь для прогулок  
- 📷 Отлично подходит для пейзажной съёмки

## Историческая справка

Озеро связано с легендой о возвращённом мече дракона, который помог императору Ле Лою изгнать захватчиков.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏮 Old Quarter
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'han-old-quarter',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 📚 Первый университет страны  
- 🏯 Прекрасный образец конфуцианской архитектуры  
- 📸 Спокойная атмосфера в центре города

## Структура комплекса

- 🏯 Пять дворов храма  
- 🐉 Стелы на черепахах  
- 🌿 Сады и павильоны

## Билеты и посещение

- 💰 Вход: ~30 000 VND  
- ⏱️ Осмотр: 1–1,5 часа

## Практические советы

- 👕 Скромная одежда  
- 📷 Без вспышки внутри залов  
- 🌞 Лучше утром

## Историческая справка

Основан в 1070 году, храм стал центром образования и символом уважения к знаниям.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ⚰️ Hoa Lo Prison
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'han-hoa-lo-prison',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- ⚰️ Важный исторический мемориал  
- 🕯️ Контраст между колониальным и военным прошлым  
- 📸 Архитектура и экспозиции

## Структура комплекса

- 🏛️ Камеры заключённых  
- 🗿 Скульптуры и мемориалы  
- ✈️ Экспозиция о «Ханойском Хилтоне»

## Билеты и посещение

- 💰 Вход: ~30 000 VND  
- ⏱️ Осмотр: 1 час

## Практические советы

- 🤫 Уважительное поведение  
- 📷 Фотографировать можно не везде  
- 🌞 Подходит для дневного визита

## Историческая справка

Тюрьма была построена французами для политзаключённых, а позже стала местом содержания американских лётчиков.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ⛪ St. Joseph’s Cathedral
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'han-st-joseph-s-cathedral',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- ⛪ Архитектурная доминанта Старого квартала  
- 📸 Популярная фотолокация  
- 🌇 Атмосфера вечерних встреч

## Структура комплекса

- ⛪ Интерьер собора  
- 🪟 Витражи  
- 🌆 Вид на площадь вечером

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Посещение вне служб

## Практические советы

- 👕 Скромная одежда  
- 🤫 Тишина внутри  
- 📷 Без вспышки

## Историческая справка

Собор построен в 1886 году на месте буддийского храма и стал символом католической общины Ханоя.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏯 One Pillar Pagoda
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'han-one-pillar-pagoda',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏯 Одна из самых узнаваемых пагод Вьетнама  
- 🌸 Символ духовности и легенды  
- 📸 Компактная, но значимая достопримечательность

## Структура комплекса

- 🏯 Саму пагоду  
- 🌺 Сад вокруг  
- 🕯️ Алтарь внутри

## Билеты и посещение

- 💰 Вход: ~25 000 VND  
- ⏱️ Осмотр: 15–20 минут

## Практические советы

- 👕 Скромная одежда  
- 📷 Без вспышки  
- 🌞 Хорошо совмещать с Ван Миеу

## Историческая справка

Пагода основана в 1049 году после сна императора Ли Тхай То, увидевшего богиню Авалокитешвару на лотосе.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌊 West Lake
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'han-west-lake',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌊 Самое большое озеро города  
- 🛕 Старейшая пагода Ханоя  
- 🌅 Отличное место для заката

## Структура комплекса

- 🛕 Пагоду Tran Quoc  
- 🚶 Прогулку по набережной  
- ☕ Кафе у воды

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Доступно круглосуточно

## Практические советы

- 🌇 Лучшее время — вечер  
- 🚲 Удобно на велосипеде  
- 📷 Отлично для пейзажей

## Историческая справка

Tran Quoc Pagoda основана в VI веке и перенесена на берег Западного озера в XVII веке.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛕 Quan Thanh Temple
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'han-quan-thanh-temple',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🛕 Древний храм с бронзовыми статуями  
- 🌳 Расположен у Западного озера  
- 📸 Спокойная атмосфера

## Структура комплекса

- 🗿 Бронзовую статую Тхань Хоанг Де  
- 🏯 Главный зал храма  
- 🌿 Двор и алтари

## Билеты и посещение

- 🆓 Бесплатно  
- ⏱️ Осмотр: 20–30 минут

## Практические советы

- 👕 Скромная одежда  
- 📷 Без вспышки  
- 🌞 Хорошо совмещать с прогулкой по озеру

## Историческая справка

Храм был построен в XI веке при династии Ли и считается одним из четырёх священных ворот древнего Тханг Лонга.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏳️ Flag Tower of Hanoi
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'han-flag-tower-of-hanoi',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏳️ Редкий сохранившийся объект крепости Тханг Лонг  
- 🌄 Панорамный вид на город  
- 📸 Историческая архитектура

## Структура комплекса

- 🏳️ Саму башню  
- 🌆 Вид с верхней площадки  
- 🏛️ Военный музей рядом

## Билеты и посещение

- 💰 Вход: ~30 000 VND  
- ⏱️ Осмотр: 30 минут

## Практические советы

- 👟 Удобная обувь для подъёма  
- 📷 Хороший объектив  
- 🌞 Лучше днём

## Историческая справка

Башня была частью цитадели и использовалась для подачи сигналов. Сегодня — символ столицы.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏛️ Ba Dinh Square & Ho Chi Minh Mausoleum
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'han-ba-dinh-square-ho-chi-minh-mausoleum',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏛️ Политическое сердце страны  
- 🕯️ Место паломничества для вьетнамцев  
- 📸 Архитектура и торжественная атмосфера

## Структура комплекса

- 🏛️ Мавзолей Хо Ши Мина  
- 🌳 Президентский дворец  
- 🏛️ Музей Хо Ши Мина

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Мавзолей открыт ограниченное время (обычно утром, кроме понедельника и пятницы)

## Практические советы

- 👕 Строгий дресс-код (без шорт, открытых плеч)  
- 📷 Без фото внутри мавзолея  
- ⏰ Приходите рано — очереди

## Историческая справка

На этой площади Хо Ши Мин провозгласил независимость Вьетнама в 1945 году.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍜 Bún Chả Hương Liên
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'han-bun-cha-huong-lien',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍜 Гастрономическая легенда Ханоя  
- 🌍 Международная известность  
- 🔥 Аутентичный вкус

## Коммуникация & сервис

- 🌐 Английское меню  
- 💵 Наличные  
- 🪑 Простая посадка

## Локальная ценность

Это место стало символом того, как уличная еда Ханоя может стать мировой иконой.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍜 Phở Gia Truyền Bát Đàn
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'han-pho-gia-truyen-bat-an',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍜 Культовое место для любителей фо  
- ⏳ Традиционный рецепт без изменений  
- 💸 Очень бюджетно

## Коммуникация & сервис

- 🗣 Только вьетнамский  
- 💵 Наличные  
- 🪑 Уличные столики

## Локальная ценность

Это место — эталон ханойского фо, где едят поколения местных жителей.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🥖 Bánh Mì 25
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'han-banh-mi-25',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🥖 Одна из лучших баньми в Ханое  
- ⚡ Быстро и вкусно  
- 💸 Очень недорого

## Коммуникация & сервис

- 🗣 Минимальный английский  
- 💵 Наличные  
- 🥡 Takeaway

## Локальная ценность

Bánh Mì 25 — пример того, как уличный сэндвич стал частью повседневной жизни Ханоя.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ☕ Cà Phê Giảng
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'han-ca-phe-giang',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- ☕ Родина яичного кофе  
- 🏠 Аутентичная атмосфера с 1946 года  
- 📸 Историческое место

## Коммуникация & сервис

- 🗣 В основном вьетнамский  
- 💵 Наличные  
- 🪑 Простые столики

## Локальная ценность

Cà Phê Giảng — живая история ханойской кофейной культуры и её изобретательности.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🧱 Cong Caphe
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'han-cong-caphe',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🧱 Атмосфера вьетнамского ретро  
- 🥥 Кокосовый кофе  
- 📍 Удобные локации

## Коммуникация & сервис

- 🌐 Базовый английский  
- 📶 Wi-Fi  
- 🪑 Неформальная посадка

## Локальная ценность

Cong Caphe популяризирует вьетнамский кофейный стиль и культуру «сидеть и наблюдать».
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 💎 Hidden Gem Café
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'han-hidden-gem-cafe',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 💎 Отличный вид на собор  
- ☕ Уютная атмосфера  
- 📸 Фотогеничная локация

## Коммуникация & сервис

- 🌐 Английский  
- 📶 Wi-Fi  
- 🪑 Окна с видом

## Локальная ценность

Hidden Gem Café — пример того, как маленькое заведение становится культовым благодаря виду и атмосфере.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍽️ Nhà Hàng Ngon
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'han-nha-hang-ngon',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍽️ Большая витрина кухни всей страны  
- 🌿 Садовая атмосфера  
- 👨‍👩‍👧 Подходит для семей

## Коммуникация & сервис

- 🌐 Английское меню  
- 💳 Карты  
- 🪑 Удобная посадка

## Локальная ценность

Nhà Hàng Ngon делает вьетнамскую кухню доступной и понятной для туристов без потери аутентичности.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍜 Quán Ăn Ngon
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'han-quan-an-ngon',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍜 Уличная еда в комфортной обстановке  
- 💸 Демократичные цены  
- 🌍 Популярно у туристов

## Коммуникация & сервис

- 🌐 Английское меню  
- 💳 Карты  
- 🪑 Неформальная посадка

## Локальная ценность

Quán Ăn Ngon — мост между уличной едой и ресторанной подачей.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛍️ Chợ Đồng Xuân
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'han-cho-ong-xuan',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🛍️ Главный рынок города  
- 🍜 Аутентичная еда  
- 💸 Дешёвые покупки

## Коммуникация & сервис

- 🗣 В основном вьетнамский  
- 💵 Наличные  
- 🎒 Следите за вещами

## Локальная ценность

Dong Xuan — торговый центр Ханоя с конца XIX века, где работают поколения торговцев.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌙 Night Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'han-night-market',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌙 Атмосфера вечернего Ханоя  
- 🍢 Уличная еда и прогулки  
- 🛍️ Сувениры и подарки

## Коммуникация & сервис

- 🌐 Базовый английский  
- 💵 Наличные  
- 🚶 Удобно для прогулок

## Локальная ценность

Ночной рынок — современное продолжение торговых традиций Старого квартала.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛍️ Ben Thanh Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgn-ben-thanh-market',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🛍️ Главный туристический и торговый символ Сайгона  
- 🍜 Большой выбор уличной еды  
- 🎁 Сувениры и подарки

## Структура комплекса

- 🏢 Иконическое здание с часовой башней  
- 🍢 Фуд-корт внутри рынка  
- 🛒 Ряды с одеждой, сувенирами и специями

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Работает ежедневно: днём и вечером

## Практические советы

- 💵 Торгуйтесь активно  
- 🎒 Следите за вещами  
- 🌙 Вечерний рынок — более атмосферный

## Историческая справка

Рынок был построен французами в начале XX века и с тех пор остаётся сердцем торговли Сайгона.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ⛪ Notre-Dame Cathedral Basilica of Saigon
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgn-notre-dame-cathedral-basilica-of-saigon',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- ⛪ Архитектурная икона колониального Сайгона  
- 📸 Одна из самых узнаваемых достопримечательностей Вьетнама  
- 🏛️ Расположен в историческом центре

## Структура комплекса

- ⛪ Фасад и башни собора  
- 🪟 Витражи и интерьер  
- 🌆 Вид на площадь вечером

## Билеты и посещение

- 🆓 Бесплатно (внутрь не всегда пускают)  
- 🕒 Посещение вне служб

## Практические советы

- 👕 Скромная одежда  
- 🤫 Уважайте религиозный характер места  
- 📷 Без вспышки

## Историческая справка

Собор построен в 1880 году из кирпича, привезённого из Франции, и до сих пор не побелел.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 📮 Central Post Office
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgn-central-post-office',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 📮 Архитектурный шедевр колониальной эпохи  
- 📸 Впечатляющий интерьер с картами и деревянными стойками  
- 🏛️ Работает как почта до сих пор

## Структура комплекса

- 🗺️ Гигантские карты Индокитая  
- 🪑 Деревянные стойки и потолки  
- 📮 Почтовые услуги и сувениры

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Открыто днём

## Практические советы

- 📷 Отлично подходит для интерьерной съёмки  
- 📮 Можно отправить открытку с оригинальным штемпелем  
- 🌞 Лучше утром

## Историческая справка

Здание построено в 1891 году и приписывается ученикам Эйфеля, хотя точное авторство спорно.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏛️ Independence Palace
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgn-independence-palace',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🏛️ Ключевой исторический объект страны  
- 🕰️ Сохранившиеся интерьеры 1960–70-х  
- 📸 Знаменитый танк у ворот

## Структура комплекса

- 🏢 Главное здание дворца  
- 📡 Комнату управления  
- 🛩️ Вертолётную площадку на крыше

## Билеты и посещение

- 💰 Вход: ~40 000 VND  
- ⏱️ Осмотр: 1–1,5 часа

## Практические советы

- 📷 Фотографировать можно почти везде  
- 🌞 Хорошо посещать днём  
- 👟 Удобная обувь

## Историческая справка

Дворец стал символом воссоединения Вьетнама после падения Сайгона в 1975 году.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ⚔️ War Remnants Museum
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgn-war-remnants-museum',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- ⚔️ Глубокий исторический и гуманитарный контекст  
- 📸 Фотографии и экспонаты с сильным эмоциональным воздействием  
- 🕯️ Образовательное значение

## Структура комплекса

- 📸 Выставку «Агент Оранж»  
- ✈️ Авиационную технику на улице  
- 📜 Документальные материалы

## Билеты и посещение

- 💰 Вход: ~40 000 VND  
- ⏱️ Осмотр: 1,5–2 часа

## Практические советы

- 🤫 Уважительное поведение  
- 📷 Без вспышки в залах  
- 🌞 Подходит для дневного визита

## Историческая справка

Музей основан в 1975 году и изначально назывался «Музей американских преступлений».
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛕 Jade Emperor Pagoda
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgn-jade-emperor-pagoda',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🛕 Один из самых красивых храмов города  
- 🐉 Богатый декор и скульптуры  
- 📸 Фотогеничная атмосфера

## Структура комплекса

- 🗿 Статуи божеств и демонов  
- 🕯️ Алтари и курения благовоний  
- 🐢 Пруд с черепахами

## Билеты и посещение

- 🆓 Бесплатно  
- ⏱️ Осмотр: 30–45 минут

## Практические советы

- 👕 Скромная одежда  
- 🤫 Тишина и уважение  
- 📷 Без вспышки

## Историческая справка

Храм построен в 1909 году китайской общиной и посвящён Нефритовому императору.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛍️ Binh Tay Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgn-binh-tay-market',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🛍️ Аутентичная атмосфера без туристического глянца  
- 🧺 Огромный выбор товаров и продуктов  
- 👀 Наблюдение за повседневной жизнью

## Структура комплекса

- 🍜 Зоны стрит-фуда  
- 🧺 Ряды сухофруктов и специй  
- 🛒 Оптовые лавки

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Лучше утром

## Практические советы

- 💵 Наличные  
- 🎒 Следите за вещами  
- 🗣 Только вьетнамский/китайский

## Историческая справка

Рынок был построен в 1928 году и стал центром торговли китайской диаспоры.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌳 Tao Dan Park
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgn-tao-dan-park',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌳 Оазис зелени в центре мегаполиса  
- 👨‍🦯 Место утренних занятий тайчи и йогой  
- 📸 Спокойная атмосфера

## Структура комплекса

- 🦜 Вольер с птицами  
- 🌸 Цветочные клумбы  
- 🚶 Прогулочные дорожки

## Билеты и посещение

- 💰 Вход: ~10 000 VND  
- 🕒 Открыт с утра до вечера

## Практические советы

- 🌅 Лучше утром  
- 👟 Удобная обувь  
- 📷 Хорошо для уличной фотографии

## Историческая справка

Парк был разбит французами в начале XX века как Botanical Garden.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌃 Bitexco Financial Tower & Skydeck
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgn-bitexco-financial-tower-skydeck',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌃 Панорамный вид на весь город  
- 🏙️ Архитектурная доминанта  
- 📸 Отличное место для ночных фото

## Структура комплекса

- 🌆 Вид на Сайгон с высоты  
- 🏙️ Городские огни вечером  
- 📷 Интерактивные точки на Skydeck

## Билеты и посещение

- 💰 Вход: ~200 000 VND  
- 🕒 Открыт до 21:30

## Практические советы

- 🌇 Лучше вечером  
- 📷 Возьмите объектив с зумом  
- 🎟️ Бронируйте онлайн

## Историческая справка

Башня открыта в 2010 году и стала символом современного Сайгона.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌊 Saigon River Promenade
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgn-saigon-river-promenade',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌊 Спокойное место для прогулок  
- 🌃 Вечерние виды на реку  
- ☕ Кафе и рестораны у воды

## Структура комплекса

- 🌉 Мост Thu Thiem  
- 🚢 Корабли и лодки  
- 🌆 Закат над водой

## Билеты и посещение

- 🆓 Бесплатно  
- 🕒 Доступно круглосуточно

## Практические советы

- 🌇 Лучше вечером  
- 👟 Удобная обувь  
- 📷 Отлично для пейзажей

## Историческая справка

Набережная была реконструирована в 2000-х как общественное пространство.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🥖 Bánh Mì Huỳnh Hoa
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgn-banh-mi-huynh-hoa',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🥖 Культовое место среди любителей баньми  
- ⚡ Большие и сочные сэндвичи  
- 💸 Очень бюджетно

## Коммуникация & сервис

- 🗣 Только вьетнамский  
- 💵 Наличные  
- ⏱️ Очереди в часы пик

## Локальная ценность

Huỳnh Hoa — эталон сытного и доступного уличного перекуса в Сайгоне.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍚 Cơm Tấm Cali
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgn-com-tam-cali',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍚 Самое популярное блюдо Сайгона  
- 💼 Быстро, вкусно и недорого  
- 📍 Удобные локации

## Коммуникация & сервис

- 🗣 Минимальный английский  
- 💵 Наличные  
- 🪑 Простая посадка

## Локальная ценность

Cơm Tấm Cali сделал фирменное блюдо Сайгона доступным для миллионов.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🐚 Quán Ốc 45
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgn-quan-oc-45',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🐚 Уникальное меню из улиток и моллюсков  
- 🔥 Живая подача с гриля  
- 🌶️ Острые соусы

## Коммуникация & сервис

- 🗣 Только вьетнамский  
- 💵 Наличные  
- 🪑 Неформальная посадка

## Локальная ценность

Quán Ốc 45 — пример того, как местные используют морские ресурсы в повседневной кухне.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ☕ The Workshop Coffee
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgn-the-workshop-coffee',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- ☕ Одна из лучших specialty-кофеен города  
- 🏗️ Архитектурное пространство  
- 💻 Подходит для работы

## Коммуникация & сервис

- 🌐 Английский  
- 📶 Быстрый Wi-Fi  
- 🔌 Розетки

## Локальная ценность

The Workshop сформировал культуру specialty coffee в Сайгоне.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 👗 L’Usine
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgn-l-usine',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 👗 Стильное пространство  
- ☕ Кофе и лёгкие закуски  
- 📸 Фотогеничная атмосфера

## Коммуникация & сервис

- 🌐 Английский  
- 📶 Wi-Fi  
- 🪑 Стильная посадка

## Локальная ценность

L’Usine — символ современной креативной культуры Сайгона.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌃 Chill Skybar
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgn-chill-skybar',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🌃 Панорамный вид на ночной Сайгон  
- 🍸 Коктейли и атмосфера  
- 🎶 DJ и вечеринки

## Коммуникация & сервис

- 🌐 Английский  
- 👔 Дресс-код вечером  
- 📷 Отлично для ночных фото

## Локальная ценность

Chill Skybar — символ ночной жизни делового Сайгона.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍽️ Nhà Hàng Ngon Sài Gòn
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgn-nha-hang-ngon-sai-gon',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍽️ Большая витрина кухни всей страны  
- 🌿 Садовая атмосфера  
- 👨‍👩‍👧 Подходит для семей

## Коммуникация & сервис

- 🌐 Английское меню  
- 💳 Карты  
- 🪑 Удобная посадка

## Локальная ценность

Nhà Hàng Ngon делает вьетнамскую кухню доступной и понятной для туристов.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍜 Quán Ăn Ngon Sài Gòn
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgn-quan-an-ngon-sai-gon',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍜 Уличная еда в комфортной обстановке  
- 💸 Демократичные цены  
- 🌍 Популярно у туристов

## Коммуникация & сервис

- 🌐 Английское меню  
- 💳 Карты  
- 🪑 Неформальная посадка

## Локальная ценность

Quán Ăn Ngon — мост между уличной едой и ресторанной подачей.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍜 Bún Thịt Nướng Nguyễn Trung Trực
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgn-bun-thit-nuong-nguyen-trung-truc',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍜 Аутентичный вкус bún thịt nướng  
- 💸 Очень бюджетно  
- ⏳ Работает десятилетиями

## Коммуникация & сервис

- 🗣 Только вьетнамский  
- 💵 Наличные  
- 🪑 Уличные столики

## Локальная ценность

Это место — часть повседневной гастрономической культуры Сайгона.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍜 Phở Hòa Pasteur
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'sgn-pho-hoa-pasteur',
  'overview',
  'ru',
  NULL,
  '## Почему стоит зайти?

- 🍜 Классический сайгонский фо  
- ⏳ Традиционный рецепт без изменений  
- 💸 Очень недорого

## Коммуникация & сервис

- 🗣 Минимальный английский  
- 💵 Наличные  
- 🪑 Простая посадка

## Локальная ценность

Phở Hòa — эталон сайгонского фо, проверенный временем.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();
