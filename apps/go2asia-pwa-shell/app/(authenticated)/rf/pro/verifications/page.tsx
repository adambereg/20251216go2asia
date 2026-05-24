import type { Metadata } from 'next';
import { VerificationsListView } from '@/components/rf/PRO';

export const metadata: Metadata = {
  title: 'Проверки (deferred) | PRO Dashboard | Russian Friendly',
  description: 'Статусный маршрут проверок PRO без runtime-workflow в текущем этапе',
};

export default function PROVerificationsPage() {
  return <VerificationsListView />;
}

