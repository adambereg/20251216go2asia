import type { GuideDTO } from '../dto';

const md = (title: string) => `# ${title}\n\nКороткий контент для UI-проверки гайда.\n\n## Раздел\n\n- Шаг 1\n- Шаг 2\n\n**Важно:** проверьте переполнение и адаптив.\n`;

export const mockGuidesDTO: GuideDTO[] = [
  {
    id: 'guide-1',
    slug: 'bangkok-first-week',
    title: 'Бангкок: первая неделя — что успеть',
    excerpt: 'Маршрут, транспорт, районы и базовые сервисы.',
    contentMarkdown: md('Бангкок: первая неделя — что успеть'),
    coverImage: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg',
    category: 'Маршрут',
    tags: ['transport', 'districts', 'food'],
    countryId: 'th',
    cityId: 'bkk',
    publishedAt: '2025-12-01T10:00:00.000Z',
    updatedAt: '2025-12-10T10:00:00.000Z',
  },
  {
    id: 'guide-2',
    slug: 'phuket-family',
    title: 'Пхукет для семьи: районы и пляжи',
    excerpt: 'Как выбрать район, где купаться и что важно для семьи.',
    contentMarkdown: md('Пхукет для семьи: районы и пляжи'),
    coverImage: 'https://images.pexels.com/photos/2491286/pexels-photo-2491286.jpeg',
    category: 'Жизнь на месте',
    tags: ['family', 'beach'],
    countryId: 'th',
    cityId: 'hkt',
    publishedAt: '2025-11-05T10:00:00.000Z',
    updatedAt: '2025-11-10T10:00:00.000Z',
  },
  {
    id: 'guide-3',
    slug: 'chiangmai-cafes',
    title: 'Чиангмай: кафе и места для работы',
    excerpt: 'Подборка мест с Wi‑Fi и уютной атмосферой.',
    contentMarkdown: md('Чиангмай: кафе и места для работы'),
    coverImage: 'https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg',
    category: 'Подборка',
    tags: ['coffee', 'remote'],
    countryId: 'th',
    cityId: 'cnx',
    publishedAt: '2025-10-12T10:00:00.000Z',
    updatedAt: '2025-10-20T10:00:00.000Z',
  },
  {
    id: 'guide-4',
    slug: 'hcmc-moving',
    title: 'Хошимин: переезд и первые документы',
    excerpt: 'Что подготовить заранее и как не потеряться в городе.',
    contentMarkdown: md('Хошимин: переезд и первые документы'),
    coverImage: 'https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg',
    category: 'Практика',
    tags: ['documents', 'relocation'],
    countryId: 'vn',
    cityId: 'sgn',
    publishedAt: '2025-09-10T10:00:00.000Z',
    updatedAt: '2025-09-15T10:00:00.000Z',
  },
  {
    id: 'guide-5',
    slug: 'hanoi-weekend',
    title: 'Ханой: маршрут на выходные',
    excerpt: 'Культура, еда и прогулки по старому городу.',
    contentMarkdown: md('Ханой: маршрут на выходные'),
    coverImage: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
    category: 'Маршрут',
    tags: ['culture', 'food'],
    countryId: 'vn',
    cityId: 'han',
    publishedAt: '2025-08-01T10:00:00.000Z',
    updatedAt: '2025-08-03T10:00:00.000Z',
  },
  {
    id: 'guide-6',
    slug: 'bali-remote',
    title: 'Бали: удалённая работа и ритм жизни',
    excerpt: 'Интернет, районы, комьюнити и сезонность.',
    contentMarkdown: md('Бали: удалённая работа и ритм жизни'),
    coverImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    category: 'Жизнь на месте',
    tags: ['bali', 'remote', 'season'],
    countryId: 'id',
    cityId: 'dps',
    publishedAt: '2025-07-15T10:00:00.000Z',
    updatedAt: '2025-07-20T10:00:00.000Z',
  },
];

export const mockGuidesByIdOrSlugDTO: Record<string, GuideDTO> = Object.fromEntries(
  mockGuidesDTO.flatMap((g) => [
    [g.id, g],
    [g.slug, g],
  ])
);


