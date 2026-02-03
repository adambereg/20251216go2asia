-- Cleanup Indonesia places + content blocks (staging re-import helper)
-- Safe if Indonesia is isolated to these city_id prefixes.
-- Order matters: content_blocks -> places.

-- ID city_id prefixes used by this import:
-- bali, jkt, yog, lbj, lom

DELETE FROM content_blocks
WHERE entity_type = 'place'
  AND (
    entity_id LIKE 'bali-%' OR
    entity_id LIKE 'jkt-%' OR
    entity_id LIKE 'yog-%' OR
    entity_id LIKE 'lbj-%' OR
    entity_id LIKE 'lom-%'
  );

DELETE FROM places
WHERE country_id = 'id'
  AND (
    id LIKE 'bali-%' OR
    id LIKE 'jkt-%' OR
    id LIKE 'yog-%' OR
    id LIKE 'lbj-%' OR
    id LIKE 'lom-%'
  );
