import { AtlasContentPage } from '@/modules/atlas/components/AtlasContentPage';

export default function CityNightlifePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AtlasContentPage
      kind="city"
      id={params.id}
      sectionKey="nightlife"
      title="Ночная жизнь"
      emptyTitle="Вечерние развлечения"
      emptyDescription="Раздел о ночной жизни появится после подключения контента."
    />
  );
}

