# Stage 9 Points Ledger Authority & Idempotency Contract v1

Date: 2026-05-19
Status: `DOCS_FIRST_POINTS_LEDGER_AUTHORITY_IDEMPOTENCY_CONTRACT_REVIEWED`
Stage: `Stage 9.2 / Points Ledger Authority & Idempotency Contract`
Mode: read-only ledger authority and idempotency contract, docs-first, no implementation, no runtime changes, no API change, no OpenAPI change, no SDK change, no schema change, no migrations, no tests added, no test execution as evidence, no staging/live evidence collection, no rollout, no reward activation, no Points enforcement activation, no Quest to Badge activation, no Achievement runtime activation, no NFT/token/on-chain activation, no payout/settlement/cashback activation, no Stage 9 roadmap, no Slice 16 movement

## Purpose

This contract defines current Points ledger authority and idempotency semantics.

It answers:

```text
what_is_current_Points_ledger_authority
which_Points_writes_are_authoritative
how_points_transactions_are_read
how_user_balances_are_read
how_externalId_sourceService_sourceEventId_are_read
how_applied_true_false_are_read
how_duplicate_replay_and_409_conflicts_are_read
which_read_surfaces_are_projections
which_replay_or_projection_assumptions_are_forbidden
```

Stage 9.2 is a bounded authority and idempotency interpretation contract. It does not redesign Points, create double-entry accounting, implement reconciliation, define receipt service, activate payout or approve rollout.

## Non-goals

This contract does not:

- redesign Economic Ledger;
- implement a new ledger;
- implement double-entry accounting;
- implement reconciliation service;
- implement wallet service;
- implement receipt service;
- implement correction, reversal, refund or adjustment runtime;
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

Stage 9.2 inherits Stage 8.8 closure, Stage 9.0 baseline audit and Stage 9.1 proof-class boundary:

```text
stage_8_stop_condition_reached: true
stage_9_architectural_entry_ready: true
stage_9_scope: Economic_Ledger_Activity_Model
stage_9_0_baseline_audit: accepted_for_docs_first_inventory
stage_9_1_proof_class_contract: accepted_for_docs_first_boundary
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
localStorage != backend_proof
mock != runtime_truth
tests != rollout
docs != rollout
contract != activation
stable_enough != launch_ready
```

Stage 9.2 must preserve the Stage 9.1 proof-class reading:

```text
economic_fact = Points-owned ledger fact
activity_fact != economic_fact
delivery_intent != grant_fact
read_projection != authority
diagnostic_observation != authority
receipt_candidate != confirmed_receipt
local_mock_UI_only != backend_proof
```

## Inputs Reviewed

Primary documents:

- `docs/architecture/domain/stage_9_ledger_activity_proof_class_boundary_contract_v1.md`
- `docs/architecture/domain/stage_9_economic_ledger_activity_model_baseline_audit_v1.md`
- `docs/architecture/domain/stage_8_progression_authority_closure_review_and_stage_9_readiness_v1.md`
- `docs/architecture/domain/stage_8_quest_completion_vs_reward_delivery_separation_contract_v1.md`
- `docs/runtime/stage_7_2_governance_freeze_closure_v1.md`
- `docs/economy/points_policy_v1.md`
- `docs/economy/future_ledger_readiness_v1.md`
- `docs/economy/points_taxonomy_v1.md`
- `docs/economy/reward_event_catalog_v1.md`

Runtime / contract inputs:

- `docs/openapi/points.yaml`
- `packages/db/src/schema/points.ts`
- `apps/points-service/**`
- `apps/api-gateway/**`
- Quest reward outbox code paths that call Points
- RF paid voucher spend and compensation code paths that call Points
- relevant local tests for awareness only; no tests were executed

Multi-agent roles were used for read-only review: architect, analyst, backend, tester, security and technical writer, with frontend considered where wallet/dashboard projections are exposed.

## Points Ledger Authority Boundary

Current Points economic authority is owned by Points Service.

Current authority surfaces:

| Surface | Authority class | Safe reading | Forbidden reading |
|---|---|---|---|
| `points_transactions` | Points ledger transaction history | Backend-owned economic fact for a signed internal Points delta. | General activity ledger, financial settlement ledger, receipt service, payout or NFT/on-chain ledger. |
| `user_balances` | Materialized balance state | Current Points balance state updated by accepted Points writes. | Financial wallet, payout wallet, full audit trail, bucket spend authority by itself. |
| `/internal/points/add` | Internal credit write boundary | Service-authenticated positive Points write when accepted as new. | Caller-owned grant fact or user-triggerable retry authority. |
| `/internal/points/spend` | Internal debit write boundary | Service-authenticated negative Points write when accepted as new and balance permits. | Payment debit, payout, settlement, or frontend spend API. |
| `/v1/points/transactions` | Ledger read surface | User-facing read over Points transaction rows. | Independent receipt system or dispute-grade audit trail. |
| `/v1/points/balance` | Balance read surface | User-facing read over `user_balances`. | Transaction receipt or payout claim. |
| `/v1/wallet/summary` | Projection | Ledger-based bucket projection without changing `user_balances`. | Spend guarantee, financial wallet or separate authority. |
| `/v1/points/connect-dashboard` | Projection | Bounded convenience dashboard composition. | Source of truth, grant authority or receipt authority. |

Canonical rules:

```text
Points_Service = current_Points_ledger_authority
points_transaction_row = economic_fact
user_balances_row = current_materialized_balance_state
positive_amount = Points_credit_delta
negative_amount = Points_debit_delta
ledger_read != independent_receipt_service
balance_read != transaction_receipt
wallet_summary != ledger_authority
dashboard != ledger_authority
```

What does not count as authoritative economic fact:

- Quest completion.
- Quest reward outbox row.
- RF voucher lifecycle row.
- RF economy status.
- Connect dashboard summary.
- wallet bucket summary.
- ActivityFeed row detached from Points transaction authority.
- badge catalog entry.
- badge award row as Points ledger mutation.
- event signal or `sourceEventId` alone.
- diagnostic snapshot, test result, screenshot, mock or localStorage state.

## Ledger Write Semantics

Points writes are bounded to internal service-to-service endpoints.

### Add

`/internal/points/add` safe reading:

```text
request_amount >= 1
accepted_as_new => positive_points_transaction_created
accepted_as_new => user_balances_incremented
sourceService = authenticated_service_JWT_subject
sourceEventId = optional_audit_pointer
externalId = required_Points_idempotency_key
```

Current runtime note:

OpenAPI describes integer amounts. The current add handler validates finite numeric amount `>= 1`; it does not add a Stage 9.2 redesign or new integer-enforcement semantics.

### Spend

`/internal/points/spend` safe reading:

```text
request_amount = positive_spend_quantity_integer
ledger_amount = -request_amount
accepted_as_new => negative_points_transaction_created
accepted_as_new => user_balances_decremented
spend_guard = user_balances.balance >= request_amount
```

Insufficient balance:

```text
INSUFFICIENT_POINTS_BALANCE_409 => no_new_ledger_write
INSUFFICIENT_POINTS_BALANCE_409 => no_balance_mutation
INSUFFICIENT_POINTS_BALANCE_409 != pending_debit
```

Mutation ordering / materialization reading:

```text
points_transactions = transaction_history_authority
user_balances = materialized_current_balance_state
accepted_add_or_spend_updates_both_in_current_runtime_SQL_flow
user_balances != separate_financial_wallet
user_balances != payout_account
```

Current non-guarantees:

- no generalized Economic Ledger beyond Points is defined;
- no double-entry accounting is defined;
- no financial settlement ledger is defined;
- no receipt service is defined;
- no generic correction/reversal/refund/adjustment runtime is defined;
- no hard locked-bucket spend enforcement is activated by this contract.

## Idempotency Boundary

`externalId` is the current Points idempotency SSOT key.

Database / runtime reading:

```text
points_transactions.external_id = unique
externalId_required_for_internal_add: true
externalId_required_for_internal_spend: true
externalId_unique_scope = Points_Service_transactions
externalId != cross_platform_global_business_id
```

Current idempotency decision:

```text
no_existing_transaction_for_externalId => proceed
same_externalId_same_core_write => duplicate_replay
same_externalId_different_core_write => conflict
```

Core write identity includes:

- user id;
- signed ledger amount;
- action/reason;
- authenticated `sourceService` when both sides are present;
- `sourceEventId` when both sides are present;
- non-empty metadata object when both sides are present.

`sourceService` reading:

```text
sourceService = authenticated_service_identity
sourceService != caller_body_authority
sourceService != user_identity
```

`sourceEventId` reading:

```text
sourceEventId = optional_audit_pointer_to_upstream_event_or_record
sourceEventId != event_proof
sourceEventId != receipt
sourceEventId != grant_authority
```

`applied=true` reading:

```text
applied=true = new_Points_ledger_write_created
applied=true = balance_mutation_applied
applied=true != receipt_service
applied=true != rollout_evidence
```

`applied=false` reading:

```text
applied=false = accepted_duplicate_or_idempotent_replay
applied=false = no_new_ledger_write
applied=false = no_second_balance_delta
applied=false != new_transaction
applied=false != new_credit
applied=false != new_debit
applied=false != new_reward
applied=false != payout
```

`idempotentReplay=true` reading:

```text
idempotentReplay=true = spend_replay_same_externalId_same_payload
idempotentReplay=true != permission_to_retry_with_changed_payload
idempotentReplay=true != second_spend
```

Add duplicate note:

Current add duplicate returns `applied=false` and the prior transaction reference/balance. It does not need to expose `idempotentReplay=true` to preserve the same semantic boundary: duplicate add is not a new credit.

## Replay / Conflict Boundary

Replay and conflict must remain distinct.

Duplicate replay:

```text
duplicate_replay = accepted_noop_over_existing_matching_ledger_write
duplicate_replay_returns_existing_transaction_reference
duplicate_replay_does_not_create_second_points_transactions_row
duplicate_replay_does_not_apply_second_user_balances_delta
duplicate_replay != second_grant
duplicate_replay != second_debit
```

Conflict:

```text
409 = rejected_write_or_integration_conflict
REPLAY_PAYLOAD_MISMATCH = same_externalId_with_non_matching_payload
Conflict = service_owned_integration_problem
409 != successful_write
409 != frontend_retry_instruction
409 != user_retry_authority
409 != receipt
```

Retry authority:

```text
service_owned_retry_only: true
frontend_retry_of_internal_write: forbidden
client_retry_does_not_authorize_grant: true
support_manual_retry_requires_separate_authority: true
```

Quest outbox delivery reading:

```text
quest_reward_outbox.delivered = Points_call_accepted_or_duplicate_accepted
quest_reward_outbox.delivered != guaranteed_new_credit
quest_reward_outbox.delivered != receipt
```

RF spend replay reading:

```text
RF_spend_idempotent_replay = Points_duplicate_spend_accepted
RF_spend_idempotent_replay != second_debit
RF_spend_conflict_409 = RF_Points_integration_conflict
```

## Projection / Wallet Boundary

Wallet and dashboard reads are projections or read surfaces. They do not mutate ledger authority.

Current projection surfaces:

| Surface | Safe reading | Forbidden reading |
|---|---|---|
| `/v1/points/transactions` | Paginated read over ledger transaction rows. | Complete receipt system or external audit trail. |
| `/v1/points/balance` | Read over current materialized balance. | Payout wallet or transaction receipt. |
| `/v1/wallet/summary` | Bucket projection over ledger rows. | Spend guarantee or separate wallet authority. |
| `/v1/points/connect-dashboard` | Read-only composition of balance, recent transactions, referrals and badges. | Source of truth or dispute-grade audit. |
| Connect Wallet | UI display over Points reads. | Mutation authority or receipt authority. |
| Connect Dashboard / ActivityFeed | Convenience display over backend reads. | Ledger authority, grant authority or full audit trail. |

Bucket reading:

```text
availablePoints = projection
lockedPoints = projection
networkPoints = projection
estimatedUnlockablePoints = estimate_projection
wallet_summary != spend_guarantee
wallet_summary != financial_wallet
```

Current spend enforcement reading:

```text
current_spend_guard = user_balances.balance
bucket_aware_spend_enforcement = not_activated_by_this_contract
spendability_shadow = diagnostic_observation
```

## Badge vs Ledger Boundary

Points Service owns badge catalog and badge awards, but badge authority is not Points ledger authority.

Current badge surfaces:

- `badges` stores off-chain badge definitions.
- `user_badges` stores user badge award facts.
- `/internal/points/badges/award` awards off-chain badges.
- badge award responses can return `applied=true` or `applied=false`.

Canonical rules:

```text
badge_catalog_entry != ledger_transaction
user_badges_row != points_transaction_row
badge_award != Points_grant
badge_award != balance_mutation
badge_award_applied=false != new_badge
badge_award != payout
badge_award != entitlement
badge_award != NFT_mint
```

The fact that Points Service owns both Points ledger and badge awards does not merge their proof classes.

## RF / Quest Coupling Boundary

Quest and RF may request Points writes through current internal Points boundaries. Points decides ledger fact.

Quest coupling:

```text
Quest_completion = activity_fact
quest_reward_outbox = delivery_intent
Quest_reward_externalId = quest:completed:{progressId}
Quest_reward_sourceEventId = quest.completed:{progressId}
Quest_may_request_Points_add = true
Points_decides_ledger_fact = true
Quest_completion != Points_grant
quest_reward_outbox != grant_fact
outbox_delivered != guaranteed_new_credit
```

RF coupling:

```text
RF_claim = activity_fact
RF_redeem = activity_fact
RF_paid_voucher_spend_externalId = rf:voucher-claim-spend:{voucherId}
RF_compensation_externalId = rf:voucher-claim-spend-compensation:{voucherId}
RF_may_request_Points_spend_or_compensation_add = true
Points_decides_ledger_fact = true
rf_voucher.pointsDebitExternalId = Points_externalId_pointer
rf_voucher.economyStatus = RF_lifecycle_economy_trace
RF_economy_trace != ledger_authority
RF_claim != payment
RF_redeem != payout
voucher != cashback
```

Coupling non-guarantees:

- Quest and RF calls do not create ledger facts until Points accepts a new write.
- RF economy status does not replace Points transactions.
- Quest delivery state does not replace Points transactions.
- `sourceEventId` does not prove the upstream event as economic authority.

## Diagnostic / Observability Boundary

Diagnostics are observations only.

Current diagnostic surfaces:

- Points spendability shadow diagnostics.
- Points spendability durable export logs.
- RF entitlement and voucher/economy diagnostics.
- API Gateway identity/request context diagnostics.
- structured logs.
- local tests and config tests.

Canonical rules:

```text
diagnostic_observation = operational_debug_or_drift_signal
shadow = compare_only
diagnostic_snapshot = support_context
logs != ledger
diagnostics != authority
diagnostics != rollout_evidence
shadow != enforcement
tests != rollout
docs != rollout
contract != activation
```

## Forbidden Ledger Interpretations

The following interpretations are explicitly forbidden:

```text
projection => ledger_authority
dashboard => audit_trail
dashboard => receipt
activity_feed => ledger_authority
wallet_bucket => spend_guarantee
wallet_summary => financial_wallet
applied=false => new_credit
applied=false => new_debit
applied=false => new_transaction
duplicate_replay => second_grant
duplicate_replay => second_debit
outbox_delivered => guaranteed_credit
outbox_delivered => receipt
sourceEventId => proof
sourceEventId => receipt
409 => user_retry_instruction
409 => successful_write
screenshot => receipt
badge_award => Points_grant
badge_award => balance_mutation
RF_voucher => cashback
RF_redeem => payout
RF_claim => payment
diagnostics => authority
diagnostics => rollout_evidence
tests => rollout
docs => rollout
contract => activation
stable_enough => launch_ready
```

Any future copy, support workflow, test, contract or implementation must preserve these forbidden readings.

## Stable-Enough Ledger Semantics

These semantics are stable enough for later Stage 9 contracts to inherit:

- Points Service is current Points ledger authority.
- `points_transactions` is the current Points transaction fact table.
- `user_balances` is the current materialized Points balance table.
- `amount > 0` means credit/add and `amount < 0` means debit/spend.
- `externalId` is the current Points idempotency SSOT key.
- `sourceService` is authenticated service identity.
- `sourceEventId` is an audit pointer, not event proof.
- `applied=true` means a new Points ledger write was created.
- `applied=false` means accepted duplicate/idempotent replay, not a new write.
- `409` means conflict or rejection, not successful grant/debit.
- wallet and Connect reads are projections over Points-backed reads.
- badge award remains separate from Points ledger mutation.
- Quest outbox remains delivery intent.
- RF economy status remains lifecycle/economy trace.
- diagnostics remain observations.
- Slice 16 remains `blocked_not_triggered`.

Stable enough means usable for interpretation. It does not mean implementation-ready, receipt-ready, security-complete, staging-approved, rollout-ready, launch-ready or Slice 16-ready.

## Deferred / Unknown Areas

Deferred or unknown areas:

- no generalized Economic Ledger beyond current Points ledger is defined here;
- no double-entry accounting engine exists;
- no generalized Activity Model is defined here;
- no generalized receipt service exists;
- no approved dispute-grade receipt UI exists;
- no generic correction, reversal, refund or adjustment model is defined here;
- no generic reconciliation workflow is defined here;
- no Connect service authority is defined here;
- no Connect OpenAPI contract is defined here;
- no generalized replay bus exists;
- hard locked-bucket spend enforcement remains outside this contract;
- no ledger dispute workflow exists;
- no Quest to Badge runtime exists;
- no Achievement runtime exists;
- no NFT/token/on-chain runtime exists;
- no payout, settlement, cashback or commission runtime exists;
- staging/live evidence remains frozen by governance.

Deferred means not activated, not approved and not converted into a roadmap.

## Stage 9.3 Recommendation

Recommended bounded next slice:

```text
Stage_9_3: Outbox / Delivery Intent vs Grant Fact Contract
```

Reason:

Stage 9.2 establishes the Points ledger authority and idempotency semantics that downstream delivery paths must not overread. The next highest-risk boundary is how Quest outbox delivery, RF economy traces and future delivery states can correlate to Points writes without becoming grant facts, receipt authority or replay authority.

Stage 9.3 must remain docs-first and must not implement outbox workers, event bus, reconciliation, receipt UI, payout, NFT/token/on-chain behavior, rollout or Slice 16 movement.

## Acceptance Criteria

This contract is accepted if:

- Points ledger authority is explicit;
- `points_transactions` semantics are explicit;
- `user_balances` semantics are explicit;
- add and spend write authority is explicit;
- positive and negative amount semantics are explicit;
- materialized balance semantics are explicit;
- `externalId` idempotency semantics are explicit;
- `sourceService` semantics are explicit;
- `sourceEventId` semantics are explicit;
- `applied=true` and `applied=false` semantics are explicit;
- duplicate replay and conflict semantics are explicit;
- wallet/dashboard/transaction read semantics are explicit;
- badge vs ledger semantics are explicit;
- RF and Quest coupling semantics are explicit;
- diagnostics semantics are explicit;
- forbidden ledger interpretations are explicit;
- stable-enough ledger semantics are explicit;
- deferred and unknown areas are explicit and not converted into roadmap;
- no implementation is added;
- no new runtime semantics are invented;
- no governance recursion is introduced;
- no rollout approval is implied;
- Slice 16 remains `blocked_not_triggered`.

## Final Status

```text
stage_9_2_status: docs_first_points_ledger_authority_idempotency_contract_reviewed

Points_Service_current_ledger_authority: true
points_transactions_semantics_explicit: true
user_balances_semantics_explicit: true
add_write_authority_explicit: true
spend_write_authority_explicit: true
positive_negative_amount_semantics_explicit: true
materialized_balance_semantics_explicit: true
externalId_idempotency_SSOT_defined: true
sourceService_authenticated_identity_defined: true
sourceEventId_audit_pointer_defined: true
applied_true_new_write_defined: true
applied_false_duplicate_replay_defined: true
duplicate_replay_no_second_write_defined: true
conflict_409_integration_conflict_defined: true
projection_wallet_boundary_defined: true
badge_vs_ledger_boundary_defined: true
RF_Quest_coupling_boundary_defined: true
diagnostics_observation_boundary_defined: true
forbidden_ledger_interpretations_explicit: true
stable_enough_ledger_semantics_explicit: true
deferred_unknown_areas_explicit: true

generalized_economic_ledger_exists_beyond_Points: false
double_entry_accounting_engine_exists: false
receipt_service_exists: false
reconciliation_service_exists: false
payout_settlement_cashback_runtime_exists: false
NFT_token_on_chain_runtime_exists: false

new_ledger_design: false
new_accounting_engine: false
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

recommended_stage_9_3_bounded_slice: Outbox_Delivery_Intent_vs_Grant_Fact_Contract
slice_16_status: blocked_not_triggered
```

## Final Verdict

Stage 9.2 confirms current Points ledger authority and idempotency semantics:

```text
Points Service owns current ledger authority.
points_transactions are current Points economic facts.
user_balances is current materialized balance state.
externalId is the Points idempotency SSOT key.
applied=true means new ledger write.
applied=false means duplicate/idempotent replay, not new credit/debit.
409 means conflict or rejected write, not user retry authority.
wallet/dashboard/activity reads are projections.
Quest and RF may request Points writes; Points decides ledger fact.
diagnostics and tests are not authority or rollout evidence.
```

This contract is accepted as a docs-first authority and idempotency boundary only. It does not implement ledger redesign, accounting, reconciliation, receipt service, payout/settlement/cashback, reward activation, Points enforcement, Quest to Badge handoff, NFT/token/on-chain behavior, staging/live evidence collection, rollout approval or Slice 16 movement.
