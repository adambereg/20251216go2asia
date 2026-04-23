'use client';

import { Circle, CircleMarker, Polyline, TileLayer, Tooltip } from 'react-leaflet';
import { StableMapContainer } from '@/modules/geo/StableMapContainer';
import type { QuestMapPoint } from './questMapPresentation';

interface QuestMapGuidanceProps {
  center: QuestMapPoint;
  radiusMeters?: number | null;
  currentLocation?: QuestMapPoint | null;
  className?: string;
}

function getMapBounds(center: QuestMapPoint, currentLocation?: QuestMapPoint | null): [[number, number], [number, number]] | undefined {
  if (!currentLocation) return undefined;

  const delta = 0.002;
  const minLat = Math.min(center.lat, currentLocation.lat) - delta;
  const maxLat = Math.max(center.lat, currentLocation.lat) + delta;
  const minLng = Math.min(center.lng, currentLocation.lng) - delta;
  const maxLng = Math.max(center.lng, currentLocation.lng) + delta;
  return [
    [minLat, minLng],
    [maxLat, maxLng],
  ];
}

function getZoomByRadius(radiusMeters?: number | null): number {
  if (!radiusMeters) return 13;
  if (radiusMeters <= 500) return 15;
  if (radiusMeters <= 1500) return 14;
  if (radiusMeters <= 4000) return 13;
  return 12;
}

export function QuestMapGuidance({ center, radiusMeters, currentLocation, className }: QuestMapGuidanceProps) {
  const bounds = getMapBounds(center, currentLocation);
  const zoom = getZoomByRadius(radiusMeters);

  return (
    <StableMapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      bounds={bounds}
      scrollWheelZoom={false}
      className={className ?? 'h-72 w-full rounded-xl border border-slate-200'}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <CircleMarker center={[center.lat, center.lng]} radius={8} pathOptions={{ color: '#7c3aed', fillOpacity: 0.9 }}>
        <Tooltip direction="top">Ориентир маршрута</Tooltip>
      </CircleMarker>

      {radiusMeters ? (
        <Circle
          center={[center.lat, center.lng]}
          radius={radiusMeters}
          pathOptions={{ color: '#7c3aed', opacity: 0.7, fillOpacity: 0.08 }}
        />
      ) : null}

      {currentLocation ? (
        <>
          <CircleMarker center={[currentLocation.lat, currentLocation.lng]} radius={7} pathOptions={{ color: '#2563eb', fillOpacity: 0.9 }}>
            <Tooltip direction="top">Ваша текущая позиция</Tooltip>
          </CircleMarker>
          <Polyline
            positions={[
              [center.lat, center.lng],
              [currentLocation.lat, currentLocation.lng],
            ]}
            pathOptions={{ color: '#2563eb', dashArray: '6 8', opacity: 0.85 }}
          />
        </>
      ) : null}
    </StableMapContainer>
  );
}
