'use client';

import { generated } from '@go2asia/sdk';
import { getBlogPostBySlug } from '@go2asia/sdk/blog';
import { getEventById, getPlaceByIdOrSlug } from '@go2asia/sdk/content';
import { resolveMediaUrl } from '@go2asia/sdk/media';

function truncate(value: string | null | undefined, maxLength = 180): string | null {
  const normalized = value?.replace(/\s+/g, ' ').trim();
  if (!normalized) return null;
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength).trimEnd()}...` : normalized;
}

function blogSlugFromTargetId(targetId: string): string {
  return targetId.replace(/^blog_/, '');
}

export function getRepostCtaLabel(targetType: generated.SpaceRepostTargetType): string {
  if (targetType === 'place') return 'Открыть место';
  if (targetType === 'event') return 'Открыть событие';
  if (targetType === 'blog_post') return 'Открыть статью';
  if (targetType === 'listing') return 'Открыть объявление';
  if (targetType === 'quest') return 'Открыть квест';
  if (targetType === 'partner') return 'Открыть партнёра';
  return 'Открыть материал';
}

export function isPilotRepostTargetType(targetType: generated.SpaceRepostTargetType): boolean {
  return targetType === 'place' || targetType === 'event' || targetType === 'blog_post';
}

export async function hydratePilotRepostPreview(
  repost: generated.SpacePostRepostRef
): Promise<generated.SpaceResolvedRepostPreview | null> {
  if (repost.resolvedPreview?.title) {
    return repost.resolvedPreview;
  }

  try {
    if (repost.targetType === 'place') {
      const place = await getPlaceByIdOrSlug(repost.targetId);
      return {
        title: place.name ?? repost.targetId,
        subtitle: truncate(place.description) ?? truncate([place.city, place.country].filter(Boolean).join(', ')),
        imageUrl: place.heroImage ?? place.photos?.[0] ?? null,
        href: `/atlas/places/${encodeURIComponent(place.slug ?? repost.targetId)}`,
      };
    }

    if (repost.targetType === 'event') {
      const event = await getEventById(repost.targetId);
      return {
        title: event.title ?? repost.targetId,
        subtitle: truncate(event.shortDescription) ?? truncate(event.location) ?? null,
        imageUrl: resolveMediaUrl(event.heroMediaKey),
        href: `/pulse/events/${encodeURIComponent(event.slug ?? repost.targetId)}`,
      };
    }

    if (repost.targetType === 'blog_post') {
      const slug = blogSlugFromTargetId(repost.targetId);
      const post = await getBlogPostBySlug(slug);
      return {
        title: post.title ?? repost.targetId,
        subtitle: truncate(post.excerpt ?? post.subtitle),
        imageUrl: post.heroUrl ?? null,
        href: `/blog/${encodeURIComponent(post.slug ?? slug)}`,
      };
    }
  } catch {
    return null;
  }

  return repost.resolvedPreview ?? null;
}
