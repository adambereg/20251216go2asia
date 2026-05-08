# RF Slice 4.2 — Points Contract Enablement Plan v1

Scope type: planning-only  
Runtime code changes in this slice: none

## 1. Executive Summary

Goal of Slice 4.2 is to design a spend-capable internal Points contract that is safe for later RF claim coupling, while keeping RF runtime untouched in this slice.

Primary decisions:

- choose a dedicated internal spend endpoint (`POST /internal/points/spend`);
- preserve `externalId` as idempotency SSOT with strict replay/mismatch semantics;
- define deterministic insufficient-balance behavior;
- define compensation-ready response and event model for future Slice 4.3;
- keep VIP truth for first runtime coupling at gateway role (`vip_spacer`), not wallet projection;
- keep rollout split:
  - **Slice 4.2** = contract and tests only;
  - **Slice 4.3** = RF runtime coupling + VIP gate + debit orchestration + compensation flow.

## 2. Current RF/Points Runtime State

RF side:

- claim/redeem/repeatability/attribution/diagnostics are already stable;
- Slice 4.1 added economy snapshots:
  - `rf_offer.points_cost`
  - `rf_voucher.points_cost_snapshot`
  - `rf_voucher.points_debit_external_id`
  - `rf_voucher.economy_status`
- current claim writes `points_cost_snapshot` and sets:
  - `not_required` for free;
  - `pending` for paid;
- no points-service calls from RF runtime yet.

Points side:

- internal write endpoint exists: `POST /internal/points/add` (service JWT only);
- `amount >= 1` validation enforces credit-only contract;
- idempotency is based on unique `externalId`;
- conflict semantics exist for same `externalId` + mismatched payload;
- wallet summary/read models already exist (buckets projection).

## 3. Scope and Non-goals

In scope (Slice 4.2 planning):

- spend endpoint contract design;
- request/response semantics;
- idempotency, replay, mismatch model;
- insufficient-balance model;
- auth model for internal spend;
- compensation semantics design for future coupling;
- OpenAPI/SDK/test/rollout plan.

Out of scope:

- RF runtime integration;
- live debit calls from RF;
- VIP enforcement in RF;
- premium/NFT/G2A, rewards, payouts, billing, Connect expansion.

## 4. Spend Contract Goals

The spend contract must guarantee:

- deterministic idempotency per `externalId`;
- deterministic insufficient-balance result without ledger mutation;
- clear mismatch conflict for payload divergence on replay;
- no implicit coupling to RF repeatability/attribution logic;
- compatibility with no-debit-without-voucher rule in future 4.3 choreography.

## 5. Spend Endpoint Options

### Option A: Extend `POST /internal/points/add` to allow negative amount

Pros:

- minimal surface change.

Cons:

- semantic overload (add endpoint becomes add/spend);
- higher risk of accidental negative usage by existing producers;
- weaker contract clarity in logs/metrics/openapi.

### Option B: New `POST /internal/points/spend` (recommended)

Pros:

- explicit semantic boundary;
- safer validation rules (amount > 0 as spend quantity, not signed delta input);
- easier security and analytics policy;
- cleaner incremental rollout.

Cons:

- one new endpoint and generated artifacts.

### Option C: Generic ledger mutation endpoint

Pros:

- maximal flexibility.

Cons:

- high complexity and higher misuse risk;
- overkill for bounded RF spend enablement.

Recommendation: **Option B**.

## 6. Recommended Spend Contract

Add new internal endpoint:

- `POST /internal/points/spend`

Auth:

- service-to-service JWT only (same model as internal add);
- no direct user token path.

Write semantics:

- spend quantity is positive integer in request;
- stored transaction amount is negative delta in ledger;
- debit allowed only from available balance under contract rules.

Action taxonomy:

- introduce explicit action `rf_voucher_claim_spend` for RF voucher debit.

## 7. Request/Response Semantics

Proposed request shape:

- `userId` (required, non-empty)
- `amount` (required, integer, `>= 1`)
- `action` (required, enum; include `rf_voucher_claim_spend`)
- `externalId` (required, non-empty, globally unique idempotency key)
- `sourceService` (required for internal tracing)
- `sourceEventId` (optional but strongly recommended)
- `metadata` (optional object)
- `correlationId` (optional)

Proposed success response:

- `applied: true | false`
- `idempotentReplay: true | false`
- `transactionId`
- `balanceAfter` (optional, recommended for diagnostics/observability)

Proposed failure codes:

- `invalid_amount` (400)
- `invalid_action` (400)
- `unauthorized` (401)
- `insufficient_balance` (409 or 422; recommend 409 for business conflict consistency)
- `replay_payload_mismatch` (409)
- `service_unavailable` (503)

## 8. VIP Gate Strategy

For first runtime coupling (Slice 4.3):

- VIP truth source: **gateway role `vip_spacer`**.

Rationale:

- already available in auth boundary;
- deterministic at claim-time without extra cross-service read;
- wallet summary is projection, not authoritative gate.

Risk:

- role-based VIP may diverge from future entitlement lifecycle; keep migration path to entitlement service later.

## 9. externalId and Idempotency Mapping

Canonical format recommendation:

- `rf:voucher-claim-spend:<voucherId>`

Properties:

- deterministic on voucher instance;
- stable for replay of same RF claim instance;
- unique across repeatability instances because voucherId changes;
- does not depend on user-provided idempotency key shape.

## 10. Replay Semantics

Formalized behavior:

- same RF idempotency replay => same voucher => same spend `externalId` => no second debit;
- claim barrier (existing active/once_per_scope consumed) => no new voucher => no spend;
- `repeat_after_redeem` new instance => new voucherId => new spend `externalId` => new spend attempt;
- context mismatch in RF claim idempotency => conflict, no spend reuse.

## 11. Compensation / Failure Choreography

Hard invariant: no debit-without-voucher in production behavior.

Planning recommendation for 4.3 choreography:

- preferred runtime model remains synchronous request flow;
- if spend succeeds but voucher persistence fails, execute deterministic reversal transaction:
  - reversal action (e.g. `rf_voucher_claim_spend_compensation`)
  - reversal linked to original `externalId` in metadata
  - dedicated compensation id format:
    - `rf:voucher-claim-spend-compensation:<voucherId>`
- if reversal cannot be completed inline, persist durable recovery signal (outbox/recovery queue) and block successful claim response.

For Slice 4.2:

- define this choreography and error model in contract docs/tests only; no runtime RF coupling yet.

## 12. Balance Semantics

Spend rules:

- debit only from available balance;
- no direct debit from locked/network buckets in this phase;
- no implicit bucket migration in spend endpoint.

## 13. OpenAPI / SDK Plan

Points OpenAPI additions:

- new path `/internal/points/spend`;
- new request/response schemas;
- explicit error schema for insufficient balance and payload mismatch;
- additive action enum extension (`rf_voucher_claim_spend`).

Generated artifacts:

- regenerate bundle/types/sdk;
- enforce `openapi:check` parity gate.

RF OpenAPI:

- no required runtime change in 4.2 (planning-only), keep Slice 4.1 additive fields intact.

## 14. RF Runtime Integration Plan

4.2: no RF runtime implementation.

4.3 integration sketch:

- on paid claim candidate, after voucher-instance determination and before final success response:
  - derive deterministic spend `externalId` from voucherId;
  - call points spend endpoint;
  - on success mark voucher economy status progression;
  - on insufficient balance or VIP failure return deterministic claim error;
  - on partial failure apply compensation choreography.

## 15. Diagnostics Interaction

Current diagnostics fields are sufficient foundation:

- `pointsCostSnapshot`
- `pointsDebitExternalId`
- `economyStatus`

Future (4.3+) recommended additions:

- spend attempt timeline references;
- compensation presence marker;
- anomaly flags for debit/status mismatches (expanded set).

## 16. Tests and CI Gates

Contract tests for points spend:

- first spend applied;
- idempotent duplicate replay;
- same `externalId` + payload mismatch conflict;
- insufficient balance no-ledger-mutation assertion;
- auth failures.

Cross-slice readiness tests for future 4.3:

- deterministic mapping from voucher instance to spend `externalId`;
- repeatability-specific spend key uniqueness.

CI gates:

- points-service tests/typecheck;
- openapi bundle/gen/check;
- sdk/types typecheck.

## 17. Rollout Strategy

Phase sequence:

1. **Slice 4.2**
   - ship spend endpoint contract + openapi + generated artifacts + tests;
   - no RF runtime calls.
2. **Slice 4.3**
   - RF claim coupling with VIP gate and spend orchestration;
   - enable compensation/recovery path;
   - extend diagnostics/anomalies as needed.
3. controlled enablement
   - partner/listing path gating via feature flag if needed.

## 18. Risks

- semantic drift between role-based VIP and future entitlement model;
- unclear insufficient-balance status code could destabilize clients if not standardized early;
- compensation complexity if reversal semantics are underspecified;
- analytics drift if spend action taxonomy is overloaded or inconsistent.

## 19. Open Questions

- keep insufficient balance on 409 vs 422 (recommend 409 for current conflict style);
- whether to include `balanceAfter` in spend response in v1 contract;
- whether to introduce dedicated compensation endpoint vs same spend/add pipeline with action taxonomy;
- timeline for migrating VIP truth from gateway role to entitlement source.

## 20. Final Recommendation

Choose:

- **new endpoint**: `POST /internal/points/spend` (not extending add);
- **idempotency model**: strict `externalId` SSOT with payload mismatch conflict;
- **VIP truth (first runtime coupling)**: gateway role `vip_spacer`;
- **externalId canonical format**: `rf:voucher-claim-spend:<voucherId>`;
- **runtime choreography target**: synchronous spend path with deterministic compensation fallback;
- **slice order**:
  - **4.2 = contract enablement only**;
  - **4.3 = RF coupling + VIP enforcement + debit/compensation orchestration**.

---

Planning input audited:

- docs:
  - `docs/architecture/domain/rf_slice_4_0_voucher_economy_runtime_foundation_plan_v1.md`
  - `docs/architecture/domain/rf_slice_4_1_commit_readiness_regression_sweep_v1.md`
  - `docs/economy/README.md`
  - `docs/economy/tokenomics/go2asia_tokenomics_v1.md`
  - `docs/economy/vouchers/rf_voucher_economy_v1.md`
  - `docs/economy/vip/vip_value_system_v1.md`
  - `docs/economy/points/points_sink_design_v1.md`
  - `docs/economy/economy_backend_alignment_audit_v1.md`
  - `docs/economy/slice1_wallet_implementation_report.md`
  - `docs/architecture/domain/rf_slice_2_1_repeatability_runtime_implementation_plan_v1.md`
  - `docs/architecture/domain/rf_slice_3_0_redemption_operational_diagnostics_plan_v1.md`
- code paths:
  - `apps/points-service/src/index.ts`
  - `apps/points-service/src/idempotency.ts`
  - `apps/api-gateway/src/index.ts`
  - `apps/rf-service/src/store.ts`
  - `apps/rf-service/src/routes/rf.ts`
  - `packages/db/src/schema/points.ts`
  - `packages/db/src/schema/rf.ts`
  - `docs/openapi/points.yaml`
  - `docs/openapi/rf.yaml`
  - RF/wallet UI consumers in `apps/go2asia-pwa-shell`

## 21. Implementation Note (Slice 4.2)

Status: implemented (points-contract scope only).

What was implemented:

- new internal endpoint: `POST /internal/points/spend`;
- auth model: same service-to-service JWT policy as existing internal add endpoint;
- request contract:
  - required: `userId`, `amount` (integer, `>=1`), `action=rf_voucher_claim_spend`, `externalId`;
  - optional: `sourceEventId`, `metadata` (object), `correlationId`;
- ledger semantics:
  - request amount remains positive spend quantity;
  - persisted transaction amount is negative (`-amount`);
- idempotency semantics (by `externalId`):
  - first successful spend => `applied=true`, `idempotentReplay=false`;
  - same payload replay => `applied=false`, `idempotentReplay=true`;
  - payload mismatch replay => `409 REPLAY_PAYLOAD_MISMATCH`;
- deterministic insufficient balance:
  - spend uses atomic SQL pattern with `balance >= amount` guard;
  - if insufficient => `409 INSUFFICIENT_POINTS_BALANCE`;
  - no ledger write and no balance mutation;
- action taxonomy:
  - added `rf_voucher_claim_spend` for spend;
  - added `rf_voucher_claim_spend_compensation` as additive taxonomy readiness;
- OpenAPI updated for spend endpoint and schemas;
- points tests extended for spend auth/validation/success/replay/mismatch/insufficient paths.

Explicitly not implemented in Slice 4.2:

- no RF runtime coupling;
- no calls from RF service to points-service;
- no VIP enforcement in RF claim;
- no voucher debit orchestration/compensation runtime in RF.
