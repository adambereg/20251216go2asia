# Stage 10.13 — Economy Runtime Landing Audit

Документ: `stage_10_13_economy_runtime_landing_audit_v1.md`  
Статус: docs-first landing audit before Stage 11  
Дата: 2026-05-21  
Scope: Path A runtime landing zones for bounded internal Go2Asia economy  
Mode: read-only audit; no implementation; no migrations; no schema/code/UI/API changes; no tests; no rollout; no token/NFT/on-chain gateway; no new economic semantics

## Executive Summary

Stage 10.13 проверяет, куда безопасно "приземлять" Stage 11 — MVP Economy Runtime Implementation — в существующем коде Go2Asia.

Главный вывод:

```text
can_move_to_stage_11: yes_with_preconditions
stage_11_should_start_with: Stage_11_0_Scope_And_Guardrails
stage_11_1_next_after_11_0: Activity_Event_Contract
runtime_landing_status: PARTIAL
largest_gap: canonical_activity_and_contribution_contract_missing
largest_risk: mock_projection_vocabulary_collapse_if_stage_11_writes_into_wrong_surfaces
path_b_status: DEFER
slice_16_status: blocked_not_triggered
```

В коде уже есть сильные runtime foundations:

- `points_transactions`, `user_balances`, `badges`, `user_badges`;
- Quest `quest_progress`, `quest_submission`, `quest_reward_outbox`;
- Space `space_post`, `space_activity_projection`, `space_profile_projection`;
- reactions and reaction aggregates;
- RF partner/offer/voucher lifecycle, paid spend flags and diagnostics;
- Rielt listings/inquiries;
- Content Atlas/Pulse/Blog foundations and `event_registrations`;
- Connect projections over Points/badges/RF/referrals.

Но Stage 11 нельзя начинать как "сразу пишем экономику в UI". Перед этим нужен узкий scope contract:

```text
activity_event != economic_fact
contribution_record != reward_grant
projection != authority
Points ledger = existing authority
Badge/progression = off-chain state only
RF voucher = utility lifecycle
Path B token/NFT/gateway = out of scope
```

## Scope & Non-Goals

### Scope

Stage 10.13 covers:

- existing runtime foundations;
- schemas, migrations, seeds, types and contracts;
- backend/API endpoints and service boundaries;
- frontend economy surfaces and projection targets;
- mock/fantasy economy risks;
- safe landing zones for Stage 11;
- do-not-touch zones;
- recommended Stage 11 slice order.

### Non-goals

Stage 10.13 does not:

- implement runtime;
- create services;
- create migrations;
- change DB schema;
- rename entities;
- change UI copy;
- change OpenAPI/SDK;
- activate new producers;
- expand economy semantics;
- design blockchain/token/NFT gateway;
- start Stage 11.

## Existing Economy Runtime Foundations

| Foundation | Status | Evidence | Stage 11 reuse | Notes |
|---|---|---|---|---|
| Points ledger | READY | `packages/db/src/schema/points.ts`, `apps/points-service/src/index.ts` | Use as Layer 1 authority | Existing `points_transactions`, `user_balances`, idempotent `externalId` |
| Badge/off-chain recognition | PARTIAL | `badges`, `user_badges`, `/internal/points/badges/award` | Use read/award state carefully | No progression engine; no Quest/Space badge activation |
| Quest activity/delivery | READY | `quest_progress`, `quest_submission`, `quest_reward_outbox`, Quest routes | Use as delivery-intent pattern | Outbox is delivery intent, not receipt |
| Space activity records | PARTIAL | `space_post`, `space_activity_projection`, `space_profile_projection` | Use as activity signal source | Not a Points producer |
| Reactions | PARTIAL | `reactions`, `reaction_aggregates`, idempotency keys | Use for interaction/activity only | Likes/bookmarks are not economic facts |
| RF voucher runtime | READY | `rf_partner`, `rf_offer`, `rf_voucher`, RF service routes | Use as voucher utility lifecycle | Not cashback/payout/payment |
| Rielt inquiry runtime | READY | `rielt_listing`, `rielt_listing_inquiry` | Use as listing/inquiry facts | Not booking/payment |
| Content/Pulse event registration | PARTIAL | `event_registrations`, `content-service` Points call | Use as narrow bounded producer | DB-less fallback is RISK |
| Profile economy fields | MISSING/PARTIAL | `user_profiles`; profile page placeholder | Stage 11 needs projection target, not source of truth | Profile should consume projections |
| Admin economy diagnostics | PARTIAL | Quest outbox internal routes; RF diagnostics | Use as diagnostic pattern | No unified admin economy diagnostics |
| Feature flags | PARTIAL | RF env flags, paid voucher spend flag, entitlement diagnostics flags | Reuse flag pattern | No unified economy feature flag registry |
| Unified contribution records | MISSING | No canonical `contribution_records` model found | Must define in Stage 11 | Do not fake through likes/views |

## Existing Data Models / Schemas / Types

The repo uses Drizzle schema files under `packages/db/src/schema/*` and SQL migrations under `packages/db/migrations`.

### READY

- `points_transactions`: economic fact rows for internal Points.
- `user_balances`: current Points projection/state.
- `badges` and `user_badges`: off-chain badge catalog and award state.
- `quest_progress`, `quest_submission`, `quest_reward_outbox`: Quest activity and reward delivery pipeline.
- `rf_voucher`, `rf_voucher_redemption`, RF idempotency/guard/recovery tables: voucher lifecycle and Points spend/recovery support.
- `rielt_listing` and `rielt_listing_inquiry`: listing and inquiry records.

### PARTIAL

- `space_activity_projection`: useful activity projection, but not canonical cross-module `activity_event`.
- `reactions`: valid interaction records, but not contribution/economic facts.
- `event_registrations`: valid activity fact, but current fallback path can award Points without persisted registration if DB is unavailable.
- `user_profiles` and `space_profile_projection`: profile/rendering state, not economy projection model.
- `referral_relations`: referral domain state, but Connect dashboard has known vocabulary/projection drift around `referral_locked` vs legacy bonus labels from Stage 10.12.

### MISSING

- Canonical `activity_event` contract/table for all modules.
- Canonical `contribution_record` model.
- Unified economy projection table for Profile / Connect / Admin.
- Unified admin economy diagnostics surface.
- Feature flag registry for MVP cutline enforcement.
- Runtime smoke proof contract.

### RISK

- `ACTIONS_PHASE2` includes vocabulary-only/future actions alongside active producers.
- `network_accrual_*`, `space_*`, `rielt_listing_created`, `rf_voucher_claimed/redeemed` can look Stage-11-ready but are not safe active producers.
- `token-service` exists as service skeleton and must not be interpreted as Path A readiness.

## Existing API / Backend Landing Zones

| Area | Status | Existing endpoints/services | Stage 11 landing role |
|---|---|---|---|
| Points | READY | `/v1/points/balance`, `/v1/points/transactions`, `/v1/wallet/summary`, `/v1/points/connect-dashboard`, `/internal/points/add`, `/internal/points/spend` | Points ledger and projections |
| Badges | PARTIAL | badge list/mine and internal award in Points Service | Minimal off-chain state, no progression engine |
| Quest | READY | `/v1/quests`, start/progress/submit/review, internal outbox replay/stats/failed/requeue | Activity event source and delivery-intent example |
| Content/Pulse | PARTIAL | events/articles/places and event registration flow | Narrow event registration activity + bounded Points producer |
| Space | PARTIAL | posts/feed/profile routes; activity projections | Activity signal source only |
| Reactions | PARTIAL | reactions endpoints and aggregates | Minimal interaction records, not reward source |
| RF | READY | partner/offer/voucher claim/redeem, RF diagnostics, entitlement flags | Voucher utility Layer 3 runtime |
| Rielt | READY | listing search/detail/inquiry/my inquiries | Inquiry facts and discovery projection |
| Guru | PARTIAL | nearby aggregator/ranking endpoints | Recommendation projection only |
| Feed | PARTIAL | feed/profile routes | User activity display candidate, not authority |
| Admin | MISSING/PARTIAL | RF internal diagnostics and Quest outbox ops only | Stage 11 needs admin economy diagnostics plan |
| Token/on-chain | DEFER | `token-service` health/ready only | Path B only, do not touch |

## Existing Frontend Economy Surfaces

| Surface | Status | What exists | Stage 11 implication |
|---|---|---|---|
| Connect Dashboard | PARTIAL | Points, badges, referrals, RF summary, ActivityFeed | Primary projection landing zone, must stay non-authority |
| Connect Wallet | PARTIAL/RISK | Points balance, buckets, transactions | Useful projection, but wallet/receipt semantics need guardrails |
| Connect Levels | READY/PARTIAL | badge catalog/user badges projection | Safe Layer 2 read projection |
| Profile | MISSING/PARTIAL | placeholder mentions off-chain badges/activity history | Good future projection target; do not make authority |
| Quest UI | PARTIAL | Quest catalog/detail/runner, reward previews | Stage 11 can connect activity/delivery, not local grant proof |
| RF UI | PARTIAL | catalogs, vouchers, PRO/merchant views | Runtime-backed but copy/proof boundaries remain important |
| Rielt UI | PARTIAL/RISK | listing/detail/inquiry/RF handoff, mock reviews | Keep as listing/inquiry only |
| Space UI | PARTIAL/RISK | feed/social routes; legacy mock economy components | Use social activity only; quarantine economy mocks |
| Atlas/Pulse/Blog/Guru | PARTIAL | content/discovery/ranking/event details | Context/contribution signals only |
| Home | RISK | static rewards and stats in authenticated path | Do not use as Stage 11 landing zone until mock quarantine |
| Admin | MISSING | no unified economy admin UI found | Stage 11 should create diagnostics plan first, not full admin product |

## Mock / Placeholder / Fantasy Economy Risks

| Surface | Status | Risk | Stage 11 handling |
|---|---|---|---|
| Home static rewards (`+50 Points`, badge received, level) | RISK | mock -> runtime truth | Do not land Stage 11 here before Stage 12/16 cleanup |
| Connect `mockData.ts` | RISK | fake ledger/future features revival | Keep as non-evidence; do not wire |
| Space Balance/NFT/Transactions/Quests/Vouchers/Referrals mocks | RISK | Space appears to own economy | Do not touch except quarantine in later UI alignment |
| Quest local Points/NFTBadge previews | RISK | preview -> grant; badge -> NFT | Stage 11 must use backend proof chain only |
| RF mock dashboards | RISK | merchant/pro summary -> statement/commission | RF runtime is usable; mock dashboards are not proof |
| Rielt `verifiedBooking`/mock reviews | RISK | inquiry -> booking proof | Do not use as runtime evidence |
| Guru/Atlas/Pulse popularity/reward placeholders | RISK | ranking/likes/views -> economic fact | Keep as projection/context only |
| Token/G2A/NFT/Bridge tabs/services | DEFER/RISK | Path B illusion | Explicitly out of Path A |

Forbidden interpretations remain:

```text
Wallet != financial_wallet
Dashboard != receipt
ActivityFeed != audit_trail
RF != cashback_or_payout
Rielt_inquiry != booking
Quest_preview != grant
badge != NFT_mint
mock_data != runtime_truth
```

## Stage 11 Landing Zones

| Stage 11 need | Recommended landing zone | Status | Constraint |
|---|---|---|---|
| Activity event contract | New contract over existing domain events/projections | MISSING | Define before schema/runtime writes |
| Points ledger minimal runtime | Existing Points Service | READY | Add no new producer semantics without allowlist |
| Contribution record model | New model or explicit contract | MISSING | Must separate from Points and likes/views |
| Badge/progression state | Existing `badges` / `user_badges` | PARTIAL | Off-chain only; no progression engine yet |
| Profile projection | Profile page + Connect data source | PARTIAL | Profile consumes projection, not authority |
| Connect projection | Existing Connect Dashboard/Wallet/Levels | READY/PARTIAL | Needs source/freshness/proof framing |
| Admin diagnostics | Quest outbox ops + RF diagnostics pattern | PARTIAL | Needs unified economy diagnostic plan |
| Feature flags | RF flag pattern | PARTIAL | Need Stage 11 flag naming and cutline enforcement |
| Runtime smoke proof | Points + Quest/RF/Content existing paths | PARTIAL | Smoke proof must not be rollout evidence |

## Do-not-touch Zones

Stage 11 Path A must not touch:

- blockchain gateway;
- wallet service for external custody;
- G2A token mechanics;
- off-chain -> on-chain conversion rules;
- minting on-chain NFTs from badges/totems;
- deposit/withdrawal gateway;
- payment/cashback/payout/settlement;
- marketplace settlement;
- DAO/governance;
- production financial accounting;
- complex RF enforcement beyond existing voucher utility;
- full social graph;
- full moderation/reputation runtime;
- full notification system;
- creator economy/content monetization;
- booking/payment in Rielt;
- progression/XP engine beyond minimal badge/progression state;
- Slice 16.

## Recommended Stage 11 Slice Order

The proposed order is mostly correct, but Stage 11 should start with an explicit scope firewall before runtime contracts.

Recommended order:

| Slice | Recommendation | Reason |
|---|---|---|
| 11.0 — Stage 11 Scope & Guardrails | KEEP FIRST | Prevents Stage 11 from becoming Path B/token/NFT/runtime expansion |
| 11.1 — Activity Event Contract | KEEP | Needed before contribution or projection writes |
| 11.2 — Points Ledger Minimal Runtime | KEEP | Reuse existing Points Service; define allowed producer envelope |
| 11.3 — Contribution Record Model | KEEP | Missing canonical model; should not be inferred from likes/views |
| 11.4 — Badge / Progression State Minimal Runtime | KEEP BUT NARROW | Use badges/user_badges only; no XP/progression engine |
| 11.5 — Economy Projection for Profile / Connect | KEEP | Connect/Profile/Admin need read models after facts/contracts exist |
| 11.6 — Admin Economy Diagnostics | KEEP | Required before support/smoke proof claims |
| 11.7 — Feature Flags & MVP Cutline Enforcement | CONSIDER MOVING EARLIER OR SPLITTING | Feature flags should exist before producers/projections are broadly wired |
| 11.8 — Runtime Smoke Proof | KEEP LATE | Only after facts/projections/diagnostics exist |
| 11.9 — Stage 11 Closure Review | KEEP | Confirm no Path B leakage |

Suggested adjustment:

```text
11.0 Scope & Guardrails
11.1 Activity Event Contract + Feature Flag Naming
11.2 Points Ledger Minimal Runtime + Producer Allowlist
11.3 Contribution Record Model
11.4 Badge/Progression Minimal State
11.5 Profile/Connect/Admin Projection Contract
11.6 Admin Economy Diagnostics
11.7 MVP Cutline Enforcement Flags
11.8 Runtime Smoke Proof
11.9 Closure Review
```

## Risk Register

| ID | Risk | Status | Impact | Mitigation before/during Stage 11 |
|---|---|---|---|---|
| R-1013-01 | Stage 11 writes directly into UI projections without activity contract | RISK | projection becomes authority | Start with 11.0/11.1 |
| R-1013-02 | Contribution model inferred from likes/views/saves | RISK | social farming and semantic collapse | 11.3 must define contribution record separately |
| R-1013-03 | `ACTIONS_PHASE2` vocabulary-only actions treated as active | RISK | phantom producers | Producer allowlist in 11.2 |
| R-1013-04 | Home/Space mocks used as runtime evidence | RISK | fake MVP demo | Keep out of Stage 11 landing zones |
| R-1013-05 | RF paid spend becomes payment/cashback semantics | RISK | financial overclaim | Keep RF as voucher utility only |
| R-1013-06 | Rielt inquiry used as booking/payment fact | RISK | marketplace/payment drift | Rielt remains inquiry-only |
| R-1013-07 | Badge state becomes NFT/progression engine | RISK | Path B leakage | Layer 2 remains off-chain minimal state |
| R-1013-08 | token-service interpreted as Stage 11 foundation | DEFER/RISK | Path B leakage | Do not touch token service |
| R-1013-09 | Admin diagnostics absent when smoke proof is attempted | PARTIAL/RISK | support/proof ambiguity | Add 11.6 before 11.8 |
| R-1013-10 | Feature flags introduced too late | PARTIAL/RISK | unsafe exposure of partial runtime | Define flag names in 11.1/11.2 |

## Required Preconditions Before Stage 11.1

Before implementing `11.1 — Activity Event Contract`, close these planning preconditions:

1. Freeze Stage 11 scope in `11.0`, including Path B deferral and no-new-semantics rules.
2. Define producer allowlist categories: active, internal-beta, future-only, forbidden.
3. Define owner-service truth map: Points, Quest, RF, Rielt, Content, Space/Reactions, Badges, Connect.
4. Decide whether `activity_event` is a new canonical table/contract or a service-level event envelope over existing tables.
5. Define `contribution_record` boundary: what is not a contribution, what is only a signal, and what can later become a reward candidate.
6. Define minimal feature flag naming for Stage 11 runtime exposure.
7. Mark Home/Space/Connect mock clusters as non-landing zones for Stage 11 runtime.

## Open Questions

- Should Stage 11 create a new central `activity_event` table, or define an event contract emitted by existing module services first?
- Should `contribution_record` be central, module-owned, or projection-only in the first implementation slice?
- Should Profile economy projection be backed by Connect dashboard APIs initially, or receive its own projection endpoint?
- What is the minimal Admin diagnostics scope: Points-only, or Points + Quest outbox + RF voucher + Content event registration?
- Should feature flags be service-local env flags first, or a shared config model?
- Should `event_registration` DB-less fallback be blocked before Stage 11 smoke proof?
- What is the exact smoke proof route: registration -> Quest -> Points -> Connect, or Quest-only first?

## Final Recommendation

Stage 10.13 verdict:

```text
stage_10_13_status: completed_as_docs_first_runtime_landing_audit
path_a_stage_11_possible: true_with_preconditions
path_b_blockchain_gateway_possible_now: false
runtime_foundations_status: PARTIAL
points_landing_zone: READY
quest_landing_zone: READY
rf_landing_zone: READY
rielt_landing_zone: READY
space_landing_zone: PARTIAL_activity_only
content_landing_zone: PARTIAL_event_registration_only
connect_projection_landing_zone: PARTIAL_ready_after_guardrails
profile_projection_landing_zone: MISSING_PARTIAL
admin_diagnostics_landing_zone: PARTIAL
activity_event_contract: MISSING
contribution_record_model: MISSING
feature_flag_cutline_enforcement: PARTIAL
largest_blocker_before_stage_11_1: missing_canonical_activity_event_and_contribution_boundaries
recommended_next_slice: Stage_11_0_Scope_And_Guardrails
stage_11_1_should_be: Activity_Event_Contract
blocked_now: token_NFT_gateway_creator_economy_booking_payment_payout_progression_engine
slice_16_status: blocked_not_triggered
```

Clear answer:

- Можно переходить к Stage 11, но не сразу к runtime implementation.
- Следующий slice должен быть `Stage 11.0 — Scope & Guardrails`.
- После 11.0 первым runtime-adjacent slice должен быть `11.1 — Activity Event Contract`.
- Абсолютных блокеров для начала Stage 11.0 нет.
- Блокеры перед Stage 11.1: нет canonical activity event contract, нет contribution record boundary, нет unified feature flag/cutline plan, и mock clusters всё ещё нельзя использовать как landing zones.
- Нельзя начинать сейчас Path B: token/NFT/G2A/bridge/wallet gateway, payout/cashback, booking/payment, creator economy, progression engine and Slice 16.
