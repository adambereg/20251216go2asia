import type { RfVoucherDto } from '@go2asia/sdk/rf';

const ACTIVE_CANONICAL_STATUSES = new Set<RfVoucherDto['canonicalStatus']>(['available', 'locked', 'unlocked']);

export function isActiveRfVoucher(voucher: RfVoucherDto): boolean {
  if (voucher.canonicalStatus) return ACTIVE_CANONICAL_STATUSES.has(voucher.canonicalStatus);
  return voucher.status === 'claimed';
}

export function isUsedRfVoucher(voucher: RfVoucherDto): boolean {
  if (voucher.canonicalStatus) return voucher.canonicalStatus === 'redeemed';
  return voucher.status === 'redeemed';
}

function sortByDateDesc(left: RfVoucherDto, right: RfVoucherDto): number {
  const leftDate = new Date(left.statusChangedAt ?? left.redeemedAt ?? left.claimedAt).getTime();
  const rightDate = new Date(right.statusChangedAt ?? right.redeemedAt ?? right.claimedAt).getTime();
  return rightDate - leftDate;
}

export function selectRfVoucherProjection(vouchers: RfVoucherDto[], limit = 3) {
  return {
    active: vouchers.filter(isActiveRfVoucher).sort(sortByDateDesc).slice(0, limit),
    used: vouchers.filter(isUsedRfVoucher).sort(sortByDateDesc).slice(0, limit),
  };
}
