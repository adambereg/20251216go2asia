'use client';

/**
 * Rielt.Market Asia - Home Client Component
 * Главная страница с поиском и секциями контента
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchBar } from '@/components/rielt/SearchBar';
import { QuickFilters } from '@/components/rielt/QuickFilters';
import { EditorPicks } from '@/components/rielt/EditorPicks';
import { NewListings } from '@/components/rielt/NewListings';
import { SlidersHorizontal, MapPinned, ListFilter } from 'lucide-react';
import type { SearchFilters } from '@/components/rielt/types';

export function RieltHomeClient() {
  const router = useRouter();
  const [filters, setFilters] = useState<SearchFilters>({
    rentalType: 'short-term',
  });

  const buildSearchParams = (updatedFilters: SearchFilters) => {
    const params = new URLSearchParams();
    if (updatedFilters.location?.country) {
      params.set('country_id', updatedFilters.location.country);
    }
    if (updatedFilters.location?.city) {
      params.set('city_id', updatedFilters.location.city);
    }
    if (updatedFilters.location?.district) {
      params.set('district', updatedFilters.location.district);
    }
    if (updatedFilters.checkIn) {
      params.set('checkIn', updatedFilters.checkIn);
    }
    if (updatedFilters.checkOut) {
      params.set('checkOut', updatedFilters.checkOut);
    }
    if (updatedFilters.moveInMonth) {
      params.set('moveInMonth', updatedFilters.moveInMonth);
    }
    if (updatedFilters.guests) {
      params.set('guests', updatedFilters.guests.toString());
    }
    if (updatedFilters.rentalType) {
      params.set('rentalType', updatedFilters.rentalType);
    }
    if (updatedFilters.priceRange?.min != null) {
      params.set('minPrice', String(updatedFilters.priceRange.min));
    }
    if (updatedFilters.priceRange?.max != null) {
      params.set('maxPrice', String(updatedFilters.priceRange.max));
    }
    if (updatedFilters.bedroomsMin != null) {
      params.set('bedroomsMin', String(updatedFilters.bedroomsMin));
    }
    if (updatedFilters.bedroomsMax != null) {
      params.set('bedroomsMax', String(updatedFilters.bedroomsMax));
    }
    if (updatedFilters.onlyRF) params.set('onlyRF', '1');
    if (updatedFilters.onlyPROVerified) params.set('onlyPROVerified', '1');
    if (updatedFilters.concierge) params.set('concierge', '1');
    if (updatedFilters.furnished) params.set('furnished', '1');
    if (updatedFilters.serviced) params.set('serviced', '1');
    if (updatedFilters.familyFriendly) params.set('familyFriendly', '1');
    if (updatedFilters.nomadFriendly) params.set('nomadFriendly', '1');
    if (updatedFilters.nearSea) params.set('nearSea', '1');
    if (updatedFilters.nearCenter) params.set('nearCenter', '1');
    if (updatedFilters.quietArea) params.set('quietArea', '1');
    if (updatedFilters.expatArea) params.set('expatArea', '1');
    if (updatedFilters.readyToMove) params.set('readyToMove', '1');
    return params;
  };

  const handleSearch = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters } as SearchFilters;
    setFilters(updatedFilters);
    const params = buildSearchParams(updatedFilters);
    router.push(`/rielt/search?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
        Rielt Market — curated housing discovery layer: объекты идут через RF-партнёров и PRO-кураторов, а не как
        открытая доска объявлений.
      </section>

      <section className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">Command center поиска</h2>
        <p className="text-sm text-slate-600 mb-4">
          Сначала выберите срок, географию и базовые параметры. Затем при необходимости раскройте advanced-фильтры.
        </p>
        <SearchBar onSearch={handleSearch} initialFilters={filters} />
      </section>

      <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
        <QuickFilters
          filters={filters}
          onChange={(newFilters) => handleSearch(newFilters)}
          onApplyPreset={(presetFilters) => handleSearch(presetFilters)}
        />
      </section>

      <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Переход к режиму каталога</h3>
        <p className="text-sm text-slate-600 mb-3">
          После поиска страница результатов показывает count, активные фильтры, сортировку, list/map и nearby mode.
        </p>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 bg-slate-50 text-slate-700">
            <ListFilter className="w-4 h-4 text-slate-400" />
            Active filters
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 bg-slate-50 text-slate-700">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            Sorting
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 bg-slate-50 text-slate-700">
            <MapPinned className="w-4 h-4 text-slate-400" />
            List / Map / Nearby
          </span>
        </div>
      </section>

      <section className="mb-12">
        <EditorPicks />
      </section>

      <section className="mb-12">
        <NewListings />
      </section>
    </div>
  );
}

