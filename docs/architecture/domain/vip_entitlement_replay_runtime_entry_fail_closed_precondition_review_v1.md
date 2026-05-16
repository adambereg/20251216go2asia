# VIP Entitlement Runtime Authority - Replay Runtime Entry / Fail-Closed Precondition Review v1

Date: 2026-05-15  
Status: `REVIEW_READY_REPLAY_RUNTIME_ENTRY_FAIL_CLOSED_PRECONDITION_REVIEW`  
Slice: `VIP Entitlement Runtime Authority / Phase G / Slice G7`  
Mode: bounded review-only slice, no runtime implementation, no replay runtime, no fail-closed runtime, no replay rejection, no cache/replay invalidation, no authority switch, no rollout, no approval

## 1. Executive Summary

**FACT:** Slice G7 is a review-only entry/precondition review.

**FACT:** Slice G7 does not implement replay runtime.

**FACT:** Slice G7 does not implement fail-closed runtime.

**FACT:** Slice G7 does not reject replay.

**FACT:** Slice G7 does not invalidate replay, idempotency, cache, source, lifecycle, policy, identity, or rollback state.

**FACT:** Slice G7 does not add allow/deny behavior.

**FACT:** Slice G7 does not change RF paid claim behavior.

**FACT:** Slice G7 does not activate gates.

**FACT:** Slice G7 does not switch runtime authority.

**FACT:** Slice G7 does not change production routing or production config.

**FACT:** Slice G7 does not trigger Slice 16.

**FACT:** Slice G7 does not approve enforcement.

G1-G6 created a complete enough shadow semantic graph to perform entry review:

```text
lifecycle/policy
freshness/TTL
source authenticity/version
identity/subject binding
replay/idempotency semantics
```

G7 conclusion:

```text
replay_runtime_readiness_status: not_authorized_pending_named_bounded_scope
fail_closed_runtime_readiness_status: not_ready_pending_precondition_design
recommended_next_slice: phase_g_slice_g8_fail_closed_preconditions_and_staging_envelope_design
```

This recommendation is not authorization.

## 2. Input Context

Primary G1-G6 artifacts reviewed:

- `docs/architecture/domain/vip_entitlement_foundations_shared_runtime_contracts_v1.md`
- `docs/architecture/domain/vip_entitlement_lifecycle_policy_semantics_closure_v1.md`
- `docs/architecture/domain/vip_entitlement_runtime_freshness_ttl_guard_shadow_mode_v1.md`
- `docs/architecture/domain/vip_entitlement_source_authenticity_version_runtime_classification_v1.md`
- `docs/architecture/domain/vip_entitlement_shadow_identity_subject_binding_metadata_v1.md`
- `docs/architecture/domain/vip_entitlement_shadow_replay_idempotency_semantics_v1.md`

Primary Phase F artifacts reviewed:

- `docs/architecture/domain/vip_entitlement_runtime_implementation_order_plan_v1.md`
- `docs/architecture/domain/vip_entitlement_runtime_rollback_safety_design_v1.md`
- `docs/architecture/domain/vip_entitlement_runtime_evidence_requirements_matrix_v1.md`
- `docs/architecture/domain/vip_entitlement_phase_f_closure_review_v1.md`

Runtime/code context reviewed without changes:

- `apps/rf-service/src/store.ts`
- `apps/rf-service/src/routes/rf.ts`
- `apps/rf-service/src/vipEntitlementShadow.ts`
- `packages/vip-entitlement-runtime-contracts/src/index.ts`
- `apps/rf-service/test/request.test.ts`
- `apps/rf-service/test/vip-entitlement-shadow.test.ts`

## 3. G1-G6 Status Review

G1 status:

```text
slice_g1_status: bounded_contracts_foundation_implemented_non_authoritative_no_enforcement
boundary_status: preserved
```

G1 provides shared runtime labels, authority mode labels, diagnostics mode labels, result/evidence/execution taxonomy, runtime domain labels, lifecycle/policy version vocabulary, and stop-condition vocabulary. It does not implement runtime decisions.

G2 status:

```text
slice_g2_status: bounded_lifecycle_policy_semantics_implemented_non_authoritative_no_enforcement
boundary_status: preserved
```

G2 provides lifecycle/policy semantic labels and pure helpers. It does not implement lifecycle enforcement, policy enforcement, replay runtime, or fail-closed behavior.

G3 status:

```text
slice_g3_status: bounded_runtime_freshness_shadow_mode_implemented
boundary_status: preserved
```

G3 adds non-authoritative freshness/TTL classification under `sourceRead.freshness`. It does not block stale, degraded, unavailable, unknown, cache failure, or policy mismatch states.

G4 status:

```text
slice_g4_status: bounded_source_authenticity_version_shadow_mode_implemented
boundary_status: preserved
```

G4 adds non-authoritative source authenticity/version classification under `sourceRead.sourceClassification`. It does not make source authenticity an enforcement gate.

G5 status:

```text
slice_g5_status: bounded_shadow_identity_subject_binding_classification_implemented
boundary_status: preserved
```

G5 adds non-authoritative identity/subject-binding classification as `subjectBinding`. It does not implement identity enforcement or subject-binding rejection.

G6 status:

```text
slice_g6_status: bounded_shadow_replay_idempotency_semantics_implemented
boundary_status: preserved
```

G6 adds non-authoritative replay/idempotency semantics as `replaySemantics`. It does not reject replay, invalidate state, or create replay runtime.

Overall G1-G6 review:

```text
g1_to_g6_status: completed_bounded_shadow_semantic_graph
shadow_semantic_graph_status: complete_for_entry_review_not_enforcement
active_rf_paid_claim_behavior_status: unchanged
replay_enforcement_status: not_implemented
fail_closed_runtime_status: not_implemented
authority_runtime_status: legacy_vip_spacer_still_authoritative
diagnostics_sink_authority_status: non_authoritative_observability_only
```

## 4. Current Runtime Replay / Idempotency Reality

Current RF claim runtime has partial idempotency behavior:

- `claimVoucher` checks existing claim idempotency by actor and `Idempotency-Key`;
- `claimVoucherForListing` checks existing listing-scoped claim idempotency by actor and `Idempotency-Key`;
- matching replay returns `idempotentReplay: true`;
- route responses use HTTP `200` for `idempotentReplay: true` and `201` for new successful claim responses;
- context mismatch returns `RF_IDEMPOTENCY_KEY_CONTEXT_MISMATCH`;
- repeat-policy barrier can return an existing voucher with `idempotentReplay: false`, `createdNewInstance: false`, and a `claimBlockReason`;
- paid claim authority remains the existing `vip_spacer` role gate;
- shadow comparison is wrapped so errors cannot affect claim behavior.

Current RF idempotency is not governance-grade replay runtime.

Important distinctions:

- exact same key plus same RF context is not the same as full payload replay validation;
- RF context mismatch is not a complete semantic replay mismatch model;
- repeat-policy barrier is not identical to idempotent retry;
- Points/economy idempotency is separate from RF entitlement replay semantics;
- current RF idempotency does not bind lifecycle, source, policy version, identity downgrade, authority mode, rollback epoch, or canonical entitlement state;
- G6 `replaySemantics` is not currently a runtime decision input.

Current G6 replay metadata reality:

- `VipEntitlementShadowObservation` includes `replaySemantics`;
- `compareVipEntitlementShadow` can accept a safe `replayContext`;
- current `createEntitlementShadowRuntime` does not pass actual RF idempotency/replay context into `compareVipEntitlementShadow`;
- the normal shadow path therefore primarily observes first-seen semantics or indirect source/identity/freshness signals;
- this is acceptable for G6 shadow semantics, but not enough for replay runtime.

## 5. Replay Runtime Readiness Review

Replay runtime readiness status:

```text
replay_runtime_readiness_status: not_authorized_pending_named_bounded_scope
```

Inputs already available:

- shared runtime taxonomy labels;
- `replay_idempotency` runtime domain label;
- `RPL` validation family;
- G2 lifecycle/policy labels;
- G3 freshness classes;
- G4 source authenticity/version classes;
- G5 identity/subject-binding classes;
- G6 replay/idempotency classification labels and pure helper;
- existing RF claim idempotency table and `idempotentReplay` response semantics.

Missing or incomplete domain signals:

- canonical payload match/mismatch model for RF claim replay;
- trusted subject binding from canonical entitlement source;
- authoritative lifecycle state for replay decisions;
- authoritative source freshness/source authenticity for replay decisions;
- policy version applied to replay eligibility;
- authority mode and rollback epoch attached to replay state;
- safe state model for delayed retry after lifecycle/source/policy/identity changes;
- named bounded enforcement scope;
- staging-only replay guard envelope;
- rollback path and post-rollback stale replay model;
- safe evidence execution window.

Scenario readiness:

- Exact replay: observable through current RF idempotency, but not yet governance-grade because payload/source/lifecycle/policy/identity/authority context is not bound.
- Legitimate retry: current RF can return `idempotentReplay: true`, but F5 requires proof that no claim, redeem, spend, voucher, reward, settlement, or entitlement side effect duplicates.
- Payload mismatch: current RF has context mismatch for offer/scope/listing, not complete payload mismatch.
- Subject mismatch: current RF idempotency is actor-scoped, but G5 subject binding is shadow metadata and not replay authority.
- Lifecycle changed replay: G2/G3 classify lifecycle/freshness, but runtime replay state is not invalidated by lifecycle changes.
- Source changed replay: G4 classifies source state, but replay acceptance is not bound to source state or source version.
- Policy changed replay: G2/G6 taxonomy exists, but policy version is not a replay authority input.
- Identity downgrade replay: G5/G6 can classify downgrade, but runtime replay is not invalidated by identity downgrade.
- Stale replay: G3/G6 can classify stale replay risk, but no runtime stale replay guard exists.
- Rollback/hybrid-state replay: F4/F5 define expectations; no rollback runtime or authority-mode replay scoping exists.

Stop conditions still active:

```text
partial_rf_claim_idempotency_treated_as_governance_grade_replay_runtime
replay_semantics_detached_from_identity_lifecycle_source_cache_policy_or_rollback
missing_safe_actors_or_fixtures
missing_staging_execution_window
missing_rollback_observation_path
unclear_authority_boundary
validation_evidence_claimed_without_executed_runtime_behavior
unsupported_runtime_cases_counted_as_passed
```

Replay runtime conclusion:

```text
bounded_replay_runtime_implementation_status: premature
```

The next slice should not implement replay rejection or replay invalidation.

## 6. Fail-Closed Runtime Readiness Review

Fail-closed runtime readiness status:

```text
fail_closed_runtime_readiness_status: not_ready_pending_precondition_design
```

Fail-closed cannot safely start because:

- canonical source is not authoritative for paid claim decisions;
- source authenticity/version is shadow classification only;
- freshness/TTL is shadow classification only;
- identity/subject binding is shadow classification only;
- replay/idempotency semantics are shadow classification only;
- rollback proof does not exist;
- feature gates are not defined as staging-only enforcement gates;
- safe evidence execution has not occurred;
- named enforcement scope has not been selected;
- diagnostics must not become the source of fail-closed behavior.

Condition readiness:

- Source unavailable: classified, not authoritative.
- Source timeout: classified, not authoritative.
- Source malformed: classified in source taxonomy, not runtime behavior.
- Unknown freshness: classified, not runtime behavior.
- Cache read failure: classified, not runtime behavior.
- Unknown subject: classified, not runtime behavior.
- Policy version unknown: classified as blocked/unknown in semantics, not runtime behavior.
- Source authenticity unknown: classified, not runtime behavior.
- Replay ambiguity: classified, not runtime behavior.

Primary fail-closed risk:

```text
fail_closed_depends_on_diagnostics: must_remain_blocked
```

Fail-closed runtime conclusion:

```text
fail_closed_runtime_implementation_status: not_ready
```

Before any fail-closed implementation, Phase G needs a named precondition and staging envelope design that proves fail-closed inputs are runtime-authoritative, not diagnostics-derived.

## 7. Remaining Blockers

Replay blockers:

- Current RF idempotency is partial and cannot be treated as governance-grade replay runtime.
- G6 replay context is not wired to actual RF idempotency outcomes in the normal shadow runtime.
- Replay state is not scoped to lifecycle, source, policy, identity, authority mode, or rollback epoch.
- Payload mismatch coverage is narrower than F5 RPL semantic mismatch coverage.
- Delayed retry after lifecycle/source/policy/identity change remains observational only.
- Stale replay after rollback has no runtime model.

Fail-closed blockers:

- No authoritative entitlement source for RF paid claim runtime.
- No diagnostics-independent decision path.
- No named fail-closed scope.
- No staging-only envelope.
- No rollback proof.
- No kill-switch/gate proof.
- No safe executed evidence.
- No Phase H review or approval.

Cross-cutting blockers:

- No explicit authority transition.
- No production-safe rollout plan.
- No WLS/privacy-safe executed evidence package.
- No QA/security sign-off over runtime execution.
- No approval to trigger Slice 16.

## 8. Option A - Bounded Replay Guard Assessment

Option A:

```text
phase_g_slice_g8_bounded_replay_guard_behind_shadow_staging_mode
```

Implementation risk:

- High if it changes RF claim behavior.
- Medium even in staging if it uses current RF idempotency as full replay authority.

Governance risk:

- High unless the slice explicitly remains non-authoritative or staging-only with named scope.
- Risk of treating G6 taxonomy as replay approval.

Hidden enforcement risk:

- High if `replaySemantics` is read by claim execution.
- High if `RF_IDEMPOTENCY_KEY_CONTEXT_MISMATCH` is broadened without evidence.

Rollback dependency:

- Unresolved.
- Replay state is not scoped to rollback mode or authority mode.

Evidence dependency:

- F5 RPL-01 through RPL-08 remain future requirements.
- Safe side-effect count evidence does not exist for a replay guard.

Validation complexity:

- High because claim, redeem, spend, voucher, reward, settlement, entitlement, identity, source, policy, and rollback dimensions interact.

Production safety:

- Not acceptable for production.
- Staging-only design may be possible later, but not as the next implementation without precondition envelope.

What it unlocks:

- Could eventually distinguish exact replay, retry, conflict, stale replay, and semantic mismatch.

Why it is premature:

- Current RF idempotency is not governance-grade replay runtime.
- No named bounded replay scope exists.
- No fail-closed or rollback envelope exists.

Assessment:

```text
option_a_status: premature_not_recommended_as_next_slice
```

## 9. Option B - Fail-Closed Preconditions Assessment

Option B:

```text
phase_g_slice_g8_fail_closed_preconditions_and_staging_envelope_design
```

Implementation risk:

- Low if kept review/design-only.
- High if it implements runtime fail-closed behavior.

Governance risk:

- Low to medium if it explicitly states design does not authorize enforcement.
- It directly addresses the highest-risk precondition gap before dangerous runtime work.

Hidden enforcement risk:

- Low if no runtime code changes are made.
- The design must explicitly prohibit diagnostics-driven fail-closed behavior.

Rollback dependency:

- Must be named as a blocker, not assumed solved.
- Must define what rollback proof would require before future implementation.

Evidence dependency:

- Must map required evidence to F5 TTL/RPL/ID/SRC/RB/DIA/GATE/AUTH cases.
- Must keep evidence status as not executed.

Validation complexity:

- Medium as a design slice.
- High for any future implementation slice.

Production safety:

- Safe if docs/design-only.
- No production change.

What it unlocks:

- Named fail-closed preconditions;
- staging-only envelope vocabulary;
- explicit input-authority requirements;
- clear stop conditions before replay guard or fail-closed runtime;
- safer future Option A evaluation.

Why it may be premature:

- It would be premature only if treated as fail-closed implementation or authorization.

Assessment:

```text
option_b_status: recommended_next_slice_review_design_only
```

## 10. Option C - Shadow Correlation Assessment

Option C:

```text
phase_g_slice_g8_continue_shadow_only_correlation_evidence_readiness
```

Implementation risk:

- Low if it only wires safe replay context into shadow metadata.
- Medium if it touches claim/replay branches and introduces accidental side effects.

Governance risk:

- Low if explicitly non-authoritative.
- Risk remains that richer correlation will be mistaken for executed evidence.

Hidden enforcement risk:

- Low if metadata is never read by claim decisions.
- Medium if future code reuses `replaySemantics` as decision input.

Rollback dependency:

- Can observe rollback-related labels, but cannot prove rollback.

Evidence dependency:

- Improves evidence readiness, but does not execute validation.

Validation complexity:

- Moderate.

Production safety:

- Safe if shadow-only, diagnostics-safe, and default-off where needed.

What it unlocks:

- Better alignment between actual RF idempotency and G6 replay semantics.
- Better RPL observation buckets for future review.

Why it may be insufficient:

- It does not answer fail-closed input authority.
- It does not define staging envelope, rollback proof, gate boundaries, or named enforcement scope.

Assessment:

```text
option_c_status: useful_but_secondary_to_fail_closed_precondition_design
```

Option C should be carried as a prerequisite item inside Option B, not selected as the standalone next slice.

## 11. Recommended Next Slice

Recommended next slice:

```text
recommended_next_slice: phase_g_slice_g8_fail_closed_preconditions_and_staging_envelope_design
```

Recommendation rationale:

- Replay runtime is not authorized and remains premature.
- Fail-closed runtime is not ready, but fail-closed precondition design is the safest next review/design step.
- A precondition and staging envelope can define named scope, runtime-authoritative inputs, diagnostics boundary, rollback prerequisites, gate constraints, and evidence requirements before any runtime code changes.
- Shadow-only replay correlation remains useful but should be a sub-requirement of the precondition design rather than the primary next slice.

The G8 slice should remain:

- docs/design-only or explicitly non-runtime;
- no allow/deny behavior;
- no replay rejection;
- no replay invalidation;
- no fail-closed behavior;
- no authority switch;
- no gate activation;
- no production routing changes;
- no approval;
- no Slice 16 trigger.

This recommendation is not authorization.

## 12. Slice 16 Boundary

Slice 16 remains blocked:

```text
slice_16_status: blocked_not_triggered
```

G7 does not provide:

- Phase H validation evidence;
- QA/security sign-off;
- rollback proof;
- WLS/privacy closure;
- named enforcement scope approval;
- authority transition approval;
- production rollout approval.

Therefore G7 cannot trigger Slice 16.

## 13. Authority and Diagnostics Boundary

Authority remains:

```text
authority_runtime_status: legacy_vip_spacer_still_authoritative
```

Diagnostics remain:

```text
diagnostics_sink_authority_status: non_authoritative_observability_only
```

G7 preserves:

```text
review != implementation
replay_entry_review != replay_runtime
fail_closed_precondition_review != fail_closed_runtime
shadow_graph != enforcement
diagnostics != authority
runtime != approval
implementation != rollout
```

G7 explicitly rejects:

- diagnostics-driven fail-closed;
- diagnostics-driven replay rejection;
- shadow metadata as authority;
- feature gate as authority switch;
- observation-only metadata as Phase H evidence.

## 14. Runtime Change Boundary

Runtime change status:

```text
runtime_implementation_status: no_new_runtime_change_in_g7
runtime_decision_behavior_status: unchanged
production_status: not_touched
```

G7 does not change:

- `apps/rf-service/src/store.ts`;
- `apps/rf-service/src/routes/rf.ts`;
- `apps/rf-service/src/vipEntitlementShadow.ts`;
- `packages/vip-entitlement-runtime-contracts/src/index.ts`;
- RF paid claim responses;
- `idempotentReplay` semantics;
- `RF_IDEMPOTENCY_KEY_CONTEXT_MISMATCH`;
- repeat policy / barrier behavior;
- `vip_spacer` role gate;
- source-read behavior;
- durable diagnostics schema;
- production config.

## 15. Final Classification

```text
slice_g7_status: review_ready_replay_runtime_entry_fail_closed_precondition_review
phase_g_status: implementation_phase_in_progress_bounded_slices_only
g1_to_g6_status: completed_bounded_shadow_semantic_graph
shadow_semantic_graph_status: complete_for_entry_review_not_enforcement
replay_runtime_readiness_status: not_authorized_pending_named_bounded_scope
fail_closed_runtime_readiness_status: not_ready_pending_precondition_design
runtime_implementation_status: no_new_runtime_change_in_g7
runtime_decision_behavior_status: unchanged
authority_runtime_status: legacy_vip_spacer_still_authoritative
diagnostics_sink_authority_status: non_authoritative_observability_only
enforcement_runtime_status: not_implemented
replay_runtime_status: not_implemented
fail_closed_runtime_status: not_implemented
slice_16_status: blocked_not_triggered
enforcement_approval_status: not_approved
production_status: not_touched
recommended_next_slice: phase_g_slice_g8_fail_closed_preconditions_and_staging_envelope_design
```

## 16. Final Classification - Acceptance Status

Acceptance criteria status:

```text
g1_g2_g3_g4_g5_g6_reviewed: yes
current_runtime_replay_idempotency_reality_reviewed: yes
replay_runtime_readiness_assessed: yes
fail_closed_runtime_readiness_assessed: yes
blockers_listed: yes
option_a_bounded_replay_guard_assessed: yes
option_b_fail_closed_preconditions_assessed: yes
option_c_shadow_correlation_assessed: yes
one_recommended_next_slice_selected: yes
runtime_code_changed_in_g7: no
replay_rejection_added: no
fail_closed_behavior_added: no
authority_switch_added: no
diagnostics_authority_drift_added: no
production_changes_added: no
docs_artifact_created: yes
```

Boundary conclusion:

```text
review != implementation
replay_entry_review != replay_runtime
fail_closed_precondition_review != fail_closed_runtime
shadow_graph != enforcement
diagnostics != authority
runtime != approval
implementation != rollout
legacy_vip_spacer_still_authoritative
non_authoritative_observability_only
slice_16_status: blocked_not_triggered
enforcement_approval_status: not_approved
```
