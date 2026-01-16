import { AtlasContentPage } from '@/modules/atlas/components/AtlasContentPage';

export default function CityWeatherPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AtlasContentPage
      kind="city"
      id={params.id}
      sectionKey="weather"
      title="Погода и сезонность"
      emptyTitle="Климат города"
      emptyDescription="Раздел о погоде появится после подключения контента."
    />
  );
}

