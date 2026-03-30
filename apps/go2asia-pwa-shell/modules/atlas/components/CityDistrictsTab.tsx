'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Skeleton } from '@go2asia/ui';
import { type ContentCityDistrictDto, listCityDistricts } from '@go2asia/sdk/content';
import { AtlasTabContent } from './AtlasTabContent';

export function CityDistrictsTab() {
  const params = useParams();
  const idOrSlug = params?.id as string | undefined;
  const [districts, setDistricts] = useState<ContentCityDistrictDto[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idOrSlug) return;
    let active = true;
    setIsLoading(true);
    setError(null);

    const load = async () => {
      try {
        const response = await listCityDistricts(idOrSlug, { limit: 100 });
        if (!active) return;
        setDistricts(response.items ?? []);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Не удалось загрузить районы.');
        setDistricts(null);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [idOrSlug]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    );
  }

  if (error || !districts || districts.length === 0) {
    return (
      <AtlasTabContent
        entityType="city"
        tabKey="districts"
        title="Районы"
        emptyMessage="Структурированные районы ещё не опубликованы."
      />
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Районы</h2>
      <section className="grid gap-3 md:grid-cols-2">
        {districts.map((district) => (
          <Link
            key={district.id}
            href={`/atlas/cities/${encodeURIComponent(idOrSlug ?? '')}/places?district=${encodeURIComponent(district.slug)}`}
            className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <article>
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold text-slate-900">{district.name}</h3>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{district.slug}</span>
              </div>
              {district.nameLocal ? <p className="mt-1 text-sm text-slate-500">{district.nameLocal}</p> : null}
              {district.descriptionShort ? (
                <p className="mt-2 text-sm leading-6 text-slate-700">{district.descriptionShort}</p>
              ) : (
                <p className="mt-2 text-sm text-slate-500">Описание района будет добавлено.</p>
              )}
            </article>
          </Link>
        ))}
      </section>
    </div>
  );
}

