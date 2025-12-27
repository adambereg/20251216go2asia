# Content Data Flow (Atlas / Pulse / Blog)

> **Last verified**: 2025-12-23 (staging)  
> **Status**: ✅ All endpoints working through API Gateway

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
| `api`   | Fetch from /api/content/* → Neon (default)    |
| `mock`  | Use local mocks directly                      |

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

## Как убедиться, что content-service читает нужную Neon branch

После деплоя `api-gateway` + `content-service` (и прокидывания `DATABASE_URL` на ветку `staging-m4-content-seed`) откройте диагностический endpoint **через Gateway**:

`GET /v1/content/_debug/db` (или legacy alias: `GET /v1/api/content/_debug/db`)

Пример PowerShell (без токенов):

```powershell
$gw = "https://go2asia-api-gateway-staging.fred89059599296.workers.dev"
curl.exe -k -s "$gw/v1/content/_debug/db"
```

Ожидаемый пример ответа (проверено 2025-12-23):

```json
{
  "ok": true,
  "db": {
    "host": "ep-shiny-violet-a4ja8x5m.us-east-1.aws.neon.tech",
    "name": "neondb",
    "protocol": "postgresql",
    "current_user": "neondb_owner"
  },
  "counts": {
    "countries": 8,
    "cities": 103,
    "places": 20,
    "events": 10,
    "articles": 16,
    "media_files": 167
  },
  "examples": {
    "top_event": { "id": "evt-010", "slug": "повторяющееся-событие-беговой-клуб-еженедельно-evt-010" },
    "top_article": { "slug": "digital-nomads-2026" }
  }
}
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

---

## Verified API Endpoints (2025-12-23)

### Gateway → Content Service

All requests successfully proxied through `api-gateway` to `content-service`:

| Endpoint | Status | Response |
|----------|--------|----------|
| `GET /v1/content/_debug/db` | ✅ 200 | JSON with DB info and counts |
| `GET /v1/content/events` | ✅ 200 | JSON array with 10 events |
| `GET /v1/content/countries` | ✅ 200 | JSON array with 8 countries |
| `GET /v1/content/articles` | ✅ 200 | JSON array with 16 articles |

### Verification Commands

```powershell
$gw = "https://go2asia-api-gateway-staging.fred89059599296.workers.dev"

# Debug endpoint (shows DB connection + counts)
curl.exe -k -i "$gw/v1/content/_debug/db"

# Events list
curl.exe -k -i "$gw/v1/content/events"

# Countries list
curl.exe -k -i "$gw/v1/content/countries"
```

### Expected Response Headers

```
HTTP/1.1 200 OK
Content-Type: application/json
X-Proxy-Downstream-Status: 200
X-Proxy-Target-Host: go2asia-content-service-staging.fred89059599296.workers.dev
X-Request-ID: <unique-id>
```

---

## Cloudflare Workers Configuration

### Required Compatibility Flag

Both `api-gateway` and `content-service` require `global_fetch_strictly_public` flag to allow inter-worker communication via `workers.dev` URLs:

```toml
# wrangler.toml
compatibility_flags = ["global_fetch_strictly_public"]
```

Without this flag, Workers return `error code: 1042` when fetching other Workers in the same zone.

### Required Environment Variables (api-gateway)

Set in Cloudflare Dashboard → Workers & Pages → go2asia-api-gateway-staging → Settings → Variables:

| Variable | Value |
|----------|-------|
| `CONTENT_SERVICE_URL` | `https://go2asia-content-service-staging.fred89059599296.workers.dev` |
| `AUTH_SERVICE_URL` | `https://go2asia-auth-service-staging.fred89059599296.workers.dev` |
| `POINTS_SERVICE_URL` | `https://go2asia-points-service-staging.fred89059599296.workers.dev` |
| `REFERRAL_SERVICE_URL` | `https://go2asia-referral-service-staging.fred89059599296.workers.dev` |

### Required Environment Variables (content-service)

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `postgresql://...@ep-shiny-violet-a4ja8x5m.us-east-1.aws.neon.tech/neondb?sslmode=require` |

---

## Troubleshooting

### Error: `SERVICE_NOT_CONFIGURED`

**Cause**: Missing `*_SERVICE_URL` environment variable in api-gateway.

**Fix**: Add the missing variable in Cloudflare Dashboard or via CI/CD `--var`.

### Error: `error code: 1042`

**Cause**: Cloudflare Workers cannot fetch other Workers via `workers.dev` without compatibility flag.

**Fix**: Add `compatibility_flags = ["global_fetch_strictly_public"]` to `wrangler.toml`.

### Error: `404 Not Found` (HTML instead of JSON)

**Cause**: Gateway forwarding problematic headers (Host) to downstream service.

**Fix**: Gateway must construct minimal headers set, not forward all incoming headers.



