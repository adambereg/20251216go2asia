import type { Metadata } from 'next';
import { PROWorkspace } from '@/components/rf/PRO';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'PRO workspace (beta) | Russian Friendly | Go2Asia',
  description: 'Операционная видимость PRO: связанные партнёры, attributed vouchers и continuity с RF/Connect/Rielt',
};

export default function PRODashboardPage() {
  return <PROWorkspace />;
}
