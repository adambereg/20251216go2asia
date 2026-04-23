'use client';

import Link from 'next/link';
import { generated } from '@go2asia/sdk';
import {
  formatRepostTargetLabel,
  formatVisibilityLabel,
  getGroupHref,
  getProfileHref,
  resolveReferenceHref,
} from './utils';

type SpacePublicationCardProps = {
  item: generated.SpaceFeedItem;
  isOwnerView: boolean;
};

function formatRelativeTime(value: string): string {
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

function formatExactTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('ru-RU');
}

function truncate(value: string, limit: number): string {
  const normalized = value.trim();
  if (normalized.length <= limit) return normalized;
  return `${normalized.slice(0, limit).trimEnd()}...`;
}

function formatPublicationKind(postType: string): string {
  switch (postType) {
    case 'post':
      return 'Пост';
    case 'repost':
      return 'Репост';
    case 'system':
      return 'Объявление';
    default:
      return 'Публикация';
  }
}

function getPublicationTitle(item: generated.SpaceFeedItem): string {
  if (item.post.repost?.resolvedPreview?.title) {
    return item.post.repost.resolvedPreview.title;
  }

  if (item.post.postType === 'repost' && item.post.repost) {
    return `Репост: ${formatRepostTargetLabel(item.post.repost.targetType)}`;
  }

  if (item.post.postType === 'system') {
    return 'Обновление в Space Asia';
  }

  if (item.post.text) {
    const firstLine = item.post.text.split(/\r?\n/, 1)[0] ?? item.post.text;
    return truncate(firstLine, 72);
  }

  if (item.post.media.length > 0) {
    return 'Публикация с вложением';
  }

  return 'Публикация без текста';
}

function getPublicationExcerpt(item: generated.SpaceFeedItem, title: string): string | null {
  if (!item.post.text) {
    return item.post.repost
      ? 'Материал опубликован как репост и доступен по исходному маршруту.'
      : item.post.media.length > 0
        ? 'Материал опубликован с вложением.'
        : null;
  }

  const text = item.post.text.trim();
  if (text === title) return null;
  return truncate(text, 220);
}

export function SpacePublicationCard({ item, isOwnerView }: SpacePublicationCardProps) {
  const title = getPublicationTitle(item);
  const excerpt = getPublicationExcerpt(item, title);
  const reference = item.post.repost
    ? resolveReferenceHref(item.post.repost.targetType, item.post.repost.targetId)
    : null;

  const actions: Array<{ href: string; label: string }> = [];
  if (reference?.href) {
    actions.push({ href: reference.href, label: 'Открыть материал' });
  }
  if (item.post.groupId) {
    actions.push({ href: getGroupHref(item.post.groupId), label: 'Открыть группу' });
  }
  if (actions.length === 0) {
    actions.push({
      href: getProfileHref(item.post.author.userId),
      label: isOwnerView ? 'Открыть профиль' : 'Открыть автора',
    });
  }

  const visibilityLabel = formatVisibilityLabel(item.post.visibility);
  const relativeTime = formatRelativeTime(item.createdAt);
  const exactTime = formatExactTime(item.createdAt);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-slate-300">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap gap-2 text-[11px] font-medium">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700">
              {formatPublicationKind(item.post.postType)}
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-600">
              {visibilityLabel}
            </span>
            {item.post.groupId && (
              <span className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-sky-800">
                В группе
              </span>
            )}
            {item.post.repost && (
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-800">
                {formatRepostTargetLabel(item.post.repost.targetType)}
              </span>
            )}
            {item.post.media.length > 0 && (
              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-600">
                {item.post.media.length} {item.post.media.length === 1 ? 'вложение' : 'вложений'}
              </span>
            )}
          </div>

          <h2 className="text-base font-semibold text-slate-900">{title}</h2>

          {excerpt && <p className="mt-2 text-sm leading-6 text-slate-600">{excerpt}</p>}

          {item.post.repost && !reference?.href && (
            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
              Репост сохранён в авторской подборке и остаётся частью вашей публикационной истории.
            </div>
          )}
        </div>

        <div className="shrink-0 text-right text-xs text-slate-500">
          <div title={exactTime}>Опубликовано {relativeTime}</div>
          <div className="mt-1">{item.post.author.displayName}</div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        {item.post.groupId && <span>Групповая публикация</span>}
        {item.post.repost && <span>Связана с объектом экосистемы</span>}
        {!item.post.groupId && !item.post.repost && <span>Видна в авторской подборке</span>}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {actions.map((action) => (
          <Link
            key={`${item.id}:${action.href}:${action.label}`}
            href={action.href}
            className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            {action.label}
          </Link>
        ))}
      </div>
    </article>
  );
}
