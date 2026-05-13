# VIP Entitlement Runtime Authority — Durable Diagnostics Contract & Schema Design v1

Date: 2026-05-13  
Status: `PROPOSED_CONTRACT_SCHEMA_NO_RUNTIME_CHANGE`  
Slice: `VIP Entitlement Runtime Authority / Slice 5B.1`  
Mode: docs-first contract/schema design, no implementation, no migration execution, no enforcement

## 1. Purpose

**TARGET:** This artifact freezes the v1 contract and schema design for a durable aggregate diagnostics sink for RF VIP Entitlement shadow evidence.

It defines:

- exact aggregate entity names;
- evidence window lifecycle;
- PostgreSQL table design;
- aggregate dimensions;
- allowed and forbidden fields;
- write semantics;
- read semantics;
- retention rules;
- failure semantics;
- future flags;
- test matrix;
- migration and implementation slice boundaries.

**FACT:** Slice 5B selected `postgresql_aggregate_table` as the preferred sink and `queue_to_diagnostics_worker` as an optional future ingestion layer.

**FACT:** This document is a contract/schema design only. It does not create tables, write migrations, change runtime logic, enable flags, or execute staging operations.

## 2. Problem Statement

**FACT:** RF entitlement shadow diagnostics counters currently live in process-local Cloudflare Worker memory.

**FACT:** Cloudflare Worker isolate behavior makes current endpoint deltas non-durable cross-request evidence.

**FACT:** Slice 5A structured matrix behavior passed, but per-case drift diagnostics remained incomplete.

**FACT:** The RF diagnostics endpoint remains useful for payload shape, admin route protection, local tests, and best-effort health.

**BLOCKER:** The current endpoint cannot close future authority migration evidence by itself.

**TARGET:** Durable evidence requires aggregate rows stored outside the Worker isolate, scoped to an explicit evidence window, and limited to safe dimensions only.

## 3. Exact Durable Aggregate Contract

### 3.1 Aggregate Entity Names

**TARGET:** The durable sink contract defines three PostgreSQL entities:

```text
rf_entitlement_shadow_evidence_window
rf_entitlement_shadow_diagnostics_aggregate
rf_entitlement_shadow_diagnostics_failures
```

**TARGET:** `rf_entitlement_shadow_evidence_window` owns lifecycle and metadata for a staging evidence window.

**TARGET:** `rf_entitlement_shadow_diagnostics_aggregate` owns monotonic aggregate counters by safe dimensions.

**TARGET:** `rf_entitlement_shadow_diagnostics_failures` owns aggregate-safe diagnostics sink failure counters only.

**NON-GOAL:** No raw event table is introduced.

### 3.2 Evidence Window Semantics

**TARGET:** An evidence window is a bounded diagnostics collection period with:

- one `window_id`;
- one environment;
- one RF service label;
- one expected build SHA;
- one lifecycle status;
- one retention deadline.

**TARGET:** Every aggregate row must belong to exactly one evidence window.

**TARGET:** Evidence windows are operator/governance artifacts. They do not authorize spend and do not become entitlement authority.

### 3.3 Aggregate Dimensions

**TARGET:** Durable aggregate dimensions are:

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

**TARGET:** Aggregate values are:

```text
observation_count
first_seen_at
last_seen_at
created_at
updated_at
```

**NON-GOAL:** No per-user, per-request, per-voucher, per-transaction, per-payment, or per-wallet row is allowed.

### 3.4 Contract Version

**TARGET:** The schema contract version is:

```text
rf_entitlement_shadow_diagnostics_contract_v1
```

**TARGET:** If future slices add fields or dimensions, they must create a new contract version or an explicit backwards-compatible amendment.

## 4. Exact PostgreSQL Schema

**NON-GOAL:** The SQL below is a design-level DDL contract. It is not a migration file and must not be executed in this slice.

### 4.1 Table A — Evidence Windows

Table name:

```text
rf_entitlement_shadow_evidence_window
```

Design-level DDL:

```sql
CREATE TABLE rf_entitlement_shadow_evidence_window (
  window_id text PRIMARY KEY,
  environment text NOT NULL,
  service text NOT NULL,
  build_sha varchar(40) NOT NULL,
  status text NOT NULL,
  created_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  opened_at timestamptz NULL,
  closed_at timestamptz NULL,
  archived_at timestamptz NULL,
  expired_at timestamptz NULL,
  retention_until timestamptz NOT NULL,
  notes text NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT rf_entitlement_shadow_evidence_window_environment_chk
    CHECK (environment IN ('local', 'test', 'staging', 'production', 'unknown')),
  CONSTRAINT rf_entitlement_shadow_evidence_window_service_chk
    CHECK (service IN ('rf-service')),
  CONSTRAINT rf_entitlement_shadow_evidence_window_status_chk
    CHECK (status IN ('draft', 'open', 'collecting', 'rollback_pending', 'closed', 'archived', 'expired')),
  CONSTRAINT rf_entitlement_shadow_evidence_window_build_sha_chk
    CHECK (build_sha ~ '^[0-9a-f]{7,40}$'),
  CONSTRAINT rf_entitlement_shadow_evidence_window_notes_len_chk
    CHECK (notes IS NULL OR length(notes) <= 2000),
  CONSTRAINT rf_entitlement_shadow_evidence_window_retention_chk
    CHECK (retention_until > created_at),
  CONSTRAINT rf_entitlement_shadow_evidence_window_opened_chk
    CHECK (opened_at IS NULL OR opened_at >= created_at),
  CONSTRAINT rf_entitlement_shadow_evidence_window_closed_chk
    CHECK (closed_at IS NULL OR opened_at IS NOT NULL),
  CONSTRAINT rf_entitlement_shadow_evidence_window_archived_chk
    CHECK (archived_at IS NULL OR closed_at IS NOT NULL),
  CONSTRAINT rf_entitlement_shadow_evidence_window_expired_chk
    CHECK (expired_at IS NULL OR closed_at IS NOT NULL)
);
```

Field semantics:

| Field | Semantics | Safety |
|---|---|---|
| `window_id` | Operator/governance evidence window id. | Must be non-secret and not derived from a request/user id. |
| `environment` | Runtime environment bucket. | Enum only. |
| `service` | Service bucket. | `rf-service` only for v1. |
| `build_sha` | Public deployment version evidence. | Git SHA only. |
| `status` | Evidence lifecycle state. | Enum only. |
| `created_by` | Operator class or automation label. | Must be a role/class label, not a person email or account id. |
| `notes` | Optional safe operator note. | Must not contain raw identifiers, secrets, or commerce data. |

**TARGET:** `created_by` should use values like:

```text
operator
runtime_validation_agent
ci_staging_evidence
manual_admin
```

**NON-GOAL:** `created_by` must not store email, raw user id, Clerk id, or account id.

### 4.2 Table B — Aggregate Counters

Table name:

```text
rf_entitlement_shadow_diagnostics_aggregate
```

Design-level DDL:

```sql
CREATE TABLE rf_entitlement_shadow_diagnostics_aggregate (
  window_id text NOT NULL REFERENCES rf_entitlement_shadow_evidence_window(window_id) ON DELETE CASCADE,
  environment text NOT NULL,
  service text NOT NULL,
  build_sha varchar(40) NOT NULL,
  scenario text NOT NULL,
  canonical_drift_class text NOT NULL,
  legacy_drift_class text NOT NULL,
  reason_code_bucket text NOT NULL,
  source_bucket text NOT NULL,
  adapter_status_bucket text NOT NULL,
  source_type_bucket text NOT NULL,
  source_age_bucket text NOT NULL,
  source_latency_bucket text NOT NULL,
  decision_version integer NOT NULL,
  adapter_version text NOT NULL,
  audit_trace_present boolean NOT NULL,
  observation_count bigint NOT NULL DEFAULT 0,
  first_seen_at timestamptz NOT NULL,
  last_seen_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT rf_entitlement_shadow_diag_aggregate_pk PRIMARY KEY (
    window_id,
    environment,
    service,
    build_sha,
    scenario,
    canonical_drift_class,
    legacy_drift_class,
    reason_code_bucket,
    source_bucket,
    adapter_status_bucket,
    source_type_bucket,
    source_age_bucket,
    source_latency_bucket,
    decision_version,
    adapter_version,
    audit_trace_present
  ),
  CONSTRAINT rf_entitlement_shadow_diag_aggregate_environment_chk
    CHECK (environment IN ('local', 'test', 'staging', 'production', 'unknown')),
  CONSTRAINT rf_entitlement_shadow_diag_aggregate_service_chk
    CHECK (service IN ('rf-service')),
  CONSTRAINT rf_entitlement_shadow_diag_aggregate_build_sha_chk
    CHECK (build_sha ~ '^[0-9a-f]{7,40}$'),
  CONSTRAINT rf_entitlement_shadow_diag_aggregate_scenario_chk
    CHECK (scenario IN ('role_mirror', 'grant', 'deny', 'stale', 'degraded', 'source_timeout', 'source_unavailable', 'unknown_source')),
  CONSTRAINT rf_entitlement_shadow_diag_aggregate_canonical_chk
    CHECK (canonical_drift_class IN (
      'aligned_granted',
      'aligned_denied',
      'role_granted_entitlement_denied',
      'role_denied_entitlement_granted',
      'stale_entitlement',
      'unavailable_entitlement',
      'degraded_runtime',
      'unknown'
    )),
  CONSTRAINT rf_entitlement_shadow_diag_aggregate_legacy_chk
    CHECK (legacy_drift_class IN (
      'aligned_granted',
      'aligned_denied',
      'role_granted_entitlement_denied',
      'role_denied_entitlement_granted',
      'stale_shadow',
      'degraded_shadow',
      'unknown_source'
    )),
  CONSTRAINT rf_entitlement_shadow_diag_aggregate_reason_chk
    CHECK (reason_code_bucket IN (
      'entitlement_granted',
      'not_found',
      'not_started',
      'expired',
      'revoked',
      'refunded',
      'cancelled',
      'grace_not_enabled',
      'source_unavailable',
      'source_timeout',
      'policy_not_configured',
      'stale_cache',
      'identity_untrusted',
      'role_drift',
      'unknown_source'
    )),
  CONSTRAINT rf_entitlement_shadow_diag_aggregate_source_chk
    CHECK (source_bucket IN ('canonical_entitlement', 'approved_cache', 'migration_role_shadow', 'mock', 'unknown')),
  CONSTRAINT rf_entitlement_shadow_diag_aggregate_adapter_status_chk
    CHECK (adapter_status_bucket IN ('none', 'disabled', 'ok', 'stale', 'degraded', 'timeout', 'unavailable', 'unknown_source')),
  CONSTRAINT rf_entitlement_shadow_diag_aggregate_source_type_chk
    CHECK (source_type_bucket IN (
      'none',
      'canonical_entitlement_store',
      'approved_cache',
      'billing_payment',
      'billing_subscription',
      'admin_grant',
      'promo_campaign',
      'migration_import',
      'reconciliation',
      'migration_role_shadow',
      'mock',
      'unknown'
    )),
  CONSTRAINT rf_entitlement_shadow_diag_aggregate_age_chk
    CHECK (source_age_bucket IN ('none', 'fresh', 'stale', 'unknown')),
  CONSTRAINT rf_entitlement_shadow_diag_aggregate_latency_chk
    CHECK (source_latency_bucket IN ('none', 'fast', 'slow', 'timeout', 'unknown')),
  CONSTRAINT rf_entitlement_shadow_diag_aggregate_decision_version_chk
    CHECK (decision_version >= 0),
  CONSTRAINT rf_entitlement_shadow_diag_aggregate_adapter_version_len_chk
    CHECK (length(adapter_version) <= 128),
  CONSTRAINT rf_entitlement_shadow_diag_aggregate_count_chk
    CHECK (observation_count >= 0),
  CONSTRAINT rf_entitlement_shadow_diag_aggregate_seen_chk
    CHECK (last_seen_at >= first_seen_at)
);
```

**TARGET:** `observation_count` is named explicitly instead of `count` to avoid ambiguity with SQL aggregate functions.

**TARGET:** `none` is the canonical sentinel for missing source-read fields.

**TARGET:** All primary key dimensions are `NOT NULL` so `ON CONFLICT` behaves deterministically.

### 4.3 Table C — Aggregate Failures

Table name:

```text
rf_entitlement_shadow_diagnostics_failures
```

Purpose:

**TARGET:** Store aggregate-safe sink failure counters, not failed raw events.

Design-level DDL:

```sql
CREATE TABLE rf_entitlement_shadow_diagnostics_failures (
  window_id text NOT NULL REFERENCES rf_entitlement_shadow_evidence_window(window_id) ON DELETE CASCADE,
  environment text NOT NULL,
  service text NOT NULL,
  build_sha varchar(40) NOT NULL,
  failure_bucket text NOT NULL,
  sink_mode text NOT NULL,
  failure_count bigint NOT NULL DEFAULT 0,
  first_seen_at timestamptz NOT NULL,
  last_seen_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT rf_entitlement_shadow_diag_failures_pk PRIMARY KEY (
    window_id,
    environment,
    service,
    build_sha,
    failure_bucket,
    sink_mode
  ),
  CONSTRAINT rf_entitlement_shadow_diag_failures_environment_chk
    CHECK (environment IN ('local', 'test', 'staging', 'production', 'unknown')),
  CONSTRAINT rf_entitlement_shadow_diag_failures_service_chk
    CHECK (service IN ('rf-service')),
  CONSTRAINT rf_entitlement_shadow_diag_failures_build_sha_chk
    CHECK (build_sha ~ '^[0-9a-f]{7,40}$'),
  CONSTRAINT rf_entitlement_shadow_diag_failures_bucket_chk
    CHECK (failure_bucket IN (
      'write_failed',
      'write_timeout',
      'write_dropped',
      'invalid_window',
      'closed_window',
      'disabled_sink',
      'version_mismatch',
      'unknown_failure'
    )),
  CONSTRAINT rf_entitlement_shadow_diag_failures_sink_mode_chk
    CHECK (sink_mode IN ('aggregate_db', 'queue_aggregate_db')),
  CONSTRAINT rf_entitlement_shadow_diag_failures_count_chk
    CHECK (failure_count >= 0),
  CONSTRAINT rf_entitlement_shadow_diag_failures_seen_chk
    CHECK (last_seen_at >= first_seen_at)
);
```

**NON-GOAL:** Failure rows must not contain exception messages, SQL text, request ids, auth headers, user identifiers, voucher identifiers, or raw stack traces.

## 5. Exact Constraints And Indexes

### 5.1 Primary Keys

**TARGET:** `rf_entitlement_shadow_evidence_window.window_id` is the primary key.

**TARGET:** `rf_entitlement_shadow_diagnostics_aggregate` uses a composite primary key across all safe dimensions.

**TARGET:** `rf_entitlement_shadow_diagnostics_failures` uses a composite primary key across window, environment, service, build, failure bucket, and sink mode.

### 5.2 Foreign Keys

**TARGET:** Aggregate and failure rows reference `rf_entitlement_shadow_evidence_window(window_id)`.

**TARGET:** `ON DELETE CASCADE` is acceptable because rows are derived evidence attached to a window, not business records.

### 5.3 Indexes

Design-level indexes:

```sql
CREATE INDEX rf_entitlement_shadow_window_status_idx
  ON rf_entitlement_shadow_evidence_window (status, environment, service);

CREATE INDEX rf_entitlement_shadow_window_retention_idx
  ON rf_entitlement_shadow_evidence_window (retention_until, status);

CREATE INDEX rf_entitlement_shadow_diag_aggregate_window_idx
  ON rf_entitlement_shadow_diagnostics_aggregate (window_id);

CREATE INDEX rf_entitlement_shadow_diag_aggregate_canonical_idx
  ON rf_entitlement_shadow_diagnostics_aggregate (window_id, canonical_drift_class);

CREATE INDEX rf_entitlement_shadow_diag_aggregate_legacy_idx
  ON rf_entitlement_shadow_diagnostics_aggregate (window_id, legacy_drift_class, canonical_drift_class);

CREATE INDEX rf_entitlement_shadow_diag_aggregate_build_idx
  ON rf_entitlement_shadow_diagnostics_aggregate (window_id, environment, service, build_sha);

CREATE INDEX rf_entitlement_shadow_diag_aggregate_seen_idx
  ON rf_entitlement_shadow_diagnostics_aggregate (window_id, last_seen_at);

CREATE INDEX rf_entitlement_shadow_diag_failures_window_idx
  ON rf_entitlement_shadow_diagnostics_failures (window_id);
```

### 5.4 Query Patterns

Evidence-window lookup:

```sql
SELECT *
FROM rf_entitlement_shadow_evidence_window
WHERE window_id = $1;
```

Canonical drift summary:

```sql
SELECT canonical_drift_class, SUM(observation_count) AS observation_count
FROM rf_entitlement_shadow_diagnostics_aggregate
WHERE window_id = $1
GROUP BY canonical_drift_class
ORDER BY canonical_drift_class;
```

Window source-read summary:

```sql
SELECT
  adapter_status_bucket,
  source_type_bucket,
  source_age_bucket,
  source_latency_bucket,
  SUM(observation_count) AS observation_count
FROM rf_entitlement_shadow_diagnostics_aggregate
WHERE window_id = $1
GROUP BY adapter_status_bucket, source_type_bucket, source_age_bucket, source_latency_bucket;
```

Window bounds:

```sql
SELECT
  MIN(first_seen_at) AS first_seen_at,
  MAX(last_seen_at) AS last_seen_at,
  SUM(observation_count) AS total_observations
FROM rf_entitlement_shadow_diagnostics_aggregate
WHERE window_id = $1;
```

Retention cleanup candidate lookup:

```sql
SELECT window_id
FROM rf_entitlement_shadow_evidence_window
WHERE retention_until < now()
  AND status IN ('closed', 'archived', 'expired');
```

**NON-GOAL:** No query by user, email, voucher, transaction, external event, request, correlation, or dedupe key exists.

## 6. Allow-List And Forbidden Fields

### 6.1 Strict Allow-List

**TARGET:** The write mapper must use a strict allow-list. Fields not listed here are rejected for sink writes.

Allowed window fields:

```text
window_id
environment
service
build_sha
status
created_by
created_at
opened_at
closed_at
archived_at
expired_at
retention_until
notes
updated_at
```

Allowed aggregate dimensions:

```text
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

Allowed aggregate values:

```text
observation_count
first_seen_at
last_seen_at
created_at
updated_at
```

Allowed failure dimensions and values:

```text
failure_bucket
sink_mode
failure_count
first_seen_at
last_seen_at
created_at
updated_at
```

### 6.2 Forbidden Fields

**NON-GOAL:** The schema, write payload, read response, and evidence export must not include:

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
- voucher ids;
- external ids;
- raw correlation ids;
- raw request ids;
- raw audit trace ids;
- dedupe keys;
- idempotency keys;
- partner settlement data;
- G2A/NFT/Totem/on-chain proofs;
- raw exception messages;
- SQL text;
- request or response bodies.

**TARGET:** The forbidden list is an audit aid. The primary enforcement model is the strict allow-list.

## 7. Exact Write Semantics

**TARGET:** Writes are increment-only.

**TARGET:** Writes are aggregate-only.

**TARGET:** Writes are scoped to exactly one active evidence window.

**TARGET:** No raw diagnostic event row is stored.

**TARGET:** No write is awaited on the user-visible hot path in a way that can change RF claim behavior.

**TARGET:** Scenario labels come from server-side RF flags/config only.

**TARGET:** The first implementation must be staging-first and disabled by default.

### 7.1 Upsert Contract

Future write semantics:

```text
ON aggregate observation:
  map observation to allow-listed dimensions
  set observation_count = 1
  upsert by composite key
  increment observation_count
  first_seen_at = min(existing.first_seen_at, new.first_seen_at)
  last_seen_at = max(existing.last_seen_at, new.last_seen_at)
  updated_at = now()
```

### 7.2 Sink Write Failure

If sink write fails:

```text
claim behavior: unchanged
Points behavior: unchanged
voucher behavior: unchanged
wallet behavior: unchanged
diagnostics failure aggregate: may increment
evidence bundle: partial or blocked
operator action: investigate and rerun evidence window if needed
```

**TARGET:** Sink failure is fail-open for diagnostics only.

**TARGET:** Future entitlement authority remains fail-closed under its own contract.

## 8. Exact Read Semantics

**TARGET:** Reads are internal admin-only.

**TARGET:** Reads are aggregate-only.

**TARGET:** Reads are window-scoped.

**TARGET:** Reads are export-safe.

**NON-GOAL:** No raw event export.

**NON-GOAL:** No user-level query.

**NON-GOAL:** No public API or OpenAPI surface.

### 8.1 Admin Snapshot Response Shape

Future internal response shape:

```text
{
  "window": {
    "windowId": "safe-window-label",
    "environment": "staging",
    "service": "rf-service",
    "buildSha": "public-build-sha",
    "status": "collecting",
    "openedAt": "timestamp",
    "closedAt": null,
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

**TARGET:** Response fields use safe names like `windowId` for API shape, but stored column remains `window_id`.

**NON-GOAL:** The response must not include `lastObservation` because even safe-looking observation fields can create correlation risk in low-volume evidence windows.

## 9. Evidence Window Lifecycle

### 9.1 Status: `draft`

Allowed operations:

- create window metadata;
- set retention deadline;
- validate safe `window_id`;
- update safe notes.

Forbidden operations:

- aggregate writes;
- evidence export;
- enforcement decisions.

Retention:

- retention starts at `created_at`;
- stale drafts should expire quickly.

Rollback expectations:

- no runtime flags should be enabled for a draft.

### 9.2 Status: `open`

Allowed operations:

- mark window ready for collection;
- verify build SHA and flags;
- prepare matrix run.

Forbidden operations:

- treating empty counters as evidence closure;
- public export.

Retention:

- normal staging evidence retention.

Rollback expectations:

- if setup fails, close or expire the window and keep RF flags disabled.

### 9.3 Status: `collecting`

Allowed operations:

- aggregate counter upserts;
- admin snapshot reads;
- failure counter upserts;
- matrix case execution in staging.

Forbidden operations:

- raw event storage;
- changing RF claim behavior;
- production enablement.

Retention:

- rows retained until `retention_until`.

Rollback expectations:

- if collection aborts, move to `rollback_pending`.

### 9.4 Status: `rollback_pending`

Allowed operations:

- stop durable writes;
- disable RF source-read/diagnostics/compare flags;
- collect safe final failure counters;
- verify `/ready` and diagnostics inactive state.

Forbidden operations:

- starting new matrix cases;
- enforcement planning based on partial evidence.

Retention:

- keep partial rows until governance review or expiration.

Rollback expectations:

- rollback proof must be recorded before `closed`.

### 9.5 Status: `closed`

Allowed operations:

- aggregate snapshot export;
- forbidden-field scan;
- evidence artifact update;
- read-only review.

Forbidden operations:

- further aggregate writes;
- window mutation except archive/expire metadata.

Retention:

- retain until `retention_until`.

Rollback expectations:

- rollback must already be complete.

### 9.6 Status: `archived`

Allowed operations:

- read-only governance review;
- retention cleanup planning.

Forbidden operations:

- writes;
- new matrix cases;
- evidence mutation except superseding artifact notes.

Retention:

- archive must still expire unless separately approved.

### 9.7 Status: `expired`

Allowed operations:

- delete aggregate rows;
- keep safe high-level artifact references.

Forbidden operations:

- use expired rows as fresh evidence;
- reopen the same window.

Retention:

- aggregate rows can be deleted.

## 10. Retention Policy

**TARGET:** Staging retention default:

```text
30 days after window close
```

**TARGET:** Draft windows with no collection:

```text
expire after 7 days
```

**TARGET:** Rollback-pending windows:

```text
retain for up to 30 days or until governance review, whichever comes first
```

**TARGET:** Archived windows:

```text
retain until retention_until, then delete aggregate rows
```

**NON-GOAL:** Production retention is not defined for enablement. Any production-like retention requires a separate approval slice.

**TARGET:** Cleanup deletes derived aggregate rows, not business records.

**OPEN QUESTION:** Whether closed staging windows that support an ADR or enforcement gate need a longer retention class, such as 90 days, with explicit owner approval.

## 11. Failure Semantics

| Condition | Claim impact | Points/voucher impact | Evidence impact | Governance classification |
|---|---|---|---|---|
| Sink unavailable | none | none | failure counter may increment; evidence partial | blocked until rerun or explained |
| DB unavailable | none | none | no durable writes | blocked |
| Duplicate write | none | none | count may inflate unless future dedupe exists | review required |
| Delayed write | none | none | snapshot may lag | collecting until settled |
| Replay | none beyond existing claim semantics | unchanged | should not create full duplicate evidence if replay detected before observation | review if inflated |
| Stale window | none | none | write rejected or failure bucket increments | blocked for that window |
| Invalid window | none | none | failure bucket `invalid_window` | blocked |
| Closed window write | none | none | failure bucket `closed_window`; no aggregate update | blocked for attempted run |
| Disabled flags | none | none | no durable writes expected | not evidence |
| Version mismatch | none | none | failure bucket `version_mismatch` | blocked until build alignment |

**TARGET:** Diagnostics failure is never a reason to compensate Points, reverse a voucher, alter wallet rows, or change RF claim output.

## 12. Feature Flags

### 12.1 `RF_ENABLE_ENTITLEMENT_DURABLE_DIAGNOSTICS`

Type:

```text
boolean-like string
```

Allowed values:

```text
true
false
```

Default:

```text
false
```

Policy:

- staging-only for first implementation;
- production forbidden until separate approval;
- rollback sets to `false`.

### 12.2 `RF_ENTITLEMENT_DIAGNOSTICS_WINDOW_ID`

Type:

```text
string
```

Allowed values:

- safe operator-generated label;
- max length 120;
- lowercase letters, digits, dash, underscore;
- must not be derived from request/user/voucher/transaction identifiers.

Default:

```text
empty
```

Policy:

- required when durable diagnostics is enabled;
- changing value starts a new evidence window;
- rollback sets to empty.

### 12.3 `RF_ENTITLEMENT_DIAGNOSTICS_SINK_MODE`

Type:

```text
enum string
```

Allowed values:

```text
disabled
aggregate_db
```

Future allowed value after separate slice:

```text
queue_aggregate_db
```

Default:

```text
disabled
```

Policy:

- `aggregate_db` allowed in staging first;
- production forbidden until separate approval;
- rollback sets to `disabled`.

### 12.4 `RF_ENTITLEMENT_DIAGNOSTICS_SAMPLE_MODE`

Type:

```text
enum string
```

Allowed values:

```text
all
scenario_only
```

Default:

```text
scenario_only
```

Policy:

- `scenario_only` preferred for controlled staging windows;
- `all` requires explicit Runtime Governance approval;
- rollback restores default or disabled sink state.

**OPEN QUESTION:** Future implementation may choose `RF_ENABLE_ENTITLEMENT_SHADOW_DURABLE_DIAGNOSTICS` to make the shadow-only nature clearer.

## 13. Testing Matrix

### 13.1 Schema Tests

- table names match contract;
- all required columns exist;
- primary keys match contract;
- check constraints include all enum values;
- forbidden columns are absent;
- retention indexes exist;
- `observation_count` and `failure_count` are non-negative.

### 13.2 Aggregate Increment Tests

- one observation creates one aggregate row;
- repeated same dimensions increment `observation_count`;
- `first_seen_at` remains earliest;
- `last_seen_at` becomes latest;
- every canonical drift class maps into its aggregate bucket;
- every legacy drift class maps into its aggregate bucket.

### 13.3 Forbidden-Field Tests

- write mapper rejects fields outside allow-list;
- serialized write payload contains no forbidden markers;
- serialized read snapshot contains no forbidden markers;
- notes field rejects or redacts unsafe content;
- `created_by` rejects identity-like values.

### 13.4 Multi-Isolate Tests

- two simulated writers increment the same `window_id`;
- aggregate totals equal combined observations;
- no reliance on module-local snapshot for durable closure;
- delayed writer does not overwrite counts.

### 13.5 Rollback Tests

- disabled durable flag produces no writes;
- empty `window_id` with enabled flag produces failure bucket only or no write according to future implementation decision;
- closed window write does not update aggregate table;
- rollback flag state stops writes;
- diagnostics route inactive after rollback remains compatible with durable window closure.

### 13.6 Window Lifecycle Tests

- `draft` cannot collect rows;
- `open` can transition to `collecting`;
- `collecting` can receive aggregate rows;
- `rollback_pending` blocks new matrix writes;
- `closed` is read-only;
- `archived` is read-only;
- `expired` cannot be used as current evidence.

### 13.7 Sink Failure Tests

- DB write throws and claim behavior is unchanged;
- DB read throws and evidence closure is blocked;
- failure bucket increments with aggregate-safe label;
- no exception text is stored.

### 13.8 Export Safety Tests

- admin snapshot is aggregate-only;
- no raw row export is required;
- evidence bundle JSON passes forbidden-field scan;
- low-volume rare buckets are marked as governance-sensitive if needed.

## 14. Migration Plan

**NON-GOAL:** No actual migration file is created in Slice 5B.1.

### Phase 1 — Schema + Flags Only

Future slice:

```text
Slice 5B.2 pre-step or dedicated schema migration slice
```

Scope:

- create three tables;
- add indexes and constraints;
- add disabled-by-default flags to staging config only if approved;
- no write path enabled.

### Phase 2 — Write Path Behind Disabled Flag

Future slice:

```text
Slice 5B.2 — Aggregate Sink Implementation Behind Flag
```

Scope:

- map `VipEntitlementShadowObservation` to allow-listed dimensions;
- write aggregate rows only when enabled;
- keep failures non-blocking;
- preserve RF/Points behavior.

### Phase 3 — Admin Aggregate Endpoint

Future slice:

```text
Slice 5B.3 — Admin Snapshot Endpoint
```

Scope:

- internal admin-only aggregate snapshot;
- window-scoped response;
- export-safe shape;
- no public API/OpenAPI.

### Phase 4 — Staging Matrix Re-Run

Future slice:

```text
Slice 5B.4 — Staging Evidence Re-run
```

Scope:

- controlled matrix;
- durable aggregate counters;
- forbidden-field scan;
- rollback proof.

### Phase 5 — Preconditions Gate Revalidation

Future slice:

```text
Slice 5B.5 — Preconditions Gate Revalidation
```

Scope:

- review durable evidence;
- classify drift disposition;
- decide if review-only enforcement discussion is allowed.

**NON-GOAL:** No phase authorizes enforcement.

## 15. Governance Boundaries

**FACT:** Current runtime authority remains legacy `vip_spacer`.

**NON-GOAL:** Diagnostics sink is not authority.

**NON-GOAL:** Diagnostics sink is not a Points ledger.

**NON-GOAL:** Diagnostics sink is not a referral system.

**NON-GOAL:** Diagnostics sink is not payment audit.

**NON-GOAL:** Diagnostics sink is not a settlement system.

**NON-GOAL:** Diagnostics sink is not tokenomics analytics.

**NON-GOAL:** Diagnostics sink cannot authorize spend.

**NON-GOAL:** Downstream jobs must not read this sink to grant entitlement, spend Points, unlock referrals, settle partners, or mint claims.

**TARGET:** The sink is only an observability and governance evidence artifact.

## 16. Blockers And Open Questions

**BLOCKER:** Durable evidence is not available until a future implementation and migration slice executes.

**BLOCKER:** Current endpoint deltas remain non-durable process-local evidence.

**OPEN QUESTION:** Should table C failures be included in the first migration or deferred until write path implementation?

**OPEN QUESTION:** Should `created_by` use a closed enum or free text with a strict sanitizer?

**OPEN QUESTION:** Is 30-day staging retention sufficient for governance review, or should closed evidence windows use 90 days with explicit approval?

**OPEN QUESTION:** Should `queue_aggregate_db` be designed now or reserved until direct DB write latency is measured?

**OPEN QUESTION:** Should `claim_scope_bucket` be added as a safe dimension for partner vs listing claims, or is v1 evidence sufficiently covered without it?

**OPEN QUESTION:** Should rare low-volume bucket exports require k-anonymity or operator-only classification before broad sharing?

## 17. Final Classification

```text
contract_schema_status: proposed
runtime_change_status: no_runtime_change
migration_status: not_executed
enforcement_status: not_enabled
production_status: not_touched
preferred_sink: postgresql_aggregate_table
optional_future_ingestion_layer: queue_to_diagnostics_worker
recommended_next_slice: slice_5b_2_aggregate_sink_implementation_behind_flag
future_enforcement_slice_status: blocked_until_durable_evidence
```

**FACT:** This contract/schema design is sufficient to guide a future implementation slice, but it does not close the evidence bundle.

**TARGET:** The next implementation slice must remain staging-first, disabled by default, and non-authoritative.
