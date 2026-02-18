'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Skeleton } from '@go2asia/ui';
import { getDataSource } from '@/mocks/dto';
import { mockRepo } from '@/mocks/repo';
import { AtlasThemeLayout, EmptyStateAtlas } from '@/modules/atlas';
import { useGetGuideBySlug } from '@go2asia/sdk/guides';
import { GuideSectionView } from '@/modules/atlas/guides/GuideSectionView';
import type { GuideSection } from '@/modules/atlas/guides/types';

const TAB_LABELS: Record<string, string> = {
  overview: 'Обзор',
  compare: 'Сравнение',
  practice: 'Практика',
  scenarios: 'Сценарии',
  costs: 'Стоимость и бюджеты',
  risks: 'Риски',
  checklists: 'Чек-листы',
  links: 'Ссылки',
  faq: 'FAQ',
};

function scrollToTab(tabKey: string) {
  const el = document.getElementById(tabKey);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function ThemePageClient() {
  const params = useParams();
  const slug = (params?.slug as string) || '';

  const dataSource = getDataSource();

  const { data: themeData, isLoading, error } = useGetGuideBySlug(dataSource === 'api' ? slug : '', {
    enabled: dataSource === 'api',
  });

  const [activeTab, setActiveTab] = useState<string>('overview');
  const observerRef = useRef<IntersectionObserver | null>(null);

  const resolved = useMemo(() => {
    if (dataSource === 'mock') {
      const t = mockRepo.atlas.getThemeById(slug) ?? mockRepo.atlas.listThemes()[0] ?? null;
      if (!t) return null;
      return {
        title: t.title,
        summary: t.description ?? null,
        heroUrl: t.heroImage ?? null,
        tags: t.tags ?? [],
        updatedAt: t.updatedAt ?? null,
        sections: [
          {
            id: 'mock-overview',
            tabKey: 'overview',
            title: 'Обзор',
            orderIndex: 0,
            blocks: [
              {
                id: 'mock-block',
                blockType: 'rich_text',
                orderIndex: 0,
                payload: {
                  markdown:
                    'Это демо-страница темы. В api-режиме данные берутся из Guide Engine v1 (Neon → content-service → SDK).',
                },
                isEmpty: false,
              },
            ],
            feeds: [],
            feedsResolved: [],
          } satisfies GuideSection,
        ],
      };
    }
    return themeData ?? null;
  }, [dataSource, themeData, slug]);

  const sections = useMemo(() => {
    const raw = (resolved as any)?.sections ?? [];
    return [...raw].sort((a: any, b: any) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  }, [resolved]);

  // IntersectionObserver: highlight active section
  useEffect(() => {
    if (!sections || sections.length === 0) return;

    if (observerRef.current) observerRef.current.disconnect();
    const thresholds = [0, 0.2, 0.3, 0.4, 0.6, 0.8];
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        // pick the closest to top among visible
        visible.sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));
        const id = visible[0]?.target?.id;
        if (id) setActiveTab(id);
      },
      {
        threshold: thresholds,
        rootMargin: '-20% 0px -70% 0px',
      }
    );
    observerRef.current = obs;

    for (const s of sections) {
      const el = document.getElementById(s.tabKey);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, [sections]);

  if (dataSource === 'api' && isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (dataSource === 'api' && error) {
    return (
      <AtlasThemeLayout title="Тема" description={undefined} tags={[]} lastUpdatedAt={undefined} heroImageUrl={undefined}>
        <EmptyStateAtlas
          title="Не удалось загрузить тему"
          description="Проверьте доступность API и наличие темы в базе. В api-режиме мы не показываем мок-данные как fallback."
        />
      </AtlasThemeLayout>
    );
  }

  if (!resolved) {
    return (
      <AtlasThemeLayout title="Тема" description={undefined} tags={[]} lastUpdatedAt={undefined} heroImageUrl={undefined}>
        <EmptyStateAtlas title="Тема не найдена" description="Такой темы нет в базе или у неё нет публичных секций." />
      </AtlasThemeLayout>
    );
  }

  const title = (resolved as any).title ?? 'Тема';
  const description = (resolved as any).summary ?? undefined;
  const tags = (resolved as any).tags ?? [];
  const updatedAt = (resolved as any).updatedAt ?? null;
  const lastUpdatedAt = updatedAt ? `Последнее обновление: ${new Date(updatedAt).toLocaleDateString('ru-RU')}` : undefined;
  const heroImageUrl = (resolved as any).heroUrl ?? undefined;

  const tocItems = sections.map((s: any) => ({
    tabKey: s.tabKey,
    label: s.title || TAB_LABELS[s.tabKey] || s.tabKey,
  }));

  return (
    <AtlasThemeLayout
      title={title}
      description={description}
      tags={tags}
      lastUpdatedAt={lastUpdatedAt}
      viewsCount={undefined}
      heroImageUrl={heroImageUrl}
      heroImageAlt={title}
      dataSourceBadgeText={dataSource === 'mock' ? 'MOCK DATA' : undefined}
    >
      <div className="space-y-6">
        {/* Mobile: TOC dropdown */}
        <div className="lg:hidden">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="font-semibold text-slate-900 mb-3 text-sm">Оглавление</div>
            <select
              value={activeTab}
              onChange={(e) => {
                const next = e.target.value;
                setActiveTab(next);
                scrollToTab(next);
              }}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              {tocItems.map((it) => (
                <option key={it.tabKey} value={it.tabKey}>
                  {it.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          {/* Desktop: sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-3 text-sm shadow-sm">
              <div className="font-semibold text-slate-900 mb-3">Оглавление</div>
              <nav className="space-y-1">
                {tocItems.map((it) => {
                  const isActive = activeTab === it.tabKey;
                  return (
                    <button
                      key={it.tabKey}
                      type="button"
                      onClick={() => scrollToTab(it.tabKey)}
                      className={`w-full text-left flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors ${
                        isActive ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{it.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="space-y-8">
            {sections.length === 0 ? (
              <EmptyStateAtlas title="Пока пусто" description="У этой темы пока нет секций с контентом." />
            ) : (
              sections.map((s: any) => (
                <section key={s.id} id={s.tabKey} className="scroll-mt-24">
                  <h2 className="text-xl font-semibold text-slate-900 mb-3">
                    {s.title || TAB_LABELS[s.tabKey] || s.tabKey}
                  </h2>
                  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm px-4 py-4">
                    <GuideSectionView section={s} showEmptyPlaceholder={false} />
                  </div>
                </section>
              ))
            )}
          </div>
        </div>
      </div>
    </AtlasThemeLayout>
  );
}

export default ThemePageClient;

