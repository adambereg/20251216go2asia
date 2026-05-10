'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { fetchMyVouchers, useRfVoucherSummary, type RfVoucherDto } from '@go2asia/sdk/rf';
import { buildConnectRfProjection, hasRfVouchersForConnectDashboard } from '@/lib/connectRfProjection';
import { RfEconomicMeaningCard } from './RfEconomicMeaningCard';
import { RfVoucherProjectionPanel } from './RfVoucherProjectionPanel';
import { VoucherSummaryCard } from './VoucherSummaryCard';
import { CONNECT_RF_DASHBOARD_VOUCHERS_QUERY_KEY } from './connectRfQueryContract';

export function ConnectRfSection() {
  const {
    data: summary,
    isLoading: summaryLoading,
    isError: summaryError,
    refetch: refetchSummary,
  } = useRfVoucherSummary();

  const {
    data: vouchers = [],
    isLoading: vouchersLoading,
    isError: vouchersError,
    refetch: refetchVouchers,
  } = useQuery<RfVoucherDto[]>({
    queryKey: CONNECT_RF_DASHBOARD_VOUCHERS_QUERY_KEY,
    queryFn: async () => {
      const response = await fetchMyVouchers();
      if (!response) throw new Error('RF vouchers unavailable');
      return response.items;
    },
    staleTime: 30_000,
    retry: 1,
  });

  const isLoading = summaryLoading || vouchersLoading;
  const isError = summaryError || vouchersError || !summary;
  const projection = useMemo(() => buildConnectRfProjection(vouchers, summary), [summary, vouchers]);
  const hasVouchers = hasRfVouchersForConnectDashboard(summary, vouchers);
  const hasVoucherRows = vouchers.length > 0;

  const handleRetry = () => {
    refetchSummary();
    refetchVouchers();
  };

  return (
    <section className="mb-6 space-y-4">
      <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Russian Friendly в Connect</h2>
            <p className="mt-1 text-sm text-slate-700">
              Connect показывает производную read-only проекцию RF-активности как часть профиля и прогресса.
            </p>
          </div>
          <div className="grid gap-2 text-sm text-sky-950 lg:max-w-xl">
            <div className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" />
              <p>RF остаётся owner domain: Connect только читает факты по ваучерам, использованию и PRO-отметкам.</p>
            </div>
            <div className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" />
              <p>В этом блоке нет финансовых показателей: только текстовая сводка, активность и этапы.</p>
            </div>
          </div>
        </div>
      </div>

      <VoucherSummaryCard
        projection={projection}
        hasVouchers={hasVouchers}
        isLoading={isLoading}
        isError={isError}
        onRetry={handleRetry}
      />
      <RfEconomicMeaningCard projection={projection} isLoading={isLoading} isError={isError} onRetry={handleRetry} />
      <RfVoucherProjectionPanel
        projection={projection}
        hasVouchers={hasVouchers}
        hasVoucherRows={hasVoucherRows}
        isLoading={isLoading}
        isError={isError}
        onRetry={handleRetry}
      />
    </section>
  );
}
