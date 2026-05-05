'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import type { RfPartnerDto } from '@go2asia/sdk/rf';
import { useRfOffers, useRfPartners } from '@go2asia/sdk/rf';
import { Button } from '@go2asia/ui';
import {
  buildMerchantNextSteps,
  buildMerchantReadiness,
  summarizeMerchantPartner,
} from '@/lib/rfMerchantWorkspace';
import {
  getPartnerLocation,
  getPartnerPresentation,
  getPartnerTrust,
  getRfCityLabel,
  getRfCountryLabel,
} from '@/lib/rfFirstSliceContent';
import { RfBusinessCreatePanel } from '@/components/rf/live/RfBusinessCreatePanel';
import { OfferManagementPanel } from '@/components/rf/Merchant/Offers';
import { Check, ChevronRight, ExternalLink, Lock, Minus } from 'lucide-react';

function BetaAction({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint: string;
}) {
  return (
    <span title={hint} className="inline-flex">
      <Button type="button" variant="secondary" size="sm" disabled className="cursor-not-allowed gap-1 opacity-70">
        <Lock className="h-3.5 w-3.5" />
        {children}
      </Button>
    </span>
  );
}

export function MerchantWorkspace() {
  const { user, isLoaded: userLoaded } = useUser();
  const { data: partnersRes, isLoading: partnersLoading, isError: partnersError, refetch: refetchPartners } = useRfPartners();
  const { data: offersRes, isLoading: offersLoading, isError: offersError, refetch: refetchOffers } = useRfOffers();

  const partners = useMemo(() => partnersRes?.items ?? [], [partnersRes?.items]);
  const offers = useMemo(() => offersRes?.items ?? [], [offersRes?.items]);

  const myPartners = useMemo(() => {
    const uid = user?.id;
    if (!uid) return [];
    return partners.filter((p) => p.ownerUserId === uid);
  }, [partners, user?.id]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const activePartner: RfPartnerDto | null = useMemo(() => {
    if (myPartners.length === 0) return null;
    if (selectedId && myPartners.some((p) => p.id === selectedId)) {
      return myPartners.find((p) => p.id === selectedId)!;
    }
    return myPartners[0];
  }, [myPartners, selectedId]);

  const summary = useMemo(() => {
    if (!activePartner) return null;
    return summarizeMerchantPartner(activePartner, offers);
  }, [activePartner, offers]);

  const readiness = useMemo(() => {
    return buildMerchantReadiness(activePartner, summary?.offersForPartner ?? []);
  }, [activePartner, summary?.offersForPartner]);

  const nextSteps = useMemo(() => {
    return buildMerchantNextSteps(activePartner, summary?.offersForPartner ?? [], myPartners.length > 0);
  }, [activePartner, summary?.offersForPartner, myPartners.length]);

  const trust = activePartner ? getPartnerTrust(activePartner) : null;
  const presentation = activePartner ? getPartnerPresentation(activePartner) : null;

  const loading = !userLoaded || partnersLoading || offersLoading;
  const apiUnavailable =
    partnersError ||
    offersError ||
    (!partnersLoading && partnersRes === null) ||
    (!offersLoading && offersRes === null);

  if (!userLoaded) {
    return <p className="text-sm text-slate-600">Загрузка учётной записи…</p>;
  }

  if (!user?.id) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950">
        Войдите в аккаунт, чтобы увидеть кабинет партнёра.
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-16">
      {loading ? <p className="text-sm text-slate-600">Загрузка данных RF…</p> : null}

      {apiUnavailable && !loading ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Не удалось загрузить каталог RF (сеть или авторизация). Обновите страницу или проверьте вход.
        </div>
      ) : null}

      {/* Обзор */}
      <section id="mw-overview" className="scroll-mt-24">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Обзор</h1>
            <p className="mt-1 text-sm text-slate-600">
              Сводка по вашему месту в RF: статусы, предложения и связь с публичной витриной.
            </p>
          </div>
          {myPartners.length > 1 ? (
            <label className="flex flex-col text-xs text-slate-600">
              Активное место
              <select
                value={activePartner?.id ?? ''}
                onChange={(e) => setSelectedId(e.target.value)}
                className="mt-1 rounded-lg border border-slate-300 px-2 py-1.5 text-sm text-slate-900"
              >
                {myPartners.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.displayName}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>

        {!activePartner ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Партнёр не привязан к аккаунту</h2>
            <p className="mt-2 text-sm text-slate-600">
              По данным API у пользователя <span className="font-mono text-xs">{user.id}</span> пока нет партнёра с
              совпадающим ownerUserId. Создайте карточку ниже (beta) или обратитесь в RF для назначения владельца.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Место</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{activePartner.displayName}</p>
              <p className="mt-1 text-xs text-slate-600">{getPartnerLocation(activePartner)}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Статус профиля</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{activePartner.status}</p>
              {trust ? (
                <p className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${trust.tone}`}>{trust.label}</p>
              ) : null}
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Публичные активные офферы</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{summary?.publicActiveCount ?? 0}</p>
              <p className="mt-1 text-xs text-slate-500">Всего офферов: {summary?.totalOffers ?? 0}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Активные (любая видимость)</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{summary?.activeAnyVisibility ?? 0}</p>
              <p className="mt-1 text-xs text-slate-500">Публичная карточка доступна</p>
            </div>
          </div>
        )}
      </section>

      <section id="mw-my-partners" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Мои партнёры</h2>
            <p className="mt-1 text-sm text-slate-600">
              Временный owner-scope: список построен из live `GET /v1/rf/partners` и фильтруется по ownerUserId текущего пользователя.
            </p>
          </div>
          <a href="#mw-create-partner">
            <Button type="button" variant="primary" size="sm">
              Создать партнёра
            </Button>
          </a>
        </div>
        {myPartners.length === 0 ? (
          <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            У текущего аккаунта пока нет партнёров в RF.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {myPartners.map((partner) => {
              const partnerOffers = offers.filter((offer) => offer.partnerId === partner.id);
              const activeOffers = partnerOffers.filter((offer) => offer.status === 'active').length;
              return (
                <li key={partner.id} className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-slate-900">{partner.displayName}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          partner.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {partner.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">
                      {getRfCountryLabel(partner.countryId)} · {getRfCityLabel(partner.cityId)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Офферов: {partnerOffers.length} · активных: {activeOffers}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant={activePartner?.id === partner.id ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setSelectedId(partner.id)}
                  >
                    {activePartner?.id === partner.id ? 'Выбран' : 'Открыть'}
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {!activePartner && user?.id && !loading ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <section id="mw-profile" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Профиль партнёра</h2>
            <p className="mt-1 text-sm text-slate-600">
              Этот раздел станет доступен после привязки партнёра к аккаунту. Сейчас показываем только структуру кабинета.
            </p>
          </section>
          <section id="mw-offers" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Предложения</h2>
            <p className="mt-1 text-sm text-slate-600">
              Когда появится партнёр, здесь отобразится live-управление его офферами из RF API.
            </p>
          </section>
          <section id="mw-public" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Публичное представление</h2>
            <p className="mt-1 text-sm text-slate-600">
              Ссылки в публичный контур (`/rf`, `/rf/vouchers`, `/rf/map`) появятся после назначения партнёра.
            </p>
          </section>
        </div>
      ) : null}

      {!activePartner && user?.id && !loading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <section id="mw-readiness" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Статус и готовность</h2>
            <p className="mt-1 text-sm text-slate-600">Пока нет привязанного партнёра — чеклист отражает только это состояние.</p>
            <ul className="mt-4 space-y-3">
              {buildMerchantReadiness(null, []).map((item) => (
                <li
                  key={item.id}
                  className={`flex gap-3 rounded-xl border px-4 py-3 text-sm ${item.ok ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-200 bg-slate-50'}`}
                >
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${item.ok ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}
                  >
                    {item.ok ? <Check className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                  </span>
                  <div>
                    <p className="font-medium text-slate-900">{item.label}</p>
                    <p className="mt-0.5 text-xs text-slate-600">{item.hint}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <section id="mw-next" className="scroll-mt-24 rounded-2xl border border-blue-200 bg-blue-50/40 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-blue-950">Следующие шаги</h2>
            <ol className="mt-4 space-y-4">
              {buildMerchantNextSteps(null, [], false).map((step, i) => (
                <li key={step.id} className="flex gap-3 rounded-xl border border-blue-100 bg-white p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium text-slate-900">{step.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      ) : null}

      {activePartner && presentation ? (
        <>
          <section id="mw-profile" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Профиль партнёра</h2>
            <p className="mt-1 text-sm text-slate-600">
              Read-only сводка из RF API и support-слоя. Редактирование полей из кабинета пока не подключено.
            </p>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-slate-500">Название</dt>
                <dd className="text-sm text-slate-900">{activePartner.displayName}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Категория (витрина)</dt>
                <dd className="text-sm text-slate-900">{presentation.categoryLabel}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Страна / город</dt>
                <dd className="text-sm text-slate-900">
                  {getRfCountryLabel(activePartner.countryId)} · {getRfCityLabel(activePartner.cityId)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Район (support)</dt>
                <dd className="text-sm text-slate-900">{presentation.districtLabel}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium text-slate-500">Краткое позиционирование</dt>
                <dd className="text-sm text-slate-800">{presentation.tagline}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium text-slate-500">Описание (support / витрина)</dt>
                <dd className="text-sm text-slate-700">{presentation.story}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium text-slate-500">Теги сценария</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {presentation.atmosphereTags.length ? (
                    presentation.atmosphereTags.map((t) => (
                      <span key={t} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                        {t}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">Нет тегов в support-профиле</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Публичный статус в API</dt>
                <dd className="text-sm text-slate-900">{activePartner.status}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Идентификаторы</dt>
                <dd className="font-mono text-xs text-slate-600">partnerId: {activePartner.id}</dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-2">
              <BetaAction hint="Редактирование профиля из кабинета не сохраняется в RF на этом этапе.">
                Изменить профиль
              </BetaAction>
              <BetaAction hint="Медиа и обложка — отдельный будущий этап.">Загрузить медиа</BetaAction>
            </div>
          </section>

          <section id="mw-offers" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Предложения</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Базовое управление офферами через существующие RF endpoints: создание draft и активация.
                </p>
              </div>
              <Link href={`/rf/vouchers?partner=${encodeURIComponent(activePartner.id)}`}>
                <Button type="button" variant="secondary" size="sm" className="gap-1">
                  Как видят гости
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
            <div className="mt-4">
              <OfferManagementPanel
                partner={activePartner}
                offers={summary?.offersForPartner ?? []}
                onChanged={() => {
                  void refetchOffers();
                }}
              />
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Ваучеры гостей и ручной ввод кода — в разделе{' '}
              <Link href="/rf/merchant/vouchers" className="font-medium text-blue-700 hover:text-blue-800">
                Ваучеры
              </Link>
              .
            </p>
          </section>

          <section id="mw-readiness" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Статус и готовность</h2>
            <p className="mt-1 text-sm text-slate-600">
              Чеклист на основе текущих DTO и support-слоя. Это не полноценный moderation / validation engine.
            </p>
            <ul className="mt-4 space-y-3">
              {readiness.map((item) => (
                <li
                  key={item.id}
                  className={`flex gap-3 rounded-xl border px-4 py-3 text-sm ${item.ok ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-200 bg-slate-50'}`}
                >
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${item.ok ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}
                  >
                    {item.ok ? <Check className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                  </span>
                  <div>
                    <p className="font-medium text-slate-900">{item.label}</p>
                    <p className="mt-0.5 text-xs text-slate-600">{item.hint}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section id="mw-public" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Публичное представление</h2>
            <p className="mt-1 text-sm text-slate-600">
              Как гости видят ваше место во внешнем контуре RF (каталог, предложения, карта).
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={`/rf/${encodeURIComponent(activePartner.id)}`}
                className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-900 hover:bg-blue-100"
              >
                Карточка в каталоге мест
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/rf/vouchers?partner=${encodeURIComponent(activePartner.id)}`}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                Предложения партнёра (публичный каталог)
              </Link>
              <Link
                href={`/rf/map?city=${encodeURIComponent(activePartner.cityId)}`}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                Карта · {getRfCityLabel(activePartner.cityId)}
              </Link>
            </div>
          </section>

          <section id="mw-next" className="scroll-mt-24 rounded-2xl border border-blue-200 bg-blue-50/40 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-blue-950">Следующие шаги</h2>
            <p className="mt-1 text-sm text-blue-900/80">Ориентиры для операционной работы, без автоматического трекинга задач.</p>
            <ol className="mt-4 space-y-4">
              {nextSteps.map((step, i) => (
                <li key={step.id} className="flex gap-3 rounded-xl border border-blue-100 bg-white p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900">{step.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{step.detail}</p>
                    {step.href ? (
                      <Link href={step.href} className="mt-2 inline-flex text-sm font-medium text-blue-700 hover:text-blue-800">
                        {step.actionLabel ?? 'Перейти'}
                      </Link>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </>
      ) : null}

      <section id="mw-create-partner" className="scroll-mt-24 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
        <h2 className="text-sm font-semibold text-slate-900">Создание партнёра (live API, beta)</h2>
        <p className="mt-1 text-xs text-slate-600">
          Если партнёра ещё нет — форма ниже вызывает существующий endpoint. После создания обновите страницу, чтобы увидеть
          сводку.
        </p>
        <div className="mt-4">
          <RfBusinessCreatePanel
            onCreated={() => {
              void refetchPartners();
            }}
          />
        </div>
      </section>
    </div>
  );
}
