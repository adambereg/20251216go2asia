# RF Slice 6.22 - identity-core Pure Normalization Helpers v1

## 1. Purpose

Slice 6.22 implements pure deterministic normalization helpers inside `packages/identity-core`.

This is package-only implementation. The helpers are covered by package-level tests and conform to the Slice 6.19 golden fixtures, but they are not adopted by gateway, RF, PWA, claim, preview, or any app runtime.

The slice converts the candidate API from Slice 6.18 into real package exports:
- `normalizeRoleToken`;
- `extractPlatformRole`;
- `extractRoleCapabilities`;
- `isVipCapability`;
- `classifyRoleEvidence`;
- `normalizeRolePayload`.

## 2. Non-goals

Not included:
- gateway runtime imports from `@go2asia/identity-core`;
- RF runtime imports from `@go2asia/identity-core`;
- PWA runtime imports;
- claim/redeem runtime changes;
- paid VIP gate changes;
- Role/VIP preview adapter migration;
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

## 3. Implemented Helpers

Implemented in:

```text
packages/identity-core/src/normalize.ts
```

Exported through:

```text
packages/identity-core/src/index.ts
```

### `normalizeRoleToken(value)`

Returns schema v1 token normalization:
- token class;
- lowercased/trimmed token;
- canonical role or `null`;
- matched alias when applicable.

It accepts `unknown` and does not throw for malformed user-provided values.

### `extractPlatformRole(input)`

Returns schema v1 platform-role extraction with:
- canonical platform role;
- source;
- defaulting flag;
- safe normalization metadata.

### `extractRoleCapabilities(input)`

Returns schema v1 capability extraction. The only capability is currently `vip_spacer`.

### `isVipCapability(input)`

Convenience wrapper over `extractRoleCapabilities`. It is not a paid claim gate.

### `classifyRoleEvidence(input)`

Classifies current schema v1 preview-vs-claim evidence:
- `aligned`;
- `preview_grants_claim_rejects`;
- `claim_allows_preview_requires_condition`.

### `normalizeRolePayload(input)`

Combines platform role, capability extraction, evidence classification, and metadata into one deterministic output.

## 4. Schema v1 Semantics

Canonical platform roles:
- `spacer`;
- `vip_spacer`;
- `pro`;
- `admin`.

Token normalization:
- `admin` -> `admin`;
- `pro` -> `pro`;
- `spacer` -> `spacer`;
- `vip_spacer` -> `vip_spacer`;
- `vip`, `vip-spacer` -> `vip_spacer`;
- `member`, `user` -> `spacer`;
- empty strings -> `missing`;
- non-string values -> `non_string`;
- unknown strings -> `unknown`.

Platform-role source precedence:

1. `role`
2. `go2_role`
3. `public_metadata.role`
4. `publicMetadata.role`
5. first recognized `roles[]`
6. `default_spacer`

`capabilities[]` is not inspected for platform role in schema v1.

## 5. Golden Fixture Conformance

`normalizeRolePayload(rawInputPayload)` is tested against every `identityGoldenFixtures[]` entry.

The conformance checks cover:
- schema version;
- platform role value;
- platform role source;
- defaulted flag;
- extracted capabilities;
- evidence alignment;
- role/roles conflict flag;
- VIP alias-only flag;
- roles order-sensitive flag;
- safe metadata flags;
- deterministic output.

## 6. Capability Extraction Behavior

Schema v1 capability enum:

```text
vip_spacer
```

VIP capability can be detected from:
- canonical `vip_spacer` platform role;
- normalized `roles[]` entry equivalent to `vip_spacer`.

VIP capability is not detected from:
- `admin`;
- `pro`;
- unknown roles;
- future `capabilities[]` placeholders.

This preserves the Slice 6.20/6.21 boundary: capability extraction exists in the package, but application claim behavior does not consume it.

## 7. Evidence Classification Behavior

Current claim VIP model:
- platform role is `vip_spacer`; or
- raw `roles[]` contains exact `vip_spacer` after trim/lowercase.

Preview capability model:
- `isVipCapability(input)` returns true.

Classification:
- preview true + claim false -> `preview_grants_claim_rejects`;
- claim true + preview false -> `claim_allows_preview_requires_condition`;
- otherwise -> `aligned`.

Under current schema v1 rules, `claim_allows_preview_requires_condition` is reserved but not produced by the initial golden fixtures.

## 8. Runtime Adoption Boundary

This slice does not import `@go2asia/identity-core` into app runtime.

Allowed usage:
- `packages/identity-core` package tests;
- existing gateway/RF compare-only tests;
- future compare-only helper-output tests.

Disallowed usage:
- gateway runtime imports;
- RF runtime imports;
- PWA runtime imports;
- claim gate imports;
- preview adapter migration.

The runtime import guard from Slice 6.20/6.21 remains the protection layer for current migration surfaces.

## 9. Tests

Package tests added:

```text
packages/identity-core/test/identity-core.normalize.test.ts
```

Coverage includes:
- canonical tokens;
- aliases;
- whitespace/casing;
- unknown strings;
- empty strings;
- non-string inputs;
- platform-role precedence;
- malformed role fallback;
- missing payload default;
- VIP capability from platform role;
- VIP capability from `roles[]` alias;
- admin/PRO not implying VIP;
- future `capabilities[]` not granting VIP;
- evidence classifications;
- golden fixture conformance;
- deterministic outputs.

Existing fixture validation tests remain in:

```text
packages/identity-core/test/identity-core.fixtures.test.ts
```

## 10. What Remains Experimental

Still experimental:
- gateway runtime adoption;
- RF runtime adoption;
- PWA adoption strategy;
- claim convergence;
- preview adapter alignment;
- generated machine-readable evidence reports;
- future non-VIP capabilities;
- exact governance flow for alias additions beyond schema v1.

## 11. Risks

### Premature Runtime Adoption

The helpers now exist and are easy to import. They must not be used by gateway/RF/PWA/claim runtime until compare-only helper-output slices and rollback plans are complete.

### Claim Semantics Confusion

`isVipCapability` is not equivalent to current paid claim behavior. Claim convergence remains a separate decision.

### Capability Expansion

Future `capabilities[]` support can silently expand privilege semantics if added without fixtures and governance review.

### Metadata Drift

The helpers return safe metadata. Tests should continue to guard against raw JWT/PII-like output if metadata grows.

## 12. Future Migration Path

Recommended next path:

1. RF Slice 6.23: compare current gateway extraction outputs against implemented `identity-core` helper outputs, still no runtime adoption.
2. RF Slice 6.24: compare RF auth/evidence outputs against implemented helper outputs, still no runtime adoption.
3. RF Slice 6.25: evaluate gateway runtime migration behind explicit rollback plan.
4. RF Slice 6.26: evaluate RF auth runtime migration after gateway evidence is clean.
5. Later dedicated slice: evaluate Role/VIP preview adapter alignment.
6. Later dedicated claim slice: evaluate paid claim convergence only with claim owner approval and rollback plan.

