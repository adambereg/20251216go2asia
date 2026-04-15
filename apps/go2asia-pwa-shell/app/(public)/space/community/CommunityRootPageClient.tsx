'use client';

import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { SpaceLayout } from '@/components/space/Shared';
import {
  communityDiscoveryGroupIds,
  communityDiscoverySections,
} from '@/components/space/community/discoveryContent';
import { SpaceCommunityGroupCard } from '@/components/space/community/SpaceCommunityGroupCard';
import { useSpaceCommunityDiscovery } from '@/components/space/community/useSpaceCommunityDiscovery';

function getSectionLabel(sectionTone: 'runtime' | 'summary' | 'reference'): string {
  switch (sectionTone) {
    case 'runtime':
      return 'Live now';
    case 'summary':
      return 'Summary backed';
    case 'reference':
      return 'Curated guidance';
    default:
      return 'Preview';
  }
}

export function CommunityRootPageClient() {
  const { isSignedIn } = useUser();
  const discovery = useSpaceCommunityDiscovery(communityDiscoveryGroupIds);
  const primarySectionKeys = new Set(['recommended', 'local', 'pro-led']);
  const primarySections = communityDiscoverySections.filter((section) =>
    primarySectionKeys.has(section.key)
  );
  const secondarySections = communityDiscoverySections.filter(
    (section) => !primarySectionKeys.has(section.key)
  );

  return (
    <SpaceLayout>
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-2xl font-semibold text-slate-900">Сообщества</h1>
              <p className="mt-2 text-sm text-slate-600">
                Community root помогает понять, куда встроиться, какие группы уже живут в Space и с какой
                из них лучше начать.
              </p>
              <p className="mt-3 text-xs text-slate-500">
                Формула этого route: discover → belong → enter. Поток публикаций остаётся отдельной
                поверхностью и живёт в соседнем route.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/space/community/feed"
                className="inline-flex items-center rounded-md border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-800 hover:bg-sky-100"
              >
                Открыть поток постов
              </Link>
              <Link
                href="/space"
                className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Вернуться в dashboard
              </Link>
            </div>
          </div>

          {!isSignedIn && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Без авторизации здесь показывается лёгкий discovery baseline. После входа персональные рекомендации
              могут стать точнее, но этот экран уже сейчас помогает выбрать первую группу.
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-600">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">
              Сообщества = карта входа в группы
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">
              Лента сообщества = поток публикаций
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">
              Group detail и join/leave уже live
            </span>
          </div>
        </section>

        {discovery.state === 'loading' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
            Подтягиваем live summary для community cards...
          </div>
        )}

        {discovery.state === 'unavailable' && discovery.error && (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
            {discovery.error}
          </div>
        )}

        {discovery.state === 'error' && discovery.error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm">
            {discovery.error}
          </div>
        )}

        {primarySections.map((section) => (
          <section
            key={section.key}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
                <p className="mt-1 text-sm text-slate-600">{section.description}</p>
              </div>
              <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                {getSectionLabel(section.tone)}
              </span>
            </div>

            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {section.items.map((item) => (
                <SpaceCommunityGroupCard
                  key={`${section.key}-${item.groupId}-${item.title}`}
                  item={item}
                  runtimeGroup={discovery.groupsById[item.groupId]}
                  tone={section.tone}
                />
              ))}
            </div>
          </section>
        ))}

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
          <div className="mb-3">
            <h2 className="text-base font-semibold text-slate-900">Дополнительные траектории</h2>
            <p className="mt-1 text-xs text-slate-600">
              Эти секции расширяют карту входа, но поданы компактно, чтобы не перегружать первый экран.
            </p>
          </div>
          <div className="space-y-3">
            {secondarySections.map((section) => (
              <details
                key={section.key}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{section.title}</h3>
                    <p className="mt-1 text-xs text-slate-600">{section.description}</p>
                  </div>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                    {section.items.length} группы
                  </span>
                </summary>
                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                  {section.items.map((item) => (
                    <SpaceCommunityGroupCard
                      key={`${section.key}-${item.groupId}-${item.title}`}
                      item={item}
                      runtimeGroup={discovery.groupsById[item.groupId]}
                      tone={section.tone}
                    />
                  ))}
                </div>
              </details>
            ))}
          </div>
        </section>

        <p className="text-xs text-slate-500">
          Community root остаётся discovery-first baseline: без search engine и без broad recommendation wave.
          Полный поток постов доступен отдельно на `/space/community/feed`.
        </p>
      </div>
    </SpaceLayout>
  );
}
