# Derived endpoint list (source-of-fact)

**Дата:** 2025-12-24  
**Назначение:** зафиксировать минимальный список endpoints, которые реально используются в коде (Gateway/SDK/FE) и должны быть покрыты OpenAPI SSOT.

## Источники

- Gateway routing: `apps/api-gateway/src/index.ts`
- Content routes: `apps/content-service/src/index.ts`
- Auth routes: `apps/auth-service/src/index.ts`
- Referral routes: `apps/referral-service/src/index.ts`
- SDK usage:
  - `packages/sdk/src/content.ts`
  - `packages/sdk/src/balance.ts`
  - `packages/sdk/src/transactions.ts`
  - `packages/sdk/src/referrals.ts`

## User-facing (через Gateway)

### Users (Auth Service)
- `POST /v1/users/ensure`

### Content (Content Service)
- `GET /v1/content/_debug/db`
- `GET /v1/content/events`
- `GET /v1/content/events/{id}`
- `POST /v1/content/events/{id}/register`
- `GET /v1/content/countries`
- `GET /v1/content/cities?countryId=...`
- `GET /v1/content/places?cityId=...&limit=...`
- `GET /v1/content/places/{idOrSlug}`
- `GET /v1/content/articles`
- `GET /v1/content/articles/{slug}`

### Points (Points Service)
- `GET /v1/points/balance`
- `GET /v1/points/transactions?limit=...&cursor=...`

### Referral (Referral Service)
- `GET /v1/referral/code`
- `GET /v1/referral/stats`
- `GET /v1/referral/tree?depth=1|2`
- `POST /v1/referral/claim`

## Service-to-service (internal)

### Points
- `POST /internal/points/add`

### Referral
- `POST /internal/referral/generate-code`
- `POST /internal/referral/link`
- `POST /internal/referral/mark-first-login`

