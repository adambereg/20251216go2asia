import assert from 'node:assert/strict';
import test from 'node:test';

import {
  resolveRuntimeSourceAvailabilityStagingValidationHarness,
  SOURCE_AVAILABILITY_STAGING_VALIDATION_CASE_IDS,
  SOURCE_AVAILABILITY_STAGING_VALIDATION_FIXTURE_ALIASES,
  VIP_ENTITLEMENT_SOURCE_AVAILABILITY_STAGING_VALIDATION_HARNESS_DISABLED_DEFAULTS,
} from '../dist/index.js';

const unsafeEvidencePattern = /user_|idempotency|requestid|request_id|correlation|payment|transaction|payload|x-gateway-auth|secret/i;

test('resolves disabled staging validation harness without execution', () => {
  const result = resolveRuntimeSourceAvailabilityStagingValidationHarness();

  assert.equal(result.runtimeDomainLabel, 'staging_validation_evidence');
  assert.equal(result.harnessStatus, 'harness_disabled');
  assert.equal(result.caseRegistryStatus, 'planned_cases_registered');
  assert.equal(result.fixtureRegistryStatus, 'fixtures_defined_not_executed');
  assert.equal(result.evidenceSchemaStatus, 'evidence_schema_defined_not_collected');
  assert.deepEqual(
    {
      harnessEnabled: result.harnessEnabled,
      validationExecutionEnabled: result.validationExecutionEnabled,
      fixtureExecutionEnabled: result.fixtureExecutionEnabled,
      runtimeCallEnabled: result.runtimeCallEnabled,
      failClosedEnabled: result.failClosedEnabled,
      stagingEnvelopeActivationEnabled: result.stagingEnvelopeActivationEnabled,
      authoritySwitchEnabled: result.authoritySwitchEnabled,
      productionRoutingEnabled: result.productionRoutingEnabled,
      actualEvidenceCollectionEnabled: result.actualEvidenceCollectionEnabled,
    },
    VIP_ENTITLEMENT_SOURCE_AVAILABILITY_STAGING_VALIDATION_HARNESS_DISABLED_DEFAULTS
  );
  assert.equal(result.validationExecutionStatus, 'not_executed');
  assert.equal(result.fixtureExecutionStatus, 'not_executed');
  assert.equal(result.executionStatus, 'not_executed');
  assert.equal(result.evidenceStatus, 'planned_not_collected');
  assert.equal(result.gateStateLabel, 'gate_disabled');
  assert.equal(result.authorityModeLabel, 'authority_transition_not_started');
});

test('registers planned cases and safe fixture aliases without executing fixtures', () => {
  const result = resolveRuntimeSourceAvailabilityStagingValidationHarness();
  const caseIds = result.cases.map((item) => item.caseId);

  assert.deepEqual(caseIds, [...SOURCE_AVAILABILITY_STAGING_VALIDATION_CASE_IDS]);
  assert.ok(result.cases.length >= 7);
  for (const fixtureAlias of result.cases.flatMap((item) => item.fixtureAliases)) {
    assert.ok(SOURCE_AVAILABILITY_STAGING_VALIDATION_FIXTURE_ALIASES.includes(fixtureAlias));
  }
  for (const item of result.cases) {
    assert.equal(item.fixtureExecutionStatus, 'not_executed');
    assert.equal(item.executionStatus, 'not_executed');
    assert.equal(item.evidenceStatus, 'planned_not_collected');
  }
});

test('keeps expected and actual evidence fields as planned placeholders', () => {
  const result = resolveRuntimeSourceAvailabilityStagingValidationHarness();

  for (const item of result.cases) {
    assert.notEqual(item.expectedGuardStatus, 'planned_placeholder_not_evidence');
    assert.equal(item.actualGuardStatus, 'planned_placeholder_not_evidence');
    assert.equal(item.expectedEnvelopeStatus, 'disabled_not_activated');
    assert.equal(item.actualEnvelopeStatus, 'planned_placeholder_not_evidence');
    assert.equal(item.expectedRuntimeBehavior, 'unchanged');
    assert.equal(item.actualRuntimeBehavior, 'planned_placeholder_not_evidence');
    assert.equal(item.expectedSideEffectCount, 'zero_new_runtime_side_effects');
    assert.equal(item.actualSideEffectCount, 'planned_placeholder_not_evidence');
    assert.equal(item.resultClass, 'not_executed');
  }
});

test('blocks requested execution and still keeps all activation flags disabled', () => {
  const result = resolveRuntimeSourceAvailabilityStagingValidationHarness({
    requestedValidationExecution: true,
    requestedFixtureExecution: true,
    requestedRuntimeCall: true,
    requestedFailClosedEnabled: true,
    requestedStagingEnvelopeActivation: true,
    requestedAuthoritySwitch: true,
    requestedProductionRouting: true,
    requestedActualEvidenceCollection: true,
  });

  assert.equal(result.harnessStatus, 'execution_blocked_until_authorized');
  assert.equal(result.harnessEnabled, false);
  assert.equal(result.validationExecutionEnabled, false);
  assert.equal(result.fixtureExecutionEnabled, false);
  assert.equal(result.runtimeCallEnabled, false);
  assert.equal(result.failClosedEnabled, false);
  assert.equal(result.stagingEnvelopeActivationEnabled, false);
  assert.equal(result.authoritySwitchEnabled, false);
  assert.equal(result.productionRoutingEnabled, false);
  assert.equal(result.actualEvidenceCollectionEnabled, false);
  assert.equal(result.executionStatus, 'not_executed');
});

test('uses privacy-safe aliases and no unsafe raw evidence fields', () => {
  const result = resolveRuntimeSourceAvailabilityStagingValidationHarness();
  const serialized = JSON.stringify(result);

  assert.doesNotMatch(serialized, unsafeEvidencePattern);
  assert.ok(serialized.includes('safe_actor_vip_spacer_1'));
  assert.ok(serialized.includes('safe_paid_offer_1'));
  assert.ok(serialized.includes('planned_placeholder_not_evidence'));
});

test('diagnostics availability changes only diagnostics label', () => {
  const result = resolveRuntimeSourceAvailabilityStagingValidationHarness({
    diagnosticsAvailable: false,
  });

  assert.equal(result.diagnosticsModeLabel, 'diagnostics_safe_summary_missing');
  assert.equal(result.harnessStatus, 'harness_disabled');
  assert.equal(result.validationExecutionEnabled, false);
  assert.equal(result.evidenceStatus, 'planned_not_collected');
});
