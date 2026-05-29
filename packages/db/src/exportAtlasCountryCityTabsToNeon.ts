/**
 * Export Atlas Country/City tabs from content/atlas/** (Markdown canon v1) to Neon `content_blocks`.
 *
 * Output per country folder:
 * - exports/neon/<countryFolder>/content_blocks.sql (updates a marked section only; preserves existing place blocks)
 * - exports/neon/<countryFolder>/PARSE_REPORT.md (updates a marked section only; preserves existing places parse report)
 *
 * Notes:
 * - UI fetches tabs via /v1/content/{countries|cities}/:idOrSlug/tabs?lang=ru&tabKey=...
 * - DB contract: content_blocks(entity_type, entity_id, tab_key, lang='ru', body_markdown non-empty)
 * - For cities, entity_id must match real Neon cities.id (often short codes used by places pipeline).
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import { Client } from 'pg';

type EntityType = 'country' | 'city';

type ExportBlock = {
  entityType: EntityType;
  entityId: string;
  tabKey: string;
  lang: 'ru';
  title: string | null;
  bodyMarkdown: string;
  source: 'seed';
  inputFile: string;
  sectionTitle: string;
};

type ParseWarning =
  | { code: 'YAML_MISSING'; file: string; details?: string }
  | { code: 'YAML_INVALID'; file: string; details?: string }
  | { code: 'META_MISSING_REQUIRED'; file: string; details: string }
  | { code: 'UNKNOWN_SECTION'; file: string; entityType: EntityType; sectionTitle: string }
  | { code: 'NEON_DB_DISABLED'; file: string; details: string }
  | { code: 'CITY_ID_UNRESOLVED'; file: string; details: string }
  | { code: 'CITY_ID_FUZZY_MATCH'; file: string; details: string };

type ParseStats = {
  processedFiles: number;
  blocksCreated: number;
  byEntityType: Record<EntityType, number>;
  byTabKey: Record<string, number>;
  skippedMissingOrEmpty: Array<{ file: string; entityType: EntityType; tabKey: string; reason: 'missing' | 'empty' }>;
  ignoredSections: Array<{ file: string; entityType: EntityType; sectionTitle: string }>;
  resolvedCities: Array<{ file: string; countryId: string; mdId: string; slug: string; title: string; resolvedCityId: string; strategy: string }>;
  unresolvedCities: Array<{ file: string; countryId: string; mdId: string; slug: string; title: string; note: string }>;
  resolverMode: 'neon' | 'fallback';
  warnings: ParseWarning[];
};

const BEGIN_SQL_MARKER = '-- BEGIN ATLAS_COUNTRY_CITY_TABS';
const END_SQL_MARKER = '-- END ATLAS_COUNTRY_CITY_TABS';

const BEGIN_REPORT_MARKER = '<!-- BEGIN ATLAS_COUNTRY_CITY_TABS_REPORT -->';
const END_REPORT_MARKER = '<!-- END ATLAS_COUNTRY_CITY_TABS_REPORT -->';

// Canon section title -> tab_key mapping (RU)
const COUNTRY_SECTION_TO_TABKEY: Record<string, string> = {
  'обзор': 'overview',
  'фотогалерея': 'gallery',
  'карта': 'map',
  'погода и климат': 'weather',
  'история': 'history',
  'география': 'geography',
  'культура': 'culture',
  'проживание': 'living',
  'визы': 'visas',
  'бизнес': 'business',
  'разговорник': 'phrasebook',
  'отзывы экспатов': 'reviews',
  'калькулятор стоимости': 'calculator',
};

// Hard denylist: these are list-tabs and must NEVER be stored in content_blocks for countries.
const DENY_COUNTRY_TAB_KEYS = new Set<string>(['cities', 'places']);

const CITY_SECTION_TO_TABKEY: Record<string, string> = {
  'обзор': 'overview',
  'районы': 'districts',
  'проживание': 'accommodation',
  'еда и кафе': 'food',
  'транспорт': 'transport',
  'погода и сезонность': 'weather',
  'шопинг': 'shopping',
  'ночная жизнь': 'nightlife',
  'гайды': 'guides',
  'практическая информация': 'tips',
  'отзывы': 'reviews',
  'цены и бюджет': 'budget',
};

// Sections present in canon, but must NOT be exported to content_blocks (lists).
const IGNORE_SECTIONS_COUNTRY = new Set(['города', 'достопримечательности', 'места']);
const IGNORE_SECTIONS_CITY = new Set(['достопримечательности', 'места']);

/**
 * City ID overrides to match Neon `cities.id` (aligned with places pipeline exports).
 * Key: country folder (content/atlas/<folder>), value: map from canon city id/slug -> Neon city id
 */
const CITY_ID_OVERRIDES_BY_COUNTRY: Record<string, Record<string, string>> = {
  vietnam: {
    hanoi: 'han',
    'ho-chi-minh-city': 'sgn',
    'da-nang': 'dad',
    'hoi-an': 'hoi',
    hue: 'hue',
    dalat: 'dla',
    'nha-trang': 'ntr',
    'phu-quoc': 'phu',
  },
  thailand: {
    bangkok: 'bkk',
    'chiang-mai': 'cnx',
    phuket: 'phk',
    pattaya: 'pty',
    krabi: 'kbi',
    'hua-hin': 'hhn',
    samui: 'usm',
  },
  laos: {
    vientiane: 'vte',
    'luang-prabang': 'lpq',
    'vang-vieng': 'vvg',
    pakse: 'pkz',
    savannakhet: 'svk',
  },
  malaysia: {
    'kuala-lumpur': 'kll',
    penang: 'png',
    langkawi: 'lgk',
    malacca: 'mkz',
    'kota-kinabalu': 'bki',
    // johor-bahru: (no override; keep canon id)
  },
  indonesia: {
    denpasar: 'bali', // places pipeline uses Bali='bali'
    jakarta: 'jkt',
    yogyakarta: 'yog',
    // medan/surabaya: unknown in places pipeline; keep canon id
  },
  japan: {
    tokyo: 'tok',
    osaka: 'osa',
    fukuoka: 'fuk',
  },
  'south-korea': {
    seoul: 'seo',
    busan: 'pus',
    jeju: 'cju',
  },
  singapore: {
    singapore: 'sgp',
  },
  philippines: {
    manila: 'mnl',
    cebu: 'ceb',
    palawan: 'pps',
    bohol: 'tag',
    siargao: 'srg',
    dumaguete: 'dumaguete',
  },
  cambodia: {
    'siem-reap': 'rep',
    'phnom-penh': 'pnh',
    battambang: 'bat',
    sihanoukville: 'kps',
    kampot: 'kmp',
    kep: 'kep',
  },
};

type ResolveCityInput = {
  countryId: string;
  mdId: string;
  slug?: string;
  title?: string;
};

type ResolveCityResult =
  | { ok: true; cityId: string; strategy: 'id' | 'slug' | 'title' | 'fuzzy'; fuzzyNote?: string }
  | { ok: false; reason: string };

function parseDotEnvLike(content: string): Record<string, string> {
  const out: Record<string, string> = {};
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (key) out[key] = val;
  }
  return out;
}

function maybeLoadEnvLocal(repoRoot: string) {
  const envLocal = join(repoRoot, '.env.local');
  if (!existsSync(envLocal)) return;
  const content = readFileSync(envLocal, 'utf-8');
  const vars = parseDotEnvLike(content);
  for (const [k, v] of Object.entries(vars)) {
    if (!process.env[k] && v) process.env[k] = v;
  }
}

async function maybeCreateNeonClient(repoRoot: string): Promise<
  | { ok: true; client: Client; urlKind: 'staging' | 'default' }
  | { ok: false; reason: string }
> {
  maybeLoadEnvLocal(repoRoot);
  const url = (process.env.STAGING_DATABASE_URL || process.env.DATABASE_URL || '').trim();
  if (!url) return { ok: false, reason: 'Missing STAGING_DATABASE_URL/DATABASE_URL (env or .env.local)' };
  const urlKind: 'staging' | 'default' = process.env.STAGING_DATABASE_URL ? 'staging' : 'default';
  const client = new Client({ connectionString: url });
  try {
    await client.connect();
    return { ok: true, client, urlKind };
  } catch (e) {
    try {
      await client.end();
    } catch {
      // ignore
    }
    return { ok: false, reason: `Failed to connect to Neon: ${e instanceof Error ? e.message : String(e)}` };
  }
}

async function resolveCityId(
  client: Client,
  input: ResolveCityInput
): Promise<ResolveCityResult> {
  const countryId = input.countryId.trim();
  const mdId = input.mdId.trim();
  const slug = (input.slug ?? '').trim();
  const title = (input.title ?? '').trim();

  if (!countryId || !mdId) return { ok: false, reason: 'Missing countryId or mdId' };

  // (1) exact by id (already matches)
  {
    const res = await client.query<{ id: string }>(
      'SELECT id::text as id FROM cities WHERE country_id = $1 AND id::text = $2 LIMIT 1',
      [countryId, mdId]
    );
    const found = res.rows[0]?.id;
    if (found) return { ok: true, cityId: found, strategy: 'id' };
  }

  // (2) exact by slug
  if (slug) {
    const res = await client.query<{ id: string }>(
      'SELECT id::text as id FROM cities WHERE country_id = $1 AND slug = $2 LIMIT 1',
      [countryId, slug]
    );
    const found = res.rows[0]?.id;
    if (found) return { ok: true, cityId: found, strategy: 'slug' };
  }

  // (3) exact by name (case-insensitive)
  if (title) {
    const res = await client.query<{ id: string }>(
      'SELECT id::text as id FROM cities WHERE country_id = $1 AND lower(name) = lower($2) LIMIT 1',
      [countryId, title]
    );
    const found = res.rows[0]?.id;
    if (found) return { ok: true, cityId: found, strategy: 'title' };
  }

  // (4) fuzzy ILIKE by title (cautious: accept only single match)
  if (title && title.length >= 4) {
    const pattern = `%${title}%`;
    const res = await client.query<{ id: string; name: string }>(
      'SELECT id::text as id, name FROM cities WHERE country_id = $1 AND name ILIKE $2 ORDER BY name LIMIT 2',
      [countryId, pattern]
    );
    if (res.rows.length === 1) {
      return { ok: true, cityId: res.rows[0]!.id, strategy: 'fuzzy', fuzzyNote: `name="${res.rows[0]!.name}"` };
    }
    if (res.rows.length > 1) {
      return { ok: false, reason: `Fuzzy match is ambiguous (>=2 matches) for title="${title}"` };
    }
  }

  return { ok: false, reason: 'No match by id/slug/title/fuzzy' };
}

function countryFolderToCountryIdFallback(countryFolder: string): string | null {
  const map: Record<string, string> = {
    vietnam: 'vn',
    thailand: 'th',
    laos: 'la',
    malaysia: 'my',
    indonesia: 'id',
    japan: 'jp',
    'south-korea': 'kr',
    singapore: 'sg',
    philippines: 'ph',
    cambodia: 'kh',
  };
  return map[countryFolder] ?? null;
}

function walkFiles(rootDir: string): string[] {
  const out: string[] = [];
  const entries = readdirSync(rootDir, { withFileTypes: true });
  for (const e of entries) {
    const p = join(rootDir, e.name);
    if (e.isDirectory()) out.push(...walkFiles(p));
    else if (e.isFile()) out.push(p);
  }
  return out;
}

function isCountryFile(p: string): boolean {
  return /^country-.+\.md$/i.test(basename(p));
}

function isCityFile(p: string): boolean {
  return /^city-.+\.md$/i.test(basename(p));
}

function normalizeTitle(s: string): string {
  return s
    .toLowerCase()
    .replace(/\u00A0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractFrontmatter(markdown: string): { yaml: string | null; withoutFrontmatter: string } {
  const lines = markdown.split(/\r?\n/);
  let first = -1;
  let second = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      first = i;
      break;
    }
  }
  if (first === -1) return { yaml: null, withoutFrontmatter: markdown };
  for (let i = first + 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      second = i;
      break;
    }
  }
  if (second === -1) return { yaml: null, withoutFrontmatter: markdown };

  const yaml = lines.slice(first + 1, second).join('\n');
  const without = [...lines.slice(0, first), ...lines.slice(second + 1)].join('\n');
  return { yaml, withoutFrontmatter: without };
}

/**
 * Minimal YAML parser for top-level scalar keys (we only need entity/id/slug/title/country_id).
 * Ignores nested objects and lists.
 */
function parseYamlTopLevelScalars(yaml: string): Record<string, string> {
  const out: Record<string, string> = {};
  const lines = yaml.split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.replace(/\t/g, '  ');
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (/^\s+/.test(line)) continue; // only top-level keys
    const m = line.match(/^([A-Za-z0-9_]+)\s*:\s*(.*)\s*$/);
    if (!m) continue;
    const key = m[1]!;
    let val = m[2] ?? '';
    // stop on complex values
    if (val === '' || val === '|' || val === '>' || val.endsWith(':')) continue;
    // strip quotes
    val = val.trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function parseSections(markdownWithoutFrontmatter: string): Array<{ title: string; body: string }> {
  const lines = markdownWithoutFrontmatter.split(/\r?\n/);
  const sections: Array<{ title: string; body: string }> = [];
  let currentTitle: string | null = null;
  let buf: string[] = [];

  const flush = () => {
    if (!currentTitle) return;
    const body = buf.join('\n').trim();
    sections.push({ title: currentTitle, body });
  };

  for (const line of lines) {
    const m = line.match(/^##\s+(.+)\s*$/);
    if (m) {
      flush();
      currentTitle = (m[1] ?? '').trim();
      buf = [];
      continue;
    }
    if (currentTitle) buf.push(line);
  }
  flush();
  return sections;
}

function escapeSqlString(value: string): string {
  return value.replace(/'/g, "''");
}

function spliceMarkedBlock(original: string, begin: string, end: string, replacementBlock: string): string {
  const beginIdx = original.indexOf(begin);
  const endIdx = original.indexOf(end);

  if (beginIdx !== -1 && endIdx !== -1 && endIdx > beginIdx) {
    const before = original.slice(0, beginIdx).trimEnd();
    const after = original.slice(endIdx + end.length).trimStart();
    return `${before}\n\n${replacementBlock}\n\n${after}\n`;
  }

  // No existing block; append to end.
  const trimmed = original.trimEnd();
  return `${trimmed}\n\n${replacementBlock}\n`;
}

function renderSqlBlock(blocks: ExportBlock[], generatedAtIso: string): string {
  const lines: string[] = [];
  lines.push(BEGIN_SQL_MARKER);
  lines.push(`-- Generated: ${generatedAtIso}`);
  lines.push(`-- Blocks: ${blocks.length}`);
  lines.push('');

  if (blocks.length === 0) {
    lines.push('-- (no country/city tab blocks exported)');
    lines.push(END_SQL_MARKER);
    return lines.join('\n');
  }

  for (const b of blocks) {
    lines.push(`-- ${b.entityType}/${b.entityId} tab=${b.tabKey} (${b.sectionTitle}) from ${b.inputFile}`);
    lines.push(
      [
        'INSERT INTO content_blocks (',
        '  entity_type, entity_id, tab_key, lang, title, body_markdown, source, created_at, updated_at',
        ') VALUES (',
        `  '${b.entityType}',`,
        `  '${escapeSqlString(b.entityId)}',`,
        `  '${escapeSqlString(b.tabKey)}',`,
        `  'ru',`,
        b.title ? `  '${escapeSqlString(b.title)}',` : '  NULL,',
        `  '${escapeSqlString(b.bodyMarkdown)}',`,
        `  '${b.source}',`,
        '  NOW(),',
        '  NOW()',
        ')',
        'ON CONFLICT (entity_type, entity_id, tab_key, lang) DO UPDATE SET',
        '  title = EXCLUDED.title,',
        '  body_markdown = EXCLUDED.body_markdown,',
        "  source = EXCLUDED.source,",
        '  updated_at = NOW();',
        '',
      ].join('\n')
    );
  }

  lines.push(END_SQL_MARKER);
  return lines.join('\n');
}

function renderReportBlock(countryFolder: string, stats: ParseStats, generatedAtIso: string): string {
  const warnings =
    stats.warnings.length === 0
      ? '- (нет)'
      : stats.warnings
          .map((w) => {
            if (w.code === 'UNKNOWN_SECTION') {
              return `- UNKNOWN_SECTION: file=${w.file} entity=${w.entityType} title="${w.sectionTitle}"`;
            }
            if (w.code === 'META_MISSING_REQUIRED') {
              return `- META_MISSING_REQUIRED: file=${w.file} ${w.details}`;
            }
            return `- ${w.code}: file=${w.file}${w.details ? ` ${w.details}` : ''}`;
          })
          .join('\n');

  const skipped =
    stats.skippedMissingOrEmpty.length === 0
      ? '- (нет)'
      : stats.skippedMissingOrEmpty
          .map((s) => `- ${s.entityType}/${s.tabKey}: ${s.reason} (${s.file})`)
          .join('\n');

  const ignored =
    stats.ignoredSections.length === 0
      ? '- (нет)'
      : stats.ignoredSections
          .map((i) => `- IGNORED_SECTION_LIST: ${i.entityType} "${i.sectionTitle}" (${i.file})`)
          .join('\n');

  const byTabKey = Object.keys(stats.byTabKey).length
    ? Object.entries(stats.byTabKey)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `- ${k}: ${v}`)
        .join('\n')
    : '- (нет)';

  const resolved =
    stats.resolvedCities.length === 0
      ? '- (нет)'
      : stats.resolvedCities
          .map(
            (r) =>
              `- OK RESOLVE city: ${r.countryId}/${r.mdId}/${r.slug || '(no-slug)'} -> ${r.resolvedCityId} (strategy=${r.strategy})`
          )
          .join('\n');

  const unresolved =
    stats.unresolvedCities.length === 0
      ? '- (нет)'
      : stats.unresolvedCities
          .map(
            (u) =>
              `- ${u.note}: ${u.countryId}/${u.mdId}/${u.slug || '(no-slug)'} (${u.file})`
          )
          .join('\n');

  return [
    BEGIN_REPORT_MARKER,
    `## Atlas Country/City Tabs export (content_blocks)`,
    ``,
    `**Generated:** ${generatedAtIso}`,
    `**Country folder:** \`${countryFolder}\``,
    `**Resolver mode:** \`${stats.resolverMode}\``,
    ``,
    `- **Files processed**: ${stats.processedFiles}`,
    `- **Blocks created**: ${stats.blocksCreated}`,
    `- **By entity_type**: country=${stats.byEntityType.country ?? 0}, city=${stats.byEntityType.city ?? 0}`,
    ``,
    `### Resolved city IDs`,
    resolved,
    ``,
    `### Unresolved city IDs`,
    unresolved,
    ``,
    `### Distribution by tab_key`,
    byTabKey,
    ``,
    `### Skipped (missing/empty)`,
    skipped,
    ``,
    `### Ignored sections (lists)`,
    ignored,
    ``,
    `### Warnings`,
    warnings,
    END_REPORT_MARKER,
    '',
  ].join('\n');
}

function getCountryFolderFromPath(filePath: string): string {
  // .../content/atlas/<countryFolder>/<file>.md
  const parts = filePath.split(/[/\\]/);
  return (parts[parts.length - 2] ?? '').toLowerCase();
}

function mapCityEntityId(countryFolder: string, cityIdRaw: string, citySlugRaw?: string): { entityId: string; usedOverride: boolean } {
  const overrides = CITY_ID_OVERRIDES_BY_COUNTRY[countryFolder];
  const id = cityIdRaw.trim();
  const slug = (citySlugRaw ?? '').trim();
  if (!overrides) return { entityId: id, usedOverride: false };

  const byId = overrides[id];
  if (byId) return { entityId: byId, usedOverride: true };
  const bySlug = slug ? overrides[slug] : undefined;
  if (bySlug) return { entityId: bySlug, usedOverride: true };

  return { entityId: id, usedOverride: false };
}

async function parseFileToBlocks(filePath: string, stats: ParseStats, neonClient: Client | null): Promise<ExportBlock[]> {
  const raw = readFileSync(filePath, 'utf-8');
  const countryFolder = getCountryFolderFromPath(filePath);

  const { yaml, withoutFrontmatter } = extractFrontmatter(raw);
  if (!yaml) {
    stats.warnings.push({ code: 'YAML_MISSING', file: filePath });
    return [];
  }

  let meta: Record<string, string> = {};
  try {
    meta = parseYamlTopLevelScalars(yaml);
  } catch (e) {
    stats.warnings.push({
      code: 'YAML_INVALID',
      file: filePath,
      details: e instanceof Error ? e.message : String(e),
    });
    return [];
  }

  const entityRaw = (meta.entity ?? '').trim().toLowerCase();
  const entityType = (entityRaw === 'country' || entityRaw === 'city' ? entityRaw : null) as EntityType | null;
  const idRaw = (meta.id ?? '').trim();
  const slugRaw = (meta.slug ?? '').trim();
  const titleRaw = (meta.title ?? '').trim();
  const countryIdRaw = (meta.country_id ?? '').trim();

  if (!entityType || !idRaw) {
    stats.warnings.push({
      code: 'META_MISSING_REQUIRED',
      file: filePath,
      details: `required: entity in {country|city}, id. got entity="${meta.entity ?? ''}" id="${meta.id ?? ''}"`,
    });
    return [];
  }

  let entityId = idRaw;
  if (entityType === 'city') {
    const countryIdForDb = countryIdRaw || countryFolderToCountryIdFallback(countryFolder) || '';

    // Primary: resolve via Neon (if available)
    if (neonClient && countryIdForDb) {
      const res = await resolveCityId(neonClient, { countryId: countryIdForDb, mdId: idRaw, slug: slugRaw, title: titleRaw });
      if (res.ok) {
        entityId = res.cityId;
        stats.resolvedCities.push({
          file: filePath,
          countryId: countryIdForDb,
          mdId: idRaw,
          slug: slugRaw,
          title: titleRaw,
          resolvedCityId: res.cityId,
          strategy: res.strategy + (res.strategy === 'fuzzy' && res.fuzzyNote ? `:${res.fuzzyNote}` : ''),
        });
        if (res.strategy === 'fuzzy') {
          stats.warnings.push({
            code: 'CITY_ID_FUZZY_MATCH',
            file: filePath,
            details: `country_id=${countryIdForDb} md.id=${idRaw} slug=${slugRaw} title="${titleRaw}" -> ${res.cityId} (${res.fuzzyNote ?? ''})`,
          });
        }
      } else {
        // Fallback to overrides/meta.id
        const mapped = mapCityEntityId(countryFolder, idRaw, slugRaw);
        if (mapped.usedOverride) {
          entityId = mapped.entityId;
          stats.unresolvedCities.push({
            file: filePath,
            countryId: countryIdForDb,
            mdId: idRaw,
            slug: slugRaw,
            title: titleRaw,
            note: `FALLBACK OVERRIDE city -> ${mapped.entityId} (reason=${res.reason})`,
          });
        } else {
          entityId = idRaw;
          stats.unresolvedCities.push({
            file: filePath,
            countryId: countryIdForDb,
            mdId: idRaw,
            slug: slugRaw,
            title: titleRaw,
            note: `WARN UNRESOLVED city (no Neon match, no override; reason=${res.reason})`,
          });
          stats.warnings.push({
            code: 'CITY_ID_UNRESOLVED',
            file: filePath,
            details: `country_id=${countryIdForDb} md.id=${idRaw} slug=${slugRaw} title="${titleRaw}" reason=${res.reason}`,
          });
        }
      }
    } else {
      // No Neon client available: overrides-only fallback
      const mapped = mapCityEntityId(countryFolder, idRaw, slugRaw);
      entityId = mapped.entityId;
      const note = mapped.usedOverride
        ? `FALLBACK OVERRIDE city -> ${mapped.entityId} (no Neon connection)`
        : `WARN UNRESOLVED city (no Neon connection, no override)`;
      stats.unresolvedCities.push({
        file: filePath,
        countryId: countryIdForDb || '(unknown-country-id)',
        mdId: idRaw,
        slug: slugRaw,
        title: titleRaw,
        note,
      });
      if (!mapped.usedOverride) {
        stats.warnings.push({
          code: 'CITY_ID_UNRESOLVED',
          file: filePath,
          details: `no Neon connection; md.id=${idRaw} slug=${slugRaw} title="${titleRaw}"`,
        });
      }
    }
  }

  const sections = parseSections(withoutFrontmatter);
  const exported: ExportBlock[] = [];

  const sectionMap = new Map<string, { title: string; body: string }>();
  for (const s of sections) {
    sectionMap.set(normalizeTitle(s.title), s);
  }

  // Report unknown headers (only those that are not mapped or ignored).
  for (const s of sections) {
    const key = normalizeTitle(s.title);
    const mapped =
      entityType === 'country'
        ? COUNTRY_SECTION_TO_TABKEY[key] || (IGNORE_SECTIONS_COUNTRY.has(key) ? '__IGNORE__' : '')
        : CITY_SECTION_TO_TABKEY[key] || (IGNORE_SECTIONS_CITY.has(key) ? '__IGNORE__' : '');
    if (mapped === '__IGNORE__') {
      stats.ignoredSections.push({ file: filePath, entityType, sectionTitle: s.title });
      continue;
    }
    if (!mapped) {
      stats.warnings.push({ code: 'UNKNOWN_SECTION', file: filePath, entityType, sectionTitle: s.title });
    }
  }

  const mapping = entityType === 'country' ? COUNTRY_SECTION_TO_TABKEY : CITY_SECTION_TO_TABKEY;
  for (const [sectionTitleNorm, tabKey] of Object.entries(mapping)) {
    // Absolute rule: do NOT export list-tabs for country pages into content_blocks.
    if (entityType === 'country' && DENY_COUNTRY_TAB_KEYS.has(tabKey)) {
      stats.ignoredSections.push({
        file: filePath,
        entityType,
        sectionTitle: `IGNORED_SECTION_LIST(tab_key=${tabKey})`,
      });
      continue;
    }
    // Find matching section by normalized title
    const found = sectionMap.get(sectionTitleNorm);
    if (!found) {
      stats.skippedMissingOrEmpty.push({ file: filePath, entityType, tabKey, reason: 'missing' });
      continue;
    }
    const body = found.body.trim();
    if (!body) {
      stats.skippedMissingOrEmpty.push({ file: filePath, entityType, tabKey, reason: 'empty' });
      continue;
    }

    exported.push({
      entityType,
      entityId,
      tabKey,
      lang: 'ru',
      title: found.title || titleRaw || null,
      bodyMarkdown: body,
      source: 'seed',
      inputFile: filePath.replace(/\\/g, '/'),
      sectionTitle: found.title,
    });
  }

  return exported;
}

function ensureDir(p: string) {
  mkdirSync(p, { recursive: true });
}

async function main() {
  const repoRoot = join(process.cwd(), '..', '..');
  const contentRoot = join(repoRoot, 'content', 'atlas');
  const exportRoot = join(repoRoot, 'exports', 'neon');
  ensureDir(exportRoot);

  const generatedAtIso = new Date().toISOString();

  const neon = await maybeCreateNeonClient(repoRoot);
  const neonClient = neon.ok ? neon.client : null;

  const allFiles = walkFiles(contentRoot).filter((p) => isCountryFile(p) || isCityFile(p)).sort();
  const byCountryFolder = new Map<string, string[]>();
  for (const p of allFiles) {
    const countryFolder = getCountryFolderFromPath(p);
    if (!countryFolder) continue;
    const arr = byCountryFolder.get(countryFolder) ?? [];
    arr.push(p);
    byCountryFolder.set(countryFolder, arr);
  }

  const globalSummary: Array<{ countryFolder: string; files: number; blocks: number; warnings: number }> = [];

  for (const [countryFolder, files] of Array.from(byCountryFolder.entries()).sort(([a], [b]) => a.localeCompare(b))) {
    const stats: ParseStats = {
      processedFiles: 0,
      blocksCreated: 0,
      byEntityType: { country: 0, city: 0 },
      byTabKey: {},
      skippedMissingOrEmpty: [],
      ignoredSections: [],
      resolvedCities: [],
      unresolvedCities: [],
      resolverMode: neonClient ? 'neon' : 'fallback',
      warnings: [],
    };

    if (!neonClient) {
      stats.warnings.push({
        code: 'NEON_DB_DISABLED',
        file: `(countryFolder=${countryFolder})`,
        details: neon.ok ? 'Unknown' : neon.reason,
      });
    }

    const blocks: ExportBlock[] = [];
    for (const file of files) {
      stats.processedFiles += 1;
      const out = await parseFileToBlocks(file, stats, neonClient);
      blocks.push(...out);
    }

    for (const b of blocks) {
      stats.blocksCreated += 1;
      stats.byEntityType[b.entityType] = (stats.byEntityType[b.entityType] ?? 0) + 1;
      stats.byTabKey[b.tabKey] = (stats.byTabKey[b.tabKey] ?? 0) + 1;
    }

    const exportDir = join(exportRoot, countryFolder);
    ensureDir(exportDir);

    const sqlPath = join(exportDir, 'content_blocks.sql');
    const existingSql = existsSync(sqlPath) ? readFileSync(sqlPath, 'utf-8') : '-- Content Blocks UPSERT (idempotent)\n';
    const ourSqlBlock = renderSqlBlock(blocks, generatedAtIso);
    const nextSql = spliceMarkedBlock(existingSql, BEGIN_SQL_MARKER, END_SQL_MARKER, ourSqlBlock);
    writeFileSync(sqlPath, nextSql, 'utf-8');

    const reportPath = join(exportDir, 'PARSE_REPORT.md');
    const existingReport = existsSync(reportPath)
      ? readFileSync(reportPath, 'utf-8')
      : `# ${countryFolder.toUpperCase()} Parse Report\n\n`;
    const ourReportBlock = renderReportBlock(countryFolder, stats, generatedAtIso);
    const nextReport = spliceMarkedBlock(existingReport, BEGIN_REPORT_MARKER, END_REPORT_MARKER, ourReportBlock);
    writeFileSync(reportPath, nextReport, 'utf-8');

    globalSummary.push({ countryFolder, files: stats.processedFiles, blocks: stats.blocksCreated, warnings: stats.warnings.length });
  }

  if (neonClient) {
    try {
      await neonClient.end();
    } catch {
      // ignore
    }
  }

  const summaryLines = [
    'Atlas Country/City tabs export finished.',
    `Generated: ${generatedAtIso}`,
    neon.ok
      ? `Neon resolver: enabled (${neon.urlKind})`
      : `Neon resolver: disabled (${neon.reason})`,
    '',
    ...globalSummary.map((s) => `- ${s.countryFolder}: files=${s.files}, blocks=${s.blocks}, warnings=${s.warnings}`),
    '',
    `Total countries: ${globalSummary.length}`,
    `Total files: ${globalSummary.reduce((a, b) => a + b.files, 0)}`,
    `Total blocks: ${globalSummary.reduce((a, b) => a + b.blocks, 0)}`,
  ];
  // eslint-disable-next-line no-console
  console.log(summaryLines.join('\n'));
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Export failed:', err instanceof Error ? err.message : String(err));
  process.exitCode = 1;
});

