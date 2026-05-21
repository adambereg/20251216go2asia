# Stage 10.2 Points Producer Reality Map v1

Date: 2026-05-21
Status: `COMPLETED_AS_DOCS_FIRST_PRODUCER_AUDIT`
Stage: `Stage 10.2 / Points Producer Reality Map`
Mode: docs-first, read-only producer audit, no implementation, no activation, no new producers, no farming system, no economy redesign, no frontend changes, no backend changes, no API change, no OpenAPI change, no SDK change, no schema change, no migrations, no tests added, no test execution as evidence, no staging/live evidence, no rollout, no Token/NFT/G2A/on-chain activation, no wallet/bridge/marketplace activation, no payout/settlement/cashback activation, no Points enforcement activation, no Quest to Badge activation, no Slice 16 movement

Primary sources:

- `docs/roadmaps/stage_10_economy_embodiment_alignment_roadmap_correction_v1.md`
- `docs/architecture/domain/stage_10_1_economy_surface_inventory_and_classification_v1.md`
- `docs/architecture/domain/stage_9_10_ecosystem_maturity_module_readiness_audit_v1.md`
- `docs/architecture/domain/stage_9_11_ecosystem_economy_layer_implementation_audit_v1.md`
- `apps/points-service/src/index.ts`
- `apps/points-service/src/idempotency.ts`
- `apps/auth-service/src/index.ts`
- `apps/referral-service/src/index.ts`
- `apps/referral-service/src/bonus.ts`
- `apps/quest-service/src/services/questService.ts`
- `apps/content-service/src/index.ts`
- `apps/rf-service/src/routes/rf.ts`
- `packages/db/src/schema/points.ts`
- `packages/db/src/schema/quest.ts`
- `packages/db/src/schema/rf.ts`
- `docs/openapi/points.yaml`
- `docs/openapi/rf.yaml`
- `docs/openapi/quest.yaml`

AI review roles used:

- `docs/ai/roles/architect.md`
- `docs/ai/roles/requirements_analyst.md`
- `docs/ai/roles/backend_dev.md`
- `docs/ai/roles/frontend_dev.md`
- `docs/ai/roles/qa.md`
- `docs/ai/roles/security.md`
- `docs/ai/roles/tech_writer.md`

## 1. Executive Summary

Stage 10.2 answers one question:

```text
who actually produces Points economic_facts today?
```

The answer is narrower than the visible economy vocabulary.

Current active or production-shaped Layer 1 producers are:

- `auth-service` for `registration` and `first_login`;
- `referral-service` for `referral_locked`;
- `quest-service` for `quest_completed` through `quest_reward_outbox`;
- `content-service` for `event_registration`;
- `rf-service` for feature-flagged `rf_voucher_claim_spend` and recovery `rf_voucher_claim_spend_compensation`.

Everything else is either activity-only, delivery-intent, projection-only, mock-only, vocabulary-only, docs-only, future-only or intentionally absent.

The most important Stage 10.2 finding is:

```text
allowed_action != active_producer
```

The Points Service action vocabulary is intentionally broader than the current producer topology. This is useful for phased architecture, but dangerous for MVP claims if UI, docs or AI agents read allowed actions as active runtime producers.

Current producer reality:

```text
implementation_center: Points_Service
active_producer_count: 7
active_grant_producer_count: 5
active_spend_or_recovery_producer_count: 2
delivery_intent_surface_count: 1
activity_only_surface_count: 8
projection_only_surface_count: 8
mock_reward_surface_count: 5
allowed_action_without_runtime_count: 11
proof_class_collapse_risk: high
largest_producer_gap: broad_points_action_vocabulary_without_matching_runtime_emitters
most_dangerous_producer_illusion: Space_Home_Guru_reward_surfaces_plus_Connect_projection_labels
```

Stage 10.2 does not add producers. It only separates real Points producers from vocabulary, previews, projections, mock UI and future tokenomics.

## 2. Why Stage 10.2 Exists

Stage 10.1 mapped economy surfaces. It showed where Points, rewards, balances, badges, RF vouchers, Quest rewards, G2A and NFT wording appear.

That inventory is not enough because a surface can look like a producer without actually producing Points.

Examples:

- Connect displays Points history, but does not produce Points.
- Quest completion is an activity fact; Points grant happens only after outbox delivery and Points Service acceptance.
- RF voucher claim/redeem is a lifecycle fact; Points mutation exists only for the feature-flagged paid voucher spend/recovery path.
- Space post/reaction surfaces exist, and Points action vocabulary includes Space actions, but no Space runtime caller to Points Service is present.
- Rielt listing, Atlas/Pulse/Blog/Guru reward wording exists in docs/UI vocabulary, but active Points producers are absent or narrower.
- Home and Space mock reward surfaces can make non-runtime rewards look real.

Producer reality is more important than vocabulary because MVP users and support teams need to know what the system actually applies, not what the roadmap or UI can describe.

Producer illusion is dangerous for MVP because it creates false expectations:

- user performs activity and expects Points;
- support sees ActivityFeed/Dashboard and treats it as grant proof;
- AI agents see `ACTIONS_PHASE2` or SDK enums and assume producers exist;
- mock reward screens are read as current economy;
- network/referral vocabulary is mistaken for active accrual.

Stage 10.2 therefore creates the canonical producer map before:

- Stage 10.3 Space embodiment;
- Stage 10.4 Quest embodiment;
- Stage 10.6 Connect hub alignment;
- Stage 10.10 UX copy/proof-class alignment;
- Stage 10.11 MVP economy cutline.

## 3. Producer Classification Model

| Producer class | Definition | Produces Layer 1 `economic_fact`? |
|---|---|---|
| `active_runtime_producer` | A runtime path currently calls `/internal/points/add` or `/internal/points/spend` and can create a `points_transactions` row. | Yes |
| `delivery_intent_producer` | A runtime path creates an outbox or delivery attempt that may later call Points Service. | Not by itself |
| `activity_only_producer` | A runtime path creates an activity/lifecycle fact, but does not mutate Points. | No |
| `projection_only_surface` | A UI/API read model displays Points or related status from existing facts. | No |
| `mock_only_reward_producer` | Local/static/demo surface pretends to award or show rewards. | No |
| `vocabulary_only_producer` | Action exists in enum/copy/SDK/OpenAPI but no runtime caller was found. | No |
| `docs_only_producer` | Documentation says a module can reward or contribute, but runtime path is absent. | No |
| `future_only_producer` | Producer belongs to future G2A/NFT/token/on-chain/externalization layer. | No |
| `intentionally_absent_producer` | Producer is explicitly forbidden or absent under Stage 9/10 guardrails. | No |

Proof chain classes:

```text
activity_fact -> delivery_intent -> Points_Service_acceptance -> economic_fact
```

Only the final Points Service acceptance can create the current Layer 1 economic fact.

Required guardrail:

```text
Quest_completion != reward_grant
RF_redeem != payout
Dashboard != receipt
ActivityFeed != audit_trail
allowed_action != active_producer
```

## 4. Active Runtime Producer Inventory

| Producer | Service | Trigger | Action | Layer | Runtime class | Proof chain | Authority | Idempotency | Anti-abuse | MVP readiness | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Registration Points | `auth-service` | Clerk `user.created` | `registration` | Layer 1 | active runtime producer | auth event -> `/internal/points/add` -> `points_transactions` row with `applied=true` | Points Service for economic fact | `auth:user.created:{userId}` | Points externalId conflict detection; non-blocking call; service JWT | MVP-ready | Grants 100 Points when configured; graceful degradation if Points unavailable. |
| First Login Points | `auth-service` | Clerk `user.updated` with `last_sign_in_at` | `first_login` | Layer 1 | active runtime producer | auth update -> `/internal/points/add` -> Points row | Points Service | `auth:first_login:{userId}` | externalId idempotency; heuristic trigger; non-blocking call | internal-beta-only | Heuristic can be noisy, but externalId keeps one row per user. |
| Referral Locked Points | `referral-service` | Referral activation/first-login relation path | `referral_locked` | Layer 1 | active runtime producer | referral relation -> locked input -> `/internal/points/add` -> Points row | Referral owns relation; Points owns economic fact | `referral:locked:{referrerId}:{refereeId}` | externalId idempotency; relation uniqueness; service JWT | MVP-ready with framing | Current real referral reward path; not `referral_bonus_referrer`. |
| Quest Completion Reward Delivery | `quest-service` | Quest progress completion with positive `reward_points` | `quest_completed` | Layer 1 | delivery-intent producer with active Points delivery | completion -> `quest_reward_outbox` -> `/internal/points/add` -> Points row | Quest owns completion/outbox; Points owns economic fact | `quest:completed:{progressId}` | unique quest/user progress; unique outbox externalId; retry/pending/failed states; Points idempotency | internal-beta-only | Completion alone is activity fact; outbox is delivery intent; Points row is grant fact. |
| Event Registration Points | `content-service` | Event registration / Pulse-like event sign-up | `event_registration` | Layer 1 | active runtime producer | event registration -> `/internal/points/add` -> Points row | Content owns event registration; Points owns economic fact | DB mode: `content:event_registration:{registrationId}`; DB-less fallback: `content:event_registration:{eventId}:{userId}` | event registration unique user/event when DB exists; Points idempotency; non-blocking call | internal-beta-only | Represents Pulse/content event registration, not broad Pulse rewards. |
| RF Paid Voucher Spend | `rf-service` | Paid voucher claim with spend feature flag and Points cost | `rf_voucher_claim_spend` | Layer 1 | active spend producer when flag enabled | RF claim -> `/internal/points/spend` -> negative Points row | RF owns voucher lifecycle; Points owns debit fact | `rf:voucher-claim-spend:{voucherId}` | feature flag; balance check; RF idempotency; Points spend idempotency; conflict handling | internal-beta-only | Utility debit only; not payment, payout or cashback. |
| RF Spend Compensation | `rf-service` | Recovery after spend/claim failure | `rf_voucher_claim_spend_compensation` | Layer 1 | active recovery producer | RF recovery -> `/internal/points/add` -> compensation row | RF owns recovery cause; Points owns add fact | `rf:voucher-claim-spend-compensation:{voucherId}` | recovery table externalId uniqueness; Points idempotency | internal-beta-only | Technical correction, not reward loop. |

Producer authority summary:

```text
Points_Service: economic_fact_authority
auth_service: identity_event_producer
referral_service: referral_relation_producer
quest_service: activity_and_delivery_intent_producer
content_service: event_registration_producer
rf_service: voucher_lifecycle_and_spend_recovery_producer
Connect: projection_only
Space: activity_only_for_social_runtime_no_points_producer
Rielt: product_runtime_no_points_producer
Atlas/Pulse/Blog/Guru: context_or_docs_vocabulary_no_points_producer
```

## 5. Allowed Action vs Producer Drift Map

The Points Service currently allows the following Phase 2 action vocabulary:

```text
registration
first_login
referral_bonus_referee
referral_bonus_referrer
referral_locked
referral_unlock
event_registration
space_post_created
space_repost_created
space_reaction_created
network_accrual_level_1
network_accrual_level_2
quest_completed
rielt_listing_created
rf_partner_verified
rf_voucher_claimed
rf_voucher_redeemed
rf_voucher_claim_spend
rf_voucher_claim_spend_compensation
```

| Action | Current classification | Runtime caller found | Notes |
|---|---|---|---|
| `registration` | runtime-backed | `auth-service` | Active producer. |
| `first_login` | runtime-backed | `auth-service` | Active producer, heuristic trigger. |
| `referral_bonus_referee` | vocabulary-only | none found | Present in action enum/copy/SDK; not current referral producer. |
| `referral_bonus_referrer` | vocabulary/demo-only | demo seed and old projections, no active caller found | Connect dashboard/referral demo drift exists; current real action is `referral_locked`. |
| `referral_locked` | runtime-backed | `referral-service` | Active referral producer. |
| `referral_unlock` | vocabulary-only | none found | Unlock semantics are planned/docs vocabulary, not active producer. |
| `event_registration` | runtime-backed | `content-service` | Active event registration producer. |
| `space_post_created` | vocabulary-only | no `space-service` Points caller found | Allowed action but not active Space producer. |
| `space_repost_created` | vocabulary-only | no `space-service` / `reactions-service` Points caller found | Social action only today. |
| `space_reaction_created` | vocabulary-only | no `space-service` / `reactions-service` Points caller found | Social/reaction fact only today. |
| `network_accrual_level_1` | vocabulary-only | none found | Network accrual illusion risk. |
| `network_accrual_level_2` | vocabulary-only | none found | Network accrual illusion risk. |
| `quest_completed` | delivery-intent/runtime-backed | `quest-service` | Completion -> outbox -> Points call. |
| `rielt_listing_created` | vocabulary/demo-only | no `rielt-service` Points caller found | Present in copy/demo; not active producer. |
| `rf_partner_verified` | vocabulary-only | no RF Points caller found | RF verification is activity/status, not Points producer today. |
| `rf_voucher_claimed` | vocabulary-only | no RF Points add caller found | Voucher claim is lifecycle fact; not Points grant. |
| `rf_voucher_redeemed` | vocabulary-only | no RF Points add caller found | Redeem is lifecycle fact; not Points grant. |
| `rf_voucher_claim_spend` | runtime-backed spend | `rf-service` | Negative Points mutation when feature flag and cost apply. |
| `rf_voucher_claim_spend_compensation` | runtime-backed recovery | `rf-service` | Technical compensation add. |

Drift summary:

```text
allowed_actions_total: 19
runtime_backed_actions: 7
delivery_intent_actions: 1
allowed_action_without_runtime_count: 11
highest_drift_actions: space_post_created, space_reaction_created, network_accrual_level_1, network_accrual_level_2, referral_bonus_referrer, rielt_listing_created
```

Important nuance:

`quest_completed` is counted as active producer only after the outbox delivery reaches Points Service. Quest completion itself remains `activity_fact`.

## 6. Producer Topology Map

### Auth

```text
Clerk user.created
-> identity event
-> auth-service calls /internal/points/add
-> Points Service idempotency by auth:user.created:{userId}
-> points_transactions row
-> economic_fact
```

```text
Clerk user.updated / first login heuristic
-> identity activity
-> auth-service calls /internal/points/add
-> Points Service idempotency by auth:first_login:{userId}
-> points_transactions row
-> economic_fact
```

### Referral

```text
referral relation activation
-> referral_relation fact
-> buildReferrerLockedPointsInput()
-> action: referral_locked
-> externalId: referral:locked:{referrerId}:{refereeId}
-> /internal/points/add
-> points_transactions row
-> economic_fact
```

Not active:

```text
referral_bonus_referrer != active_runtime_producer
referral_bonus_referee != active_runtime_producer
referral_unlock != active_runtime_producer
network_accrual != active_runtime_producer
```

### Quest

```text
quest step approved / progress reaches completion
-> quest_progress.completed
-> activity_fact
-> buildQuestCompletionRewardPayload()
-> quest_reward_outbox row
-> delivery_intent
-> quest-service calls /internal/points/add
-> Points Service applied=true
-> economic_fact
```

If Points Service returns duplicate:

```text
Points accepted duplicate reward
-> applied=false
-> not a new economic grant
```

### RF

Voucher lifecycle without Points:

```text
voucher_claim
-> RF lifecycle fact
-> not Points producer
```

```text
voucher_redeem
-> RF lifecycle fact
-> not payout
-> not Points producer
```

Paid voucher spend:

```text
paid voucher claim with pointsCost and RF_ENABLE_PAID_VOUCHER_SPEND
-> RF spend runtime
-> /internal/points/spend
-> action: rf_voucher_claim_spend
-> externalId: rf:voucher-claim-spend:{voucherId}
-> negative points_transactions row
-> economic_fact debit
```

Recovery:

```text
spend applied but claim/recovery requires compensation
-> rf_voucher_economy_recovery
-> /internal/points/add
-> action: rf_voucher_claim_spend_compensation
-> economic_fact correction
```

### Content / Pulse Event Registration

```text
event registration
-> content-service event_registrations row when DB exists
-> /internal/points/add
-> action: event_registration
-> points_transactions row
-> economic_fact
```

Important boundary:

```text
Pulse event rewards != broad Pulse producer
event_registration == active content-service producer
```

### Connect

```text
Points/referral/badge/RF facts
-> Connect dashboard / wallet / activity feed
-> read_projection
-> no Points mutation
```

Answer:

```text
Connect is not a producer.
Connect is a projection hub only.
```

### Space

```text
post/repost/reaction/social activity
-> Space/Reactions activity facts
-> no Points Service caller found
-> activity_only
```

Current classification:

```text
space_post_created: vocabulary-only
space_repost_created: vocabulary-only
space_reaction_created: vocabulary-only
Space mock rewards: mock-only
```

### Rielt

```text
listing created / listing RF voucher bridge
-> product/listing fact
-> no Points Service caller found
-> activity_only or product_context
```

Current classification:

```text
rielt_listing_created: vocabulary/demo-only
Rielt RF vouchers: RF projection/bridge, not Rielt Points producer
```

### Atlas / Pulse / Blog / Guru

```text
content/discovery/context activity
-> docs/UI vocabulary may mention rewards
-> no direct Points producer found for broad contribution rewards
-> docs-only or projection-only
```

Exception:

```text
content-service event_registration is active for events.
```

### G2A / NFT / Tokenomics

```text
future tokenomics docs / token-service health
-> future_placeholder
-> no Points producer
-> no token/NFT producer
```

## 7. Producer Authority vs Projection Map

| Area | Creates economic facts? | Creates activity facts? | Creates delivery intent? | Displays projection? | Current authority |
|---|---|---|---|---|---|
| Points Service | Yes | No | No | Yes for reads | Economic fact authority |
| Auth Service | Via Points call | Yes | No | No | Identity event producer |
| Referral Service | Via Points call for `referral_locked` | Yes | No | Yes | Referral relation authority |
| Quest Service | Via Points delivery after outbox | Yes | Yes | Yes | Quest activity/delivery authority |
| RF Service | Via Points spend/recovery only | Yes | No | Yes | Voucher lifecycle authority |
| Content Service | Via Points call for event registration | Yes | No | Yes | Content/event registration authority |
| Connect | No | No | No | Yes | Projection hub only |
| Space Service | No | Yes | No | Some social projections | Social activity authority only |
| Reactions/Feed | No | Yes | No | Yes | Social activity/projection |
| Rielt Service | No | Yes/product facts | No | Yes | Listing/inquiry authority only |
| Atlas/Pulse/Blog/Guru | No for broad rewards | Content/discovery facts | No | Yes | Context/discovery authority |
| Token Service | No | No | No | Health only | Skeleton only |
| Home/Space/Guru mocks | No | Mock only | No | Mock | No runtime authority |

Key answer:

```text
Connect shows producer outputs.
Connect is not a producer.
```

Projection-only surfaces must never be used as grant evidence:

- Wallet summary;
- Dashboard;
- ActivityFeed;
- referral earned summaries;
- Connect RF panels;
- Space/Home static reward lists.

## 8. Producer Abuse & Collapse Risk Register

| ID | Risk | Surface / producer | Severity | Current control | Stage 10.2 finding |
|---|---|---|---|---|---|
| PAR-01 | Replay or duplicate grant | Points `/internal/points/add` | High | `externalId` SSOT, duplicate returns `applied=false`, conflict returns 409 | Strong core control. |
| PAR-02 | First login repeated by noisy webhook | `auth-service` `first_login` | Medium | externalId per user | Economic duplicate controlled, trigger semantics still heuristic. |
| PAR-03 | Referral loop / false bonus expectation | referral surfaces and `referral_bonus_*` vocabulary | High | active path is `referral_locked`; relation uniqueness | Bonus/unlock vocabulary broader than runtime. |
| PAR-04 | Quest completion read as grant | Quest completion UI/outbox | High | outbox + Points applied semantics | Must preserve `Quest_completion != reward_grant`. |
| PAR-05 | Quest duplicate delivery | Quest outbox replay | Medium-high | outbox externalId unique, Points idempotency | `delivered` can still be misread as new credit if `applied=false`. |
| PAR-06 | RF compensation abuse | RF spend recovery | High | externalId per voucher, recovery table uniqueness, Points idempotency | Compensation is technical correction, not reward loop. |
| PAR-07 | RF claim/redeem as cashback/payout | RF lifecycle | High | no Points add for claim/redeem; spend is utility debit | `rf_voucher_claimed/redeemed` vocabulary has no active Points producer. |
| PAR-08 | Space farming illusion | Space actions in vocabulary | High | no Points caller found | Highest planned-producer gap. |
| PAR-09 | Network accrual illusion | `network_accrual_level_1/2` | High | no runtime caller found | Must be future/planned, not MVP producer. |
| PAR-10 | Rielt listing reward illusion | `rielt_listing_created` | Medium-high | no active caller found | Demo/copy vocabulary only today. |
| PAR-11 | Stale projection treated as grant proof | Connect Dashboard/ActivityFeed | High | read-only copy partially present | Connect is projection-only. |
| PAR-12 | Local reward calculations | Quest/Home/Space mocks | High | tests isolate one Quest complete surface; no producer | Mock reward surfaces are not producers. |
| PAR-13 | Token/NFT reward activation illusion | tokenomics/G2A/NFT docs | Critical | Stage 10.0 moved gateway to Stage 11+ | No Layer 3/4 producer exists. |
| PAR-14 | Diagnostics as evidence | Points/RF diagnostics | High | diagnostics endpoints read-only/flagged | Not rollout evidence, not producer proof. |
| PAR-15 | OpenAPI enum as activation | SDK generated `PointsAction` | High | docs guardrails | SDK vocabulary includes non-active producers. |

## 9. MVP Producer Readiness Snapshot

### MVP-ready

Safe for internal MVP with existing guardrails:

- `auth-service` `registration`;
- `referral-service` `referral_locked`;
- Points Service idempotent `add`/read core.

### Internal-beta-only

Useful but needs Stage 10 alignment before broad claims:

- `auth-service` `first_login`;
- `quest-service` `quest_completed` delivery through outbox;
- `content-service` `event_registration`;
- `rf-service` `rf_voucher_claim_spend`;
- `rf-service` `rf_voucher_claim_spend_compensation`;
- Connect projections of producer output.

### Future-only

Not current producers:

- G2A token rewards;
- NFT/on-chain rewards;
- totem/tablet/achievement reward producers;
- broad Atlas/Pulse/Blog/Guru contribution rewards;
- full network accrual.

### Blocked

Must not be treated as producers:

- token-service `/ready`;
- Bridge/external wallet/marketplace flows;
- payout/settlement/cashback;
- receipt/export proof systems;
- Slice 16.

### Dangerous until aligned

Require Stage 10 follow-up before user-facing economy claims:

- Space post/reaction/repost rewards;
- Home static reward list;
- Guru rewards strings;
- Rielt listing rewards;
- `referral_bonus_referrer/referee` vocabulary;
- `referral_unlock`;
- `network_accrual_level_1/2`;
- `rf_voucher_claimed/redeemed` as Points actions;
- Quest local reward calculations;
- Connect `Начислено Points` and ActivityFeed.

Approximate producer readiness distribution:

```text
mvp_ready_producer_percentage: 16_percent_approx
internal_beta_producer_percentage: 32_percent_approx
future_only_producer_percentage: 16_percent_approx
blocked_producer_percentage: 11_percent_approx
dangerous_until_aligned_producer_percentage: 25_percent_approx
```

The percentage is intentionally conservative because it counts visible/proposed producer vocabulary, not only backend callers.

## 10. Recommended Follow-up Slices

### Stage 10.3 — Space Asia Economy Embodiment

Reason:

```text
Space has action vocabulary and mock rewards, but no active Points producer.
```

Needed later:

- decide whether Space actions become producers;
- define contribution signal and anti-abuse;
- quarantine mock rewards until implementation approval.

### Stage 10.4 — Quest Economy Embodiment

Reason:

```text
Quest is the strongest delivery-intent producer, but completion/grant collapse remains high.
```

Needed later:

- preserve activity -> outbox -> Points fact chain;
- clarify outbox `delivered` vs `applied=true`;
- no Quest to Badge activation in Stage 10.2.

### Stage 10.5 — Off-chain Badge / Progression Layer

Reason:

```text
Badge award infra exists, but no active producer/caller was found.
```

Needed later:

- define badge producer criteria;
- keep badge != NFT mint;
- avoid NFT reward vocabulary.

### Stage 10.6 — Connect Economy Hub Alignment

Reason:

```text
Connect displays producer output but is not a producer.
```

Needed later:

- mark projection-only surfaces;
- remove producer illusion from Dashboard/ActivityFeed/referrals copy;
- align wallet summary wording.

### Stage 10.7 — RF / Voucher / PRO Economy Vocabulary Alignment

Reason:

```text
RF claim/redeem are lifecycle facts, not Points producers except spend/recovery.
```

Needed later:

- separate claim/redeem/pro attribution from Points mutation;
- preserve RF != cashback_system and RF_redeem != payout.

### Stage 10.8 — Rielt / Atlas / Pulse / Blog / Guru Producer Reading Guards

Reason:

```text
docs/product vocabulary mentions rewards beyond active producers.
```

Needed later:

- mark docs-only/future-only producers;
- prevent AI agents from treating module docs as runtime.

### Stage 10.10 — UX Copy & Proof-Class Alignment

Reason:

```text
producer illusion is often created by copy, not runtime.
```

Priority copy risks:

- `Начислено Points`;
- `Wallet`;
- `ActivityFeed`;
- Home rewards;
- Space rewards;
- Guru `Points + NFT`;
- RF rewards/compensation.

### Stage 10.11 — MVP Economy Cutline

Use this producer map to define:

- which producers can be claimed in MVP;
- which remain internal beta;
- which are future-only;
- which are blocked.

### Stage 10.12 — Implementation Readiness Plan

Only later, as planning:

- backend tasks for approved producers;
- anti-abuse requirements;
- OpenAPI/SDK vocabulary tasks;
- test tasks;
- rollout blockers.

Stage 10.12 still must not activate Stage 11, Stage 12 or Slice 16.

## 11. Inherited Guardrails

```text
token != money
NFT != receipt
badge != NFT_mint
Points != payout_system
Wallet != financial_wallet
RF != cashback_system
RF_redeem != payout
Quest_completion != reward_grant
Dashboard != receipt
ActivityFeed != audit_trail
screenshot != proof
diagnostics != rollout_evidence
contract != activation
stable_enough != launch_ready
slice_16_status = blocked_not_triggered
```

Stage 10.2-specific rules:

```text
allowed_action != active_producer
producer_vocabulary != runtime_producer
activity_fact != economic_fact
delivery_intent != grant_receipt
projection_surface != producer
mock_reward != producer
docs_claim != producer
token_service_ready != token_runtime
Connect != Points_producer
RF_claim != Points_grant
RF_redeem != payout
Quest_completion != reward_grant
```

## 12. Final Verdict

```text
stage_10_2_status: completed_as_docs_first_producer_audit
active_runtime_producer_count: 7
active_grant_producer_count: 5
active_spend_or_recovery_producer_count: 2
activity_only_surface_count: 8
delivery_intent_surface_count: 1
projection_only_surface_count: 8
mock_reward_surface_count: 5
allowed_action_without_runtime_count: 11
allowed_action_total_count: 19
runtime_backed_action_count: 7
largest_producer_gap: broad_points_action_vocabulary_without_matching_runtime_emitters
most_dangerous_producer_illusion: Space_Home_Guru_reward_surfaces_plus_Connect_projection_labels
most_important_authority_boundary: Connect_is_projection_hub_not_producer
most_important_delivery_boundary: Quest_completion_to_outbox_to_Points_applied_true
most_important_business_boundary: RF_claim_redeem_lifecycle_not_points_grant_or_payout
mvp_ready_producer_percentage: 16_percent_approx
internal_beta_producer_percentage: 32_percent_approx
future_only_producer_percentage: 16_percent_approx
blocked_producer_percentage: 11_percent_approx
dangerous_until_aligned_producer_percentage: 25_percent_approx
proof_class_collapse_risk: high
producer_illusion_risk: high
stage_11_readiness: false
stage_12_readiness: false
recommended_next_slice: Stage_10_3_Space_Asia_Economy_Embodiment
recommended_parallel_slice: Stage_10_10_UX_Copy_And_Proof_Class_Alignment
token_nft_g2a_onchain_activation: forbidden
wallet_bridge_marketplace_activation: forbidden
payout_settlement_cashback_activation: forbidden
points_enforcement_activation: forbidden
quest_to_badge_activation: forbidden
slice_16_status: blocked_not_triggered
```

Stage 10.2 confirms that Go2Asia has a real internal Points economy, but its real producer set is much smaller than its vocabulary. The system should be described today as a bounded Points economy with auth, referral, quest, content event registration and RF spend/recovery producers. Space, broad Rielt/Atlas/Pulse/Blog/Guru rewards, network accrual, NFT/progression rewards, G2A and tokenomics are not active producers.
