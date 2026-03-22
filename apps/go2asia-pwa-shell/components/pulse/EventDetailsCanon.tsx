'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ExternalLink, MapPin, ShieldCheck, Tag } from 'lucide-react';
import { Badge, Card, CardContent } from '@go2asia/ui';
import { resolveMediaUrl } from '@go2asia/sdk/media';
import { ImageLightbox } from '@/modules/atlas/components/ImageLightbox';
import { SectionContentRenderer } from '@/modules/atlas/components/SectionContentRenderer';
import { getCategoryLabel } from './category';
import { EventRegisterButton } from './EventRegisterButton';

export type PulseEventEntityDtoLike = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  bodyMarkdown: string;
  category: string | null;
  startDate: string;
  endDate: string | null;
  location: string | null;
  countryName: string | null;
  cityName: string | null;
  heroMediaKey: string | null;
  galleryMediaKeys: string[];
  isFree: boolean;
  isVerified: boolean;
  officialUrl: string | null;
};

type CanonicalSection = { title: string; markdown: string };

export type CanonicalPageData = {
  title: string;
  subtitle: string | null;
  badges: Array<{ key: string; label: string }>;
  heroMediaKey: string | null;
  heroUrl: string | null;
  galleryUrls: string[];
  dateRange: string;
  timeRange: string | null;
  sections: CanonicalSection[];
};

function normalizeMarkdownForSections(markdown: string): string {
  // Canon expects "## " headings for sections; Pulse MD may use "# ".
  return markdown.replace(/^#\s+/gm, '## ');
}

function splitMarkdownIntoSections(markdown: string): CanonicalSection[] {
  const src = normalizeMarkdownForSections(markdown).trim();
  if (!src) return [];

  const lines = src.split(/\r?\n/);
  const sections: CanonicalSection[] = [];
  let currentTitle: string | null = null;
  let currentBody: string[] = [];

  const flush = () => {
    const body = currentBody.join('\n').trim();
    if (!currentTitle) return;
    sections.push({ title: currentTitle, markdown: body });
  };

  for (const line of lines) {
    const m = line.match(/^##\s+(.+)\s*$/);
    if (m) {
      flush();
      currentTitle = m[1]!.trim();
      currentBody = [];
      continue;
    }
    // If first content has no heading, keep it under "Описание"
    if (!currentTitle) currentTitle = 'Описание';
    currentBody.push(line);
  }
  flush();

  // Drop empty bodies to avoid blank cards
  return sections.filter((s) => s.markdown.trim().length > 0);
}

function formatDateRangeRu(startIso: string, endIso: string | null): string {
  const start = new Date(startIso);
  const end = endIso ? new Date(endIso) : null;
  const fmt = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  if (!end) return fmt.format(start);
  // same day
  if (start.toDateString() === end.toDateString()) return fmt.format(start);
  return `${fmt.format(start)} — ${fmt.format(end)}`;
}

function formatTimeRangeRu(startIso: string, endIso: string | null): string | null {
  const start = new Date(startIso);
  const end = endIso ? new Date(endIso) : null;
  const fmt = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' });
  if (!end) return fmt.format(start);
  // if both are midnight-ish (all-day), hide time
  const isAllDay =
    start.getUTCHours() === 0 &&
    start.getUTCMinutes() === 0 &&
    end.getUTCHours() === 23 &&
    end.getUTCMinutes() === 59;
  if (isAllDay) return null;
  return `${fmt.format(start)} — ${fmt.format(end)}`;
}

function pickHeroKey(entity: PulseEventEntityDtoLike): string | null {
  if (entity.heroMediaKey && entity.heroMediaKey.trim()) return entity.heroMediaKey.trim();
  const first = entity.galleryMediaKeys.find((k) => typeof k === 'string' && k.trim().length > 0);
  return first ? first.trim() : null;
}

function buildBadges(entity: PulseEventEntityDtoLike): Array<{ key: string; label: string }> {
  const out: Array<{ key: string; label: string }> = [];
  if (entity.isVerified) out.push({ key: 'verified', label: 'Проверено' });
  out.push({ key: entity.isFree ? 'free' : 'paid', label: entity.isFree ? 'Бесплатно' : 'Платно' });
  if (entity.category) out.push({ key: `cat:${entity.category}`, label: getCategoryLabel(entity.category) ?? entity.category });
  return out;
}

// Canon adapter (SSOT for mapping Event DTO -> unified page skeleton data)
export function toCanonicalPageData(entity: PulseEventEntityDtoLike): CanonicalPageData {
  const heroMediaKey = pickHeroKey(entity);
  const heroUrl = heroMediaKey ? resolveMediaUrl(heroMediaKey) : null;
  const galleryUrls = entity.galleryMediaKeys
    .map((k) => resolveMediaUrl(k))
    .filter((u): u is string => typeof u === 'string' && u.length > 0);

  const subtitle = [entity.cityName, entity.countryName].filter(Boolean).join(', ') || null;
  const sections = splitMarkdownIntoSections(entity.bodyMarkdown);
  const dateRange = formatDateRangeRu(entity.startDate, entity.endDate);
  const timeRange = formatTimeRangeRu(entity.startDate, entity.endDate);

  return {
    title: entity.title,
    subtitle,
    badges: buildBadges(entity),
    heroMediaKey,
    heroUrl,
    galleryUrls,
    dateRange,
    timeRange,
    sections,
  };
}

function PhotoStrip({ images, title }: { images: string[]; title: string }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const strip = images.slice(0, 5);
  if (strip.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-100 p-3 shadow-sm">
        <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-500 text-sm">
          Фото отсутствуют
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-3 px-3 snap-x snap-mandatory">
          {strip.map((src, idx) => (
            <div
              key={`${src}-${idx}`}
              className="flex-shrink-0 w-[271px] snap-start cursor-pointer"
              onClick={() => {
                setLightboxIndex(idx);
                setLightboxOpen(true);
              }}
            >
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 hover:opacity-90 transition-opacity">
                <img src={src} alt={`${title} — фото ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <ImageLightbox
        images={images}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(index) => setLightboxIndex(index)}
      />
    </>
  );
}

export function EventDetailsCanon({ entity }: { entity: PulseEventEntityDtoLike }) {
  const page = useMemo(() => toCanonicalPageData(entity), [entity]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex items-center gap-2 text-sm text-slate-600 mb-4">
            <Link href="/pulse" className="hover:text-sky-700">
              Pulse Asia
            </Link>
            <span>/</span>
            <span className="text-slate-900 line-clamp-1">{entity.title}</span>
          </nav>

          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
            <div className="relative h-44 md:h-56 bg-gradient-to-r from-sky-600 via-indigo-600 to-fuchsia-600">
              {page.heroUrl ? (
                <>
                  <img src={page.heroUrl} alt={entity.title} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40" />
                </>
              ) : (
                <div className="absolute inset-0 bg-black/10" />
              )}

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 text-white">
                <div className="text-xl md:text-2xl font-semibold">{entity.title}</div>
                {page.subtitle ? <div className="text-sm text-white/80 mt-1">{page.subtitle}</div> : null}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                  {page.badges.map((b) => (
                    <span
                      key={b.key}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 text-white border border-white/20 text-xs font-medium"
                    >
                      {b.key === 'verified' ? <ShieldCheck className="w-3 h-3" /> : null}
                      {b.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Gallery strip */}
          <div className="mt-4">
            <PhotoStrip images={page.galleryUrls} title={entity.title} />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: markdown sections */}
          <div className="lg:col-span-2 space-y-4">
            {entity.shortDescription ? (
              <Card>
                <CardContent className="p-6 text-slate-700">{entity.shortDescription}</CardContent>
              </Card>
            ) : null}

            {page.sections.length > 0 ? (
              page.sections.map((s) => (
                <Card key={s.title}>
                  <CardContent className="p-6">
                    <div className="text-base font-semibold text-slate-900 mb-3">{s.title}</div>
                    <SectionContentRenderer markdown={s.markdown} sectionKey={s.title} />
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-slate-700">Описание отсутствует.</CardContent>
              </Card>
            )}
          </div>

          {/* Right: facts */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-base font-semibold text-slate-900 mb-4">Детали</div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-sky-700 mt-0.5" />
                    <div className="text-slate-800">{page.dateRange}</div>
                  </div>
                  {page.timeRange ? (
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-sky-700 mt-0.5" />
                      <div className="text-slate-800">{page.timeRange}</div>
                    </div>
                  ) : null}
                  {entity.location ? (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-sky-700 mt-0.5" />
                      <div className="text-slate-800">{entity.location}</div>
                    </div>
                  ) : null}
                  {entity.category ? (
                    <div className="flex items-start gap-3">
                      <Tag className="w-4 h-4 text-sky-700 mt-0.5" />
                      <div className="text-slate-800">{getCategoryLabel(entity.category)}</div>
                    </div>
                  ) : null}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Badge variant={entity.isVerified ? 'verified' : 'info'}>
                    {entity.isVerified ? 'Проверено' : 'Не проверено'}
                  </Badge>
                  <Badge variant="info">{entity.isFree ? 'Бесплатно' : 'Платно'}</Badge>
                </div>

                {entity.officialUrl ? (
                  <div className="mt-5">
                    <a
                      href={entity.officialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-sky-700 hover:text-sky-800"
                    >
                      Официальный сайт <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                ) : null}

                <div className="mt-5 space-y-2">
                  <EventRegisterButton eventId={entity.id} eventTitle={entity.title} />
                  <p className="text-xs text-slate-500">
                    Registration is runtime-backed. Availability depends on auth and current event policy.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

