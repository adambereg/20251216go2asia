import assert from 'node:assert/strict';
import test from 'node:test';

import { resolveRuntimeStagingEnvelopeSkeleton, VIP_ENTITLEMENT_STAGING_ENVELOPE_DISABLED_DEFAULTS } from '../dist/index.js';

test('resolves default staging envelope skeleton as disabled and non-authoritative', () => {
  const result = resolveRuntimeStagingEnvelopeSkeleton();

  assert.equal(result.runtimeDomainLabel, 'feature_gate_kill_switch');
  assert.equal(result.stagingEnvelopeLabel, 'disabled_by_default');
  assert.equal(result.stagingScopeLabel, 'staging_scope_not_defined');
  assert.equal(result.envelopeActive, false);
  assert.equal(result.envelopeRuntimeEnabled, false);
  assert.equal(result.envelopeAuthorityEnabled, false);
  assert.equal(result.envelopeProductionRoutingEnabled, false);
  assert.equal(result.envelopeFailClosedEnabled, false);
  assert.equal(result.envelopeReplayRejectionEnabled, false);
  assert.equal(result.envelopeCacheInvalidationEnabled, false);
  assert.deepEqual(
    {
      envelopeActive: result.envelopeActive,
      envelopeRuntimeEnabled: result.envelopeRuntimeEnabled,
      envelopeAuthorityEnabled: result.envelopeAuthorityEnabled,
      envelopeProductionRoutingEnabled: result.envelopeProductionRoutingEnabled,
      envelopeFailClosedEnabled: result.envelopeFailClosedEnabled,
      envelopeReplayRejectionEnabled: result.envelopeReplayRejectionEnabled,
      envelopeCacheInvalidationEnabled: result.envelopeCacheInvalidationEnabled,
    },
    VIP_ENTITLEMENT_STAGING_ENVELOPE_DISABLED_DEFAULTS
  );
  assert.equal(result.authorityModeLabel, 'authority_transition_not_started');
  assert.equal(result.gateStateLabel, 'gate_disabled');
  assert.equal(result.rollbackModeLabel, 'no_enforcement_baseline');
  assert.equal(result.diagnosticsModeLabel, 'diagnostics_available_non_authoritative');
  assert.equal(result.expectedResultClass, 'diagnostics_non_authoritative_observation');
  assert.equal(result.actualResultClass, 'passed_for_observation_only');
  assert.equal(result.executionStatus, 'executed_observation_only');
  assert.equal(result.validationCaseFamily, 'GATE');
});

test('blocks hidden activation requests without enabling runtime flags', () => {
  const result = resolveRuntimeStagingEnvelopeSkeleton({
    requestedEnvelopeEnabled: true,
    requestedRuntimeEnabled: true,
    requestedAuthorityEnabled: true,
    requestedProductionRoutingEnabled: true,
    requestedFailClosedEnabled: true,
    requestedReplayRejectionEnabled: true,
    requestedCacheInvalidationEnabled: true,
  });

  assert.equal(result.stagingEnvelopeLabel, 'hidden_activation_blocked');
  assert.equal(result.envelopeActive, false);
  assert.equal(result.envelopeRuntimeEnabled, false);
  assert.equal(result.envelopeAuthorityEnabled, false);
  assert.equal(result.envelopeProductionRoutingEnabled, false);
  assert.equal(result.envelopeFailClosedEnabled, false);
  assert.equal(result.envelopeReplayRejectionEnabled, false);
  assert.equal(result.envelopeCacheInvalidationEnabled, false);
  assert.equal(result.gateStateLabel, 'gate_disabled');
});

test('keeps scope labels diagnostic and does not activate staging', () => {
  const missingActors = resolveRuntimeStagingEnvelopeSkeleton({
    namedScopePresent: true,
    safeActorsPresent: false,
    safeWindowPresent: false,
  });
  const missingWindow = resolveRuntimeStagingEnvelopeSkeleton({
    namedScopePresent: true,
    safeActorsPresent: true,
    safeWindowPresent: false,
  });

  assert.equal(missingActors.stagingScopeLabel, 'named_safe_actors_required');
  assert.equal(missingWindow.stagingScopeLabel, 'named_safe_window_required');
  assert.equal(missingActors.envelopeActive, false);
  assert.equal(missingWindow.envelopeRuntimeEnabled, false);
});

test('classifies diagnostics unavailable without changing envelope state', () => {
  const result = resolveRuntimeStagingEnvelopeSkeleton({ diagnosticsAvailable: false });

  assert.equal(result.diagnosticsModeLabel, 'diagnostics_safe_summary_missing');
  assert.equal(result.envelopeActive, false);
  assert.equal(result.actualResultClass, 'passed_for_observation_only');
});
