# Stage 11.1 — Activity Event Contract + Feature Flag Naming

Документ: `stage_11_1_activity_event_contract_and_feature_flag_naming_v1.md`  
Статус: docs-first contract; no runtime implementation  
Дата: 2026-05-22  
Scope: Stage 11.1 of Path A — Practical Implementation Wave  
Mode: read-only architecture design; no migrations; no DB schema changes; no OpenAPI/SDK/generated changes; no production service changes; no UI changes; no producer activation; no runtime event persistence; no `activity_events` table; no feature flag wiring; no Path B; no Slice 16

## 0. Orchestration Summary

Task classification: HIGH-risk runtime/economy contract slice.  
Execution mode: docs-first contract only / read-only architecture design.  
Lead role: AI Program Director / Orchestrator.  
Recommended model: GPT-5.5 Medium for runtime governance, economy, security/fraud and architecture reasoning.  
Artifact: this single markdown report.

Controlling document:

- `docs/roadmaps/stage_11_0_scope_and_guardrails_v1.md`

Source docs reviewed:

- `docs/roadmaps/stage_10_13_economy_runtime_landing_audit_v1.md`
- `docs/architecture/domain/stage_10_12_implementation_readiness_plan_v1.md`
- `docs/architecture/domain/stage_10_11_mvp_economy_cutline_v1.md`
- `docs/ai/roles/orchestrator.md`
- `docs/ai/roles/runtime_governance_architect.md`
- `docs/ai/roles/economy_architect.md`
- `docs/ai/roles/security.md`
- `docs/ai/roles/architect.md`
- `docs/ai/roles/slice_strategist.md`
- `docs/ai/roles/tech_writer.md`

Read-only factual areas checked:

- `packages/db/src/schema/points.ts`
- `packages/db/src/schema/quest.ts`
- `packages/db/src/schema/rf.ts`
- `packages/db/src/schema/rielt.ts`
- `packages/db/src/schema/content.ts`
- `packages/db/src/schema/space.ts`
- `packages/db/src/schema/reactions.ts`
- `packages/db/src/schema/referral.ts`
- `apps/points-service/src/*`
- `apps/quest-service/src/*`
- `apps/rf-service/src/*`
- `apps/rielt-service/src/*`
- `apps/content-service/src/*`
- `apps/space-service/src/*`
- `apps/reactions-service/src/*`
- `apps/api-gateway/src/*`
- `docs/openapi/*`
- `packages/sdk/src/generated/*`
- `packages/types/src/generated/*`

Context capsule status:

```text
docs_ai_context_status: MISSING
docs_ai_context_action: not_created
```

Multi-agent review passes:

| Pass | Role | Status | Result |
|---|---|---|---|
| Orchestrator pass | AI Program Director | `READY` | Stage 11.1 is docs-only contract slice |
| Runtime Governance pass | Runtime Governance Architect | `READY` | `activity_event` must be envelope/contract, not table/authority |
| Economy pass | Economy Architect | `READY` | Points ledger remains only economic authority; no producer expansion |
| Architecture pass | Software Architect | `READY` | Owner-service event source map confirmed from schemas/services/contracts |
| Security/Fraud pass | Security / Fraud & Abuse Specialist | `READY` | replay, duplicates, fake activity, farming and mock-as-event guardrails defined |
| Slice Strategist pass | Slice Strategist | `READY` | 11.1 remains docs-only; runtime work moves to later slices |
| Canon Writer pass | Technical Canon Writer | `READY` | Stable vocabulary, forbidden vocabulary and verdict wording aligned |

## 1. Executive Summary

Stage 11.1 defines the contract vocabulary for `activity_event` and the naming taxonomy for Stage 11 feature flags.

Stage 11.1 does not implement runtime behavior. It does not create tables, migrations, API contracts, SDK/generated types, frontend surfaces, services, queues, workers or feature flag wiring.

The core decision:

```text
activity_event = contract/envelope over owner-service facts
activity_event != canonical table in Stage 11.1
activity_event != economic authority
activity_event != reward grant
activity_event != support proof
```

The contract exists to let later slices reason consistently about cross-module activity without collapsing:

- Points ledger into activity feed;
- Quest delivery intent into reward proof;
- RF voucher lifecycle into cashback/payment;
- Rielt inquiry into booking/payment;
- Space/Reactions social signals into reward producers;
- Connect/Profile/Admin projections into authority;
- mock/demo data into runtime truth.

Stage 11.1 may be accepted if:

- `activity_event` is defined as envelope/contract only;
- proof-class vocabulary is frozen;
- owner-service event sources are classified;
- idempotency/replay/duplicate expectations are documented;
- feature flag naming is defined but not wired;
- all runtime work is handed off to later slices.

## 2. Activity Event Definition

`activity_event` is a normalized cross-service envelope over existing owner-service facts.

It describes:

- what happened;
- where the owner fact lives;
- who or what caused it;
- which source service owns it;
- whether it may be projected;
- whether it has any proof value;
- how duplicates/replays should be interpreted;
- which support lookup keys can be used later.

Contract definition:

```text
activity_event = normalized envelope over owner-service domain facts
+ source owner trace
+ proof class
+ idempotency / replay keys
+ projection eligibility
+ bounded payload
```

Important:

- This is contract vocabulary, not DB schema.
- This is not an OpenAPI or SDK change.
- This is not runtime persistence.
- This is not producer activation.
- This is not a new source of truth.

Stage 11.1 recommendation:

```text
activity_event_contract_form: envelope_first
canonical_activity_events_table_status: FUTURE_ONLY
runtime_event_persistence_status: DEFER
```

## 3. Activity Event Non-Goals

Hard doctrine:

```text
activity_event != economic_fact
activity_event != reward_grant
activity_event != proof
activity_event != UI_activity_feed
activity_event != Space_activity_projection
activity_event != Connect_dashboard_row
activity_event != support_receipt
activity_event != mock_event
```

Stage 11.1 does not:

- create `activity_events`;
- create migrations;
- change DB schema;
- change OpenAPI;
- change SDK/generated types;
- change production services;
- change UI;
- write runtime event persistence;
- create `contribution_record`;
- activate producer flags;
- activate runtime flags;
- wire feature flags;
- make `activity_event` an audit trail;
- make `activity_event` support proof;
- make social signals reward-eligible;
- touch token-service;
- activate G2A/token/NFT/on-chain/bridge/wallet;
- add payment/booking/payout/cashback/settlement semantics;
- revive Slice 16.

Forbidden interpretations:

| Misread | Status | Rule |
|---|---|---|
| Activity event as Points ledger | `FORBIDDEN_FOR_STAGE_11` | Points ledger remains authority |
| Activity event as reward grant | `FORBIDDEN_FOR_STAGE_11` | Producer policy and Points row required |
| Activity event as support receipt | `FORBIDDEN_FOR_STAGE_11` | Support uses owner IDs |
| Activity event as audit trail | `FORBIDDEN_FOR_STAGE_11` | Activity feed/projection is not audit |
| Activity event as contribution record | `DEFER` | Stage 11.3 defines contribution model |
| Activity event as mock/demo event | `FORBIDDEN_FOR_STAGE_11` | Mock/demo never event authority |

## 4. Activity Event Envelope

This is a contract proposal, not schema implementation.

| Field | Required? | Meaning | Guardrail |
|---|---|---|---|
| `eventId` | Yes | Stable envelope identity | Must not be reused across semantic changes |
| `eventType` | Yes | Canonical activity type | Namespaced by owner/service; must not imply reward unless proof class is `economic_fact` |
| `eventVersion` | Yes | Contract version | Required for additive evolution and replay interpretation |
| `occurredAt` | Yes | Time the owner-domain action happened | Should come from owner-service fact when available |
| `recordedAt` | Yes | Time the envelope was recorded/materialized | Must not replace `occurredAt` |
| `sourceService` | Yes | Owner or emitting service | Examples: `points-service`, `quest-service`, `rf-service` |
| `sourceEventId` | Conditional | Source event or owner fact ID | Required when owner has event/fact ID |
| `sourceRecordKey` | Yes | Stable owner lookup key | Required for support trace and projection replay |
| `actorUserId` | Conditional | User who caused the domain action | Optional for system events; never trusted from client alone |
| `subjectType` | Yes | Domain object type | Examples: `quest`, `voucher`, `listing`, `event`, `space_post` |
| `subjectId` | Yes | Domain object ID | Must point to owner-domain object where possible |
| `correlationId` | Conditional | Cross-service trace ID | Required for outbox, recovery, multi-service and support flows |
| `requestId` | Conditional | Request-level trace ID | Useful for debugging, not proof by itself |
| `idempotencyKey` | Conditional | Duplicate/replay control key | Required for economic, delivery, lifecycle, inquiry and mutable social flows |
| `proofClass` | Yes | Governance class | Controls projection/proof eligibility |
| `payload` | Optional | Bounded domain metadata | Must not duplicate owner truth or hide reward semantics |
| `metadata` | Optional | Non-authoritative processing/context metadata | Not a proof source |
| `visibility` | Yes | Intended visibility class | `internal`, `user_projection`, `admin_diagnostic`, `blocked` |
| `projectionAllowed` | Yes | Whether projections may show it | Projection permission does not imply authority |

Recommended field constraints:

| Constraint | Rule |
|---|---|
| Owner trace | Every projectable event must have `sourceService` and `sourceRecordKey` |
| Proof class | Every event must declare `proofClass` explicitly |
| No hidden rewards | `payload` must not carry hidden Points amount or reward promise unless owner fact is Points |
| No client authority | Client-provided IDs can be hints, never owner truth |
| Replay-safe | `eventId`, `sourceRecordKey`, `idempotencyKey` and `correlationId` must be enough to reason about duplicate handling |
| Projection-safe | `projectionAllowed = true` only means display eligibility |
| Mock-safe | mock/demo/local data must use `mock_or_demo` or be excluded entirely |

Example naming style:

```text
quest.progress.completed
quest.submission.approved
quest.reward.delivery_intent.created
points.transaction.applied
content.event_registration.created
rf.voucher.claimed
rf.voucher.redeemed
rielt.inquiry.created
space.post.created
reaction.created
referral.locked
badge.awarded
```

These names are vocabulary only in Stage 11.1. They do not create runtime events.

## 5. Proof-Class Vocabulary

Proof class determines whether an event can support proof, projection or diagnostics. It is not equivalent to UI label.

| Proof class | Meaning | Allowed source | Can support Points proof? | Can appear in Profile/Connect/Admin projection? | Key danger |
|---|---|---|---|---|---|
| `activity_fact` | Owner-backed non-economic activity fact | Quest progress/submission, Space post, owner domain rows | No | Yes, if source owner and freshness are shown | Activity becomes reward grant |
| `economic_fact` | Applied internal Points ledger fact | Points `points_transactions` only | Yes | Yes | Ledger confused with generic activity |
| `delivery_intent` | Intent/retry path to deliver reward/effect | Quest `quest_reward_outbox` | No, until matching Points row exists | Admin yes; user projection with caution | Outbox becomes receipt |
| `voucher_lifecycle_fact` | RF utility lifecycle fact | `rf_voucher`, `rf_voucher_redemption`, RF idempotency/recovery rows | Only as RF/Points trace context, not standalone | Yes | Voucher becomes cashback/payment |
| `listing_inquiry_fact` | Rielt contact request fact | `rielt_listing_inquiry` | No | Yes | Inquiry becomes booking/payment |
| `content_registration_fact` | Pulse event registration fact | `event_registrations` | Only if bounded producer and Points row exists | Yes | Registration becomes attendance/payout |
| `social_signal` | Social interaction or publication signal | `space_post`, `reactions`, `reaction_aggregates` | No | Yes, as signal only | Likes/posts become farming source |
| `projection` | Read model/feed/dashboard row | Connect, Profile, Feed, Space activity projection | No | Yes | Projection becomes authority |
| `diagnostic_snapshot` | Operator/support diagnostic snapshot | RF diagnostics, Quest outbox ops, Points lookup patterns | No, but may point to owner proof | Admin only | Diagnostic becomes customer receipt |
| `mock_or_demo` | Mock, seed, demo, local placeholder | Home/Space/Connect/RF/Rielt/Guru mocks | No | No, except clearly blocked demo contexts | Mock becomes runtime truth |
| `forbidden_as_proof` | Explicitly rejected proof artifact | screenshots, share cards, local previews, token-service `/ready`, UI totals | No | No | Support accepts invalid evidence |

Support implications:

```text
economic_fact = Points row only
delivery_intent = retry/intent, not receipt
projection = display only
diagnostic_snapshot = operator aid only
mock_or_demo = never evidence
forbidden_as_proof = never accepted
```

## 6. Owner-Service Event Source Map

| Owner/service | Source of truth | Possible event source | Proof class | Forbidden interpretation | Stage 11.1 rule |
|---|---|---|---|---|---|
| Points | `points_transactions`, `user_balances` | `points_transactions.id`, `externalId`, `sourceService`, `sourceEventId`, `reason` | `economic_fact` | Wallet, Dashboard or activity row as ledger | Points remains only economic authority |
| Quest | `quest`, `quest_step`, `quest_progress`, `quest_submission`, `quest_reward_outbox` | progress/submission/outbox IDs; local domain event vocabulary such as `quest.completed` | `activity_fact`, `delivery_intent` | Quest preview/completion/outbox as reward receipt | Event may describe progress/intent only |
| RF | `rf_partner`, `rf_offer`, `rf_voucher`, `rf_voucher_redemption`, RF idempotency/recovery rows | voucher, redemption, recovery and idempotency records | `voucher_lifecycle_fact`, `diagnostic_snapshot` | cashback, payout, payment, settlement, commission | RF is voucher utility lifecycle |
| Rielt | `rielt_listing`, `rielt_listing_inquiry`, listing actor/media links | listing/inquiry records | `listing_inquiry_fact`, `activity_fact` | booking, payment, reservation, ownership proof | Inquiry means contact request only |
| Content | `countries`, `cities`, `places`, `events`, `articles`, `event_registrations` | event registration and content facts | `content_registration_fact`, `activity_fact` | attendance, payout, creator reward | Event registration only; no broad content rewards |
| Space | `space_post`, `space_group`, `space_group_member` | post/repost/group/member facts | `social_signal`, `activity_fact` | Space Points producer, wallet, NFT, reward history | Social context only |
| Reactions | `reactions`, `reaction_aggregates`, `reaction_idempotency_keys` | reaction rows and idempotency records | `social_signal` | likes/bookmarks as reward grants | Interaction signal only |
| Referral/Auth | `users`, `user_profiles`, `referral_links`, `referral_relations` | user creation/login/referral relation lifecycle | `activity_fact`, `economic_fact` only through Points | commission, network accrual, referral payout | `registration`/`referral_locked` stay bounded |
| Badges | `badges`, `user_badges` via Points Service | badge award rows | `activity_fact` or future badge fact; not Points proof | NFT mint, wallet asset, receipt, XP engine | Off-chain recognition only |
| Connect | No canonical economy table | Dashboard/Wallet/Levels/ActivityFeed read rows | `projection` | authority, receipt, audit trail, financial wallet | Projection hub only |
| Profile | `user_profiles`; `space_profile_projection` for social rendering | profile read/projection rows | `projection` | economy source of truth, badge/Points authority | Projection consumer only |
| Admin | Diagnostics/ops routes over owner services | RF diagnostics, Quest outbox ops, Points lookup patterns | `diagnostic_snapshot` | customer proof, receipt, ledger | Support surface only |
| Token Service | Health/ready skeleton only | none for Path A | `forbidden_as_proof` | Path A token/NFT readiness | `DEFER`; do not touch |

## 7. Existing Domain Facts That May Inform Events

These facts may inform future `activity_event` envelopes after a later implementation decision. They are not changed in Stage 11.1.

| Domain | Existing fact | Key fields | Candidate proof class | Notes |
|---|---|---|---|---|
| Points | `points_transactions` | `id`, `userId`, `amount`, `reason`, `sourceService`, `sourceEventId`, `externalId`, `createdAt` | `economic_fact` | Only source of Points proof |
| Points | `user_balances` | `userId`, `balance`, `updatedAt` | `projection` / state snapshot | Balance is current state, not event authority |
| Badges | `badges` | `id`, `code`, `title`, `category`, `isActive` | catalog/projection | Catalog is not award proof |
| Badges | `user_badges` | `id`, `userId`, `badgeId`, `sourceService`, `sourceType`, `sourceId`, `earnedAt` | activity/badge fact | Off-chain only |
| Quest | `quest_progress` | `id`, `questId`, `userId`, `status`, `startedAt`, `completedAt` | `activity_fact` | Progress/completion fact, not Points proof |
| Quest | `quest_submission` | `id`, `progressId`, `stepId`, `userId`, `proofType`, `status` | `activity_fact` | Review/submission fact |
| Quest | `quest_reward_outbox` | `id`, `questProgressId`, `questId`, `userId`, `action`, `externalId`, `sourceEventId`, `status` | `delivery_intent` | Delivery intent only |
| RF | `rf_voucher` | `id`, `offerId`, `partnerId`, `issuedToUserId`, `canonicalStatus`, `claimScope`, `pointsDebitExternalId` | `voucher_lifecycle_fact` | Utility lifecycle |
| RF | `rf_voucher_redemption` | `id`, `voucherId`, `userId`, `partnerId`, `resultStatus`, `idempotencyKey`, `correlationId` | `voucher_lifecycle_fact` | Redeem lifecycle, not payout |
| RF | `rf_claim_idempotency` | `operation`, `actorUserId`, `idempotencyKey`, `voucherId` | diagnostic/idempotency fact | Duplicate control |
| RF | `rf_voucher_economy_recovery` | `voucherId`, `spendExternalId`, `compensationExternalId`, `correlationId`, `state` | `diagnostic_snapshot` / lifecycle trace | Recovery trace, not cashback |
| Rielt | `rielt_listing` | `id`, `createdByUserId`, `status`, `publishedAt` | `activity_fact` | Listing fact, not ownership/payment |
| Rielt | `rielt_listing_inquiry` | `id`, `listingId`, `requesterUserId`, `status`, `idempotencyKey`, `createdAt` | `listing_inquiry_fact` | Contact request only |
| Content | `events` | `id`, `status`, `startAt`, `endAt`, `isFree`, `priceAmount` | content fact | Event metadata, not user achievement |
| Content | `event_registrations` | `id`, `eventId`, `userId`, `status`, `registeredAt` | `content_registration_fact` | Registration != attendance |
| Space | `space_post` | `id`, `authorId`, `postType`, `visibility`, `status`, `publishedAt` | `social_signal` / `activity_fact` | Not Points producer |
| Space | `space_activity_projection` | `id`, `recipientUserId`, `actionType`, `sourceStream`, `sourceRecordKey`, `sourceEventId` | `projection` | Not canonical activity event |
| Reactions | `reactions` | `id`, `userId`, `targetType`, `targetId`, `reactionType`, `status` | `social_signal` | Not reward |
| Reactions | `reaction_idempotency_keys` | `userId`, `idempotencyKey`, `payloadHash`, `reactionId` | diagnostic/idempotency fact | Duplicate control |
| Referral | `referral_relations` | `id`, `referrerId`, `refereeId`, `registeredAt`, `firstLoginAt` | `activity_fact` | No commission/network accrual |

## 8. What Must Not Become Activity Event Authority

These surfaces or artifacts must not become `activity_event` authority:

| Artifact | Why not authority | Required classification |
|---|---|---|
| `space_activity_projection` | Read projection over Space/Reactions | `projection` |
| Connect Dashboard | Composed read model | `projection` |
| Connect Wallet | Points summary/history projection | `projection` |
| Connect ActivityFeed | User-facing recent activity preview | `projection` |
| Profile page | Projection consumer | `projection` |
| Admin diagnostics | Operator/support snapshot | `diagnostic_snapshot` |
| RF merchant/PRO dashboards | Operational summaries | `projection` / `diagnostic_snapshot` |
| `reaction_aggregates` | Counter aggregate | `projection` |
| `user_balances` | Current state snapshot | `projection` |
| Quest reward preview | Local/UX preview | `forbidden_as_proof` unless owner fact exists |
| Home mock rewards/stats | Static/mock rows | `mock_or_demo` |
| Connect `mockData` | Fake ledger/future features | `mock_or_demo` |
| Space legacy economy mocks | Fake wallet/NFT/ledger | `mock_or_demo` |
| Rielt mock reviews/`verifiedBooking` | Booking proof illusion | `mock_or_demo` |
| Screenshots/share cards | UI artifacts | `forbidden_as_proof` |
| Token Service `/ready` | Skeleton readiness | `forbidden_as_proof` |
| Generated SDK/types | Downstream contract artifacts | Not source of truth |
| API gateway route classification | Routing/proxy logic | Not domain fact |

Rule:

```text
if source is projection, diagnostic, generated artifact, UI, mock, screenshot or gateway route,
it cannot be activity_event authority.
```

## 9. Activity Event vs Points Ledger

Points ledger remains the sole economic authority for internal Points.

Authoritative Points facts:

- `points_transactions.id`
- `points_transactions.externalId`
- `points_transactions.sourceService`
- `points_transactions.sourceEventId`
- `points_transactions.reason`
- `points_transactions.amount`
- `user_balances.userId`
- `user_balances.balance`

Rules:

| Rule | Status |
|---|---|
| `activity_event` may reference a Points transaction | `READY` |
| `activity_event` may classify a Points row as `economic_fact` | `READY` |
| `activity_event` may create Points | `FORBIDDEN_FOR_STAGE_11_1` |
| `activity_event` may replace `points_transactions` | `FORBIDDEN_FOR_STAGE_11` |
| `activity_event` may prove reward without Points row | `FORBIDDEN_FOR_STAGE_11` |
| Connect/Wallet activity rows may be Points proof | `FORBIDDEN_FOR_STAGE_11` |

Producer boundary:

- `registration` and `referral_locked` remain the narrow `ACTIVE` producer set from Stage 11.0.
- `first_login`, `quest_completed`, `event_registration`, `rf_voucher_claim_spend`, `rf_voucher_claim_spend_compensation` remain `INTERNAL_BETA`.
- Future/forbidden actions in `PointsAction` remain vocabulary only until Stage 11.2 explicitly enforces allowlist policy.

## 10. Activity Event vs Contribution Record

`activity_event` and `contribution_record` are separate concepts.

```text
activity_event = what happened and where owner fact lives
contribution_record = later reviewable contribution signal/candidate model
reward_grant = only after producer policy and Points authority
```

Stage 11.1 does not define or create `contribution_record`.

Allowed in Stage 11.1:

- say that some `activity_event` classes may later inform contribution candidates;
- define that contribution must not be inferred from projection/mock/UI data;
- reserve proof classes for later `contribution_record` work.

Forbidden in Stage 11.1:

- creating contribution schema/model/service;
- using likes/views/saves as contributions;
- auto-awarding Points from activity events;
- converting social/content activity into rewards;
- enabling Quest -> Badge automation;
- enabling Space/content producer rewards.

Handoff:

```text
Stage 11.3 = Contribution Record Model
```

## 11. Activity Event vs Projections

Projection surfaces may display activity, but they are not activity authority.

| Projection | Allowed relation to `activity_event` | Forbidden relation |
|---|---|---|
| Connect Dashboard | May show summarized owner-backed events with source/freshness | Must not be receipt or ledger |
| Connect Wallet | May show Points rows as internal Points projection | Must not be financial wallet |
| Connect ActivityFeed | May show recent activity preview | Must not be audit trail |
| Profile | May consume owner-backed activity/badge/Points summaries | Must not be economy authority |
| Admin | May show diagnostics and owner lookup keys | Must not be customer proof |
| Space Activity Projection | May be used as prior art for projection fields | Must not become canonical `activity_event` |
| Feed endpoints | May compose read-only activity views | Must not become authority |

Projection contract requirements for later Stage 11.5:

- `sourceOwner`;
- `sourceService`;
- `sourceRecordKey`;
- `sourceEventId`;
- `proofClass`;
- `asOf`;
- `projectionGeneratedAt`;
- `supportLookupKeys`;
- non-proof labels.

Stage 11.1 only names these requirements. It does not implement projection contracts.

## 12. Idempotency / Replay / Duplicate Guardrails

Stage 11.1 guardrails:

| Scenario | Guardrail |
|---|---|
| Same owner event replayed | Must be idempotent; no new reward/economic fact |
| Same `eventId` with same payload | Duplicate/no-op |
| Same `eventId` with changed semantic payload | Conflict; requires manual investigation in future implementation |
| Same request retried | `requestId` helps trace; not enough for proof/dedupe |
| Cross-service outbox/retry | `correlationId` and owner `externalId` required |
| Economic write | Points `externalId` remains SSOT idempotency key |
| Quest reward retry | `quest_reward_outbox.externalId` is delivery intent; Points row is proof |
| RF claim duplicate | Existing RF idempotency/unique constraints remain owner guard |
| RF redemption duplicate | Existing redemption uniqueness/idempotency remains owner guard |
| Rielt inquiry duplicate | Existing `(requesterUserId, listingId, idempotencyKey)` remains owner guard |
| Reaction duplicate | Existing `(userId, targetType, targetId, reactionType)` and idempotency keys remain owner guard |
| Projection replay | Must not create new owner facts |
| Mock replay | Forbidden; mock/demo cannot be event source |

Required contract expectations:

- duplicate activity events must not create duplicate Points;
- replay must be observable in later diagnostics;
- owner-service facts win over envelope payload;
- stale projection cannot be used to trigger rewards;
- delayed events cannot bypass producer allowlist;
- no client-supplied role/user/partner/pro fields are trusted as authority.

Security/fraud risks covered:

- replay attacks;
- duplicate reward attempts;
- fake activity submission;
- social/event farming;
- mock-as-event;
- projection-as-proof;
- stale projection abuse;
- direct API reward loop attempts.

## 13. Mock / Placeholder / Fantasy Event Quarantine

Mock/demo/local data must never become event authority.

Quarantine doctrine:

```text
mock_event = invalid_event_source
mock_or_demo = never_support_proof
mock_or_demo = never_producer_evidence
mock_or_demo = never_smoke_proof
```

| Cluster | Stage 11.1 classification | Rule |
|---|---|---|
| Home static rewards / user stats | `mock_or_demo` + `forbidden_as_proof` | Never activity event source |
| Space legacy balance/NFT/transactions/quests/vouchers/referrals | `mock_or_demo` | Never Space economy event source |
| Connect `mockData` | `mock_or_demo` | Never ledger/event/projection evidence |
| Quest local reward totals / previews | `forbidden_as_proof` | Preview cannot become grant |
| Quest `NFTBadge` vocabulary | `forbidden_as_proof` | Badge is not NFT |
| RF merchant/PRO mock dashboards | `diagnostic_snapshot` only if runtime-backed; mock otherwise | Not statement/commission/payout |
| Rielt mock reviews / `verifiedBooking` | `mock_or_demo` + `forbidden_as_proof` | Not booking proof |
| Guru reward/ranking strings | `projection` or `mock_or_demo` | Not reward authority |
| Token/G2A/NFT/Bridge tabs | `forbidden_as_proof` | Path B only |
| Screenshots/share cards | `forbidden_as_proof` | Never support proof |

Stage 11.1 does not remove mocks. It only prevents them from being treated as activity sources.

## 14. Feature Flag Naming Taxonomy

Stage 11.1 defines feature flag naming only. It does not implement flags or wiring.

Global rules:

```text
flags_are_not_implementation
missing_flag_must_fail_closed
no_fallback_to_mock_data
producer_flag_requires_allowlist_classification
projection_flag_does_not_imply_authority
path_b_flags_may_only_appear_as_blocking_cutline_flags_in_path_a
```

### Flag Groups

| Group | Purpose | Rule |
|---|---|---|
| `economy.runtime.*` | Runtime contract/exposure toggles | Naming only in 11.1; no persistence/wiring |
| `economy.producer.*` | Producer-level gates | Requires Stage 11.0 allowlist class |
| `economy.projection.*` | Projection visibility gates | Projection only, never authority |
| `economy.internal_beta.*` | Internal-beta exposure gates | Not public claim |
| `economy.admin_diagnostics.*` | Admin/support diagnostics gates | Diagnostics not proof |
| `economy.smoke.*` | Smoke proof gates | Smoke proof not rollout evidence |
| `economy.cutline.*` | Blocking/cutline guardrails | Safe/blocking semantics only |

### Required Flag Examples

| Flag name | Class | Meaning | Stage 11.1 status |
|---|---|---|---|
| `economy.runtime.activity_events.enabled` | runtime | Allows future activity event surface to be considered | `NAMING_ONLY` |
| `economy.runtime.activity_events.persistence_enabled` | runtime | Future persistence gate; must default closed | `NAMING_ONLY` / `DEFER` |
| `economy.producer.registration.enabled` | producer | Active registration producer gate | `NAMING_ONLY`; enforcement in 11.2 |
| `economy.producer.quest_completed.enabled` | producer | Internal-beta Quest producer gate | `NAMING_ONLY`; enforcement in 11.2 |
| `economy.producer.event_registration.enabled` | producer | Internal-beta event registration producer gate | `NAMING_ONLY`; enforcement in 11.2 |
| `economy.producer.rf_voucher_claim_spend.enabled` | producer | Internal-beta RF Points debit producer gate | `NAMING_ONLY`; enforcement in 11.2 |
| `economy.projection.connect.enabled` | projection | Connect projection visibility | `NAMING_ONLY`; projection contract in 11.5 |
| `economy.projection.profile.enabled` | projection | Profile projection visibility | `NAMING_ONLY`; projection contract in 11.5 |
| `economy.admin_diagnostics.economy.enabled` | diagnostics | Unified economy diagnostics gate | `NAMING_ONLY`; implementation later |
| `economy.smoke.stage11.enabled` | smoke | Stage 11 smoke proof gate | `NAMING_ONLY`; no smoke before 11.8 |
| `economy.cutline.path_b_blocked` | cutline | Blocks Path B semantics in Path A | `NAMING_ONLY`; should fail closed later |
| `economy.cutline.mock_evidence_blocked` | cutline | Blocks mock/demo as evidence | `NAMING_ONLY`; should fail closed later |
| `economy.cutline.token_gateway_blocked` | cutline | Blocks token gateway activation | `NAMING_ONLY`; Path B deferred |

### Naming Rules

Producer flags:

- must map to `ACTIVE`, `INTERNAL_BETA`, `FUTURE_ONLY` or `FORBIDDEN_FOR_STAGE_11`;
- must not be named for future/forbidden producers except as cutline blockers;
- must require source owner and proof class in later implementation;
- must not silently enable Points writes.

Projection flags:

- must not imply authority;
- must require source owner/freshness/as-of metadata in later projection contract;
- must not enable mock fallback.

Runtime flags:

- must be scoped to contract/runtime exposure, not product claims;
- `persistence_enabled` is explicitly future/deferred until a later implementation slice approves storage.

Cutline flags:

- should use blocking names;
- should fail closed;
- may reference Path B only as blocked.

Forbidden flag names:

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

## 15. Feature Flag Non-Goals

Stage 11.1 does not:

- add runtime feature flag framework;
- add config service;
- add env vars;
- add DB feature flags table;
- add migrations;
- wire flags in backend services;
- wire flags in frontend;
- generate SDK/OpenAPI types;
- enable producers;
- enable projections;
- enable smoke proof;
- enable admin diagnostics;
- enable Path B;
- fallback to mock data when flags are missing.

Feature flag naming does not equal approval to implement.

```text
flag_name_defined != flag_implemented
flag_implemented != producer_approved
producer_flag_enabled != proof
projection_flag_enabled != authority
cutline_flag_present != Path_B_design
```

## 16. Stage 11 Slice Handoff

Stage 11.1 handoff table:

| Later slice | Receives from 11.1 | Must not happen before that slice |
|---|---|---|
| 11.2 — Points Ledger Minimal Runtime + Producer Allowlist | Producer flag names, proof-class vocabulary, Points/event separation | Producer activation, Points runtime enforcement, enum-to-active mapping |
| 11.3 — Contribution Record Model | `activity_event != contribution_record` boundary, candidate signal vocabulary | Contribution schema/service/model, automatic rewards |
| 11.4 — Badge / Progression Minimal State | Badge/off-chain proof classes and badge non-NFT guardrails | Quest -> Badge, Space -> Badge, XP/progression engine |
| 11.5 — Profile / Connect / Admin Projection Contract | Projection flags, projection proof-class rules, source/freshness requirements | UI projection authority, support proof from dashboards |
| 11.6 — Admin Economy Diagnostics | Diagnostic proof-class vocabulary and support lookup key expectations | Customer proof from diagnostics |
| 11.7 — Cutline Enforcement Flags | Flag naming taxonomy, cutline blocker names | Runtime enforcement before flag contract is approved |
| 11.8 — Runtime Smoke Proof | Proof-class vocabulary, owner-source map, no-mock rule | Smoke proof before owner IDs, diagnostics, projections and flags are ready |
| 11.9 — Closure Review | All Stage 11 guardrails | Path B leakage, Slice 16 revival |

Cannot happen before 11.8 Smoke Proof:

- public proof claims;
- smoke route presented as rollout evidence;
- demo using mock rows as runtime truth;
- event registration proof route while fallback risk is unresolved or ungated;
- cross-module economy proof without owner IDs;
- Connect/Profile/Admin projections used as support proof;
- any Path B/token/NFT/G2A/wallet gateway demonstration.

## 17. Risk Register

| Risk ID | Risk | Source | Impact | Severity | Mitigation | Owner slice |
|---|---|---|---|---|---|---|
| R-1101-01 | `activity_event` becomes `economic_fact` | Central contract wording | False ledger authority | Critical | Define `economic_fact` as Points row only | 11.1 / 11.2 |
| R-1101-02 | `activity_event` becomes reward grant | Event type names and producer flags | Duplicate/inflationary Points | Critical | `activity_event != reward_grant`; producer allowlist in 11.2 | 11.1 / 11.2 |
| R-1101-03 | UI ActivityFeed becomes audit trail | Connect/Space feeds | Support disputes and false proof | High | Proof-class `projection`; no audit wording | 11.1 / 11.5 |
| R-1101-04 | Space activity projection becomes canonical event | `space_activity_projection` fields look event-like | Hidden authority | High | classify as `projection` only | 11.1 |
| R-1101-05 | Connect dashboard row becomes support receipt | Connect projection | False proof | High | Dashboard != receipt; support owner IDs | 11.1 / 11.5 |
| R-1101-06 | Mock/demo becomes event source | Home/Space/Connect/Rielt/RF mocks | Fake runtime truth | Critical | `mock_or_demo` and `forbidden_as_proof` classes | 11.1 / Stage 12 |
| R-1101-07 | Quest outbox becomes receipt | `quest_reward_outbox` | Reward proof without Points row | High | `delivery_intent` class | 11.1 / 11.2 |
| R-1101-08 | Event registration becomes attendance/payout | `event_registrations` | False reward/public claim | High | `content_registration_fact`; Points proof requires Points row | 11.1 / 11.2 |
| R-1101-09 | RF lifecycle becomes cashback/payment | RF vouchers/spend/recovery | Financial semantics | Critical | `voucher_lifecycle_fact`; no payout/payment | 11.1 / 11.2 |
| R-1101-10 | Rielt inquiry becomes booking/payment | `rielt_listing_inquiry` | Booking/payment dispute | Critical | `listing_inquiry_fact` only | 11.1 / 11.5 |
| R-1101-11 | Social signals become reward producers | Space/Reactions | Farming | Critical | `social_signal` no Points proof | 11.1 / 11.3 |
| R-1101-12 | Feature flag name implies implementation | Flag taxonomy | Premature activation | High | `NAMING_ONLY`; missing flag fails closed | 11.1 / 11.7 |
| R-1101-13 | Path B flag appears as product flag | Token/G2A/NFT naming | Path B leakage | Critical | Path B flags only as cutline blockers | 11.1 / 11.7 |
| R-1101-14 | Replay creates duplicate reward | Retry/idempotency ambiguity | Duplicate Points | Critical | owner idempotency keys and Points `externalId` remain authority | 11.1 / 11.2 |
| R-1101-15 | Projection replay creates owner fact | Projection rebuild | Hidden writes | High | Projections are replayable read models only | 11.1 / 11.5 |

## 18. Review Gates

Stage 11.1 required review gates:

| Gate | Status | Required check |
|---|---|---|
| Economy Review | `READY` | Activity events do not imply Points, rewards or producer activation |
| Runtime Governance Review | `READY` | Envelope contract, proof classes, owner source map, replay/idempotency rules are explicit |
| Security / Fraud & Abuse Review | `READY` | Replay, duplicates, fake activity, farming, mock-as-event and projection-as-proof covered |
| Architecture Review | `READY` | Owner-service boundaries and future implementation options identified without schema/API changes |
| Slice Review | `READY` | 11.1 remains docs-only; handoffs are explicit |
| Canon Review | `READY` | Vocabulary aligns with Stage 10.11-10.13 and Stage 11.0 |

Validation requirements:

- no production tests required;
- no runtime scripts required;
- no migrations;
- no schema validation;
- no OpenAPI/SDK generation;
- validate markdown exists;
- validate only allowed markdown file was created/edited;
- validate all required sections exist.

Acceptance checklist:

| Criterion | Status |
|---|---|
| Only `docs/roadmaps/stage_11_1_activity_event_contract_and_feature_flag_naming_v1.md` is created for this slice | `READY` |
| Runtime implementation not started | `READY` |
| `activity_event` defined as envelope/contract, not table | `READY` |
| Points ledger remains only economic authority | `READY` |
| `contribution_record` not mixed with `activity_event` | `READY` |
| UI projections not proof | `READY` |
| mock/demo data forbidden as event authority | `READY` |
| feature flag taxonomy defined, not implemented | `READY` |
| Path B remains deferred/forbidden for Stage 11 | `READY` |
| next slice recommendation included | `READY` |

## 19. Final Verdict

Stage 11.1 verdict:

```text
stage_11_1_status: READY_as_docs_first_contract
activity_event_status: CONTRACT_DEFINED_NOT_RUNTIME_AUTHORITY
feature_flag_taxonomy_status: NAMING_DEFINED_NOT_ENFORCED
runtime_implementation_started: false
schema_migrations_started: false
openapi_sdk_changes_started: false
ui_changes_started: false
producer_activation_started: false
path_b_status: FORBIDDEN_FOR_STAGE_11
slice_16_status: BLOCKED
```

Can Stage 11.2 start after Stage 11.1?

Yes, conditionally. Stage 11.2 may start after manual approval of:

- this `activity_event` envelope contract;
- proof-class vocabulary;
- owner-service event source map;
- idempotency/replay/duplicate guardrails;
- feature flag naming taxonomy;
- Stage 11.2 producer allowlist constraints.

Remaining blockers before runtime:

- no `activity_events` runtime persistence exists or is approved;
- no `contribution_record` model exists or is approved;
- producer allowlist enforcement is not implemented;
- feature flags are named but not wired;
- Profile/Connect/Admin projection contract is not implemented;
- admin economy diagnostics are not unified;
- mock/fantasy clusters remain non-evidence and must not be used in smoke proof;
- Path B/token/G2A/NFT/bridge/wallet gateway remains forbidden.

Recommended next slice:

```text
Stage 11.2 — Points Ledger Minimal Runtime + Producer Allowlist
```

Recommended next prompt:

```text
Выполнить Stage 11.2 — Points Ledger Minimal Runtime + Producer Allowlist для Go2Asia.
Use Stage 11.0 and Stage 11.1 as controlling documents.
Mode: implementation only if explicitly approved; otherwise prepare implementation plan.
Keep Points Service as economic authority, enforce producer allowlist,
and do not expand producers, Path B, UI projections, contribution records, or activity event persistence.
```
