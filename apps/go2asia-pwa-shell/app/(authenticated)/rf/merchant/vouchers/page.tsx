import type { Metadata } from 'next';
import { CodeRedeem } from '@/components/rf/Merchant/Vouchers/CodeRedeem';

export const metadata: Metadata = {
  title: 'Погашение ваучеров | Кабинет партнёра | Russian Friendly',
  description: 'Live-погашение RF ваучеров партнёром',
};

export default function MerchantVouchersPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
        Этот экран выполняет live-погашение через RF backend. Управление офферами находится в главном кабинете партнёра.
      </div>
      <section className="max-w-2xl">
        <CodeRedeem />
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Операции с ваучерами</h2>
        <p className="mt-2 text-sm text-slate-600">
          Список выданных и погашенных ваучеров будет доступен в следующих версиях.
        </p>
      </section>
    </div>
  );
}

