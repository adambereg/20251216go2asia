import assert from 'node:assert/strict';
import test from 'node:test';

import {
  LIFECYCLE_STATE_LABELS,
  POLICY_VERSION_LABELS,
  STOP_CONDITION_LABELS,
  VIP_ENTITLEMENT_RUNTIME_CONTRACT_VERSION,
  classifyLifecycleState,
  classifyPolicyApplicability,
  isTerminalLifecycleState,
  isUnknownOrUnsafeLifecycleState,
  normalizeLifecycleReason,
} from '../dist/index.js';

test('lifecycle labels include target contract states and safety sentinels', () => {
  const labels = new Set(LIFECYCLE_STATE_LABELS);

  for (const label of [
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
  ]) {
    assert.equal(labels.has(label), true);
  }
});

test('terminal lifecycle states are classified as terminal and unsafe', () => {
  for (const label of ['expired', 'revoked', 'refunded', 'cancelled']) {
    assert.equal(isTerminalLifecycleState(label), true);
    assert.equal(isUnknownOrUnsafeLifecycleState(label), true);
    assert.equal(classifyLifecycleState({ lifecycleState: label }).semanticResult, 'terminal_lifecycle_unsafe');
  }
});

test('active lifecycle is classified separately and remains non-authoritative', () => {
  const result = classifyLifecycleState({ lifecycleState: 'active' });

  assert.equal(result.semanticResult, 'active_non_authoritative');
  assert.equal(result.actualResultClass, 'not_executed');
  assert.equal(result.executionStatus, 'not_executed');
});

test('unknown and unavailable source states do not become passed results', () => {
  for (const label of ['unknown', 'source_unavailable', 'source_inconsistent']) {
    const result = classifyLifecycleState({ lifecycleState: label });

    assert.notEqual(result.actualResultClass, 'passed');
    assert.notEqual(result.semanticResult, 'active_non_authoritative');
  }
});

test('unsupported runtime lifecycle semantics are not counted as passed', () => {
  const result = classifyLifecycleState({ lifecycleState: 'unsupported_without_runtime_change' });

  assert.equal(result.semanticResult, 'unsupported_without_runtime_change');
  assert.equal(result.actualResultClass, 'unsupported_without_runtime_change');
  assert.equal(result.executionStatus, 'not_executed');
});

test('policy version unknown is blocked, not approved', () => {
  assert.equal(POLICY_VERSION_LABELS.includes('policy_version_unknown'), true);
  assert.equal(
    classifyPolicyApplicability({ policyVersionLabel: 'policy_version_unknown' }),
    'blocked_missing_policy_version'
  );

  const result = classifyLifecycleState({
    lifecycleState: 'active',
    policyVersionLabel: 'policy_version_unknown',
  });

  assert.equal(result.semanticResult, 'policy_version_unknown_blocked');
  assert.equal(result.actualResultClass, 'blocked_missing_runtime_domain');
});

test('normalization maps external reason spellings into semantic labels only', () => {
  assert.equal(normalizeLifecycleReason('SOURCE-UNAVAILABLE'), 'source_unavailable');
  assert.equal(normalizeLifecycleReason('policy version unknown'), 'policy_version_unknown');
  assert.equal(normalizeLifecycleReason('not-a-known-reason'), 'unknown');
});

test('G2 keeps F3 replay/lifecycle stop condition available for future slices', () => {
  assert.equal(
    STOP_CONDITION_LABELS.includes('replay_semantics_detached_from_identity_lifecycle_source_cache_policy_or_rollback'),
    true
  );
  assert.equal(VIP_ENTITLEMENT_RUNTIME_CONTRACT_VERSION, 'vip_entitlement_runtime_contracts_v1');
});
