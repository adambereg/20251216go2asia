# RF Slice 6.24 - RF Auth / Evidence vs identity-core Helper Output Comparison

## 1. Purpose

RF Slice 6.24 adds compare-only migration evidence between current RF identity behavior and the implemented pure helpers in `@go2asia/identity-core`.

The slice compares:

- current RF evidence snapshots;
- current RF internal JWT projection semantics;
- current RF paid claim VIP projection;
- `identity-core` helper outputs;
- `identityGoldenFixtures` expected outputs.

This is a migration-readiness evidence slice. It does not adopt `identity-core` in RF runtime and does not change claim, redeem, preview, gateway, PWA, DTO, flag, database, SDK, or OpenAPI behavior.

## 2. Non-goals

This slice does not:

- import `@go2asia/identity-core` from RF runtime;
- replace RF auth normalization;
- replace `isVipSpacerPrincipal`;
- change paid claim or redeem behavior;
- migrate the preview adapter to `identity-core`;
- add runtime observability;
- add DB migrations;
- integrate Wallet, NFT, G2A, or reconciliation systems;
- change gateway, RF, PWA, DTO, flag, or fixture semantics.

Allowed usage remains test-only imports and static documentation.

## 3. RF Compare-only Parity Model

The parity model is implemented in `apps/rf-service/test/identity-core-golden-fixtures.test.ts`.

| Surface | Current RF input | Helper input | Purpose |
| --- | --- | --- | --- |
| `rfEvidence` | `createRoleNormalizationEvidenceSnapshot(rawInputPayload)` | Fixture expectations | Keep existing evidence helper aligned with golden fixtures. |
| `rfEvidenceHelperParity` | RF evidence snapshot | `normalizeRolePayload(rawInputPayload)` | Compare evidence gateway role, claim VIP, preview VIP, divergence alignment, and metadata safety. |
| `rfProjection` | Test-local RF internal JWT projection from gateway-resolved fixture output | Fixture expectations | Ensure RF principal projection still matches current gateway-resolved expectations. |
| `rfProjectionHelperParity` | RF projection | `normalizeRolePayload(rawInputPayload)` | Compare RF projection with helper output where gateway has already resolved scalar/metadata precedence. |
| `claimVsCapability` | Current paid claim VIP model | `isVipCapability(rawInputPayload)` | Document that helper VIP capability is not a paid claim gate substitute. |

The helper is treated as a semantic comparison engine only. Mismatches are migration findings, not automatic runtime adoption triggers.

## 4. RF Evidence vs Helper Comparison

For each fixture, the RF test runs:

- `createRoleNormalizationEvidenceSnapshot(rawInputPayload)`;
- `normalizeRolePayload(rawInputPayload)`;
- `isVipCapability(rawInputPayload)`.

The test compares:

- evidence gateway platform role vs helper platform role;
- evidence gateway role source vs helper source;
- evidence claim VIP vs fixture claim expectation;
- evidence preview VIP vs helper `vip_spacer` capability;
- evidence divergence alignment vs helper evidence alignment;
- helper metadata safety (`containsRawJwt: false`, `containsPii: false`).

Current result:

| Surface | aligned | intentionally_different | unexpected_divergence |
| --- | ---: | ---: | ---: |
| `rfEvidence` | 11 | 0 | 0 |
| `rfEvidenceHelperParity` | 11 | 0 | 0 |

## 5. RF Internal JWT Projection vs Helper Comparison

RF auth does not parse raw Clerk-style identity payloads directly. It receives an internal gateway JWT shape with:

- `role`;
- `roles[]`.

The compare-only projection therefore uses gateway-resolved fixture expectations as the bridge into RF semantics. This keeps the test aligned with current architecture: gateway resolves scalar and metadata precedence, RF consumes the internal principal.

Current result:

| Surface | aligned | intentionally_different | unexpected_divergence |
| --- | ---: | ---: | ---: |
| `rfProjection` | 11 | 0 | 0 |
| `rfProjectionHelperParity` | 11 | 0 | 0 |

Important interpretation:

- `go2_role`, `public_metadata.role`, and `publicMetadata.role` are helper/gateway concerns before the RF internal JWT boundary;
- `capabilities[]` is not parsed by RF runtime;
- this is not a bug as long as gateway has already resolved the principal before forwarding to RF.

## 6. Claim VIP vs Helper Capability Comparison

Current RF paid claim behavior allows VIP only when:

- `platformRole === 'vip_spacer'`; or
- raw `roles[]` contains exact `vip_spacer` after trim/lowercase.

Helper VIP capability is broader for preview semantics because it recognizes normalized VIP aliases in `roles[]`.

Current result:

| Surface | aligned | intentionally_different | unexpected_divergence |
| --- | ---: | ---: | ---: |
| `claimVsCapability` | 10 | 1 | 0 |

This explicitly proves that `isVipCapability` is not a substitute for current paid claim behavior.

## 7. Known Divergences

| Fixture | Surface | Status | Reason |
| --- | --- | --- | --- |
| `conflict-role-spacer-roles-vip` | claim vs helper capability | `intentionally_different` | Preview/helper recognizes VIP alias in `roles[]`; current paid claim behavior does not allow VIP without platform `vip_spacer` or exact `roles[]` token `vip_spacer`. |
| `future-capability-placeholder` | gateway summary context | `intentionally_different` | `capabilities[]` remains a metadata placeholder and is not consumed by gateway or RF runtime. |

No unexpected divergences were added by Slice 6.24.

## 8. Runtime Import Boundary

The runtime import guard remains in `apps/rf-service/test/identity-core-golden-fixtures.test.ts`.

Guarded runtime entrypoints:

| Runtime entrypoint | Expected result |
| --- | --- |
| `apps/api-gateway/src/index.ts` | No `@go2asia/identity-core` import |
| `apps/rf-service/src/index.ts` | No `@go2asia/identity-core` import |
| `apps/rf-service/src/middleware/auth.ts` | No `@go2asia/identity-core` import |
| `apps/rf-service/src/store.ts` | No `@go2asia/identity-core` import |
| `apps/go2asia-pwa-shell/middleware.ts` | No `@go2asia/identity-core` import |

The guard is intentionally lightweight. It protects known runtime entrypoints and selected critical RF/gateway/PWA files; it is not a full dependency graph analyzer.

## 9. Migration Readiness Interpretation

| Check | Result | Interpretation |
| --- | --- | --- |
| RF evidence aligns with fixtures | Pass | Existing diagnostic helper remains stable against schema v1 fixtures. |
| RF evidence aligns with helper output | Pass | Helper output is semantically compatible for diagnostic comparison. |
| RF internal JWT projection aligns | Pass | RF projection matches gateway-resolved fixture expectations. |
| Claim behavior vs helper capability documented | Pass | Known preview-vs-claim asymmetry remains explicit. |
| Runtime imports blocked | Pass | `identity-core` remains test-only for RF/gateway/PWA runtime boundaries. |
| Unexpected divergences | 0 | No new migration blockers found in this fixture set. |

Readiness is evidence-only. It does not authorize runtime migration.

## 10. What Remains Experimental

- `roleNormalizationEvidence.ts` remains a diagnostic helper, not a runtime source of truth.
- Test-local RF projection remains compare-only evidence, not production auth logic.
- `identity-core` helpers remain isolated from RF runtime.
- Capability semantics remain preview/informational and are not a claim gate.
- `capabilities[]` remains a future placeholder input, not an entitlement source.

## 11. Risks

| Risk | Mitigation in this slice |
| --- | --- |
| Test-local projection drifting from RF auth | Keep projection narrow and compare-only; continue guarding runtime files. |
| Helper VIP capability mistaken for paid claim authorization | Add explicit claim-vs-capability test and documented divergence. |
| Import guard misses indirect runtime imports | Keep guard as lightweight protection and document its limits. |
| Fixture coverage gaps hide future scalar/array edge cases | Treat this slice as schema v1 evidence, not complete identity migration proof. |
| Review confusion from older future-slice numbering | Treat 6.24 as RF helper parity; later runtime migration remains separate. |

## 12. Future Migration Path

Recommended next slice:

1. Add malformed/unknown scalar fixture-policy coverage for helper, gateway, and RF compare-only tests.
2. Expand import-boundary coverage only if new runtime entrypoints become relevant.
3. Prepare a separate gateway runtime migration plan after compare-only parity remains stable.
4. Prepare a later RF runtime migration plan only after gateway behavior and rollback strategy are settled.
5. Keep paid claim semantics unchanged until product policy explicitly resolves preview-vs-claim alias divergence.

