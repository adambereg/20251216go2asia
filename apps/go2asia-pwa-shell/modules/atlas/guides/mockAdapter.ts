import type { GuideDTO } from '@/mocks/dto';
import type { GuideDetail } from './types';

/**
 * Minimal adapter for legacy mocks -> Guide Engine v1 shape.
 * Only provides overview tab with a single rich_text block.
 */
export function mockGuideToGuideDetail(mock: GuideDTO): GuideDetail {
  return {
    id: mock.id,
    slug: mock.slug,
    title: mock.title,
    summary: mock.excerpt ?? null,
    heroUrl: mock.coverImage ?? null,
    guideType: mock.category ?? 'guide',
    status: 'mock',
    tags: mock.tags ?? [],
    countryIds: mock.countryId ? [mock.countryId] : [],
    cityIds: mock.cityId ? [mock.cityId] : [],
    publishedAt: mock.publishedAt ?? null,
    createdAt: mock.publishedAt ?? mock.updatedAt ?? new Date().toISOString(),
    updatedAt: mock.updatedAt ?? mock.publishedAt ?? new Date().toISOString(),
    sections: [
      {
        id: `${mock.id}-overview`,
        tabKey: 'overview',
        title: 'Обзор',
        orderIndex: 0,
        blocks: [
          {
            id: `${mock.id}-overview-rt`,
            blockType: 'rich_text',
            orderIndex: 0,
            payload: { markdown: mock.contentMarkdown ?? mock.excerpt ?? '' },
            isEmpty: false,
          },
        ],
        feeds: [],
        feedsResolved: [],
      },
    ],
  };
}

