# Neon Postgres Export - Atlas Places (Content Canon v1)

## Overview

This directory contains exported data from Atlas Content Canon v1 markdown files for import into Neon Postgres.

**Generated:** 2026-02-06T12:25:26.481Z  
**Country:** Indonesia (`id`)  
**Total places:** 60

## Files

- `places.sql` - SQL UPSERT statements for places and content_blocks tables
- `places.csv` - CSV export for places table
- `content_blocks.csv` - CSV export for content_blocks table

## Import Instructions

### Option 1: SQL Import (Recommended)

Using Neon Console SQL Editor or psql:

```bash
psql $DATABASE_URL < places.sql
```

Or via Neon Console:
1. Open SQL Editor
2. Copy contents of `places.sql`
3. Execute

### Option 2: CSV Import

Using psql \copy:

```bash
psql $DATABASE_URL <<EOF
\copy places FROM 'places.csv' WITH (FORMAT csv, HEADER true);
\copy content_blocks FROM 'content_blocks.csv' WITH (FORMAT csv, HEADER true);
EOF
```

**Note:** CSV import requires files to be accessible from the database server. For Neon, use SQL import or upload via Neon Console.

## Schema Notes

- `places.slug` is globally unique (conflict resolution via ON CONFLICT)
- `places.id` format: `{city_id}-{slug}`
- `content_blocks.entity_id` references `places.id`
- Coordinates stored in `lat`/`lng` columns (numeric precision 9,6)
- Tags stored as JSONB array

## City ID Mapping

- Bali → `bali`
- Jakarta → `jkt`
- Yogyakarta → `yog`
- Labuan Bajo → `lbj`
- Lombok → `lom`

## Validation

Before import, verify:
1. Country `id` exists in `countries` table
2. All city IDs exist in `cities` table
3. No duplicate slugs (SQL handles this via ON CONFLICT)

## Rollback

To remove imported data:

```sql
DELETE FROM content_blocks
WHERE entity_type = 'place'
  AND entity_id IN (SELECT id FROM places WHERE country_id = 'id');

DELETE FROM places
WHERE country_id = 'id';
```
