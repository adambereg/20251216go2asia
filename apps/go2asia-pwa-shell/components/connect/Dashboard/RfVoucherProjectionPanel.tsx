'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, ArrowRight, Clock3, History, Ticket } from 'lucide-react';
import { Button, Card } from '@go2asia/ui';
import { fetchMyVouchers, type RfVoucherDto } from '@go2asia/sdk/rf';
import {
  buildRfVoucherTimelineItems,
  formatRfVoucherLabel,
  formatRfVoucherPartnerName,
  getRfVoucherEffectiveStatus,
  getRfVoucherListingSourceLabel,
  splitRfVouchersByProjectionStatus,
  type RfVoucherTimelineItem,
} from '@/lib/connectRfProjection';

function formatDate(value: string | null | undefined) {
  if (!value) return 'дата уточняется';
  return new Date(value).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getStatusLabel(voucher: RfVoucherDto) {
  const status = getRfVoucherEffectiveStatus(voucher);
  if (status === 'redeemed') return 'Использован';
  if (status === 'cancelled') return 'Отменён';
  if (status === 'expired') return 'Истёк';
  return 'Активен';
}

function VoucherProjectionRow({
  voucher,
  dateLabel,
}: {
  voucher: RfVoucherDto;
  dateLabel: string;
}) {
  const listingSource = getRfVoucherListingSourceLabel(voucher);

  return (
    <li className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{formatRfVoucherLabel(voucher)}</p>
          <p className="mt-1 truncate text-sm text-slate-600">{formatRfVoucherPartnerName(voucher)}</p>
          {listingSource ? <p className="mt-2 text-xs text-slate-500">{listingSource}</p> : null}
        </div>
        <span className="w-fit shrink-0 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-800">
          {getStatusLabel(voucher)}
        </span>
      </div>
      <p className="mt-3 flex items-center gap-1 text-xs text-slate-500">
        <Clock3 className="h-3.5 w-3.5" />
        {dateLabel}
      </p>
    </li>
  );
}

function VoucherGroup({
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
    <section>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {vouchers.length > 0 ? (
        <ul className="mt-3 space-y-3">
          {vouchers.map((voucher) => (
            <VoucherProjectionRow key={voucher.id} voucher={voucher} dateLabel={dateFor(voucher)} />
          ))}
        </ul>
      ) : (
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">{empty}</p>
      )}
    </section>
  );
}

function TimelineRow({ item }: { item: RfVoucherTimelineItem }) {
  return (
    <li className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sky-700">
        <History className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-900">{item.title}</p>
        <p className="mt-1 truncate text-sm text-slate-600">{item.description}</p>
        <p className="mt-1 text-xs text-slate-500">{formatDate(item.occurredAt)}</p>
      </div>
    </li>
  );
}

export function RfVoucherProjectionPanel() {
  const {
    data: vouchers = [],
    isLoading,
    isError,
    refetch,
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
      <Card className="p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-sky-100 p-2">
            <Ticket className="h-5 w-5 text-sky-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Мои RF-ваучеры в Connect</h2>
            <p className="text-sm text-slate-600">Загружаем lifecycle-состояние RF-ваучеров…</p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="h-40 rounded-xl bg-slate-100 animate-pulse" />
          <div className="h-40 rounded-xl bg-slate-100 animate-pulse" />
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="p-5 border border-amber-200 bg-amber-50">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-amber-900">RF-ваучеры временно недоступны</h2>
            <p className="mt-1 text-sm text-amber-900/80">
              Не удалось загрузить подробности RF-ваучеров. Остальной dashboard остаётся доступен.
            </p>
            <Button variant="secondary" size="sm" className="mt-3" onClick={() => refetch()}>
              Повторить загрузку
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  const split = splitRfVouchersByProjectionStatus(vouchers);
  const active = split.active.slice(0, 5);
  const used = split.used.slice(0, 5);
  const timeline = buildRfVoucherTimelineItems(vouchers, 5);
  const hasVouchers = vouchers.length > 0;

  return (
    <Card className="p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-sky-100 p-2">
            <Ticket className="h-5 w-5 text-sky-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Детали RF-ваучеров</h2>
            <p className="text-sm text-slate-600">
              Активные, использованные и последние lifecycle-события.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href="/rf/my-vouchers">
            <Button variant="secondary" size="sm" className="w-full sm:w-auto">
              Все RF-ваучеры
            </Button>
          </Link>
        </div>
      </div>

      {!hasVouchers ? (
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">У вас пока нет RF-ваучеров</p>
          <p className="mt-1">Сначала найдите предложение в Russian Friendly.</p>
          <Link href="/rf/vouchers" className="mt-3 inline-flex items-center text-sm font-medium text-sky-700 hover:underline">
            Найти предложения
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <VoucherGroup
              title="Активные RF-ваучеры"
              empty="Активных RF-ваучеров сейчас нет."
              vouchers={active}
              dateFor={(voucher) => `Получен/обновлён: ${formatDate(voucher.statusChangedAt ?? voucher.claimedAt)}`}
            />
            <VoucherGroup
              title="Использованные RF-ваучеры"
              empty="Использованных RF-ваучеров пока нет."
              vouchers={used}
              dateFor={(voucher) => `Использован: ${formatDate(voucher.redeemedAt ?? voucher.statusChangedAt)}`}
            />
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            Прочие статусы: отменённые — {split.cancelled.length.toLocaleString('ru-RU')}, истёкшие/другие —{' '}
            {split.other.length.toLocaleString('ru-RU')}. Полный список остаётся в RF.
          </div>

          <section className="mt-5">
            <div className="mb-3 flex items-center gap-2">
              <History className="h-4 w-4 text-slate-600" />
              <h3 className="text-sm font-semibold text-slate-900">Активность RF-ваучеров</h3>
            </div>
            {timeline.length > 0 ? (
              <ul className="space-y-3">
                {timeline.map((item) => (
                  <TimelineRow key={item.id} item={item} />
                ))}
              </ul>
            ) : (
              <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Подробная история RF-ваучеров появится после отдельного RF activity endpoint.
              </p>
            )}
          </section>
        </>
      )}
    </Card>
  );
}
