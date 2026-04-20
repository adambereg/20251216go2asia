'use client';

import Link from 'next/link';
import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Calendar, Eye, LayoutList, Plus, X } from 'lucide-react';
import { SpaceLayout } from '@/components/space/Shared';
import {
  createOrganizerTrip,
  fetchOrganizerTripDetail,
  fetchOrganizerTrips,
  type OrganizerTripDetailResponse,
  type OrganizerTripSummary,
} from '@/components/space/runtime/organizerApi';
import { OrganizerHomeListSurface } from '@/components/space/runtime/OrganizerHomeListSurface';
import { OrganizerOverviewSurface } from '@/components/space/runtime/OrganizerOverviewSurface';
import { OrganizerTimelineSurface } from '@/components/space/runtime/OrganizerTimelineSurface';
import {
  buildPortfolioGroups,
  derivePortfolioActions,
  type OrganizerOverviewScale,
  type OrganizerTimelineScale,
} from '@/components/space/runtime/organizerPortfolio';
import { useSpaceSavedReactions } from '@/components/space/runtime/useSpaceSavedReactions';
import { getErrorStatus, isServiceUnavailableStatus } from '@/components/space/runtime/utils';

type OrganizerHomeState = 'idle' | 'loading' | 'ready' | 'auth-required' | 'unavailable' | 'error';
type OrganizerHomeTab = 'overview' | 'list' | 'timeline';

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
    icon: typeof Eye;
  }
> = {
  overview: {
    title: 'Обзор',
    description: 'Что делать дальше по всем поездкам сразу.',
    icon: Eye,
  },
  list: {
    title: 'Список',
    description: 'Поездки как отдельные контейнеры.',
    icon: LayoutList,
  },
  timeline: {
    title: 'Таймлайн',
    description: 'Поездки во времени: диапазоны, окна и пересечения.',
    icon: Calendar,
  },
};

const timelineScaleOptions: Array<{ id: OrganizerTimelineScale; label: string }> = [
  { id: 'week', label: 'Неделя' },
  { id: 'month', label: 'Месяц' },
];

export function OrganizerPageClient() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const saved = useSpaceSavedReactions(isLoaded && isSignedIn);
  const [state, setState] = useState<OrganizerHomeState>('idle');
  const [trips, setTrips] = useState<OrganizerTripSummary[]>([]);
  const [tripDetailsById, setTripDetailsById] = useState<Record<string, OrganizerTripDetailResponse>>({});
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [destinationLabel, setDestinationLabel] = useState('');
  const [summary, setSummary] = useState('');
  const [createPending, setCreatePending] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<OrganizerHomeTab>('overview');
  const [timelineScale, setTimelineScale] = useState<OrganizerTimelineScale>('month');
  const [overviewScale, setOverviewScale] = useState<OrganizerOverviewScale>('week');

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
        setError(response.error?.error?.message ?? 'Organizer пока недоступен в этом окружении.');
        return;
      }

      setTrips([]);
      setState('error');
      setError(response.error?.error?.message ?? `Не удалось загрузить Organizer (${status ?? 'unknown'}).`);
    }

    void loadTrips();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    let cancelled = false;

    async function loadTripDetails() {
      if (state !== 'ready' || trips.length === 0) {
        setTripDetailsById({});
        return;
      }

      const responses = await Promise.all(
        trips.map(async (trip) => {
          const response = await fetchOrganizerTripDetail(trip.id);
          return response.data ? ([trip.id, response.data] as const) : null;
        })
      );

      if (cancelled) return;

      setTripDetailsById(
        responses.reduce<Record<string, OrganizerTripDetailResponse>>((acc, entry) => {
          if (!entry) return acc;
          const [tripId, detail] = entry;
          acc[tripId] = detail;
          return acc;
        }, {})
      );
    }

    void loadTripDetails();
    return () => {
      cancelled = true;
    };
  }, [state, trips]);

  const savedHint = useMemo(() => {
    if (saved.state !== 'ready') return null;
    if (saved.savedCount > 0) {
      return `В сохранённом уже есть ${saved.savedCount} ${pluralizeRu(saved.savedCount, 'пост', 'поста', 'постов')}. Если какой-то из них пригодится, его можно добавить в поездку из раздела «Сохранённые».`;
    }
    return 'Сохранённое пока пусто. Это нормально: поездку можно начать и без заранее собранного списка.';
  }, [saved.savedCount, saved.state]);

  const portfolioActions = useMemo(() => derivePortfolioActions(trips, tripDetailsById), [tripDetailsById, trips]);
  const portfolioGroups = useMemo(() => buildPortfolioGroups(portfolioActions), [portfolioActions]);
  const focusAction = portfolioActions[0] ?? null;

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
      bookedItemCount: 0,
      pinnedItemCount: 0,
      linkedItemCount: 0,
      pendingTaskCount: 0,
      firstPendingTaskTitle: null,
      noteCount: 0,
      dayCount: 0,
    };
    setTrips((prev) => [newTrip, ...prev]);
    setState('ready');
    setTitle('');
    setDestinationLabel('');
    setSummary('');
    setCreateOpen(false);
    router.push(`/space/organizer/trips/${encodeURIComponent(response.data.trip.id)}`);
  }

  return (
    <SpaceLayout>
      <section className="space-y-8 pb-10">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-sky-700">Space Asia · Organizer</div>
            <h1 className="mt-1 text-[28px] font-semibold leading-tight text-slate-900">Ваши поездки в работе</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
              Спокойное пространство для поездок: где видно, что в фокусе, как поездки лежат во времени и к какому шагу
              лучше вернуться прямо сейчас.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <ViewToggle view={activeTab} onChange={setActiveTab} />
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" />
              Новая поездка
            </button>
          </div>
        </header>

        {!isLoaded || state === 'loading' ? (
          <article className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Загружаем ваши поездки</h2>
            <p className="mt-2 text-sm text-slate-600">Собираем портфель, временную шкалу и ближайшие действия.</p>
          </article>
        ) : null}

        {state === 'auth-required' ? (
          <article className="rounded-3xl border border-amber-200 bg-amber-50 p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-amber-900">Нужна авторизация</h2>
            <p className="mt-2 text-sm text-amber-800">Organizer показывает только ваши личные поездки и доступен после входа.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/space"
                className="inline-flex rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-100"
              >
                Вернуться в Space
              </Link>
              <Link
                href="/space/community/feed"
                className="inline-flex rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-100"
              >
                Открыть Feed
              </Link>
            </div>
          </article>
        ) : null}

        {(state === 'unavailable' || state === 'error') && (
          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              {state === 'unavailable' ? 'Organizer пока недоступен' : 'Organizer временно недоступен'}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Сейчас не удаётся загрузить ваши поездки. Когда сервис снова станет доступен, вы сможете продолжить с того
              же места.
            </p>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              {error ?? 'Organizer временно недоступен в этом окружении.'}
            </div>
          </article>
        )}

        {state === 'ready' ? (
          <>
            {activeTab === 'overview' ? (
              <OrganizerOverviewSurface
                actions={portfolioActions}
                groups={portfolioGroups}
                focusAction={focusAction}
                overviewScale={overviewScale}
                onOverviewScaleChange={setOverviewScale}
                savedHint={savedHint}
                onCreateClick={() => setCreateOpen(true)}
              />
            ) : null}

            {activeTab === 'list' ? (
              <OrganizerHomeListSurface trips={trips} tripDetailsById={tripDetailsById} onCreateClick={() => setCreateOpen(true)} />
            ) : null}

            {activeTab === 'timeline' ? (
              <OrganizerTimelineSurface
                trips={trips}
                tripDetailsById={tripDetailsById}
                scale={timelineScale}
                onScaleChange={setTimelineScale}
                scaleOptions={timelineScaleOptions}
              />
            ) : null}

            <article className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
              <div className="max-w-3xl">
                <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Organizer в одном ритме</div>
                <h2 className="mt-2 text-base font-semibold text-slate-900">Спокойное завершение экрана, без лишнего служебного шума</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Organizer уже собран как три рабочих режима: где действовать сейчас, как поездки лежат во времени и к какой
                  поездке удобнее вернуться как к отдельному контейнеру.
                </p>
              </div>
              <div className="mt-4 grid gap-3 lg:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                  <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Обзор</div>
                  <div className="mt-2 text-sm font-medium text-slate-900">Очередь действий по всему портфелю</div>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">Когда нужно быстро понять, к чему лучше вернуться прямо сейчас.</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                  <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Список</div>
                  <div className="mt-2 text-sm font-medium text-slate-900">Спокойный портфель поездок</div>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">Когда важнее видеть сами контейнеры поездок и их зрелость.</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                  <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Saved</div>
                  <div className="mt-2 text-sm font-medium text-slate-900">Глобальный источник сохранённого</div>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">Материалы можно подтягивать в поездки, не смешивая их с trip truth.</p>
                  {savedHint ? <span className="mt-2 block text-xs leading-relaxed text-slate-500">{savedHint}</span> : null}
                </div>
              </div>
            </article>
          </>
        ) : null}

        {createOpen ? (
          <CreateTripModal
            title={title}
            destinationLabel={destinationLabel}
            summary={summary}
            createPending={createPending}
            error={error}
            onClose={() => setCreateOpen(false)}
            onSubmit={handleCreateTrip}
            setTitle={setTitle}
            setDestinationLabel={setDestinationLabel}
            setSummary={setSummary}
          />
        ) : null}
      </section>
    </SpaceLayout>
  );
}

function CreateTripModal({
  title,
  destinationLabel,
  summary,
  createPending,
  error,
  onClose,
  onSubmit,
  setTitle,
  setDestinationLabel,
  setSummary,
}: {
  title: string;
  destinationLabel: string;
  summary: string;
  createPending: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  setTitle: (value: string) => void;
  setDestinationLabel: (value: string) => void;
  setSummary: (value: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-semibold text-slate-900">Новая поездка</div>
            <p className="mt-1 text-sm text-slate-500">Задайте основу. Остальной контекст можно спокойно собрать уже внутри поездки.</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 transition hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={(event) => void onSubmit(event)}>
          <Field label="Название">
            <input
              autoFocus
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Например, Бангкок в мае"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-300"
            />
          </Field>
          <Field label="Куда">
            <input
              value={destinationLabel}
              onChange={(event) => setDestinationLabel(event.target.value)}
              placeholder="Бангкок, Пхукет, Хошимин..."
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-300"
            />
          </Field>
          <Field label="Короткая цель">
            <textarea
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              rows={3}
              placeholder="Что это за поездка и зачем она вам сейчас"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-300"
            />
          </Field>

          {error ? <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div> : null}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-3 py-2 text-sm text-slate-600 hover:text-slate-900">
              Отмена
            </button>
            <button
              type="submit"
              disabled={createPending || title.trim().length === 0}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {createPending ? 'Создаём...' : 'Создать поездку'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-medium text-slate-600">{label}</div>
      {children}
    </label>
  );
}

function ViewToggle({
  view,
  onChange,
}: {
  view: OrganizerHomeTab;
  onChange: (view: OrganizerHomeTab) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-1">
      {(Object.keys(tabMeta) as OrganizerHomeTab[]).map((tab) => {
        const Icon = tabMeta[tab].icon;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition ${
              view === tab ? 'bg-slate-900 font-medium text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
            title={tabMeta[tab].description}
          >
            <Icon className="h-3.5 w-3.5" />
            {tabMeta[tab].title}
          </button>
        );
      })}
    </div>
  );
}
