# Stage 10.4 — Quest Economy Embodiment

Документ: `stage_10_4_quest_economy_embodiment_v1.md`  
Статус: docs-first audit/design  
Дата: 2026-05-21  
Scope: Quest runtime, reward outbox, delivery intent, reward previews, Space/Connect boundaries, Badge/Progression boundary

## 1. Executive Summary

Quest Asia является самым зрелым activity -> delivery intent -> Points integration flow в текущей внутренней off-chain экономике Go2Asia. В отличие от Space, который на Stage 10.3 был классифицирован как social contribution layer без active producer, Quest уже имеет bounded runtime path:

```text
quest completion / approved final submission
-> quest_progress completed
-> quest_reward_outbox row
-> delivery attempt to Points Service
-> Points Service response applied=true/false
-> Points economic_fact only inside Points Service
```

Но зрелость Quest нельзя читать как authority switch. Quest не является wallet, payout engine, reward authority, badge authority или receipt system. Quest является activity + reward delivery orchestration layer. Он может создавать activity facts, delivery intents и reward candidates, но Layer 1 economic authority остаётся только у Points Service.

Ключевой итог Stage 10.4:

```text
Quest_completion != reward_grant
Quest_outbox != receipt
Quest_delivery_intent != applied_grant
Quest_reward_preview != reward_grant
Quest_UI_projection != reward_receipt
```

Stage 10.4 ничего не активирует:

- no new Quest producers;
- no Quest reward expansion;
- no Quest -> Badge activation;
- no Badge/Progression runtime;
- no API/OpenAPI/SDK/schema/UI changes;
- no Points semantics changes;
- no Token/NFT/G2A/on-chain activation;
- no Slice 16 movement.

## 2. Why Stage 10.4 Exists

Stage 10.2 показал, что Quest — strongest delivery-intent producer flow. Это единственная текущая область, где completion может создать outbox delivery intent и вызвать Points Service через bounded service-to-service path.

Stage 10.3 показал, почему Quest должен идти сразу после Space:

- Space может быть social proof/source of activity, но не Points producer;
- Space quest reports/posts могут быть quest proof, но не Space contribution reward;
- legacy Space `QuestsView` и mock reward language могут создать ложную Quest reward history;
- Quest является главным мостом между activity layer и bounded internal economy.

Stage 10.4 нужен, чтобы зафиксировать честную модель Quest:

- completion является activity/progress fact;
- configured reward points являются reward candidate/configuration;
- `quest_reward_outbox` является delivery intent;
- Points response `applied=true` означает, что Points Service применил economic mutation;
- Quest UI является preview/projection, а не receipt;
- Quest badge/progression language остаётся future-only до Stage 10.5.

Quest нельзя превращать в payout layer, потому что Points остаются internal engagement/contribution utility, а не money, settlement, cashback, salary, commission или passive income.

## 3. Current Quest Surface Inventory

| Surface | Location | Runtime class | Proof class | Authority level | Collapse risk | MVP readiness | Verdict |
|---|---|---|---|---|---|---|---|
| Quest catalog/list | `apps/go2asia-pwa-shell/app/(public)/quest/QuestHomeClient.tsx` | production-shaped projection | runtime catalog projection | Quest read authority | Medium | MVP-ready | Safe as route list; reward copy must stay conditional |
| Quest detail | `app/(public)/quest/[id]/QuestDetailClient.tsx` | production-shaped projection | quest detail projection | Quest read authority | Medium/High | MVP-ready | Shows `Internal Points после подтверждения`; not grant |
| Quest runner | `app/(public)/quest/[id]/run/QuestRunnerClient.tsx` | production-shaped activity UI | submission/progress projection | Quest activity authority | Medium | MVP-ready | Safe as activity flow; proof is not economic proof |
| Quest start/progress | `quest-service` `/v1/quests/{id}/start`, `/progress` | production-shaped runtime | activity/progress fact | Quest runtime authority | Medium | MVP-ready | Activity only |
| Step submission | `quest-service` `/v1/quests/{id}/steps/{stepId}/submit` | production-shaped runtime | submission fact | Quest verification authority | High | MVP-ready | May advance/complete; not itself grant |
| Manual/space_post review queue | `QuestReviewQueue`, `/v1/submissions/{id}/review` | production-shaped bounded review | review decision fact | Quest manager authority | High | internal-beta | Review approval can trigger completion; not receipt |
| Quest completion | `quest_progress.status=completed` | production-shaped runtime | activity_fact | Quest runtime authority | High | MVP-ready | Completion != reward grant |
| Quest reward outbox | `quest_reward_outbox` | production-shaped delivery intent | delivery_intent | Quest delivery orchestration | High | MVP-ready as delivery layer | Outbox != receipt |
| Points delivery call | `questService.ts` `callPointsService()` | production-shaped integration | service-to-service delivery attempt | Points applies economic fact | High | MVP-ready bounded producer | Only Points applied=true is economic fact |
| Replay pending rewards | `/internal/quests/rewards/replay-pending` | production-shaped ops | retry delivery | Quest delivery orchestration | High | internal ops only | Not rollout evidence |
| Requeue failed rewards | `/internal/quests/rewards/outbox/requeue-failed` | production-shaped ops | operational recovery | Quest delivery orchestration | High | internal ops only | Requeue != new grant |
| Outbox stats/failed list | internal routes | projection/diagnostic | operational projection | Quest ops | Medium | internal ops only | Diagnostics != rollout evidence |
| Quest domain events | `QuestEventPublisher` noop/log | staged events | event_signal | no durable bus authority | Medium | future-only for event consumers | Contract/event != activation |
| Quest card legacy component | `components/quest/QuestCard.tsx` | local preview | reward preview | low/no authority | High | internal/demo | Preview only |
| CompletedQuestCard | `components/quest/MyQuests/CompletedQuestCard.tsx` | local calculation | local projection | no economic authority | High | dangerous until aligned | Local calculation != Points authority |
| PointsDisplay | `components/quest/QuestRewards/PointsDisplay.tsx` | local preview | local reward summary | no authority | High | dangerous until aligned | Preliminary Points only |
| NFTBadgeDisplay | `components/quest/QuestRewards/NFTBadgeDisplay.tsx` | local badge metadata | badge preview | no badge authority | High | future-only | NFTBadge != NFT mint |
| QuestRewards block | `components/quest/QuestDetail/QuestRewards.tsx` | preview | reward candidate preview | no economic authority | Medium/High | internal-beta | Good copy, still preview |
| Quest mockQuests | `components/quest/mockQuests.ts` | mock-only | mock reward/badge data | none | Critical | blocked for evidence | Quarantine |
| Quest PRO draft reward fields | `QuestDraftEditor.tsx` | production-shaped config UI | reward_candidate configuration | Quest config authority | High | internal-beta | Configured points != grant |
| Connect ActivityFeed Quest rows | `components/connect/Dashboard/ActivityFeed.tsx`, `copy.ts` | projection | Points transaction projection | Connect projection only | High | internal-beta | ActivityFeed != audit trail |
| Connect mock Quest transactions | `components/connect/mockData.ts` | mock-only | mock ledger rows | none | Critical | blocked | Mock Quest history != economic fact |
| Space Quest references | `components/space/mockData.ts`, Space stubs | mock/stub | cross-module preview | Space no authority | High | future-only | Space activity != Quest grant |

## 4. Quest Runtime Reality Map

### Runtime-owned activity/progress facts

Quest runtime owns:

- quest drafts, published quests and archived quests;
- quest steps with verification types;
- quest progress per user;
- quest submissions and review decisions;
- quest completion status;
- quest domain event staging.

Relevant runtime entities:

| Entity | Runtime meaning | Economy class |
|---|---|---|
| `quest` | Scenario/configuration | reward_candidate config if `reward_points` exists |
| `quest_step` | Step rules/verification | activity requirement |
| `quest_progress` | User progress state | activity_fact |
| `quest_submission` | Proof submitted for a step | activity/proof fact, not economic proof |
| `quest_reward_outbox` | Delivery intent to Points Service | delivery_intent |
| Points Service transaction | Applied economic mutation | economic_fact |

### Completion and outbox path

Observed backend flow:

```text
submit step
-> validate proof
-> create quest_submission
-> if auto-approved: complete step
-> if final step: complete quest_progress
-> build quest_completed reward payload if quest.reward_points > 0
-> completeQuestProgressAndEnsureRewardOutbox
-> quest_reward_outbox pending
-> call /internal/points/add
-> mark outbox delivered/pending/failed
```

For manual or `space_post` verification:

```text
submit step
-> quest_submission pending
-> quest_progress pending_review
-> PRO/admin review approve/reject
-> if approved and final: same completion/outbox path
```

### Points integration

Quest sends:

```text
action: quest_completed
externalId: quest:completed:{progressId}
sourceEventId: quest.completed:{progressId}
metadata: { questId, progressId, completedAt, rewardSource, questSlug? }
```

Points Service response is interpreted as:

| Points response | Quest delivery outcome | Meaning |
|---|---|---|
| 2xx + `applied=true` | `delivered` | Points Service applied reward |
| 2xx + `applied=false` | `delivered` | Points accepted duplicate/idempotent non-apply |
| 409 | `failed` | externalId conflict |
| 429 / 5xx / timeout / missing config | `pending` | retryable delivery not yet applied |
| non-retryable non-2xx | `failed` | delivery failed |

Critical boundary:

```text
quest_reward_outbox.status=delivered != receipt
Quest records delivery state, but economic fact lives in Points Service.
```

### Retry/requeue/replay

Quest has internal operations:

- replay pending reward deliveries;
- list failed reward outbox rows;
- requeue failed deliveries;
- outbox stats.

These are operational delivery controls, not launch evidence, not user receipts and not economic authority.

### Idempotency

Current idempotency backbone:

- `quest_progress` unique by `(quest_id, user_id)`;
- blocking submission prevents duplicate submission per progress/step;
- `quest_reward_outbox.external_id` unique;
- Points `externalId` is deterministic by progress id: `quest:completed:{progressId}`;
- duplicate Points acceptance can return `applied=false`.

Idempotency limitations to preserve in Stage 10.4:

- outbox delivered does not prove user saw the Points projection;
- local UI completion does not prove Points applied;
- requeue/replay must never be read as new reward generation;
- `applied=false` is accepted delivery, not a second grant.

### Missing or future-only boundaries

| Area | Current status | Required future boundary |
|---|---|---|
| Badge award | No active Quest -> Badge runtime | Stage 10.5 progression authority |
| NFT mint | No runtime | Stage 11+ only |
| Progression engine | Mostly semantic/local preview | Future badge/progression service |
| Space proof verification | `space_post` proof requires `postId`, but no observed cross-service validation in Stage 10.4 evidence | Needs Space validation/moderation if made high value |
| Connect projection alignment | Connect reads Points history/projections; Quest UI previews rewards | Stage 10.6 must clarify stale projections and authority |
| Domain events | Noop/log publisher | Future event bus/consumers must preserve contract != activation |

## 5. Quest Reward Semantics Model

### Canonical semantics

| Class | Quest examples | Authority | Is economic_fact? |
|---|---|---|---:|
| `activity_fact` | quest started, step submitted, step approved, quest completed | Quest Service | No |
| `delivery_intent` | `quest_reward_outbox` pending/delivered/failed row | Quest Service | No |
| `reward_candidate` | `quest.reward_points`, `quest_step.reward_points`, local reward preview, future badge metadata | Quest config/UI | No |
| `economic_fact` | Points transaction created/applied by Points Service after `/internal/points/add` | Points Service | Yes |
| `projection` | Quest detail reward summary, completion page, Connect ActivityFeed, Dashboard summary | Quest/Connect UI | No |
| `mock-only` | `mockQuests`, mock badges, local calculation utilities, Connect mock transactions | none | No |
| `future-only` | Quest badge award, progression unlock, NFT mint, on-chain export | future authority | No current fact |

### Required separations

```text
Quest_activity != economic_fact
Quest_reward_preview != reward_grant
Quest_outbox != receipt
Quest_completion_screen != Points_proof
Quest_local_calculation != Points_authority
Quest_badge_preview != badge_award
Quest_NFT_badge != NFT_mint
Quest_reward_candidate != economic_fact
Quest_delivery_intent != applied_grant
Quest_progression_signal != badge_grant
Quest_UI_projection != reward_receipt
```

### Safe reading contract

When Quest UI says "Internal Points после подтверждения", it means:

```text
configured reward candidate
+ runtime completion requirements
+ future/current delivery path
!= immediate Points grant
```

When Quest completes, the safe interpretation is:

```text
quest_progress completed
-> if configured reward_points > 0, delivery intent may exist
-> Points Service must apply or accept idempotently
-> Connect/Points projection may later show resulting transaction
```

## 6. Quest Mock / Preview / Projection Register

| Surface | Why dangerous | Current class | Collapse risk | Required future disposition |
|---|---|---|---|---|
| `mockQuests` rewards | Contains `points`, `nftBadges`, step rewards | mock-only | Critical | quarantine; never evidence |
| `mockNFTBadges` | Uses NFT naming, rarity, requirements | mock-only | High | rename later in Stage 10.5; keep inert |
| `QuestCard` reward area | Shows Points preview and off-chain preview | preview | Medium/High | keep with preview language; not receipt |
| `QuestDetailClient` `Internal Points после подтверждения` | Can be read as promised reward | projection/reward_candidate | Medium | keep conditional; Connect authority later |
| `QuestRewards` block | Shows Points and badge previews | preview | High | rename/clarify in Stage 10.10/10.5 |
| `PointsDisplay` | Animated local Points | local preview | High | quarantine unless isolated from runtime completion |
| `CompletedQuestCard` local total | Uses `calculateTotalPoints` and step local results | local calculation | Critical | quarantine for authority; local only |
| `NFTBadgeDisplay` | Type name `NFTBadge`, share action | badge metadata preview | High | rename later; share != proof |
| Legacy completion page | Isolated with warning copy | quarantined stub | Medium | keep inert; do not re-authoritize |
| `calculateQuestPoints` / multipliers | Speed/no-hint/streak local math | local calculation | High | future-only; not Points authority |
| `checkNFTBadgeRequirements` | Local badge eligibility logic | local progression preview | High | Stage 10.5 only |
| PRO `Reward points` fields | Configures reward candidate | production-shaped config | High | keep as candidate config; not grant |
| PRO review queue | Approve/reject can advance completion | runtime review | High | keep bounded; not moderation platform |
| Connect mock Quest transactions | Looks like Points history | mock-only | Critical | quarantine; Connect 10.6 |
| Space quest report text | Can mention Points/badges | mock/social proof | High | Space proof != economic proof |

Disposition options:

- `keep inert`: allowed as isolated legacy or preview surface;
- `quarantine`: do not use as runtime/evidence/receipt;
- `rename later`: Stage 10.5/10.10 vocabulary cleanup;
- `replace with Connect projection`: use Connect/Points read projection for applied economic facts;
- `future implementation candidate`: only after explicit authority and anti-abuse design.

## 7. Quest -> Badge / Progression Candidate Map

Stage 10.4 does not activate Quest -> Badge.

| Candidate | Current runtime status | Required authority | Required verification/moderation | Required idempotency | Anti-abuse need | Future-only or candidate | Current collapse risk |
|---|---|---|---|---|---|---|---|
| First quest completed badge | Quest completion exists | Badge/progression authority | Completion must be backend-confirmed | `badge:first_quest:{userId}` | multi-account farming | candidate for 10.5 | Medium |
| Route type badge | Quest metadata exists | Badge/progression authority | Quest type/category must be canonical | `badge:route:{userId}:{questId}` | duplicate quest variants | candidate | Medium |
| City explorer badge | City metadata exists | Badge/progression authority | unique city/quest validation | `badge:city:{userId}:{cityId}` | repeated/low-quality quests | future candidate | Medium |
| Seasonal quest badge | Season exists in local/mock types, not runtime canon here | Progression authority | season runtime required | `badge:season:{userId}:{seasonId}` | season farming | future-only | High |
| Perfect/no-hint badge | Local calculation exists | Progression authority | no-hint runtime evidence missing | TBD | local misuse | blocked | High |
| Speed badge | Local multiplier exists | Progression authority | trustworthy timing required | TBD | clock manipulation | blocked | High |
| Space report badge | Space proof type exists | Quest + Space + Badge authorities | Space post validation/moderation | `badge:space_report:{progressId}` | fake post proof | future-only | High |
| NFT badge mint | No runtime | Stage 11+ externalization authority | on-chain readiness | not applicable | speculative/ownership risk | blocked | Critical |

Guardrails:

```text
Quest_completion != badge_award
Quest_progression_signal != badge_grant
Quest_badge_preview != badge_award
Quest_NFT_badge != NFT_mint
badge != NFT_mint
```

## 8. Quest + Space Embodiment Boundary

Quest and Space are related, but neither replaces the other.

| Flow | Current/future meaning | Boundary |
|---|---|---|
| `space_action` step | Quest step type targeting `space_post` | Quest proof requirement, not Space reward |
| `verificationType=space_post` | Manual/pending review path | Space post id is proof input, not economic proof |
| Space quest report post | Social report/activity | Space activity != Quest grant |
| Quest completion shared in Space | Social projection | screenshot/share != proof |
| Space contribution signal | Stage 10.3 future model | Quest proof != Space contribution reward |
| Legacy Space `QuestsView` | mock-only reward display | must not replace Quest runtime |

Canonical boundary:

```text
Space_post_as_quest_proof
-> may satisfy a Quest step after Quest validation/review
-> may contribute to Quest completion
-> may create Quest delivery intent
!= Space contribution reward
!= independent Space Points producer
```

Risk:

- `space_post` proof currently requires a `postId` shape, but Stage 10.4 evidence does not establish full cross-service Space validation/moderation.
- If high-value rewards depend on Space proof, future implementation must add Space authority checks, post ownership, visibility/status, duplicate proof detection and moderation dependency.

## 9. Quest + Connect Projection Boundary

Connect is the projection hub. Quest is delivery orchestrator. Points Service is economic authority.

| Surface | What it shows | Correct interpretation | Risk |
|---|---|---|---|
| Quest detail reward text | configured reward candidate | Preview before completion and Points application | preview as promise |
| Quest completion/legacy page | isolated local notice | Not Points proof | screenshot-as-proof |
| Connect ActivityFeed | Points transaction projection | Projection of Points state, not receipt/audit trail | ActivityFeed as audit trail |
| Connect wallet/history | Points read projection | Read model from Points, not wallet authority | wallet/receipt collapse |
| Connect mock data | mock transactions including Quest | demo only | mock as proof |
| Dashboard summaries | recent activity/balances | projection only | stale projection as authority |

Required Stage 10.6 handoff:

- distinguish Quest preview from Connect applied projection;
- mark Connect ActivityFeed as projection, not receipt;
- ensure Quest completion and outbox state do not appear as applied Points unless Points Service applied/accepted them;
- remove or quarantine mock Quest transaction examples from MVP evidence.

## 10. Abuse & Collapse Risk Register

| Risk | Surface/flow | Severity | Abuse path | Current mitigation | Required future mitigation |
|---|---|---|---|---|---|
| Duplicate completion | final step submission/review | High | Repeat final step or review same submission | progress completed conflict, blocking submissions, unique progress | Keep idempotency, audit review paths |
| Duplicate outbox delivery | replay/requeue | High | Replaying pending/failed rewards | unique `external_id`, Points `applied=false` handling | Monitor duplicate delivery, expose projection carefully |
| Outbox as receipt | outbox delivered | High | Support/user reads delivered as receipt | none in user UI; internal only | docs/copy: outbox != receipt |
| Fake proof uploads | photo/text/space_post | High | Fake mediaId/postId/text | type/shape validation only | domain validation, media ownership, moderation |
| Space-post-as-proof abuse | `space_post` proof | High | Reuse fake/unowned post IDs | postId required | Space ownership/status/visibility validation |
| Local reward calculation misuse | `calculateTotalPoints`, `PointsDisplay` | High | UI local totals treated as applied Points | some copy says local/preview | quarantine; Connect projection only |
| Screenshot-as-proof | completion/reward screens | High | Completion screenshot used as receipt | legacy page warning | UX copy + support policy |
| Fake reward history | Connect/Quest mock rows | Critical | mock transactions treated as real | mock not authority | quarantine mock data |
| Badge preview as ownership | `NFTBadgeDisplay`, mock badges | High | badge metadata read as award/NFT | copy says backend confirms | Stage 10.5 rename/authority |
| Multi-account quest farming | published quests | High | Many accounts complete easy quests | auth/progress uniqueness per user | anti-abuse, caps, trust signals |
| Referral + Quest loops | referral plus quest completion | High | Sybil referrals complete quests | separate referral producer | cross-domain fraud matrix |
| Replayed proof attachments | media/space proofs | Medium/High | reuse same media/post across accounts | limited shape validation | proof uniqueness/ownership |
| Stale reward projection | Connect dashboard/feed | High | old state interpreted as current ledger | projection only | timestamps, authority links |
| Manual review collusion | PRO review queue | High | owner approves fraudulent submissions | ownership gates | moderation audit, separation for high-value |
| Retry/requeue abuse | internal replay endpoints | Medium/High | over-requeue failed rewards | service principal, outbox states | least privilege, rate limits, logs |

## 11. MVP Quest Economy Cutline

### MVP-ready

Quest is MVP-ready as bounded delivery layer if copy and guardrails remain explicit:

- published Quest catalog;
- Quest detail and runner;
- quest progress;
- step submissions;
- manual/space_post pending review;
- quest completion as activity fact;
- reward outbox as delivery intent;
- Points Service integration for `quest_completed` only;
- internal replay/requeue operations as operational controls.

### Internal-beta only

- Quest PRO draft/review console;
- outbox stats/failed/requeue views;
- Connect ActivityFeed Quest transaction projections;
- Quest detail reward previews;
- Space proof steps with higher-value rewards;
- manual review workflows beyond owner-scoped queue.

### Future-only

- Quest -> Badge award;
- Quest progression engine;
- no-hint/speed/streak rewards;
- seasonal progression rewards;
- Space report contribution rewards;
- RF voucher rewards embedded in Quest;
- NFT/on-chain export of quest badges;
- G2A/token rewards.

### Blocked

- Quest as wallet;
- Quest as payout/settlement engine;
- Quest as badge authority;
- Quest as receipt system;
- Quest completion screen as Points proof;
- local calculation as Points authority;
- new Quest producers beyond bounded `quest_completed`;
- Quest -> Badge activation;
- Slice 16 movement.

### Dangerous until aligned

- `NFTBadge` vocabulary;
- `PointsDisplay` local animation;
- `CompletedQuestCard` local totals;
- mockQuest reward/badge data;
- Connect mock Quest transaction rows;
- Space quest report text claiming Points/badges;
- reward copy without Connect/Points authority link.

## 12. Recommended Follow-up Slices

### Stage 10.5 — Badge / Progression Embodiment

Pass forward:

- `NFTBadge` type and display naming;
- Quest badge candidates;
- `checkNFTBadgeRequirements` local logic;
- distinction between Quest completion, progression signal and badge grant;
- rule that Quest can signal eligibility but cannot award/mint badges.

### Stage 10.6 — Connect Economy Hub Alignment

Pass forward:

- Quest preview vs Connect applied projection;
- Connect ActivityFeed and Wallet semantics for `quest_completed`;
- stale projection risks;
- Connect mock Quest transactions quarantine;
- Dashboard != receipt and ActivityFeed != audit_trail.

### Stage 10.10 — UX Copy & Proof-Class Alignment

Pass forward:

- `Internal Points после подтверждения`;
- `Points preview`;
- `Локальная оценка Points`;
- `NFTBadgeDisplay`;
- completion/reward/share copy;
- `Quest_outbox != receipt` and `Quest_completion_screen != Points_proof`.

### Stage 10.11 — MVP Economy Cutline

Pass forward:

- Quest MVP-ready as delivery layer;
- not badge authority;
- not payout layer;
- internal-beta boundaries for PRO review/outbox ops;
- future-only progression/badge expansion.

### Stage 10.12 — Implementation Readiness

Defer until separately approved:

- badge/progression authority implementation;
- stronger Space proof validation;
- proof uniqueness/ownership checks;
- anti-abuse caps for quest farming;
- Connect projection hardening;
- copy cleanup and legacy preview quarantine.

## 13. Multi-Agent Review Synthesis

| Role | Stage 10.4 assessment |
|---|---|
| ИИ-архитектор | Quest is the clearest delivery-intent layer, but not economic authority. Its main architecture value is the explicit outbox boundary before Points. |
| ИИ-аналитик | Product semantics must separate participation, completion, configured rewards, delivery state and applied Points. Quest is not payout or receipt. |
| ИИ-бэкенд-разработчик | Runtime path is production-shaped: progress, submissions, outbox, retry/requeue and Points call exist. Badge/progression handoff is not active. |
| ИИ-фронтенд-разработчик | Modern runtime Quest screens use safer copy, but legacy/local previews (`PointsDisplay`, `CompletedQuestCard`, `NFTBadgeDisplay`, `mockQuests`) remain dangerous until quarantined. |
| ИИ-тестировщик | Quest is MVP-ready as activity/delivery layer, not as badge authority. Outbox/retry needs careful interpretation and cannot be used as proof. |
| ИИ-специалист по безопасности | Key risks are duplicate/replayed reward delivery, fake proof, Space proof abuse, local calculation misuse, multi-account quest farming and badge ownership illusion. |
| ИИ-технический писатель | Canon should use five classes consistently: activity_fact, delivery_intent, reward_candidate, projection, economic_fact. Final verdict must preserve no activation. |

## 14. Guardrails Reconfirmed

Inherited guardrails:

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

Stage 10.4 Quest guardrails:

```text
Quest_activity != economic_fact
Quest_reward_preview != reward_grant
Quest_outbox != receipt
Quest_completion_screen != Points_proof
Quest_local_calculation != Points_authority
Quest_badge_preview != badge_award
Quest_NFT_badge != NFT_mint
Quest_reward_candidate != economic_fact
Quest_delivery_intent != applied_grant
Quest_progression_signal != badge_grant
Quest_UI_projection != reward_receipt
```

## 15. Final Verdict

```text
stage_10_4_status: completed_as_docs_first_quest_embodiment_audit
quest_delivery_intent_model_confirmed: true
quest_economic_authority: points_service_only
quest_completion_equals_reward_grant: false
quest_outbox_equals_receipt: false
quest_delivery_intent_equals_applied_grant: false
quest_reward_preview_equals_reward_grant: false
quest_local_calculation_authority: false
quest_mock_projection_risk: high
quest_badge_activation_present: false
quest_progression_candidate_model_defined: true
quest_mvp_ready_as_delivery_layer: true
quest_mvp_ready_as_badge_authority: false
quest_space_boundary_defined: true
quest_connect_projection_boundary_defined: true
quest_new_producers_activated: false
quest_reward_expansion_activated: false
quest_to_badge_activation_allowed_in_stage_10_4: false
recommended_next_slice: Stage_10_5_Badge_Progression_Embodiment
recommended_parallel_slice: Stage_10_6_Connect_Economy_Hub_Alignment
slice_16_status: blocked_not_triggered
```

Honest Stage 10.4 conclusion:

Quest is the most mature orchestration and delivery layer in the current Go2Asia internal economy. It can turn verified activity into a delivery intent and ask Points Service to apply a bounded `quest_completed` reward. But Quest is not reward authority, not badge authority and not a receipt system. Completion is not grant; preview is not proof; outbox is not receipt. Quest can become an important source of future progression signals, but Quest -> Badge and NFT-compatible language must remain future-only until Stage 10.5+ and separate implementation readiness.
