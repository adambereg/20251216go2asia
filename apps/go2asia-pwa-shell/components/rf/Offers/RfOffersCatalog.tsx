'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { LayoutGrid, List, Search } from 'lucide-react';
import type { RfOfferDto, RfPartnerDto } from '@go2asia/sdk/rf';
import { Button } from '@go2asia/ui';
import { AddToMyVouchersButton } from '@/components/rf/Shared/AddToMyVouchersButton';
import { ClaimRfOfferButton } from '@/components/rf/Shared/ClaimRfOfferButton';
import { FavoriteOfferButton } from '@/components/rf/Shared/FavoriteOfferButton';
import { RfEntitlementPreviewBadge } from '@/components/rf/Shared/RfEntitlementPreviewBadge';
import {
  getCatalogCategoryFilterOptions,
  getOfferBadge,
  getOfferGuardText,
  getOfferSummaryLine,
  getOfferTypePresentation,
  getOfferValueLine,
  getPartnerLocation,
  getPartnerPresentation,
  getVisibilityBadge,
  partnerMatchesCatalogCategoryKey,
  rfAtmosphereTagLabels,
  rfOffersCatalogContent,
  rfMicrocopy,
  getRfCityLabel,
  getRfCountryLabel,
} from '@/lib/rfFirstSliceContent';
import { getItemLabelForOffer } from '@/lib/rfMerchantItems';
import { rfOfferClaimCopy } from '@/lib/rfOfferClaim';
import { captureRfProAttributionFromUrl } from '@/lib/rfProAttribution';
import {
  buildRfOfferEntitlementPreviewRequest,
  fetchRfEntitlementPreviewBatch,
  rfEntitlementPreviewFlags,
  type RfEntitlementPreviewUiState,
} from '@/lib/rfEntitlementPreview';
import { getRfOfferSpendSemantics } from '@/lib/rfSpendSemantics';

type SortKey = 'featured' | 'title' | 'partner';
type ViewMode = 'grid' | 'list';
type StatusFilter = 'all' | RfOfferDto['status'];

function chipBase(active: boolean) {
  return `rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
    active
      ? 'border-blue-600 bg-blue-50 text-blue-900'
      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
  }`;
}

function offerSortScore(offer: RfOfferDto): number {
  let s = 0;
  if (offer.status === 'active') s += 4;
  if (offer.visibility === 'public') s += 2;
  if (offer.visibility === 'pro_only') s += 1;
  return s;
}

export interface RfOffersCatalogProps {
  partners: RfPartnerDto[];
  offers: RfOfferDto[];
  partnersUnavailable: boolean;
  offersUnavailable: boolean;
  initialQuery?: string;
  initialPartnerId?: string;
}

export function RfOffersCatalog({
  partners,
  offers,
  partnersUnavailable,
  offersUnavailable,
  initialQuery = '',
  initialPartnerId,
}: RfOffersCatalogProps) {
  const { userId } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const partnerById = useMemo(() => new Map(partners.map((p) => [p.id, p])), [partners]);

  useEffect(() => {
    captureRfProAttributionFromUrl(searchParams, pathname);
  }, [pathname, searchParams]);

  const countryOptions = useMemo(() => [...new Set(partners.map((p) => p.countryId))].sort(), [partners]);
  const cityOptions = useMemo(() => [...new Set(partners.map((p) => p.cityId))].sort(), [partners]);
  const districtOptions = useMemo(() => {
    const labels = new Set<string>();
    for (const p of partners) labels.add(getPartnerPresentation(p).districtLabel);
    return [...labels].sort();
  }, [partners]);

  const atmosphereKeys = useMemo(
    () => [...new Set(partners.flatMap((p) => getPartnerPresentation(p).atmosphereTags))].sort(),
    [partners],
  );

  const [q, setQ] = useState(initialQuery);
  const [countryId, setCountryId] = useState<string>('all');
  const [cityId, setCityId] = useState<string>('all');
  const [district, setDistrict] = useState<string>('all');
  const [categoryKey, setCategoryKey] = useState<string>('all');
  const [partnerScope, setPartnerScope] = useState<string>(initialPartnerId ?? 'all');
  const [offerTypes, setOfferTypes] = useState<Set<RfOfferDto['offerType']>>(new Set());
  const [visibility, setVisibility] = useState<Set<RfOfferDto['visibility']>>(new Set());
  const [atmosphere, setAtmosphere] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [onlyPublicUsable, setOnlyPublicUsable] = useState(false);
  const [sort, setSort] = useState<SortKey>('featured');
  const [view, setView] = useState<ViewMode>('grid');

  useEffect(() => {
    setQ(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (initialPartnerId) setPartnerScope(initialPartnerId);
  }, [initialPartnerId]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    const list = offers.filter((offer) => {
      const partner = partnerById.get(offer.partnerId);
      if (!partner) return false;

      if (partnerScope !== 'all' && partner.id !== partnerScope) return false;
      if (countryId !== 'all' && partner.countryId !== countryId) return false;
      if (cityId !== 'all' && partner.cityId !== cityId) return false;

      const profile = getPartnerPresentation(partner);
      if (district !== 'all' && profile.districtLabel !== district) return false;
      if (!partnerMatchesCatalogCategoryKey(partner, categoryKey)) return false;

      if (statusFilter !== 'all' && offer.status !== statusFilter) return false;

      if (visibility.size > 0 && !visibility.has(offer.visibility)) return false;

      if (offerTypes.size > 0 && !offerTypes.has(offer.offerType)) return false;

      if (atmosphere.size > 0) {
        const tags = new Set(profile.atmosphereTags);
        const any = [...atmosphere].some((t) => tags.has(t));
        if (!any) return false;
      }

      if (onlyPublicUsable) {
        if (offer.visibility !== 'public' || offer.status !== 'active') return false;
      }

      if (query) {
        const blob = [
          offer.title,
          partner.displayName,
          getOfferValueLine(offer),
          profile.categoryLabel,
          profile.districtLabel,
          ...profile.atmosphereTags.map((t) => rfAtmosphereTagLabels[t] ?? t),
          getPartnerLocation(partner),
        ]
          .join(' ')
          .toLowerCase();
        if (!blob.includes(query)) return false;
      }

      return true;
    });

    const sorted = [...list].sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title, 'ru');
      if (sort === 'partner') {
        const pa = partnerById.get(a.partnerId)?.displayName ?? '';
        const pb = partnerById.get(b.partnerId)?.displayName ?? '';
        const c = pa.localeCompare(pb, 'ru');
        if (c !== 0) return c;
        return a.title.localeCompare(b.title, 'ru');
      }
      return offerSortScore(b) - offerSortScore(a);
    });

    return sorted;
  }, [
    offers,
    partnerById,
    q,
    countryId,
    cityId,
    district,
    categoryKey,
    partnerScope,
    offerTypes,
    visibility,
    atmosphere,
    statusFilter,
    onlyPublicUsable,
    sort,
  ]);

  const categoryChips = getCatalogCategoryFilterOptions();
  const offerTypeEntries = (
    ['discount', 'bundle', 'gift', 'access', 'campaign', 'event_related'] as RfOfferDto['offerType'][]
  ).map((t) => ({ t, ...getOfferTypePresentation(t) }));

  const entitlementPreviewItems = useMemo(() => {
    if (!userId) return [];
    return filtered
      .filter((offer) => offer.visibility === 'pro_only')
      .map((offer) => ({
        clientKey: offer.id,
        request: buildRfOfferEntitlementPreviewRequest({
          subject: { userId },
          offer,
          voucherClass: 'premium',
        }),
      }));
  }, [filtered, userId]);

  const entitlementPreviewCollectionKey = useMemo(
    () => entitlementPreviewItems.map((item) => item.clientKey).sort().join('|'),
    [entitlementPreviewItems],
  );

  const { data: entitlementPreviewByOfferId = {} } = useQuery<Record<string, RfEntitlementPreviewUiState>>({
    queryKey: ['rf', 'entitlement-preview', 'catalog-batch', userId ?? null, entitlementPreviewCollectionKey],
    enabled: rfEntitlementPreviewFlags.enableClientPreview && Boolean(userId) && entitlementPreviewItems.length > 0,
    staleTime: 30_000,
    retry: 0,
    queryFn: () => fetchRfEntitlementPreviewBatch(entitlementPreviewItems, { enabled: true }),
  });

  const resetAll = () => {
    setQ('');
    setCountryId('all');
    setCityId('all');
    setDistrict('all');
    setCategoryKey('all');
    setPartnerScope('all');
    setOfferTypes(new Set());
    setVisibility(new Set());
    setAtmosphere(new Set());
    setStatusFilter('all');
    setOnlyPublicUsable(false);
    setSort('featured');
  };

  if (offersUnavailable || partnersUnavailable) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
        {rfMicrocopy.temporaryUnavailable}
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">{rfMicrocopy.emptyOffersCatalog}</div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{rfOffersCatalogContent.pageTitle}</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">{rfOffersCatalogContent.pageSubtitle}</p>
        <nav className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600">
          <Link href="/rf" className="font-medium text-blue-700 hover:text-blue-800">
            Каталог партнёров
          </Link>
          <span className="text-slate-300">·</span>
          <Link href="/rf/map" className="font-medium text-blue-700 hover:text-blue-800">
            Карта
          </Link>
          <span className="text-slate-300">·</span>
          <Link href="/rf/favorites" className="font-medium text-blue-700 hover:text-blue-800">
            Избранное
          </Link>
          <span className="text-slate-300">·</span>
          <Link href="/rf/my-vouchers" className="font-medium text-blue-700 hover:text-blue-800">
            Мои ваучеры
          </Link>
          <span className="text-slate-300">·</span>
          <Link href="/rf/how-it-works" className="font-medium text-blue-700 hover:text-blue-800">
            Как это работает
          </Link>
        </nav>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={rfOffersCatalogContent.searchPlaceholder}
              className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none ring-blue-500/30 focus:border-blue-500 focus:ring-2"
              aria-label={rfOffersCatalogContent.searchPlaceholder}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 text-xs text-slate-600">
              <span className="whitespace-nowrap">{rfOffersCatalogContent.sortLabel}</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900"
              >
                <option value="featured">По актуальности</option>
                <option value="title">По названию оффера</option>
                <option value="partner">По месту</option>
              </select>
            </label>
            <div className="flex rounded-lg border border-slate-200 p-0.5">
              <button
                type="button"
                onClick={() => setView('grid')}
                className={`flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium ${
                  view === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
                }`}
                aria-pressed={view === 'grid'}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                Сетка
              </button>
              <button
                type="button"
                onClick={() => setView('list')}
                className={`flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium ${
                  view === 'list' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
                }`}
                aria-pressed={view === 'list'}
              >
                <List className="h-3.5 w-3.5" />
                Список
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500">{rfOffersCatalogContent.filterPartner}</span>
            <button type="button" className={chipBase(partnerScope === 'all')} onClick={() => setPartnerScope('all')}>
              Все
            </button>
            {partners.map((p) => (
              <button key={p.id} type="button" className={chipBase(partnerScope === p.id)} onClick={() => setPartnerScope(p.id)}>
                {p.displayName}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Страна</span>
            <button type="button" className={chipBase(countryId === 'all')} onClick={() => setCountryId('all')}>
              Все
            </button>
            {countryOptions.map((id) => (
              <button key={id} type="button" className={chipBase(countryId === id)} onClick={() => setCountryId(id)}>
                {getRfCountryLabel(id)}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Город</span>
            <button type="button" className={chipBase(cityId === 'all')} onClick={() => setCityId('all')}>
              Все
            </button>
            {cityOptions.map((id) => (
              <button key={id} type="button" className={chipBase(cityId === id)} onClick={() => setCityId(id)}>
                {getRfCityLabel(id)}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Район / зона</span>
            <button type="button" className={chipBase(district === 'all')} onClick={() => setDistrict('all')}>
              Все
            </button>
            {districtOptions.map((d) => (
              <button key={d} type="button" className={chipBase(district === d)} onClick={() => setDistrict(d)}>
                {d}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Категория места</span>
            <button type="button" className={chipBase(categoryKey === 'all')} onClick={() => setCategoryKey('all')}>
              Все
            </button>
            {categoryChips.map((c) => (
              <button
                key={c.key}
                type="button"
                className={chipBase(categoryKey === c.key)}
                onClick={() => setCategoryKey(c.key)}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Тип оффера</span>
            <button type="button" className={chipBase(offerTypes.size === 0)} onClick={() => setOfferTypes(new Set())}>
              Все
            </button>
            {offerTypeEntries.map(({ t, label }) => {
              const active = offerTypes.has(t);
              return (
                <button
                  key={t}
                  type="button"
                  className={chipBase(active)}
                  onClick={() => {
                    const next = new Set(offerTypes);
                    if (active) next.delete(t);
                    else next.add(t);
                    setOfferTypes(next);
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500">{rfOffersCatalogContent.filterVisibility}</span>
            {(['public', 'pro_only', 'invite_only'] as RfOfferDto['visibility'][]).map((v) => {
              const b = getVisibilityBadge(v);
              const active = visibility.has(v);
              return (
                <button
                  key={v}
                  type="button"
                  className={chipBase(active)}
                  onClick={() => {
                    const next = new Set(visibility);
                    if (active) next.delete(v);
                    else next.add(v);
                    setVisibility(next);
                  }}
                >
                  {b.label}
                </button>
              );
            })}
            <button type="button" className={chipBase(visibility.size === 0)} onClick={() => setVisibility(new Set())}>
              Сбросить доступность
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500">{rfOffersCatalogContent.filterStatus}</span>
            {(['all', 'active', 'draft', 'archived'] as const).map((st) => (
              <button
                key={st}
                type="button"
                className={chipBase(statusFilter === st)}
                onClick={() => setStatusFilter(st)}
              >
                {st === 'all' ? 'Все' : st === 'active' ? 'Активные' : st === 'draft' ? 'Черновики' : 'Архив'}
              </button>
            ))}
          </div>
          {atmosphereKeys.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Сценарий / атмосфера места</span>
              <button type="button" className={chipBase(atmosphere.size === 0)} onClick={() => setAtmosphere(new Set())}>
                Все
              </button>
              {atmosphereKeys.map((key) => {
                const active = atmosphere.has(key);
                return (
                  <button
                    key={key}
                    type="button"
                    className={chipBase(active)}
                    onClick={() => {
                      const next = new Set(atmosphere);
                      if (active) next.delete(key);
                      else next.add(key);
                      setAtmosphere(next);
                    }}
                  >
                    {rfAtmosphereTagLabels[key] ?? key}
                  </button>
                );
              })}
            </div>
          ) : null}
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-700">
              <input
                type="checkbox"
                checked={onlyPublicUsable}
                onChange={(e) => setOnlyPublicUsable(e.target.checked)}
                className="rounded border-slate-300"
              />
              Только публичные и активные (можно смотреть без PRO)
            </label>
            <Button type="button" variant="secondary" size="sm" onClick={resetAll}>
              Сбросить фильтры
            </Button>
            <span className="text-xs text-slate-500">{rfOffersCatalogContent.resultsCount(filtered.length)}</span>
          </div>
        </div>
      </header>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">{rfMicrocopy.noResults}</div>
      ) : view === 'grid' ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              partner={partnerById.get(offer.partnerId)!}
              layout="grid"
              entitlementPreview={entitlementPreviewByOfferId[offer.id] ?? null}
            />
          ))}
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((offer) => (
            <li key={offer.id}>
              <OfferCard
                offer={offer}
                partner={partnerById.get(offer.partnerId)!}
                layout="list"
                entitlementPreview={entitlementPreviewByOfferId[offer.id] ?? null}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function OfferCard({
  offer,
  partner,
  layout,
  entitlementPreview,
}: {
  offer: RfOfferDto;
  partner: RfPartnerDto;
  layout: 'grid' | 'list';
  entitlementPreview?: RfEntitlementPreviewUiState | null;
}) {
  const offerBadge = getOfferBadge(offer);
  const vis = getVisibilityBadge(offer.visibility);
  const profile = getPartnerPresentation(partner);
  const tags = profile.atmosphereTags.map((t) => rfAtmosphereTagLabels[t] ?? t);
  const itemLabel = getItemLabelForOffer(offer);
  const spendSemantics = getRfOfferSpendSemantics(offer);

  const body = (
    <div className="min-w-0 flex-1 space-y-2">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="text-base font-semibold text-slate-900">{offer.title}</h2>
        <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${offerBadge.tone}`}>{offerBadge.label}</span>
      </div>
      {itemLabel ? (
        <p className="text-xs text-slate-600">
          <span className="font-medium text-slate-700">Товар или услуга: </span>
          {itemLabel}
        </p>
      ) : null}
      <p className="text-sm text-slate-700">{getOfferValueLine(offer)}</p>
      <p className="text-xs text-slate-600">
        <span className="font-medium text-slate-700">Место: </span>
        <Link href={`/rf/${encodeURIComponent(partner.id)}`} className="font-medium text-blue-700 hover:text-blue-800">
          {partner.displayName}
        </Link>
        <span className="text-slate-500"> · {getPartnerLocation(partner)} · {profile.districtLabel}</span>
      </p>
      <p className="text-xs text-slate-500">{profile.categoryLabel}</p>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((label) => (
          <span key={label} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
            {label}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <span className={`inline-flex rounded-full px-2 py-1 text-[11px] font-medium ${vis.tone}`}>{vis.label}</span>
        <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700">
          {getOfferSummaryLine(offer)}
        </span>
        <span className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${spendSemantics.tone}`}>
          {spendSemantics.label}
        </span>
        {offer.visibility === 'pro_only' ? (
          <RfEntitlementPreviewBadge
            offerId={offer.id}
            partnerId={offer.partnerId}
            offerVisibility={offer.visibility}
            voucherClass="premium"
            previewState={entitlementPreview}
            allowFallbackFetch={false}
          />
        ) : null}
      </div>
      <p className="text-[11px] text-slate-500">{getOfferGuardText(offer)}</p>
      <p className="text-[11px] font-medium text-slate-600">{spendSemantics.caption}</p>
      <div className="rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2 text-[11px] text-slate-600">
        <p className="font-medium text-slate-800">{rfOfferClaimCopy.successHint}</p>
        <p className="mt-0.5">{rfOfferClaimCopy.localSaveNote}</p>
      </div>
    </div>
  );

  const actions = (
    <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
      <ClaimRfOfferButton offerId={offer.id} repeatPolicy={offer.repeatPolicy} pointsCost={offer.pointsCost} />
      <Link
        href={`/rf/${encodeURIComponent(partner.id)}`}
        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-center text-xs font-medium text-white hover:bg-blue-700"
      >
        {rfOffersCatalogContent.ctaOpenPlace}
      </Link>
      <Link
        href={`/rf/vouchers?partner=${encodeURIComponent(partner.id)}`}
        className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-center text-xs font-medium text-slate-800 hover:bg-slate-50"
      >
        {rfOffersCatalogContent.ctaAllOffersForPlace}
      </Link>
      <FavoriteOfferButton offerId={offer.id} />
      <AddToMyVouchersButton
        offerId={offer.id}
        partnerId={partner.id}
        title={offer.title}
        partnerDisplayName={partner.displayName}
      />
    </div>
  );

  if (layout === 'list') {
    return (
      <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-start md:justify-between">
        {body}
        {actions}
      </article>
    );
  }

  return (
    <article className="flex h-full flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {body}
      {actions}
    </article>
  );
}
