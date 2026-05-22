# Stage 11.7 — MVP Cutline Enforcement Flags

Документ: `stage_11_7_mvp_cutline_enforcement_flags_v1.md`  
Статус: docs-first cutline enforcement contract with implementation-readiness assessment  
Дата: 2026-05-22  
Scope: Stage 11.7 of Path A — MVP economy cutline and feature flag enforcement contract  
Mode: read-only architecture design; no runtime flag framework; no production service changes; no DB schema changes; no OpenAPI/SDK/generated changes; no UI changes; no smoke proof; no Admin UI; no Path B

## 0. Orchestration Summary

Task type: docs-first MVP cutline enforcement contract and implementation-readiness assessment.

Risk level: CRITICAL because feature flags can be misread as proof, reward grants, customer promises, public product readiness, Path B activation or support authority if their semantics are not explicitly bounded.

Execution mode:

```text
runtime_implementation_allowed: false
schema_migration_allowed: false
openapi_sdk_changes_allowed: false
ui_changes_allowed: false
runtime_flag_framework_allowed: false
smoke_proof_allowed: false
admin_ui_allowed: false
path_b_activation_allowed: false
```

Controlling docs:

- `docs/architecture/domain/stage_11_0_scope_and_guardrails_v1.md`
- `docs/architecture/domain/stage_11_1_activity_event_contract_and_feature_flag_naming_v1.md`
- `docs/architecture/domain/stage_11_2_points_ledger_minimal_runtime_and_producer_allowlist_v1.md`
- `docs/architecture/domain/stage_11_3_contribution_record_boundary_and_candidate_model_v1.md`
- `docs/architecture/domain/stage_11_4_badge_progression_minimal_state_v1.md`
- `docs/architecture/domain/stage_11_5_profile_connect_admin_projection_contract_v1.md`
- `docs/architecture/domain/stage_11_6_admin_economy_diagnostics_v1.md`

Supporting docs:

- `docs/architecture/domain/stage_10_10_ux_copy_proof_class_alignment_v1.md`
- `docs/architecture/domain/stage_10_11_mvp_economy_cutline_v1.md`
- `docs/architecture/domain/stage_10_12_implementation_readiness_plan_v1.md`
- `docs/roadmaps/stage_10_13_economy_runtime_landing_audit_v1.md`

Read-only flag and surface inventory checked:

- `apps/points-service/wrangler.toml`
- `apps/points-service/src/producerAllowlist.ts`
- `apps/points-service/src/index.ts`
- `apps/points-service/src/spendabilityShadow.ts`
- `apps/rf-service/wrangler.toml`
- `apps/rf-service/src/routes/rf.ts`
- `apps/rf-service/src/vipEntitlementShadow.ts`
- `apps/rf-service/src/durableDiagnostics/*`
- `apps/quest-service/wrangler.toml`
- `apps/quest-service/src/*`
- `apps/api-gateway/wrangler.toml`
- `apps/api-gateway/src/index.ts`
- `apps/content-service/src/*`
- `apps/space-service/src/*`
- `apps/reactions-service/src/*`
- `apps/rielt-service/src/*`
- `.env.example`
- `apps/go2asia-pwa-shell/.env.example`
- `.github/workflows/deploy-workers-staging.yml`
- frontend mock/future-only surfaces under `apps/go2asia-pwa-shell/*`

Multi-agent review passes applied:

| Pass | Role | Result |
|---|---|---|
| Orchestrator | AI Program Director / Orchestrator | Stage 11.7 is docs-first cutline enforcement contract |
| Runtime Governance | Runtime Governance Architect | Fail-closed rules, taxonomy and owner-fact requirements defined |
| Economy | Economy Architect | No flag-as-proof, flag-as-reward, social reward, creator economy, payout, booking or Path B activation |
| Security / Fraud | Security / Fraud & Abuse Specialist | Mock fallback, stale flag, env drift, hidden activation and readiness spoofing risks documented |
| Architecture | Software Architect | Existing flag inventory, proposed registry and service-by-service map created |
| Slice Strategist | Slice Strategist | 11.8, Stage 12, Path B and runtime framework boundaries preserved |
| Canon Writer | Technical Canon Writer | Stable vocabulary, forbidden vocabulary and final verdict frozen |

Implementation permission:

```text
cutline_contract_status: DEFINED_NOT_IMPLEMENTED
cutline_runtime_status: DEFER
cutline_flag_registry_status: PROPOSAL_ONLY
flag_wiring_status: DEFER
schema_changes: false
api_openapi_changes: false
generated_sdk_type_changes: false
ui_changes: false
smoke_proof_status: DEFER_TO_11_8
```

## 1. Executive Summary

Stage 11.7 defines the MVP Cutline Enforcement Flags contract.

The core decision:

```text
cutline_flag = internal governance guardrail
cutline_flag != proof
cutline_flag != authority
cutline_flag != reward_grant
cutline_flag != customer_promise
flag_enabled != product_readiness
```

Stage 11.7 closes the path from docs-only guardrails to enforceable MVP cutline rules by defining a flag taxonomy, cutline categories, fail-closed doctrine, existing flag inventory, proposed registry and future implementation-readiness map.

Stage 11.7 does not wire new global flags. It does not create a feature flag framework. It does not change services, schema, OpenAPI, SDK, generated types or frontend UI.

Core doctrine:

```text
flag != proof
flag != authority
flag != reward_grant
flag != customer_promise
flag_enabled != product_readiness
cutline != economic_fact
cutline != support_proof
missing_flag = fail_closed
unknown_flag = fail_closed
mock_data != fallback
demo_data != fallback
projection != authority
diagnostic != proof
Path_B = blocked_for_Stage_11
token_service_ready != Path_A_ready
NFT_placeholder != NFT_feature
wallet_placeholder != financial_wallet
soft_gamification_allowed_later
extractive_gamification_forbidden_now
```

Final summary:

```text
existing_flag_status: PARTIAL
producer_enforcement_status: PARTIAL_POINTS_ONLY
cutline_registry_status: PROPOSAL_ONLY
runtime_wiring_status: DEFER
stage_11_8_smoke_status: BLOCKED_UNTIL_11_7_ACCEPTED
```

## 2. Cutline Definition

`cutline` is the boundary between what the MVP economy may safely run/show/support and what remains blocked, deferred or future-only.

Cutline Enforcement Flags are:

- internal governance switches;
- risk boundaries;
- fail-closed blockers;
- allow/deny classification helpers;
- implementation guardrails;
- readiness inputs for future slices.

Cutline Enforcement Flags are not:

- user-facing promises;
- proof;
- economic authority;
- receipts;
- reward grants;
- product readiness statements;
- smoke proof;
- Path B activation.

Cutline flags may:

- prevent Path B leakage;
- block mock/demo evidence;
- block projection-as-proof;
- block future-only producers;
- block social metric rewards;
- block Quest/Space/Contribution auto-badges;
- block NFT/token/wallet semantics;
- block payout/cashback/booking/payment semantics;
- require owner-backed facts for smoke proof later.

Cutline flags may not:

- create proof;
- create reward grants;
- create admin receipts;
- create public product readiness;
- activate Path B;
- activate creator economy;
- activate XP/progression engine;
- activate social score.

Cutline model:

```text
owner_fact
+ producer allowlist
+ projection contract
+ diagnostics contract
+ cutline registry
-> smoke proof eligibility later
```

Cutline does not create owner facts:

```text
cutline_flag
-> no economic_fact
-> no reward_grant
-> no badge_award
-> no contribution_record
-> no receipt
```

## 3. Cutline Non-Goals

Stage 11.7 does not:

- create new runtime feature flag framework;
- wire new global flags;
- change production services;
- change DB schema;
- create migrations;
- change OpenAPI;
- regenerate SDK/types;
- change frontend UI;
- create smoke proof;
- create Admin UI;
- create public proof route;
- activate token/NFT/G2A/on-chain/bridge/wallet;
- activate payout/cashback/payment/booking semantics;
- activate social reward producers;
- activate Quest/Space/Contribution auto-badges;
- create creator economy;
- create XP/level/streak/leaderboard engine;
- change Points producer enforcement;
- change projection runtime;
- change badge runtime;
- change contribution runtime;
- change Admin diagnostics runtime.

Forbidden interpretations:

| Misread | Stage 11.7 rule |
|---|---|
| Flag as proof | `FORBIDDEN_FOR_STAGE_11` |
| Flag as reward grant | `FORBIDDEN_FOR_STAGE_11` |
| Flag enabled as product readiness | `FORBIDDEN_FOR_STAGE_11` |
| Cutline as support proof | `FORBIDDEN_FOR_STAGE_11` |
| Smoke flag as public rollout evidence | `FORBIDDEN_FOR_STAGE_11` |
| Path B blocker as Path B design approval | `FORBIDDEN_FOR_STAGE_11` |
| Mock fallback when flags missing | `FORBIDDEN_FOR_STAGE_11` |
| Projection/admin diagnostic as proof when flagged on | `FORBIDDEN_FOR_STAGE_11` |

## 4. Feature Flag Doctrine

Feature flags in Stage 11.7 are governance controls, not user-facing claims.

Flag classes:

| Class | Prefix | Meaning | Forbidden interpretation |
|---|---|---|---|
| Runtime | `economy.runtime.*` | Controls internal runtime exposure or future runtime readiness | Runtime proof or public claim |
| Producer | `economy.producer.*` | Controls allowlisted producer ingress | Reward proof or product promise |
| Projection | `economy.projection.*` | Controls projection visibility/readiness | Authority, receipt, support proof |
| Admin diagnostics | `economy.admin_diagnostics.*` | Controls internal diagnostic visibility | Customer proof or admin ledger |
| Cutline | `economy.cutline.*` | Blocks unsafe semantics and evidence | Feature launch |
| Smoke | `economy.smoke.*` | Future smoke proof gate | Rollout evidence |
| Path B | `economy.path_b.*` | Blocks Path B in Stage 11 | Path B implementation |
| Mock | `economy.mock.*` | Blocks mock/demo evidence | Runtime fallback |
| Soft progression | `economy.soft_progression.*` | Future soft motivation boundary | XP/social-score activation |

Flag semantics:

```text
flag_name_defined != flag_implemented
flag_implemented != producer_approved
producer_flag_enabled != proof
projection_flag_enabled != authority
admin_diagnostics_flag_enabled != customer_proof
smoke_flag_enabled != rollout_evidence
cutline_flag_present != Path_B_design
```

Required fail-closed stance:

```text
missing_flag = blocked
unknown_flag = blocked
misconfigured_flag = blocked
mock_fallback = blocked
```

Forbidden flag names remain forbidden unless used as blocking cutline labels:

```text
economy.token.*
economy.g2a.*
economy.nft.*
economy.bridge.*
economy.wallet.external.*
economy.payout.*
economy.cashback.*
economy.settlement.*
economy.commission.*
economy.withdraw.*
economy.topup.*
economy.rielt.booking.*
economy.rielt.payment.*
economy.creator.*
economy.content_monetization.*
economy.space_rewards.*
economy.likes_to_points.*
economy.views_to_points.*
economy.network_accrual.*
economy.referral_bonus.*
activity_event.reward_grant.*
activity_event.proof.*
activity_event.ledger.*
```

## 5. Existing Flag Inventory

Existing flags are service-local and partial. Stage 11.7 documents them; it does not rename or rewire them.

| File/path | Flag | Current scope | Visible value/default | Governance class | Risk | Stage 11.7 rule |
|---|---|---|---|---|---|---|
| `apps/points-service/wrangler.toml` | `ECONOMY_PRODUCER_FIRST_LOGIN_ENABLED` | Points internal-beta producer | staging `"true"`; production unset | `economy.producer.first_login.enabled` alias | Internal-beta mistaken as public readiness | Registry alias; producer flag is ingress only |
| `apps/points-service/wrangler.toml` | `ECONOMY_PRODUCER_QUEST_COMPLETED_ENABLED` | Points `quest_completed` producer | staging `"true"` | `economy.producer.quest_completed.enabled` alias | Quest preview/outbox as reward | Owner proof requires Points row |
| `apps/points-service/wrangler.toml` | `ECONOMY_PRODUCER_EVENT_REGISTRATION_ENABLED` | Points `event_registration` producer | staging `"true"` | `economy.producer.event_registration.enabled` alias | DB-less registration fallback | Exclude or gate before smoke if owner fact missing |
| `apps/points-service/wrangler.toml` | `ECONOMY_PRODUCER_RF_VOUCHER_CLAIM_SPEND_ENABLED` | Points spend producer | staging `"true"` | `economy.producer.rf_voucher_claim_spend.enabled` alias | Financial/payment drift | Utility Points debit only |
| `apps/points-service/wrangler.toml` | `ECONOMY_PRODUCER_RF_VOUCHER_CLAIM_SPEND_COMPENSATION_ENABLED` | Points compensation/recovery producer | staging `"true"` | `economy.producer.rf_voucher_claim_spend_compensation.enabled` alias | Cashback/refund narrative | Internal recovery trace only |
| `apps/points-service/wrangler.toml` | `POINTS_ENABLE_SPENDABILITY_SHADOW_COMPARE` | Spendability shadow compare | staging `"true"` | `economy.runtime.points_spendability_shadow_compare.enabled` | Shadow as ledger truth | Diagnostic only, not authority |
| `apps/points-service/wrangler.toml` | `POINTS_ENABLE_SPENDABILITY_SHADOW_DIAGNOSTICS` | Internal diagnostics endpoint | staging `"true"` | `economy.admin_diagnostics.points_spendability_shadow.enabled` | Customer balance proof | Internal service-auth diagnostic only |
| `apps/points-service/wrangler.toml` | `POINTS_ENABLE_SPENDABILITY_DURABLE_EXPORT` | Structured export logs | staging `"true"` | `economy.runtime.points_spendability_durable_export.enabled` | Accounting/export proof | Best-effort internal export, not customer proof |
| `.github/workflows/deploy-workers-staging.yml` | Points spendability vars | CI deploy vars | `"true"` for staging | deploy governance | CI/wrangler drift | Registry must track deploy source |
| `.github/workflows/deploy-workers-staging.yml` | Points producer vars | Not passed by CI extra vars | Pinned in wrangler only | deploy governance | Split-brain staging | Registry must record source-of-truth |
| `apps/rf-service/wrangler.toml` | `RF_ENABLE_PAID_VOUCHER_SPEND` | RF paid voucher Points spend coupling | staging `"true"` | `economy.internal_beta.rf_paid_voucher_spend.enabled` | Payment/cashback semantics | Utility debit only; pair with Points spend producer |
| `apps/rf-service/wrangler.toml` | `RF_ENABLE_ENTITLEMENT_DURABLE_DIAGNOSTICS` | RF durable diagnostics sink | staging `"false"` | `economy.admin_diagnostics.rf_entitlement_durable.enabled` | Diagnostic export proof | Disabled/fail closed |
| `apps/rf-service/wrangler.toml` | `RF_ENTITLEMENT_DIAGNOSTICS_WINDOW_ID` | Durable diagnostics window | staging empty | diagnostics config | Stale/window spoofing | Empty means disabled |
| `apps/rf-service/wrangler.toml` | `RF_ENTITLEMENT_DIAGNOSTICS_SINK_MODE` | Durable diagnostics sink mode | `"disabled"` | diagnostics config | Hidden diagnostics | Disabled by default |
| `apps/rf-service/wrangler.toml` | `RF_ENTITLEMENT_DIAGNOSTICS_SAMPLE_MODE` | Durable diagnostics sampling | `"scenario_only"` | diagnostics config | Misread as authority | Internal diagnostics only |
| `apps/rf-service/src/routes/rf.ts` | `RF_ENABLE_ENTITLEMENT_MOCK_READ_API` | Internal mock entitlement read | unset -> 404 | `economy.mock.rf_entitlement_mock_read.blocked` | Mock as entitlement truth | Must remain admin-only and non-proof |
| `apps/rf-service/src/routes/rf.ts` | `RF_ENABLE_ENTITLEMENT_PREVIEW_PROXY` | Entitlement preview endpoint | unset -> 404 | `economy.projection.rf_entitlement_preview.enabled` | Preview as grant | Projection only |
| `apps/rf-service/src/routes/rf.ts` | `RF_ENABLE_ENTITLEMENT_PREVIEW_OBSERVABILITY` | Preview observability | unset -> off | `economy.admin_diagnostics.rf_preview_observability.enabled` | Diagnostic as proof | Admin/internal only |
| `apps/rf-service/src/routes/rf.ts` | `RF_ENABLE_ENTITLEMENT_SHADOW_COMPARE` | Entitlement shadow compare | unset -> off | `economy.runtime.rf_entitlement_shadow_compare.enabled` | Shadow as authority | Shadow only |
| `apps/rf-service/src/routes/rf.ts` | `RF_ENABLE_ENTITLEMENT_SHADOW_DIAGNOSTICS` | Shadow observability | unset -> 404 | `economy.admin_diagnostics.rf_shadow.enabled` | Customer proof | Admin-only diagnostic |
| `apps/rf-service/src/routes/rf.ts` | `RF_ENTITLEMENT_SHADOW_SCENARIO` | Shadow scenario | unset | diagnostics config | Scenario leakage | Non-production/internal only |
| `apps/rf-service/src/routes/rf.ts` | `RF_ENTITLEMENT_SOURCE_READ_MODE` | Source read adapter mode | unset/default disabled | runtime experiment | Hidden entitlement authority | Not product entitlement |
| `apps/rf-service/src/routes/rf.ts` | `RF_ENABLE_ENTITLEMENT_REAL_ADAPTERS` | Preview adapter toggle | unset -> false | runtime experiment | Product readiness drift | Default closed |
| `apps/rf-service/src/routes/rf.ts` | `RF_ENABLE_ENTITLEMENT_ROLE_ADAPTER` | Preview role adapter | unset -> false | runtime experiment | Entitlement proof drift | Default closed |
| `apps/rf-service/src/routes/rf.ts` | `RF_ENABLE_ENTITLEMENT_VIP_ADAPTER` | Preview VIP adapter | unset -> false | runtime experiment | VIP proof drift | Default closed |
| `apps/quest-service/wrangler.toml` | cron trigger | Quest reward replay schedule | always configured when deployed | implicit runtime gate | Ungated replay delivery | Candidate future flag; no wiring in 11.7 |
| `apps/api-gateway/src/index.ts` | `DEBUG_ROUTES_ENABLED` | Debug routes | unset -> 404 | ops/debug | Route/host leakage | Fail closed, not economy proof |
| `apps/api-gateway/src/index.ts` | `GATEWAY_ENABLE_IDENTITY_CORE_SHADOW_COMPARE` | Identity shadow compare | unset -> off | diagnostics/runtime | Identity drift mistaken as economy readiness | Out of economy proof |
| `apps/api-gateway/src/index.ts` | `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE` | Identity evidence | unset -> off | diagnostics | PII/role leakage | Internal only |
| `apps/api-gateway/src/index.ts` | `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE_AGGREGATION` | Evidence aggregation | unset -> off | diagnostics | Debug proof drift | Internal only |
| `apps/api-gateway/src/index.ts` | `GATEWAY_ENABLE_IDENTITY_CORE_DIAGNOSTICS` | Identity diagnostics endpoint | unset -> off; production blocked | diagnostics | Customer proof leakage | Token-gated, non-economy |
| `apps/api-gateway/src/index.ts` | `GATEWAY_IDENTITY_CORE_DIAGNOSTICS_TOKEN` | Debug token | unset -> unauthorized | security | Secret leakage | Never customer-facing |
| `.env.example` | `TOKEN_SERVICE_URL` | Token service URL | placeholder | Path B adjacency | Token readiness spoofing | `token_service_ready != Path_A_ready` |
| `apps/go2asia-pwa-shell/mocks/dto.ts` | `NEXT_PUBLIC_DATA_SOURCE` | Mock/API data source | default `api`; `mock` explicit | `economy.mock.frontend_data_source` | Mock as runtime truth | Mock cannot be proof/fallback |
| `apps/go2asia-pwa-shell/lib/rfEntitlementPreview.ts` | `NEXT_PUBLIC_RF_ENABLE_ENTITLEMENT_PREVIEW` | Client RF preview | unset -> off | `economy.projection.rf_entitlement_preview.enabled` | Preview as grant | Projection only |
| `apps/go2asia-pwa-shell/.env.example` | no economy cutline flags | PWA env example | none | inventory gap | Missing client cutline registry | Document gap; no UI change |

Inventory verdict:

```text
points_flag_inventory: PARTIAL_READY
rf_flag_inventory: PARTIAL_WITH_LEGACY_NAMES
quest_flag_inventory: GAP_OUTBOX_REPLAY_UNGATED
api_gateway_flag_inventory: DEBUG_DIAGNOSTICS_ONLY
frontend_flag_inventory: MOCK_DATA_SOURCE_ONLY
unified_registry_status: MISSING
```

## 6. Proposed Flag Registry

This registry is proposal-only. It does not create env vars or wire behavior in Stage 11.7.

### `economy.runtime.*`

| Proposed flag | Purpose | Stage 11.7 status |
|---|---|---|
| `economy.runtime.activity_events.enabled` | Future runtime activity event layer gate | `PROPOSAL_ONLY / DEFER` |
| `economy.runtime.activity_events.persistence_enabled` | Future activity event persistence gate | `PROPOSAL_ONLY / DEFER` |
| `economy.runtime.quest_outbox_replay.enabled` | Future explicit Quest replay gate | `PROPOSAL_ONLY`; current cron ungated |

### `economy.producer.*`

| Proposed flag | Existing alias | Producer class | Rule |
|---|---|---|---|
| `economy.producer.registration.enabled` | none; active by allowlist | `ACTIVE` | Active producer, not public reward promise |
| `economy.producer.referral_locked.enabled` | none; active by allowlist | `ACTIVE` | Active producer, not commission |
| `economy.producer.first_login.enabled` | `ECONOMY_PRODUCER_FIRST_LOGIN_ENABLED` | `INTERNAL_BETA` | Missing alias flag blocks |
| `economy.producer.quest_completed.enabled` | `ECONOMY_PRODUCER_QUEST_COMPLETED_ENABLED` | `INTERNAL_BETA` | Outbox not proof; Points row required |
| `economy.producer.event_registration.enabled` | `ECONOMY_PRODUCER_EVENT_REGISTRATION_ENABLED` | `INTERNAL_BETA` | DB-less fallback risk before smoke |
| `economy.producer.rf_voucher_claim_spend.enabled` | `ECONOMY_PRODUCER_RF_VOUCHER_CLAIM_SPEND_ENABLED` | `INTERNAL_BETA` | Utility debit, not payment |
| `economy.producer.rf_voucher_claim_spend_compensation.enabled` | `ECONOMY_PRODUCER_RF_VOUCHER_CLAIM_SPEND_COMPENSATION_ENABLED` | `INTERNAL_BETA` | Recovery trace, not cashback |
| `economy.producer.badge_award.enabled` | existing internal badge award path, no global flag | `INTERNAL_BETA` | Off-chain award only, not NFT |

### `economy.projection.*`

| Proposed flag | Purpose | Rule |
|---|---|---|
| `economy.projection.connect.enabled` | Connect projection visibility | Projection is not authority/proof |
| `economy.projection.profile.enabled` | Profile projection visibility | Profile is not economy authority |
| `economy.projection.admin.enabled` | Admin projection visibility | Admin snapshot is not customer proof |

### `economy.admin_diagnostics.*`

| Proposed flag | Purpose | Rule |
|---|---|---|
| `economy.admin_diagnostics.economy.enabled` | Unified economy diagnostics gate | Internal navigation only |
| `economy.admin_diagnostics.points.enabled` | Points diagnostics gate | Not ledger/proof |
| `economy.admin_diagnostics.quest.enabled` | Quest outbox diagnostics gate | Delivery intent only |
| `economy.admin_diagnostics.rf.enabled` | RF lifecycle diagnostics gate | Not payout/cashback |
| `economy.admin_diagnostics.rielt.enabled` | Future Rielt diagnostic gate | Not booking/payment |
| `economy.admin_diagnostics.content.enabled` | Future Content diagnostic gate | Registration only |

### `economy.cutline.*`

| Proposed flag | Blocks |
|---|---|
| `economy.cutline.path_b_blocked` | Path B semantics in Stage 11 |
| `economy.cutline.mock_evidence_blocked` | Mock/demo evidence |
| `economy.cutline.projection_as_proof_blocked` | Projection-as-proof |
| `economy.cutline.screenshot_as_proof_blocked` | Screenshot/share-card as proof |
| `economy.cutline.diagnostic_as_customer_proof_blocked` | Diagnostic snapshot as proof |
| `economy.cutline.token_gateway_blocked` | Token gateway |
| `economy.cutline.nft_mint_blocked` | NFT mint/ownership |
| `economy.cutline.wallet_financial_semantics_blocked` | Financial wallet/custody |
| `economy.cutline.payout_cashback_blocked` | Payout/cashback/refund/settlement |
| `economy.cutline.booking_payment_blocked` | Booking/payment/reservation proof |
| `economy.cutline.social_rewards_blocked` | Social metric rewards |
| `economy.cutline.quest_to_badge_blocked` | Quest auto-badges |
| `economy.cutline.space_to_badge_blocked` | Space auto-badges |
| `economy.cutline.contribution_to_badge_blocked` | Contribution auto-badges |
| `economy.cutline.xp_engine_blocked` | XP/level engine |
| `economy.cutline.leaderboard_blocked` | Leaderboard/social pressure |

### `economy.smoke.*`

| Proposed flag | Purpose | Rule |
|---|---|---|
| `economy.smoke.stage11.enabled` | Future Stage 11 smoke proof gate | `DEFER_TO_11_8` |
| `economy.smoke.owner_fact_required` | Require owner facts for smoke | Owner IDs only |
| `economy.smoke.mock_forbidden` | Exclude mock/demo | Must be true before smoke |
| `economy.smoke.projection_forbidden_as_proof` | Exclude projection proof | Must be true before smoke |

### `economy.path_b.*`

| Proposed flag | Purpose | Rule |
|---|---|---|
| `economy.path_b.token_service_blocked` | Block token service readiness as Path A proof | Blocking only |
| `economy.path_b.g2a_blocked` | Block G2A semantics | Blocking only |
| `economy.path_b.nft_blocked` | Block NFT semantics | Blocking only |
| `economy.path_b.onchain_gateway_blocked` | Block on-chain gateway | Blocking only |
| `economy.path_b.wallet_custody_blocked` | Block wallet custody | Blocking only |

### `economy.mock.*`

| Proposed flag | Blocks |
|---|---|
| `economy.mock.home_stats_blocked` | Home static rewards/stats as proof |
| `economy.mock.connect_wallet_blocked` | Connect mock wallet rows |
| `economy.mock.space_nft_blocked` | Space mock NFT/economy surfaces |
| `economy.mock.quest_nft_badge_blocked` | Quest NFTBadge mock as proof |
| `economy.mock.rielt_verified_booking_blocked` | Rielt verifiedBooking mock |

### `economy.soft_progression.*`

| Proposed flag | Purpose | Rule |
|---|---|---|
| `economy.soft_progression.future_allowed` | Preserve future gentle motivation path | Not implemented in 11.7 |
| `economy.soft_progression.extractive_blocked` | Block extractive gamification now | Must remain blocked |

Registry rule:

```text
this_registry_status = PROPOSAL_ONLY
do_not_wire_flags_in_stage_11_7_without_separate_approval
existing_env_flags_documented_separately_from_proposed_registry
```

## 7. Cutline Categories

### Path B Cutline

Blocks:

- token service activation;
- G2A;
- on-chain gateway;
- NFT mint;
- wallet custody;
- token/NFT proof.

Rule:

```text
Path_B = blocked_for_Stage_11
token_service_ready != Path_A_ready
NFT_placeholder != NFT_feature
wallet_placeholder != financial_wallet
```

### Mock / Demo Evidence Cutline

Blocks:

- mock home stats;
- Connect mock wallet;
- Space NFT mock;
- Quest NFTBadge mock;
- Rielt verifiedBooking mock;
- screenshots/share cards as proof.

Rule:

```text
mock_data != fallback
demo_data != fallback
mock_data != support_proof
```

### Projection Proof Cutline

Blocks:

- dashboard as receipt;
- wallet as financial wallet;
- ActivityFeed as audit trail;
- Profile as authority;
- Admin snapshot as customer proof.

Rule:

```text
projection != authority
projection != proof
diagnostic != proof
```

### Producer / Reward Cutline

Blocks:

- future-only producers;
- forbidden producers;
- social rewards;
- creator economy;
- contribution auto-reward;
- Quest/Space/Contribution auto-badges.

Rule:

```text
producer_enum_vocabulary != producer_activation
flag_enabled != reward_grant
```

### Financial / Booking Cutline

Blocks:

- payout;
- cashback;
- refund;
- payment;
- settlement;
- booking;
- reservation proof.

Rule:

```text
RF_voucher != payout_or_cashback
Rielt_inquiry != booking_or_payment
Wallet != financial_wallet
```

### Gamification Cutline

Blocks now:

- XP engine;
- level grinding;
- streak economy;
- leaderboard economy;
- social score;
- monetized prestige;
- rarity market.

Clarification:

```text
soft_progression may return later
extractive_gamification remains blocked now
```

### Smoke Proof Cutline

Prepares Stage 11.8:

- owner facts required;
- projections forbidden as proof;
- mocks forbidden;
- diagnostics forbidden as proof;
- Path B excluded;
- unresolved DB-less fallbacks excluded.

Rule:

```text
smoke_proof_status = DEFER_TO_11_8
smoke_flag_enabled != rollout_evidence
```

## 8. Service-by-Service Cutline Map

| Domain/surface | Current risk | Required cutline | Existing guardrail | Missing guardrail | Stage 11.7 rule | Before-11.8 requirement |
|---|---|---|---|---|---|---|
| Points | Internal-beta producers, shadow diagnostics, env drift | Producer/reward and diagnostics cutline | Stage 11.2 producer allowlist | Unified flag registry and admin lookup gap | Producer flags are ingress only | Owner Points row required |
| Quest | Outbox/replay can be read as reward grant | Delivery intent cutline | Outbox status and service-auth ops | Explicit replay flag; proof chain to Points | Outbox is not receipt | Match Points row or exclude |
| RF | Paid spend can look payment/cashback; diagnostics can look payout report | Financial/RF lifecycle cutline | RF paid spend flag, RF diagnostics admin role | Canonical registry alias | Utility lifecycle only | Voucher row + optional Points spend owner row |
| Rielt | Inquiry/listing can look booking/payment | Booking/payment cutline | Listing/inquiry owner rows | Admin lookup route missing | Inquiry only | Exclude booking/payment semantics |
| Content/Pulse | Event registration DB-less fallback, attendance/payment drift | Content registration cutline | `event_registrations` when DB exists, Points producer | DB-less fallback unresolved | Registration only | Persisted registration or smoke exclusion |
| Space/Reactions | Social metrics can become farming/reward claims | Social reward cutline | Space producers future-only/blocked in Points | UI/mock surfaces remain | Social signal only | No reward proof |
| Badges | Badge projection can become NFT/XP/progression authority | Badge/NFT/progression cutline | Stage 11.4 doctrine, `user_badges` owner facts | Quest/Space/Contribution auto-badge flags missing | Off-chain recognition only | `user_badges` row only |
| Contribution | Candidate can become reward | Contribution/reward cutline | Stage 11.3 doctrine | Runtime missing; no flag enforcement | Candidate only | No contribution reward in smoke |
| Profile/Connect/Admin | Projection/diagnostic proof collapse | Projection/diagnostic proof cutline | Stage 11.5/11.6 contracts | Runtime metadata/enforcement missing | Hints only, not proof | Owner facts required |
| Token Service / Path B | Readiness spoofing | Path B cutline | Stage 11.0 forbidden scope | Runtime blocker flags missing | Ignore for Path A | Exclude from smoke |

## 9. Fail-Closed Rules

Mandatory fail-closed doctrine:

```text
missing_flag = blocked
unknown_flag = blocked
misconfigured_flag = blocked
mock_fallback = blocked
projection_without_owner_trace = blocked_for_proof
diagnostic_without_owner_fact = blocked_for_proof
token_service_ready = ignored_for_Path_A
frontend_mock_present = not_runtime_truth
```

Operational rules:

- absent producer flag blocks internal-beta producer;
- absent cutline blocker must be interpreted as unsafe path blocked;
- absent projection flag cannot enable mock fallback;
- absent diagnostics flag cannot make screenshots acceptable;
- unknown env variable names do not grant behavior;
- stale flag configuration cannot grandfather unsafe behavior;
- flag state must not bypass `externalId` idempotency;
- flag state must not bypass source owner/caller matrix.

## 10. Mock / Demo / Screenshot Cutline

Mock/demo/screenshot artifacts are never runtime truth.

| Surface/artifact | Cutline rule |
|---|---|
| Home static reward/stats | `economy.mock.home_stats_blocked` |
| Connect mock wallet/transactions | `economy.mock.connect_wallet_blocked` |
| Connect Dashboard/Wallet screenshots | `economy.cutline.screenshot_as_proof_blocked` |
| Space mock balance/NFT/transactions | `economy.mock.space_nft_blocked` |
| Quest local completion/NFTBadge | `economy.mock.quest_nft_badge_blocked` |
| Rielt verifiedBooking mock | `economy.mock.rielt_verified_booking_blocked` |
| RF mock dashboards | Mock/demo evidence blocked |
| Share cards | Screenshot/share artifact, not proof |

Doctrine:

```text
mock_data != fallback
demo_data != fallback
screenshot != proof
share_card != proof
```

## 11. Projection / Diagnostic Proof Cutline

Projection and diagnostic flags control visibility/readiness, not authority.

Blocked interpretations:

- Dashboard as receipt;
- Wallet as financial wallet;
- ActivityFeed as audit trail;
- Profile as economy authority;
- Connect as accounting system;
- Admin snapshot as customer proof;
- diagnostic snapshot as ledger;
- projection row as support proof.

Rules:

```text
economy.projection.*.enabled != authority
economy.admin_diagnostics.*.enabled != customer_proof
projection_as_proof = blocked
diagnostic_as_customer_proof = blocked
```

## 12. Path B Cutline

Path B remains blocked for Stage 11.

Blocked:

- token-service activation;
- G2A;
- NFT mint;
- on-chain gateway;
- bridge;
- external wallet/custody;
- token/NFT proof;
- on-chain receipt;
- marketplace/trading.

Required doctrine:

```text
Path_B = blocked_for_Stage_11
token_service_ready != Path_A_ready
NFT_placeholder != NFT_feature
wallet_placeholder != financial_wallet
cutline_flag_present != Path_B_design
```

## 13. Producer / Reward / Badge Cutline

Producer flags do not create reward grants.

Blocked:

- future-only producers;
- forbidden producers;
- social rewards;
- creator economy;
- content monetization;
- contribution auto-reward;
- Quest auto-badge;
- Space auto-badge;
- Contribution auto-badge;
- broad Atlas/Pulse/Blog/Guru rewards;
- network accrual and referral bonus vocabulary.

Producer rules:

- `ACTIVE` producers can run only through approved runtime guardrails;
- `INTERNAL_BETA` producers require explicit existing flags;
- `FUTURE_ONLY` producers stay rejected;
- `FORBIDDEN_FOR_STAGE_11` producers stay rejected;
- unknown producers fail closed.

Badge rules:

```text
badge_award = user_badges row
badge_projection != badge_award
Quest_completion != badge_award
Space_activity != badge_award
contribution_candidate != badge_award
badge != NFT
```

## 14. Financial / Booking Cutline

Financial and booking semantics are blocked in Stage 11.

Blocked:

- payout;
- cashback;
- refund;
- payment;
- settlement;
- commission;
- booking;
- reservation;
- financial wallet;
- custody;
- top-up/withdraw.

Rules:

```text
Points != payout_system
RF voucher != cashback_or_payout
RF recovery != refund_promise
Rielt inquiry != booking_or_payment
Wallet != financial_wallet
```

## 15. Gamification Cutline

Stage 11 does not ban all future gamification. It bans premature/extractive/economic gamification now.

Allowed later:

- personal journey;
- symbolic recognition;
- soft progression;
- gentle motivation;
- non-financial achievement memory.

Blocked now:

- XP engine;
- level grinding;
- streak economy;
- leaderboard economy;
- social score;
- monetized prestige;
- rarity market;
- reaction farming;
- projection-driven status proof;
- reward farming.

Doctrine:

```text
soft_gamification_allowed_later: true
soft_progression.future_allowed = proposal_only
extractive_gamification_forbidden_now: true
economy.soft_progression.extractive_blocked = true_by_policy
```

## 16. Smoke Proof Readiness Cutline

Stage 11.7 prepares Stage 11.8 but does not start smoke proof.

Smoke proof requirements:

- owner facts required;
- projections forbidden as proof;
- mocks forbidden;
- diagnostics forbidden as proof;
- Path B excluded;
- unresolved DB-less fallbacks excluded or explicitly marked out of smoke scope;
- support lookup keys available;
- idempotency keys stable;
- producer allowlist class verified.

Before 11.8:

| Area | Requirement |
|---|---|
| Points | `points_transactions` row and `externalId` required |
| Quest | Outbox can be shown only as delivery intent; Points row required for reward proof |
| RF | Voucher row and optional Points spend row required |
| Content/Pulse | Persisted `event_registrations` required or excluded |
| Badges | `user_badges` row required |
| Admin diagnostics | Navigation only; not smoke proof |
| Projection | Forbidden as proof |
| Mock/demo | Forbidden |
| Path B | Excluded |

Smoke doctrine:

```text
economy.smoke.stage11.enabled = DEFER_TO_11_8
economy.smoke.owner_fact_required = proposal_only
economy.smoke.mock_forbidden = proposal_only
economy.smoke.projection_forbidden_as_proof = proposal_only
smoke_proof != rollout_evidence
```

## 17. Runtime / Schema / UI Decision

Stage 11.7 runtime/schema/UI decision:

```text
cutline_contract_status: DEFINED_NOT_IMPLEMENTED
cutline_runtime_status: DEFER
cutline_flag_registry_status: PROPOSAL_ONLY
flag_wiring_status: DEFER
schema_changes: false
api_openapi_changes: false
generated_sdk_type_changes: false
ui_changes: false
smoke_proof_status: DEFER_TO_11_8
```

Implementation-readiness notes:

| Need | Stage 11.7 action | Future status |
|---|---|---|
| Unified cutline registry | Define proposal in docs | Ready after acceptance |
| Runtime feature flag framework | Do not create | `DEFER / REQUIRES_SEPARATE_SLICE_APPROVAL` |
| Global flag wiring | Do not wire | `DEFER` |
| Existing env alias mapping | Document only | Ready for future implementation |
| Quest replay flag | Document gap | Future runtime slice |
| Mock/demo enforcement | Define cutline | Stage 12 or separate implementation |
| Projection metadata enforcement | Define cutline | Future API/UI slice |
| Admin diagnostics enforcement | Define cutline | Future admin/runtime slice |
| Smoke proof | Do not create | Stage 11.8 |
| Path B | Do not touch | `FORBIDDEN_FOR_STAGE_11` |

Implementation-readiness verdict:

```text
producer_enforcement_readiness: PARTIAL_POINTS_ONLY
rf_flag_readiness: PARTIAL_LEGACY_NAMES
quest_flag_readiness: GAP_REPLAY_UNGATED
api_gateway_flag_readiness: DEBUG_ONLY
frontend_mock_cutline_readiness: CONTRACT_ONLY
unified_registry_readiness: MISSING_BEFORE_11_7
stage_11_7_action: CREATE_DOCS_REGISTRY_ONLY
```

## 18. Stage 11 Slice Handoff

Stage 11.7 handoff to Stage 11.8:

- smoke proof may begin only after Stage 11.7 is accepted;
- smoke proof must use owner facts and owner IDs;
- smoke proof must not use flags as proof;
- smoke proof must not use projection, diagnostic, screenshot or mock as proof;
- Path B must remain excluded;
- unresolved Content DB-less registration risk must be fixed or excluded;
- Points admin lookup gap must be fixed or excluded from support-safe smoke scope.

Stage 11.7 handoff to Stage 12:

- UI copy/mock cleanup remains out of Stage 11.7;
- legacy NFT/G2A/bridge/wallet surfaces remain blocked or future-only;
- soft gamification can be designed later only under governance boundaries.

Explicit stop lines:

```text
do_not_start_11_8_in_11_7
do_not_start_stage_12_ui_alignment_in_11_7
do_not_start_path_b_in_11_7
do_not_create_runtime_flag_framework_in_11_7
do_not_change_services_in_11_7
```

## 19. Risk Register

| ID | Risk | Severity | Stage 11.7 mitigation |
|---|---|---|---|
| R-117-01 | Flag-as-proof collapse | CRITICAL | Flags explicitly excluded from proof chains |
| R-117-02 | Flag-as-reward / preview-as-grant | CRITICAL | Producer flags ingress-only; Points row remains proof |
| R-117-03 | `enabled=true` treated as MVP live | CRITICAL | Readiness manifest separate from flags |
| R-117-04 | Mock fallback on flag-off | CRITICAL | `mock_fallback = blocked` |
| R-117-05 | Path B positive enable flag | CRITICAL | Only blockers; Path B forbidden |
| R-117-06 | Partial rollout producer farming | CRITICAL | No broad rollout semantics in Stage 11.7 |
| R-117-07 | Environment drift staging vs prod | HIGH | Existing inventory and registry proposal |
| R-117-08 | Hidden route activation | CRITICAL | Route/surface cutline map |
| R-117-09 | Stale flag config cache | HIGH | Unknown/misconfigured flag fails closed |
| R-117-10 | Stale projection plus flag-on | HIGH | Projection proof cutline |
| R-117-11 | Admin diagnostic role leakage | CRITICAL | Admin diagnostics remain internal-only |
| R-117-12 | Smoke flag as rollout evidence | HIGH | Smoke deferred to 11.8 and not rollout proof |
| R-117-13 | Token-service ready spoofing | CRITICAL | `token_service_ready != Path_A_ready` |
| R-117-14 | Social/creator flag naming leakage | CRITICAL | Forbidden prefixes and social rewards blocked |
| R-117-15 | Extractive gamification via projection flag | HIGH | Gamification cutline |
| R-117-16 | Points-only cutline while global mocks remain | HIGH | Mock/demo/screenshot cutline |
| R-117-17 | Naming drift `ECONOMY_*` vs `economy.*` | MEDIUM | Alias map in proposed registry |
| R-117-18 | Internal-beta flag in public demo env | CRITICAL | Internal-beta != public readiness |
| R-117-19 | Quest replay ungated misunderstood as approved reward flow | HIGH | Future replay gate proposed; outbox not proof |
| R-117-20 | Content DB-less fallback enters smoke proof | CRITICAL | Exclude until persisted owner fact exists |

## 20. Review Gates

Stage 11.7 can be accepted only if these gates pass:

| Gate | Required result |
|---|---|
| Cutline boundary gate | Cutline flags are governance blockers, not product promises |
| Feature flag doctrine gate | Flag-as-proof/reward/readiness is forbidden |
| Inventory gate | Existing flags/env variables and mock surfaces inventoried |
| Registry gate | Proposed registry documented with aliases and categories |
| Fail-closed gate | Missing/unknown/misconfigured flags fail closed |
| Path B gate | Token/NFT/G2A/on-chain/bridge/wallet/custody blocked |
| Mock gate | Mock/demo/screenshot/share-card evidence blocked |
| Projection gate | Projection and diagnostic proof blocked |
| Producer gate | Future/forbidden/social/creator reward paths blocked |
| Financial gate | Payout/cashback/payment/booking/settlement blocked |
| Gamification gate | Soft future path preserved; extractive paths blocked now |
| Smoke gate | Smoke proof not started; owner-fact requirements defined |
| Runtime gate | No production service/schema/API/SDK/UI changes |

## 21. Acceptance Criteria

Stage 11.7 is successful if:

- cutline boundary is clearly defined;
- feature flag doctrine is defined;
- existing flag inventory is completed;
- proposed registry is documented;
- cutline categories are defined;
- service-by-service cutline map is created;
- fail-closed rules are frozen;
- Path B is blocked;
- mock/demo/screenshot evidence is blocked;
- projection/diagnostic proof is blocked;
- social rewards and auto-badges are blocked;
- financial/booking semantics are blocked;
- soft gamification clarification is preserved;
- smoke proof readiness cutline is defined;
- no runtime/schema/API/SDK/UI changes are made;
- no Path B leakage occurs;
- no Stage 11.8 smoke proof is started;
- next slice recommendation is included.

Acceptance status:

```text
cutline_boundary_defined: true
feature_flag_doctrine_defined: true
existing_flag_inventory_completed: true
proposed_registry_documented: true
cutline_categories_defined: true
service_by_service_cutline_map_created: true
fail_closed_rules_frozen: true
path_b_blocked: true
mock_demo_screenshot_evidence_blocked: true
projection_diagnostic_proof_blocked: true
social_rewards_auto_badges_blocked: true
financial_booking_semantics_blocked: true
soft_gamification_clarification_preserved: true
smoke_proof_readiness_cutline_defined: true
runtime_changes_made: false
schema_changes_made: false
api_sdk_changes_made: false
ui_changes_made: false
path_b_leakage: false
stage_11_8_started: false
```

## 22. Final Verdict

Stage 11.7 defines the MVP Cutline Enforcement Flags contract and implementation-readiness map.

Final verdict:

```text
stage_11_7_status: READY_as_docs_first_cutline_enforcement_contract
cutline_contract_status: DEFINED_NOT_IMPLEMENTED
cutline_flag_registry_status: PROPOSAL_ONLY
existing_flag_inventory_status: COMPLETED
producer_enforcement_status: PARTIAL_POINTS_ONLY
runtime_wiring_status: DEFER
schema_migration_status: false
openapi_sdk_status: false
ui_change_status: false
path_a_status: PRESERVED
path_b_status: FORBIDDEN_FOR_STAGE_11
smoke_proof_status: DEFER_TO_11_8
next_recommended_slice: Stage 11.8 — Runtime Smoke Proof
```

Stage 11.7 succeeds if flags remain internal governance guardrails and never become proof, authority, reward grants, customer promises, support receipts or public product readiness.

The correct next slice is:

```text
Stage 11.8 — Runtime Smoke Proof
```

Stage 11.8 may begin only after this 11.7 cutline contract is accepted. It must use owner facts and owner IDs only, exclude mocks/projections/diagnostics as proof, keep Path B blocked and explicitly handle unresolved gaps such as Content DB-less registration and missing Points admin lookup.
