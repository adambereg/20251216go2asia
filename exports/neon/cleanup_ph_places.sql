-- Cleanup PH places and related content blocks (staging/dev only)
-- This removes PH places generated with city_id prefixes.
-- Use before re-importing places.sql

DELETE FROM content_blocks
WHERE entity_type = 'place'
  AND entity_id IN (
    SELECT id
    FROM places
    WHERE id LIKE 'mnl-%'
       OR id LIKE 'ceb-%'
       OR id LIKE 'pps-%'
       OR id LIKE 'tag-%'
       OR id LIKE 'boracay-%'
       OR id LIKE 'dumaguete-%'
       OR id LIKE 'srg-%'
  );

DELETE FROM places
WHERE id LIKE 'mnl-%'
   OR id LIKE 'ceb-%'
   OR id LIKE 'pps-%'
   OR id LIKE 'tag-%'
   OR id LIKE 'boracay-%'
   OR id LIKE 'dumaguete-%'
   OR id LIKE 'srg-%';
