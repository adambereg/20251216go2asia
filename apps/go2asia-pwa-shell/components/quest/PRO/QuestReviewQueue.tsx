'use client';

import { useEffect, useMemo, useState } from 'react';
import { generated } from '@go2asia/sdk';
import { Check, Eye, Loader2, MessageSquareWarning, RefreshCcw, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { getStepPresentation } from '@/app/(public)/quest/questPresentation';
import {
  fetchQuestReviewQueue,
  type QuestProApiError,
  reviewQuestSubmissionByManager,
} from './QuestProApi';

type QuestReviewQueueProps = {
  questId: string;
  steps: generated.QuestStepResponse[];
  onQueueChanged?: () => Promise<void>;
};

type QueueStatusFilter = generated.SubmissionStatusFilterParameter | 'all';

const statusOptions: Array<{ value: QueueStatusFilter; label: string }> = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'all', label: 'All statuses' },
];

function getSubmissionStatusClasses(status: generated.QuestSubmissionStatus): string {
  if (status === 'approved') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  if (status === 'rejected') return 'border-rose-200 bg-rose-50 text-rose-700';
  return 'border-amber-200 bg-amber-50 text-amber-700';
}

function formatDateTime(value?: string | null): string {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString('ru-RU');
  } catch {
    return value;
  }
}

function shortenUserId(value: string): string {
  if (value.length <= 16) return value;
  return `${value.slice(0, 7)}...${value.slice(-6)}`;
}

function readQueueError(error: QuestProApiError | null, fallback: string): string {
  if (!error) return fallback;
  if (error.status === 401) return 'Нужна авторизация для review queue.';
  if (error.status === 403) return error.error?.message || error.message || 'У вас нет прав для review этой очереди.';
  if (error.status === 404) return 'Квест или submission не найден в management context.';
  if (error.status === 409) return error.error?.message || error.message || 'Submission уже был обработан другим оператором.';
  if (error.status === 400) return error.error?.message || error.message || 'Параметры фильтра или payload не прошли валидацию.';
  if (error.status === 500 || error.status === 503) return 'Review queue API временно недоступен.';
  return error.error?.message || error.message || fallback;
}

function formatProofSummary(proofData: unknown): string {
  if (!proofData || typeof proofData !== 'object' || Array.isArray(proofData)) return 'No proof payload';
  const payload = proofData as Record<string, unknown>;
  if (typeof payload.mediaId === 'string' && payload.mediaId) return `mediaId: ${payload.mediaId}`;
  if (typeof payload.text === 'string' && payload.text.trim()) return payload.text.trim().slice(0, 80);
  if (typeof payload.qrCode === 'string' && payload.qrCode.trim()) return `qr: ${payload.qrCode.trim().slice(0, 80)}`;
  if (typeof payload.spacePostId === 'string' && payload.spacePostId) return `spacePostId: ${payload.spacePostId}`;
  if (typeof payload.latitude === 'number' && typeof payload.longitude === 'number') {
    return `geo: ${payload.latitude.toFixed(4)}, ${payload.longitude.toFixed(4)}`;
  }
  const compact = JSON.stringify(payload);
  return compact.length > 100 ? `${compact.slice(0, 100)}...` : compact;
}

export function QuestReviewQueue({ questId, steps, onQueueChanged }: QuestReviewQueueProps) {
  const [statusFilter, setStatusFilter] = useState<QueueStatusFilter>('pending');
  const [stepFilter, setStepFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [submissions, setSubmissions] = useState<generated.QuestSubmissionListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReasonById, setRejectReasonById] = useState<Record<string, string>>({});

  const stepLabelById = useMemo(() => {
    const mapping = new Map<string, string>();
    for (const step of steps) {
      const presentation = getStepPresentation(step);
      mapping.set(step.id, `Шаг ${step.order}: ${presentation.title}`);
    }
    return mapping;
  }, [steps]);

  useEffect(() => {
    let cancelled = false;
    async function loadQueue(): Promise<void> {
      setLoading(true);
      setError(null);
      const response = await fetchQuestReviewQueue(questId, {
        status: statusFilter,
        stepId: stepFilter,
        page,
        pageSize,
      });

      if (cancelled) return;

      if (!response.data) {
        setSubmissions(null);
        setError(readQueueError(response.error, 'Не удалось загрузить review queue.'));
      } else {
        setSubmissions(response.data);
      }
      setLoading(false);
    }

    void loadQueue();
    return () => {
      cancelled = true;
    };
  }, [page, pageSize, questId, statusFilter, stepFilter]);

  const total = submissions?.total ?? 0;
  const items = submissions?.items ?? [];
  const totalPages = total > 0 ? Math.ceil(total / pageSize) : 1;

  async function reloadQueue(): Promise<void> {
    const response = await fetchQuestReviewQueue(questId, {
      status: statusFilter,
      stepId: stepFilter,
      page,
      pageSize,
    });

    if (!response.data) {
      setError(readQueueError(response.error, 'Не удалось обновить review queue.'));
      return;
    }

    setSubmissions(response.data);
    setError(null);
  }

  async function handleDecision(submissionId: string, decision: generated.ReviewSubmissionRequestDecision): Promise<void> {
    const reasonRaw = rejectReasonById[submissionId] ?? '';
    const reason = reasonRaw.trim();
    if (decision === 'reject' && !reason) {
      setError('Для reject укажите причину, чтобы rejection context был полезен команде.');
      return;
    }

    setSubmittingId(submissionId);
    setError(null);

    const response = await reviewQuestSubmissionByManager(submissionId, {
      decision,
      reason: decision === 'reject' ? reason : undefined,
    });

    setSubmittingId(null);

    if (!response.data) {
      setError(readQueueError(response.error, 'Не удалось выполнить review action.'));
      await reloadQueue();
      return;
    }

    toast.success(decision === 'approve' ? 'Submission approved' : 'Submission rejected');
    setRejectingId(null);
    setRejectReasonById((current) => ({ ...current, [submissionId]: '' }));
    await reloadQueue();
    if (onQueueChanged) {
      await onQueueChanged();
    }
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-violet-600" />
          <h2 className="text-lg font-semibold text-slate-900">Review queue</h2>
        </div>
        <button
          type="button"
          onClick={() => {
            void reloadQueue();
          }}
          disabled={loading || submittingId != null}
          className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Обновить
        </button>
      </div>
      <p className="mt-1 text-sm text-slate-600">
        Per-quest review queue для manual verification. UI ограничен фильтрами и approve/reject actions без перехода к moderation platform.
      </p>

      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <label className="block">
          <span className="text-sm font-medium text-slate-800">Status</span>
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as QueueStatusFilter);
              setPage(1);
            }}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-800">Step</span>
          <select
            value={stepFilter}
            onChange={(event) => {
              setStepFilter(event.target.value);
              setPage(1);
            }}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
          >
            <option value="all">All steps</option>
            {steps.map((step) => {
              const label = stepLabelById.get(step.id) ?? step.id;
              return (
                <option key={step.id} value={step.id}>
                  {label}
                </option>
              );
            })}
          </select>
        </label>

        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
          <p className="text-xs uppercase tracking-wide text-slate-500">Total</p>
          <p className="mt-1 font-semibold text-slate-900">{total}</p>
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{error}</div>
      ) : null}

      {loading ? (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <Loader2 className="h-4 w-4 animate-spin" />
          Загружаем submissions...
        </div>
      ) : items.length === 0 ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          {statusFilter === 'pending'
            ? 'Pending submissions пока нет. Когда игроки отправят proof, они появятся здесь.'
            : 'Для выбранных фильтров submissions не найдены.'}
        </div>
      ) : (
        <ol className="mt-4 space-y-3">
          {items.map((submission) => {
            const stepLabel = stepLabelById.get(submission.stepId) ?? `Step ${submission.stepId}`;
            const isPending = submission.status === 'pending';
            const isSubmitting = submittingId === submission.id;
            const rejectReason = rejectReasonById[submission.id] ?? '';
            return (
              <li key={submission.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getSubmissionStatusClasses(submission.status)}`}>
                        {submission.status}
                      </span>
                      <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700">
                        {submission.proofType}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-slate-900">{stepLabel}</p>
                    <p className="mt-1 text-xs text-slate-600">
                      User: {shortenUserId(submission.userId)} · Created: {formatDateTime(submission.createdAt)}
                    </p>
                  </div>
                  <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600">{submission.id}</span>
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Proof summary</p>
                    <p className="mt-1 text-sm text-slate-800">{formatProofSummary(submission.proofData)}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Review context</p>
                    <p className="mt-1 text-sm text-slate-800">Reviewed at: {formatDateTime(submission.reviewedAt)}</p>
                    <p className="mt-1 text-sm text-slate-800">Reviewed by: {submission.reviewedBy ?? '—'}</p>
                    {submission.status === 'rejected' ? (
                      <p className="mt-1 text-sm text-rose-700">Reason: {submission.rejectionReason ?? 'Не указана'}</p>
                    ) : null}
                  </div>
                </div>

                {isPending ? (
                  <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          void handleDecision(submission.id, 'approve');
                        }}
                        disabled={isSubmitting}
                        className="inline-flex items-center rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                      >
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRejectingId((current) => (current === submission.id ? null : submission.id));
                        }}
                        disabled={isSubmitting}
                        className="inline-flex items-center rounded-lg border border-rose-300 bg-white px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Reject
                      </button>
                    </div>

                    {rejectingId === submission.id ? (
                      <div className="mt-3">
                        <label className="block">
                          <span className="text-sm font-medium text-slate-800">Rejection reason</span>
                          <textarea
                            value={rejectReason}
                            onChange={(event) =>
                              setRejectReasonById((current) => ({ ...current, [submission.id]: event.target.value }))
                            }
                            rows={3}
                            maxLength={500}
                            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                            placeholder="Коротко объясните причину отклонения..."
                          />
                        </label>
                        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                          <span>Причина сохраняется как rejection context в submission.</span>
                          <span>{rejectReason.length}/500</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            void handleDecision(submission.id, 'reject');
                          }}
                          disabled={isSubmitting}
                          className="mt-2 inline-flex items-center rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-300"
                        >
                          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquareWarning className="mr-2 h-4 w-4" />}
                          Confirm reject
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
      )}

      <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        <p>
          Страница {page} из {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={loading || page <= 1}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Назад
          </button>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={loading || page >= totalPages}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Вперёд
          </button>
        </div>
      </div>
    </article>
  );
}
