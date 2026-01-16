import { AtlasContentPage } from '@/modules/atlas/components/AtlasContentPage';

export default function CountryCulturePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AtlasContentPage
      kind="country"
      id={params.id}
      sectionKey="culture"
      title="Культура"
      emptyTitle="Культура и этикет"
      emptyDescription="Культурный обзор появится после подключения контента."
    />
  );
}


