# Stage 9 Connect Wallet / Dashboard Projection Boundary Contract v1

Date: 2026-05-19
Status: `DOCS_FIRST_CONNECT_WALLET_DASHBOARD_PROJECTION_BOUNDARY_CONTRACT_REVIEWED`
Stage: `Stage 9.4 / Connect Wallet Dashboard Projection Boundary Contract`
Mode: read-only Connect projection boundary contract, docs-first, no implementation, no frontend changes, no backend changes, no runtime changes, no API change, no OpenAPI change, no SDK change, no schema change, no migrations, no tests added, no test execution as evidence, no staging/live evidence collection, no rollout, no Connect redesign, no Wallet redesign, no copy patch, no receipt service, no support tooling, no reward activation, no Points enforcement activation, no Quest to Badge activation, no Achievement runtime activation, no NFT/token/on-chain activation, no payout/settlement/cashback activation, no Stage 9 roadmap, no Slice 16 movement

## Purpose

This contract defines the projection boundary for current Connect Wallet, Dashboard, ActivityFeed, referral, badge/Levels and RF voucher surfaces.

It answers:

```text
what_Connect_surfaces_can_safely_show
what_Wallet_balance_and_bucket_values_can_mean
what_transaction_list_and_activity_feed_can_mean
what_dashboard_referral_badge_RF_summaries_can_mean
which_surfaces_are_receipt_candidates_only
which_current_copy_interpretations_are_risky
which_local_mock_deprecated_surfaces_are_non_authoritative
which_projection_to_authority_transitions_are_forbidden
```

Stage 9.4 is a projection boundary contract for visible Connect surfaces only. It does not redesign Connect, redesign Wallet, implement receipt UI, create support/dispute tooling, activate payout or approve rollout.

## Non-goals

This contract does not:

- implement Connect changes;
- implement Wallet changes;
- redesign Connect, Wallet, Dashboard, ActivityFeed, RF panels, Referrals or Levels;
- patch copy;
- implement receipt service or receipt UI;
- implement transaction detail UI;
- implement support tooling or dispute workflow;
- implement reconciliation, correction, reversal, refund or adjustment runtime;
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

Stage 9.4 inherits Stage 8.8, Stage 9.0, Stage 9.1, Stage 9.2 and Stage 9.3:

```text
stage_8_stop_condition_reached: true
stage_9_architectural_entry_ready: true
stage_9_scope: Economic_Ledger_Activity_Model
stage_9_0_baseline_audit: accepted_for_docs_first_inventory
stage_9_1_proof_class_contract: accepted_for_docs_first_boundary
stage_9_2_points_ledger_authority_idempotency_contract: accepted_for_docs_first_authority_boundary
stage_9_3_outbox_delivery_intent_contract: accepted_for_docs_first_delivery_boundary
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
applied=false != new_transaction
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

Stage 9.4 must preserve these Stage 9.2 and Stage 9.3 readings:

```text
Points_Service = current_Points_ledger_authority
points_transaction_row = economic_fact
user_balances_row = current_materialized_balance_state
externalId = Points_idempotency_SSOT_key
applied=true = new_Points_ledger_write_created
applied=false = accepted_duplicate_or_idempotent_replay
delivery_intent != grant_fact
outbox_delivered != guaranteed_new_credit
projection != receipt
receipt_candidate != confirmed_receipt
```

## Inputs Reviewed

Primary documents:

- `docs/architecture/domain/stage_9_outbox_delivery_intent_vs_grant_fact_contract_v1.md`
- `docs/architecture/domain/stage_9_points_ledger_authority_idempotency_contract_v1.md`
- `docs/architecture/domain/stage_9_ledger_activity_proof_class_boundary_contract_v1.md`
- `docs/architecture/domain/stage_9_economic_ledger_activity_model_baseline_audit_v1.md`
- `docs/architecture/domain/stage_8_progression_authority_closure_review_and_stage_9_readiness_v1.md`
- `docs/runtime/stage_7_2_governance_freeze_closure_v1.md`

Runtime / contract inputs:

- `docs/openapi/points.yaml`
- `docs/openapi/rf.yaml`
- `docs/openapi/quest.yaml`
- `packages/db/src/schema/points.ts`
- `apps/points-service/**`
- `apps/api-gateway/**`
- `apps/go2asia-pwa-shell/components/connect/**`
- `apps/go2asia-pwa-shell/lib/connectRfProjection.ts`
- `apps/go2asia-pwa-shell/components/quest/**`
- `apps/go2asia-pwa-shell/components/space/**`
- relevant local tests for awareness only; no tests were executed

Multi-agent roles were used for read-only review: architect, analyst, frontend, backend, tester, security and technical writer.

## Connect Projection Boundary

Connect is a user-facing projection and explanation layer. It can display Points-backed reads, RF lifecycle projections, referral summaries and badge projections, but it does not own economic authority.

Repository baseline:

```text
runtime_Connect_service_exists: false
runtime_Connect_OpenAPI_exists: false
Connect_Dashboard_source = /v1/points/connect-dashboard
Connect_Wallet_sources = /v1/points/balance,/v1/wallet/summary,/v1/points/transactions
Connect_Levels_sources = /v1/points/badges,/v1/points/badges/mine
Connect_RF_sources = RF voucher summary/list plus PWA projection helpers
```

Current Connect surfaces:

| Surface | Source / owner | Safe reading | Forbidden reading |
|---|---|---|---|
| Connect Dashboard | PWA over Points/RF/referral/badge reads | Convenience read projection for the current user. | Ledger authority, receipt authority, dispute-grade audit, payout proof. |
| Connect Wallet | PWA over Points balance, wallet summary and transactions | UI display over Points-backed reads. | Financial wallet, payout account, mutation authority, receipt system. |
| Connect ActivityFeed | PWA over recent dashboard transactions | Bounded recent activity display. | Complete economic ledger, account statement, receipt feed. |
| Connect Levels / Badges | PWA over badge catalog and `user_badges` | Off-chain badge projection. | Points grant, entitlement, payout, NFT ownership. |
| Connect Referrals | PWA over referral and Points summary reads | Referral activity/projection view. | Points grant authority, payout or commission statement. |
| Connect RF panels | PWA over RF voucher reads and RF summary | RF lifecycle projection. | Payment, cashback, settlement, payout, ledger authority. |

Canonical rules:

```text
Connect_projection = bounded_user_facing_read_view
Connect_projection != ledger_authority
Connect_projection != receipt_authority
Connect_projection != economic_fact
Connect_projection != support_dispute_record
Connect_projection != rollout_evidence
```

## Wallet Balance Boundary

Wallet balance display is a read over current Points-backed balance state and summary composition.

Safe readings:

```text
/v1/points/balance = read_over_user_balances
user_balances_row = current_materialized_balance_state
Connect_Wallet_balance = UI_display_over_balance_read
Connect_Dashboard_balance = UI_display_over_balance_read
balance_display != transaction_receipt
balance_display != payout_balance
balance_display != financial_wallet
balance_display != spend_authority_by_itself
```

Copy boundary:

```text
"Ваши Points" = internal_Points_display
"Ваши Points" != cash_balance
"Ваши Points" != payout_balance
"Wallet" != financial_wallet
"Wallet" != external_token_wallet
```

Balance wording must preserve that Points are internal Go2Asia Points, not external money, token balance, settlement asset, bank wallet or on-chain balance.

## Wallet Summary / Bucket Boundary

`/v1/wallet/summary` is a bucket projection over current Points rows and role/context signals. It does not create separate wallet authority and does not override the Points write boundary.

Current bucket readings:

```text
availablePoints = projection
lockedPoints = projection
networkPoints = projection
totalPoints = summary_projection
estimatedUnlockablePoints = estimate_projection
wallet_summary = bucket_projection
wallet_summary != ledger_authority
wallet_summary != spend_guarantee
wallet_summary != financial_wallet
wallet_summary != payout_wallet
estimatedUnlockablePoints != promise
```

Current spendability reading:

```text
current_spend_guard = Points_runtime_action_boundary
current_spend_guard_currently_reads_user_balances_balance
bucket_aware_spend_enforcement = not_activated_by_this_contract
availablePoints_display != guaranteed_spendability
lockedPoints_display != debt_or_liability
networkPoints_display != referral_payout
```

Frontend totals:

```text
frontend_total = display_selection_or_fallback
frontend_total != ledger_balance_authority
frontend_bucket_display != independent_calculation_authority
```

## Transaction List / Activity Feed Boundary

Transaction list and ActivityFeed display Points transaction rows or bounded dashboard recent transaction items. They are the strongest current Connect receipt candidates, but they are still not confirmed receipts or dispute-grade audit systems.

Current surfaces:

- `/v1/points/transactions` returns paginated Points transaction rows for the current user.
- Connect Wallet transaction list displays rows transformed for UI categories and filters.
- Connect Dashboard ActivityFeed displays a bounded recent slice from `/v1/points/connect-dashboard`.
- Labels such as "История начислений" and "Последние действия с Points" are presentation labels.

Safe readings:

```text
/v1/points/transactions = Points_transaction_read_surface
Connect_Wallet_transaction_list = UI_display_over_Points_rows
Connect_ActivityFeed = bounded_recent_activity_projection
transaction_amount_sign = Points_credit_or_debit_display
transaction_source_label = display_label_for_sourceService
transaction_action_label = display_label_for_action
transaction_id = Points_transaction_identifier
```

Forbidden readings:

```text
transaction_history != receipt_service
transaction_list != independent_receipt_service
transaction_list != dispute_grade_audit_trail
transaction_id != receipt_id
activity_feed != economic_ledger
activity_feed != grant_authority
activity_feed != full_account_statement
display_label != proof
relative_timestamp != receipt_timestamp_authority
"История начислений" != confirmed_receipt_history
"Последние действия" != full_audit_trail
```

Receipt candidate rule:

```text
Points_transaction_row_may_be_receipt_candidate: true
receipt_candidate != confirmed_receipt
confirmed_receipt_requires_separate_contract: true
```

## Dashboard Boundary

`/v1/points/connect-dashboard` is a bounded convenience composition of balance, recent transactions, referral summary and badge projection. OpenAPI explicitly states it is read-only and does not become source of truth.

Safe readings:

```text
/v1/points/connect-dashboard = read_only_dashboard_composition
dashboard_balance = balance_read_display
dashboard_recentTransactions = limited_recent_Points_rows
dashboard_referrals = referral_summary_projection
dashboard_badges = badge_projection
dashboard_RF = RF_lifecycle_projection_section
dashboard != ledger_authority
dashboard != receipt
dashboard != dispute_grade_audit
dashboard != support_case_record
```

Dashboard totals:

```text
dashboard_totalPoints = display_projection
dashboard_totalEarnedPoints = referral_or_Points_summary_projection
dashboard_totalBadges = badge_projection_count
dashboard_recentTransactions = bounded_recent_slice
dashboard_limited_counts != full_authority
```

Dashboard panels may guide the user to other read surfaces, but they must not imply that the dashboard itself proves grant, payment, payout, cashback, receipt or entitlement.

## Referral Summary Boundary

Referral surfaces are activity/projection surfaces. Referral relation and activation facts are domain-owned activity facts; referral-earned Points only become economic facts when Points creates accepted ledger rows.

Current copy risks include `CONNECT_POINTS_EARNED_LABEL = "Начислено Points"` and referral status labels around pending/missing/rewarded states. This contract classifies those risks without patching copy.

Safe readings:

```text
Referral_relation = activity_fact
Referral_activation = referral_domain_activity_fact
referral_summary = projection
referral_totalEarnedPoints = Points_backed_or_dashboard_summary_projection
referral_status = referral_read_model_status
referral_status != Points_grant
referral_activation != payout
referral_invite != economic_fact
"Начислено Points" = display_label_over_backend_read_context
```

Forbidden readings:

```text
referral_summary != Points_grant_authority
referral_summary != ledger_authority
referral_status != receipt
referral_pending != promised_credit
referral_earned_display != payout_claim
referral_network != financial_network
"Начислено" != confirmed_receipt_without_Points_fact
```

## Badge / Levels Boundary Inside Connect

Badges are off-chain recognition facts. Levels and achievements remain projection/semantic surfaces unless a separate runtime authority is defined.

Safe readings:

```text
badges = off_chain_badge_catalog
user_badges = off_chain_badge_award_fact
Connect_badges = badge_projection
isEarned = derived_from_user_badges_read
"Получено бейджей" = count_of_backend_backed_badge_reads
badge_award != Points_grant
badge_award != balance_mutation
badge_award != payout
badge_award != entitlement
badge_award != NFT_mint
level_progress_runtime = not_activated_by_this_contract
```

Forbidden readings:

```text
badge_projection != Points_grant
badge_visible != receipt
badge_count != reward_proof
badge_award != payout
badge_award != NFT
level_progress != Achievement_runtime_unlock
"Получено" != payout_or_receipt_language
```

Connect may display awarded badges and planned level progress copy only within the projection boundary.

## RF / Voucher Projection Boundary Inside Connect

RF voucher surfaces in Connect are RF lifecycle projections. RF remains the owner of voucher lifecycle facts; Points remains the owner of Points ledger facts.

Safe readings:

```text
RF_voucher = RF_lifecycle_fact
RF_claim = activity_fact
RF_redeem = activity_fact
RF_voucher_summary = RF_projection
Connect_RF_projection = UI_grouping_over_RF_reads
RF_summary_endpoint = preferred_counter_source_when_available
RF_voucher_list = fallback_display_source_for_degraded_projection
RF_timeline = projection_over_RF_voucher_timestamps
"Получено через PRO" = attribution_projection
"Ваучер получен" = RF_lifecycle_display
"Ваучер использован" = RF_lifecycle_display
```

RF economy trace readings:

```text
rf_voucher.pointsDebitExternalId = Points_externalId_pointer
rf_voucher.economyStatus = RF_lifecycle_economy_trace
RF_compensation_attempt = service_owned_recovery_delivery_intent
RF_recovery_trace != ledger_authority
```

Forbidden readings:

```text
RF_projection != ledger_authority
RF_timeline != receipt
RF_voucher != cashback
RF_claim != payment
RF_redeem != payout
RF_projection != settlement
RF_projection != receipt
RF_compensation_attempt != cashback
RF_compensation_attempt != payout
RF_compensation_attempt != generic_correction_engine
"Получено через PRO" != commission_or_payout
```

## Receipt / Proof Boundary

Stage 9.4 does not define confirmed receipts. It classifies current Connect surfaces as projections or receipt candidates where backend authority exists.

Receipt candidate rules:

```text
receipt_requires_backend_backed_economic_authority
receipt_candidate != confirmed_receipt
transaction_history != dispute_grade_receipt_system
Connect_Wallet_transaction_list = receipt_candidate_only_for_Points_rows
Connect_Dashboard != receipt
ActivityFeed != receipt
wallet_balance != receipt
wallet_summary != receipt
referral_summary != receipt
badge_UI != receipt
RF_voucher_detail = RF_lifecycle_read_not_payment_receipt
screenshot != receipt
share_card != proof
UI_display != backend_proof
```

Current strongest Connect-side candidate remains the Points transaction read surface, but only as a backend-backed Points read. A future confirmed receipt/proof interpretation requires a separate contract.

## Copy Risk Boundary

This contract classifies current copy risk. It does not change copy.

High-risk copy classes:

| Copy class | Safe reading | Must not imply |
|---|---|---|
| "Ваши Points" | internal Points display | cash balance, payout, bank wallet, token balance |
| "Wallet" | Connect UI section over Points reads | financial wallet, external wallet, settlement account |
| "Начислено Points" | display label over backend read/projection context | confirmed receipt, payout, guaranteed grant |
| "История начислений" | transaction/activity display label | receipt history, dispute-grade audit |
| "Последние действия с Points" | bounded recent feed | full ledger, all account activity |
| "Получено" | badge or voucher lifecycle display | receipt, payout, NFT mint, cash value |
| "Earned" / "Granted" / "Awarded" if used later | presentation text only within owner boundary | receipt, entitlement, payout, on-chain ownership |
| "Dashboard" / "Activity" | navigation and summary wording | audit trail, source authority |
| G2A/NFT/Bridge labels | future-only inert presentation | active token/on-chain runtime |

Canonical copy guard:

```text
copy_may_explain_projection_scope: true
copy_must_not_create_authority: true
copy_must_not_create_receipt: true
copy_must_not_create_financial_obligation: true
copy_must_not_activate_future_runtime: true
```

## Local / Mock / Deprecated Connect Surfaces

Local, mock and deprecated Connect surfaces have no backend authority.

Current classes:

- Connect mock data.
- mock transactions, balances, levels, achievements and NFTs.
- `WalletMockView` and `DashboardMockView` wrappers that render current views.
- legacy `PointsTab` over local `WalletData`.
- deprecated G2A tab.
- deprecated NFT tab.
- deprecated Bridge modal.
- deprecated referral / mission / analytics cards.
- frontend-only bucket/list/count calculations.
- screenshots and share cards.
- Space mock balance/activity surfaces when they resemble Connect economy UI.
- Quest local reward previews and isolated completion summary.

Safe readings:

```text
local_mock_UI_only = display_or_demo_or_legacy_surface
mock = fixture_or_demo
deprecated_future_surface = inert_explainer
frontend_calculation = presentation_logic
localStorage = browser_state_only
```

Forbidden readings:

```text
mock != runtime_truth
localStorage != backend_proof
frontend_calculated_total != ledger_balance
mock_transaction != economic_fact
mock_badge != badge_award
mock_NFT != minted_asset
deprecated_future_UI != activation
G2A_tab != token_runtime
NFT_tab != on_chain_ownership
BridgeModal != bridge_runtime
screenshot != receipt
share_card != proof
```

## Forbidden Interpretation Transitions

The following transitions are explicitly forbidden:

```text
Connect_projection => ledger_authority
Connect_projection => receipt_authority
dashboard => receipt
dashboard => audit_trail
dashboard => payout_proof
dashboard => source_of_truth
activity_feed => ledger
activity_feed => full_audit_trail
transaction_list => dispute_grade_receipt
transaction_id => receipt_id
wallet_summary => spend_guarantee
wallet_summary => financial_wallet
wallet_bucket => spend_authority
wallet_balance => payout_balance
wallet_balance => cash_balance
"Начислено" => confirmed_receipt
referral_summary => grant_authority
referral_status => receipt
badge_count => reward_proof
badge_award => Points_grant
badge_award => payout
badge_award => NFT_mint
level_progress => Achievement_runtime_unlock
RF_voucher_status => cashback
RF_timeline => payout_proof
RF_projection => ledger_authority
RF_redeem => payout
RF_claim => payment
screenshot => receipt
UI_display => backend_proof
mock_Connect_data => runtime_truth
deprecated_NFT_tab => activation
deprecated_G2A_tab => activation
BridgeModal => bridge_runtime
tests => rollout
docs => rollout
contract => activation
stable_enough => launch_ready
```

Any future copy, support workflow, test, contract or implementation must preserve these forbidden transitions.

## Stable-Enough Projection Semantics

These semantics are stable enough for later Stage 9 contracts to inherit:

- Connect Dashboard is a bounded read projection.
- Connect Wallet is a UI display over Points-backed reads.
- `/v1/points/balance` reads current materialized Points balance.
- `/v1/points/transactions` reads Points transaction rows.
- `/v1/wallet/summary` is a bucket projection, not wallet authority.
- `/v1/points/connect-dashboard` is a convenience composition, not SSOT.
- `availablePoints`, `lockedPoints`, `networkPoints` and `estimatedUnlockablePoints` are projection values.
- ActivityFeed is a bounded recent activity projection, not a full ledger.
- Referral summaries are activity/projection reads, not payout authority.
- Badge/Levels surfaces are off-chain badge projections; level runtime is not activated here.
- RF voucher panels are RF lifecycle projections, not cashback/payment/payout/settlement.
- Receipt candidates remain unconfirmed until a separate receipt/proof contract.
- Local, mock, deprecated G2A/NFT/bridge surfaces are non-authoritative.
- Slice 16 remains `blocked_not_triggered`.

Stable enough means usable for interpretation. It does not mean implementation-ready, receipt-ready, security-complete, staging-approved, rollout-ready, launch-ready or Slice 16-ready.

## Deferred / Unknown Areas

Deferred or unknown areas:

- no generalized Economic Ledger beyond current Points ledger is defined here;
- no generalized Activity Model is defined here;
- no Connect service authority is defined here;
- no Connect OpenAPI contract is defined here;
- no wallet service is defined here;
- no generalized receipt service exists;
- no approved dispute-grade receipt UI exists;
- no transaction receipt UI exists;
- no support dispute workflow is activated;
- no generic reconciliation workflow is defined here;
- no generic correction, reversal, refund or adjustment model is defined here;
- hard locked-bucket spend enforcement remains outside this contract;
- no Quest to Badge runtime exists;
- no Achievement runtime exists;
- no active level progression runtime is defined here;
- no NFT/token/on-chain runtime exists;
- no G2A/bridge runtime exists;
- no payout, settlement, cashback or commission runtime exists;
- broad mock/deprecated UI cleanup remains deferred;
- staging/live evidence remains frozen by governance.

Deferred means not activated, not approved and not converted into a roadmap.

## Stage 9.5 Recommendation

Recommended bounded next slice:

```text
Stage_9_5: RF Voucher Economic Trace vs Ledger Authority Contract
```

Reason:

Stage 9.4 locks the user-facing Connect projection boundary and shows that RF voucher lifecycle, RF timeline labels and RF attribution counters are among the highest-risk projection inputs inside Connect. The next bounded contract should isolate RF voucher lifecycle/economy traces from Points ledger authority before Stage 9 proceeds to receipt/user-facing proof boundaries.

Stage 9.5 must remain docs-first and must not implement RF redesign, payout, cashback, settlement, reconciliation, receipt UI, support tooling, NFT/token/on-chain behavior, rollout or Slice 16 movement.

## Acceptance Criteria

This contract is accepted if:

- Connect projection semantics are explicit;
- Wallet balance semantics are explicit;
- wallet summary and bucket semantics are explicit;
- transaction list and ActivityFeed semantics are explicit;
- Dashboard semantics are explicit;
- referral summary semantics are explicit;
- badge/Levels semantics are explicit;
- RF/voucher projection semantics are explicit;
- receipt/proof boundary is explicit;
- copy risks are classified;
- local/mock/deprecated surfaces are classified as non-authoritative;
- forbidden transitions are explicit;
- stable-enough projection semantics are explicit;
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
stage_9_4_status: docs_first_connect_wallet_dashboard_projection_boundary_contract_reviewed

Connect_projection_boundary_defined: true
wallet_balance_boundary_defined: true
wallet_summary_bucket_boundary_defined: true
transaction_activity_feed_boundary_defined: true
dashboard_boundary_defined: true
referral_summary_boundary_defined: true
badge_levels_boundary_defined: true
RF_voucher_projection_boundary_defined: true
receipt_proof_boundary_defined: true
copy_risk_boundary_defined: true
local_mock_deprecated_boundary_defined: true
forbidden_projection_transitions_explicit: true
stable_enough_projection_semantics_explicit: true
deferred_unknown_areas_explicit: true

Connect_service_exists: false
Connect_OpenAPI_exists: false
Connect_Dashboard_is_projection: true
Connect_Wallet_is_projection: true
wallet_balance_is_not_financial_wallet: true
wallet_balance_is_not_payout_balance: true
wallet_summary_is_bucket_projection: true
wallet_summary_is_not_spend_guarantee: true
availablePoints_is_projection: true
lockedPoints_is_projection: true
networkPoints_is_projection: true
estimatedUnlockablePoints_is_estimate_projection: true
activity_feed_is_bounded_projection: true
transaction_list_is_not_receipt_service: true
dashboard_is_not_receipt: true
dashboard_is_not_audit_trail: true
referral_summary_is_not_grant_authority: true
referral_summary_is_not_payout: true
badge_award_is_not_Points_grant: true
badge_award_is_not_NFT: true
level_runtime_activation: false
RF_voucher_is_not_cashback: true
RF_redeem_is_not_payout: true
G2A_token_runtime_exists: false
NFT_on_chain_runtime_exists: false
bridge_runtime_exists: false

new_wallet_runtime: false
new_Connect_runtime: false
new_receipt_service: false
new_receipt_UI: false
new_support_tooling: false
new_reconciliation_engine: false
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

recommended_stage_9_5_bounded_slice: RF_Voucher_Economic_Trace_vs_Ledger_Authority_Contract
slice_16_status: blocked_not_triggered
```

## Final Verdict

Stage 9.4 confirms the Connect Wallet / Dashboard projection boundary:

```text
Connect Dashboard is a bounded read projection.
Connect Wallet is a UI display over Points-backed reads.
Wallet summary and buckets are projections, not wallet authority.
Transaction list and ActivityFeed are read displays, not receipt systems.
Referral summaries are activity/projection reads, not payout authority.
Badges are off-chain recognition projections, not Points grants or NFTs.
RF voucher panels are RF lifecycle projections, not cashback, payment, payout or settlement.
Local, mock, G2A, NFT and bridge surfaces are non-authoritative or future-only.
Receipt candidates are not confirmed receipts.
```

This contract is accepted as a docs-first projection interpretation boundary only. It does not implement Connect redesign, Wallet redesign, copy patch, receipt service, receipt UI, support tooling, reconciliation, payout/settlement/cashback, reward activation, Points enforcement, Quest to Badge handoff, Achievement runtime, NFT/token/on-chain behavior, staging/live evidence collection, rollout approval or Slice 16 movement.
