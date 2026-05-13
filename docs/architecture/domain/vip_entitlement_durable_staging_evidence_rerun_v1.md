# VIP Entitlement Runtime Authority — Durable Staging Evidence Rerun v1

Date: 2026-05-13  
Status: `CLOSED_DURABLE_EVIDENCE_COLLECTED`  
Slice: `VIP Entitlement Runtime Authority / Slice 5B.4 Continue`  
Mode: live operational staging evidence rerun, durable aggregate diagnostics, no enforcement

## 1. Purpose

**TARGET:** Close Slice 5B.4 by re-running the staging matrix with the durable aggregate diagnostics sink and admin snapshot endpoint from Slice 5B.3.

**NON-GOAL:** This slice does not enable enforcement, does not change runtime authority, does not change production, and does not expand public API/OpenAPI.

## 2. Reviewed Sources

This run used the required sources:

- `docs/architecture/domain/vip_entitlement_durable_staging_evidence_rerun_v1.md`
- `docs/architecture/domain/vip_entitlement_durable_diagnostics_admin_snapshot_endpoint_v1.md`
- `docs/architecture/domain/vip_entitlement_durable_diagnostics_aggregate_sink_implementation_v1.md`
- `docs/architecture/domain/vip_entitlement_durable_diagnostics_contract_schema_v1.md`
- `docs/architecture/domain/vip_entitlement_durable_diagnostics_sink_plan_v1.md`
- `docs/architecture/domain/vip_entitlement_manual_staging_evidence_bundle_closure_retry_v1.md`
- `docs/architecture/domain/vip_entitlement_enforcement_preconditions_gate_v1.md`

## 3. Environment

```text
environment: staging
rf_worker: go2asia-rf-service-staging
points_worker: go2asia-points-service-staging
api_gateway_worker: go2asia-api-gateway-staging
rf_build_sha: 23acdda23708b78ec25590b25c509fb96ffe7ee3
production_targeted: false
```

## 4. Preflight

```text
.env.local loaded without secret output: passed
.env.cloudflare.local loaded without secret output: passed
clerk in-memory mint smoke: passed
rf /ready: 200 ready
points /ready: 200 ready
gateway /ready: 200 ready
migration_0057_status: present
endpoint_probe_path: /v1/rf/internal/entitlement/durable-diagnostics/window/safe-missing-window/snapshot
endpoint_probe_status: 404
endpoint_probe_code: DURABLE_DIAGNOSTICS_WINDOW_NOT_FOUND
```

**FACT:** The deployment mismatch blocker is removed; endpoint contract is available in staging.

## 5. Evidence Window

```text
window_id: vip-entitlement-5b4-20260513-1451
environment: staging
service: rf-service
build_sha: 23acdda23708b78ec25590b25c509fb96ffe7ee3
status_lifecycle: collecting -> closed
created_by: runtime_validation_agent
retention_until: now + 30 days
```

**NOTE:** An earlier continuation attempt created `vip-entitlement-5b4-20260513-1448` and ended as `rollback_pending` due VIP insufficient balance. Final closure was completed with the window above.

## 6. Flag States

### 6.1 Before matrix

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

### 6.2 During matrix (per case)

```text
RF_ENABLE_ENTITLEMENT_SHADOW_COMPARE=true
RF_ENABLE_ENTITLEMENT_SHADOW_DIAGNOSTICS=true
RF_ENTITLEMENT_SOURCE_READ_MODE=shadow_read_only
RF_ENABLE_ENTITLEMENT_DURABLE_DIAGNOSTICS=true
RF_ENTITLEMENT_DIAGNOSTICS_WINDOW_ID=vip-entitlement-5b4-20260513-1451
RF_ENTITLEMENT_DIAGNOSTICS_SINK_MODE=aggregate_db
RF_ENTITLEMENT_DIAGNOSTICS_SAMPLE_MODE=scenario_only
RF_ENTITLEMENT_SOURCE_READ_SCENARIO=<per case>
RF_ENTITLEMENT_SHADOW_SCENARIO=<per case>
```

### 6.3 After rollback

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

## 7. Matrix Results

| Case | Scenario | Expected class | RF behavior | Durable delta |
|---|---|---|---|---:|
| 1 | VIP + `role_mirror` | `aligned_granted` | passed (`201`, economy debited) | +1 |
| 2 | VIP + `deny` | `role_granted_entitlement_denied` | passed (`201`, economy debited) | +1 |
| 3 | non-VIP + `grant` | `role_denied_entitlement_granted` | passed (`409 RF_VIP_REQUIRED_FOR_PAID_VOUCHER`) | +1 |
| 4 | non-VIP + `role_mirror` | `aligned_denied` | passed (`409 RF_VIP_REQUIRED_FOR_PAID_VOUCHER`) | +1 |
| 5 | non-VIP + `stale` | `stale_entitlement` | passed (`409 RF_VIP_REQUIRED_FOR_PAID_VOUCHER`) | +1 |
| 6 | non-VIP + `degraded` | `degraded_runtime` | passed (`409 RF_VIP_REQUIRED_FOR_PAID_VOUCHER`) | +1 |
| 7 | non-VIP + `source_timeout` | `unavailable_entitlement` | passed (`409 RF_VIP_REQUIRED_FOR_PAID_VOUCHER`) | +1 |
| 8 | non-VIP + `source_unavailable` | `unavailable_entitlement` | passed (`409 RF_VIP_REQUIRED_FOR_PAID_VOUCHER`) | +1 |
| 9 | non-VIP + `unknown_source` | `unknown` | passed (`409 RF_VIP_REQUIRED_FOR_PAID_VOUCHER`) | +1 |

```text
matrix_cases_passed: 9
matrix_cases_blocked: 0
```

## 8. Durable Snapshot Summary (final)

```text
window_id: vip-entitlement-5b4-20260513-1451
total_observations: 9
byCanonicalDriftClass:
  aligned_granted: 1
  role_granted_entitlement_denied: 1
  role_denied_entitlement_granted: 1
  aligned_denied: 1
  stale_entitlement: 1
  degraded_runtime: 1
  unavailable_entitlement: 2
  unknown: 1
failures_total: 0
safety.aggregateOnly: true
```

## 9. Forbidden-Field Scan

Scan scope:

- final durable snapshot payload (sanitized aggregate-only representation);
- this evidence artifact.

```text
forbidden_field_scan_status: passed
admin_snapshot_scan_status: passed
worker_log_scan_status: not_performed
```

**FACT:** No secrets, tokens, auth headers, raw user identifiers, raw roles, voucher ids, transaction ids, wallet ledger rows, payment payloads, sourceRef, raw trace ids, dedupe/idempotency keys, SQL text, raw exception messages, or G2A/NFT/Totem/on-chain fields are included in this artifact.

## 10. Rollback Proof

```text
rollback_flags_applied: yes
rf_ready_after_rollback: 200 ready
closed_window_snapshot_readable_under_admin_auth: yes
window_status_final: closed
production_changes: none
enforcement_enabled: no
rf_points_correction_needed: no
```

## 11. Behavior Boundary

```text
rf_claim_behavior_changed: no
points_behavior_changed: no
wallet_behavior_changed: no
gateway_auth_connect_behavior_changed: no
public_api_openapi_changed: no
production_touched: no
enforcement_enabled: no
```

## 12. Final Governance Classification

```text
durable_staging_evidence_status: closed
drift_disposition_status: closed
enforcement_preconditions_status: partially_ready
future_enforcement_slice_status: allowed_for_review_only
recommended_next_slice: slice_5b_5_preconditions_gate_revalidation
```

**IMPORTANT:** `allowed_for_review_only` is not enforcement approval.

## 13. Final Report Fields (Slice 5B.4 Continue)

```text
endpoint_status: available (safe missing window -> DURABLE_DIAGNOSTICS_WINDOW_NOT_FOUND)
migration_status: present (0057)
window_id: vip-entitlement-5b4-20260513-1451
matrix_cases_passed: 9
matrix_cases_blocked: 0
durable_deltas_collected: yes (all expected canonical classes)
forbidden_field_scan_result: passed
rollback_result: verified
rf_claim_behavior_changed: no
points_behavior_changed: no
production_touched: no
enforcement_enabled: no
final_governance_classification: closed / partially_ready / allowed_for_review_only
recommended_next_slice: slice_5b_5_preconditions_gate_revalidation
```
