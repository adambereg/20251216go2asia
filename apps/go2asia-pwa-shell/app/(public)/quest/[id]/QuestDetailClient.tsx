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

export function QuestDetailClient({ quest }: QuestDetailClientProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h1 className="text-3xl font-bold text-slate-900">{quest.title}</h1>
          <p className="text-slate-600 mt-3">{quest.description || 'No description.'}</p>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-slate-500">difficulty</p>
              <p className="font-medium text-slate-900">{quest.difficulty || 'not specified'}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-slate-500">theme</p>
              <p className="font-medium text-slate-900">{quest.theme || 'not specified'}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-slate-500">reward points</p>
              <p className="font-medium text-slate-900">{quest.rewardPoints ?? 0}</p>
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
          </div>

          <div className="mt-6 flex items-center gap-3">
            <Link
              href={`/quest/${quest.id}/run`}
              className="inline-flex items-center rounded-lg bg-purple-600 text-white px-4 py-2 text-sm font-medium hover:bg-purple-700"
            >
              Start quest
            </Link>
            <p className="text-xs text-slate-500">
              Start/progress/submit require authenticated access via gateway.
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
                  <p className="text-sm text-slate-600 mt-1">
                    target: {step.targetType || 'n/a'} {step.targetId ? `(${step.targetId})` : ''}
                  </p>
                  <p className="text-sm text-slate-600">
                    reward points: {step.rewardPoints ?? 0}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-xs text-slate-500">
            Proof acceptance is runtime-driven. Pending review and rejection are possible outcomes for manual flows.
          </p>
        </div>
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
          Quest wave 1 surfaces lifecycle truth. It does not imply full wallet issuance, anti-fraud guarantees, or cross-domain proof certainty.
        </div>
      </div>
    </div>
  );
}
