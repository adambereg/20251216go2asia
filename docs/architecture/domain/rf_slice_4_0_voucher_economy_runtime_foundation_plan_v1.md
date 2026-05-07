# RF Slice 4.0 — Voucher Economy Runtime Foundation Plan v1

Status: planning-only  
Scope type: architecture and implementation planning  
Runtime changes in this slice: none

## 1. Executive Summary

Goal of Slice 4 is to convert RF voucher claim into a real economy sink for ordinary vouchers, while preserving RF runtime safety (idempotency, repeatability, attribution immutability, diagnostics).

Recommended phased approach:

- **Slice 4.1 (foundation schema + contract fields, no debit yet)**  
  Add RF economy snapshot fields and additive API contract fields, keep claim behavior unchanged.
- **Slice 4.2 (points contract enablement)**  
  Extend points-service internal contract for spend-safe debit semantics with idempotency and insufficient-balance handling.
- **Slice 4.3 (RF claim integration)**  
  Integrate idempotent points debit into claim flow for paid vouchers with VIP gate, preserving replay/block behavior.

This sequence minimizes cross-service consistency risk and avoids debited-without-voucher incidents in an immature spend contract.

## 2. Economy SSOT Requirements

From `docs/economy/**` SSOT:

- Ordinary RF voucher claim is intended as a routine points sink.
- VIP is the spend gate for paid points consumption.
- Wallet summary buckets (`available`, `locked`, `network`) are the current projection model.
- No platform commission or checkout semantics in voucher claim flow.
- No expansion to premium/NFT/G2A in this slice.

Critical SSOT implication:
- claim economy must be idempotent and auditable, not just a UI-level wallet display.

## 3. Current Runtime State

RF side (already implemented):

- claim partner/listing scopes with idempotency and context mismatch guards
- repeatability policy with voucher-as-instance (`repeat_policy_snapshot`, `issue_sequence`)
- canonical lifecycle + redeem consistency
- attribution immutable per voucher instance
- internal diagnostics endpoint for lifecycle/redemption/repeatability/attribution/idempotency

Points side (current):

- internal write endpoint: `POST /internal/points/add`
- global idempotency by `externalId`
- action enum already includes RF actions (`rf_voucher_claimed`, `rf_voucher_redeemed`)
- internal auth via service JWT (`iss: go2asia-service-auth`, `aud: points-service`)

Current blocker for spend:

- points internal add validates `amount >= 1` and is add-only contractually.
- no explicit debit endpoint/contract for spend.

## 4. Scope and Non-goals

In scope:

- ordinary voucher points cost model
- VIP spend gate for paid vouchers
- points integration architecture and idempotency semantics
- failure/rollback planning
- additive OpenAPI/SDK plan
- test and sequencing plan

Out of scope:

- premium vouchers, NFT, G2A
- PRO rewards/partner compensation/commission
- merchant billing/checkout
- Connect expansion
- new public/pro/merchant diagnostics surfaces
- runtime implementation in Slice 4.0

## 5. Ordinary Voucher Economy Model

Proposed model:

- Ordinary voucher can be:
  - **free acquisition voucher** (`points_cost = 0`)
  - **paid points voucher** (`points_cost > 0`)
- Claiming paid voucher performs points debit from available points.
- Claiming free voucher performs no debit.

Recommended policy:

- `points_cost = 0` claim can be allowed for non-VIP (acquisition funnel).
- `points_cost > 0` claim requires active VIP and sufficient available points.

Rationale:

- aligns SSOT spend gate for paid consumption
- preserves growth path for zero-cost acquisition vouchers
- keeps gate explicit and testable

## 6. Voucher Cost Source

Options reviewed:

- `rf_offer.points_cost` (simple, stable, auditable)
- listing-level override (`rielt_listing_rf_offer.points_cost_override`) later
- separate pricing engine/table (overkill for first economy slice)

Recommendation:

- start with `rf_offer.points_cost` (default `0`, non-negative)
- no listing override in first implementation slices
- snapshot into voucher at claim time for immutability/audit

## 7. VIP Spend Gate Strategy

Candidate sources:

- wallet summary `vipStatus.isActive`
- gateway role (`vip_spacer`)
- future entitlement service

Recommendation for first runtime slice:

- enforce gate from gateway-auth derived role (`vip_spacer`), because it is already available inside RF principal context and deterministic at request time.
- keep wallet summary as display/projection, not claim-time source of truth.

Limitation to document:

- current VIP truth is role-based baseline, not full paid entitlement lifecycle.

## 8. Points Debit Integration Options

### Option A — Debit first, then create voucher

Pros:
- avoids unpaid voucher issuance

Cons:
- risk of debit committed while voucher insert fails (cross-service partial failure)
- requires compensation path

### Option B — Create pending voucher, then debit, then activate

Pros:
- avoids debit-without-voucher
- clear two-phase state machine

Cons:
- needs new pending economy lifecycle states and broader runtime changes

### Option C — Same transaction across RF and points

Not feasible with separate services and DB boundaries.

### Option D — Outbox/eventual debit

Pros:
- robust distributed consistency pattern

Cons:
- asynchronous UX and temporary unpaid vouchers unless pending state exists
- larger infra footprint

## 9. Recommended Transaction Model

Recommended target model for first debit integration:

- **Synchronous debit + create voucher in one request flow**, but only after points contract supports spend and compensation semantics.
- debit attempt keyed by deterministic externalId derived from voucher instance semantics.
- voucher creation proceeds only when debit accepted (for paid vouchers).
- free vouchers bypass debit path.

Risk control:

- do not implement this until points spend contract is explicit (Slice 4.2).
- if compensation is not available, block runtime integration and remain schema-only.

Why not pending/outbox first:

- adds broader lifecycle complexity before basic spend contract is stable.
- can be a fallback if synchronous integration proves unsafe in tests.

## 10. RF Schema / Snapshot Plan

Recommended RF fields:

- `rf_offer.points_cost` (int, default `0`, check `>= 0`)
- `rf_voucher.points_cost_snapshot` (int, not null, default `0`)
- `rf_voucher.points_debit_external_id` (text nullable, unique when not null)
- `rf_voucher.economy_status` (enum; initial values: `not_required`, `pending`, `debited`, `debit_failed`)

Optional defer:

- `claimed_with_vip` can be deferred; inferable from gate path and logs.
- `economy_failure_reason` can be deferred or kept as diagnostics metadata in first cut.

## 11. Points Service Contract Plan

Current gap:

- `POST /internal/points/add` is add-only (`amount >= 1`) despite schema supporting negative.

Recommended additions:

- either extend `/internal/points/add` to allow negative with explicit spend rules
- or add dedicated endpoint (preferred clarity): `POST /internal/points/spend`

Required behavior for spend contract:

- idempotency by `externalId`
- reject insufficient funds with deterministic error code
- no balance underflow
- conflict on payload mismatch for reused `externalId`
- explicit action for claim spend: `rf_voucher_claim_spend`

## 12. OpenAPI / SDK Plan

RF OpenAPI (additive):

- `RfOffer.pointsCost` (optional in response for compatibility)
- `RfVoucher.pointsCostSnapshot` (optional initially)
- `RfVoucher.economyStatus` (optional initially)

Points OpenAPI (additive):

- spend contract request/response
- action enum extension (`rf_voucher_claim_spend`)
- explicit insufficient-balance and idempotency conflict semantics

SDK/types:

- additive DTO regeneration only
- no breaking changes for existing claim consumers

## 13. Frontend Compatibility Plan

No frontend rewrite needed for first runtime economy integration:

- existing claim button flow already sends idempotency key
- wallet surfaces already consume `/v1/wallet/summary`

Minimal compatibility updates (later runtime slice):

- show points cost in RF catalog/listing cards
- claim error messaging for:
  - VIP required
  - insufficient points
- preserve existing behavior for zero-cost vouchers

## 14. Repeatability Interaction

Rules:

- each new voucher instance snapshots cost independently
- each paid new instance triggers a new debit externalId
- replay to same voucher instance does not duplicate debit
- claim blocked / existing voucher return -> no new debit

## 15. Attribution Interaction

No semantic coupling:

- points debit does not mutate attribution
- attribution remains factual and immutable per voucher instance
- no PRO reward/commission semantics added

## 16. Diagnostics Interaction

Later diagnostics extension (not Slice 4.0 implementation):

- include `pointsCostSnapshot`
- include `economyStatus`
- include `pointsDebitExternalId` (safe display)

Must not include:

- payout projections
- financial token interpretation

## 17. Failure / Rollback Semantics

Required semantics for paid claim:

- if debit rejected (VIP/insufficient/conflict) -> no voucher creation
- if debit accepted and voucher creation fails -> compensation strategy required before production rollout

Compensation options:

- points reversal action with linked externalId
- or transactional orchestration with guaranteed retry/compensate workflow

Hard rule:

- do not ship debit integration without explicit “no debited-without-voucher” guarantee and tested recovery path.

## 18. Tests and CI Gates

Planning target for implementation slices:

- RF unit/integration:
  - claim paid/free with idempotency replay
  - claim block paths produce no debit
  - repeatability creates new debit only for new instance
  - context mismatch never reuses foreign debit
- Points:
  - spend idempotency
  - insufficient funds
  - conflict payload mismatch
- Contract:
  - openapi bundle/check and generated types/sdk parity
- Regression:
  - existing claim/redeem/attribution/diagnostics tests remain green

## 19. Implementation Phases

### Slice 4.0 (current)

- planning-only (this document)

### Slice 4.1 — Economy schema foundation

- RF schema fields for cost/snapshot/externalId/economy status
- additive OpenAPI/SDK fields
- no points debit runtime yet

### Slice 4.2 — Points contract enablement

- points spend-capable contract + action enum + idempotent error semantics
- no RF claim coupling yet or behind disabled flag

### Slice 4.3 — RF claim integration

- paid claim synchronous debit integration
- VIP gate for paid vouchers
- free voucher bypass
- end-to-end tests and failure/compensation coverage

## 20. Recommended First Implementation Slice

Recommended first implementation slice: **Slice 4.1 Economy Schema Foundation**.

Why:

- lowest risk
- creates immutable audit substrate before cross-service money-like behavior
- keeps current claim behavior stable while preparing contracts

## 21. Risks

- Cross-service partial failure (debit accepted, voucher not created)
- Incomplete VIP truth if role model drifts from entitlement policy
- Ambiguous action taxonomy in points ledger if spend action is overloaded
- Replay edge cases across claim idempotency and points externalId semantics
- Frontend confusion if paid/free policy not explicit in catalog UX

## 22. Open Questions

- Should zero-cost vouchers be fully non-VIP forever or only transitional?
- Should spend be a new endpoint or extension of existing add endpoint?
- Is compensation mandatory in 4.2 or acceptable only in 4.3 with guarded rollout?
- Do we need listing-level cost override in 4.x or defer to later pricing slice?
- Should `economy_status` be persisted from 4.1 or introduced only with live debit?

## 23. Final Recommendation

Explicit decisions:

- **First implementation slice:** 4.1 schema + additive contract (no debit runtime).
- **Cost fields:** yes, add on offer (`points_cost`) and voucher snapshot (`points_cost_snapshot`), plus debit tracking fields.
- **VIP gate:** enforce in runtime for paid vouchers once debit integration starts; zero-cost vouchers can stay non-VIP claimable.
- **Debit mode:** synchronous integration preferred for first runtime coupling, but only after spend contract and compensation semantics are explicit.
- **Points action:** add dedicated spend action (`rf_voucher_claim_spend`) to avoid semantic overload.
- **Idempotency:** keep RF claim idempotency as primary; map to deterministic points `externalId` per voucher instance debit.
- **Out of scope:** premium/NFT/G2A, payouts, billing, Connect expansion, public UI expansion, runtime change in Slice 4.0.

---

## Planning Pass Audit Coverage

Docs reviewed:

- `docs/economy/README.md`
- `docs/economy/tokenomics/go2asia_tokenomics_v1.md`
- `docs/economy/vouchers/rf_voucher_economy_v1.md`
- `docs/economy/vip/vip_value_system_v1.md`
- `docs/economy/points/points_sink_design_v1.md`
- `docs/economy/economy_backend_alignment_audit_v1.md`
- `docs/economy/slice1_wallet_implementation_report.md`
- `docs/architecture/domain/rf_slice_2_1_repeatability_runtime_implementation_plan_v1.md`
- `docs/architecture/domain/rf_slice_3_0_redemption_operational_diagnostics_plan_v1.md`
- `docs/architecture/domain/rf_slice_3_2_diagnostics_regression_manual_qa_v1.md`
- `docs/architecture/rf/rf_pro_attribution_baseline_stage_5_0.md`
- `docs/architecture/rf/rf_attribution_canon_refinement_v1.md`

Code paths inspected (read-only):

- `apps/rf-service/src/store.ts`
- `apps/rf-service/src/routes/rf.ts`
- `apps/points-service/src/index.ts`
- `docs/openapi/points.yaml`
- `apps/api-gateway/src/index.ts`
- `packages/db/src/schema/rf.ts`
- `packages/db/src/schema/points.ts`
- RF and wallet-related frontend claim/wallet surfaces in `apps/go2asia-pwa-shell`

Runtime code changed in Slice 4.0:

- none

## 24. Slice 4.1 Implementation Note

Implemented in Slice 4.1 (additive foundation only):

- RF schema fields:
  - `rf_offer.points_cost` (`integer`, `NOT NULL`, default `0`, check `>= 0`)
  - `rf_voucher.points_cost_snapshot` (`integer`, `NOT NULL`, default `0`, check `>= 0`)
  - `rf_voucher.points_debit_external_id` (`text`, nullable, unique when not null)
  - `rf_voucher.economy_status` (`rf_voucher_economy_status`: `not_required`, `pending`, `debited`, `debit_failed`; default `not_required`)
- Claim insert alignment:
  - `claimVoucher` / `claimVoucherForListing` now snapshot `points_cost_snapshot` from offer/listing context
  - `economy_status` is written as:
    - `not_required` for zero-cost vouchers
    - `pending` for paid vouchers (`points_cost > 0`)
- Diagnostics additive exposure:
  - `pointsCostSnapshot`
  - `pointsDebitExternalId`
  - `economyStatus`
- OpenAPI/SDK/types updated additively for RF offer/voucher/diagnostics surfaces.

Explicitly not implemented in Slice 4.1:

- no actual Points debit runtime
- no points-service spend call/integration
- no VIP enforcement at claim time
- no balance checks/insufficient-balance logic
- no compensation/refund/debit recovery runtime
- no premium/NFT/G2A/payout/billing/reward expansion
