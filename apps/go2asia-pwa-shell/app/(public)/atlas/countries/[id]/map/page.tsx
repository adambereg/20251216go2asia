import { AtlasContentPage } from '@/modules/atlas/components/AtlasContentPage';

export default function CountryMapPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AtlasContentPage
      kind="country"
      id={params.id}
      sectionKey="map"
      title="Карта"
      emptyTitle="Карта в разработке"
      emptyDescription="Интерактивная карта появится после подключения геоданных."
    />
  );
}

