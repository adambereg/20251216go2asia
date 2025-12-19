import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge, Card, CardContent } from '@go2asia/ui';
import { Clock, User, Heart, Bookmark, Share2, MapPin, Calendar, Globe2 } from 'lucide-react';
import { getDataSource } from '@/mocks/dto';
import { mockRepo } from '@/mocks/repo';

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function mdToHtml(markdown: string): string {
  // Упрощённый рендер для UI-проверки (без markdown parser)
  return markdown.replace(/\n/g, '<br />');
}

function getMockArticleBySlug(slug: string) {
  const post = mockRepo.blog.getPostBySlug(slug);
  if (!post) return null;

  return {
    title: post.title,
    lead: post.excerpt || '',
    author: {
      name: post.author?.name ?? 'Автор',
      avatar: null,
      role: post.author?.role ?? '',
      city: post.author?.city ?? '',
      profileUrl: '/space',
    },
    publishedAt: post.publishedAt || new Date().toISOString(),
    updatedAt: post.publishedAt || undefined,
    readingTime: post.readingTimeMin ?? 6,
    type: post.category || 'Статья',
    badges: post.badges ?? [],
    cover: post.coverImage || null,
    contentHtml: mdToHtml(post.contentMarkdown),
    context: {
      country: 'Таиланд',
      city: post.author?.city ?? '',
      seasonality: 'Круглый год',
      budget: '$$',
    },
    relatedPlaces: mockRepo.atlas.listPlaces().slice(0, 2).map((p) => ({ id: p.id, title: p.name, type: p.type })),
    relatedEvents: mockRepo.pulse.listEvents().slice(0, 2).map((e) => ({ id: e.id, title: e.title, date: 'Скоро' })),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dataSource = getDataSource();

  if (dataSource === 'mock') {
    const article = getMockArticleBySlug(slug);
    return {
      title: `${article?.title || 'Статья'} - Blog Asia | Go2Asia`,
      description: article?.lead || 'Статья из Blog Asia',
    };
  }

  return {
    title: 'Blog Asia | Go2Asia',
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dataSource = getDataSource();

  const article = dataSource === 'mock' ? getMockArticleBySlug(slug) : null;

  const resolved =
    article ||
    ({
      title: 'Статья не найдена',
      lead: '',
      author: { name: 'Автор', role: '', city: '', profileUrl: '' },
      publishedAt: new Date().toISOString(),
      updatedAt: undefined,
      readingTime: 0,
      type: 'Статья',
      badges: dataSource === 'mock' ? ['MOCK DATA'] : ['API'],
      cover: null,
      contentHtml:
        dataSource === 'api'
          ? 'API режим: получение статьи через SDK пока не реализовано.'
          : 'Статья не найдена',
      context: {},
      relatedPlaces: [],
      relatedEvents: [],
    } as any);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-slate-600 mb-4">
            <Link href="/blog" className="hover:text-sky-600">
              Blog
            </Link>
            <span>/</span>
            <span className="text-slate-900 line-clamp-1">{resolved.title}</span>
          </nav>

          {/* Cover Image */}
          {resolved.cover && (
            <div className="relative w-full h-96 rounded-2xl overflow-hidden mb-6">
              <img src={resolved.cover} alt={resolved.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {dataSource === 'mock' && (
                  <Badge variant="info" className="text-xs">
                    MOCK DATA
                  </Badge>
                )}
                {(resolved.badges ?? []).map((badge: string, index: number) => (
                  <Badge
                    key={index}
                    variant={
                      badge === 'EDITORIAL'
                        ? 'editor'
                        : badge === 'UGC'
                        ? 'ugc'
                        : badge === 'Выбор редакции'
                        ? 'popular'
                        : 'info'
                    }
                    className="text-xs"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {!resolved.cover && dataSource === 'mock' && (
            <div className="mb-4">
              <Badge variant="info">MOCK DATA</Badge>
            </div>
          )}

          {/* Title & Lead */}
          <h1 className="text-h1 md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">{resolved.title}</h1>
          {resolved.lead && <p className="text-xl text-slate-600 mb-6">{resolved.lead}</p>}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-6">
            <Link href={resolved.author.profileUrl || '#'} className="flex items-center gap-2 hover:text-sky-600">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                <User size={16} className="text-slate-600" />
              </div>
              <div>
                <div className="font-medium text-slate-900">{resolved.author.name}</div>
                {resolved.author.role && <div className="text-xs text-slate-500">{resolved.author.role}</div>}
              </div>
            </Link>
            <span>•</span>
            <span>{formatDate(resolved.publishedAt)}</span>
            {resolved.updatedAt && resolved.updatedAt !== resolved.publishedAt && (
              <>
                <span>•</span>
                <span>Обновлено: {formatDate(resolved.updatedAt)}</span>
              </>
            )}
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {resolved.readingTime} мин чтения
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <Heart size={20} />
              <span>24</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors">
              <Bookmark size={20} />
              <span>Сохранить</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors">
              <Share2 size={20} />
              <span>Поделиться</span>
            </button>
          </div>
        </div>
      </section>

      {/* Article Content with Sidebar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_240px] gap-6">
          {/* Left Sidebar - Context Widgets */}
          <aside className="hidden lg:block space-y-4">
            {resolved.context && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-slate-900 mb-3 text-sm">Контекст</h3>
                  <div className="space-y-2 text-sm">
                    {resolved.context.country && (
                      <Link
                        href={`/atlas/countries/${String(resolved.context.country).toLowerCase()}`}
                        className="flex items-center gap-2 text-slate-600 hover:text-sky-600"
                      >
                        <Globe2 size={14} />
                        <span>{resolved.context.country}</span>
                      </Link>
                    )}
                    {resolved.context.city && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin size={14} />
                        <span>{resolved.context.city}</span>
                      </div>
                    )}
                    {resolved.context.seasonality && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar size={14} />
                        <span>{resolved.context.seasonality}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {resolved.relatedPlaces && resolved.relatedPlaces.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-slate-900 mb-3 text-sm">Места из статьи</h3>
                  <div className="space-y-2">
                    {resolved.relatedPlaces.map((place: any) => (
                      <Link
                        key={place.id}
                        href={`/atlas/places/${place.id}`}
                        className="block text-sm text-slate-600 hover:text-sky-600"
                      >
                        {place.title}
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </aside>

          {/* Main Content */}
          <article className="bg-white rounded-xl border border-slate-200 p-6 lg:p-8">
            <div
              className="prose prose-slate max-w-none
                prose-headings:font-bold prose-headings:text-slate-900
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-slate-700 prose-p:leading-relaxed
                prose-a:text-sky-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-slate-900 prose-strong:font-semibold
                prose-ul:text-slate-700 prose-ol:text-slate-700"
              dangerouslySetInnerHTML={{ __html: resolved.contentHtml }}
            />

            <div className="mt-12 pt-8 border-t border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Обсуждение и дополнения</h3>
              <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600">
                Интеграция со Space Asia: комментарии/исправления/советы (UI заглушка).
              </div>
            </div>
          </article>

          {/* Right Sidebar */}
          <aside className="hidden lg:block space-y-4">
            {resolved.relatedEvents && resolved.relatedEvents.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-slate-900 mb-3 text-sm">События по теме</h3>
                  <div className="space-y-2">
                    {resolved.relatedEvents.map((event: any) => (
                      <Link
                        key={event.id}
                        href={`/pulse/${event.id}`}
                        className="block text-sm text-slate-600 hover:text-sky-600"
                      >
                        <div>{event.title}</div>
                        <div className="text-xs text-slate-500">{event.date}</div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}
