# Stage 11.2 — Points Ledger Minimal Runtime + Producer Allowlist

Документ: `stage_11_2_points_ledger_minimal_runtime_and_producer_allowlist_v1.md`  
Статус: minimal bounded runtime implementation  
Дата: 2026-05-22  
Scope: Stage 11.2 of Path A — Points Service producer allowlist enforcement  
Mode: runtime implementation in Points Service only; no schema/API/generated/UI/token-service/Path B changes

## 0. Orchestration Summary

Task type: bounded runtime enforcement slice after Stage 11.0/11.1 docs-first guardrails.

Runtime risk: HIGH because Points ledger writes are economic facts and existing `PointsAction` vocabulary had been treated as active runtime allowlist.

Producer risk: HIGH before this slice because `ACTIONS_PHASE2` accepted future-only and forbidden producer names on `/internal/points/add`.

Replay risk: MEDIUM. `externalId` idempotency remains the ledger SSOT and existing conflict handling is preserved. Source-event alignment across callers remains a later hardening area.

Projection risk: MEDIUM. Read projections still display historical ledger rows and are not changed in this slice. Projection framing remains Stage 11.5.

Affected runtime boundaries:

- `apps/points-service/src/index.ts`
- `apps/points-service/src/producerAllowlist.ts`
- `apps/points-service/wrangler.toml`
- `apps/points-service/test/*`

Multi-agent review passes applied:

| Pass | Role | Result |
|---|---|---|
| Orchestrator | AI Program Director / Orchestrator | Stage 11.2 is enforcement-only runtime slice |
| Runtime Governance | Runtime Governance Architect | Points Service remains sole economic authority |
| Economy | Economy Architect | Producer classes follow Stage 11.0 allowlist |
| Security / Fraud | Security / Fraud & Abuse Specialist | Unknown/future/forbidden producers now fail closed |
| Architecture | Software Architect | No central activity ledger or event bus introduced |
| Slice Strategist | Slice Strategist | No transition into 11.3/11.5/11.7/11.8 |
| Canon Writer | Technical Canon Writer | Runtime doctrine and deferrals documented |

Minimal safe implementation strategy:

```text
producer_enum_vocabulary != producer_activation
Points Service ingress = producer enforcement boundary
unknown_producer = reject
internal_beta_producer = require explicit producer flag
future_only_producer = reject
forbidden_producer = reject
externalId = idempotency SSOT
```

## 1. Executive Summary

Stage 11.2 implements the first bounded runtime enforcement around the existing Points ledger.

The core change is a producer allowlist gate at Points Service internal write ingress. The gate splits generated/OpenAPI vocabulary from runtime activation and applies Stage 11.0 producer classes before any ledger lookup or mutation.

Implemented:

- `ACTIVE` producers can write only from approved service callers.
- `INTERNAL_BETA` producers require explicit Points Service env flags and approved service callers.
- `FUTURE_ONLY`, `FORBIDDEN_FOR_STAGE_11`, unknown and mock-like producers are rejected before DB access.
- Existing `externalId` idempotency and RF spend double-spend protection remain unchanged.
- Bounded diagnostics are emitted through internal logs only.

Not implemented:

- no `activity_events` table or runtime activity bus;
- no contribution model;
- no projection contract;
- no admin proof surface;
- no OpenAPI/SDK/generated changes;
- no schema or migration;
- no Path B/token/NFT/wallet/payment/payout work.

Final runtime doctrine:

```text
Points ledger = only economic authority
activity_event != economic_fact
activity_event != reward_grant
projection != authority
mock_data != runtime_truth
Dashboard != receipt
Wallet != financial_wallet
ActivityFeed != audit_trail
Badge != NFT
Rielt inquiry != booking/payment
RF voucher != cashback/payout
```

## 2. Runtime Scope

Stage 11.2 changes only the Points Service write boundary.

In scope:

- `/internal/points/add`
- `/internal/points/spend`
- producer classification and gate evaluation;
- internal-beta producer flags in Points Service config;
- bounded metadata validation;
- tests proving fail-closed producer behavior.

Out of scope:

- frontend UI;
- Connect/Profile/Admin projections;
- generated SDK/types;
- OpenAPI contracts;
- DB schema and migrations;
- owner-service refactors;
- activity-event persistence;
- contribution records;
- Path B services.

## 3. Producer Allowlist Enforcement

Stage 11.2 introduces `stage_11_2_producer_allowlist_v1` in `apps/points-service/src/producerAllowlist.ts`.

Runtime producer classes:

| Producer | Class | Runtime rule |
|---|---|---|
| `registration` | `ACTIVE` | Allowed on add from `auth-service` |
| `referral_locked` | `ACTIVE` | Allowed on add from `referral-service` |
| `first_login` | `INTERNAL_BETA` | Allowed on add from `auth-service` only when flag enabled |
| `quest_completed` | `INTERNAL_BETA` | Allowed on add from `quest-service` only when flag enabled |
| `event_registration` | `INTERNAL_BETA` | Allowed on add from `content-service` only when flag enabled |
| `rf_voucher_claim_spend` | `INTERNAL_BETA` | Allowed on spend from `rf-service` only when flag enabled |
| `rf_voucher_claim_spend_compensation` | `INTERNAL_BETA` | Allowed on add from `rf-service` only when flag enabled |
| `space_post_created` | `FUTURE_ONLY` | Rejected |
| `space_repost_created` | `FUTURE_ONLY` | Rejected |
| `space_reaction_created` | `FUTURE_ONLY` | Rejected |
| `rielt_listing_created` | `FUTURE_ONLY` | Rejected |
| `rf_partner_verified` | `FUTURE_ONLY` | Rejected |
| `rf_voucher_claimed` | `FUTURE_ONLY` | Rejected |
| `rf_voucher_redeemed` | `FUTURE_ONLY` | Rejected |
| `network_accrual_level_1` | `FORBIDDEN_FOR_STAGE_11` | Rejected |
| `network_accrual_level_2` | `FORBIDDEN_FOR_STAGE_11` | Rejected |
| `referral_bonus_referee` | `FORBIDDEN_FOR_STAGE_11` | Rejected |
| `referral_bonus_referrer` | `FORBIDDEN_FOR_STAGE_11` | Rejected |
| `referral_unlock` | `FORBIDDEN_FOR_STAGE_11` | Rejected |

Unknown producer behavior:

```text
unknown producer => reject
unclassified producer => reject
future_only producer => reject
forbidden producer => reject
missing flag => fail closed
projection source => reject by caller/action matrix
mock source => reject by caller/action matrix
```

## 4. Runtime Guardrails

Runtime guardrails now applied before DB mutation:

- action must be a non-empty string;
- action must be classified;
- action must match the requested operation (`add` or `spend`);
- `sourceService` must come from the service JWT `sub`;
- `sourceService` must be approved for the requested action;
- internal-beta producer flag must be present and enabled;
- `externalId` must be present;
- `sourceEventId`, when supplied, must be a non-empty string;
- `metadata`, when supplied, must be object-shaped and bounded;
- duplicate/replay handling remains under `externalId`.

Rejected producer error codes:

- `UNKNOWN_POINTS_PRODUCER`
- `PRODUCER_FUTURE_ONLY`
- `PRODUCER_FORBIDDEN_FOR_STAGE_11`
- `PRODUCER_INTERNAL_BETA_DISABLED`
- `PRODUCER_SOURCE_SERVICE_NOT_ALLOWED`
- `PRODUCER_OPERATION_NOT_ALLOWED`

## 5. Points Authority Preservation

Points Service remains the sole economic authority.

Authority rules:

```text
economic_fact = points_transactions row
idempotency_authority = points_transactions.external_id
balance_state = user_balances
quest_reward_outbox = delivery_intent
content event registration = activity_fact
RF voucher lifecycle = utility lifecycle
dashboard/wallet/activity feed = projection
```

No other service can create economic facts except by calling Points Service with an allowlisted producer and passing the Points ingress gate.

The `activity_event` contract from Stage 11.1 is not used as runtime authority in this slice.

## 6. Idempotency / Replay Handling

Existing idempotency remains unchanged:

- `externalId` is required for add and spend;
- duplicate same-payload replay returns `applied: false`;
- duplicate mismatched payload returns conflict;
- concurrent `ON CONFLICT (external_id) DO NOTHING` handling remains in place;
- RF spend uses atomic insert and balance decrement.

Stage 11.2 adds producer gate checks before idempotency lookup. This intentionally prevents forbidden or future-only producers from probing existing `externalId` state.

Known bounded risk:

```text
sourceEventId_required_for_all_callers: PARTIAL
reason: enforcing mandatory sourceEventId for every existing caller requires owner-service payload updates
status: DEFER / REQUIRES_SEPARATE_SLICE_APPROVAL
current_runtime: sourceEventId is validated when present and stored in Points rows
```

## 7. Forbidden Producer Rejection

The following are rejected at Points Service ingress:

- `network_accrual_level_1`
- `network_accrual_level_2`
- `referral_bonus_referee`
- `referral_bonus_referrer`
- `referral_unlock`
- token/NFT/on-chain rewards
- payout/cashback/payment/commission producers
- booking/payment producers
- creator economy producers
- social metric rewards
- mock/demo producers

No forbidden producer can reach ledger mutation through `/internal/points/add` or `/internal/points/spend`.

## 8. Projection / Mock Rejection Rules

Stage 11.2 does not alter projection surfaces, but runtime writes now reject projection/mock sources through the caller/action matrix.

Rules:

- projection surfaces are read-only consumers;
- dashboard rows are not receipts;
- wallet views are not financial wallets;
- activity feed rows are not audit trails;
- mock/demo source services are not approved service callers;
- Space/Reactions social activity remains non-economic;
- Rielt inquiry/listing remains discovery and contact intent, not booking/payment;
- RF claim/redeem lifecycle remains future-only for Points production.

Projection contract work remains Stage 11.5.

## 9. Runtime Diagnostics

Only bounded diagnostics are introduced:

- rejected producer reason;
- producer classification;
- source service;
- required flag name when an internal-beta producer is disabled;
- allowlist version;
- existing idempotency conflict logs;
- existing spendability shadow diagnostics.

Forbidden diagnostics remain out of scope:

- customer-facing accounting;
- payout reporting;
- financial reporting;
- audit trail claims;
- fake runtime analytics.

## 10. Existing Runtime Areas Modified

Modified runtime areas:

- `apps/points-service/src/index.ts`
  - replaced enum-as-allowlist checks with Stage 11.2 producer gate;
  - added bounded metadata validation for Points add/spend;
  - added internal rejection logging;
  - preserved `externalId` idempotency and ledger SQL.
- `apps/points-service/src/producerAllowlist.ts`
  - new runtime producer classification and gate.
- `apps/points-service/wrangler.toml`
  - added staging internal-beta producer flags using existing env flag mechanism.
- `apps/points-service/test/*`
  - added allowlist unit tests and request tests;
  - pinned staging producer flags in config tests.

Not modified:

- DB schema;
- migrations;
- OpenAPI;
- generated SDK/types;
- frontend UI;
- Connect/Profile/Admin surfaces;
- token-service;
- Quest/RF/Content/Referral service runtime code.

## 11. Security / Fraud Review

Security improvements:

- producer spoofing is reduced by binding action to service JWT `sub`;
- mock/demo/projection service callers cannot write approved producers;
- future-only producers cannot create phantom rewards;
- forbidden referral/network producers cannot be revived through enum vocabulary;
- internal-beta producers fail closed when flags are missing;
- forbidden producers are rejected before DB lookup.

Preserved controls:

- service JWT authentication;
- gateway-origin read protection;
- `externalId` replay protection;
- RF spend atomic balance decrement;
- RF spend idempotent replay behavior;
- spendability shadow diagnostics remain non-authoritative.

Residual risks:

- full source-event mandatory alignment requires owner-service payload updates;
- one-time producer race hardening may require DB-level uniqueness or a local atomic pattern;
- read projections can still display historical forbidden reasons if legacy rows exist;
- full projection proof/freshness framing belongs to Stage 11.5.

## 12. Slice Boundary Verification

Stage 11.2 did not cross into Stage 11.3:

- no contribution record;
- no social/content rewards;
- no likes/views/saves reward semantics.

Stage 11.2 did not cross into Stage 11.5:

- no projection contract;
- no Connect/Profile/Admin UI changes;
- no proof/freshness projection schema.

Stage 11.2 did not cross into Stage 11.7:

- no global cutline framework;
- only Points Service producer flags were used.

Stage 11.2 did not cross into Stage 11.8:

- no smoke proof route;
- no public proof chain;
- no demo-as-proof flow.

Path B remains forbidden:

```text
token-service: not touched
G2A token: not activated
NFT/on-chain/bridge/wallet: not activated
payout/cashback/payment/settlement: not introduced
booking/payment semantics: not introduced
Slice 16: BLOCKED
```

## 13. Risk Register

| Risk | Status after 11.2 | Mitigation |
|---|---|---|
| enum -> active producer collapse | Mitigated | Runtime classification gate replaces `ACTIONS_PHASE2` write allowlist |
| mock -> runtime truth collapse | Mitigated at Points ingress | Unknown/mock services and producers rejected |
| projection -> authority collapse | Not expanded | Projection runtime untouched; Stage 11.5 owns framing |
| activity_event -> reward_grant collapse | Not introduced | No `activity_event` runtime/persistence |
| Path B leakage | Blocked | Token/NFT/on-chain/wallet/payment semantics untouched |
| replay/duplicate reward | Preserved controls | `externalId` SSOT unchanged |
| sourceEventId incomplete caller coverage | Residual | DEFER / REQUIRES_SEPARATE_SLICE_APPROVAL |
| one-time action race | Residual | Future DB/local atomic hardening if approved |

## 14. Review Gates

Runtime Governance gate:

```text
Points Service remains only economic authority: PASS
activity_event not used as runtime authority: PASS
projection not used as proof: PASS
allowlist enforcement bounded to Points Service: PASS
hidden producer expansion blocked: PASS
```

Economy gate:

```text
ACTIVE producers enforced: PASS
INTERNAL_BETA producers flag-gated: PASS
FUTURE_ONLY producers rejected: PASS
FORBIDDEN_FOR_STAGE_11 producers rejected: PASS
RF spend remains utility debit: PASS
referral_bonus/network semantics blocked: PASS
```

Security/Fraud gate:

```text
producer spoofing reduced: PASS
mock producer activation blocked: PASS
double-spend control preserved: PASS
idempotency conflict handling preserved: PASS
bounded diagnostics only: PASS
```

Architecture gate:

```text
owner-service truth preserved: PASS
no central activity ledger: PASS
minimal implementation footprint: PASS
no broad refactor: PASS
Stage 11.1 doctrine compatible: PASS
```

## 15. Acceptance Criteria

Stage 11.2 acceptance status:

- Points Service remains the only economic authority: PASS
- producer allowlist is enforced: PASS
- unknown/future/forbidden producers reject: PASS
- internal-beta producer flags fail closed when missing: PASS
- replay/idempotency handling remains bounded: PASS
- no projection becomes authority: PASS
- no mock/demo source accepted as producer: PASS
- no Path B semantics leaked: PASS
- no new producer economy introduced: PASS
- no UI authority introduced: PASS
- no event-sourcing architecture introduced: PASS
- runtime footprint minimal: PASS
- diagnostics bounded and internal: PASS
- Stage 11.3 boundaries not crossed: PASS

Validation performed:

```text
pnpm --filter @go2asia/points-service test:ci
result: PASS
tests: 64 passed
```

## 16. Final Verdict

```text
stage_11_2_status: READY_as_points_service_producer_enforcement
producer_allowlist_enforcement_status: IMPLEMENTED_IN_POINTS_SERVICE
runtime_implementation_scope: points_service_only
producer_activation_scope: allowlist_gated_not_broadened
feature_flag_scope: economy.producer.* equivalent env flags in points_service_only
points_ledger_authority_status: UNCHANGED_POINTS_SERVICE_REMAINS_SSOT
schema_changes: false
api_openapi_changes: false
generated_sdk_type_changes: false
ui_changes: false
other_service_runtime_changes: false
activity_event_persistence_status: DEFER
contribution_record_status: DEFER_TO_11_3
projection_contract_status: DEFER_TO_11_5
admin_diagnostics_status: DEFER_TO_11_6
cutline_enforcement_status: PARTIAL_producer_flags_only_full_cutline_in_11_7
smoke_proof_status: DEFER_TO_11_8
path_b_status: FORBIDDEN_FOR_STAGE_11
slice_16_status: BLOCKED
can_stage_11_3_start: yes_after_manual_approval_of_11_2
```

Recommended next slice:

```text
Stage 11.3 — Contribution Record Boundary / Candidate Model
```
