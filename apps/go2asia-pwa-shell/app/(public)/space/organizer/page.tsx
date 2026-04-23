import type { Metadata } from 'next';
import { OrganizerPageClient } from './OrganizerPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Organizer | Space Asia | Go2Asia',
  description:
    'Minimal Organizer trip-model slice inside Space Asia with real trip containers and bounded Phase 2 surfaces.',
};

export default function OrganizerPage() {
  return <OrganizerPageClient />;
}
