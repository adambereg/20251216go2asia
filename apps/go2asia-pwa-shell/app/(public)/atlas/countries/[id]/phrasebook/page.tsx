import { AtlasContentPage } from '@/modules/atlas/components/AtlasContentPage';

export default function CountryPhrasebookPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AtlasContentPage
      kind="country"
      id={params.id}
      sectionKey="phrasebook"
      title="Разговорник"
      emptyTitle="Разговорник"
      emptyDescription="Фразы будут добавлены после подключения контента."
    />
  );
}

