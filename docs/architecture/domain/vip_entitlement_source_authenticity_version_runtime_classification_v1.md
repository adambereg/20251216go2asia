# VIP Entitlement Runtime Authority - Source Authenticity / Version Runtime Classification v1

Date: 2026-05-15  
Status: `BOUNDED_SOURCE_AUTHENTICITY_VERSION_SHADOW_MODE_IMPLEMENTED`  
Slice: `VIP Entitlement Runtime Authority / Phase G / Slice G4`  
Mode: bounded runtime classification slice, shadow-only source authenticity/version classification, non-authoritative diagnostics metadata only, no enforcement runtime, no replay runtime, no fail-closed runtime, no authority switch, no rollout, no approval

## 1. Executive Summary

**FACT:** Slice G4 implements bounded source authenticity and source version classification behind the existing non-authoritative RF entitlement shadow path.

**FACT:** Slice G4 builds on G1 shared contracts, G2 lifecycle/policy semantics, and G3 freshness/TTL shadow metadata.

**FACT:** Slice G4 does not implement entitlement enforcement runtime.

**FACT:** Slice G4 does not implement fail-closed runtime behavior.

**FACT:** Slice G4 does not implement replay/idempotency runtime.

**FACT:** Slice G4 does not invalidate cache or replay state.

**FACT:** Slice G4 does not activate gates.

**FACT:** Slice G4 does not switch runtime authority.

**FACT:** Slice G4 does not change RF paid claim allow/deny behavior.

**FACT:** Slice G4 does not change production routing or production config.

**FACT:** Slice G4 does not trigger Slice 16.

**FACT:** Slice G4 does not approve enforcement.

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
- `docs/architecture/domain/vip_entitlement_runtime_freshness_ttl_guard_shadow_mode_v1.md`

Primary Phase F inputs:

- `docs/architecture/domain/vip_entitlement_runtime_implementation_order_plan_v1.md`
- `docs/architecture/domain/vip_entitlement_runtime_rollback_safety_design_v1.md`
- `docs/architecture/domain/vip_entitlement_runtime_evidence_requirements_matrix_v1.md`
- `docs/architecture/domain/vip_entitlement_phase_f_closure_review_v1.md`

Freshness, lifecycle, and source inputs:

- `docs/architecture/domain/vip_entitlement_ttl_cache_governance_policy_v1.md`
- `docs/architecture/domain/vip_entitlement_lifecycle_contract_v1.md`

Code context:

- `packages/vip-entitlement-runtime-contracts/src/index.ts`
- `apps/rf-service/src/vipEntitlementShadow.ts`
- `apps/rf-service/src/routes/rf.ts`
- `apps/rf-service/src/durableDiagnostics/vipEntitlementDurableDiagnostics.ts`

## 3. G1/G2/G3 Dependency Check

G1/G2/G3 dependency status:

```text
g1_g2_g3_dependency_status: verified
```

Verified dependencies:

- package `@go2asia/vip-entitlement-runtime-contracts`;
- G1 runtime taxonomy labels including `source_authenticity_version`, authority mode labels, diagnostics mode labels, F5 result classes, execution statuses, and evidence statuses;
- G2 lifecycle/policy labels and pure helpers;
- G3 freshness helper `classifyRuntimeFreshness`;
- G3 source-read freshness metadata under `sourceRead.freshness`;
- RF source-read shadow-only mode, default disabled unless `shadow_read_only`;
- existing diagnostics-safe observation boundary.

No G1/G2/G3 blocker was found.

## 4. Purpose of G4

G4 adds a bounded source authenticity/version classification layer that can describe source trust, adapter/source version compatibility, and malformed/degraded/inconsistent source states without changing runtime behavior.

Implemented G4 capabilities:

- classify source authenticity as `trusted_source`, `untrusted_source`, `source_auth_unknown`, `source_signature_missing`, `source_signature_invalid`, `source_adapter_unknown`, or `unsupported_without_runtime_change`;
- classify source version as `source_version_current`, `source_version_changed`, `source_version_unknown`, `source_version_incompatible`, `source_version_mismatch`, or `unsupported_without_runtime_change`;
- classify source consistency as `source_consistent`, `source_degraded`, `source_unavailable`, `source_timeout`, `source_inconsistent`, `source_malformed`, or `unsupported_without_runtime_change`;
- attach source classification metadata to the existing RF entitlement shadow `sourceRead` observation;
- align the metadata with G1/G2/G3/F5 labels, especially the F5 `SRC` validation family;
- keep the classification in non-authoritative diagnostics-safe form.

## 5. G4 Non-Goals

G4 does not:

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
source_classification != authority
source_authenticity != enforcement
source_version_check != allow_deny
diagnostics != authority
runtime != approval
implementation != rollout
legacy_vip_spacer_still_authoritative
non_authoritative_observability_only
slice_16_status: blocked_not_triggered
enforcement_approval_status: not_approved
```

## 6. Source Authenticity Taxonomy

G4 adds shared source authenticity taxonomy to `@go2asia/vip-entitlement-runtime-contracts`.

Implemented source authenticity classes:

- `trusted_source`
- `untrusted_source`
- `source_auth_unknown`
- `source_signature_missing`
- `source_signature_invalid`
- `source_adapter_unknown`
- `unsupported_without_runtime_change`

The taxonomy is descriptive only. `trusted_source` in G4 means a shadow classifier recognized a compatible source type and decision source pair. It does not mean the source is approved for enforcement, grant eligibility, authority transition, or production use.

## 7. Source Version Taxonomy

Implemented source version classes:

- `source_version_current`
- `source_version_changed`
- `source_version_unknown`
- `source_version_incompatible`
- `source_version_mismatch`
- `unsupported_without_runtime_change`

Implemented source consistency classes:

- `source_consistent`
- `source_degraded`
- `source_unavailable`
- `source_timeout`
- `source_inconsistent`
- `source_malformed`
- `unsupported_without_runtime_change`

These classes align with F5 source evidence requirements:

- `SRC-01..SRC-03`: unavailable, timeout, degraded source states;
- `SRC-04..SRC-06`: partial, malformed, inconsistent source responses;
- `SRC-07`: source authenticity mismatch and spoofing;
- `SRC-08..SRC-09`: rate/schema/version mismatch and downgrade ambiguity;
- `SEC-SOURCE-01`: source spoofing, schema downgrade, and degraded fallback abuse.

G4 classifies these states only as shadow metadata.

## 8. Shadow Source Classification Flow

G4 uses the existing RF entitlement shadow source-read path:

```text
RF paid claim request
-> legacy vip_spacer role gate remains authoritative
-> optional entitlement shadow comparison
-> optional shadow_read_only source read
-> source-read result
-> G3 freshness classification metadata
-> G4 source authenticity/version classification metadata
-> aggregate-safe shadow observation
```

The safest insertion point is `apps/rf-service/src/vipEntitlementShadow.ts`, inside `compareVipEntitlementShadow`, where `sourceRead` observation metadata is already built.

The new metadata is nested under `sourceRead.sourceClassification` and includes:

- `runtimeDomainLabel`;
- `sourceAuthenticityClass`;
- `sourceVersionClass`;
- `sourceClassificationReason`;
- `sourceVersionLabel`;
- `sourceAdapterLabel`;
- `sourceConsistencyClass`;
- `diagnosticsModeLabel`;
- `authorityModeLabel`;
- `expectedResultClass`;
- `actualResultClass`;
- `executionStatus`;
- `evidenceStatus`;
- `validationCaseFamily`.

These fields are not read by the paid claim decision path.

## 9. Diagnostics Boundary

Diagnostics may:

- record aggregate-safe source classification metadata;
- expose safe shadow observation fields;
- support future source evidence planning;
- classify source spoofing, malformed source, source inconsistency, source timeout, source unavailability, and version mismatch states for review.

Diagnostics may not:

- become authority;
- block a claim;
- override the legacy role gate;
- decide eligibility;
- activate fail-closed behavior;
- become a production routing input.

G4 preserves aggregate-only safety by keeping raw user identifiers, correlation IDs, source refs, source payloads, headers, signatures, tokens, secrets, payment identifiers, vouchers, receipts, and transaction identifiers out of shadow diagnostics snapshots.

## 10. Runtime Boundary

Active runtime behavior remains unchanged:

- RF paid claim allow/deny behavior is still governed by the existing role gate;
- `vip_spacer` role authority remains unchanged;
- `RF_ENABLE_ENTITLEMENT_SOURCE_READ_MODE` remains default-off unless explicitly set to `shadow_read_only`;
- source authenticity/version classification remains diagnostic metadata;
- source classification does not modify `driftClass` or `canonicalDriftClass`;
- source classification does not modify `isVipEntitlementSourceReadEnforcementCapable`;
- durable diagnostics keep their existing aggregate allow-list and are not extended with new SQL columns;
- no cache invalidation, replay invalidation, authority routing, or gate activation was added.

## 11. Security / Fraud Considerations

G4 explicitly classifies source spoofing and source downgrade risk indicators:

- unknown source adapter;
- missing or invalid source signature;
- untrusted source;
- source version mismatch;
- source version incompatibility;
- malformed source response;
- inconsistent source response;
- degraded, unavailable, or timed-out source.

However, G4 does not act on these indicators. Future enforcement must still prove:

- source authenticity independently of diagnostics;
- fail-closed behavior independent of diagnostics;
- schema/version compatibility;
- lifecycle-bound TTL behavior;
- replay/idempotency alignment;
- rollback safety;
- privacy-safe evidence collection;
- QA/security sign-off;
- explicit governance approval.

## 12. Tests Added

Added contracts tests:

- trusted/current source classification;
- untrusted source, missing signature, and invalid signature classification;
- source version mismatch, incompatible version, and unknown version classification;
- malformed, inconsistent, degraded, timeout, and unavailable source states;
- unsupported source runtime classification.

Added RF shadow tests:

- source classification metadata for `grant`, `stale`, `degraded`, `source_unavailable`, `source_timeout`, and `unknown_source`;
- non-authoritative authority/diagnostics labels;
- `validationCaseFamily: SRC`;
- source classification metadata does not make source-read enforcement-capable;
- diagnostics fields remain aggregate-safe.

Regression checks executed:

- active role-denied paid claim remains denied when shadow entitlement would grant;
- active role-allowed paid claim remains allowed when shadow entitlement would deny;
- source-read adapter remains disabled unless `shadow_read_only` mode is enabled;
- durable diagnostics aggregate mapping remains unchanged.

## 13. Files Changed

Runtime contracts:

- `packages/vip-entitlement-runtime-contracts/src/index.ts`
- `packages/vip-entitlement-runtime-contracts/test/runtime-source-authenticity-semantics.test.mjs`

RF shadow runtime:

- `apps/rf-service/src/vipEntitlementShadow.ts`
- `apps/rf-service/test/vip-entitlement-shadow.test.ts`

Documentation:

- `docs/architecture/domain/vip_entitlement_source_authenticity_version_runtime_classification_v1.md`

## 14. Recommended Next Slice

Recommended next slice:

```text
recommended_next_slice: phase_g_slice_g5_identity_runtime_entry_review_or_shadow_identity_classification
```

This recommendation is not authorization.

The next slice should remain bounded and should first review whether the safer entry is:

- identity runtime entry review; or
- shadow identity classification.

The next slice must not open authority transition, fail-closed runtime, replay runtime, production rollout, or Slice 16.

## 15. Acceptance Status

```text
g1_g2_g3_dependency_verified: yes
bounded_source_authenticity_version_shadow_runtime_implemented: yes
source_classification_remains_non_authoritative: yes
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

## 16. Final Classification

```text
slice_g4_status: bounded_source_authenticity_version_shadow_mode_implemented
phase_g_status: implementation_phase_in_progress_bounded_slices_only
g1_g2_g3_dependency_status: verified
source_authenticity_shadow_status: implemented_non_authoritative_shadow_classification_only
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
recommended_next_slice: phase_g_slice_g5_identity_runtime_entry_review_or_shadow_identity_classification
```

**IMPORTANT:** Slice G4 implements bounded non-authoritative source authenticity/version shadow classification only. It does not approve enforcement, does not trigger Slice 16, does not implement enforcement runtime, does not implement replay runtime, does not implement fail-closed runtime, does not change runtime authority, does not promote diagnostics to authority, and does not change production behavior.
