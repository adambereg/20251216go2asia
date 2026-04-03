import type { Metadata } from 'next';
import { RfBusinessCreatePanel } from '@/components/rf/live/RfBusinessCreatePanel';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Кабинет партнёра | Russian Friendly | Go2Asia',
  description: 'Управление профилем партнёра, ваучерами и статистикой',
};

export default function MerchantDashboardPage() {
  return (
    <main className="container mx-auto py-6">
      <h1 className="text-2xl font-semibold mb-2">Кабинет партнёра (beta)</h1>
      <p className="text-sm text-slate-600 max-w-3xl mb-6">
        Это beta-зона RF модуля. Сейчас доступны базовые рабочие сценарии: создание партнёрской карточки и чтение ваучеров.
        Полный кабинет с расширенной операционной функциональностью остаётся в отдельном этапе.
      </p>
      <RfBusinessCreatePanel />
    </main>
  );
}
