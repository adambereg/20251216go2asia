# Points Spendability Export Consumer Runbook v1

## 1. Purpose

This runbook explains how operators, backend engineers and architects should consume the Points Spendability durable export stream before any future available-only spend authority discussion.

It solves one operational problem: the team needs evidence about legacy materialized-balance spendability versus target available-only spendability across real traffic, without changing `/internal/points/spend` behavior.

This runbook does not enable enforcement, change spend authority, modify RF claim behavior, change wallet responses or introduce new infrastructure.

## 2. Current System State

- Points Spendability Shadow Compare runs inside Points Service.
- Durable export is emitted as structured logs via `@go2asia/logger`.
- Export is controlled by `POINTS_ENABLE_SPENDABILITY_DURABLE_EXPORT`.
- Export is default off.
- Export payloads are aggregate-safe and do not include user-level identifiers.
- Export does not change `/internal/points/spend` outcome, Points ledger writes, RF behavior or wallet response shape.
- Available-only enforcement is not active.

## 3. Relevant Flags

| Flag | Purpose | Default | Recommended environment | Dependency order | Safety notes |
| --- | --- | --- | --- | --- | --- |
| `POINTS_ENABLE_SPENDABILITY_SHADOW_COMPARE` | Runs legacy-vs-target spendability comparison in shadow mode. | Off | Staging first, production only after approval. | Enable before diagnostics/export. | Does not allow or deny spend. |
| `POINTS_ENABLE_SPENDABILITY_SHADOW_DIAGNOSTICS` | Records aggregate in-memory diagnostics and enables the internal diagnostics endpoint. | Off | Staging first. | Enable after shadow compare. | Service-auth internal diagnostics only. |
| `POINTS_ENABLE_SPENDABILITY_DURABLE_EXPORT` | Emits aggregate-safe structured log export events. | Off | Staging first. Production only after explicit approval. | Enable after shadow compare and diagnostics are validated. | Best-effort export only; failures must not affect spend. |

Export should only be enabled after shadow compare and diagnostics have been enabled and verified.

## 4. Safe Enablement Sequence

| Phase | Enable | Check | Stop conditions | Rollback |
| --- | --- | --- | --- | --- |
| Phase 0 - baseline off | No spendability flags. | Confirm current `/internal/points/spend`, RF claim and wallet behavior are normal. | Any unrelated spend/RF incident. | Keep all flags off. |
| Phase 1 - shadow compare only | `POINTS_ENABLE_SPENDABILITY_SHADOW_COMPARE=true`. | Confirm spend behavior and latency are unchanged. | Spend error rate or latency increases. | Disable shadow compare. |
| Phase 2 - internal diagnostics | Add `POINTS_ENABLE_SPENDABILITY_SHADOW_DIAGNOSTICS=true`. | Confirm internal diagnostics endpoint is service-auth only and aggregate-safe. | Diagnostics contain forbidden fields, endpoint auth fails, or spend behavior changes. | Disable diagnostics; keep compare only if safe. |
| Phase 3 - staging durable export | Add `POINTS_ENABLE_SPENDABILITY_DURABLE_EXPORT=true` in staging. | Confirm structured export events arrive and match schema. | Missing events during known spend traffic, unsafe fields, schema mismatch, or export volume spike. | Disable durable export. |
| Phase 4 - staging observation window | Keep all three flags on in staging. | Observe drift rates, errors, unavailable/stale counters and duplicate suppression. | Any sustained `target_error`, `target_unavailable`, unsafe field, or unexpected action. | Disable export, then diagnostics/compare if needed. |
| Phase 5 - production export approval | Enable export in production only after explicit approval. | Confirm production export matches staging schema and safe-field policy. | Any PII/token leak, spend regression, RF regression, export ingestion uncertainty. | Disable durable export immediately. |
| Phase 6 - evidence collection | Keep export on only while safe. | Build the evidence bundle in this runbook. | Evidence incomplete, unexplained drift, or version mismatch. | Do not discuss enforcement readiness; continue observation or rollback export. |

## 5. Export Event Shape

Durable export events are structured logs with the message `Points spendability durable export` and a `durableExport` object.

Expected fields:

| Field | Meaning |
| --- | --- |
| `schemaVersion` | Export schema version, currently `points_spendability_durable_export_v1`. |
| `diagnosticsVersion` | Diagnostics version, currently `points_spendability_shadow_diagnostics_v1`. |
| `service` | Producer service, `points-service`. |
| `environment` | Runtime environment, for example `staging` or `production`. |
| `eventType` | Export event type. |
| `driftClass` | Drift classification for compare events. |
| `reasonCode` | Safe reason code for the drift class. |
| `action` | Points action, currently expected to be `rf_voucher_claim_spend` for spend compare. |
| `amountRange` | Bucketed amount range, not raw private spend context. |
| `legacyAllows` | Whether legacy materialized-balance semantics would allow the spend. |
| `targetAllows` | Whether target available-only semantics would allow the spend. |
| `stale` | Whether the target decision was marked stale. |
| `targetUnavailable` | Whether target available-only value was unavailable. |
| `compareFailure` | Whether shadow compare failed. |
| `duplicateSuppressed` | Whether the event is a duplicate-suppressed export marker. |
| `evaluatedAt` | Shadow evaluation timestamp for compare events. |
| `exportTimestamp` | Export emission timestamp. |
| `sampled` | Sampling marker, currently `false`. |
| `sampleRate` | Sampling rate, currently `1`. |

Forbidden fields must never appear:

- raw JWT;
- service token;
- `userId`;
- `externalId`;
- `transactionId`;
- metadata;
- ledger rows;
- transaction lists;
- referral graph data;
- payment/provider payloads;
- raw correlation id;
- raw dedupe key.

No user-level reporting is allowed.

## 6. Drift Classes Interpretation

| Drift class | Interpretation | Operational priority |
| --- | --- | --- |
| `aligned_allowed` | Legacy and target both allow spend. | Normal signal. |
| `aligned_denied` | Legacy and target both deny spend. | Normal signal. |
| `legacy_allowed_target_denied` | Current runtime would allow spend, but target available-only policy would deny it. | Primary blocker metric for enforcement. |
| `legacy_denied_target_allowed` | Current runtime denies spend, but target available-only would allow it. | Investigate materialized-balance or projection inconsistency. |
| `target_unavailable` | Target available-only value could not be produced. | Reliability blocker. |
| `target_stale` | Target decision was explicitly stale. | Read-model freshness warning. |
| `target_error` | Shadow compare path failed. | Reliability blocker. |

`legacy_allowed_target_denied` is the main policy-risk metric. It can indicate that current runtime may be spending value that target available-only policy would not allow, such as locked or conditional value. It must be investigated before any enforcement discussion.

## 7. Key Metrics To Monitor

Monitor these metrics from the export stream and internal diagnostics:

- total exported events;
- `countedCompares`;
- `duplicateSuppressed`;
- `compareFailures`;
- `targetUnavailable`;
- `stale`;
- rate of `legacy_allowed_target_denied`;
- rate of `legacy_denied_target_allowed`;
- drift by `action`;
- drift by `amountRange`;
- drift by `environment`;
- `diagnosticsVersion` mismatch;
- `schemaVersion` mismatch;
- missing export during known spend traffic.

## 8. Suggested Thresholds

These are initial conservative defaults. They must be tuned after real traffic. Do not make automatic business decisions from these thresholds.

### Blocking

- Any sustained `target_error` spike.
- Any sustained `target_unavailable` spike.
- Any non-zero `legacy_allowed_target_denied` in production until evaluated.
- Any `diagnosticsVersion` or `schemaVersion` mismatch.
- Missing export during known spend traffic.
- Any unsafe field in export payloads.
- Any spend, RF claim or wallet regression during export rollout.

### Warning

- `duplicateSuppressed` unusually high compared with `countedCompares`.
- `stale` non-zero.
- High concentration in `5000_plus` amount range.
- Unexpected `action` values.
- Sudden drift-rate changes after deploy.

### Go-readiness Signals

- Stable export ingestion for the agreed observation window.
- Zero or fully explained `legacy_allowed_target_denied`.
- Zero `target_error` and `target_unavailable` over the observation window.
- No unsafe fields detected.
- No RF, spend or wallet regression reports.
- Consistent `schemaVersion` and `diagnosticsVersion`.
- Rollback path verified.

## 9. Stop Conditions

Immediately stop or roll back export if any of these occur:

- export causes latency or errors;
- `/internal/points/spend` error rate increases;
- RF claim/redeem errors increase;
- wallet response issues are reported;
- logs contain forbidden fields;
- export volume is unexpectedly high;
- `target_error` spike;
- `target_unavailable` spike;
- schema or diagnostics version mismatch;
- operator cannot verify safe ingestion;
- any evidence of PII, token, raw correlation or raw dedupe leakage.

## 10. Rollback Procedure

1. Disable `POINTS_ENABLE_SPENDABILITY_DURABLE_EXPORT`.
2. Confirm `Points spendability durable export` log events stop.
3. Keep shadow compare and diagnostics enabled only if they remain safe.
4. If needed, disable `POINTS_ENABLE_SPENDABILITY_SHADOW_DIAGNOSTICS`.
5. Last resort: disable `POINTS_ENABLE_SPENDABILITY_SHADOW_COMPARE`.
6. Verify `/internal/points/spend` success, replay conflict and insufficient-balance behavior are unchanged.
7. Verify RF paid claim behavior is unchanged.
8. Verify wallet API response shape is unchanged.
9. Record the rollback time, flags state, reason and evidence.

## 11. Evidence Bundle Before Enforcement Discussion

Before any future available-only authority switch discussion, collect an evidence bundle with:

- observation window date/time;
- environment;
- exact flags state;
- deploy version or git SHA;
- total exported events;
- `countedCompares`;
- drift class summary;
- aggregate-safe `legacy_allowed_target_denied` summary;
- amount range distribution;
- action distribution;
- environment distribution;
- `target_error` count;
- `targetUnavailable` count;
- `stale` count;
- `duplicateSuppressed` count;
- `schemaVersion`;
- `diagnosticsVersion`;
- confirmation that forbidden fields were absent;
- confirmation of no `/internal/points/spend` regression;
- confirmation of no RF claim/redeem regression;
- confirmation of no wallet response regression;
- rollback verification result;
- unresolved questions or anomalies.

Do not include raw user identifiers, external ids, transaction ids, metadata, raw logs with sensitive fields or payment/provider payloads in the evidence bundle.

## 12. Security / Privacy Requirements

Export logs are internal operational data. Access to the export pipeline must be limited to operators and engineers who need it for rollout readiness.

Never export or share:

- JWT;
- service token;
- user id;
- external id;
- transaction id;
- metadata;
- ledger rows;
- transaction lists;
- referral graph;
- payment/provider payloads;
- raw correlation id;
- raw dedupe key.

Do not paste raw logs into chats, tickets or issues unless they have been reviewed and confirmed safe. Prefer aggregate summaries and screenshots of dashboards that do not expose forbidden fields.

## 13. Troubleshooting

| Case | Likely cause | Safe response |
| --- | --- | --- |
| No events observed | Export flag off, compare flag off, no spend traffic, log pipeline delay or wrong environment. | Check flags, environment, deploy version and known spend traffic. Do not enable production export to debug staging ingestion. |
| Too many `duplicateSuppressed` | Client retries, repeated spend attempts with same compare identity, or export dedupe working under retry load. | Check retry rate and request completion logs. Do not treat duplicates as new drift. |
| `targetUnavailable` appears | Target available-only projection could not be produced. | Treat as reliability blocker. Check DB/read path health and shadow compare logs. |
| `target_error` appears | Shadow compare or export preparation failed. | Treat as reliability blocker. Verify spend behavior separately and inspect safe error summaries only. |
| Diagnostics version mismatch | Mixed deployments or consumer parsing old/new schema. | Pause enforcement discussion, align deploys and update consumer parsing. |
| Unexpected action value | New action reached export or parser is reading unrelated logs. | Verify `action` against Points Service allowed spend actions and log filters. |
| Export enabled but diagnostics disabled | Export can still emit safe point events, but internal counters may be unavailable. | Prefer enabling diagnostics first. For production, roll back export unless this state was explicitly approved. |
| Production export accidentally enabled | Flag enabled outside approval window. | Disable `POINTS_ENABLE_SPENDABILITY_DURABLE_EXPORT`, record time window, inspect safe payloads. |
| Forbidden field detected | Export or log pipeline included unsafe data. | Disable export immediately, restrict log access, preserve incident evidence safely, and review code before re-enabling. |

## 14. Non-Goals

This runbook does not cover:

- available-only enforcement;
- hard `lockedPoints` lock;
- Points spend authority switch;
- RF behavior changes;
- wallet response changes;
- new infrastructure;
- migrations;
- UI changes;
- referral unlock producer;
- network accrual producer;
- VIP entitlement enforcement.

## 15. Recommended Next Slice

Recommended next bounded slice:

**Points Spendability Staging Export Validation**

Goal: enable durable export in staging under explicit approval, collect the evidence bundle from real staging traffic, validate thresholds and stop conditions, and decide whether the system is ready for a separate enforcement-readiness review.
