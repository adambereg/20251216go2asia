import Image from 'next/image';
import Link from 'next/link';
import { Clock, Eye } from 'lucide-react';
import React from 'react';

function formatDateShort(dateString: string | null | undefined): string | null {
  if (!dateString) return null;
  const d = new Date(dateString);
  if (!Number.isFinite(d.getTime())) return null;
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}

function initials(name: string): string {
  const parts = name
    .split(/\s+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const a = parts[0]?.[0] ?? '';
  const b = parts[1]?.[0] ?? '';
  return `${a}${b}`.toUpperCase();
}

export type PostMetaProps = {
  author:
    | {
        slug: string;
        displayName: string;
        avatarUrl: string | null;
      }
    | null
    | undefined;
  publishedAt: string | null | undefined;
  readingTimeMinutes: number | null | undefined;
  views: number | null | undefined;
  size?: 'sm' | 'md';
  className?: string;
};

export function PostMeta({
  author,
  publishedAt,
  readingTimeMinutes,
  views,
  size = 'md',
  className,
}: PostMetaProps) {
  const isSm = size === 'sm';
  const avatarSize = isSm ? 24 : 28;
  const textSize = isSm ? 'text-[11px]' : 'text-sm';

  const name = author?.displayName ?? 'Go2Asia';
  const authorHref = author?.slug ? `/blog/author/${author.slug}` : null;
  const dateText = formatDateShort(publishedAt);
  const showReading = typeof readingTimeMinutes === 'number' && readingTimeMinutes > 0;
  const showViews = typeof views === 'number' && Number.isFinite(views) && views >= 0;

  const parts: Array<React.ReactNode> = [];

  parts.push(
    <div key="author" className="flex items-center gap-2 min-w-0">
      {authorHref ? (
        <Link href={authorHref} className="flex items-center gap-2 min-w-0 hover:text-sky-700">
          <div
            className="relative shrink-0 rounded-full overflow-hidden bg-slate-200 ring-1 ring-slate-200"
            style={{ width: avatarSize, height: avatarSize }}
          >
            {author?.avatarUrl ? (
              <Image src={author.avatarUrl} alt={name} fill className="object-cover" sizes={`${avatarSize}px`} unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] font-semibold text-slate-600">
                {initials(name)}
              </div>
            )}
          </div>
          <span className="font-medium text-slate-900 truncate">{name}</span>
        </Link>
      ) : (
        <>
          <div
            className="relative shrink-0 rounded-full overflow-hidden bg-slate-200 ring-1 ring-slate-200"
            style={{ width: avatarSize, height: avatarSize }}
          >
            <div className="w-full h-full flex items-center justify-center text-[10px] font-semibold text-slate-600">
              {initials(name)}
            </div>
          </div>
          <span className="font-medium text-slate-900 truncate">{name}</span>
        </>
      )}
    </div>
  );

  if (dateText) parts.push(<span key="date" className="text-slate-600">{dateText}</span>);
  if (showReading) {
    parts.push(
      <span key="rt" className="inline-flex items-center gap-1">
        <Clock size={isSm ? 12 : 14} />
        <span>{readingTimeMinutes} мин</span>
      </span>
    );
  }
  if (showViews) {
    parts.push(
      <span key="views" className="inline-flex items-center gap-1">
        <Eye size={isSm ? 12 : 14} />
        <span>{views}</span>
      </span>
    );
  }

  return (
    <div className={['flex flex-wrap items-center gap-x-2.5 gap-y-2 text-slate-500', textSize, className ?? ''].join(' ')}>
      {parts.map((node, idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <span key={idx} className="inline-flex items-center gap-2">
          {idx > 0 ? <span className="text-slate-300">•</span> : null}
          {node}
        </span>
      ))}
    </div>
  );
}

