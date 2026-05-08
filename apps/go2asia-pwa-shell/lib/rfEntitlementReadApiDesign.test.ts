import { describe, expect, it } from 'vitest';
import {
  getSafeEntitlementMessage,
  isEntitlementDecisionUsable,
  isEntitlementResultStale,
  normalizeAdapterResult,
  shouldAllowSoftVisibility,
  type EntitlementAdapterEvaluationResult,
  type EntitlementReadResponse,
} from './rfEntitlementReadApiDesign';

function response(overrides: Partial<EntitlementReadResponse>): EntitlementReadResponse {
  return {
    requestId: 'req_1',
    requestWindowId: 'window_1',
    decision: 'denied',
    reasonCode: 'requirement_missing',
    evaluationMode: 'strict',
    evaluatedSources: [],
    missingRequirements: [],
    warnings: [],
    stale: false,
    cacheHit: false,
    degradedMode: 'none',
    evaluatedAt: '2026-05-08T00:00:00.000Z',
    ...overrides,
  };
}

function adapterResult(overrides: Partial<EntitlementAdapterEvaluationResult>): EntitlementAdapterEvaluationResult {
  return {
    adapterId: 'role-adapter',
    source: 'role',
    rawFacts: [],
    decisionHint: 'granted',
    reasonCodeHint: 'entitlement_granted',
    evaluatedAt: '2026-05-08T00:00:00.000Z',
    ...overrides,
  };
}

describe('RF entitlement read API design helpers', () => {
  it('treats only non-degraded granted decisions as usable for hard flows', () => {
    expect(isEntitlementDecisionUsable(response({ decision: 'granted' }))).toBe(true);
    expect(isEntitlementDecisionUsable(response({ decision: 'granted', degradedMode: 'stale_cache' }))).toBe(false);
    expect(isEntitlementDecisionUsable(response({ decision: 'pending', degradedMode: 'none' }))).toBe(false);
  });

  it('allows soft visibility for granted or recoverable pending results only', () => {
    expect(shouldAllowSoftVisibility(response({ evaluationMode: 'soft_visibility', decision: 'granted' }))).toBe(true);
    expect(
      shouldAllowSoftVisibility(response({ evaluationMode: 'soft_visibility', decision: 'pending', degradedMode: 'timeout_fallback' })),
    ).toBe(true);
    expect(shouldAllowSoftVisibility(response({ evaluationMode: 'soft_visibility', decision: 'denied' }))).toBe(false);
    expect(shouldAllowSoftVisibility(response({ evaluationMode: 'claim_enforcement', decision: 'pending', degradedMode: 'stale_cache' }))).toBe(false);
  });

  it('detects stale read results separately from the final decision', () => {
    expect(isEntitlementResultStale(response({ stale: true }))).toBe(true);
    expect(isEntitlementResultStale(response({ degradedMode: 'stale_cache' }))).toBe(true);
    expect(isEntitlementResultStale(response({ decision: 'granted' }))).toBe(false);
  });

  it('maps read results to safe non-technical messages', () => {
    expect(getSafeEntitlementMessage(response({ decision: 'granted' }))).toBe('Доступ открыт');
    expect(getSafeEntitlementMessage(response({ decision: 'pending' }))).toBe('Проверка выполняется');
    expect(getSafeEntitlementMessage(response({ degradedMode: 'source_unavailable', reasonCode: 'source_unavailable' }))).toBe(
      'Доступ временно ограничен',
    );
    expect(getSafeEntitlementMessage(response({ reasonCode: 'invite_required' }))).toBe('Требуется условие');
    expect(getSafeEntitlementMessage(response({ reasonCode: 'policy_not_configured' }))).toBe('Премиум-доступ недоступен');
  });

  it('normalizes adapter output without exposing raw source facts', () => {
    const normalized = normalizeAdapterResult(
      adapterResult({
        rawFacts: [{ source: 'role', factKey: 'role', value: 'vip_spacer', observedAt: '2026-05-08T00:00:00.000Z' }],
        cacheHit: true,
      }),
    );

    expect(normalized).toMatchObject({
      source: 'role',
      adapterId: 'role-adapter',
      decision: 'granted',
      reasonCode: 'entitlement_granted',
      rawFactsOmitted: true,
      cacheHit: true,
      degradedMode: 'none',
    });
    expect('rawFacts' in normalized).toBe(false);
  });

  it('normalizes degraded adapter health to degraded modes', () => {
    expect(normalizeAdapterResult(adapterResult({ stale: true }), 'healthy').degradedMode).toBe('stale_cache');
    expect(normalizeAdapterResult(adapterResult({ decisionHint: 'pending', reasonCodeHint: 'source_timeout' }), 'timeout').degradedMode).toBe(
      'timeout_fallback',
    );
    expect(normalizeAdapterResult(adapterResult({ decisionHint: 'unknown', reasonCodeHint: 'source_unavailable' }), 'unavailable').degradedMode).toBe(
      'source_unavailable',
    );
  });
});

