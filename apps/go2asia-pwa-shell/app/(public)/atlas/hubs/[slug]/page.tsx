import type { Metadata } from 'next';
import { TopicHubView } from '@/modules/atlas';
import { getDataSource } from '@/mocks/dto';
import { mockRepo } from '@/mocks/repo';

export const metadata: Metadata = {
  title: 'Тематический хаб Atlas Asia | Go2Asia',
  description:
    'Тематические хабы Atlas Asia: визы, налоги, образование, медицина и другие ключевые темы переезда.',
};

export default async function TopicHubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dataSource = getDataSource();

  const hub = dataSource === 'mock' ? mockRepo.atlas.getHubBySlug(slug) : null;
  const title = hub?.title || 'Тематический хаб в разработке';

  return (
    <TopicHubView
      title={title}
      description={hub?.description || "Здесь будут собраны статьи, гайды, подборки и практикумы по выбранной теме."}
      sections={[
        {
          id: 'editorial',
          title: 'Редакционные материалы',
          description:
            'Краткие и актуальные обзоры от редакции и PRO-спейсеров.',
        },
        {
          id: 'guides',
          title: 'Гайды и подборки',
          description:
            'Маршруты, подборки районов, списки сервисов и практические советы.',
        },
      ]}
    />
  );
}


