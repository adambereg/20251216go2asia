import type { HubDTO, ThemeDTO } from '../dto';

export const mockThemesDTO: ThemeDTO[] = [
  {
    id: 'visas',
    title: 'Визы и миграция',
    description: 'Типы виз, правила въезда, риски и обновления регламентов.',
    heroImage: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg',
    tags: ['регламенты', 'обновления', 'переезд', 'туристы'],
    updatedAt: '2025-12-17T10:00:00.000Z',
  },
  {
    id: 'taxes',
    title: 'Налоги и работа',
    description: 'Фриланс, удалёнка, бизнес-структуры и базовые налоговые режимы.',
    heroImage: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
    tags: ['фриланс', 'бизнес', 'налоги'],
    updatedAt: '2025-11-20T10:00:00.000Z',
  },
  {
    id: 'education',
    title: 'Образование и дети',
    description: 'Школы, садики, курсы и семейные сценарии переезда.',
    heroImage: 'https://images.pexels.com/photos/2491286/pexels-photo-2491286.jpeg',
    tags: ['школы', 'семья', 'переезд'],
    updatedAt: '2025-10-01T10:00:00.000Z',
  },
  {
    id: 'medicine',
    title: 'Медицина',
    description: 'Медицинское обслуживание, страховка, клиники и врачи в ЮВА.',
    heroImage: 'https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg',
    tags: ['клиники', 'страховка', 'врачи'],
    updatedAt: '2025-09-18T10:00:00.000Z',
  },
  {
    id: 'communication',
    title: 'Связь и интернет',
    description: 'Мобильная связь, интернет, VPN и цифровые сервисы.',
    heroImage: 'https://images.pexels.com/photos/774691/pexels-photo-774691.jpeg',
    tags: ['SIM', 'VPN', 'интернет'],
    updatedAt: '2025-08-01T10:00:00.000Z',
  },
  {
    id: 'banking',
    title: 'Банки и финтех',
    description: 'Банковские счета, карты, переводы и финансовые сервисы.',
    heroImage: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
    tags: ['банки', 'карты', 'переводы'],
    updatedAt: '2025-07-15T10:00:00.000Z',
  },
];

export const mockThemesByIdDTO: Record<string, ThemeDTO> = Object.fromEntries(
  mockThemesDTO.map((t) => [t.id, t])
);

// Topic hubs (можно мапить 1:1 на темы)
export const mockHubsDTO: HubDTO[] = mockThemesDTO.map((t) => ({
  slug: t.id,
  title: t.title,
  description: t.description,
  heroImage: t.heroImage,
  tags: t.tags,
}));

export const mockHubsBySlugDTO: Record<string, HubDTO> = Object.fromEntries(
  mockHubsDTO.map((h) => [h.slug, h])
);


