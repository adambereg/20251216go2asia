'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Chip } from '@go2asia/ui';
import { CalendarViewMode, Event, EventFilters } from './types';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { AgendaView } from './AgendaView';
import { EventFilters as EventFiltersComponent } from './EventFilters';
import { filterEvents } from './filterEvents';

export interface CalendarViewProps {
  events: Event[];
  initialView?: CalendarViewMode;
  initialDate?: Date;
  filters?: EventFilters;
  onFiltersChange?: (filters: EventFilters) => void;
  onEventClick?: (event: Event) => void;
  onDateChange?: (date: Date) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  initialView = 'week',
  initialDate = new Date(),
  filters,
  onFiltersChange,
  onEventClick,
  onDateChange,
}) => {
  const [viewMode, setViewMode] = useState<CalendarViewMode>(initialView);
  const [currentDate, setCurrentDate] = useState(initialDate);

  // Синхронизируем viewMode с initialView при изменении пропа
  useEffect(() => {
    if (initialView) {
      setViewMode(initialView);
    }
  }, [initialView]);

  // Дефолтные no-op обработчики для безопасной передачи в дочерние компоненты
  const handleEventClick = onEventClick ?? (() => {});
  const handleDateChange = onDateChange ?? (() => {});

  // Фильтруем события по заданным фильтрам
  const filteredEvents = filters ? filterEvents(events, filters) : events;

  const viewModes: { mode: CalendarViewMode; label: string }[] = [
    { mode: 'week', label: 'Неделя' },
    { mode: 'month', label: 'Месяц' },
    { mode: 'agenda', label: 'Список' },
  ];

  const handleDateNavigation = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    switch (viewMode) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'agenda':
        // Для agenda навигация не нужна
        return;
    }
    
    setCurrentDate(newDate);
    handleDateChange(newDate);
  };

  const handleTodayClick = () => {
    const today = new Date();
    setCurrentDate(today);
    handleDateChange(today);
  };

  const renderView = () => {
    switch (viewMode) {
      case 'month':
        return (
          <MonthView
            date={currentDate}
            events={filteredEvents}
            filters={filters}
            onEventClick={handleEventClick}
            onDateClick={(date) => {
              setCurrentDate(date);
              setViewMode('week');
              handleDateChange(date);
            }}
          />
        );
      case 'week':
        return (
          <WeekView
            date={currentDate}
            events={filteredEvents}
            filters={filters}
            onEventClick={handleEventClick}
            onDateClick={(date) => {
              setCurrentDate(date);
              handleDateChange(date);
            }}
          />
        );
      case 'agenda':
        return (
          <AgendaView
            events={filteredEvents}
            filters={filters}
            onEventClick={handleEventClick}
          />
        );
    }
  };

  return (
    <div className="w-full">
      {/* Header with navigation and view switcher */}
      <div className="bg-white border-b border-slate-200 sticky top-0 lg:top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Date navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDateNavigation('prev')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Предыдущий период"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              
              <button
                onClick={handleTodayClick}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Сегодня
              </button>
              
              <div className="text-h3 md:text-2xl font-bold text-slate-900 min-w-[200px] text-center">
                {viewMode === 'month' && 
                  currentDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
                }
                {viewMode === 'week' && 
                  (() => {
                    const weekStart = new Date(currentDate);
                    weekStart.setDate(currentDate.getDate() - currentDate.getDay());
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekStart.getDate() + 6);
                    return `${weekStart.getDate()} - ${weekEnd.getDate()} ${currentDate.toLocaleDateString('ru-RU', { month: 'long' })}`;
                  })()
                }
                {viewMode === 'agenda' && 'Ближайшие события'}
              </div>
              
              <button
                onClick={() => handleDateNavigation('next')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Следующий период"
              >
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* View mode switcher */}
            <div className="flex items-center gap-2">
              {viewModes.map(({ mode, label }) => (
                <Chip
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={
                    viewMode === mode
                      ? 'cursor-pointer bg-sky-100 text-slate-900 ring-1 ring-sky-200 hover:bg-sky-200'
                      : 'cursor-pointer bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }
                >
                  {label}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <EventFiltersComponent
        filters={filters || {}}
        onFiltersChange={onFiltersChange || (() => {})}
      />

      {/* Calendar view */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderView()}
      </div>
    </div>
  );
};

