# VIP Entitlement Runtime Authority - Runtime Evidence Requirements Matrix v1

Date: 2026-05-15  
Status: `REVIEW_READY_RUNTIME_EVIDENCE_REQUIREMENTS_MATRIX_NOT_EXECUTION_NOT_APPROVAL`  
Slice: `VIP Entitlement Runtime Authority / Phase F / Slice F5`  
Mode: docs-only runtime evidence requirements matrix, no runtime implementation, no validation execution, no rollback proof, no enforcement, no authority switch, no rollout

## 1. Executive Summary

**FACT:** Slice F5 creates a docs-only requirements matrix for future runtime evidence artifacts.

**FACT:** Slice F5 does not collect evidence.

**FACT:** Slice F5 does not execute staging validation.

**FACT:** Slice F5 does not implement runtime behavior.

**FACT:** Slice F5 does not prove rollback.

**FACT:** Slice F5 does not approve enforcement.

**FACT:** Slice F5 does not start Phase G.

**FACT:** Slice F5 does not start Phase H.

**FACT:** Slice F5 does not start Phase I.

**FACT:** Slice F5 does not trigger Slice 16.

**FACT:** Runtime authority remains `legacy_vip_spacer_still_authoritative`.

**FACT:** Durable diagnostics remain `non_authoritative_observability_only`.

**IMPORTANT:** `evidence_requirements != evidence_execution`.

**IMPORTANT:** `evidence_requirements != approval`.

**IMPORTANT:** `rollback_evidence_expectations != rollback_proof`.

**IMPORTANT:** `readiness != implementation`.

This matrix converts Phase E gaps, F1 readiness domains, F2 runtime domains, F3 future implementation areas and stop conditions, and F4 rollback/safety expectations into requirements for future Phase G/H evidence bundles. It defines what future executed evidence must contain before Phase H can even consider governance approval review. It does not produce that evidence.

## 2. Input Context

This artifact uses the updated VIP Entitlement Runtime Authority roadmap as the canonical source of truth:

- `docs/roadmaps/go2asia_vip_entitlement_runtime_authority_roadmap_updated.md`

Primary Phase F inputs:

- `docs/architecture/domain/vip_entitlement_runtime_enforcement_implementation_readiness_review_v1.md`
- `docs/architecture/domain/vip_entitlement_runtime_domain_decomposition_v1.md`
- `docs/architecture/domain/vip_entitlement_runtime_implementation_order_plan_v1.md`
- `docs/architecture/domain/vip_entitlement_runtime_rollback_safety_design_v1.md`

Primary Phase E evidence and validation inputs:

- `docs/architecture/domain/vip_entitlement_enforcement_preconditions_evidence_closure_review_v1.md`
- `docs/architecture/domain/vip_entitlement_staging_validation_execution_bundle_rerun_v1.md`

Supporting validation inputs:

- `docs/architecture/domain/vip_entitlement_staging_validation_execution_scope_v1.md`
- `docs/architecture/domain/vip_entitlement_staging_validation_execution_bundle_v1.md`
- `docs/architecture/domain/vip_entitlement_staging_validation_execution_capability_unblock_v1.md`
- `docs/architecture/domain/vip_entitlement_targeted_wls_closure_review_v1.md`
- governance policy artifacts from Slices 10 through 13.1

Relevant AI Ops workflow context:

- `docs/ai/roles_overview.md`
- `docs/ai/agents_index.md`
- `docs/ai/workflows.md`
- `docs/ai/context_map_for_cursor.md`
- `docs/ai/workflows/auto_routing.md`
- `docs/ai/workflows/pipeline_overview.md`
- `docs/ai/workflows/review_pipeline.md`
- `docs/ai/workflows/agent_lifecycle.md`
- `docs/ai/roles/*`

## 3. Current Status

```text
phase_e_status: closed_with_runtime_implementation_gaps
f1_status: completed_runtime_enforcement_implementation_readiness_review
f2_status: completed_runtime_domain_decomposition
f3_status: completed_runtime_implementation_order_plan
f4_status: completed_runtime_rollback_safety_design
phase_f_status: readiness_workstream_in_progress_docs_only
phase_g_status: not_started
phase_h_status: not_started
phase_i_status: not_started
runtime_gap_status: primary_blocker_confirmed
validation_execution_status: blocked_not_executed
validation_result_classification: not_executed
rollback_proof_status: not_proven
slice_16_status: blocked_not_triggered
enforcement_approval_status: not_approved
authority_runtime_status: legacy_vip_spacer_still_authoritative
diagnostics_sink_authority_status: non_authoritative_observability_only
runtime_change_status: no_runtime_change
production_status: not_touched
```

Status interpretation:

- Phase F is in progress as readiness and planning only.
- F1 completed readiness review.
- F2 completed runtime domain decomposition.
- F3 completed future implementation order planning.
- F4 completed rollback and safety design.
- F5 starts as a docs-only evidence requirements matrix.
- Phase G runtime implementation has not started.
- Phase H runtime validation and governance approval review has not started.
- Phase I controlled enforcement rollout has not started.
- Slice 16 remains blocked and not triggered.
- Enforcement is not approved.
- Rollback proof is not proven.
- Validation execution remains blocked and not executed.
- Runtime authority remains legacy.
- Diagnostics remain non-authoritative.

## 4. Evidence Requirements Purpose

Slice F5 defines the future evidence requirements that Phase G implementation slices and Phase H validation artifacts must satisfy before governance approval review can be considered.

F5 answers:

- which future evidence classes must exist for TTL/cache, replay, identity, canonical source, rollback, diagnostics, gates, authority, security/fraud, and WLS/privacy domains;
- which runtime domains must exist before a case can be executed;
- which actor, fixture, and safe execution window requirements apply;
- which expected/actual result taxonomy future evidence bundles must use;
- which safe evidence format is allowed;
- which evidence is prohibited;
- which authority, rollback, gate, and diagnostics labels must be present;
- which QA/security review criteria apply to future executed evidence;
- which missing evidence would block Phase H or Slice 16;
- which residual risks require closure or explicit named-scope disposition.

F5 is a requirements artifact. It is not an evidence bundle.

## 5. Evidence Requirements Non-Goals

Slice F5 does not include:

- runtime implementation;
- validation execution;
- rollback drill execution;
- rollback proof;
- code changes;
- migrations;
- API behavior changes;
- feature flag creation or activation;
- staging or production rollout;
- production configuration changes;
- enforcement logic;
- canonical authority switch;
- diagnostics authority promotion;
- legacy cleanup;
- economy expansion;
- Slice 16 trigger;
- governance approval artifact.

These non-goals preserve the active invariants:

```text
policy != evidence
evidence != runtime
runtime != approval
approval != rollout
diagnostics != authority
readiness != implementation
evidence_requirements != evidence_execution
evidence_requirements != approval
rollback_evidence_expectations != rollback_proof
implementation_order_plan != implementation
implementation != approval
review != approval
```

## 6. Source Inputs From Phase E/F1/F2/F3/F4

Phase E closed as a governance/evidence phase with runtime implementation gaps:

- TTL/cache evidence remains blocked by missing runtime behavior, actors, fixtures, safe execution window, and evidence.
- Replay/idempotency evidence remains unsupported without runtime change.
- Identity mismatch evidence remains unsupported without runtime change.
- Canonical source evidence remains unsupported without runtime change.
- Rollback evidence remains blocked because runtime rollback orchestration, bounded run, hybrid-state handling, and safe evidence are missing.
- Diagnostics/privacy evidence remains partial and non-authoritative.
- Staging validation execution remains `blocked_not_executed`.
- QA/security sign-off over executed runtime validation evidence does not exist.

F1 identified readiness domains:

- Replay Runtime Readiness.
- Identity Enforcement Runtime Readiness.
- Cache/Freshness Runtime Readiness.
- Canonical Source Runtime Readiness.
- Source Authenticity / Version Runtime Readiness.
- Runtime Rollback & Hybrid-State Readiness.
- Diagnostics-Independent Fail-Closed Runtime Readiness.
- Runtime Observability & Safety Readiness.
- Authority Transition Readiness.
- Feature Flag / Gate Readiness.
- Staging Validation Evidence Readiness.
- Security / Fraud Abuse Readiness.

F2 decomposed these into future runtime domains and identified cross-domain conflicts:

- replay vs identity downgrade;
- cache freshness vs canonical source timeout;
- source authenticity vs degraded source fallback;
- fail-closed vs availability;
- rollback vs stale replay;
- feature gates vs authority transition;
- observability vs privacy/WLS safety;
- legacy authority vs canonical authority;
- economy/spend coupling vs entitlement enforcement boundary;
- partial RF claim idempotency vs governance-grade replay runtime.

F3 defined future implementation areas and stop conditions, including:

- missing evidence path;
- missing WLS/privacy-safe evidence path;
- missing safe actors or fixtures;
- missing staging execution window;
- missing rollback observation path;
- unclear authority boundary;
- feature gate could become hidden enforcement;
- diagnostics could become authority;
- unsupported runtime cases being counted as passed;
- rollback proof being claimed from design only.

F4 defined rollback/safety evidence expectations:

- rollback mode before/after classification;
- authority mode before/after classification;
- gate and kill-switch state before/after classification;
- replay/idempotency, cache/freshness, source, identity, diagnostics, and legacy fallback before/after rollback;
- hybrid-state classification;
- stale replay and stale cache after rollback classification;
- identity/source rollback mismatch classification;
- safe observation summary;
- WLS/privacy-safe rollback summary;
- QA/security sign-off over executed rollback validation evidence.

F5 converts these inputs into a single future evidence requirements matrix.

## 7. Evidence Requirement Taxonomy

The taxonomy below is required for future evidence bundles. F5 defines these labels only; it does not assign successful execution outcomes.

### 7.1 Expected Result Class

Allowed `expected_result_class` values:

- `fail_closed_for_paid_claim_enforcement`
- `deny_for_paid_claim_enforcement`
- `conflict_for_paid_claim_enforcement`
- `idempotent_no_op_within_approved_boundary`
- `observation_only_non_authoritative`
- `diagnostics_non_authoritative_observation`
- `rollback_to_legacy_expected`
- `post_rollback_monitoring_expected`
- `closed_for_named_wls_bucket_expected`
- `residual_risk_disposition_required`
- `unsupported_until_runtime_exists`

An expected result class is a requirement for future execution. It is not an actual result.

### 7.2 Actual Result Class

Allowed `actual_result_class` values:

- `passed`
- `failed`
- `inconclusive`
- `not_executed`
- `blocked_missing_actor_or_data`
- `blocked_missing_safe_evidence`
- `blocked_missing_safe_window`
- `blocked_missing_runtime_domain`
- `unsupported_without_runtime_change`
- `skipped_unsupported_runtime`
- `passed_for_observation_only`
- `passed_for_diagnostics_non_authority`
- `closed_for_named_bucket`
- `rejected_unsafe_evidence`

No `actual_result_class` in F5 means approval. Unsupported cases must not be counted as passed.

### 7.3 Evidence Status

Allowed `evidence_status` values:

- `not_required_for_this_case`
- `required_not_collected`
- `collected_safe_summary`
- `collected_aggregate_safe`
- `collected_wls_safe_summary`
- `collected_privacy_safe_screenshot`
- `rejected_unsafe`
- `insufficient`
- `accepted_for_review_only`

`accepted_for_review_only` does not mean approval.

### 7.4 Execution Status

Allowed `execution_status` values:

- `not_started`
- `not_executed`
- `blocked`
- `blocked_missing_actor_or_data`
- `blocked_missing_safe_evidence`
- `blocked_missing_safe_window`
- `blocked_missing_runtime_domain`
- `skipped_unsupported_runtime`
- `executed_observation_only`
- `executed_runtime_validation`
- `executed_rollback_validation`

For F5 itself:

```text
execution_status: not_executed
```

### 7.5 Safety Status

Allowed `safety_status` values:

- `not_assessed`
- `safe_summary_required`
- `aggregate_safe_required`
- `wls_privacy_safe_required`
- `unsafe_evidence_rejected`
- `low_volume_bucket_requires_special_handling`
- `residual_risk_open`
- `residual_risk_closed_for_named_scope`
- `residual_risk_accepted_for_named_scope_only`

### 7.6 Authority Mode Label

Allowed `authority_mode_label` values:

- `legacy_authority`
- `shadow_only_observation`
- `partial_implementation_no_authority`
- `bounded_staging_validation`
- `enforcement_gated_staging`
- `rollback_to_legacy`
- `post_rollback_monitoring`
- `candidate_authority_non_approved`
- `authority_transition_not_started`
- `unknown_authority_mode_blocked`

Current required label for F5 baseline:

```text
authority_mode_label: legacy_authority
```

### 7.7 Rollback Mode Label

Allowed `rollback_mode_label` values:

- `not_applicable`
- `no_enforcement_baseline`
- `pre_rollback`
- `rollback_initiated`
- `rollback_to_legacy`
- `post_rollback_monitoring`
- `hybrid_state_classified`
- `hybrid_state_unknown_blocked`
- `rollback_proof_not_proven`

Current required label for F5 baseline:

```text
rollback_mode_label: rollback_proof_not_proven
```

### 7.8 Gate State Label

Allowed `gate_state_label` values:

- `not_applicable`
- `gate_disabled`
- `gate_shadow_only`
- `gate_staging_only`
- `gate_kill_switch`
- `gate_unknown_blocked`
- `hidden_activation_check_required`
- `gate_does_not_switch_authority`

F5 does not create or activate gates.

### 7.9 Diagnostics Mode Label

Allowed `diagnostics_mode_label` values:

- `not_applicable`
- `diagnostics_unavailable`
- `diagnostics_available_non_authoritative`
- `diagnostics_safe_summary_available`
- `diagnostics_safe_summary_missing`
- `diagnostics_to_authority_drift_check_required`
- `diagnostics_authority_promotion_blocked`

Current required label for F5 baseline:

```text
diagnostics_mode_label: diagnostics_available_non_authoritative
```

### 7.10 Runtime Domain Label

Allowed `runtime_domain_label` values:

- `ttl_cache_freshness`
- `replay_idempotency`
- `identity_enforcement`
- `canonical_source`
- `source_authenticity_version`
- `rollback_hybrid_state`
- `diagnostics_observability`
- `feature_gate_kill_switch`
- `authority_transition`
- `security_fraud_abuse`
- `wls_privacy_safe_evidence`
- `staging_validation_evidence`
- `runtime_observability_safe_evidence`

### 7.11 Validation Case Family

Allowed `validation_case_family` values:

- `TTL`
- `RPL`
- `ID`
- `SRC`
- `RB`
- `DIA`
- `OBL`
- `DSO`
- `GATE`
- `AUTH`
- `SEC`
- `WLS`

### 7.12 Residual Risk Status

Allowed `residual_risk_status` values:

- `not_applicable`
- `open`
- `blocked`
- `requires_safe_followup`
- `requires_named_scope_disposition`
- `accepted_for_named_scope_only`
- `closed_for_named_scope`
- `rejected_due_to_unsafe_evidence`

### 7.13 Signoff Status

Allowed `signoff_status` values:

- `not_applicable`
- `not_started`
- `blocked`
- `pending_review`
- `qa_reviewed`
- `security_reviewed`
- `qa_security_signed_off_for_named_scope`

No signoff status in F5 means approval. Future sign-off applies only to executed evidence for a named scope.

## 8. Evidence Requirements Matrix

The rows below are grouped to keep the matrix manageable while preserving material distinctions from Phase E, 15.4, 15.5A, 15.5B, F2, F3, and F4.

Every row inherits the full row schema:

- `case_id`;
- `domain`;
- `evidence_requirement`;
- `prerequisite_runtime_domain`;
- `prerequisite_actors_fixtures`;
- `prerequisite_safe_window`;
- `expected_result_class`;
- `allowed_actual_result_classes`;
- `safe_evidence_format`;
- `prohibited_evidence`;
- `authority_mode_label_required`;
- `rollback_mode_label_required_if_applicable`;
- `gate_state_label_required_if_applicable`;
- `diagnostics_mode_label_required_if_applicable`;
- `wls_privacy_requirement`;
- `qa_security_review_requirement`;
- `blocks_phase_h`;
- `blocks_slice_16`;
- `notes`.

### 8.1 TTL / Cache / Freshness Evidence

| case_id | domain | evidence_requirement | prerequisite_runtime_domain | prerequisite_actors_fixtures | prerequisite_safe_window | expected_result_class | allowed_actual_result_classes | safe_evidence_format | prohibited_evidence | labels required | WLS/privacy requirement | QA/security review requirement | blocks Phase H? | blocks Slice 16? | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TTL-01..TTL-04 | TTL/cache lifecycle | Future evidence must show expired, revoked, refunded, and cancelled entitlement cases do not grant RF paid claim entitlement. | `ttl_cache_freshness`, `identity_enforcement`, `canonical_source` where applicable | Safe lifecycle actor categories or aggregate-safe fixtures for expired/revoked/refunded/cancelled states | Named staging execution window and diagnostics-safe observation window | `fail_closed_for_paid_claim_enforcement` | `passed`, `failed`, `inconclusive`, `blocked_missing_actor_or_data`, `blocked_missing_safe_evidence`, `not_executed` | Safe case id, lifecycle reason bucket, expected/actual class, aggregate counts, no raw actor identity | Raw IDs, emails, raw entitlement metadata, request/response bodies, raw logs, SQL, stack traces | authority: required; diagnostics: required | Aggregate-safe only; low-volume lifecycle buckets need special handling | QA/security review over future executed evidence | yes | yes | Phase E and 15.5B show these remained blocked by missing actors/data. |
| TTL-05 | TTL/cache freshness | Future evidence must show stale cache does not mask expired, revoked, refunded, cancelled, or source-changed entitlement state. | `ttl_cache_freshness`, `canonical_source`, `source_authenticity_version` | Safe stale-cache fixture label, no raw cache contents | Named staging execution and cache/source observation window | `fail_closed_for_paid_claim_enforcement` | `passed`, `failed`, `inconclusive`, `unsupported_without_runtime_change`, `skipped_unsupported_runtime`, `not_executed` | Safe freshness bucket `stale_cache`, source/cache state bucket, aggregate counts | Raw cache rows, raw source payloads, raw IDs, timestamps that identify users | authority: required; diagnostics: required | Aggregate-safe summary required | QA/security review over future executed evidence | yes | yes | Unsupported until future cache/freshness runtime exists. |
| TTL-06 | TTL/cache freshness | Future evidence must show unknown freshness does not silently grant. | `ttl_cache_freshness` | Safe unknown-freshness fixture | Named safe execution window | `fail_closed_for_paid_claim_enforcement` | `passed`, `failed`, `inconclusive`, `unsupported_without_runtime_change`, `skipped_unsupported_runtime`, `not_executed` | Safe freshness bucket `unknown_freshness`, expected/actual class | Raw cache metadata, raw IDs, raw logs | authority: required; diagnostics: required | Aggregate-safe summary required | QA/security review over future executed evidence | yes | yes | Unknown freshness as implicit allow is a stop condition. |
| TTL-07 | TTL/cache failure | Future evidence must show cache read failure does not rely on diagnostics and does not silently grant. | `ttl_cache_freshness`, `diagnostics_observability` | Safe cache-failure fixture or fault bucket | Named safe execution window | `fail_closed_for_paid_claim_enforcement` | `passed`, `failed`, `inconclusive`, `unsupported_without_runtime_change`, `skipped_unsupported_runtime`, `blocked_missing_safe_evidence`, `not_executed` | Safe failure bucket `cache_read_failure`, no raw errors | Stack traces, SQL, raw logs, raw error payloads | authority: required; diagnostics: required | Unsafe error outputs rejected | QA/security review over future executed evidence | yes | yes | Fail-closed must be diagnostics-independent. |
| TTL-08 | TTL/cache clock boundary | Future evidence must classify clock skew and freshness boundary behavior safely. | `ttl_cache_freshness` | Safe clock-skew fixture, no user-identifying timestamps | Named safe execution window | `fail_closed_for_paid_claim_enforcement` | `passed`, `failed`, `inconclusive`, `unsupported_without_runtime_change`, `skipped_unsupported_runtime`, `not_executed` | Safe reason bucket `clock_skew_boundary`, coarse time bucket | Raw timestamps linked to actors, raw IDs | authority: required; diagnostics: required | Low-volume time buckets require special handling | QA/security review over future executed evidence | yes | yes | Future runtime must avoid hidden allow on ambiguous boundary. |
| TTL-09 | TTL/cache source interaction | Future evidence must show stale source with cache interaction does not grant through source/cache mismatch. | `ttl_cache_freshness`, `canonical_source`, `source_authenticity_version` | Safe stale-source/cache fixture | Named source/cache safe window | `fail_closed_for_paid_claim_enforcement` | `passed`, `failed`, `inconclusive`, `unsupported_without_runtime_change`, `skipped_unsupported_runtime`, `not_executed` | Safe combined bucket `stale_source_cache_interaction` | Raw source payloads, raw cache rows, request/response bodies | authority: required; diagnostics: required | Aggregate-safe summary required | QA/security review over future executed evidence | yes | yes | Cross-domain conflict from F2. |

### 8.2 Replay / Idempotency Evidence

| case_id | domain | evidence_requirement | prerequisite_runtime_domain | prerequisite_actors_fixtures | prerequisite_safe_window | expected_result_class | allowed_actual_result_classes | safe_evidence_format | prohibited_evidence | labels required | WLS/privacy requirement | QA/security review requirement | blocks Phase H? | blocks Slice 16? | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| RPL-01 | Replay/idempotency | Future evidence must distinguish exact replay from new request and prevent duplicate side effects outside an approved idempotency boundary. | `replay_idempotency`, `identity_enforcement`, `ttl_cache_freshness` | Safe replay fixture and side-effect count summary | Named safe execution window | `idempotent_no_op_within_approved_boundary` or `conflict_for_paid_claim_enforcement` | `passed`, `failed`, `inconclusive`, `unsupported_without_runtime_change`, `skipped_unsupported_runtime`, `not_executed` | Safe replay bucket `exact_replay`, aggregate side-effect count | Raw idempotency keys, raw request IDs, raw bodies, raw actor IDs | authority: required; gate: if applicable; diagnostics: required | Aggregate-safe only | QA/security review plus fraud review | yes | yes | Partial RF claim idempotency is not governance-grade replay runtime. |
| RPL-02 | Replay/idempotency | Future evidence must prove legitimate retry is safe and does not duplicate claim, redeem, spend, voucher, reward, settlement, or entitlement side effect. | `replay_idempotency`, `security_fraud_abuse` | Safe retry fixture and side-effect count bucket | Named safe execution window | `idempotent_no_op_within_approved_boundary` | `passed`, `failed`, `inconclusive`, `unsupported_without_runtime_change`, `skipped_unsupported_runtime`, `not_executed` | Safe retry bucket `legitimate_retry`, aggregate side-effect count | Raw request bodies, raw transaction IDs, raw wallet/voucher/payment data | authority: required; gate: if applicable | Aggregate-safe side-effect count only | QA/security/fraud review | yes | yes | Legitimate retry must be separable from stale replay. |
| RPL-03..RPL-04 | Replay/stale grants | Future evidence must show stale grant replay and replay after revoke/refund/cancel fail closed or conflict. | `replay_idempotency`, `ttl_cache_freshness`, `identity_enforcement` | Safe lifecycle replay fixtures | Named safe execution window | `fail_closed_for_paid_claim_enforcement` or `conflict_for_paid_claim_enforcement` | `passed`, `failed`, `inconclusive`, `unsupported_without_runtime_change`, `skipped_unsupported_runtime`, `not_executed` | Safe replay lifecycle bucket, no grant classification | Raw entitlement metadata, raw replay keys, raw IDs | authority: required; diagnostics: required | Aggregate-safe summary required | QA/security/fraud review | yes | yes | Stale grant abuse remains a core threat surface. |
| RPL-05 | Replay/cross-subject | Future evidence must show replay with different subject fails closed or conflicts. | `replay_idempotency`, `identity_enforcement` | Safe cross-subject fixture labels only | Named safe execution window | `fail_closed_for_paid_claim_enforcement` or `conflict_for_paid_claim_enforcement` | `passed`, `failed`, `inconclusive`, `unsupported_without_runtime_change`, `skipped_unsupported_runtime`, `not_executed` | Safe replay bucket `different_subject`, subject category mismatch bucket | Raw subject IDs, emails, raw auth/session data | authority: required; diagnostics: required | Raw identities excluded | QA/security/fraud review | yes | yes | Identity must bind replay; diagnostics cannot infer authority. |
| RPL-06 | Replay/semantic mismatch | Future evidence must show changed subject, action, resource, lifecycle, source, policy, or authority context cannot silently grant. | `replay_idempotency`, `canonical_source`, `identity_enforcement` | Safe semantic mismatch fixture | Named safe execution window | `conflict_for_paid_claim_enforcement` or `deny_for_paid_claim_enforcement` | `passed`, `failed`, `inconclusive`, `unsupported_without_runtime_change`, `skipped_unsupported_runtime`, `not_executed` | Safe changed-dimension bucket | Raw payloads, raw source responses, raw IDs | authority: required; gate: if applicable | Aggregate-safe summary required | QA/security/fraud review | yes | yes | Semantic replay mismatch must not be counted as legitimate retry. |
| RPL-07 | Replay/idempotency conflict | Future evidence must show idempotency conflicts deny or conflict and never duplicate side effects. | `replay_idempotency`, `security_fraud_abuse` | Safe conflict fixture and side-effect count summary | Named safe execution window | `conflict_for_paid_claim_enforcement` | `passed`, `failed`, `inconclusive`, `unsupported_without_runtime_change`, `skipped_unsupported_runtime`, `not_executed` | Safe conflict bucket, aggregate side-effect count | Raw idempotency keys, raw transaction/payment/voucher data | authority: required; gate: if applicable | Aggregate-safe only | QA/security/fraud review | yes | yes | Required for double claim/redeem/spend abuse coverage. |
| RPL-08 | Replay/delayed retry | Future evidence must classify delayed retry after lifecycle, source, policy, identity, or authority-mode change. | `replay_idempotency`, `ttl_cache_freshness`, `canonical_source`, `identity_enforcement`, `rollback_hybrid_state` | Safe delayed retry fixture with changed-context bucket | Named safe execution window | `fail_closed_for_paid_claim_enforcement` or `conflict_for_paid_claim_enforcement` | `passed`, `failed`, `inconclusive`, `unsupported_without_runtime_change`, `skipped_unsupported_runtime`, `not_executed` | Safe changed-context bucket | Raw policy/source payloads, raw actor IDs, raw replay keys | authority: required; rollback/gate: if applicable | Aggregate-safe summary required | QA/security/fraud review | yes | yes | Must include rollback epoch and authority mode when applicable. |

### 8.3 Identity Evidence

| case_id | domain | evidence_requirement | prerequisite_runtime_domain | prerequisite_actors_fixtures | prerequisite_safe_window | expected_result_class | allowed_actual_result_classes | safe_evidence_format | prohibited_evidence | labels required | WLS/privacy requirement | QA/security review requirement | blocks Phase H? | blocks Slice 16? | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ID-01 | Identity | Future evidence must show missing trusted subject fails closed for RF paid claim enforcement. | `identity_enforcement` | Safe missing-subject fixture | Named safe execution window | `fail_closed_for_paid_claim_enforcement` | `passed`, `failed`, `inconclusive`, `unsupported_without_runtime_change`, `skipped_unsupported_runtime`, `not_executed` | Safe identity bucket `trusted_subject_missing` | Raw identities, auth tokens, sessions, emails | authority: required; diagnostics: required | Raw actor identities excluded | QA/security review | yes | yes | Gateway/Auth/Connect behavior is not changed by F5. |
| ID-02..ID-04 | Identity mismatch | Future evidence must show trusted subject mismatch, RF principal mismatch, and source subject mismatch fail closed. | `identity_enforcement`, `canonical_source` where applicable | Safe mismatch fixture labels | Named safe execution window | `fail_closed_for_paid_claim_enforcement` | `passed`, `failed`, `inconclusive`, `unsupported_without_runtime_change`, `skipped_unsupported_runtime`, `not_executed` | Safe mismatch buckets only | Raw subject IDs, emails, raw source payloads, tokens | authority: required; diagnostics: required | Raw identities excluded; aggregate-safe only | QA/security review | yes | yes | Covers trusted subject, RF principal, and source subject mismatch. |
| ID-05 | Identity downgrade | Future evidence must show identity downgrade invalidates stale replay/cache/source-derived grant semantics. | `identity_enforcement`, `replay_idempotency`, `ttl_cache_freshness` | Safe identity downgrade fixture | Named safe execution window | `fail_closed_for_paid_claim_enforcement` or `conflict_for_paid_claim_enforcement` | `passed`, `failed`, `inconclusive`, `unsupported_without_runtime_change`, `skipped_unsupported_runtime`, `not_executed` | Safe identity bucket `identity_downgrade`, replay/cache invalidation bucket | Raw identity history, raw session data, raw IDs | authority: required; rollback/gate: if applicable | Raw actor identities excluded | QA/security/fraud review | yes | yes | Replay cannot be bound only to request shape or idempotency key. |

### 8.4 Canonical Source Evidence

| case_id | domain | evidence_requirement | prerequisite_runtime_domain | prerequisite_actors_fixtures | prerequisite_safe_window | expected_result_class | allowed_actual_result_classes | safe_evidence_format | prohibited_evidence | labels required | WLS/privacy requirement | QA/security review requirement | blocks Phase H? | blocks Slice 16? | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SRC-01..SRC-03 | Canonical source availability | Future evidence must show source unavailable, timeout, and degraded states do not silently grant. | `canonical_source`, `source_authenticity_version`, `ttl_cache_freshness` | Safe source failure/degraded fixture | Named source observation and execution window | `fail_closed_for_paid_claim_enforcement` | `passed`, `failed`, `inconclusive`, `unsupported_without_runtime_change`, `skipped_unsupported_runtime`, `not_executed` | Safe source bucket: unavailable/timeout/degraded | Raw source payloads, raw request/response bodies, raw logs | authority: required; diagnostics: required | Aggregate-safe summary required | QA/security review | yes | yes | Canonical source remains non-authoritative until future approved implementation and approval. |
| SRC-04..SRC-06 | Canonical source response integrity | Future evidence must show partial, malformed, and inconsistent responses deny, conflict, or fail closed. | `canonical_source`, `source_authenticity_version` | Safe response-integrity fixture | Named safe execution window | `fail_closed_for_paid_claim_enforcement` or `conflict_for_paid_claim_enforcement` | `passed`, `failed`, `inconclusive`, `unsupported_without_runtime_change`, `skipped_unsupported_runtime`, `not_executed` | Safe response-integrity buckets | Raw source payloads, stack traces, SQL, request/response bodies | authority: required; diagnostics: required | Unsafe parser/error output rejected | QA/security review | yes | yes | Degraded fallback must not bypass enforcement semantics. |
| SRC-07 | Source authenticity | Future evidence must show origin/auth/authenticity mismatch does not grant or become hidden authority. | `source_authenticity_version`, `canonical_source` | Safe source authenticity mismatch fixture | Named safe execution window | `fail_closed_for_paid_claim_enforcement` | `passed`, `failed`, `inconclusive`, `unsupported_without_runtime_change`, `skipped_unsupported_runtime`, `not_executed` | Safe authenticity bucket | Tokens, secrets, raw headers, raw source payloads | authority: required; diagnostics: required | Secrets excluded; aggregate-safe summary required | QA/security review | yes | yes | Covers source spoofing threat. |
| SRC-08..SRC-09 | Source rate/schema/version | Future evidence must show rate-limited source and schema/version mismatch are classified safely. | `source_authenticity_version`, `canonical_source` | Safe rate-limit and schema/version fixtures | Named safe execution window | `fail_closed_for_paid_claim_enforcement` or `conflict_for_paid_claim_enforcement` | `passed`, `failed`, `inconclusive`, `unsupported_without_runtime_change`, `skipped_unsupported_runtime`, `not_executed` | Safe source bucket `rate_limited` or `schema_version_mismatch` | Raw source payloads, raw schema dumps with identifiers, raw logs | authority: required; diagnostics: required | Aggregate-safe summary required | QA/security review | yes | yes | Schema/version downgrade is a fraud and safety surface. |

### 8.5 Rollback / Hybrid-State Evidence

| case_id | domain | evidence_requirement | prerequisite_runtime_domain | prerequisite_actors_fixtures | prerequisite_safe_window | expected_result_class | allowed_actual_result_classes | safe_evidence_format | prohibited_evidence | labels required | WLS/privacy requirement | QA/security review requirement | blocks Phase H? | blocks Slice 16? | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| RB-01 | Rollback after attempted validation | Future evidence must show rollback returns to legacy authority and diagnostics-only posture after a bounded attempted validation. | `rollback_hybrid_state`, `feature_gate_kill_switch`, `runtime_observability_safe_evidence` | Safe bounded non-enforcement run fixture | Bounded staging validation window and rollback observation path | `rollback_to_legacy_expected` | `passed`, `failed`, `inconclusive`, `blocked_missing_safe_window`, `blocked_missing_safe_evidence`, `not_executed` | Safe rollback state summary, authority before/after, diagnostics before/after | Raw logs, screenshots with PII, raw actor identities, stack traces | authority: before/after required; rollback: before/after required; gate: if applicable; diagnostics: before/after required | WLS/privacy-safe rollback summary required | QA/security review over executed rollback evidence | yes | yes | F4 defines expectation only; F5 does not prove rollback. |
| RB-02 | Hybrid state after rollback | Future evidence must classify hybrid state after rollback and block unknown hybrid state. | `rollback_hybrid_state`, `canonical_source`, `ttl_cache_freshness`, `identity_enforcement`, `replay_idempotency` | Safe hybrid-state fixture labels | Bounded rollback and post-rollback monitoring window | `post_rollback_monitoring_expected` | `passed`, `failed`, `inconclusive`, `unsupported_without_runtime_change`, `blocked_missing_safe_evidence`, `not_executed` | Safe hybrid-state class, source/cache/replay/identity validity buckets | Raw source/cache/replay/identity data | authority and rollback labels required; diagnostics required | Aggregate-safe summary required | QA/security/fraud review | yes | yes | Unknown hybrid-state is a stop condition. |
| RB-03 | Stale replay after rollback | Future evidence must show stale replay after rollback fails closed or conflicts. | `rollback_hybrid_state`, `replay_idempotency`, `identity_enforcement`, `ttl_cache_freshness` | Safe post-rollback stale replay fixture | Bounded rollback and post-rollback monitoring window | `fail_closed_for_paid_claim_enforcement` or `conflict_for_paid_claim_enforcement` | `passed`, `failed`, `inconclusive`, `unsupported_without_runtime_change`, `blocked_missing_safe_evidence`, `not_executed` | Safe rollback replay bucket, rollback epoch class | Raw replay keys, raw IDs, raw request bodies | authority/rollback/gate labels required | Aggregate-safe summary required | QA/security/fraud review | yes | yes | Replay keys from old authority mode must not silently remain valid. |
| RB-04 | Identity/source rollback mismatch | Future evidence must show identity/source mismatch after rollback fails closed or becomes review-safe blocked classification. | `rollback_hybrid_state`, `identity_enforcement`, `canonical_source`, `source_authenticity_version` | Safe identity/source mismatch fixture | Bounded rollback and post-rollback monitoring window | `fail_closed_for_paid_claim_enforcement` or `conflict_for_paid_claim_enforcement` | `passed`, `failed`, `inconclusive`, `unsupported_without_runtime_change`, `blocked_missing_safe_evidence`, `not_executed` | Safe identity/source rollback mismatch bucket | Raw source payloads, raw subject IDs, tokens | authority/rollback labels required; diagnostics required | Raw identities excluded | QA/security review | yes | yes | Must distinguish source mismatch from identity downgrade. |
| RB-GATE-01 | Rollback gate/kill-switch | Future evidence must show gate and kill-switch states before/after rollback and prove gate does not switch authority. | `feature_gate_kill_switch`, `rollback_hybrid_state`, `authority_transition` | Safe gate-state fixture labels | Bounded staging gate observation window | `rollback_to_legacy_expected` | `passed`, `failed`, `inconclusive`, `blocked_missing_safe_evidence`, `not_executed` | Safe gate-state before/after summary | Raw config secrets, raw logs, screenshots with secrets | authority/rollback/gate labels required | Aggregate-safe summary required | QA/security review | yes | yes | F5 does not create or activate gates. |

### 8.6 Diagnostics / Observability Evidence

| case_id | domain | evidence_requirement | prerequisite_runtime_domain | prerequisite_actors_fixtures | prerequisite_safe_window | expected_result_class | allowed_actual_result_classes | safe_evidence_format | prohibited_evidence | labels required | WLS/privacy requirement | QA/security review requirement | blocks Phase H? | blocks Slice 16? | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| DIA-01 | Diagnostics unavailable | Future evidence must show RF paid claim behavior is not controlled by diagnostics and evidence closure blocks safely if diagnostics are unavailable. | `diagnostics_observability`, `diagnostics_independent_fail_closed` | Safe diagnostics-unavailable fixture or observation bucket | Diagnostics-safe observation window | `diagnostics_non_authoritative_observation` | `passed_for_diagnostics_non_authority`, `failed`, `inconclusive`, `blocked_missing_safe_evidence`, `not_executed` | Safe diagnostics failure bucket, aggregate summary | Raw logs, stack traces, SQL, raw request IDs | diagnostics label required; authority label required | Unsafe diagnostics output rejected | QA/security review | yes | yes | Diagnostics cannot become authority. |
| DSO-01 | Diagnostics-safe observation | Future evidence must show diagnostics can provide safe observation summary without influencing runtime decisions. | `runtime_observability_safe_evidence`, `diagnostics_observability` | Safe observation fixture or admin snapshot category | Diagnostics-safe observation window | `diagnostics_non_authoritative_observation` | `passed_for_diagnostics_non_authority`, `failed`, `inconclusive`, `blocked_missing_safe_evidence`, `not_executed` | Aggregate-safe admin snapshot summary, reason buckets | Raw IDs, raw logs, request/response bodies, unsafe screenshots | diagnostics label required; authority label required | Low-volume buckets require special handling | QA/security review | yes | yes | Observation-only success is not enforcement readiness. |
| DIA-DRIFT-01 | Diagnostics-to-authority drift | Future evidence must show diagnostics, shadow outputs, and admin snapshots do not decide allow/deny, rollback, or authority mode. | `diagnostics_observability`, `authority_transition`, `feature_gate_kill_switch` | Safe drift-check fixture labels | Named safe observation window | `observation_only_non_authoritative` | `passed_for_diagnostics_non_authority`, `failed`, `inconclusive`, `blocked_missing_safe_evidence`, `not_executed` | Safe drift-check summary | Raw logs, raw route bodies, raw IDs | authority and diagnostics labels required | Aggregate-safe summary required | QA/security review | yes | yes | Drift check is required for Phase H readiness. |

### 8.7 Feature Gate / Kill-Switch Evidence

| case_id | domain | evidence_requirement | prerequisite_runtime_domain | prerequisite_actors_fixtures | prerequisite_safe_window | expected_result_class | allowed_actual_result_classes | safe_evidence_format | prohibited_evidence | labels required | WLS/privacy requirement | QA/security review requirement | blocks Phase H? | blocks Slice 16? | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| GATE-01 | Gate disabled | Future evidence must show disabled gate does not create hidden enforcement or authority switch. | `feature_gate_kill_switch`, `authority_transition` | Safe gate-state fixture | Named safe observation window | `observation_only_non_authoritative` | `passed`, `failed`, `inconclusive`, `blocked_missing_safe_evidence`, `not_executed` | Safe gate state label and authority mode label | Raw config secrets, logs, screenshots with secrets | gate and authority labels required | Aggregate-safe summary required | QA/security review | yes | yes | F5 does not create or change gates. |
| GATE-02 | Gate shadow-only/staging-only | Future evidence must show shadow-only and staging-only modes remain non-production and do not imply approval. | `feature_gate_kill_switch`, `runtime_observability_safe_evidence` | Safe gate-state fixture | Named staging-only observation window | `observation_only_non_authoritative` | `passed`, `failed`, `inconclusive`, `blocked_missing_safe_evidence`, `not_executed` | Safe gate mode label, environment label, authority label | Raw config, raw actor IDs, raw logs | gate, authority, diagnostics labels required | Aggregate-safe summary required | QA/security review | yes | yes | Staging-only is not rollout. |
| GATE-03 | Kill-switch | Future evidence must show kill-switch returns to named safe authority mode and does not leave stale replay/cache/source/identity state. | `feature_gate_kill_switch`, `rollback_hybrid_state`, `replay_idempotency`, `ttl_cache_freshness` | Safe kill-switch fixture labels | Bounded kill-switch and post-switch monitoring window | `rollback_to_legacy_expected` or `post_rollback_monitoring_expected` | `passed`, `failed`, `inconclusive`, `blocked_missing_safe_evidence`, `not_executed` | Safe kill-switch before/after summary | Raw config secrets, raw replay keys, raw cache rows | gate/rollback/authority labels required | WLS/privacy-safe rollback summary required | QA/security/fraud review | yes | yes | Kill-switch evidence is not approval. |
| GATE-04 | Hidden activation check | Future evidence must show no hidden activation path or gate-driven authority switch. | `feature_gate_kill_switch`, `authority_transition`, `diagnostics_observability` | Safe hidden-activation check fixture | Named safe observation window | `observation_only_non_authoritative` | `passed`, `failed`, `inconclusive`, `blocked_missing_safe_evidence`, `not_executed` | Safe activation-state summary | Raw configs with secrets, raw logs, request bodies | gate and authority labels required | Aggregate-safe summary required | QA/security review | yes | yes | Hidden activation is a stop condition. |

### 8.8 Authority Transition Evidence

| case_id | domain | evidence_requirement | prerequisite_runtime_domain | prerequisite_actors_fixtures | prerequisite_safe_window | expected_result_class | allowed_actual_result_classes | safe_evidence_format | prohibited_evidence | labels required | WLS/privacy requirement | QA/security review requirement | blocks Phase H? | blocks Slice 16? | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| OBL-01 | Legacy authority observation | Future evidence must show legacy authority mode is named and preserved until approved transition. | `authority_transition`, `runtime_observability_safe_evidence` | Safe legacy-authority observation category | Named observation window | `observation_only_non_authoritative` | `passed_for_observation_only`, `failed`, `inconclusive`, `blocked_missing_actor_or_data`, `blocked_missing_safe_evidence`, `not_executed` | Safe authority mode label and observation summary | Raw actor identities, raw runtime logs, raw route bodies | authority label required; diagnostics required | Aggregate-safe summary required | QA/security review | yes | yes | Legacy observation does not approve enforcement. |
| AUTH-01 | Candidate authority mode | Future evidence must show candidate canonical mode remains non-approved and cannot silently become runtime authority. | `authority_transition`, `canonical_source`, `feature_gate_kill_switch` | Safe candidate-mode fixture labels | Named safe staging window | `observation_only_non_authoritative` | `passed`, `failed`, `inconclusive`, `blocked_missing_runtime_domain`, `not_executed` | Safe candidate mode label, named authority boundary | Raw source payloads, raw IDs, raw logs | authority and gate labels required | Aggregate-safe summary required | QA/security review | yes | yes | Candidate mode is not authority transition approval. |
| AUTH-02 | No hidden authority switch | Future evidence must show canonical source, shadow read model, diagnostics, or feature gate cannot silently switch authority. | `authority_transition`, `diagnostics_observability`, `feature_gate_kill_switch` | Safe hidden-switch check fixture | Named safe observation window | `observation_only_non_authoritative` | `passed`, `failed`, `inconclusive`, `blocked_missing_safe_evidence`, `not_executed` | Safe hidden-switch check summary | Raw logs, raw configs with secrets, raw IDs | authority/gate/diagnostics labels required | Aggregate-safe summary required | QA/security review | yes | yes | Hidden authority switch blocks Phase H and Slice 16. |
| AUTH-03 | Named enforcement scope and boundary | Future evidence bundle must name enforcement scope, authority boundary, fallback behavior, and authority rollback behavior. | `authority_transition`, `rollback_hybrid_state`, all implemented enforcement domains | Safe named-scope fixture labels | Named safe execution window | `residual_risk_disposition_required` | `passed`, `failed`, `inconclusive`, `blocked_missing_runtime_domain`, `blocked_missing_safe_evidence`, `not_executed` | Safe named scope and named boundary summary | Raw actor IDs, raw config secrets, raw business-sensitive payloads | authority/rollback/gate labels required | WLS/privacy-safe summary required | QA/security review over named scope | yes | yes | Phase H cannot succeed without named enforcement scope and named authority boundary. |

### 8.9 Security / Fraud Abuse Evidence

| case_id | domain | evidence_requirement | prerequisite_runtime_domain | prerequisite_actors_fixtures | prerequisite_safe_window | expected_result_class | allowed_actual_result_classes | safe_evidence_format | prohibited_evidence | labels required | WLS/privacy requirement | QA/security review requirement | blocks Phase H? | blocks Slice 16? | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SEC-REPLAY-01 | Replay abuse | Future evidence must show replay abuse, stale grant abuse, cross-subject replay, partial idempotency abuse, and retry abuse are denied/conflicted without duplicate side effects. | `replay_idempotency`, `identity_enforcement`, `security_fraud_abuse` | Safe abuse fixtures and aggregate side-effect counts | Named safe execution window | `deny_for_paid_claim_enforcement` or `conflict_for_paid_claim_enforcement` | `passed`, `failed`, `inconclusive`, `unsupported_without_runtime_change`, `not_executed` | Safe threat bucket, aggregate side-effect count | Raw IDs, raw idempotency keys, request bodies, payment/voucher/wallet raw data | authority/gate/rollback labels if applicable | Aggregate-safe only | Security/fraud review required | yes | yes | Covers replay abuse and partial idempotency ambiguity. |
| SEC-IDENTITY-01 | Identity abuse | Future evidence must show identity downgrade abuse and subject mismatch abuse fail closed. | `identity_enforcement`, `replay_idempotency` | Safe identity abuse fixture labels | Named safe execution window | `fail_closed_for_paid_claim_enforcement` | `passed`, `failed`, `inconclusive`, `unsupported_without_runtime_change`, `not_executed` | Safe identity abuse bucket | Raw identities, sessions, tokens, emails | authority/diagnostics labels required | Raw actor identities excluded | Security/fraud review required | yes | yes | Identity downgrade must invalidate stale replay. |
| SEC-SOURCE-01 | Source spoofing | Future evidence must show source spoofing, authenticity mismatch, schema downgrade, and degraded fallback abuse fail closed. | `source_authenticity_version`, `canonical_source` | Safe spoofing fixture labels | Named safe execution window | `fail_closed_for_paid_claim_enforcement` | `passed`, `failed`, `inconclusive`, `unsupported_without_runtime_change`, `not_executed` | Safe source abuse bucket | Secrets, tokens, raw headers, raw source payloads | authority/diagnostics labels required | Secrets excluded | Security/fraud review required | yes | yes | Source spoofing is a required threat surface. |
| SEC-DOUBLE-01 | Double claim/redeem/spend | Future evidence must show entitlement, RF claim, voucher, wallet, Points, redeem, and spend paths cannot double claim, double redeem, or double spend through replay, rollback, or hybrid-state ambiguity. | `security_fraud_abuse`, `replay_idempotency`, `rollback_hybrid_state`, `authority_transition` | Safe aggregate side-effect fixture labels | Named safe execution window | `deny_for_paid_claim_enforcement` or `conflict_for_paid_claim_enforcement` | `passed`, `failed`, `inconclusive`, `unsupported_without_runtime_change`, `not_executed` | Aggregate side-effect count, safe economy-coupling bucket | Raw payment/voucher/wallet data, transaction IDs, raw actor identities | authority/rollback/gate labels if applicable | Aggregate-safe only; low-volume buckets require handling | QA/security/fraud and economy-boundary review | yes | yes | Economy expansion remains Phase K and cannot force entitlement approval. |
| SEC-DIA-01 | Diagnostics misuse | Future evidence must show diagnostics cannot be used to grant, deny, infer authority, switch gate, or decide rollback. | `diagnostics_observability`, `authority_transition`, `feature_gate_kill_switch` | Safe diagnostics misuse fixture labels | Named safe observation window | `observation_only_non_authoritative` | `passed_for_diagnostics_non_authority`, `failed`, `inconclusive`, `blocked_missing_safe_evidence`, `not_executed` | Safe diagnostics misuse bucket | Raw logs, stack traces, SQL, request/response bodies | diagnostics/authority/gate labels required | Aggregate-safe summary required | QA/security review required | yes | yes | Diagnostics misuse violates `diagnostics != authority`. |

### 8.10 WLS / Privacy-Safe Evidence

| case_id | domain | evidence_requirement | prerequisite_runtime_domain | prerequisite_actors_fixtures | prerequisite_safe_window | expected_result_class | allowed_actual_result_classes | safe_evidence_format | prohibited_evidence | labels required | WLS/privacy requirement | QA/security review requirement | blocks Phase H? | blocks Slice 16? | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| WLS-01 | WLS id-like ambiguity | Future evidence must provide raw-log-free id-like ambiguity disposition. | `wls_privacy_safe_evidence` | Safe WLS reviewer category | Safe WLS follow-up window | `residual_risk_disposition_required` | `closed_for_named_bucket`, `inconclusive`, `blocked_missing_safe_evidence`, `not_executed` | Raw-log-free safe summary | Raw logs, raw IDs, emails, tokens, request IDs, correlation IDs | diagnostics label if applicable | WLS-safe summary required | QA/security/privacy review | yes | yes | Full WLS closure is not granted by F5. |
| WLS-02 | Admin snapshot route-specific coverage | Future evidence must provide route-specific safe bucket coverage summary for admin snapshot routes. | `wls_privacy_safe_evidence`, `diagnostics_observability` | Safe WLS reviewer category | Safe WLS follow-up window | `closed_for_named_wls_bucket_expected` | `closed_for_named_bucket`, `inconclusive`, `blocked_missing_safe_evidence`, `not_executed` | Route-safe bucket summary | Raw route logs, raw response bodies, screenshots with PII | diagnostics label required | Low-volume route buckets require special handling | QA/security/privacy review | yes | yes | Route coverage remains a residual without safe summary. |
| WLS-03..WLS-07 | Domain WLS residuals | Future evidence must provide safe summaries for TTL/cache, replay/idempotency, identity mismatch, degraded/unavailable source, and rollback residual buckets. | `wls_privacy_safe_evidence`, affected runtime domain | Safe WLS reviewer category | Safe WLS follow-up window | `closed_for_named_wls_bucket_expected` or `residual_risk_disposition_required` | `closed_for_named_bucket`, `inconclusive`, `blocked_missing_safe_evidence`, `not_executed` | Domain-specific aggregate-safe bucket summary | Raw logs, raw IDs, request/response bodies, SQL, stack traces, screenshots unless safe | affected domain labels and diagnostics label required | Aggregate-safe summary required; low-volume buckets special handling | QA/security/privacy review | yes | yes | Residual may be closed or accepted only for a named scope in future Phase H. |
| PRIV-01 | Prohibited evidence exclusion | Future evidence bundles must explicitly exclude raw logs, raw IDs, emails, tokens/secrets, raw payment/voucher/wallet data, request/response bodies, SQL, stack traces, unsafe screenshots, and raw actor identities. | `wls_privacy_safe_evidence`, all evidence domains | Not applicable | Applies to every future evidence window | `residual_risk_disposition_required` | `passed`, `failed`, `rejected_unsafe_evidence`, `blocked_missing_safe_evidence`, `not_executed` | Evidence safety review checklist and aggregate-safe summaries | All prohibited evidence classes | diagnostics label if applicable | Unsafe evidence must be rejected or converted to safe summary where possible | QA/security/privacy review | yes | yes | Unsafe evidence cannot be accepted for Phase H review. |

## 9. Safe Evidence Protocol

Future evidence bundles must follow this safe evidence protocol.

Forbidden:

- no raw logs;
- no raw IDs;
- no emails;
- no tokens or secrets;
- no raw payment data;
- no raw voucher data;
- no raw wallet data;
- no raw request bodies;
- no raw response bodies;
- no SQL;
- no stack traces;
- no unsafe screenshots;
- no raw actor identities;
- no raw entitlement metadata;
- no raw source payloads;
- no raw idempotency keys;
- no raw request IDs;
- no raw correlation IDs.

Allowed only when safe:

- safe case id;
- role category;
- environment label;
- reason bucket;
- expected result class;
- actual result class;
- evidence status;
- execution status;
- aggregate counts;
- safe side-effect count summary;
- safe rollback mode label;
- safe authority mode label;
- safe gate state label;
- safe diagnostics mode label;
- safe WLS bucket summary;
- reviewer role category;
- privacy-safe screenshot only if no PII, secrets, IDs, request/response bodies, or sensitive data are visible.

Protocol rules:

- Aggregate-safe summaries are preferred.
- Low-volume buckets require special handling to avoid re-identification.
- Unsafe evidence must be rejected.
- If possible, unsafe evidence may be converted into a safe summary and the raw source discarded from the artifact.
- If safe conversion is not possible, the affected case must be classified as `blocked_missing_safe_evidence` or `rejected_unsafe_evidence`.
- Evidence cannot become authority.
- Diagnostics cannot become authority.
- Safe observation does not equal enforcement readiness.

## 10. Phase H Evidence Readiness Criteria

Future Phase H evidence readiness requires:

- implemented runtime domains for tested cases;
- executed staging validation;
- safe actors and fixtures;
- safe execution window;
- diagnostics-safe observation window;
- rollback observation path where applicable;
- expected and actual results;
- explicit execution status per case;
- rollback proof where applicable;
- WLS/privacy-safe summaries;
- QA/security sign-off over executed evidence;
- named enforcement scope;
- named authority boundary;
- residual risk disposition;
- no unsafe evidence;
- no unsupported runtime cases counted as passed;
- no hidden authority switch;
- no diagnostics authority promotion.

F5 does not satisfy these criteria. F5 only defines them.

Phase H cannot succeed unless future evidence demonstrates:

- runtime implementation exists;
- runtime validation evidence exists;
- rollback runtime proof exists;
- WLS residuals are closed or explicitly accepted for a named enforcement scope;
- QA/security sign-off is completed over executed evidence;
- named enforcement scope is defined;
- named authority boundary is defined.

Validation evidence is still not approval.

## 11. QA / Security Sign-Off Criteria

Future QA/security sign-off requires:

- named scope;
- named authority boundary;
- executed evidence, not requirements only;
- safe actor/fixture confirmation;
- safe execution window confirmation;
- expected/actual classification for each executed case;
- unsafe evidence exclusion confirmation;
- runtime domain coverage statement;
- unsupported case disposition;
- rollback evidence review where rollback is applicable;
- WLS/privacy residual disposition;
- security/fraud threat surface review;
- confirmation that diagnostics did not become authority;
- confirmation that gates did not become authority switch;
- confirmation that legacy authority or future authority mode is correctly labeled.

Allowed sign-off outcomes:

- `not_applicable` for cases outside the named scope;
- `not_started` before execution;
- `blocked` if evidence, actors, runtime, or safe protocol is missing;
- `pending_review` after execution but before QA/security review;
- `qa_reviewed` for QA-only review;
- `security_reviewed` for security-only review;
- `qa_security_signed_off_for_named_scope` only when both QA and security have reviewed executed, safe evidence for a named scope.

F5 cannot issue QA/security sign-off because F5 does not execute validation.

## 12. WLS / Privacy-Safe Evidence Requirements

Future WLS/privacy-safe evidence requires:

- raw-log-free safe summary;
- no raw IDs;
- no emails;
- no tokens or secrets;
- no payment/voucher/wallet raw data;
- no request/response bodies;
- no SQL;
- no stack traces;
- no unsafe screenshots;
- no raw actor identities;
- aggregate-safe bucket summary where possible;
- low-volume bucket handling;
- id-like ambiguity disposition;
- named residual risk status;
- explicit `closed_for_named_scope`, `accepted_for_named_scope_only`, `requires_safe_followup`, or `open` status.

WLS residuals that remain relevant for Phase H:

- id-like ambiguity;
- missing safe buckets;
- unsupported log sources;
- low-volume correlation risk;
- admin snapshot route-specific coverage;
- TTL/cache bucket summary;
- replay/idempotency bucket summary;
- identity mismatch bucket summary;
- degraded/unavailable source bucket summary;
- rollback bucket summary.

F5 does not close WLS residuals.

## 13. Rollback Evidence Requirements

Future rollback evidence must include:

- rollback mode before/after classification;
- authority mode before/after classification;
- gate state before/after classification;
- kill-switch state before/after classification;
- replay behavior before/after rollback;
- idempotency key behavior before/after rollback;
- cache/freshness behavior before/after rollback;
- source availability/auth/version behavior before/after rollback;
- identity subject behavior before/after rollback;
- diagnostics availability before/after rollback;
- legacy fallback before/after rollback;
- hybrid-state classification;
- stale replay after rollback classification;
- stale cache after rollback classification;
- identity/source rollback mismatch classification;
- safe observation summary;
- WLS/privacy-safe rollback summary;
- QA/security sign-off over executed rollback validation evidence.

Rollback evidence requirements do not prove rollback.

Current rollback status remains:

```text
rollback_proof_status: not_proven
```

## 14. Authority / Gate / Diagnostics Evidence Requirements

Future authority evidence must show:

- legacy authority mode is named where current runtime remains legacy;
- candidate canonical mode is labeled non-approved;
- no hidden authority switch occurred;
- named enforcement scope is present;
- named authority boundary is present;
- fallback behavior is named;
- authority rollback behavior is named;
- evidence and diagnostics did not become authority.

Future gate evidence must show:

- gate disabled behavior;
- gate shadow-only behavior;
- gate staging-only behavior;
- kill-switch behavior;
- hidden activation checks;
- gate state does not switch authority;
- gate evidence does not imply approval.

Future diagnostics evidence must show:

- diagnostics unavailable behavior is classified safely;
- diagnostics available but non-authoritative status is labeled;
- safe observation summary exists where applicable;
- admin snapshot route-specific coverage is safe;
- low-volume correlation risk is handled;
- diagnostics-to-authority drift check is included.

F5 does not create, activate, or modify any authority mode, gate, or diagnostics behavior.

## 15. Security / Fraud Abuse Evidence Requirements

Future security/fraud evidence must cover:

- replay abuse;
- stale grant abuse;
- identity downgrade abuse;
- source spoofing;
- source degraded fallback abuse;
- schema/version downgrade abuse;
- double claim;
- double redeem;
- double spend;
- partial idempotency abuse;
- retry abuse disguised as legitimate idempotency;
- economy/spend coupling ambiguity;
- diagnostics misuse;
- rollback-induced stale replay or hybrid authority bypass;
- feature gate activation before readiness;
- hidden authority switch.

Security/fraud evidence must include:

- safe threat bucket;
- expected result class;
- actual result class from executed validation;
- side-effect count summary where applicable;
- authority mode label;
- rollback mode label where applicable;
- gate state label where applicable;
- diagnostics mode label where applicable;
- residual risk disposition;
- QA/security/fraud review status.

Security/fraud evidence must not include raw actor identities, payment/voucher/wallet raw data, raw request/response bodies, raw IDs, secrets, SQL, stack traces, or raw logs.

## 16. Residual Risk Disposition Requirements

Future evidence bundles must classify residual risks as:

- `not_applicable`;
- `open`;
- `blocked`;
- `requires_safe_followup`;
- `requires_named_scope_disposition`;
- `accepted_for_named_scope_only`;
- `closed_for_named_scope`;
- `rejected_due_to_unsafe_evidence`.

Residual risk disposition must be named for:

- WLS id-like ambiguity;
- unsupported log sources;
- missing safe buckets;
- low-volume correlation risk;
- runtime unsupported cases;
- rollback proof gaps;
- unsafe evidence gaps;
- security/fraud threat gaps;
- authority boundary ambiguity;
- economy/spend coupling ambiguity.

Acceptance of a residual risk for a named scope is not enforcement approval. It is only a future review input.

## 17. Relation to F6

F5 hands off to F6 - Phase F Closure Review.

F6 should verify:

- F1 completeness;
- F2 completeness;
- F3 completeness;
- F4 completeness;
- F5 completeness;
- whether Phase G can be considered as future implementation without approval or rollout implication;
- whether evidence requirements are sufficiently complete for future Phase G/H planning;
- whether any corrective docs-only slice is required;
- whether authority, diagnostics, Slice 16, runtime change, and production boundaries remain intact.

F6 must not approve enforcement, start Phase G, start Phase H, start Phase I, trigger Slice 16, or switch authority.

## 18. Slice 16 Boundary

F5 does not trigger Slice 16.

F5 does not prepare an enforcement approval artifact.

F5 does not approve enforcement.

Evidence requirements do not equal evidence execution.

Future evidence execution does not automatically equal approval.

Slice 16 remains blocked until future artifacts provide:

- runtime implementation where needed;
- completed runtime validation evidence;
- rollback runtime proof;
- broader evidence closure;
- QA/security sign-off over executed evidence;
- named enforcement scope;
- named authority boundary;
- separate explicit governance approval artifact.

Current Slice 16 status remains:

```text
slice_16_status: blocked_not_triggered
```

## 19. Authority and Diagnostics Boundary

Current runtime authority remains:

```text
authority_runtime_status: legacy_vip_spacer_still_authoritative
```

Durable diagnostics remain:

```text
diagnostics_sink_authority_status: non_authoritative_observability_only
```

F5 preserves the following boundaries:

- diagnostics cannot become authority;
- durable diagnostics cannot become enforcement source;
- shadow read models cannot become authority;
- canonical source cannot become runtime authority without future approved implementation and governance artifacts;
- evidence cannot become authority;
- policy cannot become runtime implementation;
- readiness cannot become implementation;
- evidence requirements cannot become execution evidence;
- rollback evidence expectations cannot become rollback proof;
- implementation cannot become approval;
- review cannot become approval;
- legacy authority cannot be cleaned up before controlled enforcement is approved and stable.

## 20. Runtime Change Boundary

This Slice F5 makes no runtime change.

```text
runtime_change_status: no_runtime_change
production_status: not_touched
```

No code, migration, API, feature flag, config, runtime authority, enforcement path, diagnostic sink, logging pipeline, observability pipeline, RF paid claim behavior, Points behavior, Gateway/Auth behavior, source/cache/replay/identity runtime behavior, rollback behavior, staging behavior, or production behavior is changed by this artifact.

If a future evidence requirement requires implementation, it must be routed to a later Phase G implementation slice after Phase F readiness is complete and after required design, threat model, rollback, evidence, review, and approval boundaries are satisfied.

## 21. Recommended Next Slice

Recommended next slice:

```text
recommended_next_slice: phase_f_slice_f6_phase_f_closure_review
```

Slice F6 should remain docs-only and should confirm whether F1, F2, F3, F4, and F5 are complete enough that Phase G may be considered only as a future runtime implementation phase, with no enforcement approval, no rollout, no runtime change, no authority switch, and no Slice 16 trigger.

## 22. Acceptance Criteria

This F5 runtime evidence requirements matrix is ready when:

- canonical roadmap is read and used as SSOT;
- F1 artifact is read and used;
- F2 artifact is read and used;
- F3 artifact is read and used;
- F4 artifact is read and used;
- Phase E closure context is reflected;
- 15.5B validation rerun context is reflected;
- evidence requirement taxonomy is included;
- evidence matrix is included;
- TTL/cache domain is covered;
- replay/idempotency domain is covered;
- identity domain is covered;
- canonical source domain is covered;
- rollback domain is covered;
- diagnostics domain is covered;
- feature gate and kill-switch domain is covered;
- authority transition domain is covered;
- security/fraud abuse domain is covered;
- WLS/privacy domain is covered;
- safe evidence protocol is included;
- Phase H readiness criteria are included;
- QA/security sign-off criteria are included;
- rollback evidence requirements are included;
- authority/gate/diagnostics evidence requirements are included;
- residual risk disposition requirements are included;
- relation to F6 is included;
- evidence requirements are explicitly not evidence execution;
- rollback evidence requirements are explicitly not rollback proof;
- Phase G remains not started;
- Phase H remains not started;
- Phase I remains not started;
- Slice 16 remains blocked and not triggered;
- current legacy authority is preserved;
- diagnostics remain non-authoritative;
- runtime remains untouched;
- production remains untouched;
- no hidden implementation authorization is introduced;
- explicit non-approval is included;
- recommended next slice is F6 unless blockers require corrective docs-only slice.

## 23. Acceptance Status

```text
canonical_roadmap_used_as_ssot: yes
f1_artifact_used: yes
f2_artifact_used: yes
f3_artifact_used: yes
f4_artifact_used: yes
phase_e_closure_review_used: yes
slice_15_5b_rerun_artifact_used: yes
evidence_requirement_taxonomy_included: yes
evidence_matrix_included: yes
ttl_cache_domain_covered: yes
replay_idempotency_domain_covered: yes
identity_domain_covered: yes
canonical_source_domain_covered: yes
rollback_domain_covered: yes
diagnostics_domain_covered: yes
feature_gate_kill_switch_domain_covered: yes
authority_transition_domain_covered: yes
security_fraud_abuse_domain_covered: yes
wls_privacy_domain_covered: yes
safe_evidence_protocol_included: yes
phase_h_readiness_criteria_included: yes
qa_security_signoff_criteria_included: yes
rollback_evidence_requirements_included: yes
authority_gate_diagnostics_requirements_included: yes
residual_risk_disposition_requirements_included: yes
relation_to_f6_included: yes
evidence_requirements_are_evidence_execution: no
rollback_evidence_requirements_are_rollback_proof: no
phase_g_started: no
phase_h_started: no
phase_i_started: no
slice_16_triggered: no
authority_switch: no
diagnostics_authority_promotion: no
runtime_code_changed: no
api_routes_changed: no
migrations_changed: no
feature_flags_changed: no
production_changes: no
hidden_implementation_authorization_introduced: no
explicit_non_approval_included: yes
recommended_next_slice_is_f6: yes
```

## 24. Final Classification

```text
slice_f5_status: review_ready_runtime_evidence_requirements_matrix
phase_f_status: readiness_workstream_in_progress_docs_only
phase_e_status: closed_with_runtime_implementation_gaps
f1_status: completed_runtime_enforcement_implementation_readiness_review
f2_status: completed_runtime_domain_decomposition
f3_status: completed_runtime_implementation_order_plan
f4_status: completed_runtime_rollback_safety_design
runtime_gap_status: primary_blocker_confirmed
evidence_requirements_matrix_status: completed_for_readiness_planning_not_execution
evidence_execution_status: not_executed
validation_execution_status: blocked_not_executed
rollback_proof_status: not_proven
phase_g_status: not_started
phase_h_status: not_started
phase_i_status: not_started
slice_16_status: blocked_not_triggered
enforcement_approval_status: not_approved
authority_runtime_status: legacy_vip_spacer_still_authoritative
diagnostics_sink_authority_status: non_authoritative_observability_only
runtime_change_status: no_runtime_change
production_status: not_touched
recommended_next_slice: phase_f_slice_f6_phase_f_closure_review
```

**IMPORTANT:** Slice F5 defines future runtime evidence requirements for readiness and planning only. It does not approve enforcement, does not authorize runtime implementation, does not collect evidence, does not execute validation, does not prove rollback, does not start Phase G, does not start Phase H, does not start Phase I, does not trigger Slice 16, does not change runtime authority, and does not change production.
