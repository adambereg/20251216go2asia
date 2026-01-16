import { AtlasContentPage } from '@/modules/atlas/components/AtlasContentPage';

export default function CityDistrictsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AtlasContentPage
      kind="city"
      id={params.id}
      sectionKey="districts"
      title="Районы"
      emptyTitle="Районы города"
      emptyDescription="Раздел о районах появится после подключения контента."
    />
  );
}

