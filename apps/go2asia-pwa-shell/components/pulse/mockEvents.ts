import type { Event } from './types';
import { mockRepo } from '@/mocks/repo';

/**
 * Единый слой мок-данных (UI-first).
 * Источник: `apps/go2asia-pwa-shell/mocks/*`.
 */
export const mockEvents: Event[] = mockRepo.pulse.listEvents().map((dto) => ({
  id: dto.id,
  title: dto.title,
  description: dto.description,
  startDate: new Date(dto.startTime),
  endDate: new Date(dto.endTime ?? dto.startTime),
  timezone: dto.timezone,
  location: dto.location
    ? {
        name: dto.location.name,
        address: dto.location.address,
        city: dto.location.city,
        country: dto.location.country,
        placeId: dto.location.placeId,
      }
    : undefined,
  category: dto.category,
  tags: dto.tags,
  price: dto.price,
  badges: dto.badges as any,
  cover: dto.coverImage,
  status: 'published',
  verified: dto.badges?.includes('verified') ?? false,
  russianFriendly: dto.badges?.includes('russian-friendly') ?? false,
}));

export const mockEventsById: Record<string, Event> = mockEvents.reduce((acc, event) => {
  acc[event.id] = event;
  return acc;
}, {} as Record<string, Event>);
