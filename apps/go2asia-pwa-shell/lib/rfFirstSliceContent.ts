import type { RfOfferDto, RfPartnerDto } from '@go2asia/sdk/rf';

/** Тексты для task-first входа: каталог мест */
export const rfCatalogContent = {
  pageTitle: 'Каталог мест',
  pageSubtitle:
    'Заведения и сервисы партнёров Russian Friendly в ЮВА. Фильтруйте по городу и формату, сразу видно, где есть активные бонусы и предложения.',
  searchPlaceholder: 'Название места, категория или район',
  sortLabel: 'Сортировка',
  viewGrid: 'Сетка',
  viewList: 'Список',
  filterCountry: 'Страна',
  filterCity: 'Город',
  filterDistrict: 'Район / зона',
  filterCategory: 'Категория',
  filterOffers: 'Предложения',
  filterOfferType: 'Тип предложения',
  filterVibe: 'Формат / атмосфера',
  filterVerified: 'Расширенная привязка к точке на карте',
  chipAll: 'Все',
  chipWithOffers: 'Есть публичные предложения',
  chipNoOffers: 'Без публичных предложений',
  resetFilters: 'Сбросить фильтры',
  resultsCount: (n: number) => `Найдено мест: ${n}`,
  offersAnchoredNote: 'Скидки и ваучеры встроены в карточки; полный список — во вкладке «Предложения».',
  crossLinkMap: 'Карта',
  crossLinkOffers: 'Все предложения',
  crossLinkHow: 'Как это работает',
} as const;

export const rfOffersCatalogContent = {
  pageTitle: 'Предложения',
  pageSubtitle:
    'Какую выгоду можно получить и у какого места: фильтруйте по городу, типу оффера и доступности. Данные — из живого RF runtime; получение ваучера в приложении пока требует отдельного сценария входа.',
  searchPlaceholder: 'Название оффера, партнёр, ключевые слова',
  sortLabel: 'Сортировка',
  filterStatus: 'Статус на витрине',
  filterVisibility: 'Доступность',
  filterPartner: 'Партнёр',
  resultsCount: (n: number) => `Найдено предложений: ${n}`,
  ctaOpenPlace: 'Открыть место',
  ctaAllOffersForPlace: 'Все офферы места',
  claimNotReadyTitle: 'Получить ваучер',
  claimNotReadyBody:
    'Онлайн-выдача ваучера в этом публичном срезе ещё не подключена как самостоятельный шаг. Сохраните оффер в «Мои ваучеры» (локально в браузере) или откройте карточку места.',
} as const;

export const rfMapPageContent = {
  pageTitle: 'Карта',
  pageSubtitle:
    'Пространственный обзор: где сосредоточены партнёры RF и в каких зонах города их проще искать. Полноценные координаты для интерактивной карты в публичном API пока не обязательны — ниже честная группировка по городу и зоне (support-слой).',
  cityLabel: 'Город / область',
  zoneHint: 'Зоны ориентировочные; точная геометрия появится с развитием Atlas + RF.',
  listTitle: 'Места на выбранной территории',
  openCatalog: 'Открыть каталог мест',
  openOffers: 'Предложения в городе',
  partnerCount: (n: number) => `${n} мест`,
} as const;

export const rfFavoritesPageContent = {
  pageTitle: 'Избранное',
  pageSubtitle:
    'Сохранённые места и предложения. Список хранится локально в этом браузере: для авторизованного пользователя он привязан к текущему аккаунту, для гостя — к этому браузеру.',
  localWarning:
    'Это не облачная синхронизация: для авторизованного пользователя список привязан к текущему аккаунту, для гостя — к этому браузеру. Очистка данных сайта или другой браузер — без этих сохранений.',
  placesTab: 'Места',
  offersTab: 'Предложения',
  emptyPlaces: 'Вы ещё не сохранили места. Добавляйте сердце на карточках в каталоге.',
  emptyOffers: 'Нет сохранённых предложений. Отметьте оффер в каталоге предложений.',
  removeHint: 'Убрать из избранного можно снова нажать на сердце в каталоге.',
} as const;

export const rfMyVouchersPageContent = {
  pageTitle: 'Мои ваучеры',
  pageSubtitle:
    'Здесь разделены полученные RF-ваучеры из аккаунта и локально сохранённые предложения для планирования.',
  localWarning:
    'Список хранится локально в этом браузере: для авторизованного пользователя он привязан к текущему аккаунту, для гостя — к этому браузеру. Это не серверный ваучер.',
  empty: 'Пока пусто. Добавьте оффер из каталога предложений кнопкой «В список».',
  statusLocal: 'Локально сохранено',
  remove: 'Убрать из списка',
  addedAt: 'Добавлено',
} as const;

export const rfHowItWorksPageContent = {
  pageTitle: 'Как это работает',
  pageSubtitle: 'Короткий onboarding по публичному контуру Russian Friendly Asia — без маркетинговой «воды».',
  sections: [
    {
      title: 'Найти место',
      body: 'Откройте «Каталог мест», воспользуйтесь поиском и фильтрами или переключитесь на «Карту» для географического обзора.',
      links: [
        { href: '/rf', label: 'Каталог мест' },
        { href: '/rf/map', label: 'Карта' },
      ],
    },
    {
      title: 'Найти выгоду',
      body: 'В разделе «Предложения» те же партнёры показаны через призму офферов: тип скидки/бонуса, доступность (public / PRO / invite), статус active/draft.',
      links: [{ href: '/rf/vouchers', label: 'Предложения' }],
    },
    {
      title: 'Сохранить',
      body: 'Избранное и «Мои ваучеры» на текущем этапе работают локально в браузере — удобно для планирования поездки, пока нет облачной синхронизации.',
      links: [
        { href: '/rf/favorites', label: 'Избранное' },
        { href: '/rf/my-vouchers', label: 'Мои ваучеры' },
      ],
    },
    {
      title: 'Использовать у партнёра',
      body: 'Показ ваучера и погашение — это сценарий с авторизацией и RF backend. Публичная витрина показывает условия; не ожидайте полного redemption flow только из гостевого режима.',
      links: [{ href: '/rf/vouchers', label: 'Смотреть предложения' }],
    },
    {
      title: 'Что уже live, что beta',
      body: 'Каталог мест, предложения и карта-обзор опираются на живой RF runtime там, где API доступен. Кабинеты партнёра и PRO — отдельные beta-поверхности. Часть описаний мест — support-layer из контент-пака.',
      links: [
        { href: '/rf/merchant', label: 'Кабинет партнёра (beta)' },
        { href: '/rf/pro', label: 'PRO кабинет (beta)' },
      ],
    },
  ],
} as const;

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
  backToHub: 'К каталогу мест',
  backToCatalog: 'К каталогу мест',
} as const;

/** Подписи к тегам атмосферы (frontend / asset pack); фильтрация только по известным партнёрам */
export const rfAtmosphereTagLabels: Record<string, string> = {
  work_friendly: 'Для работы',
  family: 'Семья',
  breakfast: 'Завтраки',
  quiet: 'Спокойно',
  evening: 'Вечер',
  stay: 'Проживание',
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
  /** Ключ для фильтра категории в каталоге */
  catalogCategoryKey: string;
  /** Район / зона (пока support-слой; в API отдельного поля нет) */
  districtLabel: string;
  /** Теги сценария использования места */
  atmosphereTags: string[];
  story: string;
  cardTone: string;
};

const partnerProfilesByName: Record<string, PartnerSupportProfile> = {
  'Siberia Brew Phuket': {
    tagline: 'Кофе и комфортный старт дня',
    categoryLabel: 'Кофейни',
    catalogCategoryKey: 'coffee_shops',
    districtLabel: 'Патонг, у моря',
    atmosphereTags: ['breakfast', 'work_friendly', 'quiet'],
    story: 'Подходит для спокойных встреч, завтраков и коротких рабочих сессий.',
    cardTone: 'from-amber-50 to-white',
  },
  'Baikal Kitchen Phuket': {
    tagline: 'Семейный формат и понятное меню',
    categoryLabel: 'Рестораны',
    catalogCategoryKey: 'restaurants',
    districtLabel: 'Патонг, центр',
    atmosphereTags: ['family', 'evening', 'breakfast'],
    story: 'Удобный формат для обеда и ужина, особенно для семейных сценариев.',
    cardTone: 'from-rose-50 to-white',
  },
  'Lotus Care Phuket': {
    tagline: 'Велнес и восстановление',
    categoryLabel: 'Велнес',
    catalogCategoryKey: 'wellness',
    districtLabel: 'Патонг',
    atmosphereTags: ['quiet', 'evening'],
    story: 'Спокойный формат сервиса для восстановительного и расслабляющего сценария.',
    cardTone: 'from-emerald-50 to-white',
  },
  'Mekong Stay Da Nang': {
    tagline: 'Локальное размещение и городской ритм',
    categoryLabel: 'Сервисы',
    catalogCategoryKey: 'services',
    districtLabel: 'Дананг, город',
    atmosphereTags: ['stay', 'work_friendly', 'quiet'],
    story: 'Подходит как базовая точка для повседневных и travel-сценариев в городе.',
    cardTone: 'from-sky-50 to-white',
  },
};

const defaultPartnerProfile: PartnerSupportProfile = {
  tagline: 'Партнёр из каталога RF Asia',
  categoryLabel: 'Локальные сервисы',
  catalogCategoryKey: 'other',
  districtLabel: 'Район уточняется',
  atmosphereTags: [],
  story: 'Карточка места и предложения доступны в рамках текущего публичного среза RF Asia.',
  cardTone: 'from-slate-50 to-white',
};

export function buildPublicActiveOffersByPartner(offers: RfOfferDto[]): Map<string, RfOfferDto[]> {
  const map = new Map<string, RfOfferDto[]>();
  for (const offer of offers) {
    if (offer.visibility !== 'public' || offer.status !== 'active') continue;
    const list = map.get(offer.partnerId) ?? [];
    list.push(offer);
    map.set(offer.partnerId, list);
  }
  return map;
}

export function partnerFeaturedScore(partner: RfPartnerDto, publicActiveByPartner: Map<string, RfOfferDto[]>): number {
  const n = publicActiveByPartner.get(partner.id)?.length ?? 0;
  return (partner.atlasPlaceId || partner.hostAtlasPlaceId ? 2 : 0) + n;
}

const catalogCategoryFilterOptions: { key: string; label: string }[] = [
  { key: 'coffee_shops', label: 'Кофейни' },
  { key: 'restaurants', label: 'Рестораны' },
  { key: 'family_places', label: 'Для семьи' },
  { key: 'wellness', label: 'Велнес' },
  { key: 'coworking', label: 'Коворкинг' },
  { key: 'services', label: 'Сервисы и жильё' },
  { key: 'other', label: 'Другое' },
];

export function getCatalogCategoryFilterOptions(): readonly { key: string; label: string }[] {
  return catalogCategoryFilterOptions;
}

export function getOfferTypePresentation(offerType: RfOfferDto['offerType']): { label: string; tone: string } {
  return badgeByOfferType[offerType] ?? { label: offerType, tone: 'bg-slate-100 text-slate-700' };
}

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

export function getRfCountryLabel(countryId: string): string {
  return countryLabels[countryId] ?? countryId;
}

export function getRfCityLabel(cityId: string): string {
  return cityLabels[cityId] ?? cityId;
}

export function getPartnerLocation(partner: RfPartnerDto): string {
  const country = getRfCountryLabel(partner.countryId);
  const city = getRfCityLabel(partner.cityId);
  return `${city}, ${country}`;
}

export function getPartnerPresentation(partner: RfPartnerDto): PartnerSupportProfile {
  return partnerProfilesByName[partner.displayName] ?? defaultPartnerProfile;
}

/** Фильтр категории места: совпадает с логикой каталога мест (включая «Для семьи» по тегу) */
export function partnerMatchesCatalogCategoryKey(partner: RfPartnerDto, key: string): boolean {
  if (key === 'all') return true;
  const profile = getPartnerPresentation(partner);
  if (key === 'family_places') {
    return profile.catalogCategoryKey === 'family_places' || profile.atmosphereTags.includes('family');
  }
  return profile.catalogCategoryKey === key;
}

/** Короткая потребительская строка без выдуманных полей API */
export function getOfferValueLine(offer: RfOfferDto): string {
  const typeLabel = getOfferTypePresentation(offer.offerType).label;
  return `${typeLabel} · ${offer.title}`;
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
