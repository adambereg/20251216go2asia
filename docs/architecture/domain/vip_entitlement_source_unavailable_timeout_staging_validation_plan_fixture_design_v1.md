# VIP Entitlement Runtime Authority - Source Unavailable / Timeout Staging Validation Plan and Fixture Design v1

Date: 2026-05-16  
Status: `REVIEW_READY_SOURCE_UNAVAILABLE_TIMEOUT_STAGING_VALIDATION_PLAN_FIXTURE_DESIGN`  
Slice: `VIP Entitlement Runtime Authority / Phase G / Slice G13`  
Mode: design and validation-planning only, no validation execution, no fixture execution, no fail-closed runtime, no replay runtime, no staging activation, no authority switch, no production rollout, no approval

## 1. Executive Summary

**FACT:** Slice G13 is a design / validation-planning slice.

**FACT:** Slice G13 creates a staging validation plan and fixture design for the future `source_unavailable` / `source_timeout` candidate.

**FACT:** Slice G13 does not execute validation.

**FACT:** Slice G13 does not execute fixtures.

**FACT:** Slice G13 does not implement fail-closed runtime.

**FACT:** Slice G13 does not implement replay runtime.

**FACT:** Slice G13 does not activate the G9 staging envelope.

**FACT:** Slice G13 does not activate the G12 source availability guard skeleton.

**FACT:** Slice G13 does not change RF paid claim behavior.

**FACT:** Slice G13 does not change production routing or production config.

**FACT:** Slice G13 does not switch runtime authority.

**FACT:** Slice G13 does not approve enforcement.

**FACT:** Slice G13 does not trigger Slice 16.

Current authority remains:

```text
authority_runtime_status: legacy_vip_spacer_still_authoritative
```

Diagnostics remain:

```text
diagnostics_sink_authority_status: non_authoritative_observability_only
```

## 2. Input Context

Primary G1-G12 artifacts reviewed:

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
- `docs/architecture/domain/vip_entitlement_source_unavailable_timeout_staging_guard_skeleton_disabled_v1.md`

Code context reviewed without changes:

- `packages/vip-entitlement-runtime-contracts/src/index.ts`
- `apps/rf-service/src/vipEntitlementShadow.ts`
- `apps/rf-service/src/store.ts`
- `apps/rf-service/src/routes/rf.ts`

Current fixture surface observed:

- `VipEntitlementSourceReadScenario` includes `source_timeout` and `source_unavailable`;
- `createLocalVipEntitlementSourceReadAdapter()` can synthesize `timeout` and `unavailable` source-read results;
- `RF_ENTITLEMENT_SOURCE_READ_MODE=shadow_read_only` can route shadow comparison through the source-read adapter;
- `RF_ENTITLEMENT_SOURCE_READ_SCENARIO` can select safe shadow-read scenarios for tests and non-production validation planning;
- G12 `sourceAvailabilityGuard` metadata observes `source_unavailable_candidate` and `source_timeout_candidate` while disabled;
- G10 `failClosedInputSummary` remains non-authoritative;
- G9 staging envelope remains disabled.

## 3. G1-G12 Status Review

Verified G1-G6 status:

```text
shadow_semantic_graph_status: exists_completed_for_shadow_observation
```

Verified G7/G8 status:

```text
replay_runtime_status: not_implemented
fail_closed_runtime_status: not_implemented
fail_closed_preconditions_status: designed_not_implemented
```

Verified G9 status:

```text
staging_envelope_skeleton_status: implemented_disabled_by_default_non_authoritative
staging_envelope_runtime_status: disabled_not_activated
```

Verified G10 status:

```text
replay_fail_closed_correlation_status: implemented_non_authoritative_correlation_only
fail_closed_input_summary_status: implemented_shadow_summary_not_authority
```

Verified G11 status:

```text
source_unavailable_timeout_candidate_design_status: completed_design_only_not_implemented
candidate_scope_status: source_unavailable_timeout_only
```

Verified G12 status:

```text
source_unavailable_timeout_guard_skeleton_status: implemented_disabled_by_default_non_authoritative
source_unavailable_timeout_guard_status: disabled_not_active
```

Runtime boundary remains:

```text
active_rf_paid_claim_behavior_status: unchanged
authority_runtime_status: legacy_vip_spacer_still_authoritative
diagnostics_sink_authority_status: non_authoritative_observability_only
enforcement_runtime_status: not_implemented
replay_runtime_status: not_implemented
fail_closed_runtime_status: not_implemented
```

## 4. Purpose of G13

G13 defines a validation plan and fixture design for a future staging-only validation of:

```text
candidate: source_unavailable / source_timeout
```

G13 defines:

- staging validation scope;
- safe actor and fixture model;
- source unavailable fixture design;
- source timeout fixture design;
- control fixture design;
- expected/actual evidence format;
- diagnostics independence checks;
- hidden activation checks;
- rollback / kill-switch observation plan;
- WLS/privacy-safe evidence protocol;
- stop conditions;
- future G14 boundary.

G13 does not authorize validation execution. G13 only prepares a plan for a future disabled validation harness slice.

## 5. G13 Non-Goals

G13 does not:

- execute staging validation;
- execute fixtures;
- add validation harness code;
- implement fail-closed runtime;
- implement source availability enforcement;
- implement replay runtime;
- activate staging envelope;
- activate G12 source availability guard;
- add allow/deny behavior;
- reject replay;
- invalidate replay, cache, source, identity, lifecycle, policy, rollback, or entitlement state;
- implement source timeout thresholds;
- implement source adapter trust;
- change RF paid claim behavior;
- change production routing;
- change production config;
- switch runtime authority;
- approve enforcement;
- trigger Slice 16.

Required invariants:

```text
validation_plan != validation_execution
fixture_design != fixture_execution
candidate_guard_skeleton != active_guard
source_unavailable_timeout_validation_plan != fail_closed_runtime
staging_validation_plan != staging_activation
diagnostics != authority
runtime != approval
implementation != rollout
legacy_vip_spacer_still_authoritative
non_authoritative_observability_only
slice_16_status: blocked_not_triggered
enforcement_approval_status: not_approved
```

## 6. Staging Validation Scope

In scope for the future validation plan:

- only `source_unavailable`;
- only `source_timeout`;
- only RF paid claim entitlement source-read context;
- only future staging validation context;
- only safe actors and safe fixtures;
- only diagnostics-safe expected/actual summaries;
- only disabled G12 guard observation;
- only disabled G9 staging envelope observation;
- only non-production staging validation planning.

Explicitly out of scope:

- `source_malformed`;
- `source_inconsistent`;
- `source_degraded` as a trigger;
- `unknown_freshness`;
- `cache_read_failure`;
- `policy_version_unknown`;
- `subject_binding_missing`;
- `identity_downgrade_detected`;
- `replay_ambiguity`;
- production fail-closed;
- production routing;
- replay rejection;
- identity enforcement;
- policy enforcement;
- cache invalidation;
- Slice 16.

Scope conclusion:

```text
staging_validation_scope_status: source_unavailable_timeout_only_designed_not_executed
```

## 7. Fixture Design Matrix

Candidate fixtures:

```text
source_unavailable_fixture:
  source_scenario: source_unavailable
  expected_adapter_status: unavailable
  expected_guard_candidate_class: source_unavailable_candidate
  expected_guard_status: candidate_observed_disabled
  expected_staging_envelope_status: disabled_not_activated
  execution_status: planned_not_executed

source_timeout_fixture:
  source_scenario: source_timeout
  expected_adapter_status: timeout
  expected_guard_candidate_class: source_timeout_candidate
  expected_guard_status: candidate_observed_disabled
  expected_staging_envelope_status: disabled_not_activated
  execution_status: planned_not_executed
```

Control fixtures:

```text
source_grant_control:
  source_scenario: grant
  purpose: prove normal source-read observation remains non-authoritative
  candidate_scope: control_only
  execution_status: planned_not_executed

source_deny_control:
  source_scenario: deny
  purpose: prove denied source-read observation does not activate fail-closed
  candidate_scope: control_only
  execution_status: planned_not_executed

source_degraded_control_only:
  source_scenario: degraded
  purpose: prove degraded source is out of trigger scope
  candidate_scope: out_of_scope_control
  execution_status: planned_not_executed

source_malformed_out_of_scope:
  source_scenario: planned_future_fixture_only
  purpose: prove malformed source is not counted as source unavailable/timeout
  candidate_scope: out_of_scope
  fixture_hook_status: missing_future_harness_fixture
  execution_status: planned_not_executed

source_inconsistent_out_of_scope:
  source_scenario: unknown_source_or_future_inconsistent_fixture
  purpose: prove inconsistent source is not counted as source unavailable/timeout
  candidate_scope: out_of_scope
  execution_status: planned_not_executed
```

Actor fixtures:

```text
safe_vip_spacer_actor:
  actor_alias: safe_actor_vip_spacer_1
  raw_user_id_status: prohibited
  purpose: baseline legacy authority allowed actor

safe_non_vip_actor:
  actor_alias: safe_actor_non_vip_1
  raw_user_id_status: prohibited
  purpose: baseline legacy authority denied actor

safe_paid_offer_fixture:
  offer_alias: safe_paid_offer_1
  payment_data_status: prohibited
  purpose: RF paid claim entitlement source-read validation context

safe_listing_fixture:
  listing_alias: safe_listing_offer_1
  relevance: optional_if_listing_claim_scope_is_selected_for_future_harness
  purpose: prove listing scope does not widen candidate semantics

safe_idempotency_replay_fixture:
  replay_alias: safe_replay_case_1
  raw_idempotency_key_status: prohibited
  relevance: optional_control_only
  purpose: prove replay behavior remains unchanged

safe_context_mismatch_fixture:
  mismatch_alias: safe_context_mismatch_case_1
  raw_idempotency_key_status: prohibited
  relevance: optional_control_only
  purpose: prove RF_IDEMPOTENCY_KEY_CONTEXT_MISMATCH remains unchanged
```

Environment fixtures:

```text
environment_scope: staging_only
execution_window_status: named_window_required
safe_actor_registry_status: required_before_execution
production_routing_status: prohibited
real_payment_status: prohibited
irreversible_spend_status: prohibited
points_path_status: safe_simulated_points_path_required_if_paid_claim_surface_requires_spend
durable_diagnostics_dependency_status: must_not_be_required_for_allow_deny
```

Fixture gaps for future G14:

- named staging execution window;
- safe actor registry;
- safe paid offer/listing aliases;
- explicit fixture owner;
- WLS/privacy-safe evidence bundle location;
- disabled validation harness shape;
- malformed and inconsistent out-of-scope fixtures if G14 chooses to include them;
- diagnostics unavailable simulator that does not affect source availability.

## 8. Evidence Format Plan

G13 defines the planned evidence shape only.

All `actual_*` fields below are placeholders until a later slice explicitly executes validation. G13 must not fill them with evidence claims.

Planned evidence record:

```text
case_id: planned_case_id_only
candidate: source_unavailable | source_timeout | control_only | out_of_scope
source_scenario: source_unavailable | source_timeout | grant | deny | degraded | malformed_out_of_scope | inconsistent_out_of_scope
expected_guard_status: guard_disabled | candidate_observed_disabled | hidden_activation_blocked | candidate_not_observed
actual_guard_status: planned_placeholder_not_evidence
expected_envelope_status: disabled_not_activated
actual_envelope_status: planned_placeholder_not_evidence
expected_authority_mode: legacy_vip_spacer_still_authoritative
actual_authority_mode: planned_placeholder_not_evidence
expected_runtime_behavior: unchanged
actual_runtime_behavior: planned_placeholder_not_evidence
expected_diagnostics_boundary: non_authoritative_observability_only
actual_diagnostics_boundary: planned_placeholder_not_evidence
expected_side_effect_count: zero_new_runtime_side_effects
actual_side_effect_count: planned_placeholder_not_evidence
expected_privacy_status: wls_privacy_safe_aliases_only
actual_privacy_status: planned_placeholder_not_evidence
result_class: not_executed
evidence_status: planned_not_collected
execution_status: not_executed
```

Allowed planned result classes:

```text
planned_pass_condition
planned_fail_condition
planned_stop_condition
not_executed
```

Disallowed evidence claims in G13:

- executed pass;
- executed fail;
- production behavior evidence;
- fail-closed evidence;
- replay rejection evidence;
- approval evidence;
- Slice 16 readiness evidence.

## 9. Diagnostics Independence Checks

Future validation should plan checks for:

- diagnostics disabled;
- diagnostics unavailable;
- durable diagnostics unavailable;
- shadow snapshot unavailable;
- source unavailable still not driven by diagnostics;
- source timeout still not driven by diagnostics;
- allow/deny behavior unchanged by diagnostics availability;
- diagnostics write failure does not block paid claim behavior;
- diagnostics read failure does not become source availability signal;
- diagnostics aggregate status does not become authority.

Planned diagnostics cases:

```text
DIA-SRC-01:
  condition: diagnostics_disabled
  expected_runtime_behavior: unchanged
  expected_guard_status: candidate_observed_disabled_or_guard_disabled_metadata_only
  execution_status: not_executed

DIA-SRC-02:
  condition: durable_diagnostics_unavailable
  expected_runtime_behavior: unchanged
  expected_fail_closed_status: not_implemented
  execution_status: not_executed

DIA-SRC-03:
  condition: shadow_snapshot_unavailable
  expected_runtime_behavior: unchanged
  expected_authority_mode: legacy_vip_spacer_still_authoritative
  execution_status: not_executed
```

Diagnostics independence conclusion:

```text
diagnostics_independence_plan_status: designed_not_executed
```

## 10. Hidden Activation Checks

Future validation should plan checks for:

- G12 guard disabled by default;
- hidden guard activation requested but blocked;
- G9 staging envelope disabled by default;
- hidden envelope activation requested but blocked;
- `sourceAvailabilityGuardEnabled` remains `false`;
- `sourceAvailabilityFailClosedEnabled` remains `false`;
- `sourceAvailabilityProductionRoutingEnabled` remains `false`;
- `sourceAvailabilityAuthorityEnabled` remains `false`;
- `sourceAvailabilityReplayRejectionEnabled` remains `false`;
- `sourceAvailabilityInvalidationEnabled` remains `false`;
- no route/store decision branch reads the guard;
- no production config can activate the guard;
- no environment-driven production routing.

Planned hidden activation evidence shape:

```text
GATE-SRC-01:
  condition: default_disabled
  expected_guard_status: guard_disabled_or_candidate_observed_disabled
  expected_gate_state: gate_disabled
  expected_runtime_behavior: unchanged
  execution_status: not_executed

GATE-SRC-02:
  condition: hidden_activation_requested
  expected_guard_status: hidden_activation_blocked
  expected_guard_enabled: false
  expected_fail_closed_enabled: false
  expected_production_routing_enabled: false
  expected_authority_enabled: false
  execution_status: not_executed

GATE-SRC-03:
  condition: staging_envelope_activation_requested
  expected_envelope_status: hidden_activation_blocked
  expected_envelope_active: false
  execution_status: not_executed
```

Hidden activation conclusion:

```text
hidden_activation_plan_status: designed_not_executed
```

## 11. Rollback / Kill-Switch Observation Plan

G13 does not implement rollback or kill-switch behavior.

Future validation should observe:

- baseline legacy authority;
- candidate guard disabled;
- staging envelope disabled;
- staged validation mode if future G14 introduces a disabled harness;
- kill-switch state observed as disabled/no enforcement baseline;
- rollback to disabled state;
- post-rollback source state summary;
- post-rollback replay state summary;
- post-rollback cache state summary;
- post-rollback identity state summary;
- no production routing during or after rollback.

Planned rollback observation cases:

```text
RB-SRC-01:
  phase: pre_validation_baseline
  expected_authority_mode: legacy_vip_spacer_still_authoritative
  expected_guard_status: disabled_not_active
  execution_status: not_executed

RB-SRC-02:
  phase: disabled_harness_observed
  expected_kill_switch_state: no_enforcement_baseline
  expected_runtime_behavior: unchanged
  execution_status: not_executed

RB-SRC-03:
  phase: post_rollback_observation
  expected_guard_status: disabled_not_active
  expected_envelope_status: disabled_not_activated
  expected_production_routing: not_touched
  execution_status: not_executed
```

Rollback conclusion:

```text
rollback_kill_switch_observation_plan_status: designed_not_executed
```

## 12. WLS / Privacy-Safe Evidence Protocol

G13 planned evidence must exclude:

- raw user IDs;
- raw idempotency keys;
- request IDs;
- correlation IDs;
- source payloads;
- payment data;
- transaction IDs;
- raw source adapter payloads;
- raw entitlement payloads;
- secrets;
- gateway auth headers;
- low-volume actor identifiers.

G13 planned evidence may include:

- safe actor aliases;
- safe offer/listing aliases;
- safe case IDs;
- aggregate-safe bucket labels;
- guard status labels;
- candidate class labels;
- staging envelope labels;
- authority mode labels;
- diagnostics boundary labels;
- planned expected/actual placeholders;
- execution status `not_executed`;
- evidence status `planned_not_collected`.

Safe evidence bundle structure:

```text
evidence_bundle:
  bundle_id: safe_alias_only
  slice: G13
  execution_status: not_executed
  evidence_status: planned_not_collected
  cases:
    - case_id
    - candidate
    - source_scenario
    - expected_guard_status
    - actual_guard_status_placeholder
    - expected_runtime_behavior
    - actual_runtime_behavior_placeholder
    - expected_privacy_status
    - actual_privacy_status_placeholder
  prohibited_fields:
    - raw_user_id
    - raw_idempotency_key
    - request_id
    - correlation_id
    - source_payload
    - payment_data
    - transaction_id
```

Privacy conclusion:

```text
wls_privacy_safe_evidence_protocol_status: designed_not_executed
```

## 13. Stop Conditions

Stop if:

- validation execution is attempted in G13;
- fixture execution is attempted in G13;
- staging activation is attempted;
- fail-closed behavior is implemented;
- source availability enforcement is implemented;
- replay runtime is implemented;
- replay rejection is added;
- production routing is touched;
- production config is added;
- authority switch is added;
- diagnostics become authority;
- diagnostics failure is treated as source failure;
- source unavailable/timeout comes only from diagnostics;
- raw PII enters evidence;
- raw secrets enter evidence;
- raw payment data enters evidence;
- raw source payload enters evidence;
- raw idempotency keys enter evidence;
- unsupported cases are counted as passed;
- actual evidence is claimed without execution;
- Slice 16 readiness is implied;
- approval is implied.

Stop-condition summary:

```text
stop_condition_status: validation_blocked_until_disabled_harness_safe_fixtures_named_window_privacy_protocol_and_governance_review_exist
```

## 14. Future G14 Boundary

Potential next slice:

```text
recommended_next_slice: phase_g_slice_g14_source_unavailable_timeout_staging_validation_harness_disabled
```

G14 may be allowed to create:

- disabled validation harness;
- safe fixture definitions;
- planned evidence schemas;
- safe actor alias registry;
- staging-only named window representation;
- diagnostics independence test hooks;
- hidden activation test hooks;
- rollback/kill-switch observation hooks;
- no-op validation runner shape if explicitly kept disabled.

G14 must not:

- execute validation unless separately authorized;
- activate fail-closed;
- activate the G9 staging envelope;
- activate the G12 guard;
- change production routing;
- switch authority;
- reject replay;
- invalidate source/cache/replay/identity state;
- approve enforcement;
- trigger Slice 16.

G14 must preserve:

```text
staging_envelope_runtime_status: disabled_not_activated
source_unavailable_timeout_guard_status: disabled_not_active
authority_runtime_status: legacy_vip_spacer_still_authoritative
diagnostics_sink_authority_status: non_authoritative_observability_only
```

## 15. Recommended Next Slice

Recommended next slice:

```text
recommended_next_slice: phase_g_slice_g14_source_unavailable_timeout_staging_validation_harness_disabled
```

Rationale:

- G13 only plans validation and fixture design.
- The safest next step is an inert disabled harness that encodes safe fixtures and evidence schemas without execution.
- Active fail-closed behavior remains premature.
- Runtime-authoritative source status, timeout threshold ownership, diagnostics independence, rollback behavior, and WLS/privacy-safe evidence still require later proof.

This recommendation is not authorization.

## 16. Final Classification

```text
slice_g13_status: review_ready_source_unavailable_timeout_staging_validation_plan_fixture_design
phase_g_status: implementation_phase_in_progress_bounded_slices_only
g1_to_g12_status: completed_shadow_graph_disabled_envelope_correlation_candidate_design_and_guard_skeleton
validation_plan_status: designed_not_executed
fixture_design_status: designed_not_executed
validation_execution_status: not_executed
staging_envelope_runtime_status: disabled_not_activated
source_unavailable_timeout_guard_status: disabled_not_active
runtime_implementation_status: no_runtime_code_change_in_g13
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
recommended_next_slice: phase_g_slice_g14_source_unavailable_timeout_staging_validation_harness_disabled
```

## 17. Final Classification - Acceptance Status

Acceptance criteria status:

```text
g1_to_g12_reviewed: yes
staging_validation_scope_defined: yes
fixture_design_matrix_created: yes
expected_actual_evidence_format_planned: yes
diagnostics_independence_checks_planned: yes
hidden_activation_checks_planned: yes
rollback_kill_switch_observation_planned: yes
wls_privacy_safe_evidence_protocol_defined: yes
stop_conditions_listed: yes
future_g14_boundary_defined: yes
validation_execution_added: no
runtime_code_changed_in_g13: no
fail_closed_behavior_added: no
replay_rejection_added: no
authority_switch_added: no
staging_activation_added: no
production_routing_changes_added: no
docs_artifact_created: yes
```

## 18. Final Classification - Boundary Conclusion

```text
validation_plan != validation_execution
fixture_design != fixture_execution
candidate_guard_skeleton != active_guard
source_unavailable_timeout_validation_plan != fail_closed_runtime
staging_validation_plan != staging_activation
diagnostics != authority
runtime != approval
implementation != rollout
legacy_vip_spacer_still_authoritative
non_authoritative_observability_only
slice_16_status: blocked_not_triggered
enforcement_approval_status: not_approved
```
