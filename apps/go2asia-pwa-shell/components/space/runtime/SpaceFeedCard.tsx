'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { generated } from '@go2asia/sdk';
import {
  formatFeedReason,
  formatRepostTargetLabel,
  getGroupHref,
  getProfileHref,
  resolveReferenceHref,
} from './utils';
import { getRepostCtaLabel, hydratePilotRepostPreview, isPilotRepostTargetType } from './repostPreview';

type SpaceFeedCardProps = {
  item: generated.SpaceFeedItem;
  showReason?: boolean;
  showGroupSignal?: boolean;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
  }
  return (parts[0] ?? 'SA').slice(0, 2).toUpperCase();
}

function formatFeedTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const diffMs = Date.now() - date.getTime();
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return 'только что';
  if (diffMs < hour) return `${Math.max(1, Math.floor(diffMs / minute))} мин назад`;
  if (diffMs < day) return `${Math.max(1, Math.floor(diffMs / hour))} ч назад`;
  if (diffMs < 2 * day) return 'вчера';

  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  });
}

export function SpaceFeedCard({
  item,
  showReason = true,
  showGroupSignal = true,
}: SpaceFeedCardProps) {
  const reference = item.post.repost
    ? resolveReferenceHref(item.post.repost.targetType, item.post.repost.targetId)
    : null;
  const parsedDate = new Date(item.createdAt);
  const exactDate = Number.isNaN(parsedDate.getTime()) ? item.createdAt : parsedDate.toLocaleString('ru-RU');
  const shouldShowReason = showReason && !(showGroupSignal && item.post.groupId && item.reason === 'group_post');
  const [hydratedPreview, setHydratedPreview] = useState<generated.SpaceResolvedRepostPreview | null>(
    item.post.repost?.resolvedPreview ?? null
  );

  useEffect(() => {
    let cancelled = false;
    const repost = item.post.repost;
    setHydratedPreview(repost?.resolvedPreview ?? null);

    if (!repost || repost.resolvedPreview?.title || !isPilotRepostTargetType(repost.targetType)) {
      return () => {
        cancelled = true;
      };
    }

    void hydratePilotRepostPreview(repost).then((preview) => {
      if (!cancelled && preview?.title) {
        setHydratedPreview(preview);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [item.post.repost]);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300">
      <div className="mb-3 flex items-start gap-3">
        {item.post.author.avatarUrl ? (
          <img
            src={item.post.author.avatarUrl}
            alt={item.post.author.displayName}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-800">
            {getInitials(item.post.author.displayName)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <Link
              href={getProfileHref(item.post.author.userId)}
              className="font-medium text-slate-700 hover:text-sky-700"
            >
              {item.post.author.displayName}
            </Link>
            {item.post.author.roleLabel && (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600">
                {item.post.author.roleLabel}
              </span>
            )}
            {shouldShowReason && (
              <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-500">
                {formatFeedReason(item.reason)}
              </span>
            )}
            <span title={exactDate}>{formatFeedTime(item.createdAt)}</span>
          </div>
        </div>
      </div>

      {showGroupSignal && item.post.groupId && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-800">
            В группе
          </span>
          <Link
            href={getGroupHref(item.post.groupId)}
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Перейти в группу
          </Link>
        </div>
      )}

      {item.post.text ? (
        <p className="mb-3 whitespace-pre-wrap text-sm text-slate-800">{item.post.text}</p>
      ) : (
        <p className="mb-3 text-sm text-slate-500">
          {item.post.media.length > 0 ? 'Публикация с фото или вложением.' : 'Публикация без текста.'}
        </p>
      )}

      {item.post.media.length > 0 && (
        <div className="mb-3">
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
            {item.post.media.length} {item.post.media.length === 1 ? 'вложение' : 'вложений'}
          </span>
        </div>
      )}

      {item.post.repost && reference && (
        <div className="mb-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
          <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
            Репост · {formatRepostTargetLabel(item.post.repost.targetType)}
          </div>
          {hydratedPreview?.title ? (
            <div className="mt-2 rounded-md border border-slate-200 bg-white p-3">
              <div className="flex gap-3">
                {hydratedPreview.imageUrl ? (
                  <div
                    className="h-14 w-20 flex-shrink-0 rounded-md bg-cover bg-center"
                    style={{ backgroundImage: `url(${hydratedPreview.imageUrl})` }}
                    aria-label={hydratedPreview.title}
                  />
                ) : null}
                <div className="min-w-0">
                  <div className="line-clamp-2 font-medium text-slate-800">{hydratedPreview.title}</div>
                  {hydratedPreview.subtitle ? (
                    <div className="mt-1 line-clamp-2 text-slate-600">{hydratedPreview.subtitle}</div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : isPilotRepostTargetType(item.post.repost.targetType) ? (
            <div className="mt-2 text-slate-600">
              Репост связан с исходным материалом, но preview сейчас недоступен.
            </div>
          ) : (
            <div className="mt-2 text-slate-600">
              Репост связан с объектом типа «{formatRepostTargetLabel(item.post.repost.targetType)}».
            </div>
          )}
          <div className="mt-3">
            {reference.href ? (
              <Link
                href={reference.href}
                className="inline-flex items-center rounded-md border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-800 hover:bg-sky-100"
              >
                {getRepostCtaLabel(item.post.repost.targetType)}
              </Link>
            ) : null}
          </div>
        </div>
      )}
    </article>
  );
}
