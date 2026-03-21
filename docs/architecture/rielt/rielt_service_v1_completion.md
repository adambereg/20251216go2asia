# Rielt Service v1 — Completion Document

**Project:** Go2Asia  
**Module:** rielt-service  
**Status:** Final SSOT baseline for rielt-service practical v1 (implemented listings/owner + requester inquiry HTTP wiring)
**Completed:** Step 9 practical completion baseline

---

## 1. Purpose of Rielt Service

Rielt-service provides listing (accommodation/property) discovery and lightweight inquiry for Go2Asia.

**Role:** Minimal practical domain for property search and owner-inquirer contact intent. Enables users to browse listings by geo, price, bedrooms; view details; and supports one-shot inquiry semantics in the domain model. Owners can create, edit, and archive their listings.

**Why it exists at this stage:** Go2Asia needs a foundational real-estate-like surface for Asia markets. Current practical baseline delivers listings + requester inquiry/contact intent, without booking, payments, or CRM. It is intentionally scoped to stay maintainable and to integrate later with Guru (aggregation), RF (partner logic), and Space (social).

---

## 2. Boundaries (STRICT)

### IN (what rielt-service owns)

| Entity | Scope |
|--------|-------|
| **rielt_listing** | Core listing entity |
| **rielt_listing_media** | Relation to media (mediaId only; no storage) |
| **rielt_listing_actor_link** | Owner/agent link per listing |
| **rielt_listing_inquiry** | One-shot inquiry per listing |

### OUT (explicitly NOT part of rielt-service)

| Area | Reason |
|------|--------|
| **Booking** | Out of scope |
| **Payments** | Out of scope |
| **Chat / messaging** | Out of scope |
| **CRM / pipeline** | Out of scope |
| **RF / partner logic** | Owned by RF service |
| **Social ownership** | Owned by Space |
| **Media storage** | Owned by media-service |
| **Geo ownership** | Atlas (content-service) is SSOT |

---

## 3. Data Model (final)

### rielt_listing

| Field | Type | Notes |
|-------|------|-------|
| id | text PK | UUID |
| slug | varchar(180) | Unique, slug format |
| title | text | Not blank |
| description | text | Not blank |
| listing_type | varchar(24) | rent_long \| rent_short \| sale |
| status | enum | draft \| published \| archived |
| price_amount | numeric(12,2) | ≥ 0 |
| price_currency | varchar(3) | ISO 4217 |
| price_period | varchar(16) | month \| day \| total |
| country_id | text | Required |
| city_id | text | Nullable |
| area_text | text | Nullable |
| lat, lng | numeric | Paired or both null |
| bedrooms | integer | Nullable, ≥ 0 |
| bathrooms | integer | Nullable, ≥ 0 |
| area_sqm | numeric | Nullable |
| amenities | text[] | Default [] |
| created_by_user_id | text | Required |
| created_at, updated_at | timestamp | |
| published_at, archived_at, deleted_at | timestamp | Nullable |

**Invariants:** slug unique; listing_type ∈ {rent_long, rent_short, sale}; price_period ∈ {month, day, total}; lat/lng paired; lat ∈ [-90,90], lng ∈ [-180,180].

### rielt_listing_media

| Field | Type | Notes |
|-------|------|-------|
| id | text PK | UUID |
| listing_id | text FK | cascade on delete |
| media_id | text | Reference to media-service |
| sort_order | integer | ≥ 0 |
| is_cover | boolean | |
| created_at, deleted_at | timestamp | |

**Invariants:** (listing_id, media_id) unique when not deleted; (listing_id, sort_order) unique when not deleted.

### rielt_listing_actor_link

| Field | Type | Notes |
|-------|------|-------|
| id | text PK | UUID |
| listing_id | text FK | cascade on delete |
| actor_user_id | text | Required |
| actor_role | enum | owner \| agent |
| created_at, revoked_at, deleted_at | timestamp | |

**Invariants:** One active owner per listing; (listing_id, actor_user_id, actor_role) unique when not revoked/deleted.

### rielt_listing_inquiry

| Field | Type | Notes |
|-------|------|-------|
| id | text PK | UUID |
| listing_id | text FK | cascade on delete |
| requester_user_id | text | Required |
| message | text | Not blank |
| contact_name | varchar(120) | Nullable |
| contact_phone | varchar(40) | Nullable |
| contact_telegram | varchar(80) | Nullable |
| status | enum | new \| viewed \| closed |
| idempotency_key | varchar(80) | Required |
| created_at, closed_at, deleted_at | timestamp | |

**Invariants:** (requester_user_id, listing_id, idempotency_key) unique.

---

## 4. API Surface (final)

### Public endpoints (no auth)

| Method | Path | Description |
|--------|------|-------------|
| GET | /v1/rielt/listings | List published listings (filters, pagination) |
| GET | /v1/rielt/listings/nearby | List published listings by lat/lng + radius |
| GET | /v1/rielt/listings/{idOrSlug} | Get single published listing by id or slug |

**List query params:** country_id, city_id, listing_type, min_price, max_price, bedrooms_min, bedrooms_max, sort (newest \| price_asc \| price_desc), page, page_size.

**Nearby query params:** lat, lng, radius_km, country_id, city_id, listing_type, page, page_size.

### Owner endpoints (auth required)

| Method | Path | Description |
|--------|------|-------------|
| POST | /v1/rielt/listings | Create listing |
| GET | /v1/rielt/my/listings | List own listings (status, sort, pagination) |
| PATCH | /v1/rielt/listings/{id} | Patch owned listing (media not patchable). Slug support for write is not guaranteed. |
| DELETE | /v1/rielt/listings/{id} | Archive owned listing |

### Inquiry endpoints (auth required, implemented requester baseline)

| Method | Path | Description |
|--------|------|-------------|
| POST | /v1/rielt/listings/{idOrSlug}/inquiries | Create inquiry (Idempotency-Key header required) |
| GET | /v1/rielt/my/inquiries | List own inquiries (status, sort, pagination) |

---

## 5. Geo Model

- **country_id:** Required. String. No FK; Atlas (content-service) is SSOT for valid values.
- **city_id:** Nullable. String. No FK; Atlas is SSOT for valid values.
- **No strict runtime validation against Atlas in current baseline.** Canonical values are expected to be provided by upstream systems.
- **No runtime mapping:** Rielt stores IDs/slugs; resolution and display names are handled by content-service or frontend.
- **lat, lng:** Optional on listing. Used for nearby search; if present, must be valid lat/lng pair.

---

## 6. Media Model

- **Relation only:** rielt_listing_media stores media_id and metadata (sort_order, is_cover).
- **No storage:** Media bytes and URLs are owned by media-service. Rielt does not upload, store, or serve media.
- **No ownership:** Rielt references media by ID; media-service owns lifecycle and URL resolution.
- **Public DTO:** Currently returns coverUrl: null, photos: []. URL resolution is left to BFF or client.

---

## 7. Ownership Model

- **owner:** User who created the listing. One active owner per listing.
- **agent:** Optional agent role; can manage listing alongside owner. Roles: owner, agent.
- **user:** Anonymous or authenticated user. Public read; auth required for create/patch/delete/inquiry.
- **Access:** Owner and agent can create, patch, publish/unpublish (via PATCH status), and archive. Requester creates inquiry and views own inquiries via `/my/inquiries`. Owner/agent inquiry views are intentionally not implemented in this baseline. Admin can manage. No shared/social ownership.

---

## 8. Inquiry Model (important)

- **One-shot:** Each inquiry is a single message. No threads, no reply chain.
- **Atomic:** Insert with idempotency (requester_user_id, listing_id, idempotency_key). Duplicate key returns existing inquiry (no new row is created).
- **No threads:** No conversation model, no follow-up messages.
- **No CRM:** Status (new, viewed, closed) is minimal; no pipeline, stages, or assignments.
- **Contact:** contact_name, contact_phone, contact_telegram optional; passed through to owner for external contact.

---

## 9. Integration Points

| System | Role |
|--------|------|
| **api-gateway** | Routes /v1/rielt/* to rielt-service when RIELT_SERVICE_URL is set. Protects owner and inquiry endpoints (Bearer). Returns 501 when RIELT_SERVICE_URL not configured. |
| **content-service (Atlas)** | SSOT for countries and cities. No strict runtime validation against Atlas in Step 8. Canonical values are expected to be provided by upstream systems. |
| **media-service** | Rielt stores media_id in rielt_listing_media. Media-service owns storage and URL resolution. Rielt does not call media-service in Step 8. |

---

## 10. What is intentionally NOT implemented

| Area | Notes |
|------|-------|
| **Booking** | No reservation, no calendar blocking |
| **Payments** | No payment flows |
| **Chat / messaging** | No threads, no real-time chat |
| **CRM / pipeline** | No stages, assignments, pipeline |
| **RF / partner logic** | No vouchers, PRO, partner flags in rielt |
| **Social ownership** | No co-ownership, no groups |
| **Media URL resolution** | Public DTO returns null/empty; resolution elsewhere |
| **Geo validation** | No lookup against Atlas at runtime |
| **Moderation** | No approval workflow |
| **Advanced geo** | No polygons, no custom areas |
| **Reviews / ratings** | Not in rielt |
| **Favourites / saves** | Not in rielt |
| **Availability calendar** | Not in rielt |
| **Nearby UI wiring** | Backend supports nearby; frontend deferred |

---

## 11. Role in Future Architecture

- **Guru:** Guru (BFF/aggregation) will consume rielt listings and inquiries to build user-facing dashboards and recommendations. Rielt is a data source; Guru owns aggregation.
- **RF:** RF service owns partner, voucher, PRO logic. Rielt listings may later be tagged/linked to RF offers; integration is structural, not implemented.
- **Space:** Space owns social posts and profiles. Rielt listings may be referenced or embedded in Space content; integration is structural, not implemented.
- **No speculation:** The above describes the intended structural role; no feature roadmap.

---

## 12. Current Limitations

- **Public media:** coverUrl and photos are not resolved in public API responses. Clients receive null/[].
- **Geo display:** country_id and city_id are raw strings; display names require content-service or client lookup.
- **Nearby:** Implemented in backend; frontend nearby surface deferred.
- **Inquiry workflow:** Status is minimal (new/viewed/closed); no notifications, no follow-up. Requester-side inquiry routes are implemented; owner-side inquiry workflow is deferred.
- **Minimal by design:** Scope is deliberately limited to keep rielt-service maintainable and to avoid coupling with booking, payments, or CRM before those domains exist.

---

*This document is the final SSOT baseline for rielt-service practical v1. Implemented runtime surface covers listings/owner plus requester inquiry baseline.*
