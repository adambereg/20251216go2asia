# VIP Entitlement Runtime Authority - Source Unavailable / Timeout Staging Guard Skeleton Disabled v1

Date: 2026-05-15  
Status: `DISABLED_SOURCE_UNAVAILABLE_TIMEOUT_GUARD_SKELETON_IMPLEMENTED`  
Slice: `VIP Entitlement Runtime Authority / Phase G / Slice G12`  
Mode: bounded skeleton implementation, disabled by default, candidate-specific, no fail-closed runtime, no replay runtime, no staging activation, no authority switch, no production rollout, no approval

## 1. Executive Summary

**FACT:** Slice G12 implements a disabled candidate-specific staging guard skeleton for `source_unavailable` / `source_timeout`.

**FACT:** The guard skeleton is metadata-only and no-op.

**FACT:** The guard skeleton is disabled by default and cannot enable fail-closed behavior.

**FACT:** The guard skeleton cannot enable production routing, authority, replay rejection, cache/source/replay/identity invalidation, or active gates.

**FACT:** G12 does not change RF paid claim behavior.

**FACT:** G12 does not implement fail-closed runtime.

**FACT:** G12 does not implement replay runtime.

**FACT:** G12 does not activate the G9 staging envelope.

**FACT:** G12 does not switch authority away from legacy `vip_spacer`.

G12 provides structure for a future staging-only validation slice. It does not provide enforcement, approval, rollout, or Slice 16 readiness.

## 2. Input Context

Primary artifacts reviewed:

- `docs/architecture/domain/vip_entitlement_foundations_shared_runtime_contracts_v1.md`
- `docs/architecture/domain/vip_entitlement_lifecycle_policy_semantics_closure_v1.md`
- `docs/architecture/domain/vip_entitlement_runtime_freshness_ttl_guard_shadow_mode_v1.md`
- `docs/architecture/domain/vip_entitlement_source_authenticity_version_runtime_classification_v1.md`
- `docs/architecture/domain/vip_entitlement_shadow_identity_subject_binding_metadata_v1.md`
- `docs/architecture/domain/vip_entitlement_shadow_replay_idempotency_semantics_v1.md`
- `docs/architecture/domain/vip_entitlement_replay_runtime_entry_fail_closed_precondition_review_v1.md`
- `docs/architecture/domain/vip_entitlement_fail_closed_preconditions_staging_envelope_design_v1.md`
- `docs/architecture/domain/vip_entitlement_staging_envelope_skeleton_disabled_flag_v1.md`
- `docs/architecture/domain/vip_entitlement_shadow_correlation_replay_fail_closed_inputs_v1.md`
- `docs/architecture/domain/vip_entitlement_first_staging_fail_closed_candidate_source_unavailable_timeout_v1.md`

Code context reviewed:

- `packages/vip-entitlement-runtime-contracts/src/index.ts`
- `apps/rf-service/src/vipEntitlementShadow.ts`
- `apps/rf-service/src/store.ts`
- `apps/rf-service/src/routes/rf.ts`

Implementation placement:

```text
placement_status: contracts_helper_plus_shadow_metadata_only
route_store_decision_logic_status: not_changed
production_config_status: not_changed
database_migration_status: not_added
```

## 3. G1-G11 Status Review

Verified status:

```text
shadow_semantic_graph_status: exists
staging_envelope_skeleton_status: exists_disabled
replay_fail_closed_correlation_status: exists_non_authoritative
source_unavailable_timeout_candidate_design_status: exists_design_only
fail_closed_runtime_status: not_implemented
replay_runtime_status: not_implemented
active_rf_paid_claim_behavior_status: unchanged
authority_runtime_status: legacy_vip_spacer_still_authoritative
diagnostics_sink_authority_status: non_authoritative_observability_only
```

G1-G6 created the shadow semantic graph for lifecycle, freshness, source, identity, and replay/idempotency metadata.

G7 reviewed replay runtime and fail-closed readiness and did not approve either.

G8 designed fail-closed preconditions and a staging envelope without implementation.

G9 implemented the disabled staging envelope skeleton.

G10 connected safe RF replay/idempotency outcomes and fail-closed input summaries into non-authoritative shadow observation.

G11 selected `source_unavailable` / `source_timeout` as the first narrow future staging-only candidate, design-only.

## 4. Purpose of G12

G12 creates a candidate-specific guard skeleton for:

```text
candidate: source_unavailable / source_timeout
```

The skeleton provides:

- candidate labels;
- disabled guard status labels;
- a pure no-op resolver;
- safe shadow observation metadata;
- tests proving hard-disabled behavior.

The purpose is future evidence planning for staging-only validation, not runtime enforcement.

## 5. G12 Non-Goals

G12 does not:

- implement fail-closed runtime;
- implement source availability enforcement;
- implement replay runtime;
- activate staging;
- switch authority;
- change allow/deny behavior;
- block paid claims;
- reject replay;
- invalidate replay, cache, source, identity, lifecycle, policy, rollback, or entitlement state;
- change `runtimeAllowed`;
- change `entitlementAllowed`;
- use `driftClass` or `canonicalDriftClass` as enforcement;
- change `idempotentReplay`;
- change `RF_IDEMPOTENCY_KEY_CONTEXT_MISMATCH`;
- change production routing;
- add production config;
- add database migrations;
- approve enforcement;
- trigger Slice 16.

Required invariants:

```text
candidate_guard_skeleton != fail_closed_runtime
source_unavailable_timeout_guard != active_deny
disabled_guard != active_gate
guard_metadata != authority
diagnostics != authority
runtime != approval
implementation != rollout
legacy_vip_spacer_still_authoritative
non_authoritative_observability_only
slice_16_status: blocked_not_triggered
enforcement_approval_status: not_approved
```

## 6. Candidate Guard Skeleton Model

G12 adds a shared contract helper:

```text
helper: resolveRuntimeSourceAvailabilityGuardSkeleton
```

The helper returns:

```text
runtimeDomainLabel: source_authenticity_version
sourceAvailabilityGuardStatus: guard_disabled | candidate_observed_disabled | candidate_not_observed | hidden_activation_blocked | unsupported_without_runtime_change
sourceAvailabilityCandidateClass: source_unavailable_candidate | source_timeout_candidate | source_availability_candidate_not_observed | source_availability_candidate_out_of_scope | unsupported_without_runtime_change
authorityModeLabel: authority_transition_not_started
gateStateLabel: gate_disabled
rollbackModeLabel: no_enforcement_baseline
validationCaseFamily: SRC
```

Hard-disabled flags:

```text
sourceAvailabilityGuardEnabled: false
sourceAvailabilityFailClosedEnabled: false
sourceAvailabilityProductionRoutingEnabled: false
sourceAvailabilityAuthorityEnabled: false
sourceAvailabilityReplayRejectionEnabled: false
sourceAvailabilityInvalidationEnabled: false
```

RF shadow observation adds:

```text
sourceAvailabilityGuard: RuntimeSourceAvailabilityGuardSkeleton
```

This field is recorded with shadow observation only. No runtime decision path reads it to decide claim outcome.

## 7. Disabled-by-Default Guarantees

G12 explicitly guarantees:

- default guard status is disabled;
- source unavailable/timeout candidate observation does not enable the guard;
- hidden activation attempts become metadata only;
- helper cannot enable deny;
- helper cannot enable production routing;
- helper cannot enable authority;
- helper cannot enable fail-closed;
- helper cannot enable replay rejection;
- helper cannot enable invalidation;
- staging envelope remains disabled;
- no active runtime path reads the guard as authority.

Hidden activation requests resolve to:

```text
sourceAvailabilityGuardStatus: hidden_activation_blocked
gateStateLabel: gate_disabled
sourceAvailabilityGuardEnabled: false
sourceAvailabilityFailClosedEnabled: false
sourceAvailabilityProductionRoutingEnabled: false
sourceAvailabilityAuthorityEnabled: false
sourceAvailabilityReplayRejectionEnabled: false
sourceAvailabilityInvalidationEnabled: false
```

## 8. Source Availability Candidate Mapping

Mapping:

```text
source_unavailable -> source_unavailable_candidate -> candidate_observed_disabled
unavailable -> source_unavailable_candidate -> candidate_observed_disabled
source_timeout -> source_timeout_candidate -> candidate_observed_disabled
timeout -> source_timeout_candidate -> candidate_observed_disabled
unsupported_without_runtime_change -> unsupported_without_runtime_change -> unsupported_without_runtime_change
other source states -> source_availability_candidate_out_of_scope -> candidate_not_observed
missing source signal -> source_availability_candidate_not_observed -> guard_disabled
```

RF shadow integration maps current source read state:

```text
adapterStatus: timeout or reasonCode: source_timeout -> source_timeout
adapterStatus: unavailable or reasonCode: source_unavailable -> source_unavailable
adapterStatus: degraded -> source_degraded, out of candidate scope
adapterStatus: unknown_source -> source_inconsistent, out of candidate scope
```

Out-of-scope cases remain diagnostic-only:

- `source_malformed`;
- `source_inconsistent`;
- `source_degraded`;
- `unknown_freshness`;
- `cache_read_failure`;
- `policy_version_unknown`;
- `subject_binding_missing`;
- `identity_downgrade_detected`;
- replay ambiguity.

## 9. Diagnostics Boundary

Diagnostics may:

- observe guard skeleton metadata;
- publish safe bucket labels;
- support future evidence planning;
- report source unavailable/timeout candidate presence as disabled metadata.

Diagnostics may not:

- deny claims;
- activate a guard;
- activate staging;
- switch authority;
- become source authority;
- decide production routing;
- trigger replay rejection;
- trigger cache/source/replay/identity invalidation.

Diagnostics status:

```text
diagnostics_sink_authority_status: non_authoritative_observability_only
```

## 10. Runtime Boundary

Runtime behavior remains unchanged:

```text
rf_paid_claim_behavior_status: unchanged
vip_spacer_authority_status: unchanged
idempotent_replay_behavior_status: unchanged
source_read_shadow_behavior_status: unchanged
staging_envelope_runtime_status: disabled_not_activated
fail_closed_runtime_status: not_implemented
production_routing_status: not_touched
authority_switch_status: not_implemented
```

No `store.ts` or route allow/deny branch was added for the guard skeleton. The guard is constructed inside shadow comparison and published as metadata only.

## 11. Security / Hidden Activation Considerations

Risks considered:

- source outage abuse if a future guard becomes broad;
- spoofed timeout or unavailable adapter state;
- diagnostics outage being confused with source outage;
- hidden deny through guard labels;
- hidden production routing through config;
- hidden authority transition through shadow metadata;
- replay rejection hidden behind source availability;
- invalidation hidden behind source availability.

G12 mitigations:

- all enable flags are hard `false`;
- activation-like inputs produce `hidden_activation_blocked`;
- no production config was added;
- no route/store decision branch was added;
- diagnostics remain non-authoritative;
- out-of-scope source states are not converted into source unavailable/timeout candidates;
- fail-closed remains not implemented.

Future slices must still prove source adapter trust, timeout ownership, diagnostics independence, WLS/privacy-safe evidence, rollback behavior, and staging-only scope before any active candidate validation.

## 12. Tests Added

Contract tests added:

- default source availability guard resolves disabled;
- source unavailable/timeout candidates are observed while disabled;
- hidden activation requests are blocked and keep all flags false;
- out-of-scope source states remain diagnostic-only;
- diagnostics unavailable changes diagnostics label only.

RF shadow tests added:

- `source_unavailable` produces disabled source availability guard metadata;
- `source_timeout` produces disabled source availability guard metadata;
- hidden activation request remains metadata-only;
- all guard enable flags remain false;
- unsafe diagnostics checks still pass.

RF request test added:

- source unavailable and source timeout guard skeletons are observed during RF paid claim diagnostics while the paid claim denial behavior remains unchanged.

Existing replay/idempotency tests remain focused on unchanged replay behavior and non-authoritative replay metadata.

## 13. Files Changed

Files changed:

- `packages/vip-entitlement-runtime-contracts/src/index.ts`
- `packages/vip-entitlement-runtime-contracts/test/runtime-source-availability-guard-skeleton.test.mjs`
- `apps/rf-service/src/vipEntitlementShadow.ts`
- `apps/rf-service/test/vip-entitlement-shadow.test.ts`
- `apps/rf-service/test/request.test.ts`
- `docs/architecture/domain/vip_entitlement_source_unavailable_timeout_staging_guard_skeleton_disabled_v1.md`

G11 document remains the prior design input:

- `docs/architecture/domain/vip_entitlement_first_staging_fail_closed_candidate_source_unavailable_timeout_v1.md`

## 14. Recommended Next Slice

Recommended next slice:

```text
recommended_next_slice: phase_g_slice_g13_source_unavailable_timeout_staging_validation_plan_and_fixture_design
```

Rationale:

- G12 provides an inert skeleton only.
- The next safest step is still not active fail-closed.
- Future work should define staging-only fixture design, validation plan, source adapter trust requirements, timeout threshold ownership, diagnostics independence proof, rollback observation, and stop conditions.
- No runtime fail-closed candidate should be activated until a later approved slice with evidence.

This recommendation is not authorization.

## 15. Final Classification

```text
slice_g12_status: disabled_source_unavailable_timeout_guard_skeleton_implemented
phase_g_status: implementation_phase_in_progress_bounded_slices_only
g1_to_g11_status: completed_shadow_graph_disabled_envelope_correlation_and_candidate_design
candidate_guard_skeleton_status: implemented_disabled_by_default_non_authoritative
source_unavailable_timeout_guard_status: disabled_not_active
staging_envelope_runtime_status: disabled_not_activated
runtime_implementation_status: candidate_guard_skeleton_only_no_runtime_enforcement
runtime_decision_behavior_status: unchanged
authority_runtime_status: legacy_vip_spacer_still_authoritative
diagnostics_sink_authority_status: non_authoritative_observability_only
enforcement_runtime_status: not_implemented
replay_runtime_status: not_implemented
fail_closed_runtime_status: not_implemented
source_availability_fail_closed_status: not_implemented
slice_16_status: blocked_not_triggered
enforcement_approval_status: not_approved
production_status: not_touched
recommended_next_slice: phase_g_slice_g13_source_unavailable_timeout_staging_validation_plan_and_fixture_design
```

## 16. Final Classification - Acceptance Status

Acceptance criteria status:

```text
g1_to_g11_reviewed: yes
candidate_specific_guard_skeleton_implemented: yes
guard_defaults_disabled: yes
source_unavailable_source_timeout_candidate_labels_added: yes
all_enable_flags_hard_false: yes
runtime_allow_deny_changes_added: no
paid_claim_blocking_added: no
replay_rejection_added: no
replay_cache_source_identity_invalidation_added: no
authority_switch_added: no
staging_envelope_activation_added: no
production_routing_changes_added: no
diagnostics_boundary_preserved: yes
tests_added: yes
docs_artifact_created: yes
```

Boundary conclusion:

```text
candidate_guard_skeleton != fail_closed_runtime
source_unavailable_timeout_guard != active_deny
disabled_guard != active_gate
guard_metadata != authority
diagnostics != authority
runtime != approval
implementation != rollout
legacy_vip_spacer_still_authoritative
non_authoritative_observability_only
slice_16_status: blocked_not_triggered
enforcement_approval_status: not_approved
```
