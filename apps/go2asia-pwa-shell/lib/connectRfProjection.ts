import type { RfVoucherDto } from '@go2asia/sdk/rf';

export type RfVoucherEffectiveStatus = NonNullable<RfVoucherDto['canonicalStatus']>;

export interface RfVoucherTimelineItem {
  id: string;
  voucherId: string;
  type: 'claimed' | 'redeemed' | 'status_updated';
  title: string;
  description: string;
  occurredAt: string;
}

const ACTIVE_CANONICAL_STATUSES = new Set<RfVoucherDto['canonicalStatus']>(['available', 'locked', 'unlocked']);

export function getRfVoucherEffectiveStatus(voucher: RfVoucherDto): RfVoucherEffectiveStatus {
  if (voucher.canonicalStatus) return voucher.canonicalStatus;
  if (voucher.status === 'redeemed') return 'redeemed';
  if (voucher.status === 'cancelled') return 'cancelled';
  return 'available';
}

export function isActiveRfVoucher(voucher: RfVoucherDto): boolean {
  return ACTIVE_CANONICAL_STATUSES.has(getRfVoucherEffectiveStatus(voucher));
}

export function isUsedRfVoucher(voucher: RfVoucherDto): boolean {
  return getRfVoucherEffectiveStatus(voucher) === 'redeemed';
}

export function isCancelledRfVoucher(voucher: RfVoucherDto): boolean {
  return getRfVoucherEffectiveStatus(voucher) === 'cancelled';
}

export function formatRfVoucherLabel(voucher: RfVoucherDto): string {
  return voucher.offer?.title || 'RF-ваучер';
}

export function formatRfVoucherPartnerName(voucher: RfVoucherDto): string {
  return voucher.partner?.displayName || 'Партнёр RF';
}

export function getRfVoucherListingSourceLabel(voucher: RfVoucherDto): string | null {
  if (!voucher.listingContext) return null;
  return voucher.listingContext.listingTitle
    ? `Источник: объект Rielt — ${voucher.listingContext.listingTitle}`
    : `Источник: объект Rielt ${voucher.listingContext.listingId}`;
}

function sortByDateDesc(left: RfVoucherDto, right: RfVoucherDto): number {
  const leftDate = new Date(left.statusChangedAt ?? left.redeemedAt ?? left.claimedAt).getTime();
  const rightDate = new Date(right.statusChangedAt ?? right.redeemedAt ?? right.claimedAt).getTime();
  return rightDate - leftDate;
}

export function selectRfVoucherProjection(vouchers: RfVoucherDto[], limit = 3) {
  const split = splitRfVouchersByProjectionStatus(vouchers);

  return {
    active: split.active.slice(0, limit),
    used: split.used.slice(0, limit),
  };
}

export function splitRfVouchersByProjectionStatus(vouchers: RfVoucherDto[]) {
  const active: RfVoucherDto[] = [];
  const used: RfVoucherDto[] = [];
  const cancelled: RfVoucherDto[] = [];
  const other: RfVoucherDto[] = [];

  for (const voucher of vouchers) {
    const status = getRfVoucherEffectiveStatus(voucher);
    if (ACTIVE_CANONICAL_STATUSES.has(status)) active.push(voucher);
    else if (status === 'redeemed') used.push(voucher);
    else if (status === 'cancelled') cancelled.push(voucher);
    else other.push(voucher);
  }

  return {
    active: active.sort(sortByDateDesc),
    used: used.sort(sortByDateDesc),
    cancelled: cancelled.sort(sortByDateDesc),
    other: other.sort(sortByDateDesc),
  };
}

function toTimestamp(value: string): number {
  return new Date(value).getTime();
}

export function buildRfVoucherTimelineItems(vouchers: RfVoucherDto[], limit = 5): RfVoucherTimelineItem[] {
  const items: RfVoucherTimelineItem[] = [];

  for (const voucher of vouchers) {
    const label = formatRfVoucherLabel(voucher);
    const partner = formatRfVoucherPartnerName(voucher);

    if (voucher.claimedAt) {
      items.push({
        id: `${voucher.id}:claimed:${voucher.claimedAt}`,
        voucherId: voucher.id,
        type: 'claimed',
        title: 'Ваучер получен',
        description: `${label} · ${partner}`,
        occurredAt: voucher.claimedAt,
      });
    }

    if (voucher.redeemedAt) {
      items.push({
        id: `${voucher.id}:redeemed:${voucher.redeemedAt}`,
        voucherId: voucher.id,
        type: 'redeemed',
        title: 'Ваучер использован',
        description: `${label} · ${partner}`,
        occurredAt: voucher.redeemedAt,
      });
    }

    if (voucher.statusChangedAt && voucher.statusChangedAt !== voucher.claimedAt && voucher.statusChangedAt !== voucher.redeemedAt) {
      items.push({
        id: `${voucher.id}:status:${voucher.statusChangedAt}`,
        voucherId: voucher.id,
        type: 'status_updated',
        title: 'Статус обновлён',
        description: `${label} · ${partner}`,
        occurredAt: voucher.statusChangedAt,
      });
    }
  }

  return items
    .sort((left, right) => toTimestamp(right.occurredAt) - toTimestamp(left.occurredAt))
    .slice(0, limit);
}
