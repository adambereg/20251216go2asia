'use client';

import { useParams } from 'next/navigation';
import { useGetArticleBySlug } from '@go2asia/sdk/blog';
import { Chip, Skeleton } from '@go2asia/ui';
import { getDataSource } from '@/mocks/dto';
import { mockRepo } from '@/mocks/repo';

export default function GuideOverviewPage() {
  const params = useParams();
  const guideId = params?.id as string;

  const { 
    data: articleData, 
    isLoading 
  } = getDataSource() === 'api'
    ? useGetArticleBySlug(guideId || '')
    : ({ data: null, isLoading: false } as any);

  const dataSource = getDataSource();
  const mockGuide = dataSource === 'mock' ? mockRepo.atlas.getGuideByIdOrSlug(guideId || '') : null;
  const resolved: any = dataSource === 'mock' ? mockGuide : articleData;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!resolved) {
    return (
      <div className="text-center py-12 text-slate-600">
        Данные о гайде не найдены.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Обзор</h2>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Описание */}
        <div className="px-4 py-4 text-sm text-slate-700 space-y-2">
          <p>
            {resolved.excerpt || resolved.contentMarkdown || resolved.content || 'Нет описания.'}
          </p>
        </div>

        {/* Категория */}
        {resolved.category && (
          <div className="border-t border-slate-100 px-4 py-4">
            <h3 className="font-semibold text-slate-900 mb-3">Категория</h3>
            <div className="flex flex-wrap gap-2">
              <Chip>{resolved.category}</Chip>
            </div>
          </div>
        )}

        {/* Теги */}
        {resolved.tags && resolved.tags.length > 0 && (
          <div className="border-t border-slate-100 px-4 py-4">
            <h3 className="font-semibold text-slate-900 mb-3">Теги</h3>
            <div className="flex flex-wrap gap-2">
              {resolved.tags.map((tag: string) => (
                <Chip key={tag}>{tag}</Chip>
              ))}
            </div>
          </div>
        )}

        {/* Метаданные */}
        <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
          Опубликовано:{' '}
          {resolved.publishedAt ? new Date(resolved.publishedAt).toLocaleDateString('ru-RU') : 'Неизвестно'}
          {resolved.updatedAt && resolved.updatedAt !== resolved.publishedAt && (
            <> • Обновлено: {new Date(resolved.updatedAt).toLocaleDateString('ru-RU')}</>
          )}
        </div>
      </section>
    </div>
  );
}

