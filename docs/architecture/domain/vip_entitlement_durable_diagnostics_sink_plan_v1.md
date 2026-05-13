# VIP Entitlement Runtime Authority — Durable Aggregate Diagnostics Sink Plan v1

Date: 2026-05-13  
Status: `PROPOSED_DOCS_FIRST_NO_RUNTIME_CHANGE`  
Slice: `VIP Entitlement Runtime Authority / Slice 5B`  
Mode: docs-first architecture plan, durable evidence design, no implementation, no enforcement

## 1. Purpose

**TARGET:** This document defines a docs-first plan for a durable aggregate diagnostics sink for VIP Entitlement shadow evidence.

It exists because Slice 5A proved that:

- the structured staging matrix can execute;
- legacy RF paid claim behavior remains authoritative;
- rollback of RF shadow/source-read flags works;
- RF in-memory diagnostics endpoint is useful for route health and payload shape;
- RF in-memory diagnostics endpoint is not sufficient durable cross-request evidence in Cloudflare Workers staging.

**TARGET:** The sink must support future staging evidence windows and drift disposition without becoming authority, changing RF claim outcomes, or leaking sensitive data.

**NON-GOAL:** This Slice 5B document does not implement code, create migrations, enable enforcement, change runtime flags, change public APIs, or touch production.

## 2. Problem Statement

**FACT:** Current RF shadow diagnostics counters live in process-local module memory inside `apps/rf-service/src/vipEntitlementShadow.ts`.

**FACT:** Cloudflare Worker isolate behavior means sequential claim requests and diagnostics endpoint reads can hit different in-memory snapshots.

**FACT:** The Slice 5A structured matrix preserved legacy behavior but did not produce complete per-case diagnostics deltas.

**FACT:** Only `degraded_runtime=1` was observed as a diagnostics delta in the endpoint evidence, while other expected classes remained missing.

**FACT:** The current endpoint is still useful for:

- admin route protection proof;
- diagnostics payload shape;
- aggregate-safe field contract checks;
- local and single-isolate tests;
- best-effort runtime health.

**BLOCKER:** The current endpoint cannot be the sole evidence source for future entitlement authority migrations.

**TARGET:** Future evidence closure requires durable, cross-request, aggregate-only drift evidence.

## 3. Design Goals

**TARGET:** The durable diagnostics sink must provide:

- durable cross-request evidence;
- aggregate-only storage;
- no raw identity data;
- no tokens or secrets;
- no commerce-sensitive payloads;
- staging-first rollout;
- no runtime authority;
- no RF claim behavior change;
- rollback-safe operation;
- window-scoped queryability for evidence bundles;
- compatibility with future VIP Entitlement Authority migration gates.

**TARGET:** The sink must support every canonical drift class:

```text
aligned_granted
aligned_denied
role_granted_entitlement_denied
role_denied_entitlement_granted
stale_entitlement
unavailable_entitlement
degraded_runtime
unknown
```

**TARGET:** The sink should let Runtime Governance and Runtime Validation close a staging evidence window without relying on same-isolate memory.

## 4. Non-Goals

**NON-GOAL:** No entitlement enforcement.

**NON-GOAL:** No production rollout.

**NON-GOAL:** No user-visible feature.

**NON-GOAL:** No Points ledger changes.

**NON-GOAL:** No Points available-only spend enforcement.

**NON-GOAL:** No wallet behavior change.

**NON-GOAL:** No Connect or Gateway entitlement claims.

**NON-GOAL:** No referral unlock, network rewards, billing/subscription integration, tokenomics, G2A, NFT, Totem, or on-chain rollout.

**NON-GOAL:** No raw event lake containing PII or sensitive commerce payloads.

**NON-GOAL:** No authority decision source. The sink must never answer “is this user entitled?” for RF.

## 5. Candidate Sink Options

### Option A — PostgreSQL Aggregate Table

Example future table:

```text
rf_entitlement_shadow_diagnostics_aggregate
```

Pros:

- existing staging database is already operational;
- SQL queryability fits evidence bundle generation;
- window-scoped aggregate rows are easy to review;
- supports deterministic `INSERT ... ON CONFLICT DO UPDATE count = count + 1`;
- easiest path for manual staging closure and drift disposition.

Cons:

- requires a future migration;
- requires strict schema discipline to avoid PII;
- direct request-path writes can add overhead if not handled carefully.

Assessment:

**TARGET:** Preferred durable sink for staging-first implementation.

### Option B — Cloudflare Durable Object

Pros:

- fits Worker runtime;
- provides strongly consistent state per aggregate key;
- avoids direct DB coupling in RF request handling.

Cons:

- requires new binding/config;
- adds operational complexity;
- query/export ergonomics are weaker than SQL for evidence review;
- still needs a controlled export path for docs and governance.

Assessment:

**TARGET:** Acceptable as a future aggregation coordinator, not the preferred primary evidence store for Slice 5B.

### Option C — Cloudflare KV / R2 Aggregate Snapshots

Pros:

- lightweight;
- simple snapshot storage;
- can store closed evidence artifacts.

Cons:

- KV eventual consistency is weak for concurrent counters;
- R2 is better for artifacts than live increments;
- weaker per-window query semantics;
- harder to prove complete matrix deltas.

Assessment:

**BLOCKER:** Not preferred as the primary counter sink.

### Option D — Cloudflare Logs / Observability Only

Pros:

- no runtime storage writes;
- operationally aligned with Workers;
- useful independent evidence source.

Cons:

- access/tooling limitations were already encountered;
- retention and query windows can vary;
- safe scan complexity is high;
- not controlled by an application-level evidence contract.

Assessment:

**TARGET:** Useful supporting evidence channel, not the only durable evidence contract.

### Option E — Queue To Diagnostics Worker

Pros:

- decouples RF request path from storage writes;
- can sanitize before storage;
- supports retries and batching.

Cons:

- requires a queue binding;
- adds a diagnostics worker and operational moving parts;
- evidence becomes eventual;
- terminal durable store is still required.

Assessment:

**TARGET:** Good future ingestion layer if direct DB writes are too expensive. It does not replace the aggregate store.

## 6. Recommended Architecture

**TARGET:** Preferred path:

```text
RF shadow observation
  -> aggregate-safe diagnostic dimensions
  -> PostgreSQL aggregate table
  -> internal admin aggregate snapshot endpoint
  -> staging evidence bundle
```

**TARGET:** The recommended durable sink is a PostgreSQL aggregate diagnostics table for staging-first evidence.

**TARGET:** A future queue-to-diagnostics-worker layer may be added later if direct writes are too expensive or too risky for tail latency.

**TARGET:** The sink stores aggregate counters only. It is not:

- raw event storage;
- user-level telemetry;
- a Points ledger;
- an entitlement store;
- an authorization source;
- a replay/correlation index;
- a partner settlement source.

**FACT:** Legacy `vip_spacer` remains runtime authority until a later enforcement slice is separately approved.

**TARGET:** The sink must be explicitly documented as observability/governance-only.

## 7. Data Model

**TARGET:** Future schema should store safe aggregate rows only.

Proposed aggregate row shape:

```text
window_id: text
environment: text
service: text
build_sha: text
scenario: text
canonical_drift_class: text
legacy_drift_class: text
reason_code_bucket: text
source_bucket: text
adapter_status_bucket: text
source_type_bucket: text
source_age_bucket: text
source_latency_bucket: text
decision_version: integer
adapter_version: text
audit_trace_present: boolean
count: integer
first_seen_at: timestamp
last_seen_at: timestamp
created_at: timestamp
updated_at: timestamp
```

**TARGET:** Suggested uniqueness key:

```text
window_id
environment
service
build_sha
scenario
canonical_drift_class
legacy_drift_class
reason_code_bucket
source_bucket
adapter_status_bucket
source_type_bucket
source_age_bucket
source_latency_bucket
decision_version
adapter_version
audit_trace_present
```

**TARGET:** The only mutable value on repeated observations should be aggregate counters and timestamps.

**NON-GOAL:** The schema must not include:

- user id;
- email;
- token;
- transaction id;
- voucher id;
- external id;
- correlation id;
- raw request id;
- sourceRef;
- entitlement metadata;
- wallet ledger fields;
- payment payload fields;
- raw role arrays;
- dedupe keys;
- partner settlement fields;
- on-chain, G2A, NFT, or Totem proof fields.

**OPEN QUESTION:** Whether `window_id` is supplied by a staging flag, an admin window API, or a generated operator run id in the future implementation slice.

## 8. Write Semantics

**TARGET:** Writes must be increment-only aggregate updates.

**TARGET:** Future write flow:

1. RF computes the same `VipEntitlementShadowObservation` it already computes.
2. RF maps the observation into a safe aggregate dimensions object.
3. RF increments the durable aggregate row for the active evidence window.
4. RF continues claim behavior regardless of diagnostics write success or failure.

**TARGET:** Writes must be scoped by evidence window.

**TARGET:** Writes must never create one row per user, voucher, transaction, request, or external system event.

**TARGET:** Scenario bucket must come from server-side RF configuration, not client payload.

**TARGET:** Idempotency approach:

- primary plan: aggregate counts are best-effort for staging evidence and tolerate operator reruns by using a fresh `window_id`;
- future strict plan: if exactly-once is required, use an internal dedupe mechanism that does not store raw dedupe material in the aggregate table;
- idempotent paid claim replay should not inflate evidence if the claim path identifies a replay before the shadow observation point in a future implementation.

**TARGET:** Diagnostics write failure must be non-blocking.

**TARGET:** Diagnostics write failure must not trigger Points compensation, voucher correction, or wallet correction.

**TARGET:** Diagnostics are fail-open for observability only. Future entitlement authority decisions remain fail-closed by their own contract.

## 9. Read Semantics

**TARGET:** Future read surface should be internal admin-only.

**TARGET:** The read endpoint must return aggregate-only, window-scoped summaries:

```text
window_id
environment
service
build_sha
flags_summary
by_canonical_drift_class
by_legacy_drift_class
by_reason_code_bucket
by_source_bucket
by_adapter_status_bucket
by_decision_version
by_adapter_version
audit_trace_presence_counts
first_seen_at
last_seen_at
total_count
```

**TARGET:** No raw row export should be required for evidence closure.

**TARGET:** Admin read must support:

- open window snapshot;
- closed window snapshot;
- evidence bundle export;
- optional archive/retention status.

**TARGET:** A reset/open-window operation may exist in a future implementation, but it must be privileged and staging-first.

**NON-GOAL:** No public API or OpenAPI surface is introduced by this plan.

## 10. Security And Privacy Rules

**TARGET:** Allowed fields:

- safe labels;
- count buckets;
- canonical drift classes;
- legacy drift classes;
- scenario labels;
- reason code buckets;
- adapter status buckets;
- source type buckets;
- source age/latency buckets;
- decision and adapter versions;
- audit trace presence count, not trace value;
- build SHA if already public in readiness;
- environment;
- service name;
- evidence window id if it is operator-generated and non-sensitive.

**NON-GOAL:** Forbidden fields:

- raw JWT;
- `Authorization`;
- `X-Gateway-Auth`;
- Clerk tokens;
- service tokens;
- raw roles;
- raw user ids;
- emails;
- payment payloads;
- `sourceRef`;
- entitlement metadata;
- wallet ledger rows;
- transaction ids;
- external ids;
- raw correlation ids;
- dedupe keys;
- partner settlement data;
- G2A/NFT/Totem/on-chain proofs.

**TARGET:** The write mapper must use a strict allow-list, not a deny-list.

**TARGET:** The read/export path must run a forbidden-field scan before evidence is copied into docs.

**TARGET:** The sink must not become a side channel for identifying a specific user, voucher, transaction, partner, or payment event.

**OPEN QUESTION:** Whether staging windows need k-anonymity thresholds for low-volume classes before sharing evidence outside operator-only docs.

## 11. Operational Model

**TARGET:** Staging-first.

**TARGET:** Disabled by default.

**TARGET:** No production enablement until a separate approval slice.

Evidence window lifecycle:

1. **Open**
   - choose `window_id`;
   - verify environment and Worker SHA;
   - enable only staging RF shadow/source-read/diagnostics flags;
   - enable durable diagnostics flag only for the active staging window.

2. **Run Matrix**
   - execute one scenario at a time;
   - prefer low-impact non-VIP denied claims for diagnostics-only classes;
   - use VIP paid claims only where needed for aligned grant and adapter deny behavior proof.

3. **Collect Snapshot**
   - read window-scoped aggregate snapshot;
   - verify every canonical drift class expected by the matrix;
   - compare behavior evidence and durable aggregate evidence.

4. **Scan**
   - scan exported summary for forbidden fields;
   - scan any operator log supplement separately if used.

5. **Close**
   - mark the evidence window closed or archive it;
   - record final aggregate counters;
   - update the evidence artifact.

6. **Rollback**
   - set RF source-read mode disabled;
   - disable shadow diagnostics;
   - disable shadow compare;
   - verify RF `/ready`;
   - verify diagnostics route inactive;
   - confirm no RF/Points/voucher correction is needed.

**TARGET:** Retention should be short by default in staging and explicit for any production-like use.

**OPEN QUESTION:** Exact retention duration should be decided in Slice 5B.1 with security/governance review.

## 12. Feature Flags

Future flags:

```text
RF_ENABLE_ENTITLEMENT_DURABLE_DIAGNOSTICS=false
RF_ENTITLEMENT_DIAGNOSTICS_WINDOW_ID=
RF_ENTITLEMENT_DIAGNOSTICS_SINK_MODE=disabled|aggregate_db
RF_ENTITLEMENT_DIAGNOSTICS_SAMPLE_MODE=all|scenario_only
```

**TARGET:** Flags are disabled by default.

**TARGET:** Staging implementation must be enabled only for `go2asia-rf-service-staging` until a later approval.

**TARGET:** Production must not enable durable diagnostics until separate governance approval.

**TARGET:** These flags must not affect RF claim allow/deny behavior.

**OPEN QUESTION:** Whether the future flag name should include `SHADOW` to distinguish it from future canonical authority diagnostics:

```text
RF_ENABLE_ENTITLEMENT_SHADOW_DURABLE_DIAGNOSTICS
```

## 13. Failure Semantics

**TARGET:** Sink write failure never blocks RF claim.

**TARGET:** Sink read failure blocks evidence closure, not claim behavior.

**TARGET:** Database outage does not change RF behavior.

**TARGET:** Diagnostics sink unavailable means:

```text
evidence_closure_status: blocked
runtime_behavior_status: unchanged
```

**TARGET:** No compensation is needed for diagnostics write failure.

**TARGET:** No Points correction, voucher correction, wallet correction, or partner settlement correction is needed for diagnostics write failure.

**TARGET:** If direct DB writes are too slow, a later implementation slice should switch to queue ingestion before enabling broader evidence windows.

## 14. Testing Requirements

Future implementation must include tests for:

- forbidden fields absent from write payload;
- forbidden fields absent from read snapshot;
- counters increment by canonical drift class;
- counters increment by legacy drift class;
- non-VIP denied paid claim still records aggregate evidence;
- VIP allowed paid claim records aggregate evidence;
- adapter deny for VIP records disagreement aggregate evidence;
- adapter grant for non-VIP records disagreement aggregate evidence;
- stale records `stale_entitlement`;
- degraded records `degraded_runtime`;
- source timeout/unavailable records `unavailable_entitlement`;
- unknown source records `unknown`;
- sink failure does not affect claim result;
- feature flags disabled means no durable writes;
- existing in-memory endpoint remains admin-only;
- durable aggregate endpoint is admin-only;
- snapshot response is aggregate-only;
- evidence export passes forbidden-field scan;
- multiple simulated Worker isolates increment the same durable aggregate window.

**TARGET:** Local tests should keep the current single-process diagnostics tests and add durable-sink-specific tests rather than replacing them.

## 15. Future Implementation Slices

### Slice 5B.1 — Contract + Schema Design

**TARGET:** Create exact schema/migration plan, field allow-list, retention policy, and operator window lifecycle.

**NON-GOAL:** No runtime code, no migration execution, no flags enabled.

### Slice 5B.2 — Aggregate Sink Implementation Behind Flag

**TARGET:** Implement aggregate DB sink behind disabled-by-default staging flag.

**TARGET:** Write failures must be non-blocking and observable as aggregate failure counters only.

**NON-GOAL:** No enforcement, no production enablement.

### Slice 5B.3 — Admin Snapshot Endpoint

**TARGET:** Add internal admin-only aggregate snapshot endpoint.

**TARGET:** Endpoint returns window-scoped aggregate-only summaries.

**NON-GOAL:** No public API/OpenAPI change.

### Slice 5B.4 — Staging Evidence Re-run

**TARGET:** Re-run the Slice 5A matrix with durable aggregate counts.

**TARGET:** Close drift evidence for all canonical classes if counters and scans pass.

**NON-GOAL:** No enforcement.

### Slice 5B.5 — Preconditions Gate Revalidation

**TARGET:** Revalidate Slice 5 gate with durable evidence.

**TARGET:** Decide whether `allowed_for_review_only` is justified.

**NON-GOAL:** `allowed_for_review_only` is not enforcement approval.

## 16. Acceptance Criteria

For this plan slice:

- document created;
- preferred sink chosen;
- candidate options evaluated;
- data model is aggregate-safe;
- forbidden fields are explicit;
- write semantics are defined;
- read semantics are defined;
- operational evidence window is defined;
- feature flags are proposed;
- failure semantics are defined;
- tests are specified;
- future implementation slices are defined;
- no runtime changes were made.

## 17. Blockers And Open Questions

**BLOCKER:** Evidence bundle remains blocked until durable aggregate evidence or acceptable aggregate-safe log evidence exists.

**BLOCKER:** Current in-memory diagnostics endpoint remains non-durable and isolate-local.

**FACT:** Exact migration/table naming was finalized in Slice 5B.1 and implemented behind disabled flags in Slice 5B.2:

```text
rf_entitlement_shadow_evidence_window
rf_entitlement_shadow_diagnostics_aggregate
rf_entitlement_shadow_diagnostics_failures
```

**OPEN QUESTION:** Whether the direct DB write path remains acceptable for RF request-path latency after staging measurement, or whether queue ingestion is required.

**OPEN QUESTION:** Exact retention period for staging evidence windows.

**OPEN QUESTION:** Whether a future admin open/close window endpoint is required, or whether window lifecycle can be driven entirely by server-side flags and SQL/operator procedures.

**OPEN QUESTION:** Whether production durable diagnostics should ever be enabled, and under which privacy/retention controls.

## 18. Final Classification

```text
plan_status: proposed
preferred_sink: postgresql_aggregate_table
optional_future_ingestion_layer: queue_to_diagnostics_worker
runtime_change_status: no_runtime_change
authority_runtime_status: legacy_vip_spacer_still_authoritative
diagnostics_sink_authority_status: non_authoritative_observability_only
enforcement_status: not_enabled
production_status: not_touched
recommended_next_slice: slice_5b_3_admin_snapshot_endpoint
future_enforcement_slice_status: blocked_until_durable_evidence_rerun
```

**FACT:** This Slice 5B plan defined the path to durable evidence. Slice 5B.2 implements the aggregate sink behind disabled flags, but it does not close the evidence bundle by itself.

**TARGET:** Only after durable aggregate evidence or acceptable aggregate-safe log evidence closes all drift classes may the governance track reconsider `future_enforcement_slice_status=allowed_for_review_only`.
