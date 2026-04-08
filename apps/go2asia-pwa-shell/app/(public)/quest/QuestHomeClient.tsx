'use client';

/**
 * Quest Asia - Quest Home Client Component
 * Главная страница модуля Quest Asia
 */

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ModuleHero } from '@/components/modules';
import { Loader2, Target } from 'lucide-react';
import { quest } from '@go2asia/sdk';
import type { QuestApiError, QuestListResponse, QuestSummaryResponse } from '@go2asia/sdk/quest';

function formatDifficulty(value?: string | null): string {
  if (!value) return 'not specified';
  if (value === 'easy') return 'easy';
  if (value === 'medium') return 'medium';
  if (value === 'hard') return 'hard';
  return value;
}

function formatTheme(value?: string | null): string {
  if (!value) return 'general';
  return value.replaceAll('_', ' ');
}

function formatQuestType(value?: string | null): string {
  if (!value) return 'runtime quest';
  return value.replaceAll('_', ' ');
}

function describeQuestIntent(item: QuestSummaryResponse): string {
  if (item.theme === 'partner_route') return 'Partner-linked route via Quest-owned references only.';
  if (item.theme === 'event_participation') return 'Event-linked quest with attendance semantics.';
  if (item.theme === 'photo_mission') return 'Manual review can be part of this route.';
  if (item.stepsCount >= 5) return 'Longer mixed progression flow.';
  return 'Published public quest from live runtime.';
}

function readCatalogError(error: QuestApiError | null): string {
  if (!error) return 'Quest API is currently unavailable.';
  if (error.status === 400) return 'Quest catalog filters are invalid right now.';
  if (error.status === 500 || error.status === 503) return 'Quest catalog is temporarily unavailable.';
  return error.message;
}

export function QuestHomeClient() {
  const [data, setData] = useState<QuestListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadQuests(): Promise<void> {
      setLoading(true);
      setError(null);
      const response = await quest.fetchQuestsResult({ pageSize: 24, page: 1 });
      if (cancelled) return;
      if (!response.data) {
        setData(null);
        setError(readCatalogError(response.error));
      } else {
        setData(response.data);
      }
      setLoading(false);
    }

    void loadQuests();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <ModuleHero
        icon={Target}
        title="Quest Asia"
        description="Live baseline of published public quests with honest runtime states and simple route entry."
        gradientFrom="from-purple-500"
        gradientTo="to-purple-600"
      />
      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          Live public quests
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          This catalog reflects only published + public quests from current runtime.
        </p>

        {loading ? (
          <div className="flex items-center gap-2 text-slate-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading quests...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-800">
            {error}
          </div>
        ) : !data || data.items.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
            No public quests are available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.items.map((item) => (
              <Link
                key={item.id}
                href={`/quest/${item.id}`}
                className="rounded-xl border border-slate-200 bg-white p-5 hover:border-slate-300 hover:shadow-sm transition"
              >
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-600 mt-2 line-clamp-2">{item.description || 'No description.'}</p>

                <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-600">
                  <span className="rounded-full bg-emerald-50 px-2 py-1 border border-emerald-200">
                    {item.status} / {item.visibility}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-1 border border-slate-200">
                    {formatQuestType(item.type)}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-1 border border-slate-200">
                    {formatTheme(item.theme)}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-1 border border-slate-200">
                    {item.cityId || 'city not specified'}
                  </span>
                </div>

                <div className="mt-4 space-y-1 text-xs text-slate-500">
                  <p>difficulty: {formatDifficulty(item.difficulty)}</p>
                  <p>steps: {item.stepsCount}</p>
                  <p>reward intent: {item.rewardPoints ?? 0} points</p>
                  <p>{describeQuestIntent(item)}</p>
                </div>

                <p className="mt-4 text-sm font-medium text-purple-700">Open live detail</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

