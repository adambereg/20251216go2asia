import { mockEventsDTO, mockEventsByIdDTO } from './events';
import { mockPlacesDTO, mockPlacesByIdDTO } from './places';
import { mockPostsDTO, mockPostsBySlugDTO } from './posts';
import type { EventDTO, PlaceDTO, PostDTO } from './dto';

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
    listPlaces(): PlaceDTO[] {
      return mockPlacesDTO;
    },
    getPlaceById(id: string): PlaceDTO | null {
      return mockPlacesByIdDTO[id] ?? null;
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
