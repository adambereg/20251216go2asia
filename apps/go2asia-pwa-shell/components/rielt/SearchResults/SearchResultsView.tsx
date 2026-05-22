'use client';

/**
 * Rielt.Market Asia - SearchResultsView
 * Главный компонент страницы результатов поиска (split layout)
 */

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ListingsList } from './ListingsList';
import { FiltersPanel } from './FiltersPanel';
import { SortDropdown } from './SortDropdown';
import type { ListingWithDistance, SearchFilters } from '../types';

// Динамический импорт карты с отключением SSR, так как Leaflet использует window
const ListingsMap = dynamic(() => import('./ListingsMap').then((mod) => ({ default: mod.ListingsMap })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] lg:h-full rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-100 flex items-center justify-center">
      <p className="text-slate-500">Загрузка карты...</p>
    </div>
  ),
});

interface SearchResultsViewProps {
  listings: ListingWithDistance[];
  filters: Partial<SearchFilters>;
  userLocation: { lat: number; lng: number } | null;
  onSortChange: (sortBy: SearchFilters['sortBy']) => void;
  nearbyMode: boolean;
  onToggleNearbyMode: () => void;
  usingFallbackLocation?: boolean;
}

export function SearchResultsView({
  listings,
  filters,
  userLocation,
  onSortChange,
  nearbyMode,
  onToggleNearbyMode,
  usingFallbackLocation = false,
}: SearchResultsViewProps) {
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const hasSeedOverlay = listings.some((listing) => listing.presentation?.source === 'seed');
  const hasGuidedContext =
    Boolean(filters.furnished) ||
    Boolean(filters.serviced) ||
    Boolean(filters.familyFriendly) ||
    Boolean(filters.nomadFriendly) ||
    Boolean(filters.nearSea) ||
    Boolean(filters.nearCenter) ||
    Boolean(filters.quietArea) ||
    Boolean(filters.expatArea) ||
    Boolean(filters.concierge) ||
    Boolean(filters.readyToMove);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Заголовок и сортировка */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            {listings.length} {listings.length === 1 ? 'listing preview' : 'listing previews'}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Rielt показывает source-labeled previews для inquiry; это не live booking inventory.
          </p>
          {filters.location?.city && (
            <p className="text-slate-600 mt-1">Город: {filters.location.city}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleNearbyMode}
            className={`px-3 py-2 rounded-lg text-sm font-medium border ${
              nearbyMode
                ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                : 'border-slate-200 bg-white text-slate-700'
            }`}
          >
            {nearbyMode ? 'Рядом: вкл. (10 км)' : 'Рядом: выкл.'}
          </button>
          <SortDropdown
            value={filters.sortBy || 'recommended'}
            onChange={(sortBy) => onSortChange(sortBy)}
          />
        </div>
      </div>

      {nearbyMode && usingFallbackLocation ? (
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
          Не удалось определить вашу геолокацию. Показаны объекты рядом с условной точкой (Бангкок).
        </div>
      ) : null}
      {nearbyMode ? (
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
          Расстояние рассчитывается до публичной точки, показанной на карте.
        </div>
      ) : null}

      {hasSeedOverlay ? (
        <div className="mb-4 rounded-lg border border-blue-300 bg-blue-50 p-3 text-sm text-blue-800">
          Для части карточек используются seed preview материалы витрины. Это demo/source overlay, не verified
          inventory и не подтверждение доступности.
        </div>
      ) : null}
      {hasGuidedContext ? (
        <div className="mb-4 rounded-lg border border-slate-300 bg-slate-50 p-3 text-sm text-slate-700">
          Некоторые выбранные параметры помогают сформировать inquiry и не подтверждают наличие объекта.
        </div>
      ) : null}

      {/* Фильтры (sticky сверху) */}
      <div className="sticky top-16 z-10 bg-white border-b border-slate-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 mb-6">
        <FiltersPanel filters={filters} />
      </div>

      {/* Split layout: List + Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Список объявлений */}
        <div className="lg:col-span-1">
          <ListingsList
            listings={listings}
            selectedId={selectedListingId}
            onSelect={setSelectedListingId}
          />
        </div>

        {/* Карта */}
        <div className="lg:col-span-1 lg:sticky lg:top-32 lg:h-[calc(100vh-8rem)]">
          <ListingsMap
            listings={listings}
            userLocation={userLocation}
            selectedId={selectedListingId}
            onSelect={setSelectedListingId}
          />
        </div>
      </div>
    </div>
  );
}

