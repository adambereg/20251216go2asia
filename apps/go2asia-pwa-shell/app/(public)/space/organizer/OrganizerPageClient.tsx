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

function pluralizeRu(count: number, one: string, few: string, many: string): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
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
      return `В сохранённом уже есть ${saved.savedCount} ${pluralizeRu(saved.savedCount, 'объект', 'объекта', 'объектов')}. При необходимости их можно добавить в поездку из раздела «Сохранённые».`;
    }
    return 'Сохранённое пока пусто. Это нормально: поездку можно начать и без готового shortlist.';
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

  const focusButtonLabel = useMemo(() => {
    if (!primaryTripCard) return 'Создать первую поездку';
    if (primaryTripCard.execution.nextStep.actionKey === 'finish-task') return 'Вернуться к шагу';
    if (primaryTripCard.execution.nextStep.actionKey === 'add-note') return 'Добавить ориентир';
    if (primaryTripCard.execution.nextStep.actionKey === 'add-item') return 'Открыть поездку';
    return 'Продолжить поездку';
  }, [primaryTripCard]);

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
                Здесь поездки собираются в понятный рабочий контекст: что уже есть, что требует внимания и какой шаг
                логично сделать следующим.
              </p>
            </div>
            {trips.length > 0 ? (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                {trips.length} {pluralizeRu(trips.length, 'поездка', 'поездки', 'поездок')}
              </span>
            ) : null}
          </div>
        </header>

        {!isLoaded || state === 'loading' ? (
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Загрузка Organizer</h2>
            <p className="mt-2 text-sm text-slate-600">
              Собираем ваши поездки и подготавливаем рабочий контекст.
            </p>
          </article>
        ) : null}

        {state === 'auth-required' ? (
          <article className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-amber-900">Нужна авторизация</h2>
            <p className="mt-2 text-sm text-amber-800">
              Organizer показывает личные поездки и доступен только после входа.
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
                  {state === 'unavailable' ? 'Organizer пока недоступен' : 'Organizer временно недоступен'}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Сейчас не удаётся загрузить поездки. Когда сервис снова станет доступен, вы сможете продолжить с того
                  же места.
                </p>
              </div>
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
                    <h2 className="text-lg font-semibold text-slate-900">Главный фокус</h2>
                    <p className="mt-2 text-sm text-slate-600">
                      Organizer нужен не для хранения поездок самих по себе, а для того, чтобы быстро понять, куда
                      лучше вернуться сейчас.
                    </p>
                  </div>
                  {trips.length > 0 ? (
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                      {tripsNeedingAttention === 0 ? 'Все поездки в рабочем ритме' : `${tripsNeedingAttention} требуют внимания`}
                    </span>
                  ) : null}
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs uppercase tracking-wide text-slate-500">Всего поездок</div>
                    <div className="mt-2 text-2xl font-semibold text-slate-900">{trips.length}</div>
                    <div className="mt-2 text-xs text-slate-500">Органайзер показывает портфель поездок, а не заменяет раздел сохранённого.</div>
                  </div>
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <div className="text-xs uppercase tracking-wide text-amber-700">Требуют внимания</div>
                    <div className="mt-2 text-2xl font-semibold text-amber-900">{tripsNeedingAttention}</div>
                    <div className="mt-2 text-xs text-amber-800">
                      Поездки, где лучше не терять темп: пустые, тонкие или с открытыми шагами.
                    </div>
                  </div>
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <div className="text-xs uppercase tracking-wide text-emerald-700">Собраны лучше</div>
                    <div className="mt-2 text-2xl font-semibold text-emerald-900">{structuredTrips}</div>
                    <div className="mt-2 text-xs text-emerald-800">
                      Поездки, где уже есть объекты и заметки, а контекст не выглядит пустым.
                    </div>
                  </div>
                </div>

                {trips.length === 0 ? (
                  <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
                    <div className="text-sm font-medium text-slate-900">Начните с первой поездки</div>
                    <p className="mt-2 text-sm text-slate-600">
                      Сначала создайте поездку, потом добавьте хотя бы один объект, один шаг и одну заметку. Этого уже
                      достаточно, чтобы подготовка перестала быть пустой.
                    </p>
                    {savedHint ? <p className="mt-3 text-xs text-slate-500">{savedHint}</p> : null}
                  </div>
                ) : primaryTripCard ? (
                  <div className={`mt-5 rounded-xl border p-5 ${toneClasses(primaryTripCard.execution.readinessTone)}`}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-medium uppercase tracking-wide opacity-80">Что важно сейчас</div>
                        <h3 className="mt-2 text-lg font-semibold">{primaryTripCard.trip.title}</h3>
                        <p className="mt-2 text-sm opacity-90">{primaryTripCard.execution.whatMattersNow}</p>
                      </div>
                      <span className="rounded-full border border-current/15 bg-white/70 px-3 py-1 text-xs font-medium">
                        {primaryTripCard.execution.readinessLabel}
                      </span>
                    </div>
                    <div className="mt-4 rounded-xl border border-white/60 bg-white/60 p-4">
                      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Следующий шаг</div>
                      <div className="mt-2 text-sm font-medium text-slate-900">{primaryTripCard.execution.nextStep.title}</div>
                      <p className="mt-1 text-sm text-slate-600">{primaryTripCard.execution.nextStep.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Link
                          href={`/space/organizer/trips/${encodeURIComponent(primaryTripCard.trip.id)}`}
                          className="inline-flex rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
                        >
                          {focusButtonLabel}
                        </Link>
                        {tripsWithOpenTasks > 0 ? (
                          <span className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600">
                            Сейчас {tripsWithOpenTasks} {pluralizeRu(tripsWithOpenTasks, 'поездка с открытым шагом', 'поездки с открытыми шагами', 'поездок с открытыми шагами')}
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
                      Здесь видно, какая поездка уже собрана лучше, а какая просит следующего понятного действия.
                    </p>
                  </div>
                  {trips.length > 0 ? (
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                      {structuredTrips} в хорошем ритме
                    </span>
                  ) : null}
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
                            <span>{trip.itemCount} объектов</span>
                            <span>{trip.pendingTaskCount} открытых шагов</span>
                            <span>{trip.noteCount} заметок</span>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {execution.chips.slice(0, 3).map((chip) => (
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
                            Следующий шаг: <span className="font-medium text-slate-700">{execution.nextStep.title}</span>
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
              <article className={`rounded-2xl border bg-white p-6 shadow-sm ${trips.length === 0 ? 'border-sky-200 ring-1 ring-sky-100' : 'border-slate-200'}`}>
                <h2 className="text-lg font-semibold text-slate-900">Создать поездку</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Короткий старт: создайте поездку, затем добавьте в неё объект, один шаг и короткую заметку.
                </p>
                <form className="mt-5 space-y-4" onSubmit={handleCreateTrip}>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Название</span>
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
                <h2 className="text-lg font-semibold text-slate-900">Как это устроено</h2>
                <ul className="mt-4 space-y-3 text-sm text-slate-700">
                  <li className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    Organizer помогает вести подготовку поездки, а не заменяет весь Space.
                  </li>
                  <li className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    Saved остаётся источником сохранённого: {savedHint ?? 'доступность сохранённого уточняется.'}
                  </li>
                  <li className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    Здесь собраны только поездка, объекты, шаги и заметки. Этого достаточно для повседневной подготовки без перегрузки интерфейса.
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
