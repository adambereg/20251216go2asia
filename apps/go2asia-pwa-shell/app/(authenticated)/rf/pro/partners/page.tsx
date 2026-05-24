import type { Metadata } from 'next';
import { PartnersListView } from '@/components/rf/PRO';

export const metadata: Metadata = {
  title: 'Партнёры (deferred) | PRO Dashboard | Russian Friendly',
  description: 'Статусный маршрут партнёров PRO без операционных действий в текущем этапе',
};

export default function PROPartnersPage() {
  return <PartnersListView />;
}

