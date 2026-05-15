/**
 * VIP entitlement runtime contracts v1.
 *
 * Contracts-only, non-authoritative semantic labels for future bounded
 * runtime implementation slices. This package intentionally contains no
 * allow/deny logic, authority routing, replay handling, rollback execution,
 * gate activation, diagnostics decisions, or production behavior.
 *
 * Canon sources:
 * - docs/architecture/domain/vip_entitlement_runtime_implementation_entry_review_v1.md
 * - docs/architecture/domain/vip_entitlement_runtime_implementation_order_plan_v1.md
 * - docs/architecture/domain/vip_entitlement_runtime_rollback_safety_design_v1.md
 * - docs/architecture/domain/vip_entitlement_runtime_evidence_requirements_matrix_v1.md
 * - docs/architecture/domain/vip_entitlement_lifecycle_contract_v1.md
 */

export const VIP_ENTITLEMENT_RUNTIME_CONTRACT_VERSION = 'vip_entitlement_runtime_contracts_v1' as const;

export const VIP_ENTITLEMENT_RUNTIME_CONTRACT_BOUNDARY = {
  contractsOnly: true,
  nonAuthoritative: true,
  noRuntimeDecisionBehavior: true,
  noEnforcementSemantics: true,
  noRolloutSemantics: true,
  noApprovalSemantics: true,
} as const;

export type VipEntitlementRuntimeContractBoundary = typeof VIP_ENTITLEMENT_RUNTIME_CONTRACT_BOUNDARY;

export const AUTHORITY_MODE_LABELS = [
  'legacy_authority',
  'shadow_only_observation',
  'partial_implementation_no_authority',
  'bounded_staging_validation',
  'enforcement_gated_staging',
  'rollback_to_legacy',
  'post_rollback_monitoring',
  'candidate_authority_non_approved',
  'authority_transition_not_started',
  'unknown_authority_mode_blocked',
] as const;

export type AuthorityModeLabel = (typeof AUTHORITY_MODE_LABELS)[number];
export type AuthorityMode = AuthorityModeLabel;

export const CURRENT_AUTHORITY_RUNTIME_STATUS = 'legacy_vip_spacer_still_authoritative' as const;

export const DIAGNOSTICS_MODE_LABELS = [
  'not_applicable',
  'diagnostics_unavailable',
  'diagnostics_available_non_authoritative',
  'diagnostics_safe_summary_available',
  'diagnostics_safe_summary_missing',
  'diagnostics_to_authority_drift_check_required',
  'diagnostics_authority_promotion_blocked',
] as const;

export type DiagnosticsModeLabel = (typeof DIAGNOSTICS_MODE_LABELS)[number];
export type DiagnosticsMode = DiagnosticsModeLabel;

export const CURRENT_DIAGNOSTICS_SINK_AUTHORITY_STATUS = 'non_authoritative_observability_only' as const;

export const ROLLBACK_MODE_LABELS = [
  'not_applicable',
  'no_enforcement_baseline',
  'pre_rollback',
  'rollback_initiated',
  'rollback_to_legacy',
  'post_rollback_monitoring',
  'hybrid_state_classified',
  'hybrid_state_unknown_blocked',
  'rollback_proof_not_proven',
] as const;

export type RollbackModeLabel = (typeof ROLLBACK_MODE_LABELS)[number];
export type RollbackMode = RollbackModeLabel;

export const GATE_STATE_LABELS = [
  'not_applicable',
  'gate_disabled',
  'gate_shadow_only',
  'gate_staging_only',
  'gate_kill_switch',
  'gate_unknown_blocked',
  'hidden_activation_check_required',
  'gate_does_not_switch_authority',
] as const;

export type GateStateLabel = (typeof GATE_STATE_LABELS)[number];
export type GateState = GateStateLabel;

export const RUNTIME_DOMAIN_LABELS = [
  'ttl_cache_freshness',
  'replay_idempotency',
  'identity_enforcement',
  'canonical_source',
  'source_authenticity_version',
  'rollback_hybrid_state',
  'diagnostics_observability',
  'feature_gate_kill_switch',
  'authority_transition',
  'security_fraud_abuse',
  'wls_privacy_safe_evidence',
  'staging_validation_evidence',
  'runtime_observability_safe_evidence',
] as const;

export type RuntimeDomainLabel = (typeof RUNTIME_DOMAIN_LABELS)[number];
export type RuntimeDomain = RuntimeDomainLabel;

export const EXPECTED_RESULT_CLASSES = [
  'fail_closed_for_paid_claim_enforcement',
  'deny_for_paid_claim_enforcement',
  'conflict_for_paid_claim_enforcement',
  'idempotent_no_op_within_approved_boundary',
  'observation_only_non_authoritative',
  'diagnostics_non_authoritative_observation',
  'rollback_to_legacy_expected',
  'post_rollback_monitoring_expected',
  'closed_for_named_wls_bucket_expected',
  'residual_risk_disposition_required',
  'unsupported_until_runtime_exists',
] as const;

export type ExpectedResultClass = (typeof EXPECTED_RESULT_CLASSES)[number];

export const ACTUAL_RESULT_CLASSES = [
  'passed',
  'failed',
  'inconclusive',
  'not_executed',
  'blocked_missing_actor_or_data',
  'blocked_missing_safe_evidence',
  'blocked_missing_safe_window',
  'blocked_missing_runtime_domain',
  'unsupported_without_runtime_change',
  'skipped_unsupported_runtime',
  'passed_for_observation_only',
  'passed_for_diagnostics_non_authority',
  'closed_for_named_bucket',
  'rejected_unsafe_evidence',
] as const;

export type ActualResultClass = (typeof ACTUAL_RESULT_CLASSES)[number];

export const EVIDENCE_STATUSES = [
  'not_required_for_this_case',
  'required_not_collected',
  'collected_safe_summary',
  'collected_aggregate_safe',
  'collected_wls_safe_summary',
  'collected_privacy_safe_screenshot',
  'rejected_unsafe',
  'insufficient',
  'accepted_for_review_only',
] as const;

export type EvidenceStatus = (typeof EVIDENCE_STATUSES)[number];

export const EXECUTION_STATUSES = [
  'not_started',
  'not_executed',
  'blocked',
  'blocked_missing_actor_or_data',
  'blocked_missing_safe_evidence',
  'blocked_missing_safe_window',
  'blocked_missing_runtime_domain',
  'skipped_unsupported_runtime',
  'executed_observation_only',
  'executed_runtime_validation',
  'executed_rollback_validation',
] as const;

export type ExecutionStatus = (typeof EXECUTION_STATUSES)[number];

export const SAFETY_STATUSES = [
  'not_assessed',
  'safe_summary_required',
  'aggregate_safe_required',
  'wls_privacy_safe_required',
  'unsafe_evidence_rejected',
  'low_volume_bucket_requires_special_handling',
  'residual_risk_open',
  'residual_risk_closed_for_named_scope',
  'residual_risk_accepted_for_named_scope_only',
] as const;

export type SafetyStatus = (typeof SAFETY_STATUSES)[number];

export const VALIDATION_CASE_FAMILIES = [
  'TTL',
  'RPL',
  'ID',
  'SRC',
  'RB',
  'DIA',
  'OBL',
  'DSO',
  'GATE',
  'AUTH',
  'SEC',
  'WLS',
] as const;

export type ValidationCaseFamily = (typeof VALIDATION_CASE_FAMILIES)[number];

export const RESIDUAL_RISK_STATUSES = [
  'not_applicable',
  'open',
  'blocked',
  'requires_safe_followup',
  'requires_named_scope_disposition',
  'accepted_for_named_scope_only',
  'closed_for_named_scope',
  'rejected_due_to_unsafe_evidence',
] as const;

export type ResidualRiskStatus = (typeof RESIDUAL_RISK_STATUSES)[number];

export const SIGNOFF_STATUSES = [
  'not_applicable',
  'not_started',
  'blocked',
  'pending_review',
  'qa_reviewed',
  'security_reviewed',
  'qa_security_signed_off_for_named_scope',
] as const;

export type SignoffStatus = (typeof SIGNOFF_STATUSES)[number];

export const LIFECYCLE_STATE_LABELS = [
  'scheduled',
  'pending',
  'active',
  'grace',
  'expired',
  'revoked',
  'refunded',
  'cancelled',
  'migrated',
  'unknown',
  'source_unavailable',
  'source_inconsistent',
  'unsupported_without_runtime_change',
  'unknown_lifecycle_blocked',
] as const;

export type LifecycleStateLabel = (typeof LIFECYCLE_STATE_LABELS)[number];

export const POLICY_VERSION_LABELS = [
  'policy_version_not_applicable',
  'policy_version_current',
  'policy_version_changed',
  'policy_version_unknown',
  'policy_version_unknown_blocked',
] as const;

export type PolicyVersionLabel = (typeof POLICY_VERSION_LABELS)[number];

export const POLICY_SOURCE_LABELS = [
  'governance_policy',
  'canonical_roadmap',
  'phase_b_policy',
  'runtime_contracts',
  'source_adapter',
  'unknown_policy_source',
] as const;

export type PolicySourceLabel = (typeof POLICY_SOURCE_LABELS)[number];

export const POLICY_APPLICABILITY_LABELS = [
  'applicable_non_authoritative',
  'not_applicable',
  'blocked_missing_policy_version',
  'blocked_unknown_policy_source',
  'requires_named_scope',
  'unsupported_without_runtime_change',
] as const;

export type PolicyApplicabilityLabel = (typeof POLICY_APPLICABILITY_LABELS)[number];

export const ENTITLEMENT_KIND_LABELS = ['vip_spend_access'] as const;

export type EntitlementKindLabel = (typeof ENTITLEMENT_KIND_LABELS)[number];

export const ENTITLEMENT_SOURCE_LABELS = ['payment', 'admin_grant', 'promo', 'migration', 'reconciliation'] as const;

export type EntitlementSourceLabel = (typeof ENTITLEMENT_SOURCE_LABELS)[number];

export const LIFECYCLE_POLICY_REASON_LABELS = [
  'active',
  'scheduled',
  'pending',
  'grace',
  'expired',
  'revoked',
  'refunded',
  'cancelled',
  'migrated',
  'unknown',
  'source_unavailable',
  'source_inconsistent',
  'source_timeout',
  'source_degraded',
  'stale_cache',
  'unknown_freshness',
  'cache_read_failure',
  'clock_skew',
  'policy_version_unknown',
  'policy_version_changed',
  'policy_version_mismatch',
  'unsupported_without_runtime_change',
] as const;

export type LifecyclePolicyReasonLabel = (typeof LIFECYCLE_POLICY_REASON_LABELS)[number];

export const LIFECYCLE_SEMANTIC_RESULT_LABELS = [
  'active_non_authoritative',
  'pending_non_authoritative',
  'terminal_lifecycle_unsafe',
  'grace_requires_policy_decision',
  'migrated_requires_reconciliation',
  'unknown_or_unsafe_lifecycle',
  'source_unavailable_or_inconsistent',
  'policy_version_unknown_blocked',
  'unsupported_without_runtime_change',
] as const;

export type LifecycleSemanticResultLabel = (typeof LIFECYCLE_SEMANTIC_RESULT_LABELS)[number];

export type LifecyclePolicySemanticClassification = {
  lifecycleStateLabel: LifecycleStateLabel;
  lifecyclePolicyReasonLabel: LifecyclePolicyReasonLabel;
  semanticResult: LifecycleSemanticResultLabel;
  policyVersionLabel: PolicyVersionLabel;
  policyApplicabilityLabel: PolicyApplicabilityLabel;
  actualResultClass: ActualResultClass;
  executionStatus: ExecutionStatus;
  evidenceStatus: EvidenceStatus;
  stopConditionLabels: readonly StopConditionLabel[];
};

export const FRESHNESS_CLASSIFICATION_LABELS = [
  'fresh',
  'stale',
  'degraded',
  'source_unavailable',
  'source_timeout',
  'source_inconsistent',
  'unknown_freshness',
  'cache_read_failure',
  'policy_version_mismatch',
  'unsupported_without_runtime_change',
] as const;

export type FreshnessClassificationLabel = (typeof FRESHNESS_CLASSIFICATION_LABELS)[number];

export const FRESHNESS_AGE_BUCKET_LABELS = ['none', 'fresh', 'stale', 'unknown'] as const;

export type FreshnessAgeBucketLabel = (typeof FRESHNESS_AGE_BUCKET_LABELS)[number];

export type RuntimeFreshnessClassification = {
  runtimeDomainLabel: Extract<RuntimeDomainLabel, 'ttl_cache_freshness'>;
  freshnessClassification: FreshnessClassificationLabel;
  freshnessReason: LifecyclePolicyReasonLabel;
  freshnessAgeBucket: FreshnessAgeBucketLabel;
  sourceFresh: boolean;
  degraded: boolean;
  policyVersionLabel: PolicyVersionLabel;
  lifecycleStateLabel: LifecycleStateLabel;
  authorityModeLabel: Extract<AuthorityModeLabel, 'shadow_only_observation'>;
  diagnosticsModeLabel: Extract<DiagnosticsModeLabel, 'diagnostics_available_non_authoritative' | 'diagnostics_safe_summary_missing'>;
  expectedResultClass: Extract<ExpectedResultClass, 'diagnostics_non_authoritative_observation' | 'unsupported_until_runtime_exists'>;
  actualResultClass: Extract<ActualResultClass, 'passed_for_observation_only' | 'inconclusive' | 'unsupported_without_runtime_change'>;
  executionStatus: Extract<ExecutionStatus, 'executed_observation_only'>;
  evidenceStatus: Extract<EvidenceStatus, 'collected_safe_summary' | 'insufficient'>;
};

export const SOURCE_AUTHENTICITY_CLASS_LABELS = [
  'trusted_source',
  'untrusted_source',
  'source_auth_unknown',
  'source_signature_missing',
  'source_signature_invalid',
  'source_adapter_unknown',
  'unsupported_without_runtime_change',
] as const;

export type SourceAuthenticityClassLabel = (typeof SOURCE_AUTHENTICITY_CLASS_LABELS)[number];

export const SOURCE_VERSION_CLASS_LABELS = [
  'source_version_current',
  'source_version_changed',
  'source_version_unknown',
  'source_version_incompatible',
  'source_version_mismatch',
  'unsupported_without_runtime_change',
] as const;

export type SourceVersionClassLabel = (typeof SOURCE_VERSION_CLASS_LABELS)[number];

export const SOURCE_CONSISTENCY_CLASS_LABELS = [
  'source_consistent',
  'source_degraded',
  'source_unavailable',
  'source_timeout',
  'source_inconsistent',
  'source_malformed',
  'unsupported_without_runtime_change',
] as const;

export type SourceConsistencyClassLabel = (typeof SOURCE_CONSISTENCY_CLASS_LABELS)[number];

export const SOURCE_ADAPTER_LABELS = ['source_adapter_known', 'source_adapter_unknown', 'source_adapter_unsupported'] as const;

export type SourceAdapterLabel = (typeof SOURCE_ADAPTER_LABELS)[number];

export const SOURCE_CLASSIFICATION_REASON_LABELS = [
  'trusted_source',
  'untrusted_source',
  'source_auth_unknown',
  'source_signature_missing',
  'source_signature_invalid',
  'source_adapter_unknown',
  'source_version_current',
  'source_version_changed',
  'source_version_unknown',
  'source_version_incompatible',
  'source_version_mismatch',
  'source_degraded',
  'source_unavailable',
  'source_timeout',
  'source_inconsistent',
  'source_malformed',
  'unsupported_without_runtime_change',
] as const;

export type SourceClassificationReasonLabel = (typeof SOURCE_CLASSIFICATION_REASON_LABELS)[number];

export type RuntimeSourceAuthenticityVersionClassification = {
  runtimeDomainLabel: Extract<RuntimeDomainLabel, 'source_authenticity_version'>;
  sourceAuthenticityClass: SourceAuthenticityClassLabel;
  sourceVersionClass: SourceVersionClassLabel;
  sourceClassificationReason: SourceClassificationReasonLabel;
  sourceVersionLabel: SourceVersionClassLabel;
  sourceAdapterLabel: SourceAdapterLabel;
  sourceConsistencyClass: SourceConsistencyClassLabel;
  diagnosticsModeLabel: Extract<DiagnosticsModeLabel, 'diagnostics_available_non_authoritative' | 'diagnostics_safe_summary_missing'>;
  authorityModeLabel: Extract<AuthorityModeLabel, 'shadow_only_observation'>;
  expectedResultClass: Extract<ExpectedResultClass, 'diagnostics_non_authoritative_observation' | 'unsupported_until_runtime_exists'>;
  actualResultClass: Extract<ActualResultClass, 'passed_for_observation_only' | 'inconclusive' | 'unsupported_without_runtime_change'>;
  executionStatus: Extract<ExecutionStatus, 'executed_observation_only'>;
  evidenceStatus: Extract<EvidenceStatus, 'collected_safe_summary' | 'insufficient'>;
  validationCaseFamily: Extract<ValidationCaseFamily, 'SRC'>;
};

export const SUBJECT_TRUST_CLASS_LABELS = [
  'trusted_subject',
  'untrusted_subject',
  'subject_unknown',
  'subject_binding_missing',
  'subject_binding_inconsistent',
  'unsupported_without_runtime_change',
] as const;

export type SubjectTrustClassLabel = (typeof SUBJECT_TRUST_CLASS_LABELS)[number];

export const SUBJECT_RELATION_CLASS_LABELS = [
  'rf_principal_matches_subject',
  'rf_principal_mismatch',
  'entitlement_subject_missing',
  'entitlement_subject_unknown',
  'cross_account_ambiguity',
  'identity_downgrade_detected',
  'unsupported_without_runtime_change',
] as const;

export type SubjectRelationClassLabel = (typeof SUBJECT_RELATION_CLASS_LABELS)[number];

export const IDENTITY_SOURCE_CLASS_LABELS = [
  'identity_source_current',
  'identity_source_unknown',
  'identity_source_inconsistent',
  'identity_source_degraded',
  'unsupported_without_runtime_change',
] as const;

export type IdentitySourceClassLabel = (typeof IDENTITY_SOURCE_CLASS_LABELS)[number];

export const PRINCIPAL_TYPE_LABELS = [
  'spacer_principal',
  'vip_spacer_principal',
  'pro_principal',
  'admin_principal',
  'unknown_principal',
] as const;

export type PrincipalTypeLabel = (typeof PRINCIPAL_TYPE_LABELS)[number];

export const SUBJECT_BINDING_LABELS = [
  'subject_binding_present',
  'subject_binding_missing',
  'subject_binding_inconsistent',
  'subject_binding_unknown',
  'unsupported_without_runtime_change',
] as const;

export type SubjectBindingLabel = (typeof SUBJECT_BINDING_LABELS)[number];

export const IDENTITY_CLASSIFICATION_REASON_LABELS = [
  'trusted_subject',
  'untrusted_subject',
  'subject_unknown',
  'subject_binding_missing',
  'subject_binding_inconsistent',
  'subject_binding_unknown',
  'rf_principal_matches_subject',
  'rf_principal_mismatch',
  'entitlement_subject_missing',
  'entitlement_subject_unknown',
  'cross_account_ambiguity',
  'identity_downgrade_detected',
  'identity_source_current',
  'identity_source_unknown',
  'identity_source_inconsistent',
  'identity_source_degraded',
  'unsupported_without_runtime_change',
] as const;

export type IdentityClassificationReasonLabel = (typeof IDENTITY_CLASSIFICATION_REASON_LABELS)[number];

export type RuntimeIdentitySubjectBindingClassification = {
  runtimeDomainLabel: Extract<RuntimeDomainLabel, 'identity_enforcement'>;
  subjectTrustClass: SubjectTrustClassLabel;
  subjectRelationClass: SubjectRelationClassLabel;
  identitySourceClass: IdentitySourceClassLabel;
  identityClassificationReason: IdentityClassificationReasonLabel;
  principalTypeLabel: PrincipalTypeLabel;
  subjectBindingLabel: SubjectBindingLabel;
  diagnosticsModeLabel: Extract<DiagnosticsModeLabel, 'diagnostics_available_non_authoritative' | 'diagnostics_safe_summary_missing'>;
  authorityModeLabel: Extract<AuthorityModeLabel, 'shadow_only_observation'>;
  expectedResultClass: Extract<ExpectedResultClass, 'diagnostics_non_authoritative_observation' | 'unsupported_until_runtime_exists'>;
  actualResultClass: Extract<ActualResultClass, 'passed_for_observation_only' | 'inconclusive' | 'unsupported_without_runtime_change'>;
  executionStatus: Extract<ExecutionStatus, 'executed_observation_only'>;
  evidenceStatus: Extract<EvidenceStatus, 'collected_safe_summary' | 'insufficient'>;
  validationCaseFamily: Extract<ValidationCaseFamily, 'ID'>;
};

export const REPLAY_CLASSIFICATION_LABELS = [
  'first_seen_operation',
  'idempotent_retry',
  'replay_detected',
  'replay_ambiguity',
  'stale_replay',
  'replay_after_lifecycle_change',
  'replay_after_source_change',
  'replay_after_policy_change',
  'replay_after_identity_downgrade',
  'cross_subject_replay_ambiguity',
  'unsupported_without_runtime_change',
] as const;

export type ReplayClassificationLabel = (typeof REPLAY_CLASSIFICATION_LABELS)[number];

export const REPLAY_IDEMPOTENCY_RELATION_LABELS = [
  'replay_payload_match',
  'replay_payload_mismatch',
  'replay_subject_match',
  'replay_subject_mismatch',
  'replay_source_match',
  'replay_source_mismatch',
  'replay_lifecycle_match',
  'replay_lifecycle_mismatch',
  'replay_policy_match',
  'replay_policy_mismatch',
  'replay_identity_match',
  'replay_identity_mismatch',
  'not_applicable',
  'unsupported_without_runtime_change',
] as const;

export type ReplayIdempotencyRelationLabel = (typeof REPLAY_IDEMPOTENCY_RELATION_LABELS)[number];

export const REPLAY_SOURCE_STATE_LABELS = [
  'replay_source_current',
  'replay_source_stale',
  'replay_source_unknown',
  'replay_source_inconsistent',
  'unsupported_without_runtime_change',
] as const;

export type ReplaySourceStateLabel = (typeof REPLAY_SOURCE_STATE_LABELS)[number];

export const REPLAY_CLASSIFICATION_REASON_LABELS = [
  ...REPLAY_CLASSIFICATION_LABELS,
  'replay_payload_match',
  'replay_payload_mismatch',
  'replay_subject_match',
  'replay_subject_mismatch',
  'replay_source_match',
  'replay_source_mismatch',
  'replay_lifecycle_match',
  'replay_lifecycle_mismatch',
  'replay_policy_match',
  'replay_policy_mismatch',
  'replay_identity_match',
  'replay_identity_mismatch',
  'replay_source_current',
  'replay_source_stale',
  'replay_source_unknown',
  'replay_source_inconsistent',
] as const;

export type ReplayClassificationReasonLabel = (typeof REPLAY_CLASSIFICATION_REASON_LABELS)[number];

export type RuntimeReplayIdempotencyClassification = {
  runtimeDomainLabel: Extract<RuntimeDomainLabel, 'replay_idempotency'>;
  replayClassification: ReplayClassificationLabel;
  replayReason: ReplayClassificationReasonLabel;
  replayIdempotencyRelation: readonly ReplayIdempotencyRelationLabel[];
  replaySourceState: ReplaySourceStateLabel;
  replayLifecycleState: LifecycleStateLabel;
  replayPolicyVersionLabel: PolicyVersionLabel;
  replayFreshnessClass: FreshnessClassificationLabel;
  replayIdentityBindingClass: SubjectBindingLabel;
  diagnosticsModeLabel: Extract<DiagnosticsModeLabel, 'diagnostics_available_non_authoritative' | 'diagnostics_safe_summary_missing'>;
  authorityModeLabel: Extract<AuthorityModeLabel, 'shadow_only_observation'>;
  expectedResultClass: Extract<ExpectedResultClass, 'diagnostics_non_authoritative_observation' | 'unsupported_until_runtime_exists'>;
  actualResultClass: Extract<ActualResultClass, 'passed_for_observation_only' | 'inconclusive' | 'unsupported_without_runtime_change'>;
  executionStatus: Extract<ExecutionStatus, 'executed_observation_only'>;
  evidenceStatus: Extract<EvidenceStatus, 'collected_safe_summary' | 'insufficient'>;
  validationCaseFamily: Extract<ValidationCaseFamily, 'RPL'>;
};

export const STAGING_ENVELOPE_LABELS = [
  'disabled_by_default',
  'staging_scope_not_defined',
  'no_runtime_activation',
  'no_authority_transition',
  'no_production_routing',
  'hidden_activation_blocked',
  'unsupported_without_runtime_change',
] as const;

export type StagingEnvelopeLabel = (typeof STAGING_ENVELOPE_LABELS)[number];

export const STAGING_SCOPE_LABELS = [
  'staging_scope_not_defined',
  'named_staging_scope_required',
  'named_safe_actors_required',
  'named_safe_window_required',
  'production_scope_blocked',
  'unsupported_without_runtime_change',
] as const;

export type StagingScopeLabel = (typeof STAGING_SCOPE_LABELS)[number];

export const VIP_ENTITLEMENT_STAGING_ENVELOPE_DISABLED_DEFAULTS = {
  envelopeActive: false,
  envelopeRuntimeEnabled: false,
  envelopeAuthorityEnabled: false,
  envelopeProductionRoutingEnabled: false,
  envelopeFailClosedEnabled: false,
  envelopeReplayRejectionEnabled: false,
  envelopeCacheInvalidationEnabled: false,
} as const;

export type RuntimeStagingEnvelopeSkeleton = {
  runtimeDomainLabel: Extract<RuntimeDomainLabel, 'feature_gate_kill_switch'>;
  stagingEnvelopeLabel: StagingEnvelopeLabel;
  stagingScopeLabel: StagingScopeLabel;
  envelopeActive: false;
  envelopeRuntimeEnabled: false;
  envelopeAuthorityEnabled: false;
  envelopeProductionRoutingEnabled: false;
  envelopeFailClosedEnabled: false;
  envelopeReplayRejectionEnabled: false;
  envelopeCacheInvalidationEnabled: false;
  authorityModeLabel: Extract<AuthorityModeLabel, 'authority_transition_not_started'>;
  gateStateLabel: Extract<GateStateLabel, 'gate_disabled'>;
  rollbackModeLabel: Extract<RollbackModeLabel, 'no_enforcement_baseline'>;
  diagnosticsModeLabel: Extract<DiagnosticsModeLabel, 'diagnostics_available_non_authoritative' | 'diagnostics_safe_summary_missing'>;
  expectedResultClass: Extract<ExpectedResultClass, 'diagnostics_non_authoritative_observation'>;
  actualResultClass: Extract<ActualResultClass, 'passed_for_observation_only'>;
  executionStatus: Extract<ExecutionStatus, 'executed_observation_only'>;
  evidenceStatus: Extract<EvidenceStatus, 'collected_safe_summary'>;
  validationCaseFamily: Extract<ValidationCaseFamily, 'GATE'>;
};

export const INPUT_CLASSIFICATION_LABELS = [
  'trusted_input',
  'untrusted_input',
  'partial_input',
  'degraded_input',
  'malformed_input',
  'source_unavailable',
  'source_timeout',
  'unknown_input_blocked',
] as const;

export type InputClassificationLabel = (typeof INPUT_CLASSIFICATION_LABELS)[number];

export const STOP_CONDITION_LABELS = [
  'missing_domain_boundary',
  'missing_shared_runtime_terminology',
  'missing_security_threat_model',
  'missing_fraud_abuse_cases',
  'missing_validation_expectations',
  'missing_rollback_safety_design',
  'missing_evidence_path',
  'missing_wls_privacy_safe_evidence_path',
  'missing_safe_actors_or_fixtures',
  'missing_staging_execution_window',
  'missing_diagnostics_safe_observation_window',
  'missing_rollback_observation_path',
  'unclear_authority_boundary',
  'unclear_enforcement_scope',
  'canonical_source_could_become_hidden_authority',
  'feature_gate_could_become_hidden_enforcement',
  'diagnostics_could_become_authority',
  'fail_closed_depends_on_diagnostics',
  'source_cache_identity_replay_semantics_incomplete',
  'replay_semantics_detached_from_identity_lifecycle_source_cache_policy_or_rollback',
  'partial_rf_claim_idempotency_treated_as_governance_grade_replay_runtime',
  'economy_spend_coupling_ambiguity_unresolved',
  'validation_evidence_claimed_without_executed_runtime_behavior',
  'unsupported_runtime_cases_counted_as_passed',
  'no_rollback_path_exists',
  'wls_residual_risks_ignored_or_hidden',
  'phase_g_treated_as_approval_or_rollout',
  'missing_authority_mode_terminology',
  'missing_diagnostics_non_authority_boundary',
  'missing_stop_condition_vocabulary',
] as const;

export type StopConditionLabel = (typeof STOP_CONDITION_LABELS)[number];

export type RuntimeEvidenceTaxonomyContract = {
  expectedResultClass: ExpectedResultClass;
  actualResultClass: ActualResultClass;
  evidenceStatus: EvidenceStatus;
  executionStatus: ExecutionStatus;
  safetyStatus: SafetyStatus;
  authorityModeLabel: AuthorityModeLabel;
  rollbackModeLabel: RollbackModeLabel;
  gateStateLabel: GateStateLabel;
  diagnosticsModeLabel: DiagnosticsModeLabel;
  runtimeDomainLabel: RuntimeDomainLabel;
  validationCaseFamily?: ValidationCaseFamily;
  residualRiskStatus?: ResidualRiskStatus;
  signoffStatus?: SignoffStatus;
};

export type RuntimeSemanticFoundationContract = {
  contractVersion: typeof VIP_ENTITLEMENT_RUNTIME_CONTRACT_VERSION;
  authorityModeLabel: AuthorityModeLabel;
  diagnosticsModeLabel: DiagnosticsModeLabel;
  rollbackModeLabel: RollbackModeLabel;
  gateStateLabel: GateStateLabel;
  runtimeDomainLabel: RuntimeDomainLabel;
  lifecycleStateLabel?: LifecycleStateLabel;
  policyVersionLabel?: PolicyVersionLabel;
  inputClassificationLabel?: InputClassificationLabel;
  stopConditionLabels?: readonly StopConditionLabel[];
};

export type LifecyclePolicySemanticsContract = RuntimeSemanticFoundationContract & {
  entitlementKindLabel?: EntitlementKindLabel;
  entitlementSourceLabel?: EntitlementSourceLabel;
  lifecycleStateLabel: LifecycleStateLabel;
  lifecyclePolicyReasonLabel: LifecyclePolicyReasonLabel;
  lifecycleSemanticResultLabel: LifecycleSemanticResultLabel;
  policySourceLabel?: PolicySourceLabel;
  policyApplicabilityLabel: PolicyApplicabilityLabel;
};

export type StopConditionContract = {
  label: StopConditionLabel;
  runtimeDomainLabel?: RuntimeDomainLabel;
  authorityModeLabel?: AuthorityModeLabel;
  diagnosticsModeLabel?: DiagnosticsModeLabel;
  rollbackModeLabel?: RollbackModeLabel;
};

export type RuntimeContractUsageBoundary = {
  readonly contractsOnly: true;
  readonly nonAuthoritative: true;
  readonly runtimeDecisionBehaviorStatus: 'unchanged';
  readonly enforcementRuntimeStatus: 'not_implemented';
  readonly rolloutStatus: 'not_authorized';
  readonly approvalStatus: 'not_approved';
};

const TERMINAL_LIFECYCLE_STATES = ['expired', 'revoked', 'refunded', 'cancelled'] as const satisfies readonly LifecycleStateLabel[];
const UNKNOWN_OR_UNSAFE_LIFECYCLE_STATES = [
  ...TERMINAL_LIFECYCLE_STATES,
  'unknown',
  'source_unavailable',
  'source_inconsistent',
  'unsupported_without_runtime_change',
  'unknown_lifecycle_blocked',
] as const satisfies readonly LifecycleStateLabel[];

function normalizeToken(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase().replace(/[\s-]+/g, '_') : '';
}

function includesLiteral<T extends readonly string[]>(values: T, value: string): value is T[number] {
  return (values as readonly string[]).includes(value);
}

export function normalizeLifecycleReason(reason: unknown): LifecyclePolicyReasonLabel {
  const normalized = normalizeToken(reason);
  if (includesLiteral(LIFECYCLE_POLICY_REASON_LABELS, normalized)) {
    return normalized;
  }
  return 'unknown';
}

export function normalizeLifecycleStateLabel(state: unknown): LifecycleStateLabel {
  const normalized = normalizeToken(state);
  if (includesLiteral(LIFECYCLE_STATE_LABELS, normalized)) {
    return normalized;
  }
  return 'unknown';
}

export function isTerminalLifecycleState(state: LifecycleStateLabel): boolean {
  return (TERMINAL_LIFECYCLE_STATES as readonly LifecycleStateLabel[]).includes(state);
}

export function isUnknownOrUnsafeLifecycleState(state: LifecycleStateLabel): boolean {
  return (UNKNOWN_OR_UNSAFE_LIFECYCLE_STATES as readonly LifecycleStateLabel[]).includes(state);
}

export function classifyPolicyApplicability(input: {
  policyVersionLabel?: PolicyVersionLabel | null;
  policySourceLabel?: PolicySourceLabel | null;
  namedScopePresent?: boolean;
}): PolicyApplicabilityLabel {
  if (input.policyVersionLabel === 'policy_version_unknown' || input.policyVersionLabel === 'policy_version_unknown_blocked') {
    return 'blocked_missing_policy_version';
  }

  if (input.policySourceLabel === 'unknown_policy_source') {
    return 'blocked_unknown_policy_source';
  }

  if (input.namedScopePresent === false) {
    return 'requires_named_scope';
  }

  if (input.policyVersionLabel === 'policy_version_not_applicable') {
    return 'not_applicable';
  }

  return 'applicable_non_authoritative';
}

export function classifyLifecycleState(input: {
  lifecycleState?: unknown;
  lifecycleReason?: unknown;
  policyVersionLabel?: PolicyVersionLabel | null;
  policySourceLabel?: PolicySourceLabel | null;
  namedScopePresent?: boolean;
}): LifecyclePolicySemanticClassification {
  const lifecycleStateLabel = normalizeLifecycleStateLabel(input.lifecycleState);
  const lifecyclePolicyReasonLabel = normalizeLifecycleReason(input.lifecycleReason ?? lifecycleStateLabel);
  const policyVersionLabel = input.policyVersionLabel ?? 'policy_version_not_applicable';
  const policyApplicabilityLabel = classifyPolicyApplicability({
    policyVersionLabel,
    policySourceLabel: input.policySourceLabel,
    namedScopePresent: input.namedScopePresent,
  });
  const stopConditionLabels: StopConditionLabel[] = [];

  let semanticResult: LifecycleSemanticResultLabel;
  let actualResultClass: ActualResultClass = 'not_executed';

  if (policyApplicabilityLabel === 'blocked_missing_policy_version') {
    semanticResult = 'policy_version_unknown_blocked';
    actualResultClass = 'blocked_missing_runtime_domain';
    stopConditionLabels.push('validation_evidence_claimed_without_executed_runtime_behavior');
  } else if (lifecycleStateLabel === 'active') {
    semanticResult = 'active_non_authoritative';
  } else if (lifecycleStateLabel === 'scheduled' || lifecycleStateLabel === 'pending') {
    semanticResult = 'pending_non_authoritative';
  } else if (lifecycleStateLabel === 'grace') {
    semanticResult = 'grace_requires_policy_decision';
    stopConditionLabels.push('unclear_enforcement_scope');
  } else if (lifecycleStateLabel === 'migrated') {
    semanticResult = 'migrated_requires_reconciliation';
    stopConditionLabels.push('unclear_authority_boundary');
  } else if (isTerminalLifecycleState(lifecycleStateLabel)) {
    semanticResult = 'terminal_lifecycle_unsafe';
  } else if (lifecycleStateLabel === 'source_unavailable' || lifecycleStateLabel === 'source_inconsistent') {
    semanticResult = 'source_unavailable_or_inconsistent';
    actualResultClass = 'unsupported_without_runtime_change';
  } else if (lifecycleStateLabel === 'unsupported_without_runtime_change') {
    semanticResult = 'unsupported_without_runtime_change';
    actualResultClass = 'unsupported_without_runtime_change';
  } else {
    semanticResult = 'unknown_or_unsafe_lifecycle';
    actualResultClass = 'blocked_missing_runtime_domain';
  }

  return {
    lifecycleStateLabel,
    lifecyclePolicyReasonLabel,
    semanticResult,
    policyVersionLabel,
    policyApplicabilityLabel,
    actualResultClass,
    executionStatus: 'not_executed',
    evidenceStatus: 'required_not_collected',
    stopConditionLabels,
  };
}

export function classifyFreshnessAgeBucket(sourceAgeMs: number | null | undefined): FreshnessAgeBucketLabel {
  if (sourceAgeMs === null || sourceAgeMs === undefined) return 'none';
  if (!Number.isFinite(sourceAgeMs)) return 'unknown';
  return sourceAgeMs <= 60_000 ? 'fresh' : 'stale';
}

export function classifyRuntimeFreshness(input: {
  sourceFresh?: boolean | null;
  sourceAgeMs?: number | null;
  stale?: boolean | null;
  degraded?: boolean | null;
  adapterStatus?: string | null;
  reason?: unknown;
  policyVersionLabel?: PolicyVersionLabel | null;
  lifecycleStateLabel?: LifecycleStateLabel | null;
  diagnosticsAvailable?: boolean | null;
}): RuntimeFreshnessClassification {
  const normalizedReason = normalizeLifecycleReason(input.reason);
  const adapterStatus = normalizeToken(input.adapterStatus);
  const policyVersionLabel = input.policyVersionLabel ?? 'policy_version_not_applicable';
  const lifecycleStateLabel = input.lifecycleStateLabel ?? 'unknown';
  const freshnessAgeBucket = classifyFreshnessAgeBucket(input.sourceAgeMs);
  const degraded = input.degraded === true || adapterStatus === 'degraded';
  const sourceFresh = input.sourceFresh === true && !input.stale && !degraded;

  let freshnessClassification: FreshnessClassificationLabel;
  let freshnessReason: LifecyclePolicyReasonLabel = normalizedReason;
  let actualResultClass: RuntimeFreshnessClassification['actualResultClass'] = 'passed_for_observation_only';
  let evidenceStatus: RuntimeFreshnessClassification['evidenceStatus'] = 'collected_safe_summary';
  let expectedResultClass: RuntimeFreshnessClassification['expectedResultClass'] = 'diagnostics_non_authoritative_observation';

  if (normalizedReason === 'unsupported_without_runtime_change') {
    freshnessClassification = 'unsupported_without_runtime_change';
    actualResultClass = 'unsupported_without_runtime_change';
    evidenceStatus = 'insufficient';
    expectedResultClass = 'unsupported_until_runtime_exists';
  } else if (
    policyVersionLabel === 'policy_version_changed' ||
    policyVersionLabel === 'policy_version_unknown' ||
    policyVersionLabel === 'policy_version_unknown_blocked' ||
    normalizedReason === 'policy_version_changed' ||
    normalizedReason === 'policy_version_unknown' ||
    normalizedReason === 'policy_version_mismatch'
  ) {
    freshnessClassification = 'policy_version_mismatch';
    freshnessReason = normalizedReason === 'policy_version_changed' || normalizedReason === 'policy_version_unknown' ? normalizedReason : 'policy_version_mismatch';
    actualResultClass = 'inconclusive';
  } else if (normalizedReason === 'cache_read_failure') {
    freshnessClassification = 'cache_read_failure';
    actualResultClass = 'inconclusive';
  } else if (adapterStatus === 'timeout' || normalizedReason === 'source_timeout') {
    freshnessClassification = 'source_timeout';
    freshnessReason = 'source_timeout';
    actualResultClass = 'inconclusive';
  } else if (adapterStatus === 'unavailable' || normalizedReason === 'source_unavailable') {
    freshnessClassification = 'source_unavailable';
    freshnessReason = 'source_unavailable';
    actualResultClass = 'inconclusive';
  } else if (normalizedReason === 'source_inconsistent') {
    freshnessClassification = 'source_inconsistent';
    actualResultClass = 'inconclusive';
  } else if (normalizedReason === 'unknown_freshness') {
    freshnessClassification = 'unknown_freshness';
    actualResultClass = 'inconclusive';
  } else if (input.stale === true || normalizedReason === 'stale_cache' || freshnessAgeBucket === 'stale') {
    freshnessClassification = 'stale';
    freshnessReason = normalizedReason === 'unknown' ? 'stale_cache' : normalizedReason;
  } else if (degraded || normalizedReason === 'source_degraded') {
    freshnessClassification = 'degraded';
    freshnessReason = normalizedReason === 'unknown' ? 'source_degraded' : normalizedReason;
    actualResultClass = 'inconclusive';
  } else if (input.sourceFresh === false || freshnessAgeBucket === 'none' || freshnessAgeBucket === 'unknown') {
    freshnessClassification = 'unknown_freshness';
    freshnessReason = normalizedReason === 'unknown' ? 'unknown_freshness' : normalizedReason;
    actualResultClass = 'inconclusive';
  } else {
    freshnessClassification = 'fresh';
    freshnessReason = normalizedReason === 'unknown' ? 'active' : normalizedReason;
  }

  return {
    runtimeDomainLabel: 'ttl_cache_freshness',
    freshnessClassification,
    freshnessReason,
    freshnessAgeBucket,
    sourceFresh,
    degraded,
    policyVersionLabel,
    lifecycleStateLabel,
    authorityModeLabel: 'shadow_only_observation',
    diagnosticsModeLabel: input.diagnosticsAvailable === false ? 'diagnostics_safe_summary_missing' : 'diagnostics_available_non_authoritative',
    expectedResultClass,
    actualResultClass,
    executionStatus: 'executed_observation_only',
    evidenceStatus,
  };
}

export function normalizeSourceClassificationReason(reason: unknown): SourceClassificationReasonLabel {
  const normalized = normalizeToken(reason);
  if (includesLiteral(SOURCE_CLASSIFICATION_REASON_LABELS, normalized)) {
    return normalized;
  }
  return 'source_auth_unknown';
}

export function classifyRuntimeSourceAuthenticityVersion(input: {
  sourceType?: string | null;
  decisionSource?: string | null;
  adapterStatus?: string | null;
  adapterVersion?: string | null;
  expectedAdapterVersion?: string | null;
  decisionVersion?: number | null;
  expectedDecisionVersion?: number | null;
  signatureState?: string | null;
  sourceState?: unknown;
  diagnosticsAvailable?: boolean | null;
}): RuntimeSourceAuthenticityVersionClassification {
  const sourceType = normalizeToken(input.sourceType);
  const decisionSource = normalizeToken(input.decisionSource);
  const adapterStatus = normalizeToken(input.adapterStatus);
  const adapterVersion = normalizeToken(input.adapterVersion);
  const expectedAdapterVersion = normalizeToken(input.expectedAdapterVersion);
  const signatureState = normalizeToken(input.signatureState);
  const sourceState = normalizeSourceClassificationReason(input.sourceState);
  const sourceAdapterLabel: SourceAdapterLabel = adapterStatus === 'unknown_source' || sourceType === 'unknown' ? 'source_adapter_unknown' : 'source_adapter_known';

  let sourceConsistencyClass: SourceConsistencyClassLabel = 'source_consistent';
  if (sourceState === 'unsupported_without_runtime_change') sourceConsistencyClass = 'unsupported_without_runtime_change';
  else if (adapterStatus === 'timeout' || sourceState === 'source_timeout') sourceConsistencyClass = 'source_timeout';
  else if (adapterStatus === 'unavailable' || sourceState === 'source_unavailable') sourceConsistencyClass = 'source_unavailable';
  else if (adapterStatus === 'degraded' || sourceState === 'source_degraded') sourceConsistencyClass = 'source_degraded';
  else if (sourceState === 'source_malformed') sourceConsistencyClass = 'source_malformed';
  else if (adapterStatus === 'unknown_source' || sourceState === 'source_inconsistent') sourceConsistencyClass = 'source_inconsistent';

  let sourceAuthenticityClass: SourceAuthenticityClassLabel = 'source_auth_unknown';
  if (sourceState === 'unsupported_without_runtime_change') {
    sourceAuthenticityClass = 'unsupported_without_runtime_change';
  } else if (signatureState === 'missing' || sourceState === 'source_signature_missing') {
    sourceAuthenticityClass = 'source_signature_missing';
  } else if (signatureState === 'invalid' || sourceState === 'source_signature_invalid') {
    sourceAuthenticityClass = 'source_signature_invalid';
  } else if (signatureState === 'untrusted' || sourceState === 'untrusted_source') {
    sourceAuthenticityClass = 'untrusted_source';
  } else if (sourceAdapterLabel === 'source_adapter_unknown') {
    sourceAuthenticityClass = 'source_adapter_unknown';
  } else if (
    (sourceType === 'canonical_entitlement_store' && decisionSource === 'canonical_entitlement') ||
    (sourceType === 'approved_cache' && decisionSource === 'approved_cache')
  ) {
    sourceAuthenticityClass = 'trusted_source';
  }

  let sourceVersionClass: SourceVersionClassLabel = 'source_version_current';
  if (sourceState === 'unsupported_without_runtime_change') {
    sourceVersionClass = 'unsupported_without_runtime_change';
  } else if (
    sourceConsistencyClass === 'source_timeout' ||
    sourceConsistencyClass === 'source_unavailable' ||
    sourceAdapterLabel === 'source_adapter_unknown'
  ) {
    sourceVersionClass = 'source_version_unknown';
  } else if (sourceState === 'source_version_changed') {
    sourceVersionClass = 'source_version_changed';
  } else if (sourceState === 'source_version_incompatible') {
    sourceVersionClass = 'source_version_incompatible';
  } else if (sourceState === 'source_version_mismatch') {
    sourceVersionClass = 'source_version_mismatch';
  } else if (expectedAdapterVersion.length > 0 && adapterVersion.length > 0 && adapterVersion !== expectedAdapterVersion) {
    sourceVersionClass = 'source_version_mismatch';
  } else if (!Number.isInteger(input.decisionVersion)) {
    sourceVersionClass = 'source_version_unknown';
  } else if (
    Number.isInteger(input.expectedDecisionVersion) &&
    Number.isInteger(input.decisionVersion) &&
    input.decisionVersion !== input.expectedDecisionVersion
  ) {
    sourceVersionClass = 'source_version_incompatible';
  }

  let sourceClassificationReason: SourceClassificationReasonLabel = sourceState;
  if (sourceClassificationReason === 'source_auth_unknown') {
    if (sourceConsistencyClass !== 'source_consistent') sourceClassificationReason = sourceConsistencyClass;
    else if (sourceVersionClass !== 'source_version_current') sourceClassificationReason = sourceVersionClass;
    else sourceClassificationReason = sourceAuthenticityClass;
  }

  const unsupported =
    sourceAuthenticityClass === 'unsupported_without_runtime_change' ||
    sourceVersionClass === 'unsupported_without_runtime_change' ||
    sourceConsistencyClass === 'unsupported_without_runtime_change';
  const inconclusive =
    unsupported ||
    sourceAuthenticityClass !== 'trusted_source' ||
    sourceVersionClass !== 'source_version_current' ||
    sourceConsistencyClass !== 'source_consistent';

  return {
    runtimeDomainLabel: 'source_authenticity_version',
    sourceAuthenticityClass,
    sourceVersionClass,
    sourceClassificationReason,
    sourceVersionLabel: sourceVersionClass,
    sourceAdapterLabel,
    sourceConsistencyClass,
    diagnosticsModeLabel: input.diagnosticsAvailable === false ? 'diagnostics_safe_summary_missing' : 'diagnostics_available_non_authoritative',
    authorityModeLabel: 'shadow_only_observation',
    expectedResultClass: unsupported ? 'unsupported_until_runtime_exists' : 'diagnostics_non_authoritative_observation',
    actualResultClass: unsupported ? 'unsupported_without_runtime_change' : inconclusive ? 'inconclusive' : 'passed_for_observation_only',
    executionStatus: 'executed_observation_only',
    evidenceStatus: unsupported ? 'insufficient' : 'collected_safe_summary',
    validationCaseFamily: 'SRC',
  };
}

export function normalizeIdentityClassificationReason(reason: unknown): IdentityClassificationReasonLabel {
  const normalized = normalizeToken(reason);
  if (includesLiteral(IDENTITY_CLASSIFICATION_REASON_LABELS, normalized)) {
    return normalized;
  }
  return 'subject_unknown';
}

export function classifyRuntimeIdentitySubjectBinding(input: {
  trustedSubjectPresent?: boolean | null;
  rfPrincipalPresent?: boolean | null;
  rfPrincipalMatchesSubject?: boolean | null;
  entitlementSubjectPresent?: boolean | null;
  entitlementSubjectMatchesPrincipal?: boolean | null;
  crossAccountSignal?: boolean | null;
  identityDowngradeSignal?: boolean | null;
  principalType?: string | null;
  identitySourceState?: unknown;
  diagnosticsAvailable?: boolean | null;
}): RuntimeIdentitySubjectBindingClassification {
  const identitySourceState = normalizeIdentityClassificationReason(input.identitySourceState);
  const principalType = normalizeToken(input.principalType);
  const principalTypeLabel: PrincipalTypeLabel =
    principalType === 'admin'
      ? 'admin_principal'
      : principalType === 'pro'
        ? 'pro_principal'
        : principalType === 'vip_spacer'
          ? 'vip_spacer_principal'
          : principalType === 'spacer'
            ? 'spacer_principal'
            : 'unknown_principal';

  let identitySourceClass: IdentitySourceClassLabel = 'identity_source_current';
  if (identitySourceState === 'unsupported_without_runtime_change') identitySourceClass = 'unsupported_without_runtime_change';
  else if (identitySourceState === 'identity_source_degraded') identitySourceClass = 'identity_source_degraded';
  else if (identitySourceState === 'identity_source_inconsistent') identitySourceClass = 'identity_source_inconsistent';
  else if (identitySourceState === 'identity_source_unknown' || principalTypeLabel === 'unknown_principal') identitySourceClass = 'identity_source_unknown';

  let subjectTrustClass: SubjectTrustClassLabel = 'subject_unknown';
  if (identitySourceState === 'unsupported_without_runtime_change') {
    subjectTrustClass = 'unsupported_without_runtime_change';
  } else if (input.trustedSubjectPresent === false) {
    subjectTrustClass = 'subject_binding_missing';
  } else if (input.rfPrincipalPresent === false || principalTypeLabel === 'unknown_principal') {
    subjectTrustClass = 'untrusted_subject';
  } else if (input.rfPrincipalMatchesSubject === false || input.entitlementSubjectMatchesPrincipal === false) {
    subjectTrustClass = 'subject_binding_inconsistent';
  } else if (input.trustedSubjectPresent === true) {
    subjectTrustClass = 'trusted_subject';
  }

  let subjectRelationClass: SubjectRelationClassLabel = 'entitlement_subject_unknown';
  if (identitySourceState === 'unsupported_without_runtime_change') {
    subjectRelationClass = 'unsupported_without_runtime_change';
  } else if (input.identityDowngradeSignal === true) {
    subjectRelationClass = 'identity_downgrade_detected';
  } else if (input.crossAccountSignal === true) {
    subjectRelationClass = 'cross_account_ambiguity';
  } else if (input.rfPrincipalMatchesSubject === false || input.entitlementSubjectMatchesPrincipal === false) {
    subjectRelationClass = 'rf_principal_mismatch';
  } else if (input.entitlementSubjectPresent === false) {
    subjectRelationClass = 'entitlement_subject_missing';
  } else if (input.rfPrincipalMatchesSubject === true && input.entitlementSubjectMatchesPrincipal === true) {
    subjectRelationClass = 'rf_principal_matches_subject';
  }

  let subjectBindingLabel: SubjectBindingLabel = 'subject_binding_unknown';
  if (identitySourceState === 'unsupported_without_runtime_change') subjectBindingLabel = 'unsupported_without_runtime_change';
  else if (subjectTrustClass === 'subject_binding_missing' || subjectRelationClass === 'entitlement_subject_missing') subjectBindingLabel = 'subject_binding_missing';
  else if (subjectTrustClass === 'subject_binding_inconsistent' || subjectRelationClass === 'rf_principal_mismatch' || subjectRelationClass === 'cross_account_ambiguity') {
    subjectBindingLabel = 'subject_binding_inconsistent';
  } else if (subjectTrustClass === 'trusted_subject' && subjectRelationClass === 'rf_principal_matches_subject') {
    subjectBindingLabel = 'subject_binding_present';
  }

  let identityClassificationReason: IdentityClassificationReasonLabel = identitySourceState;
  if (identityClassificationReason === 'subject_unknown') {
    if (subjectRelationClass !== 'rf_principal_matches_subject' && subjectRelationClass !== 'entitlement_subject_unknown') identityClassificationReason = subjectRelationClass;
    else if (subjectBindingLabel !== 'subject_binding_present') identityClassificationReason = subjectBindingLabel;
    else if (identitySourceClass !== 'identity_source_current') identityClassificationReason = identitySourceClass;
    else identityClassificationReason = subjectTrustClass;
  }

  const unsupported =
    subjectTrustClass === 'unsupported_without_runtime_change' ||
    subjectRelationClass === 'unsupported_without_runtime_change' ||
    identitySourceClass === 'unsupported_without_runtime_change' ||
    subjectBindingLabel === 'unsupported_without_runtime_change';
  const inconclusive =
    unsupported ||
    subjectTrustClass !== 'trusted_subject' ||
    subjectRelationClass !== 'rf_principal_matches_subject' ||
    identitySourceClass !== 'identity_source_current' ||
    subjectBindingLabel !== 'subject_binding_present';

  return {
    runtimeDomainLabel: 'identity_enforcement',
    subjectTrustClass,
    subjectRelationClass,
    identitySourceClass,
    identityClassificationReason,
    principalTypeLabel,
    subjectBindingLabel,
    diagnosticsModeLabel: input.diagnosticsAvailable === false ? 'diagnostics_safe_summary_missing' : 'diagnostics_available_non_authoritative',
    authorityModeLabel: 'shadow_only_observation',
    expectedResultClass: unsupported ? 'unsupported_until_runtime_exists' : 'diagnostics_non_authoritative_observation',
    actualResultClass: unsupported ? 'unsupported_without_runtime_change' : inconclusive ? 'inconclusive' : 'passed_for_observation_only',
    executionStatus: 'executed_observation_only',
    evidenceStatus: unsupported ? 'insufficient' : 'collected_safe_summary',
    validationCaseFamily: 'ID',
  };
}

export function normalizeReplayClassificationReason(reason: unknown): ReplayClassificationReasonLabel {
  const normalized = normalizeToken(reason);
  if (includesLiteral(REPLAY_CLASSIFICATION_REASON_LABELS, normalized)) {
    return normalized;
  }
  return 'first_seen_operation';
}

function normalizeReplaySourceState(state: unknown): ReplaySourceStateLabel {
  const normalized = normalizeToken(state);
  if (includesLiteral(REPLAY_SOURCE_STATE_LABELS, normalized)) {
    return normalized;
  }
  return 'replay_source_unknown';
}

function appendRelation(relations: ReplayIdempotencyRelationLabel[], relation: ReplayIdempotencyRelationLabel): void {
  if (!relations.includes(relation)) relations.push(relation);
}

export function classifyRuntimeReplayIdempotency(input: {
  operationSeenBefore?: boolean | null;
  idempotentRetry?: boolean | null;
  payloadMatches?: boolean | null;
  subjectMatches?: boolean | null;
  sourceMatches?: boolean | null;
  lifecycleChanged?: boolean | null;
  sourceChanged?: boolean | null;
  policyChanged?: boolean | null;
  identityDowngradeSignal?: boolean | null;
  crossSubjectSignal?: boolean | null;
  staleReplaySignal?: boolean | null;
  unsupportedRuntime?: boolean | null;
  replaySourceState?: unknown;
  replayReason?: unknown;
  lifecycleStateLabel?: LifecycleStateLabel | null;
  policyVersionLabel?: PolicyVersionLabel | null;
  freshnessClassification?: FreshnessClassificationLabel | null;
  identityBindingLabel?: SubjectBindingLabel | null;
  diagnosticsAvailable?: boolean | null;
}): RuntimeReplayIdempotencyClassification {
  const normalizedReason = normalizeReplayClassificationReason(input.replayReason);
  const replaySourceState = normalizeReplaySourceState(input.replaySourceState);
  const replayLifecycleState = input.lifecycleStateLabel ?? 'unknown';
  const replayPolicyVersionLabel = input.policyVersionLabel ?? 'policy_version_not_applicable';
  const replayFreshnessClass = input.freshnessClassification ?? 'unknown_freshness';
  const replayIdentityBindingClass = input.identityBindingLabel ?? 'subject_binding_unknown';
  const relations: ReplayIdempotencyRelationLabel[] = [];

  if (input.payloadMatches === true) appendRelation(relations, 'replay_payload_match');
  if (input.payloadMatches === false) appendRelation(relations, 'replay_payload_mismatch');
  if (input.subjectMatches === true) appendRelation(relations, 'replay_subject_match');
  if (input.subjectMatches === false) appendRelation(relations, 'replay_subject_mismatch');
  if (input.sourceMatches === true) appendRelation(relations, 'replay_source_match');
  if (input.sourceMatches === false) appendRelation(relations, 'replay_source_mismatch');
  if (input.lifecycleChanged === true) appendRelation(relations, 'replay_lifecycle_mismatch');
  if (input.lifecycleChanged === false) appendRelation(relations, 'replay_lifecycle_match');
  if (input.policyChanged === true) appendRelation(relations, 'replay_policy_mismatch');
  if (input.policyChanged === false) appendRelation(relations, 'replay_policy_match');
  if (input.identityDowngradeSignal === true || replayIdentityBindingClass === 'subject_binding_inconsistent') appendRelation(relations, 'replay_identity_mismatch');
  if (input.identityDowngradeSignal === false && replayIdentityBindingClass === 'subject_binding_present') appendRelation(relations, 'replay_identity_match');
  if (relations.length === 0) appendRelation(relations, 'not_applicable');

  let replayClassification: ReplayClassificationLabel;
  let replayReason: ReplayClassificationReasonLabel = normalizedReason;
  let actualResultClass: RuntimeReplayIdempotencyClassification['actualResultClass'] = 'passed_for_observation_only';
  let expectedResultClass: RuntimeReplayIdempotencyClassification['expectedResultClass'] = 'diagnostics_non_authoritative_observation';
  let evidenceStatus: RuntimeReplayIdempotencyClassification['evidenceStatus'] = 'collected_safe_summary';
  const replayObserved = input.operationSeenBefore === true || input.idempotentRetry === true;

  if (input.unsupportedRuntime === true || normalizedReason === 'unsupported_without_runtime_change' || replaySourceState === 'unsupported_without_runtime_change') {
    replayClassification = 'unsupported_without_runtime_change';
    replayReason = 'unsupported_without_runtime_change';
    actualResultClass = 'unsupported_without_runtime_change';
    expectedResultClass = 'unsupported_until_runtime_exists';
    evidenceStatus = 'insufficient';
    appendRelation(relations, 'unsupported_without_runtime_change');
  } else if (input.crossSubjectSignal === true || input.subjectMatches === false) {
    replayClassification = 'cross_subject_replay_ambiguity';
    replayReason = input.subjectMatches === false ? 'replay_subject_mismatch' : 'cross_subject_replay_ambiguity';
    actualResultClass = 'inconclusive';
  } else if (input.identityDowngradeSignal === true || replayIdentityBindingClass === 'subject_binding_inconsistent') {
    replayClassification = 'replay_after_identity_downgrade';
    replayReason = 'replay_after_identity_downgrade';
    actualResultClass = 'inconclusive';
  } else if (
    input.staleReplaySignal === true ||
    (replayObserved && (replaySourceState === 'replay_source_stale' || replayFreshnessClass === 'stale' || replayFreshnessClass === 'cache_read_failure'))
  ) {
    replayClassification = 'stale_replay';
    replayReason = replaySourceState === 'replay_source_stale' ? 'replay_source_stale' : 'stale_replay';
    actualResultClass = 'inconclusive';
  } else if (input.lifecycleChanged === true || (replayObserved && isTerminalLifecycleState(replayLifecycleState))) {
    replayClassification = 'replay_after_lifecycle_change';
    replayReason = input.lifecycleChanged === true ? 'replay_lifecycle_mismatch' : 'replay_after_lifecycle_change';
    actualResultClass = 'inconclusive';
  } else if (input.sourceChanged === true || input.sourceMatches === false || replaySourceState === 'replay_source_inconsistent') {
    replayClassification = 'replay_after_source_change';
    replayReason = input.sourceMatches === false ? 'replay_source_mismatch' : 'replay_after_source_change';
    actualResultClass = 'inconclusive';
  } else if (input.policyChanged === true || replayPolicyVersionLabel === 'policy_version_changed' || replayPolicyVersionLabel === 'policy_version_unknown') {
    replayClassification = 'replay_after_policy_change';
    replayReason = input.policyChanged === true ? 'replay_policy_mismatch' : 'replay_after_policy_change';
    actualResultClass = 'inconclusive';
  } else if (input.payloadMatches === false) {
    replayClassification = 'replay_ambiguity';
    replayReason = 'replay_payload_mismatch';
    actualResultClass = 'inconclusive';
  } else if (input.idempotentRetry === true) {
    replayClassification = 'idempotent_retry';
    replayReason = input.payloadMatches === true ? 'replay_payload_match' : 'idempotent_retry';
  } else if (input.operationSeenBefore === true) {
    replayClassification = 'replay_detected';
    replayReason = 'replay_detected';
    actualResultClass = 'inconclusive';
  } else {
    replayClassification = 'first_seen_operation';
    replayReason = normalizedReason === 'first_seen_operation' ? 'first_seen_operation' : normalizedReason;
  }

  return {
    runtimeDomainLabel: 'replay_idempotency',
    replayClassification,
    replayReason,
    replayIdempotencyRelation: relations,
    replaySourceState,
    replayLifecycleState,
    replayPolicyVersionLabel,
    replayFreshnessClass,
    replayIdentityBindingClass,
    diagnosticsModeLabel: input.diagnosticsAvailable === false ? 'diagnostics_safe_summary_missing' : 'diagnostics_available_non_authoritative',
    authorityModeLabel: 'shadow_only_observation',
    expectedResultClass,
    actualResultClass,
    executionStatus: 'executed_observation_only',
    evidenceStatus,
    validationCaseFamily: 'RPL',
  };
}

export function resolveRuntimeStagingEnvelopeSkeleton(input: {
  requestedEnvelopeEnabled?: boolean | null;
  requestedRuntimeEnabled?: boolean | null;
  requestedAuthorityEnabled?: boolean | null;
  requestedProductionRoutingEnabled?: boolean | null;
  requestedFailClosedEnabled?: boolean | null;
  requestedReplayRejectionEnabled?: boolean | null;
  requestedCacheInvalidationEnabled?: boolean | null;
  namedScopePresent?: boolean | null;
  safeActorsPresent?: boolean | null;
  safeWindowPresent?: boolean | null;
  diagnosticsAvailable?: boolean | null;
} = {}): RuntimeStagingEnvelopeSkeleton {
  const hiddenActivationRequested =
    input.requestedEnvelopeEnabled === true ||
    input.requestedRuntimeEnabled === true ||
    input.requestedAuthorityEnabled === true ||
    input.requestedProductionRoutingEnabled === true ||
    input.requestedFailClosedEnabled === true ||
    input.requestedReplayRejectionEnabled === true ||
    input.requestedCacheInvalidationEnabled === true;

  const stagingEnvelopeLabel: StagingEnvelopeLabel = hiddenActivationRequested ? 'hidden_activation_blocked' : 'disabled_by_default';
  const stagingScopeLabel: StagingScopeLabel =
    input.namedScopePresent === true
      ? input.safeActorsPresent === true
        ? input.safeWindowPresent === true
          ? 'staging_scope_not_defined'
          : 'named_safe_window_required'
        : 'named_safe_actors_required'
      : 'staging_scope_not_defined';

  return {
    runtimeDomainLabel: 'feature_gate_kill_switch',
    stagingEnvelopeLabel,
    stagingScopeLabel,
    ...VIP_ENTITLEMENT_STAGING_ENVELOPE_DISABLED_DEFAULTS,
    authorityModeLabel: 'authority_transition_not_started',
    gateStateLabel: 'gate_disabled',
    rollbackModeLabel: 'no_enforcement_baseline',
    diagnosticsModeLabel: input.diagnosticsAvailable === false ? 'diagnostics_safe_summary_missing' : 'diagnostics_available_non_authoritative',
    expectedResultClass: 'diagnostics_non_authoritative_observation',
    actualResultClass: 'passed_for_observation_only',
    executionStatus: 'executed_observation_only',
    evidenceStatus: 'collected_safe_summary',
    validationCaseFamily: 'GATE',
  };
}
