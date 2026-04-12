'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { generated } from '@go2asia/sdk';
import { FolderPlus, Loader2, Lock, ShieldCheck } from 'lucide-react';
import { formatCityLabel, formatDifficultyLabel } from '@/app/(public)/quest/questPresentation';
import { getQuestCardMediaRuntimeFirst, getQuestSummaryRuntimeFirst } from '@/app/(public)/quest/questRuntimeMetadata';
import { fetchOwnedQuests, type QuestProApiError } from './QuestProApi';

const STATUS_OPTIONS: Array<{ value: generated.QuestStatus | 'all'; label: string }> = [
  { value: 'all', label: 'Все статусы' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

const VISIBILITY_OPTIONS: Array<{ value: generated.QuestVisibility | 'all'; label: string }> = [
  { value: 'all', label: 'Любая видимость' },
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
];

function readListError(error: QuestProApiError | null): string {
  if (!error) return 'Не удалось загрузить owner-scoped список квестов.';
  if (error.status === 401) return 'Требуется авторизация для Quest PRO Console.';
  if (error.status === 403) return 'Этот раздел доступен только PRO или admin.';
  if (error.status === 500 || error.status === 503) return 'Quest management API временно недоступен.';
  return error.message || error.error?.message || 'Не удалось загрузить owner-scoped список квестов.';
}

function formatDate(value?: string | null): string {
  if (!value) return 'Дата недоступна';
  try {
    return new Date(value).toLocaleDateString('ru-RU');
  } catch {
    return value;
  }
}

function getStatusClasses(status?: string | null): string {
  if (status === 'published') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  if (status === 'archived') return 'border-slate-300 bg-slate-100 text-slate-700';
  return 'border-amber-200 bg-amber-50 text-amber-700';
}

function getVisibilityClasses(visibility?: string | null): string {
  if (visibility === 'private') return 'border-slate-300 bg-slate-100 text-slate-700';
  return 'border-sky-200 bg-sky-50 text-sky-700';
}

export function QuestProWorkspace() {
  const { user, isLoaded } = useUser();
  const [status, setStatus] = useState<generated.QuestStatus | 'all'>('all');
  const [visibility, setVisibility] = useState<generated.QuestVisibility | 'all'>('all');
  const [data, setData] = useState<generated.QuestListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load(): Promise<void> {
      setLoading(true);
      setError(null);
      const response = await fetchOwnedQuests({ page: 1, pageSize: 24, status, visibility });
      if (cancelled) return;
      if (!response.data) {
        setData(null);
        setError(readListError(response.error));
      } else {
        setData(response.data);
      }
      setLoading(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [status, visibility]);

  if (!isLoaded) {
    return <p className="text-sm text-slate-600">Загрузка Quest PRO Console…</p>;
  }

  if (!user?.id) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950">
        Войдите в аккаунт PRO, чтобы открыть Quest management workspace.
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">My quests</h1>
            <p className="mt-1 text-sm text-slate-600">
              Owner-scoped management list для Quest PRO Console. Это read-first стартовая поверхность без mutation-heavy
              authoring UI.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex cursor-not-allowed items-center rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500">
              <FolderPlus className="mr-2 h-4 w-4" />
              Создать draft — следующий slice
            </span>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-700">Статус</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as generated.QuestStatus | 'all')}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-700">Видимость</span>
            <select
              value={visibility}
              onChange={(event) => setVisibility(event.target.value as generated.QuestVisibility | 'all')}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
            >
              {VISIBILITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-violet-900 md:col-span-2">
            UI-1 intentionally ограничен list/detail чтением. Draft edit, lifecycle actions и review workstation откроются
            в следующих Quest UI slices.
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex items-center gap-2 text-slate-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          Загружаем owner-scoped список квестов...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-800">{error}</div>
      ) : !data || data.items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
          Под текущие фильтры квестов не найдено.
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {data.items.map((item) => {
            const cover = getQuestCardMediaRuntimeFirst(item);
            return (
              <article key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {cover ? (
                  <div className="relative aspect-[4/3] w-full bg-slate-100">
                    <Image
                      src={cover.url}
                      alt={cover.alt}
                      fill
                      sizes="(min-width: 1280px) 36vw, 96vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] w-full bg-gradient-to-br from-violet-100 via-white to-sky-100" />
                )}

                <div className="space-y-4 p-5">
                  <div className="flex flex-wrap gap-2">
                    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(item.status)}`}>
                      {item.status}
                    </span>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${getVisibilityClasses(item.visibility)}`}
                    >
                      {item.visibility}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                      {formatDifficultyLabel(item.difficulty)}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">{formatCityLabel(item.cityId)}</p>
                    <h2 className="mt-1 text-xl font-semibold text-slate-900">{item.title}</h2>
                    <p className="mt-2 text-sm text-slate-600">
                      {getQuestSummaryRuntimeFirst(item) ?? 'Management summary появится после enrichment следующей волны.'}
                    </p>
                  </div>

                  <dl className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Шагов</dt>
                      <dd className="mt-1 text-sm font-medium text-slate-900">{item.stepsCount}</dd>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Награда</dt>
                      <dd className="mt-1 text-sm font-medium text-slate-900">
                        {item.rewardPoints != null ? `${item.rewardPoints} очков` : 'Не задана'}
                      </dd>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Создан</dt>
                      <dd className="mt-1 text-sm font-medium text-slate-900">{formatDate(item.createdAt)}</dd>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Обновлён</dt>
                      <dd className="mt-1 text-sm font-medium text-slate-900">{formatDate(item.updatedAt)}</dd>
                    </div>
                  </dl>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Link
                      href={`/quest/pro/${item.id}`}
                      className="inline-flex items-center rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
                    >
                      Открыть management view
                    </Link>
                    <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                      <ShieldCheck className="h-4 w-4" />
                      Owner-scoped detail, review и stats доступны на следующем экране
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Что deliberately отложено после UI-1</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>Полный draft editing UI и mutation-heavy step editor.</li>
          <li>Рабочие кнопки publish/archive с complete conflict-handling UX.</li>
          <li>Полноразмерная review console и analytics dashboard.</li>
          <li>Broad PRO Console shell для других модулей Go2Asia.</li>
        </ul>
      </section>
    </div>
  );
}
