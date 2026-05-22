import type { ReactNode } from 'react';

type ProjectionChipTone = 'neutral' | 'source' | 'preview' | 'inquiry' | 'activity';

const toneClasses: Record<ProjectionChipTone, string> = {
  neutral: 'border-slate-200 bg-slate-50 text-slate-700',
  source: 'border-slate-200 bg-slate-50 text-slate-700',
  preview: 'border-amber-200 bg-amber-50 text-amber-800',
  inquiry: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  activity: 'border-sky-200 bg-sky-50 text-sky-800',
};

interface ProjectionChipProps {
  children: ReactNode;
  tone?: ProjectionChipTone;
  className?: string;
}

export function ProjectionChip({ children, tone = 'neutral', className = '' }: ProjectionChipProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
