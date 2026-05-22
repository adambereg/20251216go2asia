# Capsule: Staging And Smoke Evidence

Status: `active_initial`  
Primary domain: internal smoke, staging evidence and runtime validation boundaries  
Upstream SSOT: Stage 11.8 runtime smoke proof, Stage 11.9 closure review

## Purpose

Use this capsule for runtime validation and evidence review. It prevents smoke, staging and screenshots from being misread as public launch, production rollout or customer support proof.

## Smoke Doctrine

- Smoke is bounded internal runtime coherence validation.
- Smoke is not public launch.
- Smoke is not production rollout.
- Smoke is not marketing proof.
- Smoke is not customer support receipt.

## Smoke != Launch

```text
bounded_internal_smoke_ready_with_exclusions != public_MVP_ready
staging_green != production_ready
evidence_bundle != marketing_claim
```

## Evidence Bundle Rules

Evidence should identify:

- environment and build;
- scenario and trigger;
- owner row IDs;
- service or owner source;
- idempotency key where relevant;
- projection or diagnostic only as secondary hint;
- known exclusions and residual gaps.

## Staging Exclusions

- Path B validation is excluded unless explicitly reopened.
- Mock/demo data is excluded from proof.
- Screenshots are not proof.
- Feature flags do not prove readiness.
- UI alignment does not prove runtime behavior.

## Mock Exclusions

Reject evidence that terminates at:

- `mockData`;
- `NEXT_PUBLIC_DATA_SOURCE=mock`;
- demo fixtures;
- share cards;
- dashboard-only numbers;
- diagnostic snapshots without owner row.

## Runtime Validation Principles

- Proof chain terminates at owner fact.
- Projection drift must be acknowledged, not hidden.
- Known gaps can allow governance closure but block public launch.
- Runtime validation cannot approve product claims outside its evidence scope.

## Required Reads

- `docs/ai/context/core/capsule.md`
- `docs/architecture/domain/stage_11_8_runtime_smoke_proof_v1.md`
- `docs/architecture/domain/stage_11_9_closure_review_v1.md`
- `docs/ai/roles/runtime_validation_agent.md`
- `docs/ai/roles/runtime_governance_architect.md`
- named evidence bundle or staging report when available

## Explicitly Excluded

- Smoke execution mandate.
- Runtime implementation.
- Public launch approval.
- Production rollout certification.
- Financial, booking or token correctness claims.

## Stop Conditions

Stop if asked to approve public launch from smoke evidence or if evidence lacks owner facts for proof claims.
