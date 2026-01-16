import { AtlasContentPage } from '@/modules/atlas/components/AtlasContentPage';

export default function CountryGeographyPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AtlasContentPage
      kind="country"
      id={params.id}
      sectionKey="geography"
      title="География"
      emptyTitle="География страны"
      emptyDescription="Географический обзор появится после подключения контента."
    />
  );
}


