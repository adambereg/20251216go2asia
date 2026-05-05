'use client';

import Link from 'next/link';
import { AlertCircle, ArrowRight, Clock3, ShieldCheck, Ticket } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button, Card } from '@go2asia/ui';
import { fetchMyVouchers, useRfVoucherSummary, type RfVoucherDto } from '@go2asia/sdk/rf';
import { selectRfVoucherProjection } from '@/lib/connectRfProjection';

function VoucherMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-xl font-bold text-slate-900">{value.toLocaleString('ru-RU')}</p>
    </div>
  );
}

function formatVoucherDate(value: string | null | undefined) {
  if (!value) return 'дата уточняется';
  return new Date(value).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

function getOfferTitle(voucher: RfVoucherDto) {
  return voucher.offer?.title || 'RF-ваучер';
}

function getPartnerTitle(voucher: RfVoucherDto) {
  return voucher.partner?.displayName || 'Партнёр RF';
}

function getVoucherStatusLabel(voucher: RfVoucherDto) {
  if (voucher.canonicalStatus === 'redeemed' || voucher.status === 'redeemed') return 'Использован';
  if (voucher.canonicalStatus === 'cancelled' || voucher.status === 'cancelled') return 'Отменён';
  return 'Активен';
}

function VoucherRow({ voucher, dateLabel }: { voucher: RfVoucherDto; dateLabel: string }) {
  return (
    <li className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{getOfferTitle(voucher)}</p>
          <p className="mt-1 truncate text-xs text-slate-600">{getPartnerTitle(voucher)}</p>
        </div>
        <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700">
          {getVoucherStatusLabel(voucher)}
        </span>
      </div>
      <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
        <Clock3 className="h-3.5 w-3.5" />
        {dateLabel}
      </p>
    </li>
  );
}

function VoucherListSection({
  title,
  empty,
  vouchers,
  dateFor,
}: {
  title: string;
  empty: string;
  vouchers: RfVoucherDto[];
  dateFor: (voucher: RfVoucherDto) => string;
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
      {vouchers.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {vouchers.map((voucher) => (
            <VoucherRow key={voucher.id} voucher={voucher} dateLabel={dateFor(voucher)} />
          ))}
        </ul>
      ) : (
        <p className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">{empty}</p>
      )}
    </div>
  );
}

export function VoucherSummaryCard() {
  const { data: summary, isError, isLoading, refetch } = useRfVoucherSummary();
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

  if (isLoading) {
    return (
      <Card className="p-6 mb-6">
        <div className="flex items-start gap-3 mb-5">
          <div className="p-2 bg-sky-100 rounded-lg">
            <Ticket className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">RF-ваучеры</h3>
            <p className="text-sm text-slate-600">Загружаем read-only состояние RF-ваучеров…</p>
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

  if (isError || !summary) {
    return (
      <Card className="p-6 mb-6 border border-amber-200 bg-amber-50">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-amber-900">RF-ваучеры временно недоступны</h3>
            <p className="text-sm text-amber-900/80 mt-1">
              Кошелёк Connect работает отдельно. Мы не подменяем RF-статусы локальными или тестовыми данными.
            </p>
            <Button variant="secondary" size="sm" className="mt-3" onClick={() => refetch()}>
              Повторить загрузку
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  const hasVouchers = summary.totalVouchers > 0;
  const projection = selectRfVoucherProjection(vouchers, 3);

  return (
    <Card className="p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-sky-100 rounded-lg">
            <Ticket className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">RF-ваучеры</h3>
            <p className="text-sm text-slate-600">
              {hasVouchers
                ? 'Read-only проекция ваших ваучеров Russian Friendly. Это не баланс кошелька.'
                : 'У вас пока нет RF-ваучеров. Сначала найдите предложение в Russian Friendly.'}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row md:w-auto w-full">
          <Link href="/rf/vouchers" className="md:w-auto w-full">
            <Button variant="secondary" size="sm" className="w-full md:w-auto">
              Найти предложения
            </Button>
          </Link>
          <Link href="/rf/my-vouchers" className="md:w-auto w-full">
            <Button variant="secondary" size="sm" className="w-full md:w-auto">
              Мои RF-ваучеры
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <VoucherMetric label="Всего" value={summary.totalVouchers} />
        <VoucherMetric label="Активные" value={summary.activeVouchers} />
        <VoucherMetric label="Использованные" value={summary.usedVouchers} />
        <VoucherMetric label="Отменённые" value={summary.cancelledVouchers} />
      </div>

      <div className="mt-5 rounded-xl border border-sky-100 bg-sky-50 p-4">
        <div className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-700" />
          <div className="text-sm text-sky-950">
            <p className="font-semibold">RF-ваучеры — это не баланс кошелька.</p>
            <p className="mt-1">
              Используйте их у партнёров Russian Friendly. Rewards / Points за ваучеры будут подключены позже.
            </p>
          </div>
        </div>
      </div>

      {!hasVouchers ? (
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">У вас пока нет RF-ваучеров</p>
          <p className="mt-1">Сначала найдите предложение в Russian Friendly и получите ваучер в RF-сценарии.</p>
          <Link href="/rf/vouchers" className="mt-3 inline-flex items-center text-sm font-medium text-sky-700 hover:underline">
            Найти предложения
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      ) : vouchersLoading ? (
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="h-28 rounded-xl bg-slate-100 animate-pulse" />
          <div className="h-28 rounded-xl bg-slate-100 animate-pulse" />
        </div>
      ) : vouchersError ? (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Не удалось загрузить список RF-ваучеров. Summary выше остаётся доступным, кошелёк Connect работает отдельно.
        </div>
      ) : (
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <VoucherListSection
            title="Активные RF-ваучеры"
            empty="Активных RF-ваучеров сейчас нет."
            vouchers={projection.active}
            dateFor={(voucher) => `Получен: ${formatVoucherDate(voucher.claimedAt)}`}
          />
          <VoucherListSection
            title="Последние использованные"
            empty="Использованных RF-ваучеров пока нет."
            vouchers={projection.used}
            dateFor={(voucher) => `Использован: ${formatVoucherDate(voucher.redeemedAt ?? voucher.statusChangedAt)}`}
          />
        </div>
      )}
    </Card>
  );
}
