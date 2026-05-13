# VIP Entitlement Runtime Authority — Diagnostics Delta Investigation v1

Date: 2026-05-13  
Status: `DIAGNOSTICS_GAP_EXPLAINED_LOG_EVIDENCE_NOT_CLOSED`  
Slice: `VIP Entitlement Runtime Authority / Slice 5A Retry`  
Mode: operational evidence investigation, observability closure attempt, no enforcement

## 1. Purpose

**TARGET:** This note investigates why the Slice 5A structured staging matrix preserved legacy RF behavior but did not produce complete per-case RF diagnostics deltas.

It answers:

- where RF entitlement shadow diagnostics counters live;
- when counters increment;
- whether counters are durable evidence;
- whether routing or Worker isolate behavior can explain missing deltas;
- whether Cloudflare observability was available for aggregate-safe log evidence;
- whether the evidence bundle can move to `allowed_for_review_only`.

**NON-GOAL:** This note does not change runtime logic, RF claim behavior, Points behavior, Gateway/Auth behavior, public APIs, migrations, production, or entitlement enforcement.

## 2. Current Evidence Gap

**FACT:** The previous structured Slice 5A runner executed all 9 staging matrix cases and preserved the expected legacy behavior invariant.

**FACT:** The RF admin diagnostics endpoint returned `200` during the matrix and `404` after rollback once diagnostics were disabled.

**FACT:** Per-case diagnostics deltas were incomplete:

```text
aligned_granted: 0 observed delta
aligned_denied: 0 observed delta
role_granted_entitlement_denied: 0 observed delta
role_denied_entitlement_granted: 0 observed delta
stale_entitlement: 0 observed delta
unavailable_entitlement: 0 observed delta
degraded_runtime: 1 observed delta
unknown: 0 observed delta
```

**BLOCKER:** Behavior evidence exists, but complete diagnostics/log evidence for all canonical drift classes does not.

## 3. Diagnostics Implementation Findings

**FACT:** RF entitlement shadow diagnostics counters are module-level in-memory state in `apps/rf-service/src/vipEntitlementShadow.ts`.

**FACT:** The snapshot object is initialized in process memory and copied by `getVipEntitlementShadowSnapshot()`. It is not persisted to PostgreSQL, KV, Durable Objects, Queues, R2, or any other durable store.

**FACT:** Counter increments happen only through `recordVipEntitlementShadowObservation()`.

**FACT:** `recordVipEntitlementShadowObservation()` increments:

- total observations;
- stale/degraded counters;
- legacy drift class counts;
- canonical drift class counts;
- safe reason/source counters;
- source-read aggregate counters;
- audit-trace presence counters.

**FACT:** The diagnostics endpoint reads the same module-level snapshot available inside the Worker isolate handling that diagnostics request.

**BLOCKER:** Because the snapshot is process-local memory, the endpoint cannot be treated as durable or globally complete staging evidence.

## 4. Claim Path Findings

**FACT:** RF creates the entitlement shadow runtime only when `RF_ENABLE_ENTITLEMENT_SHADOW_COMPARE` is enabled.

**FACT:** Diagnostics counters are recorded only when `RF_ENABLE_ENTITLEMENT_SHADOW_DIAGNOSTICS` is enabled.

**FACT:** Source-read evidence is added only when `RF_ENTITLEMENT_SOURCE_READ_MODE=shadow_read_only`.

**FACT:** The paid claim path calls the shadow recorder only for paid offers where paid spend is enabled:

```text
pointsCostSnapshot > 0
and
RF paid spend economy runtime enabled
```

**FACT:** The shadow recorder is called before the legacy VIP role gate returns `RF_VIP_REQUIRED_FOR_PAID_VOUCHER`.

**FACT:** This means non-VIP denied paid-claim cases can record diagnostics before the legacy deny response, as long as the offer is paid and the shadow/diagnostics flags are enabled.

**FACT:** Local tests cover these paths and prove that counters increment in a single in-process test worker:

- non-VIP adapter grant increments `role_denied_entitlement_granted`;
- VIP adapter deny increments `role_granted_entitlement_denied`;
- source timeout increments `unavailable_entitlement`;
- diagnostics payload passes the safe-field assertion.

**OPEN QUESTION:** Whether the specific staging offer and repeated claim/redeem state caused any case to short-circuit before the paid claim shadow recorder. This is possible for cases that do not reach the paid/economy branch, but it does not fully explain why only one scenario produced a source-read delta.

## 5. Routing And Isolate Findings

**FACT:** The diagnostics snapshot is process-local to the active Worker isolate.

**FACT:** Cloudflare Workers may serve sequential requests through different isolates or a restarted isolate.

**FACT:** Claim requests and diagnostics requests can therefore hit the same deployed Worker service but not the same in-memory snapshot.

**FACT:** The observed staging pattern is consistent with process-local memory evidence:

- local single-process tests increment counters deterministically;
- staging behavior requests succeed or deny as expected;
- diagnostics endpoint is reachable;
- only one scenario shows an observed delta;
- after rollback and propagation, diagnostics returns `404` as expected.

**BLOCKER:** The endpoint is useful as a best-effort health and shape check, but it is not acceptable as the sole durable drift evidence source for a multi-request staging matrix.

## 6. Flag Propagation Findings

**FACT:** RF staging flags were changed through the Cloudflare API only for `go2asia-rf-service-staging`.

**FACT:** The last runner waited briefly after each settings patch and then executed the case.

**FACT:** The successful `degraded_runtime` delta proves at least one case observed active `shadow_read_only` source-read behavior.

**OPEN QUESTION:** Cloudflare settings propagation delay could still contribute to missing deltas for some cases. A safer operator run should verify the active scenario after patch by using either:

- an aggregate-safe config probe, if one is introduced in a future implementation slice; or
- Cloudflare log evidence that shows the scenario label without sensitive request, identity, or commerce data.

**NON-GOAL:** This investigation does not add a config probe or change runtime logging.

## 7. Logs And Observability Findings

**FACT:** The Cloudflare Observability MCP could list the Cloudflare account and staging Workers.

**FACT:** The available observability query descriptors require an argumented query object.

**BLOCKER:** In this Cursor session, the MCP tool invocation surface available to the agent did not expose a way to pass that required query object into `query_worker_observability`, `observability_keys`, or `observability_values`.

**BLOCKER:** Therefore, Cloudflare Worker logs/observability could not be queried or scanned for aggregate-safe drift evidence in this session.

**TARGET:** Operator-run log evidence should collect only aggregate-safe labels:

- event counts;
- safe route/status categories;
- safe canonical drift class labels;
- safe adapter status labels;
- safe reason code categories;
- no raw request headers, auth material, identity values, voucher/economy operation values, request trace values, replay keys, commerce payloads, wallet rows, internal source pointers, or tokenized proof data.

## 8. Optional Re-Run Result

**FACT:** No additional staging matrix re-run was executed in this investigation note.

**Rationale:** The code-level cause explains the evidence gap: process-local diagnostics counters cannot provide durable cross-request proof. Re-running the same endpoint-based matrix would risk additional staging writes without producing reliable closure.

**TARGET:** A future controlled re-run should prefer one of:

- Cloudflare log/observability aggregate evidence; or
- a future implementation slice that persists shadow diagnostics into an approved aggregate-safe sink.

## 9. Drift Evidence Classification

| Canonical drift class | Behavior observed? | Diagnostics observed? | Log evidence observed? | Acceptable evidence? | Blocker remains? |
|---|---:|---:|---:|---:|---:|
| `aligned_granted` | yes | no | no | no | yes |
| `aligned_denied` | yes | no | no | no | yes |
| `role_granted_entitlement_denied` | yes | no | no | no | yes |
| `role_denied_entitlement_granted` | yes | no | no | no | yes |
| `stale_entitlement` | yes | no | no | no | yes |
| `unavailable_entitlement` | yes | no | no | no | yes |
| `degraded_runtime` | yes | yes | no | partial only | yes |
| `unknown` | yes | no | no | no | yes |

**FACT:** Behavior evidence is materially stronger after the structured matrix run.

**BLOCKER:** Drift evidence classification remains blocked because diagnostics/log evidence is incomplete for seven of eight canonical classes.

## 10. Forbidden-Field Scan Result

**FACT:** This investigation note contains only aggregate counts, safe status labels, safe reason codes, safe canonical drift class labels, and redacted explanations.

**FACT:** No secrets, auth material, raw identity values, contact values, voucher/economy operation values, request trace values, replay keys, wallet rows, commerce payloads, internal source pointers, or tokenized proof data are recorded here.

```text
forbidden_field_scan_status: passed_for_this_investigation_note
worker_log_scan_status: not_performed
```

## 11. Rollback Result

**FACT:** No additional flag mutation or staging re-run was performed by this investigation.

**FACT:** The previous structured run already recorded rollback:

```text
RF_ENABLE_ENTITLEMENT_SHADOW_COMPARE=false
RF_ENABLE_ENTITLEMENT_SHADOW_DIAGNOSTICS=false
RF_ENTITLEMENT_SOURCE_READ_MODE=disabled
RF_ENTITLEMENT_SOURCE_READ_SCENARIO=
RF_ENTITLEMENT_SHADOW_SCENARIO=
RF /ready: 200 ready
diagnostics endpoint after delay: 404
```

**FACT:** Entitlement enforcement was not enabled.

**FACT:** Production was not touched.

## 12. Blockers

**BLOCKER:** RF shadow diagnostics counters are process-local and not durable.

**BLOCKER:** The diagnostics endpoint cannot prove complete cross-request drift deltas in Cloudflare staging.

**BLOCKER:** Cloudflare Worker logs/observability could not be queried in this session due to missing argumented MCP invocation support for the required observability query object.

**BLOCKER:** Worker logs were not scanned.

**BLOCKER:** Seven canonical drift classes still lack acceptable diagnostics/log evidence.

## 13. Final Governance Classification

Current classification:

```text
diagnostics_gap_explained: yes_process_local_worker_memory_and_non_durable_endpoint
log_evidence_status: not_collected
drift_disposition_status: not_closed
manual_staging_evidence_bundle_status: blocked
runtime_change_status: no_runtime_change
authority_runtime_status: legacy_vip_spacer_still_authoritative
enforcement_status: not_enabled
enforcement_preconditions_status: not_ready
future_enforcement_slice_status: blocked
```

**FACT:** The missing diagnostics deltas are now explained well enough to avoid treating endpoint deltas as durable proof.

**BLOCKER:** The explanation does not close the evidence bundle because it replaces one evidence path with a known limitation and no alternate log evidence was collected.

## 14. Allowed Next Slice

Allowed next slice:

```text
VIP Entitlement Runtime Authority — Slice 5A Retry: Aggregate-Safe Log Evidence Or Durable Diagnostics Sink Plan v1
```

Allowed work:

- operator-run Cloudflare Workers observability query for RF staging with aggregate-only output;
- aggregate-safe scan of Worker logs;
- or docs-first design of a durable aggregate diagnostics sink for a later implementation slice;
- no enforcement, no production, no RF/Points behavior change.

## 15. Forbidden Next Slice

**NON-GOAL:** The following remain forbidden until the evidence bundle is closed:

- RF entitlement-gated paid claim enforcement switch;
- canonical entitlement source authority activation;
- legacy `vip_spacer` compatibility reduction;
- production rollout;
- Points available-only spend enforcement;
- referral unlock runtime;
- network rewards runtime;
- Gateway entitlement claims rollout;
- Connect rollout;
- billing/subscription integration;
- tokenomics or related tokenized/on-ledger rollout.
