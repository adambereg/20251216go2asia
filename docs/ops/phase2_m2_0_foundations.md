# Milestone 2.0 — Platform Foundations / Service Readiness

SSOT плана: `docs/plans/phase2_delivery_plan.md`

Этот документ фиксирует **технические конвенции** Milestone 2.0, чтобы последующие сервисы Фазы 2 создавались единообразно, без “особых случаев”.

## 1) Service template (Cloudflare Worker)

Шаблон: `templates/worker-service/`

Обязательные минимальные контракты каждого нового backend‑сервиса:
- `GET /health`
- `GET /version` (может совпадать с `/health` по payload в MVP)
- `X-Request-ID` в ответе
- логирование через `@go2asia/logger`

> Шаблон — **не сервис**. Он не деплоится и не входит в `pnpm-workspace.yaml`.

## 2) API Gateway: prefix contract (Phase 2)

Gateway остаётся единым входом. В Milestone 2.0 фиксируется набор префиксов Фазы 2:
- `/v1/media/*` → canonical public contract for media; до выделения `media-service` допускается только transitional fallback в `CONTENT_SERVICE_URL`
- `/v1/space/*` → `SPACE_SERVICE_URL` (будет активирован в Milestone 2.3)
- `/v1/quest/*` → `QUEST_SERVICE_URL` (Milestone 2.4)
- `/v1/rielt/*` → `RIELT_SERVICE_URL` (Milestone 2.5)
- `/v1/guru/*` → `GURU_SERVICE_URL` (Milestone 2.6)
- `/v1/rf/*` → `RF_SERVICE_URL` (Milestone 2.7)

Важно: пока сервис не реализован/не настроен, gateway **не должен** ломать existing behavior для остального продукта.
Важно: transitional alias/fallback для media не считается общим шаблоном для других будущих доменов и не должен копироваться без отдельного архитектурного решения.

## 3) OpenAPI-first

SSOT контрактов остаётся “per-service specs” в `docs/openapi/*.yaml`.

Bundling:
- Скрипт: `scripts/openapi_bundle.mjs`
- Артефакт: `docs/openapi/openapi.bundle.yaml`

Правило: при добавлении нового сервиса Фазы 2 — добавляется его `docs/openapi/<service>.yaml` и включается в список `SERVICE_SPECS`.

## 4) SDK readiness

SDK ходит в API Gateway через `packages/sdk/src/mutator.ts` и использует Clerk token, когда он доступен.

Правило: SDK добавляется **только** под реально существующие `/v1/*` endpoints, без “заглушек” под Phase 3.
Root import `@go2asia/sdk` должен экспортировать только стабильные gateway-facing helpers; generated low-level артефакты остаются namespaced.

## 5) DB readiness (schema-by-domain)

Источник: `packages/db/src/schema/*`

Правило: новые домены Phase 2 добавляются как отдельные schema‑файлы (например `schema/space.ts`, `schema/quest.ts` и т.д.), без смешивания в существующие домены.
Для baseline зафиксирован список Phase 2 domain boundaries в `packages/db/src/schema/conventions.ts`.


