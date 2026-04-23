'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { generated } from '@go2asia/sdk';
import {
  AlertTriangle,
  Eye,
  Loader2,
  Route,
  ShieldCheck,
  Telescope,
} from 'lucide-react';
import {
  formatCityLabel,
  formatDifficultyLabel,
  getQuestSummary,
  getStepHintChips,
  getStepPresentation,
  getVerificationLabel,
} from '@/app/(public)/quest/questPresentation';
import { getQuestHeroMediaRuntimeFirst } from '@/app/(public)/quest/questRuntimeMetadata';
import { fetchOwnedQuest, fetchOwnedQuestStats, type QuestProApiError } from './QuestProApi';
import { QuestCuratorStatsBlock } from './QuestCuratorStatsBlock';
import { QuestDraftEditor } from './QuestDraftEditor';
import { QuestLifecycleControls } from './QuestLifecycleControls';
import { QuestReviewQueue } from './QuestReviewQueue';

interface QuestProDetailPageProps {
  questId: string;
}

function formatDate(value?: string | null): string {
  if (!value) return 'Дата недоступна';
  try {
    return new Date(value).toLocaleDateString('ru-RU');
  } catch {
    return value;
  }
}

function readDetailError(error: QuestProApiError | null): string {
  if (!error) return 'Не удалось загрузить Quest management detail.';
  if (error.status === 401) return 'Нужна авторизация для owner-scoped quest detail.';
  if (error.status === 403) return 'У вас нет доступа к этому квесту в management context.';
  if (error.status === 404) return 'Квест не найден в owner-scoped management path.';
  if (error.status === 500 || error.status === 503) return 'Quest management API временно недоступен.';
  return error.message || error.error?.message || 'Не удалось загрузить Quest management detail.';
}

function getStatusClasses(status?: string | null): string {
  if (status === 'published') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  if (status === 'archived') return 'border-slate-300 bg-slate-100 text-slate-700';
  return 'border-amber-200 bg-amber-50 text-amber-700';
}

function getVisibilityClasses(visibility?: string | null): string {
  if (visibility === 'private') return 'border-slate-300 bg-slate-100 text-slate-700';
  return 'border-sky-200 bg-sky-50 text-sky-700';
}

function getReadinessNotes(quest: generated.QuestDetailResponse): string[] {
  const notes: string[] = [];
  if (quest.status === 'draft' && quest.steps.length === 0) {
    notes.push('Draft пока не готов к publish: нет ни одного шага.');
  }
  if (quest.status === 'draft' && quest.steps.length > 0) {
    notes.push('Draft содержит шаги: publish control теперь доступен через lifecycle panel справа.');
  }
  if (quest.steps.some((step) => step.verificationType === 'manual')) {
    notes.push('Есть manual review шаги: review queue actions доступны в отдельном per-quest блоке справа.');
  }
  if (quest.status === 'published') {
    notes.push('Published quest можно архивировать через bounded lifecycle control без открытия отдельного workflow экрана.');
  }
  if (quest.status === 'archived') {
    notes.push('Archived quest остаётся read-only: restore или unpublish flows в текущий slice не входят.');
  }
  if (notes.length === 0) {
    notes.push('Management detail показывает bounded readiness context без workflow platform semantics.');
  }
  return notes;
}

export function QuestProDetailPage({ questId }: QuestProDetailPageProps) {
  const { user, isLoaded } = useUser();
  const [quest, setQuest] = useState<generated.QuestDetailResponse | null>(null);
  const [stats, setStats] = useState<generated.QuestOperationalStatsResponse | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadQuestDetail(): Promise<void> {
      setLoading(true);
      setError(null);
      const [questResponse, statsResponse] = await Promise.all([fetchOwnedQuest(questId), fetchOwnedQuestStats(questId)]);
      if (cancelled) return;

      if (!questResponse.data) {
        setQuest(null);
        setStats(null);
        setStatsError(null);
        setError(readDetailError(questResponse.error));
      } else {
        setQuest(questResponse.data);
        setStats(statsResponse.data);
        setStatsError(statsResponse.data ? null : 'Не удалось загрузить curator stats. Остальной management detail остаётся доступен.');
      }

      setLoading(false);
    }

    void loadQuestDetail();
    return () => {
      cancelled = true;
    };
  }, [questId]);

  async function reloadQuest(): Promise<void> {
    const questResponse = await fetchOwnedQuest(questId);
    if (!questResponse.data) {
      setError(readDetailError(questResponse.error));
      return;
    }

    setQuest(questResponse.data);
    setError(null);
  }

  async function reloadStats(): Promise<void> {
    const statsResponse = await fetchOwnedQuestStats(questId);
    if (statsResponse.data) {
      setStats(statsResponse.data);
      setStatsError(null);
      return;
    }

    setStats(null);
    setStatsError('Не удалось обновить curator stats. Блок ниже показывает, что значения сейчас недоступны.');
  }

  const readinessNotes = useMemo(() => (quest ? getReadinessNotes(quest) : []), [quest]);

  if (!isLoaded) {
    return <p className="text-sm text-slate-600">Загрузка Quest management detail…</p>;
  }

  if (!user?.id) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950">
        Войдите в аккаунт PRO, чтобы открыть Quest management detail.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-600">
        <Loader2 className="h-4 w-4 animate-spin" />
        Загружаем owner-scoped Quest detail...
      </div>
    );
  }

  if (error || !quest) {
    return (
      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-800">
        {error ?? 'Quest management detail недоступен.'}
      </div>
    );
  }

  const hero = getQuestHeroMediaRuntimeFirst(quest);

  return (
    <div className="space-y-8 pb-16">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {hero ? (
          <div className="relative aspect-[3/1] w-full bg-slate-100">
            <Image
              src={hero.url}
              alt={hero.alt}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ) : null}

        <div className="space-y-5 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(quest.status)}`}>
                  {quest.status}
                </span>
                <span className={`rounded-full border px-3 py-1 text-xs font-medium ${getVisibilityClasses(quest.visibility)}`}>
                  {quest.visibility}
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                  {formatDifficultyLabel(quest.difficulty)}
                </span>
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{quest.title}</h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">{getQuestSummary(quest.description)}</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-medium text-slate-900">Quest management detail</p>
              <p className="mt-1">Read-first view поверх owner-scoped backend seams.</p>
            </div>
          </div>

          <dl className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <dt className="text-xs uppercase tracking-wide text-slate-500">Город</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">{formatCityLabel(quest.cityId)}</dd>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <dt className="text-xs uppercase tracking-wide text-slate-500">Тема</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">{quest.theme ?? 'Не задана'}</dd>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <dt className="text-xs uppercase tracking-wide text-slate-500">Создан</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">{formatDate(quest.createdAt)}</dd>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <dt className="text-xs uppercase tracking-wide text-slate-500">Обновлён</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">{formatDate(quest.updatedAt)}</dd>
            </div>
          </dl>

          <div className="flex flex-wrap gap-2">
            {quest.status === 'draft' ? (
              <span className="inline-flex items-center rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-sm text-violet-700">
                Draft editing UI active in this slice
              </span>
            ) : (
              <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500">
                Draft editing доступен только для draft
              </span>
            )}
            <span className="inline-flex items-center rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-sm text-violet-700">
              <Route className="mr-2 h-4 w-4" />
              Lifecycle controls active in this slice
            </span>
            <span className="inline-flex items-center rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-sm text-violet-700">
              <Eye className="mr-2 h-4 w-4" />
              Review queue active in this slice
            </span>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="space-y-6">
          <QuestDraftEditor quest={quest} onQuestChanged={setQuest} onReloadQuest={reloadQuest} />

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Route className="h-5 w-5 text-violet-600" />
              <h2 className="text-lg font-semibold text-slate-900">Step list</h2>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Структура квеста по-прежнему видна в management context. В UI-2 edit controls доступны внутри draft workspace, а этот блок остаётся удобным read snapshot.
            </p>

            {quest.steps.length === 0 ? (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                У квеста пока нет шагов. Это видно уже на UI-1 и помогает оценить draft readiness без открытия step editor.
              </div>
            ) : (
              <ol className="mt-4 space-y-4">
                {quest.steps.map((step) => {
                  const presentation = getStepPresentation(step);
                  const chips = getStepHintChips(step);
                  return (
                    <li key={step.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
                          Шаг {step.order}
                        </span>
                        <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700">
                          {presentation.stepBadge}
                        </span>
                        <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700">
                          {getVerificationLabel(step)}
                        </span>
                      </div>
                      <h3 className="mt-3 text-base font-semibold text-slate-900">{presentation.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {presentation.shortInstruction ?? presentation.description ?? 'Описание шага появится в richer editing wave.'}
                      </p>
                      {chips.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {chips.map((chip) => (
                            <span
                              key={`${step.id}-${chip}`}
                              className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700"
                            >
                              {chip}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ol>
            )}
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <h2 className="text-lg font-semibold text-slate-900">Readiness and guardrails</h2>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Management detail показывает bounded readiness context и lifecycle controls, а review/builder flows по-прежнему intentionally вынесены в отдельные slices.
            </p>
            <ul className="mt-4 space-y-3">
              {readinessNotes.map((note) => (
                <li key={note} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {note}
                </li>
              ))}
            </ul>
          </article>
        </div>

        <div className="space-y-6">
          <QuestLifecycleControls quest={quest} stats={stats} onQuestChanged={setQuest} />

          <QuestCuratorStatsBlock stats={stats} statsError={statsError} />

          <QuestReviewQueue questId={quest.id} steps={quest.steps} onQueueChanged={reloadStats} />

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Telescope className="h-5 w-5 text-violet-600" />
              <h2 className="text-lg font-semibold text-slate-900">What comes next</h2>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                Richer builder semantics для step ordering и более guided authoring.
              </li>
              <li className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                Broader operational insights beyond the current bounded stats block.
              </li>
              <li className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                Optional cross-quest moderation workflows only if the product scope explicitly expands later.
              </li>
            </ul>
            <div className="mt-4">
              <Link href="/quest/pro" className="text-sm font-medium text-violet-700 hover:text-violet-800">
                Вернуться к My quests
              </Link>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
