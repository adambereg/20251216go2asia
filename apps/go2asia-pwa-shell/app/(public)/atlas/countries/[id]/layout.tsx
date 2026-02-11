'use client';

import type { ReactNode } from 'react';
import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import { AtlasCountryLayout } from '@/modules/atlas';
import {
  Info,
  Image,
  Map,
  Building2,
  CloudSun,
  History,
  Globe2,
  Palette,
  Home,
  BadgeCheck,
  Briefcase,
  Landmark,
  MessageCircle,
  Star,
  Calculator,
} from 'lucide-react';
import { useGetCountryById } from '@go2asia/sdk/atlas';
import { Skeleton } from '@go2asia/ui';
import { getDataSource } from '@/mocks/dto';
import { mockRepo } from '@/mocks/repo';

const sideNavItems = [
  { key: 'overview', label: 'Обзор', icon: Info, href: '' },
  { key: 'gallery', label: 'Фотогалерея', icon: Image, href: 'gallery' },
  { key: 'map', label: 'Карта', icon: Map, href: 'map' },
  { key: 'cities', label: 'Города', icon: Building2, href: 'cities' },
  { key: 'weather', label: 'Погода и климат', icon: CloudSun, href: 'weather' },
  { key: 'history', label: 'История', icon: History, href: 'history' },
  { key: 'geography', label: 'География', icon: Globe2, href: 'geography' },
  { key: 'culture', label: 'Культура', icon: Palette, href: 'culture' },
  { key: 'living', label: 'Проживание', icon: Home, href: 'living' },
  { key: 'visas', label: 'Визы', icon: BadgeCheck, href: 'visas' },
  { key: 'business', label: 'Бизнес', icon: Briefcase, href: 'business' },
  { key: 'sights', label: 'Достопримечательности', icon: Landmark, href: 'places' },
  { key: 'phrasebook', label: 'Разговорник', icon: MessageCircle, href: 'phrasebook' },
  { key: 'reviews', label: 'Отзывы экспатов', icon: Star, href: 'reviews' },
  { key: 'calculator', label: 'Калькулятор стоимости', icon: Calculator, href: 'calculator' },
] as const;

export default function CountryLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const countryIdFromUrl = params?.id as string;
  const countryId = pathname.split('/').slice(0, 4).join('/'); // /atlas/countries/[id]

  const dataSource = getDataSource();

  // Загружаем данные страны из API через SDK hook
  // enabled обрабатывается автоматически внутри hook (проверка на пустой id)
  const { 
    data: countryData, 
    isLoading 
  } = useGetCountryById(dataSource === 'api' ? (countryIdFromUrl || '') : '');

  const mockCountry = dataSource === 'mock' ? mockRepo.atlas.getCountryById(countryIdFromUrl || '') : null;

  // Определяем данные страны из API
  const countryName = (dataSource === 'mock' ? mockCountry?.name : countryData?.name) || 'Загрузка...';
  const flagEmoji = (dataSource === 'mock' ? mockCountry?.flag : countryData?.flag) || '🌏';
  // ВАЖНО: в API-режиме не используем Pexels fallback, чтобы не было "вспышки"
  // демо-обложки на первом рендере/гидрации до прихода данных из API (R2).
  const heroImageUrl =
    dataSource === 'mock'
      ? (mockCountry?.heroImage || 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg')
      : (countryData?.heroImage || undefined);
  const heroImageAlt = countryName || 'Страна';
  // ContentCountryDto не содержит updatedAt в текущем контракте → показываем дату только в mock-режиме
  const updatedAt = dataSource === 'mock' ? mockCountry?.updatedAt : undefined;
  const lastUpdatedAt = updatedAt
    ? `Последнее обновление: ${new Date(updatedAt).toLocaleDateString('ru-RU')}`
    : 'Последнее обновление: недавно';

  // Показываем Skeleton при загрузке
  if (isLoading) {
    return (
      <AtlasCountryLayout
        countryName="Загрузка..."
        flagEmoji="🌏"
        lastUpdatedAt=""
        viewsCount={0}
        heroImageUrl={heroImageUrl}
        heroImageAlt="Загрузка"
      >
        <div className="space-y-6">
          <Skeleton className="h-64 w-full" />
        </div>
      </AtlasCountryLayout>
    );
  }

  return (
    <AtlasCountryLayout
      countryName={countryName}
      flagEmoji={flagEmoji || '🌏'}
      lastUpdatedAt={lastUpdatedAt}
      viewsCount={0} // TODO: Get viewsCount when API supports it
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
              {sideNavItems.map((item) => {
                const Icon = item.icon;
                const href = item.href === '' ? countryId : `${countryId}/${item.href}`;
                const isActive =
                  item.href === '' ? pathname === countryId : pathname === href;
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
                {sideNavItems.map((item) => {
                  const Icon = item.icon;
                  const href = item.href === '' ? countryId : `${countryId}/${item.href}`;
                  const isActive =
                    item.href === '' ? pathname === countryId : pathname === href;
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
    </AtlasCountryLayout>
  );
}


