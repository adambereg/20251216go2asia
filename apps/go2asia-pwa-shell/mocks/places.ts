import type { PlaceDTO } from './dto';

const img = (seed: number) => `https://images.pexels.com/photos/${1000000 + seed}/pexels-photo-${1000000 + seed}.jpeg`;

// 20 мест (разные типы/категории)
export const mockPlacesDTO: PlaceDTO[] = Array.from({ length: 20 }).map((_, i) => {
  const n = i + 1;
  const city = n % 3 === 0 ? 'Bangkok' : n % 3 === 1 ? 'Phuket' : 'Chiang Mai';
  const type = n % 4 === 0 ? 'cafe' : n % 4 === 1 ? 'attraction' : n % 4 === 2 ? 'restaurant' : 'park';
  return {
    id: `place-${n}`,
    name: `${city} Place ${n}`,
    slug: `${city.toLowerCase()}-place-${n}`,
    type,
    description:
      'Короткое описание места для проверки типографики, переполнения текста и карточек. Здесь может быть 2-3 предложения.',
    country: 'Thailand',
    city,
    address: `${n * 3} Example street, ${city}`,
    latitude: 13.75 + n * 0.01,
    longitude: 100.50 + n * 0.01,
    categories: [type, n % 2 === 0 ? 'popular' : 'local'],
    photos: [img(n), img(n + 20)],
    rating: Math.round((3.5 + (n % 5) * 0.3) * 10) / 10,
    updatedAt: new Date(Date.now() - n * 86400000).toISOString(),
  };
});

export const mockPlacesByIdDTO: Record<string, PlaceDTO> = Object.fromEntries(
  mockPlacesDTO.map((p) => [p.id, p])
);
