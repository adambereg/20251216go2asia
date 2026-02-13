-- Cleanup Laos places + content blocks (staging re-import helper)
-- Safe if Laos is isolated to these city_id prefixes.
-- Order matters: content_blocks -> places.

-- LA city_id prefixes used by this import:
-- lpq, vte, vvg, pkz, svk

DELETE FROM content_blocks
WHERE entity_type = 'place'
  AND (
    entity_id LIKE 'lpq-%' OR
    entity_id LIKE 'vte-%' OR
    entity_id LIKE 'vvg-%' OR
    entity_id LIKE 'pkz-%' OR
    entity_id LIKE 'svk-%'
  );

DELETE FROM places
WHERE country_id = 'la'
  AND (
    id LIKE 'lpq-%' OR
    id LIKE 'vte-%' OR
    id LIKE 'vvg-%' OR
    id LIKE 'pkz-%' OR
    id LIKE 'svk-%'
  );
