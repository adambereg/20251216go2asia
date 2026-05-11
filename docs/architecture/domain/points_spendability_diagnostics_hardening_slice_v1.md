# Points Spendability Diagnostics Hardening Slice v1

## Scope

This slice hardens the operational diagnostics around Points Spendability Shadow Compare.

Included:

- structured aggregate diagnostics snapshot;
- diagnostics versioning;
- environment and amount-range aggregation;
- replay-safe duplicate suppression for repeated compare keys;
- clearer stale, unavailable and error counters;
- service-auth internal snapshot endpoint hardening;
- regression tests for diagnostics safety and spend behavior invariance.

Not included:

- available-only enforcement;
- hard `lockedPoints` lock;
- Points spend authority switch;
- RF claim/redeem behavior changes;
- wallet API response changes;
- referral unlock producer;
- network accrual producer;
- entitlement enforcement;
- migrations;
- G2A/NFT/Totem/on-chain logic;
- PRO rewards;
- payment integration;
- UI redesign.

## Runtime Behavior Preservation

The `/internal/points/spend` outcome remains controlled only by the existing legacy path.

Unchanged:

- materialized `user_balances.balance` guard;
- ledger insert semantics;
- balance update semantics;
- idempotent replay response;
- replay conflict response;
- insufficient balance response;
- RF compensation and recovery behavior;
- wallet projection response shape.

Diagnostics failures are isolated from spend execution. Shadow results cannot allow or deny spend.

## Diagnostics Model

Diagnostics remain aggregate-only and internal-only.

The snapshot now includes:

- `diagnosticsVersion`;
- `generatedAt`;
- `startedAt`;
- `total` / `countedCompares`;
- `duplicateSuppressed`;
- `compareFailures`;
- `targetUnavailable`;
- `stale`;
- `byDriftClass`;
- `byReasonCode`;
- `byAction`;
- `byAmountRange`;
- `byEnvironment`;
- `byDiagnosticsVersion`;
- `lastEvaluatedAt`;
- safe `lastObservation`.

The current diagnostics version is:

```text
points_spendability_shadow_diagnostics_v1
```

## Aggregation Model

Tracked drift classes:

- `aligned_allowed`;
- `aligned_denied`;
- `legacy_allowed_target_denied`;
- `legacy_denied_target_allowed`;
- `target_unavailable`;
- `target_stale`;
- `target_error`.

Tracked operational buckets:

- action;
- amount range;
- environment;
- reason code;
- diagnostics version.

No user-level reports are produced. No raw ledger rows or transaction lists are exposed.

## Replay And Idempotency Handling

The diagnostics recorder supports an internal dedupe key derived from spend identity inputs.

Rules:

- duplicate compare keys are suppressed;
- suppressed duplicates increment `duplicateSuppressed`;
- duplicate suppression does not increment drift counters;
- dedupe material is never returned in the diagnostics snapshot;
- idempotent replay branches in `/internal/points/spend` still return before shadow compare.

This prevents retries from inflating drift counts or creating fake divergence signals.

## Stale And Degraded Semantics

Operational meanings:

- `target_stale`: target decision was explicitly marked stale by the caller;
- `target_unavailable`: target available-only value could not be produced;
- `target_error`: shadow compare path failed and diagnostics recorded a compare failure.

Current runtime wiring records `target_error` only when the shadow read/compare block throws and diagnostics are enabled. No stale authority exists in this slice.

## Security Guarantees

The snapshot endpoint remains:

- service-auth only;
- default off;
- fail-closed when diagnostics are disabled;
- aggregate-only.

Forbidden in diagnostics:

- raw JWT;
- service tokens;
- user id;
- external id;
- transaction list;
- raw ledger dump;
- metadata;
- referral graph data;
- payment/provider payloads;
- internal dedupe key material.

Tests assert that serialized snapshots do not include forbidden fields.

## Validation

Added or updated tests cover:

- all drift classes counted correctly;
- grouping by action, amount range, environment and diagnostics version;
- duplicate compare suppression;
- diagnostics endpoint default-off behavior;
- safe diagnostics endpoint snapshot;
- idempotent spend replay not counted as a new compare;
- spend success and insufficient balance responses unchanged.

Validated with:

```text
pnpm -C apps/points-service test
pnpm -C apps/points-service typecheck
pnpm -C apps/points-service lint
```

## Known Limits

- Diagnostics are still in-memory and per Worker isolate.
- The endpoint is an operational snapshot, not durable analytics storage.
- `target_stale` is supported by the model but not wired to a production freshness source yet.
- No compensation mismatch candidate detection is added in this slice.
- No authoritative available-only decision is introduced.

## Recommended Next Slice

Recommended next bounded slice:

**Points Spendability Durable Observability Export v1**

Goal: export the same aggregate-safe diagnostics to durable observability without exposing user-level data, then use it to decide whether an available-only authority switch is ready.
