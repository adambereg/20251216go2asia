-- Atlas cities hardening:
-- - Add/Backfill cities.names (jsonb) for RU/EN names
-- - Merge duplicated "SEO wave" cities into canonical short-id cities
-- - Create aliases for backward-compatible routing
--
-- Canon pairs:
-- - sin <- sgp (singapore)
-- - kul <- kll (kuala-lumpur)
-- - hkt <- phk (phuket)
-- - jog <- yog (yogyakarta)
-- - svn <- svk (savannakhet)
-- - mlk <- mkz (melaka)

-- 0) Ensure names.ru is at least present
UPDATE cities
SET names = jsonb_build_object('ru', name)
WHERE names IS NULL;

--> statement-breakpoint
-- 1) Singapore: sin <- sgp
UPDATE cities SET slug = slug || '__dup__' WHERE id = 'sgp' AND slug = 'singapore';
UPDATE cities
SET
  slug = 'singapore',
  names = jsonb_set(
    COALESCE(names, '{}'::jsonb),
    '{en}',
    to_jsonb((SELECT name FROM cities WHERE id = 'sgp')),
    true
  ),
  updated_at = now()
WHERE id = 'sin';
INSERT INTO city_aliases (country_id, alias_slug, city_id, created_at, updated_at)
SELECT c.country_id, a.alias_slug, c.id, now(), now()
FROM cities c
JOIN (
  VALUES ('sin'), ('sgp'), ('singapore')
) AS a(alias_slug) ON true
WHERE c.id = 'sin'
ON CONFLICT (country_id, alias_slug) DO NOTHING;
UPDATE places SET city_id = 'sin' WHERE city_id = 'sgp';
UPDATE events SET city_id = 'sin' WHERE city_id = 'sgp';
UPDATE content_blocks SET entity_id = 'sin' WHERE entity_type = 'city' AND entity_id = 'sgp';
DELETE FROM cities WHERE id = 'sgp';

--> statement-breakpoint
-- 2) Kuala Lumpur: kul <- kll
UPDATE cities SET slug = slug || '__dup__' WHERE id = 'kll' AND slug = 'kuala-lumpur';
UPDATE cities
SET
  slug = 'kuala-lumpur',
  names = jsonb_set(
    COALESCE(names, '{}'::jsonb),
    '{en}',
    to_jsonb((SELECT name FROM cities WHERE id = 'kll')),
    true
  ),
  updated_at = now()
WHERE id = 'kul';
INSERT INTO city_aliases (country_id, alias_slug, city_id, created_at, updated_at)
SELECT c.country_id, a.alias_slug, c.id, now(), now()
FROM cities c
JOIN (
  VALUES ('kul'), ('kll'), ('kuala-lumpur')
) AS a(alias_slug) ON true
WHERE c.id = 'kul'
ON CONFLICT (country_id, alias_slug) DO NOTHING;
UPDATE places SET city_id = 'kul' WHERE city_id = 'kll';
UPDATE events SET city_id = 'kul' WHERE city_id = 'kll';
UPDATE content_blocks SET entity_id = 'kul' WHERE entity_type = 'city' AND entity_id = 'kll';
DELETE FROM cities WHERE id = 'kll';

--> statement-breakpoint
-- 3) Phuket: hkt <- phk
UPDATE cities SET slug = slug || '__dup__' WHERE id = 'phk' AND slug = 'phuket';
UPDATE cities
SET
  slug = 'phuket',
  names = jsonb_set(
    COALESCE(names, '{}'::jsonb),
    '{en}',
    to_jsonb((SELECT name FROM cities WHERE id = 'phk')),
    true
  ),
  updated_at = now()
WHERE id = 'hkt';
INSERT INTO city_aliases (country_id, alias_slug, city_id, created_at, updated_at)
SELECT c.country_id, a.alias_slug, c.id, now(), now()
FROM cities c
JOIN (
  VALUES ('hkt'), ('phk'), ('phuket')
) AS a(alias_slug) ON true
WHERE c.id = 'hkt'
ON CONFLICT (country_id, alias_slug) DO NOTHING;
UPDATE places SET city_id = 'hkt' WHERE city_id = 'phk';
UPDATE events SET city_id = 'hkt' WHERE city_id = 'phk';
UPDATE content_blocks SET entity_id = 'hkt' WHERE entity_type = 'city' AND entity_id = 'phk';
DELETE FROM cities WHERE id = 'phk';

--> statement-breakpoint
-- 4) Yogyakarta: jog <- yog
UPDATE cities SET slug = slug || '__dup__' WHERE id = 'yog' AND slug = 'yogyakarta';
UPDATE cities
SET
  slug = 'yogyakarta',
  names = jsonb_set(
    COALESCE(names, '{}'::jsonb),
    '{en}',
    to_jsonb((SELECT name FROM cities WHERE id = 'yog')),
    true
  ),
  updated_at = now()
WHERE id = 'jog';
INSERT INTO city_aliases (country_id, alias_slug, city_id, created_at, updated_at)
SELECT c.country_id, a.alias_slug, c.id, now(), now()
FROM cities c
JOIN (
  VALUES ('jog'), ('yog'), ('yogyakarta')
) AS a(alias_slug) ON true
WHERE c.id = 'jog'
ON CONFLICT (country_id, alias_slug) DO NOTHING;
UPDATE places SET city_id = 'jog' WHERE city_id = 'yog';
UPDATE events SET city_id = 'jog' WHERE city_id = 'yog';
UPDATE content_blocks SET entity_id = 'jog' WHERE entity_type = 'city' AND entity_id = 'yog';
DELETE FROM cities WHERE id = 'yog';

--> statement-breakpoint
-- 5) Savannakhet: svn <- svk
UPDATE cities SET slug = slug || '__dup__' WHERE id = 'svk' AND slug = 'savannakhet';
UPDATE cities
SET
  slug = 'savannakhet',
  names = jsonb_set(
    COALESCE(names, '{}'::jsonb),
    '{en}',
    to_jsonb((SELECT name FROM cities WHERE id = 'svk')),
    true
  ),
  updated_at = now()
WHERE id = 'svn';
INSERT INTO city_aliases (country_id, alias_slug, city_id, created_at, updated_at)
SELECT c.country_id, a.alias_slug, c.id, now(), now()
FROM cities c
JOIN (
  VALUES ('svn'), ('svk'), ('savannakhet')
) AS a(alias_slug) ON true
WHERE c.id = 'svn'
ON CONFLICT (country_id, alias_slug) DO NOTHING;
UPDATE places SET city_id = 'svn' WHERE city_id = 'svk';
UPDATE events SET city_id = 'svn' WHERE city_id = 'svk';
UPDATE content_blocks SET entity_id = 'svn' WHERE entity_type = 'city' AND entity_id = 'svk';
DELETE FROM cities WHERE id = 'svk';

--> statement-breakpoint
-- 6) Melaka: mlk <- mkz
UPDATE cities SET slug = slug || '__dup__' WHERE id = 'mkz' AND slug = 'melaka';
UPDATE cities
SET
  slug = 'melaka',
  names = jsonb_set(
    COALESCE(names, '{}'::jsonb),
    '{en}',
    to_jsonb((SELECT name FROM cities WHERE id = 'mkz')),
    true
  ),
  updated_at = now()
WHERE id = 'mlk';
INSERT INTO city_aliases (country_id, alias_slug, city_id, created_at, updated_at)
SELECT c.country_id, a.alias_slug, c.id, now(), now()
FROM cities c
JOIN (
  VALUES ('mlk'), ('mkz'), ('melaka')
) AS a(alias_slug) ON true
WHERE c.id = 'mlk'
ON CONFLICT (country_id, alias_slug) DO NOTHING;
UPDATE places SET city_id = 'mlk' WHERE city_id = 'mkz';
UPDATE events SET city_id = 'mlk' WHERE city_id = 'mkz';
UPDATE content_blocks SET entity_id = 'mlk' WHERE entity_type = 'city' AND entity_id = 'mkz';
DELETE FROM cities WHERE id = 'mkz';

