'use client';

import Link from 'next/link';
import { type FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { SpaceLayout } from '@/components/space/Shared';
import {
  createOrganizerTripItem,
  createOrganizerTripNote,
  createOrganizerTripTask,
  deleteOrganizerTripItem,
  fetchOrganizerTripDetail,
  type OrganizerTripDetailResponse,
  type OrganizerTripItemStatus,
  updateOrganizerTripItem,
  updateOrganizerTripTask,
} from '@/components/space/runtime/organizerApi';
import {
  deriveExecutionFromDetail,
  formatTripItemStatusLabel,
  formatTripTaskStatusLabel,
  type OrganizerExecutionActionKey,
  type OrganizerExecutionTone,
} from '@/components/space/runtime/organizerExecution';
import { formatDate, getErrorStatus, isServiceUnavailableStatus } from '@/components/space/runtime/utils';

type DetailState = 'idle' | 'loading' | 'ready' | 'auth-required' | 'unavailable' | 'error' | 'not-found';

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
    return 'Из Space / Saved';
  }
  return `${detail.sourceModule} / ${detail.sourceEntityType}`;
}

function sectionClasses(isPrimary: boolean): string {
  return isPrimary
    ? 'rounded-2xl border border-sky-200 bg-sky-50/40 p-6 shadow-sm ring-1 ring-sky-100'
    : 'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm';
}

export function OrganizerTripDetailPageClient({ tripId }: { tripId: string }) {
  const { isLoaded, isSignedIn } = useUser();
  const [state, setState] = useState<DetailState>('idle');
  const [detail, setDetail] = useState<OrganizerTripDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [itemTitle, setItemTitle] = useState('');
  const [itemNote, setItemNote] = useState('');
  const [itemStatus, setItemStatus] = useState<OrganizerTripItemStatus>('planned');
  const [taskTitle, setTaskTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [pendingAction, setPendingAction] = useState<
    'item' | 'task' | 'note' | `toggle:${string}` | `remove:${string}` | `item-status:${string}` | null
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
  const pendingTasks = useMemo(() => detail?.tasks.filter((task) => task.status === 'pending') ?? [], [detail]);
  const completedTasks = useMemo(() => detail?.tasks.filter((task) => task.status === 'done') ?? [], [detail]);
  const primarySection = useMemo(() => {
    if (!execution) return null;
    if (execution.nextStep.actionKey === 'add-item' || execution.nextStep.actionKey === 'review-items') return 'items';
    if (execution.nextStep.actionKey === 'add-task' || execution.nextStep.actionKey === 'finish-task') return 'tasks';
    if (execution.nextStep.actionKey === 'add-note') return 'notes';
    return null;
  }, [execution]);

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

  async function handleCreateItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!detail || itemTitle.trim().length === 0 || pendingAction) return;

    setPendingAction('item');
    const response = await createOrganizerTripItem(tripId, {
      title: itemTitle.trim(),
      note: itemNote.trim() || null,
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
    setItemStatus('planned');
    setError(null);
  }

  async function handleCreateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!detail || taskTitle.trim().length === 0 || pendingAction) return;

    setPendingAction('task');
    const response = await createOrganizerTripTask(tripId, { title: taskTitle.trim() });
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
    setError(null);
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
  }

  async function handleRemoveItem(itemId: string) {
    if (!detail || pendingAction) return;
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
  }

  async function handleCreateNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!detail || noteBody.trim().length === 0 || pendingAction) return;

    setPendingAction('note');
    const response = await createOrganizerTripNote(tripId, { body: noteBody.trim() });
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
    setError(null);
  }

  return (
    <SpaceLayout>
      <section className="space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Space &gt; Organizer &gt; Trip</div>
              <h1 className="mt-2 text-2xl font-semibold text-slate-900">{detail?.trip.title ?? 'Поездка'}</h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Всё, что уже собрано по поездке: объекты, ближайшие шаги и заметки с контекстом.
              </p>
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
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Контекст поездки</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    {detail.trip.destinationLabel ?? 'Локация пока не уточнена'}
                    {tripWindowLabel(detail.trip) ? ` · ${tripWindowLabel(detail.trip)}` : ''}
                  </p>
                  {detail.trip.summary ? <p className="mt-3 text-sm text-slate-700">{detail.trip.summary}</p> : null}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {execution ? (
                    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${toneClasses(execution.readinessTone)}`}>
                      {execution.readinessLabel}
                    </span>
                  ) : null}
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                    {detail.trip.status}
                  </span>
                </div>
              </div>

              {execution ? (
                <div className={`mt-5 rounded-xl border p-5 ${toneClasses(execution.readinessTone)}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wide opacity-80">Что важно сейчас</div>
                      <div className="mt-2 text-sm font-medium">{execution.whatMattersNow}</div>
                    </div>
                  </div>
                  <div className="mt-4 rounded-xl border border-white/60 bg-white/60 p-4">
                    <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Следующий шаг</div>
                    <div className="mt-2 text-sm font-medium text-slate-900">{execution.nextStep.title}</div>
                    <p className="mt-1 text-sm text-slate-600">{execution.nextStep.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => focusSection(execution.nextStep.actionKey)}
                        className="inline-flex rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
                      >
                        Перейти к следующему шагу
                      </button>
                      {primarySection === 'tasks' && pendingTasks.length > 0 ? (
                        <span className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600">
                          Ближайший шаг: {pendingTasks[0].title}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">Объекты</div>
                  <div className="mt-2 text-2xl font-semibold text-slate-900">{detail.items.length}</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">Открытые шаги</div>
                  <div className="mt-2 text-2xl font-semibold text-slate-900">
                    {detail.tasks.filter((task) => task.status === 'pending').length}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">Заметки</div>
                  <div className="mt-2 text-2xl font-semibold text-slate-900">{detail.notes.length}</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">Собрано</div>
                  <div className="mt-2 text-sm font-medium text-slate-900">
                    {completedTasks.length > 0 ? `${completedTasks.length} шагов закрыто` : 'Пока без закрытых шагов'}
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
            </article>

            {error ? (
              <article className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm">
                {error}
              </article>
            ) : null}

            <div className="grid gap-6 xl:grid-cols-3">
              <article ref={itemsRef} className={sectionClasses(primarySection === 'items')}>
                <h3 className="text-lg font-semibold text-slate-900">Объекты поездки</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Здесь живут места, брони, слоты и другие важные ориентиры поездки.
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
                  <button
                    type="submit"
                    disabled={pendingAction !== null || itemTitle.trim().length === 0}
                    className="inline-flex rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {pendingAction === 'item' ? 'Добавляем...' : 'Добавить объект'}
                  </button>
                </form>
                <div className="mt-5 space-y-3">
                  {detail.items.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                      Пока пусто. Начните с 1-2 реальных элементов поездки.
                    </div>
                  ) : (
                    detail.items.map((item) => (
                      <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
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
                        {item.sourceModule ? (
                          <p className="mt-3 text-xs text-slate-500">
                            Это уберёт объект только из этой поездки. В сохранённом он останется, пока вы не удалите его отдельно.
                          </p>
                        ) : null}
                      </div>
                    ))
                  )}
                </div>
              </article>

              <article ref={tasksRef} className={sectionClasses(primarySection === 'tasks')}>
                <h3 className="text-lg font-semibold text-slate-900">Следующие шаги</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Короткие практические действия, которые помогают двигать поездку вперёд.
                </p>
                <form className="mt-4 space-y-3" onSubmit={handleCreateTask}>
                  <input
                    value={taskTitle}
                    onChange={(event) => setTaskTitle(event.target.value)}
                    placeholder="Например, забронировать отель"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-300"
                  />
                  <button
                    type="submit"
                    disabled={pendingAction !== null || taskTitle.trim().length === 0}
                    className="inline-flex rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {pendingAction === 'task' ? 'Добавляем...' : 'Добавить шаг'}
                  </button>
                </form>
                <div className="mt-5 space-y-3">
                  {detail.tasks.length === 0 ? (
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
                              <div key={task.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
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
                              <div key={task.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <div className="text-sm font-medium text-slate-500 line-through">{task.title}</div>
                                    <div className="mt-1 text-xs text-slate-500">
                                      {task.completedAt ? `Завершено: ${formatDate(task.completedAt)}` : 'Задача закрыта'}
                                    </div>
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
                  Короткие ориентиры, которые помогают не потерять контекст этой поездки.
                </p>
                <form className="mt-4 space-y-3" onSubmit={handleCreateNote}>
                  <textarea
                    value={noteBody}
                    onChange={(event) => setNoteBody(event.target.value)}
                    rows={5}
                    placeholder="Что важно не забыть по этой поездке"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-300"
                  />
                  <button
                    type="submit"
                    disabled={pendingAction !== null || noteBody.trim().length === 0}
                    className="inline-flex rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {pendingAction === 'note' ? 'Сохраняем...' : 'Добавить заметку'}
                  </button>
                </form>
                <div className="mt-5 space-y-3">
                  {detail.notes.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                      Пока нет заметок. Добавьте хотя бы один контекстный ориентир для поездки.
                    </div>
                  ) : (
                    detail.notes.map((note) => (
                      <div key={note.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm text-slate-700">{note.body}</p>
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
