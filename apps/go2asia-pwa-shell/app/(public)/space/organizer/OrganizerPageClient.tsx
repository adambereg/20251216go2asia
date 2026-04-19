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
import {
  deriveExecutionFromSummary,
  formatTripStatusLabel,
  type OrganizerExecutionTone,
} from '@/components/space/runtime/organizerExecution';
import {
  buildPortfolioGroups,
  derivePortfolioActions,
  deriveTripTimeline,
  formatTripWindowLabel,
  type OrganizerPortfolioAction,
  type OrganizerTimelineScale,
} from '@/components/space/runtime/organizerPortfolio';
import { useSpaceSavedReactions } from '@/components/space/runtime/useSpaceSavedReactions';
import { formatDate, getErrorStatus, isServiceUnavailableStatus } from '@/components/space/runtime/utils';

type OrganizerHomeState = 'idle' | 'loading' | 'ready' | 'auth-required' | 'unavailable' | 'error';
type OrganizerHomeTab = 'overview' | 'list' | 'timeline';

function toneClasses(tone: OrganizerExecutionTone): string {
  if (tone === 'amber') return 'border-amber-200 bg-amber-50 text-amber-900';
  if (tone === 'sky') return 'border-sky-200 bg-sky-50 text-sky-900';
  if (tone === 'emerald') return 'border-emerald-200 bg-emerald-50 text-emerald-900';
  return 'border-slate-200 bg-slate-50 text-slate-800';
}

function toneBarClasses(tone: OrganizerExecutionTone): string {
  if (tone === 'amber') return 'border-amber-300 bg-amber-100 text-amber-900';
  if (tone === 'sky') return 'border-sky-300 bg-sky-100 text-sky-900';
  if (tone === 'emerald') return 'border-emerald-300 bg-emerald-100 text-emerald-900';
  return 'border-slate-300 bg-slate-100 text-slate-900';
}

function pluralizeRu(count: number, one: string, few: string, many: string): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

const tabMeta: Record<
  OrganizerHomeTab,
  {
    title: string;
    description: string;
  }
> = {
  overview: {
    title: 'Обзор',
    description: 'Главный portfolio-level слой Organizer: что делать дальше по всем поездкам сразу.',
  },
  list: {
    title: 'Список',
    description: 'Поездки как контейнеры: в каком они состоянии и к какой из них лучше вернуться.',
  },
  timeline: {
    title: 'Таймлайн',
    description: 'Поездки во времени: как они лежат, где пересекаются и где между ними остаются окна.',
  },
};

const timelineScaleOptions: Array<{ id: OrganizerTimelineScale; label: string }> = [
  { id: 'week', label: 'Неделя' },
  { id: 'month', label: 'Месяц' },
];

function portfolioActionButtonLabel(action: OrganizerPortfolioAction): string {
  if (action.actionKey === 'finish-task') return 'Вернуться к шагу';
  if (action.actionKey === 'add-note') return 'Открыть заметки';
  if (action.actionKey === 'review-items') return 'Проверить объекты';
  return action.ctaLabel;
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
  const [activeTab, setActiveTab] = useState<OrganizerHomeTab>('overview');
  const [timelineScale, setTimelineScale] = useState<OrganizerTimelineScale>('month');

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
      return `В сохранённом уже есть ${saved.savedCount} ${pluralizeRu(saved.savedCount, 'пост', 'поста', 'постов')}. Если какой-то из них пригодится, его можно добавить в поездку из раздела «Сохранённые».`;
    }
    return 'Сохранённое пока пусто. Это нормально: поездку можно начать и без заранее собранного списка.';
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

  const tripsTakingShape = useMemo(
    () => tripCards.filter(({ execution }) => execution.readinessTone === 'sky').length,
    [tripCards]
  );

  const tripsSteady = useMemo(
    () => tripCards.filter(({ execution }) => execution.readinessTone === 'emerald').length,
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

  const portfolioActions = useMemo(() => derivePortfolioActions(trips), [trips]);
  const portfolioGroups = useMemo(() => buildPortfolioGroups(portfolioActions), [portfolioActions]);
  const focusAction = portfolioActions[0] ?? null;
  const tripTimeline = useMemo(() => deriveTripTimeline(trips, timelineScale), [timelineScale, trips]);
  const tripTimelineBoardWidth = useMemo(
    () => Math.max(tripTimeline.cells.length * tripTimeline.cellWidth, 640),
    [tripTimeline.cellWidth, tripTimeline.cells.length]
  );
  const tripTimelineTodayIndex = useMemo(
    () => tripTimeline.cells.findIndex((cell) => cell.isToday),
    [tripTimeline.cells]
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
      setError(response.error?.error?.message ?? `Не удалось создать поездку (${status ?? 'unknown'}).`);
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
              <p className="mt-2 max-w-3xl text-sm text-slate-600">{tabMeta[activeTab].description}</p>
            </div>
            {trips.length > 0 ? (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                {trips.length} {pluralizeRu(trips.length, 'поездка', 'поездки', 'поездок')}
              </span>
            ) : null}
          </div>
        </header>

        <nav className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(tabMeta) as OrganizerHomeTab[]).map((tab) => {
              const isActive = tab === activeTab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-xl border px-4 py-2 text-left transition ${
                    isActive
                      ? 'border-sky-300 bg-sky-50 text-sky-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-sm font-medium">{tabMeta[tab].title}</div>
                  <div className="mt-1 text-xs opacity-80">{tabMeta[tab].description}</div>
                </button>
              );
            })}
          </div>
        </nav>

        {!isLoaded || state === 'loading' ? (
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Загрузка Organizer</h2>
            <p className="mt-2 text-sm text-slate-600">Собираем ваши поездки и подготавливаем portfolio-level контекст.</p>
          </article>
        ) : null}

        {state === 'auth-required' ? (
          <article className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-amber-900">Нужна авторизация</h2>
            <p className="mt-2 text-sm text-amber-800">Organizer показывает личные поездки и доступен только после входа.</p>
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
                  Сейчас не удаётся загрузить поездки. Когда сервис снова станет доступен, вы сможете продолжить с того же места.
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
              {activeTab === 'overview' ? (
                <>
                  <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">Главный фокус</h2>
                        <p className="mt-2 text-sm text-slate-600">
                          Обзор не дублирует список поездок. Здесь собраны действия и точки внимания по всему портфелю.
                        </p>
                      </div>
                      {focusAction ? (
                        <span className={`rounded-full border px-3 py-1 text-xs font-medium ${toneClasses(focusAction.tone)}`}>
                          {focusAction.horizonLabel}
                        </span>
                      ) : null}
                    </div>

                    {focusAction ? (
                      <div className={`mt-5 rounded-2xl border p-5 ${toneClasses(focusAction.tone)}`}>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="text-xs font-medium uppercase tracking-wide opacity-80">Точка внимания</div>
                            <h3 className="mt-2 text-lg font-semibold">{focusAction.title}</h3>
                            <p className="mt-2 text-sm opacity-90">{focusAction.whyNow}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full border border-current/15 bg-white/70 px-3 py-1 text-xs font-medium">
                              {focusAction.lifecycleLabel}
                            </span>
                            <span className="rounded-full border border-current/15 bg-white/70 px-3 py-1 text-xs font-medium">
                              {focusAction.statusLabel}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 rounded-xl border border-white/60 bg-white/60 p-4">
                          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Связана с поездкой</div>
                          <div className="mt-2 text-sm font-medium text-slate-900">{focusAction.tripTitle}</div>
                          <p className="mt-1 text-sm text-slate-600">{focusAction.description}</p>
                          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                            <span>{focusAction.timingLabel}</span>
                            {focusAction.tripWindowLabel ? <span>{focusAction.tripWindowLabel}</span> : null}
                            {focusAction.attentionLabel ? <span>{focusAction.attentionLabel}</span> : null}
                          </div>
                          <div className="mt-4">
                            <Link
                              href={focusAction.tripHref}
                              className="inline-flex rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
                            >
                              {portfolioActionButtonLabel(focusAction)}
                            </Link>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
                        <div className="text-sm font-medium text-slate-900">Портфель действий появится здесь</div>
                        <p className="mt-2 text-sm text-slate-600">
                          Как только появится хотя бы одна поездка, здесь будет видно, к какому действию лучше вернуться раньше всего.
                        </p>
                        {savedHint ? <p className="mt-3 text-xs text-slate-500">{savedHint}</p> : null}
                      </div>
                    )}
                  </article>

                  <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">Действия по поездкам</h2>
                        <p className="mt-2 text-sm text-slate-600">
                          Короткий action portfolio по всем поездкам сразу. Здесь важны следующий шаг, контекст и срок, но не отдельный большой timeline-экран.
                        </p>
                      </div>
                      {portfolioActions.length > 0 ? (
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                          {portfolioActions.length} {pluralizeRu(portfolioActions.length, 'точка внимания', 'точки внимания', 'точек внимания')}
                        </span>
                      ) : null}
                    </div>

                    {portfolioGroups.length > 0 ? (
                      <div className="mt-6 space-y-5">
                        {portfolioGroups.map((group) => (
                          <section key={group.id} className="space-y-3">
                            <div className="flex flex-wrap items-baseline justify-between gap-3">
                              <div>
                                <h3 className="text-sm font-semibold text-slate-900">{group.label}</h3>
                                <p className="mt-1 text-xs text-slate-500">{group.description}</p>
                              </div>
                              <span className="text-xs text-slate-500">
                                {group.actions.length} {pluralizeRu(group.actions.length, 'действие', 'действия', 'действий')}
                              </span>
                            </div>
                            <div className="grid gap-3 xl:grid-cols-2">
                              {group.actions.map((action) => (
                                <div key={action.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                  <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                      <div className="text-sm font-medium text-slate-900">{action.title}</div>
                                      <div className="mt-1 text-xs text-slate-500">{action.tripTitle}</div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${toneClasses(action.tone)}`}>
                                        {action.lifecycleLabel}
                                      </span>
                                      <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-600">
                                        {action.timingLabel}
                                      </span>
                                    </div>
                                  </div>
                                  <p className="mt-3 text-sm text-slate-700">{action.whyNow}</p>
                                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                                    {action.tripWindowLabel ? <span>{action.tripWindowLabel}</span> : null}
                                    <span>{action.statusLabel}</span>
                                    {action.attentionLabel ? <span>{action.attentionLabel}</span> : null}
                                  </div>
                                  <div className="mt-4">
                                    <Link
                                      href={action.tripHref}
                                      className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                                    >
                                      {portfolioActionButtonLabel(action)}
                                    </Link>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </section>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
                        Пока нет поездок, поэтому action portfolio ещё не собран.
                      </div>
                    )}
                  </article>
                </>
              ) : null}

              {activeTab === 'list' ? (
                <>
                  <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">Список поездок</h2>
                        <p className="mt-2 text-sm text-slate-600">
                          Здесь поездки читаются как отдельные контейнеры: какая требует внимания, какая уже набрала структуру, а какая стала увереннее.
                        </p>
                      </div>
                      {trips.length > 0 ? (
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                          {tripsSteady} собраны увереннее
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-xs uppercase tracking-wide text-slate-500">Всего поездок</div>
                        <div className="mt-2 text-2xl font-semibold text-slate-900">{trips.length}</div>
                        <div className="mt-2 text-xs text-slate-500">Список показывает контейнеры поездок, а не action portfolio.</div>
                      </div>
                      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                        <div className="text-xs uppercase tracking-wide text-amber-700">Требуют внимания</div>
                        <div className="mt-2 text-2xl font-semibold text-amber-900">{tripsNeedingAttention}</div>
                        <div className="mt-2 text-xs text-amber-800">Поездки, где лучше не терять темп и вернуться к следующему шагу.</div>
                      </div>
                      <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
                        <div className="text-xs uppercase tracking-wide text-sky-700">Набирают структуру</div>
                        <div className="mt-2 text-2xl font-semibold text-sky-900">{tripsTakingShape}</div>
                        <div className="mt-2 text-xs text-sky-800">Поездки, где база уже появилась, но контекст ещё можно усилить.</div>
                      </div>
                    </div>

                    {trips.length === 0 ? (
                      <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
                        <div className="text-sm font-medium text-slate-900">Пока нет ни одной поездки</div>
                        <p className="mt-2 text-sm text-slate-600">
                          Первый полезный шаг здесь простой: создать поездку и добавить в неё хотя бы один ориентир, один следующий шаг и короткую заметку.
                        </p>
                        {savedHint ? <p className="mt-3 text-xs text-slate-500">{savedHint}</p> : null}
                      </div>
                    ) : primaryTripCard ? (
                      <div className={`mt-5 rounded-xl border p-5 ${toneClasses(primaryTripCard.execution.readinessTone)}`}>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="text-xs font-medium uppercase tracking-wide opacity-80">Главная поездка списка</div>
                            <h3 className="mt-2 text-lg font-semibold">{primaryTripCard.trip.title}</h3>
                            <p className="mt-2 text-sm opacity-80">{primaryTripCard.execution.progressHint}</p>
                            <p className="mt-2 text-sm opacity-90">{primaryTripCard.execution.whatMattersNow}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full border border-current/15 bg-white/70 px-3 py-1 text-xs font-medium">
                              {primaryTripCard.execution.readinessLabel}
                            </span>
                            <span className="rounded-full border border-current/15 bg-white/70 px-3 py-1 text-xs font-medium">
                              {formatTripStatusLabel(primaryTripCard.trip.status)}
                            </span>
                          </div>
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
                        <p className="mt-2 text-sm text-slate-600">Контейнеры поездок с их текущим состоянием, контекстом и ближайшим шагом.</p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      {tripCards.map(({ trip, execution }) => {
                        const windowLabel = formatTripWindowLabel(trip);
                        return (
                          <Link
                            key={trip.id}
                            href={`/space/organizer/trips/${encodeURIComponent(trip.id)}`}
                            className="block rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-sky-300 hover:bg-sky-50"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <div className="text-base font-semibold text-slate-900">{trip.title}</div>
                                <div className="mt-1 text-sm text-slate-600">{trip.destinationLabel ?? 'Локация пока не уточнена'}</div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <span className={`rounded-full border px-3 py-1 text-xs font-medium ${toneClasses(execution.readinessTone)}`}>
                                  {execution.progressLabel}
                                </span>
                                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                                  {formatTripStatusLabel(trip.status)}
                                </span>
                              </div>
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
                            <p className="mt-3 text-sm text-slate-600">{execution.progressHint}</p>
                            <p className="mt-3 text-sm font-medium text-slate-900">{execution.whatMattersNow}</p>
                            <p className="mt-1 text-sm text-slate-600">
                              Следующий шаг: <span className="font-medium text-slate-700">{execution.nextStep.title}</span>
                            </p>
                            {trip.updatedAt ? <div className="mt-2 text-xs text-slate-500">Обновлено: {formatDate(trip.updatedAt)}</div> : null}
                          </Link>
                        );
                      })}
                    </div>
                  </article>
                </>
              ) : null}

              {activeTab === 'timeline' ? (
                <>
                  <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">Таймлайн поездок</h2>
                        <p className="mt-2 text-sm text-slate-600">
                          Главный визуальный обзор поездок во времени: где они идут плотнее, где пересекаются и где между ними остаются окна.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {timelineScaleOptions.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setTimelineScale(option.id)}
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${
                              option.id === timelineScale
                                ? 'border-sky-300 bg-sky-50 text-sky-900'
                                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-xs uppercase tracking-wide text-slate-500">Поездки с датами</div>
                        <div className="mt-2 text-2xl font-semibold text-slate-900">{tripTimeline.ranges.length}</div>
                        <div className="mt-2 text-xs text-slate-500">Диапазоны, которые уже попали на временную доску.</div>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-xs uppercase tracking-wide text-slate-500">Пересечения и окна</div>
                        <div className="mt-2 text-2xl font-semibold text-slate-900">
                          {tripTimeline.overlapCount} / {tripTimeline.windowCount}
                        </div>
                        <div className="mt-2 text-xs text-slate-500">Слева пересечения, справа окна между соседними поездками.</div>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-xs uppercase tracking-wide text-slate-500">Без дат</div>
                        <div className="mt-2 text-2xl font-semibold text-slate-900">{tripTimeline.unscheduledTrips.length}</div>
                        <div className="mt-2 text-xs text-slate-500">Эти поездки остаются отдельно, пока окно ещё не уточнено.</div>
                      </div>
                    </div>

                    {tripTimeline.ranges.length > 0 ? (
                      <div className="mt-6 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                          <span>
                            Доска покрывает период {tripTimeline.boardStartLabel} - {tripTimeline.boardEndLabel}.
                          </span>
                          <span>Каждая полоса показывает длину поездки и делает видимыми пересечения.</span>
                        </div>
                        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50">
                          <div className="min-w-max p-4">
                            <div className="grid gap-3 lg:grid-cols-[240px_minmax(0,1fr)]">
                              <div />
                              <div style={{ width: tripTimelineBoardWidth }}>
                                <div
                                  className="grid text-[11px] font-medium text-slate-600"
                                  style={{ gridTemplateColumns: `repeat(${tripTimeline.cells.length}, minmax(0, 1fr))` }}
                                >
                                  {tripTimeline.monthGroups.map((group) => (
                                    <div key={group.key} className="border-b border-slate-200 pb-2" style={{ gridColumn: `span ${group.span}` }}>
                                      {group.label}
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-2 flex border-b border-slate-200 pb-2">
                                  {tripTimeline.cells.map((cell) => (
                                    <div
                                      key={cell.key}
                                      className={`shrink-0 border-r border-slate-200 pr-1 text-[11px] ${
                                        cell.isToday ? 'text-sky-700' : 'text-slate-500'
                                      }`}
                                      style={{ width: tripTimeline.cellWidth }}
                                    >
                                      <div className="font-medium">{cell.label}</div>
                                      <div>{cell.shortLabel}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 space-y-3">
                              {tripTimeline.ranges.map((range) => (
                                <div key={range.tripId} className="grid gap-3 lg:grid-cols-[240px_minmax(0,1fr)]">
                                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                                    <Link href={range.tripHref} className="text-sm font-medium text-slate-900 hover:text-sky-700">
                                      {range.tripTitle}
                                    </Link>
                                    <div className="mt-1 text-xs text-slate-500">{range.tripWindowLabel ?? 'Окно поездки ещё уточняется'}</div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${toneClasses(range.tone)}`}>
                                        {range.lifecycleLabel}
                                      </span>
                                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600">
                                        {range.statusLabel}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                                    <div className="relative" style={{ width: tripTimelineBoardWidth, height: 72 }}>
                                      <div className="absolute inset-0 flex">
                                        {tripTimeline.cells.map((cell) => (
                                          <div
                                            key={`${range.tripId}-${cell.key}`}
                                            className={`h-full shrink-0 border-r border-slate-200 ${
                                              cell.isToday ? 'bg-sky-50/70' : 'bg-white'
                                            }`}
                                            style={{ width: tripTimeline.cellWidth }}
                                          />
                                        ))}
                                      </div>
                                      {tripTimelineTodayIndex >= 0 ? (
                                        <div
                                          className="absolute inset-y-0 w-px bg-sky-300"
                                          style={{ left: tripTimelineTodayIndex * tripTimeline.cellWidth }}
                                        />
                                      ) : null}
                                      <div
                                        className={`absolute top-1/2 -translate-y-1/2 rounded-xl border px-3 py-2 shadow-sm ${toneBarClasses(range.tone)}`}
                                        style={{
                                          left: `calc(${range.leftPercent}% + 4px)`,
                                          width: `max(calc(${range.widthPercent}% - 8px), ${tripTimeline.cellWidth - 8}px)`,
                                        }}
                                      >
                                        <div className="truncate text-sm font-medium">{range.tripTitle}</div>
                                        <div className="mt-1 truncate text-[11px] opacity-80">
                                          {range.tripWindowLabel ?? range.statusLabel}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
                        Когда у поездок появятся даты, здесь будет видно, как они лежат во времени.
                      </div>
                    )}
                  </article>

                  {tripTimeline.unscheduledTrips.length > 0 ? (
                    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                      <h2 className="text-lg font-semibold text-slate-900">Поездки без окна</h2>
                      <p className="mt-2 text-sm text-slate-600">
                        Они уже существуют как контейнеры, но пока не попадают на временную доску, потому что окно ещё не задано.
                      </p>
                      <div className="mt-5 space-y-3">
                        {tripTimeline.unscheduledTrips.map((trip) => (
                          <Link
                            key={trip.id}
                            href={`/space/organizer/trips/${encodeURIComponent(trip.id)}`}
                            className="block rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-sky-300 hover:bg-sky-50"
                          >
                            <div className="text-sm font-medium text-slate-900">{trip.title}</div>
                            <div className="mt-1 text-xs text-slate-500">{trip.destinationLabel ?? 'Локация пока не уточнена'}</div>
                          </Link>
                        ))}
                      </div>
                    </article>
                  ) : null}
                </>
              ) : null}
            </div>

            <div className="space-y-6">
              <article className={`rounded-2xl border bg-white p-6 shadow-sm ${trips.length === 0 ? 'border-sky-200 ring-1 ring-sky-100' : 'border-slate-200'}`}>
                <h2 className="text-lg font-semibold text-slate-900">Создать поездку</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Короткий спокойный старт: создайте поездку, затем добавьте в неё объект, один шаг и короткую заметку.
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
                <h2 className="text-lg font-semibold text-slate-900">Как устроен Organizer</h2>
                <ul className="mt-4 space-y-3 text-sm text-slate-700">
                  <li className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    Список показывает поездки как контейнеры. Таймлайн показывает поездки во времени. Обзор показывает действия по всем поездкам сразу.
                  </li>
                  <li className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    Saved остаётся источником сохранённого: {savedHint ?? 'доступность сохранённого уточняется.'}
                  </li>
                  <li className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    Trip Detail остаётся главным рабочим экраном поездки. Portfolio-level вкладки не заменяют его, а помогают понять, к какой поездке лучше вернуться.
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
