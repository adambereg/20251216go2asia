import type { Metadata } from 'next';
import { SpaceFeedSurface } from '@/components/space/runtime/SpaceFeedSurface';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Лента | Space Asia | Go2Asia',
  description: 'Центральная персональная лента Space Asia. Сообщества остаются отдельной discovery surface на /space/community.',
};

export default function FeedPage() {
  return <SpaceFeedSurface />;
}
