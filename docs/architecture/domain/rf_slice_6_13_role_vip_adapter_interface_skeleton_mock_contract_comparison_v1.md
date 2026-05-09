# RF Slice 6.13 - Role/VIP Adapter Interface Skeleton + Mock Contract Comparison v1

## 1. Purpose

Slice 6.13 adds a design-only Role/VIP adapter interface skeleton and test-only replay harness.

The goal is to prepare the future injection point for a Role/VIP adapter while proving that:
- fixture expectations can execute through an adapter-like interface;
- adapter output remains compatible with existing safe preview states;
- adapter output does not require new public DTO fields;
- adapter output does not require new badge states;
- adapter output does not require new observability buckets;
- current mock-vs-contract differences are documented as future adapter responsibilities.

This slice is still not runtime wiring.

## 2. Non-goals

Not included:
- runtime adapter wiring into routes;
- production source calls;
- DB reads or writes;
- claim enforcement;
- claim/redeem runtime changes;
- DB migrations;
- SDK/OpenAPI edits;
- Wallet/NFT/G2A integration;
- UI changes;
- analytics platform;
- external telemetry.

Not changed:
- claim payload;
- idempotency;
- repeatability;
- voucher lifecycle;
- preview safe DTO;
- preview copy;
- badge behavior;
- current preview routes;
- current observability bucket model;
- current feature flag matrix.

## 3. Interface Skeleton Scope

New RF-local module:

```text
apps/rf-service/src/roleVipAdapterInterface.ts
```

The module is:
- experimental;
- design-only;
- not imported by `routes/rf.ts`;
- not imported by claim runtime;
- not connected to DB;
- not connected to environment flags;
- not connected to production identity services.

It defines:
- `RoleVipAdapterInput`;
- `RoleVipAdapterOutput`;
- `RoleVipAdapterContext`;
- `RoleVipAdapterExecutionResult`;
- `RoleVipAdapterHealth`;
- `RoleVipAdapterSource`;
- `RoleVipAdapterError`;
- `RoleVipAdapter`;
- `RoleVipAdapterFixtureReplayResult`.

## 4. Test-only Harness

The harness is pure and fixture-backed.

Helpers:
- `createFixtureBackedRoleVipAdapter`;
- `executeRoleVipAdapterContract`;
- `runRoleVipFixtureThroughAdapter`;
- `compareRoleVipAdapterOutputToFixture`;
- `toRoleVipPreviewExpectation`;
- `toRoleVipObservabilityExpectation`;
- `assertRoleVipAdapterOutputCompatibility`.

Rules:
- no DB calls;
- no route calls;
- no env flags;
- no service calls;
- no production source reads;
- no claim/redeem behavior changes.

## 5. Fixture Replay Model

Every fixture from Slice 6.12 can be replayed through the adapter interface.

Replay input includes:
- source (`role` or `vip_status`);
- trusted principal-like input;
- optional backend comparison snapshot;
- execution context;
- timeout/source-unavailable test controls.

Replay output includes:
- normalized decision;
- normalized reason;
- degraded mode;
- preview expectation;
- observability expectation;
- safe public payload;
- informational-only and claim-unchanged markers.

## 6. Mock-vs-contract Comparison

Slice 6.13 compares:
- current mock entitlement behavior;
- desired Role/VIP contract fixture semantics.

Current mock behavior:
- scenario-driven;
- does not inspect real Role/VIP principal truth;
- can return `available` in `granted` scenario for `vip_status`;
- does not implement admin/pro/non-VIP distinction for VIP semantics;
- does not model backend role drift.

Contract behavior:
- derives Role/VIP outcome from trusted principal-like input and optional backend comparison;
- does not treat admin as VIP;
- does not treat PRO as VIP;
- degrades drift to temporary preview state;
- preserves safe preview and observability expectations.

## 7. Known Intentional Differences

Intentional current differences:
- regular user + `vip_status`: contract expects `requires_condition`, mock in `granted` scenario returns `available`;
- admin + `vip_status`: contract expects no automatic VIP grant, mock in `granted` scenario returns `available`;
- PRO + `vip_status`: contract expects no automatic VIP grant, mock in `granted` scenario returns `available`;
- drift fixtures: contract models gateway/backend comparison, mock has no backend comparison source;
- mock `role` source remains a generic harness source, not a real Role/VIP adapter.

These are not fixed in this slice. They are documented as future adapter responsibilities.

## 8. Compatibility Guards

Tests guard that adapter output:
- uses existing preview states only;
- uses existing observability buckets only;
- uses existing degraded modes only;
- does not require new badge states;
- does not require new public DTO fields;
- preserves `informationalOnly: true`;
- preserves `claimBehaviorUnchanged: true`;
- does not expose raw roles, diagnostics, subject payloads, wallet facts, NFT facts, G2A facts, or financial vocabulary.

## 9. Why Still Not Runtime Wiring

Slice 6.13 is not runtime wiring because:
- no preview route imports the adapter interface;
- no claim path imports the adapter interface;
- no production role source is called;
- no backend role service is queried;
- no feature flag behavior changes;
- no public DTO changes;
- no UI changes;
- current mock remains the active preview harness.

## 10. What Remains Experimental

Still experimental:
- real Role/VIP adapter implementation;
- real backend role comparison;
- drift reconciliation;
- adapter flag wiring;
- mock replacement strategy;
- production source observability;
- any future enforcement semantics.

## 11. Risks

Risks:
- interface skeleton can drift from future runtime implementation;
- mock-vs-contract gap can be misunderstood as a bug rather than intentional pre-wiring gap;
- `insufficient_status` must be handled consistently when real adapter output is connected;
- backend role comparison semantics remain fixture-only;
- future public UI could accidentally expose dynamic role-related copy if not filtered.

Mitigations:
- keep skeleton RF-local and experimental;
- keep comparison tests explicit about intentional differences;
- require fixture replay tests before adapter wiring;
- keep safe DTO and leak-prevention tests from Slice 6.9/6.12;
- do not connect adapter until mock-vs-contract gaps are intentionally closed.

## 12. Future Migration Path

Recommended next steps:
1. Review interface skeleton and replay harness.
2. Add adapter implementation behind default-off flags only after approval.
3. Close documented mock-vs-contract gaps intentionally.
4. Add real source comparison tests for backend role snapshot.
5. Run fixture replay against real adapter implementation.
6. Enable Role/VIP adapter in staging for preview-only path.
7. Keep claim enforcement in a separate future phase.
