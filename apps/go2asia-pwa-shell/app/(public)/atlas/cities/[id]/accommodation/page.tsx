import { AtlasContentPage } from '@/modules/atlas/components/AtlasContentPage';

export default function CityAccommodationPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AtlasContentPage
      kind="city"
      id={params.id}
      sectionKey="accommodation"
      title="Проживание"
      emptyTitle="Где остановиться"
      emptyDescription="Раздел о проживании появится после подключения контента."
    />
  );
}

