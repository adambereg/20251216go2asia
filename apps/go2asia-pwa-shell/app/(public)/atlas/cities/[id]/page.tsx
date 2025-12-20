'use client';

import { useParams } from 'next/navigation';
import { useGetCityById } from '@go2asia/sdk/atlas';
import { Skeleton } from '@go2asia/ui';
import { getDataSource } from '@/mocks/dto';
import { mockRepo } from '@/mocks/repo';

export default function CityOverviewPage() {
  const params = useParams();
  const cityId = params?.id as string;

  const { 
    data: cityData, 
    isLoading 
  } = getDataSource() === 'api'
    ? useGetCityById(cityId || '')
    : ({ data: null, isLoading: false } as any);

  const dataSource = getDataSource();
  const mockCity = dataSource === 'mock' ? mockRepo.atlas.getCityById(cityId || '') : null;
  const resolved: any = dataSource === 'mock' ? mockCity : cityData;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!resolved) {
    return (
      <div className="text-center py-12 text-slate-600">
        Данные о городе не найдены.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Обзор</h2>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* TL;DR полоса */}
        <div className="border-b border-slate-100 bg-sky-50 px-4 py-3 text-sm text-slate-800">
          {resolved.description || 'Нет краткого описания.'}
        </div>

        {/* Основное описание */}
        <div className="px-4 py-4 text-sm text-slate-700 space-y-2">
          <p>
            {resolved.description || 'Нет подробного описания.'}
          </p>
        </div>

        {/* Ключевые цифры */}
        <div className="grid gap-3 border-t border-slate-100 px-4 py-4 text-sm text-slate-800 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Места
            </div>
            <div className="mt-1 font-semibold">{resolved.placesCount || 0}</div>
          </div>
          {resolved.latitude && resolved.longitude && (
            <>
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Широта
                </div>
                <div className="mt-1 font-semibold">{resolved.latitude.toFixed(4)}</div>
              </div>
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Долгота
                </div>
                <div className="mt-1 font-semibold">{resolved.longitude.toFixed(4)}</div>
              </div>
            </>
          )}
        </div>

        {/* Метаданные */}
        <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
          Последнее обновление: {resolved.updatedAt ? new Date(resolved.updatedAt).toLocaleDateString('ru-RU') : 'Неизвестно'}
        </div>
      </section>
    </div>
  );
}
