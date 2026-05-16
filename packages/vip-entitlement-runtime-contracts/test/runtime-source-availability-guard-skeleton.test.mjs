import assert from 'node:assert/strict';
import test from 'node:test';

import {
  resolveRuntimeSourceAvailabilityGuardSkeleton,
  VIP_ENTITLEMENT_SOURCE_AVAILABILITY_GUARD_DISABLED_DEFAULTS,
} from '../dist/index.js';

test('resolves source availability guard as disabled by default', () => {
  const result = resolveRuntimeSourceAvailabilityGuardSkeleton();

  assert.equal(result.runtimeDomainLabel, 'source_authenticity_version');
  assert.equal(result.sourceAvailabilityGuardStatus, 'guard_disabled');
  assert.equal(result.sourceAvailabilityCandidateClass, 'source_availability_candidate_not_observed');
  assert.deepEqual(
    {
      sourceAvailabilityGuardEnabled: result.sourceAvailabilityGuardEnabled,
      sourceAvailabilityFailClosedEnabled: result.sourceAvailabilityFailClosedEnabled,
      sourceAvailabilityProductionRoutingEnabled: result.sourceAvailabilityProductionRoutingEnabled,
      sourceAvailabilityAuthorityEnabled: result.sourceAvailabilityAuthorityEnabled,
      sourceAvailabilityReplayRejectionEnabled: result.sourceAvailabilityReplayRejectionEnabled,
      sourceAvailabilityInvalidationEnabled: result.sourceAvailabilityInvalidationEnabled,
    },
    VIP_ENTITLEMENT_SOURCE_AVAILABILITY_GUARD_DISABLED_DEFAULTS
  );
  assert.equal(result.authorityModeLabel, 'authority_transition_not_started');
  assert.equal(result.gateStateLabel, 'gate_disabled');
  assert.equal(result.rollbackModeLabel, 'no_enforcement_baseline');
  assert.equal(result.diagnosticsModeLabel, 'diagnostics_available_non_authoritative');
  assert.equal(result.validationCaseFamily, 'SRC');
});

test('observes source unavailable and timeout candidates without enabling guard', () => {
  const unavailable = resolveRuntimeSourceAvailabilityGuardSkeleton({ sourceAvailabilitySignal: 'source_unavailable' });
  const timeout = resolveRuntimeSourceAvailabilityGuardSkeleton({ sourceAvailabilitySignal: 'source_timeout' });

  assert.equal(unavailable.sourceAvailabilityGuardStatus, 'candidate_observed_disabled');
  assert.equal(unavailable.sourceAvailabilityCandidateClass, 'source_unavailable_candidate');
  assert.equal(timeout.sourceAvailabilityGuardStatus, 'candidate_observed_disabled');
  assert.equal(timeout.sourceAvailabilityCandidateClass, 'source_timeout_candidate');
  assert.equal(unavailable.sourceAvailabilityFailClosedEnabled, false);
  assert.equal(timeout.sourceAvailabilityProductionRoutingEnabled, false);
});

test('blocks hidden activation requests without enabling fail-closed state', () => {
  const result = resolveRuntimeSourceAvailabilityGuardSkeleton({
    sourceAvailabilitySignal: 'source_unavailable',
    requestedGuardEnabled: true,
    requestedFailClosedEnabled: true,
    requestedProductionRoutingEnabled: true,
    requestedAuthorityEnabled: true,
    requestedReplayRejectionEnabled: true,
    requestedInvalidationEnabled: true,
  });

  assert.equal(result.sourceAvailabilityGuardStatus, 'hidden_activation_blocked');
  assert.equal(result.sourceAvailabilityCandidateClass, 'source_unavailable_candidate');
  assert.equal(result.sourceAvailabilityGuardEnabled, false);
  assert.equal(result.sourceAvailabilityFailClosedEnabled, false);
  assert.equal(result.sourceAvailabilityProductionRoutingEnabled, false);
  assert.equal(result.sourceAvailabilityAuthorityEnabled, false);
  assert.equal(result.sourceAvailabilityReplayRejectionEnabled, false);
  assert.equal(result.sourceAvailabilityInvalidationEnabled, false);
  assert.equal(result.gateStateLabel, 'gate_disabled');
});

test('keeps out-of-scope source states diagnostic only', () => {
  const result = resolveRuntimeSourceAvailabilityGuardSkeleton({ sourceAvailabilitySignal: 'source_malformed' });

  assert.equal(result.sourceAvailabilityGuardStatus, 'candidate_not_observed');
  assert.equal(result.sourceAvailabilityCandidateClass, 'source_availability_candidate_out_of_scope');
  assert.equal(result.sourceAvailabilityGuardEnabled, false);
});

test('classifies diagnostics unavailable without changing guard state', () => {
  const result = resolveRuntimeSourceAvailabilityGuardSkeleton({
    sourceAvailabilitySignal: 'source_timeout',
    diagnosticsAvailable: false,
  });

  assert.equal(result.diagnosticsModeLabel, 'diagnostics_safe_summary_missing');
  assert.equal(result.sourceAvailabilityGuardStatus, 'candidate_observed_disabled');
  assert.equal(result.sourceAvailabilityFailClosedEnabled, false);
});
