import { describe, expect, it } from 'vitest';
import { getRfOfferClaimButtonLabel, getRfOfferSpendSemantics, getRfVoucherSpendSemantics } from './rfSpendSemantics';

describe('RF spend semantics helpers', () => {
  it('classifies offer spend states without changing runtime behavior', () => {
    expect(getRfOfferSpendSemantics({ pointsCost: undefined })).toMatchObject({
      kind: 'free',
      label: 'Бесплатный ваучер',
    });
    expect(getRfOfferSpendSemantics({ pointsCost: 0 })).toMatchObject({
      kind: 'economy_enabled_free',
      label: 'Points не требуются',
    });
    expect(getRfOfferSpendSemantics({ pointsCost: 500 })).toMatchObject({
      kind: 'paid_spend_required',
      pointsCost: 500,
      label: 'Требуются internal Points: 500 Points',
    });
  });

  it('keeps paid CTA visible only when points cost is positive', () => {
    expect(getRfOfferClaimButtonLabel({ pointsCost: 500 })).toBe('Получить ваучер (списание 500 Points)');
    expect(getRfOfferClaimButtonLabel({ pointsCost: 0 })).toBe('Получить ваучер');
    expect(getRfOfferClaimButtonLabel({ pointsCost: undefined })).toBe('Получить ваучер');
  });

  it('classifies voucher snapshots by actual points cost snapshot', () => {
    expect(getRfVoucherSpendSemantics({ pointsCostSnapshot: undefined, economyStatus: undefined })).toMatchObject({
      kind: 'free',
    });
    expect(getRfVoucherSpendSemantics({ pointsCostSnapshot: 0, economyStatus: 'not_required' })).toMatchObject({
      kind: 'economy_enabled_free',
      label: 'Points не требовались',
    });
    expect(getRfVoucherSpendSemantics({ pointsCostSnapshot: 500, economyStatus: 'pending' })).toMatchObject({
      kind: 'paid_spend_required',
      label: 'Требуются internal Points: 500 Points',
    });
    expect(getRfVoucherSpendSemantics({ pointsCostSnapshot: 500, economyStatus: 'debited' })).toMatchObject({
      kind: 'paid_spend_required',
      label: 'Points списаны в RF runtime: 500 Points',
    });
  });

  it('does not introduce finance wording', () => {
    const copy = [
      getRfOfferSpendSemantics({ pointsCost: 500 }).label,
      getRfOfferSpendSemantics({ pointsCost: 500 }).caption,
      getRfOfferClaimButtonLabel({ pointsCost: 500 }),
      getRfVoucherSpendSemantics({ pointsCostSnapshot: 500, economyStatus: 'debited' }).label,
    ]
      .join(' ')
      .toLowerCase();
    expect(copy).not.toMatch(/purchase|payment|payout|earnings|cash|купить|оплатить|выплат|доход/);
  });
});

