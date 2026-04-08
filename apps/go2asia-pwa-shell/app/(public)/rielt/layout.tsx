import type { Metadata } from 'next';
import { ModuleHero } from '@/components/modules';
import { Building } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Rielt.Market - Curated housing discovery | Go2Asia',
  description: 'Curated discovery-layer жилья в Юго-Восточной Азии через RF-партнёров и PRO-кураторов',
  openGraph: {
    title: 'Rielt.Market - Curated housing discovery',
    description: 'Curated discovery-layer жилья в ЮВА через RF-партнёров и PRO-кураторов',
    type: 'website',
  },
};

export default function RieltLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <ModuleHero
        icon={Building}
        title="Rielt.Market"
        description="Curated housing discovery в ЮВА: RF-партнёры и PRO-кураторы, а не открытый marketplace"
        gradientFrom="from-emerald-500"
        gradientTo="to-emerald-600"
      />
      {children}
    </div>
  );
}

