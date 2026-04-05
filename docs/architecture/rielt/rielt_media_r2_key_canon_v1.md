# Rielt Media R2 Key Canon v1

Status: implementation note (bounded Step 8 alignment)  
Scope: Rielt listing images in Cloudflare R2, reference-only ownership model

## 1) Canonical R2 key pattern

Rielt listing media keys must follow deterministic pathing:

`rielt/listings/{country_slug}/{city_slug}/{listing_slug}/01.jpg`

Where:
- `01.jpg` is canonical hero image.
- `02.jpg..NN.jpg` are gallery images in display order.
- All segments and filenames are lowercase kebab-case, ASCII only.
- No spaces, no random UUID-based filenames in canonical key path.

## 2) Slug source rules

- `country_slug` and `city_slug` must align with Atlas slug conventions.
- `listing_slug` comes from `rielt_listing.slug`.
- If input data carries non-canonical ids/slugs, normalize before upload/import.

## 3) DB reference model (Step 8-safe)

Rielt keeps reference-only ownership:
- `rielt_listing_media` stores relation fields:
  - `listing_id`
  - `media_id`
  - `sort_order`
  - `is_cover`
- Platform media layer (`media_files`) stores:
  - `id`
  - `key`
  - `bucket`
  - `provider`
  - `public_url` (derived/cache field)

Rielt does not own binary media bytes or bucket management.

## 4) URL resolution pattern

For the current Rielt public DTO (`coverUrl`, `photos`) the practical path is server-side resolution:
- `rielt-service` reads media references and resolves public URLs before returning DTO.
- Frontend consumes resolved URLs from runtime DTO.
- Full URL must not become domain SSOT in Rielt tables; canonical reference is media key/id.

This keeps Rielt aligned with cross-module dominant pattern while avoiding a contract break in current frontend.

## 5) Upload + binding operational flow

1. Upload files to R2 using canonical keys under `rielt/listings/...`.
2. Upsert rows in `media_files` with matching `key` and target bucket/provider.
3. Bind listing-media relations via `rielt_listing_media` using `media_id = media_files.id`.
4. Mark one row per listing as cover (`is_cover = true`) and keep deterministic `sort_order`.
5. Validate runtime read model returns expected `coverUrl`/`photos` ordering.

## 6) What is explicitly out of scope

- Booking/payments/chat/CRM flows.
- RF/voucher/PRO ownership transfer into `rielt-service`.
- Broad media-stack refactor across Atlas/Pulse/Blog.
