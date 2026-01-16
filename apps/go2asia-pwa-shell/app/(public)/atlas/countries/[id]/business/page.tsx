import { AtlasContentPage } from '@/modules/atlas/components/AtlasContentPage';

export default function CountryBusinessPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AtlasContentPage
      kind="country"
      id={params.id}
      sectionKey="business"
      title="Бизнес"
      emptyTitle="Бизнес и экономика"
      emptyDescription="Бизнес-информация появится после подключения контента."
    />
  );
}


