import { AtlasContentPage } from '@/modules/atlas/components/AtlasContentPage';

export default function CityShoppingPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AtlasContentPage
      kind="city"
      id={params.id}
      sectionKey="shopping"
      title="Шопинг"
      emptyTitle="Где делать покупки"
      emptyDescription="Раздел о шопинге появится после подключения контента."
    />
  );
}

