# RF Slice 6.27 - Gateway Shadow-Compare Implementation

## 1. Purpose

RF Slice 6.27 implements the first runtime-adjacent gateway identity-core evaluation path.

The gateway can now, behind default-off flags:

- compute its current legacy role extraction exactly as before;
- compute `identity-core` helper output in shadow mode;
- classify mismatches safely;
- keep legacy output authoritative;
- preserve the minted `X-Gateway-Auth` shape and values.

This is Strategy B from Slice 6.26. It is not runtime adoption.

## 2. Non-goals

This slice does not:

- make `identity-core` authoritative;
- replace gateway role extraction;
- change `X-Gateway-Auth` role or `roles[]`;
- migrate RF runtime;
- change claim, redeem, paid VIP gate, preview adapter, DTOs, public API, SDK/OpenAPI, DB, UI, Wallet, NFT, G2A, or reconciliation behavior.

## 3. Runtime Boundary Change

Gateway runtime is now allowed to import `@go2asia/identity-core` only for shadow comparison.

| Runtime surface | Boundary after Slice 6.27 |
| --- | --- |
| `apps/api-gateway/src/index.ts` | Allowed import for default-off shadow compare only |
| RF runtime | Still forbidden |
| RF claim/store runtime | Still forbidden |
| PWA runtime | Still forbidden |
| Tests | Allowed |

`@go2asia/identity-core` is promoted to an API Gateway runtime dependency. RF keeps the package test/dev-only.

## 4. Feature Flags

| Flag | Default | Effect |
| --- | --- | --- |
| `GATEWAY_ENABLE_IDENTITY_CORE_SHADOW_COMPARE` | off | Enables helper evaluation beside legacy extraction. |
| `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE` | off | Emits safe internal shadow evidence when shadow compare is enabled. |

No runtime adoption flag is added in this slice. No flag can make helper output authoritative.

## 5. Shadow Compare Model

The shadow compare wiring point is the protected gateway auth path:

1. Clerk token is verified.
2. Legacy `extractGatewayUserContext` computes `platformRole` and `roles`.
3. If shadow compare is enabled, `normalizeRolePayload` runs on the same verified payload.
4. Gateway compares helper role/source with legacy role.
5. Gateway mints `X-Gateway-Auth` from legacy `verifiedUser`.
6. Optional evidence is attached only as a safe internal downstream header.

The shadow result never mutates `verifiedUser`.

## 6. Safe Evidence Model

Evidence is emitted only when both flags are enabled. It is carried in internal downstream header `X-Gateway-Identity-Shadow`.

Allowed fields:

| Field | Meaning |
| --- | --- |
| `schemaVersion` | Static evidence schema version. |
| `shadowCompareEnabled` | Whether shadow compare flag was enabled. |
| `evidenceEnabled` | Whether evidence flag was enabled. |
| `classification` | Safe classification bucket. |
| `reasonCode` | Safe reason bucket. |
| `legacyRole` | Canonical legacy role only. |
| `helperRole` | Canonical helper role or `null`. |
| `helperSource` | Helper source enum or `null`. |

Evidence intentionally excludes:

- raw JWT;
- user ID / subject;
- email;
- raw payload;
- raw role strings;
- raw `roles[]`.

## 7. Failure Handling

Helper execution is non-fatal:

- helper errors are caught;
- classification becomes `helper_failed`;
- legacy request flow continues;
- `X-Gateway-Auth` remains legacy;
- helper failure does not turn a valid auth request into 401/503.

## 8. Classification Rules

| Classification | Reason code | Meaning |
| --- | --- | --- |
| `aligned` | `aligned` | Helper role equals legacy role. |
| `migration_blocker` | `unknown_scalar_fallback_policy` | Helper falls through unknown scalar source while current gateway defaults to legacy `spacer`. |
| `unexpected_divergence` | `unexpected_role_mismatch` | Helper and legacy differ outside documented blockers. |
| `helper_failed` | `helper_failed` | Helper threw or failed before producing safe output. |

Known blockers remain:

| Fixture | Legacy role | Helper role | Classification |
| --- | --- | --- | --- |
| `unknown-role-falls-through-go2-role` | `spacer` | `vip_spacer` | `migration_blocker` |
| `unknown-role-falls-through-public-metadata-role` | `spacer` | `pro` | `migration_blocker` |

## 9. Tests

Gateway tests cover:

- flags off: no evidence and legacy JWT unchanged;
- shadow on + evidence on: aligned evidence is safe;
- shadow on + evidence off: compare can run without exposed evidence;
- migration blocker fixture: helper differs, legacy JWT remains `spacer`;
- helper failure: request succeeds and legacy JWT remains authoritative;
- existing gateway compare-only fixture replay remains green.

RF tests cover:

- gateway runtime import is intentionally allowed only for `apps/api-gateway/src/index.ts`;
- RF runtime, RF claim/store, and PWA runtime still do not import `identity-core`;
- deterministic RF compare-only summaries remain safe.

## 10. What Remains Legacy-authoritative

| Surface | Status |
| --- | --- |
| Gateway `platformRole` used for minting | Legacy authoritative |
| Gateway `roles[]` used for minting | Legacy authoritative |
| `X-Gateway-Auth` shape | Unchanged |
| RF auth input | Unchanged |
| Paid claim VIP gate | Unchanged |
| Preview adapter | Unchanged |

## 11. Known Blockers

| Blocker | Status after Slice 6.27 |
| --- | --- |
| Unknown scalar fallback policy | Still blocks runtime adoption. Shadow compare can observe it. |
| Preview-vs-claim VIP alias divergence | Still deferred to claim policy. |
| `capabilities[]` runtime semantics | Still metadata-only. |
| Runtime evidence observability | Minimal internal test-visible evidence only; no production analytics system. |

## 12. Risks

| Risk | Mitigation |
| --- | --- |
| Shadow import mistaken for authoritative adoption | Runtime flags are compare/evidence only; helper output never mutates `verifiedUser`. |
| Evidence leaks identity material | Evidence uses canonical safe buckets only. |
| Helper failure affects auth | Helper failure is caught and classified. |
| Downstream code relies on internal evidence header | Header is flag-gated and not part of public API. |
| RF/PWA runtime imports creep in | Import guard still blocks RF/PWA/claim runtime imports. |

## 13. Future Migration Path

Recommended next slices:

1. Add production-safe aggregation or logging for shadow evidence if operationally needed.
2. Run shadow compare in staging with evidence flag enabled and runtime adoption absent.
3. Decide Option A malformed scalar policy based on evidence.
4. Implement a separate feature-flagged runtime adoption slice only after blockers are resolved.
5. Plan RF runtime migration after gateway output is stable.
6. Keep claim convergence separate.

