# RF Slice 6.30 - Staging Shadow Validation Review Record

## 1. Purpose

RF Slice 6.30 creates the first operational review record for gateway identity-core shadow validation.

This document is the execution artifact that should be filled after a staging validation window is run using the Slice 6.29 runbook. No actual staging evidence was found in the repository during audit, so this record is intentionally created as a pending execution record.

This is not runtime adoption and does not approve gateway extraction replacement.

## 2. Record Status

| Field | Value |
| --- | --- |
| Status | `pending_execution` |
| Record type | Pending Execution Review Record |
| Actual staging window recorded | No |
| Evidence fields populated | No |
| Pass/fail decision made | No |
| Runtime adoption approved | No |

All unfilled fields in this document are intentionally marked as `TBD` or `Not recorded yet`. This record must not be treated as staging pass evidence, fail evidence, or migration approval.

Next action: run staging validation according to `rf_slice_6_29_gateway_shadow_validation_runbook_staging_review_v1.md`, then fill this record with real observations.

## 3. Evidence Source

Source runbook:

- `docs/architecture/domain/rf_slice_6_29_gateway_shadow_validation_runbook_staging_review_v1.md`

Related implementation and planning references:

- `docs/architecture/domain/rf_slice_6_27_gateway_shadow_compare_implementation_v1.md`
- `docs/architecture/domain/rf_slice_6_28_gateway_shadow_evidence_aggregation_staging_validation_v1.md`
- `apps/api-gateway/src/index.ts`
- `apps/api-gateway/test/identity-core-golden-fixtures.test.ts`

Repository audit result:

| Evidence source | Result |
| --- | --- |
| Filled staging shadow validation record | Not found |
| Actual staging counter snapshot | Not found |
| Actual staging downstream evidence sample | Not found |
| Actual staging route exercise log | Not found |
| CI/fixture evidence | Present, but not staging evidence |
| Slice 6.29 review template | Present |

## 4. Validation Record

### Preconditions Checklist

| Precondition | Status | Notes |
| --- | --- | --- |
| Latest gateway deployed to staging | TBD | Not recorded yet |
| `@go2asia/identity-core` included in gateway runtime dependency graph | TBD | Not recorded yet |
| Gateway identity fixture tests green | TBD | Not recorded yet |
| RF identity fixture tests green | TBD | Not recorded yet |
| Shadow flags available and default off | TBD | Not recorded yet |
| Rollback owner identified | TBD | Not recorded yet |
| No unresolved `unexpected_divergence` in tests | TBD | Not recorded yet |
| Claim non-impact confirmed | TBD | Not recorded yet |

### Validation Window

| Field | Value |
| --- | --- |
| Date/window | TBD |
| Environment | TBD |
| Reviewer(s) | TBD |
| Rollback owner | TBD |

### Environment

| Field | Value |
| --- | --- |
| Staging environment name | TBD |
| Gateway deployment target | TBD |
| Downstream services observed | TBD |
| Notes | Not recorded yet |

### Gateway Version/Commit

| Field | Value |
| --- | --- |
| Gateway commit | TBD |
| Gateway deployment version | TBD |
| Identity-core package version/commit | TBD |
| Verification command or artifact | Not recorded yet |

### Flags Enabled

| Flag | Recorded value |
| --- | --- |
| `GATEWAY_ENABLE_IDENTITY_CORE_SHADOW_COMPARE` | TBD |
| `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE` | TBD |
| `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE_AGGREGATION` | TBD |

Expected first validation sequence:

1. Baseline with all flags off.
2. Enable `GATEWAY_ENABLE_IDENTITY_CORE_SHADOW_COMPARE=true`.
3. Enable `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE=true` only for internal downstream validation if needed.
4. Enable `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE_AGGREGATION=true`.

### Routes Exercised

| Route or route group | Status | Notes |
| --- | --- | --- |
| Normal authenticated gateway route | TBD | Not recorded yet |
| Points route | TBD | Not recorded yet |
| Referral route | TBD | Not recorded yet |
| User route | TBD | Not recorded yet |
| RF route behind gateway auth | TBD | Not recorded yet |
| Controlled unknown scalar fixture/test-env path | TBD | Only if safely available |
| Helper failure simulation | Not recorded yet | Tests only unless explicitly safe |

## 5. Pending Fields Or Observed Results

### Evidence Summary

Use only safe fields. Do not add raw JWTs, user IDs, emails, raw payloads, raw role strings, raw `roles[]`, request tokens, or real user identifiers.

| Safe field | Observed value |
| --- | --- |
| `total` | Not recorded yet |
| `aligned` | Not recorded yet |
| `migration_blocker` | Not recorded yet |
| `unexpected_divergence` | Not recorded yet |
| `helper_failed` | Not recorded yet |
| `reasonCode` counts | Not recorded yet |
| `helperSource` counts | Not recorded yet |

Evidence limitations to repeat in the completed record:

- Counters are process-local and Worker-isolate local.
- Counters can reset on cold start or redeploy.
- Counters are not global staging truth.
- There is no public HTTP endpoint for aggregate snapshots.
- Downstream `X-Gateway-Identity-Shadow` evidence is internal and flag-gated.

### Known Blocker Summary

| Blocker | Recorded observation | Runtime adoption impact |
| --- | --- | --- |
| Unknown scalar fallback policy | Not recorded yet | Blocks runtime adoption until Option A is accepted/rejected or divergence is explicitly preserved. |
| Preview-vs-claim VIP alias divergence | Not recorded yet | Does not block shadow validation; blocks claim convergence. |
| `capabilities[]` semantics | Not recorded yet | Future-only; must remain metadata-only. |
| Helper failure | Not recorded yet | Blocks runtime adoption if observed. |
| Unexpected divergence | Not recorded yet | Blocks runtime adoption if observed. |

### Unsafe Evidence Check

| Check | Result |
| --- | --- |
| Raw JWT present | Not recorded yet |
| Subject/user ID present | Not recorded yet |
| Email present | Not recorded yet |
| Raw payload present | Not recorded yet |
| Raw role string present | Not recorded yet |
| Raw `roles[]` present | Not recorded yet |
| Request token present | Not recorded yet |

### Auth Regression Check

| Check | Result |
| --- | --- |
| Auth failures changed | Not recorded yet |
| `X-Gateway-Auth` shape changed | Not recorded yet |
| Legacy JWT role changed | Not recorded yet |
| RF projection mismatch observed | Not recorded yet |
| Claim-impacting mismatch observed | Not recorded yet |

### Runtime Boundary Check

| Boundary | Result |
| --- | --- |
| Gateway uses `identity-core` only for shadow compare | Not recorded yet |
| RF runtime does not import `identity-core` | Not recorded yet |
| PWA runtime does not import `identity-core` | Not recorded yet |
| Claim/store runtime does not import `identity-core` | Not recorded yet |
| `X-Gateway-Auth` remains legacy-authoritative | Not recorded yet |

### Rollback Exercise Result

| Rollback check | Result |
| --- | --- |
| `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE_AGGREGATION=false` applied | Not recorded yet |
| `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE=false` applied | Not recorded yet |
| `GATEWAY_ENABLE_IDENTITY_CORE_SHADOW_COMPARE=false` applied | Not recorded yet |
| Helper no longer runs | Not recorded yet |
| Evidence header no longer emitted | Not recorded yet |
| Aggregation counters stop incrementing | Not recorded yet |
| Legacy auth remains normal | Not recorded yet |

## 6. Decision Framework

Allowed decision values:

| Decision | Meaning |
| --- | --- |
| `pending_execution` | Staging validation has not been recorded yet. |
| `pass` | Actual staging evidence was reviewed and all gates passed. |
| `extend_observation` | More staging traffic or a longer window is required. |
| `rollback` | Shadow validation must be disabled using the Slice 6.29 rollback sequence. |
| `block_runtime_migration` | Evidence or policy blockers prevent future runtime adoption planning. |

Current decision:

| Field | Value |
| --- | --- |
| Decision | `pending_execution` |
| Reason | No actual staging evidence is recorded in the repository. |
| Runtime adoption allowed | No |

No future runtime adoption slice should use this pending record as approval evidence.

## 7. Option A Scalar Fallback Decision Prep

Current blocker:

- Unknown scalar fallback policy remains unresolved.

Evidence needed:

- Actual staging shadow classifications for normal authenticated payloads.
- Controlled observation of known unknown-scalar blocker behavior if safely possible in a fixture/test environment.
- Confirmation that `migration_blocker` only appears for known scalar policy cases.
- Confirmation that `unexpected_divergence` remains zero.
- Confirmation that `helper_failed` remains zero.
- Confirmation that legacy `X-Gateway-Auth` role semantics remain unchanged.

Required approvers:

- Gateway owner.
- Identity semantics owner.
- RF owner for downstream compatibility.
- Product/economy owner for claim-impacting behavior.
- Release owner for rollback ownership.

Decision options:

1. Accept Option A and plan a future feature-flagged gateway runtime migration.
2. Reject Option A and align helper/fixtures to legacy fallback semantics.
3. Preserve permanent divergence and keep gateway runtime authoritative behavior unchanged.

No Option A decision should be made from this pending record alone.

## 8. Runtime Boundary

This record does not change runtime boundaries:

| Surface | Boundary |
| --- | --- |
| Gateway | May run `identity-core` helper only in shadow compare behind flags. |
| Gateway authoritative output | Legacy extraction remains authoritative. |
| `X-Gateway-Auth` | Semantics unchanged. |
| RF runtime | No migration to `identity-core`. |
| PWA runtime | No migration to `identity-core`. |
| Claim/redeem | No behavior change. |
| Preview adapter | No migration. |
| Public APIs/DTOs | No change. |
| DB/SDK/OpenAPI/UI | No change. |

## 9. What Remains Experimental

- Staging shadow validation has not been executed in this record.
- Aggregation remains process-local and non-persistent.
- Evidence header remains internal and flag-gated.
- Unknown scalar fallback policy remains unresolved.
- Runtime adoption remains future work.
- RF migration remains future work.
- Claim convergence remains a separate governance track.

## 10. Risks

| Risk | Mitigation |
| --- | --- |
| Pending record mistaken for pass evidence | Status and decision are explicitly `pending_execution`. |
| Fake counts added later | Evidence summary requires real observations only. |
| Local counters treated as global truth | Limitations are repeated in this record. |
| Unsafe evidence copied into record | Safe-field-only policy is explicit. |
| Runtime adoption inferred from template | Runtime boundary and decision framework prohibit it. |
| Option A decided without evidence | Decision prep requires actual staging observations and approvers. |

## 11. Future Migration Path

Recommended next steps:

1. Execute the Slice 6.29 staging validation runbook.
2. Fill this record with actual staging observations.
3. Review safe counters and evidence limitations.
4. Decide whether to pass, extend observation, rollback, or block runtime migration.
5. Use actual evidence to prepare the Option A scalar fallback decision.
6. Only after approvals, propose a separate feature-flagged gateway runtime adoption slice.

