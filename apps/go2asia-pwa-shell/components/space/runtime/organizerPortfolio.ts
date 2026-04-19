import type { OrganizerTripSummary } from './organizerApi';
import {
  deriveExecutionFromSummary,
  deriveTripDateConfidenceState,
  deriveTripLifecycleState,
  formatTripStatusLabel,
  type OrganizerExecutionActionKey,
  type OrganizerExecutionTone,
  type OrganizerLifecycleMode,
} from './organizerExecution';

export type OrganizerOverviewScale = 'day' | 'week' | 'month';
export type OrganizerTimelineScale = 'week' | 'month';
export type OrganizerPortfolioHorizon = 'now' | 'this_week' | 'soon' | 'later' | 'post_trip';

export type OrganizerPortfolioAction = {
  id: string;
  tripId: string;
  tripTitle: string;
  tripHref: string;
  title: string;
  description: string;
  whyNow: string;
  ctaLabel: string;
  actionKey: OrganizerExecutionActionKey;
  lifecycleLabel: string;
  lifecycleMode: OrganizerLifecycleMode;
  statusLabel: string;
  tripWindowLabel: string | null;
  timingLabel: string;
  attentionLabel: string | null;
  horizon: OrganizerPortfolioHorizon;
  horizonLabel: string;
  tone: OrganizerExecutionTone;
  anchorDateKey: string | null;
};

export type OrganizerPortfolioGroup = {
  id: OrganizerPortfolioHorizon;
  label: string;
  description: string;
  actions: OrganizerPortfolioAction[];
};

export type OrganizerActionTimelineSlot = {
  id: string;
  label: string;
  caption: string;
  actions: OrganizerPortfolioAction[];
};

export type OrganizerActionTimeline = {
  scale: OrganizerOverviewScale;
  slots: OrganizerActionTimelineSlot[];
};

export type OrganizerTripTimelineRange = {
  tripId: string;
  tripTitle: string;
  tripHref: string;
  tripWindowLabel: string | null;
  lifecycleLabel: string;
  statusLabel: string;
  summary: string | null;
  tone: OrganizerExecutionTone;
  leftPercent: number;
  widthPercent: number;
};

export type OrganizerTripTimelineCell = {
  key: string;
  label: string;
  shortLabel: string;
  monthLabel: string;
  isToday: boolean;
};

export type OrganizerTripTimelineMonthGroup = {
  key: string;
  label: string;
  span: number;
};

export type OrganizerTripTimeline = {
  scale: OrganizerTimelineScale;
  boardStartLabel: string;
  boardEndLabel: string;
  cells: OrganizerTripTimelineCell[];
  monthGroups: OrganizerTripTimelineMonthGroup[];
  ranges: OrganizerTripTimelineRange[];
  unscheduledTrips: OrganizerTripSummary[];
  overlapCount: number;
  windowCount: number;
  cellWidth: number;
};

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
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / msPerDay);
}

function formatDayKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

function formatWeekday(date: Date): string {
  return date
    .toLocaleDateString('ru-RU', { weekday: 'short' })
    .replace('.', '')
    .replace(/^./, (value) => value.toUpperCase());
}

function formatMonthLabel(date: Date): string {
  return date
    .toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
    .replace(/^./, (value) => value.toUpperCase());
}

export function formatTripWindowLabel(trip: OrganizerTripSummary): string | null {
  if (!trip.startDate && !trip.endDate) return null;
  if (trip.startDate && trip.endDate) {
    return `${new Date(trip.startDate).toLocaleDateString('ru-RU')} - ${new Date(trip.endDate).toLocaleDateString('ru-RU')}`;
  }
  return trip.startDate
    ? `Старт: ${new Date(trip.startDate).toLocaleDateString('ru-RU')}`
    : `Финал: ${new Date(trip.endDate!).toLocaleDateString('ru-RU')}`;
}

function getPrimaryCtaLabel(actionKey: OrganizerExecutionActionKey): string {
  if (actionKey === 'finish-task') return 'Вернуться к шагу';
  if (actionKey === 'add-task') return 'Открыть поездку';
  if (actionKey === 'add-item' || actionKey === 'review-items') return 'Открыть поездку';
  if (actionKey === 'add-note') return 'Открыть заметки';
  return 'Открыть поездку';
}

function getHorizonLabel(horizon: OrganizerPortfolioHorizon): string {
  if (horizon === 'now') return 'Сейчас';
  if (horizon === 'this_week') return 'На этой неделе';
  if (horizon === 'soon') return 'Скоро';
  if (horizon === 'later') return 'Позже';
  return 'После поездки';
}

function getHorizonDescription(horizon: OrganizerPortfolioHorizon): string {
  if (horizon === 'now') return 'Точки внимания, к которым лучше вернуться без паузы.';
  if (horizon === 'this_week') return 'Шаги, которые уже формируют ближайший рабочий ритм.';
  if (horizon === 'soon') return 'Действия, которые станут важнее по мере приближения поездки.';
  if (horizon === 'later') return 'Спокойный стратегический горизонт без срочного давления.';
  return 'Что стоит зафиксировать, сохранить или использовать потом.';
}

function getPortfolioTone(horizon: OrganizerPortfolioHorizon, fallback: OrganizerExecutionTone): OrganizerExecutionTone {
  if (horizon === 'post_trip') return 'slate';
  if (horizon === 'now') return fallback === 'emerald' ? 'sky' : fallback;
  return fallback;
}

function derivePortfolioHorizon(trip: OrganizerTripSummary, referenceDate: Date = new Date()): OrganizerPortfolioHorizon {
  const lifecycle = deriveTripLifecycleState(trip, referenceDate);
  const start = parseTripDate(trip.startDate);

  if (lifecycle.mode === 'post_trip') return 'post_trip';
  if (lifecycle.mode === 'in_trip') return 'now';
  if (!start) {
    return trip.pendingTaskCount > 0 || trip.itemCount === 0 ? 'now' : 'this_week';
  }

  const daysUntilStart = diffCalendarDays(referenceDate, start);
  if (daysUntilStart <= 3) return 'now';
  if (daysUntilStart <= 10) return 'this_week';
  if (daysUntilStart <= 30) return 'soon';
  return 'later';
}

function buildTimingLabel(trip: OrganizerTripSummary, horizon: OrganizerPortfolioHorizon, referenceDate: Date = new Date()): string {
  const lifecycle = deriveTripLifecycleState(trip, referenceDate);
  const start = parseTripDate(trip.startDate);
  const end = parseTripDate(trip.endDate);

  if (lifecycle.mode === 'in_trip') {
    return end ? `Поездка идёт до ${formatShortDate(end)}` : 'Поездка уже идёт';
  }
  if (horizon === 'post_trip') {
    return end ? `После ${formatShortDate(end)}` : 'После поездки';
  }
  if (start) {
    const daysUntilStart = diffCalendarDays(referenceDate, start);
    if (daysUntilStart <= 0) return `Старт ${formatShortDate(start)}`;
    return `До старта ${daysUntilStart} дн.`;
  }
  return 'Окно поездки ещё уточняется';
}

function buildWhyNow(trip: OrganizerTripSummary, referenceDate: Date = new Date()): string {
  const execution = deriveExecutionFromSummary(trip);
  const lifecycle = deriveTripLifecycleState(trip, referenceDate);
  const dateConfidence = deriveTripDateConfidenceState(trip);
  const horizon = derivePortfolioHorizon(trip, referenceDate);

  if (horizon === 'post_trip') {
    return execution.progressHint;
  }
  if (lifecycle.mode === 'in_trip') {
    return `Поездка уже в активной фазе: ${execution.whatMattersNow.toLowerCase()}`;
  }
  if (dateConfidence.tone !== 'emerald') {
    return dateConfidence.hint;
  }
  return execution.progressHint;
}

function buildAttentionLabel(trip: OrganizerTripSummary, referenceDate: Date = new Date()): string | null {
  const execution = deriveExecutionFromSummary(trip);
  const dateConfidence = deriveTripDateConfidenceState(trip);
  if (dateConfidence.tone !== 'emerald') return dateConfidence.label;
  if (execution.readinessTone !== 'emerald') return execution.readinessLabel;
  return null;
}

function buildAnchorDate(trip: OrganizerTripSummary, referenceDate: Date = new Date()): string | null {
  const lifecycle = deriveTripLifecycleState(trip, referenceDate);
  const horizon = derivePortfolioHorizon(trip, referenceDate);
  const start = parseTripDate(trip.startDate);
  const end = parseTripDate(trip.endDate);
  const today = startOfDay(referenceDate);

  if (lifecycle.mode === 'in_trip') return formatDayKey(today);
  if (horizon === 'post_trip') return end ? formatDayKey(end) : formatDayKey(today);
  if (start) return formatDayKey(start);
  if (end) return formatDayKey(end);
  if (horizon === 'later') return formatDayKey(addCalendarDays(today, 30));
  if (horizon === 'soon') return formatDayKey(addCalendarDays(today, 14));
  if (horizon === 'this_week') return formatDayKey(addCalendarDays(today, 7));
  return formatDayKey(today);
}

export function derivePortfolioActions(
  trips: OrganizerTripSummary[],
  referenceDate: Date = new Date()
): OrganizerPortfolioAction[] {
  const horizonOrder: OrganizerPortfolioHorizon[] = ['now', 'this_week', 'soon', 'later', 'post_trip'];

  return trips
    .map((trip) => {
      const execution = deriveExecutionFromSummary(trip);
      const lifecycle = deriveTripLifecycleState(trip, referenceDate);
      const horizon = derivePortfolioHorizon(trip, referenceDate);
      return {
        id: `action:${trip.id}`,
        tripId: trip.id,
        tripTitle: trip.title,
        tripHref: `/space/organizer/trips/${encodeURIComponent(trip.id)}`,
        title: execution.nextStep.title,
        description: execution.nextStep.description,
        whyNow: buildWhyNow(trip, referenceDate),
        ctaLabel: getPrimaryCtaLabel(execution.nextStep.actionKey),
        actionKey: execution.nextStep.actionKey,
        lifecycleLabel: lifecycle.label,
        lifecycleMode: lifecycle.mode,
        statusLabel: formatTripStatusLabel(trip.status),
        tripWindowLabel: formatTripWindowLabel(trip),
        timingLabel: buildTimingLabel(trip, horizon, referenceDate),
        attentionLabel: buildAttentionLabel(trip, referenceDate),
        horizon,
        horizonLabel: getHorizonLabel(horizon),
        tone: getPortfolioTone(horizon, execution.readinessTone),
        anchorDateKey: buildAnchorDate(trip, referenceDate),
      };
    })
    .sort((left, right) => {
      const horizonDiff = horizonOrder.indexOf(left.horizon) - horizonOrder.indexOf(right.horizon);
      if (horizonDiff !== 0) return horizonDiff;
      if (left.anchorDateKey && right.anchorDateKey) return left.anchorDateKey.localeCompare(right.anchorDateKey);
      if (left.anchorDateKey) return -1;
      if (right.anchorDateKey) return 1;
      return left.tripTitle.localeCompare(right.tripTitle, 'ru');
    });
}

export function buildPortfolioGroups(actions: OrganizerPortfolioAction[]): OrganizerPortfolioGroup[] {
  const horizons: OrganizerPortfolioHorizon[] = ['now', 'this_week', 'soon', 'later', 'post_trip'];
  return horizons
    .map((horizon) => ({
      id: horizon,
      label: getHorizonLabel(horizon),
      description: getHorizonDescription(horizon),
      actions: actions.filter((action) => action.horizon === horizon),
    }))
    .filter((group) => group.actions.length > 0);
}

function buildDayScaleSlots(actions: OrganizerPortfolioAction[], referenceDate: Date): OrganizerActionTimelineSlot[] {
  const today = startOfDay(referenceDate);
  const tomorrow = addCalendarDays(today, 1);
  const slots: OrganizerActionTimelineSlot[] = [
    { id: formatDayKey(today), label: 'Сегодня', caption: formatShortDate(today), actions: [] },
    { id: formatDayKey(tomorrow), label: 'Завтра', caption: formatShortDate(tomorrow), actions: [] },
    { id: 'later', label: 'Потом', caption: 'Следующий фокус', actions: [] },
  ];

  actions.forEach((action) => {
    const anchor = parseTripDate(action.anchorDateKey);
    if (!anchor) {
      slots[2]?.actions.push(action);
      return;
    }
    const diff = diffCalendarDays(today, anchor);
    if (diff <= 0) {
      slots[0]?.actions.push(action);
    } else if (diff === 1) {
      slots[1]?.actions.push(action);
    } else {
      slots[2]?.actions.push(action);
    }
  });

  return slots;
}

function buildWeekScaleSlots(actions: OrganizerPortfolioAction[], referenceDate: Date): OrganizerActionTimelineSlot[] {
  const today = startOfDay(referenceDate);
  const slots = Array.from({ length: 7 }, (_, index) => {
    const date = addCalendarDays(today, index);
    return {
      id: formatDayKey(date),
      label: index === 0 ? 'Сегодня' : formatWeekday(date),
      caption: formatShortDate(date),
      actions: [] as OrganizerPortfolioAction[],
    };
  });

  const overflowSlot: OrganizerActionTimelineSlot = {
    id: 'week-later',
    label: 'Дальше',
    caption: 'За пределами недели',
    actions: [],
  };

  actions.forEach((action) => {
    const anchor = parseTripDate(action.anchorDateKey);
    if (!anchor) {
      overflowSlot.actions.push(action);
      return;
    }
    const diff = diffCalendarDays(today, anchor);
    if (diff <= 0) {
      slots[0]?.actions.push(action);
    } else if (diff < 7) {
      slots[diff]?.actions.push(action);
    } else {
      overflowSlot.actions.push(action);
    }
  });

  return overflowSlot.actions.length > 0 ? [...slots, overflowSlot] : slots;
}

function buildMonthScaleSlots(actions: OrganizerPortfolioAction[], referenceDate: Date): OrganizerActionTimelineSlot[] {
  const today = startOfDay(referenceDate);
  const ranges = [
    { id: 'month-now', label: 'Сейчас', caption: '0-3 дня', min: Number.NEGATIVE_INFINITY, max: 3 },
    { id: 'month-week', label: 'Эта неделя', caption: '4-7 дней', min: 4, max: 7 },
    { id: 'month-soon', label: 'Скоро', caption: '8-14 дней', min: 8, max: 14 },
    { id: 'month-later', label: 'Позже', caption: '15-30 дней и после', min: 15, max: Number.POSITIVE_INFINITY },
  ];

  const slots = ranges.map((range) => ({
    id: range.id,
    label: range.label,
    caption: range.caption,
    actions: [] as OrganizerPortfolioAction[],
  }));

  actions.forEach((action) => {
    const anchor = parseTripDate(action.anchorDateKey);
    const diff = anchor ? diffCalendarDays(today, anchor) : 30;
    const slot =
      diff <= 3
        ? slots[0]
        : diff <= 7
          ? slots[1]
          : diff <= 14
            ? slots[2]
            : slots[3];
    slot?.actions.push(action);
  });

  return slots;
}

export function buildActionTimeline(
  actions: OrganizerPortfolioAction[],
  scale: OrganizerOverviewScale,
  referenceDate: Date = new Date()
): OrganizerActionTimeline {
  if (scale === 'day') {
    return { scale, slots: buildDayScaleSlots(actions, referenceDate) };
  }
  if (scale === 'month') {
    return { scale, slots: buildMonthScaleSlots(actions, referenceDate) };
  }
  return { scale, slots: buildWeekScaleSlots(actions, referenceDate) };
}

function buildTimelineCells(start: Date, end: Date): OrganizerTripTimelineCell[] {
  const totalDays = Math.max(1, diffCalendarDays(start, end) + 1);
  return Array.from({ length: totalDays }, (_, index) => {
    const date = addCalendarDays(start, index);
    return {
      key: formatDayKey(date),
      label: formatWeekday(date),
      shortLabel: formatShortDate(date),
      monthLabel: formatMonthLabel(date),
      isToday: formatDayKey(date) === formatDayKey(new Date()),
    };
  });
}

function buildMonthGroups(cells: OrganizerTripTimelineCell[]): OrganizerTripTimelineMonthGroup[] {
  const groups: OrganizerTripTimelineMonthGroup[] = [];
  cells.forEach((cell) => {
    const previous = groups[groups.length - 1];
    if (previous && previous.label === cell.monthLabel) {
      previous.span += 1;
      return;
    }
    groups.push({
      key: `${cell.monthLabel}-${groups.length}`,
      label: cell.monthLabel,
      span: 1,
    });
  });
  return groups;
}

export function deriveTripTimeline(
  trips: OrganizerTripSummary[],
  scale: OrganizerTimelineScale = 'week',
  referenceDate: Date = new Date()
): OrganizerTripTimeline {
  const scheduledTrips = trips
    .map((trip) => ({
      trip,
      start: parseTripDate(trip.startDate),
      end: parseTripDate(trip.endDate),
    }))
    .filter((item) => item.start || item.end);

  const normalizedTrips = scheduledTrips.map(({ trip, start, end }) => {
    const normalizedStart = start ?? end ?? startOfDay(referenceDate);
    const normalizedEnd = end ?? start ?? normalizedStart;
    return {
      trip,
      start: normalizedStart,
      end: normalizedEnd >= normalizedStart ? normalizedEnd : normalizedStart,
    };
  });

  const unscheduledTrips = trips.filter((trip) => !trip.startDate && !trip.endDate);

  if (normalizedTrips.length === 0) {
    return {
      scale,
      boardStartLabel: 'Пока нет поездок с датами',
      boardEndLabel: '',
      cells: [],
      monthGroups: [],
      ranges: [],
      unscheduledTrips,
      overlapCount: 0,
      windowCount: 0,
      cellWidth: scale === 'week' ? 52 : 34,
    };
  }

  const sorted = [...normalizedTrips].sort((left, right) => left.start.getTime() - right.start.getTime());
  const minStart = sorted[0]?.start ?? startOfDay(referenceDate);
  const maxEnd = sorted[sorted.length - 1]?.end ?? addCalendarDays(minStart, 30);
  const paddingDays = scale === 'week' ? 4 : 8;
  const paddedStart = addCalendarDays(minStart, -paddingDays);
  const paddedEnd = addCalendarDays(maxEnd, paddingDays);
  const totalDays = Math.max(1, diffCalendarDays(paddedStart, paddedEnd) + 1);

  let overlapCount = 0;
  let windowCount = 0;
  for (let index = 1; index < sorted.length; index += 1) {
    const previous = sorted[index - 1];
    const current = sorted[index];
    if (previous && current) {
      if (current.start <= previous.end) {
        overlapCount += 1;
      } else {
        windowCount += 1;
      }
    }
  }

  const cells = buildTimelineCells(paddedStart, paddedEnd);
  const monthGroups = buildMonthGroups(cells);

  const ranges = sorted.map(({ trip, start, end }) => {
    const lifecycle = deriveTripLifecycleState(trip, referenceDate);
    const startIndex = diffCalendarDays(paddedStart, start);
    const span = Math.max(1, diffCalendarDays(start, end) + 1);
    return {
      tripId: trip.id,
      tripTitle: trip.title,
      tripHref: `/space/organizer/trips/${encodeURIComponent(trip.id)}`,
      tripWindowLabel: formatTripWindowLabel(trip),
      lifecycleLabel: lifecycle.label,
      statusLabel: formatTripStatusLabel(trip.status),
      summary: trip.summary,
      tone: deriveExecutionFromSummary(trip).readinessTone,
      leftPercent: Math.max(0, (startIndex / totalDays) * 100),
      widthPercent: Math.max((span / totalDays) * 100, (1 / totalDays) * 100),
    };
  });

  return {
    scale,
    boardStartLabel: formatShortDate(paddedStart),
    boardEndLabel: formatShortDate(paddedEnd),
    cells,
    monthGroups,
    ranges,
    unscheduledTrips,
    overlapCount,
    windowCount,
    cellWidth: scale === 'week' ? 52 : 34,
  };
}
