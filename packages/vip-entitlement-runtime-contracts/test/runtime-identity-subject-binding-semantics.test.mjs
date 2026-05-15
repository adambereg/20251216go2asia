import assert from 'node:assert/strict';
import test from 'node:test';

import { classifyRuntimeIdentitySubjectBinding } from '../dist/index.js';

test('classifies trusted matching subject as shadow observation only', () => {
  const result = classifyRuntimeIdentitySubjectBinding({
    trustedSubjectPresent: true,
    rfPrincipalPresent: true,
    rfPrincipalMatchesSubject: true,
    entitlementSubjectPresent: true,
    entitlementSubjectMatchesPrincipal: true,
    principalType: 'vip_spacer',
    identitySourceState: 'identity_source_current',
  });

  assert.equal(result.runtimeDomainLabel, 'identity_enforcement');
  assert.equal(result.subjectTrustClass, 'trusted_subject');
  assert.equal(result.subjectRelationClass, 'rf_principal_matches_subject');
  assert.equal(result.identitySourceClass, 'identity_source_current');
  assert.equal(result.subjectBindingLabel, 'subject_binding_present');
  assert.equal(result.principalTypeLabel, 'vip_spacer_principal');
  assert.equal(result.authorityModeLabel, 'shadow_only_observation');
  assert.equal(result.expectedResultClass, 'diagnostics_non_authoritative_observation');
  assert.equal(result.actualResultClass, 'passed_for_observation_only');
  assert.equal(result.executionStatus, 'executed_observation_only');
  assert.equal(result.validationCaseFamily, 'ID');
});

test('classifies untrusted or missing subject binding as inconclusive metadata', () => {
  const missing = classifyRuntimeIdentitySubjectBinding({
    trustedSubjectPresent: false,
    rfPrincipalPresent: true,
    principalType: 'spacer',
  });
  const untrusted = classifyRuntimeIdentitySubjectBinding({
    trustedSubjectPresent: true,
    rfPrincipalPresent: false,
    principalType: 'unknown',
  });

  assert.equal(missing.subjectTrustClass, 'subject_binding_missing');
  assert.equal(missing.subjectBindingLabel, 'subject_binding_missing');
  assert.equal(missing.actualResultClass, 'inconclusive');
  assert.equal(untrusted.subjectTrustClass, 'untrusted_subject');
  assert.equal(untrusted.identitySourceClass, 'identity_source_unknown');
  assert.equal(untrusted.actualResultClass, 'inconclusive');
});

test('classifies RF principal mismatch and cross-account ambiguity without enforcement', () => {
  const mismatch = classifyRuntimeIdentitySubjectBinding({
    trustedSubjectPresent: true,
    rfPrincipalPresent: true,
    rfPrincipalMatchesSubject: false,
    entitlementSubjectPresent: true,
    entitlementSubjectMatchesPrincipal: false,
    principalType: 'spacer',
  });
  const crossAccount = classifyRuntimeIdentitySubjectBinding({
    trustedSubjectPresent: true,
    rfPrincipalPresent: true,
    rfPrincipalMatchesSubject: true,
    entitlementSubjectPresent: true,
    entitlementSubjectMatchesPrincipal: true,
    crossAccountSignal: true,
    principalType: 'spacer',
  });

  assert.equal(mismatch.subjectRelationClass, 'rf_principal_mismatch');
  assert.equal(mismatch.subjectBindingLabel, 'subject_binding_inconsistent');
  assert.equal(mismatch.actualResultClass, 'inconclusive');
  assert.equal(crossAccount.subjectRelationClass, 'cross_account_ambiguity');
  assert.equal(crossAccount.actualResultClass, 'inconclusive');
});

test('classifies identity downgrade and unknown source states as shadow metadata', () => {
  const downgrade = classifyRuntimeIdentitySubjectBinding({
    trustedSubjectPresent: true,
    rfPrincipalPresent: true,
    rfPrincipalMatchesSubject: true,
    entitlementSubjectPresent: true,
    entitlementSubjectMatchesPrincipal: true,
    identityDowngradeSignal: true,
    principalType: 'vip_spacer',
  });
  const degraded = classifyRuntimeIdentitySubjectBinding({
    trustedSubjectPresent: true,
    rfPrincipalPresent: true,
    principalType: 'vip_spacer',
    identitySourceState: 'identity_source_degraded',
  });

  assert.equal(downgrade.subjectRelationClass, 'identity_downgrade_detected');
  assert.equal(downgrade.actualResultClass, 'inconclusive');
  assert.equal(degraded.identitySourceClass, 'identity_source_degraded');
  assert.equal(degraded.actualResultClass, 'inconclusive');
});

test('classifies unsupported identity runtime as unsupported, not pass', () => {
  const result = classifyRuntimeIdentitySubjectBinding({ identitySourceState: 'unsupported_without_runtime_change' });

  assert.equal(result.subjectTrustClass, 'unsupported_without_runtime_change');
  assert.equal(result.subjectRelationClass, 'unsupported_without_runtime_change');
  assert.equal(result.identitySourceClass, 'unsupported_without_runtime_change');
  assert.equal(result.subjectBindingLabel, 'unsupported_without_runtime_change');
  assert.equal(result.expectedResultClass, 'unsupported_until_runtime_exists');
  assert.equal(result.actualResultClass, 'unsupported_without_runtime_change');
  assert.equal(result.evidenceStatus, 'insufficient');
});
