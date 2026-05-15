# VIP Entitlement Runtime Authority - Runtime Freshness / TTL Guard Shadow Mode v1

Date: 2026-05-15  
Status: `BOUNDED_RUNTIME_FRESHNESS_SHADOW_MODE_IMPLEMENTED`  
Slice: `VIP Entitlement Runtime Authority / Phase G / Slice G3`  
Mode: bounded runtime-oriented implementation slice, shadow-only freshness and TTL classification, non-authoritative diagnostics metadata only, no enforcement runtime, no replay runtime, no fail-closed runtime, no authority switch, no rollout, no approval

## 1. Executive Summary

**FACT:** Slice G3 implements bounded runtime freshness / TTL classification behind the existing non-authoritative RF entitlement shadow path.

**FACT:** Slice G3 uses G1/G2 runtime contracts and lifecycle/policy semantics as shared taxonomy only.

**FACT:** Slice G3 does not implement entitlement enforcement runtime.

**FACT:** Slice G3 does not implement fail-closed runtime behavior.

**FACT:** Slice G3 does not implement replay/idempotency runtime.

**FACT:** Slice G3 does not invalidate caches or replay state.

**FACT:** Slice G3 does not activate gates.

**FACT:** Slice G3 does not switch runtime authority.

**FACT:** Slice G3 does not change RF paid claim allow/deny behavior.

**FACT:** Slice G3 does not change production routing or production config.

**FACT:** Slice G3 does not trigger Slice 16.

**FACT:** Slice G3 does not approve enforcement.

Current authority remains:

```text
authority_runtime_status: legacy_vip_spacer_still_authoritative
```

Durable diagnostics remain:

```text
diagnostics_sink_authority_status: non_authoritative_observability_only
```

## 2. Input Context

Primary Phase G inputs:

- `docs/architecture/domain/vip_entitlement_runtime_implementation_entry_review_v1.md`
- `docs/architecture/domain/vip_entitlement_foundations_shared_runtime_contracts_v1.md`
- `docs/architecture/domain/vip_entitlement_lifecycle_policy_semantics_closure_v1.md`

Primary Phase F inputs:

- `docs/architecture/domain/vip_entitlement_runtime_implementation_order_plan_v1.md`
- `docs/architecture/domain/vip_entitlement_runtime_rollback_safety_design_v1.md`
- `docs/architecture/domain/vip_entitlement_runtime_evidence_requirements_matrix_v1.md`
- `docs/architecture/domain/vip_entitlement_phase_f_closure_review_v1.md`

Freshness and lifecycle inputs:

- `docs/architecture/domain/vip_entitlement_ttl_cache_governance_policy_v1.md`
- `docs/architecture/domain/vip_entitlement_lifecycle_contract_v1.md`

Code context:

- `packages/vip-entitlement-runtime-contracts/src/index.ts`
- `apps/rf-service/src/vipEntitlementShadow.ts`
- `apps/rf-service/src/routes/rf.ts`
- `apps/rf-service/src/durableDiagnostics/vipEntitlementDurableDiagnostics.ts`

## 3. G1/G2 Dependency Check

G1/G2 dependency status:

```text
g1_g2_dependency_status: verified
```

Verified G1/G2 elements:

- package `@go2asia/vip-entitlement-runtime-contracts`;
- runtime taxonomy labels including `ttl_cache_freshness`, authority mode labels, diagnostics mode labels, F5 result classes, execution statuses, and evidence statuses;
- lifecycle labels including `active`, `expired`, `revoked`, `grace`, `pending`, `source_unavailable`, `source_inconsistent`, and `unsupported_without_runtime_change`;
- policy labels including `policy_version_current`, `policy_version_changed`, `policy_version_unknown`, and policy applicability labels;
- lifecycle/policy pure helpers including lifecycle classification and policy applicability classification.

No G1/G2 blocker was found.

## 4. Purpose of G3

G3 adds a bounded runtime freshness classification layer that can describe shadow source-read freshness without changing runtime behavior.

Implemented G3 capabilities:

- classify freshness as `fresh`, `stale`, `degraded`, `source_unavailable`, `source_timeout`, `source_inconsistent`, `unknown_freshness`, `cache_read_failure`, `policy_version_mismatch`, or `unsupported_without_runtime_change`;
- classify source age into safe buckets only;
- attach freshness metadata to the existing RF entitlement shadow `sourceRead` observation;
- align the metadata with G1/G2/F5 labels;
- keep the classification in non-authoritative diagnostics-safe form.

## 5. G3 Non-Goals

G3 does not:

- make runtime allow/deny decisions;
- block RF paid claims;
- create fail-closed behavior;
- implement replay/idempotency runtime;
- invalidate replay records;
- invalidate cache records;
- change entitlement behavior;
- change production routing;
- activate feature gates;
- switch authority from the legacy `vip_spacer` role gate;
- promote diagnostics to authority;
- collect approval-grade runtime evidence;
- approve enforcement;
- trigger Slice 16.

Required invariants remain:

```text
shadow_runtime != enforcement
freshness_classification != runtime_decision
ttl_guard != allow_deny
diagnostics != authority
runtime != approval
implementation != rollout
legacy_vip_spacer_still_authoritative
non_authoritative_observability_only
slice_16_status: blocked_not_triggered
enforcement_approval_status: not_approved
```

## 6. Runtime Freshness Taxonomy

G3 adds shared freshness taxonomy to `@go2asia/vip-entitlement-runtime-contracts`.

Implemented freshness classes:

- `fresh`
- `stale`
- `degraded`
- `source_unavailable`
- `source_timeout`
- `source_inconsistent`
- `unknown_freshness`
- `cache_read_failure`
- `policy_version_mismatch`
- `unsupported_without_runtime_change`

The taxonomy is descriptive only. It does not define grant eligibility and does not implement the future mandatory fail-closed policies described by the TTL/cache governance document.

## 7. Shadow Freshness Runtime Flow

G3 uses the existing RF entitlement shadow source-read path:

```text
RF paid claim request
-> legacy vip_spacer role gate remains authoritative
-> optional entitlement shadow comparison
-> optional shadow_read_only source read
-> source-read result
-> freshness classification metadata
-> aggregate-safe shadow observation
```

The safest insertion point is `apps/rf-service/src/vipEntitlementShadow.ts`, inside `compareVipEntitlementShadow`, where `sourceRead` observation metadata is already built.

The new metadata is nested under `sourceRead.freshness` and includes:

- `runtimeDomainLabel`;
- `freshnessClassification`;
- `freshnessReason`;
- `freshnessAgeBucket`;
- `sourceFresh`;
- `degraded`;
- `policyVersionLabel`;
- `lifecycleStateLabel`;
- `authorityModeLabel`;
- `diagnosticsModeLabel`;
- `expectedResultClass`;
- `actualResultClass`;
- `executionStatus`;
- `evidenceStatus`.

These fields are not read by the paid claim decision path.

## 8. Diagnostics Boundary

Diagnostics may:

- record aggregate-safe freshness metadata;
- expose safe shadow observation fields;
- support future evidence planning;
- classify stale/degraded/unknown/source failure states for review.

Diagnostics may not:

- become authority;
- block a claim;
- override the legacy role gate;
- decide eligibility;
- activate fail-closed behavior;
- become a production routing input.

G3 preserves aggregate-only safety by keeping raw user identifiers, correlation IDs, source refs, payment identifiers, vouchers, receipts, and transaction identifiers out of shadow diagnostics snapshots.

## 9. Runtime Boundary

Active runtime behavior remains unchanged:

- RF paid claim allow/deny behavior is still governed by the existing role gate;
- `vip_spacer` role authority remains unchanged;
- `RF_ENABLE_ENTITLEMENT_SOURCE_READ_MODE` remains default-off unless explicitly set to `shadow_read_only`;
- source-read classification remains diagnostic metadata;
- durable diagnostics keep their existing aggregate allow-list and are not extended with new SQL columns;
- no cache invalidation, replay invalidation, authority routing, or gate activation was added.

## 10. Security / Fraud Considerations

G3 explicitly classifies stale and ambiguous freshness states because stale grants, stale cache, degraded source reads, source timeout, source unavailability, and policy version mismatch are fraud and abuse risk indicators.

However, G3 does not act on these indicators. Future enforcement must still prove:

- fail-closed behavior independent of diagnostics;
- source authenticity and version compatibility;
- lifecycle-bound TTL behavior;
- replay/idempotency alignment;
- rollback safety;
- privacy-safe evidence collection;
- QA/security sign-off;
- explicit governance approval.

## 11. Tests Added

Added contracts tests:

- fresh source metadata classification;
- stale cache classification;
- degraded/source unavailable/source timeout/source inconsistent classification;
- unknown freshness classification;
- cache read failure classification;
- policy version mismatch classification;
- unsupported runtime classification.

Added RF shadow tests:

- source-read freshness metadata for `grant`, `stale`, `degraded`, `source_unavailable`, `source_timeout`, and `unknown_source`;
- non-authoritative authority/diagnostics labels;
- source-read freshness metadata does not make source-read enforcement-capable;
- diagnostics fields remain aggregate-safe.

Regression checks executed:

- active role-denied paid claim remains denied when shadow entitlement would grant;
- active role-allowed paid claim remains allowed when shadow entitlement would deny;
- source-read adapter remains disabled unless `shadow_read_only` mode is enabled;
- durable diagnostics aggregate mapping remains unchanged.

## 12. Files Changed

Runtime contracts:

- `packages/vip-entitlement-runtime-contracts/src/index.ts`
- `packages/vip-entitlement-runtime-contracts/test/runtime-freshness-semantics.test.mjs`

RF shadow runtime:

- `apps/rf-service/package.json`
- `apps/rf-service/src/vipEntitlementShadow.ts`
- `apps/rf-service/test/vip-entitlement-shadow.test.ts`

Package metadata:

- `pnpm-lock.yaml`

Documentation:

- `docs/architecture/domain/vip_entitlement_runtime_freshness_ttl_guard_shadow_mode_v1.md`

## 13. Recommended Next Slice

Recommended next slice:

```text
recommended_next_slice: phase_g_slice_g4_source_authenticity_version_runtime_or_identity_runtime_entry_review
```

This recommendation is not authorization.

The next slice should remain bounded and should first review whether the safer entry is:

- source authenticity and version runtime classification; or
- identity runtime entry review.

The next slice must not open authority transition, fail-closed runtime, replay runtime, production rollout, or Slice 16.

## 14. Acceptance Status

```text
g1_g2_dependency_verified: yes
bounded_freshness_shadow_runtime_implemented: yes
freshness_classification_remains_non_authoritative: yes
runtime_allow_deny_logic_added: no
authority_switch: no
diagnostics_authority_drift: no
replay_runtime_added: no
fail_closed_runtime_added: no
gate_activation_added: no
production_behavior_change: no
diagnostics_boundary_preserved: yes
tests_added: yes
docs_artifact_created: yes
implementation_summary_provided: yes
```

## 15. Final Classification

```text
slice_g3_status: bounded_runtime_freshness_shadow_mode_implemented
phase_g_status: implementation_phase_in_progress_bounded_slices_only
g1_g2_dependency_status: verified
runtime_freshness_shadow_status: implemented_non_authoritative_shadow_classification_only
runtime_implementation_status: shadow_runtime_only_no_runtime_enforcement
runtime_decision_behavior_status: unchanged
authority_runtime_status: legacy_vip_spacer_still_authoritative
diagnostics_sink_authority_status: non_authoritative_observability_only
enforcement_runtime_status: not_implemented
replay_runtime_status: not_implemented
fail_closed_runtime_status: not_implemented
slice_16_status: blocked_not_triggered
enforcement_approval_status: not_approved
production_status: not_touched
recommended_next_slice: phase_g_slice_g4_source_authenticity_version_runtime_or_identity_runtime_entry_review
```

**IMPORTANT:** Slice G3 implements bounded non-authoritative runtime freshness / TTL shadow classification only. It does not approve enforcement, does not trigger Slice 16, does not implement enforcement runtime, does not implement replay runtime, does not implement fail-closed runtime, does not change runtime authority, does not promote diagnostics to authority, and does not change production behavior.
