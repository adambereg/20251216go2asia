import type { RfOfferDto, RfVoucherDto } from '@go2asia/sdk/rf';

export type RfSpendSemanticsKind = 'free' | 'economy_enabled_free' | 'paid_spend_required';

export type RfSpendSemantics = {
  kind: RfSpendSemanticsKind;
  pointsCost: number;
  label: string;
  caption: string;
  tone: string;
};

function normalizePointsCost(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  return Math.max(0, Math.floor(value));
}

function formatPointsCost(points: number): string {
  return `${points} Points`;
}

export function getRfOfferSpendSemantics(offer: Pick<RfOfferDto, 'pointsCost'>): RfSpendSemantics {
  const pointsCost = normalizePointsCost(offer.pointsCost);
  if (pointsCost !== null && pointsCost > 0) {
    return {
      kind: 'paid_spend_required',
      pointsCost,
      label: `Будет списано: ${formatPointsCost(pointsCost)}`,
      caption: 'Для получения требуется VIP; RF вызовет Points spend.',
      tone: 'bg-amber-100 text-amber-900',
    };
  }
  if (pointsCost === 0) {
    return {
      kind: 'economy_enabled_free',
      pointsCost: 0,
      label: 'Points не требуются',
      caption: 'Оффер участвует в RF economy, но текущая стоимость 0 Points.',
      tone: 'bg-sky-100 text-sky-800',
    };
  }
  return {
    kind: 'free',
    pointsCost: 0,
    label: 'Бесплатный ваучер',
    caption: 'Points не используются для получения.',
    tone: 'bg-emerald-100 text-emerald-800',
  };
}

export function getRfVoucherSpendSemantics(
  voucher: Pick<RfVoucherDto, 'pointsCostSnapshot' | 'economyStatus'>
): RfSpendSemantics {
  const pointsCost = normalizePointsCost(voucher.pointsCostSnapshot);
  if (pointsCost !== null && pointsCost > 0) {
    const caption =
      voucher.economyStatus === 'debited'
        ? 'Points spend уже зафиксирован RF runtime.'
        : voucher.economyStatus === 'debit_failed'
          ? 'Points spend не завершился; требуется безопасная проверка.'
          : 'Получение связано с Points spend semantics.';
    return {
      kind: 'paid_spend_required',
      pointsCost,
      label: voucher.economyStatus === 'debited' ? `Списано: ${formatPointsCost(pointsCost)}` : `Требуется: ${formatPointsCost(pointsCost)}`,
      caption,
      tone: 'bg-amber-100 text-amber-900',
    };
  }
  if (pointsCost === 0 || voucher.economyStatus === 'not_required') {
    return {
      kind: 'economy_enabled_free',
      pointsCost: 0,
      label: 'Points не требовались',
      caption: 'RF economy fields присутствуют, но spend не выполнялся.',
      tone: 'bg-sky-100 text-sky-800',
    };
  }
  return {
    kind: 'free',
    pointsCost: 0,
    label: 'Бесплатный ваучер',
    caption: 'Нет признаков Points spend.',
    tone: 'bg-emerald-100 text-emerald-800',
  };
}

export function getRfOfferClaimButtonLabel(offer: Pick<RfOfferDto, 'pointsCost'>): string {
  const semantics = getRfOfferSpendSemantics(offer);
  return semantics.kind === 'paid_spend_required' ? `Получить за ${formatPointsCost(semantics.pointsCost)}` : 'Получить ваучер';
}

