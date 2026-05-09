# RF Slice 6.15 - Role/VIP Adapter Staging Validation & Readiness Sweep v1

## 1. Purpose

Slice 6.15 validates the Role/VIP adapter introduced in Slice 6.14 for staging readiness.

This slice is a readiness sweep, not a product expansion. It checks that adapter-backed entitlement preview can be enabled, observed, compared with mock behavior, and rolled back without changing claim behavior.

## 2. Non-goals

Not included:
- claim enforcement;
- claim blocking;
- claim/redeem runtime changes;
- DB migrations;
- Wallet/NFT/G2A integration;
- Points runtime changes;
- new preview states;
- new badge states;
- new public DTO fields;
- SDK/OpenAPI edits;
- new UI features;
- analytics platform;
- production rollout beyond staging-ready preparation.

Still unchanged:
- claim payload;
- idempotency;
- repeatability;
- voucher lifecycle;
- paid ordinary voucher VIP gate;
- preview copy;
- safe DTO structure;
- observability bucket names;
- public route shape.

## 3. Validation Matrix

### Flags

| Case | Preview proxy | Real adapters | Role adapter | VIP adapter | Observability | Expected result |
| --- | --- | --- | --- | --- | --- | --- |
| Proxy off | off | any | any | any | any | authenticated request returns `RF_ENTITLEMENT_PREVIEW_PROXY_DISABLED`; no preview counters |
| Mock baseline | on | off | off | off | off | mock-backed preview; no counters |
| Mock observed | on | off | off | off | on | mock-backed preview counted in existing buckets |
| Umbrella off, VIP on | on | off | off | on | on/off | VIP source remains mock-backed |
| Umbrella on, sources off | on | on | off | off | on/off | all sources remain mock-backed |
| Role only | on | on | on | off | on/off | `role` source uses adapter; `vip_status` remains mock-backed |
| VIP only | on | on | off | on | on/off | `vip_status` source uses adapter; `role` remains mock-backed |
| Role + VIP | on | on | on | on | on/off | both Role/VIP sources use adapter |
| Rollback | on | on -> off | any -> off | any -> off | on/off | state returns to mock semantics immediately |

### User Types

| User type | Example signal | Adapter expectation | Mock expectation | Staging note |
| --- | --- | --- | --- | --- |
| Regular | `spacer` | `vip_status` -> `requires_condition` | often `available` in granted scenario | intentional divergence |
| VIP | `vip_spacer` | `available` | `available` | aligned |
| Admin | `admin` | `requires_condition` for `vip_status` | often `available` | intentional divergence; admin is not VIP |
| PRO | `pro` | `requires_condition` for `vip_status` | often `available` | intentional divergence; PRO is not VIP |
| Mixed roles with VIP | `spacer` + `VIP` | `available` | `available` | verify gateway normalization policy manually |
| Mixed roles without VIP | `admin`, `pro` | `requires_condition` | often `available` | intentional divergence |
| Missing roles | no canonical role | `unavailable` | often `available` | intentional safe-fail divergence |
| Malformed roles | non-canonical role payload | `unavailable` or temporary when backend malformed | often `available` | intentional safe-fail divergence |

### Preview Surfaces

| Surface | Expected validation |
| --- | --- |
| Single preview | same state/bucket as equivalent batch item |
| Batch preview | same per-item state/bucket as single preview; invalid items remain filtered by existing contract |
| Catalog badge | no new badge states; copy remains informational |
| Listing badge | no new badge states; `listing` surface counted safely |

### Degraded Scenarios

| Scenario | Expected preview state | Expected degraded mode | Expected observability bucket | Exposure rule |
| --- | --- | --- | --- | --- |
| Timeout | `checking_or_temporarily_unavailable` | `timeout_fallback` | `checking_or_temporarily_unavailable` | no adapter diagnostics |
| Source unavailable | `checking_or_temporarily_unavailable` | `source_unavailable` | `checking_or_temporarily_unavailable` | no adapter diagnostics |
| Malformed gateway role | `unavailable` | `policy_fallback` | `unavailable` | no raw role payload |
| Gateway VIP vs backend non-VIP | `checking_or_temporarily_unavailable` | `stale_cache` | `checking_or_temporarily_unavailable` | no conflict details |
| Gateway non-VIP vs backend VIP | `checking_or_temporarily_unavailable` | `stale_cache` | `checking_or_temporarily_unavailable` | no conflict details |
| Malformed backend snapshot | `checking_or_temporarily_unavailable` | `policy_fallback` | `checking_or_temporarily_unavailable` | no backend diagnostics |
| Missing backend snapshot | gateway-only semantics | `none` unless source failure | state follows gateway principal | document as preview-only |
| Stale-like backend behavior | `checking_or_temporarily_unavailable` | `stale_cache` | `checking_or_temporarily_unavailable` | no stale source detail |

## 4. Adapter-vs-mock Comparison

The comparison sweep classifies each case as:
- `aligned`: mock and adapter produce the same safe preview state;
- `intentionally_different`: adapter closes a known mock gap;
- `unexpected_divergence`: test failure.

Known intentional differences:
- regular + `vip_status`: mock may return `available`; adapter returns `requires_condition`;
- admin + `vip_status`: mock may return `available`; adapter returns `requires_condition`;
- PRO + `vip_status`: mock may return `available`; adapter returns `requires_condition`;
- mixed roles without VIP + `vip_status`: mock may return `available`; adapter returns `requires_condition`;
- missing/malformed role: mock may return `available`; adapter safe-fails to `unavailable`.

Aligned cases:
- VIP + `vip_status`;
- role source for canonical regular role;
- timeout;
- source unavailable;
- mixed roles with VIP.

## 5. Drift Validation

Drift is currently validated through the Role/VIP contract and adapter fixture replay, not through a real backend role lookup.

Covered simulations:
- gateway VIP vs backend non-VIP;
- gateway non-VIP vs backend VIP;
- malformed backend snapshot;
- missing backend snapshot;
- inconsistent role arrays;
- legacy aliases (`vip`, `VIP`, `vip-spacer`, `vip_spacer`);
- malformed/missing gateway role.

Expected behavior:
- drift does not grant access;
- drift maps to temporary preview;
- drift is counted in existing degraded buckets;
- safe DTO and observability do not expose raw roles, backend payloads, adapter ids, or conflict details.

## 6. Observability Readiness

Observability remains unchanged and uses existing in-memory counters:
- preview request totals;
- batch request totals;
- item totals;
- bucket totals;
- degraded totals;
- surface totals;
- batch-size totals.

Readiness checks:
- adapter-backed preview is counted in existing buckets;
- mock fallback is counted in existing buckets;
- no new bucket names are introduced;
- adapter diagnostics do not leak;
- role payloads do not leak;
- temporary/degraded counts stay consistent;
- single and batch observations are equivalent for equivalent items.

Known limitation:
- counters are in-memory per process/isolate and are suitable for staging smoke validation, not production analytics.

## 7. Fallback/Rollback Behavior

Rollback must be immediate and flag-only:
1. Disable `RF_ENABLE_ENTITLEMENT_VIP_ADAPTER` and/or `RF_ENABLE_ENTITLEMENT_ROLE_ADAPTER`.
2. If needed, disable `RF_ENABLE_ENTITLEMENT_REAL_ADAPTERS`.
3. Keep `RF_ENABLE_ENTITLEMENT_PREVIEW_PROXY` on if mock preview should remain visible.
4. Disable `RF_ENABLE_ENTITLEMENT_PREVIEW_PROXY` only for full preview shutdown.

Validated behavior:
- adapter flags off -> mock fallback;
- umbrella off overrides source flags;
- preview proxy off overrides all adapter flags;
- partial adapter enablement affects only the enabled source;
- adapter execution errors fail closed to temporary preview;
- preview remains `informationalOnly` and `claimBehaviorUnchanged`.

## 8. Preview UX Safety

UX safety rules:
- no new preview states;
- no new badge states;
- preview copy remains safe and non-blocking;
- `informationalOnly` remains `true`;
- `claimBehaviorUnchanged` remains `true`;
- no “VIP granted” language is introduced;
- degraded states remain temporary/unavailable;
- ordinary resources remain outside premium preview.

Manual staging checks should inspect browser Network payloads for absence of:
- `subject`;
- `roleHints`;
- raw roles;
- adapter id;
- evaluated sources;
- backend diagnostics;
- wallet/NFT/G2A/financial vocabulary.

## 9. Operational Checklist

### Safe Enablement Order

1. Confirm current deployment has Slice 6.14+ code.
2. Enable `RF_ENABLE_ENTITLEMENT_PREVIEW_PROXY=true`.
3. Enable `RF_ENABLE_ENTITLEMENT_PREVIEW_OBSERVABILITY=true`.
4. Capture mock baseline buckets for regular, VIP, admin, PRO, catalog, and listing surfaces.
5. Enable `RF_ENABLE_ENTITLEMENT_REAL_ADAPTERS=true`.
6. Enable `RF_ENABLE_ENTITLEMENT_VIP_ADAPTER=true` for VIP staging validation.
7. Enable `RF_ENABLE_ENTITLEMENT_ROLE_ADAPTER=true` only after VIP validation passes.
8. Compare bucket changes against expected adapter-vs-mock differences.

### Staging Validation Sequence

1. Regular user + `vip_status` single preview -> `requires_condition`.
2. VIP user + `vip_status` single preview -> `available`.
3. Admin user + `vip_status` -> `requires_condition`.
4. PRO user + `vip_status` -> `requires_condition`.
5. Equivalent batch request -> same per-item states.
6. Catalog badge -> no unsafe copy and no claim blocking.
7. Listing badge -> no unsafe copy and correct `listing` observability surface.
8. Timeout/source unavailable simulation -> temporary preview.
9. Disable VIP adapter -> mock behavior returns.
10. Disable preview proxy -> route returns disabled response and counters do not increase.

### Observability Checks

Expected staging distribution after VIP adapter enablement:
- `requires_condition` increases for regular/admin/PRO VIP-status previews;
- `available` remains for true VIP;
- temporary bucket increases only for degraded simulations;
- `ordinary_no_preview` remains for ordinary resources;
- no new bucket names appear.

Monitor:
- sudden spike in temporary bucket;
- unexpected unavailable bucket growth;
- mismatch between single and batch states;
- any unsafe fields in response payloads;
- claim route errors changing while only preview flags were modified.

Immediate rollback indicators:
- claim/redeem behavior changes;
- paid ordinary VIP gate behavior changes;
- unsafe DTO fields appear;
- adapter-backed preview throws 500;
- batch and single preview disagree;
- new preview or observability bucket names appear.

## 10. What Remains Experimental

Still experimental:
- real backend role snapshot lookup;
- runtime drift reconciliation using a backend SoT;
- production rollout policy;
- source-specific observability dimensions;
- enforcement usage of adapter output;
- Wallet/NFT/G2A adapters;
- UI copy changes.

## 11. Risks

Primary risks:
- real gateway JWTs may encode `role` and `roles` differently than fixtures;
- preview VIP semantics may differ from paid ordinary VIP gate for mixed/alias roles;
- source flags can be enabled without umbrella and silently remain mock-backed;
- in-memory observability can mislead if treated as production analytics;
- drift is simulated, not validated against a live backend source.

Mitigations:
- keep adapter flags default-off;
- validate gateway JWT forms manually on staging;
- keep preview informational;
- keep rollback flag-only;
- use comparison tests to bound intentional divergences;
- keep claim tests as the paid gate source of truth.

## 12. Future Migration Path

Recommended path:
1. Run Slice 6.15 staging validation with mock baseline and adapter mode.
2. Document real gateway role forms from staging.
3. Decide whether preview and paid ordinary VIP gate should share a normalization helper.
4. Add backend role snapshot read only after a stable source contract exists.
5. Keep enforcement out of scope until a separate enforcement design and rollout plan are approved.
