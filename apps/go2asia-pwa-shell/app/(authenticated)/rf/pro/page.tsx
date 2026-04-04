import type { Metadata } from 'next';
import { PROWorkspace } from '@/components/rf/PRO';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'PRO кабинет (beta) | Russian Friendly | Go2Asia',
  description: 'Рабочее пространство PRO: партнёры, офферы, фокус и связь с публичным RF контуром',
};

export default function PRODashboardPage() {
  return <PROWorkspace />;
}
