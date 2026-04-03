'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store, Ticket, Handshake } from 'lucide-react';
import { Button } from '@go2asia/ui';

export function RFMainNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/rf', label: 'RF Хаб', icon: Handshake, isLive: true },
    { href: '/rf/vouchers', label: 'Предложения', icon: Ticket, isLive: true },
    { href: '/rf/merchant', label: 'Кабинет партнёра (beta)', icon: Store, isLive: false },
    { href: '/rf/pro', label: 'PRO кабинет (beta)', icon: Store, isLive: false },
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? 'primary' : 'secondary'}
                size="sm"
                className="flex items-center gap-2"
              >
                <Icon size={16} />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-slate-500">
        Публичные разделы работают на live RF runtime. Кабинеты отмечены как beta и развиваются отдельно.
      </p>
    </div>
  );
}

