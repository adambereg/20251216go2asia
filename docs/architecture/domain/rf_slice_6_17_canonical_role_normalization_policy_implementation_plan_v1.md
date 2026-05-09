# RF Slice 6.17 - Canonical Role Normalization Policy Implementation Plan v1

## 1. Purpose

Slice 6.17 defines an implementation plan for converging gateway, RF auth, preview adapter, and paid claim role semantics onto a canonical role normalization policy.

This is a planning and decision-record slice. It does not migrate runtime behavior.

The plan builds on Slice 6.16 evidence capture, which showed that the current system can classify staging-like payloads across:
- gateway role extraction;
- RF auth normalization;
- paid ordinary VIP claim gate;
- Role/VIP preview adapter semantics.

## 2. Non-goals

Not included:
- runtime normalization migration;
- claim/redeem runtime changes;
- paid ordinary VIP gate changes;
- enforcement changes;
- DB migrations;
- SDK/OpenAPI edits;
- Wallet/NFT/G2A integration;
- new UI features;
- public route changes;
- observability bucket changes;
- backend reconciliation implementation.

Not changed:
- current claim behavior;
- preview safe DTO;
- preview copy;
- badge behavior;
- current public routes;
- current feature flags;
- current adapter runtime.

## 3. Current Normalization Surfaces

### API Gateway

Current gateway extraction order:

1. `role`
2. `go2_role`
3. `public_metadata.role`
4. `publicMetadata.role`
5. first normalized value in `roles[]`
6. default `spacer`

Gateway emits internal `X-Gateway-Auth` with:
- canonical `role`;
- raw/forwarded `roles[]` when present;
- fallback `[platformRole]` when no roles array exists.

Alias list:
- `vip`, `vip-spacer`, `vip_spacer` -> `vip_spacer`;
- `member`, `user`, `spacer` -> `spacer`;
- `admin` -> `admin`;
- `pro` -> `pro`.

### RF Auth

RF auth derives `GatewayPrincipal` from internal gateway JWT:
- `role` wins when normalizable;
- otherwise first normalized `roles[]` wins;
- otherwise default `spacer`.

It does not parse `go2_role` or metadata claims, because those are expected to be resolved by the gateway before signing the internal JWT.

### Paid Ordinary VIP Gate

Current paid claim VIP detection:
- `platformRole === 'vip_spacer'`; or
- raw `roles[]` contains exact `vip_spacer` after trim/lowercase.

It does not normalize `vip` or `vip-spacer` aliases in `roles[]` unless those aliases already caused `platformRole` to be `vip_spacer`.

### Role/VIP Preview Contract

The preview contract normalizes:
- primary `platformRole`;
- every entry in `roles[]`.

For `vip_status`, VIP is granted when:
- primary role is `vip_spacer`; or
- any normalized role array entry is `vip_spacer`.

Admin and PRO do not imply VIP.

### Evidence Helper

`roleNormalizationEvidence.ts` models gateway/RF/claim/preview behavior and classifies alignment:
- `aligned`;
- `preview_grants_claim_rejects`;
- `claim_allows_preview_requires_condition`.

The helper is diagnostic and test-only for this planning sequence. It does not expose public routes.

### Other Consumers

Similar role normalization exists or may exist in:
- `apps/auth-service`;
- `apps/organizer-service`;
- `apps/space-service`;
- `apps/go2asia-pwa-shell` middleware.

These services are future consumers of a shared policy, but they should not be migrated until the canonical role model is approved.

## 4. Divergence Classes

### `preview_grants_claim_rejects`

Example:

```json
{ "role": "spacer", "roles": ["VIP"] }
```

Current behavior:
- gateway platform role: `spacer`;
- RF platform role: `spacer`;
- paid claim gate: reject, because raw roles lack exact `vip_spacer`;
- preview adapter: VIP, because `VIP` normalizes to `vip_spacer`.

### `claim_allows_preview_requires_condition`

This is less common with current logic, but possible if future preview policy narrows VIP capability while claim still accepts exact `vip_spacer` in raw roles.

This class must remain a regression guard in future migration tests.

### Role Array Order Ambiguity

Example:

```json
{ "roles": ["member", "admin"] }
```

Current gateway behavior chooses first normalized value: `member` -> `spacer`. The later `admin` is not used as `platformRole`.

### Role Claim Conflicts With Role Array

Example:

```json
{ "role": "spacer", "roles": ["vip_spacer"] }
```

Current behavior:
- platform role remains `spacer`;
- claim gate allows VIP because raw `roles[]` contains exact `vip_spacer`;
- preview allows VIP because normalized roles contain VIP.

### Metadata Precedence Ambiguity

Example:

```json
{ "go2_role": "pro", "public_metadata": { "role": "vip_spacer" }, "roles": ["vip_spacer"] }
```

Current gateway behavior picks `go2_role` as platform role, while VIP capability may still be inferred from `roles[]`.

## 5. Policy Options

### Option A - Gateway Canonical Role Is Source Of Truth

Policy:
- gateway-generated `role` is authoritative;
- `roles[]` is diagnostic or capability hint only;
- claim and preview align to `platformRole`.

Evaluation:

| Dimension | Assessment |
| --- | --- |
| Compatibility | High for services already trusting `X-Gateway-Auth.role`; lower for flows relying on raw `roles[]`. |
| Safety | Strong against accidental capability expansion. |
| Migration effort | Moderate; claim gate and preview adapter must ignore role-array VIP capability or treat it as diagnostic. |
| Privilege escalation risk | Low. |
| False rejection risk | Medium to high for users with VIP only in `roles[]`. |
| Gateway impact | Low; formalizes current canonical role output. |
| RF claim impact | Medium; exact `vip_spacer` in raw roles may no longer grant if claim aligns strictly to platform role. |
| Preview impact | High; preview would narrow current Role/VIP contract semantics. |
| Backend reconciliation impact | Simpler, but loses capability-role expressiveness. |

### Option B - Normalized Union Capability Model

Policy:
- any normalized VIP in `platformRole` or `roles[]` implies VIP capability;
- aliases are recognized everywhere;
- claim and preview share a capability helper.

Evaluation:

| Dimension | Assessment |
| --- | --- |
| Compatibility | High for preview; medium for current claim because aliases in `roles[]` would start granting. |
| Safety | Requires careful approval; expands claim acceptance for alias-only payloads. |
| Migration effort | Moderate; shared helper plus claim regression/rollback plan. |
| Privilege escalation risk | Medium if upstream role arrays are noisy or not capability-owned. |
| False rejection risk | Low. |
| Gateway impact | Low to moderate; may need canonical roles/capabilities exported. |
| RF claim impact | High because paid gate semantics can change. |
| Preview impact | Low; already close to this model. |
| Backend reconciliation impact | Good for capability comparison, but needs conflict rules. |

### Option C - Explicit Platform Role + Explicit Capability Roles

Policy:
- `platformRole` remains singular and authoritative for primary role;
- VIP capability is a separate normalized capability signal;
- `roles[]` is interpreted as capability evidence, not primary role;
- admin/pro/VIP combinations are allowed without conflating platform role and capability.

Evaluation:

| Dimension | Assessment |
| --- | --- |
| Compatibility | Best long-term; requires staged compatibility work. |
| Safety | Strong if capability extraction has explicit allowlist and conflict rules. |
| Migration effort | Highest; requires shared helper and possibly internal JWT contract evolution. |
| Privilege escalation risk | Low to medium, controlled by capability allowlist. |
| False rejection risk | Low once capability fields are populated consistently. |
| Gateway impact | Medium; may emit canonical platform role plus canonical capability roles. |
| RF claim impact | Medium to high, but can be delayed until explicit approval. |
| Preview impact | Medium; preview can use capability helper while staying informational. |
| Backend reconciliation impact | Strong; backend can compare platform role and capabilities separately. |

## 6. Recommended Policy

Recommended direction: **Option C**, implemented in phases.

Rationale:
- platform role and VIP capability are different concepts;
- admin and PRO should not imply VIP;
- mixed arrays such as `admin + vip_spacer` should be representable without forcing platform role to VIP;
- future backend reconciliation needs to compare both platform role and capabilities;
- claim behavior can remain frozen until capability semantics are explicitly approved.

Explicit proposed decisions:
- `role` should continue to win for `platformRole` until policy migration begins.
- VIP should become a capability independent of `platformRole`.
- Aliases `vip`, `VIP`, `vip-spacer`, and `vip_spacer` should normalize to the same VIP capability, but claim enforcement must not consume this expanded rule until a dedicated migration slice.
- Admin does not imply VIP.
- PRO does not imply VIP.
- Mixed roles imply VIP only when explicit VIP capability is present.
- Malformed roles are ignored for capability extraction and captured as evidence.
- Role/roles conflicts should be captured and, for preview with backend reconciliation, may degrade to temporary state.
- When preview says VIP but claim would reject today, current claim behavior remains authoritative; the case is classified as unresolved policy risk.

## 7. Shared Helper Strategy

### Options

| Option | Pros | Cons |
| --- | --- | --- |
| Keep duplicated per service | No dependency churn | Drift continues; tests duplicate semantics |
| Move to `packages/shared` | Simple package location | Ownership too broad; can become dumping ground |
| Create `packages/platform-auth` | Good fit for auth/gateway semantics | May imply framework/gateway coupling |
| Create `packages/identity-core` | Clear identity ownership, pure helpers | New package and migration work |
| Keep RF-local temporarily | Safe for RF-only experimentation | Gateway/PWA/RF drift remains |

### Recommendation

Create a pure shared helper package only after policy approval.

Preferred package direction:

```text
packages/identity-core
```

Helper constraints:
- framework-free;
- no Clerk dependency;
- no DB dependency;
- pure functions only;
- deterministic fixtures;
- explicit schema version;
- no PII;
- usable by gateway, RF service, auth-service, organizer-service, space-service, and PWA only where safe.

Candidate API shape:

```ts
normalizeRoleToken(value): CanonicalRole | null
extractPlatformRole(input): PlatformRoleResult
extractRoleCapabilities(input): RoleCapabilityResult
isVipCapability(result): boolean
classifyRoleEvidence(input): RoleEvidenceClassification
```

## 8. Migration Sequence

### Phase 0 - Current State Frozen

Scope:
- no runtime changes;
- current divergence documented;
- evidence helper remains diagnostic.

Tests:
- current evidence snapshot matrix;
- current preview-vs-claim divergence classifications.

Rollback:
- no runtime change.

Acceptance:
- docs and tests describe current behavior without changing it.

### Phase 1 - Shared Helper Added But Not Used

Scope:
- add pure shared helper package;
- no service imports in runtime;
- tests compare helper output to current gateway/RF/preview behavior.

Tests:
- golden fixtures for role aliases, mixed roles, metadata precedence, conflicts.

Rollback:
- remove unused package or keep tests-only.

Acceptance:
- helper matches documented policy options and current evidence snapshots.

### Phase 2 - Gateway Adopts Helper For Canonical Extraction

Scope:
- gateway uses helper for platform role extraction;
- internal JWT semantics should remain unchanged unless explicitly approved.

Tests:
- gateway extraction tests for `role`, `go2_role`, metadata, `roles[]`, aliases, order.

Rollback:
- revert gateway helper import; keep helper package.

Acceptance:
- decoded `X-Gateway-Auth.role` remains expected for all golden fixtures.

### Phase 3 - RF Auth Adopts Helper

Scope:
- RF auth derives `GatewayPrincipal` using shared helper;
- no claim gate change.

Tests:
- RF auth internal JWT tests;
- no change to paid claim outcomes.

Rollback:
- revert RF auth helper import.

Acceptance:
- `GatewayPrincipal.platformRole` stays aligned with gateway for existing internal JWTs.

### Phase 4 - Preview Adapter Adopts Shared Helper

Scope:
- Role/VIP preview contract uses shared helper semantics;
- preview remains informational and default-off where applicable.

Tests:
- Role/VIP fixture replay;
- adapter-vs-mock comparison;
- safe DTO leak tests.

Rollback:
- revert adapter helper import.

Acceptance:
- no new preview states, badge states, DTO fields, or observability buckets.

### Phase 5 - Claim VIP Gate Decision

Scope:
- only after explicit approval;
- decide whether claim gate uses VIP capability helper.

Tests:
- paid ordinary VIP gate tests;
- alias expansion tests;
- no privilege escalation tests;
- rollback tests preserving `RF_VIP_REQUIRED_FOR_PAID_VOUCHER`.

Rollback:
- feature flag or direct revert, depending on implementation plan.

Acceptance:
- claim behavior change, if any, is intentionally approved and documented.

### Phase 6 - Backend Role Reconciliation

Scope:
- future-only;
- preview-only first;
- backend snapshot comparison integrated after read contract stabilizes.

Tests:
- gateway/backend drift;
- malformed backend;
- stale backend;
- safe DTO and observability leak checks.

Rollback:
- disable backend reconciliation adapter path.

Acceptance:
- drift degrades preview without claim enforcement.

## 9. Test Strategy

Future implementation must include:
- gateway extraction tests;
- RF auth tests;
- claim VIP gate tests;
- preview adapter tests;
- evidence snapshot tests;
- role alias tests;
- mixed role tests;
- role/roles conflict tests;
- no privilege escalation tests;
- no false rejection tests;
- preview-vs-claim alignment tests;
- rollback tests.

Golden fixtures:

```json
{ "role": "vip" }
{ "role": "vip-spacer" }
{ "role": "vip_spacer" }
{ "role": "spacer", "roles": ["VIP"] }
{ "role": "spacer", "roles": ["vip_spacer"] }
{ "go2_role": "pro", "public_metadata": { "role": "vip_spacer" }, "roles": ["vip_spacer"] }
{ "roles": ["member", "admin"] }
{ "roles": ["admin", "member"] }
{ "role": 42, "roles": ["vip"] }
{}
```

Additional assertions:
- decoded gateway internal JWT includes expected canonical `role`;
- RF `GatewayPrincipal` matches gateway output;
- claim result remains unchanged until Phase 5;
- preview state remains safe and informational;
- evidence classification is stable.

## 10. Risk Matrix

| Risk | Severity | Likelihood | Mitigation | Owner/domain |
| --- | --- | --- | --- | --- |
| Accidental privilege escalation | High | Medium | Do not apply capability helper to claim until Phase 5; add no-escalation tests | RF / Identity |
| `preview_grants_claim_rejects` persists | Medium | High | Document as unresolved until claim policy decision; keep preview informational | RF / Product |
| `claim_allows_preview_requires_condition` appears | Medium | Low | Add regression classification and golden fixtures | RF |
| Gateway/RF mismatch | High | Medium | Shared helper after policy approval; decoded JWT tests | Gateway / RF |
| Role array order ambiguity | Medium | High | Stop treating first array entry as privilege policy; introduce capability extraction | Identity |
| Alias expansion changes claim behavior | High | Medium | Dedicated claim migration slice and rollback plan | RF |
| Admin/PRO/VIP conflation | High | Low | Explicit policy: admin/pro do not imply VIP | Identity / RF |
| Rollback complexity | Medium | Medium | Phase migrations with small imports and feature flags where behavior changes | Platform |
| Shared package coupling | Medium | Medium | Pure framework-free package; no Clerk/DB dependency | Platform |
| Test fixture drift | Medium | Medium | Golden fixtures shared across gateway/RF/preview tests | QA / Platform |
| PWA middleware semantic drift | Medium | Medium | Decide whether PWA consumes helper or avoids entitlement decisions | PWA / Identity |

## 11. Operational Rollout Guidance

Before any runtime migration:
1. Freeze current behavior with evidence fixtures.
2. Capture staging JWT role shapes using sanitized evidence.
3. Approve canonical source and capability policy.
4. Add shared helper tests-only.
5. Compare helper output against gateway/RF/preview/claim current behavior.
6. Migrate one runtime surface at a time.
7. Keep claim gate unchanged until explicit approval.

Rollback signals:
- paid claim outcomes change unexpectedly;
- decoded gateway `role` changes outside accepted fixtures;
- preview creates new states or copy;
- safe DTO includes role diagnostics;
- admin or PRO starts implying VIP without explicit VIP capability.

## 12. What Remains Experimental

Still experimental:
- shared helper package location and ownership;
- capability role schema;
- normalized capabilities in internal JWT;
- backend role reconciliation;
- claim gate convergence;
- PWA consumption strategy;
- production rollout of canonical policy.

## 13. Open Decisions

Open decisions:
- Should gateway continue to treat `role` as authoritative for `platformRole`?
- Should `roles[]` be raw compatibility data, canonical capabilities, or both?
- Should internal JWT add a future `capabilities` field?
- Should claim gate normalize aliases in `roles[]`?
- Should preview degrade on role/roles conflicts before backend reconciliation exists?
- Should PWA middleware consume the shared helper or avoid role decisions?
- Which package should own identity-core semantics?

## 14. Future Migration Path

Recommended next slice:

```text
RF Slice 6.18 - Shared Identity Helper Contract & Golden Fixture Spec
```

Scope:
- create a design-only shared helper API spec;
- define golden fixtures across gateway/RF/preview/claim;
- no runtime adoption;
- no claim behavior change.

Only after that should implementation slices begin migrating gateway or RF auth.
