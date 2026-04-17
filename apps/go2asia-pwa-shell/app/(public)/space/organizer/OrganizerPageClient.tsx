'use client';

import Link from 'next/link';
import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { SpaceLayout } from '@/components/space/Shared';
import {
  createOrganizerTrip,
  fetchOrganizerTrips,
  type OrganizerTripSummary,
} from '@/components/space/runtime/organizerApi';
import { deriveExecutionFromSummary, type OrganizerExecutionTone } from '@/components/space/runtime/organizerExecution';
import { useSpaceSavedReactions } from '@/components/space/runtime/useSpaceSavedReactions';
import { formatDate, getErrorStatus, isServiceUnavailableStatus } from '@/components/space/runtime/utils';

type OrganizerHomeState = 'idle' | 'loading' | 'ready' | 'auth-required' | 'unavailable' | 'error';

function formatTripWindow(trip: OrganizerTripSummary): string | null {
  if (!trip.startDate && !trip.endDate) return null;
  if (trip.startDate && trip.endDate) {
    return `${new Date(trip.startDate).toLocaleDateString('ru-RU')} - ${new Date(trip.endDate).toLocaleDateString('ru-RU')}`;
  }
  return trip.startDate
    ? `Старт: ${new Date(trip.startDate).toLocaleDateString('ru-RU')}`
    : `Финал: ${new Date(trip.endDate!).toLocaleDateString('ru-RU')}`;
}

function toneClasses(tone: OrganizerExecutionTone): string {
  if (tone === 'amber') return 'border-amber-200 bg-amber-50 text-amber-900';
  if (tone === 'sky') return 'border-sky-200 bg-sky-50 text-sky-900';
  if (tone === 'emerald') return 'border-emerald-200 bg-emerald-50 text-emerald-900';
  return 'border-slate-200 bg-slate-50 text-slate-800';
}

export function OrganizerPageClient() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const saved = useSpaceSavedReactions(isLoaded && isSignedIn);
  const [state, setState] = useState<OrganizerHomeState>('idle');
  const [trips, setTrips] = useState<OrganizerTripSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [destinationLabel, setDestinationLabel] = useState('');
  const [summary, setSummary] = useState('');
  const [createPending, setCreatePending] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadTrips() {
      if (!isLoaded) {
        setState('loading');
        return;
      }

      if (!isSignedIn) {
        setState('auth-required');
        setTrips([]);
        setError(null);
        return;
      }

      setState('loading');
      setError(null);

      const response = await fetchOrganizerTrips();
      if (cancelled) return;

      if (response.data) {
        setTrips(response.data.trips);
        setState('ready');
        return;
      }

      const status = getErrorStatus(response.error);
      if (status === 401 || status === 403) {
        setTrips([]);
        setState('auth-required');
        return;
      }
      if (isServiceUnavailableStatus(status)) {
        setTrips([]);
        setState('unavailable');
        setError(response.error?.error?.message ?? 'Organizer runtime пока не включён в этом окружении.');
        return;
      }

      setTrips([]);
      setState('error');
      setError(response.error?.error?.message ?? `Organizer request failed (${status ?? 'unknown'}).`);
    }

    void loadTrips();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn]);

  const savedHint = useMemo(() => {
    if (saved.state !== 'ready') return null;
    if (saved.savedCount > 0) {
      return `В Saved уже есть ${saved.savedCount} элементов shortlist. Базовый saved-to-trip intake теперь доступен через /space/saved, без открытия broad saved wave.`;
    }
    return 'Saved shortlist пока пуст. Это нормально: first slice строится вокруг реальных trip containers, а не fake imports.';
  }, [saved.savedCount, saved.state]);

  const tripCards = useMemo(
    () =>
      trips.map((trip) => ({
        trip,
        execution: deriveExecutionFromSummary(trip),
      })),
    [trips]
  );

  const tripsNeedingAttention = useMemo(
    () => tripCards.filter(({ execution }) => execution.readinessTone !== 'emerald').length,
    [tripCards]
  );

  const structuredTrips = useMemo(
    () => tripCards.filter(({ trip }) => trip.itemCount > 0 && trip.noteCount > 0).length,
    [tripCards]
  );

  const tripsWithOpenTasks = useMemo(
    () => tripCards.filter(({ trip }) => trip.pendingTaskCount > 0).length,
    [tripCards]
  );

  const primaryTripCard = useMemo(
    () => tripCards.find(({ execution }) => execution.readinessTone !== 'emerald') ?? tripCards[0] ?? null,
    [tripCards]
  );

  async function handleCreateTrip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextTitle = title.trim();
    if (!nextTitle || createPending) return;

    setCreatePending(true);
    setError(null);

    const response = await createOrganizerTrip({
      title: nextTitle,
      destinationLabel: destinationLabel.trim() || null,
      summary: summary.trim() || null,
    });

    setCreatePending(false);

    if (!response.data?.trip) {
      const status = getErrorStatus(response.error);
      setError(response.error?.error?.message ?? `Trip creation failed (${status ?? 'unknown'}).`);
      return;
    }

    const newTrip: OrganizerTripSummary = {
      ...response.data.trip,
      itemCount: 0,
      pendingTaskCount: 0,
      noteCount: 0,
    };
    setTrips((prev) => [newTrip, ...prev]);
    setState('ready');
    setTitle('');
    setDestinationLabel('');
    setSummary('');
    router.push(`/space/organizer/trips/${encodeURIComponent(response.data.trip.id)}`);
  }

  return (
    <SpaceLayout>
      <section className="space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Organizer</h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Trip-first рабочий контур внутри `Space Asia`: здесь поездки получают структуру, следующий шаг и честный
                execution focus без full planner wave.
              </p>
            </div>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
              execution refinement v1
            </span>
          </div>
        </header>

        {!isLoaded || state === 'loading' ? (
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Загрузка Organizer</h2>
            <p className="mt-2 text-sm text-slate-600">
              Проверяем доступ к organizer runtime и подготавливаем реальные trip containers для текущей session.
            </p>
          </article>
        ) : null}

        {state === 'auth-required' ? (
          <article className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-amber-900">Нужна авторизация</h2>
            <p className="mt-2 text-sm text-amber-800">
              Organizer остаётся секцией внутри Space, но реальные поездки и их контекст доступны только в авторизованной
              session.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/space"
                className="inline-flex rounded-md border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-100"
              >
                Вернуться на dashboard
              </Link>
              <Link
                href="/space/community/feed"
                className="inline-flex rounded-md border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-100"
              >
                Открыть Feed
              </Link>
            </div>
          </article>
        ) : null}

        {state === 'unavailable' || state === 'error' ? (
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {state === 'unavailable' ? 'Thin mode' : 'Organizer временно недоступен'}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Shell секция остаётся на месте, но runtime этого Phase 2 slice пока недоступен. Вместо fake trip data
                  показываем честное bounded состояние.
                </p>
              </div>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                bounded truth
              </span>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              {error ?? 'Organizer runtime временно недоступен в этом окружении.'}
            </div>
          </article>
        ) : null}

        {state === 'ready' ? (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Что важно по Organizer сейчас</h2>
                    <p className="mt-2 text-sm text-slate-600">
                      Home больше не только список поездок: он подсказывает, где сейчас тонкий контекст и какой следующий
                      шаг даст самый быстрый прогресс.
                    </p>
                  </div>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                    {trips.length === 0 ? 'start here' : `${tripsNeedingAttention} требуют внимания`}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs uppercase tracking-wide text-slate-500">Всего поездок</div>
                    <div className="mt-2 text-2xl font-semibold text-slate-900">{trips.length}</div>
                    <div className="mt-2 text-xs text-slate-500">Organizer остаётся портфелем поездок, а не вторым Saved.</div>
                  </div>
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <div className="text-xs uppercase tracking-wide text-amber-700">Нуждаются во внимании</div>
                    <div className="mt-2 text-2xl font-semibold text-amber-900">{tripsNeedingAttention}</div>
                    <div className="mt-2 text-xs text-amber-800">
                      Пустые или ещё тонкие поездки, где следующий шаг особенно важен.
                    </div>
                  </div>
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <div className="text-xs uppercase tracking-wide text-emerald-700">Есть структура</div>
                    <div className="mt-2 text-2xl font-semibold text-emerald-900">{structuredTrips}</div>
                    <div className="mt-2 text-xs text-emerald-800">
                      Поездки, где уже есть хотя бы items и notes, а контекст не выглядит пустым.
                    </div>
                  </div>
                </div>

                {trips.length === 0 ? (
                  <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
                    <div className="text-sm font-medium text-slate-900">Начните с первого trip container</div>
                    <p className="mt-2 text-sm text-slate-600">
                      Первый полезный шаг этого slice прост: создайте поездку, затем добавьте хотя бы один item, одну
                      задачу и одну заметку.
                    </p>
                    {savedHint ? <p className="mt-3 text-xs text-slate-500">{savedHint}</p> : null}
                  </div>
                ) : primaryTripCard ? (
                  <div className={`mt-5 rounded-xl border p-5 ${toneClasses(primaryTripCard.execution.readinessTone)}`}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-medium uppercase tracking-wide opacity-80">What matters now</div>
                        <h3 className="mt-2 text-lg font-semibold">{primaryTripCard.trip.title}</h3>
                        <p className="mt-2 text-sm opacity-90">{primaryTripCard.execution.whatMattersNow}</p>
                      </div>
                      <span className="rounded-full border border-current/15 bg-white/70 px-3 py-1 text-xs font-medium">
                        {primaryTripCard.execution.readinessLabel}
                      </span>
                    </div>
                    <div className="mt-4 rounded-xl border border-white/60 bg-white/60 p-4">
                      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Next step</div>
                      <div className="mt-2 text-sm font-medium text-slate-900">{primaryTripCard.execution.nextStep.title}</div>
                      <p className="mt-1 text-sm text-slate-600">{primaryTripCard.execution.nextStep.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Link
                          href={`/space/organizer/trips/${encodeURIComponent(primaryTripCard.trip.id)}`}
                          className="inline-flex rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
                        >
                          Открыть поездку
                        </Link>
                        {tripsWithOpenTasks > 0 ? (
                          <span className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600">
                            В Organizer сейчас {tripsWithOpenTasks} {tripsWithOpenTasks === 1 ? 'поездка с открытыми задачами' : 'поездки с открытыми задачами'}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : null}
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Ваши поездки</h2>
                    <p className="mt-2 text-sm text-slate-600">
                      Organizer остаётся deeper mode внутри Space: здесь живут trip containers, их readiness и следующий
                      полезный шаг, а не весь модуль Space.
                    </p>
                  </div>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                    {trips.length} trip{trips.length === 1 ? '' : 's'}
                  </span>
                </div>

                {trips.length === 0 ? (
                  <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
                    <div className="text-sm font-medium text-slate-900">Пока нет ни одной поездки</div>
                    <p className="mt-2 text-sm text-slate-600">
                      Это уже не thin shell: первым полезным действием здесь становится создание trip container с честным
                      минимальным контекстом.
                    </p>
                    {savedHint ? <p className="mt-3 text-xs text-slate-500">{savedHint}</p> : null}
                  </div>
                ) : (
                  <div className="mt-6 space-y-3">
                    {tripCards.map(({ trip, execution }) => {
                      const windowLabel = formatTripWindow(trip);
                      return (
                        <Link
                          key={trip.id}
                          href={`/space/organizer/trips/${encodeURIComponent(trip.id)}`}
                          className="block rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-sky-300 hover:bg-sky-50"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <div className="text-base font-semibold text-slate-900">{trip.title}</div>
                              <div className="mt-1 text-sm text-slate-600">
                                {trip.destinationLabel ?? 'Локация пока не уточнена'}
                              </div>
                            </div>
                            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                              {trip.status}
                            </span>
                          </div>
                          {trip.summary ? <p className="mt-3 text-sm text-slate-600">{trip.summary}</p> : null}
                          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                            {windowLabel ? <span>{windowLabel}</span> : null}
                            <span>{trip.itemCount} items</span>
                            <span>{trip.pendingTaskCount} pending tasks</span>
                            <span>{trip.noteCount} notes</span>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {execution.chips.map((chip) => (
                              <span
                                key={`${trip.id}-${chip.label}`}
                                className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${toneClasses(chip.tone)}`}
                              >
                                {chip.label}
                              </span>
                            ))}
                          </div>
                          <p className="mt-3 text-sm font-medium text-slate-900">{execution.whatMattersNow}</p>
                          <p className="mt-1 text-sm text-slate-600">
                            Next step: <span className="font-medium text-slate-700">{execution.nextStep.title}</span>{' '}
                            {execution.nextStep.description}
                          </p>
                          {trip.updatedAt ? (
                            <div className="mt-2 text-xs text-slate-500">Обновлено: {formatDate(trip.updatedAt)}</div>
                          ) : null}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </article>
            </div>

            <div className="space-y-6">
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Создать поездку</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Самый короткий flow этого slice: создать trip container, затем наполнить его item, задачей и заметкой,
                  чтобы поездка стала рабочим execution surface.
                </p>
                <form className="mt-5 space-y-4" onSubmit={handleCreateTrip}>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Название поездки</span>
                    <input
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="Например, Бангкок в мае"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-sky-300"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Куда</span>
                    <input
                      value={destinationLabel}
                      onChange={(event) => setDestinationLabel(event.target.value)}
                      placeholder="Бангкок, Пхукет, Хошимин..."
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-sky-300"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Короткая цель</span>
                    <textarea
                      value={summary}
                      onChange={(event) => setSummary(event.target.value)}
                      placeholder="Что это за поездка и зачем она вам сейчас"
                      rows={3}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-sky-300"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={createPending || title.trim().length === 0}
                    className="inline-flex rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {createPending ? 'Создаём...' : trips.length === 0 ? 'Создать первую поездку' : 'Создать ещё одну поездку'}
                  </button>
                </form>
                {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Границы этого slice</h2>
                <ul className="mt-4 space-y-3 text-sm text-slate-700">
                  <li className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    Dashboard остаётся cockpit, а Organizer остаётся deeper mode для подготовки поездки.
                  </li>
                  <li className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    Saved по-прежнему живёт как global shortlist source: {savedHint ?? 'состояние saved source уточняется.'}
                  </li>
                  <li className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    Нет map/day planner/reminder/comparison/AI workspace. Этот pass усиливает execution, а не открывает full planner.
                  </li>
                  <li className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    Communities, Feed и Activity не поглощаются Organizer и продолжают жить как самостоятельные sections.
                  </li>
                </ul>
              </article>
            </div>
          </div>
        ) : null}
      </section>
    </SpaceLayout>
  );
}
