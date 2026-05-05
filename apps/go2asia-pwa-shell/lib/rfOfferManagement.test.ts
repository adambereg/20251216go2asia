import { describe, expect, it } from 'vitest';
import type { RfOfferDto } from '@go2asia/sdk/rf';
import { upsertOffer } from './rfOfferManagement';

function offer(overrides: Partial<RfOfferDto> = {}): RfOfferDto {
  return {
    id: 'offer_1',
    partnerId: 'partner_1',
    title: 'Draft breakfast offer',
    offerType: 'discount',
    visibility: 'public',
    status: 'draft',
    createdByUserId: 'user_1',
    createdAt: '2026-05-05T00:00:00.000Z',
    updatedAt: '2026-05-05T00:00:00.000Z',
    ...overrides,
  };
}

describe('rf offer management helpers', () => {
  it('adds a newly created offer to the visible list', () => {
    const created = offer({ id: 'offer_new', title: 'New live offer' });

    expect(upsertOffer([offer()], created).map((item) => item.id)).toEqual(['offer_new', 'offer_1']);
  });

  it('replaces an activated offer without duplicating it', () => {
    const draft = offer();
    const activated = offer({ status: 'active', updatedAt: '2026-05-05T01:00:00.000Z' });

    expect(upsertOffer([draft], activated)).toEqual([activated]);
  });
});
