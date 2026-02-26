'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Globe,
  Users,
  ExternalLink,
  Download,
  Heart,
  Share2,
  CheckCircle2,
  Flag,
  Tag,
  User,
} from 'lucide-react';
import { Event } from './types';
import { Card, CardContent, Badge, Button } from '@go2asia/ui';
import { EventUGCBlock } from './EventUGCBlock';
import { EventRegisterButton } from './EventRegisterButton';
import { resolveMediaUrl } from '@go2asia/sdk/media';
import { MarkdownRenderer } from '@/modules/atlas/components/MarkdownRenderer';
import { getCategoryLabel } from './category';

interface EventDetailProps {
  event: Event;
  demoMode?: {
    title?: string;
    reason: 'NOT_FOUND' | 'SERVER_ERROR' | 'NETWORK_ERROR';
  };
}

// Генерация ICS файла для добавления в календарь
function generateICS(event: Event): string {
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const start = formatDate(event.startDate);
  const end = formatDate(event.endDate);
  const location = event.location
    ? `${event.location.name}${event.location.address ? `, ${event.location.address}` : ''}`
    : '';
  const description = event.description || '';

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Go2Asia//Pulse Asia//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@go2asia.space`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `LOCATION:${location}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

// Скачивание ICS файла
function downloadICS(event: Event) {
  const icsContent = generateICS(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.title.replace(/[^a-z0-9]/gi, '_')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export const EventDetail: React.FC<EventDetailProps> = ({ event, demoMode }) => {
  const [isSaved, setIsSaved] = useState(false);

  const galleryKeys = (event.galleryMediaKeys ?? []).filter(
    (k): k is string => typeof k === 'string' && k.trim().length > 0,
  );
  const firstGalleryKey = galleryKeys[0] ?? null;
  const deterministicFallbackKey =
    event.countrySlug && event.slug
      ? `events/${event.countrySlug}/${event.year ?? event.startDate.getFullYear()}/${event.slug}/01.jpg`
      : null;
  const heroKey =
    (typeof event.heroMediaKey === 'string' && event.heroMediaKey.trim().length > 0
      ? event.heroMediaKey.trim()
      : null) ??
    firstGalleryKey ??
    deterministicFallbackKey;

  const heroUrl = resolveMediaUrl(heroKey) ?? (event.cover ?? null);
  const galleryUrls = galleryKeys
    .map((k) => resolveMediaUrl(k))
    .filter((u): u is string => typeof u === 'string' && u.length > 0);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // TODO: Сохранение события в избранное
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (err) {
        // Пользователь отменил шаринг
      }
    } else {
      // Fallback: копирование в буфер обмена
      navigator.clipboard.writeText(window.location.href);
      alert('Ссылка скопирована в буфер обмена');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {demoMode && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="info">{demoMode.title ?? 'DEMO MODE'}</Badge>
              {demoMode.title === 'MOCK DATA' ? (
                <span className="text-sm text-amber-900">
                  Показаны мок-данные (NEXT_PUBLIC_DATA_SOURCE=mock).
                </span>
              ) : (
                <span className="text-sm text-amber-900">
                  Показаны локальные демо-данные (fallback), потому что API недоступен (
                  {demoMode.reason === 'NOT_FOUND'
                    ? '404'
                    : demoMode.reason === 'SERVER_ERROR'
                    ? '5xx'
                    : 'network'}
                  ).
                </span>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Hero Section с обложкой */}
      <div className="relative bg-white border-b border-slate-200">
        <div className="relative h-72 md:h-[420px] overflow-hidden bg-gradient-to-r from-sky-600 via-indigo-600 to-slate-900">
          {heroUrl ? (
            <img src={heroUrl} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/35 to-sky-950/10" />
          <div className="absolute inset-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-8">
              <div className="flex flex-wrap gap-2 mb-3">
                {event.badges?.map((badge) => (
                  <Badge
                    key={badge}
                    variant={
                      badge === 'verified'
                        ? 'verified'
                        : badge === 'russian-friendly'
                        ? 'russian-friendly'
                        : 'info'
                    }
                  >
                    {badge === 'verified' && (
                      <>
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Проверено
                      </>
                    )}
                    {badge === 'russian-friendly' && (
                      <>
                        <Flag className="w-3 h-3 mr-1" />
                        RF
                      </>
                    )}
                    {badge === 'free' && 'Бесплатно'}
                    {badge === 'paid' && 'Платно'}
                    {badge === 'repeating' && 'Повторяется'}
                    {badge === 'virtual-event' && 'Онлайн'}
                  </Badge>
                ))}
                {event.category && <Badge variant="info">{getCategoryLabel(event.category)}</Badge>}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">{event.title}</h1>
              <div className="mt-2 text-sm md:text-base text-white/90">
                {[event.location?.city, event.location?.country].filter(Boolean).join(', ')}
              </div>
            </div>
          </div>
        </div>

        {/* Gallery прямо под hero (3–5 фото) */}
        {galleryUrls.length > 0 ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-4">
            <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur shadow-sm p-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {galleryUrls.map((src, idx) => (
                  <div
                    key={`${src}-${idx}`}
                    className="relative aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                  >
                    <img
                      src={src}
                      alt={`${event.title} — фото ${idx + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-slate-600 mb-4">
            <Link href="/pulse" className="hover:text-sky-600">
              Pulse Asia
            </Link>
            <span>/</span>
            <span className="text-slate-900 line-clamp-1">{event.title}</span>
          </nav>

          {/* Действия */}
          <div className="flex flex-wrap gap-2">
            <EventRegisterButton
              eventId={event.id}
              eventTitle={event.title}
              isRegistered={false}
              size="sm"
              className="flex items-center justify-center gap-2"
            />
            <Button variant="secondary" size="sm" onClick={handleSave}>
              <Heart className={`w-4 h-4 mr-1 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
              {isSaved ? 'Сохранено' : 'Сохранить'}
            </Button>
            <Button variant="secondary" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-1" />
              Поделиться
            </Button>
            <Button variant="secondary" size="sm" onClick={() => downloadICS(event)}>
              <Download className="w-4 h-4 mr-1" />
              В календарь
            </Button>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Основная информация */}
          <div className="lg:col-span-2 space-y-6">
            {/* Описание / контент */}
            {(event.bodyMarkdown || event.description) && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">О событии</h2>
                  {event.bodyMarkdown ? (
                    <MarkdownRenderer
                      markdown={event.bodyMarkdown}
                      className="prose prose-slate max-w-none prose-headings:mt-6 prose-headings:mb-3 prose-p:my-3"
                    />
                  ) : (
                    <p className="text-slate-700 whitespace-pre-line">{event.description}</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Теги */}
            {event.tags && event.tags.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* UGC блок */}
            <EventUGCBlock eventId={event.id} />
          </div>

          {/* Боковая панель */}
          <div className="space-y-6">
            {/* Дата и время */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-sky-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-slate-900">
                        {formatDate(event.startDate)}
                      </div>
                      <div className="text-sm text-slate-600">
                        {formatTime(event.startDate)} - {formatTime(event.endDate)}
                      </div>
                      {event.timezone && (
                        <div className="text-xs text-slate-500 mt-1">
                          Часовой пояс: {event.timezone}
                        </div>
                      )}
                    </div>
                  </div>

                  {event.rrule && (
                    <div className="text-sm text-slate-600 pt-2 border-t border-slate-200">
                      <Badge variant="info">Повторяющееся событие</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Местоположение */}
            {event.location && (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-sky-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">{event.location.name}</div>
                        {event.location.address && (
                          <div className="text-sm text-slate-600 mt-1">
                            {event.location.address}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ссылки на Atlas */}
                    {event.atlasLinks && (
                      <div className="pt-3 border-t border-slate-200 space-y-2">
                        <div className="text-xs font-medium text-slate-600 mb-2">В Atlas:</div>
                        {event.atlasLinks.countryId && (
                          <Link
                            href={`/atlas/countries/${event.atlasLinks.countryId}`}
                            className="flex items-center gap-2 text-sm text-sky-600 hover:text-sky-700"
                          >
                            <Globe className="w-4 h-4" />
                            {event.location.country}
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                        {event.atlasLinks.cityId && (
                          <Link
                            href={`/atlas/cities/${event.atlasLinks.cityId}`}
                            className="flex items-center gap-2 text-sm text-sky-600 hover:text-sky-700"
                          >
                            <MapPin className="w-4 h-4" />
                            {event.location.city}
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                        {event.atlasLinks.placeId && (
                          <Link
                            href={`/atlas/places/${event.atlasLinks.placeId}`}
                            className="flex items-center gap-2 text-sm text-sky-600 hover:text-sky-700"
                          >
                            <MapPin className="w-4 h-4" />
                            {event.location.name}
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Организатор */}
            {event.organizer && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-sky-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-xs font-medium text-slate-600 mb-1">Организатор</div>
                      <div className="font-medium text-slate-900">{event.organizer.name}</div>
                      {event.organizer.type === 'pro' && (
                        <Badge variant="verified" className="mt-2">
                          PRO
                        </Badge>
                      )}
                      {event.organizer.type === 'partner' && (
                        <Badge variant="russian-friendly" className="mt-2">
                          Партнёр
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Участники */}
            {(event.attendeesCount !== undefined || event.maxAttendees !== undefined) && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-sky-600" />
                    <div>
                      <div className="font-medium text-slate-900">
                        {event.attendeesCount || 0}
                        {event.maxAttendees && ` / ${event.maxAttendees}`} участников
                      </div>
                      {event.maxAttendees && (
                        <div className="text-xs text-slate-600 mt-1">
                          {event.maxAttendees - (event.attendeesCount || 0)} мест осталось
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Цена */}
            {event.price && (
              <Card>
                <CardContent className="p-6">
                  <div className="font-medium text-slate-900">
                    {event.price.type === 'free' ? (
                      'Бесплатно'
                    ) : (
                      <>
                        {event.price.amount} {event.price.currency || 'THB'}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

