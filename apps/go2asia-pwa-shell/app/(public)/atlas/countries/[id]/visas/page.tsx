import { AtlasContentPage } from '@/modules/atlas/components/AtlasContentPage';

export default function CountryVisasPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AtlasContentPage
      kind="country"
      id={params.id}
      sectionKey="visas"
      title="Визы"
      emptyTitle="Визовая информация"
      emptyDescription="Визовые правила будут добавлены после подключения источников."
    />
  );
}


