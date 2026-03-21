# Media Domain Model v1

**Project:** Go2Asia  
**Module:** Media  
**Service focus:** `media-service`  
**Document role:** Canonical domain-model SSOT for platform media assets  
**Status:** Draft v1 (assembly baseline)

---

# 1. Purpose of the Domain

Media is a **platform asset domain** used by multiple bounded contexts (`space`, `rielt`, `rf`, `quest`, `atlas`, `content/blog`) for upload, storage metadata, and usage attachment.

This domain is **not** the blog/content editorial domain. It owns asset lifecycle and references; consuming domains own business semantics (post, listing, event, place, branch, submission, article meaning).

---

# 2. Core Entities

## 2.1 `media_assets`

**Role:** Canonical asset record for an uploaded object.

**Ownership:** Media service owns lifecycle and persistence.

**Key fields (runtime-aligned):**

| Field | Type | Notes |
|------|------|------|
| id | text PK | Media asset id (`media_id`) |
| owner_user_id | text | Uploader principal |
| scope | varchar(32) | `content`, `space`, `rf`, `rielt`, `quest`, `avatar` |
| provider, bucket, key | text/varchar | Object storage coordinates |
| mime_type, size | varchar/int | Required upload metadata |
| width, height | int nullable | Optional dimensions |
| status | enum | `draft`, `published`, `archived`, `uploading`, `uploaded`, `attached`, `deleted` |
| attached_entity_type, attached_entity_id, attached_slot | text nullable | Minimal attach summary |
| attached_at, published_at | timestamp nullable | Lifecycle markers |
| created_at, updated_at | timestamp | Timestamps |

**Invariants:**

- `(provider, bucket, key)` unique.
- `id` is canonical reference used by external domains (`media_id`).
- Storage key uniqueness is enforced in media domain; consumers do not own storage internals.

## 2.2 `media_variants`

**Role:** Variant metadata for one asset.

**Ownership:** Media service owns variant generation/tracking.

**Key fields:**

| Field | Type | Notes |
|------|------|------|
| id | text PK | Variant id |
| asset_id | text FK | Refers `media_assets.id` |
| kind | enum | `original`, `thumbnail`, `webp`, `avif` |
| status | enum | `pending`, `ready`, `failed` |
| provider, bucket, key | text/varchar | Variant storage coordinates |
| mime_type, size | varchar/int | Required |
| width, height | int nullable | Optional |
| created_at, updated_at | timestamp | Timestamps |

**Invariants:**

- `(asset_id, kind)` unique.
- Variant rows are subordinate to canonical asset row.

## 2.3 `media_usage`

**Role:** Normalized attachment record from media asset to domain owner entity.

**Ownership:** Media owns attachment metadata table; consuming domains own entity lifecycle.

**Key fields:**

| Field | Type | Notes |
|------|------|------|
| id | text PK | Usage id |
| media_id | text FK | Refers `media_assets.id` |
| owner_type | enum | `user`, `space_post`, `rielt_listing`, `rf_partner`, `quest_submission`, `blog_post`, `atlas_entity` |
| owner_id | text | Domain entity id |
| usage_type | varchar(64) | Semantic usage category |
| slot | varchar(64) nullable | Optional position/slot |
| created_at, deleted_at | timestamp | Soft-delete model |

**Invariants:**

- `(media_id, owner_type, owner_id, usage_type, slot)` unique.
- Usage does not transfer domain ownership to media.

## 2.4 `media_files` (auxiliary runtime index)

**Role:** Auxiliary runtime metadata index by storage key used in current repo reality.

**Ownership posture:** This table is a supporting/legacy-compatible persistence layer for upload idempotency and key-based lookup flow.  
Canonical cross-domain media reference remains `media_assets.id`.

**Important boundary note:** `media_files` does not replace `media_assets` as the platform media SSOT for external `media_id` references.

---

# 3. Lifecycle Model

## 3.1 Upload lifecycle (current baseline)

`uploaded -> attached` (current runtime baseline)

- `upload-token` grants short-lived upload rights for one object key.
- Successful PUT persists object and asset metadata.
- Attach operation records usage and moves asset to `attached`.
- `uploading` exists in enum as reserved/optional lifecycle state; current baseline typically persists directly to `uploaded`.

## 3.2 Extended lifecycle (future/optional)

`draft/published/archived/deleted` exists in schema and may be activated by future policy workflows.  
Current runtime baseline uses minimal lifecycle for upload/attach operations.

---

# 4. Ownership Boundaries

## 4.1 What Media owns

- Upload token and signed upload contract.
- Asset metadata (`media_assets`) and variant metadata (`media_variants`).
- Cross-domain attachment metadata (`media_usage`).
- Storage key conventions and canonical media lookup payloads.

## 4.2 What Media references but does not own

- Domain entities from Space, Rielt, RF, Quest, Atlas, Content/Blog.
- Domain-level media semantics (for example: listing cover policy, event gallery ordering, post moderation meaning).

## 4.3 What Media must never own

- Atlas geo truth.
- Pulse event truth.
- Rielt listing truth.
- Space post/group/profile truth.
- RF partner/branch truth.
- Quest progression/submission/reward truth.
- Blog/article editorial truth.

---

# 5. Canonical Terms

- **media asset**: canonical binary metadata unit (`media_assets`).
- **media variant**: derived representation tied to one asset (`media_variants`).
- **media usage attachment**: normalized cross-domain binding (`media_usage`).
- **media_id**: canonical external reference for consumers. In current runtime, this maps to `media_assets.id`.
- **owner_type / owner_id**: attachment target identity, not ownership transfer.
- **scope**: upload context namespace (who/where upload intent originates).
- **owner_type**: attach target category for cross-domain binding (what entity the uploaded asset is bound to).

Allowed pairing semantics (current baseline): upload `scope` and attach `owner_type` are related but not identical dimensions.  
Example: asset uploaded with `scope=space` can be attached with `owner_type=space_post`; asset uploaded with `scope=content` can be attached with `owner_type=blog_post` or `atlas_entity` when applicable.

---

# 6. Current vs Transitional vs Target Notes

- **Current runtime:** Dedicated `apps/media-service` exists and serves platform media routes.
- **Current transitional reality:** API gateway can fallback `/v1/media/*` to `content-service` when `MEDIA_SERVICE_URL` is unset.
- **Target extraction:** Remove transitional fallback dependency and keep media operations on dedicated `media-service` only.

---

*This document defines the canonical platform-media domain baseline. It does not redefine blog/content domain ownership.*
