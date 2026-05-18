# RF Safe Actor Registry Template v1

Date: 2026-05-18
Status: `TEMPLATE_STAGE_7_2C_SAFE_ACTOR_REGISTRY`
Stage: `Stage 7.2c / Staging Approval & Safe Actor Registry`
Mode: docs-only registry template, governance-only, no staging execution, no API calls, no DB access, no diagnostics retrieval, no log retrieval, no tests added, no implementation, no config changes, no feature flag changes, no deployment changes, no runtime activation, no token/G2A/NFT/on-chain activation, no wallet activation, no payout/settlement/cashback activation, no Slice 16 movement

Related documents:

- `docs/runtime/rf_staging_approval_framework_v1.md`
- `docs/runtime/rf_runtime_readiness_evidence_pack_v1.md`
- `docs/runtime/rf_claim_paid_spend_redeem_staging_evidence_v1.md`
- `docs/runtime/rf_staging_runtime_evidence_bundle_v1.md`

## 1. Purpose

This template defines the fields required to register safe actors, safe IDs and safe scenarios for a future RF staging evidence collection window.

It is a governance template only. It is not:

- runtime ACL;
- identity provisioning instruction;
- API execution plan;
- DB access grant;
- diagnostics access grant;
- feature flag approval;
- runtime activation artifact.

No actor, ID, route or scenario may be used for staging evidence collection unless it is filled, approved and still valid in a concrete registry instance derived from this template.

## 2. Scope

The template covers:

- safe test users;
- safe VIP/paid-spend users;
- merchant/partner-owner actors;
- wrong-partner negative actors;
- diagnostics/admin-limited actors;
- safe partner, offer, listing and voucher IDs;
- idempotency key policy;
- allowed routes;
- request volume and concurrency limits;
- DB/log/diagnostics access scope;
- rollback scope;
- expiration and cleanup policy.

## 3. Non-Use Rules

This template must not be used to:

- list production users;
- list real customer data;
- grant permissions;
- create users;
- seed data;
- run scripts;
- call staging APIs;
- bypass auth;
- enable paid spend;
- flip feature flags;
- approve rollback execution;
- activate any forbidden runtime area.

Anything not explicitly approved in a concrete registry instance is forbidden.

## 4. Registry Control Fields

Every concrete registry instance must include:

| Field | Required | Description |
|---|---:|---|
| `registry_id` | yes | Unique registry id or approval ticket id. |
| `registry_version` | yes | Version of the registry instance. |
| `framework_version` | yes | Must reference `rf_staging_approval_framework_v1.md` or successor. |
| `environment_id` | yes | Approved staging environment id. |
| `approved_staging_target` | yes | Approved target from the framework; no candidate-only URLs. |
| `window_id` | yes | Approved evidence collection window id. |
| `valid_from_utc` | yes | Start time. |
| `valid_until_utc` | yes | Expiration time. |
| `window_owner` | yes | Runtime Governance owner role/reference. |
| `security_approver` | yes | Security/Fraud approver role/reference. |
| `rf_domain_approver` | yes | RF Domain approver role/reference. |
| `observability_approver` | conditional | Required if logs/diagnostics/config snapshots are in scope. |
| `db_evidence_approver` | conditional | Required if DB snapshots are in scope. |
| `privacy_redaction_approver` | yes | Required for any artifact storage. |
| `status` | yes | `PENDING_APPROVAL`, `APPROVED`, `REJECTED`, `EXPIRED`, `FROZEN`. |

## 5. Actor Record Schema

Each actor record must include:

| Field | Required | Allowed examples / notes |
|---|---:|---|
| `actor_id` | yes | Internal registry id, not raw email. |
| `actor_type` | yes | `safe_user`, `vip_paid_user`, `merchant_owner`, `wrong_partner_actor`, `admin_limited`, `service_observer`. |
| `environment` | yes | Must match approved staging environment. |
| `owner` | yes | Role/team accountable for actor lifecycle. |
| `purpose` | yes | Claim, paid spend, redeem, diagnostics, wrong-actor negative, etc. |
| `allowed_routes` | yes | Explicit route list or route class id. |
| `allowed_request_volume` | yes | Max attempts per scenario and total. |
| `concurrency_allowed` | yes | `false` by default; `true` requires concurrency plan id. |
| `paid_spend_allowed` | yes | `false` by default; `true` requires Points cap and approval. |
| `diagnostics_access` | yes | `none`, `read_only_approved`, or route allow-list id. |
| `db_snapshot_scope` | yes | `none` or allow-listed table/column scope id. |
| `log_access_scope` | yes | `none` or sanitized log scope id. |
| `rollback_scope` | yes | `none`, `observation_only_approved`, or `out_of_scope`. |
| `expiration_policy` | yes | Date/time and action after expiration. |
| `cleanup_required` | yes | `freeze`, `delete`, `rotate_credentials`, `none_with_reason`. |
| `notes` | no | Must not include secrets or raw PII. |

## 6. Safe User Record

Template:

```yaml
actor:
  actor_id: SAFE_USER_01
  actor_type: safe_user
  environment: PENDING_APPROVAL
  owner: PENDING_APPROVAL
  purpose: rf_free_claim
  allowed_routes:
    - PENDING_APPROVAL
  allowed_request_volume:
    max_requests_total: PENDING_APPROVAL
    max_requests_per_minute: PENDING_APPROVAL
  concurrency_allowed: false
  paid_spend_allowed: false
  diagnostics_access: none
  db_snapshot_scope: PENDING_APPROVAL
  log_access_scope: PENDING_APPROVAL
  rollback_scope: none
  expiration_policy: PENDING_APPROVAL
  cleanup_required: PENDING_APPROVAL
  notes: ""
```

Rules:

- must be staging-only;
- must not be a real customer;
- must not contain production PII;
- must not be reused outside approved window.

## 7. VIP / Paid Spend User Record

Template:

```yaml
actor:
  actor_id: VIP_PAID_USER_01
  actor_type: vip_paid_user
  environment: PENDING_APPROVAL
  owner: PENDING_APPROVAL
  purpose: rf_paid_claim_spend
  allowed_routes:
    - PENDING_APPROVAL
  allowed_request_volume:
    max_paid_claims: PENDING_APPROVAL
    max_points_spend_total: PENDING_APPROVAL
    max_requests_total: PENDING_APPROVAL
  concurrency_allowed: false
  paid_spend_allowed: true
  diagnostics_access: none
  db_snapshot_scope: PENDING_APPROVAL
  log_access_scope: PENDING_APPROVAL
  rollback_scope: none
  expiration_policy: PENDING_APPROVAL
  cleanup_required: PENDING_APPROVAL
  notes: "Requires explicit Points spend cap and approval."
```

Rules:

- paid spend is forbidden unless `paid_spend_allowed: true` and the registry is approved;
- Points cap must be explicit;
- live paid spend evidence must include reconciliation scope approval;
- using this actor does not activate spend enforcement or payout semantics.

## 8. Merchant / Wrong Partner Actor Records

Merchant owner template:

```yaml
actor:
  actor_id: MERCHANT_OWNER_01
  actor_type: merchant_owner
  environment: PENDING_APPROVAL
  owner: PENDING_APPROVAL
  purpose: rf_redeem_success
  partner_id: PENDING_APPROVAL
  allowed_routes:
    - PENDING_APPROVAL
  allowed_request_volume:
    max_redeem_attempts: PENDING_APPROVAL
  concurrency_allowed: false
  paid_spend_allowed: false
  diagnostics_access: none
  db_snapshot_scope: PENDING_APPROVAL
  log_access_scope: PENDING_APPROVAL
  rollback_scope: none
  expiration_policy: PENDING_APPROVAL
  cleanup_required: PENDING_APPROVAL
```

Wrong partner template:

```yaml
actor:
  actor_id: WRONG_PARTNER_01
  actor_type: wrong_partner_actor
  environment: PENDING_APPROVAL
  owner: PENDING_APPROVAL
  purpose: rf_redeem_wrong_partner_negative
  partner_id: PENDING_APPROVAL
  must_not_own_voucher_id: PENDING_APPROVAL
  expected_result: PENDING_APPROVAL
  allowed_routes:
    - PENDING_APPROVAL
  allowed_request_volume:
    max_negative_attempts: PENDING_APPROVAL
  concurrency_allowed: false
  paid_spend_allowed: false
  diagnostics_access: none
  db_snapshot_scope: PENDING_APPROVAL
  log_access_scope: PENDING_APPROVAL
  rollback_scope: none
  expiration_policy: PENDING_APPROVAL
  cleanup_required: PENDING_APPROVAL
```

Rules:

- wrong-partner actor must be deterministic and approved;
- no exploratory actor swapping;
- no brute-force partner ID enumeration.

## 9. Diagnostics / Observer Actor Records

Template:

```yaml
actor:
  actor_id: DIAG_ADMIN_LIMITED_01
  actor_type: admin_limited
  environment: PENDING_APPROVAL
  owner: PENDING_APPROVAL
  purpose: rf_diagnostics_read_only
  allowed_routes:
    - PENDING_APPROVAL
  allowed_request_volume:
    max_diagnostics_reads: PENDING_APPROVAL
  concurrency_allowed: false
  paid_spend_allowed: false
  diagnostics_access: read_only_approved
  diagnostics_scope:
    voucher_ids:
      - PENDING_APPROVAL
  db_snapshot_scope: none
  log_access_scope: PENDING_APPROVAL
  rollback_scope: none
  expiration_policy: PENDING_APPROVAL
  cleanup_required: rotate_credentials
```

Rules:

- diagnostics actor may not execute mutations;
- diagnostics output is evidence context, not authority;
- internal routes must not be exposed to normal frontend users.

## 10. Safe Artifact ID Record

Each partner, offer, listing and voucher ID must be registered.

Template:

```yaml
artifact_id:
  record_id: SAFE_RF_ARTIFACT_01
  environment: PENDING_APPROVAL
  rf_partner_id: PENDING_APPROVAL
  offer_id: PENDING_APPROVAL
  listing_id: PENDING_APPROVAL
  voucher_id: PENDING_APPROVAL
  claim_scope: partner | listing | PENDING_APPROVAL
  repeat_policy_expected: PENDING_APPROVAL
  points_cost_expected: PENDING_APPROVAL
  lifecycle_expected_state: PENDING_APPROVAL
  allowed_scenarios:
    - PENDING_APPROVAL
  approved_by: PENDING_APPROVAL
  cleanup_or_freeze_policy: PENDING_APPROVAL
```

Rules:

- only approved IDs may be used;
- unknown IDs are forbidden;
- adjacent ID guessing is forbidden;
- localStorage and UI-only IDs are not valid safe artifact IDs.

## 11. Scenario Record

Template:

```yaml
scenario:
  scenario_id: RF_SCENARIO_01
  scenario_type: claim | listing_claim | paid_spend | compensation_recovery | redeem | gateway_negative | diagnostics | connect_projection_observation | rollback_observation
  environment: PENDING_APPROVAL
  actor_ids:
    - PENDING_APPROVAL
  artifact_ids:
    - PENDING_APPROVAL
  allowed_routes:
    - PENDING_APPROVAL
  expected_outcome:
    status_code: PENDING_APPROVAL
    stable_error_code: PENDING_APPROVAL
    mutation_expected: true | false | PENDING_APPROVAL
  idempotency_policy:
    key_mode: none | new_once | replay_same | mismatch_same_key
    allowed_attempts: PENDING_APPROVAL
    storage_rule: fingerprint_only
  request_volume:
    max_attempts: PENDING_APPROVAL
    max_per_minute: PENDING_APPROVAL
  concurrency:
    allowed: false
    max_parallel_clients: 1
    plan_id: null
  evidence_required:
    api_capture: true | false | PENDING_APPROVAL
    db_snapshot: true | false | PENDING_APPROVAL
    logs: true | false | PENDING_APPROVAL
    diagnostics: true | false | PENDING_APPROVAL
    config_snapshot: true | false | PENDING_APPROVAL
  approval_status: PENDING_APPROVAL
```

## 12. Access Scope Fields

Access scopes must be referenced, not embedded as raw credentials.

Template:

```yaml
access_scope:
  scope_id: RF_ACCESS_SCOPE_01
  access_class: AC-DB-RO-SNAP | AC-LOG-SAN | AC-DIAG-R | AC-CFG-SNAP | AC-CORR-META | AC-EXP-EVT
  environment: PENDING_APPROVAL
  allowed_systems:
    - PENDING_APPROVAL
  allowed_tables_or_routes:
    - PENDING_APPROVAL
  allowed_fields:
    - PENDING_APPROVAL
  prohibited_fields:
    - Authorization
    - Cookie
    - voucher_code_full
    - raw_jwt
  redaction_required: true
  retention_policy_ref: PENDING_APPROVAL
  approved_by: PENDING_APPROVAL
  valid_until_utc: PENDING_APPROVAL
```

## 13. Review Gate for Registry Completeness

A concrete registry instance is valid only if:

- all required control fields are filled;
- every active actor has owner, expiration and cleanup policy;
- every paid-spend actor has spend cap and approval;
- every scenario references approved actors and artifact IDs;
- every DB/log/diagnostics access scope references an approval;
- request volume and concurrency limits are explicit;
- redaction and retention policies are referenced;
- forbidden actor classes are absent;
- production users/data are absent;
- Slice 16 remains `blocked_not_triggered`.

Registry status values:

| Status | Meaning |
|---|---|
| `PENDING_APPROVAL` | Not usable for evidence collection. |
| `APPROVED` | Usable only for listed scenarios during validity window. |
| `REJECTED` | Must not be used. |
| `EXPIRED` | Must not be used until renewed. |
| `FROZEN` | Stopped due to blocker or hard stop. |

## 14. Acceptance Criteria

Accepted if:

- template defines safe users, paid users, merchant actors, wrong-partner actors and diagnostics actors;
- template defines safe partner/offer/listing/voucher records;
- template defines scenario records with route, outcome, idempotency and request volume fields;
- template defines DB/log/diagnostics/config access scope references;
- template includes expiration and cleanup policy;
- template prohibits production users and production data;
- template prohibits brute-force, fuzzing and unbounded negative tests;
- template preserves no-runtime-activation posture.

Rejected if:

- it contains real credentials, real JWTs, secrets or production PII;
- it instructs how to create users, seed data, call APIs or query databases;
- it implies feature flag changes or runtime activation;
- it treats registry entries as runtime ACL;
- it moves Slice 16.

## 15. Prohibited Actor Classes

Forbidden:

- production users;
- real customers;
- real partner data not created for staging evidence;
- broad admin actors;
- actors with payout, settlement, wallet, token, NFT or on-chain authority;
- unknown users found through API exploration;
- generated users outside the approval record;
- service accounts with write access outside approved scenario;
- any actor whose data class cannot be confirmed.

## 16. Versioning and Change Control

Template changes:

- adding required fields requires a version or changelog update;
- removing safety fields requires Runtime Governance and Security/Fraud approval;
- changing actor classes requires Canon Review;
- concrete registry instances must reference the template version used.

Change log:

| Date | Version | Change |
|---|---|---|
| 2026-05-18 | v1 | Initial Stage 7.2c safe actor registry template. |

## 17. Slice 16 Firewall

This registry template does not unblock Slice 16.

```text
slice_16_status: blocked_not_triggered
```

Any concrete registry instance implying Slice 16 movement is invalid.
