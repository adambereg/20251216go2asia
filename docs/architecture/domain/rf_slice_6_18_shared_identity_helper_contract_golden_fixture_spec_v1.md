# RF Slice 6.18 - Shared Identity Helper Contract & Golden Fixture Spec v1

## 1. Purpose

Slice 6.18 defines the design contract for a future shared identity helper and the golden fixture model that will anchor role/capability normalization compatibility across Go2Asia services.

This is a specification slice only. It does not create the shared package, does not import it into runtime code, and does not change preview, claim, gateway, RF, PWA, or adapter behavior.

The slice builds on:
- Slice 6.10 real read adapter readiness;
- Slice 6.11-6.13 Role/VIP adapter contract and fixture matrix;
- Slice 6.14-6.15 default-off Role/VIP preview runtime and staging readiness;
- Slice 6.16 staging evidence capture;
- Slice 6.17 canonical role normalization policy plan.

The recommended long-term direction remains Option C from Slice 6.17: explicit platform role plus explicit capability roles.

## 2. Non-goals

Not included:
- shared helper implementation;
- runtime migration;
- gateway/RF/PWA middleware changes;
- claim/redeem behavior changes;
- paid ordinary VIP gate changes;
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

## 3. Current Normalization Duplication Map

### API Gateway

The gateway currently owns the broadest extraction semantics for incoming identity claims:

1. `role`
2. `go2_role`
3. `public_metadata.role`
4. `publicMetadata.role`
5. first normalized value in `roles[]`
6. default `spacer`

It normalizes known aliases:
- `vip`, `vip-spacer`, `vip_spacer` -> `vip_spacer`;
- `member`, `user`, `spacer` -> `spacer`;
- `admin` -> `admin`;
- `pro` -> `pro`.

The gateway signs an internal `X-Gateway-Auth` principal containing a canonical `role` and forwarded or fallback roles.

### RF, Organizer, Space, and Auth Service Middleware

Several service middleware copies derive a `GatewayPrincipal` from the internal gateway JWT. They normalize:

1. `payload.role`
2. first normalized value in `payload.roles[]`
3. default `spacer`

They intentionally do not parse `go2_role` or metadata fields, because those are expected to be resolved before the gateway signs the internal JWT.

This duplication is acceptable temporarily, but it creates drift risk when aliases, precedence, or capability extraction rules evolve.

### PWA Middleware

The PWA middleware has its own session-claim extraction path. It follows a gateway-like claim precedence shape but uses a narrower alias model in the observed implementation. This can differ from gateway behavior for values such as `vip`, `vip-spacer`, `member`, or `user`.

PWA routing semantics should remain service-specific until the shared helper contract is approved and a separate migration slice defines whether client-visible routing should consume the same core helper directly or through a PWA adapter.

### Paid Ordinary VIP Claim Gate

The current paid claim VIP check allows VIP when:
- `platformRole === 'vip_spacer'`; or
- raw `roles[]` contains exact `vip_spacer` after trim/lowercase.

It does not normalize every VIP alias in `roles[]` unless the gateway/RF platform role has already become `vip_spacer`. This is an intentional current enforcement behavior and must not change in this slice.

### Role/VIP Preview Adapter

The Role/VIP preview contract normalizes both the primary `platformRole` and every entry in `roles[]`.

For `vip_status`, preview treats VIP as available when:
- primary role is `vip_spacer`; or
- any normalized role-array entry is `vip_spacer`.

Admin and PRO do not imply VIP.

### Evidence Helper

`roleNormalizationEvidence.ts` models gateway, RF auth, claim gate, and preview adapter outcomes for staging-like evidence. It already includes:
- `schemaVersion: 1`;
- raw JWT and PII absence flags;
- claim-source metadata;
- token classification;
- role-array classification;
- divergence classes.

This helper is diagnostic. It is a source of fixture ideas and evidence schema requirements, not a runtime migration target in this slice.

## 4. Shared Helper Contract Proposal

### Package Direction

Recommended future package:

```text
packages/identity-core
```

Package constraints:
- pure;
- deterministic;
- framework-free;
- no Clerk dependency;
- no DB dependency;
- no network access;
- no environment access;
- no logging side effects;
- no route/middleware helpers in the core package;
- no JWT signing or verification;
- no claim enforcement decisions.

The package should expose identity semantics only. Gateway, RF service, PWA, auth-service, organizer-service, and space-service should keep framework-specific adapters outside the core package.

### Candidate APIs

The following APIs are proposed as design-only contracts. Names may be refined before implementation, but behavior and compatibility expectations should remain stable once golden fixtures are approved.

```ts
type IdentitySchemaVersion = 1;

type CanonicalPlatformRole = 'spacer' | 'vip_spacer' | 'pro' | 'admin';

type IdentityCapability = 'vip_spacer';

type NormalizedRoleToken = {
  schemaVersion: IdentitySchemaVersion;
  rawTokenClass: IdentityRoleTokenClass;
  normalizedToken: string | null;
  canonicalRole: CanonicalPlatformRole | null;
  matchedAlias: string | null;
};

function normalizeRoleToken(value: unknown): NormalizedRoleToken;
```

`normalizeRoleToken(value)` should:
- accept unknown input;
- trim and lowercase strings;
- return `null` canonical role for unknown, empty, or non-string values;
- classify malformed input deterministically;
- never throw for malformed user-provided values.

```ts
type IdentityRolePayload = {
  role?: unknown;
  go2_role?: unknown;
  public_metadata?: { role?: unknown } | null;
  publicMetadata?: { role?: unknown } | null;
  roles?: unknown;
  capabilities?: unknown;
};

type PlatformRoleExtraction = {
  schemaVersion: IdentitySchemaVersion;
  platformRole: CanonicalPlatformRole;
  source: IdentityRoleSource;
  defaulted: boolean;
  metadata: NormalizationMetadata;
};

function extractPlatformRole(input: IdentityRolePayload): PlatformRoleExtraction;
```

`extractPlatformRole(input)` should:
- use the canonical source precedence approved for the schema version;
- default to `spacer` only when no recognized role token exists;
- expose source metadata for diagnostics;
- avoid returning raw JWTs, subject identifiers, emails, or wallet identifiers.

```ts
type CapabilityExtraction = {
  schemaVersion: IdentitySchemaVersion;
  capabilities: IdentityCapability[];
  sources: CapabilitySource[];
  metadata: NormalizationMetadata;
};

function extractRoleCapabilities(input: IdentityRolePayload): CapabilityExtraction;
function isVipCapability(input: IdentityRolePayload): boolean;
```

`extractRoleCapabilities(input)` should:
- derive capability-like semantics from approved sources only;
- deduplicate capabilities;
- return capabilities in deterministic sorted order;
- keep `admin` and `pro` separate from VIP unless an explicit future fixture adds such a capability;
- preserve current claim divergence classification instead of silently changing claim behavior.

`isVipCapability(input)` should be a convenience wrapper over `extractRoleCapabilities`. It must not be used as claim enforcement until a separate claim convergence slice approves migration.

```ts
type RoleEvidenceClassification = {
  schemaVersion: IdentitySchemaVersion;
  alignment: IdentityEvidenceAlignment;
  roleClaimConflictsWithRoles: boolean;
  vipAliasOnlyInRoles: boolean;
  rolesOrderSensitive: boolean;
  metadata: NormalizationMetadata;
};

function classifyRoleEvidence(input: IdentityRolePayload): RoleEvidenceClassification;
```

`classifyRoleEvidence(input)` should:
- classify preview/claim/gateway divergence for decoded, sanitized payloads;
- avoid PII and raw JWT fields;
- remain deterministic and serializable;
- be usable in fixture tests and staging evidence review.

```ts
type NormalizedRolePayload = {
  schemaVersion: IdentitySchemaVersion;
  platformRole: PlatformRoleExtraction;
  capabilities: CapabilityExtraction;
  evidence: RoleEvidenceClassification;
  metadata: NormalizationMetadata;
};

function normalizeRolePayload(input: IdentityRolePayload): NormalizedRolePayload;
```

`normalizeRolePayload(input)` should combine platform-role extraction, capability extraction, and evidence classification into one reusable contract for tests and migration comparisons.

### Input Schema

The core input schema should be decoded, sanitized identity payload data, not raw auth artifacts.

Allowed input fields:
- `role`;
- `go2_role`;
- `public_metadata.role`;
- `publicMetadata.role`;
- `roles`;
- future `capabilities`.

Disallowed input fields in golden fixtures and helper snapshots:
- raw JWTs;
- session tokens;
- emails;
- wallet addresses;
- NFT identifiers;
- G2A balances;
- database user records;
- request headers other than decoded role/capability fields.

### Output Schema

All helper outputs should include:
- `schemaVersion`;
- canonical output values;
- source metadata;
- token classification metadata;
- deterministic arrays;
- safe evidence metadata;
- no raw secrets or PII.

### Error and Malformed Semantics

The helper should not throw for malformed role payloads. It should classify malformed values and return safe defaults.

Expected behavior:
- non-string scalar role tokens classify as `non_string`;
- empty strings classify as `missing`;
- unknown strings classify as `unknown`;
- missing payload defaults platform role to `spacer`;
- non-array `roles` values are not expanded unless the schema explicitly allows string-as-single-role behavior;
- unknown capabilities are ignored but recorded as unknown metadata when safe.

Implementation errors, invalid schema definitions, or impossible internal states may throw in tests, but user-provided malformed identity payloads should not.

### Deterministic Ordering

The helper must be deterministic:
- source precedence is explicit;
- role arrays preserve source indices in metadata;
- canonical role arrays deduplicate without unstable ordering;
- capability arrays are sorted by canonical enum order;
- fixture outputs are stable across Node, Workers, and browser test environments.

### Unknown Role Behavior

Unknown roles must not be promoted to platform roles or capabilities.

For schema version 1:
- unknown primary role with no fallback role defaults to `spacer`;
- unknown role-array entries are recorded in metadata but excluded from canonical roles;
- unknown capabilities are excluded from canonical capabilities;
- unknown values do not produce entitlement grants.

### Capability Extraction Behavior

For schema version 1, the only explicit capability candidate is VIP spacer access.

VIP capability is detected from approved role semantics:
- canonical `vip_spacer` platform role;
- normalized role-array entry equivalent to `vip_spacer`;
- future explicit `capabilities[]` only after a schema-compatible migration decision.

Admin and PRO remain platform roles, not VIP capability aliases.

## 5. Canonical Schema & Versioning

### Canonical Role Enum

Schema version 1 canonical platform roles:

```ts
type CanonicalPlatformRole = 'spacer' | 'vip_spacer' | 'pro' | 'admin';
```

Semantics:
- `spacer`: default ordinary platform user role;
- `vip_spacer`: platform role currently associated with VIP spacer semantics;
- `pro`: PRO platform role;
- `admin`: administrative platform role.

### Capability Enum

Schema version 1 capabilities:

```ts
type IdentityCapability = 'vip_spacer';
```

The enum is intentionally smaller than platform roles. It is the start of Option C, not a full entitlement system.

Future capability candidates such as Wallet/NFT/G2A are out of scope until each domain defines a read-only contract and governance approval path.

### Normalization Metadata

Recommended metadata:

```ts
type IdentityRoleTokenClass =
  | 'missing'
  | 'canonical'
  | 'vip_alias'
  | 'spacer_alias'
  | 'unknown'
  | 'non_string';

type IdentityRoleSource =
  | 'role'
  | 'go2_role'
  | 'public_metadata.role'
  | 'publicMetadata.role'
  | 'roles[]'
  | 'capabilities[]'
  | 'default_spacer';

type NormalizationMetadata = {
  containsRawJwt: false;
  containsPii: false;
  defaulted: boolean;
  sourcePrecedence: IdentityRoleSource[];
  tokenClasses: Array<{
    source: IdentityRoleSource;
    index?: number;
    tokenClass: IdentityRoleTokenClass;
    normalizedToken: string | null;
    canonicalRole: CanonicalPlatformRole | null;
  }>;
};
```

Metadata is part of the compatibility contract. It lets services compare outputs during migration without exposing unsafe identity payloads.

### Evidence Classification

Schema version 1 evidence alignments:

```ts
type IdentityEvidenceAlignment =
  | 'aligned'
  | 'preview_grants_claim_rejects'
  | 'claim_allows_preview_requires_condition';
```

Classification must remain explicit. A preview/claim divergence is not a helper error by itself; it is a migration finding that must be reviewed.

### Source Precedence Metadata

For schema version 1, the proposed broad extraction precedence is:

1. `role`
2. `go2_role`
3. `public_metadata.role`
4. `publicMetadata.role`
5. first recognized `roles[]`
6. default `spacer`

This mirrors current gateway/evidence semantics. Service middleware may continue to use narrower internal-JWT extraction until a migration slice explicitly changes imports.

### Schema Versioning Strategy

All helper outputs and golden fixtures must include `schemaVersion`.

Versioning rules:
- patch-level implementation fixes must not change canonical outputs for approved fixtures;
- alias additions require fixture updates and compatibility review;
- new capabilities require fixture updates and migration review;
- precedence changes require a schema minor/major review depending on output impact;
- any change that alters existing fixture canonical outputs is breaking unless explicitly classified as a planned migration.

Schema version 1 should remain frozen once golden fixtures are approved.

### Backward Compatibility Expectations

Consumers should be able to run both current local logic and future helper logic in comparison mode before migration.

Compatibility expectations:
- existing approved fixture IDs remain stable;
- expected outputs are not silently rewritten;
- services can pin a fixture schema version;
- migration compares old and new outputs before runtime adoption;
- claim behavior remains authoritative until claim convergence is separately approved.

### Deprecation Policy

Deprecating an alias or source requires:
- new fixture coverage showing current and target behavior;
- explicit divergence classification;
- staging evidence review;
- rollback plan;
- release notes for affected consumers.

Aliases should normally be additive. Removing aliases is breaking if any approved fixture changes platform role or capability output.

### Alias Migration Policy

Alias additions must:
- add token-class coverage;
- add golden fixtures;
- define whether the alias affects platform role, capability, or evidence metadata only;
- define whether claim gate convergence is blocked or unaffected;
- avoid granting new capabilities without migration approval.

### Golden Fixture Versioning

Golden fixtures should be stored with:
- `fixtureVersion`;
- `schemaVersion`;
- stable `id`;
- stable `group`;
- approved expected outputs;
- compatibility notes.

Fixture IDs must not be reused for changed semantics. If semantics change intentionally, add a new fixture ID and mark the old fixture as deprecated or migration-only.

## 6. Golden Fixture Specification

Golden fixtures are long-term compatibility anchors. They must be deterministic, serializable, PII-free, and reusable across gateway, RF, PWA, preview, claim comparison, and future package tests.

### Fixture Shape

Recommended shape:

```ts
type IdentityGoldenFixture = {
  fixtureVersion: 1;
  schemaVersion: 1;
  id: string;
  group: IdentityGoldenFixtureGroup;
  description: string;
  rawInputPayload: IdentityRolePayload;
  expected: {
    platformRole: {
      value: CanonicalPlatformRole;
      source: IdentityRoleSource;
      defaulted: boolean;
    };
    capabilities: IdentityCapability[];
    claimVipBehavior: {
      currentClaimAllowsVip: boolean;
      source: 'platform_role' | 'exact_roles_array' | 'none';
    };
    previewBehavior: {
      currentPreviewVip: boolean;
      expectedPreviewState: 'available' | 'requires_condition' | 'checking_or_temporarily_unavailable' | 'ordinary_no_preview' | 'unavailable' | 'not_enabled';
      informationalOnly: true;
      claimBehaviorUnchanged: true;
    };
    divergence: {
      alignment: IdentityEvidenceAlignment;
      roleClaimConflictsWithRoles: boolean;
      vipAliasOnlyInRoles: boolean;
      rolesOrderSensitive: boolean;
    };
    normalizationMetadata: NormalizationMetadata;
  };
  compatibility: {
    breakingIfChanged: boolean;
    notes: string[];
  };
};
```

### Required Fixture Groups

Required groups:
- canonical happy paths;
- alias cases;
- role/roles conflicts;
- metadata precedence;
- order-sensitive arrays;
- malformed payloads;
- missing payloads;
- future capability combinations.

### Candidate Fixture Sources

Existing candidates:
- `roleVipFixtureMatrix` from `roleVipAdapterContracts.ts`;
- staging-like evidence cases from `role-normalization-evidence.test.ts`;
- mock-vs-contract comparison cases from Role/VIP adapter interface tests;
- documented divergence examples from Slices 6.16 and 6.17.

The Role/VIP contract matrix is strongest for preview/observability expectations. The evidence cases are strongest for gateway/RF/claim/preview comparison and source precedence.

### Fixture Safety Rules

Fixtures must not include:
- raw JWTs;
- session tokens;
- request signatures;
- emails;
- wallet addresses;
- subject identifiers that map to real users;
- NFT or G2A account payloads;
- DB rows.

Use synthetic labels and redacted subjects only.

### Gateway/RF/Preview/Claim Comparisons

Every golden fixture should be able to answer:
- what platform role the gateway would extract;
- what RF auth would receive or derive;
- whether current claim gate allows VIP;
- whether current preview adapter would show VIP available;
- whether preview and claim diverge;
- whether the divergence is expected, risky, or migration-blocking.

## 7. Compatibility Guarantees

The shared helper must not silently change canonical output.

Explicit guarantees:
- approved fixture outputs are stable for the pinned `schemaVersion`;
- alias additions require fixture updates;
- capability extraction changes require migration review;
- preview/claim divergence must be classified;
- claim enforcement does not follow helper changes automatically;
- schemaVersion bump rules are defined before runtime adoption;
- rollback preserves the previous helper version and fixture set.

### Breaking Changes

Breaking changes include:
- changing canonical platform role for an approved fixture;
- changing capability output for an approved fixture;
- changing source precedence in a way that changes canonical output;
- changing malformed behavior from safe default to grant;
- removing an alias used by an approved fixture;
- adding a capability that causes claim or preview grants without migration approval;
- changing evidence alignment names without compatibility mapping.

### Additive Changes

Additive changes include:
- new fixtures that do not alter existing fixture outputs;
- new metadata fields that are optional and safe;
- new unknown-token classifications that do not change canonical role or capability output;
- new capability enum members behind explicit fixture and migration approval;
- new service-specific adapters outside `identity-core`.

### Service Validation

Before consuming the helper, each service should run:
- golden fixture conformance tests;
- current-local-logic vs helper comparison tests;
- no-PII/no-raw-JWT snapshot checks;
- divergence classification checks;
- rollback tests against the previous fixture version.

### Gateway and RF Comparison During Migration

Migration should begin in compare-only mode:
- gateway computes current output and helper output;
- RF auth computes current output and helper output;
- mismatches are counted or reviewed through safe evidence snapshots;
- no request behavior changes until mismatches are classified and approved;
- claim gate remains unchanged until a dedicated convergence slice.

## 8. Governance & Ownership

### Ownership

Recommended ownership:
- canonical role semantics: platform identity/domain architecture owner;
- helper package code: platform/shared-infra owner with identity review;
- golden fixtures: joint gateway + RF owners;
- preview behavior mapping: RF entitlement preview owner;
- claim behavior mapping: RF claim/redeem owner;
- PWA routing adoption: PWA owner with identity review;
- future Wallet/NFT/G2A capabilities: owning domain plus identity governance approval.

### Approval Rules

Require review for:
- alias additions;
- source precedence changes;
- capability enum changes;
- schemaVersion changes;
- claim behavior convergence;
- internal JWT shape changes;
- migration from local helpers to `identity-core`.

### Review Checklist

Every role/capability semantics change should answer:
- Does any approved fixture output change?
- Is this platform role, capability, or evidence metadata?
- Does claim behavior remain unchanged?
- Does preview behavior remain informational only?
- Are malformed/unknown inputs still fail-closed?
- Are raw JWTs and PII excluded?
- Is rollback possible?
- Have gateway, RF, PWA, and claim owners reviewed relevant impacts?

### Rollout Approval Path

Recommended path:

1. Approve golden fixtures and schema version.
2. Create `packages/identity-core` without runtime consumers.
3. Add comparison tests in gateway and RF.
4. Run staging evidence review.
5. Migrate gateway extraction behind comparison evidence.
6. Migrate RF auth after gateway alignment.
7. Migrate preview adapter after RF alignment.
8. Consider claim convergence only in a separate, explicit slice.

### Staging Evidence Review

Staging review should inspect:
- fixture conformance;
- real decoded payload shapes without raw JWT retention;
- divergence classes;
- unknown token frequency;
- order-sensitive arrays;
- alias-only VIP cases;
- privilege escalation risks;
- rollback readiness.

## 9. Migration Readiness Checklist

Runtime migration must not begin until:
- golden fixtures are approved;
- `schemaVersion` is frozen for version 1;
- gateway extraction tests are aligned;
- RF auth tests are aligned;
- preview adapter tests are aligned;
- evidence snapshots are collected and reviewed;
- preview/claim divergence classes are accepted or blocked;
- rollback path is validated;
- no unresolved privilege escalation cases remain;
- claim owners explicitly acknowledge current claim behavior remains authoritative;
- PWA adoption strategy is decided.

### Claim Gate Convergence Blockers

Still blocking claim convergence:
- unresolved `vip`/`vip-spacer` alias behavior in raw `roles[]`;
- lack of approved `isVipCapability` enforcement migration;
- no production evidence review for alias-only VIP cases;
- no rollback plan for paid claim behavior changes;
- no explicit approval that preview semantics may become claim semantics.

### Backend Reconciliation Blockers

Still blocking backend reconciliation:
- no backend role source migration plan in this slice;
- no stale-cache or drift resolution implementation;
- no DB schema or data reconciliation plan;
- no authoritative cross-domain role/capability ownership model beyond this spec.

### Production Rollout Blockers

Still blocking production rollout:
- helper package not implemented;
- fixtures not yet stored as package-level test assets;
- gateway/RF/PWA comparison mode not implemented;
- governance owners not formally assigned;
- current divergence cases not resolved or accepted for rollout.

## 10. What Remains Experimental

Experimental:
- exact future package export names;
- whether PWA consumes `identity-core` directly or through an adapter;
- future `capabilities[]` claim shape;
- non-VIP capability taxonomy;
- backend reconciliation behavior;
- claim gate convergence timing;
- observability/reporting of compare-only mismatches;
- service-by-service migration sequence after RF.

Not experimental in this spec:
- current runtime behavior remains unchanged;
- golden fixtures must be deterministic and PII-free;
- Option C is the recommended policy direction;
- claim convergence requires a separate approval slice.

## 11. Risks

### Silent Privilege Expansion

Adding aliases or capabilities can accidentally turn unknown or informal role strings into grants. Golden fixtures and schemaVersion gates are required to prevent silent expansion.

### Preview/Claim Divergence

Current preview and claim semantics intentionally diverge for some alias-only cases. The shared helper must classify those cases instead of hiding them.

### Over-centralized Helper

Putting middleware, Clerk, JWT verification, logging, or DB behavior into `identity-core` would make the package harder to adopt and risk coupling service runtimes. Keep the core package semantic only.

### Fixture Drift

If fixtures are copied into multiple services without a single owner, they can drift. Golden fixtures should eventually live beside `identity-core` and be imported by service tests.

### Ambiguous Ownership

Without explicit owners, alias and capability changes may bypass the teams affected by gateway, RF claim, PWA routing, or future Wallet/NFT/G2A behavior.

## 12. Future Migration Path

Recommended next path:

1. RF Slice 6.19: create `packages/identity-core` skeleton with types and golden fixtures only, no runtime consumers.
2. RF Slice 6.20: add gateway/RF comparison tests against golden fixtures, still no runtime migration.
3. RF Slice 6.21: add staging compare-only evidence capture for helper outputs.
4. RF Slice 6.22: migrate gateway extraction behind approved rollback plan.
5. RF Slice 6.23: migrate RF auth normalization after gateway evidence is clean.
6. RF Slice 6.24: align Role/VIP preview adapter with shared helper.
7. Later dedicated slice: evaluate claim gate convergence, with paid claim owners and rollback approval.

## 13. Glossary

`platform role`: The canonical role used to describe a user's primary platform identity state, such as `spacer`, `vip_spacer`, `pro`, or `admin`.

`capability`: A normalized ability-like marker derived from identity data, such as future VIP capability. Capabilities must not imply enforcement unless the consuming domain explicitly adopts them.

`canonical role`: A role token after approved alias normalization and source precedence have been applied.

`evidence snapshot`: A sanitized, deterministic diagnostic object comparing gateway/RF/preview/claim interpretation without PII or raw JWTs.

`divergence class`: A named classification of differences between systems, such as `preview_grants_claim_rejects`.

