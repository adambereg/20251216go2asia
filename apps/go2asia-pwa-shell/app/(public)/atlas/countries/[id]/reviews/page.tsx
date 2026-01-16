import { AtlasContentPage } from '@/modules/atlas/components/AtlasContentPage';

export default function CountryReviewsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AtlasContentPage
      kind="country"
      id={params.id}
      sectionKey="reviews"
      title="Отзывы экспатов"
      emptyTitle="Отзывы экспатов"
      emptyDescription="Отзывы появятся после подключения контента."
    />
  );
}

