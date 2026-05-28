import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@go2asia/ui';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, listBlogPosts } from '@go2asia/sdk/blog';
import { ContentActionRow } from '@/components/interaction/ContentActionRow';
import { ArticleMarkdown } from '@/components/blog/ArticleMarkdown';
import { ArticleHeroBlock } from '@/components/blog/ArticleHeroBlock';
import { PostCard } from '@/components/blog/PostCard';
import { PostMeta } from '@/components/blog/PostMeta';

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getBlogPostBySlug(slug);
    return {
      title: `${post?.title || 'Статья'} - Blog Asia | Go2Asia`,
      description: post?.excerpt || 'Статья из Blog Asia',
    };
  } catch {
    return {
      title: 'Blog Asia | Go2Asia',
    };
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug).catch(() => null);
  if (!post) notFound();

  const primaryTag = (post.tags ?? [])[0] ?? null;
  const related =
    primaryTag
      ? await listBlogPosts({ sort: 'newest', limit: 6, tag: primaryTag, excludeSlug: slug }).catch(() => null)
      : null;

  const moreByAuthor =
    post.author?.slug
      ? await listBlogPosts({ sort: 'newest', limit: 6, author: post.author.slug, excludeSlug: slug }).catch(() => null)
      : null;

  const moreByCountry =
    post.countrySlug
      ? await listBlogPosts({ sort: 'newest', limit: 6, country: post.countrySlug, excludeSlug: slug }).catch(() => null)
      : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="pt-8">
        <div className="max-w-[760px] mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-sm text-slate-600 mb-6">
            <Link href="/blog" className="hover:text-sky-700">
              Blog Asia
            </Link>
            <span>/</span>
            <span className="text-slate-900 line-clamp-1">{post.title}</span>
          </nav>

          <ArticleHeroBlock
            title={post.title}
            heroUrl={post.heroUrl}
            postType={post.postType}
            isEditorPick={post.isEditorPick}
          />

          <h1 className="text-[28px] sm:text-[32px] font-bold text-slate-900 tracking-tight leading-tight">{post.title}</h1>
          {post.subtitle ? <p className="mt-3 text-[18px] text-slate-600 leading-7">{post.subtitle}</p> : null}
          {post.excerpt ? <p className="mt-4 text-[15px] text-slate-700 leading-7">{post.excerpt}</p> : null}

          <div className="mt-5">
            <PostMeta
              author={post.author}
              publishedAt={post.publishedAt}
              readingTimeMinutes={post.readingTimeMinutes}
              views={null}
            />
          </div>

          {(post.tags?.length ?? 0) > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {(post.tags ?? []).slice(0, 12).map((t) => (
                <Badge key={t} variant="info" className="text-[11px]">
                  #{t}
                </Badge>
              ))}
            </div>
          ) : null}

          <ContentActionRow
            className="mt-6"
            targetType="blog_post"
            targetId={post.id}
            title={post.title}
          />
        </div>
      </section>

      <main className="max-w-[760px] mx-auto px-4 sm:px-6 py-10">
        <article>
          <ArticleMarkdown markdown={post.contentMarkdown} />
        </article>

        {(related?.items?.length ?? 0) > 0 ? (
          <section className="mt-12">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Похожие материалы</h2>
            <div className="flex gap-4 overflow-x-auto pb-1 snap-x snap-mandatory">
              {(related?.items ?? []).slice(0, 6).map((p) => (
                <PostCard
                  key={p.id}
                  variant="mini"
                  className="min-w-[320px] snap-start"
                  post={{
                    id: p.id,
                    slug: p.slug,
                    title: p.title,
                    excerpt: p.excerpt,
                    heroUrl: p.heroUrl,
                    postType: p.postType,
                    publishedAt: p.publishedAt,
                    readingTimeMinutes: p.readingTimeMinutes,
                    author: p.author,
                    isEditorPick: p.isEditorPick,
                  }}
                />
              ))}
            </div>
          </section>
        ) : null}

        {(moreByCountry?.items?.length ?? 0) > 0 ? (
          <section className="mt-12">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Ещё по стране</h2>
            <div className="flex gap-4 overflow-x-auto pb-1 snap-x snap-mandatory">
              {(moreByCountry?.items ?? []).slice(0, 6).map((p) => (
                <PostCard
                  key={p.id}
                  variant="mini"
                  className="min-w-[320px] snap-start"
                  post={{
                    id: p.id,
                    slug: p.slug,
                    title: p.title,
                    excerpt: p.excerpt,
                    heroUrl: p.heroUrl,
                    postType: p.postType,
                    publishedAt: p.publishedAt,
                    readingTimeMinutes: p.readingTimeMinutes,
                    author: p.author,
                    isEditorPick: p.isEditorPick,
                  }}
                />
              ))}
            </div>
          </section>
        ) : null}

        {(moreByAuthor?.items?.length ?? 0) > 0 ? (
          <section className="mt-12">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Публикации автора</h2>
            <div className="flex gap-4 overflow-x-auto pb-1 snap-x snap-mandatory">
              {(moreByAuthor?.items ?? []).slice(0, 6).map((p) => (
                <PostCard
                  key={p.id}
                  variant="mini"
                  className="min-w-[320px] snap-start"
                  post={{
                    id: p.id,
                    slug: p.slug,
                    title: p.title,
                    excerpt: p.excerpt,
                    heroUrl: p.heroUrl,
                    postType: p.postType,
                    publishedAt: p.publishedAt,
                    readingTimeMinutes: p.readingTimeMinutes,
                    author: p.author,
                    isEditorPick: p.isEditorPick,
                  }}
                />
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
