# Connect Dependency Map v1

**Project:** Go2Asia  
**Module:** Connect Asia  
**Service focus:** product/UI and read/composition module  
**Document role:** Engineering reference for Connect dependencies and forbidden coupling  
**Status:** Current MVP architecture baseline

**Authoritative stack note:** this dependency map is canonical together with:
- `connect_domain_model_v1.md` (domain ownership/model)
- `connect_backend_architecture_v1.md` (backend composition)
- `connect_openapi_outline_v1.md` (API outline)
- `connect_service_production_architecture_v1.md` (runtime/production framing)
- `docs/ops/service_inventory.md`
- `docs/decisions/adr_0021_token_points_connect_terminology.md`

---

# 1. Purpose / Status

This document describes dependencies around Connect as a product/UI and read/composition module.

Connect is not a standalone backend service in the current MVP. It reads and presents facts owned by existing services.

Legacy files under `docs/modules/connect/*` are historical product vision input only. They are not current dependency SSOT because they describe a standalone Connect microservice, `/api/connect`, tokenomics, NFT, wallet, levels, missions, and analytics as if they were implemented.

---

# 2. Core Rule

> Connect composes existing domain facts; it does not own backend domain truth.

Current domain owners:

- Points/balances/ledger/badges: `points-service`
- referral graph and referral earnings surface: `referral-service`
- quest progress/completion and reward delivery handoff state: `quest-service`
- auth/routing: `api-gateway`

---

# 3. Current Dependency Graph

## 3.1 Connect UI -> Points Service

Connect UI reads Points Service for:

- balance
- transactions
- badges
- Connect dashboard

User-facing endpoints:

- `GET /v1/points/balance`
- `GET /v1/points/transactions`
- `GET /v1/points/badges`
- `GET /v1/points/badges/mine`
- `GET /v1/points/connect-dashboard`

Dependency type:

- gateway-mediated API read via SDK helpers when available

## 3.2 Connect UI -> Referral Service

Connect UI reads Referral Service for:

- code
- stats
- tree
- earnings

User-facing endpoints:

- `GET /v1/referral/code`
- `GET /v1/referral/stats`
- `GET /v1/referral/tree`
- `GET /v1/referral/earnings`
- `POST /v1/referral/claim`

Dependency type:

- gateway-mediated API read/write via SDK helpers when available

## 3.2a Connect UI -> RF Asia (read-only vouchers)

Connect UI may read RF-owned endpoints for voucher projection blocks:

- `GET /v1/rf/me/vouchers/summary`
- `GET /v1/rf/me/vouchers`

Dependency type:

- gateway-mediated read-only composition in Connect UI;
- RF remains lifecycle owner; Connect does not mutate claim/redeem/status.

## 3.3 Connect UI -> Quest Service indirectly

Connect does not own quest execution.

Quest impacts Connect indirectly when:

- quest completion creates Points transactions
- quest completion triggers first badge handoff
- quest reward delivery is pending, failed, replayed, or delivered through Quest-owned outbox state

Important rule:

- Connect UI should present only facts exposed by Points/Referral/Quest-backed read surfaces. It must not fabricate quest reward state.

## 3.4 API Gateway

API Gateway provides:

- routing
- gateway-origin auth
- request proxying

API Gateway must not provide:

- Connect business aggregation
- ledger writes
- referral graph ownership
- quest reward ownership

## 3.5 Token Service

`token-service` is skeleton-only in the current repo.

Current dependency:

- none

Rules:

- Connect must not call `token-service` as if tokenomics is implemented.
- `/v1/token/*` is not a current API surface.

---

# 4. Current Backend Handoffs

## 4.1 Quest completion -> Points ledger

Flow:

```text
quest.completed -> POST /internal/points/add
```

Owner boundaries:

- `quest-service` owns quest completion and delivery intent.
- `points-service` owns final ledger write and balance truth.

## 4.2 Quest completion -> Badge award

Flow:

```text
quest.completed -> POST /internal/points/badges/award
```

Owner boundaries:

- `quest-service` initiates first quest badge handoff.
- `points-service` owns badge catalog and user badge award truth.
- badge award failure is non-blocking for quest completion.

## 4.3 Referral first login -> Points ledger

Flow:

```text
referral first login -> POST /internal/points/add
```

Owner boundaries:

- `referral-service` owns referral relation and activation facts.
- `points-service` owns applied Points transaction truth.

---

# 5. Current Forbidden Dependencies

Connect UI must not:

- call the database directly
- call `token-service` as if tokenomics is implemented
- use `/api/connect` as a current API
- use `/v1/connect/*` as a current API
- use `/v1/token/*` as a current API
- render G2A, NFT, wallet, levels, missions, analytics, or leaderboards as current backend-backed facts

API Gateway must not:

- become a business aggregator
- own Connect dashboard business logic
- own Points, Referral, or Quest facts

Quest Service must not:

- write `user_badges` directly
- write `points_transactions` directly
- own balances or badge truth

Referral Service must not:

- write `points_transactions` directly
- own Points balance or ledger truth
- own badge award truth

Points Service must not:

- become owner of the referral graph
- become owner of quest progress/completion truth
- become a broad tokenomics engine in this MVP

Connect architecture must not:

- create `connect-service` for the current MVP
- route through legacy `/api/connect`
- introduce `/v1/token/*`
- treat old `docs/modules/connect/*` as runtime/API SSOT

---

# 6. Future Dependency Extension Points

The following are extension points only. They are not current dependencies.

## 6.1 G2A service / Tokenomics service

May be introduced later if G2A accounting, issuance, conversion, or tokenomics rules become real backend scope.

Required before dependency:

- legal/compliance pass
- architecture pass
- backend ownership model
- OpenAPI contracts
- audit/idempotency model

## 6.2 NFT / Blockchain Gateway

May be introduced later for on-chain achievements or wallet-bound assets.

Required before dependency:

- Blockchain Gateway architecture
- NFT minting model
- wallet/custody/security model
- contract/API truth

## 6.3 Progression service

May be introduced later for levels, statuses, XP, seasons, or progression rules.

Required before dependency:

- progression domain model
- tables/API truth
- anti-abuse model

## 6.4 Analytics service

May be introduced later for activity aggregates, rankings, source breakdowns, and dashboards.

Required before dependency:

- aggregate ownership
- privacy model
- ranking rules
- API contracts

## 6.5 Connect service extraction

Connect service extraction is intentionally deferred.

It may be justified later only if:

- dashboard/read-model composition becomes too complex for Points
- cross-domain composition requires dedicated caching/materialization
- product surfaces need multiple Connect-specific read models
- backend ownership can be clearly separated from Points, Referral, and Quest

Extraction must not be based only on legacy docs that called Connect a microservice.

---

# 7. Dependency Diagram

```text
Connect UI
  |
  v
API Gateway (routing/auth only)
  |
  +--> points-service
  |      - balance
  |      - transactions
  |      - badges
  |      - connect dashboard
  |
  +--> referral-service
  |      - code
  |      - stats
  |      - tree
  |      - earnings
  |
  +--> quest-service (indirect Connect impact)
         - quest completion
         - reward outbox/replay
         - first badge handoff

token-service
  - skeleton only
  - no current Connect dependency
```

---

# 8. Final Formula

> Connect depends on Points, Referral, Quest handoffs, and Gateway routing/auth. It must not become a shadow backend or fake tokenomics layer.
