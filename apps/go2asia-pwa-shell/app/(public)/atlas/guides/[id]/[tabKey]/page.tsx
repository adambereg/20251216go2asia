'use client';

import { useParams } from 'next/navigation';
import { GUIDE_TAB_META } from '@/modules/atlas/guides/guideTabs';
import { useGuideContext } from '@/modules/atlas/guides/GuideContext';
import { GuideSectionView } from '@/modules/atlas/guides/GuideSectionView';
import type { GuideTabKey } from '@/modules/atlas/guides/types';

export default function GuideTabPage() {
  const params = useParams();
  const tabKeyRaw = params?.tabKey as string;
  const tabKey = tabKeyRaw as GuideTabKey;
  const { guide, isAdminView } = useGuideContext();

  if (!guide) {
    return (
      <div className="text-center py-12 text-slate-600">
        Гайд пока в разработке.
      </div>
    );
  }

  const section = guide.sections.find((s) => s.tabKey === tabKey) ?? null;
  const meta = (GUIDE_TAB_META as any)[tabKey] as { label: string } | undefined;

  if (!section) {
    return (
      <div className="text-center py-12 text-slate-600">
        Вкладка не найдена.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">{section.title || meta?.label || tabKey}</h2>
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm px-4 py-4">
        <GuideSectionView section={section} showEmptyPlaceholder={isAdminView} />
      </div>
    </div>
  );
}

