import type { Metadata } from 'next';
import { AnalyticsView } from '@/components/connect/Analytics/AnalyticsView';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Статистика | Connect Asia | Go2Asia',
  description: 'Расширенная статистика Connect появится позже',
};

export default function AnalyticsPage() {
  return <AnalyticsView />;
}
