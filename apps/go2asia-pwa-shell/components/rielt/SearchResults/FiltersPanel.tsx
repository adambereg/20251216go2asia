'use client';

/**
 * Rielt.Market Asia - FiltersPanel
 * Панель фильтров (sticky сверху)
 */

import type { SearchFilters } from '../types';

interface FiltersPanelProps {
  filters: Partial<SearchFilters>;
}

export function FiltersPanel({ filters }: FiltersPanelProps) {
  const activeFilters: Array<{ key: keyof SearchFilters; label: string }> = [];

  if (filters.location?.city) {
    activeFilters.push({ key: 'location', label: `Город: ${filters.location.city}` });
  }
  if (filters.location?.country) {
    activeFilters.push({ key: 'location', label: `Страна: ${filters.location.country}` });
  }
  if (filters.location?.district) {
    activeFilters.push({ key: 'location', label: `Район: ${filters.location.district}` });
  }
  if (filters.rentalType) {
    activeFilters.push({
      key: 'rentalType',
      label: filters.rentalType === 'short-term' ? 'Краткосрочно' : 'Долгосрочно',
    });
  }
  if (filters.checkIn) activeFilters.push({ key: 'checkIn', label: `Дата с: ${filters.checkIn}` });
  if (filters.checkOut) activeFilters.push({ key: 'checkOut', label: `Дата по: ${filters.checkOut}` });
  if (filters.guests != null) activeFilters.push({ key: 'guests', label: `Гостей: ${filters.guests}` });
  if (filters.moveInMonth) activeFilters.push({ key: 'moveInMonth', label: `Переезд: ${filters.moveInMonth}` });
  if (filters.priceRange?.min != null) activeFilters.push({ key: 'priceRange', label: `Бюджет от: ${filters.priceRange.min}` });
  if (filters.priceRange?.max != null) activeFilters.push({ key: 'priceRange', label: `Бюджет до: ${filters.priceRange.max}` });
  if (filters.bedroomsMin != null) activeFilters.push({ key: 'bedroomsMin', label: `Спальни от: ${filters.bedroomsMin}` });
  if (filters.bedroomsMax != null) activeFilters.push({ key: 'bedroomsMax', label: `Спальни до: ${filters.bedroomsMax}` });
  if (filters.onlyRF) activeFilters.push({ key: 'onlyRF', label: 'Партнёры RF' });
  if (filters.onlyPROVerified) activeFilters.push({ key: 'onlyPROVerified', label: 'Кураторский контекст' });
  if (filters.concierge) activeFilters.push({ key: 'concierge', label: 'С сопровождением' });
  if (filters.furnished) activeFilters.push({ key: 'furnished', label: 'С мебелью' });
  if (filters.serviced) activeFilters.push({ key: 'serviced', label: 'С обслуживанием' });
  if (filters.familyFriendly) activeFilters.push({ key: 'familyFriendly', label: 'Для семьи' });
  if (filters.nomadFriendly) activeFilters.push({ key: 'nomadFriendly', label: 'Для удалённой работы' });
  if (filters.nearSea) activeFilters.push({ key: 'nearSea', label: 'У моря' });
  if (filters.nearCenter) activeFilters.push({ key: 'nearCenter', label: 'В центре' });
  if (filters.quietArea) activeFilters.push({ key: 'quietArea', label: 'Тихий район' });
  if (filters.expatArea) activeFilters.push({ key: 'expatArea', label: 'Район с экспатами' });
  if (filters.readyToMove) activeFilters.push({ key: 'readyToMove', label: 'Заезд можно уточнить' });

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
        </span>
      ))}
    </div>
  );
}



















