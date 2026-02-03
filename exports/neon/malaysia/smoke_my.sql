-- Smoke-check Malaysia import

-- 1) counts
SELECT count(*) AS my_places
FROM places
WHERE country_id = 'my';

SELECT count(*) AS my_overview_blocks_ru
FROM content_blocks cb
JOIN places p ON p.id = cb.entity_id
WHERE cb.entity_type = 'place'
  AND cb.tab_key = 'overview'
  AND cb.lang = 'ru'
  AND p.country_id = 'my';

-- 2) Check for duplicate slugs
SELECT slug, count(*) AS cnt
FROM places
WHERE country_id = 'my'
GROUP BY slug
HAVING count(*) > 1;

-- 3) Quick integrity samples: non-empty markdown
-- Pick a few likely-stable slugs from the canon file (one per city).
SELECT p.slug, length(cb.body_markdown) AS md_length
FROM places p
JOIN content_blocks cb
  ON cb.entity_type = 'place'
 AND cb.entity_id = p.id
 AND cb.tab_key = 'overview'
 AND cb.lang = 'ru'
WHERE p.slug IN (
  'kll-petronas-twin-towers',
  'png-kek-lok-si-temple',
  'lgk-langkawi-sky-bridge'
)
ORDER BY p.slug;
