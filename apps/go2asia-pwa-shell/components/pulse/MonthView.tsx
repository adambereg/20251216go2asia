'use client';

import React, { useState, useMemo } from 'react';
import { Clock, MapPin, Calendar } from 'lucide-react';
import { Event, EventFilters, CalendarDay } from './types';
import { Card, CardContent, Badge } from '@go2asia/ui';
import { getCategoryLabel, getEventCategoryColor } from './category';

export interface MonthViewProps {
  date: Date;
  events: Event[];
  filters?: EventFilters;
  onEventClick?: (event: Event) => void;
  onDateClick?: (date: Date) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
  date,
  events,
  filters: _filters,
  onEventClick,
  onDateClick,
}) => {
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const getEventColor = (category?: string) => getEventCategoryColor(category);

  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const calendarDays = useMemo(() => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Первый день месяца
    const firstDay = new Date(year, month, 1);
    
    // Первый день недели (понедельник = 1)
    const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    
    // Начало календаря (может быть предыдущий месяц)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDayOfWeek);
    
    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 42 дня (6 недель)
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const dayEvents = events.filter((event) => {
        const eventDate = new Date(event.startDate);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate.getTime() === currentDate.getTime();
      });
      
      days.push({
        date: currentDate,
        isToday: currentDate.getTime() === today.getTime(),
        isCurrentMonth: currentDate.getMonth() === month,
        events: dayEvents,
      });
    }
    
    return days;
  }, [date, events]);

  // Получаем события для отображения (либо выбранного дня, либо всего месяца)
  const displayEvents = useMemo(() => {
    if (selectedDay) {
      // Показываем события только выбранного дня
      const selectedDayStart = new Date(selectedDay);
      selectedDayStart.setHours(0, 0, 0, 0);
      const selectedDayEnd = new Date(selectedDay);
      selectedDayEnd.setHours(23, 59, 59, 999);

      return events
        .filter((event) => {
          const eventDate = new Date(event.startDate);
          return eventDate >= selectedDayStart && eventDate <= selectedDayEnd;
        })
        .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    } else {
      // Показываем все события месяца
      const year = date.getFullYear();
      const month = date.getMonth();
      const monthStart = new Date(year, month, 1);
      monthStart.setHours(0, 0, 0, 0);
      const monthEnd = new Date(year, month + 1, 0);
      monthEnd.setHours(23, 59, 59, 999);

      return events
        .filter((event) => {
          const eventDate = new Date(event.startDate);
          return eventDate >= monthStart && eventDate <= monthEnd;
        })
        .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    }
  }, [date, events, selectedDay]);

  const handleDayClick = (day: CalendarDay) => {
    if (day.events.length === 0) {
      // Если событий нет, сбрасываем выбор
      setSelectedDay(null);
      return;
    }

    // Переключение выбранного дня
    if (selectedDay && selectedDay.getTime() === day.date.getTime()) {
      // Если кликнули по уже выбранному дню, сбрасываем выбор
      setSelectedDay(null);
    } else {
      // Выбираем новый день
      setSelectedDay(day.date);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Календарная сетка */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header with days of week */}
        <div className="grid grid-cols-7 gap-px bg-slate-200 border-b-2 border-slate-200">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="bg-slate-50 py-2 text-center text-sm font-medium text-slate-600"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-px bg-slate-200">
          {calendarDays.map((day, index) => {
            const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6;
            
            const isSelected = selectedDay && selectedDay.getTime() === day.date.getTime();
            
            return (
              <div
                key={index}
                onClick={() => handleDayClick(day)}
                className={`
                  bg-white min-h-[100px] p-2 cursor-pointer
                  hover:bg-slate-50 transition-colors
                  ${!day.isCurrentMonth ? 'opacity-40' : ''}
                  ${day.isToday ? 'ring-2 ring-sky-600 ring-inset' : ''}
                  ${isSelected ? 'ring-2 ring-sky-400 bg-sky-50' : ''}
                  ${isWeekend ? 'bg-slate-50' : ''}
                `}
              >
                {/* Day number */}
                <div
                  className={`
                    text-sm font-medium mb-1
                    ${day.isToday ? 'text-sky-600 font-bold' : 'text-slate-900'}
                    ${!day.isCurrentMonth ? 'text-slate-400' : ''}
                  `}
                >
                  {day.date.getDate()}
                </div>

                {/* Events indicators - точки по категориям */}
                <div className="flex items-center justify-center gap-1 flex-wrap">
                  {day.events.slice(0, 5).map((event) => {
                    const color = getEventColor(event.category);
                    return (
                      <div
                        key={event.id}
                        className={`w-2 h-2 rounded-full ${color.dot}`}
                        title={`${event.title}${event.category ? ` (${getCategoryLabel(event.category)})` : ''}`}
                      />
                    );
                  })}
                  {day.events.length > 5 && (
                    <div className="text-xs text-slate-500 font-medium">
                      +{day.events.length - 5}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Список событий (выбранного дня или всего месяца) */}
      {displayEvents.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            {selectedDay ? 'Нет событий на этот день' : 'Нет событий в этом месяце'}
          </h3>
          <p className="text-sm text-slate-600">
            {selectedDay ? 'Выберите другой день или посмотрите все события месяца' : 'События появятся здесь, когда они будут добавлены'}
          </p>
          {selectedDay && (
            <button
              onClick={() => setSelectedDay(null)}
              className="mt-4 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors"
            >
              Показать все события месяца
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Заголовок списка */}
          {selectedDay && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">
                  События: {selectedDay.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                </h3>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="px-3 py-1 text-sm text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                >
                  Показать все события месяца
                </button>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            {displayEvents.map((event) => {
            const color = getEventColor(event.category);
            const eventDate = new Date(event.startDate);
            const isMultiDay = eventDate.toDateString() !== new Date(event.endDate).toDateString();
            
            return (
              <Card
                key={event.id}
                hover
                onClick={() => onEventClick?.(event)}
                className={`cursor-pointer border-2 ${color.card} ${color.border} transition-all hover:shadow-md`}
              >
                <CardContent className="p-6">
                  {/* Дата */}
                  <div className="mb-3">
                    <div className="text-sm font-bold text-slate-700 uppercase">
                      {isMultiDay
                        ? `${eventDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })} - ${new Date(event.endDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}`
                        : eventDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }).toUpperCase()}
                    </div>
                  </div>

                  {/* Бейджи */}
                  {event.badges && event.badges.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {event.badges.map((badge) => (
                        <Badge
                          key={badge}
                          variant={
                            badge === 'verified'
                              ? 'verified'
                              : badge === 'russian-friendly'
                              ? 'russian-friendly'
                              : badge === 'free'
                              ? 'info'
                              : 'info'
                          }
                        >
                          {badge === 'verified' && '✓ Проверено'}
                          {badge === 'russian-friendly' && '🇷🇺 RF'}
                          {badge === 'free' && 'Бесплатно'}
                          {badge === 'repeating' && 'Повторяется'}
                          {badge === 'virtual-event' && 'Онлайн'}
                          {badge === 'event-started' && 'Началось'}
                          {badge === 'event-over' && 'Завершено'}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Заголовок */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {event.title}
                  </h3>

                  {/* Описание */}
                  {event.description && (
                    <p className="text-slate-700 mb-4 line-clamp-2">
                      {event.description}
                    </p>
                  )}

                  {/* Время */}
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      {formatTime(event.startDate)}
                      {event.endDate && ` - ${formatTime(event.endDate)}`}
                      {event.timezone && ` (${event.timezone})`}
                    </span>
                  </div>

                  {/* Местоположение */}
                  {event.location && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">
                        {event.location.name || event.location.address}
                        {event.location.city && `, ${event.location.city}`}
                      </span>
                    </div>
                  )}

                  {/* Дополнительная информация */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 pt-3 border-t border-slate-200">
                    {event.organizer && (
                      <div>
                        Организатор: <span className="font-medium">{event.organizer.name}</span>
                      </div>
                    )}
                    {event.attendeesCount !== undefined && (
                      <div>
                        Участников: <span className="font-medium">{event.attendeesCount}</span>
                        {event.maxAttendees && ` / ${event.maxAttendees}`}
                      </div>
                    )}
                    {event.price && (
                      <div>
                        {event.price.type === 'free' ? (
                          <span className="font-medium text-green-600">Бесплатно</span>
                        ) : (
                          <span className="font-medium">
                            {event.price.amount} {event.price.currency || 'THB'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        </>
      )}
    </div>
  );
};
