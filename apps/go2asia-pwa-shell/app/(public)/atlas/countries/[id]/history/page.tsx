import { AtlasContentPage } from '@/modules/atlas/components/AtlasContentPage';

export default function CountryHistoryPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AtlasContentPage
      kind="country"
      id={params.id}
      sectionKey="history"
      title="История"
      emptyTitle="История страны"
      emptyDescription="Исторический обзор появится после подключения контента."
    />
  );
}


