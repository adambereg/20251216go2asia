'use client';

import Link from 'next/link';
import type { RfOfferDto, RfPartnerDto } from '@go2asia/sdk/rf';
import { useRfFavorites } from '@/hooks/useRfLocalContour';
import { RfLocalStorageNotice } from '@/components/rf/Shared/RfLocalStorageNotice';
import { FavoriteOfferButton } from '@/components/rf/Shared/FavoriteOfferButton';
import { FavoritePlaceButton } from '@/components/rf/Shared/FavoritePlaceButton';
import { getOfferBadge, getOfferSummaryLine, rfFavoritesPageContent } from '@/lib/rfFirstSliceContent';

export function RfFavoritesView({ partners, offers }: { partners: RfPartnerDto[]; offers: RfOfferDto[] }) {
  const { places: placeIds, offers: offerIds } = useRfFavorites();

  const placeRows = placeIds
    .map((id) => partners.find((p) => p.id === id))
    .filter(Boolean) as RfPartnerDto[];

  const offerRows = offerIds
    .map((id) => offers.find((o) => o.id === id))
    .filter(Boolean) as RfOfferDto[];

  const partnerById = new Map(partners.map((p) => [p.id, p]));

  return (
    <div className="space-y-6">
      <RfLocalStorageNotice>{rfFavoritesPageContent.localWarning}</RfLocalStorageNotice>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">{rfFavoritesPageContent.placesTab}</h2>
        {placeRows.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">{rfFavoritesPageContent.emptyPlaces}</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {placeRows.map((p) => (
              <li key={p.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Link href={`/rf/${encodeURIComponent(p.id)}`} className="font-medium text-blue-700 hover:text-blue-800">
                    {p.displayName}
                  </Link>
                  <p className="text-xs text-slate-500">{rfFavoritesPageContent.removeHint}</p>
                </div>
                <FavoritePlaceButton partnerId={p.id} label={p.displayName} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">{rfFavoritesPageContent.offersTab}</h2>
        {offerRows.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">{rfFavoritesPageContent.emptyOffers}</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {offerRows.map((o) => {
              const partner = partnerById.get(o.partnerId);
              const badge = getOfferBadge(o);
              return (
                <li key={o.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{o.title}</p>
                    <p className="text-xs text-slate-600">{getOfferSummaryLine(o)}</p>
                    {partner ? (
                      <Link
                        href={`/rf/${encodeURIComponent(partner.id)}`}
                        className="mt-1 inline-block text-xs text-blue-700 hover:text-blue-800"
                      >
                        Место: {partner.displayName}
                      </Link>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${badge.tone}`}>{badge.label}</span>
                    <FavoriteOfferButton offerId={o.id} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/rf" className="font-medium text-blue-700 hover:text-blue-800">
          К каталогу мест
        </Link>
        <Link href="/rf/vouchers" className="font-medium text-blue-700 hover:text-blue-800">
          К предложениям
        </Link>
      </div>
    </div>
  );
}
