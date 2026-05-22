'use client';

/**
 * Rielt.Market Asia - QuickFilters
 * Быстрые сценарные входы + trust-фильтры
 */

import { CheckCircle, Compass, Users, Briefcase, Waves, Building2, ShieldCheck } from 'lucide-react';
import type { SearchFilters } from './types';

interface QuickFiltersProps {
  filters: SearchFilters;
  onChange: (filters: Partial<SearchFilters>) => void;
  onApplyPreset: (filters: Partial<SearchFilters>) => void;
}

const TRUST_FILTERS = [
  { key: 'onlyRF', label: 'Партнёры RF', icon: CheckCircle },
  { key: 'onlyPROVerified', label: 'Кураторский контекст', icon: CheckCircle },
  { key: 'concierge', label: 'С сопровождением', icon: ShieldCheck },
] as const;

const SCENARIO_PRESETS: Array<{
  id: string;
  label: string;
  icon: typeof Compass;
  filters: Partial<SearchFilters>;
}> = [
  { id: 'winter', label: 'Для зимовки', icon: Waves, filters: { rentalType: 'short-term', nearSea: true } },
  { id: 'relocation', label: 'Для релокации', icon: Building2, filters: { rentalType: 'long-term', readyToMove: true } },
  { id: 'family', label: 'Для семьи', icon: Users, filters: { familyFriendly: true, bedroomsMin: 2 } },
  { id: 'nomad', label: 'Для удалённой работы', icon: Briefcase, filters: { nomadFriendly: true, rentalType: 'long-term' } },
];

export function QuickFilters({ filters, onChange, onApplyPreset }: QuickFiltersProps) {
  const handleToggle = (key: keyof SearchFilters) => {
    const currentValue = filters[key];
    onChange({ [key]: !currentValue });
  };

  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Сценарии</p>
        <div className="flex flex-wrap gap-2">
          {SCENARIO_PRESETS.map((preset) => {
            const Icon = preset.icon;
            return (
              <button
                key={preset.id}
                onClick={() => onApplyPreset(preset.filters)}
                className="px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 bg-white text-slate-700 border-2 border-slate-200 hover:border-emerald-300"
              >
                <Icon className="w-4 h-4 text-slate-400" />
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Надёжность и сопровождение</p>
        <div className="flex flex-wrap gap-2">
          {TRUST_FILTERS.map((filter) => {
            const Icon = filter.icon;
            const isActive = filters[filter.key as keyof SearchFilters] === true;
            return (
              <button
                key={filter.key}
                onClick={() => handleToggle(filter.key as keyof SearchFilters)}
                className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-emerald-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>
      <p className="text-xs text-slate-500">
        Быстрые кнопки помогают сузить inquiry-критерии; они не подтверждают наличие или готовность объекта.
      </p>
    </div>
  );
}

