'use client';

import { useParams } from 'next/navigation';
import { useGetCountryById } from '@go2asia/sdk/atlas';
import { Skeleton } from '@go2asia/ui';
import { getDataSource } from '@/mocks/dto';
import { mockRepo } from '@/mocks/repo';

export default function CountryOverviewPage() {
  const params = useParams();
  const countryId = params?.id as string;
  const dataSource = getDataSource();

  // Загружаем данные страны из API
  // enabled обрабатывается автоматически внутри hook (проверка на пустой id)
  const { 
    data: countryData, 
    isLoading 
  } = useGetCountryById(dataSource === 'api' ? (countryId || '') : '');

  const mockCountry = dataSource === 'mock' ? mockRepo.atlas.getCountryById(countryId || '') : null;
  const resolved: any =
    dataSource === 'mock'
      ? mockCountry
      : countryData ?? mockRepo.atlas.getCountryById(countryId || '');

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

  if (!resolved) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-slate-900">Обзор</h2>
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
          <p className="text-slate-600">Данные о стране не найдены.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Обзор</h2>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* TL;DR полоса */}
        {resolved.description && (
          <div className="border-b border-slate-100 bg-sky-50 px-4 py-3 text-sm text-slate-800">
            {resolved.description}
          </div>
        )}

        {/* Основное описание */}
        {resolved.description && (
          <div className="px-4 py-4 text-sm text-slate-700 space-y-2">
            <p>{resolved.description}</p>
          </div>
        )}

        {/* Ключевые цифры */}
        <div className="grid gap-3 border-t border-slate-100 px-4 py-4 text-sm text-slate-800 sm:grid-cols-3">
          {resolved.code && (
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                ISO код
              </div>
              <div className="mt-1 font-semibold">{resolved.code}</div>
            </div>
          )}
          {resolved.citiesCount !== undefined && (
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Городов
              </div>
              <div className="mt-1 font-semibold">{resolved.citiesCount}</div>
            </div>
          )}
          {resolved.placesCount !== undefined && (
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Мест
              </div>
              <div className="mt-1 font-semibold">{resolved.placesCount}</div>
            </div>
          )}
        </div>

        {/* Метаданные */}
        {resolved.updatedAt && (
          <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
            Последнее обновление: {new Date(resolved.updatedAt).toLocaleDateString('ru-RU')}
          </div>
        )}
      </section>
    </div>
  );
}
