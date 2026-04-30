import type { Metadata } from 'next';
import { RfMyVouchersView } from '@/components/rf/Vouchers/RfMyVouchersView';
import { RFHero, RFMainNav } from '@/components/rf/Shared';
import { rfMyVouchersPageContent } from '@/lib/rfFirstSliceContent';

export const metadata: Metadata = {
  title: 'Мои ваучеры | Russian Friendly | Go2Asia',
  description: 'Список сохранённых офферов для планирования визитов',
};

export default function RfMyVouchersPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <RFHero compact subtitle="Полученные RF-ваучеры из аккаунта и отдельный локальный список сохранённых предложений." />
      <div className="mx-auto max-w-7xl px-4 pb-4 pt-4 sm:px-6 lg:px-8">
        <RFMainNav />
      </div>
      <main className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-slate-900">{rfMyVouchersPageContent.pageTitle}</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">{rfMyVouchersPageContent.pageSubtitle}</p>
        <div className="mt-8">
          <RfMyVouchersView />
        </div>
      </main>
    </div>
  );
}
