import type { RfVoucherDto, RfVoucherSummary } from '@go2asia/sdk/rf';
import { getRfVoucherEffectiveStatus as getRfVoucherLifecycleStatus } from './rfVoucherLifecycle';

export type RfVoucherEffectiveStatus = ReturnType<typeof getRfVoucherLifecycleStatus>;

export interface RfVoucherTimelineItem {
  id: string;
  voucherId: string;
  type: 'claimed' | 'redeemed' | 'status_updated';
  title: string;
  description: string;
  occurredAt: string;
}

export interface ConnectRfProjectionSummary {
  total: number;
  active: number;
  used: number;
  unavailable: number;
  pendingActivation: number;
  repeatableAvailable: number;
  receivedViaPro: number;
}

export interface ConnectRfProjectionRecent {
  lastClaimed: RfVoucherDto | null;
  lastRedeemed: RfVoucherDto | null;
  activity: RfVoucherTimelineItem[];
}

export interface ConnectRfProjectionMilestone {
  id: 'first_claim' | 'first_used' | 'first_pro' | 'multi_partner_used' | 'repeat_used_again';
  label: string;
  reached: boolean;
}

export interface ConnectRfProjectionNarrative {
  title: string;
  summary: string;
  bullets: string[];
}

export interface ConnectRfProjection {
  summary: ConnectRfProjectionSummary;
  groups: {
    active: RfVoucherDto[];
    used: RfVoucherDto[];
    unavailable: RfVoucherDto[];
    pendingActivation: RfVoucherDto[];
    repeatableAgain: RfVoucherDto[];
  };
  recent: ConnectRfProjectionRecent;
  milestones: ConnectRfProjectionMilestone[];
  narrative: ConnectRfProjectionNarrative;
}

const ACTIVE_CANONICAL_STATUSES = new Set<RfVoucherEffectiveStatus>(['available', 'locked', 'unlocked']);

export function getRfVoucherEffectiveStatus(voucher: RfVoucherDto): RfVoucherEffectiveStatus {
  return getRfVoucherLifecycleStatus(voucher);
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

export function getProjectionVoucherStatusLabel(voucher: Pick<RfVoucherDto, 'status' | 'canonicalStatus'>): string {
  const status = getRfVoucherLifecycleStatus(voucher);
  if (status === 'redeemed') return 'Использован';
  if (status === 'cancelled' || status === 'expired') return 'Недоступен';
  if (status === 'locked') return 'Ожидает активации';
  if (status === 'unlocked') return 'Можно получить снова';
  return 'Активен';
}

export function hasRfVouchersForConnectDashboard(
  summary: Pick<RfVoucherSummary, 'totalVouchers'> | null | undefined,
  vouchers: RfVoucherDto[],
): boolean {
  // Precedence rule for Connect dashboard:
  // RF summary is authoritative for counters and "has vouchers" checks.
  // The vouchers list is a fallback only when summary is unavailable.
  return (summary?.totalVouchers ?? vouchers.length) > 0;
}

function sortByDateDesc(left: RfVoucherDto, right: RfVoucherDto): number {
  const leftDate = new Date(left.statusChangedAt ?? left.redeemedAt ?? left.claimedAt).getTime();
  const rightDate = new Date(right.statusChangedAt ?? right.redeemedAt ?? right.claimedAt).getTime();
  return rightDate - leftDate;
}

function toTimestamp(value: string): number {
  return new Date(value).getTime();
}

function isProAttributedVoucher(voucher: RfVoucherDto): boolean {
  return voucher.attribution?.status === 'confirmed' && voucher.attribution?.source === 'pro_link';
}

function isRepeatableOpportunity(voucher: RfVoucherDto): boolean {
  if (voucher.repeatPolicySnapshot !== 'repeat_after_redeem') return false;
  const status = getRfVoucherEffectiveStatus(voucher);
  return status === 'unlocked' || status === 'available';
}

function getMostRecentVoucher(vouchers: RfVoucherDto[], dateField: 'claimedAt' | 'redeemedAt'): RfVoucherDto | null {
  return vouchers
    .filter((voucher) => Boolean(voucher[dateField]))
    .sort((left, right) => toTimestamp(String(right[dateField])) - toTimestamp(String(left[dateField])))[0] ?? null;
}

function buildNarrative(summary: ConnectRfProjectionSummary): ConnectRfProjectionNarrative {
  if (summary.total === 0) {
    return {
      title: 'RF-активность пока не началась',
      summary: 'Connect покажет здесь развитие RF-активности после первого ваучера.',
      bullets: [
        'Активные возможности',
        'Использованные преимущества',
        'История RF-активности',
        'RF помогает связывать предложения партнёров с действиями пользователя',
      ],
    };
  }

  if (summary.active > 0 && summary.used > 0) {
    return {
      title: 'Как RF отражается в Connect',
      summary: 'У вас есть и активные, и уже использованные RF-ваучеры.',
      bullets: [
        'Активные возможности',
        'Использованные преимущества',
        'RF помогает связывать предложения партнёров с действиями пользователя',
      ],
    };
  }

  if (summary.active > 0) {
    return {
      title: 'Активные возможности',
      summary: 'Сейчас в Connect видны доступные RF-ваучеры для использования.',
      bullets: [
        'Активные возможности',
        'История RF-активности',
        'Как RF отражается в Connect',
        'RF помогает связывать предложения партнёров с действиями пользователя',
      ],
    };
  }

  return {
    title: 'История RF-активности',
    summary: 'Активных ваучеров сейчас нет, но история взаимодействия уже зафиксирована.',
    bullets: [
      'Использованные преимущества',
      'История RF-активности',
      'RF помогает связывать предложения партнёров с действиями пользователя',
    ],
  };
}

function buildMilestones(vouchers: RfVoucherDto[], proAttributedCount: number): ConnectRfProjectionMilestone[] {
  const redeemed = vouchers.filter((voucher) => getRfVoucherEffectiveStatus(voucher) === 'redeemed');
  const redeemedPartners = new Set(redeemed.map((voucher) => voucher.partnerId));
  const redeemedByOffer = new Map<string, number>();
  for (const voucher of redeemed) {
    redeemedByOffer.set(voucher.offerId, (redeemedByOffer.get(voucher.offerId) ?? 0) + 1);
  }

  return [
    {
      id: 'first_claim',
      label: 'Первый ваучер получен',
      reached: vouchers.length > 0,
    },
    {
      id: 'first_used',
      label: 'Первый ваучер использован',
      reached: redeemed.length > 0,
    },
    {
      id: 'first_pro',
      label: 'Получено через PRO',
      reached: proAttributedCount > 0,
    },
    {
      id: 'multi_partner_used',
      label: 'Использованы ваучеры у нескольких партнёров',
      reached: redeemedPartners.size >= 2,
    },
    {
      id: 'repeat_used_again',
      label: 'Повторный ваучер использован снова',
      reached: [...redeemedByOffer.values()].some((count) => count >= 2),
    },
  ];
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

export function buildConnectRfProjection(vouchers: RfVoucherDto[], summary?: RfVoucherSummary | null): ConnectRfProjection {
  const active = vouchers.filter((voucher) => ACTIVE_CANONICAL_STATUSES.has(getRfVoucherEffectiveStatus(voucher))).sort(sortByDateDesc);
  const used = vouchers.filter((voucher) => getRfVoucherEffectiveStatus(voucher) === 'redeemed').sort(sortByDateDesc);
  const unavailable = vouchers
    .filter((voucher) => ['cancelled', 'expired'].includes(getRfVoucherEffectiveStatus(voucher)))
    .sort(sortByDateDesc);
  const pendingActivation = vouchers.filter((voucher) => getRfVoucherEffectiveStatus(voucher) === 'locked').sort(sortByDateDesc);
  const repeatableAgain = vouchers.filter(isRepeatableOpportunity).sort(sortByDateDesc);
  const proAttributedCount = vouchers.filter(isProAttributedVoucher).length;

  // Precedence rule:
  // - summary endpoint is authoritative for core counter fields when available;
  // - list-derived counters are fallback for degraded states only.
  const projectionSummary: ConnectRfProjectionSummary = {
    total: summary?.totalVouchers ?? vouchers.length,
    active: summary?.activeVouchers ?? active.length,
    used: summary?.usedVouchers ?? used.length,
    unavailable: (summary?.cancelledVouchers ?? unavailable.length) + (summary?.expiredVouchers ?? 0),
    pendingActivation: pendingActivation.length,
    repeatableAvailable: repeatableAgain.length,
    receivedViaPro: proAttributedCount,
  };

  return {
    summary: projectionSummary,
    groups: {
      active,
      used,
      unavailable,
      pendingActivation,
      repeatableAgain,
    },
    recent: {
      lastClaimed: getMostRecentVoucher(vouchers, 'claimedAt'),
      lastRedeemed: getMostRecentVoucher(vouchers, 'redeemedAt'),
      activity: buildRfVoucherTimelineItems(vouchers),
    },
    milestones: buildMilestones(vouchers, proAttributedCount),
    narrative: buildNarrative(projectionSummary),
  };
}

export function projectionCopyGuardText(): string {
  return [
    'Активные возможности',
    'Использованные преимущества',
    'Получено через PRO',
    'Можно получить снова',
    'История RF-активности',
    'RF помогает связывать предложения партнёров с действиями пользователя',
  ].join(' | ');
}
