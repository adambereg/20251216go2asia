import type { Metadata } from 'next';
import { PartnersListView } from '@/components/rf/PRO';

export const metadata: Metadata = {
  title: 'Партнёры (legacy) | PRO Dashboard | Russian Friendly',
  description: 'Legacy/demo список партнёров для PRO baseline без live assignment management',
};

export default function PROPartnersPage() {
  return <PartnersListView />;
}

