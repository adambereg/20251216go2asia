# RF Slice 6.32 - First Actual Staging Validation Execution & Evidence Capture

## 1. Purpose

RF Slice 6.32 records the second attempt to move gateway identity-core shadow validation from operational readiness into actual staging evidence capture.

No real staging shadow validation evidence was found during the repository audit, and the current Cursor environment does not have live Cloudflare/staging access, secrets, deployment controls, runtime logs, safe counter snapshots, or live authenticated staging traffic. This document therefore records the attempted execution as blocked and preserves the operator handoff required for a real validation window.

This is not runtime adoption and does not approve gateway extraction replacement.

## 2. Execution Status

| Field | Value |
| --- | --- |
| Status | `execution_blocked_missing_staging_access` |
| Execution path | Option B - Execution Still Blocked |
| Actual staging execution completed | No |
| Actual evidence captured | No |
| Slice 6.30 updated with real observations | No |
| Pass/fail decision made | No |
| Runtime adoption approved | No |

Slice 6.30 must remain pending until an operator records real staging observations.

## 3. Why Actual Execution Was Not Completed

Actual validation was not completed because the required live staging access and evidence surfaces are not available in this repository context.

Blocking gaps:

- no confirmed Cloudflare account/session access from this Cursor environment;
- no available staging secrets or deployment controls;
- no safe way to inspect or update live Worker variables;
- no committed `GatewayIdentityShadowAggregate` snapshot;
- no committed downstream `X-Gateway-Identity-Shadow` sample;
- no committed route exercise log;
- no committed operator note from a staging validation window;
- no public HTTP endpoint for aggregate snapshots;
- no confirmed live authenticated staging traffic source.

No fake counters, route results, header samples, or pass/fail decision are recorded.

## 4. Audit Findings

| Area | Finding |
| --- | --- |
| Slice 6.30 review record | Exists and remains `pending_execution`; evidence fields are still empty. |
| Slice 6.31 execution plan | Exists and records missing staging access as the blocker. |
| Slice 6.29 runbook | Provides flag sequence, evidence review, rollback, and approval gates. |
| Slice 6.28 aggregation design | Confirms process-local in-memory counters only. |
| Gateway implementation | Shadow compare, evidence header, and aggregation exist behind flags. |
| Gateway tests | Validate fixture behavior and safe aggregate snapshots in CI, not staging. |
| Staging workflow | Deploys Workers and smoke tests, but does not expose shadow flags or aggregate counters. |
| Staging docs | Describe workers and environments, but not an executed shadow validation window. |
| New staging artifacts | Not found. |

## 5. Missing Access/Artifacts

Required but not available in the current execution context:

| Missing item | Why it matters |
| --- | --- |
| Cloudflare account access | Needed to inspect/update staging Worker variables. |
| Staging Worker variable inspection | Needed to confirm actual flag values. |
| Staging deployment control | Needed to deploy or confirm gateway version. |
| Safe staging auth traffic | Needed to exercise protected routes without real user PII. |
| Downstream evidence observation path | Needed if `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE=true` is enabled. |
| Aggregate counter snapshot path | Needed to record local safe counters. |
| Operator rollback authority | Needed to disable flags when stop conditions occur. |
| Review owner notes | Needed to populate Slice 6.30 with real observations. |

## 6. What Can Be Verified From Repo

The repository can verify:

- the exact shadow flags exist in gateway code;
- `identity-core` helper execution is behind `GATEWAY_ENABLE_IDENTITY_CORE_SHADOW_COMPARE`;
- downstream evidence header emission is behind `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE`;
- process-local aggregation is behind `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE_AGGREGATION`;
- safe aggregate fields are `total`, `byClassification`, `byReasonCode`, and `byHelperSource`;
- protected route groups include points, wallet, referral, users, content registration, media upload/attach, space, organizer, reactions, feed, quest, rielt, and RF routes;
- helper failure is non-fatal in tests and legacy auth remains authoritative;
- Slice 6.29 and Slice 6.31 define operator execution and rollback procedures.

## 7. What Cannot Be Claimed

Without live staging execution, this slice cannot claim:

- actual flag values in staging;
- actual gateway version currently deployed to staging;
- actual route groups exercised in staging;
- actual safe counter values;
- actual `aligned`, `migration_blocker`, `unexpected_divergence`, or `helper_failed` counts;
- absence of helper failures in live staging;
- absence of auth regression in live staging;
- absence of unsafe evidence in downstream logs;
- successful rollback exercise;
- `pass`, `rollback`, `extend_observation`, or `block_runtime_migration` decision based on actual evidence.

CI/fixture evidence is useful guard coverage, but it is not live staging evidence.

## 8. Operator Execution Checklist

An operator with staging access should:

1. Confirm staging gateway deployment and record gateway commit/version.
2. Confirm `@go2asia/identity-core` runtime dependency is included in the gateway build.
3. Confirm current Worker variables.
4. Confirm all three shadow flags default off:
   - `GATEWAY_ENABLE_IDENTITY_CORE_SHADOW_COMPARE=false`
   - `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE=false`
   - `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE_AGGREGATION=false`
5. Assign a rollback owner for the full validation window.
6. Confirm downstream service can safely observe `X-Gateway-Identity-Shadow` if evidence is enabled.
7. Enable `GATEWAY_ENABLE_IDENTITY_CORE_SHADOW_COMPARE=true`.
8. Exercise at least one protected route with normal authenticated staging traffic.
9. Enable `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE=true` only if internal downstream validation is safe.
10. Enable `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE_AGGREGATION=true`.
11. Exercise route groups:
    - points, including `/v1/points/balance`;
    - referral;
    - user;
    - RF behind gateway auth;
    - at least one other protected route.
12. Capture safe counters only:
    - `total`;
    - `aligned`;
    - `migration_blocker`;
    - `unexpected_divergence`;
    - `helper_failed`;
    - `reasonCode` counts;
    - `helperSource` counts.
13. Check unsafe evidence is absent:
    - raw JWT;
    - user ID;
    - email;
    - raw payload;
    - raw role strings;
    - raw `roles[]`;
    - request tokens.
14. Check auth regression:
    - auth failures;
    - `X-Gateway-Auth` shape;
    - legacy JWT role;
    - RF projection;
    - claim-impacting behavior.
15. Perform rollback exercise in this order:
    - `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE_AGGREGATION=false`;
    - `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE=false`;
    - `GATEWAY_ENABLE_IDENTITY_CORE_SHADOW_COMPARE=false`.
16. Fill Slice 6.30 with only real observations.

## 9. Slice 6.30 Update Rules

Slice 6.30 should be updated only with actual staging evidence.

If actual evidence becomes available:

- replace `TBD` and `Not recorded yet` values with real observed values;
- record flags, route groups, safe counters, unsafe evidence result, auth regression result, runtime boundary check, rollback result, and decision;
- do not paste secrets, tokens, raw payloads, raw roles, user IDs, emails, or raw JWTs.

If execution remains blocked:

- keep Slice 6.30 as `pending_execution`;
- add cross-references to blocked execution attempts;
- do not fill counters;
- do not set `pass`, `rollback`, `extend_observation`, or `block_runtime_migration` from invented evidence.

## 10. Decision Status

| Field | Value |
| --- | --- |
| Current decision | `pending_execution` |
| Reason | Actual staging evidence is not available. |
| Slice 6.30 pass/fail decision | Not available |
| Runtime adoption status | Not approved |

Allowed future decisions after real evidence:

- `pass`;
- `extend_observation`;
- `rollback`;
- `block_runtime_migration`.

This document does not make any of those decisions.

## 11. Runtime Boundary

Runtime boundary remains unchanged:

| Surface | Status |
| --- | --- |
| Gateway authoritative role extraction | Legacy remains authoritative. |
| `X-Gateway-Auth` | Semantics unchanged. |
| `identity-core` in gateway | Shadow compare only, behind flags. |
| RF runtime | No migration. |
| PWA runtime | No migration. |
| Claim/redeem behavior | No change. |
| Preview adapter | No migration. |
| Public APIs/DTOs | No change. |
| DB/SDK/OpenAPI/UI | No change. |
| External analytics | Not introduced. |

## 12. Risks

| Risk | Mitigation |
| --- | --- |
| Blocked execution mistaken for failed validation | Status explicitly says execution was blocked, not failed. |
| Fake evidence added to Slice 6.30 | Update rules prohibit invented values. |
| CI fixture evidence treated as staging evidence | This document separates repo-verifiable facts from live observations. |
| Local counters treated as global truth | Operator checklist repeats process-local limitations. |
| Unsafe identity material copied into docs | Capture checklist forbids raw identity data. |
| Flag changes overwrite unrelated Worker vars | Operator must inspect current vars and use approved Cloudflare process. |
| Runtime adoption inferred from shadow readiness | Runtime boundary and decision status prohibit adoption. |

## 13. Future Migration Path

Recommended next steps:

1. Assign an operator with Cloudflare/staging access.
2. Run the Slice 6.29 runbook using the Slice 6.31 handoff plan.
3. Capture only safe evidence fields.
4. Update Slice 6.30 with real staging observations.
5. Decide whether the result is `pass`, `extend_observation`, `rollback`, or `block_runtime_migration`.
6. If evidence is clean, prepare the Option A scalar fallback decision.
7. Only after approvals, propose a separate feature-flagged gateway runtime adoption slice.

