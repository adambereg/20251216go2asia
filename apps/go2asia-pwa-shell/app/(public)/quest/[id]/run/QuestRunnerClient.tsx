'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Loader2, RefreshCcw } from 'lucide-react';
import { quest } from '@go2asia/sdk';
import type {
  QuestDetailResponse,
  QuestProgressResponse,
  QuestProofType,
  QuestStepResponse,
  QuestSubmissionResponse,
} from '@go2asia/sdk/quest';

interface QuestRunnerClientProps {
  quest: QuestDetailResponse;
}

type ApiErrorShape = {
  status?: number;
  error?: {
    code?: string;
    message?: string;
  };
};

function readErrorMessage(error: unknown): string {
  const value = error as ApiErrorShape;
  if (value?.error?.message) return value.error.message;
  if (value?.status) return `Request failed (${value.status})`;
  return 'Unexpected runtime error.';
}

function mapProofType(step: QuestStepResponse): QuestProofType {
  if (step.verificationType === 'geo') return 'geo';
  if (step.verificationType === 'qr') return 'qr';
  if (step.verificationType === 'space_post') return 'space_post';
  if (step.type === 'photo_proof') return 'photo';
  return 'text';
}

function getDefaultProofData(proofType: QuestProofType): Record<string, unknown> {
  if (proofType === 'geo') return { lat: 0, lng: 0 };
  if (proofType === 'qr') return { code: 'sample-code' };
  if (proofType === 'space_post') return { postId: 'sample-post-id' };
  if (proofType === 'photo') return { mediaId: 'sample-media-id' };
  return { text: 'sample proof text' };
}

function getCurrentStep(progress: QuestProgressResponse | null, steps: QuestStepResponse[]): QuestStepResponse | null {
  if (!progress) return null;
  if (progress.status !== 'in_progress') return null;
  if (!progress.currentStep) return null;
  return steps.find((step) => step.order === progress.currentStep) ?? null;
}

export function QuestRunnerClient({ quest: questDetail }: QuestRunnerClientProps) {
  const [progress, setProgress] = useState<QuestProgressResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSubmission, setLastSubmission] = useState<QuestSubmissionResponse | null>(null);
  const [proofType, setProofType] = useState<QuestProofType>('text');
  const [proofDataText, setProofDataText] = useState('{\n  "text": "sample proof text"\n}');

  const currentStep = useMemo(() => getCurrentStep(progress, questDetail.steps), [progress, questDetail.steps]);

  useEffect(() => {
    if (!currentStep) return;
    const mapped = mapProofType(currentStep);
    setProofType(mapped);
    setProofDataText(JSON.stringify(getDefaultProofData(mapped), null, 2));
  }, [currentStep?.id]);

  const loadProgress = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const started = await quest.startQuest(questDetail.id);
      setProgress(started);
    } catch (startError) {
      const message = readErrorMessage(startError);
      setError(message);
      setProgress(null);
    } finally {
      setLoading(false);
    }
  }, [questDetail.id]);

  const refreshProgress = useCallback(async () => {
    setError(null);
    try {
      const next = await quest.fetchQuestProgress(questDetail.id);
      setProgress(next);
    } catch (progressError) {
      setError(readErrorMessage(progressError));
    }
  }, [questDetail.id]);

  useEffect(() => {
    void loadProgress();
  }, [loadProgress]);

  const handleSubmitStep = useCallback(async () => {
    if (!currentStep) return;
    setSubmitting(true);
    setError(null);
    try {
      const proofData = JSON.parse(proofDataText) as Record<string, unknown>;
      const response = await quest.submitQuestStep(questDetail.id, currentStep.id, {
        proofType,
        proofData,
      });
      setLastSubmission(response);
      await refreshProgress();
    } catch (submitError) {
      if (submitError instanceof SyntaxError) {
        setError('Proof data must be valid JSON.');
      } else {
        setError(readErrorMessage(submitError));
      }
    } finally {
      setSubmitting(false);
    }
  }, [currentStep, proofDataText, proofType, questDetail.id, refreshProgress]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h1 className="text-2xl font-bold text-slate-900">{questDetail.title}</h1>
          <p className="text-sm text-slate-600 mt-2">
            Quest runtime lifecycle: start → progress → submit → review/completion.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void refreshProgress()}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              <RefreshCcw className="w-4 h-4" />
              Refresh progress
            </button>
            <Link
              href={`/quest/${questDetail.id}`}
              className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              Back to quest detail
            </Link>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          {loading ? (
            <div className="flex items-center gap-2 text-slate-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              Initializing quest progress...
            </div>
          ) : !progress ? (
            <p className="text-sm text-slate-700">Progress is unavailable right now.</p>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-slate-900">Current progress</h2>
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-slate-500">status</p>
                  <p className="font-medium text-slate-900">{progress.status}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-slate-500">current step</p>
                  <p className="font-medium text-slate-900">{progress.currentStep ?? 'n/a'}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-slate-500">total steps</p>
                  <p className="font-medium text-slate-900">{progress.totalSteps}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-slate-500">started</p>
                  <p className="font-medium text-slate-900">
                    {new Date(progress.startedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {progress.status === 'pending_review' ? (
                <p className="mt-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  Progress is waiting for manual review. New submissions are blocked until review result.
                </p>
              ) : null}
              {progress.status === 'completed' ? (
                <p className="mt-4 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                  Quest is completed. Reward/ledger flows may still depend on downstream integrations.
                </p>
              ) : null}
              {progress.status === 'failed' || progress.status === 'expired' ? (
                <p className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                  Quest is not active ({progress.status}). Submission is unavailable in this state.
                </p>
              ) : null}
            </>
          )}
        </div>

        {currentStep ? (
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Current step</h2>
            <p className="text-sm text-slate-600 mt-2">
              step #{currentStep.order} · {currentStep.type} · verification {currentStep.verificationType}
            </p>
            <p className="text-sm text-slate-600">
              target: {currentStep.targetType || 'n/a'} {currentStep.targetId ? `(${currentStep.targetId})` : ''}
            </p>
            <p className="text-sm text-slate-600">reward points: {currentStep.rewardPoints ?? 0}</p>

            <div className="mt-5">
              <label htmlFor="proofType" className="block text-sm font-medium text-slate-700 mb-2">
                Proof type
              </label>
              <select
                id="proofType"
                value={proofType}
                onChange={(event) => setProofType(event.target.value as QuestProofType)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="text">text</option>
                <option value="photo">photo</option>
                <option value="geo">geo</option>
                <option value="qr">qr</option>
                <option value="space_post">space_post</option>
              </select>
            </div>

            <div className="mt-4">
              <label htmlFor="proofData" className="block text-sm font-medium text-slate-700 mb-2">
                Proof data (JSON)
              </label>
              <textarea
                id="proofData"
                value={proofDataText}
                onChange={(event) => setProofDataText(event.target.value)}
                rows={8}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono"
              />
            </div>

            <button
              type="button"
              onClick={() => void handleSubmitStep()}
              disabled={submitting || !progress || progress.status !== 'in_progress'}
              className="mt-4 inline-flex items-center rounded-lg bg-purple-600 text-white px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit current step'}
            </button>
            <p className="mt-3 text-xs text-slate-500">
              Submit writes real runtime proof data. Validation/review may accept, reject, or delay completion.
            </p>
          </div>
        ) : null}

        {lastSubmission ? (
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Last submission</h2>
            <p className="mt-2 text-sm text-slate-600">id: {lastSubmission.id}</p>
            <p className="text-sm text-slate-600">status: {lastSubmission.status}</p>
            <p className="text-sm text-slate-600">proof type: {lastSubmission.proofType}</p>
            <p className="text-sm text-slate-600">
              reviewed: {lastSubmission.reviewedAt ? new Date(lastSubmission.reviewedAt).toLocaleString() : 'pending'}
            </p>
          </div>
        ) : null}

        {error ? (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        ) : null}
      </div>
    </div>
  );
}
