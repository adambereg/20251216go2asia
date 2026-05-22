# Capsule: Core Governance

Status: `active_initial`  
Primary domain: Go2Asia mission, governance firewall and common AI prompt bounds  
Upstream SSOT: Stage 11.9 closure review, Stage 12 product-reality alignment, AI Ops ADR-005

## Mission

Go2Asia is a bounded ecosystem. Current AI work must preserve canonical governance, prevent product overclaiming, and keep Cursor tasks scoped to the smallest safe slice.

## Path A / Path B

- Path A is the bounded internal economy and MVP-facing product surface.
- Path B covers token, NFT, G2A, bridge, on-chain and financial-wallet concepts.
- Path B is excluded unless a future owner-approved Path B stage explicitly reopens it.

## Core Glossary

| Term | Meaning |
|---|---|
| `owner_fact` | Canonical row or owner-owned runtime fact that can terminate proof |
| `projection` | Read model, dashboard, diagnostic or summary; never authority |
| `mock_demo` | Internal demo/reference data; never proof |
| `Points` | Internal Path A economic fact only when backed by owner row |
| `badge` | Off-chain recognition, not NFT/token/receipt |
| `smoke` | Internal bounded validation, not launch approval |
| `capsule` | AI context manifest; not a second architecture canon |

## Bounded Ecosystem Doctrine

- Use owner facts for authority.
- Use projections only as hints or read-only summaries.
- Keep mock/demo data out of evidence and public claims.
- Keep Path B vocabulary deferred or quarantined.
- Keep tasks bounded by domain, risk and review gate.

## Canonical Formulas

```text
Stage_11_complete = governance_complete_for_internal_bounded_smoke
Stage_11_complete != public_launch_ready
Stage_12_complete = bounded_UI_copy_mock_alignment
Stage_12_complete != public_launch_ready
Path_B = excluded_by_default
projection != authority
mock_data != proof
smoke_proof != public_launch
```

## Governance Summary

- ADR-first and context-capsule-first execution.
- One primary capsule per task; add secondary capsules only for concrete risks.
- Runtime-sensitive claims require staging/evidence context.
- Economy/security/runtime tasks require specialist review.
- Canon changes require Technical Canon Writer review.

## No-Public-Launch Doctrine

Do not infer public MVP, production rollout, support-proof readiness, financial audit readiness or marketing readiness from Stage 11, Stage 12, smoke contracts, dashboards, screenshots or UI alignment.

## Explicitly Excluded

- Runtime implementation.
- Schema/API/OpenAPI/SDK changes.
- Path B activation.
- New Points producers or reward semantics.
- Autonomous AI memory or orchestration runtime.
- Replacement of Stage 10/11/12 canon.

## Downstream Consumers

- Orchestrator prompts.
- Stage/slice planning.
- Canon reviews.
- Economy, security, runtime, staging and UI prompt composition.

## Stop Conditions

Stop if a task tries to combine public launch approval, runtime implementation, economy expansion and UI cleanup in one slice.
