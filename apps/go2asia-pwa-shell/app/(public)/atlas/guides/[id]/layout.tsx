'use client';

import type { ReactNode } from 'react';
import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import { AtlasGuideLayout } from '@/modules/atlas';
import { useGetGuideBySlug } from '@go2asia/sdk/guides';
import { Skeleton } from '@go2asia/ui';
import { getDataSource } from '@/mocks/dto';
import { mockRepo } from '@/mocks/repo';
import { GuideProvider } from '@/modules/atlas/guides/GuideContext';
import { GUIDE_TAB_META } from '@/modules/atlas/guides/guideTabs';
import { mockGuideToGuideDetail } from '@/modules/atlas/guides/mockAdapter';
import type { GuideDetail } from '@/modules/atlas/guides/types';

function normalizeGuideTypeLabel(raw: string): string {
  if (!raw) return '';
  return raw;
}

export default function GuideLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const slugFromUrl = params?.id as string;
  const guideBasePath = pathname.split('/').slice(0, 4).join('/'); // /atlas/guides/[id]

  const dataSource = getDataSource();

  // API: Guide Engine v1
  const { 
    data: guideData, 
    isLoading 
  } = useGetGuideBySlug(dataSource === 'api' ? (slugFromUrl || '') : '', { enabled: dataSource === 'api' });

  const mockGuide = dataSource === 'mock' ? mockRepo.atlas.getGuideByIdOrSlug(slugFromUrl || '') : null;
  const mockCity = dataSource === 'mock' && mockGuide?.cityId ? mockRepo.atlas.getCityById(mockGuide.cityId) : null;
  const mockCountry =
    dataSource === 'mock'
      ? mockRepo.atlas.getCountryById(mockGuide?.countryId || mockCity?.countryId || '')
      : null;

  const resolvedGuide: GuideDetail | null =
    dataSource === 'mock' && mockGuide ? mockGuideToGuideDetail(mockGuide) : (guideData as unknown as GuideDetail | null);

  // Определяем данные гайда
  const title = resolvedGuide?.title || 'Загрузка...';
  const cityName = dataSource === 'mock' ? mockCity?.name : ''; // TODO(api): derive from atlas links
  const countryName = dataSource === 'mock' ? mockCountry?.name : ''; // TODO(api): derive from atlas links
  const heroImageUrl =
    (dataSource === 'mock' ? mockGuide?.coverImage : resolvedGuide?.heroUrl) ||
    'https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg';
  const heroImageAlt = title || 'Гайд';
  const guideType = normalizeGuideTypeLabel(dataSource === 'mock' ? (mockGuide?.category ?? '') : (resolvedGuide?.guideType ?? ''));
  const readingTime = 0; // TODO: Get readingTime when API supports it
  const duration = ''; // TODO: Get duration when API supports it
  const tags = (dataSource === 'mock' ? mockGuide?.tags : resolvedGuide?.tags ?? []) || [];
  const rating = 0; // TODO: Get rating when API supports it
  const updatedAt = dataSource === 'mock' ? mockGuide?.updatedAt : resolvedGuide?.updatedAt ?? undefined;
  const lastUpdatedAt = updatedAt
    ? `Последнее обновление: ${new Date(updatedAt).toLocaleDateString('ru-RU')}`
    : 'Последнее обновление: 17.11.2025';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const sections = (resolvedGuide?.sections ?? []).slice().sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <GuideProvider value={{ guide: resolvedGuide, isLoading: false, isAdminView: false, error: null }}>
      <AtlasGuideLayout
        title={title}
        cityName={cityName}
        countryName={countryName}
        guideType={guideType}
        readingTime={readingTime}
        duration={duration}
        isEditor={true}
        rating={rating}
        tags={tags}
        lastUpdatedAt={lastUpdatedAt}
        viewsCount={1234}
        heroImageUrl={heroImageUrl}
        heroImageAlt={heroImageAlt}
        dataSourceBadgeText={dataSource === 'mock' ? 'MOCK DATA' : undefined}
      >
        <div className="space-y-6">
          {/* Горизонтальное меню для мобильных */}
          <div className="lg:hidden">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="font-semibold text-slate-900 mb-3 text-sm">Структура справочника</div>
              <nav className="flex gap-2 overflow-x-auto pb-2 -mx-3 px-3">
                {sections.map((s) => {
                  const meta = GUIDE_TAB_META[s.tabKey];
                  const Icon = meta?.icon;
                  const label = s.title || meta?.label || s.tabKey;
                  const href = s.tabKey === 'overview' ? guideBasePath : `${guideBasePath}/${s.tabKey}`;
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={s.id}
                      href={href}
                      className={`flex flex-col items-center gap-1 rounded-lg px-3 py-2 min-w-[80px] transition-colors whitespace-nowrap ${
                        isActive ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {Icon ? <Icon className="h-4 w-4" /> : null}
                      <span className="text-xs text-center leading-tight">{label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Основной контент с вертикальным меню на десктопе */}
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-3 text-sm shadow-sm">
                <div className="font-semibold text-slate-900 mb-3">Структура справочника</div>
                <nav className="space-y-1">
                  {sections.map((s) => {
                    const meta = GUIDE_TAB_META[s.tabKey];
                    const Icon = meta?.icon;
                    const label = s.title || meta?.label || s.tabKey;
                    const href = s.tabKey === 'overview' ? guideBasePath : `${guideBasePath}/${s.tabKey}`;
                    const isActive = pathname === href;
                    return (
                      <Link
                        key={s.id}
                        href={href}
                        className={`flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors ${
                          isActive ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {Icon ? <Icon className="h-4 w-4 flex-shrink-0" /> : null}
                        <span>{label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </aside>

            <section>{children}</section>
          </div>
        </div>
      </AtlasGuideLayout>
    </GuideProvider>
  );
}

