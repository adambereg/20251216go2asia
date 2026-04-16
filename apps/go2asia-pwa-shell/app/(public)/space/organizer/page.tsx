import type { Metadata } from 'next';
import { OrganizerPageClient } from './OrganizerPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Organizer | Space Asia | Go2Asia',
  description:
    'Honest shell insertion of Personal Organizer inside Space Asia with bounded Phase 1 states.',
};

export default function OrganizerPage() {
  return <OrganizerPageClient />;
}
