'use client';

import { ModuleHero } from '@/components/modules';
import { Wallet } from 'lucide-react';
import { CONNECT_DEFAULT_HERO_DESCRIPTION } from '../copy';

interface ConnectHeroProps {
  subtitle?: string;
  badgeText?: string;
}

export function ConnectHero({ subtitle, badgeText }: ConnectHeroProps) {
  return (
    <ModuleHero
      icon={Wallet}
      title="Connect Asia"
      description={subtitle || CONNECT_DEFAULT_HERO_DESCRIPTION}
      gradientFrom="from-emerald-500"
      gradientTo="to-teal-600"
      badgeText={badgeText}
    />
  );
}

