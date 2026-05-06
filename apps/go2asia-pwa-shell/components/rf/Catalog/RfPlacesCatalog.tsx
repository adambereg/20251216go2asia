'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { LayoutGrid, List, Search } from 'lucide-react';
import type { RfOfferDto, RfPartnerDto } from '@go2asia/sdk/rf';
import { Button } from '@go2asia/ui';
import { FavoritePlaceButton } from '@/components/rf/Shared/FavoritePlaceButton';
import {
  buildPublicActiveOffersByPartner,
  getCatalogCategoryFilterOptions,
  getOfferBadge,
  getOfferTypePresentation,
  getPartnerLocation,
  getPartnerPresentation,
  getPartnerTrust,
  partnerFeaturedScore,
  rfAtmosphereTagLabels,
  rfCatalogContent,
  rfMicrocopy,
} from '@/lib/rfFirstSliceContent';

type SortKey = 'featured' | 'name' | 'offers';
type ViewMode = 'grid' | 'list';
type OfferScope = 'all' | 'with_public' | 'without_public';

export interface RfPlacesCatalogProps {
  partners: RfPartnerDto[];
  offers: RfOfferDto[];
  partnersUnavailable: boolean;
  offersUnavailable: boolean;
}

function chipBase(active: boolean) {
  return `rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
    active
      ? 'border-blue-600 bg-blue-50 text-blue-900'
      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
  }`;
}

function categoryMatches(partnerProfile: ReturnType<typeof getPartnerPresentation>, key: string): boolean {
  if (key === 'all') return true;
  if (key === 'family_places') {
    return (
      partnerProfile.catalogCategoryKey === 'family_places' ||
      partnerProfile.atmosphereTags.includes('family')
    );
  }
  return partnerProfile.catalogCategoryKey === key;
}

export function RfPlacesCatalog({
  partners,
  offers,
  partnersUnavailable,
  offersUnavailable,
}: RfPlacesCatalogProps) {
  const publicActiveByPartner = useMemo(() => buildPublicActiveOffersByPartner(offers), [offers]);

  const countryOptions = useMemo(() => {
    const ids = [...new Set(partners.map((p) => p.countryId))].sort();
    return ids;
  }, [partners]);

  const cityOptions = useMemo(() => {
    const ids = [...new Set(partners.map((p) => p.cityId))].sort();
    return ids;
  }, [partners]);

  const districtOptions = useMemo(() => {
    const labels = new Set<string>();
    for (const p of partners) {
      labels.add(getPartnerPresentation(p).districtLabel);
    }
    return [...labels].sort();
  }, [partners]);

  const [q, setQ] = useState('');
  const [countryId, setCountryId] = useState<string>('all');
  const [cityId, setCityId] = useState<string>('all');
  const [district, setDistrict] = useState<string>('all');
  const [categoryKey, setCategoryKey] = useState<string>('all');
  const [offerScope, setOfferScope] = useState<OfferScope>('all');
  const [offerTypes, setOfferTypes] = useState<Set<RfOfferDto['offerType']>>(new Set());
  const [atmosphere, setAtmosphere] = useState<Set<string>>(new Set());
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>('featured');
  const [view, setView] = useState<ViewMode>('grid');

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const typeSet = offerTypes;
    const vibeSet = atmosphere;

    const list = partners.filter((partner) => {
      const profile = getPartnerPresentation(partner);
      const loc = getPartnerLocation(partner).toLowerCase();
      const po = publicActiveByPartner.get(partner.id) ?? [];

      if (countryId !== 'all' && partner.countryId !== countryId) return false;
      if (cityId !== 'all' && partner.cityId !== cityId) return false;
      if (district !== 'all' && profile.districtLabel !== district) return false;
      if (!categoryMatches(profile, categoryKey)) return false;

      if (offerScope === 'with_public' && po.length === 0) return false;
      if (offerScope === 'without_public' && po.length > 0) return false;

      if (typeSet.size > 0) {
        const types = new Set(po.map((o) => o.offerType));
        const any = [...typeSet].some((t) => types.has(t));
        if (!any) return false;
      }

      if (vibeSet.size > 0) {
        const tags = new Set(profile.atmosphereTags);
        const any = [...vibeSet].some((t) => tags.has(t));
        if (!any) return false;
      }

      if (verifiedOnly && !(partner.atlasPlaceId || partner.hostAtlasPlaceId)) return false;

      if (query) {
        const hay = [
          partner.displayName,
          profile.tagline,
          profile.categoryLabel,
          profile.districtLabel,
          profile.story,
          ...profile.atmosphereTags.map((t) => rfAtmosphereTagLabels[t] ?? t),
          ...po.map((o) => o.title),
        ]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(query) && !loc.includes(query)) return false;
      }

      return true;
    });

    const sorted = [...list].sort((a, b) => {
      if (sort === 'name') {
        return a.displayName.localeCompare(b.displayName, 'ru');
      }
      if (sort === 'offers') {
        const na = publicActiveByPartner.get(a.id)?.length ?? 0;
        const nb = publicActiveByPartner.get(b.id)?.length ?? 0;
        return nb - na;
      }
      return partnerFeaturedScore(b, publicActiveByPartner) - partnerFeaturedScore(a, publicActiveByPartner);
    });

    return sorted;
  }, [
    partners,
    q,
    countryId,
    cityId,
    district,
    categoryKey,
    offerScope,
    offerTypes,
    atmosphere,
    verifiedOnly,
    sort,
    publicActiveByPartner,
  ]);

  const categoryChips = getCatalogCategoryFilterOptions();
  const offerTypeEntries = (
    ['discount', 'bundle', 'gift', 'access', 'campaign', 'event_related'] as RfOfferDto['offerType'][]
  ).map((t) => ({ t, ...getOfferTypePresentation(t) }));

  const atmosphereKeys = [...new Set(partners.flatMap((p) => getPartnerPresentation(p).atmosphereTags))].sort();

  const resetAll = () => {
    setQ('');
    setCountryId('all');
    setCityId('all');
    setDistrict('all');
    setCategoryKey('all');
    setOfferScope('all');
    setOfferTypes(new Set());
    setAtmosphere(new Set());
    setVerifiedOnly(false);
    setSort('featured');
  };

  const countryLabels: Record<string, string> = {
    country_th: 'Таиланд',
    country_vn: 'Вьетнам',
  };
  const cityLabels: Record<string, string> = {
    city_phuket: 'Пхукет',
    city_da_nang: 'Дананг',
  };

  if (partnersUnavailable) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
        {rfMicrocopy.temporaryUnavailable}
      </div>
    );
  }

  if (partners.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
        {rfMicrocopy.emptyPartnersCatalog}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{rfCatalogContent.pageTitle}</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">{rfCatalogContent.pageSubtitle}</p>
        <nav className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600">
          <Link href="/rf/map" className="font-medium text-blue-700 hover:text-blue-800">
            {rfCatalogContent.crossLinkMap}
          </Link>
          <span className="text-slate-300">·</span>
          <Link href="/rf/vouchers" className="font-medium text-blue-700 hover:text-blue-800">
            {rfCatalogContent.crossLinkOffers}
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
            {rfCatalogContent.crossLinkHow}
          </Link>
        </nav>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={rfCatalogContent.searchPlaceholder}
              className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none ring-blue-500/30 focus:border-blue-500 focus:ring-2"
              aria-label={rfCatalogContent.searchPlaceholder}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 text-xs text-slate-600">
              <span className="whitespace-nowrap">{rfCatalogContent.sortLabel}</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900"
              >
                <option value="featured">По релевантности</option>
                <option value="offers">Больше офферов</option>
                <option value="name">По названию</option>
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
                {rfCatalogContent.viewGrid}
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
                {rfCatalogContent.viewList}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500">{rfCatalogContent.filterCountry}</span>
            <button type="button" className={chipBase(countryId === 'all')} onClick={() => setCountryId('all')}>
              {rfCatalogContent.chipAll}
            </button>
            {countryOptions.map((id) => (
              <button key={id} type="button" className={chipBase(countryId === id)} onClick={() => setCountryId(id)}>
                {countryLabels[id] ?? id}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500">{rfCatalogContent.filterCity}</span>
            <button type="button" className={chipBase(cityId === 'all')} onClick={() => setCityId('all')}>
              {rfCatalogContent.chipAll}
            </button>
            {cityOptions.map((id) => (
              <button key={id} type="button" className={chipBase(cityId === id)} onClick={() => setCityId(id)}>
                {cityLabels[id] ?? id}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500">{rfCatalogContent.filterDistrict}</span>
            <button type="button" className={chipBase(district === 'all')} onClick={() => setDistrict('all')}>
              {rfCatalogContent.chipAll}
            </button>
            {districtOptions.map((d) => (
              <button key={d} type="button" className={chipBase(district === d)} onClick={() => setDistrict(d)}>
                {d}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500">{rfCatalogContent.filterCategory}</span>
            <button type="button" className={chipBase(categoryKey === 'all')} onClick={() => setCategoryKey('all')}>
              {rfCatalogContent.chipAll}
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
            <span className="text-xs font-medium text-slate-500">{rfCatalogContent.filterOffers}</span>
            <button type="button" className={chipBase(offerScope === 'all')} onClick={() => setOfferScope('all')}>
              {rfCatalogContent.chipAll}
            </button>
            <button
              type="button"
              className={chipBase(offerScope === 'with_public')}
              onClick={() => setOfferScope('with_public')}
            >
              {rfCatalogContent.chipWithOffers}
            </button>
            <button
              type="button"
              className={chipBase(offerScope === 'without_public')}
              onClick={() => setOfferScope('without_public')}
            >
              {rfCatalogContent.chipNoOffers}
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500">{rfCatalogContent.filterOfferType}</span>
            <button
              type="button"
              className={chipBase(offerTypes.size === 0)}
              onClick={() => setOfferTypes(new Set())}
            >
              {rfCatalogContent.chipAll}
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
          {atmosphereKeys.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-slate-500">{rfCatalogContent.filterVibe}</span>
              <button
                type="button"
                className={chipBase(atmosphere.size === 0)}
                onClick={() => setAtmosphere(new Set())}
              >
                {rfCatalogContent.chipAll}
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
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="rounded border-slate-300"
              />
              {rfCatalogContent.filterVerified}
            </label>
            <Button type="button" variant="secondary" size="sm" onClick={resetAll}>
              {rfCatalogContent.resetFilters}
            </Button>
            <span className="text-xs text-slate-500">{rfCatalogContent.resultsCount(filtered.length)}</span>
          </div>
        </div>

        {!offersUnavailable ? (
          <p className="mt-3 text-xs text-slate-500">{rfCatalogContent.offersAnchoredNote}</p>
        ) : (
          <p className="mt-3 text-xs text-amber-700">{rfMicrocopy.temporaryUnavailable}</p>
        )}
      </header>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">{rfMicrocopy.noResults}</div>
      ) : view === 'grid' ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((partner) => (
            <PlaceCard key={partner.id} partner={partner} layout="grid" publicOffers={publicActiveByPartner.get(partner.id) ?? []} />
          ))}
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((partner) => (
            <li key={partner.id}>
              <PlaceCard partner={partner} layout="list" publicOffers={publicActiveByPartner.get(partner.id) ?? []} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PlaceCard({
  partner,
  publicOffers,
  layout,
}: {
  partner: RfPartnerDto;
  publicOffers: RfOfferDto[];
  layout: 'grid' | 'list';
}) {
  const profile = getPartnerPresentation(partner);
  const trust = getPartnerTrust(partner);
  const offerCount = publicOffers.length;

  const offerBadges = [...new Map(publicOffers.map((o) => [o.offerType, getOfferBadge(o)])).values()].slice(0, 3);

  const tagLabels = profile.atmosphereTags.map((t) => rfAtmosphereTagLabels[t] ?? t);

  const body = (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-slate-900">{partner.displayName}</h2>
          <p className="text-xs text-slate-500">
            {getPartnerLocation(partner)}
            {profile.districtLabel ? ` · ${profile.districtLabel}` : ''}
          </p>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${trust.tone}`}>{trust.label}</span>
      </div>
      <p className="text-xs font-medium text-slate-600">{profile.categoryLabel}</p>
      <p className="text-sm text-slate-700">{profile.tagline}</p>
      <div className="flex flex-wrap gap-1.5">
        {tagLabels.map((label) => (
          <span key={label} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
            {label}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {offerCount > 0 ? (
          <>
            <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800">
              {offerCount} {offerCount === 1 ? 'оффер' : 'офферов'}
            </span>
            {offerBadges.map((b) => (
              <span key={b.label} className={`rounded-full px-2 py-1 text-xs font-medium ${b.tone}`}>
                {b.label}
              </span>
            ))}
          </>
        ) : (
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">Нет публичных офферов</span>
        )}
      </div>
      <p className="text-xs text-slate-500">{trust.note}</p>
    </div>
  );

  const cta = (
    <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      <Link
        href={`/rf/${encodeURIComponent(partner.id)}`}
        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Подробнее
      </Link>
      <Link
        href={`/rf/vouchers?partner=${encodeURIComponent(partner.id)}`}
        className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50"
      >
        Офферы
      </Link>
      <Link
        href={`/rf/map?city=${encodeURIComponent(partner.cityId)}`}
        className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
      >
        На карте
      </Link>
      <FavoritePlaceButton partnerId={partner.id} label={partner.displayName} />
    </div>
  );

  if (layout === 'list') {
    return (
      <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-start lg:justify-between">
        {body}
        {cta}
      </article>
    );
  }

  return (
    <article
      className={`flex h-full flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-gradient-to-br ${profile.cardTone} p-5 shadow-sm`}
    >
      {body}
      {cta}
    </article>
  );
}
