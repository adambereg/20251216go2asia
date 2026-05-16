import assert from 'node:assert/strict';
import test from 'node:test';

import { classifyRuntimeFreshness } from '../dist/index.js';

test('classifies fresh source metadata as shadow observation only', () => {
  const result = classifyRuntimeFreshness({
    sourceFresh: true,
    sourceAgeMs: 0,
    stale: false,
    degraded: false,
    reason: 'active',
    diagnosticsAvailable: true,
  });

  assert.equal(result.freshnessClassification, 'fresh');
  assert.equal(result.freshnessAgeBucket, 'fresh');
  assert.equal(result.authorityModeLabel, 'shadow_only_observation');
  assert.equal(result.expectedResultClass, 'diagnostics_non_authoritative_observation');
  assert.equal(result.actualResultClass, 'passed_for_observation_only');
  assert.equal(result.executionStatus, 'executed_observation_only');
});

test('classifies stale cache without creating an allow or deny decision', () => {
  const result = classifyRuntimeFreshness({
    sourceFresh: false,
    sourceAgeMs: 300_000,
    stale: true,
    degraded: false,
    reason: 'stale_cache',
  });

  assert.equal(result.freshnessClassification, 'stale');
  assert.equal(result.freshnessReason, 'stale_cache');
  assert.equal(result.actualResultClass, 'passed_for_observation_only');
});

test('classifies degraded and source failure cases as inconclusive shadow metadata', () => {
  for (const [adapterStatus, reason, expected] of [
    ['degraded', 'source_degraded', 'degraded'],
    ['unavailable', 'source_unavailable', 'source_unavailable'],
    ['timeout', 'source_timeout', 'source_timeout'],
    ['ok', 'source_inconsistent', 'source_inconsistent'],
  ]) {
    const result = classifyRuntimeFreshness({
      sourceFresh: false,
      sourceAgeMs: null,
      adapterStatus,
      degraded: adapterStatus === 'degraded',
      reason,
    });

    assert.equal(result.freshnessClassification, expected);
    assert.equal(result.actualResultClass, 'inconclusive');
    assert.equal(result.executionStatus, 'executed_observation_only');
  }
});

test('classifies unknown freshness and cache read failure without passing unsupported behavior', () => {
  const unknown = classifyRuntimeFreshness({ sourceFresh: false, sourceAgeMs: null, reason: 'unknown_freshness' });
  const cacheFailure = classifyRuntimeFreshness({ sourceFresh: false, sourceAgeMs: null, reason: 'cache_read_failure' });

  assert.equal(unknown.freshnessClassification, 'unknown_freshness');
  assert.equal(unknown.actualResultClass, 'inconclusive');
  assert.equal(cacheFailure.freshnessClassification, 'cache_read_failure');
  assert.equal(cacheFailure.actualResultClass, 'inconclusive');
});

test('classifies policy version mismatch as inconclusive, not approved', () => {
  const result = classifyRuntimeFreshness({
    sourceFresh: true,
    sourceAgeMs: 0,
    policyVersionLabel: 'policy_version_changed',
    reason: 'policy_version_mismatch',
  });

  assert.equal(result.freshnessClassification, 'policy_version_mismatch');
  assert.equal(result.freshnessReason, 'policy_version_mismatch');
  assert.equal(result.actualResultClass, 'inconclusive');
});

test('classifies unsupported runtime freshness as unsupported, not pass', () => {
  const result = classifyRuntimeFreshness({ reason: 'unsupported_without_runtime_change' });

  assert.equal(result.freshnessClassification, 'unsupported_without_runtime_change');
  assert.equal(result.actualResultClass, 'unsupported_without_runtime_change');
  assert.equal(result.expectedResultClass, 'unsupported_until_runtime_exists');
  assert.equal(result.evidenceStatus, 'insufficient');
});
