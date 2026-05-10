'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
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
      <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-4">
        <h2 className="text-base font-semibold text-slate-900">Russian Friendly в Connect</h2>
        <p className="mt-1 text-sm text-slate-700">
          Краткая read-only сводка RF-активности. RF остаётся owner domain; Connect только объясняет факты без финансовых показателей.
        </p>
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
