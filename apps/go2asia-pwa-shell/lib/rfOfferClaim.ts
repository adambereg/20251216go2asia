import type { RfClaimResponse, RfRepeatPolicy, RfVoucherDto } from '@go2asia/sdk/rf';
import { isRfVoucherClaimBarrier } from './rfVoucherLifecycle';

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
  vipRequired: 'Этот ваучер доступен только для VIP.',
  insufficientBalance: 'Недостаточно Points для получения этого ваучера.',
  spendTemporarilyUnavailable: 'Сервис списания Points временно недоступен. Попробуйте позже.',
  localSaveNote: 'Сохранение оффера — это локальная заметка, не ваучер.',
  myVouchersLink: 'Открыть Мои ваучеры',
  signInLink: 'Перейти ко входу',
} as const;

export function getRfOfferClaimSuccessMessage(result: Pick<RfClaimResponse, 'idempotentReplay' | 'createdNewInstance'>): string {
  if (result.createdNewInstance === false) return rfOfferClaimCopy.alreadyClaimed;
  return result.idempotentReplay ? rfOfferClaimCopy.alreadyClaimed : rfOfferClaimCopy.success;
}

export function getRfOfferClaimErrorMessage(error: unknown): string {
  const payload = error as { status?: number; error?: { code?: string; message?: string }; message?: string };
  const code = payload?.error?.code;
  const status = payload?.status;

  if (status === 401 || code === 'UNAUTHORIZED') return rfOfferClaimCopy.authRequired;
  if (code === 'RF_IDEMPOTENCY_KEY_CONTEXT_MISMATCH') return rfOfferClaimCopy.idempotencyError;
  if (code === 'RATE_LIMITED') return rfOfferClaimCopy.rateLimited;
  if (code === 'RF_VIP_REQUIRED_FOR_PAID_VOUCHER') return rfOfferClaimCopy.vipRequired;
  if (code === 'RF_INSUFFICIENT_POINTS_BALANCE') return rfOfferClaimCopy.insufficientBalance;
  if (code === 'RF_SPEND_TEMPORARILY_UNAVAILABLE' || code === 'RF_ECONOMY_RECOVERY_PENDING') {
    return rfOfferClaimCopy.spendTemporarilyUnavailable;
  }
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

export function isPartnerVoucherForOffer(voucher: RfVoucherDto, offerId: string, repeatPolicy: RfRepeatPolicy = 'once_per_scope'): boolean {
  const isPartnerScope = voucher.claimScope === 'partner' || (!voucher.claimScope && !voucher.listingContext);
  return isRfVoucherClaimBarrier(voucher, repeatPolicy) && isPartnerScope && voucher.offerId === offerId;
}
