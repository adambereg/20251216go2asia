import type { Metadata } from 'next';
import { VerificationsListView } from '@/components/rf/PRO';

export const metadata: Metadata = {
  title: 'Проверки (deferred) | PRO Dashboard | Russian Friendly',
  description: 'Quarantined PRO verification route without mock operational workflow',
};

export default function PROVerificationsPage() {
  return <VerificationsListView />;
}

