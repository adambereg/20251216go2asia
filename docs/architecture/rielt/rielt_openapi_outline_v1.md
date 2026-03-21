# Rielt OpenAPI Outline v1

**Project:** Go2Asia  
**Module:** Rielt  
**Service:** `rielt-service`  
**Document role:** API-outline SSOT for the implemented Rielt practical surface (listings/owner + requester inquiry)  
**Status:** Final practical V1 baseline  
**Source:** `rielt_service_v1_completion.md`

---

# 1. API Purpose

The Rielt API exposes:

- **Public read:** List and detail of published listings; nearby search.
- **Owner write:** Create, patch, archive listings; list own listings.
- **Inquiry:** Requester create/list flow is implemented (owner-side inquiry workflow remains deferred).

The API does **not** expose:

- booking
- payments
- chat
- CRM
- reviews
- favorites
- RF/partner logic
- owner-side inquiry workflow
- media URL resolution (public DTO returns null/[])

---

# 2. Route Groups

| Group | Auth | Scope |
|-------|------|-------|
| **public** | None | List, nearby, detail |
| **owner** | Bearer | Create, my/listings, patch, delete |
| **inquiry** | Bearer | Implemented for requester create/list |

---

# 3. Current Endpoint Outline

## 3.1 GET /v1/rielt/listings

**Purpose:** List published listings with filters and pagination.

**Auth:** None.

**Query params:** country_id, city_id, listing_type, min_price, max_price, bedrooms_min, bedrooms_max, sort (newest \| price_asc \| price_desc), page, page_size.

**Response:** `{ items: ListingDto[], pagination: { page, pageSize, total } }`

**Key errors:** VALIDATION_ERROR (invalid query), SERVICE_NOT_CONFIGURED (no DB).

**Intentionally absent:** amenities filter, geo identity via raw free-text, cursor pagination.

---

## 3.2 GET /v1/rielt/listings/nearby

**Purpose:** List published listings by lat/lng and radius.

**Auth:** None.

**Query params:** lat, lng, radius_km (required), country_id, city_id, listing_type, page, page_size.

**Response:** `{ anchor: { lat, lng, radiusKm }, items: NearbyListingDto[], pagination: { page, pageSize, total } }`. Each item includes distanceMeters.

**Key errors:** VALIDATION_ERROR (invalid lat/lng/radius), SERVICE_NOT_CONFIGURED.

**Intentionally absent:** Geo identity via raw free-text.

---

## 3.3 GET /v1/rielt/listings/{idOrSlug}

**Purpose:** Get single published listing by id or slug.

**Auth:** None.

**Path params:** idOrSlug (id or slug).

**Response:** `{ listing: ListingDto }`

**Public detail DTO:** Intentionally returns a summary-like DTO. Description is absent from the public listing DTO (present only in owner DTOs). Media returns coverUrl: null, photos: [].

**Key errors:** VALIDATION_ERROR (invalid idOrSlug), NOT_FOUND, SERVICE_NOT_CONFIGURED.

**Intentionally absent:** Description in public response; media URL resolution.

---

## 3.4 POST /v1/rielt/listings

**Purpose:** Create listing. Caller becomes owner.

**Auth:** Required (Bearer).

**Request body:** slug, title, description, listing_type, price_amount, price_currency, price_period, country_id, city_id, area_text, lat, lng, bedrooms, bathrooms, area_sqm, amenities, media (array of { media_id, sort_order, is_cover }).

**Response:** `{ listing: OwnerListingDto }`

**Key errors:** UNAUTHORIZED, VALIDATION_ERROR, SERVICE_NOT_CONFIGURED, slug conflict.

**Intentionally absent:** RF flags, moderation workflow, media upload (media_id must exist in media-service).

---

## 3.5 GET /v1/rielt/my/listings

**Purpose:** List own listings (owner or agent).

**Auth:** Required (Bearer).

**Query params:** status (draft \| published \| archived \| null), sort (newest \| price_asc \| price_desc), page, page_size.

**Response:** `{ items: OwnerListingDto[], pagination: { page, pageSize, total } }`

**Key errors:** UNAUTHORIZED, VALIDATION_ERROR, SERVICE_NOT_CONFIGURED.

**Intentionally absent:** Shared/social ownership, pipeline view.

---

## 3.6 PATCH /v1/rielt/listings/{id}

**Purpose:** Patch owned listing. Media not patchable via PATCH.

**Auth:** Required (Bearer).

**Path params:** id. Intended stable contract: write-by-id only. Current implementation accepts path token resolved as id-or-slug; write-by-id is the intended stable contract.

**Request body:** Partial: slug, title, description, listing_type, price_*, country_id, city_id, area_text, lat, lng, bedrooms, bathrooms, area_sqm, amenities, status (`draft` or `published`). media is explicitly not allowed.

**Response:** `{ listing: OwnerListingDto }`

**Key errors:** UNAUTHORIZED, NOT_FOUND, FORBIDDEN (not owner/agent), VALIDATION_ERROR, slug conflict.

**Intentionally absent:** Media patch, RF flags, moderation.

---

## 3.7 DELETE /v1/rielt/listings/{id}

**Purpose:** Archive owned listing.

**Auth:** Required (Bearer).

**Path params:** id (write-by-id only).

**Response:** `{ listing: OwnerListingDto }` or 204.

**Key errors:** UNAUTHORIZED, NOT_FOUND, FORBIDDEN.

**Intentionally absent:** Hard delete, restore.

---

## 3.8 POST /v1/rielt/listings/{idOrSlug}/inquiries

**Purpose:** Create one-shot inquiry. Idempotent by (requester, listing, Idempotency-Key).

**Auth:** Required (Bearer).

**Path params:** idOrSlug.

**Headers:** Idempotency-Key (required for idempotency).

**Request body:** message (required), contact_name, contact_phone, contact_telegram.

**Response:** `{ inquiry: InquiryDto }`

**Key errors:** UNAUTHORIZED, NOT_FOUND, FORBIDDEN (listing not published), VALIDATION_ERROR. Duplicate key returns existing inquiry (no new row is created).

**Intentionally absent:** Reply, thread, thread endpoints.

---

## 3.9 GET /v1/rielt/my/inquiries

**Purpose:** List own inquiries (requester).

**Auth:** Required (Bearer).

**Query params:** status (new \| viewed \| closed \| null), sort (newest \| oldest), page, page_size.

**Response:** `{ items: MyInquiryDto[], pagination: { page, pageSize, total } }`. Each item includes listing summary.

**Key errors:** UNAUTHORIZED, VALIDATION_ERROR, SERVICE_NOT_CONFIGURED.

**Intentionally absent:** Owner/agent inquiry list endpoint (not implemented in Step 8).

---

# 4. DTO Conventions

## 4.1 Public listing summary / detail

Public listing DTO (list and detail) is intentionally summary-like. No description; no media URL resolution.

- id, slug, title, listingType
- price: { amount, currency, period }
- bedrooms, bathrooms, areaSqm
- geo: { countryId, cityId }
- media: { coverUrl: null, photos: [] } (Step 8: not resolved)
- createdAt, updatedAt, publishedAt

Description is present only in owner DTOs.

## 4.2 Nearby item

- Same as public listing + distanceMeters: number

## 4.3 Owner listing

- id, slug, title, description, listingType, status
- price: { amount, currency, period }
- geo, media (relation metadata), timestamps

## 4.4 Inquiry item

- id, listingId, requesterUserId, message, contact: { name, phone, telegram }, status, createdAt, closedAt

## 4.5 My inquiry item

- Same as inquiry + listing: { listingId, listingTitle, listingSlug, geo }

## 4.6 Pagination envelope

- page, pageSize, total

## 4.7 Error envelope

- error: { code, message }
- requestId

---

# 5. Geo/API Rules

- **Canonical geo fields only:** country_id, city_id. No raw free-text geo identity in API contract.
- **city_id nullable:** API accepts null.
- **No geo identity via raw free-text:** API contract uses country_id and city_id as structured fields.

---

# 6. Inquiry/API Rules

- **One-shot only:** No reply, no thread endpoints.
- **No owner-side inquiry workflow endpoints in current baseline:** Owner/agent cannot list inquiries for their listings via Rielt API.

---

# 7. Explicit Exclusions from API

- Booking endpoints
- Payment endpoints
- Chat endpoints
- CRM endpoints
- Review/favorite endpoints
- RF endpoints
- Owner inquiry list endpoint
- Media URL resolution in public DTO

---

*This outline describes the practical V1 API baseline. Implemented in runtime: listings/owner surfaces plus requester inquiry create/list routes.*
