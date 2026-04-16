'use client';

import Link from 'next/link';
import { type FormEvent, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { SpaceLayout } from '@/components/space/Shared';
import {
  createOrganizerTripItem,
  createOrganizerTripNote,
  createOrganizerTripTask,
  deleteOrganizerTripItem,
  fetchOrganizerTripDetail,
  type OrganizerTripDetailResponse,
  updateOrganizerTripTask,
} from '@/components/space/runtime/organizerApi';
import { formatDate, getErrorStatus, isServiceUnavailableStatus } from '@/components/space/runtime/utils';

type DetailState = 'idle' | 'loading' | 'ready' | 'auth-required' | 'unavailable' | 'error' | 'not-found';

function deriveWhatMattersNow(detail: OrganizerTripDetailResponse): string {
  const pendingCount = detail.tasks.filter((task) => task.status === 'pending').length;
  if (detail.items.length === 0) {
    return 'Добавьте первый trip item, чтобы поездка перестала быть пустым контейнером.';
  }
  if (pendingCount > 0) {
    return `Сейчас важно закрыть ${pendingCount} незавершённых задач.`;
  }
  if (detail.notes.length === 0) {
    return 'Добавьте заметку с ключевым контекстом поездки.';
  }
  return 'Базовый trip context уже собран. Можно продолжать точечно наполнять поездку.';
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

export function OrganizerTripDetailPageClient({ tripId }: { tripId: string }) {
  const { isLoaded, isSignedIn } = useUser();
  const [state, setState] = useState<DetailState>('idle');
  const [detail, setDetail] = useState<OrganizerTripDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [itemTitle, setItemTitle] = useState('');
  const [itemNote, setItemNote] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [pendingAction, setPendingAction] = useState<'item' | 'task' | 'note' | `toggle:${string}` | `remove:${string}` | null>(null);

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

  async function handleCreateItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!detail || itemTitle.trim().length === 0 || pendingAction) return;

    setPendingAction('item');
    const response = await createOrganizerTripItem(tripId, {
      title: itemTitle.trim(),
      note: itemNote.trim() || null,
    });
    setPendingAction(null);

    if (!response.data?.item) {
      setError(response.error?.error?.message ?? 'Не удалось добавить trip item.');
      return;
    }

    setDetail({
      ...detail,
      items: [response.data.item, ...detail.items],
      insight: {
        whatMattersNow: deriveWhatMattersNow({
          ...detail,
          items: [response.data.item, ...detail.items],
        }),
      },
    });
    setItemTitle('');
    setItemNote('');
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
      insight: {
        whatMattersNow: deriveWhatMattersNow({
          ...detail,
          tasks: nextTasks,
        }),
      },
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
      insight: {
        whatMattersNow: deriveWhatMattersNow({
          ...detail,
          tasks: nextTasks,
        }),
      },
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
      insight: {
        whatMattersNow: deriveWhatMattersNow(nextDetail),
      },
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
              <h1 className="mt-2 text-2xl font-semibold text-slate-900">Trip detail</h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Минимальная detail surface этого slice: header, trip items, tasks, notes и честный `what matters now`.
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
            <p className="mt-2 text-sm text-slate-600">Подтягиваем реальный trip context без fake itinerary UI.</p>
          </article>
        ) : null}

        {state === 'auth-required' ? (
          <article className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-amber-900">Нужна авторизация</h2>
            <p className="mt-2 text-sm text-amber-800">Trip detail доступен только в авторизованной session.</p>
          </article>
        ) : null}

        {state === 'not-found' || state === 'unavailable' || state === 'error' ? (
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              {state === 'not-found' ? 'Trip не найдена' : state === 'unavailable' ? 'Thin mode' : 'Trip detail недоступен'}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {error ??
                'Organizer runtime временно недоступен. Вместо фальшивой полноты detail surface остаётся честной и bounded.'}
            </p>
          </article>
        ) : null}

        {state === 'ready' && detail ? (
          <>
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{detail.trip.title}</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    {detail.trip.destinationLabel ?? 'Локация пока не уточнена'}
                    {tripWindowLabel(detail.trip) ? ` · ${tripWindowLabel(detail.trip)}` : ''}
                  </p>
                  {detail.trip.summary ? <p className="mt-3 text-sm text-slate-700">{detail.trip.summary}</p> : null}
                </div>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                  {detail.trip.status}
                </span>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">Trip items</div>
                  <div className="mt-2 text-2xl font-semibold text-slate-900">{detail.items.length}</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">Pending tasks</div>
                  <div className="mt-2 text-2xl font-semibold text-slate-900">
                    {detail.tasks.filter((task) => task.status === 'pending').length}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">Notes</div>
                  <div className="mt-2 text-2xl font-semibold text-slate-900">{detail.notes.length}</div>
                </div>
                <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
                  <div className="text-xs uppercase tracking-wide text-sky-700">What matters now</div>
                  <div className="mt-2 text-sm text-sky-900">{detail.insight?.whatMattersNow ?? 'Добавьте первый контекст.'}</div>
                </div>
              </div>

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
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Trip items</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Minimal baseline для мест, слотов или важных элементов поездки. Saved-to-trip intake открыт только узко, для
                  реального baseline из `Space / Saved`, без broad saved import.
                </p>
                <form className="mt-4 space-y-3" onSubmit={handleCreateItem}>
                  <input
                    value={itemTitle}
                    onChange={(event) => setItemTitle(event.target.value)}
                    placeholder="Добавить item"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-300"
                  />
                  <textarea
                    value={itemNote}
                    onChange={(event) => setItemNote(event.target.value)}
                    rows={3}
                    placeholder="Короткое пояснение"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-300"
                  />
                  <button
                    type="submit"
                    disabled={pendingAction !== null || itemTitle.trim().length === 0}
                    className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {pendingAction === 'item' ? 'Добавляем...' : 'Добавить item'}
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
                            {item.sourceModule && item.sourceEntityType && item.sourceEntityId ? (
                              <div className="mt-1 text-xs text-slate-500">
                                Источник: {item.sourceModule} / {item.sourceEntityType} / {item.sourceEntityId}
                              </div>
                            ) : null}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600">
                              {item.status}
                            </span>
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
                        {item.sourceModule ? (
                          <p className="mt-3 text-xs text-slate-500">
                            Это удалит только trip link. Объект останется в `Space / Saved`, пока вы отдельно не уберёте его из сохранённых.
                          </p>
                        ) : null}
                      </div>
                    ))
                  )}
                </div>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Tasks</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Travel-specific задачи без full reminder engine.
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
                    className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {pendingAction === 'task' ? 'Добавляем...' : 'Добавить задачу'}
                  </button>
                </form>
                <div className="mt-5 space-y-3">
                  {detail.tasks.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                      Пока нет задач. Добавьте следующий практический шаг.
                    </div>
                  ) : (
                    detail.tasks.map((task) => {
                      const isTogglePending = pendingAction === `toggle:${task.id}`;
                      return (
                        <div key={task.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className={`text-sm font-medium ${task.status === 'done' ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                                {task.title}
                              </div>
                              <div className="mt-1 text-xs text-slate-500">
                                {task.status === 'done' && task.completedAt
                                  ? `Завершено: ${formatDate(task.completedAt)}`
                                  : 'Ожидает выполнения'}
                              </div>
                            </div>
                            <button
                              type="button"
                              disabled={pendingAction !== null}
                              onClick={() => handleToggleTask(task.id, task.status === 'done' ? 'pending' : 'done')}
                              className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isTogglePending ? '...' : task.status === 'done' ? 'Вернуть' : 'Готово'}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Notes</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Заметки для ключевого trip context, без AI workspace и full planning canvas.
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
                    className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
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
