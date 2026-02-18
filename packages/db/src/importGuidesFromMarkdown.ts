/**
 * Import Guide Engine v1 content from Markdown canon into Neon.
 *
 * Sources:
 * - canonical: content/atlas/guides/*.md
 * - legacy (deprecated): content/atlas/guide/*.md
 *
 * Rules:
 * - Idempotent: UPSERT by guides.slug, (guide_id, tab_key), and stable block IDs per (slug, tab_key).
 * - Server truth: compute is_empty for imported blocks.
 * - Safe by default: does not overwrite section order/is_enabled if already configured by admin.
 * - Dry-run supported.
 *
 * Usage:
 *   pnpm -C packages/db db:import:guides-md -- --dry-run
 *   pnpm -C packages/db db:import:guides-md -- --apply
 *   pnpm -C packages/db db:import:guides-md -- --apply --only-slug first-week-in-bangkok
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { Client } from 'pg';

type GuideType =
  | 'strategic'
  | 'comparative'
  | 'route'
  | 'niche'
  | 'event'
  | 'housing'
  | 'visa'
  | 'work_infra'
  | 'climate'
  | 'theme';

type GuideStatus = 'draft' | 'published' | 'verified' | 'archived';

type TabKey =
  | 'overview'
  | 'compare'
  | 'locations'
  | 'route'
  | 'map'
  | 'practice'
  | 'events'
  | 'places'
  | 'audience'
  | 'scenarios'
  | 'costs'
  | 'risks'
  | 'checklists'
  | 'links'
  | 'faq'
  | 'experience';

const TAB_LABELS: Record<TabKey, string> = {
  overview: 'Обзор',
  compare: 'Контекст и сравнение',
  locations: 'Локации',
  route: 'Маршрут / План',
  map: 'Карта',
  practice: 'Практика',
  events: 'События',
  places: 'Места',
  audience: 'Для кого',
  scenarios: 'Сценарии',
  costs: 'Стоимость и бюджеты',
  risks: 'Риски и подводные камни',
  checklists: 'Чек-листы',
  links: 'Ссылки',
  faq: 'FAQ',
  experience: 'Опыт',
};

const DEFAULT_TABS_BY_TYPE: Partial<Record<GuideType, TabKey[]>> = {
  route: ['overview', 'route', 'map', 'places', 'practice', 'events', 'faq', 'experience'],
  visa: ['overview', 'compare', 'practice', 'faq', 'experience'],
  comparative: ['overview', 'compare', 'locations', 'practice', 'faq', 'experience'],
  event: ['overview', 'events', 'map', 'locations', 'practice', 'faq', 'experience'],
  niche: ['overview', 'audience', 'compare', 'locations', 'practice', 'places', 'events', 'faq', 'experience'],
  housing: ['overview', 'locations', 'places', 'practice', 'faq', 'experience'],
  work_infra: ['overview', 'compare', 'locations', 'places', 'practice', 'events', 'faq', 'experience'],
  strategic: ['overview', 'compare', 'locations', 'practice', 'events', 'places', 'faq', 'experience'],
  climate: ['overview', 'compare', 'locations', 'practice', 'faq', 'experience'],
  theme: ['overview', 'compare', 'practice', 'scenarios', 'costs', 'risks', 'checklists', 'links', 'faq'],
};

function getDatabaseUrl(): string {
  const url = process.env.STAGING_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) throw new Error('Missing STAGING_DATABASE_URL or DATABASE_URL');
  const env = (process.env.ENVIRONMENT ?? 'dev').toLowerCase();
  if (env === 'production') throw new Error('Refusing to run import with ENVIRONMENT=production');
  return url;
}

function extractFrontmatter(markdown: string): { yaml: string | null; body: string } {
  const lines = markdown.split(/\r?\n/);
  let first = -1;
  let second = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      first = i;
      break;
    }
  }
  if (first === -1) return { yaml: null, body: markdown };
  for (let i = first + 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      second = i;
      break;
    }
  }
  if (second === -1) return { yaml: null, body: markdown };
  return {
    yaml: lines.slice(first + 1, second).join('\n'),
    body: lines.slice(second + 1).join('\n'),
  };
}

function parseInlineArray(value: string): string[] | null {
  const v = value.trim();
  if (!v.startsWith('[') || !v.endsWith(']')) return null;
  const inner = v.slice(1, -1).trim();
  if (!inner) return [];
  return inner
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => {
      const s = x.trim();
      if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) return s.slice(1, -1);
      return s;
    });
}

function stripInlineYamlComment(raw: string): string {
  const v = raw.trim();
  if (!v) return v;
  // Keep quoted strings intact (allow # inside quotes).
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) return v;
  return v.replace(/\s+#.*$/, '').trim();
}

function unquoteYamlScalar(raw: string): string {
  let v = stripInlineYamlComment(raw);
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
  return v.trim();
}

function parseYamlGuideMeta(yaml: string): Record<string, string | string[]> {
  const out: Record<string, string | string[]> = {};
  const lines = yaml.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i] ?? '';
    const line = raw.replace(/\t/g, '  ');
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (/^\s+/.test(line)) continue; // top-level keys only

    const m = line.match(/^([A-Za-z0-9_]+)\s*:\s*(.*)\s*$/);
    if (!m) continue;
    const key = m[1]!;
    const tail = (m[2] ?? '').trim();

    // YAML list (e.g. tags:\n  - a\n  - b)
    if (!tail) {
      const items: string[] = [];
      for (let j = i + 1; j < lines.length; j++) {
        const l = (lines[j] ?? '').replace(/\t/g, '  ');
        if (!l.trim() || l.trim().startsWith('#')) continue;
        if (/^[A-Za-z0-9_]+\s*:/.test(l)) {
          i = j - 1;
          break;
        }
        const li = l.match(/^\s*-\s*(.+?)\s*$/);
        if (li) items.push(unquoteYamlScalar(li[1] ?? ''));
      }
      if (items.length > 0) out[key] = items.filter(Boolean);
      continue;
    }

    const val = unquoteYamlScalar(tail);

    const arr = parseInlineArray(val);
    if (arr) {
      out[key] = arr;
      continue;
    }

    out[key] = val;
  }
  return out;
}

function parseTabs(body: string): Map<TabKey, string> {
  const lines = body.split(/\r?\n/);
  const out = new Map<TabKey, string>();
  let current: TabKey | null = null;
  let buf: string[] = [];

  const flush = () => {
    if (!current) return;
    out.set(current, buf.join('\n').trim());
  };

  for (const line of lines) {
    const m = line.match(/^\s*<!--\s*tab:\s*([a-z_]+)\s*-->\s*$/i);
    if (m) {
      flush();
      const key = (m[1] ?? '').trim() as TabKey;
      current = key;
      buf = [];
      continue;
    }
    if (current) buf.push(line);
  }
  flush();
  return out;
}

function sha256(text: string): string {
  return createHash('sha256').update(text).digest('hex');
}

function uuidFromSha1(input: string): string {
  // Deterministic UUID-like string (v5-ish) from sha1.
  // NOTE: This is NOT a cryptographic collision guarantee; it is a practical deterministic ID
  // generator for idempotent imports. We also run an in-process collision check in dry-run/apply.
  const hex = createHash('sha1').update(input).digest('hex'); // 40 chars
  const bytes = hex.slice(0, 32); // 16 bytes
  const b = bytes.split('');
  // Set version (5) and variant bits: just adjust hex nibbles conservatively.
  b[12] = '5';
  b[16] = 'a'; // 10xx
  const h = b.join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`;
}

function computeIsEmptyRichText(markdown: string): boolean {
  return markdown.trim().length < 20;
}

function listMdFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.toLowerCase().endsWith('.md'))
    .map((d) => join(dir, d.name));
}

type ImportGuide = {
  sourcePath: string;
  title: string;
  slug: string;
  guideType: GuideType;
  status: GuideStatus;
  tags: string[];
  countryIds: string[];
  cityIds: string[];
  heroR2Key: string | null;
  updatedAt: string | null;
  summary: string | null;
  tabs: Map<TabKey, string>;
};

function asGuideType(v: unknown): GuideType {
  const s = typeof v === 'string' ? v : '';
  const ok: GuideType[] = [
    'strategic',
    'comparative',
    'route',
    'niche',
    'event',
    'housing',
    'visa',
    'work_infra',
    'climate',
    'theme',
  ];
  return (ok.includes(s as GuideType) ? (s as GuideType) : 'strategic');
}

function asGuideStatus(v: unknown): GuideStatus {
  const s = typeof v === 'string' ? v : '';
  const ok: GuideStatus[] = ['draft', 'published', 'verified', 'archived'];
  return (ok.includes(s as GuideStatus) ? (s as GuideStatus) : 'draft');
}

function pickStringArray(meta: Record<string, string | string[]>, key: string): string[] {
  const v = meta[key];
  if (Array.isArray(v)) return v.filter((x) => typeof x === 'string' && x.length > 0);
  return [];
}

function pickString(meta: Record<string, string | string[]>, key: string): string | null {
  const v = meta[key];
  return typeof v === 'string' && v.trim().length > 0 ? v.trim() : null;
}

function parseUpdatedAt(metaValue: string | null): string | null {
  const v = (metaValue ?? '').trim();
  if (!v) return null;
  // Accept YYYY-MM-DD or ISO; store as ISO string for pg driver.
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return `${v}T00:00:00.000Z`;
  const d = new Date(v);
  return Number.isFinite(d.getTime()) ? d.toISOString() : null;
}

function markdownToPlainText(md: string): string {
  let s = md ?? '';
  s = s.replace(/<!--[\s\S]*?-->/g, ' ');
  s = s.replace(/```[\s\S]*?```/g, ' ');
  s = s.replace(/`([^`]+)`/g, '$1');
  s = s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  s = s.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1');
  s = s.replace(/[#>*_~=-]+/g, ' ');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

function computeSummaryFromOverview(tabs: Map<TabKey, string>): string | null {
  const md = (tabs.get('overview') ?? '').trim();
  if (!md) return null;
  const text = markdownToPlainText(md);
  if (!text) return null;
  const max = 180;
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const safe = cut.replace(/\s+\S*$/, '').trim();
  return safe.length >= 80 ? safe : cut.trim();
}

function loadGuideFromFile(path: string): ImportGuide | null {
  const raw = readFileSync(path, 'utf8');
  const { yaml, body } = extractFrontmatter(raw);
  if (!yaml) return null;
  const meta = parseYamlGuideMeta(yaml);

  const title = pickString(meta, 'title');
  const slug = pickString(meta, 'slug');
  const guideType = asGuideType(pickString(meta, 'guide_type'));
  const status = asGuideStatus(pickString(meta, 'status'));
  const countryIds = pickStringArray(meta, 'country_ids');
  const cityIds = pickStringArray(meta, 'city_ids');
  const tags = pickStringArray(meta, 'tags');
  const heroR2Key = pickString(meta, 'hero_r2_key');
  const updatedAt = parseUpdatedAt(pickString(meta, 'updated_at'));

  if (!title || !slug) return null;

  const tabs = parseTabs(body);

  // Editorial summary should be preferred (SEO/CTR), with markdown overview as fallback.
  const summaryFromMeta = pickString(meta, 'summary');
  const summary = summaryFromMeta || computeSummaryFromOverview(tabs);
  return {
    sourcePath: path,
    title,
    slug,
    guideType,
    status,
    tags,
    countryIds,
    cityIds,
    heroR2Key,
    updatedAt,
    summary,
    tabs,
  };
}

function computeSectionPlan(g: ImportGuide): Array<{ tabKey: TabKey; title: string; orderIndex: number; hasMarkdown: boolean }> {
  const defaults = DEFAULT_TABS_BY_TYPE[g.guideType] ?? ['overview'];
  const seen = new Set<TabKey>();
  const out: Array<{ tabKey: TabKey; title: string; orderIndex: number; hasMarkdown: boolean }> = [];

  let i = 0;
  for (const t of defaults) {
    seen.add(t);
    out.push({ tabKey: t, title: TAB_LABELS[t], orderIndex: i * 10, hasMarkdown: g.tabs.has(t) });
    i++;
  }

  // Any extra tabs from markdown (if any)
  for (const t of g.tabs.keys()) {
    if (seen.has(t)) continue;
    if (!TAB_LABELS[t]) continue;
    out.push({ tabKey: t, title: TAB_LABELS[t], orderIndex: i * 10, hasMarkdown: true });
    i++;
  }

  return out;
}

async function upsertGuide(client: Client, g: ImportGuide): Promise<string> {
  const id = `guide_${g.slug}`;
  const res = await client.query<{ id: string }>(
    `
    INSERT INTO guides (
      id, slug, title, summary, guide_type, status,
      tags, country_ids, city_ids,
      hero_r2_key, hero_url,
      published_at, created_at, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5::atlas_guide_type, $6::atlas_guide_status,
      $7::text[], $8::text[], $9::text[],
      $10, NULL,
      CASE WHEN $6 IN ('published','verified') THEN now() ELSE NULL END,
      now(), COALESCE($11::timestamptz, now())
    )
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      guide_type = EXCLUDED.guide_type,
      status = EXCLUDED.status,
      summary = COALESCE(EXCLUDED.summary, guides.summary),
      tags = EXCLUDED.tags,
      country_ids = EXCLUDED.country_ids,
      city_ids = EXCLUDED.city_ids,
      hero_r2_key = EXCLUDED.hero_r2_key,
      updated_at = EXCLUDED.updated_at
    RETURNING id
    `,
    [id, g.slug, g.title, g.summary, g.guideType, g.status, g.tags, g.countryIds, g.cityIds, g.heroR2Key, g.updatedAt]
  );
  return res.rows[0]!.id;
}

async function upsertSection(
  client: Client,
  guideId: string,
  s: { tabKey: TabKey; title: string; orderIndex: number }
): Promise<string> {
  const res = await client.query<{ id: string }>(
    `
    INSERT INTO guide_sections (
      guide_id, tab_key, title, order_index, is_enabled, created_at, updated_at
    ) VALUES (
      $1, $2::atlas_guide_tab_key, $3, $4, true, now(), now()
    )
    ON CONFLICT (guide_id, tab_key) DO UPDATE SET
      -- do not override admin configuration (order_index/is_enabled) on re-import
      title = COALESCE(guide_sections.title, EXCLUDED.title),
      updated_at = now()
    RETURNING id
    `,
    [guideId, s.tabKey, s.title, s.orderIndex]
  );
  return res.rows[0]!.id;
}

async function upsertRichTextBlock(client: Client, args: { slug: string; tabKey: TabKey; sectionId: string; markdown: string; sourcePath: string }) {
  const blockId = uuidFromSha1(`md-import:${args.slug}:${args.tabKey}:rich_text:0`);
  const mdHash = sha256(args.markdown);
  const payload = {
    markdown: args.markdown,
    source: 'md-import',
    mdPath: args.sourcePath,
    mdSha256: mdHash,
  };
  const isEmpty = computeIsEmptyRichText(args.markdown);
  await client.query(
    `
    INSERT INTO guide_blocks (
      id, section_id, block_type, order_index, payload, is_empty, created_at, updated_at
    ) VALUES (
      $1::uuid, $2::uuid, 'rich_text'::atlas_guide_block_type, 0, $3::jsonb, $4::boolean, now(), now()
    )
    ON CONFLICT (id) DO UPDATE SET
      payload = EXCLUDED.payload,
      is_empty = EXCLUDED.is_empty,
      updated_at = now()
    `,
    [blockId, args.sectionId, JSON.stringify(payload), isEmpty]
  );
}

function parseArgs(argv: string[]) {
  const flags = new Set(argv);
  const get = (name: string) => {
    const idx = argv.indexOf(name);
    if (idx === -1) return null;
    return argv[idx + 1] ?? null;
  };
  return {
    dryRun: flags.has('--dry-run'),
    apply: flags.has('--apply'),
    onlySlug: get('--only-slug'),
    themesOnly: flags.has('--themes-only'),
    includeThemes: flags.has('--include-themes'),
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const dryRun = args.dryRun || !args.apply;

  const repoRoot = resolve(__dirname, '..', '..', '..');
  const canonicalDir = join(repoRoot, 'content', 'atlas', 'guides');
  const legacyDir = join(repoRoot, 'content', 'atlas', 'guide');
  const themesDir = join(repoRoot, 'content', 'atlas', 'themes');

  const canonicalFiles = args.themesOnly ? [] : listMdFiles(canonicalDir);
  const legacyFiles = args.themesOnly ? [] : listMdFiles(legacyDir);
  const themesFiles = args.themesOnly || args.includeThemes ? listMdFiles(themesDir) : [];

  // Load canonical first, then legacy (alias) excluding duplicates by slug.
  const loaded: ImportGuide[] = [];
  const slugsSeen = new Set<string>();
  const loadAll = (paths: string[]) => {
    for (const p of paths) {
      const g = loadGuideFromFile(p);
      if (!g) continue;
      if (args.onlySlug && g.slug !== args.onlySlug) continue;
      if (slugsSeen.has(g.slug)) continue;
      slugsSeen.add(g.slug);
      loaded.push(g);
    }
  };

  loadAll(canonicalFiles);
  loadAll(legacyFiles);
  loadAll(themesFiles);

  // Validate cluster:* tags for themes (MVP: stored in tags for flexibility).
  const knownClusters = new Set([
    'cluster:legalization',
    'cluster:finance',
    'cluster:family',
    'cluster:lifestyle',
    'cluster:mobility',
  ]);
  const invalidClusters = loaded
    .filter((g) => g.guideType === 'theme')
    .map((g) => {
      const clusterTags = (g.tags ?? []).filter((t) => typeof t === 'string' && t.startsWith('cluster:'));
      const unique = Array.from(new Set(clusterTags));
      const ok = unique.length === 1 && knownClusters.has(unique[0] ?? '');
      return ok ? null : { slug: g.slug, clusterTags: unique, tags: g.tags ?? [] };
    })
    .filter(Boolean) as Array<{ slug: string; clusterTags: string[]; tags: string[] }>;

  if (invalidClusters.length > 0) {
    // eslint-disable-next-line no-console
    console.warn(
      `[md-import] WARN: theme cluster tag invalid (expected exactly 1 of ${Array.from(knownClusters).join(', ')}).`
    );
    // eslint-disable-next-line no-console
    for (const it of invalidClusters.slice(0, 30)) console.warn('[md-import] invalid theme cluster:', it);
  }

  const planGuides = loaded.length;
  const planSections = loaded.reduce((acc, g) => acc + computeSectionPlan(g).length, 0);
  const planBlocks = loaded.reduce((acc, g) => {
    let n = 0;
    for (const s of computeSectionPlan(g)) if (s.hasMarkdown) n++;
    return acc + n;
  }, 0);

  // Collision check for deterministic block IDs (fail fast).
  const blockIds = new Set<string>();
  const collisions: string[] = [];
  for (const g of loaded) {
    for (const s of computeSectionPlan(g)) {
      if (!s.hasMarkdown) continue;
      const id = uuidFromSha1(`md-import:${g.slug}:${s.tabKey}:rich_text:0`);
      if (blockIds.has(id)) collisions.push(id);
      blockIds.add(id);
    }
  }
  if (collisions.length > 0) {
    // eslint-disable-next-line no-console
    console.error('[md-import] ERROR: deterministic blockId collision(s):', collisions.slice(0, 10));
    process.exitCode = 1;
    return;
  }

  // eslint-disable-next-line no-console
  console.log('[md-import] source canonical:', canonicalDir, 'files:', canonicalFiles.length);
  // eslint-disable-next-line no-console
  console.log('[md-import] source legacy (deprecated):', legacyDir, 'files:', legacyFiles.length);
  // eslint-disable-next-line no-console
  console.log('[md-import] source themes:', themesDir, 'files:', themesFiles.length);
  // eslint-disable-next-line no-console
  console.log('[md-import] selected guides:', planGuides, 'sections(upsert):', planSections, 'blocks(upsert):', planBlocks);

  if (dryRun) {
    // eslint-disable-next-line no-console
    console.log('[md-import] DRY-RUN: no DB writes. Use --apply to execute.');
    return;
  }

  const client = new Client({ connectionString: getDatabaseUrl() });
  await client.connect();
  try {
    await client.query('BEGIN');

    for (const g of loaded) {
      const guideId = await upsertGuide(client, g);
      const sections = computeSectionPlan(g);

      for (const s of sections) {
        const sectionId = await upsertSection(client, guideId, s);
        if (!s.hasMarkdown) continue;
        const md = g.tabs.get(s.tabKey) ?? '';
        await upsertRichTextBlock(client, { slug: g.slug, tabKey: s.tabKey, sectionId, markdown: md, sourcePath: g.sourcePath });
      }
    }

    await client.query('COMMIT');
    // eslint-disable-next-line no-console
    console.log('[md-import] APPLY OK');
  } catch (e) {
    await client.query('ROLLBACK');
    // eslint-disable-next-line no-console
    console.error('[md-import] APPLY FAILED', e instanceof Error ? e.message : e);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error('[md-import] FATAL', e instanceof Error ? e.message : e);
  process.exitCode = 1;
});

