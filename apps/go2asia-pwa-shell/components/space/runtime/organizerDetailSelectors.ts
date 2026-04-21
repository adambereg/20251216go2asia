import type {
  OrganizerTripDay,
  OrganizerTripDetailResponse,
  OrganizerTripItem,
  OrganizerTripItemNote,
  OrganizerTripNote,
  OrganizerTripTask,
} from './organizerApi';

function sortDateKey(value: string | null): string {
  return value ?? '9999-12-31';
}

function sortTimestamp(value: string | null): string {
  return value ?? '9999-12-31T23:59:59.999Z';
}

export function sortTripTasks(tasks: OrganizerTripTask[]): OrganizerTripTask[] {
  return [...tasks].sort((left, right) => {
    const orderDiff = left.sortOrder - right.sortOrder;
    if (orderDiff !== 0) return orderDiff;
    const dayDiff = sortDateKey(left.dayDate).localeCompare(sortDateKey(right.dayDate));
    if (dayDiff !== 0) return dayDiff;
    return sortTimestamp(left.createdAt).localeCompare(sortTimestamp(right.createdAt));
  });
}

export function sortTripItems(items: OrganizerTripItem[]): OrganizerTripItem[] {
  return [...items].sort((left, right) => {
    if (left.pinned !== right.pinned) return left.pinned ? -1 : 1;
    const dayDiff = sortDateKey(left.dayDate).localeCompare(sortDateKey(right.dayDate));
    if (dayDiff !== 0) return dayDiff;
    const categoryDiff = (left.category ?? '').localeCompare(right.category ?? '', 'ru');
    if (categoryDiff !== 0) return categoryDiff;
    return left.title.localeCompare(right.title, 'ru');
  });
}

export function sortTripNotes(notes: OrganizerTripNote[]): OrganizerTripNote[] {
  return [...notes].sort((left, right) => {
    const dayDiff = sortDateKey(left.dayDate).localeCompare(sortDateKey(right.dayDate));
    if (dayDiff !== 0) return dayDiff;
    return sortTimestamp(right.createdAt).localeCompare(sortTimestamp(left.createdAt));
  });
}

export function groupItemNotesByItemId(itemNotes: OrganizerTripItemNote[]): Record<string, OrganizerTripItemNote[]> {
  return itemNotes
    .slice()
    .sort((left, right) => {
      const orderDiff = left.sortOrder - right.sortOrder;
      if (orderDiff !== 0) return orderDiff;
      return sortTimestamp(left.createdAt).localeCompare(sortTimestamp(right.createdAt));
    })
    .reduce<Record<string, OrganizerTripItemNote[]>>((acc, note) => {
      if (!acc[note.itemId]) acc[note.itemId] = [];
      acc[note.itemId]!.push(note);
      return acc;
    }, {});
}

export function getDayBucket<T extends { dayDate: string | null }>(entries: T[], dayDate: string | null): T[] {
  if (!dayDate) return [];
  return entries.filter((entry) => entry.dayDate === dayDate);
}

export function getTripDayRecord(days: OrganizerTripDay[], dayDate: string | null): OrganizerTripDay | null {
  if (!dayDate) return null;
  return days.find((day) => day.dayDate === dayDate) ?? null;
}

export function buildTripDetailSnapshot(detail: OrganizerTripDetailResponse) {
  const sortedTasks = sortTripTasks(detail.tasks);
  const sortedItems = sortTripItems(detail.items);
  const sortedNotes = sortTripNotes(detail.notes);
  const groupedItemNotes = groupItemNotesByItemId(detail.itemNotes);
  const pinnedItems = sortedItems.filter((item) => item.pinned);
  const dayBoundTasks = sortedTasks.filter((task) => Boolean(task.dayDate));
  const dayBoundItems = sortedItems.filter((item) => Boolean(item.dayDate));
  const pendingTasks = sortedTasks.filter((task) => task.status === 'pending');
  const nextPendingTask = pendingTasks[0] ?? null;
  const upcomingDay = detail.days
    .slice()
    .sort((left, right) => left.sortOrder - right.sortOrder || left.dayDate.localeCompare(right.dayDate))[0] ?? null;
  const topCategories = Array.from(
    new Set(
      pinnedItems
        .map((item) => item.category?.trim())
        .filter((value): value is string => Boolean(value))
    )
  ).slice(0, 2);

  return {
    sortedTasks,
    sortedItems,
    sortedNotes,
    groupedItemNotes,
    pinnedItems,
    dayBoundTasks,
    dayBoundItems,
    pendingTasks,
    nextPendingTask,
    upcomingDay,
    topCategories,
  };
}
