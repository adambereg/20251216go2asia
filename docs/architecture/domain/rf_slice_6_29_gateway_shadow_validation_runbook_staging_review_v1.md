# RF Slice 6.29 - Gateway Shadow Validation Runbook & Staging Review Procedure

## 1. Purpose

RF Slice 6.29 defines the operator runbook for staging validation of gateway identity-core shadow compare.

This runbook explains how to:

- enable shadow validation safely in staging;
- review safe evidence buckets;
- interpret known blockers;
- stop or roll back validation;
- record a reusable staging review;
- decide whether a future runtime adoption slice is allowed to proceed.

This is a governance and operations document only. It does not change runtime behavior.

## 2. Non-goals

This slice does not:

- switch gateway role extraction to `identity-core`;
- change `X-Gateway-Auth` semantics;
- migrate RF or PWA runtime;
- change claim, redeem, paid VIP gate, preview adapter, DTOs, public APIs, SDK/OpenAPI, DB, UI, Wallet, NFT, G2A, or reconciliation behavior;
- add external analytics or a production observability platform;
- persist counters;
- log PII, JWTs, raw payloads, raw role strings, or raw `roles[]`.

## 3. Preconditions

Before staging validation starts:

| Precondition | Required state |
| --- | --- |
| Gateway deployment | Latest gateway build with Slice 6.28 is deployed to staging. |
| Dependency | `@go2asia/identity-core` is included in gateway runtime dependency graph for shadow compare only. |
| Tests | `identity-core`, gateway identity fixture tests, RF identity fixture tests, and typechecks are green. |
| Flags | All identity-core gateway shadow flags are available and default off. |
| Rollback owner | A named release/rollback owner is available during the validation window. |
| Known blockers | Unknown scalar fallback blocker is understood and not treated as an unexpected production failure. |
| Unexpected divergences | No unresolved `unexpected_divergence` exists in compare-only tests. |
| Claim policy | Paid claim behavior is confirmed out of scope. |

## 4. Flag Enablement Sequence

Enable flags in this order:

| Step | Flag | Value | Expected result |
| --- | --- | --- | --- |
| 0 | all shadow flags | `false` | Baseline legacy behavior only. |
| 1 | `GATEWAY_ENABLE_IDENTITY_CORE_SHADOW_COMPARE` | `true` | Helper evaluates in shadow; legacy output remains authoritative. |
| 2 | `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE` | `true` only if internal downstream validation is needed | Safe per-request downstream evidence header can be emitted. |
| 3 | `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE_AGGREGATION` | `true` | Process-local safe counters begin incrementing. |

Rules:

- Do not enable aggregation unless shadow compare is enabled.
- Do not treat evidence header as public API.
- Do not add a runtime adoption flag in this validation phase.
- Do not change claim or RF behavior during validation.

## 5. Staging Validation Traffic

Exercise representative authenticated routes that require gateway user context:

- points routes;
- referral routes;
- user routes;
- RF routes behind gateway auth;
- other protected routes already covered by gateway auth middleware.

Traffic categories:

| Category | Purpose | Expected result |
| --- | --- | --- |
| Normal authenticated payloads | Validate common aligned behavior. | `aligned` increments; legacy JWT unchanged. |
| Known aligned fixture-like payloads | Confirm helper and legacy agree. | `aligned` only. |
| Unknown scalar blocker payloads in controlled test environment | Confirm blocker detection. | `migration_blocker` with `unknown_scalar_fallback_policy`; legacy role remains `spacer`. |
| Helper failure simulation | Test only, not real staging unless explicitly safe. | Request succeeds; `helper_failed` bucket increments in tests. |

## 6. Evidence Review Procedure

Review these safe counters during the staging window:

| Counter | Expected interpretation |
| --- | --- |
| `total` | Number of shadow evaluations seen by the local process/isolate. |
| `byClassification.aligned` | Normal successful parity. |
| `byClassification.migration_blocker` | Known blocker cases, especially unknown scalar fallback. |
| `byClassification.unexpected_divergence` | Stop condition if greater than zero. |
| `byClassification.helper_failed` | Stop condition if greater than zero. |
| `byReasonCode.unknown_scalar_fallback_policy` | Expected only for controlled malformed scalar cases. |
| `byHelperSource.*` | Safe helper-source distribution, not raw identity data. |

Review categories:

| Category | Decision |
| --- | --- |
| Clean aligned run | Candidate for extended observation or next review gate. |
| Expected blocker run | Record blocker; do not proceed to runtime adoption until policy decision. |
| Unexpected divergence | Stop validation and escalate. |
| Helper failure | Stop validation and inspect helper/runtime compatibility. |
| Unsafe evidence | Stop validation and disable evidence flags. |
| Missing evidence | Check flag state, downstream header visibility, and process-local counter limitations. |

Limitations:

- Counters are process-local and Worker-isolate local.
- Counters reset on cold start or redeploy.
- Counters are not global telemetry and must not be used as billing, SLA, or full-production analytics.
- The current implementation has no public HTTP endpoint for aggregate snapshots.

## 7. Stop Conditions

Stop validation if any of the following occurs:

| Stop condition | Immediate action |
| --- | --- |
| `unexpected_divergence > 0` | Disable evidence aggregation, evidence, then shadow compare; escalate to Gateway + Identity owners. |
| `helper_failed > 0` | Disable shadow compare if repeated; inspect helper/runtime compatibility. |
| Auth failures increase | Disable shadow compare and compare with baseline. |
| `X-Gateway-Auth` role/roles shape changes | Roll back immediately; legacy output must remain unchanged. |
| Unsafe evidence detected | Disable evidence flag and aggregation; open evidence safety review. |
| RF projection mismatch | Pause any RF migration planning; review gateway output. |
| Claim-impacting mismatch | Escalate to Product/economy and claim owners; do not proceed. |
| `capabilities[]` affects runtime role | Roll back; capability policy remains future-only. |

## 8. Blocker Escalation Flow

| Blocker | Owner/domain | Severity | Immediate action | Required decision | Blocks runtime adoption |
| --- | --- | --- | --- | --- | --- |
| Unknown scalar fallback policy | Gateway owner + Identity semantics owner | Critical | Keep runtime adoption off; keep shadow evidence only. | Accept Option A, reject Option A, or preserve permanent divergence. | Yes |
| Unexpected divergence | Gateway owner + Identity semantics owner | Critical | Stop validation and inspect payload category safely. | Classify as fixture gap, helper bug, or runtime blocker. | Yes |
| Helper failure | Gateway owner | High | Disable shadow compare if repeated. | Decide whether helper/runtime packaging or input handling needs fix. | Yes |
| Preview-vs-claim VIP alias divergence | Product/economy owner + claim owner + RF owner | High for claim convergence | Do not change claim behavior. | Separate claim policy decision. | Blocks claim convergence, not shadow validation |
| `capabilities[]` semantics | Identity semantics owner + future entitlement owners | Medium | Keep metadata-only. | Separate capability policy slice. | Blocks capability adoption, not shadow validation |
| Unsafe evidence | Gateway owner + Release owner | Critical | Disable evidence and aggregation. | Evidence schema must be fixed and reviewed. | Yes |

## 9. Rollback Exercise Plan

Because no runtime adoption has happened, rollback means disabling shadow evidence paths.

Rollback order:

1. Set `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE_AGGREGATION=false`.
2. Set `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE=false`.
3. Set `GATEWAY_ENABLE_IDENTITY_CORE_SHADOW_COMPARE=false`.

Validate after rollback:

| Check | Expected result |
| --- | --- |
| Helper execution | No longer runs. |
| Evidence header | Not emitted. |
| Aggregation counters | Stop incrementing. |
| Legacy auth | Normal. |
| `X-Gateway-Auth` | Unchanged. |
| RF behavior | Unchanged. |

## 10. Approval Matrix

Before any future runtime adoption slice:

| Approval gate | Required approver |
| --- | --- |
| Option A scalar fallback policy | Identity semantics owner + Gateway owner |
| Gateway runtime adoption plan | Gateway owner + Release owner |
| Rollback owner assigned | Release owner |
| Evidence safety review | Gateway owner + Security/release reviewer |
| Claim non-impact confirmation | Product/economy owner + claim owner |
| RF downstream compatibility | RF owner |
| No unexpected divergences | Gateway owner + Identity semantics owner |
| No helper failures in staging window | Gateway owner |

Approval means a future implementation slice may be proposed. It does not authorize direct runtime cutover inside this runbook.

## 11. Staging Review Template

Use this static template for each validation window:

```text
RF Slice 6.29 Gateway Shadow Validation Review

Date/window:
Environment:
Gateway version/commit:
Reviewer(s):
Rollback owner:

Enabled flags:
- GATEWAY_ENABLE_IDENTITY_CORE_SHADOW_COMPARE:
- GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE:
- GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE_AGGREGATION:

Routes exercised:
- 

Evidence summary:
- total:
- aligned:
- migration_blocker:
- unexpected_divergence:
- helper_failed:
- reasonCode counts:
- helperSource counts:

Known blocker summary:
- unknown scalar fallback:
- preview-vs-claim:
- capabilities[]:

Unsafe evidence check:
- raw JWT present? yes/no
- subject/userId present? yes/no
- raw payload present? yes/no
- raw roles[] present? yes/no

Auth regression check:
- auth failures changed? yes/no
- X-Gateway-Auth shape changed? yes/no
- RF projection mismatch observed? yes/no

Decision:
- pass
- extend observation
- rollback
- block runtime migration

Reviewer notes:
-
```

## 12. Runtime Boundary

Boundary remains:

| Surface | Status |
| --- | --- |
| Gateway runtime | May import `@go2asia/identity-core` only for shadow compare. |
| RF runtime | Must not import `@go2asia/identity-core`. |
| RF claim/store runtime | Must not import `@go2asia/identity-core`. |
| PWA runtime | Must not import `@go2asia/identity-core`. |
| Claim behavior | Unchanged. |

## 13. What Remains Experimental

- Shadow aggregation is local process/isolate evidence, not global telemetry.
- Evidence header is internal/downstream-only and flag-gated.
- Unknown scalar fallback remains unresolved.
- Runtime adoption remains future work.
- RF runtime migration remains future work.
- Claim convergence remains separate.

## 14. Risks

| Risk | Mitigation |
| --- | --- |
| Local counters treated as global truth | Runbook explicitly labels them process-local staging evidence. |
| Evidence leaks identity material | Stop condition and review template include unsafe evidence checks. |
| Operator enables flags out of order | Flag sequence is explicit. |
| Migration blocker is ignored | Escalation matrix marks unknown scalar fallback as runtime-adoption blocker. |
| Rollback owner missing | Preconditions require named rollback owner. |
| Shadow validation confused with runtime adoption | Non-goals and approval matrix prohibit cutover. |

## 15. Future Migration Path

Recommended next steps:

1. Run this staging validation procedure.
2. Record one or more staging review templates.
3. Decide the unknown scalar fallback policy.
4. If blockers are resolved, draft a feature-flagged gateway runtime adoption plan.
5. Plan RF runtime migration only after gateway output is stable.
6. Keep claim convergence as a separate policy and implementation track.

