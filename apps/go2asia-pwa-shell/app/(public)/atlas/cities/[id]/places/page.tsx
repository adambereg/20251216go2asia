import { AtlasContentPage } from '@/modules/atlas/components/AtlasContentPage';

export default function CityPlacesPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AtlasContentPage
      kind="city"
      id={params.id}
      sectionKey="places"
      title="Достопримечательности"
      emptyTitle="Места города"
      emptyDescription="Раздел о достопримечательностях появится после подключения контента."
    />
  );
}

