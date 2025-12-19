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

  // API: загружаем события из SDK (если реализовано)
  const { data: eventsData, isLoading } =
    dataSource === 'api'
      ? useGetEvents({
          limit: 100, // Загружаем больше событий для календаря
        })
      : ({ data: undefined, isLoading: false } as any);

  // Преобразуем данные из API в формат компонента
  const events = useMemo(() => {
    if (dataSource === 'mock') {
      return mockRepo.pulse.listEvents().map((dto): Event => ({
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
      }));
    }

    if (!eventsData?.items) return [];
    return eventsData.items.map((event): Event => ({
      id: event.id,
      title: event.title,
      description: event.description || undefined,
      startDate: new Date(event.startTime),
      endDate: event.endTime ? new Date(event.endTime) : new Date(event.startTime),
      location: {
        name: '', // TODO: Get location name when API supports it
        city: '', // TODO: Get city name from cityId when API supports it
        country: '', // TODO: Get country name when API supports it
        address: '', // TODO: Get address when API supports it
        placeId: event.placeId || undefined,
      },
      category: event.category || undefined,
      organizer: undefined, // TODO: Get organizer when API supports it
      price: undefined, // TODO: Get price when API supports it
      language: 'ru', // TODO: Get language when API supports it
      cover: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg', // TODO: Get coverImage when API supports it
      attendeesCount: 0, // TODO: Get attendeesCount when API supports it
    }));
  }, [dataSource, eventsData]);

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
