-- Smoke-check Vietnam import

-- 1) counts
SELECT count(*) AS vn_places
FROM places
WHERE country_id = 'vn';

SELECT count(*) AS vn_overview_blocks_ru
FROM content_blocks cb
JOIN places p ON p.id = cb.entity_id
WHERE cb.entity_type = 'place'
  AND cb.tab_key = 'overview'
  AND cb.lang = 'ru'
  AND p.country_id = 'vn';

-- 2) quick integrity samples: non-empty markdown
-- Pick a few likely-stable slugs from the canon file.
SELECT p.slug, length(cb.body_markdown) AS md_length
FROM places p
JOIN content_blocks cb
  ON cb.entity_type = 'place'
 AND cb.entity_id = p.id
 AND cb.tab_key = 'overview'
 AND cb.lang = 'ru'
WHERE p.slug IN (
  'hue-imperial-city-hue',
  'hoi-hoi-an-ancient-town',
  'han-hoan-kiem-lake-ngoc-son-temple'
)
ORDER BY p.slug;

