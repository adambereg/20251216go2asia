'use client';

import Link from 'next/link';
import { generated } from '@go2asia/sdk';
import {
  formatDate,
  formatFeedReason,
  formatRepostTargetLabel,
  getGroupHref,
  getProfileHref,
  resolveReferenceHref,
} from './utils';

type SpaceFeedCardProps = {
  item: generated.SpaceFeedItem;
  showReason?: boolean;
  showGroupSignal?: boolean;
};

export function SpaceFeedCard({
  item,
  showReason = true,
  showGroupSignal = true,
}: SpaceFeedCardProps) {
  const reference = item.post.repost
    ? resolveReferenceHref(item.post.repost.targetType, item.post.repost.targetId)
    : null;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <Link
          href={getProfileHref(item.post.author.userId)}
          className="font-medium text-slate-700 hover:text-sky-700"
        >
          {item.post.author.displayName}
        </Link>
        {item.post.author.roleLabel && (
          <>
            <span>•</span>
            <span>{item.post.author.roleLabel}</span>
          </>
        )}
        {showReason && (
          <>
            <span>•</span>
            <span>{formatFeedReason(item.reason)}</span>
          </>
        )}
        <span>•</span>
        <span>{formatDate(item.createdAt)}</span>
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

      {item.post.repost && reference && (
        <div className="mb-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
          <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
            Репост · {formatRepostTargetLabel(item.post.repost.targetType)}
          </div>
          {item.post.repost.resolvedPreview?.title ? (
            <div className="mt-2 rounded-md border border-slate-200 bg-white p-3">
              <div className="font-medium text-slate-800">{item.post.repost.resolvedPreview.title}</div>
              {item.post.repost.resolvedPreview.subtitle && (
                <div className="mt-1 text-slate-600">{item.post.repost.resolvedPreview.subtitle}</div>
              )}
            </div>
          ) : (
            <div className="mt-2 text-slate-600">Материал открыт в ленте как репост.</div>
          )}
          <div className="mt-3">
            {reference.href ? (
              <Link
                href={reference.href}
                className="inline-flex items-center rounded-md border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-800 hover:bg-sky-100"
              >
                Открыть материал
              </Link>
            ) : null}
          </div>
        </div>
      )}
    </article>
  );
}
