'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  CheckSquare,
  Handshake,
  ClipboardCheck,
  LayoutDashboard,
  ListOrdered,
  ListTodo,
  MapPin,
  Store,
  Ticket,
  UserPlus,
} from 'lucide-react';

interface PRONavProps {
  variant?: 'vertical' | 'horizontal';
}

const workspaceSections = [
  { href: '/rf/pro#pw-overview', label: 'Обзор', icon: LayoutDashboard },
  { href: '/rf/pro#pw-linked-partners', label: 'Связанные партнёры', icon: Handshake },
  { href: '/rf/pro#pw-partners', label: 'Support scope', icon: Store },
  { href: '/rf/pro#pw-offers', label: 'Офферы партнёров', icon: ListOrdered },
  { href: '/rf/pro#pw-attributed-vouchers', label: 'PRO-отметка ваучеров', icon: Ticket },
  { href: '/rf/pro#pw-focus', label: 'Статус и фокус', icon: ClipboardCheck },
  { href: '/rf/pro#pw-public', label: 'Публичный RF view', icon: MapPin },
  { href: '/rf/pro#pw-next', label: 'Дальше', icon: ListTodo },
];

const operations = [
  { href: '/rf/pro/partners', label: 'Партнёры', icon: BarChart3, prefix: '/rf/pro/partners', badge: 'deferred' },
  { href: '/rf/pro/verifications', label: 'Проверки', icon: CheckSquare, prefix: '/rf/pro/verifications', badge: 'deferred' },
  { href: '/rf/pro/onboarding', label: 'Онбординг', icon: UserPlus, prefix: '/rf/pro/onboarding', badge: 'soon' },
  { href: '/rf/pro/rewards', label: 'Границы операций', icon: ClipboardCheck, prefix: '/rf/pro/rewards', badge: 'soon' },
];

export function PRONav({ variant = 'vertical' }: PRONavProps) {
  const pathname = usePathname();
  const overviewExact = pathname === '/rf/pro';
  const [activeHash, setActiveHash] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const syncHash = () => setActiveHash(window.location.hash || '');
    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  const baseLinkClass = (active: boolean, extra = '') =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${extra} ${
      active
        ? 'border border-purple-300 bg-purple-50 text-purple-800'
        : 'border border-transparent text-slate-700 hover:bg-slate-50'
    }`;

  if (variant === 'horizontal') {
    return (
      <div className="space-y-2">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Link href="/rf/pro" className={baseLinkClass(overviewExact, 'whitespace-nowrap')}>
            <LayoutDashboard size={16} />
            <span>Главная</span>
          </Link>
          {workspaceSections.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === '/rf/pro' && activeHash === item.href.replace('/rf/pro', '');
            return (
              <Link key={item.href} href={item.href} className={baseLinkClass(isActive, 'whitespace-nowrap')}>
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {operations.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.prefix || pathname?.startsWith(`${item.prefix}/`);
            return (
              <Link key={item.href} href={item.href} className={baseLinkClass(Boolean(isActive), 'whitespace-nowrap')}>
                <Icon size={16} />
                <span>{item.label}</span>
                {item.badge ? (
                  <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-slate-700">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <nav className="space-y-1">
      <p className="px-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">Сводка</p>
      <Link href="/rf/pro" className={baseLinkClass(overviewExact)}>
        <LayoutDashboard size={18} />
        <span>Главная</span>
      </Link>

      {workspaceSections.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === '/rf/pro' && activeHash === item.href.replace('/rf/pro', '');
        return (
          <Link key={item.href} href={item.href} className={baseLinkClass(isActive)}>
            <Icon size={18} />
            <span>{item.label}</span>
          </Link>
        );
      })}

      <p className="mt-4 px-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">Операции</p>
      {operations.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.prefix || pathname?.startsWith(`${item.prefix}/`);
        return (
            <Link
              key={item.href}
              href={item.href}
            className={baseLinkClass(Boolean(isActive))}
            >
            <Icon size={18} />
            <span>{item.label}</span>
            {item.badge ? (
              <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-slate-700">
                {item.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
      <p className="mt-2 px-1 text-[11px] text-slate-500">Маршруты с меткой deferred/soon показывают статусный экран и не подтверждают операционные действия.</p>
    </nav>
  );
}

