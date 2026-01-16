import { AtlasContentPage } from '@/modules/atlas/components/AtlasContentPage';

export default function CityTipsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AtlasContentPage
      kind="city"
      id={params.id}
      sectionKey="tips"
      title="Практическая информация"
      emptyTitle="Полезные советы"
      emptyDescription="Раздел с практической информацией появится после подключения контента."
    />
  );
}

