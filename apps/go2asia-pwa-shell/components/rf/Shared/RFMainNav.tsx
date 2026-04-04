'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store, Ticket, MapPinned, Briefcase } from 'lucide-react';
import { Button } from '@go2asia/ui';

export function RFMainNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/rf', label: 'Каталог мест', icon: MapPinned, isLive: true },
    { href: '/rf/vouchers', label: 'Предложения', icon: Ticket, isLive: true },
    { href: '/rf/merchant', label: 'Кабинет партнёра (beta)', icon: Store, isLive: false },
    { href: '/rf/pro', label: 'PRO кабинет (beta)', icon: Briefcase, isLive: false },
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link key={item.href} href={item.href}>
              <Button variant={isActive ? 'primary' : 'secondary'} size="sm" className="flex items-center gap-2">
                <Icon size={16} />
                {item.label}
                {!item.isLive ? (
                  <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700">
                    beta
                  </span>
                ) : null}
              </Button>
            </Link>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-slate-500">
        Основной сценарий — подбор мест; предложения и ваучеры доступны отдельной вкладкой. Кабинеты в beta.
      </p>
    </div>
  );
}

