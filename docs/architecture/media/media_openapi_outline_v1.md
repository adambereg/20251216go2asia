# Media OpenAPI Outline v1

**Project:** Go2Asia  
**Module:** Media  
**Service:** `media-service`  
**Document role:** API-outline SSOT for platform media contract  
**Status:** Draft v1 (assembly baseline)

---

# 1. API Purpose

The media API exposes a platform contract for:

- issuing upload tokens,
- uploading objects by signed token,
- attaching media usage to domain entities,
- looking up one media asset by id.

This outline is for **platform media-service** and is separate from blog/content domain APIs.

---

# 2. Route Groups

| Group | Auth | Scope |
|------|------|------|
| token issuance | gateway auth | create signed upload token |
| upload | signed token | upload binary object |
| attach | gateway auth | bind media to domain owner reference |
| lookup | public/internal read | get media metadata + variants |

---

# 3. Current Endpoint Outline

## 3.1 POST `/v1/media/upload-token`

**Purpose:** Create short-lived signed upload token for one asset upload.

**Auth:** Required via gateway-origin context.

**Request body (baseline):** scope, filename, contentType, optional sizeBytes.

**Response:** uploadUrl, key, publicUrl, expiresAt, requestId.

**Key errors:** UNAUTHORIZED, VALIDATION_ERROR, SERVICE_AUTH_NOT_CONFIGURED.

---

## 3.2 PUT `/v1/media/upload/{token}`

**Purpose:** Upload binary bytes using signed token.

**Auth:** Signed token in path (no end-user auth required on this call).

**Request body:** binary payload (`image/*` baseline).

**Response:** ok, key, publicUrl, requestId.

**Key errors:** UNAUTHORIZED (invalid/expired token), VALIDATION_ERROR, INTERNAL_ERROR.

---

## 3.3 POST `/v1/media/{mediaId}/attach`

**Purpose:** Record media usage attachment to domain owner reference and mark asset attached.

**Auth:** Required via gateway-origin context.

**Path params:** mediaId.

**Request body (baseline):** ownerType, ownerId, usageType, optional slot.

**Response:** media_id, status=`attached`, usage summary, requestId.

**Key errors:** UNAUTHORIZED, FORBIDDEN (ownership), NOT_FOUND, VALIDATION_ERROR, SERVICE_AUTH_NOT_CONFIGURED.

---

## 3.4 GET `/v1/media/{mediaId}`

**Purpose:** Fetch media metadata and variants for one asset id.

**Auth:** Public/internal read surface (no gateway auth required by default gateway policy).

**Path params:** mediaId.

**Response:** media_id, mimeType, dimensions, publicUrl, variants[].

**Key errors:** NOT_FOUND, VALIDATION_ERROR.

**Note:** This endpoint exists in current service runtime; if OpenAPI bundles lag, runtime remains authoritative for this route until bundle catches up.

---

# 4. DTO Conventions (Baseline)

## 4.1 Upload token response

- uploadUrl (canonical `/v1/media/upload/{token}` shape),
- key,
- publicUrl (nullable),
- expiresAt,
- requestId.

## 4.2 Upload result

- ok,
- key,
- publicUrl (nullable),
- requestId.

## 4.3 Attach result

- ok/status,
- media_id,
- usage { ownerType, ownerId, usageType, slot },
- requestId.

## 4.4 Lookup result

- media_id,
- mimeType,
- width/height (nullable),
- publicUrl (nullable),
- variants[] with kind/publicUrl/mimeType/dimensions.

---

# 5. Current vs Transitional vs Target Notes

- **Current runtime:** dedicated media-service serves the full baseline route family listed above.
- **Current transitional:** gateway fallback to `/v1/content/media/*` exists when `MEDIA_SERVICE_URL` is unset and may not cover all routes.
- **Target:** remove fallback and keep `/v1/media/*` fully backed by dedicated media-service.

---

# 6. Explicit Non-Goals of this API

- Blog/article CRUD.
- Domain-specific policy orchestration (listing/event/post editorial semantics).
- Full DAM/CMS workflows.

---

*This outline defines the canonical platform media API contour for normalization and later reconciliation.*
