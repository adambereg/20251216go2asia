import type { Metadata } from 'next';
import { ModuleHero } from '@/components/modules';
import { Building } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Rielt.Market - Inquiry-only listing previews | Go2Asia',
  description: 'Source-labeled previews жилья в ЮВА для inquiry; не booking/payment platform',
  openGraph: {
    title: 'Rielt.Market - Inquiry-only listing previews',
    description: 'Source-labeled previews жилья в ЮВА для inquiry; не booking/payment platform',
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
        description="Inquiry-only listing previews в ЮВА: source labels, запросы владельцу и без booking/payment authority"
        gradientFrom="from-emerald-500"
        gradientTo="to-emerald-600"
      />
      {children}
    </div>
  );
}

