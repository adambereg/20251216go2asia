/**
 * Типы для модуля Pulse Asia
 */

export type CalendarViewMode = 'month' | 'week' | 'day' | 'agenda';

export interface Event {
  id: string;
  title: string;
  description?: string;
  bodyMarkdown?: string;
  startDate: Date;
  endDate: Date;
  timezone?: string;
  // Canonical media keys (R2 object keys, relative paths)
  heroMediaKey?: string | null;
  galleryMediaKeys?: string[] | null;
  location?: {
    name: string;
    address?: string;
    city?: string;
    country?: string;
    placeId?: string; // ID места из Atlas
  };
  countrySlug?: string;
  citySlug?: string;
  organizer?: {
    id: string;
    name: string;
    type: 'spacer' | 'vip' | 'pro' | 'partner';
  };
  category?: string;
  tags?: string[];
  price?: {
    type: 'free' | 'paid';
    amount?: number;
    currency?: string;
  };
  language?: 'ru' | 'en' | 'local';
  scale?: 'country' | 'city' | 'place';
  cover?: string;
  attendeesCount?: number;
  maxAttendees?: number;
  badges?: EventBadge[];
  rrule?: string; // RRULE для повторяющихся событий
  status?: 'draft' | 'pending' | 'published' | 'cancelled';
  verified?: boolean;
  russianFriendly?: boolean;
  atlasLinks?: {
    countryId?: string;
    cityId?: string;
    placeId?: string;
  };
}

export type EventBadge = 
  | 'verified'
  | 'russian-friendly'
  | 'free'
  | 'paid'
  | 'repeating'
  | 'event-started'
  | 'event-over'
  | 'moved-online'
  | 'virtual-event'
  | 'featured';

export interface EventFilters {
  country?: string; // slug (e.g. "thailand")
  city?: string; // slug (e.g. "bangkok")
  category?: string;
  price?: 'free' | 'paid' | 'all';
  verified?: boolean;
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  timeFilter?: 'today' | 'tomorrow' | 'weekend' | 'all';
  search?: string;
}

export interface CalendarDay {
  date: Date;
  isToday: boolean;
  isCurrentMonth: boolean;
  events: Event[];
}

export interface CalendarWeek {
  startDate: Date;
  endDate: Date;
  days: CalendarDay[];
}

