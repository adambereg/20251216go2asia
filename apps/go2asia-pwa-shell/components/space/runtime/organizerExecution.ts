import type {
  OrganizerTrip,
  OrganizerTripDetailResponse,
  OrganizerTripItem,
  OrganizerTripStatus,
  OrganizerTripSummary,
  OrganizerTripTask,
} from './organizerApi';

export type OrganizerExecutionTone = 'amber' | 'sky' | 'emerald' | 'slate';
export type OrganizerLifecycleMode = 'preparation' | 'in_trip' | 'post_trip';

export type OrganizerExecutionActionKey =
  | 'create-trip'
  | 'add-item'
  | 'add-task'
  | 'finish-task'
  | 'add-note'
  | 'review-items'
  | 'review-trip';

export type OrganizerExecutionChip = {
  label: string;
  tone: OrganizerExecutionTone;
};

export type OrganizerExecutionStep = {
  title: string;
  description: string;
  actionKey: OrganizerExecutionActionKey;
};

export type OrganizerExecutionState = {
  readinessLabel: string;
  readinessTone: OrganizerExecutionTone;
  progressLabel: string;
  progressHint: string;
  whatMattersNow: string;
  nextStep: OrganizerExecutionStep;
  chips: OrganizerExecutionChip[];
};

export type OrganizerLifecycleState = {
  mode: OrganizerLifecycleMode;
  label: string;
  hint: string;
  tone: OrganizerExecutionTone;
};

export type OrganizerDateConfidenceState = {
  label: string;
  hint: string;
  tone: OrganizerExecutionTone;
};

export type OrganizerTripBlocker = {
  id: string;
  title: string;
  description: string;
  tone: OrganizerExecutionTone;
};

export type OrganizerReadinessCheck = {
  id: string;
  label: string;
  done: boolean;
  hint: string;
};

export type OrganizerDayAnchor = {
  iso: string;
  label: string;
  shortLabel: string;
  weekdayLabel: string;
  dayIndex: number;
  isToday: boolean;
};

type DerivedMetrics = {
  itemsCount: number;
  tasksCount: number;
  pendingTaskCount: number;
  doneTaskCount: number;
  noteCount: number;
  plannedItemCount: number;
  bookedItemCount: number;
  doneItemCount: number;
  sourceLinkedItemCount: number;
  firstPendingTaskTitle: string | null;
};

function pluralizeRu(count: number, one: string, few: string, many: string): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
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

function diffCalendarDays(from: Date, to: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / msPerDay);
}

function addCalendarDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function formatDayShort(date: Date): string {
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

function formatDayLabel(date: Date): string {
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'long' });
}

function capitalize(value: string): string {
  if (!value) return value;
  return value[0].toUpperCase() + value.slice(1);
}

function formatDayKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function metricsFromSummary(trip: OrganizerTripSummary): DerivedMetrics {
  return {
    itemsCount: trip.itemCount,
    tasksCount: trip.pendingTaskCount,
    pendingTaskCount: trip.pendingTaskCount,
    doneTaskCount: 0,
    noteCount: trip.noteCount,
    plannedItemCount: 0,
    bookedItemCount: 0,
    doneItemCount: 0,
    sourceLinkedItemCount: 0,
    firstPendingTaskTitle: null,
  };
}

function metricsFromDetail(detail: OrganizerTripDetailResponse): DerivedMetrics {
  const pendingTasks = detail.tasks.filter((task) => task.status === 'pending');
  const doneTasks = detail.tasks.filter((task) => task.status === 'done');
  const plannedItems = detail.items.filter((item) => item.status === 'planned');
  const bookedItems = detail.items.filter((item) => item.status === 'booked');
  const doneItems = detail.items.filter((item) => item.status === 'done');
  const sourceLinkedItems = detail.items.filter(
    (item) => item.sourceModule && item.sourceEntityType && item.sourceEntityId
  );

  return {
    itemsCount: detail.items.length,
    tasksCount: detail.tasks.length,
    pendingTaskCount: pendingTasks.length,
    doneTaskCount: doneTasks.length,
    noteCount: detail.notes.length,
    plannedItemCount: plannedItems.length,
    bookedItemCount: bookedItems.length,
    doneItemCount: doneItems.length,
    sourceLinkedItemCount: sourceLinkedItems.length,
    firstPendingTaskTitle: pendingTasks[0]?.title ?? null,
  };
}

function buildBaseLifecycleState(mode: OrganizerLifecycleMode): OrganizerLifecycleState {
  if (mode === 'in_trip') {
    return {
      mode,
      label: 'В поездке',
      hint: 'Сейчас важнее быстро понимать текущий день, ближайший шаг и нужные опоры.',
      tone: 'sky',
    };
  }
  if (mode === 'post_trip') {
    return {
      mode,
      label: 'После поездки',
      hint: 'Сейчас важнее сохранить полезные выводы, заметки и то, к чему стоит вернуться позже.',
      tone: 'slate',
    };
  }
  return {
    mode,
    label: 'Подготовка',
    hint: 'Сейчас важнее собрать поездку, закрыть хрупкие места и подготовить первый уверенный день.',
    tone: 'amber',
  };
}

export function deriveTripLifecycleState(
  trip: OrganizerTrip,
  referenceDate: Date = new Date()
): OrganizerLifecycleState {
  const today = startOfDay(referenceDate);
  const start = parseTripDate(trip.startDate);
  const end = parseTripDate(trip.endDate);

  if (trip.status === 'completed' || trip.status === 'archived') {
    return buildBaseLifecycleState('post_trip');
  }
  if (start && end && today >= start && today <= end) {
    return buildBaseLifecycleState('in_trip');
  }
  if (end && today > end) {
    return buildBaseLifecycleState('post_trip');
  }
  return buildBaseLifecycleState('preparation');
}

export function deriveTripDateConfidenceState(trip: OrganizerTrip): OrganizerDateConfidenceState {
  const hasStart = Boolean(parseTripDate(trip.startDate));
  const hasEnd = Boolean(parseTripDate(trip.endDate));

  if (hasStart && hasEnd) {
    return {
      label: 'Даты подтверждены',
      hint: 'Окно поездки уже понятно, и к нему проще привязать следующий шаг и дневной фокус.',
      tone: 'emerald',
    };
  }
  if (hasStart || hasEnd) {
    return {
      label: 'Даты уточняются',
      hint: 'Часть окна уже понятна, но поездке всё ещё не хватает полной временной рамки.',
      tone: 'amber',
    };
  }
  return {
    label: 'Даты ещё не заданы',
    hint: 'Когда окно поездки станет понятнее, здесь появится более точный дневной контекст.',
    tone: 'slate',
  };
}

export function describeTripDuration(trip: OrganizerTrip): string | null {
  const start = parseTripDate(trip.startDate);
  const end = parseTripDate(trip.endDate);
  if (!start || !end || end < start) return null;
  const totalDays = diffCalendarDays(start, end) + 1;
  return `${totalDays} ${pluralizeRu(totalDays, 'день', 'дня', 'дней')}`;
}

export function buildTripDayAnchors(
  trip: OrganizerTrip,
  referenceDate: Date = new Date(),
  maxDays: number = 31
): OrganizerDayAnchor[] {
  const start = parseTripDate(trip.startDate);
  const end = parseTripDate(trip.endDate);
  if (!start || !end || end < start) return [];

  const totalDays = diffCalendarDays(start, end) + 1;
  const safeDays = Math.min(totalDays, maxDays);
  const today = startOfDay(referenceDate);

  return Array.from({ length: safeDays }, (_, index) => {
    const date = addCalendarDays(start, index);
    return {
      iso: formatDayKey(date),
      label: capitalize(formatDayLabel(date)),
      shortLabel: formatDayShort(date),
      weekdayLabel: capitalize(
        date.toLocaleDateString('ru-RU', {
          weekday: 'short',
        }).replace('.', '')
      ),
      dayIndex: index + 1,
      isToday: diffCalendarDays(today, date) === 0,
    };
  });
}

export function getSuggestedTripDayAnchor(
  trip: OrganizerTrip,
  anchors: OrganizerDayAnchor[],
  referenceDate: Date = new Date()
): OrganizerDayAnchor | null {
  if (anchors.length === 0) return null;

  const lifecycle = deriveTripLifecycleState(trip, referenceDate);
  if (lifecycle.mode === 'in_trip') {
    return anchors.find((anchor) => anchor.isToday) ?? anchors[0];
  }
  if (lifecycle.mode === 'post_trip') {
    return anchors[anchors.length - 1] ?? anchors[0];
  }
  return anchors[0];
}

export function deriveTripReadinessChecks(detail: OrganizerTripDetailResponse): OrganizerReadinessCheck[] {
  const metrics = metricsFromDetail(detail);
  const hasExactWindow = Boolean(parseTripDate(detail.trip.startDate) && parseTripDate(detail.trip.endDate));
  const hasSupportItem = metrics.itemsCount > 0;
  const hasNextAction = metrics.tasksCount > 0;
  const hasContextNote = metrics.noteCount > 0;

  return [
    {
      id: 'window',
      label: 'Окно поездки',
      done: hasExactWindow,
      hint: hasExactWindow ? 'Даты уже заданы.' : 'Нужно уточнить полный диапазон поездки.',
    },
    {
      id: 'items',
      label: 'Опорные объекты',
      done: hasSupportItem,
      hint: hasSupportItem ? 'Есть хотя бы одна опора для поездки.' : 'Пока не на что опереться.',
    },
    {
      id: 'tasks',
      label: 'Следующий шаг',
      done: hasNextAction,
      hint: hasNextAction ? 'Есть хотя бы один практический шаг.' : 'Нужен ближайший полезный шаг.',
    },
    {
      id: 'notes',
      label: 'Контекст',
      done: hasContextNote,
      hint: hasContextNote ? 'Есть заметка, к которой можно вернуться.' : 'Пока не хватает личного ориентира.',
    },
  ];
}

export function deriveTripBlockers(
  detail: OrganizerTripDetailResponse,
  referenceDate: Date = new Date()
): OrganizerTripBlocker[] {
  const metrics = metricsFromDetail(detail);
  const lifecycle = deriveTripLifecycleState(detail.trip, referenceDate);
  const dateConfidence = deriveTripDateConfidenceState(detail.trip);
  const blockers: OrganizerTripBlocker[] = [];

  if (dateConfidence.tone !== 'emerald') {
    blockers.push({
      id: 'dates',
      title: 'Окно поездки ещё не собрано',
      description:
        dateConfidence.tone === 'amber'
          ? 'Пока известна только часть дат, поэтому труднее оценить ритм подготовки и ближайшие дни.'
          : 'Без дат поездке сложнее задать ритм и понять, к какому дню готовиться в первую очередь.',
      tone: dateConfidence.tone,
    });
  }

  if (metrics.itemsCount === 0) {
    blockers.push({
      id: 'items',
      title: 'Пока нет ни одной опоры',
      description: 'Поездке нужен хотя бы один реальный объект, чтобы остальной контекст перестал быть пустым.',
      tone: 'amber',
    });
  }

  if (lifecycle.mode === 'preparation' && metrics.itemsCount > 0 && metrics.bookedItemCount === 0) {
    blockers.push({
      id: 'booked',
      title: 'Нет ни одной подтверждённой опоры',
      description: 'Пока всё держится только на планах. Стоит подтвердить хотя бы один важный объект.',
      tone: 'amber',
    });
  }

  if (lifecycle.mode !== 'post_trip' && metrics.tasksCount === 0) {
    blockers.push({
      id: 'tasks',
      title: 'Не хватает следующего шага',
      description: 'Объекты уже могут быть собраны, но поездке нужен хотя бы один практический шаг.',
      tone: 'sky',
    });
  }

  if (lifecycle.mode === 'in_trip' && metrics.pendingTaskCount === 0) {
    blockers.push({
      id: 'current',
      title: 'Нет ближайшего шага на сейчас',
      description: 'Во время поездки полезно держать в фокусе хотя бы одно текущее действие.',
      tone: 'sky',
    });
  }

  if (lifecycle.mode === 'post_trip' && metrics.noteCount === 0) {
    blockers.push({
      id: 'recap',
      title: 'Пока нечего сохранить после поездки',
      description: 'Стоит зафиксировать хотя бы одну заметку о том, что сработало и к чему хочется вернуться.',
      tone: 'slate',
    });
  }

  if (metrics.noteCount === 0 && lifecycle.mode === 'preparation') {
    blockers.push({
      id: 'context',
      title: 'Контекст пока хрупкий',
      description: 'Без короткой заметки труднее быстро вспомнить, почему эта поездка важна и на что вы опираетесь.',
      tone: 'slate',
    });
  }

  return blockers.slice(0, 3);
}

function buildSummaryChips(trip: OrganizerTripSummary, metrics: DerivedMetrics): OrganizerExecutionChip[] {
  return [
    {
      label: `${metrics.itemsCount} ${pluralizeRu(metrics.itemsCount, 'объект', 'объекта', 'объектов')}`,
      tone: metrics.itemsCount > 0 ? 'sky' : 'amber',
    },
    {
      label:
        metrics.pendingTaskCount > 0
          ? `${metrics.pendingTaskCount} ${pluralizeRu(metrics.pendingTaskCount, 'открытая задача', 'открытые задачи', 'открытых задач')}`
          : 'Открытых задач нет',
      tone: metrics.pendingTaskCount > 0 ? 'amber' : 'emerald',
    },
    {
      label:
        metrics.noteCount > 0
          ? `${metrics.noteCount} ${pluralizeRu(metrics.noteCount, 'заметка', 'заметки', 'заметок')}`
          : 'Контекст не собран',
      tone: metrics.noteCount > 0 ? 'sky' : 'slate',
    },
    {
      label: trip.destinationLabel ? 'Локация понятна' : 'Локация не задана',
      tone: trip.destinationLabel ? 'emerald' : 'slate',
    },
  ];
}

function buildDetailChips(trip: OrganizerTrip, metrics: DerivedMetrics): OrganizerExecutionChip[] {
  const chips: OrganizerExecutionChip[] = [
    {
      label: `${metrics.itemsCount} ${pluralizeRu(metrics.itemsCount, 'объект', 'объекта', 'объектов')}`,
      tone: metrics.itemsCount > 0 ? 'sky' : 'amber',
    },
    {
      label:
        metrics.pendingTaskCount > 0
          ? `${metrics.pendingTaskCount} ${pluralizeRu(metrics.pendingTaskCount, 'открытая задача', 'открытые задачи', 'открытых задач')}`
          : 'Открытых задач нет',
      tone: metrics.pendingTaskCount > 0 ? 'amber' : 'emerald',
    },
    {
      label:
        metrics.noteCount > 0
          ? `${metrics.noteCount} ${pluralizeRu(metrics.noteCount, 'заметка', 'заметки', 'заметок')}`
          : 'Контекст не зафиксирован',
      tone: metrics.noteCount > 0 ? 'sky' : 'slate',
    },
  ];

  if (metrics.plannedItemCount > 0) {
    chips.push({
      label: `${metrics.plannedItemCount} ${pluralizeRu(metrics.plannedItemCount, 'объект ждёт подтверждения', 'объекта ждут подтверждения', 'объектов ждут подтверждения')}`,
      tone: 'amber',
    });
  } else if (metrics.bookedItemCount > 0) {
    chips.push({
      label: `${metrics.bookedItemCount} ${pluralizeRu(metrics.bookedItemCount, 'объект подтверждён', 'объекта подтверждены', 'объектов подтверждены')}`,
      tone: 'emerald',
    });
  }

  if (metrics.sourceLinkedItemCount > 0) {
    chips.push({
      label: `Из сохранённых: ${metrics.sourceLinkedItemCount}`,
      tone: 'slate',
    });
  }

  if (!trip.destinationLabel) {
    chips.push({
      label: 'Локация не задана',
      tone: 'slate',
    });
  }

  return chips.slice(0, 5);
}

export function deriveExecutionFromSummary(trip: OrganizerTripSummary): OrganizerExecutionState {
  const metrics = metricsFromSummary(trip);

  if (metrics.itemsCount === 0) {
    return {
      readinessLabel: 'Пора начать',
      readinessTone: 'amber',
      progressLabel: 'Пустой старт',
      progressHint: 'Поездка только создана, поэтому сначала нужен первый опорный объект.',
      whatMattersNow: 'Поездка ещё пустая, и сейчас важнее всего зафиксировать первую полезную опору.',
      nextStep: {
        title: 'Добавить первый объект',
        description: 'Добавьте место, бронь, слот или другой ориентир, вокруг которого удобно собирать остальной контекст.',
        actionKey: 'add-item',
      },
      chips: buildSummaryChips(trip, metrics),
    };
  }

  if (metrics.pendingTaskCount > 0) {
    return {
      readinessLabel: 'Есть шаги в работе',
      readinessTone: 'amber',
      progressLabel: 'Поездка движется',
      progressHint: 'Основа уже есть, теперь главное не потерять темп.',
      whatMattersNow: `Открыто ${metrics.pendingTaskCount} ${pluralizeRu(metrics.pendingTaskCount, 'действие', 'действия', 'действий')}, и к одному из них лучше вернуться сейчас.`,
      nextStep: {
        title: 'Вернуться к открытому шагу',
        description: 'Откройте поездку и разберите ближайшее действие.',
        actionKey: 'finish-task',
      },
      chips: buildSummaryChips(trip, metrics),
    };
  }

  if (metrics.noteCount === 0) {
    return {
      readinessLabel: 'Нужен контекст',
      readinessTone: 'sky',
      progressLabel: 'Появилась основа',
      progressHint: 'У поездки уже есть структура, осталось зафиксировать короткий ориентир.',
      whatMattersNow: 'Объекты уже собраны, но поездке всё ещё не хватает короткого личного контекста.',
      nextStep: {
        title: 'Добавить заметку',
        description: 'Коротко запишите, что важно не забыть и к чему вы готовитесь.',
        actionKey: 'add-note',
      },
      chips: buildSummaryChips(trip, metrics),
    };
  }

  return {
    readinessLabel: 'Собрано уверенно',
    readinessTone: 'emerald',
    progressLabel: 'Рабочий контекст',
    progressHint: 'Есть основа, контекст и понятный следующий ход.',
    whatMattersNow: 'Поездка уже выглядит собранной и не требует срочного догоняющего шага.',
    nextStep: {
      title: 'Открыть и продолжить',
      description: 'Проверьте, что ещё стоит уточнить или подтвердить.',
      actionKey: 'review-trip',
    },
    chips: buildSummaryChips(trip, metrics),
  };
}

export function deriveExecutionFromDetail(detail: OrganizerTripDetailResponse): OrganizerExecutionState {
  const metrics = metricsFromDetail(detail);
  const lifecycle = deriveTripLifecycleState(detail.trip);
  const dateConfidence = deriveTripDateConfidenceState(detail.trip);

  if (metrics.itemsCount === 0) {
    return {
      readinessLabel: 'Пора начать',
      readinessTone: 'amber',
      progressLabel: 'Пустой старт',
      progressHint:
        lifecycle.mode === 'post_trip'
          ? 'Поездка уже завершилась, но в ней пока не осталось ни одной опоры, к которой можно вернуться потом.'
          : 'Поездка только начинается, и ей пока не хватает первой полезной опоры.',
      whatMattersNow:
        lifecycle.mode === 'in_trip'
          ? 'Поездка уже идёт, но ей пока не хватает ни одной опоры, вокруг которой можно собирать текущие решения.'
          : lifecycle.mode === 'post_trip'
            ? 'После поездки пока не на что опереться, чтобы сохранить практическую пользу.'
            : 'В поездке пока нет ни одного опорного объекта, вокруг которого можно собирать решения.',
      nextStep: {
        title: lifecycle.mode === 'post_trip' ? 'Зафиксировать полезную опору' : 'Добавить первый объект',
        description:
          lifecycle.mode === 'post_trip'
            ? 'Сохраните хотя бы один объект или вывод, который стоит помнить о поездке позже.'
            : 'Начните с жилья, места, рейса, слота или другого важного ориентира.',
        actionKey: 'add-item',
      },
      chips: buildDetailChips(detail.trip, metrics),
    };
  }

  if (metrics.tasksCount === 0) {
    return {
      readinessLabel: 'Нужен следующий шаг',
      readinessTone: 'sky',
      progressLabel: 'Появилась основа',
      progressHint:
        lifecycle.mode === 'in_trip'
          ? 'Опоры уже есть, но сейчас поездке нужен хотя бы один понятный текущий шаг.'
          : lifecycle.mode === 'post_trip'
            ? 'База уже сохранилась, но поездке не хватает следующего полезного вывода или действия после неё.'
            : 'У поездки уже есть опорные объекты, теперь ей нужен первый практический шаг.',
      whatMattersNow:
        lifecycle.mode === 'post_trip'
          ? 'Поездка уже завершилась, но пока нет ни одного действия, которое помогает сохранить её пользу.'
          : 'Объекты уже собраны, но пока нет ни одного действия, которое двигает поездку вперёд.',
      nextStep: {
        title: lifecycle.mode === 'post_trip' ? 'Добавить полезный follow-up' : 'Добавить первую задачу',
        description:
          lifecycle.mode === 'post_trip'
            ? 'Зафиксируйте одно действие или вывод, который поможет не потерять пользу этой поездки.'
            : 'Сформулируйте одно ближайшее действие, которое двигает поездку вперёд.',
        actionKey: 'add-task',
      },
      chips: buildDetailChips(detail.trip, metrics),
    };
  }

  if (metrics.pendingTaskCount > 0) {
    return {
      readinessLabel: 'Есть шаги в работе',
      readinessTone: 'amber',
      progressLabel: lifecycle.mode === 'in_trip' ? 'Сейчас в движении' : 'Поездка движется',
      progressHint:
        lifecycle.mode === 'in_trip'
          ? 'Сейчас важнее быстро держать ближайший шаг и не потерять текущий ритм поездки.'
          : 'Структура уже есть, сейчас главное сохранить ритм и закрыть ближайшее действие.',
      whatMattersNow:
        lifecycle.mode === 'in_trip'
          ? `Поездка уже идёт, и в фокусе ${metrics.pendingTaskCount} ${pluralizeRu(metrics.pendingTaskCount, 'текущее действие', 'текущих действия', 'текущих действий')}.`
          : `Сейчас важнее всего не потерять ритм: открыто ${metrics.pendingTaskCount} ${pluralizeRu(metrics.pendingTaskCount, 'действие', 'действия', 'действий')}.`,
      nextStep: {
        title: metrics.firstPendingTaskTitle ?? 'Закрыть ближайшую задачу',
        description:
          lifecycle.mode === 'in_trip'
            ? 'Сфокусируйтесь на ближайшем шаге этого этапа поездки.'
            : 'Разберите ближайший шаг или отметьте его выполненным.',
        actionKey: 'finish-task',
      },
      chips: buildDetailChips(detail.trip, metrics),
    };
  }

  if (metrics.noteCount === 0) {
    return {
      readinessLabel: 'Нужен контекст',
      readinessTone: 'sky',
      progressLabel: lifecycle.mode === 'post_trip' ? 'Нужно сохранить пользу' : 'Почти собрана',
      progressHint:
        lifecycle.mode === 'in_trip'
          ? 'Структура уже есть, но полезно зафиксировать один короткий ориентир по текущему этапу поездки.'
          : lifecycle.mode === 'post_trip'
            ? 'Поездка уже закончилась, и сейчас полезно оставить хотя бы один вывод или заметку на будущее.'
            : 'Структура уже есть, осталось добавить один короткий ориентир для себя.',
      whatMattersNow:
        lifecycle.mode === 'post_trip'
          ? 'Поездке уже хватает структуры, но пока нет ни одной заметки о том, что стоит сохранить или повторить.'
          : 'Шаги уже есть, но поездке всё ещё не хватает короткого личного контекста.',
      nextStep: {
        title: 'Добавить заметку',
        description:
          lifecycle.mode === 'post_trip'
            ? 'Запишите один вывод: что сработало, что помнить или к чему хочется вернуться позже.'
            : lifecycle.mode === 'in_trip'
              ? 'Запишите один ориентир: что важно сегодня, что не забыть или что стоит уточнить по ходу поездки.'
              : 'Запишите один ориентир: что проверить, что помнить, что уточнить.',
        actionKey: 'add-note',
      },
      chips: buildDetailChips(detail.trip, metrics),
    };
  }

  if (metrics.plannedItemCount > 0) {
    return {
      readinessLabel: 'Есть что подтвердить',
      readinessTone: 'amber',
      progressLabel: 'Требует уточнений',
      progressHint:
        lifecycle.mode === 'in_trip'
          ? 'Часть опор ещё не подтверждена, и во время поездки это создаёт лишнюю хрупкость.'
          : dateConfidence.tone !== 'emerald'
            ? 'Поездке всё ещё не хватает и полной временной рамки, и хотя бы одной подтверждённой опоры.'
            : 'Поездка уже собрана, но часть опор ещё стоит подтвердить.',
      whatMattersNow:
        lifecycle.mode === 'in_trip'
          ? `${metrics.plannedItemCount} ${pluralizeRu(metrics.plannedItemCount, 'объект ещё без уверенного статуса', 'объекта ещё без уверенного статуса', 'объектов ещё без уверенного статуса')}.`
          : `${metrics.plannedItemCount} ${pluralizeRu(metrics.plannedItemCount, 'объект пока только запланирован', 'объекта пока только запланированы', 'объектов пока только запланированы')}.`,
      nextStep: {
        title: 'Подтвердить один объект',
        description:
          lifecycle.mode === 'in_trip'
            ? 'Проверьте один важный объект и переведите его в более уверенный статус.'
            : 'Переведите один объект в подтверждённый или завершённый статус.',
        actionKey: 'review-items',
      },
      chips: buildDetailChips(detail.trip, metrics),
    };
  }

  return {
    readinessLabel: lifecycle.mode === 'post_trip' ? 'Польза сохранена' : 'Собрано уверенно',
    readinessTone: lifecycle.mode === 'post_trip' ? 'slate' : 'emerald',
    progressLabel:
      lifecycle.mode === 'in_trip'
        ? 'Текущий контекст'
        : lifecycle.mode === 'post_trip'
          ? 'После поездки'
          : 'Рабочий контекст',
    progressHint:
      lifecycle.mode === 'in_trip'
        ? 'Есть опоры, контекст и понятный ритм. Можно спокойно держать фокус на текущем этапе поездки.'
        : lifecycle.mode === 'post_trip'
          ? 'Поездка уже завершилась, и теперь важно не потерять то, что стоит сохранить или повторить.'
          : 'Есть структура, контекст и завершённые шаги. Можно спокойно продолжать подготовку.',
    whatMattersNow:
      lifecycle.mode === 'post_trip'
        ? 'Поездка уже завершилась и выглядит собранной: теперь полезно сохранить выводы и удачные опоры на будущее.'
        : lifecycle.mode === 'in_trip'
          ? 'Поездка уже в движении: есть на что опереться и можно спокойно держать фокус на ближайшем дне.'
          : 'Поездка уже выглядит собранной: есть структура, контекст и завершённые шаги.',
    nextStep: {
      title: lifecycle.mode === 'post_trip' ? 'Сохранить полезный вывод' : 'Проверить поездку',
      description:
        lifecycle.mode === 'post_trip'
          ? 'Запишите коротко, что сработало лучше всего и что стоит использовать в будущей поездке.'
          : lifecycle.mode === 'in_trip'
            ? 'Проверьте, что сейчас актуально на этом этапе поездки и что лучше держать под рукой.'
            : 'Посмотрите, что ещё стоит уточнить или подтвердить.',
      actionKey: 'review-trip',
    },
    chips: buildDetailChips(detail.trip, metrics),
  };
}

export function formatTripItemStatusLabel(status: OrganizerTripItem['status']): string {
  if (status === 'booked') return 'Подтверждено';
  if (status === 'done') return 'Готово';
  return 'Запланировано';
}

export function formatTripStatusLabel(status: OrganizerTripStatus): string {
  if (status === 'active') return 'В работе';
  if (status === 'completed') return 'Завершена';
  if (status === 'archived') return 'В архиве';
  return 'Черновик';
}

export function formatTripTaskStatusLabel(status: OrganizerTripTask['status']): string {
  return status === 'done' ? 'Готово' : 'В работе';
}
