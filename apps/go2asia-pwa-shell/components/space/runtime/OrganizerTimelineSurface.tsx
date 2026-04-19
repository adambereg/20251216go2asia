'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { OrganizerTripSummary } from './organizerApi';
import {
  deriveExecutionFromSummary,
  deriveTripLifecycleState,
  formatTripStatusLabel,
  type OrganizerExecutionTone,
} from './organizerExecution';
import { formatTripWindowLabel, type OrganizerTimelineScale } from './organizerPortfolio';

const DAY_MS = 24 * 60 * 60 * 1000;
const MONTH_WIDTH = 148;
const DAY_WIDTH = 34;
const LANE_HEIGHT = 62;
const LANE_GAP = 10;

type TimelineScaleOption = {
  id: OrganizerTimelineScale;
  label: string;
};

type TimelineTripRecord = {
  trip: OrganizerTripSummary;
  start: Date;
  end: Date;
};

type TimelinePlacedTrip = TimelineTripRecord & {
  lane: number;
  left: number;
  width: number;
};

type TimelineHeaderGroup = {
  key: string;
  label: string;
  width: number;
};

type TimelineHeaderTick = {
  key: string;
  label: string;
  caption: string;
  width: number;
  isToday: boolean;
};

type TimelineLayout = {
  totalWidth: number;
  totalDays: number;
  laneCount: number;
  headerGroups: TimelineHeaderGroup[];
  ticks: TimelineHeaderTick[];
  placed: TimelinePlacedTrip[];
  todayLeft: number | null;
  empty: boolean;
};

type OrganizerTimelineSurfaceProps = {
  trips: OrganizerTripSummary[];
  scale: OrganizerTimelineScale;
  onScaleChange: (scale: OrganizerTimelineScale) => void;
  scaleOptions: TimelineScaleOption[];
};

function toneClasses(tone: OrganizerExecutionTone): string {
  if (tone === 'amber') return 'border-amber-200 bg-amber-50 text-amber-900';
  if (tone === 'sky') return 'border-sky-200 bg-sky-50 text-sky-900';
  if (tone === 'emerald') return 'border-emerald-200 bg-emerald-50 text-emerald-900';
  return 'border-slate-200 bg-slate-50 text-slate-800';
}

function toneBarClasses(tone: OrganizerExecutionTone): string {
  if (tone === 'amber') return 'border-amber-200 bg-gradient-to-r from-amber-100 to-amber-50';
  if (tone === 'sky') return 'border-sky-200 bg-gradient-to-r from-sky-100 to-sky-50';
  if (tone === 'emerald') return 'border-emerald-200 bg-gradient-to-r from-emerald-100 to-emerald-50';
  return 'border-slate-200 bg-gradient-to-r from-slate-100 to-slate-50';
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseTripDate(value: string | null): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return startOfDay(parsed);
}

function addCalendarDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function diffCalendarDays(from: Date, to: Date): number {
  return Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / DAY_MS);
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function startOfWeek(date: Date): Date {
  const normalized = startOfDay(date);
  const weekDay = (normalized.getDay() + 6) % 7;
  return addCalendarDays(normalized, -weekDay);
}

function endOfWeek(date: Date): Date {
  return addCalendarDays(startOfWeek(date), 6);
}

function formatMonthLabel(date: Date): string {
  return date
    .toLocaleDateString('ru-RU', { month: 'short', year: '2-digit' })
    .replace('.', '')
    .replace(/^./, (value) => value.toUpperCase());
}

function formatWeekdayLabel(date: Date): string {
  return date
    .toLocaleDateString('ru-RU', { weekday: 'short' })
    .replace('.', '')
    .replace(/^./, (value) => value.toUpperCase());
}

function formatShortDateLabel(date: Date): string {
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

function normalizeTripRecords(trips: OrganizerTripSummary[]): {
  scheduled: TimelineTripRecord[];
  undated: OrganizerTripSummary[];
  overlapCount: number;
  windowCount: number;
} {
  const scheduled = trips
    .map((trip) => {
      const start = parseTripDate(trip.startDate);
      const end = parseTripDate(trip.endDate);
      if (!start && !end) return null;
      const normalizedStart = start ?? end ?? startOfDay(new Date());
      const normalizedEnd = end ?? start ?? normalizedStart;
      return {
        trip,
        start: normalizedStart,
        end: normalizedEnd >= normalizedStart ? normalizedEnd : normalizedStart,
      };
    })
    .filter((item): item is TimelineTripRecord => item !== null)
    .sort((left, right) => left.start.getTime() - right.start.getTime());

  let overlapCount = 0;
  let windowCount = 0;
  for (let index = 1; index < scheduled.length; index += 1) {
    const previous = scheduled[index - 1];
    const current = scheduled[index];
    if (!previous || !current) continue;
    if (current.start <= previous.end) {
      overlapCount += 1;
    } else {
      windowCount += 1;
    }
  }

  return {
    scheduled,
    undated: trips.filter((trip) => !trip.startDate && !trip.endDate),
    overlapCount,
    windowCount,
  };
}

function assignLanes(items: TimelineTripRecord[]): Array<TimelineTripRecord & { lane: number }> {
  const laneEnds: Date[] = [];
  return items.map((item) => {
    let lane = laneEnds.findIndex((laneEnd) => laneEnd.getTime() < item.start.getTime());
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(item.end);
    } else {
      laneEnds[lane] = item.end;
    }
    return { ...item, lane };
  });
}

function buildMonthLayout(trips: TimelineTripRecord[], referenceDate: Date): TimelineLayout {
  const today = startOfDay(referenceDate);
  const minStart = trips.length > 0 ? trips.reduce((min, trip) => (trip.start < min ? trip.start : min), trips[0]!.start) : today;
  const maxEnd = trips.length > 0 ? trips.reduce((max, trip) => (trip.end > max ? trip.end : max), trips[0]!.end) : addMonths(today, 2);
  const rangeStart = startOfMonth(minStart < today ? minStart : today);
  const rangeEnd = endOfMonth(maxEnd > today ? maxEnd : addMonths(today, 2));

  const groups: TimelineHeaderGroup[] = [];
  const cursor = new Date(rangeStart);
  while (cursor <= rangeEnd) {
    groups.push({
      key: `${cursor.getFullYear()}-${cursor.getMonth()}`,
      label: formatMonthLabel(cursor),
      width: MONTH_WIDTH,
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  const totalDays = Math.max(1, diffCalendarDays(rangeStart, rangeEnd) + 1);
  const totalWidth = groups.reduce((sum, group) => sum + group.width, 0);
  const placed = assignLanes(trips).map((trip) => {
    const startOffset = diffCalendarDays(rangeStart, trip.start);
    const duration = Math.max(1, diffCalendarDays(trip.start, trip.end) + 1);
    return {
      ...trip,
      left: (startOffset / totalDays) * totalWidth,
      width: Math.max((duration / totalDays) * totalWidth, 44),
    };
  });

  const todayOffset = diffCalendarDays(rangeStart, today);
  return {
    totalWidth,
    totalDays,
    laneCount: placed.reduce((max, trip) => Math.max(max, trip.lane + 1), trips.length > 0 ? 1 : 0),
    headerGroups: groups,
    ticks: [],
    placed,
    todayLeft: todayOffset >= 0 && todayOffset <= totalDays ? (todayOffset / totalDays) * totalWidth : null,
    empty: trips.length === 0,
  };
}

function buildWeekLayout(trips: TimelineTripRecord[], referenceDate: Date): TimelineLayout {
  const today = startOfDay(referenceDate);
  const minStart = trips.length > 0 ? trips.reduce((min, trip) => (trip.start < min ? trip.start : min), trips[0]!.start) : today;
  const maxEnd = trips.length > 0 ? trips.reduce((max, trip) => (trip.end > max ? trip.end : max), trips[0]!.end) : addCalendarDays(today, 20);
  const rangeStart = startOfWeek(minStart < today ? minStart : today);
  const rangeEnd = endOfWeek(maxEnd > today ? maxEnd : addCalendarDays(today, 20));
  const totalDays = Math.max(1, diffCalendarDays(rangeStart, rangeEnd) + 1);
  const totalWidth = totalDays * DAY_WIDTH;

  const headerGroups: TimelineHeaderGroup[] = [];
  const ticks: TimelineHeaderTick[] = [];
  for (let index = 0; index < totalDays; index += 1) {
    const date = addCalendarDays(rangeStart, index);
    ticks.push({
      key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      label: formatWeekdayLabel(date),
      caption: formatShortDateLabel(date),
      width: DAY_WIDTH,
      isToday: diffCalendarDays(today, date) === 0,
    });
  }

  for (let index = 0; index < ticks.length; index += 7) {
    const firstDate = addCalendarDays(rangeStart, index);
    const lastIndex = Math.min(index + 6, ticks.length - 1);
    const lastDate = addCalendarDays(rangeStart, lastIndex);
    headerGroups.push({
      key: `week-${index}`,
      label: `${formatShortDateLabel(firstDate)} - ${formatShortDateLabel(lastDate)}`,
      width: (lastIndex - index + 1) * DAY_WIDTH,
    });
  }

  const placed = assignLanes(trips).map((trip) => {
    const startOffset = diffCalendarDays(rangeStart, trip.start);
    const duration = Math.max(1, diffCalendarDays(trip.start, trip.end) + 1);
    return {
      ...trip,
      left: startOffset * DAY_WIDTH,
      width: Math.max(duration * DAY_WIDTH, DAY_WIDTH),
    };
  });

  const todayOffset = diffCalendarDays(rangeStart, today);
  return {
    totalWidth,
    totalDays,
    laneCount: placed.reduce((max, trip) => Math.max(max, trip.lane + 1), trips.length > 0 ? 1 : 0),
    headerGroups,
    ticks,
    placed,
    todayLeft: todayOffset >= 0 && todayOffset <= totalDays ? todayOffset * DAY_WIDTH : null,
    empty: trips.length === 0,
  };
}

export function OrganizerTimelineSurface({
  trips,
  scale,
  onScaleChange,
  scaleOptions,
}: OrganizerTimelineSurfaceProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const normalized = useMemo(() => normalizeTripRecords(trips), [trips]);
  const layout = useMemo(
    () => (scale === 'month' ? buildMonthLayout(normalized.scheduled, new Date()) : buildWeekLayout(normalized.scheduled, new Date())),
    [normalized.scheduled, scale]
  );

  const selectedTrip =
    trips.find((trip) => trip.id === selectedId) ?? trips.find((trip) => trip.id === hoverId) ?? normalized.scheduled[0]?.trip ?? normalized.undated[0] ?? null;

  return (
    <div className="space-y-5">
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Таймлайн поездок</h2>
            <p className="mt-1 text-sm text-slate-600">
              {normalized.scheduled.length} на шкале
              {normalized.undated.length > 0 ? ` · ${normalized.undated.length} без дат` : ''}
              {normalized.overlapCount > 0 || normalized.windowCount > 0
                ? ` · ${normalized.overlapCount} пересечений · ${normalized.windowCount} окон`
                : ''}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {scaleOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => onScaleChange(option.id)}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  option.id === scale ? 'border-sky-300 bg-sky-50 text-sky-900' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="relative min-w-full px-5 py-4" style={{ width: Math.max(layout.totalWidth + 40, 760) }}>
            <div className="mb-3 grid text-[11px] font-medium text-slate-500" style={{ gridTemplateColumns: layout.headerGroups.map((group) => `${group.width}px`).join(' ') }}>
              {layout.headerGroups.map((group) => (
                <div key={group.key} className="border-b border-slate-200 pb-2 pr-2">
                  {group.label}
                </div>
              ))}
            </div>

            {layout.ticks.length > 0 ? (
              <div className="mb-3 flex border-b border-slate-200 pb-2">
                {layout.ticks.map((tick) => (
                  <div
                    key={tick.key}
                    className={`shrink-0 border-r border-slate-200 pr-1 text-[11px] ${tick.isToday ? 'text-sky-700' : 'text-slate-500'}`}
                    style={{ width: tick.width }}
                  >
                    <div className="font-medium">{tick.label}</div>
                    <div>{tick.caption}</div>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50" style={{ minHeight: layout.empty ? 160 : layout.laneCount * (LANE_HEIGHT + LANE_GAP) + 24 }}>
              <div className="absolute inset-0 flex pointer-events-none">
                {layout.headerGroups.map((group) => (
                  <div key={`${group.key}-grid`} className="h-full border-r border-slate-200/80 first:border-l-0" style={{ width: group.width }} />
                ))}
              </div>

              {layout.ticks.length > 0 ? (
                <div className="absolute inset-0 flex pointer-events-none">
                  {layout.ticks.map((tick) => (
                    <div
                      key={`${tick.key}-day-grid`}
                      className={`h-full border-r border-slate-200/70 ${tick.isToday ? 'bg-sky-50/70' : 'bg-transparent'}`}
                      style={{ width: tick.width }}
                    />
                  ))}
                </div>
              ) : null}

              {layout.todayLeft !== null ? (
                <div className="absolute inset-y-0 z-10" style={{ left: layout.todayLeft }}>
                  <div className="h-full w-px bg-sky-400" />
                  <div className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full bg-sky-600 px-2 py-0.5 text-[10px] font-medium text-white">
                    Сегодня
                  </div>
                </div>
              ) : null}

              {layout.empty ? (
                <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                  <div>
                    <div className="text-sm font-medium text-slate-900">Шкала уже готова</div>
                    <p className="mt-2 max-w-md text-sm text-slate-600">
                      Задайте поездкам даты, и они появятся здесь как полосы на шкале. Поездки без дат уже собраны ниже отдельной спокойной rail-зоной.
                    </p>
                  </div>
                </div>
              ) : (
                layout.placed.map((placed) => (
                  <TimelineBar
                    key={placed.trip.id}
                    placed={placed}
                    top={placed.lane * (LANE_HEIGHT + LANE_GAP) + 12}
                    isActive={placed.trip.id === selectedId || placed.trip.id === hoverId}
                    onHover={(next) => setHoverId(next ? placed.trip.id : null)}
                    onSelect={() => setSelectedId((current) => (current === placed.trip.id ? null : placed.trip.id))}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </article>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900">Поездки без дат</h3>
              <span className="text-xs text-slate-400">{normalized.undated.length}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Они появятся на шкале, как только у них будет хотя бы одна временная опора.
            </p>
            {normalized.undated.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {normalized.undated.map((trip) => {
                  const execution = deriveExecutionFromSummary(trip);
                  return (
                    <button
                      key={trip.id}
                      type="button"
                      onMouseEnter={() => setHoverId(trip.id)}
                      onMouseLeave={() => setHoverId((current) => (current === trip.id ? null : current))}
                      onClick={() => setSelectedId((current) => (current === trip.id ? null : trip.id))}
                      className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
                        trip.id === selectedId || trip.id === hoverId
                          ? 'border-sky-300 bg-sky-50 text-sky-900'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="font-medium">{trip.title}</span>
                      <span className={`rounded-full border px-2 py-0.5 text-[11px] ${toneClasses(execution.readinessTone)}`}>
                        {execution.readinessLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                Сейчас все поездки уже имеют временную опору.
              </div>
            )}
          </article>
        </div>

        <TimelineSelectionPreview trip={selectedTrip} />
      </div>
    </div>
  );
}

function TimelineBar({
  placed,
  top,
  isActive,
  onHover,
  onSelect,
}: {
  placed: TimelinePlacedTrip;
  top: number;
  isActive: boolean;
  onHover: (isHovering: boolean) => void;
  onSelect: () => void;
}) {
  const execution = deriveExecutionFromSummary(placed.trip);
  const lifecycle = deriveTripLifecycleState(placed.trip);
  const minWidth = 52;

  return (
    <button
      type="button"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onClick={onSelect}
      className={`absolute overflow-hidden rounded-xl border px-3 py-2 text-left shadow-sm transition ${toneBarClasses(
        execution.readinessTone
      )} ${isActive ? 'ring-2 ring-sky-400 z-10' : 'hover:ring-1 hover:ring-slate-300'}`}
      style={{
        left: placed.left + 4,
        width: Math.max(minWidth, placed.width - 8),
        top,
        height: LANE_HEIGHT - 8,
      }}
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-slate-900">{placed.trip.title}</div>
          <div className="mt-1 truncate text-[11px] text-slate-600">
            {formatTripWindowLabel(placed.trip) ?? formatTripStatusLabel(placed.trip.status)}
          </div>
        </div>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] ${toneClasses(lifecycle.tone)}`}>{lifecycle.label}</span>
      </div>
    </button>
  );
}

function TimelineSelectionPreview({ trip }: { trip: OrganizerTripSummary | null }) {
  if (!trip) {
    return (
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">Подсказка</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Кликните по полосе поездки или по карточке без дат, чтобы увидеть её контекст здесь и быстро открыть нужную поездку.
        </p>
      </article>
    );
  }

  const execution = deriveExecutionFromSummary(trip);
  const lifecycle = deriveTripLifecycleState(trip);
  const windowLabel = formatTripWindowLabel(trip);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-900">{trip.title}</h3>
          <p className="mt-1 text-sm text-slate-500">{trip.destinationLabel ?? 'Локация пока не уточнена'}</p>
        </div>
        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${toneClasses(lifecycle.tone)}`}>{lifecycle.label}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
        <span>{windowLabel ?? 'Даты ещё не заданы'}</span>
        <span>{formatTripStatusLabel(trip.status)}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${toneClasses(execution.readinessTone)}`}>
          {execution.readinessLabel}
        </span>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600">
          {execution.progressLabel}
        </span>
      </div>

      <p className="mt-4 text-sm text-slate-700">{execution.whatMattersNow}</p>
      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Следующий шаг</div>
        <div className="mt-2 text-sm font-medium text-slate-900">{execution.nextStep.title}</div>
        <p className="mt-1 text-sm text-slate-600">{execution.nextStep.description}</p>
      </div>

      <Link
        href={`/space/organizer/trips/${encodeURIComponent(trip.id)}`}
        className="mt-auto inline-flex items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        Открыть поездку
      </Link>
    </article>
  );
}
