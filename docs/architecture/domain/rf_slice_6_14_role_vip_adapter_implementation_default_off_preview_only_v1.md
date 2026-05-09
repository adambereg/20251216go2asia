# RF Slice 6.14 - Role/VIP Adapter Implementation Behind Default-off Flags v1

## 1. Purpose

Slice 6.14 introduces the first runtime Role/VIP adapter implementation for the RF entitlement preview path.

The implementation is:
- preview-only;
- default-off;
- gated by server-side flags;
- RF-local;
- compatible with the existing safe preview DTO;
- not connected to claim enforcement.

This slice is the first controlled step from contract fixtures toward runtime adapter execution.

## 2. Non-goals

Not included:
- premium claim enforcement;
- claim blocking;
- claim/redeem runtime changes;
- production entitlement enforcement;
- DB migrations;
- generated SDK/OpenAPI edits;
- Wallet/NFT/G2A integration;
- Points runtime changes;
- new UI features;
- analytics platform;
- external telemetry integration;
- backend user role service lookup.

Not changed:
- claim payload;
- idempotency;
- repeatability;
- voucher lifecycle;
- paid ordinary voucher VIP gate;
- preview safe DTO shape;
- preview copy;
- badge behavior;
- observability bucket names;
- public route shape;
- SDK/OpenAPI.

## 3. Feature Flags

New server-side flags:

```text
RF_ENABLE_ENTITLEMENT_REAL_ADAPTERS
RF_ENABLE_ENTITLEMENT_ROLE_ADAPTER
RF_ENABLE_ENTITLEMENT_VIP_ADAPTER
```

Rules:
- all flags default off;
- existing `RF_ENABLE_ENTITLEMENT_PREVIEW_PROXY` still gates preview routes;
- adapter flags do nothing when preview proxy is off;
- per-source flags do nothing when `RF_ENABLE_ENTITLEMENT_REAL_ADAPTERS` is off;
- no adapter flag enables enforcement;
- no PWA flag is added.

## 4. Adapter Implementation Scope

Runtime adapter file:

```text
apps/rf-service/src/roleVipAdapter.ts
```

The adapter:
- implements the Role/VIP adapter interface from Slice 6.13;
- uses existing contract normalization from Slice 6.12;
- consumes trusted gateway principal input;
- performs no DB calls;
- performs no service calls;
- performs no external API calls;
- performs no claim/redeem calls.

The adapter supports:
- `role`;
- `vip_status`;
- timeout simulation for tests;
- source unavailable simulation for tests;
- drift semantics when backend snapshots are provided by test harnesses.

## 5. Preview-only Wiring

Adapter-aware evaluation is wired only into:

```text
POST /v1/rf/entitlement/preview
POST /v1/rf/entitlement/preview/batch
```

Not wired into:
- internal mock endpoint;
- claim route;
- redeem route;
- paid ordinary voucher spend path;
- any DB-backed voucher lifecycle path.

The internal admin mock endpoint remains a scenario harness.

## 6. Source Selection Rules

If all adapter flags are off:
- behavior remains mock scenario-driven.

If `RF_ENABLE_ENTITLEMENT_REAL_ADAPTERS` is off:
- per-source flags are ignored;
- behavior remains mock scenario-driven.

If `RF_ENABLE_ENTITLEMENT_REAL_ADAPTERS=true` and `RF_ENABLE_ENTITLEMENT_ROLE_ADAPTER=true`:
- source `role` uses Role/VIP adapter semantics.

If `RF_ENABLE_ENTITLEMENT_REAL_ADAPTERS=true` and `RF_ENABLE_ENTITLEMENT_VIP_ADAPTER=true`:
- source `vip_status` uses Role/VIP adapter semantics.

If only one source flag is enabled:
- only that source uses adapter semantics;
- other sources remain mock-backed.

All non-Role/VIP sources remain unchanged.

## 7. Mapping Alignment

Mapping alignment added:
- `insufficient_status` maps to `requires_condition`;
- degraded adapter output never maps to `available`;
- timeout maps to `checking_or_temporarily_unavailable`;
- source unavailable maps to `checking_or_temporarily_unavailable`;
- unknown/missing role maps safely to unavailable or temporary states through contract rules;
- no new preview states are introduced;
- no new badge states are introduced;
- no new observability buckets are introduced.

Public preview DTO remains unchanged.

## 8. Test Coverage

Tests cover:
- flags off -> mock fallback;
- umbrella off + per-source on -> mock fallback;
- umbrella on + source flags off -> mock fallback;
- role flag source selection;
- VIP flag source selection;
- regular user + `vip_status` -> `requires_condition`;
- admin + `vip_status` -> `requires_condition`;
- PRO + `vip_status` -> `requires_condition`;
- VIP user + `vip_status` -> `available`;
- source unavailable / timeout -> temporary preview;
- single/batch parity;
- safe DTO leak prevention;
- observability bucket parity;
- Role/VIP fixture replay through runtime adapter implementation.

Existing claim tests remain the source of truth for paid ordinary VIP gate behavior.

## 9. Observability Behavior

Observability remains unchanged.

Adapter-backed preview output is counted through the existing safe bucket model:
- preview bucket;
- degraded mode;
- surface;
- temporary/premium flags.

No new observability dimensions are added.

The snapshot does not expose:
- adapter id;
- raw roles;
- source diagnostics;
- subject payload;
- role conflict details.

## 10. Why Still Not Enforcement

Slice 6.14 is still not enforcement because:
- preview output remains informational;
- preview output keeps `claimBehaviorUnchanged: true`;
- claim routes do not call the Role/VIP adapter;
- redeem routes do not call the Role/VIP adapter;
- paid ordinary VIP gate remains unchanged;
- adapter flags do not enable claim blocking;
- no entitlement decision is used to mutate voucher state.

## 11. What Remains Experimental

Still experimental:
- backend role service comparison;
- hybrid drift reconciliation in runtime;
- production rollout beyond staging;
- source-specific metrics;
- adapter replacement for additional sources;
- future enforcement semantics.

## 12. Risks

Risks:
- preview Role/VIP semantics can differ from paid ordinary claim VIP gate for inconsistent `role` / `roles` input;
- adapter flags could be misunderstood as enforcement flags;
- `insufficient_status` mapping must remain aligned across future clients;
- mock and real adapter modes now intentionally differ for `vip_status`;
- backend role drift remains unverified without a real backend source.

Mitigations:
- keep flags default-off;
- keep preview copy informational;
- keep claim runtime untouched;
- keep safe DTO tests and leak tests;
- document mock-vs-contract differences explicitly;
- require staging validation before enabling adapter flags broadly.

## 13. Future Migration Path

Recommended next steps:
1. Validate Role/VIP adapter in staging with preview proxy enabled.
2. Compare adapter-backed preview buckets with mock-backed preview buckets.
3. Add backend role snapshot comparison only after a stable read contract exists.
4. Keep paid ordinary VIP claim gate unchanged until a separate enforcement design is approved.
5. Consider next source adapter only after Role/VIP adapter remains stable in preview-only mode.
