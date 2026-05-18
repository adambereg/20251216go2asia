# RF Safe Actor Registry Instance Draft v1

Date: 2026-05-18
Status: `PENDING_APPROVAL`
Stage: `Stage 7.2d / RF Staging Evidence Approval Packet`
Mode: concrete safe actor registry instance draft, docs-only, no real credentials, no real users, no real emails, no JWTs, no secrets, no production data, no staging execution, no API calls, no DB access, no diagnostics retrieval, no log retrieval, no tests added, no implementation, no config changes, no feature flag changes, no deployment changes, no runtime activation, no token/G2A/NFT/on-chain activation, no wallet activation, no payout/settlement/cashback activation, no Slice 16 movement

Related documents:

- `docs/runtime/rf_safe_actor_registry_template_v1.md`
- `docs/runtime/rf_staging_approval_framework_v1.md`
- `docs/runtime/rf_staging_evidence_approval_packet_v1.md`

## 1. Purpose

This document is a concrete registry instance draft derived from `rf_safe_actor_registry_template_v1.md`.

It intentionally contains no real actor IDs, no real users, no safe production-like IDs, no credentials and no approvals.

All unknown values are marked:

```text
PENDING_APPROVAL
```

This registry instance is not usable for evidence collection until reviewed, filled and approved.

## 2. Registry Control

```yaml
registry_control:
  registry_id: PENDING_APPROVAL
  registry_version: v1-draft
  framework_version: rf_staging_approval_framework_v1.md
  approval_packet: rf_staging_evidence_approval_packet_v1.md
  environment_id: PENDING_APPROVAL
  approved_staging_target: PENDING_APPROVAL
  window_id: PENDING_APPROVAL
  valid_from_utc: PENDING_APPROVAL
  valid_until_utc: PENDING_APPROVAL
  window_owner: PENDING_APPROVAL
  security_approver: PENDING_APPROVAL
  rf_domain_approver: PENDING_APPROVAL
  observability_approver: PENDING_APPROVAL
  db_evidence_approver: PENDING_APPROVAL
  privacy_redaction_approver: PENDING_APPROVAL
  status: PENDING_APPROVAL
  slice_16_status: blocked_not_triggered
```

## 3. Actor Records

```yaml
actors:
  - actor_id: SAFE_USER_01
    actor_type: safe_user
    environment: PENDING_APPROVAL
    owner: PENDING_APPROVAL
    purpose: rf_free_claim
    allowed_routes:
      - POST /v1/rf/offers/{offerId}/claim
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
    notes: "Staging-only. No production PII. Not approved for use."

  - actor_id: VIP_PAID_USER_01
    actor_type: vip_paid_user
    environment: PENDING_APPROVAL
    owner: PENDING_APPROVAL
    purpose: rf_paid_claim_spend
    allowed_routes:
      - POST /v1/rf/offers/{offerId}/claim
      - POST /internal/points/spend
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
    notes: "Requires explicit Points spend cap, safe balance and reconciliation approval. Not approved for use."

  - actor_id: MERCHANT_OWNER_01
    actor_type: merchant_owner
    environment: PENDING_APPROVAL
    owner: PENDING_APPROVAL
    purpose: rf_redeem_success
    partner_id: PENDING_APPROVAL
    allowed_routes:
      - POST /v1/rf/business/partners/{partnerId}/vouchers/{voucherId}/redeem
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

  - actor_id: WRONG_PARTNER_01
    actor_type: wrong_partner_actor
    environment: PENDING_APPROVAL
    owner: PENDING_APPROVAL
    purpose: rf_redeem_wrong_partner_negative
    partner_id: PENDING_APPROVAL
    must_not_own_voucher_id: PENDING_APPROVAL
    expected_result: PENDING_APPROVAL
    allowed_routes:
      - POST /v1/rf/business/partners/{partnerId}/vouchers/{voucherId}/redeem
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

  - actor_id: DIAG_ADMIN_LIMITED_01
    actor_type: admin_limited
    environment: PENDING_APPROVAL
    owner: PENDING_APPROVAL
    purpose: rf_diagnostics_read_only
    allowed_routes:
      - GET /v1/rf/internal/vouchers/{voucherId}/diagnostics
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
    notes: "Diagnostics access is not authority and not approved until the registry is signed."

  - actor_id: SVC_OBSERVER_01
    actor_type: service_observer
    environment: PENDING_APPROVAL
    owner: PENDING_APPROVAL
    purpose: logs_config_db_observation
    allowed_routes:
      - PENDING_APPROVAL
    allowed_request_volume:
      max_observation_requests: PENDING_APPROVAL
    concurrency_allowed: false
    paid_spend_allowed: false
    diagnostics_access: PENDING_APPROVAL
    db_snapshot_scope: PENDING_APPROVAL
    log_access_scope: PENDING_APPROVAL
    rollback_scope: observation_only_approved
    expiration_policy: PENDING_APPROVAL
    cleanup_required: PENDING_APPROVAL
    notes: "Observer only. No mutations. No broad admin. Not approved for use."
```

## 4. Safe Artifact Records

```yaml
safe_artifacts:
  - record_id: SAFE_RF_ARTIFACT_01
    environment: PENDING_APPROVAL
    rf_partner_id: PENDING_APPROVAL
    offer_id: PENDING_APPROVAL
    listing_id: PENDING_APPROVAL
    voucher_id: PENDING_APPROVAL
    claim_scope: PENDING_APPROVAL
    repeat_policy_expected: PENDING_APPROVAL
    points_cost_expected: PENDING_APPROVAL
    lifecycle_expected_state: PENDING_APPROVAL
    allowed_scenarios:
      - RF_SCENARIO_FREE_CLAIM_01
      - RF_SCENARIO_CLAIM_REPLAY_01
      - RF_SCENARIO_LISTING_CLAIM_01
      - RF_SCENARIO_PAID_SPEND_01
      - RF_SCENARIO_REDEEM_SUCCESS_01
    approved_by: PENDING_APPROVAL
    cleanup_or_freeze_policy: PENDING_APPROVAL
```

## 5. Scenario Records

```yaml
scenarios:
  - scenario_id: RF_SCENARIO_FREE_CLAIM_01
    scenario_type: claim
    environment: PENDING_APPROVAL
    actor_ids: [SAFE_USER_01]
    artifact_ids: [SAFE_RF_ARTIFACT_01]
    allowed_routes:
      - POST /v1/rf/offers/{offerId}/claim
    expected_outcome:
      status_code: PENDING_APPROVAL
      stable_error_code: PENDING_APPROVAL
      mutation_expected: true
    idempotency_policy:
      key_mode: new_once
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
      api_capture: true
      db_snapshot: PENDING_APPROVAL
      logs: PENDING_APPROVAL
      diagnostics: PENDING_APPROVAL
      config_snapshot: PENDING_APPROVAL
    approval_status: PENDING_APPROVAL

  - scenario_id: RF_SCENARIO_CLAIM_REPLAY_01
    scenario_type: replay
    environment: PENDING_APPROVAL
    actor_ids: [SAFE_USER_01]
    artifact_ids: [SAFE_RF_ARTIFACT_01]
    allowed_routes:
      - POST /v1/rf/offers/{offerId}/claim
    expected_outcome:
      status_code: PENDING_APPROVAL
      stable_error_code: PENDING_APPROVAL
      mutation_expected: false_after_first_claim
    idempotency_policy:
      key_mode: replay_same
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
      api_capture: true
      db_snapshot: PENDING_APPROVAL
      logs: PENDING_APPROVAL
      diagnostics: PENDING_APPROVAL
      config_snapshot: PENDING_APPROVAL
    approval_status: PENDING_APPROVAL

  - scenario_id: RF_SCENARIO_CLAIM_MISMATCH_01
    scenario_type: idempotency_mismatch
    environment: PENDING_APPROVAL
    actor_ids: [SAFE_USER_01]
    artifact_ids: [SAFE_RF_ARTIFACT_01]
    allowed_routes:
      - POST /v1/rf/offers/{offerId}/claim
    expected_outcome:
      status_code: PENDING_APPROVAL
      stable_error_code: PENDING_APPROVAL
      mutation_expected: false
    idempotency_policy:
      key_mode: mismatch_same_key
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
      api_capture: true
      db_snapshot: PENDING_APPROVAL
      logs: PENDING_APPROVAL
      diagnostics: PENDING_APPROVAL
      config_snapshot: PENDING_APPROVAL
    approval_status: PENDING_APPROVAL

  - scenario_id: RF_SCENARIO_LISTING_CLAIM_01
    scenario_type: listing_claim
    environment: PENDING_APPROVAL
    actor_ids: [SAFE_USER_01]
    artifact_ids: [SAFE_RF_ARTIFACT_01]
    allowed_routes:
      - GET /v1/rf/rielt/listings/{listingId}/offers
      - POST /v1/rf/rielt/listings/{listingId}/offers/{offerId}/claim
    expected_outcome:
      status_code: PENDING_APPROVAL
      stable_error_code: PENDING_APPROVAL
      mutation_expected: true
    idempotency_policy:
      key_mode: new_once
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
      api_capture: true
      db_snapshot: PENDING_APPROVAL
      logs: PENDING_APPROVAL
      diagnostics: PENDING_APPROVAL
      config_snapshot: PENDING_APPROVAL
    approval_status: PENDING_APPROVAL

  - scenario_id: RF_SCENARIO_PAID_SPEND_01
    scenario_type: paid_spend
    environment: PENDING_APPROVAL
    actor_ids: [VIP_PAID_USER_01]
    artifact_ids: [SAFE_RF_ARTIFACT_01]
    allowed_routes:
      - POST /v1/rf/offers/{offerId}/claim
      - POST /internal/points/spend
    expected_outcome:
      status_code: PENDING_APPROVAL
      stable_error_code: PENDING_APPROVAL
      mutation_expected: true
    idempotency_policy:
      key_mode: new_once
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
      api_capture: true
      db_snapshot: true
      logs: true
      diagnostics: PENDING_APPROVAL
      config_snapshot: true
    approval_status: PENDING_APPROVAL

  - scenario_id: RF_SCENARIO_REDEEM_SUCCESS_01
    scenario_type: redeem
    environment: PENDING_APPROVAL
    actor_ids: [MERCHANT_OWNER_01]
    artifact_ids: [SAFE_RF_ARTIFACT_01]
    allowed_routes:
      - POST /v1/rf/business/partners/{partnerId}/vouchers/{voucherId}/redeem
    expected_outcome:
      status_code: PENDING_APPROVAL
      stable_error_code: PENDING_APPROVAL
      mutation_expected: true
    idempotency_policy:
      key_mode: new_once
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
      api_capture: true
      db_snapshot: PENDING_APPROVAL
      logs: PENDING_APPROVAL
      diagnostics: PENDING_APPROVAL
      config_snapshot: PENDING_APPROVAL
    approval_status: PENDING_APPROVAL

  - scenario_id: RF_SCENARIO_WRONG_PARTNER_01
    scenario_type: gateway_negative
    environment: PENDING_APPROVAL
    actor_ids: [WRONG_PARTNER_01]
    artifact_ids: [SAFE_RF_ARTIFACT_01]
    allowed_routes:
      - POST /v1/rf/business/partners/{partnerId}/vouchers/{voucherId}/redeem
    expected_outcome:
      status_code: PENDING_APPROVAL
      stable_error_code: PENDING_APPROVAL
      mutation_expected: false
    idempotency_policy:
      key_mode: none
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
      api_capture: true
      db_snapshot: PENDING_APPROVAL
      logs: PENDING_APPROVAL
      diagnostics: PENDING_APPROVAL
      config_snapshot: PENDING_APPROVAL
    approval_status: PENDING_APPROVAL

  - scenario_id: RF_SCENARIO_DIAGNOSTICS_01
    scenario_type: diagnostics
    environment: PENDING_APPROVAL
    actor_ids: [DIAG_ADMIN_LIMITED_01]
    artifact_ids: [SAFE_RF_ARTIFACT_01]
    allowed_routes:
      - GET /v1/rf/internal/vouchers/{voucherId}/diagnostics
    expected_outcome:
      status_code: PENDING_APPROVAL
      stable_error_code: PENDING_APPROVAL
      mutation_expected: false
    idempotency_policy:
      key_mode: none
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
      api_capture: true
      db_snapshot: false
      logs: PENDING_APPROVAL
      diagnostics: true
      config_snapshot: PENDING_APPROVAL
    approval_status: PENDING_APPROVAL
```

## 6. Access Scope Records

```yaml
access_scopes:
  - scope_id: RF_ACCESS_SCOPE_DB_RO_01
    access_class: AC-DB-RO-SNAP
    environment: PENDING_APPROVAL
    allowed_systems:
      - rf-service
      - points-service
    allowed_tables_or_routes:
      - rf_voucher: PENDING_APPROVAL
      - rf_claim_idempotency: PENDING_APPROVAL
      - rf_voucher_redemption: PENDING_APPROVAL
      - rf_voucher_economy_recovery: PENDING_APPROVAL
      - points_transactions: PENDING_APPROVAL
      - user_balances: PENDING_APPROVAL
    allowed_fields:
      - PENDING_APPROVAL
    prohibited_fields:
      - Authorization
      - Cookie
      - voucher_code_full
      - raw_jwt
      - secrets
      - production_pii
    redaction_required: true
    retention_policy_ref: PENDING_APPROVAL
    approved_by: PENDING_APPROVAL
    valid_until_utc: PENDING_APPROVAL

  - scope_id: RF_ACCESS_SCOPE_LOG_SAN_01
    access_class: AC-LOG-SAN
    environment: PENDING_APPROVAL
    allowed_systems:
      - gateway
      - rf-service
      - points-service
    allowed_tables_or_routes:
      - route_template: PENDING_APPROVAL
      - request_id: PENDING_APPROVAL
      - status_code: PENDING_APPROVAL
      - stable_error_code: PENDING_APPROVAL
    allowed_fields:
      - PENDING_APPROVAL
    prohibited_fields:
      - Authorization
      - Cookie
      - raw_jwt
      - full_idempotency_key
      - voucher_code_full
      - secrets
      - production_pii
    redaction_required: true
    retention_policy_ref: PENDING_APPROVAL
    approved_by: PENDING_APPROVAL
    valid_until_utc: PENDING_APPROVAL

  - scope_id: RF_ACCESS_SCOPE_DIAG_R_01
    access_class: AC-DIAG-R
    environment: PENDING_APPROVAL
    allowed_systems:
      - rf-service
    allowed_tables_or_routes:
      - GET /v1/rf/internal/vouchers/{voucherId}/diagnostics
    allowed_fields:
      - PENDING_APPROVAL
    prohibited_fields:
      - Authorization
      - Cookie
      - raw_jwt
      - voucher_code_full
      - secrets
      - production_pii
      - authority_claims
    redaction_required: true
    retention_policy_ref: PENDING_APPROVAL
    approved_by: PENDING_APPROVAL
    valid_until_utc: PENDING_APPROVAL

  - scope_id: RF_ACCESS_SCOPE_CFG_SNAP_01
    access_class: AC-CFG-SNAP
    environment: PENDING_APPROVAL
    allowed_systems:
      - rf-service
      - points-service
      - gateway
    allowed_tables_or_routes:
      - effective_flag_value: PENDING_APPROVAL
      - service_version: PENDING_APPROVAL
      - captured_at_utc: PENDING_APPROVAL
    allowed_fields:
      - PENDING_APPROVAL
    prohibited_fields:
      - connection_strings
      - secrets
      - raw_env_dump
    redaction_required: true
    retention_policy_ref: PENDING_APPROVAL
    approved_by: PENDING_APPROVAL
    valid_until_utc: PENDING_APPROVAL

  - scope_id: RF_ACCESS_SCOPE_CORR_META_01
    access_class: AC-CORR-META
    environment: PENDING_APPROVAL
    allowed_systems:
      - gateway
      - rf-service
      - points-service
    allowed_tables_or_routes:
      - request_id: PENDING_APPROVAL
      - trace_surrogate: PENDING_APPROVAL
      - external_id: PENDING_APPROVAL
      - transaction_id: PENDING_APPROVAL
    allowed_fields:
      - PENDING_APPROVAL
    prohibited_fields:
      - raw_payload
      - Authorization
      - raw_jwt
      - secrets
      - production_pii
    redaction_required: true
    retention_policy_ref: PENDING_APPROVAL
    approved_by: PENDING_APPROVAL
    valid_until_utc: PENDING_APPROVAL

  - scope_id: RF_ACCESS_SCOPE_EXP_EVT_01
    access_class: AC-EXP-EVT
    environment: PENDING_APPROVAL
    allowed_systems:
      - gateway
      - rf-service
      - points-service
    allowed_tables_or_routes:
      - route_template: PENDING_APPROVAL
      - error_code_family: PENDING_APPROVAL
      - latency_bucket: PENDING_APPROVAL
    allowed_fields:
      - PENDING_APPROVAL
    prohibited_fields:
      - high_cardinality_user_labels
      - email
      - phone
      - raw_user_id
      - secrets
    redaction_required: true
    retention_policy_ref: PENDING_APPROVAL
    approved_by: PENDING_APPROVAL
    valid_until_utc: PENDING_APPROVAL
```

## 7. Review Verdict

```text
registry_instance_status: PENDING_APPROVAL
usable_for_evidence_collection: false
approved_for_window_opening: false
reason: environment, target, actors, safe IDs, request budgets, access scopes, retention and approvals remain pending.
```

Hard constraints preserved:

- no production users;
- no real credentials;
- no raw JWTs;
- no secrets;
- no production data;
- no feature flag changes;
- no runtime activation;
- no Slice 16 movement.
