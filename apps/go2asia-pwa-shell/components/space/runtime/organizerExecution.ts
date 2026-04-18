import type {
  OrganizerTrip,
  OrganizerTripDetailResponse,
  OrganizerTripItem,
  OrganizerTripStatus,
  OrganizerTripSummary,
  OrganizerTripTask,
} from './organizerApi';

export type OrganizerExecutionTone = 'amber' | 'sky' | 'emerald' | 'slate';

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

  if (metrics.itemsCount === 0) {
    return {
      readinessLabel: 'Пора начать',
      readinessTone: 'amber',
      progressLabel: 'Пустой старт',
      progressHint: 'Поездка только начинается, и ей пока не хватает первой полезной опоры.',
      whatMattersNow: 'В поездке пока нет ни одного опорного объекта, вокруг которого можно собирать решения.',
      nextStep: {
        title: 'Добавить первый объект',
        description: 'Начните с жилья, места, рейса, слота или другого важного ориентира.',
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
      progressHint: 'У поездки уже есть опорные объекты, теперь ей нужен первый практический шаг.',
      whatMattersNow: 'Объекты уже собраны, но пока нет ни одного действия, которое двигает поездку вперёд.',
      nextStep: {
        title: 'Добавить первую задачу',
        description: 'Сформулируйте одно ближайшее действие, которое двигает поездку вперёд.',
        actionKey: 'add-task',
      },
      chips: buildDetailChips(detail.trip, metrics),
    };
  }

  if (metrics.pendingTaskCount > 0) {
    return {
      readinessLabel: 'Есть шаги в работе',
      readinessTone: 'amber',
      progressLabel: 'Поездка движется',
      progressHint: 'Структура уже есть, сейчас главное сохранить ритм и закрыть ближайшее действие.',
      whatMattersNow: `Сейчас важнее всего не потерять ритм: открыто ${metrics.pendingTaskCount} ${pluralizeRu(metrics.pendingTaskCount, 'действие', 'действия', 'действий')}.`,
      nextStep: {
        title: metrics.firstPendingTaskTitle ?? 'Закрыть ближайшую задачу',
        description: 'Разберите ближайший шаг или отметьте его выполненным.',
        actionKey: 'finish-task',
      },
      chips: buildDetailChips(detail.trip, metrics),
    };
  }

  if (metrics.noteCount === 0) {
    return {
      readinessLabel: 'Нужен контекст',
      readinessTone: 'sky',
      progressLabel: 'Почти собрана',
      progressHint: 'Структура уже есть, осталось добавить один короткий ориентир для себя.',
      whatMattersNow: 'Шаги уже есть, но поездке всё ещё не хватает короткого личного контекста.',
      nextStep: {
        title: 'Добавить заметку',
        description: 'Запишите один ориентир: что проверить, что помнить, что уточнить.',
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
      progressHint: 'Поездка уже собрана, но часть опор ещё стоит подтвердить.',
      whatMattersNow: `${metrics.plannedItemCount} ${pluralizeRu(metrics.plannedItemCount, 'объект пока только запланирован', 'объекта пока только запланированы', 'объектов пока только запланированы')}.`,
      nextStep: {
        title: 'Подтвердить один объект',
        description: 'Переведите один объект в подтверждённый или завершённый статус.',
        actionKey: 'review-items',
      },
      chips: buildDetailChips(detail.trip, metrics),
    };
  }

  return {
    readinessLabel: 'Собрано уверенно',
    readinessTone: 'emerald',
    progressLabel: 'Рабочий контекст',
    progressHint: 'Есть структура, контекст и завершённые шаги. Можно спокойно продолжать подготовку.',
    whatMattersNow: 'Поездка уже выглядит собранной: есть структура, контекст и завершённые шаги.',
    nextStep: {
      title: 'Проверить поездку',
      description: 'Посмотрите, что ещё стоит уточнить или подтвердить.',
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
