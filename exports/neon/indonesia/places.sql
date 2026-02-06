-- Places UPSERT (idempotent)
-- Generated from Atlas Content Canon v1 markdown files

-- Place: 🛕 Tanah Lot Temple (Bali)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'bali-tanah-lot-temple',
  'id',
  'bali',
  '🛕 Tanah Lot Temple',
  'bali-tanah-lot-temple',
  'temple',
  'showplace',
  'temple',
  '["temple","ocean","sunset"]'::jsonb,
  'Один из самых известных храмов Бали, расположенный на скале в океане и особенно впечатляющий на закате.',
  -8.6211,
  115.0865,
  'Tanah Lot, Bali',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🐒 Ubud Monkey Forest (Bali)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'bali-ubud-monkey-forest',
  'id',
  'bali',
  '🐒 Ubud Monkey Forest',
  'bali-ubud-monkey-forest',
  'forest',
  'showplace',
  'forest',
  '["forest","wildlife","culture"]'::jsonb,
  'Священный лес в центре Убуда с храмами и сотнями макак, свободно гуляющих по территории.',
  -8.5194,
  115.2599,
  'Monkey Forest Rd, Ubud',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🌾 Tegallalang Rice Terraces (Bali)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'bali-tegallalang-rice-terraces',
  'id',
  'bali',
  '🌾 Tegallalang Rice Terraces',
  'bali-tegallalang-rice-terraces',
  'rice-terrace',
  'showplace',
  'rice-terrace',
  '["rice-terrace","nature","landscape"]'::jsonb,
  'Знаменитые рисовые террасы недалеко от Убуда — символ балийского сельского ландшафта.',
  -8.4356,
  115.2797,
  'Tegallalang, Bali',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🏔️ Uluwatu Temple (Bali)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'bali-uluwatu-temple',
  'id',
  'bali',
  '🏔️ Uluwatu Temple',
  'bali-uluwatu-temple',
  'temple',
  'showplace',
  'temple',
  '["temple","cliff","sunset"]'::jsonb,
  'Храм на утёсе над океаном в Улувату, известный закатами и традиционными танцами кечак.',
  -8.8291,
  115.0849,
  'Uluwatu, Bali',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🌋 Mount Batur (Bali)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'bali-mount-batur',
  'id',
  'bali',
  '🌋 Mount Batur',
  'bali-mount-batur',
  'volcano',
  'showplace',
  'volcano',
  '["volcano","hiking","sunrise"]'::jsonb,
  'Активный вулкан, популярный для ночных восхождений ради рассвета.',
  -8.242,
  115.375,
  'Kintamani, Bali',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 💧 Tirta Empul Temple (Bali)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'bali-tirta-empul-temple',
  'id',
  'bali',
  '💧 Tirta Empul Temple',
  'bali-tirta-empul-temple',
  'temple',
  'showplace',
  'temple',
  '["temple","ritual","water"]'::jsonb,
  'Священный водный храм, известный ритуалами очищения в источниках.',
  -8.4157,
  115.3156,
  'Tampaksiring, Bali',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🏖️ Potato Head Beach Club (Bali)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'bali-potato-head-beach-club',
  'id',
  'bali',
  '🏖️ Potato Head Beach Club',
  'bali-potato-head-beach-club',
  'beach-club',
  'business',
  'beach-club',
  '["beach-club","lifestyle","sunset"]'::jsonb,
  'Знаменитый бич-клуб в Семиньяке с бассейнами, диджеями и видом на океан.',
  -8.6705,
  115.1381,
  'Seminyak, Bali',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🏝️ FINNS Beach Club (Bali)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'bali-finns-beach-club',
  'id',
  'bali',
  '🏝️ FINNS Beach Club',
  'bali-finns-beach-club',
  'beach-club',
  'business',
  'beach-club',
  '["beach-club","party","lifestyle"]'::jsonb,
  'Огромный пляжный клуб в Чангу с бассейнами, вечеринками и международной кухней.',
  -8.663,
  115.1384,
  'Canggu, Bali',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🪨 The Rock Bar Bali (Bali)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'bali-the-rock-bar-bali',
  'id',
  'bali',
  '🪨 The Rock Bar Bali',
  'bali-the-rock-bar-bali',
  'bar',
  'business',
  'bar',
  '["bar","cliff","sunset"]'::jsonb,
  'Знаменитый бар на скале в Улувату с панорамным видом на океан.',
  -8.7892,
  115.1623,
  'Uluwatu, Bali',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: ☕ Clear Café Ubud (Bali)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'bali-clear-cafe-ubud',
  'id',
  'bali',
  '☕ Clear Café Ubud',
  'bali-clear-cafe-ubud',
  'cafe',
  'business',
  'cafe',
  '["cafe","healthy-food","wellness"]'::jsonb,
  'Популярное кафе здоровой кухни в Убуде с вегетарианскими и веганскими блюдами, смузи и уютной атмосферой.',
  -8.5074,
  115.2641,
  'Ubud, Bali',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🍽️ Locavore Restaurant (Bali)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'bali-locavore-restaurant',
  'id',
  'bali',
  '🍽️ Locavore Restaurant',
  'bali-locavore-restaurant',
  'fine-dining',
  'business',
  'fine-dining',
  '["fine-dining","restaurant","local"]'::jsonb,
  'Один из самых известных ресторанов высокой кухни на Бали, работающий с локальными ингредиентами.',
  -8.5089,
  115.2626,
  'Ubud, Bali',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🏄 Single Fin Bali (Bali)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'bali-single-fin-bali',
  'id',
  'bali',
  '🏄 Single Fin Bali',
  'bali-single-fin-bali',
  'bar',
  'business',
  'bar',
  '["bar","surf","sunset"]'::jsonb,
  'Легендарный бар для серферов в Улувату с видом на океан и вечеринки на закате.',
  -8.8286,
  115.0867,
  'Uluwatu, Bali',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🗼 National Monument (Jakarta)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'jkt-national-monument',
  'id',
  'jkt',
  '🗼 National Monument',
  'jkt-national-monument',
  'monument',
  'showplace',
  'monument',
  '["monument","history","landmark"]'::jsonb,
  'Главный национальный монумент Индонезии, символ независимости страны, расположенный в самом центре Джакарты.',
  -6.1754,
  106.8272,
  'Merdeka Square, Jakarta',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🏛 Kota Tua Jakarta (Jakarta)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'jkt-kota-tua-jakarta',
  'id',
  'jkt',
  '🏛 Kota Tua Jakarta',
  'jkt-kota-tua-jakarta',
  'old-town',
  'showplace',
  'old-town',
  '["old-town","colonial","heritage"]'::jsonb,
  'Исторический район с голландской колониальной архитектурой и музеями.',
  -6.1352,
  106.8133,
  'Kota Tua, Jakarta',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🕌 Istiqlal Mosque (Jakarta)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'jkt-istiqlal-mosque',
  'id',
  'jkt',
  '🕌 Istiqlal Mosque',
  'jkt-istiqlal-mosque',
  'mosque',
  'showplace',
  'mosque',
  '["mosque","religion","architecture"]'::jsonb,
  'Крупнейшая мечеть Юго-Восточной Азии, символ религиозной терпимости и современной Индонезии.',
  -6.1702,
  106.8319,
  'Central Jakarta',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: ⛪ Jakarta Cathedral (Jakarta)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'jkt-jakarta-cathedral',
  'id',
  'jkt',
  '⛪ Jakarta Cathedral',
  'jkt-jakarta-cathedral',
  'cathedral',
  'showplace',
  'cathedral',
  '["cathedral","religion","colonial"]'::jsonb,
  'Неоготический католический собор, расположенный напротив мечети Istiqlal.',
  -6.17,
  106.8326,
  'Central Jakarta',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🎢 Ancol Dreamland (Jakarta)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'jkt-ancol-dreamland',
  'id',
  'jkt',
  '🎢 Ancol Dreamland',
  'jkt-ancol-dreamland',
  'amusement',
  'showplace',
  'amusement',
  '["amusement","beach","family"]'::jsonb,
  'Крупный прибрежный развлекательный комплекс с парками, пляжами и океанариумом.',
  -6.1236,
  106.8365,
  'Ancol, Jakarta',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🌳 Taman Mini Indonesia Indah (Jakarta)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'jkt-taman-mini-indonesia-indah',
  'id',
  'jkt',
  '🌳 Taman Mini Indonesia Indah',
  'jkt-taman-mini-indonesia-indah',
  'culture',
  'showplace',
  'culture',
  '["culture","park","heritage"]'::jsonb,
  'Этнографический парк, представляющий культуру и архитектуру всех регионов Индонезии.',
  -6.3027,
  106.8955,
  'East Jakarta',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🌃 Skye Bar & Restaurant (Jakarta)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'jkt-skye-bar-restaurant',
  'id',
  'jkt',
  '🌃 Skye Bar & Restaurant',
  'jkt-skye-bar-restaurant',
  'rooftop',
  'business',
  'rooftop',
  '["rooftop","bar","skyline"]'::jsonb,
  'Руфтоп-бар и ресторан в центре Джакарты с панорамным видом на небоскрёбы.',
  -6.2,
  106.819,
  'Central Jakarta',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: ☕ Café Batavia (Jakarta)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'jkt-cafe-batavia',
  'id',
  'jkt',
  '☕ Café Batavia',
  'jkt-cafe-batavia',
  'cafe',
  'business',
  'cafe',
  '["cafe","colonial","heritage"]'::jsonb,
  'Историческое кафе-ресторан в колониальном здании на площади Fatahillah.',
  -6.1359,
  106.8135,
  'Fatahillah Square, Jakarta',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🍜 Nasi Goreng Kambing Kebon Sirih (Jakarta)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'jkt-nasi-goreng-kambing-kebon-sirih',
  'id',
  'jkt',
  '🍜 Nasi Goreng Kambing Kebon Sirih',
  'jkt-nasi-goreng-kambing-kebon-sirih',
  'street-food',
  'business',
  'street-food',
  '["street-food","nasi-goreng","local"]'::jsonb,
  'Легендарная уличная точка с одним из лучших nasi goreng kambing в Джакарте.',
  -6.1817,
  106.8303,
  'Kebon Sirih, Jakarta',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🍽 Plataran Menteng (Jakarta)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'jkt-plataran-menteng',
  'id',
  'jkt',
  '🍽 Plataran Menteng',
  'jkt-plataran-menteng',
  'fine-dining',
  'business',
  'fine-dining',
  '["fine-dining","indonesian-food","heritage"]'::jsonb,
  'Ресторан высокой индонезийской кухни в отреставрированном колониальном особняке в районе Ментенг.',
  -6.193,
  106.8293,
  'Menteng, Jakarta',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: ☕ Union Café (Jakarta)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'jkt-union-cafe',
  'id',
  'jkt',
  '☕ Union Café',
  'jkt-union-cafe',
  'cafe',
  'business',
  'cafe',
  '["cafe","dessert","urban"]'::jsonb,
  'Популярное кафе и ресторан с европейско-азиатской кухней и культовыми десертами.',
  -6.2244,
  106.8039,
  'Plaza Senayan, Jakarta',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🍹 Social House (Jakarta)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'jkt-social-house',
  'id',
  'jkt',
  '🍹 Social House',
  'jkt-social-house',
  'restaurant',
  'business',
  'restaurant',
  '["restaurant","bar","modern"]'::jsonb,
  'Модный ресторан и бар с интернациональной кухней и видом на центр города.',
  -6.195,
  106.8213,
  'Grand Indonesia, Jakarta',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🦎 Komodo National Park (Labuan Bajo)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lbj-komodo-national-park',
  'id',
  'lbj',
  '🦎 Komodo National Park',
  'lbj-komodo-national-park',
  'unesco',
  'showplace',
  'unesco',
  '["unesco","komodo","islands","diving"]'::jsonb,
  'Национальный парк и объект UNESCO, знаменитый драконами Комодо, розовыми пляжами и одним из лучших дайвингов в мире.',
  -8.52,
  119.55,
  'Komodo National Park, Flores',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🌄 Padar Island Viewpoint (Labuan Bajo)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lbj-padar-island-viewpoint',
  'id',
  'lbj',
  '🌄 Padar Island Viewpoint',
  'lbj-padar-island-viewpoint',
  'viewpoint',
  'showplace',
  'viewpoint',
  '["viewpoint","hiking","islands"]'::jsonb,
  'Знаменитая панорама острова Падар с тремя бухтами разных оттенков — один из самых узнаваемых видов Индонезии.',
  -8.6504,
  119.7461,
  'Padar Island, Komodo NP',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🏖 Pink Beach (Labuan Bajo)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lbj-pink-beach',
  'id',
  'lbj',
  '🏖 Pink Beach',
  'lbj-pink-beach',
  'beach',
  'showplace',
  'beach',
  '["beach","snorkeling","nature"]'::jsonb,
  'Редкий розовый пляж с коралловым песком и отличным сноркелингом.',
  -8.6304,
  119.5589,
  'Komodo National Park',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🐋 Manta Point (Labuan Bajo)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lbj-manta-point',
  'id',
  'lbj',
  '🐋 Manta Point',
  'lbj-manta-point',
  'diving',
  'showplace',
  'diving',
  '["diving","manta","snorkeling"]'::jsonb,
  'Известная точка сноркелинга и дайвинга, где часто встречаются манты.',
  -8.551,
  119.619,
  'Komodo NP waters',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🕳 Batu Cermin Cave (Labuan Bajo)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lbj-batu-cermin-cave',
  'id',
  'lbj',
  '🕳 Batu Cermin Cave',
  'lbj-batu-cermin-cave',
  'cave',
  'showplace',
  'cave',
  '["cave","geology","easy-trip"]'::jsonb,
  '«Зеркальная пещера» рядом с Лабуан-Баджо, где свет отражается на стенах известняка.',
  -8.4866,
  119.8847,
  'Batu Cermin, Labuan Bajo',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🌅 Labuan Bajo Sunset Harbor (Labuan Bajo)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lbj-labuan-bajo-sunset-harbor',
  'id',
  'lbj',
  '🌅 Labuan Bajo Sunset Harbor',
  'lbj-labuan-bajo-sunset-harbor',
  'harbor',
  'showplace',
  'harbor',
  '["harbor","sunset","city-walk"]'::jsonb,
  'Набережная и порт Лабуан-Баджо — лучшее место для вечерних прогулок, закатов и наблюдения за лодками.',
  -8.4966,
  119.8872,
  'Labuan Bajo Harbour',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🍽️ La Cucina (Labuan Bajo)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lbj-la-cucina',
  'id',
  'lbj',
  '🍽️ La Cucina',
  'lbj-la-cucina',
  'fine-dining',
  'business',
  'fine-dining',
  '["fine-dining","premium","sea-view"]'::jsonb,
  'Премиальный ресторан при AYANA Komodo Resort с видом на море и качественной кухней.',
  -8.4969,
  119.878,
  'Labuan Bajo, Flores',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🌃 Atlantis on the Rock (Labuan Bajo)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lbj-atlantis-on-the-rock',
  'id',
  'lbj',
  '🌃 Atlantis on the Rock',
  'lbj-atlantis-on-the-rock',
  'rooftop',
  'business',
  'rooftop',
  '["rooftop","bar","sunset"]'::jsonb,
  'Популярный rooftop-бар с видом на порт и закаты, один из лучших вечерних спотов города.',
  -8.496,
  119.889,
  'Labuan Bajo Harbour',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🥗 Happy Banana Komodo (Labuan Bajo)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lbj-happy-banana-komodo',
  'id',
  'lbj',
  '🥗 Happy Banana Komodo',
  'lbj-happy-banana-komodo',
  'cafe',
  'business',
  'cafe',
  '["cafe","healthy","coffee"]'::jsonb,
  'Кафе здорового питания с боулами, смузи и кофе — популярное место среди дайверов и путешественников.',
  -8.497,
  119.8879,
  'Labuan Bajo',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🦞 Taman Laut Handayani Seafood (Labuan Bajo)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lbj-taman-laut-handayani-seafood',
  'id',
  'lbj',
  '🦞 Taman Laut Handayani Seafood',
  'lbj-taman-laut-handayani-seafood',
  'seafood',
  'business',
  'seafood',
  '["seafood","local","restaurant"]'::jsonb,
  'Популярный ресторан морепродуктов рядом с портом, где можно выбрать свежий улов и поужинать у воды.',
  -8.4976,
  119.887,
  'Labuan Bajo Harbour',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🌮 Bajo Taco (Labuan Bajo)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lbj-bajo-taco',
  'id',
  'lbj',
  '🌮 Bajo Taco',
  'lbj-bajo-taco',
  'cafe',
  'business',
  'cafe',
  '["cafe","fast-casual","international"]'::jsonb,
  'Небольшое, но очень популярное кафе с тако и буррито — быстрый и вкусный вариант перекуса между турами.',
  -8.4968,
  119.8884,
  'Labuan Bajo',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🤿 Scuba Junkie Komodo (Labuan Bajo)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lbj-scuba-junkie-komodo',
  'id',
  'lbj',
  '🤿 Scuba Junkie Komodo',
  'lbj-scuba-junkie-komodo',
  'diving',
  'business',
  'diving',
  '["diving","tours","service"]'::jsonb,
  'Дайв-центр с погружениями в Комодо — один из ключевых сервисов города для туристов, ориентированных на подводный мир.',
  -8.4972,
  119.8875,
  'Labuan Bajo',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🌋 Mount Rinjani National Park (Lombok)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lom-mount-rinjani-national-park',
  'id',
  'lom',
  '🌋 Mount Rinjani National Park',
  'lom-mount-rinjani-national-park',
  'volcano',
  'showplace',
  'volcano',
  '["volcano","hiking","nature","national-park"]'::jsonb,
  'Главная природная достопримечательность Ломбока — вулкан Ринджани и национальный парк с треккингом к кратеру и озеру.',
  -8.4113,
  116.4573,
  'Rinjani National Park, Lombok',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🏝️ Gili Islands (Lombok)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lom-gili-islands',
  'id',
  'lom',
  '🏝️ Gili Islands',
  'lom-gili-islands',
  'islands',
  'showplace',
  'islands',
  '["islands","snorkeling","beach"]'::jsonb,
  'Три знаменитых острова у северо-западного Ломбока с белыми пляжами, сноркелингом и расслабленной атмосферой.',
  -8.3498,
  116.0385,
  'Gili Islands, North Lombok',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🏖️ Kuta Lombok (Lombok)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lom-kuta-lombok',
  'id',
  'lom',
  '🏖️ Kuta Lombok',
  'lom-kuta-lombok',
  'beach',
  'showplace',
  'beach',
  '["beach","surf","resort"]'::jsonb,
  'Курортная зона южного Ломбока с длинными пляжами, серф-спотами и инфраструктурой Mandalika.',
  -8.8917,
  116.2819,
  'Kuta, Lombok',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🏝️ Tanjung Aan Beach (Lombok)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lom-tanjung-aan-beach',
  'id',
  'lom',
  '🏝️ Tanjung Aan Beach',
  'lom-tanjung-aan-beach',
  'beach',
  'showplace',
  'beach',
  '["beach","lagoon","nature"]'::jsonb,
  'Один из самых красивых пляжей южного Ломбока с белым песком и бирюзовой водой.',
  -8.9075,
  116.3167,
  'Tanjung Aan, Lombok',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 💦 Sendang Gile Waterfall (Lombok)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lom-sendang-gile-waterfall',
  'id',
  'lom',
  '💦 Sendang Gile Waterfall',
  'lom-sendang-gile-waterfall',
  'waterfall',
  'showplace',
  'waterfall',
  '["waterfall","nature","jungle"]'::jsonb,
  'Красивый водопад у деревни Senaru — популярная остановка на пути к Ринджани.',
  -8.3125,
  116.4041,
  'Senaru, North Lombok',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🏄 Selong Belanak Beach (Lombok)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lom-selong-belanak-beach',
  'id',
  'lom',
  '🏄 Selong Belanak Beach',
  'lom-selong-belanak-beach',
  'beach',
  'showplace',
  'beach',
  '["beach","surf","beginner"]'::jsonb,
  'Широкий пляж с мягким песком и спокойной водой, популярный у начинающих серферов.',
  -8.8793,
  116.1734,
  'Selong Belanak, Lombok',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: ☕ Ashtari Lounge & Kitchen (Lombok)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lom-ashtari-lounge-kitchen',
  'id',
  'lom',
  '☕ Ashtari Lounge & Kitchen',
  'lom-ashtari-lounge-kitchen',
  'cafe',
  'business',
  'cafe',
  '["cafe","view","brunch"]'::jsonb,
  'Атмосферное кафе на холме рядом с Kuta Lombok с панорамным видом на побережье.',
  -8.9052,
  116.2969,
  'Kuta Lombok area',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🥐 El Bazar Café & Restaurant (Lombok)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lom-el-bazar-cafe-restaurant',
  'id',
  'lom',
  '🥐 El Bazar Café & Restaurant',
  'lom-el-bazar-cafe-restaurant',
  'cafe',
  'business',
  'cafe',
  '["cafe","breakfast","coffee"]'::jsonb,
  'Популярное кафе в Kuta Lombok с кофе, завтраками и интернациональной кухней.',
  -8.8973,
  116.281,
  'Kuta, Lombok',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🌮 The Mexican in Lombok (Lombok)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lom-the-mexican-in-lombok',
  'id',
  'lom',
  '🌮 The Mexican in Lombok',
  'lom-the-mexican-in-lombok',
  'cafe',
  'business',
  'cafe',
  '["cafe","international","fast-casual"]'::jsonb,
  'Небольшое популярное кафе с мексиканской кухней — тако, буррито и быстрые перекусы после серфинга.',
  -8.897,
  116.2792,
  'Kuta, Lombok',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🦞 Senggigi Seafood Market & BBQ (Lombok)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lom-senggigi-seafood-market-bbq',
  'id',
  'lom',
  '🦞 Senggigi Seafood Market & BBQ',
  'lom-senggigi-seafood-market-bbq',
  'seafood',
  'business',
  'seafood',
  '["seafood","bbq","local"]'::jsonb,
  'Место у моря в районе Senggigi, где можно выбрать свежие морепродукты и приготовить их на гриле.',
  -8.4916,
  116.0438,
  'Senggigi, Lombok',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: ☕ Lombok Coffee House (Lombok)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lom-lombok-coffee-house',
  'id',
  'lom',
  '☕ Lombok Coffee House',
  'lom-lombok-coffee-house',
  'coffee',
  'business',
  'coffee',
  '["coffee","cafe","work-friendly"]'::jsonb,
  'Кофейня в Kuta Lombok со specialty-кофе и спокойной атмосферой для работы и отдыха.',
  -8.8979,
  116.2817,
  'Kuta, Lombok',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🏄 Surf Shack Lombok (Lombok)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'lom-surf-shack-lombok',
  'id',
  'lom',
  '🏄 Surf Shack Lombok',
  'lom-surf-shack-lombok',
  'surf',
  'business',
  'surf',
  '["surf","rental","lessons"]'::jsonb,
  'Серф-школа и прокат досок в районе Kuta Lombok — удобный сервис для новичков и продолжающих.',
  -8.8926,
  116.2824,
  'Kuta Lombok',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🏯 Borobudur Temple (Yogyakarta)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'yog-borobudur-temple',
  'id',
  'yog',
  '🏯 Borobudur Temple',
  'yog-borobudur-temple',
  'unesco',
  'showplace',
  'unesco',
  '["unesco","temple","buddhism","landmark"]'::jsonb,
  'Самый большой буддийский храм в мире и объект Всемирного наследия ЮНЕСКО, расположенный недалеко от Джокьякарты.',
  -7.6079,
  110.2038,
  'Borobudur, Magelang',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🏛 Prambanan Temple (Yogyakarta)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'yog-prambanan-temple',
  'id',
  'yog',
  '🏛 Prambanan Temple',
  'yog-prambanan-temple',
  'unesco',
  'showplace',
  'unesco',
  '["unesco","temple","hinduism","architecture"]'::jsonb,
  'Крупнейший индуистский храмовый комплекс в Индонезии, посвящённый Шиве.',
  -7.752,
  110.4916,
  'Prambanan, Sleman',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🏰 Kraton Yogyakarta (Yogyakarta)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'yog-kraton-yogyakarta',
  'id',
  'yog',
  '🏰 Kraton Yogyakarta',
  'yog-kraton-yogyakarta',
  'palace',
  'showplace',
  'palace',
  '["palace","heritage","culture","royal"]'::jsonb,
  'Резиденция султана Джокьякарты и центр культуры и традиций королевства.',
  -7.8014,
  110.364,
  'Jl. Rotowijayan, Yogyakarta',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 💧 Taman Sari Water Castle (Yogyakarta)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'yog-taman-sari-water-castle',
  'id',
  'yog',
  '💧 Taman Sari Water Castle',
  'yog-taman-sari-water-castle',
  'palace',
  'showplace',
  'palace',
  '["palace","water-garden","history"]'::jsonb,
  'Бывший королевский водный сад и купальни XVIII века.',
  -7.803,
  110.363,
  'Jl. Taman, Yogyakarta',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🛍 Malioboro Street (Yogyakarta)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'yog-malioboro-street',
  'id',
  'yog',
  '🛍 Malioboro Street',
  'yog-malioboro-street',
  'market',
  'showplace',
  'market',
  '["market","shopping","street","night"]'::jsonb,
  'Главная торговая улица Джокьякарты с сувенирами, едой и уличной жизнью.',
  -7.797,
  110.369,
  'Jl. Malioboro, Yogyakarta',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🌋 Mount Merapi (Yogyakarta)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'yog-mount-merapi',
  'id',
  'yog',
  '🌋 Mount Merapi',
  'yog-mount-merapi',
  'volcano',
  'showplace',
  'volcano',
  '["volcano","adventure","nature"]'::jsonb,
  'Активный вулкан к северу от Джокьякарты, популярный для джип-туров и восхождений.',
  -7.5442,
  110.4478,
  'Mount Merapi, Sleman',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🍛 Gudeg Yu Djum (Yogyakarta)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'yog-gudeg-yu-djum',
  'id',
  'yog',
  '🍛 Gudeg Yu Djum',
  'yog-gudeg-yu-djum',
  'local-food',
  'business',
  'local-food',
  '["local-food","gudeg","heritage"]'::jsonb,
  'Легендарный ресторан, специализирующийся на gudeg — традиционном блюде Джокьякарты из молодого баньян-дерева.',
  -7.795,
  110.37,
  'Jl. Kaliurang, Yogyakarta',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🍚 Nasi Kucing Angkringan Lik Man (Yogyakarta)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'yog-nasi-kucing-angkringan-lik-man',
  'id',
  'yog',
  '🍚 Nasi Kucing Angkringan Lik Man',
  'yog-nasi-kucing-angkringan-lik-man',
  'street-food',
  'business',
  'street-food',
  '["street-food","night","local"]'::jsonb,
  'Знаменитая точка уличной еды, где подают nasi kucing — маленькие порции риса с начинками.',
  -7.798,
  110.3695,
  'Jl. Malioboro, Yogyakarta',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: ☕ Via Via Café (Yogyakarta)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'yog-via-via-cafe',
  'id',
  'yog',
  '☕ Via Via Café',
  'yog-via-via-cafe',
  'cafe',
  'business',
  'cafe',
  '["cafe","international","view"]'::jsonb,
  'Популярное кафе с международной кухней и видом на улицу Malioboro.',
  -7.7975,
  110.3692,
  'Jl. Prawirotaman, Yogyakarta',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🍽 Milas Restaurant (Yogyakarta)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'yog-milas-restaurant',
  'id',
  'yog',
  '🍽 Milas Restaurant',
  'yog-milas-restaurant',
  'organic',
  'business',
  'organic',
  '["organic","healthy","javanese"]'::jsonb,
  'Ресторан органической яванской кухни в саду, ориентированный на осознанное питание.',
  -7.792,
  110.375,
  'Jl. Prawirotaman, Yogyakarta',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: ☕ Sosro Coffee (Yogyakarta)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'yog-sosro-coffee',
  'id',
  'yog',
  '☕ Sosro Coffee',
  'yog-sosro-coffee',
  'coffee',
  'business',
  'coffee',
  '["coffee","heritage","traditional"]'::jsonb,
  'Историческая кофейня с 1930 года, известная традиционным яванским кофе.',
  -7.796,
  110.371,
  'Jl. Sosrowijayan, Yogyakarta',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();

-- Place: 🍽 Abhayagiri Restaurant (Yogyakarta)
INSERT INTO places (
  id, country_id, city_id, name, slug, type, place_kind, category,
  tags, description_short, lat, lng, address, website, phone,
  instagram, google_maps_url, price_level, created_at, updated_at
) VALUES (
  'yog-abhayagiri-restaurant',
  'id',
  'yog',
  '🍽 Abhayagiri Restaurant',
  'yog-abhayagiri-restaurant',
  'fine-dining',
  'business',
  'fine-dining',
  '["fine-dining","javanese","heritage"]'::jsonb,
  'Элегантный ресторан в колониальном особняке с авторской яванской кухней.',
  -7.793,
  110.374,
  'Jl. Prawirotaman, Yogyakarta',
  '—',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  place_kind = EXCLUDED.place_kind,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  description_short = EXCLUDED.description_short,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  phone = EXCLUDED.phone,
  instagram = EXCLUDED.instagram,
  google_maps_url = EXCLUDED.google_maps_url,
  price_level = EXCLUDED.price_level,
  updated_at = NOW();
