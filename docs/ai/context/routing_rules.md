# AI Context Capsule Routing Rules

Status: `stage_12_x_1_initial_routing_rules`  
Purpose: practical prompt attachment strategy for Cursor and Go2Asia multi-agent orchestration

## Default Routing Formula

```text
complex_task_context = core + primary_domain_capsule + optional_secondary_risk_capsule
```

Use the smallest set that can safely answer the task. Do not attach the entire Stage 10/11/12 history when a capsule plus one upstream SSOT doc is enough.

## Required Capsules by Slice Type

| Slice type | Required capsules | Optional secondary capsule |
|---|---|---|
| AI Ops / roles / workflows / context governance | `core/` | domain capsule affected by the change |
| UI, copy, frontend product-reality work | `core/` + `ui/` | `economy/` for Points/reward wording; `security/` for proof/mock abuse |
| Economy policy, Points, rewards, spendability | `core/` + `economy/` | `security/`; `staging/` if validation evidence is claimed |
| Security, fraud, mock-as-proof, support proof | `core/` + `security/` | `economy/` or `staging/` by trigger |
| Smoke, staging, runtime validation, evidence review | `core/` + `staging/` | `security/` for abuse or replay evidence |
| Stage 12.x follow-up cleanup | `core/` + `stage_12_product_reality/` | `ui/`, then `economy/` or `security/` only by trigger |
| Stage closure or canon review | `core/` | affected domain capsule |

## Mandatory Attach Rules

- Attach `core/` for complex tasks, stage/slice tasks, economy/security/runtime-sensitive work and canon updates.
- Attach `ui/` for user-facing terminology, mock/demo surfaces, dashboards, projections, badges, wallet-like UI, route labels or copy changes.
- Attach `economy/` when a task mentions Points, rewards, spendability, G2A, NFT, badges as value, token sinks, payout, cashback or settlement.
- Attach `security/` when a task mentions proof, receipt, fraud, abuse, replay, double-claim, mock-as-proof, support proof, auth or secrets.
- Attach `staging/` only when a task makes or reviews smoke, staging, evidence, runtime validation or launch-readiness claims.
- Attach `stage_12_product_reality/` for Stage 12.x cleanup, closure review, mock inventory, legacy vocabulary planning and product-reality reports.

## Do Not Combine Without Orchestrator Approval

- `economy/` + `staging/` + `security/` + backend/API scope in one implementation prompt.
- `ui/` + runtime/schema/API changes in a Stage 12.x UI cleanup prompt.
- `staging/` with public launch approval language.
- `stage_12_product_reality/` with Path B implementation work.
- Any capsule set that asks Cursor to read the whole repo.

## Anti-Overload Rules

1. Use one primary capsule.
2. Add secondary capsules only for real risk triggers.
3. Keep role files to the lead role plus required reviewers.
4. Prefer `stage_11_9` plus one profile stage doc over all Stage 11 docs.
5. Prefer path lists over broad globbing.
6. If the prompt needs more than 15 docs, split the slice.
7. If the answer depends on runtime truth, require named evidence and the `staging/` capsule.
8. If a capsule conflicts with upstream SSOT, upstream SSOT wins and Canon Review is required.

## Practical Examples

```text
Stage 12.x.2 route/type vocabulary plan:
core + stage_12_product_reality + ui
```

```text
Mock quarantine inventory:
core + stage_12_product_reality + ui + optional security
```

```text
Projection metadata UI requirements:
core + ui + security + optional staging
```

```text
Next 15 typecheck blocker cleanup:
core + ui only if UI routes are affected; no economy/security/staging by default
```

```text
Runtime smoke evidence review:
core + staging + security if proof rejection is in scope
```

## Stop Lines

Stop and ask for a narrower slice if:

- the task starts mixing frontend implementation, backend contracts, economy rules and staging validation;
- Path B is treated as active product;
- mock, screenshot, dashboard or diagnostic output is treated as proof;
- public launch or production readiness is inferred from Stage 11, Stage 12 or smoke language;
- a capsule becomes longer than a bounded manifest and starts replacing upstream canon.
