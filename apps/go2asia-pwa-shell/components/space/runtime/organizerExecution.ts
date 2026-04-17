import type {
  OrganizerTrip,
  OrganizerTripDetailResponse,
  OrganizerTripItem,
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
          : 'Нет заметок',
      tone: metrics.noteCount > 0 ? 'sky' : 'slate',
    },
    {
      label: trip.destinationLabel ? 'Локация задана' : 'Локация не задана',
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
          : 'Контекст без заметок',
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
      label: `Из Saved: ${metrics.sourceLinkedItemCount}`,
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
      readinessLabel: 'Trip ещё пустая',
      readinessTone: 'amber',
      whatMattersNow: 'Поездка пока выглядит как контейнер без наполнения. Начните с первого реального item.',
      nextStep: {
        title: 'Добавить первый item',
        description: 'Откройте поездку и зафиксируйте первое место, слот или важный объект.',
        actionKey: 'add-item',
      },
      chips: buildSummaryChips(trip, metrics),
    };
  }

  if (metrics.pendingTaskCount > 0) {
    return {
      readinessLabel: 'Есть открытые шаги',
      readinessTone: 'amber',
      whatMattersNow: `В поездке ${metrics.pendingTaskCount} ${pluralizeRu(metrics.pendingTaskCount, 'незавершённая задача', 'незавершённые задачи', 'незавершённых задач')}.`,
      nextStep: {
        title: 'Разобрать открытые задачи',
        description: 'Откройте поездку и закройте или уточните ближайший практический шаг.',
        actionKey: 'finish-task',
      },
      chips: buildSummaryChips(trip, metrics),
    };
  }

  if (metrics.noteCount === 0) {
    return {
      readinessLabel: 'Контекст ещё тонкий',
      readinessTone: 'sky',
      whatMattersNow: 'Структура уже есть, но пока не хватает заметки с trip-specific контекстом.',
      nextStep: {
        title: 'Добавить заметку',
        description: 'Зафиксируйте краткий ориентир: зачем поездка, что важно не забыть, что проверить дальше.',
        actionKey: 'add-note',
      },
      chips: buildSummaryChips(trip, metrics),
    };
  }

  return {
    readinessLabel: 'Есть рабочая структура',
    readinessTone: 'emerald',
    whatMattersNow: 'Поездка уже собрана в минимальный execution context и готова к точечному продвижению.',
    nextStep: {
      title: 'Продолжить refinement',
      description: 'Откройте поездку и посмотрите, какой item или note стоит уточнить следующим.',
      actionKey: 'review-trip',
    },
    chips: buildSummaryChips(trip, metrics),
  };
}

export function deriveExecutionFromDetail(detail: OrganizerTripDetailResponse): OrganizerExecutionState {
  const metrics = metricsFromDetail(detail);

  if (metrics.itemsCount === 0) {
    return {
      readinessLabel: 'Trip ещё пустая',
      readinessTone: 'amber',
      whatMattersNow: 'Поездка пока не наполнена реальными trip items и остаётся слишком тонкой для подготовки.',
      nextStep: {
        title: 'Добавить первый item',
        description: 'Начните с конкретного объекта поездки: жильё, место, рейс, слот или важный ориентир.',
        actionKey: 'add-item',
      },
      chips: buildDetailChips(detail.trip, metrics),
    };
  }

  if (metrics.tasksCount === 0) {
    return {
      readinessLabel: 'Нужен первый практический шаг',
      readinessTone: 'sky',
      whatMattersNow: 'Items уже есть, но поездка ещё не переведена в execution steps.',
      nextStep: {
        title: 'Добавить первую задачу',
        description: 'Сформулируйте ближайшее действие, которое реально двигает поездку вперёд.',
        actionKey: 'add-task',
      },
      chips: buildDetailChips(detail.trip, metrics),
    };
  }

  if (metrics.pendingTaskCount > 0) {
    return {
      readinessLabel: 'Есть открытые шаги',
      readinessTone: 'amber',
      whatMattersNow: `Сейчас важно не потерять ритм: открыто ${metrics.pendingTaskCount} ${pluralizeRu(metrics.pendingTaskCount, 'действие', 'действия', 'действий')}.`,
      nextStep: {
        title: metrics.firstPendingTaskTitle ?? 'Закрыть ближайшую задачу',
        description: 'Разберите первую pending-задачу или отметьте её как выполненную, если шаг уже закрыт.',
        actionKey: 'finish-task',
      },
      chips: buildDetailChips(detail.trip, metrics),
    };
  }

  if (metrics.noteCount === 0) {
    return {
      readinessLabel: 'Контекст ещё тонкий',
      readinessTone: 'sky',
      whatMattersNow: 'Практические шаги уже появились, но без заметки поездке всё ещё не хватает личного контекста.',
      nextStep: {
        title: 'Добавить заметку',
        description: 'Сохраните один ориентир: что важно проверить, какой риск помнить, что ещё уточнить.',
        actionKey: 'add-note',
      },
      chips: buildDetailChips(detail.trip, metrics),
    };
  }

  if (metrics.plannedItemCount > 0) {
    return {
      readinessLabel: 'Есть неподтверждённые items',
      readinessTone: 'amber',
      whatMattersNow: `${metrics.plannedItemCount} ${pluralizeRu(metrics.plannedItemCount, 'item пока только запланирован', 'items пока только запланированы', 'items пока только запланированы')}.`,
      nextStep: {
        title: 'Продвинуть один item',
        description: 'Переведите один planned item в booked или done, если по нему уже есть подтверждение.',
        actionKey: 'review-items',
      },
      chips: buildDetailChips(detail.trip, metrics),
    };
  }

  return {
    readinessLabel: 'Есть рабочая структура',
    readinessTone: 'emerald',
    whatMattersNow: 'Поездка уже выглядит как рабочий execution space: есть структура, контекст и завершённые шаги.',
    nextStep: {
      title: 'Точечно обновить поездку',
      description: 'Проверьте, что ещё стоит уточнить: item, заметку или следующий практический шаг.',
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

export function formatTripTaskStatusLabel(status: OrganizerTripTask['status']): string {
  return status === 'done' ? 'Готово' : 'В работе';
}
