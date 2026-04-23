'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Bookmark,
  Briefcase,
  LayoutDashboard,
  Newspaper,
  ScrollText,
  Users,
  Trophy,
  Ticket,
  Wallet,
  Award,
  UserPlus,
  Settings,
} from 'lucide-react';
import { cn } from '@go2asia/ui';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const activeNavItems: NavItem[] = [
  { href: '/space', label: 'Дашборд', icon: LayoutDashboard },
  { href: '/space/community', label: 'Сообщества', icon: Users },
  { href: '/space/feed', label: 'Лента', icon: Newspaper },
  { href: '/space/saved', label: 'Сохранённые', icon: Bookmark },
  { href: '/space/activity', label: 'Активность', icon: Bell },
  { href: '/space/organizer', label: 'Organizer', icon: Briefcase },
];

const secondaryNavItems: NavItem[] = [
  { href: '/space/posts', label: 'Публикации', icon: ScrollText },
];

const deferredNavItems: Array<{ label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { label: 'Квесты', icon: Trophy },
  { label: 'Ваучеры', icon: Ticket },
  { label: 'Баланс', icon: Wallet },
  { label: 'NFT', icon: Award },
  { label: 'Рефералы', icon: UserPlus },
  { label: 'Настройки', icon: Settings },
];

interface SpaceNavProps {
  className?: string;
  variant?: 'vertical' | 'horizontal';
}

export function SpaceNav({ className, variant = 'vertical' }: SpaceNavProps) {
  const pathname = usePathname();

  function isItemActive(href: string): boolean {
    if (href === '/space') return pathname === '/space';
    if (href === '/space/community') {
      return pathname === '/space/community' || pathname.startsWith('/space/community/groups/');
    }
    if (href === '/space/feed') {
      return pathname.startsWith('/space/feed');
    }
    return pathname.startsWith(href);
  }

  if (variant === 'horizontal') {
    return (
      <nav className={cn('flex gap-2 overflow-x-auto pb-2', className)}>
        {activeNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = isItemActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg px-3 py-2 min-w-[80px] transition-colors whitespace-nowrap',
                isActive
                  ? 'bg-sky-50 text-sky-700'
                  : 'text-slate-700 hover:bg-slate-50'
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs text-center leading-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
        {secondaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = isItemActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg border px-3 py-2 min-w-[80px] transition-colors whitespace-nowrap',
                isActive
                  ? 'border-slate-300 bg-white text-slate-900'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs text-center leading-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className={cn('space-y-1', className)}>
      {activeNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = isItemActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
              'text-sm font-medium',
              isActive
                ? 'bg-sky-50 text-sky-700'
                : 'text-slate-700 hover:bg-slate-50'
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}

      <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
          Ещё в Space
        </div>
        <div className="mt-2 space-y-1">
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-50'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
          Скоро
        </div>
        <ul className="mt-2 space-y-2">
          {deferredNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.label}
                className="flex items-center gap-2 text-xs text-slate-500"
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

