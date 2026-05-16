import assert from 'node:assert/strict';
import test from 'node:test';

import { classifyRuntimeSourceAuthenticityVersion } from '../dist/index.js';

test('classifies trusted current source as shadow observation only', () => {
  const result = classifyRuntimeSourceAuthenticityVersion({
    sourceType: 'canonical_entitlement_store',
    decisionSource: 'canonical_entitlement',
    adapterStatus: 'ok',
    adapterVersion: 'rf-slice2-shadow-read-v1',
    expectedAdapterVersion: 'rf-slice2-shadow-read-v1',
    decisionVersion: 1,
    expectedDecisionVersion: 1,
  });

  assert.equal(result.runtimeDomainLabel, 'source_authenticity_version');
  assert.equal(result.sourceAuthenticityClass, 'trusted_source');
  assert.equal(result.sourceVersionClass, 'source_version_current');
  assert.equal(result.sourceConsistencyClass, 'source_consistent');
  assert.equal(result.authorityModeLabel, 'shadow_only_observation');
  assert.equal(result.expectedResultClass, 'diagnostics_non_authoritative_observation');
  assert.equal(result.actualResultClass, 'passed_for_observation_only');
  assert.equal(result.executionStatus, 'executed_observation_only');
  assert.equal(result.validationCaseFamily, 'SRC');
});

test('classifies untrusted and invalid signature sources as inconclusive metadata', () => {
  for (const [signatureState, expected] of [
    ['untrusted', 'untrusted_source'],
    ['missing', 'source_signature_missing'],
    ['invalid', 'source_signature_invalid'],
  ]) {
    const result = classifyRuntimeSourceAuthenticityVersion({
      sourceType: 'canonical_entitlement_store',
      decisionSource: 'canonical_entitlement',
      adapterStatus: 'ok',
      adapterVersion: 'rf-slice2-shadow-read-v1',
      expectedAdapterVersion: 'rf-slice2-shadow-read-v1',
      decisionVersion: 1,
      expectedDecisionVersion: 1,
      signatureState,
    });

    assert.equal(result.sourceAuthenticityClass, expected);
    assert.equal(result.actualResultClass, 'inconclusive');
  }
});

test('classifies version mismatch, incompatible, and unknown versions without approval', () => {
  const adapterMismatch = classifyRuntimeSourceAuthenticityVersion({
    sourceType: 'canonical_entitlement_store',
    decisionSource: 'canonical_entitlement',
    adapterStatus: 'ok',
    adapterVersion: 'rf-slice2-shadow-read-v2',
    expectedAdapterVersion: 'rf-slice2-shadow-read-v1',
    decisionVersion: 1,
    expectedDecisionVersion: 1,
  });
  const decisionMismatch = classifyRuntimeSourceAuthenticityVersion({
    sourceType: 'canonical_entitlement_store',
    decisionSource: 'canonical_entitlement',
    adapterStatus: 'ok',
    adapterVersion: 'rf-slice2-shadow-read-v1',
    expectedAdapterVersion: 'rf-slice2-shadow-read-v1',
    decisionVersion: 2,
    expectedDecisionVersion: 1,
  });
  const unknown = classifyRuntimeSourceAuthenticityVersion({
    sourceType: 'canonical_entitlement_store',
    decisionSource: 'canonical_entitlement',
    adapterStatus: 'ok',
    adapterVersion: 'rf-slice2-shadow-read-v1',
    expectedAdapterVersion: 'rf-slice2-shadow-read-v1',
    decisionVersion: null,
    expectedDecisionVersion: 1,
  });

  assert.equal(adapterMismatch.sourceVersionClass, 'source_version_mismatch');
  assert.equal(adapterMismatch.actualResultClass, 'inconclusive');
  assert.equal(decisionMismatch.sourceVersionClass, 'source_version_incompatible');
  assert.equal(decisionMismatch.actualResultClass, 'inconclusive');
  assert.equal(unknown.sourceVersionClass, 'source_version_unknown');
  assert.equal(unknown.actualResultClass, 'inconclusive');
});

test('classifies malformed, inconsistent, degraded, timeout, and unavailable source states', () => {
  for (const [adapterStatus, sourceState, expected] of [
    ['ok', 'source_malformed', 'source_malformed'],
    ['unknown_source', 'source_inconsistent', 'source_inconsistent'],
    ['degraded', 'source_degraded', 'source_degraded'],
    ['timeout', 'source_timeout', 'source_timeout'],
    ['unavailable', 'source_unavailable', 'source_unavailable'],
  ]) {
    const result = classifyRuntimeSourceAuthenticityVersion({
      sourceType: adapterStatus === 'unknown_source' ? 'unknown' : 'canonical_entitlement_store',
      decisionSource: 'canonical_entitlement',
      adapterStatus,
      adapterVersion: 'rf-slice2-shadow-read-v1',
      expectedAdapterVersion: 'rf-slice2-shadow-read-v1',
      decisionVersion: 1,
      expectedDecisionVersion: 1,
      sourceState,
    });

    assert.equal(result.sourceConsistencyClass, expected);
    assert.equal(result.actualResultClass, 'inconclusive');
  }
});

test('classifies unsupported source runtime as unsupported, not pass', () => {
  const result = classifyRuntimeSourceAuthenticityVersion({ sourceState: 'unsupported_without_runtime_change' });

  assert.equal(result.sourceAuthenticityClass, 'unsupported_without_runtime_change');
  assert.equal(result.sourceVersionClass, 'unsupported_without_runtime_change');
  assert.equal(result.sourceConsistencyClass, 'unsupported_without_runtime_change');
  assert.equal(result.expectedResultClass, 'unsupported_until_runtime_exists');
  assert.equal(result.actualResultClass, 'unsupported_without_runtime_change');
  assert.equal(result.evidenceStatus, 'insufficient');
});
