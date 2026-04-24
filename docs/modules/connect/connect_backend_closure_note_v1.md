# Connect Backend Closure Note v1

- Project: Go2Asia
- Module: Connect Asia
- Scope: backend closure / current status / frontend readiness
- Status: current implementation snapshot
- Date: 2026-04-24
- Repo branch: `feat/connect-dashboard-read-model`
- Document role: source-of-truth summary for current Connect backend state

## 1. Purpose

This document closes the current Connect backend slice series and records what is actually implemented in the repository today.

Its goals are:

- summarize the real backend surfaces that Connect currently uses;
- capture domain ownership and service boundaries;
- prevent future scope drift into premature `connect-service`, broad tokenomics, or reward-engine work;
- guide the next frontend integration passes;
- clarify that Connect is currently a product/UI module, not a separate backend service.

This document is repo-grounded. When terminology or older Connect product docs diverge from runtime reality, the backend truth for this note is taken from:

- `docs/ops/service_inventory.md`
- `docs/decisions/adr_0021_token_points_connect_terminology.md`
- `docs/openapi/derived_endpoints.md`
- runtime/service code under `apps/*-service`

## 2. Executive summary

- Connect backend is currently implemented as a composition of existing services, not as a standalone `connect-service`.
- `points-service` is the current off-chain ledger and balance truth for Connect-facing economy data.
- `referral-service` owns referral graph facts, referral code flows, and the referral earnings read model.
- `quest-service` owns quest progress/completion and performs bounded reward and badge handoffs into existing services.
- Badges are implemented as off-chain achievements inside the current Points MVP contour.
- A bounded dashboard read model is available via `GET /v1/points/connect-dashboard`.
- G2A, NFT, wallet, on-chain, blockchain, and broader tokenomics remain intentionally out of scope.

## 3. Completed backend slices

### Slice 1 - Points Ledger Baseline Hardening

- Goal:
  - make `points-service` the audit-friendly off-chain ledger baseline for Connect-related points.
- Main files/services touched:
  - `apps/points-service`
  - callers in `auth-service`, `content-service`, `referral-service`
  - `packages/sdk/src/transactions.ts`
- Key endpoints/tables added or hardened:
  - `POST /internal/points/add`
  - `GET /v1/points/balance`
  - `GET /v1/points/transactions`
  - `points_transactions`
  - `user_balances`
- Boundary preserved:
  - Points remained ledger owner and idempotency owner.
- Out-of-scope preserved:
  - no G2A
  - no NFT
  - no blockchain
  - no broad tokenomics engine

### Slice 2 - Bounded Reward Event Ingestion Baseline

- Goal:
  - connect `quest.completed` to existing points ledger writes in a bounded way.
- Main files/services touched:
  - `apps/quest-service`
  - `apps/points-service`
- Key endpoints/tables added or used:
  - `quest.completed -> POST /internal/points/add`
- Boundary preserved:
  - Quest did not become ledger owner.
  - Points remained balance and transaction truth.
- Out-of-scope preserved:
  - no event bus
  - no broad reward wave
  - no UI work

### Slice 2.1 - Quest Reward Delivery Outbox / Reconciliation Baseline

- Goal:
  - make quest reward delivery durable when `points-service` is unavailable.
- Main files/services touched:
  - `apps/quest-service`
  - `packages/db/src/schema/quest.ts`
- Key endpoints/tables added:
  - `quest_reward_outbox`
  - internal replay path in `quest-service`
- Boundary preserved:
  - Quest owned reward delivery intent and retry state only.
  - Points still owned final ledger writes.
- Out-of-scope preserved:
  - no new service
  - no broker/event bus

### Slice 2.2 - Scheduled Reward Replay & Minimal Ops Observability

- Goal:
  - add scheduled replay and minimal ops visibility for pending quest reward delivery.
- Main files/services touched:
  - `apps/quest-service/src/index.ts`
  - `apps/quest-service/src/routes/quests.ts`
- Key endpoints/tables added:
  - `POST /internal/quests/rewards/replay-pending`
  - `GET /internal/quests/rewards/outbox/stats`
  - scheduled replay over `quest_reward_outbox`
- Boundary preserved:
  - this remained delivery-state ops, not a ledger or reward-engine redesign.
- Out-of-scope preserved:
  - no user-facing ops exposure
  - no Connect UI changes

### Slice 2.3 - Failed Reward Ops Drilldown & Safe Requeue

- Goal:
  - support bounded internal drilldown and safe requeue of failed quest reward deliveries.
- Main files/services touched:
  - `apps/quest-service`
- Key endpoints/tables added:
  - `GET /internal/quests/rewards/outbox/failed`
  - `POST /internal/quests/rewards/outbox/requeue-failed`
- Boundary preserved:
  - Quest still owned delivery retry state only.
- Out-of-scope preserved:
  - no public/admin dashboard
  - no change to points ledger truth

### Slice 3 - Referral Earnings Read Model

- Goal:
  - provide an honest user-facing referral earnings view from referral facts plus matched points ledger rows.
- Main files/services touched:
  - `apps/referral-service`
  - `packages/sdk/src/referrals.ts`
- Key endpoints/tables added or used:
  - `GET /v1/referral/earnings`
  - `referral_relations`
  - matched `points_transactions`
- Boundary preserved:
  - Referral remained owner of referral graph and activation facts.
  - Points remained ledger truth for applied earnings.
- Out-of-scope preserved:
  - no Connect service
  - no fake referral balances
  - no tokenomics expansion

### Slice 4 - Badge Baseline Foundation

- Goal:
  - add a bounded off-chain badge baseline inside `points-service`.
- Main files/services touched:
  - `apps/points-service`
  - `packages/db/src/schema/points.ts`
  - `packages/db/migrations/0044_badge_baseline_foundation_v1.sql`
  - `packages/sdk/src/badges.ts`
- Key endpoints/tables added:
  - `GET /v1/points/badges`
  - `GET /v1/points/badges/mine`
  - `POST /internal/points/badges/award`
  - `badges`
  - enriched `user_badges`
- Boundary preserved:
  - badges stayed separate from points ledger writes and balances.
- Out-of-scope preserved:
  - no NFT
  - no on-chain
  - no badge rules engine

### Slice 4.1 - First Badge Auto-awards

- Goal:
  - add the first bounded automatic badge award using an already existing internal badge endpoint.
- Main files/services touched:
  - `apps/quest-service`
  - `apps/points-service` contract usage
- Key endpoints/tables added or used:
  - `quest.completed -> POST /internal/points/badges/award`
  - badge code: `first_quest_completed`
  - source: `sourceType = quest.completed`, `sourceId = progressId`
- Boundary preserved:
  - Quest did not become badge owner.
  - Points remained badge award truth.
  - failures remained non-blocking via `ExecutionContext.waitUntil()`.
- Out-of-scope preserved:
  - no broad auto-award system
  - no referral auto-awards yet
  - no new service

### Slice 5 - Connect Dashboard Read Model

- Goal:
  - expose one bounded backend read surface for the future Connect dashboard.
- Main files/services touched:
  - `apps/points-service`
  - `packages/sdk/src/connectDashboard.ts`
- Key endpoints/tables added or used:
  - `GET /v1/points/connect-dashboard`
  - reads from `user_balances`, `points_transactions`, `user_badges`, `badges`
  - summary-only read composition over `referral_relations` plus matched `points_transactions`
- Boundary preserved:
  - Dashboard remained a convenience read model, not a new source of truth.
  - No new `connect-service` was introduced.
- Out-of-scope preserved:
  - no G2A
  - no NFT count
  - no wallet
  - no levels/statuses
  - no missions
  - no new reward logic

## 4. Current service ownership map

| Service / module | Owns | Notes |
| --- | --- | --- |
| Points Service | `user_balances`, `points_transactions`, points transaction history, idempotent internal points add, badge catalog, user badge awards, Connect dashboard read model | Current off-chain ledger and badge truth for Connect-facing economy baseline |
| Referral Service | `referral_links`, `referral_relations`, referral code/claim/tree/stats, referral first-login bonus trigger, referral earnings read model | Owns referral graph and activation facts; reads matched ledger rows for earnings composition |
| Quest Service | quests, steps, progress, submissions, quest completion facts, quest reward outbox/replay, non-blocking first quest badge handoff | Owns quest runtime and delivery-state logic only |
| API Gateway | routing, gateway-origin auth, request proxying | Does not own business aggregation |
| Token Service | skeleton only | Not a tokenomics engine and not part of current Connect backend runtime |
| Connect | product/UI module | Not a backend service in current MVP |

## 5. Current API surface

### Points (owner: `points-service`)

- `GET /v1/points/balance`
  - current user points balance from `user_balances`
- `GET /v1/points/transactions`
  - current user points ledger history from `points_transactions`
- `GET /v1/points/badges`
  - active badge catalog
- `GET /v1/points/badges/mine`
  - current user badge awards
- `GET /v1/points/connect-dashboard`
  - bounded dashboard read model for balance, recent transactions, referral summary, and badge summary

### Referral (owner: `referral-service`)

- `GET /v1/referral/code`
  - current user referral code
- `GET /v1/referral/stats`
  - lightweight referral stats
- `GET /v1/referral/tree`
  - current user referral tree
- `POST /v1/referral/claim`
  - claim a referral code for current user
- `GET /v1/referral/earnings`
  - referral earnings read model with summary plus referral-level items

### Internal surfaces

#### Points internal (owner: `points-service`)

- `POST /internal/points/add`
  - idempotent internal points write
- `POST /internal/points/badges/award`
  - idempotent internal off-chain badge award

#### Referral internal (owner: `referral-service`)

- `POST /internal/referral/mark-first-login`
  - bounded first-login activation and referrer bonus trigger

#### Quest internal (owner: `quest-service`)

- `POST /internal/quests/rewards/replay-pending`
  - replay pending quest reward deliveries
- `GET /internal/quests/rewards/outbox/stats`
  - minimal outbox stats
- `GET /internal/quests/rewards/outbox/failed`
  - failed outbox drilldown
- `POST /internal/quests/rewards/outbox/requeue-failed`
  - safe requeue of selected failed outbox rows

## 6. Current database/read model state

### Points domain

- `user_balances`
  - current points balance per user
- `points_transactions`
  - ledger truth for applied points movements
- `badges`
  - off-chain badge catalog
- `user_badges`
  - badge award truth for users

### Referral domain

- `referral_links`
  - referral codes owned by users
- `referral_relations`
  - referral graph and activation facts

### Quest domain

- `quest_progress`
  - quest participation and completion truth
- `quest_submission`
  - submission/review facts for quest steps
- `quest_reward_outbox`
  - bounded delivery intent and replay state for quest reward writes into Points

### Read model note

- Ledger truth lives in `points_transactions`.
- Badge award truth lives in `user_badges`.
- Referral graph truth lives in `referral_relations`.
- Quest completion truth lives in `quest_progress`.
- The dashboard read model is not a table and not an SSOT; it is a convenience response assembled at request time.

## 7. Connect Dashboard backend readiness

`GET /v1/points/connect-dashboard` currently provides:

- `balance`
  - points and `updatedAt`
- `recentTransactions`
  - bounded recent ledger items without metadata dump
- `referrals`
  - summary-only referral counts and total earned points
- `badges`
  - `totalBadges` and bounded recent badge awards

It does not provide:

- G2A
- NFT count
- wallet logic
- levels or statuses
- missions
- next actions
- profile/social data
- admin or ops data

Frontend implication:

- any fake Connect fields still present in frontend mocks should be removed, hidden, or explicitly shown as unavailable until backend truth exists;
- the dashboard endpoint should be treated as the honest MVP backend surface, not as a placeholder for future tokenomics.

## 8. Frontend integration readiness

The backend is ready for a bounded frontend integration pass.

Recommended frontend targets:

- Connect Dashboard / `DashboardView`
  - replace current multi-call plus mock-heavy composition with `useGetConnectDashboard()` or equivalent
- referral details tab
  - keep using `GET /v1/referral/earnings` when detailed referral earning items are needed
- badges tab
  - keep using `GET /v1/points/badges/mine`

Frontend guidance:

- do not show G2A, NFT, wallet, levels, or status concepts unless backed by real backend truth;
- use empty states when real sections are empty;
- preserve referral detail screens as separate reads instead of overloading the dashboard response;
- avoid reintroducing mock economy fields on the main dashboard once the unified dashboard endpoint is wired in.

## 9. Explicit boundaries / do-not-cross rules

Do not:

- create `connect-service` yet;
- treat `token-service` as an implemented tokenomics engine;
- add `/v1/token/*`;
- add G2A;
- add NFT or on-chain minting;
- add wallet behavior;
- add a broad reward engine;
- add an event bus for this scope;
- reward reactions or likes broadly;
- make API Gateway a business aggregator;
- make Quest own badges or balances;
- make Referral own ledger or balance truth;
- show fake frontend economy fields as if they were backend-backed.

## 10. Known gaps / follow-ups

- frontend integration with `GET /v1/points/connect-dashboard`
- optional referral auto-award later, only if product requires it
- possible badge admin/catalog management later
- possible referral reward outbox/replay only if missed-reward evidence appears in production
- possible dashboard caching later
- possible internal referral summary surface later, to avoid duplicated summary logic inside dashboard composition
- levels/statuses require their own backend truth before UI use
- G2A, NFT, wallet, and on-chain flows remain postponed

## 11. Recommended next sequence

1. Connect Frontend Slice 1 - DashboardView integration with `GET /v1/points/connect-dashboard`
2. Connect Frontend Slice 2 - Referral tab integration with `GET /v1/referral/earnings`
3. Connect Frontend Slice 3 - Badges tab integration with `GET /v1/points/badges/mine`
4. Optional backend Slice 4.2 - referral auto-award, only after frontend baseline or explicit product need
5. Later - dashboard caching, admin badge catalog management, levels truth, and only then separate tokenomics/G2A/NFT architecture work

## 12. Final verdict

Connect backend MVP baseline is ready for frontend integration.

Connect is not a complete product yet. It is a frontend/product module backed today by bounded, honest backend surfaces across Points, Referral, Quest, and Gateway.

The current backend is sufficient for an honest dashboard, referrals, and off-chain badges UI.

Future tokenomics, G2A, NFT, wallet, and on-chain work remain intentionally deferred until a separate architecture pass is approved.
