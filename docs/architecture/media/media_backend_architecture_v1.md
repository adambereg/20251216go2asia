# Media Backend Architecture v1

**Project:** Go2Asia  
**Module:** Media  
**Service:** `media-service`  
**Document role:** Canonical backend architecture SSOT for platform media service  
**Status:** Draft v1 (assembly baseline)

---

# 1. Service Role

`media-service` is the platform backend for media upload and asset metadata lifecycle.

It provides:

- signed upload-token issuance,
- upload-by-token to object storage,
- media lookup for canonical metadata/variants,
- usage attachment recording for domain entities.

It does not provide blog/article domain APIs.

---

# 2. Ownership Boundaries

## 2.1 Media owns

- Upload-token cryptographic contract.
- Object key generation conventions.
- Metadata persistence: `media_assets`, `media_variants`, `media_usage`.
- Asset lifecycle transitions related to upload/attach.

## 2.2 Media references

- Gateway identity context (`X-Gateway-Auth`, user id and roles).
- Domain owner ids for attachment targets.

## 2.3 Media never owns

- Business lifecycles of posts/listings/events/partners/quests/articles.
- Domain moderation semantics (outside pure media lifecycle).

---

# 3. Internal Responsibilities (Current Runtime)

## 3.1 Route contour

- `POST /v1/media/upload-token`
- `PUT /v1/media/upload/{token}`
- `GET /v1/media/{mediaId}`
- `POST /v1/media/{mediaId}/attach`
- plus `/health`, `/ready`, `/version`

## 3.2 Upload flow

1. Protected token issuance validates gateway-origin identity and scope.
2. Token contains signed upload constraints (scope, content type, max bytes, expiry, object key).
3. Upload endpoint validates token and writes object bytes to R2 bucket.
4. Metadata rows are persisted/updated in media tables.

## 3.3 Usage attach flow

1. Protected attach call validates principal and ownership.
2. Service records usage tuple in `media_usage`.
3. Service updates asset status/attachment summary in `media_assets`.

## 3.4 Lookup flow

- `GET /v1/media/{mediaId}` returns canonical metadata and variant list for one asset.

---

# 4. Data Access Architecture

| Layer | Responsibility |
|------|------|
| Object storage | Binary object bytes |
| Relational DB | Asset, variant, usage metadata and lifecycle state |
| Service layer | Signing, auth checks, validation, metadata consistency |

Separation rule: bytes in storage, truth of references in DB.

---

# 5. Auth and Security Expectations

- Protected operations (`upload-token`, `attach`) require gateway-origin service auth context.
- Upload operation is authorized by signed short-lived token.
- Service readiness depends on DB URL, service JWT secret, and upload-signing secret.

---

# 6. Gateway and Transitional Runtime Notes

- Public contract is `/v1/media/*` via API gateway.
- Current runtime includes transitional fallback to `/v1/content/media/*` when `MEDIA_SERVICE_URL` is not set.
- Transitional fallback is compatibility behavior, not canonical ownership architecture.
- Canonical media-domain write guarantees (asset/variant/usage persistence) are defined by dedicated `media-service` runtime.
- Fallback path is transitional and limited; it must not be interpreted as full operational parity with canonical media runtime.

---

# 7. Deferred / Out of Scope (Current Step)

- Advanced variant generation pipeline beyond minimal baseline.
- DAM/CMS workflows for editorial content.
- Video/DRM/AI moderation stack.
- Full domain-level policy orchestration outside media attach lifecycle.

---

*This document defines the backend architecture baseline for platform media-service, aligned with current runtime and explicit transitional notes.*
