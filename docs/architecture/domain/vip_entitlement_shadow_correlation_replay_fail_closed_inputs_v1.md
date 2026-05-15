# VIP Entitlement Runtime Authority - Shadow Correlation for Replay / Fail-Closed Inputs v1

Date: 2026-05-15  
Status: `BOUNDED_SHADOW_CORRELATION_REPLAY_FAIL_CLOSED_INPUTS_IMPLEMENTED`  
Slice: `VIP Entitlement Runtime Authority / Phase G / Slice G10`  
Mode: bounded shadow correlation implementation, safe enum/bucket metadata only, no replay runtime, no fail-closed runtime, no authority switch, no staging activation, no rollout, no approval

## 1. Executive Summary

**FACT:** Slice G10 implements safe shadow correlation for RF replay/idempotency outcomes and fail-closed candidate inputs.

**FACT:** Slice G10 does not implement replay runtime.

**FACT:** Slice G10 does not reject replay.

**FACT:** Slice G10 does not invalidate replay, cache, source, lifecycle, policy, identity, rollback, or entitlement state.

**FACT:** Slice G10 does not implement fail-closed runtime.

**FACT:** Slice G10 does not activate the G9 staging envelope.

**FACT:** Slice G10 does not switch authority.

**FACT:** Slice G10 does not change RF paid claim allow/deny behavior, response status, response body semantics, idempotency behavior, repeat-policy behavior, production routing, or production config.

G10 closes the G6/G7/G9 observation gap by passing only safe outcome buckets from RF paid-claim idempotency and repeat-policy paths into the existing shadow observation graph.

Current authority remains:

```text
authority_runtime_status: legacy_vip_spacer_still_authoritative
```

Diagnostics remain:

```text
diagnostics_sink_authority_status: non_authoritative_observability_only
```

## 2. Input Context

Primary G1-G9 artifacts reviewed:

- `docs/architecture/domain/vip_entitlement_foundations_shared_runtime_contracts_v1.md`
- `docs/architecture/domain/vip_entitlement_lifecycle_policy_semantics_closure_v1.md`
- `docs/architecture/domain/vip_entitlement_runtime_freshness_ttl_guard_shadow_mode_v1.md`
- `docs/architecture/domain/vip_entitlement_source_authenticity_version_runtime_classification_v1.md`
- `docs/architecture/domain/vip_entitlement_shadow_identity_subject_binding_metadata_v1.md`
- `docs/architecture/domain/vip_entitlement_shadow_replay_idempotency_semantics_v1.md`
- `docs/architecture/domain/vip_entitlement_replay_runtime_entry_fail_closed_precondition_review_v1.md`
- `docs/architecture/domain/vip_entitlement_fail_closed_preconditions_staging_envelope_design_v1.md`
- `docs/architecture/domain/vip_entitlement_staging_envelope_skeleton_disabled_flag_v1.md`

Runtime/code context reviewed:

- `apps/rf-service/src/store.ts`
- `apps/rf-service/src/routes/rf.ts`
- `apps/rf-service/src/vipEntitlementShadow.ts`
- `packages/vip-entitlement-runtime-contracts/src/index.ts`

## 3. G1-G9 Status Review

G1-G6 status:

```text
shadow_semantic_graph_status: exists_completed_for_shadow_observation
```

G7/G8 status:

```text
replay_runtime_status: not_implemented
fail_closed_runtime_status: not_implemented
fail_closed_preconditions_status: designed_not_implemented
```

G9 status:

```text
staging_envelope_skeleton_status: implemented_disabled_by_default_non_authoritative
staging_envelope_runtime_status: disabled_not_activated
```

Runtime boundary verified:

```text
active_rf_paid_claim_behavior_status: unchanged
authority_runtime_status: legacy_vip_spacer_still_authoritative
diagnostics_sink_authority_status: non_authoritative_observability_only
```

## 4. Purpose of G10

G10 completes shadow correlation for replay/fail-closed inputs by:

- observing RF idempotency outcomes as safe replay buckets;
- observing repeat-policy barrier outcomes as safe replay buckets;
- mapping those buckets into existing G6 replay semantics;
- summarizing G3-G5/G6/G9 inputs for future fail-closed candidate selection;
- preserving non-authoritative diagnostics-only behavior.

G10 improves evidence readiness. It does not create evidence approval.

## 5. G10 Non-Goals

G10 does not:

- implement replay runtime;
- reject replay;
- invalidate replay or cache;
- implement fail-closed runtime;
- choose a fail-closed candidate;
- activate the staging envelope;
- activate gates;
- switch authority;
- change RF paid claim behavior;
- change production routing;
- approve enforcement;
- trigger Slice 16.

Required invariants remain:

```text
shadow_correlation != replay_runtime
correlation_metadata != fail_closed_runtime
idempotency_outcome_observation != replay_rejection
fail_closed_input_correlation != fail_closed_behavior
staging_envelope_skeleton != active_gate
diagnostics != authority
runtime != approval
implementation != rollout
legacy_vip_spacer_still_authoritative
non_authoritative_observability_only
slice_16_status: blocked_not_triggered
enforcement_approval_status: not_approved
```

## 6. Replay Correlation Model

Safe replay buckets:

```text
first_seen_operation
idempotent_retry_observed
context_mismatch_observed
repeat_policy_barrier_observed
replay_context_not_observed
replay_context_unsupported
```

Safe observation scopes:

```text
rf_paid_claim_shadow_observation
rf_paid_claim_idempotency_lookup
rf_paid_claim_repeat_policy_barrier
replay_context_not_observed
replay_context_unsupported
```

New shadow metadata:

```text
VipEntitlementShadowObservation.replayOutcome
```

Replay outcome metadata includes only enum/bucket fields:

- `replayObservationScope`
- `replayOutcomeBucket`
- `replayContextObserved`
- `replayConfidence`
- `replayGovernanceGradeStatus`
- `rfIdempotencyCoverageStatus`

Mapping to G6 replay semantics:

- `idempotent_retry_observed` maps to `idempotent_retry`;
- `context_mismatch_observed` maps to source/context mismatch replay metadata;
- `repeat_policy_barrier_observed` maps to replay detected metadata;
- `first_seen_operation` remains first-seen metadata;
- unsupported/not-observed contexts remain non-authoritative metadata.

This mapping does not change `idempotentReplay`, `RF_IDEMPOTENCY_KEY_CONTEXT_MISMATCH`, repeat-policy behavior, voucher creation, points spend, or responses.

## 7. Fail-Closed Input Correlation Model

New shadow metadata:

```text
VipEntitlementShadowObservation.failClosedInputSummary
```

The summary combines only safe buckets from:

- freshness/TTL shadow metadata;
- source availability/authenticity/version shadow metadata;
- identity/subject-binding shadow metadata;
- replay outcome/replay semantics metadata;
- disabled staging envelope metadata;
- diagnostics non-authority status.

Safe fields:

- `failClosedCandidateInputStatus`
- `failClosedInputCompleteness`
- `failClosedInputAuthorityStatus`
- `failClosedDiagnosticsIndependenceStatus`
- `failClosedCandidateReadiness`
- `freshnessInputStatus`
- `sourceInputStatus`
- `identityInputStatus`
- `replayInputStatus`
- `stagingEnvelopeStatus`
- `diagnosticsInputStatus`

The summary is not fail-closed behavior.

Current readiness remains:

```text
failClosedCandidateReadiness: not_ready_shadow_summary_only
failClosedInputAuthorityStatus: shadow_only_not_authoritative
failClosedDiagnosticsIndependenceStatus: diagnostics_non_authoritative_not_runtime_input
```

## 8. Diagnostics Boundary

Diagnostics may:

- observe replay outcome buckets;
- observe fail-closed input summaries;
- publish aggregate-safe metadata;
- support future evidence planning.

Diagnostics must not:

- reject replay;
- deny claims;
- activate fail-closed behavior;
- activate staging envelope;
- switch authority;
- become production routing input.

## 9. Runtime Boundary

G10 changes only shadow observation inputs and metadata.

Runtime behavior remains unchanged for:

- normal first-seen paid claim;
- idempotent replay;
- `RF_IDEMPOTENCY_KEY_CONTEXT_MISMATCH`;
- repeat-policy barrier;
- VIP `vip_spacer` role authority;
- source read mode;
- staging envelope state;
- production routing.

The replay/fail-closed summaries are never read by allow/deny paths.

## 10. Privacy / Safe Evidence Boundary

G10 does not add raw:

- idempotency keys;
- request payloads;
- user IDs;
- request IDs;
- correlation IDs;
- transaction IDs;
- payment data;
- source payloads;
- tokens or secrets.

G10 uses enum/bucket metadata only.

The existing unsafe diagnostics scanner remains active for shadow observations and snapshots.

## 11. Tests Added

RF shadow unit tests added/extended:

- safe replay buckets map to non-authoritative G6 replay semantics;
- fail-closed input summary is present and non-authoritative;
- staging envelope remains disabled;
- unsafe diagnostics field scanner still passes.

RF request tests added:

- paid idempotent replay behavior remains 200 / `idempotentReplay: true` and records safe replay bucket;
- paid idempotency context mismatch behavior remains 409 / `RF_IDEMPOTENCY_KEY_CONTEXT_MISMATCH` and records safe replay bucket;
- diagnostics do not include raw idempotency keys, user IDs, request IDs, correlation IDs, payload, or transaction data.

Regression tests retained:

- role-denied paid claim remains denied;
- role-allowed paid claim remains allowed;
- source read remains disabled unless `shadow_read_only`;
- repeat-policy/idempotency request tests remain behavior-focused.

Tests do not assert replay enforcement, fail-closed behavior, approval, rollout, or Slice 16 readiness.

## 12. Files Changed

Implementation files:

- `apps/rf-service/src/vipEntitlementShadow.ts`
- `apps/rf-service/src/store.ts`
- `apps/rf-service/src/routes/rf.ts`

Test files:

- `apps/rf-service/test/vip-entitlement-shadow.test.ts`
- `apps/rf-service/test/request.test.ts`

Documentation files:

- `docs/architecture/domain/vip_entitlement_shadow_correlation_replay_fail_closed_inputs_v1.md`

No production config file was changed.

No database schema file was changed.

No runtime authority file was introduced.

## 13. Recommended Next Slice

Recommended next slice:

```text
recommended_next_slice: phase_g_slice_g11_first_staging_only_fail_closed_candidate_design_source_unavailable_timeout
```

Rationale:

- G10 now exposes safer shadow-only correlation for replay and fail-closed candidate inputs.
- G8 identified source unavailable/source timeout as a possible future candidate only after the envelope exists.
- G9 created the disabled envelope skeleton.
- G10 improves observability without runtime enforcement.
- The next safest step is design-only selection of one narrow staging-only candidate, not implementation or activation.

This recommendation is not authorization.

## 14. Final Classification

```text
slice_g10_status: bounded_shadow_correlation_replay_fail_closed_inputs_implemented
phase_g_status: implementation_phase_in_progress_bounded_slices_only
g1_to_g9_status: completed_shadow_graph_preconditions_and_disabled_envelope_skeleton
shadow_correlation_status: implemented_non_authoritative_correlation_only
replay_correlation_status: implemented_safe_bucket_observation_not_replay_runtime
fail_closed_input_correlation_status: implemented_safe_summary_not_fail_closed_runtime
staging_envelope_runtime_status: disabled_not_activated
runtime_implementation_status: shadow_correlation_only_no_runtime_enforcement
runtime_decision_behavior_status: unchanged
authority_runtime_status: legacy_vip_spacer_still_authoritative
diagnostics_sink_authority_status: non_authoritative_observability_only
enforcement_runtime_status: not_implemented
replay_runtime_status: not_implemented
fail_closed_runtime_status: not_implemented
slice_16_status: blocked_not_triggered
enforcement_approval_status: not_approved
production_status: not_touched
recommended_next_slice: phase_g_slice_g11_first_staging_only_fail_closed_candidate_design_source_unavailable_timeout
```

## 15. Final Classification - Acceptance Status

Acceptance criteria status:

```text
g1_g2_g3_g4_g5_g6_g7_g8_g9_reviewed: yes
replay_correlation_safe_buckets_implemented: yes
fail_closed_input_correlation_safe_summary_implemented: yes
raw_idempotency_keys_payload_user_ids_request_ids_correlation_ids_in_diagnostics: no
runtime_allow_deny_changes_added: no
replay_rejection_added: no
replay_invalidation_added: no
fail_closed_behavior_added: no
authority_switch_added: no
staging_envelope_activation_added: no
production_routing_changes_added: no
diagnostics_boundary_preserved: yes
tests_added: yes
docs_artifact_created: yes
```

Boundary conclusion:

```text
shadow_correlation != replay_runtime
correlation_metadata != fail_closed_runtime
idempotency_outcome_observation != replay_rejection
fail_closed_input_correlation != fail_closed_behavior
staging_envelope_skeleton != active_gate
diagnostics != authority
runtime != approval
implementation != rollout
legacy_vip_spacer_still_authoritative
non_authoritative_observability_only
slice_16_status: blocked_not_triggered
enforcement_approval_status: not_approved
```
