# Milestone 2.2 — Media / Storage (R2, signed uploads, SDK)

SSOT плана: `docs/plans/phase2_delivery_plan.md`

Цель Milestone 2.2: дать всем продуктовым модулям Фазы 2 единый и безопасный способ работать с медиа через R2:
- без “уникальных” решений в каждом модуле
- без утечки R2‑учётных данных на клиент

> Контекст: у вас уже созданы R2 buckets в Cloudflare (`go2asia-media`, `go2asiaspace`) и в одном из них уже есть JPG‑файлы. Milestone 2.2 **не требует пересоздания bucket’ов** — мы только подключаем binding’и в Worker.

## 1) Архитектурный принцип (security)

- **Клиент НЕ получает** R2 credentials и не пишет в R2 напрямую.
- Клиент получает **короткоживущий signed upload token** (server-side) и загружает файл через upload endpoint, авторизованный этим токеном.

## 2) Реализация в Phase 2 (без нового сервиса)

В Phase 2.2 media‑контур реализуется внутри существующего `apps/content-service` (platform milestone).

R2 binding’и (см. `apps/content-service/wrangler.toml`):
- `MEDIA_BUCKET` → `go2asia-media`
- `SPACE_MEDIA_BUCKET` → `go2asiaspace` (готовность для Space)

## 3) API (Content Service)

- `POST /v1/content/media/upload-token` (authorized, требует user context через gateway)
- `PUT /v1/content/media/upload/{token}` (upload бинарных данных по signed token)

OpenAPI: `docs/openapi/content.yaml`

## 4) SDK

SDK helpers:
- `@go2asia/sdk/media`
  - `createMediaUploadToken(...)`
  - `uploadMediaByToken(...)`

## 5) Конфигурация (без пересоздания bucket’ов)

Для staging/production достаточно:
- привязать Worker `go2asia-content-service(-staging)` к существующим bucket’ам (R2 bindings),
- задать:
  - `MEDIA_UPLOAD_SIGNING_SECRET` (secret)
  - (optional) `MEDIA_PUBLIC_BASE_URL` (если bucket public / есть public domain)

## 6) Media adoption для Atlas/Pulse/Blog (без миграции объектов)

Архитектурный принцип: UI не знает про R2 и не хранит “моковые URL”, если API отдаёт реальное медиа.

Текущее поведение `content-service`:
- **Primary SSOT**: `media_files.public_url` (через `hero_media_id` / `image_media_id` / `cover_media_id`) — если ссылки заполнены в БД.
- **Fallback (Phase 2.2, без миграций)**: для Atlas (countries/cities/places), если `hero_media_id` не заполнен, `content-service` пытается найти JPG в R2 bucket `go2asia-media` по префиксам:
  - `country/country-<code>/` (наблюдаемая структура, например `country/country-vn/`)
  - `city/<slug>/` или `city/city-<slug>/`
  - `place/<slug>/` или `place/place-<slug>/`
  и формирует URL как `${MEDIA_PUBLIC_BASE_URL}/${key}`.

Ограничения fallback:
- работает только если задан `MEDIA_PUBLIC_BASE_URL` и привязан `MEDIA_BUCKET`
- предназначен как “мягкая” миграция без изменений структуры R2; полноценный SSOT остаётся за `media_files` и `*_media_id`.


