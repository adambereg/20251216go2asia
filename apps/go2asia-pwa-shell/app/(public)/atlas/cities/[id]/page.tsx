'use client';

import { useParams } from 'next/navigation';
import { useGetCityById } from '@go2asia/sdk/atlas';
import { Skeleton } from '@go2asia/ui';
import { getDataSource } from '@/mocks/dto';
import { getMockCityById } from '@/modules/atlas/mockAtlasData';
import { formatNumber } from '@/modules/atlas/utils/number';
import { AtlasTabContent } from '@/modules/atlas/components/AtlasTabContent';

export default function CityOverviewPage() {
  const params = useParams();
  const cityId = params?.id as string;

  const dataSource = getDataSource();
  // Всегда вызываем хук (правило React Hooks), но отключаем запрос в mock-режиме
  const { 
    data: cityData, 
    isLoading 
  } = useGetCityById(dataSource === 'api' ? (cityId || '') : '');
  const resolved: any = dataSource === 'mock' ? getMockCityById(cityId || '') : cityData ?? null;

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

  const latitude = formatNumber(resolved.latitude, 4);
  const longitude = formatNumber(resolved.longitude, 4);

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
          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Широта
            </div>
            <div className="mt-1 font-semibold">{latitude ?? '—'}</div>
          </div>
          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Долгота
            </div>
            <div className="mt-1 font-semibold">{longitude ?? '—'}</div>
          </div>
        </div>

        {/* Метаданные */}
        <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
          Последнее обновление: {resolved.updatedAt ? new Date(resolved.updatedAt).toLocaleDateString('ru-RU') : 'Неизвестно'}
        </div>
      </section>

      <AtlasTabContent entityType="city" tabKey="overview" title="Текст раздела" />
    </div>
  );
}
