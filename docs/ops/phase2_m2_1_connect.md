# Milestone 2.1 — Connect hardening (Points/Referral)

SSOT плана: `docs/plans/phase2_delivery_plan.md`

Цель Milestone 2.1: сделать Connect “платформенным” UI экономики и прогресса **строго поверх** существующих сервисов:
- `apps/points-service` (SSOT Points)
- `apps/referral-service`

Без расширения scope:
- без tokenomics engine (`apps/token-service` остаётся skeleton)
- без G2A / NFT

## 1) Points action contract (Phase 2, Points-only)

В Phase 2 вводится и фиксируется **ограниченный** набор `PointsAction` (без Phase 3 токеномики).

Security invariant (Phase 2): **начисление Points происходит только server-side** (доменные сервисы → `POST /internal/points/add`). **Фронтенд никогда не начисляет Points напрямую**, иначе появляются дыры.

Источник:
- runtime validation: `apps/points-service/src/index.ts`
- OpenAPI: `docs/openapi/points.yaml` (`PointsAction`)

Договорённый набор (Phase 2):
- `registration`
- `first_login`
- `referral_bonus_referee`
- `referral_bonus_referrer`
- `event_registration`
- `space_post_created`
- `space_repost_created`
- `space_reaction_created`
- `quest_completed`
- `rielt_listing_created`
- `rf_partner_verified`
- `rf_voucher_claimed`
- `rf_voucher_redeemed`

## 2) Error shape hardening (Connect UX)

Поскольку downstream сервисы могут возвращать ошибки в формате:
- `{ error: "BadRequest", message: "..." }`

а UI ожидает:
- `{ error: { code, message } }`

SDK нормализует ошибки на уровне `packages/sdk/src/mutator.ts`, чтобы Connect UI работал стабильно независимо от варианта.

## 3) Referral claim hardening (post-auth)

После успешной авторизации:
- `POST /v1/users/ensure`
- `POST /v1/referral/claim` (если ранее был сохранён `?ref=CODE`)

Hardening:
- при `404/409` по claim — код удаляется из localStorage (чтобы не ретраить бесконечно)
- при сетевых/5xx — оставляем, чтобы попытаться позже


