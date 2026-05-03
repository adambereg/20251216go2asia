import { describe, expect, it } from 'vitest';

import { buildReferrerLockedPointsInput } from '../src/bonus';

describe('referral-service locked referral trigger (one-time applied via points externalId)', () => {
  it('uses a stable externalId so points can dedupe and apply only once', async () => {
    const seen = new Set<string>();

    const mockPointsAdd = async (input: { externalId: string }) => {
      const applied = !seen.has(input.externalId);
      seen.add(input.externalId);
      return { ok: true as const, applied };
    };

    const input1 = buildReferrerLockedPointsInput({
      referrerId: 'u_referrer',
      refereeId: 'u_referee',
      amount: 5000,
    });
    const r1 = await mockPointsAdd({ externalId: input1.externalId });

    const input2 = buildReferrerLockedPointsInput({
      referrerId: 'u_referrer',
      refereeId: 'u_referee',
      amount: 5000,
    });
    const r2 = await mockPointsAdd({ externalId: input2.externalId });

    expect(input1.amount).toBe(5000);
    expect(input1.action).toBe('referral_locked');
    expect(input1.externalId).toBe('referral:locked:u_referrer:u_referee');
    expect(input1.metadata).toEqual({ refereeUserId: 'u_referee', bucket: 'locked' });
    expect(input2.externalId).toEqual(input1.externalId);
    expect(input2.sourceEventId).toEqual(input1.sourceEventId);
    expect(r1.applied).toBe(true);
    expect(r2.applied).toBe(false);
    expect(seen.size).toBe(1);
  });
});



