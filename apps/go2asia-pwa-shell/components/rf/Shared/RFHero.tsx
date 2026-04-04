'use client';

import { ModuleHero } from '@/components/modules';
import { Handshake } from 'lucide-react';

interface RFHeroProps {
  subtitle?: string;
  /** Компактная полоса бренда — меньше визуального веса, для task-first страниц */
  compact?: boolean;
}

export function RFHero({ subtitle, compact }: RFHeroProps) {
  const description =
    subtitle || 'Каталог проверенных Russian Friendly мест и сервисов в Юго-Восточной Азии';

  if (compact) {
    return (
      <section className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <Handshake className="h-6 w-6 shrink-0 text-white" aria-hidden />
            <p className="text-sm font-semibold tracking-tight text-white">Russian Friendly Asia</p>
          </div>
          <p className="mt-0.5 text-xs text-white/85">{description}</p>
        </div>
      </section>
    );
  }

  return (
    <ModuleHero
      icon={Handshake}
      title="Russian Friendly"
      description={description}
      gradientFrom="from-blue-500"
      gradientTo="to-blue-600"
    />
  );
}


