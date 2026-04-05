import type { RfOfferDto, RfPartnerDto } from '@go2asia/sdk/rf';
import {
  buildPublicActiveOffersByPartner,
  getPartnerLocation,
  getPartnerPresentation,
  getPartnerTrust,
} from '@/lib/rfFirstSliceContent';

export type MerchantReadinessItem = {
  id: string;
  label: string;
  ok: boolean;
  hint: string;
};

export type MerchantNextStep = {
  id: string;
  title: string;
  detail: string;
  href?: string;
  actionLabel?: string;
};

/** Честный readiness без выдуманных правил валидации — только то, что следует из DTO + support-профиля */
export function buildMerchantReadiness(partner: RfPartnerDto | null, offersForPartner: RfOfferDto[]): MerchantReadinessItem[] {
  if (!partner) {
    return [
      {
        id: 'rf_partner_exists',
        label: 'Партнёрская карточка в RF',
        ok: false,
        hint: 'Пока нет партнёра, привязанного к вашему аккаунту. Создайте карточку (beta) или дождитесь операций со стороны RF.',
      },
    ];
  }

  const publicActive = offersForPartner.filter((o) => o.status === 'active' && o.visibility === 'public').length;
  const anyActive = offersForPartner.some((o) => o.status === 'active');
  const hasAtlas = Boolean(partner.atlasPlaceId || partner.hostAtlasPlaceId);
  const profile = getPartnerPresentation(partner);
  const trust = getPartnerTrust(partner);

  return [
    {
      id: 'status_active',
      label: 'Статус профиля в RF',
      ok: partner.status === 'active',
      hint:
        partner.status === 'active'
          ? 'Профиль помечен как активный в runtime.'
          : 'Профиль не в статусе active — уточните условия публикации в RF.',
    },
    {
      id: 'public_listing',
      label: 'Место отображается в публичном каталоге',
      ok: partner.status === 'active',
      hint: 'Публичный каталог `/rf` читает те же данные API; при active карточка доступна по ссылке из блока «Публичное представление».',
    },
    {
      id: 'atlas_link',
      label: 'Расширенная привязка к точке (Atlas ID)',
      ok: hasAtlas,
      hint: hasAtlas
        ? 'Задан atlasPlaceId и/или hostAtlasPlaceId — для пользователей это сигнал доверия.'
        : 'Без привязки к точке в кабинете сложнее подтвердить «где на карте» место; поле опционально в API.',
    },
    {
      id: 'public_offers',
      label: 'Есть публичные активные предложения',
      ok: publicActive > 0,
      hint:
        publicActive > 0
          ? `На витрине: ${publicActive} публичных активных.`
          : anyActive
            ? 'Есть активные офферы, но ни один не публичный — проверьте visibility.'
            : 'Нет активных предложений или все в черновике — добавьте оффер в RF ops-процессе (не из этого UI).',
    },
    {
      id: 'support_copy',
      label: 'Контент карточки (support-слой / asset pack)',
      ok: Boolean(partnerProfilesIsEnriched(partner)),
      hint: partnerProfilesIsEnriched(partner)
        ? 'Для этого места есть расширенное описание в support-профиле (категория, зона, теги).'
        : 'Расширенные описания в UI опираются на support-профиль по имени; для неизвестых партнёров — базовые заглушки.',
    },
    {
      id: 'trust_signal',
      label: 'Индикатор доверия на витрине',
      ok: trust.label.includes('Проверен') || hasAtlas,
      hint: trust.note,
    },
  ];
}

function partnerProfilesIsEnriched(partner: RfPartnerDto): boolean {
  const p = getPartnerPresentation(partner);
  return p.catalogCategoryKey !== 'other' || (p.atmosphereTags?.length ?? 0) > 0;
}

export function buildMerchantNextSteps(
  partner: RfPartnerDto | null,
  offersForPartner: RfOfferDto[],
  userHasPartner: boolean,
): MerchantNextStep[] {
  const steps: MerchantNextStep[] = [];

  if (!userHasPartner || !partner) {
    steps.push({
      id: 'create_partner',
      title: 'Создать или получить партнёрскую карточку',
      detail:
        'Используйте форму создания (live API beta) ниже на странице или дождитесь назначения владельца на стороне RF.',
    });
    return steps;
  }

  const publicActive = offersForPartner.filter((o) => o.status === 'active' && o.visibility === 'public').length;
  const profile = getPartnerPresentation(partner);

  steps.push({
    id: 'check_public_card',
    title: 'Проверить публичную карточку',
    detail: 'Убедитесь, что название, локация и описание на витрине совпадают с вашими ожиданиями.',
    href: `/rf/${encodeURIComponent(partner.id)}`,
    actionLabel: 'Открыть как гость',
  });

  if (publicActive === 0) {
    steps.push({
      id: 'improve_offers',
      title: 'Подготовить публичные предложения',
      detail:
        'Создание/публикация офферов сейчас не выполняется из этого кабинета; планируйте изменения через RF ops или следующие этапы продукта.',
      href: `/rf/vouchers?partner=${encodeURIComponent(partner.id)}`,
      actionLabel: 'Как видят гости',
    });
  }

  if (!partner.atlasPlaceId && !partner.hostAtlasPlaceId) {
    steps.push({
      id: 'atlas_optional',
      title: 'Рассмотреть привязку к точке Atlas',
      detail: 'Повышает доверие в каталоге. Значения задаются через API/ops, не через этот экран.',
    });
  }

  steps.push({
    id: 'review_support_story',
    title: 'Согласовать текстовое описание',
    detail: `Текущий support-текст: «${profile.tagline}». При смене бренда сообщите RF для обновления контент-слоя.`,
  });

  steps.push({
    id: 'beta_limits',
    title: 'Учитывать ограничения beta-кабинета',
    detail:
      'Редактирование профиля, офферов и медиа из UI не сохраняется здесь. Действия ниже — ориентиры, а не CRM.',
  });

  return steps;
}

export function summarizeMerchantPartner(
  partner: RfPartnerDto,
  allOffers: RfOfferDto[],
): {
  offersForPartner: RfOfferDto[];
  publicActiveCount: number;
  totalOffers: number;
  activeAnyVisibility: number;
} {
  const offersForPartner = allOffers.filter((o) => o.partnerId === partner.id);
  const pubMap = buildPublicActiveOffersByPartner(allOffers);
  const publicActiveCount = pubMap.get(partner.id)?.length ?? 0;
  return {
    offersForPartner,
    publicActiveCount,
    totalOffers: offersForPartner.length,
    activeAnyVisibility: offersForPartner.filter((o) => o.status === 'active').length,
  };
}
