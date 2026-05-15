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
