# Connect Backend Architecture v1

**Project:** Go2Asia  
**Module:** Connect Asia  
**Service focus:** composition over existing backend services  
**Document role:** Engineering SSOT for current Connect backend architecture  
**Status:** Current MVP architecture baseline

**Authoritative stack note:** this backend architecture is canonical together with:
- `connect_domain_model_v1.md` (domain ownership/model)
- `connect_dependency_map_v1.md` (dependency boundaries)
- `connect_openapi_outline_v1.md` (API outline)
- `connect_service_production_architecture_v1.md` (runtime/production framing)
- `docs/ops/service_inventory.md`
- `docs/decisions/adr_0021_token_points_connect_terminology.md`
- `docs/modules/connect/connect_backend_closure_note_v1.md`

---

# 1. Purpose / Status

This document describes the current backend architecture of Connect Asia for the MVP.

Connect is not a standalone backend service. It is a product/UI module whose current backend truth is provided by existing services.

Legacy files under `docs/modules/connect/*` remain historical product vision input only. They are not current backend architecture SSOT because they describe a standalone Connect microservice, `/api/connect`, G2A, NFT, wallet, levels, missions, analytics, and broad tokenomics that are not implemented in the current runtime.

---

# 2. Architecture Formula

> Connect backend = Points + Referral + Quest handoffs + Gateway auth/routing + frontend composition.

Current implementation truth:

- `points-service` hosts the Connect dashboard read model.
- `points-service` owns Points ledger, balances, and off-chain badges.
- `referral-service` owns referral graph facts and referral earnings surface.
- `quest-service` owns quest progress/completion and bounded reward/badge handoffs.
- `api-gateway` handles routing/auth and must not become a business aggregator.
- `token-service` is skeleton-only and not a current Connect dependency.

---

# 3. Why No `connect-service` Now

No standalone `connect-service` is needed for the current MVP because:

- current Connect surfaces are owned by existing services
- Points ledger and badge truth already belong to `points-service`
- referral graph and referral earnings belong to `referral-service`
- quest completion and reward delivery state belong to `quest-service`
- gateway is sufficient for routing/auth and should not aggregate business logic
- premature service extraction would add ownership ambiguity without solving an existing runtime problem

Future extraction remains open only if real composition complexity appears.

Connect service extraction must not be introduced only because legacy docs once described Connect as a microservice.

---

# 4. Points Architecture Role

`points-service` is the current off-chain economy and badge baseline for Connect-facing MVP data.

It owns:

- ledger
- balances
- transactions
- badge catalog
- user badge awards
- dashboard read model
- internal points add
- internal badge award

Current tables:

- `points_transactions`
- `user_balances`
- `badges`
- `user_badges`

Current user-facing endpoints:

- `GET /v1/points/balance`
- `GET /v1/points/transactions`
- `GET /v1/points/badges`
- `GET /v1/points/badges/mine`
- `GET /v1/points/connect-dashboard`

Current internal endpoints:

- `POST /internal/points/add`
- `POST /internal/points/badges/award`

Important rules:

- Points ledger truth remains in `points_transactions`.
- Badge award truth remains in `user_badges`.
- The Connect dashboard is a read model, not source of truth.
- Points must not become owner of the referral graph or quest progress.

---

# 5. Referral Architecture Role

`referral-service` owns referral facts and the user-facing referral surfaces used by Connect.

It owns:

- referral graph
- referral code flow
- claim/code/tree/stats endpoints
- earnings read model
- first-login bonus trigger

Current tables:

- `referral_links`
- `referral_relations`

Current user-facing endpoints:

- `GET /v1/referral/code`
- `GET /v1/referral/stats`
- `GET /v1/referral/tree`
- `GET /v1/referral/earnings`
- `POST /v1/referral/claim`

Current internal endpoint:

- `POST /internal/referral/mark-first-login`

Current handoff:

```text
referral first login -> POST /internal/points/add
```

Important rules:

- Referral owns referral graph and activation facts.
- Points owns applied reward ledger truth.
- Referral must not write `points_transactions` directly.
- Referral must not own balances or badges.

---

# 6. Quest Architecture Role

`quest-service` owns quest runtime and bounded reward/badge handoffs that affect Connect-visible facts.

It owns:

- quest progress/completion
- quest submissions
- reward outbox/replay
- scheduled replay
- failed reward drilldown/requeue
- first quest badge auto-award handoff

Current tables:

- `quest_progress`
- `quest_submission`
- `quest_reward_outbox`

Current internal reward ops endpoints:

- `POST /internal/quests/rewards/replay-pending`
- `GET /internal/quests/rewards/outbox/stats`
- `GET /internal/quests/rewards/outbox/failed`
- `POST /internal/quests/rewards/outbox/requeue-failed`

Current handoffs:

```text
quest.completed -> POST /internal/points/add
quest.completed -> POST /internal/points/badges/award
```

Important rules:

- Quest owns completion truth, not ledger truth.
- Quest may own delivery-state retry for its reward handoff.
- Points owns final Points transaction and badge award truth.
- Quest must not write `points_transactions` or `user_badges` directly.
- Badge award failures are non-blocking for quest completion.

---

# 7. Gateway Role

API Gateway provides:

- routing
- gateway-origin auth
- request proxying

API Gateway must not provide:

- Connect business aggregation
- ledger ownership
- referral graph ownership
- quest reward ownership
- tokenomics behavior

Gateway routes Connect-facing user APIs to existing service owners.

---

# 8. Current Connect Dashboard Architecture

Current dashboard endpoint:

- `GET /v1/points/connect-dashboard`

Hosted by:

- `points-service`

Current sections:

- `balance`
- `recentTransactions`
- `referrals`
- `badges`

Purpose:

- provide one bounded MVP read surface for the Connect dashboard
- reduce frontend mock-heavy composition
- keep the dashboard honest and backend-backed

Non-goals:

- no G2A
- no NFT count
- no wallet
- no levels/statuses
- no missions
- no analytics/rankings
- no partner income
- no PRO economy

---

# 9. Future Backend Expansion

The following are future extension points only.

## 9.1 Referral reward outbox

Possible if production evidence shows missed referral rewards that need durable replay.

Not current MVP.

## 9.2 Progression service

Possible for levels, statuses, XP, seasons, and progression.

Requires separate backend truth before UI.

## 9.3 Analytics service

Possible for activity aggregates, rankings, charts, and source breakdowns.

Requires privacy and aggregate ownership decisions.

## 9.4 Tokenomics / G2A

Possible only after separate legal and architecture pass.

Requires backend accounting truth and cannot be inferred from Points.

## 9.5 NFT bridge

Possible after Blockchain Gateway and minting architecture.

Current badges remain off-chain achievements.

## 9.6 Potential Connect service extraction

Possible only if:

- read-model composition grows beyond the current service boundaries
- caching/materialization becomes a real production need
- multiple Connect-specific read surfaces require a dedicated owner

Not current MVP.

---

# 10. Anti-Scope-Drift Rules

Do not:

- create `connect-service` in the current MVP
- show fake G2A
- show fake NFT
- show fake wallet
- show fake levels/statuses
- show fake missions
- show fake analytics/rankings
- use `/api/connect`
- use `/v1/connect/*`
- use `/v1/token/*`
- treat `token-service` as implemented tokenomics
- move gateway into business aggregation
- move referral graph ownership into Points
- move ledger or badge truth into Quest or Referral

---

# 11. Final Formula

> Connect backend architecture is existing service composition, not a new backend service. Current MVP truth lives in Points, Referral, Quest handoffs, and Gateway routing/auth.
