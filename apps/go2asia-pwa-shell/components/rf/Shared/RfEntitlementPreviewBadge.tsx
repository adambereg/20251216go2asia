'use client';

import { useMemo } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import {
  buildRfListingOfferEntitlementPreviewRequest,
  buildRfOfferEntitlementPreviewRequest,
  fetchRfEntitlementPreview,
  rfEntitlementPreviewFlags,
  type RfEntitlementPreviewState,
  type RfEntitlementPreviewUiState,
} from '@/lib/rfEntitlementPreview';

type OfferVisibility = 'public' | 'pro_only' | 'invite_only';
type VoucherClass = 'ordinary' | 'premium';
type ListingOfferType = 'basic' | 'premium';

export interface RfEntitlementPreviewBadgeProps {
  offerId: string;
  partnerId: string;
  listingId?: string;
  voucherClass?: VoucherClass;
  offerType?: ListingOfferType;
  offerVisibility?: OfferVisibility;
  mockScenario?: string;
  className?: string;
  previewState?: RfEntitlementPreviewUiState | null;
  allowFallbackFetch?: boolean;
}

type BadgePresentation = {
  label: string;
  toneClassName: string;
};

const BADGE_BASE_CLASSNAME = 'inline-flex rounded-full px-2 py-1 text-[11px] font-medium';

const BADGE_TONE_BY_STATE: Record<Exclude<RfEntitlementPreviewState, 'not_enabled' | 'ordinary_no_preview'>, string> = {
  available: 'bg-emerald-100 text-emerald-900',
  requires_condition: 'bg-amber-100 text-amber-900',
  checking_or_temporarily_unavailable: 'bg-slate-100 text-slate-700',
  unavailable: 'bg-slate-200 text-slate-800',
};

function resolveVoucherClass(input: Pick<RfEntitlementPreviewBadgeProps, 'voucherClass' | 'offerType'>): VoucherClass {
  if (input.voucherClass) return input.voucherClass;
  return input.offerType === 'premium' ? 'premium' : 'ordinary';
}

export function getRfEntitlementBadgePresentation(state: RfEntitlementPreviewState): BadgePresentation | null {
  if (state === 'not_enabled' || state === 'ordinary_no_preview') return null;

  if (state === 'available') {
    return {
      label: 'Preview: премиум-доступ возможен',
      toneClassName: BADGE_TONE_BY_STATE.available,
    };
  }

  if (state === 'requires_condition') {
    return {
      label: 'Preview: требуется условие доступа',
      toneClassName: BADGE_TONE_BY_STATE.requires_condition,
    };
  }

  if (state === 'checking_or_temporarily_unavailable') {
    return {
      label: 'Preview: проверка доступа выполняется',
      toneClassName: BADGE_TONE_BY_STATE.checking_or_temporarily_unavailable,
    };
  }

  return {
    label: 'Preview: премиум-доступ недоступен',
    toneClassName: BADGE_TONE_BY_STATE.unavailable,
  };
}

function buildPreviewQueryState(state: RfEntitlementPreviewState): RfEntitlementPreviewUiState {
  return {
    enabled: true,
    state,
    copy: {
      label: getRfEntitlementBadgePresentation(state)?.label ?? '',
      description: 'Информационный preview. Получение ваучера работает как раньше.',
    },
    informationalOnly: true,
    claimBehaviorUnchanged: true,
  };
}

function RfEntitlementPreviewBadgeContent({
  uiState,
  className,
}: {
  uiState: RfEntitlementPreviewUiState | null | undefined;
  className?: string;
}) {
  if (!uiState || !uiState.enabled) return null;

  const badge = getRfEntitlementBadgePresentation(uiState.state);
  if (!badge) return null;

  return (
    <span
      className={`${BADGE_BASE_CLASSNAME} ${badge.toneClassName}${className ? ` ${className}` : ''}`}
      title="Информационный preview. Получение ваучера работает как раньше."
      aria-label={`${badge.label}. Информационный preview, поведение кнопки получения не изменяется.`}
    >
      {badge.label}
    </span>
  );
}

export function RfEntitlementPreviewBadge({
  offerId,
  partnerId,
  listingId,
  voucherClass,
  offerType,
  offerVisibility = 'public',
  mockScenario,
  className,
  previewState,
  allowFallbackFetch = true,
}: RfEntitlementPreviewBadgeProps) {
  const resolvedVoucherClass = resolveVoucherClass({ voucherClass, offerType });
  const isPremiumLike = resolvedVoucherClass === 'premium' || offerType === 'premium';
  const isClientPreviewEnabled = rfEntitlementPreviewFlags.enableClientPreview;
  const canRenderPreview = isClientPreviewEnabled && isPremiumLike;

  if (!canRenderPreview) return null;
  if (!allowFallbackFetch || previewState) {
    return <RfEntitlementPreviewBadgeContent uiState={previewState} className={className} />;
  }

  return (
    <RfEntitlementPreviewBadgeFallback
      offerId={offerId}
      partnerId={partnerId}
      listingId={listingId}
      offerType={offerType}
      offerVisibility={offerVisibility}
      resolvedVoucherClass={resolvedVoucherClass}
      mockScenario={mockScenario}
      className={className}
    />
  );
}

function RfEntitlementPreviewBadgeFallback({
  offerId,
  partnerId,
  listingId,
  offerType,
  offerVisibility,
  resolvedVoucherClass,
  mockScenario,
  className,
}: {
  offerId: string;
  partnerId: string;
  listingId?: string;
  offerType?: ListingOfferType;
  offerVisibility: OfferVisibility;
  resolvedVoucherClass: VoucherClass;
  mockScenario?: string;
  className?: string;
}) {
  const { userId } = useAuth();
  const canRequestPreview = Boolean(userId);

  const request = useMemo(() => {
    if (!canRequestPreview || !userId) return null;

    if (listingId) {
      return buildRfListingOfferEntitlementPreviewRequest({
        subject: { userId },
        listingId,
        offer: {
          id: offerId,
          partnerId,
          type: offerType ?? (resolvedVoucherClass === 'premium' ? 'premium' : 'basic'),
        },
        ...(mockScenario ? { mockScenario } : {}),
      });
    }

    return buildRfOfferEntitlementPreviewRequest({
      subject: { userId },
      offer: {
        id: offerId,
        partnerId,
        visibility: offerVisibility,
      },
      voucherClass: resolvedVoucherClass,
      ...(mockScenario ? { mockScenario } : {}),
    });
  }, [canRequestPreview, listingId, mockScenario, offerId, offerType, offerVisibility, partnerId, resolvedVoucherClass, userId]);

  const { data, isFetching } = useQuery({
    queryKey: ['rf', 'entitlement-preview', 'badge', listingId ?? null, offerId, partnerId, userId ?? null, mockScenario ?? null],
    enabled: canRequestPreview && Boolean(request),
    staleTime: 30_000,
    retry: 0,
    queryFn: async () => fetchRfEntitlementPreview(request, { enabled: true }),
  });

  const uiState = data ?? (isFetching ? buildPreviewQueryState('checking_or_temporarily_unavailable') : null);
  return <RfEntitlementPreviewBadgeContent uiState={uiState} className={className} />;
}
