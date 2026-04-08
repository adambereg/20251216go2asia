'use client';

/**
 * Rielt.Market Asia - ListingsMap
 * Карта с маркерами объявлений
 */

import { Fragment, useEffect } from 'react';
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MARKER_COLORS } from '../types';
import type { ListingWithDistance } from '../types';
import { getGeoPrecisionHint, getGeoPrecisionLabel, getMapRadiusByPrecision, resolveMapPoint } from '../utils/geo';

interface ListingsMapProps {
  listings: ListingWithDistance[];
  userLocation: { lat: number; lng: number } | null;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
}

// Компонент для центрирования карты
function MapCenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [map, center]);
  return null;
}

export function ListingsMap({
  listings,
  userLocation,
  selectedId,
  onSelect,
}: ListingsMapProps) {
  void selectedId;
  const mappedListings = listings
    .map((listing) => {
      const geo = resolveMapPoint(listing);
      if (!geo.coordinates) return null;
      return {
        listing,
        coordinates: geo.coordinates,
        precision: geo.precision,
        radiusM: geo.radiusM,
        source: geo.source,
      };
    })
    .filter(Boolean) as Array<{
    listing: ListingWithDistance;
    coordinates: { lat: number; lng: number };
    precision: ReturnType<typeof resolveMapPoint>['precision'];
    radiusM: number | null;
    source: ReturnType<typeof resolveMapPoint>['source'];
  }>;
  const hiddenCount = listings.length - mappedListings.length;
  const hasCoarsePrecision = mappedListings.some((item) => item.precision === 'area' || item.precision === 'city');

  if (mappedListings.length === 0) {
    return (
      <div className="w-full h-[400px] lg:h-full rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-100 flex items-center justify-center p-6 text-center">
        <div>
          <p className="text-slate-700 text-sm font-medium">На карте пока нечего отметить</p>
          <p className="text-slate-500 text-xs mt-1">У объявлений в этой выдаче нет доступного геопредставления.</p>
        </div>
      </div>
    );
  }

  // Центр карты (первое объявление или геолокация пользователя)
  const mapCenter: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [mappedListings[0].coordinates.lat, mappedListings[0].coordinates.lng];

  return (
    <div className="w-full h-[400px] lg:h-full rounded-xl overflow-hidden border-2 border-slate-200">
      {hasCoarsePrecision ? (
        <div className="px-3 py-2 text-xs text-blue-800 bg-blue-50 border-b border-blue-200">
          Для части объявлений показан район или ориентир в городе.
        </div>
      ) : null}
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <MapCenter center={mapCenter} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Маркеры объявлений */}
        {mappedListings.map(({ listing, coordinates, precision, radiusM }) => {
          const color = MARKER_COLORS[listing.type];
          const radius = radiusM ?? getMapRadiusByPrecision(precision);
          const customIcon = new Icon({
            iconUrl: `data:image/svg+xml;base64,${btoa(
              `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="35" viewBox="0 0 25 35">
                <path fill="${color}" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 8.8 12.5 22.5 12.5 22.5s12.5-13.7 12.5-5.6C25 5.6 19.4 0 12.5 0z"/>
                <circle fill="white" cx="12.5" cy="12.5" r="6"/>
              </svg>`
            )}`,
            iconSize: [25, 35],
            iconAnchor: [12.5, 35],
            popupAnchor: [0, -35],
          });

          return (
            <Fragment key={listing.id}>
              <Marker
                position={[coordinates.lat, coordinates.lng]}
                icon={customIcon}
                eventHandlers={{
                  click: () => onSelect?.(listing.id),
                }}
              >
                <Popup>
                  <div className="w-64 -m-2">
                    <a
                      href={`/rielt/listings/${listing.id}`}
                      className="block"
                    >
                      <div className="text-sm font-semibold text-slate-900 mb-1 line-clamp-1">
                        {listing.title}
                      </div>
                      <div className="text-xs text-slate-600 mb-2">
                        {listing.address.city}, {listing.address.country}
                      </div>
                      <div className="text-xs text-slate-500 mb-2">
                        {getGeoPrecisionLabel(precision)}
                      </div>
                      <div className="text-sm font-bold text-emerald-600">
                        ${listing.rentalType === 'long-term' ? listing.pricing.perMonth : listing.pricing.perNight}
                        <span className="text-xs font-normal text-slate-600">
                          {' '}/ {listing.rentalType === 'long-term' ? 'месяц' : 'ночь'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-2">{getGeoPrecisionHint(precision)}</div>
                    </a>
                  </div>
                </Popup>
              </Marker>
              {radius ? (
                <Circle
                  center={[coordinates.lat, coordinates.lng]}
                  radius={radius}
                  pathOptions={{ color: '#10B981', weight: 1, opacity: 0.6, fillOpacity: 0.08 }}
                />
              ) : null}
            </Fragment>
          );
        })}

        {/* Маркер пользователя */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={new Icon({
              iconUrl: `data:image/svg+xml;base64,${btoa(
                `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                  <circle fill="#3B82F6" cx="10" cy="10" r="8"/>
                  <circle fill="white" cx="10" cy="10" r="4"/>
                </svg>`
              )}`,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })}
          />
        )}
      </MapContainer>
      {hiddenCount > 0 ? (
        <div className="px-3 py-2 text-xs text-slate-600 bg-white border-t border-slate-200">
          Ещё {hiddenCount} {hiddenCount === 1 ? 'объект' : 'объектов'} пока без точки на карте — они остаются в
          списке.
        </div>
      ) : null}
    </div>
  );
}

