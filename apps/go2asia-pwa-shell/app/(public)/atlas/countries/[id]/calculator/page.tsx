import { AtlasContentPage } from '@/modules/atlas/components/AtlasContentPage';

export default function CountryCalculatorPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AtlasContentPage
      kind="country"
      id={params.id}
      sectionKey="calculator"
      title="Калькулятор стоимости"
      emptyTitle="Калькулятор стоимости"
      emptyDescription="Калькулятор появится после подключения контента."
    />
  );
}

