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
      label: `Требуются internal Points: ${formatPointsCost(pointsCost)}`,
      caption: 'Получение может требовать VIP и runtime-проверку использования internal Points. Это не финальное подтверждение сделки.',
      tone: 'bg-amber-100 text-amber-900',
    };
  }
  if (pointsCost === 0) {
    return {
      kind: 'economy_enabled_free',
      pointsCost: 0,
      label: 'Points не требуются',
      caption: 'Оффер использует RF economy metadata, но текущая стоимость 0 Points.',
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
        ? 'RF runtime зафиксировал списание internal Points. Это не чек и не финальное подтверждение сделки.'
        : voucher.economyStatus === 'debit_failed'
          ? 'Списание internal Points не зафиксировано; требуется безопасная runtime-проверка.'
          : 'Получение связано с runtime-проверкой internal Points.';
    return {
      kind: 'paid_spend_required',
      pointsCost,
      label: voucher.economyStatus === 'debited'
        ? `Points списаны в RF runtime: ${formatPointsCost(pointsCost)}`
        : `Требуются internal Points: ${formatPointsCost(pointsCost)}`,
      caption,
      tone: 'bg-amber-100 text-amber-900',
    };
  }
  if (pointsCost === 0 || voucher.economyStatus === 'not_required') {
    return {
      kind: 'economy_enabled_free',
      pointsCost: 0,
      label: 'Points не требовались',
      caption: 'RF economy fields присутствуют, но использование Points не требовалось.',
      tone: 'bg-sky-100 text-sky-800',
    };
  }
  return {
    kind: 'free',
    pointsCost: 0,
    label: 'Бесплатный ваучер',
    caption: 'Нет признаков использования Points.',
    tone: 'bg-emerald-100 text-emerald-800',
  };
}

export function getRfOfferClaimButtonLabel(offer: Pick<RfOfferDto, 'pointsCost'>): string {
  const semantics = getRfOfferSpendSemantics(offer);
  return semantics.kind === 'paid_spend_required'
    ? `Получить ваучер (списание ${formatPointsCost(semantics.pointsCost)})`
    : 'Получить ваучер';
}

