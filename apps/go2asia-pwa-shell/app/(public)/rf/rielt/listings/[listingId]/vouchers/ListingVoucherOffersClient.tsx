'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { claimRfRieltListingOffer, fetchMyVouchers } from '@go2asia/sdk/rf';
import type { RfRieltListingOfferDto, RfVoucherDto } from '@go2asia/sdk/rf';
import { buildRfClaimAttributionPayload, captureRfProAttributionFromUrl } from '@/lib/rfProAttribution';

type ClaimState =
  | { status: 'idle'; message: string | null; voucher: null }
  | { status: 'loading'; message: string | null; voucher: null }
  | { status: 'success'; message: string; voucher: RfVoucherDto }
  | { status: 'error'; message: string; voucher: null };

type ClaimStateByOffer = Record<string, ClaimState>;

interface ListingVoucherOffersClientProps {
  offers: RfRieltListingOfferDto[];
  listingId: string;
  listingTitle: string;
  returnHref: string;
  partnerHref: string | null;
}

function getOfferTypeLabel(type: RfRieltListingOfferDto['type']) {
  return type === 'premium' ? 'Premium-ваучер' : 'Базовый ваучер';
}

function getOfferBenefit(offer: RfRieltListingOfferDto) {
  return offer.benefit?.trim() || offer.description?.trim() || offer.applicabilityNote?.trim() || offer.title;
}

function getOfferConditions(offer: RfRieltListingOfferDto) {
  return offer.applicabilityNote?.trim() || 'Условия уточняются у партнёра.';
}

function getErrorMessage(error: unknown) {
  const payload = error as { status?: number; error?: { code?: string; message?: string }; message?: string };
  const code = payload?.error?.code;
  const status = payload?.status;

  if (status === 401 || code === 'UNAUTHORIZED') return 'Войдите, чтобы получить ваучер.';
  if (code === 'RF_IDEMPOTENCY_KEY_CONTEXT_MISMATCH') {
    return 'Этот запрос уже использовался для другого ваучера. Обновите страницу и попробуйте снова.';
  }
  if (code === 'RF_OFFER_NOT_FOUND' || code === 'RF_OFFER_INACTIVE' || code === 'RF_OFFER_NOT_CLAIMABLE' || code === 'RF_PARTNER_INACTIVE') {
    return 'Этот оффер сейчас недоступен.';
  }
  if (code === 'RATE_LIMITED') return 'Слишком много попыток. Попробуйте позже.';
  if (code === 'RF_VOUCHER_CLAIM_FAILED' || code === 'RF_CLAIM_IDEMPOTENCY_FAILED') {
    return 'Не удалось получить ваучер. Попробуйте позже.';
  }

  return 'Не удалось получить ваучер. Попробуйте позже.';
}

function createInitialClaimState(): ClaimState {
  return { status: 'idle', message: null, voucher: null };
}

function isActiveVoucherStatus(status: RfVoucherDto['status']) {
  return status === 'claimed' || status === 'redeemed';
}

function isListingVoucherForOffer(voucher: RfVoucherDto, offerId: string, listingId: string) {
  return (
    isActiveVoucherStatus(voucher.status) &&
    voucher.claimScope === 'listing' &&
    voucher.offerId === offerId &&
    voucher.listingContext?.listingId === listingId
  );
}

function PostClaimActions({
  returnHref,
  partnerHref,
}: {
  returnHref: string;
  partnerHref: string | null;
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <Link
        href={returnHref}
        className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
      >
        Вернуться к объекту
      </Link>
      <Link
        href="/rf/my-vouchers"
        className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
      >
        Мои ваучеры
      </Link>
      {partnerHref ? (
        <Link
          href={partnerHref}
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
        >
          Посмотреть офферы партнёра
        </Link>
      ) : null}
    </div>
  );
}

export function ListingVoucherOffersClient({
  offers,
  listingId,
  listingTitle,
  returnHref,
  partnerHref,
}: ListingVoucherOffersClientProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [claimStates, setClaimStates] = useState<ClaimStateByOffer>({});

  useEffect(() => {
    captureRfProAttributionFromUrl(searchParams, pathname);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    let cancelled = false;

    async function hydrateClaimedOffers() {
      const currentVouchers = await fetchMyVouchers();
      if (cancelled || !currentVouchers) return;

      const offerIds = new Set(offers.map((offer) => offer.id));
      const nextStates = currentVouchers.items.reduce<ClaimStateByOffer>((acc, voucher) => {
        if (!offerIds.has(voucher.offerId)) return acc;
        if (!isListingVoucherForOffer(voucher, voucher.offerId, listingId)) return acc;
        acc[voucher.offerId] = {
          status: 'success',
          message: 'Ваучер уже получен.',
          voucher,
        };
        return acc;
      }, {});

      if (Object.keys(nextStates).length > 0) {
        setClaimStates((current) => ({ ...nextStates, ...current }));
      }
    }

    void hydrateClaimedOffers();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, listingId, offers]);

  const setOfferState = (offerId: string, state: ClaimState) => {
    setClaimStates((current) => ({ ...current, [offerId]: state }));
  };

  const handleClaim = async (offer: RfRieltListingOfferDto) => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setOfferState(offer.id, { status: 'error', message: 'Войдите, чтобы получить ваучер.', voucher: null });
      return;
    }

    setOfferState(offer.id, { status: 'loading', message: null, voucher: null });

    try {
      const currentVouchers = await fetchMyVouchers();
      const existingVoucher = currentVouchers?.items.find(
        (voucher) => isListingVoucherForOffer(voucher, offer.id, listingId)
      );
      if (existingVoucher) {
        setOfferState(offer.id, {
          status: 'success',
          message: 'Ваучер уже получен.',
          voucher: existingVoucher,
        });
        return;
      }

      const result = await claimRfRieltListingOffer(listingId, offer.id, {
        attribution: buildRfClaimAttributionPayload('rielt_offer_detail'),
      });
      setOfferState(offer.id, {
        status: 'success',
        message: result.idempotentReplay ? 'Ваучер уже получен.' : 'Ваучер получен.',
        voucher: result.voucher,
      });
    } catch (error) {
      setOfferState(offer.id, { status: 'error', message: getErrorMessage(error), voucher: null });
    }
  };

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {offers.map((offer) => {
        const typeLabel = getOfferTypeLabel(offer.type);
        const claimState = claimStates[offer.id] ?? createInitialClaimState();
        const isLoading = claimState.status === 'loading';
        const isSuccess = claimState.status === 'success';

        return (
          <article key={offer.id} className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">{typeLabel}</p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-900">{offer.title}</h2>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                  {isSuccess ? 'Получен' : 'Доступен'}
                </span>
              </div>

              {offer.description ? <p className="text-sm text-slate-600">{offer.description}</p> : null}

              <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 px-3 py-3">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Выгода</h3>
                <p className="mt-1 text-sm font-medium text-emerald-950">{getOfferBenefit(offer)}</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Условия</h3>
                <p className="mt-1 text-sm text-slate-700">{getOfferConditions(offer)}</p>
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-3">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-blue-800">Как это работает</h3>
                <ol className="mt-2 list-decimal space-y-1 pl-4 text-sm text-blue-950">
                  <li>Выберите подходящий ваучер для этого объекта.</li>
                  <li>Оформление происходит в RF Asia.</li>
                  <li>После получения вы сможете связаться по объекту и показать ваучер.</li>
                </ol>
              </div>

              {claimState.message ? (
                <div
                  className={
                    claimState.status === 'success'
                      ? 'rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-950'
                      : 'rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-950'
                  }
                >
                  <p className="font-semibold">{claimState.message}</p>
                  {claimState.status === 'success' ? (
                    <>
                      <p className="mt-1">Выгода относится к объекту: {listingTitle}.</p>
                      <p className="mt-1">Свяжитесь с представителем объекта и покажите ваучер.</p>
                      <PostClaimActions returnHref={returnHref} partnerHref={partnerHref} />
                    </>
                  ) : claimState.message === 'Войдите, чтобы получить ваучер.' ? (
                    <Link href="/sign-in" className="mt-2 inline-flex text-xs font-semibold text-amber-900 underline">
                      Перейти ко входу
                    </Link>
                  ) : null}
                </div>
              ) : null}
            </div>

            <button
              type="button"
              disabled={!isLoaded || isLoading || isSuccess}
              onClick={() => void handleClaim(offer)}
              className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
            >
              {isLoading ? 'Оформляем...' : isSuccess ? 'Ваучер получен' : 'Получить ваучер'}
            </button>
          </article>
        );
      })}
    </section>
  );
}
