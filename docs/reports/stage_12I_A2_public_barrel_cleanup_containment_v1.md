# Stage 12I-A2 — Public Barrel Cleanup / Containment Report

Документ: `stage_12I_A2_public_barrel_cleanup_containment_v1.md`  
Статус: implementation report / public barrel containment evidence  
Дата: 2026-05-22  
Scope: Pulse and Guru public barrel mock export containment for `apps/go2asia-pwa-shell`  
Mode: targeted audit -> bounded implementation -> baseline shrink -> validation -> report

## 0. Executive Summary

Stage 12I-A2 reduces the known public barrel debt created by mock corpora being re-exported from component module indexes.

The slice removed Pulse and Guru mock corpus exports from public barrels, extracted Guru's neutral map center into a non-mock constants module, updated the only route-level consumer that was importing that neutral value from `mockObjects`, and shrank the Stage 12I-A1 guardrail baseline from 23 findings to 20 findings.

Required statement:

```text
Stage 12I-A2 completed as public barrel containment slice, not mock cleanup wave.
```

This slice does not delete mock corpora, does not quarantine route-level mocks, does not rename routes or types, does not change UI behavior, and does not change runtime/API/schema/OpenAPI/SDK contracts.

## 1. Orchestration Summary

Task type: `public_barrel_mock_containment`.

Risk level: `MEDIUM_HIGH`.

Reason:

- Public barrels can silently spread mock corpora into active UI/runtime surfaces.
- Pulse and Guru barrels were known Stage 12I-A1 baseline debt.
- The cleanup must shrink the baseline without triggering a broad mock cleanup wave.

Capsules used:

| Capsule | Role |
|---|---|
| `docs/ai/context/core/capsule.md` | Path A/Path B, no-public-launch and bounded-slice doctrine |
| `docs/ai/context/ui/capsule.md` | public barrel mock exposure and product-reality boundaries |
| `docs/ai/context/security/capsule.md` | mock-as-proof and screenshot/support-proof rejection |
| `docs/ai/context/stage_12_product_reality/capsule.md` | Stage 12 follow-up routing and mock containment categories |

Agents used:

| Agent | Review role |
|---|---|
| AI Program Director / Orchestrator | Classification, scope control and implementation sequencing |
| Slice Strategist | Minimal slice plan and stop lines |
| Frontend Developer | Import/rendering safety review |
| Runtime Governance Architect | Runtime/API/schema non-change review |
| QA Agent | Validation and regression evidence review |
| Technical Canon Writer | Report/verdict alignment |

Review gates:

| Gate | Result |
|---|---|
| Slice Review | Passed; A2 stayed limited to Pulse/Guru public barrel containment |
| Frontend Code Review | Passed; no rendering, layout or UI behavior changes |
| Runtime Governance Review | Passed; no runtime/API/schema/projection contract changes |
| QA Review | Passed; guardrail/typecheck/lint/test validation green |
| Canon Review | Passed; report preserves Stage 12 and Stage 12I boundaries |
| Security Review | Not escalated beyond mock-as-proof boundary review; no env/evidence boundary changed |

## 2. Files Changed

| Path | Change type | Purpose |
|---|---|---|
| `apps/go2asia-pwa-shell/components/pulse/index.ts` | barrel containment | Removed public export of `mockEvents` and `mockEventsById` |
| `apps/go2asia-pwa-shell/components/guru/index.ts` | barrel containment | Removed public export of Guru mock corpus and mock-derived counts |
| `apps/go2asia-pwa-shell/components/guru/constants/mapDefaults.ts` | new neutral constants module | Provides `DEFAULT_CENTER` without importing from `mockObjects` |
| `apps/go2asia-pwa-shell/components/guru/mockObjects.ts` | neutral constant extraction | Re-exports `DEFAULT_CENTER` from the neutral constants module for legacy internal compatibility |
| `apps/go2asia-pwa-shell/app/(public)/guru/GuruClient.tsx` | targeted import update | Uses neutral `DEFAULT_CENTER` path instead of importing from mock corpus |
| `scripts/guardrails/mock_import_baseline.json` | baseline shrink | Removed 3 stale findings after A2 containment |
| `docs/reports/stage_12I_A2_public_barrel_cleanup_containment_v1.md` | new report | Evidence, validation, remaining gaps and handoff |

No mock corpora were deleted or moved.

## 3. Pulse Barrel Changes

Before A2, `components/pulse/index.ts` publicly exported:

- `mockEvents`;
- `mockEventsById`.

A2 removed those public exports.

Direct route-level Pulse mock usage remains intentionally out of scope:

- `apps/go2asia-pwa-shell/app/(public)/pulse/events/[slug]/page.tsx` still imports `@/components/pulse/mockEvents`.

That route-level mock import remains in the guardrail baseline and should be handled by a later route/mock quarantine slice, not by A2.

## 4. Guru Barrel Changes

Before A2, `components/guru/index.ts` publicly exported:

- `mockObjects`;
- `mockPlaces`;
- `mockEvents`;
- `mockHousing`;
- `mockPeople`;
- `mockQuests`;
- `DEFAULT_CENTER`;
- `OBJECT_COUNTS`.

A2 removed the entire public mock corpus export block from the Guru barrel.

The Guru mock corpus file still exists and remains available for explicit direct imports while it is baseline-managed. A2 only removed public barrel propagation.

## 5. Neutral Constants

`DEFAULT_CENTER` is a neutral map fallback value, not a mock corpus.

A2 extracted it to:

- `apps/go2asia-pwa-shell/components/guru/constants/mapDefaults.ts`.

`GuruClient` now imports `DEFAULT_CENTER` from the neutral constants module. The value did not change:

| Field | Value |
|---|---|
| `lat` | `54.9833` |
| `lng` | `82.8964` |

`mockObjects.ts` re-exports the same constant to avoid breaking any explicit internal legacy import paths while preventing app/runtime surfaces from needing the mock corpus for the neutral fallback.

`OBJECT_COUNTS` was not extracted because it is mock-derived and had no active non-mock consumer in the A2 audit.

## 6. Baseline Shrink Summary

Baseline before A2:

```text
allowed_baseline_findings: 23
```

The first guardrail run after code changes failed as expected with 3 stale baseline entries:

| Removed baseline entry | Reason |
|---|---|
| `APP_ROUTE_MOCK_IMPORT|apps/go2asia-pwa-shell/app/(public)/guru/GuruClient.tsx|@/components/guru/mockObjects` | `GuruClient` now imports `DEFAULT_CENTER` from neutral constants |
| `PUBLIC_BARREL_MOCK_EXPORT|apps/go2asia-pwa-shell/components/guru/index.ts|./mockObjects` | Guru public barrel no longer exports mock corpus |
| `PUBLIC_BARREL_MOCK_EXPORT|apps/go2asia-pwa-shell/components/pulse/index.ts|./mockEvents` | Pulse public barrel no longer exports mock corpus |

Baseline update command:

```text
pnpm guardrails:mock-imports:baseline
```

Baseline after A2:

```text
allowed_baseline_findings: 20
```

No new guardrail findings were added.

## 7. Guardrail Result

Command:

```text
pnpm guardrails:mock-imports:check
```

Result:

```text
Mock import guardrails passed.
Allowed baseline findings: 20
```

Public barrel negative assertion:

```text
rg "export\s+(?:\{[^;]*\}|\*)\s+from\s+['\"]\./mock" apps/go2asia-pwa-shell/components --glob "**/index.ts" --multiline
```

Result:

```text
No matches found
```

Pulse/Guru targeted assertions:

| Assertion | Result |
|---|---|
| `components/pulse/index.ts` does not export `mockEvents` or `mockEventsById` | Passed |
| `components/guru/index.ts` does not export Guru mock corpus symbols | Passed |
| `components/space/index.ts` public mock export state did not worsen | Passed; no implementation change |
| `components/rf/index.ts` public mock export state did not worsen | Passed; no implementation change |

## 8. Validation Results

| Command | Result | Notes |
|---|---|---|
| `pnpm guardrails:mock-imports:check` | Passed | Baseline shrunk to 20 allowed findings |
| `pnpm -C apps/go2asia-pwa-shell typecheck` | Passed | `tsc --noEmit` |
| `pnpm -C apps/go2asia-pwa-shell lint` | Passed | Existing lint gate green |
| `pnpm -C apps/go2asia-pwa-shell test` | Passed | 16 files, 98 tests |
| IDE lints for touched files | Passed | No linter errors found |

## 9. Remaining Known Gaps

A2 intentionally leaves these gaps open:

| Gap | Owner / next slice |
|---|---|
| Route-level mock imports in Pulse/Guru/Quest/Rielt/Atlas surfaces | Later mock quarantine / route replacement slices |
| `NEXT_PUBLIC_DATA_SOURCE=mock` smoke/prod evidence risk | Stage 12I-A3 — Mock Env Guardrails |
| Home authenticated mock stats/rewards | Stage 12I-B1 — Home Auth Replacement |
| RF PRO route mock exposure | Stage 12I-B2 — RF PRO Legacy Route Quarantine |
| Quest complete mock route | Stage 12I-B3 — Quest Complete Cleanup |
| Space/RF mock-consuming submodule cleanup | Later scoped containment slices |

These are not failures of A2. They are deliberately outside public barrel containment.

## 10. Regression Risk Assessment

| Risk | Assessment |
|---|---|
| Broken public imports from `@/components/pulse` | Low; audit found only component consumers, not mock consumers |
| Broken public imports from `@/components/guru` | Low; audit found no active mock corpus consumers through the public barrel |
| Map fallback behavior changed | Low; `DEFAULT_CENTER` values are unchanged |
| UI/runtime behavior changed | Low; only import/export boundaries changed |
| Guardrail false positive | Low; guardrail passed after baseline shrink |
| Hidden cleanup wave | Not observed; mock files remain in place |

## 11. Recommended Next Slice

Recommended next slice:

```text
Stage 12I-A3 — Mock Env Guardrails
```

Goal:

```text
NEXT_PUBLIC_DATA_SOURCE=mock must not appear in smoke/prod evidence.
```

A3 should not be started from this A2 slice.

## 12. Final Verdict

Stage 12I-A2 completed as public barrel containment slice, not mock cleanup wave.

```text
stage_12I_A2_status: COMPLETE_AS_PUBLIC_BARREL_CONTAINMENT
stage_12I_A2_mock_cleanup_wave: false
stage_12I_A2_mock_quarantine_complete: false
stage_12I_A2_route_cleanup: false
stage_12I_A2_runtime_changes: false
stage_12I_A2_api_schema_changes: false
stage_12I_A2_ui_replacement: false
stage_12I_A2_public_launch_ready: false
pulse_public_mock_barrel_exports_removed: true
guru_public_mock_barrel_exports_removed: true
guardrail_baseline_shrunk: true
canon_status: aligned
```

