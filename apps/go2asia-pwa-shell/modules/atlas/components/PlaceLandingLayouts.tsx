'use client';

import { Chip } from '@go2asia/ui';
import { MapPin, Phone, Instagram, Globe, Star, Clock } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import type { PlaceKind } from './PlacePreviewCard';

export interface PlaceLandingData {
  id: string;
  slug: string;
  name: string;
  kind: PlaceKind;
  description: string | null; // Short teaser only
  heroImage: string | null;
  photos: string[];
  cityName: string | null;
  countryName: string | null;
  category: string | null;
  tags: string[];
  address: string | null;
  priceLevel: string | null;
  instagram: string | null;
  website: string | null;
  phone: string | null;
  googleMapsUrl: string | null;
  latitude: string | null;
  longitude: string | null;
  overviewMarkdown: string | null; // Markdown from content_blocks (place tabs) - ONLY source
}

const EMPTY_TEXT = 'Данные уточняются редакцией.';

// Parse markdown sections (## Title) into structured sections
function parseMarkdownSections(markdown: string | null): Map<string, string> {
  const sections = new Map<string, string>();
  if (!markdown) return sections;

  const lines = markdown.split(/\r?\n/);
  let currentSection: string | null = null;
  let currentContent: string[] = [];

  for (const line of lines) {
    const headerMatch = line.match(/^##\s+(.+)$/);
    if (headerMatch) {
      // Save previous section
      if (currentSection && currentContent.length > 0) {
        sections.set(currentSection, currentContent.join('\n').trim());
      }
      // Start new section
      currentSection = headerMatch[1]?.trim() ?? null;
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(line);
    }
  }

  // Save last section
  if (currentSection && currentContent.length > 0) {
    sections.set(currentSection, currentContent.join('\n').trim());
  }

  return sections;
}

// Map section titles to section keys for business/showplace
function getSectionKey(title: string, kind: PlaceKind): string | null {
  const lower = title.toLowerCase();
  if (kind === 'business') {
    if (lower.includes('почему') || lower.includes('зайти')) return 'whyVisit';
    if (lower.includes('попробовать') || lower.includes('что попробовать')) return 'mustTry';
    if (lower.includes('цена') || lower.includes('цены')) return 'prices';
    if (lower.includes('добраться') || lower.includes('как добраться')) return 'howToGet';
    if (lower.includes('сервис') || lower.includes('коммуникация')) return 'service';
    if (lower.includes('нюанс') || lower.includes('совет')) return 'nuances';
    if (lower.includes('ценность') || lower.includes('локальн')) return 'localValue';
    if (lower.includes('фото') || lower.includes('сфотографировать')) return 'photoTips';
  } else {
    if (lower.includes('почему') || lower.includes('важно')) return 'whyImportant';
    if (lower.includes('структура') || lower.includes('комплекс')) return 'structure';
    if (lower.includes('билет') || lower.includes('посещение')) return 'tickets';
    if (lower.includes('время') || lower.includes('заложить')) return 'timeAllocation';
    if (lower.includes('фото') || lower.includes('точки')) return 'photoSpots';
    if (lower.includes('совет') || lower.includes('практическ')) return 'practicalTips';
    if (lower.includes('истори') || lower.includes('справка')) return 'history';
    if (lower.includes('рядом') || lower.includes('посмотреть')) return 'nearby';
    if (lower.includes('факт') || lower.includes('интересный')) return 'interestingFact';
  }
  return null;
}

function Hero({
  data,
  gradient,
  subtitle,
  showMeta = true,
  titleClassName = 'text-xl font-semibold',
  subtitleClassName = 'text-sm text-white/80',
}: {
  data: PlaceLandingData;
  gradient: string;
  subtitle: string;
  showMeta?: boolean;
  titleClassName?: string;
  subtitleClassName?: string;
}) {
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
      <div className={`relative h-44 ${gradient}`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 text-white">
          <div className={titleClassName}>{data.name}</div>
          {subtitle && <div className={subtitleClassName}>{subtitle}</div>}
          {showMeta ? (
            <div className="text-xs text-white/80 mt-1">
              {data.cityName ?? ''}{data.cityName && data.countryName ? ', ' : ''}{data.countryName ?? ''}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function PhotoStrip({ data }: { data: PlaceLandingData }) {
  // No pexels fallback - use only API data or show placeholder
  const images = data.photos.slice(0, 5);
  if (images.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-100 p-3 shadow-sm">
        <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-400 text-sm">
          Фото отсутствует
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-3 px-3 snap-x snap-mandatory">
        {images.map((src, idx) => (
          <div key={idx} className="flex-shrink-0 w-[271px] snap-start">
            <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100">
              <img src={src} alt={`${data.name} - фото ${idx + 1}`} className="w-full h-full object-cover" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TagRow({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Chip key={tag} size="sm" className="bg-slate-100 text-slate-700">
          {tag}
        </Chip>
      ))}
    </div>
  );
}

function MetaRow({ data }: { data: PlaceLandingData }) {
  const coords = data.latitude && data.longitude ? `${data.latitude}, ${data.longitude}` : '—';
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600">
      <div className="space-y-2">
        {data.address && (
          <div className="flex items-start gap-2">
            <MapPin size={14} className="text-slate-400 mt-0.5" />
            <span className="whitespace-pre-line">{data.address}</span>
          </div>
        )}
        {data.googleMapsUrl && (
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-slate-400" />
            <a className="text-sky-700 hover:underline" href={data.googleMapsUrl} target="_blank" rel="noreferrer">
              Google Maps
            </a>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-slate-400" />
          <span>Координаты: {coords}</span>
        </div>
        {data.instagram && (
          <div className="flex items-center gap-2">
            <Instagram size={14} className="text-slate-400" />
            <span>{data.instagram}</span>
          </div>
        )}
        {data.website && (
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-slate-400" />
            <a className="text-sky-700 hover:underline" href={data.website} target="_blank" rel="noreferrer">
              {data.website}
            </a>
          </div>
        )}
        {data.phone && (
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-slate-400" />
            <span>{data.phone}</span>
          </div>
        )}
        {data.priceLevel && (
          <div className="flex items-center gap-2">
            <span className="text-slate-400">💰</span>
            <span>{data.priceLevel}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionCard({
  title,
  tone,
  markdown,
  fallback,
}: {
  title: string;
  tone: 'red' | 'amber' | 'emerald' | 'sky' | 'purple';
  markdown: string | null;
  fallback: string;
}) {
  const toneMap: Record<typeof tone, string> = {
    red: 'bg-rose-50 border-rose-200',
    amber: 'bg-amber-50 border-amber-200',
    emerald: 'bg-emerald-50 border-emerald-200',
    sky: 'bg-sky-50 border-sky-200',
    purple: 'bg-purple-50 border-purple-200',
  };
  return (
    <div className={`rounded-2xl border p-4 ${toneMap[tone]}`}>
      <div className="font-semibold text-slate-900 mb-2">{title}</div>
      <div className="text-sm text-slate-700">
        {markdown ? (
          <MarkdownRenderer markdown={markdown} className="prose prose-sm max-w-none prose-slate" />
        ) : (
          <div className="text-slate-500 italic">{fallback}</div>
        )}
      </div>
    </div>
  );
}

export function PlaceLandingLayoutBusiness({ data }: { data: PlaceLandingData }) {
  const sections = parseMarkdownSections(data.overviewMarkdown);

  return (
    <div className="mx-auto w-full max-w-[864px] space-y-4">
      <Hero
        data={data}
        gradient="bg-gradient-to-r from-amber-700 to-orange-500"
        subtitle={data.category ?? 'Заведение'}
        showMeta={false}
        titleClassName="text-4xl font-bold mb-2"
        subtitleClassName="text-lg opacity-90"
      />
      <PhotoStrip data={data} />
      <TagRow tags={data.tags} />
      <MetaRow data={data} />
      {/* Business sections - order matters */}
      <SectionCard title="Почему стоит зайти?" tone="amber" markdown={sections.get('Почему стоит зайти?') ?? null} fallback={EMPTY_TEXT} />
      <SectionCard title="Что попробовать обязательно" tone="sky" markdown={sections.get('Что попробовать обязательно') ?? null} fallback={EMPTY_TEXT} />
      <SectionCard title="Цены" tone="emerald" markdown={sections.get('Цены') ?? null} fallback={EMPTY_TEXT} />
      <SectionCard title="Как добраться" tone="amber" markdown={sections.get('Как добраться') ?? null} fallback={EMPTY_TEXT} />
      <SectionCard title="Коммуникация & сервис" tone="sky" markdown={sections.get('Коммуникация & сервис') ?? null} fallback={EMPTY_TEXT} />
      <SectionCard title="Полезные нюансы" tone="amber" markdown={sections.get('Полезные нюансы') ?? null} fallback={EMPTY_TEXT} />
      <SectionCard title="Локальная ценность" tone="emerald" markdown={sections.get('Локальная ценность') ?? null} fallback={EMPTY_TEXT} />
      <SectionCard title="Что стоит сфотографировать" tone="sky" markdown={sections.get('Что стоит сфотографировать') ?? null} fallback={EMPTY_TEXT} />
    </div>
  );
}

export function PlaceLandingLayoutShowplace({ data }: { data: PlaceLandingData }) {
  const sections = parseMarkdownSections(data.overviewMarkdown);
  const unescoTag = data.tags.includes('unesco') || data.tags.includes('UNESCO');

  return (
    <div className="mx-auto w-full max-w-[864px] space-y-4">
      <Hero
        data={data}
        gradient="bg-gradient-to-r from-rose-600 to-amber-500"
        subtitle={unescoTag ? 'UNESCO World Heritage' : data.category ?? 'Достопримечательность'}
        showMeta={true}
        titleClassName="text-4xl font-bold mb-2"
        subtitleClassName="text-lg opacity-90"
      />
      <PhotoStrip data={data} />
      <TagRow tags={data.tags} />
      <MetaRow data={data} />
      {/* Showplace sections - order matters */}
      <SectionCard title="Почему это важно?" tone="red" markdown={sections.get('Почему это важно?') ?? null} fallback={EMPTY_TEXT} />
      <SectionCard title="Структура комплекса" tone="amber" markdown={sections.get('Структура комплекса') ?? null} fallback={EMPTY_TEXT} />
      <SectionCard title="Билеты и посещение" tone="sky" markdown={sections.get('Билеты и посещение') ?? null} fallback={EMPTY_TEXT} />
      <SectionCard title="Сколько времени заложить?" tone="emerald" markdown={sections.get('Сколько времени заложить?') ?? null} fallback={EMPTY_TEXT} />
      <SectionCard title="Лучшие точки для фото" tone="amber" markdown={sections.get('Лучшие точки для фото') ?? null} fallback={EMPTY_TEXT} />
      <SectionCard title="Практические советы" tone="sky" markdown={sections.get('Практические советы') ?? null} fallback={EMPTY_TEXT} />
      <SectionCard title="Историческая справка" tone="red" markdown={sections.get('Историческая справка') ?? null} fallback={EMPTY_TEXT} />
      <SectionCard title="Что посмотреть рядом" tone="emerald" markdown={sections.get('Что посмотреть рядом') ?? null} fallback={EMPTY_TEXT} />
      <SectionCard title="Интересный факт" tone="amber" markdown={sections.get('Интересный факт') ?? null} fallback={EMPTY_TEXT} />
    </div>
  );
}
