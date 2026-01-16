import { AtlasContentPage } from '@/modules/atlas/components/AtlasContentPage';

export default function CountryWeatherPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AtlasContentPage
      kind="country"
      id={params.id}
      sectionKey="weather"
      title="Погода и климат"
      emptyTitle="Погода и климат"
      emptyDescription="Климатические данные будут доступны после подключения источников."
    />
  );
}

