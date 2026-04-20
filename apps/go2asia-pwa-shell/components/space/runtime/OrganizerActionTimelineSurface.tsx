'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Calendar, CircleDot } from 'lucide-react';
import type { OrganizerPortfolioAction, OrganizerOverviewScale } from './organizerPortfolio';

const DAY_MS = 24 * 60 * 60 * 1000;

type OrganizerActionTimelineSurfaceProps = {
  actions: OrganizerPortfolioAction[];
  scale: OrganizerOverviewScale;
  onScaleChange: (scale: OrganizerOverviewScale) => void;
};

type Tick = {
  date: Date;
  label: string;
  major: boolean;
};

type PositionedAction = {
  action: OrganizerPortfolioAction;
  anchor: Date;
  lane: number;
};

type TripColor = {
  bg: string;
  ring: string;
  text: string;
  dot: string;
};

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseAnchorDate(value: string | null): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return startOfDay(parsed);
}

function toneClasses(tone: OrganizerPortfolioAction['tone']): string {
  if (tone === 'amber') return 'border-amber-200 bg-amber-50 text-amber-900';
  if (tone === 'sky') return 'border-sky-200 bg-sky-50 text-sky-900';
  if (tone === 'emerald') return 'border-emerald-200 bg-emerald-50 text-emerald-900';
  return 'border-slate-200 bg-slate-50 text-slate-800';
}

function buildTripColors(actions: OrganizerPortfolioAction[]): Record<string, TripColor> {
  const palette: TripColor[] = [
    { bg: 'bg-teal-50', ring: 'ring-teal-200', text: 'text-teal-800', dot: 'bg-teal-500' },
    { bg: 'bg-emerald-50', ring: 'ring-emerald-200', text: 'text-emerald-800', dot: 'bg-emerald-500' },
    { bg: 'bg-sky-50', ring: 'ring-sky-200', text: 'text-sky-800', dot: 'bg-sky-500' },
    { bg: 'bg-amber-50', ring: 'ring-amber-200', text: 'text-amber-800', dot: 'bg-amber-500' },
    { bg: 'bg-rose-50', ring: 'ring-rose-200', text: 'text-rose-800', dot: 'bg-rose-500' },
    { bg: 'bg-slate-50', ring: 'ring-slate-200', text: 'text-slate-800', dot: 'bg-slate-500' },
  ];

  const colors: Record<string, TripColor> = { __default: palette[5]! };
  const uniqueIds = Array.from(new Set(actions.map((action) => action.tripId)));
  uniqueIds.forEach((tripId, index) => {
    colors[tripId] = palette[index % (palette.length - 1)]!;
  });
  return colors;
}

function formatAnchor(days: number): string {
  if (days === 0) return 'Сегодня';
  if (days === 1) return 'Завтра';
  if (days < 0) {
    const past = Math.abs(days);
    if (past === 1) return 'Вчера';
    if (past < 7) return `${past} дн. назад`;
    return `${Math.round(past / 7)} нед. назад`;
  }
  if (days < 7) return `Через ${days} дн.`;
  if (days < 30) return `Через ${Math.round(days / 7)} нед.`;
  return `Через ${Math.round(days / 30)} мес.`;
}

function assignLanes(actions: Array<{ action: OrganizerPortfolioAction; anchor: Date }>, scale: OrganizerOverviewScale): PositionedAction[] {
  const laneEnds: number[] = [];
  const gapMs = scale === 'day' ? 0.8 * DAY_MS : scale === 'week' ? 3 * DAY_MS : 10 * DAY_MS;

  return actions.map(({ action, anchor }) => {
    const start = anchor.getTime();
    let lane = laneEnds.findIndex((laneEnd) => start - laneEnd > gapMs);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(start);
    } else {
      laneEnds[lane] = start;
    }
    return { action, anchor, lane };
  });
}

function buildTicks(scale: OrganizerOverviewScale, today: Date, horizon: number): Tick[] {
  if (scale === 'day') {
    return Array.from({ length: horizon + 1 }, (_, index) => {
      const date = new Date(today.getTime() + index * DAY_MS);
      return {
        date,
        label: date.toLocaleDateString('ru-RU', { day: 'numeric' }),
        major: date.getDay() === 1,
      };
    });
  }

  if (scale === 'week') {
    const weekStart = new Date(today);
    const weekDay = (weekStart.getDay() + 6) % 7;
    weekStart.setDate(weekStart.getDate() - weekDay);
    return Array.from({ length: Math.ceil(horizon / 7) + 1 }, (_, index) => {
      const date = new Date(weekStart.getTime() + index * 7 * DAY_MS);
      return {
        date,
        label: date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
        major: date.getDate() <= 7,
      };
    });
  }

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  return Array.from({ length: Math.ceil(horizon / 30) + 1 }, (_, index) => {
    const date = new Date(monthStart.getFullYear(), monthStart.getMonth() + index, 1);
    return {
      date,
      label: date.toLocaleDateString('ru-RU', { month: 'short' }).replace('.', ''),
      major: date.getMonth() === 0,
    };
  });
}

export function OrganizerActionTimelineSurface({
  actions,
  scale,
  onScaleChange,
}: OrganizerActionTimelineSurfaceProps) {
  const today = useMemo(() => startOfDay(new Date()), []);

  const horizon = useMemo(() => {
    if (scale === 'day') return 14;
    if (scale === 'week') return 56;
    return 180;
  }, [scale]);

  const ticks = useMemo(() => buildTicks(scale, today, horizon), [scale, today, horizon]);

  const rangeStart = ticks[0]?.date ?? today;
  const rangeEnd = ticks[ticks.length - 1]?.date ?? new Date(today.getTime() + horizon * DAY_MS);
  const totalMs = Math.max(1, rangeEnd.getTime() - rangeStart.getTime());

  const visible = useMemo(() => {
    return actions
      .map((action) => {
        const anchor = parseAnchorDate(action.anchorDateKey);
        if (!anchor) return null;
        return { action, anchor };
      })
      .filter((item): item is { action: OrganizerPortfolioAction; anchor: Date } => item !== null)
      .filter((item) => item.anchor.getTime() >= rangeStart.getTime() - DAY_MS && item.anchor.getTime() <= rangeEnd.getTime() + DAY_MS)
      .sort((left, right) => left.anchor.getTime() - right.anchor.getTime());
  }, [actions, rangeEnd, rangeStart]);

  const tripColors = useMemo(() => buildTripColors(actions), [actions]);
  const lanes = useMemo(() => assignLanes(visible, scale), [scale, visible]);
  const laneCount = Math.max(1, lanes.reduce((max, item) => Math.max(max, item.lane + 1), 0));

  const percentOf = (date: Date) => {
    const diff = date.getTime() - rangeStart.getTime();
    return Math.max(0, Math.min(100, (diff / totalMs) * 100));
  };

  const todayLeft = percentOf(today);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">Действия во времени</div>
          <div className="mt-1 text-xs text-slate-500">
            Спокойная шкала внимания по поездкам: видно, что близко, что дальше и где действия уплотняются.
          </div>
        </div>
        <div className="ml-auto inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
          {([
            { id: 'day', label: 'День' },
            { id: 'week', label: 'Неделя' },
            { id: 'month', label: 'Месяц' },
          ] as const).map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onScaleChange(option.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                option.id === scale ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="relative mb-6 h-8">
          <div className="absolute inset-x-0 top-4 h-px bg-slate-100" />
          {ticks.map((tick) => (
            <div
              key={tick.date.toISOString()}
              className={`absolute top-0 -translate-x-1/2 text-[10px] uppercase tracking-wide ${
                tick.major ? 'font-medium text-slate-500' : 'text-slate-400'
              }`}
              style={{ left: `${percentOf(tick.date)}%` }}
            >
              {tick.label}
            </div>
          ))}
          <div className="absolute top-2 h-4 w-px -translate-x-1/2 bg-sky-500" style={{ left: `${todayLeft}%` }} />
          <div
            className="absolute top-6 -translate-x-1/2 inline-flex items-center gap-1 text-[10px] font-medium text-sky-700"
            style={{ left: `${todayLeft}%` }}
          >
            <CircleDot className="h-2.5 w-2.5" />
            Сегодня
          </div>
        </div>

        <div className="relative" style={{ height: laneCount * 46 + 16 }}>
          <div className="pointer-events-none absolute inset-0">
            {ticks.map((tick) => (
              <div
                key={`grid-${tick.date.toISOString()}`}
                className={`absolute top-0 bottom-0 w-px ${tick.major ? 'bg-slate-100' : 'bg-slate-50'}`}
                style={{ left: `${percentOf(tick.date)}%` }}
              />
            ))}
            {Array.from({ length: laneCount }, (_, index) => (
              <div key={`lane-${index}`} className="absolute inset-x-0 h-px bg-slate-100" style={{ top: index * 46 + 32 }} />
            ))}
          </div>

          {lanes.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
              В этом окне пока нет действий. Попробуйте другой масштаб.
            </div>
          ) : (
            lanes.map(({ action, anchor, lane }) => {
              const color = tripColors[action.tripId] ?? tripColors.__default!;
              const daysUntil = Math.round((anchor.getTime() - today.getTime()) / DAY_MS);

              return (
                <Link
                  key={action.id}
                  href={action.tripHref}
                  className={`absolute flex h-9 items-center gap-1.5 rounded-full px-3 text-[11px] font-medium ring-1 transition hover:shadow-sm ${color.bg} ${color.ring} ${color.text}`}
                  style={{
                    left: `calc(${percentOf(anchor)}% - 8px)`,
                    top: lane * 46,
                    maxWidth: scale === 'day' ? 250 : scale === 'week' ? 230 : 190,
                  }}
                  title={`${action.tripTitle} · ${action.title}`}
                >
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${color.dot}`} />
                  <span className="truncate">{action.title}</span>
                  <span className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] ${toneClasses(action.tone)}`}>
                    {formatAnchor(daysUntil)}
                  </span>
                </Link>
              );
            })
          )}
        </div>

        <div className="mt-5 border-t border-slate-100 pt-3">
          <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-wide text-slate-500">
            <Calendar className="h-3.5 w-3.5" />
            Поездки на шкале
          </div>
          <div className="mb-3 text-xs text-slate-500">Цвет показывает поездку, а пилюли отмечают точки внимания во времени.</div>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {Array.from(new Map(actions.map((action) => [action.tripId, action])).values())
              .slice(0, 6)
              .map((action) => {
                const color = tripColors[action.tripId] ?? tripColors.__default!;
                return (
                  <span key={action.tripId} className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                    <span className={`h-2 w-2 rounded-full ${color.dot}`} />
                    {action.tripTitle}
                  </span>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
}
