'use client';

/**
 * Rielt.Market Asia - FiltersPanel
 * Панель фильтров (sticky сверху)
 */

import { X } from 'lucide-react';
import type { SearchFilters } from '../types';

interface FiltersPanelProps {
  filters: Partial<SearchFilters>;
}

export function FiltersPanel({ filters }: FiltersPanelProps) {
  const activeFilters: Array<{ key: keyof SearchFilters; label: string }> = [];

  if (filters.location?.city) {
    activeFilters.push({ key: 'location', label: `Город: ${filters.location.city}` });
  }
  if (filters.rentalType) {
    activeFilters.push({
      key: 'rentalType',
      label: filters.rentalType === 'short-term' ? 'Краткосрочно' : 'Долгосрочно',
    });
  }
  if (filters.onlyRF) activeFilters.push({ key: 'onlyRF', label: 'Только RF' });
  if (filters.onlyPROVerified) activeFilters.push({ key: 'onlyPROVerified', label: 'Проверено PRO' });

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {activeFilters.map((filter, index) => (
        <span
          key={index}
          className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg font-medium flex items-center gap-2"
        >
          {filter.label}
          <X className="w-3 h-3 opacity-50" />
        </span>
      ))}
    </div>
  );
}



















