-- Smoke-check Thailand import

-- 1) counts
SELECT count(*) AS th_places
FROM places
WHERE country_id = 'th';

SELECT count(*) AS th_overview_blocks_ru
FROM content_blocks cb
JOIN places p ON p.id = cb.entity_id
WHERE cb.entity_type = 'place'
  AND cb.tab_key = 'overview'
  AND cb.lang = 'ru'
  AND p.country_id = 'th';

-- 2) Check for duplicate slugs
SELECT slug, count(*) AS cnt
FROM places
WHERE country_id = 'th'
GROUP BY slug
HAVING count(*) > 1;

-- 3) Quick integrity samples: non-empty markdown
-- Pick a few likely-stable slugs from the canon file.
SELECT p.slug, length(cb.body_markdown) AS md_length
FROM places p
JOIN content_blocks cb
  ON cb.entity_type = 'place'
 AND cb.entity_id = p.id
 AND cb.tab_key = 'overview'
 AND cb.lang = 'ru'
WHERE p.slug IN (
  'bkk-grand-palace',
  'cnx-wat-phra-that-doi-suthep',
  'phk-patong-beach'
)
ORDER BY p.slug;
