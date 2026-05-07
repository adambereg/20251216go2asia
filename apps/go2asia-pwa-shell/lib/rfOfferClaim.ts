import type { RfClaimResponse, RfVoucherDto } from '@go2asia/sdk/rf';

export const rfOfferClaimCopy = {
  buttonIdle: 'Получить ваучер',
  buttonLoading: 'Получаем ваучер...',
  buttonSuccess: 'Ваучер получен',
  authRequired: 'Войдите, чтобы получить ваучер.',
  success: 'Ваучер получен.',
  alreadyClaimed: 'Ваучер уже получен.',
  successHint: 'Ваучер появится в разделе Мои ваучеры.',
  genericError: 'Не удалось получить ваучер. Попробуйте позже.',
  unavailable: 'Этот оффер сейчас недоступен.',
  idempotencyError: 'Этот запрос уже использовался для другого ваучера. Обновите страницу и попробуйте снова.',
  rateLimited: 'Слишком много попыток. Попробуйте позже.',
  localSaveNote: 'Сохранение оффера — это локальная заметка, не ваучер.',
  myVouchersLink: 'Открыть Мои ваучеры',
  signInLink: 'Перейти ко входу',
} as const;

export function getRfOfferClaimSuccessMessage(result: Pick<RfClaimResponse, 'idempotentReplay'>): string {
  return result.idempotentReplay ? rfOfferClaimCopy.alreadyClaimed : rfOfferClaimCopy.success;
}

export function getRfOfferClaimErrorMessage(error: unknown): string {
  const payload = error as { status?: number; error?: { code?: string; message?: string }; message?: string };
  const code = payload?.error?.code;
  const status = payload?.status;

  if (status === 401 || code === 'UNAUTHORIZED') return rfOfferClaimCopy.authRequired;
  if (code === 'RF_IDEMPOTENCY_KEY_CONTEXT_MISMATCH') return rfOfferClaimCopy.idempotencyError;
  if (code === 'RATE_LIMITED') return rfOfferClaimCopy.rateLimited;
  if (
    code === 'RF_OFFER_NOT_FOUND' ||
    code === 'RF_OFFER_INACTIVE' ||
    code === 'RF_OFFER_NOT_CLAIMABLE' ||
    code === 'RF_PARTNER_INACTIVE'
  ) {
    return rfOfferClaimCopy.unavailable;
  }
  if (code === 'RF_VOUCHER_CLAIM_FAILED' || code === 'RF_CLAIM_IDEMPOTENCY_FAILED') {
    return rfOfferClaimCopy.genericError;
  }

  return rfOfferClaimCopy.genericError;
}

export function isPartnerVoucherForOffer(voucher: RfVoucherDto, offerId: string): boolean {
  const isActive = voucher.status === 'claimed' || voucher.status === 'redeemed';
  const isPartnerScope = voucher.claimScope === 'partner' || (!voucher.claimScope && !voucher.listingContext);
  return isActive && isPartnerScope && voucher.offerId === offerId;
}
