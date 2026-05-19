# Stage 9 Economic Ledger / Activity Model Baseline Audit v1

Date: 2026-05-19
Status: `DOCS_FIRST_ECONOMIC_LEDGER_ACTIVITY_MODEL_BASELINE_AUDIT_REVIEWED`
Stage: `Stage 9.0 / Economic Ledger Activity Model Baseline Audit`
Mode: read-only baseline audit, docs-first, no implementation, no runtime changes, no API change, no OpenAPI change, no SDK change, no schema change, no migrations, no tests added, no test execution as evidence, no staging/live evidence collection, no rollout, no reward activation, no Points enforcement activation, no Quest to Badge activation, no Achievement runtime activation, no NFT/token/on-chain activation, no payout/settlement/cashback activation, no Stage 9 roadmap, no Slice 16 movement

## Purpose

This document establishes the current factual baseline for the Economic Ledger / Activity Model domain before any Stage 9 architecture or implementation work.

It answers:

```text
what_ledger_facts_already_exist
what_activity_or_event_facts_already_exist
what_is_projection_or_read_model
what_is_outbox_or_delivery_intent
what_is_local_mock_or_UI_only
where_activity_event_projection_may_be_mistaken_for_ledger_authority
```

Stage 9.0 is a mapping pass only. It does not design a new Economic Ledger or Activity Model.

## Non-goals

This audit does not:

- implement Economic Ledger;
- design Activity Model runtime;
- redesign Points, RF, Quest, Badge, Connect or Wallet;
- change backend code;
- change frontend code;
- change API, OpenAPI, SDK or generated clients;
- change schema or add migrations;
- add tests;
- execute tests as validation evidence;
- collect staging/live evidence;
- activate rewards or Points enforcement;
- activate Quest to Badge handoff;
- activate Achievement runtime;
- activate NFT, token, G2A, wallet, bridge, on-chain or marketplace behavior;
- create payout, settlement, cashback, commission or financial obligation semantics;
- create a Stage 9 roadmap;
- approve rollout;
- move Slice 16.

## Stage 8 Inherited Constraints

Stage 9.0 inherits the Stage 8.8 closure verdict:

```text
stage_8_stop_condition_reached: true
stage_8_should_not_continue: true
stage_9_architectural_entry_ready: true
stage_9_scope: Economic_Ledger_Activity_Model
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

Stage 9 must not reopen Stage 8 unless a new factual runtime breakage appears.

## Inputs Reviewed

Primary documents:

- `docs/architecture/domain/stage_8_progression_authority_closure_review_and_stage_9_readiness_v1.md`
- `docs/architecture/domain/stage_8_quest_completion_vs_reward_delivery_separation_contract_v1.md`
- `docs/architecture/domain/stage_8_quest_badge_authority_boundary_contract_v1.md`
- `docs/architecture/domain/stage_8_badge_achievement_projection_boundary_contract_v1.md`
- `docs/architecture/domain/stage_8_quest_badge_handoff_boundary_contract_v1.md`
- `docs/runtime/stage_7_2_governance_freeze_closure_v1.md`
- `docs/architecture/domain/stage_7_rf_rielt_closure_review_and_stage_8_readiness_v1.md`
- `docs/economy/points_policy_v1.md`
- `docs/economy/referral_network_rewards_policy_v1.md`
- `docs/economy/economy_authority_terminology_crosswalk_v1.md`
- `docs/economy/quest_badge_achievement_compatibility_v1.md`

Primary contracts/runtime inputs:

- `docs/openapi/points.yaml`
- `docs/openapi/quest.yaml`
- `docs/openapi/rf.yaml`
- no `docs/openapi/connect*.yaml` file was present
- `packages/db/src/schema/**`
- `apps/points-service/**`
- `apps/quest-service/**`
- `apps/rf-service/**`
- `apps/api-gateway/**`
- no `apps/connect-service/**` directory was present
- `apps/go2asia-pwa-shell/components/connect/**`
- `apps/go2asia-pwa-shell/components/quest/**`
- relevant Points, Quest, RF, API gateway and frontend tests for local confidence only

Repository keyword searches covered ledger, transactions, balances, wallet, activity, events, outbox, receipt, grant, spend, idempotency, RF voucher, claim, redeem, payout, cashback, settlement, token, NFT, localStorage and mock surfaces.

Multi-agent roles were activated for read-only review: architect, analyst, backend, frontend, tester, security and technical writer. Their role is advisory synthesis only; this artifact remains the accepted baseline source for Stage 9.0.

## Current Ledger Map

| Table / surface | Owner | Current authority type | Fact class | Status |
|---|---|---|---|---|
| `points_transactions` | Points Service | Ledger write / transaction history | `economic_fact` for internal Points delta | Active current runtime |
| `user_balances` | Points Service | Materialized balance storage | ledger-derived balance state | Active current runtime |
| `/internal/points/add` | Points Service | Internal idempotent credit endpoint | economic write when `applied=true` | Active current runtime |
| `/internal/points/spend` | Points Service | Internal idempotent debit endpoint | economic write when `applied=true` | Active current runtime |
| `/v1/points/transactions` | Points Service | User-facing read over ledger rows | ledger read projection | Active read endpoint |
| `/v1/points/balance` | Points Service | User-facing read over `user_balances` | balance read projection | Active read endpoint |
| `/v1/wallet/summary` | Points Service | Bucket projection over ledger rows | projection/read model | Active read endpoint |
| `/v1/points/connect-dashboard` | Points Service | Convenience dashboard composition | projection/read model | Active read endpoint |
| `quest_reward_outbox` | Quest Service | Delivery intent and retry state for Points grants | `delivery_intent`, not grant fact | Active current runtime |
| `rf_voucher.points_debit_external_id` | RF Service | Pointer to Points debit external id | economic trace pointer, not ledger row | Active current runtime |
| `rf_voucher.economy_status` | RF Service | Voucher economy processing snapshot | lifecycle/economy trace, not ledger authority | Active current runtime |
| `rf_voucher_economy_recovery` | RF Service | Recovery marker for failed claim/debit finalization | operational recovery trace | Active current runtime |
| `rf_voucher_redemption` | RF Service | Voucher redemption audit/history | lifecycle/activity fact | Active current runtime |

Current economic authority is concentrated in Points Service. RF and Quest can hold economic traces or delivery intent, but they do not own Points ledger truth.

## Current Activity / Event Map

| Table / surface | Owner | Fact class | Projection / SSOT reading | Status |
|---|---|---|---|---|
| `quest_progress` | Quest Service | `activity_fact` / completion lifecycle | Quest progress SSOT | Active |
| `quest_submission` | Quest Service | proof submission / review activity fact | Quest submission SSOT, not economic proof | Active |
| Quest domain events in `apps/quest-service/src/events/contracts.ts` | Quest Service | event-only payload contract | emitted/logged via noop publisher, not persisted event table | Active code surface |
| `space_post` | Space Service | publication activity fact | content/social SSOT | Active schema |
| `reactions` | Reactions Service | user reaction activity fact | reaction SSOT | Active schema |
| `reaction_aggregates` | Reactions Service | aggregate projection | projection/read model | Active schema |
| `space_activity_projection` | Space Service | activity projection | projection over `space` / `reactions` streams | Active schema |
| `referral_relations` | Referral Service | referral graph / activation fact | referral SSOT | Active schema |
| `event_registrations` in content schema | Content/Pulse area | event participation fact | activity fact, not ledger proof by itself | Active schema |
| `organizer_trip*` tables | Organizer area | planning/activity facts | trip planning SSOT | Active schema |
| `rielt_listing_inquiry` | Rielt area | inquiry activity fact | listing/inquiry lifecycle, not payment | Active schema |
| gateway request context / identity shadow diagnostics | API Gateway | diagnostic/observability fact | diagnostics, not authority | Active code surface |

There is no single generalized activity ledger table. Activity facts are domain-owned and scattered across Quest, Space, Reactions, Referral, RF, Rielt, Organizer and Content/Pulse schemas. Some projection tables already exist, but projections are not economic authority.

## Points Ledger Audit

Points owns the current internal off-chain ledger.

Confirmed runtime facts:

- `points_transactions` stores signed deltas through `amount`.
- `user_balances` stores materialized current balance by user.
- `external_id` is unique and is the Points idempotency SSOT.
- `source_service` is derived from authenticated service JWT for internal writes.
- `source_event_id` is an optional audit pointer to upstream domain events or records.
- `/internal/points/add` stores positive ledger rows and updates `user_balances`.
- `/internal/points/spend` stores negative ledger rows and updates `user_balances` when available balance permits.
- `applied=true` means a new ledger write was created.
- `applied=false` means an accepted duplicate/idempotent replay, not a new grant or debit.
- 409 on mismatched replay is an integration conflict, not frontend retry authority.

Read model / projection facts:

- `/v1/points/transactions` is a read over ledger rows.
- `/v1/points/connect-dashboard` composes balance, recent ledger transactions, referral summary and badge projection.
- `/v1/wallet/summary` computes bucket projections from ledger rows: available, locked, network and estimated unlockable.
- `estimatedUnlockablePoints` currently equals `lockedPoints`; it is explicitly projection-like and not a spend guarantee.
- current spend checks use `user_balances.balance`; a shadow model compares stricter target available-bucket spendability.

Unsupported or not current runtime:

- no explicit reversal/refund/adjustment/correction endpoint was found;
- compensation exists as an action class (`rf_voucher_claim_spend_compensation`) but it is still a Points add transaction, not a generic correction ledger;
- hard enforcement of locked bucket spendability remains incomplete policy target;
- G2A/token/NFT/on-chain actions are intentionally excluded.

Required readings:

```text
Points_ledger_fact != activity_event
balance_projection != activity_log
wallet_bucket_projection != spend_authority_by_itself
applied_false != new_grant
409_conflict != frontend_retry_instruction
```

## Quest / Points Delivery Audit

Quest owns completion and reward delivery intent. Points owns grant facts.

Current runtime:

- `quest_progress.status = completed` is a Quest-owned activity/completion fact.
- `quest_submission` stores submitted proof material and review outcomes for Quest lifecycle.
- `quest.completed` is a Quest domain event payload, not ledger proof.
- `quest_reward_outbox` is created for configured Points rewards.
- Quest builds deterministic Points payloads with:
  - `action = quest_completed`;
  - `externalId = quest:completed:{progressId}`;
  - `sourceEventId = quest.completed:{progressId}`.
- Quest calls `/internal/points/add` for Points grants.
- Quest does not call `/internal/points/badges/award`.

Outbox readings:

```text
quest_reward_outbox.pending = delivery_not_finished
quest_reward_outbox.failed = delivery_attempt_failed
quest_reward_outbox.delivered = Points_call_accepted
quest_reward_outbox.delivered != guaranteed_new_credit
```

The outbox is not a receipt. If Points accepts a duplicate and returns `applied=false`, outbox delivery can be true while no new credit was created.

## Badge / Achievement Recognition Audit

Recognition is separate from Points ledger facts.

Current backend-backed badge facts:

- `badges` is the Points-owned off-chain badge catalog.
- `user_badges` is the Points-owned off-chain user badge award fact.
- `/internal/points/badges/award` writes `user_badges` only.
- Badge award requires `badgeCode`, `sourceType` and `sourceId`; `sourceService` is derived from service JWT.
- Existing legacy badge awards with null source are treated as duplicates.
- `applied=false` means an existing award was returned.
- Badge awards do not create `points_transactions` and do not mutate `user_balances`.

Projection surfaces:

- `/v1/points/badges` projects active badge definitions.
- `/v1/points/badges/mine` projects current user's badge award reads.
- `/v1/points/connect-dashboard` projects badge totals and recent badges.
- Connect Levels derives `isEarned` from `user_badges` reads.

Achievement and NFT readings:

```text
achievement = semantic_or_UI_vocabulary_for_now
achievement != runtime_authority
badge_award != Points_grant
badge_ownership != payout
badge_ownership != entitlement
badge_ownership != NFT
NFT_label != minted_asset
```

## RF / Voucher Economic Trace Audit

RF owns voucher lifecycle. Points owns Points spend/debit facts.

Current RF lifecycle facts:

- `rf_partner`, `rf_partner_item`, `rf_offer`, `rielt_listing_rf_offer`, `rf_voucher`, `rf_claim_idempotency`, `rf_voucher_scope_consumption_guard`, `rf_voucher_redemption`, `rf_voucher_economy_recovery`, and `rf_pro_link` exist.
- `rf_voucher.status` remains legacy runtime status: `claimed`, `redeemed`, `cancelled`.
- `rf_voucher.canonical_status` is the preferred lifecycle semantic field.
- `rf_voucher.claim_scope` separates partner-scoped and listing-scoped vouchers.
- `rf_voucher.points_cost_snapshot` records the claim-time Points cost.
- `rf_voucher.points_debit_external_id` points to the deterministic Points debit id for paid voucher claims.
- `rf_voucher.economy_status` records `not_required`, `pending`, `debited`, or `debit_failed`.
- `rf_voucher_redemption` records redemption attempts and successful redemption uniqueness.
- `rf_voucher_economy_recovery` records compensation/recovery markers.

Current RF to Points coupling:

- paid voucher spend is behind `RF_ENABLE_PAID_VOUCHER_SPEND`;
- RF calls `/internal/points/spend` with action `rf_voucher_claim_spend`;
- deterministic spend external id is `rf:voucher-claim-spend:{voucherId}`;
- compensation can call `/internal/points/add` with action `rf_voucher_claim_spend_compensation`;
- insufficient balance and spend idempotency conflicts are surfaced as RF conflicts.

Required readings:

```text
voucher != cashback
claim != payment
redeem != payout
RF_lifecycle_fact != Points_ledger_transaction
RF_economy_status != ledger_authority
RF_projection != economic_authority
```

## Connect / Dashboard / Wallet Projection Audit

There is no standalone Connect Service in the current repo. Connect frontend surfaces consume Points/RF/referral APIs directly or through SDK hooks.

Current backend-backed projection surfaces:

- Connect Dashboard uses `/v1/points/connect-dashboard`.
- Connect Wallet uses `/v1/points/balance`, `/v1/wallet/summary`, and `/v1/points/transactions`.
- Connect Levels uses `/v1/points/badges` and `/v1/points/badges/mine`.
- RF sections use RF voucher summary and RF activity projection helpers.

Current risk controls already present:

- wallet copy says "Read-only история внутренних Points";
- wallet bucket copy says runtime confirms internal availability only at the concrete action;
- `estimatedUnlockablePoints` copy says projection, not ledger truth or spend promise;
- dashboard copy says Points and badges display after backend confirmation;
- RF listing/CTA copy avoids booking/payment confirmation.

Remaining projection risks:

- Dashboard "Ваши Points", "Начислено Points" and "Последние действия с Points" can be overread as full audit/receipt unless Stage 9 proof classes are explicit.
- ActivityFeed displays recent ledger transactions, but as a bounded convenience projection, not dispute-grade audit trail.
- Connect referral summary joins referral relations and selected Points transactions; it is not referral reward authority.
- Wallet total combines buckets and can be mistaken for spendable balance if copied without qualifiers.

Required readings:

```text
Connect_projection != ledger_authority
dashboard != dispute_grade_audit
activity_feed != economic_ledger
wallet_summary != financial_wallet
```

## Receipt / User-Facing Proof Audit

Backend-backed receipt-like surfaces currently include:

- `/v1/points/transactions` transaction history;
- Connect Wallet transaction list over Points transactions;
- Points balance reads over `user_balances`;
- RF voucher detail/list reads over RF-owned voucher facts;
- internal RF diagnostics for voucher lifecycle/economy trace, admin-only.

Projection-only or non-receipt surfaces include:

- Quest completion screen `/quest/[id]/complete`, isolated by Stage 8.4;
- Quest reward preview and `rewardPoints`;
- Connect Dashboard summary counts;
- Connect Levels badge catalog and derived display;
- Space activity/balance mock surfaces;
- RF listing offer availability and CTA display availability;
- screenshots or share-like UI.

Dangerous wording still requiring careful proof-class interpretation:

- "Начислено Points" on Connect referral/dashboard surfaces;
- "История начислений" in Wallet;
- "Последние действия с Points" in Dashboard;
- "Получено бейджей" in Levels;
- Space mock "Space Points" and mock transactions;
- landing copy "Получен бейдж";
- any future use of "receipt", "earned", "granted", "awarded", "получено", or "начислено" without owner/proof class.

Safe rule:

```text
receipt_requires_backend_backed_economic_authority
```

## Local / Mock / UI-Only Audit

Current local/mock surfaces:

- Stage 8.4 isolated the Quest completion reward screen from `localStorage.getItem`, local Points totals and NFT badge receipt cards.
- Quest components still contain mock reward/NFT metadata and `nftBadges` display paths as preview/presentation.
- Space contains extensive mock data: `mockTransactions`, `mockActivityItems`, `mockDashboardStats`, `mockBadges`, `mockQuests`, `mockVouchers`.
- Space Balance uses mock transactions and mock weekly Points.
- Space NFT uses mock badges and explicitly states NFT/on-chain minting is future-only.
- Connect legacy `NFTTab` and `G2ATab` are deprecated future-only wallet UI surfaces.
- Frontend-only calculations exist for display shaping, pagination aggregation, bucket display and mock filtering.

Required readings:

```text
localStorage != backend_proof
mock != runtime_truth
frontend_calculated_total != ledger_balance
mock_transaction != economic_fact
mock_badge != badge_award
```

## API / OpenAPI / SDK Audit

OpenAPI status:

- `docs/openapi/points.yaml` defines current Points ledger, wallet summary, connect dashboard, badge catalog, user badge reads and internal add/spend/badge award operations.
- `docs/openapi/quest.yaml` defines Quest activity lifecycle, submissions and Quest progress; it does not define badge handoff.
- `docs/openapi/rf.yaml` defines RF voucher lifecycle, listing-scoped claim, redeem, diagnostics and activity summary surfaces.
- no `docs/openapi/connect*.yaml` exists.

SDK / generated surface observations:

- RF SDK/types contain safe comments for `pointsCost`, `availability`, voucher lifecycle, claim/redeem and projection boundaries.
- frontend SDK hooks expose Points transactions, balance, badges, dashboard and RF voucher reads as client projections.

Endpoint authority classification:

| Endpoint class | Mutates economic state | Authority reading |
|---|---:|---|
| `/internal/points/add` | yes | Points credit ledger authority |
| `/internal/points/spend` | yes | Points debit ledger authority |
| `/internal/points/badges/award` | no Points ledger mutation | badge award authority only |
| Quest start/submit/review | no direct Points ledger mutation | Quest activity/completion authority |
| Quest reward replay/requeue internals | indirect delivery attempts | outbox/delivery operation, not receipt |
| RF claim with paid spend enabled | can trigger Points spend | RF lifecycle + Points debit coupling |
| RF redeem | no Points grant/payout | RF lifecycle activity |
| Connect/wallet/dashboard reads | no | projection/read model |

## Test / Evidence Audit

Tests reviewed only as local confidence signals. No tests were executed for this audit.

Coverage found:

- Points request tests cover gateway auth, balance reads, wallet bucket projection, Connect Dashboard reads and route hardening.
- Points idempotency tests cover `externalId` duplicate/conflict semantics for add and spend payloads.
- Points spendability shadow tests cover safe aggregate-only diagnostics and drift classes.
- Quest tests cover Quest lifecycle, submission review, completion, reward outbox and Points delivery interpretation.
- RF request tests cover voucher claim/redeem, diagnostics, entitlement shadows and route hardening.
- RF listing claim tests cover listing-scoped claim, idempotency, `pointsCostSnapshot` and display availability semantics.
- RF merchant voucher activity tests cover owner-scoped activity summary and sensitive field omission.
- API gateway tests cover routing/auth behavior.
- Stage 8.4 frontend guard test covers local reward screen isolation.

Gaps:

- no test proves a generalized Economic Ledger / Activity Model;
- no test proves activity facts cannot be overread as economic facts;
- no test proves Connect Dashboard is not dispute-grade audit;
- no test proves receipt/proof classes across all frontend surfaces;
- no staging/live evidence is approved or collected;
- tests remain local confidence only.

Required reading:

```text
tests != rollout
test_execution_as_evidence: false
```

## Security / Abuse Risk Audit

Dangerous ambiguity risks:

| Risk | Severity | Current source class | Safe reading |
|---|---|---|---|
| Activity feed used as ledger proof | high | Connect/Space activity surfaces | activity/projection only unless backed by Points transaction |
| Dashboard balance used as dispute-grade audit | high | Connect dashboard | convenience projection only |
| Screenshot treated as receipt | high | Wallet/dashboard/Quest/RF UI | screenshot is not backend proof |
| `applied=false` treated as new grant/debit/badge | high | Points and badge idempotency | idempotent replay only |
| `409` treated as user retry guidance | high | Points/RF/Badge conflicts | service-owned integration conflict |
| RF claim/redeem treated as payment/payout | high | RF voucher lifecycle | voucher lifecycle only; Points debit where configured |
| Voucher treated as cashback | high | RF/voucher copy | practical utility, not cashback |
| NFT/token implication | high | legacy/future UI names | future-only, not current runtime |
| Wallet summary treated as financial wallet | high | Connect Wallet | internal Points projection |
| localStorage/mock treated as proof | high | Quest/Space mock surfaces | non-authoritative |
| support/manual adjustment ambiguity | medium | lack of generic correction endpoint | no generic correction authority documented |
| shadow diagnostics treated as authority | medium | Points/RF/Gateway diagnostics | diagnostics only |

Security conclusion:

```text
event != proof
projection != authority
diagnostics != authority
activity_fact != economic_fact
weak_client_or_UI_proof_must_not_trigger_economic_grant
```

## Authority Map

| Domain | Authority owner | Owns | Does not own |
|---|---|---|---|
| Points | Points Service | ledger rows, balances, idempotency, internal add/spend, badge catalog, user badge awards | Quest completion, RF voucher lifecycle, referral graph, payout, NFT |
| Quest | Quest Service | quest definitions, steps, submissions, progress, completion, domain events, reward delivery intent | Points grants, badge awards, reward receipt |
| RF | RF Service | partners, offers, vouchers, claims, redeem, attribution, RF idempotency, RF economy trace | Points ledger rows, payment, payout, cashback |
| Referral | Referral Service | referral codes, relations, tree/activation read model | Points ledger writes except via Points, payout/commission |
| Connect frontend | PWA / client | read-only display and explanation | ledger authority, reward producer, dispute-grade audit |
| Space/Reactions | Space/Reactions services | social activity facts and projections | economic ledger authority |
| API Gateway | API gateway | auth propagation, routing, request context diagnostics | domain/economic facts |

## Dangerous Ambiguity Map

The main Stage 9.0 ambiguity is not absence of tables. The risk is proof-class collapse:

```text
activity_event_or_projection_seen_by_user
  -> interpreted_as_receipt
  -> used_as_support_or_reward_proof
  -> weak_or_duplicate_economic_action
```

Concrete dangerous collapses:

- `quest.completed` event -> Points grant proof;
- `quest_reward_outbox.delivered` -> guaranteed new credit;
- Connect Dashboard balance -> ledger authority;
- Wallet bucket projection -> spendable balance guarantee;
- Space mock transaction -> economic fact;
- RF voucher claim/redeem -> payment/payout/cashback;
- badge award -> Points grant;
- NFT label -> minted asset;
- diagnostics snapshot -> authority or rollout evidence.

## Deferred / Unknown Areas

Deferred or unknown areas for Stage 9 awareness:

- no unified Economic Ledger beyond Points ledger exists;
- no generalized Activity Model table exists;
- no receipt/proof-class contract exists yet;
- no generic correction/reversal/refund/adjustment endpoint exists;
- no user-facing dispute-grade receipt surface is defined;
- no Connect OpenAPI contract exists;
- no Connect service exists;
- hard locked Points spend enforcement remains incomplete target policy;
- VIP entitlement authority is not fully active runtime;
- referral unlock and network accrual producers are not active runtime;
- staging/live evidence remains frozen by Stage 7.2;
- broad mock cleanup remains deferred;
- NFT/token/on-chain/payout/settlement/cashback remain blocked.

Deferred means not activated and not approved. It does not become a Stage 9 roadmap.

## Stage 9.1 Recommendation

Recommended bounded slice:

```text
Stage_9_1: Ledger / Activity Proof-Class Boundary Contract
```

Reason:

The audit shows that Points ledger facts, Quest completion facts, RF voucher lifecycle facts, event payloads, outbox delivery intent, dashboard projections, wallet buckets and local/mock surfaces already coexist. The highest-risk gap is not implementation absence alone; it is that these surfaces need explicit proof-class language before any ledger/activity architecture work.

Stage 9.1 should therefore define proof classes and authority boundaries, not implementation:

```text
economic_fact
activity_fact
event_signal
delivery_intent
read_projection
diagnostic_observation
receipt_candidate
local_mock_UI_only
```

Stage 9.1 must not implement Economic Ledger, Activity Model, receipt UI, corrections, reward activation, payout, NFT/token/on-chain, or rollout.

## Acceptance Criteria

This audit is accepted if:

- current ledger/state tables are mapped;
- Points ledger facts are mapped;
- activity/event facts are mapped;
- projections are separated from authority;
- outbox/delivery intent is separated from grant fact;
- RF/voucher economic traces are classified;
- Connect/wallet/dashboard projection surfaces are classified;
- receipt/proof surfaces are identified;
- local/mock economic surfaces are identified;
- tests/evidence are summarized as local confidence only;
- security/abuse risks are classified;
- no implementation is added;
- no new runtime semantics are invented;
- no governance recursion is introduced;
- no roadmap expansion is introduced;
- no rollout approval is implied;
- Slice 16 remains `blocked_not_triggered`.

## Final Status

```text
stage_9_0_status: docs_first_economic_ledger_activity_model_baseline_audit_reviewed

current_ledger_state_tables_mapped: true
points_ledger_facts_mapped: true
activity_event_facts_mapped: true
projections_separated_from_authority: true
outbox_delivery_intent_separated_from_grant_fact: true
RF_voucher_economic_traces_classified: true
Connect_wallet_dashboard_projection_surfaces_classified: true
receipt_proof_surfaces_identified: true
local_mock_economic_surfaces_identified: true
tests_evidence_summarized: true
security_abuse_risks_classified: true

current_primary_economic_authority: Points_Service
current_primary_ledger_tables: points_transactions,user_balances
current_primary_activity_fact_owners: Quest,RF,Referral,Space,Reactions,Content,Rielt,Organizer
generalized_activity_model_exists: false
generalized_economic_ledger_exists_beyond_Points: false
Connect_service_exists: false
Connect_OpenAPI_exists: false

new_ledger_design: false
new_activity_model_design: false
new_receipt_design: false
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

recommended_stage_9_1_bounded_slice: Ledger_Activity_Proof_Class_Boundary_Contract
slice_16_status: blocked_not_triggered
```

## Final Verdict

Stage 9.0 establishes the current reality before architecture:

```text
Points ledger exists and is current economic authority.
Quest completion exists as activity/completion authority.
Quest reward outbox exists as delivery intent, not grant fact.
RF vouchers exist as lifecycle/economy traces, not ledger authority.
Connect wallet/dashboard/activity surfaces are read projections.
Space mock/local surfaces are non-authoritative.
Events, diagnostics, activity feeds and screenshots are not proof.
```

Stage 9 is ready for a bounded Stage 9.1 proof-class boundary contract. It is not ready for Economic Ledger implementation, Activity Model implementation, receipt UI, reward activation, payout/settlement/cashback, NFT/token/on-chain activation, staging/live evidence collection, rollout approval or Slice 16 movement.
