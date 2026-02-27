import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getEventById } from '@go2asia/sdk/content';
import { getDataSource } from '@/mocks/dto';
import { mockEventsById } from '@/components/pulse/mockEvents';
import { EventDetailsCanon, type PulseEventEntityDtoLike } from '@/components/pulse/EventDetailsCanon';

function toEntityFromApi(dto: Awaited<ReturnType<typeof getEventById>>): PulseEventEntityDtoLike {
  return {
    id: dto.id,
    title: dto.title,
    slug: dto.slug,
    shortDescription: dto.shortDescription ?? null,
    bodyMarkdown: dto.bodyMarkdown ?? '',
    category: dto.category ?? null,
    startDate: dto.startDate,
    endDate: dto.endDate ?? null,
    location: dto.location ?? null,
    countryName: dto.countryName ?? null,
    cityName: dto.cityName ?? null,
    heroMediaKey: dto.heroMediaKey ?? null,
    galleryMediaKeys: Array.isArray(dto.galleryMediaKeys) ? dto.galleryMediaKeys : [],
    isFree: Boolean(dto.isFree),
    isVerified: Boolean(dto.isVerified),
    officialUrl: dto.officialUrl ?? null,
  };
}

function toEntityFromMock(idOrSlug: string): PulseEventEntityDtoLike | null {
  const e = mockEventsById[idOrSlug];
  if (!e) return null;
  return {
    id: e.id,
    title: e.title,
    slug: e.id,
    shortDescription: e.description ?? null,
    bodyMarkdown: e.bodyMarkdown ?? '',
    category: e.category ?? null,
    startDate: e.startDate.toISOString(),
    endDate: e.endDate?.toISOString?.() ?? null,
    location: e.location?.name ?? null,
    countryName: e.location?.country ?? null,
    cityName: e.location?.city ?? null,
    heroMediaKey: null,
    galleryMediaKeys: [],
    isFree: e.price?.type === 'paid' ? false : true,
    isVerified: Boolean(e.verified),
    officialUrl: null,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dataSource = getDataSource();

  const entity =
    dataSource === 'mock'
      ? toEntityFromMock(slug)
      : await getEventById(slug).then(toEntityFromApi).catch(() => null);

  if (!entity) {
    return { title: 'Событие не найдено | Pulse Asia' };
  }

  return {
    title: `${entity.title} | Pulse Asia`,
    description: entity.shortDescription ?? undefined,
  };
}

export default async function PulseEventDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dataSource = getDataSource();

  const entity =
    dataSource === 'mock'
      ? toEntityFromMock(slug)
      : await getEventById(slug).then(toEntityFromApi).catch((err) => {
          // in API mode: no mock fallback
          const status = typeof err === 'object' && err !== null && 'status' in err ? (err as any).status : undefined;
          if (status === 404) return null;
          throw err;
        });

  if (!entity) notFound();

  // Canon: URL must use slug. If user came by ID (or old slug), redirect permanently-ish (308) to canonical slug.
  if (dataSource === 'api' && entity.slug && entity.slug !== slug) {
    redirect(`/pulse/events/${entity.slug}`);
  }
  return <EventDetailsCanon entity={entity} />;
}

