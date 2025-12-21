'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wallet, Award, Users, Target, BarChart } from 'lucide-react';
import { cn } from '@go2asia/ui';

export function ConnectNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/connect', label: 'Главная', icon: Home },
    { href: '/connect/wallet', label: 'Кошелёк', icon: Wallet },
    { href: '/connect/levels', label: 'Уровни', icon: Award },
    { href: '/connect/referrals', label: 'Рефералы', icon: Users },
    { href: '/connect/missions', label: 'Миссии', icon: Target },
    { href: '/connect/analytics', label: 'Статистика', icon: BarChart },
  ];

  return (
    <div className="w-full max-w-full min-w-0 overflow-x-auto overscroll-x-contain touch-pan-x pb-2">
      <nav className="flex flex-nowrap gap-2 whitespace-nowrap w-max" aria-label="Навигация Connect Asia">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === '/connect' ? pathname === '/connect' : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg px-3 py-2 min-w-[84px] transition-colors whitespace-nowrap shrink-0',
                isActive ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs text-center leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

