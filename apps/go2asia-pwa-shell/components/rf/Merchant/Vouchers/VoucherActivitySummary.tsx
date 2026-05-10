'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@go2asia/ui';
import { useRfPartnerVoucherActivitySummary, useRfPartners } from '@go2asia/sdk/rf';
import {
  formatMerchantVoucherActivityDate,
  merchantVoucherActivityBoundaryCopy,
  resolveMerchantVoucherActivityViewState,
} from '@/lib/rfMerchantVoucherActivitySummary';

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-900">{value.toLocaleString('ru-RU')}</p>
    </div>
  );
}

export function VoucherActivitySummary() {
  const { data: partnersRes, isLoading: partnersLoading } = useRfPartners();
  const activePartners = useMemo(
    () => (partnersRes?.items ?? []).filter((partner) => partner.status === 'active'),
    [partnersRes?.items]
  );
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('');

  useEffect(() => {
    if (selectedPartnerId) return;
    if (activePartners.length === 0) return;
    setSelectedPartnerId(activePartners[0]!.id);
  }, [activePartners, selectedPartnerId]);

  const {
    data: summary,
    isLoading: summaryLoading,
    isError: summaryError,
    refetch: refetchSummary,
  } = useRfPartnerVoucherActivitySummary(selectedPartnerId || null);

  const state = resolveMerchantVoucherActivityViewState({
    partnersLoading,
    activePartnersCount: activePartners.length,
    summaryLoading,
    summaryError,
    summary,
  });

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">RF voucher visibility</h2>
          <p className="mt-1 text-sm text-slate-600">Read-only voucher activity summary для партнёра.</p>
          <p className="mt-1 text-xs text-slate-500">{merchantVoucherActivityBoundaryCopy}</p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => void refetchSummary()}
          disabled={state === 'loading_partners' || state === 'loading_summary' || !selectedPartnerId}
        >
          Обновить
        </Button>
      </div>

      {activePartners.length > 0 ? (
        <label className="mt-4 block text-xs font-medium text-slate-700">
          Партнёр
          <select
            value={selectedPartnerId}
            onChange={(event) => setSelectedPartnerId(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 md:max-w-xl"
          >
            {activePartners.map((partner) => (
              <option key={partner.id} value={partner.id}>
                {partner.displayName}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {state === 'loading_partners' ? <p className="mt-4 text-sm text-slate-600">Загрузка партнёров...</p> : null}

      {state === 'no_active_partner' ? (
        <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          Нет активных партнёров для read-only сводки.
        </p>
      ) : null}

      {state === 'loading_summary' ? <p className="mt-4 text-sm text-slate-600">Загрузка сводки активности...</p> : null}

      {state === 'error' ? (
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Не удалось загрузить read-only сводку активности ваучеров.
        </p>
      ) : null}

      {state === 'empty' ? (
        <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          Для выбранного партнёра пока нет ваучерной активности.
        </p>
      ) : null}

      {state === 'ready' && summary ? (
        <div className="mt-4 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <MetricCard label="Всего ваучеров" value={summary.summary.total} />
            <MetricCard label="Активные" value={summary.summary.active} />
            <MetricCard label="Использованные" value={summary.summary.redeemed} />
            <MetricCard label="Истёкшие/недоступные" value={summary.summary.expiredOrUnavailable} />
            <MetricCard label="Офферов с активностью" value={summary.summary.offersWithActivity} />
            <MetricCard label="С PRO-отметкой" value={summary.summary.proAttributed} />
          </div>
          <p className="text-xs text-slate-500">
            Последняя активность: <span className="font-medium text-slate-700">{formatMerchantVoucherActivityDate(summary.summary.lastActivityAt)}</span>
          </p>
        </div>
      ) : null}
    </section>
  );
}
