import { AtlasContentPage } from '@/modules/atlas/components/AtlasContentPage';

export default function CityGuidesPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AtlasContentPage
      kind="city"
      id={params.id}
      sectionKey="guides"
      title="Гайды"
      emptyTitle="Маршруты по городу"
      emptyDescription="Раздел с гайдами появится после подключения контента."
    />
  );
}

