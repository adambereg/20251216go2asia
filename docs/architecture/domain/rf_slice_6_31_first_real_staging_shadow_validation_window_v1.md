# RF Slice 6.31 - First Real Staging Shadow Validation Window

## 1. Purpose

RF Slice 6.31 records the first attempt to move gateway identity-core shadow validation from a pending review record toward real staging execution evidence.

No actual staging shadow validation window was available from the repository audit. This document therefore defines the operator execution plan and handoff checklist required to run the first real staging window safely.

This is not runtime adoption and does not approve gateway extraction replacement.

## 2. Execution Status

| Field | Value |
| --- | --- |
| Status | `execution_blocked_missing_staging_access` |
| Actual staging execution completed | No |
| Actual counters captured | No |
| Slice 6.30 pass/fail decision available | No |
| Runtime adoption approved | No |

The current Cursor environment does not have the live staging access, Cloudflare controls, secrets, valid staging user traffic, or runtime counter capture path required to complete the validation window.

## 3. Why Actual Validation Was Not Completed

The repository audit found staging documentation and deployment workflow references, but not a completed shadow validation window.

Actual execution is blocked because:

- live Cloudflare access and staging secrets are not available in the local repo context;
- live staging env vars cannot be inspected or changed safely from this Cursor session;
- no actual `GatewayIdentityShadowAggregate` snapshot was committed to the repo;
- no downstream evidence header sample from staging was committed to the repo;
- no route exercise log for gateway shadow validation was committed to the repo;
- no public HTTP endpoint exists for aggregate snapshots;
- process-local counters cannot be treated as global staging truth.

No fake evidence is recorded in this slice.

## 4. Required Staging Access

An operator needs:

| Access | Purpose |
| --- | --- |
| Cloudflare account access | Inspect and update staging Worker variables safely. |
| Staging gateway deployment access | Confirm deployed version and deploy if needed. |
| Staging gateway logs or internal tooling | Observe helper execution, safe headers, and auth regressions. |
| Downstream service log access | Inspect `X-Gateway-Identity-Shadow` only if evidence header is enabled. |
| Valid staging auth path | Exercise protected routes without using real user PII in records. |
| Rollback authority | Disable flags immediately if stop conditions occur. |

Known repo references:

- `.github/workflows/deploy-workers-staging.yml`
- `apps/api-gateway/wrangler.toml`
- `docs/ops/staging_services_overview.md`
- `docs/ops/environments.md`
- `docs/architecture/domain/rf_slice_6_29_gateway_shadow_validation_runbook_staging_review_v1.md`
- `docs/architecture/domain/rf_slice_6_30_staging_shadow_validation_review_record_v1.md`

## 5. Required Preflight Checks

Before enabling any shadow flag:

| Check | Required result |
| --- | --- |
| Gateway deployed to staging | Latest intended gateway build is active. |
| Gateway version identified | Commit/version is recorded for Slice 6.30. |
| Staging env variables available | Operator can inspect and update all three flags. |
| All three flags default off | Baseline starts with all shadow flags false. |
| Tests green | Identity-core, gateway fixture tests, RF fixture tests, and relevant typechecks pass. |
| Rollback owner assigned | Named owner is present for the whole window. |
| Downstream evidence observation path | Available only if `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE=true` is used. |
| No runtime adoption flag exists/enabled | No authoritative helper switch is active. |
| Identity-core dependency present | Gateway includes `@go2asia/identity-core` for shadow compare only. |
| RF/PWA/claim boundary intact | No runtime migration outside gateway shadow compare. |

## 6. Flag Enablement Plan

| Step | Flags | Expected observation | Stop condition | Rollback action |
| --- | --- | --- | --- | --- |
| Baseline | All three flags `false` | Legacy auth behavior only; no shadow header; no helper execution expected. | Auth failures already elevated. | Stop and investigate baseline before shadow validation. |
| Shadow only | `GATEWAY_ENABLE_IDENTITY_CORE_SHADOW_COMPARE=true` | Helper runs in shadow; `X-Gateway-Auth` unchanged; no evidence header if evidence flag remains false. | Auth failures increase or legacy JWT shape changes. | Disable shadow compare. |
| Evidence | `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE=true` only if safe downstream inspection exists | Internal downstream `X-Gateway-Identity-Shadow` can be inspected. | Unsafe field appears in evidence or downstream behavior changes. | Disable evidence, then shadow compare if needed. |
| Aggregation | `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE_AGGREGATION=true` | Process-local safe counters increment. | `unexpected_divergence > 0`, `helper_failed > 0`, or counters are misused as global truth. | Disable aggregation, evidence, then shadow compare. |

Use exact flag names:

- `GATEWAY_ENABLE_IDENTITY_CORE_SHADOW_COMPARE`
- `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE`
- `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE_AGGREGATION`

The mechanism for changing flags depends on the active staging deployment practice. Operators should use the approved Cloudflare Dashboard, Wrangler, or CI process for the environment and must avoid overwriting unrelated Worker variables.

## 7. Routes To Exercise

Exercise protected routes with normal authenticated staging traffic. Do not record real user identifiers.

Required route groups:

| Route group | Example | Notes |
| --- | --- | --- |
| Points | `/v1/points/balance` | Existing gateway tests use this as a protected route representative. |
| Referral | referral routes | Use normal authenticated staging request. |
| User | user routes | Verify legacy gateway auth remains stable. |
| RF | RF routes behind gateway auth | Confirm downstream compatibility. |
| Other protected route | Any protected route covered by gateway auth | Provides broader route confidence. |
| Controlled unknown scalar | Safe test token/payload only | Optional; never use unsafe real-user manipulation. |

Helper failure simulation should remain a test-only exercise unless a safe staging method is explicitly approved.

## 8. Evidence Capture Checklist

Capture only safe fields:

| Field | Capture rule |
| --- | --- |
| `total` | Record observed local/process counter value if available. |
| `aligned` | Record only safe bucket count. |
| `migration_blocker` | Record only safe bucket count and reason-code bucket. |
| `unexpected_divergence` | Must remain zero for pass consideration. |
| `helper_failed` | Must remain zero for pass consideration. |
| `reasonCode` counts | Safe enum/count buckets only. |
| `helperSource` counts | Safe helper-source buckets only. |
| Evidence header classification samples | Only if header is safe and contains no raw identity material. |

Do not capture:

- raw JWT;
- user ID;
- email;
- raw payload;
- raw role strings;
- raw `roles[]`;
- request tokens;
- real user identifiers.

Evidence limitations to record:

- counters are process-local and Worker-isolate local;
- counters may reset on cold start or redeploy;
- counters are not global telemetry;
- the current gateway has no public aggregate snapshot endpoint;
- downstream header inspection is internal and flag-gated.

## 9. Unsafe Evidence Check

Before copying any evidence into Slice 6.30:

| Unsafe item | Required result |
| --- | --- |
| Raw JWT | Not present |
| User ID or subject | Not present |
| Email | Not present |
| Raw payload | Not present |
| Raw role string | Not present |
| Raw `roles[]` | Not present |
| Request token | Not present |

If any unsafe item appears, stop validation, disable evidence, and do not paste the sample into docs.

## 10. Auth Regression Check

During and after the validation window:

| Check | Required result |
| --- | --- |
| Auth failures | No increase versus baseline. |
| `X-Gateway-Auth` shape | Unchanged. |
| Legacy JWT role | Unchanged. |
| RF projection | No mismatch introduced by shadow validation. |
| Claim behavior | No claim-impacting change. |
| Downstream behavior | No route failure caused by shadow header or helper execution. |

Any claim-impacting mismatch blocks runtime migration and must be escalated to the product/economy and claim owners.

## 11. Rollback Exercise Commands/Checklist

Because this slice has no runtime adoption, rollback means disabling shadow paths.

Rollback order:

1. Set `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE_AGGREGATION=false`.
2. Set `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE=false`.
3. Set `GATEWAY_ENABLE_IDENTITY_CORE_SHADOW_COMPARE=false`.

Operator command plan:

```text
# Use the approved staging flag management process for the active Cloudflare Worker.
# Do not run these as generic commands without confirming the repo's current deployment practice.

1. Inspect current staging gateway variables.
2. Set GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE_AGGREGATION=false.
3. Deploy/apply the variable change if required by the platform.
4. Confirm aggregation stops incrementing.
5. Set GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE=false.
6. Confirm X-Gateway-Identity-Shadow is no longer emitted.
7. Set GATEWAY_ENABLE_IDENTITY_CORE_SHADOW_COMPARE=false.
8. Confirm helper execution stops and X-Gateway-Auth remains unchanged.
```

Record completion only after an operator has actually performed the rollback exercise in staging.

## 12. Slice 6.30 Update Instructions

Update `docs/architecture/domain/rf_slice_6_30_staging_shadow_validation_review_record_v1.md` only with real observations.

Rules:

- Leave pending fields as `TBD` or `Not recorded yet` until real data exists.
- Do not write fake counters.
- Do not infer pass/fail from CI fixture tests.
- Do not approve runtime adoption without actual staging evidence and approvals.
- If execution remains blocked, keep the decision as `pending_execution` and cross-reference this Slice 6.31 plan.
- If execution completes, record routes exercised, flags, safe counters, unsafe evidence check, auth regression check, rollback result, and decision.

## 13. Decision Criteria

Allowed decision values for Slice 6.30:

| Decision | Use when |
| --- | --- |
| `pending_execution` | No real staging window has been recorded. |
| `pass` | Actual staging evidence exists and all gates passed. |
| `extend_observation` | More traffic or longer observation is needed. |
| `rollback` | Stop condition required disabling shadow flags. |
| `block_runtime_migration` | Evidence or policy blocker prevents future adoption planning. |

For this Slice 6.31 attempt, the correct execution status is `execution_blocked_missing_staging_access`, and Slice 6.30 must not be promoted to `pass`.

## 14. Operator Handoff Checklist

Before handoff:

| Item | Status |
| --- | --- |
| Rollback owner named | Required before execution |
| Gateway staging version identified | Required before execution |
| Flag management method confirmed | Required before execution |
| Downstream header observation path confirmed | Required if evidence flag is enabled |
| Safe auth traffic available | Required before execution |
| Unknown scalar test scenario approved | Optional and controlled only |
| Slice 6.30 ready for real values | Yes |
| Stop conditions understood | Required before execution |

Handoff note:

- The operator should fill Slice 6.30 after execution.
- The operator should not paste secrets, tokens, raw JWTs, raw payloads, user IDs, emails, raw role strings, or raw `roles[]`.
- The operator should stop immediately if `unexpected_divergence`, `helper_failed`, unsafe evidence, auth regression, or claim-impacting behavior appears.

## 15. Risks

| Risk | Mitigation |
| --- | --- |
| Local Cursor session mistaken for staging executor | Status explicitly says staging access is missing. |
| Fake pass/fail evidence | Slice 6.30 update rules prohibit invented values. |
| Worker-local counters treated as global truth | Evidence limitations are repeated in the plan. |
| Header evidence leaks identity material | Unsafe evidence checklist requires stop and disable evidence. |
| Wrangler/Dashboard changes overwrite unrelated vars | Operator must use approved staging flag management process and inspect current vars first. |
| Runtime adoption inferred from shadow validation | Runtime boundary and decision criteria forbid cutover. |
| Unknown scalar blocker ignored | Option A decision remains separate and approval-gated. |

## 16. Future Migration Path

Recommended next steps:

1. Assign staging operator and rollback owner.
2. Confirm staging gateway version and flag management method.
3. Run preflight checks.
4. Execute the flag sequence from this document and Slice 6.29.
5. Capture only safe evidence fields.
6. Fill Slice 6.30 with real observations.
7. Decide whether the outcome is `pass`, `extend_observation`, `rollback`, or `block_runtime_migration`.
8. If evidence is clean, prepare the Option A scalar fallback decision.
9. Only after approvals, propose a separate feature-flagged gateway runtime adoption slice.

