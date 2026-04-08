'use client';

/**
 * Quest Asia - Quest Detail Client Component
 * Детальная страница квеста
 */

import Link from 'next/link';
import type { QuestDetailResponse } from '@go2asia/sdk/quest';

interface QuestDetailClientProps {
  quest: QuestDetailResponse;
}

function formatQuestValue(value?: string | null): string {
  if (!value) return 'not specified';
  return value.replaceAll('_', ' ');
}

function buildQuestSignals(quest: QuestDetailResponse): string[] {
  const signals: string[] = [];

  if (quest.steps.some((step) => step.verificationType === 'manual')) {
    signals.push('manual review may interrupt progression');
  }
  if (quest.steps.some((step) => step.targetType === 'partner' || step.type === 'visit_partner')) {
    signals.push('partner-linked references only');
  }
  if (quest.steps.some((step) => step.targetType === 'event' || step.type === 'attend_event')) {
    signals.push('event-linked scenario');
  }
  if (quest.steps.some((step) => step.type === 'space_action' || step.verificationType === 'space_post')) {
    signals.push('social action is referenced, not owned by Quest');
  }
  if (quest.steps.length >= 5) {
    signals.push('longer progression flow');
  }

  return signals;
}

function describeStep(step: QuestDetailResponse['steps'][number]): string {
  if (step.type === 'visit_partner') return 'Partner visit step';
  if (step.type === 'attend_event') return 'Event participation step';
  if (step.type === 'space_action') return 'Referenced social action step';
  if (step.type === 'photo_proof') return 'Photo proof step';
  return 'Quest action step';
}

export function QuestDetailClient({ quest }: QuestDetailClientProps) {
  const signals = buildQuestSignals(quest);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h1 className="text-3xl font-bold text-slate-900">{quest.title}</h1>
          <p className="text-slate-600 mt-3">{quest.description || 'No description.'}</p>

          {signals.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-700">
              {signals.map((signal) => (
                <span key={signal} className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1">
                  {signal}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-slate-500">difficulty</p>
              <p className="font-medium text-slate-900">{formatQuestValue(quest.difficulty)}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-slate-500">theme</p>
              <p className="font-medium text-slate-900">{formatQuestValue(quest.theme)}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-slate-500">reward intent</p>
              <p className="font-medium text-slate-900">{quest.rewardPoints ?? 0} points</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-slate-500">visibility</p>
              <p className="font-medium text-slate-900">{quest.visibility}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-slate-500">status</p>
              <p className="font-medium text-slate-900">{quest.status}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-slate-500">steps</p>
              <p className="font-medium text-slate-900">{quest.steps.length}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-slate-500">city</p>
              <p className="font-medium text-slate-900">{quest.cityId || 'not specified'}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <Link
              href={`/quest/${quest.id}/run`}
              className="inline-flex items-center rounded-lg bg-purple-600 text-white px-4 py-2 text-sm font-medium hover:bg-purple-700"
            >
              Open live run flow
            </Link>
            <p className="text-xs text-slate-500">
              Start, progress, and submit require authenticated access. Manual review and pending states are part of wave 1 truth.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-900">Quest steps</h2>
          {quest.steps.length === 0 ? (
            <p className="text-sm text-slate-600 mt-3">No steps available.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {quest.steps.map((step) => (
                <li key={step.id} className="rounded-lg border border-slate-200 p-4">
                  <p className="text-sm text-slate-500">Step {step.order}</p>
                  <p className="font-medium text-slate-900 mt-1">
                    {step.type} / {step.verificationType}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">{describeStep(step)}</p>
                  <p className="text-sm text-slate-600 mt-1">
                    target: {step.targetType || 'n/a'} {step.targetId ? `(${step.targetId})` : ''}
                  </p>
                  <p className="text-sm text-slate-600">
                    reward intent: {step.rewardPoints ?? 0} points
                  </p>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-xs text-slate-500">
            Proof acceptance is runtime-driven. Pending review and rejection are possible outcomes for manual or reference-heavy flows.
          </p>
        </div>
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
          Quest wave 1 surfaces lifecycle truth only. Reward points are quest intent, not wallet settlement; partner and social targets remain external references.
        </div>
      </div>
    </div>
  );
}
