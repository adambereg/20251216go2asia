# API Gateway — Boundary Overview

## Purpose

Этот документ фиксирует минимально достаточный auditable boundary для `api-gateway` в текущем цикле (NQ-006).
Он не заменяет downstream OpenAPI/сервисные контракты и не является route-by-route каталогом всей платформы.

## Canonical truth sources

- Runtime implementation: `apps/api-gateway/src/index.ts`
- Auth boundary policy: `docs/decisions/adr_0015_jwt_verification_at_gateway.md`
- Staging operational mapping: `docs/ops/staging_services_overview.md`
- Incident/ops behavior: `docs/ops/runbooks.md`

## Boundary role (current cycle)

`api-gateway` является единой edge/perimeter точкой для:

- входа клиентского трафика;
- user JWT verification boundary;
- маршрутизации публичных route families в downstream services;
- унификации operational headers (`X-Request-ID`, proxy/debug headers) и early error handling.

## Auth boundary (high level)

- Пользовательский JWT проверяется на gateway (см. ADR-0015).
- Для защищенных user-facing route families gateway выполняет verification и прокидывает trusted контекст (`X-Gateway-Auth`, `X-User-ID`) в downstream.
- Downstream бизнес-сервисы не считаются источником user JWT policy в рамках этого boundary-документа; их детальные auth/authz правила описываются в их собственных docs/контрактах.

## Route/service mapping (high level)

Ниже — route families и целевой downstream по текущему runtime mapping:

| Public path family | Downstream service URL var | Notes |
|---|---|---|
| `/v1/auth/*`, `/v1/users/*` | `AUTH_SERVICE_URL` | Identity/auth gateway entry |
| `/v1/content/*`, `/v1/api/content/*` | `CONTENT_SERVICE_URL` | Legacy normalize: `/v1/api/content/*` -> `/v1/content/*` |
| `/v1/media/*` | `MEDIA_SERVICE_URL` (fallback: `CONTENT_SERVICE_URL`) | Media fallback/rewrite path поддержан в gateway |
| `/v1/points/*` | `POINTS_SERVICE_URL` | Protected user routes via gateway auth boundary |
| `/v1/referral/*` | `REFERRAL_SERVICE_URL` | Protected user routes via gateway auth boundary |
| `/v1/space/*` | `SPACE_SERVICE_URL` | Phase-2 family; `501` если URL не задан |
| `/v1/reactions*` | `REACTIONS_SERVICE_URL` | Phase-2 family; `501` если URL не задан |
| `/v1/feed/*` | `FEED_SERVICE_URL` | Phase-2 family; `501` если URL не задан |
| `/v1/quests*`, `/v1/submissions/*` | `QUEST_SERVICE_URL` | Phase-2 family; `501` если URL не задан |
| `/v1/rielt/*` | `RIELT_SERVICE_URL` | Phase-2 family; `501` если URL не задан |
| `/v1/guru/*` | `GURU_SERVICE_URL` | Phase-2 family; `501` если URL не задан |
| `/v1/rf/*` | `RF_SERVICE_URL` | Phase-2 family; `501` если URL не задан |

## What this document is and is not

Этот документ:

- фиксирует boundary role gateway;
- фиксирует high-level route/service ownership map;
- фиксирует где читать auth boundary truth.

Этот документ НЕ:

- заменяет downstream API contracts;
- не декларирует полную per-endpoint ownership матрицу;
- не фиксирует долгосрочный gateway redesign.

Для business-level contract truth использовать `docs/openapi/*` и `docs/backend/<service>/*`.

