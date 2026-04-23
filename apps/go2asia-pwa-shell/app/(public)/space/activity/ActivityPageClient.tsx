'use client';

import { useEffect, useState } from 'react';
import { customInstance, generated } from '@go2asia/sdk';
import { SpaceLayout } from '@/components/space/Shared';

const ACTIVITY_PATH = '/v1/space/feed/activity?limit=20';

function getErrorStatus(error: unknown): number | null {
  if (!error || typeof error !== 'object') return null;
  const status = (error as { status?: unknown }).status;
  return typeof status === 'number' ? status : null;
}

function formatActivityTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const diffMs = Date.now() - date.getTime();
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return 'только что';
  if (diffMs < hour) return `${Math.max(1, Math.floor(diffMs / minute))} мин назад`;
  if (diffMs < day) return `${Math.max(1, Math.floor(diffMs / hour))} ч назад`;
  if (diffMs < 2 * day) return 'вчера';

  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function isTechnicalText(value: string | null | undefined): boolean {
  if (!value) return false;
  return /(post_created|repost_created|baseline|contract|runtime|Entity|feed-post-|\/v1\/space\/feed\/activity)/i.test(
    value
  );
}

function formatEntityType(value: string | null | undefined): string | null {
  if (!value) return null;

  switch (value) {
    case 'space_post':
      return 'публикацией';
    case 'blog_post':
      return 'статьёй';
    case 'event':
      return 'событием';
    case 'place':
      return 'местом';
    case 'listing':
      return 'объявлением';
    case 'partner':
      return 'партнёром';
    case 'quest':
      return 'квестом';
    default:
      return 'материалом';
  }
}

function getActivityTitle(item: generated.SpaceActivityFeedItem): string {
  switch (item.type) {
    case 'post_created':
      return 'Опубликована новая запись';
    case 'repost_created':
      return 'Добавлен репост';
    default:
      if (item.title && !isTechnicalText(item.title)) return item.title;
      return 'Новое действие в Space Asia';
  }
}

function getActivityDescription(item: generated.SpaceActivityFeedItem): string | null {
  if (item.description && !isTechnicalText(item.description)) {
    return item.description;
  }

  if (item.type === 'post_created') {
    return 'Запись появилась в вашей активности и уже доступна в Space Asia.';
  }

  if (item.type === 'repost_created') {
    return 'Репост сохранён в вашей активности и связан с исходным материалом.';
  }

  if (item.relatedEntityType || item.relatedEntityId) {
    return `Событие связано с ${formatEntityType(item.relatedEntityType) ?? 'материалом'} в Space Asia.`;
  }

  return 'Здесь появляются недавние действия, которые уже видны в Space Asia.';
}

function getActivityMeta(item: generated.SpaceActivityFeedItem): string[] {
  const parts: string[] = [];

  if (item.type === 'post_created') {
    parts.push('Публикация');
  } else if (item.type === 'repost_created') {
    parts.push('Репост');
  }

  if (item.relatedPostId) {
    parts.push('Связано с публикацией');
  }

  if (item.relatedEntityType || item.relatedEntityId) {
    parts.push(`Связано с ${formatEntityType(item.relatedEntityType) ?? 'материалом'}`);
  }

  return parts;
}

export function ActivityPageClient() {
  const [feed, setFeed] = useState<generated.SpaceActivityFeedResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadActivity() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await customInstance<generated.SpaceActivityFeedResponse>(
          { method: 'GET' },
          ACTIVITY_PATH
        );
        if (cancelled) return;
        setFeed(response);
      } catch (loadError) {
        if (cancelled) return;
        setFeed(null);
        const status = getErrorStatus(loadError);
        if (status === 401 || status === 403) {
          setError('Войдите в аккаунт, чтобы увидеть свою недавнюю активность.');
        } else {
          setError('Не удалось загрузить активность. Обновите страницу и попробуйте ещё раз.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadActivity();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SpaceLayout>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Активность</h1>
          <p className="mt-2 text-sm text-slate-600">
            Здесь собраны недавние действия, которые уже появились в Space Asia.
          </p>
        </header>

        {isLoading && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Загружаем недавнюю активность...
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {!isLoading && !error && feed && feed.items.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Пока здесь нет новых действий. Когда в Space Asia появится активность, она отобразится в этом разделе.
          </div>
        )}

        {!isLoading && feed && feed.items.length > 0 && (
          <div className="space-y-4">
            {feed.items.map((item) => (
              <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span>{formatActivityTime(item.createdAt)}</span>
                  {getActivityMeta(item).map((meta) => (
                    <span
                      key={`${item.id}-${meta}`}
                      className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-600"
                    >
                      {meta}
                    </span>
                  ))}
                </div>
                <h2 className="mt-3 text-base font-semibold text-slate-900">{getActivityTitle(item)}</h2>
                <p className="mt-2 text-sm text-slate-700">{getActivityDescription(item)}</p>
              </article>
            ))}
          </div>
        )}

        <footer className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h2 className="text-sm font-semibold text-amber-900">Что здесь показывается</h2>
          <p className="mt-1 text-xs text-amber-800">
            Этот раздел показывает только часть недавних действий в Space Asia. Это не центр уведомлений, а
            короткая история уже видимой активности.
          </p>
        </footer>
      </section>
    </SpaceLayout>
  );
}
