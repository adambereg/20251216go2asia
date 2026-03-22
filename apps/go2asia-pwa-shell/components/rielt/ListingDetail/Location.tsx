'use client';

/**
 * Rielt.Market Asia - Location
 * Honest location/place truth from runtime payload.
 */

import { MapPin, ExternalLink, Building2 } from 'lucide-react';
import Link from 'next/link';
import type { Listing } from '../types';

interface LocationProps {
  listing: Listing;
}

export function Location({ listing }: LocationProps) {
  const atlasPlaceId = listing.address.atlasPlaceId ?? null;
  const atlasContainerPlaceId = listing.address.atlasContainerPlaceId ?? null;
  const hasAnyAtlasLink = Boolean(atlasPlaceId || atlasContainerPlaceId);

  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Где находится</h2>

      {/* Runtime location identity */}
      <div className="mb-6">
        <div className="flex items-start gap-3 mb-2">
          <MapPin className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-semibold text-slate-900">
              {listing.address.city || 'city_id is not specified'}, {listing.address.country}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Runtime does not expose public listing coordinates; location is shown from country/city IDs and Atlas links
              when available.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-500" />
          Atlas place linking
        </h3>

        {hasAnyAtlasLink ? (
          <div className="space-y-2">
            <p className="text-sm text-slate-700">
              atlasPlaceId: {atlasPlaceId ?? 'not linked'}
            </p>
            <p className="text-sm text-slate-700">
              atlasContainerPlaceId: {atlasContainerPlaceId ?? 'not linked'}
            </p>
            {atlasPlaceId ? (
              <Link
                href={`/atlas/places/${encodeURIComponent(atlasPlaceId)}`}
                className="text-emerald-600 hover:text-emerald-700 text-sm inline-flex items-center gap-1"
              >
                Open Atlas place
                <ExternalLink className="w-3 h-3" />
              </Link>
            ) : null}
            {atlasContainerPlaceId ? (
              <div>
                <Link
                  href={`/atlas/places/${encodeURIComponent(atlasContainerPlaceId)}`}
                  className="text-emerald-600 hover:text-emerald-700 text-sm inline-flex items-center gap-1"
                >
                  Open Atlas container place
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-slate-600">
            Atlas place links are not provided for this listing yet (nullable by design).
          </p>
        )}
      </div>
    </div>
  );
}

