'use client';

import { useEffect, useMemo, useState } from 'react';
import { generated } from '@go2asia/sdk';
import {
  AlertTriangle,
  PencilLine,
  Plus,
  RefreshCcw,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  formatDifficultyLabel,
  getStepHintChips,
  getStepPresentation,
  getVerificationLabel,
} from '@/app/(public)/quest/questPresentation';
import {
  addDraftQuestStep,
  deleteDraftQuestStep,
  type DraftQuestStepPayload,
  type DraftQuestStepUpdatePayload,
  type DraftQuestUpdatePayload,
  type QuestProApiError,
  updateDraftQuest,
  updateDraftQuestStep,
} from './QuestProApi';

type QuestDraftEditorProps = {
  quest: generated.QuestDetailResponse;
  onQuestChanged: (quest: generated.QuestDetailResponse) => void;
  onReloadQuest: () => Promise<void>;
};

type QuestDraftFormValues = {
  title: string;
  description: string;
  cityId: string;
  type: string;
  theme: string;
  difficulty: generated.QuestDifficulty | 'unset';
  visibility: generated.QuestVisibility;
  rewardPoints: string;
};

type StepFormValues = {
  order: string;
  type: generated.QuestStepType;
  targetType: generated.QuestStepTargetType | 'unset';
  targetId: string;
  verificationType: generated.QuestVerificationType;
  rewardPoints: string;
  requirementsJson: string;
};

const difficultyOptions: Array<{ value: generated.QuestDifficulty | 'unset'; label: string }> = [
  { value: 'unset', label: 'Не задана' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

const visibilityOptions: Array<{ value: generated.QuestVisibility; label: string }> = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
];

const stepTypeOptions: Array<{ value: generated.QuestStepType; label: string }> = [
  { value: 'visit_place', label: 'Visit place' },
  { value: 'attend_event', label: 'Attend event' },
  { value: 'visit_partner', label: 'Visit partner' },
  { value: 'challenge', label: 'Challenge' },
  { value: 'photo_proof', label: 'Photo proof' },
  { value: 'geo_checkin', label: 'Geo check-in' },
  { value: 'qr_code', label: 'QR code' },
  { value: 'space_action', label: 'Space action' },
];

const verificationOptions: Array<{ value: generated.QuestVerificationType; label: string }> = [
  { value: 'auto', label: 'Auto' },
  { value: 'geo', label: 'Geo' },
  { value: 'qr', label: 'QR' },
  { value: 'manual', label: 'Manual review' },
  { value: 'space_post', label: 'Space post' },
];

const targetTypeOptions: Array<{ value: generated.QuestStepTargetType | 'unset'; label: string }> = [
  { value: 'unset', label: 'Без target' },
  { value: 'place', label: 'Place' },
  { value: 'event', label: 'Event' },
  { value: 'partner', label: 'Partner' },
  { value: 'space_post', label: 'Space post' },
];

function normalizeOptionalString(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function normalizeOptionalNumber(value: string): number | null {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function prettifyRequirements(value: unknown): string {
  if (!value || (typeof value === 'object' && Object.keys(value as Record<string, unknown>).length === 0)) {
    return '{}';
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return '{}';
  }
}

function createQuestFormValues(quest: generated.QuestDetailResponse): QuestDraftFormValues {
  return {
    title: quest.title ?? '',
    description: quest.description ?? '',
    cityId: quest.cityId ?? '',
    type: quest.type ?? '',
    theme: quest.theme ?? '',
    difficulty: quest.difficulty ?? 'unset',
    visibility: quest.visibility,
    rewardPoints: quest.rewardPoints == null ? '' : String(quest.rewardPoints),
  };
}

function createStepFormValues(step?: generated.QuestStepResponse, nextOrder?: number): StepFormValues {
  return {
    order: step ? String(step.order) : String(nextOrder ?? 1),
    type: step?.type ?? 'visit_place',
    targetType: step?.targetType ?? 'unset',
    targetId: step?.targetId ?? '',
    verificationType: step?.verificationType ?? 'auto',
    rewardPoints: step?.rewardPoints == null ? '' : String(step.rewardPoints),
    requirementsJson: prettifyRequirements(step?.requirements ?? {}),
  };
}

function isDraftQuest(quest: generated.QuestDetailResponse): boolean {
  return quest.status === 'draft';
}

function readMutationError(error: QuestProApiError | null, fallback: string): string {
  if (!error) return fallback;
  if (error.status === 401) return 'Нужна PRO авторизация для management mutation.';
  if (error.status === 403) return 'Изменение недоступно: ownership или management rights не подтверждены.';
  if (error.status === 404) return 'Целевой квест или шаг больше не найден.';
  if (error.status === 409) {
    return error.error?.message || error.message || 'Конфликт состояния: draft мог измениться или больше не редактируется.';
  }
  if (error.status === 400) {
    return error.error?.message || error.message || 'Бэкенд отклонил payload как невалидный.';
  }
  return error.error?.message || error.message || fallback;
}

function buildQuestDraftPayload(
  values: QuestDraftFormValues,
  quest: generated.QuestDetailResponse
): DraftQuestUpdatePayload {
  const payload: DraftQuestUpdatePayload = {};

  if (values.title.trim() !== quest.title) payload.title = values.title.trim();
  if (normalizeOptionalString(values.description) !== (quest.description ?? null)) {
    payload.description = normalizeOptionalString(values.description);
  }
  if (normalizeOptionalString(values.cityId) !== (quest.cityId ?? null)) {
    payload.cityId = normalizeOptionalString(values.cityId);
  }
  if (normalizeOptionalString(values.type) !== (quest.type ?? null)) {
    payload.type = normalizeOptionalString(values.type);
  }
  if (normalizeOptionalString(values.theme) !== (quest.theme ?? null)) {
    payload.theme = normalizeOptionalString(values.theme);
  }

  const nextDifficulty = values.difficulty === 'unset' ? null : values.difficulty;
  if (nextDifficulty !== (quest.difficulty ?? null)) {
    payload.difficulty = nextDifficulty;
  }

  if (values.visibility !== quest.visibility) {
    payload.visibility = values.visibility;
  }

  const nextRewardPoints = normalizeOptionalNumber(values.rewardPoints);
  if (nextRewardPoints !== (quest.rewardPoints ?? null)) {
    payload.rewardPoints = nextRewardPoints;
  }

  return payload;
}

function parseRequirementsJson(value: string): { data: Record<string, unknown> | null; error: string | null } {
  const trimmed = value.trim();
  if (!trimmed) return { data: {}, error: null };
  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { data: null, error: 'Requirements должны быть JSON-объектом.' };
    }
    return { data: parsed as Record<string, unknown>, error: null };
  } catch {
    return { data: null, error: 'Requirements должны быть валидным JSON.' };
  }
}

function buildStepPayload(
  values: StepFormValues
): { data: DraftQuestStepPayload | DraftQuestStepUpdatePayload | null; error: string | null } {
  const rewardPoints = normalizeOptionalNumber(values.rewardPoints);
  if (values.rewardPoints.trim() && rewardPoints == null) {
    return { data: null, error: 'Reward points должны быть числом.' };
  }
  if (rewardPoints != null && rewardPoints < 0) {
    return { data: null, error: 'Reward points не могут быть отрицательными.' };
  }

  const requirements = parseRequirementsJson(values.requirementsJson);
  if (requirements.error) {
    return { data: null, error: requirements.error };
  }

  const targetType = values.targetType === 'unset' ? null : values.targetType;
  const targetId = normalizeOptionalString(values.targetId);
  if ((targetType && !targetId) || (!targetType && targetId)) {
    return { data: null, error: 'Target type и target id нужно указывать парой.' };
  }

  const order = Number(values.order);
  if (!Number.isInteger(order) || order < 1) {
    return { data: null, error: 'Order должен быть целым числом не меньше 1.' };
  }

  return {
    data: {
      order,
      type: values.type,
      targetType,
      targetId,
      verificationType: values.verificationType,
      requirements: requirements.data ?? {},
      rewardPoints,
    },
    error: null,
  };
}

type QuestDraftStepCardProps = {
  questId: string;
  step: generated.QuestStepResponse;
  onReloadQuest: () => Promise<void>;
};

function QuestDraftStepCard({ questId, step, onReloadQuest }: QuestDraftStepCardProps) {
  const presentation = getStepPresentation(step);
  const chips = getStepHintChips(step);
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState<StepFormValues>(() => createStepFormValues(step));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setValues(createStepFormValues(step));
    setEditing(false);
    setError(null);
  }, [step]);

  const isDirty = useMemo(() => {
    return JSON.stringify(values) !== JSON.stringify(createStepFormValues(step));
  }, [step, values]);

  async function handleSave(): Promise<void> {
    const parsed = buildStepPayload(values);
    if (!parsed.data) {
      setError(parsed.error);
      return;
    }

    const { order: _ignoredOrder, ...payload } = parsed.data as DraftQuestStepPayload;
    if (Object.keys(payload).length === 0) {
      setError('Нет изменений для сохранения.');
      return;
    }

    setSaving(true);
    setError(null);

    const response = await updateDraftQuestStep(questId, step.id, payload);
    setSaving(false);

    if (!response.data) {
      setError(readMutationError(response.error, 'Не удалось обновить draft step.'));
      return;
    }

    toast.success(`Шаг ${step.order} сохранён`);
    await onReloadQuest();
  }

  async function handleDelete(): Promise<void> {
    const confirmed = window.confirm(`Удалить шаг ${step.order}? После удаления backend пересоберёт порядки шагов.`);
    if (!confirmed) return;

    setDeleting(true);
    setError(null);
    const response = await deleteDraftQuestStep(questId, step.id);
    setDeleting(false);

    if (!response.ok) {
      setError(readMutationError(response.error, 'Не удалось удалить draft step.'));
      return;
    }

    toast.success(`Шаг ${step.order} удалён`);
    await onReloadQuest();
  }

  return (
    <li className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
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
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setEditing((current) => !current);
              setError(null);
            }}
            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            <PencilLine className="mr-2 h-4 w-4" />
            {editing ? 'Скрыть editing' : 'Редактировать шаг'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting || saving}
            className="inline-flex items-center rounded-lg border border-rose-300 bg-white px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {deleting ? 'Удаляем...' : 'Удалить'}
          </button>
        </div>
      </div>

      <h3 className="mt-3 text-base font-semibold text-slate-900">{presentation.title}</h3>
      <p className="mt-1 text-sm text-slate-600">
        {presentation.shortInstruction ?? presentation.description ?? 'В UI-2 редактируется структура шага, а не rich authoring content.'}
      </p>

      {chips.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <span key={`${step.id}-${chip}`} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700">
              {chip}
            </span>
          ))}
        </div>
      ) : null}

      {editing ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-800">Тип шага</span>
              <select
                value={values.type}
                onChange={(event) => setValues((current) => ({ ...current, type: event.target.value as generated.QuestStepType }))}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
              >
                {stepTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-800">Verification</span>
              <select
                value={values.verificationType}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    verificationType: event.target.value as generated.QuestVerificationType,
                  }))
                }
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
              >
                {verificationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-800">Target type</span>
              <select
                value={values.targetType}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    targetType: event.target.value as generated.QuestStepTargetType | 'unset',
                  }))
                }
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
              >
                {targetTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-800">Target id</span>
              <input
                value={values.targetId}
                onChange={(event) => setValues((current) => ({ ...current, targetId: event.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                placeholder="place_123 / event_456"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-800">Reward points</span>
              <input
                type="number"
                min="0"
                value={values.rewardPoints}
                onChange={(event) => setValues((current) => ({ ...current, rewardPoints: event.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                placeholder="Например, 50"
              />
            </label>

            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600">
              <p className="font-medium text-slate-800">Order locked in UI-2</p>
              <p className="mt-1">
                Текущий порядок: <span className="font-semibold text-slate-900">{values.order}</span>. Reorder и drag-and-drop остаются
                за пределами bounded slice.
              </p>
            </div>
          </div>

          <label className="mt-4 block">
            <span className="text-sm font-medium text-slate-800">Requirements JSON</span>
            <textarea
              value={values.requirementsJson}
              onChange={(event) => setValues((current) => ({ ...current, requirementsJson: event.target.value }))}
              rows={8}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
            />
          </label>

          <p className="mt-2 text-xs text-slate-500">
            UI-2 не строит visual builder semantics. Requirements редактируются как bounded JSON payload, а серверная валидация остаётся
            источником истины.
          </p>

          {error ? (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{error}</div>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || deleting || !isDirty}
              className="inline-flex items-center rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-300"
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Сохраняем...' : 'Сохранить шаг'}
            </button>
            <button
              type="button"
              onClick={() => {
                setValues(createStepFormValues(step));
                setError(null);
              }}
              disabled={saving || deleting}
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Сбросить локальные правки
            </button>
          </div>
        </div>
      ) : null}
    </li>
  );
}

export function QuestDraftEditor({ quest, onQuestChanged, onReloadQuest }: QuestDraftEditorProps) {
  const [editingEnabled, setEditingEnabled] = useState(false);
  const [questValues, setQuestValues] = useState<QuestDraftFormValues>(() => createQuestFormValues(quest));
  const [questSaving, setQuestSaving] = useState(false);
  const [questError, setQuestError] = useState<string | null>(null);
  const [stepCreateOpen, setStepCreateOpen] = useState(false);
  const [stepValues, setStepValues] = useState<StepFormValues>(() => createStepFormValues(undefined, quest.steps.length + 1));
  const [stepSaving, setStepSaving] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);

  useEffect(() => {
    setQuestValues(createQuestFormValues(quest));
    setStepValues(createStepFormValues(undefined, Math.max(...quest.steps.map((step) => step.order), 0) + 1));
    setQuestError(null);
    setStepError(null);
    if (!isDraftQuest(quest)) {
      setEditingEnabled(false);
      setStepCreateOpen(false);
    }
  }, [quest]);

  const questPayload = useMemo(() => buildQuestDraftPayload(questValues, quest), [quest, questValues]);
  const isQuestDirty = Object.keys(questPayload).length > 0;
  const canEdit = isDraftQuest(quest);

  async function handleSaveQuest(): Promise<void> {
    if (!canEdit) return;
    if (!questValues.title.trim()) {
      setQuestError('Title не может быть пустым.');
      return;
    }
    if (questValues.rewardPoints.trim()) {
      const parsedReward = Number(questValues.rewardPoints);
      if (!Number.isFinite(parsedReward) || parsedReward < 0) {
        setQuestError('Reward points должны быть неотрицательным числом.');
        return;
      }
    }
    if (!isQuestDirty) {
      setQuestError('Нет изменений для сохранения.');
      return;
    }

    setQuestSaving(true);
    setQuestError(null);
    const response = await updateDraftQuest(quest.id, questPayload);
    setQuestSaving(false);

    if (!response.data) {
      setQuestError(readMutationError(response.error, 'Не удалось сохранить draft quest.'));
      return;
    }

    onQuestChanged(response.data);
    setQuestValues(createQuestFormValues(response.data));
    toast.success('Черновик квеста сохранён');
  }

  async function handleCreateStep(): Promise<void> {
    if (!canEdit) return;
    const parsed = buildStepPayload(stepValues);
    if (!parsed.data) {
      setStepError(parsed.error);
      return;
    }

    setStepSaving(true);
    setStepError(null);
    const response = await addDraftQuestStep(quest.id, parsed.data as DraftQuestStepPayload);
    setStepSaving(false);

    if (!response.data) {
      setStepError(readMutationError(response.error, 'Не удалось добавить draft step.'));
      return;
    }

    toast.success('Новый draft step добавлен');
    setStepCreateOpen(false);
    setStepValues(createStepFormValues(undefined, Math.max(...quest.steps.map((step) => step.order), 0) + 2));
    await onReloadQuest();
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <PencilLine className="h-5 w-5 text-violet-600" />
            <h2 className="text-lg font-semibold text-slate-900">Draft editing</h2>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Bounded editing surface поверх уже существующих draft seams: quest fields и step maintenance без rich builder semantics.
          </p>
        </div>

        {canEdit ? (
          <button
            type="button"
            onClick={() => {
              setEditingEnabled((current) => !current);
              setQuestError(null);
              setStepError(null);
            }}
            className="inline-flex items-center rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-medium text-violet-700 hover:bg-violet-100"
          >
            {editingEnabled ? 'Скрыть draft workspace' : 'Открыть draft workspace'}
          </button>
        ) : (
          <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500">
            Draft editing доступен только для `draft`
          </span>
        )}
      </div>

      {!canEdit ? (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Квест находится в статусе <span className="font-semibold">{quest.status}</span>. В UI-2 он остаётся только для чтения; lifecycle actions
          и reopening flows остаются вне scope.
        </div>
      ) : null}

      {canEdit && editingEnabled ? (
        <div className="mt-6 space-y-6">
          <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Quest fields</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Первая draft wave ограничена основными полями квеста. `geoScope` и richer metadata editing intentionally оставлены на следующий слой.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
                Updated: {quest.updatedAt ? new Date(quest.updatedAt).toLocaleString('ru-RU') : 'недоступно'}
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="block md:col-span-2">
                <span className="text-sm font-medium text-slate-800">Title</span>
                <input
                  value={questValues.title}
                  onChange={(event) => setQuestValues((current) => ({ ...current, title: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                  placeholder="Quest title"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="text-sm font-medium text-slate-800">Description</span>
                <textarea
                  value={questValues.description}
                  onChange={(event) => setQuestValues((current) => ({ ...current, description: event.target.value }))}
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                  placeholder="Короткое описание draft quest"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-800">City ID</span>
                <input
                  value={questValues.cityId}
                  onChange={(event) => setQuestValues((current) => ({ ...current, cityId: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                  placeholder="phuket"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-800">Quest type</span>
                <input
                  value={questValues.type}
                  onChange={(event) => setQuestValues((current) => ({ ...current, type: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                  placeholder="walking_route"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-800">Theme</span>
                <input
                  value={questValues.theme}
                  onChange={(event) => setQuestValues((current) => ({ ...current, theme: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                  placeholder="heritage"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-800">Difficulty</span>
                <select
                  value={questValues.difficulty}
                  onChange={(event) =>
                    setQuestValues((current) => ({
                      ...current,
                      difficulty: event.target.value as generated.QuestDifficulty | 'unset',
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                >
                  {difficultyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-800">Visibility</span>
                <select
                  value={questValues.visibility}
                  onChange={(event) =>
                    setQuestValues((current) => ({
                      ...current,
                      visibility: event.target.value as generated.QuestVisibility,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                >
                  {visibilityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-800">Reward points</span>
                <input
                  type="number"
                  min="0"
                  value={questValues.rewardPoints}
                  onChange={(event) => setQuestValues((current) => ({ ...current, rewardPoints: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                  placeholder="Например, 250"
                />
              </label>

              <div className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-600">
                <p className="font-medium text-slate-800">Current detail summary</p>
                <p className="mt-1">Difficulty: {formatDifficultyLabel(quest.difficulty)}</p>
                <p className="mt-1">Visibility: {quest.visibility}</p>
              </div>
            </div>

            {questError ? (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{questError}</div>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleSaveQuest}
                disabled={questSaving || !isQuestDirty}
                className="inline-flex items-center rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-300"
              >
                <Save className="mr-2 h-4 w-4" />
                {questSaving ? 'Сохраняем...' : 'Сохранить quest fields'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setQuestValues(createQuestFormValues(quest));
                  setQuestError(null);
                }}
                disabled={questSaving}
                className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Сбросить локальные правки
              </button>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Step maintenance</h3>
                <p className="mt-1 text-sm text-slate-600">
                  UI-2 даёт add / patch / delete для draft steps, но не открывает reorder builder, workflow graph или content authoring workstation.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStepCreateOpen((current) => !current);
                  setStepError(null);
                }}
                className="inline-flex items-center rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm font-medium text-violet-700 hover:bg-violet-50"
              >
                {stepCreateOpen ? <X className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                {stepCreateOpen ? 'Скрыть add-step form' : 'Добавить шаг'}
              </button>
            </div>

            <div className="mt-4 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
              Порядок шага задаётся только при создании. После удаления backend сам пересобирает `1..n`. Отдельный reorder UI deliberately оставлен
              на richer-builder wave.
            </div>

            {stepCreateOpen ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium text-slate-800">Order</span>
                    <input
                      type="number"
                      min="1"
                      value={stepValues.order}
                      onChange={(event) => setStepValues((current) => ({ ...current, order: event.target.value }))}
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-800">Тип шага</span>
                    <select
                      value={stepValues.type}
                      onChange={(event) =>
                        setStepValues((current) => ({
                          ...current,
                          type: event.target.value as generated.QuestStepType,
                        }))
                      }
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                    >
                      {stepTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-800">Verification</span>
                    <select
                      value={stepValues.verificationType}
                      onChange={(event) =>
                        setStepValues((current) => ({
                          ...current,
                          verificationType: event.target.value as generated.QuestVerificationType,
                        }))
                      }
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                    >
                      {verificationOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-800">Target type</span>
                    <select
                      value={stepValues.targetType}
                      onChange={(event) =>
                        setStepValues((current) => ({
                          ...current,
                          targetType: event.target.value as generated.QuestStepTargetType | 'unset',
                        }))
                      }
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                    >
                      {targetTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-800">Target id</span>
                    <input
                      value={stepValues.targetId}
                      onChange={(event) => setStepValues((current) => ({ ...current, targetId: event.target.value }))}
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-800">Reward points</span>
                    <input
                      type="number"
                      min="0"
                      value={stepValues.rewardPoints}
                      onChange={(event) => setStepValues((current) => ({ ...current, rewardPoints: event.target.value }))}
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                    />
                  </label>
                </div>

                <label className="mt-4 block">
                  <span className="text-sm font-medium text-slate-800">Requirements JSON</span>
                  <textarea
                    value={stepValues.requirementsJson}
                    onChange={(event) => setStepValues((current) => ({ ...current, requirementsJson: event.target.value }))}
                    rows={8}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                  />
                </label>

                <p className="mt-2 text-xs text-slate-500">
                  Backend остаётся источником истины для step constraints: target pairing, verification compatibility и special rules для partner /
                  geo / qr / photo proof.
                </p>

                {stepError ? (
                  <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{stepError}</div>
                ) : null}

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleCreateStep}
                    disabled={stepSaving}
                    className="inline-flex items-center rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-300"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {stepSaving ? 'Добавляем...' : 'Создать шаг'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStepValues(createStepFormValues(undefined, Math.max(...quest.steps.map((step) => step.order), 0) + 1));
                      setStepError(null);
                    }}
                    disabled={stepSaving}
                    className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Сбросить форму
                  </button>
                </div>
              </div>
            ) : null}

            {quest.steps.length === 0 ? (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                В этом draft пока нет шагов. UI-2 уже позволяет добавить первый шаг без открытия full builder.
              </div>
            ) : (
              <ol className="mt-4 space-y-4">
                {quest.steps.map((step) => (
                  <QuestDraftStepCard key={step.id} questId={quest.id} step={step} onReloadQuest={onReloadQuest} />
                ))}
              </ol>
            )}
          </section>

          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                UI-2 deliberately не включает publish/archive actions, review workstation, step reordering и rich content builder. Этот экран остаётся
                bounded draft workspace.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}
