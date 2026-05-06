import type { RfCreatePartnerItemRequest, RfOfferDto, RfPartnerItemDto } from '@go2asia/sdk/rf';

export const merchantItemCatalogBoundaryCopy =
  'Товары и услуги управляются владельцем бизнеса. PRO сможет видеть этот контекст позже только read-only и не создаёт и не редактирует каталог.';

export const merchantItemOfferBindingNextStageCopy =
  'Привязка оффера к товару или услуге будет подключена следующим этапом.';

export const merchantItemOfferBindingCopy =
  'Привязка помогает понять, к какому товару или услуге относится оффер. Ваучер по-прежнему создаётся и погашается на уровне оффера.';

export function getMerchantItemStatusLabel(status: RfPartnerItemDto['status']): string {
  return status === 'active' ? 'Активен' : 'В архиве';
}

export function getMerchantItemStatusTone(status: RfPartnerItemDto['status']): string {
  return status === 'active' ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-100 text-slate-700';
}

export function formatMerchantItemPrice(priceFrom: number | null, currency: string | null): string | null {
  if (priceFrom === null || currency === null) return null;
  const formattedPrice = priceFrom.toLocaleString('ru-RU', { maximumFractionDigits: 2 }).replace(/\u00A0/g, ' ');
  return `от ${formattedPrice} ${currency.toUpperCase()}`;
}

export function formatMerchantItemOptionLabel(item: RfPartnerItemDto): string {
  return [item.title, item.category, formatMerchantItemPrice(item.priceFrom, item.currency)].filter(Boolean).join(' · ');
}

export function getActiveMerchantItems(items: RfPartnerItemDto[]): RfPartnerItemDto[] {
  return items.filter((item) => item.status === 'active');
}

export function findMerchantItemById(items: RfPartnerItemDto[], itemId: string | null | undefined): RfPartnerItemDto | null {
  if (!itemId) return null;
  return items.find((item) => item.id === itemId) ?? null;
}

export function normalizeOfferItemId(itemId: string): string | undefined {
  const trimmed = itemId.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function getOfferItemDisplayLabel(itemId: string | null | undefined, items: RfPartnerItemDto[]): string | null {
  if (!itemId) return null;
  const item = findMerchantItemById(items, itemId);
  return item ? `Товар/услуга: ${item.title}` : 'Товар/услуга: недоступно';
}

export const safeItemFallback = 'Товар/услуга недоступна';

export function formatItemSubtitle(item: RfPartnerItemDto | null | undefined): string | null {
  if (!item) return null;
  const priceLabel = formatMerchantItemPrice(item.priceFrom, item.currency)?.replace(/^от /, 'От ');
  return [item.title, item.category ? `Категория: ${item.category}` : null, priceLabel]
    .filter(Boolean)
    .join(' · ');
}

export function getItemLabelForOffer(offer: Pick<RfOfferDto, 'itemId'>, item?: RfPartnerItemDto | null): string | null {
  if (!offer.itemId) return null;
  const subtitle = formatItemSubtitle(item);
  return subtitle ?? safeItemFallback;
}

export type MerchantItemFormInput = {
  title: string;
  description: string;
  category: string;
  priceFrom: string;
  currency: string;
};

type MerchantItemValidationResult =
  | { ok: true; value: RfCreatePartnerItemRequest }
  | { ok: false; message: string };

function normalizeOptionalText(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function validateMerchantItemForm(input: MerchantItemFormInput): MerchantItemValidationResult {
  const title = input.title.trim();
  if (!title) return { ok: false, message: 'Название товара или услуги обязательно.' };

  const rawPrice = input.priceFrom.trim();
  const currency = input.currency.trim().toUpperCase();
  let priceFrom: number | null = null;
  if (rawPrice.length > 0) {
    priceFrom = Number(rawPrice.replace(',', '.'));
    if (!Number.isFinite(priceFrom)) return { ok: false, message: 'Цена должна быть числом.' };
    if (priceFrom < 0) return { ok: false, message: 'Цена не может быть отрицательной.' };
    if (!currency) return { ok: false, message: 'Укажите валюту, если заполнена цена.' };
  }
  if (currency && !/^[A-Z]{3}$/.test(currency)) {
    return { ok: false, message: 'Валюта должна состоять из 3 латинских букв.' };
  }

  return {
    ok: true,
    value: {
      title,
      description: normalizeOptionalText(input.description),
      category: normalizeOptionalText(input.category),
      priceFrom,
      currency: currency || null,
    },
  };
}

