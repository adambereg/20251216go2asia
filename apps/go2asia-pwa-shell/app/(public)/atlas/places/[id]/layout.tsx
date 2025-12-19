'use client';

import type { ReactNode } from 'react';
import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import { AtlasPlaceLayout } from '@/modules/atlas';
import {
  Info,
  Image,
  Map,
  BookOpen,
  MapPin,
  UtensilsCrossed,
  Route,
  HelpCircle,
  Star,
  Gift,
} from 'lucide-react';
import { useGetPlaceById } from '@go2asia/sdk/atlas';
import { Skeleton } from '@go2asia/ui';
import { getDataSource } from '@/mocks/dto';
import { mockRepo } from '@/mocks/repo';

const sideNavItems = [
  { key: 'overview', label: 'Обзор', icon: Info, href: '' },
  { key: 'gallery', label: 'Галерея', icon: Image, href: 'gallery' },
  { key: 'map', label: 'На карте', icon: Map, href: 'map' },
  { key: 'history', label: 'История и факты', icon: BookOpen, href: 'history' },
  { key: 'nearby-places', label: 'Достопримечательности рядом', icon: MapPin, href: 'nearby-places' },
  { key: 'nearby-services', label: 'Что рядом', icon: UtensilsCrossed, href: 'nearby-services' },
  { key: 'guides', label: 'Гайды, маршруты', icon: Route, href: 'guides' },
  { key: 'tips', label: 'Практическая информация', icon: HelpCircle, href: 'tips' },
  { key: 'reviews', label: 'Отзывы', icon: Star, href: 'reviews' },
  { key: 'partners', label: 'Партнёрские предложения', icon: Gift, href: 'partners' },
] as const;

export default function PlaceLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const placeIdFromUrl = params?.id as string;
  const placeId = pathname.split('/').slice(0, 4).join('/'); // /atlas/places/[id]

  const dataSource = getDataSource();

  // API mode: use SDK hook (currently placeholder in SDK)
  const { data: placeData, isLoading } =
    dataSource === 'api' ? useGetPlaceById(placeIdFromUrl || '') : ({ data: null, isLoading: false } as any);

  const mockPlace = dataSource === 'mock' ? mockRepo.atlas.getPlaceById(placeIdFromUrl || '') : null;

  const title = (dataSource === 'mock' ? mockPlace?.name : placeData?.name) || 'Загрузка...';
  const cityName = (dataSource === 'mock' ? mockPlace?.city : '') || '';
  const countryName = (dataSource === 'mock' ? mockPlace?.country : '') || '';
  const heroImageUrl =
    (dataSource === 'mock' ? mockPlace?.photos?.[0] : placeData?.photos?.[0]) ||
    'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg';
  const heroImageAlt = title || 'Место';
  const tags = (dataSource === 'mock' ? mockPlace?.categories : placeData?.categories) || [];
  const rating = (dataSource === 'mock' ? mockPlace?.rating : undefined) ?? 0;

  const updatedAt = dataSource === 'mock' ? mockPlace?.updatedAt : placeData?.updatedAt;
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

  return (
    <AtlasPlaceLayout
      title={title}
      cityName={cityName}
      countryName={countryName}
      isRussianFriendly={false}
      isPartner={false}
      isPopular={true}
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
              {sideNavItems.map((item) => {
                const Icon = item.icon;
                const href = item.href === '' ? placeId : `${placeId}/${item.href}`;
                const isActive = item.href === '' ? pathname === placeId : pathname === href;
                return (
                  <Link
                    key={item.key}
                    href={href}
                    className={`flex flex-col items-center gap-1 rounded-lg px-3 py-2 min-w-[80px] transition-colors whitespace-nowrap ${
                      isActive ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs text-center leading-tight">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Основной контент с вертикальным меню на десктопе */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
          {/* Вертикальное меню для десктопа */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-3 text-sm shadow-sm">
              <div className="font-semibold text-slate-900 mb-3">Структура справочника</div>
              <nav className="space-y-1">
                {sideNavItems.map((item) => {
                  const Icon = item.icon;
                  const href = item.href === '' ? placeId : `${placeId}/${item.href}`;
                  const isActive = item.href === '' ? pathname === placeId : pathname === href;
                  return (
                    <Link
                      key={item.key}
                      href={href}
                      className={`flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors ${
                        isActive ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Контент */}
          <section>{children}</section>
        </div>
      </div>
    </AtlasPlaceLayout>
  );
}
