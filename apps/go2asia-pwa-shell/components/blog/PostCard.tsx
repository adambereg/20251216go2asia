import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@go2asia/ui';
import { PostMeta } from './PostMeta';

export type BlogPostCardModel = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  excerpt?: string | null;
  heroUrl?: string | null;
  postType?: string | null;
  countrySlug?: string | null;
  publishedAt?: string | null;
  readingTimeMinutes?: number | null;
  // API не отдаёт views — оставляем null, но UI держим под референс.
  views?: number | null;
  isEditorPick?: boolean;
  isFeatured?: boolean;
  isPromoted?: boolean;
  author?: { slug: string; displayName: string; avatarUrl: string | null } | null;
};

export type PostCardVariant = 'grid' | 'small' | 'horizontal' | 'mini';

export function PostCard({
  post,
  variant = 'grid',
  className,
  hideMeta,
}: {
  post: BlogPostCardModel;
  variant?: PostCardVariant;
  className?: string;
  hideMeta?: boolean;
}) {
  const href = `/blog/${post.slug}`;

  const badges = [
    post.postType ? { label: post.postType, tone: 'info' as const } : null,
    post.isEditorPick ? { label: 'Выбор редакции', tone: 'popular' as const } : null,
  ].filter(Boolean) as Array<{ label: string; tone: 'info' | 'popular' }>;

  if (variant === 'horizontal') {
    return (
      <Link
        href={href}
        className={[
          'group block rounded-2xl overflow-hidden bg-white ring-1 ring-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.06)] hover:shadow-[0_10px_30px_rgba(15,23,42,0.10)] transition-shadow',
          className ?? '',
        ].join(' ')}
      >
        <div className="flex">
          <div className="relative aspect-video w-[160px] sm:w-[180px] shrink-0 bg-slate-100">
            {post.heroUrl ? (
              <Image
                src={post.heroUrl}
                alt={post.title}
                fill
                className="object-cover"
                sizes="180px"
                unoptimized
              />
            ) : null}
          </div>
          <div className="p-3 flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-2">
              {badges.map((b) => (
                <Badge key={b.label} variant={b.tone} className="text-[11px]">
                  {b.label}
                </Badge>
              ))}
            </div>
            <div className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2 group-hover:text-sky-700">
              {post.title}
            </div>
            {post.excerpt ? (
              <div className="mt-2 text-xs text-slate-600 line-clamp-2 hidden sm:block">{post.excerpt}</div>
            ) : null}
            <div className="mt-3">
              <PostMeta
                size="sm"
                author={post.author}
                publishedAt={post.publishedAt}
                readingTimeMinutes={post.readingTimeMinutes}
                views={post.views ?? null}
              />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'mini') {
    return (
      <Link
        href={href}
        className={[
          'group block rounded-2xl overflow-hidden bg-white ring-1 ring-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.06)] hover:shadow-[0_10px_30px_rgba(15,23,42,0.10)] transition-shadow',
          className ?? '',
        ].join(' ')}
      >
        <div className="p-4 flex gap-4">
          <div className="relative w-[92px] shrink-0 aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 ring-1 ring-slate-200/60">
            {post.heroUrl ? (
              <Image src={post.heroUrl} alt={post.title} fill className="object-cover" sizes="92px" unoptimized />
            ) : null}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-2 mb-1.5">
              {badges.slice(0, 1).map((b) => (
                <Badge key={b.label} variant={b.tone} className="text-[10px]">
                  {b.label}
                </Badge>
              ))}
            </div>
            <div className="text-[13px] font-semibold text-slate-900 leading-5 line-clamp-2 group-hover:text-sky-700">
              {post.title}
            </div>
            <div className="mt-2">
              {!hideMeta ? (
                <PostMeta size="sm" author={post.author} publishedAt={post.publishedAt} readingTimeMinutes={null} views={null} />
              ) : null}
            </div>
            <div className="mt-2 text-xs text-sky-700 font-medium">
              Читать <span className="opacity-70">→</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'small') {
    return (
      <Link
        href={href}
        className={[
          'group block rounded-2xl overflow-hidden bg-white ring-1 ring-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.06)] hover:shadow-[0_10px_30px_rgba(15,23,42,0.10)] transition-shadow',
          className ?? '',
        ].join(' ')}
      >
        <div className="relative aspect-video w-full bg-slate-100">
          {post.heroUrl ? (
            <Image
              src={post.heroUrl}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 240px, 100vw"
              unoptimized
            />
          ) : null}
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {badges.slice(0, 1).map((b) => (
              <Badge key={b.label} variant={b.tone} className="text-[10px]">
                {b.label}
              </Badge>
            ))}
          </div>
          <div className="text-[13px] font-semibold text-slate-900 leading-5 line-clamp-2 group-hover:text-sky-700">
            {post.title}
          </div>
          {!hideMeta ? (
            <div className="mt-2">
              <PostMeta
                size="sm"
                author={post.author}
                publishedAt={post.publishedAt}
                readingTimeMinutes={post.readingTimeMinutes}
                views={post.views ?? null}
              />
            </div>
          ) : null}
        </div>
      </Link>
    );
  }

  // grid (default)
  return (
    <Link
      href={href}
      className={[
        'group block rounded-2xl overflow-hidden bg-white ring-1 ring-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.06)] hover:shadow-[0_10px_30px_rgba(15,23,42,0.10)] transition-shadow',
        className ?? '',
      ].join(' ')}
    >
      <div className="relative aspect-video w-full bg-slate-100">
        {post.heroUrl ? (
          <Image
            src={post.heroUrl}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 360px, (min-width: 768px) 50vw, 100vw"
            unoptimized
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent" />
        {badges.length > 0 ? (
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {badges.map((b) => (
              <Badge key={b.label} variant={b.tone} className="text-[11px] shadow-sm">
                {b.label}
              </Badge>
            ))}
          </div>
        ) : null}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="text-white text-[15px] font-semibold leading-snug line-clamp-2 drop-shadow-sm">
            {post.title}
          </div>
        </div>
      </div>

      <div className="p-4">
        {post.excerpt ? <div className="text-xs text-slate-600 leading-relaxed line-clamp-3">{post.excerpt}</div> : null}
        <div className="mt-3">
          <PostMeta
            size="md"
            author={post.author}
            publishedAt={post.publishedAt}
            readingTimeMinutes={post.readingTimeMinutes}
            views={post.views ?? null}
          />
        </div>
      </div>
    </Link>
  );
}

