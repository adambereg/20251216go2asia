'use client';

import Link from 'next/link';
import { Card, CardContent, Chip } from '@go2asia/ui';
import { MarkdownRenderer } from './MarkdownRenderer';

export type PlaceKind = 'showplace' | 'business';

export interface PlacePreviewData {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  heroImage: string | null;
  cityName: string | null;
  kind: PlaceKind;
  category: string | null;
  tags: string[];
}

export function PlacePreviewCard({ data }: { data: PlacePreviewData }) {
  const gradient = data.kind === 'showplace' ? 'from-emerald-500 to-sky-500' : 'from-amber-500 to-orange-500';
  const image = data.heroImage;

  return (
    <Link href={`/atlas/places/${data.slug}`}>
      <Card hover className="h-full overflow-hidden p-0 !border-0">
        {image ? (
          <div className="relative w-full h-44 overflow-hidden">
            <img src={image} alt={data.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <h3 className="text-lg font-semibold text-white">{data.name}</h3>
            </div>
          </div>
        ) : (
          <div className={`relative w-full h-44 bg-gradient-to-br ${gradient}`}>
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-3 left-4 right-4">
              <h3 className="text-lg font-semibold text-white">{data.name}</h3>
            </div>
          </div>
        )}
        <CardContent className="p-5 space-y-3">
          <div className="flex flex-wrap gap-2">
            {data.category && (
              <Chip size="sm" className="bg-slate-100 text-slate-700">
                {data.category}
              </Chip>
            )}
            {data.cityName && (
              <Chip size="sm" className="bg-slate-100 text-slate-700">
                {data.cityName}
              </Chip>
            )}
          </div>
          {data.description && (
            <div className="text-sm text-slate-600 line-clamp-3">
              <MarkdownRenderer markdown={data.description} />
            </div>
          )}
          {data.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.tags.slice(0, 3).map((tag) => (
                <Chip key={tag} size="sm" className="bg-slate-100 text-slate-700">
                  {tag}
                </Chip>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

