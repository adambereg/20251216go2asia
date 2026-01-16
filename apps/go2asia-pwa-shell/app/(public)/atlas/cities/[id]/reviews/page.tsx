import { AtlasContentPage } from '@/modules/atlas/components/AtlasContentPage';

export default function CityReviewsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AtlasContentPage
      kind="city"
      id={params.id}
      sectionKey="reviews"
      title="Отзывы"
      emptyTitle="Отзывы туристов и экспатов"
      emptyDescription="Отзывы появятся после подключения контента."
    />
  );
}

