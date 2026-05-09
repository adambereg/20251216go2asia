# RF Slice 6.28 - Gateway Shadow Evidence Aggregation & Staging Validation

## 1. Purpose

RF Slice 6.28 operationalizes the gateway identity-core shadow compare path introduced in Slice 6.27.

This slice adds lightweight safe aggregation for shadow evidence so staging can validate:

- how often shadow compare runs;
- whether helper output aligns with legacy output;
- whether known migration blockers appear;
- whether unexpected divergences or helper failures occur.

Legacy gateway extraction remains authoritative.

## 2. Non-goals

This slice does not:

- switch gateway role extraction to `identity-core`;
- change `X-Gateway-Auth`;
- migrate RF, PWA, claim, redeem, paid VIP gate, preview adapter, DTOs, public API, SDK/OpenAPI, DB, UI, Wallet, NFT, G2A, or reconciliation behavior;
- add external analytics, warehouse, OpenTelemetry, Prometheus, or long-term persistence;
- log PII, JWTs, raw payloads, raw role values, or raw `roles[]`.

## 3. Aggregation Model

Aggregation is gateway-local and process-local.

| Property | Decision |
| --- | --- |
| Storage | Module-local in-memory counters |
| Persistence | None |
| Scope | Worker isolate/process local |
| Reset | Test helper only |
| Runtime authority | None |
| Public API exposure | None |

The aggregation snapshot contains only safe enum/canonical buckets:

- total evaluations;
- counts by classification;
- counts by reason code;
- counts by helper source.

## 4. Safe Evidence Buckets

| Classification | Meaning |
| --- | --- |
| `aligned` | Helper role matches legacy role. |
| `migration_blocker` | Known policy blocker, currently unknown scalar fallback. |
| `unexpected_divergence` | Helper and legacy differ outside documented blockers. |
| `helper_failed` | Helper execution failed and legacy output stayed authoritative. |

Reason buckets:

| Reason code | Meaning |
| --- | --- |
| `aligned` | No mismatch. |
| `unknown_scalar_fallback_policy` | Helper falls through an unknown scalar; legacy gateway defaults to `spacer`. |
| `unexpected_role_mismatch` | Mismatch outside known policy blockers. |
| `helper_failed` | Helper threw or failed. |

Helper source buckets are helper source enums such as `role`, `go2_role`, `public_metadata.role`, or `none` for helper failure.

## 5. Feature Flags

| Flag | Default | Effect |
| --- | --- | --- |
| `GATEWAY_ENABLE_IDENTITY_CORE_SHADOW_COMPARE` | off | Enables helper execution beside legacy extraction. |
| `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE` | off | Enables safe per-request downstream evidence header. |
| `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE_AGGREGATION` | off | Enables safe in-memory aggregation of shadow compare outcomes. |

Rules:

- aggregation cannot run unless shadow compare runs;
- aggregation never changes auth success/failure;
- no flag makes helper output authoritative;
- evidence and aggregation can be enabled independently after shadow compare is enabled.

## 6. Staging Validation Flow

Recommended staging flow:

1. Deploy with all flags off.
2. Enable `GATEWAY_ENABLE_IDENTITY_CORE_SHADOW_COMPARE=true`.
3. Enable `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE=true` for internal downstream validation where safe.
4. Enable `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE_AGGREGATION=true`.
5. Exercise staging traffic.
6. Inspect safe aggregation snapshots in tests or internal tooling.
7. Validate that only expected buckets increment.

Staging validation checklist:

| Check | Expected result |
| --- | --- |
| Legacy JWT role | Unchanged |
| `aligned` | Increments for normal aligned payloads |
| `migration_blocker` | Increments for known unknown-scalar policy cases only |
| `unexpected_divergence` | Zero |
| `helper_failed` | Zero |
| Unsafe fields in snapshot | Zero |
| RF/PWA runtime imports | Still blocked |

## 7. Runtime Safety Guarantees

| Guarantee | Mechanism |
| --- | --- |
| Legacy output remains authoritative | Shadow result never mutates `verifiedUser`. |
| Auth success is unaffected | Helper failures are caught and bucketed. |
| No public API change | Aggregation is internal memory only; evidence header is downstream-internal and flag-gated. |
| No identity leakage | Snapshot stores only safe enum/canonical buckets. |
| No persistence | No DB or external telemetry integration. |

## 8. Helper Failure Handling

If `identity-core` throws:

- request continues;
- legacy `X-Gateway-Auth` remains minted;
- shadow classification is `helper_failed`;
- reason code is `helper_failed`;
- helper source bucket is `none`;
- aggregation increments only if aggregation flag is enabled.

## 9. Runtime Boundary

Slice 6.28 preserves the Slice 6.27 boundary:

| Surface | Boundary |
| --- | --- |
| Gateway runtime | May import `@go2asia/identity-core` for shadow compare only |
| RF runtime | Must not import `@go2asia/identity-core` |
| RF claim/store runtime | Must not import `@go2asia/identity-core` |
| PWA runtime | Must not import `@go2asia/identity-core` |

The import guard remains focused on preventing RF/PWA/claim runtime adoption while allowing the intentional gateway shadow import.

## 10. Known Blockers

| Blocker | Current handling |
| --- | --- |
| Unknown scalar fallback | Counted as `migration_blocker`; does not change legacy output. |
| Preview-vs-claim VIP alias divergence | Deferred to claim policy; not part of gateway shadow aggregation. |
| `capabilities[]` semantics | Remain metadata-only; not a runtime entitlement input. |
| Production observability | Not implemented; aggregation is lightweight and local. |

## 11. Risks

| Risk | Mitigation |
| --- | --- |
| In-memory counters are mistaken for global metrics | Documented as isolate/process-local staging evidence only. |
| Aggregation grows into analytics platform | No persistence, no external integration, safe buckets only. |
| Evidence leaks identity material | Snapshot excludes raw payload/JWT/user/roles and is tested with unsafe-pattern checks. |
| Helper failure impacts auth | Helper failure is non-fatal and counted separately. |
| Gateway shadow import spreads to RF/PWA | Boundary tests continue to block RF/PWA/claim runtime imports. |

## 12. Future Migration Path

Recommended next slices:

1. Staging shadow validation runbook using these counters.
2. Staging evidence review and Option A scalar fallback decision.
3. Feature-flagged gateway runtime adoption plan only after blockers are resolved.
4. RF auth runtime migration plan after gateway output is stable.
5. Claim convergence remains a separate policy track.

