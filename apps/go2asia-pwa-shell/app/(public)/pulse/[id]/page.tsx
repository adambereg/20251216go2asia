import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EventDetail } from '@/components/pulse/EventDetail';
import { mockEventsById } from '@/components/pulse/mockEvents';
import type { Event } from '@/components/pulse/types';
import { getEventById } from '@go2asia/sdk/content';

function toPulseEvent(dto: Awaited<ReturnType<typeof getEventById>>): Event {
  const locationStr = dto.location ?? '';
  const parts = locationStr.split(',').map((p) => p.trim()).filter(Boolean);
  const city = parts.length >= 2 ? parts[0] : undefined;
  const country = parts.length >= 2 ? parts.slice(1).join(', ') : undefined;

  const startDate = new Date(dto.startDate);
  const endDate = dto.endDate ? new Date(dto.endDate) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

  return {
    id: dto.id,
    title: dto.title,
    description: dto.description ?? undefined,
    startDate,
    endDate,
    category: dto.category ?? undefined,
    cover: dto.imageUrl ?? undefined,
    location: locationStr
      ? {
          name: locationStr,
          city,
          country,
        }
      : undefined,
    badges: ['verified'],
    price: { type: 'free' },
    verified: true,
  };
}

function classifyFallbackReason(err: unknown): 'NOT_FOUND' | 'SERVER_ERROR' | 'NETWORK_ERROR' | null {
  const status = typeof err === 'object' && err !== null && 'status' in err ? (err as any).status : undefined;
  if (typeof status === 'number') {
    if (status === 404) return 'NOT_FOUND';
    if (status >= 500) return 'SERVER_ERROR';
    return null;
  }
  // fetch() network errors typically throw TypeError without status
  if (err instanceof Error) return 'NETWORK_ERROR';
  return 'NETWORK_ERROR';
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  let event: Event | undefined;
  try {
    const dto = await getEventById(id);
    event = toPulseEvent(dto);
  } catch (err) {
    const fallbackReason = classifyFallbackReason(err);
    if (fallbackReason) {
      event = mockEventsById[id];
    }
  }

  if (!event) {
    return {
      title: 'Событие не найдено | Pulse Asia',
    };
  }

  return {
    title: `${event.title} | Pulse Asia`,
    description: event.description || `Событие ${event.title} в ${event.location?.city || event.location?.country}`,
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let event: Event | undefined;
  let demoMode: { reason: 'NOT_FOUND' | 'SERVER_ERROR' | 'NETWORK_ERROR' } | undefined;

  try {
    const dto = await getEventById(id);
    event = toPulseEvent(dto);
  } catch (err) {
    const fallbackReason = classifyFallbackReason(err);
    if (fallbackReason) {
      const fallback = mockEventsById[id];
      if (fallback) {
        event = fallback;
        demoMode = { reason: fallbackReason };
      }
    } else {
      // Not eligible for fallback (e.g. 401/403/4xx): treat as not found to avoid showing mock data
      notFound();
    }
  }

  if (!event) {
    notFound();
  }

  return <EventDetail event={event} demoMode={demoMode} />;
}

