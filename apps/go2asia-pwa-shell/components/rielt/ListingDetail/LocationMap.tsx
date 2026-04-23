'use client';

import { Circle, MapContainer, Marker, TileLayer } from 'react-leaflet';
import { Icon } from 'leaflet';
import type { Listing } from '../types';
import { getMapRadiusByPrecision, resolveMapPoint } from '../utils/geo';

interface LocationMapProps {
  listing: Listing;
}

export function LocationMap({ listing }: LocationMapProps) {
  const geo = resolveMapPoint(listing);
  if (!geo.coordinates) return null;

  const radius = geo.radiusM ?? getMapRadiusByPrecision(geo.precision);
  const markerIcon = new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(
      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="34" viewBox="0 0 24 34">
        <path fill="#10B981" d="M12 0C5.4 0 0 5.4 0 12c0 8.4 12 22 12 22s12-13.6 12-22C24 5.4 18.6 0 12 0z"/>
        <circle fill="white" cx="12" cy="12" r="5"/>
      </svg>`
    )}`,
    iconSize: [24, 34],
    iconAnchor: [12, 34],
  });

  return (
    <div className="rounded-xl overflow-hidden border-2 border-slate-200">
      <div className="h-[280px] md:h-[340px]">
        <MapContainer
          center={[geo.coordinates.lat, geo.coordinates.lng]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={[geo.coordinates.lat, geo.coordinates.lng]}
            icon={markerIcon}
          />
          {radius ? (
            <Circle
              center={[geo.coordinates.lat, geo.coordinates.lng]}
              radius={radius}
              pathOptions={{ color: '#10B981', weight: 1, opacity: 0.6, fillOpacity: 0.08 }}
            />
          ) : null}
        </MapContainer>
      </div>
    </div>
  );
}
