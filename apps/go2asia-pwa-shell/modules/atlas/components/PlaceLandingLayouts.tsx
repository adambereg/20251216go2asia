'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Chip } from '@go2asia/ui';
import { MapPin, Phone, Instagram, Globe, Star, Clock } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { SectionContentRenderer } from './SectionContentRenderer';
import { ImageLightbox } from './ImageLightbox';
import { buildTagLink, buildCategoryLink } from '../utils/navigation';
import { getCategoryKeyFromTags, categoriesV1 } from '@go2asia/atlas-taxonomy';
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
  lat: string | null; // Preferred: lat/lng from DB
  lng: string | null;
  latitude: string | null; // Legacy: deprecated, kept for backward compatibility
  longitude: string | null;
  overviewMarkdown: string | null; // Markdown from content_blocks (place tabs) - ONLY source
}

const EMPTY_TEXT = 'Данные уточняются редакцией.';

function normalizeHeaderTitle(title: string): string {
  return title
    .replace(/^[\p{Extended_Pictographic}\p{Emoji_Presentation}\p{Emoji}\s]+/gu, '')
    .replace(/[:：]+$/g, '')
    .trim();
}

// Parse markdown sections (## Title) into structured sections by key
function parseMarkdownSections(markdown: string | null, kind: PlaceKind): Map<string, string> {
  const sections = new Map<string, string>();
  if (!markdown) return sections;

  const lines = markdown.split(/\r?\n/);
  let currentSectionKey: string | null = null;
  let currentContent: string[] = [];

  const flush = () => {
    if (currentSectionKey && currentContent.length > 0) {
      sections.set(currentSectionKey, currentContent.join('\n').trim());
    }
  };

  for (const line of lines) {
    const headerMatch = line.match(/^##\s+(.+)$/);
    if (headerMatch) {
      flush();
      const rawTitle = headerMatch[1]?.trim() ?? '';
      const cleanedTitle = normalizeHeaderTitle(rawTitle);
      currentSectionKey = getSectionKey(cleanedTitle, kind);
      currentContent = [];
      continue;
    }
    if (currentSectionKey) {
      currentContent.push(line);
    }
  }

  flush();
  return sections;
}

// Map section titles to section keys for business/showplace
// Supports synonyms from content templates (Philippines-places.md format)
function getSectionKey(title: string, kind: PlaceKind): string | null {
  const lower = title.toLowerCase();
  if (kind === 'business') {
    if (lower.includes('почему') || lower.includes('зайти')) return 'whyVisit';
    if (lower.includes('попробовать') || lower.includes('что попробовать') || lower.includes('что заказать')) return 'mustTry';
    if (lower.includes('цена') || lower.includes('цены') || lower.includes('стоимость')) return 'prices';
    if (lower.includes('добраться') || lower.includes('как добраться')) return 'howToGet';
    if (lower.includes('сервис') || lower.includes('коммуникация') || lower.includes('язык') || lower.includes('wi-fi')) return 'service';
    if (lower.includes('нюанс') || lower.includes('совет') || lower.includes('важно')) return 'nuances';
    if (lower.includes('ценность') || lower.includes('локальн') || lower.includes('контекст')) return 'localValue';
    if (lower.includes('фото') || lower.includes('сфотографировать')) return 'photoTips';
  } else {
    // Showplace sections with expanded synonyms
    if (lower.includes('почему') || lower.includes('важно') || lower.includes('почему это важно')) return 'whyImportant';
    // Structure: supports "Что увидеть", "Что внутри", "Что посмотреть", "Структура комплекса"
    if (lower.includes('структура') || lower.includes('комплекс') || 
        lower.includes('что увидеть') || lower.includes('что внутри') || 
        lower.includes('что посмотреть')) return 'structure';
    if (lower.includes('билет') || lower.includes('посещение')) return 'tickets';
    // Time allocation: supports "Когда лучше посетить", "Сколько времени заложить"
    if (lower.includes('время') || lower.includes('заложить') || 
        lower.includes('когда лучше') || lower.includes('сколько времени')) return 'timeAllocation';
    // Photo spots: supports "Лучшие точки для фото", "Что сфотографировать"
    if (lower.includes('фото') || lower.includes('точки') || 
        lower.includes('сфотографировать') || lower.includes('точки для фото')) return 'photoSpots';
    // Practical tips: supports "Активности", "Практические советы"
    if (lower.includes('совет') || lower.includes('практическ') || 
        lower.includes('активности')) return 'practicalTips';
    if (lower.includes('истори') || lower.includes('справка')) return 'history';
    if (lower.includes('рядом') || lower.includes('посмотреть рядом')) return 'nearby';
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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
  // Include heroImage if available, then photos
  const allImages = data.heroImage 
    ? [data.heroImage, ...data.photos]
    : data.photos;
  const images = allImages.slice(0, 5);
  
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
    <>
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-3 px-3 snap-x snap-mandatory">
          {images.map((src, idx) => (
            <div 
              key={`${src}-${idx}`} 
              className="flex-shrink-0 w-[271px] snap-start cursor-pointer"
              onClick={() => {
                setLightboxIndex(idx);
                setLightboxOpen(true);
              }}
            >
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 hover:opacity-90 transition-opacity">
                <img
                  src={src}
                  alt={`${data.name} - фото ${idx + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Hide broken images
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <ImageLightbox
        images={allImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(index) => setLightboxIndex(index)}
      />
    </>
  );
}

function TagRow({ tags, kind }: { tags: string[]; kind: PlaceKind }) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const tagLink = buildTagLink('atlas', tag, 'places', { kind });
        return (
          <Link key={tag} href={tagLink}>
            <Chip 
              size="sm" 
              className="bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
            >
              {tag}
            </Chip>
          </Link>
        );
      })}
    </div>
  );
}

function CategoryBadge({ categoryKey }: { categoryKey: string | null }) {
  if (!categoryKey) return null;
  
  const category = categoriesV1.find((c) => c.key === categoryKey);
  if (!category) return null;
  
  const categoryLink = buildCategoryLink('atlas', categoryKey, 'places');
  
  return (
    <Link href={categoryLink}>
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-100 text-sky-700 hover:bg-sky-200 hover:text-sky-900 transition-colors cursor-pointer border border-sky-200">
        <span className="text-xs font-medium">{category.label}</span>
      </div>
    </Link>
  );
}

function MetaRow({ data }: { data: PlaceLandingData }) {
  // Prefer lat/lng (new), fallback to latitude/longitude (legacy) for backward compatibility
  const coords = (data.lat && data.lng) 
    ? `${data.lat}, ${data.lng}` 
    : (data.latitude && data.longitude 
      ? `${data.latitude}, ${data.longitude}` 
      : '—');
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
  sectionKey,
}: {
  title: string;
  tone: 'red' | 'amber' | 'emerald' | 'sky' | 'purple';
  markdown: string | null;
  fallback: string | null;
  sectionKey?: string;
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
      <div className="font-semibold text-slate-900 mb-3">{title}</div>
      <div className="text-sm text-slate-700">
        {markdown ? (
          <SectionContentRenderer markdown={markdown} sectionKey={sectionKey} />
        ) : fallback ? (
          <div className="text-slate-500 italic">{fallback}</div>
        ) : null}
      </div>
    </div>
  );
}

export function PlaceLandingLayoutBusiness({ data }: { data: PlaceLandingData }) {
  const hasOverview = Boolean(data.overviewMarkdown?.trim());
  const sections = parseMarkdownSections(data.overviewMarkdown, data.kind);
  const sectionDefs: Array<{ key: string; title: string; tone: 'red' | 'amber' | 'emerald' | 'sky' | 'purple' }> = [
    { key: 'whyVisit', title: 'Почему стоит зайти?', tone: 'amber' },
    { key: 'mustTry', title: 'Что попробовать обязательно', tone: 'sky' },
    { key: 'prices', title: 'Цены', tone: 'emerald' },
    { key: 'howToGet', title: 'Как добраться', tone: 'amber' },
    { key: 'service', title: 'Коммуникация & сервис', tone: 'sky' },
    { key: 'nuances', title: 'Полезные нюансы', tone: 'amber' },
    { key: 'localValue', title: 'Локальная ценность', tone: 'emerald' },
    { key: 'photoTips', title: 'Что стоит сфотографировать', tone: 'sky' },
  ];

  return (
    <div className="mx-auto w-full max-w-[864px] space-y-4">
      <Hero
        data={data}
        gradient="bg-gradient-to-r from-amber-700 to-orange-500"
        subtitle={data.category ?? 'Заведение'}
        showMeta={true}
        titleClassName="text-4xl font-bold mb-2"
        subtitleClassName="text-lg opacity-90"
      />
      <PhotoStrip data={data} />
      <CategoryBadge categoryKey={getCategoryKeyFromTags(data.tags)} />
      <TagRow tags={data.tags} kind={data.kind} />
      <MetaRow data={data} />
      {sections.size === 0 && hasOverview ? (
        <SectionCard title="Описание" tone="sky" markdown={data.overviewMarkdown} fallback={null} />
      ) : (
        sectionDefs.map((section) => {
          const content = sections.get(section.key) ?? null;
          if (hasOverview && !content) return null;
          return (
            <SectionCard
              key={section.key}
              title={section.title}
              tone={section.tone}
              markdown={content}
              fallback={hasOverview ? null : EMPTY_TEXT}
              sectionKey={section.key}
            />
          );
        })
      )}
    </div>
  );
}

export function PlaceLandingLayoutShowplace({ data }: { data: PlaceLandingData }) {
  const hasOverview = Boolean(data.overviewMarkdown?.trim());
  const sections = parseMarkdownSections(data.overviewMarkdown, data.kind);
  const sectionDefs: Array<{ key: string; title: string; tone: 'red' | 'amber' | 'emerald' | 'sky' | 'purple' }> = [
    { key: 'whyImportant', title: 'Почему это важно?', tone: 'red' },
    { key: 'structure', title: 'Структура комплекса', tone: 'amber' },
    { key: 'tickets', title: 'Билеты и посещение', tone: 'sky' },
    { key: 'timeAllocation', title: 'Сколько времени заложить?', tone: 'emerald' },
    { key: 'photoSpots', title: 'Лучшие точки для фото', tone: 'amber' },
    { key: 'practicalTips', title: 'Практические советы', tone: 'sky' },
    { key: 'history', title: 'Историческая справка', tone: 'red' },
    { key: 'nearby', title: 'Что посмотреть рядом', tone: 'emerald' },
    { key: 'interestingFact', title: 'Интересный факт', tone: 'amber' },
  ];
  const unescoTag = data.tags.includes('unesco') || data.tags.includes('UNESCO');

  return (
    <div className="mx-auto w-full max-w-[864px] space-y-4">
      {/* Note: Gradient differs from PlacePreviewCard (emerald-sky) - this is intentional:
          PreviewCard uses emerald-sky for compact view, LandingLayout uses rose-amber for detailed view */}
      <Hero
        data={data}
        gradient="bg-gradient-to-r from-rose-600 to-amber-500"
        subtitle={unescoTag ? 'UNESCO World Heritage' : data.category ?? 'Достопримечательность'}
        showMeta={true}
        titleClassName="text-4xl font-bold mb-2"
        subtitleClassName="text-lg opacity-90"
      />
      <PhotoStrip data={data} />
      <CategoryBadge categoryKey={getCategoryKeyFromTags(data.tags)} />
      <TagRow tags={data.tags} kind={data.kind} />
      <MetaRow data={data} />
      {sections.size === 0 && hasOverview ? (
        <SectionCard title="Описание" tone="sky" markdown={data.overviewMarkdown} fallback={null} />
      ) : (
        sectionDefs.map((section) => {
          const content = sections.get(section.key) ?? null;
          if (hasOverview && !content) return null;
          return (
            <SectionCard
              key={section.key}
              title={section.title}
              tone={section.tone}
              markdown={content}
              fallback={hasOverview ? null : EMPTY_TEXT}
              sectionKey={section.key}
            />
          );
        })
      )}
    </div>
  );
}
