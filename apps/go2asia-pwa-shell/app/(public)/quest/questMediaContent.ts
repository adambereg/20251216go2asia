import { resolveMediaUrl } from '@go2asia/sdk/media';

type QuestMediaContent = {
  coverKey: string;
  coverAlt: string;
  gallery: Array<{ key: string; alt: string }>;
  steps: Record<string, { key: string; alt: string }>;
};

const QUEST_MEDIA_BY_ID: Record<string, QuestMediaContent> = {
  quest_phuket_old_town_001: {
    coverKey: 'quests/phuket/morning-walk-through-old-phuket/cover.jpg',
    coverAlt: 'Утренние улицы Старого города Пхукета',
    gallery: [
      { key: 'quests/phuket/morning-walk-through-old-phuket/gallery/01.jpg', alt: 'Пастельные фасады Старого города' },
      { key: 'quests/phuket/morning-walk-through-old-phuket/gallery/02.jpg', alt: 'Финальная площадь маршрута' },
    ],
    steps: {
      step_phuket_old_town_001: {
        key: 'quests/phuket/morning-walk-through-old-phuket/steps/step_phuket_old_town_001/01.jpg',
        alt: 'Стартовая точка маршрута',
      },
      step_phuket_old_town_002: {
        key: 'quests/phuket/morning-walk-through-old-phuket/steps/step_phuket_old_town_002/01.jpg',
        alt: 'Фото-этап в Старом городе',
      },
      step_phuket_old_town_003: {
        key: 'quests/phuket/morning-walk-through-old-phuket/steps/step_phuket_old_town_003/01.jpg',
        alt: 'Финишная точка маршрута',
      },
    },
  },
  quest_sunset_viewpoint_002: {
    coverKey: 'quests/phuket/sunset-viewpoint-photo-task/cover.jpg',
    coverAlt: 'Закатный вид с обзорной площадки Пхукета',
    gallery: [
      { key: 'quests/phuket/sunset-viewpoint-photo-task/gallery/01.jpg', alt: 'Дорожка к обзорной площадке' },
      { key: 'quests/phuket/sunset-viewpoint-photo-task/gallery/02.jpg', alt: 'Закатный панорамный вид' },
    ],
    steps: {
      step_sunset_001: {
        key: 'quests/phuket/sunset-viewpoint-photo-task/steps/step_sunset_001/01.jpg',
        alt: 'Старт маршрута к смотровой',
      },
      step_sunset_002: {
        key: 'quests/phuket/sunset-viewpoint-photo-task/steps/step_sunset_002/01.jpg',
        alt: 'Фото-подтверждение закатного вида',
      },
      step_sunset_003: {
        key: 'quests/phuket/sunset-viewpoint-photo-task/steps/step_sunset_003/01.jpg',
        alt: 'Финальное подтверждение задания',
      },
    },
  },
  quest_rf_coffee_route_003: {
    coverKey: 'quests/phuket/russian-friendly-coffee-break-route/cover.jpg',
    coverAlt: 'Russian Friendly кофейный маршрут в Пхукете',
    gallery: [
      { key: 'quests/phuket/russian-friendly-coffee-break-route/gallery/01.jpg', alt: 'Первая кофейная точка маршрута' },
      { key: 'quests/phuket/russian-friendly-coffee-break-route/gallery/02.jpg', alt: 'Вторая партнёрская точка маршрута' },
    ],
    steps: {
      step_rf_coffee_001: {
        key: 'quests/phuket/russian-friendly-coffee-break-route/steps/step_rf_coffee_001/01.jpg',
        alt: 'Первая Russian Friendly точка',
      },
      step_rf_coffee_002: {
        key: 'quests/phuket/russian-friendly-coffee-break-route/steps/step_rf_coffee_002/01.jpg',
        alt: 'Вторая Russian Friendly точка',
      },
      step_rf_coffee_003: {
        key: 'quests/phuket/russian-friendly-coffee-break-route/steps/step_rf_coffee_003/01.jpg',
        alt: 'Финальный social step маршрута',
      },
    },
  },
  quest_night_market_event_004: {
    coverKey: 'quests/phuket/night-market-event-check-in/cover.jpg',
    coverAlt: 'Вечерний маркет и атмосфера события',
    gallery: [
      { key: 'quests/phuket/night-market-event-check-in/gallery/01.jpg', alt: 'Огни вечернего маркета' },
      { key: 'quests/phuket/night-market-event-check-in/gallery/02.jpg', alt: 'Атмосфера ночного события' },
    ],
    steps: {
      step_night_market_001: {
        key: 'quests/phuket/night-market-event-check-in/steps/step_night_market_001/01.jpg',
        alt: 'Прибытие на событие',
      },
      step_night_market_002: {
        key: 'quests/phuket/night-market-event-check-in/steps/step_night_market_002/01.jpg',
        alt: 'Публичная заметка о событии',
      },
    },
  },
  quest_one_day_explorer_005: {
    coverKey: 'quests/phuket/one-day-explorer-route/cover.jpg',
    coverAlt: 'Насыщенный маршрут по Пхукету на полдня',
    gallery: [
      { key: 'quests/phuket/one-day-explorer-route/gallery/01.jpg', alt: 'Городская точка старта' },
      { key: 'quests/phuket/one-day-explorer-route/gallery/02.jpg', alt: 'Партнёрская остановка маршрута' },
      { key: 'quests/phuket/one-day-explorer-route/gallery/03.jpg', alt: 'Фото-этап маршрута' },
    ],
    steps: {
      step_one_day_001: {
        key: 'quests/phuket/one-day-explorer-route/steps/step_one_day_001/01.jpg',
        alt: 'Первый шаг маршрута',
      },
      step_one_day_002: {
        key: 'quests/phuket/one-day-explorer-route/steps/step_one_day_002/01.jpg',
        alt: 'Партнёрская кофейня',
      },
      step_one_day_003: {
        key: 'quests/phuket/one-day-explorer-route/steps/step_one_day_003/01.jpg',
        alt: 'Локальное событие маршрута',
      },
      step_one_day_004: {
        key: 'quests/phuket/one-day-explorer-route/steps/step_one_day_004/01.jpg',
        alt: 'Фото-подтверждение маршрута',
      },
      step_one_day_005: {
        key: 'quests/phuket/one-day-explorer-route/steps/step_one_day_005/01.jpg',
        alt: 'Публичный отчёт о маршруте',
      },
      step_one_day_006: {
        key: 'quests/phuket/one-day-explorer-route/steps/step_one_day_006/01.jpg',
        alt: 'Финальный шаг маршрута',
      },
    },
  },
  quest_draft_old_town_006: {
    coverKey: 'quests/phuket/hidden-draft-route-for-old-town-testing/cover.jpg',
    coverAlt: 'Черновой маршрут для внутреннего тестирования',
    gallery: [{ key: 'quests/phuket/hidden-draft-route-for-old-town-testing/gallery/01.jpg', alt: 'Визуальный референс черновика' }],
    steps: {
      step_draft_001: {
        key: 'quests/phuket/hidden-draft-route-for-old-town-testing/steps/step_draft_001/01.jpg',
        alt: 'Черновая стартовая точка',
      },
      step_draft_002: {
        key: 'quests/phuket/hidden-draft-route-for-old-town-testing/steps/step_draft_002/01.jpg',
        alt: 'Черновой фото-шаг',
      },
    },
  },
};

function resolveUrl(key: string): string | null {
  return resolveMediaUrl(key);
}

export function getQuestCoverMedia(questId: string): { url: string; alt: string } | null {
  const content = QUEST_MEDIA_BY_ID[questId];
  if (!content) return null;
  const url = resolveUrl(content.coverKey);
  if (!url) return null;
  return { url, alt: content.coverAlt };
}

export function getQuestGalleryMedia(questId: string): Array<{ url: string; alt: string }> {
  const content = QUEST_MEDIA_BY_ID[questId];
  if (!content) return [];
  return content.gallery
    .map((image) => {
      const url = resolveUrl(image.key);
      if (!url) return null;
      return { url, alt: image.alt };
    })
    .filter((value): value is { url: string; alt: string } => value !== null);
}

export function getQuestStepMediaFallback(
  questId: string,
  stepId: string
): { key: string; url: string | null; alt: string } | null {
  const content = QUEST_MEDIA_BY_ID[questId];
  const step = content?.steps[stepId];
  if (!step) return null;
  return {
    key: step.key,
    url: resolveUrl(step.key),
    alt: step.alt,
  };
}
