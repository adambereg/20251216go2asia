# Media Service Production Architecture v1

**Project:** Go2Asia  
**Module:** Media  
**Service:** `media-service`  
**Document role:** Production architecture SSOT for platform media-service  
**Status:** Draft v1 (assembly baseline)

---

# 1. Production Role

`media-service` is the production platform endpoint for media asset upload and attachment metadata under canonical gateway path `/v1/media/*`.

---

# 2. Runtime Topology (Current)

| Layer | Current role |
|------|------|
| API Gateway | Public ingress, route classification, auth context forwarding, fallback control |
| media-service Worker | Upload token, upload, lookup, attach operations |
| Object storage (R2) | Binary object persistence by bucket/key |
| Postgres/Neon | Metadata persistence (`media_assets`, `media_variants`, `media_usage`) |

---

# 3. Request Path Architecture

## 3.1 Token issuance and attach

1. Client calls gateway `/v1/media/*` protected endpoint.
2. Gateway validates user token and forwards service auth context.
3. Media-service validates gateway-origin auth and executes operation.

## 3.2 Upload by signed token

1. Client uploads binary to `/v1/media/upload/{token}`.
2. Service validates signed upload token.
3. Service writes bytes to R2 and updates metadata persistence.

## 3.3 Lookup

- Client reads media metadata from `/v1/media/{mediaId}` through gateway.

---

# 4. Operational Configuration

## 4.1 Required

- `SERVICE_JWT_SECRET`
- `MEDIA_UPLOAD_SIGNING_SECRET`
- `DATABASE_URL`
- media bucket binding (`MEDIA_BUCKET` or compatible binding)

## 4.2 Optional

- `MEDIA_PUBLIC_BASE_URL`
- `MEDIA_MAX_BYTES`
- bucket name vars for deterministic URL shaping

---

# 5. Transitional and Historical Notes

- Historical MVP consolidation placed media upload contour in `content-service`.
- Current gateway can fallback media routes to content-service when `MEDIA_SERVICE_URL` is missing.
- This fallback is transitional operational coupling and should not be interpreted as canonical long-term ownership.

---

# 6. Reliability and Guardrails

- `/ready` must fail when core secrets/DB/storage bindings are missing.
- Signed token TTL and max-bytes constraints protect upload surface.
- Non-media services must not bypass media API by writing media tables directly.

---

# 7. Current vs Target Production State

- **Current operational state:** dedicated `apps/media-service` exists and is routable via gateway.
- **Current transitional state:** fallback path to content-service remains for compatibility.
- **Target state:** media-service only for `/v1/media/*` with fallback removed after final cutover.

---

*This document defines production architecture baseline for platform media-service and its transitional coupling boundaries.*
