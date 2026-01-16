'use client';

import type { ReactNode } from 'react';
import { usePathname, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AtlasThemeLayout } from '@/modules/atlas';
import {
  Info,
  Globe2,
  BookOpen,
  MapPin,
  HelpCircle,
  Calendar,
  MessageCircle,
  History,
} from 'lucide-react';
import { getDataSource } from '@/mocks/dto';
import { mockRepo } from '@/mocks/repo';

const mockThemes = mockRepo.atlas.listThemes();

const sideNavItems = [
  { key: 'overview', label: 'Обзор', icon: Info, href: '' },
  { key: 'countries', label: 'По странам', icon: Globe2, href: 'countries' },
  { key: 'guides', label: 'Гайды по теме', icon: BookOpen, href: 'guides' },
  { key: 'places', label: 'Подборки мест', icon: MapPin, href: 'places' },
  { key: 'tips', label: 'Практическая информация', icon: HelpCircle, href: 'tips' },
  { key: 'events', label: 'События рядом', icon: Calendar, href: 'events' },
  { key: 'reviews', label: 'Отзывы и опыт', icon: MessageCircle, href: 'reviews' },
  { key: 'versions', label: 'Версии и обновления', icon: History, href: 'versions' },
] as const;

interface ThemeData {
  title: string;
  description?: string;
  heroImage?: string;
  tags?: string[];
  updatedAt?: string;
}

export default function ThemeLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const themeIdFromUrl = params?.id as string;
  const themeId = pathname.split('/').slice(0, 4).join('/'); // /atlas/themes/[id]

  const [themeData, setThemeData] = useState<ThemeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dataSource = getDataSource();

  // Загружаем данные темы из API
  useEffect(() => {
    if (dataSource === 'mock') {
      setThemeData(null);
      setIsLoading(false);
      return;
    }
    if (!themeIdFromUrl) {
      setIsLoading(false);
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.go2asia.space';
    fetch(`${apiUrl}/v1/api/content/themes/${themeIdFromUrl}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return null;
      })
      .then((data) => {
        if (data) {
          setThemeData(data);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [themeIdFromUrl]);

  // Определяем данные темы: сначала из API, потом из моков, потом дефолт
  const themeIdKey = themeIdFromUrl?.toLowerCase() || '';
  const fallbackMockTheme =
    mockThemes.find((t) => t.id === themeIdKey) || mockThemes[0];
  
  const title = themeData?.title || fallbackMockTheme.title;
  const description = themeData?.description || fallbackMockTheme.description;
  const heroImageUrl = themeData?.heroImage || fallbackMockTheme.heroImage;
  const heroImageAlt = themeData?.title || fallbackMockTheme.title;
  const tags = themeData?.tags || fallbackMockTheme.tags;
  const lastUpdatedAt = (themeData?.updatedAt || fallbackMockTheme.updatedAt)
    ? `Последнее обновление: ${new Date((themeData?.updatedAt || fallbackMockTheme.updatedAt) as string).toLocaleDateString('ru-RU')}`
    : 'Последнее обновление: 17.11.2025';

  return (
    <AtlasThemeLayout
      title={title}
      description={description}
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
            <div className="font-semibold text-slate-900 mb-3 text-sm">
              Структура справочника
            </div>
            <nav className="flex gap-2 overflow-x-auto pb-2 -mx-3 px-3">
              {sideNavItems.map((item) => {
                const Icon = item.icon;
                const href = item.href === '' ? themeId : `${themeId}/${item.href}`;
                const isActive =
                  item.href === '' ? pathname === themeId : pathname === href;
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
                  const href = item.href === '' ? themeId : `${themeId}/${item.href}`;
                  const isActive =
                    item.href === '' ? pathname === themeId : pathname === href;
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
    </AtlasThemeLayout>
  );
}

