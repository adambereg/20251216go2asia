import type { RfOfferDto, RfPartnerDto, RfProAttributedVoucherDto, RfProLinkDto } from '@go2asia/sdk/rf';
import {
  buildPublicActiveOffersByPartner,
  getPartnerPresentation,
  getPartnerTrust,
} from './rfFirstSliceContent';
import { getRfVoucherEffectiveStatus } from './rfVoucherLifecycle';

export type ProScopeResolution = {
  partners: RfPartnerDto[];
  isDerivedScope: boolean;
  reason: string;
};

export type ProFocusItem = {
  id: string;
  title: string;
  detail: string;
  severity: 'info' | 'warn' | 'ok';
  partnerId?: string;
};

export type ProNextStep = {
  id: string;
  title: string;
  detail: string;
  href?: string;
  actionLabel?: string;
};

export const proAttributedVouchersLabel = 'Ваучеры с PRO-отметкой';
export const proAttributedVouchersBoundaryCopy =
  'Read-only tracking: блок показывает связь PRO ↔ ваучер и источник получения. Это не начисления и не денежный учёт.';
export const proAttributedVouchersFutureCopy =
  'Финансовый слой PRO будет подключаться отдельно в будущих slices.';
export const proAttributedVouchersEmptyState = 'Пока нет ваучеров с подтверждённой PRO-отметкой.';

export function getActiveLinkedPartnerIds(proLinks: Array<Pick<RfProLinkDto, 'partnerId' | 'status'>>): string[] {
  return Array.from(new Set(proLinks.filter((link) => link.status === 'active').map((link) => link.partnerId)));
}

export function getLinkedPartnerOffers(offers: RfOfferDto[], activePartnerIds: Iterable<string>): RfOfferDto[] {
  const activePartnerIdSet = new Set(activePartnerIds);
  return offers
    .filter((offer) => activePartnerIdSet.has(offer.partnerId))
    .sort((a, b) => {
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (a.status !== 'active' && b.status === 'active') return 1;
      return Date.parse(b.createdAt) - Date.parse(a.createdAt);
    });
}

export function formatOfferVisibilityLabel(visibility: RfOfferDto['visibility']): string {
  if (visibility === 'pro_only') return 'Доступно для PRO';
  if (visibility === 'invite_only') return 'По приглашению';
  return 'Публично';
}

export function sortProAttributedVouchers(items: RfProAttributedVoucherDto[]): RfProAttributedVoucherDto[] {
  return [...items].sort((a, b) => {
    const timeDiff = Date.parse(b.claimedAt) - Date.parse(a.claimedAt);
    if (timeDiff !== 0) return timeDiff;
    return b.voucherId.localeCompare(a.voucherId);
  });
}

export function getProAttributedVoucherStatusLabel(
  voucher: Pick<RfProAttributedVoucherDto, 'status' | 'canonicalStatus'>
): string {
  const status = getRfVoucherEffectiveStatus(voucher);
  if (status === 'redeemed') return 'Использован';
  if (status === 'cancelled') return 'Недоступен';
  if (status === 'expired') return 'Истёк';
  if (status === 'locked') return 'Получен, но не активен';
  if (status === 'unlocked') return 'Можно получить снова';
  return 'Активен';
}

export function getProAttributedVoucherScopeLabel(claimScope: RfProAttributedVoucherDto['claimScope']): string {
  return claimScope === 'listing' ? 'Для объекта' : 'Оффер партнёра';
}

export function getProAttributedVoucherAttributionLabel(
  status: RfProAttributedVoucherDto['attributionStatus']
): string {
  return status === 'confirmed' ? 'PRO-отметка подтверждена' : 'PRO-отметка уточняется';
}

export function getProAttributedVoucherClaimSourceLabel(source: RfProAttributedVoucherDto['claimSource']): string {
  if (source === 'pro_shared_link') return 'PRO-ссылка';
  if (source === 'rielt_offer_detail') return 'Страница объекта';
  if (source === 'public_offer_detail') return 'Карточка оффера';
  if (source === 'public_rf_catalog') return 'RF-каталог';
  return 'RF';
}

/**
 * На текущем этапе нет гарантированной live-модели assignment PRO->partner.
 * Алгоритм:
 * 1) Если есть офферы, созданные текущим user (createdByUserId == userId), считаем их "моим scope".
 * 2) Иначе используем derived support-scope: топ active партнёров по числу публичных active офферов.
 */
export function resolveProScope(
  userId: string | null | undefined,
  partners: RfPartnerDto[],
  offers: RfOfferDto[],
  maxFallbackPartners = 5,
): ProScopeResolution {
  if (!userId) {
    return {
      partners: [],
      isDerivedScope: true,
      reason: 'Пользователь не определён; scope не собран.',
    };
  }

  const createdPartnerIds = new Set(
    offers.filter((offer) => offer.createdByUserId === userId).map((offer) => offer.partnerId),
  );

  if (createdPartnerIds.size > 0) {
    return {
      partners: partners.filter((partner) => createdPartnerIds.has(partner.id)),
      isDerivedScope: false,
      reason: 'Scope получен из офферов, где createdByUserId совпадает с текущим user.',
    };
  }

  const publicActiveMap = buildPublicActiveOffersByPartner(offers);
  const fallbackPartners = [...partners]
    .filter((partner) => partner.status === 'active')
    .sort((a, b) => (publicActiveMap.get(b.id)?.length ?? 0) - (publicActiveMap.get(a.id)?.length ?? 0))
    .slice(0, maxFallbackPartners);

  return {
    partners: fallbackPartners,
    isDerivedScope: true,
    reason:
      'Live assignment PRO->partner в API пока не подтверждён; используется derived support-scope (active партнёры по публичным офферам).',
  };
}

export function summarizeProScope(scopePartners: RfPartnerDto[], offers: RfOfferDto[]) {
  const scopeIds = new Set(scopePartners.map((partner) => partner.id));
  const offersInScope = offers.filter((offer) => scopeIds.has(offer.partnerId));
  const publicActiveMap = buildPublicActiveOffersByPartner(offersInScope);

  const totalPartners = scopePartners.length;
  const totalOffers = offersInScope.length;
  const publicActiveOffers = offersInScope.filter(
    (offer) => offer.status === 'active' && offer.visibility === 'public',
  ).length;
  const partnersWithoutPublicOffers = scopePartners.filter(
    (partner) => (publicActiveMap.get(partner.id)?.length ?? 0) === 0,
  ).length;

  const partnersNeedAttention = scopePartners.filter((partner) => {
    const profile = getPartnerPresentation(partner);
    const hasAtlas = Boolean(partner.atlasPlaceId || partner.hostAtlasPlaceId);
    const hasPublic = (publicActiveMap.get(partner.id)?.length ?? 0) > 0;
    return !hasAtlas || !hasPublic || profile.catalogCategoryKey === 'other';
  }).length;

  return {
    offersInScope,
    publicActiveMap,
    totalPartners,
    totalOffers,
    publicActiveOffers,
    partnersWithoutPublicOffers,
    partnersNeedAttention,
  };
}

export function buildProFocusItems(scopePartners: RfPartnerDto[], offers: RfOfferDto[]): ProFocusItem[] {
  const summary = summarizeProScope(scopePartners, offers);
  const items: ProFocusItem[] = [];

  for (const partner of scopePartners) {
    const publicCount = summary.publicActiveMap.get(partner.id)?.length ?? 0;
    const hasAtlas = Boolean(partner.atlasPlaceId || partner.hostAtlasPlaceId);
    const profile = getPartnerPresentation(partner);

    if (publicCount === 0) {
      items.push({
        id: `no_public_${partner.id}`,
        title: `${partner.displayName}: нет публичных офферов`,
        detail: 'Партнёр есть в scope, но в public контуре не видны активные выгоды.',
        severity: 'warn',
        partnerId: partner.id,
      });
    }

    if (!hasAtlas) {
      items.push({
        id: `no_atlas_${partner.id}`,
        title: `${partner.displayName}: нет привязки к точке Atlas`,
        detail: 'Карточка работает, но гео-доверие и spatial UX ограничены.',
        severity: 'info',
        partnerId: partner.id,
      });
    }

    if (profile.catalogCategoryKey === 'other') {
      items.push({
        id: `profile_other_${partner.id}`,
        title: `${partner.displayName}: базовый support-профиль`,
        detail: 'Категория/описание в support-слое требуют уточнения для stronger public view.',
        severity: 'info',
        partnerId: partner.id,
      });
    }
  }

  if (items.length === 0 && scopePartners.length > 0) {
    items.push({
      id: 'all_good',
      title: 'Критичных gaps по текущим эвристикам не найдено',
      detail: 'Проверьте вручную публичную витрину и офферы перед следующими итерациями.',
      severity: 'ok',
    });
  }

  return items.slice(0, 8);
}

export function buildProNextSteps(
  scopePartners: RfPartnerDto[],
  offers: RfOfferDto[],
  isDerivedScope: boolean,
): ProNextStep[] {
  const summary = summarizeProScope(scopePartners, offers);
  const firstPartner = scopePartners[0];
  const steps: ProNextStep[] = [];

  if (isDerivedScope) {
    steps.push({
      id: 'clarify_scope',
      title: 'Уточнить фактический PRO scope',
      detail:
        'Сейчас список партнёров вычисляется как поддерживающий fallback. Нужна явная модель связи PRO и партнёра.',
    });
  }

  if (summary.partnersWithoutPublicOffers > 0) {
    steps.push({
      id: 'improve_public_offers',
      title: 'Усилить публичные офферы партнёров без выдачи',
      detail: `В scope есть партнёры без публичных активных офферов: ${summary.partnersWithoutPublicOffers}.`,
      href: '/rf/vouchers',
      actionLabel: 'Проверить public каталог',
    });
  }

  if (firstPartner) {
    steps.push({
      id: 'review_public_cards',
      title: 'Сверить карточки партнёров как их видят гости',
      detail: 'Проверьте описания, теги и trust-сигналы в публичном RF.',
      href: `/rf/${encodeURIComponent(firstPartner.id)}`,
      actionLabel: 'Открыть карточку',
    });
  }

  steps.push({
    id: 'note_beta_limits',
    title: 'Учитывать ограничения PRO beta',
    detail:
      'Этот кабинет не содержит автоматизацию assignment, расширенную аналитику и экономику PRO. Это рабочий baseline для следующего этапа.',
  });

  return steps;
}

export function getPartnerProHealth(partner: RfPartnerDto, publicActiveCount: number) {
  const trust = getPartnerTrust(partner);
  const profile = getPartnerPresentation(partner);
  const hasAtlas = Boolean(partner.atlasPlaceId || partner.hostAtlasPlaceId);
  return {
    trust,
    profile,
    hasAtlas,
    needsAttention: publicActiveCount === 0 || !hasAtlas || profile.catalogCategoryKey === 'other',
  };
}
