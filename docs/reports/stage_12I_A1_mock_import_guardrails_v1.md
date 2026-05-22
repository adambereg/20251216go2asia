# Stage 12I-A1 — Mock Import Guardrails Implementation Report

Документ: `stage_12I_A1_mock_import_guardrails_v1.md`  
Статус: implementation report / bounded containment slice evidence  
Дата: 2026-05-22  
Scope: mock import and public barrel guardrails for `apps/go2asia-pwa-shell`  
Mode: read-only audit -> bounded guardrail implementation -> self-review -> regression validation; no mock deletion, no route/type cleanup, no UI replacement, no runtime/API/schema changes

## 0. Executive Summary

Stage 12I-A1 installs the first post-Stage-12 product-reality enforcement perimeter.

It freezes the current mock import and public barrel debt behind a reviewed baseline, adds a CI guardrail that fails on new unreviewed mock propagation, and documents the remaining cleanup backlog for Stage 12I-A2 and 12I-A3.

Primary verdict:

```text
Stage_12I_A1 = mock_import_containment_guardrails
Stage_12I_A1 = regression_prevention_and_baseline_enforcement
Stage_12I_A1 != mock_quarantine_implementation
Stage_12I_A1 != mock_cleanup_wave
Stage_12I_A1 != route_or_type_rename
Stage_12I_A1 != projection_metadata_ui_implementation
Stage_12I_A1 != public_launch_ready
```

Required statement:

```text
12I-A1 completed as bounded containment slice, not cleanup wave.
```

## 1. Orchestration Summary

Task type: P0 containment implementation after Stage 12 closure.

Risk level: `MEDIUM_HIGH`.

Reason:

- Mock imports and public mock barrels can silently spread fantasy/proof-like data into app/runtime surfaces.
- Existing Atlas/Pulse/Quest/Guru/Rielt seed/mock debt still exists and must not be mass-deleted in this slice.
- Guardrails must block regressions without collapsing dev/demo flows or implying mock quarantine is complete.

Capsules used:

| Capsule | Role |
|---|---|
| `docs/ai/context/core/capsule.md` | no-public-launch, Path A/Path B and bounded-slice doctrine |
| `docs/ai/context/ui/capsule.md` | mock/demo, dashboard/projection and UI proof-class boundaries |
| `docs/ai/context/security/capsule.md` | mock-as-proof and screenshot/support proof rejection |
| `docs/ai/context/stage_12_product_reality/capsule.md` | Stage 12 follow-up routing and residue map |
| `docs/ai/context/routing_rules.md` | anti-overload and capsule composition |

Review gates:

| Gate | Result |
|---|---|
| Slice Review | Passed; implementation scoped to guardrails/baseline/CI/report |
| Runtime Governance Review | Passed; runtime/API/schema/projection semantics unchanged |
| Frontend / Code Review | Passed; no UI route/component cleanup or redesign |
| DevOps Review | Passed; lightweight CI job added without install/build dependency |
| QA Review | Passed; guardrail/typecheck/lint/test validation green |
| Canon Review | Passed; this is an implementation report below Stage 12 closure and Stage 12.x.3 inventory |
| Security Review | Passed as mock-as-proof containment; evidence/env runtime semantics unchanged |

## 2. Files Changed

| Path | Change type | Purpose |
|---|---|---|
| `scripts/mock_import_guardrails_check.mjs` | new script | Baseline-aware guardrail scanner for app-route mock imports and public barrel mock exports |
| `scripts/guardrails/mock_import_baseline.json` | new baseline | Freezes existing known mock/barrel debt with owner slices |
| `package.json` | script update | Adds `guardrails:mock-imports:check` and `guardrails:mock-imports:baseline` |
| `.github/workflows/ci.yml` | CI update | Adds lightweight `Mock Import Guardrails` job |
| `docs/reports/stage_12I_A1_mock_import_guardrails_v1.md` | new report | Evidence, validation, remaining gaps and handoff |

No frontend UI, route, runtime service, API, OpenAPI, SDK, schema, migration, mock corpus, type or component semantics were changed.

## 3. Guardrails Added

### 3.1 Baseline-aware mock import scanner

Command:

```text
pnpm guardrails:mock-imports:check
```

Direct Node equivalent:

```text
node scripts/mock_import_guardrails_check.mjs
```

The scanner collects two rule classes:

| Rule ID | Scope | Blocks new debt |
|---|---|---|
| `APP_ROUTE_MOCK_IMPORT` | `apps/go2asia-pwa-shell/app/**/*.{ts,tsx,js,jsx}` | Direct route/runtime imports from known mock/seed corpora |
| `PUBLIC_BARREL_MOCK_EXPORT` | `apps/go2asia-pwa-shell/components/**/index.ts` | Public re-export of mock corpora through component barrels |

Baseline policy:

```text
existing_findings_are_allowlisted_debt
new_unallowlisted_findings_fail_CI
stale_baseline_entries_fail_until_baseline_is_updated
baseline_shrinks_as_follow_up_slices_remove_debt
```

### 3.2 CI enforcement

A new CI job was added:

```text
job: mock-import-guardrails
name: Mock Import Guardrails
command: node scripts/mock_import_guardrails_check.mjs
install_required: false
timeout: 2 minutes
```

The job runs on the same PR/push triggers as the existing CI workflow and is intentionally independent of build/test/lint install overhead.

### 3.3 Developer diagnostics

On failure, the script reports:

- rule ID;
- file and line;
- matched import/export source;
- owner slice;
- remediation hint.

This is intended to make new violations actionable without encouraging cleanup inside unrelated slices.

## 4. Restricted Import Matrix

| Source class | Current handling | Owner slice |
|---|---|---|
| `@/components/quest/mockQuests` from app routes | Baseline debt; new routes fail | `12I-A3 / Stage 12.x.3-C` |
| `@/components/pulse/mockEvents` from app routes | Baseline debt; new routes fail | `12I-A2 / Stage 12.x.3-A` |
| `@/components/guru/mockObjects` from app routes | Baseline debt; new routes fail | `12I-A2 / Stage 12.x.3-A` |
| `@/mocks/repo` from app routes | Baseline debt for Atlas/Pulse env-gated demo mode; new paths fail | `12I-A3 / Stage 12.x.3-D` |
| `@/lib/rieltSeedRepo` from app/API routes | Baseline seed debt; new paths fail | Rielt seed source-label slice |
| `@/components/rielt/hooks/useRieltSeed` from app routes | Baseline seed debt; new paths fail | Rielt seed source-label slice |
| `@/mocks/dto` | Not blocked by A1 because it is the data-source switch, not a corpus by itself | `12I-A3 / env guardrails` |
| Public exports from `components/pulse/index.ts` | Baseline public barrel debt; new barrel exports fail | `12I-A2` |
| Public exports from `components/guru/index.ts` | Baseline public barrel debt; new barrel exports fail | `12I-A2` |

Current baseline count:

```text
allowed_baseline_findings: 23
```

This is not a success metric for cleanup. It is a perimeter snapshot.

## 5. Public Barrel Exposure Summary

Current public barrel state:

| Barrel | A1 status | Follow-up |
|---|---|---|
| `components/connect/index.ts` | No mock corpus export detected | Keep guard |
| `components/quest/index.ts` | No `mockQuests` export detected | Keep guard |
| `components/rielt/index.ts` | No `mockListings` export detected | Keep guard |
| `components/space/index.ts` | No `mockData` export detected; mock-consuming submodules remain a future risk | `12I-A2` / later Space containment |
| `components/rf/index.ts` | No `mockData` export detected; mock-consuming legacy submodules remain a future risk | `12I-A2` / RF PRO quarantine |
| `components/pulse/index.ts` | Baseline public mock export detected | `12I-A2` |
| `components/guru/index.ts` | Baseline public mock export detected | `12I-A2` |

12I-A1 does not remove Pulse/Guru exports. It prevents new unreviewed public mock barrel exposure and creates the baseline that 12I-A2 should shrink.

## 6. CI Enforcement Details

Workflow:

```text
.github/workflows/ci.yml
```

New job:

```text
mock-import-guardrails
```

Why separate from lint:

- the check is a governance policy, not only a TypeScript/ESLint syntax rule;
- no `pnpm install` is required;
- it stays fast and easier to diagnose;
- it avoids breaking current dev/demo flows while still blocking new debt.

Local commands:

```text
pnpm guardrails:mock-imports:check
pnpm guardrails:mock-imports:baseline
```

Baseline update must be reviewed. It should only happen when a follow-up slice intentionally removes or reclassifies debt.

## 7. Validation Evidence

Validation was run after implementation.

| Check | Result |
|---|---|
| `pnpm guardrails:mock-imports:check` | Passed; 23 allowed baseline findings |
| `pnpm -C apps/go2asia-pwa-shell typecheck` | Passed |
| `pnpm -C apps/go2asia-pwa-shell lint` | Passed |
| `pnpm -C apps/go2asia-pwa-shell test` | Passed; 16 files / 98 tests |

No heavy build was required because A1 changes only guardrail tooling, CI config and docs.

## 8. Regression Risk Assessment

| Risk | Status after A1 | Notes |
|---|---|---|
| New direct mock import in app route | Reduced | New unallowlisted findings fail guardrail |
| New public barrel mock export | Reduced | New unallowlisted barrel findings fail guardrail |
| Existing Quest complete mock route | Still open | Baseline debt; owner slice `12I-A3` |
| Existing Rielt seed overlay | Still open | Baseline seed debt; source labels remain future work |
| Existing Atlas/Pulse env mock graph | Still open | Baseline debt; env/smoke guardrails are future work |
| Existing Pulse/Guru mock barrels | Still open | Baseline debt; owner slice `12I-A2` |
| Home inline mock stats | Not covered | Inline data is not import-based; owner slice `12I-B1` / `12.x.4-A` |
| RF PRO transitive mock routes | Not fully covered | Transitive component imports are out of A1; owner slice `12I-B2` |
| Developer demo flows | Preserved | `getDataSource()` and mock runtime behavior unchanged |
| Public launch misunderstanding | Mitigated by report | A1 is explicitly not cleanup or launch readiness |

## 9. Unresolved Gaps

These gaps remain by design:

| Gap | Severity | Owner slice |
|---|---|---|
| Home authenticated inline `userStats` / `userRewards` | Critical | `12I-B1` |
| `/quest/[id]/complete` direct `mockQuests` dependency | High | `12I-B3` / `12.x.3-C/E` |
| `/rf/pro/partners` and `/rf/pro/verifications` mock operational surfaces | High | `12I-B2` |
| Pulse/Guru public mock barrel exports | High | `12I-A2` |
| `NEXT_PUBLIC_DATA_SOURCE=mock` smoke/evidence guardrails | Critical | `12I-A3` |
| Space/RF mock-consuming submodule exposure | Medium/High | `12I-A2` or later module containment |
| Projection metadata runtime/API envelope | High | `12I-E1` / future API metadata slice |
| Support-safe owner lookup and Admin diagnostics runtime | High | `12I-E2` / `12I-E3` |

## 10. Self-Review

| Question | Result |
|---|---|
| Did A1 start a cleanup wave? | No |
| Were mocks deleted, moved or renamed? | No |
| Were routes/types/components renamed? | No |
| Did A1 change runtime behavior or API contracts? | No |
| Did A1 change UI/copy/layout/product semantics? | No |
| Did A1 block safe dev/demo flows? | No |
| Did A1 introduce a CI/lint perimeter? | Yes, CI guardrail and root scripts |
| Does A1 claim mock quarantine is complete? | No |

Self-review verdict:

```text
cleanup_wave_triggered: false
hidden_refactor_detected: false
runtime_semantics_changed: false
developer_demo_flows_preserved: true
premature_runtime_enforcement: false
```

## 11. Recommended Next Slice

Recommended next slice:

```text
Stage 12I-A2 — Public Barrel Cleanup / Containment
```

Recommended scope for 12I-A2:

- remove Pulse mock exports from `components/pulse/index.ts`;
- remove Guru mock corpus exports from `components/guru/index.ts`;
- extract neutral Guru constants if needed;
- consider Space/RF mock-consuming submodule exposure;
- shrink `scripts/guardrails/mock_import_baseline.json`;
- keep routes and UI behavior stable.

Recommended follow-up after A2:

```text
Stage 12I-A3 — Mock Env Guardrails
```

Recommended scope for 12I-A3:

- assert `NEXT_PUBLIC_DATA_SOURCE=mock` is excluded from smoke/prod evidence;
- check deploy/workflow/env paths for mock mode;
- document mock mode as dev/demo only;
- do not change `getDataSource()` runtime behavior unless a separate slice explicitly approves it.

## 12. Final Verdict

```text
stage_12I_A1_status: COMPLETE_AS_MOCK_IMPORT_CONTAINMENT_GUARDRAILS
stage_12I_A1_task_type: post_closure_p0_regression_containment
stage_12I_A1_risk_level: MEDIUM_HIGH
stage_12I_A1_meaning: GUARDRAILS_INSTALLED_NOT_MOCK_CLEANUP

stage_12I_A1_complete: true
stage_12I_A1_mock_quarantine_complete: false
stage_12I_A1_mock_cleanup_wave: false
stage_12I_A1_route_type_cleanup: false
stage_12I_A1_projection_metadata_ui_implementation: false
stage_12I_A1_runtime_changes: false
stage_12I_A1_api_openapi_sdk_changes: false
stage_12I_A1_schema_migration_changes: false
stage_12I_A1_path_b_activation: false

grep_guardrails_added: true
mock_import_regression_gate_active: true
barrel_mock_export_regression_gate_active: true
baseline_or_allowlist_documented: true

stage_12_closure_status: UNCHANGED_CLOSED_FOR_GOVERNANCE
stage_12_mock_quarantine_status: CONTAINMENT_STARTED_NOT_IMPLEMENTED
stage_12_public_launch_status: NOT_APPROVED
stage_12_production_rollout_status: NOT_APPROVED
stage_12_support_proof_status: NOT_APPROVED
stage_13_entry_status: UNCHANGED_CONDITIONAL_READY_FOR_PLANNING

canon_status: aligned
public_launch_claims: false
```

12I-A1 completed as bounded containment slice, not cleanup wave.
