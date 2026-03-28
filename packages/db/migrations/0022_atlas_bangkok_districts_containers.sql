-- ============================================================================
-- 0022_atlas_bangkok_districts_containers.sql
-- Bangkok pilot: Atlas district/container foundation (bounded scope)
-- Scope: Thailand / Bangkok only
-- ============================================================================

CREATE TABLE IF NOT EXISTS "city_districts" (
  "id" text PRIMARY KEY,
  "country_id" text NOT NULL REFERENCES "countries"("id"),
  "city_id" text NOT NULL REFERENCES "cities"("id"),
  "slug" varchar(255) NOT NULL,
  "name" varchar(255) NOT NULL,
  "name_local" varchar(255),
  "description_short" text,
  "body_markdown" text,
  "sort_order" integer NOT NULL DEFAULT 100,
  "is_published" boolean NOT NULL DEFAULT false,
  "lat" numeric(9, 6),
  "lng" numeric(9, 6),
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  CONSTRAINT "city_districts_city_slug_unique" UNIQUE ("city_id", "slug")
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_city_districts_country_id" ON "city_districts" ("country_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_city_districts_city_id" ON "city_districts" ("city_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_city_districts_published_sort" ON "city_districts" ("city_id", "is_published", "sort_order");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "place_containers" (
  "id" text PRIMARY KEY,
  "country_id" text NOT NULL REFERENCES "countries"("id"),
  "city_id" text NOT NULL REFERENCES "cities"("id"),
  "district_id" text NOT NULL REFERENCES "city_districts"("id"),
  "slug" varchar(255) NOT NULL,
  "name" varchar(255) NOT NULL,
  "container_type" varchar(100) NOT NULL DEFAULT 'generic',
  "description_short" text,
  "lat" numeric(9, 6),
  "lng" numeric(9, 6),
  "is_published" boolean NOT NULL DEFAULT false,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  CONSTRAINT "place_containers_city_slug_unique" UNIQUE ("city_id", "slug")
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_place_containers_country_id" ON "place_containers" ("country_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_place_containers_city_id" ON "place_containers" ("city_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_place_containers_district_id" ON "place_containers" ("district_id");
--> statement-breakpoint

ALTER TABLE "places" ADD COLUMN IF NOT EXISTS "district_id" text;
--> statement-breakpoint
ALTER TABLE "places" ADD COLUMN IF NOT EXISTS "container_id" text;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'places_district_id_city_districts_id_fk') THEN
    ALTER TABLE "places"
      ADD CONSTRAINT "places_district_id_city_districts_id_fk"
      FOREIGN KEY ("district_id") REFERENCES "city_districts"("id") ON DELETE SET NULL;
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'places_container_id_place_containers_id_fk') THEN
    ALTER TABLE "places"
      ADD CONSTRAINT "places_container_id_place_containers_id_fk"
      FOREIGN KEY ("container_id") REFERENCES "place_containers"("id") ON DELETE SET NULL;
  END IF;
END $$;
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_places_district_id" ON "places" ("district_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_places_container_id" ON "places" ("container_id");
--> statement-breakpoint

WITH target_city AS (
  SELECT co.id AS country_id, ci.id AS city_id
  FROM countries co
  JOIN cities ci ON ci.country_id = co.id
  WHERE co.slug = 'thailand' AND ci.slug = 'bangkok'
  LIMIT 1
)
INSERT INTO city_districts (
  id, country_id, city_id, slug, name, name_local, description_short, body_markdown, sort_order, is_published
)
SELECT
  d.id,
  tc.country_id,
  tc.city_id,
  d.slug,
  d.name,
  d.name_local,
  d.description_short,
  d.body_markdown,
  d.sort_order,
  true
FROM target_city tc
JOIN (
  VALUES
    ('bkk-district-bang-kho-laem', 'bang-kho-laem', 'Bang Kho Laem', 'บางคอแหลม', 'Район у Chao Phraya с riverfront-локациями и вечерними прогулками.', 'Район Bang Kho Laem покрывает riverfront-зону Бангкока и используется как структурная основа для Asiatique в Bangkok pilot.', 10),
    ('bkk-district-sathon', 'sathon', 'Sathon', 'สาทร', 'Современный деловой район с rooftop-локациями и ресторанами.', 'Sathon в pilot фиксируется как district для city-layer и place linkage, включая Blue Elephant и Vertigo/Moon Bar.', 20),
    ('bkk-district-chatuchak', 'chatuchak', 'Chatuchak', 'จตุจักร', 'Район крупнейшего рынка Chatuchak Weekend Market.', 'Chatuchak используется как district для market-heavy кластеров и place linkage в Bangkok pilot.', 30),
    ('bkk-district-samphanthawong', 'samphanthawong', 'Samphanthawong', 'สัมพันธวงศ์', 'Исторический район Chinatown и уличной еды.', 'Samphanthawong фиксируется как district для Chinatown-кластера в Bangkok pilot.', 40),
    ('bkk-district-phra-nakhon', 'phra-nakhon', 'Phra Nakhon', 'พระนคร', 'Историческое ядро Бангкока с храмами и дворцовыми зонами.', 'Phra Nakhon используется как district-основа для Grand Palace, Wat Pho и других исторических place-linkages.', 50),
    ('bkk-district-khlong-san', 'khlong-san', 'Khlong San', 'คลองสาน', 'Riverfront-район с современными mixed-use локациями.', 'Khlong San фиксируется как district для ICONSIAM и связанных riverfront places.', 60),
    ('bkk-district-bang-rak', 'bang-rak', 'Bang Rak', 'บางรัก', 'Центральный район с nightlife и высотными локациями.', 'Bang Rak используется как district для State Tower / Sirocco linkage в pilot-модели.', 70),
    ('bkk-district-bangkok-yai', 'bangkok-yai', 'Bangkok Yai', 'บางกอกใหญ่', 'Историческая зона Thonburi с Wat Arun.', 'Bangkok Yai фиксируется как district для Wat Arun и city district layer в Bangkok pilot.', 80)
) AS d(id, slug, name, name_local, description_short, body_markdown, sort_order) ON TRUE
ON CONFLICT (id) DO UPDATE
SET
  country_id = EXCLUDED.country_id,
  city_id = EXCLUDED.city_id,
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  name_local = EXCLUDED.name_local,
  description_short = EXCLUDED.description_short,
  body_markdown = EXCLUDED.body_markdown,
  sort_order = EXCLUDED.sort_order,
  is_published = EXCLUDED.is_published,
  updated_at = now();
--> statement-breakpoint

WITH target_city AS (
  SELECT co.id AS country_id, ci.id AS city_id
  FROM countries co
  JOIN cities ci ON ci.country_id = co.id
  WHERE co.slug = 'thailand' AND ci.slug = 'bangkok'
  LIMIT 1
),
district_map AS (
  SELECT id, slug
  FROM city_districts
  WHERE city_id = (SELECT city_id FROM target_city)
)
INSERT INTO place_containers (
  id, country_id, city_id, district_id, slug, name, container_type, description_short, is_published
)
SELECT
  c.id,
  tc.country_id,
  tc.city_id,
  d.id,
  c.slug,
  c.name,
  c.container_type,
  c.description_short,
  true
FROM target_city tc
JOIN (
  VALUES
    ('bkk-container-asiatique-the-riverfront', 'asiatique-the-riverfront', 'Asiatique The Riverfront', 'riverfront-complex', 'bang-kho-laem', 'Крупный riverfront-комплекс с магазинами, ресторанами и вечерними развлечениями.'),
    ('bkk-container-chatuchak-weekend-market', 'chatuchak-weekend-market', 'Chatuchak Weekend Market', 'market-complex', 'chatuchak', 'Большой рыночный комплекс из множества торговых секций и food-зон.'),
    ('bkk-container-chinatown-bangkok', 'chinatown-bangkok', 'Chinatown Bangkok', 'urban-area-cluster', 'samphanthawong', 'Городской кластер вокруг Yaowarat с насыщенной street-food и исторической средой.'),
    ('bkk-container-grand-palace', 'grand-palace', 'Grand Palace', 'palace-complex', 'phra-nakhon', 'Дворцовый комплекс исторического значения, выступающий container-сущностью в pilot-модели.'),
    ('bkk-container-iconsiam', 'iconsiam', 'ICONSIAM', 'mixed-use-complex', 'khlong-san', 'Крупный mixed-use riverfront-комплекс для шопинга, еды и событийных сценариев.'),
    ('bkk-container-state-tower', 'state-tower', 'State Tower', 'tower', 'bang-rak', 'Высотное здание с rooftop/hospitality локациями.'),
    ('bkk-container-banyan-tree-bangkok', 'banyan-tree-bangkok', 'Banyan Tree Bangkok', 'hotel', 'sathon', 'Гостиничный объект, внутри которого расположен Vertigo & Moon Bar.')
) AS c(id, slug, name, container_type, district_slug, description_short) ON TRUE
JOIN district_map d ON d.slug = c.district_slug
ON CONFLICT (id) DO UPDATE
SET
  country_id = EXCLUDED.country_id,
  city_id = EXCLUDED.city_id,
  district_id = EXCLUDED.district_id,
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  container_type = EXCLUDED.container_type,
  description_short = EXCLUDED.description_short,
  is_published = EXCLUDED.is_published,
  updated_at = now();
--> statement-breakpoint

WITH target_city AS (
  SELECT co.id AS country_id, ci.id AS city_id
  FROM countries co
  JOIN cities ci ON ci.country_id = co.id
  WHERE co.slug = 'thailand' AND ci.slug = 'bangkok'
  LIMIT 1
),
district_map AS (
  SELECT id, slug
  FROM city_districts
  WHERE city_id = (SELECT city_id FROM target_city)
),
container_map AS (
  SELECT id, slug
  FROM place_containers
  WHERE city_id = (SELECT city_id FROM target_city)
),
place_mapping AS (
  SELECT *
  FROM (
    VALUES
      ('bkk-asiatique-the-riverfront', 'bang-kho-laem', 'asiatique-the-riverfront'),
      ('bkk-blue-elephant-bangkok', 'sathon', NULL),
      ('bkk-chatuchak-weekend-market', 'chatuchak', 'chatuchak-weekend-market'),
      ('bkk-chinatown', 'samphanthawong', 'chinatown-bangkok'),
      ('bkk-grand-palace', 'phra-nakhon', 'grand-palace'),
      ('bkk-iconsiam', 'khlong-san', 'iconsiam'),
      ('bkk-jay-fai', 'phra-nakhon', NULL),
      ('bkk-sirocco-sky-bar', 'bang-rak', 'state-tower'),
      ('bkk-thipsamai-pad-thai', 'phra-nakhon', NULL),
      ('bkk-vertigo-moon-bar', 'sathon', 'banyan-tree-bangkok'),
      ('bkk-wat-arun', 'bangkok-yai', NULL),
      ('bkk-wat-pho', 'phra-nakhon', NULL)
  ) AS x(place_slug, district_slug, container_slug)
)
UPDATE places p
SET
  country_id = tc.country_id,
  city_id = tc.city_id,
  district_id = d.id,
  container_id = c.id,
  updated_at = now()
FROM target_city tc
JOIN place_mapping pm ON pm.place_slug = p.slug
JOIN district_map d ON d.slug = pm.district_slug
LEFT JOIN container_map c ON c.slug = pm.container_slug
WHERE p.slug = pm.place_slug
  AND (p.country_id = tc.country_id OR p.country_id IS NULL OR p.country_id = '')
  AND (p.city_id = tc.city_id OR p.city_id IS NULL OR p.city_id = '');
