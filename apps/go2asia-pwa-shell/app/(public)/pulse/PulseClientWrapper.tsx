'use client';

import { ModuleHero } from '@/components/modules';
import { PulseClient } from './PulseClient';
import { Globe } from 'lucide-react';
import { useGetEvents } from '@go2asia/sdk/pulse';
import { useMemo } from 'react';
import type { Event } from '@/components/pulse/types';
import { getDataSource } from '@/mocks/dto';
import { mockRepo } from '@/mocks/repo';

export function PulseClientWrapper() {
  const dataSource = getDataSource();

  // Всегда вызываем хук (правило React Hooks)
  const { data: eventsData, isLoading, error } = useGetEvents({
    limit: 100,
    enabled: dataSource === 'api',
  });

  // Хелпер для преобразования моков в Event
  const mapMockToEvent = (dto: ReturnType<typeof mockRepo.pulse.listEvents>[0]): Event => ({
    id: dto.id,
    title: dto.title,
    description: dto.description,
    startDate: new Date(dto.startTime),
    endDate: new Date(dto.endTime ?? dto.startTime),
    timezone: dto.timezone,
    location: dto.location
      ? {
          name: dto.location.name,
          address: dto.location.address,
          city: dto.location.city,
          country: dto.location.country,
          placeId: dto.location.placeId,
        }
      : undefined,
    category: dto.category,
    tags: dto.tags,
    price: dto.price,
    badges: (dto.badges ?? []) as any,
    cover: dto.coverImage,
    status: 'published',
    verified: dto.badges?.includes('verified'),
  });

  const events = useMemo(() => {
    // Mock mode — всегда используем моки
    if (dataSource === 'mock') {
      return mockRepo.pulse.listEvents().map(mapMockToEvent);
    }

    // API mode — используем данные из API
    if (eventsData?.items?.length) {
      return eventsData.items.map((dto: any): Event => {
        const locationStr: string = dto.location ?? '';
        const parts = locationStr
          .split(',')
          .map((p: string) => p.trim())
          .filter(Boolean);
        const city = parts.length >= 2 ? parts[0] : undefined;
        const country = parts.length >= 2 ? parts.slice(1).join(', ') : undefined;

        const startDate = new Date(dto.startDate);
        const endDate = dto.endDate ? new Date(dto.endDate) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

        return {
          id: dto.id,
          title: dto.title,
          description: dto.description ?? undefined,
          startDate,
          endDate,
          category: dto.category ?? undefined,
          cover: dto.imageUrl ?? undefined,
          location: locationStr
            ? {
                name: locationStr,
                city,
                country,
              }
            : undefined,
          badges: ['verified'],
          price: { type: 'free' },
          verified: true,
        };
      });
    }

    // Fallback на моки при ошибке или пустом ответе (не во время загрузки)
    if (error || !isLoading) {
      if (error) {
        console.warn('[PulseClientWrapper] API error, falling back to mocks:', error.message);
      } else {
        console.warn('[PulseClientWrapper] API returned empty, falling back to mocks');
      }
      return mockRepo.pulse.listEvents().map(mapMockToEvent);
    }

    return [];
  }, [dataSource, eventsData, error, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <ModuleHero
          icon={Globe}
          title="Pulse Asia"
          description="События и мероприятия в Юго-Восточной Азии"
          gradientFrom="from-sky-500"
          gradientTo="to-sky-600"
          badgeText={dataSource === 'mock' ? 'MOCK DATA' : undefined}
        />
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-600">Загрузка событий...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <ModuleHero
        icon={Globe}
        title="Pulse Asia"
        description="События и мероприятия в Юго-Восточной Азии"
        gradientFrom="from-sky-500"
        gradientTo="to-sky-600"
        badgeText={dataSource === 'mock' ? 'MOCK DATA' : undefined}
      />
      <PulseClient events={events} />
    </div>
  );
}




