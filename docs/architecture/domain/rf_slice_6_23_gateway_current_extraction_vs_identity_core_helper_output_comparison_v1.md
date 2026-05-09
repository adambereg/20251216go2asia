# RF Slice 6.23 - Gateway Current Extraction vs identity-core Helper Output Comparison v1

## 1. Purpose

Slice 6.23 compares current API Gateway role extraction behavior with implemented `@go2asia/identity-core` helper outputs.

This is compare-only migration evidence. It does not migrate gateway runtime, does not import `identity-core` into gateway runtime, and does not change app behavior.

The comparison proves whether current gateway extraction, package helper output, and golden fixture expectations agree for the initial identity fixture set.

## 2. Non-goals

Not included:
- gateway runtime import from `@go2asia/identity-core`;
- RF runtime import;
- PWA runtime import;
- gateway extraction replacement;
- claim/redeem runtime changes;
- paid VIP gate changes;
- preview adapter migration;
- app-level behavior changes;
- DB migrations;
- SDK/OpenAPI edits;
- Wallet/NFT/G2A integration;
- UI features;
- runtime observability changes;
- backend reconciliation implementation.

Not changed:
- current gateway behavior;
- current RF behavior;
- current claim behavior;
- current preview behavior;
- current DTOs;
- current flags;
- current fixture semantics.

## 3. Compare-only Parity Model

The Slice 6.23 comparison model checks three independent views:

1. current gateway extraction result observed through minted `X-Gateway-Auth`;
2. `identity-core` helper output for the same fixture input;
3. `identityGoldenFixtures[].expected` platform role and evidence fields.

Compared dimensions:
- canonical platform role;
- helper source precedence;
- helper defaulted behavior;
- helper capability extraction;
- helper evidence classification;
- metadata safety;
- deterministic summary ordering.

Gateway runtime remains the source of actual current behavior. Helper mismatches are migration findings, not automatic migration triggers.

## 4. Gateway Replay Coverage

Gateway replay test:

```text
apps/api-gateway/test/identity-core-golden-fixtures.test.ts
```

Replay flow:

1. mock Clerk `verifyToken`;
2. feed each `identityGoldenFixtures[].rawInputPayload` as decoded identity-like payload;
3. call protected gateway route `/v1/points/balance`;
4. decode minted `X-Gateway-Auth`;
5. compare gateway `role` with helper and fixture outputs.

Private gateway extraction helpers are not exported.

## 5. Helper Comparison Coverage

Helper calls used in compare-only tests:
- `extractPlatformRole(rawInputPayload)`;
- `extractRoleCapabilities(rawInputPayload)`;
- `classifyRoleEvidence(rawInputPayload)`.

Helper parity assertions cover:
- gateway role equals helper platform role;
- helper platform role equals fixture expected role;
- helper source equals fixture expected source;
- helper defaulted flag equals fixture expectation;
- helper capabilities equal fixture expectation;
- helper evidence alignment equals fixture expected divergence class.

## 6. Capability Comparison

Current gateway runtime does not consume `capabilities[]`.

For `future-capability-placeholder`:
- gateway platform role remains `spacer`;
- helper platform role remains `spacer`;
- helper capability extraction returns no capability;
- the fixture remains a documented metadata-only placeholder.

This confirms gateway remains intentionally unaware of capability payloads while helper semantics stay conservative.

## 7. Known Divergences

Gateway/helper parity status counts:

| Status | Count |
| --- | ---: |
| `aligned` | 11 |
| `intentionally_different` | 0 |
| `unexpected_divergence` | 0 |

Documented non-blocking findings:

| Fixture ID | Finding | Interpretation |
| --- | --- | --- |
| `future-capability-placeholder` | capability payload is metadata-only | Gateway does not consume `capabilities[]`; helper also does not grant VIP from it. |
| `conflict-role-spacer-roles-vip` | evidence alignment is `preview_grants_claim_rejects` | This is preview-vs-claim behavior, not a gateway/helper platform-role mismatch. |

Latent nuance from audit:

| Scenario | Current Gateway Behavior | Helper Behavior | Status |
| --- | --- | --- | --- |
| unknown scalar `role` plus valid `go2_role` without rescuing `roles[]` | gateway's current `??` scalar chain may not retry later scalar sources after a non-empty unknown `role` | helper tries scalar sources sequentially until a canonical token is found | not covered by current golden fixtures; requires explicit future fixture/policy decision |

This nuance does not affect the current initial golden fixture set.

## 8. Runtime Import Boundary

Runtime boundary remains unchanged:
- gateway runtime does not import `@go2asia/identity-core`;
- RF runtime does not import `@go2asia/identity-core`;
- PWA middleware does not import `@go2asia/identity-core`;
- compare-only imports remain in tests.

The runtime import guard continues to live in:

```text
apps/rf-service/test/identity-core-golden-fixtures.test.ts
```

## 9. Migration Readiness Interpretation

Repository compare-only evidence indicates:
- current gateway platform-role extraction aligns with helper output for all 11 initial fixtures;
- helper capability extraction remains conservative;
- helper evidence alignment remains consistent with fixture expectations;
- no unexpected gateway/helper divergences were found;
- runtime import boundary remains intact.

Migration readiness checklist:

| Check | Status |
| --- | --- |
| Golden fixtures validate | pass |
| Gateway replay succeeds | pass |
| Helper platform role matches fixture expected role | pass |
| Gateway platform role matches helper platform role | pass |
| Helper capabilities match fixture expectations | pass |
| Helper evidence alignment matches fixture expectations | pass |
| Unexpected divergences | none |
| Runtime import boundary | pass |
| Runtime migration approval | not requested |

## 10. What Remains Experimental

Still experimental:
- helper-output comparison for RF auth surfaces;
- policy decision for unknown scalar `role` plus valid later scalar source;
- generated machine-readable parity reports;
- gateway runtime migration;
- RF runtime migration;
- PWA adoption strategy;
- claim convergence.

## 11. Risks

### Premature Runtime Import

The helpers are implemented and parity is green for initial fixtures, but gateway runtime must not import `identity-core` until a migration slice with rollback criteria is approved.

### Fixture Coverage Gap

Initial fixtures do not cover every malformed scalar precedence scenario. The audit identified one latent nuance around unknown scalar `role` and later valid scalar sources.

### Capability Misinterpretation

`future-capability-placeholder` is a guardrail, not support for runtime capability payloads.

### Narrow Import Guard

The import guard scans selected runtime entrypoints. It should be expanded if gateway/RF runtime surface area changes.

## 12. Future Migration Path

Recommended next path:

1. RF Slice 6.24: compare RF auth/evidence outputs against implemented `identity-core` helper outputs, still no runtime adoption.
2. RF Slice 6.25: add explicit fixture/policy decision for malformed scalar source fallback if needed.
3. RF Slice 6.26: evaluate gateway runtime migration behind rollback plan.
4. RF Slice 6.27: evaluate RF auth runtime migration after gateway evidence is clean.
5. Later dedicated slice: evaluate Role/VIP preview adapter alignment.
6. Later dedicated claim slice: evaluate paid claim convergence only with claim owner approval and rollback plan.

