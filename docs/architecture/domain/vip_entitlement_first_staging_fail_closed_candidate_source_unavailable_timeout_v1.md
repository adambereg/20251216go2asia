# VIP Entitlement Runtime Authority - First Staging Fail-Closed Candidate: Source Unavailable / Timeout v1

Date: 2026-05-15  
Status: `REVIEW_READY_FIRST_STAGING_FAIL_CLOSED_CANDIDATE_DESIGN_SOURCE_UNAVAILABLE_TIMEOUT`  
Slice: `VIP Entitlement Runtime Authority / Phase G / Slice G11`  
Mode: design-only candidate selection, no fail-closed runtime, no replay runtime, no staging activation, no authority switch, no production rollout, no approval

## 1. Executive Summary

**FACT:** Slice G11 is a design-only candidate selection slice.

**FACT:** Slice G11 selects `source_unavailable` / `source_timeout` as the first narrow future staging-only fail-closed candidate.

**FACT:** Slice G11 does not implement fail-closed runtime.

**FACT:** Slice G11 does not implement replay runtime.

**FACT:** Slice G11 does not activate the G9 staging envelope.

**FACT:** Slice G11 does not add allow/deny behavior.

**FACT:** Slice G11 does not reject replay.

**FACT:** Slice G11 does not invalidate replay, cache, source, identity, lifecycle, policy, rollback, or entitlement state.

**FACT:** Slice G11 does not switch runtime authority.

**FACT:** Slice G11 does not change RF paid claim behavior.

**FACT:** Slice G11 does not change production routing or production config.

**FACT:** Slice G11 does not trigger Slice 16.

**FACT:** Slice G11 does not approve enforcement.

G11 chooses this candidate because G8 identified `source_unavailable` and `source_timeout` as possible first future staging cases, G9 created a disabled envelope skeleton, and G10 connected source/replay/fail-closed inputs into non-authoritative shadow correlation. This is still not enough for implementation.

Current authority remains:

```text
authority_runtime_status: legacy_vip_spacer_still_authoritative
```

Diagnostics remain:

```text
diagnostics_sink_authority_status: non_authoritative_observability_only
```

## 2. Input Context

Primary G1-G10 artifacts reviewed:

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

Code context reviewed without changes:

- `apps/rf-service/src/vipEntitlementShadow.ts`
- `apps/rf-service/src/store.ts`
- `apps/rf-service/src/routes/rf.ts`
- `packages/vip-entitlement-runtime-contracts/src/index.ts`

## 3. G1-G10 Status Review

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

G10 status:

```text
replay_fail_closed_correlation_status: implemented_non_authoritative_correlation_only
runtime_decision_behavior_status: unchanged
```

Verified boundary:

```text
active_rf_paid_claim_behavior_status: unchanged
authority_runtime_status: legacy_vip_spacer_still_authoritative
diagnostics_sink_authority_status: non_authoritative_observability_only
enforcement_runtime_status: not_implemented
replay_runtime_status: not_implemented
fail_closed_runtime_status: not_implemented
```

## 4. Purpose of G11

G11 defines the first narrow future staging-only fail-closed candidate:

```text
candidate: source_unavailable / source_timeout
```

G11 defines:

- exact candidate scope;
- out-of-scope cases;
- why this candidate is safer than broader alternatives;
- current source availability reality;
- runtime-authoritative input requirements;
- staging-only envelope requirements;
- stop conditions;
- F5 evidence / validation mapping;
- security and fraud considerations;
- future G12 boundaries.

G11 does not authorize future implementation. It only prepares the design boundary for a possible G12.

## 5. G11 Non-Goals

G11 does not:

- implement fail-closed runtime;
- implement replay runtime;
- implement source-read runtime authority;
- activate staging envelope;
- activate gates;
- add allow/deny behavior;
- reject replay;
- invalidate source/cache/replay/identity state;
- implement source timeout thresholds;
- implement source adapter trust;
- change RF paid claim behavior;
- change production routing;
- approve enforcement;
- trigger Slice 16.

Required invariants:

```text
candidate_design != candidate_implementation
source_unavailable_design != fail_closed_runtime
source_timeout_design != fail_closed_runtime
staging_only_candidate != staging_activation
diagnostics != authority
shadow_source_classification != runtime_source_authority
runtime != approval
implementation != rollout
legacy_vip_spacer_still_authoritative
non_authoritative_observability_only
slice_16_status: blocked_not_triggered
enforcement_approval_status: not_approved
```

## 6. Candidate Scope

In scope for the future candidate:

- only source availability failure;
- only `source_unavailable`;
- only `source_timeout`;
- only future staging-only scope;
- only RF paid claim entitlement source-read context;
- only behind a future disabled-by-default candidate-specific staging guard;
- only non-production / named staging scope until later approval;
- only diagnostics-safe evidence summaries.

Explicitly out of scope:

- `source_malformed`;
- `source_inconsistent`;
- `source_degraded` as a fail-closed trigger;
- `unknown_freshness`;
- `cache_read_failure`;
- `policy_version_unknown`;
- `subject_binding_missing`;
- `identity_downgrade_detected`;
- `replay_ambiguity`;
- replay rejection;
- identity enforcement;
- policy version enforcement;
- production scope.

Scope conclusion:

```text
candidate_scope_status: source_unavailable_timeout_only
```

## 7. Why Source Unavailable / Timeout First

`source_unavailable` / `source_timeout` is safer than broader cases because:

- it is narrow and source-availability-specific;
- G3/G4 already classify source unavailability and timeout in shadow;
- G10 can summarize the candidate input state without authorizing it;
- it does not require replay rejection;
- it does not require identity enforcement;
- it does not require policy-version enforcement;
- it can be staged with synthetic source unavailable and timeout fixtures;
- it can be bounded to RF paid claim source-read context.

Comparison against deferred candidates:

- `unknown_freshness` is broader and depends on authoritative TTL/cache semantics.
- `cache_read_failure` risks diagnostics-driven deny and needs cache failure policy.
- `policy_version_unknown` needs authoritative policy source and mismatch behavior.
- `subject_binding_missing` needs trusted identity/subject runtime boundary.
- `identity_downgrade_detected` needs authoritative downgrade events and replay/rollback semantics.
- `replay_ambiguity` needs governance-grade replay runtime and side-effect evidence.
- `source_malformed` / `source_inconsistent` need canonical parser, schema trust, and conflict semantics before any fail-closed behavior.

Candidate readiness remains:

```text
source_unavailable_timeout_candidate_status: designed_for_future_staging_only_not_active
```

## 8. Current Source Availability Reality

Current source-read scenarios in `vipEntitlementShadow.ts` include:

- `source_timeout`;
- `source_unavailable`;
- `degraded`;
- `unknown_source`;
- `stale`;
- `grant`;
- `deny`;
- `role_mirror`.

Current shadow behavior:

- `source_timeout` produces `reasonCode: source_timeout`, `adapterStatus: timeout`, `sourceFresh: false`, `sourceAgeMs: null`, `sourceLatencyMs: null`;
- `source_unavailable` produces `reasonCode: source_unavailable`, `adapterStatus: unavailable`, `sourceFresh: false`, `sourceAgeMs: null`, `sourceLatencyMs: null`;
- G3 freshness metadata classifies these as `source_timeout` / `source_unavailable`;
- G4 source authenticity/version metadata classifies source consistency as `source_timeout` / `source_unavailable`;
- G10 `failClosedInputSummary` can summarize source/freshness/replay/staging/diagnostics input buckets;
- G9 staging envelope remains disabled.

Current limitations:

- source-read mode is shadow-only unless `shadow_read_only` is enabled;
- source classification is not runtime authority;
- source adapter status is not authenticated runtime input;
- timeout threshold is not named as runtime policy;
- diagnostics availability must not decide allow/deny;
- no runtime fail-closed path exists;
- no production routing is tied to source availability.

Reality conclusion:

```text
shadow_source_classification_status: available_for_observation_only
runtime_authoritative_source_status: required_not_proven
```

## 9. Runtime-Authoritative Input Requirements

Future implementation cannot use current shadow metadata as authority.

Required before any G12 implementation:

- runtime source-read path separate from diagnostics;
- source status produced by runtime-authoritative source adapter;
- trusted source adapter identity;
- known source adapter version and compatibility rule;
- authenticated source boundary or equivalent trust model;
- named timeout threshold;
- named staging-only timeout threshold owner;
- distinction between source-read errors and diagnostics errors;
- deterministic handling of unavailable versus timeout;
- WLS/privacy-safe source failure evidence;
- no dependency on in-memory diagnostics snapshot;
- no dependency on durable diagnostics write success;
- proof that diagnostics unavailable does not trigger denial;
- proof that production routing is untouched.

Required statuses:

```text
source_status_runtime_authority: required_not_proven
timeout_threshold_status: required_not_defined
source_adapter_trust_status: required_not_proven
source_version_auth_boundary_status: required_not_proven
diagnostics_independence_status: required_not_proven
```

## 10. Staging-Only Envelope Requirements

Future G12 can be considered only if:

- G9 disabled envelope skeleton remains present;
- candidate-specific staging flag exists;
- flag defaults disabled;
- staging-only scope is named;
- safe actors are named;
- source unavailable fixture exists;
- source timeout fixture exists;
- no production routing is touched;
- no authority switch is possible;
- explicit kill-switch exists;
- rollback observation path exists;
- expected/actual evidence summary format exists;
- WLS/privacy-safe evidence protocol exists;
- QA/security review is required;
- residual risk disposition is required;
- Slice 16 remains blocked.

Future envelope must preserve:

```text
staging_envelope_runtime_status: disabled_not_activated
authority_runtime_status: legacy_vip_spacer_still_authoritative
diagnostics_sink_authority_status: non_authoritative_observability_only
```

## 11. Stop Conditions

Stop if:

- source unavailable/timeout comes only from diagnostics;
- source status is not runtime-authoritative;
- timeout threshold is undefined;
- source adapter trust is undefined;
- source version/auth boundary is undefined;
- source-read errors cannot be distinguished from diagnostics errors;
- production routing is touched;
- staging envelope is activated in G11;
- fail-closed logic is implemented in G11;
- replay rejection is added;
- identity enforcement is added;
- policy enforcement is added;
- cache invalidation is added;
- rollback path is undefined;
- safe fixtures are missing;
- safe actors are missing;
- evidence is claimed without execution;
- review is treated as authorization.

Stop-condition summary:

```text
stop_condition_status: fail_closed_candidate_blocked_until_runtime_authority_staging_scope_evidence_and_rollback_exist
```

## 12. Evidence / Validation Mapping

F5 mapping for this candidate:

- `SRC-01`: source unavailable staging fixture and expected candidate behavior;
- `SRC-02`: source timeout staging fixture and expected candidate behavior;
- `SRC-03`: degraded source related context only, out of candidate trigger scope unless later explicitly selected;
- `TTL`: interaction between source availability and freshness/TTL, especially unknown freshness exclusion;
- `DIA`: diagnostics independence and proof diagnostics failure does not deny;
- `GATE`: disabled-by-default flag, staging-only guard, hidden activation checks;
- `AUTH`: no hidden authority switch and legacy authority preserved;
- `RB`: rollback/hybrid state observation and kill-switch path;
- `WLS/PRIV`: safe actors, safe evidence windows, no raw identities or request payloads;
- `SEC-SOURCE`: source spoofing, degraded fallback, timeout abuse, and adapter trust review.

Evidence not allowed in G11:

- executed fail-closed evidence;
- production denial evidence;
- replay rejection evidence;
- approval evidence;
- Slice 16 readiness evidence.

Evidence status:

```text
evidence_execution_status: not_executed
validation_execution_status: not_executed
qa_security_signoff_status: not_started
```

## 13. Security / Fraud Considerations

Key risks:

- attacker causes source timeout to induce denial if future guard is too broad;
- attacker spoofs adapter status if source trust is weak;
- degraded source is confused with unavailable source;
- diagnostics outage is treated as source outage;
- source timeout threshold is too low or environment-dependent;
- staging flag becomes hidden production gate;
- kill-switch leaves hybrid source/cache/replay state;
- evidence leaks low-volume actor or fixture identity;
- fail-closed behavior is generalized beyond source unavailable/timeout.

Required mitigations before implementation:

- source trust model;
- timeout threshold ownership;
- staging-only safe fixtures;
- diagnostics independence test plan;
- hidden activation tests;
- rollback/kill-switch observation plan;
- WLS/privacy-safe evidence review;
- security/fraud review of source outage abuse.

## 14. Future G12 Boundary

Potential next slice:

```text
recommended_next_slice: phase_g_slice_g12_source_unavailable_timeout_staging_guard_skeleton_disabled
```

G12, if selected, must be:

- staging-only;
- disabled by default;
- candidate-specific to `source_unavailable` / `source_timeout`;
- no production routing;
- no authority switch;
- no approval;
- no Slice 16 trigger;
- no broad fail-closed behavior;
- no replay rejection;
- no identity enforcement;
- no policy enforcement;
- no cache invalidation.

G12 may only create a disabled candidate-specific staging guard skeleton if all G11 stop conditions remain represented and no runtime activation is introduced.

G12 must not implement active fail-closed behavior unless a later approved slice explicitly authorizes it after evidence.

## 15. Recommended Next Slice

Recommended next slice:

```text
recommended_next_slice: phase_g_slice_g12_source_unavailable_timeout_staging_guard_skeleton_disabled
```

Rationale:

- G11 has selected and scoped the narrow candidate.
- The safest next step is a disabled candidate-specific staging guard skeleton, not active denial.
- G12 should encode candidate-specific labels, disabled flag shape, safe fixtures, and stop conditions without changing runtime behavior.
- Active staging execution remains later work and is not authorized by G11.

This recommendation is not authorization.

## 16. Final Classification

```text
slice_g11_status: review_ready_first_staging_fail_closed_candidate_design_source_unavailable_timeout
phase_g_status: implementation_phase_in_progress_bounded_slices_only
g1_to_g10_status: completed_shadow_graph_disabled_envelope_and_correlation
candidate_design_status: completed_design_only_not_implemented
candidate_scope_status: source_unavailable_timeout_only
runtime_authoritative_source_status: required_not_proven
staging_envelope_runtime_status: disabled_not_activated
runtime_implementation_status: no_runtime_code_change_in_g11
runtime_decision_behavior_status: unchanged
authority_runtime_status: legacy_vip_spacer_still_authoritative
diagnostics_sink_authority_status: non_authoritative_observability_only
enforcement_runtime_status: not_implemented
replay_runtime_status: not_implemented
fail_closed_runtime_status: not_implemented
source_unavailable_timeout_candidate_status: designed_for_future_staging_only_not_active
slice_16_status: blocked_not_triggered
enforcement_approval_status: not_approved
production_status: not_touched
recommended_next_slice: phase_g_slice_g12_source_unavailable_timeout_staging_guard_skeleton_disabled
```

## 17. Final Classification - Acceptance Status

Acceptance criteria status:

```text
g1_g2_g3_g4_g5_g6_g7_g8_g9_g10_reviewed: yes
candidate_scope_limited_to_source_unavailable_source_timeout: yes
out_of_scope_cases_explicitly_listed: yes
runtime_authoritative_input_requirements_defined: yes
staging_only_envelope_requirements_defined: yes
stop_conditions_listed: yes
f5_evidence_mapping_included: yes
future_g12_boundary_defined: yes
runtime_code_changed_in_g11: no
fail_closed_behavior_added: no
replay_rejection_added: no
authority_switch_added: no
staging_activation_added: no
production_routing_changes_added: no
docs_artifact_created: yes
```

Boundary conclusion:

```text
candidate_design != candidate_implementation
source_unavailable_design != fail_closed_runtime
source_timeout_design != fail_closed_runtime
staging_only_candidate != staging_activation
diagnostics != authority
shadow_source_classification != runtime_source_authority
runtime != approval
implementation != rollout
legacy_vip_spacer_still_authoritative
non_authoritative_observability_only
slice_16_status: blocked_not_triggered
enforcement_approval_status: not_approved
```
