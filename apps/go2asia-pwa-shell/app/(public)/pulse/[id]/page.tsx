import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EventDetail } from '@/components/pulse/EventDetail';
import { mockEventsById } from '@/components/pulse/mockEvents';
import type { Event } from '@/components/pulse/types';
import { getEventById } from '@go2asia/sdk/content';
import { getDataSource } from '@/mocks/dto';

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
  const dataSource = getDataSource();
  let event: Event | undefined;
  if (dataSource === 'mock') {
    event = mockEventsById[id];
  } else {
    try {
      const dto = await getEventById(id);
      event = toPulseEvent(dto);
    } catch {
      // в api-режиме метаданные не должны подменяться моками
      event = undefined;
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
  const dataSource = getDataSource();
  let event: Event | undefined;
  let demoMode:
    | { reason: 'NOT_FOUND' | 'SERVER_ERROR' | 'NETWORK_ERROR' }
    | { reason: 'NOT_FOUND'; title?: string }
    | undefined;

  if (dataSource === 'mock') {
    event = mockEventsById[id];
    if (event) demoMode = { reason: 'NOT_FOUND', title: 'MOCK DATA' };
  } else {
    try {
      const dto = await getEventById(id);
      event = toPulseEvent(dto);
    } catch (err) {
      // API mode: no fallback to mock repository
      const status = typeof err === 'object' && err !== null && 'status' in err ? (err as any).status : undefined;
      if (typeof status === 'number' && status === 404) {
        notFound();
      }
      notFound();
    }
  }

  if (!event) {
    notFound();
  }

  return <EventDetail event={event} demoMode={demoMode} />;
}

