# RF Slice 6.36 - Identity Shadow Observability Hardening

## 1. Purpose & Context

RF Slice 6.36 documents a bounded observability hardening step for gateway identity shadow validation.

Operational context from prior work:

- Slice 6.35 validation windows completed with stable auth and RF behavior.
- Shadow compare, evidence, aggregation, and rollback were executed in staging.
- Main unresolved issue was observability visibility: Cloudflare MCP channel did not provide usable aggregate counters for quantitative review.

This slice solves that visibility gap with a safe, non-production diagnostics surface that exposes aggregate-only counters.

References:

- [Slice 6.28 - Gateway Shadow Evidence Aggregation & Staging Validation](./rf_slice_6_28_gateway_shadow_evidence_aggregation_staging_validation_v1.md)
- [Slice 6.29 - Gateway Shadow Validation Runbook & Staging Review Procedure](./rf_slice_6_29_gateway_shadow_validation_runbook_staging_review_v1.md)
- Slice 6.35 execution record set:
  - [Slice 6.30 - Staging Shadow Validation Review Record](./rf_slice_6_30_staging_shadow_validation_review_record_v1.md)
  - [Slice 6.33 - Operator Executed Staging Validation Result Ingestion](./rf_slice_6_33_operator_executed_staging_validation_result_ingestion_v1.md)
  - [Slice 6.34 - Real Operator Evidence Bundle Intake Validation](./rf_slice_6_34_real_operator_evidence_bundle_intake_validation_v1.md)

## 2. Existing Architecture

Current gateway identity shadow architecture:

| Component | Current behavior |
| --- | --- |
| SHADOW_COMPARE | Flag-gated helper compare runs beside legacy extraction; legacy remains authoritative. |
| EVIDENCE | Flag-gated downstream evidence header for internal use only. |
| AGGREGATION | Flag-gated in-memory counter updates by classification/reason/helper source. |
| Aggregation scope | Process-local, isolate-local module state in Worker runtime. |
| Snapshot model | No persistence, resets on cold start/redeploy; not cluster-global. |
| Rollback model | Disable `AGGREGATION`, then `EVIDENCE`, then `SHADOW_COMPARE`. |

Slice 6.36 adds a bounded diagnostics layer:

- safe diagnostics endpoint in gateway;
- aggregate-only serializer;
- helper source allowlist with `other` bucket fallback;
- non-production hard deny;
- explicit diagnostics token requirement.

## 3. Security Model

Security decisions:

| Control | Decision |
| --- | --- |
| PII/JWT exposure | Forbidden by response shaping and field allowlist. |
| Raw claims/payload | Forbidden; never returned by diagnostics endpoint. |
| Fail-closed behavior | Endpoint returns `404` unless all gates pass. |
| Production safety | Hard deny in `production` even if flag/token are set. |
| Access credential | Dedicated diagnostics token via `x-go2asia-debug-token`. |
| Business auth separation | Diagnostics access model is independent from Clerk user auth path. |
| Cache behavior | `Cache-Control: no-store` to avoid storage/replay artifacts. |

Why diagnostics is separated from business auth:

- avoids coupling operator observability to end-user session/token lifecycle;
- avoids accidental widening of Clerk/business authorization surfaces;
- keeps diagnostics control explicit and operationally revocable.

## 4. Threat Model

| Threat | Mitigation | Residual risk |
| --- | --- | --- |
| Accidental endpoint exposure | Endpoint is disabled by default and hidden as `404`. | Misconfiguration risk remains if operator enables diagnostics unintentionally in non-prod. |
| Debug route discovery attempts | Same `404` response pattern when disabled/unauthorized. | Timing or behavior analysis can still infer route behavior under advanced probing. |
| Diagnostics token leakage | Dedicated token, rotatable independently from business secrets. | If leaked, non-prod diagnostics data can be read until rotation. |
| Helper source abuse via unexpected strings | Allowlist serializer; unknown values collapsed into `other`. | Cardinality pressure still possible in process memory before serialization collapse. |
| Oversized payload or identity dump | Response schema contains only counters and metadata. | Existing evidence header path still requires independent governance in downstream logging. |
| Logging leakage (JWT/email/claims) | Documented non-goal; diagnostics endpoint does not log identity payloads. | Other runtime logs outside this endpoint can still be misconfigured by future changes. |
| Observability abuse (polling storm) | Intended low-frequency operator endpoint, no-store response. | No dedicated rate limiter in this slice; rely on operational discipline and environment controls. |
| Cloudflare isolate misunderstanding | Explicit scope field and docs warn `process_local_isolate` only. | Operators may still misread local counters as global unless runbook is followed. |

## 5. Diagnostics Endpoint Specification

Endpoint:

- `GET /v1/_debug/identity-shadow/aggregate`

Required runtime conditions:

1. `GATEWAY_ENABLE_IDENTITY_CORE_DIAGNOSTICS=true`
2. `ENVIRONMENT` is not `production`
3. `GATEWAY_IDENTITY_CORE_DIAGNOSTICS_TOKEN` is configured
4. request header `x-go2asia-debug-token` matches configured token

Otherwise:

- response is `404` with not-found payload style.

Response headers:

- `Content-Type: application/json`
- `Cache-Control: no-store`
- `X-Request-ID: <requestId>`

Allowed response fields (safe schema):

- `schemaVersion`
- `generatedAt`
- `env`
- `version`
- `scope` (`process_local_isolate`)
- `flags.shadowCompareEnabled`
- `flags.evidenceEnabled`
- `flags.aggregationEnabled`
- `counters.total`
- `counters.aligned`
- `counters.migration_blocker`
- `counters.unexpected_divergence`
- `counters.helper_failed`
- `reasonCodeCounts`
- `helperSourceCounts` (allowlisted values + optional `other`)

Intentionally omitted fields:

- legacy/helper role values per request;
- user IDs, emails, JWTs;
- raw claims, raw helper payloads;
- raw request/response headers;
- any per-request evidence object.

## 6. Operational Runbook

### 6.1 Enable diagnostics (staging)

1. Confirm environment is staging.
2. Set `GATEWAY_ENABLE_IDENTITY_CORE_DIAGNOSTICS=true`.
3. Set secret `GATEWAY_IDENTITY_CORE_DIAGNOSTICS_TOKEN=<strong-random-token>`.
4. Deploy/update Worker config.

### 6.2 Verify diagnostics endpoint

1. Send a request with the correct debug token header.
2. Confirm `200` response and safe aggregate schema.
3. Confirm `Cache-Control: no-store`.
4. Send a request without token and confirm `404`.

### 6.3 Validation window usage

During a controlled window:

1. run normal staging traffic exercises;
2. sample aggregate snapshot periodically;
3. review only counters and bucket distributions;
4. check stop conditions;
5. record outcome in staging review artifact.

### 6.4 Disable diagnostics

1. Set `GATEWAY_ENABLE_IDENTITY_CORE_DIAGNOSTICS=false` (or unset).
2. Rotate/remove `GATEWAY_IDENTITY_CORE_DIAGNOSTICS_TOKEN`.
3. Confirm endpoint returns `404`.

### 6.5 Rollback procedure

Diagnostics rollback (no business auth impact):

1. disable diagnostics flag;
2. rotate diagnostics token;
3. verify endpoint hidden (`404`).

Identity shadow rollback (from Slice 6.29/6.35):

1. `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE_AGGREGATION=false`
2. `GATEWAY_ENABLE_IDENTITY_CORE_EVIDENCE=false`
3. `GATEWAY_ENABLE_IDENTITY_CORE_SHADOW_COMPARE=false`

## 7. Validation Flow (Phase 1-8)

Operational sequence retained:

1. Phase 1: staging readiness (`/health`, `/ready`, route safety)
2. Phase 2: baseline flags off
3. Phase 3: baseline safe probes
4. Phase 4: enable SHADOW_COMPARE
5. Phase 5: manual + automated shadow validation
6. Phase 6: enable EVIDENCE and perform safety checks
7. Phase 7: enable AGGREGATION and read safe counters
8. Phase 8: rollback exercise and post-rollback verification

Stop conditions (unchanged):

- auth regression;
- RF regression;
- unsafe evidence detected;
- `unexpected_divergence > 0`;
- `helper_failed > 0`;
- unexpected `X-Gateway-Auth` shape change;
- abnormal 401/403 spike during window.

Acceptable limitation:

- aggregate snapshot is isolate-local, not a cluster-global metric source.

## 8. Cloudflare Workers Constraints

Relevant platform constraints:

| Constraint | Operational implication |
| --- | --- |
| Process-local module memory | Counters reflect only current isolate state. |
| Isolate lifecycle | Counters reset on cold start/redeploy. |
| No shared in-memory state | No cluster-wide exact total without external sink. |
| Edge execution variability | Different isolates can show different local snapshots. |
| Stateless scaling model | Snapshot endpoint is intentionally bounded and local. |

This design is intentional: safe local visibility first, global telemetry later if required.

## 9. Runtime Overhead Analysis

Why this implementation is low overhead:

- aggregation update is O(1) per shadow comparison;
- diagnostics snapshot reads already-available in-memory counters;
- no synchronous external telemetry call in auth path;
- no heavy logging addition or payload serialization expansion on hot path;
- diagnostics endpoint executes only on explicit operator request.

Expected impact:

- negligible additional latency on standard business routes;
- bounded memory overhead for counter maps;
- no changes to auth decision logic.

## 10. Future Evolution

### Phase A (current)

- process-local safe diagnostics endpoint;
- strict response shaping and token gating;
- non-production hard deny.

### Phase B (recommended)

- optional Workers Analytics Engine integration with same safe buckets;
- sampled writes only;
- no per-request identity payload storage.

### Phase C (future)

- centralized metrics pipeline and/or OTEL-compatible stream;
- SLO/alerting on divergence/failure buckets;
- explicit multi-isolate aggregation semantics.

Explicit non-goals for this slice:

- production rollout changes;
- business auth rewrites;
- raw diagnostics dumps;
- PII/JWT observability payloads;
- aggressive refactor of gateway routing/auth code.

## 11. Operational Decisions Recorded

1. Diagnostics access is separately gated from business auth.
2. Diagnostics is non-production only.
3. Endpoint is fail-closed and discovery-resistant (`404` when unauthorized/disabled).
4. Response is whitelist-shaped aggregate-only.
5. Unknown helperSource values are collapsed to `other`.
6. Snapshot semantics are explicitly local (`process_local_isolate`).

