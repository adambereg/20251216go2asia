'use client';

/**
 * Quest Asia - Quest Detail Client Component
 * Детальная страница квеста
 */

import Link from 'next/link';
import type { QuestDetailResponse } from '@go2asia/sdk/quest';
import {
  describeQuestExperience,
  formatCityLabel,
  formatDifficultyLabel,
  getQuestParagraphs,
  getQuestUserSignals,
  getStepEmphasisClasses,
  getStepHintChips,
  getStepIcon,
  getStepPresentation,
  getVerificationLabel,
} from '../questPresentation';

interface QuestDetailClientProps {
  quest: QuestDetailResponse;
}

export function QuestDetailClient({ quest }: QuestDetailClientProps) {
  const signals = getQuestUserSignals(quest);
  const paragraphs = getQuestParagraphs(quest.description);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
            <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-violet-700">
              {describeQuestExperience(quest)}
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-700">
              {formatDifficultyLabel(quest.difficulty)}
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-700">
              {quest.steps.length} {quest.steps.length === 1 ? 'шаг' : quest.steps.length < 5 ? 'шага' : 'шагов'}
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-700">
              {formatCityLabel(quest.cityId)}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold text-slate-900">{quest.title}</h1>

          <div className="mt-4 space-y-3 text-slate-600">
            {paragraphs.length > 0 ? (
              paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
            ) : (
              <p>Описание маршрута появится позже.</p>
            )}
          </div>

          {signals.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-700">
              {signals.map((signal) => (
                <span key={signal} className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1">
                  {signal}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-slate-500">Сложность</p>
              <p className="font-medium text-slate-900">{formatDifficultyLabel(quest.difficulty)}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-slate-500">Формат</p>
              <p className="font-medium text-slate-900">{describeQuestExperience(quest)}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-slate-500">Награда</p>
              <p className="font-medium text-slate-900">{quest.rewardPoints ?? 0} очков</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-slate-500">Шаги</p>
              <p className="font-medium text-slate-900">{quest.steps.length}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-slate-500">Город</p>
              <p className="font-medium text-slate-900">{formatCityLabel(quest.cityId)}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <Link
              href={`/quest/${quest.id}/run`}
              className="inline-flex items-center rounded-lg bg-purple-600 text-white px-4 py-2 text-sm font-medium hover:bg-purple-700"
            >
              Начать прохождение
            </Link>
            <p className="text-xs text-slate-500">
              Для старта и отправки шагов нужен вход в аккаунт. Некоторые шаги могут перейти в статус проверки.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-900">Что будет по шагам</h2>
          {quest.steps.length === 0 ? (
            <p className="text-sm text-slate-600 mt-3">Шаги пока не опубликованы.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {quest.steps.map((step) => {
                const stepUi = getStepPresentation(step);
                const StepIcon = getStepIcon(stepUi.iconName);
                const hintChips = getStepHintChips(step);

                return (
                  <li key={step.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-xl bg-slate-100 p-2 text-slate-700">
                          <StepIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-medium ${getStepEmphasisClasses(stepUi.emphasis)}`}
                            >
                              {stepUi.stepBadge}
                            </span>
                            <span className="text-xs text-slate-500">Шаг {step.order}</span>
                          </div>
                          <p className="mt-2 text-base font-semibold text-slate-900">{stepUi.title}</p>
                          {stepUi.shortInstruction ? (
                            <p className="mt-1 text-sm font-medium text-slate-700">{stepUi.shortInstruction}</p>
                          ) : null}
                        </div>
                      </div>
                      <span className="text-xs text-slate-500">{getVerificationLabel(step)}</span>
                    </div>

                    {stepUi.description ? <p className="mt-3 text-sm text-slate-600">{stepUi.description}</p> : null}

                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-700">
                      {hintChips.map((chip) => (
                        <span key={chip} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                          {chip}
                        </span>
                      ))}
                    </div>

                    {stepUi.submitHintShort ? (
                      <p className="mt-3 text-sm text-slate-600">Подсказка: {stepUi.submitHintShort}</p>
                    ) : null}
                    {stepUi.blockingNote ? (
                      <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                        {stepUi.blockingNote}
                      </div>
                    ) : null}
                    {step.rewardPoints != null ? (
                      <p className="mt-3 text-xs text-slate-500">За шаг можно получить {step.rewardPoints} очков.</p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
          Часть product-оформления квеста всё ещё ограничена текущим runtime-контрактом: в API пока нет отдельной quest-level metadata model для обложек, галереи и карточных текстовых полей. В этом pass улучшено только то, что уже честно доступно через runtime и step-level `contentV2`.
        </div>
      </div>
    </div>
  );
}
