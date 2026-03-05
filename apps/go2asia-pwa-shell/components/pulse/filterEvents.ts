/**
 * Утилита для фильтрации событий по заданным фильтрам
 */

import { Event, EventFilters } from './types';

export function filterEvents(events: Event[], filters: EventFilters): Event[] {
  let filtered = [...events];

  // Поиск по названию, описанию, организатору, тегам
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter((event) => {
      const titleMatch = event.title.toLowerCase().includes(searchLower);
      const descriptionMatch = event.description?.toLowerCase().includes(searchLower);
      const organizerMatch = event.organizer?.name.toLowerCase().includes(searchLower);
      const tagsMatch = event.tags?.some((tag) => tag.toLowerCase().includes(searchLower));
      
      return titleMatch || descriptionMatch || organizerMatch || tagsMatch;
    });
  }

  // Фильтр по стране
  if (filters.country) {
    filtered = filtered.filter(
      (event) => event.countrySlug === filters.country || event.location?.country === filters.country
    );
  }

  // Фильтр по городу
  if (filters.city) {
    filtered = filtered.filter((event) => event.citySlug === filters.city || event.location?.city === filters.city);
  }

  // Фильтр по категории
  if (filters.category) {
    filtered = filtered.filter((event) => event.category === filters.category);
  }

  // Фильтр по цене
  if (filters.price) {
    if (filters.price === 'free') {
      filtered = filtered.filter((event) => event.price?.type === 'free');
    } else if (filters.price === 'paid') {
      filtered = filtered.filter((event) => event.price?.type === 'paid');
    }
  }

  // Фильтр по "проверено"
  if (filters.verified !== undefined) {
    filtered = filtered.filter((event) => Boolean(event.verified) === filters.verified);
  }

  // Фильтр по времени
  if (filters.timeFilter) {
    const now = new Date();
    const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
    const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

    const today = startOfDay(now);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let rangeStart: Date | null = null;
    let rangeEnd: Date | null = null;

    if (filters.timeFilter === 'today') {
      rangeStart = today;
      rangeEnd = endOfDay(today);
    } else if (filters.timeFilter === 'tomorrow') {
      rangeStart = tomorrow;
      rangeEnd = endOfDay(tomorrow);
    } else if (filters.timeFilter === 'weekend') {
      // Upcoming weekend: Saturday+Sunday (include today if already Saturday)
      const dow = today.getDay(); // 0=Sun..6=Sat
      const daysUntilSat = (6 - dow + 7) % 7;
      const sat = new Date(today);
      sat.setDate(sat.getDate() + daysUntilSat);
      const sun = new Date(sat);
      sun.setDate(sun.getDate() + 1);
      rangeStart = sat;
      rangeEnd = endOfDay(sun);
    }

    if (rangeStart && rangeEnd) {
      filtered = filtered.filter((event) => {
        const s = new Date(event.startDate);
        const e = new Date(event.endDate ?? event.startDate);
        return s <= rangeEnd! && e >= rangeStart!;
      });
    }
  }

  // Фильтр по диапазону дат
  if (filters.dateRange) {
    if (filters.dateRange.start) {
      const start = new Date(filters.dateRange.start);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.startDate);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= start;
      });
    }
    if (filters.dateRange.end) {
      const end = new Date(filters.dateRange.end);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.startDate);
        return eventDate <= end;
      });
    }
  }

  return filtered;
}

