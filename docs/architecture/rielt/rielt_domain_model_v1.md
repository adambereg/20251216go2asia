# Rielt Domain Model v1

**Project:** Go2Asia  
**Module:** Rielt  
**Service focus:** `rielt-service`  
**Document role:** Canonical domain-model SSOT for Rielt  
**Status:** Final for Step 8  
**Source:** `rielt_service_v1_completion.md`

---

# 1. Purpose of the Domain

Rielt is the **listing and inquiry domain** of Go2Asia.

**What Rielt is:** Minimal practical domain for accommodation/property discovery and one-shot inquiry. Enables users to browse listings by geo, price, bedrooms; view details; and send inquiries to owners. Owners can create, edit, and archive their listings.

**Why it exists:** Go2Asia needs a foundational real-estate-like surface for Asia markets. Step 8 delivers the minimal viable domain: listings + inquiries, without booking, payments, or CRM. It is intentionally scoped to stay maintainable and to integrate later with Guru (aggregation), RF (partner logic), and Space (social).

---

# 2. Core Domain Entities

## 2.1 `rielt_listing`

**Role:** Core entity. Represents an accommodation/property listing.

**Ownership:** Rielt Service owns the full lifecycle.

**Key fields:**

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

**Ownership meaning:** Listing is owned by the user who created it (via actor_link). One active owner per listing.

---

## 2.2 `rielt_listing_media`

**Role:** Relation between listing and media assets. Stores media_id and metadata only.

**Ownership:** Rielt owns the relation; media-service owns the asset.

**Key fields:**

| Field | Type | Notes |
|-------|------|-------|
| id | text PK | UUID |
| listing_id | text FK | cascade on delete |
| media_id | text | Reference to media-service |
| sort_order | integer | ≥ 0 |
| is_cover | boolean | |
| created_at, deleted_at | timestamp | |

**Invariants:** (listing_id, media_id) unique when not deleted; (listing_id, sort_order) unique when not deleted.

**Ownership meaning:** Rielt does not store media bytes or URLs. Relation only.

---

## 2.3 `rielt_listing_actor_link`

**Role:** Links a user to a listing with a role (owner or agent).

**Ownership:** Rielt Service owns.

**Key fields:**

| Field | Type | Notes |
|-------|------|-------|
| id | text PK | UUID |
| listing_id | text FK | cascade on delete |
| actor_user_id | text | Required |
| actor_role | enum | owner \| agent |
| created_at, revoked_at, deleted_at | timestamp | |

**Invariants:** One active owner per listing; (listing_id, actor_user_id, actor_role) unique when not revoked/deleted.

**Ownership meaning:** Owner and agent can manage the listing. Access checks use this table.

---

## 2.4 `rielt_listing_inquiry`

**Role:** One-shot inquiry from a user to a listing.

**Ownership:** Rielt Service owns.

**Key fields:**

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

**Ownership meaning:** Inquiry is owned by the requester. No reply chain; no owner-side workflow in Step 8.

---

# 3. Domain Rules

## 3.1 Listing-first model

All write operations are listing-centric. Inquiries attach to listings. Media attaches to listings. Actor links attach to listings.

## 3.2 One active owner rule

Each listing has exactly one active owner (actor_role = owner, not revoked, not deleted). Owner is set at creation.

## 3.3 Active agent semantics

Agent is optional. Multiple agents may be linked. Agent has same write rights as owner for that listing. Revoked/deleted links are excluded from access checks.

## 3.4 Archive semantics

Archive sets status = archived. Listing remains in DB; not visible in public list. Soft-delete via archived_at/deleted_at.

## 3.5 Inquiry one-shot semantics

Each inquiry is a single message. No threads, no reply endpoints. No follow-up messages.

## 3.6 Idempotency semantics

Inquiry create uses (requester_user_id, listing_id, idempotency_key). Duplicate key returns existing inquiry; no new row is created.

---

# 4. Lifecycle Model

## 4.1 Listing lifecycle

```
draft → published
published → archived
archived (terminal for Step 8)
```

- **draft:** Created but not visible publicly.
- **published:** Visible in public list and detail.
- **archived:** Not visible publicly; owner can still see in my/listings.

No moderation workflow. Draft → published is direct.

## 4.2 Inquiry lifecycle

```
new → viewed → closed
```

- **new:** Just created.
- **viewed:** Owner has seen (status update only; no owner endpoint in Step 8).
- **closed:** Resolved or discarded.

Status is minimal. No pipeline, stages, or assignments.

---

# 5. Geo Model

- **country_id:** Required. String. No FK.
- **city_id:** Nullable. String. No FK.
- **No parallel geo model:** Rielt does not own geo entities.
- **No runtime mapping:** Rielt stores IDs/slugs; resolution and display names are handled by content-service or frontend.
- **Atlas/content-service as SSOT:** Canonical values are expected from upstream systems; Rielt does not perform strict runtime validation in Step 8.
- **lat, lng:** Optional on listing. Used for nearby search. If present, must be valid pair.

---

# 6. Media Model

- **Relation only:** rielt_listing_media stores media_id and metadata (sort_order, is_cover).
- **No upload/storage ownership:** Media bytes and URLs are owned by media-service.
- **No URL ownership:** Rielt does not call media-service in Step 8. Public DTO returns coverUrl: null, photos: [].

---

# 7. Access Model

| Role | Capability |
|------|-------------|
| **owner** | Create, patch, archive own listings. Set via actor_link at creation. |
| **agent** | Same as owner for linked listings. |
| **user** | Public read (list, detail, nearby). Auth required for create/patch/delete/inquiry. |
| **admin** | Override for manage operations (present in current behavior). |

- **Requester:** Creates inquiry; views via /my/inquiries.
- **Owner/agent inquiry views:** Not implemented in Step 8.

---

# 8. Explicit Non-Goals

- **Booking:** No reservation, no calendar blocking.
- **Payments:** No payment flows.
- **Chat:** No threads, no real-time messaging.
- **CRM:** No pipeline, stages, assignments.
- **Moderation platform:** No approval workflow; draft → published is direct.
- **Partner ownership:** No RF, vouchers, PRO flags in Rielt.
- **Reviews/favorites:** Not in Rielt.
- **Social ownership:** No co-ownership, no groups.
- **Geo ownership:** Atlas is SSOT.
- **Media ownership:** Relation only.

---

# 9. Canonical Glossary / Ownership Notes

- **listing / property / unit:** In backend SSOT, canonical entity is `rielt_listing`. Product-facing terms like "property" or "unit" are non-canonical synonyms unless explicitly mapped.
- **inquiry / request:** In backend SSOT, canonical term is listing `inquiry` (`rielt_listing_inquiry`) with one-shot semantics; "request" is legacy/product wording.
- **geo anchoring depth:** Current enforced schema uses `country_id` and optional `city_id` plus optional `lat/lng`. Deeper Atlas anchoring (for example place/district-level enforcement) is planned alignment, not current enforced schema.

---

*This document is the canonical domain-model SSOT for Rielt v1. No extensions, no new features.*
