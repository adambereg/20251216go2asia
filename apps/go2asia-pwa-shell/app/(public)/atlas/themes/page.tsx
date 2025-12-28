import type { Metadata } from 'next';
import { ModuleHero } from '@/components/modules';
import { Globe } from 'lucide-react';
import { AtlasMainNav } from '@/modules/atlas';
import { AtlasSearchBar } from '@/modules/atlas';
import { Card, CardContent } from '@go2asia/ui';
import Link from 'next/link';
import { getDataSource } from '@/mocks/dto';
import { mockRepo } from '@/mocks/repo';
import { EmptyStateAtlas } from '@/modules/atlas';

export const metadata: Metadata = {
  title: 'Темы Atlas Asia',
  description:
    'Тематические хабы Atlas Asia: визы, налоги, образование, медицина, связь и другие ключевые вопросы жизни в ЮВА.',
  openGraph: {
    title: 'Темы Atlas Asia',
    description: 'Тематические хабы Atlas Asia: визы, налоги, образование, медицина, связь и другие ключевые вопросы жизни в ЮВА.',
    type: 'website',
  },
};

export default function ThemesIndexPage() {
  const dataSource = getDataSource();
  const themes =
    dataSource === 'mock'
      ? mockRepo.atlas.listThemes().map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          heroImage: t.heroImage,
          tags: t.tags ?? [],
        }))
      : [];
  return (
    <div className="min-h-screen bg-slate-50">
      <ModuleHero
        icon={Globe}
        title="Atlas Asia"
        description="«Живой» вики-справочник по странам Юго-Восточной Азии с UGC и редакционной поддержкой"
        gradientFrom="from-sky-500"
        gradientTo="to-sky-600"
        badgeText={dataSource === 'mock' ? 'MOCK DATA' : undefined}
      />

      {/* Top controls: internal nav + search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <AtlasMainNav />
        <AtlasSearchBar />
      </section>

      {/* Themes Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h2 className="text-h2 md:text-3xl font-bold text-slate-900 mb-6">
          Темы
        </h2>
        {dataSource === 'mock' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {themes.map((theme) => (
              <Link key={theme.id} href={`/atlas/themes/${theme.id}`}>
                <Card hover className="h-full overflow-hidden p-0 !border-0">
                  {theme.heroImage && (
                    <div className="relative w-full h-48 overflow-hidden">
                      <img
                        src={theme.heroImage}
                        alt={theme.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-h3 md:text-xl font-bold text-slate-900 mb-2">
                      {theme.title}
                    </h3>
                    <p className="text-small text-slate-600">{theme.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyStateAtlas
            title="Темы в разработке"
            description="В production темы будут доступны после появления реального API/контента. Сейчас mock отключён."
          />
        )}
      </section>
    </div>
  );
}


