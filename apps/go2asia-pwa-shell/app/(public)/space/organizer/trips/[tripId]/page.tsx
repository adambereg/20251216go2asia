import type { Metadata } from 'next';
import { OrganizerTripDetailPageClient } from './OrganizerTripDetailPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Organizer Trip | Space Asia | Go2Asia',
  description: 'Minimal Organizer trip detail inside Space Asia for the first real trip-model slice.',
};

function normalizeTripRouteParam(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export default async function OrganizerTripDetailPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;

  return <OrganizerTripDetailPageClient tripId={normalizeTripRouteParam(tripId)} />;
}
