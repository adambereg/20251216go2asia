'use client';

import type { ReactNode } from 'react';
import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import { AtlasCityLayout } from '@/modules/atlas';
import {
  Info,
  MapPin,
  Home,
  UtensilsCrossed,
  Landmark,
  Train,
  CloudSun,
  ShoppingBag,
  Moon,
  BookOpen,
  HelpCircle,
  Star,
  Calculator,
} from 'lucide-react';
import { useGetCityById } from '@go2asia/sdk/atlas';
import { Skeleton } from '@go2asia/ui';
import { getDataSource } from '@/mocks/dto';
import { mockRepo } from '@/mocks/repo';

const sideNavItems = [
  { key: 'overview', label: 'Обзор', icon: Info, href: '' },
  { key: 'districts', label: 'Районы', icon: MapPin, href: 'districts' },
  { key: 'accommodation', label: 'Проживание', icon: Home, href: 'accommodation' },
  { key: 'food', label: 'Еда и кафе', icon: UtensilsCrossed, href: 'food' },
  { key: 'places', label: 'Достопримечательности', icon: Landmark, href: 'places' },
  { key: 'transport', label: 'Транспорт', icon: Train, href: 'transport' },
  { key: 'weather', label: 'Погода и сезонность', icon: CloudSun, href: 'weather' },
  { key: 'shopping', label: 'Шопинг', icon: ShoppingBag, href: 'shopping' },
  { key: 'nightlife', label: 'Ночная жизнь', icon: Moon, href: 'nightlife' },
  { key: 'guides', label: 'Гайды', icon: BookOpen, href: 'guides' },
  { key: 'tips', label: 'Практическая информация', icon: HelpCircle, href: 'tips' },
  { key: 'reviews', label: 'Отзывы', icon: Star, href: 'reviews' },
  { key: 'budget', label: 'Цены и бюджет', icon: Calculator, href: 'budget' },
] as const;

export default function CityLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const cityIdFromUrl = params?.id as string;
  const cityId = pathname.split('/').slice(0, 4).join('/'); // /atlas/cities/[id]

  const dataSource = getDataSource();
  // PROD: показываем только страницы, которые реально работают с API.
  const navItems =
    dataSource === 'mock' ? sideNavItems : sideNavItems.filter((i) => i.key === 'overview');

  // Загружаем данные города из API через SDK hook
  const { 
    data: cityData, 
    isLoading 
  } = useGetCityById(dataSource === 'api' ? (cityIdFromUrl || '') : '');

  const mockCity = dataSource === 'mock' ? mockRepo.atlas.getCityById(cityIdFromUrl || '') : null;
  const mockCountry = dataSource === 'mock' && mockCity ? mockRepo.atlas.getCountryById(mockCity.countryId) : null;

  // Определяем данные города из API
  const cityName = (dataSource === 'mock' ? mockCity?.name : cityData?.name) || 'Загрузка...';
  const cityNameNative = ''; // TODO: Get nameNative when API supports it
  const countryName =
    dataSource === 'mock' ? mockCountry?.name : ''; // TODO(api): derive from countryId
  const heroImageUrl =
    (dataSource === 'mock' ? mockCity?.heroImage : undefined) ||
    '/atlas/hero-placeholder.svg';
  const heroImageAlt = cityName || 'Город';
  // ContentCityDto не содержит updatedAt в текущем контракте → показываем дату только в mock-режиме
  const updatedAt = dataSource === 'mock' ? mockCity?.updatedAt : undefined;
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
    <AtlasCityLayout
      cityName={cityName}
      cityNameNative={cityNameNative}
      countryName={countryName}
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
            <div className="font-semibold text-slate-900 mb-3 text-sm">
              Структура справочника
            </div>
            <nav className="flex gap-2 overflow-x-auto pb-2 -mx-3 px-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const href = item.href === '' ? cityId : `${cityId}/${item.href}`;
                const isActive =
                  item.href === '' ? pathname === cityId : pathname === href;
                return (
                  <Link
                    key={item.key}
                    href={href}
                    className={`flex flex-col items-center gap-1 rounded-lg px-3 py-2 min-w-[80px] transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-sky-50 text-sky-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs text-center leading-tight">
                      {item.label}
                    </span>
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
              <div className="font-semibold text-slate-900 mb-3">
                Структура справочника
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const href = item.href === '' ? cityId : `${cityId}/${item.href}`;
                  const isActive =
                    item.href === '' ? pathname === cityId : pathname === href;
                  return (
                    <Link
                      key={item.key}
                      href={href}
                      className={`flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors ${
                        isActive
                          ? 'bg-sky-50 text-sky-700'
                          : 'text-slate-700 hover:bg-slate-50'
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
    </AtlasCityLayout>
  );
}

