import type { RfVoucherDto } from '@go2asia/sdk/rf';
import type { RfRepeatPolicy } from '@go2asia/sdk/rf';

export type RfVoucherEffectiveStatus = NonNullable<RfVoucherDto['canonicalStatus']>;

export function getRfVoucherEffectiveStatus(voucher: Pick<RfVoucherDto, 'status' | 'canonicalStatus'>): RfVoucherEffectiveStatus {
  if (voucher.canonicalStatus) return voucher.canonicalStatus;
  if (voucher.status === 'redeemed') return 'redeemed';
  if (voucher.status === 'cancelled') return 'cancelled';
  return 'available';
}

export function isRfVoucherClaimBarrier(
  voucher: Pick<RfVoucherDto, 'status' | 'canonicalStatus'>,
  repeatPolicy: RfRepeatPolicy = 'once_per_scope'
): boolean {
  const status = getRfVoucherEffectiveStatus(voucher);
  if (status === 'available' || status === 'locked' || status === 'unlocked') return true;
  return status === 'redeemed' && repeatPolicy === 'once_per_scope';
}

export function getRfVoucherStatusLabel(voucher: Pick<RfVoucherDto, 'status' | 'canonicalStatus'>): string {
  const status = getRfVoucherEffectiveStatus(voucher);
  if (status === 'redeemed') return 'Использован';
  if (status === 'cancelled') return 'Отменён';
  if (status === 'expired') return 'Истёк';
  if (status === 'locked') return 'Заблокирован';
  return 'Получен';
}

export function getRfVoucherStatusBadgeClass(voucher: Pick<RfVoucherDto, 'status' | 'canonicalStatus'>): string {
  const status = getRfVoucherEffectiveStatus(voucher);
  if (status === 'redeemed') return 'bg-slate-100 text-slate-700 ring-1 ring-slate-200';
  if (status === 'cancelled') return 'bg-red-100 text-red-800 ring-1 ring-red-200';
  if (status === 'expired') return 'bg-amber-100 text-amber-900 ring-1 ring-amber-200';
  if (status === 'locked') return 'bg-violet-100 text-violet-900 ring-1 ring-violet-200';
  return 'bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200';
}
