'use client';

/**
 * Guru Asia - Client Component
 * Главный клиентский компонент с Split UI (карта + список)
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Navigation,
  Locate,
  AlertCircle,
  Map as MapIcon,
  List,
  ChevronUp,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { Button } from '@go2asia/ui';
import { guru } from '@go2asia/sdk';
import type { GuruEntityCard, GuruPartialFailure, GuruResponseMeta } from '@go2asia/sdk/guru';

const GuruMapView = dynamic(() => import('@/components/guru/GuruMapView'), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

import { GuruFiltersComponent as GuruFilters } from '@/components/guru/GuruFilters';
import { GuruListView } from '@/components/guru/GuruListView';
import { useGeolocation } from '@/components/guru/hooks/useGeolocation';

import type {
  GuruFilters as GuruFiltersType,
  GuruObject,
  GuruObjectWithDistance,
  Coordinates,
  HousingObject,
  PlaceObject,
  EventObject,
  PersonObject,
  QuestObject,
} from '@/components/guru/types';
import { DEFAULT_FILTERS } from '@/components/guru/types';
import { DEFAULT_CENTER } from '@/components/guru/mockObjects';
import { addDistanceToObjects } from '@/components/guru/utils/geo';
import { applyFilters, queryStringToFilters, filtersToQueryString } from '@/components/guru/utils/filters';
import { applySorting } from '@/components/guru/utils/ranking';

const MapSkeleton: React.FC = () => (
  <div className="w-full h-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center">
    <MapIcon className="w-12 h-12 text-slate-300" />
  </div>
);

type ViewMode = 'map' | 'list' | 'split';

type DiscoveryMode = 'nearby' | 'what-to-do';

function pickCardDeeplink(card: GuruEntityCard): string | undefined {
  const actions = Array.isArray(card.actions) ? card.actions : [];
  const preferred = actions.find((action) => action.type === 'open');
  return preferred?.deeplink ?? actions[0]?.deeplink;
}

function mapCardToGuruObject(card: GuruEntityCard): GuruObject | null {
  const city = card.city_id;

  if (card.type === 'listing') {
    const payload = card.payload ?? {};
    const price = typeof payload.price === 'number' ? payload.price : 0;
    const rooms = typeof payload.rooms === 'number' ? payload.rooms : undefined;
    const areaM2 = typeof payload.area_m2 === 'number' ? payload.area_m2 : undefined;

    const object: HousingObject = {
      id: card.id,
      type: 'housing',
      title: card.title,
      description: card.description,
      cover: card.image_url,
      lat: typeof card.lat === 'number' ? card.lat : 0,
      lng: typeof card.lng === 'number' ? card.lng : 0,
      city,
      housingType: 'apartment',
      pricePerNight: Math.max(0, price),
      priceLevel: 2,
      availableNow: card.is_open_now,
      rooms,
      area: areaM2,
      isRF: card.is_rf,
      isVerified: card.is_verified,
      rating: card.rating,
      sourceDomain: card.source?.domain,
      deeplink: pickCardDeeplink(card),
      explainReasons: card.explain?.reasons ?? [],
    };
    return object;
  }

  if (card.type === 'place') {
    const object: PlaceObject = {
      id: card.id,
      type: 'place',
      title: card.title,
      description: card.description,
      cover: card.image_url,
      lat: typeof card.lat === 'number' ? card.lat : 0,
      lng: typeof card.lng === 'number' ? card.lng : 0,
      city,
      categories: Array.isArray(card.tags) ? card.tags : [],
      isOpen: card.is_open_now,
      rating: card.rating,
      isRF: card.is_rf,
      isVerified: card.is_verified,
      sourceDomain: card.source?.domain,
      deeplink: pickCardDeeplink(card),
      explainReasons: card.explain?.reasons ?? [],
    };
    return object;
  }

  if (card.type === 'event') {
    const object: EventObject = {
      id: card.id,
      type: 'event',
      title: card.title,
      description: card.description,
      cover: card.image_url,
      lat: typeof card.lat === 'number' ? card.lat : 0,
      lng: typeof card.lng === 'number' ? card.lng : 0,
      city,
      categories: Array.isArray(card.tags) ? card.tags : [],
      startDate: card.starts_at ?? new Date().toISOString(),
      isHappeningNow: card.explain?.reasons?.includes('happening_now') ?? false,
      rating: card.rating,
      isRF: card.is_rf,
      isVerified: card.is_verified,
      sourceDomain: card.source?.domain,
      deeplink: pickCardDeeplink(card),
      explainReasons: card.explain?.reasons ?? [],
    };
    return object;
  }

  if (card.type === 'partner') {
    const object: PlaceObject = {
      id: card.id,
      type: 'place',
      title: card.title,
      description: card.description,
      cover: card.image_url,
      lat: typeof card.lat === 'number' ? card.lat : 0,
      lng: typeof card.lng === 'number' ? card.lng : 0,
      city,
      categories: ['partner'],
      isOpen: card.is_open_now,
      rating: card.rating,
      isRF: card.is_rf,
      isVerified: card.is_verified,
      sourceDomain: card.source?.domain,
      deeplink: pickCardDeeplink(card),
      explainReasons: card.explain?.reasons ?? [],
    };
    return object;
  }

  if (card.type === 'pro') {
    const payload = card.payload ?? {};
    const object: PersonObject = {
      id: card.id,
      type: 'person',
      title: card.title,
      displayName: card.title,
      description: card.description,
      cover: card.image_url,
      avatar: card.image_url,
      lat: typeof card.lat === 'number' ? card.lat : 0,
      lng: typeof card.lng === 'number' ? card.lng : 0,
      city,
      bio: card.subtitle,
      isPRO: true,
      isAvailableNow: typeof payload.contact_available === 'boolean' ? payload.contact_available : undefined,
      isRF: card.is_rf,
      isVerified: card.is_verified,
      rating: card.rating,
      sourceDomain: card.source?.domain,
      deeplink: pickCardDeeplink(card),
      explainReasons: card.explain?.reasons ?? [],
    };
    return object;
  }

  if (card.type === 'quest') {
    const payload = card.payload ?? {};
    const rewardPoints = typeof payload.reward_points === 'number' ? payload.reward_points : undefined;

    const object: QuestObject = {
      id: card.id,
      type: 'quest',
      title: card.title,
      description: card.description,
      cover: card.image_url,
      lat: typeof card.lat === 'number' ? card.lat : 0,
      lng: typeof card.lng === 'number' ? card.lng : 0,
      city,
      level: 'beginner',
      duration: 45,
      checkpointsCount: 1,
      hasRewards: rewardPoints !== undefined,
      rewards: rewardPoints !== undefined ? `${rewardPoints} Points` : undefined,
      isRF: card.is_rf,
      isVerified: card.is_verified,
      rating: card.rating,
      sourceDomain: card.source?.domain,
      deeplink: pickCardDeeplink(card),
      explainReasons: card.explain?.reasons ?? [],
    };
    return object;
  }

  return null;
}

function mapCardsToGuruObjects(cards: GuruEntityCard[]): GuruObject[] {
  return cards
    .map((card) => mapCardToGuruObject(card))
    .filter((item): item is GuruObject => item !== null);
}

function mapFrontendTypesToApiTypes(types: GuruFiltersType['types']): Array<'place' | 'event' | 'listing' | 'pro' | 'quest'> {
  const mapped = types
    .map((type) => {
      if (type === 'housing') return 'listing';
      if (type === 'person') return 'pro';
      return type;
    })
    .filter((type): type is 'place' | 'event' | 'listing' | 'pro' | 'quest' =>
      type === 'place' || type === 'event' || type === 'listing' || type === 'pro' || type === 'quest'
    );

  return Array.from(new Set(mapped));
}

export const GuruClient: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { position: userPosition, loading: locationLoading, error: locationError, requestLocation } = useGeolocation();

  const [filters, setFilters] = useState<GuruFiltersType>(() => {
    const urlFilters = queryStringToFilters(searchParams.toString());
    return { ...DEFAULT_FILTERS, ...urlFilters };
  });
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<ViewMode>('split');
  const [mapExpanded, setMapExpanded] = useState(false);
  const [discoveryMode, setDiscoveryMode] = useState<DiscoveryMode>(() =>
    searchParams.get('discovery') === 'what-to-do' ? 'what-to-do' : 'nearby'
  );

  const [sourceObjects, setSourceObjects] = useState<GuruObject[]>([]);
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [responseMeta, setResponseMeta] = useState<GuruResponseMeta | null>(null);
  const [partialFailures, setPartialFailures] = useState<GuruPartialFailure[]>([]);

  const urlLat = Number(searchParams.get('lat'));
  const urlLng = Number(searchParams.get('lng'));
  const hasUrlCenter = Number.isFinite(urlLat) && Number.isFinite(urlLng);

  const mapCenter: Coordinates = useMemo(() => {
    if (!userPosition && hasUrlCenter) {
      return { lat: urlLat, lng: urlLng };
    }
    return userPosition || DEFAULT_CENTER;
  }, [hasUrlCenter, urlLat, urlLng, userPosition]);

  useEffect(() => {
    let cancelled = false;

    async function loadDiscovery(): Promise<void> {
      setApiLoading(true);
      setApiError(null);

      try {
        const response =
          discoveryMode === 'nearby'
            ? await guru.fetchGuruNearby({
                mode: userPosition ? 'real' : 'virtual',
                lat: mapCenter.lat,
                lng: mapCenter.lng,
                radius_m: filters.radius,
                limit: 60,
                types: mapFrontendTypesToApiTypes(filters.types),
                open_now: filters.time === 'now' ? true : undefined,
              })
            : await guru.fetchGuruWhatToDo({
                mode: userPosition ? 'real' : 'virtual',
                lat: mapCenter.lat,
                lng: mapCenter.lng,
                radius_m: filters.radius,
                limit: 40,
                open_now: filters.time === 'now' ? true : undefined,
              });

        if (cancelled) return;

        const mapped = mapCardsToGuruObjects(response.data ?? []);
        setSourceObjects(mapped);
        setResponseMeta(response.meta);
        setPartialFailures(response.partial_failures ?? []);
      } catch (error) {
        if (cancelled) return;
        const payload = error as { error?: { code?: string; message?: string }; status?: number };
        const message = payload?.error?.message ?? `Guru API request failed (${payload?.status ?? 'unknown'})`;
        setSourceObjects([]);
        setResponseMeta(null);
        setPartialFailures([]);
        setApiError(message);
      } finally {
        if (!cancelled) setApiLoading(false);
      }
    }

    void loadDiscovery();

    return () => {
      cancelled = true;
    };
  }, [discoveryMode, mapCenter.lat, mapCenter.lng, filters.radius, filters.types, filters.time, userPosition]);

  const filteredObjects: GuruObjectWithDistance[] = useMemo(() => {
    const objectsWithDistance = addDistanceToObjects(sourceObjects, mapCenter);
    const inRadius = objectsWithDistance.filter((obj) => obj.distance <= filters.radius);
    const filtered = applyFilters(inRadius, filters);
    const sorted = applySorting(filtered, filters.sortMode);
    return sorted;
  }, [sourceObjects, mapCenter, filters]);

  useEffect(() => {
    const params = new URLSearchParams(filtersToQueryString(filters));
    if (discoveryMode !== 'nearby') {
      params.set('discovery', discoveryMode);
    }
    params.set('lat', mapCenter.lat.toFixed(5));
    params.set('lng', mapCenter.lng.toFixed(5));
    const nextQuery = params.toString();
    const currentQuery = searchParams.toString();

    if (nextQuery !== currentQuery) {
      router.replace(`/guru${nextQuery ? `?${nextQuery}` : ''}`, {
        scroll: false,
      });
    }
  }, [discoveryMode, filters, mapCenter.lat, mapCenter.lng, router, searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      requestLocation();
    }, 500);

    return () => clearTimeout(timer);
  }, [requestLocation]);

  const handleFilterChange = useCallback((newFilters: GuruFiltersType) => {
    setFilters(newFilters);
    setSelectedObjectId(null);
  }, []);

  const handleFilterReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSelectedObjectId(null);
  }, []);

  const handleObjectSelect = useCallback((objectId: string) => {
    setSelectedObjectId((prev) => (prev === objectId ? null : objectId));
  }, []);

  const handleCenterOnUser = useCallback(() => {
    if (!userPosition) {
      requestLocation();
    }
  }, [userPosition, requestLocation]);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            {userPosition ? (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Navigation className="w-4 h-4" />
                Местоположение определено
              </p>
            ) : locationLoading ? (
              <p className="text-sm text-slate-500">Определение местоположения...</p>
            ) : locationError ? (
              <p className="text-sm text-amber-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {locationError.message}
              </p>
            ) : (
              <p className="text-sm text-slate-500">Местоположение не определено</p>
            )}
            <h1 className="text-xl font-bold text-slate-900">Guru Asia</h1>
            <p className="text-sm text-slate-500">
              {filteredObjects.length} объектов · режим {discoveryMode === 'nearby' ? 'nearby' : 'what-to-do'}
            </p>
            {responseMeta ? (
              <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                <Layers className="w-3 h-3" />
                active: {responseMeta.sources_active.join(', ') || 'none'}; stub:{' '}
                {responseMeta.sources_stub.join(', ') || 'none'}
              </p>
            ) : null}
            {partialFailures.length > 0 ? (
              <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                Partial source failures: {partialFailures.map((failure) => failure.domain).join(', ')}
              </p>
            ) : null}
            {apiError ? (
              <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                {apiError}
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Button variant={mobileView === 'map' ? 'primary' : 'secondary'} size="sm" onClick={() => setMobileView('map')}>
              <MapIcon className="w-4 h-4" />
            </Button>
            <Button variant={mobileView === 'list' ? 'primary' : 'secondary'} size="sm" onClick={() => setMobileView('list')}>
              <List className="w-4 h-4" />
            </Button>
          </div>

          <Button variant="secondary" size="sm" onClick={handleCenterOnUser} className="hidden md:flex">
            <Locate className="w-4 h-4 mr-2" />
            Центрировать
          </Button>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Button
            variant={discoveryMode === 'nearby' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setDiscoveryMode('nearby')}
          >
            Nearby
          </Button>
          <Button
            variant={discoveryMode === 'what-to-do' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setDiscoveryMode('what-to-do')}
          >
            What to do
          </Button>
        </div>
        {discoveryMode === 'what-to-do' ? (
          <p className="text-xs text-slate-500 mt-2">
            What-to-do mode is usefulness-oriented aggregation and may include non-nearby-style sources.
          </p>
        ) : null}
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div
          className={`
            relative
            ${mobileView === 'list' ? 'hidden' : 'block'}
            ${mobileView === 'map' ? 'flex-1' : mapExpanded ? 'h-[60vh]' : 'h-[40vh]'}
            md:h-auto md:w-[45%] md:flex-shrink-0 md:block
          `}
        >
          <GuruMapView
            objects={filteredObjects}
            userPosition={userPosition}
            radius={filters.radius}
            selectedObjectId={selectedObjectId}
            onObjectSelect={handleObjectSelect}
            className="w-full h-full"
          />

          {mobileView === 'split' && (
            <button
              type="button"
              onClick={() => setMapExpanded(!mapExpanded)}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 md:hidden
                         bg-white px-4 py-1 rounded-full shadow-md border border-slate-200
                         flex items-center gap-1 text-sm text-slate-600"
            >
              {mapExpanded ? (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Свернуть карту
                </>
              ) : (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Развернуть карту
                </>
              )}
            </button>
          )}
        </div>

        <div
          className={`
            flex-1 flex flex-col overflow-hidden bg-slate-50
            ${mobileView === 'map' ? 'hidden' : 'block'}
            md:block
          `}
        >
          <div className="md:p-4 border-b border-slate-200 bg-white md:bg-transparent">
            <GuruFilters filters={filters} onFilterChange={handleFilterChange} onReset={handleFilterReset} objectCount={filteredObjects.length} />
          </div>

          <div className="flex-1 overflow-y-auto">
            <GuruListView
              objects={filteredObjects}
              selectedObjectId={selectedObjectId}
              radius={filters.radius}
              sortMode={filters.sortMode}
              onSortChange={(mode) => handleFilterChange({ ...filters, sortMode: mode })}
              onObjectSelect={handleObjectSelect}
              loading={apiLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuruClient;
