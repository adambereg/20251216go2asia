import type { Metadata } from 'next';
import { CodeRedeem } from '@/components/rf/Merchant/Vouchers';

export const metadata: Metadata = {
  title: 'Погашение ваучеров | Кабинет партнёра | Russian Friendly',
  description: 'Live-погашение RF ваучеров партнёром',
};

export default function MerchantVouchersPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
        Этот экран выполняет только live-погашение через RF backend. Demo-список ваучеров отключён от рабочего UI,
        управление офферами перенесено в главный кабинет партнёра.
      </div>
      <div className="max-w-2xl">
        <CodeRedeem />
      </div>
    </div>
  );
}

