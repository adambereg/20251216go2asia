# VIP Entitlement Runtime Authority — Durable Diagnostics Admin Snapshot Endpoint v1

Date: 2026-05-13  
Status: `IMPLEMENTED_INTERNAL_ADMIN_ONLY`  
Slice: `VIP Entitlement Runtime Authority / Slice 5B.3`  
Mode: runtime implementation, internal aggregate read path, no enforcement

## 1. Purpose

**TARGET:** This note records the Slice 5B.3 admin snapshot endpoint for the durable aggregate diagnostics sink.

**FACT:** The endpoint provides a safe read path for future staging evidence reruns after Slice 5B.2 introduced the durable aggregate sink.

**NON-GOAL:** This endpoint is not VIP Entitlement Authority and cannot authorize, deny, unlock, settle, spend, refund, bill, reward, mint, or enforce anything.

## 2. Endpoint

```text
GET /v1/rf/internal/entitlement/durable-diagnostics/window/:windowId/snapshot
```

**FACT:** The endpoint is implemented inside RF service internal routing.

**FACT:** It is internal/admin-only and requires an authenticated admin principal.

**FACT:** It is not added to public OpenAPI.

## 3. Feature Flag Behavior

**DECISION:** Slice 5B.3 uses read Option A.

**FACT:** The endpoint does not require `RF_ENABLE_ENTITLEMENT_DURABLE_DIAGNOSTICS=true`.

**RATIONALE:** Operators must be able to inspect closed evidence windows after write rollback, as long as the caller is authenticated as admin and the database is configured.

**FACT:** The write path remains controlled by the disabled-by-default durable diagnostics flags from Slice 5B.2.

**FACT:** Production is not enabled by this slice.

## 4. Response Shape

The response follows the aggregate-only shape from `vip_entitlement_durable_diagnostics_contract_schema_v1.md`:

```text
{
  "window": {
    "windowId": "safe-window-label",
    "environment": "staging",
    "service": "rf-service",
    "buildSha": "public-build-sha",
    "status": "collecting",
    "openedAt": "timestamp-or-null",
    "closedAt": "timestamp-or-null",
    "retentionUntil": "timestamp"
  },
  "summary": {
    "totalObservations": 0,
    "firstSeenAt": null,
    "lastSeenAt": null,
    "byCanonicalDriftClass": {},
    "byLegacyDriftClass": {},
    "byReasonCodeBucket": {},
    "bySourceBucket": {},
    "byAdapterStatusBucket": {},
    "bySourceTypeBucket": {},
    "bySourceAgeBucket": {},
    "bySourceLatencyBucket": {},
    "byDecisionVersion": {},
    "byAdapterVersion": {},
    "auditTracePresence": {
      "present": 0,
      "missing": 0
    },
    "failures": {
      "byFailureBucket": {},
      "totalFailures": 0
    }
  },
  "safety": {
    "aggregateOnly": true,
    "forbiddenFieldScanRequiredBeforeDocs": true
  }
}
```

## 5. Safety Guarantees

**FACT:** Reads are window-scoped by safe `windowId`.

**FACT:** Repository methods use aggregate queries only.

**FACT:** Missing windows return a safe `DURABLE_DIAGNOSTICS_WINDOW_NOT_FOUND` error.

**FACT:** Unsafe window ids return `DURABLE_DIAGNOSTICS_INVALID_WINDOW_ID`.

**FACT:** Internal read failures return `INTERNAL_ERROR` without SQL text, stack traces, raw database errors, secrets, request bodies, or response bodies.

**FORBIDDEN:** The response must not include raw rows, `lastObservation`, raw trace values, user ids, request ids, correlation ids, auth headers, service tokens, voucher ids, payment or transaction ids, wallet ledger rows, partner settlement data, G2A/NFT/Totem/on-chain proof fields, dedupe keys, idempotency keys, entitlement metadata, or raw exception messages.

## 6. Authority Boundary

```text
admin_snapshot_endpoint_status: implemented_internal_admin_only
durable_sink_runtime_status: implemented_behind_disabled_flag
runtime_authority_status: legacy_vip_spacer_still_authoritative
diagnostics_sink_authority_status: non_authoritative_observability_only
enforcement_status: not_enabled
production_status: not_touched
recommended_next_slice: slice_5b_4_staging_evidence_rerun
future_enforcement_slice_status: blocked_until_durable_evidence_rerun
```

## 7. Next Slice

**RECOMMENDED:** `Slice 5B.4 — Staging Evidence Rerun`.

**TARGET:** Open a controlled staging evidence window, enable only staging diagnostics writes, rerun the matrix, collect this admin snapshot, perform the forbidden-field scan, rollback, and classify the durable evidence bundle.
