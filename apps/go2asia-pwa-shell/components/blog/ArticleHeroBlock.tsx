'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Badge } from '@go2asia/ui';

type Props = {
  title: string;
  heroUrl?: string | null;
  postType?: string | null;
  isEditorPick?: boolean;
};

export function ArticleHeroBlock({ title, heroUrl, postType, isEditorPick }: Props) {
  const [mediaFailed, setMediaFailed] = useState(false);
  const showMedia = Boolean(heroUrl) && !mediaFailed;

  const badges = useMemo(
    () =>
      [
        postType ? { label: postType, tone: 'info' as const } : null,
        isEditorPick ? { label: 'Выбор редакции', tone: 'popular' as const } : null,
      ].filter(Boolean) as Array<{ label: string; tone: 'info' | 'popular' }>,
    [isEditorPick, postType]
  );

  if (showMedia) {
    return (
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 mb-8 shadow-sm ring-1 ring-slate-200">
        <Image
          src={heroUrl!}
          alt={title}
          fill
          className="object-cover"
          sizes="760px"
          unoptimized
          onError={() => setMediaFailed(true)}
        />
        {badges.length > 0 ? (
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {badges.map((badge) => (
              <Badge key={badge.label} variant={badge.tone} className="text-[11px] shadow-sm">
                {badge.label}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  if (badges.length === 0) return null;

  return (
    <div className="mb-4 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm">
      <div className="flex flex-wrap gap-2">
        {badges.map((badge) => (
          <Badge key={badge.label} variant={badge.tone} className="text-[11px] shadow-sm">
            {badge.label}
          </Badge>
        ))}
      </div>
    </div>
  );
}
