import type { Metadata } from 'next';
import { ModuleHero } from '@/components/modules';
import { Building } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Rielt.Market - Подбор жилья | Go2Asia',
  description: 'Подбор жилья в Юго-Восточной Азии через RF-партнёров и проверку кураторов',
  openGraph: {
    title: 'Rielt.Market - Подбор жилья',
    description: 'Подбор жилья в ЮВА через RF-партнёров и проверку кураторов',
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
        description="Подбор жилья в ЮВА через RF-партнёров и проверку кураторов"
        gradientFrom="from-emerald-500"
        gradientTo="to-emerald-600"
      />
      {children}
    </div>
  );
}

