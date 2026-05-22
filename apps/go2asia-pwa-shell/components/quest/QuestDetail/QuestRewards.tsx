'use client';

/**
 * Quest Asia - Quest Participation Summary
 * Предварительная сводка участия в квесте
 */

import { Trophy, Zap } from 'lucide-react';
import type { Quest } from '../types';
import { PROJECTION_LABELS, ProjectionChip, ProjectionFooter } from '../../shared/projection';

interface QuestRewardsProps {
  quest: Quest;
}

export function QuestRewards({ quest }: QuestRewardsProps) {
  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h3 className="text-xl font-bold text-slate-900">Preview участия</h3>
        <ProjectionChip tone="preview">{PROJECTION_LABELS.preview}</ProjectionChip>
      </div>
      
      <div className="space-y-4">
        {/* Points */}
        <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <Trophy className="w-6 h-6 text-amber-600" />
          <div>
            <div className="text-sm text-slate-600">{PROJECTION_LABELS.preview} internal Points</div>
            <div className="text-2xl font-bold text-slate-900">{quest.rewards.points}</div>
            <ProjectionFooter className="mt-1">Не Points_row и не receipt.</ProjectionFooter>
          </div>
        </div>

        {/* Off-chain badges */}
        {quest.rewards.nftBadges.length > 0 && (
          <div>
            <div className="text-sm text-slate-600 mb-3">Preview badge metadata</div>
            <div className="space-y-2">
              {quest.rewards.nftBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200"
                >
                  <Zap className="w-5 h-5 text-purple-600" />
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">{badge.name}</div>
                    <div className="text-xs text-slate-600">{badge.description}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      Не badge_award_fact и не ownership; появляется как факт только после backend-подтверждения.
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Условия */}
        {quest.rewards.conditions && (
          <div className="pt-4 border-t border-slate-200">
            <div className="text-sm text-slate-600 mb-2">Условия подтверждения</div>
            <ul className="space-y-1 text-sm text-slate-700">
              {quest.rewards.conditions.minCheckpoints && (
                <li>• Минимум {quest.rewards.conditions.minCheckpoints} чек-поинтов</li>
              )}
              {quest.rewards.conditions.seasonDeadline && (
                <li>
                  • До {quest.rewards.conditions.seasonDeadline.toLocaleDateString('ru-RU')}
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

