# RF Slice 6.12 - Role/VIP Adapter Contract Types + Fixture Matrix Tests v1

## 1. Purpose

Slice 6.12 turns the Slice 6.11 Role/VIP adapter design into executable contract artifacts.

This slice adds:
- RF-local contract types;
- deterministic fixture matrix;
- pure role normalization helpers;
- fixture-driven tests;
- drift handling tests;
- leak-prevention assertions;
- preview and observability regression guards.

This is still not runtime adapter implementation.

## 2. Non-goals

Not included:
- runtime adapter implementation;
- production source calls;
- claim enforcement;
- claim/redeem runtime changes;
- DB migrations;
- generated SDK/OpenAPI edits;
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
- observability bucket model;
- current preview routes.

## 3. Contract Type Scope

The contract module is RF-local:

```text
apps/rf-service/src/roleVipAdapterContracts.ts
```

It is intentionally:
- experimental;
- design-only;
- not wired into preview routes;
- not wired into claim runtime;
- not exported through SDK/OpenAPI;
- not shared outside RF service yet.

The module defines:
- `CanonicalRole`;
- `RoleVipSource`;
- `RoleVipNormalizedDecision`;
- `RoleVipNormalizedReason`;
- `RoleVipFixture`;
- `RoleVipFixtureExpectation`;
- `RoleVipDriftScenario`;
- `RoleVipTrustSource`;
- `RoleVipNormalizationResult`;
- `RoleVipPreviewExpectation`;
- `RoleVipObservabilityExpectation`.

## 4. Role Normalization Rules

Normalization rules:
- trim role strings;
- lowercase role strings;
- map only canonical values and approved aliases;
- unknown roles never grant;
- malformed values safe-fail;
- `admin` is not VIP;
- `pro` is not VIP unless a future policy explicitly changes this;
- multiple role arrays are deterministic and fixture-tested;
- client role hints remain untrusted for preview truth.

Canonical roles:

```text
spacer
vip_spacer
pro
admin
```

Recognized aliases:
- `vip`, `vip-spacer` -> `vip_spacer`;
- `user`, `member` -> `spacer`.

## 5. Fixture Matrix Structure

Fixture groups:
- `regular`;
- `vip`;
- `admin`;
- `pro`;
- `mixed_roles`;
- `missing_role`;
- `drift_gateway_vs_backend`;
- `source_unavailable`;
- `timeout`;
- `malformed_role`.

Each fixture defines:
- trusted principal-like input;
- optional backend comparison snapshot;
- normalized decision;
- normalized reason code;
- degraded expectation;
- drift expectation;
- preview state expectation;
- observability bucket expectation;
- leak-prevention expectations.

Fixtures are:
- deterministic;
- serializable;
- readable;
- reusable across tests.

## 6. Drift Semantics

Drift scenarios encoded:
- no drift;
- gateway VIP / backend non-VIP;
- gateway non-VIP / backend VIP;
- missing backend comparison;
- malformed backend comparison.

Rules:
- preview degrades to temporary state when drift is suspected;
- raw conflict details are not exposed;
- stale or malformed source data never maps to `available`;
- future enforcement remains fail-closed and outside this slice.

## 7. Preview Expectation Mapping

Role/VIP fixtures map to the existing preview state vocabulary:
- `available`;
- `requires_condition`;
- `checking_or_temporarily_unavailable`;
- `ordinary_no_preview`;
- `unavailable`;
- `not_enabled`.

Regression guards assert the state list stays stable.

Rendered badge states remain:
- `available`;
- `requires_condition`;
- `checking_or_temporarily_unavailable`;
- `unavailable`.

Hidden/non-rendered states remain:
- `not_enabled`;
- `ordinary_no_preview`.

## 8. Leak-prevention Rules

Public expectation payloads must not expose:
- raw roles;
- role hints;
- status hints;
- subject payload;
- principal payload;
- adapter diagnostics;
- raw facts;
- evaluated sources;
- partial results;
- audit trace ids;
- request window ids;
- wallet facts;
- NFT facts;
- G2A facts;
- tx / chain / balance / payout;
- reward / debit / compensation / recovery.

The fixture matrix stores leak-prevention expectations explicitly.

## 9. Regression Invariants

Slice 6.12 adds regression guards for:
- canonical role names;
- preview state names;
- rendered badge state names;
- observability bucket names;
- degraded mode names;
- single/batch expectation parity;
- safe preview DTO compatibility;
- no raw role leakage in public expectations.

These guards protect existing public semantics without changing runtime behavior.

## 10. Test Categories

Test file:

```text
apps/rf-service/test/role-vip-adapter.contract.test.ts
```

Covered categories:
- canonical role normalization;
- whitespace/casing handling;
- unknown role safe-fail;
- deterministic role array normalization;
- VIP semantics;
- admin does not auto-grant VIP;
- PRO does not auto-grant VIP;
- missing role safe behavior;
- drift handling;
- timeout/source unavailable/malformed handling;
- fixture matrix execution;
- leak prevention;
- single/batch parity;
- observability bucket parity;
- public enum regression guards.

## 11. What Remains Experimental

Still experimental:
- runtime Role/VIP adapter implementation;
- real backend role comparison;
- production source calls;
- hybrid drift reconciliation;
- adapter flag wiring;
- source-specific observability extensions;
- any future enforcement semantics.

## 12. Risks

Risks:
- contract helpers can drift from gateway/RF runtime role handling before wiring;
- backend comparison semantics are still fixture-only;
- admin/pro/VIP policy could change later and require explicit fixture update;
- future UI may accidentally render dynamic proxy copy without extra filtering;
- tests define desired adapter behavior, not production adapter behavior.

Mitigations:
- keep contracts RF-local and marked experimental;
- keep runtime wiring out of this slice;
- run contract tests before future implementation;
- require explicit policy update for admin/pro/VIP changes;
- preserve Slice 6.9 safe DTO and leak-prevention tests.

## 13. Future Migration Path

Recommended next steps:
1. Review and approve Role/VIP fixture matrix.
2. Add design-only adapter interface if needed, still not wired.
3. Add runtime adapter implementation behind default-off flags only after fixture approval.
4. Compare mock and contract fixture outputs in staging.
5. Enable Role/VIP adapter for preview-only path.
6. Observe safe buckets and drift/degraded distribution.
7. Keep enforcement in a separate future phase.
