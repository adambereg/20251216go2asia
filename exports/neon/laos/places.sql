-- Places UPSERT (idempotent)
-- Generated from Atlas Content Canon v1 markdown files

-- Place: 🛕 Pha That Luang (Vientiane)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'vte-pha-that-luang',
  'la',
  'vte',
  '🛕 Pha That Luang',
  'vte-pha-that-luang',
  'stupa',
  'showplace',
  'stupa',
  '["stupa","national-symbol","buddhism"]'::jsonb,
  'Главный национальный символ Лаоса — золотая ступа, олицетворяющая буддизм, независимость и культурную идентичность страны.',
  17.9757,
  102.6331,
  'That Luang, Vientiane',
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

-- Place: 🏛️ Patuxai (Vientiane)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'vte-patuxai',
  'la',
  'vte',
  '🏛️ Patuxai',
  'vte-patuxai',
  'monument',
  'showplace',
  'monument',
  '["monument","viewpoint","history"]'::jsonb,
  'Монумент победы в центре Вьентьяна, напоминающий Триумфальную арку, с панорамным видом на город.',
  17.974,
  102.6337,
  'Patuxai Park, Vientiane',
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

-- Place: 🛕 Wat Si Saket (Vientiane)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'vte-wat-si-saket',
  'la',
  'vte',
  '🛕 Wat Si Saket',
  'vte-wat-si-saket',
  'temple',
  'showplace',
  'temple',
  '["temple","heritage","buddhism"]'::jsonb,
  'Старейший сохранившийся храм Вьентьяна, известный тысячами маленьких статуй Будды в нишах стен.',
  17.969,
  102.614,
  'Ave Lane Xang, Vientiane',
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

-- Place: 🏥 COPE Visitor Centre (Vientiane)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'vte-cope-visitor-centre',
  'la',
  'vte',
  '🏥 COPE Visitor Centre',
  'vte-cope-visitor-centre',
  'museum',
  'showplace',
  'museum',
  '["museum","social","history"]'::jsonb,
  'Образовательный центр, посвящённый проблеме неразорвавшихся боеприпасов и реабилитации пострадавших.',
  17.9654,
  102.6046,
  'COPE Centre, Vientiane',
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

-- Place: 🗿 Buddha Park (Vientiane)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'vte-buddha-park',
  'la',
  'vte',
  '🗿 Buddha Park',
  'vte-buddha-park',
  'sculpture',
  'showplace',
  'sculpture',
  '["sculpture","park","art"]'::jsonb,
  'Парк необычных скульптур Будды и индуистских божеств на берегу Меконга.',
  17.9005,
  102.7856,
  'Xieng Khuan, Vientiane',
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

-- Place: 🌊 Mekong Riverside Promenade (Vientiane)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'vte-mekong-riverside-promenade',
  'la',
  'vte',
  '🌊 Mekong Riverside Promenade',
  'vte-mekong-riverside-promenade',
  'river',
  'showplace',
  'river',
  '["river","promenade","sunset"]'::jsonb,
  'Набережная Меконга — популярное место прогулок, рынков и закатов.',
  17.9667,
  102.6078,
  'Mekong Riverside, Vientiane',
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

-- Place: 🍽️ Kualao Restaurant (Vientiane)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'vte-kualao-restaurant',
  'la',
  'vte',
  '🍽️ Kualao Restaurant',
  'vte-kualao-restaurant',
  'lao-food',
  'business',
  'lao-food',
  '["lao-food","heritage","restaurant"]'::jsonb,
  'Классический ресторан лаосской кухни в центре Вьентьяна, популярный среди дипломатов и гостей города.',
  17.9688,
  102.6063,
  'Vientiane Centre',
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

-- Place: 🍽️ Makphet Restaurant (Vientiane)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'vte-makphet-restaurant',
  'la',
  'vte',
  '🍽️ Makphet Restaurant',
  'vte-makphet-restaurant',
  'social',
  'business',
  'social',
  '["social","restaurant","local"]'::jsonb,
  'Социальный ресторан, поддерживающий обучение и трудоустройство молодёжи Лаоса.',
  17.9659,
  102.607,
  'Near Mekong, Vientiane',
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

-- Place: 🌃 Bor Pen Nyang Rooftop (Vientiane)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'vte-bor-pen-nyang-rooftop',
  'la',
  'vte',
  '🌃 Bor Pen Nyang Rooftop',
  'vte-bor-pen-nyang-rooftop',
  'rooftop',
  'business',
  'rooftop',
  '["rooftop","bar","river"]'::jsonb,
  'Ресторан и бар на крыше с видом на Меконг, живой музыкой и расслабленной атмосферой вечернего Вьентьяна.',
  17.9684,
  102.6072,
  'Mekong Riverside, Vientiane',
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

-- Place: 🍛 Taj Mahal Restaurant (Vientiane)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'vte-taj-mahal-restaurant',
  'la',
  'vte',
  '🍛 Taj Mahal Restaurant',
  'vte-taj-mahal-restaurant',
  'indian-food',
  'business',
  'indian-food',
  '["indian-food","restaurant","expat"]'::jsonb,
  'Индийский ресторан в центре Вьентьяна, популярный среди путешественников и экспатов.',
  17.9695,
  102.6069,
  'Vientiane',
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

-- Place: 🥐 Scandinavian Bakery (Vientiane)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'vte-scandinavian-bakery',
  'la',
  'vte',
  '🥐 Scandinavian Bakery',
  'vte-scandinavian-bakery',
  'cafe',
  'business',
  'cafe',
  '["cafe","bakery","breakfast"]'::jsonb,
  'Популярная пекарня и кафе с завтраками, кофе и европейской выпечкой.',
  17.9702,
  102.6058,
  'Vientiane',
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

-- Place: 🍢 Ban Anou Night Market Food Court (Vientiane)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'vte-ban-anou-night-market-food-court',
  'la',
  'vte',
  '🍢 Ban Anou Night Market Food Court',
  'vte-ban-anou-night-market-food-court',
  'street-food',
  'business',
  'street-food',
  '["street-food","market","local"]'::jsonb,
  'Ночной фудкорт с уличной едой, популярный среди местных жителей.',
  17.9681,
  102.606,
  'Ban Anou, Vientiane',
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

-- Place: 💦 Blue Lagoon 1 (Vang Vieng)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'vvg-blue-lagoon-1',
  'la',
  'vvg',
  '💦 Blue Lagoon 1',
  'vvg-blue-lagoon-1',
  'lagoon',
  'showplace',
  'lagoon',
  '["lagoon","nature","swimming"]'::jsonb,
  'Самая популярная природная лагуна Вангвьенга с бирюзовой водой, тарзанками и известняковыми скалами.',
  18.9442,
  102.4395,
  'Blue Lagoon Area, Vang Vieng',
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

-- Place: 🕳️ Tham Chang Cave (Vang Vieng)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'vvg-tham-chang-cave',
  'la',
  'vvg',
  '🕳️ Tham Chang Cave',
  'vvg-tham-chang-cave',
  'cave',
  'showplace',
  'cave',
  '["cave","viewpoint","nature"]'::jsonb,
  'Известная пещера с обзорной площадкой и видом на долину реки Нам Сонг.',
  18.9375,
  102.4493,
  'Tham Chang, Vang Vieng',
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

-- Place: 🛟 Nam Song River Tubing (Vang Vieng)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'vvg-nam-song-river-tubing',
  'la',
  'vvg',
  '🛟 Nam Song River Tubing',
  'vvg-nam-song-river-tubing',
  'tubing',
  'showplace',
  'tubing',
  '["tubing","river","adventure"]'::jsonb,
  'Сплав по реке Нам Сонг на тюбингах — культовое развлечение Вангвьенга.',
  18.9287,
  102.4471,
  'Nam Song River',
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

-- Place: 🔭 Pha Ngern Viewpoint (Vang Vieng)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'vvg-pha-ngern-viewpoint',
  'la',
  'vvg',
  '🔭 Pha Ngern Viewpoint',
  'vvg-pha-ngern-viewpoint',
  'viewpoint',
  'showplace',
  'viewpoint',
  '["viewpoint","hiking","karst"]'::jsonb,
  'Смотровая площадка с панорамным видом на карстовые горы и долину Вангвьенга.',
  18.9468,
  102.4512,
  'Pha Ngern, Vang Vieng',
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

-- Place: 🕳️ Tham Phu Kham Cave (Vang Vieng)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'vvg-tham-phu-kham-cave',
  'la',
  'vvg',
  '🕳️ Tham Phu Kham Cave',
  'vvg-tham-phu-kham-cave',
  'cave',
  'showplace',
  'cave',
  '["cave","lagoon","buddhism"]'::jsonb,
  'Пещера с голубой лагуной у входа и статуей Будды внутри.',
  18.9479,
  102.4368,
  'Tham Phu Kham, Vang Vieng',
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

-- Place: 🌅 Sunset Point Nam Song (Vang Vieng)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'vvg-sunset-point-nam-song',
  'la',
  'vvg',
  '🌅 Sunset Point Nam Song',
  'vvg-sunset-point-nam-song',
  'sunset',
  'showplace',
  'sunset',
  '["sunset","river","landscape"]'::jsonb,
  'Популярная точка для наблюдения заката над рекой Нам Сонг и горами.',
  18.9315,
  102.4478,
  'Nam Song Riverside',
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

-- Place: 🍵 Organic Mulberry Farm & Café (Vang Vieng)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'vvg-organic-mulberry-farm-cafe',
  'la',
  'vvg',
  '🍵 Organic Mulberry Farm & Café',
  'vvg-organic-mulberry-farm-cafe',
  'cafe',
  'business',
  'cafe',
  '["cafe","organic","local"]'::jsonb,
  'Ферма и кафе с органическими продуктами, известная шёлком и видами на горы.',
  18.946,
  102.4452,
  'Near Vang Vieng',
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

-- Place: 🍹 Smile Beach Bar (Vang Vieng)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'vvg-smile-beach-bar',
  'la',
  'vvg',
  '🍹 Smile Beach Bar',
  'vvg-smile-beach-bar',
  'bar',
  'business',
  'bar',
  '["bar","river","sunset"]'::jsonb,
  'Популярный бар у реки с лежаками, коктейлями и закатами.',
  18.9312,
  102.4473,
  'Riverside, Vang Vieng',
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

-- Place: 🍺 Gary’s Irish Bar (Vang Vieng)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'vvg-gary-s-irish-bar',
  'la',
  'vvg',
  '🍺 Gary’s Irish Bar',
  'vvg-gary-s-irish-bar',
  'bar',
  'business',
  'bar',
  '["bar","pub","nightlife"]'::jsonb,
  'Бар с европейской и лаосской кухней, популярный среди путешественников.',
  18.9319,
  102.4481,
  'Vang Vieng',
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

-- Place: ☕ Café de Vang Vieng (Vang Vieng)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'vvg-cafe-de-vang-vieng',
  'la',
  'vvg',
  '☕ Café de Vang Vieng',
  'vvg-cafe-de-vang-vieng',
  'cafe',
  'business',
  'cafe',
  '["cafe","breakfast","coffee"]'::jsonb,
  'Кафе с завтраками и кофе, популярное среди путешественников благодаря виду на карстовые горы.',
  18.9328,
  102.4486,
  'Vang Vieng',
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

-- Place: 🍹 Kangaroo Sunset Bar (Vang Vieng)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'vvg-kangaroo-sunset-bar',
  'la',
  'vvg',
  '🍹 Kangaroo Sunset Bar',
  'vvg-kangaroo-sunset-bar',
  'bar',
  'business',
  'bar',
  '["bar","river","sunset"]'::jsonb,
  'Расслабленный бар у реки с лежаками и закатами, популярный у путешественников.',
  18.9307,
  102.4476,
  'Riverside, Vang Vieng',
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

-- Place: 🍽️ Peeping Som’s Bar & Restaurant (Vang Vieng)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'vvg-peeping-som-s-bar-restaurant',
  'la',
  'vvg',
  '🍽️ Peeping Som’s Bar & Restaurant',
  'vvg-peeping-som-s-bar-restaurant',
  'restaurant',
  'business',
  'restaurant',
  '["restaurant","bar","river"]'::jsonb,
  'Ресторан и бар с видом на реку, известный коктейлями и вечерней атмосферой.',
  18.9322,
  102.4489,
  'Riverside, Vang Vieng',
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

-- Place: 🎶 Sakura Bar (Vang Vieng)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'vvg-sakura-bar',
  'la',
  'vvg',
  '🎶 Sakura Bar',
  'vvg-sakura-bar',
  'nightlife',
  'business',
  'nightlife',
  '["nightlife","bar","party"]'::jsonb,
  'Один из самых известных ночных баров Вангвьенга с танцами и поздними вечеринками.',
  18.932,
  102.4474,
  'Vang Vieng',
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

-- Place: 🛕 Wat Xieng Thong (Luang Prabang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lpq-wat-xieng-thong',
  'la',
  'lpq',
  '🛕 Wat Xieng Thong',
  'lpq-wat-xieng-thong',
  'temple',
  'showplace',
  'temple',
  '["temple","unesco","heritage"]'::jsonb,
  'Главный храм Луангпхабанга и один из важнейших буддийских храмов Лаоса, символ королевской и религиозной истории страны.',
  19.8925,
  102.1353,
  'Khem Khong, Luang Prabang',
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

-- Place: 🌄 Mount Phousi (Luang Prabang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lpq-mount-phousi',
  'la',
  'lpq',
  '🌄 Mount Phousi',
  'lpq-mount-phousi',
  'viewpoint',
  'showplace',
  'viewpoint',
  '["viewpoint","sunset","city"]'::jsonb,
  'Священный холм в центре Луангпхабанга с панорамным видом на город и реки Меконг и Нам Хан.',
  19.8856,
  102.1344,
  'Sisavangvong Rd',
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

-- Place: 💦 Kuang Si Falls (Luang Prabang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lpq-kuang-si-falls',
  'la',
  'lpq',
  '💦 Kuang Si Falls',
  'lpq-kuang-si-falls',
  'waterfall',
  'showplace',
  'waterfall',
  '["waterfall","nature","eco"]'::jsonb,
  'Многоуровневые водопады с бирюзовыми бассейнами — одна из самых известных природных достопримечательностей Лаоса.',
  19.7497,
  101.9977,
  'Kuang Si Waterfall Park',
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

-- Place: 🏛️ Royal Palace Museum (Luang Prabang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lpq-royal-palace-museum',
  'la',
  'lpq',
  '🏛️ Royal Palace Museum',
  'lpq-royal-palace-museum',
  'museum',
  'showplace',
  'museum',
  '["museum","palace","heritage"]'::jsonb,
  'Бывший королевский дворец Луангпхабанга, превращённый в национальный музей, рассказывающий историю лаосской монархии.',
  19.8869,
  102.1346,
  'Sisavangvong Rd, Luang Prabang',
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

-- Place: 🧘 Alms Giving Ceremony (Luang Prabang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lpq-alms-giving-ceremony',
  'la',
  'lpq',
  '🧘 Alms Giving Ceremony',
  'lpq-alms-giving-ceremony',
  'ritual',
  'showplace',
  'ritual',
  '["ritual","buddhism","culture"]'::jsonb,
  'Ежедневный утренний ритуал подаяния монахам — одна из самых известных духовных традиций Луангпхабанга.',
  19.886,
  102.133,
  'Old Town streets',
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

-- Place: 🕳️ Pak Ou Caves (Luang Prabang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lpq-pak-ou-caves',
  'la',
  'lpq',
  '🕳️ Pak Ou Caves',
  'lpq-pak-ou-caves',
  'caves',
  'showplace',
  'caves',
  '["caves","buddhism","river"]'::jsonb,
  'Священные пещеры с тысячами статуэток Будды, расположенные у слияния рек Меконг и Нам Оу.',
  20.0477,
  102.2347,
  'Pak Ou, Luang Prabang Province',
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

-- Place: 🌃 Night Market (Luang Prabang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lpq-night-market',
  'la',
  'lpq',
  '🌃 Night Market',
  'lpq-night-market',
  'market',
  'showplace',
  'market',
  '["market","shopping","evening"]'::jsonb,
  'Вечерний рынок в центре города с ремёслами, сувенирами и уличной едой.',
  19.8852,
  102.1338,
  'Night Market Street',
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

-- Place: 🍽️ Tamarind Restaurant (Luang Prabang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lpq-tamarind-restaurant',
  'la',
  'lpq',
  '🍽️ Tamarind Restaurant',
  'lpq-tamarind-restaurant',
  'lao-food',
  'business',
  'lao-food',
  '["lao-food","local","restaurant"]'::jsonb,
  'Ресторан лаосской кухни, специализирующийся на традиционных блюдах и дегустационных сетах.',
  19.8874,
  102.1336,
  'Luang Prabang Old Town',
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

-- Place: 🍹 Utopia Bar (Luang Prabang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lpq-utopia-bar',
  'la',
  'lpq',
  '🍹 Utopia Bar',
  'lpq-utopia-bar',
  'bar',
  'business',
  'bar',
  '["bar","river","sunset"]'::jsonb,
  'Популярный бар на берегу Меконга с расслабленной атмосферой и закатами.',
  19.8869,
  102.1322,
  'Mekong Riverside',
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

-- Place: 🍜 Dyen Sabai Restaurant (Luang Prabang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lpq-dyen-sabai-restaurant',
  'la',
  'lpq',
  '🍜 Dyen Sabai Restaurant',
  'lpq-dyen-sabai-restaurant',
  'restaurant',
  'business',
  'restaurant',
  '["restaurant","river","local"]'::jsonb,
  'Ресторан лаосской и тайской кухни на берегу реки Нам Хан, известный расслабленной атмосферой.',
  19.8851,
  102.1307,
  'Nam Khan River',
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

-- Place: 🍷 Manda de Laos (Luang Prabang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lpq-manda-de-laos',
  'la',
  'lpq',
  '🍷 Manda de Laos',
  'lpq-manda-de-laos',
  'fine-dining',
  'business',
  'fine-dining',
  '["fine-dining","lao-food","premium"]'::jsonb,
  'Ресторан высокой лаосской кухни у пруда с лотосами в центре Луангпхабанга.',
  19.8886,
  102.134,
  'Old Town, Luang Prabang',
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

-- Place: ☕ Joma Bakery Café (Luang Prabang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lpq-joma-bakery-cafe',
  'la',
  'lpq',
  '☕ Joma Bakery Café',
  'lpq-joma-bakery-cafe',
  'cafe',
  'business',
  'cafe',
  '["cafe","breakfast","coffee"]'::jsonb,
  'Популярное кафе-пекарня с завтраками, кофе и выпечкой, любимое путешественниками.',
  19.8867,
  102.1339,
  'Old Town, Luang Prabang',
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

-- Place: 🍽️ Bouang Asian Eatery (Luang Prabang)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lpq-bouang-asian-eatery',
  'la',
  'lpq',
  '🍽️ Bouang Asian Eatery',
  'lpq-bouang-asian-eatery',
  'restaurant',
  'business',
  'restaurant',
  '["restaurant","asian","river"]'::jsonb,
  'Современное азиатское бистро с лаосским акцентом и видом на Меконг.',
  19.8879,
  102.1328,
  'Mekong Riverside',
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

-- Place: 🛕 Wat Phou (Pakse)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'pkz-wat-phou',
  'la',
  'pkz',
  '🛕 Wat Phou',
  'pkz-wat-phou',
  'unesco',
  'showplace',
  'unesco',
  '["unesco","temple","khmer"]'::jsonb,
  'Древний кхмерский храмовый комплекс, включённый в список UNESCO, расположенный у подножия горы недалеко от Паксе.',
  14.81,
  106.82,
  'Champasak Province',
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

-- Place: 🌲 Bolaven Plateau (Pakse)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'pkz-bolaven-plateau',
  'la',
  'pkz',
  '🌲 Bolaven Plateau',
  'pkz-bolaven-plateau',
  'nature',
  'showplace',
  'nature',
  '["nature","waterfalls","coffee"]'::jsonb,
  'Высокогорное плато, известное водопадами, кофейными плантациями и прохладным климатом.',
  15.02,
  106.3,
  'Bolaven Plateau',
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

-- Place: 💦 Tad Fane Waterfall (Pakse)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'pkz-tad-fane-waterfall',
  'la',
  'pkz',
  '💦 Tad Fane Waterfall',
  'pkz-tad-fane-waterfall',
  'waterfall',
  'showplace',
  'waterfall',
  '["waterfall","nature","canyon"]'::jsonb,
  'Двойной водопад высотой более 120 метров — один из самых впечатляющих на плато Болавен.',
  15.1216,
  106.3297,
  'Bolaven Plateau',
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

-- Place: 🏘 Champasak Town (Pakse)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'pkz-champasak-town',
  'la',
  'pkz',
  '🏘 Champasak Town',
  'pkz-champasak-town',
  'town',
  'showplace',
  'town',
  '["town","river","culture"]'::jsonb,
  'Спокойный городок у Меконга с колониальной атмосферой и видом на храмовый комплекс Wat Phou.',
  14.8935,
  105.8667,
  'Champasak',
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

-- Place: 🌊 Mekong Riverside Pakse (Pakse)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'pkz-mekong-riverside-pakse',
  'la',
  'pkz',
  '🌊 Mekong Riverside Pakse',
  'pkz-mekong-riverside-pakse',
  'river',
  'showplace',
  'river',
  '["river","promenade","sunset"]'::jsonb,
  'Набережная Паксе — место прогулок, рынков и вечерней жизни у Меконга.',
  15.12,
  105.82,
  'Pakse Riverside',
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

-- Place: 💦 Tad Yuang Waterfall (Pakse)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'pkz-tad-yuang-waterfall',
  'la',
  'pkz',
  '💦 Tad Yuang Waterfall',
  'pkz-tad-yuang-waterfall',
  'waterfall',
  'showplace',
  'waterfall',
  '["waterfall","swimming","nature"]'::jsonb,
  'Мощный водопад с возможностью купания у подножия, популярный среди местных.',
  15.119,
  106.3379,
  'Bolaven Plateau',
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

-- Place: ☕ Daolin Restaurant & Café (Pakse)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'pkz-daolin-restaurant-cafe',
  'la',
  'pkz',
  '☕ Daolin Restaurant & Café',
  'pkz-daolin-restaurant-cafe',
  'cafe',
  'business',
  'cafe',
  '["cafe","restaurant","local"]'::jsonb,
  'Ресторан и кафе с лаосской и международной кухней, популярный у путешественников.',
  15.1209,
  105.8175,
  'Pakse',
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

-- Place: 🍷 Le Panorama Restaurant (Pakse)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'pkz-le-panorama-restaurant',
  'la',
  'pkz',
  '🍷 Le Panorama Restaurant',
  'pkz-le-panorama-restaurant',
  'french',
  'business',
  'french',
  '["french","river-view","restaurant"]'::jsonb,
  'Ресторан с видом на Меконг, предлагающий лаосскую и французскую кухню.',
  15.1202,
  105.8201,
  'Pakse Riverside',
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

-- Place: ☕ Sinouk Coffee Pakse (Pakse)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'pkz-sinouk-coffee-pakse',
  'la',
  'pkz',
  '☕ Sinouk Coffee Pakse',
  'pkz-sinouk-coffee-pakse',
  'coffee',
  'business',
  'coffee',
  '["coffee","cafe","local"]'::jsonb,
  'Кофейня известного лаосского бренда с кофе с плато Болавен.',
  15.1217,
  105.8179,
  'Pakse',
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

-- Place: ⛪ St. Teresa’s Catholic Church (Savannakhet)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'svk-st-teresa-s-catholic-church',
  'la',
  'svk',
  '⛪ St. Teresa’s Catholic Church',
  'svk-st-teresa-s-catholic-church',
  'church',
  'showplace',
  'church',
  '["church","colonial","heritage"]'::jsonb,
  'Католический собор в колониальном стиле — один из самых узнаваемых исторических объектов Саваннакхета.',
  16.5546,
  104.7474,
  'Savannakhet Old Town',
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

-- Place: 🏘 Savannakhet Old Town (Savannakhet)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'svk-savannakhet-old-town',
  'la',
  'svk',
  '🏘 Savannakhet Old Town',
  'svk-savannakhet-old-town',
  'old-town',
  'showplace',
  'old-town',
  '["old-town","colonial","walking"]'::jsonb,
  'Колониальный квартал с французскими зданиями, широкими улицами и спокойной атмосферой Меконга.',
  16.5555,
  104.747,
  'Savannakhet Riverside',
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

-- Place: 🦴 Dinosaur Museum (Savannakhet)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'svk-dinosaur-museum',
  'la',
  'svk',
  '🦴 Dinosaur Museum',
  'svk-dinosaur-museum',
  'museum',
  'showplace',
  'museum',
  '["museum","education","dinosaur"]'::jsonb,
  'Небольшой музей с экспозицией о находках динозавров и палеонтологии региона.',
  16.5538,
  104.7462,
  'Savannakhet Town Center',
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

-- Place: 🌊 Mekong Riverside Promenade (Savannakhet)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'svk-mekong-riverside-promenade',
  'la',
  'svk',
  '🌊 Mekong Riverside Promenade',
  'svk-mekong-riverside-promenade',
  'river',
  'showplace',
  'river',
  '["river","promenade","sunset"]'::jsonb,
  'Набережная Меконга — место вечерних прогулок, локальной еды и закатов.',
  16.5568,
  104.746,
  'Mekong Riverside, Savannakhet',
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

-- Place: 🛕 That Ing Hang Stupa (Savannakhet)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'svk-that-ing-hang-stupa',
  'la',
  'svk',
  '🛕 That Ing Hang Stupa',
  'svk-that-ing-hang-stupa',
  'stupa',
  'showplace',
  'stupa',
  '["stupa","buddhism","heritage"]'::jsonb,
  'Одна из важнейших ступ юга Лаоса, место паломничества недалеко от Саваннакхета.',
  16.615,
  104.761,
  'That Ing Hang, Savannakhet Province',
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

-- Place: 🏛 Savannakhet City Museum (Savannakhet)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'svk-savannakhet-city-museum',
  'la',
  'svk',
  '🏛 Savannakhet City Museum',
  'svk-savannakhet-city-museum',
  'museum',
  'showplace',
  'museum',
  '["museum","history","culture"]'::jsonb,
  'Небольшой городской музей, посвящённый истории провинции и культуре южного Лаоса.',
  16.5551,
  104.7478,
  'Savannakhet Old Town',
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

-- Place: ☕ Cafe Inn (Savannakhet)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'svk-cafe-inn',
  'la',
  'svk',
  '☕ Cafe Inn',
  'svk-cafe-inn',
  'cafe',
  'business',
  'cafe',
  '["cafe","breakfast","coffee"]'::jsonb,
  'Уютное кафе в колониальном квартале с завтраками, кофе и простыми блюдами.',
  16.555,
  104.7484,
  'Savannakhet Old Town',
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

-- Place: ☕ Lin’s Café (Savannakhet)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'svk-lin-s-cafe',
  'la',
  'svk',
  '☕ Lin’s Café',
  'svk-lin-s-cafe',
  'cafe',
  'business',
  'cafe',
  '["cafe","local-food","casual"]'::jsonb,
  'Кафе с лаосской и международной кухней, популярное среди путешественников.',
  16.5542,
  104.7479,
  'Savannakhet',
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

-- Place: 🍽 Daosavanh Restaurant (Savannakhet)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'svk-daosavanh-restaurant',
  'la',
  'svk',
  '🍽 Daosavanh Restaurant',
  'svk-daosavanh-restaurant',
  'lao-food',
  'business',
  'lao-food',
  '["lao-food","restaurant","local"]'::jsonb,
  'Ресторан с лаосской кухней, подходящий для спокойного ужина.',
  16.5558,
  104.7481,
  'Savannakhet',
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

-- Place: ☕ Sinouk Coffee Savannakhet (Savannakhet)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'svk-sinouk-coffee-savannakhet',
  'la',
  'svk',
  '☕ Sinouk Coffee Savannakhet',
  'svk-sinouk-coffee-savannakhet',
  'coffee',
  'business',
  'coffee',
  '["coffee","cafe","local"]'::jsonb,
  'Кофейня лаосского бренда с качественным кофе и выпечкой.',
  16.5553,
  104.7486,
  'Savannakhet',
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

-- Place: 🍢 Mekong Riverside Food Stalls (Savannakhet)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'svk-mekong-riverside-food-stalls',
  'la',
  'svk',
  '🍢 Mekong Riverside Food Stalls',
  'svk-mekong-riverside-food-stalls',
  'street-food',
  'business',
  'street-food',
  '["street-food","market","river"]'::jsonb,
  'Небольшие киоски и точки уличной еды на набережной Меконга вечером.',
  16.5568,
  104.746,
  'Mekong Riverside, Savannakhet',
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
