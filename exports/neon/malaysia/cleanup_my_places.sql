-- Cleanup Malaysia places + content blocks (staging re-import helper)
-- Safe if Malaysia is isolated to these city_id prefixes.
-- Order matters: content_blocks -> places.

-- MY city_id prefixes used by this import:
-- kll, png, lgk, mkz, bki

DELETE FROM content_blocks
WHERE entity_type = 'place'
  AND (
    entity_id LIKE 'kll-%' OR
    entity_id LIKE 'png-%' OR
    entity_id LIKE 'lgk-%' OR
    entity_id LIKE 'mkz-%' OR
    entity_id LIKE 'bki-%'
  );

DELETE FROM places
WHERE country_id = 'my'
  AND (
    id LIKE 'kll-%' OR
    id LIKE 'png-%' OR
    id LIKE 'lgk-%' OR
    id LIKE 'mkz-%' OR
    id LIKE 'bki-%'
  );
