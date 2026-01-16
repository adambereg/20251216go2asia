import type { ReactNode } from 'react';

function mdToHtml(markdown: string): string {
  return markdown.replace(/\n/g, '<br />');
}

export function AtlasContentSection({
  title,
  markdown,
  children,
}: {
  title: string;
  markdown: string;
  children?: ReactNode;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="px-4 py-4 text-sm text-slate-700 space-y-3">
          <div dangerouslySetInnerHTML={{ __html: mdToHtml(markdown) }} />
          {children}
        </div>
      </section>
    </div>
  );
}
