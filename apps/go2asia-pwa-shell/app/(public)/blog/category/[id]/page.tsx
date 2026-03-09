import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BookOpen } from 'lucide-react';
import { listBlogPosts } from '@go2asia/sdk/blog';
import { getCategoryBySlug } from '../../categoryConfig';
import { CategoryFeedClient } from './CategoryFeedClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const categoryName = getCategoryBySlug(id);
  if (!categoryName) {
    return {
      title: 'Рубрика - Blog Asia | Go2Asia',
    };
  }
  return {
    title: `${categoryName} - Blog Asia | Go2Asia`,
    description: `Статьи рубрики ${categoryName} в Blog Asia`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = getCategoryBySlug(id);
  if (!category) notFound();

  const data = await listBlogPosts({ sort: 'newest', limit: 12, category }).catch(() => null);
  const items = data?.items ?? [];
  const nextCursor = data?.nextCursor ?? null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="pt-6 pb-4">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
          <div
            className="rounded-2xl overflow-hidden shadow-[0_14px_40px_rgba(15,23,42,0.14)] ring-1 ring-slate-900/10"
            style={{
              background:
                'radial-gradient(700px 220px at 70% 0%, rgba(56,189,248,0.18), transparent 60%), radial-gradient(500px 220px at 20% 20%, rgba(167,139,250,0.18), transparent 60%), #0b1220',
            }}
          >
            <div className="px-6 sm:px-8 py-7 sm:py-8 text-center">
              <div className="inline-flex items-center gap-2 text-white/95 font-semibold tracking-tight">
                <BookOpen size={18} />
                <span className="text-lg">Blog Asia</span>
              </div>
              <div className="mt-1 text-xs text-white/60">{category}</div>
            </div>
          </div>
        </div>
      </header>

      <CategoryFeedClient category={category} initialItems={items} initialCursor={nextCursor} />
    </div>
  );
}

