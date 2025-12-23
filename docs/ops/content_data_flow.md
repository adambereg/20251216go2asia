# Content Data Flow (Atlas / Pulse / Blog)

## Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Next.js UI    │────▶│  API Gateway    │────▶│  content-service  │────▶│  Neon Postgres  │
│ (PWA Shell)     │     │  (/v1/content)  │     │  (Worker)         │     │ (staging-m4)    │
└─────────────────┘     └─────────────────┘     └──────────────────┘     └─────────────────┘
        │
        │ fallback (feature-flag)
        ▼
┌─────────────────┐
│   mocks/repo.ts │
│   (local data)  │
└─────────────────┘
```

## Data Source Toggle

Environment variable: `NEXT_PUBLIC_DATA_SOURCE`

| Value   | Behavior                                      |
|---------|-----------------------------------------------|
| `mock`  | Use local mocks directly (default)            |
| `api`   | Fetch from /api/content/* → Neon              |

On API failure, automatically falls back to mocks.

## Public API (via Gateway)

| Endpoint                         | Method | Description                          |
|----------------------------------|--------|--------------------------------------|
| `/v1/content/events`             | GET    | List active events                   |
| `/v1/content/events/{idOrSlug}`  | GET    | Event by ID or slug                  |
| `/v1/content/countries`          | GET    | List Atlas countries                 |
| `/v1/content/cities`             | GET    | List Atlas cities (?countryId=)      |
| `/v1/content/places`             | GET    | List Atlas places (?cityId=,limit=)  |
| `/v1/content/places/{idOrSlug}`  | GET    | Place by ID or slug                  |
| `/v1/content/articles`           | GET    | List published articles              |
| `/v1/content/articles/{slug}`    | GET    | Article by slug                      |

## Database Tables (Neon)

### Content Tables (read by API)

| Table             | Description                    |
|-------------------|--------------------------------|
| `countries`       | Atlas countries                |
| `cities`          | Atlas cities (FK → countries)  |
| `places`          | Atlas places (FK → cities)     |
| `events`          | Pulse events                   |
| `articles`        | Blog posts/guides              |
| `media_files`     | Media metadata (R2 URLs)       |

### Normalization Views

| View              | Purpose                                    |
|-------------------|--------------------------------------------|
| `atlas_cities_v`  | Normalize lat/lng from legacy columns      |
| `atlas_places_v`  | Normalize lat/lng from legacy columns      |
| `pulse_events_v`  | Normalize start_at/end_at from legacy      |

### SSOT Fields vs Legacy

| SSOT Field    | Legacy Field       | Notes                          |
|---------------|--------------------|--------------------------------|
| `lat`         | `latitude`         | Use SSOT if available          |
| `lng`         | `longitude`        | Use SSOT if available          |
| `start_at`    | `start_date`       | timestamptz vs date            |
| `end_at`      | `end_date`         | timestamptz vs date            |

Queries use `COALESCE(ssot, legacy)` pattern for backward compatibility.

## Query Layer (Workers)

Location: `packages/db/src/queries/content.ts`

- Uses Neon HTTP driver directly (`@neondatabase/serverless`)
- **NO Drizzle ORM** in Workers runtime path
- Pure SQL with parameterized queries

## Frontend Usage

Frontend fetches via `@go2asia/sdk` (base URL = `NEXT_PUBLIC_API_URL`) and uses `NEXT_PUBLIC_DATA_SOURCE` to decide between API vs local mocks.

## Environment Variables

Required for API mode:

```env
# Frontend (.env.local)
NEXT_PUBLIC_DATA_SOURCE=api

# Gateway
NEXT_PUBLIC_API_URL=https://go2asia-api-gateway-staging.fred89059599296.workers.dev

# Workers (Cloudflare env/vars)
DATABASE_URL=postgresql://...@ep-xxx.neon.tech/neondb?sslmode=require
```

## Demo URLs (after seed)

### Pulse Events
- `/pulse/e7f8b7d4-6f6a-4f1e-9aa0-2d4dbaac7b10`
- `/pulse/5b531b8d-8c7a-4fe8-b389-62e2f8d1d8a3`

### Blog Articles  
- `/blog/digital-nomads-2026`
- `/blog/thailand-visa-quick-guide`

### Atlas Places
- `/atlas/places/place-1`
