# VIP Entitlement Runtime Authority — Durable Diagnostics Aggregate Sink Implementation v1

Date: 2026-05-13  
Status: `IMPLEMENTED_BEHIND_DISABLED_FLAG_STAGING_FIRST`  
Slice: `VIP Entitlement Runtime Authority / Slice 5B.2`  
Mode: runtime implementation behind disabled flag, aggregate-only observability, no enforcement

## 1. Purpose

**TARGET:** This note records the Slice 5B.2 implementation boundary for the durable aggregate diagnostics sink.

**FACT:** The implementation follows:

- `docs/architecture/domain/vip_entitlement_durable_diagnostics_sink_plan_v1.md`;
- `docs/architecture/domain/vip_entitlement_durable_diagnostics_contract_schema_v1.md`;
- `docs/architecture/domain/vip_entitlement_diagnostics_delta_investigation_v1.md`.

**FACT:** The durable sink is implemented behind disabled-by-default RF flags and remains observability-only.

## 2. Implemented Scope

**FACT:** Slice 5B.2 adds a PostgreSQL migration for:

```text
rf_entitlement_shadow_evidence_window
rf_entitlement_shadow_diagnostics_aggregate
rf_entitlement_shadow_diagnostics_failures
```

**FACT:** Slice 5B.2 adds an RF durable diagnostics module with:

- strict allow-list mapper from `VipEntitlementShadowObservation` to aggregate dimensions;
- evidence window lookup;
- aggregate upsert;
- aggregate-safe failure upsert;
- disabled-mode short-circuit;
- closed/invalid/version-mismatch failure semantics;
- `ExecutionContext.waitUntil()` scheduling for non-authoritative background writes.

**FACT:** Staging `wrangler.toml` pins durable diagnostics flags to disabled defaults.

## 3. Non-Authority Boundary

**NON-GOAL:** This sink is not VIP Entitlement Authority.

**NON-GOAL:** This sink is not a Points ledger, wallet system, referral system, settlement source, payment audit, tokenomics analytics source, or enforcement gate.

**NON-GOAL:** This sink cannot authorize or deny RF paid voucher claims.

**FACT:** Legacy `vip_spacer` remains runtime authority.

## 4. Behavior Boundary

**FACT:** RF claim behavior is unchanged.

**FACT:** Points spend behavior is unchanged.

**FACT:** Wallet behavior is unchanged.

**FACT:** Gateway/Auth/Connect behavior is unchanged.

**FACT:** Production is not enabled.

**TARGET:** If durable sink writes fail, RF claims proceed according to the existing legacy path. Failure recording is best-effort and aggregate-only.

## 5. Implemented Flags

```text
RF_ENABLE_ENTITLEMENT_DURABLE_DIAGNOSTICS=false
RF_ENTITLEMENT_DIAGNOSTICS_WINDOW_ID=
RF_ENTITLEMENT_DIAGNOSTICS_SINK_MODE=disabled
RF_ENTITLEMENT_DIAGNOSTICS_SAMPLE_MODE=scenario_only
```

**TARGET:** Future staging evidence runs may enable these only in staging after an evidence window row exists and rollback steps are prepared.

## 6. Remaining Blockers

**BLOCKER:** Durable evidence is not collected until a controlled staging evidence window is opened and the matrix is re-run.

**BLOCKER:** Enforcement remains blocked until durable evidence is collected, scanned, and reviewed.

**OPEN QUESTION:** Whether a future queue-to-diagnostics-worker layer is needed after direct aggregate DB write latency is measured.

## 7. Final Classification

```text
durable_sink_runtime_status: implemented_behind_disabled_flag
runtime_authority_status: legacy_vip_spacer_still_authoritative
diagnostics_sink_authority_status: non_authoritative_observability_only
enforcement_status: not_enabled
production_status: not_touched
recommended_next_slice: slice_5b_3_admin_snapshot_endpoint
future_enforcement_slice_status: blocked_until_durable_evidence_rerun
```
