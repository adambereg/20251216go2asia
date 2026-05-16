# VIP Entitlement Runtime Authority - Shadow Identity Classification & Subject Binding Metadata v1

Date: 2026-05-15  
Status: `BOUNDED_SHADOW_IDENTITY_SUBJECT_BINDING_CLASSIFICATION_IMPLEMENTED`  
Slice: `VIP Entitlement Runtime Authority / Phase G / Slice G5`  
Mode: bounded shadow identity classification slice, subject-binding metadata only, non-authoritative diagnostics metadata only, no identity enforcement runtime, no enforcement runtime, no replay runtime, no fail-closed runtime, no authority switch, no rollout, no approval

## 1. Executive Summary

**FACT:** Slice G5 implements bounded shadow identity classification and subject-binding metadata for future identity/replay/runtime domains.

**FACT:** Slice G5 builds on G1 shared contracts, G2 lifecycle/policy semantics, G3 freshness/TTL shadow metadata, and G4 source authenticity/version shadow metadata.

**FACT:** Slice G5 does not implement entitlement enforcement runtime.

**FACT:** Slice G5 does not implement identity enforcement runtime.

**FACT:** Slice G5 does not implement fail-closed runtime behavior.

**FACT:** Slice G5 does not implement replay/idempotency runtime.

**FACT:** Slice G5 does not invalidate cache or replay state.

**FACT:** Slice G5 does not activate gates.

**FACT:** Slice G5 does not switch runtime authority.

**FACT:** Slice G5 does not change RF paid claim allow/deny behavior.

**FACT:** Slice G5 does not change production routing or production config.

**FACT:** Slice G5 does not trigger Slice 16.

**FACT:** Slice G5 does not approve enforcement.

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
- `docs/architecture/domain/vip_entitlement_source_authenticity_version_runtime_classification_v1.md`

Primary Phase F inputs:

- `docs/architecture/domain/vip_entitlement_runtime_implementation_order_plan_v1.md`
- `docs/architecture/domain/vip_entitlement_runtime_rollback_safety_design_v1.md`
- `docs/architecture/domain/vip_entitlement_runtime_evidence_requirements_matrix_v1.md`
- `docs/architecture/domain/vip_entitlement_phase_f_closure_review_v1.md`

Identity and RF runtime inputs:

- `packages/identity-core/src/types.ts`
- `packages/identity-core/src/normalize.ts`
- `apps/rf-service/src/store.ts`
- `apps/rf-service/src/routes/rf.ts`
- `apps/rf-service/src/vipEntitlementShadow.ts`
- `apps/rf-service/src/middleware/auth.ts`

## 3. G1/G2/G3/G4 Dependency Check

G1/G2/G3/G4 dependency status:

```text
g1_g2_g3_g4_dependency_status: verified
```

Verified dependencies:

- package `@go2asia/vip-entitlement-runtime-contracts`;
- G1 runtime taxonomy labels including `identity_enforcement`, authority mode labels, diagnostics mode labels, F5 result classes, execution statuses, and evidence statuses;
- G2 lifecycle/policy labels and pure helpers;
- G3 freshness helper `classifyRuntimeFreshness` and `sourceRead.freshness`;
- G4 source helper `classifyRuntimeSourceAuthenticityVersion` and `sourceRead.sourceClassification`;
- RF principal handling through `GatewayPrincipal`;
- VIP role gate helper still based on `vip_spacer`;
- existing diagnostics-safe observation boundary.

No G1/G2/G3/G4 blocker was found.

## 4. Purpose of G5

G5 adds bounded shadow identity classification and subject-binding metadata that can describe trusted subject signals, RF principal alignment, entitlement subject ambiguity, cross-account ambiguity, and identity downgrade indicators without changing runtime behavior.

Implemented G5 capabilities:

- classify subject trust as `trusted_subject`, `untrusted_subject`, `subject_unknown`, `subject_binding_missing`, `subject_binding_inconsistent`, or `unsupported_without_runtime_change`;
- classify subject relation as `rf_principal_matches_subject`, `rf_principal_mismatch`, `entitlement_subject_missing`, `entitlement_subject_unknown`, `cross_account_ambiguity`, `identity_downgrade_detected`, or `unsupported_without_runtime_change`;
- classify identity source as `identity_source_current`, `identity_source_unknown`, `identity_source_inconsistent`, `identity_source_degraded`, or `unsupported_without_runtime_change`;
- attach subject-binding metadata to the existing RF entitlement shadow observation;
- align the metadata with G1/G2/G3/G4/F5 labels, especially the F5 `ID` validation family;
- keep the classification in non-authoritative diagnostics-safe form.

## 5. G5 Non-Goals

G5 does not:

- make runtime allow/deny decisions;
- block RF paid claims;
- create fail-closed behavior;
- implement identity enforcement runtime;
- implement replay/idempotency runtime;
- invalidate replay records;
- invalidate cache records;
- change entitlement behavior;
- change identity authority;
- change production routing;
- activate feature gates;
- switch authority from the legacy `vip_spacer` role gate;
- promote diagnostics to authority;
- collect approval-grade runtime evidence;
- approve enforcement;
- trigger Slice 16.

Required invariants remain:

```text
identity_classification != authority
subject_binding != enforcement
identity_runtime != allow_deny
diagnostics != authority
runtime != approval
implementation != rollout
legacy_vip_spacer_still_authoritative
non_authoritative_observability_only
slice_16_status: blocked_not_triggered
enforcement_approval_status: not_approved
```

## 6. Subject Trust Taxonomy

G5 adds shared subject trust taxonomy to `@go2asia/vip-entitlement-runtime-contracts`.

Implemented subject trust classes:

- `trusted_subject`
- `untrusted_subject`
- `subject_unknown`
- `subject_binding_missing`
- `subject_binding_inconsistent`
- `unsupported_without_runtime_change`

The taxonomy is descriptive only. `trusted_subject` in G5 means the shadow classifier observed a safe subject signal in the bounded shadow context. It does not mean identity enforcement is approved, grant eligibility is proven, replay is bound, or authority can transition.

## 7. Subject Relation Taxonomy

Implemented subject relation classes:

- `rf_principal_matches_subject`
- `rf_principal_mismatch`
- `entitlement_subject_missing`
- `entitlement_subject_unknown`
- `cross_account_ambiguity`
- `identity_downgrade_detected`
- `unsupported_without_runtime_change`

Implemented identity source classes:

- `identity_source_current`
- `identity_source_unknown`
- `identity_source_inconsistent`
- `identity_source_degraded`
- `unsupported_without_runtime_change`

These classes align with F5 identity evidence requirements:

- `ID-01`: missing trusted subject;
- `ID-02..ID-04`: trusted subject mismatch, RF principal mismatch, and source subject mismatch;
- `ID-05`: identity downgrade impact on replay/cache/source-derived grant semantics;
- `SEC-IDENTITY-01`: identity downgrade abuse and subject mismatch abuse.

G5 classifies these states only as shadow metadata.

## 8. Shadow Identity Classification Flow

G5 uses the existing RF entitlement shadow path:

```text
RF paid claim request
-> legacy vip_spacer role gate remains authoritative
-> optional entitlement shadow comparison
-> safe principal-derived identity context
-> G5 subject-binding classification metadata
-> optional shadow_read_only source read
-> G3 freshness metadata
-> G4 source authenticity/version metadata
-> aggregate-safe shadow observation
```

The safest insertion point is `apps/rf-service/src/vipEntitlementShadow.ts`, inside `compareVipEntitlementShadow`, where shadow observation metadata is already built.

The new metadata is nested under top-level `subjectBinding` and includes:

- `runtimeDomainLabel`;
- `subjectTrustClass`;
- `subjectRelationClass`;
- `identitySourceClass`;
- `identityClassificationReason`;
- `principalTypeLabel`;
- `subjectBindingLabel`;
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

- record aggregate-safe subject-binding metadata;
- expose safe shadow observation fields;
- support future identity evidence planning;
- classify missing subject, subject mismatch, identity downgrade, cross-account ambiguity, and unknown subject binding states for review.

Diagnostics may not:

- become authority;
- block a claim;
- override the legacy role gate;
- decide eligibility;
- activate fail-closed behavior;
- invalidate replay/cache state;
- become a production routing input.

G5 preserves aggregate-only safety by keeping raw user identifiers, correlation IDs, subject IDs, source refs, raw roles, raw JWTs, auth tokens, emails, sessions, payment identifiers, vouchers, receipts, and transaction identifiers out of shadow diagnostics snapshots.

## 10. Runtime Boundary

Active runtime behavior remains unchanged:

- RF paid claim allow/deny behavior is still governed by the existing role gate;
- `vip_spacer` role authority remains unchanged;
- subject-binding classification remains diagnostic metadata;
- subject-binding classification does not modify `driftClass` or `canonicalDriftClass`;
- subject-binding classification does not modify `isVipEntitlementSourceReadEnforcementCapable`;
- durable diagnostics keep their existing aggregate allow-list and are not extended with new SQL columns;
- no cache invalidation, replay invalidation, authority routing, identity authority change, or gate activation was added.

## 11. Security / Fraud Considerations

G5 explicitly classifies identity and subject-binding risk indicators:

- missing trusted subject signal;
- untrusted subject signal;
- unknown subject binding;
- RF principal mismatch;
- entitlement subject missing or unknown;
- cross-account ambiguity;
- identity downgrade signal;
- degraded or inconsistent identity source.

However, G5 does not act on these indicators. Future enforcement must still prove:

- identity enforcement independently of diagnostics;
- fail-closed behavior independent of diagnostics;
- RF principal and entitlement subject binding;
- replay/idempotency alignment;
- cache/source/lifecycle alignment;
- rollback safety;
- privacy-safe evidence collection;
- QA/security sign-off;
- explicit governance approval.

## 12. Tests Added

Added contracts tests:

- trusted matching subject classification;
- untrusted subject and missing subject binding classification;
- RF principal mismatch classification;
- cross-account ambiguity classification;
- identity downgrade classification;
- degraded/unknown identity source classification;
- unsupported identity runtime classification.

Added RF shadow tests:

- top-level subject-binding metadata for trusted subject, missing subject binding, cross-account ambiguity, and identity downgrade;
- non-authoritative authority/diagnostics labels;
- `validationCaseFamily: ID`;
- subject-binding metadata does not change entitlement shadow decision results;
- diagnostics fields remain aggregate-safe.

Regression checks executed:

- active role-denied paid claim remains denied when shadow entitlement would grant;
- active role-allowed paid claim remains allowed when shadow entitlement would deny;
- source-read adapter remains disabled unless `shadow_read_only` mode is enabled;
- durable diagnostics aggregate mapping remains unchanged.

## 13. Files Changed

Runtime contracts:

- `packages/vip-entitlement-runtime-contracts/src/index.ts`
- `packages/vip-entitlement-runtime-contracts/test/runtime-identity-subject-binding-semantics.test.mjs`

RF shadow runtime:

- `apps/rf-service/src/store.ts`
- `apps/rf-service/src/routes/rf.ts`
- `apps/rf-service/src/vipEntitlementShadow.ts`
- `apps/rf-service/test/vip-entitlement-shadow.test.ts`

Documentation:

- `docs/architecture/domain/vip_entitlement_shadow_identity_subject_binding_metadata_v1.md`

## 14. Recommended Next Slice

Recommended next slice:

```text
recommended_next_slice: phase_g_slice_g6_replay_runtime_entry_review_or_shadow_replay_metadata
```

This recommendation is not authorization.

The next slice should remain bounded and should first review whether the safer entry is:

- replay runtime entry review; or
- shadow replay metadata.

The next slice must not open authority transition, fail-closed runtime, production rollout, or Slice 16.

## 15. Acceptance Status

```text
g1_g2_g3_g4_dependency_verified: yes
bounded_shadow_identity_classification_implemented: yes
subject_classification_remains_non_authoritative: yes
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
slice_g5_status: bounded_shadow_identity_subject_binding_classification_implemented
phase_g_status: implementation_phase_in_progress_bounded_slices_only
g1_g2_g3_g4_dependency_status: verified
shadow_identity_classification_status: implemented_non_authoritative_shadow_classification_only
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
recommended_next_slice: phase_g_slice_g6_replay_runtime_entry_review_or_shadow_replay_metadata
```

**IMPORTANT:** Slice G5 implements bounded non-authoritative shadow identity classification and subject-binding metadata only. It does not approve enforcement, does not trigger Slice 16, does not implement enforcement runtime, does not implement identity enforcement runtime, does not implement replay runtime, does not implement fail-closed runtime, does not change runtime authority, does not promote diagnostics to authority, and does not change production behavior.
