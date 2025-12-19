'use client';

import { ModuleHero } from '@/components/modules';
import { PulseClient } from './PulseClient';
import { Globe } from 'lucide-react';
import { useGetEvents } from '@go2asia/sdk/pulse';
import { useMemo } from 'react';
import type { Event } from '@/components/pulse/types';
import Link from 'next/link';
import { Badge, Card, CardContent } from '@go2asia/ui';

const DEMO_EVENT_IDS = [
  'e7f8b7d4-6f6a-4f1e-9aa0-2d4dbaac7b10',
  '5b531b8d-8c7a-4fe8-b389-62e2f8d1d8a3',
  '0a4b18e5-3c2d-4a06-8c42-93a8a2c84b67',
] as const;

export function PulseClientWrapper() {
  // Загружаем события из API
  const { data: eventsData, isLoading } = useGetEvents({
    limit: 100, // Загружаем больше событий для календаря
  });

  // Преобразуем данные из API в формат компонента
  const events = useMemo(() => {
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
  }, [eventsData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <ModuleHero
          icon={Globe}
          title="Pulse Asia"
          description="События и мероприятия в Юго-Восточной Азии"
          gradientFrom="from-sky-500"
          gradientTo="to-sky-600"
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
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="info">DEMO</Badge>
              <span className="text-sm font-medium text-amber-900">
                Для проверки регистрации откройте страницу события по id:
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {DEMO_EVENT_IDS.map((id) => (
                <Link
                  key={id}
                  href={`/pulse/${id}`}
                  className="text-sm text-sky-700 hover:text-sky-800 underline underline-offset-4"
                >
                  /pulse/{id}
                </Link>
              ))}
            </div>
            <p className="text-xs text-amber-800 mt-2">
              Если на странице события появляется баннер <b>DEMO MODE</b>, значит API недоступен и включился fallback на мок.
            </p>
          </CardContent>
        </Card>
      </div>
      <PulseClient events={events} />
    </div>
  );
}
