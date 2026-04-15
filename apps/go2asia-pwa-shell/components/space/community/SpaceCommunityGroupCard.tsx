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
  const compactEntryLine = item.whoFor
    ? `${item.whoFor} ${item.whyJoin}`
    : item.whyRecommended ?? item.whyJoin;

  const hintChips: string[] = [];
  if (runtimeGroup?.membersCount !== undefined) {
    hintChips.push(`Участников: ${runtimeGroup.membersCount}`);
  }
  if (item.activityHint) {
    hintChips.push(`Ритм: ${item.activityHint}`);
  } else if (item.membersHint) {
    hintChips.push(item.membersHint);
  } else if (runtimeGroup?.visibility) {
    hintChips.push(runtimeGroup.visibility);
  }

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

      <p className="mt-3 text-sm text-slate-700">{compactEntryLine}</p>

      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
        {hintChips.slice(0, 2).map((hint) => (
          <span
            key={`${item.groupId}-${hint}`}
            className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1"
          >
            {hint}
          </span>
        ))}
      </div>

      {(item.curatorHint || item.linkedContext) && (
        <div className="mt-3 text-xs text-slate-500">
          {item.curatorHint && <span>Куратор: {item.curatorHint}</span>}
          {item.curatorHint && item.linkedContext && <span> • </span>}
          {item.linkedContext && <span>Контекст: {item.linkedContext}</span>}
        </div>
      )}

      <div className="mt-4 flex justify-end">
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
