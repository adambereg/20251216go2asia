import { AtlasContentPage } from '@/modules/atlas/components/AtlasContentPage';

export default function CityTransportPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AtlasContentPage
      kind="city"
      id={params.id}
      sectionKey="transport"
      title="Транспорт"
      emptyTitle="Как передвигаться по городу"
      emptyDescription="Раздел о транспорте появится после подключения контента."
    />
  );
}

