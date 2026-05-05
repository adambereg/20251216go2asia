'use client';

import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { createProLink, listProLinks, useRfOffers, useRfPartners, type RfProLinkRoleScope } from '@go2asia/sdk/rf';
import { Button } from '@go2asia/ui';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  buildProFocusItems,
  buildProNextSteps,
  formatOfferVisibilityLabel,
  getActiveLinkedPartnerIds,
  getLinkedPartnerOffers,
  getPartnerProHealth,
  resolveProScope,
  summarizeProScope,
} from '@/lib/rfProWorkspace';
import {
  formatProLinkDate,
  getProLinkRoleScopeLabel,
  getProLinkStatusDescription,
  getProLinkStatusLabel,
  proLinkedPartnerBoundaryCopy,
  proLinkedPartnerCreateNote,
  proLinkedPartnersEmptyState,
} from '@/lib/rfProLinks';
import {
  getOfferBadge,
  getOfferSummaryLine,
  getPartnerLocation,
  getRfCityLabel,
  getVisibilityBadge,
} from '@/lib/rfFirstSliceContent';
import { Check, ChevronRight, ExternalLink, Minus } from 'lucide-react';

const roleScopeOptions: RfProLinkRoleScope[] = [
  'curation',
  'promotion',
  'onboarding',
  'moderation_support',
  'account_support',
];

function focusStyle(severity: 'info' | 'warn' | 'ok') {
  if (severity === 'warn') return 'border-amber-200 bg-amber-50';
  if (severity === 'ok') return 'border-emerald-200 bg-emerald-50';
  return 'border-slate-200 bg-slate-50';
}

function proLinkStatusStyle(status: 'pending' | 'active' | 'ended') {
  if (status === 'active') return 'bg-emerald-100 text-emerald-900';
  if (status === 'pending') return 'bg-amber-100 text-amber-900';
  return 'bg-slate-100 text-slate-700';
}

export function PROWorkspace() {
  const { user, isLoaded: userLoaded } = useUser();
  const queryClient = useQueryClient();
  const [partnerIdInput, setPartnerIdInput] = useState('');
  const [roleScopeInput, setRoleScopeInput] = useState<RfProLinkRoleScope>('curation');
  const { data: partnersRes, isLoading: partnersLoading, isError: partnersError } = useRfPartners();
  const { data: offersRes, isLoading: offersLoading, isError: offersError } = useRfOffers();
  const {
    data: proLinksRes,
    isLoading: proLinksLoading,
    isError: proLinksError,
    refetch: refetchProLinks,
  } = useQuery({
    queryKey: ['rf', 'pro', 'links'],
    queryFn: listProLinks,
    enabled: Boolean(user?.id),
    staleTime: 30_000,
    retry: 1,
  });
  const createLinkMutation = useMutation({
    mutationFn: createProLink,
    onSuccess: async () => {
      setPartnerIdInput('');
      await queryClient.invalidateQueries({ queryKey: ['rf', 'pro', 'links'] });
    },
  });

  const partners = partnersRes?.items ?? [];
  const offers = offersRes?.items ?? [];
  const proLinks = proLinksRes?.items ?? [];
  const loading = !userLoaded || partnersLoading || offersLoading;

  const apiUnavailable =
    partnersError ||
    offersError ||
    (!partnersLoading && partnersRes === null) ||
    (!offersLoading && offersRes === null);

  const scope = useMemo(() => resolveProScope(user?.id, partners, offers), [user?.id, partners, offers]);
  const summary = useMemo(() => summarizeProScope(scope.partners, offers), [scope.partners, offers]);
  const focus = useMemo(() => buildProFocusItems(scope.partners, offers), [scope.partners, offers]);
  const partnersById = useMemo(() => new Map(partners.map((partner) => [partner.id, partner])), [partners]);
  const activeLinkedPartnerIds = useMemo(() => getActiveLinkedPartnerIds(proLinks), [proLinks]);
  const linkedOffers = useMemo(() => getLinkedPartnerOffers(offers, activeLinkedPartnerIds), [offers, activeLinkedPartnerIds]);
  const nextSteps = useMemo(
    () => buildProNextSteps(scope.partners, offers, scope.isDerivedScope),
    [scope.partners, offers, scope.isDerivedScope],
  );

  function handleCreateLinkSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const partnerId = partnerIdInput.trim();
    if (!partnerId) return;
    createLinkMutation.mutate({ partnerId, roleScope: roleScopeInput });
  }

  if (!userLoaded) {
    return <p className="text-sm text-slate-600">Загрузка PRO-контура…</p>;
  }

  if (!user?.id) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950">
        Войдите в аккаунт, чтобы открыть RF PRO workspace.
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-16">
      {loading ? <p className="text-sm text-slate-600">Загрузка данных RF…</p> : null}

      {apiUnavailable && !loading ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Не удалось загрузить RF API. Показаны только структурные блоки без live-агрегации.
        </div>
      ) : null}

      {scope.isDerivedScope ? (
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 text-xs text-purple-950">
          <p className="font-semibold">PRO scope (support-layer fallback)</p>
          <p className="mt-1">{scope.reason}</p>
        </div>
      ) : (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-900">
          Scope собран из прокси-связей по авторам офферов (`createdByUserId`) и остаётся read-only baseline.
        </div>
      )}

      <section id="pw-overview" className="scroll-mt-24">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Обзор</h1>
        <p className="mt-1 text-sm text-slate-600">
          PRO workspace: сопровождение партнёров и усиление публичного RF-контура.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Партнёров в scope</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{summary.totalPartners}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Публичные активные офферы</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{summary.publicActiveOffers}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Партнёры без public офферов</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{summary.partnersWithoutPublicOffers}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Требуют внимания</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{summary.partnersNeedAttention}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Офферов в scope (всего)</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{summary.totalOffers}</p>
          </div>
        </div>
      </section>

      <section id="pw-linked-partners" className="scroll-mt-24 rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Stage 5.1 live</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">Связи с партнёрами</h2>
            <p className="mt-1 max-w-3xl text-sm text-slate-600">{proLinkedPartnerBoundaryCopy}</p>
          </div>
          <button
            type="button"
            onClick={() => void refetchProLinks()}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-50"
          >
            Обновить
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Owner / Merchant</p>
            <p className="mt-1 text-xs text-slate-600">
              Владеет партнёром, создаёт офферы и гасит ваучеры в merchant-кабинете.
            </p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-semibold text-emerald-950">PRO linked partner</p>
            <p className="mt-1 text-xs text-emerald-900">
              PRO работает с партнёром, но не владеет им, не создаёт офферы и не гасит ваучеры в этом этапе.
            </p>
          </div>
        </div>

        {proLinksLoading ? <p className="mt-4 text-sm text-slate-600">Загрузка связанных партнёров…</p> : null}

        {proLinksError && !proLinksLoading ? (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Не удалось загрузить связи PRO. Проверьте авторизацию RF API и повторите позже.
          </div>
        ) : null}

        {!proLinksLoading && !proLinksError && proLinks.length === 0 ? (
          <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            {proLinkedPartnersEmptyState}
          </p>
        ) : null}

        {proLinks.length > 0 ? (
          <ul className="mt-4 divide-y divide-slate-100">
            {proLinks.map((link) => {
              const partner = partnersById.get(link.partnerId);
              return (
                <li key={link.id} className="py-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="font-medium text-slate-900">
                        {partner?.displayName ?? link.partnerId}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">partnerId: {link.partnerId}</p>
                      {partner ? (
                        <p className="mt-1 text-xs text-slate-500">{getPartnerLocation(partner)}</p>
                      ) : (
                        <p className="mt-1 text-xs text-slate-600">Детали партнёра будут подключены позже.</p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${proLinkStatusStyle(link.status)}`}>
                          {getProLinkStatusLabel(link.status)}
                        </span>
                        <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-900">
                          {getProLinkRoleScopeLabel(link.roleScope)}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-slate-600">{getProLinkStatusDescription(link.status)}</p>
                    </div>
                    <dl className="grid min-w-[220px] gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
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
                </li>
              );
            })}
          </ul>
        ) : null}

        <details className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-slate-900">Запросить связь с партнёром</summary>
          <p className="mt-2 text-xs text-slate-600">{proLinkedPartnerCreateNote}</p>
          <form onSubmit={handleCreateLinkSubmit} className="mt-4 grid gap-3 md:grid-cols-[1fr_220px_auto] md:items-end">
            <label className="block text-xs font-medium text-slate-700">
              partnerId
              <input
                value={partnerIdInput}
                onChange={(event) => setPartnerIdInput(event.target.value)}
                placeholder="rf_partner_..."
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
              />
            </label>
            <label className="block text-xs font-medium text-slate-700">
              roleScope
              <select
                value={roleScopeInput}
                onChange={(event) => setRoleScopeInput(event.target.value as RfProLinkRoleScope)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
              >
                {roleScopeOptions.map((roleScope) => (
                  <option key={roleScope} value={roleScope}>
                    {getProLinkRoleScopeLabel(roleScope)}
                  </option>
                ))}
              </select>
            </label>
            <Button type="submit" size="sm" disabled={createLinkMutation.isPending || partnerIdInput.trim().length === 0}>
              {createLinkMutation.isPending ? 'Отправка…' : 'Отправить запрос'}
            </Button>
          </form>
          {createLinkMutation.isSuccess ? (
            <p className="mt-3 text-xs text-emerald-800">Запрос отправлен. Список связей обновляется.</p>
          ) : null}
          {createLinkMutation.isError ? (
            <p className="mt-3 text-xs text-amber-900">
              Не удалось отправить запрос. Проверьте partnerId и доступ к RF API.
            </p>
          ) : null}
          <p className="mt-3 text-xs text-slate-500">Подтверждение связи владельцем партнёра будет отдельным этапом.</p>
        </details>
      </section>

      <section id="pw-partners" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Партнёры в support scope (legacy/derived)</h2>
            <p className="mt-1 text-sm text-slate-600">
              Derived слой для публичной видимости RF. Канонические Stage 5.1 связи показаны выше через rf_pro_link.
            </p>
            {scope.isDerivedScope ? (
              <p className="mt-1 text-xs text-purple-700">Сейчас это fallback scope (derived), а не подтверждённое assignment-распределение.</p>
            ) : null}
          </div>
          <Link href="/rf/pro/partners">
            <Button variant="secondary" size="sm" className="gap-1">
              Детальный список (legacy/demo)
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {scope.partners.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">Партнёры в PRO scope пока не определены.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {scope.partners.map((partner) => {
              const publicCount = summary.publicActiveMap.get(partner.id)?.length ?? 0;
              const health = getPartnerProHealth(partner, publicCount);
              return (
                <li key={partner.id} className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{partner.displayName}</p>
                    <p className="text-xs text-slate-500">{getPartnerLocation(partner)}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${health.trust.tone}`}>
                        {health.trust.label}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                        {health.profile.categoryLabel}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${health.needsAttention ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'}`}
                      >
                        {health.needsAttention ? 'Нужен фокус' : 'Состояние ок'}
                      </span>
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-900">
                        Public офферов: {publicCount}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/rf/${encodeURIComponent(partner.id)}`}
                      className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-50"
                    >
                      Публичная карточка
                    </Link>
                    <Link
                      href={`/rf/vouchers?partner=${encodeURIComponent(partner.id)}`}
                      className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-50"
                    >
                      Офферы партнёра
                    </Link>
                    <Link
                      href={`/rf/map?city=${encodeURIComponent(partner.cityId)}`}
                      className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Карта · {getRfCityLabel(partner.cityId)}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section id="pw-offers" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Stage 5.2 read-only</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">Офферы связанных партнёров</h2>
            <p className="mt-1 text-sm text-slate-600">
              Здесь отображаются офферы партнёров, с которыми у вас есть активная связь. Это read-only видимость.
            </p>
          </div>
          <Link href="/rf/vouchers">
            <Button variant="secondary" size="sm" className="gap-1">
              Общий каталог предложений
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {proLinksLoading ? <p className="mt-4 text-sm text-slate-600">Загрузка активных связей PRO…</p> : null}

        {proLinksError && !proLinksLoading ? (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Не удалось загрузить связи PRO. Офферы связанных партнёров временно недоступны.
          </div>
        ) : null}

        {!proLinksLoading && !proLinksError && activeLinkedPartnerIds.length === 0 ? (
          <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            У вас пока нет активных связей с партнёрами.
          </p>
        ) : null}

        {!proLinksLoading && !proLinksError && activeLinkedPartnerIds.length > 0 && linkedOffers.length === 0 ? (
          <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            У связанных партнёров пока нет доступных офферов.
          </p>
        ) : null}

        {linkedOffers.length > 0 ? (
          <ul className="mt-4 divide-y divide-slate-100">
            {linkedOffers.slice(0, 20).map((offer) => {
              const badge = getOfferBadge(offer);
              const vis = getVisibilityBadge(offer.visibility);
              const partner = partnersById.get(offer.partnerId);
              return (
                <li key={offer.id} className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{offer.title}</p>
                    <p className="text-xs text-slate-500">{getOfferSummaryLine(offer)}</p>
                    <p className="mt-1 text-xs text-slate-600">
                      Партнёр:{' '}
                      {partner ? (
                        <Link href={`/rf/${encodeURIComponent(partner.id)}`} className="font-medium text-blue-700 hover:text-blue-800">
                          {partner.displayName}
                        </Link>
                      ) : (
                        offer.partnerId
                      )}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge.tone}`}>{badge.label}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${vis.tone}`}>
                        {formatOfferVisibilityLabel(offer.visibility)}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                        {offer.status}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/rf/vouchers?partner=${encodeURIComponent(offer.partnerId)}`}
                    className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-50"
                  >
                    Открыть в каталоге
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : null}

        <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
          Управление офферами остаётся только в Merchant cabinet: PRO не создаёт, не активирует, не редактирует и не гасит ваучеры в этом слое.
        </p>
      </section>

      <section id="pw-derived-offers" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Предложения в support scope (legacy/derived)</h2>
            <p className="mt-1 text-sm text-slate-600">
              Старый read-only обзор по derived scope. Канонический Stage 5.2 список выше строится только из active rf_pro_link.
            </p>
          </div>
        </div>

        {summary.offersInScope.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">В derived scope нет офферов.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {summary.offersInScope.slice(0, 20).map((offer) => {
              const badge = getOfferBadge(offer);
              const vis = getVisibilityBadge(offer.visibility);
              const partner = scope.partners.find((p) => p.id === offer.partnerId);
              return (
                <li key={offer.id} className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{offer.title}</p>
                    <p className="text-xs text-slate-500">{getOfferSummaryLine(offer)}</p>
                    <p className="mt-1 text-xs text-slate-600">
                      Партнёр:{' '}
                      {partner ? (
                        <Link href={`/rf/${encodeURIComponent(partner.id)}`} className="font-medium text-blue-700 hover:text-blue-800">
                          {partner.displayName}
                        </Link>
                      ) : (
                        offer.partnerId
                      )}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge.tone}`}>{badge.label}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${vis.tone}`}>{vis.label}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/rf/vouchers?partner=${encodeURIComponent(offer.partnerId)}`}
                      className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-50"
                    >
                      В public каталоге
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section id="pw-focus" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Статус и фокус</h2>
        <p className="mt-1 text-sm text-slate-600">
          Где PRO-контур сейчас требует внимания. Это не workflow engine, а рабочие ориентиры baseline.
        </p>
        <ul className="mt-4 space-y-3">
          {focus.map((item) => (
            <li key={item.id} className={`rounded-xl border px-4 py-3 ${focusStyle(item.severity)}`}>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 rounded-full bg-white p-1 text-slate-700">
                  {item.severity === 'ok' ? <Check className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.title}</p>
                  <p className="mt-0.5 text-xs text-slate-600">{item.detail}</p>
                  {item.partnerId ? (
                    <Link
                      href={`/rf/vouchers?partner=${encodeURIComponent(item.partnerId)}`}
                      className="mt-1 inline-flex text-xs font-medium text-blue-700 hover:text-blue-800"
                    >
                      Открыть офферы партнёра
                    </Link>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="pw-public" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Публичный RF view</h2>
        <p className="mt-1 text-sm text-slate-600">
          Быстрые переходы, чтобы проверить результат работы PRO глазами обычного пользователя.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/rf"
            className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-900 hover:bg-blue-100"
          >
            Каталог мест
            <ChevronRight className="h-4 w-4" />
          </Link>
          <Link
            href="/rf/vouchers"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            Каталог предложений
          </Link>
          <Link
            href="/rf/map"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            Карта
          </Link>
        </div>
      </section>

      <section id="pw-next" className="scroll-mt-24 rounded-2xl border border-purple-200 bg-purple-50/40 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-purple-950">Следующие шаги</h2>
        <p className="mt-1 text-sm text-purple-900/80">
          Что делать дальше в рамках текущего beta-контура PRO.
        </p>
        <ol className="mt-4 space-y-4">
          {nextSteps.map((step, index) => (
            <li key={step.id} className="flex gap-3 rounded-xl border border-purple-100 bg-white p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-700 text-sm font-semibold text-white">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900">{step.title}</p>
                <p className="mt-1 text-sm text-slate-600">{step.detail}</p>
                {step.href ? (
                  <Link href={step.href} className="mt-2 inline-flex text-sm font-medium text-purple-800 hover:text-purple-900">
                    {step.actionLabel ?? 'Перейти'}
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
