# Stage 9 Outbox / Delivery Intent vs Grant Fact Contract v1

Date: 2026-05-19
Status: `DOCS_FIRST_OUTBOX_DELIVERY_INTENT_VS_GRANT_FACT_CONTRACT_REVIEWED`
Stage: `Stage 9.3 / Outbox Delivery Intent vs Grant Fact Contract`
Mode: read-only outbox and delivery intent boundary contract, docs-first, no implementation, no runtime changes, no API change, no OpenAPI change, no SDK change, no schema change, no migrations, no tests added, no test execution as evidence, no staging/live evidence collection, no rollout, no reward activation, no Points enforcement activation, no Quest to Badge activation, no Achievement runtime activation, no NFT/token/on-chain activation, no payout/settlement/cashback activation, no Stage 9 roadmap, no Slice 16 movement

## Purpose

This contract defines the boundary between producer-owned delivery intent and downstream grant fact.

It answers:

```text
what_counts_as_delivery_intent
what_counts_as_downstream_grant_fact
who_owns_delivery_state
who_owns_economic_fact
how_pending_failed_delivered_are_read
how_duplicate_accepted_delivery_is_read
how_replay_requeue_and_409_conflicts_are_read
how_RF_compensation_is_read
which_transitions_and_interpretations_are_forbidden
```

Stage 9.3 is a delivery intent vs grant fact contract only. It does not implement outbox workers, design event bus, implement reconciliation, implement receipt service, activate payout or approve rollout.

## Non-goals

This contract does not:

- implement outbox workers;
- implement retry workers, schedulers, queues, event bus, inbox, topics or event sourcing;
- implement distributed transaction system;
- implement reconciliation engine;
- implement receipt service or receipt UI;
- redesign Points, Quest, RF, Wallet, Connect or Badge runtime;
- change backend runtime;
- change frontend runtime;
- change API, OpenAPI, SDK or generated clients;
- change schema or add migrations;
- add tests;
- execute tests as validation evidence;
- collect staging/live evidence;
- activate rewards or Points enforcement;
- activate Quest to Badge handoff;
- activate Achievement runtime;
- activate NFT, token, G2A, wallet, bridge, marketplace or on-chain behavior;
- create payout, settlement, cashback, commission or financial obligation semantics;
- create a Stage 9 roadmap;
- approve rollout;
- move Slice 16.

## Stage 8 / 9 Inherited Constraints

Stage 9.3 inherits Stage 8.8, Stage 9.0, Stage 9.1 and Stage 9.2:

```text
stage_8_stop_condition_reached: true
stage_9_architectural_entry_ready: true
stage_9_scope: Economic_Ledger_Activity_Model
stage_9_0_baseline_audit: accepted_for_docs_first_inventory
stage_9_1_proof_class_contract: accepted_for_docs_first_boundary
stage_9_2_points_ledger_authority_idempotency_contract: accepted_for_docs_first_authority_boundary
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
completion != grant
completion != reward_receipt
completion != badge_awarded
delivery_intent != grant_fact
outbox_delivered != guaranteed_new_credit
badge_award != Points_grant
badge_ownership != payout
badge_ownership != entitlement
badge_ownership != NFT
receipt_requires_backend_backed_economic_authority
diagnostics != authority
localStorage != backend_proof
mock != runtime_truth
tests != rollout
docs != rollout
contract != activation
stable_enough != launch_ready
```

Stage 9.2 ledger rules that control this contract:

```text
Points_Service = current_Points_ledger_authority
points_transaction_row = economic_fact
externalId = Points_idempotency_SSOT_key
sourceEventId = audit_pointer_not_proof
applied=true = new_Points_ledger_write_created
applied=false = accepted_duplicate_or_idempotent_replay
409 = rejected_write_or_integration_conflict
```

## Inputs Reviewed

Primary documents:

- `docs/architecture/domain/stage_9_points_ledger_authority_idempotency_contract_v1.md`
- `docs/architecture/domain/stage_9_ledger_activity_proof_class_boundary_contract_v1.md`
- `docs/architecture/domain/stage_9_economic_ledger_activity_model_baseline_audit_v1.md`
- `docs/architecture/domain/stage_8_quest_completion_vs_reward_delivery_separation_contract_v1.md`
- `docs/architecture/domain/stage_8_progression_authority_closure_review_and_stage_9_readiness_v1.md`
- `docs/runtime/stage_7_2_governance_freeze_closure_v1.md`
- `docs/economy/points_policy_v1.md`
- `docs/economy/future_ledger_readiness_v1.md`

Runtime / contract inputs:

- `docs/openapi/points.yaml`
- `docs/openapi/quest.yaml`
- `docs/openapi/rf.yaml`
- `packages/db/src/schema/quest.ts`
- `packages/db/src/schema/rf.ts`
- `packages/db/src/schema/points.ts`
- `apps/quest-service/**`
- `apps/rf-service/**`
- `apps/points-service/**`
- `apps/api-gateway/**`
- relevant local tests for awareness only; no tests were executed

Multi-agent roles were used for read-only review: architect, analyst, backend, tester, security and technical writer, with frontend considered where projection/receipt surfaces are exposed.

## Delivery Intent Boundary

Delivery intent is producer-owned orchestration state. It can preserve correlation, attempt count, retry state and delivery outcome, but it does not own downstream truth.

Canonical definition:

```text
delivery_intent = producer_owned_attempt_or_retry_state
delivery_intent = correlation_and_delivery_state
delivery_intent != grant_fact
delivery_intent != receipt
delivery_intent != downstream_authority
delivery_retry_state != user_retry_authority
```

Current delivery intent / trace surfaces:

| Surface | Owner | Persistence | Safe reading | Forbidden reading |
|---|---|---|---|---|
| `quest_reward_outbox` | Quest Service | `quest_reward_outbox` | Delivery intent for a configured Quest Points reward. | Points transaction, grant fact, receipt, user retry authority. |
| `quest_reward_outbox.pending` | Quest Service | status + attempt fields | Delivery not finished or retryable state remains. | Pending grant, ledger write, promised future credit. |
| `quest_reward_outbox.failed` | Quest Service | status + last error | Non-retryable or manually handled failed delivery attempt. | Final economic denial, user retry instruction, receipt. |
| `quest_reward_outbox.delivered` | Quest Service | status + delivered timestamp | Downstream Points call accepted or duplicate accepted. | Guaranteed new credit, receipt, payout, badge award. |
| RF `pointsDebitExternalId` | RF Service | `rf_voucher.points_debit_external_id` | Pointer to intended/correlated Points spend external id. | Standalone debit fact or payment proof. |
| RF `economyStatus` | RF Service | `rf_voucher.economy_status` | RF lifecycle/economy trace. | Ledger authority, payout state, cashback state. |
| `rf_voucher_economy_recovery` | RF Service | recovery marker row | Operational recovery trace for spend/compensation correlation. | Correction ledger, receipt, settlement, payout. |

Delivery lifecycle vs economic lifecycle:

```text
delivery_lifecycle_owned_by_producer: true
economic_lifecycle_owned_by_downstream_authority: true
Quest_delivery_state != Points_ledger_state
RF_economy_trace != Points_ledger_state
```

## Grant Fact Boundary

Grant fact is downstream authority-owned economic fact.

For current Points grants and debits:

```text
grant_fact = Points_owned_ledger_write
Points_grant_fact = points_transactions_row_with_positive_amount
Points_debit_fact = points_transactions_row_with_negative_amount
Points_grant_fact_requires_applied_true: true
Points_debit_fact_requires_applied_true: true
applied=true = new_Points_ledger_write_created
applied=false = duplicate_replay_no_new_write
```

Ownership boundary:

```text
Points_decides_grant_fact: true
Quest_does_not_decide_grant_fact: true
RF_does_not_decide_grant_fact: true
outbox_service_does_not_decide_grant_fact: true
delivery_state_does_not_decide_grant_fact: true
```

Safe relationship:

```text
activity_fact_may_create_delivery_intent
delivery_intent_may_request_downstream_write
downstream_authority_may_create_grant_fact
```

Forbidden shortcut:

```text
activity_fact -> delivery_intent -> grant_fact
```

This chain is not automatic. Each class remains separately owned and separately interpreted.

## Delivered Semantics

`delivered` is the highest-risk delivery state. Today it means producer-side delivery reached an accepted downstream response. It does not mean a new credit was created.

Quest delivered reading:

```text
quest_reward_outbox.delivered = Points_call_accepted_or_duplicate_accepted
quest_reward_outbox.delivered != guaranteed_new_credit
quest_reward_outbox.delivered != receipt
quest_reward_outbox.delivered != payout
quest_reward_outbox.delivered != badge_award
```

Delivered is compatible with either:

```text
Points_response.applied=true -> new_ledger_write_created
Points_response.applied=false -> duplicate_replay_accepted_no_new_write
```

Therefore:

```text
outbox_delivered => downstream_call_accepted_or_duplicate_accepted
outbox_delivered != guaranteed_credit
outbox_delivered != new_transaction
outbox_delivered != reward_receipt
duplicate_accepted_delivery != second_grant
```

Receipt boundary:

```text
delivered != receipt
delivered_without_new_write_is_possible: true
receipt_requires_backend_backed_economic_authority
```

## Replay / Requeue Boundary

Replay and requeue are service-owned delivery operations. They do not create economic truth by themselves.

Replay reading:

```text
replay = service_owned_attempt_to_repeat_same_delivery_intent
replay_pending = service_owned_processing_of_pending_delivery_intents
replay != grant_fact
replay != receipt
replay != frontend_retry_instruction
```

Requeue reading:

```text
requeue = service_owned_return_to_delivery_attempt_state
requeue_failed = selected_failed_rows_become_pending
requeue_failed_does_not_deliver_points_immediately: true
requeue != grant_fact
requeue != proof_of_credit
```

Duplicate replay reading:

```text
duplicate_replay = accepted_noop_over_existing_matching_ledger_write
duplicate_replay_returns_existing_transaction_reference
duplicate_replay_does_not_create_second_points_transactions_row
duplicate_replay_does_not_apply_second_user_balances_delta
duplicate_replay != second_grant
duplicate_replay != second_debit
```

Retry authority:

```text
retry_authority = service_owned_only
frontend_retry_of_internal_delivery = forbidden
client_retry_does_not_authorize_grant: true
support_manual_retry_requires_separate_authority: true
```

Deterministic external ID reading:

```text
deterministic_externalId = idempotency_correlation_key
deterministic_externalId != proof
deterministic_externalId != receipt
deterministic_externalId != permission_to_mutate_payload
```

## Conflict Boundary

Conflict means the downstream write was rejected or the idempotency key was reused with incompatible write content.

Current conflict readings:

```text
409 = rejected_write_or_integration_conflict
REPLAY_PAYLOAD_MISMATCH = same_externalId_with_non_matching_payload
INSUFFICIENT_POINTS_BALANCE = rejected_spend_no_mutation
409 != successful_write
409 != frontend_retry_instruction
409 != user_retry_authority
409 != receipt
```

Quest conflict reading:

```text
Points_409_for_Quest_reward = non_retryable_delivery_conflict
Quest_outbox_failed_after_409 = delivery_attempt_failed
Quest_outbox_failed_after_409 != ledger_denial_receipt
Quest_outbox_failed_after_409 != user_retry_instruction
```

RF conflict reading:

```text
RF_SPEND_IDEMPOTENCY_CONFLICT = RF_Points_integration_conflict
RF_INSUFFICIENT_POINTS_BALANCE = rejected_spend_no_mutation
RF_conflict != payout_state
RF_conflict != cashback_state
RF_conflict != user_retry_authority
```

Conflict remains a service-owned integration state until a separate operational contract defines handling.

## RF Compensation Boundary

RF owns voucher lifecycle and economy traces. Points owns Points ledger facts.

Current RF spend / compensation coupling:

```text
RF_claim = activity_fact
RF_redeem = activity_fact
RF_paid_voucher_spend_externalId = rf:voucher-claim-spend:{voucherId}
RF_compensation_externalId = rf:voucher-claim-spend-compensation:{voucherId}
RF_may_request_Points_spend_or_compensation_add = true
Points_decides_ledger_fact = true
rf_voucher.pointsDebitExternalId = Points_externalId_pointer
rf_voucher.economyStatus = RF_lifecycle_economy_trace
```

Compensation reading:

```text
RF_compensation_attempt = service_owned_recovery_delivery_intent
RF_compensation_applied_true = Points_owned_new_credit_when_accepted
RF_compensation_applied_false = duplicate_compensation_replay_no_new_credit
RF_compensation_409 = RF_Points_integration_conflict
RF_recovery_pending = operational_recovery_marker
RF_recovery_resolved = recovery_marker_resolved
```

Forbidden compensation readings:

```text
RF_compensation_attempt != cashback
RF_compensation_attempt != payout
RF_compensation_attempt != settlement
RF_compensation_attempt != generic_correction_engine
RF_economy_recovery_trace != ledger_authority
voucher != cashback
claim != payment
redeem != payout
```

RF recovery rows are operational traces. They are not a generalized financial correction model.

## Projection / Receipt Boundary

Projection surfaces may display delivery-adjacent or ledger-derived information, but they do not become authority.

Current projection surfaces:

- Connect Dashboard.
- Connect Wallet.
- Wallet summary.
- Transaction list.
- Activity feed.
- RF voucher summary / lifecycle panels.
- Quest completion or reward-adjacent screens.
- diagnostics/admin views.

Projection rules:

```text
read_projection = derived_read_view
projection != authority
projection != grant_fact
dashboard != dispute_grade_audit
activity_feed != economic_ledger
wallet_summary != financial_wallet
delivery_status_visibility != receipt
```

Receipt rules:

```text
receipt_requires_backend_backed_economic_authority
receipt_candidate != confirmed_receipt
transaction_history != dispute_grade_receipt_system
quest_reward_outbox != receipt
outbox_delivered != receipt
dashboard != receipt
screenshot != receipt
completion != receipt
```

Safe current reading:

```text
/v1/points/transactions = Points_transaction_read_surface
Connect_Wallet_transaction_list = UI_display_over_Points_rows
RF_voucher_detail = RF_lifecycle_read
Quest_completion_screen = activity_or_UI_surface_only
```

## Event / Source Boundary

Event and source fields are correlation and audit pointers unless a downstream authority creates a fact.

Canonical readings:

```text
event_signal = producer_side_signal_or_correlation_label
sourceEventId = optional_audit_pointer_to_upstream_event_or_record
sourceEventId != event_proof
sourceEventId != receipt
sourceEventId != grant_authority
sourceService = authenticated_service_identity
externalId = Points_idempotency_SSOT_key
```

Quest event/source readings:

```text
Quest_reward_externalId = quest:completed:{progressId}
Quest_reward_sourceEventId = quest.completed:{progressId}
quest.completed = Quest_domain_event_signal
quest.completed != Points_grant
quest.completed != receipt
quest.completed != delivery_success
```

RF event/source readings:

```text
RF_spend_externalId = rf:voucher-claim-spend:{voucherId}
RF_compensation_externalId = rf:voucher-claim-spend-compensation:{voucherId}
RF_externalId = correlation_to_Points_idempotency_key
RF_externalId != payment_receipt
```

## Forbidden Interpretation Transitions

The following interpretation transitions are explicitly forbidden:

```text
delivery_intent => grant_fact
delivery_intent => receipt
delivered => new_credit
delivered => receipt
delivered => payout
duplicate_delivery => second_grant
duplicate_delivery => second_debit
replay => retry_authority
replay => second_grant
requeue => grant_authority
requeue => proof_of_credit
409 => retry_instruction
409 => successful_write
409 => receipt
sourceEventId => proof
sourceEventId => receipt
event => grant
event => delivery_success
event => receipt
projection => delivery_authority
projection => grant_fact
dashboard => payout_proof
dashboard => audit_trail
wallet_summary => spend_guarantee
activity_feed => economic_ledger
RF_compensation => settlement
RF_compensation => payout
RF_compensation => cashback
RF_voucher => cashback
RF_claim => payment
RF_redeem => payout
diagnostics => authority
diagnostics => rollout
tests => rollout
docs => rollout
contract => activation
stable_enough => launch_ready
```

Any future copy, support workflow, test, contract or implementation must preserve these forbidden readings.

## Stable-Enough Delivery Semantics

These semantics are stable enough for later Stage 9 contracts to inherit:

- delivery intent is producer-owned orchestration state;
- grant fact is downstream authority-owned economic fact;
- Quest completion is an activity fact, not a Points grant;
- `quest_reward_outbox` is delivery intent, not grant fact;
- `quest_reward_outbox.pending` means delivery not finished;
- `quest_reward_outbox.failed` means delivery attempt failed;
- `quest_reward_outbox.delivered` means accepted downstream call or accepted duplicate;
- outbox delivered does not guarantee new credit;
- `externalId` remains the Points idempotency SSOT key;
- `sourceEventId` remains an audit pointer, not event proof;
- `applied=true` means a new Points ledger write was created;
- `applied=false` means duplicate/idempotent replay, not a new write;
- `409` means conflict or rejection, not successful grant/debit;
- replay and requeue remain service-owned operations;
- RF economy status remains lifecycle/economy trace;
- RF compensation attempts remain service-owned recovery intent until Points creates a fact;
- projections and receipt candidates remain non-authoritative unless separately defined;
- Slice 16 remains `blocked_not_triggered`.

Stable enough means usable for interpretation. It does not mean implementation-ready, receipt-ready, security-complete, staging-approved, rollout-ready, launch-ready or Slice 16-ready.

## Deferred / Unknown Areas

Deferred or unknown areas:

- no generalized Economic Ledger beyond current Points ledger is defined here;
- no double-entry accounting engine exists;
- no generalized Activity Model is defined here;
- no generalized outbox worker contract is defined here;
- no generalized replay bus exists;
- no event bus exists;
- no distributed transaction engine exists;
- no generic reconciliation workflow is defined here;
- no generic correction, reversal, refund or adjustment model is defined here;
- no generalized receipt service exists;
- no approved dispute-grade receipt UI exists;
- no delivery status UI is defined here;
- no Connect service authority is defined here;
- no Connect OpenAPI contract is defined here;
- no hard spend enforcement expansion is activated here;
- no Quest to Badge runtime exists;
- no Achievement runtime exists;
- no NFT/token/on-chain runtime exists;
- no payout, settlement, cashback or commission runtime exists;
- staging/live evidence remains frozen by governance.

Deferred means not activated, not approved and not converted into a roadmap.

## Stage 9.4 Recommendation

Recommended bounded next slice:

```text
Stage_9_4: Connect Wallet / Dashboard Projection Boundary Contract
```

Reason:

Stage 9.3 separates producer-owned delivery intent from downstream grant facts. The next highest-risk live user-facing surface is not a receipt system yet; it is Connect Wallet / Dashboard / ActivityFeed projection language over Points reads, wallet buckets, recent transactions, badges and RF voucher summaries. Before receipt-specific work, Stage 9 should lock the projection boundary for those visible surfaces.

Stage 9.4 must remain docs-first and must not implement wallet redesign, receipt service, receipt UI, support tooling, reconciliation, payout, NFT/token/on-chain behavior, rollout or Slice 16 movement.

## Acceptance Criteria

This contract is accepted if:

- delivery intent semantics are explicit;
- grant fact semantics are explicit;
- delivered semantics are explicit;
- replay and requeue semantics are explicit;
- duplicate replay and conflict semantics remain separated;
- RF compensation semantics are explicit;
- projection and receipt boundaries are explicit;
- event/source correlation boundaries are explicit;
- forbidden transitions are explicit;
- stable-enough delivery semantics are explicit;
- deferred and unknown areas are explicit and not converted into roadmap;
- no implementation is added;
- no new runtime semantics are invented;
- no governance recursion is introduced;
- no rollout approval is implied;
- Slice 16 remains `blocked_not_triggered`.

## Final Status

```text
stage_9_3_status: docs_first_outbox_delivery_intent_vs_grant_fact_contract_reviewed

delivery_intent_boundary_defined: true
grant_fact_boundary_defined: true
delivered_semantics_defined: true
replay_requeue_boundary_defined: true
duplicate_replay_no_second_write_defined: true
conflict_409_boundary_defined: true
RF_compensation_boundary_defined: true
projection_receipt_boundary_defined: true
event_source_boundary_defined: true
forbidden_transitions_explicit: true
stable_enough_delivery_semantics_explicit: true
deferred_unknown_areas_explicit: true

Quest_reward_outbox_is_delivery_intent: true
quest_reward_outbox_pending_is_delivery_not_finished: true
quest_reward_outbox_failed_is_delivery_attempt_failed: true
quest_reward_outbox_delivered_is_not_guaranteed_credit: true
quest_reward_outbox_delivered_is_not_receipt: true
Points_applied_true_is_grant_fact: true
Points_applied_false_is_duplicate_replay_not_new_grant: true
sourceEventId_is_audit_pointer_not_proof: true
RF_compensation_attempt_is_not_cashback: true
RF_compensation_attempt_is_not_payout: true
RF_recovery_trace_is_not_ledger_authority: true

generalized_outbox_worker_exists: false
generalized_replay_bus_exists: false
event_bus_exists: false
distributed_transaction_engine_exists: false
reconciliation_service_exists: false
receipt_service_exists: false
payout_settlement_cashback_runtime_exists: false
NFT_token_on_chain_runtime_exists: false

new_outbox_runtime: false
new_event_bus_design: false
new_retry_worker: false
new_reconciliation_engine: false
new_receipt_service: false
new_runtime_semantics: false
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

recommended_stage_9_4_bounded_slice: Connect_Wallet_Dashboard_Projection_Boundary_Contract
slice_16_status: blocked_not_triggered
```

## Final Verdict

Stage 9.3 confirms the outbox / delivery intent boundary:

```text
delivery intent is producer-owned orchestration state.
grant fact is downstream authority-owned economic fact.
Quest reward outbox is delivery intent, not grant fact.
outbox delivered means accepted downstream call or accepted duplicate.
outbox delivered does not guarantee new credit.
replay and requeue are service-owned operations, not user retry authority.
RF compensation attempts are recovery intent until Points creates a fact.
events and source fields are correlation/audit pointers, not proof.
projections and receipt candidates are not confirmed receipts.
```

This contract is accepted as a docs-first outbox/delivery interpretation boundary only. It does not implement outbox workers, event bus, retry orchestration, distributed transactions, reconciliation, receipt service, payout/settlement/cashback, reward activation, Points enforcement, Quest to Badge handoff, NFT/token/on-chain behavior, staging/live evidence collection, rollout approval or Slice 16 movement.
