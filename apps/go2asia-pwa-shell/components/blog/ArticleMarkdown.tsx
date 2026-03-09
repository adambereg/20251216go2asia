import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type BlockListVariant = 'ordered' | 'bulleted';

function parseInlineJsonArray(raw: string): unknown[] | null {
  const s = raw.trim();
  if (!s.startsWith('[') || !s.endsWith(']')) return null;
  try {
    const parsed = JSON.parse(s);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function parseBlockYaml(input: string): Record<string, unknown> {
  const lines = input.split(/\r?\n/).map((l) => l.trimEnd());
  const out: Record<string, unknown> = {};
  let currentKey: 'items' | 'headers' | 'rows' | null = null;
  const items: string[] = [];
  const headers: string[] = [];
  const rows: string[][] = [];

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    const kv = line.match(/^([A-Za-z0-9_]+)\s*:\s*(.*)\s*$/);
    if (kv) {
      const key = kv[1] as string;
      const tail = (kv[2] ?? '').trim();

      if (key === 'items' || key === 'headers' || key === 'rows') {
        currentKey = key;
        if (tail) {
          const arr = parseInlineJsonArray(tail);
          if (arr && key === 'headers') headers.push(...arr.filter((x): x is string => typeof x === 'string'));
        }
        continue;
      }

      currentKey = null;
      if (tail) {
        const v = tail.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
        out[key] = v;
      } else {
        out[key] = '';
      }
      continue;
    }

    if (line.startsWith('- ')) {
      const tail = line.slice(2).trim();
      if (currentKey === 'items') {
        items.push(tail.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1'));
      } else if (currentKey === 'headers') {
        const a = parseInlineJsonArray(tail);
        if (a) headers.push(...a.filter((x): x is string => typeof x === 'string'));
        else headers.push(tail);
      } else if (currentKey === 'rows') {
        const a = parseInlineJsonArray(tail);
        if (a) rows.push(a.map((x) => (typeof x === 'string' ? x : String(x))));
      }
    }
  }

  if (items.length > 0) out.items = items;
  if (headers.length > 0) out.headers = headers;
  if (rows.length > 0) out.rows = rows;
  return out;
}

function BlockRenderer({ yaml }: { yaml: string }) {
  const parsed = parseBlockYaml(yaml);
  const type = String(parsed.type ?? '').trim().toLowerCase();

  if (type === 'list') {
    const variant = String(parsed.variant ?? 'bulleted').trim().toLowerCase() as BlockListVariant;
    const items = Array.isArray(parsed.items) ? (parsed.items as unknown[]).filter((x): x is string => typeof x === 'string') : [];
    if (items.length === 0) return null;
    if (variant === 'ordered') {
      return (
        <ol className="my-6 pl-6 list-decimal text-slate-700 space-y-1">
          {items.map((it, idx) => (
            <li key={idx}>{it}</li>
          ))}
        </ol>
      );
    }
    return (
      <ul className="my-6 pl-6 list-disc text-slate-700 space-y-1">
        {items.map((it, idx) => (
          <li key={idx}>{it}</li>
        ))}
      </ul>
    );
  }

  if (type === 'table') {
    const headers = Array.isArray(parsed.headers)
      ? (parsed.headers as unknown[]).filter((x): x is string => typeof x === 'string')
      : [];
    const rows = Array.isArray(parsed.rows)
      ? (parsed.rows as unknown[]).filter((r): r is unknown[] => Array.isArray(r)).map((r) => r.map((x) => String(x)))
      : [];
    if (headers.length === 0 && rows.length === 0) return null;
    return (
      <div className="my-8 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          {headers.length > 0 && (
            <thead className="bg-slate-50">
              <tr>
                {headers.map((h, idx) => (
                  <th key={idx} className="text-left font-semibold text-slate-700 px-4 py-3 border-b border-slate-200">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map((r, ridx) => (
              <tr key={ridx} className="odd:bg-white even:bg-slate-50/40">
                {r.map((cell, cidx) => (
                  <td key={cidx} className="px-4 py-3 text-slate-700 border-b border-slate-100 whitespace-nowrap">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (type === 'related') {
    // Related blocks are resolved by the page-level API (not rendered from markdown).
    return null;
  }

  // Fallback: render as code block
  return (
    <pre className="my-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-4 text-xs">
      <code>{yaml}</code>
    </pre>
  );
}

export function ArticleMarkdown({ markdown }: { markdown: string }) {
  return (
    <div
      className="prose prose-slate max-w-none
        prose-headings:text-slate-900
        prose-h1:text-3xl prose-h1:font-bold prose-h1:tracking-tight prose-h1:mb-6
        prose-h2:text-[20px] sm:prose-h2:text-[22px] prose-h2:font-semibold prose-h2:mt-12 prose-h2:mb-3
        prose-h3:text-[18px] prose-h3:font-semibold prose-h3:mt-10 prose-h3:mb-3
        prose-p:text-slate-700 prose-p:leading-7 prose-p:my-5
        prose-ul:my-4 prose-ol:my-4 prose-li:my-1
        prose-blockquote:my-6 prose-blockquote:border-l-sky-300 prose-blockquote:bg-sky-50/40 prose-blockquote:py-3 prose-blockquote:px-4 prose-blockquote:rounded-lg prose-blockquote:text-slate-700
        prose-img:rounded-2xl prose-img:shadow-sm prose-img:my-8
        prose-a:text-sky-600 prose-a:no-underline hover:prose-a:underline
        prose-strong:text-slate-900 prose-strong:font-semibold"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          code: (props: any) => {
            const lang = String(props?.className ?? '').replace('language-', '');
            const text = String(props?.children ?? '').replace(/\n$/, '');
            const inline = Boolean(props?.inline);
            if (!inline && lang === 'block') return <BlockRenderer yaml={text} />;
            if (inline) return <code className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-800">{text}</code>;
            return (
              <pre className="my-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-4 text-xs">
                <code>{text}</code>
              </pre>
            );
          },
          pre: ({ children }) => <>{children}</>,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}

