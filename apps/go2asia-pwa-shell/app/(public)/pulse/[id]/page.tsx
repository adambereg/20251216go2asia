import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

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
  redirect(`/pulse/events/${id}`);
}

