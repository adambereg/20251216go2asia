import type { QuestDetailResponse, QuestStepResponse, QuestSummaryResponse } from '@go2asia/sdk/quest';
import type { LucideIcon } from 'lucide-react';
import { Calendar, Camera, Coffee, Flag, MapPin, MessageSquare, ScanLine, Target } from 'lucide-react';

type StepContentV2 = {
  presentation?: {
    title?: string;
    shortInstruction?: string;
    description?: string;
    userInstructionShort?: string;
    submitHintShort?: string;
    blockingNote?: string | null;
    stepBadge?: string | null;
    icon?: string | null;
    emphasis?: string | null;
  };
  runtimeUx?: {
    proofExpectation?: string;
    reviewMode?: string;
    showMapHint?: boolean;
    showPhotoHint?: boolean;
    showReviewHint?: boolean;
  };
  media?: {
    stepImageKey?: string | null;
    stepImageAlt?: string | null;
    stepImageHint?: string | null;
  };
  normalizedTarget?: {
    rawTargetType?: string | null;
    rawTargetId?: string | null;
    storedTargetType?: string | null;
    storedTargetId?: string | null;
    note?: string | null;
  };
};

export type StepPresentation = {
  title: string;
  shortInstruction: string | null;
  description: string | null;
  userInstructionShort: string | null;
  submitHintShort: string | null;
  blockingNote: string | null;
  stepBadge: string;
  iconName: string | null;
  emphasis: string | null;
  proofExpectation: string | null;
  reviewMode: string | null;
  showMapHint: boolean;
  showPhotoHint: boolean;
  showReviewHint: boolean;
  stepImageKey: string | null;
  stepImageAlt: string | null;
  stepImageHint: string | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function normalizeText(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

export function getQuestParagraphs(description?: string | null): string[] {
  if (!description) return [];
  return description
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function getQuestSummary(description?: string | null): string {
  return getQuestParagraphs(description)[0] ?? 'Описание маршрута появится позже.';
}

export function formatDifficultyLabel(value?: string | null): string {
  if (value === 'easy') return 'Лёгкий';
  if (value === 'medium') return 'Средний';
  if (value === 'hard') return 'Сложный';
  return 'Без уровня';
}

export function formatCityLabel(value?: string | null): string {
  if (!value) return 'Город появится позже';
  if (value === 'phuket') return 'Пхукет';
  return value.replaceAll('_', ' ');
}

export function describeQuestExperience(item: Pick<QuestSummaryResponse, 'theme' | 'stepsCount' | 'difficulty'>): string {
  if (item.theme === 'city_discovery') return 'Спокойный городской маршрут';
  if (item.theme === 'photo_task') return 'Фото-задание с проверкой результата';
  if (item.theme === 'mixed_route') return 'Насыщенный маршрут на несколько остановок';
  if ((item.stepsCount ?? 0) >= 5) return 'Маршрут на полдня';
  if (item.difficulty === 'easy') return 'Подходит для первого знакомства';
  return 'Маршрут с пошаговым прохождением';
}

export function getQuestUserSignals(quest: QuestDetailResponse): string[] {
  const signals: string[] = [];
  if (quest.steps.some((step) => step.verificationType === 'manual')) signals.push('Есть шаги с ручной проверкой');
  if (quest.steps.some((step) => step.type === 'photo_proof')) signals.push('Есть фото-этап');
  if (quest.steps.some((step) => step.verificationType === 'qr')) signals.push('Есть QR-подтверждение');
  if (quest.steps.some((step) => step.type === 'space_action' || step.verificationType === 'space_post')) {
    signals.push('Есть публичное действие в финальных шагах');
  }
  if (quest.steps.length >= 5) signals.push('Подойдёт для более длинной прогулки');
  return signals;
}

function getFallbackStepTitle(step: QuestStepResponse): string {
  if (step.type === 'visit_partner') return 'Зайдите в партнёрскую точку';
  if (step.type === 'attend_event') return 'Подтвердите участие в событии';
  if (step.type === 'space_action') return 'Сделайте публичное действие';
  if (step.type === 'photo_proof') return 'Загрузите подтверждение';
  if (step.type === 'challenge') return 'Подтвердите выполнение шага';
  return 'Следующий шаг маршрута';
}

function getFallbackStepBadge(step: QuestStepResponse): string {
  if (step.type === 'visit_partner') return 'Партнёр';
  if (step.type === 'attend_event') return 'Событие';
  if (step.type === 'space_action') return 'Действие';
  if (step.type === 'photo_proof') return 'Фото';
  if (step.order === 1) return 'Старт';
  return `Шаг ${step.order}`;
}

export function getStepContentV2(step: QuestStepResponse): StepContentV2 | null {
  if (!isRecord(step.requirements)) return null;
  const contentV2 = step.requirements.contentV2;
  if (!isRecord(contentV2)) return null;
  return contentV2 as StepContentV2;
}

export function getStepPresentation(step: QuestStepResponse): StepPresentation {
  const contentV2 = getStepContentV2(step);
  const presentation = isRecord(contentV2?.presentation) ? contentV2.presentation : {};
  const runtimeUx = isRecord(contentV2?.runtimeUx) ? contentV2.runtimeUx : {};
  const media = isRecord(contentV2?.media) ? contentV2.media : {};

  return {
    title: normalizeText(presentation.title) ?? getFallbackStepTitle(step),
    shortInstruction: normalizeText(presentation.shortInstruction),
    description: normalizeText(presentation.description),
    userInstructionShort: normalizeText(presentation.userInstructionShort),
    submitHintShort: normalizeText(presentation.submitHintShort),
    blockingNote: normalizeText(presentation.blockingNote),
    stepBadge: normalizeText(presentation.stepBadge) ?? getFallbackStepBadge(step),
    iconName: normalizeText(presentation.icon),
    emphasis: normalizeText(presentation.emphasis),
    proofExpectation: normalizeText(runtimeUx.proofExpectation),
    reviewMode: normalizeText(runtimeUx.reviewMode),
    showMapHint: runtimeUx.showMapHint === true,
    showPhotoHint: runtimeUx.showPhotoHint === true,
    showReviewHint: runtimeUx.showReviewHint === true,
    stepImageKey: normalizeText(media.stepImageKey),
    stepImageAlt: normalizeText(media.stepImageAlt),
    stepImageHint: normalizeText(media.stepImageHint),
  };
}

export function getStepIcon(name: string | null): LucideIcon {
  const map: Record<string, LucideIcon> = {
    'map-pin': MapPin,
    camera: Camera,
    flag: Flag,
    coffee: Coffee,
    'scan-line': ScanLine,
    calendar: Calendar,
    'message-square': MessageSquare,
  };
  return (name && map[name]) || Target;
}

export function getStepEmphasisClasses(emphasis: string | null): string {
  if (emphasis === 'start') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (emphasis === 'proof') return 'bg-amber-50 text-amber-700 border-amber-200';
  if (emphasis === 'finish') return 'bg-violet-50 text-violet-700 border-violet-200';
  if (emphasis === 'partner') return 'bg-sky-50 text-sky-700 border-sky-200';
  if (emphasis === 'event') return 'bg-rose-50 text-rose-700 border-rose-200';
  if (emphasis === 'social') return 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200';
  if (emphasis === 'internal') return 'bg-slate-100 text-slate-700 border-slate-300';
  return 'bg-slate-50 text-slate-700 border-slate-200';
}

export function getVerificationLabel(step: QuestStepResponse): string {
  if (step.verificationType === 'geo') return 'Гео-подтверждение';
  if (step.verificationType === 'qr') return 'QR-подтверждение';
  if (step.verificationType === 'manual') return 'Проверка после отправки';
  if (step.verificationType === 'space_post') return 'Публичное действие';
  return 'Подтверждение в приложении';
}

export function getStepHintChips(step: QuestStepResponse): string[] {
  const presentation = getStepPresentation(step);
  const chips: string[] = [];
  if (presentation.showMapHint) chips.push('Нужна точка на маршруте');
  if (presentation.showPhotoHint) chips.push('Понадобится фото');
  if (presentation.showReviewHint || step.verificationType === 'manual') chips.push('Возможна ручная проверка');
  if (step.verificationType === 'qr') chips.push('Нужно отсканировать код');
  if (step.verificationType === 'space_post') chips.push('Нужен reference на публичное действие');
  return chips;
}

export function getProgressStatusLabel(status?: string | null): string {
  if (status === 'in_progress') return 'В процессе';
  if (status === 'pending_review') return 'На проверке';
  if (status === 'completed') return 'Завершён';
  if (status === 'failed') return 'Нужна повторная попытка';
  if (status === 'expired') return 'Срок истёк';
  return 'Ожидает старта';
}

export function getSubmissionStatusLabel(status?: string | null): string {
  if (status === 'approved') return 'Подтверждено';
  if (status === 'pending') return 'На проверке';
  if (status === 'rejected') return 'Нужно повторить';
  return 'Отправлено';
}
