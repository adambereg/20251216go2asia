import { AtlasContentPage } from '@/modules/atlas/components/AtlasContentPage';

export default function CityBudgetPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AtlasContentPage
      kind="city"
      id={params.id}
      sectionKey="budget"
      title="Цены и бюджет"
      emptyTitle="Калькулятор стоимости"
      emptyDescription="Раздел с ценами и бюджетом появится после подключения контента."
    />
  );
}

