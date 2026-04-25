# Connect Domain Model v1

**Project:** Go2Asia  
**Module:** Connect Asia  
**Service focus:** product/UI module backed by existing services  
**Document role:** Engineering SSOT for current Connect domain model and deferred future concepts  
**Status:** Current MVP architecture baseline

**Authoritative stack note:** this domain model is canonical together with:
- `connect_backend_architecture_v1.md` (backend composition)
- `connect_dependency_map_v1.md` (dependency boundaries)
- `connect_openapi_outline_v1.md` (Connect-facing API outline)
- `connect_service_production_architecture_v1.md` (production runtime framing)
- `docs/modules/connect/Connect-Asia-Updated-Concept.md` and `docs/modules/connect/connect_backend_closure_note_v1.md`

---

# 1. Purpose / Status

This document defines the current MVP domain model for Connect Asia.

Connect is a product/UI module backed by existing backend services. It is not a standalone backend service in the current MVP.

Legacy files under `docs/modules/connect/*` are historical product vision input only. They are not runtime SSOT and not API SSOT for the current implementation because they describe `/api/connect`, G2A, NFT, wallet, levels, missions, analytics, and a standalone Connect microservice that do not exist in the current runtime baseline.

---

# 2. Current Domain Formula

> Connect = personal activity / Points / referrals / off-chain badges center.

Connect shows how user activity in Go2Asia turns into:

- Points balance
- ledger-backed activity history
- referral progress and applied referral earnings
- off-chain badge awards
- bounded dashboard summaries

Connect must not invent economy facts that are not returned by backend services.

---

# 3. Current Implemented Concepts

## 3.1 Points balance

Current user's off-chain Points balance.

Owner:

- `points-service`

Truth:

- `user_balances`

User-facing reads:

- `GET /v1/points/balance`
- `GET /v1/points/connect-dashboard`

## 3.2 Points transaction

Ledger row for applied Points movement.

Owner:

- `points-service`

Truth:

- `points_transactions`

User-facing reads:

- `GET /v1/points/transactions`
- `GET /v1/points/connect-dashboard` for bounded recent activity

## 3.3 Referral code / link

Current user's referral invitation identity.

Owner:

- `referral-service`

Truth:

- `referral_links`

User-facing reads:

- `GET /v1/referral/code`

## 3.4 Referral relation

Referral graph relation between referrer and referred user.

Owner:

- `referral-service`

Truth:

- `referral_relations`

User-facing reads:

- `GET /v1/referral/tree`
- `GET /v1/referral/stats`

## 3.5 Referral earnings

Read model joining referral graph facts with applied Points ledger rows.

Owner:

- referral facts: `referral-service`
- applied reward truth: `points-service`

User-facing read:

- `GET /v1/referral/earnings`

Important rule:

- referral earnings can report `reward_missing` when activation exists but the matching Points ledger row is missing.

## 3.6 Badge catalog

Off-chain achievement catalog for current MVP badges.

Owner:

- `points-service`

Truth:

- `badges`

User-facing read:

- `GET /v1/points/badges`

## 3.7 User badge award

User-specific off-chain badge award.

Owner:

- `points-service`

Truth:

- `user_badges`

User-facing reads:

- `GET /v1/points/badges/mine`
- `GET /v1/points/connect-dashboard` for bounded recent badge summary

Internal write:

- `POST /internal/points/badges/award`

## 3.8 Quest reward delivery

Quest-owned delivery intent and replay state for quest completion rewards sent to Points.

Owner:

- `quest-service` owns completion and delivery-state retry
- `points-service` owns final ledger writes

Truth:

- `quest_progress`
- `quest_reward_outbox`
- `points_transactions`

Internal handoff:

- `quest.completed -> POST /internal/points/add`

## 3.9 Connect dashboard read model

Bounded convenience read model for the Connect dashboard.

Owner:

- hosted by `points-service`

User-facing read:

- `GET /v1/points/connect-dashboard`

Sections:

- `balance`
- `recentTransactions`
- `referrals`
- `badges`

Important rule:

- dashboard is not an SSOT table and not domain truth; it is a read/composition response assembled from existing domain facts.

---

# 4. Current Tables and Owners

## 4.1 Points Service

`points-service` owns:

- `user_balances`
- `points_transactions`
- `badges`
- `user_badges`

Responsibilities:

- Points balance truth
- Points ledger truth
- off-chain badge catalog
- off-chain badge award truth
- bounded Connect dashboard read model

## 4.2 Referral Service

`referral-service` owns:

- `referral_links`
- `referral_relations`

Responsibilities:

- referral code/link facts
- referral graph facts
- activation facts
- referral stats/tree/earnings read surfaces

## 4.3 Quest Service

`quest-service` owns:

- `quest_progress`
- `quest_submission`
- `quest_reward_outbox`

Responsibilities:

- quest progress/completion truth
- submission/review facts
- bounded reward delivery intent and replay state
- first quest badge handoff trigger

---

# 5. Current Read Models

## 5.1 `GET /v1/points/connect-dashboard`

Connect dashboard MVP read model.

Current sections:

- `balance`
- `recentTransactions`
- `referrals`
- `badges`

Not included:

- G2A
- NFT count
- wallet
- levels/statuses
- missions
- analytics/rankings
- partner income
- PRO economy

## 5.2 `GET /v1/referral/earnings`

Referral earnings read model.

Purpose:

- show referral-level earnings using referral graph facts plus matched Points ledger rows.

## 5.3 `GET /v1/points/badges/mine`

Current user's off-chain badge awards.

Purpose:

- show user achievements without NFT/on-chain semantics.

---

# 6. Deferred Concepts

The following concepts are future vision only. They are not implemented now, require future backend truth, and must not be shown as fake frontend data.

## 6.1 G2A

Status:

- not implemented now

Required future backend truth:

- legal/compliance decision
- tokenomics or G2A accounting service
- ledger/accounting model
- constraints and audit model

Frontend rule:

- do not show fake G2A balance, conversion, withdrawal, or token yield.

## 6.2 Wallet

Status:

- not implemented now

Required future backend truth:

- wallet identity/binding model
- custody decision
- transaction status model
- security and compliance architecture

Frontend rule:

- do not show wallet cards, deposit, withdraw, or wallet status as if they exist.

## 6.3 NFT / on-chain

Status:

- not implemented now

Required future backend truth:

- NFT ownership/minting model
- Blockchain Gateway
- chain, token id, metadata URI, and mint status truth

Frontend rule:

- current badges are off-chain achievements, not NFTs.

## 6.4 Levels / statuses

Status:

- not implemented now

Required future backend truth:

- progression service or progression model
- level definitions
- user progression state
- anti-farming rules

Frontend rule:

- do not derive level, XP, status, or season progress from Points on the frontend.

## 6.5 Missions

Status:

- not implemented now inside Connect

Required future backend truth:

- mission/recommended-action model or separate progression/onboarding truth
- relation to Quest as a separate module

Frontend rule:

- do not show fake Connect missions or mission rewards.

## 6.6 Analytics

Status:

- not implemented now

Required future backend truth:

- activity aggregates
- period filters
- source breakdowns
- privacy-safe user activity model

Frontend rule:

- do not show charts or rankings without backend aggregates.

## 6.7 Leaderboards

Status:

- not implemented now

Required future backend truth:

- ranking model
- eligibility rules
- anti-abuse controls
- privacy policy

Frontend rule:

- do not show user rank, ecosystem place, or seasonal leaderboard as mock data.

## 6.8 Partner income

Status:

- not implemented now

Required future backend truth:

- partner/referral economy model
- RF/PRO ownership boundaries
- legal/commercial rules

Frontend rule:

- do not show partner income or business referral revenue in MVP Connect.

## 6.9 PRO economy

Status:

- not implemented now

Required future backend truth:

- PRO-specific economic rules
- service ownership
- audit and abuse controls

Frontend rule:

- do not blend PRO economics into user Connect MVP.

## 6.10 Broad reward rules

Status:

- not implemented now

Required future backend truth:

- reward rule engine or explicit per-domain bounded rules
- idempotency and audit model
- anti-abuse model

Frontend rule:

- do not infer rewards outside implemented backend responses.

---

# 7. Domain Invariants

- Points ledger truth remains in `points_transactions`.
- Balance truth remains in `user_balances`.
- Badge award truth remains in `user_badges`.
- Referral graph truth remains in `referral_relations`.
- Quest completion truth remains in `quest_progress`.
- Quest reward delivery retry truth remains in `quest_reward_outbox`.
- Dashboard is not SSOT; it is a bounded read model.
- Connect UI must not invent economy facts.
- Connect must not present legacy product vision as current runtime truth.
- Connect must not expose G2A, NFT, wallet, levels, missions, analytics, leaderboards, partner income, or PRO economy until backend truth exists.

---

# 8. Final Formula

> Connect is the user's honest MVP center for Points, referral progress, off-chain badges, and recent activity, composed from existing backend services.
