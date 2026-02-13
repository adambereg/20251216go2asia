# Neon Schema - Places (Atlas Content Canon v1)

## Overview

This document describes the database schema for Places in the Atlas Asia module, based on the Atlas Content Canon v1 format.

## Tables

### `places`

Stores place data (showplaces and commercial establishments).

**Primary Key:** `id` (text)

**Unique Constraints:**
- `slug` (globally unique)

**Indexes:**
- `idx_places_country_id` on `country_id`
- `idx_places_city_id` on `city_id`
- `idx_places_country_kind` on `(country_id, place_kind)`
- `idx_places_city_kind` on `(city_id, place_kind)`

**Columns:**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | text | NO | - | Primary key (format: `{city_id}-{slug}`) |
| `country_id` | text | YES | - | FK to `countries.id` |
| `city_id` | text | YES | - | FK to `cities.id` |
| `name` | varchar(255) | NO | - | Place name |
| `slug` | varchar(255) | NO | - | URL-friendly identifier (globally unique) |
| `type` | varchar(100) | NO | - | Legacy type (e.g., "attraction", "restaurant", "cafe") |
| `place_kind` | text | NO | 'showplace' | Type: `showplace` or `business` |
| `category` | text | YES | - | Category (e.g., "cafe", "temple", "waterfall") |
| `tags` | jsonb | YES | - | Array of tag strings |
| `description_short` | text | YES | - | Short description (max 500 chars) |
| `lat` | numeric(9,6) | YES | - | Latitude (preferred) |
| `lng` | numeric(9,6) | YES | - | Longitude (preferred) |
| `latitude` | numeric(9,6) | YES | - | Legacy latitude (deprecated) |
| `longitude` | numeric(9,6) | YES | - | Legacy longitude (deprecated) |
| `address` | text | YES | - | Physical address |
| `website` | text | YES | - | Website URL |
| `phone` | text | YES | - | Phone number |
| `instagram` | text | YES | - | Instagram handle/URL |
| `google_maps_url` | text | YES | - | Google Maps URL |
| `price_level` | text | YES | - | Price level (e.g., "budget", "mid-range", "luxury") |
| `hero_media_id` | text | YES | - | FK to `media_files.id` |
| `images` | jsonb | YES | - | Temporary: array of image URLs (deprecated) |
| `created_at` | timestamp | NO | NOW() | Creation timestamp |
| `updated_at` | timestamp | NO | NOW() | Update timestamp |

**Notes:**
- `slug` must be globally unique (not per-city)
- `place_kind` determines UI layout (`showplace` vs `business`)
- Coordinates use `lat`/`lng` (not `latitude`/`longitude`)
- `tags` stored as JSONB array: `["tag1", "tag2"]`

### `content_blocks`

Stores rich markdown content for places (and other entities).

**Primary Key:** `id` (uuid)

**Unique Constraints:**
- `(entity_type, entity_id, tab_key, lang)`

**Indexes:**
- `idx_content_blocks_entity` on `(entity_type, entity_id)`
- `idx_content_blocks_tab_lang` on `(tab_key, lang)`

**Columns:**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NO | gen_random_uuid() | Primary key |
| `entity_type` | text | NO | - | Entity type: `country`, `city`, or `place` |
| `entity_id` | text | NO | - | FK to entity (e.g., `places.id`) |
| `tab_key` | text | NO | - | Tab identifier (e.g., `overview`) |
| `lang` | text | NO | - | Language code (e.g., `ru`, `en`) |
| `title` | text | YES | - | Optional tab title |
| `body_markdown` | text | NO | - | Markdown content |
| `source` | text | NO | 'seed' | Source: `seed`, `editorial`, `ai`, `mixed` |
| `created_at` | timestamptz | NO | NOW() | Creation timestamp |
| `updated_at` | timestamptz | NO | NOW() | Update timestamp |

**Notes:**
- For places, `tab_key` is typically `overview`
- `body_markdown` contains full markdown with sections (## headers)
- `entity_id` references `places.id` (text, not uuid)

## Relationships

```
countries (id)
  └── cities (country_id → countries.id)
        └── places (city_id → cities.id, country_id → countries.id)
              └── content_blocks (entity_type='place', entity_id → places.id)
```

## City ID Mapping

| City Name | City ID | Notes |
|-----------|---------|-------|
| Manila | `mnl` | - |
| Cebu | `ceb` | - |
| Palawan | `pps` | Puerto Princesa |
| Bohol | `tag` | Tagbilaran |
| Boracay | `boracay` | - |
| Dumaguete | `dumaguete` | - |
| Siargao | `srg` | - |

## Place ID Format

Place IDs follow the pattern: `{city_id}-{slug}`

Examples:
- `mnl-intramuros`
- `ceb-basilica-del-santo-nino`
- `pps-tubbataha-reef`

## Enum Values

### `place_kind`
- `showplace` - Attractions, landmarks, natural sites
- `business` - Commercial establishments (restaurants, cafes, shops)

### `source` (content_blocks)
- `seed` - Seeded from markdown files
- `editorial` - Editorially verified content
- `ai` - AI-generated content
- `mixed` - Combination of sources

## Data Validation Rules

1. **Slug Uniqueness:** `slug` must be globally unique (enforced by unique constraint)
2. **Coordinates:** `lat` and `lng` must be valid numeric values (precision 9,6)
3. **Tags:** Must be valid JSONB array of strings
4. **Place Kind:** Must be either `showplace` or `business`
5. **Country/City:** `country_id` and `city_id` must reference existing records

## Migration History

- `0004_place_kind_fields.sql` - Added `place_kind`, `category`, `tags`, contact fields, `price_level`

## Export Format

See `packages/db/src/exportPlacesToNeon.ts` for SQL/CSV export generation.

**SQL Format:**
- Uses `INSERT ... ON CONFLICT DO UPDATE` for idempotent imports
- Handles conflicts on `slug` (places) and `(entity_type, entity_id, tab_key, lang)` (content_blocks)

**CSV Format:**
- Headers match column names exactly
- Values escaped for CSV (quotes, commas, newlines)
- JSONB values stored as JSON strings
