import { describe, expect, it } from 'vitest';

import { decideExternalIdIdempotency } from '../src/idempotency';

describe('points-service idempotency (external_id / externalId)', () => {
  it('returns proceed when externalId does not exist', () => {
    const d = decideExternalIdIdempotency(null, { amount: 100, action: 'referral_bonus_referrer' });
    expect(d).toEqual({ kind: 'proceed' });
  });

  it('returns duplicate when externalId exists with same payload', () => {
    const d = decideExternalIdIdempotency(
      { transactionId: 'tx_1', amount: 100, action: 'referral_bonus_referrer' },
      { amount: 100, action: 'referral_bonus_referrer' }
    );
    expect(d).toEqual({ kind: 'duplicate', transactionId: 'tx_1' });
  });

  it('returns conflict when externalId exists with different payload', () => {
    const d = decideExternalIdIdempotency(
      { transactionId: 'tx_1', amount: 100, action: 'referral_bonus_referrer' },
      { amount: 200, action: 'referral_bonus_referrer' }
    );
    expect(d).toEqual({ kind: 'conflict' });
  });
});



