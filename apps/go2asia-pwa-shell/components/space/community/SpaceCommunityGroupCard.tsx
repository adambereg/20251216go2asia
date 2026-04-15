'use client';

import Link from 'next/link';
import { generated } from '@go2asia/sdk';
import { getGroupHref } from '@/components/space/runtime/utils';
import type { CommunityDiscoveryItem, CommunitySectionTone } from './discoveryContent';

type SpaceCommunityGroupCardProps = {
  item: CommunityDiscoveryItem;
  runtimeGroup?: generated.SpaceGroupResponse;
  tone: CommunitySectionTone;
};

function getToneLabel(tone: CommunitySectionTone): string {
  switch (tone) {
    case 'runtime':
      return 'Live';
    case 'summary':
      return 'Summary';
    case 'reference':
      return 'Curated';
    default:
      return 'Preview';
  }
}

export function SpaceCommunityGroupCard({
  item,
  runtimeGroup,
  tone,
}: SpaceCommunityGroupCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{item.shortDescription}</p>
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
          {getToneLabel(tone)}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {runtimeGroup && (
          <>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-600">
              {runtimeGroup.visibility}
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-600">
              Участников: {runtimeGroup.membersCount}
            </span>
          </>
        )}
        {item.activityHint && (
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-600">
            Ритм: {item.activityHint}
          </span>
        )}
        {item.membersHint && (
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-600">
            {item.membersHint}
          </span>
        )}
      </div>

      <dl className="mt-4 space-y-3 text-sm text-slate-700">
        {item.whoFor && (
          <div>
            <dt className="font-medium text-slate-900">Для кого</dt>
            <dd className="mt-1">{item.whoFor}</dd>
          </div>
        )}
        {item.whyRecommended && (
          <div>
            <dt className="font-medium text-slate-900">Почему сейчас</dt>
            <dd className="mt-1">{item.whyRecommended}</dd>
          </div>
        )}
        <div>
          <dt className="font-medium text-slate-900">Зачем вступать</dt>
          <dd className="mt-1">{item.whyJoin}</dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
        {item.curatorHint && <span>Куратор: {item.curatorHint}</span>}
        {item.linkedContext && <span>Контекст: {item.linkedContext}</span>}
        {runtimeGroup?.status && <span>Статус: {runtimeGroup.status}</span>}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          {runtimeGroup
            ? 'Карточка опирается на live group summary и curated discovery copy.'
            : 'Карточка пока работает как curated discovery copy без live summary.'}
        </p>
        <Link
          href={getGroupHref(item.groupId)}
          className="inline-flex items-center rounded-md border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-800 hover:bg-sky-100"
        >
          {item.ctaLabel}
        </Link>
      </div>
    </article>
  );
}
