import type { Metadata } from 'next';
import { VerificationsListView } from '@/components/rf/PRO';

export const metadata: Metadata = {
  title: 'Проверки (demo) | PRO Dashboard | Russian Friendly',
  description: 'Demo-слой проверок для PRO baseline без live verification workflow',
};

export default function PROVerificationsPage() {
  return <VerificationsListView />;
}

