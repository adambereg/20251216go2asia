import { describe, expect, it } from 'vitest';

import {
  assertNoUnsafeVipEntitlementShadowDiagnosticsFields,
  compareVipEntitlementShadow,
  createLocalVipEntitlementSourceReadAdapter,
  createVipEntitlementSourceReadRequest,
  getVipEntitlementShadowSnapshot,
  isVipEntitlementSourceReadEnforcementCapable,
  parseVipEntitlementSourceReadMode,
  parseVipEntitlementSourceReadScenario,
  recordVipEntitlementShadowObservation,
  resetVipEntitlementShadowForTests,
  resolveVipEntitlementShadowDecision,
  toVipEntitlementShadowDecisionFromSourceRead,
  type VipEntitlementSourceReadScenario,
  type VipEntitlementShadowScenario,
} from '../src/vipEntitlementShadow';

describe('VIP entitlement shadow decision model', () => {
  it.each([
    ['role_mirror', true, true, 'aligned_granted'],
    ['role_mirror', false, false, 'aligned_denied'],
    ['deny', true, false, 'role_granted_entitlement_denied'],
    ['grant', false, true, 'role_denied_entitlement_granted'],
    ['stale', true, false, 'stale_shadow'],
    ['degraded', true, false, 'degraded_shadow'],
    ['unknown_source', true, false, 'unknown_source'],
  ] satisfies Array<[VipEntitlementShadowScenario, boolean, boolean, string]>)(
    'compares runtime role gate to entitlement scenario %s',
    (scenario, currentRoleAllowed, expectedEntitlementAllowed, expectedDriftClass) => {
      const decision = resolveVipEntitlementShadowDecision({
        userId: 'user_1',
        currentRoleAllowed,
        scenario,
        correlationId: 'req_1',
        now: new Date('2026-05-10T10:00:00.000Z'),
      });
      const observation = compareVipEntitlementShadow({ currentRoleAllowed, decision, claimScope: 'partner' });

      expect(decision.allowed).toBe(expectedEntitlementAllowed);
      expect(observation.driftClass).toBe(expectedDriftClass);
      expect(observation.auditTraceId).toMatch(/^vip_shadow_trace_/);
    }
  );

  it('records aggregate-only safe diagnostics', () => {
    resetVipEntitlementShadowForTests();
    const decision = resolveVipEntitlementShadowDecision({
      userId: 'user_1',
      currentRoleAllowed: true,
      scenario: 'deny',
      correlationId: 'req_1',
      now: new Date('2026-05-10T10:00:00.000Z'),
    });
    const observation = compareVipEntitlementShadow({ currentRoleAllowed: true, decision, claimScope: 'listing' });

    recordVipEntitlementShadowObservation(observation);
    const snapshot = getVipEntitlementShadowSnapshot();

    expect(snapshot.total).toBe(1);
    expect(snapshot.byDriftClass.role_granted_entitlement_denied).toBe(1);
    expect(snapshot.lastObservation).toMatchObject({
      driftClass: 'role_granted_entitlement_denied',
      reasonCode: 'not_found',
      claimScope: 'listing',
    });
    expect(JSON.stringify(snapshot)).not.toContain('user_1');
    expect(() => assertNoUnsafeVipEntitlementShadowDiagnosticsFields(snapshot)).not.toThrow();
  });

  it('keeps source read mode default-off and parses only shadow_read_only', () => {
    expect(parseVipEntitlementSourceReadMode(undefined)).toBe('disabled');
    expect(parseVipEntitlementSourceReadMode('')).toBe('disabled');
    expect(parseVipEntitlementSourceReadMode('enforcement')).toBe('disabled');
    expect(parseVipEntitlementSourceReadMode('shadow_read_only')).toBe('shadow_read_only');
    expect(parseVipEntitlementSourceReadScenario('source_timeout')).toBe('source_timeout');
    expect(parseVipEntitlementSourceReadScenario('unexpected')).toBe('role_mirror');
  });

  it.each([
    ['role_mirror', true, 'migration_role_shadow', 'aligned_granted', false],
    ['grant', false, 'mock', 'role_denied_entitlement_granted', false],
    ['deny', true, 'mock', 'role_granted_entitlement_denied', false],
    ['stale', true, 'approved_cache', 'stale_entitlement', false],
    ['degraded', true, 'unknown', 'degraded_runtime', false],
    ['source_timeout', true, 'unknown', 'unavailable_entitlement', false],
    ['source_unavailable', true, 'unknown', 'unavailable_entitlement', false],
    ['unknown_source', true, 'unknown', 'unknown', false],
  ] satisfies Array<[VipEntitlementSourceReadScenario, boolean, string, string, boolean]>)(
    'maps source read scenario %s to canonical shadow evidence only',
    (scenario, currentRoleAllowed, expectedSourceType, expectedCanonicalDriftClass, expectedEnforcementCapable) => {
      const request = createVipEntitlementSourceReadRequest({
        userId: 'user_1',
        offerId: 'rf_offer_1',
        claimScope: 'partner',
        scopeRef: null,
        correlationId: 'req_1',
        diagnosticsEnabled: true,
        requestedAt: new Date('2026-05-10T10:00:00.000Z'),
      });
      const sourceRead = createLocalVipEntitlementSourceReadAdapter().read({
        request,
        currentRoleAllowed,
        scenario,
      });
      const decision = toVipEntitlementShadowDecisionFromSourceRead(sourceRead);
      const observation = compareVipEntitlementShadow({
        currentRoleAllowed,
        decision,
        claimScope: 'partner',
        sourceRead,
      });

      expect(sourceRead.sourceType).toBe(expectedSourceType);
      expect(observation.canonicalDriftClass).toBe(expectedCanonicalDriftClass);
      expect(isVipEntitlementSourceReadEnforcementCapable(sourceRead)).toBe(expectedEnforcementCapable);
      expect(sourceRead.auditTraceId).toMatch(/^vip_source_trace_/);
      if (scenario === 'stale' || scenario === 'degraded' || scenario === 'source_timeout' || scenario === 'source_unavailable' || scenario === 'unknown_source') {
        expect(sourceRead.allowed).toBe(false);
      }
    }
  );

  it('records source read evidence as aggregate-only diagnostics', () => {
    resetVipEntitlementShadowForTests();
    const request = createVipEntitlementSourceReadRequest({
      userId: 'user_1',
      offerId: 'rf_offer_1',
      claimScope: 'listing',
      scopeRef: 'listing_1',
      correlationId: 'req_1',
      diagnosticsEnabled: true,
      requestedAt: new Date('2026-05-10T10:00:00.000Z'),
    });
    const sourceRead = createLocalVipEntitlementSourceReadAdapter().read({
      request,
      currentRoleAllowed: true,
      scenario: 'source_timeout',
    });
    const observation = compareVipEntitlementShadow({
      currentRoleAllowed: true,
      decision: toVipEntitlementShadowDecisionFromSourceRead(sourceRead),
      claimScope: 'listing',
      sourceRead,
    });

    recordVipEntitlementShadowObservation(observation);
    const snapshot = getVipEntitlementShadowSnapshot();

    expect(snapshot.total).toBe(1);
    expect(snapshot.byCanonicalDriftClass.unavailable_entitlement).toBe(1);
    expect(snapshot.sourceRead.total).toBe(1);
    expect(snapshot.sourceRead.byAdapterStatus.timeout).toBe(1);
    expect(snapshot.sourceRead.auditTracePresent).toBe(1);
    expect(JSON.stringify(snapshot)).not.toMatch(/user_1|listing_1|req_1|correlation|sourceRef|metadata|payment|transaction/i);
    expect(() => assertNoUnsafeVipEntitlementShadowDiagnosticsFields(snapshot)).not.toThrow();
  });

  it.each([
    ['grant', 'fresh', 'active', true],
    ['stale', 'stale', 'stale_cache', false],
    ['degraded', 'degraded', 'source_degraded', false],
    ['source_unavailable', 'source_unavailable', 'source_unavailable', false],
    ['source_timeout', 'source_timeout', 'source_timeout', false],
    ['unknown_source', 'unknown_freshness', 'unknown_freshness', false],
  ] satisfies Array<[VipEntitlementSourceReadScenario, string, string, boolean]>)(
    'adds non-authoritative freshness metadata for source read scenario %s',
    (scenario, expectedFreshnessClassification, expectedFreshnessReason, expectedEntitlementAllowed) => {
      const request = createVipEntitlementSourceReadRequest({
        userId: 'user_1',
        offerId: 'rf_offer_1',
        claimScope: 'partner',
        scopeRef: null,
        correlationId: 'req_1',
        diagnosticsEnabled: true,
        requestedAt: new Date('2026-05-10T10:00:00.000Z'),
      });
      const sourceRead = createLocalVipEntitlementSourceReadAdapter().read({
        request,
        currentRoleAllowed: false,
        scenario,
      });
      const observation = compareVipEntitlementShadow({
        currentRoleAllowed: false,
        decision: toVipEntitlementShadowDecisionFromSourceRead(sourceRead),
        claimScope: 'partner',
        sourceRead,
      });

      expect(observation.entitlementAllowed).toBe(expectedEntitlementAllowed);
      expect(observation.sourceRead?.freshness).toMatchObject({
        runtimeDomainLabel: 'ttl_cache_freshness',
        freshnessClassification: expectedFreshnessClassification,
        freshnessReason: expectedFreshnessReason,
        authorityModeLabel: 'shadow_only_observation',
        diagnosticsModeLabel: 'diagnostics_available_non_authoritative',
        executionStatus: 'executed_observation_only',
      });
      expect(isVipEntitlementSourceReadEnforcementCapable(sourceRead)).toBe(false);
      expect(() => assertNoUnsafeVipEntitlementShadowDiagnosticsFields(observation)).not.toThrow();
    }
  );

  it.each([
    ['grant', 'source_auth_unknown', 'source_version_current', 'source_consistent'],
    ['stale', 'trusted_source', 'source_version_current', 'source_consistent'],
    ['degraded', 'source_adapter_unknown', 'source_version_unknown', 'source_degraded'],
    ['source_unavailable', 'source_adapter_unknown', 'source_version_unknown', 'source_unavailable'],
    ['source_timeout', 'source_adapter_unknown', 'source_version_unknown', 'source_timeout'],
    ['unknown_source', 'source_adapter_unknown', 'source_version_unknown', 'source_inconsistent'],
  ] satisfies Array<[VipEntitlementSourceReadScenario, string, string, string]>)(
    'adds non-authoritative source authenticity/version metadata for source read scenario %s',
    (scenario, expectedAuthenticityClass, expectedVersionClass, expectedConsistencyClass) => {
      const request = createVipEntitlementSourceReadRequest({
        userId: 'user_1',
        offerId: 'rf_offer_1',
        claimScope: 'partner',
        scopeRef: null,
        correlationId: 'req_1',
        diagnosticsEnabled: true,
        requestedAt: new Date('2026-05-10T10:00:00.000Z'),
      });
      const sourceRead = createLocalVipEntitlementSourceReadAdapter().read({
        request,
        currentRoleAllowed: false,
        scenario,
      });
      const observation = compareVipEntitlementShadow({
        currentRoleAllowed: false,
        decision: toVipEntitlementShadowDecisionFromSourceRead(sourceRead),
        claimScope: 'partner',
        sourceRead,
      });

      expect(observation.sourceRead?.sourceClassification).toMatchObject({
        runtimeDomainLabel: 'source_authenticity_version',
        sourceAuthenticityClass: expectedAuthenticityClass,
        sourceVersionClass: expectedVersionClass,
        sourceVersionLabel: expectedVersionClass,
        sourceConsistencyClass: expectedConsistencyClass,
        authorityModeLabel: 'shadow_only_observation',
        diagnosticsModeLabel: 'diagnostics_available_non_authoritative',
        executionStatus: 'executed_observation_only',
        validationCaseFamily: 'SRC',
      });
      expect(isVipEntitlementSourceReadEnforcementCapable(sourceRead)).toBe(false);
      expect(() => assertNoUnsafeVipEntitlementShadowDiagnosticsFields(observation)).not.toThrow();
    }
  );

  it.each([
    [
      'trusted_subject',
      {
        trustedSubjectPresent: true,
        principalType: 'vip_spacer',
        vipRoleSignalPresent: true,
        rfPrincipalMatchesShadowSubject: true,
        entitlementSubjectPresent: true,
        entitlementSubjectMatchesPrincipal: true,
        identitySourceState: 'identity_source_current',
      },
      'trusted_subject',
      'rf_principal_matches_subject',
      'subject_binding_present',
    ],
    [
      'missing_subject_binding',
      {
        trustedSubjectPresent: false,
        principalType: 'spacer',
        vipRoleSignalPresent: false,
        rfPrincipalMatchesShadowSubject: false,
        entitlementSubjectPresent: false,
        entitlementSubjectMatchesPrincipal: null,
        identitySourceState: 'identity_source_unknown',
      },
      'subject_binding_missing',
      'rf_principal_mismatch',
      'subject_binding_missing',
    ],
    [
      'cross_account_ambiguity',
      {
        trustedSubjectPresent: true,
        principalType: 'spacer',
        vipRoleSignalPresent: false,
        rfPrincipalMatchesShadowSubject: true,
        entitlementSubjectPresent: true,
        entitlementSubjectMatchesPrincipal: true,
        crossAccountSignal: true,
        identitySourceState: 'identity_source_current',
      },
      'trusted_subject',
      'cross_account_ambiguity',
      'subject_binding_inconsistent',
    ],
    [
      'identity_downgrade',
      {
        trustedSubjectPresent: true,
        principalType: 'vip_spacer',
        vipRoleSignalPresent: true,
        rfPrincipalMatchesShadowSubject: true,
        entitlementSubjectPresent: true,
        entitlementSubjectMatchesPrincipal: true,
        identityDowngradeSignal: true,
        identitySourceState: 'identity_source_current',
      },
      'trusted_subject',
      'identity_downgrade_detected',
      'subject_binding_unknown',
    ],
  ] as const)(
    'adds non-authoritative subject-binding metadata for %s',
    (_caseName, identityContext, expectedTrustClass, expectedRelationClass, expectedBindingLabel) => {
      const decision = resolveVipEntitlementShadowDecision({
        userId: 'user_1',
        currentRoleAllowed: identityContext.vipRoleSignalPresent,
        scenario: 'role_mirror',
        correlationId: 'req_1',
        now: new Date('2026-05-10T10:00:00.000Z'),
      });
      const observation = compareVipEntitlementShadow({
        currentRoleAllowed: identityContext.vipRoleSignalPresent,
        decision,
        claimScope: 'partner',
        identityContext,
      });

      expect(observation.subjectBinding).toMatchObject({
        runtimeDomainLabel: 'identity_enforcement',
        subjectTrustClass: expectedTrustClass,
        subjectRelationClass: expectedRelationClass,
        subjectBindingLabel: expectedBindingLabel,
        authorityModeLabel: 'shadow_only_observation',
        diagnosticsModeLabel: 'diagnostics_available_non_authoritative',
        executionStatus: 'executed_observation_only',
        validationCaseFamily: 'ID',
      });
      expect(observation.entitlementAllowed).toBe(decision.allowed);
      expect(() => assertNoUnsafeVipEntitlementShadowDiagnosticsFields(observation)).not.toThrow();
    }
  );

  it.each([
    ['first_seen_operation', undefined, 'first_seen_operation', 'passed_for_observation_only'],
    [
      'idempotent_retry',
      {
        operationSeenBefore: true,
        idempotentRetry: true,
        payloadMatches: true,
        subjectMatches: true,
        sourceMatches: true,
        lifecycleChanged: false,
        policyChanged: false,
      },
      'idempotent_retry',
      'passed_for_observation_only',
    ],
    [
      'payload_mismatch',
      {
        operationSeenBefore: true,
        payloadMatches: false,
        subjectMatches: true,
        sourceMatches: true,
      },
      'replay_ambiguity',
      'inconclusive',
    ],
    [
      'lifecycle_change',
      {
        operationSeenBefore: true,
        lifecycleChanged: true,
      },
      'replay_after_lifecycle_change',
      'inconclusive',
    ],
    [
      'source_change',
      {
        operationSeenBefore: true,
        sourceChanged: true,
      },
      'replay_after_source_change',
      'inconclusive',
    ],
    [
      'policy_change',
      {
        operationSeenBefore: true,
        policyChanged: true,
      },
      'replay_after_policy_change',
      'inconclusive',
    ],
    [
      'stale_replay',
      {
        operationSeenBefore: true,
        staleReplaySignal: true,
      },
      'stale_replay',
      'inconclusive',
    ],
  ] as const)(
    'adds non-authoritative replay/idempotency metadata for %s',
    (_caseName, replayContext, expectedReplayClassification, expectedActualResultClass) => {
      const decision = resolveVipEntitlementShadowDecision({
        userId: 'user_1',
        currentRoleAllowed: true,
        scenario: 'role_mirror',
        correlationId: 'req_1',
        now: new Date('2026-05-10T10:00:00.000Z'),
      });
      const observation = compareVipEntitlementShadow({
        currentRoleAllowed: true,
        decision,
        claimScope: 'partner',
        replayContext,
      });

      expect(observation.replaySemantics).toMatchObject({
        runtimeDomainLabel: 'replay_idempotency',
        replayClassification: expectedReplayClassification,
        authorityModeLabel: 'shadow_only_observation',
        diagnosticsModeLabel: 'diagnostics_available_non_authoritative',
        expectedResultClass: 'diagnostics_non_authoritative_observation',
        actualResultClass: expectedActualResultClass,
        executionStatus: 'executed_observation_only',
        validationCaseFamily: 'RPL',
      });
      expect(observation.runtimeAllowed).toBe(true);
      expect(observation.entitlementAllowed).toBe(decision.allowed);
      expect(() => assertNoUnsafeVipEntitlementShadowDiagnosticsFields(observation)).not.toThrow();
    }
  );

  it('adds disabled-by-default staging envelope metadata without changing shadow decisions', () => {
    const decision = resolveVipEntitlementShadowDecision({
      userId: 'user_1',
      currentRoleAllowed: true,
      scenario: 'role_mirror',
      correlationId: 'req_1',
      now: new Date('2026-05-10T10:00:00.000Z'),
    });
    const observation = compareVipEntitlementShadow({
      currentRoleAllowed: true,
      decision,
      claimScope: 'partner',
    });

    expect(observation.stagingEnvelope).toMatchObject({
      runtimeDomainLabel: 'feature_gate_kill_switch',
      stagingEnvelopeLabel: 'disabled_by_default',
      stagingScopeLabel: 'staging_scope_not_defined',
      envelopeActive: false,
      envelopeRuntimeEnabled: false,
      envelopeAuthorityEnabled: false,
      envelopeProductionRoutingEnabled: false,
      envelopeFailClosedEnabled: false,
      envelopeReplayRejectionEnabled: false,
      envelopeCacheInvalidationEnabled: false,
      authorityModeLabel: 'authority_transition_not_started',
      gateStateLabel: 'gate_disabled',
      rollbackModeLabel: 'no_enforcement_baseline',
      diagnosticsModeLabel: 'diagnostics_available_non_authoritative',
      expectedResultClass: 'diagnostics_non_authoritative_observation',
      actualResultClass: 'passed_for_observation_only',
      executionStatus: 'executed_observation_only',
      validationCaseFamily: 'GATE',
    });
    expect(observation.runtimeAllowed).toBe(true);
    expect(observation.entitlementAllowed).toBe(decision.allowed);
    expect(() => assertNoUnsafeVipEntitlementShadowDiagnosticsFields(observation)).not.toThrow();
  });

  it('keeps staging envelope inert even when activation-like fields are requested', () => {
    const decision = resolveVipEntitlementShadowDecision({
      userId: 'user_1',
      currentRoleAllowed: false,
      scenario: 'grant',
      correlationId: 'req_1',
      now: new Date('2026-05-10T10:00:00.000Z'),
    });
    const observation = compareVipEntitlementShadow({
      currentRoleAllowed: false,
      decision,
      claimScope: 'partner',
      stagingEnvelopeContext: {
        requestedEnvelopeEnabled: true,
        requestedRuntimeEnabled: true,
        requestedAuthorityEnabled: true,
        requestedProductionRoutingEnabled: true,
        requestedFailClosedEnabled: true,
        requestedReplayRejectionEnabled: true,
        requestedCacheInvalidationEnabled: true,
        namedScopePresent: true,
        safeActorsPresent: true,
        safeWindowPresent: true,
      },
    });

    expect(observation.stagingEnvelope).toMatchObject({
      stagingEnvelopeLabel: 'hidden_activation_blocked',
      gateStateLabel: 'gate_disabled',
      envelopeActive: false,
      envelopeRuntimeEnabled: false,
      envelopeAuthorityEnabled: false,
      envelopeProductionRoutingEnabled: false,
      envelopeFailClosedEnabled: false,
      envelopeReplayRejectionEnabled: false,
      envelopeCacheInvalidationEnabled: false,
    });
    expect(observation.driftClass).toBe('role_denied_entitlement_granted');
    expect(observation.runtimeAllowed).toBe(false);
    expect(observation.entitlementAllowed).toBe(true);
    expect(() => assertNoUnsafeVipEntitlementShadowDiagnosticsFields(observation)).not.toThrow();
  });

  it.each([
    ['source_unavailable', 'source_unavailable_candidate'],
    ['source_timeout', 'source_timeout_candidate'],
  ] satisfies Array<[VipEntitlementSourceReadScenario, string]>)(
    'adds disabled source availability guard metadata for %s',
    (scenario, expectedCandidateClass) => {
      const request = createVipEntitlementSourceReadRequest({
        userId: 'user_1',
        offerId: 'rf_offer_1',
        claimScope: 'partner',
        scopeRef: null,
        correlationId: 'req_1',
        diagnosticsEnabled: true,
        requestedAt: new Date('2026-05-10T10:00:00.000Z'),
      });
      const sourceRead = createLocalVipEntitlementSourceReadAdapter().read({
        request,
        currentRoleAllowed: true,
        scenario,
      });
      const observation = compareVipEntitlementShadow({
        currentRoleAllowed: true,
        decision: toVipEntitlementShadowDecisionFromSourceRead(sourceRead),
        claimScope: 'partner',
        sourceRead,
      });

      expect(observation.sourceAvailabilityGuard).toMatchObject({
        runtimeDomainLabel: 'source_authenticity_version',
        sourceAvailabilityGuardStatus: 'candidate_observed_disabled',
        sourceAvailabilityCandidateClass: expectedCandidateClass,
        sourceAvailabilityGuardEnabled: false,
        sourceAvailabilityFailClosedEnabled: false,
        sourceAvailabilityProductionRoutingEnabled: false,
        sourceAvailabilityAuthorityEnabled: false,
        sourceAvailabilityReplayRejectionEnabled: false,
        sourceAvailabilityInvalidationEnabled: false,
        authorityModeLabel: 'authority_transition_not_started',
        gateStateLabel: 'gate_disabled',
        rollbackModeLabel: 'no_enforcement_baseline',
        diagnosticsModeLabel: 'diagnostics_available_non_authoritative',
        expectedResultClass: 'diagnostics_non_authoritative_observation',
        actualResultClass: 'passed_for_observation_only',
        executionStatus: 'executed_observation_only',
        validationCaseFamily: 'SRC',
      });
      expect(observation.stagingEnvelope.envelopeActive).toBe(false);
      expect(observation.runtimeAllowed).toBe(true);
      expect(observation.entitlementAllowed).toBe(false);
      expect(() => assertNoUnsafeVipEntitlementShadowDiagnosticsFields(observation)).not.toThrow();
    }
  );

  it('keeps source availability guard hidden activation as metadata only', () => {
    const decision = resolveVipEntitlementShadowDecision({
      userId: 'user_1',
      currentRoleAllowed: false,
      scenario: 'grant',
      correlationId: 'req_1',
      now: new Date('2026-05-10T10:00:00.000Z'),
    });
    const observation = compareVipEntitlementShadow({
      currentRoleAllowed: false,
      decision,
      claimScope: 'partner',
      sourceAvailabilityGuardContext: {
        requestedGuardEnabled: true,
        requestedFailClosedEnabled: true,
        requestedProductionRoutingEnabled: true,
        requestedAuthorityEnabled: true,
        requestedReplayRejectionEnabled: true,
        requestedInvalidationEnabled: true,
      },
    });

    expect(observation.sourceAvailabilityGuard).toMatchObject({
      sourceAvailabilityGuardStatus: 'hidden_activation_blocked',
      sourceAvailabilityCandidateClass: 'source_availability_candidate_not_observed',
      sourceAvailabilityGuardEnabled: false,
      sourceAvailabilityFailClosedEnabled: false,
      sourceAvailabilityProductionRoutingEnabled: false,
      sourceAvailabilityAuthorityEnabled: false,
      sourceAvailabilityReplayRejectionEnabled: false,
      sourceAvailabilityInvalidationEnabled: false,
      gateStateLabel: 'gate_disabled',
    });
    expect(observation.driftClass).toBe('role_denied_entitlement_granted');
    expect(observation.runtimeAllowed).toBe(false);
    expect(observation.entitlementAllowed).toBe(true);
    expect(() => assertNoUnsafeVipEntitlementShadowDiagnosticsFields(observation)).not.toThrow();
  });

  it.each([
    ['idempotent_retry_observed', 'idempotent_retry', true, 'observed_from_rf_idempotency'],
    ['context_mismatch_observed', 'replay_after_source_change', true, 'observed_from_rf_idempotency'],
    ['repeat_policy_barrier_observed', 'replay_detected', true, 'observed_from_repeat_policy'],
    ['replay_context_not_observed', 'first_seen_operation', false, 'not_observed'],
  ] as const)(
    'maps safe replay outcome bucket %s to non-authoritative replay semantics',
    (replayOutcomeBucket, expectedReplayClassification, expectedObserved, expectedConfidence) => {
      const decision = resolveVipEntitlementShadowDecision({
        userId: 'user_1',
        currentRoleAllowed: true,
        scenario: 'role_mirror',
        correlationId: 'req_1',
        now: new Date('2026-05-10T10:00:00.000Z'),
      });
      const observation = compareVipEntitlementShadow({
        currentRoleAllowed: true,
        decision,
        claimScope: 'partner',
        replayOutcomeContext: {
          replayOutcomeBucket,
        },
      });

      expect(observation.replayOutcome).toMatchObject({
        replayOutcomeBucket,
        replayContextObserved: expectedObserved,
        replayConfidence: expectedConfidence,
        replayGovernanceGradeStatus: 'rf_idempotency_partial_not_governance_grade',
      });
      expect(observation.replaySemantics).toMatchObject({
        replayClassification: expectedReplayClassification,
        authorityModeLabel: 'shadow_only_observation',
        executionStatus: 'executed_observation_only',
        validationCaseFamily: 'RPL',
      });
      expect(observation.runtimeAllowed).toBe(true);
      expect(observation.entitlementAllowed).toBe(decision.allowed);
      expect(() => assertNoUnsafeVipEntitlementShadowDiagnosticsFields(observation)).not.toThrow();
    }
  );

  it('adds fail-closed input summary as non-authoritative shadow correlation only', () => {
    const request = createVipEntitlementSourceReadRequest({
      userId: 'user_1',
      offerId: 'rf_offer_1',
      claimScope: 'partner',
      scopeRef: null,
      correlationId: 'req_1',
      diagnosticsEnabled: true,
      requestedAt: new Date('2026-05-10T10:00:00.000Z'),
    });
    const sourceRead = createLocalVipEntitlementSourceReadAdapter().read({
      request,
      currentRoleAllowed: true,
      scenario: 'source_timeout',
    });
    const observation = compareVipEntitlementShadow({
      currentRoleAllowed: true,
      decision: toVipEntitlementShadowDecisionFromSourceRead(sourceRead),
      claimScope: 'partner',
      sourceRead,
      replayOutcomeContext: {
        replayOutcomeBucket: 'idempotent_retry_observed',
      },
    });

    expect(observation.failClosedInputSummary).toMatchObject({
      failClosedCandidateInputStatus: 'candidate_inputs_observed_partial',
      failClosedInputCompleteness: 'partial_shadow_inputs_only',
      failClosedInputAuthorityStatus: 'shadow_only_not_authoritative',
      failClosedDiagnosticsIndependenceStatus: 'diagnostics_non_authoritative_not_runtime_input',
      failClosedCandidateReadiness: 'not_ready_shadow_summary_only',
      freshnessInputStatus: 'freshness_inconclusive',
      sourceInputStatus: 'source_inconclusive',
      identityInputStatus: 'identity_inconclusive',
      replayInputStatus: 'replay_outcome_observed',
      stagingEnvelopeStatus: 'disabled_not_activated',
      diagnosticsInputStatus: 'diagnostics_available_non_authoritative',
    });
    expect(observation.stagingEnvelope.envelopeActive).toBe(false);
    expect(observation.runtimeAllowed).toBe(true);
    expect(() => assertNoUnsafeVipEntitlementShadowDiagnosticsFields(observation)).not.toThrow();
  });

  it.each([
    [
      'identity_downgrade',
      {
        trustedSubjectPresent: true,
        principalType: 'vip_spacer',
        vipRoleSignalPresent: true,
        rfPrincipalMatchesShadowSubject: true,
        entitlementSubjectPresent: true,
        entitlementSubjectMatchesPrincipal: true,
        identityDowngradeSignal: true,
        identitySourceState: 'identity_source_current',
      },
      'replay_after_identity_downgrade',
    ],
    [
      'cross_subject_replay_ambiguity',
      {
        trustedSubjectPresent: true,
        principalType: 'spacer',
        vipRoleSignalPresent: false,
        rfPrincipalMatchesShadowSubject: true,
        entitlementSubjectPresent: true,
        entitlementSubjectMatchesPrincipal: true,
        crossAccountSignal: true,
        identitySourceState: 'identity_source_current',
      },
      'cross_subject_replay_ambiguity',
    ],
  ] as const)(
    'links replay metadata to subject-binding shadow signal for %s',
    (_caseName, identityContext, expectedReplayClassification) => {
      const decision = resolveVipEntitlementShadowDecision({
        userId: 'user_1',
        currentRoleAllowed: identityContext.vipRoleSignalPresent,
        scenario: 'role_mirror',
        correlationId: 'req_1',
        now: new Date('2026-05-10T10:00:00.000Z'),
      });
      const observation = compareVipEntitlementShadow({
        currentRoleAllowed: identityContext.vipRoleSignalPresent,
        decision,
        claimScope: 'partner',
        identityContext,
        replayContext: {
          operationSeenBefore: true,
          payloadMatches: true,
        },
      });

      expect(observation.replaySemantics).toMatchObject({
        runtimeDomainLabel: 'replay_idempotency',
        replayClassification: expectedReplayClassification,
        actualResultClass: 'inconclusive',
        authorityModeLabel: 'shadow_only_observation',
        validationCaseFamily: 'RPL',
      });
      expect(observation.entitlementAllowed).toBe(decision.allowed);
      expect(() => assertNoUnsafeVipEntitlementShadowDiagnosticsFields(observation)).not.toThrow();
    }
  );
});
