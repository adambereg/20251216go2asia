'use client';

import { useParams } from 'next/navigation';
import { useGetPlaceById } from '@go2asia/sdk/atlas';
import { Skeleton } from '@go2asia/ui';
import { getDataSource } from '@/mocks/dto';
import { mockRepo } from '@/mocks/repo';

export default function PlaceOverviewPage() {
  const params = useParams();
  const placeId = params?.id as string;

  const dataSource = getDataSource();

  // Всегда вызываем хук (правило React Hooks), но отключаем запрос в mock-режиме
  const { data: placeData, isLoading } = useGetPlaceById(dataSource === 'api' ? (placeId || '') : '');

  const mockPlace = mockRepo.atlas.getPlaceById(placeId || '');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const resolved = dataSource === 'mock' ? mockPlace : placeData ?? mockPlace;
  const isFallback = dataSource === 'api' && !placeData && Boolean(mockPlace);

  if (!resolved) {
    return (
      <div className="text-center py-12 text-slate-600">
        Данные о месте не найдены.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isFallback ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          DEMO MODE / fallback: показаны мок-данные (API недоступен).
        </div>
      ) : null}
      <h2 className="text-xl font-semibold text-slate-900">Обзор</h2>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Описание */}
        <div className="px-4 py-4 text-sm text-slate-700 space-y-2">
          <p>
            {(resolved as any).description || 'Нет описания.'}
          </p>
        </div>

        {/* Ключевая информация */}
        <div className="border-t border-slate-100 px-4 py-4">
          <h3 className="font-semibold text-slate-900 mb-3">Ключевая информация</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {(resolved as any).type && (
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                  Тип
                </div>
                <div className="text-sm font-semibold text-slate-900">
                  {(resolved as any).type}
                </div>
              </div>
            )}
            {(resolved as any).latitude && (resolved as any).longitude && (
              <>
                <div className="rounded-xl bg-slate-50 px-4 py-3">
                  <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                    Широта
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    {Number.parseFloat(String((resolved as any).latitude)).toFixed(4)}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 px-4 py-3">
                  <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                    Долгота
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    {Number.parseFloat(String((resolved as any).longitude)).toFixed(4)}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Категории */}
        {(resolved as any).categories && (resolved as any).categories.length > 0 && (
          <div className="border-t border-slate-100 px-4 py-4">
            <h3 className="font-semibold text-slate-900 mb-3">Категории</h3>
            <div className="flex flex-wrap gap-2">
              {(resolved as any).categories.map((category: string) => (
                <span
                  key={category}
                  className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Метаданные */}
        <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
          Последнее обновление:{' '}
          {(resolved as any).updatedAt ? new Date((resolved as any).updatedAt).toLocaleDateString('ru-RU') : 'Неизвестно'}
        </div>
      </section>
    </div>
  );
}
