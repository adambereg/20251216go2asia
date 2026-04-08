'use client';

/**
 * Rielt.Market Asia - SearchBar
 * Поисковая строка с полями: город, даты, гости, тип аренды
 */

import { useState } from 'react';
import { Search, MapPin, Calendar, Users, ArrowRight, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import type { SearchFilters } from './types';

interface SearchBarProps {
  onSearch: (filters: Partial<SearchFilters>) => void;
  initialFilters?: SearchFilters;
}

export function SearchBar({ onSearch, initialFilters }: SearchBarProps) {
  const [countryId, setCountryId] = useState(initialFilters?.location?.country || '');
  const [cityId, setCityId] = useState(initialFilters?.location?.city || '');
  const [district, setDistrict] = useState(initialFilters?.location?.district || '');
  const [checkIn, setCheckIn] = useState(initialFilters?.checkIn || '');
  const [checkOut, setCheckOut] = useState(initialFilters?.checkOut || '');
  const [moveInMonth, setMoveInMonth] = useState(initialFilters?.moveInMonth || '');
  const [guests, setGuests] = useState(initialFilters?.guests || 1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [bedroomsMin, setBedroomsMin] = useState(initialFilters?.bedroomsMin || 1);
  const [bedroomsMax, setBedroomsMax] = useState(initialFilters?.bedroomsMax || 4);
  const [minPrice, setMinPrice] = useState(initialFilters?.priceRange?.min || '');
  const [maxPrice, setMaxPrice] = useState(initialFilters?.priceRange?.max || '');
  const [furnished, setFurnished] = useState(Boolean(initialFilters?.furnished));
  const [serviced, setServiced] = useState(Boolean(initialFilters?.serviced));
  const [familyFriendly, setFamilyFriendly] = useState(Boolean(initialFilters?.familyFriendly));
  const [nomadFriendly, setNomadFriendly] = useState(Boolean(initialFilters?.nomadFriendly));
  const [nearSea, setNearSea] = useState(Boolean(initialFilters?.nearSea));
  const [nearCenter, setNearCenter] = useState(Boolean(initialFilters?.nearCenter));
  const [quietArea, setQuietArea] = useState(Boolean(initialFilters?.quietArea));
  const [expatArea, setExpatArea] = useState(Boolean(initialFilters?.expatArea));
  const [onlyRF, setOnlyRF] = useState(Boolean(initialFilters?.onlyRF));
  const [onlyPROVerified, setOnlyPROVerified] = useState(Boolean(initialFilters?.onlyPROVerified));
  const [concierge, setConcierge] = useState(Boolean(initialFilters?.concierge));
  const [readyToMove, setReadyToMove] = useState(Boolean(initialFilters?.readyToMove));
  const [rentalType, setRentalType] = useState<'short-term' | 'long-term'>(
    (initialFilters?.rentalType as 'short-term' | 'long-term') || 'short-term'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      location: {
        country: countryId || undefined,
        city: cityId,
        district: district || undefined,
      },
      checkIn: rentalType === 'short-term' ? checkIn : undefined,
      checkOut: rentalType === 'short-term' ? checkOut : undefined,
      moveInMonth: rentalType === 'long-term' ? moveInMonth : undefined,
      guests,
      rentalType,
      bedroomsMin,
      bedroomsMax,
      priceRange: {
        min: minPrice !== '' ? Number(minPrice) : undefined,
        max: maxPrice !== '' ? Number(maxPrice) : undefined,
      },
      furnished,
      serviced,
      familyFriendly,
      nomadFriendly,
      nearSea,
      nearCenter,
      quietArea,
      expatArea,
      onlyRF,
      onlyPROVerified,
      concierge,
      readyToMove,
    });
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 p-4 md:p-6 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Переключатель типа аренды */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setRentalType('short-term')}
            className={`flex-1 px-4 py-2 rounded-xl font-medium transition-colors ${
              rentalType === 'short-term'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Краткосрочно
          </button>
          <button
            type="button"
            onClick={() => setRentalType('long-term')}
            className={`flex-1 px-4 py-2 rounded-xl font-medium transition-colors ${
              rentalType === 'long-term'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Долгосрочно
          </button>
        </div>

        {/* Поля поиска */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Страна */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Страна (country_id)"
              value={countryId}
              onChange={(e) => setCountryId(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Город */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Город (city_id)"
              value={cityId}
              onChange={(e) => setCityId(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Даты (только для краткосрока) */}
          {rentalType === 'short-term' && (
            <>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="date"
                  placeholder="Заезд"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="date"
                  placeholder="Выезд"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </>
          )}

          {rentalType === 'long-term' ? (
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="month"
                value={moveInMonth}
                onChange={(e) => setMoveInMonth(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none"
              />
            </div>
          ) : null}

          {/* Гости */}
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="number"
              placeholder="Гости"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
              min={1}
              max={20}
              className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced((value) => !value)}
          className="w-full md:w-auto px-4 py-2 rounded-xl border-2 border-slate-200 text-slate-700 hover:border-emerald-300 inline-flex items-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Расширенные фильтры
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAdvanced ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Район / зона"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none"
              />
              <input
                type="number"
                min={0}
                placeholder="Бюджет от"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none"
              />
              <input
                type="number"
                min={0}
                placeholder="Бюджет до"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min={0}
                  max={20}
                  placeholder="Спальни от"
                  value={bedroomsMin}
                  onChange={(e) => setBedroomsMin(parseInt(e.target.value, 10) || 0)}
                  className="px-3 py-2 border border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
                <input
                  type="number"
                  min={0}
                  max={20}
                  placeholder="до"
                  value={bedroomsMax}
                  onChange={(e) => setBedroomsMax(parseInt(e.target.value, 10) || 0)}
                  className="px-3 py-2 border border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                ['furnished', 'С мебелью', furnished, setFurnished],
                ['serviced', 'Serviced', serviced, setServiced],
                ['family', 'Для семьи', familyFriendly, setFamilyFriendly],
                ['nomad', 'Для nomad/work', nomadFriendly, setNomadFriendly],
                ['nearSea', 'У моря', nearSea, setNearSea],
                ['nearCenter', 'В центре', nearCenter, setNearCenter],
                ['quietArea', 'Тихий район', quietArea, setQuietArea],
                ['expatArea', 'Expat area', expatArea, setExpatArea],
                ['onlyRF', 'Only RF verified', onlyRF, setOnlyRF],
                ['onlyPRO', 'Only PRO curated', onlyPROVerified, setOnlyPROVerified],
                ['concierge', 'Concierge / assisted', concierge, setConcierge],
                ['ready', 'Ready to move / instant inquiry', readyToMove, setReadyToMove],
              ].map(([key, label, value, setter]) => (
                <button
                  key={String(key)}
                  type="button"
                  onClick={() => (setter as (value: boolean) => void)(!Boolean(value))}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                    value
                      ? 'border-emerald-500 bg-emerald-100 text-emerald-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300'
                  }`}
                >
                  {String(label)}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Часть advanced-признаков работает как guided inquiry context и сохраняется в параметрах поиска без
              расширения backend-контракта.
            </p>
          </div>
        ) : null}

        {/* Кнопка поиска */}
        <button
          type="submit"
          className="w-full md:w-auto md:px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <Search className="w-5 h-5" />
          Найти жильё
          <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-xs text-slate-500">
          Rielt — curated discovery layer: витрина не показывает весь рынок. Финальная availability-проверка и
          подтверждение условий остаются на шаге inquiry.
        </p>
      </form>
    </div>
  );
}

