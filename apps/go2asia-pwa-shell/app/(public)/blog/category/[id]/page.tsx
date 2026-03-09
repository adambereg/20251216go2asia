import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookOpen } from 'lucide-react';
import { listBlogPosts } from '@go2asia/sdk/blog';
import { PostCard } from '@/components/blog/PostCard';
import { getCategoryBySlug, slugifyCategory } from '../../categoryConfig';

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

  const data = await listBlogPosts({ sort: 'newest', limit: 200 }).catch(() => null);
  const items = (data?.items ?? []).filter((post) => (post.category ?? '').trim() === category);

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

      <section className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6 gap-4">
          <div>
            <nav className="text-sm text-slate-500 mb-2">
              <Link href="/blog" className="hover:text-sky-700">
                Blog Asia
              </Link>{' '}
              / <span className="text-slate-900">{category}</span>
            </nav>
            <h1 className="text-2xl font-bold text-slate-900">{category}</h1>
          </div>
          <div className="text-sm text-slate-500 whitespace-nowrap">{items.length} материалов</div>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {items.map((post) => (
              <PostCard
                key={post.id}
                post={{
                  id: post.id,
                  slug: post.slug,
                  title: post.title,
                  excerpt: post.excerpt,
                  heroUrl: post.heroUrl,
                  postType: post.postType,
                  countrySlug: post.countrySlug,
                  publishedAt: post.publishedAt,
                  readingTimeMinutes: post.readingTimeMinutes,
                  author: post.author,
                  isEditorPick: post.isEditorPick,
                  isFeatured: post.isFeatured,
                  isPromoted: post.isPromoted,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-500 py-8">
            В рубрике пока нет публикаций.
          </div>
        )}

        <div className="mt-8">
          <Link href="/blog" className="text-sm font-medium text-sky-700 hover:text-sky-800">
            ← Вернуться ко всем рубрикам
          </Link>
        </div>
      </section>
    </div>
  );
}

