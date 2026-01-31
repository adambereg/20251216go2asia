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
  'Главный национальный символ Лаоса — золотая ступа, олицетворяющая буддизм, независимость и культурную идентичность страны. - 🕒 08:00–16:00 - 🌐 Лаосский, английский - 📶 Интернет отсутствует - 💳 Наличные',
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
  'Монумент победы в центре Вьентьяна, напоминающий Триумфальную арку, с панорамным видом на город. - 🕒 08:00–17:00 - 🌐 Лаосский, английский - 📶 Связь слабая - 💳 Наличные',
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
  'Старейший сохранившийся храм Вьентьяна, известный тысячами маленьких статуй Будды в нишах стен. - 🕒 08:00–16:00 - 🌐 Лаосский, английский - 📶 Интернет отсутствует - 💳 Наличные',
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
  'Образовательный центр, посвящённый проблеме неразорвавшихся боеприпасов и реабилитации пострадавших. - 🕒 09:00–16:00 - 🌐 Лаосский, английский - 📶 Интернет - 💳 Наличные',
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
  'Парк необычных скульптур Будды и индуистских божеств на берегу Меконга. - 🕒 08:00–17:00 - 🌐 Лаосский, английский - 📶 Связь ограниченная - 💳 Наличные',
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
  'Набережная Меконга — популярное место прогулок, рынков и закатов. - 🕒 Круглосуточно - 🌐 Лаосский, английский - 📶 Интернет стабильный - 💳 Наличные',
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
  'Классический ресторан лаосской кухни в центре Вьентьяна, популярный среди дипломатов и гостей города. - 🕒 11:00–22:00 - 🌐 Лаосский, английский - 📶 Wi-Fi - 💳 Карты, наличные',
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
  'Социальный ресторан, поддерживающий обучение и трудоустройство молодёжи Лаоса. - 🕒 11:30–21:30 - 🌐 Лаосский, английский - 📶 Wi-Fi - 💳 Карты, наличные',
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
  'Ресторан и бар на крыше с видом на Меконг, живой музыкой и расслабленной атмосферой вечернего Вьентьяна. - 🕒 17:00–00:00 - 🌐 Лаосский, английский - 📶 Wi-Fi - 💳 Наличные',
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
  'Индийский ресторан в центре Вьентьяна, популярный среди путешественников и экспатов. - 🕒 11:00–22:00 - 🌐 Английский - 📶 Wi-Fi - 💳 Карты, наличные',
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
  'Популярная пекарня и кафе с завтраками, кофе и европейской выпечкой. - 🕒 07:00–18:00 - 🌐 Английский - 📶 Wi-Fi - 💳 Наличные',
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
  'Ночной фудкорт с уличной едой, популярный среди местных жителей. - 🕒 17:00–22:00 - 🌐 Лаосский - 📶 Связь ограниченная - 💳 Наличные',
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
  'Самая популярная природная лагуна Вангвьенга с бирюзовой водой, тарзанками и известняковыми скалами. - 💦 Купание в лагуне - 🤸 Прыжки с тарзанки - 🌿 Отдых у воды - 🕒 08:00–17:00 - 🌐 Лаосский, базовый английский - 📶 Связь слабая - 💳 Наличные',
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
  'Известная пещера с обзорной площадкой и видом на долину реки Нам Сонг. - 🕳 Осмотр пещеры - 🔭 Смотровую площадку - 🚶 Прогулку по тропе - 🕒 08:00–17:00 - 🌐 Лаосский - 📶 Связь слабая - 💳 Наличные',
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
  'Сплав по реке Нам Сонг на тюбингах — культовое развлечение Вангвьенга. - 🛟 Тюбинг - 🚣 Спокойный сплав - 🍹 Барные остановки (по желанию) - 🕒 Днём - 🌐 Лаосский, английский - 📶 Связь слабая - 💳 Наличные',
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
  'Смотровая площадка с панорамным видом на карстовые горы и долину Вангвьенга. - 🥾 Подъём на вершину - 🔭 Панораму - 🌅 Закат - 🕒 06:00–18:00 - 🌐 Лаосский - 📶 Связь слабая - 💳 Наличные',
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
  'Пещера с голубой лагуной у входа и статуей Будды внутри. - 🕳 Пещеру - 💦 Купание - 🛕 Статую Будды - 🕒 08:00–17:00 - 🌐 Лаосский - 📶 Связь слабая - 💳 Наличные',
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
  'Популярная точка для наблюдения заката над рекой Нам Сонг и горами. - 🌅 Закат - 🚶 Прогулку у реки - 📷 Фотосъёмку - 🕒 Круглосуточно - 🌐 Лаосский - 📶 Связь стабильная - 💳 —',
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
  'Ферма и кафе с органическими продуктами, известная шёлком и видами на горы. - 🍵 Чай из шелковицы - 🍰 Десерты - 🛍 Продукты фермы - 🕒 08:00–17:00 - 🌐 Лаосский, английский - 📶 Wi-Fi - 💳 Наличные',
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
  'Популярный бар у реки с лежаками, коктейлями и закатами. - 🍹 Коктейли - 🛋 Лежаки - 🌅 Закат - 🕒 16:00–23:00 - 🌐 Лаосский, английский - 📶 Wi-Fi - 💳 Наличные',
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
  'Бар с европейской и лаосской кухней, популярный среди путешественников. - 🍺 Пиво - 🍔 Бургеры - 🎶 Музыку - 🕒 12:00–00:00 - 🌐 Английский - 📶 Wi-Fi - 💳 Наличные',
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
  'Кафе с завтраками и кофе, популярное среди путешественников благодаря виду на карстовые горы. - 🍳 Завтраки - ☕ Кофе - 🥐 Выпечку - 🕒 07:00–16:00 - 🌐 Лаосский, английский - 📶 Wi-Fi - 💳 Наличные',
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
  'Расслабленный бар у реки с лежаками и закатами, популярный у путешественников. - 🍹 Коктейли - 🛋 Зоны отдыха - 🌅 Закат - 🕒 16:00–23:00 - 🌐 Лаосский, английский - 📶 Wi-Fi - 💳 Наличные',
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
  'Ресторан и бар с видом на реку, известный коктейлями и вечерней атмосферой. - 🍹 Коктейли - 🍽 Лёгкие блюда - 🌅 Закат - 🕒 15:00–22:30 - 🌐 Лаосский, английский - 📶 Wi-Fi - 💳 Наличные',
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
  'Один из самых известных ночных баров Вангвьенга с танцами и поздними вечеринками. - 🍹 Коктейли - 🎶 Танцы - 🌙 Ночную атмосферу - 🕒 18:00–02:00 - 🌐 Лаосский, английский - 📶 Wi-Fi - 💳 Наличные',
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
  'Главный храм Луангпхабанга и один из важнейших буддийских храмов Лаоса, символ королевской и религиозной истории страны. - 🕒 08:00–17:00 - 🌐 Лаосский, базовый английский - 📶 Интернет ограниченный - 💳 Наличные',
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
  'Священный холм в центре Луангпхабанга с панорамным видом на город и реки Меконг и Нам Хан. - 🕒 05:30–18:30 - 🌐 Лаосский, английский - 📶 Связь слабая - 💳 Наличные',
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
  'Многоуровневые водопады с бирюзовыми бассейнами — одна из самых известных природных достопримечательностей Лаоса. - 🕒 08:00–17:30 - 🌐 Лаосский, английский - 📶 Связь слабая - 💳 Наличные',
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
  'Бывший королевский дворец Луангпхабанга, превращённый в национальный музей, рассказывающий историю лаосской монархии. - 🕒 08:00–11:30, 13:30–16:00 - 🌐 Лаосский, английский - 📶 Интернет отсутствует - 💳 Наличные',
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
  'Ежедневный утренний ритуал подаяния монахам — одна из самых известных духовных традиций Луангпхабанга. - 🕒 05:30–06:30 - 🌐 Без общения - 📶 Не требуется - 💳 —',
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
  'Священные пещеры с тысячами статуэток Будды, расположенные у слияния рек Меконг и Нам Оу. - 🕒 Днём - 🌐 Лаосский - 📶 Связь слабая - 💳 Наличные',
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
  'Вечерний рынок в центре города с ремёслами, сувенирами и уличной едой. - 🕒 17:00–22:00 - 🌐 Лаосский, английский - 📶 Интернет ограниченный - 💳 Наличные',
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
  'Ресторан лаосской кухни, специализирующийся на традиционных блюдах и дегустационных сетах. - 🕒 12:00–21:30 - 🌐 Лаосский, английский - 📶 Wi-Fi - 💳 Наличные',
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
  'Популярный бар на берегу Меконга с расслабленной атмосферой и закатами. - 🕒 16:00–23:00 - 🌐 Лаосский, английский - 📶 Wi-Fi - 💳 Наличные',
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
  'Ресторан лаосской и тайской кухни на берегу реки Нам Хан, известный расслабленной атмосферой. - 🕒 16:00–22:00 - 🌐 Лаосский, английский - 📶 Wi-Fi - 💳 Наличные',
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
  'Ресторан высокой лаосской кухни у пруда с лотосами в центре Луангпхабанга. - 🕒 18:00–22:00 - 🌐 Лаосский, английский, французский - 📶 Wi-Fi - 💳 Карты, наличные',
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
  'Популярное кафе-пекарня с завтраками, кофе и выпечкой, любимое путешественниками. - 🕒 07:00–18:00 - 🌐 Лаосский, английский - 📶 Wi-Fi - 💳 Наличные',
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
  'Современное азиатское бистро с лаосским акцентом и видом на Меконг. - 🕒 12:00–22:00 - 🌐 Лаосский, английский - 📶 Wi-Fi - 💳 Наличные',
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
  'Древний кхмерский храмовый комплекс, включённый в список UNESCO, расположенный у подножия горы недалеко от Паксе. - 🕒 08:00–17:00 - 🌐 Лаосский, базовый английский - 📶 Связь слабая - 💳 Наличные',
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
  'Высокогорное плато, известное водопадами, кофейными плантациями и прохладным климатом. - 🕒 Днём - 🌐 Лаосский - 📶 Связь нестабильная - 💳 Наличные',
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
  'Двойной водопад высотой более 120 метров — один из самых впечатляющих на плато Болавен. - 🕒 08:00–17:00 - 🌐 Лаосский - 📶 Связь слабая - 💳 Наличные',
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
  'Спокойный городок у Меконга с колониальной атмосферой и видом на храмовый комплекс Wat Phou. - 🕒 Круглосуточно - 🌐 Лаосский - 📶 Связь стабильная - 💳 Наличные',
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
  'Набережная Паксе — место прогулок, рынков и вечерней жизни у Меконга. - 🕒 Круглосуточно - 🌐 Лаосский - 📶 Связь стабильная - 💳 Наличные',
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
  'Мощный водопад с возможностью купания у подножия, популярный среди местных. - 🕒 08:00–17:00 - 🌐 Лаосский - 📶 Связь слабая - 💳 Наличные',
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
  'Ресторан и кафе с лаосской и международной кухней, популярный у путешественников. - 🕒 07:30–21:00 - 🌐 Лаосский, английский - 📶 Wi-Fi - 💳 Наличные',
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
  'Ресторан с видом на Меконг, предлагающий лаосскую и французскую кухню. - 🕒 11:00–22:00 - 🌐 Лаосский, французский, английский - 📶 Wi-Fi - 💳 Карты, наличные',
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
  'Кофейня известного лаосского бренда с кофе с плато Болавен. - 🕒 07:00–18:00 - 🌐 Лаосский, английский - 📶 Wi-Fi - 💳 Наличные',
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
  'Католический собор в колониальном стиле — один из самых узнаваемых исторических объектов Саваннакхета. - 🕒 Днём (зависит от служб) - 🌐 Лаосский, базовый английский - 📶 Связь стабильная - 💳 —',
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
  'Колониальный квартал с французскими зданиями, широкими улицами и спокойной атмосферой Меконга. - 🕒 Круглосуточно - 🌐 Лаосский - 📶 Связь стабильная - 💳 —',
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
  'Небольшой музей с экспозицией о находках динозавров и палеонтологии региона. - 🕒 Днём - 🌐 Лаосский - 📶 Связь стабильная - 💳 Наличные',
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
  'Набережная Меконга — место вечерних прогулок, локальной еды и закатов. - 🕒 Круглосуточно - 🌐 Лаосский - 📶 Связь стабильная - 💳 Наличные',
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
  'Одна из важнейших ступ юга Лаоса, место паломничества недалеко от Саваннакхета. - 🕒 08:00–17:00 - 🌐 Лаосский - 📶 Связь слабая - 💳 Наличные',
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
  'Небольшой городской музей, посвящённый истории провинции и культуре южного Лаоса. - 🕒 Днём - 🌐 Лаосский - 📶 Связь стабильная - 💳 Наличные',
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
  'Уютное кафе в колониальном квартале с завтраками, кофе и простыми блюдами. - 🕒 07:00–17:00 - 🌐 Английский, лаосский - 📶 Wi-Fi - 💳 Наличные',
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
  'Кафе с лаосской и международной кухней, популярное среди путешественников. - 🕒 08:00–21:00 - 🌐 Лаосский, английский - 📶 Wi-Fi - 💳 Наличные',
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
  'Ресторан с лаосской кухней, подходящий для спокойного ужина. - 🕒 10:00–21:00 - 🌐 Лаосский - 📶 Интернет ограниченный - 💳 Наличные',
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
  'Кофейня лаосского бренда с качественным кофе и выпечкой. - 🕒 07:00–19:00 - 🌐 Лаосский, английский - 📶 Wi-Fi - 💳 Наличные',
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
  'Небольшие киоски и точки уличной еды на набережной Меконга вечером. - 🕒 17:00–22:00 - 🌐 Лаосский - 📶 Связь стабильная - 💳 Наличные',
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


-- Content Blocks UPSERT (idempotent)
-- Generated from Atlas Content Canon v1 markdown files

-- Content block for: 🛕 Pha That Luang
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vte-pha-that-luang',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самая важная святыня Лаоса  
- 🌍 Символ государственности и буддизма  
- 📸 Золотая ступа на фоне неба

## Структура комплекса

- 🛕 Главную ступу  
- 🚶 Прогулку по храмовому комплексу  
- 📷 Осмотр внутренних дворов

## Билеты и посещение

- 💰 ~30 000 LAK  
- 🎟️ Билет на входе  
- 🆓 Внешняя территория бесплатна

## Лучшие точки для фото

- 📷 Золотую ступу  
- 📷 Симметрию комплекса  
- 🌅 Свет на закате

## Практическая информация

- **Адрес:** That Luang, Vientiane  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси / тук-тук  
- 🛵 Байк  
- 🗺️ Северо-восток центра Вьентьяна

## Полезные нюансы

- ⚠️ Строгий дресс-код  
- 🌞 Лучше посещать утром  
- 👕 Закрытые плечи и колени  
- 🐾 —

## Локальная ценность

Pha That Luang — духовное сердце страны и место проведения национальных праздников.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏛️ Patuxai
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vte-patuxai',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самый узнаваемый монумент столицы  
- 🌍 История независимости Лаоса  
- 📸 Вид с обзорной площадки

## Структура комплекса

- 🏛 Архитектуру арки  
- 🔭 Подъём на смотровую площадку  
- 🚶 Прогулку по парку

## Билеты и посещение

- 💰 ~20 000 LAK  
- 🎟️ Подъём наверх — платно  
- 🆓 Нижняя часть бесплатна

## Лучшие точки для фото

- 📷 Арку снизу  
- 📷 Панораму города  
- 🌅 Закат

## Практическая информация

- **Адрес:** Patuxai Park, Vientiane  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Такси  
- 🗺️ Lane Xang Avenue

## Полезные нюансы

- ⚠️ Жарко днём  
- 🌞 Лучше утром  
- 👕 Лёгкая одежда  
- 🐾 —

## Локальная ценность

Памятник символизирует национальную гордость и современную историю Лаоса.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛕 Wat Si Saket
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vte-wat-si-saket',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самый древний храм столицы  
- 🌍 Уникальная коллекция Будд  
- 📸 Атмосфера тишины

## Структура комплекса

- 🛕 Галереи со статуями  
- 🚶 Внутренний двор  
- 📷 Детали росписей

## Билеты и посещение

- 💰 ~30 000 LAK  
- 🎟️ Билет на входе  
- 🆓 —

## Лучшие точки для фото

- 📷 Ниши со статуями  
- 📷 Внутренний двор  
- 🌅 Мягкий свет

## Практическая информация

- **Адрес:** Ave Lane Xang, Vientiane  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Тук-тук  
- 🗺️ Старый город

## Полезные нюансы

- ⚠️ Фото без вспышки  
- 🌞 Лучше утром  
- 👕 Закрытая одежда  
- 🐾 —

## Локальная ценность

Храм сохраняет буддийское наследие и историческую память города.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏥 COPE Visitor Centre
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vte-cope-visitor-centre',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Важный социальный проект  
- 🌍 Современная история Лаоса  
- 📸 Информационные экспозиции

## Структура комплекса

- 🖥 Экспозиции  
- 🎥 Документальные фильмы  
- 📚 Информационные стенды

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Пожертвования приветствуются  
- 🆓 Свободный вход

## Лучшие точки для фото

- 📷 Экспозиции  
- 📷 Информационные панели  
- 🌅 Архитектуру здания

## Практическая информация

- **Адрес:** COPE Centre, Vientiane  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси  
- 🛵 Байк  
- 🗺️ Центр города

## Полезные нюансы

- ⚠️ Эмоционально тяжёлые темы  
- 🌞 Лучше днём  
- 👕 Повседневная одежда  
- 🐾 —

## Локальная ценность

Центр повышает осведомлённость о гуманитарных проблемах и поддерживает пострадавших.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🗿 Buddha Park
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vte-buddha-park',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самая необычная достопримечательность Вьентьяна  
- 🌍 Синтез буддизма и индуизма  
- 📸 Монументальные скульптуры

## Структура комплекса

- 🗿 Скульптуры  
- 🚶 Прогулку по парку  
- 📷 Осмотр панорам

## Билеты и посещение

- 💰 ~20 000 LAK  
- 🎟️ Билет на входе  
- 🆓 —

## Лучшие точки для фото

- 📷 Большие скульптуры  
- 📷 Детали  
- 🌅 Вид на Меконг

## Практическая информация

- **Адрес:** Xieng Khuan, Vientiane  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси  
- 🚌 Автобус  
- 🗺️ ~25 км от центра

## Полезные нюансы

- ⚠️ Жарко днём  
- 🌞 Лучше утром  
- 👕 Удобная обувь  
- 🐾 —

## Локальная ценность

Парк стал культурным феноменом и туристическим символом окрестностей Вьентьяна.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌊 Mekong Riverside Promenade
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vte-mekong-riverside-promenade',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучшее место для вечерних прогулок  
- 🌍 Связь города с рекой  
- 📸 Закаты над Меконгом

## Структура комплекса

- 🚶 Прогулку по набережной  
- 🛍 Ночные рынки  
- 🌅 Закат

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободный доступ

## Лучшие точки для фото

- 📷 Реку  
- 📷 Вечерние огни  
- 🌅 Закат

## Практическая информация

- **Адрес:** Mekong Riverside, Vientiane  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Такси  
- 🗺️ Берег Меконга

## Полезные нюансы

- ⚠️ Активно вечером  
- 🌞 Лучшее время — закат  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Набережная является общественным пространством и центром городской жизни.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍽️ Kualao Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vte-kualao-restaurant',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽 Традиционные блюда  
- 🍚 Липкий рис  
- 🍲 Сеты лаосской кухни

## Как добраться

- 🚕 Такси  
- 🚶 Пешком из центра  
- 🗺️ Центральный Вьентьян

## Полезные нюансы

- ⚠️ Спокойная атмосфера  
- 🌞 Подходит для вечера  
- 👕 Smart casual  
- 🐾 —

## Локальная ценность

Ресторан сохраняет и продвигает гастрономическое наследие Лаоса.

## Лучшие точки для фото

- 📷 Интерьер  
- 📷 Подачу блюд  
- 🌅 Вечерний свет

## Практическая информация

- **Адрес:** Vientiane Centre  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Эталон лаосской кухни  
- 🌍 Культурное заведение столицы  
- 📸 Элегантный интерьер

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

-- Content block for: 🍽️ Makphet Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vte-makphet-restaurant',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽 Современные интерпретации  
- 🍲 Супы и карри  
- 🍰 Десерты

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Такси  
- 🗺️ Рядом с набережной

## Полезные нюансы

- ⚠️ Закрыто по воскресеньям  
- 🌞 Лучше вечером  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Заведение поддерживает образовательные программы для молодёжи.

## Лучшие точки для фото

- 📷 Интерьер  
- 📷 Блюда  
- 🌅 Атмосферу

## Практическая информация

- **Адрес:** Near Mekong, Vientiane  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Социальный проект  
- 🌍 Современная лаосская кухня  
- 📸 Уютная атмосфера

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

-- Content block for: 🌃 Bor Pen Nyang Rooftop
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vte-bor-pen-nyang-rooftop',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍹 Коктейли  
- 🎶 Живую музыку  
- 🌅 Закат над рекой

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Тук-тук  
- 🗺️ Mekong Riverside

## Полезные нюансы

- ⚠️ Многолюдно вечером  
- 🌞 Лучшее время — закат  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Заведение стало центром вечерней социальной жизни столицы.

## Лучшие точки для фото

- 📷 Вид на реку  
- 📷 Музыкальную сцену  
- 🌅 Закат

## Практическая информация

- **Адрес:** Mekong Riverside, Vientiane  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучший rooftop у реки  
- 🌍 Живая музыка и городской вайб  
- 📸 Панорамы Меконга и закаты

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

-- Content block for: 🍛 Taj Mahal Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vte-taj-mahal-restaurant',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽 Карри  
- 🫓 Наан  
- 🍚 Рис басмати

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Такси  
- 🗺️ Downtown Vientiane

## Полезные нюансы

- ⚠️ Подходит для вегетарианцев  
- 🌞 В любое время дня  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Ресторан расширяет гастрономическое разнообразие столицы.

## Лучшие точки для фото

- 📷 Подачу блюд  
- 📷 Интерьер  
- 🌅 Вечерний свет

## Практическая информация

- **Адрес:** Vientiane  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучший индийский ресторан города  
- 🌍 Разнообразие вкусов  
- 📸 Колоритная подача

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

-- Content block for: 🥐 Scandinavian Bakery
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vte-scandinavian-bakery',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🥐 Выпечку  
- ☕ Кофе  
- 🍳 Завтраки

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Тук-тук  
- 🗺️ Downtown Vientiane

## Полезные нюансы

- ⚠️ Многолюдно утром  
- 🌞 Лучшее время — завтрак  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Кафе стало частью повседневной жизни экспатского и туристического сообщества.

## Лучшие точки для фото

- 📷 Витрину  
- 📷 Кофе  
- 🌅 Утренний свет

## Практическая информация

- **Адрес:** Vientiane  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучшие завтраки и хлеб  
- 🌍 Европейская атмосфера  
- 📸 Витрина с выпечкой

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

-- Content block for: 🍢 Ban Anou Night Market Food Court
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vte-ban-anou-night-market-food-court',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍢 Уличные блюда  
- 🍜 Лапшу  
- 🥤 Напитки

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Тук-тук  
- 🗺️ Рядом с Mekong Riverside

## Полезные нюансы

- ⚠️ Простые условия  
- 🌞 Лучше вечером  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Фудкорт поддерживает малый бизнес и повседневную гастрономию Вьентьяна.

## Лучшие точки для фото

- 📷 Ряды еды  
- 📷 Процесс готовки  
- 🌅 Вечернюю атмосферу

## Практическая информация

- **Адрес:** Ban Anou, Vientiane  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Локальная уличная еда  
- 🌍 Аутентичная атмосфера  
- 📸 Вечерний рынок

## Билеты и посещение

- 💰 Бюджетный  
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

-- Content block for: 💦 Blue Lagoon 1
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vvg-blue-lagoon-1',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Главная природная локация Вангвьенга  
- 🌍 Символ активного туризма региона  
- 📸 Бирюзовая вода и карстовые пейзажи

## Билеты и посещение

- 💰 ~20 000 LAK  
- 🎟️ Билет на входе  
- 🆓 —

## Лучшие точки для фото

- 📷 Лагуну сверху  
- 📷 Прыжки в воду  
- 🌅 Свет среди скал

## Практическая информация

- **Адрес:** Blue Lagoon Area, Vang Vieng  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси / тук-тук  
- 🛵 Байк  
- 🗺️ ~7 км от центра города

## Полезные нюансы

- ⚠️ Многолюдно днём  
- 🌞 Лучше приезжать утром  
- 👕 Купальная одежда  
- 🐾 Осторожно на скользких камнях

## Локальная ценность

Лагуна обеспечивает доход для местных общин и поддерживает туризм Вангвьенга.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🕳️ Tham Chang Cave
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vvg-tham-chang-cave',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самая доступная пещера Вангвьенга  
- 🌍 Историческое укрытие времён войн  
- 📸 Панорама долины

## Билеты и посещение

- 💰 ~15 000 LAK  
- 🎟️ Билет на входе  
- 🆓 —

## Лучшие точки для фото

- 📷 Вид из пещеры  
- 📷 Вход в грот  
- 🌅 Долину реки

## Практическая информация

- **Адрес:** Tham Chang, Vang Vieng  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком из города  
- 🗺️ Восточная часть Вангвьенга

## Полезные нюансы

- ⚠️ Внутри темно  
- 🌞 Лучше днём  
- 👕 Удобная обувь  
- 🐾 Осторожно на лестницах

## Локальная ценность

Пещера — часть исторического и природного наследия региона.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛟 Nam Song River Tubing
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vvg-nam-song-river-tubing',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самое известное развлечение города  
- 🌍 Символ backpacker-культуры  
- 📸 Карстовые горы и река

## Билеты и посещение

- 💰 Аренда тюбинга ~60 000 LAK  
- 🎟️ Оплата на старте  
- 🆓 —

## Лучшие точки для фото

- 📷 Реку и горы  
- 📷 Сплав  
- 🌅 Закат у воды

## Практическая информация

- **Адрес:** Nam Song River  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком из центра  
- 🗺️ Река Нам Сонг

## Полезные нюансы

- ⚠️ Соблюдайте безопасность  
- 🌞 Лучше в сухой сезон  
- 👕 Купальная одежда  
- 🐾 Не злоупотребляйте алкоголем

## Локальная ценность

Тюбинг поддерживает экономику города и сервисы для путешественников.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🔭 Pha Ngern Viewpoint
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vvg-pha-ngern-viewpoint',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучший панорамный вид региона  
- 🌍 Активный треккинг  
- 📸 Карстовые пейзажи

## Билеты и посещение

- 💰 ~20 000 LAK  
- 🎟️ Билет на входе  
- 🆓 —

## Лучшие точки для фото

- 📷 Панораму  
- 📷 Скалы  
- 🌅 Закат

## Практическая информация

- **Адрес:** Pha Ngern, Vang Vieng  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Тук-тук  
- 🛵 Байк  
- 🗺️ Окрестности города

## Полезные нюансы

- ⚠️ Крутой подъём  
- 🌞 Лучше утром  
- 👕 Треккинговая обувь  
- 🐾 Вода обязательна

## Локальная ценность

Точка способствует развитию активного туризма в регионе.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🕳️ Tham Phu Kham Cave
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vvg-tham-phu-kham-cave',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Комбинация пещеры и лагуны  
- 🌍 Духовное место  
- 📸 Контраст воды и скал

## Билеты и посещение

- 💰 ~20 000 LAK  
- 🎟️ Билет на входе  
- 🆓 —

## Лучшие точки для фото

- 📷 Лагуну  
- 📷 Вход в пещеру  
- 🌅 Свет у воды

## Практическая информация

- **Адрес:** Tham Phu Kham, Vang Vieng  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Тук-тук  
- 🛵 Байк  
- 🗺️ Район Blue Lagoon

## Полезные нюансы

- ⚠️ Внутри темно  
- 🌞 Лучше днём  
- 👕 Удобная обувь  
- 🐾 Осторожно на камнях

## Локальная ценность

Пещера объединяет природную и духовную ценность региона.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌅 Sunset Point Nam Song
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vvg-sunset-point-nam-song',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучшие закаты Вангвьенга  
- 🌍 Природная смотровая зона  
- 📸 Река и карст

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободный доступ

## Лучшие точки для фото

- 📷 Реку  
- 📷 Горы  
- 🌅 Закат

## Практическая информация

- **Адрес:** Nam Song Riverside  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком из центра  
- 🗺️ Берег Нам Сонг

## Полезные нюансы

- ⚠️ Много людей вечером  
- 🌞 Лучшее время — закат  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Точка стала частью городской прогулочной культуры.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍵 Organic Mulberry Farm & Café
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vvg-organic-mulberry-farm-cafe',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚕 Тук-тук  
- 🛵 Байк  
- 🗺️ Окрестности города

## Полезные нюансы

- ⚠️ Днём жарко  
- 🌞 Лучше утром  
- 👕 Лёгкая одежда  
- 🐾 —

## Локальная ценность

Ферма поддерживает устойчивое сельское хозяйство региона.

## Лучшие точки для фото

- 📷 Поля и горы  
- 📷 Напитки  
- 🌅 Пейзажи

## Практическая информация

- **Адрес:** Near Vang Vieng  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Экологичный формат  
- 🌍 Локальные продукты  
- 📸 Виды на карст

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

-- Content block for: 🍹 Smile Beach Bar
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vvg-smile-beach-bar',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком из центра  
- 🗺️ Nam Song Riverside

## Полезные нюансы

- ⚠️ Популярно вечером  
- 🌞 Лучше к закату  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Бар стал частью туристической инфраструктуры Вангвьенга.

## Лучшие точки для фото

- 📷 Лежаки у воды  
- 📷 Коктейли  
- 🌅 Закат

## Практическая информация

- **Адрес:** Riverside, Vang Vieng  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Бар с видом на реку  
- 🌍 Backpacker-атмосфера  
- 📸 Закаты

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

-- Content block for: 🍺 Gary’s Irish Bar
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vvg-gary-s-irish-bar',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком из центра  
- 🗺️ Downtown Vang Vieng

## Полезные нюансы

- ⚠️ Шумно вечером  
- 🌞 Лучше после заката  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Бар объединяет туристов и местных жителей.

## Лучшие точки для фото

- 📷 Интерьер  
- 📷 Барную стойку  
- 🌅 Вечернюю атмосферу

## Практическая информация

- **Адрес:** Vang Vieng  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Международная атмосфера  
- 🌍 Живая музыка и спорт  
- 📸 Интерьер и публика

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

-- Content block for: ☕ Café de Vang Vieng
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vvg-cafe-de-vang-vieng',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком из центра  
- 🗺️ Downtown Vang Vieng

## Полезные нюансы

- ⚠️ Многолюдно утром  
- 🌞 Лучше приходить рано  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Кафе поддерживает локальный малый бизнес и туристическую инфраструктуру города.

## Лучшие точки для фото

- 📷 Завтраки  
- 📷 Вид на горы  
- 🌅 Утренний свет

## Практическая информация

- **Адрес:** Vang Vieng  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучшее место для завтрака  
- 🌍 Вид на карстовые пейзажи  
- 📸 Утренний свет и горы

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

-- Content block for: 🍹 Kangaroo Sunset Bar
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vvg-kangaroo-sunset-bar',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком из центра  
- 🗺️ Nam Song Riverside

## Полезные нюансы

- ⚠️ Многолюдно вечером  
- 🌞 Лучше к закату  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Бар стал неформальным местом общения туристов и местных жителей.

## Лучшие точки для фото

- 📷 Террасу  
- 📷 Реку  
- 🌅 Закат

## Практическая информация

- **Адрес:** Riverside, Vang Vieng  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Отличное место для заката  
- 🌍 Backpacker-атмосфера  
- 📸 Вид на реку Нам Сонг

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

-- Content block for: 🍽️ Peeping Som’s Bar & Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vvg-peeping-som-s-bar-restaurant',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком из центра  
- 🗺️ Nam Song Riverside

## Полезные нюансы

- ⚠️ Лучше бронировать столик у воды  
- 🌞 Лучшее время — закат  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Заведение поддерживает туристическую экономику и вечернюю жизнь города.

## Лучшие точки для фото

- 📷 Столы у реки  
- 📷 Коктейли  
- 🌅 Закат

## Практическая информация

- **Адрес:** Riverside, Vang Vieng  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Панорамный вид на реку  
- 🌍 Популярное вечернее место  
- 📸 Подсветка и отражения воды

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

-- Content block for: 🎶 Sakura Bar
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'vvg-sakura-bar',
  'overview',
  'ru',
  NULL,
  '## Как добраться

- 🚶 Пешком из центра  
- 🗺️ Downtown Vang Vieng

## Полезные нюансы

- ⚠️ Шумно и людно  
- 🌞 Только для взрослых  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Бар формирует ночной имидж Вангвьенга и поддерживает туристический поток.

## Лучшие точки для фото

- 📷 Танцпол  
- 📷 Свет  
- 🌅 Ночные сцены

## Практическая информация

- **Адрес:** Vang Vieng  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Центр ночной жизни  
- 🌍 Популярен у backpacker-сообщества  
- 📸 Танцпол и свет

## Билеты и посещение

- 💰 Бюджетный–средний  
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

-- Content block for: 🛕 Wat Xieng Thong
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lpq-wat-xieng-thong',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самый красивый и значимый храм Луангпхабанга  
- 🌍 Ключевой памятник королевского периода Лаоса  
- 📸 Резные фасады, золотые орнаменты и крыши

## Структура комплекса

- 🛕 Главный храм с мозаикой «Дерево жизни»  
- 🏛 Королевские погребальные часовни  
- 🚶 Территорию храмового комплекса

## Билеты и посещение

- 💰 ~30 000 LAK  
- 🎟️ Билет приобретается на входе  
- 🆓 Детям — бесплатно

## Лучшие точки для фото

- 📷 Фасад храма  
- 📷 Мозаику «Дерево жизни»  
- 🌅 Свет на крыше в утренние часы

## Практическая информация

- **Адрес:** Khem Khong, Luang Prabang  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком из исторического центра  
- 🚕 Такси / тук-тук  
- 🗺️ Старый город, у слияния рек

## Полезные нюансы

- ⚠️ Строгий дресс-код  
- 🌞 Лучше посещать утром  
- 👕 Закрытые плечи и колени  
- 🐾 Тихое поведение

## Локальная ценность

Храм остаётся важнейшим духовным центром города и объектом сохранения культурного наследия Лаоса.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌄 Mount Phousi
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lpq-mount-phousi',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучший вид на город  
- 🌍 Священное место  
- 📸 Закаты над Меконгом

## Структура комплекса

- 🧗 Подъём по ступеням  
- 🛕 Храм на вершине  
- 🌅 Закат

## Билеты и посещение

- 💰 ~20 000 LAK  
- 🎟️ Билет на входе  
- 🆓 —

## Лучшие точки для фото

- 📷 Панораму города  
- 📷 Меконг  
- 🌅 Закат

## Практическая информация

- **Адрес:** Sisavangvong Rd  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком из центра  
- 🗺️ Центр города

## Полезные нюансы

- ⚠️ Много туристов на закате  
- 🌞 Приходить заранее  
- 👕 Удобная обувь  
- 🐾 Осторожно на ступенях

## Локальная ценность

Место играет роль духовной и визуальной доминанты Луангпхабанга.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 💦 Kuang Si Falls
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lpq-kuang-si-falls',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самые красивые водопады страны  
- 🌍 Природный заповедник  
- 📸 Бирюзовая вода и каскады

## Структура комплекса

- 💦 Купание в бассейнах  
- 🚶 Прогулку по тропам  
- 🐻 Центр спасения медведей

## Билеты и посещение

- 💰 ~25 000 LAK  
- 🎟️ Билет включает территорию  
- 🆓 —

## Лучшие точки для фото

- 📷 Каскады  
- 📷 Бирюзовые бассейны  
- 🌅 Свет в лесу

## Практическая информация

- **Адрес:** Kuang Si Waterfall Park  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси / тук-тук  
- 🚌 Экскурсия  
- 🗺️ ~30 км от города

## Полезные нюансы

- ⚠️ Купание разрешено не везде  
- 🌞 Лучше утром  
- 👕 Купальная одежда  
- 🐾 Соблюдать экоправила

## Локальная ценность

Водопады поддерживают экотуризм и программы охраны природы в регионе.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏛️ Royal Palace Museum
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lpq-royal-palace-museum',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Главный исторический музей города  
- 🌍 Связь с королевским прошлым Лаоса  
- 📸 Колониальная архитектура и интерьеры

## Структура комплекса

- 🏛 Тронный зал  
- 🗡 Королевские регалии  
- 🖼 Коллекции подарков иностранным делегациям

## Билеты и посещение

- 💰 ~30 000 LAK  
- 🎟️ Билет на входе  
- 🆓 —

## Лучшие точки для фото

- 📷 Фасад дворца  
- 📷 Ворота и сад  
- 🌅 Площадь перед музеем

## Практическая информация

- **Адрес:** Sisavangvong Rd, Luang Prabang  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком из старого города  
- 🚕 Тук-тук  
- 🗺️ Sisavangvong Road

## Полезные нюансы

- ⚠️ Фото внутри запрещены  
- 🌞 Лучше посещать днём  
- 👕 Скромная одежда  
- 🐾 —

## Локальная ценность

Музей сохраняет историческую память о королевском периоде и национальной идентичности Лаоса.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🧘 Alms Giving Ceremony
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lpq-alms-giving-ceremony',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Уникальный буддийский ритуал  
- 🌍 Живая духовная традиция  
- 📸 Монахи в шафрановых одеждах

## Структура комплекса

- 🧘 Саму церемонию  
- 🛕 Улицы старого города на рассвете  
- 📿 Атмосферу тишины

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободное наблюдение

## Лучшие точки для фото

- 📷 Процесс подаяния  
- 📷 Монахов в движении  
- 🌅 Рассветные улицы

## Практическая информация

- **Адрес:** Old Town streets  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком по старому городу  
- 🗺️ Улицы Sisavangvong / Sakkaline

## Полезные нюансы

- ⚠️ Нельзя мешать монахам  
- 🌞 Приходить до рассвета  
- 👕 Скромная одежда  
- 🐾 Фото без вспышки

## Локальная ценность

Церемония — основа духовной жизни города и важная часть буддийской практики.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🕳️ Pak Ou Caves
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lpq-pak-ou-caves',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Одна из самых необычных святынь Лаоса  
- 🌍 Духовное значение для региона  
- 📸 Пещеры над рекой

## Структура комплекса

- 🛕 Нижнюю и верхнюю пещеры  
- 🚤 Путешествие по Меконгу  
- 📿 Статуэтки Будды

## Билеты и посещение

- 💰 ~20 000 LAK  
- 🎟️ Лодка — платно  
- 🆓 —

## Лучшие точки для фото

- 📷 Пещеры снаружи  
- 📷 Статуи Будды  
- 🌅 Реку Меконг

## Практическая информация

- **Адрес:** Pak Ou, Luang Prabang Province  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚤 Лодка из Луангпхабанга  
- 🗺️ Вверх по Меконгу

## Полезные нюансы

- ⚠️ Крутые ступени  
- 🌞 Лучше днём  
- 👕 Удобная обувь  
- 🐾 Осторожно внутри пещер

## Локальная ценность

Пещеры веками служили местом паломничества и объединяют буддийские общины региона.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌃 Night Market
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lpq-night-market',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Главный рынок города  
- 🌍 Локальная культура и ремёсла  
- 📸 Атмосфера вечера

## Структура комплекса

- 🛍 Сувениры ручной работы  
- 🍢 Уличную еду  
- 🎶 Вечернюю атмосферу

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Покупки — по желанию  
- 🆓 Вход свободный

## Лучшие точки для фото

- 📷 Ряды лавок  
- 📷 Уличную еду  
- 🌅 Вечерний свет

## Практическая информация

- **Адрес:** Night Market Street  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком из центра  
- 🗺️ Sisavangvong Road

## Полезные нюансы

- ⚠️ Торг уместен  
- 🌞 Лучше вечером  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Рынок поддерживает ремесленников и мелких торговцев Луангпхабанга.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🍽️ Tamarind Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lpq-tamarind-restaurant',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽 Дегустационный сет  
- 🍲 Лаап и супы  
- 🍚 Липкий рис

## Как добраться

- 🚶 Пешком из центра  
- 🗺️ Район старого города

## Полезные нюансы

- ⚠️ Популярно у туристов  
- 🌞 Лучше днём  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Ресторан способствует сохранению и популяризации лаосской кухни.

## Лучшие точки для фото

- 📷 Подачу блюд  
- 📷 Интерьер  
- 🌅 Атмосферу зала

## Практическая информация

- **Адрес:** Luang Prabang Old Town  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучшее место для знакомства с кухней Лаоса  
- 🌍 Традиционные рецепты  
- 📸 Аутентичная подача

## Билеты и посещение

- 💰 Средний чек  
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

-- Content block for: 🍹 Utopia Bar
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lpq-utopia-bar',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍹 Коктейли  
- 🎶 Музыку  
- 🌅 Закат

## Как добраться

- 🚶 Пешком из центра  
- 🗺️ Берег Меконга

## Полезные нюансы

- ⚠️ Закрывается рано по местным правилам  
- 🌞 Лучшее время — закат  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Бар стал частью культурной сцены Луангпхабанга и местом общения путешественников.

## Лучшие точки для фото

- 📷 Террасу  
- 📷 Реку  
- 🌅 Закат

## Практическая информация

- **Адрес:** Mekong Riverside  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Легендарное место для путешественников  
- 🌍 Бар у реки  
- 📸 Закаты над Меконгом

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

-- Content block for: 🍜 Dyen Sabai Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lpq-dyen-sabai-restaurant',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽 Лаап  
- 🍜 Супы  
- 🍹 Коктейли

## Как добраться

- 🚶 Пешком + бамбуковый мост  
- 🚕 Тук-тук  
- 🗺️ Берег Нам Хан

## Полезные нюансы

- ⚠️ Популярно вечером  
- 🌞 Лучшее время — закат  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Ресторан поддерживает локальные фермерские продукты и семейный бизнес.

## Лучшие точки для фото

- 📷 Террасу у реки  
- 📷 Подсветку  
- 🌅 Отражение воды

## Практическая информация

- **Адрес:** Nam Khan River  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Ужин у реки  
- 🌍 Локальная кухня  
- 📸 Вечерний вид

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

-- Content block for: 🍷 Manda de Laos
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lpq-manda-de-laos',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽 Дегустационные сеты  
- 🍷 Вино  
- 🌿 Блюда из локальных продуктов

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Тук-тук  
- 🗺️ Старый город

## Полезные нюансы

- ⚠️ Элегантный дресс-код  
- 🌞 Лучше вечером  
- 👕 Smart casual  
- 🐾 —

## Локальная ценность

Ресторан продвигает лаосскую гастрономию на международном уровне.

## Лучшие точки для фото

- 📷 Пруд с лотосами  
- 📷 Подачу блюд  
- 🌅 Вечерний свет

## Практическая информация

- **Адрес:** Old Town, Luang Prabang  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучший fine dining города  
- 🌍 Современная интерпретация лаосской кухни  
- 📸 Лотосовый пруд и вечерняя подсветка

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

-- Content block for: ☕ Joma Bakery Café
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lpq-joma-bakery-cafe',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍰 Выпечку  
- ☕ Кофе  
- 🥐 Завтраки

## Как добраться

- 🚶 Пешком из центра  
- 🗺️ Старый город

## Полезные нюансы

- ⚠️ Многолюдно утром  
- 🌞 Лучше раннее время  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Кафе стало частью повседневной жизни путешественников и местных жителей.

## Лучшие точки для фото

- 📷 Витрину  
- 📷 Кофе  
- 🌅 Утренний свет

## Практическая информация

- **Адрес:** Old Town, Luang Prabang  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучшее кафе для завтрака  
- 🌍 Международная атмосфера  
- 📸 Кофе и выпечка

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

-- Content block for: 🍽️ Bouang Asian Eatery
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'lpq-bouang-asian-eatery',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽 Азиатские блюда  
- 🍷 Напитки  
- 🌅 Закат

## Как добраться

- 🚶 Пешком из центра  
- 🗺️ Берег Меконга

## Полезные нюансы

- ⚠️ Популярно вечером  
- 🌞 Лучшее время — закат  
- 👕 Casual chic  
- 🐾 —

## Локальная ценность

Заведение демонстрирует современное развитие гастрономической сцены Луангпхабанга.

## Лучшие точки для фото

- 📷 Вид на реку  
- 📷 Блюда  
- 🌅 Вечернюю атмосферу

## Практическая информация

- **Адрес:** Mekong Riverside  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Современный формат кухни  
- 🌍 Вид на реку  
- 📸 Интерьер и подача

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

-- Content block for: 🛕 Wat Phou
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pkz-wat-phou',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Главный исторический объект юга Лаоса  
- 🌍 Наследие кхмерской цивилизации  
- 📸 Каменные террасы и вид на равнину

## Структура комплекса

- 🏛 Храмовые руины  
- 🚶 Проход по сакральной оси  
- 🌅 Вид на закат

## Билеты и посещение

- 💰 ~50 000 LAK  
- 🎟️ Билет на входе  
- 🆓 —

## Лучшие точки для фото

- 📷 Храмовые руины  
- 📷 Каменные лестницы  
- 🌅 Панораму равнины

## Практическая информация

- **Адрес:** Champasak Province  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси из Паксе  
- 🛵 Байк  
- 🗺️ ~45 км южнее города

## Полезные нюансы

- ⚠️ Жарко днём  
- 🌞 Лучше утром  
- 👕 Удобная одежда  
- 🐾 Вода обязательна

## Локальная ценность

Wat Phou — ключевой элемент культурной идентичности юга Лаоса и объект сохранения мирового наследия.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌲 Bolaven Plateau
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pkz-bolaven-plateau',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучшие водопады юга Лаоса  
- 🌍 Кофейный регион страны  
- 📸 Джунгли и каскады

## Структура комплекса

- 💦 Водопады  
- ☕ Кофейные фермы  
- 🚶 Природные маршруты

## Билеты и посещение

- 💰 Въезд бесплатный  
- 🎟️ Отдельные водопады — платно  
- 🆓 —

## Лучшие точки для фото

- 📷 Водопады  
- 📷 Кофейные плантации  
- 🌅 Туман над лесом

## Практическая информация

- **Адрес:** Bolaven Plateau  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Экскурсия  
- 🛵 Байк  
- 🗺️ Восток от Паксе

## Полезные нюансы

- ⚠️ Погода меняется  
- 🌞 Лучше сухой сезон  
- 👕 Куртка по утрам  
- 🐾 —

## Локальная ценность

Плато поддерживает сельское хозяйство и устойчивый экотуризм региона.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 💦 Tad Fane Waterfall
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pkz-tad-fane-waterfall',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Самый высокий водопад региона  
- 🌍 Природный памятник  
- 📸 Две струи в глубоком ущелье

## Структура комплекса

- 💦 Водопад  
- 🔭 Смотровые площадки  
- 🚶 Прогулку по тропам

## Билеты и посещение

- 💰 ~10 000 LAK  
- 🎟️ Билет на входе  
- 🆓 —

## Лучшие точки для фото

- 📷 Двойной каскад  
- 📷 Ущелье  
- 🌅 Туман над водопадом

## Практическая информация

- **Адрес:** Bolaven Plateau  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси  
- 🛵 Байк  
- 🗺️ Болавен Плато

## Полезные нюансы

- ⚠️ Не купаются  
- 🌞 Лучше утром  
- 👕 Удобная обувь  
- 🐾 Осторожно у обрывов

## Локальная ценность

Водопад — ключевая природная достопримечательность региона и источник экотуризма.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏘 Champasak Town
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pkz-champasak-town',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Аутентичная атмосфера  
- 🌍 База для посещения Wat Phou  
- 📸 Улица у реки

## Структура комплекса

- 🚶 Прогулку по набережной  
- 🏘 Колониальные дома  
- 🌅 Закат над Меконгом

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободный доступ

## Лучшие точки для фото

- 📷 Реку  
- 📷 Дома  
- 🌅 Закат

## Практическая информация

- **Адрес:** Champasak  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси из Паксе  
- 🛵 Байк  
- 🗺️ Юг Паксе

## Полезные нюансы

- ⚠️ Очень спокойно  
- 🌞 Лучшее время — вечер  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Город сохраняет традиционный уклад жизни южного Лаоса.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌊 Mekong Riverside Pakse
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pkz-mekong-riverside-pakse',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучшее место для вечерних прогулок  
- 🌍 Городская жизнь у реки  
- 📸 Закаты над Меконгом

## Структура комплекса

- 🚶 Прогулку  
- 🍢 Уличную еду  
- 🌅 Закат

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободный доступ

## Лучшие точки для фото

- 📷 Реку  
- 📷 Вечерние огни  
- 🌅 Закат

## Практическая информация

- **Адрес:** Pakse Riverside  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Такси  
- 🗺️ Центр Паксе

## Полезные нюансы

- ⚠️ Активно вечером  
- 🌞 Лучшее время — закат  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Набережная — общественное пространство и центр городской жизни.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 💦 Tad Yuang Waterfall
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pkz-tad-yuang-waterfall',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Купание у большого водопада  
- 🌍 Доступная природная локация  
- 📸 Вода и скалы

## Структура комплекса

- 💦 Купание  
- 🚶 Прогулку  
- 🌿 Отдых

## Билеты и посещение

- 💰 ~10 000 LAK  
- 🎟️ Билет на входе  
- 🆓 —

## Лучшие точки для фото

- 📷 Каскад  
- 📷 Бассейн  
- 🌅 Свет в лесу

## Практическая информация

- **Адрес:** Bolaven Plateau  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси  
- 🛵 Байк  
- 🗺️ Болавен Плато

## Полезные нюансы

- ⚠️ Камни скользкие  
- 🌞 Лучше днём  
- 👕 Купальная одежда  
- 🐾 —

## Локальная ценность

Водопад — популярное место отдыха для местных жителей.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ☕ Daolin Restaurant & Café
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pkz-daolin-restaurant-cafe',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽 Лаосские блюда  
- 🍝 Европейские позиции  
- ☕ Кофе

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Такси  
- 🗺️ Центр Паксе

## Полезные нюансы

- ⚠️ Популярно днём  
- 🌞 Подходит для завтраков  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Заведение поддерживает локальный рынок продуктов и сервис Паксе.

## Лучшие точки для фото

- 📷 Интерьер  
- 📷 Подачу  
- 🌅 Атмосферу

## Практическая информация

- **Адрес:** Pakse  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Уютное место для обеда  
- 🌍 Разнообразное меню  
- 📸 Современный интерьер

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

-- Content block for: 🍷 Le Panorama Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pkz-le-panorama-restaurant',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽 Французские блюда  
- 🍷 Вино  
- 🌅 Закат

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Такси  
- 🗺️ Mekong Riverside

## Полезные нюансы

- ⚠️ Лучше вечером  
- 🌞 Закат — лучшее время  
- 👕 Smart casual  
- 🐾 —

## Локальная ценность

Ресторан отражает колониальное гастрономическое наследие региона.

## Лучшие точки для фото

- 📷 Вид на реку  
- 📷 Стол у окна  
- 🌅 Закат

## Практическая информация

- **Адрес:** Pakse Riverside  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Ужин с видом на реку  
- 🌍 Французское влияние  
- 📸 Закаты

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

-- Content block for: ☕ Sinouk Coffee Pakse
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'pkz-sinouk-coffee-pakse',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- ☕ Эспрессо  
- 🧋 Лаосский кофе  
- 🛍 Зерно на вынос

## Как добраться

- 🚶 Пешком  
- 🚕 Такси  
- 🗺️ Центр Паксе

## Полезные нюансы

- ⚠️ Популярно утром  
- 🌞 Лучшее время — завтрак  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Кофейня продвигает лаосский кофе и поддерживает фермеров региона.

## Лучшие точки для фото

- 📷 Кофе  
- 📷 Витрину  
- 🌅 Утренний свет

## Практическая информация

- **Адрес:** Pakse  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучший лаосский кофе  
- 🌍 Продукция с Болавен Плато  
- 📸 Кофейная культура

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

-- Content block for: ⛪ St. Teresa’s Catholic Church
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'svk-st-teresa-s-catholic-church',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Главный архитектурный символ колониального Саваннакхета  
- 🌍 Отражение французского периода истории Лаоса  
- 📸 Фасад, витражи и атмосферная площадь

## Структура комплекса

- 🏛 Фасад и внутреннее убранство  
- 🚶 Прогулку вокруг исторического центра  
- 📷 Фото колониальной архитектуры

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Вход свободный

## Лучшие точки для фото

- 📷 Фасад собора  
- 📷 Детали окон и дверей  
- 🌅 Свет вечером на площади

## Практическая информация

- **Адрес:** Savannakhet Old Town  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Тук-тук  
- 🗺️ Исторический центр города

## Полезные нюансы

- ⚠️ Уважайте религиозное пространство  
- 🌞 Лучше посещать днём  
- 👕 Скромная одежда  
- 🐾 Тихое поведение

## Локальная ценность

Собор — важная часть исторической памяти города и пример мультикультурного наследия.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏘 Savannakhet Old Town
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'svk-savannakhet-old-town',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучшее место для прогулки по “французскому Лаосу”  
- 🌍 Историческое ядро города  
- 📸 Колониальные фасады и уличные сцены

## Структура комплекса

- 🚶 Прогулку по кварталу  
- 🏘 Колониальные здания  
- 🌅 Закат у реки

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободный доступ

## Лучшие точки для фото

- 📷 Колониальные фасады  
- 📷 Улицы с пальмами  
- 🌅 Закат у Меконга

## Практическая информация

- **Адрес:** Savannakhet Riverside  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Тук-тук  
- 🗺️ Набережная Меконга

## Полезные нюансы

- ⚠️ Очень тихо вечером  
- 🌞 Лучшее время — утро и закат  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Квартал сохраняет историческую идентичность Саваннакхета и поддерживает локальный туризм.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🦴 Dinosaur Museum
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'svk-dinosaur-museum',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Необычная тема для Лаоса  
- 🌍 Региональная история и образование  
- 📸 Экспозиции и макеты

## Структура комплекса

- 🦴 Экспонаты и макеты  
- 📚 Информационные стенды  
- 🚶 Прогулку по центру после музея

## Билеты и посещение

- 💰 Бюджетно / часто бесплатно  
- 🎟️ —  
- 🆓 Возможен свободный вход

## Лучшие точки для фото

- 📷 Макеты  
- 📷 Витрины  
- 🌅 Улицы рядом

## Практическая информация

- **Адрес:** Savannakhet Town Center  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком из старого города  
- 🚕 Тук-тук  
- 🗺️ Центр Саваннакхета

## Полезные нюансы

- ⚠️ Экспозиция небольшая  
- 🌞 Лучше днём  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Музей поддерживает образовательную миссию и интерес к природной истории региона.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🌊 Mekong Riverside Promenade
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'svk-mekong-riverside-promenade',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Лучшее место для заката в городе  
- 🌍 Городская жизнь у реки  
- 📸 Меконг, лодки и вечерние огни

## Структура комплекса

- 🚶 Прогулку  
- 🍢 Уличную еду  
- 🌅 Закат

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ —  
- 🆓 Свободный доступ

## Лучшие точки для фото

- 📷 Закат над Меконгом  
- 📷 Набережную  
- 🌅 Вечерние огни

## Практическая информация

- **Адрес:** Mekong Riverside, Savannakhet  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Тук-тук  
- 🗺️ Riverside Road

## Полезные нюансы

- ⚠️ Активно вечером  
- 🌞 Лучшее время — закат  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Набережная — социальный центр города и место встреч местных жителей.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🛕 That Ing Hang Stupa
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'svk-that-ing-hang-stupa',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Священное место региона  
- 🌍 Буддийское наследие Лаоса  
- 📸 Ступа и монастырский комплекс

## Структура комплекса

- 🛕 Ступу и храмовую территорию  
- 🚶 Прогулку по монастырю  
- 📷 Детали архитектуры

## Билеты и посещение

- 💰 Бесплатно  
- 🎟️ Пожертвования приветствуются  
- 🆓 Свободный вход

## Лучшие точки для фото

- 📷 Ступу  
- 📷 Ворота комплекса  
- 🌅 Свет в утренние часы

## Практическая информация

- **Адрес:** That Ing Hang, Savannakhet Province  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚕 Такси / тук-тук  
- 🛵 Байк  
- 🗺️ Окрестности Саваннакхета

## Полезные нюансы

- ⚠️ Уважайте религиозное пространство  
- 🌞 Лучше утром  
- 👕 Скромная одежда  
- 🐾 —

## Локальная ценность

Ступа остаётся важным центром паломничества и духовной практики для местных жителей.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: 🏛 Savannakhet City Museum
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'svk-savannakhet-city-museum',
  'overview',
  'ru',
  NULL,
  '## Почему это важно?

- 🌟 Быстрый способ понять регион  
- 🌍 История и культура провинции  
- 📸 Локальные артефакты

## Структура комплекса

- 🏛 Экспозиции о колониальном периоде  
- 📚 Этнографические предметы  
- 🚶 Прогулку по окрестностям после визита

## Билеты и посещение

- 💰 Бюджетно / часто бесплатно  
- 🎟️ —  
- 🆓 Возможен свободный вход

## Лучшие точки для фото

- 📷 Фасад  
- 📷 Экспонаты (если разрешено)  
- 🌅 Улицы вокруг

## Практическая информация

- **Адрес:** Savannakhet Old Town  
- **Сайт:** —  
- **Телефон:** —

## Как добраться

- 🚶 Пешком из старого города  
- 🚕 Тук-тук  
- 🗺️ Центр

## Полезные нюансы

- ⚠️ Небольшая экспозиция  
- 🌞 Лучше днём  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Музей поддерживает сохранение локального наследия и образовательные инициативы.
',
  'editorial',
  NOW(),
  NOW()
)
ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET
  body_markdown = EXCLUDED.body_markdown,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Content block for: ☕ Cafe Inn
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'svk-cafe-inn',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍳 Завтраки  
- ☕ Кофе  
- 🥐 Выпечку

## Как добраться

- 🚶 Пешком по old town  
- 🚕 Тук-тук  
- 🗺️ French Quarter

## Полезные нюансы

- ⚠️ Многолюдно утром  
- 🌞 Лучше приходить рано  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Кафе поддерживает локальный малый бизнес и комфортную инфраструктуру для путешественников.

## Лучшие точки для фото

- 📷 Интерьер  
- 📷 Кофе  
- 🌅 Улицу с фасадами

## Практическая информация

- **Адрес:** Savannakhet Old Town  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучшее место для завтрака в старом городе  
- 🌍 Уютная атмосфера  
- 📸 Кофе и выпечка

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

-- Content block for: ☕ Lin’s Café
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'svk-lin-s-cafe',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽 Лаосские блюда  
- 🍜 Лапшу  
- ☕ Кофе/чай

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Тук-тук  
- 🗺️ Центр Savannakhet

## Полезные нюансы

- ⚠️ Популярно в обед  
- 🌞 Лучше днём  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Кафе поддерживает локальных поставщиков и развивает сервис в старом городе.

## Лучшие точки для фото

- 📷 Блюда  
- 📷 Интерьер  
- 🌅 Вечернюю атмосферу

## Практическая информация

- **Адрес:** Savannakhet  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Уютный формат «поесть без суеты»  
- 🌍 Комфортное меню для туристов  
- 📸 Простая, приятная подача

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

-- Content block for: 🍽 Daosavanh Restaurant
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'svk-daosavanh-restaurant',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍽 Лаап (laap)  
- 🍚 Липкий рис  
- 🍲 Супы

## Как добраться

- 🚕 Тук-тук  
- 🚶 Пешком из old town  
- 🗺️ Центр города

## Полезные нюансы

- ⚠️ Порции большие  
- 🌞 Подходит для вечера  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Ресторан поддерживает традиционную гастрокультуру южного Лаоса и семейные рецепты.

## Лучшие точки для фото

- 📷 Подачу блюд  
- 📷 Стол  
- 🌅 Атмосферу зала

## Практическая информация

- **Адрес:** Savannakhet  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Хорошее место для знакомства с местной кухней  
- 🌍 Спокойная семейная атмосфера  
- 📸 Локальный интерьер

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

-- Content block for: ☕ Sinouk Coffee Savannakhet
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'svk-sinouk-coffee-savannakhet',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- ☕ Эспрессо/латте  
- 🧁 Десерты  
- 🛍 Кофе на вынос

## Как добраться

- 🚶 Пешком из центра  
- 🚕 Тук-тук  
- 🗺️ Savannakhet

## Полезные нюансы

- ⚠️ Популярно утром  
- 🌞 Лучшее время — завтрак  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Кофейня продвигает лаосский кофе и поддерживает фермеров страны.

## Лучшие точки для фото

- 📷 Кофе  
- 📷 Витрину  
- 🌅 Утренний свет

## Практическая информация

- **Адрес:** Savannakhet  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Лучший лаосский кофе  
- 🌍 Комфортная точка для работы/перерыва  
- 📸 Кофе и витрина

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

-- Content block for: 🍢 Mekong Riverside Food Stalls
INSERT INTO content_blocks (
  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at
) VALUES (
  'place',
  'svk-mekong-riverside-food-stalls',
  'overview',
  'ru',
  NULL,
  '## Что попробовать обязательно

- 🍢 Шашлычки  
- 🍜 Лапшу  
- 🥤 Напитки

## Как добраться

- 🚶 Пешком из old town  
- 🚕 Тук-тук  
- 🗺️ Mekong Riverside

## Полезные нюансы

- ⚠️ Простые условия  
- 🌞 Лучше вечером  
- 👕 Casual  
- 🐾 —

## Локальная ценность

Точки уличной еды поддерживают малый бизнес и повседневную гастрокультуру города.

## Лучшие точки для фото

- 📷 Гриль и еду  
- 📷 Свет фонарей  
- 🌅 Вечерний Меконг

## Практическая информация

- **Адрес:** Mekong Riverside, Savannakhet  
- **Сайт:** —  
- **Телефон:** —

## Почему это важно?

- 🌟 Самая аутентичная уличная еда города  
- 🌍 Вечерняя жизнь у реки  
- 📸 Свет, дым гриля и Меконг

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
