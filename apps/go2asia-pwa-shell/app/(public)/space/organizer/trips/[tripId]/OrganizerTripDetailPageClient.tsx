'use client';

import Link from 'next/link';
import { type FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { SpaceLayout } from '@/components/space/Shared';
import {
  createOrganizerTripItem,
  createOrganizerTripItemNote,
  createOrganizerTripNote,
  createOrganizerTripTask,
  deleteOrganizerTripItem,
  fetchOrganizerTripDetail,
  type OrganizerTripDetailResponse,
  type OrganizerTripItemStatus,
  updateOrganizerTrip,
  updateOrganizerTripItem,
  updateOrganizerTripTask,
} from '@/components/space/runtime/organizerApi';
import {
  buildTripDayAnchors,
  deriveExecutionFromDetail,
  deriveTripBlockers,
  deriveTripDateConfidenceState,
  deriveTripLifecycleState,
  deriveTripReadinessChecks,
  describeTripDuration,
  formatTripItemStatusLabel,
  formatTripStatusLabel,
  formatTripTaskStatusLabel,
  getSuggestedTripDayAnchor,
  type OrganizerExecutionActionKey,
  type OrganizerLifecycleState,
  type OrganizerExecutionTone,
} from '@/components/space/runtime/organizerExecution';
import {
  buildTripDetailSnapshot,
  getDayBucket,
  getTripDayRecord,
} from '@/components/space/runtime/organizerDetailSelectors';
import { formatDate, getErrorStatus, isServiceUnavailableStatus } from '@/components/space/runtime/utils';

type DetailState = 'idle' | 'loading' | 'ready' | 'auth-required' | 'unavailable' | 'error' | 'not-found';

type DetailFeedback = {
  tone: 'success' | 'info';
  message: string;
};

function toneClasses(tone: OrganizerExecutionTone): string {
  if (tone === 'amber') return 'border-amber-200 bg-amber-50 text-amber-900';
  if (tone === 'sky') return 'border-sky-200 bg-sky-50 text-sky-900';
  if (tone === 'emerald') return 'border-emerald-200 bg-emerald-50 text-emerald-900';
  return 'border-slate-200 bg-slate-50 text-slate-800';
}

function tripWindowLabel(detail: OrganizerTripDetailResponse['trip']): string | null {
  if (!detail.startDate && !detail.endDate) return null;
  if (detail.startDate && detail.endDate) {
    return `${new Date(detail.startDate).toLocaleDateString('ru-RU')} - ${new Date(detail.endDate).toLocaleDateString('ru-RU')}`;
  }
  return detail.startDate
    ? `Старт: ${new Date(detail.startDate).toLocaleDateString('ru-RU')}`
    : `Финал: ${new Date(detail.endDate!).toLocaleDateString('ru-RU')}`;
}

function formatSourceLabel(detail: OrganizerTripDetailResponse['items'][number]): string | null {
  if (!detail.sourceModule || !detail.sourceEntityType || !detail.sourceEntityId) return null;
  if (detail.sourceModule === 'space' && detail.sourceEntityType === 'space_post') {
    return 'Добавлено из сохранённых';
  }
  return `${detail.sourceModule} / ${detail.sourceEntityType}`;
}

function toDateInputValue(value: string | null): string {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toISOString().slice(0, 10);
}

function isSavedSourcedItem(detail: OrganizerTripDetailResponse['items'][number]): boolean {
  return detail.sourceModule === 'space' && detail.sourceEntityType === 'space_post';
}

function nextStepButtonLabel(actionKey: OrganizerExecutionActionKey): string {
  if (actionKey === 'add-item' || actionKey === 'review-items') return 'Перейти к объектам';
  if (actionKey === 'add-task' || actionKey === 'finish-task') return 'Перейти к шагам';
  if (actionKey === 'add-note') return 'Перейти к заметкам';
  return 'Открыть следующий шаг';
}

function sectionClasses(isPrimary: boolean): string {
  return isPrimary
    ? 'rounded-2xl border border-sky-200 bg-sky-50/30 p-5 shadow-sm ring-1 ring-sky-100'
    : 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm';
}

function readinessCheckClasses(done: boolean): string {
  return done
    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
    : 'border-slate-200 bg-slate-50 text-slate-700';
}

function getDayContextCopy(params: {
  lifecycle: OrganizerLifecycleState;
  selectedDayLabel: string | null;
  selectedDayIndex: number | null;
  isToday: boolean;
  nextStepTitle: string;
}): { title: string; description: string } {
  const { lifecycle, selectedDayLabel, selectedDayIndex, isToday, nextStepTitle } = params;

  if (!selectedDayLabel || !selectedDayIndex) {
    if (lifecycle.mode === 'post_trip') {
      return {
        title: 'Дневной контекст появится здесь',
        description: 'Когда у поездки есть полное окно, к конкретному дню проще привязать полезные выводы и заметки после поездки.',
      };
    }
    if (lifecycle.mode === 'in_trip') {
      return {
        title: 'Текущий день станет понятнее здесь',
        description: 'Когда полное окно поездки уже задано, сюда удобно выносить спокойный фокус текущего дня без тяжёлого планера.',
      };
    }
    return {
      title: 'Дневной контекст появится после уточнения дат',
      description: 'Когда окно поездки станет полным, здесь будет легче примерять ближайший шаг к конкретному дню.',
    };
  }

  if (lifecycle.mode === 'in_trip') {
    return {
      title: isToday ? `Сегодня, день ${selectedDayIndex}` : `День ${selectedDayIndex} поездки`,
      description: `${selectedDayLabel} можно держать как спокойный ориентир на день. Сейчас главный практический фокус: ${nextStepTitle}.`,
    };
  }

  if (lifecycle.mode === 'post_trip') {
    return {
      title: `День ${selectedDayIndex} как полезная опора`,
      description: `${selectedDayLabel} можно использовать как опорную точку для заметки о том, что сработало и что стоит сохранить на будущее.`,
    };
  }

  return {
    title: `День ${selectedDayIndex} как точка входа`,
    description: `${selectedDayLabel} пока без отдельного плана, и это нормально. На этот день удобно примерять ближайший шаг: ${nextStepTitle}.`,
  };
}

function getVisibleDayAnchors<T extends { iso: string }>(anchors: T[], selectedIso: string | null, maxVisible = 7): T[] {
  if (anchors.length <= maxVisible) return anchors;
  const selectedIndex = Math.max(
    0,
    selectedIso ? anchors.findIndex((anchor) => anchor.iso === selectedIso) : 0
  );
  const safeIndex = selectedIndex >= 0 ? selectedIndex : 0;
  const half = Math.floor(maxVisible / 2);
  const start = Math.max(0, Math.min(safeIndex - half, anchors.length - maxVisible));
  return anchors.slice(start, start + maxVisible);
}

export function OrganizerTripDetailPageClient({ tripId }: { tripId: string }) {
  const { isLoaded, isSignedIn } = useUser();
  const [state, setState] = useState<DetailState>('idle');
  const [detail, setDetail] = useState<OrganizerTripDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<DetailFeedback | null>(null);
  const [itemTitle, setItemTitle] = useState('');
  const [itemNote, setItemNote] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [itemDayDate, setItemDayDate] = useState('');
  const [itemPinned, setItemPinned] = useState(false);
  const [itemStatus, setItemStatus] = useState<OrganizerTripItemStatus>('planned');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDayDate, setTaskDayDate] = useState('');
  const [taskWhyItMatters, setTaskWhyItMatters] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [noteDayDate, setNoteDayDate] = useState('');
  const [noteType, setNoteType] = useState('');
  const [isEditingTripWindow, setIsEditingTripWindow] = useState(false);
  const [tripStartInput, setTripStartInput] = useState('');
  const [tripEndInput, setTripEndInput] = useState('');
  const [tripDatesConfidenceInput, setTripDatesConfidenceInput] = useState<'none' | 'rough' | 'confirmed' | ''>('');
  const [tripLifecycleOverrideInput, setTripLifecycleOverrideInput] = useState<'preparation' | 'in_trip' | 'post_trip' | ''>('');
  const [selectedDayIso, setSelectedDayIso] = useState<string | null>(null);
  const [itemNoteDrafts, setItemNoteDrafts] = useState<Record<string, string>>({});
  const [pendingAction, setPendingAction] = useState<
    | 'item'
    | 'task'
    | 'note'
    | 'trip-window'
    | `toggle:${string}`
    | `remove:${string}`
    | `item-status:${string}`
    | `item-note:${string}`
    | null
  >(null);
  const itemsRef = useRef<HTMLElement | null>(null);
  const tasksRef = useRef<HTMLElement | null>(null);
  const notesRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDetail() {
      if (!isLoaded) {
        setState('loading');
        return;
      }

      if (!isSignedIn) {
        setState('auth-required');
        setDetail(null);
        setError(null);
        return;
      }

      setState('loading');
      setError(null);
      setFeedback(null);

      const response = await fetchOrganizerTripDetail(tripId);
      if (cancelled) return;

      if (response.data) {
        setDetail(response.data);
        setState('ready');
        return;
      }

      const status = getErrorStatus(response.error);
      if (status === 401 || status === 403) {
        setDetail(null);
        setState('auth-required');
        return;
      }
      if (status === 404) {
        setDetail(null);
        setState('not-found');
        setError(response.error?.error?.message ?? 'Trip не найдена.');
        return;
      }
      if (isServiceUnavailableStatus(status)) {
        setDetail(null);
        setState('unavailable');
        setError(response.error?.error?.message ?? 'Organizer runtime временно недоступен.');
        return;
      }

      setDetail(null);
      setState('error');
      setError(response.error?.error?.message ?? `Organizer trip request failed (${status ?? 'unknown'}).`);
    }

    void loadDetail();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, tripId]);

  const execution = useMemo(() => (detail ? deriveExecutionFromDetail(detail) : null), [detail]);
  const detailSnapshot = useMemo(() => (detail ? buildTripDetailSnapshot(detail) : null), [detail]);
  const sortedItems = detailSnapshot?.sortedItems ?? [];
  const sortedTasks = detailSnapshot?.sortedTasks ?? [];
  const sortedNotes = detailSnapshot?.sortedNotes ?? [];
  const itemNotesByItemId = detailSnapshot?.groupedItemNotes ?? {};
  const pendingTasks = useMemo(() => sortedTasks.filter((task) => task.status === 'pending'), [sortedTasks]);
  const completedTasks = useMemo(() => sortedTasks.filter((task) => task.status === 'done'), [sortedTasks]);
  const lifecycle = useMemo(() => (detail ? deriveTripLifecycleState(detail.trip) : null), [detail]);
  const dateConfidence = useMemo(() => (detail ? deriveTripDateConfidenceState(detail.trip) : null), [detail]);
  const tripDuration = useMemo(() => (detail ? describeTripDuration(detail.trip) : null), [detail]);
  const blockers = useMemo(() => (detail ? deriveTripBlockers(detail) : []), [detail]);
  const readinessChecks = useMemo(() => (detail ? deriveTripReadinessChecks(detail) : []), [detail]);
  const dayAnchors = useMemo(() => (detail ? buildTripDayAnchors(detail.trip, detail.days) : []), [detail]);
  const suggestedDay = useMemo(
    () => (detail ? getSuggestedTripDayAnchor(detail.trip, dayAnchors) : null),
    [detail, dayAnchors]
  );
  const selectedDay = useMemo(
    () => dayAnchors.find((anchor) => anchor.iso === selectedDayIso) ?? suggestedDay ?? null,
    [dayAnchors, selectedDayIso, suggestedDay]
  );
  const selectedDayRecord = useMemo(
    () => (detail ? getTripDayRecord(detail.days, selectedDay?.iso ?? null) : null),
    [detail, selectedDay]
  );
  const selectedDayItems = useMemo(() => getDayBucket(sortedItems, selectedDay?.iso ?? null), [selectedDay, sortedItems]);
  const selectedDayTasks = useMemo(() => getDayBucket(sortedTasks, selectedDay?.iso ?? null), [selectedDay, sortedTasks]);
  const selectedDayNotes = useMemo(() => getDayBucket(sortedNotes, selectedDay?.iso ?? null), [selectedDay, sortedNotes]);
  const visibleDayAnchors = useMemo(
    () => getVisibleDayAnchors(dayAnchors, selectedDay?.iso ?? selectedDayIso),
    [dayAnchors, selectedDay, selectedDayIso]
  );
  const dayContextCopy = useMemo(
    () =>
      lifecycle && execution
        ? getDayContextCopy({
            lifecycle,
            selectedDayLabel: selectedDay?.label ?? null,
            selectedDayIndex: selectedDay?.dayIndex ?? null,
            isToday: selectedDay?.isToday ?? false,
            nextStepTitle: execution.nextStep.title,
          })
        : null,
    [execution, lifecycle, selectedDay]
  );
  const primarySection = useMemo(() => {
    if (!execution) return null;
    if (execution.nextStep.actionKey === 'add-item' || execution.nextStep.actionKey === 'review-items') return 'items';
    if (execution.nextStep.actionKey === 'add-task' || execution.nextStep.actionKey === 'finish-task') return 'tasks';
    if (execution.nextStep.actionKey === 'add-note') return 'notes';
    return null;
  }, [execution]);

  useEffect(() => {
    if (!dayAnchors.length) {
      setSelectedDayIso(null);
      return;
    }
    setSelectedDayIso((current) => {
      if (current && dayAnchors.some((anchor) => anchor.iso === current)) return current;
      return suggestedDay?.iso ?? dayAnchors[0]?.iso ?? null;
    });
  }, [dayAnchors, suggestedDay]);

  useEffect(() => {
    if (!detail) return;
    setTripStartInput(toDateInputValue(detail.trip.startDate));
    setTripEndInput(toDateInputValue(detail.trip.endDate));
    setTripDatesConfidenceInput(detail.trip.datesConfidence ?? '');
    setTripLifecycleOverrideInput(detail.trip.lifecycleOverride ?? '');
  }, [detail]);

  function focusSection(actionKey: OrganizerExecutionActionKey) {
    if (actionKey === 'add-item' || actionKey === 'review-items') {
      itemsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (actionKey === 'add-task' || actionKey === 'finish-task') {
      tasksRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (actionKey === 'add-note') {
      notesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSaveTripWindow() {
    if (!detail || pendingAction) return;
    const nextStart = tripStartInput || null;
    const nextEnd = tripEndInput || null;
    if (nextStart && nextEnd && nextStart > nextEnd) {
      setError('Дата начала не может быть позже даты завершения.');
      return;
    }

    setPendingAction('trip-window');
    const response = await updateOrganizerTrip(tripId, {
      startDate: nextStart,
      endDate: nextEnd,
      datesConfidence: tripDatesConfidenceInput || null,
      lifecycleOverride: tripLifecycleOverrideInput || null,
    });
    setPendingAction(null);

    if (!response.data?.trip) {
      setError(response.error?.error?.message ?? 'Не удалось обновить окно поездки.');
      return;
    }

    setDetail((current) => {
      if (!current) return current;
      return {
        ...current,
        trip: response.data!.trip,
      };
    });
    setIsEditingTripWindow(false);
    setError(null);
    setFeedback({
      tone: 'info',
      message: nextStart || nextEnd ? 'Окно поездки обновлено.' : 'Окно поездки очищено. Его можно задать позже.',
    });
  }

  async function handleCreateItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!detail || itemTitle.trim().length === 0 || pendingAction) return;

    setPendingAction('item');
    const response = await createOrganizerTripItem(tripId, {
      title: itemTitle.trim(),
      note: itemNote.trim() || null,
      category: itemCategory.trim() || null,
      dayDate: itemDayDate || null,
      pinned: itemPinned,
      status: itemStatus,
    });
    setPendingAction(null);

    if (!response.data?.item) {
      setError(response.error?.error?.message ?? 'Не удалось добавить trip item.');
      return;
    }

    setDetail({
      ...detail,
      items: [response.data.item, ...detail.items],
      insight: detail.insight,
    });
    setItemTitle('');
    setItemNote('');
    setItemCategory('');
    setItemDayDate('');
    setItemPinned(false);
    setItemStatus('planned');
    setError(null);
    setFeedback({ tone: 'success', message: 'Объект добавлен в поездку.' });
  }

  async function handleCreateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!detail || taskTitle.trim().length === 0 || pendingAction) return;

    setPendingAction('task');
    const response = await createOrganizerTripTask(tripId, {
      title: taskTitle.trim(),
      dayDate: taskDayDate || null,
      whyItMatters: taskWhyItMatters.trim() || null,
      sortOrder: (sortedTasks[sortedTasks.length - 1]?.sortOrder ?? 0) + 10,
    });
    setPendingAction(null);

    if (!response.data?.task) {
      setError(response.error?.error?.message ?? 'Не удалось добавить задачу.');
      return;
    }

    const nextTasks = [response.data.task, ...detail.tasks];
    setDetail({
      ...detail,
      tasks: nextTasks,
      insight: detail.insight,
    });
    setTaskTitle('');
    setTaskDayDate('');
    setTaskWhyItMatters('');
    setError(null);
    setFeedback({ tone: 'success', message: 'Следующий шаг добавлен.' });
  }

  async function handleToggleTask(taskId: string, nextStatus: 'pending' | 'done') {
    if (!detail || pendingAction) return;
    setPendingAction(`toggle:${taskId}`);
    const response = await updateOrganizerTripTask(tripId, taskId, { status: nextStatus });
    setPendingAction(null);

    if (!response.data?.task) {
      setError(response.error?.error?.message ?? 'Не удалось обновить задачу.');
      return;
    }

    const nextTasks = detail.tasks.map((task) => (task.id === taskId ? response.data!.task : task));
    setDetail({
      ...detail,
      tasks: nextTasks,
      insight: detail.insight,
    });
    setError(null);
    setFeedback({
      tone: 'info',
      message: nextStatus === 'done' ? 'Шаг отмечен как выполненный.' : 'Шаг снова открыт и вернулся в работу.',
    });
  }

  async function handleUpdateItemStatus(itemId: string, nextStatus: OrganizerTripItemStatus) {
    if (!detail || pendingAction) return;
    setPendingAction(`item-status:${itemId}`);
    const response = await updateOrganizerTripItem(tripId, itemId, { status: nextStatus });
    setPendingAction(null);

    if (!response.data?.item) {
      setError(response.error?.error?.message ?? 'Не удалось обновить статус item.');
      return;
    }

    setDetail({
      ...detail,
      items: detail.items.map((item) => (item.id === itemId ? response.data!.item : item)),
      insight: detail.insight,
    });
    setError(null);
    setFeedback({ tone: 'info', message: `Статус объекта: ${formatTripItemStatusLabel(nextStatus)}.` });
  }

  async function handleRemoveItem(itemId: string) {
    if (!detail || pendingAction) return;
    const removedItem = detail.items.find((item) => item.id === itemId) ?? null;
    setPendingAction(`remove:${itemId}`);
    const response = await deleteOrganizerTripItem(tripId, itemId);
    setPendingAction(null);

    if (!response.data?.removed) {
      setError(response.error?.error?.message ?? 'Не удалось убрать item из поездки.');
      return;
    }

    const nextDetail = {
      ...detail,
      items: detail.items.filter((item) => item.id !== itemId),
    };
    setDetail({
      ...nextDetail,
      insight: detail.insight,
    });
    setError(null);
    setFeedback({
      tone: removedItem && isSavedSourcedItem(removedItem) ? 'info' : 'success',
      message:
        removedItem && isSavedSourcedItem(removedItem)
          ? 'Объект убран только из этой поездки. В сохранённых он по-прежнему остаётся.'
          : 'Объект убран из поездки.',
    });
  }

  async function handleCreateNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!detail || noteBody.trim().length === 0 || pendingAction) return;

    setPendingAction('note');
    const response = await createOrganizerTripNote(tripId, {
      body: noteBody.trim(),
      dayDate: noteDayDate || null,
      noteType: noteType.trim() || null,
    });
    setPendingAction(null);

    if (!response.data?.note) {
      setError(response.error?.error?.message ?? 'Не удалось добавить заметку.');
      return;
    }

    setDetail({
      ...detail,
      notes: [response.data.note, ...detail.notes],
      insight: detail.insight,
    });
    setNoteBody('');
    setNoteDayDate('');
    setNoteType('');
    setError(null);
    setFeedback({ tone: 'success', message: 'Заметка добавлена. Контекст поездки стал полнее.' });
  }

  async function handleCreateItemNote(itemId: string) {
    const draft = itemNoteDrafts[itemId]?.trim();
    if (!detail || !draft || pendingAction) return;

    setPendingAction(`item-note:${itemId}`);
    const currentNotes = itemNotesByItemId[itemId] ?? [];
    const response = await createOrganizerTripItemNote(tripId, itemId, {
      body: draft,
      sortOrder: (currentNotes[currentNotes.length - 1]?.sortOrder ?? 0) + 10,
    });
    setPendingAction(null);

    if (!response.data?.itemNote) {
      setError(response.error?.error?.message ?? 'Не удалось добавить заметку к объекту.');
      return;
    }

    setDetail({
      ...detail,
      itemNotes: [...detail.itemNotes, response.data.itemNote],
      insight: detail.insight,
    });
    setItemNoteDrafts((current) => ({ ...current, [itemId]: '' }));
    setError(null);
    setFeedback({ tone: 'success', message: 'К объекту добавлена отдельная заметка.' });
  }

  const savedSourcedCount = useMemo(
    () => detail?.items.filter((item) => isSavedSourcedItem(item)).length ?? 0,
    [detail]
  );

  return (
    <SpaceLayout>
      <section className="space-y-6 pb-10">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Space &gt; Organizer &gt; Поездка</div>
              <h1 className="mt-2 text-2xl font-semibold text-slate-900">{detail?.trip.title ?? 'Поездка'}</h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">Спокойный рабочий контекст поездки: время, день и ближайший полезный шаг.</p>
            </div>
            <Link
              href="/space/organizer"
              className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Назад к Organizer
            </Link>
          </div>
        </header>

        {!isLoaded || state === 'loading' ? (
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Загрузка поездки</h2>
            <p className="mt-2 text-sm text-slate-600">Собираем объекты, шаги и заметки по этой поездке.</p>
          </article>
        ) : null}

        {state === 'auth-required' ? (
          <article className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-amber-900">Нужна авторизация</h2>
            <p className="mt-2 text-sm text-amber-800">Поездка доступна только после входа в аккаунт.</p>
          </article>
        ) : null}

        {state === 'not-found' || state === 'unavailable' || state === 'error' ? (
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              {state === 'not-found' ? 'Поездка не найдена' : state === 'unavailable' ? 'Поездка пока недоступна' : 'Поездка временно недоступна'}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {error ?? 'Сейчас не удаётся открыть поездку. Попробуйте ещё раз немного позже.'}
            </p>
          </article>
        ) : null}

        {state === 'ready' && detail ? (
          <>
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Контекст поездки</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    {detail.trip.destinationLabel ?? 'Локация пока не уточнена'}
                    {tripWindowLabel(detail.trip) ? ` · ${tripWindowLabel(detail.trip)}` : ''}
                  </p>
                  {detail.trip.summary ? <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-700">{detail.trip.summary}</p> : null}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {execution ? (
                    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${toneClasses(execution.readinessTone)}`}>
                      {execution.readinessLabel}
                    </span>
                  ) : null}
                  {execution ? (
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                      {execution.progressLabel}
                    </span>
                  ) : null}
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                    {formatTripStatusLabel(detail.trip.status)}
                  </span>
                </div>
              </div>

              {lifecycle && dateConfidence ? (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Время поездки</div>
                      <div className="mt-2 text-base font-semibold text-slate-900">
                        {tripWindowLabel(detail.trip) ?? 'Даты поездки пока не заданы'}
                      </div>
                      <p className="mt-2 max-w-2xl text-sm text-slate-600">
                        {lifecycle.hint} {dateConfidence.hint}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <span className={`rounded-full border px-3 py-1 text-xs font-medium ${toneClasses(lifecycle.tone)}`}>
                          {lifecycle.label}
                        </span>
                        <span className={`rounded-full border px-3 py-1 text-xs font-medium ${toneClasses(dateConfidence.tone)}`}>
                          {dateConfidence.label}
                        </span>
                        {tripDuration ? (
                          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                            {tripDuration}
                          </span>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setTripStartInput(toDateInputValue(detail.trip.startDate));
                          setTripEndInput(toDateInputValue(detail.trip.endDate));
                          setTripDatesConfidenceInput(detail.trip.datesConfidence ?? '');
                          setTripLifecycleOverrideInput(detail.trip.lifecycleOverride ?? '');
                          setIsEditingTripWindow((current) => !current);
                        }}
                        className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        {isEditingTripWindow ? 'Свернуть редактирование' : tripWindowLabel(detail.trip) ? 'Изменить даты' : 'Задать даты'}
                      </button>
                    </div>
                  </div>

                  {isEditingTripWindow ? (
                    <div className="mt-4 rounded-xl border border-white/70 bg-white p-4">
                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <label className="block">
                          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Начало</span>
                          <input
                            type="date"
                            value={tripStartInput}
                            onChange={(event) => setTripStartInput(event.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-sky-300"
                          />
                        </label>
                        <label className="block">
                          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Завершение</span>
                          <input
                            type="date"
                            value={tripEndInput}
                            onChange={(event) => setTripEndInput(event.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-sky-300"
                          />
                        </label>
                        <label className="block">
                          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Уверенность в датах</span>
                          <select
                            value={tripDatesConfidenceInput}
                            onChange={(event) => setTripDatesConfidenceInput(event.target.value as typeof tripDatesConfidenceInput)}
                            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-sky-300"
                          >
                            <option value="">Без явной оценки</option>
                            <option value="none">Даты не заданы</option>
                            <option value="rough">Даты примерные</option>
                            <option value="confirmed">Даты подтверждены</option>
                          </select>
                        </label>
                        <label className="block">
                          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Lifecycle override</span>
                          <select
                            value={tripLifecycleOverrideInput}
                            onChange={(event) => setTripLifecycleOverrideInput(event.target.value as typeof tripLifecycleOverrideInput)}
                            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-sky-300"
                          >
                            <option value="">Авто по датам</option>
                            <option value="preparation">Подготовка</option>
                            <option value="in_trip">В поездке</option>
                            <option value="post_trip">После поездки</option>
                          </select>
                        </label>
                      </div>
                      <div className="mt-4 flex flex-wrap justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setTripStartInput(toDateInputValue(detail.trip.startDate));
                            setTripEndInput(toDateInputValue(detail.trip.endDate));
                            setTripDatesConfidenceInput(detail.trip.datesConfidence ?? '');
                            setTripLifecycleOverrideInput(detail.trip.lifecycleOverride ?? '');
                            setIsEditingTripWindow(false);
                          }}
                          className="inline-flex rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
                        >
                          Отмена
                        </button>
                        <button
                          type="button"
                          disabled={pendingAction !== null}
                          onClick={() => void handleSaveTripWindow()}
                          className="inline-flex rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                          {pendingAction === 'trip-window' ? 'Сохраняем...' : 'Сохранить окно поездки'}
                        </button>
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-xl border border-white/70 bg-white/90 p-4">
                      <div className="text-xs uppercase tracking-wide text-slate-500">Режим</div>
                      <div className="mt-2 text-sm font-medium text-slate-900">{lifecycle.label}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        {lifecycle.mode === 'preparation'
                          ? 'Собрать поездку без перегрузки.'
                          : lifecycle.mode === 'in_trip'
                            ? 'Не потерять текущее важное.'
                            : 'Сохранить практическую пользу.'}
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/70 bg-white/90 p-4">
                      <div className="text-xs uppercase tracking-wide text-slate-500">Окно поездки</div>
                      <div className="mt-2 text-sm font-medium text-slate-900">
                        {tripWindowLabel(detail.trip) ?? 'Пока не задано'}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">{dateConfidence.label}</div>
                    </div>
                    <div className="rounded-xl border border-white/70 bg-white/90 p-4">
                      <div className="text-xs uppercase tracking-wide text-slate-500">Что важно сейчас</div>
                      <div className="mt-2 text-sm font-medium text-slate-900">{execution?.whatMattersNow ?? 'Без оценки'}</div>
                    </div>
                    <div className="rounded-xl border border-white/70 bg-white/90 p-4">
                      <div className="text-xs uppercase tracking-wide text-slate-500">Следующий шаг</div>
                      <div className="mt-2 text-sm font-medium text-slate-900">{execution?.nextStep.title ?? 'Пока не задан'}</div>
                      <button
                        type="button"
                        onClick={() => execution && focusSection(execution.nextStep.actionKey)}
                        className="mt-3 inline-flex rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        {execution ? nextStepButtonLabel(execution.nextStep.actionKey) : 'Открыть'}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-white/70 bg-white p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Фокус дня</div>
                        <div className="mt-2 text-sm font-medium text-slate-900">{dayContextCopy?.title ?? 'День пока не выбран'}</div>
                        <p className="mt-1 text-sm text-slate-600">{dayContextCopy?.description}</p>
                      </div>
                      {selectedDay ? (
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                          {selectedDay.shortLabel}
                        </span>
                      ) : null}
                    </div>
                    {selectedDayRecord ? (
                      <div className="mt-4 grid gap-3 md:grid-cols-3">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Тема дня</div>
                          <div className="mt-2 text-sm font-medium text-slate-900">{selectedDayRecord.theme ?? 'Пока без темы'}</div>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Главный фокус</div>
                          <div className="mt-2 text-sm font-medium text-slate-900">{selectedDayRecord.focus ?? 'Пока без фокуса'}</div>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Что уже привязано</div>
                          <div className="mt-2 text-sm font-medium text-slate-900">
                            {selectedDayItems.length} объектов · {selectedDayTasks.length} шагов · {selectedDayNotes.length} заметок
                          </div>
                        </div>
                      </div>
                    ) : null}
                    {selectedDayRecord?.plannedHighlights ? (
                      <div className="mt-3 rounded-xl border border-sky-100 bg-sky-50/70 px-4 py-3 text-sm text-slate-700">
                        {selectedDayRecord.plannedHighlights}
                      </div>
                    ) : null}
                    {visibleDayAnchors.length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {visibleDayAnchors.map((anchor) => {
                          const isActive = selectedDay?.iso === anchor.iso;
                          return (
                            <button
                              key={anchor.iso}
                              type="button"
                              onClick={() => setSelectedDayIso(anchor.iso)}
                              className={`rounded-xl border px-3 py-2 text-left text-xs transition ${
                                isActive
                                  ? 'border-sky-300 bg-sky-50 text-sky-900'
                                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <div className="font-medium">{anchor.weekdayLabel}</div>
                              <div className="mt-0.5">{anchor.shortLabel}</div>
                              <div className="mt-1 text-[11px] opacity-80">День {anchor.dayIndex}</div>
                              {anchor.focus ? <div className="mt-1 max-w-[140px] truncate text-[11px] opacity-80">{anchor.focus}</div> : null}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                        Когда окно поездки станет понятнее, здесь появится лёгкий вход в контекст выбранного дня без
                        отдельного day planner.
                      </div>
                    )}
                  </div>
                </div>
              ) : null}

              {execution ? (
                <div className={`mt-4 rounded-xl border p-4 ${toneClasses(execution.readinessTone)}`}>
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wide opacity-80">{execution.progressLabel}</div>
                      <div className="mt-2 text-sm font-medium">{execution.whatMattersNow}</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => focusSection(execution.nextStep.actionKey)}
                        className="inline-flex rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
                      >
                        {nextStepButtonLabel(execution.nextStep.actionKey)}
                      </button>
                      {primarySection === 'tasks' && pendingTasks.length > 0 ? (
                        <span className="inline-flex rounded-md border border-white/70 bg-white/70 px-3 py-1.5 text-xs text-slate-700">
                          Ближайший шаг: {pendingTasks[0].title}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="mt-5 grid gap-4 xl:grid-cols-[1.2fr,0.8fr]">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Уже собрано</div>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {readinessChecks.map((check) => (
                      <div key={check.id} className={`rounded-xl border p-4 ${readinessCheckClasses(check.done)}`}>
                        <div className="text-sm font-medium">{check.label}</div>
                        <div className="mt-1 text-xs opacity-80">{check.hint}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Что ещё хрупко</div>
                  <div className="mt-3 space-y-3">
                    {blockers.length > 0 ? (
                      blockers.map((blocker) => (
                        <div key={blocker.id} className={`rounded-xl border p-4 ${toneClasses(blocker.tone)}`}>
                          <div className="text-sm font-medium">{blocker.title}</div>
                          <p className="mt-1 text-xs opacity-80">{blocker.description}</p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                        У поездки уже есть уверенная база: время, контекст и следующий шаг читаются спокойно и без явных
                        хрупких мест.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">Объекты</div>
                  <div className="mt-2 text-2xl font-semibold text-slate-900">{sortedItems.length}</div>
                  <div className="mt-2 text-xs text-slate-500">{detailSnapshot?.pinnedItems.length ?? 0} закреплено</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">Открытые шаги</div>
                  <div className="mt-2 text-2xl font-semibold text-slate-900">{pendingTasks.length}</div>
                  <div className="mt-2 text-xs text-slate-500">{detailSnapshot?.dayBoundTasks.length ?? 0} привязано к дню</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">Заметки</div>
                  <div className="mt-2 text-2xl font-semibold text-slate-900">{sortedNotes.length}</div>
                  <div className="mt-2 text-xs text-slate-500">{detail.itemNotes.length} заметок к объектам</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">Фаза поездки</div>
                  <div className="mt-2 text-sm font-medium text-slate-900">{lifecycle?.label ?? execution?.progressLabel ?? 'Без оценки'}</div>
                  <div className="mt-2 text-xs text-slate-500">
                    {completedTasks.length > 0
                      ? `${completedTasks.length} шагов уже закрыто`
                      : lifecycle?.mode === 'post_trip'
                        ? 'Можно зафиксировать выводы и полезные заметки'
                        : 'Пока без закрытых шагов'}
                  </div>
                </div>
              </div>
              {execution ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {execution.chips.map((chip) => (
                    <span key={chip.label} className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${toneClasses(chip.tone)}`}>
                      {chip.label}
                    </span>
                  ))}
                </div>
              ) : null}

              {detail.trip.updatedAt ? (
                <div className="mt-4 text-xs text-slate-500">Обновлено: {formatDate(detail.trip.updatedAt)}</div>
              ) : null}
              {savedSourcedCount > 0 ? (
                <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
                  {savedSourcedCount} {savedSourcedCount === 1 ? 'объект добавлен' : savedSourcedCount < 5 ? 'объекта добавлены' : 'объектов добавлено'} из сохранённых.
                  Они живут в контексте этой поездки отдельно, но сами посты остаются в разделе «Сохранённые».
                </div>
              ) : null}
            </article>

            {error ? (
              <article className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm">
                {error}
              </article>
            ) : null}
            {feedback ? (
              <article
                className={`rounded-2xl p-4 text-sm shadow-sm ${
                  feedback.tone === 'success'
                    ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border border-sky-200 bg-sky-50 text-sky-800'
                }`}
              >
                {feedback.message}
              </article>
            ) : null}

            {selectedDay ? (
              <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Контент выбранного дня</div>
                    <div className="mt-2 text-base font-semibold text-slate-900">{selectedDay.label}</div>
                    <p className="mt-1 text-sm text-slate-600">
                      Здесь видно, что уже честно привязано к дню внутри поездки: объекты, шаги и заметки.
                    </p>
                  </div>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                    {selectedDayItems.length} объектов · {selectedDayTasks.length} шагов · {selectedDayNotes.length} заметок
                  </span>
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                    <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Объекты дня</div>
                    <div className="mt-3 space-y-2">
                      {selectedDayItems.length > 0 ? (
                        selectedDayItems.map((item) => (
                          <div key={item.id} className="text-sm text-slate-700">
                            <span className="font-medium text-slate-900">{item.title}</span>
                            {item.category ? <span className="text-slate-500"> · {item.category}</span> : null}
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-slate-500">Пока ничего не привязано.</div>
                      )}
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                    <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Шаги дня</div>
                    <div className="mt-3 space-y-2">
                      {selectedDayTasks.length > 0 ? (
                        selectedDayTasks.map((task) => (
                          <div key={task.id} className="text-sm text-slate-700">
                            <span className="font-medium text-slate-900">{task.title}</span>
                            {task.whyItMatters ? <div className="mt-1 text-xs text-slate-500">{task.whyItMatters}</div> : null}
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-slate-500">Пока без шагов на этот день.</div>
                      )}
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                    <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Заметки дня</div>
                    <div className="mt-3 space-y-2">
                      {selectedDayNotes.length > 0 ? (
                        selectedDayNotes.map((note) => (
                          <div key={note.id} className="text-sm text-slate-700">
                            {note.body}
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-slate-500">Пока без заметок на этот день.</div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ) : null}

            <div className="grid gap-5 xl:grid-cols-3">
              <article ref={itemsRef} className={sectionClasses(primarySection === 'items')}>
                <h3 className="text-lg font-semibold text-slate-900">Объекты поездки</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Здесь живут места, брони и другие ориентиры поездки. Всё, что пришло из сохранённых, остаётся
                  понятным по происхождению и не смешивается с глобальным Saved.
                </p>
                <form className="mt-4 space-y-3" onSubmit={handleCreateItem}>
                  <input
                    value={itemTitle}
                    onChange={(event) => setItemTitle(event.target.value)}
                    placeholder="Например, отель или район"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-300"
                  />
                  <textarea
                    value={itemNote}
                    onChange={(event) => setItemNote(event.target.value)}
                    rows={3}
                    placeholder="Короткая пометка"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-300"
                  />
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="block">
                      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Категория</span>
                      <input
                        value={itemCategory}
                        onChange={(event) => setItemCategory(event.target.value)}
                        placeholder="Например, stay / food / area"
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-300"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">День поездки</span>
                      <input
                        type="date"
                        value={itemDayDate}
                        onChange={(event) => setItemDayDate(event.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-sky-300"
                      />
                    </label>
                  </div>
                  <label className="block">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Статус</span>
                    <select
                      value={itemStatus}
                      onChange={(event) => setItemStatus(event.target.value as OrganizerTripItemStatus)}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-sky-300"
                    >
                      <option value="planned">Запланировано</option>
                      <option value="booked">Подтверждено</option>
                      <option value="done">Готово</option>
                    </select>
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={itemPinned}
                      onChange={(event) => setItemPinned(event.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-400"
                    />
                    Закрепить как полезную опору для поездки
                  </label>
                  <button
                    type="submit"
                    disabled={pendingAction !== null || itemTitle.trim().length === 0}
                    className="inline-flex rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {pendingAction === 'item' ? 'Добавляем...' : 'Добавить объект'}
                  </button>
                </form>
                <div className="mt-5 space-y-3">
                  {sortedItems.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                      Пока пусто. Начните с 1-2 реальных элементов поездки.
                    </div>
                  ) : (
                    sortedItems.map((item) => (
                      <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-medium text-slate-900">{item.title}</div>
                            {formatSourceLabel(item) ? <div className="mt-1 text-xs text-slate-500">{formatSourceLabel(item)}</div> : null}
                          </div>
                          <div className="flex items-center gap-2">
                            <select
                              value={item.status}
                              disabled={pendingAction !== null}
                              onChange={(event) => void handleUpdateItemStatus(item.id, event.target.value as OrganizerTripItemStatus)}
                              className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <option value="planned">Запланировано</option>
                              <option value="booked">Подтверждено</option>
                              <option value="done">Готово</option>
                            </select>
                            <button
                              type="button"
                              disabled={pendingAction !== null}
                              onClick={() => void handleRemoveItem(item.id)}
                              className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {pendingAction === `remove:${item.id}` ? 'Убираем...' : 'Убрать из поездки'}
                            </button>
                          </div>
                        </div>
                        {item.note ? <p className="mt-2 text-sm text-slate-600">{item.note}</p> : null}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.category ? (
                            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-600">
                              {item.category}
                            </span>
                          ) : null}
                          {item.dayDate ? (
                            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-600">
                              {item.dayDate}
                            </span>
                          ) : null}
                          {item.pinned ? (
                            <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-800">
                              Закреплено
                            </span>
                          ) : null}
                          {isSavedSourcedItem(item) ? (
                            <>
                              <span className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] font-medium text-sky-700">
                                Из сохранённых
                              </span>
                              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-600">
                                Сохранено отдельно
                              </span>
                            </>
                          ) : null}
                          <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                            item.status === 'done'
                              ? toneClasses('emerald')
                              : item.status === 'booked'
                                ? toneClasses('sky')
                                : toneClasses('amber')
                          }`}>
                            {formatTripItemStatusLabel(item.status)}
                          </span>
                          {pendingAction === `item-status:${item.id}` ? (
                            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-500">
                              Обновляем статус...
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-4 rounded-xl border border-white/80 bg-white/90 p-4">
                          <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Заметки к объекту</div>
                          <div className="mt-3 space-y-2">
                            {(itemNotesByItemId[item.id] ?? []).length > 0 ? (
                              (itemNotesByItemId[item.id] ?? []).map((itemNote) => (
                                <div key={itemNote.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                                  {itemNote.body}
                                </div>
                              ))
                            ) : (
                              <div className="text-sm text-slate-500">Пока без отдельных заметок к этому объекту.</div>
                            )}
                          </div>
                          <div className="mt-3 space-y-2">
                            <textarea
                              value={itemNoteDrafts[item.id] ?? ''}
                              onChange={(event) =>
                                setItemNoteDrafts((current) => ({
                                  ...current,
                                  [item.id]: event.target.value,
                                }))
                              }
                              rows={2}
                              placeholder="Что важно помнить именно по этому объекту"
                              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-300"
                            />
                            <button
                              type="button"
                              disabled={pendingAction !== null || !(itemNoteDrafts[item.id] ?? '').trim()}
                              onClick={() => void handleCreateItemNote(item.id)}
                              className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {pendingAction === `item-note:${item.id}` ? 'Сохраняем...' : 'Добавить заметку к объекту'}
                            </button>
                          </div>
                        </div>
                        {isSavedSourcedItem(item) ? (
                          <p className="mt-3 text-xs text-slate-500">
                            Если убрать этот объект из поездки, он всё равно останется в «Сохранённых». Это отдельные
                            действия.
                          </p>
                        ) : item.sourceModule ? <p className="mt-3 text-xs text-slate-500">Источник объекта сохранён отдельно от статуса поездки.</p> : null}
                      </div>
                    ))
                  )}
                </div>
              </article>

              <article ref={tasksRef} className={sectionClasses(primarySection === 'tasks')}>
                <h3 className="text-lg font-semibold text-slate-900">Следующие шаги</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Короткие практические действия, которые помогают двигать поездку вперёд без перегрузки.
                </p>
                <form className="mt-4 space-y-3" onSubmit={handleCreateTask}>
                  <input
                    value={taskTitle}
                    onChange={(event) => setTaskTitle(event.target.value)}
                    placeholder="Например, забронировать отель"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-300"
                  />
                  <textarea
                    value={taskWhyItMatters}
                    onChange={(event) => setTaskWhyItMatters(event.target.value)}
                    rows={2}
                    placeholder="Почему этот шаг важен именно сейчас"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-300"
                  />
                  <label className="block">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Привязать к дню</span>
                    <input
                      type="date"
                      value={taskDayDate}
                      onChange={(event) => setTaskDayDate(event.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-sky-300"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={pendingAction !== null || taskTitle.trim().length === 0}
                    className="inline-flex rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {pendingAction === 'task' ? 'Добавляем...' : 'Добавить шаг'}
                  </button>
                </form>
                <div className="mt-5 space-y-3">
                  {sortedTasks.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                      Пока нет задач. Добавьте следующий практический шаг.
                    </div>
                  ) : (
                    <>
                      {pendingTasks.length > 0 ? (
                        <div className="space-y-3">
                          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Открытые шаги</div>
                          {pendingTasks.map((task, index) => {
                            const isTogglePending = pendingAction === `toggle:${task.id}`;
                            return (
                              <div key={task.id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                      <div className="text-sm font-medium text-slate-900">{task.title}</div>
                                      {index === 0 ? (
                                        <span className="rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700">
                                          Сейчас
                                        </span>
                                      ) : null}
                                    </div>
                                    <div className="mt-1 text-xs text-slate-500">{formatTripTaskStatusLabel(task.status)}</div>
                                    {task.dayDate ? <div className="mt-1 text-xs text-slate-500">День: {task.dayDate}</div> : null}
                                    {task.whyItMatters ? <div className="mt-2 text-sm text-slate-600">{task.whyItMatters}</div> : null}
                                  </div>
                                  <button
                                    type="button"
                                    disabled={pendingAction !== null}
                                    onClick={() => handleToggleTask(task.id, 'done')}
                                    className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    {isTogglePending ? '...' : 'Готово'}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : null}

                      {completedTasks.length > 0 ? (
                        <div className="space-y-3 pt-2">
                          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Завершённые</div>
                          {completedTasks.map((task) => {
                            const isTogglePending = pendingAction === `toggle:${task.id}`;
                            return (
                              <div key={task.id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <div className="text-sm font-medium text-slate-500 line-through">{task.title}</div>
                                    <div className="mt-1 text-xs text-slate-500">
                                      {task.completedAt ? `Завершено: ${formatDate(task.completedAt)}` : 'Задача закрыта'}
                                    </div>
                                    {task.dayDate ? <div className="mt-1 text-xs text-slate-500">День: {task.dayDate}</div> : null}
                                    {task.whyItMatters ? <div className="mt-2 text-sm text-slate-600">{task.whyItMatters}</div> : null}
                                  </div>
                                  <button
                                    type="button"
                                    disabled={pendingAction !== null}
                                    onClick={() => handleToggleTask(task.id, 'pending')}
                                    className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    {isTogglePending ? '...' : 'Вернуть'}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : null}
                    </>
                  )}
                </div>
              </article>

              <article ref={notesRef} className={sectionClasses(primarySection === 'notes')}>
                <h3 className="text-lg font-semibold text-slate-900">Заметки по поездке</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Короткие ориентиры, которые помогают не потерять контекст и спокойнее возвращаться к поездке.
                </p>
                <form className="mt-4 space-y-3" onSubmit={handleCreateNote}>
                  <textarea
                    value={noteBody}
                    onChange={(event) => setNoteBody(event.target.value)}
                    rows={5}
                    placeholder="Что важно не забыть по этой поездке"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-300"
                  />
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="block">
                      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">День поездки</span>
                      <input
                        type="date"
                        value={noteDayDate}
                        onChange={(event) => setNoteDayDate(event.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-sky-300"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Тип заметки</span>
                      <input
                        value={noteType}
                        onChange={(event) => setNoteType(event.target.value)}
                        placeholder="Например, reminder / recap"
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-300"
                      />
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={pendingAction !== null || noteBody.trim().length === 0}
                    className="inline-flex rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {pendingAction === 'note' ? 'Сохраняем...' : 'Добавить заметку'}
                  </button>
                </form>
                <div className="mt-5 space-y-3">
                  {sortedNotes.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                      Пока нет заметок. Добавьте хотя бы один контекстный ориентир для поездки.
                    </div>
                  ) : (
                    sortedNotes.map((note) => (
                      <div key={note.id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                        <p className="text-sm text-slate-700">{note.body}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {note.dayDate ? (
                            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-600">
                              {note.dayDate}
                            </span>
                          ) : null}
                          {note.noteType ? (
                            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-600">
                              {note.noteType}
                            </span>
                          ) : null}
                        </div>
                        {note.createdAt ? <div className="mt-2 text-xs text-slate-500">{formatDate(note.createdAt)}</div> : null}
                      </div>
                    ))
                  )}
                </div>
              </article>
            </div>
          </>
        ) : null}
      </section>
    </SpaceLayout>
  );
}
