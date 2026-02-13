-- Cleanup Singapore places + content blocks (staging re-import helper)
-- Safe if Singapore is isolated to this city_id prefix.
-- Order matters: content_blocks -> places.

-- SG city_id prefix used by this import:
-- sgp

DELETE FROM content_blocks
WHERE entity_type = 'place'
  AND entity_id LIKE 'sgp-%';

DELETE FROM places
WHERE country_id = 'sg'
  AND id LIKE 'sgp-%';
