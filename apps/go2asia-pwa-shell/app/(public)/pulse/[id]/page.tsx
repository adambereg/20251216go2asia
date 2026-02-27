import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getEventById } from '@go2asia/sdk/content';
import { getDataSource } from '@/mocks/dto';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return { title: `${id} | Pulse Asia` };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Canon route: /pulse/events/[slug]. Keep /pulse/[id] as backward-compatible redirect.
  const dataSource = getDataSource();
  if (dataSource === 'mock') {
    redirect(`/pulse/events/${id}`);
  }

  try {
    const dto = await getEventById(id);
    redirect(`/pulse/events/${dto.slug ?? id}`);
  } catch (err) {
    const status = typeof err === 'object' && err !== null && 'status' in err ? (err as any).status : undefined;
    if (status === 404) notFound();
    throw err;
  }
}

