# RF Slice 4.3 — Claim Spend Coupling Plan v1

Scope type: planning-only  
Runtime code changes in this slice: none

Implementation status update (post-plan):  
Implemented in RF Slice 4.3 implementation pass. See `docs/architecture/domain/rf_slice_4_3_claim_spend_coupling_implementation_note_v1.md`.

## 1. Executive Summary

Goal of Slice 4.3 is to safely couple RF claim runtime with the spend-capable Points contract from Slice 4.2, while preserving RF ownership boundaries and replay safety.

Primary recommendation:

- use synchronous orchestration in RF claim flow;
- enforce VIP gate early for paid vouchers (`points_cost_snapshot > 0`);
- call points spend before final voucher commit (single-request orchestration);
- persist deterministic compensation when spend succeeded but voucher persistence failed;
- avoid long-lived pending state in normal path;
- keep fallback/degraded path explicit and bounded.

## 2. Current Runtime State

RF side:

- stable claim/redeem/repeatability/attribution/idempotency foundation;
- claim endpoints require `Idempotency-Key`;
- voucher economy fields already exist (`pointsCostSnapshot`, `pointsDebitExternalId`, `economyStatus`);
- current claim writes paid vouchers with `economy_status='pending'`, free vouchers `not_required`;
- no points-service call from RF yet.

Points side:

- `POST /internal/points/spend` implemented;
- strict `externalId` idempotency with deterministic replay/mismatch behavior;
- deterministic insufficient balance (`INSUFFICIENT_POINTS_BALANCE`, no ledger mutation);
- spend persisted as negative ledger delta;
- internal-only service JWT auth.

## 3. Scope and Non-goals

In scope (this document):

- orchestration model selection;
- replay and idempotency cross-service semantics;
- compensation choreography design;
- VIP gate timing and policy;
- `economy_status` state machine and transitions;
- error model, diagnostics expansion, rollout and test gates.

Out of scope:

- runtime implementation;
- API/public UI implementation details beyond compatibility planning;
- premium/NFT/G2A/pro rewards/billing/connect expansion.

## 4. Orchestration Goals

Target guarantees:

- no debit-without-voucher in final user-visible outcome;
- no successful paid voucher without successful spend;
- no double debit across RF replay and Points replay;
- deterministic conflict handling for context mismatch;
- bounded and auditable recovery path for partial failures.

## 5. Orchestration Options Comparison

### Option A — Spend first, then voucher create

Pros:

- strongest prevention of unpaid paid-voucher;
- straightforward use of existing points contract.

Cons:

- partial failure risk: spend success + voucher write failure;
- requires deterministic compensation and recovery path.

### Option B — Voucher pending first, then spend, then activate

Pros:

- avoids debit-without-voucher window;
- explicit RF-visible pending object for recovery.

Cons:

- expands lifecycle complexity significantly;
- introduces longer-lived pending states and UI complexity;
- adds operational burden before 4.3 core coupling is validated.

### Option C — Outbox/eventual spend

Pros:

- durable asynchronous processing.

Cons:

- eventual consistency window allows unpaid voucher visibility unless additional gating;
- high complexity and larger blast radius for first coupling slice.

## 6. Recommended Runtime Model

Recommended model for first coupling: **Option A with deterministic compensation**.

Why this is safer in current architecture:

- spend contract is already synchronous, idempotent, and deterministic;
- RF claim already enforces request idempotency context;
- avoids introducing pending-state product semantics before proven necessity;
- keeps 4.3 focused on bounded coupling, not workflow platforming.

Guardrails:

- no successful claim response until both voucher persistence and economy status transitions are consistent;
- if spend succeeds and voucher persistence fails, execute immediate compensation attempt;
- if compensation cannot be confirmed inline, return non-success and persist durable recovery signal.

## 7. VIP Gate Strategy

Recommendation:

- enforce VIP gate **before spend call and before final paid claim creation logic**;
- gate source: gateway role `vip_spacer` (first coupling source of truth);
- free vouchers (`points_cost_snapshot = 0`) bypass VIP gate.

Rationale:

- early rejection minimizes unnecessary writes and avoids compensations on known ineligible claims;
- aligns with existing architecture decisions from 4.0/4.2.

## 8. Spend Orchestration Flow

Paid claim (`points_cost > 0`) proposed flow:

1. validate RF claim input + idempotency key context;
2. resolve offer/listing/repeatability barriers as today;
3. run VIP eligibility gate (paid only);
4. derive deterministic spend `externalId = rf:voucher-claim-spend:<voucherId>`;
5. call `POST /internal/points/spend` with positive amount;
6. on spend success, persist voucher instance with:
   - `pointsDebitExternalId=<externalId>`
   - `economyStatus='debited'`
7. return claim success.

Failure branch:

- if spend fails with deterministic business errors -> claim fails, voucher is not created;
- if spend succeeded but voucher write fails -> compensation choreography starts immediately.

Free claim (`points_cost = 0`) stays current path:

- voucher create without spend;
- `economyStatus='not_required'`.

## 9. Replay and Idempotency Semantics

Cross-service semantics:

- RF replay (same `Idempotency-Key`, same context) returns same voucher and must not double debit;
- Points replay (same `externalId`, same payload) must return idempotent replay and no second debit;
- context mismatch in RF idempotency must never reuse foreign spend;
- repeatability new instance produces new `voucherId` and therefore new spend `externalId`.

Deterministic key mapping:

- spend key: `rf:voucher-claim-spend:<voucherId>`;
- compensation key: `rf:voucher-claim-spend-compensation:<voucherId>`.

## 10. economy_status State Machine

Current enum:

- `not_required`
- `pending`
- `debited`
- `debit_failed`

Recommended 4.3 transition policy:

- free claim: `not_required` terminal for economy;
- paid claim success path: `pending` (transient internal step) -> `debited` before response;
- paid claim spend fail: no voucher row preferred; if row exists due to partial path, set `debit_failed` and hide from success flows;
- compensation-completed rollback: `debit_failed` with diagnostic markers (if voucher row exists).

Recommendation on pending:

- **no long-lived pending in normal operation**;
- pending allowed as transient internal state only.

## 11. Compensation Choreography

Trigger condition:

- spend succeeded, voucher persistence/claim finalization failed.

Required actions:

1. submit reversal transaction with action `rf_voucher_claim_spend_compensation`;
2. include original spend externalId in compensation metadata;
3. persist RF-side recovery marker with correlation id;
4. if inline compensation succeeds, return deterministic failure to caller (no successful claim);
5. if inline compensation fails, enqueue durable recovery task and return non-success.

Invariants:

- never return successful paid claim if compensation status is unknown;
- compensation itself must be idempotent by deterministic externalId.

## 12. Failure and Retry Semantics

Recommended handling:

- insufficient balance -> deterministic business failure (retry only after balance change);
- VIP required -> deterministic business failure (retry only after role change);
- spend mismatch conflict -> integration error class, non-retryable without context reset;
- temporary points unavailability -> retryable error class with explicit backoff guidance;
- compensation pending -> operational failure class, no success response.

Retry policy:

- client retries safe only with same `Idempotency-Key`;
- server-side recovery retries for compensation must be idempotent and bounded.

## 13. RF Claim Error Model

Recommended additive RF claim error codes for 4.3 coupling:

- `RF_VIP_REQUIRED_FOR_PAID_VOUCHER`
- `RF_INSUFFICIENT_POINTS_BALANCE`
- `RF_SPEND_IDEMPOTENCY_CONFLICT`
- `RF_SPEND_TEMPORARILY_UNAVAILABLE`
- `RF_ECONOMY_RECOVERY_PENDING`

HTTP guidance:

- eligibility/business conflicts: 409;
- unauthorized/forbidden: 401/403;
- transient dependency failure: 503;
- idempotency context mismatch: 409.

## 14. Diagnostics Expansion Plan

Extend internal diagnostics (additive):

- spend attempt references (`externalId`, action, status snapshot);
- compensation reference ids and status;
- economy transition timeline (`pending/debited/debit_failed`);
- anomaly flags:
  - `debited_without_external_id` (already present baseline),
  - `spend_succeeded_claim_failed`,
  - `compensation_pending_too_long`,
  - `debit_failed_visible_voucher` (if applicable).

Keep diagnostics internal/admin-only and masked where required.

## 15. OpenAPI / SDK Plan

RF OpenAPI additions (additive in 4.3 implementation):

- claim response error surfaces for spend/VIP-specific failures;
- optional economy diagnostics-oriented fields only if required by runtime behavior.

Points OpenAPI:

- already includes spend endpoint and action taxonomy from 4.2;
- may require clearer documented error code enums in descriptions/examples (additive docs-level improvement).

SDK/types:

- regenerate after any additive contract changes;
- keep parity checks (`openapi:check`) as mandatory gate.

## 16. Frontend Compatibility Plan

Minimal-safe UX plan (no redesign):

- map new claim errors to user-safe localized messages in existing claim error helper;
- preserve current claim button flow and idempotent retries;
- on insufficient balance:
  - show deterministic message and link to wallet;
- on VIP required:
  - show deterministic gating message;
- do not block claim on client pre-check; backend remains source of truth;
- My Vouchers view should continue to rely on server state (no synthetic pending UI unless backend introduces visible pending states).

## 17. Rollout Strategy

Recommended phased rollout:

1. feature flag off by default (internal/staging only);
2. partner-scope paid offers subset;
3. listing-scope paid offers;
4. gradual expansion by partner cohorts;
5. full enablement after anomaly and compensation SLOs are stable.

Operational gates between phases:

- zero double-debit incidents;
- zero unresolved compensation backlog beyond SLA;
- acceptable spend failure rates and deterministic error distribution.

## 18. Tests and CI Gates

Required 4.3 implementation test matrix:

- RF claim paid success with spend debit;
- RF claim free path unchanged;
- RF replay with same idempotency key no double debit;
- repeatability new instance new spend externalId;
- spend insufficient balance -> claim failure, no voucher success;
- spend mismatch conflict -> deterministic claim conflict;
- spend success + voucher write fail -> compensation path executed;
- diagnostics fields/anomalies for economy transitions.

CI gates:

- `pnpm -C apps/rf-service test`
- `pnpm -C apps/points-service test`
- `pnpm -C apps/rf-service typecheck`
- `pnpm -C apps/points-service typecheck`
- `pnpm openapi:check`
- `git diff --check` (with unrelated known-baseline issues documented separately).

## 19. Risks

- compensation path complexity under partial failures;
- transient dependency failures causing noisy claim failure spikes;
- role-based VIP truth drift from future entitlement model;
- overexposing internal economy details in public claim UX if error model is not carefully bounded.

## 20. Open Questions

- should paid-claim failure ever create a visible voucher row with `debit_failed`, or stay create-on-success only?
- do we need explicit RF claim error enum expansion in public contract at first 4.3 cut, or phased?
- what is the SLA/threshold for unresolved compensation backlog before automatic rollback of feature flag?
- should points spend error codes be modeled as explicit OpenAPI enum examples for stricter client handling?

## 21. Final Recommendation

Adopt the following for Slice 4.3 implementation:

- orchestration: synchronous, spend-first within RF claim orchestration;
- compensation: immediate deterministic reversal on post-spend claim failure + durable recovery fallback;
- VIP gate timing: early gate before spend and before paid-voucher creation logic;
- pending state: transient only, no long-lived pending by default;
- rollout: feature-flagged phased enablement (partner -> listing -> broader paid offers);
- frontend: minimal additive error mapping only, backend remains source of truth.

---

Planning input audit (docs read):

- `docs/architecture/domain/rf_slice_4_0_voucher_economy_runtime_foundation_plan_v1.md`
- `docs/architecture/domain/rf_slice_4_1_commit_readiness_regression_sweep_v1.md`
- `docs/architecture/domain/rf_slice_4_2_points_contract_enablement_plan_v1.md`
- `docs/architecture/domain/rf_slice_4_2_commit_readiness_regression_sweep_v1.md`
- `docs/economy/README.md`
- `docs/economy/tokenomics/go2asia_tokenomics_v1.md`
- `docs/economy/vouchers/rf_voucher_economy_v1.md`
- `docs/economy/vip/vip_value_system_v1.md`
- `docs/economy/points/points_sink_design_v1.md`
- `docs/economy/economy_backend_alignment_audit_v1.md`
- `docs/architecture/domain/rf_slice_2_1_repeatability_runtime_implementation_plan_v1.md`
- `docs/architecture/domain/rf_slice_3_0_redemption_operational_diagnostics_plan_v1.md`

Code paths inspected (read-only):

- `apps/rf-service/src/store.ts`
- `apps/rf-service/src/routes/rf.ts`
- `apps/points-service/src/index.ts`
- `packages/db/src/schema/rf.ts`
- `packages/db/src/schema/points.ts`
- `docs/openapi/rf.yaml`
- `docs/openapi/points.yaml`
- `apps/go2asia-pwa-shell/components/rf/Shared/ClaimRfOfferButton.tsx`
- `apps/go2asia-pwa-shell/app/(public)/rf/rielt/listings/[listingId]/vouchers/ListingVoucherOffersClient.tsx`
- `apps/go2asia-pwa-shell/components/rf/Vouchers/RfMyVouchersView.tsx`
- `apps/go2asia-pwa-shell/lib/rfOfferClaim.ts`
- `apps/go2asia-pwa-shell/components/connect/Wallet/WalletView.tsx`
