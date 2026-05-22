# Stage 12I-A3 — Mock Env Guardrails Report

Документ: `stage_12I_A3_mock_env_guardrails_v1.md`  
Статус: implementation report / mock env evidence containment evidence  
Дата: 2026-05-22  
Scope: mock environment and smoke/staging/production evidence guardrails  
Mode: targeted audit -> bounded env/evidence guardrail implementation -> validation -> report

## 0. Executive Summary

Stage 12I-A3 adds the missing env/evidence perimeter for mock mode.

A1 blocked uncontrolled mock imports. A2 removed Pulse/Guru public mock barrel propagation and shrank the baseline from 23 to 20 findings. A3 now prevents `NEXT_PUBLIC_DATA_SOURCE=mock` from being treated as smoke, staging, production or support-proof evidence.

Required statement:

```text
Stage 12I-A3 completed as mock env/evidence guardrail slice, not runtime behavior change.
```

A3 does not change `getDataSource()`, does not remove local mock mode, does not change runtime/API/schema/OpenAPI/SDK contracts, and does not claim public launch readiness.

## 1. Files Changed

| Path | Change type | Purpose |
|---|---|---|
| `scripts/mock_env_guardrails_check.mjs` | new guardrail script | Scans workflows, env/docs/scripts/evidence contexts for forbidden mock data-source usage |
| `package.json` | script update | Adds `guardrails:mock-env:check` |
| `.github/workflows/ci.yml` | CI update | Adds lightweight `Mock Env Guardrails` job without dependency install |
| `apps/go2asia-pwa-shell/mocks/README.md` | docs-only warning | Fixes contradictory default and marks mock mode as dev/demo only |
| `docs/ops/content_data_flow.md` | docs-only warning | Removes mock fallback proof wording and requires API/runtime mode for evidence |
| `docs/reports/stage_12I_A3_mock_env_guardrails_v1.md` | new report | Evidence, validation, remaining gaps and handoff |

No runtime files were changed.

## 2. Env / Evidence Policy

Policy:

```text
mock_mode = local_dev_demo_only
mock_mode != smoke_evidence
mock_mode != staging_evidence
mock_mode != production_evidence
mock_mode != support_proof
```

Allowed:

- local dev/demo references to mock mode;
- UI warning copy that labels mock mode;
- architecture/canon/report references that explicitly state mock is invalid for evidence;
- local `.env.local` usage for developer demo flows.

Forbidden:

- `NEXT_PUBLIC_DATA_SOURCE=mock` in GitHub workflows;
- `NEXT_PUBLIC_DATA_SOURCE=mock` in smoke/staging/production evidence artifacts;
- active shared env examples setting mock as default;
- smoke/deploy/evidence scripts or runbooks using mock mode without an explicit invalid-for-evidence warning;
- any claim that mock mode proves readiness, support proof or production behavior.

## 3. Guardrail Rules

Command:

```text
pnpm guardrails:mock-env:check
```

Direct Node equivalent:

```text
node scripts/mock_env_guardrails_check.mjs
```

Rule classes:

| Rule ID | Level | Meaning |
|---|---|---|
| `MOCK_ENV_IN_WORKFLOW` | error | GitHub workflows must not set mock data source for CI/staging/prod/smoke evidence |
| `MOCK_ENV_IN_EVIDENCE_ARTIFACT` | error | Evidence artifacts must not terminate at mock data source |
| `MOCK_ENV_AS_ENV_DEFAULT` | error | Shared env examples must not set mock as active default |
| `MOCK_ENV_IN_EVIDENCE_CONTEXT` | error | Smoke/staging/prod/evidence context uses mock without explicit rejection warning |
| `MOCK_ENV_POLICY_REFERENCE` | warn | Allowed policy reference with explicit not-smoke/not-proof warning |
| `MOCK_ENV_DEV_DEMO_REFERENCE` | warn | Allowed dev/demo or UI warning reference |
| `MOCK_ENV_REFERENCE_REVIEW` | warn | Non-blocking reference requiring review if it becomes evidence-related |

Diagnostics include:

- `file:line`;
- matched line;
- rule ID;
- remediation hint.

## 4. Allowed vs Forbidden Paths

| Path class | Policy |
|---|---|
| `.github/workflows/**` | Forbidden to set `NEXT_PUBLIC_DATA_SOURCE=mock` |
| `test-results/staging/**` | Forbidden as smoke/staging evidence |
| `test-results/production/**` | Forbidden as production evidence |
| `test-results/manual/**` | Forbidden as manual smoke evidence |
| shared `.env*` examples | Must not set mock as active default |
| local `.env.local` files | Allowed as local dev/demo; not evidence |
| `scripts/**` smoke/deploy/evidence contexts | Forbidden unless explicit invalid-for-evidence warning |
| `docs/ops/**`, `docs/runbooks/**`, `docs/runtime/**` | Must not present mock as evidence/readiness |
| `docs/architecture/**`, `docs/ai/**`, `docs/reports/**` | Allowed policy/canon references when they reject mock-as-proof |
| `apps/go2asia-pwa-shell/mocks/**` | Allowed dev/demo documentation |
| UI copy warning about mock mode | Allowed if it labels mock as mock |

## 5. CI Enforcement

New CI job:

```text
job: mock-env-guardrails
name: Mock Env Guardrails
command: node scripts/mock_env_guardrails_check.mjs
install_required: false
timeout: 2 minutes
```

The job mirrors the A1 mock import guardrail pattern: checkout, setup Node 20, run a fast script without `pnpm install`.

The job is intentionally separate from lint/typecheck because it enforces governance policy, not TypeScript syntax.

## 6. Targeted Audit Summary

Audit findings:

| Area | Finding | A3 outcome |
|---|---|---|
| `getDataSource()` | Defaults to `api`; returns `mock` only for explicit env value | Unchanged |
| env examples | No active `NEXT_PUBLIC_DATA_SOURCE=mock` defaults found | Guarded |
| workflows | No workflow currently sets `NEXT_PUBLIC_DATA_SOURCE=mock` | Guarded by CI job |
| smoke/deploy scripts | No current mock data-source env injection found | Guarded |
| `apps/go2asia-pwa-shell/mocks/README.md` | Contradictory default wording (`api` and `mock`) | Fixed docs-only |
| `docs/ops/content_data_flow.md` | Stale fallback wording could imply mock fallback evidence | Fixed docs-only |
| Stage 12 canon | Already states mock env invalidates smoke evidence | Preserved |

## 7. Validation Results

| Command | Result | Notes |
|---|---|---|
| `pnpm guardrails:mock-env:check` | Passed | 24 allowed policy/dev-demo references, 0 forbidden findings |
| `pnpm guardrails:mock-imports:check` | Passed | Existing baseline remains 20 allowed findings |
| `pnpm -C apps/go2asia-pwa-shell typecheck` | Passed | `tsc --noEmit` |
| `pnpm -C apps/go2asia-pwa-shell lint` | Passed | Existing lint gate green |
| `pnpm -C apps/go2asia-pwa-shell test` | Passed | 16 files, 98 tests |
| IDE lints for touched files | Passed | No linter errors found |

## 8. Runtime Governance Statement

A3 is an env/evidence guardrail slice.

It did not change:

- `apps/go2asia-pwa-shell/mocks/dto.ts`;
- `getDataSource()`;
- data source defaults;
- app route behavior;
- API/OpenAPI/SDK/schema;
- projection metadata;
- UI rendering behavior;
- mock corpora.

Mock mode remains available for local developer demo and UI verification. It is now guarded against being used as smoke/staging/production/support-proof evidence.

## 9. Remaining Known Gaps

A3 intentionally leaves these gaps open:

| Gap | Owner / next slice |
|---|---|
| Home authenticated fake stats/rewards | Stage 12I-B1 — Home Auth Replacement |
| Route-level mock imports in Pulse/Quest/Rielt/Atlas | Later mock quarantine/replacement slices |
| RF PRO legacy route mock exposure | Stage 12I-B2 — RF PRO Legacy Route Quarantine |
| Quest complete mock route | Stage 12I-B3 — Quest Complete Cleanup |
| Support-safe owner lookup runtime | Future runtime/support proof slice |
| Projection metadata runtime envelope | Future API/runtime metadata slice |

These are not A3 failures. A3 is env/evidence containment only.

## 10. Recommended Next Slice

Recommended next slice:

```text
Stage 12I-B1 — Home Auth Replacement
```

Goal:

```text
Replace fake authenticated Home stats/rewards with truthful empty, deferred or runtime-backed state.
```

B1 should not be started from this A3 slice.

## 11. Final Verdict

Stage 12I-A3 completed as mock env/evidence guardrail slice, not runtime behavior change.

```text
stage_12I_A3_status: COMPLETE_AS_MOCK_ENV_EVIDENCE_GUARDRAILS
stage_12I_A3_runtime_changes: false
stage_12I_A3_getDataSource_changed: false
stage_12I_A3_mock_mode_removed: false
stage_12I_A3_local_demo_broken: false
stage_12I_A3_api_schema_changes: false
stage_12I_A3_ui_replacement: false
stage_12I_A3_public_launch_ready: false
mock_env_evidence_guardrail_active: true
mock_mode_allowed_for_dev_demo_only: true
mock_mode_invalid_for_smoke_prod_evidence: true
canon_status: aligned
```

