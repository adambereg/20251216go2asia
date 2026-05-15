# VIP Entitlement Runtime Authority — TTL / Cache Governance Policy v1

Date: 2026-05-14  
Status: `REVIEW_READY_TTL_CACHE_POLICY_NOT_ENFORCEMENT_APPROVED`  
Slice: `VIP Entitlement Runtime Authority / Slice 10`  
Mode: docs-first TTL/cache governance policy, staging-first, no runtime implementation, no enforcement

## 1. Executive Summary

**FACT:** Slice 10 defines TTL/cache governance policy for future canonical entitlement decisions.

**FACT:** Entitlement enforcement is not approved.

**FACT:** Runtime behavior is unchanged.

**FACT:** No cache implementation is added.

**FACT:** No runtime TTL value is approved in Slice 10.

**IMPORTANT:** `allowed_for_review_only != enforcement approval`.

## 2. Current Status

```text
slice_10_status: ttl_cache_policy_defined_not_implemented
ttl_cache_governance_status: policy_defined_not_implemented
runtime_ttl_value_status: not_approved
cache_implementation_status: not_implemented
enforcement_approval_status: not_approved
authority_runtime_status: legacy_vip_spacer_still_authoritative
diagnostics_sink_authority_status: non_authoritative_observability_only
runtime_change_status: no_runtime_change
production_status: not_touched
```

## 3. Scope

Included:

- TTL/cache governance policy;
- freshness and staleness definitions;
- invalidation events;
- cache authority boundary;
- future fail-closed policy;
- evidence requirements before any future enforcement approval.

Excluded:

- runtime TTL config;
- implementation;
- cache storage;
- API changes;
- migrations;
- feature flags;
- logging/tooling changes;
- Worker Log Scan execution;
- enforcement activation;
- production rollout.

## 4. Authority Boundary

Cache authority boundary:

- cache is never source of truth;
- cache can only be an approved derived read optimization;
- canonical source remains non-authoritative today for RF paid claim runtime;
- `legacy_vip_spacer_still_authoritative` remains current runtime authority;
- diagnostics and durable sink cannot become cache authority;
- durable diagnostics, admin snapshots, replacement evidence, and cache evidence are governance inputs only.

**FACT:** Cache cannot authorize claim, deny claim, spend, refund, settle, reward, mint, unlock referral/network behavior, or grant entitlement unless a separate future governance approval artifact names an enforcement scope and runtime switch conditions.

## 5. Freshness Model

Definitions:

- fresh decision: decision that is inside approved freshness policy, not beyond entitlement `expiresAt`, not stale, not degraded, and compatible with approved source/schema/decision versions;
- stale decision: decision outside approved freshness policy, beyond approved lifetime, superseded by lifecycle/source/policy change, or marked stale by source/cache metadata;
- expired decision: decision whose entitlement window is past `expiresAt` or whose decision TTL would extend beyond the entitlement lifecycle boundary;
- degraded decision: decision produced under source timeout, source unavailable, cache degraded, partial source response, missing required metadata, or degraded runtime health;
- unknown freshness: decision without enough approved metadata to prove freshness;
- version-incompatible decision: decision whose source schema, adapter version, decision version, or policy version is incompatible with the approved consumer contract.

Mandatory future behavior policy:

- unknown freshness = fail closed for future paid claim enforcement;
- stale/degraded/version-incompatible decision cannot grant paid claim eligibility;
- expired decision cannot grant paid claim eligibility;
- missing freshness metadata cannot be treated as fresh.

**FACT:** These are governance policy definitions only. Slice 10 does not implement enforcement.

## 6. TTL Policy Governance

TTL policy ownership and approval:

- TTL policy owner: VIP Entitlement Authority governance track;
- required reviewers: Runtime Governance Architect, Security, QA, Backend, and Technical Canon Writer;
- policy record location: canonical entitlement governance artifact or future explicit enforcement approval artifact;
- changes to TTL policy require explicit governance review and evidence update;
- TTL must be bound by entitlement lifecycle and must not exceed nearest `expiresAt`;
- TTL must account for revocation, refund, cancellation, suspension, reconciliation correction, source downgrade, version mismatch, policy version changes, and identity trust changes.

Why TTL cannot exceed lifecycle boundary:

- entitlement lifecycle is the canonical grant boundary;
- cache is derived and cannot extend access beyond canonical eligibility;
- expired/revoked/refunded/cancelled state must supersede any cached grant;
- stale grants create replay and fraud risk.

**FACT:** Slice 10 does not approve a concrete runtime TTL value.

**FACT:** Any future runtime TTL value requires separate explicit approval, named scope, staging evidence, rollback evidence, and QA/security sign-off.

## 7. Cache Invalidation Events

| Invalidation event | Expected future behavior |
|---|---|
| Entitlement expired | invalidate cached grant, deny paid claim eligibility, require fresh canonical decision for any later allow |
| Entitlement revoked | invalidate cached grant, deny paid claim eligibility, require owner-reviewed canonical state |
| Entitlement refunded | invalidate cached grant, deny paid claim eligibility, require reconciliation-safe canonical decision |
| Entitlement cancelled | invalidate cached grant, deny paid claim eligibility, require fresh canonical decision |
| Entitlement suspended | invalidate or downgrade cached grant, deny paid claim eligibility until policy explicitly restores access |
| Reconciliation correction | invalidate affected cached decisions, require fresh canonical decision |
| Source downgrade | invalidate or deny derived decision, require canonical reliability/authenticity review |
| Source schema/version incompatibility | deny version-incompatible decision, require compatible canonical response |
| Policy version change | invalidate old-policy decisions, require decision under current policy version |
| Decision version change | invalidate incompatible decision versions, require compatible evaluated decision |
| Identity trust downgrade | invalidate subject-bound cached decision, deny until trusted identity is restored and matched |

**TARGET:** Future evidence must prove that these events cannot leave an old grant active through cache.

## 8. Cache Use Decision Matrix

| Case | Future cache use allowed? | Future paid claim grant allowed? | Required behavior | Enforcement approved today? |
|---|---:|---:|---|---|
| Fresh canonical decision | Not needed as cache; canonical decision may be read if separately approved | Only in a future separately approved enforcement scope | Use canonical decision if fresh, non-degraded, identity-matched, version-compatible | No |
| Fresh approved cache decision | Yes, only if derived from approved canonical source and policy | Only in a future separately approved enforcement scope | Treat as derived optimization with audit metadata and freshness proof | No |
| Cache beyond TTL | No | No | Deny and require fresh canonical decision | No |
| Cache beyond `expiresAt` | No | No | Deny and invalidate cached decision | No |
| Revoked entitlement cached | No | No | Invalidate, deny, require canonical review-safe decision | No |
| Refunded entitlement cached | No | No | Invalidate, deny, require reconciliation-safe decision | No |
| Cancelled entitlement cached | No | No | Invalidate, deny, require fresh canonical decision | No |
| Source downgraded | No for grant | No | Deny or require reliable canonical source before any grant | No |
| Version mismatch | No | No | Deny as version-incompatible and require compatible decision | No |
| Unknown freshness | No | No | Deny and emit safe freshness/failure counter | No |
| Degraded cache metadata | No for grant | No | Deny and classify as degraded/stale cache | No |
| Identity trust downgrade | No | No | Invalidate subject-bound cache and require trusted matched identity | No |

## 9. Failure Mode Policy

Recommended future behavior for paid claim enforcement planning:

- stale cache: fail closed for paid claim enforcement;
- missing TTL metadata: fail closed for paid claim enforcement;
- missing `expiresAt`: fail closed for paid claim enforcement;
- incompatible schema: fail closed for paid claim enforcement;
- cache source unknown: fail closed for paid claim enforcement;
- source timeout: fail closed for paid claim enforcement;
- source unavailable: fail closed for paid claim enforcement;
- cache read error: fail closed for paid claim enforcement unless a separately approved fresh canonical read succeeds;
- partial decision: fail closed for paid claim enforcement;
- clock skew: fail closed when freshness/lifecycle boundary cannot be proven.

**FACT:** This policy does not enable enforcement.

**FACT:** Slice 10 does not add cache handling, TTL handling, clock handling, or runtime decision logic.

## 10. Evidence Requirements Before Enforcement

Future evidence requirements:

- stale cache denial test;
- expired entitlement cache denial test;
- revoked/refunded/cancelled cache denial tests;
- source downgrade test;
- version mismatch test;
- missing freshness metadata test;
- cache read failure test;
- clock skew boundary test;
- controlled staging matrix under the proposed enforcement design;
- rollback drill;
- targeted Worker Log Scan or equivalent observability privacy audit before enforcement.

Evidence constraints:

- evidence must be staging-first;
- evidence must be aggregate-safe;
- evidence must not include raw user ids, tokens, auth headers, payment payloads, voucher ids, transaction ids, raw request/response bodies, SQL text, stack traces, replay keys, or idempotency keys;
- evidence completion is not enforcement approval.

## 11. Interaction With Replay / Identity / Canonical Reliability

Dependencies:

- replay policy depends on freshness, revision, decision version, and evaluation-window semantics;
- identity mismatch policy can invalidate cached decisions when trusted subject changes, degrades, or mismatches entitlement subject;
- canonical reliability affects whether cache can be used as a derived optimization;
- cache must not mask canonical source outage;
- cache must not revive stale grant;
- cache must not bypass source authenticity, schema/version compatibility, or identity trust requirements.

Out of scope for Slice 10:

- full replay governance closure;
- full identity mismatch governance closure;
- full canonical source reliability closure.

## 12. Approval Boundary

These are not approval:

- this Slice 10 document;
- TTL/cache policy;
- cache decision matrix;
- stale cache policy;
- evidence requirements;
- durable diagnostics;
- replacement evidence strategy;
- `review_ready`.

Approval requires:

- separate explicit governance approval artifact;
- named enforcement scope;
- named authority boundary;
- runtime switch conditions;
- concrete TTL runtime value approval;
- QA/security sign-off;
- staging evidence;
- rollback evidence;
- targeted/full Worker Log Scan or equivalent audit.

**IMPORTANT:** `allowed_for_review_only != enforcement approval`.

## 13. Explicit Non-Approval Statement

Slice 10 does not approve entitlement enforcement.
This document defines TTL/cache governance policy only.
No runtime TTL value is approved in Slice 10.
No cache implementation is added in Slice 10.
Runtime authority remains legacy_vip_spacer.
Durable diagnostics remain non-authoritative observability.
Any future enforcement requires a separate explicit governance approval artifact.

## 14. Acceptance Criteria

Document is ready when:

- docs-only artifact is created;
- no runtime/code/API/migration changes are made;
- no cache implementation is added;
- no TTL config change is made;
- no enforcement is enabled;
- no authority switch occurs;
- freshness model is included;
- invalidation event list is included;
- cache use decision matrix is included;
- failure mode policy is included;
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
cache_implementation_added: no
ttl_config_changed: no
enforcement_enabled: no
authority_switch: no
freshness_model_included: yes
invalidation_event_list_included: yes
cache_use_decision_matrix_included: yes
failure_mode_policy_included: yes
evidence_requirements_included: yes
explicit_non_approval_included: yes
multi_agent_review_summary_included: yes
```

## 15. Multi-Agent Review Summary

### Architect review

- Checked: Slice 9 TTL/cache blocker, Slice 6 TTL/cache design, source/schema contracts, approval boundary.
- TTL/cache risks confirmed: stale grant interpretation, cache becoming hidden authority, invalidation gaps, premature runtime TTL interpretation.
- Remaining blockers: concrete runtime TTL value approval, staging evidence, rollback evidence, QA/security sign-off, explicit enforcement approval artifact.
- Confirms no runtime/enforcement boundary: yes.
- Enforcement allowed in Slice 10: No.

### Backend review

- Checked: freshness/staleness definitions, cache metadata needs, invalidation events, future failure behavior.
- TTL/cache risks confirmed: stale cache, missing freshness metadata, version mismatch, cache read errors, source timeout/unavailable masking.
- Remaining blockers: no cache implementation, no TTL config, no runtime path evidence, no cache failure evidence.
- Confirms no runtime/enforcement boundary: yes.
- Enforcement allowed in Slice 10: No.

### Security review

- Checked: stale grants, revoked/refunded/cancelled cached grants, source downgrade, version mismatch, identity trust downgrade, clock skew, replay dependency.
- TTL/cache risks confirmed: stale grant replay, cache masking outage, old grant survival after lifecycle change, unsafe version compatibility assumptions.
- Remaining blockers: stale/invalidation tests, clock skew tests, targeted Worker Log Scan or equivalent audit before enforcement.
- Confirms no runtime/enforcement boundary: yes.
- Enforcement allowed in Slice 10: No.

### QA review

- Checked: future evidence matrix, cache denial cases, invalidation cases, source degradation cases, rollback and observability requirements.
- TTL/cache risks confirmed: policy without empirical staging evidence, missing negative tests, incomplete cache read failure and clock skew evidence.
- Remaining blockers: controlled staging matrix, cache-specific test bundle, rollback drill, privacy/log audit.
- Confirms no runtime/enforcement boundary: yes.
- Enforcement allowed in Slice 10: No.

### Technical writer review

- Checked: non-approval wording, status vocabulary, TTL policy vs TTL runtime value distinction, cache policy vs cache implementation distinction.
- TTL/cache risks confirmed: terms like `fresh`, `stale`, and `fail closed` can be misread as implemented runtime behavior.
- Remaining blockers: keep policy-only language and repeat approval boundary in future artifacts.
- Confirms no runtime/enforcement boundary: yes.
- Enforcement allowed in Slice 10: No.

### Analyst review

- Checked: required 15-section structure, mandatory statuses, invalidation list, cache decision matrix, failure modes, approval boundary, acceptance criteria.
- TTL/cache risks confirmed: missing any invalidation event can hide lifecycle grant leakage.
- Remaining blockers: replay, identity mismatch, canonical reliability, worker log scan/audit, explicit approval artifact.
- Confirms no runtime/enforcement boundary: yes.
- Enforcement allowed in Slice 10: No.

### Runtime governance review

- Checked: canonical-first boundary, cache-as-derived-only posture, legacy authority, diagnostics non-authority, no hidden enforcement.
- TTL/cache risks confirmed: cache can mask source outage, revive stale grant, or become hidden authority if not bounded by policy and evidence.
- Remaining blockers: approved runtime TTL value, canonical reliability proof, staged enforcement-design matrix, rollback drill.
- Confirms no runtime/enforcement boundary: yes.
- Enforcement allowed in Slice 10: No.

## Final Classification

```text
slice_10_status: review_ready_ttl_cache_policy
ttl_cache_governance_status: policy_defined_not_implemented
runtime_ttl_value_status: not_approved
cache_implementation_status: not_implemented
enforcement_approval_status: not_approved
authority_runtime_status: legacy_vip_spacer_still_authoritative
diagnostics_sink_authority_status: non_authoritative_observability_only
runtime_change_status: no_runtime_change
production_status: not_touched
recommended_next_slice: replay_governance_policy_or_identity_mismatch_governance_policy
```

**IMPORTANT:** `allowed_for_review_only != enforcement approval`.
