import { customInstance } from '@go2asia/sdk/mutator';
import type { RfOfferDto, RfRieltListingOfferDto } from '@go2asia/sdk/rf';
import type { EntitlementReadRequest, EntitlementReadResponse } from './rfEntitlementReadApiDesign';

export const rfEntitlementPreviewFlags = {
  enableClientPreview: process.env.NEXT_PUBLIC_RF_ENABLE_ENTITLEMENT_PREVIEW === 'true',
} as const;

export type RfEntitlementPreviewState =
  | 'not_enabled'
  | 'available'
  | 'requires_condition'
  | 'checking_or_temporarily_unavailable'
  | 'ordinary_no_preview'
  | 'unavailable';

export type RfEntitlementPreviewCopy = {
  label: string;
  description: string;
};

export type RfEntitlementPreviewUiState = {
  enabled: boolean;
  state: RfEntitlementPreviewState;
  copy: RfEntitlementPreviewCopy;
  informationalOnly: true;
  claimBehaviorUnchanged: true;
};

export type RfEntitlementPreviewProxyResponse = {
  state: RfEntitlementPreviewState;
  label: string;
  caption: string;
  informationalOnly: true;
  claimBehaviorUnchanged: true;
  missingRequirementLabels?: string[];
  isTemporary?: boolean;
  isPremiumPreview?: boolean;
  updatedAt?: string;
};

export type RfEntitlementPreviewSubject = {
  userId: string;
  roleHints?: string[];
  statusHints?: string[];
};

export type RfEntitlementPreviewOfferInput = {
  subject: RfEntitlementPreviewSubject | null;
  offer: Pick<RfOfferDto, 'id' | 'partnerId' | 'visibility'> & Partial<Pick<RfOfferDto, 'offerType'>>;
  voucherClass?: 'ordinary' | 'premium';
  mockScenario?: string;
};

export type RfEntitlementPreviewListingOfferInput = {
  subject: RfEntitlementPreviewSubject | null;
  listingId: string;
  offer: Pick<RfRieltListingOfferDto, 'id' | 'partnerId' | 'type'>;
  mockScenario?: string;
};

type PreviewExecutor = (request: EntitlementReadRequest, path: string) => Promise<RfEntitlementPreviewProxyResponse>;

export const RF_ENTITLEMENT_PREVIEW_PROXY_PATH = '/v1/rf/entitlement/preview';

export const rfEntitlementPreviewCopyByState: Record<RfEntitlementPreviewState, RfEntitlementPreviewCopy> = {
  not_enabled: {
    label: 'Премиум-проверка не включена',
    description: 'Информационный preview выключен. Получение ваучера работает как раньше.',
  },
  available: {
    label: 'Премиум-доступ доступен',
    description: 'Это информационный preview. Финальное получение ваучера в этом этапе не меняется.',
  },
  requires_condition: {
    label: 'Требуется условие',
    description: 'Preview показывает условие доступа. Получение ваучера пока не блокируется entitlement-проверкой.',
  },
  checking_or_temporarily_unavailable: {
    label: 'Проверка доступа выполняется',
    description: 'Доступ временно уточняется. Это не меняет текущее поведение кнопки получения.',
  },
  ordinary_no_preview: {
    label: 'Обычный ваучер доступен без премиум-проверки',
    description: 'Для обычного ваучера entitlement preview не применяется.',
  },
  unavailable: {
    label: 'Премиум-доступ недоступен',
    description: 'Preview не смог подтвердить доступ. Это не является runtime enforcement.',
  },
};

function createPreviewUiState(state: RfEntitlementPreviewState, enabled: boolean): RfEntitlementPreviewUiState {
  return {
    enabled,
    state,
    copy: rfEntitlementPreviewCopyByState[state],
    informationalOnly: true,
    claimBehaviorUnchanged: true,
  };
}

function getRequestId(prefix: string, resourceId: string, userId: string | null): string {
  return `${prefix}:${resourceId}:${userId ?? 'anonymous'}`;
}

function isPreviewEnabled(explicitEnabled?: boolean): boolean {
  return explicitEnabled ?? rfEntitlementPreviewFlags.enableClientPreview;
}

export function buildRfOfferEntitlementPreviewRequest(input: RfEntitlementPreviewOfferInput): EntitlementReadRequest | null {
  if (!input.subject) return null;

  return {
    requestId: getRequestId('rf-offer-preview', input.offer.id, input.subject.userId),
    subject: input.subject,
    resource: {
      kind: input.voucherClass === 'premium' ? 'rf_premium_voucher' : 'rf_offer',
      offerId: input.offer.id,
      partnerId: input.offer.partnerId,
    },
    action: 'claim',
    evaluationMode: 'claim_preview',
    context: {
      rf: {
        offerId: input.offer.id,
        partnerId: input.offer.partnerId,
        voucherClass: input.voucherClass ?? 'ordinary',
        offerVisibility: input.offer.visibility,
      },
      ...(input.mockScenario ? { mockScenario: input.mockScenario } : {}),
    },
    includeAuditTrace: false,
    includeSafeLabels: true,
  };
}

export function buildRfListingOfferEntitlementPreviewRequest(input: RfEntitlementPreviewListingOfferInput): EntitlementReadRequest | null {
  if (!input.subject) return null;

  return {
    requestId: getRequestId('rf-listing-offer-preview', `${input.listingId}:${input.offer.id}`, input.subject.userId),
    subject: input.subject,
    resource: {
      kind: 'rf_listing_offer',
      offerId: input.offer.id,
      partnerId: input.offer.partnerId,
      listingId: input.listingId,
    },
    action: 'claim',
    evaluationMode: 'claim_preview',
    context: {
      rf: {
        offerId: input.offer.id,
        partnerId: input.offer.partnerId,
        listingId: input.listingId,
        voucherClass: input.offer.type === 'premium' ? 'premium' : 'ordinary',
      },
      ...(input.mockScenario ? { mockScenario: input.mockScenario } : {}),
    },
    includeAuditTrace: false,
    includeSafeLabels: true,
  };
}

export function mapEntitlementReadResponseToPreviewState(response: Pick<EntitlementReadResponse, 'decision' | 'reasonCode' | 'degradedMode' | 'stale'>): RfEntitlementPreviewState {
  if (response.reasonCode === 'ordinary_resource_no_gate' || response.decision === 'not_applicable') return 'ordinary_no_preview';
  if (response.decision === 'granted' && response.degradedMode === 'none' && !response.stale) return 'available';
  if (response.reasonCode === 'invite_required' || response.reasonCode === 'nft_required' || response.reasonCode === 'milestone_required') {
    return 'requires_condition';
  }
  if (
    response.decision === 'pending' ||
    response.degradedMode === 'timeout_fallback' ||
    response.degradedMode === 'stale_cache' ||
    response.degradedMode === 'partial_sources' ||
    response.reasonCode === 'source_timeout' ||
    response.reasonCode === 'source_unavailable' ||
    response.reasonCode === 'temporarily_unavailable'
  ) {
    return 'checking_or_temporarily_unavailable';
  }
  return 'unavailable';
}

export function toRfEntitlementPreviewUiState(response: EntitlementReadResponse): RfEntitlementPreviewUiState {
  return createPreviewUiState(mapEntitlementReadResponseToPreviewState(response), true);
}

export function sanitizeEntitlementPreviewForUi(response: EntitlementReadResponse): RfEntitlementPreviewUiState {
  return toRfEntitlementPreviewUiState(response);
}

export function sanitizeEntitlementPreviewProxyForUi(response: RfEntitlementPreviewProxyResponse): RfEntitlementPreviewUiState {
  const state = response.state in rfEntitlementPreviewCopyByState ? response.state : 'unavailable';
  return {
    enabled: true,
    state,
    copy: {
      label: response.label || rfEntitlementPreviewCopyByState[state].label,
      description: response.caption || rfEntitlementPreviewCopyByState[state].description,
    },
    informationalOnly: true,
    claimBehaviorUnchanged: true,
  };
}

export async function fetchRfEntitlementPreview(
  request: EntitlementReadRequest | null,
  options: { enabled?: boolean; executor?: PreviewExecutor } = {},
): Promise<RfEntitlementPreviewUiState> {
  if (!isPreviewEnabled(options.enabled) || !request) {
    return createPreviewUiState('not_enabled', false);
  }

  try {
    const response = options.executor
      ? await options.executor(request, RF_ENTITLEMENT_PREVIEW_PROXY_PATH)
      : await customInstance<RfEntitlementPreviewProxyResponse>(
          {
            method: 'POST',
            body: JSON.stringify(request),
            headers: { 'Content-Type': 'application/json' },
          },
          RF_ENTITLEMENT_PREVIEW_PROXY_PATH,
        );
    return sanitizeEntitlementPreviewProxyForUi(response);
  } catch {
    return createPreviewUiState('checking_or_temporarily_unavailable', true);
  }
}

export function assertNoUnsafeVocabularyInEntitlementPreviewCopy(copy: string): boolean {
  return !/\b(wallet|chain|tx|nft contract|balance|payout|reward|debit|compensation|recovery|adapter|raw source|audit trace)\b/i.test(copy);
}

export function buildClaimPayloadWithoutEntitlementPreview<T extends Record<string, unknown>>(payload: T): T {
  return { ...payload };
}

