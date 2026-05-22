# Go2Asia AI Context Capsules

Status: `stage_12_x_1_initial_context_governance_layer`  
Scope: reusable AI context manifests for Cursor and multi-agent orchestration  
Mode: docs-only; no runtime, API, schema, SDK, frontend or economy changes

## Purpose

AI Context Capsules are bounded, reusable context manifests. They exist to reduce prompt size, prevent Cursor drift, make multi-agent routing more stable, and keep future slices aligned with Stage 11 governance and Stage 12 product-reality constraints.

Capsules are not a second architecture canon. They summarize, constrain and route. The upstream SSOT remains the relevant ADR, role, workflow, architecture, economy, runtime and stage documents.

## Upstream SSOT

- `docs/ai/context_map_for_cursor.md`
- `docs/ai/decisions/adr_0003_no_extra_directories_for_mvp.md`
- `docs/ai/decisions/adr_0005_ai_ops_v1_and_advanced_specialist_agents.md`
- `docs/ai/roles/orchestrator.md`
- `docs/ai/roles/tech_writer.md`
- `docs/ai/roles/planner.md`
- `docs/ai/roles/slice_strategist.md`
- `docs/ai/roles/runtime_governance_architect.md`
- `docs/architecture/domain/stage_11_9_closure_review_v1.md`
- `docs/architecture/domain/stage_12_ui_copy_mock_product_reality_alignment_v1.md`

## Capsule Inventory

| Capsule | Primary use | Attach by default? |
|---|---|---|
| `core/` | Mission, Path A/B firewall, governance formulas and common glossary | Yes, for complex Go2Asia tasks |
| `ui/` | UI/product reality, projection semantics, mock quarantine and safe vocabulary | For UI, copy, frontend and product-reality slices |
| `economy/` | Points, badges, G2A/Path B deferral, spendability and reward boundaries | For any Points/reward/spendability/G2A/NFT wording or logic |
| `security/` | Proof rejection, fraud boundaries, replay/double-claim and support-proof rules | For proof, abuse, auth, replay, mock-as-proof and security-sensitive work |
| `staging/` | Smoke doctrine, evidence bundles, staging exclusions and runtime validation principles | For smoke, staging, evidence and runtime validation slices |
| `stage_12_product_reality/` | Stage 12 findings, mock inventory categories and follow-up routing | For Stage 12.x cleanup and closure work |

## Composition Rule

Use one primary capsule and at most one or two secondary capsules. If a task needs more than three capsules, split the task or ask the Orchestrator to narrow the slice.

Default complex-task composition:

```text
core + one primary domain capsule + optional one secondary risk capsule
```

## What Capsules Do Not Authorize

- runtime changes;
- schema, migration, API, OpenAPI or SDK changes;
- frontend implementation unless explicitly requested in the slice;
- Path B activation;
- new economy semantics;
- public launch or production-ready claims;
- autonomous AI memory, orchestration runtime or magic prompt system.

## Review Gates

Stage 12.x.1 required and passed through these review modes:

- AI Ops Review;
- Canon Review;
- Runtime Governance Review;
- Economy Review;
- Context Boundary Review.

Future changes to these capsules must trigger at least Canon Review. Runtime, economy or security wording changes must also trigger the matching specialist review.
