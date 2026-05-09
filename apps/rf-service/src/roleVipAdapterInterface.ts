// Experimental Slice 6.13 adapter interface skeleton only.
// This module is intentionally not wired into RF preview routes or claim runtime.

import {
  ROLE_VIP_OBSERVABILITY_BUCKETS,
  ROLE_VIP_PREVIEW_STATES,
  normalizeRoleDecision,
  type RoleVipBackendRoleSnapshot,
  type RoleVipDegradedMode,
  type RoleVipFixture,
  type RoleVipFixtureExpectation,
  type RoleVipNormalizationResult,
  type RoleVipNormalizedDecision,
  type RoleVipNormalizedReason,
  type RoleVipObservabilityBucket,
  type RoleVipObservabilityExpectation,
  type RoleVipPreviewExpectation,
  type RoleVipPreviewState,
  type RoleVipPrincipalInput,
  type RoleVipSource,
  type RoleVipTrustSource,
} from './roleVipAdapterContracts';

export type RoleVipAdapterSource = RoleVipSource;
export type RoleVipAdapterHealth = 'healthy' | 'degraded' | 'unavailable' | 'timeout' | 'fixture_only';
export type RoleVipAdapterError = 'none' | 'source_unavailable' | 'source_timeout' | 'malformed_source' | 'drift_detected' | 'unknown_role';

export type RoleVipAdapterContext = {
  requestId: string;
  evaluationMode: 'claim_preview';
  requestedAt?: string;
  trustSource?: RoleVipTrustSource;
};

export type RoleVipAdapterInput = {
  source: RoleVipAdapterSource;
  principal: RoleVipPrincipalInput;
  backendSnapshot?: RoleVipBackendRoleSnapshot;
  context: RoleVipAdapterContext;
  timeout?: boolean;
  sourceUnavailable?: boolean;
};

export type RoleVipAdapterOutput = {
  source: RoleVipAdapterSource;
  health: RoleVipAdapterHealth;
  error: RoleVipAdapterError;
  decision: RoleVipNormalizedDecision;
  reasonCode: RoleVipNormalizedReason;
  degradedMode: RoleVipDegradedMode;
  normalization: RoleVipNormalizationResult;
  preview: RoleVipPreviewExpectation;
  observability: RoleVipObservabilityExpectation;
  safePublicPayload: RoleVipPreviewExpectation & {
    source: RoleVipAdapterSource;
  };
};

export type RoleVipAdapterExecutionResult = {
  input: RoleVipAdapterInput;
  output: RoleVipAdapterOutput;
  informationalOnly: true;
  claimBehaviorUnchanged: true;
};

export type RoleVipAdapter = {
  id: string;
  execute(input: RoleVipAdapterInput): Promise<RoleVipAdapterExecutionResult> | RoleVipAdapterExecutionResult;
};

export type RoleVipAdapterFixtureReplayResult = {
  fixtureId: string;
  adapterId: string;
  execution: RoleVipAdapterExecutionResult;
  matchesFixture: boolean;
  differences: string[];
};

export function toRoleVipPreviewExpectation(result: RoleVipNormalizationResult): RoleVipPreviewExpectation {
  if (result.reasonCode === 'ordinary_resource_no_gate' || result.decision === 'not_applicable') {
    return { state: 'ordinary_no_preview', informationalOnly: true, claimBehaviorUnchanged: true };
  }
  if (result.decision === 'granted' && result.degradedMode === 'none' && !result.stale) {
    return { state: 'available', informationalOnly: true, claimBehaviorUnchanged: true };
  }
  if (result.reasonCode === 'insufficient_status' || result.reasonCode === 'requirement_missing') {
    return { state: 'requires_condition', informationalOnly: true, claimBehaviorUnchanged: true };
  }
  if (
    result.decision === 'pending' ||
    result.degradedMode === 'timeout_fallback' ||
    result.degradedMode === 'stale_cache' ||
    result.degradedMode === 'partial_sources' ||
    result.degradedMode === 'source_unavailable' ||
    result.reasonCode === 'source_timeout' ||
    result.reasonCode === 'source_unavailable' ||
    result.reasonCode === 'temporarily_unavailable'
  ) {
    return { state: 'checking_or_temporarily_unavailable', informationalOnly: true, claimBehaviorUnchanged: true };
  }
  return { state: 'unavailable', informationalOnly: true, claimBehaviorUnchanged: true };
}

export function toRoleVipObservabilityExpectation(result: RoleVipNormalizationResult, preview: RoleVipPreviewExpectation): RoleVipObservabilityExpectation {
  return {
    bucket: preview.state,
    degradedMode: result.degradedMode,
    isTemporary: preview.state === 'checking_or_temporarily_unavailable',
  };
}

function toAdapterHealth(input: RoleVipAdapterInput, result: RoleVipNormalizationResult): RoleVipAdapterHealth {
  if (input.timeout) return 'timeout';
  if (input.sourceUnavailable || result.reasonCode === 'source_unavailable') return 'unavailable';
  if (result.degradedMode !== 'none') return 'degraded';
  return 'fixture_only';
}

function toAdapterError(input: RoleVipAdapterInput, result: RoleVipNormalizationResult): RoleVipAdapterError {
  if (input.timeout) return 'source_timeout';
  if (input.sourceUnavailable || result.reasonCode === 'source_unavailable') return 'source_unavailable';
  if (result.driftScenario !== 'none') return result.driftScenario === 'malformed_backend' ? 'malformed_source' : 'drift_detected';
  if (result.reasonCode === 'unknown_source') return 'unknown_role';
  return 'none';
}

export function executeRoleVipAdapterContract(input: RoleVipAdapterInput): RoleVipAdapterExecutionResult {
  const normalization = normalizeRoleDecision({
    source: input.source,
    principal: input.principal,
    backendSnapshot: input.backendSnapshot,
    trustSource: input.context.trustSource,
    sourceUnavailable: input.sourceUnavailable,
    timeout: input.timeout,
  });
  const preview = toRoleVipPreviewExpectation(normalization);
  const observability = toRoleVipObservabilityExpectation(normalization, preview);
  const output: RoleVipAdapterOutput = {
    source: input.source,
    health: toAdapterHealth(input, normalization),
    error: toAdapterError(input, normalization),
    decision: normalization.decision,
    reasonCode: normalization.reasonCode,
    degradedMode: normalization.degradedMode,
    normalization,
    preview,
    observability,
    safePublicPayload: {
      source: input.source,
      ...preview,
    },
  };

  return {
    input,
    output,
    informationalOnly: true,
    claimBehaviorUnchanged: true,
  };
}

export function createFixtureBackedRoleVipAdapter(id = 'fixture-backed-role-vip-adapter'): RoleVipAdapter {
  return {
    id,
    execute: executeRoleVipAdapterContract,
  };
}

export function toRoleVipAdapterInputFromFixture(fixture: RoleVipFixture): RoleVipAdapterInput {
  return {
    source: fixture.source,
    principal: fixture.principal,
    backendSnapshot: fixture.backendSnapshot,
    timeout: fixture.group === 'timeout',
    sourceUnavailable: fixture.group === 'source_unavailable',
    context: {
      requestId: `role-vip-fixture:${fixture.id}`,
      evaluationMode: 'claim_preview',
      trustSource: fixture.backendSnapshot ? 'hybrid_comparison' : 'gateway_principal',
    },
  };
}

export function compareRoleVipAdapterOutputToFixture(output: RoleVipAdapterOutput, expectation: RoleVipFixtureExpectation): string[] {
  const differences: string[] = [];
  if (output.decision !== expectation.decision) differences.push(`decision:${output.decision}->${expectation.decision}`);
  if (output.reasonCode !== expectation.reasonCode) differences.push(`reasonCode:${output.reasonCode}->${expectation.reasonCode}`);
  if (output.degradedMode !== expectation.degradedMode) differences.push(`degradedMode:${output.degradedMode}->${expectation.degradedMode}`);
  if (output.normalization.driftScenario !== expectation.driftScenario) differences.push(`driftScenario:${output.normalization.driftScenario}->${expectation.driftScenario}`);
  if (output.preview.state !== expectation.preview.state) differences.push(`preview:${output.preview.state}->${expectation.preview.state}`);
  if (output.observability.bucket !== expectation.observability.bucket) differences.push(`bucket:${output.observability.bucket}->${expectation.observability.bucket}`);
  if (output.observability.degradedMode !== expectation.observability.degradedMode) {
    differences.push(`observabilityDegraded:${output.observability.degradedMode}->${expectation.observability.degradedMode}`);
  }
  return differences;
}

export async function runRoleVipFixtureThroughAdapter(adapter: RoleVipAdapter, fixture: RoleVipFixture): Promise<RoleVipAdapterFixtureReplayResult> {
  const execution = await adapter.execute(toRoleVipAdapterInputFromFixture(fixture));
  const differences = compareRoleVipAdapterOutputToFixture(execution.output, fixture.expectation);
  return {
    fixtureId: fixture.id,
    adapterId: adapter.id,
    execution,
    matchesFixture: differences.length === 0,
    differences,
  };
}

export function assertRoleVipAdapterOutputCompatibility(output: RoleVipAdapterOutput): boolean {
  return (
    ROLE_VIP_PREVIEW_STATES.includes(output.preview.state as RoleVipPreviewState) &&
    ROLE_VIP_OBSERVABILITY_BUCKETS.includes(output.observability.bucket as RoleVipObservabilityBucket) &&
    output.safePublicPayload.informationalOnly === true &&
    output.safePublicPayload.claimBehaviorUnchanged === true
  );
}

