import { AtlasContentPage } from '@/modules/atlas/components/AtlasContentPage';

export default function CountryLivingPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AtlasContentPage
      kind="country"
      id={params.id}
      sectionKey="living"
      title="Проживание"
      emptyTitle="Проживание"
      emptyDescription="Раздел о проживании появится после подключения контента."
    />
  );
}


