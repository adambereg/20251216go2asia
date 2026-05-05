'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Store,
  Ticket,
  MessageSquare,
  BarChart3,
  Settings,
  ListOrdered,
  PlusCircle,
} from 'lucide-react';

interface MerchantNavProps {
  variant?: 'vertical' | 'horizontal';
}

const dashboardSections = [
  { href: '/rf/merchant#mw-my-partners', label: 'Партнёры', icon: Store },
  { href: '/rf/merchant#mw-offers', label: 'Офферы', icon: ListOrdered },
  { href: '/rf/merchant#mw-create-partner', label: 'Создать партнёра', icon: PlusCircle },
];

const opsRoutes = [
  { href: '/rf/merchant/vouchers', label: 'Ваучеры', icon: Ticket, prefix: '/rf/merchant/vouchers' },
  { href: '/rf/merchant/reviews', label: 'Отзывы', icon: MessageSquare, prefix: '/rf/merchant/reviews', badge: 'soon' },
  { href: '/rf/merchant/stats', label: 'Статистика', icon: BarChart3, prefix: '/rf/merchant/stats', badge: 'soon' },
  { href: '/rf/merchant/settings', label: 'Настройки', icon: Settings, prefix: '/rf/merchant/settings', badge: 'soon' },
];

function isOpsActive(pathname: string | null, prefix: string): boolean {
  return pathname === prefix || pathname?.startsWith(`${prefix}/`) === true;
}

export function MerchantNav({ variant = 'vertical' }: MerchantNavProps) {
  const pathname = usePathname();

  const overviewExact = pathname === '/rf/merchant';

  const linkClass = (active: boolean, extra = '') =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${extra} ${
      active
        ? 'border border-slate-800 bg-slate-900 text-white'
        : 'border border-transparent text-slate-700 hover:bg-slate-50'
    }`;

  const renderDashboardLinks = (horizontal: boolean) => (
    <>
      <p className={`px-1 text-[10px] font-bold uppercase tracking-wide text-slate-400 ${horizontal ? 'mt-1' : 'mt-3'}`}>
        Сводка
      </p>
      <Link
        href="/rf/merchant"
        className={linkClass(overviewExact, horizontal ? 'whitespace-nowrap' : '')}
      >
        <LayoutDashboard size={horizontal ? 16 : 18} />
        <span>Главная</span>
      </Link>
      {dashboardSections.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.href} href={item.href} className={linkClass(false, horizontal ? 'whitespace-nowrap' : '')}>
            <Icon size={horizontal ? 16 : 18} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </>
  );

  const renderOps = (horizontal: boolean) => (
    <>
      <p className={`px-1 text-[10px] font-bold uppercase tracking-wide text-slate-400 ${horizontal ? 'mt-1' : 'mt-4'}`}>
        Операции
      </p>
      {opsRoutes.map((item) => {
        const Icon = item.icon;
        const active = isOpsActive(pathname, item.prefix);
        return (
          <Link key={item.href} href={item.href} className={linkClass(active, horizontal ? 'whitespace-nowrap' : '')}>
            <Icon size={horizontal ? 16 : 18} />
            <span>{item.label}</span>
            {item.badge ? (
              <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-slate-700">
                {item.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </>
  );

  if (variant === 'horizontal') {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">{renderDashboardLinks(true)}</div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">{renderOps(true)}</div>
      </div>
    );
  }

  return (
    <nav className="space-y-1">
      {renderDashboardLinks(false)}
      {renderOps(false)}
    </nav>
  );
}
