import { AtlasContentPage } from '@/modules/atlas/components/AtlasContentPage';

export default function CityFoodPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AtlasContentPage
      kind="city"
      id={params.id}
      sectionKey="food"
      title="Еда и кафе"
      emptyTitle="Еда и кафе"
      emptyDescription="Раздел о еде и кафе появится после подключения контента."
    />
  );
}

