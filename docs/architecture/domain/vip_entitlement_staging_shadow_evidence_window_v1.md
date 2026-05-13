# VIP Entitlement Runtime Authority — Staging Shadow Evidence Window v1

Date: 2026-05-13  
Status: `BLOCKED_MANUAL_EXECUTION_REQUIRED_WITH_LOCAL_REGRESSION_PROOF`  
Slice: `VIP Entitlement Runtime Authority / Slice 3`  
Mode: staging validation evidence window, shadow/read diagnostics only, no enforcement

## 1. Purpose

**TARGET:** Slice 3 validates the Slice 2 RF VIP entitlement source-read shadow path in staging before any enforcement readiness review.

This evidence window must prove:

- RF paid claim behavior remains unchanged;
- legacy `vip_spacer` remains runtime authority;
- Points spend behavior remains unchanged;
- wallet, Connect, Gateway and Auth behavior remain unchanged;
- diagnostics remain aggregate-safe;
- drift classes are understood;
- flags are rollback-able.

**FACT:** This artifact did not execute a live staging shadow window because Cloudflare/Wrangler authentication was not available from the current operator session.

**FACT:** Local RF regression proof was executed and passed for the Slice 2 shadow/read path.

**NON-GOAL:** This slice does not change runtime logic, enable enforcement, change production flags, add migrations, change public APIs, add billing/subscription integration, unlock referral/network rewards, or enable Points available-only spend enforcement.

## 2. Source Hierarchy

1. `docs/architecture/domain/vip_entitlement_runtime_authority_contract_lock_v1.md`
2. `docs/architecture/domain/vip_entitlement_source_read_adapter_contract_v1.md`
3. `docs/architecture/domain/vip_entitlement_shadow_read_model_evidence_v1.md`
4. `docs/architecture/domain/vip_entitlement_schema_decision_contract_v1.md`
5. `docs/architecture/domain/vip_entitlement_lifecycle_contract_v1.md`
6. `docs/architecture/domain/vip_entitlement_shadow_compare_slice_v1.md`
7. `docs/architecture/domain/economy_runtime_milestone_closure_rf_paid_spend_validation_v1.md`
8. `docs/architecture/domain/points_available_only_spend_enforcement_contract_v1.md`
9. `docs/ops/points_spendability_export_consumer_runbook_v1.md`
10. `docs/ops/environments.md`
11. `docs/ops/staging_services_overview.md`
12. Runtime references in `apps/rf-service`, `apps/points-service`, `apps/api-gateway`, `apps/auth-service`, and `packages/identity-core`.

If this document conflicts with Slice 0, Slice 1 or Slice 2, the earlier contract wins and this evidence artifact must be corrected.

## 3. Evidence Status

`evidence_status: blocked_manual_execution_required`

Reason:

- Wrangler CLI is installed and runnable.
- Cloudflare auth check failed with `Not logged in`.
- The current session cannot inspect staging Worker variables/secrets.
- The current session cannot enable staging-only RF shadow flags.
- The current session cannot access Cloudflare Workers logs/observability.
- The current session cannot call admin-only RF shadow diagnostics in staging.
- Operator-approved staging users/tokens were not available in this session.

Local validation status:

`local_regression_status: passed`

Slice 4 status:

`slice_4_review_status: no_go_until_staging_window_completed`

## 4. Repo / Runtime Context

**FACT:** Repo SHA at preflight time:

```text
6449eff
```

**FACT:** Current branch at preflight time:

```text
feat/vip-entitlement-runtime-authority-slices-0-1
```

**FACT:** RF staging config in `apps/rf-service/wrangler.toml` pins:

- `ENVIRONMENT=staging`;
- `RF_ENABLE_PAID_VOUCHER_SPEND=true`;
- `POINTS_SERVICE_URL=https://go2asia-points-service-staging.fred89059599296.workers.dev`.

**FACT:** Points staging config in `apps/points-service/wrangler.toml` pins spendability shadow/export flags:

- `POINTS_ENABLE_SPENDABILITY_SHADOW_COMPARE=true`;
- `POINTS_ENABLE_SPENDABILITY_SHADOW_DIAGNOSTICS=true`;
- `POINTS_ENABLE_SPENDABILITY_DURABLE_EXPORT=true`.

**FACT:** Slice 2 RF VIP entitlement source-read flags are not pinned in `wrangler.toml`. They must be enabled as staging-only server-side configuration by an operator.

## 5. Staging Access Preflight

| Check | Result | Evidence / Note |
|---|---|---|
| Wrangler CLI available | passed | `pnpm -C apps/rf-service exec wrangler --version` returned `4.64.0` |
| Cloudflare auth available | blocked | `pnpm -C apps/rf-service exec wrangler whoami` failed: `Not logged in` |
| Staging RF vars readable | blocked | requires Cloudflare auth |
| Staging logs readable | blocked | requires Cloudflare dashboard/Wrangler auth |
| RF shadow diagnostics endpoint callable | blocked | requires admin staging principal and service route access |
| Operator-approved VIP/non-VIP users available | blocked | no staging user tokens supplied in this session |
| Safe paid staging RF offer available | known from prior milestone, not revalidated | previous closure lists deterministic paid offers, but current session did not execute staging claim |
| Safe flag enablement approved | blocked | requires operator action |

**BLOCKED:** No live staging behavior claim is made by this document.

## 6. Local Regression Evidence

Commands executed:

```powershell
pnpm -C apps/rf-service typecheck
pnpm -C apps/rf-service test -- test/vip-entitlement-shadow.test.ts test/request.test.ts
pnpm -C apps/rf-service lint
```

Results:

| Command | Result | Notes |
|---|---|---|
| `pnpm -C apps/rf-service typecheck` | passed | `tsc --noEmit` completed |
| `pnpm -C apps/rf-service test -- test/vip-entitlement-shadow.test.ts test/request.test.ts` | passed | `2 passed`, `102 tests passed` |
| `pnpm -C apps/rf-service lint` | passed with warnings | exit `0`; 3 pre-existing import/order warnings in unchanged files |

Warnings observed:

- `apps/rf-service/test/identity-core-golden-fixtures.test.ts`: import ordering warnings.
- `apps/rf-service/test/staging-config.test.ts`: import group warning.

Additional staging config check attempted:

```powershell
pnpm -C apps/rf-service test -- test/staging-config.test.ts
```

Result:

- the 2 staging config tests passed;
- command exit was non-zero because coverage thresholds are not meaningful for this narrow config-only test run.

This is recorded as a tooling caveat, not a staging runtime failure.

## 7. Local Invariants Proven

Local tests prove:

- source-read mode defaults to disabled;
- only `RF_ENTITLEMENT_SOURCE_READ_MODE=shadow_read_only` enables source-read evidence;
- source-read results are not enforcement-capable;
- mock, migration role shadow, stale, degraded, timeout, unavailable, and unknown scenarios cannot grant spend authority;
- non-VIP role-denied paid claim remains denied even when adapter evidence grants;
- VIP role-allowed paid claim remains allowed even when adapter evidence denies;
- Points spend call count remains unchanged in the covered RF paid claim cases;
- aggregate diagnostics omit forbidden fields;
- admin-only shadow diagnostics behavior remains covered locally.

## 8. Required Staging Flag Plan

Enable only in staging:

```text
RF_ENABLE_ENTITLEMENT_SHADOW_COMPARE=true
RF_ENABLE_ENTITLEMENT_SHADOW_DIAGNOSTICS=true
RF_ENTITLEMENT_SOURCE_READ_MODE=shadow_read_only
RF_ENTITLEMENT_SOURCE_READ_SCENARIO=<controlled scenario>
RF_ENTITLEMENT_SHADOW_SCENARIO=<controlled scenario if needed>
```

Rules:

- no production flag changes;
- no enforcement flag exists or may be introduced in Slice 3;
- flags must be server-side only;
- client payloads must not control adapter mode or scenario;
- run one controlled scenario at a time;
- record the exact Worker version/SHA and flag values before each run.

Rollback order:

1. Disable `RF_ENTITLEMENT_SOURCE_READ_MODE` or set it to `disabled`.
2. Disable `RF_ENABLE_ENTITLEMENT_SHADOW_DIAGNOSTICS`.
3. Disable `RF_ENABLE_ENTITLEMENT_SHADOW_COMPARE`.
4. Re-run baseline paid claim checks.
5. Confirm internal shadow diagnostics endpoint returns disabled/404 or stops accumulating source-read counters.

## 9. Staging Validation Matrix

| Case | Flag scenario | Actor | Expected RF behavior | Expected Points behavior | Expected canonical drift | Expected diagnostics |
|---|---|---|---|---|---|---|
| 1 | `role_mirror` | VIP | paid claim follows existing success path if Points spend succeeds | unchanged; one spend call for successful paid claim | `aligned_granted` | source read count increments |
| 2 | `deny` | VIP | paid claim still allowed if legacy role and Points pass | unchanged; one spend call | `role_granted_entitlement_denied` | disagreement count increments |
| 3 | `grant` | non-VIP | paid claim still denied by `RF_VIP_REQUIRED_FOR_PAID_VOUCHER` | no spend call | `role_denied_entitlement_granted` | disagreement count increments |
| 4 | `role_mirror` or `deny` | non-VIP | paid claim denied by legacy role gate | no spend call | `aligned_denied` | aligned denied count increments |
| 5 | `stale` | VIP and non-VIP | legacy behavior unchanged | unchanged | `stale_entitlement` | stale count and adapter status `stale` |
| 6 | `degraded` | VIP and non-VIP | legacy behavior unchanged | unchanged | `degraded_runtime` | degraded count and adapter status `degraded` |
| 7 | `source_timeout` | VIP and non-VIP | legacy behavior unchanged | unchanged | `unavailable_entitlement` | adapter status `timeout` |
| 8 | `source_unavailable` | VIP and non-VIP | legacy behavior unchanged | unchanged | `unavailable_entitlement` | adapter status `unavailable` |
| 9 | `unknown_source` | VIP and non-VIP | legacy behavior unchanged | unchanged | `unknown` | adapter status `unknown_source` |
| 10 | source-read disabled | VIP and non-VIP | legacy behavior only | unchanged | legacy shadow only if compare enabled | `sourceRead.total=0` |
| 11 | diagnostics disabled | admin/non-admin | claim behavior unchanged | unchanged | no diagnostics evidence required | internal endpoint disabled/404 |
| 12 | rollback disabled | VIP and non-VIP | legacy behavior only | unchanged | no new source-read evidence | rollback confirmed |

## 10. No-Behavior-Change Evidence Required From Operator

The staging operator must collect:

- response status/body for one non-VIP paid claim under adapter `grant`;
- response status/body for one VIP paid claim under adapter `deny`;
- Points spend call count or logs for both cases;
- voucher lifecycle/economy status for successful VIP paid claim;
- proof that no voucher is inserted for legacy-denied non-VIP paid claim;
- wallet response shape before/after the window;
- confirmation that Connect UI, Gateway/Auth claims and public APIs are unchanged;
- confirmation that diagnostics failure or diagnostics disabled state does not affect claim behavior.

No raw tokens, raw user ids, emails, raw payment data, transaction ids, or external ids should be copied into this evidence artifact.

## 11. Diagnostics Safety Checklist

Allowed diagnostics:

- drift class counts;
- canonical drift counts;
- safe reason code counts;
- source bucket counts;
- adapter status counts;
- stale/degraded counts;
- decision version counts;
- adapter version counts;
- audit trace coverage counts;
- redacted sample containing only `auditTraceId`, `decisionVersion`, `evaluatedAt`, source bucket/type bucket, adapter status/version and drift class.

Forbidden fields:

- raw JWT;
- `X-Gateway-Auth`;
- raw roles;
- raw user ids;
- emails/profile data;
- payment payloads;
- `sourceRef`;
- entitlement metadata;
- wallet ledger rows;
- transaction ids;
- external ids;
- raw correlation ids;
- raw dedupe keys;
- partner settlement data;
- G2A/NFT/Totem/on-chain proofs.

Required result:

`diagnostics_safety_status: blocked_until_staging_scan_completed`

## 12. Drift Summary

No live staging drift counts were collected in this session.

Current status:

```text
aligned_granted: not_collected
aligned_denied: not_collected
role_granted_entitlement_denied: not_collected
role_denied_entitlement_granted: not_collected
stale_entitlement: not_collected
unavailable_entitlement: not_collected
degraded_runtime: not_collected
unknown: not_collected
```

**BLOCKED:** Every non-aligned drift class must have an owner, explanation and remediation/no-go decision before Slice 4 review can proceed.

## 13. Stop Conditions

Stop staging validation and do not proceed to Slice 4 if:

- RF paid claim result changes compared with legacy `vip_spacer` behavior;
- source-read result is used as authority;
- Points spend call count, payload or order changes;
- wallet response shape changes;
- Connect UI changes;
- Gateway/Auth claims change;
- diagnostics leak forbidden fields;
- stale/degraded/unavailable/unknown/mock/migration source can grant spend;
- admin-only diagnostics are accessible to unauthenticated or non-admin principals;
- flags cannot be verified or rolled back;
- logs/observability are unavailable;
- paid staging claim cannot be safely executed.

## 14. Manual Operator Checklist

1. Confirm operator approval for staging-only validation.
2. Confirm current deployed RF Worker SHA/version.
3. Confirm current RF flag state.
4. Confirm admin token/principal for internal diagnostics endpoint.
5. Confirm one VIP staging user and one non-VIP staging user.
6. Confirm a safe paid staging RF offer.
7. Enable shadow compare and diagnostics in staging only.
8. Enable `RF_ENTITLEMENT_SOURCE_READ_MODE=shadow_read_only`.
9. Run the validation matrix one scenario at a time.
10. Capture safe aggregate diagnostics after each scenario.
11. Confirm Points spend count and voucher lifecycle evidence.
12. Scan diagnostics/logs for forbidden fields.
13. Disable source-read mode and confirm rollback behavior.
14. Disable diagnostics/compare if the window is complete.
15. Update this artifact with redacted evidence, drift summary and go/no-go recommendation.

## 15. Go / No-Go

Current decision:

`go_no_go_for_slice_4: no_go`

Reason:

- live staging window was not executed;
- staging flag state was not verified;
- staging logs/diagnostics were not collected;
- rollback was not verified in staging;
- drift counts were not collected;
- forbidden-field scan was not run against staging diagnostics/logs.

Slice 4 may only proceed to review after:

- staging evidence is collected;
- RF/Points behavior is unchanged;
- drift classes are collected and reviewed;
- diagnostics safety scan passes;
- rollback is verified;
- no enforcement is enabled;
- all blockers are closed or explicitly accepted by Runtime Governance, Security/Fraud and QA.

## 16. Final Status

`evidence_status: blocked_manual_execution_required`  
`local_regression_status: passed`  
`staging_access_status: blocked_cloudflare_not_logged_in`  
`staging_validation_status: not_executed`  
`diagnostics_safety_status: blocked_until_staging_scan_completed`  
`runtime_behavior_status: locally_unchanged_not_staging_validated`  
`enforcement_status: not_enabled`  
`slice_4_status: no_go_until_staging_evidence_collected`
