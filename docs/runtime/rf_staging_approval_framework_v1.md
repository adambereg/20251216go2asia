# RF Staging Approval Framework v1

Date: 2026-05-18
Status: `DRAFT_STAGE_7_2C_STAGING_APPROVAL_FRAMEWORK`
Stage: `Stage 7.2c / Staging Approval & Safe Actor Registry`
Mode: runtime governance approval framework, docs-only, governance-only, no staging execution, no API calls, no DB access, no diagnostics retrieval, no log retrieval, no tests added, no implementation, no config changes, no feature flag changes, no deployment changes, no runtime activation, no spend enforcement activation, no token/G2A/NFT/on-chain activation, no wallet activation, no payout/settlement/cashback activation, no Quest reward runtime activation, no Slice 16 movement

Related documents:

- `docs/runtime/rf_runtime_readiness_evidence_pack_v1.md`
- `docs/runtime/rf_claim_paid_spend_redeem_staging_evidence_v1.md`
- `docs/runtime/rf_staging_runtime_evidence_bundle_v1.md`
- `docs/runtime/rf_safe_actor_registry_template_v1.md`
- `docs/economy/economy_authority_terminology_crosswalk_v1.md`
- `docs/architecture/domain/economy_scope_reentry_note_v1.md`

## 1. Purpose

This document defines the governance framework required before any future RF staging evidence collection window can be opened.

It exists because Stage 7.2b remained:

```text
status: BLOCKED_PENDING_APPROVAL
```

The missing prerequisites were:

- approved staging target;
- safe actors and safe IDs;
- request volume and concurrency policy;
- read-only DB access policy;
- sanitized log access policy;
- diagnostics access policy;
- feature flag/config snapshot policy;
- rollback observation approval policy;
- redaction and evidence storage policy;
- evidence ownership and review gates.

Stage 7.2c does not open a staging window. It defines the approval framework under which such a window may be opened later.

## 2. Scope

In scope:

- approved staging target model;
- safe actor registry model;
- safe voucher, offer and listing model;
- request volume and concurrency policy;
- DB, diagnostics and log access policy;
- redaction and privacy rules;
- evidence storage and retention policy;
- rollback observation policy;
- review and approval workflow;
- forbidden runtime areas registry;
- evidence classification rules;
- window opening and closure requirements;
- blocker escalation rules;
- recommended Stage 7.2d entry conditions.

Allowed outputs are docs-only governance artifacts, policy templates and checklist structures.

## 3. Non-Goals

This document does not authorize:

- staging API calls;
- DB queries;
- log retrieval;
- diagnostics retrieval;
- runtime tests;
- load tests;
- implementation work;
- source code changes;
- OpenAPI/API changes;
- schema changes;
- migrations;
- config changes;
- feature flag changes;
- deployment;
- runtime activation;
- spend enforcement activation;
- available-only enforcement activation;
- `referral_unlock` activation;
- network accrual activation;
- VIP entitlement authority activation;
- token, G2A, NFT, wallet or on-chain activation;
- payout, settlement or cashback activation;
- Quest reward runtime activation;
- Slice 16 movement.

## 4. Governance Principles

Required principles:

```text
evidence != rollout
staging_validation != activation
diagnostics != authority
projection != ledger truth
RF/voucher != cashback/settlement
Points are internal utility, not money
soft_economy_now
ledger_later
enforcement_much_later
shadow_graph != enforcement
slice_16_status: blocked_not_triggered
```

Operational principles:

- Explicit approval beats implicit availability.
- OpenAPI server metadata is not staging approval.
- Safe actors are allow-listed; anything not listed is forbidden.
- Evidence collection must be bounded by route, actor, request count, time window and artifact class.
- Read-only exports are preferred over broad interactive access.
- Diagnostics and logs support investigation, but never become authority.
- Redaction happens before evidence enters a shared artifact store.
- Rollback observation requires separate approval and must not become experimentation.

## 5. Approved Staging Target Model

An approved staging target is a named, owned, time-bounded environment approved for evidence collection.

Required fields:

| Field | Required value |
|---|---|
| `environment_id` | Stable environment name, not only a URL. |
| `base_urls` | Approved Gateway/RF/Points URLs; internal URLs only if explicitly allowed. |
| `build_identity` | Commit, deploy marker, service version or release label. |
| `owner` | Runtime collection owner role and contact reference. |
| `tenant_safety` | Statement that environment uses safe staging data only. |
| `allowed_data_classes` | Synthetic staging users, safe vouchers/offers/listings, redacted logs. |
| `prohibited_targets` | Production, production-like users, unknown tenants, unapproved internal hosts. |
| `network_access` | Approved source network, VPN or IP allow-list if applicable. |
| `approval_chain` | Runtime Governance, Security/Fraud, RF Domain and Observability approvals. |
| `valid_from` / `valid_until` | Time box for evidence collection. |
| `openapi_relationship` | OpenAPI server entries are candidate context only and not approval. |

Approval status values:

| Status | Meaning |
|---|---|
| `UNKNOWN_PENDING_APPROVAL` | Target is not approved. No staging calls allowed. |
| `APPROVED_READ_ONLY_OBSERVATION` | Read-only captures only, no mutating flows. |
| `APPROVED_CONTROLLED_MUTATION` | Explicit safe API scenarios allowed within request budget. |
| `REJECTED` | Target may not be used. |
| `EXPIRED` | Previously approved target is no longer valid. |

## 6. Safe Actor Registry Model

The safe actor registry is the allow-list of identities and IDs that may be used in a future evidence window.

Registry rules:

- every actor must be staging-only;
- every actor must have an owner and expiration policy;
- every paid-spend actor requires separate approval;
- every wrong-actor / wrong-partner negative case must be deterministic and listed;
- actor records without required fields are invalid;
- production users, real customers, real voucher codes, real payout-related data and unknown IDs are prohibited.

Required actor classes:

| Actor class | Purpose | Special requirement |
|---|---|---|
| `safe_user` | Free RF claim and read-only flows | Staging-only identity, no production PII. |
| `vip_paid_user` | Paid claim spend evidence | Explicit Points spend cap and paid-spend approval. |
| `merchant_owner` | Redeem success | Bound to approved partner IDs. |
| `wrong_partner_actor` | Redeem negative case | Must not own target voucher/partner. |
| `admin_limited` | Diagnostics read-only evidence | Diagnostics routes allow-list and redaction rules required. |
| `service_observer` | Logs/config/DB export coordination | Read-only only; no business mutation permissions. |

The schema for concrete records is defined in `docs/runtime/rf_safe_actor_registry_template_v1.md`.

## 7. Safe Voucher / Offer / Listing Model

Safe IDs must be explicitly approved before use.

Required fields:

| Field | Purpose |
|---|---|
| `rf_partner_id` | Approved staging partner. |
| `offer_id` | Approved offer for partner or listing claim. |
| `listing_id` | Approved Rielt listing for listing-scoped claim. |
| `voucher_id` | Approved voucher for diagnostics/redeem/replay evidence, when pre-existing. |
| `claim_scope` | `partner` or `listing`. |
| `repeat_policy` | Expected policy, e.g. `once_per_scope` or `repeat_after_redeem`. |
| `points_cost_expected` | Whether paid spend is expected. |
| `lifecycle_expected_state` | Expected state before scenario begins. |
| `cleanup_or_freeze_policy` | What happens after window closure. |

Prohibited:

- ID enumeration;
- guessing adjacent voucher/listing IDs;
- using production IDs;
- using active business partner data not created for evidence collection;
- treating UI-only or localStorage state as approved ID authority.

## 8. Request Volume & Concurrency Policy

Default request policy:

| Policy item | Default |
|---|---|
| `max_requests_per_scenario` | Must be specified; no default open-ended count. |
| `max_requests_per_actor` | Must be specified before window opens. |
| `max_new_idempotency_keys` | Must be specified per scenario. |
| `max_parallel_clients` | `1` unless concurrency is explicitly approved. |
| `concurrency_allowed` | `false` by default. |
| `replay_allowed` | Only for listed idempotency scenarios. |
| `mismatch_allowed` | Only for listed deterministic mismatch scenarios. |
| `stress_or_load_testing` | Forbidden. |
| `fuzzing` | Forbidden. |
| `brute_force` | Forbidden. |

Concurrency policy:

- concurrency tests require a named scenario, exact endpoint, exact actor, exact IDs, max parallel clients, expected pass/block outcome and rollback/cleanup plan;
- open-ended race probing is forbidden;
- any unexpected duplicate spend, duplicate redeem or duplicate active voucher is a hard stop.

Gateway trust negative tests:

- missing auth, malformed auth, wrong role and wrong actor checks must be deterministic;
- no credential guessing;
- no JWT algorithm/kid fuzzing;
- no high-volume 401/403 mapping;
- no production identity reuse.

## 9. DB / Diagnostics / Log Access Policy

Access classes:

| Access class | Scope | Rules |
|---|---|---|
| `AC-DB-RO-SNAP` | Read-only RF/Points DB snapshots | Allow-listed tables/columns only; no `SELECT *`; row limits required. |
| `AC-LOG-SAN` | Sanitized Gateway/RF/Points logs | Allow-listed fields only; raw auth headers forbidden. |
| `AC-DIAG-R` | Diagnostics/readiness output | Read-only routes only; diagnostics is not authority. |
| `AC-CFG-SNAP` | Feature flag/config snapshots | Read-only effective values, version and timestamp only. |
| `AC-CORR-META` | Request/trace correlation metadata | No payload secrets or PII. |
| `AC-EXP-EVT` | Aggregated events/metrics | No high-cardinality PII labels. |

Allowed DB evidence examples:

- RF voucher lifecycle rows for safe vouchers;
- RF claim idempotency rows for approved scenarios;
- RF redemption rows for approved vouchers;
- RF recovery markers for approved paid-spend scenarios;
- Points transactions for approved `externalId` values;
- user balance before/after for approved safe users only.

Forbidden DB evidence:

- broad dumps;
- unrestricted joins;
- production snapshots;
- raw tokens, secrets, password hashes, voucher codes;
- unrelated user data.

Diagnostics boundaries:

- diagnostics may show anomalies, recovery state and consistency evidence;
- diagnostics must not be cited as ledger truth, payout truth or authority switch;
- diagnostics access must be admin-limited and route allow-listed.

## 10. Redaction & Privacy Rules

Never store in shared evidence artifacts:

- raw JWTs;
- raw session cookies;
- raw auth headers;
- API keys;
- DB connection strings;
- full voucher codes;
- QR codes containing redeemable secrets;
- unnecessary PII;
- raw payment or settlement data;
- unredacted logs or HAR captures.

Required redaction:

| Data type | Required treatment |
|---|---|
| JWT / bearer token | Remove completely or replace with `REDACTED`; decoded claims only if PII-free and approved. |
| `Authorization` / cookies | Remove completely. |
| `Idempotency-Key` | Use fingerprint or surrogate; full value only in restricted secure store if approved. |
| voucher code | Mask or omit; prefer `voucher_id`. |
| user id | Use staging-safe surrogate when possible. |
| email/phone/name | Redact or replace with synthetic label. |
| IP address | Truncate or redact unless explicitly required. |
| screenshots | Blur URL tokens, voucher codes, QR codes and PII. |
| DB snapshots | Allow-listed columns only; no secret-like columns. |

Any raw secret in a shared artifact is a hard stop and requires incident-style remediation and credential rotation where applicable.

## 11. Evidence Storage & Retention Policy

Artifact naming:

```text
rf_evidence_<stage>_<topic>_<env>_v<major>.<ext>
```

Examples:

```text
rf_evidence_7_2d_claim_staging_v1.json
rf_evidence_7_2d_reconcile_staging_v1.md
rf_evidence_7_2d_logs_staging_v1.redacted.jsonl
```

Storage classes:

| Storage class | Allowed content |
|---|---|
| secure evidence store | Redacted exports and restricted artifacts under access control. |
| project docs repository | Redacted summaries, manifests, synthetic examples, blocker records. |
| chat/issues/PRs | Summaries only; no secrets, raw logs or raw DB exports. |

Retention:

- raw captures should not enter the docs repository;
- non-redacted temporary materials must be deleted as soon as redacted evidence is produced;
- retention duration must be approved by the evidence owner and privacy/redaction reviewer;
- deletion events should be recorded in the evidence manifest.

Prohibited sharing:

- personal cloud drives;
- public paste services;
- unencrypted messenger attachments;
- raw logs or DB dumps in git;
- external sharing without explicit approval and redaction review.

## 12. Rollback Observation Policy

Rollback observation is not rollback execution.

Rollback observation may be approved only when:

- the rollback action is already approved by the runtime owner;
- the observation plan is read-only;
- before/after feature flag/config snapshots are available;
- allowed safe actors and request volume are defined;
- evidence is limited to approved IDs and time window;
- no unplanned feature flag changes are made by the evidence collector.

Allowed rollback evidence:

- read-only pre/post config snapshots;
- absence or presence of expected RF/Points log signals within a bounded window;
- safe API responses under approved actors;
- DB snapshots limited to approved safe IDs.

Forbidden rollback experimentation:

- flipping feature flags without approval;
- changing deployment just to collect evidence;
- using real users;
- using production data;
- broad traffic observation unrelated to approved IDs;
- treating rollback observation as rollout approval.

## 13. Review & Approval Workflow

Approval workflow:

1. Runtime Governance opens an approval record.
2. RF Domain defines scenario scope and safe RF IDs.
3. Security/Fraud approves safe actors, negative vectors and request limits.
4. Backend approves route and service boundary assumptions.
5. Database Evidence Reviewer approves DB snapshot scope.
6. Observability approves log/diagnostics/config snapshot scope.
7. Privacy/Redaction approves masking and storage.
8. QA/Test Governance approves evidence classification and acceptance criteria.
9. Technical Canon Writer verifies the approval record does not imply runtime activation.
10. Window may open only after all required gates are approved.

Approval statuses:

| Status | Meaning |
|---|---|
| `PENDING_APPROVAL` | Missing required signoff. |
| `APPROVED_FOR_READ_ONLY` | Read-only observation only. |
| `APPROVED_FOR_CONTROLLED_SCENARIOS` | Explicit safe API scenarios allowed. |
| `REJECTED` | Evidence collection may not proceed. |
| `EXPIRED` | Approval no longer valid. |
| `FROZEN` | Window stopped due to blocker or scope change. |

Who may classify evidence:

- Runtime Governance may classify PASS/BLOCKED for runtime gates;
- Security/Fraud may hard-stop trust, abuse, secret or production-data issues;
- Database Evidence Reviewer may accept or reject DB snapshots;
- Observability may accept or reject logs/diagnostics/config evidence;
- Technical Canon Writer may reject overclaiming or authority drift;
- no single actor may self-approve collection, execute collection and close the blocker alone.

## 14. Forbidden Runtime Areas

Always forbidden in Stage 7.2c and any approval derived from it:

- token/G2A activation;
- NFT/on-chain activation;
- wallet activation;
- blockchain gateway activation;
- payout, settlement, cashback or commission activation;
- partner financial settlement;
- PRO payout or income entitlement;
- MLM/passive-income runtime semantics;
- `referral_unlock` activation;
- network accrual producer activation;
- hard available-only spend enforcement activation;
- full VIP entitlement authority activation;
- reward producer activation outside already implemented runtime-backed flows;
- fake ledger or frontend-as-ledger truth;
- Quest localStorage as reward authority;
- Connect projection as ledger/voucher/spendability authority;
- diagnostics as authority;
- shadow graph as enforcement;
- Slice 16 movement.

## 15. Slice 16 Firewall Preservation

Slice 16 status:

```text
slice_16_status: blocked_not_triggered
```

Stage 7.2c does not make Slice 16 closer, ready, unblocked or approved.

Any document, artifact or approval record that implies Slice 16 movement must be treated as invalid until corrected.

## 16. Evidence Classification Rules

Evidence classes:

| Class | Meaning | May satisfy staging runtime evidence? |
|---|---|---|
| `LOCAL_TEST_OR_UNIT` | Local tests or unit/component evidence | No, supportive only. |
| `CI_AUTOMATED` | CI evidence without full staging bundle | No, unless explicitly accepted for a narrow non-runtime gate. |
| `STAGING_RUNTIME_COLLECTED` | Approved staging captures with metadata, redaction and traceability | Yes, for approved scenario only. |
| `STAGING_NOT_EXECUTED` | Scenario not executed | No. |
| `FORMALLY_EXCLUDED_FROM_THIS_SLICE` | Scenario out of scope by governance | No, but may avoid blocking a narrowed claim. |
| `BLOCKED_PENDING_APPROVAL` | Missing approval/access | No. |
| `REJECTED_OR_UNSAFE` | Evidence attempt unsafe or invalid | No, hard stop. |

Each evidence row must include:

- evidence class;
- environment id;
- approval record id;
- safe actor reference;
- scenario id;
- artifact references;
- redaction status;
- reviewer verdict;
- residual gaps.

## 17. Window Opening Requirements

A future staging evidence window may open only if all are true:

- approved staging target exists;
- safe actor registry is complete for requested scenarios;
- safe voucher/offer/listing IDs are approved;
- request volume and concurrency limits are approved;
- DB/log/diagnostics/config access classes are approved;
- redaction and storage policy is approved;
- rollback observation status is explicit;
- forbidden areas attestation is signed;
- Slice 16 firewall is explicitly preserved;
- blocker register contains no hard-stop blockers for the requested scope.

If any item is missing:

```text
window_status: BLOCKED_PENDING_APPROVAL
```

## 18. Window Closure Requirements

Every authorized window must close with:

- artifact inventory;
- list of scenarios executed;
- list of scenarios not executed;
- DB/log/diagnostics/config evidence manifest;
- redaction status;
- blocker updates;
- no-activation attestation;
- residual risk statement;
- deletion/retention record for temporary raw materials.

Closure statuses:

| Status | Meaning |
|---|---|
| `CLOSED_COMPLETE` | Approved evidence collected and reviewed. |
| `CLOSED_PARTIAL` | Some evidence collected; gaps remain. |
| `FROZEN_HARD_STOP` | Window stopped due to safety/security/semantic blocker. |
| `EXPIRED_NOT_EXECUTED` | Approval expired before collection. |

## 19. Blocker Escalation Rules

Blocker fields:

| Field | Meaning |
|---|---|
| `blocker_or_gap_id` | Existing Stage 7.1/7.2/7.2b blocker or new Stage 7.2c gap. |
| `severity` | `HARD_STOP`, `EVIDENCE_GAP`, `NEEDS_OWNER`, `NEEDS_REDACTION`. |
| `runtime_claim_ids` | Related RF claim IDs from the evidence pack. |
| `impacted_gates` | Review gates blocked by the issue. |
| `resolver_role` | Role allowed to close the blocker. |
| `allowed_resolution_paths` | Evidence, exclusion, scope reduction or corrected approval. |
| `due_by` | Timebox for resolution if a window is open. |

Hard-stop blockers:

- raw secret exposed;
- production user/data used;
- unapproved feature flag/config change;
- duplicate spend/redeem observed without containment;
- payout/token/wallet/NFT activation implied;
- Quest localStorage treated as authority;
- Slice 16 movement implied.

Hard-stop behavior:

```text
window_status: FROZEN_HARD_STOP
collection_must_stop: true
```

## 20. Recommended Stage 7.2d Entry Conditions

Recommended next slice:

```text
Stage 7.2d / RF Staging Evidence Approval Packet
```

Entry conditions:

- `rf_staging_approval_framework_v1.md` exists and is accepted;
- `rf_safe_actor_registry_template_v1.md` exists and is accepted;
- an approval packet is drafted from this framework;
- safe actors and IDs are proposed but not used until approved;
- redaction/storage owners are assigned;
- request volume and concurrency policy are filled for the requested scope;
- rollback observation is explicitly approved or marked out of scope;
- no forbidden runtime area is included;
- Slice 16 remains `blocked_not_triggered`.

Stage 7.2d should prepare the concrete approval packet. It should not collect staging evidence unless it is explicitly re-scoped and approved as an execution window.
