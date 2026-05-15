# VIP Entitlement Runtime Authority — Identity Mismatch Governance Policy v1

Date: 2026-05-14  
Status: `REVIEW_READY_IDENTITY_MISMATCH_GOVERNANCE_POLICY_NOT_ENFORCEMENT_APPROVED`  
Slice: `VIP Entitlement Runtime Authority / Slice 12`  
Mode: docs-first identity mismatch governance policy, staging-first, no runtime implementation, no enforcement

## 1. Executive Summary

**FACT:** Slice 12 defines identity mismatch governance policy for a future canonical entitlement enforcement path.

**FACT:** Entitlement enforcement is not approved.

**FACT:** Runtime behavior is unchanged.

**FACT:** No identity runtime changes are made.

**FACT:** No identity auto-repair is added or allowed.

**FACT:** No Auth, Gateway, or Connect rollout is included.

**IMPORTANT:** `allowed_for_review_only != enforcement approval`.

## 2. Current Status

```text
slice_12_status: identity_mismatch_governance_policy_defined_not_implemented
identity_mismatch_governance_status: policy_defined_not_implemented
runtime_identity_behavior_status: unchanged
identity_auto_repair_status: not_allowed_not_implemented
auth_gateway_connect_rollout_status: not_in_scope
enforcement_approval_status: not_approved
authority_runtime_status: legacy_vip_spacer_still_authoritative
diagnostics_sink_authority_status: non_authoritative_observability_only
runtime_change_status: no_runtime_change
production_status: not_touched
```

## 3. Scope

Included:

- identity mismatch governance policy;
- trusted subject model;
- entitlement subject model;
- RF paid claim principal boundary;
- mismatch taxonomy;
- identity downgrade handling;
- auto-repair prohibition;
- review-safe evidence requirements.

Excluded:

- identity runtime implementation;
- Auth/Gateway/Connect changes;
- runtime subject mapping changes;
- enforcement activation;
- runtime APIs;
- migrations;
- feature flags;
- logging/tooling changes;
- Worker Log Scan execution;
- production rollout.

## 4. Identity Governance Boundary

Identity governance boundary:

- identity governance is policy-only in Slice 12;
- identity governance does not implement runtime behavior;
- identity governance does not authorize enforcement;
- identity governance cannot change RF paid claim behavior;
- identity diagnostics cannot become authority;
- identity mismatch evidence cannot auto-correct entitlement;
- identity policy cannot bypass TTL/cache invalidation, replay governance, canonical reliability, rollback, or approval gates.

**FACT:** Current RF paid claim authority remains `legacy_vip_spacer_still_authoritative`.

**FACT:** Durable diagnostics remain `non_authoritative_observability_only`.

## 5. Identity Subject Model

Subject definitions:

- trusted runtime subject: authenticated server-side subject used by a future approved paid claim decision boundary;
- entitlement subject: subject bound to the entitlement record;
- RF paid claim principal: principal initiating the RF paid claim flow;
- Gateway/Auth derived subject: derived projection from Gateway/Auth, usable only if separately approved for a named scope;
- canonical entitlement subject: normalized subject identity stored in or resolved by the canonical entitlement owner;
- operator/admin subject: internal reviewer or admin actor, never the same as the paid claim principal for entitlement grant purposes;
- diagnostics subject references: aggregate-safe buckets or audit-trace presence indicators only, never raw identity authority.

Mandatory guardrails:

- client-side hints are not trusted authority;
- raw role arrays are not identity authority;
- diagnostics are not identity authority;
- operator/admin identity must not be confused with RF paid claim principal;
- Gateway/Auth derived subject must not become enforcement authority without separate explicit approval.

## 6. Identity Mismatch Taxonomy

| Mismatch class | Governance meaning | Future risk | Future recommended handling |
|---|---|---|---|
| Trusted subject missing | Future decision lacks authenticated server-side subject | unknown principal could receive grant | fail closed and classify `subject_missing` |
| Entitlement subject missing | Entitlement record lacks subject binding | entitlement cannot be safely attributed | fail closed and classify `entitlement_subject_missing` |
| Trusted subject != entitlement subject | Runtime subject does not match entitlement-bound subject | unauthorized grant to wrong subject | fail closed and classify `identity_mismatch` |
| RF principal != trusted subject | Claim initiator does not match trusted runtime subject | paid claim under wrong principal | fail closed and classify `identity_mismatch` |
| Gateway/Auth subject mismatch | Derived Gateway/Auth subject conflicts with trusted runtime or entitlement subject | derived projection becomes false authority | fail closed or review-safe classification |
| Source subject mismatch | Source-read subject differs from trusted runtime or entitlement subject | source corruption or wrong entitlement attribution | fail closed and classify `source_subject_mismatch` |
| Stale cached subject | Cached decision is bound to outdated or changed subject | stale identity grant | invalidate cached decision and fail closed |
| Identity trust downgrade | Previously trusted subject loses trust or required context | old trust state reused for grant | fail closed and require fresh trusted identity |
| Replay with different subject | Replay/idempotency context repeats under another subject | replay abuse or grant transfer | deny/conflict and classify review-safe |
| Admin/operator subject confusion | Operator/admin actor is confused with paid claim principal | internal review actor grants runtime eligibility | deny, separate operator review from runtime grant |
| Diagnostics subject leakage | Evidence exposes raw subject or enough low-volume context to identify user | privacy breach and correlation risk | reject evidence, use aggregate-safe buckets only |
| Unknown subject state | Subject state cannot be proven trusted, matched, and current | ambiguous grant boundary | fail closed |

## 7. Auto-Repair Prohibition Policy

Mandatory policy:

- RF must not auto-repair identity mismatch;
- Gateway/Auth must not silently repair entitlement subject;
- Connect must not repair entitlement subject through projections;
- diagnostics/logs must not repair identity;
- durable diagnostics must not rewrite entitlement subject;
- operator tools must not rewrite entitlement subject without explicit reviewed reconciliation process;
- replay, cache, and canonical source paths must not auto-repair identity mismatch as a side effect.

Rationale:

- auto-repair can convert source corruption, stale identity, account takeover, replay abuse, or operator confusion into unauthorized grant;
- identity correction must be an owner-reviewed reconciliation process with explicit audit-safe evidence;
- automatic correction is not enforcement approval and must not be hidden behind diagnostics or retry handling.

## 8. Fail-Closed Identity Policy

Future recommended behavior for paid claim enforcement planning:

- identity mismatch = fail closed for paid claim enforcement;
- identity untrusted = fail closed for paid claim enforcement;
- trusted subject missing = fail closed for paid claim enforcement;
- entitlement subject missing = fail closed for paid claim enforcement;
- identity downgrade = fail closed for paid claim enforcement;
- Gateway/Auth subject mismatch = fail closed unless a separate approved projection contract defines safe review handling;
- stale cached subject = fail closed and invalidate subject-bound cached decision;
- unknown subject state = fail closed.

**FACT:** This policy does not enable enforcement.

**FACT:** Slice 12 does not add identity handling, auto-repair handling, Auth/Gateway/Connect rollout, or runtime decision logic.

## 9. Review-Safe Routing Policy

What goes to review:

- identity mismatch counters;
- untrusted identity counters;
- subject missing counters;
- entitlement subject missing counters;
- Gateway/Auth subject mismatch counters;
- source subject mismatch counters;
- stale cached subject counters;
- identity downgrade counters;
- review-required identity mismatch counters.

What is denied in future enforcement planning:

- paid claim eligibility when trusted subject is missing;
- paid claim eligibility when entitlement subject is missing;
- paid claim eligibility when trusted subject and entitlement subject mismatch;
- paid claim eligibility when RF paid claim principal mismatches trusted subject;
- paid claim eligibility when identity trust downgrades or becomes unknown.

Operator review framing:

- operator review can classify, investigate, and request owner-reviewed reconciliation;
- operator review must not automatically grant paid claim eligibility;
- no raw PII should appear in review artifacts;
- no automatic grant may occur after review without separate canonical reconciliation and separate approval for any enforcement behavior.

## 10. Audit-Safe Identity Evidence Policy

Allowed:

- aggregate-safe mismatch counters;
- normalized reason buckets;
- identity trust status buckets;
- audit trace presence counters;
- safe review-required counters;
- source/adapter status buckets;
- policy version buckets;
- decision version buckets.

Forbidden:

- raw user ids;
- emails;
- raw Gateway/Auth ids;
- raw Clerk ids;
- raw role arrays;
- raw tokens;
- authorization headers;
- raw request ids;
- raw correlation ids;
- raw idempotency keys;
- raw replay keys;
- payment payloads;
- voucher ids;
- transaction ids;
- wallet ledger rows;
- raw request or response bodies;
- SQL text;
- raw exception messages or stack traces containing secrets.

**TARGET:** Identity evidence must explain class and aggregate outcome without becoming identity authority or revealing a user.

## 11. Interaction With Replay / TTL / Canonical Reliability

Dependencies:

- replay policy depends on trusted subject;
- stale cached subject can create replay abuse;
- identity downgrade invalidates cached decisions;
- canonical reliability cannot override identity mismatch;
- cache must not reuse decision after identity downgrade;
- replay must not reuse grant under different subject;
- canonical source authenticity must not bypass trusted identity boundary;
- source/schema/version compatibility must include subject compatibility.

Out of scope for Slice 12:

- full replay governance closure beyond Slice 11 policy;
- runtime TTL value approval;
- full canonical source reliability closure;
- runtime identity implementation.

## 12. Failure Mode Policy

Recommended future behavior for paid claim enforcement planning:

- missing trusted subject: fail closed for paid claim enforcement;
- missing entitlement subject: fail closed for paid claim enforcement;
- subject mismatch: fail closed for paid claim enforcement;
- Gateway/Auth mismatch: fail closed for paid claim enforcement unless separately approved review handling exists;
- identity trust downgrade: fail closed for paid claim enforcement;
- identity source unavailable: fail closed for paid claim enforcement;
- stale cached subject: fail closed and invalidate subject-bound cached decision;
- identity mismatch during replay: fail closed or conflict according to approved replay policy;
- identity mismatch after rollback: follow approved rollback authority boundary and fail closed for hybrid identity states;
- malformed subject metadata: fail closed for paid claim enforcement.

**FACT:** This policy does not enable enforcement.

**FACT:** Slice 12 does not add identity runtime behavior.

## 13. Evidence Requirements Before Enforcement

Future evidence requirements:

- identity mismatch matrix;
- trusted subject tests;
- missing subject tests;
- subject mismatch tests;
- Gateway/Auth mismatch tests;
- stale cached subject tests;
- identity downgrade tests;
- replay with different subject tests;
- rollback identity tests;
- malformed subject metadata tests;
- audit-safe evidence review;
- targeted Worker Log Scan or equivalent observability privacy audit before enforcement;
- controlled staging matrix under proposed enforcement design.

Evidence constraints:

- evidence must be staging-first;
- evidence must be aggregate-safe;
- evidence must not include raw user ids, emails, raw Gateway/Auth ids, raw Clerk ids, raw role arrays, tokens, request ids, correlation ids, payment payloads, voucher ids, transaction ids, SQL text, or raw stack traces;
- evidence completion is not enforcement approval.

## 14. Approval Boundary

These are not approval:

- this Slice 12 document;
- identity mismatch taxonomy;
- auto-repair prohibition;
- fail-closed identity policy;
- identity evidence requirements;
- `review_ready`;
- durable diagnostics;
- replacement evidence strategy.

Approval requires:

- separate explicit governance approval artifact;
- named enforcement scope;
- named authority boundary;
- runtime identity implementation review;
- Auth/Gateway/Connect scope review if involved;
- QA/security sign-off;
- staging evidence;
- rollback evidence;
- targeted/full Worker Log Scan or equivalent audit.

**IMPORTANT:** `allowed_for_review_only != enforcement approval`.

## 15. Explicit Non-Approval Statement

Slice 12 does not approve entitlement enforcement.
This document defines identity mismatch governance policy only.
No identity runtime implementation is added in Slice 12.
No identity auto-repair implementation is added in Slice 12.
Runtime authority remains legacy_vip_spacer.
Durable diagnostics remain non-authoritative observability.
Any future enforcement requires a separate explicit governance approval artifact.

## 16. Acceptance Criteria

Document is ready when:

- docs-only artifact is created;
- no runtime/code/API/migration changes are made;
- no identity runtime implementation is added;
- no auto-repair implementation is added;
- no Auth/Gateway/Connect rollout is included;
- no enforcement is enabled;
- no authority switch occurs;
- subject model is included;
- mismatch taxonomy is included;
- auto-repair prohibition is included;
- fail-closed identity policy is included;
- audit-safe identity evidence policy is included;
- evidence requirements are included;
- explicit non-approval statement is included;
- multi-agent review summary is included.

Acceptance status:

```text
document_created: yes
docs_only_artifact: yes
runtime_code_changed: no
api_routes_changed: no
migrations_changed: no
identity_runtime_implementation_added: no
auto_repair_implementation_added: no
auth_gateway_connect_rollout: no
enforcement_enabled: no
authority_switch: no
subject_model_included: yes
mismatch_taxonomy_included: yes
auto_repair_prohibition_included: yes
fail_closed_identity_policy_included: yes
audit_safe_identity_evidence_policy_included: yes
evidence_requirements_included: yes
explicit_non_approval_included: yes
multi_agent_review_summary_included: yes
```

## 17. Multi-Agent Review Summary

### Architect review

- Checked: trusted subject model, entitlement subject, RF paid claim principal boundary, Gateway/Auth derived subject, auto-repair prohibition, Auth/Gateway/Connect rollout boundary, replay/TTL/canonical interactions.
- Identity risks confirmed: wrong-subject grant, stale cached subject, derived subject becoming hidden authority, auto-repair converting corruption into grant.
- Remaining blockers: identity mismatch matrix evidence, trusted identity boundary evidence, canonical reliability, targeted Worker Log Scan or equivalent audit, explicit approval artifact.
- Confirms no runtime/enforcement boundary: yes.
- Enforcement allowed in Slice 12: No.

### Backend review

- Checked: subject model, mismatch classes, stale cached subject, identity downgrade, replay with different subject, rollback identity cases.
- Identity risks confirmed: ambiguous canonical entitlement subject, Gateway/Auth projection confusion, stale subject cache, hybrid rollback identity state.
- Remaining blockers: no identity implementation, no auto-repair implementation, no Auth/Gateway/Connect rollout, no runtime path evidence.
- Confirms no runtime/enforcement boundary: yes.
- Enforcement allowed in Slice 12: No.

### Security/Fraud review

- Checked: unauthorized grant via subject mismatch, identity downgrade, client-side hints, raw role arrays, auto-repair abuse, operator/admin subject confusion, identity correlation leakage.
- Identity risks confirmed: account/subject confusion, PII leakage, low-volume correlation, automatic repair abuse, untrusted client hints.
- Remaining blockers: audit-safe evidence review, mismatch fail-closed tests, targeted Worker Log Scan or equivalent audit, reviewed reconciliation process.
- Confirms no runtime/enforcement boundary: yes.
- Enforcement allowed in Slice 12: No.

### QA review

- Checked: future identity mismatch matrix, trusted subject tests, missing subject tests, subject mismatch tests, Gateway/Auth mismatch tests, stale cached subject tests, identity downgrade tests, replay with different subject tests, rollback identity tests.
- Identity risks confirmed: documentation-only closure without staging evidence, missing negative cases, missing privacy/log evidence for mismatch traces.
- Remaining blockers: controlled staging matrix, identity mismatch test bundle, rollback identity tests, observability privacy audit.
- Confirms no runtime/enforcement boundary: yes.
- Enforcement allowed in Slice 12: No.

### Technical writer review

- Checked: non-approval wording, status vocabulary, identity policy vs identity implementation distinction, auto-repair prohibition language, Auth/Gateway/Connect non-scope wording.
- Identity risks confirmed: words like block, deny, fail closed, and trusted subject can be misread as current runtime behavior.
- Remaining blockers: keep policy-only language and repeat approval boundary in future artifacts.
- Confirms no runtime/enforcement boundary: yes.
- Enforcement allowed in Slice 12: No.

### Analyst review

- Checked: required 17-section structure, mandatory statuses, subject model, mismatch taxonomy, auto-repair prohibition, fail-closed identity policy, review-safe routing, audit-safe identity evidence, failure modes, evidence requirements, approval boundary, acceptance criteria.
- Identity risks confirmed: missing any subject or mismatch class can hide unresolved unauthorized-grant paths.
- Remaining blockers: canonical source reliability, worker log scan/audit, explicit approval artifact.
- Confirms no runtime/enforcement boundary: yes.
- Enforcement allowed in Slice 12: No.

### Runtime governance review

- Checked: canonical-first boundary, no hidden identity authority, no RF paid claim behavior change, diagnostics non-authority, no Auth/Gateway/Connect rollout, no auto-correction.
- Identity risks confirmed: identity policy can become hidden gate, diagnostics can become false authority, auto-repair can bypass canonical reconciliation, mismatch evidence can leak identity.
- Remaining blockers: runtime identity implementation review if ever approved, staged enforcement-design matrix, canonical reliability proof, rollback drill.
- Confirms no runtime/enforcement boundary: yes.
- Enforcement allowed in Slice 12: No.

## Final Classification

```text
slice_12_status: review_ready_identity_mismatch_governance_policy
identity_mismatch_governance_status: policy_defined_not_implemented
runtime_identity_behavior_status: unchanged
identity_auto_repair_status: not_allowed_not_implemented
auth_gateway_connect_rollout_status: not_in_scope
enforcement_approval_status: not_approved
authority_runtime_status: legacy_vip_spacer_still_authoritative
diagnostics_sink_authority_status: non_authoritative_observability_only
runtime_change_status: no_runtime_change
production_status: not_touched
recommended_next_slice: canonical_source_reliability_policy
```

**IMPORTANT:** `allowed_for_review_only != enforcement approval`.
