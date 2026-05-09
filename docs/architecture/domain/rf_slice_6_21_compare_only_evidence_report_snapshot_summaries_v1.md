# RF Slice 6.21 - Compare-only Evidence Report / Snapshot Summaries v1

## 1. Purpose

Slice 6.21 turns the Slice 6.20 gateway/RF compare-only replay into a deterministic repository evidence artifact.

This is not live staging evidence. It is fixture-driven repository evidence produced from:
- `packages/identity-core` golden fixtures;
- gateway compare-only test replay;
- RF evidence helper parity;
- RF internal gateway-token projection tests;
- runtime import boundary checks.

The purpose is to make migration readiness reviewable without changing runtime behavior.

## 2. Non-goals

Not included:
- gateway runtime import from `@go2asia/identity-core`;
- RF runtime import from `@go2asia/identity-core`;
- PWA runtime import from `@go2asia/identity-core`;
- claim/redeem runtime changes;
- paid VIP gate changes;
- Role/VIP preview adapter migration;
- `identity-core` runtime normalization implementation;
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

## 3. Evidence Summary Schema

Slice 6.21 uses a test-only evidence summary shape. It is not exported from `identity-core` and is not a runtime API.

Schema:

```ts
type CompareOnlyEvidenceSummary = {
  schemaVersion: 1;
  generatedBy: 'rf-slice-6.21-compare-only-tests';
  fixtureVersion: 1;
  fixtureCount: number;
  comparedSurfaces: ['gateway', 'rf_evidence', 'rf_internal_jwt_projection'];
  counts: {
    gateway: SurfaceCounts;
    rfEvidence: SurfaceCounts;
    rfProjection: SurfaceCounts;
  };
  fixtureSummaries: Array<{
    fixtureId: string;
    group: string;
    gatewayStatus: 'aligned' | 'intentionally_different' | 'unexpected_divergence';
    rfEvidenceStatus: 'aligned' | 'intentionally_different' | 'unexpected_divergence';
    rfProjectionStatus: 'aligned' | 'intentionally_different' | 'unexpected_divergence';
    divergenceClass: string;
    notes: string[];
  }>;
  knownDivergences: Array<{
    fixtureId: string;
    divergenceClass: string;
    status: 'documented';
    note: string;
  }>;
  runtimeImportBoundary: {
    gatewayRuntimeImportsIdentityCore: false;
    rfRuntimeImportsIdentityCore: false;
    pwaRuntimeImportsIdentityCore: false;
    compareOnlyImportsLimitedToTests: true;
  };
};
```

No timestamp is included because this document is checked in and must remain deterministic.

## 4. Fixture Replay Coverage

Fixture source:

```text
packages/identity-core/src/fixtures.ts
```

Fixture count: 11.

Fixture counts by group:

| Group | Count |
| --- | ---: |
| `alias_case` | 2 |
| `canonical_happy_path` | 1 |
| `future_capability_combination` | 1 |
| `malformed_payload` | 1 |
| `metadata_precedence` | 1 |
| `missing_payload` | 1 |
| `order_sensitive_array` | 2 |
| `role_roles_conflict` | 2 |

All fixture IDs remain sorted and deterministic.

## 5. Gateway Summary

Gateway replay source:

```text
apps/api-gateway/test/identity-core-golden-fixtures.test.ts
```

Gateway coverage:
- fixture validation before replay;
- real worker request flow;
- mocked Clerk decoded identity payloads;
- minted `X-Gateway-Auth` observation;
- platform role expectation;
- fallback `roles[]` presence;
- mismatch classification.

Gateway status counts:

| Status | Count |
| --- | ---: |
| `aligned` | 10 |
| `intentionally_different` | 1 |
| `unexpected_divergence` | 0 |

The single intentional difference is `future-capability-placeholder`. The gateway runtime does not consume `capabilities[]`; the fixture remains metadata-only until a future migration slice approves capability extraction.

## 6. RF Summary

RF replay source:

```text
apps/rf-service/test/identity-core-golden-fixtures.test.ts
```

RF evidence coverage:
- fixture validation before replay;
- `createRoleNormalizationEvidenceSnapshot` parity;
- schema version check;
- no raw JWT / PII flags;
- gateway role/source parity;
- claim VIP behavior parity;
- preview VIP behavior parity;
- divergence class parity.

RF internal gateway-token projection coverage:
- gateway-resolved platform role;
- `role` / `roles[]` semantics currently read by RF auth;
- exact `vip_spacer` paid claim allowance in raw `roles[]`;
- preview-vs-claim divergence inventory.

RF status counts:

| Surface | `aligned` | `intentionally_different` | `unexpected_divergence` |
| --- | ---: | ---: | ---: |
| `rf_evidence` | 11 | 0 | 0 |
| `rf_internal_jwt_projection` | 11 | 0 | 0 |

## 7. Known Divergences

Known divergence inventory:

| Fixture ID | Divergence Class | Status | Interpretation |
| --- | --- | --- | --- |
| `conflict-role-spacer-roles-vip` | `preview_grants_claim_rejects` | documented | Preview recognizes `VIP` alias in `roles[]`; current paid claim behavior still requires platform role `vip_spacer` or exact raw `vip_spacer` in `roles[]`. |

Related non-error findings:

| Fixture ID | Finding | Interpretation |
| --- | --- | --- |
| `future-capability-placeholder` | gateway `intentionally_different` | `capabilities[]` remains metadata-only and out-of-runtime. |
| `metadata-go2-role-precedes-public-metadata` | RF projection note | RF receives gateway-resolved `role`; it does not parse raw Clerk `go2_role` or metadata. |
| `order-roles-admin-member`, `order-roles-member-admin` | order-sensitive | Current role arrays can produce different platform roles depending on order when no scalar role exists. |

The reserved `claim_allows_preview_requires_condition` divergence class remains present in schema constants but is not represented by the current initial golden fixture set.

## 8. Runtime Import Boundary

Runtime guard source:

```text
apps/rf-service/test/identity-core-golden-fixtures.test.ts
```

Guarded runtime files:
- `apps/api-gateway/src/index.ts`;
- `apps/rf-service/src/index.ts`;
- `apps/rf-service/src/middleware/auth.ts`;
- `apps/rf-service/src/store.ts`;
- `apps/go2asia-pwa-shell/middleware.ts`.

Result:

| Boundary | Status |
| --- | --- |
| Gateway runtime imports `@go2asia/identity-core` | no |
| RF runtime imports `@go2asia/identity-core` | no |
| PWA middleware imports `@go2asia/identity-core` | no |
| `identity-core` usage is limited to tests for this slice | yes |

The guard is intentionally lightweight and scoped to current migration surfaces.

## 9. Migration Readiness Interpretation

Repository compare-only evidence indicates:
- package fixtures are valid and stable;
- gateway replay has no unexpected divergences;
- RF evidence helper has no unexpected divergences;
- RF projection has no unexpected divergences;
- one gateway difference is intentionally out-of-runtime;
- one preview/claim divergence is documented and expected;
- runtime import boundary is still intact.

Readiness checklist:

| Check | Status |
| --- | --- |
| Golden fixtures validate | pass |
| Fixture summary count equals fixture count | pass |
| Fixture IDs are deterministic and sorted | pass |
| Gateway unexpected divergences | none |
| RF evidence unexpected divergences | none |
| RF projection unexpected divergences | none |
| Known divergences explicitly listed | pass |
| Runtime import guard | pass |
| Live staging evidence | not claimed |
| Runtime migration readiness | not yet approved |

## 10. What Remains Experimental

Still experimental:
- implementation of pure normalization helpers in `identity-core`;
- generated machine-readable report files;
- CI publication of compare-only summaries;
- gateway helper output comparison after helper implementation;
- RF auth helper output comparison after helper implementation;
- PWA adoption strategy;
- claim convergence;
- future capability source semantics.

## 11. Risks

### Static Report Drift

This document is static. If fixtures or tests change, this report must be updated in the same review.

### Test-only Projection Drift

RF projection logic is test-local. It should remain a compare aid and not become a new source of runtime semantics.

### Narrow Import Guard

The runtime import guard scans selected files. If migration scope expands, the guard list must expand.

### Capability Misinterpretation

The future capability fixture prevents accidental grants. It does not mean `capabilities[]` is supported in gateway/RF runtime.

## 12. Future Migration Path

Recommended next path:

1. RF Slice 6.22: implement pure normalization helpers in `identity-core` behind package-level tests, still no runtime consumers.
2. RF Slice 6.23: compare gateway current extraction outputs against implemented helper outputs.
3. RF Slice 6.24: compare RF auth/evidence outputs against implemented helper outputs.
4. RF Slice 6.25: evaluate gateway runtime migration behind explicit rollback plan.
5. RF Slice 6.26: evaluate RF auth runtime migration after gateway evidence is clean.
6. Later dedicated slice: evaluate Role/VIP preview adapter alignment.
7. Later dedicated claim slice: evaluate paid claim convergence only with claim owner approval and rollback plan.

