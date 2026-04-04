import type { RfOfferDto, RfPartnerDto } from '@go2asia/sdk/rf';

export const rfLandingContent = {
  headline: 'Russian Friendly Asia',
  subheadline:
    'Подборка мест и предложений, где проще ориентироваться, получать понятный сервис и использовать полезные городские бонусы.',
  ctaPrimary: 'Смотреть предложения',
  ctaSecondary: 'Открыть партнёров',
  featuredPartnersLead: 'Подборка мест с понятным сервисом и прозрачными условиями использования предложений.',
  bestOffersLead: 'Скидки, бонусы и специальные форматы, которые уже можно использовать в живом сценарии.',
  howItWorks: [
    {
      title: 'Выберите место или предложение',
      body: 'Начните с каталога партнёров или откройте витрину актуальных офферов.',
    },
    {
      title: 'Получите ваучер',
      body: 'Авторизуйтесь и сохраните предложение в виде ваучера, если сценарий это допускает.',
    },
    {
      title: 'Используйте у партнёра',
      body: 'Покажите ваучер в точке использования и получите обещанный бонус, скидку или доступ.',
    },
  ],
} as const;

export const rfFeaturedCategories = [
  { key: 'coffee_shops', label: 'Кофейни', color: 'bg-amber-100 text-amber-800' },
  { key: 'restaurants', label: 'Рестораны', color: 'bg-rose-100 text-rose-800' },
  { key: 'family_places', label: 'Для семьи', color: 'bg-teal-100 text-teal-800' },
  { key: 'wellness', label: 'Велнес', color: 'bg-emerald-100 text-emerald-800' },
  { key: 'coworking', label: 'Коворкинг', color: 'bg-slate-200 text-slate-800' },
] as const;

export const rfMicrocopy = {
  emptyPartnersCatalog: 'Пока здесь нет партнёров. Мы скоро добавим новые места.',
  emptyOffersCatalog: 'Сейчас активных предложений нет. Проверьте позже.',
  emptyPartnerOffers: 'У этого партнёра пока нет активных предложений.',
  temporaryUnavailable: 'Раздел временно недоступен. Попробуйте повторить действие немного позже.',
  noResults: 'Ничего не найдено. Попробуйте изменить запрос или фильтры.',
  inviteOnly: 'Это предложение доступно только по приглашению.',
  proOnly: 'Это предложение доступно только для PRO-пользователей.',
  claimTemporary: 'Сейчас не удалось получить ваучер. Попробуйте ещё раз.',
  replayInfo: 'Повторный запрос может вернуть replay без создания нового ваучера.',
  missingMedia: 'Изображение скоро появится',
  supportDataNote: 'Часть контентных описаний собрана из RF asset pack и обновляется по мере развития модуля.',
  betaZonesNote: 'Публичная витрина уже live. Кабинеты партнёра и PRO остаются в beta и развиваются отдельно.',
  backToHub: 'Вернуться в RF-хаб',
  backToCatalog: 'К каталогу RF',
} as const;

const trustByRuntimeStatus: Record<string, { label: string; tone: string }> = {
  active: { label: 'Профиль активен', tone: 'bg-emerald-100 text-emerald-800' },
  archived: { label: 'Профиль архивирован', tone: 'bg-slate-200 text-slate-700' },
};

const badgeByOfferType: Record<RfOfferDto['offerType'], { label: string; tone: string }> = {
  discount: { label: 'Скидка', tone: 'bg-emerald-100 text-emerald-800' },
  bundle: { label: 'Набор', tone: 'bg-violet-100 text-violet-800' },
  gift: { label: 'Подарок', tone: 'bg-orange-100 text-orange-800' },
  access: { label: 'Доступ', tone: 'bg-sky-100 text-sky-800' },
  campaign: { label: 'Кампания', tone: 'bg-indigo-100 text-indigo-800' },
  event_related: { label: 'Событие', tone: 'bg-fuchsia-100 text-fuchsia-800' },
};

const visibilityBadge: Record<RfOfferDto['visibility'], { label: string; tone: string }> = {
  public: { label: 'Публично', tone: 'bg-slate-100 text-slate-700' },
  pro_only: { label: 'Только PRO', tone: 'bg-blue-100 text-blue-800' },
  invite_only: { label: 'По приглашению', tone: 'bg-amber-100 text-amber-800' },
};

const countryLabels: Record<string, string> = {
  country_th: 'Таиланд',
  country_vn: 'Вьетнам',
};

const cityLabels: Record<string, string> = {
  city_phuket: 'Пхукет',
  city_da_nang: 'Дананг',
};

type PartnerSupportProfile = {
  tagline: string;
  categoryLabel: string;
  story: string;
  cardTone: string;
};

const partnerProfilesByName: Record<string, PartnerSupportProfile> = {
  'Siberia Brew Phuket': {
    tagline: 'Кофе и комфортный старт дня',
    categoryLabel: 'Кофейни',
    story: 'Подходит для спокойных встреч, завтраков и коротких рабочих сессий.',
    cardTone: 'from-amber-50 to-white',
  },
  'Baikal Kitchen Phuket': {
    tagline: 'Семейный формат и понятное меню',
    categoryLabel: 'Рестораны',
    story: 'Удобный формат для обеда и ужина, особенно для семейных сценариев.',
    cardTone: 'from-rose-50 to-white',
  },
  'Lotus Care Phuket': {
    tagline: 'Велнес и восстановление',
    categoryLabel: 'Велнес',
    story: 'Спокойный формат сервиса для восстановительного и расслабляющего сценария.',
    cardTone: 'from-emerald-50 to-white',
  },
  'Mekong Stay Da Nang': {
    tagline: 'Локальное размещение и городской ритм',
    categoryLabel: 'Сервисы',
    story: 'Подходит как базовая точка для повседневных и travel-сценариев в городе.',
    cardTone: 'from-sky-50 to-white',
  },
};

export function getOfferBadge(offer: RfOfferDto): { label: string; tone: string } {
  if (offer.visibility === 'pro_only') return visibilityBadge.pro_only;
  if (offer.visibility === 'invite_only') return visibilityBadge.invite_only;
  return badgeByOfferType[offer.offerType] ?? visibilityBadge.public;
}

export function getVisibilityBadge(visibility: RfOfferDto['visibility']): { label: string; tone: string } {
  return visibilityBadge[visibility];
}

export function getPartnerTrust(partner: RfPartnerDto): { label: string; tone: string; note: string } {
  const base = trustByRuntimeStatus[partner.status] ?? trustByRuntimeStatus.active;
  if (partner.atlasPlaceId || partner.hostAtlasPlaceId) {
    return {
      label: 'Проверенный партнёр',
      tone: 'bg-emerald-100 text-emerald-800',
      note: 'Карточка дополнительно связана с точкой места и проходит как более доверенный профиль.',
    };
  }

  return {
    label: base.label,
    tone: base.tone,
    note: 'Профиль доступен в каталоге. Дополнительные атрибуты проверяются и уточняются по мере обновлений.',
  };
}

export function getPartnerLocation(partner: RfPartnerDto): string {
  const country = countryLabels[partner.countryId] ?? partner.countryId;
  const city = cityLabels[partner.cityId] ?? partner.cityId;
  return `${city}, ${country}`;
}

export function getPartnerPresentation(partner: RfPartnerDto): PartnerSupportProfile {
  return (
    partnerProfilesByName[partner.displayName] ?? {
      tagline: 'Партнёр из каталога RF Asia',
      categoryLabel: 'Локальные сервисы',
      story: 'Карточка места и предложения доступны в рамках текущего публичного среза RF Asia.',
      cardTone: 'from-slate-50 to-white',
    }
  );
}

export function getPartnerHighlights(partner: RfPartnerDto, offersCount: number): string[] {
  const profile = getPartnerPresentation(partner);
  return [
    profile.categoryLabel,
    `Локация: ${getPartnerLocation(partner)}`,
    offersCount > 0 ? `Активных предложений: ${offersCount}` : 'Новые предложения скоро добавятся',
    partner.atlasPlaceId || partner.hostAtlasPlaceId ? 'Проверка профиля расширена' : 'Профиль в процессе расширенной верификации',
  ];
}

export function getOfferSummaryLine(offer: RfOfferDto): string {
  const statusLabel = offer.status === 'active' ? 'Активно' : offer.status === 'draft' ? 'Черновик' : 'Архив';
  return `${getOfferBadge(offer).label} • ${getVisibilityBadge(offer.visibility).label} • ${statusLabel}`;
}

export function getOfferGuardText(offer: RfOfferDto): string {
  if (offer.visibility === 'pro_only') return rfMicrocopy.proOnly;
  if (offer.visibility === 'invite_only') return rfMicrocopy.inviteOnly;
  return 'Для получения ваучера нужен вход в аккаунт. Повторный запрос может вернуть replay-ответ.';
}
