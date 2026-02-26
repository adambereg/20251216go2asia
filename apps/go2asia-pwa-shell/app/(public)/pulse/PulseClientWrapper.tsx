'use client';

import { ModuleHero } from '@/components/modules';
import { Globe } from 'lucide-react';
import { useGetEvents } from '@go2asia/sdk/pulse';
import { useMemo, useState, useEffect } from 'react';
import type { CalendarViewMode, Event, EventFilters } from '@/components/pulse/types';
import { getDataSource } from '@/mocks/dto';
import { mockRepo } from '@/mocks/repo';
import { CalendarView } from '@/components/pulse';
import { useRouter, useSearchParams } from 'next/navigation';

export function PulseClientWrapper() {
  const dataSource = getDataSource();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dataSourceBadge = dataSource === 'mock' ? 'MOCK' : 'API';

  const [viewMode, setViewMode] = useState<CalendarViewMode>('week');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  function parseFiltersFromURL(sp: URLSearchParams): EventFilters {
    const filters: EventFilters = {};

    const country = sp.get('country');
    if (country) filters.country = country;

    const city = sp.get('city');
    if (city) filters.city = city;

    const category = sp.get('category');
    if (category) filters.category = category;

    const price = sp.get('price');
    if (price && ['free', 'paid'].includes(price)) filters.price = price as any;

    const verified = sp.get('verified');
    if (verified === 'true' || verified === '1') filters.verified = true;
    if (verified === 'false' || verified === '0') filters.verified = false;

    const search = sp.get('q') ?? sp.get('search');
    if (search) filters.search = search;

    return filters;
  }

  function updateURLWithFilters(filters: EventFilters) {
    const params = new URLSearchParams();
    if (filters.country) params.set('country', filters.country);
    if (filters.city) params.set('city', filters.city);
    if (filters.category) params.set('category', filters.category);
    if (filters.price && filters.price !== 'all') params.set('price', filters.price);
    if (filters.verified !== undefined) params.set('verified', filters.verified ? 'true' : 'false');
    if (filters.search) params.set('q', filters.search);

    const queryString = params.toString();
    const newUrl = queryString ? `/pulse?${queryString}` : '/pulse';
    router.replace(newUrl, { scroll: false });
  }

  const filters = useMemo(() => parseFiltersFromURL(searchParams), [searchParams]);

  const apiDateRange = useMemo(() => {
    const d = new Date(currentDate);
    const start = new Date(d);
    const end = new Date(d);

    if (viewMode === 'month') {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(end.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      return { dateFrom: start.toISOString(), dateTo: end.toISOString() };
    }

    if (viewMode === 'week') {
      // Monday as start of week
      const day = start.getDay();
      const diff = start.getDate() - day + (day === 0 ? -6 : 1);
      start.setDate(diff);
      start.setHours(0, 0, 0, 0);
      end.setTime(start.getTime());
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      return { dateFrom: start.toISOString(), dateTo: end.toISOString() };
    }

    // agenda: upcoming window (90 days)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    start.setTime(today.getTime());
    end.setTime(today.getTime());
    end.setDate(end.getDate() + 90);
    end.setHours(23, 59, 59, 999);
    return { dateFrom: start.toISOString(), dateTo: end.toISOString() };
  }, [currentDate, viewMode]);

  // Всегда вызываем хук (правило React Hooks)
  const { data: eventsData, isLoading, error } = useGetEvents({
    limit: 200,
    country: filters.country,
    city: filters.city,
    category: filters.category,
    price: filters.price && filters.price !== 'all' ? filters.price : 'any',
    verified: filters.verified === true ? 'true' : filters.verified === false ? 'false' : 'any',
    q: filters.search,
    dateFrom: apiDateRange.dateFrom,
    dateTo: apiDateRange.dateTo,
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
    heroMediaKey: null,
    galleryMediaKeys: null,
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
    countrySlug: undefined,
    citySlug: undefined,
  });

  const events = useMemo(() => {
    // Mock mode — всегда используем моки
    if (dataSource === 'mock') {
      return mockRepo.pulse.listEvents().map(mapMockToEvent);
    }

    // API mode — используем данные из API
    if (eventsData?.items?.length) {
      return eventsData.items.map((dto: any): Event => {
        const startDate = new Date(dto.startDate);
        const endDate = dto.endDate ? new Date(dto.endDate) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

        const isFree = Boolean(dto.isFree);
        const isVerified = Boolean(dto.isVerified);

        const badges: any[] = [];
        if (isVerified) badges.push('verified');
        badges.push(isFree ? 'free' : 'paid');

        const countryName = (dto.countryName ?? dto.countrySlug ?? '') as string;
        const cityName = (dto.cityName ?? dto.citySlug ?? '') as string;
        const locationStr: string =
          (dto.location as string | null | undefined) ??
          [cityName, countryName].filter(Boolean).join(', ');

        return {
          id: dto.id,
          title: dto.title,
          description: dto.shortDescription ?? undefined,
          startDate,
          endDate,
          category: dto.category ?? undefined,
          heroMediaKey: dto.heroMediaKey ?? null,
          galleryMediaKeys: Array.isArray(dto.galleryMediaKeys) ? dto.galleryMediaKeys : null,
          countrySlug: dto.countrySlug ?? undefined,
          citySlug: dto.citySlug ?? undefined,
          location: locationStr
            ? {
                name: locationStr,
                city: cityName || undefined,
                country: countryName || undefined,
              }
            : undefined,
          badges,
          price: isFree
            ? { type: 'free' }
            : {
                type: 'paid',
                amount: typeof dto.priceAmount === 'string' ? Number(dto.priceAmount) : undefined,
                currency: typeof dto.priceCurrency === 'string' ? dto.priceCurrency : undefined,
              },
          verified: isVerified,
        };
      });
    }

    return [];
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
          badgeText={dataSourceBadge}
        />
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-600">Загрузка событий...</div>
        </div>
      </div>
    );
  }

  if (dataSource === 'api' && (!eventsData?.items || eventsData.items.length === 0) && !error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <ModuleHero
          icon={Globe}
          title="Pulse Asia"
          description="События и мероприятия в Юго-Восточной Азии"
          gradientFrom="from-sky-500"
          gradientTo="to-sky-600"
          badgeText={dataSourceBadge}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
            <div className="text-lg font-bold text-slate-900 mb-2">Пока нет событий</div>
            <div className="text-sm text-slate-600">
              Похоже, Neon ещё не заполнен или фильтры/диапазон дат не возвращают результатов.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (dataSource === 'api' && error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <ModuleHero
          icon={Globe}
          title="Pulse Asia"
          description="События и мероприятия в Юго-Восточной Азии"
          gradientFrom="from-sky-500"
          gradientTo="to-sky-600"
          badgeText={dataSourceBadge}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
            <div className="text-lg font-bold text-slate-900 mb-2">Не удалось загрузить события</div>
            <div className="text-sm text-slate-600">
              Проверьте подключение или попробуйте позже. (API error)
            </div>
          </div>
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
        badgeText={dataSourceBadge}
      />
      <CalendarView
        events={events}
        initialView={viewMode}
        initialDate={currentDate}
        filters={filters}
        onFiltersChange={(f) => updateURLWithFilters(f)}
        onEventClick={(event) => router.push(`/pulse/${event.id}`)}
        onDateChange={(d) => setCurrentDate(d)}
        onViewChange={(m) => setViewMode(m)}
      />
    </div>
  );
}




