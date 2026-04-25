# Connect OpenAPI Outline v1

**Project:** Go2Asia  
**Module:** Connect Asia  
**Service focus:** Connect-facing API surfaces across existing services  
**Document role:** Human-readable API outline for Connect MVP integration  
**Status:** Current MVP architecture baseline

**Authoritative stack note:** this outline is canonical together with:
- `connect_domain_model_v1.md` (domain ownership/model)
- `connect_dependency_map_v1.md` (dependency boundaries)
- `connect_backend_architecture_v1.md` (backend composition)
- `connect_service_production_architecture_v1.md` (runtime/production framing)
- `docs/openapi/points.yaml`
- `docs/openapi/referral.yaml`
- generated OpenAPI bundle and SDK artifacts

---

# 1. Purpose / Status

This document records the current Connect-facing API surfaces.

It is an outline, not a replacement for actual OpenAPI YAML. The source of truth remains `docs/openapi/*.yaml`, the generated OpenAPI bundle, and generated SDK/types.

Legacy files under `docs/modules/connect/*` are historical product vision input only. They are not current API SSOT because they describe `/api/connect`, wallet-like summaries, G2A, NFT, levels, achievements, missions, and analytics endpoints that are not current MVP APIs.

---

# 2. Current User-Facing API Surface

All user-facing routes are accessed through API Gateway with authenticated user context.

## 2.1 Points

Owner:

- `points-service`

Current endpoints:

- `GET /v1/points/connect-dashboard`
- `GET /v1/points/balance`
- `GET /v1/points/transactions`
- `GET /v1/points/badges`
- `GET /v1/points/badges/mine`

Connect usage:

- dashboard summary
- Points balance
- Points ledger history
- off-chain badge catalog
- current user's badge awards

## 2.2 Referral

Owner:

- `referral-service`

Current endpoints:

- `GET /v1/referral/code`
- `GET /v1/referral/stats`
- `GET /v1/referral/tree`
- `GET /v1/referral/earnings`
- `POST /v1/referral/claim`

Connect usage:

- referral code/link
- lightweight referral stats
- referral tree
- referral earnings details
- referral code claim

---

# 3. Current Internal API Surface

Internal routes require service authentication. They are not frontend APIs.

## 3.1 Points

Owner:

- `points-service`

Current internal endpoints:

- `POST /internal/points/add`
- `POST /internal/points/badges/award`

Used for:

- idempotent Points ledger writes
- idempotent off-chain badge awards

## 3.2 Referral

Owner:

- `referral-service`

Current internal endpoint:

- `POST /internal/referral/mark-first-login`

Used for:

- first-login activation
- referrer bonus trigger into Points

Note:

- repository endpoint inventory also lists internal referral code/link helpers; they are referral-internal surfaces and not Connect UI APIs.

## 3.3 Quest

Owner:

- `quest-service`

Current internal endpoints:

- `POST /internal/quests/rewards/replay-pending`
- `GET /internal/quests/rewards/outbox/stats`
- `GET /internal/quests/rewards/outbox/failed`
- `POST /internal/quests/rewards/outbox/requeue-failed`

Used for:

- replaying pending quest reward deliveries
- observing quest reward outbox state
- drilling into failed reward deliveries
- safely requeueing selected failed rows

---

# 4. Current Dashboard Response Sections

`GET /v1/points/connect-dashboard` currently returns a bounded MVP dashboard shape.

Sections:

- `balance`
- `recentTransactions`
- `referrals`
- `badges`

Interpretation:

- `balance` is a view of current Points balance.
- `recentTransactions` is a bounded list from Points ledger history.
- `referrals` is a summary view over referral facts and applied Points rewards.
- `badges` is a summary/recent view of off-chain badge awards.

Not included:

- G2A
- NFT count
- wallet status
- levels/statuses
- missions
- analytics/rankings
- partner income
- PRO economy

---

# 5. Explicitly Not Current API

The following must not be treated as current MVP APIs:

- `/api/connect/*`
- `/v1/connect/*`
- `/v1/token/*`
- `/v1/wallet/*`
- `/v1/conversions/points-to-g2a`
- levels API
- missions API
- NFT minting API
- G2A conversion API
- analytics/rankings API

These names may appear in legacy or future-vision docs, but they are not current runtime/API truth.

---

# 6. Frontend Guidance

Frontend integration should:

- use SDK helpers when available
- use `GET /v1/points/connect-dashboard` for the MVP dashboard
- use `GET /v1/points/balance` and `GET /v1/points/transactions` for Points/activity views
- use `GET /v1/referral/code`, `GET /v1/referral/stats`, `GET /v1/referral/tree`, and `GET /v1/referral/earnings` for referral views
- use `GET /v1/points/badges` and `GET /v1/points/badges/mine` for badges
- avoid legacy `/api/connect`
- avoid `/v1/token/*`
- avoid rendering future fields if backend does not return them
- show honest empty states instead of mock economy values

Frontend integration must not:

- reconstruct hidden tokenomics from Points
- call internal routes from the browser
- show fake G2A/NFT/wallet/levels/missions/analytics sections as implemented

---

# 7. API Ownership Summary

| Surface | Owner | Connect role |
| --- | --- | --- |
| `/v1/points/*` | `points-service` | Points, transactions, badges, dashboard |
| `/v1/referral/*` | `referral-service` | referral code, graph, earnings |
| `/internal/points/*` | `points-service` | service-to-service writes only |
| `/internal/referral/*` | `referral-service` | service-to-service referral lifecycle |
| `/internal/quests/rewards/*` | `quest-service` | internal reward delivery ops |
| `/v1/token/*` | none in MVP | not current API |
| `/api/connect/*` | none in MVP | legacy only |

---

# 8. Final Formula

> Connect API surface in MVP is Points + Referral user APIs plus internal Quest/Points/Referral handoffs. There is no current `/api/connect`, `/v1/connect`, or `/v1/token` API.
