# Stage 11.5 — Profile / Connect / Admin Projection Contract

Документ: `stage_11_5_profile_connect_admin_projection_contract_v1.md`  
Статус: docs-first projection contract; no runtime implementation  
Дата: 2026-05-22  
Scope: Stage 11.5 of Path A — Profile / Connect / Admin projection contract  
Mode: read-only architecture design; no migrations; no DB schema changes; no OpenAPI/SDK/generated changes; no production service changes; no UI changes; no Admin service creation; no support dashboard runtime; no cutline enforcement; no smoke proof; no Path B

## 0. Orchestration Summary

Task type: docs-first projection contract and proof/freshness/source boundary definition.

Risk level: CRITICAL because Profile, Connect and Admin can turn otherwise safe owner-backed facts into false receipts, false wallets, false audit trails, false support proof, social score or projection-driven prestige if their read/display boundary is not explicit.

Execution mode:

```text
runtime_implementation_allowed: false
schema_migration_allowed: false
openapi_sdk_changes_allowed: false
ui_changes_allowed: false
admin_service_creation_allowed: false
projection_runtime_layer_allowed: false
path_b_activation_allowed: false
```

Controlling docs:

- `docs/architecture/domain/stage_11_0_scope_and_guardrails_v1.md`
- `docs/architecture/domain/stage_11_1_activity_event_contract_and_feature_flag_naming_v1.md`
- `docs/architecture/domain/stage_11_2_points_ledger_minimal_runtime_and_producer_allowlist_v1.md`
- `docs/architecture/domain/stage_11_3_contribution_record_boundary_and_candidate_model_v1.md`
- `docs/architecture/domain/stage_11_4_badge_progression_minimal_state_v1.md`

Supporting docs:

- `docs/architecture/domain/stage_10_6_connect_economy_hub_alignment_v1.md`
- `docs/architecture/domain/stage_10_10_ux_copy_proof_class_alignment_v1.md`
- `docs/architecture/domain/stage_10_11_mvp_economy_cutline_v1.md`
- `docs/roadmaps/stage_10_13_economy_runtime_landing_audit_v1.md`

Runtime and surface facts checked read-only:

- `packages/db/src/schema/points.ts`
- `packages/db/src/schema/quest.ts`
- `packages/db/src/schema/rf.ts`
- `packages/db/src/schema/rielt.ts`
- `packages/db/src/schema/content.ts`
- `packages/db/src/schema/space.ts`
- `packages/db/src/schema/reactions.ts`
- `packages/db/src/schema/referral.ts`
- `apps/points-service/src/*`
- `apps/api-gateway/src/*`
- relevant read-only Profile/Connect/RF/Quest/Rielt/Space projection surfaces in `apps/go2asia-pwa-shell/*`

Multi-agent review passes applied:

| Pass | Role | Result |
|---|---|---|
| Orchestrator | AI Program Director / Orchestrator | Stage 11.5 is docs-first projection legitimacy firewall |
| Runtime Governance | Runtime Governance Architect | Projection metadata, owner trace, proof class and freshness boundaries defined |
| Economy | Economy Architect | No dashboard-as-receipt, wallet-as-financial-wallet, RF-as-payout or badge-as-NFT semantics |
| Security / Fraud | Security / Fraud & Abuse Specialist | Screenshot/mock/stale/replay/support dispute risks blocked by doctrine |
| Architecture | Software Architect | Profile/Connect/Admin contracts and owner-service source map defined without implementation |
| Slice Strategist | Slice Strategist | 11.6/11.7/11.8, Stage 12 and Path B boundaries preserved |
| Canon Writer | Technical Canon Writer | Stable vocabulary, forbidden vocabulary and final verdict frozen |

Affected surfaces:

- Profile page as future projection consumer;
- Connect Dashboard / Wallet / ActivityFeed / Levels / Referrals / RF section;
- Admin diagnostics as future internal operator surface;
- Points, badge, Quest, RF, Rielt, Content, Space/Reactions and Referral owner facts;
- mock/demo/share/screenshot surfaces that must never become support proof.

Implementation permission:

```text
projection_contract_status: DEFINED_NOT_IMPLEMENTED
projection_runtime_status: DEFER
projection_schema_status: PROPOSAL_ONLY
profile_ui_changes: false
connect_ui_changes: false
admin_ui_changes: false
admin_service_status: DEFER_TO_11_6
cutline_enforcement_status: DEFER_TO_11_7
smoke_proof_status: DEFER_TO_11_8
```

## 1. Executive Summary

Stage 11.5 defines the projection contract for Profile, Connect and Admin.

The core decision:

```text
projection = read/display/diagnostic surface over owner-backed facts
projection != authority
projection != proof
projection != receipt
projection != audit_trail
projection != financial_wallet
```

Profile, Connect and Admin may show summaries, previews, diagnostics and navigation hints. They must not become the authority for Points, badges, contribution candidates, RF vouchers, Rielt inquiries, Quest delivery, booking/payment, payouts/cashback, tokens, NFTs or support disputes.

Stage 11.5 does not implement a projection runtime layer. It freezes:

- source owner map;
- proof class map;
- projection metadata vocabulary;
- freshness/as-of rules;
- support lookup keys;
- display and copy boundaries;
- mock/screenshot/demo evidence rules;
- Profile / Connect / Admin contracts;
- handoff boundaries for 11.6, 11.7 and 11.8.

Final Stage 11.5 doctrine:

```text
projection != authority
Dashboard != receipt
Wallet != financial_wallet
ActivityFeed != audit_trail
Profile != economy_authority
Profile != identity_proof_for_economy
Connect != accounting_system
Admin_dashboard != customer_proof
Admin_diagnostics != canonical_fact
Badge_projection != badge_award
Contribution_projection != contribution_record
Points_projection != Points_ledger
RF_projection != payout_or_cashback
Rielt_projection != booking_or_payment
mock_data != projection_truth
screenshot != support_proof
```

## 2. Projection Definition

`projection` is a bounded read/display/diagnostic representation of owner-backed facts.

It may:

- show a summary;
- show a preview;
- help navigation;
- give user-facing context;
- help admin/support locate owner facts.

It may not:

- create owner facts;
- mutate owner state;
- grant rewards;
- award badges;
- create contribution records;
- act as financial or accounting record;
- settle disputes;
- serve as customer proof;
- replace owner-service lookup;
- turn mock/demo/local data into truth.

Minimum definition:

```text
projection = owner-backed read/display/diagnostic representation
+ source owner trace
+ proof class
+ asOf/freshness metadata
+ support lookup hints
+ display scope
+ explicit non-proof status
```

Projection exists downstream from owner facts:

```text
owner_fact
-> owner read API / read model
-> projection contract envelope
-> Profile / Connect / Admin display
```

Projection is not upstream from facts:

```text
projection
-> no reward grant
-> no ledger mutation
-> no badge award
-> no contribution record
-> no booking/payment proof
```

## 3. Projection Non-Goals

Stage 11.5 does not:

- create projection tables;
- create migrations;
- change DB schema;
- change OpenAPI;
- regenerate SDK or generated types;
- change frontend UI;
- create Admin service;
- create support dashboard runtime;
- create projection worker or cache;
- create audit trail;
- create accounting statement;
- create financial wallet;
- create public proof route;
- create smoke proof;
- activate Path B;
- introduce token, NFT, G2A or on-chain gateway semantics;
- introduce payout, cashback, payment, settlement or booking semantics;
- introduce social score;
- introduce leaderboard or prestige economy;
- introduce XP grinding;
- use mock data as projection truth.

Forbidden interpretations:

| Misread | Stage 11.5 rule |
|---|---|
| Projection as authority | `FORBIDDEN_FOR_STAGE_11` |
| Dashboard as receipt | `FORBIDDEN_FOR_STAGE_11` |
| Wallet as financial wallet | `FORBIDDEN_FOR_STAGE_11` |
| ActivityFeed as audit trail | `FORBIDDEN_FOR_STAGE_11` |
| Profile as economy authority | `FORBIDDEN_FOR_STAGE_11` |
| Connect as accounting system | `FORBIDDEN_FOR_STAGE_11` |
| Admin snapshot as customer proof | `FORBIDDEN_FOR_STAGE_11` |
| Screenshot as support proof | `FORBIDDEN_FOR_STAGE_11` |
| Mock/demo/share card as proof | `FORBIDDEN_FOR_STAGE_11` |

## 4. Projection Metadata Contract

This is a contract proposal, not a schema implementation.

| Field | Required? | Meaning | Stage 11.5 rule |
|---|---|---|---|
| `projectionId` | Recommended | Stable identity for a projection item or block | Must not be used as proof by itself |
| `projectionType` | Yes | Surface/type of projection | Examples: `profile_summary`, `connect_dashboard`, `admin_diagnostic` |
| `sourceOwner` | Yes | Owner domain/service of the underlying fact | Must never be `Profile`, `Connect`, `Admin`, screenshot, mock or UI |
| `sourceService` | Yes | Service emitting or exposing the owner fact/read | Required for support trace |
| `sourceRecordKey` | Yes for owner-backed projections | Stable owner lookup key | Required before support can act |
| `sourceEventId` | Conditional | Owner event/fact/correlation ID | Required when owner service has it |
| `sourceProofClass` | Yes | Proof class of the underlying owner fact/source | Must not be inferred from UI copy |
| `subjectType` | Yes | Domain subject type | Examples: `user`, `points_transaction`, `badge_award`, `voucher` |
| `subjectId` | Yes | Domain subject ID | Must point to owner-backed subject when possible |
| `actorUserId` | Conditional | User or system actor behind the owner fact | Client-provided actor is never trusted alone |
| `asOf` | Yes | Owner-state timestamp represented by projection | Not equal to render time |
| `projectionGeneratedAt` | Yes | Time projection/read model was composed | Does not create owner fact |
| `dataFreshness` | Yes | Freshness classification | `fresh`, `stale`, `expired`, `unknown_freshness` |
| `stalenessStatus` | Yes | User/admin interpretation of freshness | Stale/unknown cannot be proof |
| `supportLookupKeys` | Yes | Owner lookup hints for support/admin | Hints only; not proof |
| `displayScope` | Yes | Intended display context | Examples: `summary`, `preview`, `diagnostic`, `blocked` |
| `visibility` | Yes | Visibility boundary | `user_projection`, `admin_diagnostic`, `internal_only`, `blocked` |
| `isAuthoritative` | Yes | Whether projection is authority | Must be `false` for user-facing projections |
| `isProof` | Yes | Whether projection is proof | Must be `false` for user-facing projections |
| `isReceipt` | Yes | Whether projection is receipt | Must be `false` for user-facing projections |
| `metadata` | Optional | Bounded non-authoritative context | Must not hide reward/financial semantics |

Mandatory invariant for Profile and Connect user-facing projections:

```text
isAuthoritative = false
isProof = false
isReceipt = false
```

Mandatory invariant for Admin diagnostics:

```text
isAuthoritative = false
isProof = false
isReceipt = false
visibility = admin_diagnostic
diagnostic_snapshot = navigation_to_owner_facts_only
```

Recommended source record key shape:

```text
points:transaction:{transactionId}
points:external:{externalId}
badge:award:{userBadgeId}
quest:progress:{progressId}
quest:submission:{submissionId}
quest:outbox:{outboxId}
rf:voucher:{voucherId}
rf:redemption:{redemptionId}
rielt:listing:{listingId}
rielt:inquiry:{inquiryId}
content:event_registration:{registrationId}
space:activity_projection:{projectionId}
reaction:{reactionId}
referral:relation:{relationId}
```

Current implementation gap:

```text
projection_metadata_in_existing_api: PARTIAL/MISSING
status: DEFER
reason: adding metadata requires API/SDK/UI changes outside Stage 11.5
```

## 5. Projection Classes

Stage 11.5 uses the following classes:

| Class | Meaning | User projection allowed? | Proof allowed? |
|---|---|---|---|
| `OWNER_FACT` | Canonical owner-service row/fact | Only as referenced display source | Only at owner service |
| `ECONOMIC_FACT` | Points ledger row/economic fact | Display as projection | Owner Points row only |
| `BADGE_AWARD_FACT` | Persisted `user_badges` award | Display as badge projection | Owner badge award row only |
| `CONTRIBUTION_CANDIDATE` | Reviewable contribution candidate from Stage 11.3 | Future-only display after approval | Not reward proof |
| `ACTIVITY_EVENT_ENVELOPE` | Stage 11.1 event envelope | Preview/navigation only | Not proof by itself |
| `PROJECTION_SUMMARY` | Bounded summary over owner facts | Yes | No |
| `PROJECTION_PREVIEW` | Limited preview/recent list | Yes | No |
| `DIAGNOSTIC_SNAPSHOT` | Admin/operator diagnostic view | Admin only | No |
| `MOCK_OR_DEMO` | Local/demo/static/test data | No as truth | Never |
| `FORBIDDEN_AS_PROOF` | Artifact that must never support claims | Block or label as non-proof | Never |

Class doctrine:

```text
OWNER_FACT may feed projection
ECONOMIC_FACT may be displayed but projection is not ledger
BADGE_AWARD_FACT may be displayed but projection is not badge award
CONTRIBUTION_CANDIDATE may be displayed only after future contract approval
ACTIVITY_EVENT_ENVELOPE may help locate facts but is not proof
PROJECTION_SUMMARY is display only
PROJECTION_PREVIEW is display only
DIAGNOSTIC_SNAPSHOT is admin navigation only
MOCK_OR_DEMO is never projection truth
FORBIDDEN_AS_PROOF is never support proof
```

## 6. Source Classification

Source classification governs whether a source may feed Profile, Connect or Admin projections.

| Source | Classification | Projection class | Authority owner | Stage 11.5 rule |
|---|---|---|---|---|
| Points balance | `CAN_PROJECT_WITH_OWNER_TRACE` | `PROJECTION_SUMMARY` over `ECONOMIC_FACT` / state | Points Service, `user_balances` | Display as internal Points summary, not financial balance |
| Points transactions | `CAN_PROJECT_WITH_OWNER_TRACE` | `PROJECTION_PREVIEW` over `ECONOMIC_FACT` | Points Service, `points_transactions` | Display as read projection, not receipt/audit trail |
| Badges / `user_badges` | `CAN_PROJECT_WITH_OWNER_TRACE` | `PROJECTION_SUMMARY` over `BADGE_AWARD_FACT` | Points Service | Display off-chain recognition, not NFT/asset |
| Quest progress/submissions/outbox | `CAN_PROJECT_WITH_OWNER_TRACE` for owner diagnostics; `CAN_PROJECT_AS_PREVIEW_ONLY` for user | `OWNER_FACT`, `PROJECTION_PREVIEW` | Quest Service | Outbox is delivery intent, not receipt |
| Contribution candidates | `CAN_PROJECT_AS_PREVIEW_ONLY` / `FUTURE_ONLY` | `CONTRIBUTION_CANDIDATE` | Future contribution owner | No Stage 11.5 runtime or UI |
| RF vouchers/redemptions | `CAN_PROJECT_WITH_OWNER_TRACE` | voucher lifecycle projection | RF Service | Utility lifecycle only; not payout/cashback |
| Rielt listings/inquiries | `CAN_PROJECT_WITH_OWNER_TRACE` for listings/inquiries; preview only for UI | listing/inquiry projection | Rielt Service | Listing/inquiry only; not booking/payment |
| Content event registrations | `CAN_PROJECT_WITH_OWNER_TRACE` | `OWNER_FACT` / activity preview | Content Service | Registration only; not attendance/payment proof |
| Space posts/activity projection | `CAN_PROJECT_AS_PREVIEW_ONLY` | social/activity projection | Space Service | Social context only; not reward/contribution proof |
| Reactions/aggregates | `CAN_PROJECT_AS_PREVIEW_ONLY` | social signal projection | Reactions Service | Like/bookmark counts are not contribution or reward |
| Referral relations | `CAN_PROJECT_WITH_OWNER_TRACE` | referral read projection | Referral Service | Relationship/status only; not payout/commission |
| Activity events | `CAN_PROJECT_AS_PREVIEW_ONLY` | `ACTIVITY_EVENT_ENVELOPE` | Emitting owner service | Envelope is not authority |
| Admin diagnostics | `ADMIN_DIAGNOSTIC_ONLY` | `DIAGNOSTIC_SNAPSHOT` | Owner service diagnostics | Internal navigation only |
| mock/demo rows | `DO_NOT_USE_AS_PROJECTION_SOURCE` | `MOCK_OR_DEMO` | None | Never truth/proof |
| screenshots/share cards | `DO_NOT_PROJECT_AS_PROOF` | `FORBIDDEN_AS_PROOF` | None | Never support proof |
| token-service readiness | `FORBIDDEN_FOR_STAGE_11` | `FORBIDDEN_AS_PROOF` | Path B only | No token/NFT/wallet proof |

Classification meanings:

| Classification | Meaning |
|---|---|
| `CAN_PROJECT_WITH_OWNER_TRACE` | May be displayed when owner service, source record key, proof class and freshness metadata are available |
| `CAN_PROJECT_AS_PREVIEW_ONLY` | May show bounded preview/context but cannot be proof or full history |
| `ADMIN_DIAGNOSTIC_ONLY` | May be shown to operators only and must point to owner facts |
| `DO_NOT_PROJECT_AS_PROOF` | May exist as artifact but cannot support claims |
| `DO_NOT_USE_AS_PROJECTION_SOURCE` | Must not feed projection truth |
| `FORBIDDEN_FOR_STAGE_11` | Out of scope for Path A Stage 11 |

## 7. Profile Projection Contract

Profile is a projection consumer. Profile is not economy authority.

Current repo state:

```text
profile_surface_status: placeholder/stub
profile_economy_runtime_status: missing
stage_11_5_action: define_contract_only
```

Profile may display:

- user identity/profile information;
- owner-backed badge projection;
- owner-backed soft contribution summary if a future contract allows it;
- bounded recent activity preview;
- personal journey / soft progression language;
- source owner and freshness metadata once implemented in a later slice.

Profile must not display:

- economic authority;
- Points receipt;
- wallet balance as financial balance;
- NFT ownership;
- social score;
- reward ranking;
- contribution proof;
- admin diagnostics;
- booking/payment proof;
- payout/cashback proof;
- mock/demo economy rows as profile truth.

Required Profile projection fields:

| Field | Rule |
|---|---|
| `sourceOwner` | Required for every economy/recognition block |
| `sourceRecordKey` | Required for every item that support may need to locate |
| `asOf` | Required; owner fact timestamp |
| `projectionGeneratedAt` | Required; projection render/composition timestamp |
| `freshnessLabel` / `dataFreshness` | Required once implemented |
| `nonProofCopyBoundary` | Required in UX/copy alignment slice, not implemented here |

Profile contract by block:

| Block | Allowed source | Projection class | Forbidden interpretation |
|---|---|---|---|
| Identity/header | `user_profiles`, auth identity, optional `space_profile_projection` | `PROJECTION_SUMMARY` | Identity proof for economy |
| Badge summary | `user_badges` + `badges` | `PROJECTION_SUMMARY` over `BADGE_AWARD_FACT` | NFT/asset/receipt |
| Soft contribution summary | Future `contribution_record` contract | `CONTRIBUTION_CANDIDATE` preview | Reward, ranking, social score |
| Recent activity preview | Points rows or future activity envelopes with owner trace | `PROJECTION_PREVIEW` | Audit trail |
| Journey/progression copy | Product/design layer after governance | `PROJECTION_SUMMARY` | XP grind / leaderboard |

Profile doctrine:

```text
Profile != economy_authority
Profile != identity_proof_for_economy
Profile badge projection != badge award
Profile activity preview != audit trail
Profile contribution summary != contribution record
Profile journey != XP engine
```

Implementation decision:

```text
profile_projection_contract_status: DEFINED_NOT_IMPLEMENTED
profile_runtime_status: DEFER
profile_ui_changes: false
profile_openapi_sdk_changes: false
```

## 8. Connect Projection Contract

Connect is the primary user-facing projection hub for the bounded internal economy. Connect is not authority.

Current repo state:

```text
connect_dashboard_status: backend_backed_projection
connect_wallet_status: points_read_projection
connect_levels_status: badge_read_projection
connect_rf_section_status: rf_lifecycle_projection
connect_admin_authority_status: none
connect_mock_data_status: quarantined/non-evidence
```

Connect may display:

- Points balance summary from Points Service;
- Points transactions as read projection;
- badges from `user_badges`;
- referral summary as read projection;
- RF voucher summary as lifecycle projection;
- activity feed as recent preview only.

Connect must not display:

- receipt;
- audit trail;
- financial wallet;
- accounting statement;
- payout/cashback dashboard;
- token/NFT wallet;
- booking/payment confirmation;
- contribution authority;
- badge authority;
- leaderboard/prestige economy;
- mock/demo rows as projection truth.

Required Connect doctrine:

```text
Connect Wallet = internal Points projection only
Connect Dashboard = summary only
Connect ActivityFeed = preview only
Connect Levels = badge projection only
Connect Referrals = referral projection only
Connect RF section = voucher lifecycle projection only
```

Connect sub-surface contract:

| Sub-surface | Current source | Required contract class | Forbidden interpretation |
|---|---|---|---|
| Dashboard balance card | `/v1/points/connect-dashboard`, `user_balances` | `PROJECTION_SUMMARY` | Receipt/account statement |
| Wallet summary | `/v1/wallet/summary`, Points ledger-derived buckets | `PROJECTION_SUMMARY` | Financial wallet/custody |
| Transaction list | `/v1/points/transactions`, `points_transactions` | `PROJECTION_PREVIEW` over `ECONOMIC_FACT` | Receipt/audit trail |
| ActivityFeed | limited recent dashboard transactions | `PROJECTION_PREVIEW` | Complete history/audit trail |
| Levels/badges | `/v1/points/badges`, `/v1/points/badges/mine` | `PROJECTION_SUMMARY` over `BADGE_AWARD_FACT` | NFT/XP/progression authority |
| Referrals | referral state + Points joins | `PROJECTION_SUMMARY` | Commission/payout |
| RF section | RF summary and vouchers | lifecycle projection | Cashback/payout/payment |
| Analytics/Missions placeholders | inert/future only | `MOCK_OR_DEMO` / future placeholder | Runtime truth |
| NFT/G2A/Bridge legacy tabs | inert/future only | `FORBIDDEN_AS_PROOF` | Path B launch readiness |

Current Connect implementation gaps for future slices:

| Gap | Status | Later handling |
|---|---|---|
| Projection envelope not present in existing API DTOs | `DEFER` | Requires OpenAPI/SDK/API approval |
| Dashboard badge summaries lack full owner trace | `DEFER` | Requires API contract change |
| Wallet/Activity rows do not expose all support keys | `DEFER` | Requires API/SDK change |
| Client cache freshness is not formalized in payload | `DEFER` | Requires API/UI change |
| Mock/future-only UI cleanup | `DEFER` | Stage 12 or 11.7 cutline, not 11.5 |

Connect display rules:

- recent rows are not complete history;
- summary counts are not audit totals;
- wallet buckets are not financial accounts;
- badge count is not NFT ownership inventory;
- RF status is not payout/cashback;
- referral earned Points summary is not commission statement;
- screenshots of Connect are not support proof.

## 9. Admin Projection / Diagnostics Contract

Admin in Stage 11.5 means diagnostics contract vocabulary only. No Admin service or UI is created here.

Current repo state:

```text
unified_admin_economy_surface: MISSING
existing_diagnostic_patterns: RF diagnostics, Quest outbox ops, Points diagnostics patterns
stage_11_5_action: define_boundary_only
stage_11_6_action: possible implementation after approval
```

Admin may display:

- owner-service lookup keys;
- diagnostic snapshots;
- failed/rejected producer reasons;
- idempotency/replay diagnostics;
- source owner references;
- support navigation hints;
- freshness/staleness state of diagnostics.

Admin must not display:

- customer receipt;
- canonical ledger replacement;
- accounting statement;
- payout report;
- booking/payment proof;
- NFT/token proof;
- projection-as-proof;
- screenshot-as-proof;
- mock/demo rows as diagnostic truth.

Admin diagnostic contract:

- diagnostic snapshot can help find owner facts;
- owner facts remain authority;
- support proof chain must end at owner-service records;
- Admin UI is not proof by itself;
- diagnostics must carry `visibility = admin_diagnostic`;
- diagnostics must not be copied into user-facing Profile/Connect.

Admin diagnostic projection shape:

```text
AdminDiagnosticProjectionV1 {
  diagnosticVersion
  sourceOwner
  lookupSubject
  supportLookupKeys[]
  ownerFactPointers[]
  sourceProofClass
  asOf
  projectionGeneratedAt
  dataFreshness
  stalenessStatus
  visibility = admin_diagnostic
  isAuthoritative = false
  isProof = false
  isReceipt = false
}
```

Admin doctrine:

```text
Admin_dashboard != customer_proof
Admin_diagnostics != canonical_fact
diagnostic_snapshot != support_receipt
admin_lookup_key != proof
support_resolution_requires_owner_fact
```

Implementation decision:

```text
admin_projection_contract_status: DEFINED_NOT_IMPLEMENTED
admin_service_status: DEFER_TO_11_6
admin_ui_changes: false
admin_routes_created: false
```

## 10. Support Lookup Key Matrix

Support can use projection data only as navigation hints. Support proof must resolve to owner-service records.

| Domain | Allowed lookup keys | Authority owner | Proof class | Forbidden proof interpretation |
|---|---|---|---|---|
| Points | `transactionId`, `externalId`, `userId`, `reason/action`, `sourceService`, `sourceEventId`, `createdAt` | Points Service, `points_transactions`, `user_balances` | `ECONOMIC_FACT` | Dashboard/Wallet/ActivityFeed screenshot as receipt |
| Badge | `userBadgeId`, `badgeId`, `badgeCode`, `sourceService`, `sourceType`, `sourceId`, `earnedAt` | Points Service, `badges`, `user_badges` | `BADGE_AWARD_FACT` | Badge card/share/screenshot as award proof |
| Contribution | future `contributionRecordId`, owner fact keys, review status keys | Future contribution owner | `CONTRIBUTION_CANDIDATE` | Contribution projection as reward/proof |
| Activity event | `eventId`, `sourceService`, `sourceRecordKey`, `sourceEventId`, `actorUserId`, `subjectId` | Emitting owner service | `ACTIVITY_EVENT_ENVELOPE` | Activity feed as audit trail |
| Quest | `questId`, `progressId`, `submissionId`, `stepId`, `outboxId`, `externalId`, `sourceEventId` | Quest Service | `OWNER_FACT` / delivery intent | Quest preview/outbox as reward receipt |
| RF | `voucherId`, `offerId`, `partnerId`, `redemptionId`, `pointsDebitExternalId`, `idempotencyKey`, `correlationId` | RF Service | owner lifecycle fact | RF projection as payout/cashback/refund |
| Rielt | `listingId`, `inquiryId`, `requesterUserId`, `idempotencyKey`, `createdByUserId` | Rielt Service | owner listing/inquiry fact | Listing/inquiry as booking/payment proof |
| Content/Pulse | `eventRegistrationId`, `eventId`, `userId`, `registeredAt`, `sourceEventId` | Content Service | owner activity fact | Registration as attendance/payment proof |
| Space/Reactions | `spacePostId`, `spaceActivityProjectionId`, `sourceRecordKey`, `sourceEventId`, `reactionId`, `targetType`, `targetId` | Space/Reactions services | social signal / projection | Likes/reactions/posts as reward/contribution proof |
| Referral/Auth | `referralRelationId`, `referrerId`, `refereeId`, `referralCode`, Points `externalId` pattern, `firstLoginAt` | Referral Service / Auth / Points for Points rows | owner relation fact + `ECONOMIC_FACT` where applicable | Referral summary as payout/commission |
| Admin diagnostics | `diagnosticId`, `requestId`, `correlationId`, `ownerFactPointers`, owner lookup keys | Respective owner service | `DIAGNOSTIC_SNAPSHOT` | Admin snapshot as customer proof |

Support resolution rule:

```text
projection artifact
-> extract supportLookupKeys
-> query owner service by owner keys
-> inspect owner fact/proof class
-> resolve support case

never:
projection screenshot
-> accepted as proof
```

## 11. Freshness / Staleness Doctrine

Freshness vocabulary:

| Term | Definition |
|---|---|
| `asOf` | Timestamp of the owner fact/state represented by the projection |
| `projectionGeneratedAt` | Timestamp when the projection/read model was composed |
| `fresh` | Projection is within the accepted freshness window for display |
| `stale` | Projection may be displayed with warning but cannot be support proof |
| `expired` | Projection should be refreshed before meaningful display |
| `unknown_freshness` | Projection lacks enough metadata to assess freshness |

Rules:

- stale projection may be displayed with warning;
- stale projection may not be support proof;
- unknown freshness may not be proof;
- projection refresh does not create owner fact;
- projection replay does not create reward;
- projection cache does not override owner state;
- client cache does not extend owner fact validity;
- dashboard totals are not audit totals;
- recent rows are not complete history.

Freshness source rules:

| Domain | `asOf` source | Projection freshness rule |
|---|---|---|
| Points balance | `user_balances.updatedAt` | Support must re-query Points Service |
| Points transaction | `points_transactions.createdAt` | Row display allowed; receipt forbidden |
| Badge award | `user_badges.earnedAt` / `createdAt` | Badge projection can be stale but not award proof |
| Badge catalog | `badges.updatedAt` | Catalog does not prove user award |
| Quest progress/submission | `updatedAt` / `createdAt` | Outbox remains delivery intent |
| RF voucher | `updatedAt`, `statusChangedAt`, `claimedAt`, `redeemedAt` | Connect RF is lifecycle projection only |
| Rielt inquiry | `createdAt`, `closedAt` | Inquiry is not booking/payment |
| Content event registration | `registeredAt` | Registration is not attendance/payment proof |
| Space activity projection | `occurredAt` and source record keys | Social preview only |
| Referral relation | `registeredAt`, `firstLoginAt` | Referral state is not payout statement |
| Admin diagnostic | owner fact timestamps plus `projectionGeneratedAt` | Diagnostic snapshot is not proof |

Freshness doctrine:

```text
asOf != projectionGeneratedAt
projectionGeneratedAt != owner_fact_created
fresh_projection != proof
stale_projection != proof
expired_projection != proof
unknown_freshness != proof
projection_cache != authority_state
```

## 12. Mock / Screenshot / Demo Evidence Rules

Mandatory evidence rules:

```text
mock_data != projection_truth
demo_data != support_proof
screenshot != proof
share_card != proof
static_home_stats != proof
mock_badge_earnedAt != badge_award
mock_wallet_row != points_transaction
mock_rielt_verifiedBooking != booking
mock_rf_dashboard != payout
```

Mock/demo source handling:

| Artifact | Classification | Rule |
|---|---|---|
| Connect `mockData.ts` | `MOCK_OR_DEMO` | Never projection truth |
| Connect mock Dashboard/Wallet/Referrals views | `MOCK_OR_DEMO` | Never support evidence |
| Home static rewards/stats | `MOCK_OR_DEMO` | Not MVP economy proof |
| Space mock balances/badges/NFT/transactions | `MOCK_OR_DEMO` | Not Points, badge or NFT proof |
| Quest local reward previews/NFT badge metadata | `PROJECTION_PREVIEW` / `MOCK_OR_DEMO` | Preview only; not grant/mint |
| RF mock dashboard / PRO summaries | `MOCK_OR_DEMO` | Not payout/settlement |
| Rielt `verifiedBooking` mock vocabulary | `FORBIDDEN_AS_PROOF` | Not booking/payment |
| Screenshots | `FORBIDDEN_AS_PROOF` | Never support proof |
| Share cards | `FORBIDDEN_AS_PROOF` | Social artifact only |
| token-service health/ready | `FORBIDDEN_FOR_STAGE_11` | Not Path A readiness proof |

Support rule:

```text
support_may_receive_screenshot: true
support_may_use_screenshot_as_navigation_hint: true
support_may_accept_screenshot_as_proof: false
support_must_resolve_owner_record: true
```

## 13. Soft Gamification Clarification

Stage 11 does not ban future gamification.

Stage 11 bans premature/extractive/economic gamification.

Stage 11.5 must preserve the possibility of safe future motivation while preventing Profile, Connect and Admin projections from becoming reward proof, social score, financial/accounting surface or projection-driven prestige economy.

Allowed future direction:

- personal journey;
- symbolic recognition;
- soft progression;
- gentle motivation;
- non-financial achievement memory.

Forbidden now:

- grind economy;
- social score;
- leaderboard pressure;
- monetized prestige;
- reaction farming;
- projection-driven status proof;
- badge-as-NFT/asset;
- contribution-as-reward;
- dashboard-as-status-proof;
- reward farming through projections.

Soft gamification doctrine:

```text
soft_gamification_allowed_later: true
premature_extractive_gamification_forbidden_now: true
personal_journey != XP_grind
symbolic_recognition != monetized_prestige
soft_progression != social_score
achievement_memory != reward_farming
```

Future soft progression may return later as product/design layer after governance boundaries are stable.

Stage 11.5 does not define or implement:

- XP engine;
- leaderboard;
- social score;
- streak economy;
- public rank proof;
- badge rarity value;
- projection-driven prestige economy.

## 14. Runtime / Schema / UI Decision

Runtime/schema/UI decision:

```text
projection_contract_status: DEFINED_NOT_IMPLEMENTED
projection_runtime_status: DEFER
projection_schema_status: PROPOSAL_ONLY
profile_ui_changes: false
connect_ui_changes: false
admin_ui_changes: false
admin_service_status: DEFER_TO_11_6
cutline_enforcement_status: DEFER_TO_11_7
smoke_proof_status: DEFER_TO_11_8
```

Implementation-readiness notes:

| Need | Stage 11.5 action | Future status |
|---|---|---|
| Projection metadata in API DTOs | Document contract only | `DEFER / REQUIRES_SEPARATE_SLICE_APPROVAL` |
| OpenAPI/SDK fields for `asOf`, `projectionGeneratedAt`, `supportLookupKeys` | Do not change | `DEFER` |
| Profile projection UI | Do not build | Future UI/product slice |
| Connect labels/copy alignment | Do not change | Stage 12 or owner-approved UI slice |
| Admin diagnostics UI/service | Do not build | Stage 11.6 |
| Cutline/mock enforcement | Do not wire | Stage 11.7 |
| Runtime smoke proof | Do not create | Stage 11.8 |
| Path B token/NFT/gateway | Do not touch | Future Path B only |

## 15. Stage 11 Slice Handoff

Stage 11.5 handoff to Stage 11.6:

- implement or design Admin Economy Diagnostics only after this contract is accepted;
- support lookup must start from owner keys, not screenshots;
- diagnostics must remain `DIAGNOSTIC_SNAPSHOT`, not customer proof;
- Admin can help locate Points, badge, Quest, RF, Rielt, Content, Space/Reactions and Referral owner records;
- Admin must not create an accounting statement or public receipt.

Stage 11.5 handoff to Stage 11.7:

- cutline enforcement can later block mock/demo projection sources;
- feature flags can later gate projection surfaces;
- future flags must fail closed;
- no flag wiring is done in Stage 11.5.

Stage 11.5 handoff to Stage 11.8:

- smoke proof must use owner IDs and owner facts;
- smoke proof must not use Dashboard/Wallet/ActivityFeed/Profile screenshots as proof;
- smoke proof must not become public rollout evidence.

Stage 11.5 handoff to Stage 12 / future UI alignment:

- Profile UI can be built only as projection consumer;
- Connect copy can be aligned with non-proof/freshness labels;
- legacy NFT/G2A/mock vocabulary can be cleaned up;
- soft gamification can be reintroduced only after governance boundaries are stable.

Explicit stop lines:

```text
do_not_start_11_6_in_11_5
do_not_start_11_7_in_11_5
do_not_start_11_8_in_11_5
do_not_start_stage_12_ui_alignment_in_11_5
do_not_start_path_b_in_11_5
```

## 16. Risk Register

| ID | Risk | Severity | Stage 11.5 mitigation |
|---|---|---|---|
| R-115-01 | Dashboard totals become support receipt | CRITICAL | `Dashboard != receipt`, support lookup matrix |
| R-115-02 | Wallet becomes financial wallet | CRITICAL | `Wallet != financial_wallet`, internal Points projection doctrine |
| R-115-03 | ActivityFeed becomes audit trail | HIGH | `ActivityFeed != audit_trail`, bounded preview rule |
| R-115-04 | Points projection becomes ledger | HIGH | `Points_projection != Points_ledger`, owner fact lookup only |
| R-115-05 | RF projection becomes payout/cashback | CRITICAL | RF lifecycle projection only |
| R-115-06 | Rielt projection becomes booking/payment | CRITICAL | Listing/inquiry only |
| R-115-07 | Badge projection becomes NFT/asset | CRITICAL | `Badge_projection != badge_award`, `badge != NFT` inherited |
| R-115-08 | Contribution projection becomes reward | HIGH | `Contribution_projection != contribution_record`, candidate only |
| R-115-09 | Screenshot/share card becomes proof | CRITICAL | `FORBIDDEN_AS_PROOF` |
| R-115-10 | Mock/demo rows become truth | CRITICAL | `MOCK_OR_DEMO`, no projection source |
| R-115-11 | Stale projection drives support dispute | HIGH | Freshness/staleness doctrine |
| R-115-12 | Admin diagnostic becomes customer proof | HIGH | `DIAGNOSTIC_SNAPSHOT` admin-only boundary |
| R-115-13 | Projection-driven prestige economy emerges | HIGH | Soft gamification clarification and forbidden status proof |
| R-115-14 | Path B readiness inferred from token/NFT placeholders | CRITICAL | Path B remains forbidden for Stage 11 |

## 17. Review Gates

Stage 11.5 can be accepted only if these gates pass:

| Gate | Required result |
|---|---|
| Projection boundary gate | `projection != authority` is frozen |
| Proof gate | User-facing projections have `isProof = false` and `isReceipt = false` |
| Economy gate | No wallet/accounting/payout/cashback/booking/token/NFT semantics |
| Badge gate | Badge projection remains separate from badge award and NFT/asset |
| Contribution gate | Contribution projection remains separate from contribution record/reward |
| Admin gate | Diagnostics are admin-only navigation, not customer proof |
| Freshness gate | `asOf`, `projectionGeneratedAt`, stale/expired/unknown rules are defined |
| Mock gate | Mock/demo/share/screenshot artifacts are forbidden as proof |
| Slice gate | 11.6/11.7/11.8/Stage 12/Path B are not started |
| Runtime gate | No production service/schema/API/SDK/UI changes |

## 18. Acceptance Criteria

Stage 11.5 is successful if:

- projection boundary is clearly defined;
- Profile/Connect/Admin contracts are defined;
- support lookup key matrix is created;
- freshness/staleness doctrine is defined;
- `projection != authority` doctrine is frozen;
- `Dashboard != receipt` doctrine is frozen;
- `Wallet != financial wallet` doctrine is frozen;
- `ActivityFeed != audit trail` doctrine is frozen;
- mock/screenshot/demo evidence rules are frozen;
- soft gamification clarification is included;
- no runtime/schema/API/SDK/UI changes are made;
- no Path B leakage occurs;
- no Stage 11.6/11.7/11.8 work is started;
- next slice recommendation is included.

Acceptance status:

```text
projection_boundary_defined: true
profile_contract_defined: true
connect_contract_defined: true
admin_contract_defined: true
support_lookup_key_matrix_created: true
freshness_staleness_doctrine_defined: true
mock_screenshot_demo_rules_frozen: true
soft_gamification_clarification_included: true
runtime_changes_made: false
schema_changes_made: false
api_sdk_changes_made: false
ui_changes_made: false
path_b_leakage: false
stage_11_6_started: false
stage_11_7_started: false
stage_11_8_started: false
```

## 19. Final Verdict

Stage 11.5 defines the Profile / Connect / Admin Projection Contract.

Final verdict:

```text
stage_11_5_status: READY_as_docs_first_projection_contract
projection_contract_status: DEFINED_NOT_IMPLEMENTED
profile_projection_status: DEFINED_CONSUMER_CONTRACT_ONLY
connect_projection_status: EXISTING_PARTIAL_READ_SURFACES_WITH_CONTRACT_GAPS_DOCUMENTED
admin_projection_status: DIAGNOSTIC_CONTRACT_ONLY_DEFER_TO_11_6
runtime_implementation_status: false
schema_migration_status: false
openapi_sdk_status: false
ui_change_status: false
path_a_status: PRESERVED
path_b_status: FORBIDDEN_FOR_STAGE_11
next_recommended_slice: Stage 11.6 — Admin Economy Diagnostics
```

Stage 11.5 does not kill future soft gamification. It prevents projections from becoming authority, proof, receipt, social score, financial surface, payout surface, booking/payment proof, NFT/token proof or prestige economy.

The correct next slice is:

```text
Stage 11.6 — Admin Economy Diagnostics
```

Stage 11.6 may begin only after this 11.5 projection contract is accepted. It must implement diagnostics as owner-key navigation and must not turn Admin into customer proof, ledger replacement or accounting surface.
