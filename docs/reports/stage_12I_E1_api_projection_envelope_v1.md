# Stage 12I-E1 — API Projection Envelope Report

Документ: `stage_12I_E1_api_projection_envelope_v1.md`  
Статус: implementation report / runtime API projection metadata envelope  
Дата: 2026-05-23  
Scope: bounded runtime-backed projection metadata contract for active Points/Connect projection endpoints and consumers  
Mode: bounded runtime/API contract slice

## 1. Stage 12I-E1 Verdict

Stage 12I-E1 introduces a minimal runtime-backed `projectionMetadata` envelope for selected active projection-safe UI surfaces without turning projections into proof, accounting authority, settlement state or support workflow.

The slice moves bounded Connect and Points projection consumers beyond static-only disclaimers by exposing additive metadata from runtime APIs, updating OpenAPI and generated types, and rendering read-only/reference metadata in UI through a fallback-safe formatter.

Required statement:

```text
Stage 12I-E1 completed as bounded runtime/API projection metadata contract work, not accounting ledger implementation, proof termination, support/admin workflow activation, immutable audit ledger, Path B activation, payout/cashback/token/NFT runtime or public launch approval.
```

Final verdict:

```text
stage_12I_E1_status: COMPLETE_AS_API_PROJECTION_ENVELOPE
task_type: runtime_projection_metadata_contract
risk_level: HIGH
runtime_projection_envelope_introduced: true
affected_apis_expose_additive_metadata: true
frontend_consumes_metadata_safely: true
openapi_updated: true
generated_types_updated: true
breaking_api_migration: false
accounting_engine_introduced: false
proof_termination_engine_introduced: false
support_admin_workflow_activated: false
path_b_activation: false
fake_certainty_fields: false
public_launch_ready: false
```

## 2. Capsules Used

| Capsule | Role |
|---|---|
| `docs/ai/context/core/capsule.md` | projection != authority, owner fact, Path A / Path B firewall and no-public-launch doctrine |
| `docs/ai/context/ui/capsule.md` | UI projection wording, wallet/badge copy boundaries and proof-class display constraints |
| `docs/ai/context/security/capsule.md` | fake proof, screenshot-as-proof, support-proof escalation and ownership/settlement risk boundaries |
| `docs/ai/context/stage_12_product_reality/capsule.md` | Stage 12 product reality cleanup, projection-safe labels and runtime contract discipline |
| `docs/ai/context/routing_rules.md` | bounded context composition and anti-overload rules |

Upstream SSOT read:

- `docs/architecture/domain/stage_11_5_profile_connect_admin_projection_contract_v1.md`
- `docs/architecture/domain/stage_12_x_4_projection_metadata_proof_class_ui_requirements_v1.md`
- `docs/architecture/domain/stage_12_closure_review_v1.md`
- `docs/reports/stage_12I_C2_connect_projection_labels_v1.md`
- `docs/reports/stage_12I_C4_shared_projection_component_rules_v1.md`
- `docs/reports/stage_12I_D1_route_alias_layer_v1.md`
- `docs/reports/stage_12I_D2_type_component_alias_layer_v1.md`
- `docs/reports/stage_12I_D3_path_b_quarantine_hardening_v1.md`

## 3. Agents Used

| Agent | Role in E1 |
|---|---|
| AI Program Director / Orchestrator | task classification, exact boundary, review gates and final synthesis |
| Backend Architect | active runtime endpoint selection and bounded metadata helper review |
| API Architect | additive DTO/OpenAPI envelope shape and backward compatibility review |
| Runtime Governance Architect | metadata != proof authority, no ledger/settlement semantics and no Path B activation review |
| Frontend Developer | bounded metadata consumption in Connect dashboard/activity UI |
| Security / Fraud & Abuse Reviewer | fake verification, support-proof escalation and ownership/settlement wording review |
| QA Agent | endpoint assertions, frontend fallback test and targeted forbidden-term grep |
| Technical Canon Writer | canon wording, acceptance checklist and residual gap register |
| Slice Strategist | scope sequencing and E2/E3 stop lines |

## 4. Orchestrator Classification

| Field | E1 decision |
|---|---|
| Task type | runtime projection metadata contract |
| Risk level | `HIGH` |
| Execution mode | bounded runtime/API implementation |
| Primary domain | Points Service read projections + Connect projection consumers |
| Review gates | Backend/API, Runtime Governance, Security/Fraud, Frontend, QA, Canon, Slice Strategy |
| Exact boundary | additive metadata envelope + affected API DTO/OpenAPI/generated types + bounded frontend display + tests + report |

Allowed and performed:

- projection metadata envelope types;
- runtime metadata DTO extensions;
- API response metadata fields on selected projection endpoints;
- backend projection metadata helper;
- bounded frontend metadata consumption;
- projection envelope tests;
- OpenAPI updates for affected endpoints only;
- generated SDK/types sync;
- report.

Forbidden and not performed:

- accounting ledger implementation;
- payout/cashback/token/NFT runtime;
- proof termination engine;
- immutable audit ledger;
- blockchain/on-chain functionality;
- financial settlement semantics;
- Path B activation;
- support/admin workflow implementation;
- broad API rewrite;
- breaking API migration.

## 5. Audit Scope

Audited active projection-backed APIs and consumers only:

- `apps/points-service/src/index.ts`
- `apps/points-service/test/request.test.ts`
- `docs/openapi/points.yaml`
- `docs/openapi/openapi.bundle.yaml`
- `packages/sdk/src/connectDashboard.ts`
- `packages/sdk/src/generated/*`
- `packages/types/src/generated/*`
- `apps/go2asia-pwa-shell/components/connect/Dashboard/BalanceCards.tsx`
- `apps/go2asia-pwa-shell/components/connect/Dashboard/DashboardContent.tsx`
- `apps/go2asia-pwa-shell/components/connect/Wallet/WalletView.tsx`
- `apps/go2asia-pwa-shell/lib/projectionMetadata.ts`

Explicitly out of scope for E1:

- RF lifecycle mutation flows;
- Quest/Rielt broad projection surfaces;
- support/admin lookup or resolution UI;
- Path B/token/NFT/bridge surfaces;
- accounting/proof ledger semantics.

## 6. Projection Envelope Design

The envelope is intentionally minimal:

```text
projectionSource
projectionKind
generatedAt
referenceScope
ownerFactReference?
supportLookupKey?
```

Enums introduced:

- `ProjectionSource`: `POINTS_SERVICE`
- `ProjectionKind`: `ACTIVITY_PROJECTION`, `POINTS_SUMMARY`, `BADGE_PREVIEW`, `RF_LIFECYCLE_PROJECTION`, `INQUIRY_PROJECTION`
- `ProjectionReferenceScope`: `READ_ONLY`, `REFERENCE_ONLY`, `PREVIEW_ONLY`, `INQUIRY_ONLY`
- `ProjectionOwnerFactReference.referenceType`: `OWNER_FACT_REFERENCE`

Design notes:

- `generatedAt` is runtime-generated metadata freshness, not proof finality.
- `ownerFactReference` points toward owner facts where bounded and safe; it does not terminate proof.
- `supportLookupKey` remains optional and was not used in this slice because E2 owns support lookup semantics.
- Composite projections may omit `ownerFactReference` when a single owner fact would overstate authority.

Forbidden certainty vocabulary was excluded from the envelope and UI formatter:

```text
verified
settled
confirmed
guaranteed
proofComplete
```

## 7. DTO / API / OpenAPI Changes

Backend/API changes:

- Added `apps/points-service/src/projectionMetadata.ts`.
- Added `projectionMetadata` to `/v1/points/balance`.
- Added `projectionMetadata` to `/v1/wallet/summary`.
- Added `projectionMetadata` to `/v1/points/connect-dashboard`.
- Added `projectionMetadata` to `/v1/points/transactions`.

Endpoint metadata posture:

- balance and wallet summary use `POINTS_SUMMARY` / `READ_ONLY`;
- transactions use `ACTIVITY_PROJECTION` / `READ_ONLY`;
- connect dashboard uses `ACTIVITY_PROJECTION` / `READ_ONLY` and intentionally omits `ownerFactReference` because the dashboard is composite.

OpenAPI/generated changes:

- Added projection metadata schemas to `docs/openapi/points.yaml`.
- Regenerated `docs/openapi/openapi.bundle.yaml`.
- Regenerated affected `packages/types/src/generated/*` models.
- Regenerated affected `packages/sdk/src/generated/*` models.

Manual SDK compatibility changes:

- Added `packages/sdk/src/projectionMetadata.ts`.
- Extended `ConnectDashboardResponse` with optional `projectionMetadata` for the bounded frontend consumer.
- Re-exported `ProjectionMetadataEnvelope` from `packages/sdk/src/connectDashboard.ts`.
- Generated SDK/types models for `UserBalance`, `WalletSummaryResponse` and `TransactionsPage` include the additive OpenAPI metadata field.

Backward compatibility posture:

- all response extensions are additive;
- existing fields were not renamed or removed;
- metadata fields are optional in SDK-facing manual wrappers;
- no mandatory consumer migration was introduced.

## 8. Frontend Consumption Changes

Added `apps/go2asia-pwa-shell/lib/projectionMetadata.ts` with `formatProjectionMetadata()`.

The formatter:

- renders projection kind;
- renders read-only/reference scope;
- renders generated timestamp where parseable;
- falls back to non-authoritative read-only copy when metadata is absent;
- avoids proof, settlement, verification, payout, cashback, on-chain or bridge claims.

Bounded consumers updated:

- `BalanceCards.tsx` displays projection metadata for Connect activity summary cards.
- `DashboardContent.tsx` passes top-level dashboard metadata into the bounded summary cards.
- `WalletView.tsx` displays projection metadata in points summary and activity history areas.

Frontend non-goals:

- no support lookup UI;
- no proof-completion UI;
- no ownership/settlement status;
- no Path B activation;
- no route rewiring.

## 9. Tests / Guardrails Added

Backend/API tests:

- `apps/points-service/test/request.test.ts` now validates metadata envelopes on affected read responses.
- The helper asserts allowed shape, source/kind/scope values and absence of proof-like fields.

Frontend tests:

- `apps/go2asia-pwa-shell/lib/projectionMetadata.test.ts` validates fallback behavior and authority-safe rendering.
- The test denies `verified`, `settled`, `confirmed`, `guaranteed`, `proofComplete`, `financial ledger`, `cashback`, `payout`, `on-chain` and `bridge` claims.

Static grep:

- scoped grep across new metadata DTOs/helpers and bounded frontend consumers returned no forbidden-term matches.
- broader scoped grep found only pre-existing unrelated references in auth verification naming, existing producer allowlist vocabulary and dormant Path B quarantine copy.

## 10. Validation Command Results

Passed:

```text
pnpm guardrails:mock-imports:check
pnpm guardrails:mock-env:check
pnpm -C apps/points-service test
pnpm -C apps/points-service typecheck
pnpm -C packages/sdk typecheck
pnpm -C apps/go2asia-pwa-shell typecheck
pnpm -C apps/go2asia-pwa-shell lint
pnpm -C apps/go2asia-pwa-shell test
pnpm openapi:bundle
git diff --check
ReadLints on edited source/test files
```

Observed lint posture:

- PWA lint completed with exit code 0.
- Existing repo warnings remain outside E1 scope.
- No linter errors were reported for E1-edited files.

OpenAPI validation note:

- `pnpm openapi:bundle`, `pnpm gen:types` and `pnpm gen:sdk` succeeded and generated the committed-diff artifacts in this working tree.
- `pnpm openapi:check` executed generation successfully, then exited 1 because it detects the intended uncommitted generated OpenAPI/types/SDK changes. This is expected before committing E1 generated artifacts.

Targeted grep:

```text
proofClass
verified
settled
confirmed
guaranteed
financial ledger
cashback
payout
on-chain
bridge
proofComplete
```

Result:

```text
No matches in new metadata DTOs, API helper, bounded frontend formatter or bounded frontend consumers.
```

## 11. Governance Review

Runtime Governance:

- `projectionMetadata` is descriptive runtime metadata only.
- `metadata != proof_termination`.
- `projection != authority`.
- No ledger, immutable audit, settlement or proof-completion semantics were introduced.

Security / Fraud:

- no fake verification fields;
- no settlement/ownership claims;
- no support-proof escalation;
- screenshot-as-proof risk is reduced because UI now displays runtime read-only/reference metadata instead of relying on static-only copy.

Backend/API:

- additive fields only;
- no breaking response migration;
- no existing DTO field removal;
- no broad API rewrite;
- OpenAPI and generated types were synchronized.

Frontend:

- bounded display only;
- fallback-safe when metadata is absent;
- copy remains read-only and non-proof;
- no support/admin workflow activation.

Canon:

- E1 stays bounded to runtime projection metadata;
- E2 should own support lookup layer design;
- E3 or later should own support/admin workflow if approved;
- Path B remains inactive.

## 12. Remaining Metadata / Runtime Gaps

- RF lifecycle projection metadata remains out of E1 and should be evaluated separately with stronger lifecycle-specific review.
- Quest/Rielt projection surfaces are not yet covered by the runtime envelope.
- `supportLookupKey` exists in the envelope shape but is intentionally unused until E2 defines lookup semantics, privacy boundaries and operational workflow.
- UI still needs broader adoption after endpoint coverage expands; E1 only wires bounded Connect projection consumers.
- `ownerFactReference` is intentionally conservative and omitted from composite projections where it could imply a single authoritative owner fact.

## 13. Acceptance Checklist

| Criterion | Status |
|---|---|
| bounded runtime projection envelope introduced | PASS |
| affected APIs expose additive projection metadata | PASS |
| frontend can consume projection metadata safely | PASS |
| OpenAPI updated where required | PASS |
| generated SDK/types synchronized | PASS |
| no breaking API migration | PASS |
| no accounting/proof engine introduced | PASS |
| no Path B activation | PASS |
| no fake certainty fields introduced | PASS |
| guardrails remain green | PASS |
| typecheck/lint/tests pass | PASS |
| report created | PASS |

Must remain true:

```text
projection != authority
metadata != proof_termination
Points_row = economic_fact
projection_can_help_find_owner_fact = true
projection_can_terminate_proof = false
Path_B_inactive = true
public_launch_implied = false
```

## 14. Recommended Next Slice

Recommended next slice:

```text
Stage 12I-E2 — Support Lookup Layer Foundation
```

Suggested E2 boundary:

- define non-sensitive support lookup key generation and lookup semantics;
- keep support lookup separate from proof termination;
- add API lookup foundation only where owner facts are safely referenceable;
- avoid support/admin workflow activation unless explicitly scoped;
- preserve `projection_can_help_find_owner_fact = true` and `projection_can_terminate_proof = false`.
