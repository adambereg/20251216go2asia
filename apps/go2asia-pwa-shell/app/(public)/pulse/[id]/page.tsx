import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EventDetail } from '@/components/pulse/EventDetail';
import { mockEventsById } from '@/components/pulse/mockEvents';
import type { Event } from '@/components/pulse/types';
import { getEventById } from '@go2asia/sdk/content';
import { getDataSource } from '@/mocks/dto';

function toPulseEvent(dto: Awaited<ReturnType<typeof getEventById>>): Event {
  const startDate = new Date(dto.startDate);
  const endDate = dto.endDate ? new Date(dto.endDate) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

  const isFree = Boolean(dto.isFree);
  const isVerified = Boolean(dto.isVerified);

  const badges: any[] = [];
  if (isVerified) badges.push('verified');
  badges.push(isFree ? 'free' : 'paid');

  const countryName = (dto.countryName ?? dto.countrySlug ?? '') as string;
  const cityName = (dto.cityName ?? dto.citySlug ?? '') as string;
  const locationStr: string = (dto.location ?? [cityName, countryName].filter(Boolean).join(', ')) as any;

  return {
    id: dto.id,
    slug: dto.slug ?? undefined,
    year: typeof dto.year === 'number' ? dto.year : undefined,
    title: dto.title,
    // Canon: description == bodyMarkdown (sections live in markdown)
    description: dto.bodyMarkdown ?? undefined,
    bodyMarkdown: dto.bodyMarkdown ?? undefined,
    startDate,
    endDate,
    category: dto.category ?? undefined,
    heroMediaKey: dto.heroMediaKey ?? null,
    galleryMediaKeys: Array.isArray(dto.galleryMediaKeys) ? dto.galleryMediaKeys : null,
    countrySlug: dto.countrySlug ?? undefined,
    citySlug: dto.citySlug ?? undefined,
    location: locationStr
      ? {
          name: locationStr,
          city: cityName || undefined,
          country: countryName || undefined,
        }
      : undefined,
    badges,
    price: isFree
      ? { type: 'free' }
      : {
          type: 'paid',
          amount: typeof dto.priceAmount === 'string' ? Number(dto.priceAmount) : undefined,
          currency: typeof dto.priceCurrency === 'string' ? dto.priceCurrency : undefined,
        },
    verified: isVerified,
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

  if (dataSource === 'mock') {
    event = mockEventsById[id];
  } else {
    try {
      const dto = await getEventById(id);
      event = toPulseEvent(dto);
    } catch (err) {
      const reason = classifyFallbackReason(err) ?? 'NETWORK_ERROR';
      if (reason === 'NOT_FOUND') notFound();
      // No mock fallback in API mode (staging/prod behavior)
      throw err;
    }
  }

  if (!event) {
    notFound();
  }

  return <EventDetail event={event} />;
}

