import { mockRepo } from '@/mocks/repo';
import type { PlacePreviewData } from './components/PlacePreviewCard';

const CITY_ID_TO_PLACE_CITY_NAMES: Record<string, string[]> = {
  bkk: ['Bangkok'],
  hkt: ['Phuket'],
  cnx: ['Chiang Mai'],
  sgn: ['Ho Chi Minh City'],
  dad: ['Da Nang'],
  dps: ['Denpasar', 'Bali'],
  jkt: ['Jakarta'],
  tok: ['Tokyo'],
  osa: ['Osaka'],
  fuk: ['Fukuoka'],
  seo: ['Seoul'],
  pus: ['Busan'],
  cju: ['Jeju'],
};

export function getMockCityById(cityId: string) {
  return mockRepo.atlas.getCityById(cityId);
}

export function listMockCityPlaces(cityId: string): PlacePreviewData[] {
  const mockCity = mockRepo.atlas.getCityById(cityId);
  const cityIdKey = cityId.toLowerCase();
  const expectedNames =
    CITY_ID_TO_PLACE_CITY_NAMES[cityIdKey] ?? (mockCity?.name ? [mockCity.name] : []);
  if (expectedNames.length === 0) return [];

  const expectedNamesLower = expectedNames.map((name) => name.toLowerCase());
  return mockRepo.atlas
    .listPlaces()
    .filter((place) => expectedNamesLower.includes((place.city ?? '').toLowerCase()))
    .map((place) => ({
      id: place.id,
      slug: place.slug ?? place.id,
      name: place.name,
      description: place.description ?? null,
      heroImage: place.photos?.[0] ?? null,
      cityName: place.city ?? null,
      kind:
        place.type === 'cafe' || place.type === 'coworking' || place.type === 'nightlife'
          ? 'business'
          : 'showplace',
      category: place.type ?? null,
      tags: place.categories ?? [],
    }));
}
