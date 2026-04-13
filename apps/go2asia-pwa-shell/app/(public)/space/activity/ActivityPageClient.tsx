'use client';

import { useEffect, useState } from 'react';
import { customInstance, generated } from '@go2asia/sdk';
import { SpaceLayout } from '@/components/space/Shared';
import { formatDate, getErrorStatus } from '@/components/space/runtime/utils';

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
          '/v1/space/feed/activity?limit=20'
        );
        if (cancelled) return;
        setFeed(response);
      } catch (loadError) {
        if (cancelled) return;
        setFeed(null);
        const status = getErrorStatus(loadError);
        if (status === 401 || status === 403) {
          setError('Для activity baseline нужен авторизованный Space runtime session.');
        } else {
          setError(`Activity runtime request failed (${status ?? 'unknown'}).`);
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
            Narrow activity baseline on the existing `/v1/space/feed/activity` contract.
          </p>
        </header>

        {isLoading && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Загружаем activity baseline...
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {!isLoading && !error && feed && feed.items.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Пока нет видимых activity items для текущего runtime session.
          </div>
        )}

        {!isLoading && feed && feed.items.length > 0 && (
          <div className="space-y-4">
            {feed.items.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-medium text-slate-700">{item.title}</span>
                  <span>•</span>
                  <span>{item.type}</span>
                  <span>•</span>
                  <span>{formatDate(item.createdAt)}</span>
                </div>
                {item.description && (
                  <p className="mt-3 text-sm text-slate-700">{item.description}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                  {item.relatedPostId && <span>Post: {item.relatedPostId}</span>}
                  {item.relatedEntityType && <span>Entity: {item.relatedEntityType}</span>}
                  {item.relatedEntityId && <span>ID: {item.relatedEntityId}</span>}
                </div>
              </article>
            ))}
          </div>
        )}

        <footer className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h2 className="text-sm font-semibold text-amber-900">Boundedness guard</h2>
          <p className="mt-1 text-xs text-amber-800">
            Этот baseline не обещает notification-center completeness и остаётся узким отражением текущего
            runtime activity path.
          </p>
        </footer>
      </section>
    </SpaceLayout>
  );
}
