# Go2Asia — VIP Entitlement Runtime Authority Roadmap

Date: 2026-05-15  
Status: `UPDATED_ROADMAP_AFTER_PHASE_E_CLOSURE`  
Scope: VIP Entitlement Runtime Authority / RF Paid Claim Governance  
Mode: roadmap document, no runtime implementation, no enforcement approval, no authority switch

## 1. Executive Summary

This roadmap reflects the current state after Phase E / Slice 15.6 — Enforcement Preconditions Evidence Closure Review.

The key conclusion is:

`policy != evidence != runtime != approval`

Phase E did not lead directly to enforcement approval. Instead, Phase E identified the primary remaining blocker:

`runtime_implementation_gap`

Therefore, the roadmap is updated to insert new runtime implementation readiness, implementation, and runtime validation phases before any controlled enforcement rollout.

Old roadmap phases are shifted:

- Old Phase F — Controlled Enforcement → New Phase I — Controlled Enforcement Rollout
- Old Phase G — Legacy Cleanup → New Phase J — Legacy Cleanup
- Old Phase H — Economy Expansion → New Phase K — Economy Expansion

Current runtime authority remains:

`legacy_vip_spacer_still_authoritative`

Durable diagnostics remain:

`non_authoritative_observability_only`

Enforcement approval status remains:

`not_approved`

## 2. Current Global Status

```text
governance_policy_status: largely_defined
phase_e_status: closed_with_runtime_implementation_gaps
wls_closure_status: limited_closure_with_residual_risks
validation_execution_status: blocked_not_executed
runtime_gap_status: primary_blocker
slice_16_readiness_status: blocked_by_runtime_implementation_and_broader_evidence_requirements
enforcement_approval_status: not_approved
authority_runtime_status: legacy_vip_spacer_still_authoritative
diagnostics_sink_authority_status: non_authoritative_observability_only
runtime_change_status: no_runtime_change
production_status: not_touched
```

## 3. Roadmap Overview

| Phase | Name | Status | Purpose |
|---|---|---|---|
| Phase A | Contracts & Runtime Isolation | Completed | Isolate future canonical entitlement layer from current runtime authority |
| Phase B | Governance Preconditions | Completed | Define policy layer before any enforcement |
| Phase C | WLS & Privacy Evidence | Limited closure | Validate observability/privacy posture |
| Phase D | Validation Scope & Capability | Completed | Determine what can actually be validated |
| Phase E | Enforcement Preconditions Evidence Closure | Completed with runtime gaps | Close evidence phase and identify runtime blockers |
| Phase F | Runtime Enforcement Implementation Readiness | Not started | Prepare runtime architecture and implementation plan |
| Phase G | Runtime Enforcement Implementation | Future | Implement required runtime enforcement layer |
| Phase H | Runtime Validation & Governance Approval Review | Future | Validate implemented runtime and consider governance approval |
| Phase I | Controlled Enforcement Rollout | Future | Controlled rollout after explicit approval |
| Phase J | Legacy Cleanup | Future | Cleanup legacy authority after safe transition |
| Phase K | Economy Expansion | Future | Expand economy only after enforcement stability |

## 4. Phase A — Contracts & Runtime Isolation

### Goal

Isolate the future canonical entitlement layer from the current runtime authority.

### Status

`completed`

### Completed outcomes

- Contract Lock
- Source Read Adapter Contract
- Schema Decision Contract
- Shadow Read Model
- Durable Diagnostics
- Admin Snapshot Endpoint
- Rollback-safe observability
- Governance boundaries
- Economy separation
- Legacy authority preservation

### Boundary

Phase A did not approve enforcement.

## 5. Phase B — Governance Preconditions

### Goal

Define the policy layer before any enforcement.

### Status

`completed`

### Completed outcomes

- TTL / Cache Governance Policy
- Replay Governance Policy
- Identity Mismatch Governance Policy
- Canonical Source Reliability & Authenticity Policy
- Governance Preconditions Consolidation
- Enforcement Preconditions Review

### Boundary

Phase B defined policy only. Policy is not runtime implementation.

## 6. Phase C — WLS & Privacy Evidence

### Goal

Validate observability and privacy posture.

### Status

`limited_closure_with_residual_risks`

### Completed outcomes

- Targeted WLS Scope & Execution Plan
- WLS Execution Bundle Template
- Operator Evidence Intake
- Real WLS Execution
- WLS Closure Review

### Current outcome

`wls_closure_status: limited_closure_with_residual_risks`

### Remaining residuals

- id-like ambiguity
- missing safe buckets
- unsupported log sources
- low-volume correlation risk
- full WLS closure not granted

### Boundary

WLS closure is not enforcement approval.

## 7. Phase D — Validation Scope & Capability

### Goal

Determine which validation domains can actually be executed.

### Status

`completed`

### Completed outcomes

- Staging Validation Execution Scope
- Staging Validation Execution Bundle
- Staging Validation Execution Capability Unblock
- Staging Validation Execution Bundle Rerun

### Current outcome

`validation_execution_status: blocked_not_executed`

### Key discovery

`unsupported_runtime_behavior`

`completed` here means the validation scope and capability artifacts were completed. It does not mean staging validation execution was completed.

### Boundary

Phase D found that many cases cannot be validated because the required runtime behavior does not exist.

## 8. Phase E — Enforcement Preconditions Evidence Closure

### Goal

Close the governance/evidence phase and classify remaining blockers.

### Status

`closed_with_runtime_implementation_gaps`

### Completed outcome

- Enforcement Preconditions Evidence Closure Review

### Key conclusion

`primary_blocker: runtime_implementation_gap`

### Remaining blocked domains

- TTL/cache evidence
- replay/idempotency evidence
- identity mismatch evidence
- canonical source evidence
- rollback runtime proof
- full staging validation evidence
- QA/security sign-off over executed runtime validation evidence

### Boundary

Phase E closure does not approve enforcement and does not trigger Slice 16.

## 9. Phase F — Runtime Enforcement Implementation Readiness

### Goal

Prepare the runtime implementation architecture before any code-level enforcement work.

### Status

`not_started`

### Purpose

Phase F is not enforcement rollout. It is implementation readiness and runtime architecture planning.

### Expected domains

- Replay Runtime Readiness
- Identity Enforcement Runtime Readiness
- Cache/Freshness Runtime Readiness
- Canonical Source Runtime Readiness
- Rollback Runtime Readiness
- Runtime Observability & Safety Readiness
- Authority Transition Readiness

### Planned slices

#### Slice F1 — Runtime Enforcement Implementation Readiness Review

Purpose:

- confirm that Phase E is closed with runtime gaps;
- define implementation domains;
- define non-goals;
- preserve non-approval boundaries.

#### Slice F2 — Runtime Domain Decomposition

Purpose:

- decompose runtime into replay, identity, cache, source, rollback, observability, authority transition;
- define dependencies between domains.

#### Slice F3 — Runtime Implementation Order Plan

Purpose:

- define implementation sequence;
- avoid implementing authority switch too early;
- keep staging-first discipline.

#### Slice F4 — Runtime Rollback & Safety Design

Purpose:

- define rollback mechanics before runtime enforcement;
- define hybrid-state protections;
- define legacy fallback.

### Boundary

Phase F does not implement runtime behavior.

## 10. Phase G — Runtime Enforcement Implementation

### Goal

Implement the required runtime enforcement layer in controlled slices.

### Status

`future`

### Expected implementation domains

- replay/idempotency runtime
- identity enforcement runtime
- cache/freshness runtime
- canonical source runtime
- source authenticity/version runtime
- rollback orchestration runtime
- diagnostics-independent fail-closed runtime
- authority transition mechanics

### Boundary

Phase G implementation still does not equal production rollout.

Each implementation slice must include:

- design review;
- code review;
- staging-first validation;
- rollback plan;
- security review;
- explicit non-approval boundary.

## 11. Phase H — Runtime Validation & Governance Approval Review

### Goal

Validate the implemented runtime layer and only then consider governance approval.

### Status

`future`

### Required before Phase H can succeed

- runtime implementation exists;
- runtime validation evidence exists;
- rollback runtime proof exists;
- WLS residuals closed or explicitly accepted;
- QA/security sign-off completed;
- named enforcement scope defined;
- named authority boundary defined.

### Possible outcome

Only Phase H may produce:

`possible_enforcement_approval_consideration`

But approval still requires a separate explicit governance approval artifact.

### Boundary

Validation evidence is not automatically approval.

## 12. Phase I — Controlled Enforcement Rollout

### Previous roadmap name

Old Phase F — Controlled Enforcement

### New position

New Phase I — Controlled Enforcement Rollout

### Status

`future`

### Preconditions

- Phase F complete;
- Phase G implementation complete;
- Phase H runtime validation and governance approval review exit criteria complete;
- explicit enforcement approval artifact exists;
- rollback and monitoring are ready.

### Purpose

Controlled, staged rollout of canonical entitlement enforcement.

### Expected scope

- staged rollout;
- feature gate discipline;
- shadow fallback;
- authority transition monitoring;
- incident response;
- rollback window;
- enforcement telemetry.

### Boundary

Phase I cannot begin without explicit approval.

## 13. Phase J — Legacy Cleanup

### Previous roadmap name

Old Phase G — Legacy Cleanup

### New position

New Phase J — Legacy Cleanup

### Status

`future`

### Purpose

Cleanup legacy runtime authority only after controlled enforcement is stable.

### Preconditions

- controlled enforcement is stable;
- rollback risk is reduced;
- legacy fallback no longer required or is explicitly retained as safety fallback;
- production evidence confirms stability.

### Expected scope

- remove or retire obsolete legacy paths;
- cleanup shadow-only paths if no longer needed;
- preserve audit trail;
- avoid breaking historical evidence;
- ensure no economy correction is needed.

### Boundary

Legacy cleanup must not happen before enforcement stability.

## 14. Phase K — Economy Expansion

### Previous roadmap name

Old Phase H — Economy Expansion

### New position

New Phase K — Economy Expansion

### Status

`future`

### Purpose

Expand economy logic only after entitlement authority is stable and safe.

### Preconditions

- canonical entitlement enforcement is stable;
- rollback proof exists;
- legacy cleanup is complete or safely controlled;
- Points / vouchers / referrals do not depend on disputed authority semantics;
- QA/security/economy review completed.

### Possible future areas

- Points spendability expansion;
- voucher economy expansion;
- referral/network integration;
- business partner settlement flows;
- PRO/VIP advanced entitlement rules;
- tokenomics/G2A/NFT/on-chain integration.

### Boundary

Economy expansion must not be used to force or bypass entitlement authority approval.

## 15. Updated Phase Mapping

| Old roadmap phase | New roadmap phase | Reason |
|---|---|---|
| Old Phase F — Controlled Enforcement | New Phase I — Controlled Enforcement Rollout | Runtime implementation readiness, implementation, validation, and approval must happen first |
| Old Phase G — Legacy Cleanup | New Phase J — Legacy Cleanup | Cleanup must wait until controlled enforcement is stable |
| Old Phase H — Economy Expansion | New Phase K — Economy Expansion | Economy expansion must wait until entitlement authority is stable |

## 16. Key Governance Invariants

These invariants remain active across all future phases:

`policy != evidence`

`evidence != runtime`

`runtime != approval`

`approval != rollout`

`diagnostics != authority`

`limited closure != full closure`

`review_ready != enforcement approval`

`allowed_for_review_only != enforcement approval`

`legacy_vip_spacer_still_authoritative` remains the current runtime authority until explicitly changed by a separate approved governance artifact.

## 17. Current Recommended Next Step

Recommended next phase:

`Phase F — Runtime Enforcement Implementation Readiness`

Recommended first slice:

`Phase F / Slice F1 — Runtime Enforcement Implementation Readiness Review`

This next step should remain:

- docs-first;
- architecture-first;
- no runtime implementation;
- no enforcement;
- no authority switch;
- no production changes.
- not Slice 16 and not controlled enforcement.

## 18. Final Classification

```text
roadmap_status: updated_after_phase_e_closure
phase_e_status: closed_with_runtime_implementation_gaps
recommended_next_phase: phase_f_runtime_enforcement_implementation_readiness
old_controlled_enforcement_phase_status: shifted_to_phase_i
old_legacy_cleanup_phase_status: shifted_to_phase_j
old_economy_expansion_phase_status: shifted_to_phase_k
enforcement_approval_status: not_approved
authority_runtime_status: legacy_vip_spacer_still_authoritative
diagnostics_sink_authority_status: non_authoritative_observability_only
runtime_change_status: no_runtime_change
production_status: not_touched
```
