import type { Metadata } from 'next';
import { VouchersListView, CodeRedeem } from '@/components/rf/Merchant/Vouchers';

export const metadata: Metadata = {
  title: 'Ваучеры (demo) | Кабинет партнёра | Russian Friendly',
  description: 'Demo-слой ваучеров для merchant baseline: UI и сценарии без live управления',
};

export default function MerchantVouchersPage() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
        Раздел «Ваучеры» в текущем этапе — demo baseline. Здесь нет live записи/редактирования ваучеров в RF backend.
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <VouchersListView />
        </div>
        <div className="lg:col-span-1">
          <CodeRedeem />
        </div>
      </div>
    </div>
  );
}

