'use client';

import Link from 'next/link';
import { ArrowRight, Plus, Sparkles } from 'lucide-react';
import type { OrganizerTripDetailResponse, OrganizerTripSummary } from './organizerApi';
import {
  deriveExecutionFromSummary,
  deriveTripDateConfidenceState,
  deriveTripLifecycleState,
  formatTripStatusLabel,
  type OrganizerExecutionTone,
} from './organizerExecution';
import { formatTripWindowLabel } from './organizerPortfolio';
import { buildTripDetailSnapshot } from './organizerDetailSelectors';

type OrganizerHomeListSurfaceProps = {
  trips: OrganizerTripSummary[];
  tripDetailsById: Record<string, OrganizerTripDetailResponse>;
  onCreateClick: () => void;
};

type TripEntry = {
  trip: OrganizerTripSummary;
  execution: ReturnType<typeof deriveExecutionFromSummary>;
  lifecycle: ReturnType<typeof deriveTripLifecycleState>;
};

function toneClasses(tone: OrganizerExecutionTone): string {
  if (tone === 'amber') return 'border-amber-200 bg-amber-50 text-amber-900';
  if (tone === 'sky') return 'border-sky-200 bg-sky-50 text-sky-900';
  if (tone === 'emerald') return 'border-emerald-200 bg-emerald-50 text-emerald-900';
  return 'border-slate-200 bg-slate-50 text-slate-800';
}

function sectionTone(mode: TripEntry['lifecycle']['mode']): string {
  if (mode === 'post_trip') return 'border-slate-200 bg-slate-50/70';
  if (mode === 'in_trip') return 'border-sky-200 bg-sky-50/70';
  return 'border-slate-200 bg-white';
}

function groupEntries(entries: TripEntry[]) {
  return {
    inTrip: entries.filter((entry) => entry.lifecycle.mode === 'in_trip'),
    preparation: entries.filter((entry) => entry.lifecycle.mode === 'preparation'),
    postTrip: entries.filter((entry) => entry.lifecycle.mode === 'post_trip'),
  };
}

function getFocusTrip(entries: TripEntry[]) {
  const groups = groupEntries(entries);
  if (groups.inTrip.length > 0) return groups.inTrip[0] ?? null;
  const sortedPreparation = [...groups.preparation].sort((left, right) => {
    const toneWeight = { amber: 0, sky: 1, emerald: 2, slate: 3 } as const;
    const toneDiff = toneWeight[left.execution.readinessTone] - toneWeight[right.execution.readinessTone];
    if (toneDiff !== 0) return toneDiff;
    return right.trip.pendingTaskCount - left.trip.pendingTaskCount;
  });
  return sortedPreparation[0] ?? groups.postTrip[0] ?? entries[0] ?? null;
}

function getFocusHeroCopy(entry: TripEntry) {
  if (entry.lifecycle.mode === 'in_trip') {
    return {
      eyebrow: 'Вы сейчас в поездке',
      focusLabel: 'Сейчас',
      nextLabel: 'Не забыть',
      banner: 'Держите в поле зрения ближайший шаг и то, что пригодится прямо сегодня.',
      actionLabel: 'Открыть сейчас',
    };
  }
  if (entry.lifecycle.mode === 'post_trip') {
    return {
      eyebrow: 'Недавняя поездка',
      focusLabel: 'Что оказалось полезным',
      nextLabel: 'Что сохранить',
      banner: 'Полезные находки ещё свежи. Сейчас хороший момент зафиксировать их спокойно и без спешки.',
      actionLabel: 'Посмотреть итоги',
    };
  }
  return {
    eyebrow: 'Сейчас в фокусе',
    focusLabel: 'Что важно сейчас',
    nextLabel: 'Следующий шаг',
    banner:
      entry.execution.readinessTone === 'amber'
        ? 'У поездки есть хрупкие места, но именно поэтому её легко подтянуть одним спокойным шагом.'
        : 'Основа уже появилась. Осталось укрепить то, что сделает поездку увереннее.',
    actionLabel: 'Открыть поездку',
  };
}

export function OrganizerHomeListSurface({ trips, tripDetailsById, onCreateClick }: OrganizerHomeListSurfaceProps) {
  const entries = trips.map((trip) => ({
    trip,
    execution: deriveExecutionFromSummary(trip),
    lifecycle: deriveTripLifecycleState(trip),
  }));

  if (entries.length === 0) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-teal-100 text-slate-700">
          <Sparkles className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-slate-900">Здесь появятся ваши поездки</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
          Создайте первую поездку и начните собирать в ней объекты, шаги и заметки. Список останется спокойным каталогом
          поездок, а не вторым overview-экраном.
        </p>
        <button
          type="button"
          onClick={onCreateClick}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          Создать поездку
        </button>
      </section>
    );
  }

  const focusTrip = getFocusTrip(entries);
  const groups = groupEntries(entries.filter((entry) => entry.trip.id !== focusTrip?.trip.id));

  return (
    <div className="space-y-7">
      {focusTrip ? <FocusTripCard entry={focusTrip} detail={tripDetailsById[focusTrip.trip.id]} /> : null}

      <LifecycleSection
        title="Сейчас в поездке"
        subtitle="Что важно прямо сейчас"
        entries={groups.inTrip}
        tripDetailsById={tripDetailsById}
      />
      <LifecycleSection
        title="В подготовке"
        subtitle="Собираем, уточняем и закрываем хрупкие места"
        entries={groups.preparation}
        tripDetailsById={tripDetailsById}
        onCreateClick={onCreateClick}
      />
      <LifecycleSection
        title="После поездки"
        subtitle="Что сохранить и на что опереться дальше"
        entries={groups.postTrip}
        tripDetailsById={tripDetailsById}
      />
    </div>
  );
}

function buildTripMeta(entry: TripEntry, detail: OrganizerTripDetailResponse | undefined): string[] {
  const confidence = deriveTripDateConfidenceState(entry.trip);
  const parts = [confidence.label];
  if (entry.trip.dayCount > 0) parts.push(`${entry.trip.dayCount} дн. слоя`);
  if (entry.trip.pinnedItemCount > 0) parts.push(`${entry.trip.pinnedItemCount} закреплено`);
  if (entry.trip.bookedItemCount > 0) parts.push(`${entry.trip.bookedItemCount} подтверждено`);
  if (detail) {
    const snapshot = buildTripDetailSnapshot(detail);
    if (snapshot.topCategories.length > 0) {
      parts.push(snapshot.topCategories.join(' · '));
    }
  }
  return parts;
}

function FocusTripCard({ entry, detail }: { entry: TripEntry; detail: OrganizerTripDetailResponse | undefined }) {
  const copy = getFocusHeroCopy(entry);
  const windowLabel = formatTripWindowLabel(entry.trip);
  const meta = buildTripMeta(entry, detail);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-gradient-to-br from-sky-50 to-teal-100 opacity-70" />
      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-sky-700">
              <Sparkles className="h-3.5 w-3.5" />
              {copy.eyebrow}
            </span>
            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${toneClasses(entry.lifecycle.tone)}`}>
              {entry.lifecycle.label}
            </span>
          </div>

          <h2 className="text-[24px] font-semibold leading-tight text-slate-900">{entry.trip.title}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span>{entry.trip.destinationLabel ?? 'Локация пока не уточнена'}</span>
            {windowLabel ? <span>· {windowLabel}</span> : null}
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
            {meta.map((part) => (
              <span key={part}>{part}</span>
            ))}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <InfoBlock label={copy.focusLabel} value={entry.execution.whatMattersNow} />
            <InfoBlock label={copy.nextLabel} value={entry.trip.firstPendingTaskTitle ?? entry.execution.nextStep.title} accent />
          </div>

          <div className={`mt-5 rounded-xl border px-4 py-3 text-sm leading-relaxed ${toneClasses(entry.execution.readinessTone)}`}>{copy.banner}</div>

          <Link
            href={`/space/organizer/trips/${encodeURIComponent(entry.trip.id)}`}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            {copy.actionLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <aside className="space-y-4 lg:border-l lg:border-slate-100 lg:pl-8">
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${toneClasses(entry.execution.readinessTone)}`}>
              {entry.execution.readinessLabel}
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600">
              {formatTripStatusLabel(entry.trip.status)}
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-medium text-slate-900">{entry.execution.progressLabel}</div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{entry.execution.progressHint}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Stat label="Подтверждено" value={entry.trip.bookedItemCount} />
            <Stat label="Открытых шагов" value={entry.trip.pendingTaskCount} />
            <Stat label="Закреплено" value={entry.trip.pinnedItemCount} />
            <Stat label="Дней в слое" value={entry.trip.dayCount} />
          </div>
        </aside>
      </div>
    </section>
  );
}

function LifecycleSection({
  title,
  subtitle,
  entries,
  tripDetailsById,
  onCreateClick,
}: {
  title: string;
  subtitle: string;
  entries: TripEntry[];
  tripDetailsById: Record<string, OrganizerTripDetailResponse>;
  onCreateClick?: () => void;
}) {
  if (entries.length === 0 && !onCreateClick) return null;

  return (
    <section>
      <div className="mb-3 flex items-center gap-3">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <span className="truncate text-xs text-slate-400">· {subtitle}</span>
        <span className="ml-auto rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-500">{entries.length}</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {entries.map((entry) => (
          <TripCard key={entry.trip.id} entry={entry} detail={tripDetailsById[entry.trip.id]} />
        ))}
        {onCreateClick ? <AddTripCard onClick={onCreateClick} /> : null}
      </div>
    </section>
  );
}

function TripCard({ entry, detail }: { entry: TripEntry; detail: OrganizerTripDetailResponse | undefined }) {
  const windowLabel = formatTripWindowLabel(entry.trip);
  const confidence = deriveTripDateConfidenceState(entry.trip);
  const snapshot = detail ? buildTripDetailSnapshot(detail) : null;

  return (
    <Link
      href={`/space/organizer/trips/${encodeURIComponent(entry.trip.id)}`}
      className={`group rounded-2xl border p-5 shadow-sm transition hover:border-sky-300 hover:shadow-md ${sectionTone(entry.lifecycle.mode)}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-[15px] font-semibold text-slate-900">{entry.trip.title}</div>
          <div className="mt-1 truncate text-xs text-slate-500">
            {entry.lifecycle.mode === 'in_trip'
              ? 'Сейчас в активной фазе'
              : entry.lifecycle.mode === 'post_trip'
                ? 'Можно сохранить полезные выводы'
                : windowLabel ?? 'Окно поездки пока уточняется'}
          </div>
        </div>
        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${toneClasses(entry.lifecycle.tone)}`}>{entry.lifecycle.label}</span>
      </div>

      <div className="line-clamp-2 min-h-[40px] text-sm leading-relaxed text-slate-600">{entry.execution.whatMattersNow}</div>

      <div className="mt-4 border-t border-slate-100/80 pt-3">
        <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
          <span>{confidence.label}</span>
          {entry.trip.dayCount > 0 ? <span>{entry.trip.dayCount} дн. слоя</span> : null}
          {entry.trip.pinnedItemCount > 0 ? <span>{entry.trip.pinnedItemCount} закреплено</span> : null}
        </div>
        <div className="mt-2 text-[11px] font-medium uppercase tracking-wide text-slate-500">Ближайший шаг</div>
        <div className="mt-1 text-sm font-medium text-slate-900">
          {entry.trip.firstPendingTaskTitle ?? snapshot?.nextPendingTask?.title ?? 'Следующий шаг появится здесь, когда поездка получит рабочий ритм.'}
        </div>
        {snapshot?.topCategories.length ? (
          <div className="mt-1 text-xs text-slate-500">Сейчас опираемся на {snapshot.topCategories.join(' · ')}</div>
        ) : null}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${toneClasses(entry.execution.readinessTone)}`}>
          {entry.execution.progressLabel}
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 transition group-hover:text-slate-700">
          Открыть поездку
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}

function AddTripCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-center text-slate-500 transition hover:border-slate-400 hover:text-slate-700"
    >
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50">
        <Plus className="h-4 w-4" />
      </div>
      <div className="text-sm font-medium">Новая поездка</div>
      <div className="mt-1 text-xs text-slate-400">Начните с направления, а детали добавите уже внутри поездки.</div>
    </button>
  );
}

function InfoBlock({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 ${accent ? 'bg-sky-50 ring-1 ring-sky-100' : 'bg-slate-50 ring-1 ring-slate-100'}`}>
      <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-sm leading-snug text-slate-800">{value}</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="text-[11px] text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-semibold text-slate-900">{value}</div>
    </div>
  );
}
