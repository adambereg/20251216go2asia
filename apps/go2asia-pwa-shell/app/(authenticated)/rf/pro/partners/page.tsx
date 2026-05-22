import type { Metadata } from 'next';
import { PartnersListView } from '@/components/rf/PRO';

export const metadata: Metadata = {
  title: 'Партнёры (deferred) | PRO Dashboard | Russian Friendly',
  description: 'Quarantined PRO partners route without mock operational rendering',
};

export default function PROPartnersPage() {
  return <PartnersListView />;
}

