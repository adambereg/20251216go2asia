# RF Slice 6.11 - Role/VIP Adapter Design & Fixture Plan v1

## 1. Purpose

Slice 6.11 defines adapter-specific design for the first real read adapter candidate from Slice 6.10:
- Role / platformRole;
- VIP status.

This slice provides:
- source-of-truth clarification;
- role/VIP drift policy;
- fixture matrix;
- contract test plan;
- rollout acceptance criteria.

The slice is design-only and does not change runtime behavior.

## 2. Non-goals

Not included:
- runtime adapter implementation;
- production adapter wiring;
- DB migrations;
- generated SDK/OpenAPI edits;
- premium claim enforcement;
- claim blocking;
- claim/redeem runtime changes;
- Points runtime changes;
- Wallet/NFT/G2A integration;
- new UI features;
- analytics platform;
- external telemetry integration.

Not changed:
- claim payload;
- idempotency;
- repeatability;
- voucher lifecycle;
- preview safe DTO;
- preview copy;
- badge behavior;
- current feature flag matrix;
- observability buckets.

## 3. Current Role/VIP SoT Audit

### 3.1 Current runtime trust chain

Current runtime chain for RF requests:
1. identity token is validated in gateway;
2. gateway derives canonical role and roles;
3. gateway mints internal token for downstream services;
4. RF builds `GatewayPrincipal` from the internal token;
5. RF uses principal role data for policy checks.

Canonical platform role values:
- `spacer`;
- `vip_spacer`;
- `pro`;
- `admin`.

### 3.2 Existing source-of-truth reality

Current SoT candidates already present in platform:
- gateway principal role claims (low latency runtime truth for request path);
- backend canonical role in `users.role` (identity persistence truth).

Current RF preview flow uses principal-derived subject for safe preview proxy and does not trust client-provided subject fields.

### 3.3 Current VIP runtime behavior that must not change

Paid ordinary voucher VIP gate already exists in RF claim path:
- non-VIP user can receive `RF_VIP_REQUIRED_FOR_PAID_VOUCHER` in paid ordinary voucher conditions;
- VIP detection currently uses principal semantics (`platformRole` or `roles` containing `vip_spacer`);
- this is claim-runtime policy and must remain untouched in Slice 6.11.

### 3.4 Current mock entitlement role behavior

In current mock harness:
- source `role` exists in default source set;
- `vip_status` and `pro_status` exist as source enums but are not yet real role-tier adapters;
- mock decisions are scenario-driven and not production role truth.

This confirms Slice 6.11 is about design and fixtures before real adapter code.

## 4. Adapter Design

### 4.1 Scope

Role/VIP adapter is a read adapter for entitlement preview pipeline.

Responsibilities:
- consume trusted role/tier signal;
- normalize source decision;
- map source outcome to existing entitlement reason codes;
- preserve preview safe DTO boundary;
- support single and batch consistency.

### 4.2 Adapter source types

Planned source types:
- `role`;
- `vip_status`.

`pro_status` may remain separate and not be auto-mapped to VIP unless policy explicitly says so.

### 4.3 Normalized adapter outcomes

Potential normalized decisions:
- `granted`;
- `denied`;
- `pending`;
- `unknown`;
- `not_applicable`.

Potential normalized reason codes:
- `insufficient_status`;
- `requirement_missing`;
- `source_unavailable`;
- `source_timeout`;
- `temporarily_unavailable`;
- `policy_not_configured`;
- `ordinary_resource_no_gate`.

Additional note:
- `admin` role must not auto-grant VIP;
- `pro` role must not auto-grant VIP unless policy explicitly approves it.

### 4.4 Public boundary

Adapter may produce internal normalized metadata, but public preview must remain the existing safe DTO only:
- `state`;
- `label`;
- `caption`;
- `informationalOnly`;
- `claimBehaviorUnchanged`;
- optional safe fields already allowed by current preview contract.

Raw roles or role diagnostics must never appear in public DTO.

## 5. Source-of-truth Recommendation

### 5.1 SoT options

Option 1 - Gateway principal only:
- Pros: low latency, already present on RF request path;
- Risks: stale session role until token refresh, drift vs backend persisted role.

Option 2 - Backend user role service only:
- Pros: canonical persisted role;
- Risks: additional dependency, latency, timeout and availability effects.

Option 3 - Hybrid:
- preview-first path starts from gateway principal;
- optional backend comparison can be introduced later;
- mismatches treated as drift/degraded policy signal.

### 5.2 Recommendation for first adapter

For first Role/VIP adapter phase:
- trust gateway principal as primary runtime input;
- document drift risk against backend role persistence;
- ignore client `roleHints` / `statusHints` as truth;
- do not expose raw roles or conflict details in public preview;
- keep backend role comparison as future optional enhancement, not required for initial rollout.

## 6. Drift Policy

### 6.1 Drift scenarios

Representative drift cases:
- gateway says VIP, backend canonical role says non-VIP;
- gateway says non-VIP, backend says VIP;
- missing role in principal;
- role casing / whitespace legacy variants;
- conflicting multi-role arrays;
- future role naming changes across systems.

### 6.2 Preview policy under uncertainty

For preview:
- when trust is unclear, degrade to temporary/pending behavior;
- never expose raw role conflict to UI;
- never expose financial semantics;
- keep safe generic copy and existing state buckets.

### 6.3 Future enforcement policy

For any future enforcement phase (outside this slice):
- fail closed when role truth is unclear;
- stale role cache never grants enforcement;
- unclear trust source must not produce grant.

### 6.4 Role normalization rule

Normalization expectations:
- canonicalize role strings by trim + lowercase;
- map recognized canonical values only;
- unknown role strings map to safe unknown/temporary behavior, never direct grant.

## 7. Cache / Timeout / Degraded Policy

### 7.1 Initial policy defaults

- short TTL for principal-derived role preview;
- no persistent cache required for first phase;
- stale principal role does not imply enforcement grant;
- source timeout maps to temporary preview;
- source unavailable maps to temporary preview;
- malformed role source maps to temporary or unavailable based on confidence and policy.

### 7.2 Preview mapping constraints

Role/VIP adapter must map into existing preview states only:
- `available`;
- `requires_condition`;
- `checking_or_temporarily_unavailable`;
- `unavailable`;
- and existing non-rendered states where applicable (`not_enabled`, `ordinary_no_preview` by current system rules).

Mapping guardrails:
- degraded result never maps to `available`;
- unknown source never grants;
- batch and single use the same normalization and mapping rules.

## 8. Fixture Plan

Role/VIP adapter implementation must be blocked until fixture matrix is defined and accepted.

### 8.1 Fixture categories

1. Regular user:
- no VIP, no elevated role.

2. VIP user:
- `platformRole = vip_spacer` or `roles` contains `vip_spacer`.

3. Admin user:
- admin present;
- does not auto-imply VIP unless explicit policy mapping exists.

4. PRO user:
- pro present;
- does not auto-imply VIP unless explicit policy mapping exists.

5. Mixed roles:
- multiple roles with VIP present;
- multiple roles without VIP;
- casing/whitespace variants.

6. Missing role:
- absent `platformRole`;
- empty `roles`.

7. Drift scenario:
- gateway VIP / backend non-VIP;
- gateway non-VIP / backend VIP.

8. Source unavailable / timeout / malformed:
- backend role source unavailable;
- timeout;
- malformed payload.

### 8.2 Fixture fields per case

Each fixture row must define:
- trusted input (principal and optional backend comparison);
- expected normalized decision;
- expected reason code;
- expected preview state;
- expected observability bucket;
- leak-prevention assertions.

### 8.3 Minimum leak-prevention assertions

Every fixture must assert public DTO never exposes:
- raw role arrays;
- role conflict explanation;
- principal payload;
- internal source diagnostics;
- audit/internal ids not already allowed by safe preview contract;
- wallet/NFT/G2A/financial semantics.

## 9. Test Plan (pre-implementation contract tests)

Required tests before enabling Role/VIP adapter:
- feature flag off/on behavior;
- subject truth from gateway principal only;
- client role hints ignored;
- VIP role grants when VIP policy requires it;
- non-VIP maps safely to `requires_condition` or `unavailable` by policy;
- admin does not auto-grant VIP;
- PRO does not auto-grant VIP;
- role casing/whitespace normalization;
- missing role safe handling;
- drift safe handling;
- source unavailable -> temporary;
- timeout -> temporary;
- malformed role source safe handling;
- raw roles not exposed in public DTO;
- single vs batch consistency;
- observability bucket matches preview state;
- paid ordinary VIP claim gate remains unchanged;
- claim/redeem regression tests remain unchanged.

Test classes:
- adapter unit normalization tests;
- route-level preview tests (single and batch);
- leak-prevention snapshot tests;
- drift matrix tests;
- non-regression tests for RF paid ordinary VIP gate.

## 10. Rollout Flags and Criteria

### 10.1 Future rollout flags

Planned flags for future implementation phase:

```text
RF_ENABLE_ENTITLEMENT_REAL_ADAPTERS
RF_ENABLE_ENTITLEMENT_ROLE_ADAPTER
RF_ENABLE_ENTITLEMENT_VIP_ADAPTER
```

Existing preview flags remain as-is and are not changed by this slice.

### 10.2 Rollout sequence

1. Design approval (this slice).
2. Add contract types and fixtures only (still not wired).
3. Add adapter contract tests with fixtures.
4. Implement adapter behind default-off flags.
5. Staging-only activation.
6. Compare mock vs role/vip adapter outputs.
7. Enable for preview-only path.
8. Observe safe buckets and degraded distribution.
9. Roll back by disabling adapter flags.

Rule:
- no adapter flag enables enforcement.

### 10.3 Acceptance criteria

Adapter may be considered rollout-ready only when:
- all Role/VIP fixture tests pass;
- no DTO leakage is detected;
- single and batch consistency is proven;
- drift scenarios are safe;
- RF paid ordinary VIP gate remains behaviorally unchanged;
- preview remains informational-only.

## 11. Boundary Rules

Hard boundaries:
- Role/VIP adapter is read-only for preview;
- no claim payload changes;
- no claim/redeem logic changes;
- no voucher lifecycle changes;
- no UI behavior or copy changes;
- no observability bucket model change in this slice;
- no Wallet/NFT/G2A semantics in Role/VIP adapter output.

Public DTO must never include:
- raw roles;
- role hints;
- role conflicts;
- internal adapter diagnostics;
- source payload traces;
- financial or blockchain semantics.

## 12. What Remains Experimental

Still experimental after Slice 6.11:
- runtime role/vip adapter implementation;
- hybrid runtime comparison with backend role service;
- drift reconciliation automation;
- source-specific observability extensions;
- enforcement semantics for role/vip uncertainty;
- any cross-domain wallet/blockchain thresholds.

## 13. Risks

Main risks:
- principal/backend role drift not visible without explicit comparison path;
- accidental conflation of admin/pro with VIP semantics;
- legacy role string variants causing inconsistent mapping;
- adapter diagnostics leaking through future API expansion;
- preview advisory logic accidentally mixed with claim-runtime VIP gate.

Mitigations:
- explicit role normalization and conflict policy;
- fixture-driven tests before implementation;
- strict safe DTO boundary checks;
- keep rollout default-off and reversible;
- separate preview adapter work from claim enforcement workstreams.

## 14. Future Migration Path

Recommended next steps:
1. Approve Slice 6.11 SoT and drift policy.
2. Add design-only contract types for Role/VIP adapter inputs/outputs.
3. Encode fixture matrix in test assets.
4. Add contract tests (no runtime wiring yet).
5. Implement Role/VIP adapter behind default-off flags.
6. Validate staging outputs against mock baseline.
7. Roll out preview-only Role/VIP adapter gradually.
8. Proceed to next safe source from Slice 6.10 only after Role/VIP stability is confirmed.
