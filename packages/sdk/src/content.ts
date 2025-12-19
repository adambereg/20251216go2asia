/**
 * @go2asia/sdk/content
 *
 * Content Service (via API Gateway)
 * - Server-safe helpers (no React Query)
 */

import { customInstance } from './mutator';

export interface ContentEventDto {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  startDate: string; // ISO string
  endDate: string | null; // ISO string
  location: string | null;
  latitude: string | null;
  longitude: string | null;
  imageUrl: string | null;
  isActive: boolean;
}

/**
 * Fetch single event by ID.
 * Public endpoint.
 */
export async function getEventById(eventId: string): Promise<ContentEventDto> {
  return customInstance<ContentEventDto>({ method: 'GET' }, `/v1/content/events/${eventId}`);
}
