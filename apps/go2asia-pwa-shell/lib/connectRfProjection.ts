import type { RfVoucherDto, RfVoucherSummary } from '@go2asia/sdk/rf';

export type RfVoucherEffectiveStatus = NonNullable<RfVoucherDto['canonicalStatus']>;

export type RfEconomicMeaningState = 'empty' | 'active_only' | 'used' | 'inactive_only' | 'mixed';

export interface RfEconomicMeaningCta {
  label: string;
  href: '/rf/vouchers' | '/rf/my-vouchers';
}

export interface RfEconomicMeaning {
  state: RfEconomicMeaningState;
  title: string;
  summary: string;
  bullets: string[];
  ctas: RfEconomicMeaningCta[];
  futureNotes: string[];
}

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

export function buildRfEconomicMeaning(
  vouchers: RfVoucherDto[],
  summary?: RfVoucherSummary | null,
): RfEconomicMeaning {
  const split = splitRfVouchersByProjectionStatus(vouchers);
  const total = summary?.totalVouchers ?? vouchers.length;
  const activeCount = summary?.activeVouchers ?? split.active.length;
  const usedCount = summary?.usedVouchers ?? split.used.length;
  const cancelledCount = summary?.cancelledVouchers ?? split.cancelled.length;
  const inactiveCount = cancelledCount + split.other.length;
  const futureNotes = [
    'Rewards за RF-активность появятся позже.',
    'Points-связь будет включена отдельным этапом.',
    'PRO attribution и выплаты не входят в текущую версию.',
  ];

  if (total === 0) {
    return {
      state: 'empty',
      title: 'У вас пока нет RF-ваучеров',
      summary: 'Вы ещё не начали пользоваться RF-предложениями.',
      bullets: [
        'Начните с сохранения или получения первого предложения.',
        'Connect покажет здесь ваш RF-прогресс.',
        'Сейчас это только объяснение состояния, без действий с ваучерами.',
      ],
      ctas: [{ label: 'Найти предложения', href: '/rf/vouchers' }],
      futureNotes,
    };
  }

  if (activeCount > 0 && usedCount > 0) {
    return {
      state: 'mixed',
      title: 'Вы уже используете RF и у вас ещё есть активные возможности',
      summary: 'Вы уже начали использовать RF-предложения.',
      bullets: [
        'У вас есть активные ваучеры, которые можно использовать у партнёров Russian Friendly.',
        'История использования остаётся в RF и отображается в Connect только для понимания прогресса.',
        'Rewards и Points за RF будут подключены позже.',
      ],
      ctas: [
        { label: 'Открыть мои RF-ваучеры', href: '/rf/my-vouchers' },
        { label: 'Найти предложения', href: '/rf/vouchers' },
      ],
      futureNotes,
    };
  }

  if (activeCount > 0) {
    return {
      state: 'active_only',
      title: 'У вас есть активные RF-возможности',
      summary: 'Используйте ваучер у партнёра Russian Friendly.',
      bullets: [
        'Активные ваучеры можно открыть в RF-разделе.',
        'Connect показывает состояние, но не изменяет ваучеры.',
        'Rewards и Points за ваучеры будут подключены позже.',
      ],
      ctas: [{ label: 'Открыть мои RF-ваучеры', href: '/rf/my-vouchers' }],
      futureNotes,
    };
  }

  if (usedCount > 0) {
    return {
      state: 'used',
      title: 'Вы уже начали использовать RF-предложения',
      summary: 'Connect показывает историю использования, но не начисляет rewards за неё.',
      bullets: [
        'Использованные ваучеры остаются частью RF-истории.',
        'Новые активные возможности можно найти в каталоге Russian Friendly.',
        'Текущая версия не создаёт wallet-операции из RF-событий.',
      ],
      ctas: [
        { label: 'Открыть мои RF-ваучеры', href: '/rf/my-vouchers' },
        { label: 'Найти предложения', href: '/rf/vouchers' },
      ],
      futureNotes,
    };
  }

  return {
    state: 'inactive_only',
    title: 'Сейчас нет активных RF-возможностей',
    summary:
      inactiveCount > 0
        ? 'У вас есть только отменённые, истёкшие или другие неактивные RF-статусы.'
        : 'Активные RF-возможности сейчас не найдены.',
    bullets: [
      'Найдите новые предложения в Russian Friendly.',
      'Connect не восстанавливает и не меняет статусы ваучеров.',
      'Будущая экономическая связка будет отдельным этапом.',
    ],
    ctas: [{ label: 'Найти предложения', href: '/rf/vouchers' }],
    futureNotes,
  };
}
