# RF Slice 6.20 - Gateway/RF Compare-only Tests Against identity-core Golden Fixtures v1

## 1. Purpose

Slice 6.20 adds compare-only test coverage that replays current gateway and RF role semantics against `@go2asia/identity-core` golden fixtures.

This is migration readiness evidence only. The slice does not migrate runtime code, does not make `identity-core` a runtime source of truth, and does not change claim, preview, badge, DTO, or adapter behavior.

The goal is to prove that the newly created package-level fixture assets from Slice 6.19 can be used by current services in tests without changing request behavior.

## 2. Non-goals

Not included:
- gateway runtime import from `@go2asia/identity-core`;
- RF runtime import from `@go2asia/identity-core`;
- PWA runtime import from `@go2asia/identity-core`;
- claim/redeem runtime changes;
- paid VIP gate changes;
- Role/VIP preview adapter migration;
- DB migrations;
- SDK/OpenAPI edits;
- Wallet/NFT/G2A integration;
- new UI features;
- observability changes;
- backend reconciliation implementation.

Not changed:
- current preview behavior;
- current claim behavior;
- current feature flags;
- current DTOs;
- current preview states;
- current badge states;
- current Role/VIP adapter runtime;
- current evidence helper runtime.

## 3. Compare-only Boundary

Allowed imports:
- `@go2asia/identity-core` in gateway tests;
- `@go2asia/identity-core` in RF tests.

Disallowed imports:
- gateway runtime;
- RF runtime;
- PWA runtime;
- claim/redeem runtime;
- preview adapter runtime.

`@go2asia/identity-core` was added as a `devDependency` for `apps/api-gateway` and `apps/rf-service` only so Vitest can import golden fixtures. No app runtime dependency was added.

## 4. Gateway Comparison Coverage

Gateway comparison tests live in:

```text
apps/api-gateway/test/identity-core-golden-fixtures.test.ts
```

The test uses the existing worker request flow:

1. mock Clerk `verifyToken`;
2. provide each `identityGoldenFixtures[].rawInputPayload` as a decoded identity-like payload;
3. call a protected gateway route;
4. observe the minted `X-Gateway-Auth` internal JWT;
5. compare the current gateway `role` and fallback `roles[]` behavior against fixture expectations.

This avoids exporting private gateway helpers such as role extraction and avoids importing `identity-core` into gateway runtime.

Covered behavior:
- top-level role aliases;
- canonical `vip_spacer`;
- `role` vs `roles[]` conflict behavior;
- `go2_role` and metadata precedence through gateway extraction;
- roles array order sensitivity;
- malformed scalar role fallback to roles array;
- missing role defaulting to `spacer`;
- future capability placeholder classification.

## 5. RF Comparison Coverage

RF comparison tests live in:

```text
apps/rf-service/test/identity-core-golden-fixtures.test.ts
```

The RF test suite has two compare-only layers:

1. evidence helper parity through `createRoleNormalizationEvidenceSnapshot`;
2. a test-local projection of current internal gateway JWT semantics using only `role` and `roles[]`.

The test-local projection intentionally mirrors current RF auth and paid claim behavior without exporting private runtime helpers.

Covered behavior:
- RF platform role derivation from gateway-resolved `role`;
- fallback to first recognized `roles[]` value;
- exact `vip_spacer` paid claim allowance in raw `roles[]`;
- VIP alias in `roles[]` as preview-only, claim-rejected divergence;
- metadata precedence after gateway resolution;
- order-sensitive arrays;
- missing role default.

## 6. Evidence Helper Parity

The RF evidence helper is compared to every `identityGoldenFixture`.

Checks include:
- `schemaVersion: 1`;
- no raw JWT exposure;
- no PII exposure;
- gateway platform role;
- gateway role source;
- current claim VIP behavior;
- current preview VIP behavior;
- preview state;
- evidence divergence alignment;
- role/roles conflict flag;
- VIP alias-only flag;
- roles order-sensitive flag.

This confirms that package fixtures and RF evidence snapshots do not drift for the Slice 6.19 initial fixture set.

## 7. Mismatch Classification

Test-level classification values:

### `aligned`

Current behavior matches fixture expected current behavior.

### `intentionally_different`

Fixture expresses future or metadata-only semantics not consumed by a runtime surface yet.

Current gateway compare-only tests classify the `future-capability-placeholder` fixture as intentionally different because `capabilities[]` remains metadata-only and is not consumed by gateway runtime.

### `unexpected_divergence`

Current behavior differs from fixture expected current behavior without documentation.

Tests fail on any `unexpected_divergence`.

## 8. Runtime Import Guard

The RF compare-only suite includes a lightweight import guard that scans selected runtime entrypoints and asserts they do not contain `@go2asia/identity-core`.

Guarded files:
- `apps/api-gateway/src/index.ts`;
- `apps/rf-service/src/index.ts`;
- `apps/rf-service/src/middleware/auth.ts`;
- `apps/rf-service/src/store.ts`;
- `apps/go2asia-pwa-shell/middleware.ts`.

This is intentionally lightweight. It is not a full dependency-boundary system, but it protects the specific surfaces involved in the current migration path.

## 9. Results / Known Divergences

Expected results:
- identity-core fixtures validate before gateway/RF replay;
- gateway extraction aligns with all current role fixtures;
- gateway classifies `future-capability-placeholder` as intentionally different/out-of-runtime;
- RF evidence helper aligns with all initial fixtures;
- RF current internal JWT projection aligns with gateway-resolved fixture expectations;
- runtime import guard passes.

Known divergence:
- `conflict-role-spacer-roles-vip` remains `preview_grants_claim_rejects`.

This is not a failure. It documents current behavior where preview normalizes `VIP` in `roles[]`, while paid claim behavior still requires either platform role `vip_spacer` or exact raw `vip_spacer` in `roles[]`.

## 10. What Remains Experimental

Still experimental:
- implementation of pure normalization functions in `identity-core`;
- compare-only evidence collection outside tests;
- gateway runtime migration sequencing;
- RF auth runtime migration sequencing;
- PWA adoption strategy;
- capability source semantics beyond `vip_spacer`;
- claim convergence.

No experimental item authorizes runtime adoption in this slice.

## 11. Risks

### Test-local Mirrors

RF auth helpers are private. The RF compare test uses a test-local projection to avoid runtime exports. This must remain a comparison aid, not a second implementation source.

### Capabilities Misread as Runtime Support

The capability placeholder fixture exists to prevent accidental grants. It does not mean gateway or RF runtime supports `capabilities[]`.

### Runtime Import Drift

The import guard is narrow. Future runtime files may need to be added as migration scope expands.

### Fixture Contract Drift

If fixtures change without updating compare tests and docs, migration evidence can become misleading.

## 12. Future Migration Path

Recommended next path:

1. RF Slice 6.21: add compare-only report generation or evidence snapshot summaries for gateway/RF fixture replay, still no runtime adoption.
2. RF Slice 6.22: implement pure normalization helpers in `identity-core` behind package-level tests.
3. RF Slice 6.23: compare current gateway extraction vs implemented helper outputs.
4. RF Slice 6.24: evaluate gateway runtime migration behind explicit rollback plan.
5. RF Slice 6.25: evaluate RF auth normalization migration after gateway evidence is clean.
6. Later dedicated slice: evaluate Role/VIP preview adapter alignment.
7. Later dedicated claim slice: evaluate paid claim convergence only with claim owner approval and rollback plan.

