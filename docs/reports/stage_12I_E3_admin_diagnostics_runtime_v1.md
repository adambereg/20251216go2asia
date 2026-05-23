# Stage 12I-E3 — Admin Diagnostics Runtime Report

Документ: `stage_12I_E3_admin_diagnostics_runtime_v1.md`  
Статус: implementation report / bounded internal admin diagnostics runtime foundation  
Дата: 2026-05-23  
Scope: internal Points admin/support diagnostic snapshot over E1 projection metadata and E2 support lookup navigation  
Mode: bounded internal diagnostics runtime slice

## 1. Stage 12I-E3 Verdict

Stage 12I-E3 introduces a bounded internal/admin-only diagnostics runtime foundation for Points projection/support lookup flows.

The slice lets internal admin/support tooling request a diagnostic snapshot from a bounded E2 `supportLookupKey`, receive owner fact pointers, and navigate toward Points owner facts without creating customer proof output, support outcome workflow, accounting authority, Path B runtime or customer-facing diagnostics UI.

Required statement:

```text
Stage 12I-E3 completed as bounded internal admin diagnostics runtime foundation, not customer-facing proof system, support resolution workflow, accounting ledger, immutable audit ledger, payout/cashback/token/NFT runtime, Path B activation or public launch approval.
```

Final verdict:

```text
stage_12I_E3_status: COMPLETE_AS_ADMIN_DIAGNOSTICS_RUNTIME_FOUNDATION
task_type: internal_admin_diagnostics_runtime_foundation
risk_level: HIGH
bounded_internal_diagnostics_runtime_introduced: true
diagnostic_snapshot_can_help_navigate_to_owner_fact_pointers: true
strict_service_authz_enforced: true
owner_facts_remain_authoritative: true
additive_api_openapi_changes: true
generated_types_updated: true
customer_facing_diagnostics_ui_added: false
support_resolution_workflow_added: false
accounting_engine_introduced: false
proof_termination_engine_introduced: false
path_b_activation: false
fake_certainty_fields: false
public_launch_ready: false
```

## 2. Capsules Used

| Capsule | Role |
|---|---|
| `docs/ai/context/core/capsule.md` | owner fact, projection, Path A / Path B firewall and no-public-launch doctrine |
| `docs/ai/context/ui/capsule.md` | projection/diagnostic navigation vs proof termination boundary |
| `docs/ai/context/security/capsule.md` | support-proof, screenshot-as-proof, stale diagnostic and unauthorized read boundaries |
| `docs/ai/context/stage_12_product_reality/capsule.md` | Stage 12 product-reality sequencing after E1/E2 |
| `docs/ai/context/routing_rules.md` | bounded context composition and anti-overload rules |

Upstream SSOT read:

- `docs/architecture/domain/stage_11_5_profile_connect_admin_projection_contract_v1.md`
- `docs/architecture/domain/stage_11_6_admin_economy_diagnostics_v1.md`
- `docs/architecture/domain/stage_12_x_4_projection_metadata_proof_class_ui_requirements_v1.md`
- `docs/architecture/domain/stage_12_closure_review_v1.md`
- `docs/reports/stage_12I_E1_api_projection_envelope_v1.md`
- `docs/reports/stage_12I_E2_support_lookup_layer_v1.md`

## 3. Agents Used

| Agent | Role in E3 |
|---|---|
| AI Program Director / Orchestrator | task classification, exact boundary, review gates and final synthesis |
| Backend Developer | Points Service endpoint placement, resolver reuse and DTO shape |
| Runtime Governance Architect | diagnostic snapshot != customer proof, owner fact authority and E3 stop lines |
| Security / Fraud & Abuse Reviewer | service/admin authz, unauthorized read prevention and bounded response review |
| QA Agent | diagnostics tests, negative access tests and forbidden-term grep |
| Frontend Developer | no customer frontend/admin UI changes and customer route exposure check |
| Technical Canon Writer | report structure, canon wording and residual gap register |
| Slice Strategist | narrow implementation boundary and next-slice sequencing |

## 4. Orchestrator Classification

| Field | E3 decision |
|---|---|
| Task type | internal admin diagnostics runtime foundation |
| Risk level | `HIGH` |
| Execution mode | bounded internal runtime implementation |
| Primary domain | Points Service internal admin/support diagnostics |
| Review gates | Backend, Runtime Governance, Security/Fraud, QA, Frontend, Canon, Slice Strategy |
| Exact boundary | internal diagnostics endpoint + diagnostic snapshot DTO + owner fact pointers + service-auth allowlist + OpenAPI/generated types + tests + report |

Allowed and performed:

- internal/admin-only diagnostics endpoint;
- diagnostic snapshot DTO;
- owner fact pointer aggregation from E2 lookup results;
- lookup-based diagnostic resolver;
- strict service-auth and caller allowlist guard;
- internal visibility and operator-boundary metadata;
- additive OpenAPI schemas and generated SDK/types sync;
- backend tests and grep/security guardrails;
- report.

Forbidden and not performed:

- customer-facing diagnostics UI;
- customer-facing proof URLs;
- support case closure workflow;
- proof termination;
- accounting ledger activation;
- immutable audit ledger;
- payout/cashback/token/NFT runtime;
- Path B activation;
- public launch/support-proof claims;
- broad admin panel implementation;
- broad API rewrite;
- breaking API migration.

## 5. Audit Scope

Targeted audit covered:

- `apps/points-service/src/index.ts`;
- `apps/points-service/src/projectionMetadata.ts`;
- E2 support lookup key parsing and owner reference resolver;
- existing Points service-auth and internal endpoint patterns;
- Points request tests in `apps/points-service/test/request.test.ts`;
- `docs/openapi/points.yaml`;
- generated SDK/types output from the OpenAPI pipeline;
- customer frontend scan only to confirm no E3 exposure.

Explicitly out of scope:

- full Admin UI or admin panel implementation;
- customer frontend diagnostics;
- support ticket/case workflow;
- accounting ledger or write-path changes;
- RF/Quest/Rielt/Space cross-domain diagnostics;
- Path B, token, NFT, bridge or on-chain surfaces;
- broad backend/API rewrite.

## 6. Diagnostic Model

E3 model:

```text
supportLookupKey
-> E2 bounded lookup resolver
-> AdminDiagnosticSnapshot
-> ownerFactPointers
-> owner service remains authoritative
```

Implemented concepts:

| Concept | E3 value |
|---|---|
| `diagnosticKind` | `POINTS_OWNER_FACT_LOOKUP`, `POINTS_PROJECTION_TRACE`, `SUPPORT_LOOKUP_DIAGNOSTIC` |
| `diagnosticVisibility` | `ADMIN_DIAGNOSTIC` |
| `operatorBoundary` | `INTERNAL_NAVIGATION_ONLY` |
| `lookupStatus` | inherited from E2: `LOOKUP_AVAILABLE`, `LOOKUP_LIMITED`, `LOOKUP_UNAVAILABLE` |
| `ownerFactPointers[].pointerType` | `OWNER_FACT_POINTER` |
| `isCustomerProof` | always `false` |
| `canTerminateProof` | always `false` |

Snapshot shape:

```text
AdminDiagnosticSnapshot {
  diagnosticId
  diagnosticKind
  diagnosticVisibility
  generatedAt
  lookupInput
  lookupStatus
  ownerFactPointers[]
  notes[]
  operatorBoundary
  isCustomerProof = false
  canTerminateProof = false
}
```

Semantics:

- `LOOKUP_AVAILABLE` can include a bounded owner pointer.
- `LOOKUP_LIMITED` can point to an owner fact family; row-level resolution remains outside E3.
- `LOOKUP_UNAVAILABLE` does not prove absence.
- The snapshot is internal navigation context only.

## 7. DTO / API / OpenAPI Changes

Runtime/API:

- Added `POST /internal/points/admin-diagnostics`.
- Added `ADMIN_DIAGNOSTICS_ALLOWED_SERVICES`.
- Added `parseAdminDiagnosticKind`.
- Added `createAdminDiagnosticSnapshot`.
- Reused E2 `parseSupportLookupKey` and `lookupSupportOwnerFact`.
- Returned bounded `ownerFactPointers` only, not raw transaction rows.

OpenAPI:

- Added `POST /internal/points/admin-diagnostics`.
- Added `AdminDiagnosticRequest`.
- Added `AdminDiagnosticSnapshot`.
- Added `DiagnosticKind`.
- Added `DiagnosticVisibility`.
- Added `AdminDiagnosticOperatorBoundary`.
- Added `AdminDiagnosticLookupInput`.
- Added `OwnerFactPointer`.

Generated artifacts:

- Updated `docs/openapi/openapi.bundle.yaml`.
- Updated generated SDK/types indexes.
- Added generated admin diagnostic DTOs in `packages/sdk/src/generated/*`.
- Added generated admin diagnostic DTOs in `packages/types/src/generated/*`.
- Updated generated platform API files:
  - `sdk/go2AsiaPlatformAPI.ts`
  - `types/go2AsiaPlatformAPI.ts`

Frontend:

- No customer frontend changes.
- No admin UI implementation.
- Customer frontend scan found no use of E3 diagnostics types or endpoint.

## 8. Authz Model

Access boundary:

- endpoint is internal only;
- requires service JWT through existing `requireServiceAuth`;
- caller must be in `ADMIN_DIAGNOSTICS_ALLOWED_SERVICES`;
- ordinary gateway user auth is not accepted;
- unsupported service subjects receive `403`;
- malformed diagnostic requests receive `400`;
- missing/invalid service auth receives `401`;
- missing service auth configuration remains `503`.

Allowed service subjects in this slice:

```text
support-service
api-gateway
admin-service
points-service
```

This mirrors the E2 service-to-service posture while keeping a separate diagnostics allowlist so future production hardening can narrow diagnostics access without changing support lookup semantics.

## 9. Diagnostic Runtime Semantics

Governance invariants:

```text
diagnostic_snapshot != customer_proof
admin_diagnostics_can_help_find_owner_fact = true
admin_diagnostics_can_terminate_proof = false
lookup != proof
projection != authority
owner_fact = authoritative
metadata != receipt
Path_B_inactive = true
public_launch_implied = false
```

Returned data boundary:

- returns `diagnosticId`, kind, visibility, generation time, lookup status, owner pointers and internal notes;
- does not return transaction amounts;
- does not return transaction external IDs;
- does not expose a customer route or customer URL;
- does not mutate owner facts;
- does not perform support case workflow;
- does not resolve cross-service chains.

## 10. Tests / Guardrails Added

Backend tests in `apps/points-service/test/request.test.ts`:

- returns an admin diagnostic snapshot for a bounded user balance owner fact lookup;
- returns bounded owner fact family pointers for transaction lookups without row payload;
- blocks unsupported service callers with `403`;
- blocks ordinary gateway user auth with `401`;
- rejects malformed support lookup keys with `400`;
- rejects unsupported diagnostic kinds with `400`;
- asserts `isCustomerProof=false` and `canTerminateProof=false`;
- asserts no row data such as `amount` or `externalId` is returned;
- asserts no fake certainty, support-closure or Path B vocabulary in diagnostic payloads.

Static grep:

- no forbidden matches in generated E3 DTOs;
- no E3 endpoint/type exposure in customer frontend;
- implementation matches for `verified` are pre-existing auth variable names outside E3;
- test matches are negative assertions;
- OpenAPI broad scan matches outside E3 schemas were pre-existing support lookup / Points action descriptions.

## 11. Validation Command Results

Passed:

```text
pnpm guardrails:mock-imports:check
pnpm guardrails:mock-env:check
pnpm -C apps/points-service test -- request.test.ts
pnpm -C apps/points-service test
pnpm -C apps/points-service typecheck
pnpm openapi:bundle
pnpm gen:types
pnpm gen:sdk
pnpm -C packages/sdk typecheck
pnpm -C apps/go2asia-pwa-shell typecheck
pnpm -C apps/go2asia-pwa-shell lint
pnpm -C apps/go2asia-pwa-shell test
git diff --check
ReadLints on edited source/test files
```

OpenAPI validation note:

- `pnpm openapi:check` ran `openapi:bundle`, `gen:types` and `gen:sdk` successfully.
- It then exited 1 because intended E3 generated artifacts are still uncommitted in the working tree. This matches repository drift-check behavior before committing generated OpenAPI/types/SDK changes.

Targeted grep:

```text
verified
settled
confirmed
guaranteed
proofComplete
supportResolved
caseClosed
receipt
accounting statement
financial ledger
cashback
payout
on-chain
bridge
NFT ownership
```

Result:

```text
No matches in generated E3 diagnostic DTOs.
No E3 endpoint/type references in customer frontend.
Points implementation matches are pre-existing auth variable names outside the diagnostics layer.
Test matches are negative assertions.
OpenAPI broad scan matches outside E3 diagnostic schemas are pre-existing support lookup / Points action descriptions.
```

## 12. Governance Review

Runtime Governance:

- diagnostic snapshot is navigation only;
- owner facts remain authoritative;
- diagnostic snapshot cannot terminate proof;
- no ledger/proof escalation was introduced.

Security / Fraud:

- no customer diagnostic URL;
- no support-proof shortcut;
- no row payload dump;
- service-auth and allowlist enforced;
- ordinary user/gateway auth is blocked.

Backend/API:

- additive internal endpoint and schemas only;
- no breaking response migration;
- no existing response fields removed or renamed;
- OpenAPI and generated types synchronized.

Frontend:

- no customer UI changes;
- no admin panel implementation;
- no proof display or copy-to-clipboard proof surface.

Canon:

- E3 stays bounded to internal diagnostics runtime foundation;
- support workflow and broader Admin product remain deferred;
- Path B remains inactive.

## 13. Remaining Diagnostics / Support Gaps

- No support ticket/case workflow was added.
- No Admin UI or admin panel was added.
- RF/Quest/Rielt/Space diagnostics remain out of scope.
- Row-level transaction diagnostics remain intentionally limited to owner fact family pointers.
- Service caller allowlist is static in this slice; future production hardening may move it to environment/config policy.
- Diagnostic access logging beyond existing request logs remains a future hardening slice.
- Customer-facing support proof remains blocked.

## 14. Acceptance Checklist

| Criterion | Status |
|---|---|
| bounded internal admin diagnostics runtime introduced | PASS |
| diagnostic snapshot can help navigate from lookup to owner fact pointers | PASS |
| strict admin/service authz enforced | PASS |
| no customer-facing proof UI introduced | PASS |
| no support case closure workflow introduced | PASS |
| no accounting/proof engine introduced | PASS |
| no Path B activation | PASS |
| no fake certainty fields introduced | PASS |
| additive DTO/API/OpenAPI changes only | PASS |
| guardrails remain green | PASS |
| typecheck/lint/tests pass | PASS |
| report created | PASS |

Must remain true:

```text
diagnostic_snapshot != customer_proof
admin_diagnostics_can_help_find_owner_fact = true
admin_diagnostics_can_terminate_proof = false
lookup != proof
owner_fact = authoritative
metadata != receipt
Path_B_inactive = true
public_launch_implied = false
```

## 15. Recommended Next Slice

Recommended next slice:

```text
Stage 12I-E4 — Diagnostics Access Hardening / Operational Audit Trail
```

Suggested E4 boundary:

- diagnostics access logging with bounded request metadata;
- environment/config-based diagnostics allowlist;
- no customer UI;
- no support outcome workflow;
- no ledger/proof engine;
- preserve `diagnostic_snapshot != customer_proof`.
