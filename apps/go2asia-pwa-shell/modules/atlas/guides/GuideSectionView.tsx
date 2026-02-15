'use client';

import Link from 'next/link';
import { Card, CardContent } from '@go2asia/ui';
import type { GuideSection } from './types';
import { GuideBlockRenderer } from './blocks/GuideBlockRenderer';

export function GuideSectionView({
  section,
  showEmptyPlaceholder,
}: {
  section: GuideSection;
  showEmptyPlaceholder: boolean;
}) {
  const blocks = [...(section.blocks ?? [])].sort((a, b) => a.orderIndex - b.orderIndex);
  const hasBlocks = blocks.length > 0;
  const feedsResolved = [...(section.feedsResolved ?? [])];
  const hasFeedsResolved = feedsResolved.length > 0;

  return (
    <div className="space-y-4">
      {hasBlocks ? (
        blocks.map((b) => <GuideBlockRenderer key={b.id} block={b} />)
      ) : showEmptyPlaceholder ? (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          Эта вкладка пока пустая (admin view).
        </div>
      ) : null}

      {hasFeedsResolved ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {feedsResolved.map((it) => (
            <Link key={`${it.kind}:${it.id}`} href={it.href}>
              <Card hover className="h-full overflow-hidden p-0 !border-0">
                {it.imageUrl ? (
                  <div className="relative w-full h-40 overflow-hidden">
                    <img src={it.imageUrl} alt={it.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="text-white font-semibold line-clamp-2">{it.title}</div>
                    </div>
                  </div>
                ) : null}
                <CardContent className="p-4">
                  {!it.imageUrl ? <div className="font-semibold text-slate-900 line-clamp-2">{it.title}</div> : null}
                  {it.excerpt ? <div className="mt-2 text-sm text-slate-600 line-clamp-3">{it.excerpt}</div> : null}
                  {it.meta ? (
                    <div className="mt-3 text-xs text-slate-500">
                      {typeof (it.meta as any).location === 'string' ? (it.meta as any).location : null}
                      {typeof (it.meta as any).startDate === 'string'
                        ? ` • ${new Date((it.meta as any).startDate).toLocaleDateString('ru-RU')}`
                        : null}
                      {typeof (it.meta as any).publishedAt === 'string'
                        ? ` • ${new Date((it.meta as any).publishedAt).toLocaleDateString('ru-RU')}`
                        : null}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : section.feeds && section.feeds.length > 0 && hasBlocks ? (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
          Динамический контент временно недоступен или ещё не настроен.
        </div>
      ) : null}
    </div>
  );
}

