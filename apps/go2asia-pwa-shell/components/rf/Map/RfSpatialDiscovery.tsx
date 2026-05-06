'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { RfOfferDto, RfPartnerDto } from '@go2asia/sdk/rf';
import {
  buildPublicActiveOffersByPartner,
  getPartnerLocation,
  getPartnerPresentation,
  getRfCityLabel,
  rfMapPageContent,
} from '@/lib/rfFirstSliceContent';

export interface RfSpatialDiscoveryProps {
  partners: RfPartnerDto[];
  offers: RfOfferDto[];
  initialCityId?: string;
}

function initialCitySelection(partners: RfPartnerDto[], initialCityId?: string): string {
  const opts = [...new Set(partners.map((p) => p.cityId))];
  if (initialCityId && opts.includes(initialCityId)) return initialCityId;
  return opts[0] ?? '';
}

export function RfSpatialDiscovery({ partners, offers, initialCityId }: RfSpatialDiscoveryProps) {
  const cityOptions = useMemo(() => [...new Set(partners.map((p) => p.cityId))].sort(), [partners]);
  const [cityId, setCityId] = useState(() => initialCitySelection(partners, initialCityId));

  useEffect(() => {
    if (initialCityId && cityOptions.includes(initialCityId)) setCityId(initialCityId);
  }, [initialCityId, cityOptions]);

  const publicActive = useMemo(() => buildPublicActiveOffersByPartner(offers), [offers]);

  const inCity = useMemo(() => partners.filter((p) => p.cityId === cityId), [partners, cityId]);

  const zones = useMemo(() => {
    const m = new Map<string, RfPartnerDto[]>();
    for (const p of inCity) {
      const z = getPartnerPresentation(p).districtLabel;
      const arr = m.get(z) ?? [];
      arr.push(p);
      m.set(z, arr);
    }
    return [...m.entries()].sort(([a], [b]) => a.localeCompare(b, 'ru'));
  }, [inCity]);

  const offerCountInCity = useMemo(() => {
    return inCity.reduce((acc, p) => acc + (publicActive.get(p.id)?.length ?? 0), 0);
  }, [inCity, publicActive]);

  if (partners.length === 0) {
    return (
      <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
        Пока нет партнёров для отображения на карте-обзоре. Загляните позже или откройте{' '}
        <Link href="/rf" className="font-medium text-blue-700 hover:text-blue-800">
          каталог партнёров
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h1 className="text-2xl font-semibold text-slate-900">{rfMapPageContent.pageTitle}</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">{rfMapPageContent.pageSubtitle}</p>
        <p className="mt-2 text-xs text-slate-500">{rfMapPageContent.zoneHint}</p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500">{rfMapPageContent.cityLabel}</span>
          {cityOptions.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setCityId(id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                cityId === id
                  ? 'border-blue-600 bg-blue-50 text-blue-900'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              {getRfCityLabel(id)}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Ориентир на месте</p>
            <p className="mt-1 text-sm text-slate-700">
              {getRfCityLabel(cityId)} — {rfMapPageContent.partnerCount(inCity.length)}, публичных активных офферов:{' '}
              {offerCountInCity}
            </p>
            <div className="mt-4 grid min-h-[180px] grid-cols-2 gap-2 sm:grid-cols-3">
              {zones.slice(0, 6).map(([zone, list]) => (
                <div
                  key={zone}
                  className="flex flex-col justify-end rounded-xl border border-white/60 bg-gradient-to-br from-slate-200 to-slate-100 p-3 text-left shadow-inner"
                >
                  <p className="text-[11px] font-semibold text-slate-800">{zone}</p>
                  <p className="text-[10px] text-slate-600">{list.length} мест</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-slate-500">
              Блок имитирует «карту районов» без координат: ячейки = зоны из support-слоя партнёров.
            </p>
          </div>

          <div className="flex flex-col justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <Link href="/rf" className="text-sm font-medium text-blue-700 hover:text-blue-800">
              → {rfMapPageContent.openCatalog}
            </Link>
            <Link href="/rf/vouchers" className="text-sm font-medium text-blue-700 hover:text-blue-800">
              → {rfMapPageContent.openOffers}
            </Link>
            <Link href="/rf/how-it-works" className="text-sm font-medium text-slate-700 hover:text-slate-900">
              → Как это работает
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{rfMapPageContent.listTitle}</h2>
        <ul className="mt-4 divide-y divide-slate-100">
          {inCity.map((p) => {
            const profile = getPartnerPresentation(p);
            const oc = publicActive.get(p.id)?.length ?? 0;
            return (
              <li key={p.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-slate-900">{p.displayName}</p>
                  <p className="text-xs text-slate-500">
                    {getPartnerLocation(p)} · {profile.districtLabel}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">{profile.categoryLabel}</p>
                  {oc > 0 ? (
                    <p className="mt-1 text-xs text-emerald-700">Публичных активных офферов: {oc}</p>
                  ) : (
                    <p className="mt-1 text-xs text-slate-500">Нет публичных активных офферов на витрине</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/rf/${encodeURIComponent(p.id)}`}
                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                  >
                    Карточка места
                  </Link>
                  <Link
                    href={`/rf/vouchers?partner=${encodeURIComponent(p.id)}`}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-50"
                  >
                    Офферы места
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
