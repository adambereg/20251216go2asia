import { describe, expect, it } from 'vitest';
import {
  formatMerchantItemPrice,
  getMerchantItemStatusLabel,
  merchantItemCatalogBoundaryCopy,
  merchantItemOfferBindingNextStageCopy,
  validateMerchantItemForm,
} from './rfMerchantItems';

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

  it('does not introduce economy or management-right confusion copy', () => {
    const copy = `${merchantItemCatalogBoundaryCopy} ${merchantItemOfferBindingNextStageCopy}`.toLowerCase();
    expect(copy).not.toMatch(/reward|commission|payout|earnings|income|доход|комисси|выплат|начислен/);
    expect(copy).toContain('read-only');
    expect(copy).toContain('следующим этапом');
  });
});

