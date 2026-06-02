import type { Metadata } from 'next';
import { SpaceFeedSurface } from '@/components/space/runtime/SpaceFeedSurface';
import { WS2_COPY } from '@/modules/space/ws2Copy';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Лента | Space Asia | Go2Asia',
  description: WS2_COPY.surfaces.feedMeta,
};

export default function FeedPage() {
  return <SpaceFeedSurface />;
}
