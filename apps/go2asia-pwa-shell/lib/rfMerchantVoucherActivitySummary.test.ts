import { describe, expect, it } from 'vitest';
import {
  formatMerchantVoucherActivityDate,
  merchantVoucherActivityBoundaryCopy,
  resolveMerchantVoucherActivityViewState,
} from './rfMerchantVoucherActivitySummary';

describe('rfMerchantVoucherActivitySummary helpers', () => {
  it('resolves loading and partner selection states', () => {
    expect(
      resolveMerchantVoucherActivityViewState({
        partnersLoading: true,
        activePartnersCount: 0,
        summaryLoading: false,
        summaryError: false,
        summary: null,
      })
    ).toBe('loading_partners');

    expect(
      resolveMerchantVoucherActivityViewState({
        partnersLoading: false,
        activePartnersCount: 0,
        summaryLoading: false,
        summaryError: false,
        summary: null,
      })
    ).toBe('no_active_partner');
  });

  it('resolves summary loading, error, empty and ready states', () => {
    expect(
      resolveMerchantVoucherActivityViewState({
        partnersLoading: false,
        activePartnersCount: 1,
        summaryLoading: true,
        summaryError: false,
        summary: null,
      })
    ).toBe('loading_summary');

    expect(
      resolveMerchantVoucherActivityViewState({
        partnersLoading: false,
        activePartnersCount: 1,
        summaryLoading: false,
        summaryError: true,
        summary: null,
      })
    ).toBe('error');

    expect(
      resolveMerchantVoucherActivityViewState({
        partnersLoading: false,
        activePartnersCount: 1,
        summaryLoading: false,
        summaryError: false,
        summary: {
          partnerId: 'partner_1',
          scope: 'partner_voucher_activity_summary',
          generatedAt: '2026-05-10T00:00:00.000Z',
          summary: {
            total: 0,
            active: 0,
            redeemed: 0,
            expiredOrUnavailable: 0,
            offersWithActivity: 0,
            proAttributed: 0,
            lastActivityAt: null,
          },
        },
      })
    ).toBe('empty');

    expect(
      resolveMerchantVoucherActivityViewState({
        partnersLoading: false,
        activePartnersCount: 1,
        summaryLoading: false,
        summaryError: false,
        summary: {
          partnerId: 'partner_1',
          scope: 'partner_voucher_activity_summary',
          generatedAt: '2026-05-10T00:00:00.000Z',
          summary: {
            total: 3,
            active: 1,
            redeemed: 1,
            expiredOrUnavailable: 1,
            offersWithActivity: 2,
            proAttributed: 1,
            lastActivityAt: '2026-05-10T00:00:00.000Z',
          },
        },
      })
    ).toBe('ready');
  });

  it('formats activity date and keeps copy non-financial', () => {
    expect(formatMerchantVoucherActivityDate(null)).toBe('ещё нет активности');
    expect(formatMerchantVoucherActivityDate('2026-05-10T00:00:00.000Z')).toContain('2026');

    const copy = merchantVoucherActivityBoundaryCopy.toLowerCase();
    expect(copy).not.toMatch(/payout|commission|settlement|balance|выплат|комисси|взаиморасчет|баланс/i);
  });
});
