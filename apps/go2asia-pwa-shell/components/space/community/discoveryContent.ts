export type CommunitySectionTone = 'runtime' | 'summary' | 'reference';

export type CommunityDiscoveryItem = {
  groupId: string;
  title: string;
  shortDescription: string;
  whoFor?: string;
  whyJoin: string;
  whyRecommended?: string;
  activityHint?: string;
  membersHint?: string;
  curatorHint?: string;
  linkedContext?: string;
  ctaLabel: string;
};

export type CommunityDiscoverySection = {
  key:
    | 'recommended'
    | 'local'
    | 'thematic'
    | 'events'
    | 'quests'
    | 'pro-led';
  title: string;
  description: string;
  tone: CommunitySectionTone;
  items: CommunityDiscoveryItem[];
};

export const communityDiscoverySections: CommunityDiscoverySection[] = [
  {
    key: 'recommended',
    title: 'С чего можно начать',
    description: 'Curated picks, которые помогают мягко встроиться в подходящую группу.',
    tone: 'reference',
    items: [
      {
        groupId: 'phuket-relocation-circle',
        title: 'Phuket Relocation Circle',
        shortDescription: 'Практичное сообщество о переезде, жилье и повседневной жизни на Пхукете.',
        whoFor: 'Для новичков, кому нужен безопасный вход через relocation и daily fit.',
        whyJoin: 'Здесь проще быстро перейти от чтения к конкретным вопросам и первым связям.',
        whyRecommended: 'Подходит, если сейчас важны жильё, логистика и адаптация.',
        activityHint: 'supportive and active',
        membersHint: 'подходит для новых участников',
        curatorHint: 'Natalia Kim',
        ctaLabel: 'Открыть группу',
      },
      {
        groupId: 'asia-city-events',
        title: 'Asia City Events',
        shortDescription: 'Группа для тех, кто хочет, чтобы события превращались в живую социальную среду.',
        whoFor: 'Для тех, кто входит в город через события, встречи и afterlife вокруг них.',
        whyJoin: 'Помогает превратить интерес к meetup и событиям в регулярное участие.',
        whyRecommended: 'Хороший первый вход, если нужен более живой городской social rhythm.',
        activityHint: 'high event energy',
        membersHint: 'event-oriented group',
        linkedContext: 'Pulse / city meetups',
        ctaLabel: 'Открыть группу',
      },
      {
        groupId: 'oleg-vietnam-insiders',
        title: 'Oleg’s Vietnam Insiders',
        shortDescription: 'Curated PRO-led группа с полезными маршрутами и local insight.',
        whoFor: 'Для тех, кто ценит signal over noise и хочет curated local context.',
        whyJoin: 'Даёт быстрый вход в community layer без лишнего шума.',
        whyRecommended: 'Хороший старт для пользователей, которым важны curation и local insight.',
        activityHint: 'steady curated rhythm',
        membersHint: 'устойчивый ритм участия',
        curatorHint: 'Oleg Tran',
        ctaLabel: 'Открыть группу',
      },
    ],
  },
  {
    key: 'local',
    title: 'Локальные сообщества',
    description: 'Группы, которые помогают встроиться в ритм города или региона, а не только читать про него.',
    tone: 'summary',
    items: [
      {
        groupId: 'danang-city-life',
        title: 'Da Nang City Life',
        shortDescription: 'Повседневная жизнь, районы, места и локальные советы.',
        whoFor: 'Для тех, кто хочет встроиться в городской ритм Дананга.',
        whyJoin: 'Помогает не просто читать про город, а жить в нём.',
        activityHint: 'steady',
        membersHint: 'healthy local group',
        linkedContext: 'Atlas / city context',
        ctaLabel: 'Открыть',
      },
      {
        groupId: 'phuket-relocation-circle',
        title: 'Phuket Relocation Circle',
        shortDescription: 'Переезд, зимовка, районы, жильё и повседневная адаптация.',
        whoFor: 'Для новичков и тех, кто хочет сделать Phuket feel practical.',
        whyJoin: 'Это удобная точка входа для вопросов и первых решений.',
        activityHint: 'supportive and active',
        membersHint: 'подходит для новых участников',
        ctaLabel: 'Открыть',
      },
      {
        groupId: 'asia-city-events',
        title: 'Asia City Events',
        shortDescription: 'События, встречи, afterlife и social energy больших городов.',
        whoFor: 'Для тех, кому нужен городской social pulse.',
        whyJoin: 'Позволяет входить в город через встречи и повторяющееся участие.',
        activityHint: 'dynamic',
        membersHint: 'event-oriented group',
        linkedContext: 'Pulse / city events',
        ctaLabel: 'Открыть',
      },
    ],
  },
  {
    key: 'thematic',
    title: 'Тематические траектории',
    description: 'Вход по потребности: адаптация, городской ритм и shared exploration paths.',
    tone: 'reference',
    items: [
      {
        groupId: 'phuket-relocation-circle',
        title: 'Relocation & Daily Fit',
        shortDescription: 'Переезд, жильё, районы и practical daily fit на Пхукете.',
        whoFor: 'Для тех, кто ищет понятную картину вместо фрагментов информации.',
        whyJoin: 'Помогает быстрее перейти от хаоса к понятному local routine.',
        activityHint: 'supportive',
        ctaLabel: 'Открыть группу',
      },
      {
        groupId: 'danang-city-life',
        title: 'City Life',
        shortDescription: 'Повседневная жизнь в Дананге без туристического шума.',
        whoFor: 'Для пользователей, которым нужен everyday city layer, а не только travel mood.',
        whyJoin: 'Хорошо работает как local adaptation surface и карта живого города.',
        activityHint: 'practical',
        ctaLabel: 'Открыть группу',
      },
      {
        groupId: 'quest-phu-quoc-weekend',
        title: 'Shared Quest Exploration',
        shortDescription: 'Сообщество, где travel-квесты и маршруты проходят в shared social формате.',
        whoFor: 'Для тех, кто хочет исследовать через совместный опыт, а не в одиночку.',
        whyJoin: 'Даёт тематический вход через exploration и social participation.',
        activityHint: 'playful',
        linkedContext: 'Quest / exploration path',
        ctaLabel: 'Открыть группу',
      },
    ],
  },
  {
    key: 'events',
    title: 'Сообщества вокруг событий',
    description: 'Здесь social life продолжается после event card и превращается в recurring group participation.',
    tone: 'summary',
    items: [
      {
        groupId: 'asia-city-events',
        title: 'Asia City Events',
        shortDescription: 'События не заканчиваются карточкой: здесь начинается social afterlife.',
        whoFor: 'Для тех, кто хочет продолжения после meetup, а не разовых касаний.',
        whyJoin: 'Помогает связать event interest с регулярным community participation.',
        activityHint: 'high event energy',
        linkedContext: 'Pulse / city meetup series',
        ctaLabel: 'Открыть',
      },
    ],
  },
  {
    key: 'quests',
    title: 'Сообщества вокруг квестов',
    description: 'Quest-related social layer, где маршруты и прохождения становятся shared experience.',
    tone: 'summary',
    items: [
      {
        groupId: 'quest-phu-quoc-weekend',
        title: 'Quest Phu Quoc Weekend',
        shortDescription: 'Сообщество вокруг travel-квестов, маршрутов, отчётов и социального вдохновения.',
        whoFor: 'Для тех, кто не хочет проходить solo и ищет social context вокруг маршрутов.',
        whyJoin: 'Делает quest participation более живой и shared, а не purely mechanical.',
        activityHint: 'playful',
        linkedContext: 'Quest / weekend cluster',
        ctaLabel: 'Открыть',
      },
    ],
  },
  {
    key: 'pro-led',
    title: 'PRO-led сообщества',
    description: 'Группы с curator-driven подборкой и useful local context, без смешения с PRO operational contour.',
    tone: 'summary',
    items: [
      {
        groupId: 'oleg-vietnam-insiders',
        title: 'Oleg’s Vietnam Insiders',
        shortDescription: 'PRO-led группа с curated local insight and practical social context.',
        whoFor: 'Для тех, кому нужен полезный local map с сильным social center.',
        whyJoin: 'Группа помогает держать практический local context и регулярный social ритм.',
        curatorHint: 'Oleg Tran',
        linkedContext: 'Curated local insight',
        ctaLabel: 'Открыть',
      },
      {
        groupId: 'phuket-relocation-circle',
        title: 'Phuket Relocation Circle',
        shortDescription: 'Role-led relocation-focused group around practical Phuket fit.',
        whoFor: 'Для тех, кто хочет guidance и полезный human context вокруг relocation.',
        whyJoin: 'Группа полезна не только контентом, но и role-led social guidance.',
        curatorHint: 'Natalia Kim',
        linkedContext: 'Relocation and housing',
        ctaLabel: 'Открыть',
      },
    ],
  },
];

export const communityDiscoveryGroupIds = Array.from(
  new Set(
    communityDiscoverySections.flatMap((section) =>
      section.items.map((item) => item.groupId)
    )
  )
);
