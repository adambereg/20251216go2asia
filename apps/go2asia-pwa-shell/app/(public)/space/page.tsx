import type { Metadata } from 'next';
import { SpacePageClient } from './SpacePageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Space Asia - Runtime Shell Entry | Go2Asia',
  description:
    'Canonical Space phase-1 entry with runtime-backed shell and narrow cross-module reference previews.',
};

export default function SpacePage() {
  return <SpacePageClient />;
}
