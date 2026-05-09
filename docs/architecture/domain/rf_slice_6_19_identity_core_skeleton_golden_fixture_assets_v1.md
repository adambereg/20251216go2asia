# RF Slice 6.19 - identity-core Skeleton + Golden Fixture Assets v1

## 1. Purpose

Slice 6.19 creates the first real `packages/identity-core` skeleton for shared identity semantics governance.

This slice turns the Slice 6.18 contract into package-level assets:
- exported schema v1 types;
- exported constants;
- initial golden fixtures;
- fixture validation helpers;
- package-level compatibility tests;
- package README.

This is still not runtime adoption. No gateway, RF, PWA, claim, preview, or service middleware imports this package in this slice.

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

## 3. Package Layout

Created package:

```text
packages/identity-core
```

Package name:

```text
@go2asia/identity-core
```

Files:
- `package.json`;
- `tsconfig.json`;
- `vitest.config.ts`;
- `README.md`;
- `src/index.ts`;
- `src/types.ts`;
- `src/constants.ts`;
- `src/fixtures.ts`;
- `test/identity-core.fixtures.test.ts`.

Workspace config was not changed because `pnpm-workspace.yaml` already includes `packages/*`.

The package follows existing package conventions:
- `build: tsc`;
- `typecheck: tsc --noEmit`;
- `test: vitest run`;
- `test:ci: vitest run --config ./vitest.config.ts`;
- TypeScript base config from `packages/config/typescript/base.json`;
- package Vitest config using `tests/vitest/create-package-ci-config.mjs`.

## 4. Exported Types and Constants

The skeleton exports schema v1 types and constants only.

Exported schema/version constants:
- `IDENTITY_SCHEMA_VERSION`;
- `IDENTITY_GOLDEN_FIXTURE_VERSION`;
- `IdentitySchemaVersion`;
- `IdentityGoldenFixtureVersion`.

Exported role/capability types:
- `CanonicalPlatformRole`;
- `IdentityCapability`;
- `IdentityRoleTokenClass`;
- `IdentityRoleSource`;
- `IdentityEvidenceAlignment`;
- `IdentityPreviewState`;
- `IdentityGoldenFixtureGroup`.

Exported payload/result types:
- `IdentityRolePayload`;
- `IdentityTokenMetadata`;
- `NormalizationMetadata`;
- `PlatformRoleExtraction`;
- `CapabilityExtraction`;
- `RoleEvidenceClassification`;
- `NormalizedRolePayload`;
- `IdentityGoldenFixture`;
- `IdentityFixtureValidationResult`.

Exported constant arrays:
- `CANONICAL_PLATFORM_ROLES`;
- `IDENTITY_CAPABILITIES`;
- `IDENTITY_ROLE_TOKEN_CLASSES`;
- `IDENTITY_ROLE_SOURCES`;
- `IDENTITY_ROLE_SOURCE_PRECEDENCE`;
- `IDENTITY_EVIDENCE_ALIGNMENTS`;
- `IDENTITY_PREVIEW_STATES`;
- `IDENTITY_GOLDEN_FIXTURE_GROUPS`.

No runtime normalization functions are implemented in this slice. The package does not export `normalizeRoleToken`, `extractPlatformRole`, `extractRoleCapabilities`, `isVipCapability`, `classifyRoleEvidence`, or `normalizeRolePayload` yet.

## 5. Golden Fixture Assets

The package exports `identityGoldenFixtures` as typed TypeScript fixture assets.

The initial fixture set covers:
- canonical happy paths;
- alias cases;
- role/roles conflicts;
- metadata precedence;
- order-sensitive arrays;
- malformed payloads;
- missing payloads;
- future capability placeholder behavior.

Initial fixture IDs:
- `alias-role-vip`;
- `alias-role-vip-spacer`;
- `canonical-role-vip-spacer`;
- `conflict-role-spacer-roles-vip`;
- `conflict-role-spacer-roles-vip-spacer`;
- `future-capability-placeholder`;
- `malformed-role-falls-through-roles-vip`;
- `metadata-go2-role-precedes-public-metadata`;
- `missing-role-defaults-spacer`;
- `order-roles-admin-member`;
- `order-roles-member-admin`.

The fixtures are adapted from the Slice 6.18 fixture spec and the existing staging-like evidence cases. RF-specific preview drift, backend snapshot, timeout, source unavailable, observability bucket, and leak-prevention matrices remain RF-local.

## 6. Fixture Validation

The package exports validation helpers:
- `validateIdentityGoldenFixture`;
- `validateIdentityGoldenFixtures`;
- `assertNoUnsafeIdentityFixtureFields`.

Validation covers:
- supported `schemaVersion`;
- supported `fixtureVersion`;
- required fixture IDs;
- known fixture groups;
- known platform role values;
- known capability values;
- known role source values;
- known evidence alignment values;
- no raw JWT/PII flags in metadata;
- no unsafe identity fields in raw fixture payloads;
- unique fixture IDs;
- deterministic fixture ID ordering.

Validation intentionally does not perform runtime role normalization and does not replace RF evidence helper behavior.

## 7. Tests

Package tests verify:
- schema constants and exported enum arrays;
- unique fixture IDs;
- deterministic ordering;
- required initial fixture IDs;
- required fixture groups;
- schema v1 and fixture version 1;
- expected roles/capabilities/evidence alignments are known values;
- validation helper accepts all exported fixtures;
- raw payloads do not contain JWT/PII-like fields;
- validation rejects unsafe payload examples.

Tests are package-local only. They do not import gateway, RF runtime, PWA runtime, claim code, or preview adapter code.

## 8. Runtime Adoption Boundary

Runtime adoption is explicitly blocked in this slice.

Allowed usage:
- package-local tests;
- future design docs;
- future compare-only test plans.

Disallowed usage:
- gateway runtime imports;
- RF middleware imports;
- PWA middleware imports;
- claim gate imports;
- preview adapter migration;
- feature flag changes;
- DTO changes.

The package exists as an asset and compatibility anchor, not as a runtime source of truth yet.

## 9. What Remains Experimental

Still experimental:
- exact future implementation names for normalization APIs;
- whether fixtures remain TypeScript-only or gain generated JSON snapshots;
- whether PWA consumes `identity-core` directly or through an adapter;
- future `capabilities[]` source semantics;
- claim convergence timing;
- gateway/RF compare-only evidence mechanism;
- non-VIP capability taxonomy.

No experimental item in this list authorizes runtime adoption without a later slice.

## 10. Risks

### Premature Runtime Imports

The largest risk is importing `@go2asia/identity-core` into gateway, RF, PWA, claim, or preview runtime before compare-only evidence exists.

### Fixture Overreach

The initial fixtures include current preview/claim comparison expectations, but they are compatibility anchors, not enforcement rules.

### RF-specific Policy Leakage

RF preview drift, timeout, backend reconciliation, observability bucket, and badge semantics should remain outside `identity-core` until a separate shared contract exists.

### Capability Expansion

Adding capabilities can silently expand privilege semantics. Future capability additions require fixture updates, migration review, and governance approval.

### Ownership Drift

Without a clear owner, aliases and fixture expectations can drift. Slice 6.18 governance remains the source for review and approval rules.

## 11. Future Migration Path

Recommended next path:

1. RF Slice 6.20: add gateway/RF comparison tests against `identity-core` golden fixtures, still no runtime adoption.
2. RF Slice 6.21: add staging compare-only evidence capture for helper outputs.
3. RF Slice 6.22: implement pure normalization helpers in `identity-core` behind package-level tests.
4. RF Slice 6.23: evaluate gateway extraction migration behind rollback plan.
5. RF Slice 6.24: evaluate RF auth normalization migration after gateway alignment.
6. Later dedicated slice: evaluate Role/VIP preview adapter alignment.
7. Later dedicated claim slice: evaluate paid claim convergence only with claim owner approval and rollback plan.

