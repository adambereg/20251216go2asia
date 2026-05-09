import { describe, expect, it } from 'vitest';
import {
  assertNoFinancialVocabularyInEntitlementCopy,
  getSafeEntitlementLabel,
  isEntitlementGranted,
  isEntitlementPending,
  type EntitlementCheckResult,
} from './rfPremiumEntitlementDesign';

function result(overrides: Partial<EntitlementCheckResult>): EntitlementCheckResult {
  return {
    decision: 'denied',
    reasonCode: 'requirement_missing',
    sourcesEvaluated: [],
    grantedSources: [],
    ...overrides,
  };
}

describe('RF premium entitlement design contracts', () => {
  it('classifies granted and pending decisions without evaluating sources', () => {
    expect(isEntitlementGranted(result({ decision: 'granted', reasonCode: 'entitlement_granted' }))).toBe(true);
    expect(isEntitlementGranted(result({ decision: 'denied' }))).toBe(false);
    expect(isEntitlementPending(result({ decision: 'pending' }))).toBe(true);
    expect(isEntitlementPending(result({ decision: 'unknown' }))).toBe(true);
    expect(isEntitlementPending(result({ decision: 'not_applicable', reasonCode: 'ordinary_resource_no_gate' }))).toBe(false);
  });

  it('maps decisions to user-safe non-financial labels', () => {
    const labels = [
      getSafeEntitlementLabel(result({ decision: 'granted', reasonCode: 'entitlement_granted' })),
      getSafeEntitlementLabel(result({ reasonCode: 'invite_required' })),
      getSafeEntitlementLabel(result({ reasonCode: 'nft_required' })),
      getSafeEntitlementLabel(result({ reasonCode: 'milestone_required' })),
      getSafeEntitlementLabel(result({ decision: 'pending', reasonCode: 'source_timeout' })),
      getSafeEntitlementLabel(result({ decision: 'not_applicable', reasonCode: 'ordinary_resource_no_gate' })),
    ];

    expect(labels).toEqual([
      'Доступ открыт',
      'Требуется приглашение',
      'Нужно выполнить условие доступа',
      'Нужно выполнить условие',
      'Проверка доступа временно недоступна',
      'Обычный доступ',
    ]);
    expect(assertNoFinancialVocabularyInEntitlementCopy(labels.join(' '))).toBe(true);
  });

  it('keeps unsafe infrastructure and financial vocabulary out of safe copy', () => {
    expect(assertNoFinancialVocabularyInEntitlementCopy('Доступ открыт. Нужно выполнить условие.')).toBe(true);
    expect(assertNoFinancialVocabularyInEntitlementCopy('Show wallet balance before access')).toBe(false);
    expect(assertNoFinancialVocabularyInEntitlementCopy('Use tx hash and chain state')).toBe(false);
    expect(assertNoFinancialVocabularyInEntitlementCopy('Pending payout compensation recovery')).toBe(false);
  });
});
