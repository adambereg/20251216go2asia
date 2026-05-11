# Points Spendability Staging Export Validation Evidence v1

## Status

Validation status: `blocked_manual_execution_required`

This document records the safe readiness check and manual execution plan for validating Points Spendability durable export in staging.

It does not approve production export, available-only enforcement, RF behavior changes, wallet response changes, ledger semantic changes, migrations, or new infrastructure.

## Validation Window

- Validation date/time: `2026-05-11T04:22Z` initial readiness check.
- Environment: `staging`.
- Target service: `points-service`.
- Target Worker from `apps/points-service/wrangler.toml`: `go2asia-points-service-staging`.
- Cloudflare Worker observed through read-only MCP listing: `go2asia-points-service-staging`.
- Worker id observed through read-only MCP listing: `c3be35b66ac647049f7c8116ad4c9b8c`.
- Worker last modified timestamp observed through read-only MCP listing: `2026-05-11T04:06:53.909123Z`.
- Local git SHA at readiness check: `3e15059`.
- Build/deploy version: not verified. Workers Builds API returned no build records for this Worker.

## Roles Used

- `ИИ-архитектор`
- `ИИ-бэкенд-разработчик`
- `ИИ-специалист по безопасности (SecOps)`
- `ИИ-тестировщик (QA-инженер)`
- `ИИ-технический писатель`
- `ИИ-DevOps инженер`

No dedicated observability/reliability role exists in `docs/ai/roles/`; `ИИ-DevOps инженер` is used for staging environment, configuration, and log-access review.

## Phase 0 Readiness Check

Readiness result: `blocked`.

What passed:

- Points Service staging Worker name is identifiable from `apps/points-service/wrangler.toml`.
- Cloudflare read-only MCP listing confirmed that `go2asia-points-service-staging` exists.
- Export contract and runbook are present:
  - `docs/architecture/domain/points_spendability_durable_observability_export_v1.md`
  - `docs/ops/points_spendability_export_consumer_runbook_v1.md`
- Runtime contains public `/health` and `/ready` handlers.
- Runtime contains internal diagnostics endpoint: `GET /internal/points/spendability-shadow/diagnostics`.
- Runtime emits structured export message: `Points spendability durable export`.

What blocked automatic execution:

- Local Wrangler is not authenticated.
- Non-interactive Wrangler calls require `CLOUDFLARE_API_TOKEN`, which is not present in the current shell.
- Cloudflare observability MCP authentication was skipped by the operator, so staging logs could not be queried safely from this session.
- Current staging flag values could not be read from a trusted source.
- Public gateway probes to `https://staging.api.go2asia.space/health` and `/ready` returned `503` from the remote fetch path; local `curl` could not resolve the host in this shell.

Working tree safety:

- Existing unrelated modified file not touched: `packages/db/migrations/0052_rf_partner_item_catalog_v1.sql`.
- Existing untracked file not part of this validation edit: `docs/ops/points_spendability_export_consumer_runbook_v1.md`.
- This evidence document is the only intended file for this validation slice.

## Phase 1 Safe Flag Plan

Do not change production flags.

Staging-only desired sequence:

1. Set `POINTS_ENABLE_SPENDABILITY_SHADOW_COMPARE=true`.
2. Set `POINTS_ENABLE_SPENDABILITY_SHADOW_DIAGNOSTICS=true`.
3. Set `POINTS_ENABLE_SPENDABILITY_DURABLE_EXPORT=true`.

Rollback values:

- `POINTS_ENABLE_SPENDABILITY_DURABLE_EXPORT=false` or unset.
- `POINTS_ENABLE_SPENDABILITY_SHADOW_DIAGNOSTICS=false` or unset if diagnostics must be stopped.
- `POINTS_ENABLE_SPENDABILITY_SHADOW_COMPARE=false` or unset as final rollback.

Current values:

- `POINTS_ENABLE_SPENDABILITY_SHADOW_COMPARE`: not verified.
- `POINTS_ENABLE_SPENDABILITY_SHADOW_DIAGNOSTICS`: not verified.
- `POINTS_ENABLE_SPENDABILITY_DURABLE_EXPORT`: not verified.

Manual enablement requirement:

- Open the Cloudflare dashboard account that owns `go2asia-points-service-staging`.
- Open Workers & Pages.
- Select Worker `go2asia-points-service-staging`.
- Change only staging Worker variables/secrets for the three flags above.
- Do not edit `go2asia-points-service`.
- Do not edit production routes, production variables, secrets unrelated to this validation, database bindings, service token secrets, or deployment code.

## Phase 2 Enable Staging Only

Automatic enablement result: not performed.

Reason:

- This session cannot safely read or write staging vars through Wrangler.
- Cloudflare observability authentication was not available for log verification.
- Without a verified rollback/log path, enabling export would violate the validation stop conditions.

Manual post-enable checks:

- Confirm Worker remains `go2asia-points-service-staging`.
- Confirm `ENVIRONMENT=staging`.
- Confirm production Worker `go2asia-points-service` flags remain unchanged.
- Run `/health` and `/ready` probes against the staging gateway and, if available, the direct staging Worker URL.

## Phase 3 Safe Staging Signal

Signal generation result: not performed.

Recommended safe signal options:

- Preferred: one known-safe staging RF paid voucher claim flow using a staging-only account and staging-only voucher data.
- Alternative: one existing internal staging smoke request to `POST /internal/points/spend` only if the operator has a valid service token and a pre-approved staging user/external id fixture.

Do not paste into chat:

- raw JWTs;
- service tokens;
- raw user ids;
- raw external ids;
- raw transaction ids;
- metadata;
- raw log records;
- payment/provider payloads.

Safe operator report after signal:

- request type used;
- whether response was success or expected denial;
- HTTP status class;
- whether RF UI/API behavior looked unchanged;
- time window for log search.

## Phase 4 Export Stream Verification

Export verification result: not performed.

Expected staging log filter:

```text
message = "Points spendability durable export"
```

Expected payload root:

```text
durableExport
```

Required safe fields:

- `schemaVersion = points_spendability_durable_export_v1`
- `diagnosticsVersion = points_spendability_shadow_diagnostics_v1`
- `service = points-service`
- `environment = staging`
- `eventType = points_spendability_shadow_compare` or `points_spendability_shadow_duplicate_suppressed`
- `driftClass` for compare events
- `reasonCode` for compare events
- `action`
- `amountRange`
- `legacyAllows`
- `targetAllows`
- `stale`
- `targetUnavailable`
- `compareFailure`
- `duplicateSuppressed`
- `evaluatedAt`
- `exportTimestamp`
- `sampled`
- `sampleRate`

Observed event count: not recorded.

Observed event types: not recorded.

Drift class summary: not recorded.

Amount range distribution: not recorded.

Action distribution: not recorded.

`target_error` count: not recorded.

`targetUnavailable` count: not recorded.

`stale` count: not recorded.

`duplicateSuppressed` count: not recorded.

## Phase 5 Payload Safety Check

Safety check result: not performed against real staging logs.

The export payload must not contain:

- raw JWT;
- service token;
- `userId`;
- `externalId`;
- `transactionId`;
- metadata;
- ledger rows;
- transaction lists;
- referral graph;
- payment/provider payloads;
- raw correlation id;
- raw dedupe key;
- email;
- raw roles.

Evidence bundle rule:

- Record only aggregate-safe summaries.
- Do not paste raw logs into this document.
- If any forbidden field is detected, disable `POINTS_ENABLE_SPENDABILITY_DURABLE_EXPORT` in staging immediately and treat the validation as failed.

## Phase 6 Regression Check

Regression check result: not performed.

Minimum manual checks after staging enablement:

- `/health` returns normal staging health.
- `/ready` does not regress from its pre-enable status.
- One safe staging RF paid claim or equivalent staging smoke path behaves as before.
- Wallet response shape remains unchanged where safely testable.
- No visible 5xx spike in staging probes.
- No unexpected auth errors.
- No obvious latency or error regression.
- Diagnostics/export failure counters do not spike if the diagnostics endpoint can be queried with a service token.

If direct internal spend testing is not safe, use only lightweight route probes and staging RF UI/API flow.

## Phase 7 Rollback Exercise

Rollback result: not performed.

Manual rollback exercise:

1. Disable only `POINTS_ENABLE_SPENDABILITY_DURABLE_EXPORT` in `go2asia-points-service-staging`.
2. Confirm `Points spendability durable export` events stop for a known safe signal window.
3. Keep compare and diagnostics enabled only if health and behavior remain normal.
4. Confirm staging health remains OK or unchanged from baseline.
5. Confirm no RF or wallet behavior regression.

Do not roll back by editing production Worker settings.

## Phase 8 Evidence Bundle Summary

Evidence status: incomplete.

Reason:

- Staging flags, export stream, payload safety, signal generation, regression checks, and rollback were not executable from this session without operator authentication and log access.

Current recommendation:

`No-Go` for future production export approval discussion until a real staging validation window is executed and this document is updated with aggregate-safe observations.

This `No-Go` is not a failure of the runtime implementation. It means production approval cannot be discussed from incomplete staging evidence.

## Stop Conditions

Keep or move validation to `rollback` if any of these occur:

- forbidden fields detected;
- export causes errors or latency;
- spend, RF, or wallet regression observed;
- `target_error` spike;
- `targetUnavailable` spike;
- schema or diagnostics version mismatch;
- production flags changed accidentally;
- logs cannot be safely verified;
- rollback path cannot be confirmed.

## Confirmation

- Staging only: yes, no automatic flag changes were performed.
- Production rollout: no.
- Available-only enforcement: no.
- RF behavior changes: no.
- Wallet response changes: no.
- Points ledger changes: no.
- Migrations: no.
- New infrastructure: no.
- Unrelated migration file touched: no.
