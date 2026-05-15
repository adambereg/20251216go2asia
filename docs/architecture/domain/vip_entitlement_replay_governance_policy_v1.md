# VIP Entitlement Runtime Authority — Replay Governance Policy v1

Date: 2026-05-14  
Status: `REVIEW_READY_REPLAY_GOVERNANCE_POLICY_NOT_ENFORCEMENT_APPROVED`  
Slice: `VIP Entitlement Runtime Authority / Slice 11`  
Mode: docs-first replay governance policy, staging-first, no runtime implementation, no enforcement

## 1. Executive Summary

**FACT:** Slice 11 defines replay, idempotency, and retry governance policy for a future canonical entitlement enforcement path.

**FACT:** Entitlement enforcement is not approved.

**FACT:** Runtime behavior is unchanged.

**FACT:** No replay implementation is added.

**FACT:** No idempotency runtime changes are made.

**IMPORTANT:** `allowed_for_review_only != enforcement approval`.

## 2. Current Status

```text
slice_11_status: replay_governance_policy_defined_not_implemented
replay_governance_status: policy_defined_not_implemented
runtime_replay_behavior_status: unchanged
runtime_idempotency_status: unchanged
enforcement_approval_status: not_approved
authority_runtime_status: legacy_vip_spacer_still_authoritative
diagnostics_sink_authority_status: non_authoritative_observability_only
runtime_change_status: no_runtime_change
production_status: not_touched
```

## 3. Scope

Included:

- replay governance policy;
- idempotency boundary definitions;
- replay taxonomy;
- semantic replay classification;
- stale grant replay policy;
- audit-safe correlation policy;
- future evidence requirements.

Excluded:

- runtime replay handling;
- runtime retry logic;
- runtime idempotency implementation;
- runtime request dedupe;
- runtime APIs;
- migrations;
- feature flags;
- logging/tooling changes;
- Worker Log Scan execution;
- enforcement activation;
- production rollout.

## 4. Replay Governance Boundary

Replay governance boundary:

- replay governance is policy-only in Slice 11;
- replay governance does not implement runtime behavior;
- replay governance does not authorize enforcement;
- replay governance cannot change RF paid claim behavior;
- replay governance cannot become hidden authority;
- replay diagnostics and replay evidence remain governance inputs only;
- replay policy cannot bypass TTL/cache invalidation, identity trust, canonical reliability, rollback, or approval gates.

**FACT:** Current RF paid claim authority remains `legacy_vip_spacer_still_authoritative`.

**FACT:** Durable diagnostics remain `non_authoritative_observability_only`.

## 5. Replay Taxonomy

| Replay class | Governance meaning | Future risk | Future recommended handling |
|---|---|---|---|
| Exact duplicate replay | Same subject, action, resource scope, entitlement id/revision, decision version, evaluation window, and policy version as a previously classified request | duplicate side effects if not bounded | idempotent no-op only if explicitly approved by replay/idempotency matrix |
| Legitimate retry | Same request intent retried after transient network/client failure, still inside approved freshness and idempotency boundary | false denial of safe retry or duplicate side effect | deterministic no-op or conflict per approved matrix; never hidden grant |
| Stale grant replay | Previously valid grant reused after freshness, lifecycle, or policy boundary changed | unauthorized paid claim eligibility | fail closed for paid claim enforcement |
| Semantic mismatch replay | Technical retry whose meaning no longer matches original decision context | stale intent accepted as current authorization | deny, conflict, or review-safe classification |
| Replay after revoke/refund/cancel | Request repeats after entitlement is revoked, refunded, cancelled, or expired | old grant revived after invalidation | fail closed and require fresh canonical decision |
| Replay after identity downgrade | Replay occurs after trusted identity changes, degrades, or mismatches entitlement subject | grant to wrong or untrusted subject | fail closed and route to identity review-safe bucket |
| Replay after source downgrade | Replay occurs after canonical source reliability/authenticity degrades | source outage masked by old decision | fail closed unless fresh reliable canonical decision is separately approved |
| Replay with version mismatch | Decision, source, adapter, or policy version no longer matches approved contract | incompatible decision treated as grant | fail closed as version-incompatible |
| Replay with unknown freshness | Required freshness metadata is missing or unverifiable | unbounded stale grant | fail closed |
| Replay with malformed decision | Replayed decision is partial, malformed, or missing required audit/version fields | malformed grant path | fail closed |

## 6. Idempotency Boundary Policy

An idempotent no-op is a replay that:

- matches trusted subject;
- matches entitlement id;
- matches entitlement revision;
- matches decision version;
- matches evaluation window;
- matches action;
- matches resource scope;
- matches policy version;
- remains inside approved freshness and lifecycle boundaries;
- produces no additional spend, voucher, settlement, reward, referral, or entitlement side effect.

Replay abuse includes:

- any replay that changes subject, action, resource scope, entitlement revision, decision version, evaluation window, policy version, or lifecycle state;
- any replay after expiry, revocation, refund, cancellation, suspension, reconciliation correction, source downgrade, identity downgrade, or version incompatibility;
- any replay that attempts to reuse stale grant evidence as current authority.

Semantic conflict includes:

- same technical correlation but changed request intent;
- same idempotency context but changed entitlement lifecycle state;
- same client-visible action but changed RF resource, voucher, listing, offer, or paid claim scope;
- same decision metadata but changed policy/source/identity trust boundary.

**FACT:** Slice 11 does not approve runtime idempotency implementation.

**FACT:** No replay middleware is added in Slice 11.

## 7. Stale Grant Replay Policy

Future stale grant replay cases:

- replay after expiry;
- replay after revoke;
- replay after refund;
- replay after cancellation;
- replay after suspension;
- replay after reconciliation correction;
- replay after policy version change;
- replay after decision version change;
- replay after source downgrade.

Future recommended behavior for all cases:

- fail closed for paid claim enforcement;
- do not accept cached or previous grant as authority;
- require fresh canonical decision under approved policy;
- emit only aggregate-safe replay classification evidence.

**FACT:** This section defines future policy only. Enforcement is not enabled.

## 8. Semantic Replay Mismatch Policy

Semantic replay mismatch occurs when the repeated request no longer matches the original decision context, including:

- stale context replay;
- identity mismatch replay;
- resource scope mismatch;
- action mismatch;
- version mismatch replay;
- replay against changed lifecycle state;
- replay against changed policy version;
- replay after source or identity trust downgrade.

Mandatory governance policy:

- semantic mismatch replay must not silently succeed;
- future handling must be deny, conflict, or review-safe classification;
- semantic mismatch classification must not auto-repair identity, entitlement, cache, or source state;
- semantic mismatch evidence must remain aggregate-safe and non-authoritative.

## 9. Audit-Safe Correlation Policy

Replay evidence requirements:

- future evidence must distinguish exact duplicate retry, legitimate retry, stale grant replay, semantic mismatch replay, and malformed/unknown replay;
- future evidence must show idempotency boundary decisions without exporting raw keys;
- audit correlation must be safe enough to explain class and outcome without identifying a user, request, voucher, payment, wallet row, or settlement record.

Allowed:

- normalized aggregate-safe buckets;
- replay classification counters;
- bounded audit metadata;
- decision version buckets;
- policy version buckets;
- evaluation-window buckets;
- audit trace presence counters.

Forbidden:

- raw replay keys;
- raw idempotency keys;
- raw request ids;
- raw correlation ids;
- raw dedupe keys;
- raw tokens;
- authorization headers;
- payment payloads;
- voucher ids;
- transaction ids;
- wallet ledger rows;
- user PII;
- raw request or response bodies;
- SQL text;
- raw exception messages or stack traces containing secrets.

## 10. Failure Mode Policy

Recommended future behavior for paid claim enforcement planning:

- replay with stale cache: fail closed for paid claim enforcement;
- replay with degraded source: fail closed for paid claim enforcement;
- replay with unknown freshness: fail closed for paid claim enforcement;
- replay after identity mismatch: fail closed for paid claim enforcement;
- replay after version incompatibility: fail closed for paid claim enforcement;
- replay after source timeout: fail closed for paid claim enforcement;
- replay after rollback: follow approved rollback authority boundary and fail closed for stale/new-hybrid replay states;
- replay after reconciliation correction: fail closed until fresh canonical decision is proven.

**FACT:** This policy does not enable enforcement.

**FACT:** Slice 11 does not add replay handling, idempotency handling, retry handling, or runtime decision logic.

## 11. Evidence Requirements Before Enforcement

Future evidence requirements:

- replay matrix;
- idempotency matrix;
- exact duplicate tests;
- legitimate retry tests;
- stale grant replay tests;
- semantic mismatch replay tests;
- identity replay tests;
- version mismatch replay tests;
- degraded source replay tests;
- rollback replay tests;
- reconciliation replay tests;
- targeted Worker Log Scan or equivalent observability privacy audit before enforcement;
- controlled staging matrix under proposed enforcement design.

Evidence constraints:

- evidence must be staging-first;
- evidence must be aggregate-safe;
- evidence must not include raw replay keys, raw idempotency keys, raw request ids, raw correlation ids, tokens, payment payloads, user PII, SQL text, or raw stack traces;
- evidence completion is not enforcement approval.

## 12. Interaction With TTL / Identity / Canonical Reliability

Dependencies:

- replay governance depends on freshness semantics;
- replay governance depends on TTL/cache policy;
- replay governance depends on identity trust;
- replay governance depends on canonical source reliability and authenticity;
- replay governance depends on decision/schema/policy version compatibility;
- replay must not revive stale grant;
- replay policy must not bypass invalidation events;
- replay policy must not mask canonical source outage;
- replay policy must not auto-repair identity mismatch.

Out of scope for Slice 11:

- full identity mismatch governance closure;
- full canonical source reliability closure;
- runtime TTL value approval;
- replay runtime implementation.

## 13. Approval Boundary

These are not approval:

- this Slice 11 document;
- replay taxonomy;
- replay policy;
- stale grant replay policy;
- semantic replay policy;
- audit-safe correlation policy;
- replay evidence requirements;
- `review_ready`.

Approval requires:

- separate explicit governance approval artifact;
- named enforcement scope;
- named authority boundary;
- runtime switch conditions;
- replay runtime implementation review;
- idempotency runtime implementation review;
- QA/security sign-off;
- staging evidence;
- rollback evidence;
- targeted/full Worker Log Scan or equivalent audit.

**IMPORTANT:** `allowed_for_review_only != enforcement approval`.

## 14. Explicit Non-Approval Statement

Slice 11 does not approve entitlement enforcement.
This document defines replay governance policy only.
No replay runtime implementation is added in Slice 11.
No idempotency runtime implementation is added in Slice 11.
Runtime authority remains legacy_vip_spacer.
Durable diagnostics remain non-authoritative observability.
Any future enforcement requires a separate explicit governance approval artifact.

## 15. Acceptance Criteria

Document is ready when:

- docs-only artifact is created;
- no runtime/code/API/migration changes are made;
- no replay implementation is added;
- no idempotency implementation is added;
- no enforcement is enabled;
- no authority switch occurs;
- replay taxonomy is included;
- semantic replay policy is included;
- stale grant replay policy is included;
- audit-safe correlation policy is included;
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
replay_implementation_added: no
idempotency_implementation_added: no
enforcement_enabled: no
authority_switch: no
replay_taxonomy_included: yes
semantic_replay_policy_included: yes
stale_grant_replay_policy_included: yes
audit_safe_correlation_policy_included: yes
evidence_requirements_included: yes
explicit_non_approval_included: yes
multi_agent_review_summary_included: yes
```

## 16. Multi-Agent Review Summary

### Architect review

- Checked: replay/idempotency boundary, authority boundary, exact duplicate vs semantic replay, stale grant replay, interaction with TTL/cache, identity, and canonical reliability.
- Replay/idempotency risks confirmed: hidden replay authority, stale grant replay, semantic replay drift, cache/freshness bypass.
- Remaining blockers: replay/idempotency matrix evidence, identity governance, canonical reliability, targeted Worker Log Scan or equivalent audit, explicit approval artifact.
- Confirms no runtime/enforcement boundary: yes.
- Enforcement allowed in Slice 11: No.

### Backend review

- Checked: idempotency dimensions, stale grant replay, semantic mismatch replay, retry vs abuse, rollback and reconciliation cases.
- Replay/idempotency risks confirmed: duplicate side effects, stale decision reuse, missing policy version boundary, rollback hybrid states.
- Remaining blockers: no replay implementation, no idempotency implementation, no runtime path evidence, no replay failure evidence.
- Confirms no runtime/enforcement boundary: yes.
- Enforcement allowed in Slice 11: No.

### Security review

- Checked: replay abuse, lifecycle invalidation replay, identity/source downgrade replay, version mismatch replay, audit-safe correlation.
- Replay/idempotency risks confirmed: stale grant reuse, idempotency key leakage, low-volume correlation, unauthorized grant through semantic replay.
- Remaining blockers: privacy-safe replay evidence, stale grant replay tests, semantic mismatch tests, targeted Worker Log Scan or equivalent audit.
- Confirms no runtime/enforcement boundary: yes.
- Enforcement allowed in Slice 11: No.

### QA review

- Checked: future replay evidence matrix, exact duplicate tests, semantic mismatch tests, identity/version/degraded source replay tests, rollback replay tests.
- Replay/idempotency risks confirmed: policy without empirical staging matrix, missing negative tests, missing rollback replay evidence.
- Remaining blockers: controlled staging matrix, replay/idempotency test bundle, rollback drill, observability privacy audit.
- Confirms no runtime/enforcement boundary: yes.
- Enforcement allowed in Slice 11: No.

### Technical writer review

- Checked: non-approval wording, status vocabulary, replay policy vs replay implementation distinction, idempotency policy vs runtime implementation distinction.
- Replay/idempotency risks confirmed: terms like deterministic idempotency, no-op, conflict, and fail closed can be misread as implemented behavior.
- Remaining blockers: preserve policy-only language and repeat approval boundary in future artifacts.
- Confirms no runtime/enforcement boundary: yes.
- Enforcement allowed in Slice 11: No.

### Analyst review

- Checked: required 16-section structure, mandatory statuses, replay taxonomy classes, idempotency dimensions, stale grant replay policy, semantic replay policy, audit-safe correlation policy, failure modes, evidence requirements, approval boundary, acceptance criteria.
- Replay/idempotency risks confirmed: missing any replay class or dimension can hide unresolved abuse paths.
- Remaining blockers: identity mismatch governance, canonical source reliability, worker log scan/audit, explicit approval artifact.
- Confirms no runtime/enforcement boundary: yes.
- Enforcement allowed in Slice 11: No.

### Runtime governance review

- Checked: canonical-first boundary, no hidden authority, no RF paid claim behavior change, no TTL/cache invalidation bypass, identity/source/rollback boundaries.
- Replay/idempotency risks confirmed: replay policy can become hidden gate, revive stale grants, or bypass source/identity failure if not bounded by governance and evidence.
- Remaining blockers: replay runtime implementation review, staged enforcement-design matrix, canonical reliability proof, rollback drill.
- Confirms no runtime/enforcement boundary: yes.
- Enforcement allowed in Slice 11: No.

## Final Classification

```text
slice_11_status: review_ready_replay_governance_policy
replay_governance_status: policy_defined_not_implemented
runtime_replay_behavior_status: unchanged
runtime_idempotency_status: unchanged
enforcement_approval_status: not_approved
authority_runtime_status: legacy_vip_spacer_still_authoritative
diagnostics_sink_authority_status: non_authoritative_observability_only
runtime_change_status: no_runtime_change
production_status: not_touched
recommended_next_slice: identity_mismatch_governance_policy_or_canonical_source_reliability_policy
```

**IMPORTANT:** `allowed_for_review_only != enforcement approval`.
