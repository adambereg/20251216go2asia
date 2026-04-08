'use client';

/**
 * Rielt.Market Asia - Location
 * Location block with geo precision baseline.
 */

import dynamic from 'next/dynamic';
import { MapPin, ExternalLink, Building2 } from 'lucide-react';
import Link from 'next/link';
import type { Listing } from '../types';
import { getGeoPrecisionHint, getGeoPrecisionLabel, resolveMapPoint } from '../utils/geo';

interface LocationProps {
  listing: Listing;
}

const LocationMap = dynamic(
  () => import('./LocationMap').then((mod) => ({ default: mod.LocationMap })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[280px] md:h-[340px] rounded-xl border-2 border-slate-200 bg-slate-100 flex items-center justify-center text-sm text-slate-500">
        Загрузка карты...
      </div>
    ),
  }
);

export function Location({ listing }: LocationProps) {
  const atlasPlaceId = listing.address.atlasPlaceId ?? null;
  const atlasContainerPlaceId = listing.address.atlasContainerPlaceId ?? null;
  const hasAnyAtlasLink = Boolean(atlasPlaceId || atlasContainerPlaceId);
  const geo = resolveMapPoint(listing);
  const showMap = Boolean(geo.coordinates);
  const cityLabel = listing.address.city || 'Город уточняется';

  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Где находится</h2>

      <div className="mb-6">
        <div className="flex items-start gap-3 mb-2">
          <MapPin className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-semibold text-slate-900">
              {listing.address.district ? `${listing.address.district}, ` : ''}
              {cityLabel}, {listing.address.country}
            </div>
            <div className="mt-1 inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
              {getGeoPrecisionLabel(geo.precision)}
            </div>
            <p className="text-xs text-slate-600 mt-2">{getGeoPrecisionHint(geo.precision)}</p>
          </div>
        </div>
      </div>

      {showMap ? (
        <div className="mb-6">
          <LocationMap listing={listing} />
        </div>
      ) : (
        <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
          Для этого объявления карта пока недоступна.
        </div>
      )}

      <div className="space-y-3">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-500" />
          Связь с Atlas
        </h3>

        {hasAnyAtlasLink ? (
          <div className="space-y-2">
            {atlasPlaceId ? (
              <Link
                href={`/atlas/places/${encodeURIComponent(atlasPlaceId)}`}
                className="text-emerald-600 hover:text-emerald-700 text-sm inline-flex items-center gap-1"
              >
                Открыть место в Atlas
                <ExternalLink className="w-3 h-3" />
              </Link>
            ) : null}
            {atlasContainerPlaceId ? (
              <div>
                <Link
                  href={`/atlas/places/${encodeURIComponent(atlasContainerPlaceId)}`}
                  className="text-emerald-600 hover:text-emerald-700 text-sm inline-flex items-center gap-1"
                >
                  Открыть контейнер места в Atlas
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-slate-600">
            Ссылки Atlas для этого объявления пока не добавлены.
          </p>
        )}
      </div>
    </div>
  );
}

