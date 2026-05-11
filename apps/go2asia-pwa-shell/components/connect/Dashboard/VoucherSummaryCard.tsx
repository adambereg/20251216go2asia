'use client';

import Link from 'next/link';
import { AlertCircle, Ticket } from 'lucide-react';
import { Button, Card } from '@go2asia/ui';
import type { ConnectRfProjection } from '@/lib/connectRfProjection';

function VoucherMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-xl font-bold text-slate-900">{value.toLocaleString('ru-RU')}</p>
    </div>
  );
}

interface VoucherSummaryCardProps {
  projection: ConnectRfProjection;
  hasVouchers: boolean;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function VoucherSummaryCard({ projection, hasVouchers, isLoading, isError, onRetry }: VoucherSummaryCardProps) {
  if (isLoading) {
    return (
      <Card className="p-5">
        <div className="flex items-start gap-3 mb-5">
          <div className="p-2 bg-sky-100 rounded-lg">
            <Ticket className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">RF-ваучеры</h3>
            <p className="text-sm text-slate-600">Загружаем сводку RF-ваучеров…</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-16 rounded-lg bg-slate-100 animate-pulse" />
          ))}
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="p-5 border border-amber-200 bg-amber-50">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-amber-900">RF-ваучеры временно недоступны</h3>
            <p className="text-sm text-amber-900/80 mt-1">
              Не удалось загрузить RF-сводку. Остальной dashboard остаётся доступен.
            </p>
            <Button variant="secondary" size="sm" className="mt-3" onClick={onRetry}>
              Повторить загрузку
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-sky-100 rounded-lg">
            <Ticket className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">RF-ваучеры</h3>
            <p className="text-sm text-slate-600">
              {hasVouchers
                ? 'Короткая read-only сводка по вашей RF-активности в Connect.'
                : 'У вас пока нет RF-ваучеров. Сначала найдите предложение в Russian Friendly.'}
            </p>
          </div>
        </div>

        <Link href="/rf/vouchers" className="md:w-auto w-full">
          <Button variant="secondary" size="sm" className="w-full md:w-auto">
            Найти предложения
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <VoucherMetric label="Всего ваучеров" value={projection.summary.total} />
        <VoucherMetric label="Активные возможности" value={projection.summary.active} />
        <VoucherMetric label="Использованные преимущества" value={projection.summary.used} />
        <VoucherMetric label="Получено через PRO" value={projection.summary.receivedViaPro} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-slate-600">
        <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
          Ожидает активации: <span className="font-semibold text-slate-900">{projection.summary.pendingActivation}</span>
        </p>
        <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
          Можно получить снова: <span className="font-semibold text-slate-900">{projection.summary.repeatableAvailable}</span>
        </p>
      </div>
    </Card>
  );
}
