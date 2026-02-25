'use client';

import { GUIDE_TAB_META } from '@/modules/atlas/guides/guideTabs';
import { useGuideContext } from '@/modules/atlas/guides/GuideContext';
import { GuideSectionView } from '@/modules/atlas/guides/GuideSectionView';

export default function GuideOverviewPage() {
  const { guide, isAdminView } = useGuideContext();

  if (!guide) {
    return (
      <div className="text-center py-12 text-slate-600">
        Гайд пока в разработке.
      </div>
    );
  }

  const section = guide.sections.find((s) => s.tabKey === 'overview') ?? null;
  if (!section) {
    return (
      <div className="text-center py-12 text-slate-600">
        Вкладка «{GUIDE_TAB_META.overview.label}» не найдена.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">{section.title || GUIDE_TAB_META.overview.label}</h2>
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm px-4 py-4">
        <GuideSectionView section={section} showEmptyPlaceholder={isAdminView} />
      </div>
    </div>
  );
}

