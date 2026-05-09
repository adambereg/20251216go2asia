# RF Slice 6.25 - Malformed / Unknown Scalar Source Fixture & Policy Coverage

## 1. Purpose

RF Slice 6.25 hardens the identity normalization evidence layer around malformed and unknown scalar role sources.

This slice adds explicit golden fixture coverage for a latent migration nuance:

- current gateway runtime stops at the first present scalar string and normalizes only that value;
- `identity-core` helper policy searches scalar sources until it finds a canonical role;
- RF runtime receives gateway-resolved internal JWT claims, so RF projection follows gateway output, not raw identity payload semantics.

The result is compare-only policy evidence. No runtime behavior changes are introduced.

## 2. Non-goals

This slice does not:

- migrate gateway extraction to `@go2asia/identity-core`;
- import `@go2asia/identity-core` from gateway, RF, or PWA runtime;
- replace RF auth normalization;
- change paid claim VIP behavior;
- change redeem, preview, DTO, flag, SDK, OpenAPI, DB, UI, Wallet, NFT, G2A, or reconciliation behavior.

Allowed changes are limited to golden fixtures, package tests, compare-only gateway/RF tests, and static documentation.

## 3. Edge Case Problem Statement

Before this slice, schema v1 fixtures covered:

- missing role payloads;
- non-string `role` falling through to `roles[]`;
- source precedence when the first present scalar is canonical.

They did not cover unknown string scalar fallback:

```json
{
  "role": "unknown_role",
  "go2_role": "vip_spacer"
}
```

This matters because an unknown string role is present, but not canonical. The policy question is whether it should block later scalar sources.

## 4. Current Gateway Behavior

Gateway runtime currently uses a scalar `??` chain before normalization:

1. `role`
2. `go2_role`
3. `public_metadata.role`
4. `publicMetadata.role`

The first present string is selected and normalized once. If that string is unknown, later scalar sources are not considered. With no rescuing `roles[]`, gateway defaults to `spacer`.

| Payload shape | Current gateway role | Gateway classification |
| --- | --- | --- |
| `role: unknown_role`, `go2_role: vip_spacer` | `spacer` | Documented current-runtime divergence |
| `role: unknown_role`, `public_metadata.role: pro` | `spacer` | Documented current-runtime divergence |

Gateway runtime remains unchanged.

## 5. identity-core Helper Policy

Slice 6.25 keeps Option A as the schema v1 helper policy:

- scalar sources are checked in precedence order;
- a malformed or unknown scalar token does not block later scalar sources;
- the first canonical scalar source wins;
- if no scalar source is canonical, `roles[]` can still provide a canonical role;
- if no canonical source exists, the payload defaults to `spacer`.

Option B, where the first present scalar string wins even if unknown, was not adopted because it is less explicit and would preserve a brittle runtime nuance as canonical policy.

## 6. New Fixture Coverage

| Fixture ID | Raw payload shape | Expected helper platform role | Source | Capabilities |
| --- | --- | --- | --- | --- |
| `unknown-role-falls-through-go2-role` | `role: unknown_role`, `go2_role: vip_spacer` | `vip_spacer` | `go2_role` | `vip_spacer` |
| `unknown-role-falls-through-public-metadata-role` | `role: unknown_role`, `public_metadata.role: pro` | `pro` | `public_metadata.role` | none |

Both fixtures are in the existing `malformed_payload` group and are ordered deterministically with the rest of `identityGoldenFixtures`.

## 7. Gateway Compare-only Result

Gateway compare-only tests now distinguish current runtime behavior from helper policy.

| Surface | aligned | intentionally_different | unexpected_divergence |
| --- | ---: | ---: | ---: |
| Gateway fixture replay | 10 | 3 | 0 |
| Gateway helper parity | 11 | 2 | 0 |

Fixture-level gateway/helper findings:

| Fixture ID | Gateway role | Helper role | Status | Interpretation |
| --- | --- | --- | --- | --- |
| `unknown-role-falls-through-go2-role` | `spacer` | `vip_spacer` | `intentionally_different` | Migration blocker until scalar fallback policy is accepted or gateway runtime is changed. |
| `unknown-role-falls-through-public-metadata-role` | `spacer` | `pro` | `intentionally_different` | Migration blocker until scalar fallback policy is accepted or gateway runtime is changed. |

The existing `future-capability-placeholder` remains documented as intentionally out of gateway runtime.

## 8. RF Compare-only Result

RF evidence helper follows the helper-style policy in diagnostic snapshots. RF internal JWT projection follows current gateway-resolved output for the new fixtures.

| Surface | aligned | intentionally_different | unexpected_divergence |
| --- | ---: | ---: | ---: |
| `rfEvidence` | 13 | 0 | 0 |
| `rfProjection` | 11 | 2 | 0 |
| `rfEvidenceHelperParity` | 13 | 0 | 0 |
| `rfProjectionHelperParity` | 11 | 2 | 0 |
| `claimVsCapability` | 11 | 2 | 0 |

Fixture-level RF findings:

| Fixture ID | RF evidence vs helper | RF projection vs helper | Claim vs capability | Interpretation |
| --- | --- | --- | --- | --- |
| `unknown-role-falls-through-go2-role` | aligned | intentionally different | intentionally different | Current gateway/RF projection defaults to `spacer`; helper grants VIP capability through `go2_role`. |
| `unknown-role-falls-through-public-metadata-role` | aligned | intentionally different | aligned | Current gateway/RF projection defaults to `spacer`; helper resolves `pro`. |

## 9. Policy Classification

The policy decision for Slice 6.25 is:

| Question | Decision |
| --- | --- |
| Should unknown scalar `role` block later scalar sources in `identity-core`? | No. |
| Should helper policy be changed to match current gateway runtime? | No. |
| Should gateway runtime be changed in this slice? | No. |
| How should mismatch be classified? | Documented current-runtime divergence and future migration blocker. |

This keeps the canonical helper policy explicit while preserving current production behavior.

## 10. Migration Blocker Interpretation

The new fixtures are not runtime failures. They are blockers for future runtime migration.

Before gateway runtime can safely adopt `identity-core` scalar extraction, one of these must be decided:

1. Accept Option A and migrate gateway runtime with a rollback plan.
2. Reject Option A and change helper/fixtures to gateway-like first-present-string semantics.
3. Preserve gateway behavior and keep this as a permanent documented divergence.

Until that decision is made, gateway runtime migration should not proceed.

## 11. Runtime Import Boundary

Runtime import guards remain compare-only and continue to assert no `@go2asia/identity-core` imports in selected gateway/RF/PWA runtime entrypoints:

| Runtime entrypoint | Boundary result |
| --- | --- |
| `apps/api-gateway/src/index.ts` | No runtime import |
| `apps/rf-service/src/index.ts` | No runtime import |
| `apps/rf-service/src/middleware/auth.ts` | No runtime import |
| `apps/rf-service/src/store.ts` | No runtime import |
| `apps/go2asia-pwa-shell/middleware.ts` | No runtime import |

The guard remains intentionally lightweight and does not replace dependency graph analysis.

## 12. What Remains Experimental

- `identity-core` helper outputs remain compare-only.
- RF evidence snapshots remain diagnostic, not runtime source of truth.
- Test-local gateway/RF projections remain migration evidence, not production logic.
- Claim VIP behavior remains stricter than helper capability semantics.
- Scalar fallback policy remains a migration decision point for future gateway adoption.

## 13. Risks

| Risk | Mitigation |
| --- | --- |
| Unknown scalar fallback gets treated as a harmless mismatch | Classified as a migration blocker in docs and compare-only notes. |
| Helper policy is mistaken for current gateway behavior | Tests preserve current gateway output as intentionally different. |
| RF projection is confused with raw identity payload parsing | RF projection explicitly follows gateway-resolved internal JWT semantics. |
| Future docs drift on slice numbering | This document treats 6.25 as scalar fixture-policy hardening; runtime migration remains later. |
| Import guard misses indirect imports | Boundary documented as lightweight and selected-entrypoint based. |

## 14. Future Migration Path

Recommended next sequence:

1. Decide whether Option A scalar fallback policy is accepted as canonical runtime policy.
2. If accepted, prepare gateway runtime migration plan with rollback and compare-only evidence gates.
3. Evaluate RF runtime migration only after gateway behavior is settled.
4. Keep claim convergence separate from role scalar extraction.
5. Preserve golden fixtures as migration blockers until runtime behavior intentionally converges.

