import type { Metadata } from 'next';
import { ActivityPageClient } from './ActivityPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Активность | Space Asia | Go2Asia',
  description: 'Недавняя активность в Space Asia.',
};

export default function ActivityPage() {
  return <ActivityPageClient />;
}
