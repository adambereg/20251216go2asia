'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AlertCircle, CheckCircle2, Loader2, RefreshCcw } from 'lucide-react';
import { quest } from '@go2asia/sdk';
import { resolveMediaUrl } from '@go2asia/sdk/media';
import type {
  QuestApiError,
  QuestDetailResponse,
  QuestProgressResponse,
  QuestProofType,
  QuestStepResponse,
  QuestSubmissionResponse,
} from '@go2asia/sdk/quest';
import {
  getProgressStatusLabel,
  getStepEmphasisClasses,
  getStepHintChips,
  getStepIcon,
  getStepPresentation,
  getSubmissionStatusLabel,
  getVerificationLabel,
  getQuestSummary,
} from '../../questPresentation';
import { getQuestStepMediaFallback } from '../../questMediaContent';

interface QuestRunnerClientProps {
  quest: QuestDetailResponse;
}

type ProofDraft = {
  text: string;
  mediaId: string;
  code: string;
  postId: string;
  lat: string;
  lng: string;
};

function readErrorMessage(error: unknown): string {
  const value = error as QuestApiError;
  if (value?.status === 401) return 'Нужно войти в аккаунт, чтобы начать маршрут и отправлять шаги.';
  if (value?.status === 403) return 'Сейчас это действие недоступно для вашего аккаунта.';
  if (value?.status === 404) return 'Данные маршрута сейчас недоступны.';
  if (value?.status === 409) return value.message || 'Текущий статус маршрута пока не позволяет выполнить это действие.';
  if (value?.status === 503) return 'Сервис квестов временно недоступен.';
  if (value?.message) return value.message;
  if (value?.status) return `Не удалось выполнить запрос (${value.status})`;
  return 'Произошла непредвиденная ошибка.';
}

function mapProofType(step: QuestStepResponse): QuestProofType {
  if (step.verificationType === 'geo') return 'geo';
  if (step.verificationType === 'qr') return 'qr';
  if (step.verificationType === 'space_post') return 'space_post';
  if (step.type === 'photo_proof') return 'photo';
  return 'text';
}

function getDefaultProofDraft(proofType: QuestProofType): ProofDraft {
  return {
    text: proofType === 'text' ? '' : '',
    mediaId: '',
    code: '',
    postId: '',
    lat: '',
    lng: '',
  };
}

function getCurrentStep(progress: QuestProgressResponse | null, steps: QuestStepResponse[]): QuestStepResponse | null {
  if (!progress) return null;
  if (!progress.currentStep) return null;
  return steps.find((step) => step.order === progress.currentStep) ?? null;
}

function getLifecycleCopy(progress: QuestProgressResponse | null): { tone: string; text: string } {
  if (!progress) {
    return {
      tone: 'border-slate-200 bg-slate-50 text-slate-700',
      text: 'Прогресс пока недоступен. Попробуйте обновить экран или войти в аккаунт.',
    };
  }

  if (progress.status === 'in_progress') {
    return {
      tone: 'border-blue-200 bg-blue-50 text-blue-800',
      text: 'Маршрут активен. Выполняйте шаги по порядку и отправляйте подтверждение только для текущего шага.',
    };
  }

  if (progress.status === 'pending_review') {
    return {
      tone: 'border-amber-200 bg-amber-50 text-amber-800',
      text: 'Один из шагов отправлен на проверку. Пока проверка не завершится, следующий шаг будет недоступен.',
    };
  }

  if (progress.status === 'completed') {
    return {
      tone: 'border-emerald-200 bg-emerald-50 text-emerald-800',
      text: 'Маршрут завершён. Все шаги засчитаны, можно перейти к следующему маршруту.',
    };
  }

  if (progress.status === 'failed') {
    return {
      tone: 'border-red-200 bg-red-50 text-red-800',
      text: 'Последняя проверка не прошла. Исправьте данные шага и отправьте подтверждение повторно.',
    };
  }

  if (progress.status === 'expired') {
    return {
      tone: 'border-red-200 bg-red-50 text-red-800',
      text: 'Срок действия маршрута истёк. Экран остаётся только для просмотра, пока маршрут не будет активирован заново.',
    };
  }

  return {
    tone: 'border-slate-200 bg-slate-50 text-slate-700',
    text: 'Маршрут ещё не активирован.',
  };
}

function describeStepRuntime(step: QuestStepResponse): string {
  if (step.type === 'visit_partner') return 'Подтвердите визит в партнёрскую точку и переходите к следующему шагу.';
  if (step.type === 'attend_event') return 'Подтвердите участие в событии. Проверка может занять немного времени.';
  if (step.type === 'space_action') return 'Добавьте идентификатор опубликованного действия, чтобы мы зачли этот шаг.';
  if (step.verificationType === 'manual') return 'После отправки шаг может перейти на ручную проверку перед продолжением.';
  return 'Подтвердите этот шаг и переходите дальше по маршруту.';
}

function getProofTypeLabel(proofType: QuestProofType): string {
  if (proofType === 'geo') return 'Гео-подтверждение';
  if (proofType === 'qr') return 'QR-код';
  if (proofType === 'photo') return 'Фото-подтверждение';
  if (proofType === 'space_post') return 'Публичное действие';
  return 'Текстовое подтверждение';
}

function getReviewModeHint(reviewMode: string | null): string | null {
  if (!reviewMode) return null;
  if (reviewMode === 'auto') return 'Проверка обычно проходит автоматически.';
  if (reviewMode === 'manual') return 'Подтверждение проверяется вручную перед переходом к следующему шагу.';
  return null;
}

function getSubmissionStatusClasses(status?: string | null): string {
  if (status === 'approved') return 'border-emerald-200 bg-emerald-50 text-emerald-800';
  if (status === 'rejected') return 'border-red-200 bg-red-50 text-red-800';
  return 'border-amber-200 bg-amber-50 text-amber-800';
}

function getSubmitBlockedReason(progress: QuestProgressResponse | null): string | null {
  if (!progress) return 'Статус маршрута ещё загружается.';
  if (progress.status === 'in_progress') return null;
  if (progress.status === 'pending_review') return 'Сейчас шаг на проверке. Дождитесь результата и обновите статус.';
  if (progress.status === 'completed') return 'Маршрут уже завершён, новые подтверждения не требуются.';
  if (progress.status === 'failed') return 'Нужно обновить статус шага и отправить исправленное подтверждение.';
  if (progress.status === 'expired') return 'Срок маршрута истёк. Отправка подтверждений недоступна.';
  return 'Маршрут ещё не активирован.';
}

function getStepImage(questId: string, step: QuestStepResponse, stepImageKey: string | null, stepImageAlt: string | null) {
  const runtimeUrl = stepImageKey ? resolveMediaUrl(stepImageKey) : null;
  if (runtimeUrl) {
    return {
      url: runtimeUrl,
      alt: stepImageAlt || 'Иллюстрация текущего шага',
    };
  }

  const fallback = getQuestStepMediaFallback(questId, step.id);
  if (fallback?.url) {
    return {
      url: fallback.url,
      alt: stepImageAlt || fallback.alt || 'Иллюстрация текущего шага',
    };
  }

  return null;
}

function buildProofPayload(proofType: QuestProofType, draft: ProofDraft): { proofType: QuestProofType; proofData: Record<string, unknown> } {
  if (proofType === 'geo') {
    const lat = Number(draft.lat);
    const lng = Number(draft.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      throw new Error('Укажите корректные широту и долготу.');
    }
    return { proofType, proofData: { lat, lng } };
  }

  if (proofType === 'qr') {
    if (!draft.code.trim()) throw new Error('Введите код для подтверждения.');
    return { proofType, proofData: { code: draft.code.trim() } };
  }

  if (proofType === 'space_post') {
    if (!draft.postId.trim()) throw new Error('Укажите reference или post ID публичного действия.');
    return { proofType, proofData: { postId: draft.postId.trim() } };
  }

  if (proofType === 'photo') {
    if (!draft.mediaId.trim()) throw new Error('Укажите mediaId загруженного фото.');
    return { proofType, proofData: { mediaId: draft.mediaId.trim() } };
  }

  if (!draft.text.trim()) throw new Error('Добавьте короткое текстовое подтверждение.');
  return { proofType, proofData: { text: draft.text.trim() } };
}

export function QuestRunnerClient({ quest: questDetail }: QuestRunnerClientProps) {
  const [progress, setProgress] = useState<QuestProgressResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitNotice, setSubmitNotice] = useState<string | null>(null);
  const [lastSubmission, setLastSubmission] = useState<QuestSubmissionResponse | null>(null);
  const [proofDraft, setProofDraft] = useState<ProofDraft>(getDefaultProofDraft('text'));
  const [geoLoading, setGeoLoading] = useState(false);

  const currentStep = useMemo(() => getCurrentStep(progress, questDetail.steps), [progress, questDetail.steps]);
  const lifecycleCopy = useMemo(() => getLifecycleCopy(progress), [progress]);
  const currentProofType = useMemo(() => (currentStep ? mapProofType(currentStep) : 'text'), [currentStep]);
  const currentStepUi = useMemo(() => (currentStep ? getStepPresentation(currentStep) : null), [currentStep]);
  const currentStepHints = useMemo(() => (currentStep ? getStepHintChips(currentStep) : []), [currentStep]);
  const submitBlockedReason = useMemo(() => getSubmitBlockedReason(progress), [progress]);
  const currentStepImage = useMemo(() => {
    if (!currentStep || !currentStepUi) return null;
    return getStepImage(questDetail.id, currentStep, currentStepUi.stepImageKey, currentStepUi.stepImageAlt);
  }, [currentStep, currentStepUi, questDetail.id]);
  const progressPercent = useMemo(() => {
    if (!progress) return 0;
    if (progress.status === 'completed') return 100;
    if (!progress.currentStep || progress.totalSteps < 1) return 0;
    return Math.max(5, Math.round(((progress.currentStep - 1) / progress.totalSteps) * 100));
  }, [progress]);

  useEffect(() => {
    if (!currentStep) return;
    setProofDraft(getDefaultProofDraft(mapProofType(currentStep)));
  }, [currentStep]);

  const loadProgress = useCallback(async () => {
    setError(null);
    setFormError(null);
    setSubmitNotice(null);
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
    setFormError(null);
    setSubmitNotice(null);
    try {
      const payload = buildProofPayload(currentProofType, proofDraft);
      const response = await quest.submitQuestStep(questDetail.id, currentStep.id, payload);
      setLastSubmission(response);
      await refreshProgress();
      if (response.status === 'pending') {
        setSubmitNotice('Подтверждение отправлено. Сейчас оно находится на проверке.');
      } else if (response.status === 'approved') {
        setSubmitNotice('Подтверждение принято. Можно продолжать маршрут.');
      } else if (response.status === 'rejected') {
        setSubmitNotice('Подтверждение отклонено. Исправьте данные и отправьте повторно.');
      } else {
        setSubmitNotice('Подтверждение отправлено. Обновите статус, чтобы увидеть результат.');
      }
    } catch (submitError) {
      if (submitError instanceof Error) {
        setFormError(submitError.message);
      } else {
        setError(readErrorMessage(submitError));
      }
    } finally {
      setSubmitting(false);
    }
  }, [currentProofType, currentStep, proofDraft, questDetail.id, refreshProgress]);

  const useCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Браузер не поддерживает определение геопозиции.');
      return;
    }
    setGeoLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setProofDraft((current) => ({
          ...current,
          lat: String(position.coords.latitude),
          lng: String(position.coords.longitude),
        }));
        setGeoLoading(false);
      },
      () => {
        setError('Не удалось получить геопозицию. Можно ввести координаты вручную.');
        setGeoLoading(false);
      }
    );
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h1 className="text-2xl font-bold text-slate-900">{questDetail.title}</h1>
          <p className="mt-2 text-sm text-slate-600">{getQuestSummary(questDetail.description)}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void refreshProgress()}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              <RefreshCcw className="w-4 h-4" />
              Обновить статус
            </button>
            <Link
              href={`/quest/${questDetail.id}`}
              className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              К описанию маршрута
            </Link>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          {loading ? (
            <div className="flex items-center gap-2 text-slate-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              Подготавливаем маршрут...
            </div>
          ) : !progress ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-700">Не удалось загрузить текущий статус маршрута.</p>
              <button
                type="button"
                onClick={() => void loadProgress()}
                className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                Попробовать снова
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Текущий статус</h2>
                  <p className="mt-1 text-sm text-slate-600">{getProgressStatusLabel(progress.status)}</p>
                </div>
                <div className="text-right text-sm text-slate-500">
                  <p>Шаг {progress.currentStep ?? '—'} из {progress.totalSteps}</p>
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-purple-600 transition-all" style={{ width: `${progressPercent}%` }} />
              </div>

              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-slate-500">Текущий шаг</p>
                  <p className="font-medium text-slate-900">{progress.currentStep ?? '—'}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-slate-500">Всего шагов</p>
                  <p className="font-medium text-slate-900">{progress.totalSteps}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-slate-500">Начат</p>
                  <p className="font-medium text-slate-900">
                    {new Date(progress.startedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className={`mt-4 rounded-lg border p-3 text-sm ${lifecycleCopy.tone}`}>{lifecycleCopy.text}</div>
            </>
          )}
        </div>

        {currentStep && currentStepUi ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
            {(() => {
              const StepIcon = getStepIcon(currentStepUi.iconName);

              return (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
                        <StepIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${getStepEmphasisClasses(currentStepUi.emphasis)}`}
                          >
                            {currentStepUi.stepBadge}
                          </span>
                          <span className="text-xs text-slate-500">Шаг {currentStep.order}</span>
                        </div>
                        <h2 className="mt-3 text-xl font-semibold text-slate-900">{currentStepUi.title}</h2>
                        {currentStepUi.shortInstruction ? (
                          <p className="mt-1 text-sm font-medium text-slate-700">{currentStepUi.shortInstruction}</p>
                        ) : null}
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">{getVerificationLabel(currentStep)}</span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {currentStepImage ? (
                      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                        <div className="relative aspect-video w-full">
                          <Image
                            src={currentStepImage.url}
                            alt={currentStepImage.alt}
                            fill
                            sizes="(min-width: 1024px) 768px, 100vw"
                            className="object-cover"
                          />
                        </div>
                      </div>
                    ) : null}
                    {currentStepUi.userInstructionShort ? (
                      <p className="text-sm text-slate-700">{currentStepUi.userInstructionShort}</p>
                    ) : null}
                    {currentStepUi.description ? <p className="text-sm text-slate-600">{currentStepUi.description}</p> : null}
                    <p className="text-sm text-slate-600">{describeStepRuntime(currentStep)}</p>
                  </div>

                  {currentStepHints.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-700">
                      {currentStepHints.map((chip) => (
                        <span key={chip} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                          {chip}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {currentStepUi.submitHintShort ? (
                    <div className="mt-4 rounded-lg border border-sky-200 bg-sky-50 p-3 text-sm text-sky-800">
                      Подсказка: {currentStepUi.submitHintShort}
                    </div>
                  ) : null}

                  {currentStepUi.blockingNote ? (
                    <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                      {currentStepUi.blockingNote}
                    </div>
                  ) : null}

                  {currentStepUi.proofExpectation ? (
                    <p className="mt-4 text-xs text-slate-500">Что ожидается: {currentStepUi.proofExpectation}</p>
                  ) : null}
                  {getReviewModeHint(currentStepUi.reviewMode) ? (
                    <p className="mt-2 text-xs text-slate-500">{getReviewModeHint(currentStepUi.reviewMode)}</p>
                  ) : null}
                  {currentStepUi.stepImageHint ? <p className="mt-2 text-xs text-slate-500">{currentStepUi.stepImageHint}</p> : null}

                  <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">Отправка подтверждения</h3>
                        <p className="mt-1 text-sm text-slate-600">{getProofTypeLabel(currentProofType)}</p>
                      </div>
                      {currentStep.rewardPoints != null ? (
                        <span className="text-xs text-slate-500">До {currentStep.rewardPoints} очков</span>
                      ) : null}
                    </div>

                    {currentProofType === 'geo' ? (
                      <div className="mt-4 space-y-3">
                        <p className="text-xs text-slate-500">
                          Нужны координаты в формате десятичных градусов. Можно ввести вручную или подставить текущую геопозицию.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label htmlFor="proofLat" className="block text-sm font-medium text-slate-700 mb-2">
                              Широта
                            </label>
                            <input
                              id="proofLat"
                              type="text"
                              value={proofDraft.lat}
                              onChange={(event) => setProofDraft((current) => ({ ...current, lat: event.target.value }))}
                              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                              placeholder="7.8804"
                            />
                          </div>
                          <div>
                            <label htmlFor="proofLng" className="block text-sm font-medium text-slate-700 mb-2">
                              Долгота
                            </label>
                            <input
                              id="proofLng"
                              type="text"
                              value={proofDraft.lng}
                              onChange={(event) => setProofDraft((current) => ({ ...current, lng: event.target.value }))}
                              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                              placeholder="98.3923"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={useCurrentLocation}
                          disabled={geoLoading}
                          className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-white disabled:opacity-50"
                        >
                          {geoLoading ? 'Определяем координаты...' : 'Подставить мою геопозицию'}
                        </button>
                      </div>
                    ) : null}

                    {currentProofType === 'qr' ? (
                      <div className="mt-4">
                        <label htmlFor="proofCode" className="block text-sm font-medium text-slate-700 mb-2">
                          Код из QR
                        </label>
                        <input
                          id="proofCode"
                          type="text"
                          value={proofDraft.code}
                          onChange={(event) => setProofDraft((current) => ({ ...current, code: event.target.value }))}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                          placeholder="Например: PHUKET-STEP-01"
                        />
                      </div>
                    ) : null}

                    {currentProofType === 'photo' ? (
                      <div className="mt-4 space-y-3">
                        <div>
                          <label htmlFor="proofMediaId" className="block text-sm font-medium text-slate-700 mb-2">
                            Идентификатор фото
                          </label>
                          <input
                            id="proofMediaId"
                            type="text"
                            value={proofDraft.mediaId}
                            onChange={(event) => setProofDraft((current) => ({ ...current, mediaId: event.target.value }))}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                            placeholder="media_..."
                          />
                        </div>
                        <p className="text-xs text-slate-500">
                          Укажите ID уже загруженного фото (формат `media_...`).
                        </p>
                      </div>
                    ) : null}

                    {currentProofType === 'space_post' ? (
                      <div className="mt-4 space-y-3">
                        <div>
                          <label htmlFor="proofPostId" className="block text-sm font-medium text-slate-700 mb-2">
                            Идентификатор публикации
                          </label>
                          <input
                            id="proofPostId"
                            type="text"
                            value={proofDraft.postId}
                            onChange={(event) => setProofDraft((current) => ({ ...current, postId: event.target.value }))}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                            placeholder="post_..."
                          />
                        </div>
                        <p className="text-xs text-slate-500">
                          Укажите ID/reference уже опубликованного действия (например `post_...`).
                        </p>
                      </div>
                    ) : null}

                    {currentProofType === 'text' ? (
                      <div className="mt-4">
                        <label htmlFor="proofText" className="block text-sm font-medium text-slate-700 mb-2">
                          Короткое подтверждение
                        </label>
                        <textarea
                          id="proofText"
                          value={proofDraft.text}
                          onChange={(event) => setProofDraft((current) => ({ ...current, text: event.target.value }))}
                          rows={5}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                          placeholder="Напишите коротко, что вы сделали на этом шаге."
                        />
                      </div>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => void handleSubmitStep()}
                      disabled={submitting || !progress || progress.status !== 'in_progress'}
                      className="mt-4 inline-flex items-center rounded-lg bg-purple-600 text-white px-4 py-2 text-sm font-medium disabled:opacity-50"
                    >
                      {submitting ? 'Отправляем...' : 'Отправить подтверждение'}
                    </button>
                    {submitBlockedReason ? (
                      <p className="mt-2 text-xs text-slate-500">{submitBlockedReason}</p>
                    ) : null}
                    {formError ? (
                      <div className="mt-3 inline-flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{formError}</span>
                      </div>
                    ) : null}
                    {submitNotice ? (
                      <div className="mt-3 inline-flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{submitNotice}</span>
                      </div>
                    ) : null}

                    <details className="mt-4 text-xs text-slate-500">
                      <summary className="cursor-pointer select-none">Данные шага для поддержки</summary>
                      <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
                        <p>Тип шага: {currentStep.type}</p>
                        <p>Проверка: {currentStep.verificationType}</p>
                        <p>Target: {currentStep.targetType || 'n/a'} {currentStep.targetId ? `(${currentStep.targetId})` : ''}</p>
                        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono">
                          {JSON.stringify(buildProofPayload(currentProofType, {
                            ...proofDraft,
                            lat: proofDraft.lat || '0',
                            lng: proofDraft.lng || '0',
                            code: proofDraft.code || 'sample-code',
                            mediaId: proofDraft.mediaId || 'sample-media-id',
                            postId: proofDraft.postId || 'sample-post-id',
                            text: proofDraft.text || 'sample proof text',
                          }), null, 2)}
                        </pre>
                      </div>
                    </details>
                  </div>
                </>
              );
            })()}
          </div>
        ) : null}

        {lastSubmission ? (
          <div className={`mt-6 rounded-2xl border p-6 ${getSubmissionStatusClasses(lastSubmission.status)}`}>
            <h2 className="text-lg font-semibold text-slate-900">Последняя отправка</h2>
            <p className="mt-2 text-sm text-slate-600">Статус: {getSubmissionStatusLabel(lastSubmission.status)}</p>
            <p className="text-sm text-slate-600">Формат: {getProofTypeLabel(lastSubmission.proofType)}</p>
            <p className="text-sm text-slate-600">Отправлено: {new Date(lastSubmission.createdAt).toLocaleString()}</p>
            <p className="text-sm text-slate-600">
              Проверено: {lastSubmission.reviewedAt ? new Date(lastSubmission.reviewedAt).toLocaleString() : 'ещё нет'}
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
