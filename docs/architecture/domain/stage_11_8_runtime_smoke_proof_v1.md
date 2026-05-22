# Stage 11.8 — Runtime Smoke Proof

Документ: `stage_11_8_runtime_smoke_proof_v1.md`  
Статус: bounded smoke validation and proof-chain verification under strict governance boundaries  
Дата: 2026-05-22  
Scope: Stage 11.8 of Path A — internal runtime coherence validation for bounded MVP economy  
Mode: validation-only architecture/runtime smoke contract; no public launch; no rollout; no production certification; no schema/API/SDK/UI changes; no Path B

## 0. Orchestration Summary

Task type: bounded runtime smoke validation and proof-chain verification.

Smoke scope: internal-only coherence validation between owner facts, producer enforcement, projections, diagnostics, cutline boundaries and proof chains.

Smoke legitimacy risk: CRITICAL because a successful internal smoke can be misread as production launch, public rollout, marketing claim, scale proof, support receipt, financial audit or MVP release approval.

Execution mode:

```text
runtime_smoke_status: VALIDATION_ONLY
runtime_changes: false
schema_changes: false
api_openapi_changes: false
generated_sdk_type_changes: false
ui_changes: false
Path_B_status: EXCLUDED
Stage_12_status: NOT_STARTED
production_launch_status: NOT_APPROVED
```

Controlling docs:

- `docs/architecture/domain/stage_11_0_scope_and_guardrails_v1.md`
- `docs/architecture/domain/stage_11_1_activity_event_contract_and_feature_flag_naming_v1.md`
- `docs/architecture/domain/stage_11_2_points_ledger_minimal_runtime_and_producer_allowlist_v1.md`
- `docs/architecture/domain/stage_11_3_contribution_record_boundary_and_candidate_model_v1.md`
- `docs/architecture/domain/stage_11_4_badge_progression_minimal_state_v1.md`
- `docs/architecture/domain/stage_11_5_profile_connect_admin_projection_contract_v1.md`
- `docs/architecture/domain/stage_11_6_admin_economy_diagnostics_v1.md`
- `docs/architecture/domain/stage_11_7_mvp_cutline_enforcement_flags_v1.md`
- `docs/architecture/domain/stage_10_11_mvp_economy_cutline_v1.md`
- `docs/architecture/domain/stage_10_12_implementation_readiness_plan_v1.md`
- `docs/roadmaps/stage_10_13_economy_runtime_landing_audit_v1.md`

Read-only runtime inventory checked:

- `apps/points-service/src/producerAllowlist.ts`
- `apps/points-service/src/index.ts`
- `apps/points-service/wrangler.toml`
- `apps/quest-service/src/routes/quests.ts`
- `apps/quest-service/src/services/questService.ts`
- `apps/quest-service/src/db/queries/quest.ts`
- `apps/quest-service/wrangler.toml`
- `apps/rf-service/src/routes/rf.ts`
- `apps/rf-service/src/store.ts`
- `apps/rf-service/wrangler.toml`
- `apps/content-service/src/index.ts`
- `apps/api-gateway/src/index.ts`
- `.env.example`
- `.github/workflows/deploy-workers-staging.yml`
- PWA mock/projection/future-only surfaces under `apps/go2asia-pwa-shell/*`

Multi-agent review passes applied:

| Pass | Role | Result |
|---|---|---|
| Orchestrator | AI Program Director / Orchestrator | Smoke is internal bounded validation, not launch |
| Runtime Governance | Runtime Governance Architect | Owner facts are final authority; projections/diagnostics/mocks rejected as proof |
| Economy | Economy Architect | No hidden producers, social rewards, creator economy, payout, booking, token/NFT or extractive gamification |
| Security / Fraud | Security / Fraud & Abuse Specialist | Screenshot/mock/stale projection/stale diagnostic/idempotency/replay risks covered |
| Architecture | Software Architect | Smoke scenario matrix, proof-chain matrix and unresolved gaps defined |
| Slice Strategist | Slice Strategist | Stage 12, Path B, rollout, scale testing and marketing claims not started |
| Canon Writer | Technical Canon Writer | Stable vocabulary, forbidden vocabulary, pass/fail semantics and verdict frozen |

Implementation permission:

```text
new_runtime_features_allowed: false
new_producers_allowed: false
schema_migrations_allowed: false
openapi_changes_allowed: false
sdk_regeneration_allowed: false
frontend_redesign_allowed: false
token_service_changes_allowed: false
```

## 1. Executive Summary

Stage 11.8 defines Runtime Smoke Proof for Go2Asia as bounded internal runtime coherence validation.

It verifies whether existing Path A runtime can satisfy the governance contracts from Stage 11.0-11.7:

- owner facts terminate proof chains;
- Points producer enforcement works as the economic ingress guard;
- projections remain non-authoritative;
- diagnostics remain internal lookup/navigation;
- cutline boundaries keep mock/demo/projection/diagnostic/Path B out of proof;
- fail-closed doctrine is preserved;
- smoke does not become product readiness.

Core doctrine:

```text
smoke_proof != production_launch
smoke_proof != public_rollout
smoke_proof != marketing_claim
smoke_proof != proof_of_scale
smoke_proof != support_receipt
owner_fact = final_authority
projection != proof
diagnostic_snapshot != proof
mock_data != proof
demo_data != proof
screenshot != proof
Points_row = economic_fact
user_badges_row = badge_award_fact
Quest_outbox = delivery_intent_only
RF_voucher = lifecycle_fact_only
Rielt_inquiry = inquiry_fact_only
Path_B = excluded_from_smoke
token_service_ready != smoke_ready
NFT_placeholder != runtime_feature
wallet_placeholder != financial_wallet
```

Primary verdict:

```text
stage_11_8_status: READY_WITH_EXCLUSIONS_as_bounded_internal_smoke_contract
runtime_smoke_execution_status: NOT_EXECUTED_IN_THIS_DOC_SLICE
runtime_coherence_status: PARTIAL_READY
public_launch_readiness: BLOCKED
stage_11_closure_status: GOVERNANCE_COMPLETE_WITH_RUNTIME_GAPS
```

This document does not claim live staging execution. It defines and validates the smoke proof chains against the existing runtime and identifies which scenarios are ready, ready with exclusions, blocked or future-only.

## 2. Smoke Proof Definition

Runtime Smoke Proof is:

- bounded runtime verification;
- proof-chain validation;
- owner-fact validation;
- projection legitimacy validation;
- diagnostics legitimacy validation;
- producer enforcement validation;
- cutline validation;
- mock quarantine validation.

Runtime Smoke Proof is not:

- large-scale testing;
- production certification;
- financial audit;
- public proof;
- launch announcement;
- KPI validation;
- growth validation;
- monetization validation;
- support receipt;
- customer-facing evidence;
- public MVP release approval.

Smoke proof proves only this:

```text
for bounded internal scenarios,
the runtime chain can be traced from trigger
to owner-service facts
without collapsing into projections, diagnostics, mocks, flags or Path B.
```

Smoke proof does not prove:

```text
production_safety_at_scale
public_mvp_readiness
support_case_closure_readiness
financial_or_booking_correctness
token_or_NFT_readiness
Stage_12_UI_alignment
```

## 3. Smoke Proof Non-Goals

Stage 11.8 does not:

- approve public launch;
- approve production rollout;
- approve marketing claims;
- run scale/load testing;
- create new runtime features;
- create new producers;
- create schema migrations;
- change OpenAPI;
- regenerate SDK/types;
- redesign frontend;
- activate Path B;
- activate token/NFT/G2A/bridge/wallet;
- activate payout/cashback/payment/booking semantics;
- create creator economy;
- create XP/leaderboard/social-score systems;
- use smoke as customer proof.

Forbidden interpretations:

| Misread | Stage 11.8 rule |
|---|---|
| Smoke proof as public launch | `FORBIDDEN` |
| Smoke proof as rollout evidence | `FORBIDDEN` |
| Smoke proof as support receipt | `FORBIDDEN` |
| Smoke proof as financial audit | `FORBIDDEN` |
| Smoke proof as proof of scale | `FORBIDDEN` |
| Smoke proof as marketing claim | `FORBIDDEN` |
| Smoke proof as Path B readiness | `FORBIDDEN` |
| Smoke proof as customer-facing proof | `FORBIDDEN` |

## 4. Smoke Scope

Stage 11.8 smoke scope is intentionally narrow.

### In Scope

| Scenario | Status | Scope rule |
|---|---|---|
| Points producer ingress | `READY_FOR_BOUNDED_SMOKE` | Validate allowlist, caller matrix, internal-beta flags, `externalId`, Points row |
| Quest reward chain | `READY_WITH_EXCLUSIONS` | Quest outbox is delivery intent; proof terminates at Points row |
| RF voucher lifecycle | `READY_WITH_EXCLUSIONS` | RF voucher rows and optional Points spend row; no payout/cashback |
| Badge award | `READY_WITH_EXCLUSIONS` | `user_badges` row only; no NFT/progression engine |
| Projection rejection | `READY_FOR_BOUNDED_SMOKE` | Dashboard/Wallet/ActivityFeed/Profile cannot terminate proof |
| Diagnostics rejection | `READY_FOR_BOUNDED_SMOKE` | Diagnostic snapshot cannot terminate proof |
| Mock/demo rejection | `READY_FOR_BOUNDED_SMOKE` | Mock/demo/screenshot/share-card cannot enter proof chain |
| Path B exclusion | `READY_FOR_BOUNDED_SMOKE` | Token/NFT/G2A/bridge/wallet ignored/excluded |
| Fail-closed negative tests | `READY_FOR_BOUNDED_SMOKE` | Unknown/future/forbidden/internal-beta-off producers reject before DB |

### Out of Scope or Excluded

| Domain | Status | Reason |
|---|---|---|
| Content event registration when DB-less fallback is active | `BLOCKED_FOR_SMOKE` | No persisted `event_registrations` owner row |
| Space/Reactions rewards | `OUT_OF_SCOPE_FOR_STAGE_11` | Social signals only; producers future-only/blocked |
| Contribution runtime | `DEFER_TO_FUTURE_SLICE` | Candidate model only, no runtime |
| Rielt booking/payment proof | `OUT_OF_SCOPE_FOR_STAGE_11` | Inquiry only, not booking/payment |
| Token service / Path B | `OUT_OF_SCOPE_FOR_STAGE_11` | Path B excluded |
| Frontend mock surfaces | `BLOCKED_FOR_SMOKE` | Mock/demo cannot be evidence |
| Unified Admin runtime | `DEFER_TO_FUTURE_SLICE` | Stage 11.6 contract only |

## 5. Smoke Scenario Matrix

| Domain | Smoke scenario | Expected authority | Allowed projection | Forbidden interpretation | Pass/Fail |
|---|---|---|---|---|---|
| Points | Service JWT calls `/internal/points/add` or `/internal/points/spend` with allowlisted action and stable `externalId` | `points_transactions` row | `/v1/points/transactions`, `/v1/wallet/summary`, Connect dashboard as navigation only | Producer flag = grant; wallet = receipt; rejection = final fraud verdict | `READY_FOR_BOUNDED_SMOKE` |
| Quest | Quest completion creates `quest_reward_outbox`, delivery calls Points with `externalId=quest:completed:{progressId}` | Proof terminates at matching `points_transactions` row | Quest UI completion and Connect ActivityFeed as preview only | Outbox delivered = reward receipt; cron replay = public proof | `READY_WITH_EXCLUSIONS` |
| RF | Voucher claim/spend creates RF voucher lifecycle rows and optional Points spend row | `rf_voucher`, redemption/idempotency rows, optional Points spend row | My Vouchers / RF projections as lifecycle preview | Cashback, payout, refund, payment, settlement | `READY_WITH_EXCLUSIONS` |
| Badges | Internal badge award creates/returns `user_badges` row | `user_badges` row plus badge catalog | Connect Levels/Profile badge projection only | Badge = NFT, Quest auto-badge, XP progression | `READY_WITH_EXCLUSIONS` |
| Content/Pulse | Event registration with DB available and persisted `event_registrations` row | `event_registrations` row plus optional Points row | Event detail registered state only | Attendance, payout, registration proof without row | `BLOCKED_FOR_SMOKE` unless persisted row verified |
| Rielt | Listing inquiry creates inquiry fact | `rielt_listing_inquiry` only | Listing/inquiry projection | Booking, payment, reservation proof | `OUT_OF_SCOPE_FOR_STAGE_11` for economy smoke |
| Space/Reactions | Posts/reactions/social activity | Social/activity facts only | Social projection only | Points reward, badge, contribution proof, farming | `OUT_OF_SCOPE_FOR_STAGE_11` |
| Profile/Connect | Projection displays Points/RF/badge/referral summaries | None; must re-resolve owner rows | Projection as lookup/navigation hint | Dashboard receipt, Wallet financial wallet, ActivityFeed audit trail, Profile authority | `READY_FOR_BOUNDED_SMOKE` rejection validation |
| Admin diagnostics | Internal diagnostics locate owner keys | None; must re-resolve owner rows | Diagnostic navigation only | Customer proof, receipt, ledger, accounting dashboard | `READY_FOR_BOUNDED_SMOKE` rejection validation |
| Mock/demo | Connect mockData, Space NFT mocks, Quest NFTBadge preview, Home stats | None | Demo-only quarantined view | Runtime fallback, support proof, smoke evidence | `READY_FOR_BOUNDED_SMOKE` rejection validation |
| Path B | Token service, NFT/G2A/Bridge/wallet custody | None for Path A | None | Smoke-ready token/NFT/on-chain/wallet | `OUT_OF_SCOPE_FOR_STAGE_11` |

## 6. Proof-Chain Validation

Smoke proof chain must terminate at owner-service facts.

Generic proof chain:

```text
trigger
-> owner domain event or lifecycle row
-> producer gate if economic write
-> idempotency key
-> owner fact row
-> optional projection/diagnostic lookup hints
-> proof terminates at owner fact row
```

Allowed proof terminators:

| Proof class | Owner terminator |
|---|---|
| `economic_fact` | `points_transactions` row |
| `badge_award_fact` | `user_badges` row |
| `delivery_intent` | Quest outbox, but not final reward proof |
| `voucher_lifecycle_fact` | RF voucher/redemption/idempotency rows |
| `content_registration_fact` | `event_registrations` row |
| `listing_inquiry_fact` | `rielt_listing_inquiry` row |

Forbidden proof terminators:

| Artifact | Reason |
|---|---|
| Projection | Not authority |
| Diagnostic snapshot | Lookup assistant only |
| Feature flag | Gate/guardrail only |
| Mock/demo row | Not runtime truth |
| Screenshot/share card | User artifact only |
| Quest outbox alone | Delivery intent only |
| Token-service readiness | Path B excluded |

Scenario proof chains:

### Points Producer

```text
producer action
-> Points ingress
-> evaluateProducerGate(action, operation, sourceService, env)
-> externalId idempotency check
-> points_transactions row
-> optional Connect/Wallet projection
-> proof terminates at points_transactions
```

PASS:

- action is classified;
- source service matches caller matrix;
- internal-beta flag is enabled where required;
- `externalId` exists;
- duplicate same payload returns no new grant;
- mismatched replay conflicts;
- final proof is `points_transactions`.

FAIL:

- unknown/future/forbidden producer reaches DB;
- projection/diagnostic/flag closes proof chain;
- missing `externalId` is accepted.

### Quest Reward

```text
quest completion
-> quest_progress / quest_submission
-> quest_reward_outbox
-> Points add action=quest_completed
-> externalId=quest:completed:{progressId}
-> points_transactions row
-> Connect projection
-> proof terminates at points_transactions
```

PASS:

- outbox remains `delivery_intent_only`;
- Points row exists for reward proof;
- replay uses same `externalId` idempotency;
- diagnostics/outbox stats are navigation only.

FAIL:

- outbox status alone is accepted as reward receipt;
- cron replay is treated as public proof;
- local Quest UI totals are used as proof.

### RF Voucher Lifecycle

```text
RF voucher claim/spend
-> rf_voucher lifecycle row
-> claim idempotency binding / redemption rows
-> optional Points spend row with externalId=rf:voucher-claim-spend:{voucherId}
-> optional compensation row
-> RF/Connect projection
-> proof terminates at RF rows and optional Points rows
```

PASS:

- RF voucher is lifecycle fact only;
- optional Points spend row proves internal Points debit only;
- compensation is recovery trace only;
- diagnostics do not become payout report.

FAIL:

- RF path is described as payout/cashback/payment/refund;
- diagnostics snapshot is treated as customer receipt;
- spend flag alone is treated as proof.

### Badge Award

```text
internal badge award
-> service-auth badge award endpoint
-> user_badges row
-> Connect Levels/Profile projection
-> proof terminates at user_badges
```

PASS:

- badge proof is `user_badges`;
- duplicate award returns existing/non-new row;
- badge remains off-chain recognition.

FAIL:

- Quest preview or NFTBadge UI is treated as badge proof;
- badge is described as NFT/token/wallet asset;
- Quest/Space/Contribution auto-badge is assumed active.

## 7. Projection / Diagnostic Rejection Validation

Projection rejection validation:

| Projection | Rejection rule |
|---|---|
| Dashboard | `Dashboard != receipt` |
| Wallet | `Wallet != financial_wallet` |
| ActivityFeed | `ActivityFeed != audit_trail` |
| Profile | `Profile != authority` |
| Connect projection screenshot | `screenshot != proof` |
| Badge projection | `badge_projection != badge_award` |
| RF projection | `RF_projection != payout_report` |
| Rielt projection | `Rielt_projection != booking_proof` |

Diagnostic rejection validation:

| Diagnostic | Rejection rule |
|---|---|
| Admin snapshot | `diagnostic_snapshot != proof` |
| RF voucher diagnostics | Lifecycle lookup only, not payout/cashback receipt |
| Quest outbox stats | Delivery diagnostics only, not reward receipt |
| Points spendability shadow | Observability only, not balance authority |
| Producer rejection diagnostic | Explains attempt only, not fraud verdict |
| Idempotency replay diagnostic | Duplicate/replay context only, not new grant |
| Stale diagnostic | Cannot close proof chain |

PASS condition:

```text
projection_or_diagnostic_can_help_find_owner_fact = true
projection_or_diagnostic_can_terminate_proof = false
```

FAIL condition:

```text
proof_chain_terminates_at_projection_or_diagnostic = true
```

## 8. Mock / Demo / Screenshot Rejection Validation

Mock/demo/screenshot surfaces must be rejected from smoke proof.

| Surface/artifact | Smoke rule |
|---|---|
| Connect `mockData` | Blocked as proof |
| Space balance/NFT/transaction mocks | Blocked as proof |
| Quest `mockQuests` / NFTBadge preview | Blocked as proof |
| Home static stats/rewards | Blocked as proof |
| RF mock dashboards | Blocked as proof |
| Rielt `verifiedBooking` mocks | Blocked as proof |
| `NEXT_PUBLIC_DATA_SOURCE=mock` | Exclude from smoke evidence |
| Screenshots/share cards | Navigation hint only, never proof |

Doctrine:

```text
mock_data != proof
demo_data != proof
screenshot != proof
share_card != proof
mock_data != fallback
```

PASS:

- mock/demo artifacts are excluded or explicitly marked non-proof;
- smoke evidence includes owner IDs and owner rows.

FAIL:

- any smoke proof chain uses mock/demo/screenshot/share-card as terminator;
- mock data is used when runtime flag is missing/off.

## 9. Path B Exclusion Validation

Path B is excluded from Stage 11.8 smoke.

Excluded:

- token-service readiness;
- G2A;
- NFT mint;
- NFT ownership proof;
- on-chain gateway;
- bridge;
- external wallet/custody;
- top-up/withdraw;
- token/NFT proof;
- on-chain receipt.

Validation rules:

```text
Path_B = excluded_from_smoke
token_service_ready != smoke_ready
NFT_placeholder != runtime_feature
wallet_placeholder != financial_wallet
```

PASS:

- token-service health/readiness is ignored for Path A smoke;
- NFT/G2A/Bridge/wallet custody surfaces are excluded;
- badges remain off-chain `user_badges` only.

FAIL:

- any Path B surface enters the smoke proof chain;
- smoke report claims token/NFT/wallet readiness;
- cutline blocker is treated as Path B design approval.

## 10. Fail-Closed Validation

Fail-closed rules to validate:

| Condition | Expected behavior | Smoke status |
|---|---|---|
| Unknown producer | Reject before DB | `READY_FOR_BOUNDED_SMOKE` |
| Future-only producer | Reject before DB | `READY_FOR_BOUNDED_SMOKE` |
| Forbidden producer | Reject before DB | `READY_FOR_BOUNDED_SMOKE` |
| Internal-beta flag missing/off | Reject before DB | `READY_FOR_BOUNDED_SMOKE` |
| Wrong service JWT caller | Reject before DB | `READY_FOR_BOUNDED_SMOKE` |
| Missing `externalId` | Reject | `READY_FOR_BOUNDED_SMOKE` |
| Duplicate same payload | No new grant | `READY_FOR_BOUNDED_SMOKE` |
| Duplicate mismatched payload | Conflict/integration error | `READY_FOR_BOUNDED_SMOKE` |
| Missing projection metadata | Projection cannot be proof | `READY_WITH_EXCLUSIONS` |
| Stale diagnostic | Cannot be proof | `READY_FOR_BOUNDED_SMOKE` |
| Mock fallback | Blocked | `READY_FOR_BOUNDED_SMOKE` |
| Path B readiness | Ignored/excluded | `READY_FOR_BOUNDED_SMOKE` |

Core fail-closed doctrine:

```text
missing_owner_fact = exclude_from_smoke_or_fail
missing_flag = fail_closed
unknown_flag = fail_closed
misconfigured_flag = fail_closed
mock_fallback = blocked
projection_without_owner_trace = blocked_for_proof
diagnostic_without_owner_fact = blocked_for_proof
```

## 11. Producer / Replay / Idempotency Validation

Producer validation:

- `registration`: `ACTIVE`, auth-service only;
- `referral_locked`: `ACTIVE`, referral-service only;
- `first_login`: `INTERNAL_BETA`, auth-service plus flag;
- `quest_completed`: `INTERNAL_BETA`, quest-service plus flag;
- `event_registration`: `INTERNAL_BETA`, content-service plus flag, but blocked for smoke if no persisted registration owner row;
- `rf_voucher_claim_spend`: `INTERNAL_BETA`, rf-service plus flag;
- `rf_voucher_claim_spend_compensation`: `INTERNAL_BETA`, rf-service plus flag;
- `space_*`: `FUTURE_ONLY`, must reject;
- `network_accrual_*` and referral bonus/unlock producers: `FORBIDDEN_FOR_STAGE_11`, must reject.

Replay/idempotency validation:

| Runtime | Idempotency key | Smoke rule |
|---|---|---|
| Points add/spend | `externalId` | Same payload no-op; mismatch conflict |
| Quest reward delivery | `quest:completed:{progressId}` | Replay must not create duplicate Points grant |
| RF claim | `Idempotency-Key` and deterministic voucher ID | Duplicate claim must bind to same voucher context |
| RF spend | `rf:voucher-claim-spend:{voucherId}` | Duplicate spend must not debit twice |
| Badge award | user/badge/source uniqueness | Duplicate award returns existing/no-new award |

Producer rejection handling:

```text
producer_rejection = blocked_attempt_diagnostic
producer_rejection != fraud_verdict
producer_rejection != user_entitlement_denial
producer_rejection != support_case_closure
```

Quest replay handling:

```text
quest_replay = delivery_operation
quest_replay != reward_receipt
quest_outbox = delivery_intent_only
points_row_required_for_reward_proof
```

## 12. Smoke Readiness Matrix

| Area | Verdict | Reason |
|---|---|---|
| Points producer ingress | `READY_FOR_BOUNDED_SMOKE` | Producer allowlist, caller matrix, flags and idempotency exist |
| Points public projections | `READY_WITH_EXCLUSIONS` | Useful for navigation, not proof; metadata gaps remain |
| Quest reward chain | `READY_WITH_EXCLUSIONS` | Outbox + Points integration exists; replay ungated; outbox not proof |
| RF voucher lifecycle | `READY_WITH_EXCLUSIONS` | Lifecycle rows and diagnostics pattern exist; legacy flags and financial wording risk remain |
| Badge award | `READY_WITH_EXCLUSIONS` | `user_badges` exists; no NFT/auto-badge/progression |
| Content/Pulse event registration | `BLOCKED_FOR_SMOKE` | DB-less fallback can award Points without persisted registration |
| Rielt inquiry | `OUT_OF_SCOPE_FOR_STAGE_11` for economy smoke | Inquiry only; no booking/payment proof |
| Space/Reactions | `OUT_OF_SCOPE_FOR_STAGE_11` for rewards | Social signals only |
| Contribution | `DEFER_TO_FUTURE_SLICE` | Candidate model only |
| Profile/Connect projections | `READY_WITH_EXCLUSIONS` | Non-proof projection only |
| Admin diagnostics | `READY_WITH_EXCLUSIONS` | Diagnostics contract exists; unified runtime and Points admin lookup missing |
| Mock/demo rejection | `READY_FOR_BOUNDED_SMOKE` | Must be excluded from proof |
| Path B exclusion | `READY_FOR_BOUNDED_SMOKE` | Excluded by doctrine and cutline |
| Public launch | `BLOCKED_FOR_SMOKE` as launch signal | Smoke is not launch approval |

Overall readiness:

```text
bounded_internal_smoke: READY_WITH_EXCLUSIONS
support_safe_smoke: READY_WITH_EXCLUSIONS
public_launch: BLOCKED
production_rollout: BLOCKED
```

## 13. Unresolved Runtime Gaps

| Gap | Severity | Smoke impact | Can proceed? | Exclude from smoke? | Requires fix before future rollout? |
|---|---|---|---|---|---|
| Content DB-less registration fallback | CRITICAL | Registration proof invalid without `event_registrations` row | Yes, only if excluded | Yes unless persisted row verified | Yes |
| Missing Points admin lookup | HIGH | Support-safe proof lookup incomplete | Yes, with direct internal owner lookup/exclusion | Exclude from support-safe proof terminus | Yes |
| Missing unified Admin runtime | HIGH | Diagnostics scattered; no single proof-safe facade | Yes, diagnostics remain hints only | No owner proof from diagnostics | Yes before scale/support |
| Quest replay ungated behavior | HIGH | Replay can be misread as reward receipt | Yes, if documented as delivery ops only | Do not use replay as proof | Yes or add explicit gate |
| RF legacy flag naming | MEDIUM | Env drift and registry mismatch | Yes, with actual env manifest | No | Yes before rollout |
| Projection metadata gaps | HIGH | UI cannot self-label proof/freshness consistently | Yes, projections excluded as proof | Yes as proof terminator | Yes before public UX |
| Frontend mock residue | CRITICAL | Mock can be mistaken as runtime economy | Yes, if excluded from evidence | Yes | Yes before public launch |
| Cutline runtime wiring not implemented | HIGH | 11.7 is proposal/contract only | Yes, procedural exclusion only | No proof from cutline flags | Yes before broad rollout |
| Token service deployed/ready adjacency | CRITICAL | Path B readiness spoofing | Yes, if ignored/excluded | Yes | Yes, or keep Path B hidden |
| Stage 12 UI/copy not started | HIGH | Public surfaces still contain semantic risks | Yes for internal smoke | N/A | Yes before public launch |

## 14. Runtime / Schema / UI Decision

Stage 11.8 runtime/schema/UI decision:

```text
runtime_smoke_status: VALIDATION_ONLY
runtime_changes: false
schema_changes: false
api_openapi_changes: false
generated_sdk_type_changes: false
ui_changes: false
Path_B_status: EXCLUDED
Stage_12_status: NOT_STARTED
production_launch_status: NOT_APPROVED
public_rollout_status: NOT_APPROVED
marketing_claim_status: NOT_APPROVED
```

Implementation changes that may appear needed are not implemented here:

| Need | Stage 11.8 action | Status |
|---|---|---|
| Points admin lookup by `transactionId`/`externalId` | Document blocker | `REQUIRES_SEPARATE_SLICE_APPROVAL` |
| Content DB-less fallback fix | Document blocker | `REQUIRES_SEPARATE_SLICE_APPROVAL` |
| Quest replay flag | Document blocker | `REQUIRES_SEPARATE_SLICE_APPROVAL` |
| Unified Admin runtime | Document blocker | `DEFER` |
| Projection metadata in APIs | Document blocker | `DEFER` |
| Frontend mock quarantine/removal | Document blocker | `Stage_12` |
| Cutline runtime wiring | Document blocker | `DEFER` |
| Path B | Exclude | `OUT_OF_SCOPE_FOR_STAGE_11` |

## 15. Stage 11 Closure Assessment

Is Path A governance-complete?

```text
path_a_governance_status: GOVERNANCE_COMPLETE_FOR_INTERNAL_BOUNDED_SMOKE
path_a_runtime_status: PARTIAL_READY_WITH_EXCLUSIONS
path_a_public_launch_status: BLOCKED
```

Stage 11 successfully defined:

- scope firewall;
- activity event contract;
- Points producer allowlist enforcement;
- contribution candidate boundary;
- off-chain badge/progression boundary;
- Profile/Connect/Admin projection contract;
- Admin diagnostics contract;
- MVP cutline enforcement flags contract;
- runtime smoke proof contract.

Runtime gaps that remain:

- Content DB-less registration fallback;
- missing Points admin lookup;
- missing unified Admin runtime;
- Quest replay ungated;
- RF legacy flag naming;
- projection metadata gaps;
- frontend mock residue;
- cutline flags not wired;
- Stage 12 UI/copy cleanup not started.

Which gaps are acceptable for bounded internal smoke?

| Gap | Internal smoke acceptance |
|---|---|
| Content DB-less fallback | Acceptable only if Content registration is excluded or persisted row verified |
| Missing Points admin lookup | Acceptable only for direct internal lookup, not support-safe public proof |
| Missing unified Admin runtime | Acceptable; diagnostics are hints only |
| Quest replay ungated | Acceptable if replay is delivery ops only |
| RF legacy flags | Acceptable with explicit env manifest |
| Projection metadata gaps | Acceptable because projections are excluded as proof |
| Frontend mock residue | Acceptable only if mock surfaces excluded from evidence |

Which gaps block public rollout?

- Content DB-less fallback;
- frontend mock/future-only surfaces;
- Path B vocabulary leakage;
- missing runtime cutline enforcement;
- missing projection metadata/copy alignment;
- missing support-safe owner lookup;
- unresolved financial/booking/wallet/NFT wording risk;
- internal-beta producer exposure in public env.

What must happen before any real production/public launch?

- Stage 12 UI/copy/mock cleanup or equivalent P0 public-surface quarantine;
- Content registration persistence/fallback fix or product exclusion;
- support-safe owner lookup for Points and key domains;
- unified or bounded Admin diagnostics runtime with proof-safe semantics;
- projection metadata and freshness enforcement;
- cutline runtime wiring or equivalent route/surface guards;
- public environment flag manifest and drift checks;
- explicit Path B hidden/excluded policy;
- legal/product review for any RF/Rielt/wallet vocabulary.

Stage 11 closure verdict:

```text
stage_11_governance_firewall: COMPLETE_AFTER_11_8_ACCEPTANCE
stage_11_runtime_smoke_contract: COMPLETE
stage_11_public_launch_approval: NOT_GRANTED
stage_12_needed_before_public_mvp: true
```

## 16. Risk Register

| ID | Risk | Severity | Stage 11.8 mitigation |
|---|---|---|---|
| R-118-01 | Smoke-as-launch | CRITICAL | Every artifact labeled internal-only; public launch not approved |
| R-118-02 | Smoke-as-customer-proof | CRITICAL | Smoke cannot be support receipt; owner facts only |
| R-118-03 | Hidden reward producers | CRITICAL | Producer allowlist and negative tests |
| R-118-04 | Social reward activation | CRITICAL | Space/Reactions excluded from reward smoke |
| R-118-05 | Creator economy drift | CRITICAL | Contribution/content monetization excluded |
| R-118-06 | Payout/cashback/payment/booking semantics | CRITICAL | RF/Rielt/Wallet financial cutlines |
| R-118-07 | Token/NFT/wallet semantics | CRITICAL | Path B excluded |
| R-118-08 | Extractive gamification activation | HIGH | XP/leaderboard/social score excluded |
| R-118-09 | Screenshot/mock/stale projection proof | CRITICAL | Rejection validation |
| R-118-10 | Stale diagnostic proof | HIGH | Diagnostics cannot terminate proof |
| R-118-11 | Idempotency/replay misuse | HIGH | Replay is not new grant; conflicts require owner comparison |
| R-118-12 | Producer rejection misuse | HIGH | Rejection explains blocked attempt only |
| R-118-13 | Hidden activation | CRITICAL | Route/surface and env inventory; excluded domains |
| R-118-14 | Environment drift | HIGH | Smoke env manifest required |
| R-118-15 | Path B spoofing | CRITICAL | Token service ignored/excluded |
| R-118-16 | Content DB-less fallback enters proof | CRITICAL | Exclude unless persisted owner row exists |
| R-118-17 | Quest outbox-as-receipt | HIGH | Points row required |
| R-118-18 | Flag-as-proof | CRITICAL | Flags excluded from proof |
| R-118-19 | Cutline unwired but assumed enforced | HIGH | Treat 11.7 flags as contract/procedural guards only |
| R-118-20 | Points admin lookup gap | HIGH | Direct owner lookup/exclusion until separate slice |

## 17. Review Gates

Stage 11.8 can be accepted only if these gates pass:

| Gate | Required result |
|---|---|
| Boundary gate | Smoke proof is internal validation only |
| Owner fact gate | Proof chains terminate at owner rows |
| Producer gate | Producer allowlist and fail-closed semantics validated |
| Replay gate | Idempotency/replay does not create duplicate grants or false fraud verdicts |
| Projection gate | Dashboard/Wallet/ActivityFeed/Profile rejected as proof |
| Diagnostics gate | Diagnostic snapshots rejected as customer proof/receipts |
| Mock gate | Mock/demo/screenshot/share-card evidence rejected |
| Path B gate | Token/NFT/G2A/bridge/wallet excluded |
| Economy gate | No payout/cashback/payment/booking/creator/social reward semantics |
| Gamification gate | No XP/leaderboard/social-score activation |
| Gap gate | Unresolved runtime gaps documented with exclusions/blockers |
| Runtime gate | No runtime/schema/API/SDK/UI changes |
| Launch gate | No production/public rollout/marketing approval |

## 18. Acceptance Criteria

Stage 11.8 is successful if:

- smoke proof boundary is clearly defined;
- smoke scenarios are validated;
- proof chains are validated;
- projection/diagnostic/mock rejection is validated;
- fail-closed doctrine is validated;
- Path B is excluded;
- unresolved gaps are documented;
- smoke readiness matrix is completed;
- Stage 11 closure assessment is completed;
- no runtime/schema/API/SDK/UI changes are made;
- no Path B activation occurs;
- no rollout/marketing claims are made;
- final verdict is included.

Acceptance status:

```text
smoke_proof_boundary_defined: true
smoke_scenarios_validated: true
proof_chains_validated: true
projection_rejection_validated: true
diagnostic_rejection_validated: true
mock_rejection_validated: true
fail_closed_doctrine_validated: true
path_b_excluded: true
unresolved_gaps_documented: true
smoke_readiness_matrix_completed: true
stage_11_closure_assessment_completed: true
runtime_changes_made: false
schema_changes_made: false
api_sdk_changes_made: false
ui_changes_made: false
path_b_activation: false
rollout_marketing_claims_made: false
```

## 19. Final Verdict

Stage 11.8 defines and validates the bounded internal Runtime Smoke Proof contract for Go2Asia Path A.

Final verdict:

```text
stage_11_8_status: READY_WITH_EXCLUSIONS_as_bounded_internal_smoke_contract
runtime_smoke_status: VALIDATION_ONLY
runtime_coherence_status: PARTIAL_READY_WITH_EXCLUSIONS
owner_fact_authority_status: CONFIRMED_AS_REQUIRED_TERMINUS
producer_enforcement_status: READY_FOR_BOUNDED_SMOKE
projection_rejection_status: READY_WITH_EXCLUSIONS
diagnostic_rejection_status: READY_WITH_EXCLUSIONS
mock_demo_rejection_status: READY_FOR_BOUNDED_SMOKE
path_b_status: EXCLUDED
public_launch_status: BLOCKED
production_rollout_status: BLOCKED
stage_12_status: NOT_STARTED
runtime_changes: false
schema_changes: false
api_openapi_changes: false
generated_sdk_type_changes: false
ui_changes: false
```

Stage 11 closure verdict:

```text
stage_11_status_after_11_8_acceptance: GOVERNANCE_COMPLETE_FOR_INTERNAL_BOUNDED_SMOKE
stage_11_public_mvp_approval: NOT_GRANTED
stage_11_production_launch_approval: NOT_GRANTED
stage_11_path_b_activation: false
next_recommended_work: Stage 11.9 Closure Review or Stage 12 UI/Copy/Mock Alignment
```

Stage 11.8 succeeds if Go2Asia can demonstrate bounded internal confidence that the MVP economy does not collapse under its own governance rules.

It does not approve public launch. Before any public launch or production rollout, Go2Asia must resolve or explicitly exclude the remaining blockers: Content DB-less registration fallback, Points/support lookup gaps, unified Admin runtime gap, Quest replay gate, projection metadata gaps, frontend mock residue, runtime cutline wiring, Stage 12 UI/copy cleanup and all Path B vocabulary/surface leakage.
