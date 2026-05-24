'use client';

import Link from 'next/link';
import { generated } from '@go2asia/sdk';
import { resolveReferenceHref } from '@/components/space/runtime/utils';

type PostsPublicationCardProps = {
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

function truncate(value: string, maxLength: number): string {
  const text = value.trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
}

function formatPublicationType(postType: generated.SpacePostType): string {
  switch (postType) {
    case 'post':
      return 'Запись';
    case 'repost':
      return 'Репост';
    case 'system':
      return 'Объявление';
    default:
      return 'Публикация';
  }
}

function formatVisibility(visibility: generated.SpaceVisibility): string {
  switch (visibility) {
    case 'public':
      return 'Публично';
    case 'followers':
      return 'Для подписчиков';
    case 'group':
      return 'Только для группы';
    case 'private':
      return 'Личное';
    default:
      return 'Публикация';
  }
}

function formatRepostTarget(targetType: generated.SpaceRepostTargetType): string {
  switch (targetType) {
    case 'space_post':
      return 'записи в Space';
    case 'blog_post':
      return 'публикации блога';
    case 'place':
      return 'места';
    case 'event':
      return 'события';
    case 'partner':
      return 'партнёрского объекта';
    case 'listing':
      return 'объявления';
    case 'quest':
      return 'квеста';
    default:
      return 'материала';
  }
}

function getReferenceHref(
  repost: generated.SpacePostRepostRef | undefined
): { href: string | null; label: string | null } {
  if (!repost) return { href: null, label: null };
  const resolved = resolveReferenceHref(repost.targetType, repost.targetId);
  if (!resolved.href) return { href: null, label: null };
  if (repost.targetType === 'event') return { href: resolved.href, label: 'Открыть событие' };
  if (repost.targetType === 'place') return { href: resolved.href, label: 'Открыть место' };
  if (repost.targetType === 'listing') return { href: resolved.href, label: 'Открыть объявление' };
  if (repost.targetType === 'quest') return { href: resolved.href, label: 'Открыть квест' };
  if (repost.targetType === 'partner') return { href: resolved.href, label: 'Открыть партнёра' };
  if (repost.targetType === 'blog_post') return { href: resolved.href, label: 'Открыть блог' };
  return { href: resolved.href, label: 'Открыть источник' };
}

function getPublicationTitle(item: generated.SpaceFeedItem): string {
  const previewTitle = item.post.repost?.resolvedPreview?.title;
  if (previewTitle) return previewTitle;

  if (item.post.postType === 'repost' && item.post.repost) {
    return `Репост ${formatRepostTarget(item.post.repost.targetType)}`;
  }

  if (item.post.postType === 'system') {
    return 'Объявление';
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
  if (item.post.text) {
    const trimmed = item.post.text.trim();
    if (trimmed !== title) return truncate(trimmed, 220);
  }

  if (item.post.repost) {
    return 'Материал сохранён как репост и связан с исходной публикацией или объектом.';
  }

  if (item.post.media.length > 0) {
    return `Материал опубликован с вложением${item.post.media.length > 1 ? 'и серией файлов' : 'ем'}.`;
  }

  return null;
}

export function PostsPublicationCard({
  item,
  isOwnerView,
}: PostsPublicationCardProps) {
  const title = getPublicationTitle(item);
  const excerpt = getPublicationExcerpt(item, title);
  const exactTime = formatExactTime(item.createdAt);
  const relativeTime = formatRelativeTime(item.createdAt);
  const reference = getReferenceHref(item.post.repost);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-slate-300">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap gap-2 text-[11px] font-medium">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700">
              {formatPublicationType(item.post.postType)}
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-600">
              {formatVisibility(item.post.visibility)}
            </span>
            {item.post.groupId && (
              <span className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-sky-800">
                В группе
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

          <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
            <span title={exactTime}>Опубликовано {relativeTime}</span>
            {item.post.repost && <span>Есть связанный материал</span>}
            {!item.post.repost && item.post.groupId && <span>Опубликовано в группе</span>}
            {!item.post.repost && !item.post.groupId && (
              <span>{isOwnerView ? 'Ваша авторская публикация' : 'Авторская публикация'}</span>
            )}
          </div>
        </div>

        <div className="shrink-0 text-right text-xs text-slate-500">
          <div className="font-medium text-slate-700">{item.post.author.displayName}</div>
          {item.post.author.roleLabel && <div className="mt-1">{item.post.author.roleLabel}</div>}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {reference.href && reference.label ? (
          <Link
            href={reference.href}
            className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            {reference.label}
          </Link>
        ) : null}
        {item.post.groupId ? (
          <Link
            href={`/space/community/groups/${encodeURIComponent(item.post.groupId)}`}
            className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Открыть группу
          </Link>
        ) : null}
        {!reference.href && !item.post.groupId ? (
          <Link
            href={`/space/profiles/${encodeURIComponent(item.post.author.userId)}`}
            className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            {isOwnerView ? 'Мой профиль' : 'Страница автора'}
          </Link>
        ) : null}
      </div>
    </article>
  );
}
