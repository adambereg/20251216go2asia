import { describe, expect, it } from 'vitest';
import {
  findMerchantItemById,
  formatItemSubtitle,
  formatMerchantItemPrice,
  formatMerchantItemOptionLabel,
  getActiveMerchantItems,
  getItemLabelForOffer,
  getMerchantItemStatusLabel,
  getOfferItemDisplayLabel,
  getProItemContextLine,
  merchantItemOfferBindingCopy,
  merchantItemCatalogBoundaryCopy,
  normalizeOfferItemId,
  proItemContextBoundaryCopy,
  safeItemFallback,
  validateMerchantItemForm,
} from './rfMerchantItems';
import type { RfOfferDto, RfPartnerItemDto } from '@go2asia/sdk/rf';

function item(overrides: Partial<RfPartnerItemDto> = {}): RfPartnerItemDto {
  return {
    id: 'item_1',
    partnerId: 'partner_1',
    title: 'Завтрак',
    description: null,
    category: 'food',
    priceFrom: 250,
    currency: 'THB',
    status: 'active',
    createdAt: '2026-05-05T00:00:00.000Z',
    updatedAt: '2026-05-05T00:00:00.000Z',
    ...overrides,
  };
}

function offer(overrides: Partial<RfOfferDto> = {}): RfOfferDto {
  return {
    id: 'offer_1',
    partnerId: 'partner_1',
    itemId: null,
    title: 'Breakfast offer',
    offerType: 'discount',
    visibility: 'public',
    status: 'active',
    createdByUserId: 'owner_1',
    createdAt: '2026-05-05T00:00:00.000Z',
    updatedAt: '2026-05-05T00:00:00.000Z',
    ...overrides,
  };
}

describe('rf merchant item helpers', () => {
  it('formats status labels', () => {
    expect(getMerchantItemStatusLabel('active')).toBe('Активен');
    expect(getMerchantItemStatusLabel('archived')).toBe('В архиве');
  });

  it('formats price only when price and currency are present', () => {
    expect(formatMerchantItemPrice(1200, 'usd')).toBe('от 1 200 USD');
    expect(formatMerchantItemPrice(null, 'USD')).toBeNull();
    expect(formatMerchantItemPrice(1200, null)).toBeNull();
  });

  it('validates and normalizes item form input', () => {
    const result = validateMerchantItemForm({
      title: '  Thai Cooking Class  ',
      description: ' Private lesson ',
      category: ' experience ',
      priceFrom: '120,5',
      currency: 'usd',
    });

    expect(result).toEqual({
      ok: true,
      value: {
        title: 'Thai Cooking Class',
        description: 'Private lesson',
        category: 'experience',
        priceFrom: 120.5,
        currency: 'USD',
      },
    });
  });

  it('rejects invalid input before sending it to the API', () => {
    expect(validateMerchantItemForm({ title: ' ', description: '', category: '', priceFrom: '', currency: '' })).toEqual({
      ok: false,
      message: 'Название товара или услуги обязательно.',
    });
    expect(validateMerchantItemForm({ title: 'Class', description: '', category: '', priceFrom: '-1', currency: 'USD' })).toEqual({
      ok: false,
      message: 'Цена не может быть отрицательной.',
    });
    expect(validateMerchantItemForm({ title: 'Class', description: '', category: '', priceFrom: '10', currency: '' })).toEqual({
      ok: false,
      message: 'Укажите валюту, если заполнена цена.',
    });
    expect(validateMerchantItemForm({ title: 'Class', description: '', category: '', priceFrom: '', currency: 'US' })).toEqual({
      ok: false,
      message: 'Валюта должна состоять из 3 латинских букв.',
    });
  });

  it('keeps archived items out of the offer selector', () => {
    expect(getActiveMerchantItems([item(), item({ id: 'archived_item', status: 'archived' })]).map((entry) => entry.id)).toEqual([
      'item_1',
    ]);
  });

  it('formats selector labels with title, category and price', () => {
    expect(formatMerchantItemOptionLabel(item())).toBe('Завтрак · food · от 250 THB');
    expect(formatMerchantItemOptionLabel(item({ category: null, priceFrom: null, currency: null }))).toBe('Завтрак');
  });

  it('normalizes empty item ids before createOffer input', () => {
    expect(normalizeOfferItemId('')).toBeUndefined();
    expect(normalizeOfferItemId('   ')).toBeUndefined();
    expect(normalizeOfferItemId('item_1')).toBe('item_1');
  });

  it('finds item display labels with fallback for missing item context', () => {
    expect(findMerchantItemById([item()], 'item_1')?.title).toBe('Завтрак');
    expect(getOfferItemDisplayLabel('item_1', [item()])).toBe('Товар/услуга: Завтрак');
    expect(getOfferItemDisplayLabel('missing_item', [item()])).toBe('Товар/услуга: недоступно');
    expect(getOfferItemDisplayLabel(null, [item()])).toBeNull();
  });

  it('formats public item subtitles without commerce actions', () => {
    expect(formatItemSubtitle(item())).toBe('Завтрак · Категория: food · От 250 THB');
    expect(formatItemSubtitle(item({ status: 'archived' }))).toBe('Завтрак · Категория: food · От 250 THB');
    expect(formatItemSubtitle(null)).toBeNull();
  });

  it('returns item label for offer with safe legacy fallback', () => {
    expect(getItemLabelForOffer(offer({ itemId: 'item_1' }), item())).toBe('Завтрак · Категория: food · От 250 THB');
    expect(getItemLabelForOffer(offer({ itemId: 'missing_item' }), null)).toBe(safeItemFallback);
    expect(getItemLabelForOffer(offer({ itemId: null }), null)).toBeNull();
  });

  it('formats PRO read-only item context without noisy fallback', () => {
    expect(getProItemContextLine(offer({ itemId: 'item_1' }), item())).toBe('Товар/услуга: Завтрак · Категория: food · От 250 THB');
    expect(getProItemContextLine(offer({ itemId: 'missing_item' }), null)).toBe('Товар/услуга: недоступна');
    expect(getProItemContextLine(offer({ itemId: null }), null)).toBeNull();
  });

  it('does not introduce economy or management-right confusion copy', () => {
    const copy = `${merchantItemCatalogBoundaryCopy} ${merchantItemOfferBindingCopy} ${proItemContextBoundaryCopy} ${safeItemFallback}`.toLowerCase();
    expect(copy).not.toMatch(/купить|оплатить|оплата|корзина|reward|payout|commission|earnings|income|доход|комисси|выплат|начислен/);
    expect(copy).toContain('read-only');
    expect(copy).toContain('уровне оффера');
    expect(copy).toContain('только для ориентира');
  });
});

