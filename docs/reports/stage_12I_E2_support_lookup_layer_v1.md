# Stage 12I-E2 — Support Lookup Layer Report

Документ: `stage_12I_E2_support_lookup_layer_v1.md`  
Статус: implementation report / bounded support-safe owner lookup layer  
Дата: 2026-05-23  
Scope: internal Points support lookup navigation from projection metadata keys to owner fact references  
Mode: bounded runtime/support lookup slice

## 1. Stage 12I-E2 Verdict

Stage 12I-E2 introduces a bounded support-safe lookup/navigation layer between E1 projection metadata and Points owner facts.

The slice lets internal support/runtime tooling resolve opaque `supportLookupKey` values into owner fact references without turning projections into proof, without closing support cases, without creating Admin diagnostics runtime, and without changing ledger/accounting/Path B semantics.

Required statement:

```text
Stage 12I-E2 completed as bounded support-safe lookup/navigation layer, not proof termination, support case resolution workflow, accounting ledger activation, Admin diagnostics runtime, payout/cashback/token/NFT runtime, Path B activation or public launch approval.
```

Final verdict:

```text
stage_12I_E2_status: COMPLETE_AS_SUPPORT_LOOKUP_LAYER
task_type: support_safe_owner_lookup_layer
risk_level: HIGH
bounded_support_lookup_layer_introduced: true
lookup_from_projection_to_owner_reference_possible: true
owner_facts_remain_authoritative: true
additive_api_openapi_changes: true
generated_types_updated: true
frontend_customer_proof_ui_added: false
support_resolution_workflow_added: false
admin_diagnostics_runtime_added: false
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
| `docs/ai/context/ui/capsule.md` | projection can help find owner facts but cannot terminate proof |
| `docs/ai/context/security/capsule.md` | support-proof, screenshot-as-proof and stale projection abuse boundaries |
| `docs/ai/context/stage_12_product_reality/capsule.md` | Stage 12 product-reality sequencing after E1 |
| `docs/ai/context/routing_rules.md` | bounded context composition and anti-overload rules |

Upstream SSOT read:

- `docs/architecture/domain/stage_11_5_profile_connect_admin_projection_contract_v1.md`
- `docs/architecture/domain/stage_12_x_4_projection_metadata_proof_class_ui_requirements_v1.md`
- `docs/architecture/domain/stage_12_closure_review_v1.md`
- `docs/reports/stage_12I_E1_api_projection_envelope_v1.md`
- `docs/reports/stage_12I_C2_connect_projection_labels_v1.md`
- `docs/reports/stage_12I_C4_shared_projection_component_rules_v1.md`

## 3. Agents Used

| Agent | Role in E2 |
|---|---|
| AI Program Director / Orchestrator | task classification, scope boundary, review gates and final synthesis |
| Backend Developer | Points Service lookup endpoint and owner reference helper boundary |
| Runtime Governance Architect | lookup != proof, owner fact authority and E2/E3 stop lines |
| Frontend Developer | no customer-facing proof UI and bounded frontend non-goals |
| Security / Fraud & Abuse Reviewer | support-proof shortcut, ID leakage, fake verification and settlement risk review |
| QA Agent | lookup invariant tests, permission tests and grep validation plan |
| Technical Canon Writer | report structure, canon wording and residual gap register |
| Slice Strategist | narrow implementation boundary and next-slice sequencing |

## 4. Orchestrator Classification

| Field | E2 decision |
|---|---|
| Task type | support-safe owner lookup layer |
| Risk level | `HIGH` |
| Execution mode | bounded runtime/support implementation |
| Primary domain | Points Service internal support lookup |
| Review gates | Backend, Runtime Governance, Security/Fraud, Frontend, QA, Canon, Slice Strategy |
| Exact boundary | opaque lookup keys + internal service-auth lookup endpoint + additive OpenAPI/generated types + tests + report |

Allowed and performed:

- support-safe lookup key generation;
- owner fact reference helpers;
- bounded internal lookup API;
- lookup DTOs and OpenAPI additions;
- backend lookup validation;
- service-auth and caller allowlist guard;
- generated SDK/types sync;
- tests/grep guardrails;
- report.

Forbidden and not performed:

- proof termination;
- support case resolution workflow;
- accounting ledger activation;
- payout/cashback/token/NFT runtime;
- immutable audit ledger;
- customer-facing proof UI;
- Admin diagnostics runtime;
- broad API rewrite;
- breaking API migration;
- Path B activation.

## 5. Audit Scope

Targeted audit covered:

- E1 projection metadata helper and Points Service metadata call sites;
- `user_balances` and `points_transactions` owner fact identifiers;
- Points Service user-facing projection endpoints;
- existing service-auth and gateway-auth helpers;
- `docs/openapi/points.yaml` and generated type outputs;
- bounded frontend E1 metadata consumers only to confirm no E2 UI is needed.

Explicitly out of scope:

- full Admin runtime;
- support ticket/case workflow;
- accounting ledger or write-path changes;
- Path B surfaces;
- broad backend rewrite;
- RF/Quest/Rielt/Space lookup rollout;
- customer-facing lookup/proof UI.

## 6. Lookup Model

E2 lookup model:

```text
supportLookupKey -> bounded internal lookup -> ownerFactReference
```

Supported concepts:

| Concept | E2 value |
|---|---|
| `supportLookupKey` | opaque key emitted by projection metadata |
| `lookupScope` | `SUPPORT_SAFE` |
| `lookupVisibility` | `INTERNAL_REFERENCE` |
| `lookupStatus` | `LOOKUP_AVAILABLE`, `LOOKUP_LIMITED`, `LOOKUP_UNAVAILABLE` |
| `ownerFactReference.referenceType` | `OWNER_FACT_REFERENCE` |

Implemented key format:

```text
points:<ownerEntity>:<base64url(subject)>
```

Supported owner entities:

- `user_balances`
- `points_transactions`

Semantics:

- `LOOKUP_AVAILABLE` means an owner fact reference was found.
- `LOOKUP_LIMITED` means the lookup points to an owner fact family and individual owner rows must still be resolved before decisions.
- `LOOKUP_UNAVAILABLE` means this lookup did not locate a reference; it is not proof of absence.

What lookup does not mean:

```text
lookup != proof
lookup != settlement
lookup != authority
lookup != support resolution
lookup != admin diagnostics
```

## 7. DTO / API / OpenAPI Changes

Runtime/API:

- Added support lookup key generation for E1 metadata:
  - `pointsSummaryMetadata(userId)` -> `points:user_balances:<opaque>`
  - `walletSummaryMetadata(userId)` -> `points:points_transactions:<opaque>`
  - `activityProjectionMetadata(userId)` -> `points:points_transactions:<opaque>`
  - connect dashboard root metadata gets a bounded `user_balances` lookup key while still avoiding a single overbroad owner-fact claim for the whole composite dashboard.
- Added `POST /internal/points/support-lookup`.
- Added service caller allowlist for lookup access: `support-service`, `api-gateway`, `admin-service`, `points-service`.
- Added lookup parser/validator and owner reference resolver.

OpenAPI:

- Added `POST /internal/points/support-lookup`.
- Added `SupportLookupRequest`.
- Added `SupportLookupResponse`.
- Added `SupportLookupScope`.
- Added `SupportLookupVisibility`.
- Added `SupportLookupStatus`.
- Added `SupportLookupOwnerFactReference`.
- Kept all changes additive.

Generated artifacts:

- Updated `docs/openapi/openapi.bundle.yaml`.
- Updated generated SDK/types indexes and support lookup models.
- Updated generated platform API files produced by the existing Orval pipeline.

Frontend:

- No customer-facing support lookup UI was added.
- Existing E1 frontend metadata consumption remains non-authoritative and does not render lookup keys.

## 8. Lookup / Runtime Semantics

Access boundary:

- endpoint is internal only;
- requires service JWT;
- unsupported service subjects receive `403`;
- malformed lookup keys receive `400`;
- no customer route or customer proof workflow was added.

Returned data boundary:

- response returns lookup status, scope, visibility, note and owner fact reference;
- response does not return ledger rows, transaction amounts, external IDs or proof artefacts;
- `points_transactions` lookup returns `LOOKUP_LIMITED` because aggregate/family navigation still requires owner-service row resolution;
- `user_balances` lookup returns `LOOKUP_AVAILABLE` only when an owner row exists.

Governance boundary:

```text
owner_fact = authoritative
projection_can_help_find_owner_fact = true
projection_can_terminate_proof = false
support_lookup_can_help_navigate = true
support_lookup_can_close_case = false
```

## 9. Tests / Guardrails Added

Backend tests in `apps/points-service/test/request.test.ts`:

- projection metadata support lookup key shape assertion;
- support lookup resolves `user_balances` to `LOOKUP_AVAILABLE`;
- support lookup returns bounded `LOOKUP_LIMITED` for `points_transactions` owner fact family;
- support lookup does not return row data such as amounts or external IDs;
- unsupported service subject receives `403`;
- malformed lookup key receives `400`;
- no fake certainty or forbidden Path B/settlement terms in lookup response payloads.

OpenAPI/codegen:

- OpenAPI bundle and SDK/type generation completed successfully.
- `pnpm openapi:check` generated artifacts successfully, then exited with expected pre-commit diff detection for the intended new generated files.

## 10. Validation Command Results

Passed:

```text
pnpm guardrails:mock-imports:check
pnpm guardrails:mock-env:check
pnpm -C apps/points-service test
pnpm -C apps/points-service test -- request.test.ts
pnpm -C apps/points-service typecheck
pnpm openapi:bundle
pnpm gen:types
pnpm gen:sdk
pnpm -C packages/sdk typecheck
pnpm -C apps/go2asia-pwa-shell typecheck
pnpm -C apps/go2asia-pwa-shell lint
pnpm -C apps/go2asia-pwa-shell test
git diff --check
ReadLints on edited files
```

Observed lint posture:

- PWA lint completed with exit code 0.
- Existing repo warnings remain outside E2 scope.
- No linter errors were reported for E2-edited files.

OpenAPI validation note:

- `pnpm openapi:check` ran `openapi:bundle`, `gen:types` and `gen:sdk` successfully.
- It then exited 1 because intended E2 generated artifacts are still uncommitted in the working tree. This matches the repository drift-check behavior before committing generated OpenAPI/types/SDK changes.

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
cashback
payout
on-chain
bridge
```

Result:

```text
No matches in generated support lookup DTOs.
No matches in the new support lookup API/helper implementation except pre-existing auth variable naming outside the lookup layer.
OpenAPI broad scan shows only pre-existing Points action vocabulary outside the new lookup DTO/API section.
Test matches are negative assertions only.
```

## 11. Governance Review

Runtime Governance:

- lookup is navigation only;
- owner facts remain authoritative;
- projections remain non-authoritative;
- no ledger/proof escalation was introduced.

Security / Fraud:

- no screenshot-as-proof shortcut;
- no support-proof shortcut;
- lookup caller is service-authenticated and allowlisted;
- lookup response does not expose row payloads or financial/settlement semantics.

Backend/API:

- additive endpoint and schemas only;
- no breaking API migration;
- no existing response fields removed or renamed;
- OpenAPI/generated artifacts synchronized.

Frontend:

- no customer-facing proof workflow;
- no support lookup key rendering;
- E1 fallback-safe metadata display remains unchanged.

Canon:

- E2 is bounded to lookup/navigation;
- E3 remains owner for Admin diagnostics runtime;
- no public launch or support-resolution claim is introduced.

## 12. Remaining Support / Runtime Gaps

- Support ticket/case workflow remains out of scope and unimplemented.
- Admin diagnostics runtime remains deferred to E3.
- RF/Quest/Rielt/Space lookup keys are not covered by E2.
- Row-level transaction lookup remains intentionally limited; resolving individual rows should be a future owner-approved slice.
- No support console/UI was added.
- Service caller allowlist is static in this slice; future production hardening may move it to environment/config policy.

## 13. Acceptance Checklist

| Criterion | Status |
|---|---|
| bounded support lookup layer introduced | PASS |
| lookup/navigation from projection to owner fact possible | PASS |
| owner facts remain authoritative | PASS |
| additive DTO/API/OpenAPI changes only | PASS |
| no proof/accounting/support workflow engine introduced | PASS |
| no Admin diagnostics runtime introduced | PASS |
| no Path B activation | PASS |
| no fake certainty fields introduced | PASS |
| guardrails remain green | PASS |
| typecheck/lint/tests pass | PASS |
| report created | PASS |

Must remain true:

```text
projection_can_help_find_owner_fact = true
projection_can_terminate_proof = false
lookup != proof
owner_fact = authoritative
metadata != receipt
Path_B_inactive = true
public_launch_implied = false
```

## 14. Recommended Next Slice

Recommended next slice:

```text
Stage 12I-E3 — Admin Diagnostics Runtime Foundation
```

Suggested E3 boundary:

- internal/admin-only diagnostic snapshots;
- strict authz and visibility boundaries;
- no customer-facing proof output;
- no support case closure workflow unless separately approved;
- preserve `diagnostic_snapshot != customer_proof`.
