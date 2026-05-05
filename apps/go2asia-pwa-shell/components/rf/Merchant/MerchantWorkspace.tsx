'use client';

import { useMemo, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import type { RfPartnerDto } from '@go2asia/sdk/rf';
import { useRfOffers, useRfPartners } from '@go2asia/sdk/rf';
import { Button } from '@go2asia/ui';
import {
  getPartnerLocation,
  getRfCityLabel,
  getRfCountryLabel,
} from '@/lib/rfFirstSliceContent';
import {
  proOwnerAcceptBoundaryCopy,
  proOwnerAcceptEndpointGapCopy,
  proOwnerAcceptEndpointRecommendation,
} from '@/lib/rfProLinks';
import { RfBusinessCreatePanel } from '@/components/rf/live/RfBusinessCreatePanel';
import { OfferManagementPanel } from '@/components/rf/Merchant/Offers';

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

  const activePartnerOffers = useMemo(
    () => (activePartner ? offers.filter((offer) => offer.partnerId === activePartner.id) : []),
    [activePartner, offers],
  );

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
    <div className="space-y-8 pb-16">
      {loading ? <p className="text-sm text-slate-600">Загрузка данных RF…</p> : null}

      {apiUnavailable && !loading ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Не удалось загрузить каталог RF (сеть или авторизация). Обновите страницу или проверьте вход.
        </div>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Кабинет партнёра</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Управление партнёрами, офферами и погашением ваучеров RF. Данные берутся из live RF API.
            </p>
          </div>
          <a href="#mw-create-partner">
            <Button type="button" variant="primary" size="sm">
              Создать партнёра
            </Button>
          </a>
        </div>
      </section>

      <section id="mw-my-partners" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Мои партнёры</h2>
            <p className="mt-1 text-sm text-slate-600">
              Партнёры, привязанные к текущему аккаунту.
            </p>
          </div>
          {myPartners.length > 1 ? (
            <label className="flex flex-col text-xs text-slate-600">
              Активный партнёр
              <select
                value={activePartner?.id ?? ''}
                onChange={(e) => setSelectedId(e.target.value)}
                className="mt-1 rounded-lg border border-slate-300 px-2 py-1.5 text-sm text-slate-900"
              >
                {myPartners.map((partner) => (
                  <option key={partner.id} value={partner.id}>
                    {partner.displayName}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
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
                      {getRfCountryLabel(partner.countryId)} · {getRfCityLabel(partner.cityId)} · {getPartnerLocation(partner)}
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

      <section id="mw-pro-requests" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Stage 5.1b gap</p>
            <h2 className="text-lg font-semibold text-slate-900">PRO-запросы</h2>
            <p className="mt-1 max-w-3xl text-sm text-slate-600">{proOwnerAcceptBoundaryCopy}</p>
          </div>
          {activePartner ? (
            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
              Активный партнёр: {activePartner.displayName}
            </span>
          ) : null}
        </div>

        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <p className="font-semibold">{proOwnerAcceptEndpointRecommendation}</p>
          <p className="mt-1">{proOwnerAcceptEndpointGapCopy}</p>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Что уже работает</p>
            <p className="mt-1 text-xs text-slate-600">
              PRO может отправить pending-запрос через существующий rf_pro_link lifecycle.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Что нужно для live accept UI</p>
            <p className="mt-1 text-xs text-slate-600">
              Owner-scoped список запросов по owned partners, чтобы безопасно получить proLinkId для кнопки принятия.
            </p>
          </div>
        </div>
      </section>

      <section id="mw-offers" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Мои офферы</h2>
          <p className="mt-1 text-sm text-slate-600">
            Создание draft-оффера и активация для выбранного партнёра.
          </p>
        </div>
        {activePartner ? (
          <div className="mt-4">
            <OfferManagementPanel
              partner={activePartner}
              offers={activePartnerOffers}
              onChanged={() => {
                void refetchOffers();
              }}
            />
          </div>
        ) : (
          <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Создайте партнёра, чтобы управлять офферами.
          </p>
        )}
      </section>

      <section id="mw-create-partner" className="scroll-mt-24 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
        <h2 className="text-sm font-semibold text-slate-900">Создание партнёра</h2>
        <p className="mt-1 text-xs text-slate-600">
          Форма вызывает существующий RF endpoint и обновляет список партнёров после успешного создания.
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
