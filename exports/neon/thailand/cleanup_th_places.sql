-- Cleanup Thailand places + content blocks (staging re-import helper)
-- Safe if Thailand is isolated to these city_id prefixes.
-- Order matters: content_blocks -> places.

-- TH city_id prefixes used by this import:
-- bkk, cnx, phk, pty, kbi, usm, hhn, aya

DELETE FROM content_blocks
WHERE entity_type = 'place'
  AND (
    entity_id LIKE 'bkk-%' OR
    entity_id LIKE 'cnx-%' OR
    entity_id LIKE 'phk-%' OR
    entity_id LIKE 'pty-%' OR
    entity_id LIKE 'kbi-%' OR
    entity_id LIKE 'usm-%' OR
    entity_id LIKE 'hhn-%' OR
    entity_id LIKE 'aya-%'
  );

DELETE FROM places
WHERE country_id = 'th'
  AND (
    id LIKE 'bkk-%' OR
    id LIKE 'cnx-%' OR
    id LIKE 'phk-%' OR
    id LIKE 'pty-%' OR
    id LIKE 'kbi-%' OR
    id LIKE 'usm-%' OR
    id LIKE 'hhn-%' OR
    id LIKE 'aya-%'
  );
