# VIP Entitlement Runtime Authority — Canonical Enforcement Design Review v1

Date: 2026-05-14  
Status: `REVIEW_READY_DESIGN_ONLY_NOT_ENFORCEMENT_APPROVED`  
Slice: `VIP Entitlement Runtime Authority / Slice 6`  
Mode: canonical entitlement enforcement design review, governance boundary, no runtime changes, no enforcement

## 1. Executive Summary

**FACT:** Slice 6 is a design/review artifact only.

**FACT:** Entitlement enforcement is not approved.

**FACT:** Runtime authority does not change. Current RF paid claim authority remains `legacy_vip_spacer`.

**FACT:** Durable diagnostics remain `non_authoritative_observability_only`.

**TARGET:** This document describes a safe future design for canonical entitlement enforcement only if a later separate governance artifact explicitly approves enforcement.

**IMPORTANT:** `allowed_for_review_only != enforcement approval`.

## 2. Current Authority Baseline

| Area | Current status | Slice 6 effect |
|---|---|---|
| RF paid claim VIP authority | `legacy_vip_spacer_still_authoritative` | unchanged |
| Canonical entitlement | target contract and shadow evidence exist; not authoritative | unchanged |
| Source read adapter | diagnostics/shadow-only source-read path | unchanged |
| Durable diagnostics sink | aggregate-only, non-authoritative observability | unchanged |
| Durable staging evidence | `review_ready` for design discussion after Slice 5B.4/5B.5 | no approval |
| Production | untouched | untouched |
| RF claim / redeem behavior | legacy behavior preserved | unchanged |
| Points spend behavior | separate Points authority; no available-only enforcement in this slice | unchanged |

**FACT:** Slice 5B.5 revalidated the gate as:

```text
preconditions_gate_revalidation_status: review_ready
future_enforcement_slice_status: allowed_for_review_only
enforcement_approval_status: not_approved
authority_runtime_status: legacy_vip_spacer_still_authoritative
```

## 3. Review Scope

Included in this design review:

- canonical enforcement boundary;
- future read-path design;
- failure modes and safety policy;
- rollback design;
- cache and TTL governance questions;
- identity mismatch handling;
- replay protection design;
- observability and durable diagnostics requirements;
- staged rollout prerequisites.

Excluded from this slice:

- runtime implementation;
- migrations;
- production enablement;
- runtime enforcement endpoints;
- claim/redeem behavior changes;
- paid claim flow changes;
- available-only spend enforcement;
- referral/network runtime;
- tokenomics, G2A, NFT, Totem, or on-chain work;
- Connect/Gateway entitlement rollout;
- hidden authority migration under a refactor label.

## 4. Future Enforcement Boundary Proposal

**TARGET:** A future enforcement boundary must separate these concerns:

| Concern | Future owner / surface | Future role | Slice 6 status |
|---|---|---|---|
| Read decision | VIP Entitlement Authority decision resolver or approved cache | produce fresh decision response | design only |
| Entitlement resolution | canonical entitlement owner | own lifecycle and source reconciliation | not implemented here |
| Paid claim eligibility | RF claim path as consumer | combine RF preconditions, entitlement decision, and Points spend result | unchanged today |
| Diagnostics logging | RF diagnostics + durable aggregate sink | record aggregate-safe counters | non-authoritative |
| Audit evidence | entitlement authority + RF consumer audit metadata | prove why a future allow/deny happened | requirement only |
| Operator visibility | internal admin aggregate views/runbooks | monitor counters, rollback, drift, failures | requirement only |

**TARGET:** Canonical source may become authority only after separate explicit governance approval.

**NON-GOAL:** Durable diagnostics, RF shadow compare, Gateway claims, Connect projections, `identity-core`, and legacy roles must not become hidden entitlement authority.

## 5. Proposed Read Path Model

Future read path, if separately approved:

1. RF receives trusted user identity from the authenticated server-side context.
2. RF requests a `vip_spend_access` decision from the approved canonical decision boundary.
3. The canonical source or approved cache returns a decision-compatible response.
4. The cache/TTL layer proves freshness, revision compatibility, invalidation status, and expiry bounds.
5. RF maps the decision into claim eligibility:
   - allow only if entitlement is active, fresh, non-stale, non-degraded, identity-matched, and audit-traceable;
   - deny for inactive, expired, revoked, refunded, cancelled, not started, stale, unavailable, degraded, malformed, or identity-untrusted states.
6. RF emits aggregate-safe diagnostics and future enforcement decision counters.
7. RF records safe audit metadata required for operator review.

**NON-GOAL:** This model does not define endpoints, migrations, table changes, or code paths.

## 6. Enforcement Decision Matrix

| Future design case | Expected future behavior | Fail-open / fail-closed recommendation | Evidence required before future approval | Enforcement allowed today? |
|---|---|---|---|---|
| Canonical active + valid VIP entitlement | RF may proceed to remaining RF and Points gates if decision is fresh and audit-traceable | fail-closed if any required field is missing | canonical source reliability, fresh decision evidence, audit trace, RF/Points regression, rollback drill | No, not approved in Slice 6 |
| Canonical inactive / expired | RF blocks paid claim eligibility | fail-closed | expired/inactive staging cases, reason counters, audit trace, no voucher/Points side effects | No, not approved in Slice 6 |
| Canonical unavailable | RF blocks paid claim eligibility | fail-closed | outage/timeout evidence, fallback counters, operator alert/runbook, no hidden role fallback | No, not approved in Slice 6 |
| Identity mismatch | RF blocks paid claim eligibility and records review-safe counter | fail-closed | subject mismatch tests, trusted identity contract, no auto-correction proof | No, not approved in Slice 6 |
| Cache stale | RF blocks paid claim eligibility | fail-closed | TTL policy artifact, stale cache test, revocation/refund/expiry invalidation evidence | No, not approved in Slice 6 |
| Replay suspected | RF blocks or returns idempotency conflict according to approved replay policy | fail-closed for semantic mismatch; idempotent no-op for exact duplicate | replay matrix, idempotency key policy, audit correlation, stale grant replay denial | No, not approved in Slice 6 |
| Diagnostics sink unavailable | RF behavior must not be controlled by diagnostics; evidence closure becomes blocked | fail-open for diagnostics only, never for entitlement decision | sink failure counters, non-blocking diagnostics proof, evidence rerun policy | No, not approved in Slice 6 |
| Legacy/canonical drift | Future enforcement cannot proceed until drift class is explained or remediated | fail-closed for enforcement go/no-go | drift class counters, owner disposition, remediation/no-go decision | No, not approved in Slice 6 |
| Unknown entitlement state | RF blocks paid claim eligibility | fail-closed | unknown-state counters, source registry proof, malformed/unknown source tests | No, not approved in Slice 6 |

## 7. Failure Modes & Safety Policy

| Failure mode | Future safety policy | Evidence / governance requirement |
|---|---|---|
| Canonical outage | deny paid claim eligibility; no legacy hidden grant fallback | outage tests, operator alerting, rollback plan |
| Slow canonical source | enforce timeout budget; degraded/timeout maps to deny | latency buckets, timeout counters, max latency policy |
| Partial response | treat as malformed/degraded and deny | schema validation evidence and malformed response tests |
| Inconsistent identity | deny and route to review; do not repair automatically | subject matching rules and mismatch counters |
| Stale cache | deny and emit stale cache counter | TTL policy, invalidation proof, stale cache test |
| Replayed entitlement | deny stale/semantic mismatch replay | idempotency/replay matrix and audit trail |
| Diagnostics write failure | do not change claim behavior; block evidence closure if needed | durable failure counters and rerun policy |
| Unknown drift class | block approval and classify before rollout | drift taxonomy ownership and escalation |
| Admin endpoint exposure risk | internal/admin-only, aggregate-only, no public OpenAPI | authz tests, forbidden-field scan, production-disabled proof |

## 8. TTL / Cache Governance

**TARGET:** TTL policy must be a governance artifact before any enforcement approval.

Required governance decisions:

- who owns TTL policy: VIP Entitlement Authority with Runtime Governance and Security review;
- where TTL policy is recorded: canonical contract or explicit enforcement approval artifact;
- when cache is stale: any decision outside approved freshness, beyond `expiresAt`, after revocation/refund/cancellation/reconciliation correction, or with incompatible source/decision version;
- whether cached entitlement can be used for paid claim: only approved cache, only fresh, only non-degraded, only with audit trace and invalidation semantics;
- what evidence is required: stale cache denial, active grant bounded by expiry, revocation/refund invalidation, source timeout fail-closed, replay-denial evidence.

**NON-GOAL:** Slice 6 does not set a concrete runtime TTL value because no approved TTL threshold exists in the reviewed governance chain.

## 9. Replay Governance

Future enforcement approval must require:

- replay detection across subject, action, resource scope, entitlement id/revision, decision version, evaluation window, source id, and adapter version;
- deterministic idempotency for lifecycle events and paid claim side effects;
- request correlation that is audit-safe and not exported as raw ids in diagnostics;
- audit trail that can explain allow/deny without leaking tokens, PII, voucher ids, transaction ids, or payment payloads;
- stale token/request prevention after expiry, revocation, refund, cancellation, source downgrade, or policy version change;
- evidence showing exact duplicate handling, semantic mismatch conflicts, stale grant replay denial, and delayed retry behavior.

## 10. Identity Mismatch Governance

Identity keys involved in future design:

- trusted runtime subject user id;
- entitlement subject user id;
- RF paid claim principal;
- Gateway/Auth derived subject, if separately approved as derived projection;
- canonical entitlement id/revision for audit correlation.

Mismatch handling:

- detect mismatch whenever trusted runtime subject and entitlement subject do not align;
- block paid claim eligibility for untrusted or inconsistent identity;
- route ambiguous cases to review with aggregate-safe counters;
- emit identity mismatch counters and reason buckets;
- do not automatically repair identity mismatch in RF, Gateway, Connect, diagnostics, or `identity-core`.

**RATIONALE:** Automatic repair can convert a security incident or source corruption into unauthorized entitlement grant. Identity correction must remain an owner-reviewed reconciliation action.

Required counters:

- `identity_untrusted`;
- `identity_mismatch`;
- `subject_missing`;
- `entitlement_subject_missing`;
- `gateway_subject_mismatch`;
- `source_subject_mismatch`;
- `review_required_identity_mismatch`.

## 11. Observability & Durable Diagnostics Requirements

**FACT:** Durable sink remains non-authoritative.

**TARGET:** Future enforcement observability must include aggregate-only counters:

- total decision attempts;
- allow/deny decision counters;
- reason code counters;
- canonical drift classes;
- source health and adapter status counters;
- cache stale counters;
- cache hit/miss counters if safe;
- replay counters;
- identity mismatch counters;
- fallback/degraded/unavailable counters;
- audit trace presence counters;
- diagnostics sink failure counters;
- rollback state counters.

Forbidden in diagnostics, exports, logs, screenshots, or evidence bundles:

- raw JWTs, `Authorization`, `X-Gateway-Auth`, Clerk/service tokens;
- raw role arrays or raw user identifiers;
- emails/profile data;
- payment payloads, billing receipts, source refs, entitlement metadata;
- voucher ids, transaction ids, external ids;
- wallet ledger rows and partner settlement data;
- raw correlation ids, request ids, dedupe keys, idempotency keys;
- G2A/NFT/Totem/on-chain proofs;
- SQL text, raw exception messages, request/response bodies.

## 12. Rollback Design

Future enforcement design must support:

- instant flag rollback of enforcement mode;
- return to `legacy_vip_spacer` authority if the approved rollout artifact permits emergency rollback;
- diagnostics-only mode after rollback when safe;
- no data loss requirement for audit/evidence counters;
- no destructive migrations as part of rollback;
- no Points ledger correction, voucher correction, or wallet correction merely because enforcement flag was disabled;
- operator evidence after rollback:
  - flag state;
  - RF readiness;
  - baseline paid claim result;
  - Points spend regression result;
  - diagnostics/admin snapshot status;
  - failure/drift counters;
  - reason and timestamp.

**TARGET:** Rollback must be proven in staging before any later enforcement approval.

## 13. Staged Rollout Prerequisites

The following must be closed before any separate future enforcement approval:

- canonical source reliability and source authenticity;
- explicit TTL/cache governance;
- replay governance and idempotency matrix;
- identity mismatch governance;
- worker log scan closure or approved replacement evidence strategy;
- staging evidence rerun under the proposed enforcement design;
- operator runbook;
- rollback drill;
- security/fraud review;
- QA matrix and regression evidence;
- admin endpoint exposure review;
- durable diagnostics forbidden-field scan;
- drift class owner/explanation/disposition under proposed design;
- separate future governance artifact that explicitly defines whether enforcement may proceed and what scope it would cover.

## 14. Explicit Non-Approval Statement

"Slice 6 does not approve entitlement enforcement. This document is a design review artifact only. Runtime authority remains legacy_vip_spacer. Durable diagnostics remain non-authoritative observability. Any future enforcement requires a separate explicit governance approval artifact."

## 15. Acceptance Criteria

This document is ready when:

- new markdown file is created;
- no runtime code is changed;
- no migrations are created or changed;
- no endpoint changes are made;
- no production changes are made;
- no enforcement is enabled;
- non-approval is clearly stated;
- diagnostics are clearly separated from authority;
- remaining blockers are mapped to future prerequisites;
- decision matrix is included;
- rollback design is included;
- observability requirements are included;
- multi-agent review summary is included.

Acceptance status for Slice 6:

```text
document_created: yes
runtime_code_changed: no
migrations_changed: no
endpoint_changes: no
production_changes: no
enforcement_enabled: no
non_approval_statement_present: yes
diagnostics_authority_separation_present: yes
decision_matrix_present: yes
rollback_design_present: yes
observability_requirements_present: yes
multi_agent_review_summary_present: yes
```

## 16. Multi-Agent Review Summary

### Architect review

- Checked: authority boundary, future read path, separation between RF claim eligibility, canonical decision, diagnostics, and audit evidence.
- Risks found: hidden authority migration, treating approved cache as authority without TTL/invalidation governance, confusing diagnostics evidence with entitlement truth.
- Confirms Slice 6 boundaries: yes.
- Enforcement allowed in this slice: no. Enforcement is explicitly prohibited in Slice 6.

### Backend review

- Checked: future backend read-path concerns, failure semantics, cache/replay/idempotency requirements, endpoint and migration boundaries.
- Risks found: canonical outage fallback abuse, stale cache grant, partial response handling, replay with old grant, admin snapshot misuse as runtime input.
- Confirms Slice 6 boundaries: yes.
- Enforcement allowed in this slice: no. No runtime code, endpoint, migration, or feature flag work is allowed here.

### Security review

- Checked: fail-closed policy, identity mismatch, replay protection, forbidden diagnostics fields, admin endpoint exposure risk, RF paid claim abuse surface.
- Risks found: stale/degraded source grant, automatic identity repair, raw identity/payment leakage in evidence, role fallback abuse, replay of expired/revoked entitlement.
- Confirms Slice 6 boundaries: yes.
- Enforcement allowed in this slice: no. Any future enforcement requires separate explicit approval and security sign-off.

### QA review

- Checked: future test matrix and evidence prerequisites for active/expired/unavailable entitlement, identity mismatch, stale cache, replay, diagnostics failure, drift, rollback.
- Risks found: evidence claims without runtime proof, incomplete worker log scan, missing post-design staging rerun, insufficient rollback drill coverage.
- Confirms Slice 6 boundaries: yes.
- Enforcement allowed in this slice: no. Slice 6 creates review-ready documentation only.

### Technical writer review

- Checked: canon terminology, required non-approval wording, authority/diagnostics separation, alignment with Slice 5B.5 status.
- Risks found: wording that could be read as approval, stale slice numbering, mixing future design with current runtime facts.
- Confirms Slice 6 boundaries: yes.
- Enforcement allowed in this slice: no. `allowed_for_review_only != enforcement approval`.

### Analyst review

- Checked: required section coverage, acceptance criteria, remaining blockers, scope and out-of-scope consistency.
- Risks found: missing explicit prerequisites could allow premature rollout interpretation; decision matrix must mark every runtime enforcement case as not approved today.
- Confirms Slice 6 boundaries: yes.
- Enforcement allowed in this slice: no. Approval status remains `not_approved`.

## Final Classification

```text
slice_6_status: review_ready_design_only
preconditions_gate_revalidation_status: review_ready
future_enforcement_slice_status: allowed_for_review_only
enforcement_approval_status: not_approved
authority_runtime_status: legacy_vip_spacer_still_authoritative
runtime_change_status: no_runtime_change
diagnostics_sink_authority_status: non_authoritative_observability_only
production_status: not_touched
recommended_next_slice: slice_7_explicit_enforcement_governance_approval_or_worker_log_scan_closure
```

**IMPORTANT:** `allowed_for_review_only != enforcement approval`.
