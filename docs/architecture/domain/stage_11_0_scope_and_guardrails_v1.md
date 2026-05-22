# Stage 11.0 — Scope & Guardrails

Документ: `stage_11_0_scope_and_guardrails_v1.md`  
Статус: docs-first scope firewall before Stage 11 runtime implementation  
Дата: 2026-05-22  
Scope: Path A — Practical Implementation Wave, Stage 11 — MVP Economy Runtime Implementation  
Mode: read-only architecture audit + docs-first contract; no runtime implementation; no migrations; no schema/API/SDK/UI/service changes; no producer activation; no token/NFT/G2A/on-chain gateway; no Slice 16

## 0. Orchestration Summary

Task classification: economy/runtime scope firewall, docs-only contract stage.  
Risk level: HIGH because Stage 11 touches Points, producers, projections, proof boundaries, mock/fantasy quarantine and Path A / Path B separation.  
Recommended model: GPT-5.5 Medium for architecture, economy, security/fraud and runtime governance reasoning.  
Execution mode: docs-first scope firewall / read-only architecture audit.  
Expected artifact: this single markdown report.

Review passes applied:

| Review pass | Role | Status | Scope |
|---|---|---|---|
| Orchestrator pass | AI Program Director / Orchestrator | READY | Task type, risk, agents, context, boundaries, artifact |
| Economy Review | Economy Architect | READY | Points, producer allowlist, Path B deferral, badge/RF boundaries |
| Runtime Governance Review | Runtime Governance Architect | READY | authority/projection/proof boundaries, `activity_event`, `contribution_record` |
| Security / Fraud & Abuse Review | Security / Fraud & Abuse Specialist | READY | fake proof, farming, double claims, mock-as-proof risks |
| Architecture Review | Software Architect | READY | service ownership, schema/runtime/OpenAPI evidence |
| Slice Review | Slice Strategist | READY | Stage 11 slice order and preconditions |
| Canon Review | Technical Canon Writer | READY | status vocabulary, canon consistency, next prompt |

Context capsule result:

- Relevant role files under `docs/ai/roles/` were present and used.
- `docs/ai/context/` was requested but not present in this repository snapshot. Status: `MISSING`.
- Required Stage 10 docs were read from existing paths:
  - `docs/roadmaps/stage_10_13_economy_runtime_landing_audit_v1.md`
  - `docs/architecture/domain/stage_10_12_implementation_readiness_plan_v1.md`
  - `docs/architecture/domain/stage_10_11_mvp_economy_cutline_v1.md`
- Requested code/docs areas were checked read-only. Notable absence: no unified Admin economy frontend/service surface was found. Status: `MISSING`.

## 1. Executive Summary

Stage 11 may start, but only through this Stage 11.0 docs-first firewall.

Stage 11.0 is mandatory because Stage 10.13 concluded that current runtime landing status is `PARTIAL`: Points, Quest, RF and Rielt have strong runtime foundations, but canonical `activity_event`, `contribution_record`, unified Profile/Connect/Admin projections, admin diagnostics, feature flag/cutline enforcement and mock/fantasy quarantine are not ready enough for direct runtime implementation.

Stage 11.0 allows:

- defining Stage 11 scope and non-goals;
- freezing producer allowlist classes;
- mapping service ownership and proof boundaries;
- defining `activity_event` and `contribution_record` boundaries;
- defining projection, mock quarantine, feature flag and admin proof guardrails;
- sequencing Stage 11 slices.

Stage 11.0 forbids:

- runtime implementation;
- migrations or schema changes;
- OpenAPI/SDK/type changes;
- UI/copy changes;
- producer activation;
- token/G2A/NFT/on-chain/bridge/wallet gateway work;
- payout/cashback/payment/booking/settlement semantics;
- creator economy/content monetization;
- Slice 16 revival.

Next slice after Stage 11.0:

```text
Stage 11.1 — Activity Event Contract + Feature Flag Naming
```

Verdict:

```text
stage_11_0_status: READY_as_docs_first_scope_firewall
stage_11_runtime_implementation_started: false
path_a_status: READY_with_preconditions
path_b_status: DEFER
stage_11_1_status_after_11_0: PARTIAL_until_manual_approval
largest_blocker_before_runtime: activity_event_and_contribution_boundaries_missing
slice_16_status: BLOCKED
```

## 2. Stage 11 Scope

Stage 11 is the MVP Economy Runtime Implementation wave for a bounded internal ecosystem economy. It is not a gateway/token/NFT wave.

| Scope item | Stage 11 status | Allowed intent | Guardrail |
|---|---|---|---|
| `activity_event` contract | `MISSING` | Define canonical event envelope before runtime writes | `activity_event != economic_fact`, `activity_event != proof` |
| Points ledger minimal runtime | `READY` | Reuse existing Points Service authority | No new producer without allowlist |
| `contribution_record` boundary/model | `MISSING` | Define reviewable contribution signal/candidate boundary | `contribution_record != reward_grant` |
| Off-chain badge / progression minimal state | `PARTIAL` | Use `badges` / `user_badges` as off-chain recognition state | No XP engine, no NFT mint, no Quest -> Badge activation |
| Profile projections | `MISSING/PARTIAL` | Profile consumes owner-backed economy projection | Profile is not economy authority |
| Connect projections | `PARTIAL` | Read-only projection hub over Points/RF/referral/badges | Dashboard/Wallet/ActivityFeed are not proof |
| Admin diagnostics | `PARTIAL/MISSING` | Support lookup and diagnostics over owner IDs | Admin surface is not economic authority |
| Feature flags | `PARTIAL` | Define naming/grouping and cutline exposure | No flag wiring in 11.0 |
| MVP cutline enforcement | `PARTIAL` | Enforce Path A boundaries before broad runtime exposure | No Path B leakage |
| Runtime smoke proof | `PARTIAL` | Later demonstrate bounded runtime chain | Smoke proof is not rollout/public proof |

Stage 11 may build only the minimum internal runtime needed to make the MVP visually and functionally demonstrable without changing the semantic model from Stage 10:

```text
Go2Asia = bounded internal ecosystem economy
Go2Asia != token economy
Go2Asia != NFT marketplace
Go2Asia != creator economy
Go2Asia != payout/cashback system
Go2Asia != booking/payment platform
Go2Asia != financial wallet
```

## 3. Stage 11 Non-Goals

These are `FORBIDDEN_FOR_STAGE_11` unless a later owner-approved Path B stage explicitly changes scope:

| Non-goal | Status | Rule |
|---|---|---|
| Blockchain gateway | `DEFER` | Path B only |
| External wallet service / custody | `DEFER` | Not a Stage 11 target |
| G2A token mechanics | `DEFER` | No token activation |
| Off-chain -> on-chain conversion | `DEFER` | No bridge/conversion rules |
| On-chain NFT mint | `DEFER` | Badge is off-chain only |
| NFT marketplace | `DEFER` | No marketplace/trading |
| Deposit / withdrawal | `FORBIDDEN_FOR_STAGE_11` | No custody/top-up/withdraw |
| Payment / cashback / payout / settlement | `FORBIDDEN_FOR_STAGE_11` | Points/RF are not money flows |
| Booking/payment in Rielt | `FORBIDDEN_FOR_STAGE_11` | Rielt remains listing/inquiry only |
| Creator economy | `DEFER` | No creator monetization |
| Content monetization | `DEFER` | No author/curator payout |
| DAO/governance | `DEFER` | Not Path A |
| Production financial accounting | `FORBIDDEN_FOR_STAGE_11` | No accounting/settlement system |
| Full social graph | `DEFER` | Space is social context only |
| Full moderation engine | `DEFER` | No moderation-as-reward runtime |
| Full notification system | `DEFER` | Basic activity feed later is projection only |
| Progression / XP engine beyond minimal state | `DEFER` | Only minimal badge/progression state |
| Slice 16 | `BLOCKED` | Not triggered |

## 4. Path A vs Path B Boundary

| Item | Path | Stage 11 status | Deferred? | Risk if implemented prematurely |
|---|---|---|---|---|
| Activity event contract | Path A | `MISSING` -> Stage 11.1 | No | Projection/activity feed can become false audit trail |
| Points ledger minimal runtime | Path A | `READY` / Stage 11.2 | No | Phantom producers if enum vocabulary is treated as active |
| Producer allowlist | Path A | `PARTIAL` -> Stage 11.2 | No | Broad rewards and farming loops |
| Contribution record boundary | Path A | `MISSING` -> Stage 11.3 | No | Likes/views/saves become reward grants |
| Off-chain badge state | Path A | `PARTIAL` -> Stage 11.4 | No | Badge becomes NFT/progression engine |
| Profile/Connect/Admin projections | Path A | `PARTIAL/MISSING` -> Stage 11.5 | No | Projection becomes authority/proof |
| Admin diagnostics | Path A | `PARTIAL/MISSING` -> Stage 11.6 | No | Support accepts screenshots/dashboards as proof |
| Feature flag/cutline enforcement | Path A | `PARTIAL` -> Stage 11.1/11.7 | No | Partial runtime exposed as product truth |
| Runtime smoke proof | Path A | `PARTIAL` -> Stage 11.8 | No | Smoke proof mistaken for rollout/public proof |
| Blockchain Gateway / Wallet Service | Path B | `FORBIDDEN_FOR_STAGE_11` | Yes | Financial/custody obligations and security risk |
| G2A token mechanics | Path B | `FORBIDDEN_FOR_STAGE_11` | Yes | Token launch illusion |
| Off-chain -> on-chain conversion | Path B | `FORBIDDEN_FOR_STAGE_11` | Yes | Conversion promise without legal/accounting model |
| Mint on-chain NFT from badge/totem | Path B | `FORBIDDEN_FOR_STAGE_11` | Yes | Badge/NFT ownership collapse |
| Deposit / withdrawal gateway | Path B | `FORBIDDEN_FOR_STAGE_11` | Yes | Financial wallet/custody overclaim |
| Custody / wallet / security model | Path B | `FORBIDDEN_FOR_STAGE_11` | Yes | Private-key/custody exposure |
| Legal/accounting constraints | Path B | `DEFER` | Yes | Incomplete compliance assumptions |
| Anti-fraud and rate limits for token/NFT | Path B | `DEFER` | Yes | Abuse controls designed for wrong economy layer |
| Admin approval flows for on-chain actions | Path B | `DEFER` | Yes | Premature operational burden |
| Public token/NFT vocabulary | Path B | `FORBIDDEN_FOR_STAGE_11` | Yes | Users infer active token/NFT product |

## 5. Producer Allowlist

This allowlist is a Stage 11.0 guardrail, not producer activation. Any action not explicitly classified here is `FORBIDDEN_FOR_STAGE_11` until reviewed.

Actual `PointsAction` names found in generated SDK/OpenAPI-derived types:

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

`SpendPointsRequestAction` is narrower and currently contains:

```text
rf_voucher_claim_spend
```

### Producer Classification

| Producer/action | Classification | Evidence / owner | Stage 11 rule |
|---|---|---|---|
| `registration` | `ACTIVE` | Auth + Points; Points ledger supports `externalId` | May remain bounded internal Points producer |
| `referral_locked` | `ACTIVE` | Referral + Points | May remain bounded internal Points producer; no commission/network payout framing |
| Points core add/read | `ACTIVE` | `points_transactions`, `user_balances`, `/internal/points/add` | Ledger authority only |
| `first_login` | `INTERNAL_BETA` | Auth + Points vocabulary/path | Do not market broadly; idempotency/support only |
| `quest_completed` | `INTERNAL_BETA` | Quest `quest_reward_outbox` + Points | Completion/outbox is delivery intent; Points row is proof |
| `event_registration` | `INTERNAL_BETA` | Content `event_registrations` + Points | Registration only; not attendance/payout |
| `rf_voucher_claim_spend` | `INTERNAL_BETA` | RF paid voucher spend + Points debit | Flag-gated utility debit; not payment |
| `rf_voucher_claim_spend_compensation` | `INTERNAL_BETA` | RF recovery trace | Internal recovery/compensation trace; not cashback/refund |
| Internal badge award | `INTERNAL_BETA` | `/internal/points/badges/award`, `badges`, `user_badges` | Backend-only off-chain award; no Quest/Space activation |
| `space_post_created` | `FUTURE_ONLY` | Vocabulary exists; Space is social context | No Space Points producer in Stage 11 |
| `space_repost_created` | `FUTURE_ONLY` | Vocabulary exists | Signal only, no reward |
| `space_reaction_created` | `FUTURE_ONLY` | Vocabulary exists; reactions are interaction rows | Likes/reactions are not contribution rewards |
| `network_accrual_level_1` | `FORBIDDEN_FOR_STAGE_11` | Vocabulary exists | Network accrual is not Path A |
| `network_accrual_level_2` | `FORBIDDEN_FOR_STAGE_11` | Vocabulary exists | Network accrual is not Path A |
| `referral_bonus_referee` | `FORBIDDEN_FOR_STAGE_11` | Legacy/vocabulary action | Do not revive broad referral bonus semantics |
| `referral_bonus_referrer` | `FORBIDDEN_FOR_STAGE_11` | Legacy/vocabulary action | Do not revive commission semantics |
| `referral_unlock` | `FORBIDDEN_FOR_STAGE_11` | Legacy/vocabulary action | Use `referral_locked` only if approved |
| `rielt_listing_created` | `FUTURE_ONLY` | Vocabulary exists; Rielt runtime is listing/inquiry | Listing creation is not Points producer |
| `rf_partner_verified` | `FUTURE_ONLY` | Vocabulary exists | Not active reward producer |
| `rf_voucher_claimed` | `FUTURE_ONLY` | Vocabulary exists; RF claim is lifecycle | Claim is not reward grant |
| `rf_voucher_redeemed` | `FUTURE_ONLY` | Vocabulary exists; RF redeem is lifecycle | Redeem is not payout/reward grant |
| Atlas/Pulse/Blog/Guru broad rewards | `FUTURE_ONLY` | No canonical runtime proof | No content rewards in Stage 11 |
| Guru recommendation rewards | `FUTURE_ONLY` | Ranking/projection only | Recommendation != payout |
| Token/G2A/NFT/on-chain rewards | `FORBIDDEN_FOR_STAGE_11` | Path B only | No activation |
| Rielt booking/payment rewards | `FORBIDDEN_FOR_STAGE_11` | Rielt is inquiry only | No booking/payment producer |
| Payout/cashback/settlement/commission | `FORBIDDEN_FOR_STAGE_11` | Not internal Points economy | No financial producer |
| Mock rows / UI previews / screenshots | `FORBIDDEN_FOR_STAGE_11` | Not runtime facts | Never producer evidence |

## 6. Owner-Service Truth Map

| Service/module | Source of truth | Projection | Not proof | Stage 11 role |
|---|---|---|---|---|
| Points Service | `points_transactions`, `user_balances`, `externalId`, `sourceService`, `sourceEventId` | `/v1/points/*`, `/v1/wallet/summary`, `/v1/points/connect-dashboard` | Wallet, Dashboard, ActivityFeed, screenshots | Layer 1 authority for internal Points ledger |
| Quest Service | `quest`, `quest_step`, `quest_progress`, `quest_submission`; `quest_reward_outbox` as delivery intent | Quest UI, Connect activity rows | Quest preview, completion screen, outbox alone | Quest progress/submission/outbox authority; reward proof requires Points row |
| RF Service | `rf_partner`, `rf_offer`, `rf_voucher`, `rf_voucher_redemption`, idempotency/recovery rows | RF catalog, My Vouchers, Connect RF section, diagnostics | Voucher screenshot, merchant/PRO summary | Voucher lifecycle authority; not cashback/payment/payout |
| Rielt Service | `rielt_listing`, `rielt_listing_inquiry` | listing/search/detail/my inquiries, RF handoff | booking/payment/reservation proof, mock reviews | Listing/inquiry authority only |
| Content Service | `countries`, `cities`, `places`, `events`, `articles`, `event_registrations` | Atlas/Pulse/Blog/Guru surfaces | likes/views/rankings, event badge, attendance claim | Content/event registration domain facts; narrow `event_registration` only |
| Space/Reactions | `space_post`, `space_group`, `space_group_member`, `reactions`, `reaction_aggregates` | `space_activity_projection`, `space_profile_projection`, feeds | social metrics, likes/bookmarks, Space activity feed | Social signal/projection only; not economic authority |
| Connect | No canonical economy tables found | Dashboard, Wallet, Levels, Referrals, ActivityFeed | receipt, audit trail, support proof | Projection hub, not authority |
| Profile | `user_profiles` for identity profile; social projections if present | Profile page/surface | Points/badge/economy proof | Projection consumer, not authority |
| Admin | RF diagnostics, Quest outbox ops, Points diagnostics patterns | Internal diagnostics views/routes | customer proof, receipt, raw authority | Diagnostics/support surface, not economic authority |
| Token Service | Health/ready skeleton only, if present | None for Path A | token/NFT readiness, wallet proof | `DEFER`; Path B skeleton only |

## 7. Activity Event Boundary

Stage 11.0 boundary:

```text
activity_event != economic_fact
activity_event != reward_grant
activity_event != proof
activity_event != UI_activity_feed
activity_event != Space_activity_projection
```

Recommendation for Stage 11.1:

Start `activity_event` as a contract/envelope, not as a canonical table first.

Reason:

- existing domain owners already have canonical facts;
- a central table created too early can become false authority;
- projections and UI feeds already look event-like and must not be promoted to proof;
- Stage 11.1 should define shape, ownership and allowed emitters before persistence.

Minimum envelope fields to decide in 11.1:

| Field group | Candidate fields | Purpose |
|---|---|---|
| Identity | `eventId`, `eventType`, `eventVersion` | Stable contract and dedupe |
| Time | `occurredAt`, `recordedAt` | Event ordering and freshness |
| Producer | `sourceService`, `sourceEventId`, `sourceRecordKey` | Owner-service trace |
| Actor | `actorUserId`, role/context if needed | Who triggered the domain fact |
| Subject | domain object type/id | What the event concerns |
| Idempotency | `externalId`, `idempotencyKey`, `correlationId`, `requestId` | Replay/duplicate control |
| Payload | bounded JSON payload | Domain metadata without authority drift |
| Proof class | `activity_fact`, `delivery_intent`, `projection`, etc. | Prevent proof collapse |

Existing facts/events to consider:

| Existing source | Can inform `activity_event`? | Boundary |
|---|---|---|
| `points_transactions` | Yes, as economic fact references | Points row is ledger authority, not generic activity |
| `quest_progress` | Yes | Activity/progress fact only |
| `quest_submission` | Yes | Submission/review fact only |
| `quest_reward_outbox` | Yes | Delivery intent, not reward receipt |
| `event_registrations` | Yes | Registration fact, not attendance/payout |
| `rf_voucher` / `rf_voucher_redemption` | Yes | Voucher lifecycle fact, not cashback/payment |
| `rielt_listing_inquiry` | Yes | Inquiry/contact request, not booking/payment |
| `space_post` / `reactions` | Yes | Social signal only |
| `space_activity_projection` | No as authority | Projection only |
| Connect ActivityFeed | No as authority | UI/read model only |
| Home/Space/Connect mocks | No | Mock data is never evidence |

Forbidden:

- using UI activity feed as audit trail;
- using Space activity projection as cross-module economic ledger;
- using activity rows to imply automatic Points;
- using `activity_event` to bypass owner-service truth.

## 8. Contribution Record Boundary

Stage 11.0 boundary:

```text
contribution_record != like
contribution_record != save
contribution_record != view
contribution_record != automatic_reward
contribution_record != Points_transaction
contribution_record != NFT
```

`contribution_record` may be a signal, candidate or reviewable fact. It must not automatically grant Points without an explicit producer policy and owner-approved allowlist.

Can be contribution signal:

| Signal | Status | Boundary |
|---|---|---|
| Quest completion/submission after owner validation | `INTERNAL_BETA` | May become activity/contribution signal; reward proof still Points row |
| Event registration | `INTERNAL_BETA` | Registration signal only, not attendance/payout |
| Space post/repost/reaction | `FUTURE_ONLY` | Social signal only, no reward |
| Atlas/Pulse/Blog/Guru content/context | `FUTURE_ONLY` | Discovery/editorial signal only |
| Rielt inquiry | `ACTIVE` as inquiry fact, `FUTURE_ONLY` as contribution | Contact request only |
| RF voucher lifecycle | `ACTIVE/PARTIAL` as utility fact | Utility usage signal, not payout |

Cannot be contribution:

- raw likes/views/bookmarks/saves alone;
- UI screenshots/share cards;
- Connect totals, Wallet summaries, ActivityFeed rows;
- mock/seed/demo rows;
- local Quest reward previews;
- Guru ranking/recommendation alone;
- event attendance inferred from registration;
- Rielt booking/payment inferred from inquiry;
- RF claim/redeem inferred as cashback/payout.

Must stay future-only:

- Atlas/Pulse/Blog/Guru creator rewards;
- Blog author/curator monetization;
- Space/social reward producers;
- moderation-as-reward;
- progression/XP/reputation engine;
- Quest -> Badge automation;
- token/G2A/NFT/on-chain reward conversion;
- booking/payment/settlement/payout/cashback.

## 9. Projection Guardrails

Global rules:

```text
Dashboard != receipt
ActivityFeed != audit_trail
Wallet != financial_wallet
Badge != NFT_mint
Quest_preview != grant
RF_voucher != cashback_or_payout
Rielt_inquiry != booking_or_payment
mock_data != runtime_truth
projection != authority
```

### Profile

Allowed display:

- owner-backed Points summary after projection contract exists;
- off-chain badge summary from badge/Points owner;
- recent bounded activity with source owner and `asOf`;
- support lookup hints that point to backend owner IDs.

Forbidden display:

- Profile as economic authority;
- local totals as Points truth;
- badges as NFT/ownership;
- level/XP/progression engine claims;
- activity history as audit trail.

Required metadata:

- `sourceOwner`;
- `sourceRecordKey`;
- `asOf`;
- `projectionGeneratedAt`;
- `supportLookupKeys`;
- proof class.

### Connect

Allowed display:

- read-only Points balance/transactions from Points Service;
- badge catalog/user badge projection;
- referral/RF summaries with owner markers;
- ActivityFeed as recent activity preview only.

Forbidden display:

- receipt/account statement;
- audit trail;
- financial wallet/custody;
- mock transactions;
- G2A/NFT/Bridge activation;
- producer labels without active/internal-beta/future-only classification.

Required metadata:

- Points `transactionId`/`externalId`;
- RF `voucherId`/`offerId`/`partnerId`;
- badge `awardId` or `user_badges.id`;
- referral relation id where applicable;
- source/freshness markers and non-proof wording.

### Admin

Allowed display:

- owner-service diagnostics;
- support lookup by backend IDs;
- replay/requeue diagnostics for bounded pipelines;
- smoke proof support bundle in later slice.

Forbidden display:

- Admin dashboard as customer receipt;
- diagnostic snapshot as canonical economy fact;
- screenshots as support proof;
- cross-module projection as ledger.

Required metadata:

- source service;
- source event/record ID;
- correlation/request/idempotency keys;
- freshness/as-of timestamps;
- operator action boundaries.

## 10. Mock / Placeholder / Fantasy Quarantine Rules

Stage 11.0 does not fix UI. It classifies surfaces so Stage 11.1 does not land runtime into unsafe zones.

| Surface / cluster | Evidence found | Classification | Stage 11.0 rule |
|---|---|---|---|
| Home static rewards / `userStats` | Authenticated Home has mock Points/badge/level/NFT-like stats | `BLOCKER_BEFORE_STAGE_11_1` | Do not use as landing zone or evidence |
| Space legacy economy mock cluster | Balance/NFT/Transactions/Quests/Vouchers/Referrals mock components/data | `BLOCKER_BEFORE_STAGE_11_1` if routable; otherwise `DO_NOT_USE_AS_EVIDENCE` | Space is social only |
| Connect `mockData` | Fake ledger, G2A/NFT/missions/analytics | `DO_NOT_USE_AS_EVIDENCE` | Keep inert; never import into runtime |
| Connect producer labels/copy | Labels include future-only actions | `BLOCKER_BEFORE_STAGE_11_1` | Must classify before using in Stage 11.1 |
| Quest `NFTBadge` / preview vocabulary | Local reward/badge preview and semantic debt | `REMOVE_OR_REWRITE_LATER` | Preview != grant; badge != NFT |
| Quest local totals | `CompletedQuestCard` local Points estimate | `DO_NOT_USE_AS_EVIDENCE` | Not support proof |
| RF merchant mock dashboards | Legacy/mock merchant stats | `DO_NOT_USE_AS_EVIDENCE` / `REMOVE_OR_REWRITE_LATER` | Not statement/commission/payout |
| RF PRO summaries | Boundary copy mostly non-financial | `SAFE_IF_INERT` | Projection only |
| Rielt `verifiedBooking` / mock reviews | Mock reviews imply verified booking | `BLOCKER_BEFORE_STAGE_11_1` | Rielt inquiry != booking/payment |
| Rielt mock listing booking fields | `instantBooking`, deposits, price-like data | `DO_NOT_USE_AS_EVIDENCE` | Demo/seed only |
| Guru reward strings | Quest reward points surfaced through projection | `DEFER_TO_STAGE_12` | Ranking/recommendation != reward authority |
| Token/G2A/NFT/Bridge tabs | Inert/deprecated/future components | `SAFE_IF_INERT` + `DEFER_TO_STAGE_12` | Path B only; no mounting/activation |
| Wallet / payout / cashback / financial copy | Connect wallet vocabulary still high-risk | `SAFE_IF_INERT` with guardrails | Wallet means internal Points projection only |
| Admin economy diagnostics UI | Unified admin UI not found | `MISSING` | Do not substitute RF/merchant dashboards |

Quarantine statuses:

```text
BLOCKER_BEFORE_STAGE_11_1 = unsafe if Stage 11.1 uses it as landing/evidence
SAFE_IF_INERT = acceptable only while non-authoritative and non-evidence
DEFER_TO_STAGE_12 = UI alignment/product wording later
REMOVE_OR_REWRITE_LATER = semantic debt to resolve outside 11.0
DO_NOT_USE_AS_EVIDENCE = never support/runtime proof
```

## 11. Feature Flag Guardrails

No feature flags are implemented in Stage 11.0. This section defines naming and grouping rules only.

Recommended grouping:

| Group | Prefix pattern | Examples | Rule |
|---|---|---|---|
| Economy runtime flags | `economy.runtime.*` | `economy.runtime.activity_events.enabled` | Enables bounded runtime surfaces only after contract approval |
| Producer flags | `economy.producer.*` | `economy.producer.quest_completed.enabled`, `economy.producer.event_registration.enabled` | Every producer flag must map to allowlist classification |
| Projection flags | `economy.projection.*` | `economy.projection.connect.enabled`, `economy.projection.profile.enabled` | Projection flags do not imply authority |
| Internal-beta flags | `economy.internal_beta.*` | `economy.internal_beta.rf_paid_spend.enabled` | Must not be marketed as public-ready |
| Admin diagnostics flags | `economy.admin_diagnostics.*` | `economy.admin_diagnostics.rf.enabled` | Diagnostics are support/operator tools only |
| Smoke proof flags | `economy.smoke.*` | `economy.smoke.stage11.enabled` | Smoke proof is not rollout/public proof |
| Cutline flags | `economy.cutline.*` | `economy.cutline.path_b_blocked`, `economy.cutline.mock_evidence_blocked` | Must default to safe/blocking semantics |

Rules:

- Flags must be named by domain and risk, not UI surface.
- `false` or missing flag must not silently activate fallback mock data.
- Producer flags require explicit owner-service source and proof class.
- Projection flags require source owner and freshness/as-of metadata.
- Internal-beta flags require non-public wording and support caveats.
- Path B flags must not exist in Path A runtime except as blocking/cutline flags.

## 12. Admin / Support Proof Policy

Support proof must come from backend owner services, not UI surfaces.

Allowed proof/support keys:

| Domain | Allowed lookup keys | Notes |
|---|---|---|
| Points | `transactionId`/`id`, `externalId`, `userId`, `action`/`reason`, `sourceService`, `sourceEventId`, `metadata` | Points row is economic fact |
| Auth registration | `auth:user.created:${userId}`, `auth:first_login:${userId}`, Clerk user IDs | Only if matched to Points `externalId` |
| Referral | referral relation id, `referrerId`, `refereeId`, `referral:locked:${referrerId}:${refereeId}` | No commission/payout proof |
| Quest | `progressId`, `submissionId`, `questProgressId`, `questId`, `stepId`, outbox id, `quest_reward_outbox.external_id`, `sourceEventId` | Outbox is delivery intent until Points row exists |
| Content/Pulse | `registrationId`, `eventRegistrationId`, `eventId`, `content:event_registration:${registrationId}` | Registration != attendance |
| RF | `voucherId`, `offerId`, `partnerId`, `claimScope`, `listingId`, `proLinkId`, `shareCode`, `idempotencyKey`, `pointsDebitExternalId`, `spendExternalId`, `compensationExternalId`, `correlationId`, `redemptionId` | Voucher lifecycle, not payout/payment |
| Rielt | `inquiryId`, `rielt_listing_inquiry.id`, `listingId`, `idempotencyKey`, `requesterUserId` | Inquiry != booking/payment |
| Badge | `awardId`/`user_badges.id`, `badgeId`, `badgeCode`, `sourceType`, `sourceId`, `sourceService`, `earnedAt` | Off-chain recognition only |

Forbidden proof:

```text
screenshots
Dashboard totals
Wallet summary alone
ActivityFeed rows
share cards
Quest local previews
Quest completion page alone
Home rewards
mock rows
Rielt listing screenshots
Rielt mock reviews
RF voucher screenshots alone
Guru rankings
likes/views/saves
token-service /ready
```

Admin/support principles:

- use owner IDs first;
- use projections only as navigation hints;
- require `sourceOwner`, `sourceEventId` and freshness for any support view;
- never treat diagnostic dashboards as customer receipts;
- never accept financial, booking, payout or NFT claims from Path A artifacts.

## 13. Stage 11 Slice Order

Recommended final order:

| Slice | Status | Goal | Notes |
|---|---|---|---|
| 11.0 — Scope & Guardrails | `READY` | Freeze Stage 11 firewall | This document |
| 11.1 — Activity Event Contract + Feature Flag Naming | `PARTIAL` | Define event envelope and flag taxonomy | No schema unless separately approved |
| 11.2 — Points Ledger Minimal Runtime + Producer Allowlist | `READY/PARTIAL` | Reuse Points authority and enforce producers | Allowlist must be approved first |
| 11.3 — Contribution Record Model | `MISSING` | Define contribution signal/candidate model | No auto rewards |
| 11.4 — Badge / Progression Minimal State | `PARTIAL` | Minimal off-chain state | No XP/NFT/Quest->Badge |
| 11.5 — Profile / Connect / Admin Projection Contract | `PARTIAL/MISSING` | Define projection contract | Projection != authority |
| 11.6 — Admin Economy Diagnostics | `PARTIAL/MISSING` | Owner-ID support diagnostics | Before smoke proof |
| 11.7 — MVP Cutline Enforcement Flags | `PARTIAL` | Enforce Path A/Path B and mock cutline | Flag names start in 11.1 |
| 11.8 — Runtime Smoke Proof | `PARTIAL` | Verify bounded runtime route | Not rollout evidence |
| 11.9 — Stage 11 Closure Review | `MISSING` | Confirm no drift, no Path B leakage | Closure/canon review |

Adjustment from baseline:

- Keep `11.1` as Activity Event Contract, but include feature flag naming early because producers and projections should not be wired without names and cutline taxonomy.
- Keep enforcement in `11.7`, after facts/projections/admin diagnostics are defined.
- Keep smoke proof late because support/proof keys and diagnostics must exist first.

## 14. Required Preconditions Before Stage 11.1

Mandatory preconditions:

1. Stage 11 scope frozen as Path A bounded internal economy runtime; Path B is `DEFER`.
2. Producer allowlist approved with `ACTIVE`, `INTERNAL_BETA`, `FUTURE_ONLY`, `FORBIDDEN_FOR_STAGE_11`.
3. Owner-service truth map approved.
4. `activity_event` boundary approved, including contract/envelope-first recommendation or explicit alternative.
5. `contribution_record` boundary approved.
6. Mock clusters marked as non-landing zones and `DO_NOT_USE_AS_EVIDENCE`.
7. Feature flag naming/grouping approved.

Recommended additional precondition before smoke proof, not necessarily before 11.1:

- resolve or explicitly gate the `event_registration` DB-less fallback risk before any public proof route.

## 15. Risk Register

| Risk ID | Risk | Source | Impact | Severity | Mitigation | Stage owner |
|---|---|---|---|---|---|---|
| R-1100-01 | mock -> truth | Home, Space, Connect/RF/Rielt mocks | Fake MVP economy and false support evidence | Critical | Quarantine; `DO_NOT_USE_AS_EVIDENCE`; no Stage 11 landing | Stage 11.0 / Stage 12 |
| R-1100-02 | projection -> authority | Connect/Profile/Admin read models | Hidden canonical source and support disputes | Critical | Owner-service truth map, source/freshness/proof class | Stage 11.5 |
| R-1100-03 | dashboard -> receipt | Connect Dashboard | Users/support treat totals as receipt | High | Dashboard != receipt, owner ID lookups | Stage 11.5 / 11.6 |
| R-1100-04 | activity feed -> audit trail | Connect/Space feeds | Feed rows treated as audit proof | High | ActivityFeed != audit trail, `activity_event` contract | Stage 11.1 / 11.5 |
| R-1100-05 | wallet -> financial wallet | Connect Wallet vocabulary | Custody/top-up/withdraw expectation | Critical | Internal Points projection only; no custody terms | Stage 11.5 |
| R-1100-06 | badge -> NFT | `NFTBadge`, badge UI/docs | On-chain ownership/mint illusion | Critical | Badge is off-chain state; Path B deferred | Stage 11.4 / Stage 12 |
| R-1100-07 | quest preview -> grant | Quest rewards/local totals | Preview treated as applied Points | High | Preview != grant; Points row proof | Stage 11.2 / 11.8 |
| R-1100-08 | RF voucher -> cashback/payout | RF voucher/PRO/merchant surfaces | Financial claim/dispute | Critical | RF = utility lifecycle; no payout/settlement copy | Stage 11.2 / 11.6 |
| R-1100-09 | Rielt inquiry -> booking/payment | Rielt inquiry/reviews/listing price | Booking/payment support disputes | Critical | Inquiry only; no booking/payment proof | Stage 11.5 / Stage 12 |
| R-1100-10 | producer enum -> active producer | `PointsAction` generated enum | Phantom producers and reward loops | Critical | Producer allowlist; unknown = forbidden | Stage 11.2 |
| R-1100-11 | token-service skeleton -> Path B activation | `token-service` health/ready skeleton | Token/NFT gateway drift | Critical | `DEFER`; do not touch token-service | Stage 11.0 / 11.9 |
| R-1100-12 | contribution signal -> automatic reward | Space/content/social metrics | Farming and reward inflation | Critical | `contribution_record != reward_grant`; reviewable facts only | Stage 11.3 |
| R-1100-13 | Quest outbox -> receipt | Quest delivery intent | Support accepts delivery intent as applied reward | High | Points transaction is proof | Stage 11.2 / 11.6 |
| R-1100-14 | event registration -> attendance/payout | Content/Pulse event flow | False attendance/reward guarantee | High | Registration only; owner proof keys | Stage 11.1 / 11.2 |
| R-1100-15 | admin diagnostics -> customer proof | RF/Quest/Points diagnostics | Operators issue proof from snapshots | Medium-high | Diagnostics are support tools; backend rows are proof | Stage 11.6 |
| R-1100-16 | feature flag drift | Partial env flags and missing registry | Unsafe runtime exposure | High | Naming taxonomy in 11.1; enforcement in 11.7 | Stage 11.1 / 11.7 |

## 16. Review Gates

Stage 11.0 gates:

| Gate | Status | Required check |
|---|---|---|
| Economy Review | `READY` | No new economy semantics; no producer activation; Path B deferred |
| Runtime Governance Review | `READY` | Authority/projection/proof boundaries explicit |
| Security / Fraud & Abuse Review | `READY` | Fake proof, farming, replay/double-claim risks surfaced |
| Architecture Review | `READY` | Owner-service truth map and missing contracts identified |
| Slice Review | `READY` | Stage 11 order is bounded and contract-first |
| Canon Review | `READY` | Stage 10.13 -> Stage 11.0 transition documented |

Stage 11.1 required gates:

| Gate | Required before completion |
|---|---|
| Economy Review | Activity events cannot imply Points/reward grants |
| Runtime Governance Review | Envelope/table decision, owner, idempotency, replay and projection rules |
| Security / Fraud & Abuse Review | Duplicate/fake activity and farming scenarios |
| Architecture Review | Contract ownership and any API/schema implications |
| Slice Review | 11.1 remains contract/naming slice, not implementation wave |
| Canon Review | Contract wording aligns with Stage 10.11-10.13 and this 11.0 document |

## 17. Final Recommendation

Can Stage 11.1 start after Stage 11.0?

Yes, conditionally. Stage 11.1 can start after this document is manually approved as the Stage 11 scope firewall and the listed preconditions are accepted by the project owner.

What must be manually approved:

- Stage 11 scope and non-goals;
- Path A / Path B boundary;
- producer allowlist classification;
- owner-service truth map;
- `activity_event` boundary and envelope-first recommendation;
- `contribution_record` boundary;
- mock/fantasy non-landing zones;
- feature flag naming plan;
- review gates for 11.1.

Current blockers:

- No blocker to completing Stage 11.0 as docs-first scope guardrails.
- Blockers before runtime implementation remain: `activity_event` contract is `MISSING`, `contribution_record` model/boundary is `MISSING`, profile/admin projection contracts are `MISSING/PARTIAL`, unified feature flag/cutline enforcement is `PARTIAL`, mock/fantasy clusters are `RISK`.

Final verdict:

```text
stage_11_0_verdict: READY_for_manual_approval
stage_11_1_can_start: yes_after_manual_approval_of_preconditions
runtime_implementation_can_start_now: no
path_a_can_continue: yes_with_guardrails
path_b_can_start: no
token_NFT_G2A_gateway_status: FORBIDDEN_FOR_STAGE_11
payout_cashback_booking_payment_status: FORBIDDEN_FOR_STAGE_11
slice_16_status: BLOCKED
```

Recommended next prompt:

```text
Выполнить Stage 11.1 — Activity Event Contract + Feature Flag Naming для Go2Asia.
Mode: docs-first contract only. Не создавать migrations/schema/API/SDK/UI/runtime code.
Use Stage 11.0 Scope & Guardrails as the controlling document.
Define activity_event envelope, proof-class vocabulary, owner-service event sources,
idempotency/replay expectations, and Stage 11 feature flag naming taxonomy.
```
