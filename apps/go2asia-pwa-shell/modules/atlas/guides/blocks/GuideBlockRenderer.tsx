'use client';

import { Chip } from '@go2asia/ui';
import { MarkdownRenderer } from '../../components/MarkdownRenderer';
import type { GuideBlock } from '../types';

function isStringArray(x: unknown): x is string[] {
  return Array.isArray(x) && x.every((v) => typeof v === 'string');
}

function getString(obj: Record<string, unknown>, key: string): string | null {
  const v = obj[key];
  return typeof v === 'string' ? v : null;
}

export function GuideBlockRenderer({ block }: { block: GuideBlock }) {
  const payload = block.payload ?? {};
  const isDev = process.env.NODE_ENV !== 'production';

  switch (block.blockType) {
    case 'divider':
      return <hr className="border-slate-200" />;

    case 'rich_text': {
      const markdown = typeof payload.markdown === 'string' ? payload.markdown : '';
      if (!markdown) return null;
      return <MarkdownRenderer markdown={markdown} className="prose prose-slate max-w-none" />;
    }

    case 'callout': {
      const variant = (getString(payload, 'variant') ?? 'info').toLowerCase();
      const title = getString(payload, 'title');
      const markdown = getString(payload, 'markdown') ?? getString(payload, 'body') ?? '';
      const styles =
        variant === 'warn'
          ? 'border-amber-200 bg-amber-50 text-amber-900'
          : variant === 'note'
            ? 'border-slate-200 bg-slate-50 text-slate-900'
            : 'border-sky-200 bg-sky-50 text-sky-900';
      return (
        <div className={`rounded-xl border px-4 py-3 text-sm ${styles}`}>
          {title ? <div className="font-semibold mb-1">{title}</div> : null}
          {markdown ? <MarkdownRenderer markdown={markdown} className="prose prose-sm max-w-none" /> : null}
        </div>
      );
    }

    case 'bullets':
    case 'checklist':
    case 'steps':
    case 'timeline': {
      const items =
        (Array.isArray(payload.items) ? payload.items : null) ??
        (Array.isArray(payload.steps) ? payload.steps : null) ??
        null;

      if (!items || items.length === 0) return null;

      return (
        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
          {items.map((it: any, idx: number) => {
            const text = typeof it === 'string' ? it : typeof it?.text === 'string' ? it.text : JSON.stringify(it);
            return <li key={idx}>{text}</li>;
          })}
        </ul>
      );
    }

    case 'key_facts': {
      const facts = Array.isArray(payload.facts) ? payload.facts : Array.isArray(payload.items) ? payload.items : null;
      if (!facts || facts.length === 0) return null;
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {facts.map((f: any, idx: number) => {
            const label = typeof f?.label === 'string' ? f.label : typeof f?.title === 'string' ? f.title : null;
            const value = typeof f?.value === 'string' ? f.value : typeof f?.text === 'string' ? f.text : null;
            return (
              <div key={idx} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                {label ? <div className="text-xs font-semibold text-slate-500">{label}</div> : null}
                {value ? <div className="text-sm text-slate-900 mt-1">{value}</div> : null}
              </div>
            );
          })}
        </div>
      );
    }

    case 'media': {
      const urls = isStringArray(payload.urls)
        ? payload.urls
        : isStringArray(payload.images)
          ? payload.images
          : Array.isArray(payload.items)
            ? payload.items
                .map((it: any) => (typeof it?.url === 'string' ? it.url : null))
                .filter(Boolean)
            : [];
      if (!urls || urls.length === 0) return null;
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {urls.map((url: string, idx: number) => (
            <img
              key={idx}
              src={url}
              alt=""
              className="w-full rounded-xl border border-slate-200 object-cover"
              loading="lazy"
            />
          ))}
        </div>
      );
    }

    case 'table': {
      const columns = isStringArray(payload.columns) ? payload.columns : null;
      const rows = Array.isArray(payload.rows) ? payload.rows : null;
      if (!rows || rows.length === 0) return null;
      return (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            {columns ? (
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  {columns.map((c, idx) => (
                    <th key={idx} className="px-3 py-2 text-left font-semibold">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
            ) : null}
            <tbody>
              {rows.map((r: any, rIdx: number) => {
                const cells = Array.isArray(r) ? r : typeof r === 'object' && r ? Object.values(r) : [String(r)];
                return (
                  <tr key={rIdx} className="border-t border-slate-100">
                    {cells.map((cell: any, cIdx: number) => (
                      <td key={cIdx} className="px-3 py-2 align-top text-slate-700">
                        {typeof cell === 'string' ? cell : JSON.stringify(cell)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }

    case 'faq': {
      const items = Array.isArray(payload.items) ? payload.items : Array.isArray(payload.qa) ? payload.qa : null;
      if (!items || items.length === 0) return null;
      return (
        <div className="space-y-3">
          {items.map((it: any, idx: number) => {
            const q = typeof it?.q === 'string' ? it.q : typeof it?.question === 'string' ? it.question : `Вопрос ${idx + 1}`;
            const a = typeof it?.a === 'string' ? it.a : typeof it?.answer === 'string' ? it.answer : '';
            return (
              <details key={idx} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <summary className="cursor-pointer font-semibold text-slate-900">{q}</summary>
                {a ? <div className="mt-2 text-sm text-slate-700">{a}</div> : null}
              </details>
            );
          })}
        </div>
      );
    }

    case 'map_config': {
      const center = typeof payload.center === 'object' && payload.center ? (payload.center as any) : null;
      const lat = typeof center?.lat === 'number' ? center.lat : null;
      const lng = typeof center?.lng === 'number' ? center.lng : null;
      return (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
          Карта (v1 placeholder): центр {lat ?? '—'}, {lng ?? '—'}.
        </div>
      );
    }

    case 'poi_refs':
    case 'city_refs':
    case 'related_guides': {
      const ids =
        isStringArray(payload.place_ids) ? payload.place_ids :
        isStringArray(payload.city_ids) ? payload.city_ids :
        isStringArray(payload.guide_slugs) ? payload.guide_slugs :
        isStringArray(payload.guide_ids) ? payload.guide_ids :
        isStringArray(payload.ids) ? payload.ids :
        [];
      if (!ids || ids.length === 0) return null;
      return (
        <div className="flex flex-wrap gap-2">
          {ids.map((id, idx) => (
            <Chip key={`${id}-${idx}`} size="sm" className="bg-slate-100 text-slate-700">
              {id}
            </Chip>
          ))}
        </div>
      );
    }

    case 'day_plan':
    case 'scorecard':
    default: {
      if (!isDev) return null;
      return (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-xs text-slate-700">
          Unsupported block type: <span className="font-mono">{block.blockType}</span>
        </div>
      );
    }
  }
}

