'use client';

import { useMemo, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { customInstance, generated } from '@go2asia/sdk';
import type { RfPartnerDto, RfProLinkDto } from '@go2asia/sdk/rf';
import { acceptProLink, endProLink, listPartnerProLinks, rejectProLink, useRfOffers, useRfPartners } from '@go2asia/sdk/rf';
import { Button } from '@go2asia/ui';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getPartnerLocation,
  getRfCityLabel,
  getRfCountryLabel,
} from '@/lib/rfFirstSliceContent';
import {
  buildProIdentityLabel,
  canAcceptProLink,
  canEndProLink,
  canRejectProLink,
  formatProLinkDate,
  formatProUserId,
  getProLinkRoleScopeLabel,
  getProLinkStatusDescription,
  getProLinkStatusLabel,
  proIdentityFallbackNote,
  proLinkLifecycleBoundaryCopy,
  proOwnerAcceptEmptyState,
  proOwnerAcceptErrorState,
  proOwnerAcceptLiveBoundaryCopy,
  rfMerchantBusinessesLabel,
} from '@/lib/rfProLinks';
import { RfBusinessCreatePanel } from '@/components/rf/live/RfBusinessCreatePanel';
import { OfferManagementPanel } from '@/components/rf/Merchant/Offers';

function proLinkStatusStyle(status: RfProLinkDto['status']) {
  if (status === 'active') return 'bg-emerald-100 text-emerald-900';
  if (status === 'pending') return 'bg-amber-100 text-amber-900';
  return 'bg-slate-100 text-slate-700';
}

async function getSpaceProfile(userId: string) {
  return customInstance<generated.SpaceProfileResponse>(
    { method: 'GET' },
    `/v1/space/profiles/${encodeURIComponent(userId)}`,
  );
}

export function MerchantWorkspace() {
  const { user, isLoaded: userLoaded } = useUser();
  const queryClient = useQueryClient();
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
  const proLinksQueryKey = useMemo(
    () => ['rf', 'business', 'partners', activePartner?.id ?? 'none', 'pro-links'] as const,
    [activePartner?.id],
  );
  const {
    data: partnerProLinksRes,
    isLoading: proLinksLoading,
    isError: proLinksError,
    refetch: refetchPartnerProLinks,
  } = useQuery({
    queryKey: proLinksQueryKey,
    queryFn: () => listPartnerProLinks(activePartner!.id),
    enabled: Boolean(user?.id && activePartner?.id),
    staleTime: 30_000,
    retry: 1,
  });
  const acceptLinkMutation = useMutation({
    mutationFn: acceptProLink,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: proLinksQueryKey });
    },
  });
  const rejectLinkMutation = useMutation({
    mutationFn: rejectProLink,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: proLinksQueryKey });
    },
  });
  const endLinkMutation = useMutation({
    mutationFn: endProLink,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: proLinksQueryKey });
    },
  });
  const partnerProLinks = useMemo(() => partnerProLinksRes?.items ?? [], [partnerProLinksRes?.items]);
  const proUserIds = useMemo(
    () => Array.from(new Set(partnerProLinks.map((link) => link.proUserId).filter(Boolean))),
    [partnerProLinks],
  );
  const proIdentityQueries = useQueries({
    queries: proUserIds.map((proUserId) => ({
      queryKey: ['space', 'profiles', proUserId] as const,
      queryFn: () => getSpaceProfile(proUserId),
      enabled: Boolean(user?.id && proUserId),
      staleTime: 5 * 60_000,
      retry: 1,
    })),
  });
  const proProfilesByUserId = useMemo(() => {
    const profiles = new Map<string, generated.SpaceProfileResponse>();
    proIdentityQueries.forEach((query, index) => {
      const profile = query.data;
      if (profile) profiles.set(proUserIds[index], profile);
    });
    return profiles;
  }, [proIdentityQueries, proUserIds]);

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
              Вы управляете своими партнёрами и офферами. Только владелец создаёт офферы и гасит ваучеры.
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
            <h2 className="text-lg font-semibold text-slate-900">{rfMerchantBusinessesLabel}</h2>
            <p className="mt-1 text-sm text-slate-600">
              Партнёры, которыми вы управляете как владелец.
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
            У вас пока нет бизнесов.
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
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Stage 5.1d live</p>
            <h2 className="text-lg font-semibold text-slate-900">PRO-запросы</h2>
            <p className="mt-1 max-w-3xl text-sm text-slate-600">{proOwnerAcceptLiveBoundaryCopy}</p>
            <p className="mt-1 max-w-3xl text-xs text-slate-500">{proLinkLifecycleBoundaryCopy}</p>
          </div>
          {activePartner ? (
            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
              Активный партнёр: {activePartner.displayName}
            </span>
          ) : null}
        </div>

        {!activePartner ? (
          <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Выберите или создайте партнёра, чтобы увидеть PRO-запросы.
          </p>
        ) : null}

        {activePartner && proLinksLoading ? (
          <p className="mt-4 text-sm text-slate-600">Загружаем PRO-запросы…</p>
        ) : null}

        {activePartner && proLinksError && !proLinksLoading ? (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <p>{proOwnerAcceptErrorState}</p>
            <button
              type="button"
              onClick={() => void refetchPartnerProLinks()}
              className="mt-2 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-950 hover:bg-amber-100"
            >
              Повторить
            </button>
          </div>
        ) : null}

        {activePartner && !proLinksLoading && !proLinksError && partnerProLinks.length === 0 ? (
          <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            {proOwnerAcceptEmptyState}
          </p>
        ) : null}

        {activePartner && partnerProLinks.length > 0 ? (
          <ul className="mt-4 divide-y divide-slate-100">
            {partnerProLinks.map((link) => {
              const canAccept = canAcceptProLink(link);
              const canReject = canRejectProLink(link);
              const canEnd = canEndProLink(link);
              const isAccepting = acceptLinkMutation.isPending && acceptLinkMutation.variables === link.id;
              const isRejecting = rejectLinkMutation.isPending && rejectLinkMutation.variables === link.id;
              const isEnding = endLinkMutation.isPending && endLinkMutation.variables === link.id;
              const hasPendingLifecycleAction =
                acceptLinkMutation.isPending || rejectLinkMutation.isPending || endLinkMutation.isPending;
              const proProfile = proProfilesByUserId.get(link.proUserId);
              const proIdentityLabel = buildProIdentityLabel({
                userId: link.proUserId,
                displayName: proProfile?.displayName,
              });
              return (
                <li key={link.id} className="flex flex-col gap-3 py-4 xl:flex-row xl:items-start xl:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-slate-900">{proIdentityLabel}</p>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${proLinkStatusStyle(link.status)}`}>
                        {getProLinkStatusLabel(link.status)}
                      </span>
                      <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-900">
                        {getProLinkRoleScopeLabel(link.roleScope)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">
                      PRO · {getProLinkRoleScopeLabel(link.roleScope)}
                      {!proProfile ? ` · ${proIdentityFallbackNote}` : null}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">{getProLinkStatusDescription(link.status)}</p>
                    <dl className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <dt className="font-medium text-slate-500">partnerId</dt>
                        <dd className="break-all text-slate-800">{link.partnerId}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-slate-500">PRO technical id</dt>
                        <dd className="break-all text-slate-800">{formatProUserId(link.proUserId)}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-slate-500">createdAt</dt>
                        <dd className="text-slate-800">{formatProLinkDate(link.createdAt)}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-slate-500">updatedAt</dt>
                        <dd className="text-slate-800">{formatProLinkDate(link.updatedAt)}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {canAccept ? (
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        disabled={hasPendingLifecycleAction}
                        onClick={() => acceptLinkMutation.mutate(link.id)}
                      >
                        {isAccepting ? 'Принимаем…' : 'Принять запрос'}
                      </Button>
                    ) : null}
                    {canReject ? (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        disabled={hasPendingLifecycleAction}
                        onClick={() => rejectLinkMutation.mutate(link.id)}
                      >
                        {isRejecting ? 'Отклоняем…' : 'Отклонить'}
                      </Button>
                    ) : null}
                    {canEnd ? (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        disabled={hasPendingLifecycleAction}
                        onClick={() => endLinkMutation.mutate(link.id)}
                      >
                        {isEnding ? 'Завершаем…' : 'Завершить связь'}
                      </Button>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : null}

        {acceptLinkMutation.isError ? (
          <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            Не удалось принять запрос. Обновите список и попробуйте ещё раз.
          </p>
        ) : null}
        {rejectLinkMutation.isError ? (
          <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            Не удалось отклонить запрос. Обновите список и попробуйте ещё раз.
          </p>
        ) : null}
        {endLinkMutation.isError ? (
          <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            Не удалось завершить связь. Обновите список и попробуйте ещё раз.
          </p>
        ) : null}
      </section>

      <section id="mw-offers" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Офферы ваших бизнесов</h2>
          <p className="mt-1 text-sm text-slate-600">
            Создание draft-оффера и активация доступны только владельцу выбранного бизнеса.
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
            Создайте бизнес, чтобы управлять офферами.
          </p>
        )}
      </section>

      <section id="mw-create-partner" className="scroll-mt-24 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
        <h2 className="text-sm font-semibold text-slate-900">Создание бизнеса</h2>
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
