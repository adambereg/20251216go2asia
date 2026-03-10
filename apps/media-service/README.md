# Media Service

Minimal Phase 2 media backend (`apps/media-service`).

## Scope (v1, backend-first)

- Signed upload flow:
  - `POST /v1/media/upload-token`
  - `PUT /v1/media/upload/{token}`
- Metadata persistence in Neon (`media_files`)
- Ownership/access basics via gateway-issued `X-Gateway-Auth` (`sub` as owner)
- Canonical public contract `/v1/media/*`

## Out of scope

- Video pipeline, DRM, AI moderation
- Smart cropping / advanced CDN orchestration
- Full DAM/CMS UI

## Required env/secrets

- `SERVICE_JWT_SECRET`
- `MEDIA_UPLOAD_SIGNING_SECRET`
- `DATABASE_URL`

Optional:

- `MEDIA_PUBLIC_BASE_URL`
- `MEDIA_MAX_BYTES`
- `MEDIA_BUCKET_NAME`, `SPACE_MEDIA_BUCKET_NAME`

## Notes

- Public entrypoint remains API Gateway `/v1/media/*`.
- Gateway cutover is controlled by `MEDIA_SERVICE_URL`.
- Content-service fallback remains transitional during migration.
