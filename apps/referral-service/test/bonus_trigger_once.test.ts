import { describe, expect, it } from 'vitest';

import { buildReferrerFirstLoginBonusPointsInput } from '../src/bonus';

describe('referral-service bonus trigger (one-time applied via points externalId)', () => {
  it('uses a stable externalId so points can dedupe and apply only once', async () => {
    const seen = new Set<string>();

    const mockPointsAdd = async (input: { externalId: string }) => {
      const applied = !seen.has(input.externalId);
      seen.add(input.externalId);
      return { ok: true as const, applied };
    };

    const input1 = buildReferrerFirstLoginBonusPointsInput({
      referrerId: 'u_referrer',
      refereeId: 'u_referee',
      bonus: 100,
    });
    const r1 = await mockPointsAdd({ externalId: input1.externalId });

    const input2 = buildReferrerFirstLoginBonusPointsInput({
      referrerId: 'u_referrer',
      refereeId: 'u_referee',
      bonus: 100,
    });
    const r2 = await mockPointsAdd({ externalId: input2.externalId });

    expect(input2.externalId).toEqual(input1.externalId);
    expect(r1.applied).toBe(true);
    expect(r2.applied).toBe(false);
    expect(seen.size).toBe(1);
  });
});

