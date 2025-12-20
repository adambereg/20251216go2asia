import { mockEventsDTO, mockEventsByIdDTO } from './events';
import { mockPlacesDTO, mockPlacesByIdDTO } from './places';
import { mockPostsDTO, mockPostsBySlugDTO } from './posts';
import {
  mockCountriesDTO,
  mockCountriesByIdDTO,
  mockCitiesDTO,
  mockCitiesByIdDTO,
  mockGuidesDTO,
  mockGuidesByIdOrSlugDTO,
  mockThemesDTO,
  mockThemesByIdDTO,
  mockHubsBySlugDTO,
  mockHubsDTO,
} from './atlas';
import type { CityDTO, CountryDTO, EventDTO, GuideDTO, HubDTO, PlaceDTO, PostDTO, ThemeDTO } from './dto';

export const mockRepo = {
  pulse: {
    listEvents(): EventDTO[] {
      return mockEventsDTO;
    },
    getEventById(id: string): EventDTO | null {
      return mockEventsByIdDTO[id] ?? null;
    },
  },
  atlas: {
    listCountries(): CountryDTO[] {
      return mockCountriesDTO;
    },
    getCountryById(id: string): CountryDTO | null {
      return mockCountriesByIdDTO[id] ?? null;
    },
    listCities(): CityDTO[] {
      return mockCitiesDTO;
    },
    getCityById(id: string): CityDTO | null {
      return mockCitiesByIdDTO[id] ?? null;
    },
    listPlaces(): PlaceDTO[] {
      return mockPlacesDTO;
    },
    getPlaceById(id: string): PlaceDTO | null {
      return mockPlacesByIdDTO[id] ?? null;
    },
    listGuides(): GuideDTO[] {
      return mockGuidesDTO;
    },
    getGuideByIdOrSlug(idOrSlug: string): GuideDTO | null {
      return mockGuidesByIdOrSlugDTO[idOrSlug] ?? null;
    },
    listThemes(): ThemeDTO[] {
      return mockThemesDTO;
    },
    getThemeById(id: string): ThemeDTO | null {
      return mockThemesByIdDTO[id] ?? null;
    },
    listHubs(): HubDTO[] {
      return mockHubsDTO;
    },
    getHubBySlug(slug: string): HubDTO | null {
      return mockHubsBySlugDTO[slug] ?? null;
    },
  },
  blog: {
    listPosts(): PostDTO[] {
      return mockPostsDTO;
    },
    getPostBySlug(slug: string): PostDTO | null {
      return mockPostsBySlugDTO[slug] ?? null;
    },
  },
};
