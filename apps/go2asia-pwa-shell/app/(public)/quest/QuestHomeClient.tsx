'use client';

/**
 * Quest Asia - Quest Home Client Component
 * Главная страница модуля Quest Asia
 */

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ModuleHero } from '@/components/modules';
import { ArrowRight, Loader2, Target } from 'lucide-react';
import { quest } from '@go2asia/sdk';
import type { QuestApiError, QuestListResponse, QuestSummaryResponse } from '@go2asia/sdk/quest';
import { describeQuestExperience, formatCityLabel, formatDifficultyLabel } from './questPresentation';
import { getQuestCardMediaRuntimeFirst, getQuestSummaryRuntimeFirst } from './questRuntimeMetadata';

function getQuestBadge(item: QuestSummaryResponse): string {
  if (item.theme === 'photo_task') return 'Фото-задание';
  if (item.theme === 'mixed_route') return 'Маршрут на полдня';
  if (item.theme === 'city_discovery') return 'Городская прогулка';
  if (item.stepsCount >= 5) return 'Длинный маршрут';
  return 'Маршрут';
}

function readCatalogError(error: QuestApiError | null): string {
  if (!error) return 'Каталог квестов временно недоступен.';
  if (error.status === 400) return 'Не удалось корректно загрузить каталог квестов.';
  if (error.status === 500 || error.status === 503) return 'Каталог квестов временно недоступен.';
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
        description="Маршруты и задания, которые можно пройти по шагам: прогулки, фото-задания и более длинные городские сценарии."
        gradientFrom="from-purple-500"
        gradientTo="to-purple-600"
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          Доступные маршруты
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          Здесь показываются только маршруты, которые уже доступны в текущем runtime.
        </p>

        {loading ? (
          <div className="flex items-center gap-2 text-slate-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            Загружаем маршруты...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-800">
            {error}
          </div>
        ) : !data || data.items.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
            Пока нет доступных маршрутов.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.items.map((item) => (
              <Link key={item.id} href={`/quest/${item.id}`} className="rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition overflow-hidden">
                {(() => {
                  const cover = getQuestCardMediaRuntimeFirst(item);
                  return cover ? (
                    <div className="relative aspect-[4/3] w-full bg-slate-100">
                      <Image
                        src={cover.url}
                        alt={cover.alt}
                        fill
                        sizes="(min-width: 1024px) 28vw, (min-width: 768px) 42vw, 96vw"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] w-full bg-gradient-to-br from-violet-100 via-white to-sky-100" />
                  );
                })()}

                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
                      {getQuestBadge(item)}
                    </span>
                    <span className="text-xs text-slate-500">{formatCityLabel(item.cityId)}</span>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 line-clamp-3">{getQuestSummaryRuntimeFirst(item) ?? 'Описание маршрута появится позже.'}</p>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-700">
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                      {formatDifficultyLabel(item.difficulty)}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                      {item.stepsCount} {item.stepsCount === 1 ? 'шаг' : item.stepsCount < 5 ? 'шага' : 'шагов'}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                      {describeQuestExperience(item)}
                    </span>
                  </div>

                  <div className="mt-4 space-y-1 text-sm text-slate-600">
                    <p>{describeQuestExperience(item)}</p>
                    {item.rewardPoints != null ? <p>Internal Points после подтверждения: {item.rewardPoints}</p> : null}
                  </div>

                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-purple-700">
                    Открыть маршрут
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

