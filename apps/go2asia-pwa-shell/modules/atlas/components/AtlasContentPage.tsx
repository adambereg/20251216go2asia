import { EmptyStateAtlas } from '@/modules/atlas';
import { AtlasContentSection } from '@/modules/atlas/components/AtlasContentSection';
import { getPhilippinesCitySection, getPhilippinesCountrySection } from '@/modules/atlas/content/philippines';

type Kind = 'country' | 'city';

export function AtlasContentPage({
  kind,
  id,
  sectionKey,
  title,
  emptyTitle,
  emptyDescription,
}: {
  kind: Kind;
  id: string;
  sectionKey: string;
  title: string;
  emptyTitle: string;
  emptyDescription: string;
}) {
  const section =
    kind === 'country'
      ? getPhilippinesCountrySection(id, sectionKey)
      : getPhilippinesCitySection(id, sectionKey);

  if (!section) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <EmptyStateAtlas title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  return <AtlasContentSection title={title} markdown={section.content} />;
}
