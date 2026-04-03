import type { RfOfferDto, RfPartnerDto } from '@go2asia/sdk/rf';

export const rfLandingContent = {
  headline: 'Russian Friendly Asia',
  subheadline:
    'Подборка мест и предложений, где проще ориентироваться, получать понятный сервис и использовать полезные городские бонусы.',
  ctaPrimary: 'Смотреть предложения',
  ctaSecondary: 'Открыть партнёров',
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
      note: 'Есть привязка к place-идентификатору в live RF runtime.',
    };
  }

  return {
    label: base.label,
    tone: base.tone,
    note: 'Профиль в live-каталоге активен, место ещё может быть в процессе привязки.',
  };
}

export function getPartnerHighlights(partner: RfPartnerDto, offersCount: number): string[] {
  return [
    `Город: ${partner.cityId}`,
    `Активных офферов: ${offersCount}`,
    partner.atlasPlaceId ? 'Есть atlasPlace привязка' : 'Atlas привязка обновляется',
    partner.hostAtlasPlaceId ? 'Есть host place привязка' : 'Host place пока не указан',
  ];
}
