'use client';

import { useMemo, useState } from 'react';
import { generated } from '@go2asia/sdk';
import { Archive, AlertTriangle, CheckCircle2, Loader2, Rocket } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  archiveManagedQuest,
  publishManagedQuest,
  type QuestProApiError,
} from './QuestProApi';

type QuestLifecycleControlsProps = {
  quest: generated.QuestDetailResponse;
  stats: generated.QuestOperationalStatsResponse | null;
  onQuestChanged: (quest: generated.QuestDetailResponse) => void;
};

function hasSequentialStepOrders(steps: generated.QuestStepResponse[]): boolean {
  const sortedOrders = [...steps].map((step) => step.order).sort((left, right) => left - right);
  return sortedOrders.every((order, index) => order === index + 1);
}

function readLifecycleError(error: QuestProApiError | null, fallback: string): string {
  if (!error) return fallback;
  if (error.status === 401) return 'Нужна PRO авторизация для lifecycle actions.';
  if (error.status === 403) return error.error?.message || error.message || 'Lifecycle action недоступен для этого пользователя.';
  if (error.status === 404) return 'Квест больше не найден в management context.';
  if (error.status === 409) {
    return error.error?.message || error.message || 'Lifecycle action отклонён из-за текущего статуса или blockers.';
  }
  if (error.status === 500 || error.status === 503) {
    return 'Quest lifecycle API временно недоступен.';
  }
  return error.error?.message || error.message || fallback;
}

function getLifecycleSummary(quest: generated.QuestDetailResponse): string {
  if (quest.status === 'draft') {
    return 'Черновик можно опубликовать, когда квест содержит хотя бы один шаг и порядок шагов остаётся последовательным.';
  }
  if (quest.status === 'published') {
    return 'Published квест доступен игрокам. В этом slice можно только архивировать его bounded-способом.';
  }
  return 'Archived квест остаётся read-only. Восстановление или перевод обратно в другой статус вне текущего scope.';
}

export function QuestLifecycleControls({ quest, stats, onQuestChanged }: QuestLifecycleControlsProps) {
  const [submittingAction, setSubmittingAction] = useState<'publish' | 'archive' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const publishBlockers = useMemo(() => {
    const blockers: string[] = [];
    if (quest.steps.length === 0) {
      blockers.push('Для publish нужен хотя бы один шаг.');
    }
    if (quest.steps.length > 0 && !hasSequentialStepOrders(quest.steps)) {
      blockers.push('Порядок шагов должен быть последовательным без пропусков.');
    }
    return blockers;
  }, [quest]);

  const archiveBlockers = useMemo(() => {
    const blockers: string[] = [];
    if ((stats?.pendingReviewCount ?? 0) > 0) {
      blockers.push('Есть pending review submissions: сначала нужно закрыть review queue в следующем slice.');
    }
    return blockers;
  }, [stats]);

  const publishEnabled = quest.status === 'draft' && publishBlockers.length === 0 && !submittingAction;
  const archiveEnabled = quest.status === 'published' && archiveBlockers.length === 0 && !submittingAction;

  async function handlePublish(): Promise<void> {
    const confirmed = window.confirm(
      'Опубликовать этот draft quest? После publish он выйдет из draft-only режима, а возвратный lifecycle flow не входит в текущий slice.'
    );
    if (!confirmed) return;

    setSubmittingAction('publish');
    setError(null);
    const response = await publishManagedQuest(quest.id);
    setSubmittingAction(null);

    if (!response.data) {
      setError(readLifecycleError(response.error, 'Не удалось опубликовать quest.'));
      return;
    }

    onQuestChanged(response.data);
    toast.success('Quest опубликован');
  }

  async function handleArchive(): Promise<void> {
    const confirmed = window.confirm(
      'Архивировать published quest? UI-3 не включает restore/unarchive flow, поэтому архивирование остаётся bounded operational action.'
    );
    if (!confirmed) return;

    setSubmittingAction('archive');
    setError(null);
    const response = await archiveManagedQuest(quest.id);
    setSubmittingAction(null);

    if (!response.data) {
      setError(readLifecycleError(response.error, 'Не удалось архивировать quest.'));
      return;
    }

    onQuestChanged(response.data);
    toast.success('Quest архивирован');
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-violet-600" />
        <h2 className="text-lg font-semibold text-slate-900">Lifecycle</h2>
      </div>
      <p className="mt-1 text-sm text-slate-600">{getLifecycleSummary(quest)}</p>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">Current state</p>
        <p className="mt-1 text-base font-semibold text-slate-900">{quest.status}</p>
        <p className="mt-2 text-sm text-slate-600">
          {quest.status === 'draft' && 'Доступно действие: publish.'}
          {quest.status === 'published' && 'Доступно действие: archive.'}
          {quest.status === 'archived' && 'Lifecycle actions в этом статусе не поддерживаются.'}
        </p>
      </div>

      {quest.status === 'draft' ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <Rocket className="h-4 w-4 text-violet-600" />
            <p className="text-sm font-medium text-slate-900">Publish control</p>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Publish остаётся одношаговым action без wizard. Предпроверка на этом экране ограничена только детерминируемыми условиями из detail.
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {publishBlockers.length === 0 ? (
              <li className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-800">
                Минимальная publish readiness выглядит зелёной: шаги есть и порядок последовательный.
              </li>
            ) : (
              publishBlockers.map((blocker) => (
                <li key={blocker} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900">
                  {blocker}
                </li>
              ))
            )}
          </ul>
          <button
            type="button"
            onClick={handlePublish}
            disabled={!publishEnabled}
            className="mt-4 inline-flex items-center rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-300"
          >
            {submittingAction === 'publish' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Rocket className="mr-2 h-4 w-4" />}
            {submittingAction === 'publish' ? 'Публикуем...' : 'Publish quest'}
          </button>
        </div>
      ) : null}

      {quest.status === 'published' ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <Archive className="h-4 w-4 text-violet-600" />
            <p className="text-sm font-medium text-slate-900">Archive control</p>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Archive доступен только для published. Сервер может заблокировать действие, если ещё есть active progress или незакрытые pending submissions.
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {archiveBlockers.length > 0 ? (
              archiveBlockers.map((blocker) => (
                <li key={blocker} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900">
                  {blocker}
                </li>
              ))
            ) : (
              <li className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700">
                Pending review submissions по текущим данным нет. Если archive всё равно отклонится, сервер покажет точную причину конфликта.
              </li>
            )}
            <li className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700">
              Active progress count в UI-3 не моделируется отдельным dashboard-слоем, поэтому окончательная проверка остаётся на backend seam.
            </li>
          </ul>
          <button
            type="button"
            onClick={handleArchive}
            disabled={!archiveEnabled}
            className="mt-4 inline-flex items-center rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {submittingAction === 'archive' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Archive className="mr-2 h-4 w-4" />}
            {submittingAction === 'archive' ? 'Архивируем...' : 'Archive quest'}
          </button>
        </div>
      ) : null}

      {quest.status === 'archived' ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          Lifecycle action в этом статусе не доступен. Unarchive / restore deliberately оставлены вне scope текущего bounded slice.
        </div>
      ) : null}

      {error ? (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{error}</div>
      ) : null}

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p>
            UI-3 deliberately не открывает review actions, restore/unpublish flows, analytics dashboard или workflow engine. Здесь только bounded
            publish/archive controls и понятный operational context.
          </p>
        </div>
      </div>
    </article>
  );
}
