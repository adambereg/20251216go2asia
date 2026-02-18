'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Globe, Clock } from 'lucide-react';
import { Card, CardContent, Chip, Skeleton, SkeletonCard } from '@go2asia/ui';
import { ModuleHero } from '@/components/modules';
import { AtlasMainNav, AtlasSearchBar, EmptyStateAtlas } from '@/modules/atlas';
import { getDataSource } from '@/mocks/dto';
import { mockRepo } from '@/mocks/repo';
import { useGetGuides } from '@go2asia/sdk/guides';

const CLUSTERS = [
  { key: 'cluster:legalization', label: 'Легализация' },
  { key: 'cluster:finance', label: 'Финансы' },
  { key: 'cluster:family', label: 'Семья' },
  { key: 'cluster:lifestyle', label: 'Лайфстайл' },
  { key: 'cluster:mobility', label: 'Мобильность' },
] as const;

type ClusterKey = (typeof CLUSTERS)[number]['key'];

function toAnchorId(clusterKey: string) {
  return `cluster-${clusterKey.replace(':', '-')}`;
}

function pickCluster(tags: string[], opts: { allowUnclustered: boolean }): ClusterKey | 'unclustered' | null {
  const clusterTags = (tags ?? []).filter((t) => typeof t === 'string' && t.startsWith('cluster:'));
  const unique = Array.from(new Set(clusterTags));
  if (unique.length === 1) {
    const one = unique[0] as string;
    if (CLUSTERS.some((c) => c.key === one)) return one as ClusterKey;
    // unknown cluster:* — treat as invalid
  }
  if (unique.length !== 1) {
    // invalid (0 or >1)
  }
  if (!opts.allowUnclustered) return null;
  return 'unclustered';
}

function matchesSearch(x: { title: string; summary: string; tags: string[] }, q: string) {
  const v = q.trim().toLowerCase();
  if (!v) return true;
  const hay = `${x.title}\n${x.summary}\n${(x.tags ?? []).join(' ')}`.toLowerCase();
  return hay.includes(v);
}

export function ThemesClient() {
  const dataSource = getDataSource();
  const badgeText = dataSource === 'mock' ? 'MOCK DATA' : undefined;

  // Draft themes are allowed only when explicitly enabled.
  // NOTE: Production safety is enforced on backend: content-service rejects status=draft when ENVIRONMENT=production.
  const showDraftThemes = process.env.NEXT_PUBLIC_SHOW_DRAFT_THEMES === 'true';
  const allowUnclustered = process.env.NODE_ENV !== 'production';

  const [activeCluster, setActiveCluster] = useState<ClusterKey | 'all'>('all');
  const [search, setSearch] = useState('');

  const { data: themesData, isLoading } = useGetGuides({
    limit: 500,
    guideType: 'theme',
    enabled: dataSource === 'api',
    // status omitted => backend defaults to published|verified
  });

  const { data: draftThemesData } = useGetGuides({
    limit: 500,
    guideType: 'theme',
    status: 'draft',
    enabled: dataSource === 'api' && showDraftThemes,
  });

  // Smooth-scroll to cluster anchor when a cluster is selected
  useEffect(() => {
    if (activeCluster === 'all') return;
    const id = toAnchorId(activeCluster);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [activeCluster]);

  const themes = useMemo(() => {
    if (dataSource === 'mock') {
      // Minimal mock-mode support (UI-only). In api-mode we never fall back to mocks.
      return mockRepo.atlas.listThemes().map((t) => ({
        id: `guide_${t.id}`,
        slug: t.id,
        title: t.title,
        summary: t.description ?? '',
        heroUrl: t.heroImage ?? null,
        tags: t.tags ?? [],
        updatedAt: t.updatedAt ?? '',
        status: 'draft',
      }));
    }

    const items = [...(themesData?.items ?? [])];
    for (const it of draftThemesData?.items ?? []) items.push(it);

    const bySlug = new Map<string, (typeof items)[number]>();
    for (const it of items) {
      if (!it?.slug) continue;
      if (!bySlug.has(it.slug)) bySlug.set(it.slug, it);
      else {
        // Prefer non-draft if duplicates
        const prev = bySlug.get(it.slug)!;
        const prevScore = prev.status === 'draft' ? 0 : 1;
        const nextScore = it.status === 'draft' ? 0 : 1;
        if (nextScore > prevScore) bySlug.set(it.slug, it);
      }
    }

    return Array.from(bySlug.values()).map((t) => ({
      id: t.id,
      slug: t.slug,
      title: t.title,
      summary: t.summary ?? '',
      heroUrl: t.heroUrl ?? null,
      tags: t.tags ?? [],
      updatedAt: t.updatedAt ?? '',
      status: t.status ?? '',
    }));
  }, [dataSource, themesData, draftThemesData]);

  const clusterDiagnostics = useMemo(() => {
    if (dataSource !== 'api') return null;
    const bad: Array<{ slug: string; clusterTags: string[]; tags: string[] }> = [];
    for (const t of themes) {
      const clusterTags = (t.tags ?? []).filter((x) => x.startsWith('cluster:'));
      const unique = Array.from(new Set(clusterTags));
      if (unique.length !== 1 || !CLUSTERS.some((c) => c.key === unique[0])) {
        bad.push({ slug: t.slug, clusterTags: unique, tags: t.tags ?? [] });
      }
    }
    return bad.length > 0 ? bad : null;
  }, [themes, dataSource]);

  useEffect(() => {
    if (!clusterDiagnostics) return;
    // eslint-disable-next-line no-console
    console.warn('[atlas/themes] invalid cluster tags:', clusterDiagnostics.slice(0, 20));
  }, [clusterDiagnostics]);

  const filteredThemes = useMemo(() => {
    const q = search;
    return themes
      .filter((t) => matchesSearch({ title: t.title, summary: t.summary, tags: t.tags }, q))
      .filter((t) => {
        if (activeCluster === 'all') return true;
        const cluster = pickCluster(t.tags, { allowUnclustered });
        return cluster === activeCluster;
      });
  }, [themes, search, activeCluster, allowUnclustered]);

  const grouped = useMemo(() => {
    const map = new Map<ClusterKey | 'unclustered', typeof filteredThemes>();
    for (const c of CLUSTERS) map.set(c.key, []);
    if (allowUnclustered) map.set('unclustered', []);

    for (const t of filteredThemes) {
      const cluster = pickCluster(t.tags, { allowUnclustered });
      if (!cluster) continue;
      const arr = map.get(cluster);
      if (arr) arr.push(t);
    }

    // Sort within clusters
    for (const [k, arr] of map) {
      map.set(
        k,
        arr.slice().sort((a, b) => {
          const da = Date.parse(a.updatedAt || '') || 0;
          const db = Date.parse(b.updatedAt || '') || 0;
          return db - da || a.title.localeCompare(b.title, 'ru');
        })
      );
    }

    return map;
  }, [filteredThemes, allowUnclustered]);

  const total = themes.length;

  if (dataSource === 'api' && isLoading && !themesData) {
    return (
      <div className="min-h-screen bg-slate-50">
        <ModuleHero
          icon={Globe}
          title="Atlas Asia"
          description="«Живой» вики-справочник по странам Юго-Восточной Азии с UGC и редакционной поддержкой"
          gradientFrom="from-sky-500"
          gradientTo="to-sky-600"
          badgeText={badgeText}
        />
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <AtlasMainNav />
          <AtlasSearchBar />
        </section>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Skeleton className="h-12 w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  const showEmpty = dataSource === 'api' && !isLoading && total === 0;

  const ctaClusters = CLUSTERS.slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50">
      <ModuleHero
        icon={Globe}
        title="Atlas Asia"
        description="«Живой» вики-справочник по странам Юго-Восточной Азии с UGC и редакционной поддержкой"
        gradientFrom="from-sky-500"
        gradientTo="to-sky-600"
        badgeText={badgeText}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <AtlasMainNav />
        <AtlasSearchBar />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex items-baseline gap-3">
            <h2 className="text-h2 md:text-3xl font-bold text-slate-900">Темы</h2>
            {total > 0 ? <span className="text-base md:text-lg text-slate-500 font-normal">— {total}</span> : null}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="w-full sm:w-[320px]">
              <label className="sr-only" htmlFor="themes-search">
                Поиск по темам
              </label>
              <input
                id="themes-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск: визы, банки, семья…"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>

            {/* Mobile: cluster dropdown */}
            <div className="sm:hidden">
              <label className="sr-only" htmlFor="themes-cluster">
                Кластер
              </label>
              <select
                id="themes-cluster"
                value={activeCluster}
                onChange={(e) => setActiveCluster((e.target.value as any) || 'all')}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="all">Все кластеры</option>
                {CLUSTERS.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* "С чего начать?" */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold text-slate-900 mb-3">С чего начать?</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {ctaClusters.map((c) => (
              <a
                key={c.key}
                href={`#${toAnchorId(c.key)}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveCluster('all');
                  const el = document.getElementById(toAnchorId(c.key));
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 hover:border-sky-300 hover:bg-sky-50 transition-colors"
              >
                <div className="font-semibold text-slate-900">{c.label}</div>
                <div className="text-xs text-slate-600 mt-1">Открыть подборку тем</div>
              </a>
            ))}
          </div>
        </div>

        {/* Desktop: sticky cluster selector */}
        <div className="hidden sm:block mt-6 sticky top-20 z-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveCluster('all')}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeCluster === 'all'
                    ? 'border-sky-500 bg-sky-50 text-sky-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-sky-500 hover:text-sky-600'
                }`}
              >
                Все
              </button>
              {CLUSTERS.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setActiveCluster(c.key)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                    activeCluster === c.key
                      ? 'border-sky-500 bg-sky-50 text-sky-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-sky-500 hover:text-sky-600'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 space-y-10">
          {showEmpty ? (
            <EmptyStateAtlas
              title="Нет опубликованных тем"
              description="Похоже, в базе пока нет тем со статусом published/verified. На staging можно включить показ draft через NEXT_PUBLIC_SHOW_DRAFT_THEMES=true."
            />
          ) : (
            <>
              {CLUSTERS.map((c) => {
                const items = grouped.get(c.key) ?? [];
                if (items.length === 0) return null;
                return (
                  <section key={c.key} id={toAnchorId(c.key)} className="scroll-mt-24">
                    <div className="flex items-baseline justify-between mb-4">
                      <h3 className="text-xl font-semibold text-slate-900">{c.label}</h3>
                      <span className="text-sm text-slate-500">{items.length}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {items.map((t) => (
                        <Link key={t.slug} href={`/atlas/themes/${t.slug}`}>
                          <Card hover className="h-full overflow-hidden p-0 !border-0">
                            {t.heroUrl ? (
                              <div className="relative w-full h-48 overflow-hidden">
                                <img src={t.heroUrl} alt={t.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                  <h4 className="text-xl font-bold text-white mb-1 line-clamp-2">{t.title}</h4>
                                </div>
                              </div>
                            ) : (
                              <div className="relative w-full h-48 overflow-hidden bg-slate-200">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                  <h4 className="text-xl font-bold text-white mb-1 line-clamp-2">{t.title}</h4>
                                </div>
                              </div>
                            )}
                            <CardContent className="p-6">
                              {t.summary ? <p className="text-small text-slate-600 mb-3 line-clamp-3">{t.summary}</p> : null}
                              {t.tags && t.tags.length > 0 ? (
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {t.tags
                                    .filter((x) => !x.startsWith('cluster:'))
                                    .slice(0, 3)
                                    .map((tag) => (
                                      <Chip key={tag} size="sm" className="bg-slate-100 text-slate-700">
                                        {tag}
                                      </Chip>
                                    ))}
                                </div>
                              ) : null}
                              <div className="flex items-center gap-4 text-sm text-slate-500">
                                {t.updatedAt ? (
                                  <span className="flex items-center gap-1">
                                    <Clock size={14} />
                                    <span>
                                      {new Date(t.updatedAt).toLocaleDateString('ru-RU', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                      })}
                                    </span>
                                  </span>
                                ) : null}
                                {allowUnclustered && t.status === 'draft' ? (
                                  <Chip size="sm" className="bg-amber-50 text-amber-800">
                                    draft
                                  </Chip>
                                ) : null}
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </section>
                );
              })}

              {allowUnclustered ? (
                (() => {
                  const items = grouped.get('unclustered') ?? [];
                  if (items.length === 0) return null;
                  return (
                    <section id="cluster-unclustered" className="scroll-mt-24">
                      <div className="flex items-baseline justify-between mb-4">
                        <h3 className="text-xl font-semibold text-slate-900">Unclustered (staging)</h3>
                        <span className="text-sm text-slate-500">{items.length}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((t) => (
                          <Link key={t.slug} href={`/atlas/themes/${t.slug}`}>
                            <Card hover className="h-full overflow-hidden p-0 !border-0">
                              <CardContent className="p-6">
                                <h4 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">{t.title}</h4>
                                {t.summary ? <p className="text-small text-slate-600 mb-3 line-clamp-3">{t.summary}</p> : null}
                                {t.tags && t.tags.length > 0 ? (
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    {t.tags.slice(0, 5).map((tag) => (
                                      <Chip key={tag} size="sm" className="bg-slate-100 text-slate-700">
                                        {tag}
                                      </Chip>
                                    ))}
                                  </div>
                                ) : null}
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </section>
                  );
                })()
              ) : null}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default ThemesClient;

