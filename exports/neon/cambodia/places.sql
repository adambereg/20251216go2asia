-- Places UPSERT (idempotent)
-- Generated from Atlas Content Canon v1 markdown files

-- Place: 🏛️ Angkor Wat (Siem Reap)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'rep-angkor-wat',
  'kh',
  'rep',
  '🏛️ Angkor Wat',
  'rep-angkor-wat',
  'unesco',
  'showplace',
  'unesco',
  '["unesco","temple","heritage","angkor"]'::jsonb,
  'Крупнейший храмовый комплекс в мире и главный символ Камбоджи, отражающий вершину кхмерской архитектуры и духовной традиции.',
  13.4125,
  103.867,
  'Angkor Archaeological Park, Siem Reap',
  'https://www.angkorenterprise.gov.kh',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🏛️ Bayon (Siem Reap)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'rep-bayon',
  'kh',
  'rep',
  '🏛️ Bayon',
  'rep-bayon',
  'temple',
  'showplace',
  'temple',
  '["temple","angkor","faces","heritage"]'::jsonb,
  'Храм с сотнями каменных лиц, символизирующих божественную власть и мистическую сущность Ангкорской империи.',
  13.4413,
  103.859,
  'Angkor Thom, Siem Reap',
  'https://www.angkorenterprise.gov.kh',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🏛️ Ta Prohm (Siem Reap)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'rep-ta-prohm',
  'kh',
  'rep',
  '🏛️ Ta Prohm',
  'rep-ta-prohm',
  'temple',
  'showplace',
  'temple',
  '["temple","jungle","angkor","roots"]'::jsonb,
  'Храмовый комплекс, намеренно оставленный во власти джунглей, где природа и архитектура слились в единое целое.',
  13.4348,
  103.8891,
  'Angkor Archaeological Park, Siem Reap',
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

-- Place: 🏛️ Banteay Srei (Siem Reap)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'rep-banteay-srei',
  'kh',
  'rep',
  '🏛️ Banteay Srei',
  'rep-banteay-srei',
  'temple',
  'showplace',
  'temple',
  '["temple","sculpture","heritage","sandstone"]'::jsonb,
  '«Цитадель женщин» — миниатюрный, но невероятно детализированный храм из красного песчаника, посвящённый Шиве.',
  13.5387,
  103.808,
  'Banteay Srei, Siem Reap Province',
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

-- Place: 🏛️ Preah Khan (Siem Reap)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'rep-preah-khan',
  'kh',
  'rep',
  '🏛️ Preah Khan',
  'rep-preah-khan',
  'temple',
  'showplace',
  'temple',
  '["temple","angkor","monastic","heritage"]'::jsonb,
  'Огромный монастырский комплекс времён Джаявармана VII, сочетающий буддизм и индуизм.',
  13.47,
  103.895,
  'Angkor Archaeological Park, Siem Reap',
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

-- Place: 🏞️ Phnom Kulen National Park (Siem Reap)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'rep-phnom-kulen-national-park',
  'kh',
  'rep',
  '🏞️ Phnom Kulen National Park',
  'rep-phnom-kulen-national-park',
  'nature',
  'showplace',
  'nature',
  '["nature","sacred","waterfall","heritage"]'::jsonb,
  'Священная гора — источник реки Сиемреап и место основания Ангкорской империи.',
  13.4667,
  104.0833,
  'Phnom Kulen National Park, Siem Reap Province',
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

-- Place: 🌃 Pub Street (Siem Reap)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'rep-pub-street',
  'kh',
  'rep',
  '🌃 Pub Street',
  'rep-pub-street',
  'nightlife',
  'showplace',
  'nightlife',
  '["nightlife","streetfood","citylife"]'::jsonb,
  'Центр ночной жизни Сиемреапа — улица с барами, ресторанами и уличной едой.',
  13.3625,
  103.8597,
  'Pub Street, Siem Reap',
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

-- Place: 🎭 Phare Circus (Siem Reap)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'rep-phare-circus',
  'kh',
  'rep',
  '🎭 Phare Circus',
  'rep-phare-circus',
  'circus',
  'business',
  'circus',
  '["circus","culture","social","performance"]'::jsonb,
  'Профессиональный цирк, созданный выпускниками социального проекта для детей-сирот.',
  13.358,
  103.855,
  'Phare Circus, Siem Reap',
  'https://www.pharecircus.org',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🍽️ Malis Restaurant (Phnom Penh)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'pnh-malis-restaurant',
  'kh',
  'pnh',
  '🍽️ Malis Restaurant',
  'pnh-malis-restaurant',
  'restaurant',
  'business',
  'restaurant',
  '["restaurant","khmer","fine-dining"]'::jsonb,
  'Флагман современной камбоджийской кухни в элегантной колониальной обстановке.',
  11.558,
  104.922,
  '#35 Sothearos Blvd, Phnom Penh',
  'https://www.malis.com.kh',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🏯 Wat Phnom (Phnom Penh)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'pnh-wat-phnom',
  'kh',
  'pnh',
  '🏯 Wat Phnom',
  'pnh-wat-phnom',
  'temple',
  'showplace',
  'temple',
  '["temple","history","city-symbol"]'::jsonb,
  'Исторический буддийский храм на холме — легендарное место основания Пномпеня.',
  11.572,
  104.912,
  'Wat Phnom, Phnom Penh',
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

-- Place: 🗿 Independence Monument (Phnom Penh)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'pnh-independence-monument',
  'kh',
  'pnh',
  '🗿 Independence Monument',
  'pnh-independence-monument',
  'monument',
  'showplace',
  'monument',
  '["monument","history","independence"]'::jsonb,
  'Монумент независимости Камбоджи от Франции, расположенный на пересечении главных проспектов.',
  11.562,
  104.916,
  'Intersection of Norodom & Sihanouk Blvd, Phnom Penh',
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

-- Place: ⚰️ Cheung Ek Killing Fields (Phnom Penh)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'pnh-cheung-ek-killing-fields',
  'kh',
  'pnh',
  '⚰️ Cheung Ek Killing Fields',
  'pnh-cheung-ek-killing-fields',
  'memorial',
  'showplace',
  'memorial',
  '["memorial","history","genocide","education"]'::jsonb,
  'Мемориал жертвам режима Красных кхмеров — одно из самых трагических мест XX века.',
  11.525,
  104.885,
  'Cheung Ek, Dangkao District, Phnom Penh',
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

-- Place: ☕ FCC Phnom Penh (Phnom Penh)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'pnh-fcc-phnom-penh',
  'kh',
  'pnh',
  '☕ FCC Phnom Penh',
  'pnh-fcc-phnom-penh',
  'cafe',
  'business',
  'cafe',
  '["cafe","riverside","historic","journalism"]'::jsonb,
  'Легендарный клуб журналистов с террасой над рекой и видом на королевский дворец.',
  11.56,
  104.919,
  '29-31 Sisowath Quay, Phnom Penh',
  'https://fccphnompenh.com',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🍽️ Romdeng Restaurant (Phnom Penh)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'pnh-romdeng-restaurant',
  'kh',
  'pnh',
  '🍽️ Romdeng Restaurant',
  'pnh-romdeng-restaurant',
  'restaurant',
  'business',
  'restaurant',
  '["restaurant","social","khmer","training"]'::jsonb,
  'Образовательный ресторан, где готовят молодые люди из уязвимых слоёв общества.',
  11.556,
  104.92,
  '#255 Sisowath Quay, Phnom Penh',
  'https://treefriendscambodia.org',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🍽️ Topaz Restaurant (Phnom Penh)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'pnh-topaz-restaurant',
  'kh',
  'pnh',
  '🍽️ Topaz Restaurant',
  'pnh-topaz-restaurant',
  'fine-dining',
  'business',
  'fine-dining',
  '["fine-dining","french-khmer","upscale"]'::jsonb,
  'Элитный ресторан франко-камбоджийской кухни в колониальном особняке.',
  11.559,
  104.921,
  '#227 Norodom Blvd, Phnom Penh',
  'https://topaz-restaurant.com',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: ☕ Brown Coffee (Phnom Penh)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'pnh-brown-coffee',
  'kh',
  'pnh',
  '☕ Brown Coffee',
  'pnh-brown-coffee',
  'coffee',
  'business',
  'coffee',
  '["coffee","cafe","coworking","local-brand"]'::jsonb,
  'Самая популярная кофейня Камбоджи с современным интерьером и качественным кофе.',
  11.555,
  104.918,
  '#247 Sisowath Quay, Phnom Penh',
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

-- Place: 🚂 Bamboo Train (Battambang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'bat-bamboo-train',
  'kh',
  'bat',
  '🚂 Bamboo Train',
  'bat-bamboo-train',
  'local',
  'showplace',
  'local',
  '["local","transport","culture"]'::jsonb,
  'Самодельная бамбуковая платформа на рельсах — уникальный пример народной изобретательности Камбоджи.',
  13.121,
  103.223,
  'Battambang Province',
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

-- Place: ⛰️ Phnom Sampeau & Bat Cave (Battambang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'bat-phnom-sampeau-bat-cave',
  'kh',
  'bat',
  '⛰️ Phnom Sampeau & Bat Cave',
  'bat-phnom-sampeau-bat-cave',
  'nature',
  'showplace',
  'nature',
  '["nature","cave","sunset","temple"]'::jsonb,
  'Холм с буддийскими храмами и природной пещерой, откуда на закате вылетают тысячи летучих мышей — одно из самых впечатляющих зрелищ Баттамбанга.',
  13.0965,
  103.1935,
  'Phnom Sampeau, Battambang Province',
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

-- Place: ☕ Kinyei Café (Battambang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'bat-kinyei-cafe',
  'kh',
  'bat',
  '☕ Kinyei Café',
  'bat-kinyei-cafe',
  'cafe',
  'business',
  'cafe',
  '["cafe","coffee","expats"]'::jsonb,
  'Одна из лучших кофеен Камбоджи, ставшая культурным и социальным центром Баттамбанга.',
  13.0957,
  103.2031,
  'Battambang City Center',
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

-- Place: 🏛️ Samor Prei Kuk (Kampong Thom)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'kch-samor-prei-kuk',
  'kh',
  'kch',
  '🏛️ Samor Prei Kuk',
  'kch-samor-prei-kuk',
  'unesco',
  'showplace',
  'unesco',
  '["unesco","ancient","temple"]'::jsonb,
  'Древний храмовый комплекс VII века, один из самых ранних центров кхмерской цивилизации, объект ЮНЕСКО.',
  12.764,
  105.017,
  'Kampong Thom Province',
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

-- Place: 🌿 Cardamom Mountains (Koh Kong)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'kra-cardamom-mountains',
  'kh',
  'kra',
  '🌿 Cardamom Mountains',
  'kra-cardamom-mountains',
  'jungle',
  'showplace',
  'jungle',
  '["jungle","ecoturism","trekking"]'::jsonb,
  'Один из самых диких и труднодоступных регионов Юго-Восточной Азии, центр экотуризма и сохранённой тропической природы.',
  11.62,
  103.5,
  'Chi Phat, Koh Kong Province',
  'https://www.chiphatecotourism.org',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 💦 Kbal Chhay Waterfall (Sihanoukville)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'kps-kbal-chhay-waterfall',
  'kh',
  'kps',
  '💦 Kbal Chhay Waterfall',
  'kps-kbal-chhay-waterfall',
  'waterfall',
  'showplace',
  'waterfall',
  '["waterfall","nature"]'::jsonb,
  'Каскадный водопад в джунглях недалеко от Сиануквиля, популярное место отдыха в сезон дождей.',
  10.676,
  103.545,
  'Kbal Chhay, Sihanoukville',
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

-- Place: 🏝️ Koh Rong Island (Sihanoukville)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'kps-koh-rong-island',
  'kh',
  'kps',
  '🏝️ Koh Rong Island',
  'kps-koh-rong-island',
  'island',
  'showplace',
  'island',
  '["island","beach","nature"]'::jsonb,
  'Тропический остров с белоснежными пляжами, прозрачной водой и ночным биолюминесцентным планктоном.',
  10.738,
  103.312,
  'Koh Rong Island, Sihanoukville Province',
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

-- Place: ☕ Otres Beach Cafés & Bars (Sihanoukville)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'kps-otres-beach-cafes-bars',
  'kh',
  'kps',
  '☕ Otres Beach Cafés & Bars',
  'kps-otres-beach-cafes-bars',
  'beach',
  'business',
  'beach',
  '["beach","cafe","bar"]'::jsonb,
  'Пляжные кафе и бары на побережье Отрес — расслабленная альтернатива шумному центру Сиануквиля.',
  10.585,
  103.541,
  'Otres Beach, Sihanoukville',
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

-- Place: 🌿 La Plantation Pepper Farm (Kampot)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'kmp-la-plantation-pepper-farm',
  'kh',
  'kmp',
  '🌿 La Plantation Pepper Farm',
  'kmp-la-plantation-pepper-farm',
  'farm',
  'business',
  'farm',
  '["farm","pepper","gastronomy","ecotourism"]'::jsonb,
  'Одна из самых известных ферм кампотского перца, сочетающая агротуризм, дегустации и гастрономию.',
  10.6815,
  104.0387,
  'Kampot Province',
  'https://www.laplantation.com',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🦀 Crab Market (Kampot)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'kmp-crab-market',
  'kh',
  'kmp',
  '🦀 Crab Market',
  'kmp-crab-market',
  'market',
  'business',
  'market',
  '["market","seafood","local","gastronomy"]'::jsonb,
  'Рынок морепродуктов и ресторанов у моря, знаменитый крабом с кампотским перцем.',
  10.4828,
  104.3195,
  'Kep Crab Market, Kep',
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

-- Place: 🏞️ Kep National Park & Kep Beach (Kampot)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'kmp-kep-national-park-kep-beach',
  'kh',
  'kmp',
  '🏞️ Kep National Park & Kep Beach',
  'kmp-kep-national-park-kep-beach',
  'park',
  'showplace',
  'park',
  '["park","sea","hiking"]'::jsonb,
  'Национальный парк и прибрежная зона, сочетающие джунглевые тропы, смотровые площадки и спокойный пляж.',
  10.482,
  104.305,
  'Kep National Park, Kep',
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
