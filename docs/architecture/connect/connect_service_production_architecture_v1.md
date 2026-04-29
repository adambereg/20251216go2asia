# Canon notice — legacy / superseded by Platform Canon v2

This document was written during the transition away from standalone Connect Service thinking.
Current Platform Canon v2 is the higher-level SSOT:
- Connect Asia is a product/UI hub, not a backend-domain service.
- There is no runtime `apps/connect-service` app.
- Points Service owns ledger/balances/reward execution.
- Missions Service is a future orchestration/reward-intent layer, not part of current runtime.

See:
- `docs/architecture/platform/go2asia_ecosystem_overview_v2.md`
- `docs/architecture/platform/go2asia_backend_services_architecture_v2.md`
- `docs/architecture/platform/go2asia_interface_architecture_v2.md`
- `docs/architecture/platform/go2asia_canon_alignment_backlog_v1.md`

# Connect Service Production Architecture v1

Current production architecture note: there is no standalone connect-service in the MVP. This document describes production runtime architecture of Connect-facing surfaces across Points, Referral, Quest, and Gateway.

**Project:** Go2Asia  
**Module:** Connect Asia  
**Service focus:** Connect-facing runtime surfaces across existing services  
**Document role:** Engineering SSOT for production runtime architecture of Connect MVP surfaces  
**Status:** Current MVP architecture baseline

**Authoritative stack note:** this production architecture is canonical together with:
- `connect_domain_model_v1.md` (domain ownership/model)
- `connect_dependency_map_v1.md` (dependency boundaries)
- `connect_openapi_outline_v1.md` (API outline)
- `connect_backend_architecture_v1.md` (backend composition)
- `docs/ops/service_inventory.md`
- `docs/modules/connect/connect_backend_closure_note_v1.md`

---

# 1. Purpose / Status

Despite the filename, this document does not describe a standalone `connect-service`.

Connect is currently a product/UI module. Its production runtime surfaces are implemented across existing services.

Legacy files under `docs/modules/connect/*` are historical product vision input only. They are not production runtime SSOT because they describe `/api/connect`, G2A/NFT/wallet/levels/missions/analytics, and a standalone Connect service that are not implemented in the current MVP.

---

# 2. Runtime Topology

Current runtime topology:

- frontend
- API Gateway
- `points-service`
- `referral-service`
- `quest-service`
- `token-service` skeleton only

```text
Frontend
  |
  v
API Gateway
  |
  +--> points-service
  |      - /v1/points/balance
  |      - /v1/points/transactions
  |      - /v1/points/badges
  |      - /v1/points/badges/mine
  |      - /v1/points/connect-dashboard
  |
  +--> referral-service
  |      - /v1/referral/code
  |      - /v1/referral/stats
  |      - /v1/referral/tree
  |      - /v1/referral/earnings
  |      - /v1/referral/claim
  |
  +--> quest-service
         - quest runtime
         - internal reward outbox/replay ops

token-service
  - /health only
  - no current Connect runtime dependency
```

---

# 3. User-Facing Runtime Paths

## 3.1 Dashboard path

Flow:

```text
Frontend -> API Gateway -> points-service -> GET /v1/points/connect-dashboard
```

Returns:

- `balance`
- `recentTransactions`
- `referrals`
- `badges`

Runtime truth:

- balance and transactions from Points domain
- badge summary from Points badge domain
- referral summary from referral facts plus matched Points ledger rows

## 3.2 Points history path

Flow:

```text
Frontend -> API Gateway -> points-service -> GET /v1/points/transactions
Frontend -> API Gateway -> points-service -> GET /v1/points/balance
```

Runtime truth:

- `points_transactions`
- `user_balances`

## 3.3 Badges path

Flow:

```text
Frontend -> API Gateway -> points-service -> GET /v1/points/badges
Frontend -> API Gateway -> points-service -> GET /v1/points/badges/mine
```

Runtime truth:

- `badges`
- `user_badges`

Current meaning:

- off-chain achievements only
- not NFT
- not wallet asset

## 3.4 Referral path

Flow:

```text
Frontend -> API Gateway -> referral-service -> GET /v1/referral/code
Frontend -> API Gateway -> referral-service -> GET /v1/referral/stats
Frontend -> API Gateway -> referral-service -> GET /v1/referral/tree
Frontend -> API Gateway -> referral-service -> GET /v1/referral/earnings
Frontend -> API Gateway -> referral-service -> POST /v1/referral/claim
```

Runtime truth:

- `referral_links`
- `referral_relations`
- matched `points_transactions` for applied earnings

---

# 4. Internal Runtime Paths

## 4.1 Internal points add

Flow:

```text
referral-service or quest-service -> points-service -> POST /internal/points/add
```

Purpose:

- idempotent Points ledger write
- balance update through Points owner

## 4.2 Internal badge award

Flow:

```text
quest-service -> points-service -> POST /internal/points/badges/award
```

Purpose:

- idempotent off-chain badge award

Failure behavior:

- current first quest badge award is non-blocking for quest completion

## 4.3 Quest reward outbox / replay

Flow:

```text
quest.completed -> quest_reward_outbox -> POST /internal/points/add
```

Internal ops:

- `POST /internal/quests/rewards/replay-pending`
- `GET /internal/quests/rewards/outbox/stats`
- `GET /internal/quests/rewards/outbox/failed`
- `POST /internal/quests/rewards/outbox/requeue-failed`

Purpose:

- keep quest reward delivery durable when Points is unavailable
- keep failed reward requeue explicit and operator-controlled

## 4.4 Referral first-login bonus

Flow:

```text
POST /internal/referral/mark-first-login -> referral-service -> POST /internal/points/add
```

Purpose:

- mark referral activation
- trigger referrer bonus through Points ledger owner

---

# 5. Auth Model

## 5.1 User-facing routes

User-facing routes use gateway-origin auth.

Rules:

- frontend calls go through API Gateway
- `userId` must come from the authenticated principal
- clients must not provide trusted `userId` for Connect reads
- service handlers should scope reads to the authenticated user

## 5.2 Internal routes

Internal routes use service JWT.

Rules:

- service-to-service callers authenticate as service principals
- internal writes must preserve idempotency and audit fields
- internal routes are not frontend APIs

## 5.3 User identity invariant

`userId` for user-facing Connect surfaces must come from authenticated principal only.

Connect UI must not infer or override identity.

---

# 6. Failure Modes

## 6.1 `points-service` unavailable

Impact:

- dashboard may fail or miss core sections
- balance, transactions, and badges unavailable
- quest/referral reward handoffs may fail

Current mitigation:

- Quest reward delivery can remain pending/failed in `quest_reward_outbox` and be replayed or explicitly requeued.
- Referral first-login bonus depends on Points availability for final ledger application.

## 6.2 Referral summary unavailable or inconsistent

Impact:

- referral section of dashboard may be missing or stale
- referral details may fail independently

Expected UI behavior:

- show honest empty/error state
- do not fabricate referral counts or earnings

## 6.3 Quest reward delivery pending

Impact:

- quest completion may exist before Points transaction appears
- dashboard/recent transactions may temporarily not show reward

Expected behavior:

- rely on outbox replay and ops endpoints
- do not double-credit on frontend

## 6.4 Badge award failure non-blocking

Impact:

- user may complete first quest and receive Points while first badge award is delayed or missing

Expected behavior:

- quest completion remains valid
- badge truth remains in `user_badges`
- UI shows only actual awarded badges

## 6.5 Dashboard partial/missing data behavior

Expected product behavior:

- show honest empty states
- avoid fake fallback values
- allow separate detailed tabs to fetch their own owner endpoints

Dashboard must not:

- invent G2A/NFT/wallet/level/mission fields
- hide backend inconsistency behind fake success data

---

# 7. Observability / Ops

## 7.1 Request correlation

Runtime expectations:

- preserve `requestId` / correlation values through gateway and services where available
- log service-to-service handoff failures with enough context for replay or audit

## 7.2 Quest outbox ops

Current internal observability:

- outbox stats endpoint
- failed rows drilldown endpoint
- explicit failed-row requeue endpoint
- scheduled replay for pending rows

These are internal ops surfaces, not Connect UI features.

## 7.3 Points ledger audit fields

Points ledger writes should preserve:

- action
- external id / idempotency identity
- source service
- source event id
- metadata where safe

Ledger audit belongs to Points, not Connect UI.

## 7.4 Future dashboard caching / metrics

Possible future needs:

- dashboard response latency metrics
- cache hit/miss metrics if caching is introduced
- partial dependency health metrics
- Connect view usage metrics

Not current MVP requirement.

---

# 8. Production Readiness

Current status:

- backend MVP is ready for bounded frontend integration
- dashboard, Points history, badges, and referral details have real backend surfaces
- quest reward delivery has bounded reliability and ops surfaces
- tokenomics, G2A, NFT, wallet, levels, and missions are not production-ready because backend truth does not exist

Ready now:

- Points dashboard integration
- referral earnings integration
- off-chain badges integration
- honest empty states

Not ready now:

- G2A
- NFT
- wallet
- levels/statuses
- missions inside Connect
- analytics/rankings
- tokenomics
- on-chain flows

---

# 9. Future Extraction Path

## 9.1 `connect-service`

Only if needed.

Possible trigger:

- multiple Connect-specific read models
- dedicated caching/materialization needs
- cross-domain composition too complex for current owners

Not current MVP.

## 9.2 `tokenomics-service`

Only after legal and architecture pass.

Possible trigger:

- G2A accounting
- token issuance/conversion rules
- tokenomics audit model

Not current MVP.

## 9.3 `badge-service`

Only if badge domain becomes large.

Possible trigger:

- independent badge catalog/admin workflows
- cross-module badge rules
- NFT bridge ownership

Not current MVP.

---

# 10. Final Production Rule

> Production Connect MVP is a set of Connect-facing surfaces across Points, Referral, Quest, and Gateway. There is no standalone `connect-service`, no current tokenomics dependency, and no fake future economy data.
