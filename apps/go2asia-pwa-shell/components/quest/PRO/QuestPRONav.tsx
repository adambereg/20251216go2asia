'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ListChecks } from 'lucide-react';

interface QuestPRONavProps {
  variant?: 'vertical' | 'horizontal';
}

const sections = [
  {
    href: '/quest/pro',
    prefix: '/quest/pro',
    exact: true,
    label: 'Мои квесты',
    icon: LayoutDashboard,
  },
  {
    href: '/quest/pro',
    prefix: '/quest/pro/',
    exact: false,
    label: 'Management view',
    icon: ListChecks,
  },
];

export function QuestPRONav({ variant = 'vertical' }: QuestPRONavProps) {
  const pathname = usePathname();

  const baseLinkClass = (active: boolean, extra = '') =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${extra} ${
      active
        ? 'border border-violet-300 bg-violet-50 text-violet-800'
        : 'border border-transparent text-slate-700 hover:bg-slate-50'
    }`;

  const isActive = (prefix: string, exact: boolean) => {
    if (!pathname) return false;
    return exact ? pathname === prefix : pathname.startsWith(prefix);
  };

  if (variant === 'horizontal') {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {sections.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={baseLinkClass(isActive(item.prefix, item.exact), 'whitespace-nowrap')}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <nav className="space-y-1">
      <p className="px-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">Quest PRO</p>
      {sections.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={`${item.href}-${item.label}`} href={item.href} className={baseLinkClass(isActive(item.prefix, item.exact))}>
            <Icon size={18} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
