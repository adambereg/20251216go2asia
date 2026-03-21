# Rielt Backend Architecture v1

**Project:** Go2Asia  
**Module:** Rielt  
**Service:** `rielt-service`  
**Document role:** SSOT for backend architecture and boundaries  
**Status:** Final for Step 8  
**Source:** `rielt_service_v1_completion.md`

---

# 1. Service Role

`rielt-service` is the **source of truth for listings and the inquiry domain model** in Go2Asia.

**Where it sits:** Behind api-gateway. Receives requests at /v1/rielt/* when RIELT_SERVICE_URL is configured. Cloudflare Worker / Hono-style handler.

**Responsibility:** Own listing CRUD, public read (list, detail, nearby), and inquiry domain semantics. In current runtime, listing/owner surfaces are implemented; inquiry HTTP path is deferred. No booking, payments, chat, CRM, or media storage.

---

# 2. Ownership Boundaries

## 2.1 What Rielt owns

- rielt_listing
- rielt_listing_media (relation rows only)
- rielt_listing_actor_link
- rielt_listing_inquiry

## 2.2 What Rielt references

- **country_id, city_id:** Opaque strings. Atlas (content-service) is SSOT. No FK.
- **media_id:** Reference to media-service. Rielt does not call media-service in Step 8.
- **actor_user_id, requester_user_id:** From auth/gateway. No user-service call.

## 2.3 What Rielt never owns

- Geo entities (countries, cities)
- Media binaries or URLs
- Booking/reservation
- Payments
- Chat/messaging
- CRM/pipeline
- RF/partner logic
- Social ownership

---

# 3. Internal Backend Structure

Current structure (no invented layers):

```
index.ts          → entry, route dispatch, protected-route check
routes/
  index.ts        → handleRieltRoute: public → owner → inquiry
  public.ts       → list, nearby, detail (GET)
  owner.ts        → create, my/listings, patch, delete
  inquiry.ts      → inquiry contract path (runtime wiring deferred)
services/
  rieltService.ts → business logic, DTO mapping, access checks
db/
  queries/
    listingQueries.ts → SQL, listing-first queries
middleware/
  auth.ts         → getOptionalGatewayPrincipal, requireGatewayOrigin
  context.ts      → createRequestContext, requestId
  http.ts         → json, errorResponse, readJsonObject
validation/
  rielt.ts        → parseListListingsQuery, parseCreateListingInput, etc.
```

**Route dispatch order:** Public first (no auth), then owner (auth), then inquiry (auth). First match wins.

---

# 4. Data Access Model

## 4.1 Listing-first persistence

All writes are listing-centric. Create listing inserts listing + owner actor_link + media relations. Patch updates listing only (media not patchable). Archive sets status.

## 4.2 Actor-link based access checks

Before patch/delete: resolve listing, check actor_link for principal (owner or agent). Admin role bypasses. No actor_link → 403.

## 4.3 Relation-only media persistence

Media rows store (listing_id, media_id, sort_order, is_cover). No media-service call. Public DTO returns coverUrl: null, photos: [].

## 4.4 Inquiry persistence and idempotency

Insert with (requester_user_id, listing_id, idempotency_key) unique. Duplicate returns existing row. No new row created.

## 4.5 Archive vs soft-delete

Archive sets status = archived. Soft-delete via archived_at, deleted_at. Listing remains in DB.

---

# 5. Public Read Architecture

## 5.1 List

- Query: country_id, city_id, listing_type, min_price, max_price, bedrooms_min, bedrooms_max, sort, page, page_size.
- Visibility: status = published only.
- Response: items + pagination.

## 5.2 Detail

- Path: idOrSlug. Resolve by id or slug.
- Visibility: status = published only.
- Response: single listing.

## 5.3 Nearby

- Query: lat, lng, radius_km (required), optional filters.
- Visibility: status = published, has lat/lng.
- Response: items with distanceMeters + pagination.

## 5.4 Visibility rules

Only published listings are visible in public endpoints. Draft and archived are hidden.

---

# 6. Write Architecture

## 6.1 Create

- Parse body → CreateListingInput.
- Insert listing + owner actor_link + media relations.
- Return owner DTO.

## 6.2 Patch

- Resolve listing by path token (current implementation accepts id-or-slug; write-by-id is the intended stable contract).
- Check owner/agent via actor_link.
- Parse body → PatchListingInput (media excluded).
- Update listing. Return owner DTO.

## 6.3 Archive

- Resolve listing by path token (current implementation accepts id-or-slug; write-by-id is the intended stable contract).
- Check owner/agent.
- Set status = archived (or equivalent). Return.

## 6.4 Inquiry create (target contract; deferred runtime wiring)

- Contract uses body + Idempotency-Key.
- Idempotent inquiry semantics remain the target contract: duplicate (requester, listing, idempotency_key) returns existing row; no new row is created.

---

# 7. Integration Boundaries

| System | Role |
|--------|------|
| **api-gateway** | Routes /v1/rielt/* to rielt-service when RIELT_SERVICE_URL set. Protects owner and inquiry endpoints (Bearer). Returns 501 when not configured. Propagates X-Gateway-Auth. |
| **content-service (Atlas)** | SSOT for countries/cities. Canonical values are expected from upstream systems; Rielt does not perform strict runtime validation in Step 8. |
| **media-service** | Owns media assets. Rielt stores media_id only. Does not call media-service in Step 8. |
| **frontend / SDK** | Consumes public and protected endpoints via gateway. |

---

# 8. Guardrails

- **No booking engine:** No reservation, calendar, or availability logic.
- **No CRM:** No pipeline, stages, assignments.
- **No chat:** No threads, no reply endpoints.
- **No geo service:** Rielt does not own or validate geo. Atlas is SSOT.
- **No media ownership:** Relation only. No upload, storage, or URL resolution.
- **No partner logic inside Rielt:** No RF, vouchers, PRO flags.

---

# 9. Current Architectural Limitations

- **Public media:** coverUrl and photos not resolved. Clients receive null/[].
- **Geo display:** country_id and city_id are raw strings. Display names require content-service or client lookup.
- **Inquiry HTTP wiring:** Deferred in current runtime. Listing/owner routes are the implemented operational surface.
- **Minimal by design:** Scope deliberately limited to keep rielt-service maintainable and to avoid coupling with booking, payments, or CRM before those domains exist.

---

*This document describes the implemented Step 8 backend architecture. No extensions, no new features.*
