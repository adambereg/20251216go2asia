'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { fetchMyVouchers } from '@go2asia/sdk/rf';
import type { RfVoucherDto } from '@go2asia/sdk/rf';
import { useRfMyLocalVouchers } from '@/hooks/useRfLocalContour';
import { RfLocalStorageNotice } from '@/components/rf/Shared/RfLocalStorageNotice';
import { removeMyLocalVoucher } from '@/lib/rfLocalUserState';
import { rfMyVouchersPageContent } from '@/lib/rfFirstSliceContent';

function getVoucherStatusLabel(status: RfVoucherDto['status']) {
  if (status === 'claimed') return 'Получен';
  if (status === 'redeemed') return 'Использован';
  return 'Отменён';
}

function getVoucherScopeLabel(voucher: RfVoucherDto) {
  return voucher.claimScope === 'listing' && voucher.listingContext
    ? 'Ваучер для объекта'
    : 'Ваучер партнёра';
}

function getVoucherOfferTitle(voucher: RfVoucherDto) {
  return voucher.offer?.title || 'RF-ваучер';
}

function getVoucherPartnerName(voucher: RfVoucherDto) {
  return voucher.partner?.displayName || 'Партнёр уточняется';
}

function getVoucherBenefit(voucher: RfVoucherDto) {
  return voucher.offer?.benefit || 'Выгода уточняется у партнёра';
}

function getVoucherTerms(voucher: RfVoucherDto) {
  return voucher.offer?.terms || 'Условия уточняются у партнёра';
}

function getVoucherValidityLabel(voucher: RfVoucherDto) {
  return voucher.validityLabel || 'Срок действия уточняется у партнёра';
}

function getVoucherUsageInstruction(voucher: RfVoucherDto) {
  if (voucher.usage?.instruction) return voucher.usage.instruction;
  return voucher.claimScope === 'listing'
    ? 'Покажите ваучер представителю объекта и уточните применение выгоды.'
    : 'Покажите ваучер партнёру и уточните применение выгоды.';
}

function getVoucherUsageContactHint(voucher: RfVoucherDto) {
  if (voucher.usage?.contactHint) return voucher.usage.contactHint;
  return voucher.claimScope === 'listing'
    ? 'Свяжитесь с представителем объекта перед использованием.'
    : 'Свяжитесь с партнёром перед использованием.';
}

async function fetchMyVouchersWithTimeout() {
  return Promise.race([
    fetchMyVouchers(),
    new Promise<null>((resolve) => {
      window.setTimeout(() => resolve(null), 10_000);
    }),
  ]);
}

export function RfMyVouchersView() {
  const { isLoaded, isSignedIn } = useAuth();
  const rows = useRfMyLocalVouchers();
  const [serverVouchers, setServerVouchers] = useState<RfVoucherDto[] | null>(null);
  const [serverLoading, setServerLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setServerVouchers(null);
      setServerError('');
      return;
    }

    let cancelled = false;

    async function loadServerVouchers() {
      setServerLoading(true);
      setServerError('');
      try {
        const response = await fetchMyVouchersWithTimeout();
        if (cancelled) return;
        if (!response) {
          setServerVouchers(null);
          setServerError('Не удалось загрузить полученные ваучеры. Попробуйте позже.');
        } else {
          setServerVouchers(response.items);
        }
      } catch {
        if (!cancelled) {
          setServerVouchers(null);
          setServerError('Не удалось загрузить полученные ваучеры. Попробуйте позже.');
        }
      } finally {
        if (!cancelled) setServerLoading(false);
      }
    }

    void loadServerVouchers();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Полученные ваучеры</h2>
        <p className="mt-1 text-sm text-slate-600">
          Это серверные RF-ваучеры, выданные после нажатия “Получить ваучер”.
        </p>

        {!isLoaded ? (
          <p className="mt-4 text-sm text-slate-600">Проверяем авторизацию...</p>
        ) : !isSignedIn ? (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
            Войдите, чтобы увидеть полученные RF-ваучеры.
          </div>
        ) : serverLoading ? (
          <p className="mt-4 text-sm text-slate-600">Загружаем полученные ваучеры...</p>
        ) : serverError ? (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
            {serverError}
          </div>
        ) : serverVouchers && serverVouchers.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {serverVouchers.map((voucher) => (
              <li
                key={voucher.id}
                className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-900">
                        {getVoucherScopeLabel(voucher)}
                      </p>
                      <span className="inline-flex rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-medium text-emerald-900">
                        {getVoucherStatusLabel(voucher.status)}
                      </span>
                    </div>
                    {voucher.claimScope === 'listing' && voucher.listingContext ? (
                      <p className="mt-2 text-sm text-slate-700">
                        Объект:{' '}
                        {voucher.listingContext.listingTitle || voucher.listingContext.listingId}
                      </p>
                    ) : null}
                    <p className="mt-1 text-sm text-slate-700">
                      Партнёр: {getVoucherPartnerName(voucher)}
                    </p>
                    <p className="mt-3 text-base font-semibold text-slate-950">
                      {getVoucherOfferTitle(voucher)}
                    </p>
                    <dl className="mt-3 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          Выгода
                        </dt>
                        <dd className="mt-1">{getVoucherBenefit(voucher)}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          Условия
                        </dt>
                        <dd className="mt-1">{getVoucherTerms(voucher)}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          Срок действия
                        </dt>
                        <dd className="mt-1">{getVoucherValidityLabel(voucher)}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          Код
                        </dt>
                        <dd className="mt-1 font-mono text-slate-900">{voucher.code}</dd>
                      </div>
                    </dl>
                    <div className="mt-3 rounded-lg border border-emerald-100 bg-white/70 p-3 text-sm text-slate-700">
                      <p>{getVoucherUsageInstruction(voucher)}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {getVoucherUsageContactHint(voucher)}
                      </p>
                    </div>
                    <details className="mt-3 text-xs text-slate-500">
                      <summary className="cursor-pointer font-medium text-slate-600">
                        Технические детали
                      </summary>
                      <div className="mt-2 space-y-1">
                        <p>voucherId: {voucher.id}</p>
                        <p>offerId: {voucher.offerId}</p>
                        <p>partnerId: {voucher.partnerId}</p>
                      </div>
                    </details>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {voucher.claimScope === 'listing' && voucher.listingContext ? (
                      <Link
                        href={`/rf/rielt/listings/${encodeURIComponent(voucher.listingContext.listingId)}/vouchers`}
                        className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-800"
                      >
                        Ваучеры этого объекта
                      </Link>
                    ) : null}
                    <Link
                      href={`/rf/vouchers?partner=${encodeURIComponent(voucher.partnerId)}`}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50"
                    >
                      Предложения партнёра
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Полученных RF-ваучеров пока нет.
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Сохранённые предложения</h2>
          <p className="mt-1 text-sm text-slate-600">
            Это локальный список планирования в этом браузере.
          </p>
        </div>

        <RfLocalStorageNotice>{rfMyVouchersPageContent.localWarning}</RfLocalStorageNotice>

        {rows.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            {rfMyVouchersPageContent.empty}
          </div>
        ) : (
          <ul className="space-y-3">
            {rows.map((row) => (
              <li
                key={row.localId}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{row.title}</p>
                    <p className="text-xs text-slate-600">
                      {row.partnerDisplayName} · {rfMyVouchersPageContent.addedAt}:{' '}
                      {new Date(row.savedAt).toLocaleString('ru-RU')}
                    </p>
                    <span className="mt-2 inline-flex rounded-full bg-amber-100 px-2 py-1 text-[11px] font-medium text-amber-900">
                      {rfMyVouchersPageContent.statusLocal}
                    </span>
                    <p className="mt-2 text-[11px] text-slate-500">offerId: {row.offerId}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/rf/${encodeURIComponent(row.partnerId)}`}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
                    >
                      Открыть место
                    </Link>
                    <Link
                      href={`/rf/vouchers?partner=${encodeURIComponent(row.partnerId)}`}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50"
                    >
                      Офферы места
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeMyLocalVoucher(row.localId)}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-800 hover:bg-red-100"
                    >
                      {rfMyVouchersPageContent.remove}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/rf/vouchers" className="font-medium text-blue-700 hover:text-blue-800">
          К каталогу предложений
        </Link>
        <Link href="/rf" className="font-medium text-blue-700 hover:text-blue-800">
          К каталогу мест
        </Link>
      </div>
    </div>
  );
}
