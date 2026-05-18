import type { RfRepeatPolicy, RfRieltListingOfferDto, RfVoucherDto } from '@go2asia/sdk/rf';
import { getRfVoucherEffectiveStatus, isRfVoucherClaimBarrier } from './rfVoucherLifecycle';

export type ListingVoucherCtaState =
  | 'no_offer'
  | 'claim_available'
  | 'ready_to_use'
  | 'pending_activation'
  | 'used'
  | 'unavailable'
  | 'stale'
  | 'partial'
  | 'error';

export interface ListingVoucherCtaProjection {
  state: ListingVoucherCtaState;
  badgeLabel: string;
  buttonLabel: string;
  message: string | null;
  disabled: boolean;
  showPostClaimActions: boolean;
}

export interface ListingVoucherCtaInput {
  offer?: Pick<RfRieltListingOfferDto, 'id' | 'repeatPolicy'> | null;
  voucher?: Pick<RfVoucherDto, 'status' | 'canonicalStatus'> | null;
  loading?: boolean;
  error?: string | null;
  partial?: boolean;
  stale?: boolean;
}

export function findListingVoucherForOffer(
  vouchers: RfVoucherDto[],
  offerId: string,
  listingId: string,
  repeatPolicy: RfRepeatPolicy = 'once_per_scope'
): RfVoucherDto | null {
  return (
    vouchers.find(
      (voucher) =>
        isRfVoucherClaimBarrier(voucher, repeatPolicy) &&
        voucher.claimScope === 'listing' &&
        voucher.offerId === offerId &&
        voucher.listingContext?.listingId === listingId
    ) ?? null
  );
}

export function getListingVoucherCtaProjection(input: ListingVoucherCtaInput): ListingVoucherCtaProjection {
  if (input.error) {
    return {
      state: 'error',
      badgeLabel: 'Ошибка',
      buttonLabel: 'Повторить позже',
      message: input.error,
      disabled: true,
      showPostClaimActions: false,
    };
  }

  if (input.loading) {
    return {
      state: 'claim_available',
      badgeLabel: 'Запрос отправляется',
      buttonLabel: 'Отправляем запрос...',
      message: null,
      disabled: true,
      showPostClaimActions: false,
    };
  }

  if (!input.offer) {
    return {
      state: 'no_offer',
      badgeLabel: 'Нет RF-предложения',
      buttonLabel: 'Нет RF-предложений',
      message: 'Для этого объекта пока нет RF-предложений.',
      disabled: true,
      showPostClaimActions: false,
    };
  }

  if (input.partial) {
    return {
      state: 'partial',
      badgeLabel: 'Детали ограничены',
      buttonLabel: 'RF-детали ограничены',
      message: 'RF-детали временно ограничены.',
      disabled: true,
      showPostClaimActions: false,
    };
  }

  if (input.stale) {
    return {
      state: 'stale',
      badgeLabel: 'Статус обновляется',
      buttonLabel: 'Обновите статус',
      message: 'Статус RF-ваучера может обновиться.',
      disabled: true,
      showPostClaimActions: false,
    };
  }

  if (!input.voucher) {
    return {
      state: 'claim_available',
      badgeLabel: 'RF-ваучер',
      buttonLabel: 'Получить RF-ваучер',
      message: null,
      disabled: false,
      showPostClaimActions: false,
    };
  }

  const status = getRfVoucherEffectiveStatus(input.voucher);

  if (status === 'locked') {
    return {
      state: 'pending_activation',
      badgeLabel: 'Ожидает активации',
      buttonLabel: 'Ваучер ожидает активации',
      message: 'Ваучер получен, ожидает RF-активации.',
      disabled: true,
      showPostClaimActions: true,
    };
  }

  if (status === 'redeemed') {
    return {
      state: 'used',
      badgeLabel: 'Использован',
      buttonLabel: 'Ваучер использован',
      message: 'Ваучер использован.',
      disabled: true,
      showPostClaimActions: false,
    };
  }

  if (status === 'cancelled' || status === 'expired') {
    return {
      state: 'unavailable',
      badgeLabel: 'Недоступен',
      buttonLabel: 'RF-ваучер недоступен',
      message: 'RF-ваучер сейчас недоступен.',
      disabled: true,
      showPostClaimActions: false,
    };
  }

  return {
    state: 'ready_to_use',
    badgeLabel: 'Ваучер получен',
    buttonLabel: 'Ваучер получен',
    message: 'Ваучер готов к использованию у партнёра.',
    disabled: true,
    showPostClaimActions: true,
  };
}
