# Points Spendability Durable Observability Export v1

## Scope

This slice adds a bounded durable observability export for Points Spendability Shadow Compare.

Included:

- default-off durable export flag;
- aggregate-safe structured export event;
- export through existing Worker logging path;
- export failure isolation from spend;
- replay/idempotency-safe export suppression;
- security tests for export payloads;
- closure documentation for rollout boundaries.

Not included:

- available-only enforcement;
- hard `lockedPoints` lock;
- Points spend authority switch;
- RF behavior changes;
- wallet response changes;
- referral unlock producer;
- network accrual producer;
- entitlement enforcement;
- migrations;
- new Cloudflare bindings or new infrastructure;
- G2A/NFT/Totem/on-chain logic;
- PRO rewards;
- payment integration;
- UI redesign.

## Export Target

Chosen target:

```text
structured console log via @go2asia/logger
```

Reason:

- Points Service already uses `@go2asia/logger` for Worker-compatible structured logs.
- No Analytics Engine, Durable Object aggregator, D1 table, queue, or telemetry binding is currently configured for Points Service.
- Adding a durable store would require new infrastructure and possibly migrations, which are non-goals for this slice.
- Cloudflare Workers logs can be consumed by existing log pipelines or Logpush-compatible processing without changing spend behavior.

Future durable sinks can consume the same safe event contract.

## Feature Flag

Added flag:

```text
POINTS_ENABLE_SPENDABILITY_DURABLE_EXPORT
```

Default:

- off;
- no export work;
- no response changes;
- no spend behavior changes.

When enabled together with shadow compare:

- emits a safe structured export event for a new shadow compare;
- suppresses duplicate compare-key exports;
- swallows export failures after recording a safe internal counter.

## Event Shape

Schema version:

```text
points_spendability_durable_export_v1
```

Compare event fields:

- `schemaVersion`;
- `diagnosticsVersion`;
- `service`;
- `environment`;
- `eventType`;
- `driftClass`;
- `reasonCode`;
- `action`;
- `amountRange`;
- `legacyAllows`;
- `targetAllows`;
- `stale`;
- `targetUnavailable`;
- `compareFailure`;
- `duplicateSuppressed`;
- `evaluatedAt`;
- `exportTimestamp`;
- `sampled`;
- `sampleRate`.

Duplicate-suppressed event fields are intentionally smaller and omit drift details.

Forbidden fields:

- `userId`;
- `externalId`;
- `transactionId`;
- raw metadata;
- raw ledger rows;
- transaction lists;
- JWT or service tokens;
- referral graph data;
- payment/provider payloads;
- raw correlation id;
- raw dedupe key.

## Failure And Latency Safety

Export is best-effort.

Rules:

- export is synchronous and tiny;
- no retry loop is introduced;
- export failure is caught inside the export helper;
- export failure increments `exportFailures`;
- export failure cannot alter `/internal/points/spend` response or mutation behavior.

No `waitUntil` path is added in this slice because the current Worker handler does not use a request context parameter and there is no existing async export sink.

## Replay And Idempotency

Existing idempotency semantics remain unchanged:

- idempotent replay exits before shadow compare;
- replay conflict exits before shadow compare;
- no replay branch emits a durable export event.

For non-replay duplicate compare attempts inside the same isolate:

- export uses an internal hashed compare key;
- raw key material is never exported;
- duplicate compare export emits only a safe duplicate-suppressed event;
- duplicate compare export does not emit full drift details again.

## Security Guarantees

Export payloads are aggregate-safe.

The implementation does not export:

- raw JWTs;
- service tokens;
- user ids;
- external ids;
- metadata;
- ledger rows;
- transaction lists;
- referral graph data;
- payment/source payloads;
- raw correlation ids;
- raw dedupe keys.

Tests assert that serialized export events and diagnostics snapshots do not contain forbidden fields.

## Validation

Added or updated tests cover:

- export flag off emits no durable export;
- export flag on emits safe structured compare event;
- `legacy_allowed_target_denied` exports as critical drift without user-level data;
- idempotent replay emits no export;
- export sink failure does not change spend response;
- duplicate export suppression omits full duplicate drift details;
- existing diagnostics endpoint remains safe.

Validated with:

```text
pnpm -C apps/points-service test
pnpm -C apps/points-service typecheck
pnpm -C apps/points-service lint
```

## Known Limits

- Structured logs are durable only through the platform log pipeline, not through a Points-owned analytics table.
- No Analytics Engine, Durable Object, D1, queue, or external telemetry binding is added.
- Export is per observation and not yet a rolled-up time-series store.
- In-memory diagnostics remain per Worker isolate.
- No available-only authority decision is introduced.

## Recommended Next Slice

Recommended next bounded slice:

**Points Spendability Export Consumer Runbook v1**

Goal: define how operations should consume the safe export stream, threshold `legacy_allowed_target_denied`, detect error/unavailable spikes, and decide whether a future available-only authority switch is ready.
