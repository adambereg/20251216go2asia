# Stage 11.6 — Admin Economy Diagnostics

Документ: `stage_11_6_admin_economy_diagnostics_v1.md`  
Статус: docs-first diagnostics contract with implementation-readiness assessment  
Дата: 2026-05-22  
Scope: Stage 11.6 of Path A — Admin Economy Diagnostics boundary, support/navigation contract and readiness assessment  
Mode: read-only architecture design; no migrations; no DB schema changes; no OpenAPI/SDK/generated changes; no production service changes; no UI changes; no Admin service creation; no public proof routes; no cutline enforcement; no smoke proof; no Path B

## 0. Orchestration Summary

Task type: docs-first diagnostics contract and implementation-readiness assessment.

Risk level: CRITICAL because Admin diagnostics can accidentally become a customer proof system, accounting dashboard, ledger replacement, payout report, booking proof or NFT/token proof if its internal support role is not explicitly bounded.

Execution mode:

```text
runtime_implementation_allowed: false
schema_migration_allowed: false
openapi_sdk_changes_allowed: false
ui_changes_allowed: false
admin_service_creation_allowed: false
diagnostic_routes_created: false
cutline_enforcement_allowed: false
smoke_proof_allowed: false
path_b_activation_allowed: false
```

Controlling docs:

- `docs/architecture/domain/stage_11_0_scope_and_guardrails_v1.md`
- `docs/architecture/domain/stage_11_1_activity_event_contract_and_feature_flag_naming_v1.md`
- `docs/architecture/domain/stage_11_2_points_ledger_minimal_runtime_and_producer_allowlist_v1.md`
- `docs/architecture/domain/stage_11_3_contribution_record_boundary_and_candidate_model_v1.md`
- `docs/architecture/domain/stage_11_4_badge_progression_minimal_state_v1.md`
- `docs/architecture/domain/stage_11_5_profile_connect_admin_projection_contract_v1.md`

Supporting docs:

- `docs/architecture/domain/stage_10_10_ux_copy_proof_class_alignment_v1.md`
- `docs/architecture/domain/stage_10_11_mvp_economy_cutline_v1.md`
- `docs/architecture/domain/stage_10_12_implementation_readiness_plan_v1.md`
- `docs/roadmaps/stage_10_13_economy_runtime_landing_audit_v1.md`

Runtime and diagnostic facts checked read-only:

- `packages/db/src/schema/points.ts`
- `packages/db/src/schema/quest.ts`
- `packages/db/src/schema/rf.ts`
- `packages/db/src/schema/rielt.ts`
- `packages/db/src/schema/content.ts`
- `packages/db/src/schema/space.ts`
- `packages/db/src/schema/reactions.ts`
- `packages/db/src/schema/referral.ts`
- `apps/points-service/src/index.ts`
- `apps/points-service/src/producerAllowlist.ts`
- `apps/points-service/src/spendabilityShadow.ts`
- `apps/quest-service/src/routes/quests.ts`
- `apps/quest-service/src/services/questService.ts`
- `apps/rf-service/src/routes/rf.ts`
- `apps/rf-service/src/store.ts`
- `apps/rf-service/src/vipEntitlementShadow.ts`
- `apps/rf-service/src/durableDiagnostics/*`
- `apps/rielt-service/src/routes/inquiry.ts`
- `apps/content-service/src/index.ts`
- `apps/space-service/src/*`
- `apps/reactions-service/src/*`
- `apps/api-gateway/src/index.ts`
- `apps/go2asia-pwa-shell/middleware.ts`
- `apps/go2asia-pwa-shell/**/admin/**` search result: no Admin UI routes found

Multi-agent review passes applied:

| Pass | Role | Result |
|---|---|---|
| Orchestrator | AI Program Director / Orchestrator | Stage 11.6 is docs-first internal diagnostics contract |
| Runtime Governance | Runtime Governance Architect | Diagnostic snapshot, owner fact flow, authority map and visibility rules defined |
| Economy | Economy Architect | No admin ledger/accounting/payout/booking/token/NFT/reward-grant semantics |
| Security / Fraud | Security / Fraud & Abuse Specialist | Screenshot, stale diagnostic, mock, PII, role leakage and replay misuse guardrails defined |
| Architecture | Software Architect | Existing diagnostics inventory and implementation gaps documented |
| Slice Strategist | Slice Strategist | 11.7/11.8/Stage 12/Path B/runtime implementation boundaries preserved |
| Canon Writer | Technical Canon Writer | Stable vocabulary, forbidden vocabulary and final verdict frozen |

Existing diagnostics found:

- Points Service spendability shadow diagnostics, service-auth and flag-gated;
- Points Service producer rejection and idempotency conflict logs;
- Quest Service reward outbox stats, failed list, replay pending and requeue failed routes;
- RF Service voucher diagnostics, entitlement preview/shadow/durable diagnostics;
- API Gateway role/auth patterns and debug identity shadow endpoint;
- PWA middleware admin route guard pattern, but no Admin UI route found.

Implementation permission:

```text
admin_diagnostics_contract_status: DEFINED_NOT_IMPLEMENTED
admin_runtime_status: DEFER
admin_schema_status: PROPOSAL_ONLY
admin_ui_status: DEFER
admin_service_status: DEFER
diagnostic_routes_created: false
cutline_enforcement_status: DEFER_TO_11_7
smoke_proof_status: DEFER_TO_11_8
```

## 1. Executive Summary

Stage 11.6 defines Admin Economy Diagnostics as an internal support/navigation layer over owner facts.

The core decision:

```text
Admin Economy Diagnostics = internal owner-fact lookup assistant
Admin Economy Diagnostics != authority
Admin Economy Diagnostics != customer proof
Admin Economy Diagnostics != receipt
Admin Economy Diagnostics != ledger
Admin Economy Diagnostics != accounting dashboard
```

Admin diagnostics can help support locate facts, inspect delivery intent, understand idempotency/replay behavior, view rejected producer reasons and assess freshness/staleness. It must not create or replace the owner facts themselves.

Mandatory doctrine:

```text
Admin diagnostics != authority
Admin diagnostics != customer proof
Admin dashboard != receipt
Admin snapshot != ledger
Admin snapshot != accounting statement
Admin diagnostics != payout report
Admin diagnostics != booking proof
Admin diagnostics != NFT/token proof
Diagnostic snapshot != economic_fact
Diagnostic snapshot != badge_award
Diagnostic snapshot != contribution_record
Diagnostic snapshot != activity_event authority
Support proof must resolve to owner-service records
Screenshot != support proof
Projection != support proof
Mock/demo != diagnostic truth
```

Stage 11.6 does not create runtime. It defines:

- Admin Economy Diagnostics boundary;
- diagnostic snapshot contract;
- diagnostic classes;
- diagnostic source classification;
- existing diagnostics inventory;
- support lookup workflow;
- support proof chains;
- internal visibility and security rules;
- domain-by-domain diagnostic rules;
- implementation-readiness gaps and handoff.

Final summary:

```text
existing_diagnostics_status: PARTIAL
unified_admin_diagnostics_status: MISSING
admin_ui_status: MISSING
stage_11_6_action: define_contract_and_readiness_only
```

## 2. Admin Diagnostics Definition

Admin Economy Diagnostics is an internal support/navigation layer over owner-service facts.

It is:

- internal support/navigation layer;
- owner-fact lookup assistant;
- replay/idempotency visibility layer;
- rejected producer / guardrail visibility layer;
- diagnostic snapshot over owner services;
- implementation-readiness map for future bounded admin tooling.

It is not:

- customer-facing proof;
- economic authority;
- Points ledger replacement;
- accounting system;
- payout/cashback report;
- booking/payment proof;
- NFT/token ownership proof;
- public support receipt;
- smoke proof.

Admin Diagnostics may:

- show support lookup keys;
- help find Points transaction;
- help find badge award;
- help find RF voucher lifecycle fact;
- help find Quest outbox/delivery intent;
- help find Rielt inquiry;
- help find Content event registration;
- show rejected producer reasons;
- show idempotency/replay context;
- show freshness/staleness warning.

Admin Diagnostics may not:

- replace owner-service fact;
- replace Points ledger;
- be a statement;
- be a receipt;
- be an accounting dashboard;
- confirm payout;
- confirm booking;
- confirm NFT/token ownership;
- accept screenshot as proof;
- grant rewards from diagnostics;
- mutate owner facts without a separately approved runtime operation.

Minimum model:

```text
support_request
-> diagnostic_snapshot
-> ownerFactPointers
-> owner_service_lookup
-> proof_class_verification
-> internal support summary
```

Correct terminus:

```text
support proof chain terminates at owner-service record
support proof chain does not terminate at diagnostic snapshot
```

## 3. Admin Diagnostics Non-Goals

Stage 11.6 does not:

- create Admin service;
- create Admin UI;
- create new DB tables;
- create migrations;
- change OpenAPI;
- regenerate SDK/types;
- change production services;
- create public support proof pages;
- create receipt routes;
- create accounting statement;
- create payout/cashback report;
- create booking/payment proof;
- create token/NFT proof;
- create smoke proof;
- wire cutline enforcement;
- change projection UI;
- change Points producer enforcement;
- create manual reward grant UI;
- create public diagnostic export;
- create user-facing diagnostic URL;
- create cross-service ledger.

Forbidden interpretations:

| Misread | Stage 11.6 rule |
|---|---|
| Admin diagnostics as authority | `FORBIDDEN_FOR_STAGE_11` |
| Admin dashboard as receipt | `FORBIDDEN_FOR_STAGE_11` |
| Admin snapshot as ledger | `FORBIDDEN_FOR_STAGE_11` |
| Admin diagnostics as accounting statement | `FORBIDDEN_FOR_STAGE_11` |
| RF diagnostic as payout/cashback report | `FORBIDDEN_FOR_STAGE_11` |
| Rielt diagnostic as booking/payment proof | `FORBIDDEN_FOR_STAGE_11` |
| Badge diagnostic as NFT/token proof | `FORBIDDEN_FOR_STAGE_11` |
| Quest outbox diagnostic as reward receipt | `FORBIDDEN_FOR_STAGE_11` |
| Screenshot/mock/projection as support proof | `FORBIDDEN_FOR_STAGE_11` |

## 4. Diagnostic Snapshot Contract

This is a contract proposal only. It is not schema, OpenAPI, SDK or runtime implementation.

| Field | Required? | Meaning | Stage 11.6 rule |
|---|---|---|---|
| `diagnosticId` | Yes | Stable diagnostic snapshot/request ID | Not proof by itself |
| `diagnosticType` | Yes | Type of diagnostic | Example: `admin_economy_lookup` |
| `diagnosticVersion` | Yes | Contract version | Example: `admin_economy_diagnostic_v1` |
| `sourceOwner` | Yes | Owner service/domain of facts inspected | Must never be `Admin`, `Connect`, screenshot or mock |
| `sourceService` | Yes | Service that produced diagnostic data | Required for trace |
| `lookupSubject` | Yes | The queried subject value | Example: transaction, voucher, outbox, inquiry, registration |
| `lookupSubjectType` | Yes | Type of queried subject | Example: `externalId`, `voucherId`, `outboxId`, `userId` |
| `ownerFactPointers` | Yes | Typed pointers to owner records | Required; diagnostic must end in owner lookup |
| `supportLookupKeys` | Yes | Support navigation keys | Hints only, not proof |
| `proofClass` | Yes | Proof class of diagnostic itself | Must be `diagnostic_snapshot` |
| `diagnosticClass` | Yes | Class from Stage 11.6 registry | Controls support interpretation |
| `asOf` | Yes | Latest owner fact timestamp represented | Required for freshness |
| `diagnosticGeneratedAt` | Yes | Snapshot generation timestamp | Not owner fact timestamp |
| `dataFreshness` | Yes | Freshness class | `fresh`, `stale`, `expired`, `unknown_freshness` |
| `stalenessStatus` | Yes | Human/operator staleness interpretation | Stale/unknown cannot close proof chain |
| `requestId` | Conditional | Request trace ID | Trace only |
| `correlationId` | Conditional | Cross-service correlation | Trace only |
| `idempotencyKey` | Conditional | Idempotency key or masked/fingerprinted key | Use masked/fingerprint where sensitive |
| `visibility` | Yes | Visibility boundary | Must be `admin_diagnostic` |
| `operatorBoundary` | Yes | Operator interpretation | Must be `internal_navigation_only` |
| `isAuthoritative` | Yes | Whether diagnostic is authority | Must be `false` |
| `isCustomerProof` | Yes | Whether diagnostic can be shown as proof | Must be `false` |
| `metadata` | Optional | Bounded diagnostic metadata | Must not contain raw secrets or hidden financial semantics |

Mandatory values:

```text
isAuthoritative = false
isCustomerProof = false
visibility = admin_diagnostic
operatorBoundary = internal_navigation_only
proofClass = diagnostic_snapshot
```

Recommended owner fact pointer shape:

```text
ownerFactPointers[] = {
  sourceOwner
  sourceService
  sourceRecordKey
  ownerProofClass
  asOf
  lookupStatus
  forbiddenInterpretation
}
```

Snapshot example shape:

```text
AdminEconomyDiagnosticSnapshotV1 {
  diagnosticId
  diagnosticType
  diagnosticVersion
  sourceOwner
  sourceService
  lookupSubject
  lookupSubjectType
  ownerFactPointers[]
  supportLookupKeys[]
  proofClass = diagnostic_snapshot
  diagnosticClass
  asOf
  diagnosticGeneratedAt
  dataFreshness
  stalenessStatus
  requestId
  correlationId
  idempotencyKey
  visibility = admin_diagnostic
  operatorBoundary = internal_navigation_only
  isAuthoritative = false
  isCustomerProof = false
  metadata
}
```

PII and secret handling:

- redact PII by default;
- mask voucher codes, correlation IDs and idempotency keys where possible;
- expose raw values only if separately approved for internal service-to-service tools;
- diagnostic export to customer remains forbidden.

## 5. Diagnostic Classes

Stage 11.6 uses these diagnostic classes:

| Class | Meaning | Example | Proof terminus |
|---|---|---|---|
| `OWNER_FACT_LOOKUP` | Generic lookup of owner-service record | Lookup by owner key | Owner row |
| `ECONOMIC_FACT_LOOKUP` | Points economic fact lookup | `points_transactions` by `externalId` | Points row |
| `BADGE_AWARD_LOOKUP` | Badge award lookup | `user_badges` by `userBadgeId` | Badge award row |
| `DELIVERY_INTENT_LOOKUP` | Quest delivery/outbox lookup | `quest_reward_outbox` | Delivery intent, then Points row if reward applied |
| `VOUCHER_LIFECYCLE_LOOKUP` | RF voucher lifecycle lookup | `rf_voucher`, redemptions, recovery | RF lifecycle row |
| `LISTING_INQUIRY_LOOKUP` | Rielt listing/inquiry lookup | `rielt_listing_inquiry` | Inquiry row |
| `CONTENT_REGISTRATION_LOOKUP` | Content/Pulse registration lookup | `event_registrations` | Registration row |
| `SOCIAL_SIGNAL_LOOKUP` | Space/Reactions lookup | post/reaction/activity projection | Social signal only |
| `PRODUCER_REJECTION_DIAGNOSTIC` | Producer allowlist rejection visibility | Points rejection reason | Rejection log/context, not proof |
| `IDEMPOTENCY_REPLAY_DIAGNOSTIC` | Duplicate/replay/conflict context | `externalId`, idempotency fingerprints | Owner row or conflict state |
| `PROJECTION_FRESHNESS_DIAGNOSTIC` | Projection freshness/staleness context | `asOf` vs generated time | Never proof |
| `MOCK_OR_DEMO_QUARANTINE` | Mock/demo artifact quarantine | mock wallet row, mock badge | Never proof |
| `FORBIDDEN_AS_CUSTOMER_PROOF` | Artifact that must not be proof | screenshot/share card | Never proof |

Class doctrine:

```text
diagnostic_snapshot != owner_fact
diagnostic_class != proof_class
lookup_class helps route support
proof_class determines authority
```

## 6. Diagnostic Source Classification

Diagnostic source classification determines what Admin diagnostics may use and how.

| Source | Classification | Stage 11.6 rule |
|---|---|---|
| Points transactions | `CAN_DIAGNOSE_WITH_OWNER_KEYS` | Economic proof requires `points_transactions` row |
| Points balances | `CAN_DIAGNOSE_WITH_OWNER_KEYS` | Balance state is owner state; diagnostic snapshot is not balance authority |
| Points producer rejections | `ADMIN_DIAGNOSTIC_ONLY` | Explains rejected attempt; not final support proof |
| Points idempotency conflicts | `ADMIN_DIAGNOSTIC_ONLY` | Integration/fraud context; compare owner row |
| Badge awards | `CAN_DIAGNOSE_WITH_OWNER_KEYS` | `user_badges` row is badge award fact |
| Quest reward outbox | `ADMIN_DIAGNOSTIC_ONLY` | Delivery intent; must resolve Points row for reward proof |
| RF voucher diagnostics | `ADMIN_DIAGNOSTIC_ONLY` | Lifecycle diagnostics only; not payout/cashback |
| RF redemption/recovery rows | `CAN_DIAGNOSE_WITH_OWNER_KEYS` | Recovery trace; not refund/payout promise |
| Rielt inquiries | `CAN_DIAGNOSE_WITH_OWNER_KEYS` | Inquiry only; not booking/payment |
| Content event registrations | `CAN_DIAGNOSE_WITH_OWNER_KEYS` | Registration only; not attendance/payment |
| Space/Reactions social signals | `CAN_USE_AS_NAVIGATION_HINT` | Social signal only; no reward proof |
| Referral relations | `CAN_DIAGNOSE_WITH_OWNER_KEYS` | Relation/status only; no commission proof |
| Profile/Connect projections | `CAN_USE_AS_NAVIGATION_HINT` | Extract owner hints only; not proof |
| Screenshots | `FORBIDDEN_AS_CUSTOMER_PROOF` | Hint only; never support proof |
| Mock/demo rows | `DO_NOT_USE_AS_DIAGNOSTIC_TRUTH` | Never diagnostic truth |
| token-service readiness | `FORBIDDEN_FOR_STAGE_11` | Not token/NFT/wallet proof |

Classification meanings:

| Classification | Meaning |
|---|---|
| `CAN_DIAGNOSE_WITH_OWNER_KEYS` | May be used when owner keys resolve to owner-service records |
| `ADMIN_DIAGNOSTIC_ONLY` | Internal diagnostics only, not customer proof |
| `CAN_USE_AS_NAVIGATION_HINT` | May guide lookup but cannot close support case |
| `DO_NOT_USE_AS_DIAGNOSTIC_TRUTH` | Must not be treated as diagnostic fact |
| `FORBIDDEN_AS_CUSTOMER_PROOF` | Must not be customer-facing proof |
| `FORBIDDEN_FOR_STAGE_11` | Out of scope for Path A Stage 11 |

## 7. Existing Diagnostics Inventory

Existing diagnostics are partial and scattered. Stage 11.6 standardizes their interpretation but does not change them.

| Surface | Path/file | Visibility | Proof class | Support use | Forbidden interpretation | Stage 11.6 rule |
|---|---|---|---|---|---|---|
| Points spendability shadow diagnostics | `apps/points-service/src/index.ts`, `GET /internal/points/spendability-shadow/diagnostics`; `apps/points-service/src/spendabilityShadow.ts` | `internal_only`, service JWT, flag-gated | `diagnostic_snapshot` / shadow observability | Drift/aggregate visibility | Spend authority, customer balance proof | Internal engineering diagnostic only |
| Points producer rejection logs | `apps/points-service/src/index.ts`, allowlist rejection before writes | internal logs / response codes | `PRODUCER_REJECTION_DIAGNOSTIC` | Explain failed producer attempt | Final support proof or fraud verdict | Must still resolve owner facts |
| Points idempotency conflict handling | `apps/points-service/src/index.ts`, `externalId` conflict paths | internal logs / 409 | `IDEMPOTENCY_REPLAY_DIAGNOSTIC` | Duplicate/replay/integration mismatch context | New grant or denial proof by itself | Compare existing owner row |
| Points user transactions read | `GET /v1/points/transactions` | user projection | projection over `ECONOMIC_FACT` | User navigation hint | Admin lookup API or receipt | Not Admin diagnostics runtime |
| Badge internal award | `POST /internal/points/badges/award` | service-to-service | `BADGE_AWARD_FACT` if `user_badges` row exists | Award lookup candidate | NFT/asset/customer receipt | Owner fact only; no Admin route created |
| Quest replay pending | `POST /internal/quests/rewards/replay-pending` | `internal_only`, service principal | delivery pipeline diagnostic / mutation | Retry pending deliveries | Customer receipt or grant proof | Mutating ops, not proof |
| Quest outbox stats | `GET /internal/quests/rewards/outbox/stats` | `internal_only`, service principal | `DELIVERY_INTENT_LOOKUP` | Pending/delivered/failed counts | Applied Points proof | Delivery intent only |
| Quest failed outbox list | `GET /internal/quests/rewards/outbox/failed` | `internal_only`, service principal | `DELIVERY_INTENT_LOOKUP` | Inspect failed deliveries | Reward denial proof | Must resolve Points row |
| Quest requeue failed | `POST /internal/quests/rewards/outbox/requeue-failed` | `internal_only`, service principal | delivery pipeline operation | Ops remediation | Grant/receipt | Separate mutation boundary |
| RF voucher diagnostics | `GET /v1/rf/internal/vouchers/{voucherId}/diagnostics` in `apps/rf-service/src/routes/rf.ts`, `apps/rf-service/src/store.ts` | `admin_diagnostic`, Gateway + admin role | `VOUCHER_LIFECYCLE_LOOKUP` / `diagnostic_snapshot` | Voucher, redemption, idempotency, recovery, anomalies | Payout/cashback/refund proof | Strongest existing Admin diagnostic pattern |
| RF entitlement preview observability | `GET /v1/rf/internal/entitlement/preview-observability` | `admin_diagnostic`, admin role, flag-gated | shadow/preview diagnostic | Aggregate preview observation | Entitlement or reward authority | Internal observability only |
| RF entitlement shadow observability | `GET /v1/rf/internal/entitlement/shadow-observability` | `admin_diagnostic`, admin role, flag-gated | shadow diagnostic | Drift/decision observation | Canonical entitlement | Shadow only, non-authoritative |
| RF durable diagnostics snapshot | `GET /v1/rf/internal/entitlement/durable-diagnostics/window/{windowId}/snapshot` | `admin_diagnostic`, admin role, disabled in production | durable diagnostic snapshot | Window-scoped aggregate investigation | Production proof/export | Non-production/internal only |
| API Gateway identity shadow aggregate | `GET /v1/_debug/identity-shadow/aggregate` | debug/internal, token-gated | debug diagnostic | Role extraction drift | Economy diagnostic or support proof | Out of economy diagnostics scope |
| API Gateway RF internal proxy/auth pattern | `apps/api-gateway/src/index.ts`, `/v1/rf/internal/*` protected route | Gateway user auth + downstream admin role | auth/visibility pattern | Admin access pattern for RF | Universal Admin proof layer | Pattern only |
| Rielt inquiries | `apps/rielt-service/src/routes/inquiry.ts`, `rielt_listing_inquiry` | user-scoped read/write | owner inquiry fact | Lookup keys for future diagnostics | Booking/payment proof | No admin diagnostic route today |
| Content event registrations | `apps/content-service/src/index.ts`, `event_registrations` | user write + Points producer | owner activity fact | Registration/Points correlation | Attendance/payment proof | DB-less fallback remains risk |
| Space activity projection | `apps/space-service/src/*`, `sourceRecordKey`, `sourceEventId` | social projection | social signal/projection | Navigation hint only | Reward/contribution proof | No economy diagnostic route |
| Reactions idempotency | `reaction_idempotency_keys` | runtime duplicate control | social signal support context | Lookup hint only | Reward proof | No economy diagnostic route |
| PWA Admin route guard | `apps/go2asia-pwa-shell/middleware.ts` | UI route guard pattern | auth pattern | Future UI protection baseline | Existing Admin UI | Admin UI route absent |

Inventory verdict:

```text
points_diagnostics_status: PARTIAL
quest_diagnostics_status: PARTIAL_READY_FOR_DELIVERY_INTENT
rf_diagnostics_status: STRONGEST_EXISTING_PATTERN
rielt_diagnostics_status: OWNER_FACTS_ONLY_NO_ADMIN_RUNTIME
content_diagnostics_status: OWNER_FACTS_ONLY_WITH_DB_LESS_RISK
space_reactions_diagnostics_status: SOCIAL_SIGNAL_ONLY_NO_ECONOMY_DIAGNOSTICS
api_gateway_admin_pattern_status: PARTIAL
pwa_admin_ui_status: MISSING
```

## 8. Support Lookup Workflow

Safe support workflow:

```text
support_request
-> collect user claim
-> reject screenshot/mock/projection as proof
-> extract lookup hints if available
-> resolve owner-service record
-> verify proof class
-> inspect freshness/asOf
-> inspect idempotency/replay context
-> produce internal diagnostic summary
-> do NOT produce customer receipt from diagnostic snapshot
```

Detailed workflow:

1. Intake claim:
   - record user claim, user ID, timestamps and any provided artifact;
   - classify screenshots, projections and mock/demo artifacts as hints only.

2. Extract lookup hints:
   - `transactionId`, `externalId`, `voucherId`, `outboxId`, `progressId`, `submissionId`, `registrationId`, `listingId`, `inquiryId`, `requestId`, `correlationId`, `idempotencyKey`.

3. Resolve owner service:
   - Points claims route to Points owner records;
   - Quest reward claims route to Quest outbox and then Points row;
   - RF claims route to RF voucher diagnostics and optional Points spend row;
   - Rielt claims route to Rielt listing/inquiry row;
   - Content claims route to `event_registrations` and optional Points row;
   - Space/Reactions claims route to social owner rows only.

4. Verify proof class:
   - `ECONOMIC_FACT` only at Points row;
   - `BADGE_AWARD_FACT` only at `user_badges` row;
   - `DELIVERY_INTENT_LOOKUP` not reward proof;
   - `VOUCHER_LIFECYCLE_LOOKUP` not payout proof;
   - `LISTING_INQUIRY_LOOKUP` not booking proof.

5. Inspect freshness and replay:
   - verify `asOf`;
   - treat stale/unknown diagnostic as navigation only;
   - compare idempotency keys and existing owner rows;
   - duplicate idempotent replay is not a new grant.

6. Produce internal summary:
   - cite owner service and owner row IDs;
   - include proof class;
   - include freshness state;
   - do not produce customer receipt from diagnostic snapshot.

Forbidden workflow:

```text
screenshot
-> support accepts screenshot as proof
-> close case
```

Allowed workflow:

```text
screenshot
-> support extracts possible hints
-> owner service lookup
-> owner fact determines outcome
```

## 9. Support Proof Chains

### Points

```text
projection row / user claim
-> transactionId or externalId
-> Points Service points_transactions row
-> economic_fact
```

Rules:

- Points ledger row is economic authority;
- Points balance projection is not receipt;
- producer rejection log explains failed attempt only;
- idempotency conflict requires owner row comparison.

### Badge

```text
badge projection / user claim
-> userBadgeId or badgeCode + userId + source keys
-> user_badges row
-> badge_award_fact
```

Rules:

- `user_badges` row is off-chain badge award fact;
- badge projection is not award;
- badge award is not NFT/token/asset.

### Quest Reward

```text
quest claim
-> quest_progress / quest_submission / quest_reward_outbox
-> delivery_intent
-> matching Points transaction if reward was applied
-> economic_fact
```

Rules:

- Quest outbox is delivery intent;
- `delivered` outbox is not customer receipt by itself;
- reward proof requires matching Points transaction.

### RF

```text
voucher claim
-> voucherId / redemptionId / correlationId / idempotencyKey
-> RF owner row
-> voucher_lifecycle_fact
-> optional Points spend transaction if applicable
```

Rules:

- RF diagnostics are lifecycle/support diagnostics;
- RF voucher is not payout, cashback, refund or payment;
- recovery marker is internal recovery trace, not customer payout promise.

### Rielt

```text
listing/inquiry claim
-> listingId / inquiryId / idempotencyKey
-> Rielt owner row
-> listing_inquiry_fact
```

Rules:

- inquiry is contact/request fact;
- inquiry is not booking, reservation or payment proof.

### Content/Pulse

```text
event registration claim
-> registrationId / eventId / userId
-> event_registrations row
-> content_registration_fact
-> optional Points transaction if producer applied
```

Rules:

- event registration is not attendance/payment proof;
- DB-less fallback cannot prove persisted registration;
- optional Points row proves Points transaction only.

### Space/Reactions

```text
social activity claim
-> postId / reactionId / sourceRecordKey
-> Space/Reactions owner row
-> social_signal
-> no reward proof
```

Rules:

- social signal is not contribution record;
- social signal is not reward proof;
- likes/bookmarks are not economic facts.

## 10. Admin Visibility / Security Rules

Admin diagnostics visibility rules:

- admin diagnostics are internal only;
- no customer-facing diagnostic URL;
- no public proof sharing;
- no screenshots as proof;
- no exportable accounting statement;
- no payout report;
- no booking/payment report;
- redact PII by default;
- role-based access required in future implementation;
- diagnostic access logging required in future implementation;
- support action must cite owner fact IDs, not projection IDs.

Security rules for future implementation:

| Rule | Requirement |
|---|---|
| Role access | Admin-only or service-to-service; fail closed |
| Visibility | `visibility = admin_diagnostic` |
| Boundary | `operatorBoundary = internal_navigation_only` |
| Proof status | `isAuthoritative = false`, `isCustomerProof = false` |
| PII | Redact by default; reveal minimally |
| Secrets | Mask or fingerprint idempotency/correlation values where possible |
| Access logs | Log operator ID, lookup subject, domain, timestamp |
| Mutating ops | Separate read diagnostics from replay/requeue/remediation |
| Exports | No customer PDF/export in Stage 11.6 |
| Public URLs | Forbidden |

Role/visibility evidence:

- RF internal diagnostics use Gateway auth plus downstream admin role checks;
- Quest internal outbox ops require service principal;
- Points internal diagnostics require service auth and flags;
- PWA middleware has `/admin(.*)` route guard, but no Admin UI route exists.

## 11. Domain-by-Domain Diagnostics

### Points

Allowed:

- inspect owner keys such as `transactionId`, `externalId`, `sourceService`, `sourceEventId`;
- interpret producer rejection reason;
- inspect idempotency conflict context;
- use spendability shadow diagnostics as internal observability.

Forbidden:

- shadow diagnostic as user balance proof;
- producer rejection as final support outcome without owner lookup;
- admin ledger replacement;
- accounting statement.

Stage 11.6 rule:

```text
Points diagnostic must point to points_transactions or user_balances
Diagnostic snapshot itself is not economic_fact
```

### Badge

Allowed:

- locate `user_badges` rows by user, badge and source keys;
- inspect source service/type/id;
- use badge diagnostics as owner lookup if implemented later.

Forbidden:

- badge diagnostic as NFT/token proof;
- badge projection/screenshot as award proof;
- contribution candidate as badge award.

Stage 11.6 rule:

```text
badge_award_fact = user_badges row
diagnostic_snapshot != badge_award
```

### Quest

Allowed:

- inspect reward outbox stats;
- list failed outbox rows;
- identify delivery intent and external IDs;
- requeue/replay only in existing internal ops context.

Forbidden:

- outbox as reward receipt;
- requeue as grant;
- Quest preview as economic fact.

Stage 11.6 rule:

```text
Quest outbox = delivery_intent
reward proof requires matching Points transaction
```

### RF

Allowed:

- inspect voucher lifecycle;
- inspect redemption rows, idempotency bindings, economy recovery, anomalies;
- use admin-only RF diagnostics as support navigation.

Forbidden:

- payout/cashback/refund report;
- merchant settlement statement;
- customer receipt;
- raw code leak.

Stage 11.6 rule:

```text
RF diagnostic = voucher lifecycle support view
RF diagnostic != payout_or_cashback_report
```

### Rielt

Allowed:

- locate listing and inquiry owner facts;
- inspect inquiry ID, listing ID, requester and idempotency key if a future internal diagnostic exists.

Forbidden:

- booking/payment proof;
- reservation confirmation;
- financial contract.

Stage 11.6 rule:

```text
Rielt inquiry = listing_inquiry_fact
Rielt diagnostic != booking_or_payment_proof
```

### Content/Pulse

Allowed:

- locate `event_registrations` row;
- correlate optional Points transaction by external ID.

Forbidden:

- attendance proof;
- payment proof;
- event badge as user badge award.

Stage 11.6 rule:

```text
content_registration_fact != attendance_proof
db_less_fallback = diagnostic risk
```

### Space/Reactions

Allowed:

- use post/reaction/source keys as navigation hints;
- diagnose social signal existence only if separately implemented later.

Forbidden:

- reward proof;
- contribution proof;
- social score;
- reaction farming support claim.

Stage 11.6 rule:

```text
social_signal != economic_fact
social_signal != contribution_record
social_signal != reward_proof
```

### Referral/Auth

Allowed:

- locate referral relations and referral code owner state;
- correlate Points row if a valid Points producer applied.

Forbidden:

- commission or payout statement;
- network-accrual proof;
- referral dashboard as accounting report.

Stage 11.6 rule:

```text
referral_relation != payout_or_commission
Points row required for Points proof
```

## 12. Freshness / Staleness / Replay Doctrine

Freshness rules:

- diagnostic `asOf` must refer to latest owner fact timestamp represented;
- `diagnosticGeneratedAt` must refer to snapshot generation time;
- stale diagnostic may guide lookup but cannot close support proof chain;
- unknown freshness cannot be proof;
- support must re-query owner service for disputes.

Replay/idempotency rules:

- duplicate idempotent replay is not a new reward;
- `externalId` duplicate with same payload can be successful no-op;
- `externalId` conflict can indicate caller bug or fraud attempt, but must be compared with owner row;
- producer rejection explains blocked attempt, not global user eligibility;
- outbox replay/requeue is delivery operation, not customer receipt;
- projection refresh does not create owner fact.

Doctrine:

```text
stale_diagnostic != proof
unknown_freshness != proof
diagnostic_replay_context != reward_grant
producer_rejection != support_resolution
idempotency_conflict != automatic_fraud_verdict
```

## 13. Mock / Screenshot / Projection Evidence Rules

Evidence rules:

```text
screenshot != support proof
projection != support proof
mock_data != diagnostic truth
demo_data != support proof
admin_snapshot != customer proof
share_card != proof
static_home_stats != proof
```

Artifact handling:

| Artifact | Diagnostic use | Forbidden use |
|---|---|---|
| Screenshot | Navigation hint only | Proof |
| Connect/Profile projection | Extract owner lookup hints | Receipt/ledger |
| ActivityFeed row | Lookup hint | Audit trail |
| Wallet summary | Lookup hint | Financial statement |
| Mock/demo row | Quarantine only | Diagnostic truth |
| Share card | Non-proof social artifact | Support proof |
| Admin snapshot | Internal navigation summary | Customer receipt |
| Token-service readiness | None for Path A | Token/NFT proof |

Support rule:

```text
support_may_receive_screenshot: true
support_may_extract_lookup_hints: true
support_may_accept_screenshot_as_proof: false
support_must_resolve_owner_service_record: true
```

## 14. Runtime / Schema / UI Decision

Stage 11.6 runtime/schema/UI decision:

```text
admin_diagnostics_contract_status: DEFINED_NOT_IMPLEMENTED
admin_runtime_status: DEFER
admin_schema_status: PROPOSAL_ONLY
admin_ui_status: DEFER
admin_service_status: DEFER
diagnostic_routes_created: false
cutline_enforcement_status: DEFER_TO_11_7
smoke_proof_status: DEFER_TO_11_8
```

Implementation-readiness notes:

| Need | Stage 11.6 action | Future status |
|---|---|---|
| Unified Admin Economy Diagnostics contract | Define in docs | Ready after acceptance |
| Unified Admin service/facade | Do not create | `DEFER / REQUIRES_SEPARATE_SLICE_APPROVAL` |
| PWA Admin UI | Do not create | `DEFER` |
| Points admin lookup by `transactionId`/`externalId` | Document gap | Future bounded runtime slice |
| RF diagnostic envelope standardization | Document gap | Future runtime/API slice |
| Quest diagnostic envelope standardization | Document gap | Future runtime/API slice |
| Content/Rielt admin lookups | Document gap | Future runtime/API slice |
| Space/Reactions diagnostics | Social only, not economy | `FUTURE_ONLY` |
| Cutline/mock enforcement | Do not wire | Stage 11.7 |
| Smoke proof | Do not create | Stage 11.8 |
| Path B token/NFT/gateway | Do not touch | `FORBIDDEN_FOR_STAGE_11` |

Implementation-readiness verdict:

```text
rf_diagnostic_runtime_readiness: PARTIAL_READY_PATTERN
quest_outbox_diagnostic_runtime_readiness: PARTIAL_READY_PATTERN
points_admin_lookup_runtime_readiness: MISSING
content_registration_diagnostic_readiness: MISSING_WITH_DB_LESS_RISK
rielt_inquiry_diagnostic_readiness: MISSING
space_reactions_diagnostic_readiness: OUT_OF_ECONOMY_SCOPE
unified_admin_ui_readiness: MISSING
```

## 15. Stage 11 Slice Handoff

Stage 11.6 handoff to Stage 11.7:

- Stage 11.7 may define cutline enforcement and flags after this diagnostics contract is accepted;
- mock/demo/screenshot/projection evidence blocking can be enforced later;
- `economy.admin_diagnostics.*` runtime flags are not wired in Stage 11.6;
- future flags must fail closed and preserve internal-only visibility.

Stage 11.6 handoff to Stage 11.8:

- smoke proof must use owner facts and owner IDs;
- smoke proof must not use diagnostic snapshots as proof;
- smoke proof must not expose Admin diagnostics as public receipt;
- unresolved gaps, especially Points admin lookup and Content DB-less registration risk, must be addressed or explicitly excluded before smoke proof.

Stage 11.6 handoff to Stage 12 / UI alignment:

- Admin UI, if ever created, must follow this internal-only contract;
- UI/copy cleanup remains out of Stage 11.6;
- screenshots and share cards remain non-proof;
- Profile/Connect projection UI remains governed by Stage 11.5.

Explicit stop lines:

```text
do_not_start_11_7_in_11_6
do_not_start_11_8_in_11_6
do_not_start_stage_12_ui_alignment_in_11_6
do_not_start_path_b_in_11_6
do_not_create_runtime_implementation_in_11_6
```

## 16. Risk Register

| ID | Risk | Severity | Stage 11.6 mitigation |
|---|---|---|---|
| R-116-01 | Admin dashboard becomes receipt | CRITICAL | `Admin dashboard != receipt` doctrine |
| R-116-02 | Diagnostic snapshot becomes ledger | CRITICAL | `Diagnostic snapshot != economic_fact`; owner row terminus |
| R-116-03 | Admin diagnostics become accounting statement | CRITICAL | Accounting/dashboard/export forbidden |
| R-116-04 | RF diagnostics become payout/cashback report | CRITICAL | RF lifecycle only |
| R-116-05 | Rielt diagnostics become booking/payment proof | CRITICAL | Inquiry/listing only |
| R-116-06 | Badge diagnostics become NFT/token proof | CRITICAL | Badge award is off-chain `user_badges` only |
| R-116-07 | Quest outbox becomes reward receipt | HIGH | Outbox is delivery intent; Points row required |
| R-116-08 | Screenshot accepted as support proof | CRITICAL | Screenshot hint only |
| R-116-09 | Projection accepted as support proof | CRITICAL | Projection hint only; owner lookup required |
| R-116-10 | Mock/demo accepted as diagnostic truth | CRITICAL | Mock/demo quarantine |
| R-116-11 | Stale diagnostic closes support case | HIGH | Freshness/staleness doctrine |
| R-116-12 | Producer rejection misused as final case outcome | HIGH | Rejection explains attempt only |
| R-116-13 | Idempotency conflict misused as fraud verdict | HIGH | Compare owner rows; no automatic verdict |
| R-116-14 | PII leakage in diagnostics | HIGH | Redact/mask by default |
| R-116-15 | Role/visibility leakage | HIGH | Admin-only/service-only, fail closed |
| R-116-16 | Diagnostic export becomes customer proof | HIGH | No customer export |
| R-116-17 | Manual reward grant from diagnostics | CRITICAL | Forbidden without separate governance/runtime slice |
| R-116-18 | Path B inferred from diagnostics/token-service readiness | CRITICAL | Path B forbidden for Stage 11 |

## 17. Review Gates

Stage 11.6 can be accepted only if these gates pass:

| Gate | Required result |
|---|---|
| Boundary gate | Admin diagnostics is internal support/navigation only |
| Proof gate | Diagnostic snapshot is not authority, customer proof, receipt or ledger |
| Economy gate | No accounting, payout, cashback, booking, payment, token or NFT semantics |
| Support gate | Proof chains terminate at owner-service records |
| Visibility gate | Admin diagnostics internal-only; no customer URL/export |
| Security gate | Role access, access logging and PII redaction requirements defined for future implementation |
| Freshness gate | `asOf`, `diagnosticGeneratedAt`, stale/unknown rules defined |
| Replay gate | Idempotency/replay/producer rejection misuse blocked |
| Mock gate | Screenshot/projection/mock/demo evidence rules frozen |
| Inventory gate | Existing diagnostics inventory completed |
| Slice gate | 11.7/11.8/Stage 12/Path B/runtime implementation not started |
| Runtime gate | No production service/schema/API/SDK/UI changes |

## 18. Acceptance Criteria

Stage 11.6 is successful if:

- Admin diagnostics boundary is clearly defined;
- diagnostic snapshot contract is defined;
- diagnostic classes are defined;
- existing diagnostics inventory is completed;
- support workflow is defined;
- support proof chains are defined;
- admin visibility/security rules are defined;
- `diagnostic != proof` doctrine is frozen;
- `Admin dashboard != receipt` doctrine is frozen;
- screenshot/projection/mock evidence rules are frozen;
- no runtime/schema/API/SDK/UI changes are made;
- no Path B leakage occurs;
- no Stage 11.7/11.8 work is started;
- next slice recommendation is included.

Acceptance status:

```text
admin_diagnostics_boundary_defined: true
diagnostic_snapshot_contract_defined: true
diagnostic_classes_defined: true
existing_diagnostics_inventory_completed: true
support_workflow_defined: true
support_proof_chains_defined: true
admin_visibility_security_rules_defined: true
diagnostic_not_proof_doctrine_frozen: true
admin_dashboard_not_receipt_doctrine_frozen: true
screenshot_projection_mock_rules_frozen: true
runtime_changes_made: false
schema_changes_made: false
api_sdk_changes_made: false
ui_changes_made: false
path_b_leakage: false
stage_11_7_started: false
stage_11_8_started: false
```

## 19. Final Verdict

Stage 11.6 defines Admin Economy Diagnostics as an internal support/navigation contract over owner facts.

Final verdict:

```text
stage_11_6_status: READY_as_docs_first_diagnostics_contract
admin_diagnostics_contract_status: DEFINED_NOT_IMPLEMENTED
diagnostic_snapshot_contract_status: PROPOSAL_ONLY
existing_diagnostics_status: PARTIAL
unified_admin_diagnostics_runtime_status: DEFER
admin_ui_status: DEFER
admin_service_status: DEFER
runtime_implementation_status: false
schema_migration_status: false
openapi_sdk_status: false
ui_change_status: false
path_a_status: PRESERVED
path_b_status: FORBIDDEN_FOR_STAGE_11
next_recommended_slice: Stage 11.7 — MVP Cutline Enforcement Flags
```

Stage 11.6 succeeds if Admin diagnostics remains an internal owner-fact lookup assistant and never becomes authority, receipt, ledger, accounting dashboard, payout/cashback report, booking/payment proof, NFT/token proof or customer-facing support proof.

The correct next slice is:

```text
Stage 11.7 — MVP Cutline Enforcement Flags
```

Stage 11.7 may begin only after this 11.6 diagnostics contract is accepted. It must enforce cutline/flags without converting diagnostics or projections into proof and without starting smoke proof.
