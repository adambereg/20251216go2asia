import type { RfMerchantVoucherActivitySummaryResponse } from '@go2asia/sdk/rf';

export const merchantVoucherActivityBoundaryCopy =
  'Это только операционная сводка по RF-ваучерам. Экономические правила будут оформляться отдельно.';

export type MerchantVoucherActivityViewState =
  | 'loading_partners'
  | 'no_active_partner'
  | 'loading_summary'
  | 'error'
  | 'empty'
  | 'ready';

export function resolveMerchantVoucherActivityViewState(input: {
  partnersLoading: boolean;
  activePartnersCount: number;
  summaryLoading: boolean;
  summaryError: boolean;
  summary: RfMerchantVoucherActivitySummaryResponse | null | undefined;
}): MerchantVoucherActivityViewState {
  if (input.partnersLoading) return 'loading_partners';
  if (input.activePartnersCount === 0) return 'no_active_partner';
  if (input.summaryLoading) return 'loading_summary';
  if (input.summaryError) return 'error';
  if (!input.summary || input.summary.summary.total === 0) return 'empty';
  return 'ready';
}

export function formatMerchantVoucherActivityDate(value: string | null): string {
  if (!value) return 'ещё нет активности';
  return new Date(value).toLocaleString('ru-RU');
}
