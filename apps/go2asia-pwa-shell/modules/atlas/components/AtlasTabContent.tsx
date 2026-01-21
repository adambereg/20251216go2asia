'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Skeleton } from '@go2asia/ui';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  type ContentTabDto,
  type CountryTabKey,
  type CityTabKey,
  listCountryTabs,
  listCityTabs,
} from '@go2asia/sdk/content';

type AtlasTabKey = CountryTabKey | CityTabKey;

export interface AtlasTabContentProps {
  entityType: 'country' | 'city';
  tabKey: AtlasTabKey;
  title: string;
  emptyMessage?: string;
}

export function AtlasTabContent({ entityType, tabKey, title, emptyMessage }: AtlasTabContentProps) {
  const params = useParams();
  const idOrSlug = params?.id as string | undefined;
  const [tab, setTab] = useState<ContentTabDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idOrSlug) return;
    let active = true;
    setIsLoading(true);
    setError(null);

    const load = async () => {
      try {
        const response =
          entityType === 'country'
            ? await listCountryTabs(idOrSlug, { lang: 'ru', tabKey: tabKey as CountryTabKey })
            : await listCityTabs(idOrSlug, { lang: 'ru', tabKey: tabKey as CityTabKey });
        if (!active) return;
        setTab(response.items?.[0] ?? null);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Не удалось загрузить данные вкладки.');
      } finally {
        if (active) setIsLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [entityType, idOrSlug, tabKey]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
          <Skeleton className="h-4 w-full mb-4" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  const body = tab?.bodyMarkdown?.trim();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {error ? (
          <div className="px-4 py-4 text-sm text-amber-900">{error}</div>
        ) : body ? (
          <div className="px-4 py-4 prose prose-sm max-w-none prose-slate">
            <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>
              {body}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="px-4 py-4 text-sm text-slate-600">
            {emptyMessage ?? 'Контент в разработке.'}
          </div>
        )}

        {tab?.updatedAt && (
          <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
            Последнее обновление: {new Date(tab.updatedAt).toLocaleDateString('ru-RU')}
          </div>
        )}
      </section>
    </div>
  );
}

