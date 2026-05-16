# VIP Entitlement Runtime Authority - Shadow Replay Idempotency Semantics v1

Date: 2026-05-15  
Status: `BOUNDED_SHADOW_REPLAY_IDEMPOTENCY_SEMANTICS_IMPLEMENTED`  
Slice: `VIP Entitlement Runtime Authority / Phase G / Slice G6`  
Mode: bounded shadow replay/idempotency semantics metadata only, non-authoritative diagnostics metadata only, no replay enforcement runtime, no replay invalidation runtime, no fail-closed runtime, no authority switch, no rollout, no approval

## 1. Executive Summary

**FACT:** Slice G6 implements bounded shadow replay/idempotency semantics metadata for future replay runtime domains.

**FACT:** Slice G6 builds on G1 shared contracts, G2 lifecycle/policy semantics, G3 freshness/TTL shadow metadata, G4 source authenticity/version shadow metadata, and G5 identity/subject-binding metadata.

**FACT:** Slice G6 adds RPL-aligned taxonomy labels and a pure replay/idempotency classifier to `@go2asia/vip-entitlement-runtime-contracts`.

**FACT:** Slice G6 attaches replay/idempotency semantics to the existing RF VIP entitlement shadow observation.

**FACT:** Slice G6 does not reject replay.

**FACT:** Slice G6 does not invalidate replay state, idempotency state, cache state, source state, or entitlement state.

**FACT:** Slice G6 does not implement replay enforcement runtime.

**FACT:** Slice G6 does not implement fail-closed runtime behavior.

**FACT:** Slice G6 does not activate gates.

**FACT:** Slice G6 does not switch runtime authority.

**FACT:** Slice G6 does not change RF paid claim allow/deny behavior.

**FACT:** Slice G6 does not change production routing or production config.

**FACT:** Slice G6 does not trigger Slice 16.

**FACT:** Slice G6 does not approve enforcement.

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

- `docs/architecture/domain/vip_entitlement_foundations_shared_runtime_contracts_v1.md`
- `docs/architecture/domain/vip_entitlement_lifecycle_policy_semantics_closure_v1.md`
- `docs/architecture/domain/vip_entitlement_runtime_freshness_ttl_guard_shadow_mode_v1.md`
- `docs/architecture/domain/vip_entitlement_source_authenticity_version_runtime_classification_v1.md`
- `docs/architecture/domain/vip_entitlement_shadow_identity_subject_binding_metadata_v1.md`

Primary Phase F inputs:

- `docs/architecture/domain/vip_entitlement_runtime_implementation_order_plan_v1.md`
- `docs/architecture/domain/vip_entitlement_runtime_rollback_safety_design_v1.md`
- `docs/architecture/domain/vip_entitlement_runtime_evidence_requirements_matrix_v1.md`
- `docs/architecture/domain/vip_entitlement_phase_f_closure_review_v1.md`

Runtime inputs reviewed:

- `packages/vip-entitlement-runtime-contracts/src/index.ts`
- `apps/rf-service/src/store.ts`
- `apps/rf-service/src/routes/rf.ts`
- `apps/rf-service/src/vipEntitlementShadow.ts`
- `apps/rf-service/test/request.test.ts`
- `apps/rf-service/test/vip-entitlement-shadow.test.ts`

## 3. G1-G5 Dependency Check

G1-G5 dependency status:

```text
g1_g2_g3_g4_g5_dependency_status: verified
```

Verified dependencies:

- package `@go2asia/vip-entitlement-runtime-contracts`;
- G1 runtime taxonomy labels including `replay_idempotency`, `diagnostics_observability`, authority mode labels, diagnostics mode labels, F5 result classes, execution statuses, evidence statuses, and `RPL` validation family;
- G2 lifecycle and policy version labels;
- G3 helper `classifyRuntimeFreshness` and `sourceRead.freshness`;
- G4 helper `classifyRuntimeSourceAuthenticityVersion` and `sourceRead.sourceClassification`;
- G5 helper `classifyRuntimeIdentitySubjectBinding` and top-level `subjectBinding`;
- RF shadow observation flow through `compareVipEntitlementShadow`;
- existing RF idempotency behavior in `claimVoucher` and `claimVoucherForListing`;
- existing diagnostics-safe snapshot boundary.

No G1-G5 dependency blocker was found.

## 4. Purpose of G6

G6 adds a bounded replay/idempotency semantics layer that can describe replay-related scenarios in safe, non-authoritative metadata.

Implemented G6 capabilities:

- classify `first_seen_operation`;
- classify `idempotent_retry`;
- classify `replay_detected`;
- classify `replay_ambiguity`;
- classify `stale_replay`;
- classify `replay_after_lifecycle_change`;
- classify `replay_after_source_change`;
- classify `replay_after_policy_change`;
- classify `replay_after_identity_downgrade`;
- classify `cross_subject_replay_ambiguity`;
- classify `unsupported_without_runtime_change`;
- classify payload, subject, source, lifecycle, policy, and identity replay relations as safe enum buckets;
- attach replay/idempotency metadata to RF VIP entitlement shadow observation;
- align replay semantics with F5 `RPL` taxonomy without claiming runtime enforcement evidence.

## 5. G6 Non-Goals

G6 does not:

- reject replay;
- invalidate replay records;
- invalidate idempotency records;
- invalidate cache records;
- block RF paid claims;
- make runtime allow/deny decisions;
- implement replay enforcement runtime;
- implement replay invalidation runtime;
- implement fail-closed behavior;
- switch runtime authority;
- activate gates;
- change production routing;
- change entitlement behavior;
- change `vip_spacer` authority;
- promote diagnostics to authority;
- approve enforcement;
- trigger Slice 16.

## 6. Replay / Idempotency Taxonomy

G6 introduces replay classification labels:

```text
first_seen_operation
idempotent_retry
replay_detected
replay_ambiguity
stale_replay
replay_after_lifecycle_change
replay_after_source_change
replay_after_policy_change
replay_after_identity_downgrade
cross_subject_replay_ambiguity
unsupported_without_runtime_change
```

G6 introduces idempotency relation labels:

```text
replay_payload_match
replay_payload_mismatch
replay_subject_match
replay_subject_mismatch
replay_source_match
replay_source_mismatch
replay_lifecycle_match
replay_lifecycle_mismatch
replay_policy_match
replay_policy_mismatch
replay_identity_match
replay_identity_mismatch
not_applicable
unsupported_without_runtime_change
```

G6 introduces replay source state labels:

```text
replay_source_current
replay_source_stale
replay_source_unknown
replay_source_inconsistent
unsupported_without_runtime_change
```

The taxonomy is intentionally descriptive. These labels do not create replay acceptance, replay rejection, replay invalidation, or conflict behavior.

## 7. Shadow Replay Classification Flow

The G6 classification flow is:

1. RF shadow comparison builds the existing G3/G4/G5 metadata.
2. `classifyVipEntitlementShadowSubjectBinding` creates identity/subject-binding metadata.
3. `classifyVipEntitlementShadowReplaySemantics` maps the shadow context into replay/idempotency-safe buckets.
4. `classifyRuntimeReplayIdempotency` returns a pure `RuntimeReplayIdempotencyClassification`.
5. `compareVipEntitlementShadow` attaches the result as `replaySemantics`.
6. Snapshot recording remains diagnostics-only and strips active allow/deny fields from `lastObservation`.

The default shadow path classifies first observation as:

```text
replayClassification: first_seen_operation
runtimeDomainLabel: replay_idempotency
validationCaseFamily: RPL
authorityModeLabel: shadow_only_observation
executionStatus: executed_observation_only
```

If a caller passes safe replay context to the shadow comparator, the same pure helper can classify retry, mismatch, stale replay, changed lifecycle/source/policy, identity downgrade, and cross-subject ambiguity.

## 8. Diagnostics Boundary

Diagnostics may:

- record safe enum buckets;
- publish safe aggregate snapshots;
- preserve the last safe shadow observation;
- support future Phase H evidence planning.

Diagnostics must not:

- decide replay acceptance;
- decide replay rejection;
- decide entitlement allow/deny;
- invalidate replay state;
- invalidate cache state;
- become source of runtime authority;
- become a gate condition;
- trigger fail-closed behavior.

G6 metadata deliberately avoids raw idempotency keys, raw request IDs, raw payloads, raw actor IDs, raw source payloads, transaction IDs, receipts, or payment data.

## 9. Runtime Boundary

The existing RF claim runtime behavior remains unchanged:

- `claimVoucher` still uses existing `getVoucherFromClaimIdempotency` lookup behavior;
- `claimVoucherForListing` still uses existing listing-scoped idempotency lookup behavior;
- `RF_IDEMPOTENCY_KEY_CONTEXT_MISMATCH` behavior is not changed;
- `idempotentReplay` response behavior is not changed;
- `vip_spacer` remains the active RF paid-claim authority gate;
- shadow metadata is not read back into claim execution;
- source-read enforcement capability remains non-authoritative and unused for allow/deny;
- durable diagnostics remains a sink, not authority.

Important limitation:

```text
partial_rf_claim_idempotency_treated_as_governance_grade_replay_runtime: blocked
```

Current RF idempotency is not a full replay runtime. G6 intentionally labels semantics for future RPL work without treating current RF idempotency as complete replay enforcement.

## 10. Security / Fraud Considerations

G6 adds explicit shadow vocabulary for fraud-relevant replay cases:

- stale replay after freshness/source drift;
- replay after lifecycle change;
- replay after policy version change;
- replay after identity downgrade;
- cross-subject replay ambiguity;
- replay payload mismatch;
- source mismatch and source inconsistency.

These cases remain `inconclusive` or `unsupported_without_runtime_change` when they represent risk. G6 does not convert risk classification into runtime denial. Future enforcement requires separate approval, evidence, gates, rollback design, and Phase H review.

## 11. Tests Added

Contracts tests added:

- `packages/vip-entitlement-runtime-contracts/test/runtime-replay-idempotency-semantics.test.mjs`

RF shadow tests extended:

- `apps/rf-service/test/vip-entitlement-shadow.test.ts`

Test coverage includes:

- first-seen operation classification;
- idempotent retry with matching payload;
- replay payload mismatch;
- replay after lifecycle change;
- replay after source change;
- replay after policy change;
- stale replay;
- replay after identity downgrade;
- cross-subject replay ambiguity;
- unsupported replay runtime classification;
- diagnostics-safe shadow metadata;
- unchanged shadow allow/deny outputs.

Tests do not assert replay enforcement, fail-closed behavior, replay invalidation, approval, or rollout.

## 12. Files Changed

Implementation files:

- `packages/vip-entitlement-runtime-contracts/src/index.ts`
- `apps/rf-service/src/vipEntitlementShadow.ts`

Test files:

- `packages/vip-entitlement-runtime-contracts/test/runtime-replay-idempotency-semantics.test.mjs`
- `apps/rf-service/test/vip-entitlement-shadow.test.ts`

Documentation files:

- `docs/architecture/domain/vip_entitlement_shadow_replay_idempotency_semantics_v1.md`

No production config file was changed.

No database schema file was changed.

No durable diagnostics SQL schema was changed.

## 13. Recommended Next Slice

Recommended next slice:

```text
recommended_next_slice: phase_g_slice_g7_replay_runtime_entry_review_or_fail_closed_precondition_review
```

G7 should be a bounded review or precondition slice before any replay runtime, fail-closed runtime, authority transition, or rollout work. It should explicitly decide whether the next implementation should remain shadow-only or move to a separately gated staging validation design.

## 14. Final Classification

```text
slice_g6_status: bounded_shadow_replay_idempotency_semantics_implemented
phase_g_status: implementation_phase_in_progress_bounded_slices_only
g1_g2_g3_g4_g5_dependency_status: verified
shadow_replay_semantics_status: implemented_non_authoritative_shadow_semantics_only
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
recommended_next_slice: phase_g_slice_g7_replay_runtime_entry_review_or_fail_closed_precondition_review
```

## 15. Final Classification - Acceptance Status

Acceptance criteria status:

```text
g1_g2_g3_g4_g5_dependency_verified: yes
bounded_shadow_replay_semantics_implemented: yes
replay_classification_non_authoritative: yes
replay_rejection_logic_added: no
authority_switch_added: no
diagnostics_authority_drift_added: no
replay_invalidation_added: no
fail_closed_runtime_added: no
gate_activation_added: no
production_behavior_changed: no
diagnostics_boundary_preserved: yes
tests_added: yes
docs_artifact_created: yes
implementation_summary_required: yes
```

Boundary conclusion:

```text
replay_classification != replay_enforcement
idempotency_semantics != allow_deny
shadow_replay != replay_runtime
diagnostics != authority
runtime != approval
implementation != rollout
```
