'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, ArrowRight, Compass } from 'lucide-react';
import { Button, Card } from '@go2asia/ui';
import { fetchMyVouchers, useRfVoucherSummary, type RfVoucherDto } from '@go2asia/sdk/rf';
import { buildRfEconomicMeaning } from '@/lib/connectRfProjection';

export function RfEconomicMeaningCard() {
  const {
    data: summary,
    isLoading: summaryLoading,
    isError: summaryError,
  } = useRfVoucherSummary();
  const {
    data: vouchers = [],
    isLoading: vouchersLoading,
    isError: vouchersError,
  } = useQuery<RfVoucherDto[]>({
    queryKey: ['rf', 'me', 'vouchers', 'connect-projection'],
    queryFn: async () => {
      const response = await fetchMyVouchers();
      if (!response) throw new Error('RF vouchers unavailable');
      return response.items;
    },
    staleTime: 30_000,
    retry: 1,
  });

  if (summaryLoading || vouchersLoading) {
    return (
      <Card className="p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-emerald-100 p-2">
            <Compass className="h-5 w-5 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Ваш RF-прогресс</h2>
            <p className="text-sm text-slate-600">Готовим смысловую подсказку по вашим RF-ваучерам…</p>
          </div>
        </div>
        <div className="mt-5 h-24 rounded-xl bg-slate-100 animate-pulse" />
      </Card>
    );
  }

  if (summaryError || vouchersError) {
    return (
      <Card className="p-5 border border-amber-200 bg-amber-50">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
          <div>
            <h2 className="text-lg font-semibold text-amber-900">RF-прогресс временно недоступен</h2>
            <p className="mt-1 text-sm text-amber-900/80">
              Не удалось интерпретировать RF-состояние. Сводка и детали могут загрузиться отдельно.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const meaning = buildRfEconomicMeaning(vouchers, summary);

  return (
    <Card className="p-5 border border-emerald-100 bg-emerald-50/50">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-emerald-100 p-2">
            <Compass className="h-5 w-5 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Ваш RF-прогресс</h2>
            <p className="mt-1 text-sm font-medium text-slate-900">{meaning.title}</p>
            <p className="mt-1 text-sm text-slate-600">{meaning.summary}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row lg:shrink-0">
          {meaning.ctas.map((cta) => (
            <Link key={`${cta.href}-${cta.label}`} href={cta.href}>
              <Button variant="secondary" size="sm" className="w-full sm:w-auto">
                {cta.label}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <ul className="space-y-2">
          {meaning.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2 text-sm text-slate-700">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
