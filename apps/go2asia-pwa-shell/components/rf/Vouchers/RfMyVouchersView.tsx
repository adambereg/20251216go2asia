'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { fetchMyVouchers } from '@go2asia/sdk/rf';
import type { RfVoucherDto } from '@go2asia/sdk/rf';
import { useRfLocalVoucherOwnerState, useRfMyLocalVouchers } from '@/hooks/useRfLocalContour';
import { RfLocalStorageNotice } from '@/components/rf/Shared/RfLocalStorageNotice';
import { removeMyLocalVoucher } from '@/lib/rfLocalUserState';
import { rfMyVouchersPageContent } from '@/lib/rfFirstSliceContent';
import { getItemLabelForOffer } from '@/lib/rfMerchantItems';

function getVoucherStatusLabel(status: RfVoucherDto['status']) {
  if (status === 'claimed') return 'Получен';
  if (status === 'redeemed') return 'Использован';
  return 'Отменён';
}

function getVoucherStatusBadgeClass(status: RfVoucherDto['status']) {
  if (status === 'claimed') return 'bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200';
  if (status === 'redeemed') return 'bg-slate-100 text-slate-700 ring-1 ring-slate-200';
  return 'bg-red-100 text-red-800 ring-1 ring-red-200';
}

function isListingVoucher(voucher: RfVoucherDto) {
  return voucher.claimScope === 'listing' && Boolean(voucher.listingContext);
}

function getVoucherScopeLabel(voucher: RfVoucherDto) {
  return isListingVoucher(voucher) ? 'Ваучер для объекта' : 'Ваучер партнёра';
}

function getVoucherOfferTitle(voucher: RfVoucherDto) {
  return voucher.offer?.title || 'RF-ваучер';
}

function getVoucherItemLabel(voucher: RfVoucherDto) {
  const offer = voucher.offer as ({ itemId?: string | null } & NonNullable<RfVoucherDto['offer']>) | undefined;
  return getItemLabelForOffer({ itemId: offer?.itemId ?? null });
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

function getVoucherShortValidityLabel() {
  return 'Срок: уточняется';
}

function getVoucherShortUsageLabel(voucher: RfVoucherDto) {
  return isListingVoucher(voucher) ? 'Покажите ваучер представителю объекта' : 'Покажите ваучер партнёру';
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
  const localVoucherOwner = useRfLocalVoucherOwnerState();
  const rows = useRfMyLocalVouchers(localVoucherOwner.ownerKey, localVoucherOwner.isReady);
  const [serverVouchers, setServerVouchers] = useState<RfVoucherDto[] | null>(null);
  const [serverLoading, setServerLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const listingVouchers = serverVouchers?.filter(isListingVoucher) ?? [];
  const partnerVouchers = serverVouchers?.filter((voucher) => !isListingVoucher(voucher)) ?? [];
  const showVoucherGroups = listingVouchers.length > 0 && partnerVouchers.length > 0;

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
        <h2 className="text-lg font-semibold text-slate-900">Полученные ваучеры (сервер)</h2>
        <p className="mt-1 text-sm text-slate-600">
          Это реальные RF-ваучеры из backend, выданные через claim-flow.
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
          <div className="mt-4 space-y-5">
            {[
              { title: 'Для объектов', items: listingVouchers },
              { title: 'От партнёров', items: partnerVouchers },
            ].map((group) =>
              group.items.length > 0 ? (
                <div key={group.title} className="space-y-2">
                  {showVoucherGroups ? (
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {group.title}
                    </h3>
                  ) : null}
                  <ul className="space-y-3">
                    {group.items.map((voucher) => {
                      const itemLabel = getVoucherItemLabel(voucher);
                      return (
                        <li
                          key={voucher.id}
                          className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 hover:shadow-md"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-900">
                                  {getVoucherScopeLabel(voucher)}
                                </p>
                                <span
                                  className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${getVoucherStatusBadgeClass(voucher.status)}`}
                                >
                                  {getVoucherStatusLabel(voucher.status)}
                                </span>
                              </div>
                              <p className="mt-2 text-base font-semibold text-slate-950">
                                {getVoucherOfferTitle(voucher)}
                              </p>
                              {itemLabel ? (
                                <p className="mt-1 text-sm text-slate-700">
                                  <span className="font-medium text-slate-800">Товар или услуга: </span>
                                  {itemLabel}
                                </p>
                              ) : null}
                              <p className="mt-1 text-sm text-slate-700">
                                {getVoucherPartnerName(voucher)}
                              </p>
                              {isListingVoucher(voucher) && voucher.listingContext ? (
                                <p className="mt-1 truncate text-sm text-slate-600">
                                  Объект: {voucher.listingContext.listingTitle || voucher.listingContext.listingId}
                                </p>
                              ) : null}
                              <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
                                <span className="rounded-full bg-white/80 px-2 py-1">
                                  {getVoucherShortValidityLabel()}
                                </span>
                                <span className="rounded-full bg-white/80 px-2 py-1">
                                  {getVoucherShortUsageLabel(voucher)}
                                </span>
                                <span className="rounded-full bg-white/80 px-2 py-1 font-mono text-slate-800">
                                  {voucher.code}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 sm:justify-end">
                              {isListingVoucher(voucher) && voucher.listingContext ? (
                                <Link
                                  href={`/rf/rielt/listings/${encodeURIComponent(voucher.listingContext.listingId)}/vouchers`}
                                  className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-medium text-white transition hover:bg-emerald-800"
                                >
                                  Ваучеры этого объекта
                                </Link>
                              ) : null}
                              <Link
                                href={`/rf/vouchers?partner=${encodeURIComponent(voucher.partnerId)}`}
                                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 transition hover:bg-slate-50"
                              >
                                Офферы партнёра
                              </Link>
                            </div>
                          </div>

                          <details className="group/details mt-3 border-t border-emerald-100 pt-2 text-sm text-slate-700">
                          <summary className="cursor-pointer list-none font-medium text-emerald-900 transition hover:text-emerald-700">
                            <span className="inline-flex items-center gap-1">
                              Условия и использование
                              <span className="transition-transform duration-200 group-open/details:rotate-180">
                                ▾
                              </span>
                            </span>
                          </summary>
                          <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-200 ease-out group-open/details:grid-rows-[1fr]">
                            <div className="overflow-hidden">
                              <dl className="mt-3 grid gap-3 sm:grid-cols-2">
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
                              <div className="mt-3 rounded-lg border border-emerald-100 bg-white/70 p-3">
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
                          </div>
                          </details>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null
            )}
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Полученных RF-ваучеров пока нет.
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Сохранённые офферы</h2>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-amber-700">
            Локально, не ваучеры
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {localVoucherOwner.isReady && !localVoucherOwner.isSignedIn
              ? 'Список хранится локально в этом браузере.'
              : 'Список хранится локально в этом браузере и привязан к текущему аккаунту.'}
          </p>
        </div>

        <RfLocalStorageNotice>
          {localVoucherOwner.isReady && !localVoucherOwner.isSignedIn
            ? 'Список хранится локально в этом браузере. Это не серверный ваучер.'
            : rfMyVouchersPageContent.localWarning}
        </RfLocalStorageNotice>

        {!localVoucherOwner.isReady ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            Проверяем текущий аккаунт перед загрузкой сохранённых офферов...
          </div>
        ) : rows.length === 0 ? (
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
                      onClick={() => removeMyLocalVoucher(row.localId, localVoucherOwner.ownerKey)}
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
          К каталогу офферов
        </Link>
        <Link href="/rf" className="font-medium text-blue-700 hover:text-blue-800">
          К каталогу мест
        </Link>
      </div>
    </div>
  );
}
