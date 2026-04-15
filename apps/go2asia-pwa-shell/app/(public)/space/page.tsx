import type { Metadata } from 'next';
import { SpacePageClient } from './SpacePageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Space Asia Dashboard | Go2Asia',
  description:
    'Dashboard-shell baseline for Space Asia with runtime-backed previews and honest thin reference layers.',
};

export default function SpacePage() {
  return <SpacePageClient />;
}
