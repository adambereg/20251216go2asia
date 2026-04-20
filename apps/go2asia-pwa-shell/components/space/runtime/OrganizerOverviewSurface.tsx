'use client';

import Link from 'next/link';
import { ArrowRight, Clock, Sparkles } from 'lucide-react';
import { OrganizerActionTimelineSurface } from './OrganizerActionTimelineSurface';
import type {
  OrganizerOverviewScale,
  OrganizerPortfolioAction,
  OrganizerPortfolioGroup,
} from './organizerPortfolio';

type OrganizerOverviewSurfaceProps = {
  actions: OrganizerPortfolioAction[];
  groups: OrganizerPortfolioGroup[];
  focusAction: OrganizerPortfolioAction | null;
  overviewScale: OrganizerOverviewScale;
  onOverviewScaleChange: (scale: OrganizerOverviewScale) => void;
  savedHint: string | null;
  onCreateClick: () => void;
};

function toneClasses(tone: OrganizerPortfolioAction['tone']): string {
  if (tone === 'amber') return 'border-amber-200 bg-amber-50 text-amber-900';
  if (tone === 'sky') return 'border-sky-200 bg-sky-50 text-sky-900';
  if (tone === 'emerald') return 'border-emerald-200 bg-emerald-50 text-emerald-900';
  return 'border-slate-200 bg-slate-50 text-slate-800';
}

function portfolioActionButtonLabel(action: OrganizerPortfolioAction): string {
  if (action.actionKey === 'finish-task') return 'Вернуться к шагу';
  if (action.actionKey === 'add-note') return 'Открыть заметки';
  if (action.actionKey === 'review-items') return 'Проверить объекты';
  return action.ctaLabel;
}

export function OrganizerOverviewSurface({
  actions,
  groups,
  focusAction,
  overviewScale,
  onOverviewScaleChange,
  savedHint,
  onCreateClick,
}: OrganizerOverviewSurfaceProps) {
  if (!focusAction) {
    return (
      <article className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-teal-100 text-slate-700">
          <Sparkles className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-slate-900">Обзор появится вместе с первой поездкой</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
          Когда появится хотя бы одна поездка, здесь соберётся портфель действий: к чему лучше вернуться сейчас, что
          скоро потребует внимания и как это распределено во времени.
        </p>
        {savedHint ? <p className="mx-auto mt-3 max-w-xl text-xs leading-relaxed text-slate-500">{savedHint}</p> : null}
        <button
          type="button"
          onClick={onCreateClick}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          Создать поездку
          <ArrowRight className="h-4 w-4" />
        </button>
      </article>
    );
  }

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="absolute -right-14 -top-14 h-56 w-56 rounded-full bg-gradient-to-br from-sky-50 to-teal-100 opacity-70" />
        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-sky-700">
                <Sparkles className="h-3.5 w-3.5" />
                Главное действие сейчас
              </span>
              <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${toneClasses(focusAction.tone)}`}>
                {focusAction.horizonLabel}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                <Clock className="h-3 w-3" />
                {focusAction.timingLabel}
              </span>
            </div>

            <h2 className="mt-4 max-w-xl text-[26px] font-semibold leading-tight text-slate-900">{focusAction.title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-700">{focusAction.description}</p>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Связано с поездкой</div>
              <div className="mt-2 text-[15px] font-semibold text-slate-900">{focusAction.tripTitle}</div>
              <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
                {focusAction.tripWindowLabel ? <span>{focusAction.tripWindowLabel}</span> : null}
                <span>{focusAction.lifecycleLabel}</span>
                <span>{focusAction.statusLabel}</span>
                {focusAction.attentionLabel ? <span>{focusAction.attentionLabel}</span> : null}
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-sky-100 bg-sky-50/70 px-4 py-3 text-sm leading-relaxed text-slate-700">
              <span className="font-medium">Почему сейчас.</span> {focusAction.whyNow}
              {focusAction.attentionLabel ? <span className="text-slate-500"> {focusAction.attentionLabel}.</span> : null}
            </div>

            <Link
              href={focusAction.tripHref}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              {portfolioActionButtonLabel(focusAction)}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <aside className="space-y-3 lg:border-l lg:border-slate-100 lg:pl-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Контекст поездки</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${toneClasses(focusAction.tone)}`}>
                  {focusAction.lifecycleLabel}
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600">
                  {focusAction.statusLabel}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {focusAction.tripWindowLabel ?? 'Окно поездки ещё уточняется'}{focusAction.attentionLabel ? ` · ${focusAction.attentionLabel}` : ''}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Портфель действий</div>
              <div className="mt-2 text-2xl font-semibold text-slate-900">{actions.length}</div>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Спокойный слой внимания по всем поездкам сразу, без смешения со списком контейнеров и без подмены trip
                timeline.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="space-y-4">
        {groups.map((group) => {
          const muted = group.id === 'later' || group.id === 'post_trip';
          return (
            <div key={group.id}>
              <div className="mb-2.5 flex items-center gap-3">
                <h3 className={`text-sm font-semibold ${muted ? 'text-slate-600' : 'text-slate-900'}`}>{group.label}</h3>
                <span className="truncate text-xs text-slate-400">· {group.description}</span>
                <span className={`ml-auto rounded-full border px-2 py-0.5 text-[11px] ${muted ? 'border-slate-200 bg-white text-slate-500' : 'border-sky-100 bg-sky-50 text-sky-700'}`}>
                  {group.actions.length}
                </span>
              </div>
              <div className={`overflow-hidden rounded-2xl border bg-white ${muted ? 'border-slate-100' : 'border-slate-200'} shadow-sm`}>
                {group.actions.map((action) => (
                  <Link
                    key={action.id}
                    href={action.tripHref}
                    className="flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-slate-50"
                  >
                    <span className={`mt-0.5 rounded-lg border px-2 py-1 text-[11px] font-medium ${toneClasses(action.tone)}`}>
                      {action.horizonLabel}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-medium leading-snug text-slate-900">{action.title}</span>
                      <span className="mt-1 line-clamp-1 block text-sm leading-relaxed text-slate-700">{action.description}</span>
                      <span className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                        <span>{action.tripTitle}</span>
                        <span>·</span>
                        <span>{action.lifecycleLabel}</span>
                        <span>·</span>
                        <span>{action.timingLabel}</span>
                        {action.attentionLabel ? <span>{action.attentionLabel}</span> : null}
                      </span>
                    </span>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-300" />
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <OrganizerActionTimelineSurface actions={actions} scale={overviewScale} onScaleChange={onOverviewScaleChange} />
    </div>
  );
}
