import type { RfVoucherDto } from '@go2asia/sdk/rf';
import type { RfRepeatPolicy } from '@go2asia/sdk/rf';

export type RfVoucherEffectiveStatus = NonNullable<RfVoucherDto['canonicalStatus']>;
export type RfVoucherStatusLabelVariant = 'rf' | 'connect_projection';

export function getRfVoucherEffectiveStatus(voucher: Pick<RfVoucherDto, 'status' | 'canonicalStatus'>): RfVoucherEffectiveStatus {
  // Source precedence is fixed for all consumers:
  // canonicalStatus from RF is authoritative; legacy status is fallback only.
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

export function getRfVoucherStatusLabel(
  voucher: Pick<RfVoucherDto, 'status' | 'canonicalStatus'>,
  variant: RfVoucherStatusLabelVariant = 'rf',
): string {
  const status = getRfVoucherEffectiveStatus(voucher);
  if (status === 'redeemed') return 'Использован';
  if (status === 'cancelled') return 'Недоступен';
  if (status === 'expired') return variant === 'connect_projection' ? 'Недоступен' : 'Истёк';
  if (status === 'locked') return variant === 'connect_projection' ? 'Ожидает активации' : 'Получен, но не активен';
  if (status === 'unlocked') return 'Можно получить снова';
  return 'Активен';
}

export function getRfVoucherStatusBadgeClass(voucher: Pick<RfVoucherDto, 'status' | 'canonicalStatus'>): string {
  const status = getRfVoucherEffectiveStatus(voucher);
  if (status === 'redeemed') return 'bg-slate-100 text-slate-700 ring-1 ring-slate-200';
  if (status === 'cancelled') return 'bg-red-100 text-red-800 ring-1 ring-red-200';
  if (status === 'expired') return 'bg-amber-100 text-amber-900 ring-1 ring-amber-200';
  if (status === 'locked') return 'bg-amber-100 text-amber-900 ring-1 ring-amber-200';
  if (status === 'unlocked') return 'bg-blue-100 text-blue-900 ring-1 ring-blue-200';
  return 'bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200';
}

export function getRfVoucherStatusCaption(voucher: Pick<RfVoucherDto, 'status' | 'canonicalStatus'>): string {
  const status = getRfVoucherEffectiveStatus(voucher);
  if (status === 'redeemed') return 'Этот ваучер уже отмечен как использованный.';
  if (status === 'cancelled' || status === 'expired') return 'Сейчас ваучер нельзя использовать.';
  if (status === 'locked') return 'Ваучер получен, но ещё не активирован.';
  if (status === 'unlocked') return 'Ваучер снова доступен по правилам оффера.';
  return 'Готов к использованию у партнёра.';
}

export function getRfVoucherRepeatabilityLabel(
  voucher: Pick<RfVoucherDto, 'repeatPolicySnapshot' | 'status' | 'canonicalStatus'>
): string | null {
  if (voucher.repeatPolicySnapshot !== 'repeat_after_redeem') return 'Разовый ваучер';
  return getRfVoucherEffectiveStatus(voucher) === 'redeemed'
    ? 'Повторяемый: можно получить снова'
    : 'Повторяемый после использования';
}

export function getRfVoucherIssueSequenceLabel(
  voucher: Pick<RfVoucherDto, 'issueSequence' | 'repeatPolicySnapshot'>
): string | null {
  if (voucher.repeatPolicySnapshot !== 'repeat_after_redeem') return null;
  if (typeof voucher.issueSequence !== 'number' || voucher.issueSequence < 2) return null;
  return `Цикл #${voucher.issueSequence}`;
}

export function getRfVoucherEconomyTypeLabel(
  voucher: Pick<RfVoucherDto, 'economyStatus' | 'pointsCostSnapshot'>
): string {
  const isPointsEnabled =
    typeof voucher.pointsCostSnapshot === 'number' ||
    voucher.economyStatus === 'pending' ||
    voucher.economyStatus === 'debited' ||
    voucher.economyStatus === 'debit_failed';
  return isPointsEnabled ? 'Тип: Points-enabled' : 'Тип: Standard voucher';
}

export function getRfVoucherAttributionLabel(voucher: Pick<RfVoucherDto, 'attribution'>): string | null {
  if (!voucher.attribution || voucher.attribution.status !== 'confirmed') return null;
  if (voucher.attribution.source === 'pro_link') return 'Получен через PRO';
  return 'Источник получения подтверждён';
}

export function getRfVoucherActivationLabel(voucher: Pick<RfVoucherDto, 'economyStatus'>): string | null {
  if (voucher.economyStatus === 'pending') return 'Points: активация ожидается';
  if (voucher.economyStatus === 'debit_failed') return 'Points: временно недоступно';
  return null;
}
