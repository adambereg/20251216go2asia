'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Briefcase,
  HelpCircle,
  Heart,
  Map,
  MapPinned,
  Store,
  Ticket,
  WalletCards,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@go2asia/ui';

function isNavActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === '/rf') return pathname === '/rf';
  return pathname === href || pathname.startsWith(`${href}/`);
}

type NavDef = { href: string; label: string; icon: LucideIcon };

const publicNav: NavDef[] = [
  { href: '/rf', label: 'Каталог мест', icon: MapPinned },
  { href: '/rf/vouchers', label: 'Предложения', icon: Ticket },
  { href: '/rf/map', label: 'Карта', icon: Map },
  { href: '/rf/favorites', label: 'Избранное', icon: Heart },
  { href: '/rf/my-vouchers', label: 'Мои ваучеры', icon: WalletCards },
  { href: '/rf/how-it-works', label: 'Как это работает', icon: HelpCircle },
];

const cabinetNav: NavDef[] = [
  { href: '/rf/merchant', label: 'Кабинет партнёра', icon: Store },
  { href: '/rf/pro', label: 'PRO кабинет', icon: Briefcase },
];

function NavButton({ item, active }: { item: NavDef; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link href={item.href}>
      <Button variant={active ? 'primary' : 'secondary'} size="sm" className="flex items-center gap-2">
        <Icon size={16} />
        <span className="max-w-[11rem] truncate sm:max-w-none">{item.label}</span>
      </Button>
    </Link>
  );
}

export function RFMainNav() {
  const pathname = usePathname();

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Публичный контур</p>
        <div className="flex flex-wrap gap-2">
          {publicNav.map((item) => (
            <NavButton key={item.href} item={item} active={isNavActive(pathname, item.href)} />
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-3">
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Кабинеты</p>
        <div className="flex flex-wrap gap-2">
          {cabinetNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isNavActive(pathname, item.href) ? 'primary' : 'secondary'}
                  size="sm"
                  className="flex items-center gap-2 border-dashed border-slate-300 bg-white/90"
                >
                  <Icon size={16} />
                  {item.label}
                  <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700">
                    beta
                  </span>
                </Button>
              </Link>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] text-slate-500">
          Кабинеты вынесены отдельно и не являются основным discovery-сценарием для гостя.
        </p>
      </div>
    </div>
  );
}
