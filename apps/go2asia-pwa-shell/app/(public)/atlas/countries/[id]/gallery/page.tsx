import { AtlasContentPage } from '@/modules/atlas/components/AtlasContentPage';

export default function CountryGalleryPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AtlasContentPage
      kind="country"
      id={params.id}
      sectionKey="gallery"
      title="Фотогалерея"
      emptyTitle="Фотогалерея в разработке"
      emptyDescription="Фотографии будут доступны после подключения галереи."
    />
  );
}

