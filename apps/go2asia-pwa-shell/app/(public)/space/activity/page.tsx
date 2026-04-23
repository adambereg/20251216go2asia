import type { Metadata } from 'next';
import { ActivityPageClient } from './ActivityPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Активность | Space Asia | Go2Asia',
  description: 'Недавние действия в Space Asia.',
};

type ActivityFilter = 'all' | 'incoming' | 'my_actions';

interface ActivityPageProps {
  searchParams: Promise<{ filter?: string }>;
}

function normalizeActivityFilter(value: string | undefined): ActivityFilter {
  return value === 'incoming' || value === 'my_actions' ? value : 'all';
}

export default async function ActivityPage({ searchParams }: ActivityPageProps) {
  const { filter } = await searchParams;
  return <ActivityPageClient initialFilter={normalizeActivityFilter(filter)} />;
}
