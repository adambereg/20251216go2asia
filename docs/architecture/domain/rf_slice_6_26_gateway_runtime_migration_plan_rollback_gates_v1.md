# RF Slice 6.26 - Gateway Runtime Migration Plan & Rollback Gates

## 1. Purpose

RF Slice 6.26 defines the first controlled migration plan for moving API Gateway role extraction toward the shared `identity-core` semantics.

This is a planning-only slice. It designs:

- gateway runtime migration readiness gates;
- rollback criteria;
- dual-path shadow evaluation;
- compare-only gating;
- feature flag strategy;
- sequencing from evidence to runtime adoption.

It does not implement gateway runtime migration and does not change current behavior.

## 2. Non-goals

This slice does not:

- import `@go2asia/identity-core` from gateway runtime;
- replace gateway extraction;
- migrate RF runtime;
- change claim, redeem, paid VIP gate, preview adapter, DTOs, flags, SDK/OpenAPI, DB, UI, Wallet, NFT, G2A, observability, or reconciliation behavior;
- change fixture semantics;
- authorize production rollout.

The shared helper remains a compare-only semantic engine until a separate implementation slice explicitly adopts it.

## 3. Migration Readiness Matrix

| Dimension | Status | Evidence | Gate decision |
| --- | --- | --- | --- |
| Fixture parity | ready | `identityGoldenFixtures` validate and package tests pass. | Required pre-gate for any rollout. |
| Gateway helper parity | experimental | Gateway compare-only tests classify known malformed scalar divergence. | Runtime migration blocked until policy accepted. |
| RF helper parity | ready | RF evidence/helper parity remains aligned for diagnostic surfaces. | Required pre-gate before RF migration, not gateway cutover alone. |
| Malformed scalar coverage | blocked | Slice 6.25 fixtures expose current gateway vs helper policy mismatch. | Must be approved before gateway runtime adoption. |
| Runtime import boundary | ready | Guard keeps `identity-core` out of gateway/RF/PWA runtime today. | Boundary changes require explicit migration slice. |
| Capability behavior | deferred | `capabilities[]` is fixture metadata only and not runtime entitlement input. | Not part of gateway role migration. |
| Preview-vs-claim divergence | deferred | `conflict-role-spacer-roles-vip` remains intentionally different for claim semantics. | Claim convergence is later and separate. |
| Rollback availability | experimental | Flag strategy and gates are designed here, not implemented. | Must be implemented and tested before runtime enablement. |
| Compare-only evidence stability | ready | Gateway/RF compare-only suites produce deterministic summaries. | Must remain green before each rollout step. |
| Gateway/RF alignment | experimental | RF consumes gateway-resolved internal JWT; unknown scalar mismatch propagates through projection. | Gateway policy must settle first. |

Readiness summary: the evidence layer is mature, but gateway runtime adoption is blocked by the malformed/unknown scalar policy decision from Slice 6.25.

## 4. Gateway Migration Strategies

| Strategy | Description | Pros | Cons | Rollback friendliness | Recommendation |
| --- | --- | --- | --- | --- | --- |
| Strategy A - Full Switch | Replace gateway extraction with `identity-core` helper output directly. | Simplest final architecture. | Highest risk; malformed scalar behavior changes immediately; no shadow evidence. | Poor unless wrapped after the fact. | Do not use first. |
| Strategy B - Dual-path Compare-only Shadow | Compute legacy gateway result and helper result; legacy remains authoritative. | Lowest behavior risk; captures real payload drift; keeps rollback trivial. | Requires runtime dependency, evidence plumbing, and mismatch classification. | Strong: disable shadow flag. | First runtime-adjacent step. |
| Strategy C - Feature-flagged Runtime Adoption | Helper result can become authoritative behind a default-off runtime flag while shadow compare remains available. | Controlled cutover; fast rollback; supports staged rollout. | Requires strict gates and operational ownership. | Strong: disable runtime flag. | Use after stable Strategy B. |
| Strategy D - Full Adoption After Burn-in | Remove legacy path after shadow and flagged runtime are stable. | Reduces duplication. | Only safe after long stability window and RF migration readiness. | Weak once legacy removed. | Later cleanup only. |

Recommended sequence:

1. Strategy B: dual-path shadow compare.
2. Strategy C: default-off, feature-flagged runtime adoption.
3. Strategy D: full adoption only after stability and explicit approval.

## 5. Rollback Gates

Rollback gates are policy definitions for a future implementation slice. No runtime metrics or observability are added here.

| Gate | Trigger | Severity | Required action |
| --- | --- | --- | --- |
| Unexpected role divergence | Any helper-vs-legacy platform role mismatch not classified as intentional. | Critical | Disable runtime flag or block rollout. |
| Malformed scalar blocker | Unknown scalar fixtures still diverge without approved Option A policy. | Critical | Keep runtime flag off. |
| Claim-impacting mismatch | Helper would grant or remove VIP capability where paid claim behavior could be affected. | Critical | Keep claim behavior unchanged; block runtime adoption. |
| Helper failure | Helper throws, returns malformed output, or cannot normalize payload deterministically. | Critical | Fallback to legacy and disable shadow/runtime flag. |
| JWT shape drift | Minted `X-Gateway-Auth` role/roles shape changes unexpectedly. | Critical | Roll back to legacy extraction. |
| Unknown token spike | Shadow evidence shows material increase in `unknown` role token classes. | High | Pause rollout and inspect payload sources. |
| Import-boundary violation | `identity-core` appears in runtime before approved migration slice. | High | Revert import or move change behind explicit migration plan. |
| Gateway/RF parity drift | RF projection no longer matches gateway-resolved expectations. | High | Block RF migration and review gateway output. |
| Capability placeholder consumed | `capabilities[]` begins influencing runtime platform role. | High | Roll back; capability semantics require separate policy slice. |

Suggested initial thresholds:

| Metric | Shadow phase threshold | Runtime phase threshold |
| --- | ---: | ---: |
| Unexpected divergence rate | `0` tolerated for fixture suite; production threshold must be explicitly approved. | `0` for auth-critical role changes. |
| Helper crash rate | `0` in tests; production shadow must fail closed to legacy. | Immediate rollback. |
| Claim-impacting mismatch | `0` | Immediate rollback. |
| Unknown scalar policy mismatch | Allowed only as documented blocker. | Not allowed until policy approved. |

## 6. Feature Flag Strategy

Future migration flags should be gateway-scoped and default-off:

| Flag | Default | Purpose | Rollback behavior |
| --- | --- | --- | --- |
| `GATEWAY_ENABLE_IDENTITY_CORE_SHADOW_COMPARE` | `false` | Compute helper result beside legacy result; legacy remains authoritative. | Disable to stop helper evaluation. |
| `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE` | `false` | Emit safe summarized mismatch evidence when shadow compare is enabled. | Disable to stop evidence output without changing auth. |
| `GATEWAY_ENABLE_IDENTITY_CORE_RUNTIME` | `false` | Allow helper result to become authoritative after gates pass. | Disable to return to legacy extraction immediately. |
| `GATEWAY_ENABLE_IDENTITY_CORE_STRICT_SCALAR_FALLBACK` | `false` | Explicitly opt into Option A scalar fallback policy once approved. | Disable to preserve legacy scalar behavior. |

Rules:

- Runtime flag must never be enabled unless shadow compare evidence is stable.
- Shadow compare must be safe independently of runtime adoption.
- Evidence output must stay PII-free and JWT-free.
- Runtime adoption must be impossible without a hard-disable path.
- Claim behavior must remain outside these flags.

## 7. Dual-path Evaluation Model

Future shadow evaluation should use this model:

1. Parse and verify the Clerk payload as gateway does today.
2. Compute legacy gateway extraction.
3. Compute `identity-core` helper extraction on the same raw payload.
4. Compare platform role, source, defaulted state, capabilities, and evidence alignment.
5. Classify divergence.
6. Mint internal JWT from legacy output unless runtime flag is explicitly enabled.
7. Surface only safe aggregate evidence.

| Classification | Meaning | Runtime effect |
| --- | --- | --- |
| `aligned` | Legacy and helper agree for role-relevant fields. | No rollout blocker. |
| `intentionally_different` | Known divergence that is documented and accepted for compare-only evidence. | Blocks runtime if behavior-changing. |
| `migration_blocker` | Known divergence that must be resolved or explicitly approved before cutover. | Runtime flag must remain off. |
| `unexpected_divergence` | New or unexplained mismatch. | Rollback or rollout halt. |

Current known migration blockers:

| Fixture | Legacy gateway | Helper policy | Classification |
| --- | --- | --- | --- |
| `unknown-role-falls-through-go2-role` | `spacer` | `vip_spacer` from `go2_role` | `migration_blocker` |
| `unknown-role-falls-through-public-metadata-role` | `spacer` | `pro` from `public_metadata.role` | `migration_blocker` |

## 8. Migration Safety Checklist

Before Strategy B shadow compare:

- `identity-core` package tests are green.
- Gateway compare-only tests are green.
- RF compare-only tests are green.
- Runtime import boundary is intentionally updated only in the implementation slice.
- Evidence payload design is PII-free and JWT-free.
- Unknown scalar blockers are documented.

Before Strategy C runtime adoption:

- Option A scalar fallback policy is approved or fixture expectations are deliberately changed.
- Shadow compare is stable for an agreed window.
- `unexpected_divergence` is zero in fixture tests.
- Claim-impacting mismatches are zero.
- Helper failure fallback to legacy is tested.
- Runtime flag is default-off and hard-disable works.
- Minted `X-Gateway-Auth` role/roles shape is unchanged except for approved cases.
- RF projection remains stable against gateway-resolved output.
- Production rollout owner and rollback owner are named.

Before RF runtime migration:

- Gateway runtime behavior is settled.
- RF compare-only projection is updated to the settled gateway behavior.
- RF auth migration has its own rollback plan.
- Paid claim semantics remain unchanged unless a separate claim policy slice approves convergence.

## 9. Runtime Boundary Preservation

Current boundary:

- gateway runtime does not import `@go2asia/identity-core`;
- RF runtime does not import `@go2asia/identity-core`;
- PWA runtime does not import `@go2asia/identity-core`;
- compare-only tests import the helper package.

This slice preserves that boundary. A future Strategy B implementation may intentionally introduce a gateway runtime import, but only with:

- explicit dependency promotion review;
- Worker bundle-size and cold-start review;
- import guard update;
- rollback flag;
- no change to RF/PWA/claim runtime.

## 10. Known Blockers

| Blocker | Source | Impact | Required decision |
| --- | --- | --- | --- |
| Unknown scalar fallback | Slice 6.25 fixtures | Gateway helper adoption would change role output for malformed scalar payloads. | Approve Option A, reject Option A, or preserve permanent divergence. |
| Preview-vs-claim alias divergence | `conflict-role-spacer-roles-vip` | Helper capability and preview can see VIP alias where paid claim rejects. | Defer to claim policy slice. |
| Capability placeholder | `future-capability-placeholder` | `capabilities[]` must not become runtime entitlement input accidentally. | Keep metadata-only until capability policy exists. |
| Runtime dependency boundary | Current import guard | Gateway runtime import is currently prohibited. | Separate implementation slice must update boundary deliberately. |
| Observability not implemented | This planning slice | Rollback gates have no live signal yet. | Strategy B implementation must add safe evidence plumbing. |

## 11. Risks

| Risk | Mitigation |
| --- | --- |
| Full switch skips evidence phase | Require Strategy B before Strategy C. |
| Option A changes real users with malformed `role` claims | Treat unknown scalar fixtures as migration blockers. |
| Helper capability is mistaken for claim authorization | Keep claim gate out of gateway migration flags. |
| Runtime import silently expands beyond gateway | Keep import guard and update it only in migration slice. |
| Evidence leaks identity material | Evidence must use safe buckets and never include raw JWT/PII. |
| RF migration starts before gateway settles | Make RF runtime migration a later slice. |
| Old roadmap numbering causes review confusion | Treat current canonical sequence as 6.25 policy blocker, 6.26 gateway migration plan, later RF migration. |

## 12. Future Migration Path

Recommended next slices:

1. Gateway shadow-compare implementation plan: dependency promotion, safe evidence schema, flag wiring, and tests.
2. Gateway shadow-compare implementation behind default-off flags, with legacy output authoritative.
3. Option A approval or rejection decision based on compare-only and shadow evidence.
4. Feature-flagged gateway runtime adoption if blockers are resolved.
5. RF auth runtime migration plan only after gateway output is settled.
6. Claim convergence remains separate and later.

