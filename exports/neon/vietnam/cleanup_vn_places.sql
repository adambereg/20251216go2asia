-- Cleanup Vietnam places + content blocks (staging re-import helper)
-- Safe if Vietnam is isolated to these city_id prefixes.
-- Order matters: content_blocks -> places.

-- VN city_id prefixes used by this import:
-- hue, hoi, dad, dla, ntr, phu, han, sgn

DELETE FROM content_blocks
WHERE entity_type = 'place'
  AND (
    entity_id LIKE 'hue-%' OR
    entity_id LIKE 'hoi-%' OR
    entity_id LIKE 'dad-%' OR
    entity_id LIKE 'dla-%' OR
    entity_id LIKE 'ntr-%' OR
    entity_id LIKE 'phu-%' OR
    entity_id LIKE 'han-%' OR
    entity_id LIKE 'sgn-%'
  );

DELETE FROM places
WHERE country_id = 'vn'
  AND (
    id LIKE 'hue-%' OR
    id LIKE 'hoi-%' OR
    id LIKE 'dad-%' OR
    id LIKE 'dla-%' OR
    id LIKE 'ntr-%' OR
    id LIKE 'phu-%' OR
    id LIKE 'han-%' OR
    id LIKE 'sgn-%'
  );

