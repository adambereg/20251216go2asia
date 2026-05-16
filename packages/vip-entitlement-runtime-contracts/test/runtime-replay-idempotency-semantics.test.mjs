import assert from 'node:assert/strict';
import test from 'node:test';

import { classifyRuntimeReplayIdempotency } from '../dist/index.js';

test('classifies first-seen operation as shadow observation only', () => {
  const result = classifyRuntimeReplayIdempotency({
    operationSeenBefore: false,
    idempotentRetry: false,
    payloadMatches: null,
    subjectMatches: null,
    sourceMatches: null,
  });

  assert.equal(result.runtimeDomainLabel, 'replay_idempotency');
  assert.equal(result.replayClassification, 'first_seen_operation');
  assert.equal(result.replayReason, 'first_seen_operation');
  assert.deepEqual(result.replayIdempotencyRelation, ['not_applicable']);
  assert.equal(result.authorityModeLabel, 'shadow_only_observation');
  assert.equal(result.expectedResultClass, 'diagnostics_non_authoritative_observation');
  assert.equal(result.actualResultClass, 'passed_for_observation_only');
  assert.equal(result.executionStatus, 'executed_observation_only');
  assert.equal(result.validationCaseFamily, 'RPL');
});

test('classifies idempotent retry with matching payload as non-authoritative metadata', () => {
  const result = classifyRuntimeReplayIdempotency({
    operationSeenBefore: true,
    idempotentRetry: true,
    payloadMatches: true,
    subjectMatches: true,
    sourceMatches: true,
    lifecycleChanged: false,
    policyChanged: false,
    identityDowngradeSignal: false,
    identityBindingLabel: 'subject_binding_present',
  });

  assert.equal(result.replayClassification, 'idempotent_retry');
  assert.equal(result.replayReason, 'replay_payload_match');
  assert.ok(result.replayIdempotencyRelation.includes('replay_payload_match'));
  assert.ok(result.replayIdempotencyRelation.includes('replay_subject_match'));
  assert.ok(result.replayIdempotencyRelation.includes('replay_source_match'));
  assert.ok(result.replayIdempotencyRelation.includes('replay_identity_match'));
  assert.equal(result.actualResultClass, 'passed_for_observation_only');
});

test('classifies payload mismatch as replay ambiguity without allow-deny semantics', () => {
  const result = classifyRuntimeReplayIdempotency({
    operationSeenBefore: true,
    idempotentRetry: false,
    payloadMatches: false,
    subjectMatches: true,
    sourceMatches: true,
  });

  assert.equal(result.replayClassification, 'replay_ambiguity');
  assert.equal(result.replayReason, 'replay_payload_mismatch');
  assert.ok(result.replayIdempotencyRelation.includes('replay_payload_mismatch'));
  assert.equal(result.expectedResultClass, 'diagnostics_non_authoritative_observation');
  assert.equal(result.actualResultClass, 'inconclusive');
});

test('classifies replay after lifecycle source and policy changes as inconclusive shadow metadata', () => {
  const lifecycle = classifyRuntimeReplayIdempotency({
    operationSeenBefore: true,
    lifecycleChanged: true,
    lifecycleStateLabel: 'revoked',
  });
  const source = classifyRuntimeReplayIdempotency({
    operationSeenBefore: true,
    sourceChanged: true,
    replaySourceState: 'replay_source_inconsistent',
  });
  const policy = classifyRuntimeReplayIdempotency({
    operationSeenBefore: true,
    policyChanged: true,
    policyVersionLabel: 'policy_version_changed',
  });

  assert.equal(lifecycle.replayClassification, 'replay_after_lifecycle_change');
  assert.equal(source.replayClassification, 'replay_after_source_change');
  assert.equal(policy.replayClassification, 'replay_after_policy_change');
  assert.equal(lifecycle.actualResultClass, 'inconclusive');
  assert.equal(source.actualResultClass, 'inconclusive');
  assert.equal(policy.actualResultClass, 'inconclusive');
});

test('classifies stale replay identity downgrade and cross-subject ambiguity', () => {
  const stale = classifyRuntimeReplayIdempotency({
    operationSeenBefore: true,
    staleReplaySignal: true,
    freshnessClassification: 'stale',
  });
  const downgrade = classifyRuntimeReplayIdempotency({
    operationSeenBefore: true,
    identityDowngradeSignal: true,
  });
  const crossSubject = classifyRuntimeReplayIdempotency({
    operationSeenBefore: true,
    subjectMatches: false,
  });

  assert.equal(stale.replayClassification, 'stale_replay');
  assert.equal(downgrade.replayClassification, 'replay_after_identity_downgrade');
  assert.equal(crossSubject.replayClassification, 'cross_subject_replay_ambiguity');
  assert.equal(stale.actualResultClass, 'inconclusive');
  assert.equal(downgrade.actualResultClass, 'inconclusive');
  assert.equal(crossSubject.actualResultClass, 'inconclusive');
});

test('classifies unsupported replay runtime as unsupported, not pass', () => {
  const result = classifyRuntimeReplayIdempotency({
    unsupportedRuntime: true,
    operationSeenBefore: true,
  });

  assert.equal(result.replayClassification, 'unsupported_without_runtime_change');
  assert.equal(result.replayReason, 'unsupported_without_runtime_change');
  assert.equal(result.expectedResultClass, 'unsupported_until_runtime_exists');
  assert.equal(result.actualResultClass, 'unsupported_without_runtime_change');
  assert.equal(result.evidenceStatus, 'insufficient');
  assert.ok(result.replayIdempotencyRelation.includes('unsupported_without_runtime_change'));
});
