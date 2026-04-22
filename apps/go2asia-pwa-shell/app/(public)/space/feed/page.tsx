import type { Metadata } from 'next';
import { SpaceFeedSurface } from '@/components/space/runtime/SpaceFeedSurface';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Лента | Space Asia | Go2Asia',
  description: 'Личный поток полезных публикаций, групп и репостов по Space Asia.',
};

export default function FeedPage() {
  return <SpaceFeedSurface />;
}
