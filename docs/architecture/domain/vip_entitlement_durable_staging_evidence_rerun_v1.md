# VIP Entitlement Runtime Authority — Durable Staging Evidence Rerun v1

Date: 2026-05-13  
Status: `BLOCKED_STAGING_DEPLOY_GATE_ENDPOINT_NOT_AVAILABLE`  
Slice: `VIP Entitlement Runtime Authority / Slice 5B.4`  
Mode: operational staging evidence rerun attempt, durable aggregate diagnostics, no enforcement

## 1. Purpose

**TARGET:** This artifact records the Slice 5B.4 attempt to rerun the VIP entitlement staging validation matrix with the durable aggregate diagnostics sink and admin snapshot endpoint.

**NON-GOAL:** This slice does not enable entitlement enforcement, change runtime authority, change RF claim behavior, change Points spend behavior, change wallet behavior, change Connect/Gateway/Auth behavior, touch production, change public OpenAPI, enable referral unlock, network rewards, billing/subscription integration, tokenomics, G2A, NFT, Totem, or on-chain behavior.

## 2. Reviewed Sources

**FACT:** This run used the current AI Ops system, runtime roles, durable sink implementation docs, durable admin snapshot endpoint docs, durable diagnostics contract/schema, sink plan, evidence chain, RF runtime references, migration `0057`, and staging ops docs.

**FACT:** Multi-agent review was performed with Runtime Validation, Backend, Security/Fraud, QA, Runtime Governance, Economy, Technical Canon, Requirements, and Slice Strategy perspectives.

## 3. Exact Environment

```text
environment: staging
rf_worker: go2asia-rf-service-staging
points_worker: go2asia-points-service-staging
api_gateway_worker: go2asia-api-gateway-staging
rf_build_sha: 6449eff3b354fa428bc8ca2e23e51ca188620e2c
production_targeted: false
```

## 4. Preflight Result

| Check | Result | Evidence |
|---|---|---|
| Root `.env.local` loaded without printing secrets | passed | presence only |
| Root `.env.cloudflare.local` loaded without printing secrets | passed | presence only |
| Cloudflare account/token access | passed | staging Workers listed |
| Clerk helper token mint | passed | short-lived tokens minted in memory only |
| RF staging `/ready` | passed | `200 ready` |
| Points staging `/ready` | passed | `200 ready` |
| API Gateway staging `/ready` | passed | `200 ready` |
| Production targeting | passed | no production read/write/mutation |
| Migration `0057` | applied/present | staging DB now has durable diagnostics tables |
| Admin snapshot endpoint | blocked | deployed RF returned `RF_ROUTE_NOT_FOUND` |

## 5. Migration Status

**FACT:** Before this attempt, staging DB did not have `rf_entitlement_shadow_evidence_window`.

**FACT:** Migration `0057_rf_entitlement_shadow_diagnostics_v1.sql` was applied to staging DB from the repository SQL migration.

**FACT:** The local migration journal was updated with `0057_rf_entitlement_shadow_diagnostics_v1` so future standard DDL apply runs remain aligned.

**FACT:** Production DB was not targeted.

```text
migration_applied_to_staging: yes
production_db_touched: no
```

## 6. Admin Snapshot Endpoint Availability

Expected endpoint:

```text
GET /v1/rf/internal/entitlement/durable-diagnostics/window/:windowId/snapshot
```

Observed staging result:

```text
http_status: 404
safe_error_code: RF_ROUTE_NOT_FOUND
endpoint_status: not_available_in_deployed_rf_worker
```

**BLOCKER:** The deployed RF staging Worker still runs a build that does not include Slice 5B.3 route code.

## 7. Staging Deploy Attempt

**FACT:** A staging-only RF deploy was attempted with durable diagnostics write flags disabled by default.

Deploy command shape:

```text
wrangler deploy --env staging --config apps/rf-service/wrangler.toml
```

Safe inline vars used:

```text
ENVIRONMENT=staging
RF_ENABLE_PAID_VOUCHER_SPEND=true
POINTS_SERVICE_URL=https://go2asia-points-service-staging.fred89059599296.workers.dev
RF_ENABLE_ENTITLEMENT_DURABLE_DIAGNOSTICS=false
RF_ENTITLEMENT_DIAGNOSTICS_WINDOW_ID=
RF_ENTITLEMENT_DIAGNOSTICS_SINK_MODE=disabled
RF_ENTITLEMENT_DIAGNOSTICS_SAMPLE_MODE=scenario_only
```

Result:

```text
deploy_attempt_1: failed_fetch_after_upload
deploy_attempt_2: failed_fetch_after_upload
staging_route_after_attempts: RF_ROUTE_NOT_FOUND
```

**BLOCKER:** Wrangler upload reached bundle preparation/upload output, then failed with a network-level `fetch failed` before a published deployment was confirmed.

## 8. Evidence Window

**FACT:** No evidence window row was created for the matrix run.

Rationale:

- the admin snapshot endpoint was not available in deployed staging RF;
- creating a collection window before the read path exists would not close evidence;
- durable diagnostics writes were not enabled.

```text
window_id: not_created
window_status: not_started
```

## 9. Flag State

Final verified RF staging flag state after rollback patch:

```text
RF_ENABLE_ENTITLEMENT_SHADOW_COMPARE=false
RF_ENABLE_ENTITLEMENT_SHADOW_DIAGNOSTICS=false
RF_ENTITLEMENT_SOURCE_READ_MODE=disabled
RF_ENTITLEMENT_SOURCE_READ_SCENARIO=
RF_ENTITLEMENT_SHADOW_SCENARIO=
RF_ENABLE_ENTITLEMENT_DURABLE_DIAGNOSTICS=false
RF_ENTITLEMENT_DIAGNOSTICS_WINDOW_ID=
RF_ENTITLEMENT_DIAGNOSTICS_SINK_MODE=disabled
RF_ENTITLEMENT_DIAGNOSTICS_SAMPLE_MODE=scenario_only
```

**FACT:** No matrix `during` flag state was activated because the endpoint deploy gate failed before evidence collection.

## 10. Validation Matrix

| Case | Scenario | Actor class | Expected durable class | Result |
|---|---|---|---|---|
| 1 | `role_mirror` | VIP | `aligned_granted` | blocked_not_executed |
| 2 | `deny` | VIP | `role_granted_entitlement_denied` | blocked_not_executed |
| 3 | `grant` | non-VIP | `role_denied_entitlement_granted` | blocked_not_executed |
| 4 | `role_mirror` | non-VIP | `aligned_denied` | blocked_not_executed |
| 5 | `stale` | non-VIP preferred | `stale_entitlement` | blocked_not_executed |
| 6 | `degraded` | non-VIP preferred | `degraded_runtime` | blocked_not_executed |
| 7a | `source_timeout` | non-VIP preferred | `unavailable_entitlement` | blocked_not_executed |
| 7b | `source_unavailable` | non-VIP preferred | `unavailable_entitlement` | blocked_not_executed |
| 8 | `unknown_source` | non-VIP preferred | `unknown` | blocked_not_executed |

```text
matrix_cases_passed: 0
matrix_cases_blocked: 9
durable_deltas_collected: none
```

## 11. Durable Snapshot Summary

**FACT:** No final durable aggregate snapshot was collected because the deployed endpoint returned `RF_ROUTE_NOT_FOUND`.

```text
snapshot_status: not_collected
snapshot_blocker: admin_snapshot_endpoint_not_deployed_to_staging
```

## 12. Forbidden-Field Scan

Scan scope:

- this evidence artifact;
- sanitized preflight summary;
- sanitized deploy/rollback summary.

Result:

```text
forbidden_field_scan_status: passed_for_sanitized_artifact
admin_snapshot_scan_status: not_performed_endpoint_unavailable
worker_log_scan_status: not_performed
```

**FACT:** This artifact does not include secret values, auth material, raw identity values, emails, payment payloads, wallet ledger rows, transaction identifiers, voucher identifiers, external identifiers, raw request identifiers, raw audit trace identifiers, replay keys, partner settlement data, G2A/NFT/Totem/on-chain proofs, raw exception stacks, SQL text, or raw request/response bodies.

## 13. Rollback Proof

**FACT:** Rollback patch was executed through Cloudflare settings API after failed staging deploy attempts.

**FACT:** RF staging readiness after rollback:

```text
RF /ready: 200 ready
```

**FACT:** Durable write flags are disabled and the durable window id is empty.

**FACT:** Because enforcement was not enabled and matrix cases were not executed, no DB/voucher/Points correction was needed.

```text
rollback_result: verified_flags_disabled_ready_200
```

## 14. Behavior Boundary

```text
rf_claim_behavior_changed: no
points_behavior_changed: no
wallet_behavior_changed: no
gateway_auth_connect_behavior_changed: no
public_api_openapi_changed: no
production_touched: no
enforcement_enabled: no
```

## 15. Blockers

**BLOCKER:** RF staging deploy of Slice 5B.3/5B.4-ready code could not be confirmed because Wrangler failed with network-level `fetch failed`.

**BLOCKER:** The deployed RF staging Worker returned `RF_ROUTE_NOT_FOUND` for the durable admin snapshot endpoint.

**BLOCKER:** No evidence window was opened and no matrix cases were executed because the read path was unavailable.

**BLOCKER:** Durable deltas were not collected.

## 16. Final Governance Classification

```text
durable_staging_evidence_status: blocked
drift_disposition_status: not_closed
enforcement_preconditions_status: not_ready
future_enforcement_slice_status: blocked
recommended_next_slice: continue_slice_5b_4_evidence_closure
```

## 17. Allowed Next Slice

**ALLOWED:** Continue Slice 5B.4 evidence closure after RF staging successfully deploys the Slice 5B.3 admin snapshot endpoint.

Minimum next attempt:

1. Confirm RF staging route returns `DURABLE_DIAGNOSTICS_WINDOW_NOT_FOUND` for a safe missing window under admin auth.
2. Open a new staging evidence window.
3. Enable durable diagnostics flags only on RF staging.
4. Execute the matrix.
5. Collect durable aggregate snapshot.
6. Run forbidden-field scan.
7. Roll back and close or classify the window.

## 18. Forbidden Next Slice

**FORBIDDEN:** Enforcement, production rollout, runtime authority switch, public OpenAPI changes, Points spendability enforcement, referral/network/tokenomics/G2A/NFT/on-chain work, billing/subscription integration, or any authority decision based on this blocked evidence attempt.
