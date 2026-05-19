# Stage 9 RF Voucher Economic Trace vs Ledger Authority Contract v1

Date: 2026-05-19
Status: `DOCS_FIRST_RF_VOUCHER_ECONOMIC_TRACE_VS_LEDGER_AUTHORITY_CONTRACT_REVIEWED`
Stage: `Stage 9.5 / RF Voucher Economic Trace vs Ledger Authority Contract`
Mode: read-only RF voucher economic trace boundary contract, docs-first, no implementation, no frontend changes, no backend changes, no runtime changes, no API change, no OpenAPI change, no SDK change, no schema change, no migrations, no tests added, no test execution as evidence, no staging/live evidence collection, no rollout, no RF redesign, no paid voucher rewrite, no compensation/recovery implementation, no cashback runtime, no payout/settlement runtime, no receipt service, no reconciliation engine, no copy patch, no reward activation, no Points enforcement activation, no Quest to Badge activation, no Achievement runtime activation, no NFT/token/on-chain activation, no Stage 9 roadmap, no Slice 16 movement

## Purpose

This contract defines the boundary between RF voucher lifecycle/economy traces and Points ledger authority.

It answers:

```text
what_RF_voucher_lifecycle_facts_can_prove
what_RF_economy_trace_fields_can_prove
how_RF_paid_voucher_spend_requests_are_read
how_pointsDebitExternalId_is_read
how_economyStatus_is_read
how_RF_recovery_rows_are_read
where_RF_state_stops_and_Points_ledger_authority_begins
which_cashback_payout_settlement_interpretations_are_forbidden
```

Stage 9.5 is an RF trace vs ledger authority interpretation contract. It does not redesign RF, implement cashback, implement payout, implement settlement, implement receipt service, implement reconciliation, patch copy or approve rollout.

## Non-goals

This contract does not:

- redesign RF;
- rewrite RF voucher lifecycle;
- rewrite Points/RF integration;
- implement paid voucher spend;
- implement compensation or recovery runtime;
- implement cashback system;
- implement payout or settlement;
- implement receipt service or receipt UI;
- implement reconciliation engine;
- implement correction, reversal, refund or adjustment runtime;
- change backend runtime;
- change frontend runtime;
- change API, OpenAPI, SDK or generated clients;
- change schema or add migrations;
- add tests;
- execute tests as validation evidence;
- collect staging/live evidence;
- patch copy;
- activate rewards or Points enforcement;
- activate Quest to Badge handoff;
- activate Achievement runtime;
- activate NFT, token, G2A, wallet, bridge, marketplace or on-chain behavior;
- create payout, settlement, cashback, commission or financial obligation semantics;
- create a Stage 9 roadmap;
- approve rollout;
- move Slice 16.

## Stage 7 / 8 / 9 Inherited Constraints

Stage 9.5 inherits Stage 7 RF/Rielt closure, Stage 8 closure and Stage 9.0-9.4 boundaries:

```text
stage_7_RF_Rielt_closure: accepted_for_docs_first_context
stage_8_stop_condition_reached: true
stage_9_architectural_entry_ready: true
stage_9_scope: Economic_Ledger_Activity_Model
stage_9_0_baseline_audit: accepted_for_docs_first_inventory
stage_9_1_proof_class_contract: accepted_for_docs_first_boundary
stage_9_2_points_ledger_authority_idempotency_contract: accepted_for_docs_first_authority_boundary
stage_9_3_outbox_delivery_intent_contract: accepted_for_docs_first_delivery_boundary
stage_9_4_connect_projection_contract: accepted_for_docs_first_projection_boundary
production_launch_ready: false
public_rollout_ready: false
staging_evidence_approved: false
security_complete: false
slice_16_status: blocked_not_triggered
```

Mandatory inherited invariants:

```text
activity_fact != economic_fact
event != proof
projection != authority
delivery_intent != grant_fact
outbox_delivered != guaranteed_new_credit
applied=false != new_transaction
RF_economy_trace != Points_ledger_fact
RF_voucher_lifecycle != ledger_transaction
RF_voucher != Points_transaction
RF_claim != payment
RF_redeem != payout
RF_voucher != cashback
RF_compensation != settlement
RF_recovery_trace != correction_ledger
receipt_requires_backend_backed_economic_authority
diagnostics != authority
tests != rollout
docs != rollout
contract != activation
stable_enough != launch_ready
```

Stage 9.2 / 9.3 ledger and delivery readings control this contract:

```text
Points_Service = current_Points_ledger_authority
points_transaction_row = economic_fact
externalId = Points_idempotency_SSOT_key
applied=true = new_Points_ledger_write_created
applied=false = accepted_duplicate_or_idempotent_replay
delivery_intent != grant_fact
outbox_delivered != guaranteed_new_credit
```

## Inputs Reviewed

Primary documents:

- `docs/architecture/domain/stage_9_connect_wallet_dashboard_projection_boundary_contract_v1.md`
- `docs/architecture/domain/stage_9_outbox_delivery_intent_vs_grant_fact_contract_v1.md`
- `docs/architecture/domain/stage_9_points_ledger_authority_idempotency_contract_v1.md`
- `docs/architecture/domain/stage_9_ledger_activity_proof_class_boundary_contract_v1.md`
- `docs/architecture/domain/stage_9_economic_ledger_activity_model_baseline_audit_v1.md`
- `docs/architecture/domain/stage_7_rf_rielt_closure_review_and_stage_8_readiness_v1.md`
- `docs/runtime/stage_7_2_governance_freeze_closure_v1.md`
- `docs/economy/points_policy_v1.md`
- `docs/economy/future_ledger_readiness_v1.md`

Runtime / contract inputs:

- `docs/openapi/rf.yaml`
- `docs/openapi/points.yaml`
- `packages/db/src/schema/rf.ts`
- `packages/db/src/schema/points.ts`
- `apps/rf-service/**`
- `apps/points-service/**`
- `apps/api-gateway/**`
- `apps/go2asia-pwa-shell/components/connect/**`
- `apps/go2asia-pwa-shell/lib/connectRfProjection.ts`
- relevant local tests for awareness only; no tests were executed

Multi-agent roles were used for read-only review: architect, analyst, backend, frontend, tester, security and technical writer.

## RF Voucher Lifecycle Boundary

RF owns RF voucher lifecycle facts.

Current RF lifecycle surfaces:

| Surface | Owner | Safe reading | Forbidden reading |
|---|---|---|---|
| `rf_voucher.status` | RF Service | Legacy runtime compatibility state: `claimed`, `redeemed`, `cancelled`. | Payment status, payout state, cashback state. |
| `rf_voucher.canonicalStatus` | RF Service | Preferred RF voucher lifecycle state. | Points ledger state or spendability proof. |
| `rf_voucher.claimScope` | RF Service | Voucher claim scope: partner or listing. | Payment scope or settlement scope. |
| `rf_voucher.rieltListingId` / title snapshot | RF Service with Rielt context | Listing context snapshot for listing-scoped RF voucher. | Booking, payment, Rielt listing ownership transfer. |
| `rf_voucher_redemption` | RF Service | Voucher use / redemption activity fact. | Partner payout, settlement, Points debit/credit. |
| `rf_claim_idempotency` | RF Service | RF claim replay binding. | Points idempotency or Points ledger proof. |
| `rf_voucher_scope_consumption_guard` | RF Service | Repeatability / once-per-scope consumption guard. | Ledger guard, balance lock, payment hold. |

Canonical lifecycle readings:

```text
RF_voucher_lifecycle = activity_fact_or_economy_trace
RF_Service_owns_voucher_lifecycle: true
RF_claim = activity_fact
RF_redeem = activity_fact
canonicalStatus = RF_lifecycle_state
legacy_status = compatibility_transport_state
listing_scoped_voucher = RF_voucher_with_Rielt_context
RF_lifecycle_fact != ledger_transaction
RF_voucher_lifecycle != payment
RF_voucher_lifecycle != payout
RF_voucher_lifecycle != cashback
```

`redeemed` records RF voucher utility use. It does not record merchant payout, partner settlement, cashback confirmation, payment completion or external financial obligation.

## RF Economy Trace Boundary

RF may store economy trace fields that correlate RF lifecycle with Points operations.

Current economy trace fields:

| Field / surface | Safe reading | Forbidden reading |
|---|---|---|
| `rf_offer.pointsCost` | RF offer internal Points cost. | Cash price, booking fee, payout or settlement value. |
| `rf_voucher.pointsCostSnapshot` | Claim-time snapshot of intended Points cost. | Actual debit fact, receipt, cash value. |
| `rf_voucher.pointsDebitExternalId` | Pointer to Points `externalId` for intended/correlated spend. | Points transaction row, debit receipt, proof that debit exists. |
| `rf_voucher.economyStatus` | RF lifecycle/economy processing trace. | Points ledger state, receipt, payment state. |
| `rf_voucher_economy_recovery.spendExternalId` | Recovery correlation to original intended Points spend. | Ledger row or debit proof. |
| `rf_voucher_economy_recovery.compensationExternalId` | Recovery correlation to intended compensation add. | Compensation receipt or payout proof. |
| `rf_voucher_economy_recovery.state` | Operational recovery marker: pending or resolved. | Correction ledger or dispute resolution state. |

Canonical trace readings:

```text
RF_economy_trace = RF_owned_correlation_and_status_trace
RF_economy_trace_may_reference_Points_externalId
RF_economy_trace_may_help_diagnostics
RF_economy_trace_may_support_operational_observation
pointsDebitExternalId = Points_externalId_pointer
economyStatus = RF_lifecycle_economy_trace
```

Forbidden trace readings:

```text
RF_economy_trace != Points_ledger_fact
RF_economy_trace != Points_transaction
RF_economy_trace != Points_balance
RF_economy_trace != ledger_authority
RF_economy_trace != payment_receipt
RF_economy_trace != cashback_state
RF_economy_trace != payout_state
RF_economy_trace != settlement_state
pointsCost != cash_value
pointsCostSnapshot != debit_fact
pointsDebitExternalId != debit_proof
economyStatus != receipt
```

## Paid Voucher Spend Boundary

Paid voucher spend, where runtime-backed and enabled, is a coupling between RF claim flow and Points Service. RF may request a Points spend; Points decides the debit fact.

Current RF spend request readings:

```text
RF_paid_voucher_spend_externalId = rf:voucher-claim-spend:{voucherId}
RF_may_request_Points_spend = true
Points_decides_debit_fact = true
Points_debit_fact_requires_applied_true = true
applied=true = new_Points_debit_ledger_write_created
applied=false = accepted_duplicate_or_idempotent_replay_no_new_debit
409 = rejected_write_or_integration_conflict
INSUFFICIENT_POINTS_BALANCE = rejected_spend_no_mutation
REPLAY_PAYLOAD_MISMATCH = integration_conflict
```

RF paid spend request fields:

- action: `rf_voucher_claim_spend`;
- external id pattern: `rf:voucher-claim-spend:{voucherId}`;
- positive request amount, stored by Points as negative ledger amount;
- metadata can include claim scope / scope reference;
- RF source identity is authenticated through service JWT when calling Points.

Forbidden readings:

```text
RF_claim_with_points_cost != payment
pointsCostSnapshot != debit_fact
pointsDebitExternalId != debit_receipt
economyStatus.debited != standalone_ledger_authority
RF_SPEND_IDEMPOTENCY_CONFLICT != successful_write
RF_INSUFFICIENT_POINTS_BALANCE != hidden_debit
RF_may_request_spend != RF_decides_debit_fact
```

## RF Compensation / Recovery Boundary

RF compensation/recovery is operational coupling, not user reward and not financial correction authority.

Current compensation / recovery readings:

```text
RF_compensation_externalId = rf:voucher-claim-spend-compensation:{voucherId}
RF_compensation_attempt = service_owned_recovery_delivery_intent
RF_compensation_applied_true = Points_owned_new_credit_when_accepted
RF_compensation_applied_false = duplicate_compensation_replay_no_new_credit
RF_compensation_409 = RF_Points_integration_conflict
RF_recovery_pending = operational_recovery_marker
RF_recovery_resolved = recovery_marker_resolved
RF_recovery_trace = operational_recovery_trace
```

What recovery can prove:

- RF attempted or recorded recovery correlation.
- RF can correlate spend and compensation external IDs.
- RF can expose pending/resolved operational recovery marker for diagnostics.

What recovery cannot prove:

```text
RF_recovery_trace != Points_credit_fact
RF_recovery_trace != refund
RF_recovery_trace != settlement
RF_recovery_trace != payout
RF_recovery_trace != cashback
RF_recovery_trace != correction_ledger
RF_recovery_trace != confirmed_receipt
```

RF recovery rows are operational traces. They are not a generalized financial correction model.

## RF State vs Points Transaction Boundary

RF state and Points transaction state are separate authority classes.

RF Service owns:

- RF partner facts;
- RF offer facts;
- RF voucher lifecycle;
- RF claim/redeem facts;
- RF listing-scoped voucher facts;
- RF attribution/provenance where runtime-backed;
- RF economy trace pointers and recovery markers.

Points Service owns:

- Points ledger rows;
- Points debit/credit facts;
- user balance materialization;
- Points idempotency by `externalId`;
- `applied=true` / `applied=false` write interpretation.

Boundary rule:

```text
RF_voucher_state_may_correlate_with_Points_transaction
RF_voucher_state_may_explain_RF_lifecycle
RF_voucher_state_must_not_replace_Points_transaction
Points_transaction_must_not_replace_RF_lifecycle
Points_transaction_row_required_for_Points_economic_fact: true
```

RF can say without Points lookup:

- voucher lifecycle state;
- claim scope and listing context snapshot;
- claim-time Points cost snapshot;
- RF-recorded `pointsDebitExternalId`;
- RF-recorded `economyStatus`;
- RF-recorded recovery marker.

RF cannot prove without Points authority:

- actual Points transaction id;
- stored Points ledger amount;
- `sourceService` / metadata as stored in Points;
- `applied=true` vs `applied=false` result after the fact;
- actual balance mutation;
- actual compensation ledger row;
- user-facing receipt.

## RF Projection Boundary Inside Connect

Connect may display RF voucher lifecycle projections. Connect does not own RF lifecycle or Points ledger authority.

Safe Connect RF readings:

```text
Connect_RF_projection = UI_grouping_over_RF_reads
RF_voucher_summary = RF_projection
RF_voucher_list = RF_lifecycle_read_surface
RF_timeline = projection_over_RF_voucher_timestamps
"Ваучер получен" = RF_lifecycle_display
"Ваучер использован" = RF_lifecycle_display
"Получено через PRO" = attribution_projection
RF_summary_endpoint = preferred_counter_source_when_available
RF_voucher_list = fallback_display_source_for_degraded_projection
```

Forbidden Connect RF readings:

```text
Connect_RF_projection != RF_lifecycle_authority
Connect_RF_projection != Points_ledger_authority
Connect_RF_projection != receipt
Connect_RF_projection != cashback
Connect_RF_projection != payout
Connect_RF_projection != settlement
RF_timeline != payout_proof
"Получено через PRO" != commission
"Получено через PRO" != payout
```

## RF / Rielt Listing-Scoped Boundary

Listing-scoped voucher flows remain RF-owned voucher flows with Rielt context.

Canonical reading:

```text
listing_scoped_claim = RF_voucher_claim_with_Rielt_context
listingContext = RF_stored_Rielt_reference_snapshot
claimScope.listing = RF_uniqueness_scope
Rielt_listing_context != RF_lifecycle_ownership
Rielt_listing_context != booking_authority
Rielt_listing_context != payment_authority
listing_scoped_voucher != payment_claim
listing_scoped_redeem != partner_payout
Rielt_RF_CTA_projection != ledger_authority
```

Ownership boundary:

```text
RF owns voucher lifecycle and listing-scoped voucher facts.
RF stores listing context as a snapshot/reference.
Rielt owns listing lifecycle, listing visibility and listing metadata.
Rielt must not become voucher lifecycle authority.
Rielt CTA must not become booking/payment/settlement proof.
```

## RF Diagnostics / Evidence Boundary

Diagnostics and evidence are observations only.

Current diagnostic/evidence classes may include:

- RF voucher/economy diagnostics;
- RF recovery markers;
- RF entitlement diagnostics;
- Points transaction and balance reads for approved scopes;
- Gateway identity/request context diagnostics;
- structured logs;
- local tests and config tests;
- staged documentation/evidence artifacts where separately approved.

Canonical rules:

```text
diagnostic_observation = operational_debug_or_drift_signal
diagnostic_snapshot = support_context
logs != ledger
RF_diagnostics != authority
RF_diagnostics != Points_ledger_proof
RF_diagnostics != rollout_evidence
evidence != rollout
tests != rollout
docs != rollout
contract != activation
```

No diagnostic surface may convert RF trace into Points authority.

## Cashback / Payout / Settlement Forbidden Boundary

The following readings are explicitly forbidden:

```text
voucher => cashback
RF_voucher => cashback
RF_claim => payment
RF_redeem => payout
RF_redeem => settlement
RF_offer => financial_product
RF_partner => settlement_counterparty
pointsCost => cash_value
pointsCostSnapshot => cash_value
pointsDebitExternalId => debit_proof
economyStatus => receipt
RF_points_debit => cash_payment
RF_compensation => cashback
RF_compensation => payout
RF_compensation => settlement
RF_compensation => refund
RF_recovery => financial_correction_engine
RF_recovery_trace => correction_ledger
RF_projection => ledger_authority
RF_projection => receipt
Connect_RF_timeline => payout_proof
Rielt_listing_scoped_claim => booking
Rielt_listing_scoped_redeem => merchant_payout
PRO_attribution => commission
voucher_attribution => payout_entitlement
diagnostics => authority
tests => rollout
docs => rollout
contract => activation
stable_enough => launch_ready
```

Policy statement:

```text
Points are internal utility, not money.
RF voucher utility is not cashback, settlement, payout or payment rail.
Partner service/payment happens outside platform economy unless separately approved, implemented and legally reviewed.
Slice 16 remains blocked_not_triggered.
```

## Stable-Enough RF Semantics

These semantics are stable enough for later Stage 9 contracts to inherit:

- RF owns RF voucher lifecycle facts.
- Points Service remains current Points ledger authority.
- RF economy trace fields are pointers/status traces, not ledger facts.
- `pointsCost` and `pointsCostSnapshot` are internal Points utility cost fields, not cash value.
- `pointsDebitExternalId` is a Points externalId pointer, not receipt authority.
- `economyStatus` is RF lifecycle/economy trace, not Points ledger state.
- Paid voucher spend only becomes a Points debit fact through Points authority.
- Compensation only becomes a Points credit fact through Points authority.
- RF recovery rows are operational traces, not financial correction authority.
- Connect RF surfaces are projections.
- Rielt listing-scoped vouchers are RF vouchers with listing context.
- Cashback, payout, settlement, commission and financial obligation readings are forbidden.
- Slice 16 remains `blocked_not_triggered`.

Stable enough means usable for interpretation. It does not mean implementation-ready, evidence-approved, receipt-ready, security-complete, launch-ready or Slice 16-ready.

## Deferred / Unknown Areas

Deferred or unknown areas:

- no generalized Economic Ledger exists beyond current Points ledger authority;
- no generalized receipt service exists;
- no approved dispute-grade receipt UI exists;
- no support/dispute workflow is defined here;
- no reconciliation engine is activated here;
- no generic correction/reversal/refund/adjustment model is defined here;
- no financial refund model is defined here;
- hard Points spend enforcement remains outside this contract;
- paid-spend live evidence remains governance-bound where not separately approved;
- compensation/recovery live evidence remains governance-bound where not separately approved;
- no RF redesign is introduced here;
- no RF copy patch is introduced here;
- no payout, settlement, cashback or commission runtime exists;
- no NFT/token/on-chain/G2A externalization runtime exists;
- staging/live evidence remains frozen by governance.

Deferred means not activated, not approved and not converted into a roadmap.

## Stage 9.6 Recommendation

Recommended bounded next slice:

```text
Stage_9_6: Receipt / User-Facing Proof Boundary Contract
```

Reason:

Stage 9.5 isolates RF voucher lifecycle and economy traces from Points ledger authority. Stage 9 now has boundaries for proof classes, Points authority, delivery intent, Connect projections and RF traces. The next highest-risk layer is user-facing proof: which existing backend-backed reads may be treated as receipt candidates, why none are confirmed dispute-grade receipts yet, and why screenshots, dashboards, delivery states, RF traces and copy labels remain non-authoritative.

Stage 9.6 must remain docs-first and must not implement receipt service, receipt UI, support tooling, reconciliation, payout, cashback, settlement, rollout or Slice 16 movement.

## Acceptance Criteria

This contract is accepted if:

- RF voucher lifecycle semantics are explicit;
- RF economy trace semantics are explicit;
- paid voucher spend semantics are explicit;
- RF compensation/recovery semantics are explicit;
- RF state vs Points transaction boundary is explicit;
- Connect RF projection semantics are explicit;
- RF/Rielt listing-scoped boundary is explicit;
- diagnostics/evidence boundary is explicit;
- cashback/payout/settlement forbidden semantics are explicit;
- stable-enough RF semantics are explicit;
- deferred and unknown areas are explicit and not converted into roadmap;
- no implementation is added;
- no frontend changes are added;
- no backend changes are added;
- no copy patch is added;
- no activation is implied;
- no new runtime semantics are invented;
- no governance recursion is introduced;
- no rollout approval is implied;
- Slice 16 remains `blocked_not_triggered`.

## Final Status

```text
stage_9_5_status: docs_first_rf_voucher_economic_trace_vs_ledger_authority_contract_reviewed

RF_voucher_lifecycle_boundary_defined: true
RF_economy_trace_boundary_defined: true
paid_voucher_spend_boundary_defined: true
RF_compensation_recovery_boundary_defined: true
RF_state_vs_Points_transaction_boundary_defined: true
RF_projection_inside_Connect_boundary_defined: true
RF_Rielt_listing_scoped_boundary_defined: true
diagnostics_evidence_boundary_defined: true
cashback_payout_settlement_forbidden: true
stable_enough_RF_trace_semantics_explicit: true
deferred_unknown_areas_explicit: true

RF_Service_owns_voucher_lifecycle: true
Points_Service_owns_Points_ledger_facts: true
RF_economy_trace_is_not_ledger_authority: true
RF_voucher_is_not_Points_transaction: true
pointsDebitExternalId_is_pointer_not_receipt: true
economyStatus_is_trace_not_ledger_state: true
pointsCost_is_not_cash_value: true
pointsCostSnapshot_is_not_debit_fact: true
RF_claim_is_not_payment: true
RF_redeem_is_not_payout: true
RF_voucher_is_not_cashback: true
RF_compensation_attempt_is_not_cashback: true
RF_compensation_attempt_is_not_payout: true
RF_compensation_attempt_is_not_settlement: true
RF_recovery_trace_is_not_correction_ledger: true
Connect_RF_projection_is_not_authority: true
Rielt_listing_context_is_not_RF_lifecycle_ownership: true
Rielt_RF_CTA_projection_is_not_ledger_authority: true
diagnostics_are_not_authority: true

new_RF_runtime: false
new_Connect_runtime: false
new_receipt_service: false
new_receipt_UI: false
new_support_tooling: false
new_reconciliation_engine: false
new_cashback_runtime: false
new_payout_settlement_runtime: false
new_runtime_semantics: false
copy_patch: false
code_changes: false
backend_changes: false
frontend_changes: false
API_changes: false
OpenAPI_changes: false
SDK_changes: false
schema_changes: false
migrations: false
tests_added: false
tests_executed_as_evidence: false
staging_live_evidence_collection: false

reward_activation: false
Points_enforcement_activation: false
Quest_to_Badge_handoff_activation: false
Achievement_runtime_activation: false
NFT_token_on_chain_activation: false
payout_settlement_cashback_activation: false
runtime_rollout_approval: false
production_launch_ready: false
public_rollout_ready: false
security_complete: false
ledger_complete: false
contract_acceptance_implies_activation: false

recommended_stage_9_6_bounded_slice: Receipt_User_Facing_Proof_Boundary_Contract
slice_16_status: blocked_not_triggered
```

## Final Verdict

Stage 9.5 confirms the RF voucher economic trace vs ledger authority boundary:

```text
RF owns voucher lifecycle.
Points owns Points ledger facts.
RF economy trace fields are pointers and operational status traces, not ledger authority.
Paid voucher spend becomes an economic fact only when Points accepts a ledger write.
RF compensation/recovery is service-owned recovery intent/trace, not cashback, payout or settlement.
Connect RF surfaces are projections.
Rielt listing-scoped vouchers are RF vouchers with listing context, not booking or payment authority.
Diagnostics and evidence are observations, not authority or rollout approval.
```

This contract is accepted as a docs-first RF trace interpretation boundary only. It does not implement RF redesign, paid spend rewrite, compensation runtime, recovery runtime, reconciliation, receipt service, receipt UI, support tooling, copy patch, payout/settlement/cashback, reward activation, Points enforcement, Quest to Badge handoff, Achievement runtime, NFT/token/on-chain behavior, staging/live evidence collection, rollout approval or Slice 16 movement.
