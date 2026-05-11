'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { claimRfOffer, fetchMyVouchers } from '@go2asia/sdk/rf';
import type { RfRepeatPolicy, RfVoucherDto } from '@go2asia/sdk/rf';
import {
  getRfOfferClaimErrorMessage,
  getRfOfferClaimSuccessMessage,
  isPartnerVoucherForOffer,
  rfOfferClaimCopy,
} from '@/lib/rfOfferClaim';
import { buildRfClaimAttributionPayload, hasActiveRfProAttribution } from '@/lib/rfProAttribution';
import { getRfOfferClaimButtonLabel } from '@/lib/rfSpendSemantics';

type ClaimState =
  | { status: 'idle'; message: string | null; voucher: null }
  | { status: 'loading'; message: string | null; voucher: null }
  | { status: 'success'; message: string; voucher: RfVoucherDto }
  | { status: 'error'; message: string; voucher: null };

function initialClaimState(): ClaimState {
  return { status: 'idle', message: null, voucher: null };
}

export function ClaimRfOfferButton({
  offerId,
  repeatPolicy = 'once_per_scope',
  pointsCost,
}: {
  offerId: string;
  repeatPolicy?: RfRepeatPolicy;
  pointsCost?: number;
}) {
  const { isLoaded, isSignedIn } = useAuth();
  const [state, setState] = useState<ClaimState>(initialClaimState);
  const [hasProAttribution, setHasProAttribution] = useState(false);
  const isLoading = state.status === 'loading';
  const isSuccess = state.status === 'success';

  useEffect(() => {
    setHasProAttribution(hasActiveRfProAttribution());
  }, []);

  async function handleClaim() {
    if (!isLoaded || isLoading || isSuccess) return;
    if (!isSignedIn) {
      setState({ status: 'error', message: rfOfferClaimCopy.authRequired, voucher: null });
      return;
    }

    setState({ status: 'loading', message: null, voucher: null });

    try {
      const currentVouchers = await fetchMyVouchers();
      const existingVoucher = currentVouchers?.items.find((voucher) => isPartnerVoucherForOffer(voucher, offerId, repeatPolicy));
      if (existingVoucher) {
        setState({ status: 'success', message: rfOfferClaimCopy.alreadyClaimed, voucher: existingVoucher });
        return;
      }

      const result = await claimRfOffer(offerId, {
        attribution: buildRfClaimAttributionPayload('public_rf_catalog'),
      });
      setState({ status: 'success', message: getRfOfferClaimSuccessMessage(result), voucher: result.voucher });
    } catch (error) {
      setState({ status: 'error', message: getRfOfferClaimErrorMessage(error), voucher: null });
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={!isLoaded || isLoading || isSuccess}
        onClick={() => void handleClaim()}
        className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-3 py-2 text-center text-xs font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400 sm:w-auto"
      >
        {isLoading
          ? rfOfferClaimCopy.buttonLoading
          : isSuccess
            ? rfOfferClaimCopy.buttonSuccess
            : getRfOfferClaimButtonLabel({ pointsCost })}
      </button>

      {state.message ? (
        <div
          className={
            isSuccess
              ? 'rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-950'
              : 'rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950'
          }
        >
          <p className="font-semibold">{state.message}</p>
          {isSuccess ? (
            <>
              <p className="mt-1">{rfOfferClaimCopy.successHint}</p>
              <Link href="/rf/my-vouchers" className="mt-2 inline-flex font-semibold text-emerald-900 underline">
                {rfOfferClaimCopy.myVouchersLink}
              </Link>
            </>
          ) : state.message === rfOfferClaimCopy.authRequired ? (
            <Link href="/sign-in" className="mt-2 inline-flex font-semibold text-amber-900 underline">
              {rfOfferClaimCopy.signInLink}
            </Link>
          ) : null}
        </div>
      ) : null}

      {hasProAttribution && !state.message ? (
        <p className="text-xs text-slate-500">Оффер открыт по PRO-ссылке. Атрибуция фиксируется только после получения ваучера.</p>
      ) : null}
    </div>
  );
}
