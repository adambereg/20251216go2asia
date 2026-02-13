'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import Supercluster from 'supercluster';
import type { GeoItem } from './geoContract';
import { StableMapContainer } from './StableMapContainer';

type BBox = [west: number, south: number, east: number, north: number];

type GeoPointFeature = GeoJSON.Feature<GeoJSON.Point, { item: GeoItem }>;
type ClusterFeature = GeoJSON.Feature<GeoJSON.Point, any>;

function toFeature(item: GeoItem): GeoPointFeature {
  return {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [item.lng, item.lat] },
    properties: { item },
  };
}

function clampLat(lat: number): number {
  // Web Mercator practical bounds
  return Math.max(-85, Math.min(85, lat));
}

function getBoundsFromItems(items: GeoItem[]): L.LatLngBounds | null {
  const coords = items
    .map((i) => [clampLat(i.lat), i.lng] as const)
    .filter(([lat, lng]) => Number.isFinite(lat) && Number.isFinite(lng));
  if (coords.length === 0) return null;
  const b = L.latLngBounds(coords.map(([lat, lng]) => L.latLng(lat, lng)));
  return b.isValid() ? b : null;
}

function createClusterIcon(count: number): L.DivIcon {
  const size = count < 10 ? 32 : count < 100 ? 38 : 46;
  const fontSize = count < 10 ? 12 : count < 100 ? 12 : 11;
  const html = `
    <div style="
      width:${size}px;
      height:${size}px;
      border-radius:${size}px;
      background: rgba(14,165,233,0.92);
      border: 2px solid white;
      display:flex;
      align-items:center;
      justify-content:center;
      box-shadow: 0 6px 16px rgba(15,23,42,0.18);
      ">
      <span style="color:white;font-weight:700;font-size:${fontSize}px;line-height:1;">
        ${count}
      </span>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'geo-cluster-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function createItemIcon(kind: 'city' | 'place'): L.DivIcon {
  const color = kind === 'city' ? '#2563eb' : '#16a34a';
  const size = 26;
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
            fill="${color}"
            stroke="white"
            stroke-width="1"/>
      <circle cx="12" cy="9" r="2.5" fill="white"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: 'geo-item-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

function FitBounds({ bounds }: { bounds: L.LatLngBounds | null }) {
  const map = useMap();
  const didFit = useRef(false);

  useEffect(() => {
    if (!bounds) return;
    if (didFit.current) return;
    didFit.current = true;
    map.fitBounds(bounds, { padding: [24, 24] });
  }, [bounds, map]);

  return null;
}

function ViewportTracker({
  onChange,
}: {
  onChange: (bbox: BBox, zoom: number) => void;
}) {
  const map = useMap();
  useMapEvents({
    moveend: () => {
      const b = map.getBounds();
      const zoom = map.getZoom();
      onChange([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()], zoom);
    },
    zoomend: () => {
      const b = map.getBounds();
      const zoom = map.getZoom();
      onChange([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()], zoom);
    },
  });

  useEffect(() => {
    const b = map.getBounds();
    onChange([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()], map.getZoom());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

function getItemHref(item: GeoItem): string {
  if (item.type === 'city') return `/atlas/cities/${item.id}`;
  if (item.type === 'place') return `/atlas/places/${item.id}`;
  return '#';
}

export interface CountryGeoMapViewProps {
  countryId: string;
  cities: GeoItem[];
  places: GeoItem[];
}

export function CountryGeoMapView({ countryId, cities, places }: CountryGeoMapViewProps) {
  const [showCities, setShowCities] = useState(true);
  const [showPlaces, setShowPlaces] = useState(true);
  const [bbox, setBbox] = useState<BBox | null>(null);
  const [zoom, setZoom] = useState(5);
  const mapRef = useRef<L.Map | null>(null);
  const mapMountKey = `country-map-${countryId}`;

  const visibleItems = useMemo(() => {
    const out: GeoItem[] = [];
    if (showCities) out.push(...cities);
    if (showPlaces) out.push(...places);
    return out;
  }, [cities, places, showCities, showPlaces]);

  const bounds = useMemo(() => getBoundsFromItems(visibleItems), [visibleItems]);

  const index = useMemo(() => {
    const sc = new Supercluster<{ item: GeoItem }, { sum: number }>({
      radius: 60,
      maxZoom: 18,
    });
    sc.load(visibleItems.map(toFeature));
    return sc;
  }, [visibleItems]);

  const clusters = useMemo<ClusterFeature[]>(() => {
    const box = bbox ?? ([-180, -85, 180, 85] as BBox);
    return index.getClusters(box, Math.round(zoom));
  }, [bbox, index, zoom]);

  const cityIcon = useMemo(() => createItemIcon('city'), []);
  const placeIcon = useMemo(() => createItemIcon('place'), []);

  // Bangkok fallback (SEA-friendly)
  const defaultCenter: [number, number] = [13.7563, 100.5018];

  return (
    <div className="relative w-full">
      {/* Панель слоёв */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 shadow-sm">
            <input
              type="checkbox"
              checked={showCities}
              onChange={(e) => setShowCities(e.target.checked)}
            />
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Города ({cities.length})
            </span>
          </label>

          <label className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 shadow-sm">
            <input
              type="checkbox"
              checked={showPlaces}
              onChange={(e) => setShowPlaces(e.target.checked)}
            />
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-600" />
              Места ({places.length})
            </span>
          </label>
        </div>

        <div className="text-xs text-slate-500">
          Кластеризация включена • OSM
        </div>
      </div>

      {/* Карта */}
      <div
        key={mapMountKey}
        className="h-[520px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <StableMapContainer
          ref={(m) => {
            mapRef.current = m;
          }}
          key={mapMountKey}
          center={defaultCenter}
          zoom={5}
          className="h-full w-full"
          scrollWheelZoom={true}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ViewportTracker
            onChange={(b, z) => {
              setBbox(b);
              setZoom(z);
            }}
          />

          <FitBounds bounds={bounds} />

          {/* Маркеры и кластеры */}
          {clusters.map((feature) => {
            const [lng, lat] = feature.geometry.coordinates as [number, number];
            const props: any = feature.properties;
            const isCluster = Boolean(props?.cluster);

            if (isCluster) {
              const clusterId = props.cluster_id as number;
              const pointCount = props.point_count as number;
              const icon = createClusterIcon(pointCount);

              return (
                <Marker
                  key={`cluster-${clusterId}`}
                  position={[lat, lng]}
                  icon={icon}
                  eventHandlers={{
                    click: (e) => {
                      const map = (e.target as any)._map as L.Map | undefined;
                      if (!map) return;
                      const nextZoom = Math.min(index.getClusterExpansionZoom(clusterId), 18);
                      map.setView([lat, lng], nextZoom);
                    },
                  }}
                />
              );
            }

            const item: GeoItem | undefined = props?.item;
            if (!item) return null;
            const href = getItemHref(item);
            const icon = item.type === 'city' ? cityIcon : placeIcon;
            const badgeClass =
              item.type === 'city'
                ? 'bg-blue-600'
                : 'bg-green-600';
            const badgeLabel = item.type === 'city' ? 'Город' : 'Место';

            return (
              <Marker
                key={`${item.type}-${item.id}`}
                position={[item.lat, item.lng]}
                icon={icon}
              >
                <Popup>
                  <div className="p-2 min-w-[220px]">
                    <div className="mb-2 flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium text-white ${badgeClass}`}>
                        {badgeLabel}
                      </span>
                      {item.subtype && (
                        <span className="text-xs text-slate-500">{item.subtype}</span>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-slate-900 mb-2">
                      {item.title}
                    </div>
                    <Link
                      href={href}
                      className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800"
                    >
                      Открыть
                    </Link>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </StableMapContainer>
      </div>
    </div>
  );
}

